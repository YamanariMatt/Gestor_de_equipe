import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  CalendarDays, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Check, 
  X,
  Clock,
  Play,
  CheckCircle2,
  Calendar
} from 'lucide-react'
import { api } from '../../services/api'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { toast } from 'react-hot-toast'

const FeriasPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFuncionario, setSelectedFuncionario] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedAno, setSelectedAno] = useState(new Date().getFullYear().toString())
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('create')
  const [selectedFerias, setSelectedFerias] = useState(null)

  const queryClient = useQueryClient()

  // Queries
  const { data: ferias = [], isLoading: loadingFerias } = useQuery({
    queryKey: ['ferias', searchTerm, selectedFuncionario, selectedStatus, selectedAno],
    queryFn: () => {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (selectedFuncionario) params.append('funcionario_id', selectedFuncionario)
      if (selectedStatus) params.append('status', selectedStatus)
      if (selectedAno) params.append('ano_referencia', selectedAno)
      
      return api.get(`/ferias?${params.toString()}`).then(res => res.data)
    }
  })

  const { data: funcionarios = [] } = useQuery({
    queryKey: ['funcionarios-ativos'],
    queryFn: () => api.get('/funcionarios?ativo=true').then(res => res.data)
  })

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/ferias/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['ferias'])
      toast.success('Férias removidas com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao remover férias')
    }
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status, observacoes }) => 
      api.patch(`/ferias/${id}/status`, { status, observacoes }),
    onSuccess: () => {
      queryClient.invalidateQueries(['ferias'])
      toast.success('Status atualizado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao atualizar status')
    }
  })

  // Status de férias
  const statusFerias = [
    { value: 'solicitado', label: 'Solicitado', color: 'blue', icon: Clock },
    { value: 'aprovado', label: 'Aprovado', color: 'green', icon: Check },
    { value: 'rejeitado', label: 'Rejeitado', color: 'red', icon: X },
    { value: 'em_andamento', label: 'Em Andamento', color: 'yellow', icon: Play },
    { value: 'concluido', label: 'Concluído', color: 'gray', icon: CheckCircle2 }
  ]

  // Anos disponíveis
  const anosDisponiveis = []
  const anoAtual = new Date().getFullYear()
  for (let i = anoAtual - 2; i <= anoAtual + 1; i++) {
    anosDisponiveis.push(i)
  }

  // Estatísticas
  const stats = {
    total: ferias.length,
    solicitadas: ferias.filter(f => f.status === 'solicitado').length,
    aprovadas: ferias.filter(f => f.status === 'aprovado').length,
    emAndamento: ferias.filter(f => f.status === 'em_andamento').length,
    concluidas: ferias.filter(f => f.status === 'concluido').length
  }

  const getStatusInfo = (status) => {
    return statusFerias.find(s => s.value === status) || { label: status, color: 'gray', icon: Clock }
  }

  const calcularDiasUteis = (dataInicio, dataFim) => {
    const inicio = new Date(dataInicio)
    const fim = new Date(dataFim)
    let diasUteis = 0
    
    const current = new Date(inicio)
    while (current <= fim) {
      const diaSemana = current.getDay()
      if (diaSemana !== 0 && diaSemana !== 6) { // Não é domingo (0) nem sábado (6)
        diasUteis++
      }
      current.setDate(current.getDate() + 1)
    }
    
    return diasUteis
  }

  const handleApprove = (ferias) => {
    if (window.confirm(`Aprovar férias de ${ferias.funcionario?.nome}?`)) {
      statusMutation.mutate({ id: ferias.id, status: 'aprovado' })
    }
  }

  const handleReject = (ferias) => {
    const observacoes = window.prompt('Motivo da rejeição (opcional):')
    if (observacoes !== null) {
      statusMutation.mutate({ id: ferias.id, status: 'rejeitado', observacoes })
    }
  }

  const handleStart = (ferias) => {
    if (window.confirm(`Iniciar férias de ${ferias.funcionario?.nome}?`)) {
      statusMutation.mutate({ id: ferias.id, status: 'em_andamento' })
    }
  }

  const handleComplete = (ferias) => {
    if (window.confirm(`Concluir férias de ${ferias.funcionario?.nome}?`)) {
      statusMutation.mutate({ id: ferias.id, status: 'concluido' })
    }
  }

  const handleEdit = (ferias) => {
    setSelectedFerias(ferias)
    setModalType('edit')
    setShowModal(true)
  }

  const handleView = (ferias) => {
    setSelectedFerias(ferias)
    setModalType('view')
    setShowModal(true)
  }

  const handleDelete = (ferias) => {
    if (window.confirm(`Remover férias de ${ferias.funcionario?.nome}?`)) {
      deleteMutation.mutate(ferias.id)
    }
  }

  const handleCreate = () => {
    setSelectedFerias(null)
    setModalType('create')
    setShowModal(true)
  }

  if (loadingFerias) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Férias</h1>
          <p className="text-gray-600">Controle de solicitações e períodos de férias</p>
        </div>
        <button
          onClick={handleCreate}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Solicitar Férias
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="card">
          <div className="card-content p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-100">
                <CalendarDays className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-100">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Solicitadas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.solicitadas}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-100">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aprovadas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.aprovadas}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Play className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Em Andamento</p>
                <p className="text-2xl font-bold text-gray-900">{stats.emAndamento}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-gray-100">
                <CheckCircle2 className="h-6 w-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Concluídas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.concluidas}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="card-content p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar funcionário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>

            <select
              value={selectedFuncionario}
              onChange={(e) => setSelectedFuncionario(e.target.value)}
              className="input"
            >
              <option value="">Todos os funcionários</option>
              {funcionarios.map(funcionario => (
                <option key={funcionario.id} value={funcionario.id}>
                  {funcionario.nome}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input"
            >
              <option value="">Todos os status</option>
              {statusFerias.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            <select
              value={selectedAno}
              onChange={(e) => setSelectedAno(e.target.value)}
              className="input"
            >
              <option value="">Todos os anos</option>
              {anosDisponiveis.map(ano => (
                <option key={ano} value={ano}>
                  {ano}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="card">
        <div className="card-content p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Funcionário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Período
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dias Úteis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ano Ref.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ferias.map((ferias) => {
                  const statusInfo = getStatusInfo(ferias.status)
                  const StatusIcon = statusInfo.icon
                  const diasUteis = calcularDiasUteis(ferias.data_inicio, ferias.data_fim)

                  return (
                    <tr key={ferias.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {ferias.funcionario?.nome}
                        </div>
                        <div className="text-sm text-gray-500">
                          {ferias.funcionario?.equipe?.nome}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          {new Date(ferias.data_inicio).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="text-gray-500">
                          até {new Date(ferias.data_fim).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="font-medium">{diasUteis}</span> dias
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {ferias.ano_referencia}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${statusInfo.color}-100 text-${statusInfo.color}-800`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleView(ferias)}
                            className="text-gray-400 hover:text-gray-600"
                            title="Visualizar"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          {ferias.status === 'solicitado' && (
                            <>
                              <button
                                onClick={() => handleApprove(ferias)}
                                className="text-green-400 hover:text-green-600"
                                title="Aprovar"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleReject(ferias)}
                                className="text-red-400 hover:text-red-600"
                                title="Rejeitar"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          
                          {ferias.status === 'aprovado' && (
                            <button
                              onClick={() => handleStart(ferias)}
                              className="text-yellow-400 hover:text-yellow-600"
                              title="Iniciar"
                            >
                              <Play className="h-4 w-4" />
                            </button>
                          )}
                          
                          {ferias.status === 'em_andamento' && (
                            <button
                              onClick={() => handleComplete(ferias)}
                              className="text-blue-400 hover:text-blue-600"
                              title="Concluir"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleEdit(ferias)}
                            className="text-blue-400 hover:text-blue-600"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(ferias)}
                            className="text-red-400 hover:text-red-600"
                            title="Remover"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {ferias.length === 0 && (
              <div className="text-center py-12">
                <CalendarDays className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Nenhuma férias encontrada
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Comece solicitando um período de férias.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal será implementado em componente separado */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <h3 className="text-lg font-medium mb-4">
              {modalType === 'create' && 'Solicitar Férias'}
              {modalType === 'edit' && 'Editar Férias'}
              {modalType === 'view' && 'Detalhes das Férias'}
            </h3>
            
            <div className="text-center py-8 text-gray-500">
              Modal em desenvolvimento...
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-outline"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FeriasPage
