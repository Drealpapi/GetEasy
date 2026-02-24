@echo off
echo ========================================
echo  CLEARING ALL CACHES
echo ========================================
echo.

echo [1/5] Stopping Node processes...
taskkill /F /IM node.exe 2>nul
if %errorlevel% == 0 (
    echo   Node processes stopped
) else (
    echo   No Node processes running
)
echo.

echo [2/5] Deleting cache folders...
if exist "node_modules\.cache" (
    rmdir /s /q "node_modules\.cache"
    echo   Deleted node_modules\.cache
)
if exist ".expo" (
    rmdir /s /q ".expo"
    echo   Deleted .expo
)
echo.

echo [3/5] Clearing NPM cache...
call npm cache clean --force
echo.

echo [4/5] Clearing Metro cache...
for /d %%i in ("%TEMP%\metro-*") do rmdir /s /q "%%i" 2>nul
for /d %%i in ("%TEMP%\haste-map-*") do rmdir /s /q "%%i" 2>nul
echo   Metro cache cleared
echo.

echo [5/5] All caches cleared!
echo.
echo ========================================
echo  NEXT STEPS:
echo ========================================
echo.
echo 1. Clear Expo Go cache on your phone:
echo    Android: Settings - Apps - Expo Go - Storage - Clear Cache
echo    iOS: Delete and reinstall Expo Go
echo.
echo 2. Run: npx expo start --clear --offline
echo.
echo 3. Scan the NEW QR code with Expo Go
echo.
echo ========================================
pause
