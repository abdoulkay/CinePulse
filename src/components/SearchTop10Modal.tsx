import React, { useState, useMemo } from 'react';
import { Search, X, Play, Info, Flame, Sparkles, TrendingUp, Film, Tv, Music, Laugh, HelpCircle, UploadCloud } from 'lucide-react';
import { MediaItem, TopSearchItem, UserSubscription } from '../types';
import { TOP_10_BY_CATEGORY, MEDIA_CATALOG } from '../data/mockData';

interface SearchTop10ModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectMedia: (item: MediaItem) => void;
  onPlayMedia: (item: MediaItem) => void;
  subscription: UserSubscription;
  onOpenMovieRequestModal?: (query?: string) => void;
  onOpenUploadPortal?: () => void;
}

export const SearchTop10Modal: React.FC<SearchTop10ModalProps> = ({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  onSelectMedia,
  onPlayMedia,
  subscription,
  onOpenMovieRequestModal,
  onOpenUploadPortal
}) => {
  if (!isOpen) return null;

  const [activeCategory, setActiveCategory] = useState<'movie' | 'shows' | 'music' | 'comedy'>('movie');

  const currentTop10 = useMemo(() => {
    return TOP_10_BY_CATEGORY[activeCategory] || TOP_10_BY_CATEGORY.movie;
  }, [activeCategory]);

  const liveResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return MEDIA_CATALOG.filter((item) => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.originalTitle?.toLowerCase().includes(q) ||
        item.djName?.toLowerCase().includes(q) ||
        item.genres.some((g) => g.toLowerCase().includes(q))
      );
    });
  }, [searchQuery]);

  const trendingTags = [
    'DJ Afro Amigo',
    'Junior Giti',
    'Shaolin Comedy',
    'Agasobanuye Action',
    'Rocky Kimomo',
    'Soundtracks',
    'French VF'
  ];

  const handleLaunchItem = (topItem: TopSearchItem) => {
    const matching = MEDIA_CATALOG.find((m) => m.id === topItem.mediaId || m.title.toLowerCase().includes(topItem.title.toLowerCase().substring(0, 8)));
    if (matching) {
      onPlayMedia(matching);
      onClose();
    } else {
      onSearchChange(topItem.title);
    }
  };

  const handleInspectItem = (topItem: TopSearchItem) => {
    const matching = MEDIA_CATALOG.find((m) => m.id === topItem.mediaId || m.title.toLowerCase().includes(topItem.title.toLowerCase().substring(0, 8)));
    if (matching) {
      onSelectMedia(matching);
      onClose();
    } else {
      onSearchChange(topItem.title);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-4 sm:my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 bg-neutral-950/80 flex items-center gap-3">
          <Search className="w-5 h-5 text-rose-500 shrink-0" />
          <input
            type="text"
            placeholder="Search movies, TV shows, DJ Afro, Junior Giti, music..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-neutral-500 focus:outline-none"
          />
          {searchQuery ? (
            <button
              onClick={() => onSearchChange('')}
              className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Quick Trending Keyword Pills */}
        <div className="px-4 sm:px-5 py-2.5 bg-neutral-950/40 border-b border-neutral-800 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
          <span className="text-neutral-500 font-medium shrink-0 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
            <span>Trending:</span>
          </span>
          {trendingTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onSearchChange(tag)}
              className="px-2.5 py-1 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors shrink-0 text-[11px]"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto space-y-5">
          {/* If User has typed a query: Show Live Search Results */}
          {searchQuery.trim() ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>Search results for <strong className="text-white">"{searchQuery}"</strong></span>
                <span>{liveResults.length} titles found</span>
              </div>

              {liveResults.length === 0 ? (
                <div className="py-10 text-center space-y-4">
                  <Film className="w-10 h-10 text-neutral-600 mx-auto" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-neutral-300">No matching titles found on CinePulse</p>
                    <p className="text-xs text-neutral-500">We couldn't find "{searchQuery}" in our existing catalog.</p>
                  </div>

                  {/* PROMINENT REQUEST & UPLOAD PORTAL PROMPTS */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-neutral-900 border border-blue-500/30 max-w-md mx-auto text-center space-y-3">
                    <p className="text-xs text-blue-200">
                      Can't find <strong>"{searchQuery}"</strong>? Ask our community to upload it or request partner DJs to translate it!
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {onOpenMovieRequestModal && (
                        <button
                          onClick={() => {
                            onOpenMovieRequestModal(searchQuery);
                            onClose();
                          }}
                          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-900/40 transition-colors inline-flex items-center gap-1.5"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>Request "{searchQuery}"</span>
                        </button>
                      )}
                      {onOpenUploadPortal && (
                        <button
                          onClick={() => {
                            onOpenUploadPortal();
                            onClose();
                          }}
                          className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700 text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
                        >
                          <UploadCloud className="w-3.5 h-3.5 text-rose-500" />
                          <span>I Have It, Let Me Upload</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {liveResults.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          onSelectMedia(item);
                          onClose();
                        }}
                        className="p-2.5 rounded-xl bg-neutral-950/80 hover:bg-neutral-800/80 border border-neutral-800 hover:border-neutral-700 transition-all flex items-center gap-3 cursor-pointer group"
                      >
                        <div className={`w-16 h-12 rounded-lg ${item.posterBg || 'bg-neutral-800'} flex items-center justify-center shrink-0 text-white font-bold text-xs`}>
                          <Play className="w-4 h-4 fill-current opacity-80 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-white truncate group-hover:text-rose-400 transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-[10px] text-neutral-400 truncate">
                            {item.djName ? `${item.djName} · ${item.duration}` : `${item.year} · ${item.genres.join(', ')}`}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onPlayMedia(item);
                            onClose();
                          }}
                          className="w-8 h-8 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shrink-0 transition-colors"
                        >
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Bottom helper prompt */}
                  <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
                    <span>Looking for a specific DJ voiceover or missing title?</span>
                    <div className="flex items-center gap-2">
                      {onOpenMovieRequestModal && (
                        <button
                          onClick={() => {
                            onOpenMovieRequestModal(searchQuery);
                            onClose();
                          }}
                          className="text-blue-400 hover:text-blue-300 font-semibold"
                        >
                          Request Title
                        </button>
                      )}
                      {onOpenUploadPortal && (
                        <>
                          <span>·</span>
                          <button
                            onClick={() => {
                              onOpenUploadPortal();
                              onClose();
                            }}
                            className="text-rose-400 hover:text-rose-300 font-semibold"
                          >
                            Upload It
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* If No query: Show dedicated Top 10 for Movies, Shows, Music, or Comedy (each category has its own separate 10 titles) */
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-neutral-800/80">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-rose-500 shrink-0" />
                  <div>
                    <h3 className="font-display font-extrabold text-base sm:text-lg text-white">
                      {activeCategory === 'movie' && 'Top 10 Movies on CinePulse'}
                      {activeCategory === 'shows' && 'Top 10 TV Shows & Series on CinePulse'}
                      {activeCategory === 'music' && 'Top 10 Music & Cinema Soundtracks on CinePulse'}
                      {activeCategory === 'comedy' && 'Top 10 Comedy & DJ Humor on CinePulse'}
                    </h3>
                    <p className="text-xs text-neutral-400">
                      {activeCategory === 'movie' && 'Ranked #1 to #10 in action blockbusters & dubbed cinema'}
                      {activeCategory === 'shows' && 'Ranked #1 to #10 in TV series & Agasobanuye chronicles'}
                      {activeCategory === 'music' && 'Ranked #1 to #10 in film anthems, DJ soundboards & OSTs'}
                      {activeCategory === 'comedy' && 'Ranked #1 to #10 in comedy voiceovers & Shaolin parodies'}
                    </p>
                  </div>
                </div>

                {/* 4 Dedicated Category Buttons: Movies, Shows, Music, Comedy (NO ALL COMBINED) */}
                <div className="flex items-center gap-1.5 p-1 bg-neutral-950 rounded-xl border border-neutral-800 text-xs overflow-x-auto scrollbar-none shrink-0">
                  <button
                    onClick={() => setActiveCategory('movie')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      activeCategory === 'movie'
                        ? 'bg-rose-600 text-white shadow-sm font-semibold'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                    }`}
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Top 10 Movies</span>
                  </button>
                  <button
                    onClick={() => setActiveCategory('shows')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      activeCategory === 'shows'
                        ? 'bg-rose-600 text-white shadow-sm font-semibold'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                    }`}
                  >
                    <Tv className="w-3.5 h-3.5" />
                    <span>Top 10 Shows</span>
                  </button>
                  <button
                    onClick={() => setActiveCategory('music')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      activeCategory === 'music'
                        ? 'bg-rose-600 text-white shadow-sm font-semibold'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                    }`}
                  >
                    <Music className="w-3.5 h-3.5" />
                    <span>Top 10 Music</span>
                  </button>
                  <button
                    onClick={() => setActiveCategory('comedy')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      activeCategory === 'comedy'
                        ? 'bg-rose-600 text-white shadow-sm font-semibold'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                    }`}
                  >
                    <Laugh className="w-3.5 h-3.5" />
                    <span>Top 10 Comedy</span>
                  </button>
                </div>
              </div>

              {/* Numbered Ranked List (1 to 10 in big Netflix style) */}
              <div className="space-y-2.5">
                {currentTop10.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleInspectItem(item)}
                    className="p-3 rounded-2xl bg-neutral-950/70 hover:bg-neutral-800/80 border border-neutral-800/90 hover:border-neutral-700 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    {/* Left: Rank & Artwork */}
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      {/* Big Stylized Rank Number (like Netflix Top 10) */}
                      <span className="font-display font-black text-2xl sm:text-3xl text-neutral-600 group-hover:text-rose-500 w-8 sm:w-10 text-center shrink-0 tabular-nums transition-colors">
                        {item.rank}
                      </span>

                      {/* Poster Art */}
                      <div className={`w-16 sm:w-20 aspect-[16/10] rounded-xl ${item.posterBg || 'bg-neutral-800'} p-1.5 flex flex-col justify-end shrink-0 relative overflow-hidden shadow-md`}>
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                        <span className="relative z-10 text-[9px] font-bold text-white uppercase px-1 py-0.2 bg-black/60 rounded max-w-max">
                          {item.category}
                        </span>
                      </div>

                      {/* Title & Metadata */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-rose-400 transition-colors truncate">
                            {item.title}
                          </h4>
                          {item.rank <= 3 && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold shrink-0">
                              Top {item.rank}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                          {item.subtitle}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-neutral-500 mt-1">
                          <span className="text-emerald-400 font-medium">{item.searchesCount}</span>
                          <span>·</span>
                          <span>{item.categoryLabel}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLaunchItem(item);
                        }}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-md transition-all hover:scale-105"
                        title="Play now"
                      >
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInspectItem(item);
                        }}
                        className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors hidden sm:flex"
                        title="View details"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
          <span>Search East African DJ commentary, dubbed hits & original sound</span>
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
