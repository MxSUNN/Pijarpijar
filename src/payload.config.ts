import path from 'path'
import { buildFigmaConfig } from '@payloadcms/figma'
import { mcpPlugin } from '@payloadcms/plugin-mcp'
import { en as adminLanguage } from '@payloadcms/translations/languages/en'
import { fileURLToPath } from 'url'
import { Admins } from './collections/Admins'
import { Media } from './collections/Media'
import { Folders } from './collections/Folders'
import { Tags } from './collections/Tags'
import { Users } from './collections/Users'
import { MasterData } from './collections/MasterData'
import {
  AcademicYears,
  ActivityReports,
  AuditLogs,
  ClassSchedules,
  Courses,
  CourseSubmissions,
  Documents,
  Lecturers,
  Notifications,
  PartnerAssignments,
  Partners,
  PractitionerAssignments,
  PractitionerEvaluations,
  Practitioners,
  StudyPrograms,
} from './collections/PijarDomain'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildFigmaConfig({
  admin: {
    user: Admins.slug,
    constrainWidth: true,
    dashboard: {
      widgets: [],
      defaultLayout: [
        { widgetSlug: 'activity', width: 'full' },
        { widgetSlug: 'collections', width: 'full' },
      ],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  i18n: {
    fallbackLanguage: 'en',
    supportedLanguages: { en: adminLanguage },
  },
  collections: [
    Admins,
    Media,
    Folders,
    Tags,
    Users,
    MasterData,
    StudyPrograms,
    AcademicYears,
    Lecturers,
    Courses,
    Practitioners,
    Partners,
    CourseSubmissions,
    PractitionerAssignments,
    PartnerAssignments,
    Documents,
    ClassSchedules,
    PractitionerEvaluations,
    ActivityReports,
    Notifications,
    AuditLogs,
  ],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  localization: {
    locales: [{ code: 'en', label: 'English' }],
    fallback: true,
    defaultLocale: 'en',
  },
  plugins: [mcpPlugin({})],
  figma: {},
})
