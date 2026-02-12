import { getPayload } from 'payload'
import config from '@payload-config'

export const runtime = 'nodejs'

const withTimeout = <T>(p: Promise<T>, ms = 5000): Promise<T> =>
  new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms)
    p.then((v) => {
      clearTimeout(t)
      resolve(v)
    }).catch((e) => {
      clearTimeout(t)
      reject(e)
    })
  })

export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config })

    const body = await req.json().catch(() => ({}))

    const name = String(body?.name || '').trim()
    const email = String(body?.email || '').trim()
    const phone = String(body?.phone || '').trim()
    const program = String(body?.program || '').trim()
    const portfolio = String(body?.portfolio || '').trim()
    const message = String(body?.message || '').trim()
    const company = String(body?.company || '').trim()

    if (company) return Response.json({ ok: true })

    if (!name || !email || !phone || !program || !message) {
      return Response.json({ ok: false, error: 'Missing required fields' }, { status: 400 })
    }

    const created = await payload.create({
      collection: 'apply-submissions',
      data: { name, email, phone, program, portfolio, message, company },
    })

    const canEmail = !!process.env.SMTP_HOST && !!process.env.APPLY_TO_EMAIL
    if (canEmail) {
      const to = process.env.APPLY_TO_EMAIL as string
      const from = process.env.CONTACT_FROM_EMAIL || process.env.APPLY_FROM_EMAIL || to

      const subjectLine = `[Apply Now] ${name} — ${program}`
      const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>New Apply Now submission</h2>
          <p><b>Name:</b> ${escapeHtml(name)}</p>
          <p><b>Email:</b> ${escapeHtml(email)}</p>
          <p><b>Phone:</b> ${escapeHtml(phone)}</p>
          <p><b>Program:</b> ${escapeHtml(program)}</p>
          ${portfolio ? `<p><b>Portfolio:</b> <a href="${escapeAttr(portfolio)}" target="_blank">${escapeHtml(portfolio)}</a></p>` : ''}
          <hr/>
          <p><b>Message:</b></p>
          <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
          <hr/>
          <p style="color:#666;font-size:12px">Saved in CMS: apply-submissions (id: ${created.id})</p>
        </div>
      `

      try {
        await withTimeout(
          payload.sendEmail({
            to,
            from,
            subject: subjectLine,
            html,
            replyTo: email,
          }),
          5000,
        )
      } catch (e) {
        console.error('Apply email failed/timeout. Submission saved:', created?.id, e)
      }
    }

    return Response.json({ ok: true })
  } catch (e) {
    console.error('Apply route error', e)
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}

function escapeHtml(s: string) {
  return String(s || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}
function escapeAttr(s: string) {
  return String(s || '').replaceAll('"', '%22')
}
