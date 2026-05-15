'use client';
import { useState } from 'react';

const chapters = [
  { num: '01', title: 'Planning Your Project',       desc: 'How to start, what to decide first, and how to avoid the most common mistakes before work begins.' },
  { num: '02', title: 'Budget Allocation by Room',   desc: 'Exactly how to split your budget across rooms — with real percentages and example numbers.' },
  { num: '03', title: 'Material Selection Guide',    desc: 'What to look for in wood, laminates, hardware, tiles and fabrics — at every price point.' },
  { num: '04', title: 'Working With a Designer',     desc: 'What to expect, what questions to ask, and how to make the most of your design consultation.' },
  { num: '05', title: '10 Costly Mistakes to Avoid', desc: 'Real mistakes real homeowners make — and how to avoid every single one of them.' },
  { num: '06', title: 'Room-Wise Checklists',        desc: 'A complete checklist for every room in your home — so nothing gets missed.' },
];

export default function Guide() {
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setLoading(true);
    await fetch('/api/guide', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-white">

      {/* HEADER */}
      <section className="bg-black py-32 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-[#C94F2C]"></div>
              <span className="text-xs tracking-widest uppercase text-[#C94F2C] font-semibold">Free Download</span>
            </div>
            <h1 className="font-serif text-6xl font-light italic text-white mb-6">
              The Complete<br/><b className="not-italic font-bold text-[#E8A87C]">Home Interior Guide</b>
            </h1>
            <p className="text-sm text-white/40 leading-relaxed max-w-md">
              60 pages of practical knowledge — everything you need to know before starting your interior project. No fluff, just actionable advice.
            </p>
          </div>

          {/* BOOK MOCKUP */}
          <div className="relative">
            <div className="bg-[#1a1a1a] border border-white/10 p-10 rounded-sm relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-3 bg-[#C94F2C]"></div>
              <div className="pl-4">
                <div className="text-xs tracking-widest uppercase text-white/30 mb-6">Core Lane Interiors · 2026</div>
                <div className="font-serif text-3xl font-light italic text-white mb-2">The Complete<br/>Home Interior<br/><span className="text-[#E8A87C]">Guide</span></div>
                <div className="text-xs text-white/25 mb-8">60 pages · Free</div>
                <div className="space-y-3">
                  {chapters.slice(0, 4).map(c => (
                    <div key={c.num} className="flex gap-3 items-center text-xs text-white/30 border-b border-white/5 pb-2">
                      <span className="text-[#C94F2C]">→</span>
                      {c.title}
                    </div>
                  ))}
                  <div className="text-xs text-white/20 italic">+ 2 more chapters...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section className="py-24 px-6 md:px-16 bg-[#F8F6F3]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#C94F2C]"></div>
            <span className="text-xs tracking-widest uppercase text-[#C94F2C] font-semibold">What's Inside</span>
          </div>
          <h2 className="font-serif text-4xl font-light italic mb-16">
            6 Chapters, <b className="not-italic font-bold">60 Pages</b>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chapters.map(c => (
              <div key={c.num} className="bg-white border border-gray-100 p-8 hover:border-[#C94F2C] transition-colors group">
                <div className="flex gap-6 items-start">
                  <div className="font-serif text-4xl font-light italic text-gray-100 group-hover:text-[#C94F2C]/20 transition-colors flex-shrink-0">{c.num}</div>
                  <div>
                    <h3 className="font-semibold text-sm mb-2 group-hover:text-[#C94F2C] transition-colors">{c.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{c.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOWNLOAD FORM */}
      <section className="py-24 px-6 md:px-16 bg-white">
        <div className="max-w-xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#C94F2C]"></div>
            <span className="text-xs tracking-widest uppercase text-[#C94F2C] font-semibold">Get Your Free Copy</span>
            <div className="w-8 h-px bg-[#C94F2C]"></div>
          </div>
          <h2 className="font-serif text-4xl font-light italic mb-4">
            Download <b className="not-italic font-bold">Free</b>
          </h2>
          <p className="text-sm text-gray-400 mb-12 leading-relaxed">
            Enter your name and email — we'll send the guide straight to your inbox. No spam, ever.
          </p>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text" required value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-5 py-4 border border-gray-200 text-sm focus:outline-none focus:border-[#C94F2C] transition-colors bg-[#F8F6F3]"
              />
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full px-5 py-4 border border-gray-200 text-sm focus:outline-none focus:border-[#C94F2C] transition-colors bg-[#F8F6F3]"
              />
              <button
                type="submit" disabled={loading}
                className="w-full bg-[#C94F2C] text-white py-4 text-xs font-bold tracking-widest uppercase hover:bg-black transition-colors disabled:opacity-50">
                {loading ? 'Sending...' : 'Send Me the Free Guide →'}
              </button>
              <p className="text-xs text-gray-400">No spam. Unsubscribe anytime.</p>
            </form>
          ) : (
            <div className="bg-[#F8F6F3] border border-gray-100 p-12 text-center">
              <div className="text-5xl mb-4">📬</div>
              <h3 className="font-serif text-2xl font-light italic mb-3">Guide is on its way!</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Check your inbox at <b>{email}</b>. If you don't see it, check your spam folder.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#C94F2C] py-16 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <h2 className="font-serif text-4xl font-light italic text-white">
            Ready to Start Your Project?
          </h2>
          <a href="/contact"
            className="bg-white text-[#C94F2C] px-10 py-4 text-xs font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-all whitespace-nowrap">
            Book Free Consult →
          </a>
        </div>
      </section>

    </div>
  );
}