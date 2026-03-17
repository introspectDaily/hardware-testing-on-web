import { useState } from 'react'
import { useI18n } from './i18n/I18nContext'
import ScreenTest from './components/ScreenTest'
import KeyboardTest from './components/KeyboardTest'
import MouseTest from './components/MouseTest'
import GamepadTest from './components/GamepadTest'
import AboutPage from './components/AboutPage'
import PrivacyPolicy from './components/PrivacyPolicy'
import LanguageSwitcher from './components/LanguageSwitcher'

const App = () => {
  const { t } = useI18n()
  const [currentTest, setCurrentTest] = useState<string | null>(null)

  const AVAILABLE = new Set(['screen', 'keyboard', 'mouse', 'gamepad'])

  const tests = [
    { id: 'screen',     name: t.screenTest,   description: t.screenTestDescription },
    { id: 'keyboard',  name: t.keyboardTest,  description: t.keyboardTestDescription },
    { id: 'mouse',     name: t.mouseTest,     description: t.mouseTestDescription },
    { id: 'gamepad',   name: t.gamepadTest,   description: t.gamepadTestDescription },
    { id: 'camera',    name: t.cameraTest,    description: '' },
    { id: 'microphone',name: t.micTest,       description: '' },
    { id: 'speaker',   name: t.speakerTest,   description: '' },
  ]

  if (currentTest === 'about') {
    return (
      <div className="app-container">
        <header>
          <div><h1>{t.appTitle}</h1></div>
          <LanguageSwitcher />
        </header>
        <main><AboutPage onBack={() => setCurrentTest(null)} /></main>
      </div>
    )
  }

  if (currentTest === 'privacy') {
    return (
      <div className="app-container">
        <header>
          <div><h1>{t.appTitle}</h1></div>
          <LanguageSwitcher />
        </header>
        <main><PrivacyPolicy onBack={() => setCurrentTest(null)} /></main>
      </div>
    )
  }

  if (currentTest === 'screen') {
    return (
      <div className="app-container">
        <header>
          <div>
            <h1>{t.appTitle}</h1>
          </div>
          <LanguageSwitcher />
        </header>
        <main>
          <button className="back-btn" onClick={() => setCurrentTest(null)}>
            ← {t.backToHome}
          </button>
          <ScreenTest />
        </main>
      </div>
    )
  }

  if (currentTest === 'mouse') {
    return (
      <div className="app-container">
        <header>
          <div>
            <h1>{t.appTitle}</h1>
          </div>
          <LanguageSwitcher />
        </header>
        <main>
          <button className="back-btn" onClick={() => setCurrentTest(null)}>
            ← {t.backToHome}
          </button>
          <MouseTest />
        </main>
      </div>
    )
  }

  if (currentTest === 'gamepad') {
    return (
      <div className="app-container">
        <header>
          <div>
            <h1>{t.appTitle}</h1>
          </div>
          <LanguageSwitcher />
        </header>
        <main>
          <button className="back-btn" onClick={() => setCurrentTest(null)}>
            ← {t.backToHome}
          </button>
          <GamepadTest />
        </main>
      </div>
    )
  }

  if (currentTest === 'keyboard') {
    return (
      <div className="app-container">
        <header>
          <div>
            <h1>{t.appTitle}</h1>
          </div>
          <LanguageSwitcher />
        </header>
        <main>
          <button className="back-btn" onClick={() => setCurrentTest(null)}>
            ← {t.backToHome}
          </button>
          <KeyboardTest />
        </main>
      </div>
    )
  }

  return (
    <div className="app-container">
      <header>
        <div>
          <h1>{t.appTitle}</h1>
          <p className="app-description">{t.appDescription}</p>
        </div>
        <LanguageSwitcher />
      </header>
      <main>
        <div className="test-grid">
          {tests.map((test) => {
            const available = AVAILABLE.has(test.id)
            return (
              <div
                key={test.id}
                className="test-card"
                onClick={() => available && setCurrentTest(test.id)}
                style={{ position: 'relative', opacity: available ? 1 : 0.6, cursor: available ? 'pointer' : 'default' }}
              >
                {!available && (
                  <span style={{
                    position: 'absolute', top: '1rem', right: '1rem',
                    background: '#e2e8f0', color: '#94a3b8',
                    fontSize: '11px', fontWeight: 700, padding: '2px 8px',
                    borderRadius: '999px', letterSpacing: '0.05em',
                  }}>
                    COMING SOON
                  </span>
                )}
                <h2>{test.name}</h2>
                <p>{test.description}</p>
              </div>
            )
          })}
        </div>
      </main>
      <footer style={{
        textAlign: 'center', padding: '1.5rem 1rem',
        fontSize: '0.85rem', color: '#94a3b8',
        borderTop: '1px solid #e2e8f0', marginTop: '2rem',
      }}>
        <button onClick={() => setCurrentTest('about')}
          style={{ background: 'none', border: 'none', color: '#667eea', cursor: 'pointer', fontSize: '0.85rem', padding: '0 0.5rem' }}>
          {t.aboutUs}
        </button>
        <span style={{ color: '#e2e8f0' }}>|</span>
        <button onClick={() => setCurrentTest('privacy')}
          style={{ background: 'none', border: 'none', color: '#667eea', cursor: 'pointer', fontSize: '0.85rem', padding: '0 0.5rem' }}>
          {t.privacyPolicy}
        </button>
      </footer>
    </div>
  )
}

export default App
