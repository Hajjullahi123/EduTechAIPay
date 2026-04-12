import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Mail, Lock, Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import EduTechLogo from '../components/EduTechLogo';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

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
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <button onClick={() => navigate('/')} className="mb-8 p-3 rounded-full hover:bg-white transition-colors text-slate-400 hover:text-primary">
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex justify-center mb-8">
                        <EduTechLogo size={80} className="hover:scale-105 transition-transform duration-500" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
                    <p className="text-slate-500 font-medium mt-2">Sign in to your administrative dashboard</p>
                </div>

                <div className="glass-card p-10 sophisticated-shadow bg-white">
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
                            <div className="px-4 py-3 bg-rose-50 border border-rose-100 text-rose-500 rounded-xl text-xs font-bold text-center">
                                {error}
                            </div>
                        )}

                        <button 
                            disabled={loading}
                            type="submit" 
                            className="btn-primary w-full"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Secure Authorization'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Authorized Personnel Only &bull; 256-Bit Encrypted
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
