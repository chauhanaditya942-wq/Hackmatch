import { Fraunces, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata = {
  title: "Core Lane Interiors — Greater Noida's Premier Interior Studio",
  description: 'Transforming homes across Delhi NCR with warmth, quality and honest design.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${outfit.variable} font-sans bg-white overflow-x-hidden`}>
        <Navbar />
        <main className="pt-[70px] overflow-x-hidden">{children}</main>
        <Footer />
      </body>
    </html>
  );
}