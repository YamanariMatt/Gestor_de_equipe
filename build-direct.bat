@echo off
echo ========================================
echo    EXTRANEF - Build Direto (Electron)
echo ========================================
echo.

echo Verificando se a aplicacao esta funcionando...
npm start --silent >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: A aplicacao nao esta funcionando!
    echo Execute 'npm start' primeiro para testar.
    echo.
    pause
    exit /b 1
)

echo.
echo Criando estrutura de build...
if not exist "build" mkdir build
if not exist "build\app" mkdir build\app

echo.
echo Copiando arquivos da aplicacao...
copy "main.js" "build\app\" >nul 2>&1
copy "preload.js" "build\app\" >nul 2>&1
copy "script-electron.js" "build\app\" >nul 2>&1
copy "style-electron.css" "build\app\" >nul 2>&1
copy "index-electron.html" "build\app\" >nul 2>&1
copy "adm-electron.html" "build\app\" >nul 2>&1
copy "faltas.html" "build\app\" >nul 2>&1
copy "ferias.html" "build\app\" >nul 2>&1
copy "atestados.html" "build\app\" >nul 2>&1
copy "produtividade.html" "build\app\" >nul 2>&1
copy "comissao.html" "build\app\" >nul 2>&1
copy "adm.html" "build\app\" >nul 2>&1
copy "style.css" "build\app\" >nul 2>&1
copy "script.js" "build\app\" >nul 2>&1
copy "exemplo-dados.csv" "build\app\" >nul 2>&1

echo.
echo Copiando node_modules...
xcopy "node_modules" "build\app\node_modules\" /E /I /Q >nul 2>&1

echo.
echo Copiando package.json...
copy "package.json" "build\app\" >nul 2>&1

echo.
echo Criando executavel...
echo @echo off > "build\EXTRANEF.bat"
echo cd /d "%%~dp0app" >> "build\EXTRANEF.bat"
echo electron . >> "build\EXTRANEF.bat"

echo.
echo ========================================
echo    Build concluido!
echo ========================================
echo.
echo Executavel criado em: build\EXTRANEF.bat
echo.
echo Para usar:
echo 1. Va para a pasta build
echo 2. Execute EXTRANEF.bat
echo.
pause
