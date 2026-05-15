'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 w-full z-50 bg-white border-b border-gray-100 transition-all duration-300 ${
      scrolled ? 'py-2 shadow-sm' : 'py-3'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/">
          <img
            src="/images/logo.jpeg"
            alt="Core Lane Interiors"
            style={{ height: '48px', width: 'auto', objectFit: 'contain' }}
          />
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-8 list-none">
          {[
            { label: 'Packages',  href: '/#budget' },
            { label: 'Services',  href: '/#services' },
            { label: 'Estimate',  href: '/estimator' },
            { label: 'Our Story', href: '/founder' },
            { label: 'Gallery',   href: '/gallery' },
          ].map(link => (
            <li key={link.href}>
              <Link href={link.href}
                className="text-xs font-medium tracking-widest uppercase text-gray-500 hover:text-[#C94F2C] transition-colors">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/contact"
            className="bg-[#C94F2C] text-white text-xs font-semibold tracking-widest uppercase px-6 py-3 rounded-sm hover:bg-black transition-colors">
            Free Consult
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-700" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          {[
            { label: 'Packages',  href: '/#budget' },
            { label: 'Services',  href: '/#services' },
            { label: 'Estimate',  href: '/estimator' },
            { label: 'Our Story', href: '/founder' },
            { label: 'Gallery',   href: '/gallery' },
            { label: 'Contact',   href: '/contact' },
          ].map(link => (
            <Link key={link.href} href={link.href}
              className="text-sm text-gray-600 hover:text-[#C94F2C]"
              onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}