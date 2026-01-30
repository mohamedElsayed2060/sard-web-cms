// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

import Footer from './globals/footer'
import Header from './globals/header'

import Scene from './globals/scene'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

import SceneHotspots from './collections/SceneHotspots'
import MariamAbout from './globals/mariamAbout'
import MariamWorks from './collections/MariamWorks'
import learningAbout from './globals/learningAbout'
import SardLearning from './collections/SardLearning'
// import AboutSardMilestones from './collections/AboutSardMilestones'
import SardMilestonesAbout from './globals/SardMilestonesAbout'
import SardVisionMission from './globals/SardVisionMission'
import AboutSardAwards from './collections/AboutSardAwards'
import TeamMembers from './collections/TeamMembers'
import Galleries from './collections/Galleries'
import SardProductionAbout from './globals/sardProductionHero'
import SardWriterAbout from './globals/sardWriterHero'
import AboutSardGrants from './collections/AboutSardGrants'
import AboutSardPartners from './collections/AboutSardPartners'

import { ContactSubmissions } from './collections/ContactSubmissions'
import LatestNewsBar from './globals/LatestNewsBar'
// import AdminLogo from "./assets/favicon.png"
// import AdminIcon from "./assets/favicon.png"
import ContactUs from './globals/ContactUs'
import SceneProps from './collections/SceneProps'
import News from './collections/News'
export default buildConfig({
  globals: [
    Header,
    Footer,
    LatestNewsBar,
    Scene,
    MariamAbout,
    learningAbout,
    SardMilestonesAbout,
    SardVisionMission,
    SardProductionAbout,
    SardWriterAbout,
    ContactUs,
  ],
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    // components: {
    //   graphics: {
    //     Logo: './assets/favicon.png',
    //     Icon: './assets/favicon.png',
    //   },
    // },
    meta: {
      titleSuffix: '— Sard CMS',
      icons: '/favicon.png',
    },
  },
  collections: [
    Users,
    Media,
    SceneHotspots,
    SceneProps,
    MariamWorks,
    SardLearning,
    // AboutSardMilestones,
    AboutSardAwards,
    AboutSardGrants,
    TeamMembers,
    Galleries,
    ContactSubmissions,
    AboutSardPartners,
    News,
  ],
  email: nodemailerAdapter({
    defaultFromAddress:
      process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER || 'no-reply@sard-eg.com',
    defaultFromName: 'Sard Website',
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      auth: {
        user: process.env.SMTP_USER,
        // ✅ مهم: شيل أي مسافات من app password
        pass: (process.env.SMTP_PASS || '').replace(/\s/g, ''),
      },
      secure: Number(process.env.SMTP_PORT || 587) === 465,

      // ✅ Timeouts تمنع التعليق
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 7000,
    },
  }),

  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
