const STEPS = [
  {
    num: '01',
    title: 'Define tu búsqueda',
    desc: 'Escribe la industria y ciudad que quieres atacar. "Retail Lima", "Logística Bogotá", "Construcción Trujillo".',
    code: '$ pipeline_x scan "Retail Lima" --limit 100',
    color: 'from-purple-600 to-purple-800',
  },
  {
    num: '02',
    title: 'La IA califica cada lead',
    desc: 'Pipeline_X analiza cada empresa con IA: asigna score 0-100, detecta el tomador de decisión y estima el timeline de compra.',
    code: '✓ Bodega Central SAC — score: 82 — Calificado',
    color: 'from-emerald-600 to-emerald-800',
  },
  {
    num: '03',
    title: 'Mensajes listos para enviar',
    desc: 'Recibe un borrador personalizado por industria para cada lead calificado. Email o WhatsApp. Solo copia, revisa y envía.',
    code: '"Hola [Nombre], vi que manejan +30 facturas pendientes..."',
    color: 'from-blue-600 to-blue-800',
  },
]

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 max-w-5xl mx-auto px-6">
      <div className="text-center mb-16">
        <p className="font-mono text-terminal text-sm mb-3">// proceso</p>
        <h2 className="text-4xl font-bold">Cómo funciona</h2>
        <p className="text-slate-400 mt-4 max-w-md mx-auto">De cero a leads calificados con mensajes listos en menos de 5 minutos.</p>
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
