/**
 * SSRF-Hardened URL & Domain Threat Intelligence Engine
 */

export interface URLAnalysisResult {
  isValid: boolean;
  normalizedUrl: string;
  domain: string;
  hostname: string;
  protocol: string;
  tld: string;
  isPunycode: boolean;
  isShortened: boolean;
  isSuspiciousTLD: boolean;
  brandImpersonationDetected: string | null;
  phishingKeywordsFound: string[];
  ssrfSafe: boolean;
  threatIntel: {
    virusTotal: {
      status: 'AVAILABLE' | 'UNAVAILABLE' | 'NOT_CONFIGURED';
      positives?: number;
      total?: number;
      permalink?: string;
      details?: string;
    };
    googleWebRisk: {
      status: 'AVAILABLE' | 'UNAVAILABLE' | 'NOT_CONFIGURED';
      threatTypes?: string[];
      details?: string;
    };
    dnsAndCert: {
      hasHttps: boolean;
      looksLikeIpAddress: boolean;
    };
  };
  signals: Array<{
    code: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    description: string;
  }>;
}

// Private & Reserved IP ranges and hostnames for SSRF protection
const BLOCKED_HOSTNAMES = new Set(['localhost', '127.0.0.1', '::1', '0.0.0.0']);
const PRIVATE_IP_PATTERNS = [
  /^10\./,
  /^127\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^192\.168\./,
  /^169\.254\./, // Link-local
  /^fc00:/i,
  /^fe80:/i,
];

const SUSPICIOUS_TLDS = new Set([
  'tk', 'ml', 'ga', 'cf', 'gq', 'top', 'xyz', 'work', 'click',
  'loan', 'vip', 'monster', 'country', 'stream', 'download', 'win', 'bid',
]);

const SHORTENER_DOMAINS = new Set([
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'buff.ly',
  'ow.ly', 'cutt.ly', 'rebrand.ly', 'v.gd', 'qr.ae',
]);

const PROTECTED_FINANCIAL_BRANDS: Record<string, string[]> = {
  'SBI / State Bank of India': ['sbi', 'statebankofindia', 'onlinesbi'],
  'HDFC Bank': ['hdfc', 'hdfcbank', 'hdfcbankltd'],
  'ICICI Bank': ['icici', 'icicibank'],
  'SEBI': ['sebi', 'sebi.gov.in'],
  'RBI': ['rbi', 'rbi.org.in'],
  'Zerodha': ['zerodha', 'kite'],
  'Groww': ['groww', 'groww.in'],
  'AngelOne': ['angelone', 'angelbroking'],
  'Upstox': ['upstox', 'rksv'],
  'Paytm': ['paytm', 'paytmbank'],
  'PhonePe': ['phonepe'],
  'Google Pay': ['gpay', 'googlepay'],
  'Income Tax India': ['incometax', 'incometaxindiaefiling'],
};

const LEGITIMATE_DOMAINS = new Set([
  'sbi.co.in', 'onlinesbi.sbi', 'hdfcbank.com', 'icicibank.com',
  'sebi.gov.in', 'rbi.org.in', 'zerodha.com', 'kite.zerodha.com',
  'groww.in', 'angelone.in', 'upstox.com', 'paytm.com', 'phonepe.com',
  'gov.in', 'nic.in', 'cybercrime.gov.in',
]);

const PHISHING_PATH_KEYWORDS = [
  'login', 'signin', 'verify', 'verification', 'kyc', 'update-kyc', 'pan-link',
  'aadhaar-link', 'secure', 'claim-reward', 'bonus', 'double-money',
  'free-gift', 'lottery', 'investment-return', 'withdraw', 'refund',
];

export function isSSRFSafeHost(hostname: string): boolean {
  const lower = hostname.toLowerCase().trim();
  if (BLOCKED_HOSTNAMES.has(lower)) return false;
  if (lower.endsWith('.local') || lower.endsWith('.internal') || lower.endsWith('.onion')) return false;

  for (const pattern of PRIVATE_IP_PATTERNS) {
    if (pattern.test(lower)) return false;
  }
  return true;
}

export function extractUrlsFromText(text: string): string[] {
  if (!text) return [];
  const urlRegex = /(?:https?:\/\/|www\.)[^\s<>"'{}|\\^`[\]]+/gi;
  const matches = text.match(urlRegex) || [];
  return Array.from(new Set(matches.map((url) => {
    let clean = url.trim().replace(/[.,;!?)\]]+$/, '');
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = 'https://' + clean;
    }
    return clean;
  })));
}

