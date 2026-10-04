const test = require('node:test');
const assert = require('node:assert/strict');

const RULES = [
  {
    code: 'GUARANTEED_RETURN',
    severity: 'CRITICAL',
    regex: /\b(?:100%|guaranteed|assured|risk[- ]?free)\s+(?:daily|monthly|weekly|annual|returns?|profit|income)\b/i,
  },
  {
    code: 'UNREALISTIC_RETURN',
    severity: 'CRITICAL',
    regex: /\b(?:double|triple|2x|3x|5x|10x)\s+(?:your\s+)?(?:money|capital|investment)\b/i,
  },
  {
    code: 'OTP_REQUEST',
    severity: 'CRITICAL',
    regex: /\b(?:share|send|enter|tell)\s+(?:your\s+)?(?:otp|one\s*time\s*password)\b/i,
  },
  {
    code: 'DIGITAL_ARREST',
    severity: 'CRITICAL',
    regex: /\b(?:digital\s*arrest|cbi|narcotics)\b.*\b(?:warrant|arrest|fir)\b/i,
  },
];

function evaluateRules(text) {
  const matched = [];
  for (const r of RULES) {
    if (r.regex.test(text)) {
      matched.push(r.code);
    }
  }
  return matched;
}

test('Rule Engine - Flags guaranteed return schemes', () => {
  const text = 'Join our bot to earn 100% guaranteed monthly profit with zero downside!';
  const matches = evaluateRules(text);
  assert.ok(matches.includes('GUARANTEED_RETURN'));
});

test('Rule Engine - Flags return multipliers (double money)', () => {
  const text = 'Deposit Rs 10000 and double your capital in 15 days!';
  const matches = evaluateRules(text);
  assert.ok(matches.includes('UNREALISTIC_RETURN'));
});

test('Rule Engine - Flags OTP solicitation', () => {
  const text = 'Dear user, your SIM card will be blocked unless you share your OTP immediately.';
  const matches = evaluateRules(text);
  assert.ok(matches.includes('OTP_REQUEST'));
});

test('Rule Engine - Flags digital arrest extortion patterns', () => {
  const text = 'Notice from CBI: You are under digital arrest and a non-bailable arrest warrant has been issued.';
  const matches = evaluateRules(text);
  assert.ok(matches.includes('DIGITAL_ARREST'));
});

test('Rule Engine - Benign educational text triggers zero scam rules', () => {
  const text = 'Diversification across equity indices and mutual funds helps manage systematic portfolio volatility over 5-10 year horizons.';
  const matches = evaluateRules(text);
  assert.equal(matches.length, 0);
});
