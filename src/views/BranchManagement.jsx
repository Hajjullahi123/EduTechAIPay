import { useState, useEffect } from 'react';
import { Building2, Plus, MapPin, Phone, Mail, Loader2, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

const BranchManagement = () => {
    const { token } = useAuth();
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', address: '', phone: '', email: '' });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetch(`${API_BASE}/branches`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            setBranches(Array.isArray(data) ? data : []);
            setLoading(false);
        })
        .catch(() => setLoading(false));
    }, [token]);

    const handleCreateBranch = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch(`${API_BASE}/branches`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setBranches([...branches, data]);
            setShowModal(false);
            setFormData({ name: '', address: '', phone: '', email: '' });
        } catch (err) {
            alert(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className="p-20 text-center font-black uppercase tracking-[4px] text-slate-400 animate-pulse">Loading Branch Matrix...</div>;

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Branch Management</h1>
                    <p className="text-slate-500 font-medium mt-2">Create and oversee your institutional locations</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)} 
                    className="px-8 py-4 bg-primary-600 rounded-2xl text-white font-black uppercase text-[11px] tracking-[2px] hover:bg-primary-500 transition-all shadow-xl shadow-primary-500/20 flex items-center gap-3 active:scale-95"
                >
                    <Plus size={18} /> Add New Branch
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {branches.map((branch) => (
                    <div key={branch.id} className="bg-white rounded-[32px] p-8 sophisticated-shadow border border-slate-100 hover:border-primary/30 transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                        
                        <div className="relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                                <Building2 size={28} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2 truncate">{branch.name}</h3>
                            <div className="space-y-3 mb-8">
                                <p className="text-xs text-slate-500 font-bold flex items-center gap-2"><MapPin size={14} className="text-slate-300" /> {branch.address || 'Location Unspecified'}</p>
                                <p className="text-xs text-slate-500 font-bold flex items-center gap-2"><Phone size={14} className="text-slate-300" /> {branch.phone || 'N/A'}</p>
                                <p className="text-xs text-slate-500 font-bold flex items-center gap-2"><Mail size={14} className="text-slate-300" /> {branch.email || 'N/A'}</p>
                            </div>
                            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Node Active</span>
                                </div>
                                <button className="text-primary hover:text-primary-600 transition-colors">
                                    <ArrowUpRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xl z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[40px] w-full max-w-xl p-12 sophisticated-shadow animate-in zoom-in-95 duration-400 relative">
                        <button onClick={() => setShowModal(false)} className="absolute right-8 top-8 p-2 text-slate-400 hover:text-slate-900 transition-colors">
                            <Plus size={24} className="rotate-45" />
                        </button>
                        <div className="mb-10">
                            <h2 className="text-3xl font-black text-slate-900">Provision New Branch</h2>
                            <p className="text-slate-500 font-medium mt-1">Deploy a new institutional node to your organization</p>
                        </div>
                        <form onSubmit={handleCreateBranch} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Branch Name</label>
                                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="e.g. North Side Campus" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Address</label>
                                <input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Enter physical location" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</label>
                                    <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="+234..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</label>
                                    <input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="branch@school.edu" />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
                                <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-primary-600 rounded-2xl text-white font-black uppercase text-xs tracking-widest hover:bg-primary-500 transition-all flex items-center justify-center gap-3 glow-button">
                                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                                    Deploy Node
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BranchManagement;
