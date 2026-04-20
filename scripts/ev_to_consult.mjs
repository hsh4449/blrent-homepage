import fs from 'node:fs'
import path from 'node:path'

const FILE = path.resolve('src/data/vehicles.ts')
let src = fs.readFileSync(FILE, 'utf8')

const NL = src.includes('\r\n') ? '\r\n' : '\n'
const startMarker = `  {${NL}    id: 'v-`
const endMarker = `${NL}  },${NL}`

const blocks = []
let pos = 0
while (true) {
  const s = src.indexOf(startMarker, pos)
  if (s === -1) break
  const e = src.indexOf(endMarker, s)
  if (e === -1) break
  blocks.push({ start: s, end: e + endMarker.length, text: src.slice(s, e + endMarker.length) })
  pos = e + endMarker.length
}

// Models with "EV" in the name
let changed = 0
for (let i = blocks.length - 1; i >= 0; i--) {
  const b = blocks[i]
  const model = b.text.match(/model:\s*'([^']+)'/)?.[1]
  if (!model) continue
  if (!/EV/.test(model)) continue
  const updated = b.text.replace(/monthlyPayment:\s*\d+/, 'monthlyPayment: 0')
  if (updated !== b.text) {
    src = src.slice(0, b.start) + updated + src.slice(b.end)
    changed++
  }
}

fs.writeFileSync(FILE, src)
console.log(`EV models set to 상담문의: ${changed}`)
