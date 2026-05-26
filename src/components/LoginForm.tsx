import { useState, FormEvent } from 'react';

interface LoginFormProps {
  onLoginSuccess: (email: string) => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('perawat@rumahsakit.id');
  const [password, setPassword] = useState('12345678');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) { setError('Silakan masukkan email atau username Anda.'); return; }
    setLoading(true);
    setError('');
    setTimeout(() => { setLoading(false); onLoginSuccess(email); }, 600);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 overflow-hidden bg-surface-container-lowest font-sans">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[600px] bg-primary-custom/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary-custom/5 rounded-full blur-[100px] pointer-events-none"></div>
      <main className="w-full max-w-md z-10 relative px-4">
        <div className="bg-surface/60 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-8 shadow-2xl flex flex-col gap-6 relative overflow-hidden bg-[#0b1326]/65">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary-custom/50 to-transparent"></div>
          <div className="flex flex-col items-center text-center gap-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-11 h-11 rounded-lg bg-[#222a3d] border border-[#3e484f]/50 flex items-center justify-center shadow-inner">
                <span className="material-symbols-outlined text-primary-custom text-2xl !fill-1">monitor_heart</span>
              </div>
              <span className="text-xl font-bold text-on-surface tracking-tight">RYB Analyzer</span>
            </div>
            <div>
              <h1 className="text-2xl text-on-surface font-semibold tracking-tight">Selamat Datang Kembali</h1>
              <p className="text-sm text-on-surface-variant mt-1 font-sans">Masuk ke portal analisis klinis Anda</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
            {error && <div className="p-3 text-xs bg-red-950/40 border border-red-500/30 text-red-300 rounded-lg">{error}</div>}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface-variant" htmlFor="email">Email / Username</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary-custom transition-colors text-lg">mail</span>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#222a3d] border border-[#3e484f] rounded-lg py-2.5 pl-10 pr-4 text-on-surface focus:outline-none focus:border-primary-custom focus:ring-1 focus:ring-primary-custom transition-all text-sm placeholder:text-outline/50 shadow-inner"
                  placeholder="perawat@rumahsakit.id" required />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-on-surface-variant" htmlFor="password">Kata Sandi</label>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Silakan hubungi admin rumah sakit untuk menyetel ulang kata sandi.'); }}
                  className="text-xs text-primary-custom hover:underline transition-colors font-medium">Lupa Kata Sandi?</a>
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary-custom transition-colors text-lg">lock</span>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#222a3d] border border-[#3e484f] rounded-lg py-2.5 pl-10 pr-4 text-on-surface focus:outline-none focus:border-primary-custom focus:ring-1 focus:ring-primary-custom transition-all text-sm placeholder:text-outline/50 shadow-inner"
                  placeholder="12345678" required />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-primary-custom text-on-primary-fixed py-2.5 rounded-lg text-sm font-bold hover:bg-[#c4e7ff] text-[#001e2c] transition-colors mt-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] flex items-center justify-center gap-2 group cursor-pointer">
              <span>{loading ? 'Menghubungkan...' : 'Masuk'}</span>
              <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </form>
          <div className="text-center pt-4 border-t border-[#3e484f]/20">
            <p className="text-xs text-on-surface-variant font-sans">Butuh bantuan?{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Layanan Dukungan IT Rumah Sakit tersedia di Ekstensi 104.'); }}
                className="text-primary-custom hover:underline font-medium">Hubungi Dukungan IT</a></p>
          </div>
        </div>
      </main>
      <footer className="w-full text-center px-4 z-10 relative mt-12 mb-4">
        <div className="flex items-center justify-center gap-1 text-outline mb-1">
          <span className="material-symbols-outlined text-sm">info</span>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-outline-variant">Penafian Sistem</span>
        </div>
        <p className="font-sans text-xs text-outline/80 max-w-lg mx-auto leading-relaxed">Hasil ini bersifat bantuan klinis, bukan pengganti penilaian tenaga medis.</p>
      </footer>
    </div>
  );
}
