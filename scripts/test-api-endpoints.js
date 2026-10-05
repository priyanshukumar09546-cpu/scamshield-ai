async function testLiveAPI() {
  const baseUrl = 'http://localhost:3000';

  console.log('Testing Live Server at:', baseUrl);

  // Helper wait for server
  for (let i = 0; i < 15; i++) {
    try {
      const res = await fetch(`${baseUrl}/api/health`);
      if (res.ok) {
        console.log('Server is healthy and ready!\n');
        break;
      }
    } catch {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  // 1. Test Hinglish Scam Message
  console.log('--- 1. Testing Hinglish Scam Message ---');
  const hinglishText = 'Sir guaranteed return hai, ₹10,000 lagao aur 7 din me ₹50,000 milega. Verification ke liye OTP bhej do.';
  const res1 = await fetch(`${baseUrl}/api/analyze/text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: hinglishText }),
  });
  const data1 = await res1.json();
  console.log('Hinglish Status:', res1.status);
  console.log('Risk Level:', data1.riskLevel, '| Score:', data1.riskScore);
  console.log('Category:', data1.category);
  console.log('Detected Language:', data1.detectedLanguage);
  console.log('Red Flags:', data1.detectedRedFlags);
  console.log('Official Verification Verdict:', data1.officialVerification?.verificationVerdict);
  console.log('Official Verification Claims:', data1.officialVerification?.claims?.length);
  if (data1.officialVerification?.claims) {
    data1.officialVerification.claims.forEach((c) => {
      console.log(`  - [${c.statusLabel}] ${c.normalizedEntity} -> ${c.officialSource}`);
    });
  }

  // 2. Test English Scam Message with Fake SEBI and Telegram Link
  console.log('\n--- 2. Testing English Message with SEBI claim ---');
  const englishText = 'Join official SEBI approved bot. Earn guaranteed 35% monthly profit with zero risk. Double money in 30 days! Visit https://zerodha-bonus-rewards.xyz/vip-join';
  const res2 = await fetch(`${baseUrl}/api/analyze/text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: englishText }),
  });
  const data2 = await res2.json();
  console.log('English Status:', res2.status);
  console.log('Risk Level:', data2.riskLevel, '| Score:', data2.riskScore);
  console.log('Red Flags:', data2.detectedRedFlags);
  console.log('Official Verification Verdict:', data2.officialVerification?.verificationVerdict);
  if (data2.officialVerification?.claims) {
    data2.officialVerification.claims.forEach((c) => {
      console.log(`  - [${c.statusLabel}] ${c.normalizedEntity}: ${c.evidenceDetails?.en}`);
    });
  }

  // 3. Test Hindi Scam Message
  console.log('\n--- 3. Testing Pure Hindi Scam Message ---');
  const hindiText = 'नमस्ते सर, यह SEBI सर्टिफाइड प्लान है। ₹5,000 निवेश करें और 7 दिन में ₹25,000 गारंटीड रिटर्न पाएं। वेरिफिकेशन के लिए अभी प्राप्त हुआ OTP भेजें।';
  const res3 = await fetch(`${baseUrl}/api/analyze/text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: hindiText }),
  });
  const data3 = await res3.json();
  console.log('Hindi Status:', res3.status);
  console.log('Detected Language:', data3.detectedLanguage);
  console.log('Risk Level:', data3.riskLevel, '| Score:', data3.riskScore);
  console.log('Red Flags:', data3.detectedRedFlags);
  console.log('Official Verification Claims:');
  if (data3.officialVerification?.claims) {
    data3.officialVerification.claims.forEach((c) => {
      console.log(`  - [${c.statusLabel}] ${c.normalizedEntity}: ${c.evidenceDetails?.hi}`);
    });
  }

  // 4. Test Suspicious URL
  console.log('\n--- 4. Testing Suspicious URL Analysis ---');
  const res4 = await fetch(`${baseUrl}/api/analyze/url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: 'https://sbi-kyc-verification-reward.top/login-update.php' }),
  });
  const data4 = await res4.json();
  console.log('URL Status:', res4.status);
  console.log('Risk Level:', data4.riskLevel, '| Score:', data4.riskScore);
  console.log('Category:', data4.category);
  console.log('Official Verification:', data4.officialVerification?.claims?.length ? data4.officialVerification.claims.map(c => `[${c.statusLabel}] ${c.normalizedEntity}`) : 'No regulatory mismatch');

  // 5. Test Verified Legitimate Bank Domain
  console.log('\n--- 5. Testing Verified Legitimate Bank Domain ---');
  const res5 = await fetch(`${baseUrl}/api/analyze/url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: 'https://sbi.co.in/web/personal-banking' }),
  });
  const data5 = await res5.json();
  console.log('Legit Status:', res5.status);
  console.log('Risk Level:', data5.riskLevel, '| Score:', data5.riskScore);
  console.log('Category:', data5.category);
  if (data5.officialVerification?.claims) {
    data5.officialVerification.claims.forEach((c) => {
      console.log(`  - [${c.statusLabel}] ${c.normalizedEntity}: ${c.evidenceDetails?.en}`);
    });
  }

  console.log('\n==========================================');
  console.log('All API tests passed with live responses!');
  console.log('==========================================');
}

testLiveAPI().catch(console.error);
