import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Check, 
  X,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { api } from '../../services/api'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { toast } from 'react-hot-toast'

const FaltasPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFuncionario, setSelectedFuncionario] = useState('')
  const [selectedTipo, setSelectedTipo] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [dateRange, setDateRange] = useState({ inicio: '', fim: '' })
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('create')
  const [selectedFalta, setSelectedFalta] = useState(null)

  const queryClient = useQueryClient()

  // Queries
  const { data: faltas = [], isLoading: loadingFaltas } = useQuery({
    queryKey: ['faltas', searchTerm, selectedFuncionario, selectedTipo, selectedStatus, dateRange],
    queryFn: () => {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (selectedFuncionario) params.append('funcionario_id', selectedFuncionario)
      if (selectedTipo) params.append('tipo', selectedTipo)
      if (selectedStatus) params.append('status', selectedStatus)
      if (dateRange.inicio) params.append('data_inicio', dateRange.inicio)
      if (dateRange.fim) params.append('data_fim', dateRange.fim)
      
      return api.get(`/faltas?${params.toString()}`).then(res => res.data)
    }
  })

  const { data: funcionarios = [] } = useQuery({
    queryKey: ['funcionarios-ativos'],
    queryFn: () => api.get('/funcionarios?ativo=true').then(res => res.data)
  })

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/faltas/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['faltas'])
      toast.success('Falta removida com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao remover falta')
    }
  })

  const approvalMutation = useMutation({
    mutationFn: ({ id, aprovado, observacoes }) => 
      api.patch(`/faltas/${id}/aprovacao`, { aprovado, observacoes }),
    onSuccess: () => {
      queryClient.invalidateQueries(['faltas'])
      toast.success('Status de aprovação atualizado!')
    },
    onError: () => {
      toast.error('Erro ao atualizar aprovação')
    }
  })

  // Tipos de falta
  const tiposFalta = [
    { value: 'falta', label: 'Falta', color: 'red' },
    { value: 'atraso', label: 'Atraso', color: 'yellow' },
    { value: 'saida_antecipada', label: 'Saída Antecipada', color: 'orange' },
    { value: 'falta_justificada', label: 'Falta Justificada', color: 'blue' }
  ]

  // Estatísticas
  const stats = {
    total: faltas.length,
    pendentes: faltas.filter(f => f.aprovado === null).length,
    aprovadas: faltas.filter(f => f.aprovado === true).length,
    rejeitadas: faltas.filter(f => f.aprovado === false).length
  }

  const getTipoInfo = (tipo) => {
    return tiposFalta.find(t => t.value === tipo) || { label: tipo, color: 'gray' }
  }

  const getStatusInfo = (aprovado) => {
    if (aprovado === null) return { label: 'Pendente', color: 'yellow', icon: Clock }
    if (aprovado === true) return { label: 'Aprovado', color: 'green', icon: CheckCircle }
    return { label: 'Rejeitado', color: 'red', icon: X }
  }

  const handleApprove = (falta) => {
    if (window.confirm(`Aprovar falta de ${falta.funcionario?.nome}?`)) {
      approvalMutation.mutate({ id: falta.id, aprovado: true })
    }
  }

  const handleReject = (falta) => {
    const observacoes = window.prompt('Motivo da rejeição (opcional):')
    if (observacoes !== null) {
      approvalMutation.mutate({ id: falta.id, aprovado: false, observacoes })
    }
  }

  const handleEdit = (falta) => {
    setSelectedFalta(falta)
    setModalType('edit')
    setShowModal(true)
  }

  const handleView = (falta) => {
    setSelectedFalta(falta)
    setModalType('view')
    setShowModal(true)
  }

  const handleDelete = (falta) => {
    if (window.confirm(`Remover falta de ${falta.funcionario?.nome}?`)) {
      deleteMutation.mutate(falta.id)
    }
  }

  const handleCreate = () => {
    setSelectedFalta(null)
    setModalType('create')
    setShowModal(true)
  }

  if (loadingFaltas) {
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
          <h1 className="text-2xl font-bold text-gray-900">Controle de Faltas</h1>
          <p className="text-gray-600">Gerencie faltas, atrasos e saídas antecipadas</p>
        </div>
        <button
          onClick={handleCreate}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Registrar Falta
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-content p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-100">
                <Calendar className="h-6 w-6 text-blue-600" />
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
              <div className="p-2 rounded-lg bg-yellow-100">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendentes}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
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
              <div className="p-2 rounded-lg bg-red-100">
                <X className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejeitadas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rejeitadas}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="card-content p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar..."
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
              value={selectedTipo}
              onChange={(e) => setSelectedTipo(e.target.value)}
              className="input"
            >
              <option value="">Todos os tipos</option>
              {tiposFalta.map(tipo => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input"
            >
              <option value="">Todos os status</option>
              <option value="pendente">Pendentes</option>
              <option value="aprovado">Aprovadas</option>
              <option value="rejeitado">Rejeitadas</option>
            </select>

            <input
              type="date"
              value={dateRange.inicio}
              onChange={(e) => setDateRange(prev => ({ ...prev, inicio: e.target.value }))}
              className="input"
              placeholder="Data início"
            />

            <input
              type="date"
              value={dateRange.fim}
              onChange={(e) => setDateRange(prev => ({ ...prev, fim: e.target.value }))}
              className="input"
              placeholder="Data fim"
            />
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
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Motivo
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
                {faltas.map((falta) => {
                  const tipoInfo = getTipoInfo(falta.tipo)
                  const statusInfo = getStatusInfo(falta.aprovado)
                  const StatusIcon = statusInfo.icon

                  return (
                    <tr key={falta.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {falta.funcionario?.nome}
                        </div>
                        <div className="text-sm text-gray-500">
                          {falta.funcionario?.equipe?.nome}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${tipoInfo.color}-100 text-${tipoInfo.color}-800`}>
                          {tipoInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(falta.data_inicio).toLocaleDateString('pt-BR')}
                        {falta.data_fim && falta.data_fim !== falta.data_inicio && (
                          <span> - {new Date(falta.data_fim).toLocaleDateString('pt-BR')}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {falta.motivo || '-'}
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
                            onClick={() => handleView(falta)}
                            className="text-gray-400 hover:text-gray-600"
                            title="Visualizar"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          {falta.aprovado === null && (
                            <>
                              <button
                                onClick={() => handleApprove(falta)}
                                className="text-green-400 hover:text-green-600"
                                title="Aprovar"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleReject(falta)}
                                className="text-red-400 hover:text-red-600"
                                title="Rejeitar"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          
                          <button
                            onClick={() => handleEdit(falta)}
                            className="text-blue-400 hover:text-blue-600"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(falta)}
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

            {faltas.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Nenhuma falta encontrada
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Comece registrando uma nova falta.
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
              {modalType === 'create' && 'Registrar Falta'}
              {modalType === 'edit' && 'Editar Falta'}
              {modalType === 'view' && 'Detalhes da Falta'}
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

export default FaltasPage
