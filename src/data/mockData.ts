import { ContinueWatchingItem, DJProfile, Episode, MediaItem, SubscriptionTier, TopSearchItem, UserSubscription, WatchlistItem } from '../types';

export const DJ_PROFILES: DJProfile[] = [
  // Swahili DJs
  {
    id: 'dj-afro',
    name: 'DJ Afro Amigo',
    language: 'swahili',
    avatarInitials: 'AF',
    accentColor: 'from-amber-600 to-red-600',
    tagline: 'The King of Swahili Movie Commentary',
    signatureStyle: 'High-octane action, live martial arts sound effects & comedic play-by-play',
    yearsActive: '20+ Years',
    totalTitles: 142,
    sampleQuote: 'Wacha nikwambie mambo imechemka hapa... Hapo ndipo akajua hajui!'
  },
  {
    id: 'dj-murphy',
    name: 'DJ Murphy',
    language: 'swahili',
    avatarInitials: 'MU',
    accentColor: 'from-emerald-600 to-teal-700',
    tagline: 'Urban Crime & Deep Suspense Maestro',
    signatureStyle: 'Deep voice storytelling, street slang nuances & dramatic punchlines',
    yearsActive: '12 Years',
    totalTitles: 86,
    sampleQuote: 'Tizama huyo afisa wa upelelezi, hataki mchezo hata kidogo...'
  },
  {
    id: 'dj-smith',
    name: 'DJ Smith',
    language: 'swahili',
    avatarInitials: 'SM',
    accentColor: 'from-blue-600 to-indigo-700',
    tagline: 'Sci-Fi, Superhero & Fantasy Master',
    signatureStyle: 'Futuristic vibe, explosive enthusiasm and sharp translation of high-concept plots',
    yearsActive: '9 Years',
    totalTitles: 64,
    sampleQuote: 'Hawa ni wageni kutoka anga za mbali, nguvu zao hazina kifani!'
  },
  {
    id: 'dj-ally-b',
    name: 'DJ Ally B',
    language: 'swahili',
    avatarInitials: 'AL',
    accentColor: 'from-orange-600 to-yellow-600',
    tagline: 'Action, Romance & Thriller Specialist',
    signatureStyle: 'Smooth emotional delivery paired with rapid-fire combat commentary',
    yearsActive: '8 Years',
    totalTitles: 52,
    sampleQuote: 'Moyo ulioumizwa hauna huruma... Sikiliza jinsi anavyojibu mapigo!'
  },
  {
    id: 'dj-black',
    name: 'DJ Black',
    language: 'swahili',
    avatarInitials: 'BL',
    accentColor: 'from-purple-600 to-pink-600',
    tagline: 'Ninja & Tactical Warfare Maestro',
    signatureStyle: 'Rhythmic commentary, blade sound impressions and non-stop energy',
    yearsActive: '11 Years',
    totalTitles: 73,
    sampleQuote: 'Akafyeka huyu, akagonga yule! Jamaa hapingiki leo!'
  },

  // Kinyarwanda DJs (Agasobanuye Legends)
  {
    id: 'junior-giti',
    name: 'Junior Giti',
    language: 'kinyarwanda',
    avatarInitials: 'JG',
    accentColor: 'from-rose-600 to-red-800',
    tagline: 'The Undisputed Pioneer of Agasobanuye (Giti Productions)',
    signatureStyle: 'Philosophical insight, immaculate plot clarity, legendary emotional cadence',
    yearsActive: '18+ Years',
    totalTitles: 210,
    sampleQuote: 'Giti cyanjye, nta kindi kintu kigomba kubaho muri uyu mujyi keretse ubutabera...'
  },
  {
    id: 'rocky-kimomo',
    name: 'Rocky Kimomo',
    language: 'kinyarwanda',
    avatarInitials: 'RK',
    accentColor: 'from-yellow-500 to-amber-700',
    tagline: 'Rock Entertainment · Comic Genius & Action Hype',
    signatureStyle: 'Unrivaled comedic slang, hilarious cultural analogies, crowd-electrifying humor',
    yearsActive: '10+ Years',
    totalTitles: 168,
    sampleQuote: 'Uyu muhungu arakaze pe! Nyamara reba uko agiye kumusuka mu byatsi...'
  },
  {
    id: 'savimbi',
    name: 'Savimbi',
    language: 'kinyarwanda',
    avatarInitials: 'SA',
    accentColor: 'from-cyan-600 to-blue-800',
    tagline: 'Military Sagas & Intense War Drama Specialist',
    signatureStyle: 'Deep resonant voice, tactical breakdown of firefights and espionage',
    yearsActive: '14 Years',
    totalTitles: 115,
    sampleQuote: 'Abasirikare bose bari ku murongo, ntabwo baje gukina, baje ku rugamba rwanyuma!'
  },
  {
    id: 'dj-young',
    name: 'DJ Young',
    language: 'kinyarwanda',
    avatarInitials: 'YNG',
    accentColor: 'from-violet-600 to-purple-800',
    tagline: 'Martial Arts & Fast-Paced Modern Action',
    signatureStyle: 'Youthful vigor, dynamic sound effects, kung fu fight breakdown',
    yearsActive: '7 Years',
    totalTitles: 84,
    sampleQuote: 'Umugeri umwe gusa akubita hasi batatu! Iyi mirwano ni iya mbere mu mateka...'
  },
  {
    id: 'chris',
    name: 'Chris',
    language: 'kinyarwanda',
    avatarInitials: 'CH',
    accentColor: 'from-teal-600 to-emerald-800',
    tagline: 'Mystery, Crime Syndicates & Drama',
    signatureStyle: 'Intriguing character voice acting, mystery revelation pacing',
    yearsActive: '9 Years',
    totalTitles: 76,
    sampleQuote: 'Ibanga rikomeye ryihishe inyuma yuyu muryango rigiye gushyirwa ahabona...'
  },
  {
    id: 'sankara',
    name: 'Sankara',
    language: 'kinyarwanda',
    avatarInitials: 'SK',
    accentColor: 'from-pink-600 to-rose-700',
    tagline: 'Action Thrillers & Detective Sagas',
    signatureStyle: 'Sharp dialogue, pulse-pounding chase scene translation',
    yearsActive: '8 Years',
    totalTitles: 69,
    sampleQuote: 'Nta munota wo gutakaza, umujura aratorotse ariko polisi iramwegereye...'
  }
];

// Open source MP4 stream samples for reliable video playback
const SAMPLE_VIDEOS = {
  action: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  thriller: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  sciFi: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  drama: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  adSponsor: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
};

