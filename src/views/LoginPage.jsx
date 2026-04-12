import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Mail, Lock, Loader2, ArrowLeft, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import EduTechLogo from '../components/EduTechLogo';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isInitialized, setIsInitialized] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        fetch(`${API_BASE}/system/status`)
            .then(res => res.json())
            .then(data => setIsInitialized(data.isInitialized))
            .catch(() => setIsInitialized(true));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            login(data.token, data.user);
            
            if (data.user.role === 'SUPER_ADMIN') {
                navigate('/super-admin');
            } else if (data.user.role === 'SCHOOL_ADMIN' && data.schoolCount === 0) {
                // If they have no branches yet, send them to manage branches
                navigate('/manage-branches');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-pattern">
            <div className="w-full max-w-sm space-y-8">
                <div className="text-center">
                    <button onClick={() => navigate('/')} className="mb-4 p-3 rounded-full hover:bg-white transition-colors text-slate-400 hover:text-primary">
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex justify-center mb-6">
                        <EduTechLogo size={70} className="hover:scale-105 transition-transform duration-500" />
                    </div>
                </div>

                {!isInitialized ? (
                    <div className="glass-card p-10 sophisticated-shadow bg-white text-center space-y-6 border-t-4 border-primary">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
                            <ShieldCheck size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">System Initialization</h2>
                            <p className="text-slate-500 text-xs font-medium mt-2 leading-relaxed">No administrative accounts detected. Please establish the master governance credentials to begin deployment.</p>
                        </div>
                        <button 
                            onClick={() => navigate('/setup')}
                            className="btn-primary w-full shadow-2xl shadow-primary/20 flex items-center justify-center gap-3"
                        >
                            Initialize Master Account <ArrowRight size={18} />
                        </button>
                    </div>
                ) : (
                    <div className="glass-card p-10 sophisticated-shadow bg-white animate-in fade-in zoom-in-95 duration-500">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight text-center mb-2">Portal Access</h1>
                        <p className="text-slate-500 font-medium text-xs text-center mb-8 uppercase tracking-widest">Administrative Authorization</p>
                        
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                                <div className="relative">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="text"
                                        required
                                        className="input-field pl-14"
                                        placeholder="Enter your username"
                                        value={credentials.username}
                                        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="input-field pl-14"
                                        placeholder="••••••••"
                                        value={credentials.password}
                                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="px-4 py-3 bg-rose-50 border border-rose-100 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest text-center">
                                    {error}
                                </div>
                            )}

                            <button 
                                disabled={loading}
                                type="submit" 
                                className="btn-primary w-full shadow-xl shadow-primary/10"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : 'Execute Authorization'}
                            </button>
                        </form>
                    </div>
                )}

                <div className="text-center space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[4px]">
                        Elite Grade Security Protocol &bull; AES-256
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
