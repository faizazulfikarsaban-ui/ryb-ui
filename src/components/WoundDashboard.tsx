import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { AnalysisResult, WoundCategory } from '../types';
import RYBChart from './RYBChart';

interface WoundDashboardProps {
  onAddHistory: (result: AnalysisResult) => void;
  activeResult: AnalysisResult | null;
  setActiveResult: (result: AnalysisResult | null) => void;
}

const PRESET_CASES = [
  {
    name: "Luka Granulasi Sehat (Preset)",
    desc: "Dominan jaringan merah muda sehat, butuh proteksi kelembapan",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&auto=format&fit=crop&q=60",
    mimeType: "image/jpeg",
    mockData: {
      red: 65, yellow: 35, black: 0,
      dominantText: "Merah (Granulasi)", category: "PROTEKSI" as WoundCategory,
      notes: "Catatan Klinis: Luka menunjukkan sebagian besar jaringan granulasi merah muda (65%), dengan area slough berwarna kuning-putih tersebar di seluruh permukaan luka (35%). Tidak ada jaringan nekrotik hitam (0%). Penggantian balutan teratur direkomendasikan.",
      action: "Gunakan moist dressing untuk mempertahankan hidrasi optimum jaringan granulasi bersih."
    }
  },
  {
    name: "Luka Sloughing Kronis (Preset)",
    desc: "Dominan jaringan kuning slough tebal, butuh pembersihan",
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=500&auto=format&fit=crop&q=60",
    mimeType: "image/jpeg",
    mockData: {
      red: 20, yellow: 60, black: 20,
      dominantText: "Kuning (Slough)", category: "DEBRIDEMENT" as WoundCategory,
      notes: "Catatan Klinis: Dasar luka tertutup oleh lapisan slough berwarna kuning tebal (60%) dengan batas pinggir granulasi merah tipis (20%). Teraba eskar nekrotik hitam kering (20%) di kuadran posterior luka.",
      action: "Lakukan debridement hidrogel (autolitik) atau debridement enzimatik untuk melunakkan eksudat kuning slough."
    }
  },
  {
    name: "Eskar Nekrotik Kering (Preset)",
    desc: "Dominan jaringan hitam keras, butuh nekrektomi/surgical",
    image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&auto=format&fit=crop&q=60",
    mimeType: "image/jpeg",
    mockData: {
      red: 10, yellow: 15, black: 75,
      dominantText: "Hitam (Nekrosis)", category: "NEKREKTOMI" as WoundCategory,
      notes: "Catatan Klinis: Luka tertutup eskar nekrosis hitam kering yang keras dan kaku (75%). Sisi-sisi tepi luka menunjukkan akumulasi slough minor (15%) dengan minim tanda-tanda granulasi (10%).",
      action: "Rekomendasi tindakan nekrektomi tajam (surgical debridement) di kamar bedah diikuti perawatan moist dressing steril."
    }
  }
];

