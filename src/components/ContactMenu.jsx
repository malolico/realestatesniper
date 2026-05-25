import { useEffect } from 'react'

function ContactMenu({
  showContactMenu,
  setShowContactMenu,
  contactMenuRef,
  openExternalLink,
  EMAIL_LINK,
  WHATSAPP_LINK,
  TELEGRAM_LINK,
}) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        contactMenuRef.current &&
        !contactMenuRef.current.contains(event.target)
      ) {
        setShowContactMenu(false)
      }
    }

    if (showContactMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showContactMenu, contactMenuRef, setShowContactMenu])

  return (
    <div style={{ position: 'relative' }} ref={contactMenuRef}>
      <button
        onClick={() => setShowContactMenu((prev) => !prev)}
        className="secondary-button"
      >
        Contact
      </button>

      {showContactMenu && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            right: 0,
            minWidth: '220px',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(10, 13, 18, 0.98)',
            boxShadow: '0 18px 40px rgba(0,0,0,0.35)',
            padding: '10px',
            zIndex: 20,
          }}
        >
          <button
            className="secondary-button"
            style={{ width: '100%', textAlign: 'left', marginBottom: '8px' }}
            onClick={() => openExternalLink(EMAIL_LINK)}
          >
            Email
          </button>

          <button
            className="secondary-button"
            style={{ width: '100%', textAlign: 'left', marginBottom: '8px' }}
            onClick={() => openExternalLink(WHATSAPP_LINK)}
          >
            WhatsApp
          </button>

          <button
            className="secondary-button"
            style={{ width: '100%', textAlign: 'left' }}
            onClick={() => openExternalLink(TELEGRAM_LINK)}
          >
            Telegram
          </button>
        </div>
      )}
    </div>
  )
}

export default ContactMenu