const makeEpisodes = (showId: string, showTitle: string, count: number = 8): Episode[] => {
  return Array.from({ length: count }, (_, i) => {
    const epNum = i + 1;
    return {
      id: `${showId}-ep-${epNum}`,
      episodeNumber: epNum,
      seasonNumber: 1,
      title: `Episode ${epNum}: ${
        epNum === 1 ? 'The Reckoning' :
        epNum === 2 ? 'Shadows in the Mist' :
        epNum === 3 ? 'Crossfire Ambush' :
        epNum === 4 ? 'Bloodline Pact' :
        epNum === 5 ? 'The Safehouse Breach' :
        epNum === 6 ? 'Midnight Siege [VIP]' :
        epNum === 7 ? 'The Double Agent [VIP]' :
        epNum === 8 ? 'Final Retribution [VIP]' :
        `Operation Apex ${epNum} [VIP]`
      }`,
      duration: `${42 + (epNum % 5) * 3}m`,
      synopsis: `Episode ${epNum} continues the pulse-pounding saga. With stakes escalating at every corner, allies become rivals in a fight where only the cunning survive.`,
      thumbnailUrl: '',
      fileSizeMb: 240 + epNum * 15,
      videoUrl: epNum % 2 === 0 ? SAMPLE_VIDEOS.thriller : SAMPLE_VIDEOS.action
    };
  });
};

