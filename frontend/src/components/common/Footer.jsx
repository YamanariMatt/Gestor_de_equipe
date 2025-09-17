import { Github, Mail, Phone, MapPin, Clock, Shield, Code, Heart } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const appVersion = '1.0.0'

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-primary-600 mb-2">NEF</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Sistema de Gestão de Equipes moderno e seguro, desenvolvido para 
                otimizar o controle de funcionários, faltas, férias e atestados.
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Sistema Seguro e Confiável</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Funcionalidades
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Gestão de Funcionários</li>
              <li>• Controle de Faltas</li>
              <li>• Gestão de Férias</li>
              <li>• Atestados Médicos</li>
              <li>• Relatórios e Análises</li>
              <li>• Gestão de Equipes</li>
            </ul>
          </div>

          {/* Technical Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Tecnologia
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <Code className="h-3 w-3" />
                <span>React + Vite</span>
              </li>
              <li className="flex items-center space-x-2">
                <Code className="h-3 w-3" />
                <span>Node.js + Express</span>
              </li>
              <li className="flex items-center space-x-2">
                <Code className="h-3 w-3" />
                <span>Supabase Database</span>
              </li>
              <li className="flex items-center space-x-2">
                <Code className="h-3 w-3" />
                <span>Tailwind CSS</span>
              </li>
            </ul>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>Versão {appVersion}</span>
            </div>
          </div>

          {/* Contact & Support */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Suporte & Contato
            </h4>
            <div className="space-y-3">
              <a 
                href="mailto:matheusvictormy@gmail.com"
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>matheusvictormy@gmail.com</span>
              </a>
              
              <a 
                href="https://github.com/YamanariMatt"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
              >
                <Github className="h-4 w-4" />
                <span>@YamanariMatt</span>
              </a>

              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                <span>Brasil</span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Suporte: Seg-Sex, 8h-18h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            
            {/* Copyright */}
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>© {currentYear} NEF - Sistema de Gestão de Equipes</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Todos os direitos reservados</span>
            </div>

            {/* Support Contact */}
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Suporte:</span>
              <a 
                href="https://github.com/YamanariMatt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Matheus Yamanari
              </a>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 space-y-1 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <span>Acesso restrito a usuários autorizados</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">Sistema seguro com autenticação JWT</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-3 w-3 text-green-500" />
                <span>Dados protegidos por RLS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
