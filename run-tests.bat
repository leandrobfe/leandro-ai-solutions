@echo off
cd /d "%~dp0"

echo ========================================
echo  Leandro AI Solutions - Unit Tests
echo ========================================
echo.

:: Verifica se node_modules existe
if not exist "node_modules" (
    echo Instalando dependencias...
    echo.
    call npm install
    echo.
)

echo Executando testes...
echo.
call npm test

echo.
echo ========================================
echo  Testes finalizados!
echo ========================================
echo.
pause
