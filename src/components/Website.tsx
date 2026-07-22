import React, { useState, useEffect } from 'react';
import { useAcademy, DEFAULT_COURSE_PLANS } from '../context/AcademyContext';
import { 
  MessageCircle, Phone, Menu, X, Play, BookOpen, Users, 
  HelpCircle, Star, ArrowRight, Download, Check, Award, MapPin, Mail
} from 'lucide-react';

export default function Website() {
  const { websiteData, setView, courses, coursePlans } = useAcademy();
  const [selectedCourseSlug, setSelectedCourseSlug] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerSolid, setHeaderSolid] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeOutlineModule, setActiveOutlineModule] = useState<number | null>(null);
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);

  // Scroll listener for solid header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setHeaderSolid(true);
      } else {
        setHeaderSolid(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync scroll position to top when switching views
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [selectedCourseSlug]);

  const handleNavClick = (sectionId: string) => {
    setSelectedCourseSlug(null);
    setMobileMenuOpen(false);
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // 4 custom course data matching original HTML precisely
  const COURSE_DETAILS: Record<string, any> = {
    'culinary-arts': {
      id: 'culinary-arts',
      name: 'Culinary Arts',
      tagline: 'The complete foundation — from knife skills to full-service cooking.',
      heroVideo: 'Culinary-Arts.mp4',
      heroShot: 'culinary-art.png',
      overview: "Our flagship six-month course for students who want a complete professional foundation. Progress from knife skills, stocks, and mother sauces to full menu production across Pakistani, Continental, and Asian cuisines — finishing with plating, costing, and a timed service simulation assessed by industry chefs.",
      apply: [
        "School/college leavers planning a culinary career",
        "Home cooks ready to go professional",
        "Future restaurant or cloud-kitchen owners",
        "Anyone who wants the full foundation, not a shortcut"
      ],
      learn: [
        "Professional knife skills, cuts & kitchen safety",
        "Stocks, sauces, soups & flavor building",
        "Pakistani, Continental, Chinese & Asian cuisines",
        "Meat, poultry & seafood fabrication",
        "Plating, presentation & food styling",
        "Menu planning, costing & portion control",
        "Kitchen hygiene & HACCP basics",
        "Working under real service pressure"
      ],
      outline: [
        { t: "Module 1 — Kitchen Foundations (Weeks 1–4)", d: ["Knife skills, classic cuts & station setup", "Kitchen safety, hygiene & HACCP basics", "Stocks, mother sauces & soups"] },
        { t: "Module 2 — Core Cooking Methods (Weeks 5–9)", d: ["Dry & moist heat methods", "Eggs, grains, vegetables & legumes", "Flavor building & seasoning"] },
        { t: "Module 3 — Proteins (Weeks 10–14)", d: ["Poultry & meat fabrication and cookery", "Seafood handling & cookery", "Marination & Pakistani BBQ classics"] },
        { t: "Module 4 — World Cuisines (Weeks 15–19)", d: ["Pakistani classics at production standard", "Continental à la carte essentials", "Chinese & pan-Asian techniques"] },
        { t: "Module 5 — The Professional Plate (Weeks 20–23)", d: ["Plating & presentation systems", "Menu planning, costing & portioning", "Buffet & banquet basics"] },
        { t: "Module 6 — Service Simulation & Assessment (Weeks 24–26)", d: ["Timed full-service kitchen simulation", "Practical final assessment by industry chefs", "Portfolio, certification & career session"] }
      ],
      careers: ["Commis Chef", "Chef de Partie (track)", "Hotel kitchen roles", "Restaurant line cook", "Catering professional", "Cloud kitchen operator", "Food entrepreneur"],
      faqs: [
        { q: "Do I need experience before joining?", a: "No — the program starts from absolute fundamentals and builds to professional standard." },
        { q: "How many practical hours are included?", a: "The majority of contact hours are practical, in the kitchen." },
        { q: "Will I get help finding a job after?", a: "Yes — graduates receive placement support through our partner network including Ramada Hotel and Royal Swiss Hotel." }
      ]
    },
    'professional-chef': {
      id: 'professional-chef',
      name: 'Professional Chef',
      tagline: 'An intensive fast-track for serious kitchen careers.',
      heroVideo: 'Pro-chefs.mp4',
      heroShot: 'professional-chef.jpg',
      overview: "The most career-critical kitchen skills, compressed into three intensive months. Learn from industry giants, practice in premium kitchen labs, and fast-track your path into high-volume hotels and fine dining establishments.",
      apply: [
        "Career switchers entering hospitality",
        "Hotel/restaurant staff upskilling for promotion",
        "Cooks formalizing their skills with certification",
        "Learners who want intensity over duration"
      ],
      learn: [
        "Speed & precision knife work",
        "High-volume production cooking",
        "Hot-kitchen stations: grill, sauté, fry, pantry",
        "Continental & Pakistani à la carte essentials",
        "Stock, sauce & seasoning under time pressure",
        "Hotel-standard plating",
        "Kitchen brigade roles & communication",
        "Professional station hygiene"
      ],
      outline: [
        { t: "Module 1 — Foundations at Speed (Weeks 1–3)", d: ["Knife drills & station discipline", "Stocks, sauces & core methods", "Hygiene at professional standard"] },
        { t: "Module 2 — Station Mastery (Weeks 4–7)", d: ["Grill, sauté, fry & pantry rotations", "High-volume production targets", "À la carte timing & coordination"] },
        { t: "Module 3 — Menus & Plating (Weeks 8–10)", d: ["Continental & Pakistani menu production", "Plating standards for hotel service", "Costing & portioning essentials"] },
        { t: "Module 4 — Service & Assessment (Weeks 11–12)", d: ["Brigade service simulation", "Final practical assessment", "Certification & career session"] }
      ],
      careers: ["Commis Chef", "Line cook", "Hotel kitchen staff", "Restaurant kitchen staff", "Catering professional"],
      faqs: [
        { q: "Is 3 months really enough?", a: "It's an intensive format designed to fast-track career entry by focusing on essential high-pressure commercial operations." },
        { q: "Can I take evening classes while working?", a: "Yes — the 5–9 PM batch is designed exactly for working professionals." },
        { q: "What's the difference vs Culinary Arts?", a: "Culinary Arts is a comprehensive 6-month foundation, whereas this is a compressed, fast-track 3-month program." }
      ]
    },
    'baking-desserts': {
      id: 'baking-desserts',
      name: 'Baking & Desserts',
      tagline: 'Master pâtisserie, breads, and dessert artistry.',
      heroVideo: 'Baking & Desserts.mp4',
      heroShot: 'baking-dessert.jpg',
      overview: "Baking is chemistry, craft, and patience. This program covers the complete science of baking, from artisan sour-doughs to fine French classical pâtisserie and custom wedding cake decorations.",
      apply: [
        "Aspiring pastry chefs & bakers",
        "Home bakers ready to go commercial",
        "Future bakery & café owners",
        "Hotel staff moving into pastry sections"
      ],
      learn: [
        "Bakery science & ingredient dynamics",
        "Artisan breads & yeast doughs",
        "Laminated pastry (croissants, puff pastry)",
        "Premium cakes, royal icing & custom fondant art",
        "French classical desserts & entremets",
        "Chocolate work & temperature tempering",
        "Production costing & shelf-life calculation"
      ],
      outline: [
        { t: "Module 1 — Baking Fundamentals", d: ["Ingredient functions, ratios & weights", "Equipment calibration and safety", "Basic doughs and cookies"] },
        { t: "Module 2 — Yeast & Artisan Breads", d: ["Artisan sourdough fermentation", "Traditional breads, buns & pizza bases", "High-volume bakery line setup"] },
        { t: "Module 3 — Laminated Doughs", d: ["Croissants, danishes & puff pastry techniques", "Temperature-controlled layering", "Classic high-end breakfast items"] },
        { t: "Module 4 — Cake Art & Patisserie", d: ["Sponge baking, layered cakes & frosting", "Custom fondant sculpted decorations", "French macarons, tarts & eclairs"] }
      ],
      careers: ["Pastry chef", "Bakery owner", "Hotel pastry section specialist", "Home boutique baker", "Custom cake designer"],
      faqs: [
        { q: "Do we learn custom cake decoration?", a: "Yes, cake sculpting, custom fondant design, and piping are covered in detail." },
        { q: "Do I need to buy expensive equipment?", a: "No, all ingredients, machinery, and toolkits are provided in the academy laboratories." }
      ]
    },
    'barista-skills': {
      id: 'barista-skills',
      name: 'Barista Skills',
      tagline: 'From bean to bar — espresso craft and café operations.',
      heroVideo: 'barista.mp4',
      heroShot: 'barista-skill.webp',
      overview: "Pakistan's café industry is growing rapidly. Learn perfect espresso extraction, milk micro-foaming science, beautiful latte art pouring, and actual cafe equipment maintenance.",
      apply: [
        "Barista beginners planning to work locally or abroad",
        "Coffee shop supervisors and supervisors",
        "Future café owners & coffee entrepreneurs",
        "Coffee connoisseurs and passionate home brewers"
      ],
      learn: [
        "Espresso calibration & extraction variables",
        "Latte art: hearts, rosettas, tulips",
        "Milk chemistry: micro-foaming & temperature control",
        "Manual brewing: V60, Chemex, Aeropress",
        "Machine maintenance & bar workflow"
      ],
      outline: [
        { t: "Module 1 — Coffee Science & Grinding", d: ["Coffee origins, roasting and bean selection", "Burr grinder calibration and dosing", "Water chemistry and extraction theory"] },
        { t: "Module 2 — Espresso & Micro-foaming", d: ["Perfect espresso extraction standards", "Steaming milk to silky micro-foam", "Consistent pour speeds & heights"] },
        { t: "Module 3 — Latte Art Mastery", d: ["Pouring beautiful hearts, rosettas, and tulips", "Etching and decorative syrup designs", "Speed and consistency drills"] },
        { t: "Module 4 — Bar Workflow & Operations", d: ["Managing rush hour bar flow", "Café machine cleaning and backflushing", "Cost calculation and beverage pricing"] }
      ],
      careers: ["Professional Barista", "Café manager", "Coffee shop trainer", "Coffee roaster technician", "Café consultant"],
      faqs: [
        { q: "Do we work on commercial espresso machines?", a: "Yes, you train on dual-boiler professional café-grade espresso machines." },
        { q: "Do you teach latte art?", a: "Yes, intensive hands-on drills focus specifically on micro-foaming and creative pouring." }
      ]
    }
  };

  // Merge database courses with COURSE_DETAILS so they are fully dynamic and customizable!
  const getMergedCourses = () => {
    return courses.map(dbCourse => {
      let defaultSlug = '';
      if (dbCourse.id === 'course-culinary-arts' || dbCourse.title.toLowerCase().includes('culinary')) {
        defaultSlug = 'culinary-arts';
      } else if (dbCourse.id === 'course-professional-chef' || dbCourse.title.toLowerCase().includes('professional') || dbCourse.title.toLowerCase().includes('chef')) {
        defaultSlug = 'professional-chef';
      } else if (dbCourse.id === 'course-baking-desserts' || dbCourse.title.toLowerCase().includes('baking') || dbCourse.title.toLowerCase().includes('patisserie')) {
        defaultSlug = 'baking-desserts';
      } else if (dbCourse.id === 'course-barista-skills' || dbCourse.title.toLowerCase().includes('barista')) {
        defaultSlug = 'barista-skills';
      }

      const defaultDetails = defaultSlug ? COURSE_DETAILS[defaultSlug] : null;

      const dynamicOutline = dbCourse.syllabus && dbCourse.syllabus.length > 0 
        ? [
            { t: "Practical Modules & Curriculum", d: dbCourse.syllabus }
          ]
        : (defaultDetails?.outline || []);

      return {
        slug: defaultSlug || dbCourse.id,
        id: dbCourse.id,
        name: dbCourse.title,
        title: dbCourse.title,
        overview: dbCourse.overview || defaultDetails?.overview || dbCourse.description,
        description: dbCourse.description,
        tagline: dbCourse.description,
        heroShot: dbCourse.image,
        image: dbCourse.image,
        fees: dbCourse.fees,
        registrationFee: dbCourse.registrationFee,
        shifts: dbCourse.shifts,
        instructor: dbCourse.instructor,
        heroVideo: dbCourse.heroVideo || defaultDetails?.heroVideo || 'Culinary-Arts.mp4',
        apply: dbCourse.apply && dbCourse.apply.length > 0 ? dbCourse.apply : (defaultDetails?.apply || [
          "Students planning a professional culinary career",
          "Home cooks ready to go professional",
          "Future restaurant or food entrepreneurs",
          "Anyone who wants high-quality training"
        ]),
        learn: dbCourse.syllabus || defaultDetails?.learn || [],
        outline: dbCourse.outline && dbCourse.outline.length > 0 ? dbCourse.outline : dynamicOutline,
        careers: dbCourse.careers && dbCourse.careers.length > 0 ? dbCourse.careers : (defaultDetails?.careers || ["Professional Chef", "Pastry Artist", "Restaurant Entrepreneur"]),
        faqs: dbCourse.faqs && dbCourse.faqs.length > 0 ? dbCourse.faqs : (defaultDetails?.faqs || [
          { q: "Are ingredients included?", a: "Yes, all premium ingredients and tools are provided in our kitchen labs." },
          { q: "What is the certificate status?", a: "Graduates receive a professional certificate recognized by our industry partners." }
        ])
      };
    });
  };

  const mergedCourses = getMergedCourses();

  const handleDownloadOutline = (slug: string) => {
    const c = mergedCourses.find(m => m.slug === slug || m.id === slug) || mergedCourses[0];
    if (!c) return;
    const lines = [`${c.name} — Course Outline`, "The Chef's Academy, Peshawar", ""];
    c.outline.forEach((m: any) => { 
      lines.push(m.t); 
      m.d.forEach((d: any) => lines.push("  - " + d)); 
      lines.push(""); 
    });
    const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
    let stream = "BT /F1 11 Tf 50 780 Td 14 TL\n";
    lines.slice(0, 52).forEach(l => stream += `(${esc(l)}) Tj T*\n`);
    stream += "ET";
    const objs = [
      "<< /Type /Catalog /Pages 2 0 R >>",
      "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
      "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
      `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`
    ];
    let pdf = "%PDF-1.4\n", offsets: number[] = [];
    objs.forEach((o, i) => { 
      offsets.push(pdf.length); 
      pdf += `${i + 1} 0 obj\n${o}\nendobj\n`; 
    });
    const xref = pdf.length;
    pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` +
      offsets.map(o => String(o).padStart(10, "0") + " 00000 n \n").join("") +
      `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
    
    const blob = new Blob([pdf], { type: "application/pdf" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${c.name.toLowerCase().replace(/\s+/g, '-')}-course-outline.pdf`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const currentCourse = selectedCourseSlug ? mergedCourses.find(c => c.slug === selectedCourseSlug || c.id === selectedCourseSlug) : null;

  return (
    <div className="tca-website bg-[#FBF9F1] text-[#13283F] font-sans antialiased selection:bg-[#AE8C45] selection:text-white pb-12">
      
      {/* SCOPED CSS STYLES TO MATCH HTML SPECIFICATION EXACTLY */}
      <style>{`
        .tca-website {
          --navy: #13283F;
          --navy-deep: #0C1B2C;
          --navy-soft: #1D3450;
          --gold: #AE8C45;
          --gold-deep: #8F7236;
          --gold-soft: #C5A964;
          --cream: #F7F2DE;
          --bone: #FBF9F1;
          --white: #FFFFFF;
          --smoke: #5F6772;
          --line: #E7E1CF;
          --wa: #25D366;
          --radius: 14px;
          --shadow: 0 10px 30px rgba(19,40,63,.10);
          --font-display: "Cormorant Garamond", Georgia, serif;
          --font-body: "Inter", -apple-system, "Segoe UI", sans-serif;
          
          font-family: var(--font-body);
        }

        .tca-website h1, 
        .tca-website h2, 
        .tca-website h3, 
        .tca-website .display-font {
          font-family: var(--font-display);
          font-weight: 500;
          line-height: 1.12;
          letter-spacing: .01em;
        }

        .tca-website .eyebrow {
          font-size: .75rem;
          font-weight: 600;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: var(--gold-deep);
          margin-bottom: 14px;
        }

        .tca-website .lead-text {
          font-size: 1.1rem;
          color: var(--smoke);
          max-width: 640px;
        }

        .tca-website .divider-gold {
          width: 56px;
          height: 3px;
          background: var(--gold);
          border-radius: 2px;
          margin: 18px 0 0;
        }

        .tca-website .btn-primary-web {
          background: var(--gold);
          color: var(--navy-deep);
          font-weight: 600;
          padding: 14px 26px;
          border-radius: 10px;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 9px;
        }

        .tca-website .btn-primary-web:hover {
          background: var(--gold-soft);
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(174,140,69,.35);
        }

        .tca-website .btn-outline-web {
          border: 1.5px solid var(--gold);
          color: var(--gold-deep);
          font-weight: 600;
          padding: 14px 26px;
          border-radius: 10px;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 9px;
        }

        .tca-website .btn-outline-web:hover {
          background: var(--gold);
          color: var(--navy-deep);
        }

        .tca-website .btn-wa-web {
          background: var(--wa);
          color: #fff;
          font-weight: 600;
          padding: 14px 26px;
          border-radius: 10px;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 9px;
        }

        .tca-website .btn-wa-web:hover {
          filter: brightness(1.05);
          transform: translateY(-1px);
        }

        /* Horizontal scrolling container */
        .tca-website .hscroll {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          padding: 6px 24px 22px;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
        }

        .tca-website .hscroll::-webkit-scrollbar {
          height: 6px;
        }

        .tca-website .hscroll::-webkit-scrollbar-thumb {
          background: var(--gold);
          border-radius: 3px;
        }

        .tca-website .hcard {
          flex: 0 0 300px;
          scroll-snap-align: start;
        }

        .tca-website .hcard img {
          height: 210px;
          width: 100%;
          object-fit: cover;
          border-radius: 12px;
          margin-bottom: 12px;
        }

        /* Video cards */
        .tca-website .video-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
        }

        @media (max-width: 991px) {
          .tca-website .video-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 767px) {
          .tca-website .video-grid {
            grid-template-columns: 1fr;
          }
        }

        .tca-website .video-card {
          border-radius: 18px;
          overflow: hidden;
          background: #000;
          box-shadow: 0 12px 30px rgba(0,0,0,.18);
          transition: .3s;
        }

        .tca-website .video-card:hover {
          transform: translateY(-5px);
        }

        .tca-website .video-card video {
          width: 100%;
          height: 280px;
          object-fit: cover;
          display: block;
        }

        /* Accordion transition styles */
        .tca-website .acc-content {
          transition: max-height 0.3s ease-out, padding 0.3s ease-out;
        }

        /* Dynamic video overlay and setups */
        .tca-website .hero-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,.45);
          z-index: 1;
        }

        .tca-website .brand-logo-img {
          width: 38px;
          height: 38px;
          object-fit: contain;
          background: transparent !important;
          background-color: transparent !important;
          mix-blend-mode: screen;
        }

      `}</style>

      {/* ================= HEADER / NAVBAR ================= */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        (headerSolid || !!selectedCourseSlug) ? 'bg-[#13283F] shadow-lg shadow-black/25 py-1.5' : 'bg-transparent py-2'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Name */}
          <div 
            onClick={() => setSelectedCourseSlug(null)} 
            className="flex items-center gap-2 cursor-pointer"
          >
            <img src={websiteData.logo || "/logo.png"} alt="The Chef's Academy Logo" className="brand-logo-img h-8 w-auto object-contain" />
            <div className="font-display leading-[0.9] text-white">
              <div className="flex items-end gap-1">
                <span className="text-[10px] text-[#F7F2DE] font-light">The</span>
                <span className="text-lg text-[#F7F2DE] font-medium leading-none">Chef's</span>
              </div>
              <div className="text-base text-[#F7F2DE] font-medium tracking-wide -mt-0.5 leading-none">Academy</div>
            </div>
          </div>

          {/* Desktop Navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-[#F7F2DE] text-sm font-medium">
            <button onClick={() => handleNavClick('home-about')} className="hover:text-[#C5A964] transition-colors">About</button>
            <button onClick={() => handleNavClick('home-courses')} className="hover:text-[#C5A964] transition-colors">Courses</button>
            <button onClick={() => handleNavClick('home-student-life')} className="hover:text-[#C5A964] transition-colors">Student Life</button>
            <button onClick={() => handleNavClick('home-faqs')} className="hover:text-[#C5A964] transition-colors">FAQs</button>
            <button onClick={() => handleNavClick('home-contact')} className="hover:text-[#C5A964] transition-colors">Contact</button>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            <a 
              href={`https://wa.me/${websiteData.footer.whatsapp.replace(/\D/g, '')}?text=Hi!%20I'd%20like%20information%20about%20courses%20at%20The%20Chef's%20Academy.`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex border border-[#AE8C45] text-[#C5A964] hover:bg-[#AE8C45] hover:text-white transition-all text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg"
            >
              WhatsApp
            </a>

            <button 
              onClick={() => setView('portal')}
              className="bg-[#AE8C45] text-[#0C1B2C] hover:bg-[#C5A964] transition-all text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg"
            >
              Apply Now
            </button>

            <button 
              onClick={() => setView('cms')}
              className="bg-slate-900/80 hover:bg-slate-800 border border-slate-700/50 text-[#C5A964] text-xs font-bold uppercase tracking-wider px-3.5 py-2.5 rounded-lg"
              title="Admin Portal Login"
            >
              Login
            </button>

            {/* Hamburger for mobile */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-[#F7F2DE] p-2 hover:bg-white/5 rounded-lg"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#13283F] flex flex-col justify-center gap-6 px-10 pt-24 text-center">
          <button onClick={() => handleNavClick('home-about')} className="text-2xl font-serif text-[#F7F2DE] hover:text-[#C5A964] py-2 border-b border-white/5">About</button>
          <button onClick={() => handleNavClick('home-courses')} className="text-2xl font-serif text-[#F7F2DE] hover:text-[#C5A964] py-2 border-b border-white/5">Courses</button>
          <button onClick={() => handleNavClick('home-student-life')} className="text-2xl font-serif text-[#F7F2DE] hover:text-[#C5A964] py-2 border-b border-white/5">Student Life</button>
          <button onClick={() => handleNavClick('home-faqs')} className="text-2xl font-serif text-[#F7F2DE] hover:text-[#C5A964] py-2 border-b border-white/5">FAQs</button>
          <button onClick={() => handleNavClick('home-contact')} className="text-2xl font-serif text-[#F7F2DE] hover:text-[#C5A964] py-2 border-b border-white/5">Contact</button>
          <button 
            onClick={() => { setMobileMenuOpen(false); setView('portal'); }}
            className="btn-primary-web justify-center mt-4 w-full"
          >
            Apply Online (Admissions)
          </button>
        </div>
      )}

      {/* ================= RENDERING CONDITIONAL CONTENT (HOME vs DETAIL) ================= */}
      {!selectedCourseSlug ? (
        /* HOMEPAGE VIEW */
        <main>
          
          {/* SECTION 1: HERO SECTION */}
          <section className="relative min-h-screen flex items-center justify-start overflow-hidden pt-20">
            <video 
              key={websiteData.hero.video}
              className="absolute inset-0 w-full h-full object-cover z-0"
              src={websiteData.hero.video}
              autoPlay 
              muted 
              loop 
              playsInline
            />
            
            <div className="hero-overlay"></div>

            <div className="relative z-10 max-w-7xl px-6 sm:px-12 md:px-16 lg:px-24 py-24 text-white flex flex-col items-start justify-start gap-6 text-left">
              <p className="eyebrow !text-[#C5A964] text-left">
                {websiteData.hero.eyebrow}
              </p>
              
              <h1 className="text-white text-4xl sm:text-6xl font-serif leading-none text-left flex flex-col gap-2">
                <span>Train like a professional.</span>
                <em className="italic text-[#C5A964] font-light">Cook like one.</em>
              </h1>

              <div className="flex flex-wrap gap-4 mt-2 justify-start items-center">
                <button 
                  onClick={() => handleNavClick('home-courses')}
                  className="btn-primary-web"
                >
                  {websiteData.hero.btnPrimaryText}
                </button>
                <a 
                  href={`https://wa.me/${websiteData.footer.whatsapp.replace(/\D/g, '')}?text=Hi!%20I'd%20like%20to%20talk%20to%20admissions.`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline-web !border-[#F7F2DE] !text-[#F7F2DE] hover:!bg-[#F7F2DE] hover:!text-[#13283F]"
                >
                  {websiteData.hero.btnOutlineText}
                </a>
              </div>

              <div className="trustline flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold uppercase tracking-wider text-[#C5A964] mt-8 pt-6 border-t border-white/10 w-full">
                <span className="flex items-center gap-1.5">✓ SECP Registered</span>
                <span className="flex items-center gap-1.5">✓ Industry-Partnered</span>
                <span className="flex items-center gap-1.5">✓ Morning, Afternoon & Evening Batches</span>
              </div>
            </div>
          </section>

          {/* SECTION 2: COLLABORATIONS SECTION */}
          <section className="bg-[#07253d] py-20 text-[#E7E1CF]">
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-14 flex flex-col items-start text-left">
                <p className="text-[#b08b45] text-xs font-bold uppercase tracking-[0.25em] mb-3">
                  {websiteData.collaborations.eyebrow}
                </p>
                <h2 className="text-3xl sm:text-5xl font-serif">
                  {websiteData.collaborations.title}
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-12 md:gap-12 lg:gap-16 xl:gap-20 max-w-6xl mx-auto px-4 justify-items-center">
                {websiteData.collaborations.logos.slice(0, 5).map((logo, index) => (
                  <div 
                    key={logo.id} 
                    className={`flex flex-col items-center justify-center gap-3 group text-center w-32 ${
                      index === 4 ? 'col-span-2 md:col-span-1' : ''
                    }`}
                  >
                    <div className="w-28 h-28 rounded-full overflow-hidden bg-white flex items-center justify-center group-hover:-translate-y-1.5 group-hover:shadow-xl transition-all duration-300">
                      <img 
                        src={logo.img} 
                        alt={logo.alt} 
                        className="w-full h-full object-contain scale-110"
                        onError={(e) => {
                          // Fallback
                          e.currentTarget.src = "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=100";
                        }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-[#E7E1CF]/90 tracking-wide line-clamp-2 leading-tight min-h-[2rem]">
                      {logo.alt}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 3: COURSES CARDS SECTION */}
          <section id="home-courses" className="py-24 bg-[#FBF9F1]">
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-16 flex flex-col items-start">
                <p className="eyebrow">{websiteData.courses?.length > 0 ? 'Our Programs' : 'Academy Pathways'}</p>
                <h2 className="text-3xl sm:text-5xl font-serif text-[#13283F]">Four paths. One standard.</h2>
                <p className="lead-text mt-3">Every program is practical-first: real kitchens, real equipment, real service pressure.</p>
                <div className="divider-gold"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
                {mergedCourses.map((c) => (
                  <article 
                    key={c.id}
                    onClick={() => setSelectedCourseSlug(c.slug)}
                    className="bg-white border border-[#E7E1CF] rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  >
                    <img 
                      src={c.heroShot} 
                      alt={c.name} 
                      className="w-full h-48 object-cover border-b border-[#E7E1CF]"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400";
                      }}
                    />
                    
                    <div className="p-6 flex flex-col flex-1 gap-4">
                      
                      <h3 className="text-xl font-serif text-[#13283F] font-semibold">{c.name}</h3>
                      <p className="text-[#5F6772] text-xs leading-relaxed flex-1">{c.tagline}</p>
                      
                      <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-100">
                        <span className="text-xs font-bold text-[#AE8C45] flex items-center gap-1 group-hover:underline">
                          View details <ArrowRight className="h-3 w-3" />
                        </span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadOutline(c.slug);
                          }}
                          className="text-[11px] font-mono font-bold text-slate-400 hover:text-[#AE8C45] flex items-center gap-0.5"
                          title="Download syllabus PDF"
                        >
                          <Download className="h-3 w-3" /> PDF
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 4: WHY CHOOSE US (WITH VIDEO TOUR) */}
          <section id="home-about" className="py-24 bg-[#F7F2DE]">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              {/* Video Tour Side */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[420px] lg:h-[520px] bg-black">
                <video 
                  key={websiteData.why.video}
                  className="w-full h-full object-cover"
                  src={websiteData.why.video}
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                />
              </div>

              {/* Text Side */}
              <div className="flex flex-col items-start gap-4">
                <p className="eyebrow">{websiteData.why.eyebrow}</p>
                <h2 className="text-3xl sm:text-5xl font-serif text-[#13283F]">
                  {websiteData.why.title}
                </h2>

                <div className="flex flex-col gap-5 mt-6 w-full">
                  {websiteData.why.features.map((feat) => (
                    <div key={feat.id} className="flex gap-4 p-4 border-b border-[#E7E1CF] last:border-b-0">
                      <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-[#F7F2DE] border border-[#AE8C45]/25 flex items-center justify-center text-[#AE8C45]">
                        {feat.icon === 'chef' && <Award className="h-5 w-5" />}
                        {feat.icon === 'users' && <Users className="h-5 w-5" />}
                        {feat.icon === 'building' && <BookOpen className="h-5 w-5" />}
                        {feat.icon === 'clock' && <Star className="h-5 w-5" />}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-serif font-bold text-[#13283F]">{feat.title}</h3>
                        <p className="text-[#5F6772] text-xs leading-relaxed">{feat.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </section>

          {/* SECTION 5: KITCHENS SCROLL GALLERY */}
          <section className="py-24 bg-[#13283F] text-[#F7F2DE]">
            <div className="max-w-7xl mx-auto px-6 mb-12">
              <h2 className="text-3xl sm:text-5xl font-serif text-[#F7F2DE]">
                {websiteData.kitchens.title}
              </h2>
              <p className="text-[#B9C2CE] text-sm sm:text-base mt-2">
                {websiteData.kitchens.lead}
              </p>
              <div className="divider-gold"></div>
            </div>

            <div className="hscroll">
              {websiteData.kitchens.shots.map((shot) => (
                <figure key={shot.id} className="hcard">
                  <img 
                    src={shot.img} 
                    alt={shot.cap}
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=300";
                    }}
                  />
                  <figcaption className="text-xs text-[#B9C2CE] italic font-serif">
                    {shot.cap}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          {/* SECTION 6: FACULTY SECTION */}
          <section className="py-24 bg-[#FBF9F1]">
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-16">
                <p className="eyebrow">{websiteData.faculty.eyebrow}</p>
                <h2 className="text-3xl sm:text-5xl font-serif text-[#13283F]">
                  {websiteData.faculty.title}
                </h2>
                <div className="divider-gold"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {websiteData.faculty.instructors.map((fac) => (
                  <div key={fac.id} className="bg-white border border-[#E7E1CF] rounded-2xl p-8 text-center flex flex-col items-center gap-4 hover:shadow-xl transition-all duration-300">
                    <img 
                      src={fac.image} 
                      alt={fac.name} 
                      className="w-28 h-28 rounded-full object-cover border-2 border-[#AE8C45]/20 p-1"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200";
                      }}
                    />
                    <div className="space-y-1">
                      <h3 className="text-xl font-serif font-bold text-[#13283F]">{fac.name}</h3>
                      <p className="text-[#AE8C45] text-xs font-semibold uppercase tracking-wider">{fac.role}</p>
                    </div>
                    <p className="text-[#5F6772] text-xs leading-relaxed italic">
                      "{fac.bio}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 7: COMPETITIONS SECTION (STUDENTS LIFE) */}
          <section id="home-student-life" className="py-24 bg-[#07253d] text-white">
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-14">
                <p className="text-[#b08b45] text-xs font-bold uppercase tracking-[0.25em] mb-3">
                  {websiteData.competitions.eyebrow}
                </p>
                <h2 className="text-3xl sm:text-5xl font-serif text-[#E7E1CF]">
                  {websiteData.competitions.title}
                </h2>
              </div>

              <div className="video-grid">
                {websiteData.competitions.items.map((item) => (
                  <div key={item.id} className="video-card">
                    <video 
                      key={item.video}
                      controls 
                      src={item.video}
                      className="w-full h-full object-cover"
                    />
                    <div className="p-3 bg-slate-950/40 text-center border-t border-white/5">
                      <span className="text-[11px] font-mono tracking-wider text-slate-300 uppercase">{item.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 8: TESTIMONIALS SECTION */}
          <section className="py-24 bg-[#F7F2DE]">
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-16">
                <p className="eyebrow">{websiteData.testimonials.eyebrow}</p>
                <h2 className="text-3xl sm:text-5xl font-serif text-[#13283F]">
                  {websiteData.testimonials.title}
                </h2>
                <div className="divider-gold"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {websiteData.testimonials.items.map((test) => (
                  <figure key={test.id} className="bg-white border border-[#E7E1CF] border-l-4 border-l-[#AE8C45] rounded-2xl p-6 shadow-md flex flex-col gap-4 hover:shadow-xl transition-all duration-300">
                    <div className="rounded-xl overflow-hidden bg-black h-56 relative shadow-inner">
                      <video 
                        key={test.video}
                        controls 
                        src={test.video}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <figcaption className="space-y-1">
                      <h4 className="text-base font-bold text-[#13283F] font-serif">{test.name}</h4>
                      <p className="text-[#AE8C45] text-xs font-medium">{test.role}</p>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 9: CTA BAND */}
          <section className="bg-gradient-to-r from-[#8F7236] to-[#AE8C45] py-20 text-[#0C1B2C] text-center">
            <div className="max-w-4xl mx-auto px-6 flex flex-col items-center gap-6">
              <h2 className="text-3xl sm:text-5xl font-serif text-[#0C1B2C] leading-tight">
                Your career in food starts with one application.
              </h2>
              <p className="font-medium text-sm sm:text-base text-[#0C1B2C]/90 max-w-lg">
                Admissions are open. Limited seats per batch. Apply today or speak directly on WhatsApp with our enrollment officer.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center mt-2">
                <button 
                  onClick={() => setView('portal')}
                  className="bg-[#13283F] text-[#F7F2DE] hover:bg-[#1D3450] transition-all text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-lg"
                >
                  Apply Online Now
                </button>
                <a 
                  href={`https://wa.me/${websiteData.footer.whatsapp.replace(/\D/g, '')}?text=Hi!%20I%20want%20to%20apply%20at%20The%20Chef's%20Academy.`}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-[#13283F] text-[#13283F] hover:bg-[#13283F] hover:text-white transition-all text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-lg"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </section>

          {/* SECTION 10: FAQS SECTION */}
          <section id="home-faqs" className="py-24 bg-[#FBF9F1]">
            <div className="max-w-3xl mx-auto px-6">
              <div className="mb-14 text-center flex flex-col items-center">
                <p className="eyebrow">{websiteData.faqs.eyebrow}</p>
                <h2 className="text-3xl sm:text-5xl font-serif text-[#13283F]">
                  {websiteData.faqs.title}
                </h2>
                <div className="divider-gold mx-auto"></div>
              </div>

              <div className="bg-white border border-[#E7E1CF] rounded-2xl overflow-hidden divide-y divide-[#E7E1CF]">
                {websiteData.faqs.items.map((faq, idx) => {
                  const isOpen = activeFaq === idx;
                  return (
                    <div key={faq.id} className="acc-item">
                      <button 
                        onClick={() => setActiveFaq(isOpen ? null : idx)}
                        className="w-full flex justify-between items-center text-left p-6 hover:bg-[#F7F2DE] transition-colors gap-4"
                      >
                        <span className="font-semibold text-[#13283F] text-sm sm:text-base">{faq.q}</span>
                        <span className="text-xl text-[#AE8C45] font-light leading-none transition-transform duration-200">
                          {isOpen ? '−' : '+'}
                        </span>
                      </button>
                      <div className={`acc-content overflow-hidden transition-all duration-300 ${
                        isOpen ? 'max-h-[300px] border-t border-[#E7E1CF]/30 bg-slate-50/20' : 'max-h-0'
                      }`}>
                        <div className="p-6 text-[#5F6772] text-xs sm:text-sm leading-relaxed">
                          {faq.a}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

        </main>
      ) : (
        /* COURSE DETAIL VIEW */
        <main className="pt-20">
          
          {/* COURSE HERO */}
          <section className="bg-[#13283F] text-[#F7F2DE] py-24">
            <div className="max-w-7xl mx-auto px-6">
              <p className="text-xs text-slate-400 mb-4 tracking-wider uppercase">
                <span onClick={() => setSelectedCourseSlug(null)} className="cursor-pointer hover:text-[#C5A964]">Home</span> / Courses / {currentCourse.name}
              </p>

              <h1 className="text-white text-4xl sm:text-6xl font-serif mb-4 leading-tight">
                {currentCourse.name}
              </h1>

              <p className="text-[#C9D1DC] text-lg sm:text-xl font-light leading-relaxed max-w-2xl mb-8">
                {currentCourse.tagline}
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <span className="border border-white/20 bg-white/5 rounded-full px-4 py-1.5 text-xs font-semibold">
                  🏢 High-Tech Kitchens
                </span>
                <span className="border border-white/20 bg-white/5 rounded-full px-4 py-1.5 text-xs font-semibold">
                  📜 Certificate Awarded
                </span>
                <span className="border border-white/20 bg-white/5 rounded-full px-4 py-1.5 text-xs font-semibold">
                  🔥 Practical-First
                </span>
              </div>

              {/* Duration Variants */}
              {coursePlans[currentCourse.name] && coursePlans[currentCourse.name].length > 0 && (
                <div className="mb-10">
                  <h3 className="text-xs text-[#C5A964] font-bold uppercase tracking-widest mb-4">Available Program Durations</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {coursePlans[currentCourse.name].map((plan, idx) => (
                      <div 
                        key={idx}
                        onMouseEnter={() => setHoveredPlan(idx)}
                        onMouseLeave={() => setHoveredPlan(null)}
                        className={`relative border rounded-xl p-4 transition-all duration-300 cursor-pointer ${
                          hoveredPlan === idx ? 'bg-[#C5A964] border-[#C5A964] text-[#13283F] shadow-lg transform -translate-y-1' : 'bg-white/5 border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-base sm:text-lg">{plan.duration}</h4>
                          <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${hoveredPlan === idx ? 'bg-[#13283F] text-[#C5A964]' : 'bg-[#C5A964] text-[#13283F]'}`}>
                            PKR {plan.fee.toLocaleString()}
                          </span>
                        </div>
                        <div className={`text-sm whitespace-pre-line overflow-hidden transition-all duration-500 ${hoveredPlan === idx ? 'max-h-[800px] opacity-100 mt-3 border-t border-[#13283F]/20 pt-3' : 'max-h-0 opacity-0'}`}>
                          {plan.detail || (DEFAULT_COURSE_PLANS[currentCourse.name]?.[idx]?.detail) || 'Complete hands-on training with professional certification.'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => setView('portal')}
                  className="btn-primary-web"
                >
                  Apply for This Course
                </button>
                <button 
                  onClick={() => handleDownloadOutline(selectedCourseSlug)}
                  className="btn-outline-web !border-[#F7F2DE] !text-[#F7F2DE] hover:!bg-[#F7F2DE] hover:!text-[#13283F]"
                >
                  ⬇ Download Course Outline (PDF)
                </button>
              </div>
            </div>
          </section>

          {/* SPLIT DETAIL AREA */}
          <section className="py-24 bg-[#FBF9F1]">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Left major details */}
              <div className="lg:col-span-8 flex flex-col gap-14">
                
                {/* Promo Video */}
                <div className="rounded-2xl overflow-hidden shadow-xl aspect-video bg-black relative">
                  <video controls className="w-full h-full object-cover">
                    <source src={currentCourse.heroVideo} type="video/mp4" />
                  </video>
                </div>

                {/* Overview */}
                <div className="space-y-4">
                  <h2 className="text-2xl sm:text-3xl font-serif text-[#13283F] font-bold">Course Overview</h2>
                  <p className="text-[#5F6772] text-sm sm:text-base leading-relaxed">
                    {currentCourse.overview}
                  </p>
                </div>

                {/* Who should apply */}
                <div className="space-y-4">
                  <h2 className="text-2xl sm:text-3xl font-serif text-[#13283F] font-bold">Who should apply</h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentCourse.apply.map((item: string, idx: number) => (
                      <li key={idx} className="bg-white border border-[#E7E1CF] rounded-xl p-4 text-xs sm:text-sm text-[#13283F] flex items-start gap-3">
                        <span className="text-[#AE8C45] font-bold mt-0.5">✦</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* What you'll learn */}
                <div className="space-y-4">
                  <h2 className="text-2xl sm:text-3xl font-serif text-[#13283F] font-bold">What you'll learn</h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentCourse.learn.map((item: string, idx: number) => (
                      <li key={idx} className="bg-white border border-[#E7E1CF] rounded-xl p-4 text-xs sm:text-sm text-[#13283F] flex items-start gap-3">
                        <span className="text-[#AE8C45] font-bold mt-0.5">✦</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Interactive Syllabus Module Accordions */}
                <div className="space-y-4">
                  <h2 className="text-2xl sm:text-3xl font-serif text-[#13283F] font-bold">Detailed Course Outline</h2>
                  
                  <div className="bg-[#F7F2DE] border border-[#AE8C45] rounded-xl p-6 flex items-center justify-between gap-4 flex-wrap mb-6">
                    <div className="w-12 h-12 bg-[#AE8C45] text-white flex items-center justify-center font-bold text-xs rounded-xl shadow">PDF</div>
                    <div className="flex-1 min-w-[200px]">
                      <h4 className="font-bold text-[#13283F] font-serif text-sm sm:text-base">{currentCourse.name} — Full Syllabus Outline</h4>
                      <p className="text-xs text-[#5F6772]">Printable PDF • contains exact weekly schedules</p>
                    </div>
                    <button 
                      onClick={() => handleDownloadOutline(selectedCourseSlug)}
                      className="btn-primary-web !py-2.5 !text-xs"
                    >
                      Download PDF
                    </button>
                  </div>

                  <div className="bg-white border border-[#E7E1CF] rounded-2xl overflow-hidden divide-y divide-[#E7E1CF]">
                    {currentCourse.outline.map((module: any, idx: number) => {
                      const isOpen = activeOutlineModule === idx;
                      return (
                        <div key={idx} className="syllabus-acc-item">
                          <button 
                            onClick={() => setActiveOutlineModule(isOpen ? null : idx)}
                            className="w-full flex justify-between items-center text-left p-5 hover:bg-[#F7F2DE]/50 transition-colors gap-4"
                          >
                            <span className="font-semibold text-[#13283F] text-sm sm:text-base">{module.t}</span>
                            <span className="text-xl text-[#AE8C45] font-light leading-none">
                              {isOpen ? '−' : '+'}
                            </span>
                          </button>
                          
                          <div className={`acc-content overflow-hidden transition-all duration-300 ${
                            isOpen ? 'max-h-[300px] border-t border-[#E7E1CF]/30 bg-slate-50/10' : 'max-h-0'
                          }`}>
                            <ul className="p-5 pl-8 list-disc gap-2 grid text-xs sm:text-sm text-[#5F6772]">
                              {module.d.map((topic: string, sidx: number) => (
                                <li key={sidx}>{topic}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Weekly Schedule */}
                <div className="space-y-4">
                  <h2 className="text-2xl sm:text-3xl font-serif text-[#13283F] font-bold">Schedule & Batches</h2>
                  <div className="border border-[#E7E1CF] rounded-2xl overflow-hidden bg-white shadow-sm">
                    <table className="w-full border-collapse text-left text-xs sm:text-sm text-[#13283F]">
                      <thead>
                        <tr className="bg-[#F7F2DE] border-b border-[#E7E1CF] text-xs font-bold uppercase tracking-wider text-[#8F7236]">
                          <th className="p-4 sm:p-5">Batch</th>
                          <th className="p-4 sm:p-5">Timing</th>
                          <th className="p-4 sm:p-5">Days</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E7E1CF]">
                        <tr>
                          <td className="p-4 sm:p-5 font-semibold">Morning</td>
                          <td className="p-4 sm:p-5 text-[#5F6772]">9:00 AM – 1:00 PM</td>
                          <td className="p-4 sm:p-5 text-[#5F6772]">Mon – Fri</td>
                        </tr>
                        <tr>
                          <td className="p-4 sm:p-5 font-semibold">Afternoon</td>
                          <td className="p-4 sm:p-5 text-[#5F6772]">1:00 PM – 5:00 PM</td>
                          <td className="p-4 sm:p-5 text-[#5F6772]">Mon – Fri</td>
                        </tr>
                        <tr>
                          <td className="p-4 sm:p-5 font-semibold">Evening</td>
                          <td className="p-4 sm:p-5 text-[#5F6772]">5:00 PM – 9:00 PM</td>
                          <td className="p-4 sm:p-5 text-[#5F6772]">Mon – Fri</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Careers */}
                <div className="space-y-4">
                  <h2 className="text-2xl sm:text-3xl font-serif text-[#13283F] font-bold">Career Pathways</h2>
                  <div className="flex flex-wrap gap-2.5">
                    {currentCourse.careers.map((career: string, idx: number) => (
                      <span key={idx} className="bg-white border border-[#E7E1CF] font-medium text-xs sm:text-sm text-[#13283F] px-4 py-2.5 rounded-full shadow-sm">
                        💼 {career}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right sticky sidebar */}
              <aside className="lg:col-span-4 bg-white border border-[#E7E1CF] rounded-2xl p-6 lg:p-8 flex flex-col gap-6 lg:sticky lg:top-28 shadow-md">
                <img 
                  src={currentCourse.heroShot} 
                  alt={currentCourse.name} 
                  className="w-full h-48 object-cover rounded-xl"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=300";
                  }}
                />
                
                <h3 className="text-center font-serif text-lg font-bold text-[#13283F]">
                  Admissions Open • Limited Seats Available
                </h3>

                <button 
                  onClick={() => setView('portal')}
                  className="btn-primary-web justify-center w-full"
                >
                  Apply Online
                </button>

                <a 
                  href={`https://wa.me/${websiteData.footer.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent("Hi! I'd like information about the "+currentCourse.name+" course.")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-wa-web justify-center w-full"
                >
                  <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
                </a>

                <button 
                  onClick={() => handleDownloadOutline(selectedCourseSlug)}
                  className="btn-outline-web justify-center w-full"
                >
                  Download Syllabus PDF
                </button>

                <p className="text-[11px] text-[#5F6772] text-center italic mt-2 leading-snug">
                  Admissions representatives respond within 24 hours, Monday through Saturday.
                </p>
              </aside>

            </div>
          </section>

        </main>
      )}

      {/* ================= FOOTER ================= */}
      <footer id="home-contact" className="bg-[#0C1B2C] text-[#AEB9C6] pt-16 pb-8 border-t border-[#AE8C45]/15">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-white/5">
          
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={websiteData.logo || "/logo.png"} alt="The Chef's Academy Logo" className="brand-logo-img h-8 w-auto object-contain" />
              <div className="font-display leading-[0.9] text-white">
                <div className="flex items-end gap-1">
                  <span className="text-[10px] text-[#F7F2DE] font-light">The</span>
                  <span className="text-lg text-[#F7F2DE] font-medium leading-none">Chef's</span>
                </div>
                <div className="text-base text-[#F7F2DE] font-medium tracking-wide -mt-0.5 leading-none">Academy</div>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              An SECP-registered culinary & hospitality training academy in Gulberg, Lahore — built for the next generation of chefs, bakers, baristas, and food innovators.
            </p>
            <div className="flex gap-2.5 pt-2">
              <a href={websiteData.footer.facebook} target="_blank" rel="noreferrer" className="w-9 h-9 border border-white/10 hover:border-[#AE8C45] rounded-full flex items-center justify-center hover:text-[#C5A964] transition-all text-xs font-mono">FB</a>
              <a href={websiteData.footer.instagram} target="_blank" rel="noreferrer" className="w-9 h-9 border border-white/10 hover:border-[#AE8C45] rounded-full flex items-center justify-center hover:text-[#C5A964] transition-all text-xs font-mono">IG</a>
              <a href={`https://wa.me/${websiteData.footer.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="w-9 h-9 border border-white/10 hover:border-[#AE8C45] rounded-full flex items-center justify-center hover:text-[#C5A964] transition-all text-xs font-mono">WA</a>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-4">
            <h4 className="text-lg font-serif text-[#F7F2DE] font-semibold">Syllabus Programs</h4>
            <ul className="text-xs space-y-2 text-slate-400">
              {mergedCourses.map((c) => (
                <li key={c.id}>
                  <button onClick={() => setSelectedCourseSlug(c.slug)} className="hover:text-[#C5A964] transition-colors">{c.name} Program</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-4">
            <h4 className="text-lg font-serif text-[#F7F2DE] font-semibold">Quick Links</h4>
            <ul className="text-xs space-y-2 text-slate-400">
              <li><button onClick={() => handleNavClick('home-about')} className="hover:text-[#C5A964] transition-colors">About Academy</button></li>
              <li><button onClick={() => setView('portal')} className="hover:text-[#C5A964] transition-colors">Apply Admissions</button></li>
              <li><button onClick={() => handleNavClick('home-faqs')} className="hover:text-[#C5A964] transition-colors">FAQs & Help</button></li>
              <li><button onClick={() => setView('cms')} className="hover:text-[#C5A964] transition-colors">Instructor Portal</button></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-4">
            <h4 className="text-lg font-serif text-[#F7F2DE] font-semibold">Academy Location</h4>
            <ul className="text-xs space-y-2.5 text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#AE8C45] flex-shrink-0 mt-0.5" />
                <span>{websiteData.footer.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#AE8C45] flex-shrink-0" />
                <a href={`tel:${websiteData.footer.phone}`} className="hover:text-[#C5A964] transition-colors">{websiteData.footer.phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#AE8C45] flex-shrink-0" />
                <a href={`mailto:${websiteData.footer.email}`} className="hover:text-[#C5A964] transition-colors">{websiteData.footer.email}</a>
              </li>
            </ul>

            <div className="mt-3 rounded-lg overflow-hidden border border-white/5 shadow-inner">
              <iframe 
                src={websiteData.footer.mapUrl}
                width="100%" 
                height="100" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy"
                title="The Chef's Academy Location Map"
              ></iframe>
            </div>
          </div>

        </div>

        {/* Foot Bar */}
        <div className="max-w-7xl mx-auto px-6 pt-6 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>© 2026 The Chef's Academy. All rights reserved.</span>
          <span>SECP Registered • Gulberg III, Lahore, Pakistan</span>
        </div>
      </footer>

      {/* Floating WhatsApp Action Button */}
      <a 
        href={`https://wa.me/${websiteData.footer.whatsapp.replace(/\D/g, '')}?text=Hi!%20I'd%20like%20information%20about%20courses%20at%20The%20Chef's%20Academy.`}
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-16 sm:bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="h-7 w-7 text-white fill-white stroke-[0.5]" />
      </a>

      {/* Sticky Mobile Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0C1B2C] grid grid-cols-3 gap-0.5 border-t border-white/5 text-center text-xs font-semibold text-[#F7F2DE]">
        <a href={`tel:${websiteData.footer.phone}`} className="bg-[#13283F] py-4 hover:bg-[#1D3450] transition-colors flex items-center justify-center gap-1.5">
          📞 Call
        </a>
        <a href={`https://wa.me/${websiteData.footer.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="bg-[#13283F] py-4 hover:bg-[#1D3450] transition-colors flex items-center justify-center gap-1.5">
          💬 WhatsApp
        </a>
        <button onClick={() => setView('portal')} className="bg-[#AE8C45] text-[#0C1B2C] py-4 font-bold flex items-center justify-center">
          Apply Now
        </button>
      </div>

    </div>
  );
}
