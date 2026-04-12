import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, User, Lock, ArrowRight, CheckCircle2, Rocket, Loader2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:3001/api';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        groupName: '',
        username: '',
        password: '',
        firstName: '',
        lastName: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            login(data.token, data.user);
            navigate('/super-admin'); // Go to global management for provisioning
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-pattern">
            <div className="w-full max-w-2xl space-y-8">
                <header className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gold flex items-center justify-center text-white mx-auto shadow-xl shadow-gold/20 mb-6">
                        <Rocket size={32} />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Provision Your Ecosystem</h1>
                    <p className="text-slate-500 font-medium mt-2">Deploy your multi-tenant financial command center in seconds</p>
                </header>

                <div className="glass-card p-12 sophisticated-shadow relative overflow-hidden bg-white">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
                        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(step/2)*100}%` }}></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {step === 1 ? (
                            <div className="space-y-6 animate-in slide-in-from-right-10 duration-500">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Organization Name</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input 
                                            type="text" 
                                            required
                                            className="input-field pl-14" 
                                            placeholder="e.g. Excellence Education Group"
                                            value={formData.groupName}
                                            onChange={e => setFormData({...formData, groupName: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin First Name</label>
                                        <input 
                                            type="text" 
                                            required
                                            className="input-field" 
                                            placeholder="Ahmad"
                                            value={formData.firstName}
                                            onChange={e => setFormData({...formData, firstName: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin Last Name</label>
                                        <input 
                                            type="text" 
                                            required
                                            className="input-field" 
                                            placeholder="Ibrahim"
                                            value={formData.lastName}
                                            onChange={e => setFormData({...formData, lastName: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <button type="button" onClick={() => setStep(2)} className="btn-primary w-full shadow-2xl">
                                    Continue to Credentials <ArrowRight size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-in slide-in-from-right-10 duration-500">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Super Admin Username</label>
                                    <div className="relative">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input 
                                            type="text" 
                                            required
                                            className="input-field pl-14" 
                                            placeholder="e.g. master_admin"
                                            value={formData.username}
                                            onChange={e => setFormData({...formData, username: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Master Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input 
                                            type="password" 
                                            required
                                            className="input-field pl-14" 
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={e => setFormData({...formData, password: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button type="button" onClick={() => setStep(1)} className="px-8 py-4 bg-slate-100 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all">Back</button>
                                    <button type="submit" disabled={loading} className="btn-primary flex-1 shadow-2xl">
                                        {loading ? <Loader2 className="animate-spin" /> : 'Launch Ecosystem'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                <div className="flex justify-center gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-2"><CheckCircle2 className="text-emerald-500" size={14} /> SOC2 Compliant</span>
                    <span className="flex items-center gap-2"><CheckCircle2 className="text-emerald-500" size={14} /> Multi-Region Sync</span>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
