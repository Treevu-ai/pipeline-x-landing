# Pipeline_X — Modelo de Negocio

## Qué es

Agente SDR con IA para MIPYMEs de Latinoamérica. Automatiza la prospección: busca leads en Google Maps, los califica con IA y genera reportes listos para entregar o usar.

---

## Dos rutas de cliente

### Ruta 1 — Intermediario (principal)
El cliente de Pipeline_X **no es** la empresa que quiere leads. Es quien **vende prospección como servicio** a esas empresas:

- Estudios contables
- Agencias de marketing
- Consultoras de ventas
- Startups / fintechs que ofrecen servicios B2B

**Flujo:**
1. El intermediario paga Pipeline_X → recibe reporte con su propia marca (white-label)
2. El intermediario entrega el reporte a su cliente final → cobra su precio
3. Pipeline_X no aparece en la ecuación del cliente final

### Ruta 2 — Directo (secundaria)
Empresas MIPYME que quieren prospectos para su propio equipo de ventas. Misma mecánica: piden rubro + ciudad → reciben reporte en 24 h.

---

## Precio y margen (oferta actual en landing)

| Plan | Precio |
|---|---|
| Básico | **S/59 / mes** |
| Starter | **S/129 / mes** |
| Pro | **S/299 / mes** |
| Reseller (white-label) | **S/1,099 / mes** |

**Referencia comercial para reventa (Reseller):**

| | Monto |
|---|---|
| Precio Pipeline_X (Reseller) | **S/1,099 / mes** |
| Tarifa sugerida al cliente final | **S/400–600 / mes** |
| Punto de equilibrio aprox. | **3 clientes** |

El intermediario define su propio precio. La calculadora en la landing usa S/500 como referencia.

**Ejemplo con 10 clientes (a S/500):**
- Ingresos del intermediario: S/5,000
- Pago a Pipeline_X (Reseller): S/1,099
- Margen: S/3,901 / mes

---

## Propuesta de valor diferencial

Vs. competencia (Kommo, HubSpot, Leadsales):

| | Pipeline_X | Alternativas |
|---|---|---|
| Precio | desde S/59 | $150–$800+ |
| Moneda | Soles | Dólares |
| Scraping Google Maps | ✓ | ✗ |
| White-label | ✓ | ✗ |
| Para intermediarios | ✓ | ✗ |
| IA local (datos no salen) | ✓ | ✗ |

---

## Embudo de adquisición

1. **Landing** `pipelinex.app` → CTA "Solicitar reporte gratis"
2. **Lead form** → captura nombre, canal de contacto, tipo de empresa, ciudad y target
3. **API `/api/save-lead`** → guarda lead en base de datos de Notion
4. **Telegram interno** → notificación automática al admin (si está configurado)
5. **Telegram bot** `@Pipeline_X_bot` → canal de entrega/demo para el usuario
6. **Primer reporte gratuito** → gancho de conversión, sin contratos

---

## Stack técnico

| Componente | Tecnología | Dónde |
|---|---|---|
| Landing | Vite + React + Tailwind | Vercel (`pipelinex.app`) |
| API de captura de leads | Vercel Serverless (`/api/save-lead`) | Vercel |
| Base de datos de leads | Notion Database API | Workspace Notion |
| Notificaciones internas | Telegram Bot API | Telegram |
| Bot demo | Telegram `@Pipeline_X_bot` | Telegram |

---

## Fundador

Ricardo Cuba · Founder & CEO · Lima, Perú
