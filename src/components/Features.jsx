const FEATURES = [
  {
    icon: '🔍',
    title: 'Búsqueda inteligente',
    desc: 'Encontramos negocios reales en Google Maps. Filtramos por industria, ciudad y señales de actividad (reseñas, horarios, fotos).',
  },
  {
    icon: '📊',
    title: 'Puntaje automático',
    desc: 'Cada lead recibe un score 0-100 basado en reseñas, rating, ubicación y señales de capacidad de pago. Sabrás a quién llamar primero.',
  },
  {
    icon: '💬',
    title: 'Mensajes personalizados',
    desc: 'Te entregamos borradores listos para copiar, adaptados al sector y al dolor típico de cada tipo de negocio.',
  },
  {
    icon: '📱',
    title: 'Entrega por WhatsApp',
    desc: 'Recibes tus reportes directo en WhatsApp. Sin logins, sin dashboards, sin instalar nada.',
  },
  {
    icon: '📄',
    title: 'PDF detallado',
    desc: 'Cada reporte incluye nombre, distrito, rubro, teléfono, enlace a Maps, score y siguiente acción recomendada.',
  },
  {
    icon: '♾️',
    title: 'Búsquedas ilimitadas',
    desc: 'En los planes de pago puedes generar todos los reportes que quieras al mes, sin límite.',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-24 border-t border-white/5">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-mono text-terminal text-sm mb-3">// capacidades</p>
          <h2 className="text-4xl font-bold">Lo que incluye</h2>
          <p className="text-slate-400 mt-4">Todo lo que necesitas para prospectar sin complicarte.</p>
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
