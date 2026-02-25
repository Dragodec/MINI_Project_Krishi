import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    try {
      const newLang = language === 'ml' ? 'en' : 'ml';
      setLanguage(newLang);
      localStorage.setItem('lang', newLang);

      toast.success(
        newLang === 'en'
          ? 'Switched to English'
          : 'മലയാളത്തിലേക്ക് മാറ്റി'
      );
    } catch (error) {
      toast.error('Language switch failed');
    }
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);