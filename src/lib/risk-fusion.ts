import { OrchestrationResult } from './ai/orchestrator';

export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'UNCERTAIN';

export interface RiskFusionWeights {
  ruleEngineWeight: number;    // default 0.35
  urlThreatWeight: number;     // default 0.25
  agentScamWeight: number;     // default 0.20
  impersonationWeight: number; // default 0.15
  claimRefutationWeight: number; // default 0.05
}

export interface FusionResult {
  riskLevel: RiskLevel;
  riskScore: number; // 0 - 100
  confidence: number; // 0.0 - 1.0
  category: string;
  scoreLabel: string;
  detectedRedFlags: string[];
  signals: Array<{
    code: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    source: string;
    evidence: string;
  }>;
  evidenceItems: Array<{
    title: string;
    details: string;
    severity: string;
  }>;
  safeActions: string[];
  explanation: string;
  uncertainty: string;
  trustedSources: any[];
  threatIntelSummary: {
    virusTotalStatus: string;
    googleWebRiskStatus: string;
    flaggedUrlsCount: number;
  };
}

export const DEFAULT_FUSION_WEIGHTS: RiskFusionWeights = {
  ruleEngineWeight: 0.35,
  urlThreatWeight: 0.25,
  agentScamWeight: 0.20,
  impersonationWeight: 0.15,
  claimRefutationWeight: 0.05,
};

export class RiskFusionEngine {
  private weights: RiskFusionWeights;

  constructor(customWeights?: Partial<RiskFusionWeights>) {
    this.weights = { ...DEFAULT_FUSION_WEIGHTS, ...customWeights };
  }

