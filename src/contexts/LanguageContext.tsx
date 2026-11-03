import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'rw';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.discover': 'Discover',
    'nav.categories': 'Categories',
    'nav.locations': 'Locations',
    'nav.venues': 'Venues',
    'nav.organizers': 'Organizers',
    'nav.advertise': 'Advertise',
    'nav.create': 'Create Event',
    'auth.login': 'Sign In',
    'auth.signup': 'Sign Up',
    'header.search': 'Search events...',
    'header.saved': 'Saved',
    'header.notifications': 'Notifications',
    'header.profile': 'Profile',
    'header.logout': 'Sign Out',
  },
  rw: {
    'nav.home': 'Ahabanza',
    'nav.discover': 'Shaka',
    'nav.categories': 'Ibyiciro',
    'nav.locations': 'Ahantu',
    'nav.venues': 'Ahantu habera ibirori',
    'nav.organizers': 'Abategura ibirori',
    'nav.advertise': 'Kwaza',
    'nav.create': 'Regura ibirori',
    'auth.login': 'Injira',
    'auth.signup': 'Iyandikishe',
    'header.search': 'Shaka ibirori...',
    'header.saved': 'Ibyabitswe',
    'header.notifications': 'Imenyesha',
    'header.profile': 'Umwirondoro',
    'header.logout': 'Sohoka',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('kigali-pulse-lang');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('kigali-pulse-lang', lang);
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
