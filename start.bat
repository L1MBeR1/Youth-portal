@echo off

REM Переход в папку
E:
cd "%~dp0"

echo .ENV files must be copied manually!

REM Устанавливаем переменные по умолчанию
set INIT=0
set BB=0

REM Обрабатываем параметры командной строки
:parse_args
if "%1"=="" goto args_parsed
if "%1"=="init" set INIT=1
if "%1"=="bb" set BB=1
shift
goto parse_args

:args_parsed

E:
cd "%~dp0"

REM Запускаем frontend
cd frontend

if %INIT% == 1 (
    echo Installing dependencies for frontend...
    call npm install
)

echo Starting frontend...
set BROWSER=none
start "" cmd /c "npm run start"

REM Возвращаемся в корневую директорию
cd ..

REM Запускаем backend
cd backend

if %INIT% == 1 (
    echo Installing dependencies for backend...
	call npm install
    call composer install
)

if %BB% == 1 (
    echo Build...
    call npm run build
)

echo Starting backend...
start "" php artisan serve

REM Возвращаемся в корневую директорию
cd ..
