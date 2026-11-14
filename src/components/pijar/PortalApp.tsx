'use client'

import { FormEvent, ReactNode, useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  createMasterDataAction,
  createUserAction,
  loginAction,
  logoutAction,
  updateUserAction,
} from '@/app/(frontend)/portal/actions'

type Role =
  | 'Super Admin'
  | 'Admin PIJAR'
  | 'Kaprodi/Sekprodi'
  | 'Admin SUAR'
  | 'Admin KERMA'
  | 'Dosen Pengampu'
export type Approval = 'Submitted' | 'Under Review' | 'Revision Required' | 'Rejected' | 'Approved'
export type Submission = {
  id: string
  type: 'PIJAR' | 'SUAR'
  program: string
  course: string
  code: string
  lecturer: string
  date: string
  approval: Approval
  practitioner: string
  partner: string
}
export type PortalUser = {
  id: string
  name: string
  email: string
  username: string
  role: string
  status: string
  studyProgram: { id: string; name: string } | null
}
export type MasterRecord = {
  id: string
  category: string
  name: string
  description: string
  status: string
}
type StudyProgramOption = { id: string; name: string }

const roles: Record<
  Role,
  { initials: string; name: string; email: string; password: string; menus: string[] }
> = {
  'Super Admin': {
    initials: 'SA',
    name: 'Raka Adiputra',
    email: 'superadmin@pijar.demo',
    password: 'Demo123!',
    menus: [
      'Dashboard',
      'Monitoring Pengajuan',
      'Penugasan',
      'Dokumen Akademik dan Praktisi',
      'Jadwal',
      'Evaluasi',
      'Rekapitulasi',
      'Data Master',
      'Pengguna & Role',
      'Audit Log',
    ],
  },
  'Admin PIJAR': {
    initials: 'AP',
    name: 'Aulia Prameswari',
    email: 'admin@pijar.demo',
    password: 'Demo123!',
    menus: [
      'Dashboard',
      'Monitoring Pengajuan',
      'Dokumen Akademik dan Praktisi',
      'Jadwal',
      'Rekapitulasi',
    ],
  },
  'Kaprodi/Sekprodi': {
    initials: 'RK',
    name: 'Dr. Rina Kusuma',
    email: 'kaprodi@pijar.demo',
    password: 'Demo123!',
    menus: [
      'Dashboard',
      'Pengajuan Saya',
      'Buat Pengajuan',
      'Dokumen Akademik dan Praktisi',
      'Jadwal',
    ],
  },
  'Admin SUAR': {
    initials: 'AS',
    name: 'Satria Mahesa',
    email: 'suar@pijar.demo',
    password: 'Demo123!',
    menus: ['Dashboard', 'Pengajuan SUAR', 'Penugasan Praktisi', 'Database Praktisi'],
  },
  'Admin KERMA': {
    initials: 'AK',
    name: 'Nadia Mahendra',
    email: 'kerma@pijar.demo',
    password: 'Demo123!',
    menus: ['Dashboard', 'Pengajuan Disetujui', 'Penugasan Mitra', 'Database Mitra'],
  },
  'Dosen Pengampu': {
    initials: 'DW',
    name: 'Dimas Wiratama, M.T.',
    email: 'dosen@pijar.demo',
    password: 'Demo123!',
    menus: ['Dashboard', 'Jadwal', 'Evaluasi', 'Riwayat Evaluasi'],
  },
}

const programs = [
  'Civil Engineering',
  'Business Information System',
  'Informatics',
  'DKV',
  'Architecture',
  'Culinary Arts',
  'Hospitality and Tourism',
  'Manajemen',
  'Urban Planning',
  'Desain Interior',
  'Akuntansi',
]
const initialSubmissions: Submission[] = [
  {
    id: 'PS-2025-048',
    type: 'SUAR',
    program: 'Business Information System',
    course: 'Analisis dan Perancangan Sistem Informasi',
    code: 'BIS304',
    lecturer: 'Dr. Rina Kusuma',
    date: '14 Mei 2025',
    approval: 'Approved',
    practitioner: 'Assigned',
    partner: 'Assigned',
  },
  {
    id: 'PS-2025-047',
    type: 'PIJAR',
    program: 'Manajemen',
    course: 'Manajemen Proyek',
    code: 'MGT221',
    lecturer: 'Dimas Wiratama, M.T.',
    date: '13 Mei 2025',
    approval: 'Under Review',
    practitioner: 'Not Assigned',
    partner: 'Not Assigned',
  },
  {
    id: 'PS-2025-046',
    type: 'SUAR',
    program: 'DKV',
    course: 'UI/UX Design',
    code: 'DKV312',
    lecturer: 'Arini Putri, M.Ds.',
    date: '11 Mei 2025',
    approval: 'Revision Required',
    practitioner: 'Not Assigned',
    partner: 'Not Assigned',
  },
  {
    id: 'PS-2025-045',
    type: 'PIJAR',
    program: 'Architecture',
    course: 'Arsitektur Berkelanjutan',
    code: 'ARC401',
    lecturer: 'Fajar Nugraha, M.Ars.',
    date: '8 Mei 2025',
    approval: 'Approved',
    practitioner: 'Assigned',
    partner: 'Not Assigned',
  },
  {
    id: 'PS-2025-044',
    type: 'SUAR',
    program: 'Informatics',
    course: 'Cloud Computing',
    code: 'INF411',
    lecturer: 'Nadia Pratiwi, M.Kom.',
    date: '6 Mei 2025',
    approval: 'Rejected',
    practitioner: 'Not Assigned',
    partner: 'Not Assigned',
  },
]
const practitioners = [
  {
    name: 'Bima Santoso',
    institution: 'Nusantara Tech',
    role: 'Head of Data',
    expertise: 'Data Analytics & Business Intelligence',
    contact: 'bima@example.test',
  },
  {
    name: 'Sarah Wijaya',
    institution: 'Telkom Indonesia',
    role: 'Senior Product Manager',
    expertise: 'Product Strategy & Agile',
    contact: 'sarah@example.test',
  },
  {
    name: 'Nadia Rahman',
    institution: 'EcoBuild Indonesia',
    role: 'Principal Architect',
    expertise: 'Green Building',
    contact: 'nadia@example.test',
  },
]
const partners = [
  {
    name: 'Nusantara Tech',
    industry: 'Teknologi Informasi',
    contact: 'Ari Wibowo',
    info: 'partnership@example.test',
  },
  {
    name: 'EcoBuild Indonesia',
    industry: 'Konstruksi Hijau',
    contact: 'Rani Pradipta',
    info: 'kerja.sama@example.test',
  },
  {
    name: 'Kreavi Studio',
    industry: 'Industri Kreatif',
    contact: 'Dewi Paramita',
    info: 'hello@example.test',
  },
]
const initialDocs = [
  {
    name: 'RPS Mini APSI',
    submission: 'PS-2025-048',
    uploader: 'Dr. Rina Kusuma',
    date: '16 Mei 2025',
    url: 'https://drive.google.com/file/d/demo-rps/view',
    note: 'Capaian dan topik empat pertemuan.',
  },
  {
    name: 'Dokumentasi Pengajaran',
    submission: 'PS-2025-045',
    uploader: 'Fajar Nugraha',
    date: '13 Mei 2025',
    url: 'https://drive.google.com/drive/folders/demo-dokumentasi',
    note: 'Foto dan materi kegiatan.',
  },
]
const scheduleData = [
  {
    date: '18 Jun 2025',
    time: '09.00–11.30',
    course: 'Analisis dan Perancangan Sistem Informasi',
    program: 'Business Information System',
    type: 'SUAR',
    practitioner: 'Bima Santoso',
    partner: 'Nusantara Tech',
    location: 'Lab Komputer 3',
    status: 'Preparation',
  },
  {
    date: '20 Jun 2025',
    time: '13.00–15.00',
    course: 'Manajemen Proyek',
    program: 'Manajemen',
    type: 'PIJAR',
    practitioner: 'Sarah Wijaya',
    partner: '—',
    location: 'Zoom Meeting',
    status: 'In Progress',
  },
  {
    date: '24 Jun 2025',
    time: '10.00–12.00',
    course: 'Arsitektur Berkelanjutan',
    program: 'Architecture',
    type: 'PIJAR',
    practitioner: 'Nadia Rahman',
    partner: 'EcoBuild Indonesia',
    location: 'Ruang A-402',
    status: 'Completed',
  },
]

