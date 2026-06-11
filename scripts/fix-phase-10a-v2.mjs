import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const path = join(__dirname, '..', 'src', 'App.jsx')
const content = fs.readFileSync(path, 'utf8')

const iStart = content.indexOf('          {renderAdminPanel()}')
const iMyPurchases = content.indexOf('          {currentUser ? (', iStart)
const iEnd = content.indexOf('          })()}', iStart)

if (iStart < 0 || iMyPurchases < 0) {
  console.error('markers', { iStart, iMyPurchases, iEnd })
  process.exit(1)
}

const middle = content.slice(iStart, iMyPurchases)

function extractConditional(condPattern, sectionId) {
  const re = new RegExp(
    `\\{${condPattern} \\? \\(\\s*(<section id="${sectionId}"[\\s\\S]*?</section>)\\s*\\) : null\\}`,
    'm',
  )
  const m = middle.match(re)
  if (!m) {
    console.error('conditional fail', sectionId)
    process.exit(1)
  }
  return `{${condPattern} ? (\n${indent(m[1], 14)}\n            ) : null}`
}

function extractPlain(sectionId) {
  const re = new RegExp(`(<section id="${sectionId}"[\\s\\S]*?</section>)`, 'm')
  const m = middle.match(re)
  if (!m) {
    console.error('plain fail', sectionId)
    process.exit(1)
  }
  return indent(m[1], 14)
}

function indent(text, spaces) {
  const pad = ' '.repeat(spaces)
  return text
    .split('\n')
    .map((line) => (line.trim() === '' ? '' : pad + line.trimStart()))
    .join('\n')
}

const sections = {
  markets: extractPlain('markets'),
  founder: extractConditional('primaryVisualWorkspace === \'founder\'', 'founder-dashboard'),
  account: extractConditional('showInvestorAccount', 'subscriber-dashboard'),
  owner: extractConditional('primaryVisualWorkspace === \'owner\'', 'owner-dashboard'),
  admin: extractConditional('primaryVisualWorkspace === \'admin\'', 'admin-dashboard'),
  deals: extractPlain('deals'),
  tiers: extractPlain('tiers'),
  access: extractConditional('!currentUser', 'access'),
}

const entries = Object.entries(sections).map(
  ([key, body]) => `            ${key}: (\n${body}\n            ),`,
)

const newBlock = `          {renderAdminPanel()}

          {(() => {
            const workspaceSections = {
${entries.join('\n')}
            }

            return getWorkspaceSectionOrder(primaryVisualWorkspace).map((sectionKey) => (
              <Fragment key={sectionKey}>{workspaceSections[sectionKey]}</Fragment>
            ))
          })()}

`

const before = content.slice(0, iStart)
const after = content.slice(iMyPurchases)
const out = before + newBlock + after
fs.writeFileSync(path, out)
console.log('ok', Object.keys(sections))
