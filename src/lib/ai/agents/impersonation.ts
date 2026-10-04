export interface ImpersonationResult {
  agentName: 'ImpersonationAgent';
  impersonationDetected: boolean;
  impersonatedEntity: string | null;
  evidence: string;
  confidence: number;
}

const REGULATOR_PATTERNS = [
  { name: 'Securities and Exchange Board of India (SEBI)', regex: /\b(?:sebi|sebi\s*official|sebi\s*certified)\b/gi },
  { name: 'Reserve Bank of India (RBI)', regex: /\b(?:rbi|reserve\s*bank\s*of\s*india)\b/gi },
  { name: 'National Cyber Crime Reporting Portal / CBI / Police', regex: /\b(?:cbi|cyber\s*cell|delhi\s*police|mumbai\s*police|digital\s*arrest)\b/gi },
  { name: 'Income Tax Department', regex: /\b(?:income\s*tax\s*department|it\s*refund)\b/gi },
  { name: 'State Bank of India (SBI)', regex: /\b(?:sbi|state\s*bank\s*of\s*india|yono\s*sbi)\b/gi },
  { name: 'HDFC Bank', regex: /\b(?:hdfc|hdfc\s*bank)\b/gi },
  { name: 'ICICI Bank', regex: /\b(?:icici|icici\s*bank)\b/gi },
];

export function runImpersonationAgent(
  text: string,
  extractedDomains: string[]
): ImpersonationResult {
  for (const { name, regex } of REGULATOR_PATTERNS) {
    if (regex.test(text)) {
      // Check if official domain is present
      const officialDomains: Record<string, string[]> = {
        'Securities and Exchange Board of India (SEBI)': ['sebi.gov.in'],
        'Reserve Bank of India (RBI)': ['rbi.org.in'],
        'National Cyber Crime Reporting Portal / CBI / Police': ['cybercrime.gov.in', 'gov.in', 'nic.in'],
        'Income Tax Department': ['incometax.gov.in'],
        'State Bank of India (SBI)': ['sbi.co.in', 'onlinesbi.sbi'],
        'HDFC Bank': ['hdfcbank.com'],
        'ICICI Bank': ['icicibank.com'],
      };

      const allowedDomains = officialDomains[name] || [];
      const hasOfficialDomain = extractedDomains.some((d) =>
        allowedDomains.some((legit) => d === legit || d.endsWith('.' + legit))
      );

      // If claim mentions authority, but sender uses informal channels or non-official domain
      if (extractedDomains.length > 0 && !hasOfficialDomain) {
        return {
          agentName: 'ImpersonationAgent',
          impersonationDetected: true,
          impersonatedEntity: name,
          evidence: `Mentions ${name} while directing to unverified non-official domain(s): ${extractedDomains.join(', ')}`,
          confidence: 0.85,
        };
      }

      // If message claims authority endorsement inside a chat / WhatsApp context
      const chatContextRegex = /\b(?:telegram|whatsapp|inbox|dm|admin|vip\s*group)\b/gi;
      if (chatContextRegex.test(text)) {
        return {
          agentName: 'ImpersonationAgent',
          impersonationDetected: true,
          impersonatedEntity: name,
          evidence: `Claims endorsement by ${name} within unofficial messaging channel (Telegram/WhatsApp). Official authorities never conduct business via private chat groups.`,
          confidence: 0.88,
        };
      }
    }
  }

  return {
    agentName: 'ImpersonationAgent',
    impersonationDetected: false,
    impersonatedEntity: null,
    evidence: 'No conclusive entity impersonation detected based on visible evidence.',
    confidence: 0.5,
  };
}
