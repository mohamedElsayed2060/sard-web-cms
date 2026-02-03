import MainHeader from '@/components/layout/MainHeader'
import MainFooter from '@/components/layout/MainFooter'
import LatestNewsBar from '@/components/layout/LatestNewsBar'
import ContactForm from '@/components/Contact/ContactForm'

import { getSiteHeader, getSiteFooter, getLatestNewsBar, getContactUsPage } from '@/lib/cms'
import marim_bg from '@/assets/marim-bg.png'
import PageContentReveal from '@/components/PageContentReveal'

export const revalidate = 60

const pickLang = (data, lang) => {
  if (!data) return {}
  if (lang === 'ar') return data.ar || data.en || {}
  return data.en || data.ar || {}
}

export default async function ContactUsPage({ params }) {
  const { lang = 'en' } = (await Promise.resolve(params)) || {}

  const [header, footer, latestNews, pageData] = await Promise.all([
    getSiteHeader(),
    getSiteFooter(),
    getLatestNewsBar(),
    getContactUsPage(),
  ])

  const t = pickLang(pageData, lang)

  return (
    <div className={['bg-black  max-w-[1490px] mx-auto'].join(' ')}>
      <MainHeader header={header} bgImage={marim_bg} />
      <LatestNewsBar data={latestNews} bgImage={marim_bg} lang={lang} />

      {/* نفس شكل الصفحة */}
      <div className="pt-5 px-3">
        <PageContentReveal
          variant="slideUp"
          className="rounded-[24px] px-3 py-7 md:px-18 md:py-10"
          bgImage={marim_bg}
        >
          <section className="">
            <h1 className="text-black italic text-[44px] md:text-[56px] leading-none mb-6">
              {t.pageTitle}
            </h1>

            <div className="text-black/80 text-[14px] space-y-2 mb-8">
              <div>
                <span className="font-medium">{t.contactLines?.phoneLabel}</span>{' '}
                {t.contactLines?.phoneValue}
              </div>
              <div>
                <span className="font-medium">{t.contactLines?.emailLabel}</span>{' '}
                {t.contactLines?.emailValue}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Location card */}
              <div className="rounded-[22px] bg-white/50 text-black p-4 border border-black/10">
                <div className="mb-4">
                  <h2 className="italic text-[20px]">{t.locationCard?.title}</h2>
                  <p className="text-[12px] text-black/60 mt-1">{t.locationCard?.subtitle}</p>
                </div>

                <div className="overflow-hidden rounded-[18px] border border-black/10">
                  <iframe
                    src={t.locationCard?.mapEmbedUrl}
                    width="100%"
                    height={t.locationCard?.mapHeight || 420}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    style={{ border: 0 }}
                    allowFullScreen
                  />
                </div>
              </div>

              {/* Form card */}
              <div className="rounded-[22px] bg-white/50 text-black p-4 border border-black/10">
                <h2 className="italic text-[20px] mb-4">{t.formCard?.title}</h2>
                <ContactForm formCard={t.formCard} />
              </div>
            </div>
          </section>
        </PageContentReveal>
      </div>

      <MainFooter footer={footer} bgImage={marim_bg} />
    </div>
  )
}
