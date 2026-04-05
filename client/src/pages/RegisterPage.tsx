import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { CheckSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(username, email, password);
      navigate('/login');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string; issues?: { message: string }[] } } };
      const issues = axiosErr.response?.data?.issues;
      setError(issues ? issues.map((i) => i.message).join(', ') : axiosErr.response?.data?.message ?? 'Kayıt başarısız.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-[#F0F7FF] dark:bg-[#0D1B2E] border border-[#85B7EB] dark:border-[#1E3A5F] rounded-lg px-3 py-2.5 text-[13px] text-[#0C447C] dark:text-[#E8F1FF] placeholder-[#85B7EB] outline-none focus:border-[#3B82F6] transition-colors';
  const labelClass = 'block text-[12px] font-medium text-[#185FA5] dark:text-[#7BA3D4] mb-1';

  return (
    <div className="min-h-screen bg-[#F0F7FF] dark:bg-[#0D1B2E] flex items-center justify-center p-4">
      <div className="w-full max-w-[360px] bg-white dark:bg-[#122040] border border-[#B5D4F4] dark:border-[#1E3A5F] rounded-xl p-6 shadow-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#3B82F6] flex items-center justify-center mb-3">
            <CheckSquare size={20} className="text-white" />
          </div>
          <h1 className="text-[15px] font-medium text-[#0C447C] dark:text-[#E8F1FF]">TaskBoard</h1>
          <p className="text-[12px] text-[#85B7EB] dark:text-[#4A6FA5] mt-0.5">Yeni hesap oluşturun</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className={labelClass}>Kullanıcı Adı</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={inputClass}
              placeholder="kullaniciadi"
            />
          </div>
          <div>
            <label className={labelClass}>E-posta</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
              placeholder="ornek@email.com"
            />
          </div>
          <div>
            <label className={labelClass}>Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={inputClass}
              placeholder="En az 6 karakter"
            />
          </div>

          {error && <p className="text-red-500 text-[12px]">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3B82F6] text-white rounded-lg py-2.5 text-[13px] font-medium hover:bg-blue-600 transition-colors disabled:opacity-60 mt-1"
          >
            {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#B5D4F4] dark:border-[#1E3A5F]" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white dark:bg-[#122040] px-2 text-[11px] text-[#85B7EB] dark:text-[#4A6FA5]">veya</span>
          </div>
        </div>

        <p className="text-center text-[12px] text-[#85B7EB] dark:text-[#4A6FA5]">
          Zaten hesabınız var mı?{' '}
          <Link to="/login" className="text-[#3B82F6] hover:underline font-medium">
            Giriş yap
          </Link>
        </p>
      </div>
    </div>
  );
}
