import { Outlet } from 'react-router-dom'
import { Shield, Users, Calendar, FileText, BarChart3 } from 'lucide-react'
import Footer from '../common/Footer'
import ErrorBoundary from '../common/ErrorBoundary'

const AuthLayout = () => {
  const features = [
    { icon: Users, text: 'Gestão completa de funcionários' },
    { icon: Calendar, text: 'Controle de faltas e férias' },
    { icon: FileText, text: 'Gerenciamento de atestados' },
    { icon: BarChart3, text: 'Relatórios e estatísticas' },
    { icon: Shield, text: 'Sistema seguro e confiável' }
  ]

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex">
          {/* Lado esquerdo - Branding */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-500 to-primary-700 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            
            {/* Decorative elements */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
            <div className="absolute bottom-20 left-10 w-24 h-24 bg-white/5 rounded-full blur-lg" />
            
            <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
              <div className="text-center max-w-md">
                {/* Logo */}
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm mb-4">
                    <span className="text-2xl font-bold">NEF</span>
                  </div>
                  <h1 className="text-4xl font-bold mb-2">NEF</h1>
                  <p className="text-xl opacity-90 font-light">
                    Sistema de Gestão de Equipe
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-4 text-left">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 group">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <feature.icon className="w-4 h-4" />
                      </div>
                      <span className="text-white/90 group-hover:text-white transition-colors">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Security badge */}
                <div className="mt-8 inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Shield className="w-4 h-4 text-green-300" />
                  <span className="text-sm font-medium">Acesso Restrito e Seguro</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lado direito - Formulário */}
          <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-gray-50">
            <div className="mx-auto w-full max-w-sm lg:w-96">
              {/* Mobile header */}
              <div className="lg:hidden text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl mb-4">
                  <span className="text-lg font-bold text-primary-600">NEF</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">NEF</h1>
                <p className="text-gray-600 mt-2">Sistema de Gestão de Equipe</p>
              </div>
              
              {/* Form content */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <Outlet />
              </div>

              {/* Mobile security info */}
              <div className="lg:hidden mt-6 text-center">
                <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Sistema seguro com acesso restrito</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </ErrorBoundary>
  )
}

export default AuthLayout
