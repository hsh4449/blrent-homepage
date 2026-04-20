import fs from 'node:fs'
import path from 'node:path'

const FILE = path.resolve('src/data/vehicles.ts')

// brand + model → 제트카 가격 (20% 할인 적용)
const PRICE_MAP = {
  '현대|아반떼': 430000,
  '현대|싼타페': 650000,
  '현대|코나': 480000,
  '현대|베뉴': 410000,
  '현대|그랜저': 640000,
  '현대|쏘나타': 520000,
  '현대|팰리세이드': 1360000,
  '현대|스타리아': 735000,
  '기아|K8': 630000,
  '기아|쏘렌토': 660000,
  '기아|모닝': 320000,
  '기아|레이': 375000,
  '기아|레이 EV': 520000,
  '기아|셀토스': 455000,
  '기아|스포티지': 535000,
  '제네시스|GV80': 1480000,
  '제네시스|GV70': 885000,
  'KGM|액티언': 575000,
  'KGM|토레스': 575000,
  '르노|아르카나': 390000,
}

let src = fs.readFileSync(FILE, 'utf8')

// 각 vehicle 블록 안에서 brand/model을 추출하고 monthlyPayment를 교체
// 정규식: { ... brand: '...', model: '...', ... monthlyPayment: NNN, ... }
const blockRegex = /\{\s*id:\s*'[^']+',[\s\S]*?\},/g

let changed = 0
let matched = 0
let notMatched = 0

src = src.replace(blockRegex, (block) => {
  const brandMatch = block.match(/brand:\s*'([^']+)'/)
  const modelMatch = block.match(/model:\s*'([^']+)'/)
  if (!brandMatch || !modelMatch) return block

  const key = `${brandMatch[1]}|${modelMatch[1]}`
  const newPrice = PRICE_MAP[key] ?? 0

  if (newPrice > 0) matched++
  else notMatched++

  const updated = block.replace(
    /monthlyPayment:\s*\d+/,
    `monthlyPayment: ${newPrice}`
  )
  if (updated !== block) changed++
  return updated
})

fs.writeFileSync(FILE, src)
console.log(`Total updated: ${changed}`)
console.log(`Matched (priced): ${matched}`)
console.log(`Not matched (상담문의): ${notMatched}`)
