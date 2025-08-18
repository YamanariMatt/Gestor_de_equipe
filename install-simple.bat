@echo off
echo ========================================
echo    EXTRANEF - Instalacao Simples
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

echo Instalando dependencias...
npm install

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
pause
