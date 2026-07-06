import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '隐私政策 — MeatTech Pro',
  description: 'MeatTech Pro 隐私政策，说明我们如何收集、使用、存储和保护您的个人信息。',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 面包屑导航 */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-3 text-sm text-gray-500 sm:px-6">
          <Link href="/" className="hover:text-brand-blue">首页</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">隐私政策</span>
        </div>
      </nav>

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {/* 页面标题 */}
        <header className="mb-10 border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-900">隐私政策</h1>
          <p className="mt-2 text-sm text-gray-500">最后更新日期：2026年7月</p>
        </header>

        <div className="prose prose-sm sm:prose-base max-w-none">
          {/* 引言 */}
          <p className="text-gray-600 leading-relaxed">
            MeatTech Pro（以下简称"本平台"）非常重视用户隐私。本隐私政策说明我们在您使用本平台服务时，如何收集、使用、存储和保护您的个人信息。请您仔细阅读以下内容。
          </p>

          {/* 1. 信息收集 */}
          <h2 className="mt-8 text-xl font-bold text-gray-900">一、信息收集</h2>
          <p className="mt-2 text-gray-600 leading-relaxed">在您使用本平台服务时，我们可能收集以下信息：</p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600">
            <li><strong>账号信息：</strong>邮箱地址、手机号码等注册信息</li>
            <li><strong>预约信息：</strong>中试产线预约时提交的机构名称、联系人、工艺需求等</li>
            <li><strong>浏览记录：</strong>您访问的页面、搜索关键词、点击行为等</li>
            <li><strong>设备信息：</strong>浏览器类型、操作系统、IP 地址等技术信息</li>
          </ul>

          {/* 2. 信息使用 */}
          <h2 className="mt-8 text-xl font-bold text-gray-900">二、信息使用</h2>
          <p className="mt-2 text-gray-600 leading-relaxed">我们收集的信息将用于以下目的：</p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600">
            <li><strong>账号管理：</strong>创建和管理您的用户账户，提供登录认证服务</li>
            <li><strong>预约服务：</strong>处理您的中试产线预约请求，协调机构安排</li>
            <li><strong>内容推荐：</strong>根据您的浏览记录和兴趣，推荐相关工艺技术内容</li>
            <li><strong>平台运营：</strong>维护平台正常运行，改进服务质量和用户体验</li>
            <li><strong>安全防护：</strong>检测和防范欺诈行为，保障平台安全</li>
          </ul>

          {/* 3. 信息存储与保护 */}
          <h2 className="mt-8 text-xl font-bold text-gray-900">三、信息存储与保护</h2>
          <p className="mt-2 text-gray-600 leading-relaxed">
            您的个人信息存储在安全的服务器上，我们采取以下措施保护数据安全：
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600">
            <li>使用 SSL/TLS 加密技术传输敏感数据</li>
            <li>密码采用 bcrypt 算法加盐哈希存储，不以明文形式保存</li>
            <li>对敏感操作实施访问控制和权限管理</li>
            <li>定期进行安全审计和漏洞排查</li>
            <li>数据备份和灾难恢复机制</li>
          </ul>
          <p className="mt-2 text-gray-600 leading-relaxed">
            尽管我们采取了合理的安全措施，但请注意，互联网传输不存在绝对安全的方式，我们无法保证信息不被未经授权的访问。
          </p>

          {/* 4. 信息共享 */}
          <h2 className="mt-8 text-xl font-bold text-gray-900">四、信息共享</h2>
          <p className="mt-2 text-gray-600 leading-relaxed">
            本平台<strong>不会向第三方出售或出租您的个人信息</strong>。在以下情形中，我们可能共享必要的信息：
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600">
            <li><strong>预约服务：</strong>在您提交中试预约后，将必要信息共享给相关机构以安排服务</li>
            <li><strong>法律要求：</strong>根据法律法规要求，或应政府主管部门的合法要求</li>
            <li><strong>用户同意：</strong>获得您的明确同意后，与指定第三方共享信息</li>
          </ul>

          {/* 5. Cookie 使用 */}
          <h2 className="mt-8 text-xl font-bold text-gray-900">五、Cookie 使用</h2>
          <p className="mt-2 text-gray-600 leading-relaxed">
            本平台使用 Cookie 及类似技术来：
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600">
            <li>维持您的登录状态，避免重复输入账号密码</li>
            <li>记录您的偏好设置，改善浏览体验</li>
            <li>分析平台使用情况，优化服务功能</li>
          </ul>
          <p className="mt-2 text-gray-600 leading-relaxed">
            您可以通过浏览器设置管理或删除 Cookie，但部分功能可能受到影响。
          </p>

          {/* 6. 用户权利 */}
          <h2 className="mt-8 text-xl font-bold text-gray-900">六、用户权利</h2>
          <p className="mt-2 text-gray-600 leading-relaxed">您对个人信息享有以下权利：</p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600">
            <li><strong>查看权：</strong>随时查看您的个人资料和账户信息</li>
            <li><strong>修改权：</strong>更正或更新您的个人信息</li>
            <li><strong>删除权：</strong>申请删除您的账户和相关数据</li>
            <li><strong>撤回同意权：</strong>撤回之前给予的信息处理同意</li>
            <li><strong>数据可携权：</strong>以可读格式获取您的个人数据副本</li>
          </ul>
          <p className="mt-2 text-gray-600 leading-relaxed">
            如需行使上述权利，请通过下方联系方式与我们沟通。
          </p>

          {/* 7. 联系方式 */}
          <h2 className="mt-8 text-xl font-bold text-gray-900">七、联系方式</h2>
          <p className="mt-2 text-gray-600 leading-relaxed">
            如您对本隐私政策有任何疑问、建议或投诉，请通过以下方式联系我们：
          </p>
          <div className="mt-3 rounded-lg bg-blue-50 p-4">
            <p className="text-gray-700">
              邮箱：<a href="mailto:admin@meattech.pro" className="font-semibold text-brand-blue hover:underline">admin@meattech.pro</a>
            </p>
            <p className="mt-1 text-sm text-gray-500">我们将在收到您的反馈后尽快回复。</p>
          </div>

          <p className="mt-10 border-t border-gray-200 pt-6 text-sm text-gray-400">
            本隐私政策可能不时更新，更新后将在本页面公布。继续使用本平台即视为您同意更新后的隐私政策。
          </p>
        </div>
      </article>
    </div>
  );
}
