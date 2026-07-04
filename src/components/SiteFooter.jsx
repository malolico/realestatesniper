import { getLegalPage } from '../legal/legalPages'

const FOOTER_LINKS = [
  { key: 'termsOfService', label: 'Terms of Service' },
  { key: 'privacyPolicy', label: 'Privacy Policy' },
  { key: 'cookiePolicy', label: 'Cookie Policy' },
  { key: 'investmentDisclaimer', label: 'Investment Disclaimer' },
  { key: 'legalNotice', label: 'Contact' },
  { key: 'legalIndex', label: 'Legal Index' },
]

function SiteFooter() {
  return (
    <footer
      style={{
        marginTop: 'auto',
        padding: '28px 32px 36px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(10, 13, 18, 0.72)',
      }}
    >
      <div
        style={{
          maxWidth: '1120px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <nav
          aria-label="Legal"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px 20px',
          }}
        >
          {FOOTER_LINKS.map(({ key, label }) => {
            const page = getLegalPage(key)
            if (!page) return null

            return (
              <a
                key={key}
                href={page.path}
                style={{
                  color: '#cbd5e1',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ffffff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#cbd5e1'
                }}
              >
                {label}
              </a>
            )
          })}
        </nav>

        <div
          style={{
            color: '#94a3b8',
            fontSize: '0.82rem',
            lineHeight: 1.6,
          }}
        >
          © RealEstateSniper. All rights reserved.
        </div>

        <p
          style={{
            margin: 0,
            color: '#64748b',
            fontSize: '0.76rem',
            lineHeight: 1.55,
            maxWidth: '820px',
          }}
        >
          RealEstateSniper is a real estate intelligence platform and is not a real
          estate brokerage, law firm, financial advisor or appraisal company.
        </p>
      </div>
    </footer>
  )
}

export default SiteFooter
