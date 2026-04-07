export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-mono font-medium text-white">
          Pipeline<span className="text-purple-400">_X</span>
        </span>
        <p className="text-sm text-slate-600">
          © 2026 Pipeline_X — Agente SDR con IA para MIPYME latinoamericana
        </p>
        <div className="flex gap-6 text-sm text-slate-500">
          <a href="#" className="hover:text-white transition-colors">Privacidad</a>
          <a href="#" className="hover:text-white transition-colors">Términos</a>
          <a href="#" className="hover:text-white transition-colors">Contacto</a>
        </div>
      </div>
    </footer>
  )
}
