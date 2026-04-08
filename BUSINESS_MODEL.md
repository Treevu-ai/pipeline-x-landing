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

## Precio y margen

| | Monto |
|---|---|
| Precio Pipeline_X | **S/149 / mes** |
| Tarifa sugerida al cliente final | **S/400–600 / mes** |
| Margen neto del intermediario | **S/250+ / mes por cliente** |

El intermediario define su propio precio. La calculadora en la landing usa S/500 como referencia.

**Ejemplo con 10 clientes:**
- Ingresos del intermediario: S/5,000
- Pago a Pipeline_X: S/1,490
- Margen: S/3,510 / mes

---

## Propuesta de valor diferencial

Vs. competencia (Kommo, HubSpot, Leadsales):

| | Pipeline_X | Alternativas |
|---|---|---|
| Precio | S/149 | $150–$800+ |
| Moneda | Soles | Dólares |
| Scraping Google Maps | ✓ | ✗ |
| White-label | ✓ | ✗ |
| Para intermediarios | ✓ | ✗ |
| IA local (datos no salen) | ✓ | ✗ |

---

## Embudo de adquisición

1. **Landing** `pipelinex.app` → CTA "Solicitar reporte gratis"
2. **Lead form** → captura nombre, WhatsApp, tipo de empresa, ciudad → guarda en Supabase (`pipeline_x_leads`)
3. **Telegram** → bot `@Pipeline_X_bot` para confirmar y entregar el reporte
4. **Primer reporte gratuito** → gancho de conversión, sin contratos

---

## Stack técnico

| Componente | Tecnología | Dónde |
|---|---|---|
| Landing | Vite + React + Tailwind | Vercel (`pipelinex.app`) |
| Backend SDR API | FastAPI + Python | Render (`agentepyme-sdr`) |
| LLM | Claude Haiku (primario) / Groq (fallback) | Cloud |
| Scraping | Playwright + Google Maps | Render |
| Base de datos leads | Supabase | `pipeline_x_leads` |
| Bot demo | Telegram `@Pipeline_X_bot` | — |

---

## Fundador

Ricardo Cuba · Founder & CEO · Lima, Perú
