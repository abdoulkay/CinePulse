import React from 'react';
import { ShieldAlert, Smartphone, ArrowRight, X } from 'lucide-react';
import { AppLanguage } from '../types';
import { TRANSLATIONS } from '../utils/i18n';

interface SessionConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  conflictingDeviceName: string;
  onRelogin: () => void;
  appLanguage: AppLanguage;
}

export const SessionConflictModal: React.FC<SessionConflictModalProps> = ({
  isOpen,
  onClose,
  userEmail,
  conflictingDeviceName,
  onRelogin,
  appLanguage
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[appLanguage];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div 
        className="relative w-full max-w-md bg-neutral-900 border border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-4 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <h3 className="font-display font-extrabold text-xl text-white">
            {t.sessionTerminatedTitle}
          </h3>
          <p className="text-xs text-amber-300 font-medium">
            Account: <span className="text-white underline">{userEmail}</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2 text-left">
          <div className="flex items-center gap-2 text-xs text-neutral-300 font-semibold">
            <Smartphone className="w-4 h-4 text-amber-400 shrink-0" />
            <span>New device signed in: {conflictingDeviceName}</span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            {t.sessionTerminatedDesc}
          </p>
        </div>

        <div className="pt-2 space-y-2">
          <button
            onClick={() => {
              onRelogin();
              onClose();
            }}
            className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40 transition-all"
          >
            <span>{t.relogin}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors"
          >
            Continue as Guest (Free Tier · Pro Downloads Locked)
          </button>

          <p className="text-[11px] text-neutral-500 pt-1">
            Pro downloads remain safely locked on this device until you sign back in.
          </p>
        </div>

      </div>
    </div>
  );
};
