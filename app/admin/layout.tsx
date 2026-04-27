import AdminHeader from '@/components/admin/admin-header'

export const revalidate = 0
export const dynamic = 'force-dynamic'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AdminHeader />
      {children}
    </>
  )
}
