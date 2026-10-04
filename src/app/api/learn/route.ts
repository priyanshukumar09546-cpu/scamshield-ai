import { NextResponse } from 'next/server';
import { AUTHORITATIVE_KNOWLEDGE_BASE } from '@/lib/rag';

export async function GET() {
  const educationalGuides = [
    {
      id: 'guide-1',
      title: 'Guaranteed Returns & Telegram Pump-and-Dump Scams',
      category: 'INVESTMENT_FRAUD',
      summary: 'Why no genuine SEBI-registered advisor can guarantee stock market returns, and how Telegram VIP channels trap retail capital.',
      authority: 'SEBI (Securities and Exchange Board of India)',
      officialLink: 'https://www.sebi.gov.in/enforcement/unregistered-entities.html',
      redFlags: [
        'Promises of 20% to 50% monthly profit with "zero risk"',
        'Admin demands upfront subscription fees or profit sharing',
        'Upper-circuit penny stock recommendations before dumping',
      ],
      safetyRules: [
        'Always check SEBI registration numbers on sebi.gov.in before trusting any advisor.',
        'Never join private WhatsApp/Telegram trading channels that solicit fund management.',
      ],
    },
    {
      id: 'guide-2',
      title: 'Digital Arrest & Law Enforcement Impersonation',
      category: 'DIGITAL_EXTORTION',
      summary: 'Cyber criminals pose as CBI, Narcotics Bureau, or State Police officers via Skype/WhatsApp video calls claiming non-bailable arrest warrants.',
      authority: 'Ministry of Home Affairs & 1930 Helpline',
      officialLink: 'https://cybercrime.gov.in/',
      redFlags: [
        'Caller claims your SIM or Aadhaar is linked to illegal contraband or money laundering',
        'Demands staying on video call ("digital arrest") under threat of physical police raid',
        'Directs you to transfer money to a "Supreme Court secret verification escrow"',
      ],
      safetyRules: [
        'There is NO provision of "Digital Arrest" under Indian law or CrPC/BNSS.',
        'Police and CBI NEVER conduct interrogations or demand bail bonds via WhatsApp video calls.',
      ],
    },
    {
      id: 'guide-3',
      title: 'Lookalike Banking Portals & Smishing Links',
      category: 'PHISHING_GUIDELINES',
      summary: 'How fraudsters craft spoofed domains (e.g. sbi-kyc-update.top) to harvest NetBanking passwords and OTPs.',
      authority: 'RBI & CERT-In',
      officialLink: 'https://rbi.org.in/',
      redFlags: [
        'SMS warning that bank account will be blocked within 24 hours if KYC is not updated',
        'Link uses unfamiliar domain extensions like .xyz, .top, or raw IP addresses',
        'Page prompts for Debit Card CVV, ATM PIN, or NetBanking password',
      ],
      safetyRules: [
        'Banks never send links via SMS to update PAN or KYC.',
        'Always type the official bank URL directly into your browser address bar.',
      ],
    },
    {
      id: 'guide-4',
      title: 'Part-Time Task & YouTube Like Scams',
      category: 'PREPAID_TASK_SCAM',
      summary: 'Work-from-home fraud where small initial payouts lure victims into paying large "recharge fees" to withdraw imaginary earnings.',
      authority: 'National Cyber Crime Reporting Portal',
      officialLink: 'https://cybercrime.gov.in/',
      redFlags: [
        'Recruiter contacts unsolicited on Telegram offering ₹3,000/day for liking videos',
        'Initial small payout (₹150 - ₹500) sent to build false trust',
        'VIP tasks suddenly require transferring ₹10,000 to ₹1,00,000 to "unlock withdrawals"',
      ],
      safetyRules: [
        'Legitimate employers never ask employees to pay advance money to work.',
        'Immediately cease communication when requested to make an advance transfer.',
      ],
    },
  ];

  return NextResponse.json({
    guides: educationalGuides,
    authoritativeSources: AUTHORITATIVE_KNOWLEDGE_BASE,
  });
}
