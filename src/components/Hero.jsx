import { useEffect, useState } from 'react'

const LINES = [
  { text: '$ pipeline_x scan --query "Retail Lima" --limit 50', delay: 0, color: 'text-terminal' },
  { text: '▶ Conectando a Google Maps...', delay: 800, color: 'text-slate-400' },
  { text: '▶ 50 empresas encontradas', delay: 1600, color: 'text-slate-300' },
  { text: '▶ Calificando leads con IA...', delay: 2400, color: 'text-slate-400' },
  { text: '  [████████████████████] 100%', delay: 3200, color: 'text-terminal' },
  { text: '▶ ✓ 18 Calificados     score > 70', delay: 4000, color: 'text-green-400' },
  { text: '▶ ◎ 14 En seguimiento  score 40-70', delay: 4400, color: 'text-yellow-400' },
  { text: '▶ ✗ 18 Descartados     score < 40', delay: 4800, color: 'text-red-400' },
  { text: '▶ Generando mensajes personalizados...', delay: 5400, color: 'text-slate-400' },
  { text: '▶ Done in 47s — 18 leads listos para contactar ✓', delay: 6200, color: 'text-terminal' },
]

export default function Hero() {
  const [visibleLines, setVisibleLines] = useState([])

  useEffect(() => {
    LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines(prev => [...prev, i])
      }, line.delay)
    })
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-14 grid-bg overflow-hidden">
      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-700/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-slate-400 mb-8 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-terminal animate-pulse" />
          Agente SDR con IA para MIPYME latinoamericana
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6">
          Tu equipo de ventas<br />
          <span className="gradient-text">trabaja mientras duermes</span>
        </h1>

        <p className="text-lg text-slate-400 max-w-xl mx-auto mb-12 leading-relaxed">
          Pipeline_X escanea Google Maps, califica cada lead con IA y redacta mensajes personalizados por industria — en minutos, no días.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <a href="#precios" className="px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-all hover:scale-105 glow-border">
            Empezar gratis →
          </a>
          <a href="#como-funciona" className="px-8 py-3 rounded-xl glass text-slate-300 hover:text-white font-medium transition-colors">
            Ver demo ↓
          </a>
        </div>

        {/* Terminal */}
        <div className="rounded-2xl overflow-hidden glow-border text-left max-w-2xl mx-auto">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5" style={{background:'#111118'}}>
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-3 font-mono text-xs text-slate-500">pipeline_x — bash</span>
          </div>
          {/* Terminal body */}
          <div className="p-5 font-mono text-sm space-y-1.5 min-h-64" style={{background:'#0d0d1a'}}>
            {LINES.map((line, i) => (
              <div
                key={i}
                className={`${line.color} transition-opacity duration-300 ${visibleLines.includes(i) ? 'opacity-100' : 'opacity-0'}`}
              >
                {line.text}
              </div>
            ))}
            {visibleLines.length === LINES.length && (
              <div className="text-terminal cursor" />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
