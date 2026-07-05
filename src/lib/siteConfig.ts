import { prisma } from '@/lib/prisma';

// Global site config types
export interface NavItem { label: string; href: string }
export interface ToolCardConfig { icon: string; bg: string; color: string; title: string; desc: string; link: string }
export interface CommunityCardConfig { icon: string; title: string; desc: string; tags: string[]; link: string; highlight?: boolean }
export interface TypeConfigItem { label: string; icon: string; color: string; bg: string; desc: string; model: string; sectionTitle: string }

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
    pilotMap: {
      title: string;
      subtitle: string;
      mapIntro: string;
      backToHome: string;
      statsLabels: { total: string; regions: string; universities: string; parks: string; enterprises: string };
      typeConfig: Record<string, TypeConfigItem>;
      cooperationModels: { icon: string; title: string; desc: string; bg: string; borderColor: string; color: string }[];
      cardLabels: { available: string; booked: string; advantages: string; equipment: string; cooperation: string; bookBtn: string; capacityFallback: string };
      emptyState: { icon: string; title: string; desc: string };
      cta: { title: string; desc: string; btnText: string };
    };
  };
  booking: {
    title: string;
    subtitle: string;
  };
  bookingDetail: {
    backBtn: string;
    title: string;
    notFoundIcon: string;
    notFoundTitle: string;
    backToBooking: string;
    lineUnavailable: string;
    requirementLabel: string;
    adminNoteLabel: string;
    statusLabels: { PENDING: string; CONFIRMED: string; IN_PROGRESS: string; COMPLETED: string; CANCELLED: string };
    fieldLabels: { id: string; contactName: string; contactPhone: string; contactEmail: string; company: string; experimentType: string; preferredDate: string; createdAt: string };
  };
  community: {
    headerBadge: string;
    headerTitle: string;
    headerDesc: string;
    askBtnText: string;
    searchPlaceholder: string;
    searchBtnText: string;
    allTagText: string;
    readText: string;
    emptyState: { icon: string; title: string; desc: string; btnText: string };
  };
  ask: {
    backBtn: string;
    title: string;
    desc: string;
    titleLabel: string;
    titlePlaceholder: string;
    tagsLabel: string;
    tagsPlaceholder: string;
    tagSuggestions: string[];
    contentLabel: string;
    contentPlaceholder: string;
    contactTitle: string;
    authorLabel: string;
    authorPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    submitBtn: string;
    submittingBtn: string;
    cancelBtn: string;
    successIcon: string;
    successTitle: string;
    successDesc: string;
    errorTitleRequired: string;
    errorContentRequired: string;
    errorNetwork: string;
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
    categoryNavTitle: string;
    reverseReportLink: string;
    keyDifficulty: string;
    viewAllInstitutions: string;
    liveBadge: string;
    dataPanelLabels: { vacuum: string; temp: string; speed: string; runtime: string };
    dataPanelValues: { vacuum: string; temp: string; speed: string; runtime: string };
    toolboxTitle: string;
    askNowBtn: string;
    browseAllBtn: string;
    coreFeatureBadge: string;
    communityCardCtas: { community: string; footer: string; articles: string };
    postCountText: string;
    categoryCountText: string;
    noPostsText: string;
    noPostsCta: string;
    availableText: string;
    bookedText: string;
    techFrontierText: string;
  };
  search: {
    title: string;
    resultCountText: string;
    emptyIcon: string;
    emptyText: string;
    articlesHeader: string;
    productsHeader: string;
  };
  category: {
    breadcrumbHome: string;
    breadcrumbScience: string;
    navTitle: string;
    postCountText: string;
    readText: string;
    notFoundIcon: string;
    notFoundTitle: string;
    notFoundDesc: string;
    backToHome: string;
    emptyIcon: string;
    emptyTitle: string;
    emptyDesc: string;
    emptyCta: string;
  };
  article: {
    breadcrumbHome: string;
    readText: string;
    helpfulText: string;
    ctaBtn: string;
  };
  product: {
    backBtn: string;
    keyDifficulty: string;
    featuredBadge: string;
    summaryTitle: string;
    reportTitle: string;
    reportLink: string;
    bookBtn: string;
    publishText: string;
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
      backToHome: '← 返回首页',
      statsLabels: {
        total: '中试机构总数',
        regions: '覆盖区域',
        universities: '高校及科研院所',
        parks: '产业园公共平台',
        enterprises: '辅料企业中心',
      },
      typeConfig: {
        UNIVERSITY: { label: '高校及科研院所', icon: '🎓', color: '#1E3A8A', bg: '#DBEAFE', desc: '技术权威型 · 适合硬核改性、CRO研发', model: '💡 找专家、做大改动 → 走CRO高客单价分成', sectionTitle: '高校及科研院所' },
        PARK: { label: '产业园与公共平台', icon: '🏭', color: '#065F46', bg: '#D1FAE5', desc: '政策支持型 · 适合轻资产初创品牌', model: '💡 初创品牌、预制菜试错 → 走标准场租抽佣', sectionTitle: '产业园与公共服务平台' },
        ENTERPRISE: { label: '辅料企业演示中心', icon: '🧪', color: '#92400E', bg: '#FEF3C7', desc: '商业敏锐型 · 适合爆款逆向、快速打样', model: '💡 调风味、做爆款逆向 → 辅料带货+产线开放', sectionTitle: '辅料及添加剂企业演示中心' },
        OTHER: { label: '其他', icon: '📦', color: '#374151', bg: '#F3F4F6', desc: '已入驻的共享产线资源', model: '', sectionTitle: '其他中试产线' },
      },
      cooperationModels: [
        { icon: '🎓', title: '找专家、做大改动', desc: '高校科研院所 · CRO高客单价分成', bg: '#DBEAFE', borderColor: '#BFDBFE', color: '#1E3A8A' },
        { icon: '🏭', title: '初创品牌、预制菜试错', desc: '产业园公共平台 · 标准场租抽佣', bg: '#D1FAE5', borderColor: '#A7F3D0', color: '#065F46' },
        { icon: '🧪', title: '调风味、做爆款逆向', desc: '辅料企业演示中心 · 辅料带货+产线开放', bg: '#FEF3C7', borderColor: '#FDE68A', color: '#92400E' },
      ],
      cardLabels: {
        available: '有档期',
        booked: '需预约',
        advantages: '✨ 核心优势',
        equipment: '🛠️ 设备配置',
        cooperation: '🤝 合作模式',
        bookBtn: '立即预约 →',
        capacityFallback: '产能面议',
      },
      emptyState: { icon: '🗺️', title: '暂无中试机构数据', desc: '请管理员访问 /api/setup 初始化数据，或在后台添加产线。' },
      cta: { title: '找不到合适的机构？', desc: '提交您的中试需求，平台专家1对1跟进，为您匹配最佳合作伙伴', btnText: '立即提交中试需求 →' },
    },
  },
  booking: {
    title: '中试产线预约',
    subtitle: '提交您的中试需求，平台专家将在24小时内1对1跟进',
  },
  bookingDetail: {
    backBtn: '← 返回预约页',
    title: '预约详情',
    notFoundIcon: '🔍',
    notFoundTitle: '预约记录不存在',
    backToBooking: '← 返回预约页',
    lineUnavailable: '产线信息不可用',
    requirementLabel: '实验需求',
    adminNoteLabel: '📋 平台备注',
    statusLabels: {
      PENDING: '待处理',
      CONFIRMED: '已确认',
      IN_PROGRESS: '执行中',
      COMPLETED: '已完成',
      CANCELLED: '已取消',
    },
    fieldLabels: {
      id: '预约编号',
      contactName: '联系人',
      contactPhone: '联系电话',
      contactEmail: '邮箱',
      company: '公司',
      experimentType: '实验类型',
      preferredDate: '期望日期',
      createdAt: '提交时间',
    },
  },
  community: {
    headerBadge: '💬 工艺问答社区',
    headerTitle: '疑难杂症讨论交流',
    headerDesc: '遇到工艺难题？发帖求助，同行专家来解答。出水、散肉、色泽不均、保质期不达标……这里都有答案。',
    askBtnText: '✏️ 我要提问',
    searchPlaceholder: '搜索问题、关键词……',
    searchBtnText: '搜索',
    allTagText: '全部',
    readText: '阅读',
    emptyState: { icon: '💬', title: '还没有人提问，做第一个提问的人吧！', desc: '无论是工艺难题、配方问题还是设备故障，都可以在这里发帖求助', btnText: '✏️ 我要提问' },
  },
  ask: {
    backBtn: '← 返回社区',
    title: '✏️ 提出你的工艺问题',
    desc: '描述越详细，越容易得到同行专家的解答。建议包含：产品类型、现象描述、已尝试方案、设备条件等。',
    titleLabel: '问题标题 *',
    titlePlaceholder: '例：低温火腿蒸煮后出水严重，如何优化保水方案？',
    tagsLabel: '问题标签',
    tagsPlaceholder: '用逗号分隔，如：出水,保水,低温火腿',
    tagSuggestions: ['出水', '散肉', '色泽不均', '保质期', '风味', '质构', '灌装', '蒸煮', '包装', '添加剂', '减盐', '清洁标签'],
    contentLabel: '问题描述 *',
    contentPlaceholder: '请详细描述你的问题：\n\n1. 产品类型（如低温火腿、酱卤牛肉等）\n2. 现象描述（如蒸煮后出水率15%）\n3. 当前配方要点（如磷酸盐添加量0.3%）\n4. 工艺参数（如蒸煮温度80℃/时间40min）\n5. 已尝试的方案及效果',
    contactTitle: '联系方式（可选，方便同行私信交流）',
    authorLabel: '称呼',
    authorPlaceholder: '张工 / 李总监',
    phoneLabel: '手机',
    phonePlaceholder: '138xxxx',
    emailLabel: '邮箱',
    emailPlaceholder: 'engineer@company.com',
    submitBtn: '发布问题',
    submittingBtn: '提交中...',
    cancelBtn: '取消',
    successIcon: '✅',
    successTitle: '提问成功！',
    successDesc: '正在跳转到社区列表...',
    errorTitleRequired: '请输入问题标题',
    errorContentRequired: '请输入问题描述',
    errorNetwork: '网络错误，请重试',
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
    categoryNavTitle: '📂 品类导航',
    reverseReportLink: '查看逆向工艺报告 →',
    keyDifficulty: '⚡ 关键难点',
    viewAllInstitutions: '查看全部',
    liveBadge: 'LIVE',
    dataPanelLabels: { vacuum: '真空度', temp: '料温', speed: '转速', runtime: '运行时间' },
    dataPanelValues: { vacuum: '-0.08 MPa', temp: '4.2℃', speed: '8 rpm', runtime: '00:42:18' },
    toolboxTitle: '工程师实战工具箱',
    askNowBtn: '✏️ 立即提问',
    browseAllBtn: '💬 浏览全部讨论',
    coreFeatureBadge: '核心功能',
    communityCardCtas: { community: '进入讨论社区 →', footer: '扫码加入交流群 ↓', articles: '浏览全部技术文章 →' },
    postCountText: '篇长文',
    categoryCountText: '个品类',
    noPostsText: '暂无文章，请在后台 CMS 发布文章后显示',
    noPostsCta: '去发布文章 →',
    availableText: '有档期',
    bookedText: '需预约',
    techFrontierText: '技术前沿 · 深度长文',
  },
  search: {
    title: '搜索结果',
    resultCountText: '共找到',
    emptyIcon: '🔍',
    emptyText: '未找到相关内容，试试其他关键词？',
    articlesHeader: '📄 技术文章',
    productsHeader: '🛒 爆款产品',
  },
  category: {
    breadcrumbHome: '首页',
    breadcrumbScience: '硬核肉品科学',
    navTitle: '📂 品类导航',
    postCountText: '共',
    readText: '阅读',
    notFoundIcon: '📂',
    notFoundTitle: '分类不存在',
    notFoundDesc: '您访问的分类不存在或已被删除',
    backToHome: '← 返回首页',
    emptyIcon: '📝',
    emptyTitle: '该分类下暂无文章',
    emptyDesc: '管理员可在后台 CMS 发布文章并选择此分类',
    emptyCta: '去发布文章 →',
  },
  article: {
    breadcrumbHome: '首页',
    readText: '阅读',
    helpfulText: '这篇技术文章对您有帮助吗？',
    ctaBtn: '预约中试线验证工艺 →',
  },
  product: {
    backBtn: '← 返回货架直通车',
    keyDifficulty: '⚡ 关键难点',
    featuredBadge: '⭐ 推荐',
    summaryTitle: '📋 产品概述',
    reportTitle: '🔬 逆向工艺报告',
    reportLink: '📄 查看完整工艺说明书 →',
    bookBtn: '预约中试验证 →',
    publishText: '发布于',
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
        tools: {
          gb2760: { ...defaultSiteGlobalConfig.tools.gb2760, ...(parsed.tools?.gb2760 || {}) },
          troubleshoot: { ...defaultSiteGlobalConfig.tools.troubleshoot, ...(parsed.tools?.troubleshoot || {}) },
          pilotMap: { ...defaultSiteGlobalConfig.tools.pilotMap, ...(parsed.tools?.pilotMap || {}) },
        },
        booking: { ...defaultSiteGlobalConfig.booking, ...parsed.booking },
        bookingDetail: { ...defaultSiteGlobalConfig.bookingDetail, ...parsed.bookingDetail },
        community: { ...defaultSiteGlobalConfig.community, ...parsed.community },
        ask: { ...defaultSiteGlobalConfig.ask, ...parsed.ask },
        homepage: { ...defaultSiteGlobalConfig.homepage, ...parsed.homepage },
        search: { ...defaultSiteGlobalConfig.search, ...parsed.search },
        category: { ...defaultSiteGlobalConfig.category, ...parsed.category },
        article: { ...defaultSiteGlobalConfig.article, ...parsed.article },
        product: { ...defaultSiteGlobalConfig.product, ...parsed.product },
      };
    }
  } catch { /* defaults */ }
  return defaultSiteGlobalConfig;
}
