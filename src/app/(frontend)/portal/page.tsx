import config from '@payload-config'
import { getPayload } from 'payload'
import { PortalApp, type MasterRecord, type PortalUser } from '@/components/pijar/PortalApp'
import { appAuth } from '@/lib/app-auth'

function relatedName(value: unknown, fallback: string) {
  if (value && typeof value === 'object' && 'name' in value) {
    return String(value.name)
  }
  return fallback
}

function relatedCode(value: unknown, fallback: string) {
  if (value && typeof value === 'object' && 'code' in value) {
    return String(value.code)
  }
  return fallback
}

export default async function PortalPage() {
  const payload = await getPayload({ config })
  const currentUser = await appAuth.currentUser()
  const isSuperAdmin = currentUser?.role === 'super-admin'
  const [result, userResult, masterResult, programResult] = await Promise.all([
    payload.find({
      collection: 'course-submissions',
      depth: 2,
      limit: 100,
      overrideAccess: true,
      sort: '-createdAt',
    }),
    isSuperAdmin
      ? payload.find({
          collection: 'users',
          depth: 1,
          limit: 100,
          overrideAccess: false,
          user: currentUser,
          sort: 'name',
        })
      : Promise.resolve({ docs: [] }),
    isSuperAdmin
      ? payload.find({
          collection: 'master-data',
          limit: 100,
          overrideAccess: false,
          user: currentUser,
          sort: '-createdAt',
        })
      : Promise.resolve({ docs: [] }),
    currentUser
      ? payload.find({
          collection: 'study-programs',
          limit: 100,
          overrideAccess: false,
          user: currentUser,
          sort: 'name',
        })
      : Promise.resolve({ docs: [] }),
  ])

  const approvalLabels = {
    submitted: 'Submitted',
    'under-review': 'Under Review',
    'revision-required': 'Revision Required',
    rejected: 'Rejected',
    approved: 'Approved',
  } as const

  const submissions = result.docs.map((item) => ({
    id: item.submissionNumber,
    type: item.programType,
    program: relatedName(item.studyProgram, 'Program studi'),
    course: relatedName(item.course, 'Mata kuliah'),
    code: relatedCode(item.course, '—'),
    lecturer: relatedName(item.lecturer, 'Dosen pengampu'),
    date: new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(item.createdAt)),
    approval: approvalLabels[item.approvalStatus],
    practitioner: 'Not Assigned',
    partner: 'Not Assigned',
  }))

  const roleLabels = {
    'super-admin': 'Super Admin',
    'admin-pijar': 'Admin PIJAR',
    kaprodi: 'Kaprodi/Sekprodi',
    'admin-suar': 'Admin SUAR',
    'admin-kerma': 'Admin KERMA',
    dosen: 'Dosen Pengampu',
  } as const

  const users: PortalUser[] = userResult.docs.map((user) => ({
    id: String(user.id),
    name: user.name,
    email: user.email,
    username: user.username ?? '',
    role: user.role,
    status: user.status,
    studyProgram:
      user.studyProgram && typeof user.studyProgram === 'object'
        ? { id: String(user.studyProgram.id), name: user.studyProgram.name }
        : null,
  }))
  const masterData: MasterRecord[] = masterResult.docs.map((item) => ({
    id: String(item.id),
    category: item.category,
    name: item.name,
    description: item.description ?? '',
    status: item.status,
  }))

  return (
    <PortalApp
      initialSubmissionsData={submissions}
      initialRole={currentUser ? roleLabels[currentUser.role] : null}
      initialUsers={users}
      initialMasterData={masterData}
      studyPrograms={programResult.docs.map((item) => ({
        id: String(item.id),
        name: item.name,
      }))}
    />
  )
}
