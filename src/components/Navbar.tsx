import React from 'react';
import { Film, Download, Sparkles, Smartphone, Monitor, Search, X, Settings, User, LogIn } from 'lucide-react';
import { AppLanguage, Language, UserAccount, UserSubscription } from '../types';
import { TRANSLATIONS } from '../utils/i18n';

interface NavbarProps {
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  subscription: UserSubscription;
  onOpenSubscriptionModal: () => void;
  onOpenDownloadsModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenAuthModal: (mode?: 'login' | 'signup') => void;
  currentUser: UserAccount | null;
  downloadCount: number;
  isMobileDeviceMode: boolean;
  onToggleDeviceMode: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  appLanguage: AppLanguage;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLanguage,
  onSelectLanguage,
  subscription,
  onOpenSubscriptionModal,
  onOpenDownloadsModal,
  onOpenSettingsModal,
  onOpenAuthModal,
  currentUser,
  downloadCount,
  isMobileDeviceMode,
  onToggleDeviceMode,
  searchQuery,
  onSearchChange,
  appLanguage
}) => {
  const [showSearchInput, setShowSearchInput] = React.useState(false);
  const t = TRANSLATIONS[appLanguage];

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/90 dark:bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-8">
        
        {/* Zone 1: Brand Title */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => onSelectLanguage('all')}
            className="flex items-center gap-2 group text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-900/30 group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-display font-extrabold text-xl tracking-tight text-white group-hover:text-rose-400 transition-colors">
                Cine<span className="text-rose-500">Pulse</span>
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (single-line links) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => onSelectLanguage('all')}
            className={`whitespace-nowrap transition-colors ${
              currentLanguage === 'all'
                ? 'text-white font-semibold border-b-2 border-rose-500 pb-0.5'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {t.allCinema}
          </button>

          <button
            onClick={() => onSelectLanguage('english')}
            className={`whitespace-nowrap transition-colors ${
              currentLanguage === 'english'
                ? 'text-white font-semibold border-b-2 border-rose-500 pb-0.5'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {t.englishDubbed}
          </button>

          <button
            onClick={() => onSelectLanguage('french')}
            className={`whitespace-nowrap transition-colors ${
              currentLanguage === 'french'
                ? 'text-white font-semibold border-b-2 border-rose-500 pb-0.5'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {t.frenchVF}
          </button>

          <button
            onClick={() => onSelectLanguage('swahili')}
            className={`whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              currentLanguage === 'swahili'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-500 pb-0.5'
                : 'text-neutral-400 hover:text-amber-300'
            }`}
          >
            {t.swahiliDjs}
          </button>

          <button
            onClick={() => onSelectLanguage('kinyarwanda')}
            className={`whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              currentLanguage === 'kinyarwanda'
                ? 'text-rose-400 font-semibold border-b-2 border-rose-500 pb-0.5'
                : 'text-neutral-400 hover:text-rose-300'
            }`}
          >
            {t.agasobanuye}
          </button>
        </nav>

        {/* Zone 3: Primary Action & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Search Bar / Trigger */}
          <div className="relative">
            {showSearchInput ? (
              <div className="flex items-center bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 w-44 sm:w-60 transition-all">
                <Search className="w-4 h-4 text-neutral-400 shrink-0 mr-2" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  autoFocus
                  className="bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none w-full"
                />
                <button 
                  onClick={() => {
                    setShowSearchInput(false);
                    onSearchChange('');
                  }}
                  className="text-neutral-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearchInput(true)}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors"
                title="Search movies & DJs"
                aria-label="Search movies & DJs"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Downloads Button with Badge */}
          <button
            onClick={onOpenDownloadsModal}
            className="relative p-2 text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors flex items-center gap-1.5"
            title={t.downloads}
            aria-label={t.downloads}
          >
            <Download className="w-4 h-4" />
            <span className="hidden lg:inline text-xs font-medium">{t.downloads}</span>
            {downloadCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-600 text-[11px] font-bold text-white flex items-center justify-center tabular-nums">
                {downloadCount}
              </span>
            )}
          </button>

          {/* Device Preview Toggle (Simulate Mobile vs Desktop) */}
          <button
            onClick={onToggleDeviceMode}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-medium transition-colors"
            title={isMobileDeviceMode ? "Desktop View" : "Mobile View"}
          >
            {isMobileDeviceMode ? (
              <Monitor className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <Smartphone className="w-3.5 h-3.5 text-rose-400" />
            )}
          </button>

          {/* Settings Trigger Button */}
          <button
            onClick={onOpenSettingsModal}
            className="p-2 text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors border border-transparent hover:border-neutral-800"
            title={t.settings}
            aria-label={t.settings}
          >
            <Settings className="w-4 h-4 text-neutral-300" />
          </button>

          {/* User Account / Login Button */}
          {currentUser ? (
            <button
              onClick={onOpenSettingsModal}
              className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs text-neutral-200 transition-colors"
              title={`Logged in as ${currentUser.email}`}
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-rose-600 to-amber-600 text-white font-bold text-[10px] flex items-center justify-center">
                {currentUser.email.substring(0, 1).toUpperCase()}
              </div>
              <span className="hidden sm:inline font-medium max-w-[90px] truncate">
                {currentUser.name || currentUser.email.split('@')[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={() => onOpenAuthModal('login')}
              className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.login}</span>
            </button>
          )}

          {/* Subscription Tier Button / Status */}
          <button
            onClick={onOpenSubscriptionModal}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-sm ${
              subscription.tier === 'free'
                ? 'bg-rose-600/20 text-rose-300 border border-rose-500/40 hover:bg-rose-600 hover:text-white'
                : 'bg-gradient-to-r from-amber-500 via-rose-600 to-rose-700 text-white shadow-rose-900/40 hover:opacity-95'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {subscription.tier === 'free' ? t.upgradeToPro : `${subscription.planName} (${subscription.price})`}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};
