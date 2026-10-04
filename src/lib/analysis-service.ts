import { db } from './db';
import { detectAndRedactPII } from './pii';
import { orchestrator, OrchestratorInput } from './ai/orchestrator';
import { riskFusionEngine, FusionResult } from './risk-fusion';
import { getCurrentUser } from './auth';

export interface AnalysisResponseData {
  id: string;
  inputType: string;
  riskScore: number;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNCERTAIN';
  confidence: number;
  category: string;
  explanation: string;
  uncertainty: string;
  detectedRedFlags: string[];
  evidenceItems: any[];
  safeActions: string[];
  trustedSources: any[];
  threatIntelSummary: any;
  pipelineStages: any[];
  piiRedacted: boolean;
  processingTimeMs: number;
  createdAt: string;
}

export async function processAndSaveAnalysis(
  rawInput: string,
  inputType: OrchestratorInput['inputType'],
  sourceUrl?: string
): Promise<AnalysisResponseData> {
  const startTime = Date.now();

  // 1. PII Redaction
  const piiResult = detectAndRedactPII(rawInput);
  const cleanContent = piiResult.redactedText;

  // 2. Multi-Agent Orchestration
  const orchResult = await orchestrator.orchestrate({
    inputType,
    content: cleanContent,
    sourceUrl,
  });

  // 3. Risk Fusion
  const fusionResult: FusionResult = riskFusionEngine.fuse(orchResult);

  // 4. Check Current User Session
  const currentUser = await getCurrentUser();

  const processingTimeMs = Date.now() - startTime;

  // 5. Persist to Database
  let savedRecordId = `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  try {
    const record = await db.analysisRecord.create({
      data: {
        userId: currentUser?.id || null,
        inputType,
        sanitizedMetadata: JSON.stringify({
          length: cleanContent.length,
          hasPii: piiResult.hasPII,
          piiTypes: piiResult.detectedTypes,
        }),
        riskScore: fusionResult.riskScore,
        riskLevel: fusionResult.riskLevel,
        confidence: fusionResult.confidence,
        category: fusionResult.category,
        explanation: fusionResult.explanation,
        uncertainty: fusionResult.uncertainty,
        detectedRedFlags: JSON.stringify(fusionResult.detectedRedFlags),
        evidenceItems: JSON.stringify(fusionResult.evidenceItems),
        safeActions: JSON.stringify(fusionResult.safeActions),
        trustedSources: JSON.stringify(fusionResult.trustedSources),
        threatIntelStatus: JSON.stringify(fusionResult.threatIntelSummary),
        language: 'en',
        processingTimeMs,
      },
    });
    savedRecordId = record.id;

    // Save individual signals for audit & knowledge graph linkage
    if (fusionResult.signals.length > 0) {
      await db.riskSignal.createMany({
        data: fusionResult.signals.map((sig) => ({
          analysisId: record.id,
          signalCode: sig.code,
          severity: sig.severity,
          evidence: sig.evidence,
          confidence: 0.9,
          source: sig.source,
        })),
      });
    }

    // Record audit event
    await db.auditEvent.create({
      data: {
        userId: currentUser?.id || null,
        action: 'ANALYSIS_RUN',
        details: JSON.stringify({
          recordId: record.id,
          riskLevel: fusionResult.riskLevel,
          inputType,
        }),
      },
    });
  } catch (err) {
    console.warn('Analysis record persistence notice:', err);
  }

  return {
    id: savedRecordId,
    inputType,
    riskScore: fusionResult.riskScore,
    riskLevel: fusionResult.riskLevel,
    confidence: fusionResult.confidence,
    category: fusionResult.category,
    explanation: fusionResult.explanation,
    uncertainty: fusionResult.uncertainty,
    detectedRedFlags: fusionResult.detectedRedFlags,
    evidenceItems: fusionResult.evidenceItems,
    safeActions: fusionResult.safeActions,
    trustedSources: fusionResult.trustedSources,
    threatIntelSummary: fusionResult.threatIntelSummary,
    pipelineStages: orchResult.pipelineStages,
    piiRedacted: piiResult.hasPII,
    processingTimeMs,
    createdAt: new Date().toISOString(),
  };
}
