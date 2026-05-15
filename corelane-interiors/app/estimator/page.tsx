'use client';
import { useState } from 'react';

const roomTypes = [
  { value: 'living',  label: 'Living Room',           mult: 1.0  },
  { value: 'bedroom', label: 'Bedroom',               mult: 0.9  },
  { value: 'kitchen', label: 'Kitchen / Modular',     mult: 1.35 },
  { value: 'bathroom',label: 'Bathroom',              mult: 1.1  },
  { value: 'dining',  label: 'Dining Area',           mult: 0.8  },
  { value: 'office',  label: 'Home Office / Study',   mult: 0.85 },
  { value: 'pooja',   label: 'Pooja Room',            mult: 0.65 },
  { value: 'full2',   label: 'Full Home (2BHK)',      mult: 2.8  },
  { value: 'full3',   label: 'Full Home (3BHK)',      mult: 3.8  },
];

const qualities = [
  { value: 'eco',  label: 'Economy',  sub: 'ISI standard, local brands', rate: 899  },
  { value: 'std',  label: 'Standard', sub: 'Mid-range, branded',         rate: 1099 },
  { value: 'prem', label: 'Premium',  sub: 'High-end, imported',         rate: 1400 },
  { value: 'lux',  label: 'Luxury',   sub: 'Best-in-class, bespoke',     rate: 2000 },
];

const cities = [
  { value: 'greater-noida', label: 'Greater Noida', mult: 1.0  },
  { value: 'noida',         label: 'Noida',         mult: 1.05 },
  { value: 'ghaziabad',     label: 'Ghaziabad',     mult: 1.0  },
  { value: 'delhi',         label: 'Delhi',         mult: 1.1  },
];

const workTypes = [
  { value: 'furniture', label: 'Furniture',       mult: 0.35 },
  { value: 'flooring',  label: 'Flooring',        mult: 0.20 },
  { value: 'lighting',  label: 'Lighting',        mult: 0.10 },
  { value: 'walls',     label: 'Wall Treatment',  mult: 0.15 },
  { value: 'ceiling',   label: 'False Ceiling',   mult: 0.12 },
  { value: 'decor',     label: 'Décor & Styling', mult: 0.08 },
];

