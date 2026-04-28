# CLAUDE.md — Meta-Repo claude-protocol

> Este es el `CLAUDE.md` del **meta-repositorio** `claude-protocol`, NO el del template.
> El CLAUDE.md que distribuye el protocolo a los proyectos vive en `templates/CLAUDE.md`.
>
> **No los mezcles**: si modificas este archivo no se propaga a los proyectos. Si modificas `templates/CLAUDE.md`, sí.

---

## §1. Identidad

- **Proyecto**: `claude-protocol`
- **Naturaleza**: meta-repo distribuible (npm + GitHub + curl installer)
- **Versión actual**: ver `package.json`
- **Audiencia**: developers que usan Claude Code y quieren un protocolo serio.

## §2. Filosofía

Este meta-repo predica simplicidad y contención. Cualquier cambio que añadas debe respetar tres principios:

1. **Universalidad**: lo que va a `templates/CLAUDE.md` y `templates/docs/normas/*` debe aplicar a casi cualquier proyecto serio. Si solo aplica a un sector, no pertenece aquí.
2. **Honestidad operativa**: no recomendamos features porque sí. Si una recomendación no tiene ROI claro y comprobable, fuera.
3. **Eat your own dogfood**: este meta-repo se rige por sus propias normas en lo que aplica.

## §3. Reglas para contribuir al protocolo

### Cambios que requieren PR + revisión

- Cualquier modificación de `templates/CLAUDE.md`.
- Cualquier modificación de `templates/docs/normas/*`.
- Cambios en `bootstrap.mjs` que alteren el contrato (modos, argumentos, salida).

### Cambios que pueden ir en commits directos a `main`

- Correcciones de typos en `README.md` o documentación.
- Bumps de versión.
- Tests adicionales.

### Plantilla de PR para cambios al protocolo

Toda PR que modifique las normas debe responder:

1. **¿Qué dolor real resuelve?** Si no puedes citar un caso concreto, espera.
2. **¿Esto aplica universalmente o solo a tu contexto?** Si lo segundo, no va aquí.
3. **¿Has probado el cambio en al menos un proyecto real?** Sí o no, con detalles.

## §4. Estructura del repo

```
claude-protocol/
├── bootstrap.mjs              # script principal
├── package.json               # npm metadata
├── README.md                  # portada pública
├── CHANGELOG.md
├── LICENSE                    # MIT
├── CONTRIBUTING.md
├── SECURITY.md
├── CLAUDE.md                  # este archivo (meta)
├── descripcion.md             # contexto del meta-repo
├── stack.md                   # stack del meta-repo
├── proyecto.md                # estado vivo del meta-repo
├── install.sh                 # instalador Unix
├── install.ps1                # instalador Windows
├── .editorconfig
├── .gitignore
├── .github/
│   ├── workflows/release.yml
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── ISSUE_TEMPLATE/
└── templates/                 # CONTENIDO DISTRIBUIBLE — cuidado al editar
    ├── CLAUDE.md              # constitución del template
    ├── descripcion.md         # plantilla de descripción
    ├── stack.md               # plantilla de stack
    ├── proyecto.md            # plantilla de estado vivo
    ├── errores.md             # plantilla bitácora
    ├── aciertos.md            # plantilla atajos
    ├── funciones.md           # plantilla funciones
    ├── .claude/settings.json  # configuración mínima Claude Code
    ├── docs/
    │   ├── normas/            # 8 normas universales
    │   ├── adr/0000-template.md
    │   ├── retencion.md
    │   ├── slo.md
    │   ├── dr.md
    │   ├── runbooks/_template.md
    │   └── postmortems/_template.md
    └── module-template/       # bounded context scaffolding
        ├── domain/
        ├── application/
        ├── infrastructure/
        ├── api/
        ├── index.ts
        └── README.md
```

## §5. Reglas de oro al modificar `templates/`

Al editar cualquier cosa en `templates/`, recuerda que:

1. **Lo que escribas se va a millones de proyectos.** Sé conservador.
2. **Cualquier ejemplo concreto** (nombre de empresa, sector, tecnología minoritaria) **es contaminación**. Usa nombres genéricos.
3. **Cualquier referencia regulatoria** (RGPD, AEPD, EAA, LGT) está OK porque aplica universalmente en UE/España y muchos usuarios serán de ahí.
4. **Cualquier referencia a un proveedor concreto** (Supabase, Vercel, AWS) solo como ejemplo dentro de ángulos `<...>` o como "ejemplos típicos".
5. **El idioma del template es español**. El README del repo está en español. Una versión inglesa puede venir más adelante en `templates/en/`.

## §6. Comandos del meta-repo

```bash
npm run new       # bootstrap nuevo proyecto (testing)
npm run adapt     # adaptar proyecto activo (testing)
npm run check     # diagnóstico
npm run update    # actualizar universales en proyecto
npm run help      # ayuda
npm run test:smoke # smoke test del bootstrap
```

## §7. Versionado

Semver estricto:
- **MAJOR**: cambios incompatibles que requieren acción del usuario al ejecutar `update`.
- **MINOR**: añadir nuevas normas, nuevos comandos, nuevas plantillas auxiliares.
- **PATCH**: correcciones, typos, mejoras de wording sin cambio de comportamiento.

## §8. Lo que NO va en este repo

- Ejemplos vinculados al trabajo de los autores.
- Skills custom específicas de un sector.
- Configuraciones específicas de un cliente.
- Dependencies opinadas (linters específicos, frameworks de testing concretos). El template recomienda, no impone.

---

*Este archivo se rige por las mismas reglas que predica: si crece sin control, refactorízalo.*
