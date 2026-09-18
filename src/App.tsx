import React, { useState } from 'react';
import { Login } from './Login';
import { UserChat } from './UserChat';
import { AdminPanel } from './AdminPanel';
import { LanguageSelector } from './LanguageSelector';
import { Language } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'login' | 'userChat' | 'admin'>('login');
  const [userId, setUserId] = useState<string>('');
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const [lang, setLang] = useState<Language>('te');

  const handleLogin = (role: 'user' | 'admin', id: string) => {
    setUserId(id);
    const isAdmin = role === 'admin' || id === '8466062260' || id.toLowerCase() === 'psm8742260@gmail.com';
    setIsAdminUser(isAdmin);
    // User requested: Always enter Chat Console directly first!
    // Admin Panel is accessible via the Settings icon inside.
    setCurrentView('userChat');
  };

  const handleLogout = () => {
    setUserId('');
    setIsAdminUser(false);
    setCurrentView('login');
  };

  return (
    <div className="relative font-sans text-gray-900 min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-pink-100">
      {currentView === 'login' && (
        <Login 
          onLogin={handleLogin} 
          onOpenMessages={() => {
            const mockId = prompt("Enter your user ID or phone to check messages:", "user_1");
            if (mockId) {
              setUserId(mockId);
              setIsAdminUser(mockId === '8466062260' || mockId.toLowerCase() === 'psm8742260@gmail.com');
              setCurrentView('userChat');
            }
          }} 
        />
      )}
      
      {currentView === 'userChat' && (
        <UserChat 
          userId={userId} 
          isAdmin={isAdminUser}
          onOpenAdmin={() => setCurrentView('admin')}
          onBack={handleLogout} 
        />
      )}

      {currentView === 'admin' && (
        <AdminPanel 
          onBackToChat={() => setCurrentView('userChat')}
          onLogout={handleLogout} 
        />
      )}
    </div>
  );
}
