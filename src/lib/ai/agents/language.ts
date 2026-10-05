import { SupportedLanguage } from '@/lib/i18n/translations';

export interface MultilingualExplanation {
  language: SupportedLanguage;
  explanation: string;
  detectedRedFlags: string[];
  evidenceItems: Array<{
    title: string;
    details: string;
    severity: string;
  }>;
  safeActions: string[];
  uncertainty: string;
  recoveryGuidance: {
    title: string;
    subtitle: string;
    steps: Array<{
      stepNumber: number;
      actionTitle: string;
      actionDetail: string;
      badgeText?: string;
    }>;
    disclaimer: string;
  };
}

/**
 * Automatically detect if text contains Hindi (Devanagari) or Hinglish (Latin-script Hindi)
 */
export function detectLanguage(text: string): SupportedLanguage {
  if (!text) return 'en';

  // Devanagari unicode range
  if (/[\u0900-\u097F]/.test(text)) {
    return 'hi';
  }

  // Hinglish common functional words and phrases
  const hinglishPatterns = [
    /\b(?:hai|aur|din|me|mein|milega|lagao|dalo|karo|karein|bhej|bhejo|paise|kisi|ke\s+liye|hoga|banega|sir|aap|aapko|mat|karna|nahi|batao|apna|rupaye|khol|rakho|nikalo|chahiye)\b/i,
    /\b(?:paisa|munafa|fayda|faayda|pakka|turant|jaldi|khatra|dhokha|lut|lakh|hazaar)\b/i,
  ];

  let matches = 0;
  for (const pat of hinglishPatterns) {
    if (pat.test(text)) {
      matches++;
    }
  }

  if (matches >= 1 && /\b(?:hai|aur|din|me|lagao|milega|bhej|bhejo|karo)\b/i.test(text)) {
    return 'hinglish';
  }

  return 'en';
}

