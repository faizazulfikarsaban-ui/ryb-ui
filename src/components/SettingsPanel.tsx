import { useState, useEffect, FormEvent } from 'react';
import { UserProfile, SystemConfig } from '../types';

interface SettingsPanelProps {
  user: UserProfile;
  onChangeUser: (user: UserProfile) => void;
  config: SystemConfig;
  onChangeConfig: (config: SystemConfig) => void;
}

export default function SettingsPanel({ user, onChangeUser, config, onChangeConfig }: SettingsPanelProps) {
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [email, setEmail] = useState(user.email);
  const [hospital, setHospital] = useState('RS Dustira Cimahi');
  const [submitting, setSubmitting] = useState(false);
  const [apiStatus, setApiStatus] = useState<'checking' | 'active' | 'inactive'>('checking');

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setApiStatus(data.apiReady ? 'active' : 'inactive'))
      .catch(() => setApiStatus('inactive'));
  }, []);

  const handleSaveUser = (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      onChangeUser({ ...user, name, role, email });
      setSubmitting(false);
      alert('Profil klinis berhasil diperbarui!');
    }, 400);
  };

  const toggleAutoSave = () => onChangeConfig({ ...config, autoSave: !config.autoSave });
  const toggleAlerts = () => onChangeConfig({ ...config, enableAlerts: !config.enableAlerts });

  return (
    <div className="space-y-6">
      <div className="bg-[#131b2e]/60 border border-[#3e484f]/20 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-on-surface tracking-tight">Pengaturan Sistem</h1>
        <p className="text-sm text-on-surface-variant mt-1.5">Profile Tenaga Kesehatan</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#171f33]/90 border border-[#3e484f]/20 rounded-2xl p-6 space-y-5">
            <h2 className="text-base font-bold text-on-surface flex items-center gap-2 pb-3 border-b border-[#3e484f]/15">
              <span className="material-symbols-outlined text-primary-custom">clinical_notes</span>Profile Identitas
            </h2>
            <form onSubmit={handleSaveUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Nama</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#1e293b]/70 border border-[#3e484f]/80 rounded-lg p-2.5 text-sm text-[#dae2fd] focus:outline-none focus:border-primary-custom transition-all" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Sertifikasi / Spesialisasi</label>
                  <input type="text" value={role} onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-[#1e293b]/70 border border-[#3e484f]/80 rounded-lg p-2.5 text-sm text-[#dae2fd] focus:outline-none focus:border-primary-custom transition-all" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Username / Email Klinis</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#1e293b]/70 border border-[#3e484f]/80 rounded-lg p-2.5 text-sm text-[#dae2fd] focus:outline-none focus:border-primary-custom transition-all" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Rumah Sakit / Instansi</label>
                  <input type="text" value={hospital} onChange={(e) => setHospital(e.target.value)}
                    className="w-full bg-[#1e293b]/70 border border-[#3e484f]/80 rounded-lg p-2.5 text-sm text-[#dae2fd] focus:outline-none focus:border-primary-custom transition-all" required />
                </div>
              </div>
              <button type="submit" disabled={submitting}
                className="bg-primary-custom hover:bg-[#c4e7ff] text-[#001e2c] font-bold text-xs py-2 px-4 rounded-lg flex items-center gap-1.5 cursor-pointer mt-4 transition-colors">
                <span className="material-symbols-outlined text-sm">save</span>
                {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </form>
          </div>

          <div className="bg-[#171f33]/90 border border-[#3e484f]/20 rounded-2xl p-6 space-y-5">
            <h2 className="text-base font-bold text-on-surface flex items-center gap-2 pb-3 border-b border-[#3e484f]/15">
              <span className="material-symbols-outlined text-primary-custom font-medium">settings_bento</span>Pengaturan Alur Kerja Portal
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3.5 bg-[#131b2e]/60 rounded-xl border border-[#3e484f]/15">
                <div>
                  <h4 className="text-sm font-bold text-on-surface">Auto-Save Analisis ke Riwayat</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">Secara otomatis menyimpan hasil kalkulasi klasifikasi luka ke rekam medis riwayat lokal.</p>
                </div>
                <button type="button" onClick={toggleAutoSave}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors focus:outline-none relative cursor-pointer ${config.autoSave ? 'bg-[#4edea3]' : 'bg-[#3e484f]'}`}>
                  <span className={`block w-5 h-5 rounded-full bg-white transition-transform ${config.autoSave ? 'translate-x-5' : 'translate-x-0'}`}></span>
                </button>
              </div>
              <div className="flex justify-between items-center p-3.5 bg-[#131b2e]/60 rounded-xl border border-[#3e484f]/15">
                <div>
                  <h4 className="text-sm font-bold text-on-surface">Notifikasi Peringatan Debridement</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">Aktifkan pop-up pemberitahuan instan jika jaringan nekrotik/hitam luka terdeteksi tinggi.</p>
                </div>
                <button type="button" onClick={toggleAlerts}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors focus:outline-none relative cursor-pointer ${config.enableAlerts ? 'bg-[#4edea3]' : 'bg-[#3e484f]'}`}>
                  <span className={`block w-5 h-5 rounded-full bg-white transition-transform ${config.enableAlerts ? 'translate-x-5' : 'translate-x-0'}`}></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#171f33]/90 border border-[#3e484f]/30 rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-outline mb-1">Status Sistem</h2>
            <div className="flex items-center gap-3 p-4 bg-[#131b2e] rounded-xl border border-[#3e484f]/25">
              <div className="w-3.5 h-3.5 rounded-full animate-pulse bg-[#4edea3]"></div>
              <div>
                <div className="text-xs font-bold text-on-surface">Sistem Active</div>
              </div>
            </div>
            <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-yellow-300 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm font-medium">warning</span>Kebebasan Evaluasi Medis
              </h4>
              <p className="text-[11px] text-[#bdc8d1] leading-relaxed">
                Platform ini ditujukan murni untuk pendamping pembantu diagnosis klinis. Penilaian langsung dokter bedah atau perawat spesialis luka tatap muka tetap merupakan referensi primer mutlak.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
