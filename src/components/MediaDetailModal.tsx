import React from 'react';
import { X, Play, Download, Check, Lock, Sparkles, Mic, Tv, Film, Info, AlertCircle, Heart } from 'lucide-react';
import { Episode, MediaItem, UserSubscription } from '../types';
import { DJ_PROFILES } from '../data/mockData';

interface MediaDetailModalProps {
  item: MediaItem;
  isOpen: boolean;
  onClose: () => void;
  subscription: UserSubscription;
  onPlay: (item: MediaItem, episode?: Episode) => void;
  onDownloadEpisode: (item: MediaItem, episode: Episode) => void;
  onDownloadMovie: (item: MediaItem) => void;
  downloadedIds: Set<string>;
  onOpenSubscriptionModal: () => void;
  isItemWatchlisted?: (mediaId: string, episodeId?: string) => boolean;
  onToggleWatchlist?: (item: MediaItem, episode?: Episode) => void;
}

export const MediaDetailModal: React.FC<MediaDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  subscription,
  onPlay,
  onDownloadEpisode,
  onDownloadMovie,
  downloadedIds,
  onOpenSubscriptionModal,
  isItemWatchlisted,
  onToggleWatchlist
}) => {
  if (!isOpen) return null;

  const isFreeTier = subscription.tier === 'free';
  const isDjTranslated = item.language === 'swahili' || item.language === 'kinyarwanda';
  const djProfile = DJ_PROFILES.find((dj) => dj.id === item.djId);
  const isMovieDownloaded = downloadedIds.has(item.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-neutral-950/80 hover:bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center border border-neutral-700/60 transition-colors"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Hero Header */}
        <div className={`relative h-64 sm:h-72 w-full bg-gradient-to-r ${item.bannerColor} p-6 sm:p-8 flex items-end overflow-hidden`}>
          <div className="absolute inset-0 bg-radial-gradient opacity-30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent pointer-events-none" />

          <div className="relative z-10 space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              {isDjTranslated && item.djName ? (
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-rose-600/30 border border-rose-500/50 text-xs font-semibold text-rose-300">
                  <Mic className="w-3.5 h-3.5 text-rose-400" />
                  <span>{item.language === 'swahili' ? 'DJ Voiceover' : 'Agasobanuye'}: {item.djName}</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-neutral-800/80 border border-neutral-700 text-xs font-medium text-neutral-300">
                  {item.type === 'tv' ? <Tv className="w-3.5 h-3.5 text-cyan-400" /> : <Film className="w-3.5 h-3.5 text-amber-400" />}
                  <span className="capitalize">{item.subCategory === 'tv' ? 'TV Series' : 'Movie'} · {item.language.toUpperCase()} DUB</span>
                </span>
              )}

              <span className="text-xs font-bold text-emerald-400 tabular-nums">{item.matchScore}% Match</span>
              <span className="text-neutral-500">·</span>
              <span className="text-xs text-neutral-300 font-medium">{item.year}</span>
              <span className="text-neutral-500">·</span>
              <span className="text-xs px-1.5 py-0.5 bg-neutral-800 rounded text-neutral-300 font-mono">{item.rating}</span>
            </div>

            <h2 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-white tracking-tight">
              {item.title}
            </h2>

            {item.originalTitle && (
              <p className="text-xs text-neutral-400 italic">
                Original Title: {item.originalTitle}
              </p>
            )}

            {/* Quick Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => {
                  onPlay(item, item.episodes?.[0]);
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{item.type === 'tv' ? 'Play Episode 1' : 'Play Movie'}</span>
              </button>

              {/* Watchlist Toggle for the Movie/Series */}
              {onToggleWatchlist && (
                <button
                  onClick={() => onToggleWatchlist(item)}
                  className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 border transition-all ${
                    isItemWatchlisted?.(item.id)
                      ? 'bg-rose-600/25 border-rose-500 text-rose-300'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700'
                  }`}
                  title={isItemWatchlisted?.(item.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                >
                  <Heart className={`w-4 h-4 ${isItemWatchlisted?.(item.id) ? 'fill-current text-rose-500' : ''}`} />
                  <span>{isItemWatchlisted?.(item.id) ? 'Watchlisted' : 'Add to Watchlist'}</span>
                </button>
              )}

              {item.type === 'movie' && (
                <button
                  onClick={() => onDownloadMovie(item)}
                  className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 border transition-all ${
                    isMovieDownloaded
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700'
                  }`}
                >
                  {isMovieDownloaded ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Downloaded</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download Movie</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Main Info Split */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Synopsis & Audio options */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-neutral-400 mb-1">
                  Synopsis
                </h4>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  {item.synopsis}
                </p>
              </div>

              {item.translationNotes && (
                <div className="p-3 bg-amber-950/30 rounded-xl border border-amber-500/30 text-xs text-amber-200">
                  <span className="font-semibold text-amber-300 block mb-0.5">
                    🎙️ Translation & Voiceover Details:
                  </span>
                  {item.translationNotes}
                </div>
              )}

              {/* Audio Tracks */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-neutral-400 mb-2">
                  Available Audio Tracks
                </h4>
                <div className="flex flex-wrap gap-2">
                  {item.audioTracks.map((track) => (
                    <span 
                      key={track.id}
                      className="px-2.5 py-1 rounded-lg bg-neutral-800/80 border border-neutral-700/80 text-xs text-neutral-200 flex items-center gap-1.5"
                    >
                      {track.type === 'dj_overlay' ? (
                        <Mic className="w-3.5 h-3.5 text-rose-400" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      )}
                      <span>{track.label}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 1 Col: Metadata & DJ details */}
            <div className="space-y-4 border-t md:border-t-0 md:border-l border-neutral-800 pt-4 md:pt-0 md:pl-6 text-xs text-neutral-400">
              <div>
                <span className="text-neutral-500 block">Genres:</span>
                <span className="text-neutral-200 font-medium">{item.genres.join(', ')}</span>
              </div>

              {item.director && (
                <div>
                  <span className="text-neutral-500 block">Director / Production:</span>
                  <span className="text-neutral-200 font-medium">{item.director}</span>
                </div>
              )}

              {item.cast && (
                <div>
                  <span className="text-neutral-500 block">Cast:</span>
                  <span className="text-neutral-200 font-medium">{item.cast.join(', ')}</span>
                </div>
              )}

              {/* Resolution limit notice for current plan */}
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="text-neutral-500 block font-semibold">Streaming Plan Quality:</span>
                <div className="flex items-center justify-between text-neutral-300">
                  <span className="capitalize">{subscription.planName}</span>
                  <span className="font-bold text-rose-400">{subscription.resolutionLimit.toUpperCase()}</span>
                </div>
                {isFreeTier && (
                  <p className="text-[11px] text-amber-400/90 pt-1">
                    Free tier limited to 480p SD and first 5 episode downloads.
                  </p>
                )}
              </div>
            </div>

          </div>

          {/* If Translated: DJ Profile Spotlight */}
          {djProfile && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border border-neutral-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${djProfile.accentColor} flex items-center justify-center text-white font-extrabold text-base shadow`}>
                  {djProfile.avatarInitials}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{djProfile.name}</span>
                    <span className="text-[11px] font-normal text-neutral-400">({djProfile.yearsActive})</span>
                  </h4>
                  <p className="text-xs text-neutral-400">{djProfile.tagline}</p>
                </div>
              </div>
              <div className="hidden sm:block text-right text-xs text-neutral-400 max-w-xs italic">
                "{djProfile.sampleQuote}"
              </div>
            </div>
          )}

          {/* TV SHOW EPISODE LIST (Demonstrating First 5 Episodes Free Tier Rule) */}
          {item.type === 'tv' && item.episodes && (
            <div className="space-y-4 pt-2 border-t border-neutral-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Tv className="w-4 h-4 text-cyan-400" />
                    <span>Season 1 Episodes ({item.episodes.length} Total)</span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Select an episode to stream or download for offline viewing.
                  </p>
                </div>

                {/* Free Tier Download Rule Banner */}
                {isFreeTier ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Free Mobile Tier: <strong>Episodes 1 to 5 downloadable</strong>. Ep 6+ require subscription.</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{subscription.planName}: Unlimited downloads of all episodes</span>
                  </div>
                )}
              </div>

              {/* Episodes List */}
              <div className="space-y-2">
                {item.episodes.map((ep) => {
                  const isLockedForFreeTier = isFreeTier && ep.episodeNumber > 5;
                  const isDownloaded = downloadedIds.has(`${item.id}-ep-${ep.episodeNumber}`);

                  return (
                    <div
                      key={ep.id}
                      className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isLockedForFreeTier
                          ? 'bg-neutral-950/60 border-neutral-800/80 opacity-90'
                          : 'bg-neutral-900/60 hover:bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      {/* Left: Episode Meta */}
                      <div className="flex items-start gap-3">
                        <span className="w-8 h-8 rounded-lg bg-neutral-800 text-neutral-300 font-bold text-xs flex items-center justify-center shrink-0 tabular-nums">
                          {ep.episodeNumber}
                        </span>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold text-white">
                              {ep.title}
                            </h4>
                            <span className="text-xs text-neutral-400 tabular-nums">{ep.duration}</span>
                            
                            {/* Free vs Premium Tag */}
                            {ep.episodeNumber <= 5 ? (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                                Free Tier Eligible
                              </span>
                            ) : (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 font-medium flex items-center gap-1">
                                <Lock className="w-2.5 h-2.5" />
                                <span>Subscription Only</span>
                              </span>
                            )}
                          </div>
                          
                          <p className="text-xs text-neutral-400 mt-1 line-clamp-2 max-w-xl">
                            {ep.synopsis}
                          </p>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        {/* Bookmark Episode to Watchlist Button */}
                        {onToggleWatchlist && (
                          <button
                            onClick={() => onToggleWatchlist(item, ep)}
                            className={`p-1.5 rounded-lg border transition-all ${
                              isItemWatchlisted?.(item.id, ep.id)
                                ? 'bg-rose-600/25 border-rose-500 text-rose-400'
                                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-rose-400 border-neutral-700'
                            }`}
                            title={isItemWatchlisted?.(item.id, ep.id) ? 'Remove episode from Watchlist' : 'Save episode to Watchlist'}
                            aria-label="Bookmark episode"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isItemWatchlisted?.(item.id, ep.id) ? 'fill-current text-rose-500' : ''}`} />
                          </button>
                        )}

                        {/* Stream / Play Episode Button */}
                        <button
                          onClick={() => {
                            onPlay(item, ep);
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium flex items-center gap-1.5 border border-neutral-700 transition-colors"
                        >
                          <Play className="w-3.5 h-3.5 fill-current text-rose-500" />
                          <span>Play</span>
                        </button>

                        {/* Download Episode Button */}
                        {isLockedForFreeTier ? (
                          <button
                            onClick={onOpenSubscriptionModal}
                            className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-amber-300 hover:bg-neutral-700 text-xs font-medium flex items-center gap-1.5 border border-dashed border-neutral-700 transition-colors"
                            title="Locked: Subscription tier only (Free tier limited to first 5 episodes)"
                          >
                            <Lock className="w-3.5 h-3.5 text-amber-400" />
                            <span>Unlock Ep {ep.episodeNumber}</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => onDownloadEpisode(item, ep)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-all ${
                              isDownloaded
                                ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-400'
                                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
                            }`}
                          >
                            {isDownloaded ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Downloaded</span>
                              </>
                            ) : (
                              <>
                                <Download className="w-3.5 h-3.5" />
                                <span>Download ({ep.fileSizeMb}MB)</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
