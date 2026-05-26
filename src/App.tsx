import { useState, useEffect } from 'react';
import { AnalysisResult, UserProfile, SystemConfig } from './types';
import LoginForm from './components/LoginForm';
import Sidebar from './components/Sidebar';
import WoundDashboard from './components/WoundDashboard';
import WoundHistory from './components/WoundHistory';
import SettingsPanel from './components/SettingsPanel';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile>({
    name: 'Ns. User',
    role: 'Perawat tersertifikasi',
    email: 'perawat@rumahsakit.id',
    avatarUrl: ''
  });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'settings'>('dashboard');
  const [activeResult, setActiveResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [config, setConfig] = useState<SystemConfig>({
    autoSave: true,
    defaultTemplate: 'Standard RYB',
    enableAlerts: true,
  });

  useEffect(() => {
    const savedHistory = localStorage.getItem('ryb_clinical_history');
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch {}
    }
    const savedUser = localStorage.getItem('ryb_clinician_user');
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch {}
    }
    const savedConfig = localStorage.getItem('ryb_system_config');
    if (savedConfig) {
      try { setConfig(JSON.parse(savedConfig)); } catch {}
    }
    const savedSession = sessionStorage.getItem('ryb_session_logged_in');
    if (savedSession === 'true') setIsLoggedIn(true);
  }, []);

  const handleLoginSuccess = (email: string) => {
    const defaultUser = { ...user, email, lastLogin: new Date().toISOString() };
    setUser(defaultUser);
    setIsLoggedIn(true);
    sessionStorage.setItem('ryb_session_logged_in', 'true');
    localStorage.setItem('ryb_clinician_user', JSON.stringify(defaultUser));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('ryb_session_logged_in');
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    localStorage.setItem('ryb_clinician_user', JSON.stringify(updatedUser));
  };

  const handleUpdateConfig = (updatedConfig: SystemConfig) => {
    setConfig(updatedConfig);
    localStorage.setItem('ryb_system_config', JSON.stringify(updatedConfig));
  };

  const handleAddHistory = (result: AnalysisResult) => {
    if (!config.autoSave) return;
    const exists = history.some(item => item.id === result.id);
    if (exists) return;
    if (config.enableAlerts && result.black >= 40) {
      alert(`Peringatan Klinis: Terdeteksi persentase necrosis tinggi (${result.black}%) pada luka pasien! Tindakan nekrektomi surgical diusulkan.`);
    }
    const updated = [result, ...history];
    setHistory(updated);
    localStorage.setItem('ryb_clinical_history', JSON.stringify(updated));
  };

  const handleDeleteResult = (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus catatan rekam medis luka ini?')) return;
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('ryb_clinical_history', JSON.stringify(updated));
    if (activeResult?.id === id) setActiveResult(null);
  };

  const handleSelectHistoryReport = (result: AnalysisResult) => {
    setActiveResult(result);
    setActiveTab('dashboard');
  };

  if (!isLoggedIn) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={handleLogout} />
      <main className="pl-64 min-h-screen font-sans">
        <div className="max-w-[1200px] mx-auto p-6 md:p-8">
          {activeTab === 'dashboard' && (
            <WoundDashboard onAddHistory={handleAddHistory} activeResult={activeResult} setActiveResult={setActiveResult} />
          )}
          {activeTab === 'history' && (
            <WoundHistory history={history} onSelectResult={handleSelectHistoryReport} onDeleteResult={handleDeleteResult} />
          )}
          {activeTab === 'settings' && (
            <SettingsPanel user={user} onChangeUser={handleUpdateUser} config={config} onChangeConfig={handleUpdateConfig} />
          )}
        </div>
      </main>
    </div>
  );
}
