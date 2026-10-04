const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const AUTHORITATIVE_DOCS = [
  {
    id: 'SEBI-ADV-2024-01',
    title: 'Advisory on Fraudulent Schemes Offering Guaranteed Returns in Securities Market',
    publisher: 'SEBI',
    sourceUrl: 'https://www.sebi.gov.in/enforcement/unregistered-entities.html',
    publicationDate: '2024-02-26',
    category: 'INVESTMENT_FRAUD',
    summary: 'SEBI does not allow any registered intermediary to offer guaranteed, assured, or fixed returns on stock market investments. Any entity promising guaranteed profits or running unauthorized WhatsApp/Telegram trading groups is operating illegally.',
    tags: 'guaranteed returns, assured profits, telegram group, unregistered advisor, sebi approved, double money',
    content: 'Securities and Exchange Board of India (SEBI) has observed entities luring unsuspecting investors with promises of guaranteed returns. Investors are cautioned that no registered stock broker or investment advisor can guarantee returns on investments.',
  },
  {
    id: 'SEBI-ADV-2024-02',
    title: 'Caution Regarding Impersonation of SEBI Officials and Fake Institutional Accounts',
    publisher: 'SEBI',
    sourceUrl: 'https://www.sebi.gov.in/media-and-press/press-releases.html',
    publicationDate: '2024-05-18',
    category: 'IMPERSONATION',
    summary: 'SEBI warns against fraudsters impersonating SEBI registered Foreign Portfolio Investors (FPIs) or institutional brokers offering special IPO allocations or high-profit institutional trading apps.',
    tags: 'fpi trading, institutional account, fake ipo allocation, sebi official, upper circuit',
    content: 'Fraudsters create fake trading apps imitating SEBI-registered entities, enticing users into fraudulent high-yield institutional schemes and then blocking withdrawals with fabricated tax demands.',
  },
  {
    id: 'RBI-NOTIF-2023-09',
    title: 'RBI Master Circular on Safe Digital Banking & OTP Protection',
    publisher: 'RBI',
    sourceUrl: 'https://rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx',
    publicationDate: '2023-11-14',
    category: 'CREDENTIAL_HARVESTING',
    summary: 'RBI reiterates that banks, financial institutions, or payment gateways never ask for OTP, PIN, CVV, or passwords over SMS, phone call, or email. Sharing OTP with third parties leads to irreversible unauthorized fund transfers.',
    tags: 'otp, mpin, pin, password, rbi circular, cvv, kyc update',
    content: 'Banks never solicit confidential authentication credentials. Users must not click unverified links demanding KYC update under threat of SIM block or account deactivation.',
  },
  {
    id: 'RBI-NOTIF-2024-04',
    title: 'Advisory on Fake Loan Apps and Unauthorized Lending Platforms',
    publisher: 'RBI',
    sourceUrl: 'https://sachet.rbi.org.in/',
    publicationDate: '2024-03-10',
    category: 'UNAUTHORIZED_LENDING',
    summary: 'Borrowers must check the RBI SACHET portal (sachet.rbi.org.in) to verify whether a lending entity is an RBI-registered NBFC or commercial bank before transferring advance fees or uploading PAN/Aadhaar.',
    tags: 'sachet portal, fake loan, nbfc verification, advance fee, processing fee',
    content: 'RBI maintains the SACHET portal to report and verify unauthorized financial entities. Never transfer advance processing fees before receiving loan disbursement.',
  },
  {
    id: 'NCRP-ADV-1930',
    title: 'Standard Operating Procedure on Financial Cyber Fraud & 1930 Helpline',
    publisher: 'National Cyber Crime Reporting Portal',
    sourceUrl: 'https://cybercrime.gov.in/',
    publicationDate: '2024-01-15',
    category: 'INCIDENT_RESPONSE',
    summary: 'In case of fraudulent transaction, immediate reporting within the golden hour to National Cyber Crime Helpline 1930 or cybercrime.gov.in can trigger the Citizen Financial Cyber Fraud Reporting and Management System (CFCFRMS) to freeze stolen funds in intermediary bank accounts.',
    tags: '1930, cybercrime.gov.in, golden hour, freeze account, police report, digital arrest',
    content: 'Victims of financial cyber fraud must dial 1930 immediately with transaction reference details, sender/receiver bank account numbers, and timestamps to intercept money movement.',
  },
  {
    id: 'CERT-IN-2024-11',
    title: 'Advisory on Smishing and Malicious APK Distribution Impersonating Banking Portals',
    publisher: 'CERT-In',
    sourceUrl: 'https://www.cert-in.org.in/',
    publicationDate: '2024-04-02',
    category: 'PHISHING_GUIDELINES',
    summary: 'CERT-In alerts citizens against deceptive SMS messages claiming bank account suspension or reward points with links downloading malicious APKs or redirecting to lookalike credential harvesting websites.',
    tags: 'apk, sms phishing, smishing, reward points, account suspended, lookalike domain, anydesk',
    content: 'Attackers distribute trojanized banking apps via malicious links. Never install APK files received via SMS or WhatsApp, and never grant accessibility permissions to unknown apps.',
  },
];

async function main() {
  console.log('Seeding authoritative regulatory investor safety documents...');
  for (const doc of AUTHORITATIVE_DOCS) {
    await prisma.knowledgeDocument.upsert({
      where: { id: doc.id },
      update: doc,
      create: doc,
    });
  }
  console.log('Authoritative documents seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
