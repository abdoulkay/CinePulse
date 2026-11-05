import React from 'react';
import { X, Check, Sparkles, Smartphone, Tv, Zap, ShieldCheck, CreditCard, Banknote } from 'lucide-react';
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

  const isFree = currentSubscription.tier === 'free';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
          aria-label="Close plans"
        >
          <X className="w-5 h-5" />
        </button>

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
                onClick={() => {
                  onSelectTier('pro_usd');
                  onClose();
                }}
                disabled={currentSubscription.tier === 'pro_usd'}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                  currentSubscription.tier === 'pro_usd'
                    ? 'bg-neutral-800 text-neutral-400 cursor-default'
                    : 'bg-rose-600 hover:bg-rose-500 text-white hover:scale-[1.02]'
                }`}
              >
                {currentSubscription.tier === 'pro_usd' ? 'Currently Active' : 'Select Pro in USD ($3)'}
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
                onClick={() => {
                  onSelectTier('pro_bif');
                  onClose();
                }}
                disabled={currentSubscription.tier === 'pro_bif'}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                  currentSubscription.tier === 'pro_bif'
                    ? 'bg-neutral-800 text-neutral-400 cursor-default'
                    : 'bg-amber-600 hover:bg-amber-500 text-white hover:scale-[1.02]'
                }`}
              >
                {currentSubscription.tier === 'pro_bif' ? 'Currently Active' : 'Select Pro in BIF (6000 BIF)'}
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
                onClick={() => {
                  onSelectTier('pro_tzs');
                  onClose();
                }}
                disabled={currentSubscription.tier === 'pro_tzs'}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                  currentSubscription.tier === 'pro_tzs'
                    ? 'bg-neutral-800 text-neutral-400 cursor-default'
                    : 'bg-blue-600 hover:bg-blue-500 text-white hover:scale-[1.02]'
                }`}
              >
                {currentSubscription.tier === 'pro_tzs' ? 'Currently Active' : 'Select Pro in TZS (3000 Tsh)'}
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
