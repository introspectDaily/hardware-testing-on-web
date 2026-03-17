import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { LocaleCode, localeInfoList, Translations } from './types'
import { translations } from './locales'

interface I18nContextType {
  locale: LocaleCode
  t: Translations
  setLocale: (locale: LocaleCode) => void
  localeInfoList: typeof localeInfoList
}

const I18nContext = createContext<I18nContextType | null>(null)

function getDefaultLocale(): LocaleCode {
  // Try to get from localStorage
  const saved = localStorage.getItem('preferred-locale')
  if (saved && localeInfoList.some(l => l.code === saved)) {
    return saved as LocaleCode
  }

  // Try browser language
  const browserLang = navigator.language || (navigator as any).userLanguage
  if (browserLang) {
    // Match exact
    const exactMatch = localeInfoList.find(l => l.code === browserLang)
    if (exactMatch) {
      return exactMatch.code
    }
    // Match prefix (e.g., "zh" -> "zh-CN")
    const prefix = browserLang.split('-')[0]
    const prefixMatch = localeInfoList.find(l => l.code.startsWith(prefix))
    if (prefixMatch) {
      return prefixMatch.code
    }
  }

  // Default to Chinese
  return 'zh-CN'
}

interface I18nProviderProps {
  children: ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocale] = useState<LocaleCode>(getDefaultLocale())

  useEffect(() => {
    localStorage.setItem('preferred-locale', locale)
    // Update HTML lang attribute
    document.documentElement.lang = locale
  }, [locale])

  const value: I18nContextType = {
    locale,
    t: translations[locale],
    setLocale,
    localeInfoList,
  }

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
