import { Course, Testimonial, GalleryItem, ShopProduct } from '../types';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-culinary-arts',
    title: 'Culinary Arts',
    duration: '1, 3 or 6 Months',
    fees: 50000,
    registrationFee: 10000,
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
    fees: 50000,
    registrationFee: 10000,
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
    fees: 50000,
    registrationFee: 10000,
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
    fees: 50000,
    registrationFee: 10000,
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

export const INITIAL_SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: 'prod-1',
    name: "TCA Official Executive Chef Uniform Set",
    category: 'Uniforms',
    price: 6500,
    description: "Premium double-breasted white chef jacket with gold-embroidered TCA crest, black houndstooth kitchen trousers, and adjustable chef toque hat.",
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800',
    inStock: true,
    stockQty: 50,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-2',
    name: "German High-Carbon Steel 8-Piece Chef Knife Set",
    category: 'Tools & Cutlery',
    price: 18500,
    description: "Hand-forged razor-sharp knife roll including 8-inch Chef knife, Santoku, Paring, Utility, Boning knife, Honing steel, and leather carrying case.",
    image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&q=80&w=800',
    inStock: true,
    stockQty: 30,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-3',
    name: "Master Pastry & Fondant Cake Decorating Toolkit",
    category: 'Bakery Gear',
    price: 9200,
    description: "Complete 48-piece patisserie set with stainless piping tips, silicone turn-table, fondant smoothers, cake sculpting tools, and pastry bags.",
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
    inStock: true,
    stockQty: 40,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-4',
    name: "Commercial Barista Milk Pitcher & Precision Tamper Set",
    category: 'Barista Gear',
    price: 4800,
    description: "Teflon non-stick 600ml milk frothing pitcher with eagle-spout for latte art, 58mm stainless heavy tamper, and silicone tamping mat.",
    image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fc9f?auto=format&fit=crop&q=80&w=800',
    inStock: true,
    stockQty: 25,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-5',
    name: "The Chef's Academy Heavy-Duty Embroidered Apron",
    category: 'Uniforms',
    price: 2200,
    description: "Durable cross-back canvas kitchen apron with genuine leather straps, brass towel loop, and large utility pockets for thermometer and pens.",
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800',
    inStock: true,
    stockQty: 100,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-6',
    name: "Commercial Culinary Recipe & HACCP Hygiene Guidebook",
    category: 'Books & Courses',
    price: 3500,
    description: "Comprehensive hardcover reference manual featuring 200+ hotel standard recipes, costing formulas, mother sauce matrices, and HACCP safety standards.",
    image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=800',
    inStock: true,
    stockQty: 60,
    createdAt: new Date().toISOString()
  }
];