export const MEDIA_CATALOG: MediaItem[] = [
  // ==================== ENGLISH (DUBBED) ====================
  // English Movies
  {
    id: 'eng-mov-2',
    title: 'Crimson Horizon',
    originalTitle: 'Horizonte Vermelho',
    type: 'movie',
    language: 'english',
    subCategory: 'movie',
    year: 2023,
    rating: '18+',
    matchScore: 94,
    duration: '1h 56m',
    genres: ['Sci-Fi', 'Survival', 'Adventure'],
    synopsis: 'When a deep space orbital colony suffers catastrophic structural failure, three stranded astronauts must trek across a radioactive alien canyon to reach an automated rescue pod before oxygen expires.',
    director: 'Sofia Morales',
    cast: ['Devon Cole', 'Amina Diallo', 'Lukas Meyer'],
    bannerColor: 'from-amber-950 via-red-950 to-neutral-950',
    posterBg: 'bg-gradient-to-br from-red-900 to-amber-950',
    videoUrl: SAMPLE_VIDEOS.thriller,
    audioTracks: [
      { id: 'en-dub', label: 'English (Studio Dub)', type: 'dubbed', language: 'en' },
      { id: 'es-orig', label: 'Spanish (Original Audio)', type: 'original', language: 'es' }
    ]
  },
  {
    id: 'eng-mov-3',
    title: 'Iron Fists of Seoul',
    originalTitle: 'Seoul Brawler',
    type: 'movie',
    language: 'english',
    subCategory: 'movie',
    year: 2024,
    rating: '18+',
    matchScore: 96,
    duration: '2h 05m',
    genres: ['Martial Arts', 'Action', 'Crime'],
    synopsis: 'A former underground kickboxing champion returns to Seoul to protect his younger sister from a ruthless real estate crime syndicate that controls the docks.',
    director: 'Park Chan-wook Style',
    cast: ['Min-jun Kang', 'David Miller', 'Hye-jin Song'],
    bannerColor: 'from-red-950 via-neutral-900 to-neutral-950',
    posterBg: 'bg-gradient-to-br from-rose-950 to-neutral-900',
    videoUrl: SAMPLE_VIDEOS.action,
    audioTracks: [
      { id: 'en-dub', label: 'English (Dynamic Dubbed)', type: 'dubbed', language: 'en' },
      { id: 'ko-orig', label: 'Korean (Original Audio)', type: 'original', language: 'ko' }
    ]
  },

  // English TV Shows
  {
    id: 'eng-tv-1',
    title: 'Cyber Syndicate: London',
    originalTitle: 'The Syndicate Grid',
    type: 'tv',
    language: 'english',
    subCategory: 'tv',
    year: 2024,
    rating: '16+',
    matchScore: 99,
    duration: 'Season 1 · 8 Episodes',
    genres: ['Crime', 'Drama', 'Tech Thriller'],
    synopsis: 'In an alternate London controlled by automated financial cartels, a rogue intelligence analyst discovers an encrypted backdoor capable of bankrupting whole nations. Watch episodes 1-5 free or unlock all episodes with Premium.',
    director: 'Oliver Hayes',
    cast: ['Christian Sterling', 'Maya Lin', 'Arthur Vance'],
    bannerColor: 'from-cyan-950 via-slate-900 to-neutral-950',
    posterBg: 'bg-gradient-to-br from-cyan-950 to-blue-950',
    videoUrl: SAMPLE_VIDEOS.thriller,
    episodes: makeEpisodes('eng-tv-1', 'Cyber Syndicate: London', 8),
    trending: true,
    audioTracks: [
      { id: 'en-orig', label: 'English (Original Audio)', type: 'original', language: 'en' }
    ]
  },
  {
    id: 'eng-tv-2',
    title: 'The Cartel Empire',
    originalTitle: 'Imperio del Valle',
    type: 'tv',
    language: 'english',
    subCategory: 'tv',
    year: 2023,
    rating: '18+',
    matchScore: 95,
    duration: 'Season 1 · 10 Episodes',
    genres: ['Action', 'Crime', 'Drama'],
    synopsis: 'The thrilling cross-border conflict between international DEA task forces and an elusive cartel heir who weaponized drone warfare. First 5 episodes free to download!',
    director: 'Mateo Gutierrez',
    cast: ['Gabriel Silva', 'Karen Reynolds', 'Victor Gomez'],
    bannerColor: 'from-orange-950 via-neutral-900 to-neutral-950',
    posterBg: 'bg-gradient-to-br from-amber-950 to-stone-900',
    videoUrl: SAMPLE_VIDEOS.action,
    episodes: makeEpisodes('eng-tv-2', 'The Cartel Empire', 10),
    audioTracks: [
      { id: 'en-dub', label: 'English (Studio Dubbed)', type: 'dubbed', language: 'en' },
      { id: 'es-orig', label: 'Spanish (Original Audio)', type: 'original', language: 'es' }
    ]
  },

  // ==================== FRENCH (DUBBED / VF) ====================
  // French Movies
  {
    id: 'fr-mov-1',
    title: 'Le Sanctuaire de Minuit',
    originalTitle: 'Midnight Sanctuary',
    type: 'movie',
    language: 'french',
    subCategory: 'movie',
    year: 2024,
    rating: '16+',
    matchScore: 97,
    duration: '2h 12m',
    genres: ['Action', 'Thriller', 'Policier'],
    synopsis: 'Un ancien agent des forces spéciales françaises retiré dans les Alpes doit reprendre les armes quand la fille de son ancien mentor est kidnappée par un réseau de mercenaires internationaux. Entièrement doublé en Français (VF).',
    director: 'Jean-Luc Moreau',
    cast: ['Benoît Laurent', 'Camille Delorme', 'Thierry Marchand'],
    bannerColor: 'from-blue-950 via-indigo-950 to-neutral-950',
    posterBg: 'bg-gradient-to-br from-blue-900 to-slate-900',
    videoUrl: SAMPLE_VIDEOS.action,
    featured: true,
    audioTracks: [
      { id: 'fr-dub', label: 'Français (Doublage Officiel VF)', type: 'dubbed', language: 'fr' },
      { id: 'en-orig', label: 'Anglais (Version Originale)', type: 'original', language: 'en' }
    ]
  },
  {
    id: 'fr-mov-2',
    title: 'Vengeance dans l\'Ombre',
    originalTitle: 'Shadow Wrath',
    type: 'movie',
    language: 'french',
    subCategory: 'movie',
    year: 2023,
    rating: '18+',
    matchScore: 93,
    duration: '1h 58m',
    genres: ['Arts Martiaux', 'Action', 'Suspense'],
    synopsis: 'Dans les bas-fonds de Marseille et Hong Kong, un détective d\'élite traque l\'assassin de son frère à travers des combats au corps à corps spectaculaires.',
    director: 'Alexandre Renoir',
    cast: ['Julien Favre', 'Mei-Ling Zhou', 'Eric Besson'],
    bannerColor: 'from-red-950 via-stone-900 to-neutral-950',
    posterBg: 'bg-gradient-to-br from-rose-950 to-stone-900',
    videoUrl: SAMPLE_VIDEOS.thriller,
    audioTracks: [
      { id: 'fr-dub', label: 'Français (Doublé en France)', type: 'dubbed', language: 'fr' },
      { id: 'zh-orig', label: 'Cantonais (Original)', type: 'original', language: 'zh' }
    ]
  },

  // French TV Shows
  {
    id: 'fr-tv-1',
    title: 'Code Marseille: Haute Tension',
    originalTitle: 'Marseille Blackout',
    type: 'tv',
    language: 'french',
    subCategory: 'tv',
    year: 2024,
    rating: '16+',
    matchScore: 96,
    duration: 'Saison 1 · 8 Épisodes',
    genres: ['Série Policière', 'Drame', 'Action'],
    synopsis: 'La brigade anticriminalité de la Côte d\'Azur fait face à une nouvelle coalition criminelle armée de drones tactiques. Téléchargez les 5 premiers épisodes gratuitement sur mobile!',
    director: 'Claire Fontaine',
    cast: ['Gilles Martin', 'Fatou Ndiaye', 'Lucas Girard'],
    bannerColor: 'from-teal-950 via-slate-900 to-neutral-950',
    posterBg: 'bg-gradient-to-br from-teal-950 to-blue-950',
    videoUrl: SAMPLE_VIDEOS.action,
    episodes: makeEpisodes('fr-tv-1', 'Code Marseille: Haute Tension', 8),
    trending: true,
    audioTracks: [
      { id: 'fr-orig', label: 'Français (Version Française VF)', type: 'original', language: 'fr' }
    ]
  },
  {
    id: 'fr-tv-2',
    title: 'Les Derniers Rescapés',
    originalTitle: 'The Last Survivors',
    type: 'tv',
    language: 'french',
    subCategory: 'tv',
    year: 2023,
    rating: '16+',
    matchScore: 92,
    duration: 'Saison 1 · 9 Épisodes',
    genres: ['Science-Fiction', 'Drame', 'Aventure'],
    synopsis: 'Après une pandémie mystérieuse, un groupe de survivants traverse l\'Europe pour atteindre une vallée alpine sécurisée. Doublé avec passion en français.',
    director: 'Marc Aubert',
    cast: ['Sebastien Roy', 'Elise Mercier', 'Antoine Dupont'],
    bannerColor: 'from-emerald-950 via-neutral-900 to-neutral-950',
    posterBg: 'bg-gradient-to-br from-emerald-950 to-neutral-950',
    videoUrl: SAMPLE_VIDEOS.thriller,
    episodes: makeEpisodes('fr-tv-2', 'Les Derniers Rescapés', 9),
    audioTracks: [
      { id: 'fr-dub', label: 'Français (Doublage Studio VF)', type: 'dubbed', language: 'fr' }
    ]
  },

  // ==================== SWAHILI (DJ TRANSLATED) ====================
  // Categorized by DJs' Names (DJ Afro, DJ Murphy, DJ Smith, DJ Ally B, DJ Black)
  {
    id: 'swa-afro-1',
    title: 'Commando ya Mwisho (Final Strike)',
    originalTitle: 'Extraction Commando',
    type: 'movie',
    language: 'swahili',
    subCategory: 'movie',
    djId: 'dj-afro',
    djName: 'DJ Afro Amigo',
    year: 2024,
    rating: '16+',
    matchScore: 99,
    duration: '2h 10m',
    genres: ['Action', 'Martial Arts', 'Adventure'],
    synopsis: 'Mwanajeshi mmoja mkakamavu anaingia msitu wa maadui kuokoa mateka bila kuomba msamaha. DJ Afro anakupa simulizi ya kusisimua ya pigo kwa pigo huku akiiga milio ya ngumi na risasi!',
    translationNotes: 'Simulizi maarufu na vichekesho vya DJ Afro Amigo na sauti ya pekee ya mapigo ya kung-fu.',
    bannerColor: 'from-red-950 via-amber-950 to-neutral-950',
    posterBg: 'bg-gradient-to-br from-red-800 to-amber-950',
    videoUrl: SAMPLE_VIDEOS.action,
    featured: true,
    trending: true,
    audioTracks: [
      { id: 'swa-dj-afro', label: 'Swahili Voiceover (DJ Afro Amigo Commentary)', type: 'dj_overlay', language: 'sw' },
      { id: 'orig', label: 'Original Film Audio (Without Commentary)', type: 'original', language: 'en' }
    ]
  },
  {
    id: 'swa-afro-2',
    title: 'Mpiganaji wa Upepo (The Wind Warrior)',
    originalTitle: 'Iron Dragon',
    type: 'movie',
    language: 'swahili',
    subCategory: 'movie',
    djId: 'dj-afro',
    djName: 'DJ Afro Amigo',
    year: 2023,
    rating: '16+',
    matchScore: 97,
    duration: '1h 54m',
    genres: ['Martial Arts', 'Action'],
    synopsis: 'Mwalimu wa siri wa Shaolin analazimika kurejea jukwaani baada ya kijiji chake kuvamiwa na kikundi cha majambazi hatari. DJ Afro akielezea hatua kwa hatua kwa uchangamfu usio kifani!',
    translationNotes: 'DJ Afro classic commentary with famous signature sound bites and audience banter.',
    bannerColor: 'from-amber-950 via-red-950 to-neutral-950',
    posterBg: 'bg-gradient-to-br from-amber-700 to-red-950',
    videoUrl: SAMPLE_VIDEOS.action,
    audioTracks: [
      { id: 'swa-dj-afro', label: 'Swahili DJ Voiceover (DJ Afro Amigo)', type: 'dj_overlay', language: 'sw' }
    ]
  },
  {
    id: 'swa-afro-tv-1',
    title: 'Mji wa Damu: Msimu wa 1',
    originalTitle: 'Blood City Chronicles',
    type: 'tv',
    language: 'swahili',
    subCategory: 'tv',
    djId: 'dj-afro',
    djName: 'DJ Afro Amigo',
    year: 2024,
    rating: '18+',
    matchScore: 98,
    duration: 'Msimu 1 · Sehemu 8 (Ep 1-8)',
    genres: ['Action', 'Crime', 'Drama'],
    synopsis: 'Mfululizo wa visa vya kusisimua vya magenge ya jiji yanayogombea eneo la bandari. Vipindi 1 hadi 5 unaweza kupakua bure kwa simu, vipindi vya 6 na kuendelea vimefungwa kwa ajili ya Subscription!',
    translationNotes: 'Full TV Show translated with signature DJ Afro episode recaps and cliffhanger hype.',
    bannerColor: 'from-red-950 via-stone-900 to-neutral-950',
    posterBg: 'bg-gradient-to-br from-red-900 to-stone-950',
    videoUrl: SAMPLE_VIDEOS.thriller,
    episodes: makeEpisodes('swa-afro-tv-1', 'Mji wa Damu', 8),
    trending: true,
    audioTracks: [
      { id: 'swa-afro', label: 'Swahili DJ Overlay (DJ Afro Amigo)', type: 'dj_overlay', language: 'sw' }
    ]
  },
  {
    id: 'swa-murphy-1',
    title: 'Upelelezi Gizani (Dark Investigator)',
    originalTitle: 'City of Shadows',
    type: 'movie',
    language: 'swahili',
    subCategory: 'movie',
    djId: 'dj-murphy',
    djName: 'DJ Murphy',
    year: 2024,
    rating: '16+',
    matchScore: 95,
    duration: '2h 04m',
    genres: ['Crime', 'Thriller', 'Mystery'],
    synopsis: 'Afisa wa upelelezi asiye na woga anakabiliana na mtandao wa siri wa wezi wa teknolojia. DJ Murphy akitoa sauti nzito yenye maelezo ya kina ya mitego ya wahalifu.',
    translationNotes: 'Simulizi ya kisasa na sauti ya DJ Murphy yenye msisimko wa kipekee wa kipelelezi.',
    bannerColor: 'from-emerald-950 via-slate-900 to-neutral-950',
    posterBg: 'bg-gradient-to-br from-emerald-900 to-teal-950',
    videoUrl: SAMPLE_VIDEOS.thriller,
    audioTracks: [
      { id: 'swa-murphy', label: 'Swahili Voiceover (DJ Murphy)', type: 'dj_overlay', language: 'sw' }
    ]
  },
  {
    id: 'swa-murphy-comedy',
    title: 'Vituko Vya Shaolin (Shaolin Laughs)',
    originalTitle: 'Shaolin Comic Heroes',
    type: 'movie',
    language: 'swahili',
    subCategory: 'movie',
    djId: 'dj-murphy',
    djName: 'DJ Murphy',
    year: 2024,
    rating: '13+',
    matchScore: 98,
    duration: '1h 48m',
    genres: ['Comedy', 'Martial Arts', 'Action'],
    synopsis: 'Wanafunzi wawili wa hekalu la Shaolin wenye vituko na uzembe wanajikuta wakitetea kijiji chao dhidi ya wezi wa kuku na majambazi wakorofi. DJ Murphy anakuvunja mbavu kwa vichekesho mwanzo mwisho!',
    translationNotes: 'DJ Murphy comedy special featuring hilarious East African street jokes and sound effects.',
    bannerColor: 'from-amber-950 via-emerald-950 to-neutral-950',
    posterBg: 'bg-gradient-to-br from-amber-700 to-emerald-950',
    videoUrl: SAMPLE_VIDEOS.action,
    featured: true,
    trending: true,
    audioTracks: [
      { id: 'swa-murphy-com', label: 'Swahili Comedy Voiceover (DJ Murphy)', type: 'dj_overlay', language: 'sw' }
    ]
  },
  {
    id: 'music-ost-1',
    title: 'East Africa Cinema Beats & Bongo Flava Soundtracks',
    originalTitle: 'CinePulse Studio Anthems Vol 1',
    type: 'movie',
    language: 'swahili',
    subCategory: 'movie',
    year: 2024,
    rating: 'All',
    matchScore: 99,
    duration: '1h 30m',
    genres: ['Music', 'Soundtrack', 'Afrobeats'],
    synopsis: 'Mkusanyiko maalum wa midundo ya filamu, vibao vya Bongo Flava, amapiano na sauti za kitamaduni zinazopatikana kwenye filamu maarufu za DJ Afro na Agasobanuye.',
    bannerColor: 'from-purple-950 via-rose-950 to-neutral-950',
    posterBg: 'bg-gradient-to-br from-purple-900 to-rose-950',
    videoUrl: SAMPLE_VIDEOS.thriller,
    featured: true,
    trending: true,
    audioTracks: [
      { id: 'ost-audio', label: 'High Fidelity Cinema Master Audio', type: 'original', language: 'sw' }
    ]
  },
  {
    id: 'swa-smith-1',
    title: 'Vita vya Sayari Mpya (Galaxy Vanguard)',
    originalTitle: 'Vanguard 2099',
    type: 'movie',
    language: 'swahili',
    subCategory: 'movie',
    djId: 'dj-smith',
    djName: 'DJ Smith',
    year: 2024,
    rating: '13+',
    matchScore: 94,
    duration: '2h 15m',
    genres: ['Sci-Fi', 'Action', 'Adventure'],
    synopsis: 'Manowari ya anga ya binadamu inavamiwa na roboti wa siku za usoni. DJ Smith anaeleza teknolojia ya laser na silaha za angani kwa Kiswahili fasaha na vichekesho vya kibabe!',
    translationNotes: 'DJ Smith sci-fi translated edition with futuristic audio dynamics.',
    bannerColor: 'from-blue-950 via-indigo-950 to-neutral-950',
    posterBg: 'bg-gradient-to-br from-blue-900 to-indigo-950',
    videoUrl: SAMPLE_VIDEOS.action,
    audioTracks: [
      { id: 'swa-smith', label: 'Swahili DJ Voiceover (DJ Smith)', type: 'dj_overlay', language: 'sw' }
    ]
  },
  {
    id: 'swa-ally-b-1',
    title: 'Mtego wa Bahari (Ocean Trap)',
    originalTitle: 'Deep Waters',
    type: 'movie',
    language: 'swahili',
    subCategory: 'movie',
    djId: 'dj-ally-b',
    djName: 'DJ Ally B',
    year: 2023,
    rating: '16+',
    matchScore: 91,
    duration: '1h 50m',
    genres: ['Action', 'Thriller', 'Drama'],
    synopsis: 'Mzamiaji shujaa anapambana na maharamia wa bahari ya Hindi walioteka meli ya mizigo. Simulizi yenye hisia kali kutoka kwa DJ Ally B.',
    translationNotes: 'Emotional pacing and high-energy narration by DJ Ally B.',
    bannerColor: 'from-orange-950 via-yellow-950 to-neutral-950',
    posterBg: 'bg-gradient-to-br from-orange-800 to-amber-950',
    videoUrl: SAMPLE_VIDEOS.thriller,
    audioTracks: [
      { id: 'swa-ally', label: 'Swahili Voiceover (DJ Ally B)', type: 'dj_overlay', language: 'sw' }
    ]
  },
  {
    id: 'swa-black-1',
    title: 'Kisasi cha Ninja (Revenge of the Blade)',
    originalTitle: 'Shadow Assassin',
    type: 'movie',
    language: 'swahili',
    subCategory: 'movie',
    djId: 'dj-black',
    djName: 'DJ Black',
    year: 2024,
    rating: '18+',
    matchScore: 96,
    duration: '2h 00m',
    genres: ['Action', 'Martial Arts'],
    synopsis: 'Muuaji wa zamani anarejea kulinda heshima ya koo yake dhidi ya majenerali wafisadi. DJ Black anapiga milio ya mikuki na mapanga kwa mbwembwe za ajabu.',
    translationNotes: 'High-octane sound effects and blade duel translation by DJ Black.',
    bannerColor: 'from-purple-950 via-neutral-900 to-neutral-950',
    posterBg: 'bg-gradient-to-br from-purple-900 to-neutral-950',
    videoUrl: SAMPLE_VIDEOS.action,
    audioTracks: [
      { id: 'swa-black', label: 'Swahili DJ Voiceover (DJ Black)', type: 'dj_overlay', language: 'sw' }
    ]
  },

  // ==================== KINYARWANDA (AGASOBANUYE TRANSLATED) ====================
  // Categorized by DJs' Names (Junior Giti, Rocky Kimomo, Savimbi, DJ Young, Chris, Sankara)
  {
    id: 'kin-junior-1',
    title: 'Intwari yo ku Rugamba (The Trench Warrior)',
    originalTitle: 'Frontline Vengeance',
    type: 'movie',
    language: 'kinyarwanda',
    subCategory: 'movie',
    djId: 'junior-giti',
    djName: 'Junior Giti',
    year: 2024,
    rating: '16+',
    matchScore: 99,
    duration: '2h 22m',
    genres: ['Action', 'War', 'Drama'],
    synopsis: 'Filime y\'amateka y\'umusirikare wari wenyine watsinze umutwe wose w\'ingabo zateye igihugu cye. Junior Giti ayishyira mu Kinyarwanda cy\'umwimerere cyuzuyemo inyigisho n\'ubutwari buhebuje! (Giti Productions)',
    translationNotes: 'Agasobanuye k\'umwimerere gasobanuwe na Junior Giti. Ijwi rihebuje, amagambo yuje ubuhanga n\'ubusizi.',
    bannerColor: 'from-rose-950 via-red-950 to-neutral-950',
    posterBg: 'bg-gradient-to-br from-rose-900 to-red-950',
    videoUrl: SAMPLE_VIDEOS.action,
    featured: true,
    trending: true,
    audioTracks: [
      { id: 'kin-giti', label: 'Kinyarwanda Agasobanuye (Junior Giti Voiceover)', type: 'dj_overlay', language: 'rw' },
      { id: 'orig', label: 'Original Film Audio (Without Commentary)', type: 'original', language: 'en' }
    ]
  },
  {
    id: 'kin-junior-tv-1',
    title: 'Ubwami bw\'Abacuruzi b\'Intwaro (The Syndicate)',
    originalTitle: 'Arms Syndicate',
    type: 'tv',
    language: 'kinyarwanda',
    subCategory: 'tv',
    djId: 'junior-giti',
    djName: 'Junior Giti',
    year: 2024,
    rating: '18+',
    matchScore: 98,
    duration: 'Season 1 · Episodes 1-8',
    genres: ['Crime', 'Action', 'Drama'],
    synopsis: 'Uruhererekane rwa seriye itangaje igaragaza uko amatsinda y\'abanyabyaha akorana n\'abayobozi bakomeye. Ibyiciro 1 kugeza kuri 5 biraboneka ku buntu (Free Mobile Download), ibindi byiciro biboneka kuri Subscription gusa!',
    translationNotes: 'Agasobanuye ka Seriye yose gasobanuwe na Junior Giti umunsi ku munsi.',
    bannerColor: 'from-red-950 via-slate-900 to-neutral-950',
    posterBg: 'bg-gradient-to-br from-red-950 to-neutral-900',
    videoUrl: SAMPLE_VIDEOS.thriller,
    episodes: makeEpisodes('kin-junior-tv-1', 'Ubwami bw\'Abacuruzi', 8),
    trending: true,
    audioTracks: [
      { id: 'kin-giti', label: 'Kinyarwanda Agasobanuye (Junior Giti)', type: 'dj_overlay', language: 'rw' }
    ]
  },
  {
    id: 'kin-rocky-1',
    title: 'Umugabo w\'Isezerano (The Iron Vow)',
    originalTitle: 'Blood Contract',
    type: 'movie',
    language: 'kinyarwanda',
    subCategory: 'movie',
    djId: 'rocky-kimomo',
    djName: 'Rocky Kimomo',
    year: 2024,
    rating: '16+',
    matchScore: 99,
    duration: '2h 08m',
    genres: ['Action', 'Comedy', 'Thriller'],
    synopsis: 'Umukozi w\'inzego z\'umutekano waruhutse aza gutungurwa no kubona umukiriya yari ashinzwe kurinda yatewe n\'abajura b\'intarumikwa. Rocky Kimomo akoresha amagambo ye azwi cyane n\'urwenya rurura!',
    translationNotes: 'Rock Entertainment blockbuster voiceover. Full of comedic punchlines, modern slang and iconic hype commentary.',
    bannerColor: 'from-yellow-950 via-amber-950 to-neutral-950',
    posterBg: 'bg-gradient-to-br from-amber-600 to-yellow-950',
    videoUrl: SAMPLE_VIDEOS.action,
    featured: true,
    trending: true,
    audioTracks: [
      { id: 'kin-rocky', label: 'Kinyarwanda Agasobanuye (Rocky Kimomo)', type: 'dj_overlay', language: 'rw' }
    ]
  },
  {
    id: 'kin-rocky-2',
    title: 'Imirwano yo mu Mujyi (Street Rumble)',
    originalTitle: 'Underground Fist',
    type: 'movie',
    language: 'kinyarwanda',
    subCategory: 'movie',
    djId: 'rocky-kimomo',
    djName: 'Rocky Kimomo',
    year: 2023,
    rating: '16+',
    matchScore: 96,
    duration: '1h 52m',
    genres: ['Martial Arts', 'Comedy', 'Action'],
    synopsis: 'Igihe abateramakofe babiri bahuraga mu mukino w\'amafaranga menshi, ntawakwiraririye! Rocky Kimomo abasobanurira imirwano n\'amagambo asetsa cyane.',
    translationNotes: 'Rocky Kimomo classic martial arts interpretation with famous catchphrases.',
    bannerColor: 'from-amber-950 via-orange-950 to-neutral-950',
    posterBg: 'bg-gradient-to-br from-yellow-700 to-neutral-950',
    videoUrl: SAMPLE_VIDEOS.action,
    audioTracks: [
      { id: 'kin-rocky', label: 'Kinyarwanda Agasobanuye (Rocky Kimomo)', type: 'dj_overlay', language: 'rw' }
    ]
  },
  {
    id: 'kin-savimbi-1',
    title: 'Igikuba Cyacitse mu Ishyamba (Jungle Extraction)',
    originalTitle: 'Jungle Breach',
    type: 'movie',
    language: 'kinyarwanda',
    subCategory: 'movie',
    djId: 'savimbi',
    djName: 'Savimbi',
    year: 2024,
    rating: '18+',
    matchScore: 94,
    duration: '2h 14m',
    genres: ['Action', 'War', 'Suspense'],
    synopsis: 'Ingabo zidasanzwe zoherejwe mu mashyamba ya Amazone gutabara abashakashatsi batwawe n\'umutwe witwaje imbunda. Savimbi asobanura iby\'imbunda, imitego n\'ingamba za gisirikare.',
    translationNotes: 'Savimbi\'s tactical voiceover breakdown of military tactics and weapon models.',
    bannerColor: 'from-cyan-950 via-slate-900 to-neutral-950',
    posterBg: 'bg-gradient-to-br from-cyan-900 to-blue-950',
    videoUrl: SAMPLE_VIDEOS.thriller,
    audioTracks: [
      { id: 'kin-savimbi', label: 'Kinyarwanda Agasobanuye (Savimbi)', type: 'dj_overlay', language: 'rw' }
    ]
  },
  {
    id: 'kin-young-1',
    title: 'Master wa Kung-Fu (Shaolin Legacy)',
    originalTitle: 'Shaolin Reborn',
    type: 'movie',
    language: 'kinyarwanda',
    subCategory: 'movie',
    djId: 'dj-young',
    djName: 'DJ Young',
    year: 2024,
    rating: '13+',
    matchScore: 93,
    duration: '1h 48m',
    genres: ['Martial Arts', 'Action'],
    synopsis: 'Umusore wari uzi iby\'ikoranabuhanga aza kujya mu misozi kwiga kung-fu ngo arokore umuryango we. DJ Young arayisobanura n\'imbaraga nyinshi zikurura urubyiruko.',
    translationNotes: 'Modern dynamic voiceover by DJ Young with fast-paced fighting effects.',
    bannerColor: 'from-violet-950 via-purple-950 to-neutral-950',
    posterBg: 'bg-gradient-to-br from-purple-800 to-indigo-950',
    videoUrl: SAMPLE_VIDEOS.action,
    audioTracks: [
      { id: 'kin-young', label: 'Kinyarwanda Agasobanuye (DJ Young)', type: 'dj_overlay', language: 'rw' }
    ]
  },
  {
    id: 'kin-chris-1',
    title: 'Ibanga rya Polisi (The Mole Inside)',
    originalTitle: 'Internal Secrets',
    type: 'movie',
    language: 'kinyarwanda',
    subCategory: 'movie',
    djId: 'chris',
    djName: 'Chris',
    year: 2023,
    rating: '16+',
    matchScore: 92,
    duration: '2h 02m',
    genres: ['Crime', 'Mystery', 'Drama'],
    synopsis: 'Iperereza rikomeye rishinja umuyobozi wa polisi gukorana n\'abacuruzi b\'ibiyobyabwenge. Chris asobanura buri kimenyetso n\'ibanga byose mu buryo bwo gushishikaza.',
    translationNotes: 'Chris mystery-focused Agasobanuye with articulate narrative exposition.',
    bannerColor: 'from-emerald-950 via-teal-950 to-neutral-950',
    posterBg: 'bg-gradient-to-br from-emerald-900 to-neutral-950',
    videoUrl: SAMPLE_VIDEOS.thriller,
    audioTracks: [
      { id: 'kin-chris', label: 'Kinyarwanda Agasobanuye (Chris)', type: 'dj_overlay', language: 'rw' }
    ]
  },
  {
    id: 'kin-sankara-1',
    title: 'Iherezo ry\'Umwijima (Dark Horizon)',
    originalTitle: 'Operation Midnight',
    type: 'movie',
    language: 'kinyarwanda',
    subCategory: 'movie',
    djId: 'sankara',
    djName: 'Sankara',
    year: 2024,
    rating: '18+',
    matchScore: 95,
    duration: '2h 06m',
    genres: ['Action', 'Thriller'],
    synopsis: 'Igitero cya gisirikare mu birindiro by\'umwanzi mu ijoro ry\'icuraburindi. Sankara arayisobanura vuba na vuba n\'umurindi udasanzwe!',
    translationNotes: 'Sankara high-speed chase and tactical action voiceover translation.',
    bannerColor: 'from-pink-950 via-rose-950 to-neutral-950',
    posterBg: 'bg-gradient-to-br from-pink-900 to-rose-950',
    videoUrl: SAMPLE_VIDEOS.action,
    audioTracks: [
      { id: 'kin-sankara', label: 'Kinyarwanda Agasobanuye (Sankara)', type: 'dj_overlay', language: 'rw' }
    ]
  }
];

