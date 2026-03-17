import { useI18n } from '../i18n/I18nContext'

const AboutPage = ({ onBack }: { onBack: () => void }) => {
  const { t } = useI18n()

  return (
    <div className="test-container">
      <button className="back-btn" onClick={onBack}>← {t.backToHome}</button>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1rem', lineHeight: 1.8, color: '#2d3748' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: '#667eea' }}>
          About Hardware Test Tools
        </h1>
        <p style={{ marginBottom: '1.5rem', fontSize: '1.05rem' }}>
          <strong>Hardware Test Tools</strong> is a free, browser-based diagnostic suite that helps you
          verify whether your computer peripherals are working correctly — no downloads, no registration,
          and no data ever leaves your device.
        </p>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 600, margin: '2rem 0 0.75rem', color: '#4a5568' }}>
          What You Can Test
        </h2>
        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Screen Test</strong> — Check resolution, pixel ratio, color accuracy, and dead pixels
            using fullscreen color fill and grayscale patterns.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Keyboard Test</strong> — Press every key to verify it registers correctly; track test
            coverage and view key codes in real time.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Mouse Test</strong> — Test all mouse buttons (including back/forward), scroll wheel
            direction, double-click detection, and movement tracking.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Gamepad Test</strong> — Detect connected controllers, test buttons, analog sticks,
            triggers, and vibration motors via the Gamepad API.
          </li>
        </ul>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 600, margin: '2rem 0 0.75rem', color: '#4a5568' }}>
          Why Use This Tool?
        </h2>
        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>Instantly diagnose hardware issues before buying or returning a peripheral</li>
          <li style={{ marginBottom: '0.5rem' }}>Confirm a used keyboard has no stuck or broken keys</li>
          <li style={{ marginBottom: '0.5rem' }}>Detect dead pixels or color banding on a new monitor</li>
          <li style={{ marginBottom: '0.5rem' }}>Verify a gamepad's buttons and sticks all respond correctly</li>
          <li style={{ marginBottom: '0.5rem' }}>Works entirely in the browser — nothing is installed or uploaded</li>
        </ul>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 600, margin: '2rem 0 0.75rem', color: '#4a5568' }}>
          Privacy
        </h2>
        <p style={{ marginBottom: '1.5rem' }}>
          All tests run locally in your browser. No keystrokes, mouse movements, or device data are
          collected or transmitted to any server.
        </p>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 600, margin: '2rem 0 0.75rem', color: '#4a5568' }}>
          Supported Languages
        </h2>
        <p style={{ marginBottom: '1.5rem' }}>
          The interface is available in 19 languages including English, Simplified Chinese, Traditional
          Chinese, Japanese, Korean, Spanish, French, German, Russian, and more.
        </p>

        <p style={{ marginTop: '2.5rem', fontSize: '0.9rem', color: '#718096', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
          Hardware Test Tools is an open-source project hosted on{' '}
          <a href="https://github.com/introspectDaily/hardware-testing-on-web"
            target="_blank" rel="noopener noreferrer"
            style={{ color: '#667eea', textDecoration: 'none' }}>
            GitHub
          </a>.
        </p>
      </div>
    </div>
  )
}

export default AboutPage
