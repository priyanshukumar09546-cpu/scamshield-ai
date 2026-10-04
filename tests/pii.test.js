const test = require('node:test');
const assert = require('node:assert/strict');

// Import built JS or require directly
function detectAndRedactPII(input) {
  if (!input) {
    return { hasPII: false, redactedText: '', detectedTypes: [] };
  }
  let redacted = input;
  const detectedTypes = new Set();

  // Aadhaar
  const aadhaarRegex = /\b[2-9]{1}[0-9]{3}\s?[0-9]{4}\s?[0-9]{4}\b/g;
  if (aadhaarRegex.test(redacted)) {
    detectedTypes.add('AADHAAR_NUMBER');
    redacted = redacted.replace(aadhaarRegex, '[REDACTED_AADHAAR]');
  }

  // PAN
  const panRegex = /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/gi;
  if (panRegex.test(redacted)) {
    detectedTypes.add('PAN_NUMBER');
    redacted = redacted.replace(panRegex, '[REDACTED_PAN]');
  }

  // OTP
  const otpRegex = /\b(?:otp|one\s*time\s*password|pin)\s*(?:is|:|-)?\s*([0-9]{4,8})\b/gi;
  if (otpRegex.test(redacted)) {
    detectedTypes.add('AUTH_OTP_PIN');
    redacted = redacted.replace(otpRegex, '$1: [REDACTED_OTP_PIN]');
  }

  // Phone
  const indianPhoneRegex = /(?:\+91[\s-]?)?[6789]\d{9}\b/g;
  if (indianPhoneRegex.test(redacted)) {
    detectedTypes.add('PHONE_NUMBER');
    redacted = redacted.replace(indianPhoneRegex, '[REDACTED_PHONE]');
  }

  return {
    hasPII: detectedTypes.size > 0,
    redactedText: redacted,
    detectedTypes: Array.from(detectedTypes),
  };
}

test('PII Detection - Redacts Indian mobile numbers', () => {
  const input = 'Call me immediately at +91 9876543210 to claim bonus';
  const result = detectAndRedactPII(input);
  assert.equal(result.hasPII, true);
  assert.ok(result.detectedTypes.includes('PHONE_NUMBER'));
  assert.ok(!result.redactedText.includes('9876543210'));
  assert.ok(result.redactedText.includes('[REDACTED_PHONE]'));
});

test('PII Detection - Redacts PAN card numbers', () => {
  const input = 'My PAN number is ABCDE1234F for verification';
  const result = detectAndRedactPII(input);
  assert.equal(result.hasPII, true);
  assert.ok(result.detectedTypes.includes('PAN_NUMBER'));
  assert.ok(!result.redactedText.includes('ABCDE1234F'));
  assert.ok(result.redactedText.includes('[REDACTED_PAN]'));
});

test('PII Detection - Redacts Aadhaar numbers', () => {
  const input = 'Aadhaar: 3456 7890 1234 verify now';
  const result = detectAndRedactPII(input);
  assert.equal(result.hasPII, true);
  assert.ok(result.detectedTypes.includes('AADHAAR_NUMBER'));
  assert.ok(!result.redactedText.includes('3456 7890 1234'));
  assert.ok(result.redactedText.includes('[REDACTED_AADHAAR]'));
});

test('PII Detection - Returns clean result when no PII present', () => {
  const input = 'Learn how the stock market works through educational books.';
  const result = detectAndRedactPII(input);
  assert.equal(result.hasPII, false);
  assert.equal(result.detectedTypes.length, 0);
  assert.equal(result.redactedText, input);
});
