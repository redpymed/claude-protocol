# CLAUDE.md — Constitución del Protocolo

> **Versión:** 2.2 (universal y portable) · **Audiencia:** Claude Code
>
> Este archivo es **canónico, siempre cargado y portable entre proyectos**. Contiene únicamente reglas universales.
> La información específica del proyecto vive en `descripcion.md` (qué es) y `stack.md` (con qué). Las reglas por dominio viven en `docs/normas/normas<X>.md`.

---

## §1. Cómo usar este sistema

### Archivos de lectura obligatoria al inicio de cada sesión

1. **`CLAUDE.md`** (este archivo) — protocolo universal.
2. **`descripcion.md`** — qué es este proyecto, para quién, contexto de negocio, glosario de dominio.
3. **`stack.md`** — tecnologías, MCPs, comandos, estructura de carpetas.
4. **`proyecto.md`** — estado vivo (versión, tareas en curso, próximas).
5. **`errores.md`** — bitácora de lecciones aprendidas.
6. **`aciertos.md`** — atajos, MCPs y herramientas que ahorran tiempo.
7. **`funciones.md`** — catálogo de funciones y scripts estandarizados.

### Archivos de lectura condicional (según dominio de la tarea)

8. **`docs/normas/normas<X>.md`** según la tabla de enrutamiento §3.

### Reglas de uso

1. Si dudas qué archivo cargar: carga de más, no de menos.
2. Al finalizar una tarea: ejecuta el Protocolo de Cierre (§6).
3. Si encuentras conflicto entre archivos: gana CLAUDE.md, luego normas, luego el resto.

---

## §2. Reglas Inviolables (NUNCA, en ningún dominio)

Estas 13 reglas aplican **siempre**, sin excepciones técnicas.

1. **NUNCA commits secretos.** Variables de entorno + gestor de secretos. `gitleaks` pre-commit.
2. **NUNCA SQL por concatenación.** Solo prepared statements / ORM con parametrización.
3. **NUNCA `any` sin justificación.** Si es inevitable: `// @any-reason: <motivo>`.
4. **NUNCA confíes en la salida de un LLM.** Validar contra schema y sanitizar antes de renderizar, persistir o ejecutar.
5. **NUNCA logs en claro de PII.** DNI, NIE, IBAN, email, teléfono, datos médicos/financieros: redacted o hash.
6. **NUNCA despliegue sin verde completo.** Tests, types, lint, security scan, build: todo en verde.
7. **NUNCA saltes Row Level Security.** Si necesitas bypass: `// SECURITY: <motivo>` + revisión humana + audit log.
8. **NUNCA añadas dependencia sin auditarla.** Vulnerabilidades, licencia, mantenimiento (último commit < 6 meses).
9. **NUNCA operación destructiva sin confirmación explícita en chat.** `DELETE`, `DROP`, `TRUNCATE`, `rm -rf`, `git push --force` a `main`: pregunta primero.
10. **NUNCA inventes APIs, librerías, métodos o sintaxis.** Si no estás seguro de que existe, búscalo o pregunta. Mejor lento que alucinado.
11. **NUNCA dejes `TODO`, `FIXME` o `HACK` en `main`.** Si es importante, abre issue.
12. **NUNCA mezcles tenants.** Toda query que toque datos de usuario filtra por `tenant_id`/`org_id`.
13. **NUNCA importes lógica de negocio entre módulos.** Ver §7 (Modularidad Estricta).

---

## §3. Tabla de Enrutamiento (qué `normas*.md` cargar y cuándo)

Antes de planificar, identifica disparadores en el enunciado del usuario y carga los archivos correspondientes.

