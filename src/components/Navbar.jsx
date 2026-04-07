export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5" style={{background:'rgba(10,10,18,0.85)', backdropFilter:'blur(16px)'}}>
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <span className="font-mono font-medium text-white tracking-tight">
          Pipeline<span className="text-purple-400">_X</span>
        </span>
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
          <a href="#como-funciona" className="hover:text-white transition-colors">Cómo funciona</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#precios" className="hover:text-white transition-colors">Precios</a>
        </div>
        <a href="https://t.me/Pipeline_X_bot" target="_blank" rel="noopener noreferrer" className="text-sm font-medium px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 transition-colors text-white">
          Solicitar demo
        </a>
      </div>
    </nav>
  )
}
