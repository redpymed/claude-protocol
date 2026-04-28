# Changelog

Todas las versiones notables de este proyecto se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y la versión adopta [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Pendiente.

### Changed
- Pendiente.

### Fixed
- Pendiente.

---

## [2.3.0] — 2026-04-28

### Added
- Modo `new-module <nombre>` en bootstrap: crea bounded context con scaffolding (domain/application/infrastructure/api).
- Modo `validate` en bootstrap: detecta imports cruzados entre módulos sin requerir ESLint configurado.
- Modo `version` en bootstrap (`claude-protocol version` / `--version` / `-v`).
- Test de integridad de templates (con `DEBUG=1`): detecta archivos huérfanos en `templates/`.
- Nueva categoría `AUXILIARY_TEMPLATES`: plantillas que se crean si faltan pero NUNCA se sobrescriben.
- 7 plantillas auxiliares: ADR template, política de retención, SLO, plan DR, runbook template, postmortem template, claude-settings.
- `templates/module-template/` con scaffolding de bounded context.
- Sección §10 en `normasArquitectura.md`: enforcement automático de modularidad estricta (regla ESLint + comando `validate`).
- Archivos del meta-repo: `CLAUDE.md`, `descripcion.md`, `stack.md`, `proyecto.md` propios.
- Production-readiness: `CONTRIBUTING.md`, `SECURITY.md`, `.editorconfig`, plantillas GitHub.

### Changed
- `bootstrap.mjs`: refactorizado para soportar las nuevas categorías y modos.
- `runNew` y `runAdapt` ahora copian `AUXILIARY_TEMPLATES` (sin sobrescribir si existen).
- `runUpdate` sigue tocando solo `UNIVERSAL_FILES`.

### Fixed
- En modo `adapt`, el `CLAUDE.md` viejo se incluye correctamente en la lista de archivos legacy del prompt de migración.

---

## [2.2.0] — 2026-04-28

### Added
- Nueva norma `normasClaudeCode.md`.
- Distribución multi-canal: npm, `install.sh`, `install.ps1`.
- Soporte como GitHub Template Repository.

### Changed
- `bootstrap.mjs`: incluye `normasClaudeCode.md` en `UNIVERSAL_FILES`.
- `CLAUDE.md` §3: tabla de enrutamiento ampliada.

---

## [2.1.0] — 2026-04-28

### Added
- 6 patrones operativos en `CLAUDE.md` (confirmación de lectura, archivos vivos, modularidad estricta).
- Plantillas para los 4 archivos vivos.

### Changed
- Reglas Inviolables: 12 → 13.

---

## [2.0.0] — 2026-04-28

### Changed
- Refactorización total a arquitectura modular: `CLAUDE.md` slim + 7 normas por dominio.

### Added
- Tabla de enrutamiento §3.
- 7 archivos de normas con DoD específica.

---

## [1.0.0] — 2026-04-28

### Added
- Primera versión: `CLAUDE.md` monolítico con 7 pilares.
- 12 reglas inviolables.

---

[Unreleased]: https://github.com/redpymed/claude-protocol/compare/v2.3.0...HEAD
[2.3.0]: https://github.com/redpymed/claude-protocol/compare/v2.2.0...v2.3.0
[2.2.0]: https://github.com/redpymed/claude-protocol/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/redpymed/claude-protocol/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/redpymed/claude-protocol/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/redpymed/claude-protocol/releases/tag/v1.0.0
