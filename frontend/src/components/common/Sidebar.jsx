import { Link, useLocation } from 'react-router-dom'
import { X } from 'lucide-react'

const Sidebar = ({ sidebarOpen, setSidebarOpen, navigation }) => {
  const location = useLocation()

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">NEF</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">NEF</h1>
            <p className="text-xs text-gray-500">Sistema de Gestão</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-4 py-4">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <div className="text-xs font-semibold leading-6 text-gray-400 uppercase tracking-wide mb-2">
              Menu Principal
            </div>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      onClick={() => setSidebarOpen && setSidebarOpen(false)}
                      className={`
                        group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-all duration-200
                        ${isActive
                          ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                          : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                        }
                      `}
                    >
                      <item.icon
                        className={`h-5 w-5 shrink-0 transition-colors duration-200 ${
                          isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-600'
                        }`}
                        aria-hidden="true"
                      />
                      <span className="truncate">{item.name}</span>
                      
                      {/* Active indicator */}
                      {isActive && (
                        <div className="ml-auto h-2 w-2 rounded-full bg-primary-600" />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li>

          {/* Quick Stats */}
          <li className="mt-auto">
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Estatísticas Rápidas
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Funcionários Ativos</span>
                  <span className="text-xs font-medium text-gray-900">--</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Faltas Pendentes</span>
                  <span className="text-xs font-medium text-orange-600">--</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Férias Aprovadas</span>
                  <span className="text-xs font-medium text-green-600">--</span>
                </div>
              </div>
            </div>
          </li>

          {/* System Info */}
          <li>
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-1">
                Sistema NEF v1.0.0
              </div>
              <div className="flex items-center justify-center space-x-1">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-500">Online</span>
              </div>
            </div>
          </li>
        </ul>
      </nav>
    </>
  )

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`relative z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-900/80 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar panel */}
        <div className="fixed inset-0 flex">
          <div className="relative mr-16 flex w-full max-w-xs flex-1">
            {/* Close button */}
            <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
              <button
                type="button"
                className="-m-2.5 p-2.5"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Fechar sidebar</span>
                <X className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>

            {/* Sidebar content */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white">
              <SidebarContent />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white">
          <SidebarContent />
        </div>
      </div>
    </>
  )
}

export default Sidebar
