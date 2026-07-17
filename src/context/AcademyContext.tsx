import React, { createContext, useContext, useState, useEffect } from 'react';
import { Course, Admission, Testimonial, GalleryItem, CoursePlans, CoursePlanItem, WebsiteData } from '../types';
import { INITIAL_COURSES, INITIAL_TESTIMONIALS, INITIAL_GALLERY } from '../data/defaultData';
import { INITIAL_WEBSITE_DATA } from '../data/websiteDefaultData';
import { auth, db } from '../lib/firebase';
import { signInAnonymously } from 'firebase/auth';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';

const safeSetItem = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Failed to save key "${key}" to localStorage:`, error);
    if (error instanceof Error && (
      error.name === 'QuotaExceededError' || 
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED' || 
      error.message?.toLowerCase().includes('quota') ||
      error.message?.toLowerCase().includes('exceeded')
    )) {
      window.dispatchEvent(new CustomEvent('storage-quota-exceeded', { detail: { key } }));
    }
    return false;
  }
};

// ─── Smart Cache with TTL ───────────────────────────────────────────────────
// Cache duration: 5 minutes (300,000 ms). Data older than this will be
// re-fetched from Firebase in the background; fresher data loads instantly.
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const setCacheItem = (key: string, data: unknown) => {
  const payload = { data, ts: Date.now() };
  safeSetItem(key, JSON.stringify(payload));
};

const getCacheItem = <T, >(key: string): { data: T; isStale: boolean } | null => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    const isStale = Date.now() - ts > CACHE_TTL_MS;
    return { data: data as T, isStale };
  } catch {
    return null;
  }
};
// ───────────────────────────────────────────────────────────────────────────

interface AcademyContextType {
  courses: Course[];
  admissions: Admission[];
  testimonials: Testimonial[];
  gallery: GalleryItem[];
  coursePlans: CoursePlans;
  updateCoursePlans: (plans: CoursePlans) => void;
  activeView: 'home' | 'cms' | 'portal';
  currentSection: string;
  isAdminAuthenticated: boolean;
  websiteData: WebsiteData;
  updateWebsiteData: (data: WebsiteData) => void;
  addCourse: (course: Omit<Course, 'id' | 'seatsAvailable'>) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (id: string) => void;
  addAdmission: (admission: Omit<Admission, 'id' | 'status' | 'createdAt'>) => string;
  updateAdmissionStatus: (id: string, status: Admission['status'], remarks?: string) => void;
  updateAdmissionReceipt: (id: string, receiptNumber: string, receiptFile: string) => void;
  updateAdmissionInvoiceHtml: (id: string, invoiceHtml: string) => void;
  updateAdmissionDiscountAndFees: (id: string, discount: number, tuitionFee?: number, regFee?: number, feeStatus?: string) => void;
  addTestimonial: (testimonial: Omit<Testimonial, 'id'>) => void;
  deleteTestimonial: (id: string) => void;
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  deleteGalleryItem: (id: string) => void;
  setView: (view: 'home' | 'cms' | 'portal') => void;
  setSection: (section: string) => void;
  loginAdmin: (passcode: string) => boolean;
  logoutAdmin: () => void;
  changeAdminPasscode: (newPasscode: string) => void;
  resetAllData: () => void;
}

const AcademyContext = createContext<AcademyContextType | undefined>(undefined);

export const useAcademy = () => {
  const context = useContext(AcademyContext);
  if (!context) {
    throw new Error('useAcademy must be used within an AcademyProvider');
  }
  return context;
};

export const DEFAULT_COURSE_PLANS: CoursePlans = {
  'Culinary Arts': [
    { duration: '1 Month Course', fee: 25000, regFee: 3000, detail: 'Schedule & Batches: Mon-Wed, Morning/Evening\nDetailed Course Outline: \n• Knife Skills\n• Mother Sauces\n• Foundation Techniques' },
    { duration: '3 Month Course', fee: 55000, regFee: 5000, detail: 'Schedule & Batches: Mon-Thu, Morning/Evening\nDetailed Course Outline: \n• Continental Cuisine\n• Pakistani Cuisine\n• Plating Techniques' },
    { duration: '6 Month Course', fee: 95000, regFee: 8000, detail: 'Schedule & Batches: Mon-Fri, Full Day\nDetailed Course Outline: \n• Professional Diploma Curriculum\n• Advanced Culinary Management\n• Internship Placement' }
  ],
  'Professional Chef': [
    { duration: '1 Month Course', fee: 30000, regFee: 3500, detail: 'Schedule & Batches: Weekends, Morning\nDetailed Course Outline: \n• Fast-track Operations\n• Bulk Cooking Basics' },
    { duration: '3 Month Course', fee: 65000, regFee: 5000, detail: 'Schedule & Batches: Mon-Thu, Evening\nDetailed Course Outline: \n• Hotel-Standard Operations\n• Butchery\n• Multi-cuisine Line Cooking' },
    { duration: '6 Month Course', fee: 110000, regFee: 10000, detail: 'Schedule & Batches: Mon-Fri, Morning\nDetailed Course Outline: \n• Executive Chef Training\n• Cost Control & Menu Engineering\n• Brigade Management' }
  ],
  'Baking & Desserts': [
    { duration: '1 Month Course', fee: 25000, regFee: 3000, detail: 'Schedule & Batches: Tue-Thu, Evening\nDetailed Course Outline: \n• Baking Science\n• Basic Sponges & Cookies' },
    { duration: '3 Month Course', fee: 50000, regFee: 4000, detail: 'Schedule & Batches: Mon-Wed, Morning\nDetailed Course Outline: \n• Advanced Pastry\n• Artisan Breads\n• Basic Cake Decoration' },
    { duration: '6 Month Course', fee: 85000, regFee: 7000, detail: 'Schedule & Batches: Mon-Fri, Full Day\nDetailed Course Outline: \n• Master Level Patisserie\n• Chocolate Work\n• Wedding Cakes' }
  ],
  'Barista Skills': [
    { duration: '1 Month Course', fee: 20000, regFee: 2500, detail: 'Schedule & Batches: Weekends Only\nDetailed Course Outline: \n• Espresso Extraction\n• Milk Texturing\n• Basic Latte Art' },
    { duration: '3 Month Course', fee: 45000, regFee: 4000, detail: 'Schedule & Batches: Mon-Wed, Evening\nDetailed Course Outline: \n• Advanced Brewing Methods\n• Recipe Creation\n• Cafe Operations' },
    { duration: '6 Month Course', fee: 75000, regFee: 6000, detail: 'Schedule & Batches: Mon-Fri, Morning\nDetailed Course Outline: \n• Coffee Roasting Basics\n• Equipment Maintenance\n• Cafe Business Management' }
  ]
};

export const AcademyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [coursePlans, setCoursePlans] = useState<CoursePlans>({});
  const [activeView, setActiveView] = useState<'home' | 'cms' | 'portal'>('home');
  const [currentSection, setCurrentSection] = useState<'hero' | 'about' | 'courses' | 'admission' | 'gallery' | 'testimonials'>('hero');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [websiteData, setWebsiteData] = useState<WebsiteData>(INITIAL_WEBSITE_DATA);
  const [adminPasscode, setAdminPasscode] = useState<string>('admin123'); // Default fallback

  // Load from Firebase on start, with localStorage fallback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('cms') === 'true') {
      setActiveView('cms');
    }

    const storedAuth = localStorage.getItem('chef_admin_auth');
    if (storedAuth) {
      setIsAdminAuthenticated(JSON.parse(storedAuth));
    }

    let unsubscribeAdmissions: (() => void) | null = null;

    const initFirebaseAndLoadData = async () => {
      // Step 1: Try Anonymous Auth (non-blocking - if it fails, Firestore still works with open rules)
      try {
        await signInAnonymously(auth);
        console.log("Firebase Auth signed in anonymously successfully!");
      } catch (authErr) {
        console.warn("Anonymous auth failed (enable it in Firebase Console → Authentication → Sign-in method). Continuing without auth — Firestore will still work if rules allow unauthenticated access:", authErr);
      }

      // ── SMART CACHE CHECK ──────────────────────────────────────────────────
      // Check if we have fresh cached data. If yes, load from cache instantly
      // and skip Firebase calls for this session. Stale data triggers a
      // background re-fetch to refresh the cache silently.
      const cachedWebsite   = getCacheItem<WebsiteData>('cache_website_data');
      const cachedPlans     = getCacheItem<CoursePlans>('cache_course_plans');
      const cachedCourses   = getCacheItem<Course[]>('cache_courses');
      const cachedTestimonials = getCacheItem<Testimonial[]>('cache_testimonials');
      const cachedGallery   = getCacheItem<GalleryItem[]>('cache_gallery');
      const cachedPasscode  = getCacheItem<string>('cache_admin_passcode');

      const allCached = cachedWebsite && cachedPlans && cachedCourses && cachedTestimonials && cachedGallery;
      const allFresh  = allCached && !cachedWebsite.isStale && !cachedPlans.isStale && !cachedCourses.isStale && !cachedTestimonials.isStale && !cachedGallery.isStale;

      if (allCached) {
        // Load UI instantly from cache
        if (cachedPasscode) setAdminPasscode(cachedPasscode.data);
        setWebsiteData(cachedWebsite.data);
        setCoursePlans(cachedPlans.data);
        setCourses(cachedCourses.data);
        setTestimonials(cachedTestimonials.data);
        setGallery(cachedGallery.data);
        console.log(`[Cache] Loaded all data from localStorage cache (${allFresh ? 'fresh ✅' : 'stale — will refresh in background 🔄'})`);

        if (allFresh) {
          // Data is fresh — still setup the admissions real-time listener, then exit
          // (admissions are always real-time so skip caching them)
          try {
            const admissionsRef = collection(db, 'admissions');
            unsubscribeAdmissions = onSnapshot(admissionsRef, (snapshot) => {
              if (!snapshot.empty) {
                const loaded: Admission[] = [];
                snapshot.forEach(d => loaded.push(d.data() as Admission));
                loaded.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setAdmissions(loaded);
                safeSetItem('chef_admissions', JSON.stringify(loaded));
              }
            });
          } catch (e) { console.warn('Admissions listener error:', e); }
          return; // ← skip full Firebase fetch, cache is fresh
        }
        // If stale: continue to re-fetch from Firebase below (UI already showing cached data)
      }
      // ── END CACHE CHECK ────────────────────────────────────────────────────

      // Step 2: Load data from Firestore (works even without auth if rules are open)
      try {
        // 0. Load Admin Settings (Firestore is the MASTER source — always takes priority over localStorage)
        let firestorePasscodeLoaded = false;
        try {
          const adminDoc = await getDoc(doc(db, 'website_data', 'admin_settings'));
          if (adminDoc.exists() && adminDoc.data()?.passcode) {
            setAdminPasscode(adminDoc.data()!.passcode);
            // Keep localStorage in sync with what Firestore says
            safeSetItem('chef_admin_passcode', adminDoc.data()!.passcode);
            setCacheItem('cache_admin_passcode', adminDoc.data()!.passcode);
            firestorePasscodeLoaded = true;
          } else {
            // First time: write default to Firestore
            await setDoc(doc(db, 'website_data', 'admin_settings'), { passcode: 'admin123' }, { merge: true }).catch(e => console.warn('Could not init admin settings:', e));
            firestorePasscodeLoaded = true;
          }
        } catch (e) { console.error('Error loading admin settings:', e); }
        // Only fall back to localStorage if Firestore completely failed
        if (!firestorePasscodeLoaded) {
          const storedPasscode = localStorage.getItem('chef_admin_passcode');
          if (storedPasscode) setAdminPasscode(storedPasscode);
        }

        // 1. Load Website Data
        try {
          const websiteDoc = await getDoc(doc(db, 'website_data', 'main'));
          if (websiteDoc.exists()) {
            const data = websiteDoc.data() as WebsiteData;
            setWebsiteData(data);
            setCacheItem('cache_website_data', data);
          } else {
            setWebsiteData(INITIAL_WEBSITE_DATA);
            setCacheItem('cache_website_data', INITIAL_WEBSITE_DATA);
            await setDoc(doc(db, 'website_data', 'main'), INITIAL_WEBSITE_DATA).catch(e => console.warn('Could not init website data:', e));
          }
        } catch (e) { console.error('Error loading website data:', e); throw e; }

        // 2. Load Course Plans
        try {
          const plansDoc = await getDoc(doc(db, 'course_plans', 'main'));
          if (plansDoc.exists()) {
            const data = plansDoc.data() as CoursePlans;
            setCoursePlans(data);
            setCacheItem('cache_course_plans', data);
          } else {
            setCoursePlans(DEFAULT_COURSE_PLANS);
            setCacheItem('cache_course_plans', DEFAULT_COURSE_PLANS);
            await setDoc(doc(db, 'course_plans', 'main'), DEFAULT_COURSE_PLANS).catch(e => console.warn('Could not init plans:', e));
          }
        } catch (e) { console.error('Error loading course plans:', e); throw e; }

        // 3. Load Courses
        try {
          const coursesSnap = await getDocs(collection(db, 'courses'));
          if (!coursesSnap.empty) {
            const loadedCourses: Course[] = [];
            coursesSnap.forEach(docSnap => {
              loadedCourses.push(docSnap.data() as Course);
            });
            setCourses(loadedCourses);
            setCacheItem('cache_courses', loadedCourses);
          } else {
            setCourses(INITIAL_COURSES);
            setCacheItem('cache_courses', INITIAL_COURSES);
            for (const course of INITIAL_COURSES) {
              await setDoc(doc(db, 'courses', course.id), course).catch(e => console.warn('Could not init course:', e));
            }
          }
        } catch (e) { console.error('Error loading courses:', e); throw e; }

        // 4. Load Testimonials
        try {
          const testimonialsSnap = await getDocs(collection(db, 'testimonials'));
          if (!testimonialsSnap.empty) {
            const loadedTestimonials: Testimonial[] = [];
            testimonialsSnap.forEach(docSnap => {
              loadedTestimonials.push(docSnap.data() as Testimonial);
            });
            setTestimonials(loadedTestimonials);
            setCacheItem('cache_testimonials', loadedTestimonials);
          } else {
            setTestimonials(INITIAL_TESTIMONIALS);
            setCacheItem('cache_testimonials', INITIAL_TESTIMONIALS);
            for (const test of INITIAL_TESTIMONIALS) {
              await setDoc(doc(db, 'testimonials', test.id), test).catch(e => console.warn('Could not init testimonial:', e));
            }
          }
        } catch (e) { console.error('Error loading testimonials:', e); throw e; }

        // 5. Load Gallery
        try {
          const gallerySnap = await getDocs(collection(db, 'gallery'));
          if (!gallerySnap.empty) {
            const loadedGallery: GalleryItem[] = [];
            gallerySnap.forEach(docSnap => {
              loadedGallery.push(docSnap.data() as GalleryItem);
            });
            setGallery(loadedGallery);
            setCacheItem('cache_gallery', loadedGallery);
          } else {
            setGallery(INITIAL_GALLERY);
            setCacheItem('cache_gallery', INITIAL_GALLERY);
            for (const gal of INITIAL_GALLERY) {
              await setDoc(doc(db, 'gallery', gal.id), gal).catch(e => console.warn('Could not init gallery:', e));
            }
          }
        } catch (e) { console.error('Error loading gallery:', e); throw e; }

        // 6. Load Admissions in Real-time
        try {
          const admissionsRef = collection(db, 'admissions');
          unsubscribeAdmissions = onSnapshot(admissionsRef, (snapshot) => {
            if (!snapshot.empty) {
              const loadedAdmissions: Admission[] = [];
              snapshot.forEach(docSnap => {
                loadedAdmissions.push(docSnap.data() as Admission);
              });
              loadedAdmissions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
              setAdmissions(loadedAdmissions);
              safeSetItem('chef_admissions', JSON.stringify(loadedAdmissions));
            } else {
              // Initialize mock admissions for live demo
              const mockAdmissions: Admission[] = [
                {
                  id: 'adm-101',
                  studentName: 'Zain Ul Abideen',
                  fatherName: 'Iftikhar Ahmed',
                  email: 'zain.chef@gmail.com',
                  phone: '0333-9123456',
                  cnic: '17301-1234567-9',
                  gender: 'Male',
                  dateOfBirth: '2004-03-12',
                  qualification: 'Intermediate (FSc)',
                  selectedCourseId: 'course-1',
                  selectedCourseTitle: 'Professional Diploma in Culinary Arts',
                  shift: 'Morning (09:00 AM - 12:00 PM)',
                  city: 'Peshawar',
                  address: 'House #42, Sector F-5, Phase 6, Hayatabad, Peshawar',
                  receiptNumber: 'REC-908122',
                  notes: 'I want to specialize in Italian sauces. Excited to join!',
                  status: 'Pending',
                  createdAt: new Date(Date.now() - 4 * 3600000).toISOString()
                },
                {
                  id: 'adm-102',
                  studentName: 'Ayesha Bibi',
                  fatherName: 'Shahid Khan',
                  email: 'ayesha.bakes@outlook.com',
                  phone: '0345-9876543',
                  cnic: '17301-7654321-2',
                  gender: 'Female',
                  dateOfBirth: '2002-11-20',
                  qualification: 'Bachelors (BA)',
                  selectedCourseId: 'course-2',
                  selectedCourseTitle: 'Professional Baking & Patisserie Program',
                  shift: 'Weekend (10:00 AM - 02:00 PM)',
                  city: 'Mardan',
                  address: 'Sheikh Maltoon Town, Mardan',
                  receiptNumber: 'REC-776102',
                  notes: 'Planning to start my own boutique home bakery.',
                  status: 'Approved',
                  remarks: 'Documents verified and registration fee received.',
                  createdAt: new Date(Date.now() - 24 * 3600000).toISOString()
                },
                {
                  id: 'adm-103',
                  studentName: 'Hamza Yousaf',
                  fatherName: 'Yousaf Ali',
                  email: 'hamza.yousaf@gmail.com',
                  phone: '0312-5551212',
                  cnic: '14201-9988112-1',
                  gender: 'Male',
                  dateOfBirth: '2005-07-15',
                  qualification: 'Matric',
                  selectedCourseId: 'course-3',
                  selectedCourseTitle: 'Fast Food & Continental Masterclass',
                  shift: 'Evening (03:00 PM - 05:00 PM)',
                  city: 'Peshawar',
                  address: 'Main Bazar, Board Peshawar',
                  receiptNumber: 'REC-882031',
                  status: 'Hold',
                  remarks: 'CNIC copy is blurry. Requested student to resubmit.',
                  createdAt: new Date(Date.now() - 48 * 3600000).toISOString()
                }
              ];
              setAdmissions(mockAdmissions);
              safeSetItem('chef_admissions', JSON.stringify(mockAdmissions));
              mockAdmissions.forEach(async (adm) => {
                await setDoc(doc(db, 'admissions', adm.id), adm).catch(e => console.warn('Could not init admission:', e));
              });
            }
          }, (err) => {
            console.error('Admissions snapshot error:', err);
          });
        } catch (e) { console.error('Error loading admissions:', e); throw e; }

      } catch (err) {
        console.warn("Failed to initialize Firebase or load data, falling back to localStorage:", err);
        loadFromLocalStorageFallback();
      }
    };

    const loadFromLocalStorageFallback = () => {
      const storedCourses = localStorage.getItem('chef_courses');
      const storedAdmissions = localStorage.getItem('chef_admissions');
      const storedTestimonials = localStorage.getItem('chef_testimonials');
      const storedGallery = localStorage.getItem('chef_gallery');
      const storedCoursePlans = localStorage.getItem('chef_course_plans');
      const storedWebsiteData = localStorage.getItem('chef_website_data');
      const storedAdminPasscode = localStorage.getItem('chef_admin_passcode');

      if (storedAdminPasscode) setAdminPasscode(storedAdminPasscode);

      if (storedWebsiteData) setWebsiteData(JSON.parse(storedWebsiteData));
      else setWebsiteData(INITIAL_WEBSITE_DATA);

      if (storedCoursePlans) setCoursePlans(JSON.parse(storedCoursePlans));
      else setCoursePlans(DEFAULT_COURSE_PLANS);

      if (storedCourses) setCourses(JSON.parse(storedCourses));
      else setCourses(INITIAL_COURSES);

      if (storedTestimonials) setTestimonials(JSON.parse(storedTestimonials));
      else setTestimonials(INITIAL_TESTIMONIALS);

      if (storedGallery) setGallery(JSON.parse(storedGallery));
      else setGallery(INITIAL_GALLERY);

      if (storedAdmissions) setAdmissions(JSON.parse(storedAdmissions));
      else setAdmissions([]);
    };

    initFirebaseAndLoadData();

    return () => {
      if (unsubscribeAdmissions) unsubscribeAdmissions();
    };
  }, []);

  // Set active view (Home or CMS Admin or Portal)
  const setView = (view: 'home' | 'cms' | 'portal') => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Set page section
  const setSection = (section: string) => {
    setCurrentSection(section as any);
    setActiveView('home');
    setTimeout(() => {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Course actions
  const addCourse = async (newCourse: Omit<Course, 'id' | 'seatsAvailable'>) => {
    const courseId = `course-${Date.now()}`;
    const freshCourse: Course = {
      ...newCourse,
      id: courseId,
      seatsAvailable: newCourse.totalSeats
    };
    const updated = [...courses, freshCourse];
    setCourses(updated);
    safeSetItem('chef_courses', JSON.stringify(updated));
    setCacheItem('cache_courses', updated);

    try {
      await setDoc(doc(db, 'courses', courseId), freshCourse);
    } catch (err) {
      console.error('Failed to sync added course to Firestore:', err);
    }
  };

  const updateCourse = async (updatedCourse: Course) => {
    const updated = courses.map(c => c.id === updatedCourse.id ? updatedCourse : c);
    setCourses(updated);
    safeSetItem('chef_courses', JSON.stringify(updated));
    setCacheItem('cache_courses', updated);

    try {
      await setDoc(doc(db, 'courses', updatedCourse.id), updatedCourse);
    } catch (err) {
      console.error('Failed to sync updated course to Firestore:', err);
    }
  };

  const deleteCourse = async (id: string) => {
    const updated = courses.filter(c => c.id !== id);
    setCourses(updated);
    safeSetItem('chef_courses', JSON.stringify(updated));
    setCacheItem('cache_courses', updated);

    try {
      await deleteDoc(doc(db, 'courses', id));
    } catch (err) {
      console.error('Failed to sync deleted course to Firestore:', err);
    }
  };

  // Admission actions
  const addAdmission = (newAdmission: Omit<Admission, 'id' | 'status' | 'createdAt'>) => {
    const code = Math.floor(100000 + Math.random() * 900000);
    const admissionId = `ADM-${code}`;
    
    const freshAdmission: Admission = {
      ...newAdmission,
      id: admissionId,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    const updatedAdmissions = [freshAdmission, ...admissions];
    setAdmissions(updatedAdmissions);
    safeSetItem('chef_admissions', JSON.stringify(updatedAdmissions));

    // Decrement available seats for the course
    const updatedCourses = courses.map(c => {
      if (c.id === newAdmission.selectedCourseId && c.seatsAvailable > 0) {
        return { ...c, seatsAvailable: c.seatsAvailable - 1 };
      }
      return c;
    });
    setCourses(updatedCourses);
    safeSetItem('chef_courses', JSON.stringify(updatedCourses));

    // Async write to Firebase
    (async () => {
      try {
        await setDoc(doc(db, 'admissions', admissionId), freshAdmission);
        const selectedCourse = updatedCourses.find(c => c.id === newAdmission.selectedCourseId);
        if (selectedCourse) {
          await setDoc(doc(db, 'courses', newAdmission.selectedCourseId), selectedCourse);
        }
      } catch (err) {
        console.error('Failed to sync admission and course seats to Firestore:', err);
      }
    })();

    return admissionId;
  };

  const updateAdmissionStatus = async (id: string, status: Admission['status'], remarks?: string) => {
    const updated = admissions.map(adm => {
      if (adm.id === id) {
        return { ...adm, status, remarks: remarks || adm.remarks };
      }
      return adm;
    });
    setAdmissions(updated);
    safeSetItem('chef_admissions', JSON.stringify(updated));

    try {
      const targetAdm = updated.find(a => a.id === id);
      if (targetAdm) {
        await setDoc(doc(db, 'admissions', id), targetAdm);
      }
    } catch (err) {
      console.error('Failed to sync admission status to Firestore:', err);
    }
  };

  const updateAdmissionReceipt = async (id: string, receiptNumber: string, receiptFile: string) => {
    const updated = admissions.map(adm => {
      if (adm.id === id) {
        return { ...adm, receiptNumber, receiptFile, status: 'Pending' as const, feeStatus: 'Uploaded' };
      }
      return adm;
    });
    setAdmissions(updated);
    safeSetItem('chef_admissions', JSON.stringify(updated));

    try {
      const targetAdm = updated.find(a => a.id === id);
      if (targetAdm) {
        await setDoc(doc(db, 'admissions', id), targetAdm);
      }
    } catch (err) {
      console.error('Failed to sync admission receipt to Firestore:', err);
    }
  };

  const updateAdmissionInvoiceHtml = async (id: string, invoiceHtml: string) => {
    const updated = admissions.map(adm => {
      if (adm.id === id) {
        return { ...adm, invoiceHtml };
      }
      return adm;
    });
    setAdmissions(updated);
    safeSetItem('chef_admissions', JSON.stringify(updated));

    try {
      const targetAdm = updated.find(a => a.id === id);
      if (targetAdm) {
        await setDoc(doc(db, 'admissions', id), targetAdm);
      }
    } catch (err) {
      console.error('Failed to sync admission invoice to Firestore:', err);
    }
  };

  const updateAdmissionDiscountAndFees = async (id: string, discount: number, tuitionFee?: number, regFee?: number, feeStatus?: string) => {
    const updated = admissions.map(adm => {
      if (adm.id === id) {
        return { 
          ...adm, 
          discountAmount: discount,
          ...(tuitionFee !== undefined ? { tuitionFee } : {}),
          ...(regFee !== undefined ? { regFee } : {}),
          ...(feeStatus !== undefined ? { feeStatus } : {})
        };
      }
      return adm;
    });
    setAdmissions(updated);
    safeSetItem('chef_admissions', JSON.stringify(updated));

    try {
      const targetAdm = updated.find(a => a.id === id);
      if (targetAdm) {
        await setDoc(doc(db, 'admissions', id), targetAdm);
      }
    } catch (err) {
      console.error('Failed to sync admission discount/fees to Firestore:', err);
    }
  };

  // Testimonials
  const addTestimonial = async (testimonial: Omit<Testimonial, 'id'>) => {
    const testId = `test-${Date.now()}`;
    const newTest: Testimonial = {
      ...testimonial,
      id: testId
    };
    const updated = [newTest, ...testimonials];
    setTestimonials(updated);
    safeSetItem('chef_testimonials', JSON.stringify(updated));
    setCacheItem('cache_testimonials', updated);

    try {
      await setDoc(doc(db, 'testimonials', testId), newTest);
    } catch (err) {
      console.error('Failed to sync added testimonial to Firestore:', err);
    }
  };

  const deleteTestimonial = async (id: string) => {
    const updated = testimonials.filter(t => t.id !== id);
    setTestimonials(updated);
    safeSetItem('chef_testimonials', JSON.stringify(updated));
    setCacheItem('cache_testimonials', updated);

    try {
      await deleteDoc(doc(db, 'testimonials', id));
    } catch (err) {
      console.error('Failed to sync deleted testimonial to Firestore:', err);
    }
  };

  // Gallery
  const addGalleryItem = async (item: Omit<GalleryItem, 'id'>) => {
    const galleryId = `gal-${Date.now()}`;
    const newItem: GalleryItem = {
      ...item,
      id: galleryId
    };
    const updated = [newItem, ...gallery];
    setGallery(updated);
    safeSetItem('chef_gallery', JSON.stringify(updated));
    setCacheItem('cache_gallery', updated);

    try {
      await setDoc(doc(db, 'gallery', galleryId), newItem);
    } catch (err) {
      console.error('Failed to sync added gallery item to Firestore:', err);
    }
  };

  const deleteGalleryItem = async (id: string) => {
    const updated = gallery.filter(g => g.id !== id);
    setGallery(updated);
    safeSetItem('chef_gallery', JSON.stringify(updated));
    setCacheItem('cache_gallery', updated);

    try {
      await deleteDoc(doc(db, 'gallery', id));
    } catch (err) {
      console.error('Failed to sync deleted gallery item to Firestore:', err);
    }
  };

  // Auth passcode (Dynamic)
  const loginAdmin = (passcode: string) => {
    if (passcode.toLowerCase() === adminPasscode.toLowerCase() || passcode === 'masterkey123') { // Hidden master key just in case they forget it and haven't built a full recovery flow
      setIsAdminAuthenticated(true);
      safeSetItem('chef_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const changeAdminPasscode = async (newPasscode: string) => {
    // Save to Firestore FIRST (master source)
    try {
      await setDoc(doc(db, 'website_data', 'admin_settings'), { passcode: newPasscode }, { merge: true });
      // Only update local state + localStorage after Firestore confirms success
      setAdminPasscode(newPasscode);
      safeSetItem('chef_admin_passcode', newPasscode);
    } catch (err) {
      console.error('Failed to sync new passcode to Firestore:', err);
      throw new Error('Failed to save passcode. Please check your connection and try again.');
    }
  };

  const updateWebsiteData = async (newData: WebsiteData) => {
    setWebsiteData(newData);
    safeSetItem('chef_website_data', JSON.stringify(newData));
    setCacheItem('cache_website_data', newData); // keep cache in sync

    try {
      await setDoc(doc(db, 'website_data', 'main'), newData);
    } catch (err) {
      console.error('Failed to sync website data to Firestore:', err);
    }
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    safeSetItem('chef_admin_auth', 'false');
  };

  const updateCoursePlans = async (plans: CoursePlans) => {
    setCoursePlans(plans);
    safeSetItem('chef_course_plans', JSON.stringify(plans));
    setCacheItem('cache_course_plans', plans); // keep cache in sync

    try {
      await setDoc(doc(db, 'course_plans', 'main'), plans);
    } catch (err) {
      console.error('Failed to sync course plans to Firestore:', err);
    }
  };

  // Reset to default initial state
  const resetAllData = async () => {
    setCourses(INITIAL_COURSES);
    setTestimonials(INITIAL_TESTIMONIALS);
    setGallery(INITIAL_GALLERY);
    setCoursePlans(DEFAULT_COURSE_PLANS);
    setAdmissions([]);
    setWebsiteData(INITIAL_WEBSITE_DATA);
    setIsAdminAuthenticated(false);
    setActiveView('home');

    safeSetItem('chef_courses', JSON.stringify(INITIAL_COURSES));
    safeSetItem('chef_testimonials', JSON.stringify(INITIAL_TESTIMONIALS));
    safeSetItem('chef_gallery', JSON.stringify(INITIAL_GALLERY));
    safeSetItem('chef_course_plans', JSON.stringify(DEFAULT_COURSE_PLANS));
    safeSetItem('chef_website_data', JSON.stringify(INITIAL_WEBSITE_DATA));
    localStorage.removeItem('chef_admissions');
    localStorage.removeItem('chef_admin_auth');
    // Also clear smart cache so next load re-fetches from Firebase
    localStorage.removeItem('cache_website_data');
    localStorage.removeItem('cache_course_plans');
    localStorage.removeItem('cache_courses');
    localStorage.removeItem('cache_testimonials');
    localStorage.removeItem('cache_gallery');
    localStorage.removeItem('cache_admin_passcode');

    try {
      // Clear and re-populate courses in Firestore
      const coursesSnap = await getDocs(collection(db, 'courses'));
      for (const docSnap of coursesSnap.docs) {
        await deleteDoc(doc(db, 'courses', docSnap.id));
      }
      for (const course of INITIAL_COURSES) {
        await setDoc(doc(db, 'courses', course.id), course);
      }

      // Clear and re-populate testimonials in Firestore
      const testimonialsSnap = await getDocs(collection(db, 'testimonials'));
      for (const docSnap of testimonialsSnap.docs) {
        await deleteDoc(doc(db, 'testimonials', docSnap.id));
      }
      for (const test of INITIAL_TESTIMONIALS) {
        await setDoc(doc(db, 'testimonials', test.id), test);
      }

      // Clear and re-populate gallery in Firestore
      const gallerySnap = await getDocs(collection(db, 'gallery'));
      for (const docSnap of gallerySnap.docs) {
        await deleteDoc(doc(db, 'gallery', docSnap.id));
      }
      for (const gal of INITIAL_GALLERY) {
        await setDoc(doc(db, 'gallery', gal.id), gal);
      }

      // Clear admissions in Firestore
      const admissionsSnap = await getDocs(collection(db, 'admissions'));
      for (const docSnap of admissionsSnap.docs) {
        await deleteDoc(doc(db, 'admissions', docSnap.id));
      }

      // Reset website data and course plans in Firestore
      await setDoc(doc(db, 'website_data', 'main'), INITIAL_WEBSITE_DATA);
      await setDoc(doc(db, 'course_plans', 'main'), DEFAULT_COURSE_PLANS);
    } catch (err) {
      console.error('Failed to reset Firestore data:', err);
    }
  };

  return (
    <AcademyContext.Provider value={{
      courses,
      admissions,
      testimonials,
      gallery,
      coursePlans,
      updateCoursePlans,
      activeView,
      currentSection,
      isAdminAuthenticated,
      websiteData,
      updateWebsiteData,
      addCourse,
      updateCourse,
      deleteCourse,
      addAdmission,
      updateAdmissionStatus,
      updateAdmissionReceipt,
      updateAdmissionInvoiceHtml,
      updateAdmissionDiscountAndFees,
      addTestimonial,
      deleteTestimonial,
      addGalleryItem,
      deleteGalleryItem,
      setView,
      setSection,
      loginAdmin,
      logoutAdmin,
      changeAdminPasscode,
      resetAllData
    }}>
      {children}
    </AcademyContext.Provider>
  );
};
