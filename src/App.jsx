import { useState, useEffect, useRef, useCallback } from 'react'

const HERO_IMG = 'https://images.pexels.com/photos/19985010/pexels-photo-19985010.jpeg?auto=compress&cs=tinysrgb&w=1600'
const TG_BOT = 'https://t.me/Pipeline_X_bot'

// ── Paleta luxury B&W ─────────────────────────────────────────────────────────
const W   = '#ffffff'           // acento principal (blanco)
const DIM = 'rgba(255,255,255,0.05)'  // grid sutil

// ── Gradiente SEO — turquesa → azul ──────────────────────────────────────────
const GRAD_STYLE = {
  background: 'linear-gradient(90deg, #00d4aa 0%, #4f6ef5 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}
// Wrapper para palabras clave SEO
const Gr = ({ children }) => <span style={GRAD_STYLE}>{children}</span>

const SB_URL = 'https://lyslbbqbjchlqbzvwnyu.supabase.co'
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5c2xiYnFiamNobHFienZ3bnl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NTM0NzAsImV4cCI6MjA5MDEyOTQ3MH0.ae_4y6YDz23yva9B5uIVxMgQhmWU0tfmcKwgvDEx7z4'

async function saveLead(data) {
  return fetch(`${SB_URL}/rest/v1/pipeline_x_leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SB_KEY,
      'Authorization': `Bearer ${SB_KEY}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(data),
  })
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

function useLoopingTerminal(lines, speed = 22) {
  const [phase, setPhase]     = useState(0)
  const [chars, setChars]     = useState(0)
  const [visible, setVisible] = useState([])
  const [loopCount, setLoopCount] = useState(0)
  const reset = useCallback(() => { setPhase(0); setChars(0); setVisible([]) }, [])

  useEffect(() => {
    if (phase >= lines.length) {
      const t = setTimeout(() => { setLoopCount(n => n + 1); reset() }, 2800)
      return () => clearTimeout(t)
    }
    const line = lines[phase]
    if (chars < line.text.length) {
      const t = setTimeout(() => setChars(c => c + 1), speed)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => {
      setVisible(v => [...v, { text: line.text, type: line.type ?? 'normal' }])
      setPhase(p => p + 1); setChars(0)
    }, line.pause ?? 320)
    return () => clearTimeout(t)
  }, [phase, chars, lines, speed, reset])

  const current = phase < lines.length ? lines[phase].text.slice(0, chars) : null
  const currentType = phase < lines.length ? (lines[phase].type ?? 'normal') : null
  return { visible, current, currentType, loopCount }
}

function useFadeIn(threshold = 0.08) {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, vis }
}

// ── Lead Form Modal ───────────────────────────────────────────────────────────

function LeadFormModal({ onClose }) {
  const [form, setForm] = useState({ nombre: '', whatsapp: '', tipo: '', ciudad: '' })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const update = field => e => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.nombre.trim() || !form.whatsapp.trim()) { setError('Nombre y WhatsApp son requeridos.'); return }
    setError('')
    try {
      await saveLead({ nombre: form.nombre.trim(), whatsapp: form.whatsapp.trim(), tipo: form.tipo || null, ciudad: form.ciudad.trim() || null })
    } catch { /* fallback */ }
    window.open(TG_BOT, '_blank', 'noopener,noreferrer')
    setSent(true)
  }

  const inp = 'w-full font-mono text-sm text-black bg-white border border-black/20 px-4 py-3 outline-none focus:border-black placeholder-black/30 transition-colors'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.92)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="w-full max-w-md bg-white shadow-2xl">
        {/* barra de título */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-black/10 bg-black">
          <button onClick={onClose} className="w-2.5 h-2.5 rounded-full bg-white/20 hover:bg-white/40 transition-colors" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <span className="font-mono text-xs ml-2 text-white/30 tracking-wider">pipeline_x — solicitar_reporte.sh</span>
        </div>
        {sent ? (
          <div className="px-8 py-14 text-center">
            <div className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center mx-auto mb-5">
              <span className="text-xl">✓</span>
            </div>
            <p className="font-mono font-bold text-black text-base mb-2 tracking-tight">Solicitud recibida</p>
            <p className="font-mono text-xs text-black/50 mb-8 leading-relaxed">Te enviamos tu reporte en menos de 24 horas<br />por Telegram @Pipeline_X_bot.</p>
            <button onClick={onClose} className="font-mono text-xs tracking-widest uppercase text-white bg-black px-8 py-3 hover:bg-black/80 transition-colors">Cerrar</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
            <div>
              <p className="font-mono font-bold text-black text-base mb-1 tracking-tight">Solicitar reporte gratuito</p>
              <p className="font-mono text-xs text-black/40">Tu primer reporte de prospectos calificados, sin costo.</p>
            </div>
            <div className="space-y-3">
              <input type="text" placeholder="Nombre completo *" value={form.nombre} onChange={update('nombre')} className={inp} required />
              <input type="tel" placeholder="Teléfono / WhatsApp *" value={form.whatsapp} onChange={update('whatsapp')} className={inp} required />
              <select value={form.tipo} onChange={update('tipo')} className={inp + ' cursor-pointer'}>
                <option value="">Tipo de empresa</option>
                <option>Mi propio negocio (MYPE)</option>
                <option>Estudio Contable</option>
                <option>Agencia de Marketing</option>
                <option>Startup / Fintech</option>
                <option>Consultoría</option>
                <option>Otro</option>
              </select>
              <input type="text" placeholder="Ciudad (ej: Lima, Trujillo...)" value={form.ciudad} onChange={update('ciudad')} className={inp} />
            </div>
            {error && <p className="font-mono text-xs text-red-600">{error}</p>}
            <button type="submit" className="w-full font-mono font-bold text-sm text-white bg-black py-4 hover:bg-black/80 active:scale-95 transition-all tracking-wider">
              Solicitar reporte gratis →
            </button>
            <p className="font-mono text-xs text-black/25 text-center">Sin costo ni compromiso. Te contactamos por Telegram.</p>
          </form>
        )}
      </div>
    </div>
  )
}

