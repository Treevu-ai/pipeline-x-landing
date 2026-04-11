import { useEffect, useState } from 'react'

// ── Configura estos valores antes de publicar ─────────────────────────────────
const TELEGRAM_BOT  = 'Pipeline_X_bot'
const WHATSAPP_NUM  = '51902126765'
const WHATSAPP_TEXT = encodeURIComponent('Hola, quiero ver mi demo gratuita de Pipeline_X')
// ─────────────────────────────────────────────────────────────────────────────

const TELEGRAM_URL  = `https://t.me/${TELEGRAM_BOT}?start=demo`
const WHATSAPP_URL  = `https://wa.me/${WHATSAPP_NUM}?text=${WHATSAPP_TEXT}`

// Fotos de fondo (licencia libre, sin atribución requerida)
const IMG_LIMA  = 'https://images.pexels.com/photos/19985010/pexels-photo-19985010.jpeg?auto=compress&cs=tinysrgb&w=1920'
const IMG_CAFE  = 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=1920&q=80'

const LINES = [
  { text: 'Buscando: "Ferreterías en Los Olivos, Lima"',          delay: 0,    color: 'text-terminal' },
  { text: '▶ Conectando a Google Maps...',                        delay: 800,  color: 'text-slate-400' },
  { text: '▶ 48 negocios encontrados',                            delay: 1600, color: 'text-slate-300' },
  { text: '▶ Calificando con IA...',                              delay: 2400, color: 'text-slate-400' },
  { text: '  [████████████████████] 100%',                        delay: 3200, color: 'text-terminal' },
  { text: '▶ ✓ 17 Calificados     score > 70',                    delay: 4000, color: 'text-green-400' },
  { text: '▶ ◎ 12 En seguimiento  score 40-70',                   delay: 4400, color: 'text-yellow-400' },
  { text: '▶ ✗ 19 Descartados     score < 40',                    delay: 4800, color: 'text-red-400' },
  { text: '▶ Generando mensajes personalizados...',               delay: 5400, color: 'text-slate-400' },
  { text: '▶ PDF listo — enviando a tu WhatsApp ✓',               delay: 6200, color: 'text-terminal' },
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
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-14 overflow-hidden">

      {/* ── Fondo partido en dos mitades ────────────────────────────────── */}
      <div className="absolute inset-0 flex pointer-events-none">
        {/* Mitad izquierda — Lima, Miraflores */}
        <div
          className="w-1/2 h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${IMG_LIMA})` }}
        />
        {/* Mitad derecha — Café cálido */}
        <div
          className="w-1/2 h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${IMG_CAFE})` }}
        />
      </div>

      {/* Overlay izquierdo — tono azul-noche para la ciudad */}
      <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#0a0a1a]/85 via-[#0d1226]/80 to-[#0d1226]/70 pointer-events-none" />

      {/* Overlay derecho — tono ámbar-cálido para el café */}
      <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[#1a0e00]/85 via-[#241200]/80 to-[#1a0800]/70 pointer-events-none" />

      {/* Línea divisoria central */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-px w-px bg-gradient-to-b from-transparent via-white/25 to-transparent pointer-events-none" />

      {/* Velo oscuro global para legibilidad del texto */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      {/* ── Contenido ───────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-xs text-slate-300 mb-8 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-terminal animate-pulse" />
          Para dueños y gerentes de pequeños negocios en Perú
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6 text-white drop-shadow-lg">
          ¿Buscas más clientes pero<br />
          <span className="gradient-text">no tienes equipo de ventas?</span>
        </h1>

        <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-3 leading-relaxed drop-shadow">
          Dinos a quién buscas y en qué ciudad. En minutos recibes
          directo en tu WhatsApp una lista de prospectos calificados —
          con teléfono, score y mensaje listo para enviar.
        </p>

        {/* Comparativa de ahorro */}
        <p className="text-sm text-slate-400 mb-10 font-mono">
          <span className="text-red-400 line-through mr-2">S/1,200/mes en un vendedor</span>
          <span className="text-terminal font-bold">S/149/mes con Pipeline_X</span>
          <span className="text-slate-500 mx-2">·</span>
          Sin tarjeta · 10 leads gratis · Listo en 5 min
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all hover:scale-105 shadow-lg"
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
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all hover:scale-105 shadow-lg"
            style={{ background: '#2AABEE', color: '#000' }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            Ver mi demo en Telegram
          </a>
        </div>

        {/* Enlace secundario */}
        <p className="text-xs text-slate-500 mb-12">
          ¿Prefieres email?{' '}
          <a href="#demo" className="text-slate-400 hover:text-white underline underline-offset-2 transition-colors">
            Solicitar por formulario
          </a>
        </p>

        {/* Terminal */}
        <div className="rounded-2xl overflow-hidden border border-white/10 text-left max-w-2xl mx-auto shadow-2xl backdrop-blur-sm">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5" style={{ background: 'rgba(10,10,24,0.85)' }}>
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-3 font-mono text-xs text-slate-500">pipeline_x — bash</span>
          </div>
          <div className="p-5 font-mono text-sm space-y-1.5 min-h-64" style={{ background: 'rgba(8,8,20,0.80)' }}>
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
