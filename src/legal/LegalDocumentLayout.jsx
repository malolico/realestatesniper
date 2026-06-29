import logo from '../assets/logo.png'
import '../App.css'
import SiteFooter from '../components/SiteFooter'

function LegalDocumentLayout({ title, subtitle, children }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <img src={logo} alt="RealEstateSniper" className="logo-img" />
          <div className="brand-copy">
            <div className="brand-name">RealEstateSniper</div>
            <div className="brand-subtitle">Legal Framework</div>
          </div>
        </div>

        <a href="/" className="secondary-button">
          Back to Platform
        </a>
      </header>

      <main
        className="main-content"
        style={{
          maxWidth: '860px',
          margin: '0 auto',
          padding: '32px 24px 64px',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            marginBottom: '14px',
            padding: '6px 12px',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#dbeafe',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.04)',
          }}
        >
          Legal
        </div>

        <h1
          style={{
            margin: '0 0 10px',
            color: '#ffffff',
            fontSize: '2.2rem',
            lineHeight: 1.15,
          }}
        >
          {title}
        </h1>

        <p
          style={{
            margin: '0 0 28px',
            color: '#94a3b8',
            lineHeight: 1.6,
            fontSize: '1.02rem',
            maxWidth: '720px',
          }}
        >
          {subtitle}
        </p>

        <div
          style={{
            padding: '22px',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {children}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

export default LegalDocumentLayout
