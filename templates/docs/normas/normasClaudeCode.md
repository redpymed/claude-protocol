# normasClaudeCode.md — Extensiones de Claude Code

> **Cargar este archivo cuando** la tarea toque: skills, subagents, hooks, MCP, slash commands, plugins, configuración de Claude Code, `.claude/settings.json`, `CLAUDE.md` propiamente dicho, o automatización del propio agente.
>
> **Subordinado a** `CLAUDE.md` §2.

---

## Filosofía

El ecosistema de Claude Code (skills, subagents, hooks, MCP, plugins) es **opcional y aditivo**. Cada herramienta tiene un nicho real, pero **añadir herramientas también añade contexto que se carga, complejidad de mantenimiento y superficie de error**.

La regla de oro de Anthropic es explícita: el rendimiento de Claude degrada conforme se llena el contexto. Por tanto, cada extensión que añadamos al protocolo debe **aportar más valor del coste contextual que introduce**.

**Default**: empezar mínimo (solo CLAUDE.md + MCPs imprescindibles) y añadir skills/hooks/subagents solo cuando aparezca dolor real, no profilácticamente.

---

## §1. Tabla de decisión rápida

| Feature | Cuándo SÍ | Cuándo NO |
|---|---|---|
| **CLAUDE.md** | Siempre. Es la constitución. | Nunca se desactiva. |
| **MCPs** | Acceso a sistemas externos (BD, GitHub, Slack, Drive). | Para cosas que ya cubre `Bash`/`Read`/`Write`. |
| **Hooks** | Enforce determinista (lint, format, secret scan). | Lógica que cambia, mejor en CLAUDE.md o en un script invocable. |
| **Skills oficiales** | Capacidades técnicas concretas (frontend-design, doc creation). | Para guardar prompts genéricos: usa CLAUDE.md o slash commands. |
| **Skills custom** | Conocimiento de dominio que se reutiliza (≥3 veces). | Workflows de un solo uso. |
| **Subagents** | Tareas que generan mucho output ajeno al hilo principal (test runs, code search masivo). | Tareas con muchas idas y vueltas o que cruzan capas. |
| **Slash commands legacy** | Solo si ya los tienes. | Para crear nuevos: usa skills. |
| **Plugins** | Cuando el bundle realmente lo necesitas y has auditado el contenido. | Por curiosidad o por tener "más". |
| **Agent Teams** | Trabajos masivos paralelizables y comunicados (research preview). | Workflows lineales, esperar a que madure. |

---

## §2. MCPs — Conectores externos

### Cuándo
Cualquier sistema externo donde necesitas leer/escribir datos: Supabase, PostgreSQL, GitHub, Linear, Slack, Drive, Filesystem extendido, etc.

### Reglas de uso
- Listar MCPs **disponibles** en `stack.md` §10.
- Documentar **cuándo invocar cada uno** en `aciertos.md`. Ejemplo concreto: "Para schema de Supabase, usar el MCP — no abrir el dashboard ni escribir SQL exploratorio en el código".
- **Auditar** MCPs antes de instalarlos: leer su código, verificar que no exfiltra datos.
- **Permisos mínimos**: cada MCP con el scope más pequeño que necesite (read-only si no escribe).
- **Operaciones destructivas vía MCP**: igual que cualquier operación destructiva, requieren confirmación humana en chat (CLAUDE.md §2.9).

### Ejemplos de alto ROI

```markdown
# En aciertos.md
## Schema y queries en Supabase
- Herramienta: MCP de Supabase
- Cuándo: SIEMPRE para schema, RLS, exploración. Nunca abrir el dashboard ni escribir SQL "ad hoc".
- Ahorro: 10-15 min por consulta vs. mano.
```

---

## §3. Hooks — Automatización determinista

### Cuándo
Para enforce que **debe pasar SIEMPRE de la misma forma**, sin que el LLM decida. Lint, format, secret scan, generación de tipos tras migración.

### Reglas de uso
- Configurados en `.claude/settings.json`, versionado en el repo.
- **Hooks rápidos** (< 5s) para `PostToolUse`. Si tarda más, mover a CI.
- **Idempotentes**: ejecutarlos varias veces no debe causar daño.
- **Documentados**: cada hook tiene comentario explicando qué hace y por qué.
- **No enmascarar errores**: si el hook falla, debe ser visible, no silencioso.

### Hooks recomendados como base

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash(git commit *)",
        "hooks": [
          {
            "type": "command",
            "command": "gitleaks detect --staged --no-banner || (echo 'Secrets detected' && exit 1)"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "if [[ $CLAUDE_FILE_PATH == *.ts || $CLAUDE_FILE_PATH == *.tsx ]]; then npx prettier --write \"$CLAUDE_FILE_PATH\"; fi"
          }
        ]
      }
    ]
  }
}
```

### Anti-patrones
- Hook que ejecuta tests completos en cada edit → ralentiza todo, mover a CI.
- Hook que envía datos a servicios externos → riesgo de PII y latencia.
- Hooks que dependen de variables no documentadas.

---

## §4. Skills

### Estructura

```
.claude/skills/<nombre-skill>/
├── SKILL.md          ← obligatorio: frontmatter YAML + cuerpo markdown
├── scripts/          ← opcional: código ejecutable
└── reference/        ← opcional: docs adicionales referenciadas
```

### Frontmatter mínimo

```yaml
---
name: nombre-corto-en-kebab
description: |
  Una frase clara de qué hace.
  Use when: <trigger 1>, <trigger 2>, <trigger 3>.
