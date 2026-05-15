'use client';
import Link from 'next/link';

export default function Founder() {
  return (
    <div className="min-h-screen bg-white">

      {/* HERO */}
      <section className="bg-black grid grid-cols-1 md:grid-cols-2 min-h-[70vh]">
        <div className="relative overflow-hidden">
          <img
            src="https://corelaneinteriors.com/wp-content/uploads/2026/02/images/vinod.jpeg"
            alt="Vinod Chauhan"
            className="w-full h-full object-cover object-top brightness-75"
          />
          <div className="absolute top-8 left-0 bg-[#C94F2C] text-white px-6 py-3 text-xs font-bold tracking-widest uppercase">
            Founder & Principal Designer
          </div>
        </div>
        <div className="flex flex-col justify-center px-6 md:px-16 py-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#C94F2C]"></div>
            <span className="text-xs tracking-widest uppercase text-[#C94F2C] font-semibold">The Man Behind It All</span>
          </div>
          <h1 className="font-serif text-7xl font-light italic text-white leading-tight mb-4">
            Vinod<br/>Chauhan
          </h1>
          <div className="text-xs tracking-widest uppercase text-[#E8A87C] font-semibold mb-10">
            Founder · Core Lane Interiors · Est. 2021
          </div>
          <div className="flex gap-10 border-t border-white/10 pt-8">
            {[['5+','Years'],['200+','Homes'],['NCR','Based']].map(([n,l]) => (
              <div key={l}>
                <div className="font-serif text-3xl font-light italic text-[#E8A87C]">{n}</div>
                <div className="text-xs tracking-widest uppercase text-white/30 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="bg-[#F8F6F3] py-20 px-6 md:px-6 md:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="font-serif text-4xl font-light italic leading-relaxed text-black mb-6">
            "Every home has a story waiting to be told.<br/>My job is simply to help it speak."
          </div>
          <div className="text-xs tracking-widest uppercase text-[#C94F2C] font-semibold">— Vinod Chauhan</div>
        </div>
      </section>

      {/* STORY */}
      <section className="py-24 px-6 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-[#C94F2C]"></div>
              <span className="text-xs tracking-widest uppercase text-[#C94F2C] font-semibold">The Story</span>
            </div>
            <h2 className="font-serif text-4xl font-light italic mb-8">
              Design That Reaches<br/><b className="not-italic font-bold">Every Home</b>
            </h2>
            <div className="space-y-5 text-sm text-gray-500 leading-relaxed">
              <p>
                Vinod Chauhan founded Core Lane Interiors in 2021 with a conviction that beautiful, thoughtful design should be accessible to every Indian family — not just those with premium budgets. Growing up in Ghaziabad, he saw firsthand how people dreamed of beautiful homes but were priced out of professional design services.
              </p>
              <p>
                After years of studying interior design and working with established studios across Delhi NCR, Vinod decided to build something different — a studio that combined genuine design talent with honest pricing, warm service and a deep respect for how Indian families actually live.
              </p>
              <p>
                Today, Core Lane Interiors has transformed over 200 homes across Ghaziabad, Noida, Delhi and beyond. Every project is personal. Every space is designed to genuinely reflect the people who inhabit it — their habits, their aspirations, their stories.
              </p>
              <p>
                Vinod leads every project personally, from the first consultation to the final handover — because he believes that's the only way to get it truly right.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-[#C94F2C]"></div>
              <span className="text-xs tracking-widest uppercase text-[#C94F2C] font-semibold">Core Values</span>
            </div>
            {[
              { icon: '✦', title: 'Honest Pricing',      desc: 'No hidden costs, no surprises. What we quote at the beginning is exactly what you pay at the end. We believe trust is the foundation of every great project.' },
              { icon: '⏱', title: 'On-Time Delivery',    desc: 'We respect your time as much as our own. Every project has a clear timeline, and we deliver on it — without cutting corners.' },
              { icon: '◈', title: 'Quality Materials',   desc: 'We source only verified, durable materials from trusted suppliers — whether you\'re on an economy or luxury budget. Quality isn\'t negotiable.' },
              { icon: '∞', title: 'After-Sales Support', desc: 'Our relationship doesn\'t end at handover. We\'re available for support, adjustments and advice long after your project is complete.' },
            ].map(v => (
              <div key={v.title} className="p-6 border border-gray-100 hover:border-[#C94F2C] transition-colors group">
                <div className="flex items-start gap-4">
                  <div className="text-2xl text-[#C94F2C] mt-1 flex-shrink-0">{v.icon}</div>
                  <div>
                    <h4 className="text-sm font-bold mb-2 group-hover:text-[#C94F2C] transition-colors">{v.title}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-24 px-6 md:px-16bg-[#F8F6F3]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#C94F2C]"></div>
            <span className="text-xs tracking-widest uppercase text-[#C94F2C] font-semibold">The Journey</span>
          </div>
          <h2 className="font-serif text-4xl font-light italic mb-16">
            From Dream to <b className="not-italic font-bold">Studio</b>
          </h2>
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-200"></div>
            <div className="space-y-12">
              {[
                { year: '2021', title: 'Core Lane Founded',        desc: 'Vinod started Core Lane Interiors from Ghaziabad with a single mission — honest, beautiful design for every home.' },
                { year: '2022', title: 'First 50 Projects',        desc: 'Word spread fast. Within a year, Core Lane had completed 50+ home projects across Ghaziabad and Noida.' },
                { year: '2023', title: 'Expanding Across NCR',     desc: 'The team grew and projects expanded to Delhi, Faridabad and Greater Noida — bringing the same personal touch to every home.' },
                { year: '2024', title: '150+ Homes Transformed',   desc: 'A milestone year — 150+ happy families and a growing reputation for quality, honesty and warmth.' },
                { year: '2025', title: 'Premium & Luxury Tier',    desc: 'Launched the Luxury Signature service for premium clients, while keeping Essential and Standard packages affordable.' },
                { year: '2026', title: '200+ Homes & Growing',     desc: 'Today, Core Lane Interiors continues to grow — with the same values it started with on day one.' },
              ].map((item, i) => (
                <div key={item.year} className="flex gap-8 items-start pl-14 relative">
                  <div className="absolute left-0 w-10 h-10 bg-white border-2 border-[#C94F2C] rounded-full flex items-center justify-center text-xs font-bold text-[#C94F2C]">
                    {i + 1}
                  </div>
                  <div>
                    <div className="text-xs tracking-widest uppercase text-[#C94F2C] font-bold mb-1">{item.year}</div>
                    <h4 className="text-base font-semibold mb-2">{item.title}</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#C94F2C] py-20 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <h2 className="font-serif text-5xl font-light italic text-white">
            Ready to Work<br/>With <b className="not-italic font-bold">Vinod?</b>
          </h2>
          <div className="flex flex-col items-end gap-4">
            <p className="text-sm text-white/60 max-w-xs text-right leading-relaxed">
              Book a free consultation and let's start designing your dream home together.
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