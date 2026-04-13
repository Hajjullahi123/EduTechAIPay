import { useNavigate } from 'react-router-dom';
import { Building2, ShieldCheck, Zap, ArrowRight, BarChart3, Users, Globe, Lock, Cpu, Star, Activity, Smartphone, Menu, X, BookOpen, GraduationCap, Award, TrendingUp, CheckCircle2, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import EduTechLogo from '../components/EduTechLogo';

/* ─── Floating SVG Educational Icons ─── */
const FloatingIcon = ({ children, className = '', style = {} }) => (
    <div className={`absolute pointer-events-none select-none ${className}`} style={style}>
        {children}
    </div>
);

const BookSVG = ({ size = 48, color = '#38bdf8' }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <rect x="8" y="6" width="48" height="52" rx="4" fill={color} opacity="0.15" />
        <rect x="12" y="10" width="40" height="44" rx="3" fill={color} opacity="0.25" />
        <path d="M32 14V50M12 14H52" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        <rect x="18" y="20" width="10" height="2" rx="1" fill={color} opacity="0.4" />
        <rect x="18" y="26" width="8" height="2" rx="1" fill={color} opacity="0.3" />
        <rect x="36" y="20" width="10" height="2" rx="1" fill={color} opacity="0.4" />
        <rect x="36" y="26" width="8" height="2" rx="1" fill={color} opacity="0.3" />
    </svg>
);

const GlobeSVG = ({ size = 56, color = '#a78bfa' }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="26" stroke={color} strokeWidth="2" opacity="0.3" />
        <ellipse cx="32" cy="32" rx="14" ry="26" stroke={color} strokeWidth="1.5" opacity="0.25" />
        <path d="M6 32H58" stroke={color} strokeWidth="1.5" opacity="0.2" />
        <path d="M10 20H54" stroke={color} strokeWidth="1" opacity="0.15" />
        <path d="M10 44H54" stroke={color} strokeWidth="1" opacity="0.15" />
        <circle cx="32" cy="32" r="26" stroke={color} strokeWidth="2" opacity="0.2" strokeDasharray="4 4" />
    </svg>
);

const GradCapSVG = ({ size = 52, color = '#fbbf24' }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <path d="M32 12L6 26L32 40L58 26L32 12Z" fill={color} opacity="0.2" />
        <path d="M32 12L6 26L32 40L58 26L32 12Z" stroke={color} strokeWidth="2" opacity="0.4" />
        <path d="M14 30V44C14 44 20 52 32 52C44 52 50 44 50 44V30" stroke={color} strokeWidth="2" opacity="0.3" />
        <path d="M54 26V42" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />
        <circle cx="54" cy="44" r="3" fill={color} opacity="0.25" />
    </svg>
);

const PencilSVG = ({ size = 44, color = '#34d399' }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <path d="M44 8L56 20L24 52H12V40L44 8Z" fill={color} opacity="0.15" />
        <path d="M44 8L56 20L24 52H12V40L44 8Z" stroke={color} strokeWidth="2" opacity="0.35" />
        <path d="M38 14L50 26" stroke={color} strokeWidth="2" opacity="0.25" />
    </svg>
);

const CalculatorSVG = ({ size = 42, color = '#f472b6' }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <rect x="12" y="4" width="40" height="56" rx="6" fill={color} opacity="0.15" />
        <rect x="12" y="4" width="40" height="56" rx="6" stroke={color} strokeWidth="2" opacity="0.3" />
        <rect x="18" y="10" width="28" height="14" rx="3" fill={color} opacity="0.2" />
        <circle cx="24" cy="34" r="3" fill={color} opacity="0.25" />
        <circle cx="32" cy="34" r="3" fill={color} opacity="0.25" />
        <circle cx="40" cy="34" r="3" fill={color} opacity="0.25" />
        <circle cx="24" cy="44" r="3" fill={color} opacity="0.25" />
        <circle cx="32" cy="44" r="3" fill={color} opacity="0.25" />
        <circle cx="40" cy="44" r="3" fill={color} opacity="0.25" />
    </svg>
);

const LaptopSVG = ({ size = 56, color = '#60a5fa' }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <rect x="10" y="8" width="44" height="32" rx="4" fill={color} opacity="0.15" />
        <rect x="10" y="8" width="44" height="32" rx="4" stroke={color} strokeWidth="2" opacity="0.3" />
        <rect x="16" y="14" width="32" height="20" rx="2" fill={color} opacity="0.1" />
        <path d="M4 44H60L56 52H8L4 44Z" fill={color} opacity="0.2" />
        <path d="M4 44H60L56 52H8L4 44Z" stroke={color} strokeWidth="2" opacity="0.3" />
    </svg>
);

const LightbulbSVG = ({ size = 40, color = '#fbbf24' }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <path d="M32 6C20 6 14 16 14 24C14 32 20 36 22 42H42C44 36 50 32 50 24C50 16 44 6 32 6Z" fill={color} opacity="0.15" />
        <path d="M32 6C20 6 14 16 14 24C14 32 20 36 22 42H42C44 36 50 32 50 24C50 16 44 6 32 6Z" stroke={color} strokeWidth="2" opacity="0.35" />
        <rect x="22" y="44" width="20" height="4" rx="2" fill={color} opacity="0.2" />
        <rect x="24" y="50" width="16" height="4" rx="2" fill={color} opacity="0.2" />
        <path d="M28 56H36" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.25" />
        <path d="M32 2V6M52 14L48 16M16 16L12 14M56 28H52M12 28H8" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.2" />
    </svg>
);


const LandingPage = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallBtn, setShowInstallBtn] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);

        const handleBeforeInstall = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallBtn(true);
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstall);

        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
        };
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
            window.removeEventListener('mousemove', handleMouseMove);
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

    const navLinks = [
        { label: 'Features', href: '#features' },
        { label: 'Security', href: '#security' },
        { label: 'Why Us', href: '#why-us' },
    ];

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-primary-500/30 selection:text-primary-200 overflow-x-hidden relative font-['Outfit']">
            
            {/* ═══════════ Animated Dynamic Background ═══════════ */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div 
                    className="absolute w-[600px] h-[600px] rounded-full blur-[200px] landing-glow-1"
                    style={{ 
                        left: `${10 + mousePos.x * 15}%`, 
                        top: `${-5 + mousePos.y * 10}%`,
                    }}
                />
                <div 
                    className="absolute w-[500px] h-[500px] rounded-full blur-[200px] landing-glow-2"
                    style={{ 
                        right: `${-5 + mousePos.x * 10}%`, 
                        bottom: `${-10 + mousePos.y * 15}%`,
                    }}
                />
                <div className="absolute top-[30%] left-[50%] w-[400px] h-[400px] bg-violet-500/8 blur-[150px] rounded-full landing-pulse-slow" />
                
                {/* Dot Grid */}
                <div 
                    className="absolute inset-0 opacity-[0.04]" 
                    style={{ 
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)`, 
                        backgroundSize: '48px 48px',
                    }}
                />
            </div>

            {/* ═══════════ Floating Educational Images & Icons ═══════════ */}
            <div className="fixed inset-0 z-[1] overflow-hidden pointer-events-none hidden md:block">
                {/* Floating SVGs */}
                <FloatingIcon className="landing-float-1" style={{ top: '12%', left: '5%' }}>
                    <BookSVG size={52} color="#38bdf8" />
                </FloatingIcon>
                <FloatingIcon className="landing-float-3" style={{ top: '45%', left: '3%' }}>
                    <GlobeSVG size={50} color="#a78bfa" />
                </FloatingIcon>
                <FloatingIcon className="landing-float-6" style={{ top: '35%', right: '12%' }}>
                    <LaptopSVG size={54} color="#60a5fa" />
                </FloatingIcon>
                
                {/* Floating Modern Images */}
                <FloatingIcon className="landing-float-4" style={{ top: '22%', right: '8%' }}>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-2xl transition-all"></div>
                        <img 
                            src="/images/students_diversity.png" 
                            alt="Students" 
                            className="w-48 h-32 object-cover rounded-2xl border border-white/10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] transform -rotate-3 transition-all opacity-80" 
                        />
                    </div>
                </FloatingIcon>
                
                <FloatingIcon className="landing-float-2 border border-white/5 rounded-full p-2 bg-white/5 backdrop-blur-md shadow-2xl" style={{ bottom: '20%', left: '10%' }}>
                    <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-white/10 opacity-70">
                        <img 
                            src="/images/modern_school_campus.png" 
                            alt="Modern Campus" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                </FloatingIcon>

                <FloatingIcon className="landing-float-7" style={{ top: '75%', right: '15%' }}>
                    <LightbulbSVG size={42} color="#fbbf24" />
                </FloatingIcon>
            </div>

            {/* ═══════════ Premium Navbar ═══════════ */}
            <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'py-3 bg-[#020617]/85 backdrop-blur-2xl border-b border-white/5 shadow-2xl shadow-black/20' : 'py-5 md:py-8'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <EduTechLogo size={scrolled ? 36 : 42} className="group-hover:scale-105 transition-transform duration-500 logo-white-text" />
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-10">
                        {navLinks.map((link) => (
                            <a key={link.label} href={link.href} className="text-[11px] font-black uppercase tracking-[3px] text-slate-400 hover:text-white transition-colors relative group">
                                {link.label}
                                <span className="absolute -bottom-1.5 left-0 w-0 h-[2px] bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-300 group-hover:w-full rounded-full" />
                            </a>
                        ))}
                    </div>

                    {/* Desktop Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        {showInstallBtn && (
                            <button onClick={handleInstall} className="px-4 py-2.5 bg-primary-600/10 border border-primary-600/20 rounded-xl text-[9px] font-black uppercase tracking-widest text-primary-400 flex items-center gap-2 hover:bg-primary-600/20 transition-all">
                                <Smartphone size={14} /> Install App
                            </button>
                        )}
                        <button onClick={() => navigate('/login')} className="text-[11px] font-black uppercase tracking-[2px] text-slate-400 hover:text-white transition-all px-4 py-2.5">Client Portal</button>
                        <button onClick={() => navigate('/login')} className="px-6 py-3 bg-white text-[#020617] rounded-2xl text-[11px] font-black uppercase tracking-[2px] hover:bg-primary-500 hover:text-white transition-all shadow-2xl shadow-white/10 hover:scale-105 active:scale-95 hover:shadow-primary-500/30">
                            Executive Login
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                        className="md:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                        aria-label="Toggle Menu"
                    >
                        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                <div className={`md:hidden absolute top-full left-0 w-full bg-[#020617]/98 backdrop-blur-2xl border-b border-white/5 transition-all duration-500 overflow-hidden ${mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-6 py-6 space-y-2">
                        {navLinks.map((link) => (
                            <a 
                                key={link.label} 
                                href={link.href} 
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-4 py-3.5 text-[11px] font-black uppercase tracking-[3px] text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                            >
                                {link.label}
                            </a>
                        ))}
                        <div className="h-px bg-white/5 my-4" />
                        {showInstallBtn && (
                            <button onClick={() => { handleInstall(); setMobileMenuOpen(false); }} className="w-full px-4 py-3.5 bg-emerald-600/10 border border-emerald-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center justify-center gap-2 mb-2">
                                <Smartphone size={16} /> Install Mobile App
                            </button>
                        )}
                        <button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} className="w-full px-4 py-3.5 text-[11px] font-black uppercase tracking-[2px] text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                            Client Portal
                        </button>
                        <button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} className="w-full px-4 py-3.5 bg-white text-[#020617] rounded-2xl text-[11px] font-black uppercase tracking-[2px] hover:bg-primary-500 hover:text-white transition-all shadow-2xl text-center">
                            Executive Login
                        </button>
                    </div>
                </div>
            </nav>

            {/* ═══════════ Hero Section ═══════════ */}
            <main className="relative z-10 pt-32 sm:pt-40 md:pt-48 pb-16 sm:pb-24 md:pb-32 px-4 sm:px-6 lg:px-8 flex flex-col items-center overflow-hidden">
                <div className="text-center max-w-5xl w-full">
                    {/* Status Badge */}
                    <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 sm:mb-10 landing-fade-up shadow-xl">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[2px] sm:tracking-[3px] text-slate-300">V2.4 Online</span>
                        <div className="h-4 w-px bg-white/10 mx-1 hidden sm:block" />
                        <Star size={12} className="text-gold hidden sm:block" />
                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[2px] sm:tracking-[3px] text-gold hidden sm:block">Elite</span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[120px] font-black tracking-tighter leading-[0.85] mb-6 sm:mb-8 md:mb-12 landing-fade-up landing-delay-1">
                        Smart <br className="sm:hidden" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-indigo-300 to-primary-600 landing-text-glow">
                            Education
                        </span>
                        <br />
                        <span className="text-3xl sm:text-5xl md:text-6xl lg:text-[90px] text-slate-300">
                            Finance Hub
                        </span>
                    </h1>

                    {/* Subheading */}
                    <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-slate-400 font-medium leading-relaxed mb-10 sm:mb-14 md:mb-16 px-2 landing-fade-up landing-delay-2">
                        An elite, multi-tenant ecosystem precision-engineered for school groups. Manage branches, automate fee collection, track payroll, and generate insights — all from one dashboard.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center landing-fade-up landing-delay-3">
                        <button 
                            onClick={() => navigate('/login')} 
                            className="w-full sm:w-auto px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl sm:rounded-3xl font-black uppercase text-xs sm:text-sm tracking-[2px] sm:tracking-[3px] hover:from-primary-500 hover:to-primary-400 transition-all shadow-[0_20px_50px_-10px_rgba(14,165,233,0.4)] hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group"
                        >
                            Enter Secure Portal <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                        
                        {showInstallBtn ? (
                            <button 
                                onClick={handleInstall} 
                                className="w-full sm:w-auto px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 bg-emerald-600/10 border border-emerald-500/30 rounded-2xl sm:rounded-3xl font-black uppercase text-xs sm:text-sm tracking-[2px] sm:tracking-[3px] hover:bg-emerald-600 hover:text-white transition-all shadow-2xl flex items-center justify-center gap-3 group"
                            >
                                Install Mobile PWA <Smartphone size={20} className="group-hover:scale-110 transition-transform" />
                            </button>
                        ) : (
                            <button 
                                className="w-full sm:w-auto px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl font-black uppercase text-xs sm:text-sm tracking-[2px] sm:tracking-[3px] hover:bg-white/10 transition-all shadow-2xl flex items-center justify-center gap-3 group"
                            >
                                View Architecture <Globe size={18} className="group-hover:rotate-180 transition-all duration-1000" />
                            </button>
                        )}
                    </div>
                </div>

                {/* ═══════════ Dashboard Preview Card ═══════════ */}
                <div className="mt-16 sm:mt-24 md:mt-32 w-full max-w-5xl relative group cursor-pointer landing-fade-up landing-delay-4">
                    <div className="absolute inset-x-10 sm:inset-x-20 -top-8 sm:-top-10 h-24 sm:h-32 bg-primary-500/20 blur-[80px] sm:blur-[100px] group-hover:bg-primary-500/40 transition-all duration-1000" />
                    <div className="relative rounded-2xl sm:rounded-[32px] md:rounded-[40px] border border-white/10 p-2 sm:p-3 md:p-4 bg-slate-900/50 backdrop-blur-2xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden group-hover:border-white/20 transition-all duration-700">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent pointer-events-none" />
                        
                        {/* Simulated UI Content */}
                        <div className="bg-[#0a0f1e] rounded-xl sm:rounded-[24px] md:rounded-[32px] p-4 sm:p-6 md:p-8 border border-white/5">
                            {/* Window Controls */}
                            <div className="h-6 w-full flex gap-2 mb-4 sm:mb-6 md:mb-8 px-2 border-b border-white/5 pb-3 sm:pb-4">
                                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500/40" />
                                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500/40" />
                                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500/40" />
                                <div className="flex-1 flex justify-center">
                                    <div className="h-5 w-48 bg-white/5 rounded-lg hidden sm:block" />
                                </div>
                            </div>
                            {/* Stats Row */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
                                {[
                                    { label: 'Total Revenue', value: '₦14.2M', color: 'primary' },
                                    { label: 'Students', value: '2,847', color: 'emerald' },
                                    { label: 'Collection Rate', value: '94.2%', color: 'amber' },
                                    { label: 'Branches', value: '12', color: 'violet' },
                                ].map((card, i) => (
                                    <div key={i} className={`h-auto p-3 sm:p-4 bg-white/[0.03] rounded-xl sm:rounded-2xl md:rounded-3xl border border-white/5 flex flex-col justify-center group-hover:bg-white/[0.05] transition-all duration-500`} style={{ transitionDelay: `${i * 100}ms` }}>
                                        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-${card.color}-500/10 mb-2 sm:mb-3`} />
                                        <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{card.label}</div>
                                        <div className="text-sm sm:text-lg md:text-xl font-black text-white/80">{card.value}</div>
                                    </div>
                                ))}
                            </div>
                            {/* Chart Area */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                                <div className="md:col-span-2 h-40 sm:h-52 md:h-64 bg-white/[0.02] rounded-xl sm:rounded-2xl md:rounded-3xl border border-white/5 p-4 sm:p-6 flex flex-col">
                                    <div className="flex justify-between mb-4 sm:mb-8">
                                        <div className="h-4 sm:h-6 w-32 sm:w-48 bg-white/10 rounded" />
                                        <div className="flex gap-2">
                                            <div className="h-6 sm:h-8 w-6 sm:w-8 bg-white/5 rounded-lg" />
                                            <div className="h-6 sm:h-8 w-6 sm:w-8 bg-white/5 rounded-lg" />
                                        </div>
                                    </div>
                                    <div className="flex-1 flex items-end gap-1.5 sm:gap-2 md:gap-3 px-2 sm:px-4">
                                        {[40, 65, 45, 90, 85, 55, 75, 45, 60, 95, 70, 80].map((h, i) => (
                                            <div 
                                                key={i} 
                                                className="flex-1 bg-gradient-to-t from-primary-600/40 to-primary-400/20 rounded-t-lg transition-all duration-500 hover:from-primary-500 hover:to-primary-300" 
                                                style={{ height: `${h}%`, transitionDelay: `${i * 50}ms` }}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="hidden md:block col-span-1 h-64 bg-white/[0.02] rounded-3xl border border-white/5 p-6 space-y-4">
                                    <div className="h-6 w-32 bg-white/10 rounded mb-6" />
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 shrink-0" />
                                            <div className="space-y-2 flex-1">
                                                <div className="h-3 w-full bg-white/10 rounded" />
                                                <div className="h-2 w-2/3 bg-white/5 rounded" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══════════ Performance Stats ═══════════ */}
                <div id="security" className="mt-20 sm:mt-28 md:mt-40 grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 md:gap-20 max-w-5xl w-full px-4">
                    {[
                        { icon: Activity, label: 'Execution Speed', value: '42ms', color: 'primary' },
                        { icon: Lock, label: 'Security Grade', value: 'AES-256', color: 'emerald' },
                        { icon: Users, label: 'Active Nodes', value: '1.4k+', color: 'violet' },
                        { icon: BarChart3, label: 'System Uptime', value: '99.99%', color: 'amber' }
                    ].map((s, i) => (
                        <div key={i} className="flex flex-col items-center text-center group translate-y-0 hover:-translate-y-2 transition-transform duration-500">
                            <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl sm:rounded-[20px] md:rounded-[24px] bg-white/5 flex items-center justify-center text-${s.color}-400 mb-4 sm:mb-5 md:mb-6 group-hover:bg-${s.color}-600 group-hover:text-white transition-all shadow-2xl border border-white/5 group-hover:border-transparent group-hover:shadow-${s.color}-500/20`}>
                                <s.icon size={24} />
                            </div>
                            <h4 className="text-2xl sm:text-3xl md:text-4xl font-black mb-1 sm:mb-2">{s.value}</h4>
                            <p className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[2px] sm:tracking-[3px] text-slate-500">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* ═══════════ Features Grid ═══════════ */}
                <div id="features" className="mt-20 sm:mt-28 md:mt-40 max-w-5xl w-full">
                    <div className="text-center mb-12 sm:mb-16 md:mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
                            <Zap size={12} className="text-primary-400" />
                            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[3px] text-slate-400">Powerful Features</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 sm:mb-6">
                            Everything Your<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-violet-400">School Group Needs</span>
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg text-slate-500 max-w-xl mx-auto px-4">
                            Built for multi-branch educational institutions that demand enterprise-grade financial management.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 px-4 sm:px-0">
                        {[
                            { icon: Building2, title: 'Multi-Branch', desc: 'Manage unlimited school branches from a unified super admin dashboard', color: 'primary', gradient: 'from-primary-500/10 to-primary-500/0' },
                            { icon: ShieldCheck, title: 'Secure Receipts', desc: 'Cryptographic fingerprinting ensures every transaction is tamper-proof', color: 'emerald', gradient: 'from-emerald-500/10 to-emerald-500/0' },
                            { icon: Users, title: 'Student Ledger', desc: 'Complete fee profiles, clearance management and payment tracking', color: 'violet', gradient: 'from-violet-500/10 to-violet-500/0' },
                            { icon: BarChart3, title: 'Live Analytics', desc: 'Real-time collection rates, revenue projections and financial health gauges', color: 'amber', gradient: 'from-amber-500/10 to-amber-500/0' },
                            { icon: GraduationCap, title: 'Scholarships', desc: 'Automated scholarship management with fee waivers and tracking', color: 'rose', gradient: 'from-rose-500/10 to-rose-500/0' },
                            { icon: Cpu, title: 'Staff Payroll', desc: 'Full payroll processing with salary vouchers and analytics dashboard', color: 'cyan', gradient: 'from-cyan-500/10 to-cyan-500/0' },
                        ].map((feature, i) => (
                            <div 
                                key={i} 
                                className={`relative p-6 sm:p-7 md:p-8 rounded-2xl sm:rounded-[28px] md:rounded-[32px] bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all duration-500 group hover:-translate-y-1 overflow-hidden`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-b ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                <div className="relative z-10">
                                    <div className={`w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-${feature.color}-500/10 border border-${feature.color}-500/10 flex items-center justify-center text-${feature.color}-400 mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                        <feature.icon size={22} />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-black mb-2 sm:mb-3 tracking-tight">{feature.title}</h3>
                                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ═══════════ Why Us Section ═══════════ */}
                <div id="why-us" className="mt-20 sm:mt-28 md:mt-40 max-w-5xl w-full px-4 sm:px-0">
                    <div className="relative rounded-2xl sm:rounded-[32px] md:rounded-[40px] overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-transparent to-violet-600/10" />
                        <div className="relative border border-white/5 rounded-2xl sm:rounded-[32px] md:rounded-[40px] p-6 sm:p-10 md:p-16">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-16 items-center">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
                                        <Award size={12} className="text-gold" />
                                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[3px] text-slate-400">Why Choose Us</span>
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4 sm:mb-6">
                                        Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-amber-400">Excellence</span>
                                    </h2>
                                    <p className="text-sm sm:text-base text-slate-400 leading-relaxed mb-6 sm:mb-8">
                                        Our platform is designed by education finance experts who understand the unique challenges of managing school fees at scale.
                                    </p>
                                    <button 
                                        onClick={() => navigate('/login')} 
                                        className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#020617] rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-[2px] hover:bg-primary-500 hover:text-white transition-all shadow-2xl shadow-white/5 hover:shadow-primary-500/20 flex items-center gap-2 group"
                                    >
                                        Get Started <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                                <div className="space-y-3 sm:space-y-4">
                                    {[
                                        { title: 'Zero Data Loss', desc: 'Automated backups and restore points with enterprise-grade data integrity' },
                                        { title: 'Role-Based Access', desc: 'Granular permissions from Super Admin down to branch-level bursars' },
                                        { title: 'Real-time Sync', desc: 'All branches stay synchronized with instant data propagation across the network' },
                                        { title: 'Audit Trail', desc: 'Every transaction is logged, fingerprinted, and traceable for complete accountability' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all group">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                                <CheckCircle2 size={16} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm sm:text-base font-black mb-0.5 sm:mb-1">{item.title}</h4>
                                                <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* ═══════════ Footer ═══════════ */}
            <footer className="relative z-10 border-t border-white/5 py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <EduTechLogo size={28} className="logo-white-text opacity-50" />
                    </div>
                    <p className="text-[9px] sm:text-[10px] md:text-[11px] font-black uppercase tracking-[3px] sm:tracking-[4px] md:tracking-[6px] text-slate-600 text-center">
                        &copy; 2026 EduTech Pro Suite. All Rights Reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <a href="#" className="text-[10px] font-bold text-slate-600 hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="text-[10px] font-bold text-slate-600 hover:text-white transition-colors">Terms</a>
                    </div>
                </div>
            </footer>

            {/* ═══════════ CSS Animations ═══════════ */}
            <style dangerouslySetInnerHTML={{ __html: `
                /* Floating animations for educational icons */
                @keyframes landingFloat1 {
                    0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
                    25% { transform: translateY(-20px) rotate(5deg); opacity: 0.8; }
                    50% { transform: translateY(-10px) rotate(-3deg); opacity: 0.7; }
                    75% { transform: translateY(-25px) rotate(2deg); opacity: 0.9; }
                }
                @keyframes landingFloat2 {
                    0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.5; }
                    33% { transform: translateY(-30px) rotate(-5deg); opacity: 0.7; }
                    66% { transform: translateY(-15px) rotate(4deg); opacity: 0.8; }
                }
                @keyframes landingFloat3 {
                    0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.5; }
                    50% { transform: translateY(-18px) translateX(10px); opacity: 0.75; }
                }
                @keyframes landingFloat4 {
                    0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.55; }
                    40% { transform: translateY(-22px) rotate(8deg); opacity: 0.8; }
                    80% { transform: translateY(-8px) rotate(-4deg); opacity: 0.65; }
                }
                @keyframes landingFloat5 {
                    0%, 100% { transform: translateY(0px) scale(1); opacity: 0.5; }
                    50% { transform: translateY(-15px) scale(1.05); opacity: 0.75; }
                }
                @keyframes landingFloat6 {
                    0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.45; }
                    30% { transform: translateY(-25px) rotate(-6deg); opacity: 0.7; }
                    70% { transform: translateY(-12px) rotate(3deg); opacity: 0.6; }
                }
                @keyframes landingFloat7 {
                    0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); opacity: 0.5; }
                    50% { transform: translateY(-20px) rotate(10deg) scale(1.1); opacity: 0.8; }
                }
                @keyframes landingPulseSlow {
                    0%, 100% { opacity: 0.04; transform: scale(1); }
                    50% { opacity: 0.08; transform: scale(1.1); }
                }
                @keyframes landingFadeUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .landing-float-1 { animation: landingFloat1 8s ease-in-out infinite; }
                .landing-float-2 { animation: landingFloat2 10s ease-in-out infinite; }
                .landing-float-3 { animation: landingFloat3 7s ease-in-out infinite; }
                .landing-float-4 { animation: landingFloat4 9s ease-in-out infinite; }
                .landing-float-5 { animation: landingFloat5 6s ease-in-out infinite; }
                .landing-float-6 { animation: landingFloat6 11s ease-in-out infinite; }
                .landing-float-7 { animation: landingFloat7 8s ease-in-out infinite; }
                .landing-pulse-slow { animation: landingPulseSlow 8s ease-in-out infinite; }

                .landing-glow-1 { background: radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%); }
                .landing-glow-2 { background: radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%); }

                .landing-fade-up {
                    animation: landingFadeUp 1s ease-out forwards;
                    opacity: 0;
                }
                .landing-delay-1 { animation-delay: 0.1s; }
                .landing-delay-2 { animation-delay: 0.25s; }
                .landing-delay-3 { animation-delay: 0.4s; }
                .landing-delay-4 { animation-delay: 0.6s; }

                .landing-text-glow {
                    filter: drop-shadow(0 0 20px rgba(14,165,233,0.2));
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