export async function analyzeUrl(rawUrl: string): Promise<URLAnalysisResult> {
  let normalizedUrl = rawUrl.trim();
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = 'https://' + normalizedUrl;
  }

  let parsed: URL;
  try {
    parsed = new URL(normalizedUrl);
  } catch {
    return {
      isValid: false,
      normalizedUrl,
      domain: '',
      hostname: '',
      protocol: '',
      tld: '',
      isPunycode: false,
      isShortened: false,
      isSuspiciousTLD: false,
      brandImpersonationDetected: null,
      phishingKeywordsFound: [],
      ssrfSafe: false,
      threatIntel: {
        virusTotal: { status: 'UNAVAILABLE', details: 'Invalid URL syntax' },
        googleWebRisk: { status: 'UNAVAILABLE', details: 'Invalid URL syntax' },
        dnsAndCert: { hasHttps: false, looksLikeIpAddress: false },
      },
      signals: [{ code: 'INVALID_URL_SYNTAX', severity: 'HIGH', description: 'Malformatted URL structure.' }],
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  const domainParts = hostname.split('.');
  const tld = domainParts.length > 1 ? domainParts[domainParts.length - 1] : '';
  const ssrfSafe = isSSRFSafeHost(hostname);
  const isPunycode = hostname.startsWith('xn--') || hostname.includes('.xn--');
  const isShortened = SHORTENER_DOMAINS.has(hostname);
  const isSuspiciousTLD = SUSPICIOUS_TLDS.has(tld);
  const looksLikeIp = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(hostname);

  const signals: URLAnalysisResult['signals'] = [];

  if (!ssrfSafe) {
    signals.push({
      code: 'SSRF_PRIVATE_HOST_REJECTED',
      severity: 'CRITICAL',
      description: 'Host points to private or restricted network address.',
    });
  }

  if (isPunycode) {
    signals.push({
      code: 'HOMOGRAPH_PUNYCODE_DOMAIN',
      severity: 'HIGH',
      description: 'Domain contains punycode characters often used to visually disguise fake domains.',
    });
  }

  if (isShortened) {
    signals.push({
      code: 'URL_SHORTENER_DETECTED',
      severity: 'MEDIUM',
      description: 'URL uses a shortening service that conceals destination address and redirect chain.',
    });
  }

  if (isSuspiciousTLD) {
    signals.push({
      code: 'SUSPICIOUS_HIGH_ABUSE_TLD',
      severity: 'HIGH',
      description: `Domain uses .${tld} which is statistically associated with high rates of malicious disposable registrations.`,
    });
  }

  if (looksLikeIp) {
    signals.push({
      code: 'NUMERIC_IP_HOST',
      severity: 'HIGH',
      description: 'URL directly references a raw IP address instead of an authenticated registered domain name.',
    });
  }

  // Brand Impersonation check
  let brandImpersonationDetected: string | null = null;
  const isLegitimate = Array.from(LEGITIMATE_DOMAINS).some((legit) => hostname === legit || hostname.endsWith('.' + legit));

  if (!isLegitimate) {
    for (const [brandName, keywords] of Object.entries(PROTECTED_FINANCIAL_BRANDS)) {
      for (const kw of keywords) {
        if (hostname.includes(kw)) {
          brandImpersonationDetected = brandName;
          signals.push({
            code: 'BRAND_IMPERSONATION_DOMAIN',
            severity: 'CRITICAL',
            description: `Domain '${hostname}' contains trademark brand reference '${kw}' associated with ${brandName}, but is not an official domain.`,
          });
          break;
        }
      }
      if (brandImpersonationDetected) break;
    }
  }

  // Phishing keywords in pathname and search
  const fullPathAndSearch = (parsed.pathname + parsed.search).toLowerCase();
  const phishingKeywordsFound: string[] = [];
  for (const kw of PHISHING_PATH_KEYWORDS) {
    if (fullPathAndSearch.includes(kw)) {
      phishingKeywordsFound.push(kw);
    }
  }

  if (phishingKeywordsFound.length > 0) {
    signals.push({
      code: 'SUSPICIOUS_PHISHING_PATH_KEYWORDS',
      severity: phishingKeywordsFound.length >= 2 ? 'HIGH' : 'MEDIUM',
      description: `URL path contains credential/payment harvesting tokens: ${phishingKeywordsFound.join(', ')}`,
    });
  }

  // Threat Intelligence Checks
  const vtStatus = await queryVirusTotal(normalizedUrl);
  const wrStatus = await queryGoogleWebRisk(normalizedUrl);

  if (vtStatus.status === 'AVAILABLE' && vtStatus.positives && vtStatus.positives > 0) {
    signals.push({
      code: 'VIRUSTOTAL_MALICIOUS_DETECTION',
      severity: 'CRITICAL',
      description: `VirusTotal flagged this URL as malicious across ${vtStatus.positives}/${vtStatus.total} security scanners.`,
    });
  }

  if (wrStatus.status === 'AVAILABLE' && wrStatus.threatTypes && wrStatus.threatTypes.length > 0) {
    signals.push({
      code: 'GOOGLE_WEB_RISK_MATCH',
      severity: 'CRITICAL',
      description: `Google Web Risk flagged URL: ${wrStatus.threatTypes.join(', ')}.`,
    });
  }

  return {
    isValid: true,
    normalizedUrl,
    domain: hostname,
    hostname,
    protocol: parsed.protocol,
    tld,
    isPunycode,
    isShortened,
    isSuspiciousTLD,
    brandImpersonationDetected,
    phishingKeywordsFound,
    ssrfSafe,
    threatIntel: {
      virusTotal: vtStatus,
      googleWebRisk: wrStatus,
      dnsAndCert: {
        hasHttps: parsed.protocol === 'https:',
        looksLikeIpAddress: looksLikeIp,
      },
    },
    signals,
  };
}

async function queryVirusTotal(url: string): Promise<URLAnalysisResult['threatIntel']['virusTotal']> {
  const apiKey = process.env.VIRUSTOTAL_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return {
      status: 'NOT_CONFIGURED',
      details: 'Threat intelligence unavailable — VIRUSTOTAL_API_KEY not configured.',
    };
  }

  try {
    const urlId = Buffer.from(url).toString('base64').replace(/=/g, '');
    const res = await fetch(`https://www.virustotal.com/api/v3/urls/${urlId}`, {
      headers: { 'x-apikey': apiKey },
      signal: AbortSignal.timeout(4000),
    });

    if (!res.ok) {
      return {
        status: 'UNAVAILABLE',
        details: `Threat intelligence query returned status ${res.status}.`,
      };
    }

    const data = await res.json();
    const stats = data?.data?.attributes?.last_analysis_stats || {};
    const maliciousCount = (stats.malicious || 0) + (stats.suspicious || 0);
    const totalCount = Object.values(stats).reduce((a: number, b: any) => a + Number(b || 0), 0) as number;

    return {
      status: 'AVAILABLE',
      positives: maliciousCount,
      total: totalCount || 90,
      permalink: data?.data?.links?.self,
      details: maliciousCount > 0 ? `${maliciousCount} security vendors flagged this URL as malicious/suspicious.` : 'No security vendors currently flag this URL.',
    };
  } catch (error) {
    return {
      status: 'UNAVAILABLE',
      details: 'Threat intelligence query timed out or network unreachable.',
    };
  }
}

