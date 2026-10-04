export type SupportedLanguage = 'en' | 'hi' | 'hinglish';

export interface TranslationDictionary {
  brandName: string;
  tagline: string;
  heroSubtitle: string;
  analyzeScreenshot: string;
  checkUrl: string;
  analyzeMessage: string;
  learnAboutScams: string;
  tabs: {
    screenshot: string;
    text: string;
    url: string;
    document: string;
    voice: string;
  };
  actions: {
    startAnalysis: string;
    analyzing: string;
    reset: string;
    reportScam: string;
    deleteHistory: string;
    viewDetails: string;
    copyReport: string;
    shareSafety: string;
  };
  labels: {
    riskAssessment: string;
    riskScore: string;
    confidence: string;
    category: string;
    detectedRedFlags: string;
    whyFlagged: string;
    evidence: string;
    safeActions: string;
    uncertainty: string;
    trustedSources: string;
    threatIntelligence: string;
    knowledgeGraph: string;
    piiNotice: string;
  };
  riskLevels: {
    high: string;
    medium: string;
    low: string;
    uncertain: string;
  };
  navigation: {
    home: string;
    check: string;
    history: string;
    learn: string;
    report: string;
    dashboard: string;
    login: string;
    profile: string;
  };
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    brandName: 'ScamShield AI',
    tagline: 'Before You Trust It, Verify It.',
    heroSubtitle: 'AI-powered protection against digital financial scams, phishing and misleading investment content.',
    analyzeScreenshot: 'Analyse Screenshot',
    checkUrl: 'Check URL',
    analyzeMessage: 'Analyse Message',
    learnAboutScams: 'Learn About Scams',
    tabs: {
      screenshot: 'Screenshot',
      text: 'Message / Text',
      url: 'Suspicious URL',
      document: 'PDF Document',
      voice: 'Voice Note',
    },
    actions: {
      startAnalysis: 'Start AI Safety Analysis',
      analyzing: 'Verifying with Safety Pipeline...',
      reset: 'Check Another Content',
      reportScam: 'Report Suspicious Content',
      deleteHistory: 'Clear History',
      viewDetails: 'Inspect Signals',
      copyReport: 'Copy Incident Reference',
      shareSafety: 'Share Advisory',
    },
    labels: {
      riskAssessment: 'RISK ASSESSMENT',
      riskScore: 'Risk Score (heuristic assessment)',
      confidence: 'Confidence Level',
      category: 'Identified Threat Category',
      detectedRedFlags: 'DETECTED RED FLAGS',
      whyFlagged: 'WHY THIS WAS FLAGGED',
      evidence: 'VERIFIED SIGNALS & EVIDENCE',
      safeActions: 'WHAT YOU SHOULD DO',
      uncertainty: 'UNCERTAINTY & SCOPE LIMITATIONS',
      trustedSources: 'AUTHORITATIVE REGULATORY CITATIONS',
      threatIntelligence: 'Threat Intelligence Signals',
      knowledgeGraph: 'Entity Intelligence Correlations',
      piiNotice: 'Privacy Protected: Sensitive credentials/PII are redacted before AI evaluation.',
    },
    riskLevels: {
      high: 'HIGH RISK: High-risk indicators detected. This content may be fraudulent.',
      medium: 'MEDIUM RISK: Suspicious patterns detected. Exercise caution and verify independently.',
      low: 'LOW RISK: No significant risk signals were detected in this analysis.',
      uncertain: 'UNCERTAIN: Insufficient signals to make a definitive assessment. Verify independently.',
    },
    navigation: {
      home: 'Home',
      check: 'Check',
      history: 'History',
      learn: 'Learn',
      report: 'Report',
      dashboard: 'Dashboard',
      login: 'Sign In',
      profile: 'Account',
    },
  },
  hi: {
    brandName: 'स्कैमशील्ड एआई (ScamShield AI)',
    tagline: 'भरोसा करने से पहले, पुष्टि करें।',
    heroSubtitle: 'डिजिटल वित्तीय धोखाधड़ी, फ़िशिंग और भ्रामक निवेश संदेशों से एआई-संचालित सुरक्षा।',
    analyzeScreenshot: 'स्क्रीनशॉट की जांच करें',
    checkUrl: 'वेबसाइट लिंक जांचें',
    analyzeMessage: 'संदेश का विश्लेषण करें',
    learnAboutScams: 'घोटालों के बारे में जानें',
    tabs: {
      screenshot: 'स्क्रीनशॉट',
      text: 'संदेश / टेक्स्ट',
      url: 'वेबसाइट लिंक (URL)',
      document: 'दस्तावेज़ (PDF)',
      voice: 'ऑडियो / वॉयस',
    },
    actions: {
      startAnalysis: 'एआई सुरक्षा विश्लेषण शुरू करें',
      analyzing: 'जांच जारी है...',
      reset: 'नई सामग्री जांचें',
      reportScam: 'संदिग्ध सामग्री की रिपोर्ट करें',
      deleteHistory: 'इतिहास हटाएं',
      viewDetails: 'संकेत देखें',
      copyReport: 'आईडी कॉपी करें',
      shareSafety: 'चेतावनी साझा करें',
    },
    labels: {
      riskAssessment: 'जोखिम मूल्यांकन (Risk Assessment)',
      riskScore: 'जोखिम स्कोर (ह्यूरिस्टिक मूल्यांकन)',
      confidence: 'विश्वसनीयता स्तर',
      category: 'धोखाधड़ी की श्रेणी',
      detectedRedFlags: 'पहचाने गए खतरे (Red Flags)',
      whyFlagged: 'इसे संदिग्ध क्यों माना गया?',
      evidence: 'प्रमाण एवं संकेत (Evidence)',
      safeActions: 'आपको क्या करना चाहिए?',
      uncertainty: 'अनिश्चितता एवं सत्यापन सीमाएं',
      trustedSources: 'आधिकारिक नियामक स्रोत (SEBI / RBI / 1930)',
      threatIntelligence: 'थ्रेट इंटेलिजेंस रिपोर्ट',
      knowledgeGraph: 'एंटीटी फ्रॉड नेटवर्क संबंध',
      piiNotice: 'गोपनीयता सुरक्षित: व्यक्तिगत पहचान और ओटीपी का विश्लेषण से पहले निष्कासन किया गया है।',
    },
    riskLevels: {
      high: 'उच्च जोखिम: अत्यधिक जोखिम भरे संकेत पाए गए हैं। यह सामग्री धोखाधड़ी हो सकती है।',
      medium: 'मध्यम जोखिम: संदिग्ध पैटर्न पाए गए हैं। अत्यधिक सावधानी बरतें।',
      low: 'कम जोखिम: इस विश्लेषण में कोई महत्वपूर्ण जोखिम संकेत नहीं पाए गए।',
      uncertain: 'अनिश्चित: स्पष्ट निर्णय के लिए पर्याप्त संकेत उपलब्ध नहीं हैं।',
    },
    navigation: {
      home: 'होम',
      check: 'जांचें',
      history: 'इतिहास',
      learn: 'मार्गदर्शिका',
      report: 'रिपोर्ट करें',
      dashboard: 'डैशबोर्ड',
      login: 'लॉग इन',
      profile: 'खाता',
    },
  },
  hinglish: {
    brandName: 'ScamShield AI',
    tagline: 'Trust karne se pehle, verify karein.',
    heroSubtitle: 'Digital financial frauds, phishing aur fake investment schemes se AI-powered security.',
    analyzeScreenshot: 'Screenshot Check Karein',
    checkUrl: 'Link Verify Karein',
    analyzeMessage: 'Message Check Karein',
    learnAboutScams: 'Scams Kaise Kaam Karte Hain',
    tabs: {
      screenshot: 'Screenshot',
      text: 'Message / Text',
      url: 'Website Link (URL)',
      document: 'PDF Document',
      voice: 'Voice Note',
    },
    actions: {
      startAnalysis: 'AI Safety Check Start Karein',
      analyzing: 'Security Pipeline verify kar rahi hai...',
      reset: 'Kuch Aur Check Karein',
      reportScam: 'Scam Report Karein',
      deleteHistory: 'History Delete Karein',
      viewDetails: 'Signals Dekhein',
      copyReport: 'Reference Copy Karein',
      shareSafety: 'Family ke sath Share Karein',
    },
    labels: {
      riskAssessment: 'RISK ASSESSMENT',
      riskScore: 'Risk Score (Heuristic Estimation)',
      confidence: 'Confidence Level',
      category: 'Scam Category',
      detectedRedFlags: 'DETECTED RED FLAGS',
      whyFlagged: 'YE KYUN SUSPICIOUS HAI?',
      evidence: 'PROOFS AUR SIGNALS',
      safeActions: 'AAPKO KYA KARNA CHAHIYE',
      uncertainty: 'UNCERTAINTY & LIMITS',
      trustedSources: 'OFFICIAL SEBI / RBI GUIDELINES',
      threatIntelligence: 'Cyber Threat Intel Data',
      knowledgeGraph: 'Entity Risk Links',
      piiNotice: 'Privacy Safe: OTP, Mobile number aur personal data AI ko bhejne se pehle redact kiya gaya hai.',
    },
    riskLevels: {
      high: 'HIGH RISK: Bohot zyada scam signals mile hain. Paise transfer na karein.',
      medium: 'MEDIUM RISK: Suspicious patterns hain. Careful rahein aur verify karein.',
      low: 'LOW RISK: Is message me koi dangerous signal nahi mila.',
      uncertain: 'UNCERTAIN: Pakka bolne ke liye kaafi data nahi hai.',
    },
    navigation: {
      home: 'Home',
      check: 'Check',
      history: 'History',
      learn: 'Seekhein',
      report: 'Report',
      dashboard: 'Dashboard',
      login: 'Login',
      profile: 'Profile',
    },
  },
};
