const fs = require('fs');
const content = fs.readFileSync('src/context/AcademyContext.tsx', 'utf8');

const startMarker = '// Step 2: Load data from Firestore (works even without auth if rules are open)';
const endMarker = '// 6. Load Admissions in Real-time';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.log('Markers not found.');
    process.exit(1);
}

const replacement = `// Step 2: Load data from Firestore (Parallelized for Speed)
      try {
        const fetchTasks = [
          getDoc(doc(db, 'website_data', 'admin_settings')).then(adminDoc => {
            if (adminDoc.exists() && adminDoc.data()?.passcode) {
              setAdminPasscode(adminDoc.data().passcode);
              safeSetItem('chef_admin_passcode', adminDoc.data().passcode);
              setCacheItem('cache_admin_passcode', adminDoc.data().passcode);
            } else {
              setDoc(doc(db, 'website_data', 'admin_settings'), { passcode: 'admin123' }, { merge: true }).catch(()=>{});
            }
          }).catch(() => {
            const storedPasscode = localStorage.getItem('chef_admin_passcode');
            if (storedPasscode) setAdminPasscode(storedPasscode);
          }),
          getDoc(doc(db, 'website_data', 'main')).then(websiteDoc => {
            if (websiteDoc.exists()) {
              const data = websiteDoc.data() as WebsiteData;
              setWebsiteData(data);
              setCacheItem('cache_website_data', data);
            } else {
              setWebsiteData(INITIAL_WEBSITE_DATA);
              setCacheItem('cache_website_data', INITIAL_WEBSITE_DATA);
              setDoc(doc(db, 'website_data', 'main'), INITIAL_WEBSITE_DATA).catch(()=>{});
            }
          }),
          getDoc(doc(db, 'course_plans', 'main')).then(plansDoc => {
            if (plansDoc.exists()) {
              const data = plansDoc.data() as CoursePlans;
              setCoursePlans(data);
              setCacheItem('cache_course_plans', data);
            } else {
              setCoursePlans(DEFAULT_COURSE_PLANS);
              setCacheItem('cache_course_plans', DEFAULT_COURSE_PLANS);
              setDoc(doc(db, 'course_plans', 'main'), DEFAULT_COURSE_PLANS).catch(()=>{});
            }
          }),
          getDocs(collection(db, 'courses')).then(coursesSnap => {
            if (!coursesSnap.empty) {
              const loadedCourses: Course[] = [];
              coursesSnap.docs.forEach(docSnap => loadedCourses.push(docSnap.data() as Course));
              setCourses(loadedCourses);
              setCacheItem('cache_courses', loadedCourses);
            } else {
              setCourses(INITIAL_COURSES);
              setCacheItem('cache_courses', INITIAL_COURSES);
              INITIAL_COURSES.forEach(c => setDoc(doc(db, 'courses', c.id), c).catch(()=>{}));
            }
          }),
          getDocs(collection(db, 'testimonials')).then(testimonialsSnap => {
            if (!testimonialsSnap.empty) {
              const loadedTestimonials: Testimonial[] = [];
              testimonialsSnap.docs.forEach(docSnap => loadedTestimonials.push(docSnap.data() as Testimonial));
              setTestimonials(loadedTestimonials);
              setCacheItem('cache_testimonials', loadedTestimonials);
            } else {
              setTestimonials(INITIAL_TESTIMONIALS);
              setCacheItem('cache_testimonials', INITIAL_TESTIMONIALS);
              INITIAL_TESTIMONIALS.forEach(t => setDoc(doc(db, 'testimonials', t.id), t).catch(()=>{}));
            }
          }),
          getDocs(collection(db, 'gallery')).then(gallerySnap => {
            if (!gallerySnap.empty) {
              const loadedGallery: GalleryItem[] = [];
              gallerySnap.docs.forEach(docSnap => loadedGallery.push(docSnap.data() as GalleryItem));
              setGallery(loadedGallery);
              setCacheItem('cache_gallery', loadedGallery);
            } else {
              setGallery(INITIAL_GALLERY);
              setCacheItem('cache_gallery', INITIAL_GALLERY);
              INITIAL_GALLERY.forEach(g => setDoc(doc(db, 'gallery', g.id), g).catch(()=>{}));
            }
          })
        ];

        await Promise.allSettled(fetchTasks);

      } catch (err) {
        console.warn('Failed to load some Firestore core data:', err);
      }

      `;

const newContent = content.substring(0, startIndex) + replacement + content.substring(endIndex);
fs.writeFileSync('src/context/AcademyContext.tsx', newContent);
console.log('Successfully parallelized Firestore fetching!');
