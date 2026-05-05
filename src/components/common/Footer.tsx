import { Link } from 'react-router-dom'

const PHONE = import.meta.env.VITE_PHONE_NUMBER || '1234-5678'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Logo & Company */}
          <div className="md:col-span-1">
            <p className="font-display font-black text-3xl md:text-4xl tracking-tighter text-accent leading-none mb-3">
              (주)비엘모빌리티
            </p>
            <p className="flex items-center gap-1.5 text-xs font-bold text-text-secondary mb-5">
              <span className="w-1 h-1 rounded-full bg-accent" />
              <span>비대면 <span className="text-accent">·</span> 무심사 <span className="text-accent">·</span> 장기렌트</span>
            </p>
            <p className="text-sm text-text-muted leading-relaxed">
              대표: 오재영 | 사업자등록번호: 000-00-00000<br />
              충청북도 옥천군 옥천읍 중앙로 32<br />
              info@blrentcar.co.kr
            </p>
          </div>

          {/* Service links */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">서비스</h4>
            <div className="space-y-2.5">
              <Link to="/new-car" className="block text-sm text-text-muted hover:text-text-primary transition-colors">신차 장기렌트</Link>
              <Link to="/used-car" className="block text-sm text-text-muted hover:text-text-primary transition-colors">중고 장기렌트</Link>
              <Link to="/monthly" className="block text-sm text-text-muted hover:text-text-primary transition-colors">월렌트</Link>
            </div>
          </div>

          {/* Support links */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">고객지원</h4>
            <div className="space-y-2.5">
              <Link to="/reviews" className="block text-sm text-text-muted hover:text-text-primary transition-colors">출고 후기</Link>
              <Link to="/support" className="block text-sm text-text-muted hover:text-text-primary transition-colors">고객센터</Link>
              <span className="block text-sm text-text-muted">이용약관</span>
              <span className="block text-sm text-text-muted">개인정보처리방침</span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">상담 안내</h4>
            <p className="text-sm text-text-muted leading-relaxed">
              전화: {PHONE}<br />
              평일 09:00 ~ 18:00<br />
              점심 12:00 ~ 13:00<br />
              주말/공휴일 휴무
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <span className="text-xs text-text-muted">&copy; 2026 (주)비엘모빌리티. All rights reserved.</span>
          <div className="flex items-center gap-4">
            {['카카오', '인스타', '블로그'].map((name) => (
              <span key={name} className="text-xs text-text-muted hover:text-text-primary cursor-pointer transition-colors">{name}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
