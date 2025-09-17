import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { 
  Home, 
  Users, 
  Calendar, 
  CalendarDays, 
  FileText, 
  Building2, 
  Settings
} from 'lucide-react'

// Componentes organizados
import Sidebar from '../common/Sidebar'
import Header from '../common/Header'
import Footer from '../common/Footer'
import ErrorBoundary from '../common/ErrorBoundary'

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Funcionários', href: '/funcionarios', icon: Users },
    { name: 'Faltas', href: '/faltas', icon: Calendar },
    { name: 'Férias', href: '/ferias', icon: CalendarDays },
    { name: 'Atestados', href: '/atestados', icon: FileText },
    { name: 'Equipes', href: '/equipes', icon: Building2 },
    { name: 'Configurações', href: '/configuracoes', icon: Settings },
  ]

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Sidebar */}
        <Sidebar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          navigation={navigation} 
        />

        {/* Main content area */}
        <div className="lg:pl-72 flex flex-col min-h-screen">
          {/* Header */}
          <Header 
            sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen} 
            navigation={navigation} 
          />

          {/* Page content */}
          <main className="flex-1 py-6">
            <div className="px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default DashboardLayout
