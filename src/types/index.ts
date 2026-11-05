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
}

export type AppTheme = 'dark' | 'light';

export type AppLanguage = 'en' | 'sw' | 'fr';

export interface UserAccount {
  email: string;
  name?: string;
  createdAt: string;
  sessionId: string;
  deviceId: string;
  deviceName: string;
  lastActive: string;
}

export interface DeviceSessionInfo {
  sessionId: string;
  userEmail: string;
  deviceName: string;
  location: string;
  loginTime: string;
}

