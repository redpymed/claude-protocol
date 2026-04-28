# aciertos.md — Atajos, Herramientas y MCPs que Ahorran Tiempo

> **Archivo vivo**. Claude Code añade entradas tras descubrir o usar algo que ahorre tiempo significativo (CLAUDE.md §6.3).
> **Lectura obligatoria al inicio de cada tarea**: revisa si hay un atajo conocido para lo que vas a hacer ANTES de hacerlo a mano.

---

## Cómo leer este archivo

Antes de empezar una tarea, busca por:
- **Tipo de tarea** que vas a hacer (consulta a BD, generar informe, llamar a LLM, etc.).
- **Tecnología** implicada (Supabase, Firebase, Next.js, etc.).

Si hay un atajo registrado, **úsalo**. No "redescubras" la solución cada vez.

---

## Cómo añadir entradas

Plantilla obligatoria:

```markdown
## <Tarea o situación>

- **Herramienta / atajo / MCP**: qué usar.
- **Cuándo aplicar**: criterio claro de cuándo es relevante (no genérico).
- **Cómo usar**: ejemplo concreto de invocación, comando o llamada.
- **Tiempo ahorrado estimado**: vs. hacerlo a mano.
- **Notas / gotchas**: lo que hay que saber para no meter la pata.
- **Tags**: `#categoría` `#tecnología`
```

---

## Categorías sugeridas

Organiza las entradas bajo estas secciones según vayan apareciendo:

- **Conexiones a BD y datos**
- **MCPs disponibles**
- **Generación de código / scaffolding**
- **Testing**
- **Despliegue y CI/CD**
- **LLM y prompts**
- **Debugging**
- **Comandos del proyecto**

---

## Ejemplos (borrar cuando haya entradas reales)

### Conexiones a BD y datos

```markdown
## Consultas a Supabase: usar el MCP, no el cliente JS a mano

- **Herramienta / atajo / MCP**: MCP de Supabase configurado en el entorno.
- **Cuándo aplicar**: SIEMPRE que necesites inspeccionar schema, ejecutar queries de exploración, listar tablas, ver políticas RLS, generar tipos TS desde el schema.
- **Cómo usar**: invocar las herramientas del MCP directamente. No abrir el dashboard web ni escribir SQL en el código solo para "ver qué hay".
- **Tiempo ahorrado estimado**: ~10-15 min por consulta exploratoria vs. abrir dashboard, copiar-pegar SQL, etc.
- **Notas / gotchas**: el MCP respeta RLS según el rol con el que esté autenticado. Para inspección con `service_role` confirmar siempre con el usuario primero (acceso elevado).
- **Tags**: `#supabase` `#bd` `#mcp`
```

### MCPs disponibles

```markdown
## MCP de GitHub para gestión de issues y PRs

- **Herramienta**: MCP de GitHub.
- **Cuándo aplicar**: crear issues, listar PRs abiertas, revisar estado de checks, leer comentarios.
- **Cómo usar**: invocar herramientas del MCP. No usar `gh` CLI ni la web salvo casos específicos.
- **Tiempo ahorrado estimado**: ~5 min por interacción.
- **Notas / gotchas**: para acciones destructivas (cerrar issue, eliminar branch), confirmar siempre con el usuario.
- **Tags**: `#github` `#mcp`
```

### Comandos del proyecto

```markdown
## Generar tipos desde schema de BD

- **Herramienta / atajo**: `pnpm db:types`.
- **Cuándo aplicar**: tras CUALQUIER cambio de schema, antes de escribir código que lo use.
- **Cómo usar**: `pnpm db:types` desde la raíz del proyecto.
- **Tiempo ahorrado estimado**: evita 30+ min de errores de tipos en producción.
- **Notas / gotchas**: regenera `src/shared/types/database.ts`. NO editar a mano.
- **Tags**: `#tipos` `#bd` `#scripts`
```

---

## Entradas reales

> Añade aquí las entradas reales del proyecto. Organízalas por categoría.

### Conexiones a BD y datos
<!-- entradas -->

### MCPs disponibles
<!-- entradas -->

### Generación de código / scaffolding
<!-- entradas -->

### Testing
<!-- entradas -->

### Despliegue y CI/CD
<!-- entradas -->

### LLM y prompts
<!-- entradas -->

### Debugging
<!-- entradas -->

### Comandos del proyecto
<!-- entradas -->
