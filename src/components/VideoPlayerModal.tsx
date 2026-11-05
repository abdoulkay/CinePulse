import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, 
  RotateCw, Sparkles, Lock, Sliders, Mic, ShieldAlert, SkipForward, AlertCircle 
} from 'lucide-react';
import { Episode, MediaItem, UserSubscription, VideoQuality } from '../types';

interface VideoPlayerModalProps {
  item: MediaItem;
  episode?: Episode;
  isOpen: boolean;
  onClose: () => void;
  subscription: UserSubscription;
  onOpenSubscriptionModal: () => void;
  onNextEpisode?: () => void;
  onPrevEpisode?: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  item,
  episode,
  isOpen,
  onClose,
  subscription,
  onOpenSubscriptionModal,
  onNextEpisode,
  onPrevEpisode
}) => {
  if (!isOpen) return null;

  const videoRef = useRef<HTMLVideoElement>(null);
  const isFreeTier = subscription.tier === 'free';
  const isDjTranslated = item.language === 'swahili' || item.language === 'kinyarwanda';

  // Video playback states
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(100);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);

  // Free Tier Ad Simulation states
  const [isAdPlaying, setIsAdPlaying] = useState<boolean>(isFreeTier);
  const [adSecondsRemaining, setAdSecondsRemaining] = useState<number>(10);
  const [canSkipAd, setCanSkipAd] = useState<boolean>(false);

  // Quality & Audio states
  const [selectedQuality, setSelectedQuality] = useState<VideoQuality>('480p');
  const [showQualityMenu, setShowQualityMenu] = useState<boolean>(false);
  const [qualityLockAlert, setQualityLockAlert] = useState<string | null>(null);

  const [selectedAudioTrack, setSelectedAudioTrack] = useState<string>(
    item.audioTracks.find(t => t.type === 'dj_overlay')?.id || item.audioTracks[0]?.id || 'default'
  );
  const [showAudioMenu, setShowAudioMenu] = useState<boolean>(false);
  const [djVoiceBalance, setDjVoiceBalance] = useState<number>(75); // 0-100%

  // Set default quality based on plan
  useEffect(() => {
    if (subscription.tier !== 'free') {
      setSelectedQuality('4k');
    } else {
      setSelectedQuality('480p');
    }
  }, [subscription.tier]);

  // Handle Free Tier Ad Countdown
  useEffect(() => {
    let timer: any;
    if (isAdPlaying && isFreeTier) {
      setAdSecondsRemaining(10);
      setCanSkipAd(false);

      timer = setInterval(() => {
        setAdSecondsRemaining((prev) => {
          if (prev <= 6) {
            setCanSkipAd(true);
          }
          if (prev <= 1) {
            clearInterval(timer);
            setIsAdPlaying(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isAdPlaying, isFreeTier, episode?.id, item.id]);

  // Video progress listeners
  const handleTimeUpdate = () => {
    if (videoRef.current && !isAdPlaying) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 100);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {
        // Fallback to muted play if browser blocks sound autoplay
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().catch(() => {});
        }
      });
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleQualitySelect = (quality: VideoQuality) => {
    // Free Tier locked to 480p max
    if (isFreeTier && quality !== '480p') {
      setQualityLockAlert(
        `Resolution ${quality.toUpperCase()} is reserved for Pro members ($3 / 6000 BIF / 3000 Tsh). Free Mobile Tier streams in 480p SD.`
      );
      setShowQualityMenu(false);
      return;
    }
    setSelectedQuality(quality);
    setShowQualityMenu(false);
    setQualityLockAlert(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const videoSource = episode ? episode.videoUrl : item.videoUrl;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-center items-center select-none overflow-hidden">
      
      {/* Top Header Controls */}
      <div className="absolute top-0 left-0 right-0 z-30 p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white flex items-center justify-center border border-neutral-700/80 transition-colors"
            aria-label="Exit player"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>{item.title}</span>
              {episode && (
                <span className="text-neutral-400 font-normal">
                  · S{episode.seasonNumber}:E{episode.episodeNumber} ({episode.title})
                </span>
              )}
            </h2>

            <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
              {isDjTranslated && item.djName && (
                <span className="text-rose-400 flex items-center gap-1">
                  <Mic className="w-3 h-3" />
                  <span>{item.djName} Voiceover</span>
                </span>
              )}
              <span>·</span>
              <span className="text-neutral-300 font-mono">{selectedQuality.toUpperCase()}</span>
              {isFreeTier && (
                <span className="text-amber-400 font-medium">(Free Tier - Ad Supported)</span>
              )}
            </div>
          </div>
        </div>

        {/* Upgrade / Plan CTA */}
        {isFreeTier ? (
          <button
            onClick={onOpenSubscriptionModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upgrade to</span> Ad-Free 4K
          </button>
        ) : (
          <span className="text-xs text-neutral-400 px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800">
            {subscription.planName}
          </span>
        )}
      </div>

      {/* Main Video Viewport */}
      <div 
        className="relative w-full h-full flex items-center justify-center bg-black"
        onMouseMove={() => setShowControls(true)}
      >
        <video
          ref={videoRef}
          src={isAdPlaying ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' : videoSource}
          autoPlay
          playsInline
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => {
            if (isAdPlaying) {
              setIsAdPlaying(false);
            }
          }}
          className="max-h-full max-w-full w-full h-full object-contain"
        />

        {/* ================= FREE TIER AD OVERLAY ================= */}
        {isAdPlaying && isFreeTier && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col justify-between p-6 sm:p-10 z-20 pointer-events-auto">
            {/* Ad Sponsor Kicker */}
            <div className="self-start bg-neutral-900/90 border border-neutral-700 rounded-xl px-4 py-2 flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Advertisement
              </span>
              <span className="text-xs text-neutral-400">·</span>
              <span className="text-xs text-neutral-300">
                Sponsored by SwiftNet 5G Mobile Data Saver
              </span>
            </div>

            {/* Ad Countdown & Skip or Upgrade Button */}
            <div className="self-end bg-neutral-950/90 border border-neutral-700/80 rounded-2xl p-4 max-w-md shadow-2xl flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs text-neutral-300">
                <span>Free Tier Ad: 1 of 1</span>
                <span className="font-mono text-amber-400 font-bold tabular-nums">
                  {adSecondsRemaining}s remaining
                </span>
              </div>

              <div className="flex items-center gap-3">
                {canSkipAd ? (
                  <button
                    onClick={() => setIsAdPlaying(false)}
                    className="flex-1 py-2 px-4 rounded-xl bg-neutral-100 hover:bg-white text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Skip Advertisement</span>
                    <SkipForward className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="flex-1 py-2 px-4 rounded-xl bg-neutral-800 text-neutral-400 text-xs font-medium text-center">
                    You can skip in {adSecondsRemaining - 5 > 0 ? adSecondsRemaining - 5 : 1}s...
                  </div>
                )}

                <button
                  onClick={onOpenSubscriptionModal}
                  className="py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-1 transition-colors whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Remove Ads ($4.99)</span>
                </button>
              </div>

              <p className="text-[11px] text-neutral-400 text-center">
                Upgrade to Standard HD or Premium 4K to eliminate all ads completely.
              </p>
            </div>
          </div>
        )}

        {/* Quality Restriction Toast Alert */}
        {qualityLockAlert && (
          <div className="absolute top-20 z-40 bg-neutral-950/95 border border-amber-500/60 rounded-xl p-4 max-w-md shadow-2xl animate-fadeIn flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white">Upgrade Required for HD / 4K</h4>
              <p className="text-xs text-neutral-300">{qualityLockAlert}</p>
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={onOpenSubscriptionModal}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-md"
                >
                  View Plans
                </button>
                <button
                  onClick={() => setQualityLockAlert(null)}
                  className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs rounded-md"
                >
                  Continue in 480p SD
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Control Bar */}
        <div className={`absolute bottom-0 left-0 right-0 z-30 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}>
          {/* Progress / Seek bar */}
          <div className="space-y-1 mb-3">
            <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              disabled={isAdPlaying}
              className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-rose-600 focus:outline-none"
            />
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-4">
            
            {/* Left: Playback controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                disabled={isAdPlaying}
                className="w-10 h-10 rounded-full bg-white hover:bg-neutral-200 text-neutral-950 flex items-center justify-center transition-colors disabled:opacity-40"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              {onPrevEpisode && (
                <button
                  onClick={onPrevEpisode}
                  className="text-neutral-400 hover:text-white p-1"
                  title="Previous Episode"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}

              {onNextEpisode && (
                <button
                  onClick={onNextEpisode}
                  className="text-neutral-400 hover:text-white p-1"
                  title="Next Episode"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              )}

              {/* Volume */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-neutral-400 hover:text-white p-1"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setVolume(v);
                    setIsMuted(false);
                    if (videoRef.current) videoRef.current.volume = v;
                  }}
                  className="w-16 h-1 bg-neutral-700 rounded appearance-none accent-rose-500 cursor-pointer hidden sm:inline"
                />
              </div>
            </div>

            {/* Right: Audio Tracks, Quality, Fullscreen */}
            <div className="flex items-center gap-3 relative">
              
              {/* DJ Voiceover Audio Mixer Trigger */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowAudioMenu(!showAudioMenu);
                    setShowQualityMenu(false);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    showAudioMenu 
                      ? 'bg-rose-600 text-white border-rose-500' 
                      : 'bg-neutral-900 text-neutral-300 border-neutral-700 hover:bg-neutral-800'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden sm:inline">Audio & Commentary</span>
                </button>

                {/* Audio Track & DJ Voice Balance Menu */}
                {showAudioMenu && (
                  <div className="absolute bottom-12 right-0 w-72 bg-neutral-900 border border-neutral-700 rounded-xl p-4 shadow-2xl space-y-3 z-40">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Audio Stream & Translation
                    </h4>

                    {/* Track selection */}
                    <div className="space-y-1.5">
                      {item.audioTracks.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setSelectedAudioTrack(t.id)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                            selectedAudioTrack === t.id
                              ? 'bg-rose-600 text-white font-semibold'
                              : 'text-neutral-300 hover:bg-neutral-800'
                          }`}
                        >
                          <span className="truncate">{t.label}</span>
                          {t.type === 'dj_overlay' && <span className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded">DJ</span>}
                        </button>
                      ))}
                    </div>

                    {/* DJ Voice Balance Slider if DJ overlay */}
                    {isDjTranslated && (
                      <div className="pt-2 border-t border-neutral-800 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] text-neutral-400">
                          <span>DJ Voice Balance:</span>
                          <span className="font-mono text-rose-400 font-bold">{djVoiceBalance}%</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={djVoiceBalance}
                          onChange={(e) => setDjVoiceBalance(parseInt(e.target.value))}
                          className="w-full h-1.5 bg-neutral-800 rounded accent-rose-500 cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-neutral-500">
                          <span>More Film Audio</span>
                          <span>More DJ Voice</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Resolution / Quality Selector */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowQualityMenu(!showQualityMenu);
                    setShowAudioMenu(false);
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                    showQualityMenu
                      ? 'bg-neutral-800 text-white border-neutral-600'
                      : 'bg-neutral-900 text-neutral-300 border-neutral-700 hover:bg-neutral-800'
                  }`}
                >
                  <span>{selectedQuality.toUpperCase()}</span>
                </button>

                {/* Quality Menu Dropdown */}
                {showQualityMenu && (
                  <div className="absolute bottom-12 right-0 w-52 bg-neutral-900 border border-neutral-700 rounded-xl p-2 shadow-2xl space-y-1 z-40">
                    <div className="px-2 py-1 text-[11px] font-bold text-neutral-400 border-b border-neutral-800">
                      Video Stream Resolution
                    </div>

                    {(['480p', '720p', '1080p', '4k'] as VideoQuality[]).map((q) => {
                      const isLocked = isFreeTier && q !== '480p';
                      const isSelected = selectedQuality === q;

                      return (
                        <button
                          key={q}
                          onClick={() => handleQualitySelect(q)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                            isSelected
                              ? 'bg-rose-600 text-white font-bold'
                              : 'text-neutral-300 hover:bg-neutral-800'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span>{q.toUpperCase()}</span>
                            {q === '480p' && <span className="text-[10px] text-neutral-400">(Free SD)</span>}
                            {q === '1080p' && <span className="text-[10px] text-neutral-400">(FHD)</span>}
                            {q === '4k' && <span className="text-[10px] text-amber-400 font-bold">(UHD HDR)</span>}
                          </div>
                          {isLocked && <Lock className="w-3 h-3 text-amber-400" />}
                        </button>
                      );
                    })}

                    {isFreeTier && (
                      <div className="pt-1 border-t border-neutral-800 p-1.5 text-[10px] text-amber-400">
                        HD/4K locked on Free tier. Click to upgrade.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Fullscreen Toggle */}
              <button
                onClick={() => {
                  if (document.fullscreenElement) {
                    document.exitFullscreen();
                  } else {
                    document.documentElement.requestFullscreen().catch(() => {});
                  }
                }}
                className="text-neutral-400 hover:text-white p-1"
                title="Fullscreen"
              >
                <Maximize className="w-4 h-4" />
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
