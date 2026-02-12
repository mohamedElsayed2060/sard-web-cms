import PageContentReveal from '@/components/PageContentReveal'
import ApplyNowForm from '@/components/learning/ApplyNowForm'
import SectionReveal from '../motion/SectionReveal'

const pickLang = (data, lang) => {
  if (!data) return {}
  if (lang === 'ar') return data.ar || data.en || {}
  return data.en || data.ar || {}
}

export default function ApplyNowSection({ data, lang = 'en', bgImage }) {
  if (!data?.enabled) return null

  const t = pickLang(data, lang)
  const sectionId = data?.sectionId || 'apply-now'

  return (
    <SectionReveal once={true} duration={0.8}>
      <section id={sectionId} className="mt-5 px-3">
        <div className="max-w-[1490px] mx-auto">
          <PageContentReveal
            variant="slideUp"
            paperColor="#F4E8D7"
            className="rounded-[24px] px-3 py-7 md:py-18 md:px-18"
            bgImage={bgImage}
          >
            {/* Title block (black + top/bottom lines) */}
            <div className="">
              <div className="mx-auto h-[1px] w-full bg-black/35" />
              <h2 className="mt-4 text-black text-center italic text-2xl md:text-4xl font-semibold leading-none">
                {t.title}
              </h2>
              <div className="mx-auto mt-4 h-[1px] w-full bg-black/35" />

              {t.description ? (
                <p className="mt-5 text-black/70 text-[14px] md:text-[16px] font-semibold text-center leading-relaxed">
                  {t.description}
                </p>
              ) : null}
            </div>

            {/* Form card */}
            <div className="mt-7 md:mt-10">
              <div className="rounded-[22px] bg-white/50 border border-black/10 p-4 md:p-6">
                <ApplyNowForm lang={lang} endpoint={data.endpoint} section={t} />
              </div>
            </div>
          </PageContentReveal>
        </div>
      </section>
    </SectionReveal>
  )
}
