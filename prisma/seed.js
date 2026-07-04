const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // Admin user
  await prisma.user.upsert({
    where: { email: 'admin@meattech.pro' },
    update: {},
    create: {
      email: 'admin@meattech.pro',
      password: bcrypt.hashSync('admin123', 10),
      name: '平台管理员',
      role: 'ADMIN',
    },
  });

  // Categories
  const categories = [
    { name: '中式酱卤肉制品', slug: 'chinese-braised', icon: 'folder', order: 1 },
    { name: '西式低温熏煮肉制品', slug: 'western-smoked', icon: 'folder', order: 2 },
    { name: '速冻调制肉制品（预制菜）', slug: 'frozen-prepared', icon: 'folder', order: 3 },
    { name: '发酵与肉干制品', slug: 'fermented-dried', icon: 'folder', order: 4 },
  ];
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  const cat1 = await prisma.category.findUnique({ where: { slug: 'chinese-braised' } });
  const cat2 = await prisma.category.findUnique({ where: { slug: 'western-smoked' } });

  // Posts
  await prisma.post.upsert({
    where: { slug: 'clean-label-sausage' },
    update: {},
    create: {
      title: '告别特种保水剂：利用肌原纤维蛋白热诱导凝胶原理做无添加烤肠',
      slug: 'clean-label-sausage',
      excerpt: '本文从肌球蛋白、肌动蛋白在55-70区间的热变性凝胶机制出发，结合磷酸盐替代方案（海藻酸钠+卡拉胶复配），系统阐述在零复合磷酸盐条件下，如何通过原料肉预处理、斩拌温度曲线控制、以及两段式加热工艺实现烤肠保水率88%以上的工业化落地路径。',
      content: '<h2>一、背景：清洁标签趋势下的保水难题</h2><p>随着消费者对"清洁标签"的需求日益增长，传统复合磷酸盐保水剂面临淘汰压力。本文探讨利用肌原纤维蛋白自身的热诱导凝胶特性，在无添加条件下实现等效保水效果。</p><h2>二、肌原纤维蛋白热诱导凝胶机制</h2><p>肌球蛋白在55-60开始变性，形成三维凝胶网络结构。通过控制升温速率和持温时间，可以优化凝胶强度，实现保水率88%以上。</p><h2>三、工艺参数</h2><ul><li>斩拌终温：≤8</li><li>灌装后静置：4，2小时</li><li>一段蒸煮：55，30min</li><li>二段蒸煮：75，至中心温度72</li></ul><p>该工艺已在3家工厂完成中试验证，产品保水率稳定在88-91%区间。</p>',
      author: '王工 · 肉品科学博士',
      tags: '清洁标签,保水性,烤肠,肌原纤维蛋白',
      categoryId: cat1.id,
      featured: true,
      views: 3420,
    },
  });

  await prisma.post.upsert({
    where: { slug: 'troubleshoot-ham-water' },
    update: {},
    create: {
      title: '10分钟排查法：低温切片火腿车间出水、出油的工艺参数校准指南',
      slug: 'troubleshoot-ham-water',
      excerpt: '针对低温切片火腿生产中最常见的出水、出油、切片散碎三大顽疾，本文提供一套标准化的10分钟快速排查流程——从滚揉真空度、蒸煮中心温度、降温速率三个核心参数入手，配合故障-参数对应矩阵表，帮助车间技术员快速定位问题根源。',
      content: '<h2>故障排查矩阵</h2><table><tr><th>故障现象</th><th>可能原因</th><th>校准参数</th></tr><tr><td>出水/汁液流失</td><td>蒸煮F值不足</td><td>提高中心温度至72</td></tr><tr><td>出油/脂肪游离</td><td>滚揉真空度不够</td><td>真空度≥-0.08MPa</td></tr><tr><td>切片散碎</td><td>降温速率不足</td><td>核心降温≤4/h</td></tr><tr><td>色泽发暗</td><td>亚硝残留量异常</td><td>校验亚硝添加量</td></tr></table><p>按此矩阵逐项排查，90%的常见故障可在10分钟内定位。</p>',
      author: '李工 · 高级工艺工程师',
      tags: '故障排查,低温火腿,出水,滚揉',
      categoryId: cat2.id,
      featured: true,
      views: 5180,
    },
  });

  await prisma.post.upsert({
    where: { slug: 'ye-salt-reduction' },
    update: {},
    create: {
      title: '安琪酵母抽提物（YE）在减盐酱卤肉中的风味补偿及减盐20%落地配方',
      slug: 'ye-salt-reduction',
      excerpt: '通过YE的天然呈味核苷酸与氨基酸协同效应，在氯化钠添加量降低20%的条件下，实现咸味感知等效补偿。详细对比3种YE型号在不同酱卤体系中的鲜味当量曲线，并附完整中试验证数据。',
      content: '<h2>减盐方案概述</h2><p>使用安琪YE FA31/FA33/HVP三种型号进行对比测试，在酱卤牛肉体系中实现减盐20%且咸味感知无显著差异。</p><h2>配方对比</h2><p>对照组NaCl 2.4%，实验组NaCl 1.92% + YE 0.3%。感官评价显示咸味等效性p>0.05。</p>',
      author: 'MeatTech Pro 编辑部',
      tags: '辅料应用,减盐,YE,酱卤',
      categoryId: cat1.id,
      featured: false,
      views: 2180,
    },
  });

  // Products
  const products = [
    { title: '盒马黑椒牛柳（空气炸锅版）', category: '气调预制菜', difficulty: '高注水率下保嫩 — 复热后汁液流失率控制在8%以内' },
    { title: '山姆原切风味西冷牛排', category: '低温调理肉', difficulty: '真空滚揉与保水性 — 滚揉时间/真空度/盐水注射率三参数联调' },
    { title: '脆皮大肠预制菜', category: '休闲及其他', difficulty: '工业预熟与去腥 — 酶解嫩化+复合香料包掩蔽技术' },
  ];
  for (const p of products) {
    const existing = await prisma.product.findFirst({ where: { title: p.title } });
    if (!existing) await prisma.product.create({ data: p });
  }

  // Pilot lines
  const pilotLines = [
    { name: '120L 真空斩拌机', region: '华东区', status: 'AVAILABLE', specs: '容量120L | 最大转速6000rpm | 真空度-0.09MPa', capacity: '120kg/批次' },
    { name: '连续式全自动烟熏炉', region: '华北区', status: 'BOOKED', specs: '产能500kg/h | 烟熏/蒸煮/干燥一体 | PLC自动控制', capacity: '500kg/h' },
    { name: '液氮速冻隧道产线', region: '华南区', status: 'AVAILABLE', specs: '-196液氮 | 产能2t/h | 降温速率15/min', capacity: '2t/h' },
  ];
  for (const pl of pilotLines) {
    const existing = await prisma.pilotLine.findFirst({ where: { name: pl.name } });
    if (!existing) await prisma.pilotLine.create({ data: pl });
  }

  // GB 2760 Additives
  const additives = [
    { name: '亚硝酸钠', alias: '亚硝酸盐', casNumber: '7632-00-0', functionClass: '护色剂', maxLimit: '0.15 g/kg', foodCategory: '腌制肉制品类、酱卤肉制品类', remarks: '以亚硝酸钠计，残留量≤30mg/kg' },
    { name: '脱氢乙酸钠', alias: '脱氢醋酸钠', casNumber: '4418-26-2', functionClass: '防腐剂', maxLimit: '0.3 g/kg', foodCategory: '发酵肉制品类、预制肉制品类', remarks: '以脱氢乙酸计' },
    { name: 'D-异抗坏血酸钠', alias: '异VC钠', casNumber: '6381-77-7', functionClass: '抗氧化剂', maxLimit: '1.0 g/kg', foodCategory: '预制肉制品、腌制肉制品', remarks: '以抗坏血酸计' },
    { name: '乳酸钠', alias: '', casNumber: '72-17-3', functionClass: '水分保持剂', maxLimit: '按生产需要适量使用', foodCategory: '生湿面制品、肉制品', remarks: 'GMP原则，无具体限量' },
    { name: '山梨酸钾', alias: '山梨酸盐', casNumber: '24634-61-5', functionClass: '防腐剂', maxLimit: '0.075 g/kg', foodCategory: '肉灌肠类', remarks: '以山梨酸计' },
    { name: '红曲红', alias: '红曲色素', casNumber: null, functionClass: '着色剂', maxLimit: '按生产需要适量使用', foodCategory: '熟肉制品、腌制肉制品', remarks: '天然色素，GMP原则' },
    { name: '卡拉胶', alias: '鹿角藻胶', casNumber: '9000-07-1', functionClass: '增稠剂', maxLimit: '按生产需要适量使用', foodCategory: '肉制品', remarks: '需标注' },
    { name: '海藻酸钠', alias: '褐藻酸钠', casNumber: '9005-38-3', functionClass: '增稠剂', maxLimit: '按生产需要适量使用', foodCategory: '肉制品', remarks: '常与卡拉胶复配使用' },
    { name: '乳酸链球菌素', alias: 'Nisin', casNumber: '1414-45-5', functionClass: '防腐剂', maxLimit: '0.5 g/kg', foodCategory: '肉制品', remarks: '生物防腐剂，天然发酵产物' },
    { name: '谷氨酰胺转氨酶', alias: 'TG酶', casNumber: '80146-85-6', functionClass: '稳定剂和凝固剂', maxLimit: '按生产需要适量使用', foodCategory: '肉制品', remarks: '可改善肉质结构' },
  ];
  for (const a of additives) {
    const existing = await prisma.additive.findFirst({ where: { name: a.name } });
    if (!existing) await prisma.additive.create({ data: a });
  }

  // Troubleshoot decision tree nodes
  const existingNodes = await prisma.troubleshootNode.count();
  if (existingNodes === 0) {
    await prisma.troubleshootNode.createMany({
      data: [
        // 出水/汁液流失
        { category: '出水/汁液流失', question: '产品出水发生在哪个环节？', options: JSON.stringify([
          { text: '蒸煮后冷却阶段出水', nextNodeId: 2 },
          { text: '切片/包装时出水', nextNodeId: 3 },
          { text: '储存/货架期出水', nextNodeId: 4 },
        ]), isLeaf: false },
        { category: '出水/汁液流失', question: '蒸煮后冷却阶段出水，检查蒸煮中心温度是否达标？', options: JSON.stringify([
          { text: '中心温度未达到72℃', nextNodeId: 5 },
          { text: '中心温度已达标(≥72℃)', nextNodeId: 6 },
        ]), isLeaf: false },
        { category: '出水/汁液流失', question: '切片出水通常与降温速率有关，核心降温速率是否≤4℃/h？', options: JSON.stringify([
          { text: '降温速率过慢', nextNodeId: 7 },
          { text: '降温速率正常', nextNodeId: 6 },
        ]), isLeaf: false },
        { category: '出水/汁液流失', question: '货架期出水可能与包装阻隔性有关，是否使用高阻隔包装膜？', options: JSON.stringify([
          { text: '是，使用高阻隔膜', nextNodeId: 6 },
          { text: '否，普通包装膜', nextNodeId: 8 },
        ]), isLeaf: false },
        { category: '出水/汁液流失', question: '', options: '[]', isLeaf: true, advice: '<strong>原因：蒸煮F值不足</strong><br/>中心温度未达到72℃导致蛋白质变性不充分，持水网络未完全形成。<br/><strong>建议：</strong><br/>1. 提高蒸煮温度或延长蒸煮时间，确保中心温度≥72℃<br/>2. 检查蒸煮炉温度均匀性<br/>3. 校准中心温度探针精度' },
        { category: '出水/汁液流失', question: '检查滚揉工艺参数', options: JSON.stringify([
          { text: '滚揉真空度≥-0.08MPa', nextNodeId: 9 },
          { text: '滚揉真空度不足', nextNodeId: 10 },
        ]), isLeaf: false },
        { category: '出水/汁液流失', question: '', options: '[]', isLeaf: true, advice: '<strong>原因：降温速率不足</strong><br/>核心降温速率过慢导致冰晶粗大，破坏蛋白质凝胶结构。<br/><strong>建议：</strong><br/>1. 增加冷却水流量或降低水温<br/>2. 缩短产品从蒸煮到冷却的转移时间<br/>3. 考虑使用液氮速冻替代常规冷却' },
        { category: '出水/汁液流失', question: '', options: '[]', isLeaf: true, advice: '<strong>原因：包装阻隔性不足</strong><br/>普通包装膜透水率高，导致货架期水分蒸发冷凝。<br/><strong>建议：</strong><br/>1. 更换7层共挤高阻隔膜(EVOH)<br/>2. 采用气调包装(70%N₂+30%CO₂)<br/>3. 检查封口完整性' },
        { category: '出水/汁液流失', question: '检查盐水注射率', options: JSON.stringify([
          { text: '注射率≤20%', nextNodeId: 6 },
          { text: '注射率>20%', nextNodeId: 11 },
        ]), isLeaf: false },
        { category: '出水/汁液流失', question: '', options: '[]', isLeaf: true, advice: '<strong>原因：滚揉真空度不足</strong><br/>真空度不够导致肌原纤维蛋白提取不充分，持水性下降。<br/><strong>建议：</strong><br/>1. 检查真空泵性能，确保真空度≥-0.08MPa<br/>2. 检查滚揉筒密封圈<br/>3. 适当延长滚揉时间（总时间≥4h）' },
        { category: '出水/汁液流失', question: '', options: '[]', isLeaf: true, advice: '<strong>原因：盐水注射率过高</strong><br/>注射率超过20%时，蛋白质网络无法有效束缚多余水分。<br/><strong>建议：</strong><br/>1. 将注射率控制在15-20%<br/>2. 添加0.3%复配磷酸盐提升持水<br/>3. 考虑使用滚揉替代部分注射' },

        // 出油/脂肪游离
        { category: '出油/脂肪游离', question: '出油发生在哪个阶段？', options: JSON.stringify([
          { text: '蒸煮过程中出油', nextNodeId: 13 },
          { text: '成品切片时出油', nextNodeId: 14 },
        ]), isLeaf: false },
        { category: '出油/脂肪游离', question: '蒸煮升温速率是否过快？', options: JSON.stringify([
          { text: '升温速率>3℃/min', nextNodeId: 15 },
          { text: '升温速率正常', nextNodeId: 16 },
        ]), isLeaf: false },
        { category: '出油/脂肪游离', question: '', options: '[]', isLeaf: true, advice: '<strong>原因：降温过程中脂肪结晶粗大</strong><br/>切片时脂肪融化溢出。<br/><strong>建议：</strong><br/>1. 提高降温速率，快速通过脂肪结晶温度带<br/>2. 切片前确保产品中心温度≤4℃<br/>3. 检查脂肪原料新鲜度' },
        { category: '出油/脂肪游离', question: '', options: '[]', isLeaf: true, advice: '<strong>原因：蒸煮升温过快</strong><br/>升温速率过快导致脂肪细胞破裂，油脂游离。<br/><strong>建议：</strong><br/>1. 采用阶梯式升温：55℃→65℃→75℃<br/>2. 每段升温速率≤2℃/min<br/>3. 增加中间持温段' },
        { category: '出油/脂肪游离', question: '脂肪原料是否预处理？', options: JSON.stringify([
          { text: '未预处理', nextNodeId: 17 },
          { text: '已预处理', nextNodeId: 18 },
        ]), isLeaf: false },
        { category: '出油/脂肪游离', question: '', options: '[]', isLeaf: true, advice: '<strong>原因：脂肪未预冷处理</strong><br/>脂肪直接使用导致斩拌中温度升高过快。<br/><strong>建议：</strong><br/>1. 脂肪预冷至-4~-2℃后再投入斩拌<br/>2. 斩拌过程中加冰屑控温<br/>3. 斩拌终温控制在≤8℃' },
        { category: '出油/脂肪游离', question: '', options: '[]', isLeaf: true, advice: '<strong>排查完成：基础工艺正常</strong><br/>建议检查：<br/>1. 脂肪与瘦肉比例是否合理（建议≤30%）<br/>2. 乳化剂添加量是否足够<br/>3. 灌装压力是否过大' },

        // 切片散碎
        { category: '切片散碎', question: '切片散碎的方向是？', options: JSON.stringify([
          { text: '纵向断裂（沿纤维方向）', nextNodeId: 20 },
          { text: '横向断裂（垂直纤维方向）', nextNodeId: 21 },
        ]), isLeaf: false },
        { category: '切片散碎', question: '', options: '[]', isLeaf: true, advice: '<strong>原因：凝胶强度不足</strong><br/>纵向断裂通常因蛋白质凝胶网络不完整。<br/><strong>建议：</strong><br/>1. 检查滚揉是否充分（提取盐溶蛋白）<br/>2. 确保腌制时间≥12h<br/>3. 添加0.2%大豆分离蛋白增强凝胶' },
        { category: '切片散碎', question: '产品冷却是否充分？', options: JSON.stringify([
          { text: '中心温度≤4℃', nextNodeId: 22 },
          { text: '中心温度>4℃', nextNodeId: 23 },
        ]), isLeaf: false },
        { category: '切片散碎', question: '', options: '[]', isLeaf: true, advice: '<strong>基础工艺正常</strong><br/>建议检查：<br/>1. 切片刀锋利度和转速<br/>2. 切片厚度设置<br/>3. 添加结着剂（如TG酶）改善切片性' },
        { category: '切片散碎', question: '', options: '[]', isLeaf: true, advice: '<strong>原因：冷却不充分</strong><br/>产品中心温度过高时切片，凝胶尚未完全定型。<br/><strong>建议：</strong><br/>1. 确保切片前中心温度≤4℃<br/>2. 延长冷却时间<br/>3. 检查冷库温度是否达标（≤0℃）' },

        // 色泽异常
        { category: '色泽异常', question: '色泽异常的具体表现？', options: JSON.stringify([
          { text: '色泽发暗/偏黑', nextNodeId: 25 },
          { text: '色泽发白/偏浅', nextNodeId: 26 },
          { text: '色泽不均匀', nextNodeId: 27 },
        ]), isLeaf: false },
        { category: '色泽异常', question: '', options: '[]', isLeaf: true, advice: '<strong>原因：亚硝酸盐用量异常或美拉德反应过度</strong><br/><strong>建议：</strong><br/>1. 校验亚硝酸钠添加量（≤0.15g/kg）<br/>2. 检查残留量是否在30mg/kg以内<br/>3. 降低烟熏温度/时间，防止过度美拉德反应<br/>4. 检查原料肉新鲜度' },
        { category: '色泽异常', question: '', options: '[]', isLeaf: true, advice: '<strong>原因：发色不充分或亚硝酸盐不足</strong><br/><strong>建议：</strong><br/>1. 检查亚硝酸钠添加量是否达标<br/>2. 延长发色时间（腌制≥12h）<br/>3. 确保腌制温度2-4℃<br/>4. 添加D-异抗坏血酸钠（0.05%）助发色' },
        { category: '色泽异常', question: '', options: '[]', isLeaf: true, advice: '<strong>原因：原料差异或加工不均匀</strong><br/><strong>建议：</strong><br/>1. 统一原料肉来源和批次<br/>2. 确保滚揉均匀（间歇式滚揉，正反转交替）<br/>3. 检查蒸煮温度均匀性<br/>4. 控制产品直径一致' },
      ],
    });
  }

  console.log('Seed completed successfully');
}

main().catch(console.error).finally(() => prisma.$disconnect());
