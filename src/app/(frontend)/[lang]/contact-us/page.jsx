// src/app/(frontend)/contact-us/page.jsx
import MainHeader from '@/components/layout/MainHeader'
import MainFooter from '@/components/layout/MainFooter'
import PageContentReveal from '@/components/PageContentReveal'
import mar_bg from '@/assets/marim-bg.png'

export async function generateMetadata({ params }) {
  const { lang } = await params
  const path = `/${lang}/contact-us`

  return {
    title: 'Contact Us',
    description: 'Get in touch with Sard.',
    alternates: {
      canonical: path,
      languages: {
        en: `/en/contact-us`,
        ar: `/ar/contact-us`,
      },
    },
  }
}

export const revalidate = 60

import ContactForm from './ContactForm'
import { getSiteFooter, getSiteHeader } from '@/lib/cms'

export default async function AboutSardPage() {
  const [header, footer] = await Promise.all([getSiteHeader(), getSiteFooter()])
  return (
    <>
      <main className="min-h-[100dvh] bg-black text-white">
        <MainHeader header={header} bgImage={mar_bg} />

        <section className="pt-6 px-3 max-w-[1490px] mx-auto relative z-10">
          <PageContentReveal
            bgImage={mar_bg}
            paperColor=""
            className="rounded-[24px] px-4 py-6 md:px-14 md:py-10"
          >
            {/* Title */}
            <div className="mb-8 md:mb-10">
              {/* <p className="text-[11px] uppercase tracking-[0.25em] text-black/55">Contact</p> */}
              <h1 className="mt-2 text-[36px] md:text-[54px] italic text-black">
                How to Contact us
              </h1>

              <div className="mt-4 flex flex-col gap-2 text-black/70">
                <div className="text-[15px] md:text-[16px]">
                  <span className="font-medium text-black/80">Phone: </span>
                  <a className="hover:text-black" href="tel:+20233351757">
                    +202 333 51 757
                  </a>
                </div>
                <div className="text-[15px] md:text-[16px]">
                  <span className="font-medium text-black/80">Email: </span>
                  <a className="hover:text-black" href="mailto:mailbox@sard-eg.com">
                    mailbox@sard-eg.com
                  </a>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-2">
              {/* Map */}
              <div className="rounded-[22px] border border-black/10 overflow-hidden bg-white/40">
                <div className="px-6 md:px-8 py-5 border-b border-black/10">
                  <h2 className="text-[18px] md:text-[20px] italic text-black/90">Location</h2>
                  <p className="mt-1 text-[13px] text-black/60">
                    Al Dokki, Giza Governorate, Egypt
                  </p>
                </div>

                {/* Replace the src with your preferred Google Maps embed */}
                <div className="h-[360px] md:h-[460px] bg-black/5">
                  <iframe
                    title="Sard location map"
                    className="w-full h-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps?q=Dokki%2C%20Giza%20Governorate%2C%20Egypt&output=embed"
                  />
                </div>
              </div>

              {/* Form */}
              <div className="rounded-[22px] border border-black/10 bg-white/40 overflow-hidden">
                <div className="px-6 md:px-8 py-5 border-b border-black/10 flex items-center justify-between">
                  <h2 className="text-[18px] md:text-[20px] italic text-black/90">Get in Touch!</h2>
                </div>

                <div className="p-6 md:p-8">
                  <ContactForm />
                </div>
              </div>
            </div>
          </PageContentReveal>
        </section>
        <MainFooter footer={footer} bgImage={mar_bg} />
      </main>
    </>
  )
}
