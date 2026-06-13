import React from 'react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-lg border-b border-white/20 px-6 py-4 flex justify-between items-center">
      <div className="text-2xl font-black tracking-tighter text-blue-600">SOLARIS</div>
      <div className="hidden md:flex gap-8 font-medium text-slate-600">
        <a href="#features" className="hover:text-blue-600 transition">Features</a>
        <a href="#about" className="hover:text-blue-600 transition">About</a>
        <a href="#pricing" className="hover:text-blue-600 transition">Pricing</a>
      </div>
      <button className="bg-slate-900 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-600 transition-all">
        Get Started
      </button>
    </nav>
  );
}