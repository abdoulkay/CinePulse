import React, { useState } from 'react';
import { X, Check, Sparkles, Smartphone, Tv, Zap, ShieldCheck, CreditCard, Banknote, ShieldAlert, Clock, AlertTriangle } from 'lucide-react';
import { SubscriptionTier, UserSubscription } from '../types';
import { SUBSCRIPTION_PLANS } from '../data/mockData';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSubscription: UserSubscription;
  onSelectTier: (tier: SubscriptionTier) => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentSubscription,
  onSelectTier
}) => {
  if (!isOpen) return null;

  const [warningTier, setWarningTier] = useState<SubscriptionTier | null>(null);

  const isFree = currentSubscription.tier === 'free';
  const daysRemaining = currentSubscription.daysRemaining ?? (isFree ? 0 : 27);
  const expiryFormatted = currentSubscription.subscriptionExpiryDate 
    ? new Date(currentSubscription.subscriptionExpiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Dec 5, 2026';

  const handleTierButtonClick = (targetTier: SubscriptionTier) => {
    // If target tier is same as current tier
    if (targetTier === currentSubscription.tier) {
      return;
    }

    // USER SUBSCRIPTION PROTECTION:
    // If user is ALREADY an active Pro subscriber and clicks on another paid tier mistakenly
    if (!isFree && targetTier !== 'free') {
      setWarningTier(targetTier);
      return;
    }

    // Otherwise switch tier
    onSelectTier(targetTier);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden my-0 sm:my-8 max-h-[92vh] sm:max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator */}
        <div 
          onClick={onClose}
          className="sm:hidden w-12 h-1.5 bg-neutral-600 rounded-full mx-auto my-2.5 shrink-0 cursor-pointer" 
          title="Tap to close"
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors touch-manipulation"
          aria-label="Close plans"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* DUPLICATE PAYMENT & SUBSCRIPTION PROTECTION WARNING MODAL */}
        {warningTier && (
          <div className="absolute inset-0 z-40 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
            <div className="max-w-md w-full bg-neutral-900 border border-amber-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  Subscription Protected
                </span>
                <h3 className="font-display font-extrabold text-xl text-white mt-2">
                  You Are Already a Pro Subscriber!
                </h3>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 space-y-2 text-left">
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Current Active Plan:</span>
                  <span className="font-bold text-white">{currentSubscription.planName} ({currentSubscription.price})</span>
                </div>
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Days Left on Your Cycle:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{daysRemaining} days remaining</span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Valid & Active Until:</span>
                  <span className="font-bold text-neutral-200">{expiryFormatted}</span>
                </div>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed">
                You do <strong>not</strong> need to subscribe or pay again until your current billing period ends. We protect you from duplicate charges so you never pay twice!
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  onClick={() => setWarningTier(null)}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Keep My Current Plan ({daysRemaining}d Left)</span>
                </button>
                <button
                  onClick={() => {
                    const target = warningTier;
                    setWarningTier(null);
                    onSelectTier(target);
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors"
                >
                  Switch Currency Anyway
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Banner */}
        <div className="p-6 sm:p-10 text-center space-y-2 bg-gradient-to-b from-neutral-800/60 to-neutral-900 border-b border-neutral-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-600/20 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CinePulse Pro Membership</span>
          </div>

          <h2 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-white tracking-tight">
            Choose Your Currency & Upgrade to Pro
          </h2>

          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mx-auto">
            Unlock 100% Ad-Free cinema, 4K Ultra HD resolution, and unlimited offline downloads for all series & movies. Available in USD, BIF, or TZS.
          </p>
        </div>

        {/* Active Pro Member Banner with Days Left */}
        {!isFree && (
          <div className="bg-gradient-to-r from-emerald-950/70 via-neutral-900 to-emerald-950/70 border-b border-emerald-500/30 px-6 sm:px-10 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Your Pro Subscription is Active:</strong> {currentSubscription.planName} ({currentSubscription.price}/mo) · <strong className="text-white underline">{daysRemaining} days left</strong> until renewal ({expiryFormatted}).
              </span>
            </div>
            <span className="text-[11px] text-emerald-400/90 font-mono bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/60 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Duplicate Charge Protection Active</span>
            </span>
          </div>
        )}

        {/* Free Mobile Tier Notice / Switcher Strip */}
        <div className="px-6 sm:px-10 py-3.5 bg-neutral-950/80 border-b border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-neutral-300">
            <Smartphone className="w-4 h-4 text-neutral-400" />
            <span>
              <strong>Free Mobile Tier:</strong> $0 / month (Ad-supported, 480p SD max, first 5 episodes download limit).
            </span>
          </div>

          <button
            onClick={() => {
              onSelectTier('free');
              onClose();
            }}
            disabled={isFree}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isFree
                ? 'bg-neutral-800 text-neutral-400 cursor-default'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
            }`}
          >
            {isFree ? 'Current Plan: Free' : 'Switch Back to Free Tier ($0)'}
          </button>
        </div>

        {/* 3 Pro Currency Tiers Grid */}
        <div className="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Tier 1: Pro in USD ($3) */}
          <div className={`rounded-2xl p-6 border transition-all flex flex-col justify-between relative overflow-hidden ${
            currentSubscription.tier === 'pro_usd'
              ? 'bg-neutral-800/80 border-rose-500 ring-2 ring-rose-500/30 shadow-xl'
              : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700'
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>USD Currency</span>
                </span>
                {currentSubscription.tier === 'pro_usd' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-600/30 text-rose-300 font-bold border border-rose-500/40">
                    Active Plan
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-display font-extrabold text-xl text-white">Pro in USD</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">$3</span>
                  <span className="text-xs text-neutral-400">/ month</span>
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  Three dollars monthly. Ideal for international debit, credit cards & PayPal.
                </p>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-neutral-800 text-xs">
                <div className="flex items-center gap-2 text-neutral-200">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>100% Ad-Free</strong> streaming</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-200">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>4K Ultra HD & 1080p</strong></span>
                </div>
                <div className="flex items-center gap-2 text-emerald-300 font-medium">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Unlimited downloads</strong> (All episodes)</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-300">
                  <Tv className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>4 Screens simultaneously</span>
                </div>
                <div className="flex items-center gap-2 text-amber-300 font-medium">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>VIP Agasobanuye & Swahili DJ releases</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => handleTierButtonClick('pro_usd')}
                disabled={currentSubscription.tier === 'pro_usd'}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                  currentSubscription.tier === 'pro_usd'
                    ? 'bg-neutral-800 text-neutral-400 cursor-default'
                    : 'bg-rose-600 hover:bg-rose-500 text-white hover:scale-[1.02]'
                }`}
              >
                {currentSubscription.tier === 'pro_usd' ? `Currently Active (${daysRemaining}d left)` : 'Select Pro in USD ($3)'}
              </button>
            </div>
          </div>

          {/* Tier 2: Pro in BIF (6000BIF) */}
          <div className={`rounded-2xl p-6 border transition-all flex flex-col justify-between relative overflow-hidden ${
            currentSubscription.tier === 'pro_bif'
              ? 'bg-neutral-800/80 border-amber-500 ring-2 ring-amber-500/30 shadow-xl'
              : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700'
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Banknote className="w-3.5 h-3.5" />
                  <span>Burundi Currency</span>
                </span>
                {currentSubscription.tier === 'pro_bif' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-600/30 text-amber-300 font-bold border border-amber-500/40">
                    Active Plan
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-display font-extrabold text-xl text-white">Pro in BIF</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">6,000 BIF</span>
                  <span className="text-xs text-neutral-400">/ month</span>
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  Six thousand Burundian Francs. Supports Lumicash, EcoCash & local cards.
                </p>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-neutral-800 text-xs">
                <div className="flex items-center gap-2 text-neutral-200">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>100% Ad-Free</strong> streaming</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-200">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>4K Ultra HD & 1080p</strong></span>
                </div>
                <div className="flex items-center gap-2 text-emerald-300 font-medium">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Unlimited downloads</strong> (All episodes)</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-300">
                  <Tv className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>4 Screens simultaneously</span>
                </div>
                <div className="flex items-center gap-2 text-amber-300 font-medium">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>VIP Agasobanuye & Swahili DJ releases</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => handleTierButtonClick('pro_bif')}
                disabled={currentSubscription.tier === 'pro_bif'}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                  currentSubscription.tier === 'pro_bif'
                    ? 'bg-neutral-800 text-neutral-400 cursor-default'
                    : 'bg-amber-600 hover:bg-amber-500 text-white hover:scale-[1.02]'
                }`}
              >
                {currentSubscription.tier === 'pro_bif' ? `Currently Active (${daysRemaining}d left)` : 'Select Pro in BIF (6000 BIF)'}
              </button>
            </div>
          </div>

          {/* Tier 3: Pro in TZS (3000Tsh) */}
          <div className={`rounded-2xl p-6 border transition-all flex flex-col justify-between relative overflow-hidden ${
            currentSubscription.tier === 'pro_tzs'
              ? 'bg-neutral-800/80 border-blue-500 ring-2 ring-blue-500/30 shadow-xl'
              : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700'
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                  <Banknote className="w-3.5 h-3.5" />
                  <span>Tanzania Currency</span>
                </span>
                {currentSubscription.tier === 'pro_tzs' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600/30 text-blue-300 font-bold border border-blue-500/40">
                    Active Plan
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-display font-extrabold text-xl text-white">Pro in TZS</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">3,000 Tsh</span>
                  <span className="text-xs text-neutral-400">/ month</span>
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  Three thousand Tanzanian Shillings. Supports M-Pesa, Tigo Pesa & Airtel Money.
                </p>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-neutral-800 text-xs">
                <div className="flex items-center gap-2 text-neutral-200">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>100% Ad-Free</strong> streaming</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-200">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>4K Ultra HD & 1080p</strong></span>
                </div>
                <div className="flex items-center gap-2 text-emerald-300 font-medium">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Unlimited downloads</strong> (All episodes)</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-300">
                  <Tv className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>4 Screens simultaneously</span>
                </div>
                <div className="flex items-center gap-2 text-amber-300 font-medium">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>VIP Agasobanuye & Swahili DJ releases</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => handleTierButtonClick('pro_tzs')}
                disabled={currentSubscription.tier === 'pro_tzs'}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                  currentSubscription.tier === 'pro_tzs'
                    ? 'bg-neutral-800 text-neutral-400 cursor-default'
                    : 'bg-blue-600 hover:bg-blue-500 text-white hover:scale-[1.02]'
                }`}
              >
                {currentSubscription.tier === 'pro_tzs' ? `Currently Active (${daysRemaining}d left)` : 'Select Pro in TZS (3000 Tsh)'}
              </button>
            </div>
          </div>

        </div>

        {/* Guarantee Footer */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-center gap-6 text-xs text-neutral-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Instant activation via Card, Lumicash, EcoCash, M-Pesa & Tigo Pesa</span>
          </span>
          <span className="hidden sm:inline text-neutral-600">·</span>
          <span className="hidden sm:inline">Cancel or switch payment currency anytime</span>
        </div>

      </div>
    </div>
  );
};
