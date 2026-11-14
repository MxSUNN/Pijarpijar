import type { Access, CollectionConfig } from 'payload'

const appUser: Access = ({ req }) => req.user?.collection === 'users'
const superAdmin: Access = ({ req }) =>
  req.user?.collection === 'users' && req.user.role === 'super-admin'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    group: 'Akses',
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role', 'status'],
  },
  access: {
    create: superAdmin,
    read: appUser,
    update: ({ req }) => {
      if (req.user?.collection !== 'users') return false
      if (req.user.role === 'super-admin') return true
      return { id: { equals: req.user.id } }
    },
    delete: superAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'username', type: 'text', index: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'Admin PIJAR', value: 'admin-pijar' },
        { label: 'Kaprodi / Sekprodi', value: 'kaprodi' },
        { label: 'Admin SUAR', value: 'admin-suar' },
        { label: 'Admin KERMA', value: 'admin-kerma' },
        { label: 'Dosen Pengampu', value: 'dosen' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Aktif', value: 'active' },
        { label: 'Nonaktif', value: 'inactive' },
      ],
    },
    {
      name: 'studyProgram',
      type: 'relationship',
      relationTo: 'study-programs',
    },
    { name: 'phone', type: 'text' },
  ],
  versions: false,
}
