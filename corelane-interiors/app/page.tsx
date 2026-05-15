'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FadeUp, FadeIn, SlideLeft, SlideRight, StaggerContainer, StaggerItem } from '@/components/AnimateIn';

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="min-h-screen bg-black grid grid-cols-1 md:grid-cols-2">
        <div style={{padding: '140px 60px 80px 60px'}} className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-12 h-px bg-[#C94F2C]"></div>
            <span className="text-xs tracking-widest uppercase text-[#C94F2C] font-semibold">Greater Noida's Premier Interior Studio</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-7xl font-light italic text-white leading-tight mb-8"
          >
            Spaces That<br/>Feel Like<br/><b className="not-italic font-bold text-[#E8A87C]">You.</b>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-sm font-light leading-relaxed text-white/50 max-w-sm mb-12"
          >
            From thoughtful makeovers to full luxury transformations — we design homes that genuinely reflect the people who live in them.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="flex items-center gap-6"
          >
            <Link href="/estimator"
              className="bg-[#C94F2C] text-white px-9 py-4 text-xs font-semibold tracking-widest uppercase hover:bg-[#E8A87C] hover:text-black transition-all">
              Estimate My Project →
            </Link>
            <Link href="/guide"
              className="text-xs font-medium tracking-wider uppercase text-white/40 border-b border-white/20 pb-px hover:text-white hover:border-white transition-all">
              Free Design Guide
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="flex gap-12 mt-16 pt-10 border-t border-white/10"
          >
            {[['200+','Homes Designed'],['5+','Years Experience'],['98%','Happy Clients']].map(([n,l], i) => (
              <motion.div key={l}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 + i * 0.15 }}
              >
                <div className="font-serif text-4xl font-light italic text-[#E8A87C]">{n}</div>
                <div className="text-xs tracking-widest uppercase text-white/30 mt-1">{l}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="hidden md:block relative overflow-hidden"
        >
          <img src="https://corelaneinteriors.com/wp-content/uploads/2026/02/pexels-photo-3356416.jpeg"
            alt="Luxury interior" className="w-full h-full object-cover brightness-75"/>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="absolute bottom-10 left-0 bg-white px-7 py-5"
          >
            <div className="font-serif text-3xl font-bold text-[#C94F2C]">2021</div>
            <div className="text-xs text-gray-400 mt-1">Est. in Greater Noida</div>
          </motion.div>
        </motion.div>
      </section>

      {/* MARQUEE */}
      <div className="bg-[#C94F2C] py-4 overflow-hidden whitespace-nowrap">
        <div className="inline-flex animate-marquee">
          {['Custom Furniture','Space Planning','Color Consultation','Full Home Interiors','Modular Kitchens','Lighting Design','Décor & Styling',
            'Custom Furniture','Space Planning','Color Consultation','Full Home Interiors','Modular Kitchens','Lighting Design','Décor & Styling'].map((item, i) => (
            <span key={i} className="text-white text-xs font-semibold tracking-widest uppercase px-10">
              {item} <span className="text-white/30 mx-1">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* BUDGET */}
      <section id="budget" className="py-24 px-6 md:px-16 bg-[#F8F6F3]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <SlideLeft>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-px bg-[#C94F2C]"></div>
                  <span className="text-xs tracking-widest uppercase text-[#C94F2C] font-semibold">Homes for Every Budget</span>
                </div>
                <h2 className="font-serif text-5xl font-light italic">The Right Design,<br/>At <b className="not-italic font-bold">Your</b> Price</h2>
              </div>
            </SlideLeft>
            <SlideRight>
              <p className="text-sm text-gray-400 max-w-xs leading-relaxed">All prices are for a complete 1BHK interior. Final cost varies based on size and scope of work.</p>
            </SlideRight>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200">
            {[
              { tier:'Essential', price:'₹3.75L', per:'per 1BHK · starting from', name:'Smart Starter', desc:'Complete 1BHK interior with smart material choices and maximum design impact.', features:['Space planning & layout','Paint & wall treatment','Standard furniture','Basic lighting','1 design revision'], dark:false },
              { tier:'Standard',  price:'₹7L',    per:'per 1BHK · starting from', name:'Comfort Living', desc:'Complete 1BHK with quality finishes, branded materials and a full design plan.', features:['Full interior design plan','Premium finishes','Custom furniture options','Mood lighting & décor','3 design revisions'], dark:true },
              { tier:'Premium',   price:'₹12L',   per:'per 1BHK · starting from', name:'Luxury Signature', desc:'Complete 1BHK with premium imported materials and bespoke custom design.', features:['Bespoke design concept','Imported materials','100% custom furniture','Full project management','Unlimited revisions'], dark:false },
            ].map(card => (
              <StaggerItem key={card.tier}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25 }}
                  className={`p-10 h-full ${card.dark ? 'bg-black text-white' : 'bg-white'}`}
                >
                  {card.dark && <div className="inline-block bg-[#C94F2C] text-white text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-6">Most Popular</div>}
                  <div className={`text-xs tracking-widest uppercase font-bold mb-6 ${card.dark ? 'text-[#E8A87C]' : 'text-gray-400'}`}>{card.tier}</div>
                  <div className={`font-serif text-5xl font-light italic mb-1 ${card.dark ? 'text-[#E8A87C]' : 'text-black'}`}>{card.price}</div>
                  <div className={`text-xs mb-6 ${card.dark ? 'text-white/40' : 'text-gray-400'}`}>{card.per}</div>
                  <div className={`h-px mb-6 ${card.dark ? 'bg-white/10' : 'bg-gray-100'}`}></div>
                  <h3 className={`font-serif text-2xl mb-3 ${card.dark ? 'text-white' : 'text-black'}`}>{card.name}</h3>
                  <p className={`text-sm leading-relaxed mb-6 ${card.dark ? 'text-white/40' : 'text-gray-400'}`}>{card.desc}</p>
                  <ul className="space-y-2">
                    {card.features.map(f => (
                      <li key={f} className={`text-xs flex gap-3 pb-2 border-b ${card.dark ? 'text-white/40 border-white/10' : 'text-gray-400 border-gray-100'}`}>
                        <span className="text-[#C94F2C]">—</span>{f}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="bg-black py-24 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <SlideLeft>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-px bg-[#E8A87C]"></div>
                  <span className="text-xs tracking-widest uppercase text-[#E8A87C] font-semibold">What We Offer</span>
                </div>
                <h2 className="font-serif text-5xl font-light italic text-white">Every Service<br/>Your <b className="not-italic font-bold">Home</b> Needs</h2>
              </div>
            </SlideLeft>
            <FadeIn delay={0.3}>
              <Link href="/services" className="text-xs tracking-widest uppercase text-white/30 hover:text-white transition-colors">All Services →</Link>
            </FadeIn>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
            {[
              { n:'01', icon:'🪑', title:'Custom Furniture',    desc:'Bespoke pieces crafted to your exact dimensions, style and budget.' },
              { n:'02', icon:'📐', title:'Space Planning',      desc:'Smart layouts that maximise every square foot.' },
              { n:'03', icon:'🎨', title:'Color Consultation',  desc:'Expert palettes that set the perfect mood for each room.' },
              { n:'04', icon:'💡', title:'Lighting Design',     desc:'Layered ambient, task and accent plans for any time of day.' },
              { n:'05', icon:'🏠', title:'Full Home Interiors', desc:'Complete end-to-end transformation, one unified vision.' },
              { n:'06', icon:'🪴', title:'Décor & Styling',     desc:'Art, accessories and textiles — the finishing touches.' },
            ].map(s => (
              <StaggerItem key={s.n}>
                <div className="bg-black p-12 group hover:bg-white/5 transition-colors h-full">
                  <div className="font-serif text-6xl font-light text-white/5 mb-6 italic">{s.n}</div>
                  <motion.div
                    whileHover={{ scale: 1.08, borderColor: '#C94F2C' }}
                    className="text-2xl mb-6 w-11 h-11 border border-white/10 flex items-center justify-center rounded-sm"
                  >{s.icon}</motion.div>
                  <h3 className="font-serif text-xl text-white mb-3">{s.title}</h3>
                  <p className="text-sm text-white/30 leading-relaxed">{s.desc}</p>
                  <span className="text-[#C94F2C] mt-6 block opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">→</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* FOUNDER TEASER */}
      <section className="py-24 px-6 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <SlideLeft>
            <div className="relative">
              <img src="/images/vinod.jpeg" alt="Vinod Chauhan"
                className="w-full aspect-[3/4] object-cover object-top rounded-sm grayscale-[10%]"/>
              <div className="absolute top-8 left-0 bg-[#C94F2C] text-white px-5 py-2 text-xs font-bold tracking-widest uppercase">
                Founder & Principal Designer
              </div>
            </div>
          </SlideLeft>

          <SlideRight>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px bg-[#C94F2C]"></div>
                <span className="text-xs tracking-widest uppercase text-[#C94F2C] font-semibold">The Man Behind It All</span>
              </div>
              <h2 className="font-serif text-6xl font-light italic mb-2">Vinod<br/>Chauhan</h2>
              <div className="text-xs tracking-widest uppercase text-[#C94F2C] font-semibold mb-8">Founder · Core Lane Interiors</div>
              <blockquote className="font-serif text-2xl font-light italic text-black leading-relaxed border-l-2 border-[#E8A87C] pl-6 mb-8">
                "Every home has a story waiting to be told. I just help it speak."
              </blockquote>
              <p className="text-sm text-gray-400 leading-relaxed mb-10">
                Vinod Chauhan founded Core Lane Interiors with a conviction that good design should reach every Indian household. Over five years, he's led 200+ home transformations across Delhi NCR and Greater Noida.
              </p>
              <StaggerContainer className="grid grid-cols-2 gap-3 mb-10">
                {[
                  { icon:'✦', title:'Honest Pricing',     desc:'No hidden costs. What we quote is what you pay.' },
                  { icon:'⏱', title:'On-Time Delivery',   desc:'We respect your time and keep our deadlines.' },
                  { icon:'◈', title:'Quality Materials',  desc:'Verified, durable materials at every price point.' },
                  { icon:'∞', title:'After-Sales Support',desc:"Our relationship doesn't end at handover." },
                ].map(v => (
                  <StaggerItem key={v.title}>
                    <motion.div
                      whileHover={{ borderColor: '#C94F2C', y: -2 }}
                      className="p-5 border border-gray-100 transition-colors"
                    >
                      <div className="text-lg mb-2">{v.icon}</div>
                      <h4 className="text-sm font-semibold mb-1">{v.title}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">{v.desc}</p>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
              <Link href="/founder" className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#C94F2C] hover:gap-4 transition-all">
                Read Full Story →
              </Link>
            </div>
          </SlideRight>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6 md:px-16 bg-[#F8F6F3]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          <SlideLeft>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px bg-[#C94F2C]"></div>
                <span className="text-xs tracking-widest uppercase text-[#C94F2C] font-semibold">Client Stories</span>
              </div>
              <h2 className="font-serif text-4xl font-light italic">What Our<br/>Clients <b className="not-italic font-bold">Say</b></h2>
            </div>
          </SlideLeft>
          <StaggerContainer className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { stars:5, quote:'"Core Lane Interiors transformed my home into a beautiful oasis. Their attention to detail is truly unparalleled."', name:'Garvit Kumar', meta:'2BHK Full Interior · Greater Noida', img:'https://corelaneinteriors.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-03-at-15.20.58-1.jpeg' },
              { stars:5, quote:"\"I couldn't be happier with my new living room. The team's creativity made the whole process genuinely enjoyable.\"", name:'Bhavna Mehra', meta:'Living Room · Delhi NCR', img:'https://corelaneinteriors.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-03-at-15.22.11.jpeg' },
            ].map(t => (
              <StaggerItem key={t.name}>
                <motion.div
                  whileHover={{ y: -4, borderColor: '#C94F2C' }}
                  className="bg-white p-8 border border-gray-100 transition-colors h-full"
                >
                  <div className="text-[#C94F2C] tracking-widest mb-4">{'★'.repeat(t.stars)}</div>
                  <p className="font-serif text-lg font-light italic leading-relaxed text-black mb-6">{t.quote}</p>
                  <div className="flex items-center gap-3">
                    <img src={t.img} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-gray-100"/>
                    <div>
                      <div className="text-sm font-semibold">{t.name}</div>
                      <div className="text-xs text-gray-400">{t.meta}</div>
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* GALLERY */}
      <section className="py-24 px-6 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <SlideLeft>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-px bg-[#C94F2C]"></div>
                  <span className="text-xs tracking-widest uppercase text-[#C94F2C] font-semibold">Our Projects</span>
                </div>
                <h2 className="font-serif text-4xl font-light italic">Recent <b className="not-italic font-bold">Work</b></h2>
              </div>
            </SlideLeft>
            <FadeIn delay={0.2}>
              <Link href="/gallery" className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#C94F2C] hover:gap-4 transition-all">
                View All →
              </Link>
            </FadeIn>
          </div>
          <FadeUp>
            <div className="grid grid-cols-3 grid-rows-2 gap-1" style={{height:'560px'}}>
              <div className="row-span-2 overflow-hidden group relative">
                <img src="https://corelaneinteriors.com/wp-content/uploads/2026/02/pexels-photo-6032416.jpeg" alt="Project"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                  <span className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-all">+</span>
                </div>
              </div>
              {[
                'https://corelaneinteriors.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-06-at-14.42.27.jpeg',
                'https://corelaneinteriors.com/wp-content/uploads/2026/02/pexels-photo-1643384.jpeg',
                'https://corelaneinteriors.com/wp-content/uploads/2026/02/pexels-photo-1643383.jpeg',
                'https://corelaneinteriors.com/wp-content/uploads/2026/02/pexels-photo-3356416.jpeg',
              ].map((src, i) => (
                <div key={i} className="overflow-hidden group relative">
                  <img src={src} alt={`Project ${i+2}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                    <span className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-all">+</span>
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#C94F2C] py-20 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <FadeUp>
            <h2 className="font-serif text-5xl font-light italic text-white">
              Ready to Build<br/>Your Dream <b className="not-italic font-bold">Home?</b>
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <div className="flex flex-col items-end gap-4">
              <p className="text-sm text-white/60 max-w-xs text-right leading-relaxed">
                Book a free 30-minute consultation. No commitment — just great ideas.
              </p>
              <Link href="/contact"
                className="bg-white text-[#C94F2C] px-10 py-4 text-xs font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-all">
                Book Free Consult →
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}