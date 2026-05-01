import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { to, subject, message, senderName } = body

    if (!to?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(to)) {
      return NextResponse.json({ error: 'Invalid recipient email' }, { status: 400 })
    }

    const mailOptions = {
      from: `"${senderName || 'Abhishek Singh Portfolio'}" <${process.env.SMTP_USER}>`,
      to: to.trim(),
      subject: `Re: ${subject.trim()}`,
      text: message.trim(),
      replyTo: process.env.SMTP_USER,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[reply] POST error:', e)
    return NextResponse.json({ error: 'Failed to send reply' }, { status: 500 })
  }
}
