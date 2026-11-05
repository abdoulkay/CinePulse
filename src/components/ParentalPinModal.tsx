import React, { useState, useEffect } from 'react';
import { Lock, ShieldAlert, X, CheckCircle2, Eye, EyeOff, Delete, KeyRound, Flame } from 'lucide-react';
import { Episode, MediaItem, ParentalControlsConfig } from '../types';
import { normalizeRatingBadge } from '../data/mockData';

interface ParentalPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'playback' | 'unlock_adult_vault';
  mediaItem?: MediaItem;
  episode?: Episode;
  parentalControls: ParentalControlsConfig;
  onSuccessPlayback?: (item: MediaItem, episode?: Episode) => void;
  onSuccessUnlockVault?: () => void;
  onUpdateParentalControls?: (updated: Partial<ParentalControlsConfig>) => void;
}

export const ParentalPinModal: React.FC<ParentalPinModalProps> = ({
  isOpen,
  onClose,
  mode,
  mediaItem,
  episode,
  parentalControls,
  onSuccessPlayback,
  onSuccessUnlockVault,
  onUpdateParentalControls
}) => {
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [errorText, setErrorText] = useState<string | null>(null);
  const [ageConfirmed, setAgeConfirmed] = useState<boolean>(parentalControls.ageConfirmed18Plus);
  const [showPinDigits, setShowPinDigits] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setEnteredPin('');
      setErrorText(null);
      setAgeConfirmed(parentalControls.ageConfirmed18Plus);
    }
  }, [isOpen, parentalControls.ageConfirmed18Plus]);

  if (!isOpen) return null;

  const isAdultContent =
    mode === 'unlock_adult_vault' ||
    Boolean(mediaItem?.isAdult) ||
    normalizeRatingBadge(mediaItem?.rating || '') === '18+';

  const normalizedItemRating = mediaItem ? normalizeRatingBadge(mediaItem.rating) : '18+';

  const handleDigitPress = (digit: string) => {
    if (enteredPin.length < 4) {
      const nextPin = enteredPin + digit;
      setEnteredPin(nextPin);
      setErrorText(null);
    }
  };

  const handleBackspace = () => {
    setEnteredPin((prev) => prev.slice(0, -1));
    setErrorText(null);
  };

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (isAdultContent && !ageConfirmed) {
      setErrorText('You must confirm that you are 18 years of age or older to access adult content.');
      return;
    }

    if (enteredPin.length !== 4) {
      setErrorText('Please enter your 4-digit Parental Controls PIN.');
      return;
    }

    if (enteredPin !== parentalControls.pin) {
      setErrorText('Incorrect 4-digit PIN. Please try again.');
      setEnteredPin('');
      return;
    }

    // Persist age confirmation if checked
    if (isAdultContent && ageConfirmed && onUpdateParentalControls) {
      onUpdateParentalControls({ ageConfirmed18Plus: true });
    }

    if (mode === 'unlock_adult_vault') {
      if (onSuccessUnlockVault) onSuccessUnlockVault();
      onClose();
    } else if (mode === 'playback' && mediaItem) {
      if (onSuccessPlayback) onSuccessPlayback(mediaItem, episode);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div
        className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden my-0 sm:my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Handle */}
        <div
          onClick={onClose}
          className="sm:hidden w-12 h-1.5 bg-neutral-600 rounded-full mx-auto my-2.5 cursor-pointer"
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
          aria-label="Close PIN prompt"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 text-center space-y-2 bg-gradient-to-b from-rose-950/40 via-neutral-900 to-neutral-900 border-b border-neutral-800/80">
          <div className="w-14 h-14 rounded-2xl bg-rose-600/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-950/50">
            {mode === 'unlock_adult_vault' ? (
              <Flame className="w-7 h-7 text-rose-500" />
            ) : (
              <Lock className="w-7 h-7 text-rose-500" />
            )}
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-[10px] font-bold uppercase tracking-wider text-rose-400">
            <ShieldAlert className="w-3 h-3" />
            <span>
              {mode === 'unlock_adult_vault'
                ? '18+ Adult Vault Protection'
                : `Parental Rating Lock (${normalizedItemRating})`}
            </span>
          </div>

          <h3 className="font-display font-extrabold text-xl text-white">
            {mode === 'unlock_adult_vault'
              ? 'Unlock Hidden Adult Movies'
              : '4-Digit Parental PIN Required'}
          </h3>

          {mode === 'playback' && mediaItem ? (
            <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
              <strong className="text-white">"{mediaItem.title}"</strong> is rated{' '}
              <span className="px-1.5 py-0.5 rounded bg-rose-600/30 text-rose-300 font-mono font-bold">
                {normalizedItemRating} ({mediaItem.rating})
              </span>
              , which exceeds your maximum allowed rating of{' '}
              <strong className="text-amber-400 font-mono">{parentalControls.maxRating}</strong>.
            </p>
          ) : (
            <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
              This hidden section contains mature 18+ adult cinema. Please confirm your age and enter your 4-digit PIN to reveal it.
            </p>
          )}
        </div>

        {/* Body */}
        <form onSubmit={handleVerify} className="p-5 sm:p-6 space-y-4">
          {/* Age Confirmation Checkbox for 18+ / Adult Vault */}
          {isAdultContent && (
            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-950 border border-rose-500/30 cursor-pointer hover:border-rose-500/60 transition-colors select-none">
              <input
                type="checkbox"
                checked={ageConfirmed}
                onChange={(e) => {
                  setAgeConfirmed(e.target.checked);
                  setErrorText(null);
                }}
                className="mt-0.5 w-4 h-4 rounded accent-rose-600 cursor-pointer"
              />
              <div className="text-xs space-y-0.5">
                <span className="font-bold text-white block">
                  I confirm that I am 18 years of age or older
                </span>
                <span className="text-[11px] text-neutral-400 block leading-snug">
                  I verify I am of legal adult age to view 18+ restricted content on CinePulse.
                </span>
              </div>
            </label>
          )}

          {/* PIN Display Boxes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400 font-medium flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-rose-400" />
                <span>Enter 4-Digit Security PIN</span>
              </span>
              <button
                type="button"
                onClick={() => setShowPinDigits(!showPinDigits)}
                className="text-neutral-400 hover:text-white flex items-center gap-1 text-[11px]"
              >
                {showPinDigits ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPinDigits ? 'Hide' : 'Show'}</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-3 py-1">
              {[0, 1, 2, 3].map((idx) => {
                const char = enteredPin[idx];
                const isActive = enteredPin.length === idx;
                return (
                  <div
                    key={idx}
                    className={`w-13 h-14 rounded-2xl border flex items-center justify-center text-xl font-mono font-extrabold transition-all ${
                      char
                        ? 'bg-rose-600/20 border-rose-500 text-white shadow-inner'
                        : isActive
                        ? 'bg-neutral-950 border-rose-500/70 text-neutral-400 ring-2 ring-rose-500/20'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-600'
                    }`}
                  >
                    {char ? (showPinDigits ? char : '•') : ''}
                  </div>
                );
              })}
            </div>

            {/* Direct keyboard input fallback for accessibility */}
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={enteredPin}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                setEnteredPin(val);
                setErrorText(null);
              }}
              placeholder="Type 4-digit PIN"
              className="sr-only"
              autoFocus
            />

            {parentalControls.pin === '1234' && (
              <p className="text-[11px] text-center text-neutral-500 font-mono">
                Default PIN: <strong className="text-neutral-300">1234</strong> (Changeable in Settings → Parental Controls)
              </p>
            )}
          </div>

          {/* Numeric Keypad */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleDigitPress(digit)}
                className="h-11 rounded-xl bg-neutral-950 hover:bg-neutral-800 active:bg-rose-600 border border-neutral-800 text-white font-mono font-bold text-base transition-colors touch-manipulation"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setEnteredPin('');
                setErrorText(null);
              }}
              className="h-11 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white text-xs font-semibold transition-colors touch-manipulation"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => handleDigitPress('0')}
              className="h-11 rounded-xl bg-neutral-950 hover:bg-neutral-800 active:bg-rose-600 border border-neutral-800 text-white font-mono font-bold text-base transition-colors touch-manipulation"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="h-11 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center transition-colors touch-manipulation"
              aria-label="Backspace"
            >
              <Delete className="w-4 h-4" />
            </button>
          </div>

          {/* Error Feedback */}
          {errorText && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorText}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-1 flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-2 py-2.5 px-5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-rose-950/50 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {mode === 'unlock_adult_vault' ? 'Verify & Unlock 18+ Vault' : 'Unlock & Play Now'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
