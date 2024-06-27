[Setup]
AppName=MsgHL
AppVersion=1.0
DefaultDirName={pf}\MsgHL
DefaultGroupName=MsgHL
OutputDir=.
OutputBaseFilename=MsgHLInstaller
Compression=lzma
SolidCompression=yes
PrivilegesRequired=admin

[Files]
; Electron App
Source: "dist\win-unpacked\*"; DestDir: "{app}\dist\win-unpacked"; Flags: ignoreversion recursesubdirs createallsubdirs
; Chrome Extension
Source: "chrome-extension\*"; DestDir: "{userappdata}\MsgHL\chrome-extension"; Flags: ignoreversion recursesubdirs createallsubdirs
; Screensaver from custom path
Source: "C:\Users\Dell\source\repos\MyScreenSaver\MyScreenSaver\bin\Debug\screensaver\*"; DestDir: "{app}\screensaver"; Flags: ignoreversion recursesubdirs createallsubdirs
; .NET Installer
Source: "dotnet-installer.exe"; DestDir: "{tmp}"; Flags: ignoreversion
; Batch file for screensaver
Source: "SetScreensaver.bat"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{group}\MsgHL"; Filename: "{app}\dist\win-unpacked\companynotificationapp.exe"
Name: "{group}\Uninstall MsgHL"; Filename: "{uninstallexe}"

[Run]
; Run the screensaver batch script
Filename: "{app}\SetScreensaver.bat"; Flags: runhidden runascurrentuser
; Install .NET Framework
Filename: "{tmp}\dotnet-installer.exe"; Flags: waituntilterminated

[Registry]
Root: "HKCU"; Subkey: "Software\Microsoft\Windows\CurrentVersion\Run"; ValueType: string; ValueName: "MsgHL"; ValueData: """{app}\dist\win-unpacked\companynotificationapp.exe"""; Flags: uninsdeletevalue

[UninstallRun]
; Remove the screensaver setting
Filename: "cmd"; Parameters: "/c reg delete ""HKEY_CURRENT_USER\Control Panel\Desktop"" /v SCRNSAVE.EXE /f"; Flags: runhidden runascurrentuser

[Code]
procedure CurStepChanged(CurStep: TSetupStep);
begin
  if CurStep = ssPostInstall then begin
    ExtractTemporaryFile('dotnet-installer.exe');
  end;
end;
