# stack.md — claude-protocol

## §1. Lenguajes y runtimes

| Componente | Lenguaje | Versión | Notas |
|---|---|---|---|
| Bootstrap script | JavaScript ESM | Node ≥ 18 | Sin dependencias npm |
| Templates | Markdown | — | UTF-8 |
| Instaladores | Bash + PowerShell | — | Multi-plataforma |
| CI | YAML (GitHub Actions) | — | |

## §2. Estructura de carpetas

```
claude-protocol/
├── bootstrap.mjs              # script principal
├── package.json
├── README.md
├── CHANGELOG.md
├── LICENSE
├── CONTRIBUTING.md
├── SECURITY.md
├── CLAUDE.md                  # meta
├── descripcion.md             # meta
├── stack.md                   # meta (este archivo)
├── proyecto.md                # meta
├── install.sh
├── install.ps1
├── .editorconfig
├── .gitignore
├── .github/
│   ├── workflows/release.yml
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── ISSUE_TEMPLATE/
└── templates/
    ├── CLAUDE.md
    ├── descripcion.md
    ├── stack.md
    ├── proyecto.md
    ├── errores.md
    ├── aciertos.md
    ├── funciones.md
    ├── .claude/settings.json
    ├── docs/
    │   ├── normas/  (8 archivos)
    │   ├── adr/0000-template.md
    │   ├── retencion.md
    │   ├── slo.md
    │   ├── dr.md
    │   ├── runbooks/_template.md
    │   └── postmortems/_template.md
    └── module-template/
        ├── domain/.gitkeep
        ├── application/.gitkeep
        ├── infrastructure/.gitkeep
        ├── api/.gitkeep
        ├── index.ts
        └── README.md
```

## §3. Distribución

- **npm**: paquete público `claude-protocol` (binario expuesto en `bin`).
- **GitHub**: repositorio público con tag "Template repository" activo.
- **curl installer**: `install.sh` y `install.ps1` en `main`.

## §4. CI/CD

- **Plataforma**: GitHub Actions.
- **Workflow**: `.github/workflows/release.yml`.
- **Trigger**: push de tag `v*.*.*`.
- **Pasos**:
  1. Smoke test del bootstrap (modos new, check, adapt).
  2. Verificación de versión en `package.json` vs tag.
  3. Publish a npm.
  4. Crear GitHub Release con changelog extraído.

## §5. Comandos clave

```bash
npm run new        # bootstrap proyecto nuevo (testing)
npm run adapt      # adaptar proyecto activo (testing)
npm run check      # diagnóstico
npm run update     # actualizar universales en proyecto
npm run help       # ayuda
npm run test:smoke # smoke test del bootstrap

# Publicación manual (raro, normalmente auto vía tag)
npm version patch  # bump 2.2.0 → 2.2.1
git push && git push --tags
```

## §6. Versiones críticas

| Paquete / componente | Versión | Motivo del pin |
|---|---|---|
| Node | ≥ 18 | API `node:fs/promises`, ESM, top-level await |

## §7. Sin dependencias

Decisión deliberada: el bootstrap **no tiene dependencias npm**. Solo APIs nativas de Node. Esto garantiza:

- Instalación instantánea con `npx`.
- Sin riesgo de cadena de suministro.
- Sin necesidad de `node_modules` para correr.

Si en el futuro hace falta una utilidad (parsing avanzado, color, prompts), se evaluará caso por caso. El umbral es alto.

## §8. Distribución y mantenimiento

- **Owner npm**: <usuario npm>.
- **Owner GitHub**: <usuario github>.
- **Branch principal**: `main`.
- **Estrategia de branches**: trunk-based. Features en ramas cortas, merge a `main` vía PR.
- **Versionado**: semver estricto con `npm version`.

## §9. Decisiones técnicas registradas

Ver `docs/adr/` cuando existan ADRs específicas del meta-repo.
