const test = require('node:test');
const assert = require('node:assert/strict');

function isSSRFSafeHost(hostname) {
  const lower = hostname.toLowerCase().trim();
  const BLOCKED = new Set(['localhost', '127.0.0.1', '::1', '0.0.0.0']);
  if (BLOCKED.has(lower)) return false;
  if (lower.endsWith('.local') || lower.endsWith('.internal')) return false;

  const PRIVATE_IP_PATTERNS = [
    /^10\./,
    /^127\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^192\.168\./,
    /^169\.254\./,
  ];

  for (const pat of PRIVATE_IP_PATTERNS) {
    if (pat.test(lower)) return false;
  }
  return true;
}

function detectBrandImpersonation(hostname) {
  const BRANDS = {
    'SBI': ['sbi', 'statebankofindia'],
    'HDFC Bank': ['hdfc', 'hdfcbank'],
    'Zerodha': ['zerodha'],
  };
  const LEGIT = new Set(['sbi.co.in', 'onlinesbi.sbi', 'hdfcbank.com', 'zerodha.com']);

  if (LEGIT.has(hostname)) return null;

  for (const [brand, tokens] of Object.entries(BRANDS)) {
    for (const tok of tokens) {
      if (hostname.includes(tok)) return brand;
    }
  }
  return null;
}

test('SSRF Protection - Blocks loopback and localhost addresses', () => {
  assert.equal(isSSRFSafeHost('localhost'), false);
  assert.equal(isSSRFSafeHost('127.0.0.1'), false);
  assert.equal(isSSRFSafeHost('::1'), false);
  assert.equal(isSSRFSafeHost('192.168.1.1'), false);
  assert.equal(isSSRFSafeHost('10.0.0.5'), false);
  assert.equal(isSSRFSafeHost('internal-db.local'), false);
});

test('SSRF Protection - Allows legitimate public domains', () => {
  assert.equal(isSSRFSafeHost('sebi.gov.in'), true);
  assert.equal(isSSRFSafeHost('rbi.org.in'), true);
  assert.equal(isSSRFSafeHost('example.com'), true);
});

test('URL Engine - Detects brand impersonation in lookalike domains', () => {
  assert.equal(detectBrandImpersonation('sbi-kyc-bonus-update.xyz'), 'SBI');
  assert.equal(detectBrandImpersonation('hdfc-secure-verify.tk'), 'HDFC Bank');
  assert.equal(detectBrandImpersonation('zerodha-jackpot.top'), 'Zerodha');
});

test('URL Engine - Does not flag legitimate registered domains as impersonation', () => {
  assert.equal(detectBrandImpersonation('sbi.co.in'), null);
  assert.equal(detectBrandImpersonation('hdfcbank.com'), null);
  assert.equal(detectBrandImpersonation('zerodha.com'), null);
});
