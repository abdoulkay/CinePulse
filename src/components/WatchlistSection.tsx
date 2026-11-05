import React from 'react';
import { Heart, Play, Info, Trash2, Film, Tv, Mic, ArrowRight } from 'lucide-react';
import { AppLanguage, WatchlistItem } from '../types';
import { TRANSLATIONS } from '../utils/i18n';

interface WatchlistSectionProps {
  watchlist: WatchlistItem[];
  onPlayItem: (watchlistItem: WatchlistItem) => void;
  onSelectItem: (mediaId: string) => void;
  onRemoveItem: (id: string) => void;
  onClearWatchlist?: () => void;
  onBrowseCatalog?: () => void;
  appLanguage: AppLanguage;
}

export const WatchlistSection: React.FC<WatchlistSectionProps> = ({
  watchlist,
  onPlayItem,
  onSelectItem,
  onRemoveItem,
  onClearWatchlist,
  onBrowseCatalog,
  appLanguage
}) => {
  const t = TRANSLATIONS[appLanguage];

  return (
    <section id="my-watchlist-section" className="space-y-4 pt-2">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <Heart className="w-4 h-4 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>{t.myWatchlist}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-rose-300 font-mono font-semibold">
                  {watchlist.length} {watchlist.length === 1 ? 'Title' : 'Titles'}
                </span>
              </h2>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Saved movies, series, and bookmarked episodes stored securely in local storage
            </p>
          </div>
        </div>

        {watchlist.length > 0 && onClearWatchlist && (
          <button
            onClick={onClearWatchlist}
            className="self-start sm:self-auto text-xs text-neutral-500 hover:text-rose-400 transition-colors flex items-center gap-1"
            title="Clear all saved titles"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Watchlist</span>
          </button>
        )}
      </div>

      {/* Content Grid or Empty State */}
      {watchlist.length === 0 ? (
        <div className="p-8 sm:p-12 text-center bg-neutral-900/40 rounded-2xl border border-neutral-800/80 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-neutral-800/80 border border-neutral-700/60 flex items-center justify-center text-neutral-500 mx-auto">
            <Heart className="w-6 h-6 stroke-[1.5]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-neutral-200">
              {t.emptyWatchlist}
            </h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
              {t.emptyWatchlistDesc}
            </p>
          </div>

          {onBrowseCatalog && (
            <button
              onClick={onBrowseCatalog}
              className="mt-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white rounded-xl inline-flex items-center gap-1.5 transition-all"
            >
              <span>Explore Cinema Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {watchlist.map((item) => {
            const isEpisode = item.itemType === 'episode';
            const isDj = item.language === 'swahili' || item.language === 'kinyarwanda';

            return (
              <div
                key={item.id}
                className="group relative bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800/90 hover:border-neutral-600 transition-all duration-300 flex flex-col hover:shadow-xl hover:shadow-black/60"
              >
                {/* Poster / Header */}
                <div 
                  onClick={() => onSelectItem(item.mediaId)}
                  className={`relative aspect-[16/9] w-full ${item.posterBg || 'bg-gradient-to-br from-neutral-800 to-neutral-950'} p-3.5 flex flex-col justify-between cursor-pointer overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-radial-gradient opacity-30 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent pointer-events-none" />

                  {/* Top Bar: Type / Episode indicator + Heart Remove Button */}
                  <div className="relative z-10 flex items-center justify-between gap-1">
                    {isEpisode ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-600/80 backdrop-blur-md text-[10px] font-bold text-white shadow-sm">
                        <Tv className="w-3 h-3" />
                        <span>S{item.seasonNumber || 1}:Ep {item.episodeNumber}</span>
                      </span>
                    ) : isDj && item.djName ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-950/80 backdrop-blur-md border border-neutral-700/60 text-[10px] font-semibold text-rose-300">
                        <Mic className="w-3 h-3 text-rose-400" />
                        <span className="truncate max-w-[100px]">{item.djName}</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-950/80 backdrop-blur-md border border-neutral-700/60 text-[10px] font-medium text-neutral-300">
                        {item.itemType === 'tv' ? <Tv className="w-3 h-3 text-cyan-400" /> : <Film className="w-3 h-3 text-amber-400" />}
                        <span className="capitalize">{item.itemType === 'tv' ? 'TV Series' : 'Movie'}</span>
                      </span>
                    )}

                    {/* Bookmark Heart Button (Active / Remove) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveItem(item.id);
                      }}
                      className="w-7 h-7 rounded-full bg-rose-600 border border-rose-500 text-white flex items-center justify-center shadow-md hover:bg-neutral-800 hover:text-neutral-300 hover:border-neutral-700 transition-all hover:scale-105"
                      title="Remove from Watchlist"
                      aria-label="Remove from Watchlist"
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>

                  {/* Center Title Display */}
                  <div className="relative z-10 text-center px-1 my-auto">
                    <h3 className="font-display font-bold text-sm sm:text-base text-white tracking-tight drop-shadow-md line-clamp-2">
                      {item.title}
                    </h3>
                    {item.mediaTitle && item.mediaTitle !== item.title && (
                      <p className="text-[10px] text-neutral-300 font-medium italic mt-0.5 line-clamp-1">
                        Series: {item.mediaTitle}
                      </p>
                    )}
                  </div>

                  {/* Bottom Meta */}
                  <div className="relative z-10 flex items-center justify-between text-[10px] text-neutral-300">
                    <div className="flex items-center gap-1">
                      <span className="text-emerald-400 font-bold tabular-nums">{item.matchScore}%</span>
                      <span>·</span>
                      <span>{item.year}</span>
                    </div>
                    <span className="text-neutral-400">{item.duration}</span>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-neutral-950/75 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlayItem(item);
                      }}
                      className="w-9 h-9 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                      title="Play now"
                      aria-label="Play now"
                    >
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectItem(item.mediaId);
                      }}
                      className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center border border-neutral-600 hover:scale-105 transition-transform"
                      title="View details"
                      aria-label="View details"
                    >
                      <Info className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveItem(item.id);
                      }}
                      className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 text-rose-400 hover:text-white flex items-center justify-center border border-neutral-600 hover:scale-105 transition-transform"
                      title="Remove from Watchlist"
                      aria-label="Remove from Watchlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Body Meta Details */}
                <div className="p-3 flex flex-col justify-between flex-grow gap-2 text-xs">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      <span className="font-semibold text-neutral-300">
                        {isEpisode ? `Episode ${item.episodeNumber}` : item.itemType.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {item.addedAt}
                      </span>
                    </div>

                    {item.subTitle && (
                      <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                        {item.subTitle}
                      </p>
                    )}

                    {item.genres && item.genres.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 text-[10px] text-neutral-500 mt-1">
                        {item.genres.slice(0, 2).map((g, idx) => (
                          <React.Fragment key={g}>
                            <span>{g}</span>
                            {idx < Math.min(item.genres.length, 2) - 1 && <span>·</span>}
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Play Action */}
                  <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between">
                    <button
                      onClick={() => onPlayItem(item)}
                      className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Watch Now</span>
                    </button>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-[11px] text-neutral-500 hover:text-neutral-300 transition-colors"
                      title="Remove item"
                    >
                      Remove
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
