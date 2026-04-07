const FEATURES = [
  {
    icon: '🗺️',
    title: 'Scraping inteligente',
    desc: 'Extrae empresas de Google Maps con nombre, industria, teléfono, email, sitio web y calificación. Opcional: consulta SUNAT por RUC.',
  },
  {
    icon: '🤖',
    title: 'Calificación con IA',
    desc: 'Score 0-100, etapa CRM, encaje con el producto, timeline de compra, tomador de decisión y bloqueadores identificados.',
  },
  {
    icon: '✉️',
    title: 'Mensajes personalizados',
    desc: 'Borradores adaptados al sector de cada lead. Retail habla de inventario, Logística de costos operativos, Construcción de flujo de caja.',
  },
  {
    icon: '📊',
    title: 'Pipeline visual',
    desc: 'Exporta a CSV o consulta la API. Integra con tu CRM, Google Sheets o cualquier herramienta que ya usas.',
  },
  {
    icon: '⚡',
    title: 'API REST',
    desc: 'Endpoints para scrape, qualify, enrich y pipeline completo. Jobs en background para queries grandes. Documentación incluida.',
  },
  {
    icon: '🔒',
    title: 'Sin datos en la nube',
    desc: 'Tus leads son tuyos. No almacenamos ni compartimos información de tus prospectos con terceros.',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-24 border-t border-white/5">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-mono text-terminal text-sm mb-3">// capacidades</p>
          <h2 className="text-4xl font-bold">Todo lo que necesitas para prospectar</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="glass rounded-2xl p-6 hover:border-purple-500/30 transition-all group">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