export const SUBSCRIPTION_PLANS: Record<SubscriptionTier, UserSubscription> = {
  free: {
    tier: 'free',
    planName: 'Free Mobile Tier',
    price: '$0',
    currency: 'USD',
    currencyLabel: 'USD / Free Tier',
    resolutionLimit: '480p',
    maxDownloadsPerSeries: 5,
    adSupported: true,
    devicesAllowed: 1,
    billingCycle: 'monthly'
  },
  pro_usd: {
    tier: 'pro_usd',
    planName: 'Pro USD',
    price: '$3',
    currency: 'USD',
    currencyLabel: 'US Dollars ($3)',
    resolutionLimit: '4k',
    maxDownloadsPerSeries: 'unlimited',
    adSupported: false,
    devicesAllowed: 4,
    billingCycle: 'monthly'
  },
  pro_bif: {
    tier: 'pro_bif',
    planName: 'Pro BIF',
    price: '6,000 BIF',
    currency: 'BIF',
    currencyLabel: 'Burundian Franc (6,000 BIF)',
    resolutionLimit: '4k',
    maxDownloadsPerSeries: 'unlimited',
    adSupported: false,
    devicesAllowed: 4,
    billingCycle: 'monthly'
  },
  pro_tzs: {
    tier: 'pro_tzs',
    planName: 'Pro TZS',
    price: '3,000 Tsh',
    currency: 'TZS',
    currencyLabel: 'Tanzanian Shilling (3,000 Tsh)',
    resolutionLimit: '4k',
    maxDownloadsPerSeries: 'unlimited',
    adSupported: false,
    devicesAllowed: 4,
    billingCycle: 'monthly'
  }
};

