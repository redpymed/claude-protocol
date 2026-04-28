#!/usr/bin/env bash
# claude-protocol installer (Unix / macOS / Linux / WSL)
#
# Uso:
#   curl -fsSL https://raw.githubusercontent.com/redpymed/claude-protocol/main/install.sh | bash
#
# Variables de entorno opcionales:
#   CLAUDE_PROTOCOL_DIR — directorio de instalación (default: ~/.claude-protocol)
#   CLAUDE_PROTOCOL_REPO — URL del repo (default: https://github.com/redpymed/claude-protocol.git)
#   CLAUDE_PROTOCOL_REF — branch/tag a instalar (default: main)

set -euo pipefail

# ---------- Colores ----------
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

err() { echo -e "${RED}✗ $1${RESET}" >&2; }
ok()  { echo -e "${GREEN}✓ $1${RESET}"; }
info(){ echo -e "${CYAN}ℹ $1${RESET}"; }
warn(){ echo -e "${YELLOW}⚠ $1${RESET}"; }
step(){ echo -e "\n${CYAN}▶${RESET} ${BOLD}$1${RESET}"; }

# ---------- Configuración ----------
INSTALL_DIR="${CLAUDE_PROTOCOL_DIR:-$HOME/.claude-protocol}"
REPO_URL="${CLAUDE_PROTOCOL_REPO:-https://github.com/redpymed/claude-protocol.git}"
REF="${CLAUDE_PROTOCOL_REF:-main}"

echo -e "\n${BOLD}claude-protocol installer${RESET}\n"

# ---------- Verificaciones ----------
step "Verificando dependencias"

if ! command -v git >/dev/null 2>&1; then
  err "git no está instalado. Instálalo primero."
  exit 1
fi
ok "git encontrado"

if ! command -v node >/dev/null 2>&1; then
  err "Node.js no está instalado. Necesitas Node ≥ 18."
  echo "  Instalación recomendada con nvm: https://github.com/nvm-sh/nvm"
  exit 1
fi

NODE_MAJOR=$(node -p "process.versions.node.split('.')[0]")
if [ "$NODE_MAJOR" -lt 18 ]; then
  err "Node ≥ 18 requerido. Tienes $(node -v)."
  exit 1
fi
ok "Node $(node -v) encontrado"

# ---------- Clonar / actualizar ----------
step "Instalando en $INSTALL_DIR"

if [ -d "$INSTALL_DIR/.git" ]; then
  info "Directorio existente. Actualizando…"
  cd "$INSTALL_DIR"
  git fetch --quiet origin "$REF"
  git checkout --quiet "$REF"
  git reset --hard --quiet "origin/$REF"
  ok "Actualizado a la última versión de '$REF'"
else
  if [ -d "$INSTALL_DIR" ] && [ -n "$(ls -A "$INSTALL_DIR" 2>/dev/null)" ]; then
    err "$INSTALL_DIR existe y no está vacío. Elimínalo o usa CLAUDE_PROTOCOL_DIR para otro path."
    exit 1
  fi
  git clone --quiet --branch "$REF" "$REPO_URL" "$INSTALL_DIR"
  ok "Clonado desde $REPO_URL"
fi

# ---------- Detectar shell ----------
step "Configurando alias en tu shell"

SHELL_NAME="$(basename "${SHELL:-/bin/bash}")"
case "$SHELL_NAME" in
  bash) PROFILE="$HOME/.bashrc" ;;
  zsh)  PROFILE="$HOME/.zshrc" ;;
  fish) PROFILE="$HOME/.config/fish/config.fish" ;;
  *)    PROFILE="" ;;
esac

ALIAS_LINE="alias claude-protocol=\"node $INSTALL_DIR/bootstrap.mjs\""
FISH_ALIAS="alias claude-protocol \"node $INSTALL_DIR/bootstrap.mjs\""

if [ -z "$PROFILE" ]; then
  warn "Shell '$SHELL_NAME' no reconocido automáticamente."
  echo "  Añade manualmente este alias a tu archivo de configuración:"
  echo "    $ALIAS_LINE"
elif [ -f "$PROFILE" ] && grep -q "claude-protocol=" "$PROFILE" 2>/dev/null; then
  ok "Alias ya existe en $PROFILE"
else
  if [ "$SHELL_NAME" = "fish" ]; then
    mkdir -p "$(dirname "$PROFILE")"
    echo "$FISH_ALIAS" >> "$PROFILE"
  else
    echo "" >> "$PROFILE"
    echo "# claude-protocol" >> "$PROFILE"
    echo "$ALIAS_LINE" >> "$PROFILE"
  fi
  ok "Alias añadido a $PROFILE"
fi

# ---------- Final ----------
echo -e "\n${BOLD}${GREEN}✅ Instalación completada${RESET}\n"
echo "Para empezar a usarlo en esta misma sesión:"
echo -e "  ${CYAN}source $PROFILE${RESET}"
echo "  ${CYAN}# o abre una nueva terminal${RESET}"
echo ""
echo "Después, en cualquier proyecto:"
echo -e "  ${CYAN}claude-protocol new${RESET}      # bootstrap proyecto nuevo"
echo -e "  ${CYAN}claude-protocol adapt${RESET}    # adaptar proyecto activo"
echo -e "  ${CYAN}claude-protocol check${RESET}    # diagnóstico"
echo -e "  ${CYAN}claude-protocol update${RESET}   # actualizar universales"
echo -e "  ${CYAN}claude-protocol --help${RESET}   # ayuda completa"
echo ""
echo "Documentación: $REPO_URL"
echo ""
