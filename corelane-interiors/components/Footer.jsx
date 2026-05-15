import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white px-6 py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div>
          <div className="font-serif text-xl font-bold mb-4">
            Core <span className="text-[#E8A87C]">Lane</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">
            Transforming homes across Delhi NCR and Ghaziabad with warmth, quality and honest design since 2021.
          </p>
          <p className="text-xs text-gray-600">📍 Ghaziabad, Uttar Pradesh</p>
        </div>
        <div>
          <h5 className="text-xs tracking-widest uppercase font-bold mb-4">Pages</h5>
          {['/', '/about', '/services', '/gallery', '/contact'].map((href, i) => (
            <Link key={href} href={href}
              className="block text-sm text-gray-400 hover:text-[#E8A87C] mb-2 transition-colors">
              {['Home','About','Services','Gallery','Contact'][i]}
            </Link>
          ))}
        </div>
        <div>
          <h5 className="text-xs tracking-widest uppercase font-bold mb-4">Services</h5>
          {['Custom Furniture','Space Planning','Color Consultation','Lighting Design','Full Home Interiors'].map(s => (
            <p key={s} className="text-sm text-gray-400 mb-2">{s}</p>
          ))}
        </div>
        <div>
          <h5 className="text-xs tracking-widest uppercase font-bold mb-4">Contact</h5>
          <Link href="/contact" className="block text-sm text-gray-400 hover:text-[#E8A87C] mb-2">Get in Touch</Link>
          <Link href="/estimator" className="block text-sm text-gray-400 hover:text-[#E8A87C] mb-2">Price Estimator</Link>
          <Link href="/founder" className="block text-sm text-gray-400 hover:text-[#E8A87C] mb-2">Our Story</Link>
          <p className="text-xs text-gray-600 mt-4">Mon – Sat, 10am – 7pm</p>
        </div>
      </div>
      <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between text-xs text-gray-600">
        <span>© 2026 Core Lane Interiors · All rights reserved</span>
        <span>Made with care in Ghaziabad</span>
      </div>
    </footer>
  );
}