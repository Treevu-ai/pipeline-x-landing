import { useState, useEffect, useRef, useCallback } from 'react'

const HERO_IMG  = 'https://images.pexels.com/photos/19985010/pexels-photo-19985010.jpeg?auto=compress&cs=tinysrgb&w=1600'
const HERO_CAFE = 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=1600&q=80'
const TG_BOT   = 'https://t.me/Pipeline_X_bot?start=demo'
const WA_BOT   = 'https://wa.me/51902126765?text=' + encodeURIComponent('Hola, quiero mi primer listado de empresas gratis')

// ── Paleta luxury B&W ─────────────────────────────────────────────────────────
const DIM = 'rgba(255,255,255,0.05)'

// ── Gradiente SEO — turquesa → azul ──────────────────────────────────────────
const GRAD_STYLE = {
  background: 'linear-gradient(90deg, #00d4aa 0%, #4f6ef5 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  filter: 'drop-shadow(0 0 12px rgba(0,212,170,0.55))',
}
const Gr = ({ children }) => <span style={GRAD_STYLE}>{children}</span>

const CHIPS = [
  { icon: '🇵🇪', label: 'Hecho para Perú' },
  { icon: '🏛️', label: 'Datos verificados SUNAT' },
  { icon: '📱', label: 'Solo necesitas WhatsApp' },
  { icon: '⏱️', label: 'Primer reporte en 24 h' },
]

const MOCK_LEADS = [
  { empresa: 'Ferrería El Maestro SAC',  sector: 'Ferretería',   ciudad: 'Trujillo', prioridad: 'Alta',  cap_pago: 'Alta',   accion: 'Llamar hoy',  mensaje: 'Hay más de 80 constructoras activas en Trujillo que aún no conocen su ferretería — y conseguirlas hoy depende de quién llame primero. Le preparamos un listado calificado con contacto directo y mensaje listo para enviar. ¿Le parece si lo revisamos esta semana?' },
  { empresa: 'Contadores & Asoc. SRL',   sector: 'Contabilidad', ciudad: 'Lima',     prioridad: 'Alta',  cap_pago: 'Media',  accion: 'Enviar email', mensaje: 'La mayoría de estudios contables en Lima siguen dependiendo de referidos para crecer — un canal que se agota. Identificamos MYPE activas en su zona que necesitan outsourcing contable, con RUC verificado y mensaje personalizado listo para enviar. ¿Agendamos 20 minutos esta semana?' },
  { empresa: 'Transportes Norte SAC',    sector: 'Logística',    ciudad: 'Piura',    prioridad: 'Alta',  cap_pago: 'Alta',   accion: 'Llamar hoy',  mensaje: 'Conseguir carga constante sin depender de contactos o intermediarios sigue siendo el cuello de botella en logística. Generamos un reporte con empresas en Piura que demandan servicio de transporte — calificadas por volumen y sector, con contacto directo. ¿Lo coordinamos?' },
  { empresa: 'Inmobiliaria Costa SAC',   sector: 'Inmobiliaria', ciudad: 'Lima',     prioridad: 'Alta',  cap_pago: 'Alta',   accion: 'Propuesta',   mensaje: 'Detectamos empresas en expansión en Lima buscando locales comerciales este trimestre — antes de que su competencia las contacte. Le entregamos 40 prospectos calificados con razón social, contacto y mensaje personalizado en menos de 24 h. ¿Le enviamos una muestra?' },
  { empresa: 'Clínica San Marcos SRL',   sector: 'Salud',        ciudad: 'Chiclayo', prioridad: 'Media', cap_pago: 'Alta',   accion: 'Seguimiento', mensaje: null },
  { empresa: 'Moda Perú Import EIRL',    sector: 'Retail',       ciudad: 'Arequipa', prioridad: 'Media', cap_pago: 'Media',  accion: 'Contactar',   mensaje: null },
  { empresa: 'Agro Export Andes SAC',    sector: 'Agroindustria',ciudad: 'Cusco',    prioridad: 'Alta',  cap_pago: 'Alta',   accion: 'Llamar hoy',  mensaje: 'Llegar a compradores mayoristas en Lima sin pasar por brokers sigue siendo el reto principal para agroexportadores en Cusco. Identificamos 35 distribuidoras calificadas para su categoría de producto, con contacto verificado y mensaje listo. ¿Cuándo podemos coordinar?' },
  { empresa: 'Tech Solutions EIRL',      sector: 'Tecnología',   ciudad: 'Lima',     prioridad: 'Baja',  cap_pago: 'Básica', accion: 'Descartar',   mensaje: null },
]
const TARGET_SCORES = [91, 84, 88, 82, 65, 72, 80, 45]

