export default function About() {
  return (
    <section id="about" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <img src="/assets/about-01.jpg" className="rounded-[2rem] shadow-2xl" alt="Team Work" />
          <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-8 rounded-2xl hidden md:block">
            <p className="text-3xl font-bold">10k+</p>
            <p className="text-sm opacity-80">Happy Users</p>
          </div>
        </div>
        <div>
          <h2 className="text-4xl font-bold mb-6">Human-centric design for high-tech solutions.</h2>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            We believe that technology should be easy to use. That's why we spend our days 
            making sure your experience is as smooth as silk.
          </p>
          <button className="text-blue-600 font-bold flex items-center gap-2 hover:gap-4 transition-all">
            Learn more about our team <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}  