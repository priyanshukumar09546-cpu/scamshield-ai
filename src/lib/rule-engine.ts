/**
 * Deterministic Safety Rule Engine for Financial Scams
 * Scans content for statutory red flags defined by SEBI, RBI, and CERT-In advisories
 */

export interface RuleSignal {
  signal: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  evidence: string;
  confidence: number; // 0.0 - 1.0
  category: string;
}

export interface RuleDefinition {
  code: string;
  name: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  defaultConfidence: number;
  patterns: RegExp[];
  extractEvidence: (match: RegExpMatchArray, text: string) => string;
}

export const FINANCIAL_SAFETY_RULES: RuleDefinition[] = [
  {
    code: 'GUARANTEED_RETURN',
    name: 'Guaranteed or Assured Returns Claim',
    severity: 'CRITICAL',
    category: 'INVESTMENT_FRAUD',
    defaultConfidence: 0.95,
    patterns: [
      /\b(?:100%|guaranteed|assured|risk[- ]?free|fixed)\s+(?:(?:rs\.?|inr|₹)?\s*[\d,]+\s+)?(?:daily|monthly|weekly|annual|returns?|profit|income|payout)\b/gi,
      /\b(?:guaranteed|assured)\s+(?:[\w₹,]+\s+){0,3}(?:returns?|profit|income|payout)\b/gi,
      /\b(?:returns?|profit)\s+(?:is|are)?\s*(?:100%|guaranteed|assured|100%\s*sure)\b/gi,
      /\b(?:pucka|pakka|sure shot)\s+(?:return|profit|gain)\b/gi,
    ],
    extractEvidence: (match) => `Promised guaranteed returns: "${match[0]}"`,
  },
  {
    code: 'UNREALISTIC_RETURN',
    name: 'Absurd or Unrealistic ROI Multiplier',
    severity: 'CRITICAL',
    category: 'INVESTMENT_FRAUD',
    defaultConfidence: 0.92,
    patterns: [
      /\b(?:double|triple|2x|3x|5x|10x|100x)\s+(?:your\s+)?(?:money|capital|investment|cash)\b/gi,
      /\b(?:invest\s+(?:rs\.?|inr|₹)?\s*[\d,]+.*(?:get|earn)\s+(?:rs\.?|inr|₹)?\s*[\d,]+)\b/gi,
      /\b(?:(?:rs\.?|inr|₹)?\s*[\d,]+\s+returns?\s+(?:from|on|for)\s+(?:rs\.?|inr|₹)?\s*[\d,]+)\b/gi,
      /\b(?:earn|profit|return\s*of)\s*(?:[3-9]\d|\d{3,})%\s*(?:daily|weekly|per\s*day|monthly)\b/gi,
    ],
    extractEvidence: (match) => `Unrealistic return multiplier: "${match[0]}"`,
  },
  {
    code: 'OTP_REQUEST',
    name: 'Direct Solicitation of One-Time Password (OTP)',
    severity: 'CRITICAL',
    category: 'CREDENTIAL_HARVESTING',
    defaultConfidence: 0.98,
    patterns: [
      /\b(?:share|send|enter|provide|tell|forward)\s+(?:your\s+)?(?:otp|one\s*time\s*password)\b/gi,
      /\b(?:otp|one\s*time\s*password)\s+(?:bhejo|mangwao|do|dalo)\b/gi,
    ],
    extractEvidence: (match) => `Urgent request for secret OTP: "${match[0]}"`,
  },
  {
    code: 'PASSWORD_REQUEST',
    name: 'Solicitation of Banking Password or MPIN',
    severity: 'CRITICAL',
    category: 'CREDENTIAL_HARVESTING',
    defaultConfidence: 0.98,
    patterns: [
      /\b(?:share|enter|send|update)\s+(?:your\s+)?(?:password|mpin|upi\s*pin|atm\s*pin|cvv|pin)\b/gi,
      /\b(?:upi\s*pin|mpin)\s+(?:enter\s*kare|bheje|share\s*kare)\b/gi,
    ],
    extractEvidence: (match) => `Direct solicitation of credential: "${match[0]}"`,
  },
  {
    code: 'URGENT_PAYMENT',
    name: 'High-Pressure Urgency to Transfer Funds',
    severity: 'HIGH',
    category: 'SOCIAL_ENGINEERING',
    defaultConfidence: 0.88,
    patterns: [
      /\b(?:act\s*now|hurry\s*up|limited\s*time|only\s*\d+\s*(?:slots?|minutes?|hours?)\s*left|expires\s*(?:in|today|now))\b/gi,
      /\b(?:transfer|deposit|pay)\s*(?:immediately|urgent|right\s*now|within\s*\d+\s*(?:mins?|hours?))\b/gi,
      /\b(?:last\s*chance\s*to\s*invest|offer\s*closing\s*soon)\b/gi,
    ],
    extractEvidence: (match) => `High pressure urgency cue: "${match[0]}"`,
  },
  {
    code: 'ADVANCE_FEE_OR_PROCESSING_CHARGE',
    name: 'Advance Upfront Fee for Releasing Funds/Lottery',
    severity: 'HIGH',
    category: 'ADVANCE_FEE_FRAUD',
    defaultConfidence: 0.90,
    patterns: [
      /\b(?:pay|deposit)\s+(?:advance|processing|registration|tax|clearance|release)\s+(?:fee|charge|amount)\s+(?:to\s+receive|to\s+claim|before\s+withdrawal)\b/gi,
      /\b(?:unlock|withdraw)\s+(?:your\s+)?(?:funds?|bonus|prize|profit)\s+(?:by\s+paying|after\s+paying)\b/gi,
    ],
    extractEvidence: (match) => `Upfront advance-fee requirement: "${match[0]}"`,
  },
  {
    code: 'FAKE_AUTHORITY_CLAIM',
    name: 'Unverified Claim of Regulatory Endorsement (SEBI/RBI)',
    severity: 'HIGH',
    category: 'IMPERSONATION',
    defaultConfidence: 0.85,
    patterns: [
      /\b(?:100%|strictly|officially)?\s*(?:sebi|rbi|irda|govt|government)\s*(?:approved|certified|licensed|registered|guaranteed)\s*(?:scheme|telegram|channel|group|bot)\b/gi,
      /\b(?:registered\s+with\s+sebi\s+under\s+secret|govt\s+authorized\s+crypto)\b/gi,
    ],
    extractEvidence: (match) => `Suspicious regulatory endorsement claim: "${match[0]}"`,
  },
  {
    code: 'DIGITAL_ARREST_OR_POLICE_THREAT',
    name: 'Coercive Threat of Legal Action, FIR, or Digital Arrest',
    severity: 'CRITICAL',
    category: 'DIGITAL_EXTORTION',
    defaultConfidence: 0.95,
    patterns: [
      /\b(?:digital\s*arrest|cbi|ed|narcotics|customs|cyber\s*crime\s*police)\b.*\b(?:warrant|arrest|fir|court\s*order|case\s*filed)\b/gi,
      /\b(?:sim\s*block|account\s*frozen|call\s*disconnect)\b.*\b(?:within\s*\d+\s*(?:hours?|minutes?)|pay\s*fine)\b/gi,
    ],
    extractEvidence: (match) => `Coercive threat/digital arrest impersonation: "${match[0]}"`,
  },
  {
    code: 'TELEGRAM_WHATSAPP_INSIDER_TIPS',
    name: 'Unsolicited VIP Stock Tips on Messaging Groups',
    severity: 'HIGH',
    category: 'MARKET_MANIPULATION',
    defaultConfidence: 0.88,
    patterns: [
      /\b(?:join\s*(?:vip|private|secret)?\s*(?:telegram|whatsapp)\s*(?:channel|group)|daily\s*jackpot\s*calls?|operator\s*stock\s*tips?)\b/gi,
      /\b(?:inside\s*information|sure\s*shot\s*calls?|100%\s*accuracy\s*in\s*options?|nifty\s*jackpot)\b/gi,
    ],
    extractEvidence: (match) => `Solicitation to private messaging tipster group: "${match[0]}"`,
  },
  {
    code: 'REMOTE_ACCESS_APP_SOLICITATION',
    name: 'Urging Installation of Remote Screen-Sharing Tool',
    severity: 'CRITICAL',
    category: 'DEVICE_COMPROMISE',
    defaultConfidence: 0.96,
    patterns: [
      /\b(?:download|install)\s+(?:anydesk|teamviewer|rustdesk|quicksupport|airdroid)\b/gi,
      /\b(?:apk\s*file|install\s*custom\s*app\s*for\s*verification)\b/gi,
    ],
    extractEvidence: (match) => `Attempt to induce remote app installation: "${match[0]}"`,
  },
];

export class RuleEngine {
  private rules: RuleDefinition[];

  constructor(customRules?: RuleDefinition[]) {
    this.rules = customRules || FINANCIAL_SAFETY_RULES;
  }

  public evaluate(text: string): RuleSignal[] {
    if (!text || typeof text !== 'string') return [];
    const signals: RuleSignal[] = [];
    const seenCodes = new Set<string>();

    for (const rule of this.rules) {
      for (const pattern of rule.patterns) {
        pattern.lastIndex = 0;
        const match = pattern.exec(text);
        if (match && !seenCodes.has(rule.code)) {
          seenCodes.add(rule.code);
          signals.push({
            signal: rule.code,
            severity: rule.severity,
            evidence: rule.extractEvidence(match, text),
            confidence: rule.defaultConfidence,
            category: rule.category,
          });
          break; // move to next rule once matched
        }
      }
    }

    return signals;
  }
}

export const defaultRuleEngine = new RuleEngine();
