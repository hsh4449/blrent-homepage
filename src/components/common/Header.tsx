import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Menu, X } from 'lucide-react'

const NAV_ITEMS = [
  { label: '신차장기렌트', path: '/new-car' },
  { label: '중고장기렌트', path: '/used-car' },
  { label: '월렌트', path: '/monthly' },
  { label: '출고후기', path: '/reviews' },
  { label: '고객센터', path: '/support' },
]

const PHONE = import.meta.env.VITE_PHONE_NUMBER || '1234-5678'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 bg-white border-b transition-shadow ${scrolled ? 'shadow-sm border-gray-200' : 'border-gray-100'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex flex-col items-center leading-tight group">
            <span className="font-display font-black text-base md:text-lg tracking-tighter text-accent">비엘 모빌리티</span>
            <span className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold text-text-secondary">
              <span className="w-1 h-1 rounded-full bg-accent" />
              <span>비대면 <span className="text-accent">·</span> 무심사 <span className="text-accent">·</span> 장기렌트</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'text-accent bg-accent/10'
                    : 'text-text-secondary hover:text-text-primary hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:${PHONE}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-gray-100 transition-all"
            >
              <Phone size={16} />
              <span>{PHONE}</span>
            </a>
            <Link
              to="/support"
              className="px-5 py-2.5 bg-accent text-white text-sm font-semibold rounded-xl hover:bg-accent-hover transition-all glow-accent-sm"
            >
              상담 신청
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-gray-100 transition-all"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[85vw] bg-white border-l border-gray-200 lg:hidden shadow-xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <span className="font-display font-bold text-text-primary">메뉴</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="p-4 space-y-1">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      location.pathname === item.path
                        ? 'text-accent bg-accent/10'
                        : 'text-text-secondary hover:text-text-primary hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="p-4 space-y-3 border-t border-gray-100">
                <a
                  href={`tel:${PHONE}`}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-text-primary"
                >
                  <Phone size={16} />
                  전화 상담 {PHONE}
                </a>
                <Link
                  to="/support"
                  className="block text-center w-full py-3 bg-accent text-white rounded-xl text-sm font-semibold hover:bg-accent-hover transition-all"
                >
                  상담 신청
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
