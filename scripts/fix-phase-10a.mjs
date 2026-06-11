import fs from 'fs'

import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const path = join(__dirname, '..', 'src', 'App.jsx')

const lines = fs.readFileSync(path, 'utf8').split(/\r?\n/)

const iStart = lines.findIndex((l) => l.includes('{renderAdminPanel()}'))
const iEnd = lines.findIndex((l) => l.includes('})()}') && l.trim() === '})()}')

if (iStart < 0 || iEnd < 0) {
  console.error('markers not found', { iStart, iEnd })
  process.exit(1)
}

// Original section line ranges (1-based from pre-break file)
const ranges = {
  markets: [3986, 4027],
  founder: [4029, 4048],
  account: [4050, 4078],
  owner: [4080, 4094],
  admin: [4096, 4110],
  deals: [4287, 4358],
  tiers: [4360, 4448],
  access: [4450, 4763],
}

// Try to recover originals from broken file by parsing keys
function extractFromBroken(key, nextKey) {
  const text = lines.join('\n')
  const startRe = new RegExp(`\\s+${key}:\\s*\\(`)
  const m = text.match(startRe)
  if (!m) return null
  const start = text.indexOf(m[0])
  const afterKey = text.indexOf('\n', start) + 1
  const nextRe = nextKey
    ? new RegExp(`\\n\\s+${nextKey}:\\s*\\(`)
  : /\n\s+\}\s*\n\s+return getWorkspaceSectionOrder/
  const nextM = text.slice(afterKey).match(nextRe)
  if (!nextM) return null
  const end = afterKey + nextM.index
  let chunk = text.slice(afterKey, end).trimEnd()
  // Strip invalid wrapper: "{cond ? (" at start and ") : null}" at end for conditionals
  chunk = chunk.replace(/^\{([^]+?) \? \(\s*/s, '$1 ? (\n')
  chunk = chunk.replace(/\s*\) : null\}\s*$/s, '\n) : null')
  if (chunk.startsWith('{') && chunk.includes(' ? (')) {
    chunk = chunk.replace(/^\{(.+?) \? \(\s*/s, '$1 ? (\n')
    chunk = chunk.replace(/\s*\) : null\}\s*$/s, '\n) : null')
  }
  return chunk
}

const keyOrder = ['markets', 'founder', 'account', 'owner', 'admin', 'deals', 'tiers', 'access']
const nextKeys = [...keyOrder.slice(1), null]

const sections = {}
for (let i = 0; i < keyOrder.length; i++) {
  const key = keyOrder[i]
  const chunk = extractFromBroken(key, nextKeys[i])
  if (!chunk) {
    console.error('failed extract', key)
    process.exit(1)
  }
  sections[key] = chunk
}

function indentBlock(block, spaces) {
  const pad = ' '.repeat(spaces)
  return block
    .split('\n')
    .map((line) => (line.trim() === '' ? '' : pad + line.trimStart()))
    .join('\n')
}

const innerPad = 14
const entries = keyOrder.map((key) => {
  let value = sections[key]
  // Normalize conditional sections
  if (key === 'founder') {
    value = value.includes('primaryVisualWorkspace')
      ? value
      : `primaryVisualWorkspace === 'founder' ? (\n${value}\n) : null`
  } else if (key === 'account') {
    value = value.includes('showInvestorAccount')
      ? value
      : `showInvestorAccount ? (\n${value}\n) : null`
  } else if (key === 'owner') {
    value = value.includes("primaryVisualWorkspace === 'owner'")
      ? value
      : `primaryVisualWorkspace === 'owner' ? (\n${value}\n) : null`
  } else if (key === 'admin') {
    value = value.includes("primaryVisualWorkspace === 'admin'")
      ? value
      : `primaryVisualWorkspace === 'admin' ? (\n${value}\n) : null`
  } else if (key === 'access') {
    value = value.includes('!currentUser')
      ? value
      : `!currentUser ? (\n${value}\n) : null`
  }

  const indented = indentBlock(value, innerPad)
  return `            ${key}: (\n${indented}\n            ),`
})

const newBlock = [
  '          {renderAdminPanel()}',
  '',
  '          {(() => {',
  '            const workspaceSections = {',
  ...entries,
  '            }',
  '',
  '            return getWorkspaceSectionOrder(primaryVisualWorkspace).map((sectionKey) => (',
  '              <Fragment key={sectionKey}>{workspaceSections[sectionKey]}</Fragment>',
  '            ))',
  '          })()}',
  '',
].join('\n')

const before = lines.slice(0, iStart).join('\n')
const after = lines.slice(iEnd + 1).join('\n')
const out = `${before}\n${newBlock}\n${after}`
fs.writeFileSync(path, out)
console.log('fixed', iStart, iEnd)