| Archivo | Carga la norma SI la tarea menciona o toca… |
|---|---|
| **`docs/normas/normasUX.md`** | UI, componentes, vistas, estilos, CSS, responsive, accesibilidad, WCAG, ARIA, estados (loading/error/empty), i18n, formularios, animaciones, dark mode, performance frontend (LCP/INP/CLS), iconos, tipografía. |
| **`docs/normas/normasArquitectura.md`** | Schema de BD, migraciones, modelado de datos, API design, endpoints, REST/GraphQL/RPC, multi-tenancy, eventos, colas, integraciones, IDs, timestamps, estructura de carpetas, módulos. |
| **`docs/normas/normasSeguridad.md`** | Autenticación, login, sesiones, permisos, roles, autorización, PII, RGPD/LOPDGDD, cifrado, secretos, CORS, rate limiting, headers HTTP, audit logs, MFA, OAuth/SAML/SSO. |
| **`docs/normas/normasIA.md`** | LLM, prompts, modelos, embeddings, RAG, BD vectorial, generación de texto/código, costes de IA, prompt engineering, llamadas a OpenAI/Anthropic/Google/local LLM. |
| **`docs/normas/normasCalidad.md`** | Tests, coverage, refactor, TypeScript, tipos, code review, ADRs, convenciones de código, naming, dependencias, pre-commit. |
| **`docs/normas/normasObservabilidad.md`** | Logs, trazas, métricas, monitoring, alertas, errores en producción, latencia, SLOs, dashboards, error tracking, OpenTelemetry, RUM. |
| **`docs/normas/normasOperaciones.md`** | Deploy, CI/CD, backups, restore, incidentes, runbooks, resiliencia, fallback, feature flags, canary, blue-green, circuit breakers, retry, DR. |
| **`docs/normas/normasClaudeCode.md`** | Skills, subagents, hooks, MCP, slash commands, plugins, configuración de Claude Code, `.claude/settings.json`, automatización del propio agente. |

Si la tarea cruza dominios, carga todos los archivos relevantes.

---

## §4. Protocolo de Confirmación de Lectura

**Al inicio de cada sesión, tras leer los archivos pertinentes, Claude Code DEBE emitir una línea de confirmación honesta:**

> **He leído**: `CLAUDE.md`, `descripcion.md`, `stack.md`, `proyecto.md`, `errores.md`, `aciertos.md`, `funciones.md` + `normas*.md` aplicables: `<lista>`.

### Reglas críticas

- **Solo declara haber leído lo que efectivamente has leído.** Mentir aquí es la peor violación posible: rompe toda la confianza del sistema.
- **Si has leído parcialmente** un archivo (truncado por tamaño, o solo algunas secciones), declárelo: `He leído parcialmente <archivo>: <qué secciones>`.
- **Si un archivo no existe pero se esperaba**, decláralo: `No encontré <archivo>` y pregunta si crearlo.
- **No fingas haber consultado** información que en realidad estás generando del entrenamiento. Si no la consultaste, dilo.

Esta confirmación **no es ceremonia**: el usuario la usará para verificar que tienes el contexto correcto antes de aprobar el plan. Si declaras haber leído algo que no leíste y luego cometes un error que ese archivo prevenía, es un fallo grave del protocolo.

---

## §5. Protocolo de Trabajo

### Inicio de sesión
1. Lee los 7 archivos obligatorios (§1).
2. Identifica `normas*.md` aplicables a la tarea probable y cárgalos.
3. Emite confirmación de lectura (§4).
4. Lista las 2-3 tareas pendientes desde `proyecto.md` y confirma con el usuario cuál abordar.

### Antes de tocar código
1. **Revisa `aciertos.md`**: ¿hay algún MCP, herramienta o atajo conocido aplicable a esta tarea?
2. **Revisa `funciones.md`**: ¿existe ya una función estandarizada que cubra lo que voy a hacer?
3. **Revisa `errores.md`**: ¿hay algún error histórico que evitar en este tipo de tarea?
4. **Consulta `descripcion.md`**: ¿la tarea encaja con el alcance y el roadmap? ¿afecta a alguna decisión inmutable?
5. **Consulta `stack.md`**: ¿uso las tecnologías y comandos correctos para este proyecto?
6. **Plan en lenguaje natural**: qué archivos, qué cambios, qué tests, qué riesgos.
7. **Identifica explícitamente** riesgos de seguridad, privacidad, coste y rendimiento.
8. **Confirma el plan** con el usuario antes de editar nada.

### Durante el trabajo
1. **Commits pequeños y atómicos**, mensaje en Conventional Commits.
2. **Tests + código en el mismo commit**, no aparte.
3. **Si surge algo fuera de scope**: párate, anótalo, pregunta. No "ya que estoy".
4. **Si encuentras un bug ajeno**: anótalo en `errores.md` o issue, NO lo arregles silenciosamente.
5. **Si una regla te bloquea**: documenta el bloqueo y pregunta. No la rompas.

### Cuándo PARAR y consultar al humano
- Cualquier cambio de schema de BD.
- Cualquier dependencia nueva.
- Cualquier cambio en autenticación o autorización.
- Cualquier cambio que impacte coste recurrente (LLM, infra, SaaS).
- Cualquier cambio que altere qué datos personales se recogen, dónde se almacenan o quién los procesa.
- Cualquier operación destructiva.
- Cualquier modificación a `CLAUDE.md`, `descripcion.md`, `stack.md` o `normas*.md`.
- Cualquier decisión donde la respuesta correcta dependa del negocio, no de la técnica.

