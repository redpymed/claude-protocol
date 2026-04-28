# Runbook: <Título descriptivo del incidente>

> **Plantilla de runbook**. Copia este archivo a `docs/runbooks/<topic-en-kebab>.md` y rellénalo.
>
> Un buen runbook permite a cualquiera del equipo resolver el incidente a las 3 AM sin contexto previo.

---

## Metadatos

- **Severidad típica**: P1 / P2 / P3
- **Frecuencia esperada**: <una vez al año / mensual / nunca, esperamos>
- **Última actualización**: YYYY-MM-DD por <nombre>
- **Última vez ejecutado en producción**: YYYY-MM-DD (ver postmortem)

---

## Síntomas

¿Cómo se manifiesta el incidente? ¿Qué alertas suelen dispararse? ¿Qué reporta el usuario?

- Alerta: <nombre exacto de la alerta>
- Métrica afectada: <nombre>
- Reporte típico de usuario: "<frase típica>"

## Pre-condiciones para aplicar este runbook

- [ ] Confirmar que es realmente este incidente y no otro parecido.
- [ ] Verificar que estás en el entorno correcto (producción vs staging).
- [ ] Tener acceso a <herramienta / dashboard / consola>.

---

## Diagnóstico

### Paso 1: <verificación inicial>

```bash
# Comando concreto a ejecutar
<comando>
```

**Qué buscar en el output**: <pista>.

**Si el output muestra X**: ir al Paso 2.
**Si el output muestra Y**: este NO es el incidente esperado. Volver a triage.

### Paso 2: <siguiente verificación>

…

---

## Mitigación inmediata

> El objetivo es **devolver el servicio**, no entender la causa raíz aún.

### Opción A: Mitigación rápida (preferida)

```bash
<comandos concretos>
```

**Tiempo esperado**: <X minutos>
**Riesgo**: <bajo/medio/alto + qué puede salir mal>

### Opción B: Mitigación alternativa

Si A no funciona o no aplica:

```bash
<comandos>
```

### Opción C: Último recurso

> Solo si A y B han fallado y el impacto crece.

```bash
<comandos>
```

---

## Comunicación durante el incidente

- [ ] Acknowledge la alerta.
- [ ] Notificar en `#incidentes`: "Investigando <síntoma>. Aplicando runbook <este>."
- [ ] Si afecta a usuarios externos: actualizar status page.
- [ ] Cada 30 min: actualizar progreso en el canal.
- [ ] Al resolver: anunciar resolución con causa breve. Postmortem en N días.

---

## Resolución definitiva

Una vez mitigado, encontrar y arreglar la causa raíz:

1. <paso 1>
2. <paso 2>
3. <paso 3>

---

## Prevención

¿Qué cambio permanente evita que vuelva a pasar?

- [ ] <acción concreta>
- [ ] <acción concreta>
- [ ] Añadir test que cubre este caso.
- [ ] Mejorar alerta para detección más temprana.

---

## Escalado

Si el runbook no resuelve en X minutos:

- **Nivel 1**: <persona / canal>
- **Nivel 2**: <persona / canal>
- **Soporte del proveedor**: <link al portal / tel>

---

## Referencias

- ADR relacionada: <link>
- Incidente histórico: <link al postmortem>
- Documentación del proveedor: <link>