const fmt = (n: number) =>
  n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${(n / 1000).toFixed(0)}K`;

export default function Estimator() {
  const [room,    setRoom]    = useState('');
  const [size,    setSize]    = useState(250);
  const [quality, setQuality] = useState('std');
  const [city,    setCity]    = useState('greater-noida');
  const [work,    setWork]    = useState<string[]>([]);
  const [result,  setResult]  = useState<null | { low: number; high: number; breakdown: { label: string; amt: number }[] }>(null);
  const [step,    setStep]    = useState(1);

  const [name,    setName]    = useState('');
  const [phone,   setPhone]   = useState('');
  const [sent,    setSent]    = useState(false);
  const [sending, setSending] = useState(false);

  const toggleWork = (v: string) =>
    setWork(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);

  const calculate = () => {
    if (!room) return alert('Please select a room type.');
    if (!work.length) return alert('Please select at least one type of work.');

    const rm = roomTypes.find(r => r.value === room)!;
    const ql = qualities.find(q => q.value === quality)!;
    const ct = cities.find(c => c.value === city)!;

    const totalWorkMult = work.reduce((sum, w) => {
      const wt = workTypes.find(x => x.value === w)!;
      return sum + wt.mult;
    }, 0);

    const base = size * ql.rate * ct.mult * rm.mult * totalWorkMult;
    const low  = Math.round(base * 0.90 / 10000) * 10000;
    const high = Math.round(base * 1.15 / 10000) * 10000;

    const breakdown = work.map(w => {
      const wt  = workTypes.find(x => x.value === w)!;
      const amt = Math.round(base * wt.mult / totalWorkMult / 1000) * 1000;
      return { label: wt.label, amt };
    });

    setResult({ low, high, breakdown });
    setStep(4);
  };

  const sendEstimate = async () => {
    if (!name || !phone) return alert('Please enter your name and phone.');
    setSending(true);
    await fetch('/api/estimate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name, phone,
        roomType:     room,
        size,
        quality,
        city,
        workTypes:    work,
        estimateLow:  result?.low,
        estimateHigh: result?.high,
      }),
    });
    setSending(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <section className="bg-black py-32 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#C94F2C]"></div>
            <span className="text-xs tracking-widest uppercase text-[#C94F2C] font-semibold">Price Estimator</span>
          </div>
          <h1 className="font-serif text-6xl font-light italic text-white">
            Know Your Budget<br/><b className="not-italic font-bold text-[#E8A87C]">Before You Begin</b>
          </h1>
          <p className="text-sm text-white/40 mt-6 max-w-md leading-relaxed">
            Get a realistic cost range in 60 seconds — based on room type, size, material quality and scope.
          </p>
        </div>
      </section>

      {/* STEP INDICATOR */}
      <div className="border-b border-gray-100 bg-[#F8F6F3]">
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-6 flex gap-4 md:gap-8 flex-wrap">
          {['Room & Size', 'Quality & City', 'Work Scope', 'Your Estimate'].map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step > i + 1 ? 'bg-[#C94F2C] text-white' :
                step === i + 1 ? 'bg-black text-white' :
                'bg-gray-200 text-gray-400'
              }`}>{i + 1}</div>
              <span className={`text-xs font-medium tracking-wide ${step === i + 1 ? 'text-black' : 'text-gray-400'}`}>{s}</span>
              {i < 3 && <div className="hidden md:block w-8 h-px bg-gray-200 ml-2"></div>}
            </div>
          ))}
        </div>
      </div>

      <section className="py-16 px-6 md:px-16">
        <div className="max-w-4xl mx-auto">

          {/* STEP 1 — Room & Size */}
          {step === 1 && (
            <div>
              <h2 className="font-serif text-3xl font-light italic mb-2">Select Room Type</h2>
              <p className="text-sm text-gray-400 mb-10">What space are you looking to transform?</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-12">
                {roomTypes.map(r => (
                  <button key={r.value}
                    onClick={() => setRoom(r.value)}
                    className={`p-5 border text-left transition-all ${
                      room === r.value
                        ? 'border-[#C94F2C] bg-[#C94F2C]/5 text-[#C94F2C]'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}>
                    <div className="text-sm font-semibold">{r.label}</div>
                  </button>
                ))}
              </div>

              <div className="mb-12">
                <h3 className="text-xs tracking-widest uppercase font-semibold text-gray-400 mb-4">Room Size</h3>
                <input
                  type="range" min={100} max={2000} step={25}
                  value={size}
                  onChange={e => setSize(Number(e.target.value))}
                  className="w-full accent-[#C94F2C] h-1 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>100 sq ft</span>
                  <span className="text-[#C94F2C] font-bold text-sm">{size} sq ft</span>
                  <span>2000 sq ft</span>
                </div>
              </div>

              <button
                onClick={() => room ? setStep(2) : alert('Please select a room type.')}
                className="bg-black text-white px-12 py-4 text-xs font-bold tracking-widest uppercase hover:bg-[#C94F2C] transition-colors">
                Next →
              </button>
            </div>
          )}

          {/* STEP 2 — Quality & City */}
          {step === 2 && (
            <div>
              <h2 className="font-serif text-3xl font-light italic mb-2">Material Quality</h2>
              <p className="text-sm text-gray-400 mb-10">What quality of materials are you looking for?</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                {qualities.map(q => (
                  <button key={q.value}
                    onClick={() => setQuality(q.value)}
                    className={`p-6 border text-left transition-all ${
                      quality === q.value
                        ? 'border-[#C94F2C] bg-[#C94F2C]/5'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}>
                    <div className={`text-sm font-bold mb-1 ${quality === q.value ? 'text-[#C94F2C]' : ''}`}>{q.label}</div>
                    <div className="text-xs text-gray-400">{q.sub}</div>
                    <div className={`text-xs mt-2 font-semibold ${quality === q.value ? 'text-[#C94F2C]' : 'text-gray-300'}`}>
                      ₹{q.rate} per sq ft
                    </div>
                  </button>
                ))}
              </div>

              <h2 className="font-serif text-3xl font-light italic mb-2">Your City</h2>
              <p className="text-sm text-gray-400 mb-6">Labor and material costs vary by location.</p>

              <div className="grid grid-cols-2 gap-4 mb-12">
                {cities.map(c => (
                  <button key={c.value}
                    onClick={() => setCity(c.value)}
                    className={`p-5 border text-left transition-all ${
                      city === c.value
                        ? 'border-[#C94F2C] bg-[#C94F2C]/5 text-[#C94F2C]'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}>
                    <div className="text-sm font-semibold">{c.label}</div>
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(1)}
                  className="border border-gray-200 text-gray-400 px-10 py-4 text-xs font-bold tracking-widest uppercase hover:border-black hover:text-black transition-colors">
                  ← Back
                </button>
                <button onClick={() => setStep(3)}
                  className="bg-black text-white px-12 py-4 text-xs font-bold tracking-widest uppercase hover:bg-[#C94F2C] transition-colors">
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — Work Scope */}
          {step === 3 && (
            <div>
              <h2 className="font-serif text-3xl font-light italic mb-2">What Work Do You Need?</h2>
              <p className="text-sm text-gray-400 mb-10">Select all that apply — you can choose multiple.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                {workTypes.map(w => (
                  <button key={w.value}
                    onClick={() => toggleWork(w.value)}
                    className={`p-6 border text-left transition-all flex items-center gap-4 ${
                      work.includes(w.value)
                        ? 'border-[#C94F2C] bg-[#C94F2C]/5'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-all ${
                      work.includes(w.value) ? 'bg-[#C94F2C] border-[#C94F2C]' : 'border-gray-300'
                    }`}>
                      {work.includes(w.value) && <span className="text-white text-xs">✓</span>}
                    </div>
                    <div className={`text-sm font-semibold ${work.includes(w.value) ? 'text-[#C94F2C]' : ''}`}>{w.label}</div>
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(2)}
                  className="border border-gray-200 text-gray-400 px-10 py-4 text-xs font-bold tracking-widest uppercase hover:border-black hover:text-black transition-colors">
                  ← Back
                </button>
                <button onClick={calculate}
                  className="bg-black text-white px-12 py-4 text-xs font-bold tracking-widest uppercase hover:bg-[#C94F2C] transition-colors">
                  Calculate Estimate →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 — Result */}
          {step === 4 && result && (
            <div>
              <h2 className="font-serif text-3xl font-light italic mb-8">Your Estimate</h2>

              <div className="bg-black rounded-sm p-10 mb-8">
                <div className="text-xs tracking-widest uppercase text-white/30 mb-3">Estimated Project Cost</div>
                <div className="font-serif text-6xl font-light italic text-[#E8A87C] mb-3">
                  {fmt(result.low)} – {fmt(result.high)}
                </div>
                <div className="text-xs text-white/30 mb-8 leading-relaxed">
                  Indicative range · Final cost depends on site conditions and design choices
                </div>
                <div className="border-t border-white/10 pt-6 space-y-3">
                  {result.breakdown.map(b => (
                    <div key={b.label} className="flex justify-between text-sm">
                      <span className="text-white/40">{b.label}</span>
                      <span className="text-white/70">{fmt(b.amt)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                  { label: 'Room',    value: roomTypes.find(r => r.value === room)?.label },
                  { label: 'Size',    value: `${size} sq ft` },
                  { label: 'Quality', value: qualities.find(q => q.value === quality)?.label },
                  { label: 'City',    value: cities.find(c => c.value === city)?.label },
                ].map(item => (
                  <div key={item.label} className="p-4 bg-[#F8F6F3] border border-gray-100">
                    <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">{item.label}</div>
                    <div className="text-sm font-semibold">{item.value}</div>
                  </div>
                ))}
              </div>

              {!sent ? (
                <div className="border border-gray-100 p-8">
                  <h3 className="font-serif text-2xl font-light italic mb-2">Want a Detailed Quote?</h3>
                  <p className="text-sm text-gray-400 mb-6">Leave your details and we'll send you a personalised breakdown within 24 hours.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs tracking-widest uppercase text-gray-400 font-semibold mb-2">Name *</label>
                      <input type="text" value={name} onChange={e => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-[#C94F2C] bg-[#F8F6F3]"
                        placeholder="Your name"/>
                    </div>
                    <div>
                      <label className="block text-xs tracking-widest uppercase text-gray-400 font-semibold mb-2">Phone *</label>
                      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-[#C94F2C] bg-[#F8F6F3]"
                        placeholder="Your phone"/>
                    </div>
                  </div>
                  <button onClick={sendEstimate} disabled={sending}
                    className="w-full bg-[#C94F2C] text-white py-4 text-xs font-bold tracking-widest uppercase hover:bg-black transition-colors disabled:opacity-50">
                    {sending ? 'Sending...' : 'Get Detailed Quote →'}
                  </button>
                </div>
              ) : (
                <div className="border border-[#C94F2C]/30 bg-[#C94F2C]/5 p-8 text-center">
                  <div className="text-3xl mb-3">✅</div>
                  <h3 className="font-serif text-2xl font-light italic mb-2">We'll be in touch!</h3>
                  <p className="text-sm text-gray-400">Our team will call you within 24 hours with a detailed quote.</p>
                </div>
              )}

              <div className="flex gap-4 mt-8">
                <button onClick={() => { setStep(1); setResult(null); setWork([]); setSent(false); }}
                  className="border border-gray-200 text-gray-400 px-10 py-4 text-xs font-bold tracking-widest uppercase hover:border-black hover:text-black transition-colors">
                  Start Over
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}