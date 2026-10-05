import { db } from './db';

export interface TrustedSourceItem {
  id: string;
  title: string;
  publisher: 'SEBI' | 'RBI' | 'CERT-In' | 'National Cyber Crime Reporting Portal' | 'Govt of India' | string;
  sourceUrl: string;
  publicationDate?: string;
  category: string;
  summary: string;
  tags: string[];
  relevanceScore: number;
}

// Built-in Authoritative Knowledge Corpus from verified Indian regulatory authorities
export const AUTHORITATIVE_KNOWLEDGE_BASE: Array<Omit<TrustedSourceItem, 'relevanceScore'>> = [
  {
    id: 'SEBI-ADV-2024-01',
    title: 'Advisory on Fraudulent Schemes Offering Guaranteed Returns in Securities Market',
    publisher: 'SEBI',
    sourceUrl: 'https://www.sebi.gov.in/enforcement/unregistered-entities.html',
    publicationDate: '2024-02-26',
    category: 'INVESTMENT_FRAUD',
    summary: 'SEBI does not allow any registered intermediary to offer guaranteed, assured, or fixed returns on stock market investments. Any entity promising guaranteed profits or running unauthorized WhatsApp/Telegram trading groups is operating illegally.',
    tags: ['guaranteed returns', 'assured profits', 'telegram group', 'unregistered advisor', 'sebi approved', 'double money'],
  },
  {
    id: 'SEBI-ADV-2024-02',
    title: 'Caution Regarding Impersonation of SEBI Officials and Fake Institutional Accounts',
    publisher: 'SEBI',
    sourceUrl: 'https://www.sebi.gov.in/media-and-press/press-releases.html',
    publicationDate: '2024-05-18',
    category: 'IMPERSONATION',
    summary: 'SEBI warns against fraudsters impersonating SEBI registered Foreign Portfolio Investors (FPIs) or institutional brokers offering special IPO allocations or high-profit institutional trading apps.',
    tags: ['fpi trading', 'institutional account', 'fake ipo allocation', 'sebi official', 'upper circuit'],
  },
  {
    id: 'RBI-NOTIF-2023-09',
    title: 'RBI Master Circular on Safe Digital Banking & OTP Protection',
    publisher: 'RBI',
    sourceUrl: 'https://rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx',
    publicationDate: '2023-11-14',
    category: 'CREDENTIAL_HARVESTING',
    summary: 'RBI reiterates that banks, financial institutions, or payment gateways never ask for OTP, PIN, CVV, or passwords over SMS, phone call, or email. Sharing OTP with third parties leads to irreversible unauthorized fund transfers.',
    tags: ['otp', 'mpin', 'pin', 'password', 'rbi circular', 'cvv', 'kyc update'],
  },
  {
    id: 'RBI-NOTIF-2024-04',
    title: 'Advisory on Fake Loan Apps and Unauthorized Lending Platforms',
    publisher: 'RBI',
    sourceUrl: 'https://sachet.rbi.org.in/',
    publicationDate: '2024-03-10',
    category: 'UNAUTHORIZED_LENDING',
    summary: 'Borrowers must check the RBI SACHET portal (sachet.rbi.org.in) to verify whether a lending entity is an RBI-registered NBFC or commercial bank before transferring advance fees or uploading PAN/Aadhaar.',
    tags: ['sachet portal', 'fake loan', 'nbfc verification', 'advance fee', 'processing fee'],
  },
  {
    id: 'NCRP-ADV-1930',
    title: 'Standard Operating Procedure on Financial Cyber Fraud & 1930 Helpline',
    publisher: 'National Cyber Crime Reporting Portal',
    sourceUrl: 'https://cybercrime.gov.in/',
    publicationDate: '2024-01-15',
    category: 'INCIDENT_RESPONSE',
    summary: 'In case of fraudulent transaction, immediate reporting within the golden hour to National Cyber Crime Helpline 1930 or cybercrime.gov.in can trigger the Citizen Financial Cyber Fraud Reporting and Management System (CFCFRMS) to assist in alerting beneficiary banks and halting fraudulent fund movements.',
    tags: ['1930', 'cybercrime.gov.in', 'golden hour', 'halt transaction', 'police report', 'digital arrest'],
  },
  {
    id: 'CERT-IN-2024-11',
    title: 'Advisory on Smishing and Malicious APK Distribution Impersonating Banking Portals',
    publisher: 'CERT-In',
    sourceUrl: 'https://www.cert-in.org.in/',
    publicationDate: '2024-04-02',
    category: 'PHISHING_GUIDELINES',
    summary: 'CERT-In alerts citizens against deceptive SMS messages claiming bank account suspension or reward points with links downloading malicious APKs or redirecting to lookalike credential harvesting websites.',
    tags: ['apk', 'sms phishing', 'smishing', 'reward points', 'account suspended', 'lookalike domain', 'anydesk'],
  },
];

export async function queryAuthoritativeRAG(query: string, topK: number = 3): Promise<TrustedSourceItem[]> {
  if (!query || query.trim() === '') return [];

  const lowerQuery = query.toLowerCase();
  const queryTokens = lowerQuery.split(/\W+/).filter((t) => t.length > 2);

  // First, check DB for any dynamic knowledge documents
  let dbDocs: Array<Omit<TrustedSourceItem, 'relevanceScore'>> = [];
  try {
    const records = await db.knowledgeDocument.findMany({ take: 20 });
    dbDocs = records.map((r) => ({
      id: r.id,
      title: r.title,
      publisher: r.publisher,
      sourceUrl: r.sourceUrl,
      publicationDate: r.publicationDate || undefined,
      category: r.category,
      summary: r.summary,
      tags: r.tags.split(',').map((s) => s.trim().toLowerCase()),
    }));
  } catch {
    // If DB is initializing, use authoritative memory knowledge base
  }

  const allDocs = [...AUTHORITATIVE_KNOWLEDGE_BASE, ...dbDocs];
  const scoredDocs: TrustedSourceItem[] = [];

  for (const doc of allDocs) {
    let score = 0;

    // Check tags
    for (const tag of doc.tags) {
      if (lowerQuery.includes(tag.toLowerCase())) {
        score += 3.0;
      }
    }

    // Check token overlaps in summary and title
    const docText = (doc.title + ' ' + doc.summary).toLowerCase();
    for (const token of queryTokens) {
      if (docText.includes(token)) {
        score += 1.0;
      }
    }

    if (score > 0) {
      scoredDocs.push({
        ...doc,
        relevanceScore: Math.round(score * 10) / 10,
      });
    }
  }

  // Sort descending by score
  scoredDocs.sort((a, b) => b.relevanceScore - a.relevanceScore);
  return scoredDocs.slice(0, topK);
}
