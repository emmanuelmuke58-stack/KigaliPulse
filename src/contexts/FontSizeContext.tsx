import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

type FontSizePreset = 'small' | 'default' | 'large' | 'xl';

interface FontSizeContextType {
  fontSize: number;
  preset: FontSizePreset | 'custom';
  setFontSize: (size: number) => void;
  setPreset: (preset: FontSizePreset | 'custom') => void;
  resetToDefault: () => void;
  savePreferences: () => Promise<void>;
}

const PRESETS: Record<FontSizePreset, number> = {
  small: 14,
  default: 16,
  large: 20,
  xl: 24,
};

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

export const FontSizeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, updateUserProfile } = useAuth();
  const [fontSize, setFontSizeState] = useState<number>(16);
  const [preset, setPresetState] = useState<FontSizePreset | 'custom'>('default');

  // Load from user profile or localStorage on mount/login
  useEffect(() => {
    if (currentUser?.preferredFontSize) {
      setFontSizeState(currentUser.preferredFontSize);
      if (currentUser.preferredFontPreset) {
        setPresetState(currentUser.preferredFontPreset as any);
      } else {
        const matchingPreset = Object.entries(PRESETS).find(([_, val]) => val === currentUser.preferredFontSize);
        setPresetState(matchingPreset ? (matchingPreset[0] as FontSizePreset) : 'custom');
      }
    } else {
      const savedSize = localStorage.getItem('kigali-pulse-font-size');
      const savedPreset = localStorage.getItem('kigali-pulse-font-preset');

      if (savedSize) {
        const size = parseInt(savedSize, 10);
        setFontSizeState(size);
        if (savedPreset) {
          setPresetState(savedPreset as any);
        } else {
          const matchingPreset = Object.entries(PRESETS).find(([_, val]) => val === size);
          setPresetState(matchingPreset ? (matchingPreset[0] as FontSizePreset) : 'custom');
        }
      }
    }
  }, [currentUser]);

  // Apply to document
  useEffect(() => {
    document.documentElement.style.setProperty('--base-font-size', `${fontSize}px`);
  }, [fontSize]);

  const setFontSize = (size: number) => {
    setFontSizeState(size);
    const matchingPreset = Object.entries(PRESETS).find(([_, val]) => val === size);
    setPresetState(matchingPreset ? (matchingPreset[0] as FontSizePreset) : 'custom');
  };

  const setPreset = (p: FontSizePreset | 'custom') => {
    setPresetState(p);
    if (p !== 'custom') {
      setFontSizeState(PRESETS[p]);
    }
  };

  const resetToDefault = () => {
    setFontSizeState(16);
    setPresetState('default');
  };

  const savePreferences = async () => {
    localStorage.setItem('kigali-pulse-font-size', fontSize.toString());
    localStorage.setItem('kigali-pulse-font-preset', preset);
    
    if (currentUser) {
      await updateUserProfile({
        preferredFontSize: fontSize,
        preferredFontPreset: preset,
      });
    }
  };

  return (
    <FontSizeContext.Provider
      value={{
        fontSize,
        preset,
        setFontSize,
        setPreset,
        resetToDefault,
        savePreferences,
      }}
    >
      {children}
    </FontSizeContext.Provider>
  );
};

export const useFontSize = () => {
  const context = useContext(FontSizeContext);
  if (context === undefined) {
    throw new Error('useFontSize must be used within a FontSizeProvider');
  }
  return context;
};
