# Contribuir a claude-protocol

Gracias por considerar contribuir. Este proyecto pretende ser **conservador en su contenido** (las normas afectan a muchos proyectos) y **abierto en sus mejoras**.

## Antes de abrir una PR

Responde estas tres preguntas en la descripción:

1. **¿Qué dolor real resuelve este cambio?** Cita un caso concreto, no un escenario hipotético.
2. **¿Esto aplica universalmente o solo a un contexto?** Si es lo segundo, probablemente no encaje en `templates/`. Plantéalo como issue de discusión primero.
3. **¿Has probado el cambio en al menos un proyecto real?** Sí o no, con detalles.

Si no puedes responder alguna afirmativamente, abre primero una **issue de discusión**.

## Tipos de cambio

### Cambios al protocolo (en `templates/`)
Requieren PR + revisión + justificación con casos reales.

- Modificar `templates/CLAUDE.md`.
- Modificar `templates/docs/normas/*`.
- Añadir / quitar normas o reglas.

### Cambios al bootstrap (en raíz)
Requieren PR + smoke test passing.

- Modificar `bootstrap.mjs`.
- Modificar `install.sh` / `install.ps1`.
- Modificar workflows de CI.

### Cambios menores
Pueden ir directo a `main` por el maintainer.

- Typos en README / documentación.
- Mejoras de wording sin cambio semántico.
- Bumps de versión.

## Estilo

- **Idioma**: español (el código en inglés, comentarios y docs en español).
- **Indentación**: 2 espacios. Configurado en `.editorconfig`.
- **Líneas**: máximo 100 caracteres en código, sin límite estricto en markdown.
- **Conventional Commits**: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`, `ci:`, `build:`.

## Local development

```bash
# Clona el repo
git clone https://github.com/redpymed/claude-protocol.git
cd claude-protocol

# Smoke test
npm run test:smoke

# Probar cambios manualmente en una carpeta temporal
mkdir /tmp/test && node bootstrap.mjs new /tmp/test
mkdir /tmp/test2 && echo "# Old" > /tmp/test2/CLAUDE.md && node bootstrap.mjs adapt /tmp/test2
```

## Reglas de oro al editar `templates/`

1. **Lo que escribas se distribuye a todos los proyectos**. Sé conservador.
2. **Sin ejemplos vinculados a empresas, sectores o productos concretos**. Solo nombres genéricos o ejemplos en `<...>`.
3. **Referencias regulatorias** (RGPD, AEPD, EAA, LGT) están OK. Aplican universalmente en UE/España.
4. **Referencias a proveedores concretos** (Supabase, Vercel, AWS) solo dentro de `<ej: ...>` o como "ejemplos típicos".
5. **El idioma del template es español**.

## Lo que NO aceptamos

- Normas vinculadas a sectores específicos (legal, médico, fintech, etc.).
- Skills custom propias.
- Configuraciones específicas de un cliente.
- Linters o frameworks impuestos. Recomendamos, no imponemos.

## Issue templates

- **Bug report**: usa la plantilla `.github/ISSUE_TEMPLATE/bug_report.md`.
- **Feature request**: usa la plantilla `.github/ISSUE_TEMPLATE/feature_request.md`.

## Code of Conduct

Sé respetuoso. Aplicamos sentido común: comportamiento profesional, sin ataques personales, debate centrado en ideas.

## Licencia

Al contribuir aceptas que tu contribución se distribuye bajo MIT (ver `LICENSE`).
