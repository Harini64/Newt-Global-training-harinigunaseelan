import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useMemo, useState } from 'react'
import {
  LayoutDashboard,
  Users,
  Calendar,
  BookOpen,
  BarChart3,
  User,
  UserPlus,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

const pathTitles = {
  dashboard: 'Dashboard',
  students: 'Students',
  attendance: 'Attendance',
  marks: 'Marks',
  analytics: 'Analytics',
  accounts: 'User accounts',
  profile: 'Profile',
}

const Layout = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const pageTitle = useMemo(() => {
    const parts = location.pathname.split('/').filter(Boolean)
    if (parts[0] === 'students' && parts[1]) {
      return 'Student profile'
    }
    const first = parts[0] || 'dashboard'
    return pathTitles[first] || 'EduTrack'
  }, [location.pathname])

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Students', href: '/students', icon: Users, adminOnly: true },
    { name: 'Attendance', href: '/attendance', icon: Calendar },
    { name: 'Marks', href: '/marks', icon: BookOpen },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, adminOnly: true },
    { name: 'Accounts', href: '/accounts', icon: UserPlus, adminOnly: true },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  const filteredNavigation = navigation.filter(
    (item) => !item.adminOnly || user?.role === 'ADMIN'
  )

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-x-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600/75 z-20 lg:hidden"
          onClick={closeSidebar}
          onKeyDown={(e) => e.key === 'Escape' && closeSidebar()}
          role="presentation"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:flex-shrink-0 lg:z-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100 flex-shrink-0">
          <Link to="/dashboard" className="flex items-center min-w-0" onClick={closeSidebar}>
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="ml-2 text-xl font-bold text-gray-900 truncate">EduTrack</span>
          </Link>
          <button
            type="button"
            onClick={closeSidebar}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 rounded-lg"
            aria-label="Close sidebar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {filteredNavigation.map((item) => {
            const isActive =
              location.pathname === item.href ||
              (item.href !== '/dashboard' && location.pathname.startsWith(`${item.href}/`))
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={closeSidebar}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="flex-shrink-0 px-4 py-4 border-t border-gray-100 bg-white">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-primary-600" />
            </div>
            <div className="ml-3 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2 flex-shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <header className="sticky top-0 z-10 flex-shrink-0 h-16 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-full px-4 sm:px-6 gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <p className="text-lg font-semibold text-gray-900 truncate">{pageTitle}</p>
            </div>
            <span className="text-sm text-gray-600 flex-shrink-0">
              {user?.role === 'ADMIN' ? 'Admin' : 'Student'}
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 w-full">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
