import { WebsiteData } from '../types';

export const INITIAL_WEBSITE_DATA: WebsiteData = {
  logo: '/logo.png',
  hero: {
    video: 'website video.mp4',
    eyebrow: 'A professional culinary & hospitality academy — Lahore',
    title: 'Train like a professional. Cook like one.',
    description: 'Hands-on culinary, baking, and barista programs taught in professional kitchens by working chefs — with industry partners waiting at the other end.',
    btnPrimaryText: 'Explore Courses',
    btnOutlineText: 'Talk to Admissions on WhatsApp'
  },
  collaborations: {
    eyebrow: 'INDUSTRY COLLABORATIONS',
    title: 'Collaboration With',
    logos: [
      { id: 'logo-1', img: 'Third-culture-cofees.webp', alt: 'Third Culture Coffee Logo' },
      { id: 'logo-2', img: 'dot-coffee.jpeg', alt: 'DOT Coffee Shop Logo' },
      { id: 'logo-3', img: 'Ramada-Hotel.jpg', alt: 'Ramada Hotel Logo' },
      { id: 'logo-4', img: 'royal-swis.jpg', alt: 'Royal Swiss Hotel Logo' },
      { id: 'logo-5', img: 'SECP.png', alt: 'SECP Registered' }
    ]
  },
  why: {
    video: 'website video tour.mp4',
    eyebrow: "Why The Chef's Academy",
    title: 'Built differently. Built for careers.',
    features: [
      {
        id: 'feat-1',
        icon: 'chef',
        title: 'Practical-first training',
        text: 'Most of your hours are spent cooking, baking, and brewing — not watching slides.'
      },
      {
        id: 'feat-2',
        icon: 'users',
        title: 'Working-chef faculty',
        text: 'Learn from instructors with real hotel and restaurant kitchen experience.'
      },
      {
        id: 'feat-3',
        icon: 'building',
        title: 'Industry linkages',
        text: 'Partnerships with DOT Coffee Shop, Ramada Hotel & Royal Swiss Hotel create internship and placement pathways.'
      },
      {
        id: 'feat-4',
        icon: 'clock',
        title: 'Flexible batches',
        text: 'Morning (9–1), afternoon (1–5), and evening (5–9) slots fit study and work schedules.'
      }
    ]
  },
  kitchens: {
    title: 'Inside our kitchens',
    lead: 'Swipe through a typical training week at the academy.',
    shots: [
      { id: 'shot-1', img: 'DSC05300.webp', cap: 'Students working on live cooking station' },
      { id: 'shot-2', img: 'DSC05297.webp', cap: 'Baking & pastry practice session' },
      { id: 'shot-3', img: 'DSC05301.webp', cap: 'Chef demonstration techniques' },
      { id: 'shot-4', img: 'DSC05300.webp', cap: 'Barista training workshop' },
      { id: 'shot-5', img: 'DSC05304.webp', cap: 'Kitchen hygiene practice' },
      { id: 'shot-6', img: 'DSC05305.webp', cap: 'Group cooking session' }
    ]
  },
  competitions: {
    eyebrow: 'STUDENTS LIFE',
    title: 'Competitions at TCA',
    items: [
      { id: 'comp-1', video: 'EP-O1.mp4', title: 'Episode 1' },
      { id: 'comp-2', video: 'EPISODE 02.mp4', title: 'Episode 2' },
      { id: 'comp-3', video: 'EPISODE 03 FINAL.mp4', title: 'Episode 3 Final' },
      { id: 'comp-4', video: 'episode 03.2.mp4', title: 'Episode 3.2' },
      { id: 'comp-5', video: 'Pro-chefs.mp4', title: 'Professional Chefs Series' },
      { id: 'comp-6', video: 'Baking & Desserts.mp4', title: 'Baking & Desserts Showcase' },
      { id: 'comp-7', video: 'barista.mp4', title: 'Barista Skills Challenge' },
      { id: 'comp-8', video: 'Culinary-Arts.mp4', title: 'Culinary Arts Live Session' }
    ]
  },
  faculty: {
    eyebrow: 'FACULTY',
    title: "Learn from chefs who've done it",
    instructors: [
      {
        id: 'fac-1',
        image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=150',
        name: 'Chef Jamil Ahmed',
        role: 'Head Chef Instructor — Culinary Arts',
        bio: '15+ years across five-star hotel kitchens. Specialty: Continental & banquet production.'
      },
      {
        id: 'fac-2',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=150',
        name: 'Chef Maria Khan',
        role: 'Lead Instructor — Baking & Pâtisserie',
        bio: 'Former hotel pastry section lead. Specialty: laminated doughs & entremets.'
      },
      {
        id: 'fac-3',
        image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fc9f?auto=format&fit=crop&q=80&w=150',
        name: 'Sir Zeeshan Shah',
        role: 'Head Trainer — Barista Skills',
        bio: 'Certified barista trainer; partner trainer at DOT Coffee Shop.'
      }
    ]
  },
  testimonials: {
    eyebrow: 'TESTIMONIALS',
    title: 'What our students say',
    items: [
      { id: 'test-1', video: 'TESTIMONIAL 03.mp4', name: 'Minahil Emmanuel', role: "Student of professional chef at The Chef's Academy" },
      { id: 'test-2', video: 'TESTIMONIAL 02.mp4', name: 'Hiba Shahid', role: "Student of Culinary Arts chef at The Chef's Academy" },
      { id: 'test-3', video: 'TESTIMONIAL 05.mp4', name: 'Shiza Akhtar', role: "Student of Barista Skills at The Chef's Academy" }
    ]
  },
  faqs: {
    eyebrow: 'FAQS',
    title: 'Common questions',
    items: [
      { id: 'faq-1', q: 'What are the batch timings?', a: 'Three daily batches: Morning 9 AM – 1 PM, Afternoon 1 PM – 5 PM, Evening 5 PM – 9 PM.' },
      { id: 'faq-2', q: 'Do I need prior experience to apply?', a: 'No. All programs start from fundamentals and build to professional standard.' },
      { id: 'faq-3', q: 'Is the certification recognized?', a: "The Chef's Academy is SECP-registered. Certificates are issued by the academy with verification available." },
      { id: 'faq-4', q: 'Do you help with job placement?', a: 'Yes — we provide placement support through industry partners including Ramada Hotel, Royal Swiss Hotel, and DOT Coffee Shop.' },
      { id: 'faq-5', q: 'How do I pay fees? Are installments available?', a: 'Contact admissions on WhatsApp for the current fee structure and installment options.' }
    ]
  },
  footer: {
    address: '79-B3 Gulberg III, Lahore',
    phone: '+92 328 8888907',
    email: 'info@thechefsacademy.pk',
    facebook: 'https://www.facebook.com/profile.php?id=61579612976212',
    instagram: 'https://www.instagram.com/thechefsacademy_',
    whatsapp: 'https://wa.me/923288888907',
    mapUrl: 'https://maps.google.com/maps?q=79-B3%20Gulberg%20III%20Lahore&t=&z=15&ie=UTF8&iwloc=&output=embed'
  }
};
