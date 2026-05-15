'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await signIn('credentials', {
      email, password, redirect: false,
    });
    if (res?.ok) {
      router.push('/admin');
    } else {
      setError('Invalid email or password.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="font-serif text-3xl font-bold text-white mb-2">
            Core <span className="text-[#C94F2C]">Lane</span>
          </div>
          <div className="text-xs tracking-widest uppercase text-white/30">Admin Panel</div>
        </div>

        <form onSubmit={handleLogin} className="bg-white/5 border border-white/10 p-8 rounded-sm">
          <h2 className="font-serif text-2xl font-light italic text-white mb-6">Sign In</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-4 py-3 rounded-sm mb-6">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-xs tracking-widest uppercase text-white/40 font-semibold mb-2">Email</label>
            <input
              type="email" required value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C94F2C] transition-colors"
              placeholder="admin@corelane.com"
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs tracking-widest uppercase text-white/40 font-semibold mb-2">Password</label>
            <input
              type="password" required value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C94F2C] transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-[#C94F2C] text-white py-4 text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-[#C94F2C] transition-colors disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>
      </div>
    </div>
  );
}