import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Check, 
  X,
  Upload,
  Download,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { api } from '../../services/api'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { toast } from 'react-hot-toast'

const AtestadosPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFuncionario, setSelectedFuncionario] = useState('')
  const [selectedTipo, setSelectedTipo] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [dateRange, setDateRange] = useState({ inicio: '', fim: '' })
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('create')
  const [selectedAtestado, setSelectedAtestado] = useState(null)

  const queryClient = useQueryClient()

  // Queries
  const { data: atestados = [], isLoading: loadingAtestados } = useQuery({
    queryKey: ['atestados', searchTerm, selectedFuncionario, selectedTipo, selectedStatus, dateRange],
    queryFn: () => {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (selectedFuncionario) params.append('funcionario_id', selectedFuncionario)
      if (selectedTipo) params.append('tipo', selectedTipo)
      if (selectedStatus) params.append('status', selectedStatus)
      if (dateRange.inicio) params.append('data_inicio', dateRange.inicio)
      if (dateRange.fim) params.append('data_fim', dateRange.fim)
      
      return api.get(`/atestados?${params.toString()}`).then(res => res.data)
    }
  })

  const { data: funcionarios = [] } = useQuery({
    queryKey: ['funcionarios-ativos'],
    queryFn: () => api.get('/funcionarios?ativo=true').then(res => res.data)
  })

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/atestados/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['atestados'])
      toast.success('Atestado removido com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao remover atestado')
    }
  })

  const validationMutation = useMutation({
    mutationFn: ({ id, validado, observacoes }) => 
      api.patch(`/atestados/${id}/validacao`, { validado, observacoes }),
    onSuccess: () => {
      queryClient.invalidateQueries(['atestados'])
      toast.success('Status de validação atualizado!')
    },
    onError: () => {
      toast.error('Erro ao atualizar validação')
    }
  })

  // Tipos de atestado
  const tiposAtestado = [
    { value: 'medico', label: 'Médico', color: 'blue' },
    { value: 'odontologico', label: 'Odontológico', color: 'green' },
    { value: 'psicologico', label: 'Psicológico', color: 'purple' },
    { value: 'outros', label: 'Outros', color: 'gray' }
  ]

  // Estatísticas
  const stats = {
    total: atestados.length,
    pendentes: atestados.filter(a => a.validado === null).length,
    validados: atestados.filter(a => a.validado === true).length,
    rejeitados: atestados.filter(a => a.validado === false).length
  }

  const getTipoInfo = (tipo) => {
    return tiposAtestado.find(t => t.value === tipo) || { label: tipo, color: 'gray' }
  }

  const getStatusInfo = (validado) => {
    if (validado === null) return { label: 'Pendente', color: 'yellow', icon: Clock }
    if (validado === true) return { label: 'Validado', color: 'green', icon: CheckCircle }
    return { label: 'Rejeitado', color: 'red', icon: AlertCircle }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleValidate = (atestado) => {
    if (window.confirm(`Validar atestado de ${atestado.funcionario?.nome}?`)) {
      validationMutation.mutate({ id: atestado.id, validado: true })
    }
  }

  const handleReject = (atestado) => {
    const observacoes = window.prompt('Motivo da rejeição (opcional):')
    if (observacoes !== null) {
      validationMutation.mutate({ id: atestado.id, validado: false, observacoes })
    }
  }

  const handleDownload = async (atestado) => {
    try {
      const response = await api.get(`/atestados/${atestado.id}/download`, {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', atestado.nome_arquivo)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      toast.error('Erro ao baixar arquivo')
    }
  }

  const handleEdit = (atestado) => {
    setSelectedAtestado(atestado)
    setModalType('edit')
    setShowModal(true)
  }

  const handleView = (atestado) => {
    setSelectedAtestado(atestado)
    setModalType('view')
    setShowModal(true)
  }

  const handleDelete = (atestado) => {
    if (window.confirm(`Remover atestado de ${atestado.funcionario?.nome}?`)) {
      deleteMutation.mutate(atestado.id)
    }
  }

  const handleCreate = () => {
    setSelectedAtestado(null)
    setModalType('create')
    setShowModal(true)
  }

  if (loadingAtestados) {
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
          <h1 className="text-2xl font-bold text-gray-900">Atestados Médicos</h1>
          <p className="text-gray-600">Gerencie atestados e documentos médicos</p>
        </div>
        <button
          onClick={handleCreate}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Atestado
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-content p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-100">
                <FileText className="h-6 w-6 text-blue-600" />
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
                <p className="text-sm font-medium text-gray-600">Validados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.validados}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-red-100">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejeitados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rejeitados}</p>
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
              {tiposAtestado.map(tipo => (
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
              <option value="validado">Validados</option>
              <option value="rejeitado">Rejeitados</option>
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
                    Período
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Arquivo
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
                {atestados.map((atestado) => {
                  const tipoInfo = getTipoInfo(atestado.tipo)
                  const statusInfo = getStatusInfo(atestado.validado)
                  const StatusIcon = statusInfo.icon

                  return (
                    <tr key={atestado.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {atestado.funcionario?.nome}
                        </div>
                        <div className="text-sm text-gray-500">
                          {atestado.funcionario?.equipe?.nome}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${tipoInfo.color}-100 text-${tipoInfo.color}-800`}>
                          {tipoInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          {new Date(atestado.data_inicio).toLocaleDateString('pt-BR')}
                        </div>
                        {atestado.data_fim && atestado.data_fim !== atestado.data_inicio && (
                          <div className="text-gray-500">
                            até {new Date(atestado.data_fim).toLocaleDateString('pt-BR')}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {atestado.nome_arquivo && (
                          <div>
                            <div className="font-medium truncate max-w-32" title={atestado.nome_arquivo}>
                              {atestado.nome_arquivo}
                            </div>
                            <div className="text-gray-500">
                              {formatFileSize(atestado.tamanho_arquivo)}
                            </div>
                          </div>
                        )}
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
                            onClick={() => handleView(atestado)}
                            className="text-gray-400 hover:text-gray-600"
                            title="Visualizar"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          {atestado.nome_arquivo && (
                            <button
                              onClick={() => handleDownload(atestado)}
                              className="text-blue-400 hover:text-blue-600"
                              title="Baixar arquivo"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          )}
                          
                          {atestado.validado === null && (
                            <>
                              <button
                                onClick={() => handleValidate(atestado)}
                                className="text-green-400 hover:text-green-600"
                                title="Validar"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleReject(atestado)}
                                className="text-red-400 hover:text-red-600"
                                title="Rejeitar"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          
                          <button
                            onClick={() => handleEdit(atestado)}
                            className="text-blue-400 hover:text-blue-600"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(atestado)}
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

            {atestados.length === 0 && (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Nenhum atestado encontrado
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Comece enviando um novo atestado.
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
              {modalType === 'create' && 'Novo Atestado'}
              {modalType === 'edit' && 'Editar Atestado'}
              {modalType === 'view' && 'Detalhes do Atestado'}
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

export default AtestadosPage