function Icon({ name }: { name: string }) {
  const paths: Record<string, ReactNode> = {
    Dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </>
    ),
    Pengajuan: (
      <>
        <path d="M6 3h9l3 3v15H6z" />
        <path d="M14 3v4h4M9 12h6M9 16h6" />
      </>
    ),
    Jadwal: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M8 3v4M16 3v4M3 10h18" />
      </>
    ),
    Dokumen: (
      <>
        <path d="M5 3h10l4 4v14H5z" />
        <path d="M14 3v5h5M9 13h6M9 17h4" />
      </>
    ),
    default: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12h8M12 8v8" />
      </>
    ),
  }
  const key = Object.keys(paths).find((x) => name.includes(x)) || 'default'
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[key]}
    </svg>
  )
}

function Badge({ children }: { children: ReactNode }) {
  const value = String(children)
  const tone = /Approved|Assigned|Completed|Lengkap|Terkirim/.test(value)
    ? 'approved'
    : /Rejected|Revision|Belum/.test(value)
      ? 'danger'
      : /Review|Progress|Preparation|Submitted/.test(value)
        ? 'warning'
        : 'neutral'
  return <span className={`status-badge status-${tone}`}>{children}</span>
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: ReactNode
}) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className="app-modal" onMouseDown={(e) => e.stopPropagation()}>
        <header>
          <div>
            <span>PIJAR–SUAR</span>
            <h2>{title}</h2>
          </div>
          <button onClick={onClose} aria-label="Tutup">
            ×
          </button>
        </header>
        {children}
      </section>
    </div>
  )
}

