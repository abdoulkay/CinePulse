import React from 'react';
import { Play, Download, Info, Check, Mic, Lock, Tv, Film } from 'lucide-react';
import { MediaItem, UserSubscription } from '../types';

interface MediaCardProps {
  item: MediaItem;
  subscription: UserSubscription;
  onSelect: (item: MediaItem) => void;
  onPlay: (item: MediaItem) => void;
  onQuickDownload?: (item: MediaItem) => void;
  isDownloaded?: boolean;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  item,
  subscription,
  onSelect,
  onPlay,
  onQuickDownload,
  isDownloaded = false
}) => {
  const isDjTranslated = item.language === 'swahili' || item.language === 'kinyarwanda';
  const isFreeTier = subscription.tier === 'free';

  return (
    <div className="group relative bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800/80 hover:border-neutral-600 transition-all duration-300 flex flex-col hover:shadow-xl hover:shadow-black/50">
      {/* Poster / Artwork Header */}
      <div 
        onClick={() => onSelect(item)}
        className={`relative aspect-[16/10] sm:aspect-[16/9] w-full ${item.posterBg} p-4 flex flex-col justify-between cursor-pointer overflow-hidden`}
      >
        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 bg-radial-gradient opacity-30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="relative z-10 flex items-center justify-between gap-1">
          {/* Subcategory or DJ Badge */}
          {isDjTranslated && item.djName ? (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-950/80 backdrop-blur-md border border-neutral-700/60 text-[11px] font-semibold text-rose-300">
              <Mic className="w-3 h-3 text-rose-400" />
              <span className="truncate max-w-[120px]">{item.djName}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-950/80 backdrop-blur-md border border-neutral-700/60 text-[11px] font-medium text-neutral-300">
              {item.type === 'tv' ? <Tv className="w-3 h-3 text-cyan-400" /> : <Film className="w-3 h-3 text-amber-400" />}
              <span className="capitalize">{item.subCategory === 'tv' ? 'TV Series' : 'Movie'}</span>
            </div>
          )}

          {/* Quality badge (free tier shows 480p SD limitation tag, Pro tiers show 4K Ultra HD) */}
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
            isFreeTier 
              ? 'bg-neutral-800/90 text-neutral-400 border border-neutral-700' 
              : 'bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-amber-300 border border-amber-500/40'
          }`}>
            {isFreeTier ? '480p SD (Free)' : '4K Ultra HD (Pro)'}
          </span>
        </div>

        {/* Center Title Art (Always legible and stylistically robust) */}
        <div className="relative z-10 my-auto text-center px-2 py-4">
          <h3 className="font-display font-extrabold text-lg sm:text-xl text-white tracking-tight drop-shadow-md line-clamp-2">
            {item.title}
          </h3>
          {item.originalTitle && (
            <p className="text-[11px] text-neutral-400 font-medium italic mt-0.5 line-clamp-1">
              Original: {item.originalTitle}
            </p>
          )}
        </div>

        {/* Bottom Metadata Bar */}
        <div className="relative z-10 flex items-center justify-between text-[11px] text-neutral-300">
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-400 font-bold tabular-nums">{item.matchScore}%</span>
            <span>·</span>
            <span>{item.year}</span>
            <span>·</span>
            <span className="px-1 py-0.2 bg-neutral-800 rounded text-[10px] text-neutral-400 font-mono">
              {item.rating}
            </span>
          </div>
          <span className="text-neutral-400 text-[11px]">{item.duration}</span>
        </div>

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 bg-neutral-950/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay(item);
            }}
            className="w-10 h-10 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
            title="Watch now"
            aria-label="Watch now"
          >
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(item);
            }}
            className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center border border-neutral-600 hover:scale-105 transition-transform"
            title="View episodes & details"
            aria-label="View episodes & details"
          >
            <Info className="w-4 h-4" />
          </button>

          {onQuickDownload && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickDownload(item);
              }}
              className={`w-9 h-9 rounded-full flex items-center justify-center border hover:scale-105 transition-transform ${
                isDownloaded
                  ? 'bg-emerald-600/30 border-emerald-500 text-emerald-400'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-600'
              }`}
              title={isDownloaded ? "Downloaded offline" : "Download offline"}
              aria-label={isDownloaded ? "Downloaded offline" : "Download offline"}
            >
              {isDownloaded ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Card Details Body */}
      <div className="p-3.5 flex flex-col flex-grow justify-between gap-2">
        <div>
          {/* Genre line */}
          <div className="flex flex-wrap items-center gap-1 text-[11px] text-neutral-400">
            {item.genres.slice(0, 3).map((genre, idx) => (
              <React.Fragment key={genre}>
                <span className="hover:text-neutral-200">{genre}</span>
                {idx < Math.min(item.genres.length, 3) - 1 && <span className="text-neutral-600">·</span>}
              </React.Fragment>
            ))}
          </div>

          {/* Synopsis snippet */}
          <p className="text-xs text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
            {item.synopsis}
          </p>
        </div>

        {/* Series Download Quota Note for Free Tier */}
        {item.type === 'tv' && (
          <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px]">
            <span className="text-neutral-400">
              {item.episodes ? `${item.episodes.length} Episodes available` : 'Full Series'}
            </span>

            {isFreeTier ? (
              <span className="text-amber-400/90 font-medium flex items-center gap-1" title="Free Tier limit: First 5 episodes only">
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Ep 1-5 Free DL</span>
              </span>
            ) : (
              <span className="text-emerald-400 font-medium">All Episodes Unlocked</span>
            )}
          </div>
        )}

        {/* Translation DJ callout if translated */}
        {isDjTranslated && item.djName && (
          <div className="pt-1.5 flex items-center justify-between text-[11px] text-neutral-400 border-t border-neutral-800/50">
            <span className="text-neutral-500">Translation Voice:</span>
            <span className="text-rose-400 font-medium">{item.djName}</span>
          </div>
        )}
      </div>
    </div>
  );
};
