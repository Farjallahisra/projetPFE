import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Save, Bus } from 'lucide-react';
import API from '../api/axios';

const EMPTY = { matricule: '', marque: '', capacite: '', statut: 'actif' };

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [search,   setSearch]   = useState('');
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);
  const [form,     setForm]     = useState(EMPTY);
  const [editing,  setEditing]  = useState(null);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');

  const fetch = async () => {
    setLoading(true);
    try {
      const r = await API.get('/api/vehicles');
      setVehicles(r.data?.vehicles || r.data || []);
    } catch {} finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, []);

  const filtered = vehicles.filter(v =>
    (v.matricule||'').toLowerCase().includes(search.toLowerCase()) ||
    (v.marque||'').toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setForm(EMPTY); setEditing(null); setError(''); setModal(true); };
  const openEdit = v => {
    setForm({ matricule: v.matricule||'', marque: v.marque||'',
      capacite: v.capacite||'', statut: v.statut||'actif' });
    setEditing(v._id); setError(''); setModal(true);
  };
  const handleSave = async () => {
    if (!form.matricule.trim()) { setError('Matricule obligatoire'); return; }
    setSaving(true);
    try {
      editing ? await API.put(`/api/vehicles/${editing}`, form)
              : await API.post('/api/vehicles', form);
      setModal(false); fetch();
    } catch (e) { setError(e.response?.data?.message || 'Erreur'); }
    finally { setSaving(false); }
  };
  const handleDelete = async id => {
    if (!window.confirm('Supprimer ?')) return;
    await API.delete(`/api/vehicles/${id}`).catch(() => {});
    fetch();
  };

  const statusColors = {
    actif:        'bg-green-100 text-green-700',
    inactif:      'bg-gray-100 text-gray-500',
    maintenance:  'bg-orange-100 text-orange-700',
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Gestion des bus</h1>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700
            text-white px-4 py-2 rounded-xl text-sm font-medium transition">
          <Plus size={15} /> Ajouter
        </button>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { l: 'Total',        v: vehicles.length,
            bg: 'bg-blue-500' },
          { l: 'Actifs',       v: vehicles.filter(v=>v.statut==='actif').length,
            bg: 'bg-green-500' },
          { l: 'Maintenance',  v: vehicles.filter(v=>v.statut==='maintenance').length,
            bg: 'bg-orange-500' },
        ].map(s => (
          <div key={s.l} className={`${s.bg} rounded-2xl p-4 text-white text-center`}>
            <p className="text-3xl font-bold">{s.v}</p>
            <p className="text-xs mt-1 opacity-90">{s.l}</p>
          </div>
        ))}
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-2.5 text-gray-400" />
        <input type="text" placeholder="Rechercher..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl
            text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <p className="text-center py-10 text-gray-400 text-sm">Chargement...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center py-10 text-gray-400 text-sm italic">
            Aucun véhicule.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wide">
                <th className="px-5 py-3">Matricule</th>
                <th className="px-5 py-3">Marque</th>
                <th className="px-5 py-3">Capacité</th>
                <th className="px-5 py-3">Statut</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((v, i) => (
                <tr key={v._id || i} className="hover:bg-gray-50 group transition">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center
                        justify-center">
                        <Bus size={16} className="text-blue-600" />
                      </div>
                      <span className="font-mono font-medium text-gray-800">
                        {v.matricule || '—'}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{v.marque || '—'}</td>
                  <td className="px-5 py-3 text-gray-500">
                    {v.capacite ? `${v.capacite} places` : '—'}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                      ${statusColors[v.statut] || statusColors.inactif}`}>
                      {v.statut || 'inactif'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2 opacity-0
                      group-hover:opacity-100 transition">
                      <button onClick={() => openEdit(v)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400
                          hover:text-blue-600 transition">
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => handleDelete(v._id)}
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
                <Bus size={16} className="text-blue-600" />
                <h3 className="font-semibold text-gray-800">
                  {editing ? 'Modifier' : 'Ajouter un bus'}
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
                { k:'matricule', l:'Matricule *', p:'TU-123-TU' },
                { k:'marque',    l:'Marque',       p:'Mercedes Sprinter' },
                { k:'capacite',  l:'Capacité',      p:'40', t:'number' },
              ].map(f => (
                <div key={f.k}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {f.l}
                  </label>
                  <input type={f.t||'text'} placeholder={f.p}
                    value={form[f.k]}
                    onChange={e => setForm({ ...form, [f.k]: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl
                      text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Statut
                </label>
                <select value={form.statut}
                  onChange={e => setForm({ ...form, statut: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl
                    text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                  <option value="maintenance">En maintenance</option>
                </select>
              </div>
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