import React from 'react';
import { 
  Film, Download, Sparkles, Smartphone, Monitor, Search, X, 
  Settings, User, LogIn, Heart, UploadCloud, HelpCircle, Home 
} from 'lucide-react';
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
  watchlistCount: number;
  onOpenWatchlist?: () => void;
  isMobileDeviceMode: boolean;
  onToggleDeviceMode: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenSearchModal?: () => void;
  onOpenUploadPortal?: () => void;
  onOpenMovieRequestModal?: () => void;
  pendingUploadsCount?: number;
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
  watchlistCount,
  onOpenWatchlist,
  isMobileDeviceMode,
  onToggleDeviceMode,
  searchQuery,
  onSearchChange,
  onOpenSearchModal,
  onOpenUploadPortal,
  onOpenMovieRequestModal,
  pendingUploadsCount = 0,
  appLanguage
}) => {
  const [showSearchInput, setShowSearchInput] = React.useState(false);
  const t = TRANSLATIONS[appLanguage];

  return (
    <>
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-neutral-950/90 dark:bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Zone 1: Brand Title */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button 
              onClick={() => onSelectLanguage('all')}
              className="flex items-center gap-2 group text-left touch-manipulation"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-900/30 group-hover:scale-105 transition-transform">
                <Film className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-rose-400 transition-colors">
                  Cine<span className="text-rose-500">Pulse</span>
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Desktop & Tablet Landscape Navigation Links */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-xs lg:text-sm font-medium">
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

          {/* Zone 3: Actions & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* Search Trigger Button */}
            <div className="relative">
              {onOpenSearchModal ? (
                <button
                  onClick={onOpenSearchModal}
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white transition-all text-xs touch-manipulation min-h-[38px]"
                  title="Search movies, series, comedy & top 10"
                  aria-label="Search movies, series, comedy & top 10"
                >
                  <Search className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="hidden sm:inline text-neutral-400 max-w-[120px] truncate">
                    {searchQuery || t.searchPlaceholder}
                  </span>
                  <span className="hidden md:inline text-[10px] bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded font-mono">
                    Top 10
                  </span>
                </button>
              ) : showSearchInput ? (
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
                    className="text-neutral-400 hover:text-white p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowSearchInput(true)}
                  className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
                  title="Search movies & DJs"
                  aria-label="Search movies & DJs"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Watchlist Button (Desktop & Tablet) */}
            {onOpenWatchlist && (
              <button
                onClick={onOpenWatchlist}
                className="hidden md:flex relative p-2 text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors items-center gap-1.5"
                title={t.myWatchlist}
                aria-label={t.myWatchlist}
              >
                <Heart className={`w-4 h-4 ${watchlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span className="hidden lg:inline text-xs font-medium">{t.watchlist}</span>
                {watchlistCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-rose-600 text-[11px] font-bold text-white flex items-center justify-center tabular-nums">
                    {watchlistCount}
                  </span>
                )}
              </button>
            )}

            {/* Downloads Button (Desktop & Tablet) */}
            <button
              onClick={onOpenDownloadsModal}
              className="hidden md:flex relative p-2 text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors items-center gap-1.5"
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

            {/* Movie Requests Button (Tablet Landscape & Desktop) */}
            {onOpenMovieRequestModal && (
              <button
                onClick={onOpenMovieRequestModal}
                className="hidden lg:flex relative p-2 text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors items-center gap-1.5"
                title="Request a movie or DJ translation"
                aria-label="Request a movie"
              >
                <HelpCircle className="w-4 h-4 text-blue-400" />
                <span className="hidden xl:inline text-xs font-medium">Requests</span>
              </button>
            )}

            {/* Community Upload Portal Button (Desktop & Tablet) */}
            {onOpenUploadPortal && (
              <button
                onClick={onOpenUploadPortal}
                className="hidden md:flex relative p-2 text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors items-center gap-1.5"
                title="Community Upload Portal (Pro Submissions & Admin Review)"
                aria-label="Upload movie or episode"
              >
                <UploadCloud className="w-4 h-4 text-rose-500" />
                <span className="hidden xl:inline text-xs font-medium">Upload</span>
                {pendingUploadsCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-rose-600 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                    {pendingUploadsCount}
                  </span>
                )}
              </button>
            )}

            {/* Device Preview Toggle (Simulate Mobile vs Desktop) */}
            <button
              onClick={onToggleDeviceMode}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-medium transition-colors min-h-[38px]"
              title={isMobileDeviceMode ? "Desktop View" : "Mobile View"}
            >
              {isMobileDeviceMode ? (
                <Monitor className="w-3.5 h-3.5 text-cyan-400" />
              ) : (
                <Smartphone className="w-3.5 h-3.5 text-rose-400" />
              )}
            </button>

            {/* Settings Trigger Button (Desktop & Tablet) */}
            <button
              onClick={onOpenSettingsModal}
              className="hidden md:flex p-2 text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors border border-transparent hover:border-neutral-800 min-h-[38px] min-w-[38px] items-center justify-center"
              title={t.settings}
              aria-label={t.settings}
            >
              <Settings className="w-4 h-4 text-neutral-300" />
            </button>

            {/* User Account / Login Button */}
            {currentUser ? (
              <button
                onClick={onOpenSettingsModal}
                className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs text-neutral-200 transition-colors touch-manipulation min-h-[38px]"
                title={`Logged in as ${currentUser.email}`}
              >
                {currentUser.avatarUrl ? (
                  <img 
                    src={currentUser.avatarUrl} 
                    alt={currentUser.displayName || currentUser.name || currentUser.email} 
                    className="w-6 h-6 rounded-full object-cover border border-rose-500/40 shrink-0"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-rose-600 to-amber-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                    {currentUser.email.substring(0, 1).toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:inline font-medium max-w-[85px] lg:max-w-[100px] truncate">
                  {currentUser.displayName || currentUser.username || currentUser.name || currentUser.email.split('@')[0]}
                </span>
              </button>
            ) : (
              <button
                onClick={() => onOpenAuthModal('login')}
                className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors touch-manipulation min-h-[38px]"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.login}</span>
              </button>
            )}

            {/* Subscription Tier Button / Status */}
            <button
              onClick={onOpenSubscriptionModal}
              className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 sm:gap-1.5 transition-all shadow-sm touch-manipulation min-h-[38px] ${
                subscription.tier === 'free'
                  ? 'bg-rose-600/20 text-rose-300 border border-rose-500/40 hover:bg-rose-600 hover:text-white'
                  : 'bg-gradient-to-r from-amber-500 via-rose-600 to-rose-700 text-white shadow-rose-900/40 hover:opacity-95'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">
                {subscription.tier === 'free' ? t.upgradeToPro : `${subscription.planName} (${subscription.price})`}
              </span>
              <span className="sm:hidden font-bold">
                {subscription.tier === 'free' ? 'Upgrade' : 'VIP'}
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* Dedicated Mobile & Small Tablet Bottom Navigation Bar */}
      <nav 
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800/80 px-1 py-1 flex items-center justify-around shadow-2xl pb-safe"
      >
        {/* 1. Home */}
        <button
          onClick={() => {
            onSelectLanguage('all');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 min-h-[46px] min-w-[50px] transition-colors touch-manipulation ${
            currentLanguage === 'all' ? 'text-rose-500 font-bold' : 'text-neutral-400 hover:text-white'
          }`}
          title="Home - All Cinema"
          aria-label="Home"
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-none">Home</span>
        </button>

        {/* 2. Top 10 / Search */}
        {onOpenSearchModal && (
          <button
            onClick={onOpenSearchModal}
            className="flex flex-col items-center justify-center py-1 px-2.5 min-h-[46px] min-w-[50px] text-neutral-400 hover:text-white transition-colors touch-manipulation"
            title="Top 10 & Search"
            aria-label="Top 10"
          >
            <Search className="w-5 h-5 mb-0.5 text-rose-500" />
            <span className="text-[10px] leading-none">Top 10</span>
          </button>
        )}

        {/* 3. Watchlist */}
        {onOpenWatchlist && (
          <button
            onClick={onOpenWatchlist}
            className="relative flex flex-col items-center justify-center py-1 px-2.5 min-h-[46px] min-w-[50px] text-neutral-400 hover:text-rose-400 transition-colors touch-manipulation"
            title={t.watchlist}
            aria-label={t.watchlist}
          >
            <Heart className={`w-5 h-5 mb-0.5 ${watchlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span className="text-[10px] leading-none">Watchlist</span>
            {watchlistCount > 0 && (
              <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-rose-600 text-[9px] font-bold text-white flex items-center justify-center tabular-nums">
                {watchlistCount}
              </span>
            )}
          </button>
        )}

        {/* 4. Downloads */}
        <button
          onClick={onOpenDownloadsModal}
          className="relative flex flex-col items-center justify-center py-1 px-2.5 min-h-[46px] min-w-[50px] text-neutral-400 hover:text-white transition-colors touch-manipulation"
          title={t.downloads}
          aria-label={t.downloads}
        >
          <Download className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-none">Downloads</span>
          {downloadCount > 0 && (
            <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-rose-600 text-[9px] font-bold text-white flex items-center justify-center tabular-nums">
              {downloadCount}
            </span>
          )}
        </button>

        {/* 5. Upload (Pro Community Portal) */}
        {onOpenUploadPortal && (
          <button
            onClick={onOpenUploadPortal}
            className="relative flex flex-col items-center justify-center py-1 px-2.5 min-h-[46px] min-w-[50px] text-neutral-400 hover:text-rose-400 transition-colors touch-manipulation"
            title="Upload Portal"
            aria-label="Upload Portal"
          >
            <UploadCloud className="w-5 h-5 mb-0.5 text-rose-400" />
            <span className="text-[10px] leading-none">Upload</span>
            {pendingUploadsCount > 0 && (
              <span className="absolute top-1 right-2 w-3.5 h-3.5 rounded-full bg-rose-600 animate-pulse text-[8px] font-bold text-white flex items-center justify-center">
                {pendingUploadsCount}
              </span>
            )}
          </button>
        )}

        {/* 6. Settings */}
        <button
          onClick={onOpenSettingsModal}
          className="flex flex-col items-center justify-center py-1 px-2.5 min-h-[46px] min-w-[50px] text-neutral-400 hover:text-white transition-colors touch-manipulation"
          title={t.settings}
          aria-label={t.settings}
        >
          <Settings className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-none">{t.settings}</span>
        </button>
      </nav>
    </>
  );
};
