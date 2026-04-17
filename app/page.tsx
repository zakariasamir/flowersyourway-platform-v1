import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function RootPage() {
  const cookieStore = await cookies()
  const userRole = cookieStore.get('userRole')?.value

  if (userRole === 'admin') {
    redirect('/admin')
  }

  redirect('/customer')
}
