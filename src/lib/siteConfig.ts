import { prisma } from '@/lib/prisma';

// Global site config types
export interface NavItem { label: string; href: string }
export interface ToolCardConfig { icon: string; bg: string; color: string; title: string; desc: string; link: string }
export interface CommunityCardConfig { icon: string; title: string; desc: string; tags: string[]; link: string; highlight?: boolean }

export interface SiteGlobalConfig {
  header: {
    logoText: string;
    navItems: NavItem[];
    searchPlaceholder: string;
    searchBtnText: string;
    askBtnText: string;
    bookBtnText: string;
  };
  footer: {
    disclaimerTitle: string;
    disclaimerText: string;
    cooperationTitle: string;
    cooperationText: string;
    cooperationBtnText: string;
    copyrightText: string;
  };
  tools: {
    gb2760: { title: string; subtitle: string; disclaimer: string };
    troubleshoot: { title: string; subtitle: string };
    pilotMap: { title: string; subtitle: string; mapIntro: string };
  };
  booking: {
    title: string;
    subtitle: string;
  };
  community: {
    headerBadge: string;
    headerTitle: string;
    headerDesc: string;
    askBtnText: string;
  };
  homepage: {
    toolCards: ToolCardConfig[];
    discussionBarText: string;
    discussionBarCta: string;
    communityCards: CommunityCardConfig[];
    pilotDemo: {
      title: string;
      liveLabel: string;
      liveLocation: string;
      chatText: string;
    };
    pilotCardTitle: string;
    pilotCardSubtitle: string;
    pilotBtnText: string;
  };
}

