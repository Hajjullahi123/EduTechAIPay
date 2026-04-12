import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Plus, Users, BarChart3, ArrowUpRight, Loader2, Search, UserCheck, ShieldCheck, Mail, Phone, MapPin, X, Trash2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

const SuperAdminDashboard = ({ onSchoolChange }) => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [summary, setSummary] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('schools');
    
    const [showSchoolModal, setShowSchoolModal] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);
    const [schoolData, setSchoolData] = useState({ name: '', address: '', phone: '', email: '' });
    const [userData, setUserData] = useState({ username: '', firstName: '', lastName: '', role: 'SCHOOL_ADMIN', password: '', schoolId: '', admissionNumber: '', classId: '' });
    const [createdCredentials, setCreatedCredentials] = useState(null);
    const [resetCreds, setResetCreds] = useState(null);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            fetch(`${API_BASE}/super-admin/summary`, { headers: { 'Authorization': `Bearer ${token}` } }),
            fetch(`${API_BASE}/super-admin/users`, { headers: { 'Authorization': `Bearer ${token}` } })
        ])
        .then(async ([sRes, uRes]) => {
            setSummary(await sRes.json());
            setUsers(await uRes.json());
            setLoading(false);
        })
        .catch(() => setLoading(false));
    }, [token]);

    const handleResetPassword = async (userId) => {
        if (!confirm('Are you sure you want to REGENERATE credentials for this user? This will overwrite their current password.')) return;
        try {
            const res = await fetch(`${API_BASE}/super-admin/users/${userId}/reset-password`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setResetCreds(data);
        } catch (err) { alert(err.message); }
    };

    const handleCreateSchool = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE}/super-admin/schools`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(schoolData)
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setCreatedCredentials(data);
            setShowSchoolModal(false);
        } catch (err) { alert(err.message); }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE}/super-admin/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(userData)
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setShowUserModal(false);
            window.location.reload();
        } catch (err) { alert(err.message); }
    };

    const handleDeleteSchool = async (id, name) => {
        if (!confirm(`DANGER: Are you sure you want to PERMANENTLY DELETE "${name}"? This action is irreversible and will purge all linked records.`)) return;
        try {
            const res = await fetch(`${API_BASE}/super-admin/schools/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            window.location.reload();
        } catch (err) { alert(err.message); }
    };

    if (loading) return <div className="flex items-center justify-center p-20 min-h-screen text-slate-400 font-bold uppercase tracking-[4px] animate-pulse">Synchronizing Universal Ledger...</div>;

    return (
        <div className="space-y-10 animate-in fade-in duration-700 max-w-7xl mx-auto px-4">
            <header className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 text-[10px] font-black text-primary uppercase tracking-[4px] mb-3">
                        <ShieldCheck size={14} className="text-primary-500" /> Executive Ecosystem Hub
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none">Global Control Panel</h1>
                    <p className="text-slate-500 font-medium mt-3">Overseeing {summary?.schoolCount} school branches and {users?.length} system accounts</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => setShowSchoolModal(true)} className="btn-primary shadow-2xl flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center transition-all group-hover:rotate-90">
                           <Plus size={18} />
                        </div>
                        Add New Branch
                    </button>
                    <button onClick={() => setShowUserModal(true)} className="px-8 py-4 bg-slate-900 border border-slate-800 rounded-2xl font-black uppercase text-[11px] tracking-[2px] hover:bg-slate-800 text-white transition-all shadow-xl shadow-slate-900/10 flex items-center gap-2">
                        <Users size={18} /> Add New Admin
                    </button>
                </div>
            </header>

            {/* Global Stats Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { icon: Building2, label: 'Active Branches', value: summary?.schoolCount, color: 'text-primary' },
                    { icon: Users, label: 'Global Enrollment', value: summary?.totalStudents, color: 'text-gold' },
                    { icon: UserCheck, label: 'Active Accounts', value: users?.length, color: 'text-rose-500' },
                    { icon: ShieldCheck, label: 'System Health', value: '100%', color: 'text-emerald-500' }
                ].map((s, i) => (
                    <div key={i} className="glass-card p-8 sophisticated-shadow bg-white hover:border-primary/20 transition-all cursor-default">
                        <div className={`p-3 rounded-2xl bg-slate-50 w-fit mb-6 ${s.color}`}>
                            <s.icon size={24} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                        <h4 className="text-4xl font-black text-slate-900 mt-2">{s.value}</h4>
                    </div>
                ))}
            </div>

            {/* Interface Tabs */}
            <div className="flex gap-4 p-1.5 bg-slate-100 rounded-2xl w-fit">
                <button 
                  onClick={() => setActiveTab('schools')}
                  className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'schools' ? 'bg-white text-primary shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  Branches
                </button>
                <button 
                  onClick={() => setActiveTab('users')}
                  className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-white text-primary shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  Administrators
                </button>
            </div>

            {/* Dynamic Data Table */}
            <div className="glass-card overflow-hidden bg-white sophisticated-shadow border-slate-200">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <h3 className="font-bold text-xl text-slate-900">
                      {activeTab === 'schools' ? 'School Branches' : 'Administrator Accounts'}
                    </h3>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
                        <input type="text" className="bg-white border border-slate-200 rounded-xl pl-11 pr-6 py-3 text-xs font-medium w-80 focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm" placeholder={activeTab === 'schools' ? "Search branches..." : "Search administrators..."} />
                    </div>
                </div>
                
                {activeTab === 'schools' ? (
                  <table className="w-full text-left">
                    <thead>
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] border-b border-slate-50 bg-slate-50/30">
                            <th className="px-8 py-5">Branch Name</th>
                            <th className="px-8 py-5">Address</th>
                            <th className="px-8 py-5">Students Enrolled</th>
                            <th className="px-8 py-5 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {summary?.branches.map(school => (
                            <tr key={school.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-8 py-7">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors ring-1 ring-inset ring-slate-200 group-hover:ring-primary/20">
                                            <Building2 size={24} />
                                        </div>
                                        <div>
                                            <p className="text-md font-bold text-slate-900">{school.name}</p>
                                            <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1">Branch Entity (ID: {school.id})</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-7">
                                    <div className="space-y-1.5">
                                      <p className="text-xs text-slate-600 font-bold flex items-center gap-2"><MapPin size={12} className="text-slate-400" /> {school.address || '--'}</p>
                                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2"><Mail size={12} /> {school.email}</p>
                                    </div>
                                </td>
                                <td className="px-8 py-7">
                                    <div className="flex flex-col gap-2">
                                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-[120px]">
                                        <div className="h-full bg-gold rounded-full" style={{ width: '85%' }}></div>
                                      </div>
                                      <p className="text-[10px] font-black uppercase text-gold tracking-widest">{school._count.students} Students</p>
                                    </div>
                                </td>
                                <td className="px-8 py-7 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => { 
                                                onSchoolChange(school.id);
                                                navigate('/', { replace: true }); 
                                            }} 
                                            className="px-4 py-2 rounded-xl hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-primary flex items-center gap-2 transition-all shadow-sm font-bold text-xs"
                                        >
                                            <ArrowUpRight size={16} /> Enter
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteSchool(school.id, school.name)} 
                                            className="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center gap-2 transition-all shadow-sm font-bold text-xs"
                                        >
                                            <Trash2 size={16} /> Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                  </table>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] border-b border-slate-50 bg-slate-50/30">
                            <th className="px-8 py-5">Corporate Entity</th>
                            <th className="px-8 py-5">Authority Level</th>
                            <th className="px-8 py-5">Linked Node</th>
                            <th className="px-8 py-5 text-right">Interaction</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-8 py-7">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors ring-1 ring-inset ring-slate-200 group-hover:ring-primary/20 p-1">
                                            <img src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=f1f5f9&color=64748b&bold=true`} alt="entity" className="w-full h-full rounded-xl object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-md font-bold text-slate-900 font-['Outfit']">{user.firstName} {user.lastName}</p>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Ref: {user.username}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-7">
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[2px] border transition-all ${
                                      user.role === 'SUPER_ADMIN' ? 'bg-primary/10 text-primary border-primary/20' :
                                      user.role === 'STUDENT' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                      'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                    }`}>
                                      {user.role}
                                    </span>
                                </td>
                                <td className="px-8 py-7 text-xs font-bold text-slate-400 group-hover:text-slate-900 transition-colors uppercase tracking-widest">
                                    {user.schoolId ? (summary?.branches.find(b => b.id === user.schoolId)?.name || `Node ${user.schoolId}`) : 'Global Ecosystem'}
                                </td>
                                <td className="px-8 py-7 text-right">
                                    <button 
                                        onClick={() => handleResetPassword(user.id)}
                                        title="Regenerate Credentials"
                                        className="p-3 rounded-xl hover:bg-emerald-50 border border-transparent hover:border-emerald-100 text-slate-400 hover:text-emerald-600 transition-all shadow-sm"
                                    >
                                        <ShieldCheck size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                  </table>
                )}
            </div>

            {/* Provision Modal Layer */}
            {showSchoolModal && (
                <Modal title="Add New School Branch" onClose={() => setShowSchoolModal(false)}>
                  <form className="space-y-6" onSubmit={handleCreateSchool}>
                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Branch Name</label>
                          <input required className="input-field" placeholder="Darul Quran Academy" onChange={e => setSchoolData({...schoolData, name: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Address</label>
                          <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-300 resize-none h-24 font-bold" placeholder="e.g. 15 Main Street, Wuse 2" onChange={e => setSchoolData({...schoolData, address: e.target.value})}></textarea>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                              <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-300 font-bold" placeholder="e.g. +234 800 000 0000" onChange={e => setSchoolData({...schoolData, phone: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                              <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-300 font-bold" placeholder="e.g. admin@academy.edu" onChange={e => setSchoolData({...schoolData, email: e.target.value})} />
                          </div>
                      </div>
                      <div className="flex gap-4 pt-4">
                          <button type="button" onClick={() => setShowSchoolModal(false)} className="flex-1 px-8 py-4 bg-slate-100 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
                          <button type="submit" className="btn-primary flex-1 shadow-2xl">Add Branch</button>
                      </div>
                  </form>
                </Modal>
            )}

            {showUserModal && (
                <Modal title="Add New Administrator" onClose={() => setShowUserModal(false)}>
                  <form className="space-y-6" onSubmit={handleCreateUser}>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">First Name</label>
                            <input required className="input-field" placeholder="e.g. Ahmad" onChange={e => setUserData({...userData, firstName: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Name</label>
                            <input required className="input-field" placeholder="e.g. Ibrahim" onChange={e => setUserData({...userData, lastName: e.target.value})} />
                        </div>
                      </div>
                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Username</label>
                          <input required className="input-field" placeholder="e.g. ahmad.ibrahim" onChange={e => setUserData({...userData, username: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Administrator Role</label>
                              <select className="input-field" value={userData.role} onChange={e => setUserData({...userData, role: e.target.value})}>
                                <option value="SCHOOL_ADMIN">School Principal / Admin</option>
                                <option value="STUDENT">Student</option>
                                <option value="BURSAR">Bursar / Financial Officer</option>
                              </select>
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assign to Branch</label>
                              <select className="input-field" required onChange={e => setUserData({...userData, schoolId: e.target.value})}>
                                <option value="">Select School Branch</option>
                                {summary?.branches.map(b => (
                                  <option key={b.id} value={b.id}>{b.name}</option>
                                ))}
                              </select>
                          </div>
                      </div>
                      
                      {userData.role === 'STUDENT' && (
                        <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 animate-in zoom-in-95 duration-300">
                          <p className="text-[10px] font-black text-primary uppercase tracking-[4px] mb-4">Student Academic Details</p>
                          <div className="grid grid-cols-2 gap-4">
                             <input className="input-field bg-white" placeholder="Admission No (e.g. DQA-001)" onChange={e => setUserData({...userData, admissionNumber: e.target.value})} />
                             <input className="input-field bg-white" type="number" placeholder="Class ID (e.g. 1)" onChange={e => setUserData({...userData, classId: e.target.value})} />
                          </div>
                        </div>
                      )}

                      <div className="flex gap-4 pt-4">
                          <button type="button" onClick={() => setShowUserModal(false)} className="flex-1 px-8 py-4 bg-slate-100 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
                          <button type="submit" className="btn-primary flex-1 shadow-2xl">Create User</button>
                      </div>
                  </form>
                </Modal>
            )}

            {createdCredentials && (
                <Modal title="Security Protocol Action" onClose={() => { setCreatedCredentials(null); window.location.reload(); }}>
                    <div className="space-y-8 p-8 border-2 border-dashed border-emerald-100 rounded-[32px] bg-emerald-50/30 print:border-none print:bg-white print:p-0">
                        <header className="text-center space-y-2">
                             <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto text-white shadow-lg shadow-emerald-500/20 print:hidden">
                                 <ShieldCheck size={32} />
                             </div>
                             <h4 className="text-2xl font-black text-slate-900 mt-4 leading-tight">Branch Access Established</h4>
                             <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[3px]">Primary Administrator Provisioned</p>
                        </header>

                        <div className="space-y-5">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Target Ecosystem Node</p>
                                <p className="text-xl font-black text-slate-900">{createdCredentials.school.name}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Admin User</p>
                                    <p className="text-sm font-black text-primary break-all">{createdCredentials.admin.username}</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Temp Password</p>
                                    <p className="text-lg font-black text-emerald-600 tracking-tighter uppercase">{createdCredentials.tempPassword}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 print:hidden">
                            <button 
                              onClick={() => window.print()}
                              className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2"
                            >
                                <ArrowUpRight size={16} /> Print Credentials
                            </button>
                            <button 
                              onClick={() => { setCreatedCredentials(null); window.location.reload(); }}
                              className="px-8 py-4 bg-white border border-slate-200 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-500 hover:bg-slate-50"
                            >
                                Done
                            </button>
                        </div>
                        
                        <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest leading-relaxed print:mt-10">
                            Warning: This credential set is highly sensitive. <br/> Please hand this securely to the target branch principal.
                        </p>
                    </div>
                </Modal>
            )}

            {resetCreds && (
                <Modal title="Credentials Regenerated" onClose={() => setResetCreds(null)}>
                    <div className="space-y-6 p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100">
                        <div className="space-y-4">
                            <div className="bg-white p-5 rounded-2xl border border-emerald-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Username</p>
                                <p className="text-lg font-black text-slate-900">{resetCreds.username}</p>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-emerald-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">New Temporary Password</p>
                                <p className="text-2xl font-black text-emerald-600 tracking-tighter">{resetCreds.tempPassword}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setResetCreds(null)}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-800 transition-all"
                        >
                            Done
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xl z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="glass-card w-full max-w-xl p-12 sophisticated-shadow bg-white animate-in zoom-in-95 duration-400 shadow-2xl relative">
          <button onClick={onClose} className="absolute right-8 top-8 p-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm">
            <X size={20} />
          </button>
          <div className="mb-10">
            <h3 className="text-3xl font-black text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-500 text-sm font-medium">Configure ecosystem node with universal parameters</p>
          </div>
          {children}
      </div>
  </div>
);

export default SuperAdminDashboard;