export function translateExplanation(
  explanation: string,
  redFlags: string[],
  evidenceItems: Array<{ title: string; details: string; severity: string }>,
  safeActions: string[],
  uncertainty: string,
  targetLang: SupportedLanguage
): MultilingualExplanation {
  if (targetLang === 'en') {
    return {
      language: 'en',
      explanation,
      detectedRedFlags: redFlags,
      evidenceItems,
      safeActions,
      uncertainty,
      recoveryGuidance: {
        title: 'Already Paid or Shared Information?',
        subtitle: 'If YES — Immediate Incident Recovery Steps:',
        steps: [
          {
            stepNumber: 1,
            actionTitle: 'Contact your bank/payment provider immediately',
            actionDetail: 'Request an immediate stop-payment or freeze on the affected card, account, or UPI ID to prevent further unauthorized debits.',
            badgeText: 'CRITICAL — FIRST 60 MINS',
          },
          {
            stepNumber: 2,
            actionTitle: 'Call 1930 for financial cyber-fraud assistance',
            actionDetail: 'Dial the National Cybercrime Reporting toll-free helpline 1930 immediately to log an emergency incident in the CFCFRMS system.',
            badgeText: 'TOLL-FREE 24x7',
          },
          {
            stepNumber: 3,
            actionTitle: 'Preserve transaction IDs, screenshots, chats and URLs',
            actionDetail: 'Save unedited screenshots of conversations, payment receipts, UTR numbers, account numbers, sender handles, and website links as legal evidence.',
          },
          {
            stepNumber: 4,
            actionTitle: 'Report the incident through official cyber-crime channel',
            actionDetail: 'Submit a formal statutory complaint on the official national portal at cybercrime.gov.in with all preserved digital artifacts.',
          },
          {
            stepNumber: 5,
            actionTitle: 'Never share OTP/PIN/password with recovery agents',
            actionDetail: 'Beware of recovery scams. Genuine police, banks, and legal authorities NEVER ask for OTPs, passwords, or upfront recovery fees.',
            badgeText: 'AVOID SECONDARY FRAUD',
          },
        ],
        disclaimer: 'Do NOT trust anyone promising that money will definitely be recovered or frozen. Fund recovery depends on banking cooperation, inter-bank settlement status, and rapid reporting; no automated platform or third party can guarantee return of funds.',
      },
    };
  }

  if (targetLang === 'hi') {
    const hindiRedFlags = redFlags.map((flag) => {
      const lower = flag.toLowerCase();
      if (lower.includes('guaranteed') || lower.includes('assured')) {
        return 'गारंटीड या निश्चित रिटर्न का भ्रामक दावा (SEBI नियमों के विरुद्ध)';
      }
      if (lower.includes('unrealistic') || lower.includes('multiplier') || lower.includes('lagao')) {
        return 'अवास्तविक मुनाफा: कम समय में असामान्य रकम का वादा (पोंजी स्कीम का लक्षण)';
      }
      if (lower.includes('otp') || lower.includes('one-time password')) {
        return 'गोपनीय बैंक ओटीपी (OTP) की मांग (खाता खाली करने का सीधा प्रयास)';
      }
      if (lower.includes('password') || lower.includes('pin') || lower.includes('mpin')) {
        return 'बैंकिंग पासवर्ड अथवा यूपीआई पिन मांगने का प्रयास';
      }
      if (lower.includes('urgency') || lower.includes('urgent')) {
        return 'जल्दबाज़ी में पैसे भेजने का मनोवैज्ञानिक दबाव';
      }
      if (lower.includes('lookalike') || lower.includes('url') || lower.includes('domain')) {
        return 'संदिग्ध अथवा फ़िशिंग वेबसाइट लिंक';
      }
      if (lower.includes('impersonat') || lower.includes('sebi') || lower.includes('rbi')) {
        return 'सरकारी संस्था, बैंक अथवा नियामक के नाम का अनधिकृत उपयोग';
      }
      if (lower.includes('advance') || lower.includes('fee')) {
        return 'पैसे जारी करने या कार्य देने से पहले अग्रिम शुल्क की मांग';
      }
      if (lower.includes('arrest') || lower.includes('police')) {
        return 'डिजिटल अरेस्ट अथवा कानूनी कार्रवाई की झूठी धमकी';
      }
      return `जोखिम संकेत: ${flag}`;
    });

    const hindiEvidence = evidenceItems.map((item) => {
      const titleLower = item.title.toLowerCase();
      let translatedTitle = item.title;
      let translatedDetails = item.details;

      if (titleLower.includes('guaranteed') || titleLower.includes('assured')) {
        translatedTitle = 'गारंटीड रिटर्न का दावा';
        translatedDetails = `संदेश में बिना जोखिम के लाभ का वादा किया गया है: "${item.details}". सेबी कानून के अनुसार कोई भी अधिकृत मध्यस्थ गारंटीड रिटर्न का वादा नहीं कर सकता।`;
      } else if (titleLower.includes('unrealistic') || titleLower.includes('multiplier')) {
        translatedTitle = 'अवास्तविक रिटर्न एवं पोंजी स्कीम का संकेत';
        translatedDetails = `संदेश में बहुत कम समय में पैसे कई गुना करने का लालच दिया गया है: "${item.details}". यह वित्तीय धोखाधड़ी का एक सामान्य प्रारूप है।`;
      } else if (titleLower.includes('otp')) {
        translatedTitle = 'गोपनीय बैंक ओटीपी की मांग';
        translatedDetails = `सत्यापन के बहाने ओटीपी मांगा गया है: "${item.details}". बैंक या वैध संस्थाएं कभी भी फोन/चैट पर ओटीपी नहीं मांगती।`;
      } else if (titleLower.includes('impersonat')) {
        translatedTitle = 'आधिकारिक संस्था का प्रतिरूपण (Impersonation)';
        translatedDetails = `आधिकारिक संस्था के नाम का दुरुपयोग किया गया है।`;
      }

      return {
        title: translatedTitle,
        details: translatedDetails,
        severity: item.severity,
      };
    });

    const hindiSafeActions = [
      'किसी भी अज्ञात बैंक खाते या यूपीआई आईडी पर पैसे ट्रांसफर न करें।',
      'अपना बैंक ओटीपी, यूपीआई पिन अथवा पासवर्ड किसी के साथ साझा न करें।',
      'SEBI अथवा RBI के आधिकारिक पोर्टल (sebi.gov.in / rbi.org.in) पर पंजीकरण की पुष्टि करें।',
      'धोखाधड़ी की स्थिति में राष्ट्रीय साइबर अपराध हेल्पलाइन 1930 अथवा cybercrime.gov.in पर तत्काल रिपोर्ट करें।',
    ];

    let hindiExplanation = 'इस सामग्री का विश्लेषण करने पर उच्च जोखिम वाले वित्तीय धोखाधड़ी के स्पष्ट संकेत पाए गए हैं। 7 दिन में पैसे 5 गुना करने का वादा और सत्यापन के नाम पर बैंक OTP मांगना गैरकानूनी है। कोई भी बैंक या सेबी अधिकृत संस्था कभी फोन या चैट पर OTP नहीं मांगती।';
    if (explanation.toLowerCase().includes('safe') || explanation.toLowerCase().includes('low risk') || explanation.toLowerCase().includes('benign')) {
      hindiExplanation = 'इस सामग्री में कोई स्पष्ट दुर्भावनापूर्ण अथवा वित्तीय धोखाधड़ी का संकेत नहीं मिला है, फिर भी व्यक्तिगत जानकारी साझा करते समय सतर्क रहें।';
    }

    return {
      language: 'hi',
      explanation: hindiExplanation,
      detectedRedFlags: hindiRedFlags,
      evidenceItems: hindiEvidence,
      safeActions: hindiSafeActions,
      uncertainty: 'यह विश्लेषण केवल उपलब्ध दृश्य एवं पाठ्य संकेतों पर आधारित है। अंतिम वित्तीय लेनदेन से पूर्व स्वतंत्र रूप से सत्यापन आवश्यक है।',
      recoveryGuidance: {
        title: 'क्या आपने पहले ही भुगतान कर दिया है या जानकारी साझा कर दी है?',
        subtitle: 'यदि हाँ — तत्काल साइबर फ्रॉड रिकवरी कदम:',
        steps: [
          {
            stepNumber: 1,
            actionTitle: 'अपने बैंक / भुगतान प्रदाता से तुरंत संपर्क करें',
            actionDetail: 'अपने खाते, कार्ड अथवा यूपीआई आईडी को तत्काल ब्लॉक करवाएं ताकि आगे कोई अनधिकृत लेन-देन न हो सके।',
            badgeText: 'अत्यंत महत्वपूर्ण — पहले 60 मिनट',
          },
          {
            stepNumber: 2,
            actionTitle: 'वित्तीय साइबर धोखाधड़ी सहायता के लिए 1930 पर कॉल करें',
            actionDetail: 'राष्ट्रीय साइबर अपराध हेल्पलाइन नंबर 1930 पर तुरंत कॉल करके घटना दर्ज करवाएं।',
            badgeText: 'टोल-फ्री 24x7',
          },
          {
            stepNumber: 3,
            actionTitle: 'लेन-देन आईडी (UTR), स्क्रीनशॉट, चैट और लिंक सुरक्षित रखें',
            actionDetail: 'धोखेबाज के संदेशों, बैंक रसीद, फोन नंबर और वेबसाइट लिंक का पूरा स्क्रीनशॉट कानूनी साक्ष्य के रूप में सहेजें।',
          },
          {
            stepNumber: 4,
            actionTitle: 'आधिकारिक साइबर अपराध पोर्टल पर शिकायत दर्ज करें',
            actionDetail: 'राष्ट्रीय पोर्टल cybercrime.gov.in पर जाकर सभी साक्ष्यों के साथ विधिवत शिकायत दर्ज करवाएं।',
          },
          {
            stepNumber: 5,
            actionTitle: 'पैसे वापस दिलाने का दावा करने वालों को कभी OTP/पिन न दें',
            actionDetail: 'रिकवरी फ्रॉड से सावधान रहें। असली पुलिस या बैंक अधिकारी कभी भी पैसे वापस दिलाने के लिए फीस या पासवर्ड नहीं मांगते।',
            badgeText: 'द्वितीयक धोखाधड़ी से बचें',
          },
        ],
        disclaimer: 'यह वादा करने वाले किसी भी व्यक्ति पर भरोसा न करें कि पैसा निश्चित रूप से वापस मिल जाएगा या फ्रीज हो जाएगा। रिकवरी बैंकों के सहयोग और त्वरित रिपोर्टिंग पर निर्भर करती है; कोई भी प्लेटफॉर्म धन वापसी की गारंटी नहीं दे सकता।',
      },
    };
  }

  // Hinglish
  const hinglishRedFlags = redFlags.map((flag) => {
    const lower = flag.toLowerCase();
    if (lower.includes('guaranteed') || lower.includes('assured')) {
      return 'Guaranteed return ka fake dawa (SEBI rules ke strict khilaf)';
    }
    if (lower.includes('unrealistic') || lower.includes('multiplier') || lower.includes('lagao')) {
      return 'Unrealistic profit ka lalach: Kam din me abnormal profit (Ponzi scheme sign)';
    }
    if (lower.includes('otp') || lower.includes('one-time password')) {
      return 'Secret Bank OTP maangne ki koshish (Account compromise ka direct threat)';
    }
    if (lower.includes('password') || lower.includes('pin') || lower.includes('mpin')) {
      return 'NetBanking Password ya UPI PIN maangne ki koshish';
    }
    if (lower.includes('urgency') || lower.includes('urgent')) {
      return 'Jaldi me paise transfer karne ka mental pressure';
    }
    if (lower.includes('lookalike') || lower.includes('url') || lower.includes('domain')) {
      return 'Nakli ya suspicious phishing website link';
    }
    if (lower.includes('impersonat') || lower.includes('sebi') || lower.includes('rbi')) {
      return 'Bank ya Government Authority ke naam ka unauthorized use';
    }
    if (lower.includes('advance') || lower.includes('fee')) {
      return 'Paise release karne se pehle advance charges ki maang';
    }
    if (lower.includes('arrest') || lower.includes('police')) {
      return 'Digital Arrest ya Police case ki jhoothi dhamki';
    }
    return `Risk Signal: ${flag}`;
  });

  const hinglishEvidence = evidenceItems.map((item) => {
    const titleLower = item.title.toLowerCase();
    let translatedTitle = item.title;
    let translatedDetails = item.details;

    if (titleLower.includes('guaranteed') || titleLower.includes('assured')) {
      translatedTitle = 'Guaranteed Returns Ka Dawa';
      translatedDetails = `Message me bina risk ke profit ka promise kiya gaya hai: "${item.details}". SEBI regulations ke mutabik registered advisors guaranteed return nahi de sakte.`;
    } else if (titleLower.includes('unrealistic') || titleLower.includes('multiplier')) {
      translatedTitle = 'Unrealistic Returns & Ponzi Scheme Pattern';
      translatedDetails = `Message me bahut kam samay me paise multi-fold karne ka lalach diya gaya hai: "${item.details}". Ye fraud ka clear pattern hai.`;
    } else if (titleLower.includes('otp')) {
      translatedTitle = 'Secret Bank OTP Maangne Ka Attempt';
      translatedDetails = `Verification ke bahane bank OTP maanga gaya hai: "${item.details}". Banks aur genuine companies kabhi chat ya phone par OTP nahi maangti.`;
    }

    return {
      title: translatedTitle,
      details: translatedDetails,
      severity: item.severity,
    };
  });

  const hinglishSafeActions = [
    'Kisi bhi unknown account ya UPI id par turant paise transfer mat karein.',
    'Apna OTP, UPI PIN ya NetBanking password kisi ke sath kabhi share mat karein.',
    'Official SEBI/RBI websites (sebi.gov.in / rbi.org.in) par entity ka status check karein.',
    'Agar fraud hua ho toh foran 1930 Cyber Helpline par call karein ya cybercrime.gov.in par report karein.',
  ];

  let hinglishExplanation = 'Is message me financial fraud ke clear indicators hain. 7 din me 5x profit ka lalach aur verification ke naam par bank OTP maangna direct scam hai. Koi bhi genuine bank ya SEBI registered institution verification ke liye OTP nahi maangta.';
  if (explanation.toLowerCase().includes('safe') || explanation.toLowerCase().includes('low risk') || explanation.toLowerCase().includes('benign')) {
    hinglishExplanation = 'Is content me koi direct malicious ya fraud signals nahi mile hain, fir bhi sensitive credentials share karte waqt careful rahein.';
  }

  return {
    language: 'hinglish',
    explanation: hinglishExplanation,
    detectedRedFlags: hinglishRedFlags,
    evidenceItems: hinglishEvidence,
    safeActions: hinglishSafeActions,
    uncertainty: 'Ye analysis available text aur signals par based hai. Kisi bhi financial decision se pehle official authority se independently verify karein.',
    recoveryGuidance: {
      title: 'Kya aap pehle hi paise bhej chuke hain ya details share kar chuke hain?',
      subtitle: 'Agar HAAN — Immediate Incident Recovery Steps:',
      steps: [
        {
          stepNumber: 1,
          actionTitle: 'Apne bank / payment provider se foran contact karein',
          actionDetail: 'Apne bank account, card ya UPI ID ko turant freeze karwayein taaki aage koi unauthorized transactions na ho sakein.',
          badgeText: 'CRITICAL — FIRST 60 MINS',
        },
        {
          stepNumber: 2,
          actionTitle: 'Financial cyber fraud assistance ke liye 1930 par call karein',
          actionDetail: 'National Cybercrime Helpline 1930 par turant call karein aur CFCFRMS portal me incident alert log karwayein.',
          badgeText: 'TOLL-FREE 24x7',
        },
        {
          stepNumber: 3,
          actionTitle: 'Transaction IDs (UTR), screenshots, chats aur URLs save karein',
          actionDetail: 'Scammer ke sath hui chat, payment receipt, UTR reference number aur website link ke screenshots legal proof ke taur par preserve karein.',
        },
        {
          stepNumber: 4,
          actionTitle: 'Official cyber crime channel par report karein',
          actionDetail: 'Government ke official portal cybercrime.gov.in par jakar saare evidence ke sath complaint file karein.',
        },
        {
          stepNumber: 5,
          actionTitle: 'Paise wapas karane ka dawa karne walon ko OTP/PIN kabhi na dein',
          actionDetail: 'Secondary recovery scams se bachein. Genuine police ya bank kabhi bhi paise refund karne ke naam par advance fee ya OTP nahi maangti.',
          badgeText: 'RECOVERY FRAUD SE BACHEIN',
        },
      ],
      disclaimer: 'Kisi bhi aise shakhs par bharosa na karein jo guarantee deta hai ki paise pakka freeze ya recover ho jayenge. Fund recovery banks ke cooperation aur fast reporting par depend karti hai; koi bhi third party guarantee nahi de sakti.',
    },
  };
}
