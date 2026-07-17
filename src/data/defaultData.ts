import { Course, Testimonial, GalleryItem } from '../types';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-culinary-arts',
    title: 'Culinary Arts',
    duration: '1, 3 or 6 Months',
    fees: 45000,
    registrationFee: 3000,
    shifts: ['Morning (09:00 AM - 12:00 PM)', 'Afternoon (01:00 PM - 04:00 PM)', 'Evening (05:00 PM - 08:00 PM)'],
    category: 'Culinary Arts',
    description: 'Hands-on training in international and domestic cuisines, professional kitchen tools, food styling, safety, and restaurant operation skills.',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800',
    instructor: 'Chef Jamil Ahmed (Executive Culinary Master)',
    syllabus: [
      'Kitchen Sanitation and Knife Techniques',
      'Continental, Chinese and Pakistani Traditional Cuisines',
      'Stocks, Gravies, Sauces, and Emulsions',
      'Fine Plating and Food Presentation'
    ],
    seatsAvailable: 15,
    totalSeats: 30,
    isPopular: true,
    heroVideo: 'Culinary-Arts.mp4'
  },
  {
    id: 'course-professional-chef',
    title: 'Professional Chef',
    duration: '1, 3 or 6 Months',
    fees: 55000,
    registrationFee: 4000,
    shifts: ['Morning (09:00 AM - 12:00 PM)', 'Afternoon (01:00 PM - 04:00 PM)', 'Evening (05:00 PM - 08:00 PM)'],
    category: 'Professional Chef',
    description: 'An advanced curriculum for students aiming to start or grow a career as commercial chefs or command professional hotel kitchen divisions.',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800',
    instructor: 'Chef Shahryar Afridi',
    syllabus: [
      'Executive Kitchen Management & HACCP',
      'Advanced French and European Cooking Techniques',
      'Menu Engineering, Cost Calculation and Pricing',
      'Fast-track Banquet Cooking and Commercial Prep'
    ],
    seatsAvailable: 12,
    totalSeats: 25,
    isPopular: true,
    heroVideo: 'Pro-chefs.mp4'
  },
  {
    id: 'course-baking-desserts',
    title: 'Baking & Desserts',
    duration: '1, 3 or 6 Months',
    fees: 40000,
    registrationFee: 3000,
    shifts: ['Morning (09:00 AM - 12:00 PM)', 'Afternoon (01:00 PM - 04:00 PM)', 'Evening (05:00 PM - 08:00 PM)'],
    category: 'Baking & Desserts',
    description: 'Unlock the chemistry of commercial baking. Master custom cake decoration, artisan breads, puffs, pastries, and French classical desserts.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
    instructor: 'Chef Maria Khan (Patisserie Specialist)',
    syllabus: [
      'Bakery Ingredients Chemistry and Equipment handling',
      'Yeast Doughs: Artisan Breads, Pizza Crusts, and Croissants',
      'Cakes, Royal Icing, and Custom Fondant Artistry',
      'High-end European Pastries and Chocolatier Art'
    ],
    seatsAvailable: 18,
    totalSeats: 30,
    isPopular: false,
    heroVideo: 'Baking & Desserts.mp4'
  },
  {
    id: 'course-barista-skills',
    title: 'Barista Skills',
    duration: '1, 3 or 6 Months',
    fees: 35000,
    registrationFee: 2500,
    shifts: ['Morning (09:00 AM - 12:00 PM)', 'Afternoon (01:00 PM - 04:00 PM)', 'Evening (05:00 PM - 08:00 PM)'],
    category: 'Barista Skills',
    description: 'Designed for coffee lovers and future cafe owners. Learn perfect espresso extraction, milk texturing, latte art, and hot/cold specialty brews.',
    image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fc9f?auto=format&fit=crop&q=80&w=800',
    instructor: 'Lead Barista Zeeshan Shah',
    syllabus: [
      'Coffee Bean Chemistry & Roast Levels',
      'Grinding Calibration and Espresso Extraction Secrets',
      'Milk Micro-foaming and Pouring Latte Art',
      'Cold Brews, Smoothies, and Cafe Menu Formulation'
    ],
    seatsAvailable: 10,
    totalSeats: 20,
    isPopular: false,
    heroVideo: 'barista.mp4'
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Muhammad Asif',
    course: 'Culinary Arts (3 Months)',
    text: 'Alhamdulillah, joining The Chef’s Academy was the turning point of my life. The 100% practical classes helped me secure a job as a Chef de Partie at a top hotel in Islamabad right after completion.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=150',
    role: 'Alumni'
  },
  {
    id: 'test-2',
    name: 'Sobia Shah',
    course: 'Baking & Desserts (6 Months)',
    text: 'I started Sobia’s Elegant Bakes from home during my course at the academy. Now, I receive over 50 customized cake orders per month! The instructor Maria taught us fondant art so patiently.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    role: 'Entrepreneur'
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [];
