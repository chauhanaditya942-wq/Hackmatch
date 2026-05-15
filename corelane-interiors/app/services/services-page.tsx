import Link from 'next/link';

const services = [
  {
    num: '01',
    icon: '🪑',
    title: 'Custom Furniture Design',
    desc: 'Bespoke pieces crafted to your exact dimensions, style and budget. Every piece is made to order — no off-the-shelf compromises.',
    features: ['Wardrobe & storage units', 'TV units & shelving', 'Beds & headboards', 'Study tables & desks', 'Sofa & seating', 'Kitchen cabinets'],
  },
  {
    num: '02',
    icon: '📐',
    title: 'Space Planning',
    desc: 'Smart layout design that maximises every square foot of your home — functional, flowing and beautiful to live in.',
    features: ['Floor plan design', 'Furniture placement', 'Traffic flow optimisation', 'Storage planning', 'Room zoning', 'Vastu consultation'],
  },
  {
    num: '03',
    icon: '🎨',
    title: 'Color Consultation',
    desc: 'Expert colour palettes that set the perfect mood for each room — warm, bold, calming or dramatic, exactly as you like.',
    features: ['Room-wise colour schemes', 'Paint brand recommendations', 'Accent wall design', 'Texture & finish selection', 'Mood board creation', 'Lighting impact analysis'],
  },
  {
    num: '04',
    icon: '💡',
    title: 'Lighting Design',
    desc: 'Layered lighting plans — ambient, task and accent — that transform how a room feels at any time of day or night.',
    features: ['False ceiling lighting', 'Cove & indirect lighting', 'Task lighting', 'Accent & feature lighting', 'Smart lighting setup', 'Outdoor lighting'],
  },
  {
    num: '05',
    icon: '🏠',
    title: 'Full Home Interiors',
    desc: 'Complete end-to-end transformation of your entire home — one unified vision, one team, flawlessly executed.',
    features: ['Complete design plan', 'All rooms covered', 'Single point of contact', 'Material procurement', 'Site supervision', 'Final styling & handover'],
  },
  {
    num: '06',
    icon: '🪴',
    title: 'Décor & Styling',
    desc: 'The finishing touches — art, accessories, plants and textiles — that make a house feel like a home.',
    features: ['Art & wall decor', 'Soft furnishings', 'Indoor plants', 'Vases & accessories', 'Curtains & blinds', 'Rugs & carpets'],
  },
];

export default function Services() {
  return (
    <div className="min-h-screen bg-white">

      {/* HEADER */}
      <section className="bg-black py-32 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#C94F2C]"></div>
            <span className="text-xs tracking-widest uppercase text-[#C94F2C] font-semibold">What We Offer</span>
          </div>
          <h1 className="font-serif text-6xl font-light italic text-white">
            Every Service Your<br/><b className="not-italic font-bold text-[#E8A87C]">Home Deserves</b>
          </h1>
          <p className="text-sm text-white/40 mt-6 max-w-md leading-relaxed">
            From a single room refresh to a full home transformation — we do it all, end to end, with the same care and attention.
          </p>
        </div>
      </section>

      {/* SERVICES LIST */}
      <section className="py-24 px-6 md:px-16">
        <div className="max-w-7xl mx-auto space-y-2">
          {services.map((s, i) => (
            <div key={s.num}
              className="group border border-gray-100 hover:border-[#C94F2C] transition-all overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0">

                {/* LEFT */}
                <div className="p-10 border-r border-gray-100 group-hover:border-[#C94F2C] transition-colors">
                  <div className="font-serif text-6xl font-light italic text-gray-100 group-hover:text-[#C94F2C]/10 transition-colors mb-4">{s.num}</div>
                  <div className="text-3xl mb-4">{s.icon}</div>
                  <h2 className="font-serif text-2xl font-light mb-3 group-hover:text-[#C94F2C] transition-colors">{s.title}</h2>
                </div>

                {/* MIDDLE */}
                <div className="p-10 border-r border-gray-100 group-hover:border-[#C94F2C] transition-colors">
                  <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
                </div>

                {/* RIGHT */}
                <div className="p-10">
                  <div className="text-xs tracking-widest uppercase text-gray-400 font-semibold mb-4">Includes</div>
                  <ul className="space-y-2">
                    {s.features.map(f => (
                      <li key={f} className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="text-[#C94F2C]">—</span>{f}
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-24 px-6 md:px-16 bg-[#F8F6F3]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#C94F2C]"></div>
            <span className="text-xs tracking-widest uppercase text-[#C94F2C] font-semibold">How We Work</span>
          </div>
          <h2 className="font-serif text-4xl font-light italic mb-16">
            Our Simple <b className="not-italic font-bold">Process</b>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Free Consultation', desc: 'We meet, listen and understand your vision, budget and timeline.' },
              { step: '02', title: 'Design Proposal',   desc: 'We present a detailed design plan, mood board and cost estimate.' },
              { step: '03', title: 'Execution',         desc: 'Our team handles everything — procurement, installation and supervision.' },
              { step: '04', title: 'Handover',          desc: 'We deliver your dream home on time and within budget, fully styled.' },
            ].map((p, i) => (
              <div key={p.step} className="relative">
                {i < 3 && <div className="hidden md:block absolute top-5 left-full w-full h-px bg-gray-200 z-0"></div>}
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-[#C94F2C] text-white rounded-full flex items-center justify-center text-xs font-bold mb-6">{p.step}</div>
                  <h3 className="font-semibold text-sm mb-2">{p.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#C94F2C] py-20 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <h2 className="font-serif text-5xl font-light italic text-white">
            Ready to Get<br/><b className="not-italic font-bold">Started?</b>
          </h2>
          <div className="flex flex-col items-end gap-4">
            <p className="text-sm text-white/60 max-w-xs text-right leading-relaxed">
              Book a free consultation and let's design your dream home together.
            </p>
            <Link href="/contact"
              className="bg-white text-[#C94F2C] px-10 py-4 text-xs font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-all">
              Book Free Consult →
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}