async function queryGoogleWebRisk(url: string): Promise<URLAnalysisResult['threatIntel']['googleWebRisk']> {
  const apiKey = process.env.GOOGLE_WEB_RISK_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return {
      status: 'NOT_CONFIGURED',
      details: 'Threat intelligence unavailable — GOOGLE_WEB_RISK_API_KEY not configured.',
    };
  }

  try {
    const encodedUrl = encodeURIComponent(url);
    const endpoint = `https://webrisk.googleapis.com/v1/uris:search?key=${apiKey}&threatTypes=MALWARE&threatTypes=SOCIAL_ENGINEERING&threatTypes=UNWANTED_SOFTWARE&uri=${encodedUrl}`;
    const res = await fetch(endpoint, {
      signal: AbortSignal.timeout(4000),
    });

    if (!res.ok) {
      return {
        status: 'UNAVAILABLE',
        details: `Google Web Risk returned status ${res.status}.`,
      };
    }

    const data = await res.json();
    const threatTypes = data?.threat?.threatTypes || [];

    return {
      status: 'AVAILABLE',
      threatTypes,
      details: threatTypes.length > 0 ? `Identified threats: ${threatTypes.join(', ')}` : 'No known web risks detected in Google database.',
    };
  } catch (error) {
    return {
      status: 'UNAVAILABLE',
      details: 'Google Web Risk service unreachable or timed out.',
    };
  }
}
