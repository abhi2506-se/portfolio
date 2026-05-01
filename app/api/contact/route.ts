import { NextResponse } from 'next/server'
import { dbSaveContactMessage, dbGetContactMessages, dbGetContactMessagesSummary, dbDeleteContactMessage, dbArchiveContactMessage } from '@/lib/db'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// Detect hiring intent from message text
function detectIntent(message: string): string {
  const lower = message.toLowerCase()
  const hiringKeywords = [
    'hire', 'hiring', 'job', 'opportunity', 'position', 'role', 'work', 'freelance',
    'contract', 'project', 'collaborate', 'team', 'salary', 'offer', 'interview',
    'recruit', 'developer', 'engineer', 'remote', 'full-time', 'part-time',
  ]
  return hiringKeywords.some(kw => lower.includes(kw)) ? 'hiring' : 'general'
}

async function sendAdminNotification({
  name, email, subject, message, intent, receivedAt,
}: { name: string; email: string; subject: string; message: string; intent: string; receivedAt: string }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.ADMIN_EMAIL) return

  const intentLabel = intent === 'hiring' ? '💼 Hiring Intent' : '💬 General Query'
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 16px;">
    <div style="background:linear-gradient(135deg,#1e40af,#0891b2);border-radius:16px 16px 0 0;padding:28px 32px;">
      <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">📬 New Portfolio Message</h1>
      <p style="margin:6px 0 0;color:#bae6fd;font-size:14px;">Someone reached out via your portfolio contact form</p>
    </div>
    <div style="background:#1e293b;border-radius:0 0 16px 16px;padding:28px 32px;border:1px solid #334155;border-top:none;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
        <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#3b82f6,#06b6d4);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <span style="color:#fff;font-size:18px;font-weight:700;">${name.charAt(0).toUpperCase()}</span>
        </div>
        <div>
          <p style="margin:0;color:#f1f5f9;font-weight:600;font-size:16px;">${name}</p>
          <a href="mailto:${email}" style="color:#60a5fa;font-size:13px;text-decoration:none;">${email}</a>
        </div>
        <span style="margin-left:auto;background:${intent === 'hiring' ? '#78350f' : '#1e3a5f'};color:${intent === 'hiring' ? '#fbbf24' : '#93c5fd'};padding:4px 12px;border-radius:999px;font-size:12px;font-weight:600;">${intentLabel}</span>
      </div>

      <div style="background:#0f172a;border-radius:10px;padding:16px 20px;margin-bottom:20px;border-left:3px solid #3b82f6;">
        ${subject ? `<p style="margin:0 0 8px;color:#94a3b8;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Subject</p><p style="margin:0 0 12px;color:#e2e8f0;font-size:14px;font-weight:500;">${subject}</p>` : ''}
        <p style="margin:0 0 8px;color:#94a3b8;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Message</p>
        <p style="margin:0;color:#cbd5e1;font-size:14px;line-height:1.7;">${message.replace(/\n/g, '<br>')}</p>
      </div>

      <div style="background:#0f172a;border-radius:10px;padding:12px 20px;margin-bottom:24px;">
        <p style="margin:0;color:#64748b;font-size:12px;">⏰ Received: <strong style="color:#94a3b8;">${receivedAt}</strong></p>
      </div>

      <a href="https://portfolio-v7-mauve.vercel.app/admin/dashboard" style="display:block;text-align:center;background:linear-gradient(135deg,#2563eb,#0891b2);color:#fff;font-weight:600;font-size:14px;padding:14px;border-radius:10px;text-decoration:none;">
        Open Admin Panel →
      </a>
    </div>
    <p style="text-align:center;color:#475569;font-size:12px;margin-top:16px;">Abhishek Singh Portfolio — Auto-notification</p>
  </div>
</body>
</html>`

  try {
    await transporter.sendMail({
      from: `"Portfolio Notifications" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `📬 New ${intent === 'hiring' ? '💼 Hiring' : '💬 General'} message from ${name}`,
      html,
    })
  } catch (e) {
    console.error('[contact] Admin notification failed:', e)
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, subject, message } = body

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const intent = detectIntent(message)
    const id = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const now = Date.now()

    await dbSaveContactMessage({
      id,
      name: name.trim().slice(0, 100),
      email: email.trim().toLowerCase().slice(0, 200),
      subject: subject?.trim().slice(0, 200) || '',
      message: message.trim().slice(0, 2000),
      intent,
      created_at: now,
    })

    // Send admin notification instantly (non-blocking)
    const receivedAt = new Date(now).toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata',
    })
    sendAdminNotification({
      name: name.trim(),
      email: email.trim(),
      subject: subject?.trim() || '',
      message: message.trim(),
      intent,
      receivedAt,
    })

    return NextResponse.json({ ok: true, intent })
  } catch (e) {
    console.error('[contact] POST error:', e)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') || 'list'

    if (type === 'summary') {
      const summary = await dbGetContactMessagesSummary()
      return NextResponse.json({ data: summary })
    }

    const messages = await dbGetContactMessages(50)
    return NextResponse.json({ data: messages })
  } catch (e) {
    console.error('[contact] GET error:', e)
    return NextResponse.json({ data: null }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    await dbDeleteContactMessage(id)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[contact] DELETE error:', e)
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const action = searchParams.get('action')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    if (action === 'archive') {
      await dbArchiveContactMessage(id)
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (e) {
    console.error('[contact] PATCH error:', e)
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 })
  }
}
