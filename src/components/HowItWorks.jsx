const STEPS = [
  {
    num: '01',
    title: 'Le dices al bot qué buscas',
    desc: 'Le mandas un mensaje tipo "Ferreterías en Trujillo" o "Clínicas en Arequipa". El bot entiende tu industria y ciudad automáticamente.',
    code: 'WhatsApp: "Clínicas en Lima"',
    color: 'from-purple-600 to-purple-800',
  },
  {
    num: '02',
    title: 'Nosotros buscamos y calificamos',
    desc: 'Pipeline_X busca negocios reales en Google Maps, cruza datos con SUNAT y asigna un puntaje 0-100 a cada empresa.',
    code: 'Score: 85 — Ferretería El Tornillo',
    color: 'from-emerald-600 to-emerald-800',
  },
  {
    num: '03',
    title: 'Recibes el PDF por WhatsApp',
    desc: 'En minutos recibes un PDF con empresas calificadas, datos de contacto y borradores de mensajes personalizados por industria.',
    code: 'WhatsApp: "Aquí está tu reporte..."',
    color: 'from-blue-600 to-blue-800',
  },
]

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 max-w-5xl mx-auto px-6">
      <div className="text-center mb-16">
        <p className="font-mono text-terminal text-sm mb-3">// proceso</p>
        <h2 className="text-4xl font-bold">Cómo funciona</h2>
        <p className="text-slate-400 mt-4 max-w-md mx-auto">3 pasos, todo por WhatsApp. Sin instalar apps.</p>
      </div>

      <div className="space-y-6">
        {STEPS.map((step) => (
          <div key={step.num} className="glass rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start hover:border-white/15 transition-colors">
            <div className={`bg-gradient-to-br ${step.color} rounded-xl w-12 h-12 flex items-center justify-center font-mono font-bold text-sm flex-shrink-0`}>
              {step.num}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-slate-400 leading-relaxed mb-4">{step.desc}</p>
              <div className="font-mono text-xs text-terminal bg-black/30 rounded-lg px-4 py-2 inline-block">
                {step.code}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
