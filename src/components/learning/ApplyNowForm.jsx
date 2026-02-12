'use client'

import { useMemo, useState } from 'react'
import AnimatedSelect from '@/components/shared/AnimatedSelect'

export default function ApplyNowForm({ section, endpoint, lang = 'en' }) {
  const t = useMemo(() => section || {}, [section])

  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    program: '',
    portfolio: '',
    message: '',
    company: '', // honeypot
  })

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
  }

  const canSubmit = useMemo(() => {
    return (
      form.name.trim() &&
      form.email.trim() &&
      form.phone.trim() &&
      form.program.trim() &&
      form.message.trim() &&
      !loading
    )
  }, [form, loading])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setDone(false)

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.program.trim() ||
      !form.message.trim()
    ) {
      setError(t.messages?.requiredError || 'Please fill in the required fields.')
      return
    }

    try {
      setLoading(true)
      const res = await fetch(endpoint || '/forms/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => null)

      if (!res.ok || !data?.ok) {
        setError(
          data?.error || t.messages?.genericError || 'Something went wrong. Please try again.',
        )
        return
      }

      setDone(true)
      setForm({
        name: '',
        email: '',
        phone: '',
        program: '',
        portfolio: '',
        message: '',
        company: '',
      })
    } catch (err) {
      setError(t.messages?.networkError || 'Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const opts = Array.isArray(t.form?.programOptions) ? t.form.programOptions : []
  const programOptions = opts.map((x) => x?.value).filter(Boolean)

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* honeypot */}
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
          label={t.form?.nameLabel}
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder={t.form?.namePlaceholder}
        />
        <Field
          label={t.form?.emailLabel}
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          placeholder={t.form?.emailPlaceholder}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          label={t.form?.phoneLabel}
          name="phone"
          value={form.phone}
          onChange={onChange}
          placeholder={t.form?.phonePlaceholder}
        />

        <div>
          <AnimatedSelect
            label={t.form?.programLabel}
            placeholder={t.form?.programPlaceholder || 'Select'}
            value={form.program}
            options={programOptions}
            isRTL={lang === 'ar'}
            onChange={(val) => setForm((p) => ({ ...p, program: val }))}
            disabled={loading}
          />
        </div>
      </div>

      <Field
        label={t.form?.portfolioLabel}
        name="portfolio"
        value={form.portfolio}
        onChange={onChange}
        placeholder={t.form?.portfolioPlaceholder}
      />

      <div>
        <label className="block text-[14px] text-black mb-2">{t.form?.messageLabel}</label>
        <textarea
          name="message"
          value={form.message}
          onChange={onChange}
          placeholder={t.form?.messagePlaceholder}
          rows={7}
          className={[
            'w-full rounded-[12px] border border-black/20 bg-white/60',
            'px-4 py-3 text-[14px] text-black/80 placeholder:text-black/35',
            'focus:outline-none focus:ring-2 focus:ring-black/15',
            'resize-none',
          ].join(' ')}
        />
      </div>

      {error ? (
        <p className="text-[13px] text-red-600">{error}</p>
      ) : done ? (
        <p className="text-[13px] text-green-700">{t.messages?.successMessage}</p>
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
        {loading ? t.form?.applyingButton : t.form?.applyButton}
      </button>
    </form>
  )
}

function Field({ label, name, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="block text-[14px] text-black mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={[
          'w-full rounded-[12px] border border-black/20 bg-white/60',
          'px-4 py-3 text-[14px] text-black/80 placeholder:text-black/35',
          'focus:outline-none focus:ring-2 focus:ring-black/15',
        ].join(' ')}
      />
    </div>
  )
}
