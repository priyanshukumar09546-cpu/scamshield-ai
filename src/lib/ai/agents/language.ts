import { SupportedLanguage } from '@/lib/i18n/translations';

export interface MultilingualExplanation {
  language: SupportedLanguage;
  explanation: string;
  detectedRedFlags: string[];
  safeActions: string[];
  uncertainty: string;
}

export function translateExplanation(
  explanation: string,
  redFlags: string[],
  safeActions: string[],
  uncertainty: string,
  targetLang: SupportedLanguage
): MultilingualExplanation {
  if (targetLang === 'en') {
    return {
      language: 'en',
      explanation,
      detectedRedFlags: redFlags,
      safeActions,
      uncertainty,
    };
  }

  if (targetLang === 'hi') {
    const hindiRedFlags = redFlags.map((flag) => {
      if (flag.toLowerCase().includes('guaranteed')) return 'गारंटीड रिटर्न का वादा (SEBI नियमों के विरुद्ध)';
      if (flag.toLowerCase().includes('urgency')) return 'जल्दबाज़ी में पैसे भेजने का दबाव';
      if (flag.toLowerCase().includes('otp') || flag.toLowerCase().includes('pin')) return 'गुप्त ओटीपी अथवा पिन मांगने का प्रयास';
      if (flag.toLowerCase().includes('lookalike') || flag.toLowerCase().includes('url')) return 'संदिग्ध अथवा फ़िशिंग वेबसाइट लिंक';
      if (flag.toLowerCase().includes('impersonat')) return 'सरकारी संस्था अथवा बैंक का अनधिकृत नाम';
      if (flag.toLowerCase().includes('advance')) return 'पैसे जारी करने से पहले अग्रिम शुल्क की मांग';
      return `जोखिम संकेत: ${flag}`;
    });

    const hindiSafeActions = [
      'किसी भी अज्ञात बैंक खाते या यूपीआई पते पर तुरंत धन हस्तांतरित न करें।',
      'अपना बैंक ओटीपी, यूपीआई पिन अथवा पासवर्ड किसी के साथ साझा न करें।',
      'SEBI अथवा RBI के आधिकारिक पोर्टल (sebi.gov.in / rbi.org.in) पर पंजीकरण की पुष्टि करें।',
      'धोखाधड़ी की स्थिति में राष्ट्रीय साइबर अपराध हेल्पलाइन 1930 अथवा cybercrime.gov.in पर तत्काल रिपोर्ट करें।',
    ];

    let hindiExplanation = `इस सामग्री का विश्लेषण करने पर उच्च जोखिम वाले वित्तीय संकेत पाए गए हैं। इसमें अवास्तविक लाभ का लालच अथवा अनधिकृत चैनलों के माध्यम से त्वरित भुगतान का दबाव प्रतीत होता है।`;
    if (explanation.toLowerCase().includes('safe') || explanation.toLowerCase().includes('low risk')) {
      hindiExplanation = `इस सामग्री में कोई स्पष्ट दुर्भावनापूर्ण अथवा वित्तीय धोखाधड़ी का संकेत नहीं मिला है, फिर भी व्यक्तिगत जानकारी साझा करते समय सतर्क रहें।`;
    }

    return {
      language: 'hi',
      explanation: hindiExplanation,
      detectedRedFlags: hindiRedFlags,
      safeActions: hindiSafeActions,
      uncertainty: 'यह विश्लेषण केवल उपलब्ध दृश्य एवं पाठ्य संकेतों पर आधारित है। अंतिम वित्तीय लेनदेन से पूर्व स्वतंत्र रूप से सत्यापन आवश्यक है।',
    };
  }

  // Hinglish
  const hinglishRedFlags = redFlags.map((flag) => {
    if (flag.toLowerCase().includes('guaranteed')) return '100% Guaranteed returns ka fake claim (SEBI rules ke against)';
    if (flag.toLowerCase().includes('urgency')) return 'Jaldi me paise transfer karne ka pressure';
    if (flag.toLowerCase().includes('otp') || flag.toLowerCase().includes('pin')) return 'Secret OTP ya UPI PIN maangne ki koshish';
    if (flag.toLowerCase().includes('lookalike') || flag.toLowerCase().includes('url')) return 'Nakli ya suspicious website link';
    if (flag.toLowerCase().includes('impersonat')) return 'Bank ya SEBI ke naam ka galat istemal';
    return `Risk Signal: ${flag}`;
  });

  const hinglishSafeActions = [
    'Kisi bhi unknown account ya UPI par turant paise transfer mat karein.',
    'Apna OTP, UPI PIN ya NetBanking password kisi ke sath share mat karein.',
    'Official SEBI/RBI websites par entity ka status check karein.',
    'Agar fraud hua ho toh foran 1930 Cyber Helpline par call karein.',
  ];

  return {
    language: 'hinglish',
    explanation: 'Content ko analyze karne par scam aur financial fraud ke clear indicators mile hain. Yahan bina registration ke unrealistic profits ka lalach diya ja raha hai.',
    detectedRedFlags: hinglishRedFlags,
    safeActions: hinglishSafeActions,
    uncertainty: 'Ye analysis available text aur signals par based hai. Kisi bhi transaction se pehle official bank ya SEBI se verify karein.',
  };
}
