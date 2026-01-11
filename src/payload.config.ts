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

import SceneHotspots from './collections/SceneHotspots'
import MariamAbout from './globals/mariamAbout'
import MariamWorks from './collections/MariamWorks'
import learningAbout from './globals/learningAbout'
import SardLearning from './collections/SardLearning'
import AboutSardMilestones from './collections/AboutSardMilestones'
import SardMilestonesAbout from './globals/SardMilestonesAbout'
import SardVisionMission from './globals/SardVisionMission'
import AboutSardAwards from './collections/AboutSardAwards'
import TeamMembers from './collections/TeamMembers'
import Galleries from './collections/Galleries'
import SardProductionAbout from './globals/sardProductionHero'
import SardWriterAbout from './globals/sardWriterHero'

export default buildConfig({
  globals: [
    Header,
    Footer,
    Scene,
    MariamAbout,
    learningAbout,
    SardMilestonesAbout,
    SardVisionMission,
    SardProductionAbout,
    SardWriterAbout,
  ],
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    SceneHotspots,
    MariamWorks,
    SardLearning,
    AboutSardMilestones,
    AboutSardAwards,
    TeamMembers,
    Galleries,
  ],
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
