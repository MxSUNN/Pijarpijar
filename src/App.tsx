import { FormEvent, ReactNode, useMemo, useState } from 'react'

type Role = 'Admin PIJAR' | 'Dosen/Kaprodi' | 'Praktisi' | 'Admin Mitra Kerja Sama' | 'Admin Summarecon Mengajar'
type ModalState = { type: string; data?: any } | null
type Account = { email: string; password: string; role: Role }

const roles: Record<Role, { short: string; name: string; email: string; menu: string[] }> = {
  'Admin PIJAR': {
    short: 'AK',
    name: 'Aulia Prameswari',
    email: 'kerma@pijar.ac.id',
    menu: ['Dashboard', 'Semua Pengajuan', 'Kebutuhan Dosen', 'Data Praktisi', 'Pencocokan Praktisi', 'Konfirmasi Pasangan', 'Monitoring Bahan Ajar', 'Jadwal Mengajar', 'Presensi Praktisi', 'Laporan Pelaksanaan Kelas', 'Laporan & Statistik', 'Notifikasi', 'Manajemen Pengguna', 'Pengaturan Sistem'],
  },
  'Dosen/Kaprodi': {
    short: 'DR',
    name: 'Dr. Rina Kusuma',
    email: 'rina.kusuma@univ.ac.id',
    menu: ['Dashboard', 'Pengajuan Kebutuhan Praktisi', 'Riwayat Pengajuan', 'Rekomendasi Praktisi', 'Konfirmasi Pasangan', 'Monitoring Bahan Ajar', 'Jadwal Mengajar', 'Notifikasi', 'Profil'],
  },
  Praktisi: {
    short: 'BS',
    name: 'Bima Santoso',
    email: 'bima@nusantara.tech',
    menu: ['Dashboard', 'Profil Praktisi', 'Undangan Mengajar', 'Konfirmasi Pasangan', 'Koordinasi Perkuliahan', 'Bahan Ajar', 'Jadwal Mengajar', 'Presensi', 'Riwayat Mengajar', 'Notifikasi'],
  },
  'Admin Mitra Kerja Sama': {
    short: 'NM',
    name: 'Nadia Mahendra',
    email: 'nadia@mitrabersama.id',
    menu: ['Dashboard', 'Pengajuan Praktisi', 'Data Praktisi', 'Riwayat Pengajuan', 'Notifikasi', 'Profil'],
  },
  'Admin Summarecon Mengajar': {
    short: 'SM',
    name: 'Satria Mahesa',
    email: 'satria@summarecon.com',
    menu: ['Dashboard', 'Pengajuan Praktisi', 'Data Praktisi', 'Riwayat Pengajuan', 'Notifikasi', 'Profil'],
  },
}

const demoAccounts: Account[] = [
  { email: 'dosen@pijar.ac.id', password: 'Dosen123', role: 'Dosen/Kaprodi' },
  { email: 'kerma@pijar.ac.id', password: 'Admin123', role: 'Admin PIJAR' },
  { email: 'praktisi@pijar.ac.id', password: 'Praktisi123', role: 'Praktisi' },
  { email: 'mitra@pijar.ac.id', password: 'Mitra123', role: 'Admin Mitra Kerja Sama' },
  { email: 'summarecon@pijar.ac.id', password: 'Summarecon123', role: 'Admin Summarecon Mengajar' },
]

const roleLabel = (role: Role) => role === 'Admin PIJAR' ? 'Admin Kerma' : role

const iconPaths: Record<string, ReactNode> = {
  Dashboard: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
  Pengajuan: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h6"/></>,
  Praktisi: <><circle cx="12" cy="8" r="4"/><path d="M4 22a8 8 0 0 1 16 0"/></>,
  Bahan: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>,
  Jadwal: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></>,
  Notifikasi: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
  default: <><circle cx="12" cy="12" r="9"/><path d="m9 12 2 2 4-5"/></>,
}

function Icon({ name, size = 19 }: { name: string; size?: number }) {
  const key = Object.keys(iconPaths).find(k => name.includes(k)) || 'default'
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{iconPaths[key]}</svg>
}

const initialRequests = [
  { id: 'KD-024', course: 'Analitik Data Bisnis', program: 'S1 Sistem Informasi', lecturer: 'Dr. Rina Kusuma', expertise: 'Data Analytics', meetings: 4, schedule: 'Mei 2025', status: 'Dalam proses pencocokan', description: 'Studi kasus analitik data pada industri digital.' },
  { id: 'KD-023', course: 'Manajemen Proyek', program: 'S1 Teknik Industri', lecturer: 'Dimas Wiratama, M.T.', expertise: 'Project Management', meetings: 3, schedule: '20–31 Mei 2025', status: 'Disetujui', description: 'Praktik agile project management dan risk control.' },
  { id: 'KD-022', course: 'Komunikasi Pemasaran', program: 'S1 Ilmu Komunikasi', lecturer: 'Arini Putri, M.I.Kom.', expertise: 'Digital Marketing', meetings: 2, schedule: 'Juni 2025', status: 'Perlu revisi', description: 'Perencanaan kampanye digital terintegrasi.' },
  { id: 'KD-021', course: 'Arsitektur Berkelanjutan', program: 'S1 Arsitektur', lecturer: 'Fajar Nugraha, M.Ars.', expertise: 'Green Building', meetings: 2, schedule: '12 Mei 2025', status: 'Selesai', description: 'Penerapan prinsip green building.' },
]

const initialPractitioners = [
  { id: 'PR-018', name: 'Bima Santoso', company: 'Nusantara Tech', position: 'Head of Data', expertise: 'Data Analytics', experience: '12 tahun', source: 'Mitra Kerja Sama', score: 94, status: 'Terverifikasi', email: 'bima@nusantara.tech' },
  { id: 'PR-017', name: 'Sarah Wijaya', company: 'Telkom Indonesia', position: 'Senior Data Scientist', expertise: 'Data Science & AI', experience: '9 tahun', source: 'Summarecon Mengajar', score: 88, status: 'Terverifikasi', email: 'sarah.w@telkom.co.id' },
  { id: 'PR-016', name: 'Raka Adinata', company: 'AgileWorks', position: 'Program Director', expertise: 'Project Management', experience: '14 tahun', source: 'Mitra Kerja Sama', score: 82, status: 'Menunggu verifikasi', email: 'raka@agileworks.id' },
  { id: 'PR-015', name: 'Maya Lestari', company: 'BrandVista', position: 'VP Marketing', expertise: 'Digital Marketing', experience: '11 tahun', source: 'Summarecon Mengajar', score: 77, status: 'Perlu revisi', email: 'maya@brandvista.id' },
]

const initialDocuments = [
  { id: 1, owner: 'Dr. Rina Kusuma', role: 'Dosen', type: 'PPT', file: 'Materi-Analitik-Data.pptx', uploaded: '10 Mei 2025, 09.12', status: 'Disetujui', classId: 'KLS-101' },
  { id: 2, owner: 'Dr. Rina Kusuma', role: 'Dosen', type: 'RPS', file: 'RPS-Analitik-Data.pdf', uploaded: '10 Mei 2025, 09.15', status: 'Disetujui', classId: 'KLS-101' },
  { id: 3, owner: 'Dr. Rina Kusuma', role: 'Dosen', type: 'Silabus', file: 'Silabus-ADB.pdf', uploaded: '10 Mei 2025, 09.18', status: 'Disetujui', classId: 'KLS-101' },
  { id: 4, owner: 'Bima Santoso', role: 'Praktisi', type: 'PPT Disesuaikan', file: 'PPT-Kolaborasi-v2.pptx', uploaded: '12 Mei 2025, 14.30', status: 'Menunggu pemeriksaan', classId: 'KLS-101' },
  { id: 5, owner: 'Bima Santoso', role: 'Praktisi', type: 'RPS Mini', file: 'RPS-Mini-ADB.pdf', uploaded: '12 Mei 2025, 14.33', status: 'Perlu revisi', classId: 'KLS-101' },
  { id: 6, owner: 'Fajar Nugraha', role: 'Dosen', type: 'PPT', file: 'Green-Building.pptx', uploaded: '02 Mei 2025, 08.20', status: 'Disetujui', classId: 'KLS-099' },
]

const schedules = [
  { id: 'KLS-101', date: '22 Mei 2025', day: 22, time: '09.00–11.30', course: 'Analitik Data Bisnis', lecturer: 'Dr. Rina Kusuma', practitioner: 'Bima Santoso', program: 'S1 Sistem Informasi', location: 'Lab Komputer 3', status: 'Akan datang' },
  { id: 'KLS-100', date: '20 Mei 2025', day: 20, time: '13.00–15.00', course: 'Manajemen Proyek', lecturer: 'Dimas Wiratama', practitioner: 'Raka Adinata', program: 'S1 Teknik Industri', location: 'Zoom Meeting', status: 'Akan datang' },
  { id: 'KLS-099', date: '12 Mei 2025', day: 12, time: '10.00–12.00', course: 'Arsitektur Berkelanjutan', lecturer: 'Fajar Nugraha', practitioner: 'Nadia Rahman', program: 'S1 Arsitektur', location: 'Ruang A-402', status: 'Selesai' },
]

