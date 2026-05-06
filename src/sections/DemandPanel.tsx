import { useLithiumData } from '@/hooks/useLithiumData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

const SEGMENTS = [
  {
    id: 'power_battery', name: '动力电池', sub: '乘用车+重卡+两轮/船舶', color: '#1565C0',
    assumption: '全球EV销量2026E 2470万辆(五矿)。国内Q1零售同比-20%但海外+65%。电动重卡渗透率32%。含乘用车74万吨+重卡/商用车25万吨+两轮车/船舶5万吨。',
  },
  {
    id: 'energy_storage', name: '储能电池', sub: 'Q1出货+115%超预期验证', color: '#7c3aed',
    assumption: 'Q1中国储能出货209GWh同比+115%，远超年初预期。中信建投4月上修全年需求+38.3%。含大储35万吨、工商业9万吨、户用6万吨、AIDC 4万吨、便携式2万吨、其他3万吨。',
  },
  {
    id: 'consumer_electronics', name: '消费电子', sub: '稳定存量需求', color: '#64748b',
    assumption: '智能手机出货量12亿部/年趋于平稳；AI手机/PC可能小幅提升单机带电量但整体增量有限。',
  },
  {
    id: 'industrial_other', name: '工业及其他', sub: '陶瓷/润滑脂/医药', color: '#78716c',
    assumption: '传统工业用锂缓慢下滑。陶瓷/玻璃8万吨、润滑脂4万吨、医药/聚合物5万吨。钠离子电池对低端场景替代<3%。',
  },
];

const YEAR_KEYS = ['value2025', 'value2026E', 'value2027E', 'value2028E'] as const;
const YEAR_LABELS = ['2025', '2026E', '2027E', '2028E'];

export default function DemandPanel() {
  const { data } = useLithiumData();

  const rows = SEGMENTS.map(info => {
    const d = data.demandSegments.find(s => s.id === info.id);
    if (!d) return null;
    const inc = Math.round(d.value2028E - d.value2025);
    const cagr = d.value2025 > 0 ? Math.round((Math.pow(d.value2028E / d.value2025, 1 / 3) - 1) * 100) : 0;
    return { ...info, ...d, inc, cagr, source: d.source };
  }).filter(Boolean);

  const total2025 = Math.round(data.demandSegments.reduce((s, d) => s + d.value2025, 0));
  const total2028 = Math.round(data.demandSegments.reduce((s, d) => s + d.value2028E, 0));
  const totalInc = total2028 - total2025;

  // Increment bar data
  const incData = rows.filter(r => r!.inc > 0).map(r => ({
    name: r!.name, value: r!.inc, color: r!.color,
  })).sort((a, b) => b.value - a.value);

  const CustomLabel = (props: any) => {
    const { x, y, width, value } = props;
    if (!value || value <= 0) return null;
    return <text x={x + width + 6} y={y + 13} fill="#555" fontSize={13} fontWeight={600}>+{value}</text>;
  };

  // Total cards
  const totals = YEAR_KEYS.map((key, i) => ({
    year: YEAR_LABELS[i],
    val: Math.round(data.demandSegments.reduce((s, d) => s + d[key], 0)),
  }));

  return (
    <div className="space-y-8">
      {/* Total demand cards */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-6">碳酸锂总需求预测（万吨LCE）</h3>
        <div className="grid grid-cols-4 gap-5">
          {totals.map((t, i) => {
            const shades = ['bg-orange-50 border-orange-200','bg-orange-100 border-orange-300','bg-orange-200 border-orange-400','bg-orange-300 border-orange-500'];
            return (
              <div key={t.year} className={`${shades[i]} rounded-2xl p-6 text-center border`}>
                <div className="text-sm text-slate-600 mb-2">{t.year}</div>
                <div className="text-4xl font-extrabold text-slate-900">{t.val}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Individual segment cards */}
      {rows!.map(row => (
        <div key={row!.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          {/* Header: color dot + name + sub */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-4 h-4 rounded-md flex-shrink-0" style={{ backgroundColor: row!.color }} />
            <div>
              <h4 className="text-base font-bold text-slate-900">{row!.name}</h4>
              <span className="text-xs text-slate-400">{row!.sub}</span>
            </div>
          </div>

          {/* Data row: 4 years + inc + cagr */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-3 text-sm">
            {YEAR_KEYS.map((key, i) => (
              <div key={key} className="text-center">
                <div className="text-xs text-slate-400">{YEAR_LABELS[i]}</div>
                <div className={`font-bold ${i === 1 ? 'text-orange-700' : 'text-slate-700'}`}>{Math.round(row![key])}</div>
              </div>
            ))}
            <div className="w-px h-8 bg-slate-200" />
            <div className="text-center">
              <div className="text-xs text-slate-400">增量(25→28)</div>
              <div className="font-bold text-orange-700">+{row!.inc}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-400">CAGR</div>
              <div className="font-bold text-orange-700">{row!.cagr}%</div>
            </div>
          </div>

          {/* Assumption */}
          <div className="bg-slate-50 rounded-xl px-4 py-3 text-xs text-slate-500 leading-relaxed">
            <span className="font-semibold text-slate-600">假设前提：</span>{row!.assumption}
          </div>
          {row!.source && (
            <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
              <span className="font-medium">数据来源：</span>{row!.source}
            </div>
          )}
        </div>
      ))}

      {/* Increment horizontal bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-6">需求增量驱动因素（2025 → 2028E，合计 +{totalInc} 万吨）</h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={incData} layout="vertical" margin={{ top: 10, right: 80, left: 10, bottom: 10 }} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12, fill: '#888' }} axisLine={{ stroke: '#e0e0e0' }} tickLine={false} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 14, fill: '#333' }} width={100} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontSize: 13, border: '1px solid #e0e0e0', borderRadius: 8 }} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]}>
              {incData.map((e, i) => <Cell key={i} fill={e.color} />)}
              <LabelList content={<CustomLabel />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
