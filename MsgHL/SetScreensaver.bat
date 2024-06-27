@echo off
:: Set the path to the screensaver within the installation directory
set "screensaverPath=%localappdata%\MyScreensaver\MyScreenSaver.scr"

:: Copy the screensaver to the System32 directory
copy "%screensaverPath%" "%systemroot%\System32"

:: Set the screensaver in the registry
reg add "HKEY_CURRENT_USER\Control Panel\Desktop" /v SCRNSAVE.EXE /t REG_SZ /d "%screensaverPath%" /f
reg add "HKEY_CURRENT_USER\Control Panel\Desktop" /v ScreenSaveActive /t REG_SZ /d 1 /f