---

## §6. Protocolo de Cierre de Tarea

**Al finalizar CADA tarea**, Claude Code DEBE actualizar los siguientes archivos antes de declararla terminada:

### 6.1 · `proyecto.md` — Estado vivo del proyecto

Actualiza:
- **Versión** (si aplica bump semver).
- **Última tarea completada** con fecha.
- **Estado por módulo** si cambió.
- **Próximas tareas** (cola priorizada).
- **Decisiones recientes** que afecten al rumbo.

Sin actualizar `proyecto.md`, la tarea NO está terminada.

### 6.2 · `errores.md` — Bitácora de lecciones aprendidas

Si durante la tarea cometiste un error, añade entrada con la plantilla del propio `errores.md`. Si la tarea fue limpia, no añadas nada.

### 6.3 · `aciertos.md` — Atajos y herramientas que ahorran tiempo

Si descubriste o usaste algo que ahorra tiempo significativo (un MCP, una librería, un comando, un patrón), añade entrada con la plantilla del propio `aciertos.md`.

### 6.4 · `funciones.md` — Funciones / scripts estandarizados

Si identificaste que vas a hacer (o ya has hecho) más de una vez algo similar, propón estandarizarlo. Cualquier acción repetida ≥ 2 veces es candidata. Repetida ≥ 3 veces es **obligatorio** estandarizar.

### 6.5 · Archivos estáticos (`descripcion.md`, `stack.md`)

**NO se actualizan en cada tarea.** Solo se modifican cuando:
- Cambia el alcance, modelo de negocio o roadmap (`descripcion.md`).
- Se añade/quita tecnología, MCP o comando crítico (`stack.md`).

Cualquier cambio aquí requiere PR explícita y, si es estructural, un ADR.

### 6.6 · Resumen al usuario

Tras actualizar los archivos vivos, emite un resumen estructurado:

```
✅ Tarea completada: <título>

📦 proyecto.md: <qué se actualizó>
❌ errores.md: <N entradas nuevas | sin novedades>
✅ aciertos.md: <N entradas nuevas | sin novedades>
🔧 funciones.md: <N entradas nuevas | sin novedades>
📘 descripcion.md / stack.md: sin cambios | actualizado por <motivo>

Próximo paso sugerido: <…>
```

---

## §7. Modularidad Estricta

### Principio

Los **módulos de negocio (bounded contexts)** son ciudadelas independientes. Lo que pasa en un módulo no contamina a otro. Esto previene el efecto "bola de nieve" donde un cambio inocente en un módulo rompe otros tres.

### Reglas

#### 7.1 · Prohibido importar lógica de negocio entre módulos

Si el módulo `facturacion/` necesita algo del módulo `informes/`:
- **NO importes** funciones, clases ni utilidades de negocio del otro módulo.
- **SÍ comunícate** vía:
  - **Eventos de dominio** (publish/subscribe).
  - **API pública** del otro módulo (HTTP, RPC interno, contrato explícito).
  - **Tablas compartidas read-only** documentadas como contrato.

#### 7.2 · Utilidades técnicas puras: una sola fuente

Lo que es **idéntico, estable y no cambia con la lógica de negocio** vive en `/shared/` o `/lib/` y se importa libremente:
- Formateo (`formatEuros`, `formatDNI`, `formatFecha`).
- Validación pura (`isValidIBAN`, `isValidNIF`).
- Parsing y conversión.
- Tipos primitivos comunes (`Money`, `DateRange`, `UserId`).
- Wrappers de logger, cliente HTTP, etc.

**Criterio de "pertenece a `/shared/`"**: si dos módulos lo necesitan **exactamente igual** y no se prevé que diverjan, va a shared. Si hay variantes de negocio, NO va a shared.

#### 7.3 · "Parecido pero con variantes" → función nueva

Si un módulo necesita algo *parecido* a una función existente pero con cambios:
- **NO modifiques** la función original añadiendo parámetros opcionales o flags.
- **NO heredes** ni extiendas para acomodar la variante.
- **SÍ crea** una función nueva en el módulo que la necesita, con nombre descriptivo de su propósito específico.

> Una función con 6 parámetros opcionales es la lápida de una abstracción mal concebida. Mejor dos funciones de 2 parámetros cada una.

#### 7.4 · Estructura de carpetas

La estructura concreta del proyecto vive en `stack.md` §12. La forma canónica es:

