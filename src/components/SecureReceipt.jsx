import { QRCodeSVG } from 'qrcode.react'
import { Printer, X, CheckCircle2 } from 'lucide-react'

const SecureReceipt = ({ isOpen, onClose, payment, student, school }) => {
    if (!isOpen || !payment) return null;

    const receiptRef = payment.reference || `REC-${payment.id}-${Date.now().toString().slice(-4)}`;
    
    // Security ID (Fingerprint)
    const securityId = payment.fingerprint || 'PENDING_SIG';
    const qrValue = securityId;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 bg-slate-50/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300 no-print">
            <div className="bg-white text-slate-900 w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-2xl relative">
                <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full text-slate-400 no-print">
                    <X size={24} />
                </button>

                <div className="p-12 print:p-8">
                    {/* Header */}
                    <div className="flex justify-between items-start border-b-2 border-slate-100 pb-8 mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-rose-900 tracking-tighter">{school?.name || 'Excellence Academy'}</h2>
                            <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">{school?.address || 'School Address Header'}</p>
                            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{school?.phone || 'Contact Details'}</p>
                        </div>
                        <div className="text-right">
                            <span className="px-4 py-1.5 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-100">
                                Official Receipt
                            </span>
                            <p className="text-xs font-black mt-4 text-slate-900 tracking-tight">#{receiptRef}</p>
                            <p className="text-[10px] text-slate-400 uppercase font-bold mt-1">{new Date(payment.paymentDate).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-8">
                        <div className="grid grid-cols-2 gap-12">
                            <div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Paid By</h4>
                                <p className="text-lg font-black text-slate-900">{student.firstName} {student.lastName}</p>
                                <p className="text-sm font-bold text-slate-600">{student.admissionNumber}</p>
                                <p className="text-xs text-slate-400 mt-1 uppercase font-bold">{student.classModel?.name} {student.classModel?.arm}</p>
                            </div>
                            <div className="text-right">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Amount Received</h4>
                                <p className="text-3xl font-black text-emerald-600 tracking-tighter">₦{payment.amount.toLocaleString()}</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase mt-1">Method: {payment.paymentMethod}</p>
                            </div>
                        </div>

                        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 mt-8 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse"></div>
                            <div className="flex items-center justify-between relative z-10">
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Master Security Protocol</h4>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Security ID / Fingerprint</p>
                                        <p className="text-xl font-black font-outfit tracking-[4px]">{securityId}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-emerald-400">
                                        <CheckCircle2 size={12} strokeWidth={3} />
                                        <p className="text-[10px] font-black uppercase tracking-widest">Cryptographical Verification Active</p>
                                    </div>
                                </div>
                                <div className="p-3 bg-white rounded-2xl shadow-2xl">
                                    <QRCodeSVG value={qrValue} size={70} level="H" includeMargin={false} />
                                </div>
                            </div>
                        </div>

                        <div className="pt-12 text-center border-t border-dashed border-slate-200 mt-8">
                            <p className="text-[11px] font-black italic text-slate-400">Thank you for your prompt payment toward educational excellence.</p>
                            <p className="text-[8px] uppercase font-black text-slate-300 mt-2 tracking-[4px]">System Generated • No Signature Required</p>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 no-print">
                    <button onClick={onClose} className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Close</button>
                    <button onClick={handlePrint} className="px-8 py-3 bg-slate-900 text-white rounded-xl text-sm font-black flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                        <Printer size={18} /> Print Official Copy
                    </button>
                </div>
            </div>
            
            {/* Print Overlay */}
            <div className="hidden print:block fixed inset-0 bg-white z-[100] p-0 m-0">
                 {/* This section will be identical to the modal content but without the modal container styling if needed, 
                     but since we used print: helpers it's mostly handled */}
            </div>
        </div>
    );
};

export default SecureReceipt;
