import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  UserPlus,
  Palette
} from 'lucide-react'
import { api } from '../../services/api'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { toast } from 'react-hot-toast'

const EquipesPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('create')
  const [selectedEquipe, setSelectedEquipe] = useState(null)

  const queryClient = useQueryClient()

  // Queries
  const { data: equipes = [], isLoading: loadingEquipes } = useQuery({
    queryKey: ['equipes'],
    queryFn: () => api.get('/equipes').then(res => res.data)
  })

  const { data: funcionarios = [] } = useQuery({
    queryKey: ['funcionarios'],
    queryFn: () => api.get('/funcionarios').then(res => res.data)
  })

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/equipes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['equipes'])
      toast.success('Equipe removida com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao remover equipe')
    }
  })

  // Cores disponíveis para equipes
  const coresDisponiveis = [
    { value: '#3B82F6', label: 'Azul', class: 'bg-blue-500' },
    { value: '#10B981', label: 'Verde', class: 'bg-green-500' },
    { value: '#F59E0B', label: 'Amarelo', class: 'bg-yellow-500' },
    { value: '#EF4444', label: 'Vermelho', class: 'bg-red-500' },
    { value: '#8B5CF6', label: 'Roxo', class: 'bg-purple-500' },
    { value: '#F97316', label: 'Laranja', class: 'bg-orange-500' },
    { value: '#06B6D4', label: 'Ciano', class: 'bg-cyan-500' },
    { value: '#84CC16', label: 'Lima', class: 'bg-lime-500' }
  ]

  // Filtrar equipes
  const filteredEquipes = equipes.filter(equipe =>
    equipe.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipe.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Contar funcionários por equipe
  const getFuncionariosPorEquipe = (equipeId) => {
    return funcionarios.filter(f => f.equipe_id === equipeId && f.ativo).length
  }

  const getCorInfo = (cor) => {
    return coresDisponiveis.find(c => c.value === cor) || { label: 'Personalizada', class: 'bg-gray-500' }
  }

  const handleEdit = (equipe) => {
    setSelectedEquipe(equipe)
    setModalType('edit')
    setShowModal(true)
  }

  const handleView = (equipe) => {
    setSelectedEquipe(equipe)
    setModalType('view')
    setShowModal(true)
  }

  const handleDelete = (equipe) => {
    const funcionariosNaEquipe = getFuncionariosPorEquipe(equipe.id)
    
    if (funcionariosNaEquipe > 0) {
      toast.error(`Não é possível remover a equipe. Existem ${funcionariosNaEquipe} funcionário(s) vinculado(s).`)
      return
    }

    if (window.confirm(`Tem certeza que deseja remover a equipe "${equipe.nome}"?`)) {
      deleteMutation.mutate(equipe.id)
    }
  }

  const handleCreate = () => {
    setSelectedEquipe(null)
    setModalType('create')
    setShowModal(true)
  }

  if (loadingEquipes) {
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
          <h1 className="text-2xl font-bold text-gray-900">Equipes</h1>
          <p className="text-gray-600">Organize funcionários em equipes de trabalho</p>
        </div>
        <button
          onClick={handleCreate}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Equipe
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
                <p className="text-sm font-medium text-gray-600">Total de Equipes</p>
                <p className="text-2xl font-bold text-gray-900">{equipes.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-100">
                <UserPlus className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Funcionários Ativos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {funcionarios.filter(f => f.ativo).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Média por Equipe</p>
                <p className="text-2xl font-bold text-gray-900">
                  {equipes.length > 0 ? Math.round(funcionarios.filter(f => f.ativo).length / equipes.length) : 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="card-content p-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar equipe..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>
      </div>

      {/* Grid de Equipes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipes.map((equipe) => {
          const funcionariosCount = getFuncionariosPorEquipe(equipe.id)
          const corInfo = getCorInfo(equipe.cor)

          return (
            <div key={equipe.id} className="card hover:shadow-lg transition-shadow">
              <div className="card-content p-6">
                {/* Header da equipe */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div 
                      className={`w-4 h-4 rounded-full ${corInfo.class}`}
                      style={{ backgroundColor: equipe.cor }}
                    />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {equipe.nome}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleView(equipe)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Visualizar"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(equipe)}
                      className="text-blue-400 hover:text-blue-600"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(equipe)}
                      className="text-red-400 hover:text-red-600"
                      title="Remover"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Descrição */}
                {equipe.descricao && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {equipe.descricao}
                  </p>
                )}

                {/* Estatísticas da equipe */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {funcionariosCount} funcionário{funcionariosCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  {equipe.created_at && (
                    <span className="text-xs text-gray-400">
                      Criada em {new Date(equipe.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </div>

                {/* Lista de funcionários (preview) */}
                {funcionariosCount > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {funcionarios
                        .filter(f => f.equipe_id === equipe.id && f.ativo)
                        .slice(0, 3)
                        .map(funcionario => (
                          <span
                            key={funcionario.id}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                          >
                            {funcionario.nome.split(' ')[0]}
                          </span>
                        ))}
                      {funcionariosCount > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                          +{funcionariosCount - 3} mais
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Estado vazio */}
      {filteredEquipes.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {searchTerm ? 'Nenhuma equipe encontrada' : 'Nenhuma equipe cadastrada'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm 
              ? 'Tente ajustar os termos de busca.'
              : 'Comece criando sua primeira equipe de trabalho.'
            }
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <button
                onClick={handleCreate}
                className="btn btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Equipe
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal será implementado em componente separado */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <h3 className="text-lg font-medium mb-4">
              {modalType === 'create' && 'Nova Equipe'}
              {modalType === 'edit' && 'Editar Equipe'}
              {modalType === 'view' && 'Detalhes da Equipe'}
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

export default EquipesPage
