import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '用户协议 — MeatTech Pro',
  description: 'MeatTech Pro 用户协议，规定平台服务使用规则及双方权利义务。',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 面包屑导航 */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-3 text-sm text-gray-500 sm:px-6">
          <Link href="/" className="hover:text-brand-blue">首页</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">用户协议</span>
        </div>
      </nav>

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {/* 页面标题 */}
        <header className="mb-10 border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-900">用户协议</h1>
          <p className="mt-2 text-sm text-gray-500">最后更新日期：2026年7月</p>
        </header>

        <div className="prose prose-sm sm:prose-base max-w-none">
          {/* 引言 */}
          <p className="text-gray-600 leading-relaxed">
            欢迎使用 MeatTech Pro（以下简称"本平台"）。请在使用本平台服务前，仔细阅读并同意以下用户协议。一旦您注册或使用本平台服务，即视为您已充分理解并接受本协议的全部条款。
          </p>

          {/* 1. 服务说明 */}
          <h2 className="mt-8 text-xl font-bold text-gray-900">一、服务说明</h2>
          <p className="mt-2 text-gray-600 leading-relaxed">
            MeatTech Pro 是一个连接肉品工艺工程师与中试产能的产业平台，为用户提供以下服务：
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600">
            <li>肉制品工艺技术信息与知识分享</li>
            <li>共享中试产线在线预约服务</li>
            <li>工艺问答社区交流</li>
            <li>商超爆款逆向研发案例展示</li>
            <li>其他平台提供的增值服务</li>
          </ul>

          {/* 2. 用户注册 */}
          <h2 className="mt-8 text-xl font-bold text-gray-900">二、用户注册</h2>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600">
            <li>用户须提供真实、准确、完整的个人信息进行注册</li>
            <li>实行一人一号原则，每个用户仅可注册一个账户</li>
            <li>不得冒用他人身份或使用虚假信息注册</li>
            <li>账户密码由用户自行保管，因密码泄露导致的损失由用户自行承担</li>
            <li>如发现账户被盗用或异常使用，请立即联系平台</li>
          </ul>

          {/* 3. 用户行为规范 */}
          <h2 className="mt-8 text-xl font-bold text-gray-900">三、用户行为规范</h2>
          <p className="mt-2 text-gray-600 leading-relaxed">用户在使用本平台时，须遵守以下规范：</p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600">
            <li>禁止发布违法、淫秽、暴力、歧视性内容</li>
            <li>禁止发布广告、垃圾信息、无关推广内容</li>
            <li>禁止恶意预约、频繁取消预约、占用中试资源</li>
            <li>禁止侵犯他人知识产权、隐私权等合法权益</li>
            <li>禁止利用平台从事任何危害网络安全的行为</li>
            <li>禁止以任何方式干扰平台正常运行</li>
          </ul>
          <p className="mt-2 text-gray-600 leading-relaxed">
            违反上述规范的用户，平台有权采取警告、限制功能、封禁账户等措施。
          </p>

          {/* 4. 知识产权 */}
          <h2 className="mt-8 text-xl font-bold text-gray-900">四、知识产权</h2>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600">
            <li>本平台的文章、案例、工具、设计等内容版权归 MeatTech Pro 所有</li>
            <li>未经授权，不得复制、转载、传播平台受版权保护的内容</li>
            <li>用户在社区发布的内容，用户保留版权，但授权平台在服务范围内使用、展示和传播</li>
            <li>用户发布的内容不得侵犯他人知识产权，因侵权导致的法律责任由用户自行承担</li>
          </ul>

          {/* 5. 中试预约 */}
          <h2 className="mt-8 text-xl font-bold text-gray-900">五、中试预约</h2>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600">
            <li>用户通过本平台提交的中试预约为意向提交，不构成最终预约确认</li>
            <li>最终预约安排由相关机构确认，具体时间、费用、工艺方案以机构回复为准</li>
            <li>平台作为信息对接服务提供方，不对机构的设备状况、服务质量、工艺结果负责</li>
            <li>用户与机构之间因预约服务产生的纠纷，应直接与机构协商解决</li>
            <li>如遇机构无法提供服务的情况，平台将协助用户对接其他可用资源</li>
          </ul>

          {/* 6. 免责声明 */}
          <h2 className="mt-8 text-xl font-bold text-gray-900">六、免责声明</h2>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600">
            <li>平台提供的工艺技术信息、配方参数、操作指南等内容仅供参考</li>
            <li>实际生产应用需由专业技术人员根据具体条件验证和调整</li>
            <li>平台不对用户依据平台信息进行实际生产的结果承担任何责任</li>
            <li>因不可抗力（自然灾害、网络故障等）导致服务中断，平台不承担责任</li>
            <li>平台不对用户间交流内容的准确性和安全性做出担保</li>
          </ul>

          {/* 7. 服务变更与终止 */}
          <h2 className="mt-8 text-xl font-bold text-gray-900">七、服务变更与终止</h2>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600">
            <li>平台保留随时修改、暂停或终止部分或全部服务的权利</li>
            <li>服务变更或终止前，平台将尽可能提前通知用户</li>
            <li>用户可随时申请注销账户，注销后相关数据将按隐私政策处理</li>
            <li>平台有权根据本协议条款，对违规用户终止服务</li>
          </ul>

          {/* 8. 争议解决 */}
          <h2 className="mt-8 text-xl font-bold text-gray-900">八、争议解决</h2>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600">
            <li>本协议的签订、履行、解释及争议解决均适用中华人民共和国法律</li>
            <li>因本协议或使用本平台产生的争议，双方应优先通过友好协商解决</li>
            <li>协商不成的，任何一方均可向平台所在地仲裁机构申请仲裁</li>
          </ul>

          {/* 9. 联系方式 */}
          <h2 className="mt-8 text-xl font-bold text-gray-900">九、联系方式</h2>
          <p className="mt-2 text-gray-600 leading-relaxed">
            如您对本协议有任何疑问，请通过以下方式联系我们：
          </p>
          <div className="mt-3 rounded-lg bg-blue-50 p-4">
            <p className="text-gray-700">
              邮箱：<a href="mailto:admin@meattech.pro" className="font-semibold text-brand-blue hover:underline">admin@meattech.pro</a>
            </p>
            <p className="mt-1 text-sm text-gray-500">我们将在收到您的反馈后尽快回复。</p>
          </div>

          <p className="mt-10 border-t border-gray-200 pt-6 text-sm text-gray-400">
            本平台保留对本用户协议的最终解释权。协议更新后将在本页面公布，继续使用本平台即视为您同意更新后的协议。
          </p>
        </div>
      </article>
    </div>
  );
}
