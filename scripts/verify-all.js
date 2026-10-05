const { processAndSaveAnalysis } = require('../src/lib/analysis-service');
const { officialVerificationEngine } = require('../src/lib/official-verification');
const { defaultRuleEngine } = require('../src/lib/rule-engine');
const { detectLanguage, translateExplanation } = require('../src/lib/ai/agents/language');

async function runVerification() {
  console.log('====================================================');
  console.log('ScamShield AI — Complete Feature & Flow Verification');
  console.log('====================================================\n');

  // Test 1: Hinglish scam message from prompt
  console.log('>>> TEST 1: Realistic Hinglish Scam Message');
  const hinglishMsg = 'Sir guaranteed return hai, ₹10,000 lagao aur 7 din me ₹50,000 milega. Verification ke liye OTP bhej do.';
  const detectedLangHinglish = detectLanguage(hinglishMsg);
  console.log(`Detected Language: ${detectedLangHinglish} (Expected: hinglish)`);
  
  const hinglishRules = defaultRuleEngine.evaluate(hinglishMsg);
  console.log('Detected Red Flags:');
  hinglishRules.forEach((r) => console.log(`  - [${r.severity}] ${r.signal}: ${r.evidence}`));

  const hinglishVerif = officialVerificationEngine.verifyContent(hinglishMsg);
  console.log(`Official Verification Verdict: ${hinglishVerif.verificationVerdict}`);
  console.log(`Claims Count: ${hinglishVerif.claims.length} (Mismatches: ${hinglishVerif.mismatchCount}, Verified: ${hinglishVerif.verifiedCount})`);
  hinglishVerif.claims.forEach((c) => {
    console.log(`  - Claim: "${c.normalizedEntity}" -> Status: [${c.statusLabel}] (${c.officialSource})`);
    console.log(`    Evidence: ${c.evidenceDetails.hinglish}`);
  });

  const hinglishTranslations = translateExplanation(
    'Fraudulent high-yield investment scheme detected.',
    hinglishRules.map((r) => r.signal),
    hinglishRules.map((r) => ({ title: r.signal, details: r.evidence, severity: r.severity })),
    ['Do not transfer funds', 'Never share OTP'],
    'Technical Scope and Uncertainty statement',
    'hinglish'
  );
  console.log('\nHinglish UI Translation Sample:');
  console.log('  Explanation:', hinglishTranslations.explanation);
  console.log('  Recovery Title:', hinglishTranslations.recoveryGuidance.title);
  console.log('  Step 1:', hinglishTranslations.recoveryGuidance.steps[0].actionTitle);
  console.log('  Recovery Disclaimer:', hinglishTranslations.recoveryGuidance.disclaimer);

  // Test 2: Pure Devanagari Hindi message
  console.log('\n>>> TEST 2: Pure Devanagari Hindi Scam Message');
  const hindiMsg = 'नमस्ते, यह SEBI सर्टिफाइड प्लान है। ₹5,000 निवेश करें और 7 दिन में ₹25,000 गारंटीड रिटर्न पाएं। वेरिफिकेशन के लिए अभी प्राप्त हुआ OTP भेजें।';
  const detectedLangHindi = detectLanguage(hindiMsg);
  console.log(`Detected Language: ${detectedLangHindi} (Expected: hi)`);

  const hindiRules = defaultRuleEngine.evaluate(hindiMsg);
  console.log('Detected Red Flags:');
  hindiRules.forEach((r) => console.log(`  - [${r.severity}] ${r.signal}: ${r.evidence}`));

  const hindiVerif = officialVerificationEngine.verifyContent(hindiMsg);
  console.log(`Official Verification Claims:`);
  hindiVerif.claims.forEach((c) => {
    console.log(`  - [${c.statusLabel}] ${c.normalizedEntity}: ${c.evidenceDetails.hi}`);
  });

  // Test 3: Suspicious Lookalike URL
  console.log('\n>>> TEST 3: Suspicious URL with Bank Impersonation');
  const phishingUrl = 'https://sbi-kyc-verification-reward.top/login-update.php';
  const urlVerif = officialVerificationEngine.verifyContent('Update your SBI KYC immediately at ' + phishingUrl, ['sbi-kyc-verification-reward.top']);
  console.log(`URL Verification Verdict: ${urlVerif.verificationVerdict}`);
  urlVerif.claims.forEach((c) => {
    console.log(`  - [${c.statusLabel}] ${c.normalizedEntity} -> ${c.evidenceDetails.en}`);
  });

  // Test 4: Legitimate Official Bank Domain
  console.log('\n>>> TEST 4: Legitimate Banking Reference');
  const legitUrl = 'https://sbi.co.in';
  const legitVerif = officialVerificationEngine.verifyContent('Please visit official State Bank of India portal at ' + legitUrl, ['sbi.co.in']);
  console.log(`Legitimate Verification Verdict: ${legitVerif.verificationVerdict}`);
  legitVerif.claims.forEach((c) => {
    console.log(`  - [${c.statusLabel}] ${c.normalizedEntity} -> ${c.evidenceDetails.en}`);
  });

  // Test 5: English Scam Message with Digital Arrest & CBI
  console.log('\n>>> TEST 5: English Scam Message with Digital Arrest');
  const digitalArrestMsg = 'CBI Cyber Crime notice: Digital arrest warrant issued for money laundering. Transfer fine immediately.';
  const arrestVerif = officialVerificationEngine.verifyContent(digitalArrestMsg);
  console.log(`Digital Arrest Verification Claims:`);
  arrestVerif.claims.forEach((c) => {
    console.log(`  - [${c.statusLabel}] ${c.normalizedEntity} -> ${c.evidenceDetails.en}`);
  });

  console.log('\n====================================================');
  console.log('All verification scenarios successfully completed!');
  console.log('====================================================');
}

runVerification().catch(console.error);