export const INITIAL_DOWNLOADS: import('../types').DownloadedItem[] = [
  {
    id: 'dl-kin-junior-tv-1-ep-1',
    mediaId: 'kin-junior-tv-1',
    mediaTitle: 'Ubwami bw\'Abacuruzi b\'Intwaro (The Syndicate)',
    episodeId: 'kin-junior-tv-1-ep-1',
    episodeNumber: 1,
    seasonNumber: 1,
    itemType: 'episode',
    title: 'Episode 1: The Reckoning',
    subTitle: 'Agasobanuye by Junior Giti · S1:E1',
    language: 'kinyarwanda',
    djName: 'Junior Giti',
    fileSizeMb: 245,
    quality: '480p',
    downloadedAt: 'Yesterday',
    progress: 100,
    isComplete: true,
    videoUrl: SAMPLE_VIDEOS.thriller
  },
  {
    id: 'dl-kin-junior-tv-1-ep-2',
    mediaId: 'kin-junior-tv-1',
    mediaTitle: 'Ubwami bw\'Abacuruzi b\'Intwaro (The Syndicate)',
    episodeId: 'kin-junior-tv-1-ep-2',
    episodeNumber: 2,
    seasonNumber: 1,
    itemType: 'episode',
    title: 'Episode 2: Shadows in the Mist',
    subTitle: 'Agasobanuye by Junior Giti · S1:E2',
    language: 'kinyarwanda',
    djName: 'Junior Giti',
    fileSizeMb: 260,
    quality: '480p',
    downloadedAt: 'Yesterday',
    progress: 100,
    isComplete: true,
    videoUrl: SAMPLE_VIDEOS.action
  },
  {
    id: 'dl-swa-afro-1',
    mediaId: 'swa-afro-1',
    mediaTitle: 'Commando ya Mwisho (Final Strike)',
    itemType: 'movie',
    title: 'Commando ya Mwisho',
    subTitle: 'DJ Afro Amigo Swahili Translation · 2h 10m',
    language: 'swahili',
    djName: 'DJ Afro Amigo',
    fileSizeMb: 480,
    quality: '480p',
    downloadedAt: '2 days ago',
    progress: 100,
    isComplete: true,
    videoUrl: SAMPLE_VIDEOS.action
  },
  {
    id: 'dl-kin-junior-tv-1-ep-6',
    mediaId: 'kin-junior-tv-1',
    mediaTitle: 'Ubwami bw\'Abacuruzi b\'Intwaro (The Syndicate)',
    episodeId: 'kin-junior-tv-1-ep-6',
    episodeNumber: 6,
    seasonNumber: 1,
    itemType: 'episode',
    title: 'Episode 6: Midnight Siege [VIP]',
    subTitle: 'Agasobanuye by Junior Giti · S1:E6',
    language: 'kinyarwanda',
    djName: 'Junior Giti',
    fileSizeMb: 330,
    quality: '4k',
    downloadedAt: '3 days ago',
    progress: 100,
    isComplete: true,
    videoUrl: SAMPLE_VIDEOS.thriller,
    isProTierOnly: true,
    accountEmail: 'pro.subscriber@cinepulse.io'
  }
];

