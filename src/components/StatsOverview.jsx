import { CreditCard, LayoutDashboard, Receipt, GraduationCap, ArrowUpRight } from 'lucide-react'

const StatsOverview = ({ stats }) => {
    if (!stats || stats.error || typeof stats.totalPaid === 'undefined') return null;

    const cards = [
        { 
            label: 'Total Collected', 
            value: `₦${stats.totalPaid.toLocaleString()}`, 
            sub: 'Real-time Total',
            icon: CreditCard, 
            color: 'text-emerald-500', 
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20'
        },
        { 
            label: 'Revenue Target', 
            value: `₦${stats.totalExpected.toLocaleString()}`, 
            sub: 'Expected Income',
            icon: LayoutDashboard, 
            color: 'text-primary-500', 
            bg: 'bg-primary-500/10',
            border: 'border-primary-500/20'
        },
        { 
            label: 'Unpaid Balance', 
            value: `₦${stats.totalBalance.toLocaleString()}`, 
            sub: 'Debt Recovery',
            icon: Receipt, 
            color: 'text-rose-500', 
            bg: 'bg-rose-500/10',
            border: 'border-rose-500/20'
        },
        { 
            label: 'Payment Progress', 
            value: stats.totalExpected > 0 ? `${Math.round((stats.totalPaid / stats.totalExpected) * 100)}%` : '0%', 
            sub: `${stats.clearedStudents} Students Cleared`,
            icon: GraduationCap, 
            color: 'text-gold', 
            bg: 'bg-gold/10',
            border: 'border-gold/20'
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((stat, i) => (
                <div key={i} className={`glass-card p-6 flex items-start justify-between border-slate-200 group hover:${stat.border} transition-all hover:translate-y-[-2px] bg-white sophisticated-shadow`}>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">{stat.label}</p>
                        <h3 className="text-2xl font-black mt-3 text-slate-900 transition-colors tracking-tight">{stat.value}</h3>
                        <p className={`text-[10px] font-bold mt-4 flex items-center gap-1 ${stat.color} opacity-90 uppercase tracking-tighter`}>
                            <ArrowUpRight size={12} /> {stat.sub}
                        </p>
                    </div>
                    <div className={`p-4 rounded-2xl ${stat.bg} ring-1 ring-inset ${stat.border}`}>
                        <stat.icon className={stat.color} size={24} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsOverview;
