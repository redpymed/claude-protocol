# Módulo: __MODULE_NAME__

> Bounded context creado con `claude-protocol new-module __MODULE_NAME__`.
> Sigue las reglas de modularidad estricta de `CLAUDE.md` §7.

## Estructura

```
__MODULE_NAME__/
├── domain/              # Lógica de negocio pura (entidades, value objects, reglas)
├── application/         # Casos de uso, servicios de aplicación, orquestación
├── infrastructure/      # Adaptadores: BD, APIs externas, cola, cache
├── api/                 # Capa de exposición: endpoints, controllers, schemas
├── index.ts             # API pública del módulo (lo único importable desde fuera)
└── README.md            # Este archivo
```

## Reglas

### Lo que SÍ puedes hacer

- Importar libremente entre las capas internas (`domain` ↔ `application` ↔ `infrastructure` ↔ `api`).
- Importar desde `src/shared/` (utilidades técnicas puras).
- Exponer API pública del módulo a través de `index.ts`.

### Lo que NO puedes hacer

- ❌ Importar desde `src/modules/<otro-módulo>/...`. Está prohibido por CLAUDE.md §7.
- ❌ Modificar `index.ts` de otros módulos.
- ❌ Acceder directamente a la BD de otro módulo (cada módulo es dueño de sus tablas).

### Cómo comunicarte con otros módulos

1. **Eventos de dominio** (publish/subscribe). Recomendado para acoplamiento débil.
2. **API pública** del otro módulo (`import { ... } from '@/modules/otro/api'`). Solo lo expuesto en su `index.ts`.
3. **Tablas compartidas read-only** documentadas como contrato.

Si tienes dudas sobre cómo estructurar la comunicación, consulta CLAUDE.md §7 antes de improvisar.

## Validar modularidad

```bash
claude-protocol validate
```

Detecta cualquier import cruzado y rompe el build si los hay.

## Convenciones por capa

### `domain/`
- Sin dependencias del framework (Express, Next, Firebase, etc.).
- Tipos primitivos con branded types cuando aplique (`UserId`, `OrderId`, etc.).
- Errores como tipos, no excepciones lanzadas (preferido).

### `application/`
- Orquesta el dominio. Llama a infrastructure mediante interfaces (puerto/adaptador).
- Punto de entrada de los casos de uso.
- No conoce HTTP, serialización ni transporte.

### `infrastructure/`
- Implementa las interfaces declaradas por `application/`.
- Aquí van repositorios, clientes HTTP, productores de eventos, etc.
- Mocks y adapters de testing también aquí.

### `api/`
- Endpoints HTTP / GraphQL / RPC.
- Validación de schema con Zod / Valibot en la frontera.
- Mapping entre DTOs externos y tipos del dominio.

## Tests

Convención: tests al lado del código.

```
domain/
├── user.ts
├── user.test.ts
└── ...
```

Cobertura mínima recomendada (CLAUDE.md): 80% en `domain/` y `application/`.

---

*Para crear otro módulo: `claude-protocol new-module <otro-nombre>`.*
