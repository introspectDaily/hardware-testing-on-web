import { useI18n } from '../i18n/I18nContext'

const PrivacyPolicy = ({ onBack }: { onBack: () => void }) => {
  const { t } = useI18n()
  const lastUpdated = '2026-03-18'

  return (
    <div className="test-container">
      <button className="back-btn" onClick={onBack}>← {t.backToHome}</button>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1rem', lineHeight: 1.8, color: '#2d3748' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', color: '#667eea' }}>
          Privacy Policy
        </h1>
        <p style={{ color: '#718096', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Last updated: {lastUpdated}
        </p>

        <p style={{ marginBottom: '1.5rem' }}>
          This Privacy Policy describes how <strong>Hardware Test Tools</strong>{' '}
          (<a href="https://hardware-testing-on-web.pages.dev" style={{ color: '#667eea', textDecoration: 'none' }}>
            hardware-testing-on-web.pages.dev
          </a>) handles information when you use our website.
        </p>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 600, margin: '2rem 0 0.75rem', color: '#4a5568' }}>
          1. Information We Do Not Collect
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          All hardware tests run entirely inside your browser. We do not collect, store, or transmit:
        </p>
        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
          <li style={{ marginBottom: '0.4rem' }}>Keystrokes or keyboard input</li>
          <li style={{ marginBottom: '0.4rem' }}>Mouse movements, clicks, or scroll data</li>
          <li style={{ marginBottom: '0.4rem' }}>Gamepad button or axis values</li>
          <li style={{ marginBottom: '0.4rem' }}>Screen resolution or display information</li>
          <li style={{ marginBottom: '0.4rem' }}>Camera or microphone streams</li>
          <li style={{ marginBottom: '0.4rem' }}>Personal identification information</li>
        </ul>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 600, margin: '2rem 0 0.75rem', color: '#4a5568' }}>
          2. Advertising (Google AdSense)
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          We use Google AdSense to display advertisements. Google AdSense may use cookies and similar
          tracking technologies to show you relevant ads based on your browsing history.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          Google's use of advertising cookies enables it and its partners to serve ads based on your
          visits to this and other websites. You may opt out of personalized advertising by visiting{' '}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer"
            style={{ color: '#667eea', textDecoration: 'none' }}>
            Google Ads Settings
          </a>.
        </p>
        <p style={{ marginBottom: '1.5rem' }}>
          For more information on how Google uses data, visit{' '}
          <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer"
            style={{ color: '#667eea', textDecoration: 'none' }}>
            How Google uses data when you use our partners' sites or apps
          </a>.
        </p>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 600, margin: '2rem 0 0.75rem', color: '#4a5568' }}>
          3. Cookies
        </h2>
        <p style={{ marginBottom: '1.5rem' }}>
          This website itself does not set cookies. However, third-party services such as Google AdSense
          may set cookies on your device. You can control cookies through your browser settings.
        </p>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 600, margin: '2rem 0 0.75rem', color: '#4a5568' }}>
          4. Third-Party Services
        </h2>
        <p style={{ marginBottom: '1.5rem' }}>
          This site is hosted on Cloudflare Pages. Cloudflare may collect standard server logs (IP
          addresses, browser type, pages visited) for security and performance purposes. See{' '}
          <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer"
            style={{ color: '#667eea', textDecoration: 'none' }}>
            Cloudflare's Privacy Policy
          </a>.
        </p>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 600, margin: '2rem 0 0.75rem', color: '#4a5568' }}>
          5. Children's Privacy
        </h2>
        <p style={{ marginBottom: '1.5rem' }}>
          This website is not directed at children under 13. We do not knowingly collect personal
          information from children.
        </p>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 600, margin: '2rem 0 0.75rem', color: '#4a5568' }}>
          6. Changes to This Policy
        </h2>
        <p style={{ marginBottom: '1.5rem' }}>
          We may update this Privacy Policy from time to time. Changes will be posted on this page with
          an updated date.
        </p>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 600, margin: '2rem 0 0.75rem', color: '#4a5568' }}>
          7. Contact
        </h2>
        <p style={{ marginBottom: '1.5rem' }}>
          If you have any questions about this Privacy Policy, you may open an issue on our{' '}
          <a href="https://github.com/introspectDaily/hardware-testing-on-web/issues"
            target="_blank" rel="noopener noreferrer"
            style={{ color: '#667eea', textDecoration: 'none' }}>
            GitHub repository
          </a>.
        </p>

        <p style={{ marginTop: '2.5rem', fontSize: '0.9rem', color: '#718096', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
          By using this website, you agree to this Privacy Policy.
        </p>
      </div>
    </div>
  )
}

export default PrivacyPolicy
