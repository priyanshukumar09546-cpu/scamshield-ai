import { defaultRuleEngine, RuleSignal } from '@/lib/rule-engine';
import { extractUrlsFromText, analyzeUrl, URLAnalysisResult } from '@/lib/url-engine';
import { queryAuthoritativeRAG, TrustedSourceItem } from '@/lib/rag';
import { knowledgeGraph, GraphSignal } from '@/lib/knowledge-graph';
import { geminiProvider } from './gemini-client';
import { runScamDetectionAgent, ScamAgentResult } from './agents/scam-detection';
import { runPhishingAnalysisAgent, PhishingAgentResult } from './agents/phishing-analysis';
import { runImpersonationAgent, ImpersonationResult } from './agents/impersonation';
import { runClaimVerificationAgent, ClaimVerificationResult } from './agents/claim-verification';
import { runRiskExplanationAgent, ExplanationAgentResult } from './agents/risk-explanation';
import { officialVerificationEngine, OfficialVerificationResult } from '@/lib/official-verification';

export interface PipelineStageEvent {
  stage: string;
  description: string;
  timestamp: number;
}

export interface OrchestratorInput {
  inputType: 'TEXT' | 'SCREENSHOT' | 'URL' | 'DOCUMENT' | 'VOICE';
  content: string;
  sourceUrl?: string;
  language?: string;
}

export interface OrchestrationResult {
  inputType: string;
  sanitizedText: string;
  extractedUrls: string[];
  urlAnalyses: URLAnalysisResult[];
  ruleSignals: RuleSignal[];
  scamAgent: ScamAgentResult;
  phishingAgent: PhishingAgentResult;
  impersonationAgent: ImpersonationResult;
  claimAgent: ClaimVerificationResult;
  officialVerification: OfficialVerificationResult;
  graphSignals: GraphSignal[];
  ragSources: TrustedSourceItem[];
  explanation: ExplanationAgentResult;
  aiRawResponse: any | null;
  pipelineStages: PipelineStageEvent[];
  timingMs: number;
}

export class AIAgentOrchestrator {
  public async orchestrate(input: OrchestratorInput): Promise<OrchestrationResult> {
    const startTime = Date.now();
    const stages: PipelineStageEvent[] = [];

    const recordStage = (stage: string, description: string) => {
      stages.push({ stage, description, timestamp: Date.now() });
    };

    recordStage('EXTRACTING_CONTENT', 'Parsing sanitized multimodal input stream');

    // 1. URL Extraction from content
    const textUrls = extractUrlsFromText(input.content);
    if (input.sourceUrl && !textUrls.includes(input.sourceUrl)) {
      textUrls.unshift(input.sourceUrl);
    }

    recordStage('CHECKING_URLS', `Inspecting ${textUrls.length} detected web reference(s)`);

    // 2. Parallel URL Threat Intelligence Inspection
    const urlAnalyses: URLAnalysisResult[] = await Promise.all(
      textUrls.map((u) => analyzeUrl(u))
    );

    recordStage('EVALUATING_RULES', 'Executing deterministic financial safety rule engine');

    // 3. Rule Engine Execution
    const ruleSignals = defaultRuleEngine.evaluate(input.content);

    // Also inject URL-derived signals into rule signals
    for (const urlRes of urlAnalyses) {
      for (const sig of urlRes.signals) {
        ruleSignals.push({
          signal: sig.code,
          severity: sig.severity,
          evidence: sig.description,
          confidence: 0.9,
          category: 'PHISHING_OR_NETWORK_RISK',
        });
      }
    }

    recordStage('RETRIEVING_RAG', 'Querying authoritative regulatory corpus (SEBI/RBI/1930)');

    // 4. Parallel Knowledge Retrieval & Graph Queries
    const extractedDomains = urlAnalyses.map((u) => u.domain).filter(Boolean);
    const [ragSources, graphSignals] = await Promise.all([
      queryAuthoritativeRAG(input.content, 3),
      knowledgeGraph.queryGraphForMatches(extractedDomains, [], []),
    ]);

    recordStage('RUNNING_AGENTS', 'Orchestrating specialized AI agents in parallel');

    // 5. Specialized Agents in Parallel
    const scamAgent = runScamDetectionAgent(input.content, ruleSignals);
    const phishingAgent = runPhishingAnalysisAgent(urlAnalyses, input.content);
    const impersonationAgent = runImpersonationAgent(input.content, extractedDomains);
    const claimAgent = runClaimVerificationAgent(input.content, ragSources);

    recordStage('OFFICIAL_VERIFICATION', 'Verifying claims against statutory SEBI / RBI / NCRP registries');
    const officialVerification = officialVerificationEngine.verifyContent(input.content, extractedDomains);

    // 6. Gemini Multimodal / Reasoning Call if configured
    let aiResponse = null;
    if (geminiProvider.isAvailable()) {
      recordStage('CALLING_AI_MODEL', 'Executing Gemini analytical model with structured JSON schema');
      const systemPrompt = `You are ScamShield AI, an authoritative investor protection agent for Indian financial markets.
Strict rules:
1. NEVER give investment recommendations (no buy/sell/hold).
2. Flag guaranteed returns, pressure tactics, impersonation of SEBI/RBI/Banks, and phishing.
3. Keep tone objective, transparent, and protective.`;

      aiResponse = await geminiProvider.analyzeContent(systemPrompt, input.content, textUrls);
    } else {
      recordStage('AI_HEURISTIC_ACTIVE', 'Gemini API unconfigured; executing local deterministic agent suite');
    }

    recordStage('GENERATING_EXPLANATION', 'Synthesizing human-readable explanation and red flags');

    // 7. Synthesize Explanations & Evidence
    const explanation = runRiskExplanationAgent(
      ruleSignals,
      urlAnalyses,
      impersonationAgent,
      claimAgent,
      ragSources,
      aiResponse?.explanation
    );

    recordStage('FINALIZING_ASSESSMENT', 'Pipeline completed successfully');

    return {
      inputType: input.inputType,
      sanitizedText: input.content,
      extractedUrls: textUrls,
      urlAnalyses,
      ruleSignals,
      scamAgent,
      phishingAgent,
      impersonationAgent,
      claimAgent,
      officialVerification,
      graphSignals,
      ragSources,
      explanation,
      aiRawResponse: aiResponse,
      pipelineStages: stages,
      timingMs: Date.now() - startTime,
    };
  }
}

export const orchestrator = new AIAgentOrchestrator();
