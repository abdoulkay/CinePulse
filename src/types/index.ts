export type Language = 'all' | 'english' | 'french' | 'swahili' | 'kinyarwanda';

export type SubCategory = 'all' | 'movie' | 'tv';

export type VideoQuality = '480p' | '720p' | '1080p' | '4k';

export type SubscriptionTier = 'free' | 'pro_usd' | 'pro_bif' | 'pro_tzs';
export type PaymentCurrency = 'USD' | 'BIF' | 'TZS';

export interface DJProfile {
  id: string;
  name: string;
  language: 'swahili' | 'kinyarwanda';
  avatarInitials: string;
  accentColor: string;
  tagline: string;
  signatureStyle: string;
  yearsActive: string;
  totalTitles: number;
  sampleQuote: string;
}

export interface Episode {
  id: string;
  episodeNumber: number;
  seasonNumber: number;
  title: string;
  duration: string;
  synopsis: string;
  thumbnailUrl: string;
  fileSizeMb: number;
  videoUrl: string;
}

export interface MediaItem {
  id: string;
  title: string;
  originalTitle?: string;
  type: 'movie' | 'tv';
  language: 'english' | 'french' | 'swahili' | 'kinyarwanda';
  subCategory: 'movie' | 'tv';
  djId?: string;
  djName?: string;
  year: number;
  rating: string;
  matchScore: number;
  duration: string;
  genres: string[];
  synopsis: string;
  translationNotes?: string;
  director?: string;
  cast?: string[];
  bannerColor: string;
  posterBg: string;
  videoUrl: string;
  episodes?: Episode[];
  featured?: boolean;
  trending?: boolean;
  audioTracks: {
    id: string;
    label: string;
    type: 'original' | 'dubbed' | 'dj_overlay';
    language: string;
  }[];
}

export interface DownloadedItem {
  id: string;
  mediaId: string;
  mediaTitle: string;
  episodeId?: string;
  episodeNumber?: number;
  seasonNumber?: number;
  itemType: 'movie' | 'episode';
  title: string;
  subTitle: string;
  language: Language;
  djName?: string;
  fileSizeMb: number;
  quality: VideoQuality;
  downloadedAt: string;
  progress: number; // 0 - 100
  isComplete: boolean;
  videoUrl: string;
  isProTierOnly?: boolean;
  accountEmail?: string;
}

export interface UserSubscription {
  tier: SubscriptionTier;
  planName: string;
  price: string;
  currency: PaymentCurrency;
  currencyLabel: string;
  resolutionLimit: VideoQuality;
  maxDownloadsPerSeries: number | 'unlimited';
  adSupported: boolean;
  devicesAllowed: number;
  billingCycle: 'monthly' | 'yearly';
  subscriptionExpiryDate?: string;
  daysRemaining?: number;
}

export type AppTheme = 'dark' | 'light';

export type AppLanguage = 'en' | 'sw' | 'fr';

export interface UserAccount {
  email: string;
  name?: string;
  username?: string;
  displayName?: string;
  avatarUrl?: string;
  createdAt: string;
  sessionId: string;
  deviceId: string;
  deviceName: string;
  lastActive: string;
  subscriptionExpiryDate?: string;
}

export interface DeviceSessionInfo {
  sessionId: string;
  userEmail: string;
  deviceName: string;
  location: string;
  loginTime: string;
}

export interface WatchlistItem {
  id: string; // bookmark ID, e.g. `wl-${mediaId}` or `wl-${mediaId}-ep-${episodeNumber}`
  mediaId: string;
  itemType: 'movie' | 'tv' | 'episode';
  title: string;
  subTitle?: string;
  mediaTitle?: string;
  episodeId?: string;
  episodeNumber?: number;
  seasonNumber?: number;
  language: 'english' | 'french' | 'swahili' | 'kinyarwanda';
  djName?: string;
  posterBg: string;
  bannerColor: string;
  matchScore: number;
  duration: string;
  year: number;
  rating: string;
  genres: string[];
  addedAt: string;
  videoUrl?: string;
}

export interface ContinueWatchingItem {
  id: string; // e.g. `${mediaId}` or `${mediaId}-ep-${episodeId}`
  mediaId: string;
  itemType: 'movie' | 'episode';
  title: string;
  subTitle?: string;
  mediaTitle?: string;
  episodeId?: string;
  episodeNumber?: number;
  seasonNumber?: number;
  language: 'english' | 'french' | 'swahili' | 'kinyarwanda';
  djName?: string;
  posterBg: string;
  bannerColor: string;
  currentTimeSeconds: number;
  durationSeconds: number;
  progressPercent: number; // 0 - 100
  lastWatchedAt: string;
  videoUrl: string;
}

export interface TopSearchItem {
  rank: number;
  id: string;
  mediaId?: string;
  title: string;
  category: 'movie' | 'series' | 'music' | 'comedy';
  categoryLabel: string;
  subtitle: string;
  searchesCount: string;
  posterBg: string;
  videoUrl?: string;
  djName?: string;
}

export type UploadReviewStatus = 'pending' | 'approved' | 'rejected';

export interface DuplicateDetectionResult {
  isPossibleDuplicate: boolean;
  matchedId?: string;
  matchedTitle?: string;
  similarityPercent: number;
  existingLanguage?: string;
}

export interface CommunityUploadItem {
  id: string;
  contributorEmail: string;
  contributorName: string;
  contributorUsername?: string;
  contributorAvatar?: string;
  title: string;
  originalTitle?: string;
  type: 'movie' | 'tv';
  episodeNumber?: number;
  seasonNumber?: number;
  showTitle?: string;
  language: 'english' | 'french' | 'swahili' | 'kinyarwanda';
  djName?: string;
  genres: string[];
  year: number;
  synopsis: string;
  coverImageUrl: string;
  videoFileName: string;
  videoFileSizeMb: number;
  videoResolution: VideoQuality;
  videoDuration: string;
  videoUrl: string;
  status: UploadReviewStatus;
  submittedAt: string;
  reviewedAt?: string;
  adminReviewer?: string;
  adminNotes?: string;
  duplicateCheck?: DuplicateDetectionResult;
  publishedMediaId?: string;
}

export type MovieRequestStatus = 'requested' | 'sourcing' | 'added';

export interface MovieRequestItem {
  id: string;
  title: string;
  type: 'movie' | 'tv';
  requestedByEmail: string;
  requestedByName: string;
  requestedByUsername?: string;
  preferredLanguage: 'english' | 'french' | 'swahili' | 'kinyarwanda' | 'any';
  preferredDj?: string;
  releaseYear?: number;
  notes?: string;
  upvotesCount: number;
  upvotedByEmails: string[];
  status: MovieRequestStatus;
  createdAt: string;
  adminResponse?: string;
  addedMediaId?: string;
}



