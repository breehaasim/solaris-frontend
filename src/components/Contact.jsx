import React from 'react';

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-slate-900 text-white px-6">
      <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl p-10 md:p-16 rounded-[3rem] border border-white/10 shadow-2xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">Say Hello! 👋</h2>
          <p className="text-slate-400 mt-4">Have a big idea? Let’s build it together.</p>
        </div>

        <form className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-2 ml-1 text-slate-300">Your Name</label>
              <input type="text" placeholder="Elon Musk" className="bg-white/10 border border-white/20 rounded-2xl p-4 focus:outline-none focus:border-blue-500 transition" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-2 ml-1 text-slate-300">Email Address</label>
              <input type="email" placeholder="elon@mars.com" className="bg-white/10 border border-white/20 rounded-2xl p-4 focus:outline-none focus:border-blue-500 transition" />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-2 ml-1 text-slate-300">Your Message</label>
            <textarea rows="4" placeholder="I want to build a rocket ship..." className="bg-white/10 border border-white/20 rounded-2xl p-4 focus:outline-none focus:border-blue-500 transition"></textarea>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 transition-all active:scale-95">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}