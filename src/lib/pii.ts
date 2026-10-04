/**
 * Privacy-by-design PII Detection & Redaction Service
 * Hardens user privacy before sending any multimodal text to LLMs or persistent storage
 */

export interface PIIDetectionResult {
  hasPII: boolean;
  redactedText: string;
  detectedTypes: string[];
  counts: Record<string, number>;
}

export function detectAndRedactPII(input: string): PIIDetectionResult {
  if (!input) {
    return {
      hasPII: false,
      redactedText: '',
      detectedTypes: [],
      counts: {},
    };
  }

  let redacted = input;
  const detectedTypes: Set<string> = new Set();
  const counts: Record<string, number> = {};

  const recordMatch = (type: string) => {
    detectedTypes.add(type);
    counts[type] = (counts[type] || 0) + 1;
  };

  // 1. Aadhaar Card Pattern: 12 digits, often formatted as 4-4-4
  const aadhaarRegex = /\b[2-9]{1}[0-9]{3}\s?[0-9]{4}\s?[0-9]{4}\b/g;
  if (aadhaarRegex.test(redacted)) {
    recordMatch('AADHAAR_NUMBER');
    redacted = redacted.replace(aadhaarRegex, '[REDACTED_AADHAAR]');
  }

  // 2. PAN Card Pattern: 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F)
  const panRegex = /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/gi;
  if (panRegex.test(redacted)) {
    recordMatch('PAN_NUMBER');
    redacted = redacted.replace(panRegex, '[REDACTED_PAN]');
  }

  // 3. Credit / Debit Card Numbers (13 to 19 digits)
  const cardRegex = /\b(?:\d{4}[-\s]?){3}\d{4}\b|\b\d{15,16}\b/g;
  if (cardRegex.test(redacted)) {
    recordMatch('PAYMENT_CARD');
    redacted = redacted.replace(cardRegex, '[REDACTED_CARD]');
  }

  // 4. OTP / PIN Patterns (e.g. "OTP is 482910", "PIN: 1234")
  const otpRegex = /\b(?:otp|one\s*time\s*password|pin|passcode|code)\s*(?:is|:|-)?\s*([0-9]{4,8})\b/gi;
  if (otpRegex.test(redacted)) {
    recordMatch('AUTH_OTP_PIN');
    redacted = redacted.replace(otpRegex, '$1: [REDACTED_OTP_PIN]');
  }

  // 5. Passwords / Secrets
  const secretRegex = /\b(?:password|passwd|pwd)\s*(?:is|:|=)\s*([^\s,;]+)/gi;
  if (secretRegex.test(redacted)) {
    recordMatch('PASSWORD');
    redacted = redacted.replace(secretRegex, 'password: [REDACTED_CREDENTIAL]');
  }

  // 6. Indian Mobile Numbers (+91 or starting with 6,7,8,9)
  const indianPhoneRegex = /(?:\+91[\s-]?)?[6789]\d{9}\b/g;
  if (indianPhoneRegex.test(redacted)) {
    recordMatch('PHONE_NUMBER');
    redacted = redacted.replace(indianPhoneRegex, '[REDACTED_PHONE]');
  }

  // 7. Email addresses
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  if (emailRegex.test(redacted)) {
    recordMatch('EMAIL_ADDRESS');
    redacted = redacted.replace(emailRegex, '[REDACTED_EMAIL]');
  }

  // 8. UPI ID Patterns (e.g. name@okhdfcbank, 9876543210@paytm)
  const upiRegex = /\b[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}\b/g;
  // Exclude common email domains already caught
  redacted = redacted.replace(upiRegex, (match) => {
    if (match.includes('@gmail') || match.includes('@yahoo') || match.includes('@outlook') || match.includes('@hotmail')) {
      return match;
    }
    recordMatch('UPI_ID');
    return '[REDACTED_UPI_ID]';
  });

  return {
    hasPII: detectedTypes.size > 0,
    redactedText: redacted,
    detectedTypes: Array.from(detectedTypes),
    counts,
  };
}
