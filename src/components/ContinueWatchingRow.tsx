import React, { useRef } from 'react';
import { Play, RotateCcw, ChevronLeft, ChevronRight, X, Film, Tv, Clock } from 'lucide-react';
import { ContinueWatchingItem, MediaItem, UserSubscription } from '../types';
import { MEDIA_CATALOG } from '../data/mockData';

interface ContinueWatchingRowProps {
  items: ContinueWatchingItem[];
  onResume: (item: ContinueWatchingItem) => void;
  onRemove: (id: string) => void;
  onSelectMedia: (media: MediaItem) => void;
  subscription: UserSubscription;
}

export const ContinueWatchingRow: React.FC<ContinueWatchingRowProps> = ({
  items,
  onResume,
  onRemove,
  onSelectMedia,
  subscription
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!items || items.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -400 : 400;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const formatRemainingTime = (currentSec: number, totalSec: number) => {
    const left = Math.max(0, totalSec - currentSec);
    const mins = Math.ceil(left / 60);
    if (mins >= 60) {
      const hrs = Math.floor(mins / 60);
      const remMins = mins % 60;
      return `${hrs}h ${remMins}m left`;
    }
    return `${mins}m left`;
  };

  return (
    <section className="space-y-3 pt-2">
      {/* Row Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Continue Watching</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 font-mono">
              {items.length}
            </span>
          </h2>
        </div>

        {/* Scroll Chevrons for Desktop */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            className="w-7 h-7 rounded-full bg-neutral-800/90 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors border border-neutral-700/60"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-7 h-7 rounded-full bg-neutral-800/90 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors border border-neutral-700/60"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Rail */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto scrollbar-none pb-2 pt-1 px-1 snap-x scroll-smooth"
      >
        {items.map((item) => {
          const matchingMedia = MEDIA_CATALOG.find((m) => m.id === item.mediaId);
          const isEpisode = item.itemType === 'episode';
          const remainingText = formatRemainingTime(item.currentTimeSeconds, item.durationSeconds);

          return (
            <div
              key={item.id}
              className="group relative w-[165px] sm:w-[195px] md:w-[220px] shrink-0 bg-neutral-900 rounded-lg sm:rounded-xl overflow-hidden border border-neutral-800/90 hover:border-neutral-600 transition-all duration-300 flex flex-col hover:shadow-2xl hover:shadow-black/80 snap-start"
            >
              {/* Artwork Container */}
              <div 
                onClick={() => onResume(item)}
                className={`relative aspect-[16/9] w-full ${item.posterBg || 'bg-gradient-to-br from-neutral-800 to-neutral-950'} p-2.5 flex flex-col justify-between cursor-pointer overflow-hidden`}
              >
                <div className="absolute inset-0 bg-radial-gradient opacity-30 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent pointer-events-none" />

                {/* Top Bar: Badge & Dismiss */}
                <div className="relative z-10 flex items-center justify-between gap-1">
                  {isEpisode ? (
                    <span className="px-1.5 py-0.5 rounded bg-rose-600 text-[10px] font-bold text-white shadow-sm flex items-center gap-1">
                      <Tv className="w-2.5 h-2.5" />
                      <span>EP {item.episodeNumber}</span>
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded bg-neutral-950/80 border border-neutral-700/60 text-[10px] font-medium text-neutral-300 flex items-center gap-1">
                      <Film className="w-2.5 h-2.5 text-amber-400" />
                      <span>Movie</span>
                    </span>
                  )}

                  {/* Remove / Dismiss Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(item.id);
                    }}
                    className="w-6 h-6 rounded-full bg-neutral-950/85 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center border border-neutral-700/60 transition-colors"
                    title="Remove from Continue Watching"
                    aria-label="Remove from Continue Watching"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>

                {/* Center Title Display */}
                <div className="relative z-10 my-auto text-center px-1">
                  <h4 className="font-display font-bold text-xs sm:text-sm text-white drop-shadow-md line-clamp-1">
                    {item.title}
                  </h4>
                  {item.mediaTitle && item.mediaTitle !== item.title && (
                    <p className="text-[10px] text-neutral-300 font-medium line-clamp-1 mt-0.5">
                      {item.mediaTitle}
                    </p>
                  )}
                </div>

                {/* Remaining Time Tag */}
                <div className="relative z-10 flex items-center justify-between text-[10px] text-neutral-300">
                  <span className="text-rose-400 font-semibold flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{remainingText}</span>
                  </span>
                  <span className="text-[9px] font-mono text-neutral-400">
                    {item.progressPercent}%
                  </span>
                </div>

                {/* RED NETFLIX PROGRESS BAR */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-neutral-800 z-10">
                  <div 
                    className="h-full bg-rose-600 transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(5, item.progressPercent))}%` }}
                  />
                </div>

                {/* Hover Resume Overlay */}
                <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onResume(item);
                    }}
                    className="px-3 py-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg hover:scale-105 transition-transform"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Resume</span>
                  </button>
                </div>
              </div>

              {/* Lower Body Info */}
              <div className="p-2 sm:p-2.5 flex items-center justify-between text-xs">
                <div className="truncate pr-1">
                  <h5 
                    onClick={() => {
                      if (matchingMedia) onSelectMedia(matchingMedia);
                    }}
                    className="text-xs font-bold text-white hover:text-rose-400 transition-colors truncate cursor-pointer"
                  >
                    {item.title}
                  </h5>
                  <p className="text-[10px] text-neutral-400 truncate">
                    {item.djName ? `${item.djName} Voiceover` : item.subTitle || item.lastWatchedAt}
                  </p>
                </div>

                <button
                  onClick={() => onResume(item)}
                  className="w-7 h-7 rounded-full bg-neutral-800 hover:bg-rose-600 text-neutral-300 hover:text-white flex items-center justify-center shrink-0 transition-colors"
                  title="Resume now"
                  aria-label="Resume now"
                >
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
};
