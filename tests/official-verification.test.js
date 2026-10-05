const test = require('node:test');
const assert = require('node:assert/strict');

// Test the Official Verification rules and logic
function verifyOfficialContent(text, extractedDomains = []) {
  const claims = [];
  const lowerText = text.toLowerCase();

  // 1. SEBI Registration Numbers
  const sebiRegPattern = /\bsebi\s+(?:(?:registration|reg\.?|licen[sc]e)?\s*(?:number|no\.?)?\s*(?:is|:|-|#)?\s+)?([A-Z0-9/-]{6,20})\b|\b(IN[A-Z][0-9]{9})\b/gi;
  let match;

  while ((match = sebiRegPattern.exec(text)) !== null) {
    const claimedNumber = (match[1] || match[2] || '').trim();
    const isValidSebiFormat = /^IN[A-Z][0-9]{9}$/i.test(claimedNumber);

    if (isValidSebiFormat) {
      const hasGuaranteedClaim = /\b(?:guaranteed|assured|fixed|100%|risk[- ]?free)\s+(?:returns?|profit|income)\b/i.test(text);
      const hasMessagingGroup = /\b(?:telegram|whatsapp|vip\s*group|channel)\b/i.test(text);

      if (hasGuaranteedClaim || hasMessagingGroup) {
        claims.push({
          status: 'MISMATCH',
          statusLabel: 'Mismatch',
          entity: claimedNumber.toUpperCase(),
          source: 'SEBI Circular SEBI/HO/MIRSD/DOS3/CIR/P/2018/140',
        });
      } else {
        claims.push({
          status: 'UNABLE_TO_VERIFY',
          statusLabel: 'Unable to Verify',
          entity: claimedNumber.toUpperCase(),
          source: 'SEBI Intermediaries Public Registry Database',
        });
      }
    } else {
      claims.push({
        status: 'MISMATCH',
        statusLabel: 'Mismatch',
        entity: claimedNumber,
        source: 'SEBI Statutory Registration Specification',
      });
    }
  }

  // 2. SEBI Endorsement / Bot claims
  if (/\b(?:sebi|sebi\s*approved)\s*(?:bot|channel|group|trading\s*bot|scheme)\b/i.test(text)) {
    claims.push({
      status: 'MISMATCH',
      statusLabel: 'Mismatch',
      entity: 'SEBI Regulatory Authority',
      source: 'SEBI Public Cautionary Advisory (SEBI/PR/2024/08)',
    });
  }

  // 3. Guaranteed Return vs SEBI
  if (/\b(?:guaranteed|assured|100%\s*(?:sure|profit)|risk[- ]?free)\s+(?:returns?|profit|income|payout)\b|guaranteed\s+return\s+hai/i.test(text)) {
    claims.push({
      status: 'MISMATCH',
      statusLabel: 'Mismatch',
      entity: 'Securities and Exchange Board of India (SEBI)',
      source: 'SEBI (Investment Advisers) Regulations, 2013',
    });
  }

  // 4. RBI OTP requirement
  if (/\b(?:otp|one\s*time\s*password)\s*(?:bhej\s*do|bhejo|bhejna|share\s*karein?|dalo|do|mangwao)\b|\b(?:verification|kyc|bonus|credit|receive)\s+(?:ke\s+liye|for)\s+otp\b/i.test(text)) {
    claims.push({
      status: 'MISMATCH',
      statusLabel: 'Mismatch',
      entity: 'Reserve Bank of India (RBI)',
      source: 'RBI Master Direction on Safe Digital Banking',
    });
  }

  // 5. Scheduled Entities (e.g. State Bank of India, HDFC)
  const scheduledEntities = {
    'sbi': { name: 'State Bank of India', domains: ['sbi.co.in', 'onlinesbi.sbi'] },
    'hdfc': { name: 'HDFC Bank', domains: ['hdfcbank.com'] },
  };

  for (const [key, info] of Object.entries(scheduledEntities)) {
    if (new RegExp(`\\b${key}\\b`, 'i').test(lowerText)) {
      const matchLegit = extractedDomains.some((d) => info.domains.some((ld) => d === ld || d.endsWith('.' + ld)));
      if (extractedDomains.length > 0 && matchLegit) {
        claims.push({
          status: 'VERIFIED',
          statusLabel: 'Verified',
          entity: info.name,
          source: 'RBI Scheduled Commercial Bank Registry',
        });
      } else if (extractedDomains.length > 0 && !matchLegit) {
        claims.push({
          status: 'MISMATCH',
          statusLabel: 'Mismatch',
          entity: info.name,
          source: 'RBI Registered Financial Entity Directory',
        });
      } else {
        claims.push({
          status: 'UNABLE_TO_VERIFY',
          statusLabel: 'Unable to Verify',
          entity: info.name,
          source: 'RBI Registered Financial Entity Directory',
        });
      }
      break;
    }
  }

  // 6. Digital arrest
  if (/\b(?:digital\s*arrest|cbi)\b.*\b(?:warrant|arrest|fir|case|fine)\b/i.test(text)) {
    claims.push({
      status: 'MISMATCH',
      statusLabel: 'Mismatch',
      entity: 'Law Enforcement / Judicial Authority',
      source: 'Ministry of Home Affairs & NCRP Statutory Advisory',
    });
  }

  return {
    claims,
    verifiedCount: claims.filter((c) => c.status === 'VERIFIED').length,
    mismatchCount: claims.filter((c) => c.status === 'MISMATCH').length,
    unableToVerifyCount: claims.filter((c) => c.status === 'UNABLE_TO_VERIFY').length,
    hasDistinctionNote: true,
  };
}

test('Official Verification - Invalid SEBI number produces Mismatch', () => {
  const text = 'Invest with us, our SEBI registration number is SEBI-XYZ-998877.';
  const res = verifyOfficialContent(text);
  assert.ok(res.mismatchCount >= 1);
  const mismatchClaim = res.claims.find((c) => c.entity.includes('SEBI-XYZ-998877'));
  assert.ok(mismatchClaim);
  assert.equal(mismatchClaim.status, 'MISMATCH');
});

test('Official Verification - SEBI approved bot or guaranteed returns produces Mismatch against SEBI regulations', () => {
  const text = 'Join our official SEBI approved Telegram bot for 30% monthly profit!';
  const res = verifyOfficialContent(text);
  assert.ok(res.mismatchCount >= 1);
  assert.ok(res.claims.some((c) => c.source.includes('SEBI')));
});

test('Official Verification - Legitimate banking domain matches Verified state', () => {
  const text = 'Dear Customer, your SBI account statement is ready at https://sbi.co.in.';
  const res = verifyOfficialContent(text, ['sbi.co.in']);
  assert.ok(res.verifiedCount >= 1);
  assert.ok(res.claims.some((c) => c.status === 'VERIFIED' && c.entity === 'State Bank of India'));
});

test('Official Verification - Bank name on phishing domain produces Mismatch', () => {
  const text = 'Dear SBI user, update KYC at https://sbi-kyc-bonus-update.top.';
  const res = verifyOfficialContent(text, ['sbi-kyc-bonus-update.top']);
  assert.ok(res.mismatchCount >= 1);
  assert.ok(res.claims.some((c) => c.status === 'MISMATCH' && c.entity === 'State Bank of India'));
});

test('Official Verification - Unknown entity mentioning bank without verifiable domain produces Unable to Verify', () => {
  const text = 'I am calling regarding your SBI loan balance inquiry.';
  const res = verifyOfficialContent(text, []);
  assert.ok(res.unableToVerifyCount >= 1);
  assert.ok(res.claims.some((c) => c.status === 'UNABLE_TO_VERIFY'));
});

test('Official Verification - Digital arrest extortion produces Mismatch against MHA advisory', () => {
  const text = 'Digital arrest warrant issued by CBI. Pay immediate fine.';
  const res = verifyOfficialContent(text);
  assert.ok(res.mismatchCount >= 1);
  assert.ok(res.claims.some((c) => c.source.includes('Ministry of Home Affairs')));
});
