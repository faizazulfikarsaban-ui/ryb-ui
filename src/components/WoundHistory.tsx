import { AnalysisResult } from '../types';

interface WoundHistoryProps {
  history: AnalysisResult[];
  onSelectResult: (result: AnalysisResult) => void;
  onDeleteResult: (id: string) => void;
}

export default function WoundHistory({ history, onSelectResult, onDeleteResult }: WoundHistoryProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#131b2e]/60 border border-[#3e484f]/20 rounded-2xl p-6">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Riwayat Analisis Luka</h1>
          <p className="text-sm text-on-surface-variant mt-1">Daftar lengkap rekam medis jaringan luka RYB yang pernah dianalisis.</p>
        </div>
        <div className="bg-[#222a3d] px-4 py-2 border border-[#3e484f]/30 rounded-xl flex items-center gap-2">
          <span className="material-symbols-outlined text-primary-custom text-sm">database</span>
          <span className="font-mono text-xs font-semibold text-on-surface">Total Record: {history.length}</span>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-surface/40 border border-[#3e484f]/20 rounded-2xl">
          <span className="material-symbols-outlined text-outline/40 text-6xl mb-4">folder_open</span>
          <h3 className="text-base font-semibold text-on-surface">Data Riwayat Alur Kosong</h3>
          <p className="text-sm text-on-surface-variant max-w-sm text-center mt-1">Belum ada rekam analisis jaringan wound RYB yang tersimpan. Silakan upload dan lakukan analisis baru.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {history.map((item) => {
            const dateStr = new Date(item.uploadTime).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            return (
              <div key={item.id} className="bg-[#171f33]/90 hover:bg-[#222a3d]/80 border border-[#3e484f]/30 rounded-2xl overflow-hidden transition-all duration-300 group shadow-lg flex flex-col justify-between">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-mono text-[#8ed5ff] bg-[#222a3d] px-2.5 py-1 rounded-md border border-[#3e484f]/50">ID: {item.id}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full inline-block ${item.category === 'PROTEKSI' ? 'bg-[#4edea3]' : item.category === 'DEBRIDEMENT' ? 'bg-[#ffc176]' : 'bg-[#ffb4ab]'}`}></span>
                      <span className="text-xs font-semibold uppercase text-on-surface-variant font-mono">{item.category}</span>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#060e20] flex-shrink-0 border border-[#3e484f]/40 relative">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt="Wound" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><span className="material-symbols-outlined text-outline/50">image</span></div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-[#dae2fd] truncate group-hover:text-primary-custom transition-colors">{item.fileName}</h3>
                      <p className="text-xs text-on-surface-variant truncate mt-1">{dateStr} - {item.fileSize}</p>
                      <div className="flex h-1.5 rounded-full overflow-hidden mt-3 bg-[#1e293b]">
                        <div className="bg-[#f43f5e] h-full" style={{ width: `${item.red}%` }}></div>
                        <div className="bg-[#facc15] h-full" style={{ width: `${item.yellow}%` }}></div>
                        <div className="bg-[#334155] h-full" style={{ width: `${item.black}%` }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-[#131b2e]/60 rounded-xl border border-[#3e484f]/15">
                    <p className="text-xs text-on-surface-variant line-clamp-2">{item.notes}</p>
                  </div>
                </div>
                <div className="px-6 py-4 bg-[#0b1326]/50 border-t border-[#3e484f]/15 flex justify-between items-center">
                  <button onClick={() => onSelectResult(item)} className="flex items-center gap-1.5 text-xs text-primary-custom hover:underline font-semibold cursor-pointer">
                    <span className="material-symbols-outlined text-sm">visibility</span>Lihat Laporan Detail
                  </button>
                  <button onClick={() => onDeleteResult(item.id)} className="p-1 px-2 hover:bg-red-950/30 text-outline hover:text-red-400 rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer">
                    <span className="material-symbols-outlined text-sm">delete</span>Hapus
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
