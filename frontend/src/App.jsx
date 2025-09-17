import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'

// Layouts
import AuthLayout from './components/layouts/AuthLayout'
import DashboardLayout from './components/layouts/DashboardLayout'

// Páginas de autenticação
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

// Páginas do dashboard
import DashboardPage from './pages/dashboard/DashboardPage'
import FuncionariosPage from './pages/funcionarios/FuncionariosPage'
import FaltasPage from './pages/faltas/FaltasPage'
import FeriasPage from './pages/ferias/FeriasPage'
import AtestadosPage from './pages/atestados/AtestadosPage'
import EquipesPage from './pages/equipes/EquipesPage'
import ConfiguracoesPage from './pages/configuracoes/ConfiguracoesPage'

// Componente de carregamento
import LoadingSpinner from './components/ui/LoadingSpinner'

function App() {
  const { user, loading } = useAuth()

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Rotas públicas (não autenticadas) */}
        <Route path="/auth/*" element={
          user ? <Navigate to="/dashboard" replace /> : <AuthLayout />
        }>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route index element={<Navigate to="login" replace />} />
        </Route>

        {/* Rotas privadas (autenticadas) */}
        <Route path="/*" element={
          user ? <DashboardLayout /> : <Navigate to="/auth/login" replace />
        }>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="funcionarios" element={<FuncionariosPage />} />
          <Route path="faltas" element={<FaltasPage />} />
          <Route path="ferias" element={<FeriasPage />} />
          <Route path="atestados" element={<AtestadosPage />} />
          <Route path="equipes" element={<EquipesPage />} />
          <Route path="configuracoes" element={<ConfiguracoesPage />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Rota padrão */}
        <Route path="*" element={
          <Navigate to={user ? "/dashboard" : "/auth/login"} replace />
        } />
      </Routes>
    </div>
  )
}

export default App
