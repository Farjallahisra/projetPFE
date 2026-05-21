// ═══════════════════════════════════════════════════════
// DriversPage.jsx (CORRIGÉ)
// ═══════════════════════════════════════════════════════
import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Save, Truck } from 'lucide-react';
import API from '../api/axios';

// Ajout de la clé cinNumber requise par le backend
const EMPTY_D = { username: '', phoneNumber: '', email: '', cinNumber: '', vehicule: '' };

export function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [search,  setSearch]  = useState('');
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState(EMPTY_D);
  const [editing, setEditing] = useState(null);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');

  const fetch = async () => {
    setLoading(true);
    try {
      const r = await API.get('/api/drivers');
      setDrivers(r.data?.drivers || r.data || []);
    } catch {} finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, []);

  // Gestion de la recherche compatible avec 'username' ou 'name' ou 'nom'
  const filtered = drivers.filter(d =>
    (d.username || d.nom || d.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setForm(EMPTY_D); setEditing(null); setError(''); setModal(true); };
  
  const openEdit = d => {
    setForm({ 
      username: d.username || d.nom || d.name || '', 
      phoneNumber: d.phoneNumber || d.telephone || '',
      email: d.email || '', 
      cinNumber: d.cinNumber || '',
      vehicule: d.vehicule || '' 
    });
    setEditing(d._id); setError(''); setModal(true);
  };

  const handleSave = async () => {
    if (!form.username.trim()) { setError('Nom complet obligatoire'); return; }
    if (!form.email.trim()) { setError('Email obligatoire'); return; }
    if (!form.phoneNumber.trim()) { setError('Téléphone obligatoire'); return; }
    if (!form.cinNumber.trim()) { setError('Numéro CIN obligatoire'); return; }
    
    setSaving(true);
    setError('');
    try {
      // Les données sont maintenant parfaitement structurées pour le backend
      editing ? await API.put(`/api/drivers/${editing}`, form)
              : await API.post('/api/drivers', form);
      setModal(false); fetch();
    } catch (e) { 
      setError(e.response?.data?.message || 'Erreur lors de l\'enregistrement'); 
    } finally { setSaving(false); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Supprimer ce conducteur ?')) return;
    await API.delete(`/api/drivers/${id}`).catch(() => {});
    fetch();
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Conducteurs</h1>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700
            text-white px-4 py-2 rounded-xl text-sm font-medium transition">
          <Plus size={15} /> Ajouter
        </button>
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-2.5 text-gray-400" />
        <input type="text" placeholder="Rechercher un conducteur..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl
            text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <p className="text-center py-10 text-gray-400 text-sm">Chargement...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center py-10 text-gray-400 text-sm italic">
            Aucun conducteur trouvé.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wide">
                <th className="px-5 py-3">Nom</th>
                <th className="px-5 py-3">CIN</th>
                <th className="px-5 py-3">Téléphone</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Bus assigné</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((d, i) => (
                <tr key={d._id || i} className="hover:bg-gray-50 group transition">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center
                        justify-center text-orange-700 text-xs font-bold">
                        {(d.username || d.nom || d.name || 'C').slice(0,1).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-800">
                        {d.username || d.nom || d.name || '—'}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-500 font-mono text-xs">
                    {d.cinNumber || '—'}
                  </td>
                  <td className="px-5 py-3 text-gray-500 font-mono text-xs">
                    {d.phoneNumber || d.telephone || '—'}
                  </td>
                  <td className="px-5 py-3 text-gray-500">{d.email || '—'}</td>
                  <td className="px-5 py-3 text-gray-500">{d.vehicule || '—'}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2 opacity-0
                      group-hover:opacity-100 transition">
                      <button onClick={() => openEdit(d)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400
                          hover:text-blue-600 transition">
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => handleDelete(d._id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400
                          hover:text-red-500 transition">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center
          justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4
              border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-blue-600" />
                <h3 className="font-semibold text-gray-800">
                  {editing ? 'Modifier' : 'Ajouter un conducteur'}
                </h3>
              </div>
              <button onClick={() => setModal(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400">
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3
                  rounded-xl">{error}</div>
              )}
              {[
                { k:'username',    l:'Nom complet *',      p:'Mohamed Ali' },
                { k:'cinNumber',   l:'Numéro CIN *',       p:'07XXXXXX' },
                { k:'phoneNumber', l:'Téléphone *',        p:'+216 XX XXX XXX' },
                { k:'email',       l:'Email *',            p:'driver@ipts.tn' },
                { k:'vehicule',    l:'Bus assigné',        p:'TU-123-TU' },
              ].map(f => (
                <div key={f.k}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {f.l}
                  </label>
                  <input type="text" placeholder={f.p}
                    value={form[f.k] || ''}
                    onChange={e => setForm({ ...form, [f.k]: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl
                      text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              ))}
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl
                  text-sm text-gray-600 hover:bg-gray-50">
                Annuler
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 flex items-center justify-center gap-2
                  bg-blue-600 hover:bg-blue-700 text-white px-4 py-2
                  rounded-xl text-sm font-medium disabled:opacity-60">
                <Save size={13} />
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DriversPage;