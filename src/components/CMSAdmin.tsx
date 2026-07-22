import React, { useState, useRef } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { Course, Admission, InventoryItem, PurchaseRecord } from '../types';
import { uploadFile } from '../lib/firebase';
import { 
  Users, BookOpen, GraduationCap, DollarSign, Plus, Edit, Trash2, 
  CheckCircle, XCircle, AlertCircle, Eye, LogOut, RefreshCw, 
  Image as ImageIcon, Star, MessageSquare, ClipboardList, Printer, Mail,
  Globe, Upload, CreditCard, Save, Megaphone, Calendar,
  ShoppingBag, Package, TrendingUp, MinusCircle, PlusCircle, BarChart2, Archive, ShoppingCart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import WebsiteCMSEditor from './WebsiteCMSEditor';

const DEFAULT_COURSE_DETAILS: Record<string, any> = {
  'Culinary Arts': {
    overview: "Our flagship six-month course for students who want a complete professional foundation. Progress from knife skills, stocks, and mother sauces to full menu production across Pakistani, Continental, and Asian cuisines — finishing with plating, costing, and a timed service simulation assessed by industry chefs.",
    apply: [
      "School/college leavers planning a culinary career",
      "Home cooks ready to go professional",
      "Future restaurant or cloud-kitchen owners",
      "Anyone who wants the full foundation, not a shortcut"
    ],
    careers: ["Commis Chef", "Chef de Partie (track)", "Hotel kitchen roles", "Restaurant line cook", "Catering professional", "Cloud kitchen operator", "Food entrepreneur"],
    outline: [
      { t: "Module 1 — Kitchen Foundations (Weeks 1–4)", d: ["Knife skills, classic cuts & station setup", "Kitchen safety, hygiene & HACCP basics", "Stocks, mother sauces & soups"] },
      { t: "Module 2 — Core Cooking Methods (Weeks 5–9)", d: ["Dry & moist heat methods", "Eggs, grains, vegetables & legumes", "Flavor building & seasoning"] },
      { t: "Module 3 — Proteins (Weeks 10–14)", d: ["Poultry & meat fabrication and cookery", "Seafood handling & cookery", "Marination & Pakistani BBQ classics"] },
      { t: "Module 4 — World Cuisines (Weeks 15–19)", d: ["Pakistani classics at production standard", "Continental à la carte essentials", "Chinese & pan-Asian techniques"] },
      { t: "Module 5 — The Professional Plate (Weeks 20–23)", d: ["Plating & presentation systems", "Menu planning, costing & portioning", "Buffet & banquet basics"] },
      { t: "Module 6 — Service Simulation & Assessment (Weeks 24–26)", d: ["Timed full-service kitchen simulation", "Practical final assessment by industry chefs", "Portfolio, certification & career session"] }
    ],
    faqs: [
      { q: "Do I need experience before joining?", a: "No — the program starts from absolute fundamentals and builds to professional standard." },
      { q: "How many practical hours are included?", a: "The majority of contact hours are practical, in the kitchen." },
      { q: "Will I get help finding a job after?", a: "Yes — graduates receive placement support through our partner network including Ramada Hotel and Royal Swiss Hotel." }
    ]
  },
  'Professional Chef': {
    overview: "The most career-critical kitchen skills, compressed into three intensive months. Learn from industry giants, practice in premium kitchen labs, and fast-track your path into high-volume hotels and fine dining establishments.",
    apply: [
      "Career switchers entering hospitality",
      "Hotel/restaurant staff upskilling for promotion",
      "Cooks formalizing their skills with certification",
      "Learners who want intensity over duration"
    ],
    careers: ["Commis Chef", "Line cook", "Hotel kitchen staff", "Restaurant kitchen staff", "Catering professional"],
    outline: [
      { t: "Module 1 — Foundations at Speed (Weeks 1–3)", d: ["Knife drills & station discipline", "Stocks, sauces & core methods", "Hygiene at professional standard"] },
      { t: "Module 2 — Station Mastery (Weeks 4–7)", d: ["Grill, sauté, fry & pantry rotations", "High-volume production targets", "À la carte timing & coordination"] },
      { t: "Module 3 — Menus & Plating (Weeks 8–10)", d: ["Continental & Pakistani menu production", "Plating standards for hotel service", "Costing & portioning essentials"] },
      { t: "Module 4 — Service & Assessment (Weeks 11–12)", d: ["Brigade service simulation", "Final practical assessment", "Certification & career session"] }
    ],
    faqs: [
      { q: "Is 3 months really enough?", a: "It's an intensive format designed to fast-track career entry by focusing on essential high-pressure commercial operations." },
      { q: "Can I take evening classes while working?", a: "Yes — the 5–9 PM batch is designed exactly for working professionals." },
      { q: "What's the difference vs Culinary Arts?", a: "Culinary Arts is a comprehensive 6-month foundation, whereas this is a compressed, fast-track 3-month program." }
    ]
  },
  'Baking & Desserts': {
    overview: "Baking is chemistry, craft, and patience. This program covers the complete science of baking, from artisan sour-doughs to fine French classical pâtisserie and custom wedding cake decorations.",
    apply: [
      "Aspiring pastry chefs & bakers",
      "Home bakers ready to go commercial",
      "Future bakery & café owners",
      "Hotel staff moving into pastry sections"
    ],
    careers: ["Pastry chef", "Bakery owner", "Hotel pastry section specialist", "Home boutique baker", "Custom cake designer"],
    outline: [
      { t: "Module 1 — Baking Fundamentals", d: ["Ingredient functions, ratios & weights", "Equipment calibration and safety", "Basic doughs and cookies"] },
      { t: "Module 2 — Yeast & Artisan Breads", d: ["Artisan sourdough fermentation", "Traditional breads, buns & pizza bases", "High-volume bakery line setup"] },
      { t: "Module 3 — Laminated Doughs", d: ["Croissants, danishes & puff pastry techniques", "Temperature-controlled layering", "Classic high-end breakfast items"] },
      { t: "Module 4 — Cake Art & Patisserie", d: ["Sponge baking, layered cakes & frosting", "Custom fondant sculpted decorations", "French macarons, tarts & eclairs"] }
    ],
    faqs: [
      { q: "Do we learn custom cake decoration?", a: "Yes, cake sculpting, custom fondant design, and piping are covered in detail." },
      { q: "Do I need to buy expensive equipment?", a: "No, all ingredients, machinery, and toolkits are provided in the academy laboratories." }
    ]
  },
  'Barista Skills': {
    overview: "Pakistan's café industry is growing rapidly. Learn perfect espresso extraction, milk micro-foaming science, beautiful latte art pouring, and actual cafe equipment maintenance.",
    apply: [
      "Barista beginners planning to work locally or abroad",
      "Coffee shop supervisors and supervisors",
      "Future café owners & coffee entrepreneurs",
      "Coffee connoisseurs and passionate home brewers"
    ],
    careers: ["Professional Barista", "Café manager", "Coffee shop trainer", "Coffee roaster technician", "Café consultant"],
    outline: [
      { t: "Module 1 — Coffee Science & Grinding", d: ["Coffee origins, roasting and bean selection", "Burr grinder calibration and dosing", "Water chemistry and extraction theory"] },
      { t: "Module 2 — Espresso & Micro-foaming", d: ["Perfect espresso extraction standards", "Steaming milk to silky micro-foam", "Consistent pour speeds & heights"] },
      { t: "Module 3 — Latte Art Mastery", d: ["Pouring beautiful hearts, rosettas, and tulips", "Etching and decorative syrup designs", "Speed and consistency drills"] },
      { t: "Module 4 — Bar Workflow & Operations", d: ["Managing rush hour bar flow", "Café machine cleaning and backflushing", "Cost calculation and beverage pricing"] }
    ],
    faqs: [
      { q: "Do we work on commercial espresso machines?", a: "Yes, you train on dual-boiler professional café-grade espresso machines." },
      { q: "Do you teach latte art?", a: "Yes, intensive hands-on drills focus specifically on micro-foaming and creative pouring." }
    ]
  }
};

export default function CMSAdmin() {
  const { 
    courses, admissions, testimonials, gallery, isAdminAuthenticated,
    addCourse, updateCourse, deleteCourse, updateAdmissionStatus, 
    addTestimonial, deleteTestimonial, addGalleryItem, deleteGalleryItem,
    loginAdmin,
    logoutAdmin,
    changeAdminPasscode,
    resetAllData, coursePlans, updateCoursePlans, purgeFeeCache,
    updateAdmissionDiscountAndFees, websiteData, updateWebsiteData,
    inventoryItems, purchaseRecords,
    addInventoryItem, updateInventoryItem, deleteInventoryItem,
    addPurchaseRecord, deletePurchaseRecord
  } = useAcademy();

  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState(false);

  // States for course plans management in settings
  const [editingPlanKey, setEditingPlanKey] = useState<string | null>(null); // e.g. "Culinary Arts-0"
  const [editingPlanData, setEditingPlanData] = useState({ duration: '', fee: 0, regFee: 0 });
  const [newPlanData, setNewPlanData] = useState<Record<string, { duration: string; fee: number; regFee: number }>>({});
  const [newCourseName, setNewCourseName] = useState('');

  // CMS Views
  const [cmsTab, setCmsTab] = useState<'dashboard' | 'courses' | 'admissions' | 'content' | 'settings' | 'website' | 'payment' | 'popup' | 'shop'>('dashboard');

  // TCA Shop / Inventory state
  const [shopSubTab, setShopSubTab] = useState<'inventory' | 'purchases' | 'report'>('inventory');
  const [newInventoryItem, setNewInventoryItem] = useState({ name: '', category: '', quantity: 0, unit: 'pcs' });
  const [newPurchase, setNewPurchase] = useState({ itemName: '', cost: 0, quantityAdded: 0, unit: 'pcs', purchasedBy: '' });
  const [stockAdjustItem, setStockAdjustItem] = useState<InventoryItem | null>(null);
  const [stockAdjustQty, setStockAdjustQty] = useState(0);
  const [stockAdjustMode, setStockAdjustMode] = useState<'add' | 'remove'>('add');
  const [reportFilter, setReportFilter] = useState<'week' | 'month' | 'all'>('month');

  // Payment Settings state
  const [paymentSettings, setPaymentSettings] = useState({
    bankName: websiteData?.paymentSettings?.bankName || 'Bank Alfalah Ltd',
    accountTitle: websiteData?.paymentSettings?.accountTitle || "The Chef's Academy",
    accountNumber: websiteData?.paymentSettings?.accountNumber || '5502-9018274619',
    iban: websiteData?.paymentSettings?.iban || '',
    mobileName: websiteData?.paymentSettings?.mobileName || 'JazzCash / Easypaisa',
    mobileNumber: websiteData?.paymentSettings?.mobileNumber || '0333-9123456',
    mobileTitle: websiteData?.paymentSettings?.mobileTitle || "The Chef's Academy",
  });
  const [paymentSaveMsg, setPaymentSaveMsg] = useState('');

  // Popup Settings state
  const [popupDraft, setPopupDraft] = useState({
    enabled: websiteData?.popupSettings?.enabled ?? false,
    title: websiteData?.popupSettings?.title || 'Admissions Now Open!',
    content: websiteData?.popupSettings?.content || '',
    image: websiteData?.popupSettings?.image || '',
    link: websiteData?.popupSettings?.link || '',
    startDate: websiteData?.popupSettings?.startDate || '',
    endDate: websiteData?.popupSettings?.endDate || '',
  });
  const [popupSaveMsg, setPopupSaveMsg] = useState('');

  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [passcodeMessage, setPasscodeMessage] = useState({ text: '', type: '' });

  // Course Editor State
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [courseModalTab, setCourseModalTab] = useState<'basic' | 'overview' | 'syllabus' | 'outline' | 'faqs'>('basic');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseFormData, setCourseFormData] = useState({
    title: '',
    duration: '',
    fees: 0,
    registrationFee: 0,
    shifts: ['Morning (09:00 AM - 12:00 PM)'],
    category: 'Diploma' as Course['category'],
    description: '',
    image: '',
    instructor: '',
    syllabus: '',
    totalSeats: 25,
    overview: '',
    apply: '',
    careers: '',
    heroVideo: '',
  });
  const [courseOutline, setCourseOutline] = useState<{ t: string; d: string }[]>([]);
  const [courseFaqs, setCourseFaqs] = useState<{ q: string; a: string }[]>([]);
  
  // Course Promo Video Upload states
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [videoDragActive, setVideoDragActive] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Admission View Modal State
  const [selectedAdmission, setSelectedAdmission] = useState<Admission | null>(null);
  const [adminRemarks, setAdminRemarks] = useState('');
  
  // Local states for editing selected student fees, discount, and status in modal
  const [selectedTuitionFee, setSelectedTuitionFee] = useState<number>(0);
  const [selectedRegFee, setSelectedRegFee] = useState<number>(0);
  const [selectedDiscount, setSelectedDiscount] = useState<number>(0);
  const [selectedFeeStatus, setSelectedFeeStatus] = useState<string>('Pending');
  const [isResendingInvoice, setIsResendingInvoice] = useState(false);
  const [resendInvoiceMessage, setResendInvoiceMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Gallery/Testimonial Creator States
  const [newGallery, setNewGallery] = useState({ title: '', category: 'Dish' as const, image: '' });
  const [newTestimonial, setNewTestimonial] = useState({ name: '', course: '', text: '', rating: 5, role: 'Alumni' as const, image: '' });

  // Upload states for gallery, testimonial, and course image
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);
  const [isTestimonialImgUploading, setIsTestimonialImgUploading] = useState(false);
  const [isCourseImgUploading, setIsCourseImgUploading] = useState(false);
  const galleryFileRef = useRef<HTMLInputElement>(null);
  const testimonialImgRef = useRef<HTMLInputElement>(null);
  const courseImgRef = useRef<HTMLInputElement>(null);

  // Generic image uploader helper for CMS fields
  const handleCmsImageUpload = async (
    file: File,
    setUploading: (v: boolean) => void,
    onSuccess: (url: string) => void
  ) => {
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      alert('Please upload an image or video file.');
      return;
    }
    setUploading(true);
    try {
      const url = await uploadFile(file, file.name);
      onSuccess(url);
    } catch (err: any) {
      alert(`Upload failed: ${err.message || err}. Please try again.`);
    } finally {
      setUploading(false);
    }
  };

  // Filters for Admissions list
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [courseFilter, setCourseFilter] = useState<string>('All');

  const handlePasscodeChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasscode !== confirmPasscode) {
      setPasscodeMessage({ text: 'Passcodes do not match!', type: 'error' });
      return;
    }
    if (newPasscode.length < 5) {
      setPasscodeMessage({ text: 'Passcode must be at least 5 characters.', type: 'error' });
      return;
    }
    try {
      await changeAdminPasscode(newPasscode);
      setPasscodeMessage({ text: '✅ Passcode updated & saved to database!', type: 'success' });
      setNewPasscode('');
      setConfirmPasscode('');
      setTimeout(() => setPasscodeMessage({ text: '', type: '' }), 6000);
    } catch (err) {
      setPasscodeMessage({ text: '❌ Failed to save. Check your internet connection.', type: 'error' });
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(passcode);
    if (success) {
      setLoginError(false);
      setPasscode('');
    } else {
      setLoginError(true);
    }
  };

  // Save edited course plan duration row
  const handleSavePlanRow = (courseName: string, index: number) => {
    if (!editingPlanData.duration.trim()) return;
    const updated = { ...coursePlans };
    updated[courseName][index] = {
      duration: editingPlanData.duration,
      fee: Number(editingPlanData.fee),
      regFee: Number(editingPlanData.regFee),
      detail: editingPlanData.detail || ''
    };
    updateCoursePlans(updated);
    setEditingPlanKey(null);
  };

  // Delete dynamic course plan duration row
  const handleDeletePlanRow = (courseName: string, index: number) => {
    if (!confirm('Are you sure you want to delete this duration option?')) return;
    const updated = { ...coursePlans };
    updated[courseName] = updated[courseName].filter((_, i) => i !== index);
    updateCoursePlans(updated);
  };

  // Add a brand new plan duration option under a course
  const handleAddPlanRow = (courseName: string) => {
    const data = newPlanData[courseName] || { duration: '', fee: 0, regFee: 0, detail: '' };
    if (!data.duration.trim() || data.fee <= 0 || data.regFee <= 0) {
      alert('Please enter a valid duration name, tuition fee, and registration fee.');
      return;
    }
    const updated = { ...coursePlans };
    if (!updated[courseName]) updated[courseName] = [];
    updated[courseName].push({
      duration: data.duration,
      fee: Number(data.fee),
      regFee: Number(data.regFee),
      detail: data.detail || ''
    });
    updateCoursePlans(updated);
    // Clear the specific inputs
    setNewPlanData(prev => ({
      ...prev,
      [courseName]: { duration: '', fee: 0, regFee: 0, detail: '' }
    }));
  };

  // Add a brand new course category completely
  const handleAddNewCourseCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName.trim()) return;
    if (coursePlans[newCourseName]) {
      alert('This course program name already exists!');
      return;
    }
    const updated = { ...coursePlans };
    // Initialize with 1 default duration
    updated[newCourseName] = [
      { duration: '3 Month Course', fee: 50000, regFee: 5000 }
    ];
    updateCoursePlans(updated);
    setNewCourseName('');
  };

  // Delete an entire course program category
  const handleDeleteCourseCategory = (courseName: string) => {
    if (!confirm(`Are you absolutely sure you want to delete the "${courseName}" program category and all its durations? This will remove it from the admission form.`)) return;
    const updated = { ...coursePlans };
    delete updated[courseName];
    updateCoursePlans(updated);
  };

  // Helper values
  const pendingCount = admissions.filter(a => a.status === 'Pending').length;
  const approvedCount = admissions.filter(a => a.status === 'Approved').length;
  const totalRevenue = admissions
    .filter(a => a.status === 'Approved')
    .reduce((sum, a) => {
      const course = courses.find(c => c.id === a.selectedCourseId);
      return sum + (course ? course.registrationFee + course.fees : 0);
    }, 0);

  // Helper to get fallback/default details for edit or template pre-fills
  const getFallbackDetails = (courseName: string) => {
    let catKey = '';
    const lowerName = courseName.toLowerCase();
    if (lowerName.includes('culinary')) {
      catKey = 'Culinary Arts';
    } else if (lowerName.includes('professional') || lowerName.includes('chef')) {
      catKey = 'Professional Chef';
    } else if (lowerName.includes('baking') || lowerName.includes('patisserie') || lowerName.includes('dessert')) {
      catKey = 'Baking & Desserts';
    } else if (lowerName.includes('barista')) {
      catKey = 'Barista Skills';
    }
    return DEFAULT_COURSE_DETAILS[catKey] || {
      overview: '',
      apply: [],
      careers: [],
      outline: [],
      faqs: []
    };
  };

  // Open Course Creator Modal
  const openCourseModal = (course: Course | null = null, startTab: 'basic' | 'overview' | 'syllabus' | 'outline' | 'faqs' = 'basic') => {
    setCourseModalTab(startTab);
    if (course) {
      setEditingCourse(course);
      const fallback = getFallbackDetails(course.title);
      
      setCourseFormData({
        title: course.title,
        duration: course.duration,
        fees: course.fees,
        registrationFee: course.registrationFee,
        shifts: course.shifts,
        category: course.category,
        description: course.description,
        image: course.image,
        instructor: course.instructor,
        syllabus: course.syllabus.join('\n'),
        totalSeats: course.totalSeats,
        overview: course.overview || fallback.overview || course.description,
        apply: course.apply && course.apply.length > 0 ? course.apply.join('\n') : (fallback.apply || []).join('\n'),
        careers: course.careers && course.careers.length > 0 ? course.careers.join('\n') : (fallback.careers || []).join('\n'),
        heroVideo: course.heroVideo || fallback.heroVideo || '',
      });

      // Outline Modules
      const finalOutline = course.outline && course.outline.length > 0
        ? course.outline.map(o => ({ t: o.t, d: o.d.join('\n') }))
        : (fallback.outline || []).map((o: any) => ({ t: o.t, d: o.d.join('\n') }));
      setCourseOutline(finalOutline);

      // FAQs
      const finalFaqs = course.faqs && course.faqs.length > 0
        ? course.faqs.map(f => ({ q: f.q, a: f.a }))
        : (fallback.faqs || []).map((f: any) => ({ q: f.q, a: f.a }));
      setCourseFaqs(finalFaqs);
    } else {
      setEditingCourse(null);
      setCourseFormData({
        title: '',
        duration: '',
        fees: 30000,
        registrationFee: 3000,
        shifts: ['Morning (09:00 AM - 12:00 PM)', 'Evening (02:00 PM - 05:00 PM)'],
        category: 'Short Course',
        description: '',
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800',
        instructor: '',
        syllabus: 'Introduction to Kitchen Equipment\nPractical Recipe Preparation\nGarnishing & Plating\nCourse Assessment',
        totalSeats: 25,
        overview: '',
        apply: 'School/college leavers planning a culinary career\nHome cooks ready to go professional\nFuture restaurant or food entrepreneurs',
        careers: 'Professional Commis Chef\nBaking artist\nHotel or cafe business owner',
        heroVideo: '',
      });
      setCourseOutline([
        { t: 'Module 1 — Foundations', d: 'Introduction to professional kitchen systems\nHygiene and HACCP basics\nKnife handling and classical cuts' },
        { t: 'Module 2 — Practical Application', d: 'Recipe preparation under professional guidance\nPlating techniques and timing' }
      ]);
      setCourseFaqs([
        { q: 'Are ingredients included in the fee?', a: 'Yes, 100% of the raw ingredients, materials, chef uniforms, and practical equipment are covered by the academy.' },
        { q: 'Is there any job placement support?', a: "Yes, we connect our top graduates with leading hospitality chains, restaurants, and hotels throughout the country." }
      ]);
    }
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const syllabusArray = courseFormData.syllabus.split('\n').filter(line => line.trim() !== '');
    const applyArray = courseFormData.apply.split('\n').filter(line => line.trim() !== '');
    const careersArray = courseFormData.careers.split('\n').filter(line => line.trim() !== '');

    // Parse outline
    const parsedOutline = courseOutline.map(o => ({
      t: o.t,
      d: o.d.split('\n').filter(line => line.trim() !== '')
    })).filter(o => o.t.trim() !== '');

    // Parse FAQs
    const parsedFaqs = courseFaqs.filter(f => f.q.trim() !== '' && f.a.trim() !== '');

    const coursePayload = {
      title: courseFormData.title,
      duration: courseFormData.duration,
      fees: Number(courseFormData.fees),
      registrationFee: Number(courseFormData.registrationFee),
      shifts: courseFormData.shifts,
      category: courseFormData.category,
      description: courseFormData.description,
      image: courseFormData.image,
      instructor: courseFormData.instructor,
      syllabus: syllabusArray,
      totalSeats: Number(courseFormData.totalSeats),
      overview: courseFormData.overview,
      apply: applyArray,
      careers: careersArray,
      outline: parsedOutline,
      faqs: parsedFaqs,
      heroVideo: courseFormData.heroVideo,
    };

    if (editingCourse) {
      updateCourse({
        ...editingCourse,
        ...coursePayload
      });
    } else {
      addCourse(coursePayload);
    }
    setIsCourseModalOpen(false);
  };

  const handleAddOutlineModule = () => {
    setCourseOutline(prev => [...prev, { t: 'New Module Title', d: 'Point 1\nPoint 2' }]);
  };

  const handleRemoveOutlineModule = (index: number) => {
    setCourseOutline(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleOutlineModuleChange = (index: number, field: 't' | 'd', value: string) => {
    setCourseOutline(prev => prev.map((o, idx) => {
      if (idx === index) {
        return { ...o, [field]: value };
      }
      return o;
    }));
  };

  const handleAddFaq = () => {
    setCourseFaqs(prev => [...prev, { q: 'New Question', a: 'Answer text' }]);
  };

  const handleRemoveFaq = (index: number) => {
    setCourseFaqs(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleFaqChange = (index: number, field: 'q' | 'a', value: string) => {
    setCourseFaqs(prev => prev.map((f, idx) => {
      if (idx === index) {
        return { ...f, [field]: value };
      }
      return f;
    }));
  };

  const handleAddShift = () => {
    setCourseFormData(prev => ({
      ...prev,
      shifts: [...prev.shifts, 'New Shift Time']
    }));
  };

  const handleShiftChange = (index: number, val: string) => {
    const updated = [...courseFormData.shifts];
    updated[index] = val;
    setCourseFormData(prev => ({ ...prev, shifts: updated }));
  };

  const handleRemoveShift = (index: number) => {
    setCourseFormData(prev => ({
      ...prev,
      shifts: prev.shifts.filter((_, idx) => idx !== index)
    }));
  };

  const handleCourseVideoUpload = async (file: File) => {
    if (!file) return;

    const fileType = file.type;
    if (!fileType.startsWith('video/')) {
      alert('Please upload a video file (MP4, WEBM, etc.).');
      return;
    }

    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > 45) {
      alert(`File is too large (${sizeInMB.toFixed(1)}MB). Please upload a file smaller than 45MB.`);
      return;
    }

    setIsVideoUploading(true);
    try {
      const downloadUrl = await uploadFile(file, file.name);
      setCourseFormData(prev => ({ ...prev, heroVideo: downloadUrl }));
      alert('Promo video uploaded successfully!');
    } catch (uploadError: any) {
      console.error('Video upload failed:', uploadError);
      alert(`Failed to upload video: ${uploadError.message || uploadError}`);
    } finally {
      setIsVideoUploading(false);
    }
  };

  const handleVideoDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setVideoDragActive(true);
    } else if (e.type === 'dragleave') {
      setVideoDragActive(false);
    }
  };

  const handleVideoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setVideoDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleCourseVideoUpload(e.dataTransfer.files[0]);
    }
  };

  // Process admissions
  const handleProcessAdmission = (id: string, status: Admission['status']) => {
    updateAdmissionStatus(id, status, adminRemarks);
    setAdminRemarks('');
    setSelectedAdmission(null);
  };

  const handleSaveAdmissionFees = () => {
    if (!selectedAdmission) return;
    updateAdmissionDiscountAndFees(
      selectedAdmission.id,
      selectedDiscount,
      selectedTuitionFee,
      selectedRegFee,
      selectedFeeStatus
    );
    // Update local state copy so that changes render in real-time inside the modal
    setSelectedAdmission(prev => prev ? {
      ...prev,
      tuitionFee: selectedTuitionFee,
      regFee: selectedRegFee,
      discountAmount: selectedDiscount,
      feeStatus: selectedFeeStatus
    } : null);
    alert('Student fees, discount, and payment status saved successfully!');
  };

  const handleResendInvoiceEmail = async () => {
    if (!selectedAdmission) return;
    setIsResendingInvoice(true);
    setResendInvoiceMessage(null);

    try {
      const response = await window.fetch('/api/send-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: selectedAdmission.studentName,
          fatherName: selectedAdmission.fatherName,
          email: selectedAdmission.email,
          phone: selectedAdmission.phone,
          cnic: selectedAdmission.cnic,
          trackingId: selectedAdmission.id,
          courseTitle: selectedAdmission.selectedCourseTitle,
          shift: selectedAdmission.shift,
          regFee: selectedRegFee,
          tuitionFee: selectedTuitionFee,
          totalFee: selectedTuitionFee + selectedRegFee - selectedDiscount,
          discount: selectedDiscount,
          paymentSettings: websiteData?.paymentSettings
        })
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        setResendInvoiceMessage({
          type: 'success',
          text: `Invoice sent successfully to ${selectedAdmission.email}! (SMTP: ${resData.method}). Total: PKR ${(selectedTuitionFee + selectedRegFee - selectedDiscount).toLocaleString()}`
        });
      } else {
        throw new Error(resData.error || 'Failed to dispatch email.');
      }
    } catch (err: any) {
      console.error(err);
      setResendInvoiceMessage({
        type: 'error',
        text: `Error sending updated email invoice: ${err.message || 'Network error'}`
      });
    } finally {
      setIsResendingInvoice(false);
    }
  };

  const handleAddGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGallery.title || !newGallery.image) return;
    addGalleryItem(newGallery);
    setNewGallery({ title: '', category: 'Dish', image: '' });
  };

  const handleAddTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestimonial.name || !newTestimonial.text || !newTestimonial.course) return;
    const fallbackImage = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150';
    addTestimonial({
      ...newTestimonial,
      image: newTestimonial.image || fallbackImage,
      rating: Number(newTestimonial.rating)
    });
    setNewTestimonial({ name: '', course: '', text: '', rating: 5, role: 'Alumni', image: '' });
  };

  // Print Admission receipt
  const printAdmissionDoc = () => {
    window.print();
  };

  // Filter admissions list
  const filteredAdmissions = admissions.filter(adm => {
    const matchesStatus = statusFilter === 'All' ? true : adm.status === statusFilter;
    const matchesCourse = courseFilter === 'All' ? true : adm.selectedCourseId === courseFilter;
    return matchesStatus && matchesCourse;
  });

  // If not authenticated, render beautiful locked gateway
  if (!isAdminAuthenticated) {
    return (
      <section className="min-h-screen bg-slate-950 flex items-center justify-center p-4 pt-24">
        <div className="absolute top-1/4 left-1/2 w-80 h-80 bg-[#AE8C45]/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2"></div>
        
        <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-2xl max-w-md w-full shadow-2xl backdrop-blur relative text-center space-y-6">
          <div className="inline-flex p-3 bg-[#AE8C45]/10 rounded-xl text-[#C5A964]">
            <ClipboardList className="h-10 w-10 stroke-[1.5]" />
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-white tracking-tight">
              Academy CMS Secure Gate
            </h2>
            <p className="font-sans text-xs text-slate-400">
              Only authorized registrar personnel, instructors, and executive admins can access the management panel.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1 text-left">
              <label htmlFor="passcode" className="block text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400">
                Enter Administrator Code *
              </label>
              <input
                type="password"
                id="passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-center font-mono text-slate-200 focus:border-[#AE8C45]/50 focus:outline-none transition-all"
              />
            </div>

            {loginError && (
              <p className="text-red-500 text-xs font-sans">
                ⚠️ Invalid passcode. Please enter the correct code.
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-[#0C1B2C] font-sans font-bold uppercase text-xs tracking-wider py-3.5 rounded-xl hover:brightness-110 shadow-lg shadow-[#AE8C45]/10 active:scale-95 transition-all"
            >
              Authorize Portal
            </button>
          </form>

          <p className="text-[10px] text-slate-500">
            Secure browser session. Changes are persisted locally in your sandbox workspace.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-950 text-white pt-24 pb-16 font-sans">
      <div className="max-w-[95%] xl:max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-6 mb-8 gap-4">
          <div className="flex items-center gap-4">
            {websiteData?.logo && (
              <img 
                src={websiteData.logo} 
                alt="Academy Logo" 
                className="h-12 w-auto object-contain bg-white/5 p-1.5 rounded-lg border border-white/10"
              />
            )}
            <div className="space-y-1.5">
              <div className="flex items-center space-x-3">
                <div className="font-display leading-[0.9] text-white">
                  <div className="flex items-end gap-1">
                    <span className="text-[10px] text-[#F7F2DE] font-light">The</span>
                    <span className="text-lg text-[#F7F2DE] font-medium leading-none">Chef's</span>
                  </div>
                  <div className="text-base text-[#F7F2DE] font-medium tracking-wide -mt-0.5 leading-none">Academy</div>
                </div>
                <span className="bg-[#AE8C45]/10 text-[#C5A964] border border-[#AE8C45]/20 text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                  Admin Console
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Manage courses catalog, review submitted student registrations, verify payments, and curate media.
              </p>
            </div>
          </div>

          <button
            onClick={logoutAdmin}
            className="flex items-center space-x-2 bg-slate-900 hover:bg-red-950/20 text-slate-400 hover:text-red-400 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-800 hover:border-red-500/20 transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout Panel</span>
          </button>
        </div>

        {/* Core CMS Navigation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Tabs Controls */}
          <div className="lg:col-span-3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 border-b lg:border-b-0 border-slate-900 pb-4 lg:pb-0 scrollbar-none">
            
            <button
              onClick={() => setCmsTab('dashboard')}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex-shrink-0 w-max lg:w-full ${
                cmsTab === 'dashboard'
                  ? 'bg-[#AE8C45] text-[#0C1B2C] font-extrabold shadow-lg shadow-[#AE8C45]/10'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Overview Metrics</span>
            </button>

            <button
              onClick={() => setCmsTab('courses')}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex-shrink-0 w-max lg:w-full ${
                cmsTab === 'courses'
                  ? 'bg-[#AE8C45] text-[#0C1B2C] font-extrabold shadow-lg shadow-[#AE8C45]/10'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Manage Courses</span>
              <span className="ml-auto bg-slate-950/20 px-1.5 py-0.5 rounded text-[10px]">{courses.length}</span>
            </button>

            <button
              onClick={() => setCmsTab('admissions')}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex-shrink-0 w-max lg:w-full ${
                cmsTab === 'admissions'
                  ? 'bg-[#AE8C45] text-[#0C1B2C] font-extrabold shadow-lg shadow-[#AE8C45]/10'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              <span>Review Admissions</span>
              {pendingCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] h-5 w-5 rounded-full flex items-center justify-center font-bold font-sans">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setCmsTab('fees')}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex-shrink-0 w-max lg:w-full ${
                cmsTab === 'fees'
                  ? 'bg-[#AE8C45] text-[#0C1B2C] font-extrabold shadow-lg shadow-[#AE8C45]/10'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <DollarSign className="h-4 w-4" />
              <span>Student Fees Info</span>
            </button>

            <button
              onClick={() => setCmsTab('content')}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex-shrink-0 w-max lg:w-full ${
                cmsTab === 'content'
                  ? 'bg-[#AE8C45] text-[#0C1B2C] font-extrabold shadow-lg shadow-[#AE8C45]/10'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <ImageIcon className="h-4 w-4" />
              <span>Curate Media & Reviews</span>
            </button>

            <button
              onClick={() => setCmsTab('website')}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex-shrink-0 w-max lg:w-full ${
                cmsTab === 'website'
                  ? 'bg-[#AE8C45] text-[#0C1B2C] font-extrabold shadow-lg shadow-[#AE8C45]/10'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Globe className="h-4 w-4" />
              <span>Website CMS Editor</span>
            </button>

            <button
              onClick={() => setCmsTab('payment')}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex-shrink-0 w-max lg:w-full ${
                cmsTab === 'payment'
                  ? 'bg-[#AE8C45] text-[#0C1B2C] font-extrabold shadow-lg shadow-[#AE8C45]/10'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <CreditCard className="h-4 w-4" />
              <span>Payment Settings</span>
            </button>

            <button
              onClick={() => setCmsTab('popup')}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex-shrink-0 w-max lg:w-full ${
                cmsTab === 'popup'
                  ? 'bg-[#AE8C45] text-[#0C1B2C] font-extrabold shadow-lg shadow-[#AE8C45]/10'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Megaphone className="h-4 w-4" />
              <span>Popup Announcement</span>
            </button>

            <button
              onClick={() => setCmsTab('shop')}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex-shrink-0 w-max lg:w-full ${
                cmsTab === 'shop'
                  ? 'bg-[#AE8C45] text-[#0C1B2C] font-extrabold shadow-lg shadow-[#AE8C45]/10'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              <span>TCA Shop & Inventory</span>
              <span className="ml-auto bg-slate-950/20 px-1.5 py-0.5 rounded text-[10px]">{inventoryItems.length}</span>
            </button>

            <button
              onClick={() => setCmsTab('settings')}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex-shrink-0 w-max lg:w-full ${
                cmsTab === 'settings'
                  ? 'bg-[#AE8C45] text-[#0C1B2C] font-extrabold shadow-lg shadow-[#AE8C45]/10'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <RefreshCw className="h-4 w-4" />
              <span>System Settings</span>
            </button>

          </div>

          {/* CMS Content Render Area */}
          <div className="lg:col-span-9 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl min-h-[60vh]">
            
            {/* TAB 1: DASHBOARD OVERVIEW */}
            {cmsTab === 'dashboard' && (
              <div className="space-y-8">
                <h2 className="font-serif text-xl font-bold text-[#C5A964] pb-2 border-b border-slate-800">
                  Registrar Overview Metrics
                </h2>

                {/* 4-Column Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  <div className="bg-slate-950 border border-slate-800/80 p-5 rounded-xl space-y-1.5 shadow-md">
                    <div className="flex justify-between items-center text-slate-400">
                      <span className="text-[10px] font-bold uppercase tracking-wider">Total Applications</span>
                      <ClipboardList className="h-5 w-5 text-[#C5A964]" />
                    </div>
                    <span className="block text-3xl font-serif font-bold text-white">{admissions.length}</span>
                  </div>

                  <div className="bg-slate-950 border border-slate-800/80 p-5 rounded-xl space-y-1.5 shadow-md">
                    <div className="flex justify-between items-center text-slate-400">
                      <span className="text-[10px] font-bold uppercase tracking-wider">Pending Verification</span>
                      <AlertCircle className="h-5 w-5 text-[#C5A964] animate-pulse" />
                    </div>
                    <span className="block text-3xl font-serif font-bold text-red-400">{pendingCount}</span>
                  </div>

                  <div className="bg-slate-950 border border-slate-800/80 p-5 rounded-xl space-y-1.5 shadow-md">
                    <div className="flex justify-between items-center text-slate-400">
                      <span className="text-[10px] font-bold uppercase tracking-wider">Enrolled (Approved)</span>
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                    </div>
                    <span className="block text-3xl font-serif font-bold text-emerald-400">{approvedCount}</span>
                  </div>

                  <div className="bg-slate-950 border border-slate-800/80 p-5 rounded-xl space-y-1.5 shadow-md">
                    <div className="flex justify-between items-center text-slate-400">
                      <span className="text-[10px] font-bold uppercase tracking-wider">Estimated Tuition Revenue</span>
                      <DollarSign className="h-5 w-5 text-emerald-500" />
                    </div>
                    <span className="block text-2xl font-serif font-bold text-emerald-400">PKR {totalRevenue.toLocaleString()}</span>
                  </div>

                </div>

                {/* Popular Courses stats */}
                <div className="space-y-4">
                  <h3 className="font-serif text-lg font-semibold text-white">Course Enrolments Capacity</h3>
                  <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse font-sans text-xs sm:text-sm">
                        <thead>
                          <tr className="border-b border-slate-850 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                            <th className="py-3 px-4">Culinary Course</th>
                            <th className="py-3 px-4">Duration</th>
                            <th className="py-3 px-4">Filled Seats</th>
                            <th className="py-3 px-4">Capacity Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {courses.map(c => {
                            const enrolled = admissions.filter(a => a.selectedCourseId === c.id && a.status === 'Approved').length;
                            const capacityPercent = Math.min(((c.totalSeats - c.seatsAvailable) / c.totalSeats) * 100, 100);
                            return (
                              <tr key={c.id} className="border-b border-slate-900/50 hover:bg-slate-900/30">
                                <td className="py-3.5 px-4 font-semibold text-slate-200">{c.title}</td>
                                <td className="py-3.5 px-4 text-slate-400">{c.duration}</td>
                                <td className="py-3.5 px-4 text-white font-mono font-bold">{c.totalSeats - c.seatsAvailable} / {c.totalSeats}</td>
                                <td className="py-3.5 px-4">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                                      <div 
                                        className={`h-full ${capacityPercent >= 80 ? 'bg-red-500' : 'bg-[#AE8C45]'}`}
                                        style={{ width: `${capacityPercent}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-[10px] text-slate-400">{Math.round(capacityPercent)}% Full</span>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: MANAGE COURSES */}
            {cmsTab === 'courses' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-850 pb-4">
                  <h2 className="font-serif text-xl font-bold text-[#C5A964]">
                    Courses Catalog Editor
                  </h2>
                  <button
                    onClick={() => openCourseModal()}
                    className="flex items-center space-x-1.5 bg-[#AE8C45] text-[#0C1B2C] px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all"
                  >
                    <Plus className="h-4 w-4 stroke-[2.5]" />
                    <span>Add New Course</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {courses.map(course => (
                    <div key={course.id} className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                      {/* Course Card Header */}
                      <div className="flex space-x-4 items-start p-4">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-20 h-20 rounded-lg object-cover flex-shrink-0 border border-slate-800"
                        />
                        <div className="space-y-1 w-full min-w-0 flex-1">
                          <span className="text-[9px] uppercase tracking-wider text-[#C5A964] font-bold bg-[#AE8C45]/5 border border-[#AE8C45]/10 px-2 py-0.5 rounded">
                            {course.category}
                          </span>
                          <h3 className="font-serif font-bold text-sm text-white">{course.title}</h3>
                          <p className="text-[11px] text-slate-400 font-sans line-clamp-2 leading-relaxed">{course.description}</p>
                          <div className="flex flex-wrap gap-3 pt-1 text-[10px] font-sans text-slate-400">
                            <span>Fees: <strong className="text-slate-200">PKR {course.fees.toLocaleString()}</strong></span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${course.heroVideo ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                              {course.heroVideo ? '✓ Video' : '✗ No Video'}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${course.outline && course.outline.length > 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-[#AE8C45]/10 text-[#C5A964] border border-[#AE8C45]/20'}`}>
                              {course.outline && course.outline.length > 0 ? `✓ ${course.outline.length} Modules` : '⚠ No Outline'}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${course.faqs && course.faqs.length > 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-[#AE8C45]/10 text-[#C5A964] border border-[#AE8C45]/20'}`}>
                              {course.faqs && course.faqs.length > 0 ? `✓ ${course.faqs.length} FAQs` : '⚠ No FAQs'}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => openCourseModal(course)}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-[#C5A964] hover:text-white hover:bg-[#AE8C45] rounded-lg transition-colors cursor-pointer text-[10px] font-bold uppercase whitespace-nowrap"
                            title="Edit Basic Info"
                          >
                            <Edit className="h-3 w-3" /> Edit
                          </button>
                          <button
                            onClick={() => deleteCourse(course.id)}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-red-400 hover:text-white hover:bg-red-500 rounded-lg transition-colors cursor-pointer text-[10px] font-bold uppercase whitespace-nowrap"
                            title="Delete Course"
                          >
                            <Trash2 className="h-3 w-3" /> Delete
                          </button>
                        </div>
                      </div>

                      {/* Detail Page Quick-Edit Sections */}
                      <div className="border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-800">
                        <button
                          onClick={() => openCourseModal(course, 'overview')}
                          className="p-3 text-left hover:bg-slate-900 transition-colors group"
                        >
                          <span className="block text-[9px] text-slate-500 uppercase tracking-wider font-bold mb-0.5">Overview & Video</span>
                          <span className="block text-xs text-slate-300 group-hover:text-[#C5A964] transition-colors truncate">
                            {course.overview ? course.overview.slice(0, 40) + '...' : '⚠ Click to add overview'}
                          </span>
                        </button>
                        <button
                          onClick={() => openCourseModal(course, 'syllabus')}
                          className="p-3 text-left hover:bg-slate-900 transition-colors group"
                        >
                          <span className="block text-[9px] text-slate-500 uppercase tracking-wider font-bold mb-0.5">Syllabus & Careers</span>
                          <span className="block text-xs text-slate-300 group-hover:text-[#C5A964] transition-colors">
                            {course.syllabus?.length > 0 ? `${course.syllabus.length} learning points` : '⚠ Click to add syllabus'}
                          </span>
                        </button>
                        <button
                          onClick={() => openCourseModal(course, 'outline')}
                          className="p-3 text-left hover:bg-slate-900 transition-colors group"
                        >
                          <span className="block text-[9px] text-slate-500 uppercase tracking-wider font-bold mb-0.5">Module Outline</span>
                          <span className="block text-xs text-slate-300 group-hover:text-[#C5A964] transition-colors">
                            {course.outline?.length > 0 ? `${course.outline.length} modules defined` : '⚠ Click to add modules'}
                          </span>
                        </button>
                        <button
                          onClick={() => openCourseModal(course, 'faqs')}
                          className="p-3 text-left hover:bg-slate-900 transition-colors group"
                        >
                          <span className="block text-[9px] text-slate-500 uppercase tracking-wider font-bold mb-0.5">Course FAQs</span>
                          <span className="block text-xs text-slate-300 group-hover:text-[#C5A964] transition-colors">
                            {course.faqs?.length > 0 ? `${course.faqs.length} FAQs saved` : '⚠ Click to add FAQs'}
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* TAB 3: REVIEW ADMISSIONS */}
            {cmsTab === 'admissions' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-850 pb-4 gap-4">
                  <h2 className="font-serif text-xl font-bold text-[#C5A964]">
                    Student Admissions Panel
                  </h2>
                  
                  {/* Filters */}
                  <div className="flex flex-wrap gap-2">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg text-slate-300 text-xs py-1.5 px-3 focus:outline-none"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Hold">On Hold</option>
                      <option value="Rejected">Rejected</option>
                    </select>

                    <select
                      value={courseFilter}
                      onChange={(e) => setCourseFilter(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg text-slate-300 text-xs py-1.5 px-3 focus:outline-none max-w-xs"
                    >
                      <option value="All">All Courses</option>
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {filteredAdmissions.length === 0 ? (
                  <div className="text-center py-16 bg-slate-950/40 rounded-xl border border-slate-850">
                    <p className="text-slate-500 text-sm font-sans">No matching student admission records found.</p>
                  </div>
                ) : (
                  <div className="bg-slate-950 border border-slate-850 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse font-sans text-xs sm:text-sm">
                        <thead>
                          <tr className="border-b border-slate-850 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                            <th className="py-3 px-2">ID</th>
                            <th className="py-3 px-2">Student Name</th>
                            <th className="py-3 px-2">Course Applied</th>
                            <th className="py-3 px-2">Payment Receipt</th>
                            <th className="py-3 px-2 text-center">Status</th>
                            <th className="py-3 px-2 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAdmissions.map((adm) => (
                            <tr key={adm.id} className="border-b border-slate-900/50 hover:bg-slate-900/30">
                              <td className="py-2.5 px-2 font-mono font-bold text-[#C5A964]">{adm.id}</td>
                              <td className="py-2.5 px-2">
                                <span className="block font-semibold text-slate-200">{adm.studentName}</span>
                                <span className="block text-[10px] text-slate-500">{adm.phone}</span>
                              </td>
                              <td className="py-2.5 px-2">
                                <div className="space-y-1">
                                  <span className="block text-slate-300 font-medium truncate max-w-[200px] xl:max-w-xs">{adm.selectedCourseTitle}</span>
                                  <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                                    <span className="text-slate-400">Fee: PKR {(adm.tuitionFee || 0).toLocaleString()}</span>
                                    <span className="text-slate-400">Reg: PKR {(adm.regFee || 0).toLocaleString()}</span>
                                    {(adm.discountAmount || 0) > 0 && (
                                      <span className="text-[#C5A964] font-bold bg-[#AE8C45]/10 px-1 rounded">
                                        Discount: -PKR {(adm.discountAmount || 0).toLocaleString()}
                                      </span>
                                    )}
                                  </div>
                                  <span className="block text-[10px] text-slate-500">Shift: {adm.shift}</span>
                                </div>
                              </td>
                              <td className="py-2.5 px-2">
                                <div className="flex flex-col space-y-1.5">
                                  <div className="flex items-center space-x-1.5">
                                    <span className="bg-slate-900 border border-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded text-[10px] w-max">
                                      Slip: {adm.receiptNumber || 'None'}
                                    </span>
                                    {adm.receiptFile ? (
                                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5" title="Slip File is Uploaded">
                                        📎 Yes
                                      </span>
                                    ) : (
                                      <span className="text-[10px] font-bold text-[#C5A964] flex items-center gap-0.5" title="Slip File is NOT Uploaded">
                                        ○ No Slip
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Fee Status:</span>
                                    <span className={`text-[11px] font-bold ${
                                      adm.feeStatus === 'Paid' ? 'text-emerald-400' :
                                      adm.feeStatus === 'Uploaded' ? 'text-cyan-400 font-semibold blink' :
                                      'text-[#C5A964] font-semibold'
                                    }`}>
                                      {adm.feeStatus === 'Paid' ? 'Verified & Paid' :
                                       adm.feeStatus === 'Uploaded' ? 'Receipt Uploaded' :
                                       'Pending / Awaiting'}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-2.5 px-2 text-center">
                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  adm.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                  adm.status === 'Hold' ? 'bg-[#AE8C45]/10 text-[#C5A964] border border-[#AE8C45]/20' :
                                  adm.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                  'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                }`}>
                                  {adm.status}
                                </span>
                              </td>
                              <td className="py-2.5 px-2 text-right">
                                <button
                                  onClick={() => {
                                    setSelectedAdmission(adm);
                                    setAdminRemarks(adm.remarks || '');
                                    setSelectedTuitionFee(adm.tuitionFee || 0);
                                    setSelectedRegFee(adm.regFee || 0);
                                    setSelectedDiscount(adm.discountAmount || 0);
                                    setSelectedFeeStatus(adm.feeStatus || 'Pending');
                                    setResendInvoiceMessage(null);
                                  }}
                                  className="inline-flex items-center space-x-1 bg-slate-900 border border-slate-800 text-[#C5A964] hover:text-[#0C1B2C] hover:bg-[#AE8C45] px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  <span>View & Process</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: STUDENT FEES INFO */}
            {cmsTab === 'fees' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-xl font-bold text-[#C5A964] pb-2 border-b border-slate-800 flex items-center justify-between">
                    <span>Student Fee Management</span>
                    <span className="text-sm font-sans text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                      Total Records: {admissions.length}
                    </span>
                  </h2>
                  <p className="text-slate-400 text-xs mt-2 font-light">
                    Track all student fee submissions, verified payments, and pending dues across all courses.
                  </p>
                </div>

                <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-inner">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-slate-900/80 text-slate-400 text-[10px] uppercase tracking-wider">
                        <tr>
                          <th className="py-3 px-4 font-bold border-b border-slate-800">Student Name</th>
                          <th className="py-3 px-4 font-bold border-b border-slate-800">Course & Shift</th>
                          <th className="py-3 px-4 font-bold border-b border-slate-800">Total Fee (PKR)</th>
                          <th className="py-3 px-4 font-bold border-b border-slate-800">Receipt</th>
                          <th className="py-3 px-4 font-bold border-b border-slate-800">Payment Status</th>
                          <th className="py-3 px-4 font-bold border-b border-slate-800 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {admissions.map(adm => (
                          <tr key={adm.id} className="hover:bg-slate-900/50 transition-colors">
                            <td className="py-3 px-4">
                              <span className="font-semibold text-slate-200 block">{adm.studentName}</span>
                              <span className="text-[10px] text-slate-500 font-mono block">{adm.id}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="block text-slate-300 font-medium truncate max-w-[150px]" title={adm.selectedCourseTitle}>{adm.selectedCourseTitle}</span>
                              <span className="block text-[10px] text-slate-500">{adm.shift}</span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex flex-col">
                                <span className="font-bold text-[#C5A964]">
                                  {((adm.tuitionFee || 0) + (adm.regFee || 0) - (adm.discountAmount || 0)).toLocaleString()}
                                </span>
                                {(adm.discountAmount || 0) > 0 && (
                                  <span className="text-[9px] text-emerald-400">Discount: -{adm.discountAmount}</span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              {adm.receiptFile ? (
                                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1" title="Slip File is Uploaded">
                                  📎 Uploaded
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                                  ○ Missing
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                adm.feeStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                adm.feeStatus === 'Uploaded' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 blink' :
                                'bg-[#AE8C45]/10 text-[#C5A964] border border-[#AE8C45]/20'
                              }`}>
                                {adm.feeStatus === 'Paid' ? 'Verified' :
                                 adm.feeStatus === 'Uploaded' ? 'Reviewing' :
                                 'Pending'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => {
                                  setSelectedAdmission(adm);
                                  setAdminRemarks(adm.remarks || '');
                                  setSelectedTuitionFee(adm.tuitionFee || 0);
                                  setSelectedRegFee(adm.regFee || 0);
                                  setSelectedDiscount(adm.discountAmount || 0);
                                  setSelectedFeeStatus(adm.feeStatus || 'Pending');
                                  setResendInvoiceMessage(null);
                                }}
                                className="inline-flex items-center space-x-1 bg-slate-900 border border-slate-800 text-[#C5A964] hover:text-[#0C1B2C] hover:bg-[#AE8C45] px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                <span>View Detail</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                        {admissions.length === 0 && (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-slate-500 text-xs italic">
                              No student records found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: CURATE MEDIA & TESTIMONIALS */}
            {cmsTab === 'content' && (
              <div className="space-y-8">
                
                {/* Section A: Gallery Curator */}
                <div className="space-y-4">
                  <h2 className="font-serif text-lg font-bold text-[#C5A964] pb-2 border-b border-slate-800">
                    Curate Kitchen Photo Gallery
                  </h2>
                  <form onSubmit={handleAddGallery} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end bg-slate-950 p-4 rounded-xl border border-slate-850">
                    <div className="sm:col-span-4 space-y-1">
                      <label className="text-[10px] uppercase text-slate-400 font-bold">Photo Title</label>
                      <input
                        type="text"
                        value={newGallery.title}
                        onChange={(e) => setNewGallery(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. Sautéing training"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg text-xs p-2 text-slate-200"
                      />
                    </div>
                    <div className="sm:col-span-3 space-y-1">
                      <label className="text-[10px] uppercase text-slate-400 font-bold">Category</label>
                      <select
                        value={newGallery.category}
                        onChange={(e) => setNewGallery(prev => ({ ...prev, category: e.target.value as any }))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg text-xs p-2 text-slate-300"
                      >
                        <option value="Dish">Dish Plating</option>
                        <option value="Kitchen Lab">Kitchen Lab</option>
                        <option value="Event">Event Ceremony</option>
                      </select>
                    </div>
                    <div className="sm:col-span-3 space-y-1">
                      <label className="text-[10px] uppercase text-slate-400 font-bold">Photo Upload</label>
                      <div className="flex gap-1.5 items-center">
                        <input
                          ref={galleryFileRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleCmsImageUpload(file, setIsGalleryUploading, (url) => setNewGallery(prev => ({ ...prev, image: url })));
                            e.target.value = '';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => galleryFileRef.current?.click()}
                          disabled={isGalleryUploading}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-[#AE8C45]/10 hover:bg-[#AE8C45]/20 border border-[#AE8C45]/30 text-[#C5A964] rounded text-[10px] font-bold uppercase tracking-wider transition-colors disabled:opacity-50 whitespace-nowrap"
                        >
                          {isGalleryUploading ? <><span className="animate-spin inline-block">⏳</span> Uploading...</> : <><Upload className="h-3 w-3" /> Upload</>}
                        </button>
                        <input
                          type="text"
                          value={newGallery.image}
                          onChange={(e) => setNewGallery(prev => ({ ...prev, image: e.target.value }))}
                          placeholder="or paste URL"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg text-xs p-1.5 text-slate-200"
                        />
                      </div>
                      {newGallery.image && (
                        <div className="flex items-center gap-1 mt-1">
                          <img src={newGallery.image} alt="preview" className="h-8 w-8 rounded object-cover border border-[#AE8C45]/30" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
                          <span className="text-[9px] text-emerald-400 font-bold">✓ Ready</span>
                        </div>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="sm:col-span-2 bg-[#AE8C45] text-[#0C1B2C] py-2 rounded-lg text-xs font-bold uppercase"
                    >
                      Add Photo
                    </button>
                  </form>

                  {/* List gallery items */}
                  <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
                    {gallery.map(g => (
                      <div key={g.id} className="relative h-16 bg-slate-950 rounded-lg overflow-hidden border border-slate-850 group">
                        <img src={g.image} alt={g.title} className="w-full h-full object-cover" />
                        <button
                          onClick={() => deleteGalleryItem(g.id)}
                          className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section B: Testimonials Curator */}
                <div className="space-y-4">
                  <h2 className="font-serif text-lg font-bold text-[#C5A964] pb-2 border-b border-slate-800">
                    Curate Student Reviews (Testimonials)
                  </h2>
                  <form onSubmit={handleAddTestimonial} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end bg-slate-950 p-4 rounded-xl border border-slate-850 font-sans text-xs">
                    <div className="sm:col-span-3 space-y-1">
                      <label className="text-[10px] uppercase text-slate-400 font-bold">Student Name</label>
                      <input
                        type="text"
                        value={newTestimonial.name}
                        onChange={(e) => setNewTestimonial(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Name"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                      />
                    </div>
                    <div className="sm:col-span-3 space-y-1">
                      <label className="text-[10px] uppercase text-slate-400 font-bold">Course Completed</label>
                      <input
                        type="text"
                        value={newTestimonial.course}
                        onChange={(e) => setNewTestimonial(prev => ({ ...prev, course: e.target.value }))}
                        placeholder="Culinary Arts Diploma"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[10px] uppercase text-slate-400 font-bold">Grad Status</label>
                      <select
                        value={newTestimonial.role}
                        onChange={(e) => setNewTestimonial(prev => ({ ...prev, role: e.target.value as any }))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-300"
                      >
                        <option value="Alumni">Alumni</option>
                        <option value="Entrepreneur">Entrepreneur</option>
                        <option value="Current Student">Current Student</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[10px] uppercase text-slate-400 font-bold">Rating</label>
                      <select
                        value={newTestimonial.rating}
                        onChange={(e) => setNewTestimonial(prev => ({ ...prev, rating: Number(e.target.value) }))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-300"
                      >
                        <option value="5">5 Star</option>
                        <option value="4">4 Star</option>
                      </select>
                    </div>
                    <div className="sm:col-span-12 space-y-1">
                      <label className="text-[10px] uppercase text-slate-400 font-bold">Student Review Text</label>
                      <textarea
                        value={newTestimonial.text}
                        onChange={(e) => setNewTestimonial(prev => ({ ...prev, text: e.target.value }))}
                        rows={2}
                        placeholder="The academy's practical curriculum changed my life..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 resize-none animate-none"
                      ></textarea>
                    </div>
                    <div className="sm:col-span-10 space-y-1">
                      <label className="text-[10px] uppercase text-slate-400 font-bold">Profile Photo (Optional)</label>
                      <div className="flex gap-1.5 items-center">
                        <input
                          ref={testimonialImgRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleCmsImageUpload(file, setIsTestimonialImgUploading, (url) => setNewTestimonial(prev => ({ ...prev, image: url })));
                            e.target.value = '';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => testimonialImgRef.current?.click()}
                          disabled={isTestimonialImgUploading}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-[#AE8C45]/10 hover:bg-[#AE8C45]/20 border border-[#AE8C45]/30 text-[#C5A964] rounded text-[10px] font-bold uppercase tracking-wider transition-colors disabled:opacity-50 whitespace-nowrap"
                        >
                          {isTestimonialImgUploading ? <><span className="animate-spin inline-block">⏳</span> Uploading...</> : <><Upload className="h-3 w-3" /> Upload Photo</>}
                        </button>
                        <input
                          type="text"
                          value={newTestimonial.image}
                          onChange={(e) => setNewTestimonial(prev => ({ ...prev, image: e.target.value }))}
                          placeholder="or paste image URL"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                        />
                      </div>
                      {newTestimonial.image && (
                        <div className="flex items-center gap-1 mt-1">
                          <img src={newTestimonial.image} alt="preview" className="h-8 w-8 rounded-full object-cover border border-[#AE8C45]/30" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
                          <span className="text-[9px] text-emerald-400 font-bold">✓ Photo ready</span>
                        </div>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="sm:col-span-2 bg-[#AE8C45] text-[#0C1B2C] font-bold py-2 rounded-lg text-xs uppercase"
                    >
                      Save Review
                    </button>
                  </form>

                  {/* List Reviews */}
                  <div className="space-y-2">
                    {testimonials.map(t => (
                      <div key={t.id} className="bg-slate-950 border border-slate-850 p-3 rounded-lg flex justify-between items-center text-xs">
                        <div>
                          <span className="font-semibold text-white">{t.name}</span>
                          <span className="text-slate-400 ml-2 font-mono">({t.course})</span>
                          <p className="text-[10px] text-slate-500 italic line-clamp-1 mt-0.5">"{t.text}"</p>
                        </div>
                        <button
                          onClick={() => deleteTestimonial(t.id)}
                          className="p-1 text-red-400 hover:text-white hover:bg-red-600 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                </div>

              </div>
            )}

            {/* TAB 5: SYSTEM SETTINGS */}
            {cmsTab === 'settings' && (
              <div className="space-y-8 font-sans text-xs sm:text-sm">
                
                <div>
                  <h2 className="font-serif text-xl font-bold text-[#C5A964] pb-2 border-b border-slate-800">
                    CMS System Settings
                  </h2>
                  <p className="text-slate-400 text-xs mt-2 font-light">
                    Manage drop-down selections, batch courses, fee structures, and default values here. Changes apply instantly to students on the Admission Form.
                  </p>
                </div>

                {/* SECTION 1: DYNAMIC ADMISSION PLANS & FEE HEADS */}
                <div className="space-y-6">
                  <div className="flex flex-wrap justify-between items-center border-l-2 border-[#AE8C45] pl-3 gap-2">
                    <div>
                      <h3 className="text-white font-bold uppercase tracking-wider text-xs">
                        Course Programs, Durations & Fee Heads Editor
                      </h3>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Configure different durations, Tuition Fees, and Reservation Fees (the fee heads) for each course.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        purgeFeeCache();
                        alert('Local fee cache purged! Fresh fees synced directly from Firestore DB.');
                      }}
                      className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[#C5A964] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Purge Cache & Re-Sync DB</span>
                    </button>
                  </div>

                  {/* Course plans layout */}
                  <div className="space-y-6">
                    {coursePlans && Object.keys(coursePlans).length > 0 ? (
                      Object.keys(coursePlans).map(courseName => {
                        const plans = coursePlans[courseName] || [];
                        const addRowData = newPlanData[courseName] || { duration: '', fee: 0, regFee: 0 };
                        
                        return (
                          <div key={courseName} className="bg-slate-950 border border-slate-900 rounded-xl overflow-hidden shadow-sm">
                            
                            {/* Course plan header */}
                            <div className="bg-slate-900/60 border-b border-slate-900 px-4 py-3 flex justify-between items-center">
                              <div className="flex items-center space-x-2">
                                <span className="h-2 w-2 rounded-full bg-[#AE8C45]"></span>
                                <span className="font-serif text-sm font-bold text-slate-200">{courseName} Program</span>
                              </div>
                              <button
                                onClick={() => handleDeleteCourseCategory(courseName)}
                                className="text-red-400 hover:text-red-300 font-bold text-[10px] uppercase flex items-center space-x-1"
                                title="Delete entire program category"
                              >
                                <Trash2 className="h-3 w-3" />
                                <span>Delete Program Category</span>
                              </button>
                            </div>

                            {/* Plan durations and fee heads table */}
                            <div className="p-4 space-y-4">
                              <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                  <thead>
                                    <tr className="border-b border-slate-900 text-slate-500 font-bold uppercase tracking-wider text-[10px] pb-2">
                                      <th className="py-2 px-3">Duration / Category</th>
                                      <th className="py-2 px-3">Tuition Fee (PKR)</th>
                                      <th className="py-2 px-3">Reservation Fee (PKR)</th>
                                      <th className="py-2 px-3">Plan Details (Website)</th>
                                      <th className="py-2 px-3 text-right">Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {plans.map((plan, idx) => {
                                      const isEditing = editingPlanKey === `${courseName}-${idx}`;
                                      
                                      return (
                                        <tr key={idx} className="border-b border-slate-900/30 hover:bg-slate-900/10 text-xs">
                                          
                                          {/* Duration Name */}
                                          <td className="py-2.5 px-3">
                                            {isEditing ? (
                                              <input
                                                type="text"
                                                value={editingPlanData.duration}
                                                onChange={(e) => setEditingPlanData(prev => ({ ...prev, duration: e.target.value }))}
                                                className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white font-sans max-w-[120px]"
                                              />
                                            ) : (
                                              <span className="text-slate-300 font-medium">{plan.duration}</span>
                                            )}
                                          </td>

                                          {/* Tuition Fee */}
                                          <td className="py-2.5 px-3">
                                            {isEditing ? (
                                              <input
                                                type="number"
                                                value={editingPlanData.fee}
                                                onChange={(e) => setEditingPlanData(prev => ({ ...prev, fee: Number(e.target.value) }))}
                                                className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white font-mono max-w-[110px]"
                                              />
                                            ) : (
                                              <span className="text-slate-200 font-mono">PKR {plan.fee.toLocaleString()}</span>
                                            )}
                                          </td>

                                          {/* Reservation Fee */}
                                          <td className="py-2.5 px-3">
                                            {isEditing ? (
                                              <input
                                                type="number"
                                                value={editingPlanData.regFee}
                                                onChange={(e) => setEditingPlanData(prev => ({ ...prev, regFee: Number(e.target.value) }))}
                                                className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white font-mono max-w-[90px]"
                                              />
                                            ) : (
                                              <span className="text-[#C5A964] font-mono font-semibold">PKR {plan.regFee.toLocaleString()}</span>
                                            )}
                                          </td>

                                          {/* Detail Field */}
                                          <td className="py-2.5 px-3">
                                            {isEditing ? (
                                              <textarea
                                                value={editingPlanData.detail || ''}
                                                onChange={(e) => setEditingPlanData(prev => ({ ...prev, detail: e.target.value }))}
                                                placeholder="Schedule: Mon-Wed&#10;Batches: Morning/Evening&#10;Outline: Module 1..."
                                                className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white font-sans w-full min-w-[200px] min-h-[60px] text-xs"
                                                rows={3}
                                              />
                                            ) : (
                                              <span className="text-slate-400 font-sans italic truncate block max-w-[200px]" title={plan.detail}>
                                                {plan.detail || 'No detail added'}
                                              </span>
                                            )}
                                          </td>

                                          {/* Actions */}
                                          <td className="py-2.5 px-3 text-right">
                                            {isEditing ? (
                                              <div className="flex justify-end space-x-2">
                                                <button
                                                  onClick={() => handleSavePlanRow(courseName, idx)}
                                                  className="bg-emerald-600 text-white px-2 py-1 rounded text-[10px] font-bold uppercase hover:bg-emerald-500"
                                                >
                                                  Save
                                                </button>
                                                <button
                                                  onClick={() => setEditingPlanKey(null)}
                                                  className="bg-slate-800 text-slate-400 px-2 py-1 rounded text-[10px] font-bold uppercase hover:bg-slate-700"
                                                >
                                                  Cancel
                                                </button>
                                              </div>
                                            ) : (
                                              <div className="flex justify-end space-x-2">
                                                <button
                                                  onClick={() => {
                                                    setEditingPlanKey(`${courseName}-${idx}`);
                                                    setEditingPlanData({ duration: plan.duration, fee: plan.fee, regFee: plan.regFee, detail: plan.detail });
                                                  }}
                                                  className="text-[#C5A964] hover:text-white p-1"
                                                  title="Edit plan"
                                                >
                                                  <Edit className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                  onClick={() => handleDeletePlanRow(courseName, idx)}
                                                  className="text-red-400 hover:text-white p-1"
                                                  title="Delete plan"
                                                >
                                                  <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                              </div>
                                            )}
                                          </td>

                                        </tr>
                                      );
                                    })}

                                    {/* ADD NEW ROW FOR PLAN */}
                                    <tr className="bg-slate-900/10 text-xs">
                                      <td className="py-3 px-3">
                                        <input
                                          type="text"
                                          placeholder="e.g. 1 Year Program"
                                          value={addRowData.duration}
                                          onChange={(e) => setNewPlanData(prev => ({
                                            ...prev,
                                            [courseName]: { ...addRowData, duration: e.target.value }
                                          }))}
                                          className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white font-sans w-full max-w-[150px]"
                                        />
                                      </td>
                                      <td className="py-3 px-3">
                                        <input
                                          type="number"
                                          placeholder="Tuition Fee (PKR)"
                                          value={addRowData.fee || ''}
                                          onChange={(e) => setNewPlanData(prev => ({
                                            ...prev,
                                            [courseName]: { ...addRowData, fee: Number(e.target.value) }
                                          }))}
                                          className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white font-mono w-full max-w-[110px]"
                                        />
                                      </td>
                                      <td className="py-3 px-3">
                                        <input
                                          type="number"
                                          placeholder="Reservation Fee (PKR)"
                                          value={addRowData.regFee || ''}
                                          onChange={(e) => setNewPlanData(prev => ({
                                            ...prev,
                                            [courseName]: { ...addRowData, regFee: Number(e.target.value) }
                                          }))}
                                          className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white font-mono w-full max-w-[90px]"
                                        />
                                      </td>
                                      <td className="py-3 px-3">
                                        <textarea
                                          placeholder="Schedule: Mon-Wed&#10;Batches: Morning/Evening&#10;Outline: Module 1..."
                                          value={addRowData.detail || ''}
                                          onChange={(e) => setNewPlanData(prev => ({
                                            ...prev,
                                            [courseName]: { ...addRowData, detail: e.target.value }
                                          }))}
                                          className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white font-sans w-full min-w-[200px] min-h-[60px] text-xs"
                                          rows={3}
                                        />
                                      </td>
                                      <td className="py-3 px-3 text-right">
                                        <button
                                          onClick={() => handleAddPlanRow(courseName)}
                                          className="bg-[#AE8C45] hover:bg-[#AE8C45] text-[#0C1B2C] px-3 py-1.5 rounded font-bold uppercase text-[10px] flex items-center space-x-1 ml-auto"
                                        >
                                          <Plus className="h-3 w-3 stroke-[3]" />
                                          <span>Add Plan</span>
                                        </button>
                                      </td>
                                    </tr>

                                  </tbody>
                                </table>
                              </div>
                            </div>

                          </div>
                        );
                      })
                    ) : (
                      <p className="text-slate-500 text-xs italic">No course plans configured.</p>
                    )}
                  </div>

                  {/* ADD NEW COURSE PROGRAM FORM */}
                  <form onSubmit={handleAddNewCourseCategory} className="bg-slate-950 border border-slate-900 p-5 rounded-xl space-y-4 max-w-xl">
                    <span className="block font-bold text-[#C5A964] uppercase tracking-wider text-xs">
                      + Register New Course Program Category
                    </span>
                    <p className="text-slate-400 text-xs leading-relaxed font-light">
                      Add a completely new type of culinary course. It will immediately show up as an option inside the candidate registration forms.
                    </p>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="e.g. Pastry Masterclass or Food Styling"
                        required
                        value={newCourseName}
                        onChange={(e) => setNewCourseName(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 text-xs sm:text-sm flex-1 focus:border-[#AE8C45]/50 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="bg-[#AE8C45] text-[#0C1B2C] font-bold px-4 py-2 rounded-lg hover:brightness-110 text-xs uppercase font-sans tracking-wide"
                      >
                        Add Category
                      </button>
                    </div>
                  </form>
                </div>

                {/* SECTION 2: DANGER ZONE (DATABASE RESET) */}
                <div className="space-y-4 max-w-xl">
                  <div className="border-l-2 border-red-500 pl-3">
                    <h3 className="text-red-400 font-bold uppercase tracking-wider text-xs">
                      System Database Control & Safety
                    </h3>
                  </div>
                  
                  <div className="bg-slate-950 border border-slate-850 p-6 rounded-xl space-y-4">
                    <span className="block font-bold text-red-500 uppercase tracking-wider text-xs">Database Reset (Danger Zone)</span>
                    <p className="text-slate-400 leading-relaxed font-light">
                      This reset clears all custom student registrations, custom course descriptions, and custom uploads, restoring the application database strictly to its default factory demo state.
                    </p>
                    
                    <button
                      onClick={() => {
                        if (confirm('Are you absolutely sure you want to delete all admissions and reset courses data to default? This is irreversible.')) {
                          resetAllData();
                          alert('Database reset successful.');
                        }
                      }}
                      className="flex items-center space-x-1.5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2.5 rounded-lg font-bold border border-red-500/20 hover:border-red-600 uppercase tracking-wide transition-all"
                    >
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Reset to Demo Defaults</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {cmsTab === 'website' && (
              <WebsiteCMSEditor />
            )}

            {/* TAB: PAYMENT SETTINGS */}
            {cmsTab === 'payment' && (
              <div className="space-y-8 max-w-2xl">
                <h2 className="font-serif text-xl font-bold text-[#C5A964] pb-2 border-b border-slate-800">
                  Payment & Bank Account Settings
                </h2>
                <p className="text-xs text-slate-400">These details appear on the student's admission invoice. Update them here and they'll reflect immediately on all new invoices.</p>

                {/* Bank Account Section */}
                <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-lg">
                  <h3 className="font-sans font-bold text-base text-white flex items-center gap-2">
                    <span className="text-[#C5A964]">🏦</span> Bank Account Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-slate-400 uppercase text-[10px] font-bold block">Bank Name</label>
                      <input
                        type="text"
                        value={paymentSettings.bankName}
                        onChange={e => setPaymentSettings(p => ({ ...p, bankName: e.target.value }))}
                        placeholder="e.g. Bank Alfalah Ltd"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-[#AE8C45]/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-400 uppercase text-[10px] font-bold block">Account Title</label>
                      <input
                        type="text"
                        value={paymentSettings.accountTitle}
                        onChange={e => setPaymentSettings(p => ({ ...p, accountTitle: e.target.value }))}
                        placeholder="e.g. The Chef's Academy"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-[#AE8C45]/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-400 uppercase text-[10px] font-bold block">Account Number</label>
                      <input
                        type="text"
                        value={paymentSettings.accountNumber}
                        onChange={e => setPaymentSettings(p => ({ ...p, accountNumber: e.target.value }))}
                        placeholder="e.g. 5502-9018274619"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-slate-200 text-sm font-mono focus:outline-none focus:border-[#AE8C45]/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-400 uppercase text-[10px] font-bold block">IBAN (Optional)</label>
                      <input
                        type="text"
                        value={paymentSettings.iban}
                        onChange={e => setPaymentSettings(p => ({ ...p, iban: e.target.value }))}
                        placeholder="e.g. PK36ALFA0123456789012345"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-slate-200 text-sm font-mono focus:outline-none focus:border-[#AE8C45]/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Mobile Wallet Section */}
                <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-lg">
                  <h3 className="font-sans font-bold text-base text-white flex items-center gap-2">
                    <span className="text-[#C5A964]">📱</span> Mobile Wallet (JazzCash / Easypaisa)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-slate-400 uppercase text-[10px] font-bold block">Wallet Name / Label</label>
                      <input
                        type="text"
                        value={paymentSettings.mobileName}
                        onChange={e => setPaymentSettings(p => ({ ...p, mobileName: e.target.value }))}
                        placeholder="e.g. JazzCash / Easypaisa"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-[#AE8C45]/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-400 uppercase text-[10px] font-bold block">Mobile Number</label>
                      <input
                        type="text"
                        value={paymentSettings.mobileNumber}
                        onChange={e => setPaymentSettings(p => ({ ...p, mobileNumber: e.target.value }))}
                        placeholder="e.g. 0333-9123456"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-slate-200 text-sm font-mono focus:outline-none focus:border-[#AE8C45]/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-400 uppercase text-[10px] font-bold block">Account Title</label>
                      <input
                        type="text"
                        value={paymentSettings.mobileTitle}
                        onChange={e => setPaymentSettings(p => ({ ...p, mobileTitle: e.target.value }))}
                        placeholder="e.g. The Chef's Academy"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-[#AE8C45]/50"
                      />
                    </div>
                  </div>
                </div>

                {paymentSaveMsg && (
                  <p className="text-emerald-400 text-xs font-bold">{paymentSaveMsg}</p>
                )}

                <button
                  onClick={() => {
                    updateWebsiteData({ ...websiteData, paymentSettings });
                    setPaymentSaveMsg('✅ Payment settings saved successfully!');
                    setTimeout(() => setPaymentSaveMsg(''), 4000);
                  }}
                  className="flex items-center gap-2 bg-[#AE8C45] hover:bg-[#AE8C45] text-[#0C1B2C] font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  Save Payment Settings
                </button>
              </div>
            )}

            {/* TAB: POPUP ANNOUNCEMENT SETTINGS */}
            {cmsTab === 'popup' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h2 className="font-serif text-xl font-bold text-[#C5A964] pb-2 border-b border-slate-800 flex items-center gap-2">
                    <Megaphone className="h-5 w-5" />
                    Popup Announcement Settings
                  </h2>
                  <p className="text-xs text-slate-400 mt-2">Configure the popup that appears when visitors open the website. Set active dates, write the announcement, and save.</p>
                </div>

                {/* Enable / Disable toggle */}
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white text-sm">Enable Popup</p>
                      <p className="text-slate-400 text-xs mt-0.5">Turn the popup on or off for all website visitors.</p>
                    </div>
                    <button
                      onClick={() => setPopupDraft(p => ({ ...p, enabled: !p.enabled }))}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none cursor-pointer ${
                        popupDraft.enabled ? 'bg-[#AE8C45]' : 'bg-slate-700'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        popupDraft.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  {/* Active date range */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-slate-400 uppercase text-[10px] font-bold flex items-center gap-1.5"><Calendar className="h-3 w-3" /> Start Date</label>
                      <input
                        type="date"
                        value={popupDraft.startDate}
                        onChange={e => setPopupDraft(p => ({ ...p, startDate: e.target.value }))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-[#AE8C45]/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-400 uppercase text-[10px] font-bold flex items-center gap-1.5"><Calendar className="h-3 w-3" /> End Date</label>
                      <input
                        type="date"
                        value={popupDraft.endDate}
                        onChange={e => setPopupDraft(p => ({ ...p, endDate: e.target.value }))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-[#AE8C45]/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Popup Content */}
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
                  <h3 className="font-bold text-white text-sm">Popup Content</h3>

                  <div className="space-y-1.5">
                    <label className="text-slate-400 uppercase text-[10px] font-bold block">Title / Heading</label>
                    <input
                      type="text"
                      value={popupDraft.title}
                      onChange={e => setPopupDraft(p => ({ ...p, title: e.target.value }))}
                      placeholder="e.g. Admissions Now Open!"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-[#AE8C45]/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-400 uppercase text-[10px] font-bold block">Main Content / Body Text</label>
                    <textarea
                      value={popupDraft.content}
                      onChange={e => setPopupDraft(p => ({ ...p, content: e.target.value }))}
                      rows={5}
                      placeholder="Describe the announcement in detail. e.g. which courses are open, batch dates, seat limits..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-[#AE8C45]/50 resize-y"
                    />
                    <p className="text-slate-600 text-[10px]">Tip: Use a new line to separate information.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-400 uppercase text-[10px] font-bold block">Image URL (Optional)</label>
                    <input
                      type="text"
                      value={popupDraft.image}
                      onChange={e => setPopupDraft(p => ({ ...p, image: e.target.value }))}
                      placeholder="Paste an image URL to show at the top of the popup"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-[#AE8C45]/50 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-400 uppercase text-[10px] font-bold block">Apply Now Link (Optional)</label>
                    <input
                      type="text"
                      value={popupDraft.link}
                      onChange={e => setPopupDraft(p => ({ ...p, link: e.target.value }))}
                      placeholder="Leave blank to open the Admission Portal, or paste a URL"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-[#AE8C45]/50 font-mono"
                    />
                    <p className="text-slate-600 text-[10px]">Leave blank → opens admission portal. Paste an external URL → opens in new tab.</p>
                  </div>
                </div>

                {/* Live Preview badge */}
                <div className="bg-[#AE8C45]/5 border border-[#AE8C45]/20 rounded-xl p-4 text-xs text-amber-300/80 leading-relaxed">
                  <strong className="text-[#C5A964]">How it works:</strong> When enabled and the current date is within the start/end range, the popup will automatically appear for every visitor when they open the website. They must click Close or the X button before they can scroll through the page.
                </div>

                {popupSaveMsg && (
                  <p className="text-emerald-400 text-xs font-bold">{popupSaveMsg}</p>
                )}

                <button
                  onClick={() => {
                    updateWebsiteData({ ...websiteData, popupSettings: popupDraft });
                    setPopupSaveMsg('✅ Popup settings saved successfully!');
                    setTimeout(() => setPopupSaveMsg(''), 4000);
                  }}
                  className="flex items-center gap-2 bg-[#AE8C45] hover:bg-[#AE8C45] text-[#0C1B2C] font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  Save Popup Settings
                </button>
              </div>
            )}

            {/* TAB: TCA SHOP & INVENTORY */}
            {cmsTab === 'shop' && (() => {
              const now = new Date();
              const startOfWeek = new Date(now);
              startOfWeek.setDate(now.getDate() - now.getDay());
              startOfWeek.setHours(0,0,0,0);
              const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

              const filtered = purchaseRecords.filter(r => {
                const d = new Date(r.date);
                if (reportFilter === 'week') return d >= startOfWeek;
                if (reportFilter === 'month') return d >= startOfMonth;
                return true;
              });
              const totalExpense = filtered.reduce((s, r) => s + (r.cost || 0), 0);
              const weekExpense = purchaseRecords.filter(r => new Date(r.date) >= startOfWeek).reduce((s,r)=>s+r.cost,0);
              const monthExpense = purchaseRecords.filter(r => new Date(r.date) >= startOfMonth).reduce((s,r)=>s+r.cost,0);

              return (
                <div className="space-y-6 font-sans">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <h2 className="font-serif text-xl font-bold text-[#C5A964] flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" /> TCA Shop & Inventory
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">Track purchases, manage stock levels & generate expense reports</p>
                    </div>
                    {/* Sub-tab switcher */}
                    <div className="flex gap-2">
                      {(['inventory','purchases','report'] as const).map(t => (
                        <button key={t} onClick={() => setShopSubTab(t)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${shopSubTab===t ? 'bg-[#AE8C45] text-[#0C1B2C]' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
                          {t === 'inventory' ? '📦 Inventory' : t === 'purchases' ? '🛒 Purchases' : '📊 Report'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">Items in Stock</p>
                      <p className="text-2xl font-bold text-white font-serif">{inventoryItems.length}</p>
                    </div>
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">Total Purchases</p>
                      <p className="text-2xl font-bold text-white font-serif">{purchaseRecords.length}</p>
                    </div>
                    <div className="bg-slate-950 border border-[#AE8C45]/30 rounded-xl p-4 space-y-1">
                      <p className="text-[10px] text-[#C5A964] uppercase tracking-wider">This Week Spent</p>
                      <p className="text-2xl font-bold text-[#C5A964] font-serif">Rs {weekExpense.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-950 border border-[#AE8C45]/30 rounded-xl p-4 space-y-1">
                      <p className="text-[10px] text-[#C5A964] uppercase tracking-wider">This Month Spent</p>
                      <p className="text-2xl font-bold text-[#C5A964] font-serif">Rs {monthExpense.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* ===== INVENTORY SUB-TAB ===== */}
                  {shopSubTab === 'inventory' && (
                    <div className="space-y-5">
                      {/* Add Item Form */}
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                        <h3 className="text-xs font-bold text-[#C5A964] uppercase tracking-wider flex items-center gap-2"><Plus className="h-4 w-4"/>Add New Item to Inventory</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <input value={newInventoryItem.name} onChange={e=>setNewInventoryItem(p=>({...p,name:e.target.value}))}
                            placeholder="Item Name *" className="col-span-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#AE8C45]" />
                          <input value={newInventoryItem.category} onChange={e=>setNewInventoryItem(p=>({...p,category:e.target.value}))}
                            placeholder="Category (e.g. Ingredients)" className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#AE8C45]" />
                          <div className="flex gap-2">
                            <input type="number" min="0" value={newInventoryItem.quantity} onChange={e=>setNewInventoryItem(p=>({...p,quantity:+e.target.value}))}
                              placeholder="Qty" className="w-1/2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#AE8C45]" />
                            <input value={newInventoryItem.unit} onChange={e=>setNewInventoryItem(p=>({...p,unit:e.target.value}))}
                              placeholder="Unit" className="w-1/2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#AE8C45]" />
                          </div>
                        </div>
                        <button onClick={async()=>{
                          if(!newInventoryItem.name.trim()) return;
                          await addInventoryItem(newInventoryItem);
                          setNewInventoryItem({name:'',category:'',quantity:0,unit:'pcs'});
                        }} className="inline-flex items-center gap-2 bg-[#AE8C45] hover:bg-[#C5A964] text-[#0C1B2C] font-bold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer">
                          <Plus className="h-3 w-3"/> Add to Inventory
                        </button>
                      </div>

                      {/* Stock Adjust Modal */}
                      {stockAdjustItem && (
                        <div className="bg-slate-950 border border-[#AE8C45]/40 rounded-xl p-5 space-y-3">
                          <h3 className="text-xs font-bold text-[#C5A964] uppercase tracking-wider">Adjust Stock: <span className="text-white">{stockAdjustItem.name}</span></h3>
                          <div className="flex gap-3 items-center flex-wrap">
                            <div className="flex rounded-lg overflow-hidden border border-slate-700">
                              <button onClick={()=>setStockAdjustMode('add')} className={`px-3 py-1.5 text-xs font-bold cursor-pointer ${stockAdjustMode==='add'?'bg-emerald-600 text-white':'bg-slate-900 text-slate-400'}`}>+ Add</button>
                              <button onClick={()=>setStockAdjustMode('remove')} className={`px-3 py-1.5 text-xs font-bold cursor-pointer ${stockAdjustMode==='remove'?'bg-red-600 text-white':'bg-slate-900 text-slate-400'}`}>− Remove</button>
                            </div>
                            <input type="number" min="1" value={stockAdjustQty} onChange={e=>setStockAdjustQty(+e.target.value)}
                              className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#AE8C45]" />
                            <span className="text-xs text-slate-400">Current: <strong className="text-white">{stockAdjustItem.quantity} {stockAdjustItem.unit}</strong></span>
                            <button onClick={async()=>{
                              const newQty = stockAdjustMode==='add' ? stockAdjustItem.quantity + stockAdjustQty : Math.max(0, stockAdjustItem.quantity - stockAdjustQty);
                              await updateInventoryItem({...stockAdjustItem, quantity: newQty});
                              setStockAdjustItem(null); setStockAdjustQty(0);
                            }} className="inline-flex items-center gap-1 bg-[#AE8C45] hover:bg-[#C5A964] text-[#0C1B2C] font-bold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer">
                              <Save className="h-3 w-3"/> Confirm
                            </button>
                            <button onClick={()=>{setStockAdjustItem(null);setStockAdjustQty(0);}} className="text-slate-400 hover:text-white text-xs cursor-pointer">Cancel</button>
                          </div>
                        </div>
                      )}

                      {/* Inventory Table */}
                      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                        <table className="w-full text-xs">
                          <thead className="bg-slate-900 border-b border-slate-800">
                            <tr>
                              <th className="px-4 py-3 text-left text-[10px] text-slate-400 uppercase tracking-wider">Item</th>
                              <th className="px-4 py-3 text-left text-[10px] text-slate-400 uppercase tracking-wider">Category</th>
                              <th className="px-4 py-3 text-center text-[10px] text-slate-400 uppercase tracking-wider">Qty</th>
                              <th className="px-4 py-3 text-center text-[10px] text-slate-400 uppercase tracking-wider">Unit</th>
                              <th className="px-4 py-3 text-left text-[10px] text-slate-400 uppercase tracking-wider">Last Updated</th>
                              <th className="px-4 py-3 text-center text-[10px] text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {inventoryItems.length === 0 ? (
                              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-600 italic">No items in inventory yet. Add your first item above.</td></tr>
                            ) : inventoryItems.map(item => (
                              <tr key={item.id} className="hover:bg-slate-900/50 transition-colors">
                                <td className="px-4 py-3 text-white font-medium">{item.name}</td>
                                <td className="px-4 py-3 text-slate-400">{item.category || '—'}</td>
                                <td className="px-4 py-3 text-center">
                                  <span className={`font-bold text-sm ${item.quantity < 5 ? 'text-red-400' : item.quantity < 20 ? 'text-amber-400' : 'text-emerald-400'}`}>{item.quantity}</span>
                                </td>
                                <td className="px-4 py-3 text-center text-slate-400">{item.unit}</td>
                                <td className="px-4 py-3 text-slate-500">{new Date(item.lastUpdated).toLocaleDateString()}</td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center justify-center gap-2">
                                    <button onClick={()=>{setStockAdjustItem(item);setStockAdjustQty(0);setStockAdjustMode('add');}}
                                      className="text-[#C5A964] hover:text-[#AE8C45] cursor-pointer" title="Adjust Stock"><Package className="h-4 w-4"/></button>
                                    <button onClick={()=>deleteInventoryItem(item.id)}
                                      className="text-red-400 hover:text-red-300 cursor-pointer" title="Delete"><Trash2 className="h-4 w-4"/></button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* ===== PURCHASES SUB-TAB ===== */}
                  {shopSubTab === 'purchases' && (
                    <div className="space-y-5">
                      {/* Add Purchase Form */}
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                        <h3 className="text-xs font-bold text-[#C5A964] uppercase tracking-wider flex items-center gap-2"><ShoppingCart className="h-4 w-4"/>Record New Purchase</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase tracking-wider">Item Name *</label>
                            <input list="inv-items-list" value={newPurchase.itemName} onChange={e=>setNewPurchase(p=>({...p,itemName:e.target.value}))}
                              placeholder="Type or select from inventory..." className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#AE8C45]" />
                            <datalist id="inv-items-list">{inventoryItems.map(i=><option key={i.id} value={i.name}/>)}</datalist>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase tracking-wider">Cost (Rs) *</label>
                            <input type="number" min="0" value={newPurchase.cost} onChange={e=>setNewPurchase(p=>({...p,cost:+e.target.value}))}
                              placeholder="0" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#AE8C45]" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase tracking-wider">Quantity Purchased</label>
                            <div className="flex gap-2">
                              <input type="number" min="0" value={newPurchase.quantityAdded} onChange={e=>setNewPurchase(p=>({...p,quantityAdded:+e.target.value}))}
                                className="w-2/3 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#AE8C45]" />
                              <input value={newPurchase.unit} onChange={e=>setNewPurchase(p=>({...p,unit:e.target.value}))}
                                placeholder="Unit" className="w-1/3 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#AE8C45]" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase tracking-wider">Purchased By</label>
                            <input value={newPurchase.purchasedBy} onChange={e=>setNewPurchase(p=>({...p,purchasedBy:e.target.value}))}
                              placeholder="Staff name" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#AE8C45]" />
                          </div>
                        </div>
                        <button onClick={async()=>{
                          if(!newPurchase.itemName.trim() || !newPurchase.cost) return;
                          await addPurchaseRecord(newPurchase);
                          setNewPurchase({itemName:'',cost:0,quantityAdded:0,unit:'pcs',purchasedBy:''});
                        }} className="inline-flex items-center gap-2 bg-[#AE8C45] hover:bg-[#C5A964] text-[#0C1B2C] font-bold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer">
                          <Plus className="h-3 w-3"/> Record Purchase
                        </button>
                        <p className="text-[10px] text-slate-600 italic">* If the item exists in inventory, stock will be updated automatically.</p>
                      </div>

                      {/* Purchases Table */}
                      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-300">Recent Purchases</span>
                          <span className="text-[10px] text-slate-500">{purchaseRecords.length} total records</span>
                        </div>
                        <table className="w-full text-xs">
                          <thead className="bg-slate-900 border-b border-slate-800">
                            <tr>
                              <th className="px-4 py-3 text-left text-[10px] text-slate-400 uppercase tracking-wider">Date</th>
                              <th className="px-4 py-3 text-left text-[10px] text-slate-400 uppercase tracking-wider">Item</th>
                              <th className="px-4 py-3 text-center text-[10px] text-slate-400 uppercase tracking-wider">Qty</th>
                              <th className="px-4 py-3 text-right text-[10px] text-slate-400 uppercase tracking-wider">Cost</th>
                              <th className="px-4 py-3 text-left text-[10px] text-slate-400 uppercase tracking-wider">By</th>
                              <th className="px-4 py-3 text-center text-[10px] text-slate-400 uppercase tracking-wider">Del</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {purchaseRecords.length === 0 ? (
                              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-600 italic">No purchases recorded yet.</td></tr>
                            ) : purchaseRecords.map(rec => (
                              <tr key={rec.id} className="hover:bg-slate-900/50 transition-colors">
                                <td className="px-4 py-3 text-slate-400">{new Date(rec.date).toLocaleDateString()}</td>
                                <td className="px-4 py-3 text-white font-medium">{rec.itemName}</td>
                                <td className="px-4 py-3 text-center text-slate-300">{rec.quantityAdded} {rec.unit}</td>
                                <td className="px-4 py-3 text-right font-bold text-[#C5A964]">Rs {rec.cost.toLocaleString()}</td>
                                <td className="px-4 py-3 text-slate-400">{rec.purchasedBy || '—'}</td>
                                <td className="px-4 py-3 text-center">
                                  <button onClick={()=>deletePurchaseRecord(rec.id)} className="text-red-400 hover:text-red-300 cursor-pointer"><Trash2 className="h-4 w-4"/></button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* ===== REPORT SUB-TAB ===== */}
                  {shopSubTab === 'report' && (
                    <div className="space-y-5">
                      {/* Filter */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xs text-slate-400">Filter by:</span>
                        {(['week','month','all'] as const).map(f => (
                          <button key={f} onClick={()=>setReportFilter(f)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all ${reportFilter===f?'bg-[#AE8C45] text-[#0C1B2C]':'bg-slate-800 text-slate-400 hover:text-white'}`}>
                            {f === 'week' ? 'This Week' : f === 'month' ? 'This Month' : 'All Time'}
                          </button>
                        ))}
                        <span className="ml-auto text-xs font-bold text-[#C5A964]">Total: Rs {totalExpense.toLocaleString()}</span>
                      </div>

                      {/* Summary Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-center space-y-2">
                          <BarChart2 className="h-6 w-6 text-[#C5A964] mx-auto"/>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Total Expense ({reportFilter === 'week' ? 'Week' : reportFilter === 'month' ? 'Month' : 'All'})</p>
                          <p className="text-3xl font-bold text-white font-serif">Rs {totalExpense.toLocaleString()}</p>
                        </div>
                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-center space-y-2">
                          <ShoppingCart className="h-6 w-6 text-[#C5A964] mx-auto"/>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Purchase Transactions</p>
                          <p className="text-3xl font-bold text-white font-serif">{filtered.length}</p>
                        </div>
                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-center space-y-2">
                          <TrendingUp className="h-6 w-6 text-[#C5A964] mx-auto"/>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Avg Cost / Purchase</p>
                          <p className="text-3xl font-bold text-white font-serif">Rs {filtered.length ? Math.round(totalExpense / filtered.length).toLocaleString() : '0'}</p>
                        </div>
                      </div>

                      {/* Category Breakdown */}
                      {(() => {
                        const byItem: Record<string, number> = {};
                        filtered.forEach(r => { byItem[r.itemName] = (byItem[r.itemName] || 0) + r.cost; });
                        const sorted = Object.entries(byItem).sort((a,b) => b[1] - a[1]);
                        return sorted.length === 0 ? (
                          <div className="text-center text-slate-600 py-8 italic text-xs">No purchases in this period.</div>
                        ) : (
                          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                            <div className="px-4 py-3 border-b border-slate-800">
                              <span className="text-xs font-bold text-slate-300">Expense Breakdown by Item</span>
                            </div>
                            <div className="divide-y divide-slate-800">
                              {sorted.map(([name, cost]) => (
                                <div key={name} className="flex items-center justify-between px-4 py-3">
                                  <span className="text-xs text-white font-medium">{name}</span>
                                  <div className="flex items-center gap-4">
                                    <div className="w-32 sm:w-48 bg-slate-800 rounded-full h-1.5">
                                      <div className="bg-[#AE8C45] h-1.5 rounded-full" style={{width:`${Math.min(100,(cost/totalExpense)*100)}%`}}/>
                                    </div>
                                    <span className="text-xs font-bold text-[#C5A964] w-24 text-right">Rs {cost.toLocaleString()}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}

                      {/* Detailed Log */}
                      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-800">
                          <span className="text-xs font-bold text-slate-300">Detailed Transaction Log</span>
                        </div>
                        <table className="w-full text-xs">
                          <thead className="bg-slate-900 border-b border-slate-800">
                            <tr>
                              <th className="px-4 py-3 text-left text-[10px] text-slate-400 uppercase">Date</th>
                              <th className="px-4 py-3 text-left text-[10px] text-slate-400 uppercase">Item</th>
                              <th className="px-4 py-3 text-center text-[10px] text-slate-400 uppercase">Qty</th>
                              <th className="px-4 py-3 text-right text-[10px] text-slate-400 uppercase">Cost</th>
                              <th className="px-4 py-3 text-left text-[10px] text-slate-400 uppercase">By</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {filtered.length === 0 ? (
                              <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-600 italic">No records for selected period.</td></tr>
                            ) : filtered.map(rec => (
                              <tr key={rec.id} className="hover:bg-slate-900/50">
                                <td className="px-4 py-3 text-slate-400">{new Date(rec.date).toLocaleDateString()}</td>
                                <td className="px-4 py-3 text-white">{rec.itemName}</td>
                                <td className="px-4 py-3 text-center text-slate-300">{rec.quantityAdded} {rec.unit}</td>
                                <td className="px-4 py-3 text-right font-bold text-[#C5A964]">Rs {rec.cost.toLocaleString()}</td>
                                <td className="px-4 py-3 text-slate-400">{rec.purchasedBy || '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {cmsTab === 'settings' && (
              <div className="space-y-8 max-w-lg">
                <h2 className="font-serif text-xl font-bold text-[#C5A964] pb-2 border-b border-slate-800">
                  System Settings & Security
                </h2>
                
                <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-lg">
                  <h3 className="font-sans font-bold text-lg text-white">Change Admin Passcode</h3>
                  <p className="text-xs text-slate-400">
                    Update the passcode required to access this CMS. Ensure it's something secure.
                  </p>
                  
                  <form onSubmit={handlePasscodeChange} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-slate-400 uppercase text-[10px] font-bold block">New Passcode</label>
                      <input
                        type="password"
                        value={newPasscode}
                        onChange={(e) => setNewPasscode(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-[#AE8C45]/50"
                        required
                        minLength={5}
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-slate-400 uppercase text-[10px] font-bold block">Confirm New Passcode</label>
                      <input
                        type="password"
                        value={confirmPasscode}
                        onChange={(e) => setConfirmPasscode(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-[#AE8C45]/50"
                        required
                        minLength={5}
                      />
                    </div>

                    {passcodeMessage.text && (
                      <p className={`text-xs ${passcodeMessage.type === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>
                        {passcodeMessage.text}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="bg-[#AE8C45] hover:bg-[#AE8C45] text-[#0C1B2C] font-bold px-4 py-2 rounded-lg text-xs uppercase tracking-wider transition-colors cursor-pointer w-full"
                    >
                      Update Passcode
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* MODAL: ADD / EDIT COURSE */}
      <AnimatePresence>
        {isCourseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCourseModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-5 text-sm font-sans"
            >
              <div className="border-b border-slate-850 pb-3 flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#C5A964]">
                    {editingCourse ? `Editing: ${editingCourse.title}` : 'Create New Course'}
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Tabs marked <span className="text-[#C5A964] font-bold">🌐</span> control the public course detail page visible to students
                  </p>
                </div>
                <span className="text-slate-500 text-xs font-mono bg-slate-900 px-2 py-1 rounded">Dynamic Page CMS</span>
              </div>

              {/* Course Modal Tabs */}
              <div className="flex border-b border-slate-800 text-xs overflow-x-auto whitespace-nowrap mb-2 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setCourseModalTab('basic')}
                  className={`px-3.5 py-2 font-bold ${courseModalTab === 'basic' ? 'border-b-2 border-[#AE8C45] text-[#C5A964]' : 'text-slate-400 hover:text-white'}`}
                >
                  Basic Info
                </button>
                <button
                  type="button"
                  onClick={() => setCourseModalTab('overview')}
                  className={`px-3.5 py-2 font-bold ${courseModalTab === 'overview' ? 'border-b-2 border-[#AE8C45] text-[#C5A964]' : 'text-slate-400 hover:text-white'}`}
                >
                  🌐 Overview & Video
                </button>
                <button
                  type="button"
                  onClick={() => setCourseModalTab('syllabus')}
                  className={`px-3.5 py-2 font-bold ${courseModalTab === 'syllabus' ? 'border-b-2 border-[#AE8C45] text-[#C5A964]' : 'text-slate-400 hover:text-white'}`}
                >
                  🌐 Syllabus & Careers
                </button>
                <button
                  type="button"
                  onClick={() => setCourseModalTab('outline')}
                  className={`px-3.5 py-2 font-bold ${courseModalTab === 'outline' ? 'border-b-2 border-[#AE8C45] text-[#C5A964]' : 'text-slate-400 hover:text-white'}`}
                >
                  🌐 Outline Modules ({courseOutline.length})
                </button>
                <button
                  type="button"
                  onClick={() => setCourseModalTab('faqs')}
                  className={`px-3.5 py-2 font-bold ${courseModalTab === 'faqs' ? 'border-b-2 border-[#AE8C45] text-[#C5A964]' : 'text-slate-400 hover:text-white'}`}
                >
                  🌐 Course FAQs ({courseFaqs.length})
                </button>
              </div>

              <form onSubmit={handleSaveCourse} className="space-y-4 text-xs sm:text-sm">
                
                {/* TAB 1: BASIC INFO */}
                {courseModalTab === 'basic' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold uppercase text-[10px]">Course Title *</label>
                      <input
                        type="text"
                        required
                        value={courseFormData.title}
                        onChange={(e) => setCourseFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. Diploma in Baking Science"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold uppercase text-[10px]">Course Category *</label>
                      <select
                        value={courseFormData.category}
                        onChange={(e) => setCourseFormData(prev => ({ ...prev, category: e.target.value as any }))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-300"
                      >
                        <option value="Diploma">Diploma Program</option>
                        <option value="Baking">Baking & Patisserie</option>
                        <option value="Fast Food">Fast Food & Continental</option>
                        <option value="Short Course">Short Course</option>
                        <option value="Culinary Arts">Culinary Arts</option>
                        <option value="Professional Chef">Professional Chef</option>
                        <option value="Baking & Desserts">Baking & Desserts</option>
                        <option value="Barista Skills">Barista Skills</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold uppercase text-[10px]">Duration *</label>
                      <input
                        type="text"
                        required
                        value={courseFormData.duration}
                        onChange={(e) => setCourseFormData(prev => ({ ...prev, duration: e.target.value }))}
                        placeholder="e.g. 3 Months"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold uppercase text-[10px]">Instructor Name *</label>
                      <input
                        type="text"
                        required
                        value={courseFormData.instructor}
                        onChange={(e) => setCourseFormData(prev => ({ ...prev, instructor: e.target.value }))}
                        placeholder="Chef Name"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold uppercase text-[10px]">Base Tuition Fee (PKR) *</label>
                      <input
                        type="number"
                        required
                        value={courseFormData.fees}
                        onChange={(e) => setCourseFormData(prev => ({ ...prev, fees: Number(e.target.value) }))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold uppercase text-[10px]">Base Registration Fee (PKR) *</label>
                      <input
                        type="number"
                        required
                        value={courseFormData.registrationFee}
                        onChange={(e) => setCourseFormData(prev => ({ ...prev, registrationFee: Number(e.target.value) }))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                      />
                      <p className="text-[10px] text-amber-500 italic mt-1">Note: Actual registration/invoice fees are managed in "System Settings &gt; Fee Management". These are just fallback values.</p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold uppercase text-[10px]">Class Capacity (Seats) *</label>
                      <input
                        type="number"
                        required
                        value={courseFormData.totalSeats}
                        onChange={(e) => setCourseFormData(prev => ({ ...prev, totalSeats: Number(e.target.value) }))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold uppercase text-[10px]">Banner Image *</label>
                      <div className="flex gap-1.5 items-center">
                        <input
                          ref={courseImgRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleCmsImageUpload(file, setIsCourseImgUploading, (url) => setCourseFormData(prev => ({ ...prev, image: url })));
                            e.target.value = '';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => courseImgRef.current?.click()}
                          disabled={isCourseImgUploading}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-[#AE8C45]/10 hover:bg-[#AE8C45]/20 border border-[#AE8C45]/30 text-[#C5A964] rounded text-[10px] font-bold uppercase tracking-wider transition-colors disabled:opacity-50 whitespace-nowrap"
                        >
                          {isCourseImgUploading ? <><span className="animate-spin inline-block">⏳</span> Uploading...</> : <><Upload className="h-3 w-3" /> Upload</>}
                        </button>
                        <input
                          type="text"
                          value={courseFormData.image}
                          onChange={(e) => setCourseFormData(prev => ({ ...prev, image: e.target.value }))}
                          placeholder="or paste image URL"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                        />
                      </div>
                      {courseFormData.image && (
                        <div className="flex items-center gap-1 mt-1">
                          <img src={courseFormData.image} alt="preview" className="h-10 w-16 rounded object-cover border border-[#AE8C45]/30" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
                          <span className="text-[9px] text-emerald-400 font-bold">✓ Banner ready</span>
                        </div>
                      )}
                    </div>

                    <div className="sm:col-span-2 space-y-2 pt-2 border-t border-slate-900">
                      <div className="flex justify-between items-center">
                        <label className="text-slate-400 font-bold uppercase text-[10px]">Available Shifts *</label>
                        <button
                          type="button"
                          onClick={handleAddShift}
                          className="text-[#C5A964] hover:text-white text-[10px] uppercase font-bold"
                        >
                          + Add Shift Time
                        </button>
                      </div>
                      <div className="space-y-2 max-h-24 overflow-y-auto pr-2">
                        {courseFormData.shifts.map((shift, idx) => (
                          <div key={idx} className="flex space-x-2 items-center">
                            <input
                              type="text"
                              required
                              value={shift}
                              onChange={(e) => handleShiftChange(idx, e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-200"
                            />
                            {courseFormData.shifts.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveShift(idx)}
                                className="text-red-400 hover:text-white"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: OVERVIEW */}
                {courseModalTab === 'overview' && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold uppercase text-[10px]">Short Description *</label>
                      <textarea
                        required
                        value={courseFormData.description}
                        onChange={(e) => setCourseFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={2}
                        placeholder="Short card tagline description..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 resize-none font-sans"
                      ></textarea>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold uppercase text-[10px]">Detailed Overview Text *</label>
                      <textarea
                        required
                        value={courseFormData.overview}
                        onChange={(e) => setCourseFormData(prev => ({ ...prev, overview: e.target.value }))}
                        rows={7}
                        placeholder="Long form introduction copy for individual detailed page view..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 font-sans leading-relaxed"
                      ></textarea>
                    </div>

                    <div className="space-y-3 bg-slate-900/40 p-4 border border-slate-800/80 rounded-xl">
                      <div className="flex items-center justify-between">
                        <label className="text-slate-300 font-bold uppercase text-[10px]">Promo / Hero Video *</label>
                        {courseFormData.heroVideo && (
                          <span className="text-[10px] text-[#C5A964] font-mono bg-[#AE8C45]/10 px-2 py-0.5 rounded">
                            Active Source Attached
                          </span>
                        )}
                      </div>

                      {/* Video Drag & Drop Uploader */}
                      <div 
                        onDragEnter={handleVideoDrag}
                        onDragOver={handleVideoDrag}
                        onDragLeave={handleVideoDrag}
                        onDrop={handleVideoDrop}
                        className={`border border-dashed rounded-lg p-5 text-center transition-all ${
                          videoDragActive 
                            ? 'border-[#AE8C45] bg-[#AE8C45]/5' 
                            : 'border-slate-800 bg-slate-950/40 hover:bg-slate-950/80'
                        }`}
                      >
                        <input 
                          ref={videoInputRef}
                          type="file" 
                          accept="video/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleCourseVideoUpload(e.target.files[0]);
                            }
                          }}
                          className="hidden" 
                        />
                        
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="p-2.5 bg-slate-900 rounded-full text-slate-400">
                            <Upload className="h-5 w-5" />
                          </div>
                          
                          <div className="space-y-1">
                            <button
                              type="button"
                              onClick={() => videoInputRef.current?.click()}
                              disabled={isVideoUploading}
                              className="px-3.5 py-1.5 bg-[#AE8C45] hover:bg-[#AE8C45] disabled:bg-[#AE8C45]/20 text-[#0C1B2C] disabled:text-slate-500 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                            >
                              {isVideoUploading ? 'Uploading Video...' : 'Choose Video File'}
                            </button>
                            <p className="text-[10px] text-slate-500">
                              or drag and drop your video file here
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Manual Input field for flexibility */}
                      <div className="space-y-1 pt-1">
                        <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">Or specify File Name / Video URL</span>
                        <input
                          type="text"
                          required
                          value={courseFormData.heroVideo}
                          onChange={(e) => setCourseFormData(prev => ({ ...prev, heroVideo: e.target.value }))}
                          placeholder="e.g. Culinary-Arts.mp4 or https://domain.com/video.mp4"
                          className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2 text-slate-200 text-xs font-sans"
                        />
                        <p className="text-[10px] text-slate-500 italic mt-0.5">
                          Supports local asset files (e.g. barista.mp4) or server-uploaded assets (e.g. /uploads/video-123.mp4) or direct external URLs.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: SYLLABUS & CANDIDATES */}
                {courseModalTab === 'syllabus' && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold uppercase text-[10px]">What You Will Learn (One point per line) *</label>
                      <textarea
                        required
                        value={courseFormData.syllabus}
                        onChange={(e) => setCourseFormData(prev => ({ ...prev, syllabus: e.target.value }))}
                        rows={4}
                        placeholder="Knife handling and safety&#13;Art of Mother Sauces&#13;Classical French Cookery"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 font-sans"
                      ></textarea>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold uppercase text-[10px]">Who Should Apply? (One point per line) *</label>
                      <textarea
                        required
                        value={courseFormData.apply}
                        onChange={(e) => setCourseFormData(prev => ({ ...prev, apply: e.target.value }))}
                        rows={3.5}
                        placeholder="School/college leavers planning a culinary career&#13;Home cooks ready to go professional"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 font-sans"
                      ></textarea>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold uppercase text-[10px]">Career Opportunities (One role per line) *</label>
                      <textarea
                        required
                        value={courseFormData.careers}
                        onChange={(e) => setCourseFormData(prev => ({ ...prev, careers: e.target.value }))}
                        rows={3.5}
                        placeholder="Commis Chef&#13;Bakery Owner&#13;Hotel Pastry Specialist"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 font-sans"
                      ></textarea>
                    </div>
                  </div>
                )}

                {/* TAB 4: OUTLINE MODULES */}
                {courseModalTab === 'outline' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                      <div>
                        <span className="text-slate-300 font-bold text-xs block">Detailed Curriculum Modules</span>
                        <span className="text-slate-500 text-[10px] font-light">Add weekly modules or specialized lessons with specific topics.</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddOutlineModule}
                        className="bg-[#AE8C45] text-[#0C1B2C] px-2.5 py-1 rounded-md text-[10px] font-bold uppercase hover:bg-[#AE8C45]"
                      >
                        + Add Module
                      </button>
                    </div>

                    <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-1">
                      {courseOutline.length === 0 ? (
                        <p className="text-slate-500 text-xs italic text-center py-6 bg-slate-900/20 border border-slate-900 rounded-lg">No curriculum modules added. Click '+ Add Module' above.</p>
                      ) : (
                        courseOutline.map((mod, idx) => (
                          <div key={idx} className="p-3 bg-slate-900/40 border border-slate-850 rounded-xl space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Module #{idx+1}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveOutlineModule(idx)}
                                className="text-red-400 hover:text-white"
                                title="Remove Module"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <div className="space-y-2">
                              <input
                                type="text"
                                required
                                placeholder="Module Title (e.g. Module 1 — Kitchen Foundations)"
                                value={mod.t}
                                onChange={(e) => handleOutlineModuleChange(idx, 't', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-200 font-serif"
                              />
                              <textarea
                                required
                                placeholder="Module topics (one per line)"
                                value={mod.d}
                                onChange={(e) => handleOutlineModuleChange(idx, 'd', e.target.value)}
                                rows={3}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-300 font-sans"
                              ></textarea>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 5: COURSE FAQS */}
                {courseModalTab === 'faqs' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                      <div>
                        <span className="text-slate-300 font-bold text-xs block">Course-Specific FAQs</span>
                        <span className="text-slate-500 text-[10px] font-light">Custom Q&A details displayed dynamically for this course.</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddFaq}
                        className="bg-[#AE8C45] text-[#0C1B2C] px-2.5 py-1 rounded-md text-[10px] font-bold uppercase hover:bg-[#AE8C45]"
                      >
                        + Add FAQ
                      </button>
                    </div>

                    <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-1">
                      {courseFaqs.length === 0 ? (
                        <p className="text-slate-500 text-xs italic text-center py-6 bg-slate-900/20 border border-slate-900 rounded-lg">No custom FAQs added. Click '+ Add FAQ' above.</p>
                      ) : (
                        courseFaqs.map((faq, idx) => (
                          <div key={idx} className="p-3 bg-slate-900/40 border border-slate-850 rounded-xl space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">FAQ #{idx+1}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveFaq(idx)}
                                className="text-red-400 hover:text-white"
                                title="Remove FAQ"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <div className="space-y-2">
                              <input
                                type="text"
                                required
                                placeholder="Question (e.g. Do I need previous experience?)"
                                value={faq.q}
                                onChange={(e) => handleFaqChange(idx, 'q', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-200 font-serif"
                              />
                              <textarea
                                required
                                placeholder="Answer details..."
                                value={faq.a}
                                onChange={(e) => handleFaqChange(idx, 'a', e.target.value)}
                                rows={2.5}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-300 font-sans"
                              ></textarea>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Footer buttons */}
                <div className="flex justify-between items-center pt-3 border-t border-slate-850">
                  <div className="text-slate-500 text-[10px] font-light">
                    * All changes update the dynamic course detail pages instantly.
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsCourseModalOpen(false)}
                      className="px-4 py-2 rounded-lg border border-slate-800 text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#AE8C45] text-[#0C1B2C] font-bold px-5 py-2 rounded-lg hover:brightness-110 shadow-lg shadow-[#AE8C45]/10"
                    >
                      Save Course
                    </button>
                  </div>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: VIEW ADMISSION & PROCESS STATUS */}
      <AnimatePresence>
        {selectedAdmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAdmission(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-none"
            ></motion.div>
            
            <motion.div
              id="print-area"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6 text-sm font-sans"
            >
              
              {/* Receipt Header */}
              <div className="flex justify-between items-start border-b border-slate-850 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-sans font-bold text-[#C5A964] uppercase tracking-widest">Enrollment Application Document</span>
                  <div className="font-display leading-[0.9] text-white">
                    <div className="flex items-end gap-1">
                      <span className="text-[10px] text-[#F7F2DE] font-light">The</span>
                      <span className="text-lg text-[#F7F2DE] font-medium leading-none">Chef's</span>
                    </div>
                    <div className="text-base text-[#F7F2DE] font-medium tracking-wide -mt-0.5 leading-none">Academy</div>
                  </div>
                  <span className="text-[10px] text-slate-500 block">Date Submitted: {new Date(selectedAdmission.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div className="text-right">
                  <span className="block font-mono text-lg font-black text-[#C5A964]">{selectedAdmission.id}</span>
                  <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider mt-1 ${
                    selectedAdmission.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' :
                    selectedAdmission.status === 'Hold' ? 'bg-[#AE8C45]/10 text-[#C5A964] border border-[#AE8C45]/10' :
                    selectedAdmission.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/10' :
                    'bg-blue-500/10 text-blue-400 border border-blue-500/10'
                  }`}>
                    {selectedAdmission.status}
                  </span>
                </div>
              </div>

              {/* Data tables Grid */}
              <div className="space-y-5">
                
                {/* Applied Course */}
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-900 space-y-2">
                  <span className="text-[10px] text-[#C5A964] font-bold uppercase tracking-wider block">Course & Shift Choice</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-500 text-xs block">Selected Culinary Course</span>
                      <span className="text-white font-medium block text-xs sm:text-sm">{selectedAdmission.selectedCourseTitle}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs block">Shifts Preference</span>
                      <span className="text-white font-medium block text-xs sm:text-sm">{selectedAdmission.shift}</span>
                    </div>
                  </div>
                </div>

                {/* Student Personal Info */}
                <div className="space-y-3">
                  <span className="text-[10px] text-[#C5A964] font-bold uppercase tracking-wider block">Student Profile details</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4 text-xs sm:text-sm bg-slate-900/30 p-4 rounded-xl border border-slate-900">
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block">Full Name</span>
                      <span className="text-slate-200 font-medium block">{selectedAdmission.studentName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block">Father's Name</span>
                      <span className="text-slate-200 font-medium block">{selectedAdmission.fatherName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block">CNIC / B-Form</span>
                      <span className="text-slate-200 font-medium block font-mono">{selectedAdmission.cnic}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block">Mobile/WhatsApp</span>
                      <span className="text-slate-200 font-medium block select-all font-mono">{selectedAdmission.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block">Email Address</span>
                      <span className="text-slate-200 font-medium block select-all truncate">{selectedAdmission.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block">Date of Birth</span>
                      <span className="text-slate-200 font-medium block font-mono">{selectedAdmission.dateOfBirth}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block">Gender</span>
                      <span className="text-slate-200 font-medium block">{selectedAdmission.gender}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block">Last Education</span>
                      <span className="text-slate-200 font-medium block">{selectedAdmission.qualification}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block">City</span>
                      <span className="text-slate-200 font-medium block">{selectedAdmission.city}</span>
                    </div>
                    <div className="col-span-2 sm:col-span-3 border-t border-slate-900 pt-2.5">
                      <span className="text-slate-500 text-[10px] uppercase block">Postal Address</span>
                      <span className="text-slate-300 block text-xs leading-relaxed">{selectedAdmission.address}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Receipt / Verification */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-900 space-y-1.5">
                    <span className="text-[10px] text-[#C5A964] font-bold uppercase tracking-wider block">Tuition Deposit Receipt</span>
                    <span className="text-slate-500 text-[10px] block">Receipt / Deposit Slip Trans ID:</span>
                    <span className="text-white font-mono font-bold block text-sm select-all">{selectedAdmission.receiptNumber || 'Not Uploaded'}</span>
                  </div>

                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-900 space-y-1.5">
                    <span className="text-[10px] text-[#C5A964] font-bold uppercase tracking-wider block">Student Remarks Notes</span>
                    <span className="text-slate-400 text-xs italic block leading-relaxed line-clamp-2">
                      {selectedAdmission.notes ? `"${selectedAdmission.notes}"` : 'No additional notes provided by student.'}
                    </span>
                  </div>
                </div>

                {/* Fee & Discount Management Panel */}
                <div className="bg-slate-900/60 p-5 rounded-xl border border-[#c19d53]/20 space-y-4">
                  <div className="flex items-center space-x-2 text-[#C5A964] font-bold uppercase tracking-wider text-xs border-b border-slate-800 pb-2">
                    <DollarSign className="h-4 w-4" />
                    <span>Fee Structure, Discount & Email Invoice dispatch</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                    <div className="space-y-1.5">
                      <label className="text-slate-400 uppercase text-[10px] font-bold block">Tuition Fee (PKR)</label>
                      <input
                        type="number"
                        value={selectedTuitionFee}
                        onChange={(e) => setSelectedTuitionFee(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-400 uppercase text-[10px] font-bold block">Registration Fee (PKR)</label>
                      <input
                        type="number"
                        value={selectedRegFee}
                        onChange={(e) => setSelectedRegFee(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[#C5A964] uppercase text-[10px] font-bold block">Applied Student Discount (PKR)</label>
                      <input
                        type="number"
                        value={selectedDiscount}
                        onChange={(e) => setSelectedDiscount(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-[#C5A964] font-bold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-400 uppercase text-[10px] font-bold block">Fee Payment Status</label>
                      <select
                        value={selectedFeeStatus}
                        onChange={(e) => setSelectedFeeStatus(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-300"
                      >
                        <option value="Pending">Pending Payment / Receipt</option>
                        <option value="Uploaded">Receipt Uploaded (Verifying)</option>
                        <option value="Paid">Verified & Fully Paid</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2 bg-slate-950 p-3 rounded-lg border border-slate-850 flex justify-between items-center mt-2">
                      <div>
                        <span className="text-slate-400 text-[10px] block uppercase">Final Net Outstanding Payable Amount:</span>
                        <span className="text-slate-500 text-[10px] block font-light">Calculated: Fee ({selectedTuitionFee}) + Reg ({selectedRegFee}) - Discount ({selectedDiscount})</span>
                      </div>
                      <span className="font-mono text-base font-extrabold text-[#c19d53] block">
                        PKR {(selectedTuitionFee + selectedRegFee - selectedDiscount).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-900">
                    <button
                      type="button"
                      onClick={handleSaveAdmissionFees}
                      className="flex-1 bg-[#AE8C45] hover:bg-[#C5A964] text-[#0C1B2C] font-bold py-2.5 px-4 rounded-lg text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
                    >
                      <span>Save Fee & Discount Changes</span>
                    </button>

                    <button
                      type="button"
                      disabled={isResendingInvoice}
                      onClick={handleResendInvoiceEmail}
                      className="flex-1 bg-slate-950 hover:bg-slate-900 text-[#C5A964] hover:text-white font-bold py-2.5 px-4 rounded-lg text-xs uppercase tracking-wider border border-[#AE8C45]/30 hover:border-[#AE8C45] flex items-center justify-center space-x-1.5 cursor-pointer transition-colors disabled:opacity-50"
                    >
                      {isResendingInvoice ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          <span>Sending Invoice Email...</span>
                        </>
                      ) : (
                        <>
                          <Mail className="h-3.5 w-3.5" />
                          <span>Send / Resend Updated Invoice</span>
                        </>
                      )}
                    </button>
                  </div>

                  {resendInvoiceMessage && (
                    <div className={`p-3 rounded-lg border text-xs font-sans mt-2 ${
                      resendInvoiceMessage.type === 'success' 
                        ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300' 
                        : 'bg-red-500/5 border-red-500/20 text-red-300'
                    }`}>
                      {resendInvoiceMessage.text}
                    </div>
                  )}
                </div>

                {selectedAdmission.receiptFile && (
                  <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-900 space-y-2">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Uploaded Payment Proof / Receipt</span>
                    <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950 p-2 max-h-[500px] flex justify-center items-center">
                      {(selectedAdmission.receiptFile.startsWith('data:application/pdf') || selectedAdmission.receiptFile.toLowerCase().endsWith('.pdf') || selectedAdmission.receiptFile.includes('.pdf?alt=')) ? (
                        <div className="w-full space-y-2 text-center">
                          <iframe 
                            src={selectedAdmission.receiptFile} 
                            className="w-full h-80 rounded border border-slate-800" 
                            title="PDF Receipt"
                          />
                          <a href={selectedAdmission.receiptFile} target="_blank" rel="noreferrer" className="text-[#C5A964] hover:text-[#C5A964] text-xs inline-block underline">
                            Open PDF in New Tab
                          </a>
                        </div>
                      ) : (selectedAdmission.receiptFile.startsWith('data:image/') || selectedAdmission.receiptFile.startsWith('http') || selectedAdmission.receiptFile.startsWith('blob:') || selectedAdmission.receiptFile.startsWith('/') || selectedAdmission.receiptFile.match(/\.(jpeg|jpg|gif|png|webp)$/i)) ? (
                        <div className="w-full space-y-2 text-center">
                          <img 
                            src={selectedAdmission.receiptFile} 
                            alt="Uploaded payment receipt slip" 
                            className="max-h-96 mx-auto object-contain w-auto h-auto rounded shadow-lg"
                            referrerPolicy="no-referrer"
                          />
                          <a href={selectedAdmission.receiptFile} target="_blank" rel="noreferrer" className="text-[#C5A964] hover:text-[#C5A964] text-xs inline-block underline">
                            Open Image in New Tab
                          </a>
                        </div>
                      ) : (
                        <div className="w-full max-h-64 overflow-y-auto p-4 text-[10px] font-mono text-slate-400 break-all bg-slate-900 rounded">
                           {/* Fallback if it's some unrecognized text or truncated base64 */}
                           {selectedAdmission.receiptFile}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Administrator Action Board */}
                <div className="border-t border-slate-850 pt-5 space-y-4">
                  <span className="text-[10px] text-[#C5A964] font-bold uppercase tracking-wider block">Registrar Action & Status Update</span>
                  
                  <div className="space-y-2">
                    <label className="text-slate-500 text-xs block">Internal Staff Comments / Remarks:</label>
                    <textarea
                      value={adminRemarks}
                      onChange={(e) => setAdminRemarks(e.target.value)}
                      rows={2}
                      placeholder="e.g. Deposit verified via bank statement. Welcomed to batch."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 text-xs resize-none"
                    ></textarea>
                  </div>

                  {/* Remarks show */}
                  {selectedAdmission.remarks && (
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-900">
                      <span className="text-slate-500 text-[10px] uppercase block">Previous Remarks:</span>
                      <p className="text-slate-300 text-xs mt-0.5 leading-relaxed italic">"{selectedAdmission.remarks}"</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      onClick={() => handleProcessAdmission(selectedAdmission.id, 'Approved')}
                      className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-500 text-[#0C1B2C] font-bold px-3.5 py-2 rounded-lg text-xs uppercase"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Approve (Enrol Student)</span>
                    </button>
                    
                    <button
                      onClick={() => handleProcessAdmission(selectedAdmission.id, 'Hold')}
                      className="flex items-center space-x-1 bg-[#AE8C45] hover:bg-[#AE8C45] text-[#0C1B2C] font-bold px-3.5 py-2 rounded-lg text-xs uppercase"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <span>Put on Hold</span>
                    </button>

                    <button
                      onClick={() => handleProcessAdmission(selectedAdmission.id, 'Rejected')}
                      className="flex items-center space-x-1 bg-red-600 hover:bg-red-500 text-white font-bold px-3.5 py-2 rounded-lg text-xs uppercase"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Reject Application</span>
                    </button>
                  </div>

                </div>

              </div>

              {/* print / close bar */}
              <div className="flex justify-between items-center border-t border-slate-850 pt-4 flex-shrink-0">
                <button
                  onClick={printAdmissionDoc}
                  className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 px-4 py-2 rounded-xl text-xs font-bold uppercase transition-colors cursor-pointer"
                >
                  <Printer className="h-4 w-4 text-[#C5A964]" />
                  <span>Print Admission Form</span>
                </button>
                
                <button
                  onClick={() => setSelectedAdmission(null)}
                  className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 text-xs font-bold uppercase"
                >
                  Close Document
                </button>
              </div>

            </motion.div>

            {/* Print-Only View */}
            <div id="print-only" className="hidden font-sans">
              <div className="text-center mb-6 border-b-2 border-black pb-4 flex flex-col items-center">
                <img src="/logo.png" alt="Academy Logo" className="h-20 mb-2" />
                <div className="font-display leading-[0.9] text-slate-950 mb-1">
                  <div className="flex items-end gap-1 justify-center">
                    <span className="text-sm font-light">The</span>
                    <span className="text-2xl font-medium leading-none">Chef's</span>
                  </div>
                  <div className="text-xl font-medium tracking-wide -mt-0.5 leading-none text-center">Academy</div>
                </div>
                <p className="text-sm">Admission Application Form</p>
                <p className="text-sm font-bold mt-2">Tracking ID: {selectedAdmission.id}</p>
              </div>

              <table className="w-full border-collapse border border-black text-sm">
                <tbody>
                  <tr>
                    <th className="border border-black p-2 bg-gray-100 text-left w-1/3">Student Name</th>
                    <td className="border border-black p-2">{selectedAdmission.studentName}</td>
                  </tr>
                  <tr>
                    <th className="border border-black p-2 bg-gray-100 text-left">Father's Name</th>
                    <td className="border border-black p-2">{selectedAdmission.fatherName}</td>
                  </tr>
                  <tr>
                    <th className="border border-black p-2 bg-gray-100 text-left">Course Selected</th>
                    <td className="border border-black p-2">{selectedAdmission.selectedCourseTitle} ({selectedAdmission.shift})</td>
                  </tr>
                  <tr>
                    <th className="border border-black p-2 bg-gray-100 text-left">CNIC</th>
                    <td className="border border-black p-2">{selectedAdmission.cnic}</td>
                  </tr>
                  <tr>
                    <th className="border border-black p-2 bg-gray-100 text-left">Phone</th>
                    <td className="border border-black p-2">{selectedAdmission.phone}</td>
                  </tr>
                  <tr>
                    <th className="border border-black p-2 bg-gray-100 text-left">Email</th>
                    <td className="border border-black p-2">{selectedAdmission.email}</td>
                  </tr>
                  <tr>
                    <th className="border border-black p-2 bg-gray-100 text-left">Date of Birth</th>
                    <td className="border border-black p-2">{selectedAdmission.dateOfBirth}</td>
                  </tr>
                  <tr>
                    <th className="border border-black p-2 bg-gray-100 text-left">Gender</th>
                    <td className="border border-black p-2">{selectedAdmission.gender}</td>
                  </tr>
                  <tr>
                    <th className="border border-black p-2 bg-gray-100 text-left">Qualification</th>
                    <td className="border border-black p-2">{selectedAdmission.qualification}</td>
                  </tr>
                  <tr>
                    <th className="border border-black p-2 bg-gray-100 text-left">City</th>
                    <td className="border border-black p-2">{selectedAdmission.city}</td>
                  </tr>
                  <tr>
                    <th className="border border-black p-2 bg-gray-100 text-left">Postal Address</th>
                    <td className="border border-black p-2">{selectedAdmission.address}</td>
                  </tr>
                  <tr>
                    <th className="border border-black p-2 bg-gray-100 text-left">Fee Status</th>
                    <td className="border border-black p-2">{selectedAdmission.feeStatus}</td>
                  </tr>
                  <tr>
                    <th className="border border-black p-2 bg-gray-100 text-left">Application Status</th>
                    <td className="border border-black p-2 font-bold">{selectedAdmission.status}</td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-12 flex justify-between px-10">
                <div className="text-center">
                  <div className="w-48 border-b border-black mb-2"></div>
                  <p>Student Signature</p>
                </div>
                <div className="text-center">
                  <div className="w-48 border-b border-black mb-2"></div>
                  <p>Authorized Signature</p>
                </div>
              </div>
            </div>

          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
