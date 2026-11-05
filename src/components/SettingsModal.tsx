import React from 'react';
import { 
  X, Moon, Sun, Globe, User, LogIn, LogOut, ShieldCheck, 
  Smartphone, AlertTriangle, Monitor, Check, ExternalLink 
} from 'lucide-react';
import { AppLanguage, AppTheme, UserAccount } from '../types';
import { TRANSLATIONS } from '../utils/i18n';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: AppTheme;
  onToggleTheme: (newTheme: AppTheme) => void;
  appLanguage: AppLanguage;
  onSelectAppLanguage: (lang: AppLanguage) => void;
  currentUser: UserAccount | null;
  onOpenAuthModal: (mode?: 'login' | 'signup') => void;
  onLogout: () => void;
  onSimulateSecondDeviceLogin: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onToggleTheme,
  appLanguage,
  onSelectAppLanguage,
  currentUser,
  onOpenAuthModal,
  onLogout,
  onSimulateSecondDeviceLogin
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[appLanguage];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-500 font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {t.settings}
              </h2>
              <p className="text-xs text-neutral-400">
                Customize appearance, language & account security
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[560px] overflow-y-auto">
          
          {/* SECTION 1: APPEARANCE (DARK / LIGHT MODE) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-xs">
                {t.theme}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onToggleTheme('dark')}
                className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  theme === 'dark'
                    ? 'bg-neutral-800 border-rose-500 ring-2 ring-rose-500/20 text-white'
                    : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-neutral-900 flex items-center justify-center text-rose-400">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">{t.darkMode}</span>
                    <span className="text-[11px] text-neutral-500">Cinema black</span>
                  </div>
                </div>
                {theme === 'dark' && <Check className="w-4 h-4 text-rose-500" />}
              </button>

              <button
                type="button"
                onClick={() => onToggleTheme('light')}
                className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  theme === 'light'
                    ? 'bg-neutral-800 border-rose-500 ring-2 ring-rose-500/20 text-white'
                    : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-neutral-900 flex items-center justify-center text-amber-400">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">{t.lightMode}</span>
                    <span className="text-[11px] text-neutral-500">Daylight crisp</span>
                  </div>
                </div>
                {theme === 'light' && <Check className="w-4 h-4 text-rose-500" />}
              </button>
            </div>
          </div>

          {/* SECTION 2: APP LANGUAGE SETTINGS (3 LANGUAGES: SWAHILI, ENGLISH, FRENCH) */}
          <div className="space-y-3 pt-4 border-t border-neutral-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider text-xs">
                  {t.languageSettings}
                </h3>
              </div>
              <span className="text-[11px] text-neutral-500">3 Supported Languages</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Swahili */}
              <button
                type="button"
                onClick={() => onSelectAppLanguage('sw')}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  appLanguage === 'sw'
                    ? 'bg-neutral-800 border-amber-500 ring-2 ring-amber-500/20 text-white'
                    : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Kiswahili</span>
                  {appLanguage === 'sw' && <Check className="w-4 h-4 text-amber-400" />}
                </div>
                <span className="text-[11px] text-neutral-500 mt-1">Swahili (Afrika Mashariki)</span>
              </button>

              {/* English */}
              <button
                type="button"
                onClick={() => onSelectAppLanguage('en')}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  appLanguage === 'en'
                    ? 'bg-neutral-800 border-rose-500 ring-2 ring-rose-500/20 text-white'
                    : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">English</span>
                  {appLanguage === 'en' && <Check className="w-4 h-4 text-rose-500" />}
                </div>
                <span className="text-[11px] text-neutral-500 mt-1">English (International)</span>
              </button>

              {/* French */}
              <button
                type="button"
                onClick={() => onSelectAppLanguage('fr')}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  appLanguage === 'fr'
                    ? 'bg-neutral-800 border-blue-500 ring-2 ring-blue-500/20 text-white'
                    : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Français</span>
                  {appLanguage === 'fr' && <Check className="w-4 h-4 text-blue-400" />}
                </div>
                <span className="text-[11px] text-neutral-500 mt-1">Français (Afrique & Global)</span>
              </button>
            </div>
          </div>

          {/* SECTION 3: ACCOUNT & AUTH (EMAIL-ONLY, LOGIN / LOGOUT) */}
          <div className="space-y-4 pt-4 border-t border-neutral-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider text-xs">
                  {t.account}
                </h3>
              </div>
              <span className="text-[11px] text-neutral-500">Email Only Authentication</span>
            </div>

            {currentUser ? (
              /* LOGGED IN USER CARD */
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-600 flex items-center justify-center font-bold text-white text-base shadow">
                      {currentUser.email.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{currentUser.email}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Active
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-500">
                        Device: {currentUser.deviceName} · Member since {currentUser.createdAt}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={onLogout}
                    className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span>{t.logout}</span>
                  </button>
                </div>

                {/* SINGLE DEVICE SECURITY ENFORCEMENT CARD */}
                <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>{t.singleDeviceTitle}</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 font-mono">1 Device Limit Enforced</span>
                  </div>

                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {t.singleDeviceDesc}
                  </p>

                  {/* Interactive Button to simulate 2nd device signing in and triggering forced logout */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-neutral-800/80">
                    <span className="text-[11px] text-neutral-500">
                      Test single device conflict:
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onSimulateSecondDeviceLogin();
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Simulate signing in from a second phone to test single-device kickout"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t.simulateSecondDevice}</span>
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              /* LOGGED OUT STATE */
              <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 mx-auto">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Sign In to Your Account</h4>
                  <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                    Sign in with email only to access your watchlist, subscription, and offline downloads across your device.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      onOpenAuthModal('login');
                      onClose();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>{t.login}</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenAuthModal('signup');
                      onClose();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-rose-950/40"
                  >
                    <span>{t.createAccount}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
          <span>CinePulse Settings · Version 2.4</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium"
          >
            {t.close}
          </button>
        </div>

      </div>
    </div>
  );
};
