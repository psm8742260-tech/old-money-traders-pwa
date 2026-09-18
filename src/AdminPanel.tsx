import React, { useState, useEffect } from 'react';
import { ChatMessage, Transaction, CoinRateItem } from './types';
import coinImg from './assets/images/old_1_rupee_coin_1789717347176.jpg';
import noteImg from './assets/images/old_10_rupee_note_1789717357922.jpg';
import { 
  LogOut, 
  CheckCircle, 
  XCircle, 
  Send, 
  MessageCircle, 
  Users, 
  ShoppingBag, 
  BadgePercent, 
  Search, 
  Clock, 
  ArrowLeft,
  Sparkles,
  Phone,
  Calendar,
  DollarSign,
  Save,
  RotateCcw,
  Eye,
  Tag,
  Coins,
  Layers,
  Check,
  Smartphone,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

interface AdminPanelProps {
  onBackToChat?: () => void;
  onLogout: () => void;
}

export function AdminPanel({ onBackToChat, onLogout }: AdminPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  
  // Dedicated Tabs requested by user:
  // 1. 'users': యూజర్ల రిజిస్ట్రేషన్ ట్యాబ్ (Registered Users)
  // 2. 'sellers': అమ్మే వాళ్ళు రిజిస్ట్రేషన్ ట్యాబ్ (Sellers & Coin/Note Submissions)
  // 3. 'pricing': రేట్ ని ధర నిర్ణయం చేసే ట్యాబ్ (Price Valuation & Decision with ₹10 to ₹4 Commission)
  // 4. 'chat': లైవ్ కస్టమర్ చాట్ ట్యాబ్ (Customer Chat)
  // 5. 'pwa': ప్రత్యేక పసుపు రంగు పిడబ్ల్యూఏ సిస్టమ్ ట్యాబ్ (Yellow PWA System Tab)
  const [activeTab, setActiveTab] = useState<'users' | 'sellers' | 'pricing' | 'chat' | 'pwa'>('sellers');
  
  const [decisionInput, setDecisionInput] = useState<Record<string, string>>({});
  const [finalPriceInput, setFinalPriceInput] = useState<Record<string, string>>({});
  const [searchFilter, setSearchFilter] = useState('');

  // Coin Rates Master State (దమ్మిడి నుండి రూపాయి & నోట్ల అధికారిక ధరల నిర్వహణ)
  const [coinRates, setCoinRates] = useState<CoinRateItem[]>([]);
  const [editedRates, setEditedRates] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedSuccessId, setSavedSuccessId] = useState<string | null>(null);
  const [ratesSearch, setRatesSearch] = useState('');
  const [ratesCategory, setRatesCategory] = useState<'all' | 'coin' | 'note'>('all');
  const [pricingSubTab, setPricingSubTab] = useState<'master_rates' | 'user_submissions'>('master_rates');

  const fetchData = async () => {
    try {
      const [msgRes, txRes, rateRes] = await Promise.all([
        fetch('/api/messages').catch(() => null),
        fetch('/api/transactions').catch(() => null),
        fetch('/api/coin-rates').catch(() => null)
      ]);
      if (msgRes && msgRes.ok) {
        const msgs = await msgRes.json();
        if (Array.isArray(msgs)) setMessages(msgs);
      }
      if (txRes && txRes.ok) {
        const txs = await txRes.json();
        if (Array.isArray(txs)) setTransactions(txs);
      }
      if (rateRes && rateRes.ok) {
        const rates = await rateRes.json();
        if (Array.isArray(rates)) setCoinRates(rates);
      }
    } catch {
      // Quietly handle network fluctuation
    }
  };

  const handleSaveRate = async (item: CoinRateItem) => {
    const newRate = editedRates[item.id] !== undefined ? editedRates[item.id] : item.rate;
    setSavingId(item.id);
    try {
      const res = await fetch(`/api/coin-rates/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rate: newRate })
      });
      const data = await res.json();
      if (data.success) {
        setSavedSuccessId(item.id);
        setTimeout(() => setSavedSuccessId(null), 2500);
        // Refresh rates
        const rateRes = await fetch('/api/coin-rates');
        const updated = await rateRes.json();
        if (Array.isArray(updated)) setCoinRates(updated);
      }
    } catch (err) {
      console.error(err);
      alert('ధర సేవ్ చేయడంలో లోపం ఏర్పడింది.');
    } finally {
      setSavingId(null);
    }
  };

  const handleSaveAllRates = async () => {
    const updates = Object.entries(editedRates).map(([id, rate]) => ({ id, rate }));
    if (updates.length === 0) {
      alert("ధరలలో ఎటువంటి మార్పులు లేవు. మార్చిన తర్వాత సేవ్ చేయండి.");
      return;
    }
    try {
      const res = await fetch('/api/coin-rates/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      });
      const data = await res.json();
      if (data.success) {
        alert("అన్ని ధరలు విజయవంతంగా సేవ్ అయ్యాయి! ఇవి నేరుగా యూజర్లకు కనిపిస్తాయి.");
        setEditedRates({});
        const rateRes = await fetch('/api/coin-rates');
        const updated = await rateRes.json();
        if (Array.isArray(updated)) setCoinRates(updated);
      }
    } catch (err) {
      console.error(err);
      alert('సేవ్ చేయడంలో లోపం ఏర్పడింది.');
    }
  };

  const handleResetRates = async () => {
    if (!confirm("అన్ని ధరలను ప్రామాణిక డిఫాల్ట్ రేట్లకు రీసెట్ చేయాలనుకుంటున్నారా?")) return;
    try {
      const res = await fetch('/api/coin-rates/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setCoinRates(data.coinRates);
        setEditedRates({});
        alert("ధరలు డిఫాల్ట్ విలువలకు పునరుద్ధరించబడ్డాయి.");
      }
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleReply = async () => {
    if (!replyText.trim() || !selectedUserId) return;
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: selectedUserId, sender: 'admin', text: replyText, type: 'text' })
    });
    setReplyText('');
    fetchData();
  };

  // Price Valuation & Decision Handler (రేట్ ని ధర నిర్ణయం చేసే ట్యాబ్ with ₹10 to ₹4 Commission)
  const handleValuationDecision = async (tx: Transaction, status: 'approved' | 'rejected') => {
    const fixedRateStr = finalPriceInput[tx.id || ''] || tx.expectedPrice || '';
    const note = decisionInput[tx.id || ''] || '';

    const numVal = parseFloat(fixedRateStr.replace(/,/g, '')) || 0;
    const adminCommission = Math.round(numVal * 0.40); // 40% commission (₹10 కి ₹4 రూపాయలు)
    const userPayout = numVal - adminCommission; // 60% user net payout

    let combinedDecision = '';
    if (fixedRateStr) {
      combinedDecision += `నిర్ణయించిన మొత్తం విలువ: ₹${numVal.toLocaleString('en-IN')} | కంపెనీ కమిషన్ (₹10 కి ₹4): ₹${adminCommission.toLocaleString('en-IN')} | యూజర్ నికర చెల్లింపు: ₹${userPayout.toLocaleString('en-IN')}`;
    }
    if (note) {
      combinedDecision += (combinedDecision ? ` | గమనిక: ${note}` : note);
    }

    // Update Transaction on server
    await fetch(`/api/transactions/${tx.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        status, 
        adminDecision: combinedDecision || (status === 'approved' ? 'ఆమోదించబడింది' : 'తిరస్కరించబడింది'),
        expectedPrice: fixedRateStr || tx.expectedPrice
      })
    });

    // Notify User via Chat automatically
    let msgText = `🔔 అడ్మిన్ మీ కాయిన్/నోటు (SN: ${tx.serialNumber}) కోసం నిర్ణయం:\n`;
    msgText += status === 'approved' 
      ? `✅ మీ కాయిన్ ఆమోదించబడింది!` 
      : `❌ క్షమించండి, ఇది ఆమోదించబడలేదు.`;
    
    if (fixedRateStr) {
      msgText += `\n💰 నిర్ణయించిన మొత్తం విలువ: ₹${numVal.toLocaleString('en-IN')}`;
      msgText += `\n💼 అడ్మిన్ సర్వీస్ కమిషన్ (₹10 కి ₹4 / 40%): ₹${adminCommission.toLocaleString('en-IN')}`;
      msgText += `\n💵 మీకు చెల్లించే నికర మొత్తం (Net Payout): ₹${userPayout.toLocaleString('en-IN')}`;
    }
    if (note) {
      msgText += `\n📝 అడ్మిన్ నోట్: ${note}`;
    }

    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userId: tx.userId, 
        sender: 'admin', 
        text: msgText, 
        type: 'text' 
      })
    });

    fetchData();
    alert(`ధర మరియు కమిషన్ లెక్కలు (₹10 కి ₹4) విజయవంతంగా యూజర్‌కు పంపబడ్డాయి!`);
  };

  // Extract distinct users and stats
  const allUserIds = Array.from(new Set([...messages.map(m => m.userId), ...transactions.map(t => t.userId)]));
  
  // Sellers: Users who submitted sell requests
  const sellersList = transactions.filter(t => t.type === 'sell' || !t.type);
  
  // Pending pricing reviews
  const pendingValuations = transactions.filter(t => t.status === 'pending');

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-pink-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-gray-900 text-white px-4 py-3.5 flex flex-wrap items-center justify-between shadow-md sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          {onBackToChat && (
            <button 
              onClick={onBackToChat}
              className="flex items-center space-x-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border border-gray-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>చాట్ కన్సోల్ (Chat)</span>
            </button>
          )}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 bg-gray-800 p-1 rounded-lg border border-gray-700">
              <div className="w-6 h-6 rounded-full overflow-hidden border border-amber-400 flex-shrink-0" title="పాత 1 రూపాయి కాయిన్">
                <img src={coinImg} alt="Coin" className="w-full h-full object-cover" />
              </div>
              <div className="w-9 h-6 rounded-md overflow-hidden border border-amber-400 flex-shrink-0" title="పాత ₹10 నోటు">
                <img src={noteImg} alt="Note" className="w-full h-full object-cover" />
              </div>
            </div>
            <h1 className="text-base font-bold text-white flex items-center space-x-2">
              <span>అడ్మిన్ ప్యానెల్ (Admin Panel)</span>
              <span className="bg-purple-600 text-[10px] uppercase px-2 py-0.5 rounded font-mono">Master</span>
            </h1>
          </div>
        </div>

        <button 
          onClick={onLogout} 
          className="flex items-center space-x-1.5 bg-red-600/90 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>లాగౌట్</span>
        </button>
      </header>

      {/* Dedicated Tab Navigation Bar (యూజర్ల రిజిస్ట్రేషన్ | అమ్మే వాళ్ళు రిజిస్ట్రేషన్ | ధర నిర్ణయం | లైవ్ చాట్) */}
      <div className="bg-white border-b border-gray-200 px-3 py-1.5 flex items-center space-x-1.5 overflow-x-auto shadow-xs">
        {/* Tab 1: అమ్మే వాళ్ళు రిజిస్ట్రేషన్ (Sellers) - 40% Width Reduced */}
        <button
          onClick={() => setActiveTab('sellers')}
          className={`flex items-center justify-center space-x-1 py-1.5 px-1.5 w-[135px] rounded-xl text-[9.5px] font-bold transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'sellers'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">అమ్మే వాళ్ళు రిజిస్ట్రేషన్ ట్యాబ్ ({sellersList.length})</span>
        </button>

        {/* Tab 2: రేట్ ని ధర నిర్ణయం చేసే ట్యాబ్ (Price Valuation) */}
        <button
          onClick={() => setActiveTab('pricing')}
          className={`flex items-center space-x-2 py-2 px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap relative ${
            activeTab === 'pricing'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <BadgePercent className="w-4 h-4" />
          <span>ధర నిర్ణయం ట్యాబ్ ({pendingValuations.length})</span>
          {pendingValuations.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-1 right-1 animate-pulse"></span>
          )}
        </button>

        {/* Tab 3: యూజర్ల రిజిస్ట్రేషన్ ట్యాబ్ (Registered Users) */}
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center space-x-2 py-2 px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'users'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>యూజర్ల రిజిస్ట్రేషన్ ట్యాబ్ ({allUserIds.length})</span>
        </button>

        {/* Tab 4: లైవ్ కస్టమర్ చాట్ ట్యాబ్ */}
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center space-x-2 py-2 px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'chat'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>కస్టమర్ చాట్ ట్యాబ్</span>
        </button>

        {/* Tab 5: ప్రత్యేక పసుపు రంగు పిడబ్ల్యూఏ సిస్టమ్ ట్యాబ్ (Yellow PWA System Tab) */}
        <button
          onClick={() => setActiveTab('pwa')}
          className={`flex items-center space-x-2 py-2 px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
            activeTab === 'pwa'
              ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-sm font-extrabold ring-2 ring-amber-300'
              : 'bg-amber-100/90 text-amber-900 border-amber-300 hover:bg-amber-200'
          }`}
          title="యాప్ పిడబ్ల్యూఏ & నెట్‌వర్క్ ప్రొటెక్షన్ సిస్టమ్"
        >
          <Smartphone className="w-4 h-4 text-amber-800" />
          <span>⚡ పిడబ్ల్యూఏ (PWA) సిస్టమ్</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
        </button>
      </div>

      {/* Main Tab Content View */}
      <div className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto overflow-y-auto">

        {/* ========================================================= */}
        {/* 1. అమ్మే వాళ్ళు రిజిస్ట్రేషన్ ట్యాబ్ (Sellers Tab) */}
        {/* ========================================================= */}
        {activeTab === 'sellers' && (
          <div className="space-y-4">
            {/* Ultra Slim Compact Header Board (70% Height Reduced) */}
            <div className="flex items-center justify-between gap-2 bg-white px-2.5 py-1 rounded-lg border border-gray-200 shadow-2xs">
              <div className="flex items-center space-x-1.5 min-w-0">
                <ShoppingBag className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="text-[11px] font-bold text-gray-900 whitespace-nowrap">
                  అమ్మే వాళ్ళ రిజిస్ట్రేషన్లు
                </span>
              </div>

              {/* Filter / Search Compact */}
              <div className="relative w-36 sm:w-56 shrink-0">
                <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="సెర్చ్ / Search..."
                  value={searchFilter}
                  onChange={e => setSearchFilter(e.target.value)}
                  className="w-full pl-6 pr-2 py-0.5 bg-gray-50 border border-gray-200 rounded text-[10px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sellersList
                .filter(s => 
                  (s.serialNumber || '').toLowerCase().includes(searchFilter.toLowerCase()) || 
                  (s.userId || '').toLowerCase().includes(searchFilter.toLowerCase())
                )
                .slice().reverse().map(item => (
                  <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-2 shadow-xs hover:shadow-sm transition-shadow flex flex-col gap-1 max-h-[120px] overflow-hidden">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center space-x-3 flex-1">
                        {item.photoUrl ? (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border">
                            <img src={item.photoUrl} alt="Coin/Note" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-gray-50 border rounded-lg flex items-center justify-center text-gray-400 text-[10px] flex-shrink-0">
                            No Photo
                          </div>
                        )}

                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-gray-900">SN: {item.serialNumber || 'N/A'}</p>
                          <p className="text-[10px] text-gray-600">User: <span className="font-mono text-blue-600">{item.userId}</span></p>
                          <p className="text-[10px] text-gray-800 font-bold">Expected: ₹{item.expectedPrice || '0'}</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-1">
                         <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              item.status === 'approved' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : item.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-gray-900'
                            }`}>
                              {item.status === 'approved' ? 'Approved' : item.status === 'rejected' ? 'Rejected' : 'Pending'}
                          </span>
                          
                          <div className="flex space-x-1">
                             <button className="p-1.5 bg-blue-50 text-blue-700 rounded hover:bg-blue-100"><Layers className="w-3 h-3" /></button>
                             <button className="p-1.5 bg-emerald-50 text-emerald-700 rounded hover:bg-emerald-100"><Save className="w-3 h-3" /></button>
                             <button className="p-1.5 bg-red-50 text-red-700 rounded hover:bg-red-100"><XCircle className="w-3 h-3" /></button>
                          </div>
                      </div>
                    </div>
                    {/* New Fields */}
                    <div className="bg-gray-50 p-2 rounded-lg text-[10px] text-gray-700 space-y-0.5 border border-gray-100">
                      <p><span className="font-bold">Aadhaar:</span> {item.aadhaarNumber || 'N/A'}</p>
                      <p><span className="font-bold">Address:</span> {item.addressPostOffice || 'N/A'}, {item.addressRoad || 'N/A'}</p>
                      <p><span className="font-bold">Delivery:</span> {item.deliveryOption || 'N/A'}</p>
                    </div>
                  </div>
                ))}
              {sellersList.length === 0 && (
                <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-2xl border">
                  ఇప్పటివరకు ఎలాంటి అమ్మే వాళ్ళ వివరాలు సమర్పించబడలేదు.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. రేట్ ని ధర నిర్ణయం చేసే ట్యాబ్ (Price Valuation & Master Rates Tab) */}
        {/* ========================================================= */}
        {activeTab === 'pricing' && (
          <div className="space-y-4">
            {/* Sub Navigation Bar inside Pricing Tab */}
            <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPricingSubTab('master_rates')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    pricingSubTab === 'master_rates'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Coins className="w-4 h-4" />
                  <span>అధికారిక కాయిన్లు & నోట్ల ధరల పట్టిక (దమ్మిడి నుండి రూపాయి & నోట్లు) ({coinRates.length})</span>
                </button>

                <button
                  onClick={() => setPricingSubTab('user_submissions')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all relative ${
                    pricingSubTab === 'user_submissions'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <BadgePercent className="w-4 h-4" />
                  <span>యూజర్ల అమ్మకాల ధరల ఆమోదం ({pendingValuations.length})</span>
                  {pendingValuations.length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-1 right-1 animate-pulse"></span>
                  )}
                </button>
              </div>

              {pricingSubTab === 'master_rates' && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSaveAllRates}
                    className="flex items-center space-x-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-colors"
                    title="మార్చిన అన్ని ధరలను ఒకేసారి సేవ్ చేయండి"
                  >
                    <Save className="w-4 h-4" />
                    <span>అన్నీ సేవ్ చేయండి</span>
                  </button>
                  <button
                    onClick={handleResetRates}
                    className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
                    title="ప్రామాణిక డిఫాల్ట్ ధరలకు రీసెట్ చేయండి"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>రీసెట్</span>
                  </button>
                </div>
              )}
            </div>

            {/* SUB-VIEW 1: అధికారిక కాయిన్లు & నోట్ల ధరల పట్టిక (దమ్మిడి నుండి రూపాయి & నోట్లు) */}
            {pricingSubTab === 'master_rates' && (
              <div className="space-y-4">
                {/* Information & Feature Banner - 60% Height Reduced, Exact Same Colors & Design */}
                <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-gray-900 text-white px-3 py-2 rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        <Coins className="w-4 h-4" />
                      </span>
                      <h2 className="text-xs md:text-sm font-bold text-white leading-tight">
                        పాతకాలం 1 దమ్మిడి నుండి 1 రూపాయి & వింటేజ్ నోట్ల అధికారిక కొనుగోలు ధరల నిర్ణయం
                      </h2>
                    </div>
                    <p className="text-[10.5px] text-emerald-200/80 pl-6 leading-normal">
                      ఇక్కడ అడ్మిన్ నిర్ణయించి <span className="font-bold text-amber-300">"సేవ్"</span> చేసిన ధరలు నేరుగా యూజర్లకు వారి చాట్ స్క్రీన్, లైవ్ రేట్ కార్డ్ మరియు కాయిన్ రిజిస్ట్రేషన్ ఫారమ్‌లో కనిపిస్తాయి.
                    </p>
                  </div>
                  <div className="flex items-center space-x-1.5 bg-white/10 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10.5px] border border-white/10 self-start md:self-auto shrink-0">
                    <Eye className="w-3.5 h-3.5 text-emerald-300" />
                    <span className="font-semibold text-emerald-100">లైవ్‌లో యూజర్లకు కనిపిస్తోంది ✅</span>
                  </div>
                </div>

                {/* Filter & Search Bar - Compact Height */}
                <div className="bg-white px-3 py-2 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-2">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="కాయిన్ లేదా నోటు పేరుతో వెతకండి (ఉదా: దమ్మిడి, అణా, వెండి, 786)..."
                      value={ratesSearch}
                      onChange={e => setRatesSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[11px] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex items-center space-x-1 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => setRatesCategory('all')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                        ratesCategory === 'all'
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      అన్నీ ({coinRates.length})
                    </button>
                    <button
                      onClick={() => setRatesCategory('coin')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                        ratesCategory === 'coin'
                          ? 'bg-amber-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      నాణేలు ({coinRates.filter(c => c.category === 'coin').length})
                    </button>
                    <button
                      onClick={() => setRatesCategory('note')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                        ratesCategory === 'note'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      నోట్లు ({coinRates.filter(c => c.category === 'note').length})
                    </button>
                  </div>
                </div>

                {/* Coin Rates List (Ordered chronologically from 1 Dammidi to 1 Rupee & Notes) */}
                <div className="space-y-2">
                  {coinRates
                    .filter(item => {
                      if (ratesCategory !== 'all' && item.category !== ratesCategory) return false;
                      if (!ratesSearch.trim()) return true;
                      const q = ratesSearch.toLowerCase();
                      return (
                        item.nameTe.toLowerCase().includes(q) ||
                        item.nameEn.toLowerCase().includes(q) ||
                        item.denomination.toLowerCase().includes(q) ||
                        item.era.toLowerCase().includes(q)
                      );
                    })
                    .map((item, idx) => {
                      const currentVal = editedRates[item.id] !== undefined ? editedRates[item.id] : item.rate;
                      const isSaving = savingId === item.id;
                      const isSaved = savedSuccessId === item.id;
                      const isChanged = editedRates[item.id] !== undefined && editedRates[item.id] !== item.rate;

                      return (
                        <div
                          key={item.id}
                          className="bg-white rounded-xl border border-gray-200 px-3.5 py-2 shadow-2xs hover:border-emerald-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5"
                        >
                          {/* Item Details */}
                          <div className="flex items-center space-x-2.5 flex-1 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 border border-amber-300 flex items-center justify-center text-amber-800 font-bold text-xs flex-shrink-0 shadow-2xs">
                              {item.category === 'coin' ? '🪙' : '💵'}
                            </div>

                            <div className="space-y-0.5 min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="font-mono text-[11px] font-bold text-gray-400">#{idx + 1}</span>
                                <h3 className="text-xs font-bold text-gray-900 truncate">{item.nameTe}</h3>
                                <span className="text-[10px] text-gray-500 font-mono">({item.nameEn})</span>
                                <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                  item.rarity === 'Ultra Rare'
                                    ? 'bg-red-100 text-red-700 border border-red-200'
                                    : item.rarity === 'Rare'
                                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                    : 'bg-blue-100 text-blue-700 border border-blue-200'
                                }`}>
                                  {item.rarityTe || item.rarity}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-gray-500">
                                <span><strong className="text-gray-700">కాలం:</strong> {item.era}</span>
                                <span>•</span>
                                <span className="text-gray-600 truncate max-w-xs">{item.description}</span>
                              </div>
                            </div>
                          </div>

                          {/* Price Setting & Action */}
                          <div className="flex items-center space-x-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-1.5 md:pt-0">
                            <div className="flex items-center space-x-1.5">
                              <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">రేటు:</span>
                              <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-[11px]">₹</span>
                                <input
                                  type="text"
                                  value={currentVal}
                                  onChange={e => setEditedRates({ ...editedRates, [item.id]: e.target.value })}
                                  placeholder="ధర"
                                  className={`w-28 pl-5 pr-2 py-1 rounded-lg text-xs font-bold text-gray-900 focus:outline-none focus:ring-1 border transition-all ${
                                    isChanged 
                                      ? 'border-amber-400 bg-amber-50/50 focus:ring-amber-500' 
                                      : 'border-emerald-200 bg-emerald-50/30 focus:ring-emerald-500'
                                  }`}
                                />
                              </div>
                            </div>

                            <button
                              onClick={() => handleSaveRate(item)}
                              disabled={isSaving}
                              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                isSaved
                                  ? 'bg-emerald-600 text-white'
                                  : isChanged
                                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                              }`}
                            >
                              {isSaved ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>సేవ్ అయింది!</span>
                                </>
                              ) : isSaving ? (
                                <span>సేవింగ్...</span>
                              ) : (
                                <>
                                  <Save className="w-3 h-3" />
                                  <span>సేవ్</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}

                  {coinRates.length === 0 && (
                    <div className="py-12 text-center text-gray-400 bg-white rounded-2xl border">
                      ధరల పట్టిక లోడ్ అవుతోంది...
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SUB-VIEW 2: యూజర్ల అమ్మకాల ధరల ఆమోదం (User Submissions Approval) */}
            {pricingSubTab === 'user_submissions' && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-bold text-emerald-900 flex items-center space-x-2">
                      <BadgePercent className="w-5 h-5 text-emerald-600" />
                      <span>వినియోగదారుల అమ్మకాల ధరల పరిశీలన & ఆమోదం</span>
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      యూజర్లు సమర్పించిన కాయిన్లు/నోట్లకు కంపెనీ తుది ధరను నిర్ణయించి, యూజర్లకు నోటిఫికేషన్ పంపండి.
                    </p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
                    పెండింగ్ పరిశీలనలు: {pendingValuations.length}
                  </span>
                </div>

                <div className="space-y-4">
                  {transactions.slice().reverse().map(tx => (
                    <div key={tx.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col md:flex-row gap-5 items-start">
                      {/* Coin Photo */}
                      {tx.photoUrl ? (
                        <div className="w-full md:w-52 h-44 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border">
                          <img src={tx.photoUrl} alt="Coin" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-full md:w-52 h-36 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-xs flex-shrink-0">
                          ఫోటో లేదు
                        </div>
                      )}

                      {/* Valuation Form & Details */}
                      <div className="flex-1 w-full space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
                          <div>
                            <h3 className="font-bold text-gray-900 text-base">సీరియల్ నంబర్: {tx.serialNumber || 'N/A'}</h3>
                            <p className="text-xs text-gray-500">యూజర్ ID: {tx.userId} | తేదీ: {tx.date || 'ఈ రోజు'}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            tx.status === 'approved' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : tx.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {tx.status === 'approved' ? 'ధర ఖరారైంది' : tx.status === 'rejected' ? 'తిరస్కరించబడింది' : 'ధర నిర్ణయం పెండింగ్'}
                          </span>
                        </div>

                        {/* Price Comparison */}
                        <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs">
                          <div>
                            <span className="text-gray-500">యూజర్ ఆశించిన ధర:</span>
                            <p className="text-base font-bold text-blue-700">₹{tx.expectedPrice || '0'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">అంచనా మార్కెట్ విలువ:</span>
                            <p className="text-base font-bold text-emerald-700">{tx.estimatedValue || 'N/A'}</p>
                          </div>
                        </div>

                        {/* Admin Pricing Input Fields with ₹10 to ₹4 Commission Calculator */}
                        <div className="space-y-2 pt-1">
                          <label className="block text-xs font-bold text-gray-800">
                            కంపెనీ నిర్ణయించిన తుది మొత్తం విలువ (Final Approved Value - ₹):
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                            <input
                              type="number"
                              placeholder={tx.expectedPrice ? `ఉదా: ${tx.expectedPrice}` : "ధర ఎంటర్ చేయండి"}
                              value={finalPriceInput[tx.id || ''] ?? (tx.expectedPrice || '')}
                              onChange={e => setFinalPriceInput({...finalPriceInput, [tx.id || '']: e.target.value})}
                              className="w-full pl-8 pr-3 py-2 bg-emerald-50/50 border border-emerald-300 rounded-xl text-sm font-bold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>

                          {/* Live Commission Calculator Box: ₹10 కి ₹4 (40%) */}
                          {(() => {
                            const enteredVal = parseFloat(String(finalPriceInput[tx.id || ''] ?? (tx.expectedPrice || '')).replace(/,/g, '')) || 0;
                            if (enteredVal <= 0) return null;
                            const comm = Math.round(enteredVal * 0.40);
                            const payout = enteredVal - comm;
                            return (
                              <div className="bg-amber-50/90 border border-amber-300 rounded-xl p-3 space-y-1.5 text-xs">
                                <div className="flex items-center justify-between font-bold text-amber-900 border-b border-amber-200/80 pb-1">
                                  <span className="flex items-center space-x-1">
                                    <BadgePercent className="w-3.5 h-3.5 text-amber-700" />
                                    <span>కమీషన్ విధానం (₹10 కి ₹4 కమిషన్ / 40%):</span>
                                  </span>
                                  <span className="text-[10px] bg-amber-200/80 px-2 py-0.5 rounded-full text-amber-900">ఆటో-కాలిక్యులేట్</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 pt-0.5">
                                  <div className="bg-white/80 p-2 rounded-lg border border-amber-200">
                                    <span className="text-gray-500 block text-[11px]">అడ్మిన్ కమిషన్ (40%):</span>
                                    <span className="font-bold text-red-600 text-sm">₹{comm.toLocaleString('en-IN')}</span>
                                  </div>
                                  <div className="bg-white/80 p-2 rounded-lg border border-amber-200">
                                    <span className="text-gray-500 block text-[11px]">యూజర్‌కు చెల్లించే నికర మొత్తం:</span>
                                    <span className="font-bold text-emerald-700 text-sm">₹{payout.toLocaleString('en-IN')}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}

                          <input
                            type="text"
                            placeholder="యూజర్‌కు పంపించాల్సిన నోట్స్ / వివరణ (Optional)..."
                            value={decisionInput[tx.id || ''] || ''}
                            onChange={e => setDecisionInput({...decisionInput, [tx.id || '']: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-3 pt-2">
                          <button
                            onClick={() => handleValuationDecision(tx, 'approved')}
                            className="flex-1 flex items-center justify-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-xl text-xs font-bold shadow-xs transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>ధర ఆమోదించి యూజర్‌కు పంపండి (Approve Rate)</span>
                          </button>

                          <button
                            onClick={() => handleValuationDecision(tx, 'rejected')}
                            className="flex items-center justify-center space-x-1.5 bg-red-100 hover:bg-red-200 text-red-700 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>రిజెక్ట్</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {transactions.length === 0 && (
                    <div className="py-12 text-center text-gray-400 bg-white rounded-2xl border">
                      ధర నిర్ణయానికి ఎలాంటి కాయిన్లు పెండింగ్‌లో లేవు.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. యూజర్ల రిజిస్ట్రేషన్ ట్యాబ్ (Registered Users Tab) */}
        {/* ========================================================= */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span>రిజిస్టర్ అయిన యూజర్లు (Registered Customers & Users)</span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  యాప్‌లో లాగిన్ అయిన మరియు చాట్ చేసిన యాక్టివ్ యూజర్లు.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                మొత్తం: {allUserIds.length} మంది
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allUserIds.map((uId) => {
                const userTx = transactions.find(t => t.userId === uId);
                return (
                  <div key={uId} className="bg-white rounded-lg border border-gray-200 p-3 shadow-xs hover:shadow-md transition-shadow flex flex-col gap-2">
                    <div className="flex items-center space-x-3">
                      <span className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm">
                        {uId.slice(0, 2).toUpperCase()}
                      </span>
                      <p className="text-xs font-bold text-gray-900">{uId}</p>
                    </div>
                    {/* Show registration details if available */}
                    {userTx && (
                      <div className="bg-gray-50 p-2 rounded-lg text-[10px] text-gray-700 space-y-0.5 border border-gray-100">
                        <p><span className="font-bold">Aadhaar:</span> {userTx.aadhaarNumber || 'N/A'}</p>
                        <p><span className="font-bold">Address:</span> {userTx.addressPostOffice || 'N/A'}, {userTx.addressRoad || 'N/A'}</p>
                        <p><span className="font-bold">Delivery:</span> {userTx.deliveryOption || 'N/A'}</p>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setSelectedUserId(uId);
                        setActiveTab('chat');
                      }}
                      className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-[11px] transition-colors"
                    >
                      చాట్ తెరవండి
                    </button>
                  </div>
                );
              })}
              {allUserIds.length === 0 && (
                <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-2xl border">
                  ఇప్పటివరకు ఎలాంటి యూజర్లు రిజిస్టర్ కాలేదు.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 4. కస్టమర్ చాట్ ట్యాబ్ (Live Customer Chat) */}
        {/* ========================================================= */}
        {activeTab === 'chat' && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-md flex flex-col md:flex-row h-[75vh]">
            {/* User List Sidebar */}
            <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col bg-gray-50/60 overflow-y-auto">
              <div className="p-3.5 border-b bg-gray-100 font-bold text-xs text-gray-700 flex justify-between items-center">
                <span>కస్టమర్లు ({allUserIds.length})</span>
                <span className="text-[10px] text-gray-500 font-normal">క్లిక్ చేసి చాట్ చేయండి</span>
              </div>
              <div className="divide-y divide-gray-100">
                {allUserIds.map(uId => {
                  const lastMsg = messages.filter(m => m.userId === uId).slice(-1)[0];
                  return (
                    <button
                      key={uId}
                      onClick={() => setSelectedUserId(uId)}
                      className={`w-full p-3.5 text-left transition-colors flex items-center justify-between ${
                        selectedUserId === uId 
                          ? 'bg-blue-100 border-l-4 border-l-blue-600' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <p className="font-bold text-xs text-gray-900">{uId}</p>
                        <p className="text-[11px] text-gray-500 truncate mt-0.5">
                          {lastMsg ? lastMsg.text : 'No messages'}
                        </p>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chat Stream Window */}
            <div className="flex-1 flex flex-col bg-white">
              {selectedUserId ? (
                <>
                  <div className="p-3.5 border-b bg-gray-50 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-gray-900">యూజర్: {selectedUserId}</h3>
                      <p className="text-[11px] text-gray-500">ప్రత్యక్ష సమాధానం ఇవ్వండి</p>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/40">
                    {messages.filter(m => m.userId === selectedUserId).map((msg, i) => (
                      <div key={i} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] p-3 rounded-2xl text-xs shadow-2xs ${
                          msg.sender === 'admin' 
                            ? 'bg-blue-600 text-white rounded-br-xs' 
                            : 'bg-white border text-gray-900 rounded-bl-xs'
                        }`}>
                          {msg.type === 'image' && msg.mediaUrl && (
                            <img src={msg.mediaUrl} alt="Uploaded" className="w-full rounded-lg mb-2 max-h-52 object-cover" />
                          )}
                          <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                          <p className={`text-[10px] mt-1 text-right ${msg.sender === 'admin' ? 'text-blue-100' : 'text-gray-400'}`}>
                            {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Admin Reply Bar */}
                  <div className="p-3 bg-white border-t flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="సమాధానం టైప్ చేయండి..."
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleReply()}
                      className="flex-1 bg-gray-50 border border-gray-300 rounded-full px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleReply}
                      className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xs transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-xs p-6 space-y-2">
                  <MessageCircle className="w-10 h-10 text-gray-300" />
                  <p>ఎడమవైపు నుండి ఒక కస్టమర్‌ను ఎంచుకుని చాట్ ప్రారంభించండి.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 5. ప్రత్యేక పసుపు రంగు పిడబ్ల్యూఏ సిస్టమ్ ట్యాబ్ (Yellow PWA System Tab) */}
        {/* ========================================================= */}
        {activeTab === 'pwa' && (
          <div className="space-y-5">
            {/* Header Banner in Warm Yellow */}
            <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 p-5 rounded-2xl border-2 border-amber-500 text-amber-950 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-900 text-amber-100 flex items-center justify-center shadow-md">
                    <Smartphone className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-lg font-black tracking-tight text-amber-950">
                        పిడబ్ల్యూఏ (PWA) మొబైల్ & నెట్‌వర్క్ ప్రొటెక్షన్ సిస్టమ్
                      </h2>
                      <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-2xs">
                        యాక్టివ్ & లింక్ అయింది ✅
                      </span>
                    </div>
                    <p className="text-xs text-amber-900/90 font-medium mt-0.5">
                      ఈ సిస్టమ్ పూర్తి యాప్‌ను నెట్‌వర్క్ ఎర్రర్స్ నుండి రక్షిస్తుంది మరియు నేరుగా మొబైల్ యాప్‌లా పనిచేసేలా చేస్తుంది.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 bg-amber-950/10 px-3.5 py-2 rounded-xl border border-amber-900/20 text-xs font-bold self-start sm:self-auto">
                  <ShieldCheck className="w-4 h-4 text-amber-900" />
                  <span>కేవలం అడ్మిన్ ప్యానెల్ కంట్రోల్</span>
                </div>
              </div>
            </div>

            {/* Metrics & Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Service Worker Live Link */}
              <div className="bg-white p-4 rounded-2xl border-2 border-amber-300 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500 font-bold">
                  <span>సర్వీస్ వర్కర్ (Service Worker)</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                </div>
                <div className="flex items-baseline space-x-2">
                  <p className="text-xl font-extrabold text-emerald-600">రన్నింగ్ (Online)</p>
                </div>
                <p className="text-[11px] text-gray-600">
                  ఫైల్ <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-800 font-mono">/sw.js</code> బ్రౌజర్‌తో నిరంతరం లింక్ అయి ఉంది.
                </p>
              </div>

              {/* Card 2: Offline Network Resilience */}
              <div className="bg-white p-4 rounded-2xl border-2 border-amber-300 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500 font-bold">
                  <span>నెట్‌వర్క్ ఫాల్‌బ్యాక్ గార్డ్</span>
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex items-baseline space-x-2">
                  <p className="text-xl font-extrabold text-blue-600">రక్షణలో ఉంది (Safe)</p>
                </div>
                <p className="text-[11px] text-gray-600">
                  నెట్‌వర్క్ నెమ్మదించినా <span className="font-bold text-gray-800">NetworkError</span> రాకుండా నివారిస్తుంది.
                </p>
              </div>

              {/* Card 3: Web App Manifest */}
              <div className="bg-white p-4 rounded-2xl border-2 border-amber-300 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500 font-bold">
                  <span>మొబైల్ మ్యానిఫెస్ట్ (Manifest)</span>
                  <Tag className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex items-baseline space-x-2">
                  <p className="text-xl font-extrabold text-purple-600">పూర్తిగా సిద్ధం (Ready)</p>
                </div>
                <p className="text-[11px] text-gray-600">
                  బ్రౌజర్ నుండి నేరుగా ఫోన్ హోమ్ స్క్రీన్‌కు ఇన్‌స్టాల్ చేసుకునే సామర్థ్యం ఉంది.
                </p>
              </div>
            </div>

            {/* PWA Settings & Technical Details Table */}
            <div className="bg-white rounded-2xl border-2 border-amber-300 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-amber-600" />
                    <span>పిడబ్ల్యూఏ సిస్టమ్ కాన్ఫిగరేషన్ & ప్రైవసీ స్టేటస్</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    ఈ సెట్టింగ్‌లు మొత్తం యాప్‌కు వర్తిస్తాయి, అయితే యూజర్లకు ఎక్కడా కనిపించవు.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if ('serviceWorker' in navigator) {
                      navigator.serviceWorker.getRegistrations().then(regs => {
                        for (let reg of regs) reg.update();
                        alert('పిడబ్ల్యూఏ సర్వీస్ వర్కర్ విజయవంతంగా రిఫ్రెష్ మరియు రీ-సింక్ అయింది!');
                      });
                    }
                  }}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-400 rounded-xl text-xs font-bold transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>సింక్ రిఫ్రెష్</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/70 space-y-1">
                  <span className="font-bold text-gray-800">యూజర్ చాట్ స్క్రీన్ ప్రైవసీ:</span>
                  <p className="text-gray-600">
                    యూజర్ చాట్ కన్సోల్ మరియు బాహ్య స్క్రీన్‌లలో PWA కి సంబంధించిన ఎలాంటి గుర్తులు, బటన్లు లేకుండా పూర్తిగా ప్రైవేట్‌గా ఉంచబడింది.
                  </p>
                </div>
                <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/70 space-y-1">
                  <span className="font-bold text-gray-800">ఆఫ్‌లైన్ డాక్యుమెంట్ కాషింగ్:</span>
                  <p className="text-gray-600">
                    కాయిన్ మరియు నోట్ల ధరల పట్టిక, బేస్ లేఅవుట్, మరియు ఇమేజ్ అసెట్స్ బ్యాక్‌గ్రౌండ్‌లో భద్రపరచబడి వేగంగా లోడ్ అవుతాయి.
                  </p>
                </div>
                <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/70 space-y-1">
                  <span className="font-bold text-gray-800">యాప్ పేరు & ఐడెంటిటీ:</span>
                  <p className="text-gray-600">
                    <span className="font-semibold">Old Money Traders</span> (Standalone Display Mode - బ్రౌజర్ అడ్రస్ బార్ లేకుండా యాప్ మోడ్‌లో నడుస్తుంది).
                  </p>
                </div>
                <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/70 space-y-1">
                  <span className="font-bold text-gray-800">కమీషన్ నియంత్రణ అనుసంధానం:</span>
                  <p className="text-gray-600">
                    ధర నిర్ణయం ట్యాబ్‌లో ప్రతి లావాదేవీకి <span className="font-bold text-amber-900">₹10 కి ₹4 (40%)</span> కమిషన్ ఆటోమేటిక్ లెక్కింపుతో లింక్ చేయబడింది.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
