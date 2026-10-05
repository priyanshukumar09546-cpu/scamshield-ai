export interface DemoSample {
  id: string;
  type: 'TEXT' | 'URL' | 'DOCUMENT';
  label: string;
  description: string;
  content: string;
  sourceUrl?: string;
}

export const REAL_DEMO_SAMPLES: DemoSample[] = [
  {
    id: 'sample-1',
    type: 'TEXT',
    label: 'Sample 1: WhatsApp Guaranteed Returns Scam',
    description: 'Realistic WhatsApp invite promising 30% monthly profit and VIP stock signals.',
    content: `🚨 EXCLUSIVE VIP STOCK MARKET GROUP 🚨
Dear Investor, join our official SEBI Approved institutional trading bot.
Earn 100% guaranteed return of 35% monthly profit with zero risk!
Double your capital in just 30 days!
Only 3 slots remaining today. Deposit ₹25,000 immediately to account 9182736452 to lock your slot.
Click here to join WhatsApp group: https://zerodha-bonus-rewards.xyz/vip-join`,
  },
  {
    id: 'sample-2',
    type: 'TEXT',
    label: 'Sample 2: Fake Digital Arrest & CBI Extortion',
    description: 'Simulated coercive threat message impersonating Cyber Crime Police & CBI.',
    content: `URGENT NOTICE FROM CBI & CYBER CRIME CELL:
Your mobile number and Aadhaar card were found involved in illegal money laundering and narcotics courier smuggling.
A non-bailable arrest warrant has been issued against you under Digital Arrest Protocol.
To prevent immediate police detention and freezing of all bank accounts within 2 hours, pay the verification bond of Rs 50,000 to the official treasury.
Do not disconnect this call or contact anyone.`,
  },
  {
    id: 'sample-3',
    type: 'URL',
    label: 'Sample 3: Phishing Link Impersonating State Bank of India',
    description: 'Lookalike domain attempting KYC credential harvesting.',
    content: 'https://sbi-kyc-verification-reward.top/login-update.php',
    sourceUrl: 'https://sbi-kyc-verification-reward.top/login-update.php',
  },
  {
    id: 'sample-4',
    type: 'TEXT',
    label: 'Sample 4: Telegram Prepaid Task Scam',
    description: 'Deceptive part-time job offer asking for advance deposit after initial payout.',
    content: `Earn ₹3,000 to ₹8,000 daily from home!
Part time job: Just like YouTube videos and rate 5-star Google Maps locations.
Initial 3 tasks paid ₹150 instantly.
Now to unlock VIP Level 2 tasks, deposit ₹5,000 advance refundable registration fee to manager UPI id: taskadmin@fakebank.
Transfer immediately to continue earning daily salary!`,
  },
  {
    id: 'sample-5',
    type: 'TEXT',
    label: 'Sample 5: Benign Legitimate Banking SMS',
    description: 'Standard informational bank statement alert with no scam indicators.',
    content: `Dear Customer, your monthly statement for savings account ending in XX4921 has been generated and sent to your registered email address. Remember, your bank never asks for your confidential OTP, NetBanking password or UPI PIN. For any queries, visit our official branch or website at https://hdfcbank.com.`,
  },
  {
    id: 'sample-6',
    type: 'TEXT',
    label: 'Sample 6: Hinglish 5x Guaranteed Return & OTP Scam',
    description: 'Realistic Hinglish scam promising ₹50,000 from ₹10,000 and harvesting OTP.',
    content: `Sir guaranteed return hai, ₹10,000 lagao aur 7 din me ₹50,000 milega. Verification ke liye OTP bhej do.`,
  },
  {
    id: 'sample-7',
    type: 'TEXT',
    label: 'Sample 7: Hindi SEBI Certification & OTP Scam',
    description: 'Hindi message claiming SEBI approval and demanding verification OTP.',
    content: `नमस्ते सर, यह SEBI सर्टिफाइड ट्रेडिंग प्लान है। ₹5,000 निवेश करें और 7 दिन में ₹25,000 निश्चित मुनाफा पाएं। खाते के वेरिफिकेशन के लिए अभी आया हुआ OTP भेजें।`,
  },
];
