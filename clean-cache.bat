@echo off
echo ========================================
echo    EXTRANEF - Limpeza COMPLETA de Cache
echo ========================================
echo.

echo Parando processos do Electron...
taskkill /f /im electron.exe >nul 2>&1
taskkill /f /im EXTRANEF.exe >nul 2>&1

echo.
echo Limpando cache do Electron...
echo.

echo Removendo cache do electron-builder...
if exist "%LOCALAPPDATA%\electron-builder" (
    rmdir /s /q "%LOCALAPPDATA%\electron-builder" 2>nul
    echo Cache do electron-builder removido COMPLETAMENTE.
) else (
    echo Cache do electron-builder nao encontrado.
)

echo.
echo Removendo cache do Electron...
if exist "%APPDATA%\Electron" (
    rmdir /s /q "%APPDATA%\Electron" 2>nul
    echo Cache do Electron removido.
) else (
    echo Cache do Electron nao encontrado.
)

echo.
echo Removendo cache do npm...
if exist "%APPDATA%\npm-cache" (
    rmdir /s /q "%APPDATA%\npm-cache" 2>nul
    echo Cache do npm removido.
) else (
    echo Cache do npm nao encontrado.
)

echo.
echo Removendo node_modules...
if exist "node_modules" (
    rmdir /s /q "node_modules" 2>nul
    echo node_modules removido.
) else (
    echo node_modules nao encontrado.
)

echo.
echo Removendo package-lock.json...
if exist "package-lock.json" (
    del "package-lock.json" 2>nul
    echo package-lock.json removido.
) else (
    echo package-lock.json nao encontrado.
)

echo.
echo Removendo pasta dist...
if exist "dist" (
    rmdir /s /q "dist" 2>nul
    echo Pasta dist removida.
) else (
    echo Pasta dist nao encontrada.
)

echo.
echo Removendo pasta build...
if exist "build" (
    rmdir /s /q "build" 2>nul
    echo Pasta build removida.
) else (
    echo Pasta build nao encontrada.
)

echo.
echo ========================================
echo    Limpeza COMPLETA concluida!
echo ========================================
echo.
echo Agora execute:
echo   npm install
echo   npm start
echo.
pause
