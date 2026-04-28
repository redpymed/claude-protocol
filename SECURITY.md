# Política de Seguridad

## Reportar una vulnerabilidad

Si encuentras una vulnerabilidad en `claude-protocol`, por favor **NO abras una issue pública**.

En su lugar:

1. Envía un email a: **<security@tu-dominio.com>**
2. Incluye:
   - Descripción del problema.
   - Pasos para reproducirlo.
   - Impacto potencial.
   - Sugerencia de solución (si la tienes).

## Tiempo de respuesta

- **Acuse de recibo**: dentro de 72 horas laborables.
- **Evaluación inicial**: dentro de 7 días.
- **Resolución / parche**: depende de la severidad.

| Severidad | Plazo objetivo |
|---|---|
| Crítica (RCE, exposición masiva) | 7 días |
| Alta (escalada de privilegios, leak) | 14 días |
| Media (DoS, data leak limitado) | 30 días |
| Baja (hardening) | Próxima release |

## Disclosure

Aplicamos **disclosure coordinado**:

1. Recibimos el reporte y lo verificamos.
2. Trabajamos en el fix.
3. Coordinamos fecha de publicación con el reporter.
4. Publicamos parche + advisory.
5. Reconocemos al reporter si lo desea (Hall of Fame en releases).

## Versiones soportadas

Solo la última versión MAJOR recibe parches de seguridad activos.

| Versión | Soporte de seguridad |
|---|---|
| 2.x.x | ✅ Activo |
| < 2.0 | ❌ No soportada |

## Vectores conocidos

Este proyecto distribuye un script de bootstrap que se ejecuta localmente. Los riesgos teóricos son:

- **Compromiso del paquete npm**: protegido con npm token de un solo uso en CI.
- **Compromiso del repo GitHub**: protegido con branch protection y 2FA en cuentas de maintainers.
- **Inyección en el script `install.sh` cuando se ejecuta vía curl**: el patrón `curl | bash` siempre es un riesgo. Recomendamos descargar primero, inspeccionar, y luego ejecutar.

## Hall of Fame

Personas que han reportado vulnerabilidades responsablemente:

_(vacío hasta el primer reporte)_
