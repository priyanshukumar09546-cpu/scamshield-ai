const test = require('node:test');
const assert = require('node:assert/strict');

function calculateRisk(ruleSignals, urlSignals) {
  let score = 0;
  const hasCritical = ruleSignals.some(s => s.severity === 'CRITICAL') || urlSignals.some(u => u.severity === 'CRITICAL');
  
  for (const s of ruleSignals) {
    if (s.severity === 'CRITICAL') score += 40;
    else if (s.severity === 'HIGH') score += 20;
    else score += 10;
  }

  for (const u of urlSignals) {
    if (u.severity === 'CRITICAL') score += 50;
    else if (u.severity === 'HIGH') score += 25;
  }

  if (hasCritical && score < 75) {
    score = 80;
  }

  const finalScore = Math.min(100, Math.max(0, score));

  let level = 'UNCERTAIN';
  if (finalScore >= 70) level = 'HIGH';
  else if (finalScore >= 40) level = 'MEDIUM';
  else if (finalScore <= 15) level = 'LOW';

  return { riskScore: finalScore, riskLevel: level };
}

test('Risk Fusion - High risk assigned when multiple critical flags present', () => {
  const rules = [{ severity: 'CRITICAL', code: 'GUARANTEED_RETURN' }];
  const urls = [{ severity: 'CRITICAL', code: 'BRAND_IMPERSONATION' }];
  const res = calculateRisk(rules, urls);

  assert.equal(res.riskLevel, 'HIGH');
  assert.ok(res.riskScore >= 80);
});

test('Risk Fusion - Low risk assigned when no negative indicators exist', () => {
  const rules = [];
  const urls = [];
  const res = calculateRisk(rules, urls);

  assert.equal(res.riskLevel, 'LOW');
  assert.equal(res.riskScore, 0);
});

test('Risk Fusion - Critical floor prevents false negatives on high threat attacks', () => {
  // Even a single critical rule must trigger a high risk floor
  const rules = [{ severity: 'CRITICAL', code: 'OTP_REQUEST' }];
  const urls = [];
  const res = calculateRisk(rules, urls);

  assert.equal(res.riskLevel, 'HIGH');
  assert.ok(res.riskScore >= 75);
});
