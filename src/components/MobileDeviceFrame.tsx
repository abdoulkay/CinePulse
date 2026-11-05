import React from 'react';
import { Smartphone, Monitor, Wifi, Battery, Signal, Film, Home, Compass, Download, Sparkles, Settings, Heart, Search, UploadCloud, HelpCircle } from 'lucide-react';
import { Language, UserSubscription } from '../types';

interface MobileDeviceFrameProps {
  children: React.ReactNode;
  onExitMobileMode: () => void;
  subscription: UserSubscription;
  downloadCount: number;
  watchlistCount?: number;
  onOpenDownloads: () => void;
  onOpenWatchlist?: () => void;
  onOpenSubscription: () => void;
  onOpenSettings: () => void;
  onOpenSearch?: () => void;
  onOpenUpload?: () => void;
  onOpenRequests?: () => void;
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
}

export const MobileDeviceFrame: React.FC<MobileDeviceFrameProps> = ({
  children,
  onExitMobileMode,
  subscription,
  downloadCount,
  watchlistCount = 0,
  onOpenDownloads,
  onOpenWatchlist,
  onOpenSubscription,
  onOpenSettings,
  onOpenSearch,
  onOpenUpload,
  onOpenRequests,
  currentLanguage,
  onSelectLanguage
}) => {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-start p-2 sm:p-6 lg:p-10">
      
      {/* Top Banner explaining Mobile Simulation */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between bg-neutral-900/90 border border-neutral-800 rounded-xl px-4 py-2 text-xs">
        <div className="flex items-center gap-2 text-neutral-300">
          <Smartphone className="w-4 h-4 text-rose-500" />
          <span><strong>Mobile Free Tier Device Simulator</strong></span>
        </div>

        <button
          onClick={onExitMobileMode}
          className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-semibold"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Exit to Desktop</span>
        </button>
      </div>

      {/* Phone Shell */}
      <div className="relative w-full max-w-[414px] bg-neutral-950 rounded-[44px] p-3 shadow-2xl ring-1 ring-neutral-800 border-4 border-neutral-800 flex flex-col h-[850px] overflow-hidden">
        
        {/* Dynamic Island / Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-40 flex items-center justify-end px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-800" />
        </div>

        {/* Status Bar */}
        <div className="h-9 px-6 flex items-center justify-between text-[11px] font-semibold text-neutral-400 z-30 select-none">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3 h-3 text-neutral-400" />
            <Wifi className="w-3 h-3 text-neutral-400" />
            <Battery className="w-3.5 h-3.5 text-neutral-400" />
          </div>
        </div>

        {/* Screen Content Viewport */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-20 relative">
          {children}
        </div>

        {/* Mobile Bottom Tab Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800/80 px-3 flex items-center justify-between z-30">
          <button 
            onClick={() => onSelectLanguage('all')}
            className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
              currentLanguage === 'all' ? 'text-rose-500' : 'text-neutral-400'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>

          {onOpenSearch && (
            <button 
              onClick={onOpenSearch}
              className="flex flex-col items-center gap-1 text-[10px] font-medium text-neutral-400 hover:text-white transition-colors"
            >
              <Search className="w-4 h-4 text-rose-500" />
              <span>Top 10</span>
            </button>
          )}

          {onOpenWatchlist && (
            <button 
              onClick={onOpenWatchlist}
              className="relative flex flex-col items-center gap-1 text-[10px] font-medium text-neutral-400 hover:text-rose-400 transition-colors"
            >
              <Heart className={`w-4 h-4 ${watchlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>Watchlist</span>
              {watchlistCount > 0 && (
                <span className="absolute -top-1 right-2 w-4 h-4 rounded-full bg-rose-600 text-[9px] font-bold text-white flex items-center justify-center">
                  {watchlistCount}
                </span>
              )}
            </button>
          )}

          <button 
            onClick={onOpenDownloads}
            className="relative flex flex-col items-center gap-1 text-[10px] font-medium text-neutral-400 hover:text-white transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Downloads</span>
            {downloadCount > 0 && (
              <span className="absolute -top-1 right-2 w-4 h-4 rounded-full bg-rose-600 text-[9px] font-bold text-white flex items-center justify-center">
                {downloadCount}
              </span>
            )}
          </button>

          {onOpenUpload && (
            <button 
              onClick={onOpenUpload}
              className="flex flex-col items-center gap-1 text-[10px] font-medium text-rose-400 hover:text-rose-300 transition-colors"
              title="Upload Movie (Pro)"
            >
              <UploadCloud className="w-4 h-4 text-rose-500" />
              <span>Upload</span>
            </button>
          )}

          <button 
            onClick={onOpenSettings}
            className="flex flex-col items-center gap-1 text-[10px] font-medium text-neutral-400 hover:text-white transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>

          <button 
            onClick={onOpenSubscription}
            className="flex flex-col items-center gap-1 text-[10px] font-medium text-amber-400 hover:text-amber-300 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>{subscription.tier === 'free' ? 'Upgrade' : 'VIP'}</span>
          </button>
        </div>

        {/* Home Indicator Bar */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-neutral-600 rounded-full z-40" />

      </div>

    </div>
  );
};
