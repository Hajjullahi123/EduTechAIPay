import { useNavigate } from 'react-router-dom';
import { Building2, ShieldCheck, Zap, ArrowRight, BarChart3, Users, Globe, Lock, Cpu, Star, Activity, Smartphone } from 'lucide-react';
import { useState, useEffect } from 'react';
import EduTechLogo from '../components/EduTechLogo';

const LandingPage = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallBtn, setShowInstallBtn] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);

        const handleBeforeInstall = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallBtn(true);
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstall);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setShowInstallBtn(false);
            setDeferredPrompt(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-primary-500/30 selection:text-primary-200 overflow-x-hidden relative font-['Outfit']">
            
            {/* Animated Dynamic Background */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-600/20 blur-[150px] rounded-full animate-pulse duration-[10000ms]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-gold/10 blur-[180px] rounded-full animate-bounce duration-[15000ms]"></div>
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-rose-500/10 blur-[120px] rounded-full animate-pulse duration-[8000ms]"></div>
                
                {/* Moving Grid Pattern */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay"></div>
                <div 
                    className="absolute inset-0 opacity-[0.03]" 
                    style={{ 
                        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, 
                        backgroundSize: '40px 40px',
                        transform: 'perspective(500px) rotateX(60deg) translateY(0)',
                        animation: 'gridMove 20s linear infinite'
                    }}
                ></div>
            </div>

            {/* Premium Navbar */}
            <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'py-4 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5' : 'py-8'}`}>
                <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
                    <div className="group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <EduTechLogo size={46} className="group-hover:scale-105 transition-transform duration-500 logo-white-text" />
                    </div>

                    <div className="hidden md:flex items-center gap-12">
                        {['Infrastructure', 'Security', 'Enterprise', 'Scalability'].map((link) => (
                            <a key={link} href="#" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors relative group">
                                {link}
                                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-6">
                        {showInstallBtn && (
                            <button onClick={handleInstall} className="md:hidden px-4 py-2 bg-primary-600/10 border border-primary-600/20 rounded-xl text-[9px] font-black uppercase tracking-widest text-primary-400 flex items-center gap-2 animate-pulse">
                                <Smartphone size={14} /> Install App
                            </button>
                        )}
                        <button onClick={() => navigate('/login')} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">Client Portal</button>
                        <button onClick={() => navigate('/login')} className="px-8 py-3 bg-white text-[#020617] rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary-500 hover:text-white transition-all shadow-2xl shadow-white/5 hover:scale-105 active:scale-95">Executive Login</button>
                    </div>
                </div>
            </nav>

            {/* Hero Interaction Layer */}
            <main className="relative z-10 pt-48 pb-32 px-8 flex flex-col items-center overflow-hidden">
                <div className="text-center max-w-6xl">
                    <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 shadow-xl">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[10px] font-black uppercase tracking-[3px] text-slate-300">V2.4 Protocol Online</span>
                        <div className="h-4 w-px bg-white/10 mx-2"></div>
                        <Star size={14} className="text-gold" />
                        <span className="text-[10px] font-black uppercase tracking-[3px] text-gold">Elite Performance</span>
                    </div>

                    <h1 className="text-7xl md:text-[140px] font-black tracking-tighter leading-[0.8] mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        Universal <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-indigo-200 to-primary-600 drop-shadow-[0_0_15px_rgba(14,165,233,0.3)]">Financial Command</span>
                    </h1>

                    <p className="max-w-3xl mx-auto text-xl md:text-2xl text-slate-400 font-medium leading-relaxed mb-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-400">
                        An elite, multi-tenant ecosystem precision-engineered for global education groups. Execute branch management, scholarship disbursement, and automated ledgers at enterprise scale.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
                        <button onClick={() => navigate('/login')} className="px-12 py-6 bg-primary-600 rounded-3xl font-black uppercase text-sm tracking-[3px] hover:bg-primary-500 transition-all shadow-[0_20px_50px_-10px_rgba(14,165,233,0.4)] hover:scale-105 active:scale-95 flex items-center gap-4 group">
                           Enter Secure Portal <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                        
                        {showInstallBtn ? (
                             <button onClick={handleInstall} className="px-12 py-6 bg-emerald-600/10 border border-emerald-500/30 rounded-3xl font-black uppercase text-sm tracking-[3px] hover:bg-emerald-600 hover:text-white transition-all shadow-2xl flex items-center gap-4 group animate-bounce-subtle">
                                Install Mobile PWA <Smartphone size={22} className="group-hover:scale-110 transition-transform" />
                             </button>
                        ) : (
                            <button className="px-12 py-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl font-black uppercase text-sm tracking-[3px] hover:bg-white/10 transition-all shadow-2xl flex items-center gap-4 group">
                               View Architecture <Globe size={20} className="group-hover:rotate-180 transition-all duration-1000" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Dashboard Preview "Moving" Component */}
                <div className="mt-32 w-full max-w-6xl relative group cursor-pointer animate-in fade-in slide-in-from-bottom-24 duration-1500 delay-700">
                    <div className="absolute inset-x-20 -top-10 h-32 bg-primary-500/20 blur-[100px] group-hover:bg-primary-500/40 transition-all duration-1000"></div>
                    <div className="relative rounded-[40px] border border-white/10 p-4 bg-slate-900/50 backdrop-blur-2xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden">
                        <div className="absolute inset-0 bg-white shadow-2xl shadow-primary-500/10 pointer-events-none"></div>
                        
                        {/* Simulated UI Content */}
                        <div className="bg-[#020617] rounded-[32px] p-8 border border-white/10">
                            <div className="h-6 w-full flex gap-2 mb-8 px-2 border-b border-white/5 pb-4">
                                <div className="w-3 h-3 rounded-full bg-rose-500/30"></div>
                                <div className="w-3 h-3 rounded-full bg-gold/30"></div>
                                <div className="w-3 h-3 rounded-full bg-emerald-500/30"></div>
                            </div>
                            <div className="grid grid-cols-4 gap-6 mb-8">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-32 bg-white/5 rounded-3xl border border-white/5 p-4 flex flex-col justify-center">
                                         <div className="w-8 h-8 rounded-lg bg-white/5 mb-3"></div>
                                         <div className="h-3 w-16 bg-white/10 rounded mb-2"></div>
                                         <div className="h-6 w-24 bg-white/20 rounded"></div>
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                <div className="col-span-2 h-64 bg-white/5 rounded-3xl border border-white/5 p-6 flex flex-col">
                                    <div className="flex justify-between mb-8">
                                        <div className="h-6 w-48 bg-white/10 rounded"></div>
                                        <div className="flex gap-2">
                                            <div className="h-8 w-8 bg-white/5 rounded-lg"></div>
                                            <div className="h-8 w-8 bg-white/5 rounded-lg"></div>
                                        </div>
                                    </div>
                                    <div className="flex-1 flex items-end gap-3 px-4">
                                        {[40, 65, 45, 90, 85, 55, 75, 45, 60, 95].map((h, i) => (
                                            <div key={i} className="flex-1 bg-primary-600/30 rounded-t-lg transition-all hover:bg-primary-500" style={{ height: `${h}%` }}></div>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-span-1 h-64 bg-white/5 rounded-3xl border border-white/5 p-6 space-y-4">
                                     <div className="h-6 w-32 bg-white/10 rounded mb-6"></div>
                                     {[1, 2, 3, 4].map(i => (
                                         <div key={i} className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 shrink-0"></div>
                                            <div className="space-y-2 flex-1">
                                                <div className="h-3 w-full bg-white/10 rounded"></div>
                                                <div className="h-2 w-2/3 bg-white/5 rounded"></div>
                                            </div>
                                         </div>
                                     ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performance Stats Overlay */}
                <div className="mt-40 grid grid-cols-2 md:grid-cols-4 gap-20 max-w-6xl w-full">
                    {[
                        { icon: Activity, label: 'Execution Speed', value: '42ms' },
                        { icon: Lock, label: 'Security Grade', value: 'ECC-521' },
                        { icon: Users, label: 'Ledger Nodes', value: '1.4k+' },
                        { icon: BarChart3, label: 'Uptime Protocol', value: '99.99+' }
                    ].map((s, i) => (
                        <div key={i} className="flex flex-col items-center text-center group translate-y-0 hover:-translate-y-2 transition-transform duration-500">
                            <div className="w-16 h-16 rounded-[24px] bg-white/5 flex items-center justify-center text-primary-400 mb-6 group-hover:bg-primary-600 transition-all shadow-2xl">
                                <s.icon size={28} />
                            </div>
                            <h4 className="text-4xl font-black mb-2 font-['Outfit']">{s.value}</h4>
                            <p className="text-[10px] font-black uppercase tracking-[3px] text-slate-500">{s.label}</p>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="relative z-10 border-t border-white/5 pt-20 pb-10 px-8 text-center text-[11px] font-black uppercase tracking-[6px] text-slate-600">
                &copy; 2026 Architectural Engineering by FinSchool Labs. All Rights Reserved.
            </footer>

            {/* CSS Animation Overrides */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes gridMove {
                    0% { transform: perspective(800px) rotateX(60deg) translateY(0); }
                    100% { transform: perspective(800px) rotateX(60deg) translateY(40px); }
                }
                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-subtle {
                    animation: bounce-subtle 3s ease-in-out infinite;
                }
                .text-gradient-gold {
                    background: linear-gradient(135deg, #FDB931 0%, #D8A027 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .btn-primary {
                    @apply px-10 py-5 bg-primary-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary-500 transition-all shadow-xl shadow-primary-500/20 active:scale-95;
                }
                .input-field {
                    @apply w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium text-slate-900 focus:outline-none focus:border-primary-500 transition-all outline-none;
                }
                .glass-card {
                  @apply bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[32px] transition-all;
                }
                .sophisticated-shadow {
                  box-shadow: 0 50px 100px -20px rgba(0,0,0,0.5);
                }
            `}} />
        </div>
    );
};

export default LandingPage;
