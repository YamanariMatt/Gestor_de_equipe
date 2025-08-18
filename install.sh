#!/bin/bash

echo "========================================"
echo "    EXTRANEF - Instalador Linux/macOS"
echo "========================================"
echo

echo "Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "ERRO: Node.js não encontrado!"
    echo "Por favor, instale o Node.js 16.0+ de: https://nodejs.org/"
    echo
    read -p "Pressione Enter para sair..."
    exit 1
fi

echo "Node.js encontrado: $(node --version)"
echo

echo "Verificando npm..."
if ! command -v npm &> /dev/null; then
    echo "ERRO: npm não encontrado!"
    echo "Por favor, instale o npm junto com o Node.js"
    echo
    read -p "Pressione Enter para sair..."
    exit 1
fi

echo "npm encontrado: $(npm --version)"
echo

echo "Instalando dependências..."
npm install
if [ $? -ne 0 ]; then
    echo "ERRO: Falha na instalação das dependências!"
    echo
    read -p "Pressione Enter para sair..."
    exit 1
fi

echo
echo "========================================"
echo "    Instalação concluída com sucesso!"
echo "========================================"
echo
echo "Para executar a aplicação:"
echo "  npm start"
echo
echo "Para desenvolvimento:"
echo "  npm run dev"
echo
echo "Para gerar executável:"
echo "  npm run build"
echo
echo "Para tornar executável (Linux/macOS):"
echo "  chmod +x dist/*/EXTRANEF"
echo
read -p "Pressione Enter para sair..."
