import React, { useState, useEffect, useMemo } from 'react';
import { 
  Film, Tv, Mic, Sparkles, Download, Check, Lock, AlertCircle, 
  Smartphone, Monitor, Search, Play, ArrowRight, ShieldCheck, Heart, Phone
} from 'lucide-react';
import { 
  AppLanguage, AppTheme, CommunityUploadItem, ContinueWatchingItem, DJProfile, DownloadedItem, Episode, Language, MediaItem, 
  MovieRequestItem, ParentalControlsConfig, SubCategory, SubscriptionTier, UserAccount, UserSubscription, VideoQuality, WatchlistItem 
} from './types';
import { 
  DJ_PROFILES, MEDIA_CATALOG, SUBSCRIPTION_PLANS, INITIAL_DOWNLOADS, INITIAL_WATCHLIST, 
  INITIAL_CONTINUE_WATCHING, INITIAL_COMMUNITY_UPLOADS, INITIAL_MOVIE_REQUESTS,
  ADULT_MOVIES_CATALOG, DEFAULT_PARENTAL_CONTROLS, doesMediaExceedMaxRating, normalizeRatingBadge
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { CategoryFilterBar } from './components/CategoryFilterBar';
import { MediaCard } from './components/MediaCard';
import { MediaRow } from './components/MediaRow';
import { ContinueWatchingRow } from './components/ContinueWatchingRow';
import { SearchTop10Modal } from './components/SearchTop10Modal';
import { MediaDetailModal } from './components/MediaDetailModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { OfflineDownloadsModal } from './components/OfflineDownloadsModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { MobileDeviceFrame } from './components/MobileDeviceFrame';
import { SettingsModal } from './components/SettingsModal';
import { AuthModal } from './components/AuthModal';
import { SessionConflictModal } from './components/SessionConflictModal';
import { WatchlistSection } from './components/WatchlistSection';
import { UploadPortalModal } from './components/UploadPortalModal';
import { MovieRequestModal } from './components/MovieRequestModal';
import { ParentalPinModal } from './components/ParentalPinModal';
import { HiddenAdultSection } from './components/HiddenAdultSection';
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

  // Watchlist state (persists in localStorage)
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    try {
      const saved = localStorage.getItem('cinepulse_watchlist');
      return saved ? JSON.parse(saved) : INITIAL_WATCHLIST;
    } catch {
      return INITIAL_WATCHLIST;
    }
  });

  // Sync watchlist to localStorage
  useEffect(() => {
    localStorage.setItem('cinepulse_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Continue Watching state (persists in localStorage)
  const [continueWatching, setContinueWatching] = useState<ContinueWatchingItem[]>(() => {
    try {
      const saved = localStorage.getItem('cinepulse_continue_watching');
      return saved ? JSON.parse(saved) : INITIAL_CONTINUE_WATCHING;
    } catch {
      return INITIAL_CONTINUE_WATCHING;
    }
  });

  // Sync continue watching to localStorage
  useEffect(() => {
    localStorage.setItem('cinepulse_continue_watching', JSON.stringify(continueWatching));
  }, [continueWatching]);

  // Active modals & playback
  const [selectedDetailItem, setSelectedDetailItem] = useState<MediaItem | null>(null);
  const [activePlayerItem, setActivePlayerItem] = useState<{ item: MediaItem; episode?: Episode; initialTime?: number } | null>(null);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState<boolean>(false);
  const [isDownloadsModalOpen, setIsDownloadsModalOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isMobileDeviceMode, setIsMobileDeviceMode] = useState<boolean>(false);

  // Dynamic Catalog (Combines base catalog with approved community uploads)
  const [catalog, setCatalog] = useState<MediaItem[]>(() => {
    try {
      const saved = localStorage.getItem('cinepulse_approved_community_media');
      if (saved) {
        const approved: MediaItem[] = JSON.parse(saved);
        return [...approved, ...MEDIA_CATALOG];
      }
    } catch {}
    return MEDIA_CATALOG;
  });

  // Community Uploads State (Pro submissions for admin review)
  const [communityUploads, setCommunityUploads] = useState<CommunityUploadItem[]>(() => {
    try {
      const saved = localStorage.getItem('cinepulse_community_uploads');
      return saved ? JSON.parse(saved) : INITIAL_COMMUNITY_UPLOADS;
    } catch {
      return INITIAL_COMMUNITY_UPLOADS;
    }
  });

  // Movie Requests State (Community requested movies & series)
  const [movieRequests, setMovieRequests] = useState<MovieRequestItem[]>(() => {
    try {
      const saved = localStorage.getItem('cinepulse_movie_requests');
      return saved ? JSON.parse(saved) : INITIAL_MOVIE_REQUESTS;
    } catch {
      return INITIAL_MOVIE_REQUESTS;
    }
  });

  // Portal Modals state
  const [isUploadPortalOpen, setIsUploadPortalOpen] = useState<boolean>(false);
  const [isMovieRequestModalOpen, setIsMovieRequestModalOpen] = useState<boolean>(false);
  const [movieRequestSearchPrefill, setMovieRequestSearchPrefill] = useState<string>('');

  // Sync community uploads to localStorage
  useEffect(() => {
    localStorage.setItem('cinepulse_community_uploads', JSON.stringify(communityUploads));
  }, [communityUploads]);

  // Sync movie requests to localStorage
  useEffect(() => {
    localStorage.setItem('cinepulse_movie_requests', JSON.stringify(movieRequests));
  }, [movieRequests]);

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

  // Parental Controls & Adult Content Filter State (persists in localStorage)
  const [parentalControls, setParentalControls] = useState<ParentalControlsConfig>(() => {
    try {
      const saved = localStorage.getItem('cinepulse_parental_controls');
      if (saved) {
        return { ...DEFAULT_PARENTAL_CONTROLS, ...JSON.parse(saved) };
      }
    } catch {}
    return DEFAULT_PARENTAL_CONTROLS;
  });

  // Sync parentalControls to localStorage
  useEffect(() => {
    localStorage.setItem('cinepulse_parental_controls', JSON.stringify(parentalControls));
  }, [parentalControls]);

  const handleUpdateParentalControls = (updated: Partial<ParentalControlsConfig>) => {
    setParentalControls((prev) => ({ ...prev, ...updated }));
  };

  // PIN Challenge Modal State (for playback rating lock or unlocking the Hidden Adult Movies Vault)
  const [pinModalState, setPinModalState] = useState<{
    isOpen: boolean;
    mode: 'playback' | 'unlock_adult_vault';
    item?: MediaItem;
    episode?: Episode;
    initialTime?: number;
  }>({
    isOpen: false,
    mode: 'playback'
  });

  // Centralized Playback Gate: Enforces Parental Controls Maximum Rating & 4-Digit PIN
  const handleRequestPlayMedia = (item: MediaItem, episode?: Episode, initialTime?: number) => {
    const isAdultItem = Boolean(item.isAdult || normalizeRatingBadge(item.rating) === '18+');
    const exceedsMaxRating =
      parentalControls.enabled &&
      doesMediaExceedMaxRating(item.rating, parentalControls.maxRating, item.isAdult);

    if (exceedsMaxRating || (isAdultItem && !parentalControls.ageConfirmed18Plus)) {
      setPinModalState({
        isOpen: true,
        mode: 'playback',
        item,
        episode,
        initialTime
      });
      return;
    }

    setActivePlayerItem({ item, episode, initialTime });
  };

  // Handler for toggling or unlocking the Hidden Adult Movies Section
  const handleTriggerAdultVault = () => {
    if (parentalControls.hiddenAdultVaultUnlocked && !parentalControls.filterAdultContent) {
      // Already unlocked: scroll to the Hidden Adult Movies Section
      document.getElementById('hidden-adult-movies-section')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Prompt for 18+ Age Confirmation & 4-Digit Parental PIN
      setPinModalState({
        isOpen: true,
        mode: 'unlock_adult_vault'
      });
    }
  };

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
    const basePlan = SUBSCRIPTION_PLANS[tierToSet] || SUBSCRIPTION_PLANS.pro_usd;
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 27);
    const plan: UserSubscription = {
      ...basePlan,
      daysRemaining: basePlan.tier === 'free' ? 0 : 27,
      subscriptionExpiryDate: basePlan.tier === 'free' ? undefined : expiry.toISOString()
    };
    setSubscription(plan);
    localStorage.setItem('cinepulse_subscription', JSON.stringify(plan));
    showToast(`Welcome back, ${user.displayName || user.username || user.name || user.email}! Premium downloads unlocked in ${plan.resolutionLimit.toUpperCase()}.`, 'success');
  };

  // Handler: Update User Profile & Credentials (Username, Display Name, Avatar, Email, Password)
  const handleUpdateProfile = (updatedFields: Partial<UserAccount>, newPassword?: string) => {
    if (!currentUser) return;
    const oldEmail = currentUser.email;
    const newEmail = updatedFields.email ? updatedFields.email.trim().toLowerCase() : oldEmail;

    const updatedUser: UserAccount = {
      ...currentUser,
      ...updatedFields,
      email: newEmail,
      lastActive: 'Just now'
    };

    setCurrentUser(updatedUser);
    localStorage.setItem('cinepulse_user', JSON.stringify(updatedUser));

    // If email was changed, migrate active session tokens so single-device enforcement stays seamless
    if (newEmail !== oldEmail) {
      const activeSession = localStorage.getItem(`cinepulse_active_session_${oldEmail}`) || currentUser.sessionId;
      const deviceName = localStorage.getItem(`cinepulse_active_device_name_${oldEmail}`) || currentUser.deviceName;
      localStorage.setItem(`cinepulse_active_session_${newEmail}`, activeSession);
      localStorage.setItem(`cinepulse_active_device_name_${newEmail}`, deviceName);
      localStorage.removeItem(`cinepulse_active_session_${oldEmail}`);
      localStorage.removeItem(`cinepulse_active_device_name_${oldEmail}`);

      // Migrate tier preference key as well
      const savedTier = localStorage.getItem(`cinepulse_tier_${oldEmail}`);
      if (savedTier) {
        localStorage.setItem(`cinepulse_tier_${newEmail}`, savedTier);
        localStorage.removeItem(`cinepulse_tier_${oldEmail}`);
      }
    }

    // Persist new password securely in local storage if updated
    if (newPassword && newPassword.trim()) {
      localStorage.setItem(`cinepulse_pwd_${newEmail}`, newPassword.trim());
    }

    showToast('Profile credentials and settings updated successfully! ✨', 'success');
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
    const basePlan = SUBSCRIPTION_PLANS[tier];
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);
    const newPlan: UserSubscription = {
      ...basePlan,
      daysRemaining: tier === 'free' ? 0 : 30,
      subscriptionExpiryDate: tier === 'free' ? undefined : expiry.toISOString()
    };
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

  // Handler: Community Movie Upload Submission (Pro Users)
  const handleUploadSubmit = (uploadData: Omit<CommunityUploadItem, 'id' | 'submittedAt' | 'status'>) => {
    const newUpload: CommunityUploadItem = {
      ...uploadData,
      id: `upload-com-${Date.now()}`,
      submittedAt: 'Just now',
      status: 'pending'
    };
    setCommunityUploads((prev) => [newUpload, ...prev]);
    showToast(`"${uploadData.title}" submitted for admin review! Automated duplicate check passed. 🎬`, 'success');
  };

  // Handler: Admin Approves Community Upload (Publishes live to catalog)
  const handleApproveUpload = (uploadId: string, adminNotes: string) => {
    const upload = communityUploads.find(u => u.id === uploadId);
    if (!upload) return;

    const publishedMediaId = `com-pub-${upload.id}`;

    // Update upload status to approved
    setCommunityUploads((prev) => prev.map(u => {
      if (u.id === uploadId) {
        return {
          ...u,
          status: 'approved',
          reviewedAt: 'Just now',
          adminReviewer: 'Admin team',
          adminNotes: adminNotes || 'Approved by admin: Video & audio stream verified.',
          publishedMediaId
        };
      }
      return u;
    }));

    // Create live MediaItem in catalog
    const newMedia: MediaItem = {
      id: publishedMediaId,
      title: upload.title,
      originalTitle: upload.originalTitle,
      type: upload.type,
      language: upload.language,
      subCategory: upload.type,
      djName: upload.djName,
      year: upload.year,
      rating: 'PG-13',
      matchScore: 98,
      duration: upload.videoDuration,
      genres: upload.genres,
      synopsis: upload.synopsis,
      translationNotes: `Contributed by community pro ${upload.contributorUsername || upload.contributorName}. Certified 1080p stream.`,
      bannerColor: 'from-rose-900 via-rose-950 to-neutral-950',
      posterBg: 'bg-gradient-to-br from-rose-700 via-rose-900 to-neutral-950',
      videoUrl: upload.videoUrl,
      audioTracks: [
        {
          id: `${publishedMediaId}-audio`,
          label: upload.djName ? `${upload.djName} Voiceover` : 'Standard Audio',
          type: upload.djName ? 'dj_overlay' : 'dubbed',
          language: upload.language
        }
      ]
    };

    setCatalog((prev) => {
      const next = [newMedia, ...prev.filter(m => m.id !== publishedMediaId)];
      try {
        const approvedOnly = next.filter(m => m.id.startsWith('com-pub-'));
        localStorage.setItem('cinepulse_approved_community_media', JSON.stringify(approvedOnly));
      } catch {}
      return next;
    });

    showToast(`"${upload.title}" approved and published live to CinePulse! ✨`, 'success');
  };

  // Handler: Admin Rejects Community Upload
  const handleRejectUpload = (uploadId: string, adminNotes: string) => {
    const upload = communityUploads.find(u => u.id === uploadId);
    if (!upload) return;

    setCommunityUploads((prev) => prev.map(u => {
      if (u.id === uploadId) {
        return {
          ...u,
          status: 'rejected',
          reviewedAt: 'Just now',
          adminReviewer: 'Admin team',
          adminNotes: adminNotes || 'Declined during quality or duplication inspection.'
        };
      }
      return u;
    }));

    showToast(`Upload "${upload.title}" declined: ${adminNotes || 'Does not meet standards.'}`, 'info');
  };

  // Handler: Submit Community Movie Request
  const handleMovieRequestSubmit = (newRequest: Omit<MovieRequestItem, 'id' | 'createdAt' | 'upvotesCount' | 'upvotedByEmails' | 'status'>) => {
    const req: MovieRequestItem = {
      ...newRequest,
      id: `req-${Date.now()}`,
      createdAt: 'Just now',
      upvotesCount: 1,
      upvotedByEmails: [newRequest.requestedByEmail],
      status: 'requested'
    };
    setMovieRequests((prev) => [req, ...prev]);
    showToast(`Request for "${newRequest.title}" added to the community board! 🗳️`, 'success');
  };

  // Handler: Upvote Community Movie Request
  const handleToggleUpvoteRequest = (requestId: string) => {
    if (!currentUser) {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      return;
    }
    setMovieRequests((prev) => prev.map(r => {
      if (r.id === requestId) {
        const hasUpvoted = r.upvotedByEmails.includes(currentUser.email);
        const upvotedByEmails = hasUpvoted
          ? r.upvotedByEmails.filter(e => e !== currentUser.email)
          : [...r.upvotedByEmails, currentUser.email];
        const upvotesCount = hasUpvoted ? Math.max(0, r.upvotesCount - 1) : r.upvotesCount + 1;
        return {
          ...r,
          upvotedByEmails,
          upvotesCount
        };
      }
      return r;
    }));
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

    const allAvailableMedia = [...catalog, ...ADULT_MOVIES_CATALOG];
    const originalMedia = allAvailableMedia.find((m) => m.id === downloaded.mediaId) || {
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

    handleRequestPlayMedia(originalMedia, episodeObj);
  };

  // Check if item or specific episode is in watchlist
  const isWatchlisted = (mediaId: string, episodeId?: string): boolean => {
    if (episodeId) {
      return watchlist.some((w) => w.mediaId === mediaId && w.episodeId === episodeId);
    }
    return watchlist.some((w) => w.mediaId === mediaId && !w.episodeId);
  };

  // Toggle movie or specific episode bookmark
  const handleToggleWatchlist = (media: MediaItem, episode?: Episode) => {
    if (episode) {
      const episodeBookmarkId = `wl-${media.id}-ep-${episode.id || episode.episodeNumber}`;
      const existing = watchlist.find((w) => w.id === episodeBookmarkId || (w.mediaId === media.id && w.episodeId === episode.id));

      if (existing) {
        setWatchlist((prev) => prev.filter((w) => w.id !== existing.id));
        showToast(`Removed "${episode.title}" from My Watchlist`, 'info');
      } else {
        const newItem: WatchlistItem = {
          id: episodeBookmarkId,
          mediaId: media.id,
          itemType: 'episode',
          title: episode.title,
          subTitle: `${media.title} · S${episode.seasonNumber || 1}:Ep ${episode.episodeNumber}`,
          mediaTitle: media.title,
          episodeId: episode.id,
          episodeNumber: episode.episodeNumber,
          seasonNumber: episode.seasonNumber || 1,
          language: media.language,
          djName: media.djName,
          posterBg: media.posterBg,
          bannerColor: media.bannerColor,
          matchScore: media.matchScore,
          duration: episode.duration,
          year: media.year,
          rating: media.rating,
          genres: media.genres,
          addedAt: 'Just now',
          videoUrl: episode.videoUrl || media.videoUrl
        };
        setWatchlist((prev) => [newItem, ...prev]);
        showToast(`Bookmarked "${episode.title}" to My Watchlist! ❤️`, 'success');
      }
    } else {
      const mediaBookmarkId = `wl-${media.id}`;
      const existing = watchlist.find((w) => w.id === mediaBookmarkId || (w.mediaId === media.id && !w.episodeId));

      if (existing) {
        setWatchlist((prev) => prev.filter((w) => w.id !== existing.id));
        showToast(`Removed "${media.title}" from My Watchlist`, 'info');
      } else {
        const newItem: WatchlistItem = {
          id: mediaBookmarkId,
          mediaId: media.id,
          itemType: media.type === 'tv' ? 'tv' : 'movie',
          title: media.title,
          subTitle: media.djName ? `${media.djName} · ${media.duration}` : `${media.duration} · ${media.year}`,
          mediaTitle: media.title,
          language: media.language,
          djName: media.djName,
          posterBg: media.posterBg,
          bannerColor: media.bannerColor,
          matchScore: media.matchScore,
          duration: media.duration,
          year: media.year,
          rating: media.rating,
          genres: media.genres,
          addedAt: 'Just now',
          videoUrl: media.videoUrl
        };
        setWatchlist((prev) => [newItem, ...prev]);
        showToast(`Added "${media.title}" to My Watchlist! ❤️`, 'success');
      }
    }
  };

  // Remove item from watchlist
  const handleRemoveFromWatchlist = (id: string) => {
    setWatchlist((prev) => prev.filter((w) => w.id !== id));
    showToast('Removed from Watchlist.', 'info');
  };

  // Clear watchlist
  const handleClearWatchlist = () => {
    setWatchlist([]);
    showToast('Watchlist cleared.', 'info');
  };

  // Play item from watchlist directly
  const handlePlayWatchlistItem = (watchlistItem: WatchlistItem) => {
    const allAvailableMedia = [...catalog, ...ADULT_MOVIES_CATALOG];
    const foundMedia = allAvailableMedia.find((m) => m.id === watchlistItem.mediaId);
    const originalMedia: MediaItem = foundMedia || {
      id: watchlistItem.mediaId,
      title: watchlistItem.title,
      type: watchlistItem.itemType === 'episode' ? 'tv' : 'movie',
      language: watchlistItem.language,
      subCategory: watchlistItem.itemType === 'episode' ? 'tv' : 'movie',
      year: watchlistItem.year,
      rating: watchlistItem.rating,
      matchScore: watchlistItem.matchScore,
      duration: watchlistItem.duration,
      genres: watchlistItem.genres,
      synopsis: 'Playing from bookmarked watchlist.',
      bannerColor: watchlistItem.bannerColor,
      posterBg: watchlistItem.posterBg,
      videoUrl: watchlistItem.videoUrl || '',
      audioTracks: [
        { id: 'wl-audio', label: watchlistItem.djName ? `${watchlistItem.djName} Audio` : 'Standard Audio', type: 'original', language: 'en' }
      ]
    };

    let episodeObj: Episode | undefined;
    if (watchlistItem.itemType === 'episode' && originalMedia.episodes) {
      episodeObj = originalMedia.episodes.find((e: Episode) => e.id === watchlistItem.episodeId || e.episodeNumber === watchlistItem.episodeNumber);
    }
    if (!episodeObj && watchlistItem.itemType === 'episode') {
      episodeObj = {
        id: watchlistItem.episodeId || `${watchlistItem.mediaId}-ep`,
        episodeNumber: watchlistItem.episodeNumber || 1,
        seasonNumber: watchlistItem.seasonNumber || 1,
        title: watchlistItem.title,
        duration: watchlistItem.duration,
        synopsis: 'Bookmarked episode playback.',
        thumbnailUrl: '',
        fileSizeMb: 250,
        videoUrl: watchlistItem.videoUrl || originalMedia.videoUrl
      };
    }

    handleRequestPlayMedia(originalMedia, episodeObj);
  };

  // Scroll to Watchlist helper
  const handleScrollToWatchlist = () => {
    if (currentLanguage !== 'all' || selectedDjId || searchQuery.trim() || selectedGenre !== 'all') {
      setCurrentLanguage('all');
      setCurrentSubCategory('all');
      setSelectedDjId('');
      setSelectedGenre('all');
      setSearchQuery('');
    }
    setTimeout(() => {
      document.getElementById('my-watchlist-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  };

  // CONTINUE WATCHING: Update playback progress automatically
  const handleUpdateProgress = (
    media: MediaItem,
    episode: Episode | undefined,
    currentTime: number,
    duration: number
  ) => {
    const dur = Math.max(1, duration);
    const percent = Math.min(100, Math.round((currentTime / dur) * 100));
    const itemId = episode ? `cw-${media.id}-ep-${episode.episodeNumber}` : `cw-${media.id}`;

    // If user has watched > 95%, treat as finished and remove
    if (percent >= 95) {
      setContinueWatching((prev) => prev.filter((cw) => cw.id !== itemId));
      return;
    }

    setContinueWatching((prev) => {
      const existingIdx = prev.findIndex((cw) => cw.id === itemId);
      const updatedItem: ContinueWatchingItem = {
        id: itemId,
        mediaId: media.id,
        itemType: episode ? 'episode' : (media.type === 'tv' ? 'episode' : 'movie'),
        title: episode ? episode.title : media.title,
        subTitle: episode 
          ? `${media.title} · S${episode.seasonNumber || 1}:Ep ${episode.episodeNumber}` 
          : (media.djName ? `${media.djName} · ${media.duration}` : `${media.year} · ${media.duration}`),
        mediaTitle: media.title,
        episodeId: episode?.id,
        episodeNumber: episode?.episodeNumber,
        seasonNumber: episode?.seasonNumber || 1,
        currentTimeSeconds: Math.floor(currentTime),
        durationSeconds: Math.floor(dur),
        progressPercent: Math.max(5, percent),
        posterBg: media.posterBg,
        bannerColor: media.bannerColor,
        lastWatchedAt: 'Just now',
        language: media.language,
        djName: media.djName,
        videoUrl: episode ? episode.videoUrl : media.videoUrl
      };

      if (existingIdx !== -1) {
        const clone = [...prev];
        clone[existingIdx] = updatedItem;
        return clone;
      } else {
        return [updatedItem, ...prev];
      }
    });
  };

  // CONTINUE WATCHING: Resume playback at exact recorded second
  const handleResumePlayback = (cwItem: ContinueWatchingItem) => {
    const allAvailableMedia = [...catalog, ...ADULT_MOVIES_CATALOG];
    const media = allAvailableMedia.find((m) => m.id === cwItem.mediaId) || {
      id: cwItem.mediaId,
      title: cwItem.mediaTitle || cwItem.title,
      type: cwItem.itemType === 'episode' ? 'tv' : 'movie',
      language: cwItem.language || 'swahili',
      subCategory: cwItem.itemType === 'episode' ? 'tv' : 'movie',
      year: 2024,
      rating: '16+',
      matchScore: 98,
      duration: '45m',
      genres: ['Action', 'Thriller'],
      synopsis: 'Resuming playback where you left off.',
      bannerColor: cwItem.bannerColor || 'from-neutral-900 to-neutral-950',
      posterBg: cwItem.posterBg || 'bg-neutral-900',
      videoUrl: cwItem.videoUrl || '',
      audioTracks: [{ id: 'cw-audio', label: 'Audio', type: 'original', language: 'en' }]
    };

    let ep: Episode | undefined;
    if (cwItem.itemType === 'episode') {
      if (media.episodes) {
        ep = media.episodes.find((e) => e.episodeNumber === cwItem.episodeNumber || e.id === cwItem.episodeId);
      }
      if (!ep) {
        ep = {
          id: cwItem.episodeId || `${media.id}-ep-${cwItem.episodeNumber || 1}`,
          episodeNumber: cwItem.episodeNumber || 1,
          seasonNumber: cwItem.seasonNumber || 1,
          title: cwItem.title,
          duration: `${Math.ceil(cwItem.durationSeconds / 60)}m`,
          synopsis: 'Resuming playback.',
          thumbnailUrl: '',
          fileSizeMb: 250,
          videoUrl: cwItem.videoUrl || media.videoUrl
        };
      }
    }

    handleRequestPlayMedia(media, ep, cwItem.currentTimeSeconds);
  };

  // CONTINUE WATCHING: Remove item from list
  const handleRemoveFromContinueWatching = (id: string) => {
    setContinueWatching((prev) => prev.filter((cw) => cw.id !== id));
    showToast('Removed from Continue Watching.', 'info');
  };

  // Catalog filtered by Adult Content Filter setting
  const visibleCatalog = useMemo(() => {
    const baseList =
      !parentalControls.filterAdultContent && parentalControls.hiddenAdultVaultUnlocked
        ? [...catalog, ...ADULT_MOVIES_CATALOG]
        : catalog;

    if (!parentalControls.filterAdultContent) {
      return baseList;
    }

    return baseList.filter(
      (item) => !item.isAdult && normalizeRatingBadge(item.rating) !== '18+'
    );
  }, [catalog, parentalControls.filterAdultContent, parentalControls.hiddenAdultVaultUnlocked]);

  // Extract unique genres across visible catalog
  const allGenres = useMemo(() => {
    const set = new Set<string>();
    visibleCatalog.forEach((item) => {
      item.genres.forEach((g) => set.add(g));
    });
    return Array.from(set).sort();
  }, [visibleCatalog]);

  // Filtered Media items
  const filteredMedia = useMemo(() => {
    return visibleCatalog.filter((item) => {
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
  }, [visibleCatalog, currentLanguage, currentSubCategory, selectedDjId, selectedGenre, searchQuery]);

  // Standard catalog filtered by adult content setting for main rows
  const mainRailsCatalog = useMemo(() => {
    if (!parentalControls.filterAdultContent) return catalog;
    return catalog.filter((item) => !item.isAdult && normalizeRatingBadge(item.rating) !== '18+');
  }, [catalog, parentalControls.filterAdultContent]);

  // Curated category rows for the Netflix-style landing view
  const actionItems = useMemo(
    () => mainRailsCatalog.filter((m) => m.genres.some((g) => ['Action', 'Martial Arts', 'Adventure'].includes(g))),
    [mainRailsCatalog]
  );
  const comedyItems = useMemo(
    () => mainRailsCatalog.filter((m) => m.genres.includes('Comedy') || m.djName?.includes('Murphy') || m.title.includes('Shaolin') || m.title.includes('Vituko')),
    [mainRailsCatalog]
  );
  const thrillerItems = useMemo(
    () => mainRailsCatalog.filter((m) => m.genres.some((g) => ['Thriller', 'Crime', 'Mystery', 'Suspense'].includes(g))),
    [mainRailsCatalog]
  );
  const becauseYouWatchedItems = useMemo(
    () => mainRailsCatalog.filter((m) => ['swa-afro-1', 'kin-giti-1', 'swa-murphy-1', 'kin-rocky-2', 'swa-afro-2'].includes(m.id)),
    [mainRailsCatalog]
  );

  // Grouped items by language for the catalog
  const kinyarwandaItems = useMemo(
    () => mainRailsCatalog.filter((m) => m.language === 'kinyarwanda'),
    [mainRailsCatalog]
  );
  const swahiliItems = useMemo(
    () => mainRailsCatalog.filter((m) => m.language === 'swahili'),
    [mainRailsCatalog]
  );
  const englishItems = useMemo(
    () => mainRailsCatalog.filter((m) => m.language === 'english'),
    [mainRailsCatalog]
  );
  const frenchItems = useMemo(
    () => mainRailsCatalog.filter((m) => m.language === 'french'),
    [mainRailsCatalog]
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
        
        {/* Categories, Subcategories, DJ Filters & Parental / Adult Vault Controls */}
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
          parentalControls={parentalControls}
          onOpenParentalSettings={() => setIsSettingsModalOpen(true)}
          onToggleAdultVault={handleTriggerAdultVault}
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {filteredMedia.map((item) => (
                  <MediaCard
                    key={item.id}
                    item={item}
                    subscription={subscription}
                    onSelect={(item) => setSelectedDetailItem(item)}
                    onPlay={(item) => handleRequestPlayMedia(item)}
                    onQuickDownload={(item) => {
                      if (item.type === 'movie') {
                        handleDownloadMovie(item);
                      } else {
                        setSelectedDetailItem(item);
                      }
                    }}
                    isDownloaded={downloadedIds.has(item.id)}
                    isWatchlisted={isWatchlisted(item.id)}
                    onToggleWatchlist={handleToggleWatchlist}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* CASE 2: Netflix-Ordered Category Rails & Continue Watching */
          <div className="space-y-8 sm:space-y-10">
            
            {/* 1. Continue Watching Row */}
            {continueWatching.length > 0 && (
              <ContinueWatchingRow
                items={continueWatching}
                onResume={handleResumePlayback}
                onRemove={handleRemoveFromContinueWatching}
                onSelectMedia={(media) => setSelectedDetailItem(media)}
                subscription={subscription}
              />
            )}

            {/* 2. Because You Watched Commando ya Mwisho (98% match) */}
            <MediaRow
              title="Because You Watched Commando ya Mwisho"
              subtitle="98% Match based on your high-octane African cinema taste"
              badge="98% Match"
              badgeColor="text-rose-400 bg-rose-500/10 border-rose-500/30"
              items={becauseYouWatchedItems}
              subscription={subscription}
              onSelect={(item) => setSelectedDetailItem(item)}
              onPlay={(item) => handleRequestPlayMedia(item)}
              onQuickDownload={(item) => {
                if (item.type === 'movie') handleDownloadMovie(item);
                else setSelectedDetailItem(item);
              }}
              downloadedIds={downloadedIds}
              isWatchlisted={(id) => isWatchlisted(id)}
              onToggleWatchlist={handleToggleWatchlist}
              initialCardLimit={5}
            />

            {/* 3. Action Blockbusters & Martial Arts */}
            <MediaRow
              title="Action Blockbusters & Martial Arts"
              subtitle="Fast-paced explosive missions & intense fight choreography"
              badge="Trending Action"
              badgeColor="text-rose-400 bg-rose-500/10 border-rose-500/30"
              items={actionItems}
              subscription={subscription}
              onSelect={(item) => setSelectedDetailItem(item)}
              onPlay={(item) => handleRequestPlayMedia(item)}
              onQuickDownload={(item) => {
                if (item.type === 'movie') handleDownloadMovie(item);
                else setSelectedDetailItem(item);
              }}
              downloadedIds={downloadedIds}
              isWatchlisted={(id) => isWatchlisted(id)}
              onToggleWatchlist={handleToggleWatchlist}
              initialCardLimit={5}
            />

            {/* 4. Comedy & DJ Humor */}
            <MediaRow
              title="Comedy & DJ Humor"
              subtitle="Non-stop laughter, witty commentaries & parody punchlines"
              badge="DJ Wit & Parody"
              badgeColor="text-amber-400 bg-amber-500/10 border-amber-500/30"
              items={comedyItems}
              subscription={subscription}
              onSelect={(item) => setSelectedDetailItem(item)}
              onPlay={(item) => handleRequestPlayMedia(item)}
              onQuickDownload={(item) => {
                if (item.type === 'movie') handleDownloadMovie(item);
                else setSelectedDetailItem(item);
              }}
              downloadedIds={downloadedIds}
              isWatchlisted={(id) => isWatchlisted(id)}
              onToggleWatchlist={handleToggleWatchlist}
              initialCardLimit={5}
            />

            {/* 5. Suspense & Crime Thrillers */}
            <MediaRow
              title="Suspense & Crime Thrillers"
              subtitle="Heart-racing mysteries, urban investigations & dark twists"
              badge="Top Suspense"
              badgeColor="text-cyan-400 bg-cyan-500/10 border-cyan-500/30"
              items={thrillerItems}
              subscription={subscription}
              onSelect={(item) => setSelectedDetailItem(item)}
              onPlay={(item) => handleRequestPlayMedia(item)}
              onQuickDownload={(item) => {
                if (item.type === 'movie') handleDownloadMovie(item);
                else setSelectedDetailItem(item);
              }}
              downloadedIds={downloadedIds}
              isWatchlisted={(id) => isWatchlisted(id)}
              onToggleWatchlist={handleToggleWatchlist}
              initialCardLimit={5}
            />

            {/* 6. Agasobanuye: Rwandan DJ Translations */}
            <MediaRow
              id="kinyarwanda-cinema-section"
              title="Agasobanuye: Rwandan DJ Translations"
              subtitle="Iconic voiceovers by Junior Giti, Rocky Kimomo, Savimbi & Sankara"
              badge="Kinyarwanda"
              badgeColor="text-rose-400 bg-rose-500/10 border-rose-500/30"
              items={kinyarwandaItems}
              subscription={subscription}
              onSelect={(item) => setSelectedDetailItem(item)}
              onPlay={(item) => handleRequestPlayMedia(item)}
              onQuickDownload={(item) => {
                if (item.type === 'movie') handleDownloadMovie(item);
                else setSelectedDetailItem(item);
              }}
              downloadedIds={downloadedIds}
              isWatchlisted={(id) => isWatchlisted(id)}
              onToggleWatchlist={handleToggleWatchlist}
              onSeeMore={() => setCurrentLanguage('kinyarwanda')}
              initialCardLimit={5}
            />

            {/* 7. Swahili DJ Voiceovers */}
            <MediaRow
              title="Swahili DJ Voiceovers (Video Jokers)"
              subtitle="Commentary & narrative translations by DJ Afro Amigo, DJ Murphy, DJ Smith"
              badge="Swahili Hits"
              badgeColor="text-amber-400 bg-amber-500/10 border-amber-500/30"
              items={swahiliItems}
              subscription={subscription}
              onSelect={(item) => setSelectedDetailItem(item)}
              onPlay={(item) => handleRequestPlayMedia(item)}
              onQuickDownload={(item) => {
                if (item.type === 'movie') handleDownloadMovie(item);
                else setSelectedDetailItem(item);
              }}
              downloadedIds={downloadedIds}
              isWatchlisted={(id) => isWatchlisted(id)}
              onToggleWatchlist={handleToggleWatchlist}
              onSeeMore={() => setCurrentLanguage('swahili')}
              initialCardLimit={5}
            />

            {/* 8. My Watchlist Section */}
            <WatchlistSection
              watchlist={watchlist}
              onPlayItem={handlePlayWatchlistItem}
              onSelectItem={(mediaId) => {
                const allAvailableMedia = [...catalog, ...ADULT_MOVIES_CATALOG];
                const item = allAvailableMedia.find((m) => m.id === mediaId);
                if (item) setSelectedDetailItem(item);
              }}
              onRemoveItem={handleRemoveFromWatchlist}
              onClearWatchlist={handleClearWatchlist}
              onBrowseCatalog={() => {
                const el = document.getElementById('kinyarwanda-cinema-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              appLanguage={appLanguage}
            />

            {/* 9. English & French Dubbed Cinema */}
            <MediaRow
              title="English & French Dubbed Cinema"
              subtitle="Studio-grade multi-language dubs and international selections"
              badge="VF & Dubbed"
              badgeColor="text-indigo-400 bg-indigo-500/10 border-indigo-500/30"
              items={[...englishItems, ...frenchItems]}
              subscription={subscription}
              onSelect={(item) => setSelectedDetailItem(item)}
              onPlay={(item) => handleRequestPlayMedia(item)}
              onQuickDownload={(item) => {
                if (item.type === 'movie') handleDownloadMovie(item);
                else setSelectedDetailItem(item);
              }}
              downloadedIds={downloadedIds}
              isWatchlisted={(id) => isWatchlisted(id)}
              onToggleWatchlist={handleToggleWatchlist}
              initialCardLimit={5}
            />

          </div>
        )}

        {/* ================= HIDDEN ADULT MOVIES SECTION (18+ UNCUT VAULT) ================= */}
        {parentalControls.hiddenAdultVaultUnlocked && !parentalControls.filterAdultContent && (
          <HiddenAdultSection
            items={ADULT_MOVIES_CATALOG}
            subscription={subscription}
            onSelect={(item) => setSelectedDetailItem(item)}
            onPlay={(item) => handleRequestPlayMedia(item)}
            onQuickDownload={(item) => {
              if (item.type === 'movie') handleDownloadMovie(item);
              else setSelectedDetailItem(item);
            }}
            downloadedIds={downloadedIds}
            isWatchlisted={(id) => isWatchlisted(id)}
            onToggleWatchlist={handleToggleWatchlist}
            onLockAndHideVault={() => {
              handleUpdateParentalControls({
                hiddenAdultVaultUnlocked: false,
                filterAdultContent: true
              });
              showToast('Hidden Adult Movies Vault locked and concealed.', 'info');
            }}
          />
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
      <footer className="mt-16 border-t border-neutral-800 bg-neutral-950 pt-10 pb-24 md:pb-12">
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
              <button onClick={handleTriggerAdultVault} className="hover:text-rose-400 transition-colors flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>18+ Vault (PIN)</span>
              </button>
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
          watchlistCount={watchlist.length}
          onOpenDownloads={() => setIsDownloadsModalOpen(true)}
          onOpenWatchlist={handleScrollToWatchlist}
          onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onOpenSearch={() => setIsSearchModalOpen(true)}
          onOpenUpload={() => setIsUploadPortalOpen(true)}
          onOpenRequests={() => {
            setMovieRequestSearchPrefill('');
            setIsMovieRequestModalOpen(true);
          }}
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
            watchlistCount={watchlist.length}
            onOpenWatchlist={handleScrollToWatchlist}
            isMobileDeviceMode={isMobileDeviceMode}
            onToggleDeviceMode={() => setIsMobileDeviceMode(!isMobileDeviceMode)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenSearchModal={() => setIsSearchModalOpen(true)}
            onOpenUploadPortal={() => setIsUploadPortalOpen(true)}
            onOpenMovieRequestModal={() => {
              setMovieRequestSearchPrefill('');
              setIsMovieRequestModalOpen(true);
            }}
            pendingUploadsCount={communityUploads.filter(u => u.status === 'pending').length}
            appLanguage={appLanguage}
          />

          {/* Main Layout - Optimized for phone and tablet */}
          <main className="flex-1 pb-20 md:pb-0">
            {mainContent}
          </main>
        </>
      )}

      {/* ================= MODALS ================= */}

      {/* Top 10 Most Searched & Live Discovery Modal */}
      <SearchTop10Modal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectMedia={(item) => setSelectedDetailItem(item)}
        onPlayMedia={(item) => handleRequestPlayMedia(item)}
        subscription={subscription}
        onOpenMovieRequestModal={(query) => {
          setMovieRequestSearchPrefill(query || '');
          setIsMovieRequestModalOpen(true);
        }}
        onOpenUploadPortal={() => setIsUploadPortalOpen(true)}
      />

      {/* Media Detail Modal */}
      {selectedDetailItem && (
        <MediaDetailModal
          item={selectedDetailItem}
          isOpen={!!selectedDetailItem}
          onClose={() => setSelectedDetailItem(null)}
          subscription={subscription}
          onPlay={(item, episode) => {
            handleRequestPlayMedia(item, episode);
          }}
          onDownloadEpisode={handleDownloadEpisode}
          onDownloadMovie={handleDownloadMovie}
          downloadedIds={downloadedIds}
          onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
          isItemWatchlisted={isWatchlisted}
          onToggleWatchlist={handleToggleWatchlist}
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
          initialTime={activePlayerItem.initialTime}
          onProgressUpdate={handleUpdateProgress}
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

      {/* Settings Modal (Theme, 3 Languages, Account, Single Device, Profile, Subscription & Parental Controls) */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        theme={theme}
        onToggleTheme={(newTheme) => setTheme(newTheme)}
        appLanguage={appLanguage}
        onSelectAppLanguage={(lang) => setAppLanguage(lang)}
        currentUser={currentUser}
        subscription={subscription}
        onOpenSubscriptionModal={() => {
          setIsSettingsModalOpen(false);
          setIsSubscriptionModalOpen(true);
        }}
        onOpenAuthModal={(mode = 'login') => {
          setAuthModalMode(mode);
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        onSimulateSecondDeviceLogin={handleSimulateSecondDeviceLogin}
        onUpdateProfile={handleUpdateProfile}
        parentalControls={parentalControls}
        onUpdateParentalControls={handleUpdateParentalControls}
        onJumpToAdultVault={() => {
          if (currentLanguage !== 'all' || selectedDjId || searchQuery.trim() || selectedGenre !== 'all') {
            setCurrentLanguage('all');
            setCurrentSubCategory('all');
            setSelectedDjId('');
            setSelectedGenre('all');
            setSearchQuery('');
          }
          setTimeout(() => {
            document.getElementById('hidden-adult-movies-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
      />

      {/* 4-Digit Parental Controls PIN Verification Modal */}
      <ParentalPinModal
        isOpen={pinModalState.isOpen}
        onClose={() => setPinModalState((prev) => ({ ...prev, isOpen: false }))}
        mode={pinModalState.mode}
        mediaItem={pinModalState.item}
        episode={pinModalState.episode}
        parentalControls={parentalControls}
        onUpdateParentalControls={handleUpdateParentalControls}
        onSuccessPlayback={(verifiedItem, verifiedEpisode) => {
          const targetTime = pinModalState.initialTime;
          setPinModalState((prev) => ({ ...prev, isOpen: false }));
          setActivePlayerItem({
            item: verifiedItem,
            episode: verifiedEpisode,
            initialTime: targetTime
          });
          showToast(
            `PIN verified. Playing "${verifiedEpisode ? verifiedEpisode.title : verifiedItem.title}".`,
            'success'
          );
        }}
        onSuccessUnlockVault={() => {
          setPinModalState((prev) => ({ ...prev, isOpen: false }));
          showToast('18+ Adult Movies Vault unlocked!', 'success');
          if (currentLanguage !== 'all' || selectedDjId || searchQuery.trim() || selectedGenre !== 'all') {
            setCurrentLanguage('all');
            setCurrentSubCategory('all');
            setSelectedDjId('');
            setSelectedGenre('all');
            setSearchQuery('');
          }
          setTimeout(() => {
            document.getElementById('hidden-adult-movies-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 120);
        }}
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

      {/* Community Upload Portal Modal (Pro Submissions & Admin Review Queue) */}
      <UploadPortalModal
        isOpen={isUploadPortalOpen}
        onClose={() => setIsUploadPortalOpen(false)}
        currentUser={currentUser}
        subscription={subscription}
        onOpenSubscriptionModal={() => {
          setIsUploadPortalOpen(false);
          setIsSubscriptionModalOpen(true);
        }}
        onOpenAuthModal={(mode = 'login') => {
          setAuthModalMode(mode);
          setIsAuthModalOpen(true);
        }}
        catalog={catalog}
        communityUploads={communityUploads}
        onUploadSubmit={handleUploadSubmit}
        onApproveUpload={handleApproveUpload}
        onRejectUpload={handleRejectUpload}
        onPlayMediaItem={(media) => handleRequestPlayMedia(media)}
        appLanguage={appLanguage}
      />

      {/* Community Movie Request Modal (Missing Titles & DJ Translations) */}
      <MovieRequestModal
        isOpen={isMovieRequestModalOpen}
        onClose={() => setIsMovieRequestModalOpen(false)}
        currentUser={currentUser}
        onOpenAuthModal={(mode = 'login') => {
          setAuthModalMode(mode);
          setIsAuthModalOpen(true);
        }}
        requests={movieRequests}
        onRequestSubmit={handleMovieRequestSubmit}
        onToggleUpvote={handleToggleUpvoteRequest}
        onPlayMedia={(media) => handleRequestPlayMedia(media)}
        catalog={catalog}
        initialSearchQuery={movieRequestSearchPrefill}
        appLanguage={appLanguage}
      />

    </div>
  );
}

