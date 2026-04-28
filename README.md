# claude-protocol

> Protocolo modular para [Claude Code](https://docs.claude.com/en/docs/claude-code/overview): un `CLAUDE.md` universal, normas por dominio (UX, arquitectura, seguridad, IA, calidad, observabilidad, operaciones), plantillas de proyecto y un bootstrap automatizado para crear o adaptar cualquier proyecto en segundos.

[![npm version](https://img.shields.io/npm/v/claude-protocol.svg)](https://www.npmjs.com/package/claude-protocol)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org)

---

## Por qué existe esto

Claude Code es potente, pero su efectividad depende de la calidad del `CLAUDE.md` y del contexto del proyecto. La mayoría de equipos:

1. Empiezan sin `CLAUDE.md` y van añadiendo reglas ad hoc.
2. Acaban con un `CLAUDE.md` monolítico, desordenado y cada vez más difícil de mantener.
3. Repiten los mismos errores entre proyectos porque no hay continuidad.

Este repositorio resuelve esos tres problemas:

- **Universal y portable**: las reglas que aplican a cualquier proyecto serio (seguridad, calidad, observabilidad…) están separadas de lo específico de cada proyecto.
- **Modular y enrutado**: Claude Code carga solo las normas pertinentes a la tarea actual, sin contaminar el contexto.
- **Bootstrap en un comando**: en proyectos nuevos crea la estructura completa; en proyectos activos detecta lo que hay y prepara una migración semántica delegada al propio Claude Code.

---

## Instalación

### Opción A — `npx` (recomendada, sin instalación global)

```bash
# En cualquier proyecto
cd mi-proyecto
npx claude-protocol new       # nuevo proyecto
npx claude-protocol adapt     # proyecto activo
npx claude-protocol check     # solo diagnóstico
```

### Opción B — Instalación global con npm

```bash
npm install -g claude-protocol

# Después, en cualquier proyecto:
claude-protocol new
claude-protocol adapt
```

### Opción C — Instalador curl (sin npm)

Para macOS / Linux / WSL:

```bash
curl -fsSL https://raw.githubusercontent.com/redpymed/claude-protocol/main/install.sh | bash
```

Para Windows (PowerShell):

```powershell
iwr -useb https://raw.githubusercontent.com/redpymed/claude-protocol/main/install.ps1 | iex
```

El instalador clona el repo a `~/.claude-protocol`, añade un alias y queda listo para usar.

### Opción D — GitHub Template

¿Vas a empezar un proyecto totalmente nuevo? En GitHub pulsa **"Use this template"** en este repo y se crea un repo nuevo con toda la estructura ya cargada. Después rellenas `descripcion.md` y `stack.md` y a trabajar.

### Opción E — git clone manual

```bash
git clone https://github.com/redpymed/claude-protocol.git ~/dev/claude-protocol
alias claude-protocol="node ~/dev/claude-protocol/bootstrap.mjs"
```

---

## Uso

### 🚀 Proyecto nuevo

```bash
mkdir mi-proyecto && cd mi-proyecto
claude-protocol new
```

Crea:
- `CLAUDE.md` y `docs/normas/*.md` (universales).
- Plantillas específicas del proyecto: `descripcion.md`, `stack.md`, `proyecto.md`, `errores.md`, `aciertos.md`, `funciones.md`.
- Carpetas auxiliares: `docs/adr/`, `docs/runbooks/`, `src/shared/`, `src/modules/`.

Después solo tienes que **rellenar `descripcion.md` y `stack.md`** y abrir Claude Code.

### 🔧 Proyecto activo (ya tiene CLAUDE.md o convenciones)

```bash
cd mi-proyecto-existente
claude-protocol adapt
```

El comando:
1. Detecta archivos legacy (`CLAUDE.md` viejo, `CONVENTIONS.md`, `.cursorrules`, etc.).
2. Hace backup completo en `.claude-backup-<timestamp>/`.
3. Instala los universales canónicos.
4. Crea las plantillas específicas que falten (sin tocar las que ya existen).
5. **Genera `MIGRATION-INSTRUCTIONS.md`** con un prompt listo para pegar en Claude Code, que hará la migración semántica del contenido viejo a los nuevos archivos.

> El script no intenta migrar el contenido por sí mismo. La parte mecánica la hace `bootstrap.mjs`; la parte semántica (decidir si una frase del CLAUDE.md viejo es "información del proyecto" o "regla de stack" o "atajo conocido") la delega a Claude Code, que es quien tiene la inteligencia para hacerlo bien.

### 🔄 Actualizar universales en proyectos existentes

Cuando se mejora el protocolo (nueva versión de este repo) y quieres propagarlo:

```bash
cd mi-proyecto
claude-protocol update
```

Solo toca los archivos universales. Los específicos (`descripcion.md`, `proyecto.md`, etc.) quedan intactos.

### 📋 Diagnóstico sin tocar nada

```bash
cd mi-proyecto
claude-protocol check
```

Te dice qué falta, qué está modificado vs. el canónico, y qué archivos legacy hay para migrar.

---

## Estructura del protocolo

```
proyecto/
├── CLAUDE.md            ← UNIVERSAL · constitución del proyecto, siempre cargada
├── descripcion.md       ← ESPECÍFICO · qué es este proyecto (rellena al inicio)
├── stack.md             ← ESPECÍFICO · con qué se construye (rellena al inicio)
├── proyecto.md          ← DINÁMICO · estado vivo (Claude lo actualiza)
├── errores.md           ← DINÁMICO · bitácora de lecciones aprendidas
├── aciertos.md          ← DINÁMICO · atajos descubiertos (MCPs, etc.)
├── funciones.md         ← DINÁMICO · catálogo de utilidades estandarizadas
└── docs/
    └── normas/          ← UNIVERSAL · cargadas según dominio de la tarea
        ├── normasUX.md              # UI, accesibilidad, i18n
        ├── normasArquitectura.md    # BD, API, multi-tenancy, eventos
        ├── normasSeguridad.md       # auth, RGPD, RLS, secrets
        ├── normasIA.md              # LLM, prompts, embeddings
        ├── normasCalidad.md         # tests, TS, lint, code review
        ├── normasObservabilidad.md  # logs, métricas, SLOs
        ├── normasOperaciones.md     # CI/CD, backups, DR
        └── normasClaudeCode.md      # skills, subagents, hooks, MCP
```

### Tipos de archivo

| Tipo | Archivos | Cambia con qué frecuencia |
|---|---|---|
| **Universal** (idéntico entre proyectos) | `CLAUDE.md`, `docs/normas/*` | Solo cuando evoluciona el protocolo. |
| **Específico estático** (por proyecto) | `descripcion.md`, `stack.md` | Cuando cambia alcance/negocio o stack. |
| **Específico dinámico** (vivos) | `proyecto.md`, `errores.md`, `aciertos.md`, `funciones.md` | Cada tarea o sesión. |

---

## Flujo de trabajo recomendado

### Para un equipo

1. Una persona del equipo (tech lead) clona y mantiene este repo, o usa la versión publicada en npm.
2. Cuando el equipo descubre una mejora del protocolo, la propone vía PR a este repo.
3. Periódicamente se ejecuta `claude-protocol update` en cada proyecto para propagar mejoras.

### Para proyectos en cliente

- El cliente puede instalar la misma herramienta y mantener su propia copia adaptada.
- O entregas un fork del repo con tus customizaciones y el cliente lo usa.

---

## Cómo funciona el modo `adapt`

```
ANTES (proyecto activo):              DESPUÉS:
mi-proyecto/                          mi-proyecto/
├── CLAUDE.md (versión vieja)         ├── CLAUDE.md (canónico v2.2)
├── docs/                             ├── descripcion.md (plantilla nueva)
│   └── conventions.md                ├── stack.md (plantilla nueva)
└── src/                              ├── proyecto.md (plantilla nueva)
                                      ├── errores.md (plantilla nueva)
                                      ├── aciertos.md (plantilla nueva)
                                      ├── funciones.md (plantilla nueva)
                                      ├── MIGRATION-INSTRUCTIONS.md ← prompt para Claude
                                      ├── docs/
                                      │   ├── normas/ ← 8 normas universales
                                      │   ├── adr/
                                      │   ├── runbooks/
                                      │   └── conventions.md (preservado)
                                      ├── src/
                                      └── .claude-backup-2026-04-28T15-30-00/
                                          ├── CLAUDE.md (el viejo)
                                          └── docs/conventions.md (copia)
```

Tras la migración con Claude Code (siguiendo `MIGRATION-INSTRUCTIONS.md`), el contenido del CLAUDE.md viejo y de `conventions.md` se redistribuye en `descripcion.md`, `stack.md`, `proyecto.md`, etc. según corresponda.

---

## FAQ

### ¿Por qué no migra el contenido el script directamente?

Porque la migración semántica (decidir si una frase del CLAUDE.md viejo es "información del proyecto" o "regla de stack" o "atajo conocido") es exactamente el tipo de juicio que un LLM hace bien y un script con regex hace mal. El script prepara el terreno; Claude Code hace el trabajo intelectual.

### ¿Funciona en Windows?

Sí. Node es multiplataforma y el script usa `path.join` para portabilidad. Para PowerShell hay un `install.ps1` específico.

### ¿Puedo personalizar las normas para mi equipo?

Sí. Hay dos caminos:
1. **Forkear este repo** y mantener tu propia versión (cámbiale el nombre en `package.json`).
2. **Instalar la versión oficial** y luego sobrescribir las normas que quieras adaptar (`claude-protocol update` no borrará tus cambios si las re-modificas tras update).

### ¿Cómo actualizo el protocolo cuando salga una v2.3?

Si usaste npm:
```bash
npm install -g claude-protocol@latest
cd mi-proyecto && claude-protocol update
```

Si clonaste el repo:
```bash
cd ~/dev/claude-protocol && git pull
cd ~/dev/mi-proyecto && claude-protocol update
```

### ¿Qué pasa con mis customizaciones en `descripcion.md`, `stack.md`, etc.?

`update` **nunca toca los archivos específicos del proyecto**. Solo refresca los universales (`CLAUDE.md` + `normas/*`).

### ¿Cómo sé qué versión del protocolo tengo en un proyecto?

```bash
head -3 CLAUDE.md
# > Versión: 2.2 (modular + patrones operativos)
```

---

## Filosofía y referencias

Este protocolo se basa en:

- La [documentación oficial de Claude Code](https://code.claude.com/docs/en/best-practices) — especialmente en su énfasis en que el contexto degrada con el tamaño y que `CLAUDE.md` es la pieza más importante.
- [Anthropic Engineering: Equipping agents with Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills).
- Análisis empíricos de developers con experiencia real en producción ([Shrivu Shankar](https://blog.sshh.io/p/how-i-use-every-claude-code-feature), [Producttalk](https://www.producttalk.org/how-to-use-claude-code-features/)).
- Patrones de bounded contexts, modularidad estricta y privacy by design (RGPD, LOPDGDD).

La filosofía rectora es simple: **simplicidad y contención por defecto, extensiones (skills, subagents, hooks) solo cuando aparezca un dolor real**. Ver `docs/normas/normasClaudeCode.md` para el detalle de cuándo SÍ y cuándo NO usar cada feature avanzada.

---

## Cómo contribuir

1. Forkea el repo.
2. Crea una rama: `git checkout -b feat/mi-mejora`.
3. Modifica las plantillas en `templates/` o el script en `bootstrap.mjs`.
4. Si cambias `bootstrap.mjs`, ejecuta `pnpm test:smoke` para validar.
5. Abre PR con descripción clara del problema que resuelves.

Las mejoras al protocolo deben ir acompañadas de justificación: ¿qué dolor real resuelve? ¿en qué contexto se ha probado?

---

## Licencia

[MIT](LICENSE). Uso libre dentro de tus proyectos. No publicar el contenido textual de las normas como propio (atribución apreciada).

---

## Changelog

Ver [CHANGELOG.md](CHANGELOG.md).
