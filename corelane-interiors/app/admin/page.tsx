'use client';
import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Lead {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  source: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [leads,   setLeads]   = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('All');
  const [search,  setSearch]  = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') fetchLeads();
  }, [status]);

  const fetchLeads = async () => {
    setLoading(true);
    const res  = await fetch('/api/leads');
    const data = await res.json();
    setLeads(data.leads || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchLeads();
  };

  const deleteLead = async (id: string) => {
    if (!confirm('Delete this lead?')) return;
    await fetch(`/api/leads/${id}`, { method: 'DELETE' });
    fetchLeads();
  };

  const filtered = leads.filter(l => {
    const matchFilter = filter === 'All' || l.status === filter || l.source === filter;
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search) || (l.email || '').toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const stats = {
    total:     leads.length,
    new:       leads.filter(l => l.status === 'New').length,
    called:    leads.filter(l => l.status === 'Called').length,
    converted: leads.filter(l => l.status === 'Converted').length,
  };

  if (status === 'loading') return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white/40 text-sm">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F6F3]">
      {/* TOP NAV */}
      <nav className="bg-black px-8 py-4 flex items-center justify-between">
        <div className="font-serif text-xl font-bold text-white">
          Core <span className="text-[#C94F2C]">Lane</span>
          <span className="text-white/30 text-sm font-sans font-normal ml-3">Admin</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-xs text-white/40">{session?.user?.email}</span>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="text-xs tracking-widest uppercase text-white/40 hover:text-white transition-colors">
            Sign Out
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-10">

        {/* STATS */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Leads',  value: stats.total,     color: 'text-black'       },
            { label: 'New',          value: stats.new,        color: 'text-blue-600'    },
            { label: 'Called',       value: stats.called,     color: 'text-yellow-600'  },
            { label: 'Converted',    value: stats.converted,  color: 'text-green-600'   },
          ].map(s => (
            <div key={s.label} className="bg-white border border-gray-100 p-6 rounded-sm">
              <div className={`font-serif text-4xl font-light italic ${s.color} mb-1`}>{s.value}</div>
              <div className="text-xs tracking-widest uppercase text-gray-400 font-semibold">{s.label}</div>
            </div>
          ))}
        </div>

        {/* FILTERS + SEARCH */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {['All','New','Called','Converted','Contact Form','Price Estimator','Guide Download'].map(f => (
              <button key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-xs font-semibold tracking-wide border transition-all ${
                  filter === f
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-400 border-gray-200 hover:border-black hover:text-black'
                }`}>
                {f}
              </button>
            ))}
          </div>
          <input
            type="text" value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, phone, email..."
            className="px-4 py-2 border border-gray-200 text-sm focus:outline-none focus:border-[#C94F2C] bg-white w-64"
          />
        </div>

        {/* TABLE */}
        <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-sm text-gray-400">Loading leads...</div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-sm text-gray-400">No leads found.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-[#F8F6F3]">
                  {['Name','Phone','Email','Source','Status','Date','Actions'].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-xs tracking-widest uppercase text-gray-400 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead, i) => (
                  <tr key={lead._id} className={`border-b border-gray-50 hover:bg-[#F8F6F3] transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                    <td className="px-6 py-4 text-sm font-semibold">{lead.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <a href={`tel:${lead.phone}`} className="hover:text-[#C94F2C]">{lead.phone}</a>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{lead.email || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        lead.source === 'Contact Form'    ? 'bg-blue-50 text-blue-600' :
                        lead.source === 'Price Estimator' ? 'bg-purple-50 text-purple-600' :
                        'bg-green-50 text-green-600'
                      }`}>{lead.source}</span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={lead.status}
                        onChange={e => updateStatus(lead._id, e.target.value)}
                        className={`text-xs font-semibold px-2 py-1 border rounded-sm cursor-pointer focus:outline-none ${
                          lead.status === 'New'       ? 'border-blue-200 text-blue-600 bg-blue-50' :
                          lead.status === 'Called'    ? 'border-yellow-200 text-yellow-600 bg-yellow-50' :
                          'border-green-200 text-green-600 bg-green-50'
                        }`}>
                        <option value="New">New</option>
                        <option value="Called">Called</option>
                        <option value="Converted">Converted</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      {new Date(lead.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteLead(lead._id)}
                        className="text-xs text-red-400 hover:text-red-600 transition-colors font-semibold">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-4 text-xs text-gray-400 text-right">
          Showing {filtered.length} of {leads.length} leads
        </div>
      </div>
    </div>
  );
}