# EXTRANEF - Sistema de Gestão

Sistema desktop completo para gestão de produtividade, comissão e controle de pessoal, desenvolvido com Electron.

## 🚀 Funcionalidades

### ✨ Principais

- **Gestão de Produtividade**: Acompanhe o desempenho da equipe
- **Cálculo de Comissões**: Automático sobre valores recuperados (configurável)
- **Controle de Pessoal**: Registre faltas, férias e atestados
- **Ranking e Relatórios**: Visualize dados em tabelas organizadas
- **Import/Export CSV**: Backup e restauração de dados
- **Configurações Flexíveis**: Personalize comissões e tema visual

### 🎨 Interface

- Design moderno e responsivo
- Tema escuro personalizável
- Menu lateral intuitivo
- Animações suaves
- Compatível com Windows, macOS e Linux

## 📋 Pré-requisitos

- **Node.js** 16.0 ou superior
- **npm** ou **yarn**
- **Git** (para clonar o repositório)

## 🛠️ Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd extranef
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Execute em modo desenvolvimento

```bash
npm run dev
```

### 4. Para produção

```bash
npm start
```

## 📦 Build da Aplicação

### Windows (sem perfil de administrador)

1. Gerar pasta executável (sem instalar):

```powershell
npm run pack:dir
```

Resultado: `dist/win-unpacked/EXTRANEF.exe`

2. Compactar para envio (opcional):

```powershell
npm run pack:zip
```

Resultado: `dist/EXTRANEF-win-unpacked.zip`

3. Instalador (opcional; pode disparar SmartScreen por falta de assinatura):

```powershell
npm run dist
```

Resultado: `dist/EXTRANEF Setup x.y.z.exe`

Observações:

- A configuração `sign: false` evita etapas de assinatura que podem exigir privilégios.
- Se o SmartScreen alertar, use “Executar mesmo assim”.

## 🏗️ Estrutura do Projeto

```
extranef/
├── main.js                 # Processo principal do Electron
├── preload.js             # Script de pré-carregamento
├── package.json           # Configurações e dependências
├── index-electron.html    # Página inicial
├── adm-electron.html      # Página de administração
├── script-electron.js     # Scripts principais
├── style-electron.css     # Estilos atualizados
├── assets/                # Ícones e recursos
└── README.md              # Este arquivo
```

## 🎯 Como Usar

### 1. **Página Inicial**

- Visão geral do sistema
- Estatísticas em tempo real
- Acesso rápido a todas as funcionalidades

### 2. **Gestão de Produtividade**

- Importe dados via CSV
- Visualize ranking de colaboradores
- Calcule comissões automaticamente

### 3. **Controle de Pessoal**

- **Faltas**: Registre ausências com motivo e observações
- **Férias**: Controle períodos de descanso
- **Atestados**: Gerencie justificativas médicas

### 4. **Configurações**

- **Comissão**: Ajuste percentual (padrão: 0.18%)
- **Tema**: Personalize cores da interface
- **Backup**: Exporte/importe todos os dados
- **Limpeza**: Remova dados específicos

## 📊 Formato dos Dados

### CSV para Produtividade

```csv
Nome,Carteira,Valor Recuperado,Produtividade
João Silva,12345,50000.00,95
Maria Santos,67890,75000.00,98
```

### Estrutura de Registros

```json
{
  "id": 1234567890,
  "nome": "Nome do Colaborador",
  "carteira": "12345",
  "data": "2024-01-15",
  "motivo": "Motivo da ausência",
  "observacoes": "Observações adicionais",
  "dataCriacao": "2024-01-15T10:30:00.000Z"
}
```

## ⚙️ Configurações

### Comissão

- **Padrão**: 0.18%
- **Range**: 0% a 100%
- **Precisão**: 4 casas decimais

### Tema

- **Cor Principal**: Dourado (#d4af37)
- **Fundo**: Cinza escuro (#1c1c1c)
- **Menu**: Cinza médio (#2b2b2b)

## 🔧 Desenvolvimento

### Scripts Disponíveis

```bash
npm start          # Executa a aplicação
npm run dev        # Executa com DevTools abertas
npm run build      # Gera executáveis
npm run dist       # Build para distribuição
npm run pack:dir   # Gera pasta win-unpacked (sem instalador)
npm run pack:zip   # Gera zip do win-unpacked
```

### Estrutura de Desenvolvimento

- **main.js**: Processo principal do Electron
- **preload.js**: Comunicação segura entre processos
- **script-electron.js**: Lógica da aplicação
- **style-electron.css**: Estilos e responsividade

## 📱 Funcionalidades Electron

### Menu da Aplicação

- **Arquivo**: Importar/Exportar CSV, Sair
- **Visualizar**: Recarregar, Zoom, DevTools
- **Ajuda**: Sobre o sistema

### Atalhos de Teclado

- `Ctrl+I`: Importar CSV
- `Ctrl+E`: Exportar CSV
- `Ctrl+Q`: Sair da aplicação
- `F12`: Abrir DevTools (em desenvolvimento)

### Diálogos de Sistema

- Seleção de arquivos nativa
- Salvamento de arquivos nativo
- Integração com sistema operacional

## 🚨 Solução de Problemas

### Erro de Dependências

```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro de Build

```bash
npm run build --verbose
```

### Problemas de Permissão (Linux/macOS)

```bash
chmod +x dist/*/EXTRANEF
```

## 🔒 Segurança

- **Context Isolation**: Ativado por padrão
- **Node Integration**: Desabilitado
- **Remote Module**: Desabilitado
- **Preload Script**: Comunicação segura via IPC

## 📈 Roadmap

### Versão 1.1

- [ ] Backup automático
- [ ] Relatórios em PDF
- [ ] Gráficos interativos
- [ ] Múltiplos usuários

### Versão 1.2

- [ ] Sincronização em nuvem
- [ ] API REST
- [ ] Notificações push
- [ ] Modo offline

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte técnico ou dúvidas:

- **Email**: matheusvictormy.com
- **Documentação**: [Wiki do Projeto]
- **Issues**: [GitHub Issues]

## 🙏 Agradecimentos

- **Electron**: Framework para aplicações desktop
- **Node.js**: Runtime JavaScript
- **Comunidade**: Contribuições e feedback

---

**EXTRANEF** - Transformando a gestão empresarial através da tecnologia.
