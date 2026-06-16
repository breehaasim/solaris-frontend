import React, { useState } from 'react';
import { submitContactForm } from '../api';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await submitContactForm(formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-900 text-white px-6">
      <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl p-10 md:p-16 rounded-[3rem] border border-white/10 shadow-2xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">Say Hello! 👋</h2>
          <p className="text-slate-400 mt-4">Have a big idea? Let's build it together.</p>
        </div>

        {status === 'success' && <p className="text-green-400 text-center mb-4">✅ Message sent successfully!</p>}
        {status === 'error' && <p className="text-red-400 text-center mb-4">❌ Failed to send. Try again.</p>}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-2 ml-1 text-slate-300">Your Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Elon Musk" className="bg-white/10 border border-white/20 rounded-2xl p-4 focus:outline-none focus:border-blue-500 transition" required />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-2 ml-1 text-slate-300">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="elon@mars.com" className="bg-white/10 border border-white/20 rounded-2xl p-4 focus:outline-none focus:border-blue-500 transition" required />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-2 ml-1 text-slate-300">Your Message</label>
            <textarea rows="4" name="message" value={formData.message} onChange={handleChange} placeholder="I want to build a rocket ship..." className="bg-white/10 border border-white/20 rounded-2xl p-4 focus:outline-none focus:border-blue-500 transition" required></textarea>
          </div>

          <button type="submit" disabled={status === 'sending'} className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 transition-all active:scale-95">
            {status === 'sending' ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  );
}