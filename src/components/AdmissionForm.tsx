import React, { useState, useEffect } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { uploadFile } from '../lib/firebase';


import { 
  GraduationCap, CheckCircle, ArrowLeft, ArrowRight, ClipboardCheck, 
  Landmark, CheckSquare, Search, SearchCode, ShieldCheck, User, 
  MapPin, Sparkles, ChevronRight, FileText, Upload, Printer, Mail, 
  Loader2, AlertCircle, RefreshCw, FileImage, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const COURSE_PLANS: Record<string, { duration: string; fee: number; regFee: number }[]> = {
  'Culinary Arts': [
    { duration: '1 Month Course', fee: 25000, regFee: 3000 },
    { duration: '3 Month Course', fee: 55000, regFee: 5000 },
    { duration: '6 Month Course', fee: 95000, regFee: 8000 }
  ],
  'Professional Chef': [
    { duration: '1 Month Course', fee: 30000, regFee: 3500 },
    { duration: '3 Month Course', fee: 65000, regFee: 5000 },
    { duration: '6 Month Course', fee: 110000, regFee: 10000 }
  ],
  'Baking & Desserts': [
    { duration: '1 Month Course', fee: 25000, regFee: 3000 },
    { duration: '3 Month Course', fee: 50000, regFee: 4000 },
    { duration: '6 Month Course', fee: 85000, regFee: 7000 }
  ],
  'Barista Skills': [
    { duration: '1 Month Course', fee: 20000, regFee: 2500 },
    { duration: '3 Month Course', fee: 45000, regFee: 4000 },
    { duration: '6 Month Course', fee: 75000, regFee: 6000 }
  ]
};

export default function AdmissionForm() {
  const { courses, admissions, addAdmission, updateAdmissionReceipt, updateAdmissionInvoiceHtml, coursePlans, websiteData } = useAcademy();
  
  const [portalTab, setPortalTab] = useState<'apply' | 'status'>('apply');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailMessage, setEmailMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  // Status Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Upload receipt state for a tracked application
  const [slipNumber, setSlipNumber] = useState('');
  const [receiptBase64, setReceiptBase64] = useState<string>('');
  const [isUploadingReceipt, setIsUploadingReceipt] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Apply Form Steps: 1, 2, 3 (Step 4 is Success & Invoice Display)
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    selectedCourseName: 'Culinary Arts',
    selectedDuration: '3 Month Course',
    shift: 'Morning (09:00 AM - 12:00 PM)',
    studentName: '',
    fatherName: '',
    email: '',
    phone: '',
    cnic: '',
    gender: 'Male',
    dateOfBirth: '',
    qualification: 'Intermediate (FSc/FA/ICom)',
    city: 'Lahore',
    address: '',
    notes: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [generatedInvoiceHtml, setGeneratedInvoiceHtml] = useState<string>('');

  const getSelectedPlan = () => {
    const plans = (coursePlans && coursePlans[formData.selectedCourseName]) || COURSE_PLANS[formData.selectedCourseName] || [];
    return plans.find(p => p.duration === formData.selectedDuration) || plans[0] || { duration: '3 Month Course', fee: 55000, regFee: 5000 };
  };

  const activePlan = getSelectedPlan();

  const validateStep = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.selectedCourseName) errors.selectedCourseName = 'Please select a program.';
    if (!formData.selectedDuration) errors.selectedDuration = 'Please select a course duration.';
    
    if (!formData.studentName.trim()) errors.studentName = 'Student name is required.';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address.';
    }
    
    const cleanPhone = formData.phone.replace(/[-\s]/g, '');
    if (!formData.phone.trim()) {
      errors.phone = 'Mobile number is required.';
    } else if (cleanPhone.length < 10) {
      errors.phone = 'Please enter a valid mobile number (e.g., 03331234567).';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
      const element = document.getElementById('portal-card');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  const handlePrev = () => {
    setStep(prev => prev - 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'selectedCourseName') {
      const plans = (coursePlans && coursePlans[value]) || COURSE_PLANS[value] || [];
      const firstDuration = plans[0]?.duration || '3 Month Course';
      setFormData(prev => ({
        ...prev,
        selectedCourseName: value,
        selectedDuration: firstDuration
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (formErrors[name]) {
      setFormErrors(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  // Convert File to Base64
  const processReceiptFile = (file: File) => {
    if (!file) return;
    
    if (file.size > 8 * 1024 * 1024) {
      setUploadMessage({ type: 'error', text: 'File size too large. Please upload an image under 8MB.' });
      return;
    }

    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setUploadMessage({ type: 'error', text: 'Only image files (JPEG, PNG) or PDFs are supported.' });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setReceiptBase64(reader.result as string);
      setUploadMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processReceiptFile(file);
    }
  };

  // Drag & Drop Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processReceiptFile(file);
    }
  };

  // Submit Receipt Slip
  const handleUploadReceiptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchResult) return;

    if (!slipNumber.trim()) {
      setUploadMessage({ type: 'error', text: 'Please enter your Deposit / Transaction Slip number.' });
      return;
    }

    if (!receiptBase64) {
      setUploadMessage({ type: 'error', text: 'Please upload or drop a photo of your payment slip.' });
      return;
    }

    setIsUploadingReceipt(true);
    try {
      // Upload the receipt to Firebase Storage and get URL
      const downloadUrl = await uploadFile(receiptBase64, `receipt-${searchResult.id}.jpg`);
      
      // Update local storage and context with the URL
      updateAdmissionReceipt(searchResult.id, slipNumber, downloadUrl);
      
      // Update the searched local object so the UI refreshes
      setSearchResult(prev => prev ? ({
        ...prev,
        receiptNumber: slipNumber,
        receiptFile: downloadUrl,
        status: 'Pending'
      }) : prev);

      setIsUploadingReceipt(false);
      setUploadMessage({ type: 'success', text: 'Your payment slip has been uploaded successfully.' });
      setSlipNumber('');
      setReceiptBase64('');
    } catch (err) {
      setIsUploadingReceipt(false);
      setUploadMessage({ type: 'error', text: 'Failed to upload receipt. Please try again.' });
    }
  };

  // Register & Trigger Invoice Mailing
  const handleRegisterAndSendInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    setIsSendingEmail(true);
    setEmailMessage(null);

    // Save admission to local context
    const matchedCourse = courses.find(c => c.title.toLowerCase().includes(formData.selectedCourseName.toLowerCase())) || courses[0];
    const admissionId = addAdmission({
      studentName: formData.studentName,
      fatherName: formData.fatherName,
      email: formData.email,
      phone: formData.phone,
      cnic: formData.cnic,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      qualification: formData.qualification,
      selectedCourseId: matchedCourse?.id || `course-${Date.now()}`,
      selectedCourseTitle: `${formData.selectedCourseName} (${formData.selectedDuration})`,
      selectedDuration: formData.selectedDuration,
      tuitionFee: activePlan.fee,
      regFee: activePlan.regFee,
      discountAmount: 0,
      feeStatus: 'Pending',
      shift: formData.shift,
      city: formData.city,
      address: formData.address,
      receiptNumber: '',
      notes: formData.notes,
    });

    setSubmittedId(admissionId);

    // Send email invoice
    try {
      const response = await window.fetch('/api/send-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: formData.studentName,
          fatherName: formData.fatherName,
          email: formData.email,
          phone: formData.phone,
          cnic: formData.cnic,
          trackingId: admissionId,
          courseTitle: `${formData.selectedCourseName} (${formData.selectedDuration})`,
          shift: formData.shift,
          regFee: activePlan.regFee,
          tuitionFee: activePlan.fee,
          totalFee: activePlan.fee + activePlan.regFee,
          paymentSettings: websiteData?.paymentSettings,
        }),
      });

      const resData = await response.json();

      // Store invoice HTML regardless of outcome
      setGeneratedInvoiceHtml(resData.invoiceHtml || '');
      updateAdmissionInvoiceHtml(admissionId, resData.invoiceHtml || '');

      if (response.ok && resData.success) {
        setEmailMessage({
          type: 'success',
          text: `Invoice sent successfully to ${formData.email}! Please check your Inbox / Spam folder.`,
        });
      } else {
        setEmailMessage({
          type: 'error',
          text: `Application saved, but we couldn't send the email automatically. You can download/print the invoice below.`,
        });
      }
    } catch (err: any) {
      console.error(err);
      setEmailMessage({
        type: 'error',
        text: `Application saved, but an error occurred while sending the email. You can download/print the invoice below.`,
      });
    } finally {
      setIsSendingEmail(false);
      setStep(4);
    }
  };

  // Print Invoice / Save as PDF via browser print dialog
  const handleDownloadPdf = () => {
    const element = document.getElementById('invoice-content');
    if (!element) return;

    // Collect the invoice inner HTML (button row hidden via .no-print in CSS)
    const invoiceHtml = element.outerHTML;

    const printWin = window.open('', '_blank');
    if (!printWin) {
      alert('Pop-ups are blocked. Please allow pop-ups for this site in your browser, then try again.');
      return;
    }

    printWin.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Invoice - ${submittedId || 'TCA'}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #fff; font-family: 'Inter', sans-serif; }
    /* Hide button row in print */
    .no-print { display: none !important; }
    /* Replicate key Tailwind classes used in the invoice */
    .font-display { font-family: 'Cinzel', serif; }
    .font-mono  { font-family: ui-monospace, monospace; }
    .font-sans  { font-family: 'Inter', sans-serif; }
    .text-white { color: #fff; }
    .text-slate-900 { color: #0f172a; }
    .text-slate-800 { color: #1e293b; }
    .text-slate-700 { color: #334155; }
    .text-slate-600 { color: #475569; }
    .text-slate-500 { color: #64748b; }
    .text-slate-400 { color: #94a3b8; }
    .text-amber-600 { color: #d97706; }
    .text-amber-500 { color: #f59e0b; }
    .\[\#c19d53\], .text-\[\#c19d53\] { color: #c19d53; }
    .bg-white { background: #fff; }
    .bg-slate-50 { background: #f8fafc; }
    .bg-slate-950 { background: #020617; }
    .border { border: 1px solid #e2e8f0; }
    .border-b { border-bottom: 1px solid #e2e8f0; }
    .border-t { border-top: 1px solid #e2e8f0; }
    .border-slate-100 { border-color: #f1f5f9; }
    .border-slate-100\/60 { border-color: rgba(241,245,249,.6); }
    .border-amber-500\/25 { border-color: rgba(245,158,11,.25); }
    .rounded-2xl { border-radius: 1rem; }
    .rounded-xl  { border-radius: .75rem; }
    .rounded-lg  { border-radius: .5rem; }
    .p-6  { padding: 1.5rem; }
    .p-4  { padding: 1rem; }
    .pb-5 { padding-bottom: 1.25rem; }
    .pt-1 { padding-top: .25rem; }
    .pt-2 { padding-top: .5rem; }
    .px-4 { padding-left:1rem; padding-right:1rem; }
    .py-1\.5 { padding-top:.375rem; padding-bottom:.375rem; }
    .space-y-6 > * + * { margin-top: 1.5rem; }
    .space-y-3 > * + * { margin-top: .75rem; }
    .space-y-2\.5 > * + * { margin-top: .625rem; }
    .space-x-1\.5 > * + * { margin-left: .375rem; }
    .flex { display: flex; }
    .items-start { align-items: flex-start; }
    .items-center { align-items: center; }
    .items-end { align-items: flex-end; }
    .justify-between { justify-content: space-between; }
    .gap-1 { gap: .25rem; }
    .grid { display: grid; }
    .grid-cols-2 { grid-template-columns: repeat(2,minmax(0,1fr)); }
    .gap-4 { gap: 1rem; }
    .gap-x-4 { column-gap: 1rem; }
    .gap-y-2 { row-gap: .5rem; }
    .col-span-2, .sm\:col-span-2 { grid-column: span 2 / span 2; }
    .block { display: block; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .uppercase { text-transform: uppercase; }
    .font-light  { font-weight: 300; }
    .font-medium { font-weight: 500; }
    .font-semibold { font-weight: 600; }
    .font-bold   { font-weight: 700; }
    .font-black  { font-weight: 900; }
    .text-lg   { font-size: 1.125rem; }
    .text-base { font-size: .875rem; }
    .text-sm   { font-size: .75rem; }
    .text-xs   { font-size: .7rem; }
    .text-\[10px\] { font-size: 10px; }
    .text-\[9px\]  { font-size: 9px; }
    .leading-none    { line-height: 1; }
    .leading-relaxed { line-height: 1.625; }
    .leading-\[0\.9\] { line-height: 0.9; }
    .tracking-wide    { letter-spacing: .025em; }
    .tracking-wider   { letter-spacing: .05em; }
    .tracking-widest  { letter-spacing: .1em; }
    .mt-0\.5 { margin-top: .125rem; }
    .mt-1    { margin-top: .25rem; }
    .mt-2    { margin-top: .5rem; }
    .-mt-0\.5 { margin-top: -.125rem; }
    .overflow-hidden { overflow: hidden; }
    .relative { position: relative; }
    .absolute { position: absolute; }
    .top-6  { top: 1.5rem; }
    .right-6 { right: 1.5rem; }
    .rotate-12 { transform: rotate(12deg); }
    .select-none { user-select: none; }
    .border-2 { border-width: 2px; }
    .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0,0,0,.1); }
    /* Page setup */
    @page { size: A4 portrait; margin: 10mm; }
    @media print {
      html, body { width: 210mm; }
      #invoice-content {
        border: none !important;
        box-shadow: none !important;
        max-width: 100% !important;
      }
    }
  </style>
</head>
<body>
  ${invoiceHtml}
  <script>
    window.onload = function() { window.print(); };
  <\/script>
</body>
</html>`);
    printWin.document.close();
  };

  const handleSearchStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim().replace(/[-\s]/g, '').toLowerCase();
    const found = admissions.find(adm => {
      const cleanPhone = adm.phone.replace(/[-\s]/g, '').toLowerCase();
      const cleanCnic = adm.cnic.replace(/[-\s]/g, '').toLowerCase();
      const cleanId = adm.id.replace(/[-\s]/g, '').toLowerCase();
      return cleanPhone.includes(query) || cleanCnic.includes(query) || cleanId.includes(query);
    });

    setSearchResult(found || null);
    setHasSearched(true);
    setUploadMessage(null);
    setSlipNumber('');
    setReceiptBase64('');
  };

  const handleResetForm = () => {
    setFormData({
      selectedCourseName: 'Culinary Arts',
      selectedDuration: '3 Month Course',
      shift: 'Morning (09:00 AM - 12:00 PM)',
      studentName: '',
      fatherName: '',
      email: '',
      phone: '',
      cnic: '',
      gender: 'Male',
      dateOfBirth: '',
      qualification: 'Intermediate (FSc/FA/ICom)',
      city: 'Lahore',
      address: '',
      notes: ''
    });
    setStep(1);
    setSubmittedId(null);
    setFormErrors({});
    setGeneratedInvoiceHtml('');
    setEmailMessage(null);
  };



  const stepLabels = ['Course & Schedule', 'Personal Profile', 'Verify & Register'];

  return (
    <section id="portal" className="py-12 md:py-20 bg-slate-950 text-white min-h-[85vh] relative overflow-hidden flex flex-col items-center">
      
      {/* Ambient backdrop glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#c19d53]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full relative z-10">
        
        {/* Simple Brand Header */}
        <div className="text-center space-y-4 mb-10">
          <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-white leading-tight">
            Registration portal
          </h1>
          <p className="font-sans text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Welcome to the official registration hub. Register for the upcoming professional batch, receive your email invoice, and submit payment slips for instant enrollment verification.
          </p>

          {/* Tab Selection */}
          <div className="flex items-center justify-center pt-4">
            <div className="inline-flex bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl">
              <button
                id="tab-apply"
                onClick={() => { setPortalTab('apply'); setHasSearched(false); }}
                className={`px-6 py-2.5 rounded-lg text-xs sm:text-sm font-sans font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  portalTab === 'apply'
                    ? 'bg-[#c19d53] text-slate-950 shadow-md shadow-[#c19d53]/15'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Apply / Register
              </button>
              <button
                id="tab-status"
                onClick={() => setPortalTab('status')}
                className={`px-6 py-2.5 rounded-lg text-xs sm:text-sm font-sans font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  portalTab === 'status'
                    ? 'bg-[#c19d53] text-slate-950 shadow-md shadow-[#c19d53]/15'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Track Status & Upload Receipt
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Card Area */}
        <div id="portal-card" className="bg-[#0c121e]/85 backdrop-blur-xl border border-[#c19d53]/15 rounded-2xl p-5 sm:p-10 shadow-2xl relative">
          
          <AnimatePresence mode="wait">
            {portalTab === 'apply' && step < 4 ? (
              <motion.div
                key="apply-panel"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <div className="space-y-6">
                  <div className="border-b border-slate-800/80 pb-4 flex items-center space-x-3">
                    <CheckSquare className="h-5 w-5 text-[#c19d53]" />
                    <div>
                      <h3 className="font-serif text-lg text-slate-200">Registration Form</h3>
                      <p className="text-slate-400 text-xs font-sans mt-0.5 font-light">Please fill in your details to register for the program.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Student Name */}
                    <div className="space-y-2">
                      <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-300">Student Full Name *</label>
                      <input
                        type="text"
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleInputChange}
                        placeholder="e.g. Zain Ahmed"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 font-sans text-sm focus:border-[#c19d53]/50 focus:outline-none"
                      />
                      {formErrors.studentName && <p className="text-red-400 text-[11px] font-sans">{formErrors.studentName}</p>}
                    </div>

                    {/* Father Name */}
                    <div className="space-y-2">
                      <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-300">Father/Guardian Name</label>
                      <input
                        type="text"
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleInputChange}
                        placeholder="e.g. Muhammad Yousaf"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 font-sans text-sm focus:border-[#c19d53]/50 focus:outline-none"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-300">WhatsApp / Mobile *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. 0333-9123456"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 font-sans text-sm focus:border-[#c19d53]/50 focus:outline-none"
                      />
                      {formErrors.phone && <p className="text-red-400 text-[11px] font-sans">{formErrors.phone}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-300">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. zain.chef@gmail.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 font-sans text-sm focus:border-[#c19d53]/50 focus:outline-none"
                      />
                      {formErrors.email && <p className="text-red-400 text-[11px] font-sans">{formErrors.email}</p>}
                    </div>

                    {/* Course Name */}
                    <div className="space-y-2">
                      <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-300">
                        Select Course Program *
                      </label>
                      <select
                        name="selectedCourseName"
                        value={formData.selectedCourseName}
                        onChange={handleInputChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 font-sans text-sm focus:border-[#c19d53]/50 focus:outline-none focus:ring-1 focus:ring-[#c19d53]/25 transition-all"
                      >
                        {Object.keys((coursePlans && Object.keys(coursePlans).length > 0) ? coursePlans : COURSE_PLANS).map(cName => (
                          <option key={cName} value={cName}>{cName} Program</option>
                        ))}
                      </select>
                      {formErrors.selectedCourseName && <p className="text-red-400 text-[11px] font-sans">{formErrors.selectedCourseName}</p>}
                    </div>

                    {/* Category / Duration */}
                    <div className="space-y-2">
                      <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-300">
                        Select Category / Duration *
                      </label>
                      <select
                        name="selectedDuration"
                        value={formData.selectedDuration}
                        onChange={handleInputChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 font-sans text-sm focus:border-[#c19d53]/50 focus:outline-none focus:ring-1 focus:ring-[#c19d53]/25 transition-all"
                      >
                        {((coursePlans && coursePlans[formData.selectedCourseName]) || COURSE_PLANS[formData.selectedCourseName] || []).map((plan) => (
                          <option key={plan.duration} value={plan.duration}>
                            {plan.duration} — Tuition: PKR {plan.fee.toLocaleString()}
                          </option>
                        ))}
                      </select>
                      {formErrors.selectedDuration && <p className="text-red-400 text-[11px] font-sans">{formErrors.selectedDuration}</p>}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6 flex justify-end">
                    <button
                      onClick={handleRegisterAndSendInvoice}
                      className="px-8 py-3 rounded-lg bg-[#c19d53] text-slate-950 font-sans text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all hover:bg-[#d4b065] shadow-lg shadow-[#c19d53]/25 active:scale-95 cursor-pointer font-bold"
                      disabled={isSendingEmail}
                    >
                      {isSendingEmail ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <ClipboardCheck className="h-4 w-4" />
                          <span>Submit Registration</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : null}

            {/* STEP 4: Registration Success, Email notification, and interactive Invoice Display */}
            {step === 4 && portalTab === 'apply' && (
              <motion.div
                key="step-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <div className="text-center py-4 space-y-3">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    <CheckCircle className="h-8 w-8 stroke-[1.5]" />
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-white">Application Recorded Successfully!</h3>
                  <p className="font-sans text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
                    Application submitted successfully! Tracking Code: <span className="text-amber-400 font-mono font-bold tracking-wider">{submittedId}</span>.
                  </p>
                </div>

                {/* Email message confirmation panel */}
                {emailMessage && (
                  <div className={`p-4 rounded-xl border text-xs sm:text-sm max-w-2xl mx-auto flex items-center space-x-3 font-sans ${
                    emailMessage.type === 'success' 
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300' 
                      : 'bg-amber-500/5 border-amber-500/20 text-amber-200'
                  }`}>
                    <Mail className="h-5 w-5 flex-shrink-0 text-[#c19d53]" />
                    <span className="leading-relaxed">{emailMessage.text}</span>
                  </div>
                )}

                {/* Print-friendly Digital Invoice Section */}
                <div id="invoice-content" className="border border-slate-800 rounded-2xl bg-white text-slate-900 p-6 sm:p-10 space-y-6 shadow-xl max-w-2xl mx-auto font-sans relative overflow-hidden">
                  
                  {/* Decorative stamp/watermark */}
                  <div className="absolute top-6 right-6 border-2 border-amber-500/25 text-amber-500/30 text-[10px] uppercase font-mono font-black py-1.5 px-4 rounded-lg transform rotate-12 select-none tracking-widest">
                    Awaiting Payment
                  </div>

                  <div className="flex justify-between items-start border-b border-slate-100 pb-5">
                    <div>
                      <div className="font-display leading-[0.9] text-slate-950">
                        <div className="flex items-end gap-1">
                          <span className="text-[10px] text-slate-900 font-light">The</span>
                          <span className="text-lg text-slate-900 font-medium leading-none">Chef's</span>
                        </div>
                        <div className="text-base text-slate-900 font-medium tracking-wide -mt-0.5 leading-none">Academy</div>
                      </div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Professional Culinary Institute</p>
                      <p className="text-[10px] text-slate-400 mt-2">79-B3 Gulberg III, Lahore, Pakistan</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Admissions Invoice</span>
                      <span className="font-mono text-lg font-bold text-amber-600 block mt-0.5">{submittedId}</span>
                      <span className="text-[10px] text-slate-500 block mt-1">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>

                  {/* Candidate / Course Details Grid */}
                  <div className="grid grid-cols-2 gap-4 text-xs border-b border-slate-100 pb-5">
                    <div>
                      <span className="text-slate-400 uppercase text-[9px] font-bold block">Student Name</span>
                      <span className="text-slate-800 font-semibold block mt-0.5">{formData.studentName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase text-[9px] font-bold block">Father Name</span>
                      <span className="text-slate-800 font-semibold block mt-0.5">{formData.fatherName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase text-[9px] font-bold block">WhatsApp Contact</span>
                      <span className="text-slate-800 font-medium block mt-0.5 font-mono">{formData.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase text-[9px] font-bold block">Candidate CNIC</span>
                      <span className="text-slate-800 font-medium block mt-0.5 font-mono">{formData.cnic}</span>
                    </div>
                  </div>

                  {/* Fee item breakdown list */}
                  <div className="space-y-3">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">Program Fees & Dues</span>
                    
                    <div className="space-y-2.5">
                      <div className="flex justify-between text-xs pb-2 border-b border-slate-100/60">
                        <div>
                          <span className="font-semibold text-slate-800 block">{formData.selectedCourseName}</span>
                          <span className="text-[10px] text-slate-500">Selected Duration: {formData.selectedDuration} | Shift: {formData.shift}</span>
                        </div>
                        <span className="font-mono text-slate-700 font-semibold">PKR {activePlan.fee.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between text-xs pb-2 border-b border-slate-100/60">
                        <span className="text-slate-700">Reservation Fee</span>
                        <span className="font-mono text-slate-700 font-semibold">PKR {activePlan.regFee.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between items-center pt-2 text-sm">
                        <span className="font-bold text-slate-900">Total Program Enrollment Fees:</span>
                        <span className="font-mono font-bold text-[#c19d53] text-base">PKR {(activePlan.fee + activePlan.regFee).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Official Bank details */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3 text-xs leading-relaxed">
                    <div className="flex items-center space-x-1.5 text-amber-700 font-bold uppercase tracking-wider text-[10px]">
                      <Landmark className="h-3.5 w-3.5" />
                      <span>Direct Payment Instructions</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Bank Account:</span>
                        <span className="text-slate-800 font-semibold block">{websiteData?.paymentSettings?.bankName || 'Bank Alfalah Ltd'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Account Title:</span>
                        <span className="text-slate-800 font-semibold block">{websiteData?.paymentSettings?.accountTitle || "The Chef's Academy"}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-slate-400 block text-[10px] uppercase">Account Number:</span>
                        <span className="text-slate-900 font-bold font-mono text-xs tracking-wider">{websiteData?.paymentSettings?.accountNumber || '5502-9018274619'}</span>
                        {websiteData?.paymentSettings?.iban && (
                          <span className="text-slate-600 font-mono text-[10px] block mt-0.5">IBAN: {websiteData.paymentSettings.iban}</span>
                        )}
                      </div>
                      <div className="sm:col-span-2 border-t border-slate-100 pt-2 text-[10px] text-slate-500">
                        {websiteData?.paymentSettings?.mobileName || 'Easypaisa or JazzCash'} Wallet: <strong>{websiteData?.paymentSettings?.mobileNumber || '0333-9123456'}</strong> (Title: {websiteData?.paymentSettings?.mobileTitle || "The Chef's Academy"})
                      </div>
                    </div>
                  </div>

                  <div className="text-center pt-1 no-print">
                    <button
                      id="download-btn"
                      onClick={handleDownloadPdf}
                      className="inline-flex items-center space-x-1.5 bg-slate-950 text-white hover:bg-amber-600 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <Printer className="h-4 w-4 text-[#c19d53]" />
                      <span>Print / Save as PDF</span>
                    </button>
                  </div>
                </div>

                {/* Helpful instructions about returning */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-2xl mx-auto space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">Next Steps to Finalize Your Admission:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans text-slate-400">
                    <div className="space-y-1">
                      <span className="text-white font-bold block">1. Make Payment</span>
                      <p className="leading-relaxed">Transfer/Deposit the registration fee of PKR {activePlan.regFee.toLocaleString()} (or full amount) to our Bank Alfalah or Easypaisa account.</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-white font-bold block">2. Save Receipt / Screenshot</span>
                      <p className="leading-relaxed">Take a clear photo, screenshot, or image copy of the bank transfer slip or payment receipt.</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-white font-bold block">3. Upload Slip Below</span>
                      <p className="leading-relaxed">Go to the "Track Status & Upload Receipt" tab, search with your tracking code, and submit your payment receipt photo.</p>
                    </div>
                  </div>

                  <div className="pt-2 text-center">
                    <button
                      onClick={() => {
                        setPortalTab('status');
                        setSearchQuery(submittedId || '');
                        setSearchResult(admissions.find(a => a.id === submittedId) || null);
                        setHasSearched(true);
                      }}
                      className="inline-flex items-center space-x-1.5 bg-[#c19d53] text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-[#c19d53]/15 transition-all cursor-pointer"
                    >
                      <span>Go Upload My Payment Receipt</span>
                      <Upload className="h-4 w-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>

                {/* Reset portal form buttons */}
                <div className="text-center pt-2">
                  <button
                    onClick={handleResetForm}
                    className="px-5 py-2.5 border border-slate-800 text-slate-400 hover:text-white rounded-lg text-xs font-bold uppercase transition-colors"
                  >
                    Register Another Candidate
                  </button>
                </div>
              </motion.div>
            )}

            {/* STATUS TRACKING & PAYMENT SLIP UPLOAD TAB */}
            {portalTab === 'status' && (
              <motion.div
                key="status-panel"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                <div className="border-b border-slate-800/80 pb-4 flex items-center space-x-3">
                  <SearchCode className="h-5 w-5 text-[#c19d53]" />
                  <div>
                    <h3 className="font-serif text-lg text-slate-200 font-medium">Track Admission Status & Upload Payment Slip</h3>
                    <p className="text-slate-400 text-xs font-sans mt-0.5 font-light">Enter your WhatsApp Number, Candidate CNIC, or Tracking ID to look up your application and upload your receipt.</p>
                  </div>
                </div>

                <form onSubmit={handleSearchStatus} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. ADM-901827, 1730112345679 or 03339123456"
                    className="flex-grow bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 font-mono text-sm focus:border-[#c19d53]/50 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-lg bg-[#c19d53] text-slate-950 font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 hover:bg-[#d4b065] transition-all cursor-pointer font-bold"
                  >
                    <Search className="h-4 w-4" />
                    <span>Lookup Application</span>
                  </button>
                </form>

                {/* Search result cards with receipt uploading */}
                <AnimatePresence mode="wait">
                  {hasSearched && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="pt-2"
                    >
                      {searchResult ? (
                        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 sm:p-8 space-y-6">
                          
                          {/* Heading Status */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                            <div>
                              <p className="text-[10px] font-sans font-bold text-slate-500 uppercase tracking-wider">Application Reference Code</p>
                              <p className="text-lg font-mono font-bold text-[#c19d53] tracking-wide mt-0.5">{searchResult.id}</p>
                            </div>
                            <div>
                              <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-sans font-bold uppercase tracking-wider ${
                                searchResult.status === 'Approved'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : searchResult.status === 'Hold'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  : searchResult.status === 'Rejected'
                                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                  : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              }`}>
                                ● {searchResult.status}
                              </span>
                            </div>
                          </div>

                          {/* Info fields */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs font-sans">
                            <div>
                              <p className="text-slate-500">Student Name:</p>
                              <p className="text-slate-200 font-bold text-sm mt-0.5">{searchResult.studentName}</p>
                            </div>
                            <div>
                              <p className="text-slate-500">Father Name:</p>
                              <p className="text-slate-200 font-medium text-sm mt-0.5">{searchResult.fatherName}</p>
                            </div>
                            <div>
                              <p className="text-slate-500">Selected Program:</p>
                              <p className="text-[#c19d53] font-medium text-sm mt-0.5">{searchResult.selectedCourseTitle}</p>
                            </div>
                            <div>
                              <p className="text-slate-500">Shift Preferred:</p>
                              <p className="text-slate-200 font-medium text-sm mt-0.5">{searchResult.shift}</p>
                            </div>
                            <div>
                              <p className="text-slate-500">Candidate Email:</p>
                              <p className="text-slate-200 font-medium text-sm mt-0.5">{searchResult.email}</p>
                            </div>
                            <div>
                              <p className="text-slate-500">Submission Date:</p>
                              <p className="text-slate-400 mt-0.5">{new Date(searchResult.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>

                          {/* Remarks / Notes */}
                          {searchResult.remarks && (
                            <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl space-y-1">
                              <p className="text-[10px] font-sans font-bold text-amber-500 uppercase tracking-wider">Official Remarks from Registrar</p>
                              <p className="text-xs text-slate-300 font-sans leading-relaxed">{searchResult.remarks}</p>
                            </div>
                          )}

                          {searchResult.status === 'Approved' && (
                            <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl flex items-start space-x-3">
                              <Sparkles className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                              <div className="space-y-1 font-sans">
                                <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Mubarak / Congratulations!</p>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                  Your application is verified and officially approved. Your batch seat is fully locked. Our operations department will reach out via WhatsApp with class details shortly.
                                </p>
                              </div>
                            </div>
                          )}

                          {/* PAYMENT SLIP UPLOAD / VIEW PANEL (If not approved yet, or to update slip) */}
                          {searchResult.status !== 'Approved' && (
                            <div className="border-t border-slate-800 pt-6 space-y-5">
                              <div className="flex items-center space-x-2 text-[#c19d53]">
                                <Upload className="h-5 w-5 text-[#c19d53]" />
                                <h4 className="font-serif text-base text-slate-200 font-medium">Upload Bank Transfer Receipt Slip</h4>
                              </div>

                              {uploadMessage && (
                                <div className={`p-4 rounded-xl border text-xs font-sans leading-relaxed ${
                                  uploadMessage.type === 'success' 
                                    ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300' 
                                    : 'bg-red-500/5 border-red-500/20 text-red-300'
                                }`}>
                                  {uploadMessage.text}
                                </div>
                              )}

                              {searchResult.receiptFile && (
                                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 font-sans">
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400">Current Submitted Receipt:</span>
                                    <span className="text-emerald-400 font-bold">Transaction Ref: {searchResult.receiptNumber}</span>
                                  </div>
                                  <div className="relative rounded-lg overflow-hidden border border-slate-800 max-h-40 flex justify-center items-center bg-slate-950 p-2">
                                    <img 
                                      src={searchResult.receiptFile} 
                                      alt="Currently uploaded receipt proof" 
                                      className="max-h-36 object-contain"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                  <span className="text-[10px] text-slate-500 block leading-normal text-center">
                                    * To update or re-upload your receipt slip, simply drag a new file or select a file below and submit.
                                  </span>
                                </div>
                              )}

                              <form onSubmit={handleUploadReceiptSubmit} className="space-y-4 font-sans text-xs sm:text-sm">
                                
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-400">
                                    Transaction ID / Slip Reference Number *
                                  </label>
                                  <input
                                    type="text"
                                    value={slipNumber}
                                    onChange={(e) => setSlipNumber(e.target.value)}
                                    placeholder="e.g. TRX9018274 or Bank deposit scroll number"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:border-[#c19d53]/50 focus:outline-none"
                                  />
                                </div>

                                <div className="space-y-1.5">
                                  <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-400">
                                    Attach Slip Image / Transfer Screenshot *
                                  </label>
                                  
                                  {/* Drag and Drop Zone */}
                                  <div
                                    onDragEnter={handleDrag}
                                    onDragOver={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDrop={handleDrop}
                                    className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
                                      dragActive 
                                        ? 'border-[#c19d53] bg-[#c19d53]/5' 
                                        : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                                    }`}
                                  >
                                    <input
                                      type="file"
                                      id="receipt-file-input"
                                      accept="image/png, image/jpeg, image/jpg, application/pdf"
                                      onChange={handleFileChange}
                                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    
                                    {receiptBase64 ? (
                                      <div className="space-y-3">
                                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                                          <CheckCircle className="h-6 w-6" />
                                        </div>
                                        <div>
                                          <p className="text-slate-200 font-bold text-xs">Receipt Loaded Successfully</p>
                                          <p className="text-slate-500 text-[10px] mt-0.5">Click or drag another file to replace</p>
                                        </div>
                                        <div className="max-w-[120px] mx-auto rounded overflow-hidden border border-slate-800">
                                          <img src={receiptBase64} alt="Receipt Preview" className="h-16 object-contain mx-auto" />
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="space-y-2">
                                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-[#c19d53]">
                                          <FileImage className="h-5 w-5" />
                                        </div>
                                        <div>
                                          <p className="text-slate-300 font-bold text-xs">Click to browse or Drag & Drop Slip file</p>
                                          <p className="text-slate-500 text-[10px] mt-0.5">Supports JPG, PNG, or PDF up to 8MB</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <button
                                  type="submit"
                                  disabled={isUploadingReceipt}
                                  className="w-full py-3 rounded-lg bg-[#c19d53] text-slate-950 font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 hover:bg-[#d4b065] transition-all disabled:opacity-55 cursor-pointer font-bold shadow-lg shadow-[#c19d53]/10"
                                >
                                  {isUploadingReceipt ? (
                                    <>
                                      <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                                      <span>Uploading payment slip...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Upload className="h-4 w-4 stroke-[2.5]" />
                                      <span>Submit Deposit Slip / Receipt</span>
                                    </>
                                  )}
                                </button>

                              </form>
                            </div>
                          )}

                        </div>
                      ) : (
                        <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-8 text-center space-y-2">
                          <p className="text-slate-300 font-sans text-sm font-semibold">No Registered Application Found</p>
                          <p className="text-slate-500 font-sans text-xs leading-relaxed max-w-md mx-auto">We couldn't find any student admission request with "{searchQuery}". Please verify your WhatsApp number or CNIC formatting and search again.</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}
