import React, { useState } from 'react';
import { 
  X, Download, Play, Trash2, WifiOff, HardDrive, AlertTriangle, 
  Sparkles, Check, Lock, ShieldAlert, LogIn, Key 
} from 'lucide-react';
import { DownloadedItem, UserAccount, UserSubscription } from '../types';

interface OfflineDownloadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  downloads: DownloadedItem[];
  onPlayDownloaded: (item: DownloadedItem) => void;
  onDeleteDownload: (id: string) => void;
  subscription: UserSubscription;
  currentUser: UserAccount | null;
  onOpenSubscriptionModal: () => void;
  onOpenAuthModal: (mode?: 'login' | 'signup') => void;
}

export const OfflineDownloadsModal: React.FC<OfflineDownloadsModalProps> = ({
  isOpen,
  onClose,
  downloads,
  onPlayDownloaded,
  onDeleteDownload,
  subscription,
  currentUser,
  onOpenSubscriptionModal,
  onOpenAuthModal
}) => {
  if (!isOpen) return null;

  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [accessAlertMessage, setAccessAlertMessage] = useState<string | null>(null);

  const isFreeTier = subscription.tier === 'free';
  const isLoggedIn = currentUser !== null;
  const isProActive = isLoggedIn && subscription.tier !== 'free';

  // Calculate total storage
  const totalMb = downloads.reduce((acc, curr) => acc + curr.fileSizeMb, 0);
  const totalGb = (totalMb / 1024).toFixed(2);

  // Helper: check if a downloaded item is locked
  const isItemLocked = (item: DownloadedItem): boolean => {
    // An item is considered a Pro-tier download if it was flagged as Pro, or is Episode > 5, or downloaded in 1080p/4K
    const isProItem = Boolean(
      item.isProTierOnly || 
      (item.episodeNumber && item.episodeNumber > 5) || 
      item.quality === '4k' || 
      item.quality === '1080p'
    );

    // If it's a Pro download, it requires being logged in with an active Pro subscription
    if (isProItem && (!isLoggedIn || isFreeTier)) {
      return true;
    }
    return false;
  };

  const lockedDownloadsCount = downloads.filter(isItemLocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden my-0 sm:my-8 max-h-[92vh] sm:max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator */}
        <div 
          onClick={onClose}
          className="sm:hidden w-12 h-1.5 bg-neutral-600 rounded-full mx-auto my-2.5 shrink-0 cursor-pointer" 
          title="Tap to close"
        />

        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Offline Downloads Library</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-mono">
                  {downloads.length} Items
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Encrypted offline storage with anti-account-sharing protection
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Status Bar: Storage & Offline Mode */}
        <div className="p-4 bg-neutral-950/80 border-b border-neutral-800 space-y-3">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-neutral-300">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              <span>Storage Used: <strong className="text-white">{totalGb} GB</strong> of 32 GB Internal Storage</span>
            </div>

            {/* Offline Simulation Switch */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSimulatedOffline(!isSimulatedOffline)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSimulatedOffline
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-400'
                }`}
              >
                <WifiOff className="w-3.5 h-3.5" />
                <span>{isSimulatedOffline ? 'Airplane Mode ON (Offline)' : 'Simulate Airplane Mode'}</span>
              </button>
            </div>
          </div>

          {/* GUEST MODE LOCKDOWN ALERT (Anti-Account-Sharing Policy) */}
          {(!isLoggedIn || isFreeTier) && lockedDownloadsCount > 0 ? (
            <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200">
              <div className="space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-amber-300">
                  <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Account Sharing Protection Active ({lockedDownloadsCount} Pro Files Locked)</span>
                </span>
                <p className="text-[11px] text-amber-200/90 leading-relaxed">
                  You are currently in <strong>Free Guest mode</strong>. Files downloaded under Pro tiers are locked to prevent unauthorized account sharing. Log back in to resume offline playback.
                </p>
              </div>

              <button
                onClick={() => {
                  onOpenAuthModal('login');
                  onClose();
                }}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-md transition-all self-start sm:self-auto"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In to Unlock</span>
              </button>
            </div>
          ) : isFreeTier ? (
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between text-xs text-neutral-300">
              <span>Free Tier Rule: First 5 episodes of TV shows can be downloaded & played free.</span>
              <button
                onClick={onOpenSubscriptionModal}
                className="text-rose-400 hover:text-rose-300 font-bold"
              >
                Upgrade to Pro
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>
                  <strong>{currentUser?.email}</strong> ({subscription.planName}): All offline files unlocked in {subscription.resolutionLimit.toUpperCase()}.
                </span>
              </div>
            </div>
          )}

        </div>

        {/* Security Warning Toast Alert */}
        {accessAlertMessage && (
          <div className="m-4 p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-xs text-red-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>{accessAlertMessage}</span>
            </div>
            <button
              onClick={() => setAccessAlertMessage(null)}
              className="text-neutral-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Downloaded Items List */}
        <div className="p-6 max-h-[420px] overflow-y-auto space-y-3">
          {downloads.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Download className="w-12 h-12 text-neutral-600 mx-auto" />
              <h3 className="text-sm font-semibold text-neutral-300">No downloads saved yet</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Explore movies or series and tap download to save them for offline viewing.
              </p>
            </div>
          ) : (
            downloads.map((item) => {
              const locked = isItemLocked(item);

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    locked
                      ? 'bg-neutral-950/80 border-amber-500/30 opacity-90'
                      : 'bg-neutral-900/90 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-1.5 py-0.5 rounded font-mono uppercase font-bold ${
                        locked
                          ? 'bg-neutral-800 text-amber-400 border border-amber-500/30'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {item.quality}
                      </span>

                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span>{item.title}</span>
                        {locked && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            <span>Pro Only</span>
                          </span>
                        )}
                      </h4>
                    </div>
                    
                    <p className="text-xs text-neutral-400">
                      {item.subTitle}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-500 pt-0.5">
                      <span>{item.fileSizeMb} MB</span>
                      <span>·</span>
                      {locked ? (
                        <span className="text-amber-400 font-medium flex items-center gap-1">
                          <Lock className="w-3 h-3 text-amber-400" />
                          <span>Locked: Log back in with your Pro account to play</span>
                        </span>
                      ) : (
                        <span className="text-emerald-400 flex items-center gap-1 font-medium">
                          <Check className="w-3 h-3" />
                          <span>Ready for offline play (Free / Unlocked)</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    {locked ? (
                      /* LOCKED PRO ACTION: PROMPT TO LOG BACK IN */
                      <button
                        onClick={() => {
                          onOpenAuthModal('login');
                          onClose();
                        }}
                        className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                        title="Pro download locked: Sign back in to play offline"
                      >
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Log in to Unlock</span>
                      </button>
                    ) : (
                      /* UNLOCKED: PLAY OFFLINE */
                      <button
                        onClick={() => {
                          onPlayDownloaded(item);
                          onClose();
                        }}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Play Offline</span>
                      </button>
                    )}

                    <button
                      onClick={() => onDeleteDownload(item.id)}
                      className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-red-400 transition-colors"
                      title="Delete download"
                      aria-label="Delete download"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-500">
          <span>Anti-Sharing Rule: Pro offline files require active authentication. Free tier files stay playable.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
