const PLANS = [
  {
    name: 'Starter',
    price: '$39',
    period: '/mes',
    desc: 'Para equipos que están empezando a prospectar.',
    features: [
      '200 leads/mes',
      'Calificación con IA',
      'Canal email',
      'Exportar CSV',
      'Soporte por email',
    ],
    cta: 'Empezar gratis',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$89',
    period: '/mes',
    desc: 'Para equipos de ventas activos que necesitan escala.',
    features: [
      '1,000 leads/mes',
      'Calificación con IA',
      'Email + WhatsApp',
      'Acceso a API REST',
      'Enriquecimiento de contactos',
      'Soporte prioritario',
    ],
    cta: 'Empezar con Pro',
    popular: true,
  },
  {
    name: 'Agency',
    price: '$199',
    period: '/mes',
    desc: 'Para agencias que gestionan múltiples clientes.',
    features: [
      'Leads ilimitados',
      'Multi-cuenta',
      'API sin límites',
      'Reportes HTML',
      'Onboarding dedicado',
      'SLA garantizado',
    ],
    cta: 'Hablar con ventas',
    popular: false,
  },
]

export default function Pricing() {
  return (
    <section id="precios" className="py-24 border-t border-white/5">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-mono text-terminal text-sm mb-3">// precios</p>
          <h2 className="text-4xl font-bold">Precios simples y predecibles</h2>
          <p className="text-slate-400 mt-4">Un SDR humano en LATAM cuesta $800–1,500/mes. Pipeline_X desde $39.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 flex flex-col relative ${
                plan.popular
                  ? 'bg-gradient-to-b from-purple-900/50 to-purple-950/50 border border-purple-500/50 shadow-lg shadow-purple-900/20'
                  : 'glass'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-purple-500 text-white text-xs font-semibold">
                  Más popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-1">{plan.name}</h3>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-slate-400 mb-1">{plan.period}</span>
                </div>
                <p className="text-sm text-slate-400">{plan.desc}</p>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="text-terminal">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className={`w-full py-3 rounded-xl font-semibold text-sm text-center transition-all ${
                  plan.popular
                    ? 'bg-purple-500 hover:bg-purple-400 text-white hover:scale-105'
                    : 'glass hover:border-white/20 text-slate-300 hover:text-white'
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
