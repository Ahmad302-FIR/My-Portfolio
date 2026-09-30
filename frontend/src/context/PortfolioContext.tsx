import React, { createContext, useContext, useState, useEffect } from 'react';
import { contactConfig } from '../data/contact';
import { settingsService, type PortfolioSettingsPayload } from '../services/settingsService';

interface PortfolioContextType {
  settings: PortfolioSettingsPayload & { resumeUrl: string };
  refreshSettings: () => Promise<void>;
  loading: boolean;
}

const defaultSettings: PortfolioSettingsPayload & { resumeUrl: string } = {
  name: contactConfig.name,
  email: contactConfig.email,
  phone: contactConfig.phone,
  location: contactConfig.location,
  linkedin: contactConfig.linkedin,
  github: contactConfig.github,
  whatsappUrl: contactConfig.whatsappUrl,
  availability: contactConfig.availability,
  heroTitle: 'Muhammad Ahmed',
  heroSubtitle: 'Full Stack MERN Developer',
  shortBio:
    'I build complete web products — from responsive frontend interfaces to secure backend APIs, databases, authentication, and production deployment.',
  resumeUrl: contactConfig.resumePath,
};

const PortfolioContext = createContext<PortfolioContextType>({
  settings: defaultSettings,
  refreshSettings: async () => {},
  loading: true,
});

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const data = await settingsService.getPortfolioSettings();
      setSettings((prev) => ({
        ...prev,
        ...data,
        resumeUrl: data.resumeUrl || prev.resumeUrl,
      }));
    } catch (err) {
      console.warn('Could not load dynamic settings from backend, using defaults:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        settings,
        refreshSettings: fetchSettings,
        loading,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolioSettings = () => useContext(PortfolioContext);
