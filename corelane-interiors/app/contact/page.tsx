'use client';
import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setSuccess(true);
      setForm({ name: '', phone: '', email: '', message: '' });
    } catch (err) {
      alert('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <section className="bg-black py-32 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#C94F2C]"></div>
            <span className="text-xs tracking-widest uppercase text-[#C94F2C] font-semibold">Get In Touch</span>
          </div>
          <h1 className="font-serif text-6xl font-light italic text-white">
            Let's Build Your<br/><b className="not-italic font-bold text-[#E8A87C]">Dream Home</b>
          </h1>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-24 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20">
          
          {/* LEFT INFO */}
          <div>
            <h2 className="font-serif text-3xl font-light italic mb-6">We'd love to hear<br/>from you</h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-12">
              Whether you're planning a single room refresh or a complete home transformation — reach out and let's talk. First consultation is always free.
            </p>

            <div className="space-y-8">
              {[
                { icon: '📍', label: 'Location', value: 'Greater Noida, Uttar Pradesh' },
                { icon: '🕐', label: 'Working Hours', value: 'Mon – Sat, 10am – 7pm' },
                { icon: '🌐', label: 'Website', value: 'corelaneinteriors.com' },
              ].map(item => (
                <div key={item.label} className="flex gap-4 items-start">
                  <div className="w-10 h-10 border border-gray-100 flex items-center justify-center text-lg flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-xs tracking-widest uppercase text-gray-400 font-semibold mb-1">{item.label}</div>
                    <div className="text-sm font-medium">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 p-8 bg-[#F8F6F3] border-l-2 border-[#C94F2C]">
              <div className="font-serif text-lg italic mb-2">"Every home has a story waiting to be told."</div>
              <div className="text-xs text-gray-400">— Vinod Chauhan, Founder</div>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div>
            {success ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20">
                <div className="text-5xl mb-6">🎉</div>
                <h3 className="font-serif text-3xl font-light italic mb-4">Thank You!</h3>
                <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                  We've received your message and will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-8 text-xs tracking-widest uppercase text-[#C94F2C] font-semibold hover:underline">
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {[
                  { name: 'name',    label: 'Full Name',     type: 'text',  required: true  },
                  { name: 'phone',   label: 'Phone Number',  type: 'tel',   required: true  },
                  { name: 'email',   label: 'Email Address', type: 'email', required: false },
                ].map(field => (
                  <div key={field.name}>
                    <label className="block text-xs tracking-widest uppercase text-gray-400 font-semibold mb-2">
                      {field.label} {field.required && <span className="text-[#C94F2C]">*</span>}
                    </label>
                    <input
                      type={field.type}
                      required={field.required}
                      value={form[field.name as keyof typeof form]}
                      onChange={e => setForm({ ...form, [field.name]: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-[#C94F2C] transition-colors bg-[#F8F6F3]"
                      placeholder={`Enter your ${field.label.toLowerCase()}`}
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-xs tracking-widest uppercase text-gray-400 font-semibold mb-2">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-[#C94F2C] transition-colors bg-[#F8F6F3] resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-4 text-xs font-bold tracking-widest uppercase hover:bg-[#C94F2C] transition-colors disabled:opacity-50">
                  {loading ? 'Sending...' : 'Send Message →'}
                </button>

                <p className="text-xs text-gray-400 text-center">
                  We'll get back to you within 24 hours
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}