import { useMemo, useState } from 'react';
import { Network, TrendingUp, TrendingDown, Minus, ChevronRight, AlertTriangle, Lightbulb, Zap } from 'lucide-react';

// 产业链节点数据 —— 重新梳理，删除电池回收，新增储能系统集成
const chainData = {
  upstream: [
    { id: 'salt_lake', name: '盐湖提锂', companies: ['盐湖股份', 'SQM', 'Albemarle'], utilization: 85, share: 28, status: 'good', cost: '3-5万元/吨',
      insight: '成本最低但扩产慢（7-10年），DLE新技术可能缩短周期' },
    { id: 'spodumene', name: '锂辉石矿', companies: ['天齐锂业', 'Pilbara', 'Greenbushes'], utilization: 92, share: 45, status: 'good', cost: '5-8万元/吨',
      insight: '2027年后绿地项目稀缺，供给增量主要靠棕地扩产' },
    { id: 'lepidolite', name: '锂云母', companies: ['永兴材料', '江特电机'], utilization: 65, share: 12, status: 'constrained', cost: '8-12万元/吨',
      insight: '边际供给，锂价跌破10万则大面积停产；环保政策趋严' },
  ],
  midstream_cathode: [
    { id: 'lfp', name: '磷酸铁锂(LFP)', companies: ['湖南裕能', '德方纳米'], utilization: 58, share: 65, status: 'oversupply', margin: '5-8%',
      insight: '储能需求驱动份额持续提升至82%+；但产能过剩严重，头部满产尾部出清' },
    { id: 'lmfp', name: '磷酸锰铁锂(LMFP)', companies: ['德方纳米', '容百科技'], utilization: 75, share: 5, status: 'growing', margin: '12-15%',
      insight: '能量密度提升15-20%，2026年多家车企导入；钠离子替代风险低' },
    { id: 'ncm', name: '高镍三元', companies: ['容百科技', '当升科技'], utilization: 72, share: 28, status: 'moderate', margin: '10-12%',
      insight: '固态电池首选正极路线；海外车企（特斯拉4680）仍偏好高镍' },
    { id: 'sodium', name: '钠离子电池', companies: ['宁德时代', '中科海钠'], utilization: 40, share: 2, status: 'growing', margin: '8-10%',
      insight: '2026年A/B级车型开始量产搭载；对低端锂电有替代压力，但对锂需求冲击有限（&lt;3%）' },
  ],
  midstream_other: [
    { id: 'separator', name: '隔膜', companies: ['恩捷股份', '星源材质'], utilization: 82, share: 60, status: 'good', margin: '18%',
      insight: 'CR2超60%，竞争格局最好的中游环节；干法隔膜受储能拉动' },
    { id: 'electrolyte', name: '电解液', companies: ['天赐材料', '新宙邦'], utilization: 55, share: 45, status: 'oversupply', margin: '10-15%',
      insight: '六氟磷酸锂涨价推动毛利修复，但长期面临固态电池替代风险' },
    { id: 'anode', name: '负极材料', companies: ['贝特瑞', '璞泰来'], utilization: 62, share: 50, status: 'oversupply', margin: '15-20%',
      insight: '硅碳负极渗透率提升至15%+，4680电池拉动高端需求' },
    { id: 'copper_foil', name: '锂电铜箔', companies: ['诺德股份', '嘉元科技'], utilization: 80, share: 40, status: 'moderate', margin: '12%',
      insight: '铜价突破12万/吨推动加工费上涨，供需偏紧' },
  ],
  downstream: [
    { id: 'catl', name: '宁德时代', type: '动力+储能+AIDC', utilization: 97, share: 39, status: 'excellent', margin: '24%',
      insight: 'CR1=39%，储能+AIDC打开第二曲线；固态电池2027年量产' },
    { id: 'byd', name: '比亚迪', type: '动力+储能', utilization: 88, share: 16, status: 'good', margin: '20%',
      insight: '刀片电池+整车一体化；海外工厂布局加速' },
    { id: 'eve', name: '亿纬锂能', type: '储能+动力', utilization: 85, share: 8, status: 'moderate', margin: '12%',
      insight: '大圆柱46系列量产，储能大单频发；盈利能力待提升' },
    { id: 'gotion', name: '国轩高科', type: '动力为主', utilization: 75, share: 5, status: 'moderate', margin: '8%',
      insight: '大众入股背书；海外产能布局（泰国、摩洛哥）' },
  ],
  storage_integration: [
    { id: 'sungrow', name: '阳光电源', type: '储能PCS+系统集成', utilization: 90, share: 15, status: 'excellent', margin: '38%',
      insight: '全球储能系统集成TOP3；AIDC储能认证加速，摩根大通看好其800V HVDC布局' },
    { id: 'tesla_energy', name: '特斯拉储能', type: 'Megapack系统', utilization: 95, share: 20, status: 'excellent', margin: '25%',
      insight: '全球最大储能系统供应商；Lathrop工厂40GWh/年产能' },
    { id: 'haibosi', name: '海博思创', type: '系统集成', utilization: 88, share: 8, status: 'good', margin: '15%',
      insight: '2025年涨幅1489%，国内储能系统集成龙头；AI调度平台' },
    { id: 'shuangdeng', name: '双登股份', type: 'AIDC备电+储能', utilization: 85, share: 11, status: 'good', margin: '20%',
      insight: 'AIDC储能第一股；H1 AIDC收入同比+113%成第一大业务' },
  ],
  application: [
    { id: 'ev', name: '新能源汽车', demand: 170, growth: 11, status: 'growing',
      insight: '全球渗透率30%+，增速放缓但绝对量仍为最大需求源' },
    { id: 'storage', name: '电力储能', demand: 62, growth: 26, status: 'booming',
      insight: '最大增量来源，绝对增量首超动力电池' },
    { id: 'aidc', name: 'AI数据中心', demand: 3.5, growth: 65, status: 'booming',
      insight: 'CAGR最高赛道，2030年DC储能超209GWh' },
    { id: 'consumer', name: '消费电子', demand: 8, growth: 0, status: 'stable',
      insight: '存量市场，无增量亦无下滑' },
  ],
};