---
```

**Crítico**: la `description` es lo que Claude usa para decidir si activar la skill. Front-load los triggers en formato "Use when..." con palabras concretas que aparecerían en la petición del usuario. Skills con descripciones vagas no se activan.

### Cuándo crear una skill custom

Solo si TODAS estas son ciertas:
- [ ] Hay un proceso de dominio que **se repite ≥ 3 veces** entre proyectos o sesiones.
- [ ] El proceso requiere **conocimiento específico** que no es trivial poner en CLAUDE.md.
- [ ] El proceso se beneficia de **scripts ejecutables** o **archivos de referencia** además de instrucciones.
- [ ] Está claro **cuándo invocarlo** (triggers limpios).

Si solo es "guardar un prompt", no es skill: usa una sección en CLAUDE.md o un slash command.

### Skills oficiales recomendadas

| Skill | Para qué | Cuándo |
|---|---|---|
| `frontend-design` (Anthropic) | UI con criterio de diseño senior | Cualquier componente, página, dashboard |
| `pdf` (Anthropic) | Crear/editar PDFs | Informes, contratos, documentación profesional |
| `docx` (Anthropic) | Generar Word | Documentos con formato profesional |
| `xlsx` (Anthropic) | Excel con fórmulas y formato | Reporting, análisis tabular |
| `skill-creator` (Anthropic) | Meta-skill para crear skills | Cuando quieras formalizar un proceso recurrente |

### Skills custom propias (ejemplos genéricos)

Buenos candidatos a skills custom son procesos repetitivos del proyecto que combinan instrucciones detalladas + scripts ejecutables + archivos de referencia. Ejemplos neutros aplicables a casi cualquier proyecto serio:

- **`release-notes-builder`** — Genera notas de release a partir de los commits desde el último tag, agrupadas por tipo (feat/fix/chore) según Conventional Commits.
- **`api-contract-validator`** — Verifica que los cambios en endpoints respetan el contrato OpenAPI/SDL existente, detectando breaking changes antes del PR.
- **`migration-reviewer`** — Audita migraciones de BD: reversibilidad, índices, impacto en RLS, tamaño estimado del backfill.
- **`i18n-extractor`** — Detecta strings sin traducir en el código y los añade al fichero de traducciones del idioma principal.
- **`query-performance-reviewer`** — Analiza queries SQL contra el schema actual y sugiere índices o reescrituras.

La idea es: identifica los procesos que repites de forma idéntica entre tareas y conviértelos en skills, con el conocimiento del proyecto incorporado.

### Anti-patrones de skills

- Skills genéricas tipo "code-helper" o "general-assistant" — Claude ya hace eso.
- Skills sin triggers específicos en la descripción — no se activarán.
- Skills enormes (>500 líneas en SKILL.md) — partir en archivos referenciados.
- Skills duplicadas con variaciones — consolidar o eliminar.

---

## §5. Subagents

### Cuándo usarlos

Cuando una sub-tarea genera **mucho output que no se va a referenciar** después: ejecutar tests completos, buscar en codebase grande, leer documentación voluminosa, validar resultados.

### Cuándo NO usarlos

- Tareas pequeñas con muchas idas y vueltas (el handoff cuesta más que ahorra).
- Tareas que cruzan varias capas y necesitan contexto compartido (schema + API + UI + tests).
- Trabajo creativo donde el contexto enriquece el resultado.
- Cualquier tarea donde el "summary" perdería información clave.

### Subagents construidos que merece la pena considerar

| Subagent | Propósito | Cuándo invocar |
|---|---|---|
| `security-reviewer` | Audita código contra `normasSeguridad.md` antes de merge | Pre-PR de cambios sensibles |
| `rgpd-auditor` | Verifica PII handling y bases legales | Tras tocar features con datos personales |
| `db-migration-reviewer` | Valida migraciones (RLS, reversibilidad, índices) | Antes de aplicar cualquier migración |
| `test-runner` | Ejecuta suite completa, reporta solo fallos | Cuando tests son verbosos |
| `docs-builder` | Genera README/ADR del cambio | Al cierre de feature significativa |

### Estructura

```
.claude/agents/security-reviewer.md
```

```yaml
---
name: security-reviewer
description: Audita código contra normasSeguridad.md. Use proactively after any change to auth, data handling, or external integrations.
tools: Read, Grep, Glob, Bash(git diff:*)
model: opus
---