function Badge({ children }: { children: ReactNode }) {
  const text = String(children)
  const tone = /Disetujui|Terverifikasi|Selesai|Tersedia|Final/.test(text) ? 'green' : /revisi|Ditolak|Kedaluwarsa/.test(text) ? 'red' : /Menunggu|proses|Akan/.test(text) ? 'orange' : 'gray'
  return <span className={`badge badge-${tone}`}><i />{children}</span>
}

function Button({ children, onClick, variant = 'primary', type = 'button', disabled = false, className = '' }: { children: ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; type?: 'button' | 'submit'; disabled?: boolean; className?: string }) {
  return <button type={type} disabled={disabled} onClick={onClick} className={`btn btn-${variant} ${className}`}>{children}</button>
}

function Modal({ title, children, onClose, wide = false }: { title: string; children: ReactNode; onClose: () => void; wide?: boolean }) {
  return <div className="modal-backdrop" onMouseDown={onClose}><div className={`modal ${wide ? 'modal-wide' : ''}`} onMouseDown={e => e.stopPropagation()}>
    <div className="modal-head"><div><p className="eyebrow">PIJAR</p><h2>{title}</h2></div><button className="icon-btn" onClick={onClose} aria-label="Tutup">×</button></div>
    <div className="modal-body">{children}</div>
  </div></div>
}

function Field({ label, name, children, required = true }: { label: string; name?: string; children?: ReactNode; required?: boolean }) {
  return <label className="field"><span>{label}{required && <b> *</b>}</span>{children || <input name={name} required={required} />}</label>
}

function DataToolbar({ search, setSearch, filter, setFilter, options, action }: { search: string; setSearch: (v: string) => void; filter: string; setFilter: (v: string) => void; options: string[]; action?: ReactNode }) {
  return <div className="toolbar">
    <div className="search"><Icon name="Pengajuan" size={17}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari data..." /></div>
    <select value={filter} onChange={e => setFilter(e.target.value)}><option value="">Semua status</option>{options.map(o => <option key={o}>{o}</option>)}</select>
    <div className="toolbar-spacer" />{action}
  </div>
}

function StatCard({ label, value, note, accent = false }: { label: string; value: string | number; note: string; accent?: boolean }) {
  return <div className={`stat-card ${accent ? 'accent' : ''}`}><div className="stat-icon"><Icon name={label}/></div><div><p>{label}</p><strong>{value}</strong><small>{note}</small></div></div>
}

export default function App() {
  const [sessionRole, setSessionRole] = useState<Role | null>(() => {
    const stored = window.sessionStorage.getItem('pijar-role') as Role | null
    return stored && roles[stored] ? stored : null
  })

  const login = (role: Role) => {
    window.sessionStorage.setItem('pijar-role', role)
    setSessionRole(role)
  }
  const logout = () => {
    window.sessionStorage.removeItem('pijar-role')
    setSessionRole(null)
  }

  return sessionRole ? <DashboardApp role={sessionRole} onLogout={logout} /> : <LoginPage onLogin={login} />
}

function LoginPage({ onLogin }: { onLogin: (role: Role) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const account = demoAccounts.find(item => item.email.toLowerCase() === email.trim().toLowerCase())
    if (!account) {
      setError('Akun belum terdaftar. Silakan menghubungi administrator.')
      return
    }
    if (account.password !== password) {
      setError('Email atau password tidak sesuai')
      return
    }
    setError('')
    onLogin(account.role)
  }

  const useAccount = (account: Account) => {
    setEmail(account.email)
    setPassword(account.password)
    setError('')
  }

  return <main className="login-page">
    <section className="login-visual">
      <div className="login-brand"><div className="brand-mark"><span /><span /><span /></div><div><strong>PIJAR</strong><small>Praktisi Mengajar</small></div></div>
      <div className="login-message"><p>PLATFORM KOLABORASI AKADEMIK</p><h1>Menghubungkan ruang kelas dengan pengalaman industri.</h1><span>Kelola pengajuan, penugasan praktisi, dan pelaksanaan perkuliahan dalam satu ekosistem terintegrasi.</span></div>
      <div className="education-illustration" aria-label="Ilustrasi kolaborasi kampus dan praktisi">
        <div className="campus-building"><i /><i /><i /><b /><span /></div>
        <div className="connection-line"><i /><i /><i /></div>
        <div className="professional-card"><span>BS</span><div><small>PRAKTISI PROFESIONAL</small><strong>Berbagi pengalaman industri</strong></div></div>
        <div className="student-card"><span>DR</span><div><small>KOLABORASI KAMPUS</small><strong>Pembelajaran yang relevan</strong></div></div>
      </div>
      <p className="login-copyright">© 2025 PIJAR · Praktisi Mengajar</p>
    </section>
    <section className="login-form-side">
      <div className="mobile-login-brand"><div className="brand-mark"><span /><span /><span /></div><strong>PIJAR</strong></div>
      <div className="login-card">
        <div className="login-heading"><span>AKSES SISTEM INFORMASI</span><h2>Selamat Datang di PIJAR</h2><p>Platform Pengajuan Praktisi Mengajar</p></div>
        <form onSubmit={submit}>
          <label className="login-field"><span>Email</span><div><Icon name="Pengajuan" size={18}/><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Masukkan alamat email Anda" autoComplete="email" required /></div></label>
          <label className="login-field"><span>Password</span><div><Icon name="default" size={18}/><input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Masukkan password Anda" autoComplete="current-password" required /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}>{showPassword ? 'Sembunyikan' : 'Lihat'}</button></div></label>
          {error && <div className="login-error"><span>!</span><p>{error}</p></div>}
          <Button type="submit" className="login-submit">Masuk <span>→</span></Button>
        </form>
        <p className="login-note">Gunakan email institusi yang telah terdaftar untuk mengakses PIJAR.</p>
        <div className="demo-section"><div><span>AKUN SIMULASI</span><i /></div><p>Pilih kredensial demo untuk mengisi formulir otomatis. Role tetap ditentukan oleh akun.</p>
          <div className="demo-accounts">{demoAccounts.map(account => <button key={account.email} onClick={() => useAccount(account)}><span className="avatar">{roles[account.role].short}</span><span><strong>{roleLabel(account.role)}</strong><small>{account.email} · {account.password}</small></span><b>Gunakan</b></button>)}</div>
        </div>
      </div>
    </section>
  </main>
}

