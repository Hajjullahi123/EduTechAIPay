import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { LayoutDashboard, Users, Receipt, CreditCard, Bell, Settings as SettingsIcon, LogOut, Search, Plus, Filter, Download, ArrowUpRight, GraduationCap, Building2, CheckCircle2, AlertCircle, X, Loader2, Trash2, Printer, ShieldCheck, MessageSquare, Activity as ActivityIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import StatsOverview from './components/StatsOverview'
import SecureReceipt from './components/SecureReceipt'
import BulkUpload from './components/BulkUpload'
import MiscFees from './components/MiscFees'
import Scholarships from './components/Scholarships'
import AuditLogs from './components/AuditLogs'
import FinancialHealthGauge from './components/FinancialHealthGauge'
import StaffManagement from './components/StaffManagement'
import PayrollConsole from './components/PayrollConsole'
import CommunicationHub from './components/CommunicationHub'
import BranchSwitcher from './components/BranchSwitcher'
import LandingPage from './views/LandingPage'
import LoginPage from './views/LoginPage'
import SuperAdminDashboard from './views/SuperAdminDashboard'
import SecuritySettings from './components/SecuritySettings'
import DocumentVerification from './views/DocumentVerification'
import BranchManagement from './views/BranchManagement'
import InstallPWA from './components/InstallPWA'
import EduTechLogo from './components/EduTechLogo'
import SetupWizard from './views/SetupWizard'
import { AuthProvider, useAuth } from './context/AuthContext'

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

// Helper for multitenant fetch
const apiFetch = (url, options = {}, schoolId) => {
    const token = localStorage.getItem('token');
    return fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'x-school-id': schoolId,
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
    });
};

// Loading Overlay
const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-slate-50/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white sophisticated-shadow border-slate-200 shadow-sm p-10 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-primary-500" size={48} />
            <p className="text-lg font-medium animate-pulse">Processing Transaction...</p>
        </div>
    </div>
);

