# normasCalidad.md — Calidad de Código

> **Cargar este archivo cuando** la tarea toque: tests, testing, coverage, refactor, deuda técnica, TypeScript, tipos, code review, ADRs, convenciones de código, naming, dependencias, gestión de paquetes, pre-commit, linters.
>
> **Subordinado a** `CLAUDE.md` §2.

---

## Principios

- **Optimiza para el siguiente programador** que toque esto en 6 meses (probablemente tú mismo, sin contexto).
- **Tests son documentación ejecutable** del comportamiento esperado.
- **Pequeño y atómico** vence a "todo de golpe" siempre.
- **Código aburrido es bueno**: si tu código necesita explicar lo listo que eres, no es código de producción.

---

## TypeScript

- **`strict: true`** + estos extras obligatorios:
  ```json
  {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true
  }
  ```
- **`any` prohibido** salvo con justificación en comentario `// @any-reason: <motivo>`.
- **`unknown` antes que `any`** cuando el tipo no se conoce.
- **Inferencia de tipos** preferida sobre anotaciones redundantes. Si el tipo es obvio del contexto, no lo declares.
- **Tipos derivados del schema**, no escritos a mano: `type User = z.infer<typeof userSchema>`.
- **Discriminated unions** para estados con variantes:
  ```typescript
  type Result<T> =
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; data: T }
    | { status: 'error'; error: Error };
  ```
- **`as` (type assertion) como último recurso**, con comentario justificando.
- **Branded types** para IDs y valores con significado: `type UserId = string & { __brand: 'UserId' }`. Previene mezclar IDs.

---

## Linting y formato

- **ESLint** con config compartida del equipo. Ningún warning tolerado en `main`.
- **Prettier** con config en repo. No debates de estilo en PR.
- **Reglas críticas activas** (ejemplos):
  - `@typescript-eslint/no-floating-promises`: error
  - `@typescript-eslint/no-misused-promises`: error
  - `no-console`: error (excepto `console.warn` y `console.error`, y solo en código no-prod)
  - `eqeqeq`: error
  - `no-unused-vars`: error (con prefix `_` para silenciar intencionalmente)
- **Pre-commit hooks** vía Husky/lefthook: lint, format, type check, secret scan. Si tu hook tarda > 10s, optimízalo o muévelo a CI.

---

## Tests

### Filosofía

- **Tests de comportamiento**, no de implementación. Si refactorizar internals rompe tests, los tests están mal escritos.
- **AAA pattern**: Arrange, Act, Assert. Cada test hace UNA cosa.
- **Cobertura como suelo, no como objetivo.** Un test que cubre línea pero no comportamiento es ruido.

### Pirámide

| Tipo | Cantidad | Velocidad | Cubre |
|---|---|---|---|
| Unit | Muchos | < 100ms | Lógica pura, dominio |
| Integration | Medios | < 1s | Módulo + sus dependencias reales (BD, etc.) |
| E2E | Pocos | < 30s | Flujos críticos de usuario completos |

### Reglas

- **Umbral mínimo**: 80% en lógica de dominio. E2E en flujos críticos (login, pago, exportación, generación de informe).
- **Tests + código en el mismo commit.** No hay PR de "ahora le pongo tests".
- **Tests deterministas**: sin `Date.now()`, sin `Math.random()`, sin red real (mocks o test doubles), sin orden de array implícito.
- **Cada bug encontrado en producción genera un test** que falla antes del fix y pasa después. El test entra en la PR del fix.
- **Snapshots con moderación**: solo cuando el output es realmente estable. Snapshots de UI compleja se vuelven ruido.
- **Test data realista**: factories o fixtures que producen datos como los reales, no `'foo'`/`'bar'`.

---

## Convenciones de código

### Naming

- **Variables y funciones**: `camelCase`.
- **Clases, tipos, interfaces, componentes React**: `PascalCase`.
- **Constantes globales**: `UPPER_SNAKE_CASE`.
- **Archivos**:
  - Componentes React: `PascalCase.tsx` (`UserCard.tsx`).
  - Resto: `kebab-case.ts` (`user-service.ts`).
  - Tests al lado: `user-service.test.ts`.
- **Booleanos** con prefijo: `isActive`, `hasPermission`, `canEdit`, `shouldRetry`.
- **Funciones que devuelven booleanos**: mismo prefijo.
- **Async functions**: nombre describe la acción completa, no añade sufijo `Async` (TypeScript ya marca el tipo).

