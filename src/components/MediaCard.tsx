import React from 'react';
import { Play, Info, Check, Mic, Lock, Tv, Film, Heart, Download, X } from 'lucide-react';
import { MediaItem, UserSubscription } from '../types';

interface MediaCardProps {
  item: MediaItem;
  subscription: UserSubscription;
  onSelect: (item: MediaItem) => void;
  onPlay: (item: MediaItem) => void;
  onQuickDownload?: (item: MediaItem) => void;
  isDownloaded?: boolean;
  isWatchlisted?: boolean;
  onToggleWatchlist?: (item: MediaItem) => void;
  progressPercent?: number;
  remainingTimeText?: string;
  onRemoveFromProgress?: () => void;
  episodeSubtitle?: string;
  episodeNumber?: number;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  item,
  subscription,
  onSelect,
  onPlay,
  onQuickDownload,
  isDownloaded = false,
  isWatchlisted = false,
  onToggleWatchlist,
  progressPercent,
  remainingTimeText,
  onRemoveFromProgress,
  episodeSubtitle,
  episodeNumber
}) => {
  const isDjTranslated = item.language === 'swahili' || item.language === 'kinyarwanda';
  const isFreeTier = subscription.tier === 'free';
  const hasProgress = progressPercent !== undefined && progressPercent > 0;

  return (
    <div className="group relative w-[136px] xs:w-[150px] sm:w-[175px] md:w-[200px] lg:w-[220px] shrink-0 bg-neutral-900 rounded-lg sm:rounded-xl overflow-hidden border border-neutral-800/80 hover:border-neutral-600 transition-all duration-300 flex flex-col hover:shadow-2xl hover:shadow-black/70 select-none">
      {/* Poster / Artwork Header (Sleek Netflix 16:9 ratio) */}
      <div 
        onClick={() => onSelect(item)}
        className={`relative aspect-[16/9] w-full ${item.posterBg || 'bg-gradient-to-br from-neutral-800 to-neutral-950'} p-2 sm:p-2.5 md:p-3 flex flex-col justify-between cursor-pointer overflow-hidden`}
      >
        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 bg-radial-gradient opacity-30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent pointer-events-none" />

        {/* Top Badges & Watchlist Heart */}
        <div className="relative z-10 flex items-center justify-between gap-1">
          {/* Subcategory or DJ Badge */}
          {episodeNumber ? (
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-600/90 text-[9px] sm:text-[10px] font-bold text-white shadow-sm">
              <span>EP {episodeNumber}</span>
            </div>
          ) : isDjTranslated && item.djName ? (
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-neutral-950/85 backdrop-blur-md border border-neutral-700/60 text-[9px] sm:text-[10px] font-semibold text-rose-300">
              <Mic className="w-2.5 h-2.5 text-rose-400 shrink-0" />
              <span className="truncate max-w-[65px] xs:max-w-[80px] sm:max-w-[100px]">{item.djName}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-neutral-950/85 backdrop-blur-md border border-neutral-700/60 text-[9px] sm:text-[10px] font-medium text-neutral-300">
              {item.type === 'tv' ? <Tv className="w-2.5 h-2.5 text-cyan-400" /> : <Film className="w-2.5 h-2.5 text-amber-400" />}
              <span className="capitalize">{item.subCategory === 'tv' ? 'Series' : 'Movie'}</span>
            </div>
          )}

          <div className="flex items-center gap-1">
            {/* If in continue watching, show remove button */}
            {onRemoveFromProgress ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFromProgress();
                }}
                className="w-7 h-7 sm:w-6 sm:h-6 rounded-full bg-neutral-950/80 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors touch-manipulation"
                title="Remove from Continue Watching"
                aria-label="Remove from Continue Watching"
              >
                <X className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
              </button>
            ) : (
              /* Heart Bookmark Button - Touch optimized min 36-40px hit area via padding */
              onToggleWatchlist && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWatchlist(item);
                  }}
                  className={`w-7 h-7 sm:w-6 sm:h-6 rounded-full flex items-center justify-center backdrop-blur-md border transition-all touch-manipulation ${
                    isWatchlisted
                      ? 'bg-rose-600 border-rose-500 text-white shadow-sm'
                      : 'bg-neutral-950/80 border-neutral-700/70 text-neutral-300 hover:text-rose-400 hover:border-rose-500/50'
                  }`}
                  title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  aria-label={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                >
                  <Heart className={`w-3.5 h-3.5 sm:w-3 sm:h-3 ${isWatchlisted ? 'fill-current text-white' : ''}`} />
                </button>
              )
            )}
          </div>
        </div>

        {/* Center Title Art (Always legible) */}
        <div className="relative z-10 my-auto text-center px-1">
          <h4 className="font-display font-extrabold text-xs sm:text-sm text-white tracking-tight drop-shadow-md line-clamp-1">
            {item.title}
          </h4>
          {episodeSubtitle && (
            <p className="text-[10px] text-neutral-300 font-medium line-clamp-1 mt-0.5">
              {episodeSubtitle}
            </p>
          )}
        </div>

        {/* Bottom Metadata in Poster */}
        <div className="relative z-10 flex items-center justify-between text-[10px] text-neutral-300">
          <div className="flex items-center gap-1">
            <span className="text-emerald-400 font-bold tabular-nums">{item.matchScore}%</span>
            <span>·</span>
            <span className="text-neutral-400 font-mono text-[9px] px-1 bg-neutral-950/70 rounded">{item.rating}</span>
          </div>
          <span className="text-neutral-400 text-[10px]">{item.duration}</span>
        </div>

        {/* RED PROGRESS BAR FOR CONTINUE WATCHING */}
        {hasProgress && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-800 z-10">
            <div 
              className="h-full bg-rose-600 transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(5, progressPercent))}%` }}
            />
          </div>
        )}

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay(item);
            }}
            className="w-9 h-9 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
            title={hasProgress ? `Resume (${remainingTimeText || 'Continue'})` : "Watch now"}
            aria-label="Watch now"
          >
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(item);
            }}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center border border-neutral-600 hover:scale-105 transition-transform"
            title="View details"
            aria-label="View details"
          >
            <Info className="w-3.5 h-3.5" />
          </button>

          {onToggleWatchlist && !onRemoveFromProgress && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWatchlist(item);
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center border hover:scale-105 transition-transform ${
                isWatchlisted
                  ? 'bg-rose-600 border-rose-500 text-white'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-600'
              }`}
              title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
              aria-label={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Heart className={`w-3.5 h-3.5 ${isWatchlisted ? 'fill-current text-white' : ''}`} />
            </button>
          )}

          {onQuickDownload && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickDownload(item);
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center border hover:scale-105 transition-transform ${
                isDownloaded
                  ? 'bg-emerald-600/30 border-emerald-500 text-emerald-400'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-600'
              }`}
              title={isDownloaded ? "Downloaded" : "Download"}
              aria-label={isDownloaded ? "Downloaded" : "Download"}
            >
              {isDownloaded ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Sleek Compact Details Below Artwork */}
      <div className="p-2 sm:p-2.5 flex flex-col justify-between flex-grow gap-1">
        <div>
          <h4 
            onClick={() => onSelect(item)}
            className="text-xs font-bold text-white hover:text-rose-400 transition-colors line-clamp-1 cursor-pointer"
            title={item.title}
          >
            {item.title}
          </h4>

          {/* Subtitle / Genre / DJ note */}
          <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-0.5">
            <span className="truncate max-w-[120px]">
              {hasProgress && remainingTimeText ? (
                <span className="text-rose-400 font-semibold">{remainingTimeText}</span>
              ) : isDjTranslated && item.djName ? (
                <span>{item.djName}</span>
              ) : (
                <span>{item.genres[0] || 'Cinema'}</span>
              )}
            </span>

            {/* Quality pill and mobile direct play */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[9px] font-mono text-neutral-500 uppercase font-semibold">
                {isFreeTier ? '480p' : '4K'}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay(item);
                }}
                className="sm:hidden w-6 h-6 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white flex items-center justify-center transition-colors touch-manipulation"
                title="Play now"
                aria-label="Play now"
              >
                <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