// Payment Modal
const PaymentModal = ({ isOpen, onClose, student, onComplete }) => {
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('cash');
    const [ref, setRef] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen || !student) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await apiFetch(`${API_BASE}/payment/payment`, {
                method: 'POST',
                body: JSON.stringify({
                    studentId: student.id,
                    termId: 1, // Default for demo
                    academicSessionId: 1,
                    amount: parseFloat(amount),
                    paymentMethod: method,
                    reference: ref,
                    notes: notes
                })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            onComplete();
            onClose();
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-50/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white sophisticated-shadow border-slate-200 shadow-sm w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 shadow-2xl shadow-primary-500/10">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-slate-100 to-slate-200">
                    <div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Amount (₦)</label>
                            <input 
                                required
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                type="number" 
                                placeholder="0.00" 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 focus:ring-2 focus:ring-primary-500/20 focus:outline-none focus:border-primary-500/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Method</label>
                            <select 
                                value={method}
                                onChange={(e) => setMethod(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500/50 shadow-sm"
                            >
                                <option value="cash">Cash</option>
                                <option value="transfer">Bank Transfer</option>
                                <option value="pos">POS</option>
                                <option value="scholarship">Scholarship Override</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Reference</label>
                            <input 
                                value={ref}
                                onChange={(e) => setRef(e.target.value)}
                                type="text" 
                                placeholder="TRX-XXXXXX" 
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500/50 shadow-sm"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Notes (Optional)</label>
                        <textarea 
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm h-24 focus:outline-none focus:border-primary-500/50 resize-none shadow-sm"
                            placeholder="Add additional payment details..."
                        ></textarea>
                    </div>
                    
                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 py-3 bg-slate-100 border border-slate-200 rounded-xl hover:bg-slate-200 text-sm font-medium transition-colors">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-1 py-3 bg-primary-600 rounded-xl hover:bg-primary-500 glow-button text-sm font-bold flex items-center justify-center gap-2">
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />} 
                            Post Payment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Add Student Modal
const AddStudentModal = ({ isOpen, onClose, onComplete }) => {
    const [formData, setFormData] = useState({ firstName: '', lastName: '', admissionNumber: '', classId: '', isScholarship: false });
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetch(`${API_BASE}/payment/classes`).then(res => res.json()).then(setClasses);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/payment/students`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            onComplete();
            onClose();
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-50/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white sophisticated-shadow border-slate-200 shadow-sm w-full max-w-md overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <h3 className="text-xl font-bold">Register New Student</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-500"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">First Name</label>
                            <input required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Last Name</label>
                            <input required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Admission Number</label>
                        <input required value={formData.admissionNumber} onChange={e => setFormData({...formData, admissionNumber: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Current Class</label>
                        <select required value={formData.classId} onChange={e => setFormData({...formData, classId: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900">
                            <option value="">Select Class</option>
                            {classes.map(c => <option key={c.id} value={c.id}>{c.name} {c.arm}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <input type="checkbox" checked={formData.isScholarship} onChange={e => setFormData({...formData, isScholarship: e.target.checked})} className="w-4 h-4 rounded bg-white border-slate-300 text-primary-500" />
                        <label className="text-xs font-bold text-slate-700">Scholarship Recipient (Auto-Zero Fees)</label>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 py-3 text-sm font-bold bg-slate-100 border border-slate-200 rounded-xl hover:bg-slate-200 text-slate-600 transition-colors">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-1 py-3 text-sm font-bold bg-primary-600 rounded-xl hover:bg-primary-500 flex items-center justify-center gap-2 text-white">
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />} Enroll Student
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const AdminSetup = ({ schoolId }) => {
    const [classes, setClasses] = useState([]);
    const [fees, setFees] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [newClassName, setNewClassName] = useState('');
    const [newClassArm, setNewClassArm] = useState('');
    const [newSessionName, setNewSessionName] = useState('');
    const [newTermName, setNewTermName] = useState('');
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(0);
    const { user } = useAuth();

    useEffect(() => {
        const load = async () => {
            const [cRes, fRes, sRes] = await Promise.all([
                apiFetch(`${API_BASE}/payment/classes`, {}, schoolId),
                apiFetch(`${API_BASE}/payment/fee-structures?termId=1&academicSessionId=1`, {}, schoolId),
                apiFetch(`${API_BASE}/super-admin/academic-periods?schoolId=${schoolId}`)
            ]);
            setClasses(await cRes.json());
            setFees(await fRes.json());
            setSessions(await sRes.json());
        };
        load();
    }, [refresh, schoolId]);

    const handleAddClass = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiFetch(`${API_BASE}/payment/classes`, {
                method: 'POST',
                body: JSON.stringify({ name: newClassName, arm: newClassArm })
            }, schoolId);
            setNewClassName(''); setNewClassArm('');
            setRefresh(r => r + 1);
        } catch (err) { alert(err.message); }
        finally { setLoading(false); }
    };

    const handleUpdateFee = async (classId, amount) => {
        try {
            await apiFetch(`${API_BASE}/payment/fee-structures`, {
                method: 'POST',
                body: JSON.stringify({ classId, amount, termId: 1, academicSessionId: 1 })
            }, schoolId);
            setRefresh(r => r + 1);
        } catch (err) { alert(err.message); }
    };

    const handleAddSession = async (e) => {
        e.preventDefault();
        try {
            await apiFetch(`${API_BASE}/super-admin/academic-periods/sessions`, {
                method: 'POST',
                body: JSON.stringify({ schoolId, name: newSessionName })
            });
            setNewSessionName('');
            setRefresh(r => r + 1);
        } catch (err) { alert(err.message); }
    };

    const handleActivateSession = async (id) => {
        try {
            await apiFetch(`${API_BASE}/super-admin/academic-periods/sessions/${id}/activate`, {
                method: 'PATCH',
                body: JSON.stringify({ schoolId })
            });
            setRefresh(r => r + 1);
        } catch (err) { alert(err.message); }
    };

    const handleAddTerm = async (sessionId, name) => {
        try {
            await apiFetch(`${API_BASE}/super-admin/academic-periods/terms`, {
                method: 'POST',
                body: JSON.stringify({ schoolId, sessionId, name })
            });
            setRefresh(r => r + 1);
        } catch (err) { alert(err.message); }
    };

    const handleActivateTerm = async (id, sessionId) => {
        try {
            await apiFetch(`${API_BASE}/super-admin/academic-periods/terms/${id}/activate`, {
                method: 'PATCH',
                body: JSON.stringify({ schoolId, sessionId })
            });
            setRefresh(r => r + 1);
        } catch (err) { alert(err.message); }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
             <header>
                <h1 className="text-3xl font-black">Admin Configuration</h1>
                <p className="text-slate-400 text-sm mt-1">Configure classes and global school fee matrix</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white sophisticated-shadow border-slate-200 shadow-sm p-8 space-y-6">
                    <h3 className="font-bold flex items-center gap-2 border-b border-white/5 pb-4 text-primary-400"><GraduationCap size={18} /> Manage Classes</h3>
                    <form onSubmit={handleAddClass} className="flex gap-3">
                        <input required placeholder="Name (e.g. SS1)" value={newClassName} onChange={e => setNewClassName(e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary-500/50" />
                        <input placeholder="Arm (e.g. A)" value={newClassArm} onChange={e => setNewClassArm(e.target.value)} className="w-20 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary-500/50" />
                        <button type="submit" disabled={loading} className="p-2.5 bg-primary-600 rounded-xl hover:bg-primary-500 text-white shadow-lg shadow-primary-500/20"><Plus size={20} /></button>
                    </form>
                    <div className="grid grid-cols-3 gap-3">
                        {classes.map(c => (
                            <div key={c.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center hover:border-primary/20 transition-all">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{c.arm}</p>
                                <p className="font-bold text-lg text-slate-900">{c.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white sophisticated-shadow border-slate-200 shadow-sm p-8 space-y-6">
                    <h3 className="font-bold flex items-center gap-2 border-b border-white/5 pb-4 text-emerald-400"><CreditCard size={18} /> Tuition Fee Matrix</h3>
                    <div className="space-y-4">
                        {classes.map(c => {
                            const fee = fees.find(f => f.classId === c.id);
                            return (
                                <div key={c.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-sm font-bold text-slate-700">{c.name} {c.arm}</p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-black text-slate-400">₦</span>
                                        <input 
                                            type="number" 
                                            defaultValue={fee?.amount || 0}
                                            onBlur={e => handleUpdateFee(c.id, e.target.value)}
                                            className="w-32 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-black text-emerald-600 text-right focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                {user?.role === 'SUPER_ADMIN' && (
                    <div className="bg-white sophisticated-shadow border-slate-200 shadow-sm p-8 space-y-6 lg:col-span-2">
                        <h3 className="font-bold flex items-center gap-2 border-b border-white/5 pb-4 text-purple-400"><ActivityIcon size={18} /> Academic Periods (Sessions & Terms)</h3>
                        <form onSubmit={handleAddSession} className="flex gap-4">
                            <input required placeholder="New Session e.g. 2024/2025" value={newSessionName} onChange={e => setNewSessionName(e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary-500/50" />
                            <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-500/20 whitespace-nowrap">Add Session</button>
                        </form>
                        <div className="space-y-6 mt-6">
                            {sessions.map(session => (
                                <div key={session.id} className="p-6 bg-slate-50 rounded-[28px] border border-slate-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-lg font-black">{session.name}</h4>
                                            {session.isCurrent && <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase rounded-full border border-emerald-500/20">Active Session</span>}
                                        </div>
                                        {!session.isCurrent && <button onClick={() => handleActivateSession(session.id)} className="text-[10px] font-black uppercase text-slate-400 hover:text-emerald-500">Activate</button>}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {(session.terms || []).map(term => (
                                            <div key={term.id} className={`p-4 rounded-2xl border ${term.isCurrent ? 'bg-white border-emerald-200 shadow-sm' : 'bg-slate-100 border-transparent'} flex items-center justify-between`}>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-900">{term.name}</p>
                                                    {term.isCurrent && <p className="text-[8px] font-black text-emerald-500 uppercase mt-1 tracking-widest">Active Term</p>}
                                                </div>
                                                {!term.isCurrent && <button onClick={() => handleActivateTerm(term.id, session.id)} className="text-[9px] font-black text-slate-400 hover:text-emerald-500">SET ACTIVE</button>}
                                            </div>
                                        ))}
                                        <button 
                                            onClick={() => {
                                                const name = prompt('Enter Term Name (e.g. 1st Term)');
                                                if (name) handleAddTerm(session.id, name);
                                            }}
                                            className="p-4 rounded-2xl border border-dashed border-slate-300 text-slate-400 text-xs font-bold hover:bg-white hover:border-purple-300 hover:text-purple-500 transition-all"
                                        >
                                            + Add Term
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const Dashboard = ({ schoolId }) => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        apiFetch(`${API_BASE}/payment/summary?termId=1&academicSessionId=1`, {}, schoolId)
            .then(res => {
                if (!res.ok) throw new Error('Failed to load dashboard');
                return res.json();
            })
            .then(data => {
                if (data && !data.error) setStats(data);
            })
            .catch(err => console.error('Dashboard load error:', err));
    }, [schoolId]);

    const handleExportCSV = () => {
        const token = localStorage.getItem('token');
        window.open(`${API_BASE}/payment/export?termId=1&academicSessionId=1&token=${token}&schoolId=${schoolId || ''}`, '_blank');
    };

    const handleNotifyDefaulters = async () => {
        if (!confirm('Are you sure you want to send bulk deficit notifications to all students with outstanding balances?')) return;
        try {
            const res = await apiFetch(`${API_BASE}/payment/notify-defaulters`, {
                method: 'POST',
                body: JSON.stringify({ termId: 1, academicSessionId: 1 })
            }, schoolId);
            const data = await res.json();
            alert(data.message);
        } catch (err) { alert(err.message); }
    };

    if (!stats) return <div className="p-8 text-center animate-pulse text-slate-500 font-bold uppercase tracking-widest py-20">Loading Dashboard Data...</div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-5xl font-black tracking-tighter text-slate-900">
                        Financial Dashboard
                    </h1>
                    <p className="text-slate-400 mt-2 flex items-center gap-2 font-bold uppercase text-[10px] tracking-[3px]"> 
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Live Connection Status: STABLE
                    </p>
                </div>
                <div className="flex gap-4">
                    <button onClick={handleExportCSV} className="flex items-center gap-3 px-6 py-3.5 text-[11px] font-black uppercase tracking-widest bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all text-slate-600 shadow-sm shadow-slate-900/5">
                        <Download size={18} /> Download Reports
                    </button>
                    <button onClick={handleNotifyDefaulters} className="flex items-center gap-3 px-6 py-3.5 text-[11px] font-black uppercase tracking-widest bg-rose-600 rounded-2xl hover:bg-rose-500 text-white transition-all shadow-2xl shadow-rose-950/20 active:scale-95">
                        <Bell size={18} /> Send Debt Alerts
                    </button>
                </div>
            </header>

            <StatsOverview stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <FinancialHealthGauge stats={stats} />
                <div className="bg-white sophisticated-shadow border-slate-200 shadow-sm p-8 group overflow-hidden relative min-h-[450px]">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/10 blur-[80px] pointer-events-none"></div>
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <h3 className="font-bold text-xl">Recent Activity Feed</h3>
                        <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Live Updates</div>
                    </div>
                    <div className="space-y-4 relative z-10">
                        {stats.recentActivity?.length > 0 ? (
                            stats.recentActivity.map((activity, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-primary/20 transition-all animate-in slide-in-from-right-4" style={{ animationDelay: `${i * 100}ms` }}>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary-500/10 rounded-lg text-primary-500"><CreditCard size={14} /></div>
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-900">₦{activity.amount.toLocaleString()}</p>
                                            <p className="text-[9px] text-slate-400 uppercase font-black">{activity.studentName}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-500 font-bold">{new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-10 text-center text-slate-600 text-sm font-bold uppercase tracking-widest border border-dashed border-slate-800 rounded-2xl">
                                No recent transactions yet...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

// Payment History Modal
const PaymentHistoryModal = ({ isOpen, onClose, student, schoolId }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [schoolInfo, setSchoolInfo] = useState(null);

    useEffect(() => {
        if (isOpen && student) {
            setLoading(true);
            apiFetch(`${API_BASE}/payment/payments/${student.id}?termId=1&academicSessionId=1`, {}, schoolId)
                .then(res => res.json())
                .then(data => {
                    setHistory(Array.isArray(data) ? data : []);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
            
            fetch(`${API_BASE}/branches`).then(res => res.json()).then(branches => {
                setSchoolInfo(branches.find(b => b.id === schoolId));
            });
        }
    }, [isOpen, student, schoolId]);

    if (!isOpen || !student) return null;

    return (
        <div className="fixed inset-0 bg-slate-50/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white sophisticated-shadow border-slate-200 shadow-sm w-full max-w-2xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Payment History</h3>
                        <p className="text-xs text-slate-400 mt-1">Transaction audit for <span className="text-primary font-bold">{student.firstName} {student.lastName}</span></p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900"><X size={20} /></button>
                </div>
                
                <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-4">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center gap-4">
                            <Loader2 className="animate-spin text-gold" size={32} />
                            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Retrieving Records...</p>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="py-20 text-center text-slate-600 font-bold uppercase tracking-widest">No transaction records found</div>
                    ) : (
                        history.map((tx, i) => (
                            <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-primary/20 transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Receipt size={24} /></div>
                                        <div>
                                            <p className="text-lg font-black text-slate-900">₦{tx.amount.toLocaleString()}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(tx.paymentDate).toLocaleDateString()} at {new Date(tx.paymentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setSelectedPayment(tx)}
                                            className="p-2 bg-slate-800 hover:bg-gold rounded-lg text-slate-400 hover:text-slate-950 transition-all"
                                            title="View Receipt"
                                        ><Printer size={16} /></button>
                                        <button 
                                            onClick={async () => {
                                                if(confirm('Are you sure you want to void this payment?')){
                                                    await apiFetch(`${API_BASE}/payment/payment/${tx.id}`, { method: 'DELETE' }, schoolId);
                                                    onClose();
                                                }
                                            }}
                                            className="p-2 bg-slate-800 hover:bg-rose-600 rounded-lg text-slate-400 hover:text-white transition-all"
                                            title="Delete Record"
                                        ><Trash2 size={16} /></button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    <div className="p-3 bg-slate-50/50 rounded-xl border border-white/5">
                                        <p className="mb-1 text-slate-700 text-[8px]">Ref Number</p>
                                        <p className="text-slate-300">{tx.reference || 'CASH-TX'}</p>
                                    </div>
                                    <div className="p-3 bg-slate-50/50 rounded-xl border border-white/5">
                                        <p className="mb-1 text-slate-700 text-[8px]">Method</p>
                                        <p className="text-slate-300">{tx.paymentMethod}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="p-6 border-t border-white/5 flex justify-end">
                    <button onClick={onClose} className="px-6 py-2 bg-slate-800 rounded-xl text-sm font-bold hover:bg-slate-700 transition-colors">Close Ledger</button>
                </div>
            </div>
            
            <SecureReceipt 
                isOpen={!!selectedPayment} 
                onClose={() => setSelectedPayment(null)} 
                payment={selectedPayment}
                student={student}
                school={schoolInfo}
            />
        </div>
    );
};

const Students = ({ schoolId }) => {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [historyStudent, setHistoryStudent] = useState(null);
    const [refresh, setRefresh] = useState(0);
    const [addingStudent, setAddingStudent] = useState(false);
    const [loadingToggle, setLoadingToggle] = useState(null);

    useEffect(() => {
        apiFetch(`${API_BASE}/payment/students?termId=1&academicSessionId=1`, {}, schoolId)
            .then(res => res.json())
            .then(data => setStudents(data));
    }, [refresh, schoolId]);

    const handleToggleClearance = async (studentId) => {
        setLoadingToggle(studentId);
        try {
            const res = await apiFetch(`${API_BASE}/payment/toggle-clearance/${studentId}`, {
                method: 'POST',
                body: JSON.stringify({ termId: 1, academicSessionId: 1 })
            }, schoolId);
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setRefresh(r => r + 1);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoadingToggle(null);
        }
    };

    const filtered = students.filter(s => 
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        s.admissionNumber.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
             <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black">Student Ledger</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage individual fee profiles and clearances</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setAddingStudent(true)} className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 rounded-xl hover:bg-primary-500 text-sm font-bold shadow-lg shadow-primary-950/20"><Plus size={18} /> Enroll Student</button>
                    <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 relative">
                        <input 
                            type="text" 
                            placeholder="Search ledger..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent border-none text-sm px-4 py-2 w-64 focus:outline-none placeholder:text-slate-600 font-medium" 
                        />
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    </div>
                </div>
            </header>

            <div className="bg-white sophisticated-shadow border-slate-200 shadow-sm overflow-hidden rounded-2xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Details</th>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Adm Number</th>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Class</th>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fee Status</th>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Balance</th>
                            <th className="px-6 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filtered.map((s) => {
                            const record = s.feeRecords[0];
                            const balance = record?.balance || 0;
                            const isScholarship = s.isScholarship;

                            return (
                                <tr key={s.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ring-1 ring-inset ${isScholarship ? 'bg-amber-500/10 text-amber-500 ring-amber-500/20' : 'bg-slate-100 text-slate-400 ring-slate-200'}`}>
                                                {s.firstName[0]}{s.lastName[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{s.firstName} {s.lastName}</p>
                                                {isScholarship && <span className="text-[9px] font-black uppercase text-amber-500 mt-1 block tracking-tighter">Scholarship</span>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-medium text-slate-400">{s.admissionNumber}</td>
                                    <td className="px-6 py-5 text-sm font-medium text-slate-400">{s.classModel?.name} {s.classModel?.arm}</td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            {record?.isClearedForExam ? (
                                                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-wide border border-emerald-500/20">
                                                    <CheckCircle2 size={12} /> Cleared
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-wide border border-rose-500/20">
                                                    <AlertCircle size={12} /> Restricted
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className={`text-sm font-black ${balance > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                            ₦{balance.toLocaleString()}
                                        </p>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handleToggleClearance(s.id)}
                                                disabled={loadingToggle === s.id}
                                                className={`p-2 rounded-lg border border-slate-800 hover:bg-slate-800 transition-all ${record?.isClearedForExam ? 'text-emerald-500 hover:text-emerald-400' : 'text-rose-500 hover:text-rose-400'}`}
                                                title={record?.isClearedForExam ? 'Restrict Exam Access' : 'Grant Exam Access'}
                                            >
                                                {loadingToggle === s.id ? <Loader2 className="animate-spin" size={16} /> : record?.isClearedForExam ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                            </button>
                                            <button 
                                                onClick={() => setHistoryStudent(s)}
                                                className="p-2 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-primary-400 transition-all"
                                                title="View Payment History"
                                            >
                                                <Receipt size={16} />
                                            </button>
                                            <button 
                                                onClick={() => setSelectedStudent(s)}
                                                className="px-4 py-2 text-xs font-bold bg-slate-900 border border-slate-800 rounded-lg hover:border-primary-500 hover:text-primary-400 transition-all flex items-center gap-2"
                                            >
                                                <Plus size={14} /> Pay
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <AddStudentModal 
                isOpen={addingStudent} 
                onClose={() => setAddingStudent(false)} 
                onComplete={() => setRefresh(r => r + 1)} 
            />

            <PaymentModal 
                isOpen={!!selectedStudent} 
                onClose={() => setSelectedStudent(null)} 
                student={selectedStudent}
                onComplete={() => setRefresh(r => r + 1)}
            />

            <PaymentHistoryModal 
                isOpen={!!historyStudent} 
                onClose={() => setHistoryStudent(null)} 
                student={historyStudent}
                schoolId={schoolId}
            />
        </div>
    )
}

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const menuItems = [
        // SUPER_ADMIN (Governance/Root) Menu
        { name: 'Ecosystem Hub', icon: ShieldCheck, path: '/super-admin', roles: ['SUPER_ADMIN'] },
        { name: 'Security Vault', icon: ShieldCheck, path: '/security', roles: ['SUPER_ADMIN'] },
        { name: 'Infrastructure History', icon: ActivityIcon, path: '/audit-logs', roles: ['SUPER_ADMIN'] },
        { name: 'Verify Document', icon: ShieldCheck, path: '/verify', roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'BURSAR'] },

        // SCHOOL_ADMIN / BURSAR (Operational) Menu
        { name: 'Analytics', icon: LayoutDashboard, path: '/', roles: ['SCHOOL_ADMIN', 'BURSAR'] },
        { name: 'Student Records', icon: Users, path: '/students', roles: ['SCHOOL_ADMIN', 'BURSAR'] },
        { name: 'Upload Students', icon: Download, path: '/bulk-upload', roles: ['SCHOOL_ADMIN'] },
        { name: 'Misc. Payments', icon: CreditCard, path: '/misc-fees', roles: ['SCHOOL_ADMIN', 'BURSAR'] },
        { name: 'Scholarships', icon: GraduationCap, path: '/scholarships', roles: ['SCHOOL_ADMIN'] },
        { name: 'Staff Management', icon: Users, path: '/staff', roles: ['SCHOOL_ADMIN'] },
        { name: 'Employee Payroll', icon: CreditCard, path: '/payroll', roles: ['SCHOOL_ADMIN', 'BURSAR'] },
        { name: 'Messaging Hub', icon: MessageSquare, path: '/communication', roles: ['SCHOOL_ADMIN'] },
        { name: 'Branch Management', icon: Building2, path: '/manage-branches', roles: ['SCHOOL_ADMIN'] },
        { name: 'Local Admin Setup', icon: SettingsIcon, path: '/admin-setup', roles: ['SCHOOL_ADMIN'] },
    ];

    const visibleItems = menuItems.filter(item => user && item.roles.includes(user.role));

    const displayName = user ? `${user.firstName} ${user.lastName}` : 'Admin User';
    const displayRole = user?.role === 'SUPER_ADMIN' ? 'Super Admin' : user?.role === 'SCHOOL_ADMIN' ? 'School Admin' : user?.role || 'User';

    return (
        <aside className="w-64 flex flex-col z-30 relative bg-[#184a2c] text-white">
            <div className="p-6 border-b border-[#22633a]">
                <div className="cursor-pointer group text-center" onClick={() => navigate('/')}>
                    <h2 className="font-bold text-lg leading-tight uppercase tracking-wider text-green-50">
                        {user?.role === 'SUPER_ADMIN' ? 'EduTech Universal' : 'Amana Academy Model'}
                    </h2>
                    <p className="text-[10px] text-green-200 mt-1 uppercase tracking-widest font-black">
                        {user?.role === 'SUPER_ADMIN' ? 'Root Governance Console' : 'Branch Management Suite'}
                    </p>
                </div>
            </div>

            <nav className="flex-1 py-4 flex flex-col overflow-y-auto custom-scrollbar">
                {visibleItems.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => navigate(item.path)}
                        className={`w-full flex items-center justify-start gap-4 px-6 py-4 text-sm font-medium transition-all ${
                            location.pathname === item.path 
                            ? 'bg-[#22633a] text-white border-l-4 border-white' 
                            : 'text-green-100 hover:bg-[#22633a] hover:text-white border-l-4 border-transparent'
                        }`}
                    >
                        <item.icon size={18} className={location.pathname === item.path ? 'text-white' : 'text-green-300'} />
                        {item.name}
                    </button>
                ))}
            </nav>

            <div className="p-4 bg-[#113821] border-t border-[#22633a]">
                <button 
                    onClick={() => { logout(); navigate('/login'); }}
                    className="w-full flex items-center justify-start gap-4 px-6 py-3 text-sm text-green-100 hover:text-white transition-all rounded hover:bg-[#22633a]"
                >
                    <LogOut size={18} /> Logout
                </button>
            </div>
        </aside>
    )
}

const Navbar = ({ schoolId, onSchoolChange }) => {
    const { user } = useAuth();
    const [period, setPeriod] = useState({ session: '...', term: '...' });

    useEffect(() => {
        if (!schoolId) return;
        fetch(`${API_BASE}/super-admin/academic-periods?schoolId=${schoolId}`)
            .then(res => res.json())
            .then(data => {
                const s = data.find(s => s.isCurrent);
                const t = s?.terms.find(t => t.isCurrent);
                setPeriod({ session: s?.name || 'N/A', term: t?.name || 'N/A' });
            });
    }, [schoolId]);

    return (
        <nav className="h-20 px-10 flex items-center justify-between glass-navbar z-20">
            <div className="flex-1 max-w-2xl flex items-center gap-4">
                 <div className="px-4 py-2 bg-slate-50/80 border border-slate-200 rounded-2xl text-[11px] font-black text-slate-400 flex items-center gap-2 w-fit">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    {user?.role === 'SUPER_ADMIN' ? 'SECURE MULTI-BRANCH NETWORK ACTIVE' : 'SECURE BRANCH CONNECTION ACTIVE'}
                 </div>
                 {user?.role === 'SUPER_ADMIN' && (
                    <BranchSwitcher currentSchoolId={schoolId} onSwitch={onSchoolChange} />
                 )}
            </div>
            {user?.role !== 'SUPER_ADMIN' && (
                <div className="flex items-center gap-6 ml-6">
                    <div className="flex flex-col items-end">
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1 font-['Outfit']">Active Financial Window</p>
                        <p className="text-[11px] font-black text-primary-600 px-3 py-1 bg-primary-500/5 border border-primary-500/10 rounded-lg tracking-tighter uppercase font-['Outfit']">{period.session} • {period.term}</p>
                    </div>
                </div>
            )}
        </nav>
    )
}

const Activity = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiFetch(`${API_BASE}/payment/activity?limit=50`)
            .then(res => res.json())
            .then(data => {
                setPayments(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-20 text-center flex flex-col items-center gap-4 animate-pulse"><Loader2 size={48} className="text-primary-500 animate-spin" /><p className="text-sm font-black uppercase tracking-widest text-slate-500">Decrypting Transaction Flow...</p></div>;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black">Audit History</h1>
                    <p className="text-slate-400 text-sm mt-1">Live feed of all financial interactions in the school ledger</p>
                </div>
            </header>

            <div className="bg-white sophisticated-shadow border-slate-200 shadow-sm overflow-hidden rounded-2xl">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Recipient</th>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount Paid</th>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference / Method</th>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Time</th>
                            <th className="px-6 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {payments.map((p, i) => {
                            const student = p.feeRecord?.student;
                            return (
                                <tr key={i} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-500 text-[10px] font-black border border-primary-500/20">
                                                {student?.firstName[0]}{student?.lastName[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{student?.firstName} {student?.lastName}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{student?.classModel?.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-sm font-black text-emerald-600">₦{p.amount.toLocaleString()}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{p.paymentMethod}</p>
                                        <p className="text-[10px] text-slate-500 font-black mt-0.5">{p.reference || 'NO-REF'}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                         <p className="text-xs font-medium text-slate-400">{new Date(p.paymentDate).toLocaleDateString()}</p>
                                         <p className="text-[10px] text-slate-500 font-black mt-0.5">{new Date(p.paymentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
                                            <CheckCircle2 size={10} /> Confirmed
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const SettingsPage = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-700 max-w-4xl">
             <header>
                <h1 className="text-3xl font-black">System Preferences</h1>
                <p className="text-slate-400 text-sm mt-1">Configure internal environment parameters and administrative nodes</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white sophisticated-shadow border-slate-200 shadow-sm p-8 space-y-6">
                    <h3 className="font-bold flex items-center gap-2 border-b border-white/5 pb-4"><Building2 size={18} className="text-primary-500" /> Identity Matrix</h3>
                    <div className="space-y-4">
                         <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[2px]">School Designation</label>
                            <input disabled value="Excellence Academy Standalone" className="w-full bg-slate-50 border border-slate-200 shadow-sm rounded-xl px-4 py-2.5 text-sm text-slate-700 pointer-events-none" />
                         </div>
                         <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[2px]">Primary Admin Contact</label>
                            <input disabled value="admin@excellence.standalone" className="w-full bg-slate-50 border border-slate-200 shadow-sm rounded-xl px-4 py-2.5 text-sm text-slate-700 pointer-events-none" />
                         </div>
                    </div>
                </div>

                <div className="bg-white sophisticated-shadow border-slate-200 shadow-sm p-8 space-y-6 overflow-hidden relative">
                    <div className="absolute top-[-50px] right-[-50px] w-[150px] h-[150px] bg-primary-500/10 blur-[60px] rounded-full"></div>
                    <h3 className="font-bold flex items-center gap-2 border-b border-white/5 pb-4"><SettingsIcon size={18} className="text-primary-500" /> Environment Control</h3>
                    <div className="space-y-4">
                         <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-primary/20 transition-all">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600"><Bell size={18} /></div>
                                <div className="text-xs font-bold text-slate-900">Auto-SMS Notifications</div>
                            </div>
                            <div className="w-10 h-5 bg-emerald-500 rounded-full relative p-1 cursor-pointer">
                                <div className="w-3 h-3 bg-white rounded-full absolute right-1"></div>
                            </div>
                         </div>
                         <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-primary/20 transition-all opacity-50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary"><Download size={18} /></div>
                                <div className="text-xs font-bold text-slate-900">Cloud Sync Node</div>
                            </div>
                            <div className="w-10 h-5 bg-slate-200 rounded-full relative p-1">
                                <div className="w-3 h-3 bg-slate-400 rounded-full absolute left-1"></div>
                            </div>
                         </div>
                    </div>
                </div>
            </div>

            <div className="bg-white sophisticated-shadow border-slate-200 shadow-sm p-8 border-rose-500/10">
                <h3 className="font-bold flex items-center gap-2 border-b border-white/5 pb-4 text-rose-500"><AlertCircle size={18} /> Danger Zone</h3>
                <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <p className="font-bold text-sm">Purge & Re-seed Environment</p>
                        <p className="text-xs text-slate-500 mt-1">This will permanently delete all local transaction logs and restore initial demo state.</p>
                    </div>
                    <button className="px-6 py-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs font-black uppercase tracking-[2px] transition-all hover:bg-rose-500 hover:text-white glow-button-error whitespace-nowrap">Execute Purge Process</button>
                </div>
            </div>
        </div>
    )
}

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, token, loading } = useAuth();
    if (loading) return null;
    if (!token) return <Navigate to="/landing" />;
    if (allowedRoles.length && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
    return children;
};

const RoleBasedRedirect = ({ schoolId }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="p-20 text-center animate-pulse text-slate-500 font-bold uppercase tracking-widest">Verifying Authorization...</div>;
    
    if (user?.role === 'SUPER_ADMIN') {
        return <Navigate to="/super-admin" />;
    }
    return <Dashboard schoolId={schoolId} />;
};

const App = () => {
    const [schoolId, setSchoolId] = useState(localStorage.getItem('activeSchoolId') || '');
    const [isInitialized, setIsInitialized] = useState(true);
    const [checkingStatus, setCheckingStatus] = useState(true);

    const handleSchoolChange = (id) => {
        setSchoolId(id);
        localStorage.setItem('activeSchoolId', id);
    };

    useEffect(() => {
        // FAILSAFE: Force loading to end after 8 seconds if fetch hangs
        const timer = setTimeout(() => {
            if (checkingStatus) {
                console.warn('System status check timed out. Proceeding with caution.');
                setCheckingStatus(false);
            }
        }, 8000);

        // Check if system is initialized (Public endpoint)
        const controller = new AbortController();
        
        fetch(`${API_BASE}/system/status`, { signal: controller.signal })
            .then(res => res.json())
            .then(status => {
                setIsInitialized(status.isInitialized);
                setCheckingStatus(false);
                clearTimeout(timer);
            })
            .catch(err => {
                console.error('Status check failed:', err);
                // On failure, the failsafe timer will eventually let the user in
            });

        return () => {
            controller.abort();
            clearTimeout(timer);
        };
    }, []);

    if (checkingStatus) {
        return (
            <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center gap-6">
                <EduTechLogo size={80} className="animate-pulse shadow-2xl shadow-primary-500/20 rounded-3xl" />
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin text-primary-500" size={32} />
                    <div className="text-center group">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[4px]">Initializing EduTech Suite...</p>
                        <p className="text-[8px] font-bold text-slate-700 uppercase tracking-[2px] mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Verifying Local Data Integrity</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <AuthProvider>
            <InstallPWA />
            <Routes>
                <Route path="/" element={<Navigate to="/landing" />} />
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/setup" element={<SetupWizard />} />
                
                <Route path="/*" element={
                    <ProtectedRoute>
                        <div className="flex h-screen bg-slate-50 text-slate-800 overflow-hidden font-outfit">
                            <Sidebar />
                            <div className="flex-1 flex flex-col overflow-hidden relative">
                                <Navbar schoolId={schoolId} onSchoolChange={handleSchoolChange} />
                                <main className="flex-1 overflow-y-auto p-10 custom-scrollbar relative z-10 bg-white/40">
                                    <Routes>
                                        <Route path="/" element={<RoleBasedRedirect schoolId={schoolId} />} />
                                        <Route path="/super-admin" element={
                                            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                                                <SuperAdminDashboard onSchoolChange={handleSchoolChange} />
                                            </ProtectedRoute>
                                        } />
                                        <Route path="/security" element={
                                            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                                                <SecuritySettings />
                                            </ProtectedRoute>
                                        } />
                                        <Route path="/verify" element={
                                            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'SCHOOL_ADMIN', 'BURSAR']}>
                                                <DocumentVerification />
                                            </ProtectedRoute>
                                        } />
                                        <Route path="/communication" element={
                                            <ProtectedRoute allowedRoles={['SCHOOL_ADMIN']}>
                                                <CommunicationHub />
                                            </ProtectedRoute>
                                        } />
                                        <Route path="/students" element={
                                            <ProtectedRoute allowedRoles={['SCHOOL_ADMIN', 'BURSAR']}>
                                                <Students schoolId={schoolId} />
                                            </ProtectedRoute>
                                        } />
                                        <Route path="/bulk-upload" element={
                                            <ProtectedRoute allowedRoles={['SCHOOL_ADMIN']}>
                                                <BulkUpload schoolId={schoolId} />
                                            </ProtectedRoute>
                                        } />
                                        <Route path="/misc-fees" element={
                                            <ProtectedRoute allowedRoles={['SCHOOL_ADMIN', 'BURSAR']}>
                                                <MiscFees schoolId={schoolId} />
                                            </ProtectedRoute>
                                        } />
                                        <Route path="/scholarships" element={
                                            <ProtectedRoute allowedRoles={['SCHOOL_ADMIN']}>
                                                <Scholarships schoolId={schoolId} />
                                            </ProtectedRoute>
                                        } />
                                        <Route path="/staff" element={
                                            <ProtectedRoute allowedRoles={['SCHOOL_ADMIN']}>
                                                <StaffManagement schoolId={schoolId} />
                                            </ProtectedRoute>
                                        } />
                                        <Route path="/payroll" element={
                                            <ProtectedRoute allowedRoles={['SCHOOL_ADMIN', 'BURSAR']}>
                                                <PayrollConsole schoolId={schoolId} />
                                            </ProtectedRoute>
                                        } />
                                        <Route path="/admin-setup" element={
                                            <ProtectedRoute allowedRoles={['SCHOOL_ADMIN']}>
                                                <AdminSetup schoolId={schoolId} />
                                            </ProtectedRoute>
                                        } />
                                        <Route path="/manage-branches" element={
                                            <ProtectedRoute allowedRoles={['SCHOOL_ADMIN']}>
                                                <BranchManagement />
                                            </ProtectedRoute>
                                        } />
                                        <Route path="/audit-logs" element={
                                            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'SCHOOL_ADMIN']}>
                                                <AuditLogs schoolId={schoolId} />
                                            </ProtectedRoute>
                                        } />
                                        <Route path="*" element={<Navigate to="/" />} />
                                    </Routes>
                                </main>
                            </div>
                        </div>
                    </ProtectedRoute>
                } />
            </Routes>
        </AuthProvider>
    )
}

export default App
