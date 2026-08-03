import React from 'react';
import { Admission, PaymentTransaction, PaymentSettings } from '../types';
import { Printer, X, CheckCircle, Clock, ShieldCheck, DollarSign } from 'lucide-react';

interface PrintableReceiptModalProps {
  admission: Admission;
  transaction?: PaymentTransaction;
  paymentSettings?: PaymentSettings;
  logoUrl?: string;
  onClose: () => void;
}

export const PrintableReceiptModal: React.FC<PrintableReceiptModalProps> = ({
  admission,
  transaction,
  paymentSettings,
  logoUrl,
  onClose,
}) => {
  const tuition = admission.tuitionFee || 0;
  const regFee = admission.regFee || 0;
  const discount = admission.discountAmount || 0;
  const totalNetFee = Math.max(0, tuition + regFee - discount);

  // If transaction is passed, use it, otherwise use latest from history or fallback
  const latestTx = transaction || (admission.paymentHistory && admission.paymentHistory.length > 0
    ? admission.paymentHistory[admission.paymentHistory.length - 1]
    : null);

  const totalPaidSoFar = admission.paidAmount !== undefined
    ? admission.paidAmount
    : (admission.feeStatus === 'Paid' || admission.feeStatus === 'Approved' ? totalNetFee : 0);

  const currentPaymentAmount = latestTx ? latestTx.amount : (totalPaidSoFar > 0 ? totalPaidSoFar : 0);
  const remainingDues = admission.remainingBalance !== undefined
    ? admission.remainingBalance
    : Math.max(0, totalNetFee - totalPaidSoFar);

  const receiptNo = latestTx?.receiptNo || admission.receiptNumber || `REC-${admission.id.replace('ADM-', '')}`;
  const paymentDate = latestTx?.date
    ? new Date(latestTx.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const paymentMode = latestTx?.paymentMode || (admission.receiptNumber ? 'Cash / Deposit' : 'Cash');

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      alert('Please allow popups for this site to print receipts.');
      return;
    }

    const paymentHistoryRows = (admission.paymentHistory && admission.paymentHistory.length > 1)
      ? admission.paymentHistory.map((tx, idx) => `
          <div class="ledger-row">
            <span class="mono">#${idx + 1} ${tx.receiptNo} (${tx.paymentMode})</span>
            <span class="date">${new Date(tx.date).toLocaleDateString()}</span>
            <span class="amount">PKR ${tx.amount.toLocaleString()}</span>
          </div>`).join('')
      : '';

    const discountRow = discount > 0
      ? `<tr><td>Applied Special Discount</td><td class="right amber">- PKR ${discount.toLocaleString()}</td></tr>`
      : '';

    const prevPaidRow = latestTx
      ? `<tr><td style="color:#666">Previously Paid Amount</td><td class="right mono" style="color:#555">PKR ${Math.max(0, totalPaidSoFar - currentPaymentAmount).toLocaleString()}</td></tr>`
      : '';

    const remainingClass = remainingDues > 0 ? 'row-amber' : 'row-green';
    const remainingLabel = remainingDues > 0 ? 'OUTSTANDING REMAINING BALANCE' : 'FEES FULLY CLEARED & PAID';

    printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Receipt - ${receiptNo} | The Chef's Academy</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 12px; color: #111; background: #fff; padding: 20px; }
    .header { text-align: center; border-bottom: 2px solid #111; padding-bottom: 10px; margin-bottom: 14px; }
    .header h1 { font-size: 22px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; }
    .header .addr { font-size: 10px; font-weight: bold; color: #b45309; text-transform: uppercase; letter-spacing: 1px; margin-top: 3px; }
    .header .contact { font-size: 9px; color: #555; margin-top: 2px; }
    .badge { display: inline-block; background: #111; color: #fff; font-size: 10px; font-weight: bold; padding: 2px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px; margin-top: 6px; }
    .amount-box { background: #ecfdf5; border: 2px solid #10b981; border-radius: 10px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; margin: 14px 0; }
    .amount-box .label { font-size: 9px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #065f46; display: block; }
    .amount-box .mode { font-size: 11px; color: #064e3b; }
    .amount-box .big { font-size: 24px; font-weight: 900; font-family: monospace; color: #047857; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 14px; font-size: 11px; }
    .meta-grid .right { text-align: right; }
    .meta-label { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: #888; display: block; }
    .meta-value { font-weight: 700; font-family: monospace; color: #0f172a; font-size: 12px; }
    .meta-value.amber { color: #92400e; }
    .meta-value.green { background: #ecfdf5; border: 1px solid #6ee7b7; color: #065f46; padding: 1px 6px; border-radius: 4px; text-transform: uppercase; font-family: Arial; }
    .section { border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 14px; font-size: 11px; }
    .section .row { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; padding: 4px 0; }
    .section .row + .row { border-top: 1px solid #f1f5f9; }
    .section .row .label { color: #888; }
    .section .row .value { font-weight: 700; color: #0f172a; }
    .section .course-row { padding-top: 6px; border-top: 1px solid #f1f5f9; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 14px; }
    th { background: #f1f5f9; color: #475569; font-size: 9px; text-transform: uppercase; letter-spacing: 1px; padding: 8px 10px; border-bottom: 1px solid #cbd5e1; text-align: left; }
    th.right, td.right { text-align: right; }
    td { padding: 7px 10px; border-bottom: 1px solid #e2e8f0; color: #1e293b; }
    .mono { font-family: monospace; font-weight: 600; }
    .amber { color: #92400e; background: #fffbeb; }
    .row-emerald td { background: #ecfdf5; color: #064e3b; font-weight: bold; border-top: 2px solid #10b981; }
    .row-slate td { background: #f1f5f9; font-weight: bold; border-top: 1px solid #cbd5e1; }
    .row-amber td { background: #fffbeb; color: #78350f; font-weight: bold; border-top: 2px solid #f59e0b; }
    .row-green td { background: #ecfdf5; color: #065f46; font-weight: bold; border-top: 2px solid #10b981; }
    .ledger-box { border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; background: #f8fafc; margin-bottom: 14px; }
    .ledger-title { font-size: 9px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #666; margin-bottom: 6px; }
    .ledger-row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #e2e8f0; font-size: 10px; }
    .ledger-row:last-child { border-bottom: none; }
    .ledger-row .date { color: #888; }
    .ledger-row .amount { font-family: monospace; font-weight: bold; color: #0f172a; }
    .footer { display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid #cbd5e1; padding-top: 12px; margin-top: 10px; font-size: 9.5px; color: #666; }
    .footer .sig { text-align: center; width: 160px; }
    .footer .sig .line { border-bottom: 1px solid #999; padding-bottom: 4px; margin-bottom: 4px; font-family: monospace; font-size: 9px; color: #aaa; }
    .footer .sig .name { font-weight: bold; color: #0f172a; font-size: 11px; }
    @media print { body { padding: 10px; } @page { size: A4 portrait; margin: 0.6cm; } }
  </style>
</head>
<body>
  <div class="header">
    <div style="display:flex; align-items:center; justify-content:center; gap:12px; margin-bottom:8px;">
      ${logoUrl ? `<img src="${logoUrl}" alt="TCA Logo" style="height:64px;object-fit:contain;display:block;">` : ''}
      <h1 style="font-size:26px; font-weight:bold; letter-spacing:0px; margin:0; line-height:1; text-align:left; font-family:Georgia, serif; color:#111; text-transform:none;">
        <span style="font-size:18px; font-weight:normal;">The</span> Chef's<br/>Academy
      </h1>
    </div>
    <div class="addr">79-B3 Gulberg III, Lahore, Pakistan</div>
    <div class="contact">Helpline: 0333-9123456 | Email: info@thechefsacademy.pk | Web: www.thechefsacademy.pk</div>
    <span class="badge">Official Payment Receipt</span>
  </div>

  <div class="amount-box">
    <div>
      <span class="label">Cash Payment Received In This Receipt</span>
      <span class="mode">Payment Mode: ${paymentMode}</span>
    </div>
    <span class="big">PKR ${currentPaymentAmount.toLocaleString()}</span>
  </div>

  <div class="meta-grid">
    <div>
      <span class="meta-label">Receipt Number</span>
      <span class="meta-value mono">${receiptNo}</span>
    </div>
    <div class="right">
      <span class="meta-label">Date &amp; Time</span>
      <span class="meta-value">${paymentDate}</span>
    </div>
    <div>
      <span class="meta-label">Tracking Code</span>
      <span class="meta-value amber">${admission.id}</span>
    </div>
    <div class="right">
      <span class="meta-label">Payment Mode</span>
      <span class="meta-value green">${paymentMode}</span>
    </div>
  </div>

  <div class="section">
    <div class="row">
      <div><span class="label">Candidate Name:</span> <span class="value">${admission.studentName}</span></div>
      <div><span class="label">Father Name:</span> <span class="value">${admission.fatherName || '—'}</span></div>
    </div>
    <div class="row">
      <div><span class="label">CNIC / B-Form:</span> <span class="value mono">${admission.cnic || '—'}</span></div>
      <div><span class="label">Contact Phone:</span> <span class="value mono">${admission.phone || '—'}</span></div>
    </div>
    <div class="course-row">
      <span class="label">Course Program:</span>
      <strong> ${admission.selectedCourseTitle}</strong>
      <span style="color:#666"> (${admission.shift || '—'})</span>
    </div>
  </div>

  <table>
    <thead>
      <tr><th>Description</th><th class="right">Amount (PKR)</th></tr>
    </thead>
    <tbody>
      <tr><td>Tuition &amp; Training Fee</td><td class="right mono">PKR ${tuition.toLocaleString()}</td></tr>
      <tr><td>Registration / Admission Fee</td><td class="right mono">PKR ${regFee.toLocaleString()}</td></tr>
      ${discountRow}
      <tr class="row-slate"><td>Net Total Course Fee</td><td class="right mono">PKR ${totalNetFee.toLocaleString()}</td></tr>
      ${prevPaidRow}
      <tr class="row-emerald">
        <td>RECEIVED IN THIS PAYMENT (${paymentMode.toUpperCase()})</td>
        <td class="right mono" style="font-size:13px">PKR ${currentPaymentAmount.toLocaleString()}</td>
      </tr>
      <tr class="row-slate"><td>Total Paid Amount To Date</td><td class="right mono">PKR ${totalPaidSoFar.toLocaleString()}</td></tr>
      <tr class="${remainingClass}">
        <td style="font-size:12px;text-transform:uppercase">${remainingLabel}</td>
        <td class="right mono" style="font-size:13px">PKR ${remainingDues.toLocaleString()}</td>
      </tr>
    </tbody>
  </table>

  ${paymentHistoryRows ? `
  <div class="ledger-box">
    <div class="ledger-title">Installment Payment Ledger History</div>
    ${paymentHistoryRows}
  </div>` : ''}

  <div class="footer">
    <div>
      <p><strong>Terms &amp; Conditions:</strong></p>
      <p>1. Fee once deposited is non-refundable &amp; non-transferable.</p>
      <p>2. Please retain this official computerised receipt for batch admission verification.</p>
    </div>
  </div>

  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>`);
    printWindow.document.close();
  };

  return (
    <div className="printable-modal-overlay fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[9999] flex items-start justify-center p-2 sm:p-4 pt-16 sm:pt-20 pb-10 overflow-y-auto print:p-0 print:bg-white print:static print:inset-auto">
      
      {/* ALWAYS VISIBLE FLOATING TOP ACTION BAR (Screen Only) */}
      <div className="print:hidden fixed top-4 right-4 sm:top-6 sm:right-6 z-[10000] flex items-center space-x-2 bg-slate-950 border border-slate-700 p-2 rounded-2xl shadow-2xl backdrop-blur">
        <button
          onClick={handlePrint}
          className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center space-x-2 transition-all cursor-pointer shadow-lg shadow-emerald-600/30"
        >
          <Printer className="h-4 w-4" />
          <span>Print / Download PDF</span>
        </button>
        <button
          onClick={onClose}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-2 rounded-xl text-xs flex items-center space-x-1 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
          <span>Close</span>
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full text-slate-100 shadow-2xl overflow-hidden my-6 print:my-0 print:border-none print:shadow-none print:w-full print:bg-white">
        
        {/* Modal Header Bar */}
        <div className="print:hidden flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center space-x-2 text-[#C5A964]">
            <Printer className="h-5 w-5" />
            <h3 className="font-serif font-bold text-base sm:text-lg text-white">Official Fee Receipt Voucher</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-md"
            >
              <Printer className="h-4 w-4" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-xl text-xs cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* PRINTABLE RECEIPT CONTAINER */}
        <div id="printable-receipt" className="p-5 sm:p-7 bg-white text-slate-900 font-sans print:p-2 print:pt-0 print:bg-white print:text-black">
          
          {/* RECEIPT HEADER */}
          <div className="border-b-2 border-slate-900 pb-3 text-center relative print:pt-0">
            <div className="flex items-center justify-center gap-3 mb-2">
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt="TCA Logo"
                  className="h-16 object-contain"
                />
              )}
              <h1 className="font-serif font-bold text-slate-950 m-0 leading-none text-left tracking-normal">
                <span className="block text-2xl sm:text-3xl"><span className="font-normal text-lg sm:text-xl tracking-normal">The</span> Chef's</span>
                <span className="block text-2xl sm:text-3xl">Academy</span>
              </h1>
            </div>
            <p className="text-xs font-bold text-[#b45309] uppercase tracking-widest mt-0.5 m-0">
              79-B3 Gulberg III, Lahore, Pakistan
            </p>
            <p className="text-[10px] text-slate-600 mt-0.5 m-0">
              Helpline: 0333-9123456 | Email: info@thechefsacademy.pk | Web: www.thechefsacademy.pk
            </p>
            <div className="mt-2 inline-block bg-slate-950 text-white font-mono text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
              Official Payment Receipt
            </div>
          </div>

          {/* PROMINENT CURRENT PAYMENT AMOUNT HIGHLIGHT */}
          <div className="mt-4 bg-emerald-50 border-2 border-emerald-500 rounded-xl p-3.5 flex justify-between items-center text-emerald-950">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider block text-emerald-800">CASH PAYMENT RECEIVED IN THIS RECEIPT</span>
              <span className="text-xs text-emerald-900 font-medium">Payment Mode: {paymentMode}</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-mono font-black text-emerald-700">PKR {currentPaymentAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* RECEIPT METADATA GRID */}
          <div className="mt-4 grid grid-cols-2 gap-4 text-xs bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div>
              <span className="text-slate-500 font-medium block text-[10px] uppercase tracking-wider">Receipt Number</span>
              <span className="font-mono font-bold text-slate-950 text-sm">{receiptNo}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 font-medium block text-[10px] uppercase tracking-wider">Date & Time</span>
              <span className="font-semibold text-slate-900">{paymentDate}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block text-[10px] uppercase tracking-wider">Tracking Code</span>
              <span className="font-mono font-bold text-amber-700">{admission.id}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 font-medium block text-[10px] uppercase tracking-wider">Payment Mode</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase">
                {paymentMode}
              </span>
            </div>
          </div>

          {/* STUDENT INFORMATION */}
          <div className="mt-5 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-500 font-medium">Candidate Name:</span>
                <span className="font-bold text-slate-950 ml-2 text-sm">{admission.studentName}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Father Name:</span>
                <span className="font-semibold text-slate-900 ml-2">{admission.fatherName}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
              <div>
                <span className="text-slate-500 font-medium">CNIC / B-Form:</span>
                <span className="font-mono text-slate-800 ml-2">{admission.cnic}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Contact Phone:</span>
                <span className="font-mono text-slate-800 ml-2">{admission.phone}</span>
              </div>
            </div>
            <div className="pt-1 border-t border-slate-100">
              <span className="text-slate-500 font-medium">Course Program:</span>
              <span className="font-bold text-slate-950 ml-2">{admission.selectedCourseTitle}</span>
              <span className="text-slate-600 ml-2">({admission.shift})</span>
            </div>
          </div>

          {/* FINANCIAL BREAKDOWN TABLE */}
          <div className="mt-5">
            <table className="w-full text-xs text-left border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-100 text-slate-700 text-[10px] uppercase tracking-wider font-bold">
                  <th className="py-2.5 px-3 border-b border-slate-200">Description</th>
                  <th className="py-2.5 px-3 border-b border-slate-200 text-right">Amount (PKR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-sans">
                <tr>
                  <td className="py-2 px-3 font-medium text-slate-800">Tuition & Training Fee</td>
                  <td className="py-2 px-3 text-right font-mono font-semibold">PKR {tuition.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-slate-800">Registration / Admission Fee</td>
                  <td className="py-2 px-3 text-right font-mono font-semibold">PKR {regFee.toLocaleString()}</td>
                </tr>
                {discount > 0 && (
                  <tr className="bg-amber-50/50">
                    <td className="py-2 px-3 font-medium text-amber-900">Applied Special Discount</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-amber-900">- PKR {discount.toLocaleString()}</td>
                  </tr>
                )}
                <tr className="bg-slate-50 font-bold">
                  <td className="py-2.5 px-3 text-slate-950">Net Total Course Fee</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-950">PKR {totalNetFee.toLocaleString()}</td>
                </tr>
                {latestTx && (
                  <tr>
                    <td className="py-2 px-3 text-slate-600">Previously Paid Amount</td>
                    <td className="py-2 px-3 text-right font-mono text-slate-700">
                      PKR {Math.max(0, totalPaidSoFar - currentPaymentAmount).toLocaleString()}
                    </td>
                  </tr>
                )}
                <tr className="bg-emerald-50 text-emerald-950 font-bold border-t-2 border-emerald-500">
                  <td className="py-3 px-3 text-sm">
                    <span>RECEIVED IN THIS PAYMENT ({paymentMode.toUpperCase()})</span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-base text-emerald-700">
                    PKR {currentPaymentAmount.toLocaleString()}
                  </td>
                </tr>
                <tr className="bg-slate-100 font-bold border-t border-slate-300">
                  <td className="py-2.5 px-3 text-slate-800">Total Paid Amount To Date</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-950">PKR {totalPaidSoFar.toLocaleString()}</td>
                </tr>
                <tr className={`font-bold border-t-2 ${remainingDues > 0 ? 'bg-amber-100 text-amber-950 border-amber-500' : 'bg-emerald-100 text-emerald-950 border-emerald-500'}`}>
                  <td className="py-3 px-3 text-sm uppercase">
                    {remainingDues > 0 ? 'OUTSTANDING REMAINING BALANCE' : 'FEES FULLY CLEARED & PAID'}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-base">
                    PKR {remainingDues.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* PAYMENT HISTORY SNAPSHOT (IF MULTIPLE) */}
          {admission.paymentHistory && admission.paymentHistory.length > 1 && (
            <div className="mt-5 border border-slate-200 rounded-xl p-3 bg-slate-50">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
                Installment Payment Ledger History
              </span>
              <div className="space-y-1 text-[11px]">
                {admission.paymentHistory.map((tx, idx) => (
                  <div key={tx.id || idx} className="flex justify-between items-center py-1 border-b border-slate-200 last:border-none">
                    <span className="font-mono text-slate-600">#{idx + 1} {tx.receiptNo} ({tx.paymentMode})</span>
                    <span className="text-slate-500">{new Date(tx.date).toLocaleDateString()}</span>
                    <span className="font-mono font-bold text-slate-900">PKR {tx.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FOOTER & SIGNATURE */}
          <div className="mt-8 pt-4 border-t border-slate-300 flex justify-between items-end text-[10px] text-slate-600">
            <div className="max-w-xs space-y-1">
              <p className="font-bold text-slate-800 m-0">Terms & Conditions:</p>
              <p className="m-0 text-[9.5px]">1. Fee once deposited is non-refundable & non-transferable.</p>
              <p className="m-0 text-[9.5px]">2. Please retain this official computerised receipt for batch admission verification.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
