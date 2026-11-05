import React, { useState, useMemo } from 'react';
import { 
  X, UploadCloud, Film, Tv, ShieldCheck, AlertTriangle, CheckCircle2, 
  Sparkles, Play, Clock, HardDrive, Check, Eye, Trash2, MessageSquare, 
  Search, ShieldAlert, ArrowRight, User, RefreshCw, FileVideo, Image as ImageIcon
} from 'lucide-react';
import { 
  AppLanguage, CommunityUploadItem, MediaItem, SubscriptionTier, 
  UserAccount, UserSubscription, VideoQuality 
} from '../types';
import { TRANSLATIONS } from '../utils/i18n';
import { checkCatalogDuplicate } from '../data/mockData';

interface UploadPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  subscription: UserSubscription;
  onOpenSubscriptionModal: () => void;
  onOpenAuthModal: (mode?: 'login' | 'signup') => void;
  catalog: MediaItem[];
  communityUploads: CommunityUploadItem[];
  onUploadSubmit: (upload: Omit<CommunityUploadItem, 'id' | 'submittedAt' | 'status'>) => void;
  onApproveUpload: (uploadId: string, adminNotes: string) => void;
  onRejectUpload: (uploadId: string, adminNotes: string) => void;
  onPlayMediaItem?: (media: MediaItem) => void;
  appLanguage: AppLanguage;
}

