import type { Access, CollectionConfig, Field } from 'payload'

const signedIn: Access = ({ req }) => req.user?.collection === 'users'
const staff: Access = ({ req }) =>
  req.user?.collection === 'users' &&
  ['super-admin', 'admin-pijar', 'admin-suar', 'admin-kerma'].includes(String(req.user.role))
const manager: Access = ({ req }) =>
  req.user?.collection === 'users' && ['super-admin', 'admin-pijar'].includes(String(req.user.role))
const publicPublished: Access = ({ req }) =>
  req.user?.collection === 'users' ? true : { isPublished: { equals: true } }

const title = (field: string, group: string, columns?: string[]) => ({
  group,
  useAsTitle: field,
  defaultColumns: columns,
})

export const StudyPrograms: CollectionConfig = {
  slug: 'study-programs',
  admin: title('name', 'Data Master', ['code', 'name']),
  access: { read: signedIn, create: manager, update: manager, delete: manager },
  fields: [
    { name: 'code', type: 'text', required: true, unique: true, index: true },
    { name: 'name', type: 'text', required: true, unique: true },
  ],
}

export const AcademicYears: CollectionConfig = {
  slug: 'academic-years',
  admin: title('name', 'Data Master', ['name', 'semester', 'isActive']),
  access: { read: signedIn, create: manager, update: manager, delete: manager },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'semester',
      type: 'select',
      required: true,
      options: ['Ganjil', 'Genap', 'Pendek'],
    },
    { name: 'isActive', type: 'checkbox', defaultValue: false },
  ],
}

export const Lecturers: CollectionConfig = {
  slug: 'lecturers',
  admin: title('name', 'Data Master', ['name', 'employeeId', 'studyProgram']),
  access: { read: signedIn, create: manager, update: manager, delete: manager },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'employeeId', type: 'text', required: true, unique: true },
    { name: 'email', type: 'email', required: true },
    { name: 'studyProgram', type: 'relationship', relationTo: 'study-programs', required: true },
    { name: 'user', type: 'relationship', relationTo: 'users' },
  ],
}

export const Courses: CollectionConfig = {
  slug: 'courses',
  admin: title('name', 'Data Master', ['code', 'name', 'studyProgram', 'credits']),
  access: { read: signedIn, create: manager, update: manager, delete: manager },
  fields: [
    { name: 'code', type: 'text', required: true, unique: true, index: true },
    { name: 'name', type: 'text', required: true },
    { name: 'studyProgram', type: 'relationship', relationTo: 'study-programs', required: true },
    { name: 'credits', type: 'number', required: true, min: 1, max: 8 },
  ],
}

export const Practitioners: CollectionConfig = {
  slug: 'practitioners',
  admin: title('name', 'Penugasan', ['name', 'institution', 'position', 'expertise']),
  access: { read: staff, create: staff, update: staff, delete: manager },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'institution', type: 'text', required: true },
    { name: 'position', type: 'text', required: true },
    { name: 'expertise', type: 'textarea', required: true },
    { name: 'email', type: 'email', required: true, unique: true },
    { name: 'phone', type: 'text' },
    { name: 'notes', type: 'textarea' },
  ],
}

export const Partners: CollectionConfig = {
  slug: 'partners',
  admin: title('name', 'Penugasan', ['name', 'industry', 'contactName']),
  access: { read: staff, create: staff, update: staff, delete: manager },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'industry', type: 'text', required: true },
    { name: 'address', type: 'textarea', required: true },
    { name: 'contactName', type: 'text', required: true },
    { name: 'contactInfo', type: 'text', required: true },
    { name: 'notes', type: 'textarea' },
  ],
}

