import Link from 'next/link'

const schedules = [
  {
    date: '18 JUN',
    time: '09.00–11.30',
    course: 'Analisis dan Perancangan Sistem Informasi',
    program: 'Business Information System',
    type: 'SUAR',
    practitioner: 'Bima Santoso',
    place: 'Lab Komputer 3',
  },
  {
    date: '20 JUN',
    time: '13.00–15.00',
    course: 'Manajemen Proyek',
    program: 'Manajemen',
    type: 'PIJAR',
    practitioner: 'Sarah Wijaya',
    place: 'Zoom Meeting',
  },
  {
    date: '24 JUN',
    time: '10.00–12.00',
    course: 'Arsitektur Berkelanjutan',
    program: 'Architecture',
    type: 'PIJAR',
    practitioner: 'Nadia Rahman',
    place: 'Ruang A-402',
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f5f7f4] text-[#173226]">
      <header className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-6 md:px-8">
        <div className="flex items-center gap-3">
          <span className="brand-symbol" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <div>
            <strong className="block text-xl tracking-[-.04em]">PIJAR–SUAR</strong>
            <span className="text-xs font-medium text-[#718077]">Praktisi Mengajar</span>
          </div>
        </div>
        <nav className="flex items-center gap-3">
          <a href="#jadwal" className="hidden text-sm font-semibold text-[#53675d] sm:block">
            Jadwal Publik
          </a>
          <Link
            href="/portal"
            className="rounded-full bg-[#194d35] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#123b28]"
          >
            Masuk Portal
          </Link>
        </nav>
      </header>

      <section className="mx-auto grid max-w-[1180px] gap-10 px-5 pb-20 pt-10 md:grid-cols-[1.05fr_.95fr] md:px-8 md:pt-20">
        <div>
          <span className="inline-flex rounded-full border border-[#cad8d0] bg-white px-3 py-1 text-xs font-bold tracking-[.13em] text-[#2e654c]">
            KOLABORASI KAMPUS & INDUSTRI
          </span>
          <h1 className="mt-7 max-w-[720px] text-5xl font-semibold leading-[1.03] tracking-[-.055em] text-[#153e2b] md:text-7xl">
            Pengalaman industri, hadir di ruang kelas.
          </h1>
          <p className="mt-6 max-w-[610px] text-lg leading-8 text-[#5f7067]">
            PIJAR–SUAR menyatukan pengajuan mata kuliah, penugasan praktisi dan mitra, dokumen,
            jadwal, serta evaluasi dalam satu alur yang transparan.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#jadwal"
              className="rounded-full bg-[#e98a35] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#d97928]"
            >
              Lihat jadwal perkuliahan
            </a>
            <Link
              href="/portal"
              className="rounded-full border border-[#b8c8bf] bg-white px-6 py-3 text-sm font-bold text-[#194d35]"
            >
              Akses pengguna internal
            </Link>
          </div>
        </div>
        <div className="relative min-h-[420px] overflow-hidden rounded-[34px] bg-[#194d35] p-8 text-white shadow-[0_28px_70px_rgba(25,77,53,.22)]">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full border-[45px] border-[#2f6b50]" />
          <div className="absolute -bottom-20 -left-16 h-60 w-60 rounded-full bg-[#e98a35]" />
          <div className="relative z-10">
            <p className="text-xs font-bold tracking-[.18em] text-[#b8d7c7]">
              SEMESTER GENAP 2024/2025
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-.04em]">Program dalam angka</h2>
            <div className="mt-16 grid grid-cols-2 gap-4">
              {[
                ['48', 'Pengajuan aktif'],
                ['31', 'Praktisi terlibat'],
                ['16', 'Mitra industri'],
                ['12', 'Program studi'],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur"
                >
                  <strong className="block text-4xl tracking-[-.05em]">{value}</strong>
                  <span className="mt-2 block text-sm text-[#d7e9df]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="jadwal" className="border-t border-[#dbe3de] bg-white">
        <div className="mx-auto max-w-[1180px] px-5 py-20 md:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold tracking-[.16em] text-[#e17d26]">JADWAL PUBLIK</p>
              <h2 className="mt-2 text-4xl font-semibold tracking-[-.045em] text-[#153e2b]">
                Kelas praktisi terdekat
              </h2>
              <p className="mt-3 text-[#697a70]">
                Hanya kegiatan yang telah ditetapkan untuk publik.
              </p>
            </div>
            <div className="flex gap-2">
              <label className="public-filter">
                <span className="sr-only">Cari jadwal</span>
                <input placeholder="Cari mata kuliah..." />
              </label>
              <label className="public-filter">
                <span className="sr-only">Program studi</span>
                <select defaultValue="">
                  <option value="">Semua prodi</option>
                  <option>Business Information System</option>
                  <option>Manajemen</option>
                  <option>Architecture</option>
                </select>
              </label>
            </div>
          </div>
          <div className="mt-10 grid gap-4">
            {schedules.map((item) => (
              <article
                key={item.course}
                className="group grid gap-5 rounded-2xl border border-[#dce5df] bg-[#fbfcfb] p-5 transition hover:-translate-y-0.5 hover:border-[#aac1b4] hover:shadow-lg md:grid-cols-[96px_1fr_auto] md:items-center"
              >
                <div className="rounded-xl bg-[#e8f0eb] px-3 py-4 text-center text-sm font-extrabold text-[#194d35]">
                  {item.date}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="status-badge status-approved">{item.type}</span>
                    <span className="text-sm text-[#75837b]">{item.program}</span>
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-[#213c2e]">{item.course}</h3>
                  <p className="mt-1 text-sm text-[#697a70]">
                    {item.practitioner} · {item.place}
                  </p>
                </div>
                <strong className="text-sm text-[#194d35]">{item.time}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>
      <footer className="bg-[#123c29] px-5 py-8 text-center text-sm text-[#bcd1c4]">
        PIJAR–SUAR · Sistem Informasi Praktisi Mengajar
      </footer>
    </main>
  )
}
