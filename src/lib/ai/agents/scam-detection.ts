import { RuleSignal } from '@/lib/rule-engine';

export interface ScamAgentResult {
  agentName: 'ScamDetectionAgent';
  hasScamLanguage: boolean;
  scoreContribution: number;
  detectedPatterns: string[];
  findings: string[];
}

export function runScamDetectionAgent(text: string, ruleSignals: RuleSignal[]): ScamAgentResult {
  const detectedPatterns: string[] = [];
  const findings: string[] = [];
  let score = 0;

  const scamRules = ruleSignals.filter((r) =>
    ['GUARANTEED_RETURN', 'UNREALISTIC_RETURN', 'URGENT_PAYMENT', 'ADVANCE_FEE_OR_PROCESSING_CHARGE', 'TELEGRAM_WHATSAPP_INSIDER_TIPS'].includes(r.signal)
  );

  for (const r of scamRules) {
    detectedPatterns.push(r.signal);
    findings.push(r.evidence);
    if (r.severity === 'CRITICAL') score += 35;
    else if (r.severity === 'HIGH') score += 25;
    else score += 10;
  }

  // Check additional linguistic markers for Ponzi / Multi-Level / task scams
  const taskScamRegex = /\b(?:like\s*youtube\s*videos?|telegram\s*task|rating\s*hotels?|daily\s*task\s*income|earn\s*from\s*home\s*part\s*time)\b/gi;
  if (taskScamRegex.test(text)) {
    detectedPatterns.push('PREPAID_TASK_SCAM');
    findings.push('Linguistic pattern matches known prepaid part-time review/task scam.');
    score += 25;
  }

  return {
    agentName: 'ScamDetectionAgent',
    hasScamLanguage: detectedPatterns.length > 0,
    scoreContribution: Math.min(score, 50),
    detectedPatterns,
    findings,
  };
}
