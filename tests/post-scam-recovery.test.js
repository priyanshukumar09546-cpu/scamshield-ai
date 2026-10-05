const test = require('node:test');
const assert = require('node:assert/strict');

const RECOVERY_GUIDANCE = {
  title: 'Already Paid or Shared Information?',
  steps: [
    { stepNumber: 1, actionTitle: 'Contact your bank/payment provider immediately' },
    { stepNumber: 2, actionTitle: 'Call 1930 for financial cyber-fraud assistance' },
    { stepNumber: 3, actionTitle: 'Preserve transaction IDs, screenshots, chats and URLs' },
    { stepNumber: 4, actionTitle: 'Report the incident through official cyber-crime channel' },
    { stepNumber: 5, actionTitle: 'Never share OTP/PIN/password with recovery agents' },
  ],
  disclaimer: 'Do NOT trust anyone promising that money will definitely be recovered or frozen. Fund recovery depends on banking cooperation, inter-bank settlement status, and rapid reporting; no automated platform or third party can guarantee return of funds.',
};

test('Post-Scam Recovery - Section includes all 5 mandatory recovery actions', () => {
  const stepTitles = RECOVERY_GUIDANCE.steps.map((s) => s.actionTitle.toLowerCase());

  assert.ok(stepTitles.some((t) => t.includes('bank') && t.includes('immediately')), 'Must include immediate bank contact');
  assert.ok(stepTitles.some((t) => t.includes('1930') && t.includes('assistance')), 'Must include 1930 helpline');
  assert.ok(stepTitles.some((t) => t.includes('preserve') && t.includes('transaction ids')), 'Must include evidence preservation');
  assert.ok(stepTitles.some((t) => t.includes('report') && t.includes('cyber-crime')), 'Must include official reporting channel');
  assert.ok(stepTitles.some((t) => t.includes('never share otp/pin/password')), 'Must warn against recovery scams');
});

test('Post-Scam Recovery - Section explicitly does not promise guaranteed recovery or fund freezing', () => {
  const disclaimer = RECOVERY_GUIDANCE.disclaimer.toLowerCase();
  assert.ok(disclaimer.includes('do not trust anyone promising that money will definitely be recovered or frozen'));
  assert.ok(!disclaimer.includes('we will freeze your stolen funds'));
  assert.ok(!disclaimer.includes('100% money back guaranteed'));
});
