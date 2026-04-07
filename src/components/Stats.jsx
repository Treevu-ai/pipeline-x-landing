const STATS = [
  { value: '50+', label: 'leads calificados por hora' },
  { value: '85%', label: 'menos tiempo vs manual' },
  { value: '3 pasos', label: 'del zero al primer contacto' },
  { value: '10x', label: 'más barato que un SDR humano' },
]

export default function Stats() {
  return (
    <section className="py-16 border-y border-white/5">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-4xl font-bold gradient-text mb-1">{s.value}</div>
            <div className="text-sm text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
