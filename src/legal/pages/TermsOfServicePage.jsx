import LegalDocumentLayout from '../LegalDocumentLayout'

const sectionStyle = {
  color: '#e2e8f0',
  lineHeight: 1.7,
  fontSize: '0.95rem',
}

const h2Style = {
  color: '#ffffff',
  fontSize: '1.3rem',
  fontWeight: 800,
  margin: '32px 0 12px',
}

const pStyle = {
  margin: '0 0 12px',
}

const ulStyle = {
  margin: '0 0 12px',
  paddingLeft: '24px',
}

const dividerStyle = {
  border: 'none',
  borderTop: '1px solid rgba(255,255,255,0.08)',
  margin: '28px 0',
}

const draftNoticeStyle = {
  margin: '8px 0 12px',
  padding: '10px 14px',
  borderRadius: '8px',
  border: '1px solid rgba(251, 191, 36, 0.3)',
  background: 'rgba(251, 191, 36, 0.08)',
  color: '#fbbf24',
  fontWeight: 700,
  fontSize: '0.88rem',
}

export default function TermsOfServicePage() {
  return (
    <LegalDocumentLayout
      title="Terms of Service"
      subtitle="Platform rules and conditions for using RealEstateSniper."
    >
      <div style={sectionStyle}>

        <h2 style={h2Style}>1. INTRODUCTION</h2>
        <p style={pStyle}>Welcome to RealEstateSniper.</p>
        <p style={pStyle}>
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of the
          RealEstateSniper website, platform, services, software, databases, tools, features
          and related products (collectively, the &quot;Platform&quot;).
        </p>
        <p style={pStyle}>
          By accessing, browsing, creating an account, subscribing, purchasing any digital
          product, or otherwise using the Platform, you agree to be legally bound by these
          Terms and by any additional legal documents expressly incorporated by reference.
        </p>
        <p style={pStyle}>
          If you do not agree with these Terms, you must not access or use the Platform.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>2. COMPANY</h2>
        <p style={pStyle}>Throughout these Terms:</p>
        <p style={pStyle}>
          &quot;RealEstateSniper&quot; means the technology platform operating the Marketplace
          and all related digital services.
        </p>
        <p style={pStyle}>
          Additional corporate identification information may be incorporated into these
          Terms before public launch.
        </p>
        <div style={draftNoticeStyle}>Revisión obligatoria por abogado de EE. UU.</div>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>3. PURPOSE OF THE PLATFORM</h2>
        <p style={pStyle}>
          RealEstateSniper is a technology platform designed to identify, organize, verify
          and provide access to real estate opportunities and related information.
        </p>
        <p style={pStyle}>The Platform provides digital information services.</p>
        <p style={pStyle}>RealEstateSniper does not act as:</p>
        <ul style={ulStyle}>
          <li>a real estate broker;</li>
          <li>a real estate agent;</li>
          <li>a property representative;</li>
          <li>an attorney;</li>
          <li>an escrow company;</li>
          <li>a title company;</li>
          <li>a lender;</li>
          <li>an investment advisor;</li>
          <li>a financial advisor.</li>
        </ul>
        <p style={pStyle}>The Platform facilitates access to information.</p>
        <p style={pStyle}>
          The Platform does not negotiate transactions between owners and investors.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>4. LEGAL NATURE</h2>
        <p style={pStyle}>
          RealEstateSniper is not a party to any purchase agreement, sale agreement,
          negotiation or transaction that may occur between users.
        </p>
        <p style={pStyle}>
          Any communication, negotiation or agreement between an Owner and an Investor takes
          place entirely outside the Platform.
        </p>
        <p style={pStyle}>
          RealEstateSniper neither represents nor replaces any party involved in a real
          estate transaction.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>5. ELIGIBILITY</h2>
        <p style={pStyle}>To use the Platform, users must:</p>
        <ul style={ulStyle}>
          <li>be at least eighteen (18) years of age;</li>
          <li>have legal capacity to enter into binding agreements;</li>
          <li>provide accurate information when required;</li>
          <li>comply with these Terms and all applicable laws.</li>
        </ul>
        <p style={pStyle}>
          Additional verification may be required for specific services.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>6. USER ACCOUNTS</h2>
        <p style={pStyle}>
          Depending on the Platform services, users may register under different account
          types, including:
        </p>
        <ul style={ulStyle}>
          <li>Visitor</li>
          <li>Investor</li>
          <li>Founder</li>
          <li>Subscriber</li>
          <li>Owner</li>
          <li>Administrator</li>
        </ul>
        <p style={pStyle}>
          Each account type provides different access rights and functionalities.
        </p>
        <p style={pStyle}>
          Access rights are determined exclusively by the Platform.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>7. ACCOUNT SECURITY</h2>
        <p style={pStyle}>
          Users are responsible for maintaining the confidentiality of their login
          credentials.
        </p>
        <p style={pStyle}>
          Users remain responsible for all activities conducted through their accounts
          unless unauthorized access results from a security failure attributable to
          RealEstateSniper.
        </p>
        <p style={pStyle}>
          Users must immediately notify the Platform of any suspected unauthorized access.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>8. ACCEPTANCE OF ADDITIONAL DOCUMENTS</h2>
        <p style={pStyle}>
          Certain Platform services may require acceptance of additional legal documents,
          including but not limited to:
        </p>
        <ul style={ulStyle}>
          <li>Privacy Policy;</li>
          <li>Cookie Policy;</li>
          <li>Marketplace Rules;</li>
          <li>Owner Agreement;</li>
          <li>Subscriber Terms;</li>
          <li>Founder Program Terms;</li>
          <li>Premium Purchase Terms;</li>
          <li>Diamond Purchase Terms;</li>
          <li>Refund Policy;</li>
          <li>Acceptable Use Policy.</li>
        </ul>
        <p style={pStyle}>
          Where applicable, those documents form an integral part of these Terms.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>9. MODIFICATIONS</h2>
        <p style={pStyle}>
          RealEstateSniper may update these Terms when necessary.
        </p>
        <p style={pStyle}>
          Whenever a modification materially affects users&apos; rights or obligations, the
          Platform will require acceptance of the updated version before continued use,
          where required by applicable law.
        </p>
        <p style={pStyle}>
          Previous versions may be retained as part of the Legal Evidence Engine.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>10. PLATFORM SERVICES</h2>
        <p style={pStyle}>
          RealEstateSniper may provide, among other services:
        </p>
        <ul style={ulStyle}>
          <li>Access to the Marketplace.</li>
          <li>Property opportunity information.</li>
          <li>Premium opportunities.</li>
          <li>Diamond opportunities.</li>
          <li>Owner services.</li>
          <li>Subscription services.</li>
          <li>Alerts and notifications.</li>
          <li>Administrative services.</li>
          <li>Other services introduced in the future.</li>
        </ul>
        <p style={pStyle}>
          The availability of any service may depend on the user&apos;s account type,
          subscription status, eligibility requirements, or other applicable conditions.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>11. SUBSCRIPTIONS</h2>
        <p style={pStyle}>
          Certain Platform features require an active paid subscription.
        </p>
        <p style={pStyle}>
          An active subscription grants access only to the services included in the
          applicable subscription plan.
        </p>
        <p style={pStyle}>
          Failure to maintain an active subscription may result in the suspension or
          limitation of access to subscription-only services.
        </p>
        <p style={pStyle}>
          Purchasing a subscription does not guarantee access to Premium or Diamond
          products, which remain separate digital products subject to their own terms.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>12. PREMIUM AND DIAMOND PRODUCTS</h2>
        <p style={pStyle}>
          Premium and Diamond opportunities are independent digital products.
        </p>
        <p style={pStyle}>
          Their availability, purchase conditions, access rights and restrictions are
          governed by their respective legal documents.
        </p>
        <p style={pStyle}>
          Purchasing one product does not create any ownership interest in the Platform or
          in any property.
        </p>
        <p style={pStyle}>
          The purchase grants only the access rights expressly described in the applicable
          documentation.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>13. OWNER SERVICES</h2>
        <p style={pStyle}>
          Owners may access specific services designed for property review, verification
          and authorization.
        </p>
        <p style={pStyle}>
          The existence of an Owner Account does not imply that any property will be
          accepted into the Marketplace.
        </p>
        <p style={pStyle}>
          Each property is evaluated independently under the procedures established by
          RealEstateSniper.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>14. USER RESPONSIBILITIES</h2>
        <p style={pStyle}>Users agree to:</p>
        <ul style={ulStyle}>
          <li>provide truthful information;</li>
          <li>maintain accurate account information;</li>
          <li>comply with all applicable laws;</li>
          <li>use the Platform in good faith;</li>
          <li>respect the rights of other users;</li>
          <li>comply with all Platform policies.</li>
        </ul>
        <p style={pStyle}>
          Users are responsible for all actions performed through their accounts.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>15. PROHIBITED ACTIVITIES</h2>
        <p style={pStyle}>Users may not:</p>
        <ul style={ulStyle}>
          <li>use the Platform for unlawful purposes;</li>
          <li>impersonate another person;</li>
          <li>submit false information;</li>
          <li>interfere with Platform security;</li>
          <li>attempt unauthorized access;</li>
          <li>copy or scrape protected Platform data;</li>
          <li>redistribute purchased information;</li>
          <li>publish restricted information obtained through the Platform;</li>
          <li>use Platform data to train artificial intelligence systems;</li>
          <li>engage in wholesaling using information obtained from the Platform where prohibited by the Platform rules;</li>
          <li>violate any applicable legal document.</li>
        </ul>
        <p style={pStyle}>
          RealEstateSniper may investigate suspected violations and take appropriate action.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>16. INTELLECTUAL PROPERTY</h2>
        <p style={pStyle}>
          Unless otherwise indicated, all Platform content, including software, databases,
          designs, graphics, logos, text, documentation, trademarks and proprietary
          information, belongs to RealEstateSniper or its licensors.
        </p>
        <p style={pStyle}>
          No license is granted except for the limited right to use the Platform in
          accordance with these Terms.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>17. THIRD-PARTY SERVICES</h2>
        <p style={pStyle}>
          The Platform may integrate or reference third-party services.
        </p>
        <p style={pStyle}>
          RealEstateSniper is not responsible for the availability, content or operation of
          third-party services beyond the obligations imposed by applicable law.
        </p>
        <p style={pStyle}>
          Use of third-party services may be subject to separate terms and conditions.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>18. DISCLAIMERS</h2>
        <p style={pStyle}>
          The Platform is provided on an &quot;as available&quot; and &quot;as is&quot; basis,
          except where otherwise required by applicable law.
        </p>
        <p style={pStyle}>
          RealEstateSniper makes reasonable efforts to verify the information made available
          through the Platform but cannot guarantee that all information will always be
          complete, current or error-free.
        </p>
        <p style={pStyle}>
          Users remain solely responsible for performing their own legal, financial, tax,
          technical and commercial due diligence before making any investment or business
          decision.
        </p>
        <p style={pStyle}>
          Nothing contained on the Platform constitutes legal, financial, tax or investment
          advice.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>19. LIMITATION OF LIABILITY</h2>
        <p style={pStyle}>
          To the maximum extent permitted by applicable law, RealEstateSniper shall not be
          liable for:
        </p>
        <ul style={ulStyle}>
          <li>negotiations between Owners and Investors;</li>
          <li>purchase or sale decisions;</li>
          <li>financing decisions;</li>
          <li>property inspections;</li>
          <li>title issues;</li>
          <li>legal disputes between users;</li>
          <li>tax consequences;</li>
          <li>investment performance;</li>
          <li>lost profits;</li>
          <li>indirect or consequential damages.</li>
        </ul>
        <p style={pStyle}>
          Nothing in these Terms excludes liability where such exclusion is prohibited by
          law.
        </p>
        <div style={draftNoticeStyle}>Revisión obligatoria por abogado de EE. UU.</div>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>20. INDEMNIFICATION</h2>
        <p style={pStyle}>
          Users agree to indemnify and hold harmless RealEstateSniper, its officers,
          employees, contractors and affiliates from claims arising from:
        </p>
        <ul style={ulStyle}>
          <li>violation of these Terms;</li>
          <li>unlawful use of the Platform;</li>
          <li>infringement of third-party rights;</li>
          <li>fraudulent conduct;</li>
          <li>misuse of information obtained through the Platform.</li>
        </ul>
        <div style={draftNoticeStyle}>Revisión obligatoria por abogado de EE. UU.</div>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>21. ACCOUNT SUSPENSION AND TERMINATION</h2>
        <p style={pStyle}>
          RealEstateSniper may suspend, restrict or terminate access when a user:
        </p>
        <ul style={ulStyle}>
          <li>violates these Terms;</li>
          <li>violates any applicable Platform policy;</li>
          <li>commits fraud;</li>
          <li>provides false information;</li>
          <li>compromises Platform security;</li>
          <li>seriously harms other users or the Platform.</li>
        </ul>
        <p style={pStyle}>
          Where appropriate, the Platform may also permanently prohibit future access.
        </p>
        <p style={pStyle}>
          Termination of an account does not eliminate obligations already assumed by the
          user.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>22. RECORD RETENTION</h2>
        <p style={pStyle}>
          RealEstateSniper may retain records, evidence and documentation when necessary
          for:
        </p>
        <ul style={ulStyle}>
          <li>legal compliance;</li>
          <li>contractual obligations;</li>
          <li>dispute resolution;</li>
          <li>fraud prevention;</li>
          <li>security;</li>
          <li>operation of the Legal Evidence Engine.</li>
        </ul>
        <p style={pStyle}>
          Retention periods shall be governed by applicable law and internal policies.
        </p>
        <div style={draftNoticeStyle}>Revisión obligatoria por abogado de EE. UU.</div>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>23. GOVERNING LAW</h2>
        <p style={pStyle}>
          These Terms shall be governed by the law designated in the final published version
          of the Platform.
        </p>
        <p style={pStyle}>
          The governing law, jurisdiction and dispute resolution provisions will be adapted
          before launch.
        </p>
        <div style={draftNoticeStyle}>Revisión obligatoria por abogado de EE. UU.</div>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>24. SEVERABILITY</h2>
        <p style={pStyle}>
          If any provision of these Terms is held invalid or unenforceable, the remaining
          provisions shall continue in full force to the maximum extent permitted by law.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>25. ENTIRE AGREEMENT</h2>
        <p style={pStyle}>
          These Terms, together with all legal documents expressly incorporated by
          reference, constitute the entire agreement between the user and RealEstateSniper
          regarding the use of the Platform.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>26. CONTACT</h2>
        <p style={pStyle}>
          Legal contact information will be incorporated before public launch.
        </p>
        <div style={draftNoticeStyle}>Revisión obligatoria por abogado de EE. UU.</div>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>27. EFFECTIVE DATE</h2>
        <p style={pStyle}>
          These Terms become effective on the date indicated in the published version.
        </p>
        <p style={pStyle}>
          The current draft constitutes Version 1.0 of the Terms of Service for
          RealEstateSniper and forms the legal foundation for the Platform, subject to final
          review by U.S. legal counsel before commercial launch.
        </p>

      </div>
    </LegalDocumentLayout>
  )
}
