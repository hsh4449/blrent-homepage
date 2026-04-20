import fs from 'node:fs'
import path from 'node:path'

const FILE = path.resolve('src/data/vehicles.ts')

// harmonydirect.co.kr 신차장기렌트 (페이지 1~5 전체 스크레이핑) 최저가 * 0.85 (15% 할인)
const PRICE_MAP = {
  // 현대
  '현대|베뉴': 420000,
  '현대|아반떼': 450000,
  '현대|팰리세이드': 820000,
  '현대|그랜저': 680000,
  '현대|그랜저 하이브리드': 710000,
  '현대|코나': 583000,
  '현대|캐스퍼': 350000,
  '현대|투싼': 476000,
  '현대|쏘나타': 442000,
  '현대|싼타페': 870000,
  // 기아
  '기아|레이': 445000,
  '기아|모닝': 389000,
  '기아|스포티지': 622000,
  '기아|스포티지 하이브리드': 750000,
  '기아|쏘렌토': 796000,
  '기아|쏘렌토 하이브리드': 895000,
  '기아|카니발': 754000,
  '기아|K5': 588000,
  '기아|셀토스': 578000,
  '기아|EV3': 783000,
  '기아|EV4': 762000,
  // 제네시스
  '제네시스|GV80': 1213000,
  '제네시스|G80': 1213000,
  '제네시스|GV70': 825000,
}

let src = fs.readFileSync(FILE, 'utf8')

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
