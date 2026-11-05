import React, { useState, useMemo } from 'react';
import { 
  X, HelpCircle, ThumbsUp, Film, Tv, Sparkles, CheckCircle2, 
  Clock, Search, PlusCircle, ArrowRight, MessageSquare, Play, User
} from 'lucide-react';
import { AppLanguage, MediaItem, MovieRequestItem, UserAccount } from '../types';
import { TRANSLATIONS } from '../utils/i18n';

interface MovieRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onOpenAuthModal: (mode?: 'login' | 'signup') => void;
  requests: MovieRequestItem[];
  onRequestSubmit: (newRequest: Omit<MovieRequestItem, 'id' | 'createdAt' | 'upvotesCount' | 'upvotedByEmails' | 'status'>) => void;
  onToggleUpvote: (requestId: string) => void;
  onPlayMedia?: (media: MediaItem) => void;
  catalog: MediaItem[];
  initialSearchQuery?: string;
  appLanguage: AppLanguage;
}

export const MovieRequestModal: React.FC<MovieRequestModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onOpenAuthModal,
  requests,
  onRequestSubmit,
  onToggleUpvote,
  onPlayMedia,
  catalog,
  initialSearchQuery = '',
  appLanguage
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[appLanguage];

  // Active view: 'browse' or 'submit'
  const [activeTab, setActiveTab] = useState<'browse' | 'submit'>(() => {
    return initialSearchQuery.trim() ? 'submit' : 'browse';
  });

  // Filter for request board: 'all' | 'requested' | 'sourcing' | 'added'
  const [statusFilter, setStatusFilter] = useState<'all' | 'requested' | 'sourcing' | 'added'>('all');
  const [boardSearchQuery, setBoardSearchQuery] = useState('');

  // Form states
  const [formTitle, setFormTitle] = useState(initialSearchQuery);
  const [formType, setFormType] = useState<'movie' | 'tv'>('movie');
  const [formLanguage, setFormLanguage] = useState<'kinyarwanda' | 'swahili' | 'french' | 'english' | 'any'>('kinyarwanda');
  const [formDjName, setFormDjName] = useState('Junior Giti');
  const [formYear, setFormYear] = useState<number | ''>('');
  const [formNotes, setFormNotes] = useState('');

  // Filtered requests list
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchesSearch = !boardSearchQuery.trim() || 
        r.title.toLowerCase().includes(boardSearchQuery.toLowerCase()) ||
        (r.preferredDj && r.preferredDj.toLowerCase().includes(boardSearchQuery.toLowerCase()));
      return matchesStatus && matchesSearch;
    }).sort((a, b) => b.upvotesCount - a.upvotesCount);
  }, [requests, statusFilter, boardSearchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (!currentUser) {
      onOpenAuthModal('login');
      return;
    }

    const dj = (formLanguage === 'swahili' || formLanguage === 'kinyarwanda') ? formDjName : undefined;

    onRequestSubmit({
      title: formTitle.trim(),
      type: formType,
      requestedByEmail: currentUser.email,
      requestedByName: currentUser.displayName || currentUser.name || currentUser.email.split('@')[0],
      requestedByUsername: currentUser.username || `@${currentUser.email.split('@')[0]}`,
      preferredLanguage: formLanguage,
      preferredDj: dj,
      releaseYear: formYear ? Number(formYear) : undefined,
      notes: formNotes.trim() || undefined
    });

    setFormTitle('');
    setFormNotes('');
    setActiveTab('browse');
  };

  const handleWatchAddedTitle = (addedMediaId?: string) => {
    if (!addedMediaId || !onPlayMedia) return;
    const media = catalog.find(m => m.id === addedMediaId);
    if (media) {
      onPlayMedia(media);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh] my-0 sm:my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator */}
        <div 
          onClick={onClose}
          className="sm:hidden w-12 h-1.5 bg-neutral-600 rounded-full mx-auto my-2.5 shrink-0 cursor-pointer" 
          title="Tap to close"
        />

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800/80 bg-neutral-950 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/30 shrink-0">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-lg text-white">
                Request a Movie or Series
              </h2>
              <p className="text-xs text-neutral-400">
                Searched and didn't find your favorite title or DJ voiceover? Request it from our community and translators!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 bg-neutral-950/80 border-b border-neutral-800/80 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'browse'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <span>Community Requests ({requests.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('submit')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'submit'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Submit New Request</span>
            </button>
          </div>

          {activeTab === 'browse' && (
            <div className="hidden sm:flex items-center gap-1">
              {(['all', 'requested', 'sourcing', 'added'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2 py-1 rounded-md text-[11px] capitalize transition-colors ${
                    statusFilter === st
                      ? 'bg-neutral-800 text-white font-bold'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {st === 'sourcing' ? 'In Translation' : st}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Body Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">

          {/* TAB 1: BROWSE COMMUNITY REQUEST BOARD */}
          {activeTab === 'browse' && (
            <div className="space-y-4">
              
              {/* Search Bar for requests */}
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search requested movies, series, or DJ translations..."
                  value={boardSearchQuery}
                  onChange={(e) => setBoardSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Request Items List */}
              <div className="space-y-3">
                {filteredRequests.map((item) => {
                  const hasUserUpvoted = currentUser ? item.upvotedByEmails.includes(currentUser.email) : false;

                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-all flex items-start justify-between gap-4"
                    >
                      {/* Left: Info */}
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-bold text-white truncate">
                            {item.title}
                          </h4>
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">
                            {item.type}
                          </span>
                          {item.releaseYear && (
                            <span className="text-[10px] text-neutral-400">
                              ({item.releaseYear})
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-neutral-300">
                          {item.preferredDj ? (
                            <span className="text-amber-400 font-semibold">{item.preferredDj} · </span>
                          ) : null}
                          <span className="capitalize">{item.preferredLanguage}</span>
                          {item.notes ? ` — "${item.notes}"` : ''}
                        </p>

                        <div className="flex items-center gap-2 text-[11px] text-neutral-500 pt-0.5">
                          <User className="w-3 h-3 text-neutral-600" />
                          <span>Requested by {item.requestedByUsername || item.requestedByName} · {item.createdAt}</span>
                        </div>

                        {/* Admin Response Update if Sourcing or Added */}
                        {item.adminResponse && (
                          <div className="mt-2 p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300 flex items-start gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                            <span><strong>Translator & Admin Update:</strong> {item.adminResponse}</span>
                          </div>
                        )}
                      </div>

                      {/* Right: Upvotes & Status */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        {/* Status Tag */}
                        {item.status === 'requested' && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-neutral-800 text-neutral-300 border border-neutral-700 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-neutral-400" />
                            <span>Requested</span>
                          </span>
                        )}
                        {item.status === 'sourcing' && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span>In Translation</span>
                          </span>
                        )}
                        {item.status === 'added' && (
                          <div className="flex flex-col items-end gap-1">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>Added to CinePulse</span>
                            </span>
                            {item.addedMediaId && onPlayMedia && (
                              <button
                                onClick={() => handleWatchAddedTitle(item.addedMediaId)}
                                className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                              >
                                <Play className="w-2.5 h-2.5 fill-current" /> Watch Now
                              </button>
                            )}
                          </div>
                        )}

                        {/* Upvote Button (+1) */}
                        <button
                          onClick={() => {
                            if (!currentUser) {
                              onOpenAuthModal('login');
                              return;
                            }
                            onToggleUpvote(item.id);
                          }}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            hasUserUpvoted
                              ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                              : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
                          }`}
                          title="Upvote this title to show high community interest"
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${hasUserUpvoted ? 'fill-current' : ''}`} />
                          <span className="tabular-nums font-bold">{item.upvotesCount}</span>
                          <span className="text-[10px]">{hasUserUpvoted ? 'Wanted' : '+1 Want'}</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 2: SUBMIT NEW REQUEST */}
          {activeTab === 'submit' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/30 flex items-start gap-2.5 text-xs text-blue-300">
                <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  Our partner translators (Junior Giti, Rocky Kimomo, DJ Afro, DJ Murphy) review weekly requests with high community upvotes and prioritize their studio releases!
                </span>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Movie or TV Series Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Extraction 2, Money Heist Korea, Ip Man 4..."
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Type */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormType('movie')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                    formType === 'movie'
                      ? 'bg-blue-600/20 border-blue-500 text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Film className="w-3.5 h-3.5 text-blue-400" />
                  <span>Movie</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormType('tv')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                    formType === 'tv'
                      ? 'bg-blue-600/20 border-blue-500 text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Tv className="w-3.5 h-3.5 text-blue-400" />
                  <span>TV Series</span>
                </button>
              </div>

              {/* Language & Preferred DJ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Preferred Translation / Dub
                  </label>
                  <select
                    value={formLanguage}
                    onChange={(e) => setFormLanguage(e.target.value as any)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="kinyarwanda">Kinyarwanda (Agasobanuye)</option>
                    <option value="swahili">Swahili (DJ Voiceover)</option>
                    <option value="french">French (VF)</option>
                    <option value="english">English (Dubbed)</option>
                    <option value="any">Any Available Language</option>
                  </select>
                </div>

                {(formLanguage === 'kinyarwanda' || formLanguage === 'swahili') && (
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Preferred DJ
                    </label>
                    <select
                      value={formDjName}
                      onChange={(e) => setFormDjName(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      {formLanguage === 'kinyarwanda' ? (
                        <>
                          <option value="Junior Giti">Junior Giti</option>
                          <option value="Rocky Kimomo">Rocky Kimomo</option>
                          <option value="Savimbi">Savimbi</option>
                          <option value="DJ Young">DJ Young</option>
                          <option value="Chris">Chris</option>
                          <option value="Sankara">Sankara</option>
                          <option value="Any Kinyarwanda DJ">Any Agasobanuye DJ</option>
                        </>
                      ) : (
                        <>
                          <option value="DJ Afro">DJ Afro Amigo</option>
                          <option value="DJ Murphy">DJ Murphy</option>
                          <option value="DJ Ally B">DJ Ally B</option>
                          <option value="DJ Black">DJ Black</option>
                          <option value="Any Swahili DJ">Any Swahili DJ</option>
                        </>
                      )}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Release Year (Optional)
                  </label>
                  <input
                    type="number"
                    min={1970}
                    max={2030}
                    placeholder="e.g. 2024"
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Specific Requests / Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. Please translate full season with uncut fight choreography, or episodes 5-10."
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('browse')}
                  className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!formTitle.trim()}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                    formTitle.trim()
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40'
                      : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Submit Community Request</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
