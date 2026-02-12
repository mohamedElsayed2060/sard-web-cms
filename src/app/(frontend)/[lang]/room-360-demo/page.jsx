// import MainHeader from '@/components/layout/MainHeader'
// import MainFooter from '@/components/layout/MainFooter'
// import PageContentReveal from '@/components/PageContentReveal'
// import TransitionLink from '@/components/transition/TransitionLink'
// import Room360Viewer from '@/components/room360/Room360Viewer'
// import Room360Pannellum from '@/components/room360/Room360Pannellum'
// import { getSiteHeader, getSiteFooter } from '@/lib/cms'
// import marim_bg from '@/assets/marim-bg.png'

// export const revalidate = 60

export default async function Room360DemoPage({ params }) {
  // const { lang = 'en' } = await params

  // const [header, footer] = await Promise.all([getSiteHeader(), getSiteFooter()])

  return (
    <div className="bg-black max-w-[1490px] mx-auto">
      {/* <MainHeader header={header} bgImage={marim_bg} />

      <div className="pt-5 px-3">
        <PageContentReveal
          variant="slideUp"
          className="rounded-[24px] px-3 py-7 md:px-10 md:py-10"
          bgImage={marim_bg}
        >
          <div className="mb-5 flex items-center justify-between gap-3">
            <TransitionLink
              href="/"
              className="text-[12px] text-black/60 underline underline-offset-4"
            >
              {lang === 'ar' ? 'رجوع للرئيسية' : 'Back to Home'}
            </TransitionLink>

            <div className="text-[11px] uppercase tracking-[0.22em] text-black/60">360 Demo</div>
          </div>

          <h1 className="text-black italic text-xl md:text-4xl leading-tight mb-6 text-center">
            {lang === 'ar' ? 'تجربة الغرفة 360 (ديمو)' : 'Room 360 Experience (Demo)'}
          </h1>

          <Room360Viewer src="/demo/test16.png" />
          <Room360Pannellum src="/demo/room-360.jpg" />
        </PageContentReveal>
      </div>

      <MainFooter footer={footer} bgImage={marim_bg} /> */}
    </div>
  )
}
