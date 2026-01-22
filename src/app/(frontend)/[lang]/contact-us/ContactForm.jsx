'use client'

import { useMemo, useState } from 'react'

export default function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    company: '', // honeypot
  })

  const canSubmit = useMemo(() => {
    return form.name.trim() && form.email.trim() && form.message.trim() && !loading
  }, [form, loading])

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setDone(false)

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please fill in the required fields.')
      return
    }

    try {
      setLoading(true)
      const res = await fetch('/forms/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok || !data?.ok) {
        setError(data?.error || 'Something went wrong. Please try again.')
        return
      }

      setDone(true)
      setForm({
        name: '',
        email: '',
        subject: '',
        message: '',
        company: '',
      })
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* honeypot (hidden) */}
      <input
        type="text"
        name="company"
        value={form.company}
        onChange={onChange}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          label="Your name *"
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder="Your name"
        />
        <Field
          label="Your email *"
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          placeholder="Your email"
        />
      </div>

      <Field
        label="Subject"
        name="subject"
        value={form.subject}
        onChange={onChange}
        placeholder="Subject"
      />

      <div>
        <label className="block text-[12px] text-black/70 mb-2">Message *</label>
        <textarea
          name="message"
          value={form.message}
          onChange={onChange}
          placeholder="Message"
          rows={7}
          className={[
            'w-full rounded-[14px] border border-black/10 bg-white/60',
            'px-4 py-3 text-[14px] text-black/80 placeholder:text-black/35',
            'focus:outline-none focus:ring-2 focus:ring-black/15',
            'resize-none',
          ].join(' ')}
        />
      </div>

      {error ? (
        <p className="text-[13px] text-red-600">{error}</p>
      ) : done ? (
        <p className="text-[13px] text-green-700">Message sent successfully.</p>
      ) : null}

      <button
        type="submit"
        disabled={!canSubmit}
        className={[
          'mt-2 w-full md:w-auto',
          'px-6 py-3 rounded-[14px]',
          'bg-black text-[#F4E8D7]',
          'text-[12px] uppercase tracking-[0.22em]',
          'transition',
          loading || !canSubmit ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-95',
        ].join(' ')}
      >
        {loading ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}

function Field({ label, name, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="block text-[12px] text-black/70 mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={[
          'w-full rounded-[14px] border border-black/10 bg-white/60',
          'px-4 py-3 text-[14px] text-black/80 placeholder:text-black/35',
          'focus:outline-none focus:ring-2 focus:ring-black/15',
        ].join(' ')}
      />
    </div>
  )
}