function DashboardApp({ role, onLogout }: { role: Role; onLogout: () => void }) {
  const [page, setPage] = useState('Dashboard')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [noticeOpen, setNoticeOpen] = useState(false)
  const [modal, setModal] = useState<ModalState>(null)
  const [toast, setToast] = useState('')
  const [requests, setRequests] = useState(initialRequests)
  const [practitioners, setPractitioners] = useState(initialPractitioners)
  const [documents, setDocuments] = useState(initialDocuments)
  const [matches, setMatches] = useState([{ id: 'PS-010', requestId: 'KD-024', lecturer: 'Dr. Rina Kusuma', practitioner: 'Bima Santoso', course: 'Analitik Data Bisnis', lecturerOk: false, practitionerOk: false, expires: '18 Mei 2025, 23.59' }])
  const [attendance, setAttendance] = useState([{ id: 'PRSN-008', classId: 'KLS-099', practitioner: 'Nadia Rahman', course: 'Arsitektur Berkelanjutan', date: '12 Mei 2025', status: 'Terverifikasi' }])
  const [reports, setReports] = useState([{ id: 'LPK-2025-009', classId: 'KLS-099', course: 'Arsitektur Berkelanjutan', practitioner: 'Nadia Rahman', date: '12 Mei 2025', status: 'Final' }])
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Bahan ajar menunggu pemeriksaan', text: 'PPT kolaborasi dari Bima Santoso telah diunggah.', time: '12 menit lalu', read: false },
    { id: 2, title: 'Konfirmasi pasangan', text: 'Pasangan Analitik Data Bisnis menunggu konfirmasi.', time: '1 jam lalu', read: false },
    { id: 3, title: 'Jadwal mengajar diterbitkan', text: 'Jadwal kelas pada 22 Mei 2025 telah tersedia.', time: 'Kemarin', read: true },
  ])

  const flash = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 2800) }
  const nav = (p: string) => { setPage(p); setMobileOpen(false); setNoticeOpen(false) }

  const context = { role, page, setPage: nav, modal, setModal, flash, requests, setRequests, practitioners, setPractitioners, documents, setDocuments, matches, setMatches, attendance, setAttendance, reports, setReports, notifications, setNotifications }

  return <div className="app-shell">
    <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
      <div className="brand"><div className="brand-mark"><span /><span /><span /></div><div><strong>PIJAR</strong><small>Praktisi Mengajar</small></div><button className="mobile-close" onClick={() => setMobileOpen(false)}>×</button></div>
      <div className="role-chip"><span className="avatar">{roles[role].short}</span><div><small>Masuk sebagai</small><strong>{roleLabel(role)}</strong></div></div>
      <nav><p className="nav-label">MENU UTAMA</p>{roles[role].menu.map(item => <button key={item} className={page === item ? 'active' : ''} onClick={() => nav(item)}><Icon name={item}/><span>{item}</span>{item === 'Notifikasi' && notifications.some(n => !n.read) && <em>{notifications.filter(n => !n.read).length}</em>}</button>)}</nav>
      <div className="sidebar-foot"><button onClick={() => nav('Pusat Bantuan')}><span className="help">?</span><span><strong>Butuh bantuan?</strong><small>Lihat panduan PIJAR</small></span></button></div>
    </aside>
    {mobileOpen && <div className="sidebar-shade" onClick={() => setMobileOpen(false)} />}

    <main className="main">
      <header className="topbar">
        <button className="menu-toggle" onClick={() => setMobileOpen(true)}><span/><span/><span/></button>
        <div className="title"><p>SISTEM INFORMASI PIJAR</p><h1>{page}</h1></div>
        <div className="top-actions">
          <div className="popover-wrap"><button className="notify-btn" onClick={() => setNoticeOpen(!noticeOpen)} aria-label="Notifikasi"><Icon name="Notifikasi"/>{notifications.some(n => !n.read) && <i />}</button>
            {noticeOpen && <div className="popover notice-pop"><div className="pop-head"><strong>Notifikasi</strong><button onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))}>Tandai dibaca</button></div>{notifications.slice(0,3).map(n => <button key={n.id} className={!n.read ? 'unread' : ''} onClick={() => { setNotifications(notifications.map(x => x.id === n.id ? {...x, read:true} : x)); nav('Notifikasi') }}><i/><span><strong>{n.title}</strong><small>{n.text}</small><em>{n.time}</em></span></button>)}</div>}
          </div>
          <div className="divider" />
          <div className="popover-wrap"><button className="profile-button" onClick={() => setProfileOpen(!profileOpen)}><span className="avatar">{roles[role].short}</span><span><strong>{roles[role].name}</strong><small>{roleLabel(role)}</small></span><b>⌄</b></button>
            {profileOpen && <div className="popover account-pop"><div className="account-summary"><span className="avatar">{roles[role].short}</span><div><strong>{roles[role].name}</strong><small>{demoAccounts.find(account => account.role === role)?.email}</small></div></div><button onClick={onLogout}><Icon name="default" size={17}/><span><strong>Keluar dari PIJAR</strong><small>Kembali ke halaman login</small></span></button></div>}
          </div>
        </div>
      </header>
      <div className="content"><Page {...context} /></div>
    </main>
    {toast && <div className="toast"><span>✓</span>{toast}</div>}
  </div>
}

function Page(props: any) {
  const p = props.page
  if (p === 'Dashboard') return <Dashboard {...props} />
  if (['Kebutuhan Dosen', 'Pengajuan Kebutuhan Praktisi', 'Riwayat Pengajuan', 'Semua Pengajuan'].includes(p)) return <RequestsPage {...props} />
  if (['Pengajuan Praktisi', 'Data Praktisi'].includes(p)) return <PractitionersPage {...props} />
  if (p === 'Pencocokan Praktisi' || p === 'Rekomendasi Praktisi') return <MatchingPage {...props} />
  if (p === 'Konfirmasi Pasangan' || p === 'Undangan Mengajar') return <ConfirmPage {...props} />
  if (p === 'Monitoring Bahan Ajar' || p === 'Bahan Ajar') return <MaterialsPage {...props} />
  if (p === 'Jadwal Mengajar') return <SchedulesPage {...props} />
  if (p === 'Presensi Praktisi' || p === 'Presensi') return <AttendancePage {...props} />
  if (p === 'Laporan Pelaksanaan Kelas' || p === 'Riwayat Mengajar') return <ReportsPage {...props} />
  if (p === 'Notifikasi') return <NotificationsPage {...props} />
  if (p === 'Laporan & Statistik') return <StatisticsPage {...props} />
  if (p.includes('Profil')) return <ProfilePage {...props} />
  if (p === 'Koordinasi Perkuliahan') return <CoordinationPage {...props} />
  if (p === 'Manajemen Pengguna') return <UsersPage {...props} />
  if (p === 'Pengaturan Sistem') return <SettingsPage {...props} />
  return <EmptyPage {...props} />
}

