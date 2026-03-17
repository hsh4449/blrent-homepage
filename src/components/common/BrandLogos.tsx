// 현대 - H 엠블럼
export function HyundaiLogo({ size = 28, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className}>
      <ellipse cx="24" cy="24" rx="22" ry="22" fill="none" stroke="currentColor" strokeWidth="3" />
      <path
        d="M14 32 C14 32 18 18 24 14 C30 18 34 32 34 32 M14 22 C18 20 22 19 24 18.5 C26 19 30 20 34 22"
        fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
      />
    </svg>
  )
}

// 기아 - KIA 텍스트
export function KiaLogo({ size = 28, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className}>
      <text
        x="24" y="30" textAnchor="middle"
        fill="currentColor" fontSize="18" fontWeight="800" fontFamily="Arial, sans-serif"
        letterSpacing="-1"
      >
        KIA
      </text>
    </svg>
  )
}

// 르노 - 다이아몬드
export function RenaultLogo({ size = 22, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className}>
      <path d="M24 4 L40 24 L24 44 L8 24 Z" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M24 12 L34 24 L24 36 L14 24 Z" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

// 쌍용 - 날개
export function SsangyongLogo({ size = 22, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className}>
      <path d="M8 30 C12 18 18 14 24 12 C30 14 36 18 40 30" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M12 28 C16 20 20 17 24 16 C28 17 32 20 36 28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// 벤츠 - 삼각별
export function MercedesLogo({ size = 22, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className}>
      <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3" />
      <line x1="24" y1="4" x2="24" y2="24" stroke="currentColor" strokeWidth="2.5" />
      <line x1="24" y1="24" x2="6.7" y2="34" stroke="currentColor" strokeWidth="2.5" />
      <line x1="24" y1="24" x2="41.3" y2="34" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  )
}

// BMW - 원형 4분할
export function BMWLogo({ size = 22, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className}>
      <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3" />
      <line x1="24" y1="4" x2="24" y2="44" stroke="currentColor" strokeWidth="2" />
      <line x1="4" y1="24" x2="44" y2="24" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

// 겹치는 로고 (두 개)
export function OverlappedLogos({ children }: { children: [React.ReactNode, React.ReactNode] }) {
  return (
    <div className="flex items-center -space-x-1.5">
      <div className="relative z-10">{children[0]}</div>
      <div className="relative z-0 opacity-60">{children[1]}</div>
    </div>
  )
}