export const INITIAL_WATCHLIST: WatchlistItem[] = [
  {
    id: 'wl-swa-afro-1',
    mediaId: 'swa-afro-1',
    itemType: 'movie',
    title: 'Commando ya Mwisho (Final Strike)',
    subTitle: 'DJ Afro Amigo Swahili Commentary',
    mediaTitle: 'Commando ya Mwisho',
    language: 'swahili',
    djName: 'DJ Afro Amigo',
    posterBg: 'bg-gradient-to-br from-red-800 to-amber-950',
    bannerColor: 'from-red-950 via-amber-950 to-neutral-950',
    matchScore: 99,
    duration: '2h 10m',
    year: 2024,
    rating: '16+',
    genres: ['Action', 'Martial Arts'],
    addedAt: 'Yesterday',
    videoUrl: SAMPLE_VIDEOS.action
  },
  {
    id: 'wl-kin-junior-tv-1-ep-3',
    mediaId: 'kin-junior-tv-1',
    itemType: 'episode',
    title: 'Episode 3: The Ambush',
    subTitle: 'Agasobanuye by Junior Giti · S1:E3',
    mediaTitle: 'Ubwami bw\'Abacuruzi b\'Intwaro',
    episodeId: 'kin-junior-tv-1-ep-3',
    episodeNumber: 3,
    seasonNumber: 1,
    language: 'kinyarwanda',
    djName: 'Junior Giti',
    posterBg: 'bg-gradient-to-br from-neutral-800 to-rose-950',
    bannerColor: 'from-rose-950 via-neutral-900 to-neutral-950',
    matchScore: 98,
    duration: '48m',
    year: 2024,
    rating: '18+',
    genres: ['Crime', 'Action'],
    addedAt: 'Today',
    videoUrl: SAMPLE_VIDEOS.thriller
  }
];

