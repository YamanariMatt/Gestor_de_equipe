@echo off
echo ========================================
echo    EXTRANEF - Build Simples
echo ========================================
echo.

echo Configurando variaveis de ambiente...
set ELECTRON_BUILDER_CACHE=false
set ELECTRON_BUILDER_OFFLINE=false
set ELECTRON_BUILDER_SIGN=false

echo.
echo Executando build sem assinatura...
echo.

echo Limpando cache antes do build...
if exist "%LOCALAPPDATA%\electron-builder" (
    rmdir /s /q "%LOCALAPPDATA%\electron-builder"
    echo Cache removido.
)

echo.
echo Iniciando build...
npx electron-builder --win --x64 --config electron-builder.json

echo.
echo Build concluido!
echo.
echo Verifique a pasta dist/ para o executavel.
pause
