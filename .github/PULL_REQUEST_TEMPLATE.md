<!-- .github/PULL_REQUEST_TEMPLATE.md -->

## Descripción

<!-- ¿Qué cambia esta PR y por qué? -->

## Tipo de cambio

- [ ] Cambio al protocolo (templates/)
- [ ] Cambio al bootstrap (bootstrap.mjs)
- [ ] Cambio a documentación (README, CONTRIBUTING, etc.)
- [ ] Cambio a CI/CD
- [ ] Bump de versión
- [ ] Otro: <especificar>

## Justificación

> Solo si la PR modifica `templates/`. Responde a las tres preguntas (ver CONTRIBUTING.md).

1. **¿Qué dolor real resuelve?**
   <!-- Cita un caso concreto, no un escenario hipotético. -->

2. **¿Aplica universalmente?**
   <!-- Si solo aplica a un sector / contexto, esta PR debería rechazarse o reformularse. -->

3. **¿Has probado el cambio en al menos un proyecto real?**
   <!-- Sí / No, con detalles. -->

## Checklist

- [ ] He leído `CONTRIBUTING.md`.
- [ ] El smoke test pasa localmente: `npm run test:smoke`.
- [ ] Si modifica `templates/`: he verificado que el contenido es genérico (sin nombres de empresas / sectores).
- [ ] Si modifica `bootstrap.mjs`: he añadido o actualizado tests.
- [ ] He actualizado `CHANGELOG.md` bajo `[Unreleased]`.
- [ ] He actualizado documentación afectada (README, normas, etc.).
- [ ] El commit message sigue Conventional Commits.

## Capturas / output

<!-- Si aplica, añade output del bootstrap o capturas. -->

## Issues relacionadas

<!-- Closes #X / Fixes #Y / Related to #Z -->