function PageIntro({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="page-intro"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><span>{description}</span></div>{action}</div>
}

function Dashboard({ role, setPage, requests, practitioners, documents, matches }: any) {
  const isAdmin = role === 'Admin PIJAR'
  const partner = role.includes('Admin ') && !isAdmin
  const stats = isAdmin ? [
    ['Kebutuhan Praktisi', requests.length, '+2 bulan ini'], ['Pengajuan Praktisi', practitioners.length, '2 sumber mitra'], ['Menunggu Verifikasi', 3, 'Perlu ditinjau'], ['Menunggu Konfirmasi', 1, '1 pasangan aktif'],
    ['Pasangan Disetujui', 12, '+3 periode ini'], ['Kelas Akan Berlangsung', 2, '7 hari ke depan'], ['Bahan Belum Lengkap', documents.filter((d:any)=>d.status!=='Disetujui').length, 'Perlu tindak lanjut'],
  ] : partner ? [
    ['Praktisi Diajukan', practitioners.filter((x:any)=>x.source.includes(role.includes('Summarecon') ? 'Summarecon' : 'Mitra')).length, 'Periode berjalan'], ['Menunggu Verifikasi', 1, 'Oleh Admin Kerma'], ['Disetujui', 3, 'Siap dicocokkan'], ['Perlu Revisi', 1, 'Lengkapi data'],
  ] : role === 'Dosen/Kaprodi' ? [
    ['Pengajuan Aktif', 2, 'Semester genap'], ['Rekomendasi Praktisi', 1, 'Perlu konfirmasi'], ['Jadwal Mendatang', 1, '22 Mei 2025'], ['Bahan Ajar', '2/3', 'Dokumen disetujui'],
  ] : [
    ['Undangan Aktif', 1, 'Perlu konfirmasi'], ['Jadwal Mendatang', 2, '7 hari ke depan'], ['Bahan Ajar', '1/2', 'Perlu revisi'], ['Jam Mengajar', 18, 'Total semester ini'],
  ]
  return <>
    <div className="welcome">
      <div><p className="eyebrow">{isAdmin ? 'PUSAT KENDALI PROGRAM' : 'RUANG KERJA ANDA'}</p><h2>Selamat datang, {roles[role as Role].name.split(' ')[0]}</h2><span>{isAdmin ? 'Pantau seluruh proses Praktisi Mengajar dalam satu tempat.' : `Berikut ringkasan aktivitas Anda sebagai ${roleLabel(role)}.`}</span></div>
      <div className="date-box"><Icon name="Jadwal"/><span><small>Hari ini</small><strong>Rabu, 14 Mei 2025</strong></span></div>
    </div>
    <div className={`stats-grid ${stats.length > 4 ? 'admin-stats' : ''}`}>{stats.map((s:any,i:number)=><StatCard key={s[0]} label={s[0]} value={s[1]} note={s[2]} accent={i===0}/>)}</div>
    <div className="dashboard-grid">
      <section className="card chart-card"><div className="card-head"><div><p className="eyebrow">PERKEMBANGAN PROGRAM</p><h3>Pengajuan & Pelaksanaan</h3></div><select><option>6 bulan terakhir</option><option>Tahun ini</option></select></div>
        <div className="chart-legend"><span><i className="green"/>Pengajuan</span><span><i className="orange"/>Kelas terlaksana</span></div>
        <div className="bar-chart">{[['Des',35,20],['Jan',52,31],['Feb',46,38],['Mar',70,48],['Apr',63,54],['Mei',82,62]].map(x=><div className="bar-group" key={x[0]}><div className="bars"><i style={{height:`${x[1]}%`}}/><i style={{height:`${x[2]}%`}}/></div><span>{x[0]}</span></div>)}</div>
      </section>
      <section className="card activity-card"><div className="card-head"><div><p className="eyebrow">TERBARU</p><h3>Aktivitas Terkini</h3></div><button onClick={()=>setPage('Notifikasi')}>Lihat semua</button></div>
        {[['Bahan ajar diunggah','Bima mengunggah PPT kolaborasi','12 menit'],['Pasangan direkomendasikan','Analitik Data Bisnis · 94% cocok','1 jam'],['Pengajuan disetujui','Kebutuhan Manajemen Proyek','Kemarin']].map((x,i)=><div className="activity" key={x[0]}><span className={`activity-icon a${i}`}><Icon name={i===0?'Bahan':'Pengajuan'}/></span><div><strong>{x[0]}</strong><small>{x[1]}</small></div><time>{x[2]}</time></div>)}
      </section>
    </div>
    <section className="card quick"><div className="card-head"><div><p className="eyebrow">AKSES CEPAT</p><h3>Tindakan yang perlu dilakukan</h3></div></div>
      <div className="quick-grid">{(isAdmin ? [['Pencocokan Praktisi','1 kebutuhan siap dicocokkan'],['Monitoring Bahan Ajar','2 dokumen perlu ditinjau'],['Konfirmasi Pasangan','1 pasangan menunggu'],['Presensi Praktisi','1 presensi siap diverifikasi']] : role==='Dosen/Kaprodi' ? [['Konfirmasi Pasangan','Tinjau rekomendasi Bima Santoso'],['Monitoring Bahan Ajar','Lengkapi Silabus perkuliahan'],['Jadwal Mengajar','Lihat jadwal 22 Mei 2025']] : partner ? [['Pengajuan Praktisi','Ajukan praktisi baru'],['Data Praktisi','Perbarui profil praktisi'],['Riwayat Pengajuan','Pantau status verifikasi']] : [['Konfirmasi Pasangan','Konfirmasi undangan mengajar'],['Bahan Ajar','Revisi RPS Mini'],['Jadwal Mengajar','Lihat jadwal berikutnya']]).map((x,i)=><button key={x[0]} onClick={()=>setPage(x[0])}><span><Icon name={x[0]}/></span><div><strong>{x[0]}</strong><small>{x[1]}</small></div><b>→</b></button>)}</div>
    </section>
  </>
}

function RequestsPage({ role, page, requests, setRequests, setModal, modal, flash }: any) {
  const [search,setSearch]=useState(''); const [filter,setFilter]=useState(''); const [pg,setPg]=useState(1)
  const visibleRequests=role==='Dosen/Kaprodi'?requests.filter((r:any)=>r.lecturer==='Dr. Rina Kusuma'):requests
  const rows=visibleRequests.filter((r:any)=>(r.course+r.lecturer+r.id).toLowerCase().includes(search.toLowerCase())&&(!filter||r.status===filter))
  const canAdd=role==='Dosen/Kaprodi'
  const submit=(e:FormEvent<HTMLFormElement>)=>{e.preventDefault();const f=new FormData(e.currentTarget);const data={id:`KD-${String(25+requests.length).padStart(3,'0')}`,course:f.get('course'),program:f.get('program'),lecturer:f.get('lecturer'),expertise:f.get('expertise'),meetings:Number(f.get('meetings')),schedule:f.get('schedule'),description:f.get('description'),status:f.get('draft')?'Draft':'Menunggu verifikasi'};setRequests([data,...requests]);setModal(null);flash('Pengajuan kebutuhan berhasil disimpan')}
  return <>
    <PageIntro eyebrow="KEBUTUHAN PRAKTISI" title={page} description="Kelola kebutuhan praktisi berdasarkan mata kuliah dan kompetensi." action={canAdd&&<Button onClick={()=>setModal({type:'request'})}>＋ Buat Pengajuan</Button>}/>
    <section className="card table-card"><DataToolbar search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} options={['Draft','Menunggu verifikasi','Disetujui','Perlu revisi','Dalam proses pencocokan','Selesai']}/>
      <div className="table-scroll"><table><thead><tr><th>ID PENGAJUAN</th><th>MATA KULIAH</th><th>PROGRAM STUDI</th><th>DOSEN</th><th>PERTEMUAN</th><th>STATUS</th><th>AKSI</th></tr></thead><tbody>{rows.map((r:any)=><tr key={r.id}><td><strong>{r.id}</strong><small>{r.schedule}</small></td><td><strong>{r.course}</strong><small>{r.expertise}</small></td><td>{r.program}</td><td>{r.lecturer}</td><td>{r.meetings} kali</td><td><Badge>{r.status}</Badge></td><td><button className="table-action" onClick={()=>setModal({type:'requestDetail',data:r})}>Lihat detail</button></td></tr>)}</tbody></table></div>
      <div className="pagination"><span>Menampilkan {rows.length} dari {visibleRequests.length} data</span><div><button disabled={pg===1} onClick={()=>setPg(1)}>‹</button><button className="active">1</button>{role!=='Dosen/Kaprodi'&&<button onClick={()=>setPg(2)}>2</button>}<button onClick={()=>setPg(2)}>›</button></div></div>
    </section>
    {modal?.type==='request'&&<Modal title="Pengajuan Kebutuhan Praktisi" onClose={()=>setModal(null)} wide><form onSubmit={submit}><div className="form-grid"><Field label="Nama mata kuliah" name="course"/><Field label="Program studi" name="program"/><Field label="Nama dosen pengampu" name="lecturer"/><Field label="Bidang keahlian praktisi" name="expertise"/><Field label="Kompetensi yang diharapkan"><textarea name="competency" required/></Field><Field label="Jumlah pertemuan"><input name="meetings" type="number" min="1" defaultValue="2" required/></Field><Field label="Perkiraan jadwal" name="schedule"/><Field label="Deskripsi kebutuhan"><textarea name="description" required/></Field><Field label="Catatan tambahan" required={false}><textarea name="notes"/></Field></div><div className="modal-actions"><Button variant="secondary" onClick={()=>setModal(null)}>Batal</Button><Button variant="secondary" type="submit" onClick={()=>{const el=document.createElement('input');el.type='hidden';el.name='draft';el.value='1';document.querySelector('.modal form')?.appendChild(el)}}>Simpan Draft</Button><Button type="submit">Kirim Pengajuan</Button></div></form></Modal>}
    {modal?.type==='requestDetail'&&<Modal title={`Detail ${modal.data.id}`} onClose={()=>setModal(null)}><DetailList items={[['Mata kuliah',modal.data.course],['Program studi',modal.data.program],['Dosen pengampu',modal.data.lecturer],['Keahlian dibutuhkan',modal.data.expertise],['Jumlah pertemuan',`${modal.data.meetings} kali`],['Perkiraan jadwal',modal.data.schedule],['Deskripsi',modal.data.description],['Status',<Badge>{modal.data.status}</Badge>]]}/><div className="modal-actions"><Button variant="secondary" onClick={()=>setModal(null)}>Tutup</Button>{role==='Admin PIJAR'&&<Button onClick={()=>{setRequests(requests.map((r:any)=>r.id===modal.data.id?{...r,status:'Disetujui'}:r));setModal(null);flash('Pengajuan disetujui')}}>Setujui</Button>}</div></Modal>}
  </>
}

function DetailList({items}:{items:any[]}){
  return <div className="detail-list">{items.map((x:any)=><div key={x[0]}><span>{x[0]}</span><strong>{x[1]}</strong></div>)}</div>
}

function PractitionersPage({ role, page, practitioners, setPractitioners, setModal, modal, flash }: any){
  const [search,setSearch]=useState('');const[filter,setFilter]=useState('')
  const source=role==='Admin Summarecon Mengajar'?'Summarecon Mengajar':role==='Admin Mitra Kerja Sama'?'Mitra Kerja Sama':''
  const rows=practitioners.filter((p:any)=>(!source||p.source===source)&&(p.name+p.expertise+p.company).toLowerCase().includes(search.toLowerCase())&&(!filter||p.status===filter))
  const submit=(e:FormEvent<HTMLFormElement>)=>{e.preventDefault();const f=new FormData(e.currentTarget);setPractitioners([{id:`PR-${20+practitioners.length}`,name:f.get('name'),company:f.get('company'),position:f.get('position'),expertise:f.get('expertise'),experience:f.get('experience'),source:source||String(f.get('source')),score:75,status:'Menunggu verifikasi',email:f.get('email')},...practitioners]);setModal(null);flash('Data praktisi berhasil diajukan')}
  return <><PageIntro eyebrow="TALENTA INDUSTRI" title={page} description="Kelola profil dan status verifikasi praktisi dari mitra program." action={role!=='Admin PIJAR'&&<Button onClick={()=>setModal({type:'practitioner'})}>＋ Ajukan Praktisi</Button>}/>
    <section className="card table-card"><DataToolbar search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} options={['Terverifikasi','Menunggu verifikasi','Perlu revisi']}/>
    <div className="table-scroll"><table><thead><tr><th>PRAKTISI</th><th>INSTITUSI & JABATAN</th><th>KEAHLIAN</th><th>ASAL PENGAJUAN</th><th>STATUS</th><th>AKSI</th></tr></thead><tbody>{rows.map((p:any)=><tr key={p.id}><td><div className="person"><span className="avatar">{p.name.split(' ').map((x:string)=>x[0]).join('').slice(0,2)}</span><span><strong>{p.name}</strong><small>{p.id} · {p.email}</small></span></div></td><td><strong>{p.company}</strong><small>{p.position} · {p.experience}</small></td><td>{p.expertise}</td><td><span className="source-tag">{p.source}</span></td><td><Badge>{p.status}</Badge></td><td><button className="table-action" onClick={()=>setModal({type:'practitionerDetail',data:p})}>Detail</button></td></tr>)}</tbody></table></div><div className="pagination"><span>{rows.length} data praktisi</span><div><button className="active">1</button></div></div></section>
    {modal?.type==='practitioner'&&<Modal title="Ajukan Praktisi Baru" onClose={()=>setModal(null)} wide><form onSubmit={submit}><div className="form-grid"><Field label="Nama lengkap" name="name"/><Field label="Perusahaan atau institusi" name="company"/><Field label="Jabatan" name="position"/><Field label="Bidang keahlian" name="expertise"/><Field label="Kompetensi"><textarea name="competency" required/></Field><Field label="Pengalaman kerja" name="experience"/><Field label="Pendidikan terakhir" name="education"/><Field label="Email"><input name="email" type="email" required/></Field><Field label="Nomor telepon" name="phone"/><Field label="CV atau portofolio"><input name="file" type="file" required/></Field><Field label="Deskripsi singkat"><textarea name="description" required/></Field>{!source&&<Field label="Asal pengajuan"><select name="source"><option>Mitra Kerja Sama</option><option>Summarecon Mengajar</option></select></Field>}</div><div className="modal-actions"><Button variant="secondary" onClick={()=>setModal(null)}>Batal</Button><Button type="submit">Kirim Pengajuan</Button></div></form></Modal>}
    {modal?.type==='practitionerDetail'&&<Modal title="Profil Praktisi" onClose={()=>setModal(null)}><div className="profile-hero"><span className="big-avatar">{modal.data.name.split(' ').map((x:string)=>x[0]).join('').slice(0,2)}</span><div><h3>{modal.data.name}</h3><p>{modal.data.position} · {modal.data.company}</p><Badge>{modal.data.status}</Badge></div></div><DetailList items={[['Bidang keahlian',modal.data.expertise],['Pengalaman',modal.data.experience],['Email',modal.data.email],['Asal pengajuan',modal.data.source]]}/>{role==='Admin PIJAR'&&modal.data.status!=='Terverifikasi'&&<div className="modal-actions"><Button variant="secondary" onClick={()=>{setPractitioners(practitioners.map((p:any)=>p.id===modal.data.id?{...p,status:'Perlu revisi'}:p));setModal(null);flash('Permintaan revisi dikirim')}}>Minta Revisi</Button><Button onClick={()=>{setPractitioners(practitioners.map((p:any)=>p.id===modal.data.id?{...p,status:'Terverifikasi'}:p));setModal(null);flash('Praktisi berhasil diverifikasi')}}>Verifikasi</Button></div>}</Modal>}
  </>
}

