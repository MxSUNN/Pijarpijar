import type { Access, CollectionConfig } from 'payload'

const superAdmin: Access = ({ req }) =>
  req.user?.collection === 'users' && req.user.role === 'super-admin'

export const MasterData: CollectionConfig = {
  slug: 'master-data',
  admin: {
    group: 'Data Master',
    useAsTitle: 'name',
    defaultColumns: ['category', 'name', 'status', 'updatedAt'],
  },
  access: {
    create: superAdmin,
    read: superAdmin,
    update: superAdmin,
    delete: superAdmin,
  },
  fields: [
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Program Studi', value: 'study-program' },
        { label: 'Tahun Akademik', value: 'academic-year' },
        { label: 'Kategori Dokumen', value: 'document-category' },
        { label: 'Bidang Keahlian', value: 'expertise' },
        { label: 'Konfigurasi Lainnya', value: 'other' },
      ],
    },
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
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
  ],
}