export const UploadPortalModal: React.FC<UploadPortalModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  subscription,
  onOpenSubscriptionModal,
  onOpenAuthModal,
  catalog,
  communityUploads,
  onUploadSubmit,
  onApproveUpload,
  onRejectUpload,
  onPlayMediaItem,
  appLanguage
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[appLanguage];
  const isPro = subscription.tier !== 'free';

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'upload' | 'admin_queue' | 'my_uploads'>(() => {
    // If user has pending admin queue items, they might want to inspect
    return 'upload';
  });

  // Admin Mode simulation toggle (allows creator/owner to test both contributor & admin review)
  const [isAdminMode, setIsAdminMode] = useState<boolean>(true);

  // Form states for new upload
  const [formType, setFormType] = useState<'movie' | 'tv'>('movie');
  const [formTitle, setFormTitle] = useState('');
  const [formOriginalTitle, setFormOriginalTitle] = useState('');
  const [formShowTitle, setFormShowTitle] = useState('');
  const [formSeasonNumber, setFormSeasonNumber] = useState(1);
  const [formEpisodeNumber, setFormEpisodeNumber] = useState(1);
  const [formLanguage, setFormLanguage] = useState<'english' | 'french' | 'swahili' | 'kinyarwanda'>('kinyarwanda');
  const [formDjName, setFormDjName] = useState('Junior Giti');
  const [formCustomDj, setFormCustomDj] = useState('');
  const [formYear, setFormYear] = useState(new Date().getFullYear());
  const [formGenres, setFormGenres] = useState<string[]>(['Action', 'Thriller']);
  const [formSynopsis, setFormSynopsis] = useState('');
  const [formCoverUrl, setFormCoverUrl] = useState('');
  const [formVideoFileName, setFormVideoFileName] = useState('');
  const [formResolution, setFormResolution] = useState<VideoQuality>('1080p');
  const [formDuration, setFormDuration] = useState('1h 45m');
  const [formFileSizeMb, setFormFileSizeMb] = useState(1250);
  const [formVideoUrl, setFormVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4');

  // Selected sample presets for cover
  const COVER_PRESETS = [
    { label: 'Tactical Action', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80' },
    { label: 'Cyber Sci-Fi', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80' },
    { label: 'Crime Thriller', url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&auto=format&fit=crop&q=80' },
    { label: 'Martial Arts', url: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=600&auto=format&fit=crop&q=80' },
    { label: 'Drama & Mystery', url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&auto=format&fit=crop&q=80' }
  ];

  // Admin review form states
  const [selectedUploadForReview, setSelectedUploadForReview] = useState<CommunityUploadItem | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);

  // Real-time duplicate check as user types title
  const liveDuplicateCheck = useMemo(() => {
    return checkCatalogDuplicate(formTitle, catalog);
  }, [formTitle, catalog]);

  // Count pending uploads for admin badge
  const pendingCount = useMemo(() => {
    return communityUploads.filter(u => u.status === 'pending').length;
  }, [communityUploads]);

  // User's own uploads
  const myUploads = useMemo(() => {
    if (!currentUser) return [];
    return communityUploads.filter(u => u.contributorEmail.toLowerCase() === currentUser.email.toLowerCase());
  }, [communityUploads, currentUser]);

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (!currentUser) {
      onOpenAuthModal('login');
      return;
    }

    if (!isPro) {
      onOpenSubscriptionModal();
      return;
    }

    const effectiveDj = (formLanguage === 'swahili' || formLanguage === 'kinyarwanda')
      ? (formCustomDj.trim() || formDjName)
      : undefined;

    const cover = formCoverUrl.trim() || COVER_PRESETS[0].url;
    const fileName = formVideoFileName.trim() || `${formTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${formResolution}.mp4`;

    onUploadSubmit({
      contributorEmail: currentUser.email,
      contributorName: currentUser.displayName || currentUser.name || currentUser.email.split('@')[0],
      contributorUsername: currentUser.username || `@${currentUser.email.split('@')[0]}`,
      contributorAvatar: currentUser.avatarUrl,
      title: formTitle.trim(),
      originalTitle: formOriginalTitle.trim() || undefined,
      type: formType,
      episodeNumber: formType === 'tv' ? Number(formEpisodeNumber) : undefined,
      seasonNumber: formType === 'tv' ? Number(formSeasonNumber) : undefined,
      showTitle: formType === 'tv' ? formShowTitle.trim() || formTitle.trim() : undefined,
      language: formLanguage,
      djName: effectiveDj,
      genres: formGenres.length ? formGenres : ['Action'],
      year: Number(formYear) || new Date().getFullYear(),
      synopsis: formSynopsis.trim() || 'Uploaded by CinePulse community pro member. Reviewed and authenticated for streaming.',
      coverImageUrl: cover,
      videoFileName: fileName,
      videoFileSizeMb: Number(formFileSizeMb) || 1200,
      videoResolution: formResolution,
      videoDuration: formDuration.trim() || '1h 45m',
      videoUrl: formVideoUrl,
      duplicateCheck: liveDuplicateCheck
    });

    // Reset form
    setFormTitle('');
    setFormOriginalTitle('');
    setFormShowTitle('');
    setFormSynopsis('');
    setFormVideoFileName('');
    setActiveTab('my_uploads');
  };

  const handleSimulateFileSelect = () => {
    const randomSample = `Agasobanuye_${formTitle.replace(/\s+/g, '_') || 'Cinema'}_Master_1080p.mp4`;
    setFormVideoFileName(randomSample);
    setFormFileSizeMb(1420);
    setFormDuration('1h 52m');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800/80 bg-neutral-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-900/30 shrink-0">
              <UploadCloud className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-lg text-white">
                  Community Upload Portal
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-amber-300 border border-amber-500/30">
                  Pro Feature
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Help build CinePulse! Upload missing movies & episodes for admin quality inspection and duplicate checking.
              </p>
            </div>
          </div>

          {/* Right Header Controls: Admin toggle & Close */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            {/* Admin Switcher */}
            <button
              onClick={() => setIsAdminMode(!isAdminMode)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                isAdminMode 
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/40 hover:bg-amber-500/20' 
                  : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-white'
              }`}
              title="Toggle between Contributor & Admin View"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Console</span>
              {pendingCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-600 text-[10px] text-white flex items-center justify-center font-bold">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              aria-label="Close portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-4 sm:px-6 py-2.5 bg-neutral-950/80 border-b border-neutral-800/80 overflow-x-auto scrollbar-none text-xs">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'upload'
                ? 'bg-rose-600 text-white font-semibold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload Title / Episode</span>
          </button>

          <button
            onClick={() => setActiveTab('my_uploads')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'my_uploads'
                ? 'bg-rose-600 text-white font-semibold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>My Submissions ({myUploads.length})</span>
          </button>

          {isAdminMode && (
            <button
              onClick={() => setActiveTab('admin_queue')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'admin_queue'
                  ? 'bg-amber-600 text-white font-semibold'
                  : 'text-amber-400 hover:text-amber-300 hover:bg-neutral-800'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin Review & Quality Queue</span>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white font-bold text-[10px]">
                  {pendingCount} Pending
                </span>
              )}
            </button>
          )}
        </div>

        {/* Body Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* ============================================================== */}
          {/* TAB 1: UPLOAD MOVIE OR EPISODE                                 */}
          {/* ============================================================== */}
          {activeTab === 'upload' && (
            <div className="space-y-6">

              {/* Free Tier Lock Warning Banner */}
              {!isPro && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-rose-950/40 to-neutral-900 border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Pro Subscriber Exclusive Feature
                      </h4>
                      <p className="text-xs text-neutral-300 mt-0.5 leading-relaxed">
                        To protect the platform from unauthorized spam, copyrighted re-uploads, and low-res copies, community uploads require an active Pro Membership ($3 / 6,000 BIF / 3,000 Tsh).
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onOpenSubscriptionModal}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white text-xs font-bold shrink-0 shadow-lg shadow-rose-900/40 transition-transform active:scale-95"
                  >
                    Upgrade to Pro ($3)
                  </button>
                </div>
              )}

              {/* Form Intro & Workflow Details */}
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3 text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Uploads undergo <strong>automated duplicate checking</strong> and <strong>admin quality review</strong> before going live to all subscribers.
                  </span>
                </div>
                <span className="hidden sm:inline font-mono text-[10px] text-neutral-500">
                  Standards: 1080p+ / AAC Audio
                </span>
              </div>

              {/* Upload Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Row 1: Type Selection (Movie vs TV Episode) */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-2">
                    Submission Format
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-w-md">
                    <button
                      type="button"
                      onClick={() => setFormType('movie')}
                      className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                        formType === 'movie'
                          ? 'bg-rose-600/20 border-rose-500 text-white'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Film className="w-4 h-4 text-rose-500" />
                      <span>Single Movie / Feature Film</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormType('tv')}
                      className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                        formType === 'tv'
                          ? 'bg-rose-600/20 border-rose-500 text-white'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Tv className="w-4 h-4 text-rose-500" />
                      <span>Series / TV Episode</span>
                    </button>
                  </div>
                </div>

                {/* If TV Series: Series Name + Season & Episode */}
                {formType === 'tv' && (
                  <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1">
                      <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                        Series Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formShowTitle}
                        onChange={(e) => setFormShowTitle(e.target.value)}
                        placeholder="e.g. Ubwami bw'Abacuruzi (The Syndicate)"
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                        Season Number
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={formSeasonNumber}
                        onChange={(e) => setFormSeasonNumber(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                        Episode Number *
                      </label>
                      <input
                        type="number"
                        min={1}
                        required
                        value={formEpisodeNumber}
                        onChange={(e) => setFormEpisodeNumber(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>
                )}

                {/* Title & Live Duplicate Radar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-neutral-300">
                      {formType === 'movie' ? 'Movie Title / Agasobanuye Name *' : 'Episode Title *'}
                    </label>
                    {formTitle.trim() && (
                      <span className={`text-[11px] font-medium flex items-center gap-1 ${
                        liveDuplicateCheck.isPossibleDuplicate ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {liveDuplicateCheck.isPossibleDuplicate ? (
                          <>
                            <AlertTriangle className="w-3 h-3" />
                            <span>{liveDuplicateCheck.similarityPercent}% match with catalog</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Unique title · No duplicates detected</span>
                          </>
                        )}
                      </span>
                    )}
                  </div>

                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder={formType === 'movie' ? 'e.g. Kigali Blackout: Midnight Fugitive' : 'e.g. Episode 7: The Double Agent'}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
                  />

                  {/* DUPLICATE WARNING BOX IF MATCH DETECTED */}
                  {liveDuplicateCheck.isPossibleDuplicate && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-300">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                      <div>
                        <strong>Possible Duplicate Warning:</strong> CinePulse already has a title named{' '}
                        <strong className="text-white underline">"{liveDuplicateCheck.matchedTitle}"</strong>{' '}
                        ({liveDuplicateCheck.existingLanguage || 'Catalog'}).
                        <p className="text-[11px] text-amber-200/80 mt-0.5">
                          If your upload is a distinct DJ translation (e.g. Junior Giti instead of English), specify the DJ clearly so admins approve it as an alternative audio version!
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Language & DJ Translation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Audio / Translation Language *
                    </label>
                    <select
                      value={formLanguage}
                      onChange={(e) => setFormLanguage(e.target.value as any)}
                      className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                    >
                      <option value="kinyarwanda">Kinyarwanda (Agasobanuye DJ)</option>
                      <option value="swahili">Swahili (East Africa DJ Translation)</option>
                      <option value="french">French (Version Française / VF)</option>
                      <option value="english">English (Dubbed / Original)</option>
                    </select>
                  </div>

                  {/* DJ Selection if Swahili or Kinyarwanda */}
                  {(formLanguage === 'kinyarwanda' || formLanguage === 'swahili') && (
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        Voiceover DJ / Translator
                      </label>
                      <select
                        value={formDjName}
                        onChange={(e) => setFormDjName(e.target.value)}
                        className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                      >
                        {formLanguage === 'kinyarwanda' ? (
                          <>
                            <option value="Junior Giti">Junior Giti (Giti Productions)</option>
                            <option value="Rocky Kimomo">Rocky Kimomo (Rock Entertainment)</option>
                            <option value="Savimbi">Savimbi</option>
                            <option value="DJ Young">DJ Young</option>
                            <option value="Chris">Chris</option>
                            <option value="Sankara">Sankara</option>
                            <option value="custom">Other / Custom DJ...</option>
                          </>
                        ) : (
                          <>
                            <option value="DJ Afro">DJ Afro Amigo</option>
                            <option value="DJ Murphy">DJ Murphy</option>
                            <option value="DJ Ally B">DJ Ally B</option>
                            <option value="DJ Black">DJ Black</option>
                            <option value="custom">Other / Custom DJ...</option>
                          </>
                        )}
                      </select>
                      {formDjName === 'custom' && (
                        <input
                          type="text"
                          placeholder="Type DJ Name (e.g. DJ Junior Kigali)"
                          value={formCustomDj}
                          onChange={(e) => setFormCustomDj(e.target.value)}
                          className="mt-2 w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white focus:outline-none focus:border-rose-500"
                        />
                      )}
                    </div>
                  )}

                  {/* Year & Genres */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Release Year
                    </label>
                    <input
                      type="number"
                      min={1970}
                      max={2030}
                      value={formYear}
                      onChange={(e) => setFormYear(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Target Resolution & Quality
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['720p', '1080p', '4k'] as VideoQuality[]).map((res) => (
                        <button
                          key={res}
                          type="button"
                          onClick={() => setFormResolution(res)}
                          className={`py-2 px-1 text-center rounded-lg border text-xs font-bold transition-all ${
                            formResolution === res
                              ? 'bg-rose-600 border-rose-500 text-white shadow-sm'
                              : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {res.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Synopsis / Description */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Plot Synopsis / Translation Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formSynopsis}
                    onChange={(e) => setFormSynopsis(e.target.value)}
                    placeholder="Describe the storyline, pivotal plot twists, and why this translation is legendary..."
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500 resize-none"
                  />
                </div>

                {/* Cover Picture / Artwork Selection */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-neutral-300">
                      Cover Picture / Poster Artwork
                    </label>
                    <span className="text-[11px] text-neutral-400">Click a preset or paste URL</span>
                  </div>
                  
                  {/* Preset Posters */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {COVER_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setFormCoverUrl(preset.url)}
                        className={`group relative shrink-0 w-24 h-16 rounded-lg overflow-hidden border transition-all ${
                          formCoverUrl === preset.url
                            ? 'border-rose-500 ring-2 ring-rose-500/40'
                            : 'border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <span className="absolute inset-0 bg-black/50 text-[10px] text-white flex items-end p-1 font-medium truncate">
                          {preset.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  <input
                    type="url"
                    value={formCoverUrl}
                    onChange={(e) => setFormCoverUrl(e.target.value)}
                    placeholder="Or paste custom poster image URL (https://...)"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
                  />
                </div>

                {/* Video File Upload Simulator / Inspector */}
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileVideo className="w-4 h-4 text-rose-500" />
                      <span className="text-xs font-semibold text-white">Movie / Episode Video File</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 font-mono">MP4, MKV, WebM (Max 4.0 GB)</span>
                  </div>

                  <div 
                    onClick={handleSimulateFileSelect}
                    className="border-2 border-dashed border-neutral-800 hover:border-rose-500/60 rounded-xl p-5 text-center cursor-pointer transition-colors bg-neutral-900/40 hover:bg-neutral-900/80"
                  >
                    <UploadCloud className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
                    <p className="text-xs font-medium text-neutral-200">
                      {formVideoFileName ? formVideoFileName : 'Click to select movie video file from device'}
                    </p>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      {formVideoFileName 
                        ? `${formFileSizeMb} MB · ${formResolution.toUpperCase()} · ${formDuration}`
                        : 'Simulates automatic video stream verification and audio sync analysis'}
                    </p>
                  </div>

                  {formVideoFileName && (
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1 border-t border-neutral-800/80">
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> File ready for stream transcoding
                      </span>
                      <button
                        type="button"
                        onClick={() => setPreviewVideoUrl(formVideoUrl)}
                        className="text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1"
                      >
                        <Play className="w-3 h-3 fill-current" /> Preview Stream Sample
                      </button>
                    </div>
                  )}
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <p className="text-[11px] text-neutral-400">
                    By submitting, you certify this translation file contains clear audio and follows community guidelines.
                  </p>
                  <button
                    type="submit"
                    disabled={!formTitle.trim()}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg ${
                      formTitle.trim()
                        ? 'bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:opacity-95 text-white shadow-rose-900/40'
                        : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                    }`}
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Submit for Admin Review</span>
                  </button>
                </div>

              </form>

            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: MY SUBMISSIONS (User's personal uploads tracking)        */}
          {/* ============================================================== */}
          {activeTab === 'my_uploads' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <div>
                  <h3 className="text-sm font-bold text-white">Your Submitted Titles</h3>
                  <p className="text-xs text-neutral-400">
                    Track review status, admin feedback, and live publication on CinePulse.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('upload')}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-white font-medium flex items-center gap-1.5 transition-colors"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-rose-500" />
                  <span>New Upload</span>
                </button>
              </div>

              {myUploads.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <Film className="w-12 h-12 text-neutral-600 mx-auto" />
                  <p className="text-sm font-bold text-neutral-300">No submissions yet</p>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    Have a movie or Agasobanuye translation in your library that isn't on CinePulse yet? Upload it and help expand our multilingual catalog!
                  </p>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="mt-2 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-500 transition-colors"
                  >
                    Upload Your First Title
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myUploads.map((item) => (
                    <div 
                      key={item.id}
                      className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={item.coverImageUrl} 
                          alt={item.title} 
                          className="w-14 h-20 rounded-lg object-cover shrink-0 border border-neutral-800"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
                            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">
                              {item.type}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-400 mt-0.5">
                            {item.djName ? `${item.djName} · ` : ''}{item.language.toUpperCase()} · {item.videoResolution.toUpperCase()} · {item.videoDuration}
                          </p>
                          <p className="text-[11px] text-neutral-500 mt-1">
                            Submitted: {item.submittedAt}
                          </p>

                          {item.adminNotes && (
                            <div className="mt-2 p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300 flex items-start gap-1.5">
                              <MessageSquare className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                              <span><strong>Admin Feedback:</strong> {item.adminNotes}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="shrink-0 self-end sm:self-center">
                        {item.status === 'pending' && (
                          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            <span>Under Admin Review</span>
                          </span>
                        )}
                        {item.status === 'approved' && (
                          <div className="flex flex-col items-end gap-1">
                            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Approved & Live</span>
                            </span>
                            <span className="text-[10px] text-neutral-400">Available to all subscribers</span>
                          </div>
                        )}
                        {item.status === 'rejected' && (
                          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                            <span>Declined</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: ADMIN REVIEW & DUPLICATE INSPECTION QUEUE               */}
          {/* ============================================================== */}
          {activeTab === 'admin_queue' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/30 via-neutral-900 to-neutral-950 border border-amber-500/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Admin Review & Duplicate Prevention Console
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Verify stream quality, test audio sync, run catalog duplicate comparison, and approve/disapprove titles.
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-neutral-800 text-amber-300 border border-neutral-700">
                  {communityUploads.length} Total Submissions
                </span>
              </div>

              {/* Uploads List */}
              <div className="space-y-4">
                {communityUploads.map((upload) => (
                  <div
                    key={upload.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                      upload.status === 'pending'
                        ? 'bg-neutral-950 border-neutral-700 shadow-lg'
                        : upload.status === 'approved'
                        ? 'bg-neutral-950/70 border-emerald-900/40 opacity-90'
                        : 'bg-neutral-950/70 border-rose-900/40 opacity-80'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      
                      {/* Left: Poster Artwork & Details */}
                      <div className="flex items-start gap-4 min-w-0">
                        <div className="relative group shrink-0">
                          <img
                            src={upload.coverImageUrl}
                            alt={upload.title}
                            className="w-20 h-28 sm:w-24 sm:h-32 rounded-xl object-cover border border-neutral-800 shadow-md"
                          />
                          <button
                            onClick={() => setPreviewVideoUrl(upload.videoUrl)}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl"
                            title="Inspect video playback"
                          >
                            <Play className="w-6 h-6 text-white fill-current" />
                          </button>
                        </div>

                        <div className="space-y-1.5 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-base font-extrabold text-white">
                              {upload.title}
                            </h4>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-600/30 text-rose-300 border border-rose-500/40">
                              {upload.type === 'tv' ? `TV S${upload.seasonNumber}:E${upload.episodeNumber}` : 'Movie'}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-800 text-neutral-300">
                              {upload.year}
                            </span>
                          </div>

                          <p className="text-xs text-neutral-300">
                            {upload.djName ? (
                              <span className="text-amber-400 font-semibold">{upload.djName}</span>
                            ) : null}
                            {upload.djName ? ' · ' : ''}
                            <span className="capitalize">{upload.language}</span> · {upload.genres.join(', ')}
                          </p>

                          <p className="text-xs text-neutral-400 line-clamp-2 max-w-xl">
                            {upload.synopsis}
                          </p>

                          {/* Technical Video Specs */}
                          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-neutral-400 font-mono">
                            <span className="flex items-center gap-1 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                              <HardDrive className="w-3 h-3 text-neutral-400" />
                              {upload.videoFileSizeMb} MB
                            </span>
                            <span className="flex items-center gap-1 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800 text-cyan-400 font-bold">
                              {upload.videoResolution.toUpperCase()}
                            </span>
                            <span className="flex items-center gap-1 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                              <Clock className="w-3 h-3 text-neutral-400" />
                              {upload.videoDuration}
                            </span>
                            <span className="text-neutral-500 truncate max-w-[150px]">
                              {upload.videoFileName}
                            </span>
                          </div>

                          {/* Contributor Tag */}
                          <div className="flex items-center gap-2 pt-1 text-xs text-neutral-400">
                            {upload.contributorAvatar ? (
                              <img src={upload.contributorAvatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                            ) : (
                              <User className="w-3.5 h-3.5 text-neutral-500" />
                            )}
                            <span>Uploaded by <strong className="text-white">{upload.contributorUsername || upload.contributorName}</strong> ({upload.contributorEmail}) · {upload.submittedAt}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Duplicate Status & Admin Actions */}
                      <div className="lg:w-72 shrink-0 flex flex-col gap-3 justify-between">
                        
                        {/* Duplicate Detection Radar Box */}
                        <div className={`p-3 rounded-xl border text-xs ${
                          upload.duplicateCheck?.isPossibleDuplicate
                            ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        }`}>
                          <div className="flex items-center gap-1.5 font-bold mb-1">
                            {upload.duplicateCheck?.isPossibleDuplicate ? (
                              <>
                                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                                <span>Duplicate Alert ({upload.duplicateCheck.similarityPercent}% match)</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>Duplicate Scan: Clean</span>
                              </>
                            )}
                          </div>
                          {upload.duplicateCheck?.isPossibleDuplicate ? (
                            <p className="text-[11px] leading-tight text-amber-200/90">
                              Matches existing title: <strong>"{upload.duplicateCheck.matchedTitle}"</strong> ({upload.duplicateCheck.existingLanguage}).
                            </p>
                          ) : (
                            <p className="text-[11px] leading-tight text-emerald-200/90">
                              No identical titles in CinePulse catalog. Safe to approve if video quality passes inspection.
                            </p>
                          )}
                        </div>

                        {/* Stream Inspector Button */}
                        <button
                          onClick={() => setPreviewVideoUrl(upload.videoUrl)}
                          className="w-full py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Play className="w-3.5 h-3.5 text-rose-500 fill-current" />
                          <span>Inspect Stream Quality & Audio</span>
                        </button>

                        {/* Approval Status & Buttons */}
                        {upload.status === 'pending' ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => {
                                  setSelectedUploadForReview(upload);
                                  setAdminNoteInput('Approved: Video quality tested 1080p, audio synched, authentic translation voiceover.');
                                }}
                                className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1 transition-colors shadow-sm"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedUploadForReview(upload);
                                  setAdminNoteInput(
                                    upload.duplicateCheck?.isPossibleDuplicate
                                      ? `Declined: Title already exists on CinePulse as "${upload.duplicateCheck.matchedTitle}".`
                                      : 'Declined: Video quality or audio does not meet 1080p standards.'
                                  );
                                }}
                                className="py-2 px-3 rounded-xl bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Decline</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-neutral-400 text-[11px]">Decision:</span>
                              <span className={`font-bold uppercase text-[10px] ${
                                upload.status === 'approved' ? 'text-emerald-400' : 'text-rose-400'
                              }`}>
                                {upload.status}
                              </span>
                            </div>
                            {upload.adminNotes && (
                              <p className="text-[11px] text-neutral-300 italic">
                                "{upload.adminNotes}"
                              </p>
                            )}
                          </div>
                        )}

                      </div>

                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

        {/* Modal: Admin Decision Confirmation Note */}
        {selectedUploadForReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-neutral-900 border border-neutral-700 rounded-2xl p-5 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">
                  Confirm Admin Decision for "{selectedUploadForReview.title}"
                </h4>
                <button 
                  onClick={() => setSelectedUploadForReview(null)}
                  className="text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Admin Feedback Note for Contributor ({selectedUploadForReview.contributorUsername || selectedUploadForReview.contributorEmail})
                </label>
                <textarea
                  rows={3}
                  value={adminNoteInput}
                  onChange={(e) => setAdminNoteInput(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => setSelectedUploadForReview(null)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onRejectUpload(selectedUploadForReview.id, adminNoteInput);
                    setSelectedUploadForReview(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40 text-xs font-bold"
                >
                  Confirm Decline
                </button>
                <button
                  onClick={() => {
                    onApproveUpload(selectedUploadForReview.id, adminNoteInput);
                    setSelectedUploadForReview(null);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                >
                  Confirm & Publish Live
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Video Stream Quality Inspection Player */}
        {previewVideoUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-3 bg-neutral-950 flex items-center justify-between border-b border-neutral-800">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 text-rose-500 fill-current" />
                  Stream Quality & Audio Sync Inspection
                </span>
                <button
                  onClick={() => setPreviewVideoUrl(null)}
                  className="text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="aspect-video bg-black flex items-center justify-center">
                <video
                  src={previewVideoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-3 bg-neutral-950 flex items-center justify-between text-xs text-neutral-400">
                <span>Direct inspection link: 1080p full stream</span>
                <button
                  onClick={() => setPreviewVideoUrl(null)}
                  className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-xs"
                >
                  Done Inspecting
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
