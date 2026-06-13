export default function Pricing() {
  const plans = [
    { name: "Seed", price: "$0", features: ["1 Project", "Community Support"] },
    { name: "Growth", price: "$49", features: ["Unlimited Projects", "Priority Support"], hot: true },
    { name: "Orbit", price: "$199", features: ["Custom Domain", "24/7 Phone Support"] }
  ];

  return (
    <section id="pricing" className="py-24 bg-slate-100 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-12">Simple Pricing</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div key={i} className={`p-10 rounded-3xl bg-white border-2 ${plan.hot ? 'border-blue-500 shadow-xl' : 'border-transparent'}`}>
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="text-4xl font-black mb-6">{plan.price}<span className="text-sm text-slate-400">/mo</span></div>
              <ul className="text-left space-y-4 mb-8 text-slate-600">
                {plan.features.map(f => <li key={f}>✓ {f}</li>)}
              </ul>
              <button className={`w-full py-3 rounded-xl font-bold transition ${plan.hot ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 hover:bg-slate-200'}`}>
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}