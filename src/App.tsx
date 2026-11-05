import React, { useState, useEffect, useMemo } from 'react';
import { 
  Film, Tv, Mic, Sparkles, Download, Check, Lock, AlertCircle, 
  Smartphone, Monitor, Search, Play, ArrowRight, ShieldCheck, Heart, Phone
} from 'lucide-react';
import { 
  AppLanguage, AppTheme, DJProfile, DownloadedItem, Episode, Language, MediaItem, 
  SubCategory, SubscriptionTier, UserAccount, UserSubscription, VideoQuality 
} from './types';
import { DJ_PROFILES, MEDIA_CATALOG, SUBSCRIPTION_PLANS, INITIAL_DOWNLOADS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { CategoryFilterBar } from './components/CategoryFilterBar';
import { MediaCard } from './components/MediaCard';
import { MediaDetailModal } from './components/MediaDetailModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { OfflineDownloadsModal } from './components/OfflineDownloadsModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { MobileDeviceFrame } from './components/MobileDeviceFrame';
import { SettingsModal } from './components/SettingsModal';
import { AuthModal } from './components/AuthModal';
import { SessionConflictModal } from './components/SessionConflictModal';
import { TRANSLATIONS } from './utils/i18n';

export default function App() {
  // Navigation & Category states
  const [currentLanguage, setCurrentLanguage] = useState<Language>('all');
  const [currentSubCategory, setCurrentSubCategory] = useState<SubCategory>('all');
  const [selectedDjId, setSelectedDjId] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Subscription state (defaults to 'free' mobile tier as requested by prompt)
  const [subscription, setSubscription] = useState<UserSubscription>(() => {
    try {
      const saved = localStorage.getItem('cinepulse_subscription');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (SUBSCRIPTION_PLANS[parsed.tier as SubscriptionTier]) {
          return SUBSCRIPTION_PLANS[parsed.tier as SubscriptionTier];
        }
      }
    } catch {}
    return SUBSCRIPTION_PLANS.free;
  });

  // Offline Downloads state
  const [downloads, setDownloads] = useState<DownloadedItem[]>(() => {
    const saved = localStorage.getItem('cinepulse_downloads');
    return saved ? JSON.parse(saved) : INITIAL_DOWNLOADS;
  });

  // Active modals & playback
  const [selectedDetailItem, setSelectedDetailItem] = useState<MediaItem | null>(null);
  const [activePlayerItem, setActivePlayerItem] = useState<{ item: MediaItem; episode?: Episode } | null>(null);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState<boolean>(false);
  const [isDownloadsModalOpen, setIsDownloadsModalOpen] = useState<boolean>(false);
  const [isMobileDeviceMode, setIsMobileDeviceMode] = useState<boolean>(false);

  // Theme state ('dark' | 'light')
  const [theme, setTheme] = useState<AppTheme>(() => {
    return (localStorage.getItem('cinepulse_theme') as AppTheme) || 'dark';
  });

  // App interface language ('en' | 'sw' | 'fr')
  const [appLanguage, setAppLanguage] = useState<AppLanguage>(() => {
    return (localStorage.getItem('cinepulse_app_lang') as AppLanguage) || 'en';
  });

  // User Account (Email-only login)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('cinepulse_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Modals state
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [sessionConflictInfo, setSessionConflictInfo] = useState<{ conflictingDeviceName: string; userEmail: string } | null>(null);

  // Sync theme with HTML document class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('cinepulse_theme', theme);
  }, [theme]);

  // Sync appLanguage to localStorage
  useEffect(() => {
    localStorage.setItem('cinepulse_app_lang', appLanguage);
  }, [appLanguage]);

  // Sync currentUser to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('cinepulse_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('cinepulse_user');
    }
  }, [currentUser]);

  // SINGLE DEVICE POLICY ENFORCEMENT
  // Detects if another device or browser tab logged into the same email account
  useEffect(() => {
    if (!currentUser) return;

    const checkSingleDeviceSession = () => {
      const activeSessionInRegistry = localStorage.getItem(`cinepulse_active_session_${currentUser.email}`);
      if (activeSessionInRegistry && activeSessionInRegistry !== currentUser.sessionId) {
        const conflictingDevice = localStorage.getItem(`cinepulse_active_device_name_${currentUser.email}`) || 'Another Device';
        
        // Force logout on this first device and reset to Free tier (locking Pro downloads)
        setCurrentUser(null);
        localStorage.removeItem('cinepulse_user');
        setSubscription(SUBSCRIPTION_PLANS.free);
        localStorage.setItem('cinepulse_subscription', JSON.stringify(SUBSCRIPTION_PLANS.free));

        setSessionConflictInfo({
          conflictingDeviceName: conflictingDevice,
          userEmail: currentUser.email
        });
      }
    };

    window.addEventListener('storage', checkSingleDeviceSession);
    const poller = setInterval(checkSingleDeviceSession, 2000);

    return () => {
      window.removeEventListener('storage', checkSingleDeviceSession);
      clearInterval(poller);
    };
  }, [currentUser]);

  // Handler: Login Success
  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    // Restore or assign active Pro tier so Pro downloads unlock immediately
    const userTierKey = `cinepulse_tier_${user.email}`;
    const savedTier = localStorage.getItem(userTierKey) as SubscriptionTier | null;
    const tierToSet: SubscriptionTier = savedTier || 'pro_usd';
    const plan = SUBSCRIPTION_PLANS[tierToSet] || SUBSCRIPTION_PLANS.pro_usd;
    setSubscription(plan);
    localStorage.setItem('cinepulse_subscription', JSON.stringify(plan));
    showToast(`Welcome back, ${user.email}! Premium downloads unlocked in ${plan.resolutionLimit.toUpperCase()}.`, 'success');
  };

  // Handler: Logout
  const handleLogout = () => {
    if (currentUser) {
      localStorage.removeItem(`cinepulse_active_session_${currentUser.email}`);
      localStorage.removeItem(`cinepulse_active_device_name_${currentUser.email}`);
    }
    setCurrentUser(null);
    localStorage.removeItem('cinepulse_user');
    // Switch to Free Guest tier: locks all Pro-tier downloads until user logs back in
    setSubscription(SUBSCRIPTION_PLANS.free);
    localStorage.setItem('cinepulse_subscription', JSON.stringify(SUBSCRIPTION_PLANS.free));
    showToast('Logged out. Switched to Free tier: Pro downloads are locked until you sign back in.', 'info');
  };

  // Handler: Simulate 2nd Device Sign-In (Tests single device kickout)
  const handleSimulateSecondDeviceLogin = () => {
    if (!currentUser) return;
    const secondDeviceName = 'iPhone 15 Pro (Nairobi / Dar es Salaam)';
    const newSessionId = `sess_2nd_device_${Date.now()}`;

    // Overwrite active session in the shared registry
    localStorage.setItem(`cinepulse_active_session_${currentUser.email}`, newSessionId);
    localStorage.setItem(`cinepulse_active_device_name_${currentUser.email}`, secondDeviceName);

    // Force terminate session on this device
    const email = currentUser.email;
    setCurrentUser(null);
    localStorage.removeItem('cinepulse_user');

    setSessionConflictInfo({
      conflictingDeviceName: secondDeviceName,
      userEmail: email
    });

    showToast('Simulated 2nd device sign-in. This device has been forcibly logged out.', 'warning');
  };

  // User feedback toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' | 'info' } | null>(null);

  // Sync subscription to localStorage
  useEffect(() => {
    localStorage.setItem('cinepulse_subscription', JSON.stringify(subscription));
  }, [subscription]);

  // Sync downloads to localStorage
  useEffect(() => {
    localStorage.setItem('cinepulse_downloads', JSON.stringify(downloads));
  }, [downloads]);

  // Show auto-dismissing toast
  const showToast = (message: string, type: 'success' | 'warning' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Change tier handler
  const handleSelectTier = (tier: SubscriptionTier) => {
    const newPlan = SUBSCRIPTION_PLANS[tier];
    setSubscription(newPlan);
    localStorage.setItem('cinepulse_subscription', JSON.stringify(newPlan));
    if (currentUser) {
      localStorage.setItem(`cinepulse_tier_${currentUser.email}`, tier);
    }
    showToast(
      `Plan switched to ${newPlan.planName}! ${
        tier === 'free' 
          ? 'Free mobile tier active (480p SD, ads enabled, first 5 episodes download).' 
          : 'All restrictions unlocked (Ad-free, 1080p/4K, unlimited episode downloads).'
      }`,
      'success'
    );
  };

  // Set of downloaded IDs for fast lookup
  const downloadedIds = useMemo(() => {
    const ids = new Set<string>();
    downloads.forEach((d) => {
      if (d.episodeId) {
        ids.add(d.episodeId);
      } else {
        ids.add(d.mediaId);
      }
    });
    return ids;
  }, [downloads]);

  // Handle episode download with Free Tier 5-Episode Constraint
  const handleDownloadEpisode = (media: MediaItem, episode: Episode) => {
    const episodeId = `${media.id}-ep-${episode.episodeNumber}`;

    if (downloadedIds.has(episodeId)) {
      showToast(`${episode.title} is already in your offline library!`, 'info');
      return;
    }

    // CHECK FREE TIER CONSTRAINT: Only first 5 episodes
    if (subscription.tier === 'free' && episode.episodeNumber > 5) {
      showToast(
        `Free Tier Limit: Only the first 5 episodes are downloadable on the free mobile plan. Episode ${episode.episodeNumber} requires a subscription!`,
        'warning'
      );
      setIsSubscriptionModalOpen(true);
      return;
    }

    const isPro = subscription.tier !== 'free' || episode.episodeNumber > 5;
    const newItem: DownloadedItem = {
      id: `dl-${episodeId}`,
      mediaId: media.id,
      mediaTitle: media.title,
      episodeId: episodeId,
      episodeNumber: episode.episodeNumber,
      seasonNumber: episode.seasonNumber,
      itemType: 'episode',
      title: `${media.title} - Ep ${episode.episodeNumber}`,
      subTitle: episode.title,
      language: media.language,
      djName: media.djName,
      fileSizeMb: episode.fileSizeMb,
      quality: subscription.tier === 'free' ? '480p' : subscription.resolutionLimit,
      downloadedAt: 'Just now',
      progress: 100,
      isComplete: true,
      videoUrl: episode.videoUrl,
      isProTierOnly: isPro,
      accountEmail: currentUser?.email
    };

    setDownloads((prev) => [newItem, ...prev]);
    showToast(
      `Downloaded ${media.title} (Ep ${episode.episodeNumber}) for offline viewing!`,
      'success'
    );
  };

  // Handle movie download
  const handleDownloadMovie = (media: MediaItem) => {
    if (downloadedIds.has(media.id)) {
      showToast(`${media.title} is already downloaded offline!`, 'info');
      return;
    }

    const isPro = subscription.tier !== 'free';
    const newItem: DownloadedItem = {
      id: `dl-${media.id}`,
      mediaId: media.id,
      mediaTitle: media.title,
      itemType: 'movie',
      title: media.title,
      subTitle: media.djName ? `${media.djName} Translation · ${media.duration}` : `${media.duration} · ${media.language.toUpperCase()}`,
      language: media.language,
      djName: media.djName,
      fileSizeMb: 420,
      quality: subscription.tier === 'free' ? '480p' : subscription.resolutionLimit,
      downloadedAt: 'Just now',
      progress: 100,
      isComplete: true,
      videoUrl: media.videoUrl,
      isProTierOnly: isPro,
      accountEmail: currentUser?.email
    };

    setDownloads((prev) => [newItem, ...prev]);
    showToast(`Downloaded "${media.title}" for offline playback!`, 'success');
  };

  // Delete downloaded item
  const handleDeleteDownload = (id: string) => {
    setDownloads((prev) => prev.filter((d) => d.id !== id));
    showToast('Download removed from offline storage.', 'info');
  };

  // Play downloaded item directly
  const handlePlayDownloaded = (downloaded: DownloadedItem) => {
    // ANTI-ACCOUNT SHARING PROTECTION:
    // If user is in Free / Guest mode (logged out or subscription is free),
    // they cannot play any Pro-tier downloads (episodes > 5, 1080p/4K, or pro-flagged files).
    const isProItem = Boolean(
      downloaded.isProTierOnly || 
      (downloaded.episodeNumber && downloaded.episodeNumber > 5) || 
      downloaded.quality === '4k' || 
      downloaded.quality === '1080p'
    );
    const isLocked = isProItem && (!currentUser || subscription.tier === 'free');

    if (isLocked) {
      showToast(
        'This download is locked under Pro subscription. Please log back in to play.',
        'warning'
      );
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      return;
    }

    const originalMedia = MEDIA_CATALOG.find((m) => m.id === downloaded.mediaId) || {
      id: downloaded.mediaId,
      title: downloaded.title,
      type: downloaded.itemType === 'episode' ? 'tv' : 'movie',
      language: downloaded.language as any,
      subCategory: downloaded.itemType === 'episode' ? 'tv' : 'movie',
      year: 2024,
      rating: '16+',
      matchScore: 98,
      duration: 'Offline File',
      genres: ['Downloaded Offline'],
      synopsis: 'Playing directly from local offline device storage cache.',
      bannerColor: 'from-neutral-900 to-neutral-950',
      posterBg: 'bg-neutral-900',
      videoUrl: downloaded.videoUrl,
      audioTracks: [
        { id: 'offline-audio', label: downloaded.djName ? `${downloaded.djName} Audio` : 'Standard Audio', type: 'original', language: 'en' }
      ]
    };

    let episodeObj: Episode | undefined;
    if (downloaded.episodeNumber) {
      episodeObj = {
        id: downloaded.episodeId || `${downloaded.mediaId}-ep`,
        episodeNumber: downloaded.episodeNumber,
        seasonNumber: downloaded.seasonNumber || 1,
        title: downloaded.subTitle,
        duration: '45m',
        synopsis: 'Offline cached episode playback.',
        thumbnailUrl: '',
        fileSizeMb: downloaded.fileSizeMb,
        videoUrl: downloaded.videoUrl
      };
    }

    setActivePlayerItem({ item: originalMedia, episode: episodeObj });
  };

  // Extract unique genres across catalog
  const allGenres = useMemo(() => {
    const set = new Set<string>();
    MEDIA_CATALOG.forEach((item) => {
      item.genres.forEach((g) => set.add(g));
    });
    return Array.from(set).sort();
  }, []);

  // Filtered Media items
  const filteredMedia = useMemo(() => {
    return MEDIA_CATALOG.filter((item) => {
      // Language filter
      if (currentLanguage !== 'all' && item.language !== currentLanguage) {
        return false;
      }

      // Sub-category filter for English & French: Movies vs TV Shows
      if (
        (currentLanguage === 'english' || currentLanguage === 'french') &&
        currentSubCategory !== 'all'
      ) {
        if (item.subCategory !== currentSubCategory) return false;
      }

      // DJ Filter for Swahili & Kinyarwanda
      if (selectedDjId) {
        if (item.djId !== selectedDjId) return false;
      }

      // Genre filter
      if (selectedGenre !== 'all') {
        if (!item.genres.includes(selectedGenre)) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesOriginal = item.originalTitle?.toLowerCase().includes(q);
        const matchesDj = item.djName?.toLowerCase().includes(q);
        const matchesGenre = item.genres.some((g) => g.toLowerCase().includes(q));
        if (!matchesTitle && !matchesOriginal && !matchesDj && !matchesGenre) {
          return false;
        }
      }

      return true;
    });
  }, [currentLanguage, currentSubCategory, selectedDjId, selectedGenre, searchQuery]);

  // Grouped items by section for the 'all' view
  const kinyarwandaItems = useMemo(
    () => MEDIA_CATALOG.filter((m) => m.language === 'kinyarwanda'),
    []
  );
  const swahiliItems = useMemo(
    () => MEDIA_CATALOG.filter((m) => m.language === 'swahili'),
    []
  );
  const englishItems = useMemo(
    () => MEDIA_CATALOG.filter((m) => m.language === 'english'),
    []
  );
  const frenchItems = useMemo(
    () => MEDIA_CATALOG.filter((m) => m.language === 'french'),
    []
  );

  // Main UI Content to be rendered in standard layout or mobile phone simulator
  const mainContent = (
    <div className="space-y-8 pb-16">
      
      {/* Free Tier Announcement Banner */}
      {subscription.tier === 'free' && (
        <div className="bg-gradient-to-r from-neutral-900 via-amber-950/40 to-neutral-900 border-y border-amber-500/20 px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
              <span>
                <strong>Free Mobile Plan:</strong> Ad-supported 480p streaming. TV series downloads limited to <strong>first 5 episodes only</strong>.
              </span>
            </div>
            <button
              onClick={() => setIsSubscriptionModalOpen(true)}
              className="self-start sm:self-auto text-rose-400 hover:text-rose-300 font-bold underline underline-offset-2 flex items-center gap-1"
            >
              <span>Unlock 1080p, 4K & All Episodes</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Main Container - Mobile-friendly & compact */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2 sm:pt-4 space-y-6 sm:space-y-8">
        
        {/* Categories, Subcategories & DJ Filters (Top & accessible) */}
        <CategoryFilterBar
          currentLanguage={currentLanguage}
          onSelectLanguage={(lang) => {
            setCurrentLanguage(lang);
            setCurrentSubCategory('all');
            setSelectedDjId('');
          }}
          currentSubCategory={currentSubCategory}
          onSelectSubCategory={setCurrentSubCategory}
          selectedDjId={selectedDjId}
          onSelectDj={setSelectedDjId}
          selectedGenre={selectedGenre}
          onSelectGenre={setSelectedGenre}
          allGenres={allGenres}
        />

        {/* Search status if active */}
        {searchQuery.trim() && (
          <div className="flex items-center justify-between text-xs text-neutral-400 border-b border-neutral-800 pb-2">
            <span>
              Search results for <strong className="text-white">"{searchQuery}"</strong> ({filteredMedia.length} found)
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-rose-400 hover:text-rose-300 font-medium"
            >
              Clear search
            </button>
          </div>
        )}

        {/* ================= CONDITIONAL CATALOG PRESENTATION ================= */}
        
        {/* CASE 1: Language-Specific Filtered Grid */}
        {currentLanguage !== 'all' || selectedDjId || searchQuery.trim() || selectedGenre !== 'all' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>
                  {currentLanguage === 'swahili'
                    ? 'Swahili DJ Translated Movies & TV Series'
                    : currentLanguage === 'kinyarwanda'
                    ? 'Agasobanuye: Kinyarwanda Translated Cinema'
                    : currentLanguage === 'english'
                    ? `English Dubbed ${currentSubCategory === 'movie' ? 'Movies' : currentSubCategory === 'tv' ? 'TV Shows' : 'Cinema'}`
                    : currentLanguage === 'french'
                    ? `Français (VF) ${currentSubCategory === 'movie' ? 'Films' : currentSubCategory === 'tv' ? 'Séries' : 'Cinéma'}`
                    : 'Search & Filter Results'}
                </span>
                <span className="text-xs text-neutral-400 font-normal">
                  ({filteredMedia.length} titles)
                </span>
              </h2>
            </div>

            {filteredMedia.length === 0 ? (
              <div className="p-12 text-center bg-neutral-900/50 rounded-2xl border border-neutral-800 space-y-3">
                <Film className="w-10 h-10 text-neutral-600 mx-auto" />
                <h3 className="text-sm font-semibold text-neutral-300">No movies or series found</h3>
                <p className="text-xs text-neutral-500">
                  Try adjusting your filter, choosing another DJ, or clearing your search keywords.
                </p>
                <button
                  onClick={() => {
                    setCurrentLanguage('all');
                    setCurrentSubCategory('all');
                    setSelectedDjId('');
                    setSelectedGenre('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white rounded-xl"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredMedia.map((item) => (
                  <MediaCard
                    key={item.id}
                    item={item}
                    subscription={subscription}
                    onSelect={(item) => setSelectedDetailItem(item)}
                    onPlay={(item) => setActivePlayerItem({ item })}
                    onQuickDownload={(item) => {
                      if (item.type === 'movie') {
                        handleDownloadMovie(item);
                      } else {
                        setSelectedDetailItem(item);
                      }
                    }}
                    isDownloaded={downloadedIds.has(item.id)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* CASE 2: "All Cinema" Overview with Curated Categorized Sections */
          <div className="space-y-12">
            
            {/* Section 1: Kinyarwanda Translated (Agasobanuye by Rwandan DJs) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <Mic className="w-5 h-5 text-rose-500" />
                    <span>Agasobanuye: Kinyarwanda Voiceover Translations</span>
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Reworked by iconic Rwandan video translators: Junior Giti, Rocky Kimomo, Savimbi, DJ Young, Chris & Sankara
                  </p>
                </div>

                <button
                  onClick={() => setCurrentLanguage('kinyarwanda')}
                  className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
                >
                  <span>Explore by DJs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {kinyarwandaItems.slice(0, 4).map((item) => (
                  <MediaCard
                    key={item.id}
                    item={item}
                    subscription={subscription}
                    onSelect={(item) => setSelectedDetailItem(item)}
                    onPlay={(item) => setActivePlayerItem({ item })}
                    onQuickDownload={(item) => {
                      if (item.type === 'movie') {
                        handleDownloadMovie(item);
                      } else {
                        setSelectedDetailItem(item);
                      }
                    }}
                    isDownloaded={downloadedIds.has(item.id)}
                  />
                ))}
              </div>
            </div>

            {/* Section 2: Swahili Translated (Video Jokers / DJs) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <Film className="w-5 h-5 text-amber-500" />
                    <span>Swahili Translated Cinema (DJs & Video Jokers)</span>
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Commentary & real-time translation by DJ Afro Amigo, DJ Murphy, DJ Smith, DJ Ally B & DJ Black
                  </p>
                </div>

                <button
                  onClick={() => setCurrentLanguage('swahili')}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                >
                  <span>View All Swahili DJs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {swahiliItems.slice(0, 4).map((item) => (
                  <MediaCard
                    key={item.id}
                    item={item}
                    subscription={subscription}
                    onSelect={(item) => setSelectedDetailItem(item)}
                    onPlay={(item) => setActivePlayerItem({ item })}
                    onQuickDownload={(item) => {
                      if (item.type === 'movie') {
                        handleDownloadMovie(item);
                      } else {
                        setSelectedDetailItem(item);
                      }
                    }}
                    isDownloaded={downloadedIds.has(item.id)}
                  />
                ))}
              </div>
            </div>

            {/* Section 3: English Dubbed (Movies & TV Shows) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <Tv className="w-5 h-5 text-blue-500" />
                    <span>English Dubbed Movies & TV Shows</span>
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    High production value studio dubs with subcategories for Movies and TV Series
                  </p>
                </div>

                <button
                  onClick={() => setCurrentLanguage('english')}
                  className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
                >
                  <span>Filter Movies / Series</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {englishItems.slice(0, 4).map((item) => (
                  <MediaCard
                    key={item.id}
                    item={item}
                    subscription={subscription}
                    onSelect={(item) => setSelectedDetailItem(item)}
                    onPlay={(item) => setActivePlayerItem({ item })}
                    onQuickDownload={(item) => {
                      if (item.type === 'movie') {
                        handleDownloadMovie(item);
                      } else {
                        setSelectedDetailItem(item);
                      }
                    }}
                    isDownloaded={downloadedIds.has(item.id)}
                  />
                ))}
              </div>
            </div>

            {/* Section 4: French Dubbed (VF - Films & Séries) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <Film className="w-5 h-5 text-indigo-500" />
                    <span>Version Française (Films & Séries Doublés en Français)</span>
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Sélection internationale entièrement doublée en Français (VF)
                  </p>
                </div>

                <button
                  onClick={() => setCurrentLanguage('french')}
                  className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
                >
                  <span>Voir Catalogue VF</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {frenchItems.slice(0, 4).map((item) => (
                  <MediaCard
                    key={item.id}
                    item={item}
                    subscription={subscription}
                    onSelect={(item) => setSelectedDetailItem(item)}
                    onPlay={(item) => setActivePlayerItem({ item })}
                    onQuickDownload={(item) => {
                      if (item.type === 'movie') {
                        handleDownloadMovie(item);
                      } else {
                        setSelectedDetailItem(item);
                      }
                    }}
                    isDownloaded={downloadedIds.has(item.id)}
                  />
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Feature Comparison Box: Free Tier vs Subscription */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
                Streaming Tiers & Offline Capabilities
              </span>
              <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white mt-1">
                Why Upgrade to CinePulse Subscription?
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
                The Free Mobile tier provides ad-supported viewing and download of the first 5 episodes. Upgrade to Pro in USD ($3), BIF (6,000 BIF), or TZS (3,000 Tsh) for limitless 4K offline streaming.
              </p>
            </div>

            <button
              onClick={() => setIsSubscriptionModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 self-start md:self-auto shadow-md transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Choose Currency Plan</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-neutral-950/80 border border-rose-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400">Pro in USD</span>
                <span className="text-xs text-rose-400 font-mono font-bold">$3 / month</span>
              </div>
              <ul className="text-xs text-neutral-300 space-y-1.5 pt-2 border-t border-neutral-800/60">
                <li>• <strong>100% Ad-Free</strong> streaming</li>
                <li>• <strong>4K Ultra HD</strong> & 1080p Full HD</li>
                <li>• <strong>Unlimited downloads</strong> (All episodes)</li>
                <li>• International cards & PayPal</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950/80 border border-amber-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400">Pro in BIF</span>
                <span className="text-xs text-amber-400 font-mono font-bold">6,000 BIF / mo</span>
              </div>
              <ul className="text-xs text-neutral-300 space-y-1.5 pt-2 border-t border-neutral-800/60">
                <li>• <strong>100% Ad-Free</strong> streaming</li>
                <li>• <strong>4K Ultra HD</strong> & 1080p Full HD</li>
                <li>• <strong>Unlimited downloads</strong> (All episodes)</li>
                <li>• Lumicash, EcoCash & Burundi payments</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950/80 border border-blue-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400">Pro in TZS</span>
                <span className="text-xs text-blue-400 font-mono font-bold">3,000 Tsh / mo</span>
              </div>
              <ul className="text-xs text-neutral-300 space-y-1.5 pt-2 border-t border-neutral-800/60">
                <li>• <strong>100% Ad-Free</strong> streaming</li>
                <li>• <strong>4K Ultra HD</strong> & 1080p Full HD</li>
                <li>• <strong>Unlimited downloads</strong> (All episodes)</li>
                <li>• M-Pesa, Tigo Pesa & Airtel Money</li>
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-neutral-800 bg-neutral-950 pt-10 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-rose-500" />
              <span className="font-bold text-neutral-200">CinePulse Streaming</span>
              <span>· Global Cinema & East African DJ Voiceover Translation</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400">
              <button onClick={() => setCurrentLanguage('kinyarwanda')} className="hover:text-neutral-200 transition-colors">Agasobanuye (Kinyarwanda)</button>
              <button onClick={() => setCurrentLanguage('swahili')} className="hover:text-neutral-200 transition-colors">Swahili DJs</button>
              <button onClick={() => setCurrentLanguage('english')} className="hover:text-neutral-200 transition-colors">English Dubs</button>
              <button onClick={() => setCurrentLanguage('french')} className="hover:text-neutral-200 transition-colors">Français (VF)</button>
              <button onClick={() => setIsSubscriptionModalOpen(true)} className="text-rose-400 hover:text-rose-300 font-semibold">Subscription Plans</button>
            </div>
          </div>

          <div className="border-t border-neutral-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span>© 2026 CinePulse Streaming. All rights reserved.</span>
              <span className="hidden sm:inline">·</span>
              <span>Website made by <strong className="text-neutral-300 font-semibold">Abdoul Kay</strong></span>
            </div>

            <div className="flex items-center gap-2 text-neutral-400">
              <Phone className="w-3.5 h-3.5 text-rose-500" />
              <span>Contact:</span>
              <a 
                href="tel:+255764882615" 
                className="text-neutral-300 hover:text-rose-400 font-medium transition-colors"
              >
                +255 764 882615
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-900/40 dark:bg-neutral-950 text-neutral-100 dark:text-neutral-100 flex flex-col font-sans selection:bg-rose-600 selection:text-white transition-colors duration-200">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 max-w-sm p-4 rounded-xl shadow-2xl bg-neutral-900 border border-neutral-700 text-xs animate-fadeIn flex items-start gap-3">
          {toast.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : toast.type === 'warning' ? (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          ) : (
            <Sparkles className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          )}
          <span className="text-neutral-200 leading-relaxed">{toast.message}</span>
        </div>
      )}

      {/* RENDER IN MOBILE SIMULATOR OR FULL DESKTOP VIEW */}
      {isMobileDeviceMode ? (
        <MobileDeviceFrame
          onExitMobileMode={() => setIsMobileDeviceMode(false)}
          subscription={subscription}
          downloadCount={downloads.length}
          onOpenDownloads={() => setIsDownloadsModalOpen(true)}
          onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          currentLanguage={currentLanguage}
          onSelectLanguage={setCurrentLanguage}
        >
          {mainContent}
        </MobileDeviceFrame>
      ) : (
        <>
          {/* Top Navbar */}
          <Navbar
            currentLanguage={currentLanguage}
            onSelectLanguage={(lang) => {
              setCurrentLanguage(lang);
              setCurrentSubCategory('all');
              setSelectedDjId('');
            }}
            subscription={subscription}
            onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
            onOpenDownloadsModal={() => setIsDownloadsModalOpen(true)}
            onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
            onOpenAuthModal={(mode = 'login') => {
              setAuthModalMode(mode);
              setIsAuthModalOpen(true);
            }}
            currentUser={currentUser}
            downloadCount={downloads.length}
            isMobileDeviceMode={isMobileDeviceMode}
            onToggleDeviceMode={() => setIsMobileDeviceMode(!isMobileDeviceMode)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            appLanguage={appLanguage}
          />

          {/* Main Desktop Layout */}
          <main className="flex-1">
            {mainContent}
          </main>
        </>
      )}

      {/* ================= MODALS ================= */}

      {/* Media Detail Modal */}
      {selectedDetailItem && (
        <MediaDetailModal
          item={selectedDetailItem}
          isOpen={!!selectedDetailItem}
          onClose={() => setSelectedDetailItem(null)}
          subscription={subscription}
          onPlay={(item, episode) => {
            setActivePlayerItem({ item, episode });
          }}
          onDownloadEpisode={handleDownloadEpisode}
          onDownloadMovie={handleDownloadMovie}
          downloadedIds={downloadedIds}
          onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
        />
      )}

      {/* Video Player Modal */}
      {activePlayerItem && (
        <VideoPlayerModal
          item={activePlayerItem.item}
          episode={activePlayerItem.episode}
          isOpen={!!activePlayerItem}
          onClose={() => setActivePlayerItem(null)}
          subscription={subscription}
          onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
          onNextEpisode={() => {
            if (activePlayerItem.item.episodes && activePlayerItem.episode) {
              const currentIdx = activePlayerItem.item.episodes.findIndex(
                (e) => e.id === activePlayerItem.episode?.id
              );
              if (currentIdx !== -1 && currentIdx < activePlayerItem.item.episodes.length - 1) {
                setActivePlayerItem({
                  item: activePlayerItem.item,
                  episode: activePlayerItem.item.episodes[currentIdx + 1]
                });
              }
            }
          }}
          onPrevEpisode={() => {
            if (activePlayerItem.item.episodes && activePlayerItem.episode) {
              const currentIdx = activePlayerItem.item.episodes.findIndex(
                (e) => e.id === activePlayerItem.episode?.id
              );
              if (currentIdx > 0) {
                setActivePlayerItem({
                  item: activePlayerItem.item,
                  episode: activePlayerItem.item.episodes[currentIdx - 1]
                });
              }
            }
          }}
        />
      )}

      {/* Offline Downloads Library Modal */}
      <OfflineDownloadsModal
        isOpen={isDownloadsModalOpen}
        onClose={() => setIsDownloadsModalOpen(false)}
        downloads={downloads}
        onPlayDownloaded={handlePlayDownloaded}
        onDeleteDownload={handleDeleteDownload}
        subscription={subscription}
        currentUser={currentUser}
        onOpenSubscriptionModal={() => {
          setIsDownloadsModalOpen(false);
          setIsSubscriptionModalOpen(true);
        }}
        onOpenAuthModal={(mode = 'login') => {
          setAuthModalMode(mode);
          setIsAuthModalOpen(true);
        }}
      />

      {/* Subscription Plans Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        currentSubscription={subscription}
        onSelectTier={handleSelectTier}
      />

      {/* Settings Modal (Theme, 3 Languages, Account, Single Device) */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        theme={theme}
        onToggleTheme={(newTheme) => setTheme(newTheme)}
        appLanguage={appLanguage}
        onSelectAppLanguage={(lang) => setAppLanguage(lang)}
        currentUser={currentUser}
        onOpenAuthModal={(mode = 'login') => {
          setAuthModalMode(mode);
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        onSimulateSecondDeviceLogin={handleSimulateSecondDeviceLogin}
      />

      {/* Email-Only Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialMode={authModalMode}
        appLanguage={appLanguage}
      />

      {/* Single Device Session Conflict Modal */}
      <SessionConflictModal
        isOpen={!!sessionConflictInfo}
        onClose={() => setSessionConflictInfo(null)}
        userEmail={sessionConflictInfo?.userEmail || ''}
        conflictingDeviceName={sessionConflictInfo?.conflictingDeviceName || 'Another Device'}
        onRelogin={() => {
          setAuthModalMode('login');
          setIsAuthModalOpen(true);
        }}
        appLanguage={appLanguage}
      />

    </div>
  );
}
