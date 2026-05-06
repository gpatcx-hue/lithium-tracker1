import { useLithiumData } from '@/hooks/useLithiumData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList, ReferenceLine } from 'recharts';

const SEGMENTS = [
  { id: 'australia', name: '澳洲锂辉石', sub: '全球最大产区，远期增速放缓', color: '#1565C0',
    assumption: 'CGP3爬坡中，但远期无大规模待投产矿山。2026-2030年CAGR不足10%。部分矿区面临柴油短缺问题。' },
  { id: 'chile', name: '智利盐湖', sub: 'SQM+ALB，国有化法案落地', color: '#1B5E20',
    assumption: 'SQM氢氧化锂产能爬坡。4月28日智利通过锂矿国有化法案，2027年起外资持股不超49%，远期增量受限。' },
  { id: 'africa', name: '非洲锂矿', sub: '津巴布韦配额制，政治风险高', color: '#EF6C00',
    assumption: '津巴布韦2月暂停出口→4月改配额制(10%出口税)。华友/盛新/中矿已获配额但发运恢复预计7月。影响全球~6%供应。' },
  { id: 'china_qinghai', name: '中国青海盐湖', sub: '确定性最高的增量来源', color: '#00897B',
    assumption: '盐湖股份4万吨新产能投产、汇信2万吨投产。综合成本3-4万元/吨。"吸附+膜法"工艺平抑季节波动。' },
  { id: 'argentina', name: '阿根廷盐湖', sub: '产能集中释放', color: '#26A69A',
    assumption: '力拓Rincon、紫金3Q、赣锋Mariana均已投产爬坡。Q1智利锂出口量增长25%。27-28年增速放缓至~10%。' },
  { id: 'china_jiangxi', name: '江西锂云母', sub: '核心扰动项！换证停产', color: '#C62828',
    assumption: '名义19万吨实际14-16万吨。宜春8宗矿权5月起陆续停产换证(周期1.5-3年)。宁德枧下窝矿复产推迟至Q4。大摩认为影响全球~6%。' },
  { id: 'china_other', name: '中国其他锂矿', sub: '四川/湖南/内蒙新兴产区', color: '#5C6BC0',
    assumption: '四川大红柳滩2月投产、湖南大中矿业鸡脚山锂矿规划13万吨/年(一期2万吨2026投产)。' },
  { id: 'recycling', name: '电池回收', sub: '退役高峰来临', color: '#6A1B9A',
    assumption: '2026年中国退役量超100万吨电池，对应回收LCE约8-10万吨。格林美、天奇股份产能扩张。' },
  { id: 'china_tibet', name: '中国西藏盐湖', sub: '同比+323%！', color: '#009688',
    assumption: '拉果错一期、扎布耶二期等投产。紫金矿业Q1净利润+97.5%。面临高海拔环保约束。' },
  { id: 'brazil', name: '巴西', sub: 'Sigma债务重组', color: '#795548',
    assumption: 'Sigma复产中，Mibra产量下降。面临硫磺价格上涨影响。' },
  { id: 'north_america', name: '北美', sub: 'IRA法案驱动', color: '#5E35B1',
    assumption: 'Thacker Pass投产中。阿巴拉契亚新发现。战略意义大于经济意义。' },
  { id: 'europe', name: '欧洲', sub: '审批严格，整合加速', color: '#42A5F5',
    assumption: 'Critical Metals 8.35亿美元收购欧洲锂公司。欧盟CRMA要求2030年本土供应10%。' },
];

const YEAR_KEYS = ['value2025', 'value2026E', 'value2027E', 'value2028E'] as const;
const YEAR_LABELS = ['2025', '2026E', '2027E', '2028E'];

