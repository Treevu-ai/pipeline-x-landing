import { useState } from 'react'

// ── Configura estos valores antes de publicar ─────────────────────────────────
const TELEGRAM_BOT  = 'Pipeline_X_bot'
const WHATSAPP_NUM  = '51902126765'
const WHATSAPP_TEXT = encodeURIComponent('Hola, quiero ver mi demo gratuita de Pipeline_X')
const API           = 'https://agentepyme-api-production.up.railway.app'
// ─────────────────────────────────────────────────────────────────────────────

const TELEGRAM_URL = `https://t.me/${TELEGRAM_BOT}?start=demo`
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUM}?text=${WHATSAPP_TEXT}`

const INDUSTRIAS = [
  'Retail / Comercio',
  'Logística / Transporte',
  'Construcción',
  'Servicios B2B',
  'Salud / Clínicas',
  'Contabilidad / Finanzas',
  'Tecnología',
  'Otro',
]

function validateRuc(ruc) {
  return /^\d{8}$|^\d{11}$/.test(ruc)
}

const INPUT = 'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-purple-500 transition-colors'
const LABEL = 'block text-xs font-mono text-slate-400 mb-1'

// ── Formulario (fallback para usuarios que lo prefieren) ──────────────────────

function FormFallback() {
  const [form, setForm] = useState({
    nombre: '', empresa: '', ruc: '', email: '', industria: '', ciudad: '',
  })
  const [status, setStatus] = useState('idle')
  const [rucError, setRucError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (name === 'ruc') {
      setRucError(value && !validateRuc(value) ? 'RUC debe tener 8 o 11 dígitos' : '')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateRuc(form.ruc)) { setRucError('RUC debe tener 8 o 11 dígitos'); return }
    setStatus('loading')
    try {
      const res = await fetch(`${API}/demo-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('success')
      } else if (res.status === 409) {
        const data = await res.json()
        setStatus(data.detail?.includes('RUC') ? 'dup_ruc' : 'dup_email')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="glass rounded-2xl p-8 text-center mt-4">
        <div className="text-4xl mb-4">✓</div>
        <h3 className="text-xl font-bold mb-2 text-terminal">¡Demo en proceso!</h3>
        <p className="text-slate-400 text-sm">
          Generando tu reporte para <strong className="text-white">{form.empresa}</strong>.
          Te escribimos a <strong className="text-white">{form.email}</strong> en menos de 24 h.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Nombre completo *</label>
          <input name="nombre" value={form.nombre} onChange={handleChange}
            required className={INPUT} placeholder="Juan Pérez" />
        </div>
        <div>
          <label className={LABEL}>Empresa *</label>
          <input name="empresa" value={form.empresa} onChange={handleChange}
            required className={INPUT} placeholder="Mi Empresa S.A.C." />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>RUC *</label>
          <input
            name="ruc" value={form.ruc} onChange={handleChange}
            required maxLength={11}
            className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-slate-600 text-sm focus:outline-none transition-colors ${
              rucError ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-purple-500'
            }`}
            placeholder="20123456789"
          />
          {rucError && <p className="text-red-400 text-xs mt-1 font-mono">{rucError}</p>}
        </div>
        <div>
          <label className={LABEL}>Email corporativo *</label>
          <input name="email" value={form.email} onChange={handleChange}
            required type="email" className={INPUT} placeholder="juan@empresa.com" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Industria *</label>
          <select name="industria" value={form.industria} onChange={handleChange} required
            className="w-full px-4 py-3 rounded-xl bg-[#111] border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors">
            <option value="" disabled>Selecciona...</option>
            {INDUSTRIAS.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label className={LABEL}>Ciudad *</label>
          <input name="ciudad" value={form.ciudad} onChange={handleChange}
            required className={INPUT} placeholder="Lima" />
        </div>
      </div>

      {['dup_email', 'dup_ruc', 'error'].includes(status) && (
        <div className="px-4 py-3 rounded-xl bg-red-900/30 border border-red-500/40 text-red-300 text-sm font-mono">
          {status === 'dup_email' && '⚠ Ya existe una demo solicitada con este correo.'}
          {status === 'dup_ruc'   && '⚠ Tu empresa ya tiene una demo activa con Pipeline_X.'}
          {status === 'error'     && '⚠ Error al procesar tu solicitud. Intenta de nuevo.'}
        </div>
      )}

      <button type="submit" disabled={status === 'loading'}
        className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed">
        {status === 'loading' ? '⟳ Procesando...' : 'Solicitar demo →'}
      </button>

      <p className="text-center text-xs text-slate-600 font-mono">
        Una demo por empresa · Sin spam · Solo resultados
      </p>
    </form>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function CTA() {
  const [showForm, setShowForm] = useState(false)

  return (
    <section id="demo" className="py-24 border-t border-white/5">
      <div className="max-w-xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="font-mono text-terminal text-sm mb-3">// demo gratuita</p>
          <h2 className="text-3xl font-bold mb-3">
            Prueba Pipeline_X <span className="gradient-text">ahora mismo</span>
          </h2>
          <p className="text-slate-400 text-sm">
            Sin tarjeta · 10 leads reales de tu industria · Listo en 5 minutos
          </p>
        </div>

        {/* Botones chat — primario */}
        <div className="glass rounded-3xl p-8 glow-border space-y-4">

          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 w-full px-6 py-4 rounded-2xl font-semibold text-sm transition-all hover:scale-[1.02] hover:shadow-lg"
            style={{ background: '#25D366', color: '#000' }}>
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-black/10 shrink-0">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
            </span>
            <span className="flex-1 text-left">
              <span className="block text-base">Ver mi demo en WhatsApp</span>
              <span className="block text-xs font-normal opacity-70">Abre WhatsApp · respuesta inmediata</span>
            </span>
            <span className="text-lg">→</span>
          </a>

          <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 w-full px-6 py-4 rounded-2xl font-semibold text-sm transition-all hover:scale-[1.02] hover:shadow-lg"
            style={{ background: '#2AABEE', color: '#000' }}>
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-black/10 shrink-0">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden="true">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </span>
            <span className="flex-1 text-left">
              <span className="block text-base">Ver mi demo en Telegram</span>
              <span className="block text-xs font-normal opacity-70">Abre Telegram · misma experiencia</span>
            </span>
            <span className="text-lg">→</span>
          </a>

          {/* Separador */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-xs text-slate-600 font-mono">o</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Formulario colapsado */}
          <button
            onClick={() => setShowForm(v => !v)}
            className="w-full py-3 rounded-xl glass text-slate-400 hover:text-white text-sm font-medium transition-colors"
          >
            {showForm ? '↑ Ocultar formulario' : '✉ Prefiero solicitar por email'}
          </button>

          {showForm && <FormFallback />}
        </div>

      </div>
    </section>
  )
}
