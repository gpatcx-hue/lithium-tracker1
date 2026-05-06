import type { AppData } from '@/types/lithium';

// ═══════════════════════════════════════════════════════════════
// 全球碳酸锂供需跟踪 — 数据快照 2026-05-05
// 供给基准：五矿证券(2025.11) → 大摩4月修正后有效供给~190万吨
// 需求基准：鑫椤锂电 + 中信建投4月上修 + Q1实际验证
// ═══════════════════════════════════════════════════════════════

export const initialData: AppData = {
  lastUpdated: '2026-05-05',
  demandSegments: [
    {
      id: 'power_battery', name: '动力电池', value2024: 86, value2025: 96, value2026E: 104, value2027E: 125, value2028E: 148,
      growthRate: 15, unit: '万吨LCE', status: 'growing',
      description: '全球新能源乘用车2026E销量2470万辆(五矿)。国内Q1零售同比-20%（政策退出冲击+高基数），但海外销量大增65%（比亚迪）、单车带电量提升，动力电池表现有韧性。电动重卡渗透率升至32%，单车带电400-600kWh。含乘用车74万吨+重卡/商用车25万吨+两轮车/船舶5万吨。',
      source: '五矿证券、建信期货(乐观104.3万吨)、中汽协',
    },
    {
      id: 'energy_storage', name: '储能电池', value2024: 34, value2025: 40, value2026E: 59, value2027E: 77, value2028E: 99,
      growthRate: 35, unit: '万吨LCE', status: 'booming',
      description: '最大增量来源！Q1中国储能出货209GWh同比+115%，远超年初预期。中信建投4月上修全年锂电需求至3163GWh(+38.3%)。储能占锂电排产41.3%，绝对增量首超动力电池。含大储35万吨、工商业储能9万吨、户用6万吨、AIDC 4万吨、便携式2万吨、其他3万吨。',
      source: '鑫椤锂电Q1实际、中信建投4月上修、GGII',
    },
    {
      id: 'consumer_electronics', name: '消费电子', value2024: 8, value2025: 8, value2026E: 8, value2027E: 8, value2028E: 8,
      growthRate: 0, unit: '万吨LCE', status: 'stable',
      description: '手机、笔记本等终端出货量趋稳。AI手机/PC可能小幅提升单机带电量，但整体增量有限。',
      source: 'IDC、Canalys',
    },
    {
      id: 'industrial_other', name: '工业及其他', value2024: 18, value2025: 17, value2026E: 17, value2027E: 16, value2028E: 15,
      growthRate: -4, unit: '万吨LCE', status: 'declining',
      description: '传统工业用锂（陶瓷8万吨/玻璃/润滑脂4万吨/医药等5万吨）需求缓慢下滑。钠离子电池对低端场景有少量替代但整体<3%。',
      source: 'USGS、Wood Mackenzie',
    },
  ],
  supplySegments: [
    {
      id: 'australia', name: '澳洲锂辉石', value2024: 47, value2025: 47.4, value2026E: 50.7, value2027E: 53, value2028E: 55,
      growthRate: 7, unit: '万吨LCE', costRange: '5-8万元/吨', status: 'expanding',
      description: '全球最大锂辉石产区，2026E同比+6.9%。CGP3爬坡中，但远期无大规模待投产矿山。2026-2030年CAGR不足10%。部分矿区面临柴油短缺问题。',
      source: '五矿证券',
    },
    {
      id: 'chile', name: '智利盐湖', value2024: 27.4, value2025: 29.4, value2026E: 30.4, value2027E: 31, value2028E: 32,
      growthRate: 3, unit: '万吨LCE', costRange: '3-5万元/吨', status: 'stable',
      description: 'SQM+ALB两家。SQM氢氧化锂产能爬坡中。重大变化：4月28日智利通过锂矿国有化法案，2027年起外资持股不超49%，远期增量将受限。',
      source: '五矿证券、生意社(智利国有化法案)',
    },
    {
      id: 'africa', name: '非洲锂矿', value2024: 13.5, value2025: 12.5, value2026E: 28.2, value2027E: 32, value2028E: 35,
      growthRate: 21, unit: '万吨LCE', costRange: '6-9万元/吨', status: 'constrained',
      description: '名义+126%但不确定性极高。津巴布韦2月全面暂停出口→4月改配额制(10%出口税+2027年前须建加工厂)。华友/盛新/中矿已获配额但发运恢复预计需到7月。影响全球~6%供应、中国~20%锂精矿进口。',
      source: '五矿证券、21经济网(4月配额进展)',
    },
    {
      id: 'china_qinghai', name: '中国青海盐湖', value2024: 13, value2025: 14.7, value2026E: 17.3, value2027E: 20, value2028E: 22,
      growthRate: 33, unit: '万吨LCE', costRange: '3-4万元/吨', status: 'expanding',
      description: '确定性最高的增量来源！盐湖股份4万吨新产能投产、汇信2万吨投产。"吸附+膜法"工艺平抑季节波动。青海某万吨级企业称"一下线就被客户拉走"。',
      source: '五矿证券、证券时报(企业调研)',
    },
    {
      id: 'argentina', name: '阿根廷盐湖', value2024: 6.8, value2025: 10.5, value2026E: 16.8, value2027E: 18.5, value2028E: 20,
      growthRate: 60, unit: '万吨LCE', costRange: '4-6万元/吨', status: 'expanding',
      description: '同比+60%，产能集中释放。力拓Rincon、紫金3Q、赣锋Mariana均已投产爬坡。但27-28年增速放缓至~10%。Q1智利锂出口量增长25%(含部分阿根廷转口)。',
      source: '五矿证券、生意社(智利Q1出口数据)',
    },
    {
      id: 'china_jiangxi', name: '江西锂云母', value2024: 18, value2025: 18, value2026E: 19, value2027E: 18, value2028E: 17,
      growthRate: -3, unit: '万吨LCE', costRange: '8-12万元/吨', status: 'constrained',
      description: '核心扰动项！名义19万吨但实际可能14-16万吨。宜春8宗矿权(合计20万吨LCE/年)5月起陆续停产换证，换证周期1.5-3年。宁德枧下窝矿复产推迟至Q4。大摩认为影响全球~6%供应。',
      source: '五矿证券、大摩(4月研报)、江西省自然资源厅',
    },
    {
      id: 'china_other', name: '中国其他锂矿', value2024: 8.8, value2025: 10, value2026E: 14, value2027E: 16, value2028E: 18,
      growthRate: 59, unit: '万吨LCE', costRange: '5-9万元/吨', status: 'expanding',
      description: '四川大红柳滩2月投产、湖南大中矿业鸡脚山锂矿规划13万吨/年碳酸锂产能(一期2万吨2026投产)。',
      source: '五矿证券、生意社(大中矿业4月公告)',
    },
    {
      id: 'recycling', name: '电池回收', value2024: 5, value2025: 7, value2026E: 9, value2027E: 12, value2028E: 16,
      growthRate: 29, unit: '万吨LCE', costRange: '4-7万元/吨', status: 'expanding',
      description: '2026年中国退役量超100万吨电池，对应回收LCE约8-10万吨。格林美、天奇股份产能扩张。',
      source: '五矿证券',
    },
    {
      id: 'china_tibet', name: '中国西藏盐湖', value2024: 1.3, value2025: 2.5, value2026E: 5.5, value2027E: 7, value2028E: 8,
      growthRate: 120, unit: '万吨LCE', costRange: '3-5万元/吨', status: 'expanding',
      description: '同比+323%！拉果错一期、扎布耶二期等投产。但面临高海拔环保约束。紫金矿业Q1净利润同比+97.5%，碳酸锂产量增长显著。',
      source: '五矿证券、紫金矿业Q1公告',
    },
    {
      id: 'brazil', name: '巴西', value2024: 3.8, value2025: 3, value2026E: 3, value2027E: 3.5, value2028E: 4,
      growthRate: 0, unit: '万吨LCE', costRange: '7-10万元/吨', status: 'constrained',
      description: '同比持平。Sigma债务重组后复产，Mibra产量下降。面临硫磺价格上涨影响(印尼和巴西硫磺最贵)。',
      source: '五矿证券、国联期货(硫磺问题)',
    },
    {
      id: 'north_america', name: '北美', value2024: 1.5, value2025: 2, value2026E: 3, value2027E: 5, value2028E: 8,
      growthRate: 50, unit: '万吨LCE', costRange: '8-12万元/吨', status: 'expanding',
      description: 'Thacker Pass投产中。IRA法案驱动但成本高，战略意义大于经济意义。阿巴拉契亚锂矿新发现或可支持数百万辆EV。',
      source: '五矿证券、DOE、生意社(阿巴拉契亚报道)',
    },
    {
      id: 'europe', name: '欧洲', value2024: 0.5, value2025: 0.8, value2026E: 1.1, value2027E: 2, value2028E: 3,
      growthRate: 38, unit: '万吨LCE', costRange: '10-15万元/吨', status: 'constrained',
      description: '审批周期长。Critical Metals将以8.35亿美元收购欧洲锂公司，显示欧洲锂资源整合加速。',
      source: '欧盟CRMA、生意社(Critical Metals收购)',
    },
  ],
  balanceHistory: [
    { year: '2024', demand: 146, supply: 146, balance: 0, priceLow: 7, priceHigh: 15 },
    { year: '2025', demand: 161, supply: 165, balance: 4, priceLow: 5.8, priceHigh: 12 },
    { year: '2026E', demand: 188, supply: 190, balance: 2, priceLow: 15, priceHigh: 20 },
    { year: '2027E', demand: 228, supply: 215, balance: -13, priceLow: 18, priceHigh: 22 },
    { year: '2028E', demand: 268, supply: 235, balance: -33, priceLow: 16, priceHigh: 20 },
  ],
  monthlyTrend: [
    { month: '2025-01', demand: 12.5, supply: 12.8, inventory: 13.3, price: 9.8 },
    { month: '2025-03', demand: 13.8, supply: 13.2, inventory: 12.8, price: 7.5 },
    { month: '2025-05', demand: 13.0, supply: 13.5, inventory: 12.0, price: 6.2 },
    { month: '2025-06', demand: 13.5, supply: 13.0, inventory: 11.6, price: 5.8 },
    { month: '2025-08', demand: 14.5, supply: 13.8, inventory: 10.5, price: 7.2 },
    { month: '2025-10', demand: 15.2, supply: 14.0, inventory: 9.5, price: 9.5 },
    { month: '2025-12', demand: 15.8, supply: 14.5, inventory: 8.2, price: 12.0 },
    { month: '2026-01', demand: 15.5, supply: 14.8, inventory: 11.2, price: 15.3 },
    { month: '2026-02', demand: 16.0, supply: 15.2, inventory: 10.8, price: 17.2 },
    { month: '2026-03', demand: 16.5, supply: 16.0, inventory: 10.5, price: 16.5 },
    { month: '2026-04', demand: 16.8, supply: 16.5, inventory: 10.3, price: 17.2 },
    { month: '2026-05', demand: 17.0, supply: 16.2, inventory: 10.3, price: 17.7 },
  ],
  alerts: [
    { id: '1', date: '2026-05-02', category: 'price', title: '碳酸锂电池级价格升至17.7万元/吨 月涨12%', content: '5月1日电池级碳酸锂参考价17.7万元/吨，较4月初15.8万上涨12%。5-6月预计去库幅度加大，供需紧平衡支撑锂价高位运行。国联期货预计5月缺口0.8万吨。', impact: 'high', source: '生意社、国联期货5月策略(2026.05.02)' },
    { id: '2', date: '2026-04-29', category: 'supply', title: '国联期货：5月碳酸锂预计存在0.8万吨缺口', content: '津巴布韦进口5月显著减少，回流国内需等到7月。江西4矿5月停产换证。澳洲Pilbara矿区柴油短缺。三重供给扰动叠加，5月或再去库。', impact: 'high', source: '国联期货5月策略报告(2026.04.29)' },
    { id: '3', date: '2026-04-28', category: 'policy', title: '智利锂矿国有化法案正式落地', content: '核心条款：2027年起所有锂矿项目外资持股比例不得超过49%。智利为全球第二大锂生产国(2026E产量30.4万吨LCE)。远期供给增量将受限。', impact: 'high', source: '生意社(2026.04.28)' },
    { id: '4', date: '2026-04-28', category: 'supply', title: '华友钴业津巴布韦硫酸锂首批产品发运回国', content: '中企在津"本地加工"路线取得突破。盛新、中矿也已获配额。出口程序完整后到国内约需3个月。但短期供给仍不宽松。', impact: 'medium', source: '生意社、21经济网(2026.04.28)' },
    { id: '5', date: '2026-04-22', category: 'supply', title: '摩根士丹利大幅下调全球锂供应预期', content: '大摩将2026年全球锂供应增量从50万吨下调至40万吨LCE，主因江西换证+津巴布韦中断。认为9月起短缺显现，Q4或触及25万元/吨。', impact: 'high', source: '摩根士丹利研报(2026.04)' },
    { id: '6', date: '2026-04-17', category: 'demand', title: 'Q1中国储能电池出货209GWh 同比+115%', content: '全球储能出货216GWh，同比+117%。储能占锂电排产41.3%，绝对增量首超动力电池。中信建投上修全年锂电需求至3163GWh(+38.3%)。', impact: 'high', source: '鑫椤锂电(2026.04.17)、中信建投' },
    { id: '7', date: '2026-04-01', category: 'supply', title: '江西宜春4家锂矿5月起停产换证', content: '宜春8宗涉锂矿权合计年产能~20万吨LCE(占全球~6%)。首批4矿停产月减供应~6000吨LCE。宁德枧下窝矿复产推迟至Q4。换证周期预计1.5-3年。', impact: 'high', source: '江西省自然资源厅、大摩、证券时报' },
    { id: '8', date: '2026-02-25', category: 'policy', title: '津巴布韦全面暂停锂矿出口 后改配额制', content: '影响全球~6%供应、中国~20%锂精矿进口。配额条件：承诺2027年1月前建成硫酸锂厂+10%出口税+每月报告。中企已获批文但恢复供应需3个月。', impact: 'high', source: '津巴布韦矿业部、每日经济新闻' },
    { id: '9', date: '2026-01-06', category: 'demand', title: 'GGII：2026年中国锂电出货将超2.3TWh', content: '储能锂电出货突破850GWh(+35%)，动力电池超1.3TWh(+20%)。磷酸铁锂在储能中装机占比超97%。头部企业维持满产。', impact: 'medium', source: 'GGII(2026.01.06)、高工产业研究院' },
  ],
};
