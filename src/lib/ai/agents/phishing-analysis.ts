import { URLAnalysisResult } from '@/lib/url-engine';

export interface PhishingAgentResult {
  agentName: 'PhishingAnalysisAgent';
  isPhishingSuspected: boolean;
  scoreContribution: number;
  indicators: string[];
}

export function runPhishingAnalysisAgent(urlAnalyses: URLAnalysisResult[], text: string): PhishingAgentResult {
  const indicators: string[] = [];
  let score = 0;

  for (const urlRes of urlAnalyses) {
    if (!urlRes.isValid) continue;

    if (urlRes.brandImpersonationDetected) {
      indicators.push(`Lookalike domain targeting ${urlRes.brandImpersonationDetected}: ${urlRes.domain}`);
      score += 40;
    }

    if (urlRes.isSuspiciousTLD) {
      indicators.push(`Suspicious high-risk top-level domain: .${urlRes.tld}`);
      score += 20;
    }

    if (urlRes.isPunycode) {
      indicators.push(`Punycode/homograph domain obfuscation: ${urlRes.domain}`);
      score += 30;
    }

    if (urlRes.phishingKeywordsFound.length > 0) {
      indicators.push(`Credential/banking harvesting paths: ${urlRes.phishingKeywordsFound.join(', ')}`);
      score += 15;
    }

    if (urlRes.threatIntel.virusTotal.positives && urlRes.threatIntel.virusTotal.positives > 0) {
      indicators.push(`Threat intelligence vendor detection: ${urlRes.threatIntel.virusTotal.positives} scanners flagged`);
      score += 50;
    }
  }

  // Check text for credential harvesting prompts
  const credentialPromptRegex = /\b(?:enter|update|verify)\s+(?:pan|aadhaar|debit\s*card|atm\s*pin|netbanking\s*password)\b/gi;
  if (credentialPromptRegex.test(text)) {
    indicators.push('Solicitation of sensitive banking credentials alongside unverified link.');
    score += 30;
  }

  return {
    agentName: 'PhishingAnalysisAgent',
    isPhishingSuspected: indicators.length > 0,
    scoreContribution: Math.min(score, 50),
    indicators,
  };
}
