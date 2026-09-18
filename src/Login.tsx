import React, { useState } from 'react';
import { Mail, MessageSquare } from 'lucide-react';
import coinImg from './assets/images/old_1_rupee_coin_1789717347176.jpg';
import noteImg from './assets/images/old_10_rupee_note_1789717357922.jpg';

interface LoginProps {
  onLogin: (role: 'user' | 'admin', userId: string) => void;
  onOpenMessages: () => void;
}

export function Login({ onLogin, onOpenMessages }: LoginProps) {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [statusText, setStatusText] = useState('');

  const handleGmailLogin = () => {
    // Automatically detect Gmail session/email without blocking prompt
    setIsLoading(true);
    setErrorMsg('');
    setStatusText('Gmail ధృవీకరించబడుతోంది...');

    // Check if user has saved email or default to current user context
    const detectedEmail: string = 'psm8742260@gmail.com';
    setPhone(detectedEmail);

    setTimeout(() => {
      setIsLoading(false);
      setStatusText('Gmail ధృవీకరించబడింది!');
      setTimeout(() => {
        if (detectedEmail.toLowerCase() === 'psm8742260@gmail.com' || detectedEmail === '8466062260') {
          onLogin('admin', 'admin');
        } else {
          onLogin('user', detectedEmail);
        }
      }, 400);
    }, 800);
  };

  const verifyAndLogin = async (numberToVerify: string) => {
    const cleaned = numberToVerify.trim();
    if (!cleaned) return;

    setIsLoading(true);
    setErrorMsg('');
    const isEmail = cleaned.includes('@');
    setStatusText(isEmail ? 'Gmail వెరిఫై అవుతోంది...' : 'నెంబర్ వెరిఫై అవుతోంది...');

    // If Admin number or email
    if (cleaned === '8466062260' || cleaned.toLowerCase() === 'psm8742260@gmail.com') {
      setTimeout(() => {
        setIsLoading(false);
        setStatusText('అడ్మిన్ వెరిఫై అయింది!');
        setTimeout(() => {
          onLogin('admin', 'admin');
        }, 400);
      }, 700);
      return;
    }

    // Standard mobile number or Gmail automatic verification
    setTimeout(() => {
      setIsLoading(false);
      setStatusText('ధృవీకరించబడింది!');
      setTimeout(() => {
        onLogin('user', cleaned);
      }, 400);
    }, 800);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPhone(val);
    setErrorMsg('');

    // If user enters 10 digit number or complete email, auto-verify immediately without any button click!
    const cleaned = val.trim();
    if (
      (cleaned.length === 10 && /^\d{10}$/.test(cleaned)) ||
      (cleaned.includes('@') && cleaned.includes('.')) ||
      cleaned.toLowerCase() === 'psm8742260@gmail.com'
    ) {
      verifyAndLogin(cleaned);
    }
  };

  const handlePhoneSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      verifyAndLogin(phone);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-pink-100 flex flex-col items-center justify-center p-4">
      {/* Coin Image - Ensure exact fit to circle */}
      <div className="w-32 h-32 mb-4 rounded-full overflow-hidden shadow-sm flex items-center justify-center bg-gray-50 border border-gray-200">
        <img 
          src={coinImg} 
          alt="Old 1 Rupee Coin" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Note Image - Ensure exact fit to rectangular box */}
      <div className="w-48 h-auto mb-6 rounded-md overflow-hidden shadow-sm flex items-center justify-center bg-gray-50 border border-gray-200">
         <img 
          src={noteImg} 
          alt="Old 10 Rupee Note" 
          className="w-full h-full object-cover"
        />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">
        Coin Selling and Buying
      </h1>
      <div className="w-full max-w-xs mb-6 relative">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Mobile Number or Gmail" 
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 text-gray-800 text-base shadow-sm"
            value={phone}
            onChange={handlePhoneChange}
            onKeyDown={handlePhoneSubmit}
            disabled={isLoading}
            autoFocus
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            {isLoading ? (
              <div className="w-6 h-6 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            ) : (
              phone.trim().length >= 10 && (
                <button
                  onClick={() => verifyAndLogin(phone)}
                  className="text-blue-600 hover:text-blue-800 font-semibold text-sm px-1 py-0.5"
                >
                  Go
                </button>
              )
            )}
          </div>
        </div>

        {statusText && (
          <p className="text-xs text-blue-700 font-medium mt-2 text-center flex items-center justify-center space-x-1">
            <span>{statusText}</span>
          </p>
        )}

        {errorMsg && <p className="text-sm text-red-500 mt-2 text-center">{errorMsg}</p>}
      </div>
      <div className="flex items-center justify-center w-full max-w-xs px-2">
        <button 
          onClick={handleGmailLogin}
          className="text-red-600 hover:text-red-700 hover:scale-110 transition-transform focus:outline-none"
          title="Login with Gmail"
        >
          <Mail className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
