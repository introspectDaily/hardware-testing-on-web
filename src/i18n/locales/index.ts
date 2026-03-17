import { LocaleCode, Translations } from '../types'
import { en } from './en'
import { enGB } from './en-GB'
import { zhCN } from './zh-CN'
import { zhTW } from './zh-TW'
import { jaJP } from './ja-JP'
import { koKR } from './ko-KR'
import { esES } from './es-ES'
import { frFR } from './fr-FR'
import { deDE } from './de-DE'
import { itIT } from './it-IT'
import { ptBR } from './pt-BR'
import { ptPT } from './pt-PT'
import { ruRU } from './ru-RU'
import { arSA } from './ar-SA'
import { hiIN } from './hi-IN'
import { nlNL } from './nl-NL'
import { trTR } from './tr-TR'
import { viVN } from './vi-VN'
import { thTH } from './th-TH'
import { plPL } from './pl-PL'

export const translations: Record<LocaleCode, Translations> = {
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  'en-US': en,
  'en-GB': enGB,
  'ja-JP': jaJP,
  'ko-KR': koKR,
  'es-ES': esES,
  'fr-FR': frFR,
  'de-DE': deDE,
  'it-IT': itIT,
  'pt-BR': ptBR,
  'pt-PT': ptPT,
  'ru-RU': ruRU,
  'ar-SA': arSA,
  'hi-IN': hiIN,
  'nl-NL': nlNL,
  'tr-TR': trTR,
  'vi-VN': viVN,
  'th-TH': thTH,
  'pl-PL': plPL,
}

// Add fallback for missing translations
export function getTranslation<K extends keyof Translations>(
  locale: LocaleCode,
  key: K
): Translations[K] {
  const t = translations[locale]?.[key]
  if (t !== undefined) {
    return t
  }
  // Fallback to en-US
  return translations['en-US'][key]
}

export default translations