export default function SupplyPanel() {
  const { data } = useLithiumData();

  const rows = SEGMENTS.map(info => {
    const d = data.supplySegments.find(s => s.id === info.id);
    if (!d) return null;
    const inc = Math.round(d.value2028E - d.value2025);
    const cagr = d.value2025 > 0 ? Math.round((Math.pow(d.value2028E / d.value2025, 1 / 3) - 1) * 100) : 0;
    return { ...info, ...d, inc, cagr, source: d.source };
  }).filter(Boolean);

  const total2025 = Math.round(data.supplySegments.reduce((s, d) => s + d.value2025, 0));
  const total2028 = Math.round(data.supplySegments.reduce((s, d) => s + d.value2028E, 0));
  const totalInc = total2028 - total2025;

  const incData = rows.filter(r => r!.inc > 0).map(r => ({
    name: r!.name, value: r!.inc, color: r!.color,
  })).sort((a, b) => b.value - a.value);

  const costCurve = rows!.map(r => ({
    name: r!.name,
    low: +r!.costRange.split('-')[0],
    high: +r!.costRange.split('-')[1].replace('万元/吨', '').replace('+', ''),
    color: r!.color,
  })).sort((a, b) => a.low - b.low);
  const maxCostAxis = Math.max(17, ...costCurve.map(item => item.high)) + 2;

  const CustomLabel = (props: any) => {
    const { x, y, width, value } = props;
    if (!value || value <= 0) return null;
    return <text x={x + width + 6} y={y + 13} fill="#555" fontSize={13} fontWeight={600}>+{value}</text>;
  };

  const totals = YEAR_KEYS.map((key, i) => ({
    year: YEAR_LABELS[i],
    val: Math.round(data.supplySegments.reduce((s, d) => s + d[key], 0)),
  }));

  return (
    <div className="space-y-8">
      {/* Total supply cards */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-6">碳酸锂总供给预测（万吨LCE）</h3>
        <div className="grid grid-cols-4 gap-5">
          {totals.map((t, i) => {
            const shades = ['bg-blue-50 border-blue-200','bg-blue-100 border-blue-300','bg-blue-200 border-blue-400','bg-blue-300 border-blue-500'];
            return (
              <div key={t.year} className={`${shades[i]} rounded-2xl p-6 text-center border`}>
                <div className="text-sm text-slate-600 mb-2">{t.year}</div>
                <div className="text-4xl font-extrabold text-slate-900">{t.val}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Individual cards */}
      {rows!.map(row => (
        <div key={row!.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-4 h-4 rounded-md flex-shrink-0" style={{ backgroundColor: row!.color }} />
            <div>
              <h4 className="text-base font-bold text-slate-900">{row!.name}</h4>
              <span className="text-xs text-slate-400">{row!.sub} · 成本 {row!.costRange}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-3 text-sm">
            {YEAR_KEYS.map((key, i) => (
              <div key={key} className="text-center">
                <div className="text-xs text-slate-400">{YEAR_LABELS[i]}</div>
                <div className={`font-bold ${i === 1 ? 'text-blue-700' : 'text-slate-700'}`}>{Math.round(row![key])}</div>
              </div>
            ))}
            <div className="w-px h-8 bg-slate-200" />
            <div className="text-center">
              <div className="text-xs text-slate-400">增量(25→28)</div>
              <div className="font-bold text-blue-700">+{row!.inc}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-400">CAGR</div>
              <div className="font-bold text-blue-700">{row!.cagr}%</div>
            </div>
          </div>

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

      {/* Cost curve */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-6">供给成本曲线（2026E）· 红色虚线 = 现价17万元/吨</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={costCurve} layout="vertical" margin={{ top: 10, right: 50, left: 10, bottom: 10 }} barSize={24}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12, fill: '#888' }} domain={[0, maxCostAxis]} axisLine={{ stroke: '#e0e0e0' }} tickLine={false} label={{ value: '万元/吨', position: 'insideBottomRight', style: { fontSize: 12, fill: '#999' } }} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 14, fill: '#333' }} width={100} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontSize: 13, border: '1px solid #e0e0e0', borderRadius: 8 }} />
            <ReferenceLine x={17} stroke="#E53935" strokeDasharray="8 4" strokeWidth={2} label={{ value: '现价17万', position: 'top', fill: '#E53935', fontSize: 11 }} />
            <Bar dataKey="high" fill="#E3F2FD" radius={[0, 6, 6, 0]} name="成本上限" />
            <Bar dataKey="low" radius={[0, 6, 6, 0]} name="成本下限">
              {costCurve.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Increment bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-6">供给增量来源分解（2025 → 2028E，合计 +{totalInc} 万吨）</h3>
        <ResponsiveContainer width="100%" height={260}>
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
