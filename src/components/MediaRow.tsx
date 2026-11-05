import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { MediaItem, UserSubscription } from '../types';
import { MediaCard } from './MediaCard';

interface MediaRowProps {
  id?: string;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  items: MediaItem[];
  subscription: UserSubscription;
  onSelect: (item: MediaItem) => void;
  onPlay: (item: MediaItem) => void;
  onQuickDownload?: (item: MediaItem) => void;
  downloadedIds: Set<string>;
  isWatchlisted: (id: string) => boolean;
  onToggleWatchlist: (item: MediaItem) => void;
  onSeeMore?: () => void;
  initialCardLimit?: number;
}

export const MediaRow: React.FC<MediaRowProps> = ({
  id,
  title,
  subtitle,
  badge,
  badgeColor = 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  items,
  subscription,
  onSelect,
  onPlay,
  onQuickDownload,
  downloadedIds,
  isWatchlisted,
  onToggleWatchlist,
  onSeeMore,
  initialCardLimit = 6
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  if (!items || items.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -500 : 500;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleSeeMoreClick = () => {
    if (onSeeMore) {
      onSeeMore();
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <section id={id} className="space-y-2.5 pt-1">
      {/* Row Header */}
      <div className="flex items-center justify-between px-1">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>{title}</span>
              {badge && (
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeColor} flex items-center gap-1`}>
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>{badge}</span>
                </span>
              )}
            </h3>
          </div>
          {subtitle && (
            <p className="text-xs text-neutral-400">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right Controls: See More Button & Rail Chevrons */}
        <div className="flex items-center gap-2">
          {/* Always Visible "See More" Button */}
          <button
            onClick={handleSeeMoreClick}
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-neutral-800/60 transition-colors"
          >
            <span>{isExpanded ? 'Show Less' : 'See More'}</span>
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Desktop Left / Right Scroll Chevrons */}
          {!isExpanded && (
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={() => scroll('left')}
                className="w-7 h-7 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors border border-neutral-700/60"
                aria-label="Scroll row left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-7 h-7 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors border border-neutral-700/60"
                aria-label="Scroll row right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Row Body: Horizontal Rail OR Expanded Grid */}
      {isExpanded ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 pt-1 animate-fadeIn">
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
      ) : (
        <div 
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto scrollbar-none pb-2 pt-1 px-1 snap-x scroll-smooth"
        >
          {items.slice(0, initialCardLimit).map((item) => (
            <div key={item.id} className="snap-start">
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

          {/* Quick End-of-Rail "See More" Card */}
          {items.length > initialCardLimit && (
            <div 
              onClick={handleSeeMoreClick}
              className="w-[120px] sm:w-[150px] shrink-0 bg-neutral-900/60 hover:bg-neutral-800/80 border border-dashed border-neutral-700/80 hover:border-rose-500/60 rounded-xl flex flex-col items-center justify-center p-4 cursor-pointer text-center group transition-all snap-start"
            >
              <div className="w-10 h-10 rounded-full bg-rose-600/20 group-hover:bg-rose-600 text-rose-400 group-hover:text-white flex items-center justify-center transition-all mb-2">
                <ArrowRight className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white group-hover:text-rose-400">
                See All
              </span>
              <span className="text-[10px] text-neutral-400 mt-0.5">
                +{items.length - initialCardLimit} more
              </span>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
