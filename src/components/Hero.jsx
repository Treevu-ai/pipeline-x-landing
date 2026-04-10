import { useEffect, useState } from 'react'

// ── Configura estos valores antes de publicar ─────────────────────────────────
const TELEGRAM_BOT  = 'Pipeline_X_bot'
const WHATSAPP_NUM  = '51902126765'
const WHATSAPP_TEXT = encodeURIComponent('Hola, quiero ver mi demo gratuita de Pipeline_X')
// ─────────────────────────────────────────────────────────────────────────────

const TELEGRAM_URL  = `https://t.me/${TELEGRAM_BOT}?start=demo`
const WHATSAPP_URL  = `https://wa.me/${WHATSAPP_NUM}?text=${WHATSAPP_TEXT}`

const LINES = [
  { text: '$ pipeline_x scan --query "Retail Lima" --limit 50', delay: 0,    color: 'text-terminal' },
  { text: '▶ Conectando a Google Maps...',                       delay: 800,  color: 'text-slate-400' },
  { text: '▶ 50 empresas encontradas',                           delay: 1600, color: 'text-slate-300' },
  { text: '▶ Calificando leads con IA...',                       delay: 2400, color: 'text-slate-400' },
  { text: '  [████████████████████] 100%',                       delay: 3200, color: 'text-terminal' },
  { text: '▶ ✓ 18 Calificados     score > 70',                   delay: 4000, color: 'text-green-400' },
  { text: '▶ ◎ 14 En seguimiento  score 40-70',                  delay: 4400, color: 'text-yellow-400' },
  { text: '▶ ✗ 18 Descartados     score < 40',                   delay: 4800, color: 'text-red-400' },
  { text: '▶ Generando mensajes personalizados...',              delay: 5400, color: 'text-slate-400' },
  { text: '▶ Done in 47s — 18 leads listos para contactar ✓',   delay: 6200, color: 'text-terminal' },
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

        <p className="text-lg text-slate-400 max-w-xl mx-auto mb-4 leading-relaxed">
          Pipeline_X escanea Google Maps, califica cada lead con IA y redacta mensajes
          personalizados por industria — en minutos, no días.
        </p>

        {/* Social proof micro-copy */}
        <p className="text-sm text-slate-500 mb-10 font-mono">
          Sin tarjeta de crédito · 10 leads gratis · Listo en 5 minutos
        </p>

        {/* CTAs principales — chat primero */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all hover:scale-105 glow-border"
            style={{ background: '#25D366', color: '#000' }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            Ver mi demo en WhatsApp
          </a>

          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all hover:scale-105"
            style={{ background: '#2AABEE', color: '#000' }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            Ver mi demo en Telegram
          </a>
        </div>

        {/* Enlace secundario hacia el formulario */}
        <p className="text-xs text-slate-600 mb-12">
          ¿Prefieres email?{' '}
          <a href="#demo" className="text-slate-400 hover:text-white underline underline-offset-2 transition-colors">
            Solicitar por formulario
          </a>
        </p>

        {/* Terminal */}
        <div className="rounded-2xl overflow-hidden glow-border text-left max-w-2xl mx-auto">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5" style={{background:'#111118'}}>
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-3 font-mono text-xs text-slate-500">pipeline_x — bash</span>
          </div>
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
