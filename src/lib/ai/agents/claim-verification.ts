import { TrustedSourceItem } from '@/lib/rag';

export interface ClaimVerificationResult {
  agentName: 'ClaimVerificationAgent';
  extractedClaims: string[];
  refutedClaims: Array<{
    claim: string;
    regulatoryRefutation: string;
    sourceCited: string;
  }>;
  verificationStatus: 'VERIFIED_SUSPICIOUS' | 'CONTRADICTS_REGULATIONS' | 'UNVERIFIABLE';
}

export function runClaimVerificationAgent(
  text: string,
  ragSources: TrustedSourceItem[]
): ClaimVerificationResult {
  const extractedClaims: string[] = [];
  const refutedClaims: ClaimVerificationResult['refutedClaims'] = [];

  const claimRegexes = [
    {
      regex: /\b(?:guaranteed|assured|fixed)\s+(?:returns?|profit|income)\b/gi,
      type: 'GUARANTEED_RETURNS_CLAIM',
      refutation: 'SEBI statutory regulations explicitly prohibit any registered intermediary or advisor from promising guaranteed or assured returns in securities markets.',
      preferredSource: 'SEBI',
    },
    {
      regex: /\b(?:double|triple)\s+(?:your\s+)?(?:money|capital|investment)\b/gi,
      type: 'RETURN_MULTIPLIER_CLAIM',
      refutation: 'Unrealistic return promises without underlying audited asset disclosure violate SEBI investor protection mandates and are characteristic of Ponzi structures.',
      preferredSource: 'SEBI',
    },
    {
      regex: /\b(?:sebi|rbi)\s*(?:approved|certified|registered)\s*(?:bot|channel|group|scheme)\b/gi,
      type: 'FAKE_REGULATORY_APPROVAL_CLAIM',
      refutation: 'Neither SEBI nor RBI approves private messaging groups, automated trading bots, or specific investment schemes on social media.',
      preferredSource: 'SEBI',
    },
  ];

  for (const item of claimRegexes) {
    item.regex.lastIndex = 0;
    const match = item.regex.exec(text);
    if (match) {
      extractedClaims.push(match[0]);
      // Find matching source
      const matchingSource = ragSources.find((s) => s.publisher.includes(item.preferredSource)) || ragSources[0];
      refutedClaims.push({
        claim: match[0],
        regulatoryRefutation: item.refutation,
        sourceCited: matchingSource ? `${matchingSource.publisher}: ${matchingSource.title}` : 'Official Regulatory Circulars (SEBI/RBI)',
      });
    }
  }

  let status: ClaimVerificationResult['verificationStatus'] = 'UNVERIFIABLE';
  if (refutedClaims.length > 0) {
    status = 'CONTRADICTS_REGULATIONS';
  } else if (extractedClaims.length > 0) {
    status = 'VERIFIED_SUSPICIOUS';
  }

  return {
    agentName: 'ClaimVerificationAgent',
    extractedClaims,
    refutedClaims,
    verificationStatus: status,
  };
}