export const INITIAL_CONTINUE_WATCHING: ContinueWatchingItem[] = [
  {
    id: 'cw-swa-afro-1',
    mediaId: 'swa-afro-1',
    itemType: 'movie',
    title: 'Commando ya Mwisho (Final Strike)',
    subTitle: 'DJ Afro Amigo · 35m remaining',
    mediaTitle: 'Commando ya Mwisho',
    language: 'swahili',
    djName: 'DJ Afro Amigo',
    posterBg: 'bg-gradient-to-br from-red-800 to-amber-950',
    bannerColor: 'from-red-950 via-amber-950 to-neutral-950',
    currentTimeSeconds: 4320, // 1h 12m
    durationSeconds: 7800, // 2h 10m
    progressPercent: 55,
    lastWatchedAt: '2 hours ago',
    videoUrl: SAMPLE_VIDEOS.action
  },
  {
    id: 'cw-kin-junior-tv-1-ep-2',
    mediaId: 'kin-junior-tv-1',
    itemType: 'episode',
    title: 'Episode 2: Shadows in the Mist',
    subTitle: 'Ubwami · S1:E2 · 19m left',
    mediaTitle: 'Ubwami bw\'Abacuruzi b\'Intwaro',
    episodeId: 'kin-junior-tv-1-ep-2',
    episodeNumber: 2,
    seasonNumber: 1,
    language: 'kinyarwanda',
    djName: 'Junior Giti',
    posterBg: 'bg-gradient-to-br from-neutral-800 to-rose-950',
    bannerColor: 'from-rose-950 via-neutral-900 to-neutral-950',
    currentTimeSeconds: 1560, // 26m
    durationSeconds: 2700, // 45m
    progressPercent: 58,
    lastWatchedAt: 'Yesterday',
    videoUrl: SAMPLE_VIDEOS.action
  },
  {
    id: 'cw-eng-tv-1-ep-1',
    mediaId: 'eng-tv-1',
    itemType: 'episode',
    title: 'Episode 1: The Reckoning',
    subTitle: 'Cyber Syndicate: London · 26m left',
    mediaTitle: 'Cyber Syndicate: London',
    episodeId: 'eng-tv-1-ep-1',
    episodeNumber: 1,
    seasonNumber: 1,
    language: 'english',
    posterBg: 'bg-gradient-to-br from-cyan-950 to-blue-950',
    bannerColor: 'from-cyan-950 via-slate-900 to-neutral-950',
    currentTimeSeconds: 960, // 16m
    durationSeconds: 2520, // 42m
    progressPercent: 38,
    lastWatchedAt: '3 days ago',
    videoUrl: SAMPLE_VIDEOS.thriller
  }
];