function MatchingPage({ role, requests, practitioners, matches, setMatches, setModal, modal, flash }:any){
  const [selectedRequest,setSelectedRequest]=useState(requests[0].id); const [selected,setSelected]=useState('')
  const req=requests.find((r:any)=>r.id===selectedRequest)||requests[0]
  const candidates=practitioners.filter((p:any)=>p.status==='Terverifikasi')
  if(role!=='Admin PIJAR') return <ConfirmPage role={role} matches={matches} setMatches={setMatches} setModal={setModal} modal={modal} flash={flash}/>
  return <><PageIntro eyebrow="REKOMENDASI BERBASIS KESESUAIAN" title="Pencocokan Praktisi" description="Bandingkan kompetensi praktisi terverifikasi dengan kebutuhan dosen."/>
    <div className="match-layout"><section className="card need-panel"><p className="eyebrow">PILIH KEBUTUHAN DOSEN</p><select value={selectedRequest} onChange={e=>setSelectedRequest(e.target.value)}>{requests.filter((r:any)=>r.status!=='Selesai').map((r:any)=><option value={r.id} key={r.id}>{r.id} — {r.course}</option>)}</select><div className="need-card"><span className="doc-icon"><Icon name="Pengajuan"/></span><h3>{req.course}</h3><p>{req.program}</p><DetailList items={[['Dosen',req.lecturer],['Keahlian',req.expertise],['Pertemuan',`${req.meetings} kali`],['Jadwal',req.schedule]]}/></div><Button variant="secondary" onClick={()=>setModal({type:'requestDetail',data:req})}>Lihat Detail Kebutuhan</Button></section>
    <section className="candidate-panel"><div className="candidate-head"><div><p className="eyebrow">CALON PRAKTISI</p><h3>{candidates.length} kandidat terverifikasi</h3></div><span>Diurutkan berdasarkan kecocokan</span></div>{candidates.map((p:any,i:number)=>{const score=p.expertise.includes('Data')&&req.expertise.includes('Data')?p.score:Math.max(68,p.score-14);return <div className={`card candidate ${selected===p.id?'selected':''}`} key={p.id}><button className="select-circle" onClick={()=>setSelected(p.id)}>{selected===p.id?'✓':''}</button><span className="big-avatar">{p.name.split(' ').map((x:string)=>x[0]).join('').slice(0,2)}</span><div className="candidate-info"><div><h3>{p.name}</h3>{i===0&&<em>REKOMENDASI UTAMA</em>}</div><p>{p.position} · {p.company}</p><div className="tags"><span>{p.expertise}</span><span>{p.experience}</span></div></div><div className="match-score"><div style={{'--score':`${score*3.6}deg`} as any}><strong>{score}%</strong></div><small>Tingkat kecocokan</small></div><Button variant="secondary" onClick={()=>setModal({type:'practitionerDetail',data:p})}>Lihat Detail</Button></div>})}
    <div className="match-actions"><Button variant="ghost" onClick={()=>{setSelected('');flash('Pencocokan dibatalkan')}}>Batalkan Pencocokan</Button><Button disabled={!selected} onClick={()=>{const p=practitioners.find((x:any)=>x.id===selected);setMatches([{id:`PS-${11+matches.length}`,requestId:req.id,lecturer:req.lecturer,practitioner:p.name,course:req.course,lecturerOk:false,practitionerOk:false,expires:'21 Mei 2025, 23.59'},...matches]);flash('Rekomendasi dikirim kepada dosen dan praktisi');setSelected('')}}>Kirim Rekomendasi →</Button></div></section></div>
    {modal?.type==='practitionerDetail'&&<Modal title="Detail Kandidat" onClose={()=>setModal(null)}><div className="profile-hero"><span className="big-avatar">{modal.data.name.split(' ').map((x:string)=>x[0]).join('').slice(0,2)}</span><div><h3>{modal.data.name}</h3><p>{modal.data.position} · {modal.data.company}</p></div></div><DetailList items={[['Keahlian',modal.data.expertise],['Pengalaman',modal.data.experience],['Sumber',modal.data.source],['Kompetensi','Analisis, visualisasi data, strategi, dan studi kasus industri']]}/><div className="modal-actions"><Button onClick={()=>{setSelected(modal.data.id);setModal(null)}}>Pilih Praktisi</Button></div></Modal>}
    {modal?.type==='requestDetail'&&<Modal title={`Detail ${modal.data.id}`} onClose={()=>setModal(null)}><DetailList items={[['Mata kuliah',modal.data.course],['Program studi',modal.data.program],['Dosen pengampu',modal.data.lecturer],['Keahlian dibutuhkan',modal.data.expertise],['Jumlah pertemuan',`${modal.data.meetings} kali`],['Perkiraan jadwal',modal.data.schedule],['Deskripsi',modal.data.description]]}/><div className="modal-actions"><Button onClick={()=>setModal(null)}>Tutup</Button></div></Modal>}
  </>
}

function ConfirmPage({role,matches,setMatches,setModal,modal,flash}:any){
  const update=(m:any,accept:boolean)=>{setMatches(matches.map((x:any)=>x.id===m.id?(!accept?{...x,rejected:true}:role==='Dosen/Kaprodi'?{...x,lecturerOk:true,rejected:false}:{...x,practitionerOk:true,rejected:false}):x));flash(accept?'Konfirmasi berhasil disimpan':'Pasangan telah ditolak')}
  const status=(m:any)=>m.rejected?'Ditolak':m.lecturerOk&&m.practitionerOk?'Disetujui kedua pihak':!m.lecturerOk&&!m.practitionerOk?'Menunggu kedua pihak':!m.lecturerOk?'Menunggu konfirmasi dosen':'Menunggu konfirmasi praktisi'
  return <><PageIntro eyebrow="PERSETUJUAN DUA PIHAK" title={role==='Praktisi'?'Undangan & Konfirmasi Mengajar':'Konfirmasi Pasangan'} description="Pasangan resmi setelah dosen dan praktisi memberikan persetujuan."/>
  <div className="confirm-grid">{matches.map((m:any)=><section className="card confirm-card" key={m.id}><div className="confirm-top"><span>{m.id}</span><Badge>{status(m)}</Badge></div><div className="pair"><div><span className="avatar">DR</span><small>DOSEN</small><strong>{m.lecturer}</strong></div><i>＋</i><div><span className="avatar orange">BS</span><small>PRAKTISI</small><strong>{m.practitioner}</strong></div></div><div className="course-strip"><Icon name="Bahan"/><div><small>MATA KULIAH</small><strong>{m.course}</strong></div></div><div className="confirm-status"><span className={m.lecturerOk?'done':''}>{m.lecturerOk?'✓':'1'} Konfirmasi dosen</span><i/><span className={m.practitionerOk?'done':''}>{m.practitionerOk?'✓':'2'} Konfirmasi praktisi</span></div><p className="expiry">Tautan konfirmasi berlaku sampai <strong>{m.expires}</strong></p><div className="card-actions"><Button variant="secondary" onClick={()=>setModal({type:'pair',data:m})}>Lihat Detail</Button>{role==='Admin PIJAR'?<Button onClick={()=>{navigator.clipboard?.writeText(`https://pijar.demo/konfirmasi/${m.id}`);flash('Tautan konfirmasi unik disalin')}}>Salin Tautan</Button>:!(role==='Dosen/Kaprodi'?m.lecturerOk:m.practitionerOk)&&<><Button variant="danger" onClick={()=>update(m,false)}>Tolak</Button><Button onClick={()=>update(m,true)}>Terima Pasangan</Button></>}</div></section>)}</div>
  {modal?.type==='pair'&&<Modal title="Detail Pasangan Mengajar" onClose={()=>setModal(null)}><DetailList items={[['ID pasangan',modal.data.id],['Mata kuliah',modal.data.course],['Dosen',modal.data.lecturer],['Praktisi',modal.data.practitioner],['Status',<Badge>{status(modal.data)}</Badge>],['Masa berlaku',modal.data.expires],['Verifikasi identitas','Email dan nomor pengguna terverifikasi']]}/><div className="info-box">Tautan ini unik dan hanya dapat digunakan oleh penerima yang identitasnya sesuai.</div></Modal>}
  </>
}

