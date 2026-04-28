# claude-protocol installer (Windows PowerShell)
#
# Uso:
#   iwr -useb https://raw.githubusercontent.com/redpymed/claude-protocol/main/install.ps1 | iex
#
# Variables de entorno opcionales:
#   $env:CLAUDE_PROTOCOL_DIR — directorio de instalación (default: $HOME\.claude-protocol)
#   $env:CLAUDE_PROTOCOL_REPO — URL del repo
#   $env:CLAUDE_PROTOCOL_REF — branch/tag a instalar

$ErrorActionPreference = "Stop"

# ---------- Configuración ----------
$InstallDir = if ($env:CLAUDE_PROTOCOL_DIR) { $env:CLAUDE_PROTOCOL_DIR } else { Join-Path $HOME ".claude-protocol" }
$RepoUrl    = if ($env:CLAUDE_PROTOCOL_REPO) { $env:CLAUDE_PROTOCOL_REPO } else { "https://github.com/redpymed/claude-protocol.git" }
$Ref        = if ($env:CLAUDE_PROTOCOL_REF) { $env:CLAUDE_PROTOCOL_REF } else { "main" }

Write-Host ""
Write-Host "claude-protocol installer" -ForegroundColor White
Write-Host ""

# ---------- Verificaciones ----------
Write-Host "▶ Verificando dependencias" -ForegroundColor Cyan

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "✗ git no está instalado. Instálalo desde https://git-scm.com" -ForegroundColor Red
    exit 1
}
Write-Host "✓ git encontrado" -ForegroundColor Green

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "✗ Node.js no está instalado. Necesitas Node ≥ 18." -ForegroundColor Red
    Write-Host "  Descarga: https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

$NodeVersion = (node -v).TrimStart('v')
$NodeMajor = [int]($NodeVersion.Split('.')[0])
if ($NodeMajor -lt 18) {
    Write-Host "✗ Node ≥ 18 requerido. Tienes v$NodeVersion." -ForegroundColor Red
    exit 1
}
Write-Host "✓ Node v$NodeVersion encontrado" -ForegroundColor Green

# ---------- Clonar / actualizar ----------
Write-Host ""
Write-Host "▶ Instalando en $InstallDir" -ForegroundColor Cyan

if (Test-Path (Join-Path $InstallDir ".git")) {
    Write-Host "ℹ Directorio existente. Actualizando…" -ForegroundColor Cyan
    Set-Location $InstallDir
    git fetch --quiet origin $Ref
    git checkout --quiet $Ref
    git reset --hard --quiet "origin/$Ref"
    Write-Host "✓ Actualizado a la última versión de '$Ref'" -ForegroundColor Green
}
else {
    if ((Test-Path $InstallDir) -and (Get-ChildItem $InstallDir -ErrorAction SilentlyContinue).Count -gt 0) {
        Write-Host "✗ $InstallDir existe y no está vacío. Elimínalo o usa CLAUDE_PROTOCOL_DIR para otro path." -ForegroundColor Red
        exit 1
    }
    git clone --quiet --branch $Ref $RepoUrl $InstallDir
    Write-Host "✓ Clonado desde $RepoUrl" -ForegroundColor Green
}

# ---------- Configurar profile ----------
Write-Host ""
Write-Host "▶ Configurando función en tu PowerShell profile" -ForegroundColor Cyan

$ProfilePath = $PROFILE.CurrentUserAllHosts
if (-not (Test-Path $ProfilePath)) {
    New-Item -ItemType File -Path $ProfilePath -Force | Out-Null
}

$BootstrapPath = Join-Path $InstallDir "bootstrap.mjs"
$FunctionDef = @"

# claude-protocol
function claude-protocol {
    node "$BootstrapPath" `$args
}
"@

$ProfileContent = if (Test-Path $ProfilePath) { Get-Content $ProfilePath -Raw } else { "" }

if ($ProfileContent -match "function claude-protocol") {
    Write-Host "✓ Función ya existe en $ProfilePath" -ForegroundColor Green
}
else {
    Add-Content -Path $ProfilePath -Value $FunctionDef
    Write-Host "✓ Función añadida a $ProfilePath" -ForegroundColor Green
}

# ---------- Final ----------
Write-Host ""
Write-Host "✅ Instalación completada" -ForegroundColor Green
Write-Host ""
Write-Host "Para empezar a usarlo en esta misma sesión:"
Write-Host "  . `$PROFILE" -ForegroundColor Cyan
Write-Host "  # o abre una nueva ventana de PowerShell" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Después, en cualquier proyecto:"
Write-Host "  claude-protocol new" -ForegroundColor Cyan
Write-Host "  claude-protocol adapt" -ForegroundColor Cyan
Write-Host "  claude-protocol check" -ForegroundColor Cyan
Write-Host "  claude-protocol update" -ForegroundColor Cyan
Write-Host "  claude-protocol --help" -ForegroundColor Cyan
Write-Host ""
Write-Host "Documentación: $RepoUrl"
Write-Host ""
