const test = require('node:test');
const assert = require('node:assert/strict');

// Import rule regexes matching rule-engine.ts
const HINDI_RULES = [
  {
    code: 'GUARANTEED_RETURN',
    patterns: [
      /\b(?:100%|guaranteed|assured|risk[- ]?free|fixed)\s+(?:(?:rs\.?|inr|₹)?\s*[\d,]+\s+)?(?:daily|monthly|weekly|annual|returns?|profit|income|payout)\b/i,
      /\bguaranteed\s+return\s+hai\b/i,
      /(?:गारंटीड|निश्चित|पक्का)\s*(?:रिटर्न|मुनाफा|फायदा|लाभ)/i,
    ],
  },
  {
    code: 'UNREALISTIC_RETURN',
    patterns: [
      /\b(?:(?:rs\.?|inr|₹)?\s*[\d,]+\s*(?:lagao|dalo|invest\s*karo).*(?:(?:rs\.?|inr|₹)?\s*[\d,]+|double|5x|10x)\s*(?:milega|hoga|banega))\b/i,
      /\b(?:\d+\s*din\s*me\s*(?:rs\.?|inr|₹)?\s*[\d,]+\s*milega)\b/i,
      /(?:(?:rs\.?|inr|₹)?\s*[\d,]+.*(?:दिन|हफ्ते|महीने)\s*में.*(?:rs\.?|inr|₹)?\s*[\d,]+.*(?:मिलेगा|कमाएं|पाएं|रिटर्न))/i,
    ],
  },
  {
    code: 'OTP_REQUEST',
    patterns: [
      /\b(?:otp|one\s*time\s*password)\s*(?:bhej\s*do|bhejo|bhejna|share\s*karein?|share\s*karo|mangwao|do|dalo)\b/i,
      /\b(?:verification|kyc|login)\s+ke\s+liye\s+otp\b/i,
      /(?:ओटीपी|पासवर्ड)\s*(?:भेजें|भेजो|दीजिए|साझा\s*करें|बताओ)/i,
    ],
  },
];

function detectScamRules(text) {
  const detected = [];
  for (const rule of HINDI_RULES) {
    for (const pat of rule.patterns) {
      if (pat.test(text)) {
        detected.push(rule.code);
        break;
      }
    }
  }
  return detected;
}

function detectLang(text) {
  if (/[\u0900-\u097F]/.test(text)) return 'hi';
  if (/\b(?:hai|aur|din|me|lagao|milega|bhej|bhejo|karo)\b/i.test(text)) return 'hinglish';
  return 'en';
}

test('Hindi/Hinglish - Successfully flags realistic Hinglish scam message', () => {
  const message = 'Sir guaranteed return hai, ₹10,000 lagao aur 7 din me ₹50,000 milega. Verification ke liye OTP bhej do.';

  const signals = detectScamRules(message);
  assert.ok(signals.includes('GUARANTEED_RETURN'), 'Must detect guaranteed return claim');
  assert.ok(signals.includes('UNREALISTIC_RETURN'), 'Must detect 5x unrealistic return in 7 days');
  assert.ok(signals.includes('OTP_REQUEST'), 'Must detect urgent OTP solicitation');
});

test('Hindi/Hinglish - Correctly detects Hinglish and Devanagari Hindi languages', () => {
  const hinglishMsg = 'Sir guaranteed return hai, ₹10,000 lagao aur 7 din me ₹50,000 milega. Verification ke liye OTP bhej do.';
  const hindiMsg = 'नमस्ते सर, 7 दिन में ₹50,000 गारंटीड मिलेगा। वेरिफिकेशन के लिए ओटीपी भेजें।';
  const englishMsg = 'Dear customer, your bank statement has been dispatched.';

  assert.equal(detectLang(hinglishMsg), 'hinglish');
  assert.equal(detectLang(hindiMsg), 'hi');
  assert.equal(detectLang(englishMsg), 'en');
});

test('Hindi/Hinglish - Pure Devanagari Hindi message flags guaranteed return and OTP theft', () => {
  const message = '₹5,000 निवेश करें और 7 दिन में ₹25,000 गारंटीड रिटर्न पाएं। वेरिफिकेशन के लिए ओटीपी भेजें।';
  const signals = detectScamRules(message);

  assert.ok(signals.includes('GUARANTEED_RETURN'));
  assert.ok(signals.includes('UNREALISTIC_RETURN'));
  assert.ok(signals.includes('OTP_REQUEST'));
});