### Estructura de funciones

- **Una función hace una cosa.** Si el nombre incluye "y" o "and", probablemente son dos funciones.
- **Máximo 4-5 parámetros**. Más, considera un objeto.
- **Parámetros por nombre** (objeto desestructurado) cuando hay > 2 o cuando son booleanos.
- **Early return** sobre nesting profundo:
  ```typescript
  // ❌ Mal
  function process(user) {
    if (user) {
      if (user.active) {
        // ...
      }
    }
  }

  // ✅ Bien
  function process(user) {
    if (!user) return;
    if (!user.active) return;
    // ...
  }
  ```

### Comentarios

- **Comentarios explican el "por qué"**, no el "qué". El código ya dice qué hace.
- **`// TODO`, `// FIXME`, `// HACK` prohibidos en `main`** (CLAUDE.md §2.11).
- **JSDoc** en APIs públicas, no en internals obvios.
- **Comentarios de seguridad**: `// SECURITY: <razón>` cuando el código hace algo defensivo no obvio.

---

## Gestión de dependencias

- **Cada nueva dependencia se justifica.** ¿Vale la pena el peso, la superficie de ataque, el mantenimiento? Si la respuesta no es "sí claro", escribe la función a mano.
- **Criterios de aceptación de una dep**:
  - Sin CVEs críticos abiertos.
  - Último commit < 6 meses.
  - Más de 1 mantenedor (proyectos críticos).
  - Licencia compatible (MIT, Apache 2.0, BSD; cuidado con AGPL, SSPL).
  - Bundle size razonable (revisar con bundlephobia).
- **Lockfiles versionados.** Reproducibilidad obligatoria.
- **Auditoría regular**: `pnpm audit` / `npm audit` / `pip-audit` semanal o en CI.
- **Actualizaciones agrupadas**: Renovate o Dependabot configurado para PRs automáticas. Mergear semanalmente, no acumular meses.
- **Pinning de versiones** en producción (no `^` ni `~` en `package.json` de servicios críticos; sí en librerías publicadas).

---

## Code review

- **Toda PR a `main` requiere review.** Sin excepciones.
- **PRs pequeñas**: < 400 líneas idealmente. > 1000 líneas se rechaza por tamaño y se pide split.
- **Descripción de PR** con: qué hace, por qué, cómo probarlo, capturas si hay UI, link a issue.
- **Revisor verifica**: corrección, claridad, tests, seguridad, observabilidad, documentación.
- **Comentarios constructivos**, no estilo "esto está mal". Sugerir alternativa.
- **Approve no es rubber-stamp**: si no entiendes el cambio, no lo apruebes.

---

## ADRs (Architectural Decision Records)

- **Crear ADR** para cualquier decisión que afecte a más de un módulo o sea costosa de revertir.
- **Ubicación**: `/docs/adr/NNNN-titulo.md`, numerados secuencialmente.
- **Formato corto**:
  ```markdown
  # NNNN. Título corto

  **Estado**: Propuesto / Aceptado / Reemplazado por XXXX
  **Fecha**: YYYY-MM-DD

  ## Contexto
  ¿Qué problema o necesidad llevó a esta decisión?

  ## Decisión
  ¿Qué hemos decidido?

  ## Alternativas consideradas
  ¿Qué otras opciones evaluamos y por qué se descartaron?

  ## Consecuencias
  ¿Qué implica esta decisión? Trade-offs, costes, riesgos.
  ```
- **Inmutables**: una vez aceptado, no se edita. Si cambia, se crea un ADR nuevo que lo reemplaza (`Reemplazado por NNNN`).

---

## Definition of Done (específica de Calidad)

Además de la DoD universal:

- [ ] TypeScript compila sin errores en modo strict.
- [ ] ESLint pasa sin warnings.
- [ ] Prettier aplicado.
- [ ] Tests unitarios para lógica nueva, ≥ 80% en archivos tocados.
- [ ] Test de integración si toca módulo + dependencias reales.
- [ ] E2E si toca flujo crítico.
- [ ] Cualquier `any`, `as`, `// @ts-ignore`, `// eslint-disable` justificado en comentario.
- [ ] PR < 400 líneas o split justificado.
- [ ] Descripción de PR completa con cómo probarlo.
- [ ] Si decisión arquitectónica: ADR creado.
- [ ] Sin `TODO` / `FIXME` / `HACK` introducidos.

---

*Fin de normasCalidad.md*
