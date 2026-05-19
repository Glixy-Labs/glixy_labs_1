; Inno Setup script — produces GlixyAether-Setup.exe
; Build the EXE first with build-windows.ps1, then compile this script
; with Inno Setup (https://jrsoftware.org/isinfo.php).

#define MyAppName "Glixy Aether"
#define MyAppVersion "0.4.3"
#define MyAppPublisher "Glixy Labs"
#define MyAppURL "https://glixylabs.com/product-aether.html"
#define MyAppExeName "GlixyAether.exe"

[Setup]
AppId={{B5C0E2A2-1234-4F4F-9C5E-AEAEAEAEAEAE}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
DefaultDirName={localappdata}\Aether
DefaultGroupName=Glixy Aether
OutputDir=dist
OutputBaseFilename=GlixyAether-Setup
Compression=lzma
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=lowest
DisableProgramGroupPage=yes
UninstallDisplayIcon={app}\{#MyAppExeName}

[Files]
Source: "dist\{#MyAppExeName}"; DestDir: "{app}"; Flags: ignoreversion
Source: "README.md";            DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{group}\Glixy Aether";        Filename: "{app}\{#MyAppExeName}"
Name: "{userdesktop}\Glixy Aether";  Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

[Tasks]
Name: "desktopicon"; Description: "Create a Desktop shortcut"; GroupDescription: "Additional shortcuts:"

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "Launch Glixy Aether now"; Flags: nowait postinstall skipifsilent
