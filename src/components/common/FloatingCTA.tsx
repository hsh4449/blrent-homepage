import { Phone } from 'lucide-react'
import { motion } from 'framer-motion'

const PHONE = import.meta.env.VITE_PHONE_NUMBER || '1234-5678'
const KAKAO_URL = import.meta.env.VITE_KAKAO_CHANNEL_URL || 'https://open.kakao.com/o/sM1Ctzti'

function KakaoIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 3C6.48 3 2 6.48 2 11.18c0 2.85 1.91 5.36 4.81 6.83-.13.49-.81 3.07-.92 3.5 0 0-.02.16.09.22.11.06.23.02.23.02.32-.05 3.79-2.49 4.39-2.92.46.07.92.11 1.4.11 5.52 0 10-3.66 10-8.18S17.52 3 12 3z" />
    </svg>
  )
}

export default function FloatingCTA() {
  return (
    <div className="fixed right-3 bottom-20 sm:right-4 sm:bottom-8 z-40 flex flex-col gap-2 sm:gap-3">
      <motion.a
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        href={KAKAO_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="카카오톡 상담"
        className="flex items-center gap-2 pl-3 pr-4 py-2.5 sm:pl-4 sm:pr-5 sm:py-3 rounded-full bg-kakao text-kakao-text font-bold text-xs sm:text-sm shadow-lg shadow-kakao/30"
      >
        <KakaoIcon size={18} />
        <span className="whitespace-nowrap">카톡 상담</span>
      </motion.a>
      <motion.a
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        href={`tel:${PHONE}`}
        aria-label="전화 상담"
        className="flex items-center gap-2 pl-3 pr-4 py-2.5 sm:pl-4 sm:pr-5 sm:py-3 rounded-full bg-accent text-white font-bold text-xs sm:text-sm shadow-lg shadow-accent/30"
      >
        <Phone size={18} strokeWidth={2.5} />
        <span className="whitespace-nowrap">전화 상담</span>
      </motion.a>
    </div>
  )
}