```
src/
├── shared/                  ← utilidades técnicas puras
└── modules/
    ├── <bounded-context-1>/ ← no importa de otros modules/*
    └── <bounded-context-2>/
```

#### 7.5 · Test de modularidad

En CI, regla automática: cualquier import desde `src/modules/X/...` que apunte a `src/modules/Y/...` (con X ≠ Y) **rompe el build**. Solo se permite importar de `src/shared/...` o de la API pública del propio módulo.

---

## §8. Definition of Done (universal)

Una tarea está terminada **solo si todo lo siguiente es cierto**:

- [ ] Cumple las reglas de los `normas*.md` aplicables.
- [ ] Cumple modularidad estricta (§7).
- [ ] Tests unitarios e integración pasan.
- [ ] E2E pasa si toca flujo crítico.
- [ ] Type check sin errores.
- [ ] Lint sin warnings.
- [ ] Security scan (SAST + SCA) en verde.
- [ ] Estados de loading/error/empty/partial/success diseñados (si toca UI).
- [ ] Logs y trazas añadidos en puntos relevantes.
- [ ] PII identificada y manejada según RGPD (si aplica).
- [ ] Documentación actualizada (README, ADR si aplica, runbook si aplica).
- [ ] Rollback plan claro (feature flag o revert posible).
- [ ] Code review aprobada.
- [ ] Smoke test manual en staging.
- [ ] **`proyecto.md` actualizado** (§6.1).
- [ ] **`errores.md` actualizado** si hubo errores (§6.2).
- [ ] **`aciertos.md` actualizado** si hubo descubrimientos (§6.3).
- [ ] **`funciones.md` actualizado** si surgió repetición (§6.4).
- [ ] **Resumen de cierre emitido** al usuario (§6.6).

---

## §9. Anti-patrones explícitamente prohibidos

- "Solo por ahora meto la API key en el código y luego la muevo." → No. Nunca.
- "Voy a desactivar TypeScript en este archivo porque es complicado." → No. Resuelve el tipo.
- `catch (e) {}` silencioso. → Logueo y manejo o re-throw, nunca silencio.
- `git push --force` en `main`. → Prohibido.
- "Voy a hacer este refactor masivo en la misma PR de la feature." → No. PRs separadas.
- "El LLM dijo que esto está bien, lo subo." → Verifica tú.
- Comentar tests para que pase CI. → Si el test está mal, arréglalo.
- "Confío en este JSON externo, no lo valido." → Validación obligatoria en cualquier frontera.
- "Esto es una herramienta interna, no necesita auth." → Sí la necesita.
- "Mañana añado los logs." → Hoy. En el mismo commit.
- "Voy a importar esta función de otro módulo, total es solo una." → No. Crea la tuya o muévela a `/shared/` (§7).
- "He leído los md aunque no he abierto ninguno." → Falsedad grave (§4).
- "Termino la tarea sin actualizar `proyecto.md`, lo hago luego." → No está terminada (§6).
- "Asumo el stack porque me suena al típico." → Lee `stack.md`. Cada proyecto tiene el suyo.

---

## §10. Glosario mínimo (universal)

> Para términos específicos del dominio del negocio de este proyecto, ver `descripcion.md` §6.

- **PII**: Personal Identifiable Information.
- **RLS**: Row Level Security (validación a nivel de motor de BD).
- **SCA / SAST**: Software Composition Analysis / Static Application Security Testing.
- **ADR**: Architectural Decision Record.
- **SLO**: Service Level Objective.
- **DPA**: Data Processing Agreement (Art. 28 RGPD).
- **RAT**: Registro de Actividades de Tratamiento (Art. 30 RGPD).
- **EAA**: European Accessibility Act (vigente UE desde junio 2025).
- **MCP**: Model Context Protocol (conectores de Claude).
- **Bounded context**: módulo de negocio con su propia lógica y vocabulario, aislado de otros (§7).

---

## §11. Cláusula final

Si en algún momento estas reglas parecen excesivas para "un proyectito pequeño": todo proyecto pequeño que sobrevive se convierte en grande, y entonces retrofitear estas decisiones cuesta semanas. Aplicarlas desde el día 1 cuesta horas.

La tentación de "lo hago rápido y luego lo arreglo" es deuda técnica con interés compuesto. Este sistema existe precisamente para resistirla.

---

*Fin de CLAUDE.md v2.2 — Modificaciones requieren PR explícita y aprobación humana en chat.*
*Este archivo es portable entre proyectos. Para adaptar el sistema a un proyecto nuevo, basta con copiar este archivo + `docs/normas/*` y rellenar `descripcion.md` y `stack.md`.*
