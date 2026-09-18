export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  speechCode: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', speechCode: 'te-IN' },
  { code: 'en', name: 'English', nativeName: 'English', speechCode: 'en-US' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', speechCode: 'hi-IN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', speechCode: 'ta-IN' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', speechCode: 'kn-IN' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', speechCode: 'ml-IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', speechCode: 'mr-IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', speechCode: 'bn-IN' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', speechCode: 'gu-IN' }
];

export interface TranslationStrings {
  brandTitle: string;
  brandSubtitle: string;
  liveConsole: string;
  navMenu: string;
  homeChat: string;
  registerCoinNote: string;
  historyTitle: string;
  historySubtitle: string;
  noHistory: string;
  adminPanelTitle: string;
  adminPanelSubtitle: string;
  welcomeGreetingTitle: string;
  welcomeGreetingDesc: string;
  welcomeAgentMsg: string;
  typeMessagePlaceholder: string;
  voiceTypingActive: string;
  voiceNotSupported: string;
  openCamera: string;
  uploadGallery: string;
  send: string;
  back: string;
  close: string;
  user: string;
  online: string;
  selectLanguage: string;
  
  // Coin Registration Modal
  modalTitle: string;
  modalStep1Photo: string;
  modalStep1Btn: string;
  modalStep2Serial: string;
  modalStep2Placeholder: string;
  modalStep3Price: string;
  modalStep3Placeholder: string;
  modalLiveEstimate: string;
  modalEstimateNote: string;
  modalSubmitBtn: string;
  alertEnterSerial: string;
  alertEnterPrice: string;
  adminPinPrompt: string;
  adminPinInvalid: string;
  submissionCardTitle: string;
  serialNumberLabel: string;
  expectedPriceLabel: string;
  estimatedValueLabel: string;
  statusPending: string;
  statusApproved: string;
  statusRejected: string;
  
  // Default agent reply on submission
  agentSubmissionReply: (serial: string, price: string, est: string) => string;
  agentGeneralReply: (query: string) => string;
}

