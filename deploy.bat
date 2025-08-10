@echo off
REM ==============================
REM Y-SSM Website GitHub Deploy Script
REM ==============================

REM Proje klasörüne gir
cd /d "%~dp0"

REM Git başlat
git init

REM Dosyaları ekle
git add .

REM Commit yap
git commit -m "İlk yükleme"

REM Branch adını main yap
git branch -M main

REM GitHub reposunu bağla
git remote add origin https://github.com/Hecmel/y-ssm-website.git

REM GitHub'a gönder
git push -u origin main

pause
