import { useAuth } from '../../contexts/AuthContext'
import { Users, Calendar, CalendarDays, FileText, TrendingUp, Clock } from 'lucide-react'

const DashboardPage = () => {
  const { user } = useAuth()

  // Mock data - será substituído por dados reais da API
  const stats = {
    totalFuncionarios: 25,
    faltasMes: 8,
    feriasAprovadas: 3,
    atestadosPendentes: 2
  }

  const recentActivity = [
    {
      id: 1,
      type: 'falta',
      message: 'João Silva registrou uma falta',
      time: '2 horas atrás',
      icon: Calendar
    },
    {
      id: 2,
      type: 'ferias',
      message: 'Maria Santos solicitou férias',
      time: '4 horas atrás',
      icon: CalendarDays
    },
    {
      id: 3,
      type: 'atestado',
      message: 'Pedro Oliveira enviou atestado médico',
      time: '1 dia atrás',
      icon: FileText
    }
  ]

  const StatCard = ({ title, value, icon: Icon, color = 'primary' }) => (
    <div className="card">
      <div className="card-content p-6">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg bg-${color}-100`}>
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bem-vindo, {user?.nome}!
        </h1>
        <p className="text-gray-600">
          Aqui está um resumo da sua equipe hoje.
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Funcionários"
          value={stats.totalFuncionarios}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Faltas Este Mês"
          value={stats.faltasMes}
          icon={Calendar}
          color="red"
        />
        <StatCard
          title="Férias Aprovadas"
          value={stats.feriasAprovadas}
          icon={CalendarDays}
          color="green"
        />
        <StatCard
          title="Atestados Pendentes"
          value={stats.atestadosPendentes}
          icon={FileText}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Atividades recentes */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Atividades Recentes</h3>
            <p className="card-description">
              Últimas movimentações na sua equipe
            </p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon
                return (
                  <div key={activity.id} className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Icon className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Gráfico de tendências */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Tendências do Mês</h3>
            <p className="card-description">
              Comparação com o mês anterior
            </p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Faltas</span>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-sm font-medium text-red-600">+12%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Férias</span>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-600">+5%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Atestados</span>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm font-medium text-yellow-600">-3%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ações rápidas */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Ações Rápidas</h3>
          <p className="card-description">
            Acesse rapidamente as funcionalidades mais utilizadas
          </p>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="btn btn-outline btn-lg justify-start">
              <Users className="h-5 w-5 mr-2" />
              Cadastrar Funcionário
            </button>
            <button className="btn btn-outline btn-lg justify-start">
              <Calendar className="h-5 w-5 mr-2" />
              Registrar Falta
            </button>
            <button className="btn btn-outline btn-lg justify-start">
              <FileText className="h-5 w-5 mr-2" />
              Upload Atestado
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
