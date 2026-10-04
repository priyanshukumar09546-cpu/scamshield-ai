import { RuleSignal } from '@/lib/rule-engine';
import { URLAnalysisResult } from '@/lib/url-engine';
import { TrustedSourceItem } from '@/lib/rag';
import { ImpersonationResult } from './impersonation';
import { ClaimVerificationResult } from './claim-verification';

export interface ExplanationAgentResult {
  agentName: 'RiskExplanationAgent';
  summaryExplanation: string;
  detectedRedFlags: string[];
  evidenceList: Array<{
    title: string;
    details: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  }>;
  safeActions: string[];
  uncertaintyStatement: string;
}

export function runRiskExplanationAgent(
  ruleSignals: RuleSignal[],
  urlAnalyses: URLAnalysisResult[],
  impersonation: ImpersonationResult,
  claimVerification: ClaimVerificationResult,
  ragSources: TrustedSourceItem[],
  aiExplanationOverride?: string
): ExplanationAgentResult {
  const detectedRedFlags: string[] = [];
  const evidenceList: ExplanationAgentResult['evidenceList'] = [];
  const safeActions: string[] = [];

  // 1. Process Rule Engine Signals
  for (const sig of ruleSignals) {
    let flagTitle = sig.signal.replace(/_/g, ' ');
    if (sig.signal === 'GUARANTEED_RETURN') flagTitle = 'Guaranteed Returns Promise';
    if (sig.signal === 'UNREALISTIC_RETURN') flagTitle = 'Unrealistic ROI Multiplier';
    if (sig.signal === 'OTP_REQUEST') flagTitle = 'OTP Solicitation Request';
    if (sig.signal === 'PASSWORD_REQUEST') flagTitle = 'Direct Password / PIN Solicitation';
    if (sig.signal === 'URGENT_PAYMENT') flagTitle = 'High Pressure Urgency Tactics';
    if (sig.signal === 'FAKE_AUTHORITY_CLAIM') flagTitle = 'Suspicious Authority Endorsement';
    if (sig.signal === 'DIGITAL_ARREST_OR_POLICE_THREAT') flagTitle = 'Digital Arrest & Coercive Extortion';

    detectedRedFlags.push(flagTitle);
    evidenceList.push({
      title: flagTitle,
      details: sig.evidence,
      severity: sig.severity,
    });
  }

  // 2. Process URL signals
  for (const urlRes of urlAnalyses) {
    if (urlRes.brandImpersonationDetected) {
      const title = `Lookalike Domain (${urlRes.brandImpersonationDetected})`;
      detectedRedFlags.push(title);
      evidenceList.push({
        title,
        details: `Domain '${urlRes.domain}' impersonates '${urlRes.brandImpersonationDetected}' without legitimate registration.`,
        severity: 'CRITICAL',
      });
    }

    if (urlRes.isSuspiciousTLD) {
      detectedRedFlags.push(`High-Risk Domain Extension (.${urlRes.tld})`);
      evidenceList.push({
        title: `High-Risk TLD (.${urlRes.tld})`,
        details: `Domain '${urlRes.domain}' uses top-level domain frequently associated with disposable scam websites.`,
        severity: 'HIGH',
      });
    }

    if (urlRes.phishingKeywordsFound.length > 0) {
      evidenceList.push({
        title: 'Phishing Pathway Keywords',
        details: `URL path targets: ${urlRes.phishingKeywordsFound.join(', ')}`,
        severity: 'HIGH',
      });
    }
  }

  // 3. Process Impersonation signals
  if (impersonation.impersonationDetected && impersonation.impersonatedEntity) {
    detectedRedFlags.push(`Impersonation of ${impersonation.impersonatedEntity}`);
    evidenceList.push({
      title: `Impersonation Detected: ${impersonation.impersonatedEntity}`,
      details: impersonation.evidence,
      severity: 'CRITICAL',
    });
  }

  // 4. Generate Safe Actions
  if (detectedRedFlags.length > 0) {
    safeActions.push('Do NOT transfer any money or make advance deposits.');
    safeActions.push('Never share OTP, UPI PIN, ATM PIN, or banking passwords.');
    safeActions.push('Do NOT click unknown links or install APK / screen-sharing software (e.g. AnyDesk).');
    safeActions.push('Cross-verify through official regulatory portals (sebi.gov.in / rbi.org.in).');
    safeActions.push('If victimized, immediately call National Cyber Crime Helpline 1930 within the golden hour.');
  } else {
    safeActions.push('Always confirm sender identity before opening external attachments.');
    safeActions.push('Check the official domain in browser address bar before entering credentials.');
    safeActions.push('Keep multi-factor authentication (MFA) enabled on all financial accounts.');
  }

  // Deduplicate red flags
  const uniqueRedFlags = Array.from(new Set(detectedRedFlags));

  // Determine synthesis explanation
  let summaryExplanation = aiExplanationOverride || '';
  if (!summaryExplanation) {
    if (uniqueRedFlags.length >= 2 || evidenceList.some((e) => e.severity === 'CRITICAL')) {
      summaryExplanation = `The analyzed content exhibits multiple critical fraud signals characteristic of financial investment scams or phishing traps. It employs psychological pressure, promises unrealistic or guaranteed returns forbidden by regulatory authorities, or directs the recipient to suspicious unauthenticated web destinations.`;
    } else if (uniqueRedFlags.length === 1) {
      summaryExplanation = `The content contains suspicious characteristics that warrant caution. An atypical solicitation or financial claim was identified, though evidence remains limited.`;
    } else {
      summaryExplanation = `No overt scam signatures, phishing URLs, or prohibited guaranteed-return claims were detected in the analyzed material. Continue to maintain vigilance when processing financial transactions.`;
    }
  }

  const uncertaintyStatement =
    ragSources.length === 0
      ? 'Unable to verify this specific entity claim against indexed regulatory registries. Assessment is based on heuristic linguistic and network indicators.'
      : 'Assessment represents an automated technical evaluation of visible signals. It does not replace formal regulatory audits.';

  return {
    agentName: 'RiskExplanationAgent',
    summaryExplanation,
    detectedRedFlags: uniqueRedFlags,
    evidenceList,
    safeActions,
    uncertaintyStatement,
  };
}