function MaterialsPage({role,documents,setDocuments,setModal,modal,flash}:any){
  const [tab,setTab]=useState(role==='Praktisi'?'Praktisi':'Dosen'); const rows=documents.filter((d:any)=>d.role===tab)
  const upload=(e:FormEvent<HTMLFormElement>)=>{e.preventDefault();const f=new FormData(e.currentTarget);const file=f.get('file') as File;setDocuments([...documents,{id:Date.now(),owner:roles[role as Role].name,role:role==='Praktisi'?'Praktisi':'Dosen',type:f.get('type'),file:file?.name||'dokumen.pdf',uploaded:'Baru saja',status:'Menunggu pemeriksaan',classId:'KLS-101'}]);setModal(null);flash('Dokumen berhasil diunggah')}
  const review=(id:number,status:string)=>{setDocuments(documents.map((d:any)=>d.id===id?{...d,status}:d));setModal(null);flash(status==='Disetujui'?'Dokumen disetujui':'Catatan revisi dikirim')}
  return <><PageIntro eyebrow="KELENGKAPAN PERKULIAHAN" title={role==='Praktisi'?'Bahan Ajar':'Monitoring Bahan Ajar'} description="Dokumen baru dianggap lengkap setelah disetujui Admin Kerma." action={role!=='Admin PIJAR'&&<Button onClick={()=>setModal({type:'upload'})}>↑ Unggah Dokumen</Button>}/>
  <div className="doc-progress card"><div><span>Progres kelengkapan kelas KLS-101</span><strong>{documents.filter((d:any)=>d.classId==='KLS-101'&&d.status==='Disetujui').length} dari 5 dokumen disetujui</strong></div><div className="progress"><i style={{width:`${documents.filter((d:any)=>d.classId==='KLS-101'&&d.status==='Disetujui').length/5*100}%`}}/></div><Badge>{documents.filter((d:any)=>d.classId==='KLS-101'&&d.status==='Disetujui').length===5?'Lengkap':'Belum lengkap'}</Badge></div>
  <section className="card table-card"><div className="tabs"><button className={tab==='Dosen'?'active':''} onClick={()=>setTab('Dosen')}>Dokumen Dosen <span>3 wajib</span></button><button className={tab==='Praktisi'?'active':''} onClick={()=>setTab('Praktisi')}>Dokumen Praktisi <span>2 wajib</span></button></div><div className="table-scroll"><table><thead><tr><th>DOKUMEN</th><th>PENGUNGGAH</th><th>WAKTU UNGGAH</th><th>STATUS</th><th>AKSI</th></tr></thead><tbody>{rows.map((d:any)=><tr key={d.id}><td><div className="file"><span><Icon name="Bahan"/></span><div><strong>{d.type}</strong><small>{d.file}</small></div></div></td><td>{d.owner}</td><td>{d.uploaded}</td><td><Badge>{d.status}</Badge></td><td><div className="row-actions"><button onClick={()=>setModal({type:'preview',data:d})}>Pratinjau</button>{role==='Admin PIJAR'&&d.status!=='Disetujui'&&<><button onClick={()=>setModal({type:'revision',data:d})}>Revisi</button><button onClick={()=>review(d.id,'Disetujui')}>Setujui</button></>}</div></td></tr>)}</tbody></table></div></section>
  {modal?.type==='upload'&&<Modal title="Unggah Bahan Ajar" onClose={()=>setModal(null)}><form onSubmit={upload}><Field label="Jenis dokumen"><select name="type">{role==='Praktisi'?<><option>PPT Disesuaikan</option><option>RPS Mini</option></>:<><option>PPT</option><option>RPS</option><option>Silabus</option></>}</select></Field><Field label="Pilih berkas"><input type="file" name="file" required/></Field><div className="info-box">Format PDF atau PPTX, ukuran maksimal 20 MB.</div><div className="modal-actions"><Button variant="secondary" onClick={()=>setModal(null)}>Batal</Button><Button type="submit">Unggah Dokumen</Button></div></form></Modal>}
  {modal?.type==='preview'&&<Modal title={`Pratinjau ${modal.data.type}`} onClose={()=>setModal(null)}><div className="document-preview"><div className="fake-slide"><p>PIJAR · PRAKTISI MENGAJAR</p><h2>{modal.data.type}</h2><span>Analitik Data Bisnis</span><small>{modal.data.owner}</small></div></div><DetailList items={[['Nama berkas',modal.data.file],['Diunggah',modal.data.uploaded],['Status',<Badge>{modal.data.status}</Badge>]]}/></Modal>}
  {modal?.type==='revision'&&<Modal title="Minta Revisi Dokumen" onClose={()=>setModal(null)}><Field label="Catatan revisi"><textarea id="revision-note" placeholder="Jelaskan bagian yang perlu diperbaiki..." required/></Field><div className="modal-actions"><Button variant="secondary" onClick={()=>setModal(null)}>Batal</Button><Button onClick={()=>review(modal.data.id,'Perlu revisi')}>Kirim Catatan</Button></div></Modal>}
  </>
}

function SchedulesPage({role,setModal,modal}:any){
  const[view,setView]=useState('Tabel')
  const visibleSchedules=role==='Dosen/Kaprodi'?schedules.filter(s=>s.lecturer==='Dr. Rina Kusuma'):role==='Praktisi'?schedules.filter(s=>s.practitioner==='Bima Santoso'):schedules
  return <><PageIntro eyebrow="AGENDA PERKULIAHAN" title="Jadwal Mengajar" description="Pantau waktu, lokasi, dan status kelas Praktisi Mengajar." action={<div className="segmented"><button className={view==='Tabel'?'active':''} onClick={()=>setView('Tabel')}>Tabel</button><button className={view==='Kalender'?'active':''} onClick={()=>setView('Kalender')}>Kalender</button></div>}/>
  {view==='Tabel'?<section className="card table-card"><div className="table-scroll"><table><thead><tr><th>TANGGAL & WAKTU</th><th>MATA KULIAH</th><th>PRAKTISI</th><th>DOSEN</th><th>LOKASI / MEDIA</th><th>STATUS</th><th></th></tr></thead><tbody>{visibleSchedules.map(s=><tr key={s.id}><td><strong>{s.date}</strong><small>{s.time}</small></td><td><strong>{s.course}</strong><small>{s.program}</small></td><td>{s.practitioner}</td><td>{s.lecturer}</td><td>{s.location}</td><td><Badge>{s.status}</Badge></td><td><button className="table-action" onClick={()=>setModal({type:'schedule',data:s})}>Detail</button></td></tr>)}</tbody></table></div></section>:<Calendar setModal={setModal} events={visibleSchedules}/>}
  {modal?.type==='schedule'&&<Modal title="Detail Jadwal Mengajar" onClose={()=>setModal(null)}><div className="schedule-date"><span>{modal.data.day}</span><div><small>MEI 2025</small><strong>{modal.data.time}</strong></div></div><DetailList items={[['Mata kuliah',modal.data.course],['Program studi',modal.data.program],['Praktisi',modal.data.practitioner],['Dosen',modal.data.lecturer],['Lokasi / media',modal.data.location],['Status',<Badge>{modal.data.status}</Badge>]]}/></Modal>}</>
}