// Default config — used when no Setting exists or as fallback
export const defaultSiteGlobalConfig: SiteGlobalConfig = {
  header: {
    logoText: 'MeatTech Pro',
    navItems: [
      { label: '首页', href: '/' },
      { label: '爆款逆向库', href: '/#reverse' },
      { label: '工艺配方智库', href: '/#science' },
      { label: '💬 工艺问答', href: '/community' },
      { label: '共享中试中心', href: '/#pilot' },
      { label: '供应链选型', href: '/#industry' },
    ],
    searchPlaceholder: '请输入原料、添加剂、生产故障或设备型号...',
    searchBtnText: '🔍 全局硬核搜索',
    askBtnText: '✏️ 提问',
    bookBtnText: '预约中试线🔥',
  },
  footer: {
    disclaimerTitle: '⚠️ 免责声明',
    disclaimerText: '本站所载工业基础配方及参数仅供研发实验参考。实际生产请结合特定原料肉质、工厂设备环境进行中试微调，并严格遵守当地食品安全法律法规。平台不对因直接套用配方参数而造成的任何生产损失承担责任。',
    cooperationTitle: '🤝 资源合作与入驻',
    cooperationText: '如果您有闲置的中试产线、先进的肉机技术或新型原辅料，欢迎接入平台，共同赋能中国肉业。我们提供产线托管、技术变现、品牌曝光等多元化合作模式。',
    cooperationBtnText: '申请入驻成为服务商 →',
    copyrightText: '© 2026 MeatTech Pro · 工业化肉制品研发与智能中试平台 · 让每一公斤肉发挥最大价值',
  },
  tools: {
    gb2760: {
      title: '📊 GB 2760 添加剂限量计算器',
      subtitle: '输入添加剂名称查询最大使用量，并计算实际用量合规性',
      disclaimer: '⚠️ 本计算器数据基于 GB 2760-2014《食品安全国家标准 食品添加剂使用标准》，仅供参考。实际生产请以最新国标原文为准，并结合产品具体类别确认适用限量。',
    },
    troubleshoot: {
      title: '🚨 车间故障智能排查矩阵',
      subtitle: '10分钟快速排查出水、出油、散碎、色泽等常见肉制品生产故障',
    },
    pilotMap: {
      title: '🗺️ 全国肉类共享中试产线地图',
      subtitle: '在线预约闲置产能，轻资产研发',
      mapIntro: '覆盖全国主要区域的肉类中试资源网络，每区域均面向三类客户服务：高校科研院所（CRO研发）、产业园公共平台（轻资产试错）、辅料企业演示中心（风味调优与爆款逆向）。',
    },
  },
  booking: {
    title: '中试产线预约',
    subtitle: '提交您的中试需求，平台专家将在24小时内1对1跟进',
  },
  community: {
    headerBadge: '💬 工艺问答社区',
    headerTitle: '疑难杂症讨论交流',
    headerDesc: '遇到工艺难题？发帖求助，同行专家来解答。出水、散肉、色泽不均、保质期不达标……这里都有答案。',
    askBtnText: '✏️ 我要提问',
  },
  homepage: {
    toolCards: [
      { icon: '📊', bg: '#DBEAFE', color: '#1E3A8A', title: 'GB 2760 添加剂限量计算器', desc: '输入添加剂名称，一键合规审查', link: '/tool/gb2760' },
      { icon: '🚨', bg: '#FEE2E2', color: '#991B1B', title: '肉制品车间故障智能排查矩阵', desc: '解决出水、散肉、色泽不均等顽疾', link: '/tool/troubleshoot' },
      { icon: '🗺️', bg: '#D1FAE5', color: '#065F46', title: '全国肉类共享中试产线地图', desc: '在线预约闲置产能，轻资产研发', link: '/tool/pilot-map' },
    ],
    discussionBarText: '🔥 工艺工程师在线讨论中',
    discussionBarCta: '立即参与 →',
    communityCards: [
      { icon: '📚', title: '深度技术长文', desc: '涵盖原料改性、工艺优化、添加剂应用、故障排查等实战内容。后台随时更新，前沿技术持续沉淀。', tags: [], link: '/category/chinese-braised' },
      { icon: '💬', title: '疑难杂症讨论', desc: '出水、散肉、色泽不均、保质期不达标……遇到工艺难题？发帖求助，同行专家来解答。', tags: ['在线提问', '同行互助', '专家解答'], link: '/community', highlight: true },
      { icon: '📱', title: '技术互助社群', desc: '加入肉品工程师日常技术互助群，按品类分群，日常技术互助，私域深度沉淀。', tags: [], link: '#footer' },
    ],
    pilotDemo: {
      title: '🎛️ 远程协同研发舱（数据孪生演示）',
      liveLabel: '正在进行：真空滚揉放大实验',
      liveLocation: '华南区·华南理工中试基地',
      chatText: '远程指挥 · 张总监：料温已到4℃，开始加胶体，注意控制添加速率在0.5kg/min以内',
    },
    pilotCardTitle: '🗺️ 全国共享中试基地',
    pilotCardSubtitle: '覆盖全国 · 三类机构（高校/产业园/辅料企业）',
    pilotBtnText: '立即提交您的中试需求，平台专家1对1跟进 →',
  },
};

// Fetch and merge global config from Setting table
export async function getSiteGlobalConfig(): Promise<SiteGlobalConfig> {
  try {
    const setting = await prisma.setting.findUnique({ where: { key: 'site_global' } });
    if (setting) {
      const parsed = JSON.parse(setting.value);
      // Deep merge with defaults to ensure all fields exist
      return {
        header: { ...defaultSiteGlobalConfig.header, ...parsed.header },
        footer: { ...defaultSiteGlobalConfig.footer, ...parsed.footer },
        tools: { ...defaultSiteGlobalConfig.tools, ...parsed.tools },
        booking: { ...defaultSiteGlobalConfig.booking, ...parsed.booking },
        community: { ...defaultSiteGlobalConfig.community, ...parsed.community },
        homepage: { ...defaultSiteGlobalConfig.homepage, ...parsed.homepage },
      };
    }
  } catch { /* defaults */ }
  return defaultSiteGlobalConfig;
}
