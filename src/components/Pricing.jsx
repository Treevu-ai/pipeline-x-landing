import { useState } from 'react'

// ── Configura estos valores antes de publicar ─────────────────────────────────
const TELEGRAM_BOT  = 'Pipeline_X_bot'
const WHATSAPP_NUM  = '51902126765'
const WHATSAPP_TEXT = encodeURIComponent('Hola, quiero hablar sobre el plan Reseller de Pipeline_X')
// ─────────────────────────────────────────────────────────────────────────────

const TELEGRAM_URL  = `https://t.me/${TELEGRAM_BOT}?start=demo`
const WHATSAPP_RESELLER = `https://wa.me/${WHATSAPP_NUM}?text=${WHATSAPP_TEXT}`

const PLANS_MONTHLY = [
  {
    id: 'free',
    name: 'Free',
    price: 'S/0',
    period: '/siempre',
    desc: 'Prueba sin tarjeta. 10 leads para evaluar.',
    features: [
      '10 leads por búsqueda',
      '1 búsqueda por día',
      'PDF demo (leads limitados)',
      'Entrega por WhatsApp',
    ],
    missing: [
      'Validación SUNAT',
      'Reportes ilimitados',
      'Acceso API',
    ],
    cta: 'Probar gratis',
    ctaHref: TELEGRAM_URL,
    ctaExternal: true,
    popular: false,
    badge: null,
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 'S/129',
    period: '/mes',
    desc: 'Lo más popular para MYPE que necesita clientes cada mes.',
    features: [
      '30 leads por búsqueda',
      'Búsquedas ilimitadas',
      'PDF completo sin límites',
      'Validación con SUNAT',
      'Entrega por WhatsApp',
      'Scoring avanzado',
      'Mensajes personalizados',
    ],
    missing: [],
    cta: 'Empezar con Starter',
    ctaHref: '#demo',
    ctaExternal: false,
    popular: true,
    badge: 'Recomendado',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'S/299',
    period: '/mes',
    desc: 'Mayor volumen y acceso API para automatizar.',
    features: [
      '50 leads por búsqueda',
      'Búsquedas ilimitadas',
      'Acceso API REST',
      'Enriquecimiento completo',
      'Soporte prioritario',
    ],
    missing: [],
    cta: 'Empezar con Pro',
    ctaHref: '#demo',
    ctaExternal: false,
    popular: false,
    badge: null,
  },
  {
    id: 'reseller',
    name: 'Reseller',
    price: 'S/1,099',
    period: '/mes',
    desc: 'Para consultoras y agencies que revenden el servicio.',
    features: [
      '100 leads por búsqueda',
      'Multi-cuenta (hasta 5)',
      'White-label disponible',
      'API + Webhooks',
      'Soporte dedicado',
    ],
    missing: [],
    cta: 'Contactar ventas',
    ctaHref: WHATSAPP_RESELLER,
    ctaExternal: true,
    popular: false,
    badge: 'Para agencias',
  },
]

// Precio anual = mensual × 10 (2 meses gratis)
const PLANS_ANNUAL = PLANS_MONTHLY.map(p => {
  if (!p.period) return p  // Free no cambia
  const monthly = parseInt(p.price.replace('S/', '').replace(',', ''))
  const annual  = monthly * 10
  return {
    ...p,
    price:  `S/${annual.toLocaleString('es-PE')}`,
    period: '/año',
    saving: `Ahorras S/${(monthly * 2).toLocaleString('es-PE')}/año`,
  }
})

export default function Pricing() {
  const [annual, setAnnual] = useState(false)
  const plans = annual ? PLANS_ANNUAL : PLANS_MONTHLY

  return (
    <section id="precios" className="py-24 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-mono text-terminal text-sm mb-3">// precios</p>
          <h2 className="text-4xl font-bold mb-4">Precios simples y predecibles</h2>
          <p className="text-slate-400">
            Un vendedor part-time cuesta S/800–1,200/mes.
            Pipeline_X hace ese trabajo por S/149.
          </p>

          {/* Toggle mensual / anual */}
          <div className="inline-flex items-center gap-3 mt-8 p-1 rounded-xl glass">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                !annual ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                annual ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Anual
              <span className="px-1.5 py-0.5 rounded text-xs font-semibold bg-terminal/20 text-terminal">
                2 meses gratis
              </span>
            </button>
          </div>
        </div>

        {/* Grid de planes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl p-5 flex flex-col relative ${
                plan.popular
                  ? 'bg-gradient-to-b from-purple-900/50 to-purple-950/50 border border-purple-500/50 shadow-lg shadow-purple-900/20'
                  : 'glass'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                  plan.popular ? 'bg-purple-500 text-white' : 'bg-white/10 text-slate-300'
                }`}>
                  {plan.badge}
                </div>
              )}

              {/* Precio */}
              <div className="mb-5 mt-1">
                <h3 className="font-semibold text-base mb-1">{plan.name}</h3>
                <div className="flex items-end gap-1 mb-1.5">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-slate-400 mb-0.5 text-sm">{plan.period}</span>}
                </div>
                {plan.saving && (
                  <p className="text-xs text-terminal font-mono">{plan.saving}</p>
                )}
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{plan.desc}</p>
              </div>

              {/* Features incluidas */}
              <ul className="space-y-2 flex-1 mb-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="text-terminal mt-0.5 shrink-0">✓</span>
                    {f}
                  </li>
                ))}
                {/* Features no incluidas (solo Free y Solo) */}
                {plan.missing?.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-slate-600">
                    <span className="mt-0.5 shrink-0">✗</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-5">
                {plan.ctaExternal ? (
                  <a
                    href={plan.ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-2.5 rounded-xl font-semibold text-xs text-center block transition-all ${
                      plan.popular
                        ? 'bg-purple-500 hover:bg-purple-400 text-white hover:scale-105'
                        : plan.id === 'free'
                        ? 'bg-terminal/20 hover:bg-terminal/30 text-terminal'
                        : 'glass hover:border-white/20 text-slate-300 hover:text-white'
                    }`}
                  >
                    {plan.cta}
                  </a>
                ) : (
                  <a
                    href={plan.ctaHref}
                    className={`w-full py-2.5 rounded-xl font-semibold text-xs text-center block transition-all ${
                      plan.popular
                        ? 'bg-purple-500 hover:bg-purple-400 text-white hover:scale-105'
                        : 'glass hover:border-white/20 text-slate-300 hover:text-white'
                    }`}
                  >
                    {plan.cta}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Nota de trial */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs text-slate-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-terminal animate-pulse" />
            🎁 Todos empiezan con 3 días de trial completo — Sin tarjeta
          </div>
        </div>

        {/* Garantía */}
        <div className="mt-10 text-center">
          <div className="inline-block px-8 py-6 rounded-2xl glass border border-white/10 max-w-lg mx-auto">
            <p className="font-mono text-terminal text-xs mb-3">// garantía de resultado</p>
            <p className="text-white font-semibold text-base mb-2">
              Si tu primer reporte no tiene 5 leads con score ≥ 60,
              te generamos otro gratis.
            </p>
            <p className="text-slate-500 text-xs leading-relaxed">
              Sin contratos · Sin permanencia · Cancela cuando quieras
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
