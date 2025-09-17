import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Bell, 
  Moon, 
  Sun, 
  Globe, 
  Clock,
  Database,
  Shield,
  Mail,
  Smartphone
} from 'lucide-react'

import DashboardLayout from '../../components/layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { api } from '../../services/api'

const ConfiguracoesPage = () => {
  const queryClient = useQueryClient()
  
  const [configuracoes, setConfiguracoes] = useState({
    backup_automatico: true,
    backup_intervalo: 24,
    notificacoes_email: true,
    notificacoes_push: true,
    tema: 'light',
    idioma: 'pt-BR',
    fuso_horario: 'America/Sao_Paulo'
  })

  // Buscar configurações
  const { data: configData, isLoading, error } = useQuery({
    queryKey: ['configuracoes'],
    queryFn: async () => {
      const response = await api.get('/configuracoes')
      return response.data
    },
    onSuccess: (data) => {
      if (data) {
        setConfiguracoes(prev => ({ ...prev, ...data }))
      }
    }
  })

  // Salvar configurações
  const { mutate: salvarConfiguracoes, isLoading: isSaving } = useMutation({
    mutationFn: async (novasConfiguracoes) => {
      const response = await api.put('/configuracoes', novasConfiguracoes)
      return response.data
    },
    onSuccess: () => {
      toast.success('Configurações salvas com sucesso!')
      queryClient.invalidateQueries(['configuracoes'])
    },
    onError: (error) => {
      toast.error('Erro ao salvar configurações: ' + (error.response?.data?.message || error.message))
    }
  })

  const handleInputChange = (field, value) => {
    setConfiguracoes(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    salvarConfiguracoes(configuracoes)
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Settings className="h-6 w-6 text-blue-600" />
              Configurações do Sistema
            </h1>
            <p className="text-gray-600 mt-1">
              Gerencie as configurações gerais do sistema NEF
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Configurações de Backup */}
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Database className="h-5 w-5 text-green-600" />
                Backup Automático
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Backup Automático
                    </label>
                    <p className="text-sm text-gray-500">
                      Realizar backup automático dos dados
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={configuracoes.backup_automatico}
                    onChange={(e) => handleInputChange('backup_automatico', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Intervalo de Backup (horas)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="168"
                    value={configuracoes.backup_intervalo}
                    onChange={(e) => handleInputChange('backup_intervalo', parseInt(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    disabled={!configuracoes.backup_automatico}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Configurações de Notificações */}
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Bell className="h-5 w-5 text-yellow-600" />
                Notificações
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Notificações por Email
                      </label>
                      <p className="text-sm text-gray-500">
                        Receber notificações via email
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={configuracoes.notificacoes_email}
                    onChange={(e) => handleInputChange('notificacoes_email', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-gray-500" />
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Notificações Push
                      </label>
                      <p className="text-sm text-gray-500">
                        Receber notificações no navegador
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={configuracoes.notificacoes_push}
                    onChange={(e) => handleInputChange('notificacoes_push', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Configurações de Interface */}
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Sun className="h-5 w-5 text-orange-600" />
                Interface
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tema
                  </label>
                  <select
                    value={configuracoes.tema}
                    onChange={(e) => handleInputChange('tema', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="light">Claro</option>
                    <option value="dark">Escuro</option>
                    <option value="auto">Automático</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Idioma
                  </label>
                  <select
                    value={configuracoes.idioma}
                    onChange={(e) => handleInputChange('idioma', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">English (US)</option>
                    <option value="es-ES">Español</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Fuso Horário
                  </label>
                  <select
                    value={configuracoes.fuso_horario}
                    onChange={(e) => handleInputChange('fuso_horario', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                    <option value="America/Manaus">Manaus (GMT-4)</option>
                    <option value="America/Rio_Branco">Rio Branco (GMT-5)</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => queryClient.invalidateQueries(['configuracoes'])}
              disabled={isSaving}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Recarregar
            </Button>
            
            <Button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}

export default ConfiguracoesPage
