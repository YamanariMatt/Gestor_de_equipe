# NEF - Sistema de Gestão de Equipe

Sistema web moderno para gestão de funcionários, controle de faltas, férias e atestados médicos.

## 🚀 Sobre o Projeto

O **NEF** é uma aplicação web completa para gestão de equipes, migrada do sistema desktop EXTRANEF para uma arquitetura moderna e escalável. O sistema oferece controle completo sobre funcionários, faltas, férias, atestados médicos e muito mais.

## ✨ Funcionalidades

### 👥 **Gestão de Funcionários**
- Cadastro completo com informações pessoais e profissionais
- Organização por equipes e cargos
- Controle de status (ativo/inativo)
- Histórico completo de atividades

### 📅 **Controle de Faltas**
- Registro de faltas, atrasos e saídas antecipadas
- Sistema de aprovação/rejeição
- Filtros avançados por período e funcionário
- Relatórios detalhados
- Tema escuro personalizável
- Menu lateral intuitivo
- Animações suaves
- Compatível com Windows, macOS e Linux

## 📋 Pré-requisitos

- **Node.js** 16+
- **npm**

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

## 📦 Build (Windows, sem admin)

1. Pasta executável (sem instalar):

```powershell
npm run pack:dir
```

Resultado: `dist/win-unpacked/EXTRANEF.exe`

2. ZIP para envio (opcional):

```powershell
npm run pack:zip
```

Resultado: `dist/EXTRANEF-win-unpacked.zip`

3. Alternativa para ambientes restritos (sem symlink):

```powershell
npm run pack:dir:alt
```

Resultado: `dist/EXTRANEF-win32-x64/EXTRANEF.exe`

4. Instalador (opcional; pode acionar SmartScreen):

```powershell
npm run dist
```

## 🏗️ Estrutura do Projeto (resumo)

```
extranef/
├── main.js            # Processo principal (IPC, persistência, backup, Drive)
├── preload.js         # Bridge segura (IPC) para o renderer
├── database.js        # StorageAdapter (Electron IPC + localStorage)
├── ui.js              # Toasts e integrações de menu/backup
├── *-electron.html    # Páginas (início, adm, módulos)
├── *.js               # Lógicas de cada página (funcionários, faltas, férias, atestados)
├── style-electron.css # Estilos
└── package.json
```

## 🎯 Como Usar

### 1. **Página Inicial**

- Visão geral do sistema
- Estatísticas em tempo real
- Acesso rápido a todas as funcionalidades

### 2. **Controle de Pessoal**

- **Faltas**: Registre ausências com motivo e observações
- **Férias**: Controle períodos de descanso
- **Atestados**: Gerencie justificativas médicas

### 3. **Configurações**

- **Comissão**: Ajuste percentual (padrão: 0.18%)
- **Tema**: Personalize cores da interface
- **Backup**: Exporte/importe todos os dados
- **Limpeza**: Remova dados específicos

## 📊 Exportações

- Relatórios para Drive: faltas/ferias dia/semana/mês (CSV/JSON)
- Exportações individuais por tela (CSV/JSON)

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
npm run build         # Gera executáveis
npm run dist          # Build para distribuição
npm run pack:dir      # Gera pasta win-unpacked (sem instalador)
npm run pack:zip      # Gera zip do win-unpacked
npm run pack:dir:alt  # Alternativa sem symlink
```

### Estrutura de Desenvolvimento

- **main.js**: Processo principal do Electron
- **preload.js**: Comunicação segura entre processos
- **script-electron.js**: Lógica da aplicação
- **style-electron.css**: Estilos e responsividade

## 📱 Funcionalidades Electron

### Menu da Aplicação

- **Arquivo**: Importar/Exportar CSV, Configurar pasta de backup, Sair
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

## ☁️ Google Drive (resumo)

- Configure em Administração → Google Drive (Client ID, Secret, Folder ID)
- Atestados sobem para `Atestados/<Nome do Funcionário>/`
- Relatórios por período vão para `Backups/Faltas` e `Backups/Ferias`

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

- **Email**: matheusvictormy@gmail.com
- **Documentação**: [Wiki do Projeto]
- **Issues**: [GitHub Issues]

## 🙏 Agradecimentos

- **Electron**: Framework para aplicações desktop
- **Node.js**: Runtime JavaScript
- **Comunidade**: Contribuições e feedback

---

**EXTRANEF** – Gestão de Pessoal com backups confiáveis e integração em nuvem.