  public fuse(orch: OrchestrationResult): FusionResult {
    // 1. Calculate Rule Component Score (0 - 100)
    let ruleScore = 0;
    const criticalRules = orch.ruleSignals.filter((r) => r.severity === 'CRITICAL');
    const highRules = orch.ruleSignals.filter((r) => r.severity === 'HIGH');
    const medRules = orch.ruleSignals.filter((r) => r.severity === 'MEDIUM');

    if (criticalRules.length > 0) {
      ruleScore = Math.min(100, 60 + criticalRules.length * 15 + highRules.length * 10);
    } else if (highRules.length > 0) {
      ruleScore = Math.min(85, 40 + highRules.length * 15 + medRules.length * 5);
    } else if (medRules.length > 0) {
      ruleScore = Math.min(50, 20 + medRules.length * 10);
    }

    // 2. Calculate URL Threat Component Score (0 - 100)
    let urlScore = 0;
    let flaggedUrlsCount = 0;
    for (const urlRes of orch.urlAnalyses) {
      if (urlRes.brandImpersonationDetected) {
        urlScore = Math.max(urlScore, 90);
        flaggedUrlsCount++;
      }
      if (urlRes.threatIntel.virusTotal.positives && urlRes.threatIntel.virusTotal.positives > 0) {
        urlScore = Math.max(urlScore, 95);
        flaggedUrlsCount++;
      }
      if (urlRes.isSuspiciousTLD || urlRes.isPunycode) {
        urlScore = Math.max(urlScore, 65);
        flaggedUrlsCount++;
      }
      if (urlRes.phishingKeywordsFound.length > 0) {
        urlScore = Math.max(urlScore, 50);
        flaggedUrlsCount++;
      }
    }

    // 3. Scam Agent Component Score (0 - 100)
    const scamAgentScore = orch.scamAgent.hasScamLanguage
      ? Math.min(100, orch.scamAgent.scoreContribution * 2)
      : 0;

    // 4. Impersonation Component Score (0 - 100)
    const impersonationScore = orch.impersonationAgent.impersonationDetected ? 90 : 0;

    // 5. Claim Refutation Component Score (0 - 100)
    const claimScore = orch.claimAgent.refutedClaims.length > 0 ? 85 : 0;

    // Weighted Heuristic Summation
    let combinedScore =
      ruleScore * this.weights.ruleEngineWeight +
      urlScore * this.weights.urlThreatWeight +
      scamAgentScore * this.weights.agentScamWeight +
      impersonationScore * this.weights.impersonationWeight +
      claimScore * this.weights.claimRefutationWeight;

    // Hard Override: If any CRITICAL rule (e.g. OTP Request, Digital Arrest) or Verified Malicious URL occurs, floor the risk score at 82
    const hasCriticalFinding =
      criticalRules.length > 0 ||
      orch.urlAnalyses.some((u) => u.brandImpersonationDetected || (u.threatIntel.virusTotal.positives && u.threatIntel.virusTotal.positives > 0));

    if (hasCriticalFinding && combinedScore < 80) {
      combinedScore = Math.max(combinedScore, 82);
    }

    // Clamp score to 0 - 100 integer
    const finalScore = Math.max(0, Math.min(100, Math.round(combinedScore)));

    // Categorization
    let riskLevel: RiskLevel;
    if (finalScore >= 70) {
      riskLevel = 'HIGH';
    } else if (finalScore >= 40) {
      riskLevel = 'MEDIUM';
    } else if (finalScore <= 15 && orch.sanitizedText.length >= 20) {
      riskLevel = 'LOW';
    } else {
      riskLevel = 'UNCERTAIN';
    }

    // Confidence Calculation (0.0 - 1.0)
    let confidence = 0.75;
    if (hasCriticalFinding || orch.ragSources.length > 0) {
      confidence = 0.92;
    } else if (orch.sanitizedText.length < 25) {
      confidence = 0.55;
    }

    // Determine specific Category
    let category = 'Unverified Solicitation';
    if (impersonationScore > 50) {
      category = `Impersonation of ${orch.impersonationAgent.impersonatedEntity || 'Financial Authority'}`;
    } else if (urlScore >= 65 || orch.phishingAgent.isPhishingSuspected) {
      category = 'Phishing / Malicious Domain Scheme';
    } else if (criticalRules.some((r) => r.signal === 'DIGITAL_ARREST_OR_POLICE_THREAT')) {
      category = 'Digital Arrest & Coercive Extortion';
    } else if (criticalRules.some((r) => r.signal === 'OTP_REQUEST' || r.signal === 'PASSWORD_REQUEST')) {
      category = 'Credential Harvesting & Unauthorized Access';
    } else if (scamAgentScore >= 50 || criticalRules.some((r) => r.signal === 'GUARANTEED_RETURN' || r.signal === 'UNREALISTIC_RETURN')) {
      category = 'Fraudulent High-Yield Investment Scam';
    } else if (riskLevel === 'LOW') {
      category = 'Benign Informational Content';
    }

    // Signals collection for audit
    const signals = orch.ruleSignals.map((r) => ({
      code: r.signal,
      severity: r.severity,
      source: 'RULE_ENGINE',
      evidence: r.evidence,
    }));

    return {
      riskLevel,
      riskScore: finalScore,
      confidence,
      category,
      scoreLabel: 'Risk Score — heuristic assessment',
      detectedRedFlags: orch.explanation.detectedRedFlags,
      signals,
      evidenceItems: orch.explanation.evidenceList,
      safeActions: orch.explanation.safeActions,
      explanation: orch.explanation.summaryExplanation,
      uncertainty: orch.explanation.uncertaintyStatement,
      trustedSources: orch.ragSources,
      threatIntelSummary: {
        virusTotalStatus: orch.urlAnalyses[0]?.threatIntel?.virusTotal?.status || 'NOT_CONFIGURED',
        googleWebRiskStatus: orch.urlAnalyses[0]?.threatIntel?.googleWebRisk?.status || 'NOT_CONFIGURED',
        flaggedUrlsCount,
      },
    };
  }
}

export const riskFusionEngine = new RiskFusionEngine();
