@echo off
echo ========================================
echo    EXTRANEF - Instalacao Limpa
echo ========================================
echo.

echo Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao encontrado!
    echo Por favor, instale o Node.js 16.0+ de: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Node.js encontrado!
echo.

echo Limpando cache e arquivos antigos...
if exist "node_modules" (
    rmdir /s /q "node_modules" 2>nul
    echo node_modules removido.
)

if exist "package-lock.json" (
    del "package-lock.json" 2>nul
    echo package-lock.json removido.
)

if exist "dist" (
    rmdir /s /q "dist" 2>nul
    echo Pasta dist removida.
)

if exist "build" (
    rmdir /s /q "build" 2>nul
    echo Pasta build removida.
)

echo.
echo Instalando dependencias...
npm install --no-cache

if %errorlevel% neq 0 (
    echo ERRO: Falha na instalacao das dependencias!
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo    Instalacao concluida com sucesso!
echo ========================================
echo.
echo Para executar a aplicacao:
echo   npm start
echo.
echo Para desenvolvimento:
echo   npm run dev
echo.
echo Para gerar executavel:
echo   npm run build:direct
echo.
pause
