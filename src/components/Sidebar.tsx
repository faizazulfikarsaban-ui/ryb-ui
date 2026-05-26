import { UserProfile } from '../types';

interface SidebarProps {
  activeTab: 'dashboard' | 'history' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'history' | 'settings') => void;
  user: UserProfile;
  onLogout: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, user, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: 'dashboard' },
    { id: 'history' as const, label: 'Riwayat Analisis', icon: 'history' },
    { id: 'settings' as const, label: 'Pengaturan', icon: 'settings' },
  ];

  return (
    <aside className="w-64 bg-[#060e20] border-r border-[#3e484f]/30 flex flex-col justify-between h-screen fixed left-0 top-0 z-20">
      <div>
        <div className="p-6 border-b border-[#3e484f]/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#222a3d] border border-[#3e484f]/40 flex items-center justify-center shadow-inner">
            <span className="material-symbols-outlined text-primary-custom text-xl !fill-1 animate-pulse">monitor_heart</span>
          </div>
          <div>
            <h2 className="font-bold text-on-surface text-base tracking-tight leading-none mb-1">RYB Analyzer</h2>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#bdc8d1]/60">Clinical Portal</span>
          </div>
        </div>
        <nav className="p-4 space-y-1 mt-4">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all group relative cursor-pointer ${
                  isActive
                    ? 'bg-[#171f33]/80 text-[#8ed5ff] border-l-4 border-l-[#8ed5ff] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-[#131b2e]/50'
                }`}>
                <span className={`material-symbols-outlined text-xl transition-colors ${isActive ? 'text-primary-custom !fill-1' : 'text-outline group-hover:text-on-surface'}`}>{item.icon}</span>
                <span>{item.label}</span>
                {isActive && <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-primary-custom shadow-[0_0_8px_#8ed5ff]"></span>}
              </button>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-[#3e484f]/20 bg-[#0b1326]/40">
        <div className="flex items-center justify-between p-2 rounded-xl bg-[#131b2e]/65 border border-[#3e484f]/15 relative group">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#222a3d] border border-[#3e484f]/50 flex items-center justify-center overflow-hidden">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-primary-custom text-lg">person</span>
              )}
            </div>
            <div>
              <div className="font-semibold text-xs text-on-surface tracking-tight leading-none mb-1 text-ellipsis overflow-hidden whitespace-nowrap max-w-[120px]">{user.name}</div>
              <div className="text-[10px] font-mono text-[#4edea3] uppercase font-semibold">{user.role}</div>
            </div>
          </div>
          <button onClick={onLogout} title="Keluar dari portal"
            className="p-1.5 rounded-md hover:bg-[#222a3d] text-outline hover:text-red-400 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-base">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
