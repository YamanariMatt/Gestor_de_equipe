import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  UserCheck, 
  UserX,
  Download,
  Upload
} from 'lucide-react'
import { api } from '../../services/api'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { toast } from 'react-hot-toast'

const FuncionariosPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEquipe, setSelectedEquipe] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('create') // create, edit, view
  const [selectedFuncionario, setSelectedFuncionario] = useState(null)

  const queryClient = useQueryClient()

  // Queries
  const { data: funcionarios = [], isLoading: loadingFuncionarios } = useQuery({
    queryKey: ['funcionarios'],
    queryFn: () => api.get('/funcionarios').then(res => res.data)
  })

  const { data: equipes = [] } = useQuery({
    queryKey: ['equipes'],
    queryFn: () => api.get('/equipes').then(res => res.data)
  })

  const { data: cargos = [] } = useQuery({
    queryKey: ['cargos'],
    queryFn: () => api.get('/cargos').then(res => res.data)
  })

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/funcionarios/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['funcionarios'])
      toast.success('Funcionário removido com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao remover funcionário')
    }
  })

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, ativo }) => api.patch(`/funcionarios/${id}`, { ativo }),
    onSuccess: () => {
      queryClient.invalidateQueries(['funcionarios'])
      toast.success('Status atualizado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao atualizar status')
    }
  })

  // Filtros
  const filteredFuncionarios = funcionarios.filter(funcionario => {
    const matchesSearch = funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         funcionario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         funcionario.cpf.includes(searchTerm)
    
    const matchesEquipe = !selectedEquipe || funcionario.equipe_id === selectedEquipe
    
    const matchesStatus = !selectedStatus || 
                         (selectedStatus === 'ativo' && funcionario.ativo) ||
                         (selectedStatus === 'inativo' && !funcionario.ativo)

    return matchesSearch && matchesEquipe && matchesStatus
  })

  // Estatísticas
  const stats = {
    total: funcionarios.length,
    ativos: funcionarios.filter(f => f.ativo).length,
    inativos: funcionarios.filter(f => !f.ativo).length
  }

  const handleEdit = (funcionario) => {
    setSelectedFuncionario(funcionario)
    setModalType('edit')
    setShowModal(true)
  }

  const handleView = (funcionario) => {
    setSelectedFuncionario(funcionario)
    setModalType('view')
    setShowModal(true)
  }

  const handleDelete = (funcionario) => {
    if (window.confirm(`Tem certeza que deseja remover ${funcionario.nome}?`)) {
      deleteMutation.mutate(funcionario.id)
    }
  }

  const handleToggleStatus = (funcionario) => {
    const newStatus = !funcionario.ativo
    const action = newStatus ? 'ativar' : 'desativar'
    
    if (window.confirm(`Tem certeza que deseja ${action} ${funcionario.nome}?`)) {
      toggleStatusMutation.mutate({ id: funcionario.id, ativo: newStatus })
    }
  }

  const handleCreate = () => {
    setSelectedFuncionario(null)
    setModalType('create')
    setShowModal(true)
  }

  if (loadingFuncionarios) {
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
          <h1 className="text-2xl font-bold text-gray-900">Funcionários</h1>
          <p className="text-gray-600">Gerencie os funcionários da sua equipe</p>
        </div>
        <button
          onClick={handleCreate}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Funcionário
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-content p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
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
              <div className="p-2 rounded-lg bg-green-100">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ativos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.ativos}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-red-100">
                <UserX className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inativos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inativos}</p>
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
              value={selectedEquipe}
              onChange={(e) => setSelectedEquipe(e.target.value)}
              className="input"
            >
              <option value="">Todas as equipes</option>
              {equipes.map(equipe => (
                <option key={equipe.id} value={equipe.id}>
                  {equipe.nome}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input"
            >
              <option value="">Todos os status</option>
              <option value="ativo">Ativos</option>
              <option value="inativo">Inativos</option>
            </select>

            <div className="flex space-x-2">
              <button className="btn btn-outline flex-1">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </button>
              <button className="btn btn-outline flex-1">
                <Upload className="h-4 w-4 mr-2" />
                Importar
              </button>
            </div>
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
                    Equipe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cargo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admissão
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFuncionarios.map((funcionario) => (
                  <tr key={funcionario.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {funcionario.nome}
                        </div>
                        <div className="text-sm text-gray-500">
                          {funcionario.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {funcionario.equipe?.nome || 'Sem equipe'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {funcionario.cargo?.nome || 'Sem cargo'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        funcionario.ativo 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {funcionario.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(funcionario.data_admissao).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleView(funcionario)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(funcionario)}
                          className="text-blue-400 hover:text-blue-600"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(funcionario)}
                          className={`${funcionario.ativo ? 'text-red-400 hover:text-red-600' : 'text-green-400 hover:text-green-600'}`}
                          title={funcionario.ativo ? 'Desativar' : 'Ativar'}
                        >
                          {funcionario.ativo ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleDelete(funcionario)}
                          className="text-red-400 hover:text-red-600"
                          title="Remover"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredFuncionarios.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Nenhum funcionário encontrado
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || selectedEquipe || selectedStatus 
                    ? 'Tente ajustar os filtros de busca.'
                    : 'Comece criando um novo funcionário.'
                  }
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
              {modalType === 'create' && 'Novo Funcionário'}
              {modalType === 'edit' && 'Editar Funcionário'}
              {modalType === 'view' && 'Detalhes do Funcionário'}
            </h3>
            
            {/* Conteúdo do modal será implementado */}
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

export default FuncionariosPage
