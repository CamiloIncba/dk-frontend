import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ThemeToggle from '@/components/ThemeToggle'

export default function MainLayout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <>
      <Navbar />
      <main className={isHome ? '' : 'pt-20'}>
        <Outlet />
      </main>
      <Footer />
      {isHome ? <ThemeToggle /> : null}
    </>
  )
}