export const TRANSLATIONS: Record<string, TranslationStrings> = {
  te: {
    brandTitle: "Coin Selling and Buying",
    brandSubtitle: "పాత నాణేలు & ₹10 నోట్ల విక్రయం",
    liveConsole: "లైవ్ కన్సోల్",
    navMenu: "నావిగేషన్ మెనూ",
    homeChat: "చాట్ కన్సోల్ (Home)",
    registerCoinNote: "+ కొత్త కాయిన్ / నోటు నమోదు",
    historyTitle: "గత సమర్పణల హిస్టరీ",
    historySubtitle: "మీరు గతంలో సమర్పించిన నాణేలు మరియు నోట్లు",
    noHistory: "ఇంకా ఎలాంటి సమర్పణలు లేవు.",
    adminPanelTitle: "అడ్మిన్ ప్యానెల్ (Admin)",
    adminPanelSubtitle: "అమ్మే వాళ్ళు, యూజర్లు, ధర నిర్ణయం",
    welcomeGreetingTitle: "స్వాగతం! పాత కాయిన్లు & నోట్ల మార్కెట్",
    welcomeGreetingDesc: "మీ దగ్గర ఉన్న పాత 1 రూపాయి కాయిన్లు, ₹10 పాత నోట్లు (786 సీరియల్, జార్జ్ V, కింగ్ ఎడిషన్) ఫోటో తీసి వెంటనే విలువ తెలుసుకోండి.",
    welcomeAgentMsg: "నమస్కారం! నేను మీ నాణేల మరియు నోట్ల మూల్యాంకన ఏజెంట్‌ను. మీ వద్ద ఉన్న పాత నాణేలు లేదా ₹10 నోట్ల ఫోటో, సీరియల్ నంబర్ లేదా వివరాలు ఇక్కడ పంపండి. నేను మీకు సరైన విలువ మరియు విక్రయ మార్గదర్శకాలను అందిస్తాను.",
    typeMessagePlaceholder: "సందేశం లేదా కాయిన్ నంబర్ టైప్ చేయండి...",
    voiceTypingActive: "వినబడుతోంది... మాట్లాడండి",
    voiceNotSupported: "వాయిస్ టైపింగ్ మీ బ్రౌజర్‌లో అందుబాటులో లేదు. దయచేసి టైప్ చేయండి.",
    openCamera: "కెమెరా ఓపెన్ చేయండి",
    uploadGallery: "గ్యాలరీ నుండి అప్‌లోడ్ చేయండి",
    send: "పంపండి",
    back: "వెనుకకు",
    close: "మూసివేయి",
    user: "యూజర్",
    online: "ఆన్‌లైన్",
    selectLanguage: "భాష ఎంచుకోండి (Language)",
    modalTitle: "కాయిన్ / ₹10 నోటు వివరాలు & విలువ",
    modalStep1Photo: "1. మొబైల్ కెమెరాతో ఫోటో తీయండి",
    modalStep1Btn: "కెమెరా ఓపెన్ చేయండి (Take Photo)",
    modalStep2Serial: "2. సీరియల్ నంబర్ / కాయిన్ రకం (Serial Number)",
    modalStep2Placeholder: "ఉదా: 786 543210 లేదా 1947 కాయిన్",
    modalStep3Price: "3. మీరు ఎంతకీ అమ్మాలనుకుంటున్నారు? (Expected Price - ₹)",
    modalStep3Placeholder: "మీ ఆశించిన ధర (ఉదా: 50000)",
    modalLiveEstimate: "దానికి ఎంత విలువ వస్తుంది (Live Estimate):",
    modalEstimateNote: "*అడ్మిన్ పరిశీలన తర్వాత తుది అమౌంట్ మీ ఖాతాలో క్రెడిట్ అవుతుంది.",
    modalSubmitBtn: "చాట్ లో సమర్పించండి (Send to Chat)",
    alertEnterSerial: "దయచేసి సీరియల్ నంబర్ లేదా కాయిన్ వివరాలు నమోదు చేయండి!",
    alertEnterPrice: "దయచేసి మీరు ఎంతకీ అమ్మాలనుకుంటున్నారో ఆశించిన ధర (₹) నమోదు చేయండి!",
    adminPinPrompt: "అడ్మిన్ ప్యానెల్ కొరకు మొబైల్ నెంబర్ లేదా పిన్ నమోదు చేయండి:",
    adminPinInvalid: "సరైన అడ్మిన్ నెంబర్ నమోదు చేయండి.",
    submissionCardTitle: "కాయిన్/నోటు అమ్మకపు వివరాలు",
    serialNumberLabel: "సీరియల్ నంబర్",
    expectedPriceLabel: "అమ్మే ధర",
    estimatedValueLabel: "అంచనా విలువ",
    statusPending: "పరిశీలనలో ఉంది (Pending)",
    statusApproved: "ఆమోదించబడింది (Approved)",
    statusRejected: "తిరస్కరించబడింది (Rejected)",
    agentSubmissionReply: (serial, price, est) => 
      `మీ ${serial} వివరాలు విజయవంతంగా నమోదయ్యాయి! మీ ఆశించిన ధర ₹${price}, మార్కెట్ అంచనా విలువ ${est}. మా అడ్మిన్ టీమ్ మరియు కొనుగోలుదారులు దీనిని పరిశీలిస్తున్నారు. త్వరలోనే తుది ధృవీకరణ వివరాలు మీకు అందుతాయి.`,
    agentGeneralReply: (query) => 
      `ధన్యవాదాలు! మీ ప్రశ్న: "${query}". మీ పాత కాయిన్లు లేదా 786 నోట్లను అమ్మడానికి పైన ఉన్న "+ కొత్త కాయిన్ / నోటు నమోదు" బటన్ నొక్కండి. ఫోటో మరియు సీరియల్ నంబర్ నమోదు చేస్తే మా సిస్టమ్ మరియు అడ్మిన్ మీకు ఉత్తమ ధరను అందిస్తారు.`
  },
  en: {
    brandTitle: "Coin Selling and Buying",
    brandSubtitle: "Old Coins & ₹10 Notes Trading",
    liveConsole: "Live Console",
    navMenu: "Navigation Menu",
    homeChat: "Chat Console (Home)",
    registerCoinNote: "+ Register New Coin / Note",
    historyTitle: "Submission History",
    historySubtitle: "Previously submitted coins and banknotes",
    noHistory: "No submissions recorded yet.",
    adminPanelTitle: "Admin Panel",
    adminPanelSubtitle: "Sellers list, user registry & valuation",
    welcomeGreetingTitle: "Welcome to Coin & Note Marketplace",
    welcomeGreetingDesc: "Upload photos of your rare 1 Rupee coins, vintage ₹10 notes (786 serial, George V, British Raj) to get instant market appraisal.",
    welcomeAgentMsg: "Hello! I am your AI Valuation Agent for rare coins and old banknotes. Please send a photo or serial number of your item. I will provide accurate market valuations and seller guidance.",
    typeMessagePlaceholder: "Type a message or serial number...",
    voiceTypingActive: "Listening... speak now",
    voiceNotSupported: "Voice input is not supported on this browser. Please type.",
    openCamera: "Open Camera",
    uploadGallery: "Upload from Gallery",
    send: "Send",
    back: "Back",
    close: "Close",
    user: "User",
    online: "Online",
    selectLanguage: "Select Language",
    modalTitle: "Coin / ₹10 Note Valuation Details",
    modalStep1Photo: "1. Capture Photo with Camera",
    modalStep1Btn: "Open Camera (Take Photo)",
    modalStep2Serial: "2. Serial Number / Coin Type",
    modalStep2Placeholder: "e.g., 786 543210 or 1947 King George Coin",
    modalStep3Price: "3. Your Expected Selling Price (₹)",
    modalStep3Placeholder: "e.g., 50000",
    modalLiveEstimate: "Live Estimated Market Value:",
    modalEstimateNote: "*Final payout amount is credited after admin authenticity inspection.",
    modalSubmitBtn: "Submit to Chat",
    alertEnterSerial: "Please enter serial number or coin details!",
    alertEnterPrice: "Please enter your expected selling price (₹)!",
    adminPinPrompt: "Enter Admin Phone Number or PIN:",
    adminPinInvalid: "Invalid Admin credentials.",
    submissionCardTitle: "Coin / Note Sale Listing",
    serialNumberLabel: "Serial Number",
    expectedPriceLabel: "Expected Price",
    estimatedValueLabel: "Estimated Value",
    statusPending: "Pending Verification",
    statusApproved: "Approved",
    statusRejected: "Declined",
    agentSubmissionReply: (serial, price, est) => 
      `Your item (${serial}) has been successfully submitted! Expected price: ₹${price}, Market estimate: ${est}. Our appraisal team is reviewing authenticity and will connect with approved buyers shortly.`,
    agentGeneralReply: (query) => 
      `Thank you! Regarding "${query}": To sell your antique coins or ₹10 notes, click "+ Register New Coin / Note" above. Enter the serial number and clear photo for accurate valuation.`
  },
  hi: {
    brandTitle: "Coin Selling and Buying",
    brandSubtitle: "पुराने सिक्के और ₹10 के नोटों की बिक्री",
    liveConsole: "लाइव कंसोल",
    navMenu: "नेविगेशन मेन्यू",
    homeChat: "चैट कंसोल (Home)",
    registerCoinNote: "+ नया सिक्का / नोट दर्ज करें",
    historyTitle: "प्रस्तुतीकरण इतिहास (History)",
    historySubtitle: "आपके द्वारा पहले जमा किए गए सिक्के और नोट",
    noHistory: "अभी तक कोई प्रविष्टि नहीं है।",
    adminPanelTitle: "एडमिन पैनल (Admin)",
    adminPanelSubtitle: "विक्रेता सूची, मूल्यांकन और उपयोगकर्ता",
    welcomeGreetingTitle: "दुर्लभ सिक्कों और नोटों के बाज़ार में स्वागत है",
    welcomeGreetingDesc: "अपने दुर्लभ 1 रुपये के सिक्के, पुराने ₹10 के नोट (786 सीरियल, जॉर्ज पंचम, राजा संस्करण) की फोटो खींचकर तुरंत सही मूल्य जानें।",
    welcomeAgentMsg: "नमस्ते! मैं आपका सिक्का और नोट मूल्यांकन सहायक (AI Agent) हूँ। अपने पुराने सिक्के या 786 नोट की फोटो या सीरियल नंबर भेजें। मैं आपको सही कीमत और बेचने के निर्देश प्रदान करूँगा।",
    typeMessagePlaceholder: "संदेश या सीरियल नंबर लिखें...",
    voiceTypingActive: "सुन रहे हैं... बोलिए",
    voiceNotSupported: "इस ब्राउज़र में वॉइस टाइपिंग समर्थित नहीं है।",
    openCamera: "कैमरा खोलें",
    uploadGallery: "गैलरी से अपलोड करें",
    send: "भेजें",
    back: "वापस",
    close: "बंद करें",
    user: "उपयोगकर्ता",
    online: "ऑनलाइन",
    selectLanguage: "भाषा चुनें (Select Language)",
    modalTitle: "सिक्का / ₹10 नोट विवरण और मूल्यांकन",
    modalStep1Photo: "1. मोबाइल कैमरे से फोटो लें",
    modalStep1Btn: "कैमरा खोलें (Take Photo)",
    modalStep2Serial: "2. सीरियल नंबर / सिक्के का प्रकार",
    modalStep2Placeholder: "उदा: 786 543210 या 1947 का सिक्का",
    modalStep3Price: "3. आपकी अपेक्षित बिक्री कीमत (₹)",
    modalStep3Placeholder: "आपकी वांछित कीमत (उदा: 50000)",
    modalLiveEstimate: "अनुमानित बाज़ार मूल्य (Live Estimate):",
    modalEstimateNote: "*एडमिन सत्यापन के बाद अंतिम राशि आपके खाते में भेजी जाएगी।",
    modalSubmitBtn: "चैट में जमा करें (Submit to Chat)",
    alertEnterSerial: "कृपया सीरियल नंबर या सिक्के का विवरण दर्ज करें!",
    alertEnterPrice: "कृपया अपनी अपेक्षित बिक्री कीमत (₹) दर्ज करें!",
    adminPinPrompt: "एडमिन पैनल के लिए मोबाइल नंबर या पिन दर्ज करें:",
    adminPinInvalid: "कृपया सही एडमिन नंबर दर्ज करें।",
    submissionCardTitle: "सिक्का/नोट बिक्री विवरण",
    serialNumberLabel: "सीरियल नंबर",
    expectedPriceLabel: "अपेक्षित मूल्य",
    estimatedValueLabel: "अनुमानित मूल्य",
    statusPending: "समीक्षाधीन (Pending)",
    statusApproved: "स्वीकृत (Approved)",
    statusRejected: "अस्वीकृत (Rejected)",
    agentSubmissionReply: (serial, price, est) => 
      `आपके आइटम (${serial}) का विवरण सफलतापूर्वक प्राप्त हो गया है! आपकी अपेक्षित कीमत ₹${price} है और अनुमानित मूल्य ${est} है। हमारी टीम इसका सत्यापन कर रही है।`,
    agentGeneralReply: (query) => 
      `धन्यवाद! आपके प्रश्न: "${query}" के संबंध में: अपने पुराने सिक्के या ₹10 के नोट बेचने के लिए ऊपर दिए गए "+ नया सिक्का / नोट दर्ज करें" बटन पर क्लिक करें और फोटो अपलोड करें।`
  },
  ta: {
    brandTitle: "Coin Selling and Buying",
    brandSubtitle: "பழைய நாணயங்கள் & ₹10 நோட்டுகள் விற்பனை",
    liveConsole: "நேரலை கன்சோல்",
    navMenu: "வழிசெலுத்தல் மெனு",
    homeChat: "அரட்டை கன்சோல் (Home)",
    registerCoinNote: "+ புதிய நாணயம் / நோட்டு பதிவு",
    historyTitle: "சமர்ப்பிப்பு வரலாறு",
    historySubtitle: "முன்னர் சமர்ப்பிக்கப்பட்ட நாணயங்கள் & ரூபாய் தாள்கள்",
    noHistory: "இன்னும் பதிவுகள் எதுவும் இல்லை.",
    adminPanelTitle: "நிர்வாகக் குழு (Admin Panel)",
    adminPanelSubtitle: "விற்பனையாளர்கள், பயனர்கள், விலை நிர்ணயம்",
    welcomeGreetingTitle: "பழைய நாணயங்கள் & நோட்டுகள் சந்தைக்கு வரவேற்கிறோம்",
    welcomeGreetingDesc: "உங்கள் பழைய 1 ரூபாய் நாணயங்கள், ₹10 பழைய நோட்டுகள் (786 வரிசை, ஜார்ஜ் V) புகைப்படத்தை பதிவேற்றி மதிப்பைப் பெறுங்கள்.",
    welcomeAgentMsg: "வணக்கம்! நான் உங்கள் நாணயங்கள் மற்றும் நோட்டுகள் மதிப்பீட்டு ஏஜென்ட். உங்கள் பழைய நாணயம் அல்லது நோட்டின் புகைப்படம் அல்லது வரிசை எண்ணை இங்கே அனுப்புங்கள். நான் உங்களுக்கு துல்லியமான மதிப்பை வழங்குவேன்.",
    typeMessagePlaceholder: "செய்தி அல்லது வரிசை எண்ணை தட்டச்சு செய்க...",
    voiceTypingActive: "கேட்கிறது... பேசுங்கள்",
    voiceNotSupported: "உங்கள் உலாவியில் குரல் உள்ளீடு ஆதரிக்கப்படவில்லை.",
    openCamera: "கேமராவைத் திறக்கவும்",
    uploadGallery: "கேலரியில் இருந்து பதிவேற்றவும்",
    send: "அனுப்பு",
    back: "பின்செல்",
    close: "மூடு",
    user: "பயனர்",
    online: "ஆன்லைன்",
    selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
    modalTitle: "நாணயம் / ₹10 நோட்டு விவரங்கள் & மதிப்பு",
    modalStep1Photo: "1. மொபைல் கேமரா மூலம் புகைப்படம் எடுக்கவும்",
    modalStep1Btn: "கேமராவைத் திற (Take Photo)",
    modalStep2Serial: "2. வரிசை எண் / நாணயம் வகை",
    modalStep2Placeholder: "எ.கா: 786 543210 அல்லது 1947 நாணயம்",
    modalStep3Price: "3. நீங்கள் விற்க விரும்பும் விலை (₹)",
    modalStep3Placeholder: "எதிர்பார்க்கப்படும் விலை (எ.கா: 50000)",
    modalLiveEstimate: "மதிப்பிடப்பட்ட சந்தை மதிப்பு (Live Estimate):",
    modalEstimateNote: "*நிர்வாகி சரிபார்ப்புக்குப் பிறகு இறுதித் தொகை வழங்கப்படும்.",
    modalSubmitBtn: "அரட்டையில் சமர்ப்பிக்கவும் (Submit)",
    alertEnterSerial: "தயவுசெய்து வரிசை எண் அல்லது நாணய விவரங்களை உள்ளிடவும்!",
    alertEnterPrice: "தயவுசெய்து எதிர்பார்க்கும் விலையை (₹) உள்ளிடவும்!",
    adminPinPrompt: "நிர்வாகி மொபைல் எண் அல்லது பின்னை உள்ளிடவும்:",
    adminPinInvalid: "தவறான நிர்வாகி விவரங்கள்.",
    submissionCardTitle: "நாணயம் / நோட்டு விற்பனை விவரம்",
    serialNumberLabel: "வரிசை எண்",
    expectedPriceLabel: "விற்பனை விலை",
    estimatedValueLabel: "மதிப்பிடப்பட்ட மதிப்பு",
    statusPending: "சரிபார்ப்பில் உள்ளது (Pending)",
    statusApproved: "அங்கீகரிக்கப்பட்டது (Approved)",
    statusRejected: "நிராகரிக்கப்பட்டது (Rejected)",
    agentSubmissionReply: (serial, price, est) => 
      `உங்கள் (${serial}) வெற்றிகரமாக பதிவு செய்யப்பட்டது! எதிர்பார்க்கப்படும் விலை: ₹${price}, சந்தை மதிப்பு: ${est}. நிர்வாகக் குழு விரைவில் சரிபார்க்கும்.`,
    agentGeneralReply: (query) => 
      `நன்றி! "${query}" குறித்து: பழைய நாணயங்கள் அல்லது நோட்டுகளை விற்க மேலே உள்ள "+ புதிய நாணயம் / நோட்டு பதிவு" பொத்தானைக் கிளிக் செய்து விவரங்களை சமர்ப்பிக்கவும்.`
  },
  kn: {
    brandTitle: "Coin Selling and Buying",
    brandSubtitle: "ಹಳೆಯ ನಾಣ್ಯಗಳು ಮತ್ತು ₹10 ನೋಟುಗಳ ಮಾರಾಟ",
    liveConsole: "ಲೈವ್ ಕನ್ಸೋಲ್",
    navMenu: "ನ್ಯಾವಿಗೇಷನ್ ಮೆನು",
    homeChat: "ಚಾಟ್ ಕನ್ಸೋಲ್ (Home)",
    registerCoinNote: "+ ಹೊಸ ನಾಣ್ಯ / ನೋಟು ನೋಂದಣಿ",
    historyTitle: "ಸಲ್ಲಿಕೆ ಇತಿಹಾಸ",
    historySubtitle: "ಹಿಂದೆ ಸಲ್ಲಿಸಿದ ನಾಣ್ಯಗಳು ಮತ್ತು ನೋಟುಗಳು",
    noHistory: "ಇನ್ನೂ ಯಾವುದೇ ದಾಖಲೆಗಳಿಲ್ಲ.",
    adminPanelTitle: "ನಿರ್ವಾಹಕ ಫಲಕ (Admin)",
    adminPanelSubtitle: "ಮಾರಾಟಗಾರರು, ಬಳಕೆದಾರರು ಮತ್ತು ಬೆಲೆ ನಿಗದಿ",
    welcomeGreetingTitle: "ಹಳೆಯ ನಾಣ್ಯಗಳು ಮತ್ತು ನೋಟುಗಳ ಮಾರುಕಟ್ಟೆಗೆ ಸ್ವಾಗತ",
    welcomeGreetingDesc: "ನಿಮ್ಮ ಬಳಿ ಇರುವ ಹಳೆಯ 1 ರೂಪಾಯಿ ನಾಣ್ಯ, ₹10 ನೋಟುಗಳ (786 ಸರಣಿ, ಜಾರ್ಜ್ V) ಫೋಟೋ ತೆಗೆದು ತಕ್ಷಣ ನಿಖರ ಮೌಲ್ಯ ತಿಳಿಯಿರಿ.",
    welcomeAgentMsg: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ನಾಣ್ಯ ಮತ್ತು ನೋಟು ಮೌಲ್ಯಮಾಪನ AI ಏಜೆಂಟ್. ನಿಮ್ಮ ಹಳೆಯ ನಾಣ್ಯ ಅಥವಾ ₹10 ನೋಟಿನ ಫೋಟೋ ಅಥವಾ ಸರಣಿ ಸಂಖ್ಯೆಯನ್ನು ಕಳುಹಿಸಿ. ನಾನು ನಿಮಗೆ ಸೂಕ್ತ ಮೌಲ್ಯವನ್ನು ತಿಳಿಸುತ್ತೇನೆ.",
    typeMessagePlaceholder: "ಸಂದೇಶ ಅಥವಾ ಸರಣಿ ಸಂಖ್ಯೆ ಟೈಪ್ ಮಾಡಿ...",
    voiceTypingActive: "ಆಲಿಸುತ್ತಿದೆ... ಮಾತನಾಡಿ",
    voiceNotSupported: "ಧ್ವನಿ ಟೈಪಿಂಗ್ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ.",
    openCamera: "ಕ್ಯಾಮೆರಾ ತೆರೆಯಿರಿ",
    uploadGallery: "ಗ್ಯಾಲರಿಯಿಂದ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    send: "ಕಳುಹಿಸಿ",
    back: "ಹಿಂದಕ್ಕೆ",
    close: "ಮುಚ್ಚಿ",
    user: "ಬಳಕೆದಾರ",
    online: "ಆನ್‌ಲೈನ್",
    selectLanguage: "ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ (Language)",
    modalTitle: "ನಾಣ್ಯ / ₹10 ನೋಟಿನ ವಿವರ ಮತ್ತು ಮೌಲ್ಯ",
    modalStep1Photo: "1. ಮೊಬೈಲ್ ಕ್ಯಾಮೆರಾದಿಂದ ಫೋಟೋ ತೆಗೆಯಿರಿ",
    modalStep1Btn: "ಕ್ಯಾಮೆರಾ ತೆರೆಯಿರಿ (Take Photo)",
    modalStep2Serial: "2. ಸರಣಿ ಸಂಖ್ಯೆ / ನಾಣ್ಯದ ಪ್ರಕಾರ",
    modalStep2Placeholder: "ಉದಾ: 786 543210 ಅಥವಾ 1947 ನಾಣ್ಯ",
    modalStep3Price: "3. ನಿಮ್ಮ ಅಪೇಕ್ಷಿತ ಮಾರಾಟ ಬೆಲೆ (₹)",
    modalStep3Placeholder: "ಅಪೇಕ್ಷಿತ ಬೆಲೆ (ಉದಾ: 50000)",
    modalLiveEstimate: "ಅಂದಾಜು ಮಾರುಕಟ್ಟೆ ಮೌಲ್ಯ (Live Estimate):",
    modalEstimateNote: "*ನಿರ್ವಾಹಕರ ಪರಿಶೀಲನೆಯ ನಂತರ ಅಂತಿಮ ಹಣ ಪಾವತಿಯಾಗುತ್ತದೆ.",
    modalSubmitBtn: "ಚಾಟ್‌ನಲ್ಲಿ ಸಲ್ಲಿಸಿ (Submit)",
    alertEnterSerial: "ದಯವಿಟ್ಟು ಸರಣಿ ಸಂಖ್ಯೆ ಅಥವಾ ನಾಣ್ಯ ವಿವರ ದಾಖಲಿಸಿ!",
    alertEnterPrice: "ದಯವಿಟ್ಟು ಅಪೇಕ್ಷಿತ ಬೆಲೆಯನ್ನು (₹) ದಾಖಲಿಸಿ!",
    adminPinPrompt: "ಅಡ್ಮಿನ್ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಅಥವಾ ಪಿನ್ ನಮೂದಿಸಿ:",
    adminPinInvalid: "ತಪ್ಪಾದ ಅಡ್ಮಿನ್ ವಿವರಗಳು.",
    submissionCardTitle: "ನಾಣ್ಯ / ನೋಟು ಮಾರಾಟ ವಿವರ",
    serialNumberLabel: "ಸರಣಿ ಸಂಖ್ಯೆ",
    expectedPriceLabel: "ಮಾರಾಟ ಬೆಲೆ",
    estimatedValueLabel: "ಅಂದಾಜು ಮೌಲ್ಯ",
    statusPending: "ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ (Pending)",
    statusApproved: "ಅನುಮೋದಿಸಲಾಗಿದೆ (Approved)",
    statusRejected: "ತಿರಸ್ಕರಿಸಲಾಗಿದೆ (Rejected)",
    agentSubmissionReply: (serial, price, est) => 
      `ನಿಮ್ಮ ವಸ್ತು (${serial}) ಯಶಸ್ವಿಯಾಗಿ ದಾಖಲಾಗಿದೆ! ನಿರೀಕ್ಷಿತ ಬೆಲೆ: ₹${price}, ಅಂದಾಜು ಮೌಲ್ಯ: ${est}. ನಮ್ಮ ತಂಡ ಶೀಘ್ರದಲ್ಲೇ ಪರಿಶೀಲಿಸುತ್ತದೆ.`,
    agentGeneralReply: (query) => 
      `ಧನ್ಯವಾದಗಳು! "${query}" ಕುರಿತು: ನಿಮ್ಮ ಹಳೆಯ ನಾಣ್ಯಗಳು ಅಥವಾ ನೋಟುಗಳನ್ನು ಮಾರಾಟ ಮಾಡಲು ಮೇಲಿನ "+ ಹೊಸ ನಾಣ್ಯ / ನೋಟು ನೋಂದಣಿ" ಬಟನ್ ಒತ್ತಿ ವಿವರಗಳನ್ನು ಸಲ್ಲಿಸಿ.`
  },
  ml: {
    brandTitle: "Coin Selling and Buying",
    brandSubtitle: "പഴയ നാണയങ്ങളും ₹10 നോട്ടുകളും വിൽക്കൽ",
    liveConsole: "ലൈവ് കൺസോൾ",
    navMenu: "നാവിഗേഷൻ മെനു",
    homeChat: "ചാറ്റ് കൺസോൾ (Home)",
    registerCoinNote: "+ പുതിയ നാണയം / നോട്ട് രജിസ്റ്റർ ചെയ്യുക",
    historyTitle: "സമർപ്പണ ചരിത്രം",
    historySubtitle: "മുമ്പ് സമർപ്പിച്ച നാണയങ്ങളും നോട്ടുകളും",
    noHistory: "ഇതുവരെ വിവരങ്ങളൊന്നും ലഭ്യമല്ല.",
    adminPanelTitle: "അഡ്മിൻ പാനൽ",
    adminPanelSubtitle: "വിൽപ്പനക്കാർ, ഉപയോക്താക്കൾ, വിലനിർണ്ണയം",
    welcomeGreetingTitle: "പഴയ നാണയ വിപണിയിലേക്ക് സ്വാഗതം",
    welcomeGreetingDesc: "നിങ്ങളുടെ അപൂർവ്വ 1 രൂപ നാണയങ്ങൾ, പഴയ ₹10 നോട്ടുകൾ (786 സീരിയൽ, ജോർജ്ജ് V) എന്നിവയുടെ ഫോട്ടോ നൽകി തത്സമയ മൂല്യം അറിയുക.",
    welcomeAgentMsg: "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ നാണയ മൂല്യനിർണ്ണയ സഹായിയാണ്. പഴയ നാണയത്തിന്റെയോ നോട്ടിന്റെയോ ഫോട്ടോ അല്ലെങ്കിൽ സീരിയൽ നമ്പർ അയക്കുക.",
    typeMessagePlaceholder: "സന്ദേശമോ സീരിയൽ നമ്പറോ ടൈപ്പ് ചെയ്യുക...",
    voiceTypingActive: "ശ്രദ്ധിക്കുന്നു... സംസാരിക്കുക",
    voiceNotSupported: "വോയ്‌സ് ടൈപ്പിംഗ് ലഭ്യമല്ല.",
    openCamera: "ക്യാമറ തുറക്കുക",
    uploadGallery: "ഗ്യാലറിയിൽ നിന്ന് നൽകുക",
    send: "അയക്കുക",
    back: "തിരികെ",
    close: "അടയ്ക്കുക",
    user: "ഉപയോക്താവ്",
    online: "ഓൺലൈൻ",
    selectLanguage: "ഭാഷ തിരഞ്ഞെടുക്കുക",
    modalTitle: "നാണയം / ₹10 നോട്ട് വിവരങ്ങളും മൂല്യവും",
    modalStep1Photo: "1. ക്യാമറ ഉപയോഗിച്ച് ഫോട്ടോ എടുക്കുക",
    modalStep1Btn: "ക്യാമറ തുറക്കുക (Take Photo)",
    modalStep2Serial: "2. സീരിയൽ നമ്പർ / നാണയ തരം",
    modalStep2Placeholder: "ഉദാ: 786 543210 അല്ലെങ്കിൽ 1947 നാണയം",
    modalStep3Price: "3. പ്രതീക്ഷിക്കുന്ന വിൽപ്പന വില (₹)",
    modalStep3Placeholder: "പ്രതീക്ഷിക്കുന്ന തുക (ഉദാ: 50000)",
    modalLiveEstimate: "കമ്പോള മൂല്യം (Live Estimate):",
    modalEstimateNote: "*അഡ്മിൻ പരിശോധനയ്ക്ക് ശേഷം അന്തിമ തുക നൽകും.",
    modalSubmitBtn: "ചാറ്റിൽ സമർപ്പിക്കുക (Submit)",
    alertEnterSerial: "ദയവായി സീരിയൽ നമ്പർ നൽകുക!",
    alertEnterPrice: "ദയവായി പ്രതീക്ഷിക്കുന്ന വില (₹) നൽകുക!",
    adminPinPrompt: "അഡ്മിൻ നമ്പർ അല്ലെങ്കിൽ പിൻ നൽകുക:",
    adminPinInvalid: "തെറ്റായ വിവരങ്ങൾ.",
    submissionCardTitle: "വിൽപ്പന വിവരങ്ങൾ",
    serialNumberLabel: "സീരിയൽ നമ്പർ",
    expectedPriceLabel: "വിൽക്കുന്ന വില",
    estimatedValueLabel: "കമ്പോള മൂല്യം",
    statusPending: "പരിശോധനയിലാണ് (Pending)",
    statusApproved: "അംഗീകരിച്ചു (Approved)",
    statusRejected: "നിരസിച്ചു (Rejected)",
    agentSubmissionReply: (serial, price, est) => 
      `നിങ്ങളുടെ (${serial}) വിജയകരമായി സമർപ്പിച്ചു! പ്രതീക്ഷിക്കുന്ന വില: ₹${price}, കണക്കാക്കിയ മൂല്യം: ${est}. ഉടൻ തന്നെ പരിശോധന പൂർത്തിയാകും.`,
    agentGeneralReply: (query) => 
      `നന്ദി! "${query}" മായി ബന്ധപ്പെട്ട്: പഴയ നാണയങ്ങളോ നോട്ടുകളോ വിൽക്കാൻ മുകളിലുള്ള "+ പുതിയ നാണയം / നോട്ട് രജിസ്റ്റർ ചെയ്യുക" ക്ലിക്ക് ചെയ്യുക.`
  },
  mr: {
    brandTitle: "Coin Selling and Buying",
    brandSubtitle: "जुनी नाणी आणि ₹10 च्या नोटांची विक्री",
    liveConsole: "लाइव्ह कन्सोल",
    navMenu: "नेव्हिगेशन मेनू",
    homeChat: "चॅट कन्सोल (Home)",
    registerCoinNote: "+ नवीन नाणे / नोट नोंदवा",
    historyTitle: "सबमिशन इतिहास",
    historySubtitle: "पूर्वी सादर केलेली नाणी आणि नोटा",
    noHistory: "अद्याप कोणतेही सबमिशन नाही.",
    adminPanelTitle: "अॅडमिन पॅनेल (Admin)",
    adminPanelSubtitle: "विक्रेते, वापरकर्ते आणि किंमत मूल्यांकन",
    welcomeGreetingTitle: "जुन्या नाण्यांच्या बाजारात आपले स्वागत आहे",
    welcomeGreetingDesc: "तुमच्याकडील जुनी 1 रुपयाची नाणी, ₹10 च्या जुन्या नोटा (786 सिरीयल, जॉर्ज पंचम) यांचा फोटो पाठवून योग्य मूल्य जाणून घ्या.",
    welcomeAgentMsg: "नमस्कार! मी तुमचा नाणी आणि नोट मूल्यांकन सहाय्यक आहे. तुमच्या जुन्या नाण्याचा किंवा नोटेचा फोटो किंवा अनुक्रमांक येथे पाठवा.",
    typeMessagePlaceholder: "संदेश किंवा सिरीयल नंबर टाइप करा...",
    voiceTypingActive: "ऐकत आहे... बोला",
    voiceNotSupported: "व्हॉइस टायपिंग उपलब्ध नाही.",
    openCamera: "कॅमेरा उघडा",
    uploadGallery: "गॅलरीतून अपलोड करा",
    send: "पाठवा",
    back: "मागे",
    close: "बंद करा",
    user: "वापरकर्ता",
    online: "ऑनलाइन",
    selectLanguage: "भाषा निवडा (Select Language)",
    modalTitle: "नाणे / ₹10 नोट तपशील आणि मूल्य",
    modalStep1Photo: "1. मोबाईल कॅमेऱ्याने फोटो काढा",
    modalStep1Btn: "कॅमेरा उघडा (Take Photo)",
    modalStep2Serial: "2. सिरीयल नंबर / नाण्याचा प्रकार",
    modalStep2Placeholder: "उदा: 786 543210 किंवा 1947 नाणे",
    modalStep3Price: "3. तुमची अपेक्षित विक्री किंमत (₹)",
    modalStep3Placeholder: "अपेक्षित किंमत (उदा: 50000)",
    modalLiveEstimate: "अंदाजे बाजार मूल्य (Live Estimate):",
    modalEstimateNote: "*अॅडमिन पडताळणीनंतर अंतिम रक्कम खात्यात जमा केली जाईल.",
    modalSubmitBtn: "चॅटमध्ये सबमिट करा (Submit)",
    alertEnterSerial: "कृपया सिरीयल नंबर किंवा तपशील प्रविष्ट करा!",
    alertEnterPrice: "कृपया अपेक्षित किंमत (₹) प्रविष्ट करा!",
    adminPinPrompt: "अॅडमिन मोबाइल नंबर किंवा पिन टाका:",
    adminPinInvalid: "अवैध अॅडमिन क्रेडेन्शियल.",
    submissionCardTitle: "विक्री तपशील",
    serialNumberLabel: "सिरीयल नंबर",
    expectedPriceLabel: "विक्री किंमत",
    estimatedValueLabel: "अंदाजे मूल्य",
    statusPending: "प्रलंबित (Pending)",
    statusApproved: "मंजूर (Approved)",
    statusRejected: "नाकारले (Rejected)",
    agentSubmissionReply: (serial, price, est) => 
      `तुमची नोंदणी (${serial}) यशस्वी झाली आहे! अपेक्षित किंमत: ₹${price}, अंदाजे मूल्य: ${est}. आमची टीम लवकरच पडताळणी करेल.`,
    agentGeneralReply: (query) => 
      `धन्यवाद! "${query}" संदर्भात: जुनी नाणी किंवा नोटा विकण्यासाठी वरील "+ नवीन नाणे / नोट नोंदवा" बटनावर क्लिक करा.`
  },
  bn: {
    brandTitle: "Coin Selling and Buying",
    brandSubtitle: "পুরোনো মুদ্রা এবং ₹10 নোট ক্রয়-বিক্রয়",
    liveConsole: "লাইভ কনসোল",
    navMenu: "নেভিগেশন মেনু",
    homeChat: "চ্যাট কনসোল (Home)",
    registerCoinNote: "+ নতুন কয়েন / নোট নিবন্ধন করুন",
    historyTitle: "জমা দেওয়ার ইতিহাস",
    historySubtitle: "পূর্বে জমা দেওয়া কয়েন ও নোট",
    noHistory: "এখনো কোনো তথ্য নেই।",
    adminPanelTitle: "অ্যাডমিন প্যানেল",
    adminPanelSubtitle: "বিক্রেতা তালিকা, ব্যবহারকারী ও মূল্য নির্ধারণ",
    welcomeGreetingTitle: "পুরোনো কয়েন ও নোট বাজারে স্বাগতম",
    welcomeGreetingDesc: "আপনার পুরোনো ১ টাকার কয়েন বা ₹১০ টাকার নোটের (৭৮৬ সিরিয়াল, জর্জ পঞ্চম) ছবি তুলে তাৎক্ষণিক সঠিক মূল্য জেনে নিন।",
    welcomeAgentMsg: "নমস্কার! আমি আপনার প্রাচীন মুদ্রা ও নোট মূল্যায়ন সহকারী (AI Agent)। আপনার পুরোনো কয়েন বা নোটের ছবি বা সিরিয়াল নম্বর এখানে পাঠান।",
    typeMessagePlaceholder: "বার্তা বা সিরিয়াল নম্বর টাইপ করুন...",
    voiceTypingActive: "শুনছি... কথা বলুন",
    voiceNotSupported: "ভয়েস টাইপিং সমর্থিত নয়।",
    openCamera: "ক্যামেরা খুলুন",
    uploadGallery: "গ্যালারি থেকে আপলোড করুন",
    send: "পাঠান",
    back: "ফিরে যান",
    close: "বন্ধ করুন",
    user: "ব্যবহারকারী",
    online: "অনলাইন",
    selectLanguage: "ভাষা নির্বাচন করুন (Select Language)",
    modalTitle: "কয়েন / ₹১০ নোট বিবরণ ও মূল্যায়ন",
    modalStep1Photo: "১. ক্যামেরায় ছবি তুলুন",
    modalStep1Btn: "ক্যামেরা খুলুন (Take Photo)",
    modalStep2Serial: "২. সিরিয়াল নম্বর / মুদ্রার ধরন",
    modalStep2Placeholder: "যেমন: 786 543210 বা 1947 কয়েন",
    modalStep3Price: "৩. আপনার প্রত্যাশিত বিক্রয় মূল্য (₹)",
    modalStep3Placeholder: "প্রত্যাশিত মূল্য (যেমন: 50000)",
    modalLiveEstimate: "আনুমানিক বাজার মূল্য (Live Estimate):",
    modalEstimateNote: "*অ্যাডমিন যাচাইয়ের পর চূড়ান্ত অর্থ প্রদান করা হবে।",
    modalSubmitBtn: "চ্যাটে জমা দিন (Submit to Chat)",
    alertEnterSerial: "অনুগ্রহ করে সিরিয়াল নম্বর লিখুন!",
    alertEnterPrice: "অনুগ্রহ করে প্রত্যাশিত মূল্য লিখুন!",
    adminPinPrompt: "অ্যাডমিন মোবাইল নম্বর বা পিন লিখুন:",
    adminPinInvalid: "ভুল অ্যাডমিন তথ্য।",
    submissionCardTitle: "মুদ্রা / নোট বিক্রয় বিবরণ",
    serialNumberLabel: "সিরিয়াল নম্বর",
    expectedPriceLabel: "বিক্রয় মূল্য",
    estimatedValueLabel: "আনুমানিক মূল্য",
    statusPending: "যাচাই প্রক্রিয়াধীন (Pending)",
    statusApproved: "অনুমোদিত (Approved)",
    statusRejected: "প্রত্যাখ্যাত (Rejected)",
    agentSubmissionReply: (serial, price, est) => 
      `আপনার কয়েন/নোট (${serial}) সফলভাবে জমা হয়েছে! প্রত্যাশিত মূল্য: ₹${price}, আনুমানিক মূল্য: ${est}। আমাদের দল শীঘ্রই যাচাই সম্পন্ন করবে।`,
    agentGeneralReply: (query) => 
      `ধন্যবাদ! "${query}" সংক্রান্ত: আপনার পুরোনো কয়েন বা নোট বিক্রি করতে উপরের "+ নতুন কয়েন / নোট নিবন্ধন করুন" বোতামে ক্লিক করুন।`
  },
  gu: {
    brandTitle: "Coin Selling and Buying",
    brandSubtitle: "જૂના સિક્કા અને ₹10 ની નોટોનું વેચાણ",
    liveConsole: "લાઇવ કન્સોલ",
    navMenu: "નેવિગેશન મેનુ",
    homeChat: "ચેટ કન્સોલ (Home)",
    registerCoinNote: "+ નવો સિક્કો / નોટ નોંધણી કરો",
    historyTitle: "સબમિશન ઇતિહાસ",
    historySubtitle: "અગાઉ સબમિટ કરેલા સિક્કા અને નોટો",
    noHistory: "હજી સુધી કોઈ સબમિશન નથી.",
    adminPanelTitle: "એડમિન પેનલ (Admin)",
    adminPanelSubtitle: "વેચનાર સૂચિ, વપરાશકર્તાઓ અને મૂલ્યાંકન",
    welcomeGreetingTitle: "જૂના સિક્કા અને નોટોના બજારમાં આપનું સ્વાગત છે",
    welcomeGreetingDesc: "તમારા જૂના 1 રૂપિયાના સિક્કા, ₹10 ની જૂની નોટો (786 સીરીયલ, જ્યોર્જ V) નો ફોટો મોકલીને સાચું મૂલ્ય મેળવો.",
    welcomeAgentMsg: "નમસ્તે! હું તમારો સિક્કા અને નોટ મૂલ્યાંકન સહાયક (AI Agent) છું. તમારા જૂના સિક્કા અથવા નોટનો ફોટો અથવા સીરીયલ નંબર મોકલો.",
    typeMessagePlaceholder: "સંદેશ અથવા સીરીયલ નંબર લખો...",
    voiceTypingActive: "સાંભળી રહ્યા છીએ... બોલો",
    voiceNotSupported: "વોઇસ ટાઇપિંગ ઉપલબ્ધ નથી.",
    openCamera: "કેમેરો ખોલો",
    uploadGallery: "ગેલેરીમાંથી અપલોડ કરો",
    send: "મોકલો",
    back: "પાછા જાઓ",
    close: "બંધ કરો",
    user: "વપરાશકર્તા",
    online: "ઓનલાઇન",
    selectLanguage: "ભાષા પસંદ કરો (Select Language)",
    modalTitle: "સિક્કો / ₹10 નોટ વિગતો અને મૂલ્ય",
    modalStep1Photo: "1. કેમેરાથી ફોટો લો",
    modalStep1Btn: "કેમેરો ખોલો (Take Photo)",
    modalStep2Serial: "2. સીરીયલ નંબર / સિક્કાનો પ્રકાર",
    modalStep2Placeholder: "દા.ત.: 786 543210 અથવા 1947 સિક્કો",
    modalStep3Price: "3. તમારી અપેક્ષિત વેચાણ કિંમત (₹)",
    modalStep3Placeholder: "અપેક્ષિત કિંમત (દા.ત.: 50000)",
    modalLiveEstimate: "અંદાજિત બજાર મૂલ્ય (Live Estimate):",
    modalEstimateNote: "*એડમિન ચકાસણી પછી અંતિમ રકમ ચૂકવવામાં આવશે.",
    modalSubmitBtn: "ચેટમાં મોકલો (Submit)",
    alertEnterSerial: "કૃપા કરીને સીરીયલ નંબર અથવા વિગતો દાખલ કરો!",
    alertEnterPrice: "કૃપા કરીને તમારી અપેક્ષિત કિંમત (₹) દાખલ કરો!",
    adminPinPrompt: "એડમિન મોબાઇલ નંબર અથવા પિન દાખલ કરો:",
    adminPinInvalid: "અમાન્ય એડમિન વિગતો.",
    submissionCardTitle: "વેચાણ વિગતો",
    serialNumberLabel: "સીરીયલ નંબર",
    expectedPriceLabel: "વેચાણ કિંમત",
    estimatedValueLabel: "અંદાજિત મૂલ્ય",
    statusPending: "ચકાસણી હેઠળ (Pending)",
    statusApproved: "મંજૂર (Approved)",
    statusRejected: "અસ્વીકાર્ય (Rejected)",
    agentSubmissionReply: (serial, price, est) => 
      `તમારી વસ્તુ (${serial}) સફળતાપૂર્વક નોંધાઈ ગઈ છે! અપેક્ષિત કિંમત: ₹${price}, અંદાજિત મૂલ્ય: ${est}. ટીમ ટૂંક સમયમાં ચકાસણી કરશે.`,
    agentGeneralReply: (query) => 
      `આભાર! "${query}" વિશે: તમારા જૂના સિક્કા અથવા નોટો વેચવા માટે ઉપરના "+ નવો સિક્કો / નોટ નોંધણી કરો" બટન પર ક્લિક કરો.`
  }
};

export function getTranslation(lang: string): TranslationStrings {
  return TRANSLATIONS[lang] || TRANSLATIONS['te'];
}
