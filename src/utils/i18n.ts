import { AppLanguage } from '../types';

export interface TranslationStrings {
  settings: string;
  theme: string;
  darkMode: string;
  lightMode: string;
  languageSettings: string;
  selectLanguage: string;
  english: string;
  swahili: string;
  french: string;
  account: string;
  loggedInAs: string;
  login: string;
  logout: string;
  createAccount: string;
  emailAddress: string;
  password: string;
  emailOnlyNotice: string;
  passwordWarning: string;
  singleDeviceTitle: string;
  singleDeviceDesc: string;
  currentDevice: string;
  activeSession: string;
  simulateSecondDevice: string;
  sessionTerminatedTitle: string;
  sessionTerminatedDesc: string;
  relogin: string;
  allCinema: string;
  englishDubbed: string;
  frenchVF: string;
  swahiliDjs: string;
  agasobanuye: string;
  downloads: string;
  searchPlaceholder: string;
  freeTierBadge: string;
  upgradeToPro: string;
  saveChanges: string;
  close: string;
}

export const TRANSLATIONS: Record<AppLanguage, TranslationStrings> = {
  en: {
    settings: 'Settings',
    theme: 'Appearance Theme',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    languageSettings: 'Language Settings',
    selectLanguage: 'Choose App Interface Language',
    english: 'English (Default)',
    swahili: 'Kiswahili (Swahili)',
    french: 'Français (French)',
    account: 'Account & Security',
    loggedInAs: 'Logged in as',
    login: 'Log In',
    logout: 'Log Out',
    createAccount: 'Sign In / Create Account',
    emailAddress: 'Email Address',
    password: 'Password',
    emailOnlyNotice: 'Direct email login only. No social media tracking.',
    passwordWarning: "It's highly recommended to not use the same password you use on other sites. Please create new password.",
    singleDeviceTitle: 'Single Device Protection',
    singleDeviceDesc: 'Your account can only be active on one device at a time. Logging in from another device immediately signs out the first device.',
    currentDevice: 'Current Device',
    activeSession: 'Active Device Session',
    simulateSecondDevice: 'Simulate 2nd Device Sign-In',
    sessionTerminatedTitle: 'Session Terminated on This Device',
    sessionTerminatedDesc: 'Another device has signed in with your account. To protect your security and subscription, simultaneous access is restricted to 1 device.',
    relogin: 'Sign Back In Here',
    allCinema: 'All Cinema',
    englishDubbed: 'English Dubbed',
    frenchVF: 'Français (VF)',
    swahiliDjs: 'Swahili DJs',
    agasobanuye: 'Agasobanuye',
    downloads: 'Downloads',
    searchPlaceholder: 'Search titles, DJs, genres...',
    freeTierBadge: 'Free Tier',
    upgradeToPro: 'Upgrade to Pro',
    saveChanges: 'Save Changes',
    close: 'Close'
  },
  sw: {
    settings: 'Mipangilio',
    theme: 'Muonekano wa Skrini',
    darkMode: 'Hali ya Giza (Dark Mode)',
    lightMode: 'Hali ya Mchana (Light Mode)',
    languageSettings: 'Lugha ya Programu',
    selectLanguage: 'Chagua Lugha ya Kutumia',
    english: 'Kiingereza (English)',
    swahili: 'Kiswahili',
    french: 'Kifaransa (Français)',
    account: 'Akaunti na Usalama',
    loggedInAs: 'Umeingia kama',
    login: 'Ingia (Log In)',
    logout: 'Ondoka (Log Out)',
    createAccount: 'Jisajili / Fungua Akaunti',
    emailAddress: 'Barua Pepe (Email)',
    password: 'Nenosiri (Password)',
    emailOnlyNotice: 'Kuingia kwa barua pepe tu. Hakuna mitandao ya kijamii.',
    passwordWarning: "Inapendekezwa sana kutotumia nenosiri lilelile unalotumia kwenye tovuti nyingine. Tafadhali tengeneza nenosiri jipya.",
    singleDeviceTitle: 'Ulinzi wa Kifaa Kimoja',
    singleDeviceDesc: 'Akaunti yako inaweza kutumika kwenye kifaa kimoja tu kwa wakati mmoja. Kuingia kwenye kifaa kingine kutakutoa mara moja kwenye kifaa hiki.',
    currentDevice: 'Kifaa Hiki',
    activeSession: 'Kifaa Kinachotumika Sasa',
    simulateSecondDevice: 'Jaribu Kuingia Kifaa cha 2',
    sessionTerminatedTitle: 'Umetolewa Kwenye Kifaa Hiki',
    sessionTerminatedDesc: 'Kifaa kingine kimeingia kwenye akaunti yako. Kwa usalama wako, akaunti inaruhusiwa kutumika kwenye kifaa kimoja tu.',
    relogin: 'Ingia Tena Hapa',
    allCinema: 'Filamu Zote',
    englishDubbed: 'Kiingereza (Dubbed)',
    frenchVF: 'Kifaransa (VF)',
    swahiliDjs: 'DJs wa Kiswahili',
    agasobanuye: 'Agasobanuye',
    downloads: 'Zilizopakuliwa',
    searchPlaceholder: 'Tafuta filamu, DJ, aina...',
    freeTierBadge: 'Bure (Free)',
    upgradeToPro: 'Jiunge na Pro',
    saveChanges: 'Hifadhi Mipangilio',
    close: 'Funga'
  },
  fr: {
    settings: 'Paramètres',
    theme: 'Thème d\'Affichage',
    darkMode: 'Mode Sombre',
    lightMode: 'Mode Clair',
    languageSettings: 'Langue de l\'Application',
    selectLanguage: 'Choisir la langue de l\'interface',
    english: 'Anglais (English)',
    swahili: 'Swahili (Kiswahili)',
    french: 'Français',
    account: 'Compte & Sécurité',
    loggedInAs: 'Connecté en tant que',
    login: 'Connexion',
    logout: 'Déconnexion',
    createAccount: 'Créer un Compte',
    emailAddress: 'Adresse Email',
    password: 'Mot de Passe',
    emailOnlyNotice: 'Connexion directe par email uniquement. Aucun réseau social.',
    passwordWarning: "Il est fortement recommandé de ne pas utiliser le même mot de passe que sur d'autres sites. Veuillez créer un nouveau mot de passe.",
    singleDeviceTitle: 'Protection Appareil Unique',
    singleDeviceDesc: 'Votre compte ne peut être actif que sur un seul appareil à la fois. Toute connexion depuis un second appareil déconnecte automatiquement le premier.',
    currentDevice: 'Appareil Actuel',
    activeSession: 'Session Active',
    simulateSecondDevice: 'Simuler Connexion 2ème Appareil',
    sessionTerminatedTitle: 'Session Déconnectée sur cet Appareil',
    sessionTerminatedDesc: 'Un autre appareil s\'est connecté à votre compte. Pour garantir votre sécurité, l\'utilisation simultanée est limitée à 1 appareil.',
    relogin: 'Se Reconnecter Ici',
    allCinema: 'Tout le Cinéma',
    englishDubbed: 'Doublé en Anglais',
    frenchVF: 'Version Française (VF)',
    swahiliDjs: 'DJs Swahili',
    agasobanuye: 'Agasobanuye',
    downloads: 'Téléchargements',
    searchPlaceholder: 'Rechercher titres, DJs, genres...',
    freeTierBadge: 'Gratuit (Free)',
    upgradeToPro: 'Passer à Pro',
    saveChanges: 'Enregistrer',
    close: 'Fermer'
  }
};
