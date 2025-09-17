import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings,
  Bell,
  Search
} from 'lucide-react'

const Header = ({ sidebarOpen, setSidebarOpen, navigation }) => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/auth/login')
  }

  const getCurrentPageName = () => {
    const currentPage = navigation?.find(item => item.href === location.pathname)
    return currentPage?.name || 'Dashboard'
  }

  // Mock notifications - em produção viria de uma API
  const notifications = [
    { id: 1, message: 'Nova solicitação de férias pendente', time: '5 min atrás', unread: true },
    { id: 2, message: 'Atestado médico aprovado', time: '1 hora atrás', unread: true },
    { id: 3, message: 'Relatório mensal disponível', time: '2 horas atrás', unread: false },
  ]

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      
      {/* Mobile menu button */}
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Abrir sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-200 lg:hidden" />

      {/* Page title and breadcrumb */}
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <h1 className="text-lg font-semibold leading-6 text-gray-900">
            {getCurrentPageName()}
          </h1>
          
          {/* Breadcrumb */}
          <nav className="hidden sm:flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>NEF</li>
              <li className="before:content-['/'] before:mx-2">
                {getCurrentPageName()}
              </li>
            </ol>
          </nav>
        </div>

        {/* Search bar */}
        <div className="flex flex-1 justify-center lg:justify-end">
          <div className="w-full max-w-lg lg:max-w-xs">
            <label htmlFor="search" className="sr-only">
              Buscar
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="search"
                name="search"
                className="block w-full rounded-md border-0 bg-gray-50 py-1.5 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6"
                placeholder="Buscar funcionários..."
                type="search"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right side items */}
      <div className="flex items-center gap-x-4 lg:gap-x-6">
        
        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <span className="sr-only">Ver notificações</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications dropdown */}
          {showNotifications && (
            <div className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-4 py-2 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-900">Notificações</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-gray-50 ${
                      notification.unread ? 'bg-blue-50' : ''
                    }`}
                  >
                    <p className="text-sm text-gray-900">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-gray-200">
                <button className="text-sm text-primary-600 hover:text-primary-700">
                  Ver todas as notificações
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />

        {/* Profile dropdown */}
        <div className="relative">
          <button
            type="button"
            className="-m-1.5 flex items-center p-1.5 hover:bg-gray-50 rounded-lg transition-colors"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <span className="sr-only">Abrir menu do usuário</span>
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
              <User className="h-4 w-4 text-primary-600" />
            </div>
            <span className="hidden lg:flex lg:items-center lg:ml-2">
              <span className="text-sm font-medium leading-6 text-gray-900">
                {user?.profile?.nome || user?.email?.split('@')[0]}
              </span>
              <span className="ml-2 text-xs text-gray-500">
                {user?.profile?.role || 'Usuário'}
              </span>
            </span>
          </button>

          {/* User menu dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-4 py-2 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900">
                  {user?.profile?.nome || user?.email?.split('@')[0]}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
                <p className="text-xs text-primary-600 font-medium mt-1">
                  {user?.profile?.role || 'Usuário'}
                </p>
              </div>
              
              <button
                onClick={() => {
                  setShowUserMenu(false)
                  navigate('/configuracoes')
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Settings className="mr-3 h-4 w-4" />
                Configurações
              </button>
              
              <button
                onClick={() => {
                  setShowUserMenu(false)
                  handleLogout()
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="mr-3 h-4 w-4" />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header