function Calendar({setModal,events}:any){
  const months=[{name:'April 2025',days:30,blanks:1},{name:'Mei 2025',days:31,blanks:3},{name:'Juni 2025',days:30,blanks:6}]
  const[index,setIndex]=useState(1);const month=months[index]
  return <section className="card calendar"><div className="calendar-head"><button disabled={index===0} onClick={()=>setIndex(index-1)}>‹</button><h3>{month.name}</h3><button disabled={index===months.length-1} onClick={()=>setIndex(index+1)}>›</button></div><div className="weekdays">{['Sen','Sel','Rab','Kam','Jum','Sab','Min'].map(x=><span key={x}>{x}</span>)}</div><div className="days">{Array.from({length:month.blanks}).map((_,i)=><span key={`b${i}`}/>) }{Array.from({length:month.days}).map((_,i)=>{const day=i+1;const event=index===1?events.find((s:any)=>s.day===day):undefined;return <button key={day} className={`${index===1&&day===14?'today':''} ${event?'event':''}`} onClick={()=>event&&setModal({type:'schedule',data:event})}><b>{day}</b>{event&&<small>{event.time.split('–')[0]} {event.course}</small>}</button>})}</div></section>
}

function AttendancePage({role,documents,attendance,setAttendance,setModal,modal,flash}:any){
  const complete101=documents.filter((d:any)=>d.classId==='KLS-101'&&d.status==='Disetujui').length>=5
  const create=(e:FormEvent<HTMLFormElement>)=>{e.preventDefault();setAttendance([...attendance,{id:`PRSN-0${attendance.length+9}`,classId:'KLS-101',practitioner:'Bima Santoso',course:'Analitik Data Bisnis',date:'22 Mei 2025',status:'Menunggu verifikasi'}]);setModal(null);flash('Presensi berhasil dikirim')}
  return <><PageIntro eyebrow="BUKTI KEHADIRAN" title={role==='Praktisi'?'Presensi':'Presensi Praktisi'} description="Presensi hanya tersedia setelah seluruh bahan ajar wajib disetujui."/>
  {!complete101&&<div className="lock-banner"><span><Icon name="Bahan"/></span><div><strong>Presensi KLS-101 masih terkunci</strong><p>{5-documents.filter((d:any)=>d.classId==='KLS-101'&&d.status==='Disetujui').length} dokumen bahan ajar belum disetujui Admin Kerma.</p></div><Button variant="secondary" onClick={()=>flash('Buka halaman Bahan Ajar untuk melengkapi dokumen')}>Lihat Persyaratan</Button></div>}
  <section className="card table-card"><div className="table-scroll"><table><thead><tr><th>ID PRESENSI</th><th>KELAS</th><th>PRAKTISI</th><th>TANGGAL</th><th>STATUS</th><th>AKSI</th></tr></thead><tbody><tr><td><strong>PRSN-010</strong></td><td><strong>Analitik Data Bisnis</strong><small>KLS-101</small></td><td>Bima Santoso</td><td>22 Mei 2025</td><td><Badge>{complete101?'Tersedia':'Belum tersedia'}</Badge></td><td><Button disabled={!complete101} variant="secondary" onClick={()=>setModal({type:'attendance'})}>Isi Presensi</Button></td></tr>{attendance.map((a:any)=><tr key={a.id}><td><strong>{a.id}</strong></td><td><strong>{a.course}</strong><small>{a.classId}</small></td><td>{a.practitioner}</td><td>{a.date}</td><td><Badge>{a.status}</Badge></td><td>{role==='Admin PIJAR'&&a.status==='Menunggu verifikasi'?<Button onClick={()=>{setAttendance(attendance.map((x:any)=>x.id===a.id?{...x,status:'Terverifikasi'}:x));flash('Presensi terverifikasi')}}>Verifikasi</Button>:<button className="table-action" onClick={()=>setModal({type:'attendanceDetail',data:a})}>Lihat</button>}</td></tr>)}</tbody></table></div></section>
  {modal?.type==='attendance'&&<Modal title="Formulir Presensi Praktisi" onClose={()=>setModal(null)}><form onSubmit={create}><DetailList items={[['Praktisi','Bima Santoso'],['Kelas','Analitik Data Bisnis · KLS-101']]}/><Field label="Tanggal mengajar"><input type="date" defaultValue="2025-05-22" required/></Field><div className="form-grid"><Field label="Jam mulai"><input type="time" defaultValue="09:00" required/></Field><Field label="Jam selesai"><input type="time" defaultValue="11:30" required/></Field></div><Field label="Status kehadiran"><select><option>Hadir</option><option>Izin</option><option>Tidak hadir</option></select></Field><Field label="Bukti atau dokumentasi"><input type="file" required/></Field><div className="modal-actions"><Button variant="secondary" onClick={()=>setModal(null)}>Batal</Button><Button type="submit">Kirim Presensi</Button></div></form></Modal>}
  {modal?.type==='attendanceDetail'&&<Modal title={modal.data.id} onClose={()=>setModal(null)}><DetailList items={[['Kelas',modal.data.course],['Praktisi',modal.data.practitioner],['Tanggal',modal.data.date],['Status kehadiran','Hadir'],['Verifikasi',<Badge>{modal.data.status}</Badge>]]}/></Modal>}</>
}

function ReportsPage({role,reports,setReports,setModal,modal,flash}:any){
  const create=(e:FormEvent<HTMLFormElement>)=>{e.preventDefault();const f=new FormData(e.currentTarget);setReports([...reports,{id:String(f.get('number')),classId:'KLS-099',course:'Arsitektur Berkelanjutan',practitioner:'Nadia Rahman',date:'12 Mei 2025',status:'Draft'}]);setModal(null);flash('Draft laporan berhasil disimpan')}
  return <><PageIntro eyebrow="DOKUMENTASI PELAKSANAAN" title={role==='Praktisi'?'Riwayat Mengajar':'Laporan Pelaksanaan Kelas'} description="Laporan terhubung dengan kelas dan presensi praktisi yang sama." action={role==='Admin PIJAR'&&<Button onClick={()=>setModal({type:'reportForm'})}>＋ Buat Laporan</Button>}/>
  <div className="report-grid">{reports.map((r:any)=><section className="card report-card" key={r.id}><div className="report-cover"><span>PIJAR</span><Icon name="Bahan" size={28}/></div><div className="report-body"><div><Badge>{r.status}</Badge><small>{r.id}</small></div><h3>{r.course}</h3><p>{r.practitioner} · {r.date}</p><div className="linked"><span>✓ Presensi {r.classId} terhubung</span></div><div className="card-actions"><Button variant="secondary" onClick={()=>setModal({type:'reportDetail',data:r})}>Lihat Detail</Button>{role==='Admin PIJAR'&&r.status==='Draft'&&<Button onClick={()=>{setReports(reports.map((x:any)=>x.id===r.id?{...x,status:'Final'}:x));flash('Laporan telah difinalisasi')}}>Finalisasi</Button>}</div></div></section>)}</div>
  {modal?.type==='reportForm'&&<Modal title="Buat Laporan PIJAR" onClose={()=>setModal(null)} wide><form onSubmit={create}><div className="form-grid"><Field label="Nomor laporan"><input name="number" defaultValue={`LPK-2025-0${reports.length+10}`} required/></Field><Field label="Nama program"><input defaultValue="Praktisi Mengajar PIJAR" required/></Field><Field label="Kelas"><select><option>KLS-099 — Arsitektur Berkelanjutan</option></select></Field><Field label="Program studi"><input defaultValue="S1 Arsitektur" required/></Field><Field label="Nama dosen"><input defaultValue="Fajar Nugraha, M.Ars." required/></Field><Field label="Nama praktisi"><input defaultValue="Nadia Rahman" required/></Field><Field label="Asal institusi"><input defaultValue="EcoBuild Indonesia" required/></Field><Field label="Tanggal pelaksanaan"><input type="date" defaultValue="2025-05-12" required/></Field><Field label="Waktu mulai & selesai"><input defaultValue="10.00–12.00" required/></Field><Field label="Durasi kegiatan"><input defaultValue="120 menit" required/></Field><Field label="Materi yang disampaikan"><textarea required defaultValue="Penerapan prinsip green building pada proyek nyata."/></Field><Field label="Ringkasan pelaksanaan"><textarea required/></Field><Field label="Hasil atau capaian"><textarea required/></Field><Field label="Kendala pelaksanaan"><textarea required/></Field><Field label="Dokumentasi foto"><input type="file" required/></Field><Field label="Formulir presensi"><select><option>PRSN-008 · Terverifikasi</option></select></Field></div><div className="modal-actions"><Button variant="secondary" onClick={()=>setModal(null)}>Batal</Button><Button type="submit">Simpan sebagai Draft</Button></div></form></Modal>}
  {modal?.type==='reportDetail'&&<Modal title={modal.data.id} onClose={()=>setModal(null)} wide><div className="report-detail-head"><div><p className="eyebrow">LAPORAN PELAKSANAAN KELAS</p><h2>{modal.data.course}</h2><span>{modal.data.date}</span></div><Badge>{modal.data.status}</Badge></div><DetailList items={[['Program','Praktisi Mengajar PIJAR'],['Program studi','S1 Arsitektur'],['Dosen','Fajar Nugraha, M.Ars.'],['Praktisi',modal.data.practitioner],['Institusi','EcoBuild Indonesia'],['Waktu & durasi','10.00–12.00 · 120 menit'],['Materi','Penerapan prinsip green building pada proyek nyata.'],['Capaian','Mahasiswa mampu mengevaluasi strategi desain berkelanjutan.'],['Presensi','PRSN-008 · Terverifikasi']]}/><div className="modal-actions"><Button variant="secondary" onClick={()=>window.print()}>Cetak / Unduh</Button><Button onClick={()=>setModal(null)}>Selesai</Button></div></Modal>}</>
}