export function PortalApp({
  initialSubmissionsData,
  initialRole,
  initialUsers,
  initialMasterData,
  studyPrograms,
}: {
  initialSubmissionsData: Submission[]
  initialRole: Role | null
  initialUsers: PortalUser[]
  initialMasterData: MasterRecord[]
  studyPrograms: StudyProgramOption[]
}) {
  const router = useRouter()
  const [role, setRole] = useState<Role | null>(initialRole)
  const [page, setPage] = useState('Dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const [submissions, setSubmissions] = useState(
    initialSubmissionsData.length ? initialSubmissionsData : initialSubmissions,
  )
  const [documents, setDocuments] = useState(initialDocs)
  const [modal, setModal] = useState<{ type: string; data?: Submission } | null>(null)
  const [toast, setToast] = useState('')
  const [evaluated, setEvaluated] = useState(false)
  const [users, setUsers] = useState(initialUsers)
  const [masterData, setMasterData] = useState(initialMasterData)
  const [isLoggingOut, startLogout] = useTransition()

  useEffect(() => {
    setRole(initialRole)
    setUsers(initialUsers)
    setMasterData(initialMasterData)
  }, [initialRole, initialUsers, initialMasterData])

  const flash = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2500)
  }
  const navigate = (target: string) => {
    setPage(target)
    setMenuOpen(false)
  }

  if (!role)
    return (
      <Login
        onLogin={(next) => {
          setRole(next)
          setPage('Dashboard')
          router.refresh()
        }}
      />
    )
  const current = roles[role]
  const content = (() => {
    if (page === 'Dashboard')
      return <Dashboard role={role} submissions={submissions} onNavigate={navigate} />
    if (/Pengajuan|Monitoring/.test(page) && page !== 'Buat Pengajuan')
      return (
        <SubmissionsPage
          role={role}
          title={page}
          items={submissions}
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
          open={(data) => setModal({ type: 'detail', data })}
        />
      )
    if (page === 'Buat Pengajuan')
      return (
        <SubmissionForm
          onSubmit={(item) => {
            setSubmissions([item, ...submissions])
            flash('Pengajuan berhasil dikirim dan masuk ke database.')
            navigate('Pengajuan Saya')
          }}
        />
      )
    if (/Dokumen/.test(page))
      return <DocumentsPage documents={documents} onAdd={() => setModal({ type: 'document' })} />
    if (page === 'Jadwal') return <SchedulePage />
    if (/Evaluasi/.test(page))
      return (
        <EvaluationPage
          history={page === 'Riwayat Evaluasi'}
          evaluated={evaluated}
          onSubmit={() => {
            setEvaluated(true)
            flash('Evaluasi berhasil dikirim.')
            navigate('Riwayat Evaluasi')
          }}
        />
      )
    if (/Penugasan|Database Praktisi/.test(page))
      return (
        <AssignmentPage
          kind="practitioner"
          submissions={submissions}
          onAssign={(id) => {
            setSubmissions(
              submissions.map((x) => (x.id === id ? { ...x, practitioner: 'Assigned' } : x)),
            )
            flash('Praktisi berhasil ditugaskan.')
          }}
        />
      )
    if (/Mitra|Database Mitra/.test(page))
      return (
        <AssignmentPage
          kind="partner"
          submissions={submissions}
          onAssign={(id) => {
            setSubmissions(
              submissions.map((x) => (x.id === id ? { ...x, partner: 'Assigned' } : x)),
            )
            flash('Mitra berhasil ditugaskan.')
          }}
        />
      )
    if (page === 'Rekapitulasi') return <RecapPage />
    if (page === 'Audit Log') return <AuditPage />
    if (page === 'Data Master' || page === 'Pengguna & Role')
      return (
        <MasterPage
          type={page}
          flash={flash}
          masterData={masterData}
          setMasterData={setMasterData}
          users={users}
          setUsers={setUsers}
          studyPrograms={studyPrograms}
        />
      )
    return <Dashboard role={role} submissions={submissions} onNavigate={navigate} />
  })()

  const decide = (status: Approval) => {
    if (!modal?.data) return
    const id = modal.data.id
    setSubmissions(submissions.map((x) => (x.id === id ? { ...x, approval: status } : x)))
    setModal(null)
    flash(`Status ${id} diperbarui menjadi ${status}.`)
  }

  return (
    <div className="portal-shell">
      <aside className={menuOpen ? 'portal-sidebar open' : 'portal-sidebar'}>
        <div className="portal-brand">
          <span className="brand-symbol small">
            <i />
            <i />
            <i />
          </span>
          <div>
            <strong>PIJAR–SUAR</strong>
            <small>Praktisi Mengajar</small>
          </div>
          <button onClick={() => setMenuOpen(false)}>×</button>
        </div>
        <div className="role-card">
          <span>{current.initials}</span>
          <div>
            <small>Masuk sebagai</small>
            <strong>{role}</strong>
          </div>
        </div>
        <nav>
          <p>MENU UTAMA</p>
          {current.menus.map((item) => (
            <button
              key={item}
              className={page === item ? 'active' : ''}
              onClick={() => navigate(item)}
            >
              <Icon name={item} />
              <span>{item}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <Link href="/">Halaman publik</Link>
          <button
            disabled={isLoggingOut}
            onClick={() =>
              startLogout(async () => {
                await logoutAction()
                setRole(null)
                setPage('Dashboard')
                router.refresh()
              })
            }
          >
            {isLoggingOut ? 'Keluar...' : 'Keluar'}
          </button>
        </div>
      </aside>
      <div className="portal-main">
        <header className="portal-topbar">
          <button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Buka menu">
            ☰
          </button>
          <div>
            <span>Semester Genap 2024/2025</span>
            <strong>{page}</strong>
          </div>
          <div className="top-actions">
            <button
              className="notification-button"
              onClick={() => flash('Tidak ada notifikasi baru.')}
            >
              <Icon name="Notifikasi" />
              <i>3</i>
            </button>
            <span className="top-avatar">{current.initials}</span>
            <div>
              <strong>{current.name}</strong>
              <small>{role}</small>
            </div>
          </div>
        </header>
        <main className="portal-content">{content}</main>
      </div>
      {toast && (
        <div className="toast">
          <span>✓</span>
          {toast}
        </div>
      )}
      {modal?.type === 'detail' && modal.data && (
        <Modal title={`Detail ${modal.data.id}`} onClose={() => setModal(null)}>
          <div className="detail-hero">
            <div>
              <Badge>{modal.data.approval}</Badge>
              <h3>{modal.data.course}</h3>
              <p>
                {modal.data.program} · {modal.data.type}
              </p>
            </div>
            <span className="course-code">{modal.data.code}</span>
          </div>
          <div className="detail-grid">
            {[
              ['Dosen pengampu', modal.data.lecturer],
              ['Tanggal pengajuan', modal.data.date],
              ['Status praktisi', modal.data.practitioner],
              ['Status mitra', modal.data.partner],
              ['Topik', 'Studi kasus dan penerapan berbasis kebutuhan industri.'],
              [
                'Kompetensi dibutuhkan',
                'Pengalaman profesional relevan dan kemampuan komunikasi kelas.',
              ],
            ].map(([a, b]) => (
              <div key={a}>
                <small>{a}</small>
                <strong>{b}</strong>
              </div>
            ))}
          </div>
          {(role === 'Admin PIJAR' || role === 'Super Admin') && (
            <div className="decision-box">
              <label>
                Catatan keputusan
                <textarea placeholder="Tuliskan catatan atau alasan keputusan..." />
              </label>
              <div>
                <button className="btn secondary" onClick={() => decide('Revision Required')}>
                  Minta Revisi
                </button>
                <button className="btn danger" onClick={() => decide('Rejected')}>
                  Tolak
                </button>
                <button className="btn primary" onClick={() => decide('Approved')}>
                  Setujui
                </button>
              </div>
            </div>
          )}
        </Modal>
      )}
      {modal?.type === 'document' && (
        <Modal title="Catat Dokumen" onClose={() => setModal(null)}>
          <form
            className="modal-form"
            onSubmit={(e) => {
              e.preventDefault()
              const f = new FormData(e.currentTarget)
              const url = String(f.get('url'))
              if (!/^https:\/\/(drive|docs)\.google\.com\//.test(url)) {
                flash('Gunakan tautan Google Drive yang valid.')
                return
              }
              setDocuments([
                {
                  name: String(f.get('name')),
                  submission: String(f.get('submission')),
                  uploader: current.name,
                  date: 'Hari ini',
                  url,
                  note: String(f.get('note')),
                },
                ...documents,
              ])
              setModal(null)
              flash('Metadata dokumen berhasil disimpan.')
            }}
          >
            <label>
              Pengajuan
              <select name="submission" required>
                {submissions.map((x) => (
                  <option key={x.id}>{x.id}</option>
                ))}
              </select>
            </label>
            <label>
              Nama dokumen
              <input name="name" required placeholder="Contoh: RPS Mini" />
            </label>
            <label>
              Tautan Google Drive
              <input name="url" type="url" required placeholder="https://drive.google.com/..." />
            </label>
            <label>
              Keterangan
              <textarea name="note" placeholder="Keterangan tambahan" />
            </label>
            <p className="form-hint">
              Pastikan izin berbagi di Google Drive sudah benar. Sistem tidak memeriksa
              aksesibilitas file.
            </p>
            <div className="form-actions">
              <button type="button" className="btn secondary" onClick={() => setModal(null)}>
                Batal
              </button>
              <button className="btn primary">Simpan Dokumen</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

function Login({ onLogin }: { onLogin: (role: Role) => void }) {
  const [selected, setSelected] = useState<Role>('Admin PIJAR')
  const [error, setError] = useState('')
  const [pending, startTransition] = useTransition()
  const submit = () => {
    setError('')
    startTransition(async () => {
      const account = roles[selected]
      const result = await loginAction(account.email, account.password)
      if (!result.ok) {
        setError(result.message)
        return
      }
      onLogin(selected)
    })
  }
  return (
    <main className="login-shell">
      <section className="login-story">
        <div className="portal-brand light">
          <span className="brand-symbol">
            <i />
            <i />
            <i />
          </span>
          <div>
            <strong>PIJAR–SUAR</strong>
            <small>Praktisi Mengajar</small>
          </div>
        </div>
        <div className="story-copy">
          <span>SISTEM INFORMASI TERINTEGRASI</span>
          <h1>Dari kebutuhan kelas menjadi kolaborasi nyata.</h1>
          <p>
            Kelola pengajuan, penugasan, dokumen, jadwal, dan evaluasi dalam satu ruang kerja yang
            saling terhubung.
          </p>
        </div>
        <div className="story-metrics">
          <div>
            <strong>7</strong>
            <span>akses pengguna</span>
          </div>
          <div>
            <strong>1</strong>
            <span>alur terintegrasi</span>
          </div>
          <div>
            <strong>100%</strong>
            <span>terpantau</span>
          </div>
        </div>
      </section>
      <section className="login-panel">
        <div className="login-box">
          <span className="eyebrow">PORTAL INTERNAL</span>
          <h2>Selamat datang</h2>
          <p>Pilih akun demo untuk menjelajahi hak akses tiap role.</p>
          <div className="account-picker">
            {(Object.keys(roles) as Role[]).map((key) => (
              <button
                key={key}
                className={selected === key ? 'selected' : ''}
                onClick={() => setSelected(key)}
              >
                <span>{roles[key].initials}</span>
                <div>
                  <strong>{key}</strong>
                  <small>{roles[key].email}</small>
                </div>
                <i>›</i>
              </button>
            ))}
          </div>
          <div className="credential-card">
            <span>Email</span>
            <strong>{roles[selected].email}</strong>
            <span>Password</span>
            <strong>{roles[selected].password}</strong>
          </div>
          {error && <p className="form-error login-form-error">{error}</p>}
          <button className="login-button" disabled={pending} onClick={submit}>
            {pending ? 'Memverifikasi akun...' : `Masuk sebagai ${selected}`}
          </button>
          <Link href="/">← Kembali ke halaman publik</Link>
        </div>
      </section>
    </main>
  )
}

function PageHead({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="page-head">
      <div>
        <span>{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  )
}

function Dashboard({
  role,
  submissions,
  onNavigate,
}: {
  role: Role
  submissions: Submission[]
  onNavigate: (s: string) => void
}) {
  const stats =
    role === 'Dosen Pengampu'
      ? [
          ['3', 'Jadwal aktif', '2 bulan ini'],
          ['2', 'Mata kuliah', 'Semester berjalan'],
          ['1', 'Evaluasi belum diisi', 'Perlu tindakan'],
          ['4', 'Evaluasi terkirim', 'Riwayat Anda'],
        ]
      : role === 'Admin SUAR'
        ? [
            ['18', 'Pengajuan SUAR', 'Semester berjalan'],
            ['12', 'Telah disetujui', 'Siap ditugaskan'],
            ['3', 'Belum ada praktisi', 'Perlu tindakan'],
            ['31', 'Praktisi', 'Database aktif'],
          ]
        : role === 'Admin KERMA'
          ? [
              ['26', 'Pengajuan disetujui', 'Lintas program'],
              ['5', 'Belum ada mitra', 'Perlu tindakan'],
              ['16', 'Mitra', 'Database aktif'],
              ['21', 'Penugasan', 'Semester ini'],
            ]
          : [
              ['48', 'Total pengajuan', '+8 bulan ini'],
              ['9', 'Menunggu approval', 'Perlu diperiksa'],
              ['31', 'Disetujui', '64,5% dari total'],
              ['6', 'Kegiatan berlangsung', 'Minggu ini'],
            ]
  return (
    <>
      <PageHead
        eyebrow={`DASHBOARD ${role.toUpperCase()}`}
        title={`Selamat datang, ${roles[role].name.split(' ')[0]}`}
        description="Ringkasan aktivitas dan tindakan yang membutuhkan perhatian Anda."
      />
      <div className="stat-grid">
        {stats.map(([value, label, note], i) => (
          <article key={label} className={i === 0 ? 'stat-card featured' : 'stat-card'}>
            <div className="stat-top">
              <span>
                <Icon name={label} />
              </span>
              <small>↗</small>
            </div>
            <strong>{value}</strong>
            <p>{label}</p>
            <small>{note}</small>
          </article>
        ))}
      </div>
      <div className="dashboard-layout">
        <section className="panel">
          <div className="panel-head">
            <div>
              <span>AKTIVITAS TERBARU</span>
              <h2>Pengajuan terbaru</h2>
            </div>
            <button
              onClick={() =>
                onNavigate(role === 'Kaprodi/Sekprodi' ? 'Pengajuan Saya' : 'Monitoring Pengajuan')
              }
            >
              Lihat semua
            </button>
          </div>
          <div className="compact-list">
            {submissions.slice(0, 4).map((item) => (
              <button
                key={item.id}
                onClick={() =>
                  onNavigate(
                    role === 'Kaprodi/Sekprodi' ? 'Pengajuan Saya' : 'Monitoring Pengajuan',
                  )
                }
              >
                <span className={`program-mark ${item.type.toLowerCase()}`}>
                  {item.type.slice(0, 1)}
                </span>
                <div>
                  <strong>{item.course}</strong>
                  <small>
                    {item.id} · {item.program}
                  </small>
                </div>
                <Badge>{item.approval}</Badge>
              </button>
            ))}
          </div>
        </section>
        <section className="panel attention-panel">
          <div className="panel-head">
            <div>
              <span>PERLU PERHATIAN</span>
              <h2>Tindakan berikutnya</h2>
            </div>
          </div>
          {[
            ['9 pengajuan menunggu review', 'Periksa kelengkapan dan berikan keputusan.'],
            ['3 penugasan praktisi kosong', 'Tentukan praktisi untuk pengajuan SUAR.'],
            ['5 dokumen belum lengkap', 'Tinjau rekapitulasi pelaksanaan.'],
          ].map(([a, b], i) => (
            <div className="attention-item" key={a}>
              <span>{i + 1}</span>
              <div>
                <strong>{a}</strong>
                <p>{b}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </>
  )
}

function SubmissionsPage({
  role,
  title,
  items,
  search,
  setSearch,
  filter,
  setFilter,
  open,
}: {
  role: Role
  title: string
  items: Submission[]
  search: string
  setSearch: (s: string) => void
  filter: string
  setFilter: (s: string) => void
  open: (s: Submission) => void
}) {
  const visible = items.filter(
    (x) =>
      `${x.id} ${x.course} ${x.program}`.toLowerCase().includes(search.toLowerCase()) &&
      (!filter || x.approval === filter) &&
      (!title.includes('SUAR') || x.type === 'SUAR') &&
      (!title.includes('Disetujui') || x.approval === 'Approved'),
  )
  return (
    <>
      <PageHead
        eyebrow="PUSAT DATA PENGAJUAN"
        title={title}
        description="Status approval dan penugasan ditampilkan terpisah agar proses mudah dipantau."
      />
      <div className="toolbar">
        <label>
          <Icon name="Pengajuan" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nomor, mata kuliah, atau prodi..."
          />
        </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">Semua status</option>
          {['Submitted', 'Under Review', 'Revision Required', 'Rejected', 'Approved'].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <span>{visible.length} data</span>
      </div>
      <section className="panel table-panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Pengajuan</th>
                <th>Program studi</th>
                <th>Dosen</th>
                <th>Approval</th>
                <th>Praktisi</th>
                <th>Mitra</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {visible.map((x) => (
                <tr key={x.id}>
                  <td>
                    <strong>{x.course}</strong>
                    <small>
                      {x.id} · {x.type} · {x.code}
                    </small>
                  </td>
                  <td>{x.program}</td>
                  <td>{x.lecturer}</td>
                  <td>
                    <Badge>{x.approval}</Badge>
                  </td>
                  <td>
                    <Badge>{x.practitioner}</Badge>
                  </td>
                  <td>
                    <Badge>{x.partner}</Badge>
                  </td>
                  <td>
                    <button className="table-action" onClick={() => open(x)}>
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {visible.length === 0 && (
          <div className="empty">
            <span>⌕</span>
            <h3>Data tidak ditemukan</h3>
            <p>Ubah kata kunci atau filter pencarian Anda.</p>
          </div>
        )}
      </section>
    </>
  )
}

function SubmissionForm({ onSubmit }: { onSubmit: (s: Submission) => void }) {
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    onSubmit({
      id: `PS-2025-${String(Date.now()).slice(-3)}`,
      type: f.get('type') as 'PIJAR' | 'SUAR',
      program: String(f.get('program')),
      course: String(f.get('course')),
      code: String(f.get('code')),
      lecturer: String(f.get('lecturer')),
      date: 'Hari ini',
      approval: 'Submitted',
      practitioner: 'Not Assigned',
      partner: 'Not Assigned',
    })
  }
  return (
    <>
      <PageHead
        eyebrow="PENGAJUAN BARU"
        title="Ajukan Mata Kuliah"
        description="Lengkapi kebutuhan praktisi dan mitra. Field bertanda bintang wajib diisi."
      />
      <form className="panel submission-form" onSubmit={submit}>
        <div className="form-section">
          <div>
            <span>01</span>
            <h2>Informasi program</h2>
            <p>Identitas mata kuliah dan periode akademik.</p>
          </div>
          <div className="form-grid">
            <label>
              Jenis program *
              <select name="type" required>
                <option>PIJAR</option>
                <option>SUAR</option>
              </select>
            </label>
            <label>
              Program studi *
              <select name="program" required>
                {programs.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label>
              Nama mata kuliah *<input name="course" required />
            </label>
            <label>
              Kode mata kuliah *<input name="code" required />
            </label>
            <label>
              Semester *
              <select required>
                <option>Genap</option>
                <option>Ganjil</option>
              </select>
            </label>
            <label>
              Tahun akademik *
              <select required>
                <option>2024/2025</option>
                <option>2025/2026</option>
              </select>
            </label>
            <label>
              Jumlah SKS *<input type="number" min="1" max="8" required />
            </label>
            <label>
              Nama dosen pengampu *<input name="lecturer" required />
            </label>
          </div>
        </div>
        <div className="form-section">
          <div>
            <span>02</span>
            <h2>Kebutuhan pengajaran</h2>
            <p>Jelaskan ruang lingkup kontribusi praktisi.</p>
          </div>
          <div className="form-grid">
            <label>
              Jumlah pertemuan *<input type="number" min="1" required />
            </label>
            <label>
              Perkiraan waktu pelaksanaan *
              <input type="text" placeholder="Contoh: Juni–Juli 2025" required />
            </label>
            <label className="wide">
              Topik atau materi *<textarea required />
            </label>
            <label className="wide">
              Kompetensi praktisi *<textarea required />
            </label>
            <label className="wide">
              Kualifikasi praktisi *<textarea required />
            </label>
            <label className="wide">
              Kebutuhan atau bidang mitra
              <textarea />
            </label>
            <label className="wide">
              Keterangan tambahan
              <textarea />
            </label>
          </div>
        </div>
        <div className="form-actions">
          <button type="reset" className="btn secondary">
            Kosongkan
          </button>
          <button className="btn primary">Kirim Pengajuan</button>
        </div>
      </form>
    </>
  )
}

function AssignmentPage({
  kind,
  submissions,
  onAssign,
}: {
  kind: 'practitioner' | 'partner'
  submissions: Submission[]
  onAssign: (id: string) => void
}) {
  const data = kind === 'practitioner' ? practitioners : partners
  const eligible = submissions.filter(
    (x) => x.approval === 'Approved' && (kind === 'partner' || x.type === 'SUAR'),
  )
  return (
    <>
      <PageHead
        eyebrow="PENUGASAN"
        title={kind === 'practitioner' ? 'Penugasan Praktisi' : 'Penugasan Mitra'}
        description={
          kind === 'practitioner'
            ? 'Tentukan praktisi untuk pengajuan SUAR yang telah disetujui.'
            : 'Mitra hanya dapat ditentukan setelah approval Admin PIJAR.'
        }
      />
      <div className="assignment-grid">
        <section className="panel">
          <div className="panel-head">
            <div>
              <span>SIAP DITUGASKAN</span>
              <h2>Pengajuan disetujui</h2>
            </div>
          </div>
          {eligible.map((x) => (
            <div className="assign-request" key={x.id}>
              <div>
                <strong>{x.course}</strong>
                <small>
                  {x.id} · {x.program}
                </small>
              </div>
              <Badge>{kind === 'practitioner' ? x.practitioner : x.partner}</Badge>
              <select aria-label={`Pilih ${kind}`}>
                <option>{kind === 'practitioner' ? 'Pilih praktisi' : 'Pilih mitra'}</option>
                {data.map((d) => (
                  <option key={d.name}>{d.name}</option>
                ))}
              </select>
              <button className="btn primary small-btn" onClick={() => onAssign(x.id)}>
                Simpan Penugasan
              </button>
            </div>
          ))}
        </section>
        <section className="panel">
          <div className="panel-head">
            <div>
              <span>DATABASE</span>
              <h2>{kind === 'practitioner' ? 'Praktisi tersedia' : 'Mitra tersedia'}</h2>
            </div>
            <button>+ Tambah</button>
          </div>
          <div className="people-list">
            {data.map((person) => (
              <article key={person.name}>
                <span>
                  {person.name
                    .split(' ')
                    .map((x) => x[0])
                    .slice(0, 2)
                    .join('')}
                </span>
                <div>
                  <strong>{person.name}</strong>
                  <p>{'institution' in person ? person.institution : person.industry}</p>
                  <small>{'expertise' in person ? person.expertise : person.contact}</small>
                </div>
                <button aria-label={`Edit ${person.name}`}>Edit</button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}

function DocumentsPage({ documents, onAdd }: { documents: typeof initialDocs; onAdd: () => void }) {
  return (
    <>
      <PageHead
        eyebrow="PELAKSANAAN PERKULIAHAN"
        title="Dokumen Akademik dan Praktisi"
        description="Satu daftar terpadu untuk seluruh metadata dokumen dan tautan Google Drive."
        action={
          <button className="btn primary" onClick={onAdd}>
            + Catat Dokumen
          </button>
        }
      />
      <div className="info-banner">
        <span>i</span>
        <p>
          File tetap disimpan di Google Drive. Pastikan izin berbagi sudah sesuai sebelum mencatat
          tautan.
        </p>
      </div>
      <section className="panel table-panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nama dokumen</th>
                <th>Pengajuan</th>
                <th>Pengunggah</th>
                <th>Tanggal</th>
                <th>Keterangan</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {documents.map((x) => (
                <tr key={`${x.name}${x.submission}`}>
                  <td>
                    <strong>{x.name}</strong>
                    <small>Tautan Google Drive</small>
                  </td>
                  <td>{x.submission}</td>
                  <td>{x.uploader}</td>
                  <td>{x.date}</td>
                  <td>{x.note}</td>
                  <td>
                    <a className="table-action" href={x.url} target="_blank" rel="noreferrer">
                      Lihat Dokumen ↗
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

function SchedulePage() {
  const [query, setQuery] = useState('')
  const visible = scheduleData.filter((x) =>
    `${x.course} ${x.program}`.toLowerCase().includes(query.toLowerCase()),
  )
  return (
    <>
      <PageHead
        eyebrow="AGENDA PERKULIAHAN"
        title="Jadwal PIJAR–SUAR"
        description="Jadwal terhubung dengan pengajuan, penugasan praktisi, dan mitra."
      />
      <div className="toolbar">
        <label>
          <Icon name="Jadwal" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari jadwal..."
          />
        </label>
        <select>
          <option>Semua tanggal</option>
          <option>Juni 2025</option>
        </select>
      </div>
      <div className="schedule-list">
        {visible.map((x) => (
          <article key={x.course} className="panel">
            <div className="date-block">
              <strong>{x.date.split(' ')[0]}</strong>
              <span>{x.date.split(' ').slice(1).join(' ')}</span>
            </div>
            <div className="schedule-info">
              <div>
                <Badge>{x.type}</Badge>
                <Badge>{x.status}</Badge>
              </div>
              <h2>{x.course}</h2>
              <p>{x.program}</p>
              <div className="schedule-meta">
                <span>◷ {x.time}</span>
                <span>⌖ {x.location}</span>
                <span>◎ {x.practitioner}</span>
              </div>
            </div>
            <div className="partner-note">
              <small>MITRA</small>
              <strong>{x.partner}</strong>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}

function EvaluationPage({
  history,
  evaluated,
  onSubmit,
}: {
  history: boolean
  evaluated: boolean
  onSubmit: () => void
}) {
  if (history)
    return (
      <>
        <PageHead
          eyebrow="RIWAYAT"
          title="Riwayat Evaluasi"
          description="Evaluasi yang telah dikirim dan terhubung dengan kegiatan perkuliahan."
        />
        <section className="panel table-panel">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Kegiatan</th>
                  <th>Praktisi</th>
                  <th>Tanggal</th>
                  <th>Nilai</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Arsitektur Berkelanjutan</strong>
                    <small>Architecture</small>
                  </td>
                  <td>Nadia Rahman</td>
                  <td>12 Mei 2025</td>
                  <td>
                    <strong>4.8 / 5</strong>
                  </td>
                  <td>
                    <Badge>Terkirim</Badge>
                  </td>
                </tr>
                {evaluated && (
                  <tr>
                    <td>
                      <strong>Manajemen Proyek</strong>
                      <small>Manajemen</small>
                    </td>
                    <td>Sarah Wijaya</td>
                    <td>Hari ini</td>
                    <td>
                      <strong>5.0 / 5</strong>
                    </td>
                    <td>
                      <Badge>Terkirim</Badge>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </>
    )
  return (
    <>
      <PageHead
        eyebrow="EVALUASI DOSEN"
        title="Evaluasi Praktisi"
        description="Gunakan skala 1–5 secara konsisten untuk menilai kegiatan mengajar."
      />
      <form
        className="panel evaluation-form"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
      >
        <div className="evaluation-subject">
          <div>
            <span>KEGIATAN TERPILIH</span>
            <h2>Manajemen Proyek</h2>
            <p>Sarah Wijaya · 20 Juni 2025 · Manajemen</p>
          </div>
          <Badge>Belum diisi</Badge>
        </div>
        {[
          'Kesesuaian materi dengan kebutuhan mata kuliah',
          'Penguasaan materi',
          'Kemampuan komunikasi',
          'Kemampuan menyampaikan materi',
          'Kesesuaian pengalaman dengan bidang',
        ].map((label) => (
          <fieldset key={label}>
            <legend>{label}</legend>
            <div>
              {[1, 2, 3, 4, 5].map((n) => (
                <label key={n}>
                  <input type="radio" name={label} value={n} required />
                  <span>{n}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        <label>
          Penilaian keseluruhan *
          <select required>
            <option value="">Pilih penilaian</option>
            <option>5 — Sangat Baik</option>
            <option>4 — Baik</option>
            <option>3 — Cukup</option>
            <option>2 — Kurang</option>
            <option>1 — Sangat Kurang</option>
          </select>
        </label>
        <label>
          Masukan atau saran *<textarea required placeholder="Tuliskan masukan konstruktif..." />
        </label>
        <div className="form-actions">
          <button className="btn primary">Kirim Evaluasi</button>
        </div>
      </form>
    </>
  )
}

function RecapPage() {
  return (
    <>
      <PageHead
        eyebrow="REKAPITULASI PELAKSANAAN"
        title="Kelengkapan Kegiatan"
        description="Ringkasan RPS Mini, dokumentasi pengajaran, dan evaluasi dari sumber data yang sama."
        action={
          <button className="btn secondary" onClick={() => window.print()}>
            Ekspor Laporan
          </button>
        }
      />
      <div className="completion-grid">
        {[
          ['RPS Mini', '38', '79%'],
          ['Dokumentasi', '34', '71%'],
          ['Evaluasi dosen', '29', '60%'],
        ].map(([a, b, c]) => (
          <article className="panel" key={a}>
            <span>{a}</span>
            <strong>
              {b}
              <small>/ 48</small>
            </strong>
            <div>
              <i style={{ width: c }} />
            </div>
            <p>{c} lengkap</p>
          </article>
        ))}
      </div>
      <section className="panel table-panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Mata kuliah</th>
                <th>Program studi</th>
                <th>Tahun akademik</th>
                <th>RPS Mini</th>
                <th>Dokumentasi</th>
                <th>Evaluasi</th>
                <th>Kelengkapan</th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  'Analisis dan Perancangan Sistem Informasi',
                  'Business Information System',
                  'Lengkap',
                  'Lengkap',
                  'Lengkap',
                  '100%',
                ],
                ['Manajemen Proyek', 'Manajemen', 'Lengkap', 'Lengkap', 'Belum', '67%'],
                ['UI/UX Design', 'DKV', 'Belum', 'Belum', 'Belum', '0%'],
              ].map((x) => (
                <tr key={x[0]}>
                  <td>
                    <strong>{x[0]}</strong>
                  </td>
                  <td>{x[1]}</td>
                  <td>2024/2025</td>
                  <td>
                    <Badge>{x[2]}</Badge>
                  </td>
                  <td>
                    <Badge>{x[3]}</Badge>
                  </td>
                  <td>
                    <Badge>{x[4]}</Badge>
                  </td>
                  <td>
                    <strong>{x[5]}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

function AuditPage() {
  return (
    <>
      <PageHead
        eyebrow="AUDIT SISTEM"
        title="Riwayat Aktivitas"
        description="Jejak perubahan data, waktu, dan pengguna yang melakukan tindakan."
      />
      <section className="panel table-panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Pengguna</th>
                <th>Aktivitas</th>
                <th>Entitas</th>
                <th>Perubahan</th>
                <th>Waktu</th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  'Aulia Prameswari',
                  'Approval pengajuan',
                  'PS-2025-048',
                  'Under Review → Approved',
                  '14 Mei, 10.42',
                ],
                [
                  'Satria Mahesa',
                  'Penugasan praktisi',
                  'PS-2025-048',
                  'Not Assigned → Assigned',
                  '14 Mei, 13.18',
                ],
                [
                  'Dr. Rina Kusuma',
                  'Tambah dokumen',
                  'RPS Mini APSI',
                  'Dokumen baru',
                  '16 Mei, 09.06',
                ],
                [
                  'Nadia Mahendra',
                  'Penugasan mitra',
                  'PS-2025-048',
                  'Not Assigned → Assigned',
                  '16 Mei, 11.31',
                ],
              ].map((x) => (
                <tr key={x[1] + x[4]}>
                  <td>
                    <strong>{x[0]}</strong>
                  </td>
                  <td>{x[1]}</td>
                  <td>{x[2]}</td>
                  <td>{x[3]}</td>
                  <td>{x[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

const roleLabels: Record<string, string> = {
  'super-admin': 'Super Admin',
  'admin-pijar': 'Admin PIJAR',
  kaprodi: 'Kaprodi/Sekprodi',
  'admin-suar': 'Admin SUAR',
  'admin-kerma': 'Admin KERMA',
  dosen: 'Dosen Pengampu',
}
const categoryLabels: Record<string, string> = {
  'study-program': 'Program Studi',
  'academic-year': 'Tahun Akademik',
  'document-category': 'Kategori Dokumen',
  expertise: 'Bidang Keahlian',
  other: 'Konfigurasi Lainnya',
}

function MasterPage({
  type,
  flash,
  masterData,
  setMasterData,
  users,
  setUsers,
  studyPrograms,
}: {
  type: string
  flash: (s: string) => void
  masterData: MasterRecord[]
  setMasterData: (items: MasterRecord[]) => void
  users: PortalUser[]
  setUsers: (items: PortalUser[]) => void
  studyPrograms: StudyProgramOption[]
}) {
  const isUsers = type === 'Pengguna & Role'
  const [form, setForm] = useState<'master' | 'user' | null>(null)
  const [editing, setEditing] = useState<PortalUser | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState('')
  const [pending, startTransition] = useTransition()

  const close = () => {
    setForm(null)
    setEditing(null)
    setErrors({})
    setMessage('')
  }
  const openCreate = () => {
    setEditing(null)
    setErrors({})
    setMessage('')
    setForm(isUsers ? 'user' : 'master')
  }
  const submitMaster = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setErrors({})
    setMessage('')
    startTransition(async () => {
      const result = await createMasterDataAction({
        category: String(data.get('category') ?? ''),
        name: String(data.get('name') ?? ''),
        description: String(data.get('description') ?? ''),
        status: String(data.get('status') ?? ''),
      })
      if (!result.ok) {
        setMessage(result.message)
        setErrors(result.fields ?? {})
        return
      }
      setMasterData([result.data, ...masterData])
      close()
      flash('Data master berhasil disimpan.')
    })
  }
  const submitUser = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setErrors({})
    setMessage('')
    startTransition(async () => {
      const input = {
        id: editing?.id,
        name: String(data.get('name') ?? ''),
        email: String(data.get('email') ?? ''),
        username: String(data.get('username') ?? ''),
        role: String(data.get('role') ?? ''),
        studyProgram: String(data.get('studyProgram') ?? ''),
        status: String(data.get('status') ?? ''),
        password: String(data.get('password') ?? ''),
      }
      const result = editing ? await updateUserAction(input) : await createUserAction(input)
      if (!result.ok) {
        setMessage(result.message)
        setErrors(result.fields ?? {})
        return
      }
      setUsers(
        editing
          ? users.map((user) => (user.id === result.data.id ? result.data : user))
          : [result.data, ...users],
      )
      close()
      flash(editing ? 'Perubahan pengguna berhasil disimpan.' : 'Pengguna baru berhasil disimpan.')
    })
  }

  return (
    <>
      <PageHead
        eyebrow="ADMINISTRASI SISTEM"
        title={type}
        description={
          type === 'Pengguna & Role'
            ? 'Kelola akun, role, dan status akses pengguna internal.'
            : 'Kelola referensi program studi dan tahun akademik.'
        }
        action={
          <button className="btn primary" onClick={openCreate}>
            + Tambah Data
          </button>
        }
      />
      <section className="panel table-panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Identitas</th>
                <th>Jenis / Role</th>
                <th>Status</th>
                {isUsers && <th />}
              </tr>
            </thead>
            <tbody>
              {isUsers
                ? users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <strong>{user.name}</strong>
                        <small>{user.username ? `@${user.username}` : 'Tanpa username'}</small>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        {roleLabels[user.role]}
                        {user.studyProgram?.name && <small>{user.studyProgram.name}</small>}
                      </td>
                      <td>
                        <Badge>{user.status === 'active' ? 'Aktif' : 'Nonaktif'}</Badge>
                      </td>
                      <td>
                        <button
                          className="table-action"
                          onClick={() => {
                            setEditing(user)
                            setErrors({})
                            setMessage('')
                            setForm('user')
                          }}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                : masterData.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.name}</strong>
                      </td>
                      <td>{item.description || '—'}</td>
                      <td>{categoryLabels[item.category]}</td>
                      <td>
                        <Badge>{item.status === 'active' ? 'Aktif' : 'Nonaktif'}</Badge>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
        {(isUsers ? users : masterData).length === 0 && (
          <div className="empty">
            <span>+</span>
            <h3>Belum ada data</h3>
            <p>Gunakan tombol Tambah Data untuk membuat entri pertama.</p>
          </div>
        )}
      </section>
      {form === 'master' && (
        <Modal title="Tambah Data Master" onClose={close}>
          <form className="modal-form admin-data-form" onSubmit={submitMaster}>
            <label>
              Kategori data master *
              <select name="category" defaultValue="" aria-invalid={Boolean(errors.category)}>
                <option value="" disabled>
                  Pilih kategori
                </option>
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {errors.category && <small className="field-error">{errors.category}</small>}
            </label>
            <label>
              Nama data *
              <input name="name" autoFocus aria-invalid={Boolean(errors.name)} />
              {errors.name && <small className="field-error">{errors.name}</small>}
            </label>
            <label>
              Keterangan opsional
              <textarea name="description" placeholder="Tambahkan konteks atau catatan..." />
            </label>
            <label>
              Status *
              <select name="status" defaultValue="active">
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </select>
            </label>
            {message && <p className="form-error">{message}</p>}
            <div className="form-actions">
              <button type="button" className="btn secondary" onClick={close} disabled={pending}>
                Batal
              </button>
              <button className="btn primary" disabled={pending}>
                {pending ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </Modal>
      )}
      {form === 'user' && (
        <Modal title={editing ? 'Edit Pengguna' : 'Tambah Pengguna'} onClose={close}>
          <form
            key={editing?.id ?? 'new-user'}
            className="modal-form admin-data-form"
            onSubmit={submitUser}
          >
            <div className="modal-form-grid">
              <label>
                Nama lengkap *
                <input
                  name="name"
                  autoFocus
                  defaultValue={editing?.name}
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name && <small className="field-error">{errors.name}</small>}
              </label>
              <label>
                Email *
                <input
                  name="email"
                  type="email"
                  defaultValue={editing?.email}
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email && <small className="field-error">{errors.email}</small>}
              </label>
              <label>
                Username
                <input name="username" defaultValue={editing?.username} placeholder="Opsional" />
              </label>
              <label>
                Role *
                <select
                  name="role"
                  defaultValue={editing?.role ?? ''}
                  aria-invalid={Boolean(errors.role)}
                >
                  <option value="" disabled>
                    Pilih role
                  </option>
                  {Object.entries(roleLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                {errors.role && <small className="field-error">{errors.role}</small>}
              </label>
              <label>
                Program studi
                <select
                  name="studyProgram"
                  defaultValue={editing?.studyProgram?.id ?? ''}
                  aria-invalid={Boolean(errors.studyProgram)}
                >
                  <option value="">Tidak terkait prodi</option>
                  {studyPrograms.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.name}
                    </option>
                  ))}
                </select>
                {errors.studyProgram && (
                  <small className="field-error">{errors.studyProgram}</small>
                )}
              </label>
              <label>
                Status akun *
                <select name="status" defaultValue={editing?.status ?? 'active'}>
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                </select>
              </label>
              <label className="wide">
                {editing ? 'Password baru' : 'Password awal *'}
                <input
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder={editing ? 'Kosongkan jika tidak diubah' : 'Minimal 8 karakter'}
                  aria-invalid={Boolean(errors.password)}
                />
                {errors.password && <small className="field-error">{errors.password}</small>}
              </label>
            </div>
            {message && <p className="form-error">{message}</p>}
            <div className="form-actions">
              <button type="button" className="btn secondary" onClick={close} disabled={pending}>
                Batal
              </button>
              <button className="btn primary" disabled={pending}>
                {pending ? 'Menyimpan...' : editing ? 'Simpan Perubahan' : 'Simpan Pengguna'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}
