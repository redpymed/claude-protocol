# proyecto.md — claude-protocol

## §1. Snapshot actual

- **Versión actual**: 2.3.0
- **Estado global**: 🟢 Producción
- **Última actualización**: 2026-04-28
- **Build en `main`**: ✅
- **Cobertura global**: smoke tests en CI

## §2. Componentes

### `bootstrap.mjs`
- **Estado**: 🟢 Producción
- **Modos**: new, adapt, update, check, new-module, validate, version

### `templates/`
- **Estado**: 🟢 Producción
- **Universales**: 9 archivos (CLAUDE.md + 8 normas)
- **Específicos**: 6 archivos
- **Auxiliares**: 7 archivos
- **Module template**: 4 carpetas + index.ts + README.md

### Distribución
- **npm**: pendiente primer publish manual
- **GitHub**: pendiente primer push
- **Template repo**: pendiente activación
- **curl installer**: incluido en repo, requiere ajustar URL

## §3. Última tarea completada

- **Fecha**: 2026-04-28
- **Tarea**: Generación inicial del meta-repo distribuible v2.3.0
- **Cambios**:
  - Añadidos modos `new-module`, `validate`, `version` al bootstrap.
  - Añadida nueva categoría `AUXILIARY_TEMPLATES`.
  - Añadidas 7 plantillas auxiliares (ADR, retención, SLO, DR, runbook, postmortem, claude-settings).
  - Añadida `module-template/` para scaffolding de bounded contexts.
  - Añadida sección §10 a `normasArquitectura.md` con regla ESLint y validate.
  - Añadidos archivos de meta-repo (este, META-CLAUDE.md, etc.).
  - Añadidos archivos de production-readiness (.editorconfig, GitHub templates).

## §4. En curso

- [ ] Primer push a GitHub (pendiente del usuario).
- [ ] Primer `npm publish` (pendiente del usuario).

## §5. Cola de próximas tareas

1. Validar end-to-end después del primer push real (smoke test del workflow CI).
2. Documentar caso de uso real en `aciertos.md`.
3. Recolectar feedback inicial de adopción.
4. Considerar versión inglesa de templates (v3.0).

## §6. Decisiones recientes

- **2026-04-28** — Modularidad estricta: tres niveles de enforcement (ESLint + TS Project References + `claude-protocol validate`).
- **2026-04-28** — Categoría `AUXILIARY_TEMPLATES` separada de `UNIVERSAL_FILES`: las plantillas auxiliares se crean si faltan pero NUNCA se sobrescriben en `update`.
- **2026-04-28** — Distribución multi-canal (npm + GitHub Template + curl + git clone).
- **2026-04-28** — Sin dependencias npm en el bootstrap (decisión deliberada).

## §7. Bloqueos abiertos

- **Personalización pendiente**: el usuario debe sustituir `redpymed`, `Redpyme D`, `<admin@redpymed.es>` en los archivos antes de publicar.

## §8. Métricas vivas

- **Descargas npm último mes**: pendiente primera publicación
- **Stars GitHub**: pendiente primera publicación
- **Adopción interna**: 1 usuario (el autor)

## §9. Historial de versiones

### v2.3.0 — 2026-04-28
- Modos `new-module`, `validate`, `version`.
- `AUXILIARY_TEMPLATES` con 7 plantillas.
- `module-template/` para scaffolding.
- Regla ESLint en `normasArquitectura.md`.
- Archivos meta-repo y production-readiness.

### v2.2.0 — 2026-04-28
- `normasClaudeCode.md` añadido.
- Distribución multi-canal: npm, install.sh, install.ps1.
- GitHub Actions release workflow.

### v2.1.0 — 2026-04-28
- 6 patrones operativos en CLAUDE.md.
- Plantillas vivas: proyecto/errores/aciertos/funciones.
- Modularidad estricta (Regla Inviolable #13).

### v2.0.0 — 2026-04-28
- Refactorización a arquitectura modular.
- 7 archivos `normas*.md` por dominio.

### v1.0.0 — 2026-04-28
- CLAUDE.md monolítico inicial.
- 12 reglas inviolables.