export default function WoundDashboard({ onAddHistory, activeResult, setActiveResult }: WoundDashboardProps) {
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState("");
  const [patientName, setPatientName] = useState("Tn. Budi Wijaya");
  const [patientRM, setPatientRM] = useState("RM-827-2026");
  const [patientAge, setPatientAge] = useState("45");
  const [dragging, setDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileSelect = () => fileInputRef.current?.click();

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) processImageFile(files[0]);
  };

  const handleDragOver = (e: DragEvent) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);
  const handleDrop = (e: DragEvent) => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files.length > 0) processImageFile(e.dataTransfer.files[0]); };

  const processImageFile = (file: File) => {
    if (!file.type.match(/image.*/)) { setErrorMsg("Format file harus berupa gambar (JPG, PNG, WEBP, BMP)."); return; }
    if (file.size > 15 * 1024 * 1024) { setErrorMsg("Ukuran file terlalu besar. Maksimal 15MB."); return; }
    setErrorMsg("");
    setLoading(true);

    const phases = [
      "Mengompresi data piksel gambar klinis...",
      "Mengekstraksi spektrum histogram warna RYB...",
      "Menghubungi kluster AI Gemini...",
      "Merumuskan catatan klinis dan diagnosis taktis...",
      "Menyusun usulan rekomendasi dressing antiseptik..."
    ];
    let currentPhaseIdx = 0;
    setLoadingPhase(phases[0]);
    const phaseInterval = setInterval(() => {
      currentPhaseIdx++;
      if (currentPhaseIdx < phases.length) setLoadingPhase(phases[currentPhaseIdx]);
    }, 1200);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target?.result as string;
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64Data, mimeType: file.type, fileName: file.name })
        });
        if (!response.ok) throw new Error("Gagal menerima diagnosis klinis dari backend.");
        const data: AnalysisResult = await response.json();
        clearInterval(phaseInterval);
        setActiveResult({ ...data, fileSize: `${(file.size / 1024).toFixed(1)} KB`, uploadTime: new Date().toISOString() });
        onAddHistory({ ...data, fileSize: `${(file.size / 1024).toFixed(1)} KB`, uploadTime: new Date().toISOString() });
        setLoading(false);
      } catch (err: any) {
        clearInterval(phaseInterval);
        setLoading(false);
        setErrorMsg("Koneksi gagal: " + err.message);
      }
    };
    reader.onerror = () => { clearInterval(phaseInterval); setLoading(false); setErrorMsg("Gagal membaca file gambar."); };
    reader.readAsDataURL(file);
  };

  const handleLoadPreset = (preset: typeof PRESET_CASES[number]) => {
    setErrorMsg("");
    setLoading(true);
    setLoadingPhase("Mengekstrak file gambar preset sampel...");
    setTimeout(async () => {
      try {
        setLoadingPhase("Menghubungi kluster AI Gemini...");
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: preset.image, mimeType: preset.mimeType, fileName: preset.name })
        });
        if (!response.ok) throw new Error("API offline");
        const data = await response.json();
        setActiveResult(data);
        onAddHistory(data);
        setLoading(false);
      } catch {
        const fallbackResult: AnalysisResult = {
          id: "ryb_" + Math.random().toString(36).substring(2, 9),
          fileName: preset.name, fileSize: "107.1 KB", uploadTime: new Date().toISOString(),
          red: preset.mockData.red, yellow: preset.mockData.yellow, black: preset.mockData.black,
          dominantText: preset.mockData.dominantText, category: preset.mockData.category,
          notes: preset.mockData.notes, action: preset.mockData.action, imageUrl: preset.image
        };
        setActiveResult(fallbackResult);
        onAddHistory(fallbackResult);
        setLoading(false);
      }
    }, 1500);
  };

  const formatReportDate = (timeString: string) => new Date(timeString).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }) + " WIB";

  const handlePrintReport = () => window.print();

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-start bg-[#131b2e]/60 border border-[#3e484f]/25 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary-custom/40 to-transparent"></div>
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Sistem Analisis Luka RYB</h1>
          <p className="text-sm text-on-surface-variant mt-1.5 font-sans">Solusi pemetaan medis berbasis klasifikasi Red-Yellow-Black (RYB) untuk optimasi terapi debridement.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-[#222a3d] border border-[#3e484f]/40 px-3 py-1.5 rounded-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4edea3] inline-block animate-pulse"></span>
          <span className="text-[11px] font-mono tracking-wider font-semibold text-on-surface-variant uppercase">Sistem Aktif</span>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#171f33]/90 border border-[#3e484f]/30 rounded-2xl p-8 text-center space-y-6">
          <div className="relative flex items-center justify-center">
            <span className="absolute w-20 h-20 rounded-full border-4 border-primary-custom/20 animate-ping"></span>
            <div className="w-16 h-16 rounded-full border-4 border-primary-custom border-t-transparent animate-spin"></div>
            <span className="material-symbols-outlined absolute text-primary-custom text-3xl animate-pulse">clinical_notes</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-on-surface">Sedang Menganalisis Jaringan Luka</h3>
            <p className="text-sm text-on-surface-variant mt-2 max-w-sm mx-auto font-mono text-[#8ed5ff]">{loadingPhase}</p>
          </div>
        </div>
      ) : activeResult ? (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-[#171f33]/90 border border-[#3e484f]/30 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#8ed5ff] flex items-center gap-1.5 pb-2.5 border-b border-[#3e484f]/20">
              <span className="material-symbols-outlined text-sm font-semibold">badge</span>Identitas & Parameter Pasien (Opsional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-on-surface-variant uppercase">Nama Lengkap Pasien</label>
                <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)}
                  className="w-full bg-[#0b1326] border border-[#3e484f] rounded-lg p-2 text-xs font-semibold text-on-surface focus:border-primary-custom transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-on-surface-variant uppercase">No. Rekam Medis (RM)</label>
                <input type="text" value={patientRM} onChange={(e) => setPatientRM(e.target.value)}
                  className="w-full bg-[#0b1326] border border-[#3e484f] rounded-lg p-2 text-xs font-semibold text-on-surface focus:border-primary-custom transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-on-surface-variant uppercase">Usia Pasien (Tahun)</label>
                <input type="number" value={patientAge} onChange={(e) => setPatientAge(e.target.value)}
                  className="w-full bg-[#0b1326] border border-[#3e484f] rounded-lg p-2 text-xs font-semibold text-on-surface focus:border-primary-custom transition-all" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#171f33]/90 border border-[#3e484f]/30 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-outline mb-4 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">photo</span>Sumber Gambar Luka
                </h3>
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#060e20] border border-[#3e484f]/40 relative shadow-inner">
                  {activeResult.imageUrl ? (
                    <img src={activeResult.imageUrl} alt="Wound" className="w-full h-full object-cover transition-transform hover:scale-105 duration-300" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-outline-variant">
                      <span className="material-symbols-outlined text-5xl">image_not_supported</span>
                      <span className="text-xs mt-2">Gambar tidak tersedia</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center text-xs text-on-surface-variant font-mono">
                <span>Nama: {activeResult.fileName}</span>
                <span>Ukuran: {activeResult.fileSize}</span>
              </div>
            </div>

            <div className="bg-[#171f33]/90 border border-[#3e484f]/30 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-outline mb-4 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">donut_large</span>Komposisi Jaringan RYB
                </h3>
                <RYBChart red={activeResult.red} yellow={activeResult.yellow} black={activeResult.black} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#171f33]/90 border border-[#3e484f]/30 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-on-surface flex items-center gap-1.5 pb-2.5 border-b border-[#3e484f]/15">
                  <span className="material-symbols-outlined text-primary-custom text-xl">analytics</span>Hasil Analisis Jaringan
                </h2>
                <div className="overflow-hidden rounded-xl border border-[#3e484f]/20 bg-[#131b2e]">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-[#3e484f]/25 bg-[#222a3d]/40 text-xs font-semibold uppercase tracking-wider text-outline">
                        <th className="px-4 py-3 font-mono">Komponen</th>
                        <th className="px-4 py-3 font-mono text-right">Persentase</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#3e484f]/15">
                      {[
                        { label: 'Red (Granulasi)', value: activeResult.red, color: '#f43f5e', shadow: 'rgba(244,63,94,0.4)' },
                        { label: 'Yellow (Slough)', value: activeResult.yellow, color: '#facc15', shadow: 'rgba(250,204,21,0.4)' },
                        { label: 'Black (Nekrosis)', value: activeResult.black, color: '#334155', shadow: 'rgba(255,255,255,0.15)' },
                      ].map(item => (
                        <tr key={item.label}>
                          <td className="px-4 py-3.5 flex items-center gap-2.5 font-medium text-on-surface">
                            <span className="w-3.5 h-3.5 rounded-full inline-block" style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.shadow}` }}></span>
                            {item.label}
                          </td>
                          <td className="px-4 py-3.5 text-right font-mono font-bold text-on-surface">{item.value}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 bg-[#131b2e] rounded-xl border border-[#3e484f]/15 leading-relaxed">
                  <span className="font-bold text-xs text-[#8ed5ff] block mb-1">Catatan Klinis:</span>
                  <p className="text-xs text-on-surface-variant font-sans">{activeResult.notes}</p>
                </div>
              </div>
            </div>

            <div
              className={`bg-[#171f33]/90 border border-[#3e484f]/30 rounded-2xl p-6 shadow-xl border-l-[6px] flex flex-col justify-between ${
                activeResult.category === 'PROTEKSI' ? 'border-l-[#4edea3]' : activeResult.category === 'DEBRIDEMENT' ? 'border-l-[#ffc176]' : 'border-l-[#ffb4ab]'
              }`}>
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-on-surface flex items-center gap-1.5 pb-2.5 border-b border-[#3e484f]/15">
                  <span className="material-symbols-outlined text-[#8ed5ff] text-xl">medical_services</span>Rekomendasi Intervensi
                </h2>
                <div>
                  <span className="text-[10px] font-mono tracking-wider bg-[#222a3d] px-2.5 py-1 rounded-full font-bold uppercase text-on-surface-variant">Status Utama</span>
                  <p className="text-3xl font-bold tracking-tight text-on-surface mt-2.5">{activeResult.category}</p>
                </div>
                <div className="space-y-3.5 mt-4">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-outline text-sm mt-0.5">info</span>
                    <span className="text-xs text-on-surface-variant font-sans">
                      <strong className="text-on-surface">Warna Dominan:</strong> {activeResult.dominantText} ({Math.max(activeResult.red, activeResult.yellow, activeResult.black)}%)
                    </span>
                  </div>
                  <div className="flex items-start gap-2 p-4 bg-[#131b2e]/70 rounded-xl border border-[#3e484f]/20">
                    <span className="material-symbols-outlined text-primary-custom text-lg">ecg</span>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-on-surface block">Indikasi Tindakan:</span>
                      <span className="text-xs text-[#dae2fd] font-sans leading-relaxed block font-medium">{activeResult.action}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-[#3e484f]/15">
                <button onClick={() => setActiveResult(null)}
                  className="bg-[#222a3d] hover:bg-[#2d3449] border border-[#3e484f] text-on-surface text-xs font-bold py-2 px-3.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors">
                  <span className="material-symbols-outlined text-sm">refresh</span>Ulangi Analisis
                </button>
                <button onClick={handlePrintReport}
                  className="bg-primary-custom hover:bg-[#c4e7ff] text-[#001e2c] text-xs font-bold py-2 px-3.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-md">
                  <span className="material-symbols-outlined text-sm">print</span>Cetak Laporan
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          {errorMsg && (
            <div className="p-4 bg-red-950/40 border border-red-500/30 text-red-200 text-sm rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-400">warning</span><span>{errorMsg}</span>
              </div>
              <button onClick={() => setErrorMsg("")} className="text-outline hover:text-white cursor-pointer select-none">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          )}
          <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={triggerFileSelect}
            className={`flex flex-col items-center justify-center py-20 bg-[#171f33]/45 border-2 border-dashed rounded-2xl cursor-pointer p-6 transition-all duration-300 group hover:bg-[#171f33]/70 hover:border-primary-custom/60 ${
              dragging ? 'border-primary-custom bg-primary-custom/10 scale-95' : 'border-[#3e484f]/60'
            }`}>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
            <div className="w-16 h-16 rounded-full bg-[#1e293b]/70 border border-[#3e484f]/40 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#222a3d] transition-all shadow-inner">
              <span className="material-symbols-outlined text-outline group-hover:text-primary-custom text-3xl transition-colors">cloud_upload</span>
            </div>
            <button type="button" className="px-5 py-2.5 bg-primary-custom hover:bg-[#c4e7ff] text-[#001e2c] rounded-xl text-xs font-bold transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">Upload Gambar Luka</button>
            <span className="text-[10px] text-outline font-semibold font-mono uppercase tracking-widest mt-3">Maksimal 15MB per file - JPG, PNG, BMP, WEBP</span>
            <p className="text-sm text-on-surface-variant font-medium mt-6 text-center">Tarik & lepaskan foto luka di sini untuk memulai proses klasifikasi jaringan otomatis</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-outline flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-primary-custom">clinical_notes</span>Demo Sampel Kasus Luka
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PRESET_CASES.map((preset, idx) => (
                <div key={idx} onClick={() => handleLoadPreset(preset)}
                  className="bg-[#171f33]/90 hover:bg-[#222a3d]/90 border border-[#3e484f]/30 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 group hover:-translate-y-1 shadow-md">
                  <div className="h-32 bg-[#060e20] relative overflow-hidden">
                    <img src={preset.image} alt={preset.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#171f33] to-transparent"></div>
                    <div className="absolute top-2.5 right-2.5">
                      <span className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded-full ${
                        preset.mockData.category === 'PROTEKSI' ? 'bg-emerald-900 border border-emerald-500/30 text-emerald-300'
                        : preset.mockData.category === 'DEBRIDEMENT' ? 'bg-amber-900 border border-amber-500/30 text-amber-300'
                        : 'bg-red-950 border border-red-500/30 text-red-300'
                      }`}>{preset.mockData.category}</span>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <h4 className="text-xs font-bold text-on-surface group-hover:text-primary-custom transition-colors">{preset.name}</h4>
                    <p className="text-[11px] text-on-surface-variant font-sans leading-relaxed">{preset.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
