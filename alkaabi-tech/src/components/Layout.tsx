import type { ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutGrid, ListOrdered, PlusCircle, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const navItems = [
  { to: '/dashboard', label: 'الرئيسية', icon: LayoutGrid },
  { to: '/orders', label: 'الطلبات', icon: ListOrdered },
  { to: '/orders/new', label: 'طلب جديد', icon: PlusCircle }
]

export default function Layout({ children }: { children: ReactNode }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-paper pb-24">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-ink/10 bg-paper/95 px-4 py-3 backdrop-blur">
        <div>
          <h1 className="text-base font-bold text-ink">ALKAABI TECH</h1>
          <p className="text-xs text-graphite/60">إدارة طلبات الصيانة</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-graphite/70 hover:bg-ink/5"
        >
          <LogOut size={16} />
          خروج
        </button>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-5">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-stretch justify-around">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium ${
                  isActive ? 'text-copper' : 'text-graphite/50'
                }`
              }
            >
              <Icon size={22} />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