async function saveLead(data) {
  const res = await fetch('/api/save-lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`save-lead ${res.status}`)
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

// ── Lead Mockup (hero right column) ──────────────────────────────────────────

const PRIORIDAD_CFG = {
  Alta:  { color: '#00d4aa', bg: 'rgba(0,212,170,0.08)',  border: 'rgba(0,212,170,0.25)'  },
  Media: { color: '#7b8ffa', bg: 'rgba(123,143,250,0.08)', border: 'rgba(123,143,250,0.25)' },
  Baja:  { color: 'rgba(255,255,255,0.28)', bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.10)' },
}
const CAP_CFG = {
  Alta:   { color: '#c084fc', border: 'rgba(192,132,252,0.30)' },
  Media:  { color: '#7b8ffa', border: 'rgba(123,143,250,0.30)' },
  Básica: { color: '#e5c97a', border: 'rgba(229,201,122,0.30)' },
}

function Badge({ label, color, bg, border }) {
  return (
    <span className="font-mono" style={{
      fontSize: '0.58rem', color, background: bg,
      border: `1px solid ${border}`, padding: '1px 5px', borderRadius: '2px',
      whiteSpace: 'nowrap',
    }}>{label}</span>
  )
}

function LeadMockup() {
  const [phase, setPhase]     = useState(0)
  const [scores, setScores]   = useState(MOCK_LEADS.map(() => 0))
  const [expanded, setExpanded] = useState(null)
  const [loopKey, setLoopKey] = useState(0)

  // Reveal rows one by one
  useEffect(() => {
    if (phase >= MOCK_LEADS.length) return
    const t = setTimeout(() => setPhase(p => p + 1), 420)
    return () => clearTimeout(t)
  }, [phase, loopKey])

  // Count up score for each newly revealed row
  useEffect(() => {
    if (phase === 0 || phase > MOCK_LEADS.length) return
    const idx = phase - 1
    const target = TARGET_SCORES[idx]
    let current = 0
    const step = Math.ceil(target / 18)
    const iv = setInterval(() => {
      current = Math.min(current + step, target)
      setScores(s => { const ns = [...s]; ns[idx] = current; return ns })
      if (current >= target) clearInterval(iv)
    }, 42)
    return () => clearInterval(iv)
  }, [phase])

  // Auto-expand first Alta row when all done; reset loop
  useEffect(() => {
    if (phase < MOCK_LEADS.length) return
    const firstAlta = MOCK_LEADS.findIndex(l => l.mensaje)
    setExpanded(firstAlta)
    const t = setTimeout(() => {
      setPhase(0); setScores(MOCK_LEADS.map(() => 0))
      setExpanded(null); setLoopKey(k => k + 1)
    }, 4200)
    return () => clearTimeout(t)
  }, [phase])

  const scoreColor = s => s >= 80 ? '#00d4aa' : s >= 60 ? '#7b8ffa' : 'rgba(255,255,255,0.35)'
  const altaCount  = MOCK_LEADS.filter(l => l.prioridad === 'Alta').length

  return (
    <div className="overflow-hidden shadow-2xl" style={{ border: '1px solid #1a1a1a', background: 'rgba(5,5,5,0.97)', borderRadius: '2px' }}>

      {/* Header bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b" style={{ borderColor: '#111', background: '#080808' }}>
        <span className="w-2.5 h-2.5 rounded-full bg-white/12" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/8" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/8" />
        <span className="font-mono text-xs ml-2 text-white/50 tracking-wider">
          reporte_calificado.csv — {phase}/{MOCK_LEADS.length} procesados
        </span>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#00d4aa', boxShadow: '0 0 6px #00d4aa' }} />
          <span className="font-mono text-xs text-white/40">live</span>
        </span>
      </div>

      {/* Column headers */}
      <div className="px-3 py-2 border-b" style={{
        borderColor: '#0f0f0f',
        display: 'grid', gridTemplateColumns: '1fr 36px 52px 52px 62px',
        gap: '0 6px',
      }}>
        {['Empresa', 'Score', 'Prioridad', 'Cap. Pago', 'Acción'].map(h => (
          <span key={h} className="font-mono text-white/22 uppercase tracking-wider" style={{ fontSize: '0.58rem' }}>{h}</span>
        ))}
      </div>

      {/* Rows */}
      <div>
        {MOCK_LEADS.map((lead, i) => {
          const vis      = i < phase
          const score    = scores[i]
          const sColor   = scoreColor(score)
          const pCfg     = PRIORIDAD_CFG[lead.prioridad]
          const cCfg     = CAP_CFG[lead.cap_pago]
          const isOpen   = expanded === i && lead.mensaje
          return (
            <div key={`${loopKey}-${i}`} style={{
              borderBottom: i < MOCK_LEADS.length - 1 ? '1px solid #0c0c0c' : 'none',
              opacity: vis ? 1 : 0,
              transform: vis ? 'translateY(0)' : 'translateY(6px)',
              transition: 'opacity 0.32s ease, transform 0.32s ease',
            }}>
              {/* Main row */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 36px 52px 52px 62px',
                gap: '0 6px', alignItems: 'center', padding: '6px 12px',
                cursor: lead.mensaje ? 'pointer' : 'default',
                background: isOpen ? 'rgba(0,212,170,0.03)' : 'transparent',
              }} onClick={() => lead.mensaje && setExpanded(isOpen ? null : i)}>

                {/* Empresa */}
                <div>
                  <div className="font-mono font-semibold leading-tight truncate" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.68rem' }}>{lead.empresa}</div>
                  <div className="font-mono mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.22)', fontSize: '0.6rem' }}>{lead.sector} · {lead.ciudad}</div>
                </div>

                {/* Score */}
                <div className="flex flex-col items-center gap-0.5">
                  <span className="font-mono font-bold" style={{ color: sColor, fontSize: '0.72rem', lineHeight: 1 }}>{score || '—'}</span>
                  <div style={{ width: '28px', height: '2px', background: 'rgba(255,255,255,0.07)', borderRadius: '1px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${score}%`, background: sColor, transition: 'width 0.08s' }} />
                  </div>
                </div>

                {/* Prioridad */}
                <div>{vis && <Badge label={lead.prioridad} color={pCfg.color} bg={pCfg.bg} border={pCfg.border} />}</div>

                {/* Cap. Pago */}
                <div>{vis && <Badge label={lead.cap_pago} color={cCfg.color} bg="transparent" border={cCfg.border} />}</div>

                {/* Acción */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {vis && score > 0 && (
                    <span className="font-mono" style={{ fontSize: '0.58rem', color: sColor, border: `1px solid ${sColor}35`, background: `${sColor}0a`, padding: '1px 4px', borderRadius: '2px', whiteSpace: 'nowrap' }}>
                      {lead.accion}
                    </span>
                  )}
                  {lead.mensaje && vis && (
                    <span style={{ color: 'rgba(255,255,255,0.20)', fontSize: '0.6rem' }}>{isOpen ? '▲' : '▼'}</span>
                  )}
                </div>
              </div>

              {/* Mensaje expandido */}
              {isOpen && (
                <div className="px-3 pb-3" style={{ borderTop: '1px solid #0f0f0f' }}>
                  <div className="font-mono mt-2 px-3 py-2" style={{
                    fontSize: '0.62rem', color: 'rgba(255,255,255,0.55)',
                    background: 'rgba(0,212,170,0.05)', borderLeft: '2px solid #00d4aa40',
                    lineHeight: 1.6,
                  }}>
                    <span style={{ color: '#00d4aa88', display: 'block', marginBottom: '2px', fontSize: '0.58rem' }}>✉ mensaje generado</span>
                    {lead.mensaje}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 font-mono text-xs border-t flex items-center justify-between" style={{ borderColor: '#0e0e0e', color: 'rgba(255,255,255,0.18)' }}>
        {phase >= MOCK_LEADS.length
          ? <span style={{ color: '#00d4aa99' }}>✓ {altaCount} Alta prioridad · {MOCK_LEADS.length} leads · 23 min</span>
          : <span>calificando con IA + SUNAT…</span>
        }
        <span style={{ color: 'rgba(255,255,255,0.10)' }}>export .csv</span>
      </div>
    </div>
  )
}

// ── Social Proof Strip ────────────────────────────────────────────────────────

function SocialProofStrip() {
  const items = [
    '🏗️ Construcción', '⚖️ Estudios Legales', '🔧 Ferretería', '📊 Contabilidad',
    '🏥 Clínicas', '🚚 Logística', '🏨 Hoteles & Turismo', '📱 Tecnología',
    '│ Lima', '│ Trujillo', '│ Arequipa', '│ Chiclayo', '│ Piura', '│ Cusco', '│ Ica', '│ Tacna',
  ]
  const doubled = [...items, ...items]
  return (
    <div className="overflow-hidden border-y border-white/6" style={{ background: 'rgba(0,0,0,0.92)', padding: '10px 0' }}>
      <style>{`@keyframes px-scroll { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
      <div style={{ display: 'flex', width: 'max-content', animation: 'px-scroll 30s linear infinite' }}>
        {doubled.map((item, i) => (
          <span key={i} className="font-mono text-xs whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.32)', padding: '0 24px', letterSpacing: '0.05em' }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Lead Form Modal ───────────────────────────────────────────────────────────

const CANALES = [
  { id: 'whatsapp', label: 'WhatsApp', placeholder: 'Teléfono / WhatsApp *', type: 'tel',   hint: 'Te escribiremos por WhatsApp con tu reporte.' },
  { id: 'telegram', label: 'Telegram', placeholder: 'Usuario de Telegram * (ej: @tuusuario)', type: 'text', hint: 'Te enviamos el reporte por @Pipeline_X_bot.' },
  { id: 'email',    label: 'Email',    placeholder: 'Correo electrónico *',   type: 'email', hint: 'Recibirás el reporte en tu bandeja de entrada.' },
]

function LeadFormModal({ onClose }) {
  const [form, setForm] = useState({ nombre: '', contacto: '', canal: 'whatsapp', tipo: '', ciudad: '', target: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const update = field => e => setForm(f => ({ ...f, [field]: e.target.value }))
  const setCanal = id => setForm(f => ({ ...f, canal: id, contacto: '' }))

  const canalInfo = CANALES.find(c => c.id === form.canal)

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.nombre.trim())   { setError('El nombre es requerido.'); return }
    if (!form.contacto.trim()) { setError(`El campo ${canalInfo.label} es requerido.`); return }
    if (!form.target.trim())   { setError('Dinos qué tipo de empresas quieres prospectar.'); return }
    setError('')
    setLoading(true)
    try {
      await saveLead({
        nombre:   form.nombre.trim(),
        contacto: form.contacto.trim(),
        canal:    form.canal,
        tipo:     form.tipo || null,
        ciudad:   form.ciudad.trim() || null,
        target:   form.target.trim(),
      })
      localStorage.setItem('px_reporte_solicitado', '1')
      setSent(true)
    } catch {
      setError('Hubo un problema al enviar. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const inp = 'w-full font-mono text-sm text-black bg-white border border-black/20 px-4 py-3 outline-none focus:border-black placeholder-black/55 transition-colors'

  return (
    <div className="fixed inset-0 z-50 flex flex-col sm:items-center sm:justify-center sm:p-4" style={{ background: 'rgba(0,0,0,0.92)' }}>

      {/* Zona superior tap-to-close (solo mobile) */}
      <div className="flex-1 sm:hidden" onClick={onClose} />

      <div className="w-full sm:max-w-md bg-white shadow-2xl flex flex-col max-h-[88svh] sm:max-h-[90svh] rounded-t-2xl sm:rounded-none">

        {/* ── Header fijo — siempre visible ── */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 bg-black rounded-t-2xl sm:rounded-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <span className="font-mono text-xs ml-2 text-white/65 tracking-wider">pipeline_x — solicitar_reporte.sh</span>
          </div>
          <button onClick={onClose} aria-label="Cerrar"
            className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="2" y1="2" x2="14" y2="14"/><line x1="14" y1="2" x2="2" y2="14"/>
            </svg>
          </button>
        </div>

        {/* ── Cuerpo scrollable (min-h-0 necesario para que flex-1 haga scroll) ── */}
        <div className="overflow-y-auto overscroll-contain flex-1 min-h-0">

        {sent ? (
          <div className="px-6 sm:px-8 py-8 text-center">
            <div className="w-11 h-11 rounded-full border-2 border-black flex items-center justify-center mx-auto mb-4">
              <svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="black" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 7 6 12 17 1"/>
              </svg>
            </div>
            <p className="font-mono font-bold text-black text-base mb-1 tracking-tight">Solicitud registrada</p>
            <p className="font-mono text-xs text-black/50 mb-5 leading-relaxed">
              Tu reporte llegará en menos de 24 h.<br />
              <span className="font-bold text-black">{canalInfo.hint}</span>
            </p>
            {/* Badges */}
            <div className="flex flex-col items-center gap-2 mb-6">
              <div className="inline-block border border-black/12 bg-black/3 px-4 py-2 w-full text-left">
                <p className="font-mono text-xs text-black/40 mb-0.5">Target registrado</p>
                <p className="font-mono text-sm font-bold text-black">{form.target}</p>
              </div>
              <div className="inline-block border border-black/12 bg-black/3 px-4 py-2 w-full text-left">
                <p className="font-mono text-xs text-black/40 mb-0.5">Canal elegido</p>
                <p className="font-mono text-sm font-bold text-black">{canalInfo.label} · {form.contacto}</p>
              </div>
            </div>
            {form.canal === 'telegram' && (
              <a href={TG_BOT} target="_blank" rel="noopener noreferrer"
                className="block w-full font-mono font-bold text-sm text-white bg-black py-4 hover:bg-black/80 active:scale-95 transition-all tracking-wider text-center">
                Abrir @Pipeline_X_bot →
              </a>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
            <div>
              <p className="font-mono font-bold text-black text-base mb-1 tracking-tight">Solicitar reporte gratuito</p>
              <p className="font-mono text-xs text-black/65">Tu primer reporte de prospectos calificados, sin costo.</p>
            </div>
            <div className="space-y-3">
              <input type="text" placeholder="Nombre completo *" value={form.nombre} onChange={update('nombre')} className={inp} required />
              {/* ── Selector de canal ── */}
              <div>
                <p className="font-mono text-xs text-black/50 mb-2 px-0.5">¿Cómo quieres recibir tu reporte? *</p>
                <div className="flex gap-2">
                  {CANALES.map(c => (
                    <button key={c.id} type="button" onClick={() => setCanal(c.id)}
                      className={`flex-1 font-mono text-xs py-2.5 border transition-colors ${
                        form.canal === c.id
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black/60 border-black/20 hover:border-black/50'
                      }`}>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* ── Campo de contacto dinámico ── */}
              <input
                key={form.canal}
                type={canalInfo.type}
                placeholder={canalInfo.placeholder}
                value={form.contacto}
                onChange={update('contacto')}
                className={inp}
                required
              />
              <div>
                <input
                  type="text"
                  placeholder='¿Qué empresas quieres prospectar? * — ej: "Ferreterías en Trujillo"'
                  value={form.target}
                  onChange={update('target')}
                  className={inp}
                  required
                />
                <p className="font-mono text-xs text-black/40 mt-1 px-1">Industria + ciudad. Este es el target de tu reporte.</p>
              </div>
              <select value={form.tipo} onChange={update('tipo')} className={inp + ' cursor-pointer'}>
                <option value="">Tipo de empresa (opcional)</option>
                <option>Mi propio negocio (MYPE)</option>
                <option>Estudio Contable</option>
                <option>Agencia de Marketing</option>
                <option>Startup / Fintech</option>
                <option>Consultoría</option>
                <option>Otro</option>
              </select>
              <input type="text" placeholder="Tu ciudad (ej: Lima, Trujillo...)" value={form.ciudad} onChange={update('ciudad')} className={inp} />
            </div>
            {error && <p className="font-mono text-xs text-red-600">{error}</p>}
            <div className="border border-black/10 px-4 py-3 flex items-center gap-3">
              <p className="font-mono text-xs text-black/50 leading-snug">{canalInfo.hint}</p>
            </div>
            <button type="submit" disabled={loading}
              className="w-full font-mono font-bold text-sm text-white bg-black py-4 hover:bg-black/80 active:scale-95 transition-all tracking-wider disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Enviando…' : 'Solicitar reporte gratis →'}
            </button>
            <p className="font-mono text-xs text-black/50 text-center">Sin costo ni compromiso.</p>
          </form>
        )}

        </div>{/* fin cuerpo scrollable */}
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
        {/* ── 9: Logo con fallback texto ── */}
        <div className="w-6 h-6 flex items-center justify-center">
          <img src="/logo.png" alt="Pipeline_X" className="w-6 h-6 object-contain opacity-90"
            onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex' }} />
          <span className="font-mono font-bold text-white text-xs hidden items-center justify-center w-6 h-6 border border-white/30">PX</span>
        </div>
        <span className="font-mono font-bold text-white text-sm tracking-tight">Pipeline_X</span>
        <span className="flex items-center gap-1.5 font-mono text-xs text-white/75">
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
  // ── Scan 1 ────────────────────────────────────────────────────────────────
  { text: 'WhatsApp: "Ferreterías en Los Olivos, Lima"',            type: 'cmd',    pause: 360 },
  { text: '> Buscando en Google Maps...',                           type: 'info',   pause: 190 },
  { text: '> [████████████] 94 negocios encontrados',               type: 'ok',     pause: 200 },
  { text: '> Verificando que existan y tengan teléfono...',         type: 'info',   pause: 210 },
  { text: '> Priorizando los más activos y con mayor potencial...', type: 'info',   pause: 210 },
  { text: '> ✓ 28 listos para llamar   ✗ 66 descartados',          type: 'result', pause: 260 },
  { text: '> PDF generado — enviando a tu WhatsApp ✓',             type: 'ok',     pause: 200 },
  { text: '',                                                         type: 'normal', pause: 55  },
  // ── Scan 2 ────────────────────────────────────────────────────────────────
  { text: 'WhatsApp: "Restaurantes en Miraflores"',                 type: 'cmd',    pause: 360 },
  { text: '> Buscando en Google Maps...',                           type: 'info',   pause: 190 },
  { text: '> [████████████] 71 negocios encontrados',               type: 'ok',     pause: 200 },
  { text: '> Verificando que existan y tengan teléfono...',         type: 'info',   pause: 210 },
  { text: '> Priorizando los más activos y con mayor potencial...', type: 'info',   pause: 210 },
  { text: '> ✓ 22 listos para llamar   ✗ 49 descartados',          type: 'result', pause: 260 },
  { text: '> PDF generado — enviando a tu WhatsApp ✓',             type: 'ok',     pause: 200 },
  { text: '',                                                         type: 'normal', pause: 55  },
  // ── Scan 3 ────────────────────────────────────────────────────────────────
  { text: 'WhatsApp: "Clínicas en Arequipa"',                       type: 'cmd',    pause: 360 },
  { text: '> Buscando en Google Maps...',                           type: 'info',   pause: 190 },
  { text: '> [████████████] 58 negocios encontrados',               type: 'ok',     pause: 200 },
  { text: '> Verificando que existan y tengan teléfono...',         type: 'info',   pause: 210 },
  { text: '> Priorizando los más activos y con mayor potencial...', type: 'info',   pause: 210 },
  { text: '> ✓ 19 listos para llamar   ✗ 39 descartados',          type: 'result', pause: 260 },
  { text: '> PDF generado — enviando a tu WhatsApp ✓',             type: 'ok',     pause: 2200 },
]
const LC = { cmd: '#e5e5e5', info: '#a0a0a0', ok: '#ffffff', result: '#cccccc', normal: '#b0b0b0' }

function Hero({ onOpenForm }) {
  const { visible, current, currentType, loopCount } = useLoopingTerminal(TERMINAL_LINES, 15)
  const [blink, setBlink]   = useState(true)
  const [yaEnvio, setYaEnvio] = useState(() => !!localStorage.getItem('px_reporte_solicitado'))
  const termRef = useRef(null)

  useEffect(() => { const t = setInterval(() => setBlink(b => !b), 500); return () => clearInterval(t) }, [])

  // Auto-scroll terminal al fondo cuando llegan nuevas líneas
  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight
  }, [visible, current])

  return (
    <section className="relative overflow-hidden" style={{ minHeight: '100svh' }}>
      {/* ── Fondo dividido en dos mitades ─────────────────────────────────── */}
      {/* Mitad izquierda — Lima, Miraflores (Pexels, libre) */}
      <div className="absolute inset-y-0 left-0 w-1/2" style={{
        backgroundImage: `url(${HERO_IMG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 30%',
        backgroundAttachment: 'fixed',
      }} />
      {/* Mitad derecha — Cafetería cálida Edison bulbs (Unsplash, libre) */}
      <div className="absolute inset-y-0 right-0 w-1/2" style={{
        backgroundImage: `url(${HERO_CAFE})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundAttachment: 'fixed',
      }} />
      {/* Overlay izquierdo — tono azul-noche para la ciudad */}
      <div className="absolute inset-y-0 left-0 w-1/2" style={{
        background: 'linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(8,12,28,0.60) 100%)',
      }} />
      {/* Overlay derecho — tono ámbar-oscuro para el café */}
      <div className="absolute inset-y-0 right-0 w-1/2" style={{
        background: 'linear-gradient(to left, rgba(0,0,0,0.72) 0%, rgba(28,14,0,0.58) 100%)',
      }} />
      {/* Velo global para unificar lectura del texto */}
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.25)' }} />
      {/* Línea divisoria central */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-px w-px pointer-events-none" style={{
        background: 'linear-gradient(to bottom, transparent 5%, rgba(255,255,255,0.18) 40%, rgba(255,255,255,0.18) 60%, transparent 95%)',
      }} />
      {/* Grid sutil */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(${DIM} 1px,transparent 1px),linear-gradient(90deg,${DIM} 1px,transparent 1px)`,
        backgroundSize: '56px 56px',
      }} />
      {/* Viñeta perimetral */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center,transparent 30%,rgba(0,0,0,0.65) 100%)',
      }} />
      {/* Gradiente inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{
        background: 'linear-gradient(to bottom,transparent,#000)',
      }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-14 xl:px-20 pt-24 pb-12 flex flex-col lg:flex-row lg:items-stretch gap-10 min-h-[100svh]">

        {/* Izquierda */}
        <div className="lg:w-[46%] flex flex-col justify-center">
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-white/75 mb-5">Para dueños y gerentes de pequeños negocios en Perú</p>

          <h1 className="font-mono font-bold text-white leading-[1.1] mb-5" style={{ fontSize: 'clamp(1.9rem,4.5vw,3.1rem)' }}>
            Consigue empresas para vender<br />
            <Gr>en menos de 24 horas.</Gr>
          </h1>
          <p className="font-mono text-base text-white leading-relaxed mb-8"
             style={{textShadow: '0 1px 12px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.8)'}}>
            Recibe 20–30 empresas calificadas por IA — con score de prioridad, capacidad de pago estimada y primer mensaje listo. Solo dinos el rubro y la ciudad.
          </p>

          <ul className="space-y-2.5 mb-7">
            <li className="font-mono text-base text-white/85 flex items-center gap-3">
              <span className="text-white/65">—</span> Olvídate de pasar horas en Google Maps buscando uno por uno
            </li>
            <li className="font-mono text-base text-white/85 flex items-center gap-3">
              <span className="text-white/65">—</span> Negocios parecidos a tus mejores clientes — <Gr>con datos verificados, 15 ciudades</Gr>
            </li>
            <li className="font-mono text-base text-white/85 flex items-center gap-3">
              <span className="text-white/65">—</span> Si tienes WhatsApp y sabes abrir un PDF, ya puedes usar Pipeline_X
            </li>
          </ul>

          {/* Chips de confianza */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CHIPS.map(({ icon, label }) => (
              <span key={label} className="inline-flex items-center gap-1.5 font-mono text-xs text-white/60 border border-white/12 px-3 py-1.5"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                <span>{icon}</span>
                <span>{label}</span>
              </span>
            ))}
          </div>

          {/* ── Comparativa de costo ── */}
          <div className="flex gap-8 mb-10 border-t border-white/10 pt-8">
            {[
              { v: 'S/800–1,200', l: 'cuesta un vendedor/mes' },
              { v: 'desde S/129', l: 'con Pipeline_X/mes', hi: true },
              { v: '3 días', l: 'de acceso completo gratis al escribirnos' },
            ].map(({ v, l, hi }) => (
              <div key={l}>
                <div className="font-mono font-bold" style={{ fontSize: '1.15rem', ...(hi ? GRAD_STYLE : { color: '#fff' }) }}>{v}</div>
                <div className="font-mono text-xs text-white/55 mt-0.5">{l}</div>
              </div>
            ))}
          </div>

          {/* Badge + CTA inteligente */}
          <div className="flex flex-col gap-3">
            {!yaEnvio ? (
              <>
                <div className="flex items-center gap-2 w-fit">
                  <span className="font-mono text-xs font-bold tracking-widest uppercase px-3 py-1"
                    style={{ color: '#00d4aa', border: '1px solid #00d4aa50', background: '#00d4aa0d' }}>
                    ★ PRIMER REPORTE 100% GRATUITO
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <a href={WA_BOT} target="_blank" rel="noopener noreferrer"
                    className="font-mono font-bold text-sm text-black px-7 py-3.5 active:scale-95 transition-all tracking-wide flex items-center gap-2"
                    style={{ background: '#25D366' }}>
                    <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, fill: '#000', flexShrink: 0 }} aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                    Quiero mi primer listado gratis
                  </a>
                  <a href="#como-funciona"
                    className="font-mono text-xs text-white/60 hover:text-white/90 transition-colors tracking-wider underline underline-offset-4">
                    Ver cómo funciona ↓
                  </a>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 w-fit">
                  <span className="font-mono text-xs font-bold tracking-widest uppercase px-3 py-1"
                    style={{ color: '#00d4aa', border: '1px solid #00d4aa50', background: '#00d4aa0d' }}>
                    ✓ Reporte solicitado — en camino
                  </span>
                </div>
                <div className="flex items-center gap-5 flex-wrap">
                  <a href={TG_BOT} target="_blank" rel="noopener noreferrer"
                    className="font-mono font-bold text-sm text-black bg-white px-7 py-3.5 hover:bg-white/90 active:scale-95 transition-all tracking-wide">
                    Abrir @Pipeline_X_bot →
                  </a>
                  <a href="#como-funciona" className="font-mono text-xs text-white/65 hover:text-white/80 transition-colors tracking-wider underline underline-offset-4">
                    Ver planes ↓
                  </a>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Derecha — lead mockup + terminal (rellena altura completa) */}
        <div className="lg:w-[54%] flex flex-col gap-3 lg:pt-0 pt-4">
          <LeadMockup />
          {/* terminal — flex-1, auto-scroll al fondo */}
          <div ref={termRef} className="flex-1 border px-4 py-3 overflow-y-auto"
            style={{ borderColor: '#141414', background: 'rgba(6,6,6,0.92)', minHeight: '120px', maxHeight: '340px' }}>
            <div className="font-mono text-xs space-y-0.5">
              {visible.map((line, i) => (
                <div key={`${loopCount}-${i}`}
                  style={{ color: LC[line.type] ?? LC.normal, opacity: line.text === '' ? 0 : 0.78, lineHeight: '1.5' }}>
                  {line.text || '\u00A0'}
                </div>
              ))}
              {current !== null && (
                <div style={{ color: LC[currentType] ?? LC.normal, opacity: 0.78, lineHeight: '1.5' }}>
                  {current}
                  <span className={`inline-block w-1.5 h-[1em] ml-px align-middle bg-white/60 transition-opacity duration-100 ${blink ? 'opacity-60' : 'opacity-0'}`} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Franja de inteligencia comercial ─────────────────────────────────────────

const INTEL_COLS = [
  {
    icon: '🏛️',
    title: 'Verificado con SUNAT',
    desc: 'RUC activo, rubro real, sin empresas fantasma ni números que no existen.',
  },
  {
    icon: '📊',
    title: 'Score de calidad',
    desc: 'Quién tiene mayor capacidad de pago y señales de urgencia de compra.',
  },
  {
    icon: '⚡',
    title: 'Acción recomendada',
    desc: 'Si llamar hoy, enviar email o dar seguimiento — listo antes de abrir el teléfono.',
  },
]

function IntelligenceStrip() {
  return (
    <div className="border-b border-white/6" style={{ background: 'rgba(0,0,0,0.96)' }}>
      <div className="max-w-5xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/8">
        {INTEL_COLS.map(({ icon, title, desc }) => (
          <div key={title} className="px-0 md:px-10 py-8 md:py-0 first:pl-0 last:pr-0">
            <div className="text-2xl mb-4">{icon}</div>
            <h3 className="font-mono font-bold text-white text-sm tracking-wide mb-2">{title}</h3>
            <p className="font-mono text-xs text-white/55 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── ¿Cómo funciona? ───────────────────────────────────────────────────────────

const STEPS = [
  {
    n: '01',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="14" cy="14" r="10"/>
        <circle cx="14" cy="14" r="5.5"/>
        <circle cx="14" cy="14" r="1.5" fill="currentColor" stroke="none"/>
        <line x1="14" y1="2" x2="14" y2="5"/>
        <line x1="14" y1="23" x2="14" y2="26"/>
        <line x1="2" y1="14" x2="5" y2="14"/>
        <line x1="23" y1="14" x2="26" y2="14"/>
      </svg>
    ),
    title: 'Dinos qué negocios quieres contactar',
    body: 'Escríbenos por WhatsApp con el rubro y la ciudad que quieres atacar. Ej: "Ferreterías en Trujillo" o "Restaurantes en Miraflores". Sin formularios complicados.',
  },
  {
    n: '02',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="6" width="22" height="16" rx="2"/>
        <line x1="3" y1="14" x2="25" y2="14" strokeWidth="2.5" strokeDasharray="2.5 2"/>
        <line x1="9" y1="3" x2="9" y2="7"/>
        <line x1="14" y1="3" x2="14" y2="7"/>
        <line x1="19" y1="3" x2="19" y2="7"/>
        <line x1="9" y1="21" x2="9" y2="25"/>
        <line x1="14" y1="21" x2="14" y2="25"/>
        <line x1="19" y1="21" x2="19" y2="25"/>
      </svg>
    ),
    title: 'Buscamos los negocios que encajan',
    body: 'Cada empresa recibe un score según su solvencia (verificada con SUNAT), actividad digital y señales de compra. Sabes a quién llamar primero — y por qué.',
  },
  {
    n: '03',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3h10l6 6v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/>
        <polyline points="16 3 16 9 22 9"/>
        <line x1="9" y1="14" x2="19" y2="14"/>
        <line x1="9" y1="18" x2="15" y2="18"/>
        <polyline points="9 10 11 10"/>
      </svg>
    ),
    title: 'Recibes el PDF en tu WhatsApp',
    body: 'En menos de 24 horas te llega un PDF con 20–30 negocios: nombre, distrito, teléfono y un mensaje listo para enviar. Solo abre el archivo y empieza a llamar.',
  },
]

function HowItWorks({ onOpenForm }) {
  const { ref, vis } = useFadeIn()
  return (
    <section id="como-funciona" className="bg-black border-t border-white/6" ref={ref}>
      <div className={`max-w-5xl mx-auto px-6 py-20 transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-white/75 mb-3">Proceso</p>
        <h2 className="font-mono font-bold text-white mb-14" style={{ fontSize: 'clamp(1.4rem,3vw,2rem)' }}>
          ¿Cómo funciona <Gr>Pipeline_X</Gr>?
        </h2>

        {/* Grid 3 columnas — mobile stack, desktop fila */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/8">
          {STEPS.map(({ n, icon, title, body }, i) => (
            <div key={n}
              className={`relative px-8 py-10 flex flex-col gap-5
                ${i < STEPS.length - 1 ? 'border-b md:border-b-0 md:border-r border-white/8' : ''}`}>

              {/* Número grande de fondo */}
              <span className="absolute top-6 right-6 font-mono font-bold select-none pointer-events-none"
                style={{ fontSize: '4.5rem', lineHeight: 1, color: 'rgba(255,255,255,0.04)' }}>
                {n}
              </span>

              {/* Icono + número */}
              <div className="flex items-center gap-3">
                <span className="text-white/50">{icon}</span>
                <span className="font-mono text-xs tracking-[0.25em] text-white/30">{n}</span>
              </div>

              {/* Título grande */}
              <h3 className="font-mono font-bold text-white leading-tight"
                style={{ fontSize: 'clamp(1.15rem,2vw,1.5rem)' }}>
                {title}
              </h3>

              {/* Separador */}
              <div className="w-8 h-px" style={{ background: 'linear-gradient(90deg,#00d4aa,#4f6ef5)' }} />

              {/* Detalle */}
              <p className="font-mono text-sm text-white/70 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        {/* CTA al final de la sección */}
        <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-8 border-t border-white/6">
          <p className="font-mono text-sm text-white/55">Primer listado gratis. Sin contratos. Sin tarjeta.</p>
          <a href={WA_BOT} target="_blank" rel="noopener noreferrer"
            className="font-mono font-bold text-sm text-black px-7 py-3.5 active:scale-95 transition-all tracking-wide w-full sm:w-fit whitespace-nowrap flex items-center justify-center gap-2"
            style={{ background: '#25D366' }}>
            <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, fill: '#000', flexShrink: 0 }} aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
            Quiero mi primer listado gratis →
          </a>
        </div>
      </div>
    </section>
  )
}

// ── Dos canales ───────────────────────────────────────────────────────────────

const CHANNELS = [
  {
    tag:         'Básico',
    badge:       null,
    badgeStyle:  {},
    monthly:     'S/59',
    annual:      'S/49',
    unit:        '/mes',
    solesMonthly: '',
    solesAnnual:  '',
    annualSave:  'Ahorras S/120/año',
    sub:         '10 búsquedas/mes · 20 leads · sin contrato',
    items: [
      { text: 'Score de prioridad: sabes quién puede pagar más antes de llamar.', ok: true },
      { text: '10 búsquedas/mes · 20 leads por búsqueda',     ok: true  },
      { text: 'Entrega por WhatsApp',                          ok: true  },
      { text: 'PDF con mensajes listos para enviar',           ok: true  },
      { text: 'Datos verificados (empresa activa, teléfono)',  ok: false },
      { text: 'Acceso API',                                    ok: false },
      { text: 'White-label',                                   ok: false },
    ],
    note:  'Para emprendedores y vendedores que recién arrancan.',
    cta:   'Elegir Básico →',
    dark:  false,
    hi:    false,
  },
  {
    tag:         'Starter',
    badge:       'Más popular',
    badgeStyle:  { background: '#00d4aa', color: '#000' },
    monthly:     'S/129',
    annual:      'S/109',
    unit:        '/mes',
    solesMonthly: '($39 USD)',
    solesAnnual:  '($29 USD)',
    annualSave:  'Ahorras S/360/año (~2 meses gratis)',
    sub:         'Reportes ilimitados · 30 leads · todo incluido',
    items: [
      { text: 'Ilimitado · 30 negocios listos por búsqueda',    ok: true  },
      { text: 'Prioridad de cada negocio (quién llama primero)', ok: true },
      { text: 'Empresa verificada: activa, con teléfono real',  ok: true  },
      { text: 'PDF + archivo Excel descargable',               ok: true  },
      { text: 'Soporte por WhatsApp',                          ok: true  },
      { text: 'Acceso API',                                    ok: true  },
      { text: 'White-label',                                   ok: false },
    ],
    note:  'El trabajo de prospectar toda la semana, por menos de lo que cuesta un empleado.',
    cta:   'Elegir Starter →',
    dark:  true,
    hi:    true,
  },
  {
    tag:         'Pro',
    badge:       null,
    badgeStyle:  {},
    monthly:     'S/299',
    annual:      'S/249',
    unit:        '/mes',
    solesMonthly: '($79 USD)',
    solesAnnual:  '($59 USD)',
    annualSave:  'Ahorras S/600/año (~2 meses gratis)',
    sub:         'Reportes ilimitados · 50 leads · equipos activos',
    items: [
      { text: 'Ilimitado · 50 negocios listos por búsqueda',    ok: true  },
      { text: 'Prioridad de cada negocio (quién llama primero)', ok: true },
      { text: 'Empresa verificada + datos de contacto web',    ok: true  },
      { text: 'PDF + archivo Excel descargable',               ok: true  },
      { text: 'API + integraciones',                           ok: true  },
      { text: 'Soporte prioritario en español',                ok: true  },
      { text: 'White-label',                                   ok: false },
    ],
    note:  'Con 2 clientes nuevos al mes ya se paga solo.',
    cta:   'Elegir Pro →',
    dark:  false,
    hi:    false,
  },
  {
    tag:         'Reseller',
    badge:       'White-label',
    badgeStyle:  { background: '#4f6ef5', color: '#fff' },
    monthly:     'S/1,099',
    annual:      'S/919',
    unit:        '/mes',
    solesMonthly: '($299 USD)',
    solesAnnual:  '($249 USD)',
    annualSave:  'Ahorras ~S/2,160/año',
    sub:         'Tu marca · multi-cuenta · kit de reventa incluido',
    items: [
      { text: 'Búsquedas ilimitadas (~10 leads c/u)',           ok: true  },
      { text: 'White-label completo (tu logo, tu nombre)',    ok: true  },
      { text: 'Multi-cuenta para tus clientes',               ok: true  },
      { text: 'Kit de reventa: PDF, emails, pricing guide',   ok: true  },
      { text: 'API sin límites + onboarding dedicado',        ok: true  },
      { text: 'Con 2 clientes a S/600 ya cubres el costo',    ok: true  },
      { text: 'SLA garantizado',                              ok: true  },
    ],
    note:  'Ideal para agencias, consultoras y equipos de ventas B2B.',
    cta:   'Hablar con ventas →',
    dark:  false,
    hi:    false,
  },
]

const COMMON_INCLUDES = [
  'Negocios con teléfono real, verificados de fuentes oficiales',
  'Mensaje listo para cada negocio — solo copia y envía',
  'PDF profesional descargable en menos de 24 h',
  'Mejoras continuas sin costo adicional',
  'Garantía: si el 1er reporte no tiene 5 negocios útiles, te hacemos otro gratis',
]

function TwoChannels({ onOpenForm }) {
  const { ref, vis } = useFadeIn()
  const [annual, setAnnual] = useState(false)

  return (
    <section className="bg-white border-t border-black/8" ref={ref}>
      <div className={`max-w-5xl mx-auto px-6 py-16 transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-black/55 mb-3">Planes</p>
        <h2 className="font-mono font-bold text-black mb-3" style={{ fontSize: 'clamp(1.4rem,3vw,2rem)' }}>
          Tres planes claros, <Gr>sin complicaciones</Gr>
        </h2>
        <p className="font-mono text-sm text-black/55 mb-8 max-w-xl">
          La prospección que antes tomaba días — o requería contratar a alguien — ahora toma minutos.
        </p>

        {/* Toggle mensual / anual */}
        <div className="flex items-center gap-4 mb-10">
          <span className="font-mono text-xs text-black/50">Mensual</span>
          <button
            onClick={() => setAnnual(a => !a)}
            className="relative w-12 h-6 rounded-full transition-colors duration-300 flex-shrink-0"
            style={{ background: annual ? '#000' : '#d4d4d4' }}>
            <span className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm"
              style={{ left: annual ? '28px' : '4px' }} />
          </button>
          <span className="font-mono text-xs" style={{ color: annual ? '#000' : 'rgba(0,0,0,0.45)' }}>
            Anual <span className="font-bold" style={{ color: '#00d4aa' }}>— ahorra hasta 17%</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-black/12">
          {CHANNELS.map(({ tag, badge, badgeStyle, monthly, annual: annualPrice, unit, annualSave, solesMonthly, solesAnnual, sub, items, note, cta, dark, hi }, idx) => {
            const displayPrice = annual ? annualPrice : monthly
            const solesNote    = annual ? solesAnnual : solesMonthly
            return (
              <div key={tag}
                className={`px-7 py-9 flex flex-col relative
                  ${idx < CHANNELS.length - 1 ? 'border-b md:border-b-0 md:border-r border-black/12' : ''}`}
                style={{ background: dark ? '#000' : '#fff' }}>

                {/* Badge */}
                {badge && (
                  <span className="absolute top-0 right-6 -translate-y-1/2 font-mono text-xs font-bold px-3 py-1"
                    style={badgeStyle}>
                    {badge}
                  </span>
                )}

                <p className="font-mono text-xs tracking-widest uppercase mb-4"
                  style={{ color: dark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.45)' }}>{tag}</p>

                <div className="mb-1">
                  <span className="font-mono font-bold transition-all duration-300"
                    style={{ fontSize: 'clamp(1.8rem,3.5vw,2.4rem)', color: dark ? '#fff' : '#000' }}>
                    {displayPrice}
                  </span>
                  <span className="font-mono text-sm ml-1" style={{ color: dark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.40)' }}>{unit}</span>
                  {solesNote && (
                    <span className="font-mono ml-2" style={{ fontSize: '0.72rem', color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.32)' }}>
                      ({solesNote})
                    </span>
                  )}
                </div>

                {annual && (
                  <p className="font-mono text-xs mb-1" style={{ color: '#00d4aa' }}>{annualSave}</p>
                )}

                <p className="font-mono text-xs mb-7 mt-1" style={{ color: dark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.45)' }}>{sub}</p>

                <ul className="space-y-2 mb-5 flex-1">
                  {items.map(({ text, ok }) => (
                    <li key={text} className="font-mono text-xs flex items-start gap-2.5"
                      style={{ color: ok
                        ? (dark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.80)')
                        : (dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.22)') }}>
                      <span className="font-bold flex-shrink-0 mt-0.5" style={{ color: ok
                        ? (dark ? '#00d4aa' : '#000')
                        : (dark ? 'rgba(255,255,255,0.20)' : 'rgba(0,0,0,0.18)') }}>
                        {ok ? '✓' : '✗'}
                      </span>
                      {text}
                    </li>
                  ))}
                </ul>

                <p className="font-mono text-xs mb-6 italic" style={{ color: dark ? 'rgba(255,255,255,0.38)' : 'rgba(0,0,0,0.38)' }}>{note}</p>

                <button onClick={onOpenForm}
                  className="font-mono font-bold text-xs px-6 py-3.5 active:scale-95 transition-all tracking-wider w-full"
                  style={dark
                    ? { background: '#fff', color: '#000' }
                    : { background: '#000', color: '#fff' }}>
                  {cta}
                </button>
              </div>
            )
          })}
        </div>

        {/* Incluido en todos los planes */}
        <div className="mt-8 border border-black/8 px-7 py-6">
          <p className="font-mono text-xs font-bold text-black/55 uppercase tracking-wider mb-4">Todos los planes incluyen</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {COMMON_INCLUDES.map(item => (
              <div key={item} className="font-mono text-xs text-black/70 flex items-start gap-2">
                <span className="text-black font-bold flex-shrink-0">✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        <p className="font-mono text-xs text-black/40 mt-4 text-center">
          Primer reporte gratis en todos los planes · sin tarjeta · sin contrato · cancela cuando quieras
        </p>
      </div>
    </section>
  )
}

// ── Packs adicionales ─────────────────────────────────────────────────────────

function AddonPacks({ onOpenForm }) {
  const { ref, vis } = useFadeIn()
  return (
    <section className="bg-black border-t border-white/6" ref={ref}>
      <div className={`max-w-5xl mx-auto px-6 py-14 transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="lg:max-w-xl">
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-white/50 mb-3">Packs adicionales</p>
            <h3 className="font-mono font-bold text-white mb-3" style={{ fontSize: 'clamp(1.2rem,2.5vw,1.7rem)' }}>
              ¿Necesitas más reportes este mes?
            </h3>
            <p className="font-mono text-sm text-white/60 mb-5 leading-relaxed">
              Compra reportes extra sin cambiar de plan. Activación inmediata, se suman a tu cuota del mes. Ideal para campañas puntuales.
            </p>
            <p className="font-mono text-xs text-white/40">
              Sin modelos de créditos confusos. Sin sorpresas. Pagas solo por lo que realmente necesitas.
            </p>
          </div>

          <div className="border border-white/10 px-8 py-7 flex flex-col items-start gap-4 lg:min-w-[280px]">
            <div>
              <p className="font-mono text-xs tracking-widest uppercase text-white/40 mb-1">Pack extra</p>
              <div className="flex items-baseline gap-2">
                <span className="font-mono font-bold text-white" style={{ fontSize: '2rem' }}>S/129</span>
              </div>
              <p className="font-mono text-xs text-white/50 mt-1">($39 USD) · 3 reportes adicionales</p>
            </div>
            <ul className="space-y-1.5 w-full">
              {['Activación inmediata', 'Se suman al límite de tu plan', 'Sin cambiar de plan ni papeleo'].map(t => (
                <li key={t} className="font-mono text-xs text-white/65 flex items-center gap-2">
                  <span className="text-white/40">—</span>{t}
                </li>
              ))}
            </ul>
            <button onClick={onOpenForm}
              className="font-mono font-bold text-xs text-black bg-white px-5 py-3 w-full active:scale-95 transition-all tracking-wider">
              Solicitar pack extra →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Testimonios ───────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    quote: '"Pedí el primer reporte para un cliente de retail en Miraflores. Me llegaron 34 leads calificados en menos de 20 horas. Lo presenté como mi servicio y cobré S/500. No esperaba que fuera tan rápido."',
    name: 'Carlos M.',
    role: 'Contador Público · Lima',
    score: '34 leads en 20 h',
  },
  {
    quote: '"Lo usé para prospección propia de mi agencia. El CSV viene con score, industria y borrador de WhatsApp. Convertí 3 de los primeros 10 contactos."',
    name: 'Sofía R.',
    role: 'Agencia de Marketing · Surco',
    score: '3/10 conversiones',
  },
  {
    quote: '"Mis clientes me preguntaban cómo conseguía contactos tan específicos. Les digo que es mi sistema propio. Pipeline_X es mi ventaja competitiva."',
    name: 'Javier T.',
    role: 'Consultor de Ventas · Trujillo',
    score: 'white-label total',
  },
]

function Testimonials() {
  const { ref, vis } = useFadeIn()
  return (
    <section className="bg-white border-t border-black/8" ref={ref}>
      <div className={`max-w-4xl mx-auto px-6 py-16 transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-black/75 mb-3">Resultados reales</p>
        <h2 className="font-mono font-bold text-black mb-10" style={{ fontSize: 'clamp(1.4rem,3vw,2rem)' }}>
          Quienes ya usan <Gr>Pipeline_X</Gr>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-black/10">
          {TESTIMONIALS.map(({ quote, name, role, score }) => (
            <div key={name} className="border-r border-b border-black/10 px-6 py-7 flex flex-col justify-between">
              <div>
                <div className="font-mono text-xs font-bold mb-4 px-2 py-1 border border-black/10 w-fit" style={GRAD_STYLE}>{score}</div>
                <p className="font-mono text-sm text-black/80 leading-relaxed mb-6">{quote}</p>
              </div>
              <div>
                <p className="font-mono font-bold text-black text-xs">{name}</p>
                <p className="font-mono text-xs text-black/80 mt-0.5">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Comparative ───────────────────────────────────────────────────────────────

const FEATURES = [
  { label: 'Precio mensual',            px: 'desde S/129', kommo: '$200+', hubspot: '$800+', leadsales: '$150+' },
  { label: 'Funciona solo con WhatsApp',    px: true,     kommo: false,  hubspot: false,   leadsales: false  },
  { label: 'Busca en Google Maps Perú',     px: true,     kommo: false,  hubspot: false,   leadsales: false  },
  { label: 'Verifica empresa con SUNAT',    px: true,     kommo: false,  hubspot: false,   leadsales: false  },
  { label: 'Precio en soles',               px: true,     kommo: false,  hubspot: false,   leadsales: false  },
  { label: 'Entrega en menos de 24 h',      px: true,     kommo: false,  hubspot: false,   leadsales: false  },
  { label: 'Sin cobro por usuario/asiento', px: true,     kommo: false,  hubspot: false,   leadsales: false  },
]
const COLS = [
  { key: 'px',        label: 'Pipeline_X', hi: true  },
  { key: 'kommo',     label: 'Kommo',      hi: false },
  { key: 'hubspot',   label: 'HubSpot',    hi: false },
  { key: 'leadsales', label: 'Leadsales',  hi: false },
]

function CellVal({ val, hi }) {
  if (val === true)  return <span style={{ color: hi ? '#000' : '#e5e5e5', fontWeight: 700 }}>✓</span>
  if (val === false) return <span style={{ color: hi ? '#00000066' : '#ffffff55' }}>✗</span>
  return <span style={{ color: hi ? '#000' : '#e5e5e5', fontWeight: hi ? 700 : 400 }}>{val}</span>
}

function Comparison({ onOpenForm }) {
  const { ref, vis } = useFadeIn()
  return (
    <section id="comparativa" className="bg-black border-t border-white/6" ref={ref}>
      <div className={`max-w-4xl mx-auto px-6 py-16 transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-white/88 mb-3">Comparativa</p>
        <h2 className="font-mono font-bold text-white mb-4" style={{ fontSize: 'clamp(1.4rem,3vw,2rem)' }}>
          Por qué <Gr>Pipeline_X</Gr> es diferente
        </h2>
        <p className="font-mono text-sm text-white/60 mb-10 max-w-xl leading-relaxed">
          Contratar a alguien para buscar clientes cuesta miles al mes. Las herramientas gringas cobran en dólares y no conocen Perú. Pipeline_X entrega un listado real desde S/129/mes — sin complicaciones, sin sorpresas.
        </p>
        <p className="font-mono text-xs text-white/50 mb-2 sm:hidden">← desliza para ver más →</p>
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left py-3 pr-6 font-normal text-white/50 text-xs uppercase tracking-wider border-b border-white/10 w-44" />
                {COLS.map(c => (
                  <th key={c.key} className="text-center py-3 px-4 font-bold text-sm border-b border-white/10"
                    style={{ background: c.hi ? '#fff' : 'transparent', color: c.hi ? '#000' : '#fff', minWidth: '100px' }}>
                    {c.hi && <span className="block text-xs font-normal mb-1 tracking-widest" style={GRAD_STYLE}>★ mejor</span>}
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((row, i) => (
                <tr key={i} className="border-b border-white/6 hover:bg-white/2 transition-colors">
                  <td className="py-3 pr-6 text-white/50 font-medium text-sm">{row.label}</td>
                  {COLS.map(c => (
                    <td key={c.key} className="py-3 px-4 text-center" style={{ background: c.hi ? '#fff' : 'transparent' }}>
                      <CellVal val={row[c.key]} hi={c.hi} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
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
    <section className="bg-white border-t border-black/8" ref={ref}>
      <div className={`max-w-4xl mx-auto px-6 py-16 transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-black/75 mb-3">Ejemplo de reporte</p>
        <h2 className="font-mono font-bold text-black mb-8" style={{ fontSize: 'clamp(1.4rem,3vw,2rem)' }}>
          Así se ve el <Gr>reporte de leads</Gr>
        </h2>
        <div className="border border-black/10 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-black/10 bg-black">
            <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <span className="font-mono text-xs ml-2 text-white/88 tracking-wider">reporte_retail_lima_abril_2026.html</span>
          </div>
          <div className="overflow-x-auto bg-white">
            <table className="w-full font-mono text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e5e5' }}>
                  {['Empresa','Industria','Ciudad','Score','Acción'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-normal text-xs uppercase tracking-[0.15em] text-black/50">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SAMPLE_LEADS.map((l, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f0f0f0', background: hovered === i ? '#f9f9f9' : 'transparent', transition: 'background .15s' }}
                    onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                    <td className="px-4 py-3 font-semibold text-black/90">{l.empresa}</td>
                    <td className="px-4 py-3 text-black/80">{l.industria}</td>
                    <td className="px-4 py-3 text-black/80">{l.ciudad}</td>
                    <td className="px-4 py-3 font-bold text-black">{l.score}</td>
                    <td className="px-4 py-3 text-black/80">{l.accion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 font-mono text-xs border-t border-black/6 text-black/20 bg-white">
            generado en 23 min · export .csv · pipeline_x v2.1
          </div>
        </div>
        <a href={WA_BOT} target="_blank" rel="noopener noreferrer"
          className="mt-8 w-full font-mono font-bold text-sm text-black py-4 active:scale-95 transition-all tracking-wide flex items-center justify-center gap-2"
          style={{ background: '#25D366' }}>
          <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, fill: '#000', flexShrink: 0 }} aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
          Quiero mi primer listado gratis →
        </a>
      </div>
    </section>
  )
}

// ── Pricing calculator ────────────────────────────────────────────────────────

const CALC_PLANS = {
  basico: {
    label:      'Básico S/59',
    cost:       59,
    costStr:    'S/59/mes',
    costNote:   '',
    currency:   'S/',
    heading:    'S/59/mes',
  },
  starter: {
    label:      'Starter S/129',
    cost:       149,
    costStr:    'S/129/mes',
    costNote:   '($39 USD)',
    currency:   'S/',
    heading:    'S/129/mes',
  },
  reseller: {
    label:      'Reseller S/1,099',
    cost:       1099,
    costStr:    'S/1,099/mes',
    costNote:   '($299 USD)',
    currency:   'S/',
    heading:    'S/1,099/mes',
  },
}

function PricingCalculator({ onOpenForm }) {
  const PRESETS  = [3, 5, 10, 20]
  const [clients, setClients] = useState(10)
  const [planKey, setPlanKey] = useState('reseller')  // default: Reseller (canal de reventa)
  const { ref, vis } = useFadeIn()

  const plan     = CALC_PLANS[planKey]
  const RATE     = 500                                // tarifa sugerida por cliente (soles)
  const revenue  = clients * RATE
  const cost     = plan.cost
  const margin   = revenue - cost
  const breakEven = Math.ceil(cost / RATE)

  return (
    <section id="calculadora" className="bg-black border-t border-white/6" ref={ref}>
      <div className={`max-w-4xl mx-auto px-6 py-16 transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-white/55 mb-3">Calculadora de rentabilidad</p>
        <h2 className="font-mono font-bold text-white mb-6" style={{ fontSize: 'clamp(1.4rem,3vw,2rem)' }}>
          ¿Cuánto ganas revendiendo con <Gr>{plan.heading}</Gr>?
        </h2>

        {/* Toggle de plan */}
        <div className="flex gap-0 border border-white/15 w-fit mb-10">
          {Object.entries(CALC_PLANS).map(([key, p]) => (
            <button key={key} onClick={() => setPlanKey(key)}
              className="font-mono text-xs px-5 py-2.5 border-r border-white/15 last:border-r-0 transition-colors tracking-wider"
              style={{ background: planKey === key ? '#fff' : 'transparent', color: planKey === key ? '#000' : 'rgba(255,255,255,0.55)' }}>
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12">

          {/* Control de clientes */}
          <div className="lg:w-60 mb-8 lg:mb-0 space-y-4">
            <div>
              <p className="font-mono text-xs text-white/45 uppercase tracking-wider mb-1">Clientes al mes</p>
              <p className="font-mono text-xs text-white/60 leading-relaxed">
                Tarifa sugerida <strong className="text-white">S/500/cliente</strong>. Tú defines el precio.
              </p>
            </div>
            <div className="flex gap-0 border border-white/20 w-fit">
              {PRESETS.map(n => (
                <button key={n} onClick={() => setClients(n)}
                  className="font-mono text-sm px-5 py-3 border-r border-white/20 last:border-r-0 transition-colors"
                  style={{ background: clients === n ? '#fff' : 'transparent', color: clients === n ? '#000' : '#fff' }}>
                  {n}
                </button>
              ))}
            </div>

            {/* Break-even */}
            <div className="border border-white/8 px-4 py-3">
              <p className="font-mono text-xs text-white/40 uppercase tracking-wider mb-1">Punto de equilibrio</p>
              <p className="font-mono text-sm font-bold text-white">
                {breakEven} {breakEven === 1 ? 'cliente' : 'clientes'}
              </p>
              <p className="font-mono text-xs text-white/40 mt-0.5 leading-snug">
                Desde el cliente {breakEven + 1}, todo es ganancia.
              </p>
            </div>

            {/* Costo del plan */}
            <div className="border border-white/8 px-4 py-3">
              <p className="font-mono text-xs text-white/40 uppercase tracking-wider mb-1">Costo del plan</p>
              <p className="font-mono text-sm font-bold" style={GRAD_STYLE}>{plan.costStr}</p>
              <p className="font-mono text-xs text-white/40 mt-0.5">{plan.costNote}</p>
            </div>
          </div>

          {/* Resultados */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 border-t border-l border-white/10">
            {[
              { label: 'ingresas',     value: `S/${revenue.toLocaleString()}`,  sub: `${clients} clientes × S/500`,  hi: true  },
              { label: 'nos pagas',    value: plan.costStr,                      sub: plan.costNote,                  hi: false },
              { label: 'margen neto',  value: `S/${margin.toLocaleString()}`,   sub: `≈ S/${Math.round(margin/clients).toLocaleString()}/cliente`, hi: false },
            ].map(({ label, value, sub, hi }) => (
              <div key={label} className="px-6 py-6 border-r border-b border-white/10" style={{ background: hi ? '#fff' : 'transparent' }}>
                <p className="font-mono text-xs mb-2 tracking-widest uppercase" style={{ color: hi ? '#00000070' : '#ffffff55' }}>{label}</p>
                <p className="font-mono font-bold text-2xl transition-all duration-300" style={hi ? GRAD_STYLE : { color: '#fff' }}>{value}</p>
                <p className="font-mono text-xs mt-1.5" style={{ color: hi ? '#00000055' : '#ffffff40' }}>{sub}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="font-mono text-sm text-white/55">Primer reporte sin costo · sin contratos · cancela cuando quieras.</p>
          <button onClick={onOpenForm}
            className="font-mono font-bold text-sm text-black bg-white px-7 py-3.5 hover:bg-white/90 active:scale-95 transition-all tracking-wide w-full sm:w-fit">
            Empezar ahora →
          </button>
        </div>
      </div>
    </section>
  )
}

// ── FAQ ───────────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: '¿Puedo probar antes de comprometerme?',
    a: 'Sí. El primer listado es 100% gratuito — sin tarjeta, sin contrato. Escríbenos por WhatsApp, dinos qué vendes y en qué ciudad, y recibes el PDF directo en tu chat en pocos minutos.',
  },
  {
    q: '¿Los leads son reales o inventados?',
    a: 'Son reales. Los buscamos en Google Maps (nombre, teléfono, dirección) y verificamos que la empresa exista y esté activa usando SUNAT. No usamos bases de datos compradas ni datos inventados.',
  },
  {
    q: '¿En qué moneda facturan?',
    a: 'Todos los planes tienen precio en soles. Starter: S/129/mes. Pro: S/299/mes. Reseller: S/1,099/mes. También aceptamos pago en USD ($39 / $79 / $299) al tipo de cambio vigente.',
  },
  {
    q: '¿Qué pasa si necesito más reportes en un mes?',
    a: 'Puedes subir de plan en cualquier momento sin penalidad ni contrato. Si eres nuevo, activa el trial gratis de 3 días con acceso completo — sin tarjeta.',
  },
  {
    q: '¿Puedo ponerle mi logo al reporte?',
    a: 'Sí. El sistema es 100% white-label en el Plan Reseller. El reporte lleva tu nombre, tu logo y tu marca. Tus clientes nunca ven Pipeline_X.',
  },
  {
    q: '¿Necesito saber de tecnología?',
    a: 'No. Solo escríbenos por WhatsApp con el rubro y la ciudad que buscas. El PDF llega directo a tu chat. Si sabes usar WhatsApp, ya puedes usar Pipeline_X.',
  },
  {
    q: '¿Hay contrato de permanencia?',
    a: 'No. Cancelas cuando quieras, sin penalidades ni letra pequeña. Si pagas anual y cancelas antes, te devolvemos la parte proporcional no usada.',
  },
  {
    q: '¿En cuántas ciudades funciona?',
    a: 'Cubrimos las 15 ciudades principales del Perú: Lima, Trujillo, Arequipa, Chiclayo, Piura, Cusco, Ica, Tacna, Huancayo, Pucallpa y más. El Plan Reseller también permite prospección en otras ciudades de Latinoamérica bajo pedido.',
  },
]

function FAQ() {
  const [open, setOpen] = useState(null)
  const { ref, vis } = useFadeIn()
  return (
    <section className="bg-white border-t border-black/8" ref={ref}>
      <div className={`max-w-4xl mx-auto px-6 py-16 transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-black/75 mb-3">FAQ</p>
        <h2 className="font-mono font-bold text-black mb-10" style={{ fontSize: 'clamp(1.4rem,3vw,2rem)' }}>
          Preguntas frecuentes
        </h2>
        <div className="space-y-0 border-t border-black/8">
          {FAQS.map(({ q, a }, i) => (
            <div key={i} className="border-b border-black/8">
              <button
                className="w-full text-left px-0 py-5 flex items-center justify-between gap-4"
                onClick={() => setOpen(open === i ? null : i)}>
                <span className="font-mono font-bold text-black text-sm pr-4">{q}</span>
                <span className="font-mono text-black/75 text-lg flex-shrink-0 transition-transform duration-200"
                  style={{ transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
              </button>
              {open === i && (
                <div className="pb-5">
                  <p className="font-mono text-sm text-black/75 leading-relaxed">{a}</p>
                </div>
              )}
            </div>
          ))}
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
          <p className="font-mono text-base text-white/80">Primer listado gratis. En menos de 24 horas en tu WhatsApp.</p>
        </div>
        <a href={WA_BOT} target="_blank" rel="noopener noreferrer"
          className="font-mono font-bold text-sm text-black px-10 py-4 active:scale-95 transition-all tracking-wide w-fit whitespace-nowrap flex items-center gap-2"
          style={{ background: '#25D366' }}>
          <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, fill: '#000', flexShrink: 0 }} aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
          Quiero mi primer listado gratis →
        </a>
      </div>
      <div className="max-w-4xl mx-auto px-6 pb-8 border-t border-white/5 pt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="font-mono font-bold text-white/88 text-xs border border-white/15 px-1.5 py-0.5">PX</span>
          <p className="font-mono text-xs text-white/50">Pipeline_X · pipelinex.app · @Pipeline_X_bot · Lima, Perú</p>
        </div>
      </div>
    </footer>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [formOpen, setFormOpen] = useState(false)

  // ── 2: Modal por scroll (70%) — no mostrar si ya envió o ya vio el modal ─────
  useEffect(() => {
    if (sessionStorage.getItem('px_form_seen') || localStorage.getItem('px_reporte_solicitado')) return
    const handleScroll = () => {
      const scrolled = window.scrollY + window.innerHeight
      const total = document.documentElement.scrollHeight
      if (scrolled / total >= 0.70) {
        setFormOpen(true)
        window.removeEventListener('scroll', handleScroll)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeForm = () => {
    sessionStorage.setItem('px_form_seen', '1')
    setFormOpen(false)
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar onOpenForm={() => setFormOpen(true)} />
      <Hero onOpenForm={() => setFormOpen(true)} />
      <SocialProofStrip />
      <IntelligenceStrip />
      <HowItWorks onOpenForm={() => setFormOpen(true)} />
      <TwoChannels onOpenForm={() => setFormOpen(true)} />
      <AddonPacks onOpenForm={() => setFormOpen(true)} />
      <Testimonials />
      <Comparison onOpenForm={() => setFormOpen(true)} />
      <ReportPreview onOpenForm={() => setFormOpen(true)} />
      <PricingCalculator onOpenForm={() => setFormOpen(true)} />
      <FAQ />
      <Footer onOpenForm={() => setFormOpen(true)} />
      {formOpen && <LeadFormModal onClose={closeForm} />}
    </div>
  )
}
