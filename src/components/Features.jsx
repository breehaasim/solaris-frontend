import React from 'react';

export default function Features() {
  const features = [
    {
      title: "Smart Coding",
      desc: "We write clean code that grows with your business.",
      img: "/assets/about-02.jpg"
    },
    {
      title: "Global Reach",
      desc: "Connect with users anywhere in the world instantly.",
      img: "/assets/parallax-bg-05.jpg" 
    }
  ];

  return (
    <section id="features" className="py-24 bg-white px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900">Superpowers for your Startup</h2>
          <p className="text-slate-500 mt-4">Everything you need to succeed, all in one place.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {features.map((item, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="overflow-hidden rounded-3xl mb-6 shadow-lg">
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="w-full h-72 object-cover group-hover:scale-110 transition duration-500" 
                />
              </div>
              <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-600 transition">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}