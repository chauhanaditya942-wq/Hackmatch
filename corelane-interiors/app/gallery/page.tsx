'use client';
import { useState } from 'react';

const projects = [
  { id:1, title:'Modern Dining Room',       category:'Dining',      location:'Greater Noida', budget:'Standard', img:'https://corelaneinteriors.com/wp-content/uploads/2026/02/pexels-photo-3356416.jpeg' },
  { id:2, title:'Luxury Bedroom',           category:'Bedroom',     location:'Noida',         budget:'Premium',  img:'https://corelaneinteriors.com/wp-content/uploads/2026/02/pexels-photo-3144580.jpeg' },
  { id:3, title:'Modular Kitchen',          category:'Kitchen',     location:'Greater Noida', budget:'Standard', img:'https://corelaneinteriors.com/wp-content/uploads/2026/02/pexels-photo-6032416.jpeg' },
  { id:4, title:'Contemporary Living Room', category:'Living Room', location:'Delhi',         budget:'Premium',  img:'https://corelaneinteriors.com/wp-content/uploads/2026/02/pexels-photo-1643383.jpeg' },
  { id:5, title:'Elegant Kitchen Design',   category:'Kitchen',     location:'Ghaziabad',     budget:'Essential',img:'https://corelaneinteriors.com/wp-content/uploads/2026/02/pexels-photo-1643384.jpeg' },
  { id:6, title:'Full Home Interior',       category:'Full Home',   location:'Noida',         budget:'Premium',  img:'https://corelaneinteriors.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-06-at-14.42.27.jpeg' },
];

const categories = ['All','Living Room','Bedroom','Kitchen','Dining','Full Home'];
const budgets    = ['All','Essential','Standard','Premium'];

type Project = typeof projects[0];

export default function Gallery() {
  const [cat,      setCat]      = useState('All');
  const [budget,   setBudget]   = useState('All');
  const [selected, setSelected] = useState<Project | null>(null);

  const filtered = projects.filter(p => {
    const matchCat    = cat    === 'All' || p.category === cat;
    const matchBudget = budget === 'All' || p.budget   === budget;
    return matchCat && matchBudget;
  });

  return (
    <div className="min-h-screen bg-white">

      {/* HEADER */}
      <section className="bg-black py-32 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#C94F2C]"></div>
            <span className="text-xs tracking-widest uppercase text-[#C94F2C] font-semibold">Our Work</span>
          </div>
          <h1 className="font-serif text-6xl font-light italic text-white">
            Projects That<br/><b className="not-italic font-bold text-[#E8A87C]">Speak for Themselves</b>
          </h1>
          <p className="text-sm text-white/40 mt-6 max-w-md leading-relaxed">
            Every project is a story. Browse our portfolio of homes transformed across Delhi NCR and Greater Noida.
          </p>
        </div>
      </section>

      {/* FILTERS */}
      <section className="border-b border-gray-100 bg-[#F8F6F3] px-6 md:px-16 py-6">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-6 items-center justify-between">
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-xs tracking-widest uppercase text-gray-400 font-semibold mr-2">Room:</span>
            {categories.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-4 py-2 text-xs font-semibold tracking-wide border transition-all ${
                  cat === c ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-200 hover:border-black hover:text-black'
                }`}>{c}</button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-xs tracking-widest uppercase text-gray-400 font-semibold mr-2">Budget:</span>
            {budgets.map(b => (
              <button key={b} onClick={() => setBudget(b)}
                className={`px-4 py-2 text-xs font-semibold tracking-wide border transition-all ${
                  budget === b ? 'bg-[#C94F2C] text-white border-[#C94F2C]' : 'bg-white text-gray-400 border-gray-200 hover:border-[#C94F2C] hover:text-[#C94F2C]'
                }`}>{b}</button>
            ))}
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="py-16 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-xs text-gray-400 mb-8">{filtered.length} projects</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.map(p => (
              <div key={p.id} className="group cursor-pointer" onClick={() => setSelected(p)}>
                <div className="overflow-hidden aspect-[4/3] mb-4 relative">
                  <img src={p.img} alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                    <span className="text-white text-3xl opacity-0 group-hover:opacity-100 transition-all font-light">+</span>
                  </div>
                  <div className={`absolute top-4 left-4 text-xs font-bold tracking-widest uppercase px-3 py-1 ${
                    p.budget === 'Essential' ? 'bg-white text-gray-600' :
                    p.budget === 'Standard'  ? 'bg-[#C94F2C] text-white' :
                    'bg-black text-[#E8A87C]'
                  }`}>{p.budget}</div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-lg font-light">{p.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">{p.category} · {p.location}</p>
                  </div>
                  <span className="text-[#C94F2C] opacity-0 group-hover:opacity-100 transition-all text-lg">→</span>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="py-20 text-center text-gray-400">
              <div className="text-4xl mb-4">🏠</div>
              <p className="text-sm">No projects match your filters.</p>
            </div>
          )}
        </div>
      </section>

      {/* LIGHTBOX */}
      {selected && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6"
          onClick={() => setSelected(null)}>
          <div className="max-w-4xl w-full bg-white" onClick={e => e.stopPropagation()}>
            <img src={selected.img} alt={selected.title} className="w-full aspect-video object-cover"/>
            <div className="p-8 flex justify-between items-start">
              <div>
                <h2 className="font-serif text-3xl font-light italic mb-2">{selected.title}</h2>
                <p className="text-sm text-gray-400">{selected.category} · {selected.location} · {selected.budget}</p>
              </div>
              <button onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-black transition-colors text-2xl font-light">✕</button>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <section className="bg-[#C94F2C] py-16 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <h2 className="font-serif text-4xl font-light italic text-white">Love What You See?</h2>
          <a href="/contact"
            className="bg-white text-[#C94F2C] px-10 py-4 text-xs font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-all">
            Start Your Project →
          </a>
        </div>
      </section>

    </div>
  );
}