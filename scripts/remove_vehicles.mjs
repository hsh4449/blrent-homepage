import fs from 'node:fs'
import path from 'node:path'

const FILE = path.resolve('src/data/vehicles.ts')
const REMOVE = new Set([
  '기아|EV3 GT',
  '기아|EV4 GT',
  '기아|EV5 GT',
  '기아|EV6 GT',
  '기아|EV9 GT',
])

const src = fs.readFileSync(FILE, 'utf8')

// Find each vehicle block: starts with "  {\n    id: 'v-" and ends with "\n  },\n"
// Use indexOf-based splitting to preserve exact whitespace
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

console.log(`Found ${blocks.length} vehicle blocks`)

let removed = 0
const toRemove = []
for (const b of blocks) {
  const brand = b.text.match(/brand:\s*'([^']+)'/)?.[1]
  const model = b.text.match(/model:\s*'([^']+)'/)?.[1]
  if (brand && model && REMOVE.has(`${brand}|${model}`)) {
    toRemove.push(b)
    removed++
  }
}

// Remove in reverse order to preserve indices
let out = src
for (let i = toRemove.length - 1; i >= 0; i--) {
  const b = toRemove[i]
  out = out.slice(0, b.start) + out.slice(b.end)
}

fs.writeFileSync(FILE, out)
console.log(`Removed: ${removed}`)
