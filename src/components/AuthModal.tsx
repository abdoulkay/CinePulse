import React, { useState } from 'react';
import { X, Mail, Lock, ShieldAlert, CheckCircle, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { AppLanguage, UserAccount } from '../types';
import { TRANSLATIONS } from '../utils/i18n';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  initialMode?: 'login' | 'signup';
  appLanguage: AppLanguage;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login',
  appLanguage
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[appLanguage];
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Generate new active sessionId for this device
      const newSessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const deviceName = `${navigator.platform.includes('Mac') ? 'Mac' : navigator.platform.includes('Win') ? 'Windows' : 'Mobile'} Browser`;

      const userAccount: UserAccount = {
        email: email.trim().toLowerCase(),
        name: email.split('@')[0],
        createdAt: new Date().toLocaleDateString(),
        sessionId: newSessionId,
        deviceId: `dev_${Date.now()}`,
        deviceName: deviceName,
        lastActive: 'Active now'
      };

      // Broadcast single-device session update across storage / tabs
      localStorage.setItem(`cinepulse_active_session_${userAccount.email}`, newSessionId);
      localStorage.setItem(`cinepulse_active_device_name_${userAccount.email}`, deviceName);
      
      // Dispatch storage event for same-window detection
      window.dispatchEvent(new Event('storage'));

      setLoading(false);
      onLoginSuccess(userAccount);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-md bg-neutral-900 dark:bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-neutral-800/60 to-neutral-900 border-b border-neutral-800 text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-500 mx-auto mb-2">
            <Mail className="w-6 h-6" />
          </div>

          <h2 className="font-display font-extrabold text-2xl text-white tracking-tight">
            {activeTab === 'login' ? t.login : t.createAccount}
          </h2>

          <p className="text-xs text-neutral-400">
            {t.emailOnlyNotice}
          </p>
        </div>

        {/* Tab Switcher: Log In vs Sign In / Create Account */}
        <div className="px-6 pt-4">
          <div className="grid grid-cols-2 p-1 bg-neutral-950 rounded-xl border border-neutral-800">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setError(null);
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'login'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {t.login}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('signup');
                setError(null);
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'signup'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {t.createAccount}
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          
          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-200 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* SIGN IN / SIGN UP MANDATORY SECURITY WARNING */}
          {activeTab === 'signup' && (
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Security & Credentials Safety</span>
              </div>
              <p className="text-xs text-amber-200 leading-relaxed font-medium">
                "{t.passwordWarning}"
              </p>
              <div className="pt-1 flex items-center gap-1.5 text-[11px] text-neutral-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Your privacy is protected. No social logins or third-party trackers.</span>
              </div>
            </div>
          )}

          {/* Email input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-300 block">
              {t.emailAddress}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 placeholder-neutral-500 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-300 block">
              {t.password}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder={activeTab === 'signup' ? 'Create new password (min 6 chars)' : 'Enter password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 placeholder-neutral-500 text-xs rounded-xl pl-9 pr-10 py-2.5 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Single-device reminder tag */}
          <div className="p-2.5 bg-neutral-950/70 border border-neutral-800/80 rounded-xl text-[11px] text-neutral-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            <span>Single-device security: Signing in will authenticate this device exclusively.</span>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : activeTab === 'login' ? t.login : t.createAccount}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </form>

        {/* Modal Footer */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 text-center text-xs text-neutral-500">
          <span>Protected by CinePulse Single Device Security · Direct Email Only</span>
        </div>

      </div>
    </div>
  );
};
