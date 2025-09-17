import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const RegisterPage = () => {
  const navigate = useNavigate()

  // Registro desabilitado - apenas usuários pré-autorizados
  useEffect(() => {
    // Redirecionar para login após 5 segundos
    const timer = setTimeout(() => {
      navigate('/auth/login')
    }, 5000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Acesso Restrito
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Este sistema é exclusivo para supervisores e gestores autorizados.
        </p>
      </div>

      {/* Mensagem de acesso restrito */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Sistema com Acesso Controlado
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                O sistema <strong>NEF</strong> possui acesso restrito. Apenas os seguintes usuários autorizados podem acessar:
              </p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li><strong>Felype Simões</strong> - Supervisor</li>
                <li><strong>José Felipe</strong> - Gestor</li>
                <li><strong>Maria Pereira</strong> - Gestora</li>
                <li><strong>Júlio Gonçalves</strong> - Supervisor</li>
              </ul>
              <p className="mt-3">
                Se você é um dos usuários autorizados, use suas credenciais para fazer login.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Botão para ir ao login */}
      <div className="text-center">
        <Link
          to="/auth/login"
          className="btn btn-primary btn-lg"
        >
          Ir para Login
        </Link>
      </div>

      {/* Informações de contato */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          Precisa de acesso?
        </h4>
        <p className="text-sm text-gray-600">
          Se você acredita que deveria ter acesso ao sistema, entre em contato com o administrador do sistema.
        </p>
      </div>

      {/* Rodapé */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              NEF - Sistema de Gestão de Equipe
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
