// src/hooks/useAppTranslation.ts
import { useGlobalState } from '../store'; // <--- BẮT BUỘC PHẢI CÓ
import { vi } from '../i18n/vi';
import { en } from '../i18n/en';

type TranslationKeys = keyof typeof vi;

export const useAppTranslation = () => {
  // 1. Phải lấy state từ Store thì mới lắng nghe được thay đổi
  const { state } = useGlobalState(); 
  const currentLang = state.appSetting.language; 

  const dictionary = currentLang === 'vi' ? vi : en;

  const t = (key: TranslationKeys): string => {
    return dictionary[key] || key;
  };

  return { t };
};