export const TOP_10_SEARCHES: TopSearchItem[] = [
  {
    rank: 1,
    id: 'top-1',
    mediaId: 'swa-afro-1',
    title: 'Commando ya Mwisho (Final Strike)',
    category: 'movie',
    categoryLabel: 'Movie · Action',
    subtitle: 'DJ Afro Amigo Voiceover · 99% Match',
    searchesCount: '1.4M searches',
    posterBg: 'bg-gradient-to-br from-red-800 to-amber-950',
    djName: 'DJ Afro Amigo',
    videoUrl: SAMPLE_VIDEOS.action
  },
  {
    rank: 2,
    id: 'top-2',
    mediaId: 'kin-junior-tv-1',
    title: 'Ubwami bw\'Abacuruzi (The Syndicate)',
    category: 'series',
    categoryLabel: 'TV Series · Agasobanuye',
    subtitle: 'Junior Giti · 8 Episodes · 98% Match',
    searchesCount: '980K searches',
    posterBg: 'bg-gradient-to-br from-neutral-800 to-rose-950',
    djName: 'Junior Giti',
    videoUrl: SAMPLE_VIDEOS.thriller
  },
  {
    rank: 3,
    id: 'top-3',
    mediaId: 'swa-murphy-comedy',
    title: 'Vituko Vya Shaolin (Shaolin Laughs)',
    category: 'comedy',
    categoryLabel: 'Comedy · Kung Fu Humor',
    subtitle: 'DJ Murphy Comedy Commentary · 98% Match',
    searchesCount: '870K searches',
    posterBg: 'bg-gradient-to-br from-amber-700 to-emerald-950',
    djName: 'DJ Murphy',
    videoUrl: SAMPLE_VIDEOS.action
  },
  {
    rank: 4,
    id: 'top-4',
    mediaId: 'music-ost-1',
    title: 'East Africa Cinema Beats & Bongo Flava',
    category: 'music',
    categoryLabel: 'Music · Soundtracks',
    subtitle: 'CinePulse Studio Anthems & Film Mixes',
    searchesCount: '760K searches',
    posterBg: 'bg-gradient-to-br from-purple-900 to-rose-950',
    videoUrl: SAMPLE_VIDEOS.thriller
  },
  {
    rank: 5,
    id: 'top-5',
    mediaId: 'eng-tv-1',
    title: 'Cyber Syndicate: London',
    category: 'series',
    categoryLabel: 'TV Series · Tech Thriller',
    subtitle: 'English Studio Dub · 4K UHD · 99% Match',
    searchesCount: '690K searches',
    posterBg: 'bg-gradient-to-br from-cyan-950 to-blue-950',
    videoUrl: SAMPLE_VIDEOS.thriller
  },
  {
    rank: 6,
    id: 'top-6',
    mediaId: 'kin-rocky-1',
    title: 'Umugabo w\'Isezerano (The Iron Vow)',
    category: 'comedy',
    categoryLabel: 'Comedy & Action · Agasobanuye',
    subtitle: 'Rocky Kimomo Voiceover · 99% Match',
    searchesCount: '630K searches',
    posterBg: 'bg-gradient-to-br from-amber-600 to-yellow-950',
    djName: 'Rocky Kimomo',
    videoUrl: SAMPLE_VIDEOS.action
  },
  {
    rank: 7,
    id: 'top-7',
    mediaId: 'fr-action-1',
    title: 'La Nuit Écarlate (Crimson Night)',
    category: 'movie',
    categoryLabel: 'Film · Version Française (VF)',
    subtitle: 'Action & Thriller · 97% Match',
    searchesCount: '570K searches',
    posterBg: 'bg-gradient-to-br from-indigo-950 to-neutral-900',
    videoUrl: SAMPLE_VIDEOS.action
  },
  {
    rank: 8,
    id: 'top-8',
    mediaId: 'swa-afro-2',
    title: 'Mpiganaji wa Upepo (The Wind Warrior)',
    category: 'movie',
    categoryLabel: 'Movie · Martial Arts',
    subtitle: 'DJ Afro Amigo Commentary · 97% Match',
    searchesCount: '520K searches',
    posterBg: 'bg-gradient-to-br from-amber-700 to-red-950',
    djName: 'DJ Afro Amigo',
    videoUrl: SAMPLE_VIDEOS.action
  },
  {
    rank: 9,
    id: 'top-9',
    mediaId: 'music-ost-2',
    title: 'Kigali & Nairobi Urban Cinema Anthems',
    category: 'music',
    categoryLabel: 'Music · Original Score',
    subtitle: 'Top Film Scores, Instrumental & Beats',
    searchesCount: '480K searches',
    posterBg: 'bg-gradient-to-br from-pink-900 to-amber-950',
    videoUrl: SAMPLE_VIDEOS.thriller
  },
  {
    rank: 10,
    id: 'top-10',
    mediaId: 'swa-afro-tv-1',
    title: 'Mji wa Damu (Blood City Chronicles)',
    category: 'series',
    categoryLabel: 'TV Series · Swahili Action',
    subtitle: 'DJ Afro Amigo · Ep 1-8 · 98% Match',
    searchesCount: '440K searches',
    posterBg: 'bg-gradient-to-br from-red-900 to-stone-950',
    djName: 'DJ Afro Amigo',
    videoUrl: SAMPLE_VIDEOS.thriller
  }
];