const submissionStatus: Field = {
  name: 'approvalStatus',
  type: 'select',
  required: true,
  defaultValue: 'submitted',
  index: true,
  options: [
    { label: 'Submitted', value: 'submitted' },
    { label: 'Under Review', value: 'under-review' },
    { label: 'Revision Required', value: 'revision-required' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Approved', value: 'approved' },
  ],
  access: {
    create: () => false,
    update: ({ req }) =>
      req.user?.collection === 'users' &&
      ['super-admin', 'admin-pijar'].includes(String(req.user.role)),
  },
}

export const CourseSubmissions: CollectionConfig = {
  slug: 'course-submissions',
  admin: title('submissionNumber', 'Pengajuan', [
    'submissionNumber',
    'programType',
    'course',
    'studyProgram',
    'approvalStatus',
  ]),
  access: { read: signedIn, create: signedIn, update: signedIn, delete: manager },
  versions: true,
  fields: [
    { name: 'submissionNumber', type: 'text', required: true, unique: true, index: true },
    {
      name: 'programType',
      type: 'select',
      required: true,
      options: ['PIJAR', 'SUAR'],
    },
    { name: 'studyProgram', type: 'relationship', relationTo: 'study-programs', required: true },
    { name: 'course', type: 'relationship', relationTo: 'courses', required: true },
    { name: 'academicYear', type: 'relationship', relationTo: 'academic-years', required: true },
    { name: 'semester', type: 'text', required: true },
    { name: 'lecturer', type: 'relationship', relationTo: 'lecturers', required: true },
    { name: 'plannedMeetings', type: 'number', required: true, min: 1 },
    { name: 'topics', type: 'textarea', required: true },
    { name: 'requiredCompetencies', type: 'textarea', required: true },
    { name: 'practitionerQualifications', type: 'textarea', required: true },
    { name: 'partnerNeeds', type: 'textarea' },
    { name: 'estimatedSchedule', type: 'text', required: true },
    { name: 'additionalNotes', type: 'textarea' },
    { name: 'submittedBy', type: 'relationship', relationTo: 'users', required: true },
    submissionStatus,
    {
      name: 'decisionNote',
      type: 'textarea',
      access: {
        create: () => false,
        update: ({ req }) =>
          req.user?.collection === 'users' &&
          ['super-admin', 'admin-pijar'].includes(String(req.user.role)),
      },
    },
  ],
}

export const PractitionerAssignments: CollectionConfig = {
  slug: 'practitioner-assignments',
  admin: title('assignmentNumber', 'Penugasan', [
    'assignmentNumber',
    'submission',
    'practitioner',
    'assignedAt',
  ]),
  access: { read: signedIn, create: staff, update: staff, delete: manager },
  fields: [
    { name: 'assignmentNumber', type: 'text', required: true, unique: true },
    { name: 'submission', type: 'relationship', relationTo: 'course-submissions', required: true },
    { name: 'practitioner', type: 'relationship', relationTo: 'practitioners', required: true },
    { name: 'assignedBy', type: 'relationship', relationTo: 'users', required: true },
    { name: 'assignedAt', type: 'date', required: true },
    { name: 'notes', type: 'textarea' },
  ],
}

export const PartnerAssignments: CollectionConfig = {
  slug: 'partner-assignments',
  admin: title('assignmentNumber', 'Penugasan', [
    'assignmentNumber',
    'submission',
    'partner',
    'assignedAt',
  ]),
  access: { read: signedIn, create: staff, update: staff, delete: manager },
  fields: [
    { name: 'assignmentNumber', type: 'text', required: true, unique: true },
    { name: 'submission', type: 'relationship', relationTo: 'course-submissions', required: true },
    { name: 'partner', type: 'relationship', relationTo: 'partners', required: true },
    { name: 'assignedBy', type: 'relationship', relationTo: 'users', required: true },
    { name: 'assignedAt', type: 'date', required: true },
    { name: 'notes', type: 'textarea' },
  ],
}

export const Documents: CollectionConfig = {
  slug: 'academic-practitioner-documents',
  admin: title('name', 'Pelaksanaan', ['name', 'submission', 'uploadedBy', 'recordedAt']),
  access: { read: signedIn, create: signedIn, update: signedIn, delete: manager },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'submission', type: 'relationship', relationTo: 'course-submissions', required: true },
    {
      name: 'driveUrl',
      type: 'text',
      required: true,
      validate: (value: unknown) =>
        typeof value === 'string' && /^https:\/\/(drive|docs)\.google\.com\//.test(value)
          ? true
          : 'Gunakan tautan Google Drive atau Google Docs yang valid.',
    },
    { name: 'uploadedBy', type: 'relationship', relationTo: 'users', required: true },
    { name: 'recordedAt', type: 'date', required: true },
    { name: 'notes', type: 'textarea' },
  ],
}