// ── Navbar ────────────────────────────────────────────────────────────────────

function Navbar({ onOpenForm }) {
  const [scrolled, setScrolled] = useState(false)
  const [blink, setBlink] = useState(true)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  useEffect(() => { const t = setInterval(() => setBlink(b => !b), 800); return () => clearInterval(t) }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between transition-all duration-500 ${scrolled ? 'bg-black/95 backdrop-blur-sm border-b border-white/8' : 'bg-transparent'}`}>
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="Pipeline_X" className="w-6 h-6 object-contain opacity-90"
          onError={e => { e.currentTarget.style.display = 'none' }} />
        <span className="font-mono font-bold text-white text-sm tracking-tight">Pipeline_X</span>
        <span className="flex items-center gap-1.5 font-mono text-xs text-white/40">
          <span className={`inline-block w-1.5 h-1.5 rounded-full bg-white transition-opacity duration-300 ${blink ? 'opacity-80' : 'opacity-20'}`} />
          LIVE
        </span>
      </div>
      <button onClick={onOpenForm} className="font-mono text-xs text-white border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-all duration-200 tracking-wider">
        <span className="hidden sm:inline">→ Reporte gratis</span>
        <span className="sm:hidden">→ Gratis</span>
      </button>
    </nav>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────

const TERMINAL_LINES = [
  { text: '$ pipeline_x scan --target "estudios contables Lima"', type: 'cmd',  pause: 450 },
  { text: '> Conectando a Google Maps...', type: 'info', pause: 300 },
  { text: '> 1,240 registros encontrados.', type: 'ok',  pause: 300 },
  { text: '> Calificando con IA local... [████████] 100%', type: 'ok', pause: 350 },
  { text: '> ✓ 487 Calificados  ✗ 362 Descartados', type: 'result', pause: 600 },
  { text: '> Done in 23s — reporte listo.', type: 'ok', pause: 2200 },
]
// Terminal B&W: cmd=blanco, info=gris medio, ok=blanco, result=gris claro
const LC = { cmd: '#e5e5e5', info: '#525252', ok: '#ffffff', result: '#a3a3a3', normal: '#6b7280' }

function Hero({ onOpenForm }) {
  const { visible, current, currentType, loopCount } = useLoopingTerminal(TERMINAL_LINES, 18)
  const [blink, setBlink] = useState(true)
  const progress = Math.round((visible.length / TERMINAL_LINES.length) * 100)

  useEffect(() => { const t = setInterval(() => setBlink(b => !b), 500); return () => clearInterval(t) }, [])

  return (
    <section
      className="relative overflow-hidden"
      style={{ minHeight: '100svh' }}
    >
      {/* Imagen de Lima fija — parallax real */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${HERO_IMG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          filter: 'brightness(0.18) saturate(0.2)',
        }}
      />

      {/* Grid sutil */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(${DIM} 1px,transparent 1px),linear-gradient(90deg,${DIM} 1px,transparent 1px)`,
        backgroundSize: '56px 56px',
      }} />

      {/* Viñeta perimetral */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center,transparent 35%,rgba(0,0,0,0.75) 100%)',
      }} />

      {/* Gradiente inferior para transición suave */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{
        background: 'linear-gradient(to bottom,transparent,#000)',
      }} />

      {/* Contenido */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-12 flex flex-col lg:flex-row lg:items-center gap-10 min-h-[100svh]">

        {/* Izquierda */}
        <div className="lg:w-[46%] flex flex-col justify-center">

          {/* Eyebrow */}
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-white/40 mb-5">
            SDR · IA · Lima, Perú
          </p>

          <h1 className="font-mono font-bold text-white leading-[1.1] mb-5" style={{ fontSize: 'clamp(1.9rem,4.5vw,3.1rem)' }}>
            ¿Cuántos de tus clientes<br />
            necesitan <Gr>más clientes</Gr>?
          </h1>
          <p className="font-mono text-sm text-white/60 leading-relaxed mb-8">
            <strong className="text-white/90">Pipeline_X</strong> genera reportes de <Gr>prospectos calificados</Gr> que tú entregas bajo tu marca. Tu cliente crece. Tú cobras.
          </p>

          {/* Bullets */}
          <ul className="space-y-2.5 mb-10">
            <li className="font-mono text-sm text-white/55 flex items-center gap-3">
              <span className="text-white/30">—</span> Scraping <Gr>Google Maps</Gr> + <Gr>IA local</Gr>
            </li>
            <li className="font-mono text-sm text-white/55 flex items-center gap-3">
              <span className="text-white/30">—</span> Reporte listo en 24 h, a tu nombre
            </li>
            <li className="font-mono text-sm text-white/55 flex items-center gap-3">
              <span className="text-white/30">—</span> S/149/mes · sin contratos · @Pipeline_X_bot
            </li>
          </ul>

          {/* Métricas */}
          <div className="flex gap-8 mb-10 border-t border-white/10 pt-8">
            {[
              { v: 'S/400–600', l: 'cobras / cliente' },
              { v: 'S/149',     l: 'nos pagas' },
              { v: 'S/250+',    l: 'margen neto' },
            ].map(({ v, l }) => (
              <div key={l}>
                <div className="font-mono font-bold text-white" style={{ fontSize: '1.2rem' }}>{v}</div>
                <div className="font-mono text-xs text-white/30 mt-0.5">{l}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-5 flex-wrap">
            <button onClick={onOpenForm}
              className="font-mono font-bold text-sm text-black bg-white px-7 py-3.5 hover:bg-white/90 active:scale-95 transition-all tracking-wide">
              Solicitar reporte gratis →
            </button>
            <a href="#comparativa" className="font-mono text-xs text-white/40 hover:text-white/80 transition-colors tracking-wider underline underline-offset-4">
              Ver comparativa ↓
            </a>
          </div>
        </div>

        {/* Derecha — terminal */}
        <div className="lg:w-[54%]">
          <div className="border overflow-hidden shadow-2xl" style={{ borderColor: '#1f1f1f', background: 'rgba(6,6,6,0.96)' }}>
            {/* Barra de título terminal */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b" style={{ borderColor: '#141414', background: '#0d0d0d' }}>
              <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <span className="font-mono text-xs ml-2 text-white/25 tracking-wider">pipeline_x — bash — 80×24</span>
              <span className="ml-auto font-mono text-xs text-white/20">
                {progress < 100 ? `escaneando… ${progress}%` : '✓ completado'}
              </span>
            </div>
            {/* Barra de progreso */}
            <div className="h-px bg-white/5">
              <div className="h-px bg-white transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            {/* Output */}
            <div className="px-4 py-4 space-y-1 font-mono text-sm" style={{ minHeight: '188px' }}>
              {visible.map((line, i) => (
                <div key={`${loopCount}-${i}`} style={{ color: LC[line.type] ?? LC.normal }}>{line.text}</div>
              ))}
              {current !== null && (
                <div style={{ color: LC[currentType] ?? LC.normal }}>
                  {current}
                  <span className={`inline-block w-2 h-[1.1em] ml-px align-middle bg-white transition-opacity duration-100 ${blink ? 'opacity-80' : 'opacity-0'}`} />
                </div>
              )}
            </div>
          </div>

          {/* 3 pasos */}
          <div className="grid grid-cols-3 mt-4 border border-white/8">
            {[
              { n: '01', t: 'Nos dices industria + ciudad' },
              { n: '02', t: 'Reporte listo en 24 h' },
              { n: '03', t: 'Lo entregas con tu marca' },
            ].map(({ n, t }) => (
              <div key={n} className="px-3 py-3 border-r border-white/8 last:border-r-0">
                <div className="font-mono text-xs mb-1 text-white/20 tracking-widest">{n}</div>
                <div className="font-mono text-xs text-white/55 leading-snug">{t}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Comparative ───────────────────────────────────────────────────────────────

const FEATURES = [
  { label: 'Precio mensual',            px: 'S/149',  kommo: '$200+', hubspot: '$800+', leadsales: '$150+' },
  { label: 'IA local (datos no salen)', px: true,     kommo: false,  hubspot: false,   leadsales: false  },
  { label: 'Scraping Google Maps',       px: true,     kommo: false,  hubspot: false,   leadsales: false  },
  { label: 'White-label',                px: true,     kommo: false,  hubspot: false,   leadsales: false  },
  { label: 'Para intermediarios',        px: true,     kommo: false,  hubspot: false,   leadsales: false  },
  { label: 'Precios en soles',           px: true,     kommo: false,  hubspot: false,   leadsales: false  },
]
const COLS = [
  { key: 'px',        label: 'Pipeline_X', hi: true  },
  { key: 'kommo',     label: 'Kommo',      hi: false },
  { key: 'hubspot',   label: 'HubSpot',    hi: false },
  { key: 'leadsales', label: 'Leadsales',  hi: false },
]

function CellVal({ val, hi }) {
  if (val === true)  return <span style={{ color: hi ? '#fff' : '#000', fontWeight: 700 }}>✓</span>
  if (val === false) return <span style={{ color: hi ? '#ffffff22' : '#00000022' }}>✗</span>
  return <span style={{ color: hi ? '#fff' : '#000', fontWeight: hi ? 700 : 400 }}>{val}</span>
}

function Comparison({ onOpenForm }) {
  const { ref, vis } = useFadeIn()
  return (
    <section id="comparativa" className="bg-white border-t border-black/8" ref={ref}>
      <div className={`max-w-4xl mx-auto px-6 py-16 transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-black/30 mb-3">Comparativa</p>
        <h2 className="font-mono font-bold text-black mb-10" style={{ fontSize: 'clamp(1.4rem,3vw,2rem)' }}>
          Por qué <Gr>Pipeline_X</Gr> es diferente
        </h2>
        <p className="font-mono text-xs text-black/30 mb-2 sm:hidden">← desliza para ver más →</p>
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-3 pr-6 font-normal text-black/30 text-xs uppercase tracking-wider border-b border-black w-44" />
                {COLS.map(c => (
                  <th key={c.key} className="text-center py-3 px-4 font-bold text-sm border-b border-black"
                    style={{ background: c.hi ? '#000' : '#fff', color: c.hi ? '#fff' : '#000', minWidth: '100px' }}>
                    {c.hi && <span className="block text-xs font-normal mb-1 text-white/40 tracking-widest">★</span>}
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((row, i) => (
                <tr key={i} className="border-b border-black/6 hover:bg-black/2 transition-colors">
                  <td className="py-3 pr-6 text-black/70 font-medium text-sm">{row.label}</td>
                  {COLS.map(c => (
                    <td key={c.key} className="py-3 px-4 text-center" style={{ background: c.hi ? '#000' : 'transparent' }}>
                      <CellVal val={row[c.key]} hi={c.hi} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-10 pt-8 border-t border-black/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="font-mono text-sm text-black/40">¿Convencido? El primer reporte es sin costo.</p>
          <button onClick={onOpenForm}
            className="font-mono font-bold text-sm text-white bg-black px-7 py-3.5 hover:bg-black/80 active:scale-95 transition-all tracking-wide w-full sm:w-auto">
            Solicitar reporte gratis →
          </button>
        </div>
      </div>
    </section>
  )
}

// ── Report preview ────────────────────────────────────────────────────────────

const SAMPLE_LEADS = [
  { empresa: 'Distribuidora Central SAC', industria: 'Retail',       ciudad: 'Lima',     score: 88, accion: 'Llamar esta semana' },
  { empresa: 'Construc Norte Perú SRL',   industria: 'Construcción', ciudad: 'Trujillo', score: 76, accion: 'Enviar propuesta'   },
  { empresa: 'Logística Pacífico EIRL',   industria: 'Logística',    ciudad: 'Callao',   score: 71, accion: 'Primer contacto'   },
]

function ReportPreview({ onOpenForm }) {
  const { ref, vis } = useFadeIn()
  const [hovered, setHovered] = useState(null)
  return (
    <section className="bg-black border-t border-white/6" ref={ref}>
      <div className={`max-w-4xl mx-auto px-6 py-16 transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-white/25 mb-3">Ejemplo de reporte</p>
        <h2 className="font-mono font-bold text-white mb-8" style={{ fontSize: 'clamp(1.4rem,3vw,2rem)' }}>
          Así se ve el <Gr>reporte de leads</Gr>
        </h2>
        <div className="border overflow-hidden" style={{ borderColor: '#1a1a1a' }}>
          <div className="flex items-center gap-2 px-4 py-2.5 border-b" style={{ borderColor: '#141414', background: '#0d0d0d' }}>
            <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <span className="font-mono text-xs ml-2 text-white/25 tracking-wider">reporte_retail_lima_abril_2026.html</span>
          </div>
          <div className="overflow-x-auto bg-black">
            <table className="w-full font-mono text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                  {['Empresa','Industria','Ciudad','Score','Acción'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-normal text-xs uppercase tracking-[0.15em] text-white/20">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SAMPLE_LEADS.map((l, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #111', background: hovered === i ? '#0f0f0f' : 'transparent', transition: 'background .15s' }}
                    onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                    <td className="px-4 py-3 font-semibold text-white/90">{l.empresa}</td>
                    <td className="px-4 py-3 text-white/35">{l.industria}</td>
                    <td className="px-4 py-3 text-white/35">{l.ciudad}</td>
                    <td className="px-4 py-3 font-bold text-white">{l.score}</td>
                    <td className="px-4 py-3 text-white/35">{l.accion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 font-mono text-xs border-t text-white/15 bg-black" style={{ borderColor: '#111' }}>
            generado en 23 min · export .csv · pipeline_x v2.1
          </div>
        </div>
        <button onClick={onOpenForm}
          className="mt-8 w-full font-mono font-bold text-sm text-black bg-white py-4 hover:bg-white/90 active:scale-95 transition-all tracking-wide">
          Quiero un reporte así para mis clientes →
        </button>
      </div>
    </section>
  )
}

// ── Pricing calculator ────────────────────────────────────────────────────────

function PricingCalculator({ onOpenForm }) {
  const PRESETS = [3, 5, 10, 20]
  const [clients, setClients] = useState(10)
  const RATE = 500, COST = 149
  const revenue = clients * RATE
  const cost    = clients * COST
  const margin  = revenue - cost
  const { ref, vis } = useFadeIn()

  return (
    <section id="calculadora" className="bg-white border-t border-black/8" ref={ref}>
      <div className={`max-w-4xl mx-auto px-6 py-16 transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-black/30 mb-3">Calculadora</p>
        <h2 className="font-mono font-bold text-black mb-10" style={{ fontSize: 'clamp(1.4rem,3vw,2rem)' }}>
          ¿Cuántos clientes activarías con <Gr>S/149/mes</Gr>?
        </h2>
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-14">
          {/* Presets */}
          <div className="lg:w-56 mb-8 lg:mb-0">
            <p className="font-mono text-xs text-black/40 mb-4">Tarifa sugerida S/500. Tú defines el precio.</p>
            <div className="flex gap-0 border border-black w-fit">
              {PRESETS.map(n => (
                <button key={n} onClick={() => setClients(n)}
                  className="font-mono text-sm px-5 py-3 border-r border-black last:border-r-0 transition-colors"
                  style={{ background: clients === n ? '#000' : '#fff', color: clients === n ? '#fff' : '#000' }}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Métricas */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 border-t border-l border-black">
            {[
              { label: 'ingresas',    value: `S/${revenue.toLocaleString()}`, hi: true  },
              { label: 'nos pagas',   value: `S/${cost.toLocaleString()}`,    hi: false },
              { label: 'margen neto', value: `S/${margin.toLocaleString()}`,  hi: false },
            ].map(({ label, value, hi }) => (
              <div key={label} className="px-6 py-6 border-r border-b border-black" style={{ background: hi ? '#000' : '#fff' }}>
                <p className="font-mono text-xs mb-2 tracking-widest uppercase" style={{ color: hi ? '#ffffff40' : '#00000040' }}>{label}</p>
                <p className="font-mono font-bold text-2xl transition-all duration-300" style={{ color: hi ? '#fff' : '#000' }}>{value}</p>
                <p className="font-mono text-xs mt-1" style={{ color: hi ? '#ffffff25' : '#00000025' }}>al mes</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-black/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="font-mono text-sm text-black/40">Primer reporte sin costo. Sin contratos.</p>
          <button onClick={onOpenForm}
            className="font-mono font-bold text-sm text-white bg-black px-7 py-3.5 hover:bg-black/80 active:scale-95 transition-all tracking-wide w-full sm:w-fit">
            Empezar ahora →
          </button>
        </div>
      </div>
    </section>
  )
}

// ── Direct SMB route ──────────────────────────────────────────────────────────

function DirectRoute({ onOpenForm }) {
  const { ref, vis } = useFadeIn()
  return (
    <section className="bg-black border-t border-white/6" ref={ref}>
      <div className={`max-w-4xl mx-auto px-6 py-16 transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="border border-white/8 p-8 sm:p-12">
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-white/30 mb-4">Para tu propio negocio</p>
          <h2 className="font-mono font-bold text-white leading-snug mb-4" style={{ fontSize: 'clamp(1.4rem,3vw,2rem)' }}>
            ¿Eres tú el que quiere<br className="hidden sm:block" /> <Gr>más clientes</Gr>?
          </h2>
          <p className="font-mono text-sm text-white/45 leading-relaxed mb-8 max-w-lg">
            Pipeline_X también trabaja directo contigo. Nos dices a qué tipo de empresa le vendes y en qué ciudad, y en 24 horas tienes una lista de prospectos calificados lista para contactar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <button onClick={onOpenForm}
              className="font-mono font-bold text-sm text-black bg-white px-7 py-3.5 hover:bg-white/90 active:scale-95 transition-all tracking-wide w-full sm:w-auto">
              Quiero prospectos para mi negocio →
            </button>
            <p className="font-mono text-xs text-white/25">Sin costo · sin contratos · reporte en 24 h</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer({ onOpenForm }) {
  const { ref, vis } = useFadeIn()
  return (
    <footer className="bg-black border-t border-white/6" ref={ref}>
      <div className={`max-w-4xl mx-auto px-6 py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-8 transition-all duration-700 ${vis ? 'opacity-100' : 'opacity-0'}`}>
        <div>
          <p className="font-mono font-bold text-white text-xl mb-2 tracking-tight">¿Cuándo empezamos?</p>
          <p className="font-mono text-sm text-white/35">Primer reporte sin costo. En 24 horas en tu bandeja.</p>
        </div>
        <button onClick={onOpenForm}
          className="font-mono font-bold text-sm text-black bg-white px-10 py-4 hover:bg-white/90 active:scale-95 transition-all tracking-wide w-fit whitespace-nowrap">
          Solicitar reporte gratis →
        </button>
      </div>
      <div className="max-w-4xl mx-auto px-6 pb-8 border-t border-white/5 pt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Pipeline_X" className="w-4 h-4 object-contain opacity-25"
            onError={e => { e.currentTarget.style.display = 'none' }} />
          <p className="font-mono text-xs text-white/18">Pipeline_X · pipelinex.app · @Pipeline_X_bot · Lima, Perú</p>
        </div>
        <p className="font-mono text-xs text-white/18">
          Ricardo Cuba · <span className="text-white/30">Founder &amp; CEO</span>
        </p>
      </div>
    </footer>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [formOpen, setFormOpen] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('px_form_seen')) return
    const t = setTimeout(() => setFormOpen(true), 2000)
    return () => clearTimeout(t)
  }, [])

  const closeForm = () => {
    sessionStorage.setItem('px_form_seen', '1')
    setFormOpen(false)
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar onOpenForm={() => setFormOpen(true)} />
      <Hero onOpenForm={() => setFormOpen(true)} />
      <Comparison onOpenForm={() => setFormOpen(true)} />
      <ReportPreview onOpenForm={() => setFormOpen(true)} />
      <PricingCalculator onOpenForm={() => setFormOpen(true)} />
      <DirectRoute onOpenForm={() => setFormOpen(true)} />
      <Footer onOpenForm={() => setFormOpen(true)} />
      {formOpen && <LeadFormModal onClose={closeForm} />}
    </div>
  )
}
