export interface Course {
  id: string;
  title: string;
  duration: string;
  fees: number;
  registrationFee: number;
  shifts: string[];
  category: 'Culinary Arts' | 'Professional Chef' | 'Baking & Desserts' | 'Barista Skills' | 'Diploma' | 'Short Course' | 'Baking' | 'Fast Food' | string;
  description: string;
  image: string;
  instructor: string;
  syllabus: string[];
  seatsAvailable: number;
  totalSeats: number;
  isPopular?: boolean;
  overview?: string;
  heroVideo?: string;
  apply?: string[];
  careers?: string[];
  outline?: { t: string; d: string[] }[];
  faqs?: { q: string; a: string }[];
}

export interface Admission {
  id: string;
  studentName: string;
  fatherName: string;
  email: string;
  phone: string;
  cnic: string;
  gender: string;
  dateOfBirth: string;
  qualification: string;
  selectedCourseId: string;
  selectedCourseTitle: string;
  selectedDuration?: string;
  tuitionFee?: number;
  regFee?: number;
  discountAmount?: number;
  feeStatus?: 'Pending' | 'Uploaded' | 'Approved' | string;
  shift: string;
  city: string;
  address: string;
  receiptNumber: string;
  receiptFile?: string;
  invoiceHtml?: string;
  notes?: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Hold';
  remarks?: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  course: string;
  text: string;
  rating: number;
  image: string;
  role: 'Alumni' | 'Current Student' | 'Entrepreneur';
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Dish' | 'Kitchen Lab' | 'Event';
  image: string;
}

export interface CoursePlanItem {
  duration: string;
  fee: number;
  regFee: number;
  detail?: string;
}

export type CoursePlans = Record<string, CoursePlanItem[]>;

export interface WebsitePartner {
  id: string;
  img: string;
  alt: string;
}

export interface WebsiteFeature {
  id: string;
  icon: 'chef' | 'users' | 'building' | 'clock' | string;
  title: string;
  text: string;
}

export interface WebsiteGalleryItem {
  id: string;
  img: string;
  cap: string;
}

export interface WebsiteCompetition {
  id: string;
  video: string;
  title: string;
}

export interface WebsiteFaculty {
  id: string;
  image: string;
  name: string;
  role: string;
  bio: string;
}

export interface WebsiteTestimonialVideo {
  id: string;
  video: string;
  name: string;
  role: string;
}

export interface WebsiteFaq {
  id: string;
  q: string;
  a: string;
}

export interface PaymentSettings {
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
  mobileName: string;
  mobileNumber: string;
  mobileTitle: string;
}

export interface PopupSettings {
  enabled: boolean;
  title: string;
  content: string;
  image?: string;
  link?: string;
  startDate: string;
  endDate: string;
}

export interface WebsiteData {
  logo?: string;
  paymentSettings?: PaymentSettings;
  popupSettings?: PopupSettings;
  hero: {
    video: string;
    eyebrow: string;
    title: string;
    description: string;
    btnPrimaryText: string;
    btnOutlineText: string;
  };
  why: {
    video: string;
    eyebrow: string;
    title: string;
    features: WebsiteFeature[];
  };
  footer: {
    address: string;
    phone: string;
    email: string;
    facebook: string;
    instagram: string;
    whatsapp: string;
    mapUrl: string;
  };
  collaborations: {
    eyebrow: string;
    title: string;
    logos: WebsitePartner[];
  };
  kitchens: {
    title: string;
    lead: string;
    shots: WebsiteGalleryItem[];
  };
  competitions: {
    eyebrow: string;
    title: string;
    items: WebsiteCompetition[];
  };
  faculty: {
    eyebrow: string;
    title: string;
    instructors: WebsiteFaculty[];
  };
  testimonials: {
    eyebrow: string;
    title: string;
    items: WebsiteTestimonialVideo[];
  };
  faqs: {
    eyebrow: string;
    title: string;
    items: WebsiteFaq[];
  };
}



export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  lastUpdated: string;
}

export interface PurchaseRecord {
  id: string;
  itemName: string;
  cost: number;
  date: string;
  purchasedBy: string;
  quantityAdded: number;
  unit: string;
}

export interface ShopProduct {
  id: string;
  name: string;
  category: 'Uniforms' | 'Tools & Cutlery' | 'Bakery Gear' | 'Barista Gear' | 'Books & Courses' | string;
  price: number;
  description: string;
  image: string;
  inStock: boolean;
  stockQty?: number;
  createdAt: string;
}

export interface ShopOrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface ShopOrder {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  items: ShopOrderItem[];
  totalAmount: number;
  paymentMethod: 'JazzCash' | 'EasyPaisa' | 'Bank Transfer' | string;
  transactionRef: string;
  receiptFile?: string;
  status: 'Pending' | 'Approved' | 'Dispatched' | 'Cancelled';
  createdAt: string;
}