export const ClassSchedules: CollectionConfig = {
  slug: 'class-schedules',
  admin: title('scheduleNumber', 'Pelaksanaan', [
    'scheduleNumber',
    'submission',
    'startAt',
    'activityStatus',
    'isPublished',
  ]),
  access: { read: publicPublished, create: manager, update: manager, delete: manager },
  fields: [
    { name: 'scheduleNumber', type: 'text', required: true, unique: true },
    { name: 'submission', type: 'relationship', relationTo: 'course-submissions', required: true },
    {
      name: 'practitionerAssignment',
      type: 'relationship',
      relationTo: 'practitioner-assignments',
    },
    { name: 'partnerAssignment', type: 'relationship', relationTo: 'partner-assignments' },
    { name: 'startAt', type: 'date', required: true },
    { name: 'endAt', type: 'date', required: true },
    { name: 'location', type: 'text', required: true },
    { name: 'topic', type: 'textarea', required: true },
    {
      name: 'activityStatus',
      type: 'select',
      required: true,
      defaultValue: 'preparation',
      options: [
        { label: 'Preparation', value: 'preparation' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Completed', value: 'completed' },
      ],
    },
    { name: 'isPublished', type: 'checkbox', defaultValue: false, index: true },
  ],
}

export const PractitionerEvaluations: CollectionConfig = {
  slug: 'practitioner-evaluations',
  admin: title('evaluationNumber', 'Pelaksanaan', [
    'evaluationNumber',
    'schedule',
    'practitioner',
    'overallRating',
  ]),
  access: { read: signedIn, create: signedIn, update: signedIn, delete: manager },
  fields: [
    { name: 'evaluationNumber', type: 'text', required: true, unique: true },
    { name: 'submission', type: 'relationship', relationTo: 'course-submissions', required: true },
    { name: 'schedule', type: 'relationship', relationTo: 'class-schedules', required: true },
    { name: 'practitioner', type: 'relationship', relationTo: 'practitioners', required: true },
    { name: 'lecturer', type: 'relationship', relationTo: 'lecturers', required: true },
    { name: 'materialRelevance', type: 'number', required: true, min: 1, max: 5 },
    { name: 'subjectMastery', type: 'number', required: true, min: 1, max: 5 },
    { name: 'communication', type: 'number', required: true, min: 1, max: 5 },
    { name: 'delivery', type: 'number', required: true, min: 1, max: 5 },
    { name: 'experienceFit', type: 'number', required: true, min: 1, max: 5 },
    { name: 'overallRating', type: 'number', required: true, min: 1, max: 5 },
    { name: 'comments', type: 'textarea', required: true },
  ],
}

export const ActivityReports: CollectionConfig = {
  slug: 'activity-reports',
  admin: title('reportNumber', 'Pelaksanaan', ['reportNumber', 'submission', 'status']),
  access: { read: signedIn, create: manager, update: manager, delete: manager },
  fields: [
    { name: 'reportNumber', type: 'text', required: true, unique: true },
    { name: 'submission', type: 'relationship', relationTo: 'course-submissions', required: true },
    { name: 'rpsComplete', type: 'checkbox', defaultValue: false },
    { name: 'documentationComplete', type: 'checkbox', defaultValue: false },
    { name: 'evaluationComplete', type: 'checkbox', defaultValue: false },
    {
      name: 'status',
      type: 'select',
      options: ['incomplete', 'complete'],
      defaultValue: 'incomplete',
      required: true,
    },
    { name: 'notes', type: 'textarea' },
  ],
}

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: title('title', 'Sistem', ['title', 'recipient', 'isRead', 'createdAt']),
  access: { read: signedIn, create: manager, update: signedIn, delete: manager },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'message', type: 'textarea', required: true },
    { name: 'recipient', type: 'relationship', relationTo: 'users', required: true },
    { name: 'isRead', type: 'checkbox', defaultValue: false },
    { name: 'link', type: 'text' },
  ],
}

export const AuditLogs: CollectionConfig = {
  slug: 'audit-logs',
  admin: title('action', 'Sistem', ['actor', 'action', 'entity', 'createdAt']),
  access: { read: manager, create: signedIn, update: () => false, delete: () => false },
  fields: [
    { name: 'actor', type: 'relationship', relationTo: 'users', required: true },
    { name: 'action', type: 'text', required: true },
    { name: 'entity', type: 'text', required: true },
    { name: 'entityId', type: 'text', required: true },
    { name: 'before', type: 'json' },
    { name: 'after', type: 'json' },
  ],
}
