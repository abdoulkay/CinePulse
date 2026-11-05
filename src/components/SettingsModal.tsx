import React, { useState } from 'react';
import { 
  X, Moon, Sun, Globe, User, LogIn, LogOut, ShieldCheck, 
  Smartphone, AlertTriangle, Monitor, Check, ExternalLink,
  Camera, Lock, Key, Clock, Sparkles, Mail, AtSign, CheckCircle2,
  RefreshCw, ShieldAlert, Award, Edit3, ChevronDown, ChevronUp
} from 'lucide-react';
import { AppLanguage, AppTheme, UserAccount, UserSubscription } from '../types';
import { TRANSLATIONS } from '../utils/i18n';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: AppTheme;
  onToggleTheme: (newTheme: AppTheme) => void;
  appLanguage: AppLanguage;
  onSelectAppLanguage: (lang: AppLanguage) => void;
  currentUser: UserAccount | null;
  subscription: UserSubscription;
  onOpenSubscriptionModal: () => void;
  onOpenAuthModal: (mode?: 'login' | 'signup') => void;
  onLogout: () => void;
  onSimulateSecondDeviceLogin: () => void;
  onUpdateProfile?: (updatedUser: Partial<UserAccount>, newPassword?: string) => void;
}

const AVATAR_PRESETS = [
  { id: 'hero', label: 'Action Hero', icon: '🕶️', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { id: 'dj', label: 'DJ Master', icon: '🎙️', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { id: 'star', label: 'Cinema Star', icon: '⭐', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
  { id: 'director', label: 'Film Director', icon: '🎬', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  { id: 'royalty', label: 'African Royalty', icon: '👑', url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80' },
  { id: 'cyber', label: 'Cyber Geek', icon: '⚡', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80' }
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onToggleTheme,
  appLanguage,
  onSelectAppLanguage,
  currentUser,
  subscription,
  onOpenSubscriptionModal,
  onOpenAuthModal,
  onLogout,
  onSimulateSecondDeviceLogin,
  onUpdateProfile
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[appLanguage];
  const isPro = subscription.tier !== 'free';
  const daysRemaining = subscription.daysRemaining ?? (isPro ? 27 : 0);
  const expiryFormatted = subscription.subscriptionExpiryDate 
    ? new Date(subscription.subscriptionExpiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Dec 5, 2026';

  // Profile Form States (Minimised by default)
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>(
    currentUser?.displayName || currentUser?.name || 'Abdoul Kay'
  );
  const [username, setUsername] = useState<string>(
    currentUser?.username || (currentUser?.email ? currentUser.email.split('@')[0] : 'abdoulkay')
  );
  const [email, setEmail] = useState<string>(currentUser?.email || '');
  const [avatarUrl, setAvatarUrl] = useState<string>(
    currentUser?.avatarUrl || AVATAR_PRESETS[0].url
  );
  const [showAvatarPicker, setShowAvatarPicker] = useState<boolean>(false);
  const [customAvatarInput, setCustomAvatarInput] = useState<string>('');

  // Password Change States (Minimised by default)
  const [showPasswordChange, setShowPasswordChange] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  
  // Status message
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    // Validation
    if (!email.trim() || !email.includes('@')) {
      setStatusMessage({ text: 'Please provide a valid email address.', isError: true });
      return;
    }

    if (showPasswordChange) {
      if (!newPassword || newPassword.length < 6) {
        setStatusMessage({ text: 'New password must be at least 6 characters.', isError: true });
        return;
      }
      if (newPassword !== confirmPassword) {
        setStatusMessage({ text: 'New password and confirmation do not match.', isError: true });
        return;
      }
    }

    if (onUpdateProfile) {
      onUpdateProfile(
        {
          displayName: displayName.trim(),
          name: displayName.trim(),
          username: username.trim().replace(/^@/, ''),
          email: email.trim(),
          avatarUrl: avatarUrl
        },
        showPasswordChange ? newPassword.trim() : undefined
      );

      setStatusMessage({ text: 'Profile updated successfully!', isError: false });
      setIsEditingProfile(false);
      setShowPasswordChange(false);
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden my-0 sm:my-8 max-h-[92vh] sm:max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator */}
        <div 
          onClick={onClose}
          className="sm:hidden w-12 h-1.5 bg-neutral-600 rounded-full mx-auto my-2.5 shrink-0 cursor-pointer" 
          title="Tap to close"
        />

        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-500 font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {t.settings}
              </h2>
              <p className="text-xs text-neutral-400">
                Manage appearance, profile credentials & subscription protection
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-5 sm:p-8 space-y-7 max-h-[75vh] overflow-y-auto">

          {/* ================= SECTION 1: SUBSCRIPTION DAYS REMAINING & PROTECTION ================= */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Subscription & Days Remaining
                </h3>
              </div>
              <span className="text-[11px] text-neutral-400 font-mono">
                {isPro ? 'Pro Active' : 'Free Tier'}
              </span>
            </div>

            {isPro ? (
              /* PRO MEMBER DAYS REMAINING CARD */
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-emerald-950/40 border border-emerald-500/40 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                        Active Membership
                      </span>
                      <span className="text-xs font-bold text-white">{subscription.planName} ({subscription.price})</span>
                    </div>
                    
                    {/* Big Bold Days Remaining Metric */}
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-extrabold font-display text-emerald-400 tabular-nums">
                        {daysRemaining} Days Left
                      </span>
                      <span className="text-xs text-neutral-400">until next cycle</span>
                    </div>
                    <p className="text-xs text-neutral-300 mt-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Valid until <strong>{expiryFormatted}</strong></span>
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onOpenSubscriptionModal();
                      onClose();
                    }}
                    className="self-start sm:self-auto px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold border border-neutral-700 transition-all flex items-center gap-1.5"
                  >
                    <span>View Plan Details</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Visual Progress Bar (30 Days Cycle) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
                    <span>Current Billing Cycle</span>
                    <span>{daysRemaining} of 30 days</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(5, (daysRemaining / 30) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Duplicate Payment Protection Note */}
                <div className="p-3 rounded-xl bg-neutral-900/90 border border-emerald-500/20 flex items-start gap-2.5 text-xs text-neutral-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    <strong>Wallet Protection Active:</strong> Duplicate payments are automatically blocked. If you select another payment currency, the app ensures you are not double-charged until your current {daysRemaining} days expire.
                  </p>
                </div>
              </div>
            ) : (
              /* FREE TIER CARD */
              <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Free Mobile Plan</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400">Ad-Supported SD</span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    No active expiration date. Upgrade to Pro for 4K streaming and unlimited offline downloads.
                  </p>
                </div>

                <button
                  onClick={() => {
                    onOpenSubscriptionModal();
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Upgrade to Pro ($3)</span>
                </button>
              </div>
            )}
          </div>

          {/* ================= SECTION 2: USER PROFILE & CREDENTIALS (MINIMISED) ================= */}
          <div className="space-y-3 pt-4 border-t border-neutral-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-rose-500" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Profile & Account
                </h3>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">
                {currentUser ? 'Single Device Active' : 'Guest'}
              </span>
            </div>

            {currentUser ? (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                
                {/* MINIMISED SUMMARY ROW */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Compact Profile Picture with Quick Avatar Indicator */}
                    <div 
                      className="relative shrink-0 cursor-pointer group"
                      onClick={() => {
                        setIsEditingProfile(!isEditingProfile);
                        setShowAvatarPicker(false);
                      }}
                      title="Click to edit profile picture"
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden ring-1 ring-neutral-700 group-hover:ring-rose-500 transition-all bg-neutral-800 flex items-center justify-center shadow-md">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-tr from-rose-600 to-amber-600 flex items-center justify-center text-white font-bold text-sm">
                            {displayName.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] border border-neutral-950 shadow">
                        <Camera className="w-2.5 h-2.5" />
                      </div>
                    </div>

                    {/* Compact Identity Info */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white truncate">{displayName}</h4>
                        <span className="text-xs font-mono text-neutral-400 truncate">@{username}</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 truncate flex items-center gap-1.5 mt-0.5">
                        <Mail className="w-3 h-3 text-neutral-500 shrink-0" />
                        <span className="truncate">{email}</span>
                      </p>
                    </div>
                  </div>

                  {/* Compact Action Buttons */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingProfile(!isEditingProfile);
                        setShowPasswordChange(false);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isEditingProfile
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800'
                      }`}
                      title="Edit Profile Details"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-rose-500" />
                      <span>{isEditingProfile ? 'Done' : 'Edit Profile'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordChange(!showPasswordChange);
                        setIsEditingProfile(false);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        showPasswordChange
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800'
                      }`}
                      title="Change Password"
                    >
                      <Key className="w-3.5 h-3.5 text-amber-400" />
                      <span>{showPasswordChange ? 'Cancel' : 'Password'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={onLogout}
                      className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-rose-400 transition-colors flex items-center gap-1 text-xs"
                      title={t.logout}
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{t.logout}</span>
                    </button>
                  </div>
                </div>

                {/* Status Message if any */}
                {statusMessage && (
                  <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                    statusMessage.isError 
                      ? 'bg-rose-950/40 border-rose-500/40 text-rose-300' 
                      : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  }`}>
                    {statusMessage.isError ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    )}
                    <span>{statusMessage.text}</span>
                  </div>
                )}

                {/* EXPANDABLE COMPACT EDIT FORM (Only when Edit is clicked) */}
                {isEditingProfile && (
                  <form onSubmit={handleSaveProfile} className="pt-3 border-t border-neutral-800/80 space-y-3.5 animate-fadeIn">
                    
                    {/* Quick Avatar Presets Picker */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-neutral-400">
                        <span className="font-semibold text-neutral-300">Choose Cinema Avatar:</span>
                        <button
                          type="button"
                          onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                          className="text-rose-400 hover:text-rose-300 text-[10px]"
                        >
                          {showAvatarPicker ? 'Fewer' : 'More presets & URL'}
                        </button>
                      </div>

                      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {AVATAR_PRESETS.slice(0, showAvatarPicker ? 6 : 4).map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setAvatarUrl(p.url)}
                            className={`p-1 rounded-xl border flex items-center gap-1.5 shrink-0 transition-all ${
                              avatarUrl === p.url
                                ? 'bg-rose-600/20 border-rose-500 ring-2 ring-rose-500/30 text-white'
                                : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 text-neutral-400'
                            }`}
                          >
                            <img src={p.url} alt={p.label} className="w-7 h-7 rounded-lg object-cover" />
                            <span className="text-[10px] font-medium pr-1">{p.label.split(' ')[0]}</span>
                          </button>
                        ))}
                      </div>

                      {showAvatarPicker && (
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="url"
                            placeholder="Or paste image URL (https://...)"
                            value={customAvatarInput}
                            onChange={(e) => setCustomAvatarInput(e.target.value)}
                            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (customAvatarInput.trim()) {
                                setAvatarUrl(customAvatarInput.trim());
                                setCustomAvatarInput('');
                              }
                            }}
                            className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-medium"
                          >
                            Apply
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Streamlined Inputs: Display Name, Username, Email in compact form */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[11px] font-medium text-neutral-400 block mb-1">
                          Display Name
                        </label>
                        <input
                          type="text"
                          required
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="Display Name"
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-neutral-400 block mb-1">
                          Username
                        </label>
                        <input
                          type="text"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="username"
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500 font-mono"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-medium text-neutral-400 block mb-1">
                          Account Email
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="email@example.com"
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500 font-mono"
                        />
                      </div>
                    </div>

                    {/* Compact Save & Cancel buttons */}
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="px-3 py-1.5 rounded-lg text-xs text-neutral-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Changes</span>
                      </button>
                    </div>

                  </form>
                )}

                {/* EXPANDABLE PASSWORD CHANGE FORM (Only when Password is clicked) */}
                {showPasswordChange && (
                  <form onSubmit={handleSaveProfile} className="pt-3 border-t border-neutral-800/80 space-y-3 animate-fadeIn">
                    
                    {/* Security warning requested by user */}
                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-amber-200/90 leading-relaxed">
                        <strong>Security Note:</strong> It's highly recommended to not use the same password you use on other sites. Please create new password.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[11px] font-medium text-neutral-400 block mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Min 6 characters"
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-neutral-400 block mb-1">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-type password"
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordChange(false);
                          setNewPassword('');
                          setConfirmPassword('');
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs text-neutral-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>Update Password</span>
                      </button>
                    </div>

                  </form>
                )}

              </div>
            ) : (
              /* LOGGED OUT COMPACT STATE */
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Guest Account</h4>
                    <p className="text-[11px] text-neutral-400">Sign in with email to customize profile</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onOpenAuthModal('login');
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-colors"
                  >
                    {t.login}
                  </button>
                  <button
                    onClick={() => {
                      onOpenAuthModal('signup');
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors"
                  >
                    {t.createAccount}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ================= SECTION 3: APPEARANCE (DARK / LIGHT MODE) ================= */}
          <div className="space-y-3 pt-4 border-t border-neutral-800">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                {t.theme}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onToggleTheme('dark')}
                className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  theme === 'dark'
                    ? 'bg-neutral-800 border-rose-500 ring-2 ring-rose-500/20 text-white'
                    : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-neutral-900 flex items-center justify-center text-rose-400">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">{t.darkMode}</span>
                    <span className="text-[11px] text-neutral-500">Cinema black</span>
                  </div>
                </div>
                {theme === 'dark' && <Check className="w-4 h-4 text-rose-500" />}
              </button>

              <button
                type="button"
                onClick={() => onToggleTheme('light')}
                className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  theme === 'light'
                    ? 'bg-neutral-800 border-rose-500 ring-2 ring-rose-500/20 text-white'
                    : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-neutral-900 flex items-center justify-center text-amber-400">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">{t.lightMode}</span>
                    <span className="text-[11px] text-neutral-500">Daylight crisp</span>
                  </div>
                </div>
                {theme === 'light' && <Check className="w-4 h-4 text-rose-500" />}
              </button>
            </div>
          </div>

          {/* ================= SECTION 4: APP LANGUAGE SETTINGS ================= */}
          <div className="space-y-3 pt-4 border-t border-neutral-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-rose-500" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {t.languageSettings}
                </h3>
              </div>
              <span className="text-[11px] text-neutral-500">3 Supported Languages</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => onSelectAppLanguage('sw')}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  appLanguage === 'sw'
                    ? 'bg-neutral-800 border-amber-500 ring-2 ring-amber-500/20 text-white'
                    : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Kiswahili</span>
                  {appLanguage === 'sw' && <Check className="w-4 h-4 text-amber-400" />}
                </div>
                <span className="text-[11px] text-neutral-500 mt-1">Swahili (Afrika Mashariki)</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectAppLanguage('en')}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  appLanguage === 'en'
                    ? 'bg-neutral-800 border-rose-500 ring-2 ring-rose-500/20 text-white'
                    : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">English</span>
                  {appLanguage === 'en' && <Check className="w-4 h-4 text-rose-500" />}
                </div>
                <span className="text-[11px] text-neutral-500 mt-1">English (International)</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectAppLanguage('fr')}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  appLanguage === 'fr'
                    ? 'bg-neutral-800 border-blue-500 ring-2 ring-blue-500/20 text-white'
                    : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Français</span>
                  {appLanguage === 'fr' && <Check className="w-4 h-4 text-blue-400" />}
                </div>
                <span className="text-[11px] text-neutral-500 mt-1">Français (Afrique & Global)</span>
              </button>
            </div>
          </div>

          {/* ================= SECTION 5: SINGLE DEVICE SECURITY ENFORCEMENT ================= */}
          {currentUser && (
            <div className="space-y-3 pt-4 border-t border-neutral-800">
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>{t.singleDeviceTitle}</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">1 Device Limit Enforced</span>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed">
                  {t.singleDeviceDesc}
                </p>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-neutral-800/80">
                  <span className="text-[11px] text-neutral-500">
                    Device: {currentUser.deviceName}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onSimulateSecondDeviceLogin();
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                    title="Simulate signing in from a second phone to test single-device kickout"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.simulateSecondDevice}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
          <span>CinePulse Safe Membership · 2026</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium"
          >
            {t.close}
          </button>
        </div>

      </div>
    </div>
  );
};