const statusConfig: Record<string, { label: string; color: string; textColor: string; bgColor: string; borderColor: string }> = {
  excellent: { label: '优秀', color: 'bg-emerald-600', textColor: 'text-emerald-700', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' },
  good: { label: '良好', color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  growing: { label: '成长', color: 'bg-blue-500', textColor: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  moderate: { label: '中等', color: 'bg-yellow-500', textColor: 'text-yellow-700', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
  constrained: { label: '受限', color: 'bg-orange-500', textColor: 'text-orange-700', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
  oversupply: { label: '过剩', color: 'bg-red-500', textColor: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
  booming: { label: '爆发', color: 'bg-purple-600', textColor: 'text-purple-700', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  stable: { label: '稳定', color: 'bg-gray-500', textColor: 'text-gray-700', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' },
};

const filterConfig = {
  all: { label: '全部节点', match: () => true },
  good: {
    label: '格局好',
    match: (status: string) => ['excellent', 'good', 'growing', 'booming'].includes(status),
  },
  oversupply: {
    label: '产能过剩',
    match: (status: string) => status === 'oversupply',
  },
} as const;

type ChainSectionKey = keyof typeof chainData;
type ChainNode = (typeof chainData)[ChainSectionKey][number];

function NodeCard({ node }: { node: ChainNode }) {
  const cfg = statusConfig[node.status as keyof typeof statusConfig];

  return (
    <div className={`${cfg.bgColor} ${cfg.borderColor} border-2 rounded-xl p-3 hover:shadow-lg transition-all cursor-pointer group`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-bold text-sm text-slate-900 mb-1">{node.name}</h4>
          {'companies' in node && node.companies && (
            <p className="text-xs text-slate-600 line-clamp-1">{(node.companies as string[]).join('、')}</p>
          )}
          {'type' in node && node.type && (
            <p className="text-xs text-slate-600">{node.type as string}</p>
          )}
        </div>
        <span className={`${cfg.color} text-white text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0`}>
          {cfg.label}
        </span>
      </div>

      <div className="space-y-1 text-xs">
        {'utilization' in node && node.utilization !== undefined && (
          <div className="flex justify-between">
            <span className="text-slate-500">产能利用率</span>
            <span className={`font-bold ${(node.utilization as number) >= 80 ? 'text-emerald-700' : (node.utilization as number) >= 60 ? 'text-yellow-700' : 'text-red-700'}`}>
              {node.utilization as number}%
            </span>
          </div>
        )}
        {'share' in node && node.share !== undefined && (
          <div className="flex justify-between">
            <span className="text-slate-500">市场份额</span>
            <span className="font-bold text-slate-900">{node.share as number}%</span>
          </div>
        )}
        {'cost' in node && node.cost && (
          <div className="flex justify-between">
            <span className="text-slate-500">成本</span>
            <span className="font-bold text-slate-900">{node.cost as string}</span>
          </div>
        )}
        {'margin' in node && node.margin && (
          <div className="flex justify-between">
            <span className="text-slate-500">毛利率</span>
            <span className="font-bold text-slate-900">{node.margin as string}</span>
          </div>
        )}
        {'demand' in node && node.demand !== undefined && (
          <div className="flex justify-between">
            <span className="text-slate-500">2026E需求</span>
            <span className="font-bold text-slate-900">{node.demand as number}万吨</span>
          </div>
        )}
        {'growth' in node && node.growth !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-slate-500">增速</span>
            <span className={`font-bold flex items-center ${(node.growth as number) > 15 ? 'text-emerald-700' : (node.growth as number) > 0 ? 'text-blue-700' : 'text-gray-600'}`}>
              {(node.growth as number) > 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : (node.growth as number) < 0 ? <TrendingDown className="w-3 h-3 mr-0.5" /> : <Minus className="w-3 h-3 mr-0.5" />}
              {(node.growth as number) > 0 ? '+' : ''}{node.growth as number}%
            </span>
          </div>
        )}
      </div>

      {'insight' in node && node.insight && (
        <div className="mt-2 pt-2 border-t border-slate-200/60 text-xs text-slate-500 leading-relaxed">
          {node.insight as string}
        </div>
      )}
    </div>
  );
}

export default function IndustryChain() {
  const [filter, setFilter] = useState<string>('all');
  const activeFilter = filterConfig[filter as keyof typeof filterConfig] ?? filterConfig.all;

  const filteredSections = useMemo(() => {
    const filterNodes = (nodes: ChainNode[]) => nodes.filter(node => activeFilter.match(node.status));
    return {
      upstream: filterNodes(chainData.upstream),
      midstream_cathode: filterNodes(chainData.midstream_cathode),
      midstream_other: filterNodes(chainData.midstream_other),
      downstream: filterNodes(chainData.downstream),
      storage_integration: filterNodes(chainData.storage_integration),
      application: filterNodes(chainData.application),
    };
  }, [activeFilter]);

  const visibleNodes = Object.values(filteredSections).flat();
  const visibleCount = visibleNodes.length;
  const positiveCount = visibleNodes.filter(node => ['excellent', 'good', 'growing', 'booming'].includes(node.status)).length;
  const oversupplyCount = visibleNodes.filter(node => node.status === 'oversupply').length;

  const renderSection = (title: string, className: string, nodes: ChainNode[]) => (
    <div className="flex-1 min-w-[180px]">
      <div className={`${className} text-white px-3 py-2 rounded-lg mb-3 text-center font-bold text-sm`}>
        {title}
      </div>
      <div className="space-y-3">
        {nodes.length > 0 ? (
          nodes.map(node => <NodeCard key={node.id} node={node} />)
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-400">
            当前筛选下暂无节点
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Network className="w-7 h-7 text-emerald-700" />
              全球锂电产业链全景图
            </h2>
            <p className="text-sm text-slate-500 mt-1">上游资源 → 中游材料 → 下游电池 → 储能集成 → 终端应用</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${filter === 'all' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              全部
            </button>
            <button
              onClick={() => setFilter('good')}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${filter === 'good' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              格局好
            </button>
            <button
              onClick={() => setFilter('oversupply')}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${filter === 'oversupply' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              产能过剩
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 text-xs">
          {Object.entries(statusConfig).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-full ${cfg.color}`} />
              <span className="text-slate-600">{cfg.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          当前视图：<span className="font-semibold text-slate-900">{activeFilter.label}</span>
          {' '}| 可见节点 <span className="font-semibold text-slate-900">{visibleCount}</span>
          {' '}| 格局向好 <span className="font-semibold text-emerald-700">{positiveCount}</span>
          {' '}| 过剩环节 <span className="font-semibold text-red-600">{oversupplyCount}</span>
        </div>
      </div>

      {/* Chain Flow */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm overflow-x-auto">
        <div className="flex gap-3 min-w-[1400px]">
          {renderSection('上游：锂资源', 'bg-emerald-700', filteredSections.upstream)}
          <div className="flex items-center justify-center"><ChevronRight className="w-5 h-5 text-slate-300" /></div>
          {renderSection('中游：正极材料', 'bg-blue-700', filteredSections.midstream_cathode)}
          <div className="flex items-center justify-center"><ChevronRight className="w-5 h-5 text-slate-300" /></div>
          {renderSection('中游：其他材料', 'bg-blue-600', filteredSections.midstream_other)}
          <div className="flex items-center justify-center"><ChevronRight className="w-5 h-5 text-slate-300" /></div>
          {renderSection('下游：电池企业', 'bg-purple-700', filteredSections.downstream)}
          <div className="flex items-center justify-center"><ChevronRight className="w-5 h-5 text-slate-300" /></div>
          {renderSection('储能系统集成', 'bg-teal-700', filteredSections.storage_integration)}
          <div className="flex items-center justify-center"><ChevronRight className="w-5 h-5 text-slate-300" /></div>
          {renderSection('终端：应用市场', 'bg-orange-600', filteredSections.application)}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-sm text-slate-500 mb-1">当前筛选</div>
          <div className="text-2xl font-bold text-slate-900">{activeFilter.label}</div>
          <div className="text-xs text-slate-500">覆盖 {visibleCount} 个可见节点</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-sm text-slate-500 mb-1">格局向好节点</div>
          <div className="text-2xl font-bold text-emerald-700">{positiveCount}</div>
          <div className="text-xs text-slate-500">优秀、良好、成长与爆发环节</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-sm text-slate-500 mb-1">产能过剩节点</div>
          <div className="text-2xl font-bold text-red-600">{oversupplyCount}</div>
          <div className="text-xs text-slate-500">集中在中游材料与加工环节</div>
        </div>
      </div>

      {/* Comprehensive Analysis */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-amber-500" />
          产业链综合分析
        </h3>

        {/* Core conclusion */}
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-xl p-5">
          <h4 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5" />核心结论
          </h4>
          <div className="space-y-2 text-sm text-slate-700 leading-relaxed">
            <p>1. <strong>上游锂资源</strong>：2026年供需由紧平衡转向轻微短缺（缺口~12万吨LCE）。盐湖和锂辉石是主力供给，但大型新项目2026-2027年进入空窗期，资本开支不足制约后续增长。锂价17万元/吨下全行业盈利，但边际供给（锂云母）弹性有限。</p>
            <p>2. <strong>中游材料</strong>：磷酸铁锂份额升至82%，但产能过剩严重（利用率仅58%），头部满产尾部出清。隔膜是竞争格局最好的中游环节（CR2&gt;60%），电解液和负极正经历去产能。LMFP（磷酸锰铁锂）崛起提供新增长点。</p>
            <p>3. <strong>下游电池</strong>：行业集中度持续提升（CR10&gt;90%），宁德时代以39%份额稳居第一。储能电池绝对增量2026年首超动力电池，成为新的竞争焦点。</p>
            <p>4. <strong>储能系统集成</strong>：AIDC配储从"概念"进入"交付大年"，阳光电源、特斯拉、海博思创等受益最大。竞争从"价格"转向"价值"，品质和系统集成能力成为核心壁垒。</p>
          </div>
        </div>

        {/* New tech impact */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-5">
          <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />新技术对产业链的影响
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white/80 rounded-lg p-4">
              <div className="font-bold text-purple-800 mb-2">固态电池</div>
              <div className="space-y-1 text-slate-700 text-xs leading-relaxed">
                <p>全球固态电池出货量预计从2025年19.7GWh→2030年614GWh（CAGR 82%）。宁德时代2027年小规模量产，丰田2028年装车。</p>
                <p><strong>对锂影响：</strong>锂金属负极方案反而增加锂用量（占材料成本23%）；短期内正面拉动锂需求。</p>
                <p><strong>对产业链影响：</strong>电解液面临替代风险（固态电解质取代液态），但隔膜可能被完全取代。</p>
              </div>
            </div>
            <div className="bg-white/80 rounded-lg p-4">
              <div className="font-bold text-purple-800 mb-2">钠离子电池</div>
              <div className="space-y-1 text-slate-700 text-xs leading-relaxed">
                <p>2026年A/B级车型开始量产搭载；宁德时代、中科海钠已有产品落地。主攻低端代步车和低温储能。</p>
                <p><strong>对锂影响：</strong>替代锂需求量有限（&lt;3%），主要替代的是铅酸电池市场。钠电低温性能差（-20°C容量保持率&lt;70%），不适合主流场景。</p>
                <p><strong>对产业链影响：</strong>正极材料路线差异大（普鲁士白/层状氧化物），对现有LFP产业链冲击小。</p>
              </div>
            </div>
            <div className="bg-white/80 rounded-lg p-4">
              <div className="font-bold text-purple-800 mb-2">4680大圆柱电池</div>
              <div className="space-y-1 text-slate-700 text-xs leading-relaxed">
                <p>特斯拉4680量产爬坡中，亿纬锂能46系列大圆柱获多家车企定点。能量密度300Wh/kg+，适合中高端车型。</p>
                <p><strong>对产业链影响：</strong>拉动高镍三元和硅碳负极需求，利好容百科技、贝特瑞等。设备端需要全新产线投入。</p>
              </div>
            </div>
            <div className="bg-white/80 rounded-lg p-4">
              <div className="font-bold text-purple-800 mb-2">800V高压架构（AIDC）</div>
              <div className="space-y-1 text-slate-700 text-xs leading-relaxed">
                <p>英伟达推出800V HVDC数据中心架构，2027年量产。取消传统UPS，电池直挂母线，系统效率从89%→97%。</p>
                <p><strong>对产业链影响：</strong>利好PCS（储能变流器）企业：阳光电源、德业股份等加速布局800V产品。传统UPS企业（科士达等）面临转型压力。</p>
              </div>
            </div>
          </div>
        </div>

        {/* Risk warnings */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-5">
          <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />关键风险提示
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-700">
            <div className="bg-white/80 rounded-lg p-3">
              <div className="font-bold text-red-800 mb-1">供给端政策风险</div>
              <p>津巴布韦出口禁令、江西环保政策、中国电池出口退税降至0%（2027年）均可能打乱供给节奏。</p>
            </div>
            <div className="bg-white/80 rounded-lg p-3">
              <div className="font-bold text-red-800 mb-1">中游产能出清不及预期</div>
              <p>磷酸铁锂产能利用率仅58%，若尾部企业不能快速退出，价格战可能持续侵蚀行业利润。</p>
            </div>
            <div className="bg-white/80 rounded-lg p-3">
              <div className="font-bold text-red-800 mb-1">海外贸易壁垒</div>
              <p>美国OBBB法案要求非中国成分&gt;55%，欧盟碳足迹法规趋严，中国企业需加速海外建厂应对。</p>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-400 text-right">
          数据来源：GGII、鑫椤锂电、公司年报/季报、弗若斯特沙利文、摩根大通 | 更新时间：2026-04-26
        </div>
      </div>
    </div>
  );
}
