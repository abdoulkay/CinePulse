import React from 'react';
import { Mic2, Radio, Check, Layers, SlidersHorizontal, Lock, Flame } from 'lucide-react';
import { DJProfile, Language, ParentalControlsConfig, SubCategory } from '../types';
import { DJ_PROFILES } from '../data/mockData';

interface CategoryFilterBarProps {
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  currentSubCategory: SubCategory;
  onSelectSubCategory: (sub: SubCategory) => void;
  selectedDjId: string;
  onSelectDj: (djId: string) => void;
  selectedGenre: string;
  onSelectGenre: (genre: string) => void;
  allGenres: string[];
  parentalControls?: ParentalControlsConfig;
  onOpenParentalSettings?: () => void;
  onToggleAdultVault?: () => void;
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  currentLanguage,
  onSelectLanguage,
  currentSubCategory,
  onSelectSubCategory,
  selectedDjId,
  onSelectDj,
  selectedGenre,
  onSelectGenre,
  allGenres,
  parentalControls,
  onOpenParentalSettings,
  onToggleAdultVault
}) => {
  // Filter DJs by the active language (Swahili or Kinyarwanda)
  const availableDjs = DJ_PROFILES.filter(
    (dj) => currentLanguage === 'all' || dj.language === currentLanguage
  );

  const selectedDjProfile = DJ_PROFILES.find((dj) => dj.id === selectedDjId);

  return (
    <div className="space-y-4">
      {/* Primary Language Bar (Tabs) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-800 pb-2.5 gap-2.5">
        <div className="flex items-center gap-1.5 p-1 bg-neutral-900 rounded-xl border border-neutral-800 overflow-x-auto scrollbar-none touch-pan-x -mx-1 px-1 sm:mx-0">
          <button
            onClick={() => {
              onSelectLanguage('all');
              onSelectDj('');
            }}
            className={`px-3 py-2 sm:px-3.5 sm:py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all touch-manipulation min-h-[38px] ${
              currentLanguage === 'all'
                ? 'bg-rose-600 text-white shadow'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            All Languages
          </button>

          <button
            onClick={() => {
              onSelectLanguage('english');
              onSelectDj('');
            }}
            className={`px-3 py-2 sm:px-3.5 sm:py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all touch-manipulation min-h-[38px] ${
              currentLanguage === 'english'
                ? 'bg-rose-600 text-white shadow'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            English (Dubbed)
          </button>

          <button
            onClick={() => {
              onSelectLanguage('french');
              onSelectDj('');
            }}
            className={`px-3 py-2 sm:px-3.5 sm:py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all touch-manipulation min-h-[38px] ${
              currentLanguage === 'french'
                ? 'bg-rose-600 text-white shadow'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            Français (VF Doublé)
          </button>

          <button
            onClick={() => onSelectLanguage('swahili')}
            className={`px-3 py-2 sm:px-3.5 sm:py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 touch-manipulation min-h-[38px] ${
              currentLanguage === 'swahili'
                ? 'bg-amber-600 text-white shadow'
                : 'text-neutral-400 hover:text-amber-400 hover:bg-neutral-800'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-amber-300" />
            <span>Swahili (DJ Translated)</span>
          </button>

          <button
            onClick={() => onSelectLanguage('kinyarwanda')}
            className={`px-3 py-2 sm:px-3.5 sm:py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 touch-manipulation min-h-[38px] ${
              currentLanguage === 'kinyarwanda'
                ? 'bg-rose-600 text-white shadow'
                : 'text-neutral-400 hover:text-rose-400 hover:bg-neutral-800'
            }`}
          >
            <Mic2 className="w-3.5 h-3.5 text-rose-300" />
            <span>Kinyarwanda (Agasobanuye)</span>
          </button>
        </div>

        {/* Quick Genre Dropdown, Parental Rating Status & 18+ Vault Trigger */}
        <div className="flex flex-wrap items-center justify-end gap-2 shrink-0 self-end sm:self-auto">
          {parentalControls && onOpenParentalSettings && (
            <button
              type="button"
              onClick={onOpenParentalSettings}
              className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[11px] font-medium text-neutral-300 flex items-center gap-1.5 transition-colors min-h-[36px]"
              title="Parental Controls & Rating PIN Settings"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>
                {parentalControls.enabled ? `Max: ${parentalControls.maxRating}` : 'Parental Off'}
              </span>
            </button>
          )}

          {onToggleAdultVault && (
            <button
              type="button"
              onClick={onToggleAdultVault}
              className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 transition-all min-h-[36px] ${
                parentalControls?.hiddenAdultVaultUnlocked && !parentalControls?.filterAdultContent
                  ? 'bg-rose-600/25 border-rose-500 text-rose-300 shadow-sm'
                  : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-400 hover:text-rose-400'
              }`}
              title="18+ Hidden Adult Movies Vault (PIN & Age Confirmation Required)"
            >
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>
                {parentalControls?.hiddenAdultVaultUnlocked && !parentalControls?.filterAdultContent
                  ? '18+ Vault Unlocked'
                  : '18+ Vault'}
              </span>
            </button>
          )}

          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500" />
            <select
              value={selectedGenre}
              onChange={(e) => onSelectGenre(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-rose-500 min-h-[36px]"
            >
              <option value="all">All Genres</option>
              {allGenres.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Conditional Sub-Categories: English & French -> "Movies" & "TV Shows" */}
      {(currentLanguage === 'english' || currentLanguage === 'french') && (
        <div className="flex items-center gap-3 p-3 bg-neutral-900/40 rounded-xl border border-neutral-800/80">
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
            <Layers className="w-4 h-4 text-rose-500" />
            <span>Filter Category:</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSelectSubCategory('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                currentSubCategory === 'all'
                  ? 'bg-neutral-800 text-white border border-neutral-700 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              All {currentLanguage === 'english' ? 'English Dubs' : 'Versions Françaises'}
            </button>

            <button
              onClick={() => onSelectSubCategory('movie')}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                currentSubCategory === 'movie'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
              }`}
            >
              Movies
            </button>

            <button
              onClick={() => onSelectSubCategory('tv')}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                currentSubCategory === 'tv'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
              }`}
            >
              TV Shows / Series
            </button>
          </div>
        </div>
      )}

      {/* Conditional Categorization for Swahili and Kinyarwanda: Categorized by DJs' names! */}
      {(currentLanguage === 'swahili' || currentLanguage === 'kinyarwanda') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                {currentLanguage === 'swahili' 
                  ? 'Swahili Video Jokers (DJs Translation Masters):' 
                  : 'Rwandan Agasobanuye Translators (DJs Voiceover):'}
              </span>
              <span className="text-xs text-neutral-500">
                Overlay voice translation & commentary
              </span>
            </div>
            {selectedDjId && (
              <button
                onClick={() => onSelectDj('')}
                className="text-xs text-rose-400 hover:text-rose-300 font-medium"
              >
                Clear DJ Filter
              </button>
            )}
          </div>

          {/* DJs Selector Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none touch-pan-x -mx-1 px-1 sm:mx-0">
            <button
              onClick={() => onSelectDj('')}
              className={`px-3 py-2 sm:py-1.5 rounded-xl text-xs font-medium whitespace-nowrap border transition-all touch-manipulation min-h-[38px] ${
                !selectedDjId
                  ? 'bg-neutral-800 border-neutral-600 text-white font-semibold'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
              }`}
            >
              All {currentLanguage === 'swahili' ? 'Swahili DJs' : 'Agasobanuye DJs'}
            </button>

            {availableDjs.map((dj) => {
              const isSelected = selectedDjId === dj.id;
              return (
                <button
                  key={dj.id}
                  onClick={() => onSelectDj(dj.id)}
                  className={`flex items-center gap-2 px-3 py-2 sm:py-1.5 rounded-xl text-xs font-medium whitespace-nowrap border transition-all touch-manipulation min-h-[38px] ${
                    isSelected
                      ? dj.language === 'swahili'
                        ? 'bg-amber-600 border-amber-500 text-white shadow-md'
                        : 'bg-rose-600 border-rose-500 text-white shadow-md'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full bg-gradient-to-tr ${dj.accentColor} text-[10px] font-bold text-white flex items-center justify-center shrink-0`}>
                    {dj.avatarInitials}
                  </span>
                  <span>{dj.name}</span>
                  <span className="text-[10px] opacity-75 tabular-nums">({dj.totalTitles})</span>
                  {isSelected && <Check className="w-3 h-3 text-white ml-0.5 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Selected DJ Spotlight Profile Preview */}
          {selectedDjProfile && (
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-950 border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${selectedDjProfile.accentColor} flex items-center justify-center font-bold text-base text-white shadow-lg shrink-0`}>
                  {selectedDjProfile.avatarInitials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{selectedDjProfile.name}</h4>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                      {selectedDjProfile.yearsActive}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">{selectedDjProfile.tagline}</p>
                </div>
              </div>

              <div className="text-xs text-neutral-400 border-l border-neutral-800 pl-3 md:max-w-md italic">
                "{selectedDjProfile.sampleQuote}"
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
