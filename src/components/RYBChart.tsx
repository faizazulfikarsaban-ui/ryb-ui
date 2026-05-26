import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface RYBChartProps {
  red: number;
  yellow: number;
  black: number;
}

export default function RYBChart({ red, yellow, black }: RYBChartProps) {
  const rawData = [
    { name: 'Merah (Granulasi)', value: red, color: '#f43f5e' },
    { name: 'Kuning (Slough)', value: yellow, color: '#facc15' },
    { name: 'Hitam (Nekrosis)', value: black, color: '#334155' },
  ];
  const data = rawData.filter(item => item.value > 0);
  const chartData = data.length > 0 ? data : [{ name: 'Belum dianalisis', value: 100, color: '#1e293b' }];

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full h-[220px] relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" innerRadius={65} outerRadius={85} paddingAngle={2} dataKey="value" animationDuration={800}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#171f33" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#171f33', borderColor: '#3e484f', borderRadius: '8px', color: '#dae2fd', fontSize: '12px', fontFamily: 'Geist, sans-serif' }}
              formatter={(value: any) => [`${value}%`]} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold font-mono text-[#8ed5ff]">{red + yellow + black > 0 ? `${Math.round(red)}%` : '0%'}</span>
          <span className="text-[10px] uppercase tracking-wider text-[#bdc8d1] font-sans font-semibold">Granulasi</span>
        </div>
      </div>
      <div className="w-full mt-4 space-y-2">
        {[
          { label: 'Merah (Granulasi)', value: red, color: '#f43f5e', shadow: 'rgba(244,63,94,0.4)' },
          { label: 'Kuning (Slough)', value: yellow, color: '#facc15', shadow: 'rgba(250,204,21,0.4)' },
          { label: 'Hitam (Nekrosis)', value: black, color: '#334155', shadow: 'rgba(255,255,255,0.1)' },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between text-xs px-2 py-1 rounded-md bg-[#131b2e] border border-outline-variant/20 hover:border-outline-variant/40 transition-colors">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.shadow}` }}></span>
              <span className="text-on-surface-variant font-medium">{item.label}</span>
            </div>
            <span className="font-mono font-bold text-[#dae2fd]">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
