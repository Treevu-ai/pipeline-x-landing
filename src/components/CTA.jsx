export default function CTA() {
  return (
    <section className="py-24 border-t border-white/5">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div className="glass rounded-3xl p-12 glow-border">
          <p className="font-mono text-terminal text-sm mb-4">// listo para empezar?</p>
          <h2 className="text-4xl font-bold mb-4">
            De 0 a 50 leads calificados<br />
            <span className="gradient-text">en menos de 10 minutos</span>
          </h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Sin tarjeta de crédito. Sin setup complicado. Solo escribe tu búsqueda y Pipeline_X hace el resto.
          </p>
          <a
            href="#precios"
            className="inline-block px-10 py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-lg transition-all hover:scale-105"
          >
            Empezar gratis →
          </a>
        </div>
      </div>
    </section>
  )
}
