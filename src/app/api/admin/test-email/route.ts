import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { sendEmailNotification } from '@/lib/notify';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  // 检查管理员权限
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email address required' }, { status: 400 });
    }

    const subject = '【MeatTech Pro】邮件通知测试';
    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
        <h2 style="color:#1E3A8A;margin:0 0 16px;">📧 邮件通知测试</h2>
        <p>您好，</p>
        <p>这是一封来自 <strong>MeatTech Pro</strong> 的测试邮件。</p>
        <p>如果您收到此邮件，说明邮件通知配置正确！</p>
        <div style="margin-top:20px;padding:16px;background:#F3F4F6;border-radius:8px;">
          <p style="margin:0;font-size:.9rem;color:#6B7280;">测试时间: ${new Date().toLocaleString('zh-CN')}</p>
          <p style="margin:8px 0 0;font-size:.9rem;color:#6B7280;">测试用户: ${user.email}</p>
        </div>
        <div style="margin-top:20px;">
          <p style="font-size:.85rem;color:#9CA3AF;">此邮件由系统自动发送，请勿回复。</p>
        </div>
      </div>
    `;

    const success = await sendEmailNotification(subject, html);

    if (success) {
      return NextResponse.json({ success: true, message: 'Test email sent' });
    } else {
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Test failed', detail: String(error) },
      { status: 500 }
    );
  }
}
