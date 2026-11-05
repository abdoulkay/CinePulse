import React from 'react';
import { Flame, Lock, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';
import { MediaItem, UserSubscription } from '../types';
import { MediaCard } from './MediaCard';

interface HiddenAdultSectionProps {
  items: MediaItem[];
  subscription: UserSubscription;
  onSelect: (item: MediaItem) => void;
  onPlay: (item: MediaItem) => void;
  onQuickDownload: (item: MediaItem) => void;
  downloadedIds: Set<string>;
  isWatchlisted: (id: string) => boolean;
  onToggleWatchlist: (item: MediaItem) => void;
  onLockAndHideVault: () => void;
}

export const HiddenAdultSection: React.FC<HiddenAdultSectionProps> = ({
  items,
  subscription,
  onSelect,
  onPlay,
  onQuickDownload,
  downloadedIds,
  isWatchlisted,
  onToggleWatchlist,
  onLockAndHideVault
}) => {
  if (!items || items.length === 0) return null;

  return (
    <section
      id="hidden-adult-movies-section"
      className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-rose-950/35 via-neutral-900/95 to-fuchsia-950/25 border border-rose-500/40 shadow-2xl space-y-5 animate-fadeIn"
    >
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-500/20 pb-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0 shadow-inner">
            <Flame className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display font-extrabold text-base sm:text-xl text-white tracking-tight">
                Hidden Adult Movies Vault (18+ Uncut)
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-rose-600 text-[10px] font-bold uppercase tracking-wider text-white flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>18+ Age Verified</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-neutral-800 border border-neutral-700 text-[10px] font-mono text-rose-300">
                PIN Unlocked
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Private late-night 18+ cinema collection in English, Français (VF), Swahili DJ & Kinyarwanda Agasobanuye.
            </p>
          </div>
        </div>

        {/* Quick Lock & Hide Button */}
        <button
          type="button"
          onClick={onLockAndHideVault}
          className="self-start sm:self-center px-3.5 py-2 rounded-xl bg-neutral-950 hover:bg-rose-950/80 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm touch-manipulation"
          title="Immediately lock and hide this adult section from the app"
        >
          <EyeOff className="w-3.5 h-3.5 text-rose-400" />
          <span>Lock & Hide Adult Vault</span>
        </button>
      </div>

      {/* Adult Movies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-4">
        {items.map((item) => (
          <div key={item.id} className="w-full">
            <MediaCard
              item={item}
              subscription={subscription}
              onSelect={onSelect}
              onPlay={onPlay}
              onQuickDownload={onQuickDownload}
              isDownloaded={downloadedIds.has(item.id)}
              isWatchlisted={isWatchlisted(item.id)}
              onToggleWatchlist={onToggleWatchlist}
            />
          </div>
        ))}
      </div>

      {/* Privacy Footnote */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-neutral-400 border-t border-neutral-800/80">
        <span className="flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-rose-400" />
          <span>
            Protected by your 4-digit Parental Controls PIN. Enabling "Filter Adult Content" in Settings automatically hides this vault.
          </span>
        </span>
        <span className="text-rose-400/90 font-mono flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>{items.length} Uncut 18+ Titles</span>
        </span>
      </div>
    </section>
  );
};