Eres un revisor de seguridad senior. Analiza los cambios contra:
- Las 13 reglas inviolables de CLAUDE.md §2.
- Las normas específicas de docs/normas/normasSeguridad.md.
- RGPD/LOPDGDD si la tarea toca PII.

Reporta solo hallazgos accionables con:
- Línea concreta afectada.
- Regla violada (referencia explícita).
- Fix sugerido.

Si no hay hallazgos, di solo "OK: <N archivos auditados>". Sin paja.
```

### Reglas de uso

- **Tool restriction**: cada subagent con el menor set de tools posible (no `Write` si solo audita).
- **Prompt corto**: el system prompt debe caber holgadamente en el contexto del subagent.
- **Output estructurado**: pedir formato específico para que el resultado sea utilizable.
- **No anidar**: un subagent no invoca otros subagents (Anthropic lo prohíbe).

---

## §6. Slash Commands

Estado actual: **legacy**. Anthropic los está migrando a skills (`.claude/skills/<nombre>/SKILL.md` con `name` corresponde al slash command).

### Reglas

- Si tienes slash commands existentes (`.claude/commands/*.md`), siguen funcionando: no urge migrar.
- Para **nuevos shortcuts**: crear como skill con `disable-model-invocation: true` si solo quieres invocación manual.
- Slash commands para **flujos personales** (ej: `/today`, `/standup`): aceptable mantener como `.claude/commands/`.

---

## §7. Plugins

Bundles que distribuyen skills + subagents + hooks + MCPs como un paquete.

### Reglas

- **Auditar antes de instalar**: leer el plugin, verificar dependencias, mirar cuántos descargas tiene y quién lo mantiene.
- **Plugins oficiales de Anthropic** (en su marketplace) son la primera opción.
- **Plugins comunitarios**: solo de fuentes con buen historial (ej: `awesome-claude-code-subagents` con muchas estrellas y mantenedores activos).
- **No plugins solo "porque sí"**: cada plugin añade contexto y superficie de ataque.

---

## §8. CLAUDE.md jerárquico (avanzado)

Claude Code soporta **CLAUDE.md anidados**: un global en `~/.claude/CLAUDE.md`, uno por proyecto en `<repo>/CLAUDE.md`, y opcionalmente uno por subdirectorio.

### Reglas

- **`~/.claude/CLAUDE.md`** (global): preferencias personales transversales (idioma, estilo de comunicación, preferencias de tooling).
- **`<repo>/CLAUDE.md`** (proyecto): el de tu protocolo, canónico. Es el principal.
- **`<repo>/<modulo>/CLAUDE.md`** (subdirectorio): solo si un módulo tiene reglas muy específicas distintas. Usar con moderación: la mayoría de cosas viven mejor en `docs/normas/`.

---

## §9. Configuración de `.claude/settings.json`

Archivo que vive en el repo y configura Claude Code para todo el equipo.

### Estructura recomendada mínima

```json
{
  "model": "claude-opus-4-7",
  "permissions": {
    "allow": [
      "Read",
      "Write",
      "Edit",
      "Bash(git *)",
      "Bash(pnpm *)",
      "Bash(npx prettier *)",
      "Bash(npx eslint *)"
    ],
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)",
      "Bash(rm -rf *)",
      "Bash(git push --force *)"
    ]
  },
  "hooks": {
    "PreToolUse": [],
    "PostToolUse": []
  }
}
```

### Reglas

- `deny` siempre incluye `.env*`, `secrets/**`, operaciones destructivas absolutas.
- `allow` con la mínima superficie necesaria para trabajar sin pedir permiso constantemente.
- **Nunca commits** de un `.claude/settings.local.json` con permisos personales.

---

## §10. Auditoría periódica del estack Claude Code

Cada 3 meses, revisar:

- [ ] ¿Qué skills tengo activas? ¿Cuáles he usado realmente?
- [ ] ¿Qué subagents he creado? ¿Cuántas veces se invocan?
- [ ] ¿Qué MCPs tengo conectados? ¿Cuáles aportan valor?
- [ ] ¿Algún hook se está saltando o fallando silenciosamente?
- [ ] ¿Mi `CLAUDE.md` ha crecido sin control? Si > 25KB, refactorizar.

Lo que no se usa, se elimina. Mantener "por si acaso" cuesta contexto en cada sesión.

---

## Definition of Done (específica de extensiones Claude Code)

Cuando creas o modificas una skill, subagent, hook o MCP:

- [ ] Documentado en `aciertos.md` con caso de uso concreto y ejemplo.
- [ ] Probado en al menos un escenario real antes de commitear.
- [ ] Tools y permisos al mínimo necesario.
- [ ] Si toca seguridad/PII: revisado contra `normasSeguridad.md`.
- [ ] Si añade dependencias: pasan los criterios de `normasCalidad.md`.
- [ ] No se solapa con algo que ya existe en `CLAUDE.md` o en otra extensión.

---

*Fin de normasClaudeCode.md — Extensión opcional del protocolo.*
