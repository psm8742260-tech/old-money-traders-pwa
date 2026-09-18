import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, CoinRateItem } from './types';
import coinImg from './assets/images/old_1_rupee_coin_1789717347176.jpg';
import noteImg from './assets/images/old_10_rupee_note_1789717357922.jpg';
import { SUPPORTED_LANGUAGES, getTranslation } from './translations';
import { 
  ArrowLeft, 
  Menu,
  ShieldCheck,
  Bot, 
  History, 
  Plus, 
  Mic, 
  Scan, 
  Camera, 
  Send, 
  X, 
  Sparkles, 
  Clock, 
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  ChevronRight,
  ShoppingBag,
  BadgePercent,
  Users,
  Globe,
  Languages,
  Coins,
  Search
} from 'lucide-react';

interface UserChatProps {
  userId: string;
  isAdmin?: boolean;
  onOpenAdmin?: () => void;
  onBack: () => void;
}

export function UserChat({ userId, isAdmin, onOpenAdmin, onBack }: UserChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  
  // Multilingual State: persists in localStorage
  const [selectedLang, setSelectedLang] = useState<string>(() => {
    return localStorage.getItem('app_lang') || 'te';
  });
  const [showLangPicker, setShowLangPicker] = useState(false);

  const t = getTranslation(selectedLang);
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang) || SUPPORTED_LANGUAGES[0];

  const handleSelectLanguage = (code: string) => {
    setSelectedLang(code);
    localStorage.setItem('app_lang', code);
    setShowLangPicker(false);
  };

  // Navigation Drawer Feature State (opened by the Plus symbol)
  const [showNavDrawer, setShowNavDrawer] = useState(false);

  // Official Coin Rates Master State (దమ్మిడి నుండి రూపాయి & నోట్ల లైవ్ ధరలు)
  const [coinRates, setCoinRates] = useState<CoinRateItem[]>([]);
  const [showRateChartModal, setShowRateChartModal] = useState(false);
  const [rateChartSearch, setRateChartSearch] = useState('');
  const [rateChartCategory, setRateChartCategory] = useState<'all' | 'coin' | 'note'>('all');

  // Coin Registration & Valuation Modal State
  const [showValuationModal, setShowValuationModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [coinPhoto, setCoinPhoto] = useState<string>('');
  const [serialNumber, setSerialNumber] = useState<string>('');
  const [expectedPrice, setExpectedPrice] = useState<string>('');
  const [estimatedValue, setEstimatedValue] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);

  const directCameraInputRef = useRef<HTMLInputElement>(null);
  const modalCameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const fetchRates = async () => {
    try {
      const res = await fetch('/api/coin-rates');
      const data = await res.json();
      if (Array.isArray(data)) {
        setCoinRates(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      const data: ChatMessage[] = await res.json();
      setMessages(data.filter(m => m.userId === userId));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchRates();
    const interval = setInterval(() => {
      fetchMessages();
      fetchRates();
    }, 3000);
    return () => clearInterval(interval);
  }, [userId]);


  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Live estimated market value calculation based on serial number and expected price
  useEffect(() => {
    if (!serialNumber.trim() && !expectedPrice.trim()) {
      setEstimatedValue('');
      return;
    }

    const snLower = serialNumber.toLowerCase();
    const expNum = parseFloat(expectedPrice) || 0;

    let minEst = 10000;
    let maxEst = 35000;

    if (snLower.includes('786')) {
      minEst = Math.max(50000, expNum ? Math.round(expNum * 0.95) : 50000);
      maxEst = Math.max(250000, expNum ? Math.round(expNum * 1.4) : 250000);
    } else if (snLower.includes('1947') || snLower.includes('king') || snLower.includes('british') || snLower.includes('george')) {
      minEst = Math.max(30000, expNum ? Math.round(expNum * 0.9) : 30000);
      maxEst = Math.max(120000, expNum ? Math.round(expNum * 1.3) : 120000);
    } else if (expNum > 0) {
      minEst = Math.round(expNum * 0.85);
      maxEst = Math.round(expNum * 1.25);
    }

    setEstimatedValue(`₹${minEst.toLocaleString('en-IN')} - ₹${maxEst.toLocaleString('en-IN')}`);
  }, [serialNumber, expectedPrice]);

  const sendMessage = async (msg: Partial<ChatMessage>) => {
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...msg, userId, sender: 'user' })
    });
    fetchMessages();
  };

  const handleSendText = async () => {
    const userText = text.trim();
    if (!userText) return;
    
    setText('');
    await sendMessage({ text: userText, type: 'text', sender: 'user' });

    // AI Agent responds strictly in the user's selected language
    try {
      const res = await fetch('/api/agent-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          languageCode: currentLangObj.code,
          languageName: currentLangObj.name
        })
      });
      const data = await res.json();
      if (data.success && data.reply) {
        await sendMessage({ text: data.reply, type: 'text', sender: 'bot' });
      } else {
        await sendMessage({ text: t.agentGeneralReply(userText), type: 'text', sender: 'bot' });
      }
    } catch {
      await sendMessage({ text: t.agentGeneralReply(userText), type: 'text', sender: 'bot' });
    }
  };

  const handleDirectCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setCoinPhoto(base64);
      setShowValuationModal(true);
    };
    reader.readAsDataURL(file);
  };

  const handleModalPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setCoinPhoto(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      sendMessage({ text: `Uploaded ${type}`, type, mediaUrl: base64, sender: 'user' });
    };
    reader.readAsDataURL(file);
  };

  const submitCoinValuation = async () => {
    if (!serialNumber.trim()) {
      alert(t.alertEnterSerial);
      return;
    }
    if (!expectedPrice.trim()) {
      alert(t.alertEnterPrice);
      return;
    }

    const currentSerial = serialNumber.trim();
    const currentPrice = expectedPrice.trim();
    const currentEstimate = estimatedValue || `₹${currentPrice}`;
    const currentPhoto = coinPhoto;

    // Reset modal inputs
    setShowValuationModal(false);
    setCoinPhoto('');
    setSerialNumber('');
    setExpectedPrice('');
    setEstimatedValue('');

    // Save transaction for Admin
    await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userId, 
        status: 'pending', 
        type: 'sell',
        name: `User ${userId}`,
        phoneNumber: userId,
        date: new Date().toLocaleDateString(),
        serialNumber: currentSerial,
        expectedPrice: currentPrice,
        estimatedValue: currentEstimate,
        photoUrl: currentPhoto
      })
    });

    // Send styled card into chat console
    await sendMessage({
      type: 'coin_card',
      text: `${t.submissionCardTitle}:\n${t.serialNumberLabel}: ${currentSerial}\n${t.expectedPriceLabel}: ₹${currentPrice}\n${t.estimatedValueLabel}: ${currentEstimate}`,
      serialNumber: currentSerial,
      expectedPrice: currentPrice,
      estimatedValue: currentEstimate,
      mediaUrl: currentPhoto,
      status: 'pending',
      sender: 'user'
    });

    // Agent automatically replies in the chosen language!
    try {
      const res = await fetch('/api/agent-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `User submitted coin/note: Serial ${currentSerial}, Price ₹${currentPrice}`,
          languageCode: currentLangObj.code,
          languageName: currentLangObj.name,
          serialNumber: currentSerial,
          expectedPrice: currentPrice,
          estimatedValue: currentEstimate
        })
      });
      const data = await res.json();
      if (data.success && data.reply) {
        await sendMessage({ text: data.reply, type: 'text', sender: 'bot' });
      } else {
        await sendMessage({ 
          text: t.agentSubmissionReply(currentSerial, currentPrice, currentEstimate), 
          type: 'text', 
          sender: 'bot' 
        });
      }
    } catch {
      await sendMessage({ 
        text: t.agentSubmissionReply(currentSerial, currentPrice, currentEstimate), 
        type: 'text', 
        sender: 'bot' 
      });
    }
  };

  const handleAdminTabClick = () => {
    if (isAdmin && onOpenAdmin) {
      onOpenAdmin();
      return;
    }
    const entered = prompt(t.adminPinPrompt, "");
    if (entered === '8466062260' || entered?.toLowerCase() === 'psm8742260@gmail.com') {
      if (onOpenAdmin) onOpenAdmin();
    } else if (entered) {
      alert(t.adminPinInvalid);
    }
  };

  const toggleMic = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert(t.voiceNotSupported);
      return;
    }
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = currentLangObj.speechCode; // Dynamically uses selected language speech code!
      recognition.interimResults = false;
      
      setIsRecording(true);
      recognition.start();

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };

      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
    } catch (e) {
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-gradient-to-br from-pink-100 via-rose-50 to-pink-100 shadow-2xl overflow-hidden font-sans">
      
      {/* 1. TOP HEADER - Branded "Coin Selling and Buying" & Navigation Arrow (←) */}
      <div className="px-3.5 py-2.5 flex items-center justify-between border-b border-rose-200/70 bg-white/80 backdrop-blur-xs sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center space-x-2">
          {/* Arrow Left Button: Opens Navigation Features (Drawer) when pressed as requested */}
          <button 
            onClick={() => setShowNavDrawer(true)}
            className="p-1.5 text-gray-700 hover:text-black hover:bg-gray-100 rounded-full transition-colors active:scale-95"
            title={t.navMenu}
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
          
          {/* Branded Identity: Coin + Note + "Coin Selling and Buying" */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-gradient-to-br from-amber-50 to-amber-100/70 p-1 rounded-xl border border-amber-300 shadow-2xs">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400 shadow-2xs flex-shrink-0 bg-white" title="George V Coin">
                <img src={coinImg} alt="Coin" className="w-full h-full object-cover" />
              </div>
              <div className="w-11 h-7 rounded-md overflow-hidden border border-amber-400 shadow-2xs flex-shrink-0 bg-white" title="RBI 10 Rupee Note">
                <img src={noteImg} alt="10 Rupee Note" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="flex flex-col">
              <h1 className="text-xs sm:text-sm font-extrabold text-gray-950 tracking-tight leading-none">
                Coin Selling and Buying
              </h1>
              <span className="text-[10px] text-gray-500 font-medium mt-0.5">
                {t.brandSubtitle}
              </span>
            </div>
          </div>
        </div>

        {/* Right side: Clean space (Language button removed as requested) */}
        <div className="flex items-center space-x-1.5">
        </div>
      </div>

      {/* 2. ACTION BAR (History Icon + Live Rate Chart + Future Expansion Space + "+ New Coin Registration" Button) */}
      <div className="px-3 py-1.5 flex items-center justify-between border-b border-rose-200/60 bg-rose-50/70">
        <div className="flex items-center space-x-1.5">
          <button 
            onClick={() => setShowHistoryModal(true)}
            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors border border-rose-200/80 bg-white/80"
            title={t.historyTitle}
          >
            <History className="w-3.5 h-3.5 stroke-[1.8]" />
          </button>

          {/* Live Rates Chart Master Button - Orange Board */}
          <button 
            onClick={() => setShowRateChartModal(true)}
            className="h-8 flex items-center space-x-1.5 py-1.5 px-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg text-[11px] font-bold shadow-2xs transition-transform active:scale-95 flex-shrink-0"
            title="అధికారిక కాయిన్లు & నోట్ల ధరల పట్టిక"
          >
            <Coins className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">లైవ్ ధరల పట్టిక</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping ml-0.5"></span>
          </button>
        </div>

        {/* Future Feature Slot / Center Gap */}
        <div className="flex-1 mx-2 flex items-center justify-center">
          {/* Reserved gap for upcoming features / buttons */}
        </div>

        {/* New Coin Registration Button - Blue Board matching exact same size and height as Orange Board */}
        <button 
          onClick={() => setShowValuationModal(true)}
          className="h-8 flex items-center justify-center space-x-1.5 py-1.5 px-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-[11px] font-bold shadow-2xs transition-transform active:scale-95 flex-shrink-0"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="whitespace-nowrap">{t.registerCoinNote}</span>
        </button>
      </div>

      {/* 4. CHAT BODY & GREETING BANNER */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-pink-50/50 to-rose-50/70">
        {/* Welcome Greeting Banner with Small Coin & ₹10 Note Photos */}
        <div className="bg-gradient-to-r from-amber-50/70 via-blue-50/50 to-indigo-50/50 border border-amber-200/80 rounded-2xl p-3.5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-white p-1 rounded-lg border border-amber-200 shadow-2xs">
                <div className="w-6 h-6 rounded-full overflow-hidden border border-amber-400 flex-shrink-0">
                  <img src={coinImg} alt="Coin" className="w-full h-full object-cover" />
                </div>
                <div className="w-9 h-6 rounded-md overflow-hidden border border-amber-400 flex-shrink-0">
                  <img src={noteImg} alt="₹10 Note" className="w-full h-full object-cover" />
                </div>
              </div>
              <span className="text-xs font-bold text-gray-900">
                {t.welcomeGreetingTitle}
              </span>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              {t.online}
            </span>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed">
            {t.welcomeGreetingDesc}
          </p>
        </div>

        {/* Initial Agent Welcome Message when no messages exist */}
        {messages.length === 0 && (
          <div className="flex justify-start">
            <div className="max-w-[85%] bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-gray-900 rounded-2xl px-4 py-3 shadow-xs space-y-1">
              <div className="flex items-center space-x-1.5 text-[11px] font-bold text-blue-700">
                <Bot className="w-3.5 h-3.5" />
                <span>AI Agent ({currentLangObj.nativeName})</span>
              </div>
              <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                {t.welcomeAgentMsg}
              </p>
            </div>
          </div>
        )}

        {/* Messages List */}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.type === 'coin_card' ? (
              <div className="max-w-[88%] bg-white border-2 border-indigo-400 rounded-2xl p-3 shadow-md text-gray-800">
                <div className="flex items-center justify-between border-b pb-2 mb-2">
                  <span className="text-xs font-bold text-indigo-700 flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{t.submissionCardTitle}</span>
                  </span>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{t.statusPending}</span>
                  </span>
                </div>

                {msg.mediaUrl && (
                  <div className="w-full h-44 bg-gray-100 rounded-lg overflow-hidden mb-2.5 border">
                    <img src={msg.mediaUrl} alt="Coin" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="space-y-1.5 text-xs bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <p className="flex justify-between">
                    <span className="text-gray-500">{t.serialNumberLabel}:</span>
                    <span className="font-bold text-gray-900">{msg.serialNumber || 'N/A'}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">{t.expectedPriceLabel}:</span>
                    <span className="font-bold text-blue-700">₹{msg.expectedPrice || '0'}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">{t.estimatedValueLabel}:</span>
                    <span className="font-bold text-emerald-700">{msg.estimatedValue || t.statusPending}</span>
                  </p>
                </div>

                <div className="mt-2 text-[10px] text-gray-400 text-right">
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </div>
              </div>
            ) : msg.sender === 'bot' ? (
              <div className="max-w-[85%] bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-gray-900 rounded-2xl px-4 py-3 shadow-xs space-y-1">
                <div className="flex items-center space-x-1.5 text-[11px] font-bold text-blue-700">
                  <Bot className="w-3.5 h-3.5" />
                  <span>AI Agent ({currentLangObj.nativeName})</span>
                </div>
                <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                <div className="text-[10px] mt-1 text-right text-gray-400">
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </div>
              </div>
            ) : (
              <div className="max-w-[82%] p-3 rounded-2xl text-sm shadow-2xs bg-blue-600 text-white rounded-br-xs">
                {msg.type === 'image' && msg.mediaUrl && (
                  <img src={msg.mediaUrl} alt="Uploaded" className="w-full rounded-lg mb-2 max-h-60 object-cover" />
                )}
                <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                <p className="text-[10px] mt-1 text-right text-blue-100">
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </p>
              </div>
            )}
          </div>
        ))}
        <div ref={chatBottomRef} />
      </div>

      {/* Hidden File / Camera Inputs */}
      <input 
        type="file" 
        ref={directCameraInputRef} 
        className="hidden" 
        accept="image/*" 
        capture="environment"
        onChange={handleDirectCameraCapture} 
      />
      <input 
        type="file" 
        ref={galleryInputRef} 
        className="hidden" 
        accept="image/*,video/*" 
        onChange={handleGalleryUpload} 
      />

      {/* 5. FLOATING BOTTOM INPUT BOX */}
      <div className="p-4 bg-rose-50/80 border-t border-rose-200/60">
        <div className="border border-rose-200/80 rounded-2xl p-3 shadow-sm bg-white focus-within:ring-2 focus-within:ring-rose-400/40 focus-within:border-rose-400 transition-all">
          {/* Text Area */}
          <textarea 
            rows={2}
            placeholder={t.typeMessagePlaceholder}
            className="w-full text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none bg-transparent"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendText();
              }
            }}
          />

          {/* Action Icons Row (Mic, Plus, Camera Lens) */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-1">
            <div className="text-[11px] text-gray-400">
              {isRecording ? (
                <span className="text-red-500 font-bold animate-pulse">● {t.voiceTypingActive}</span>
              ) : (
                <span className="flex items-center space-x-1">
                  <Globe className="w-3 h-3 inline text-blue-600" />
                  <span>{currentLangObj.nativeName}</span>
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {/* Voice Mic Button */}
              <button 
                type="button"
                onClick={toggleMic}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  isRecording 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200/80'
                }`}
                title={t.voiceTypingActive}
              >
                <Mic className="w-4 h-4" />
              </button>

              {/* Plus Button in soft purple circle */}
              <button 
                type="button"
                onClick={() => setShowValuationModal(true)}
                className="w-9 h-9 rounded-full bg-purple-100/70 hover:bg-purple-200 text-purple-700 flex items-center justify-center border border-purple-200 transition-transform active:scale-95"
                title={t.registerCoinNote}
              >
                <Plus className="w-5 h-5 stroke-[2.2]" />
              </button>

              {/* Camera Lens Button */}
              <button 
                type="button"
                onClick={() => directCameraInputRef.current?.click()}
                className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-800 text-white flex items-center justify-center shadow-sm transition-transform active:scale-95"
                title={t.openCamera}
              >
                <Scan className="w-5 h-5" />
              </button>

              {/* Send Button if text typed */}
              {text.trim() && (
                <button 
                  type="button"
                  onClick={handleSendText}
                  className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-sm transition-transform active:scale-95"
                  title={t.send}
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- NAVIGATION FEATURE DRAWER (Opened by Arrow (←) Button) --- */}
      {showNavDrawer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex justify-start animate-in fade-in duration-150">
          {/* Drawer Content */}
          <div className="bg-gradient-to-b from-pink-50 via-rose-50 to-pink-100 w-[88%] max-w-sm h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-200 z-10">
            <div>
              {/* Exact Brand Showcase matching Screenshot_20260918_135005.jpg */}
              <div className="relative bg-gradient-to-b from-rose-100/90 via-rose-50/70 to-pink-50/50 pt-5 pb-4 px-4 flex flex-col items-center border-b border-rose-200/80 shadow-2xs">
                {/* Close Button at top right */}
                <button 
                  onClick={() => setShowNavDrawer(false)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-gray-950 transition-colors shadow-2xs border border-rose-200/80"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* 1. Top Round Coin inside white circular badge */}
                <div className="w-24 h-24 rounded-full bg-white shadow-md flex items-center justify-center p-2 border border-rose-200/90 transition-transform hover:scale-105">
                  <div className="w-full h-full rounded-full overflow-hidden border border-amber-300 shadow-inner bg-amber-50/40">
                    <img src={coinImg} alt="George V Coin" className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* 2. Middle Vintage Note inside white rounded rectangular card */}
                <div className="w-60 mt-3 bg-white rounded-2xl shadow-md p-2 border border-rose-200/90 flex items-center justify-center transition-transform hover:scale-105">
                  <div className="w-full h-28 rounded-xl overflow-hidden border border-amber-300/80 shadow-2xs bg-amber-50/30">
                    <img src={noteImg} alt="10 Rupee Note" className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* 3. Title: Coin Selling and Buying */}
                <h2 className="mt-3.5 text-xl font-black text-gray-950 tracking-tight text-center">
                  Coin Selling and Buying
                </h2>
                <p className="text-xs text-gray-500 font-medium text-center mt-1">
                  {t.brandSubtitle}
                </p>
              </div>

              {/* Navigation Buttons: One below the other, neatly organized and properly connected */}
              <div className="p-3.5 space-y-2.5">
                {/* 1. Chat Console */}
                <button
                  onClick={() => setShowNavDrawer(false)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200/80 hover:border-blue-300 hover:bg-blue-50/40 text-gray-800 font-semibold text-xs transition-all active:scale-98"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 shadow-2xs">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-gray-900">{t.homeChat}</div>
                      <div className="text-[10px] text-gray-500">{t.liveConsole}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                {/* 2. Live Rates Chart Master (1 దమ్మిడి నుండి 1 రూపాయి & నోట్లు) */}
                <button
                  onClick={() => {
                    setShowNavDrawer(false);
                    setShowRateChartModal(true);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-amber-200/90 hover:border-amber-400 hover:bg-amber-50/60 text-gray-800 font-semibold text-xs transition-all active:scale-98"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                      <Coins className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-gray-950 flex items-center space-x-1.5">
                        <span>అధికారిక లైవ్ ధరల పట్టిక</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.5 rounded-full font-bold">లైవ్</span>
                      </div>
                      <div className="text-[10px] text-amber-800 font-medium">1 దమ్మిడి నుండి రూపాయి & పాత నోట్ల రేట్లు</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-500" />
                </button>

                {/* 3. Register Coin / Note */}
                <button
                  onClick={() => {
                    setShowNavDrawer(false);
                    setShowValuationModal(true);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-emerald-200/80 hover:border-emerald-400 hover:bg-emerald-50/50 text-gray-800 font-semibold text-xs transition-all active:scale-98"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 shadow-2xs">
                      <Plus className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-emerald-950">{t.registerCoinNote}</div>
                      <div className="text-[10px] text-emerald-600 font-medium">కెమెరాతో ఫోటో తీయండి</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-emerald-400" />
                </button>

                {/* 4. History */}
                <button
                  onClick={() => {
                    setShowNavDrawer(false);
                    setShowHistoryModal(true);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200/80 hover:border-amber-300 hover:bg-amber-50/40 text-gray-800 font-semibold text-xs transition-all active:scale-98"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 shadow-2xs">
                      <History className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-gray-900">{t.historyTitle}</div>
                      <div className="text-[10px] text-gray-500">
                        {messages.filter(m => m.type === 'coin_card').length} నమోదులు (Records)
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                {/* 4. Language Selector Row */}
                <button
                  onClick={() => {
                    setShowNavDrawer(false);
                    setShowLangPicker(true);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200/80 hover:border-indigo-300 hover:bg-indigo-50/40 text-gray-800 font-semibold text-xs transition-all active:scale-98"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 shadow-2xs">
                      <Languages className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-gray-900">{t.selectLanguage}</div>
                      <div className="text-[10px] text-indigo-600 font-bold">{currentLangObj.nativeName} ({currentLangObj.name})</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                {/* Divider */}
                <div className="pt-2 pb-1 border-t border-gray-100 px-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {t.navMenu}
                  </span>
                </div>

                {/* 5. ADMIN PANEL (Master Access) */}
                <button
                  onClick={() => {
                    setShowNavDrawer(false);
                    if (onOpenAdmin) {
                      onOpenAdmin();
                    } else {
                      handleAdminTabClick();
                    }
                  }}
                  className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white shadow-md flex items-center justify-between transition-all transform active:scale-98"
                >
                  <div className="flex items-center space-x-3 text-left">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white flex-shrink-0 shadow-2xs">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-xs">{t.adminPanelTitle}</span>
                        <span className="bg-amber-400 text-gray-950 font-black text-[9px] px-1.5 py-0.2 rounded">
                          Master
                        </span>
                      </div>
                      <p className="text-[10px] text-purple-100 mt-0.5 leading-tight">
                        {t.adminPanelSubtitle}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/80" />
                </button>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/80 text-[11px] text-gray-600 flex items-center justify-between">
              <span className="font-mono text-[10px] text-gray-500">ID: {userId}</span>
              <span className="text-emerald-600 font-bold flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{t.online}</span>
              </span>
            </div>
          </div>

          {/* Backdrop click to close */}
          <div className="flex-1" onClick={() => setShowNavDrawer(false)}></div>
        </div>
      )}

      {/* --- POPUP / MODAL: COIN & NOTE VALUATION --- */}
      {showValuationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 bg-amber-50 p-1 rounded-lg border border-amber-200">
                  <div className="w-5 h-5 rounded-full overflow-hidden border border-amber-400 flex-shrink-0">
                    <img src={coinImg} alt="Coin" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-8 h-5 rounded-md overflow-hidden border border-amber-400 flex-shrink-0">
                    <img src={noteImg} alt="₹10" className="w-full h-full object-cover" />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 text-sm">
                  {t.modalTitle}
                </h3>
              </div>
              <button onClick={() => setShowValuationModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-sm">
              {/* Mobile Camera Option */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  1. {t.modalStep1Photo}
                </label>
                <input 
                  type="file" 
                  ref={modalCameraInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  capture="environment"
                  onChange={handleModalPhotoUpload} 
                />
                <button
                  type="button"
                  onClick={() => modalCameraInputRef.current?.click()}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 py-2.5 px-3 rounded-xl font-semibold transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  <span>{t.modalStep1Btn}</span>
                </button>

                {coinPhoto && (
                  <div className="mt-2 relative w-full h-36 rounded-xl overflow-hidden border-2 border-blue-500 shadow-sm">
                    <img src={coinPhoto} alt="Coin Preview" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setCoinPhoto('')}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 shadow"
                      title={t.close}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Select from Master Rate Chart */}
              {coinRates.length > 0 && (
                <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold text-amber-950 flex items-center space-x-1">
                      <Coins className="w-3.5 h-3.5 text-amber-600" />
                      <span>అధికారిక జాబితా నుండి ఎంచుకోండి:</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowValuationModal(false);
                        setShowRateChartModal(true);
                      }}
                      className="text-[10px] text-blue-700 font-bold hover:underline"
                    >
                      పూర్తి ధరల పట్టిక →
                    </button>
                  </div>
                  <select
                    className="w-full border border-amber-300 bg-white rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    onChange={e => {
                      const item = coinRates.find(c => c.id === e.target.value);
                      if (item) {
                        setSerialNumber(`${item.nameTe} (${item.nameEn})`);
                        setExpectedPrice(item.rate.replace(/,/g, ''));
                        setEstimatedValue(`₹${item.rate} (కంపెనీ అధికారిక కొనుగోలు ధర)`);
                      }
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>-- కాయిన్ లేదా నోటు ఎంచుకోండి --</option>
                    {coinRates.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.category === 'coin' ? '🪙' : '💵'} {c.nameTe} ({c.nameEn}) — రేటు: ₹{c.rate}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Serial Number */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  2. {t.serialNumberLabel}
                </label>
                <input 
                  type="text" 
                  placeholder={t.modalStep2Placeholder}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  value={serialNumber}
                  onChange={e => setSerialNumber(e.target.value)}
                />
              </div>

              {/* Expected Price */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  3. {t.expectedPriceLabel}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                  <input 
                    type="number" 
                    placeholder={t.modalStep3Placeholder}
                    className="w-full border border-gray-300 rounded-xl pl-8 pr-3 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                    value={expectedPrice}
                    onChange={e => setExpectedPrice(e.target.value)}
                  />
                </div>
              </div>

              {/* Estimated Value */}
              {estimatedValue && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5">
                  <div className="flex items-center justify-between text-xs text-emerald-800 font-bold mb-1">
                    <span>{t.estimatedValueLabel} (Live Estimate):</span>
                    <span className="bg-emerald-200/80 px-2 py-0.5 rounded text-[10px]">Active</span>
                  </div>
                  <p className="text-lg font-extrabold text-emerald-700">{estimatedValue}</p>
                  <p className="text-[11px] text-emerald-600 mt-0.5 leading-snug">
                    *{t.modalEstimateNote}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={submitCoinValuation}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-xl shadow-md transition-transform active:scale-98 flex items-center justify-center space-x-2"
              >
                <span>{t.modalSubmitBtn}</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- POPUP / MODAL: HISTORY --- */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-900 text-base flex items-center space-x-2">
                <History className="w-5 h-5 text-gray-700" />
                <span>{t.historyTitle}</span>
              </h3>
              <button onClick={() => setShowHistoryModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              {messages.filter(m => m.type === 'coin_card').length === 0 ? (
                <p className="text-center text-gray-400 text-xs py-8">{t.noHistory}</p>
              ) : (
                messages.filter(m => m.type === 'coin_card').map((card, idx) => (
                  <div key={idx} className="p-3 border rounded-xl bg-gray-50 space-y-1 text-xs">
                    <p className="font-bold text-gray-800">{t.serialNumberLabel}: {card.serialNumber}</p>
                    <p className="text-blue-600">{t.expectedPriceLabel}: ₹{card.expectedPrice}</p>
                    <p className="text-emerald-700 font-medium">{t.estimatedValueLabel}: {card.estimatedValue}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- POPUP / MODAL: LANGUAGE SELECTOR --- */}
      {showLangPicker && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Languages className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{t.selectLanguage}</h3>
                  <p className="text-[11px] text-gray-500">Select your preferred language</p>
                </div>
              </div>
              <button onClick={() => setShowLangPicker(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Language Selection Grid */}
            <div className="flex-1 overflow-y-auto space-y-2 py-1 pr-0.5">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = lang.code === selectedLang;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLang(lang.code);
                      localStorage.setItem('app_language', lang.code);
                      setShowLangPicker(false);
                      // Add feedback message in chat in the newly chosen language
                      setMessages(prev => [
                        ...prev,
                        {
                          userId,
                          type: 'text',
                          sender: 'bot',
                          text: lang.code === 'te' 
                            ? `భాష తెలుగు కు మార్చబడింది. నేను మీకు తెలుగులోనే సమాధానాలు ఇస్తాను. మీ పాత కాయిన్లు లేదా ₹10 నోట్ల వివరాలు పంపండి!`
                            : `Language changed to ${lang.name} (${lang.nativeName}). I will assist you in this language. Please share your coin/note details!`,
                          timestamp: new Date().toISOString()
                        }
                      ]);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-800'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold leading-tight">{lang.nativeName}</span>
                      <span className="text-[11px] text-gray-500">{lang.name}</span>
                    </div>

                    {isSelected && (
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shadow-2xs">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* --- POPUP / MODAL: OFFICIAL LIVE RATE CHART (1 దమ్మిడి నుండి 1 రూపాయి & నోట్లు) --- */}
      {showRateChartModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-5 shadow-2xl space-y-3.5 max-h-[90vh] flex flex-col border border-gray-100">
            {/* Header */}
            <div className="flex items-start justify-between border-b pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-tight">
                      అధికారిక లైవ్ ధరల పట్టిక
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      1 దమ్మిడి నుండి 1 రూపాయి & పాత నోట్ల కంపెనీ కొనుగోలు ధరలు
                    </p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowRateChartModal(false)} 
                className="text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Indicator Banner */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-bold text-emerald-900">అడ్మిన్ నిర్ణయించిన లైవ్ మార్కెట్ కొనుగోలు ధరలు</span>
              </div>
              <span className="text-[10px] font-bold bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full">
                కంపెనీ గ్యారెంటీ
              </span>
            </div>

            {/* Search and Category Filter */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="కాయిన్ లేదా నోటు పేరుతో వెతకండి (ఉదా: దమ్మిడి, అణా, వెండి, 786)..."
                  value={rateChartSearch}
                  onChange={e => setRateChartSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setRateChartCategory('all')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                    rateChartCategory === 'all'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  అన్నీ ({coinRates.length})
                </button>
                <button
                  onClick={() => setRateChartCategory('coin')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                    rateChartCategory === 'coin'
                      ? 'bg-amber-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  నాణేలు ({coinRates.filter(c => c.category === 'coin').length})
                </button>
                <button
                  onClick={() => setRateChartCategory('note')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                    rateChartCategory === 'note'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  నోట్లు ({coinRates.filter(c => c.category === 'note').length})
                </button>
              </div>
            </div>

            {/* Scrollable Coin Rates List (Ordered chronologically from 1 Dammidi onwards) */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5">
              {coinRates
                .filter(item => {
                  if (rateChartCategory !== 'all' && item.category !== rateChartCategory) return false;
                  if (!rateChartSearch.trim()) return true;
                  const q = rateChartSearch.toLowerCase();
                  return (
                    item.nameTe.toLowerCase().includes(q) ||
                    item.nameEn.toLowerCase().includes(q) ||
                    item.denomination.toLowerCase().includes(q) ||
                    item.era.toLowerCase().includes(q)
                  );
                })
                .map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3 border border-gray-200 hover:border-amber-400 bg-white rounded-xl shadow-2xs space-y-2 transition-all hover:bg-amber-50/20"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start space-x-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 border border-amber-300 flex items-center justify-center text-sm flex-shrink-0">
                          {item.category === 'coin' ? '🪙' : '💵'}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-mono text-[11px] font-bold text-gray-400">#{idx + 1}</span>
                            <h4 className="text-xs font-bold text-gray-950">{item.nameTe}</h4>
                            <span className="text-[10px] text-gray-500">({item.nameEn})</span>
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            కాలం: {item.era} • {item.description}
                          </p>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold whitespace-nowrap flex-shrink-0 ${
                        item.rarity === 'Ultra Rare'
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : item.rarity === 'Rare'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-blue-100 text-blue-700 border border-blue-200'
                      }`}>
                        {item.rarityTe || item.rarity}
                      </span>
                    </div>

                    {/* Price and Sell Action */}
                    <div className="flex items-center justify-between pt-1.5 border-t border-gray-100 bg-gray-50/60 -mx-3 -mb-3 p-2.5 rounded-b-xl">
                      <div>
                        <span className="text-[10px] text-gray-500 font-medium">కంపెనీ కొనుగోలు ధర:</span>
                        <div className="text-sm font-extrabold text-emerald-700 font-mono">
                          ₹{item.rate}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setShowRateChartModal(false);
                          setSerialNumber(`${item.nameTe} (${item.nameEn})`);
                          setExpectedPrice(item.rate.replace(/,/g, ''));
                          setEstimatedValue(`₹${item.rate} (కంపెనీ అధికారిక కొనుగోలు ధర)`);
                          setShowValuationModal(true);
                        }}
                        className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-2xs transition-colors"
                      >
                        <span>ఇప్పుడే అమ్మండి</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

              {coinRates.length === 0 && (
                <div className="py-8 text-center text-gray-400 text-xs">
                  ధరల పట్టిక లోడ్ అవుతోంది...
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

