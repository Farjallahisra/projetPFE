import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, GraduationCap, UserCheck, UserMinus } from 'lucide-react';
import API from '../api/axios';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const r = await API.get('/api/students');
        setStudents(r.data?.students || r.data || []);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchStudents();
  }, []);

  const filtered = students.filter(s => 
    (s.nom || '').toLowerCase().includes(search.toLowerCase()) || 
    (s.classe || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Élèves</h1>
          <p className="text-slate-500 mt-1">Gestion de la liste des inscrits au transport</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-100">
          <Plus size={20} /> Nouveau Profil
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl mb-6 shadow-sm border border-slate-100 flex items-center gap-3">
        <Search className="text-slate-400" size={20} />
        <input 
          type="text" placeholder="Rechercher un élève ou une classe..." 
          className="flex-1 outline-none text-slate-600 font-medium"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-50">
              <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Élève</th>
              <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Classe</th>
              <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Statut</th>
              <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((s) => (
              <tr key={s._id} className="hover:bg-slate-50/30 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                      {s.nom?.charAt(0)}
                    </div>
                    <span className="font-bold text-slate-700">{s.nom}</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-slate-500 font-medium">{s.classe}</td>
                <td className="px-8 py-5">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${s.est_present ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {s.est_present ? <UserCheck size={14}/> : <UserMinus size={14}/>}
                    {s.est_present ? 'Présent' : 'Absent'}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                      <Edit2 size={18} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}