function NotificationsPage({notifications,setNotifications}:any){return <><PageIntro eyebrow="PUSAT INFORMASI" title="Notifikasi" description="Seluruh pembaruan aktivitas program PIJAR." action={<Button variant="secondary" onClick={()=>setNotifications(notifications.map((n:any)=>({...n,read:true})))}>Tandai semua dibaca</Button>}/><section className="card notification-list">{notifications.map((n:any)=><button key={n.id} className={!n.read?'unread':''} onClick={()=>setNotifications(notifications.map((x:any)=>x.id===n.id?{...x,read:true}:x))}><span className="notice-icon"><Icon name="Notifikasi"/></span><div><strong>{n.title}</strong><p>{n.text}</p><small>{n.time}</small></div>{!n.read&&<i/>}</button>)}</section></>}

function StatisticsPage({requests,practitioners}:any){return <><PageIntro eyebrow="RINGKASAN KINERJA" title="Laporan & Statistik" description="Analisis performa pelaksanaan program Praktisi Mengajar." action={<Button variant="secondary" onClick={()=>window.print()}>Unduh Ringkasan</Button>}/><div className="stats-grid"><StatCard label="Tingkat Persetujuan" value="84%" note="Naik 6% dari periode lalu" accent/><StatCard label="Kelas Terlaksana" value="38" note="Dari 44 kelas terjadwal"/><StatCard label="Rata-rata Kecocokan" value="88%" note="Rekomendasi praktisi"/><StatCard label="Mitra Aktif" value="16" note="8 industri, 8 program"/></div><div className="dashboard-grid"><section className="card chart-card"><div className="card-head"><h3>Distribusi Status Pengajuan</h3></div><div className="donut-wrap"><div className="donut"><span>48<strong>Total</strong></span></div><div className="legend-list">{[['Selesai','22 pengajuan'],['Dalam proses','14 pengajuan'],['Menunggu','8 pengajuan'],['Revisi','4 pengajuan']].map((x,i)=><p key={x[0]}><i className={`l${i}`}/><span>{x[0]}</span><strong>{x[1]}</strong></p>)}</div></div></section><section className="card"><div className="card-head"><h3>Sumber Praktisi</h3></div><div className="source-bars"><div><span>Mitra Kerja Sama</span><strong>{practitioners.filter((x:any)=>x.source==='Mitra Kerja Sama').length}</strong><i><b style={{width:'66%'}}/></i></div><div><span>Summarecon Mengajar</span><strong>{practitioners.filter((x:any)=>x.source==='Summarecon Mengajar').length}</strong><i><b style={{width:'48%'}}/></i></div><div><span>Undangan langsung</span><strong>1</strong><i><b style={{width:'25%'}}/></i></div></div></section></div></>}

function ProfilePage({role,flash}:any){const r=roles[role as Role];return <><PageIntro eyebrow="AKUN PENGGUNA" title={role==='Praktisi'?'Profil Praktisi':'Profil'} description="Perbarui informasi identitas dan kontak Anda."/><section className="card profile-form"><div className="profile-side"><span className="huge-avatar">{r.short}</span><h3>{r.name}</h3><p>{role}</p><Button variant="secondary" onClick={()=>flash('Simulasi foto profil berhasil diperbarui')}>Ubah Foto</Button></div><form onSubmit={e=>{e.preventDefault();flash('Perubahan profil berhasil disimpan')}}><div className="form-grid"><Field label="Nama lengkap"><input defaultValue={r.name} required/></Field><Field label="Email"><input type="email" defaultValue={r.email} required/></Field><Field label="Institusi"><input defaultValue={role==='Praktisi'?'Nusantara Tech':'Universitas PIJAR'} required/></Field><Field label={role==='Praktisi'?'Jabatan':'Nomor telepon'}><input defaultValue={role==='Praktisi'?'Head of Data':'0812 0000 1122'} required/></Field>{role==='Praktisi'&&<><Field label="Bidang keahlian"><input defaultValue="Data Analytics, Business Intelligence" required/></Field><Field label="Pengalaman kerja"><textarea defaultValue="12 tahun di bidang teknologi data dan transformasi digital." required/></Field></>}</div><div className="modal-actions"><Button type="submit">Simpan Perubahan</Button></div></form></section></>}

function CoordinationPage({flash}:any){const[notes,setNotes]=useState('Pembahasan difokuskan pada studi kasus analitik data ritel. Praktisi menyesuaikan PPT dengan dataset yang disiapkan dosen.');return <><PageIntro eyebrow="KOLABORASI DOSEN & PRAKTISI" title="Koordinasi Perkuliahan" description="Catat hasil kesepakatan materi dan teknis pelaksanaan kelas."/><section className="card coordination"><div className="coord-head"><div className="pair-mini"><span className="avatar">DR</span><span className="avatar orange">BS</span></div><div><h3>Analitik Data Bisnis</h3><p>Dr. Rina Kusuma & Bima Santoso</p></div><Badge>Koordinasi aktif</Badge></div><div className="timeline"><span className="done">✓</span><i/><span className="done">✓</span><i/><span>3</span></div><div className="timeline-labels"><span>Pasangan disetujui</span><span>Koordinasi materi</span><span>Finalisasi bahan</span></div><Field label="Hasil koordinasi"><textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={6}/></Field><div className="form-grid"><Field label="Media koordinasi"><select><option>Zoom Meeting</option><option>Tatap muka</option><option>WhatsApp</option></select></Field><Field label="Tanggal koordinasi"><input type="date" defaultValue="2025-05-12"/></Field></div><div className="modal-actions"><Button onClick={()=>flash('Hasil koordinasi berhasil disimpan')}>Simpan Hasil Koordinasi</Button></div></section></>}

function UsersPage({flash}:any){const users=[['Dr. Rina Kusuma','Dosen/Kaprodi','Aktif'],['Bima Santoso','Praktisi','Aktif'],['Nadia Mahendra','Admin Mitra Kerja Sama','Aktif'],['Satria Mahesa','Admin Summarecon Mengajar','Aktif']];return <><PageIntro eyebrow="AKSES SISTEM" title="Manajemen Pengguna" description="Kelola akun dan hak akses pengguna PIJAR." action={<Button onClick={()=>flash('Undangan pengguna baru telah dibuat')}>＋ Undang Pengguna</Button>}/><section className="card table-card"><div className="table-scroll"><table><thead><tr><th>PENGGUNA</th><th>ROLE</th><th>STATUS</th><th>AKSI</th></tr></thead><tbody>{users.map(u=><tr key={u[0]}><td><strong>{u[0]}</strong><small>{u[0].toLowerCase().split(' ').join('.')}@pijar.id</small></td><td>{u[1]}</td><td><Badge>{u[2]}</Badge></td><td><button className="table-action" onClick={()=>flash(`Hak akses ${u[0]} siap diubah`)}>Kelola</button></td></tr>)}</tbody></table></div></section></>}

function SettingsPage({flash}:any){return <><PageIntro eyebrow="KONFIGURASI" title="Pengaturan Sistem" description="Atur periode program, tenggat, dan preferensi notifikasi."/><form className="card settings" onSubmit={e=>{e.preventDefault();flash('Pengaturan sistem berhasil disimpan')}}><div><h3>Periode Program</h3><p>Periode aktif untuk seluruh pengajuan dan pelaksanaan.</p><div className="form-grid"><Field label="Nama periode"><input defaultValue="Semester Genap 2024/2025"/></Field><Field label="Batas akhir pengajuan"><input type="date" defaultValue="2025-06-30"/></Field></div></div><div><h3>Konfirmasi Pasangan</h3><p>Tentukan masa berlaku tautan konfirmasi unik.</p><Field label="Masa berlaku tautan"><select><option>7 hari</option><option>3 hari</option><option>14 hari</option></select></Field></div><div><h3>Notifikasi Otomatis</h3>{['Pengajuan baru','Dokumen menunggu pemeriksaan','Konfirmasi akan kedaluwarsa'].map(x=><label className="switch-row" key={x}><span>{x}</span><input type="checkbox" defaultChecked/><i/></label>)}</div><div className="modal-actions"><Button type="submit">Simpan Pengaturan</Button></div></form></>}

function EmptyPage({page,setPage}:any){return <section className="empty-state card"><span><Icon name="Bahan" size={35}/></span><p className="eyebrow">PIJAR</p><h2>{page}</h2><p>Informasi pada halaman ini terhubung dengan proses utama program.</p><Button onClick={()=>setPage('Dashboard')}>Kembali ke Dashboard</Button></section>}
