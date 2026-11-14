'use server'

import config from '@payload-config'
import { getPayload } from 'payload'
import { appAuth } from '@/lib/app-auth'

type Result<T> =
  | { ok: true; data: T }
  | { ok: false; message: string; fields?: Record<string, string> }

const roleValues = [
  'super-admin',
  'admin-pijar',
  'kaprodi',
  'admin-suar',
  'admin-kerma',
  'dosen',
] as const
const statusValues = ['active', 'inactive'] as const
const categoryValues = [
  'study-program',
  'academic-year',
  'document-category',
  'expertise',
  'other',
] as const

function text(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

async function requireSuperAdmin() {
  const user = await appAuth.currentUser()
  if (!user || user.role !== 'super-admin' || user.status !== 'active') return null
  return user
}

export async function loginAction(
  email: string,
  password: string,
): Promise<Result<{ role: string }>> {
  if (!text(email) || !text(password)) {
    return { ok: false, message: 'Email dan password wajib diisi.' }
  }
  try {
    const user = await appAuth.login(text(email).toLowerCase(), password)
    if (!user || user.status !== 'active') {
      await appAuth.logout()
      return { ok: false, message: 'Akun tidak aktif atau kredensial tidak sesuai.' }
    }
    return { ok: true, data: { role: user.role } }
  } catch {
    return { ok: false, message: 'Email atau password tidak sesuai.' }
  }
}

export async function logoutAction() {
  await appAuth.logout()
  return { ok: true as const }
}

export async function createMasterDataAction(input: {
  category: string
  name: string
  description?: string
  status: string
}): Promise<
  Result<{ id: string; category: string; name: string; description: string; status: string }>
> {
  const user = await requireSuperAdmin()
  if (!user) return { ok: false, message: 'Anda tidak memiliki akses untuk tindakan ini.' }

  const fields: Record<string, string> = {}
  if (!categoryValues.includes(input.category as (typeof categoryValues)[number]))
    fields.category = 'Pilih kategori data master.'
  if (text(input.name).length < 2) fields.name = 'Nama data minimal 2 karakter.'
  if (!statusValues.includes(input.status as (typeof statusValues)[number]))
    fields.status = 'Pilih status yang valid.'
  if (Object.keys(fields).length) return { ok: false, message: 'Periksa kembali formulir.', fields }

  try {
    const payload = await getPayload({ config })
    const doc = await payload.create({
      collection: 'master-data',
      overrideAccess: false,
      user,
      data: {
        category: input.category as (typeof categoryValues)[number],
        name: text(input.name),
        description: text(input.description),
        status: input.status as (typeof statusValues)[number],
      },
    })
    await payload.create({
      collection: 'audit-logs',
      overrideAccess: false,
      user,
      data: {
        actor: user.id,
        action: 'Tambah data master',
        entity: 'master-data',
        entityId: String(doc.id),
        after: { category: doc.category, name: doc.name, status: doc.status },
      },
    })
    return {
      ok: true,
      data: {
        id: String(doc.id),
        category: doc.category,
        name: doc.name,
        description: doc.description ?? '',
        status: doc.status,
      },
    }
  } catch {
    return { ok: false, message: 'Data master gagal disimpan. Silakan coba lagi.' }
  }
}

type UserInput = {
  id?: string
  name: string
  email: string
  username?: string
  role: string
  studyProgram?: string
  status: string
  password?: string
}

function validateUser(input: UserInput, editing: boolean) {
  const fields: Record<string, string> = {}
  if (text(input.name).length < 3) fields.name = 'Nama lengkap minimal 3 karakter.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text(input.email))) fields.email = 'Email tidak valid.'
  if (!roleValues.includes(input.role as (typeof roleValues)[number])) fields.role = 'Pilih role.'
  if (!statusValues.includes(input.status as (typeof statusValues)[number]))
    fields.status = 'Pilih status akun.'
  if (input.role === 'kaprodi' || input.role === 'dosen') {
    if (!text(input.studyProgram)) fields.studyProgram = 'Program studi wajib untuk role ini.'
  }
  if (!editing && text(input.password).length < 8)
    fields.password = 'Password awal minimal 8 karakter.'
  if (text(input.password) && text(input.password).length < 8)
    fields.password = 'Password minimal 8 karakter.'
  return fields
}

function userResult(doc: {
  id: string | number
  name: string
  email: string
  username?: string | null
  role: string
  status: string
  studyProgram?: string | number | { id: string | number; name?: string } | null
}) {
  const studyProgram =
    doc.studyProgram && typeof doc.studyProgram === 'object'
      ? { id: String(doc.studyProgram.id), name: doc.studyProgram.name ?? '' }
      : doc.studyProgram
        ? { id: String(doc.studyProgram), name: '' }
        : null
  return {
    id: String(doc.id),
    name: doc.name,
    email: doc.email,
    username: doc.username ?? '',
    role: doc.role,
    status: doc.status,
    studyProgram,
  }
}

export async function createUserAction(
  input: UserInput,
): Promise<Result<ReturnType<typeof userResult>>> {
  const user = await requireSuperAdmin()
  if (!user) return { ok: false, message: 'Anda tidak memiliki akses untuk tindakan ini.' }
  const fields = validateUser(input, false)
  if (Object.keys(fields).length) return { ok: false, message: 'Periksa kembali formulir.', fields }

  try {
    const payload = await getPayload({ config })
    const doc = await payload.create({
      collection: 'users',
      overrideAccess: false,
      user,
      depth: 1,
      data: {
        name: text(input.name),
        email: text(input.email).toLowerCase(),
        username: text(input.username) || undefined,
        role: input.role as (typeof roleValues)[number],
        studyProgram: text(input.studyProgram) || undefined,
        status: input.status as (typeof statusValues)[number],
        password: input.password!,
      },
    })
    return { ok: true, data: userResult(doc) }
  } catch {
    return { ok: false, message: 'Pengguna gagal disimpan. Pastikan email belum digunakan.' }
  }
}

export async function updateUserAction(
  input: UserInput,
): Promise<Result<ReturnType<typeof userResult>>> {
  const user = await requireSuperAdmin()
  if (!user) return { ok: false, message: 'Anda tidak memiliki akses untuk tindakan ini.' }
  if (!text(input.id)) return { ok: false, message: 'ID pengguna tidak valid.' }
  const fields = validateUser(input, true)
  if (Object.keys(fields).length) return { ok: false, message: 'Periksa kembali formulir.', fields }

  try {
    const payload = await getPayload({ config })
    const data = {
      name: text(input.name),
      email: text(input.email).toLowerCase(),
      username: text(input.username) || null,
      role: input.role as (typeof roleValues)[number],
      studyProgram: text(input.studyProgram) || null,
      status: input.status as (typeof statusValues)[number],
      ...(text(input.password) ? { password: input.password } : {}),
    }
    const doc = await payload.update({
      collection: 'users',
      id: input.id!,
      overrideAccess: false,
      user,
      depth: 1,
      data,
    })
    return { ok: true, data: userResult(doc) }
  } catch {
    return { ok: false, message: 'Perubahan gagal disimpan. Pastikan email belum digunakan.' }
  }
}
