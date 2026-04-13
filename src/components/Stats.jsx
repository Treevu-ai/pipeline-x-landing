const STATS = [
  { value: '15 min', label: 'Tiempo promedio para recibir tu primer reporte' },
  { value: '80%', label: 'De leads con teléfono o medio real' },
  { value: '30', label: 'Leads promedio por reporte en Starter' },
  { value: '0 apps', label: 'Solo WhatsApp, sin instalar nada' },
]

export default function Stats() {
  return (
    <section className="py-16 border-y border-white/5">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="font-mono text-terminal text-sm mb-3">// resultados</p>
          <h2 className="text-4xl font-bold">Resultados que importan</h2>
          <p className="text-slate-400 mt-4">No vanity metrics. Solo lo que impacta tu pipeline.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center glass rounded-2xl p-4">
              <div className="text-4xl font-bold gradient-text mb-1">{s.value}</div>
              <div className="text-sm text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
