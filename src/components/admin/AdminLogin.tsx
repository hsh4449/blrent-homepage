import { useState, type FormEvent } from 'react';
import { useAdmin } from '../../contexts/AdminContext';

export default function AdminLogin() {
  const { login } = useAdmin();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    setTimeout(() => {
      const success = login(password);
      if (!success) {
        setError(true);
        setPassword('');
      }
      setLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            BL<span className="text-accent">렌트카</span>
          </h1>
          <p className="text-text-secondary mt-2 text-sm">관리자 로그인</p>
        </div>

        {/* Login Card */}
        <div className="glass rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="admin-password"
                className="block text-sm font-medium text-text-secondary mb-2"
              >
                관리자 비밀번호
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="비밀번호를 입력하세요"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-colors"
                autoFocus
              />
              {error && (
                <p className="mt-2 text-sm text-red-400">
                  비밀번호가 올바르지 않습니다.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? '확인 중...' : '로그인'}
            </button>
          </form>
        </div>

        <p className="text-center text-text-muted text-xs mt-6">
          권한이 없는 접근은 제한됩니다.
        </p>
      </div>
    </div>
  );
}
