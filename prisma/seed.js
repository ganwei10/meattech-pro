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

  // Products (upsert by title)
  const products = [
    { title: '盒马黑椒牛柳（空气炸锅版）', category: '气调预制菜', difficulty: '高注水率下保嫩 — 复热后汁液流失率控制在8%以内' },
    { title: '山姆原切风味西冷牛排', category: '低温调理肉', difficulty: '真空滚揉与保水性 — 滚揉时间/真空度/盐水注射率三参数联调' },
    { title: '脆皮大肠预制菜', category: '休闲及其他', difficulty: '工业预熟与去腥 — 酶解嫩化+复合香料包掩蔽技术' },
  ];
  for (const p of products) {
    const existing = await prisma.product.findFirst({ where: { title: p.title } });
    if (!existing) {
      await prisma.product.create({ data: p });
    }
  }

  // Pilot lines (upsert by name)
  const pilotLines = [
    { name: '120L 真空斩拌机', region: '华东区', status: 'AVAILABLE', specs: '容量120L | 最大转速6000rpm | 真空度-0.09MPa' },
    { name: '连续式全自动烟熏炉', region: '华北区', status: 'BOOKED', specs: '产能500kg/h | 烟熏/蒸煮/干燥一体 | PLC自动控制' },
    { name: '液氮速冻隧道产线', region: '华南区', status: 'AVAILABLE', specs: '-196液氮 | 产能2t/h | 降温速率15/min' },
  ];
  for (const pl of pilotLines) {
    const existing = await prisma.pilotLine.findFirst({ where: { name: pl.name } });
    if (!existing) {
      await prisma.pilotLine.create({ data: pl });
    }
  }

  console.log('Seed completed successfully');
}

main().catch(console.error).finally(() => prisma.$disconnect());
