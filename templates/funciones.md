# funciones.md — Catálogo de Funciones y Scripts Estandarizados

> **Archivo vivo**. Claude Code añade entradas cuando una operación se repite ≥ 2 veces (CLAUDE.md §6.4).
> **Si una operación se repite ≥ 3 veces sin estar aquí, es un bug del protocolo.**

---

## Filosofía

Cualquier acción que se hace más de una vez de forma idéntica (o casi) debe convertirse en una función o script con nombre. Razones:

1. **Reduce errores**: el script ya está probado, no se reimplementa cada vez con variaciones sutiles.
2. **Documentación implícita**: el nombre y la firma documentan el "qué" y el "cómo".
3. **Acelera al siguiente**: tú o el siguiente programador (humano o Claude Code) lo invoca sin pensar.
4. **Estandariza el equipo**: todos hacen lo mismo de la misma forma.

**Importante**: respeta el principio de modularidad estricta de CLAUDE.md §7. Las funciones genuinamente compartidas (formateo, validación pura) van en `/shared/`. Las repetitivas pero acotadas a un módulo van dentro del módulo.

---

## Cómo leer este archivo

Antes de implementar algo "a mano", busca aquí:
- ¿Hay ya una función para esto?
- Si la hay, **úsala** (no la reimplementes).
- Si la firma actual no encaja del todo, NO la modifiques añadiendo flags. Crea una nueva (§7.3 de CLAUDE.md) o reabre la decisión con el usuario.

---

## Cómo añadir entradas

Plantilla obligatoria:

```markdown
## <nombre de función / script>

- **Propósito**: una frase clara de qué resuelve.
- **Ubicación**: ruta exacta en el repo.
- **Invocación / firma**: cómo se llama o se importa.
- **Cuándo usarla**: criterio de aplicación.
- **Cuándo NO usarla**: limitaciones o casos donde sería incorrecto usarla.
- **Ejemplo de uso**: invocación real con valores concretos.
- **Tags**: `#categoría` `#módulo`
```

---

## Categorías

- **Scripts del proyecto** (npm/pnpm scripts, makefile, etc.)
- **Utilidades shared** (`/shared/...`)
- **Funciones por módulo** (sección por módulo)
- **CLI tools internas**
- **Snippets / generators**

---

## Ejemplos (borrar cuando haya entradas reales)

### Scripts del proyecto

```markdown
## `pnpm db:types`

- **Propósito**: regenerar los tipos TypeScript a partir del schema actual de la BD.
- **Ubicación**: definido en `package.json`, llama a `scripts/gen-db-types.ts`.
- **Invocación**: `pnpm db:types`.
- **Cuándo usarla**: tras cualquier migración o cambio de schema, antes de escribir código que use las tablas afectadas.
- **Cuándo NO usarla**: durante una migración a medio aplicar (los tipos quedarían inconsistentes).
- **Ejemplo de uso**: tras `pnpm db:migrate`, ejecutar `pnpm db:types` antes de seguir.
- **Tags**: `#tipos` `#bd` `#scripts`
```

```markdown
## `pnpm new:module <nombre>`

- **Propósito**: crear scaffolding de un nuevo módulo de negocio respetando la estructura definida en §7.4 de CLAUDE.md.
- **Ubicación**: `scripts/new-module.ts`.
- **Invocación**: `pnpm new:module billing`.
- **Cuándo usarla**: SIEMPRE que vayas a crear un módulo nuevo. Manualmente garantiza errores.
- **Cuándo NO usarla**: si solo añades un fichero a un módulo existente.
- **Ejemplo de uso**: `pnpm new:module reports` crea `src/modules/reports/{domain,application,infrastructure,api}/` con índices y tests vacíos.
- **Tags**: `#scaffolding` `#módulos`
```

### Utilidades shared

```markdown
## `formatEuros(amount: Decimal | number, options?): string`

- **Propósito**: formatear cantidades monetarias en euros con localización es-ES coherente en toda la app.
- **Ubicación**: `src/shared/formatting/money.ts`.
- **Invocación**: `import { formatEuros } from '@/shared/formatting/money'`.
- **Cuándo usarla**: SIEMPRE que se muestre una cantidad en euros al usuario.
- **Cuándo NO usarla**: para almacenar o calcular (usa `Decimal`, formatea solo en presentación).
- **Ejemplo de uso**: `formatEuros(new Decimal('1234.56'))` → `"1.234,56 €"`.
- **Tags**: `#formato` `#dinero` `#shared`
```

```markdown
## `redactPII(text: string): string`

- **Propósito**: redactar datos personales (DNI, NIE, IBAN, email, teléfono) de un string antes de pasarlo a logs o LLM.
- **Ubicación**: `src/shared/privacy/redact.ts`.
- **Invocación**: `import { redactPII } from '@/shared/privacy/redact'`.
- **Cuándo usarla**: antes de cualquier `logger.info(text)` o llamada a LLM con texto generado por usuario.
- **Cuándo NO usarla**: cuando necesitas el dato real para una operación legítima de negocio.
- **Ejemplo de uso**: `logger.info(redactPII("Cliente DNI 12345678Z impagado"))` → `"Cliente DNI [REDACTED] impagado"`.
- **Tags**: `#privacidad` `#rgpd` `#shared`
```

---

## Entradas reales

> Organizadas por categoría. Más recientes arriba dentro de cada categoría.

### Scripts del proyecto
<!-- entradas -->

### Utilidades shared
<!-- entradas -->

### Funciones por módulo

#### Módulo: <nombre>
<!-- entradas específicas del módulo -->

### CLI tools internas
<!-- entradas -->

### Snippets / generators
<!-- entradas -->

---

*Cualquier reutilización detectada por code review que no esté aquí debe corregirse: o se mueve a este catálogo, o se justifica por qué la duplicación es deliberada (variantes de negocio según §7.3 de CLAUDE.md).*
