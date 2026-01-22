// src/app/forms/contact/route.ts
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'

// عشان نتأكد إنه Node runtime (payload محتاج Node)
export const runtime = 'nodejs'
const wait = (ms: number) =>
  new Promise((_, rej) => setTimeout(() => rej(new Error('Email timeout')), ms))

export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config: configPromise })
    const body = await req.json()

    const name = String(body?.name || '').trim()
    const email = String(body?.email || '').trim()
    const subject = String(body?.subject || '').trim()
    const message = String(body?.message || '').trim()
    const company = String(body?.company || '').trim() // honeypot

    // spam bot
    if (company) return NextResponse.json({ ok: true })

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 })
    }

    // ✅ Save in Payload
    await payload.create({
      collection: 'contact-submissions',
      data: { name, email, subject, message },
    })

    // ✅ Send Email (اختياري - لو SMTP متظبط)
    if (process.env.SMTP_HOST && process.env.CONTACT_TO_EMAIL) {
      try {
        await Promise.race([
          payload.sendEmail({
            to: process.env.CONTACT_TO_EMAIL!,
            from: process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER!,
            replyTo: email,
            subject: subject ? `[Sard Contact] ${subject}` : '[Sard Contact] New message',
            text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
          }),
          wait(5000),
        ])
      } catch (e) {
        console.error('Email failed/timeout. Submission saved:', e)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    // عشان نطلع سبب المشكلة بدل "Server error" بس
    console.error('Contact route error:', err)
    return NextResponse.json({ ok: false, error: err?.message || 'Server error' }, { status: 500 })
  }
}
