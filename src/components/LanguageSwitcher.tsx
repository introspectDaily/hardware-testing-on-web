import { useState } from 'react'
import { useI18n } from '../i18n/I18nContext'
import { LocaleCode } from '../i18n/types'
import './LanguageSwitcher.css'

const LanguageSwitcher = () => {
  const { locale, setLocale, localeInfoList } = useI18n()
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (code: LocaleCode) => {
    setLocale(code)
    setIsOpen(false)
  }

  const currentInfo = localeInfoList.find(l => l.code === locale)

  return (
    <div className="language-switcher">
      <button
        className="language-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="language-icon">🌐</span>
        <span className="language-current">{currentInfo?.nativeName || locale}</span>
        <span className={`arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <div className="language-dropdown">
          {localeInfoList.map(info => (
            <button
              key={info.code}
              className={`language-option ${info.code === locale ? 'active' : ''}`}
              onClick={() => handleSelect(info.code)}
            >
              {info.nativeName}
              {info.code === locale && <span className="check">✓</span>}
            </button>
          ))}
        </div>
      )}
      {isOpen && <div className="backdrop" onClick={() => setIsOpen(false)} />}
    </div>
  )
}

export default LanguageSwitcher
