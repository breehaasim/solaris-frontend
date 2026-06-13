export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-900">
      <img 
        src="/assets/parallax-bg-03.jpg" 
        className="absolute inset-0 w-full h-full object-cover opacity-60" 
        alt="Earth from Space"
      />
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-8xl font-extrabold text-white mb-6 tracking-tight">
          Build the <span className="text-blue-400">Future.</span>
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
          We provide the modern tools you need to launch your startup and reach users across the globe.
        </p>
        <div className="flex gap-4 justify-center">
          <button className="bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/40 hover:scale-105 transition">Start Building</button>
          <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition">View Demo</button>
        </div>
      </div>
    </section>
  );
}