import React, { useState, useRef } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { uploadFile } from '../lib/firebase';
import { 
  Globe, Video, Star, Users, Image as ImageIcon, Award, 
  HelpCircle, MapPin, Save, Plus, Trash2, ArrowUp, ArrowDown, Upload
} from 'lucide-react';

interface MediaUploaderProps {
  onUpload: (base64Url: string) => void;
  allowedTypes: 'image' | 'video' | 'all';
  label?: string;
  helperText?: string;
}

const compressImage = (base64Str: string, maxW = 1000, maxH = 1000, quality = 0.75): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxW) {
          height = Math.round((height * maxW) / width);
          width = maxW;
        }
      } else {
        if (height > maxH) {
          width = Math.round((width * maxH) / height);
          height = maxH;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64Str);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
};

function MediaUploader({ onUpload, allowedTypes, label = 'Upload', helperText }: MediaUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    const fileType = file.type;
    if (allowedTypes === 'image' && !fileType.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP, etc.).');
      return;
    }
    if (allowedTypes === 'video' && !fileType.startsWith('video/')) {
      alert('Please upload a video file (MP4, WEBM, etc.).');
      return;
    }
    if (allowedTypes === 'all' && !fileType.startsWith('image/') && !fileType.startsWith('video/')) {
      alert('Please upload an image or video file.');
      return;
    }

    // Support up to 15MB for video files and 10MB for images/others
    const sizeInMB = file.size / (1024 * 1024);
    const maxLimit = fileType.startsWith('video/') ? 15 : 10;
    if (sizeInMB > maxLimit) {
      alert(`File is too large (${sizeInMB.toFixed(1)}MB). Maximum allowed size is ${maxLimit}MB.\n\nFor videos, please compress your video to under 5MB for best results.`);
      return;
    }

    setIsUploading(true);

    try {
      let uploadPayload: File | string = file;

      // Only read and compress with FileReader if it's an image
      if (fileType.startsWith('image/')) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = () => reject(new Error('Failed to read image file'));
          reader.readAsDataURL(file);
        });

        try {
          const compressed = await compressImage(base64);
          // Return base64 directly to avoid Firebase Storage timeout issues for images
          onUpload(compressed);
          setIsUploading(false);
          return;
        } catch (err) {
          console.warn('Image compression failed', err);
        }
      }

      // Upload file directly using the powerful raw binary uploader for videos
      const downloadUrl = await uploadFile(uploadPayload, file.name);
      onUpload(downloadUrl);
    } catch (uploadError: any) {
      console.error('File upload failed:', uploadError);
      alert(`Failed to upload file: ${uploadError.message || uploadError}. Please try again or use a smaller file.`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const triggerInput = () => {
    fileInputRef.current?.click();
  };

  const acceptString = allowedTypes === 'image' 
    ? 'image/*' 
    : allowedTypes === 'video' 
      ? 'video/*' 
      : 'image/*,video/*';

  return (
    <div 
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`border border-dashed rounded-lg p-3 text-center transition-all ${
        dragActive 
          ? 'border-amber-500 bg-amber-500/5' 
          : 'border-slate-850 bg-slate-900/20 hover:bg-slate-900/40'
      }`}
    >
      <input 
        ref={fileInputRef}
        type="file" 
        accept={acceptString}
        onChange={handleChange}
        className="hidden" 
      />
      
      <div className="flex flex-col items-center justify-center gap-1">
        <button
          type="button"
          onClick={triggerInput}
          disabled={isUploading}
          className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-950 text-slate-200 hover:text-white rounded text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          {isUploading ? (
            <>
              <span className="inline-block animate-spin mr-1">⏳</span>
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="h-3.5 w-3.5" />
              <span>{label}</span>
            </>
          )}
        </button>
        {helperText && (
          <span className="text-[10px] text-slate-500 mt-1 block">{helperText}</span>
        )}
      </div>
    </div>
  );
}

export default function WebsiteCMSEditor() {
  const { websiteData, updateWebsiteData } = useAcademy();
  const [activeSection, setActiveSection] = useState<'logo' | 'hero' | 'collabs' | 'why' | 'kitchens' | 'faculty' | 'competitions' | 'testimonials' | 'faqs' | 'footer'>('logo');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [heroVideo, setHeroVideo] = useState(websiteData.hero.video);
  const [whyVideo, setWhyVideo] = useState(websiteData.why.video);
  const [newKitchenCap, setNewKitchenCap] = useState('');

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // 1. Save Hero
  const handleSaveHero = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updated = {
      ...websiteData,
      hero: {
        video: heroVideo,
        eyebrow: formData.get('eyebrow') as string,
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        btnPrimaryText: formData.get('btnPrimaryText') as string,
        btnOutlineText: formData.get('btnOutlineText') as string,
      }
    };
    updateWebsiteData(updated);
    triggerSuccess('Hero section settings saved successfully!');
  };

  // 2. Save Collaborations
  const handleSaveCollabMeta = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updated = {
      ...websiteData,
      collaborations: {
        ...websiteData.collaborations,
        eyebrow: formData.get('eyebrow') as string,
        title: formData.get('title') as string,
      }
    };
    updateWebsiteData(updated);
    triggerSuccess('Collaboration section titles saved successfully!');
  };

  const handleAddCollabLogo = () => {
    const img = prompt('Enter Logo Image URL:', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=100');
    if (!img) return;
    const alt = prompt('Enter Partner Alt Text (e.g. Ramada Hotel):', 'Partner Logo');
    if (!alt) return;

    const newLogos = [
      ...websiteData.collaborations.logos,
      { id: `col-${Date.now()}`, img, alt }
    ];
    updateWebsiteData({
      ...websiteData,
      collaborations: { ...websiteData.collaborations, logos: newLogos }
    });
    triggerSuccess('New collaboration partner added!');
  };

  const handleDeleteCollabLogo = (id: string) => {
    const filtered = websiteData.collaborations.logos.filter(l => l.id !== id);
    updateWebsiteData({
      ...websiteData,
      collaborations: { ...websiteData.collaborations, logos: filtered }
    });
    triggerSuccess('Partner logo removed!');
  };

  // 3. Save Why Choose Us
  const handleSaveWhyMeta = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updated = {
      ...websiteData,
      why: {
        ...websiteData.why,
        video: whyVideo,
        eyebrow: formData.get('eyebrow') as string,
        title: formData.get('title') as string,
      }
    };
    updateWebsiteData(updated);
    triggerSuccess('Why Choose Us video and titles saved!');
  };

  const handleUpdateWhyFeature = (index: number, key: 'title' | 'text' | 'icon', val: string) => {
    const updatedFeatures = [...websiteData.why.features];
    updatedFeatures[index] = {
      ...updatedFeatures[index],
      [key]: val
    };
    updateWebsiteData({
      ...websiteData,
      why: { ...websiteData.why, features: updatedFeatures }
    });
  };

  // 4. Save Kitchens Gallery
  const handleSaveKitchenMeta = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updated = {
      ...websiteData,
      kitchens: {
        ...websiteData.kitchens,
        title: formData.get('title') as string,
        lead: formData.get('lead') as string,
      }
    };
    updateWebsiteData(updated);
    triggerSuccess('Kitchen gallery titles saved successfully!');
  };

  const handleAddKitchenShot = () => {
    const img = prompt('Enter Kitchen Image URL:', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600');
    if (!img) return;
    const cap = prompt('Enter Image Caption:', 'Kitchen Laboratory Shot');
    if (!cap) return;

    const newShots = [
      ...websiteData.kitchens.shots,
      { id: `kit-${Date.now()}`, img, cap }
    ];
    updateWebsiteData({
      ...websiteData,
      kitchens: { ...websiteData.kitchens, shots: newShots }
    });
    triggerSuccess('New kitchen shot added to gallery!');
  };

  const handleDeleteKitchenShot = (id: string) => {
    const filtered = websiteData.kitchens.shots.filter(s => s.id !== id);
    updateWebsiteData({
      ...websiteData,
      kitchens: { ...websiteData.kitchens, shots: filtered }
    });
    triggerSuccess('Kitchen gallery shot removed!');
  };

  // 5. Save Faculty Team
  const handleSaveFacultyMeta = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updated = {
      ...websiteData,
      faculty: {
        ...websiteData.faculty,
        eyebrow: formData.get('eyebrow') as string,
        title: formData.get('title') as string,
      }
    };
    updateWebsiteData(updated);
    triggerSuccess('Faculty section headers saved!');
  };

  const handleUpdateInstructor = (id: string, key: 'name' | 'role' | 'bio' | 'image', val: string) => {
    const updatedInstructors = websiteData.faculty.instructors.map(inst => 
      inst.id === id ? { ...inst, [key]: val } : inst
    );
    updateWebsiteData({
      ...websiteData,
      faculty: { ...websiteData.faculty, instructors: updatedInstructors }
    });
  };

  const handleAddInstructor = () => {
    const name = prompt('Enter Instructor Name:');
    if (!name) return;
    const role = prompt('Enter Role (e.g. Executive Pastry Chef):');
    if (!role) return;
    const bio = prompt('Enter Brief Bio Paragraph:');
    if (!bio) return;
    const image = prompt('Enter Image URL:', 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200');
    if (!image) return;

    const updated = [
      ...websiteData.faculty.instructors,
      { id: `fac-${Date.now()}`, name, role, bio, image }
    ];
    updateWebsiteData({
      ...websiteData,
      faculty: { ...websiteData.faculty, instructors: updated }
    });
    triggerSuccess('Instructor added to team!');
  };

  const handleDeleteInstructor = (id: string) => {
    const filtered = websiteData.faculty.instructors.filter(i => i.id !== id);
    updateWebsiteData({
      ...websiteData,
      faculty: { ...websiteData.faculty, instructors: filtered }
    });
    triggerSuccess('Faculty member removed!');
  };

  // 6. Save Competitions
  const handleSaveCompMeta = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updated = {
      ...websiteData,
      competitions: {
        ...websiteData.competitions,
        eyebrow: formData.get('eyebrow') as string,
        title: formData.get('title') as string,
      }
    };
    updateWebsiteData(updated);
    triggerSuccess('Competitions header settings saved!');
  };

  const handleUpdateCompVideo = (id: string, key: 'title' | 'video', val: string) => {
    const updatedItems = websiteData.competitions.items.map(item => 
      item.id === id ? { ...item, [key]: val } : item
    );
    updateWebsiteData({
      ...websiteData,
      competitions: { ...websiteData.competitions, items: updatedItems }
    });
  };

  const handleAddCompVideo = () => {
    const title = prompt('Enter Competition Label:', 'National Culinary Championship');
    if (!title) return;
    const video = prompt('Enter Video Filename/Path (e.g. competition.mp4):', 'competitions.mp4');
    if (!video) return;

    const newItems = [
      ...websiteData.competitions.items,
      { id: `comp-${Date.now()}`, title, video }
    ];
    updateWebsiteData({
      ...websiteData,
      competitions: { ...websiteData.competitions, items: newItems }
    });
    triggerSuccess('New competition video slot added!');
  };

  const handleDeleteCompVideo = (id: string) => {
    const filtered = websiteData.competitions.items.filter(item => item.id !== id);
    updateWebsiteData({
      ...websiteData,
      competitions: { ...websiteData.competitions, items: filtered }
    });
    triggerSuccess('Competition video slot removed!');
  };

  // 7. Save Testimonials
  const handleSaveTestMeta = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updated = {
      ...websiteData,
      testimonials: {
        ...websiteData.testimonials,
        eyebrow: formData.get('eyebrow') as string,
        title: formData.get('title') as string,
      }
    };
    updateWebsiteData(updated);
    triggerSuccess('Testimonials section titles saved successfully!');
  };

  const handleUpdateTestimonialVideo = (id: string, key: 'name' | 'role' | 'video', val: string) => {
    const updatedItems = websiteData.testimonials.items.map(test => 
      test.id === id ? { ...test, [key]: val } : test
    );
    updateWebsiteData({
      ...websiteData,
      testimonials: { ...websiteData.testimonials, items: updatedItems }
    });
  };

  const handleAddTestimonialVideo = () => {
    const name = prompt('Enter Alumnus Name:');
    if (!name) return;
    const role = prompt('Enter Subtitle/Role (e.g. Chef de Partie - Royal Swiss):');
    if (!role) return;
    const video = prompt('Enter Video Path/Filename:', 'review-1.mp4');
    if (!video) return;

    const newItems = [
      ...websiteData.testimonials.items,
      { id: `testv-${Date.now()}`, name, role, video }
    ];
    updateWebsiteData({
      ...websiteData,
      testimonials: { ...websiteData.testimonials, items: newItems }
    });
    triggerSuccess('New video review added!');
  };

  const handleDeleteTestimonialVideo = (id: string) => {
    const filtered = websiteData.testimonials.items.filter(item => item.id !== id);
    updateWebsiteData({
      ...websiteData,
      testimonials: { ...websiteData.testimonials, items: filtered }
    });
    triggerSuccess('Video review removed!');
  };

  // 8. Save FAQs
  const handleSaveFaqMeta = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updated = {
      ...websiteData,
      faqs: {
        ...websiteData.faqs,
        eyebrow: formData.get('eyebrow') as string,
        title: formData.get('title') as string,
      }
    };
    updateWebsiteData(updated);
    triggerSuccess('FAQ section headers saved!');
  };

  const handleUpdateFaq = (index: number, key: 'q' | 'a', val: string) => {
    const updatedFaqs = [...websiteData.faqs.items];
    updatedFaqs[index] = {
      ...updatedFaqs[index],
      [key]: val
    };
    updateWebsiteData({
      ...websiteData,
      faqs: { ...websiteData.faqs, items: updatedFaqs }
    });
  };

  const handleAddFaq = () => {
    const q = prompt('Enter FAQ Question text:');
    if (!q) return;
    const a = prompt('Enter FAQ Answer text:');
    if (!a) return;

    const newFaqs = [
      ...websiteData.faqs.items,
      { id: `faq-${Date.now()}`, q, a }
    ];
    updateWebsiteData({
      ...websiteData,
      faqs: { ...websiteData.faqs, items: newFaqs }
    });
    triggerSuccess('New FAQ item added successfully!');
  };

  const handleDeleteFaq = (id: string) => {
    const filtered = websiteData.faqs.items.filter(faq => faq.id !== id);
    updateWebsiteData({
      ...websiteData,
      faqs: { ...websiteData.faqs, items: filtered }
    });
    triggerSuccess('FAQ item removed!');
  };

  // 9. Save Footer Info
  const handleSaveFooter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updated = {
      ...websiteData,
      footer: {
        address: formData.get('address') as string,
        phone: formData.get('phone') as string,
        email: formData.get('email') as string,
        facebook: formData.get('facebook') as string,
        instagram: formData.get('instagram') as string,
        whatsapp: formData.get('whatsapp') as string,
        mapUrl: formData.get('mapUrl') as string,
      }
    };
    updateWebsiteData(updated);
    triggerSuccess('Footer contact details saved!');
  };

  return (
    <div className="space-y-6">
      
      {/* Tab Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-amber-400 flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <span>Website CMS Section Editor</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Independently manage every segment of the front-end homepage, including video paths, contact details, team members, and testimonials.
          </p>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl px-4 py-2 text-xs font-semibold animate-pulse">
            ✓ {successMsg}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Section Picker Left Rail */}
        <div className="md:col-span-3 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible gap-1.5 pb-2 md:pb-0 scrollbar-none">
          {[
            { id: 'logo', title: 'Logo & Branding', icon: Globe },
            { id: 'hero', title: 'Hero Section', icon: Video },
            { id: 'collabs', title: 'Collaborations', icon: Star },
            { id: 'why', title: 'Why Choose Us', icon: Award },
            { id: 'kitchens', title: 'Kitchens Gallery', icon: ImageIcon },
            { id: 'faculty', title: 'Faculty & Team', icon: Users },
            { id: 'competitions', title: 'Competitions', icon: Video },
            { id: 'testimonials', title: 'Video Reviews', icon: Star },
            { id: 'faqs', title: 'FAQs Accordion', icon: HelpCircle },
            { id: 'footer', title: 'Footer & Map', icon: MapPin },
          ].map((sec) => {
            const Icon = sec.icon;
            const active = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex-shrink-0 text-left ${
                  active 
                    ? 'bg-amber-500 text-slate-950 font-extrabold shadow shadow-amber-500/10' 
                    : 'bg-slate-950/80 text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span>{sec.title}</span>
              </button>
            );
          })}
        </div>

        {/* Section Editing Panel Right Area */}
        <div className="md:col-span-9 bg-slate-950/40 border border-slate-900 rounded-xl p-5 sm:p-6 shadow">
          
          {/* 0. LOGO & BRANDING SECTION */}
          {activeSection === 'logo' && (
            <div className="space-y-4 text-xs sm:text-sm">
              <span className="block text-amber-500 font-bold uppercase tracking-wider text-xs pb-2 border-b border-slate-900 mb-4">Logo & Branding Identity</span>
              
              <div className="bg-slate-950 p-6 border border-slate-900 rounded-xl space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-24 h-24 bg-[#0a0f18] border border-[#c19d53]/30 rounded-xl p-2 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img 
                      src={websiteData.logo || '/logo.png'} 
                      alt="Current Logo" 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <h3 className="text-slate-200 font-bold text-base">Header Logo Image</h3>
                    <p className="text-slate-500 text-xs leading-relaxed max-w-md">
                      Upload your official academy logo. This logo appears in the top header navbar on both the public website and the student portal. Recommends PNG format with a transparent background.
                    </p>
                    
                    <div className="pt-2 max-w-sm mx-auto sm:mx-0">
                      <MediaUploader 
                        allowedTypes="image"
                        label="Upload Logo Image"
                        helperText="Accepts .png, .jpg, .webp up to 5MB"
                        onUpload={(base64) => {
                          updateWebsiteData({
                            ...websiteData,
                            logo: base64
                          });
                          triggerSuccess('Header logo updated successfully!');
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 1. HERO SECTION */}
          {activeSection === 'hero' && (
            <form onSubmit={handleSaveHero} className="space-y-4 text-xs sm:text-sm">
              <span className="block text-amber-500 font-bold uppercase tracking-wider text-xs pb-2 border-b border-slate-900 mb-4">Hero Configuration</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Small Eyebrow Text</label>
                  <input type="text" name="eyebrow" defaultValue={websiteData.hero.eyebrow} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200" required />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Background Video (URL or File Upload)</label>
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      value={heroVideo} 
                      onChange={(e) => setHeroVideo(e.target.value)} 
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono text-xs" 
                      required 
                    />
                    <MediaUploader 
                      allowedTypes="video"
                      label="Upload Background Video"
                      helperText="Accepts .mp4 up to 15MB"
                      onUpload={(base64) => {
                        setHeroVideo(base64);
                        // Also auto-save to make it dynamic and immediate
                        const updated = {
                          ...websiteData,
                          hero: {
                            ...websiteData.hero,
                            video: base64
                          }
                        };
                        updateWebsiteData(updated);
                        triggerSuccess('Background video uploaded & saved successfully!');
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase text-[10px]">Main Catchy Headline Title</label>
                <input type="text" name="title" defaultValue={websiteData.hero.title} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200" required />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase text-[10px]">Hero Paragraph Description</label>
                <textarea name="description" defaultValue={websiteData.hero.description} rows={3} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 resize-none" required></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Primary Action Button Text</label>
                  <input type="text" name="btnPrimaryText" defaultValue={websiteData.hero.btnPrimaryText} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200" required />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Secondary Action Button Text</label>
                  <input type="text" name="btnOutlineText" defaultValue={websiteData.hero.btnOutlineText} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200" required />
                </div>
              </div>

              <button type="submit" className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-lg text-xs uppercase shadow transition-all cursor-pointer">
                <Save className="h-4 w-4" /> Save Hero Settings
              </button>
            </form>
          )}

          {/* 2. COLLABORATIONS SECTION */}
          {activeSection === 'collabs' && (
            <div className="space-y-6">
              <form onSubmit={handleSaveCollabMeta} className="space-y-4 text-xs sm:text-sm">
                <span className="block text-amber-500 font-bold uppercase tracking-wider text-xs pb-2 border-b border-slate-900 mb-4">Collaborations Header</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold uppercase text-[10px]">Eyebrow Label</label>
                    <input type="text" name="eyebrow" defaultValue={websiteData.collaborations.eyebrow} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold uppercase text-[10px]">Section Title</label>
                    <input type="text" name="title" defaultValue={websiteData.collaborations.title} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200" required />
                  </div>
                </div>
                <button type="submit" className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-lg text-xs uppercase shadow transition-all cursor-pointer">
                  <Save className="h-4 w-4" /> Save Header Titles
                </button>
              </form>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-900 pb-3">
                  <span className="block text-slate-400 font-bold uppercase tracking-wider text-[10px]">Partner & Association Logos ({websiteData.collaborations.logos.length})</span>
                  <button 
                    type="button"
                    onClick={() => {
                      const newLogos = [
                        ...websiteData.collaborations.logos,
                        { 
                          id: `col-${Date.now()}`, 
                          img: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=100', 
                          alt: 'New Partner' 
                        }
                      ];
                      updateWebsiteData({
                        ...websiteData,
                        collaborations: { ...websiteData.collaborations, logos: newLogos }
                      });
                      triggerSuccess('New partner slot added! You can now type their name and change their logo below.');
                    }}
                    className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-2 rounded-lg text-xs uppercase cursor-pointer transition-all self-start"
                  >
                    <Plus className="h-4 w-4" /> Add Partner
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                  {websiteData.collaborations.logos.map((logo) => (
                    <div key={logo.id} className="bg-slate-950/60 p-5 border border-slate-900 rounded-xl flex flex-col items-center gap-4 relative">
                      {/* Delete Button (Always Visible) */}
                      <button 
                        type="button"
                        onClick={() => handleDeleteCollabLogo(logo.id)} 
                        className="absolute top-2.5 right-2.5 text-red-500 hover:text-white p-2 bg-slate-900 hover:bg-red-600/20 border border-slate-800 rounded-lg transition-all cursor-pointer"
                        title="Delete Partner"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      {/* Partner Logo Circle */}
                      <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center p-2 shadow-md overflow-hidden border border-slate-800">
                        <img 
                          src={logo.img} 
                          alt={logo.alt} 
                          className="w-full h-full object-contain" 
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=100';
                          }}
                        />
                      </div>

                      {/* Change Logo Upload Button */}
                      <div className="w-full">
                        <MediaUploader 
                          allowedTypes="image"
                          label="Change Logo"
                          helperText="PNG/JPG up to 3MB"
                          onUpload={(base64) => {
                            const updatedLogos = websiteData.collaborations.logos.map(l => 
                              l.id === logo.id ? { ...l, img: base64 } : l
                            );
                            updateWebsiteData({
                              ...websiteData,
                              collaborations: { ...websiteData.collaborations, logos: updatedLogos }
                            });
                            triggerSuccess(`Logo for '${logo.alt}' updated successfully!`);
                          }}
                        />
                      </div>

                      {/* Partner Name Input */}
                      <div className="w-full space-y-1">
                        <label className="text-[10px] text-slate-500 font-bold uppercase">Partner Name</label>
                        <input 
                          type="text"
                          value={logo.alt}
                          onChange={(e) => {
                            const updatedLogos = websiteData.collaborations.logos.map(l => 
                              l.id === logo.id ? { ...l, alt: e.target.value } : l
                            );
                            updateWebsiteData({
                              ...websiteData,
                              collaborations: { ...websiteData.collaborations, logos: updatedLogos }
                            });
                          }}
                          className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-amber-500/50"
                          placeholder="e.g. Serena Hotel"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. WHY CHOOSE US SECTION */}
          {activeSection === 'why' && (
            <div className="space-y-6">
              <form onSubmit={handleSaveWhyMeta} className="space-y-4 text-xs sm:text-sm">
                <span className="block text-amber-500 font-bold uppercase tracking-wider text-xs pb-2 border-b border-slate-900 mb-4">Why Choose Us Configuration</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold uppercase text-[10px]">Section Eyebrow Label</label>
                    <input type="text" name="eyebrow" defaultValue={websiteData.why.eyebrow} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200" required />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-slate-400 font-bold uppercase text-[10px]">Main Section Title Headline</label>
                    <input type="text" name="title" defaultValue={websiteData.why.title} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200" required />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Interactive Tour Video (URL or File Upload)</label>
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      value={whyVideo} 
                      onChange={(e) => setWhyVideo(e.target.value)} 
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono text-xs" 
                      required 
                    />
                    <MediaUploader 
                      allowedTypes="video"
                      label="Upload Tour Video"
                      helperText="Recommended: under 5MB — max 15MB"
                      onUpload={(base64) => {
                        setWhyVideo(base64);
                        // Auto-save to make it dynamic and immediate
                        const updated = {
                          ...websiteData,
                          why: {
                            ...websiteData.why,
                            video: base64
                          }
                        };
                        updateWebsiteData(updated);
                        triggerSuccess('Tour video uploaded & saved successfully!');
                      }}
                    />
                  </div>
                </div>

                <button type="submit" className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-lg text-xs uppercase shadow transition-all cursor-pointer">
                  <Save className="h-4 w-4" /> Save Why Settings
                </button>
              </form>

              <div className="space-y-4">
                <span className="block text-slate-400 font-bold uppercase tracking-wider text-[10px]">Core Features Checklist (4 Items)</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {websiteData.why.features.map((feat, idx) => (
                    <div key={feat.id} className="bg-slate-950 p-4 border border-slate-900 rounded-xl space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                        <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wide">Feature #{idx + 1}</span>
                        <select 
                          value={feat.icon} 
                          onChange={(e) => handleUpdateWhyFeature(idx, 'icon', e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-[10px] text-slate-300 font-bold uppercase"
                        >
                          <option value="chef">Chef Knife</option>
                          <option value="users">Spoon / Team</option>
                          <option value="building">Commercial Kitchen</option>
                          <option value="clock">Clock Batch</option>
                        </select>
                      </div>

                      <div className="space-y-2 text-xs">
                        <input 
                          type="text" 
                          value={feat.title} 
                          onChange={(e) => handleUpdateWhyFeature(idx, 'title', e.target.value)}
                          placeholder="Feature Title Headline" 
                          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 font-bold" 
                        />
                        <textarea 
                          value={feat.text} 
                          onChange={(e) => handleUpdateWhyFeature(idx, 'text', e.target.value)}
                          placeholder="Feature description text..." 
                          rows={2} 
                          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-400 text-xs resize-none"
                        ></textarea>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. KITCHENS GALLERY SECTION */}
          {activeSection === 'kitchens' && (
            <div className="space-y-6">
              <form onSubmit={handleSaveKitchenMeta} className="space-y-4 text-xs sm:text-sm">
                <span className="block text-amber-500 font-bold uppercase tracking-wider text-xs pb-2 border-b border-slate-900 mb-4">Kitchen Gallery Headings</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold uppercase text-[10px]">Section Main Title</label>
                    <input type="text" name="title" defaultValue={websiteData.kitchens.title} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold uppercase text-[10px]">Lead Description Subtitle</label>
                    <input type="text" name="lead" defaultValue={websiteData.kitchens.lead} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200" required />
                  </div>
                </div>
                <button type="submit" className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-lg text-xs uppercase shadow transition-all cursor-pointer">
                  <Save className="h-4 w-4" /> Save Titles
                </button>
              </form>

              <div className="space-y-4">
                <span className="block text-slate-400 font-bold uppercase tracking-wider text-[10px]">Kitchen Gallery Photos ({websiteData.kitchens.shots.length})</span>

                {/* Inline upload zone */}
                <div className="bg-slate-950 p-4 border border-slate-900 rounded-xl space-y-4">
                  <span className="block text-slate-200 font-bold text-xs uppercase tracking-wider">Add New Kitchen Photo</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                    <div className="space-y-1">
                      <label className="text-slate-500 text-[10px] font-bold uppercase">Image Caption / Label</label>
                      <input 
                        type="text" 
                        value={newKitchenCap} 
                        onChange={(e) => setNewKitchenCap(e.target.value)}
                        placeholder="e.g. Baking & Pastry Lab" 
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-500 text-[10px] font-bold uppercase">Upload Photo</label>
                      <MediaUploader 
                        allowedTypes="image"
                        label="Select & Add Photo"
                        helperText="Accepts PNG/JPG/WEBP up to 5MB"
                        onUpload={(base64) => {
                          if (!newKitchenCap.trim()) {
                            alert('Please enter an image caption / label first!');
                            return;
                          }
                          const newShots = [
                            ...websiteData.kitchens.shots,
                            { id: `kit-${Date.now()}`, img: base64, cap: newKitchenCap }
                          ];
                          updateWebsiteData({
                            ...websiteData,
                            kitchens: { ...websiteData.kitchens, shots: newShots }
                          });
                          setNewKitchenCap('');
                          triggerSuccess(`Photo '${newKitchenCap}' added to gallery!`);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  {websiteData.kitchens.shots.map((shot) => (
                    <div key={shot.id} className="bg-slate-950/60 p-3 border border-slate-900 rounded-xl flex flex-col gap-2 relative group">
                      <img src={shot.img} alt={shot.cap} className="w-full h-32 object-cover rounded-lg border border-slate-900" />
                      <span className="text-[10px] text-slate-400 font-medium italic mt-1 leading-tight">"{shot.cap}"</span>
                      <button onClick={() => handleDeleteKitchenShot(shot.id)} className="absolute top-4 right-4 text-red-500 bg-slate-950/95 p-1 rounded-full hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. FACULTY MEMBERS SECTION */}
          {activeSection === 'faculty' && (
            <div className="space-y-6">
              <form onSubmit={handleSaveFacultyMeta} className="space-y-4 text-xs sm:text-sm">
                <span className="block text-amber-500 font-bold uppercase tracking-wider text-xs pb-2 border-b border-slate-900 mb-4">Faculty Section Header</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold uppercase text-[10px]">Eyebrow Label</label>
                    <input type="text" name="eyebrow" defaultValue={websiteData.faculty.eyebrow} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold uppercase text-[10px]">Section Title</label>
                    <input type="text" name="title" defaultValue={websiteData.faculty.title} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200" required />
                  </div>
                </div>
                <button type="submit" className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-lg text-xs uppercase shadow transition-all cursor-pointer">
                  <Save className="h-4 w-4" /> Save Titles
                </button>
              </form>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="block text-slate-400 font-bold uppercase tracking-wider text-[10px]">Instructor profiles ({websiteData.faculty.instructors.length})</span>
                  <button onClick={handleAddInstructor} className="flex items-center gap-1 text-amber-500 hover:text-white text-[10px] font-bold uppercase tracking-wider">
                    <Plus className="h-3 w-3 stroke-[3]" /> Add Instructor Profile
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {websiteData.faculty.instructors.map((inst, idx) => (
                    <div key={inst.id} className="bg-slate-950 p-4 border border-slate-900 rounded-xl grid grid-cols-1 sm:grid-cols-12 gap-4 relative group items-start">
                      
                      <div className="sm:col-span-3 space-y-2 flex flex-col items-center">
                        <img src={inst.image} alt={inst.name} className="w-20 h-20 rounded-full object-cover border border-slate-800" />
                        <input 
                          type="text" 
                          value={inst.image} 
                          onChange={(e) => handleUpdateInstructor(inst.id, 'image', e.target.value)}
                          placeholder="Photo link" 
                          className="w-full bg-slate-900 border border-slate-800 rounded p-1 text-[10px] font-mono text-center truncate mb-1" 
                        />
                        <MediaUploader 
                          allowedTypes="image"
                          label="Upload Photo"
                          helperText="JPG/PNG up to 2MB"
                          onUpload={(base64) => {
                            handleUpdateInstructor(inst.id, 'image', base64);
                            triggerSuccess(`Instructor photo uploaded for ${inst.name || 'instructor'}!`);
                          }}
                        />
                      </div>

                      <div className="sm:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1">
                          <label className="text-slate-500 font-bold uppercase text-[9px]">Full Name</label>
                          <input 
                            type="text" 
                            value={inst.name} 
                            onChange={(e) => handleUpdateInstructor(inst.id, 'name', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 font-bold" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-500 font-bold uppercase text-[9px]">Title Role</label>
                          <input 
                            type="text" 
                            value={inst.role} 
                            onChange={(e) => handleUpdateInstructor(inst.id, 'role', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-amber-500 font-semibold" 
                          />
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-slate-500 font-bold uppercase text-[9px]">Brief Biography (Intro Quotes)</label>
                          <textarea 
                            value={inst.bio} 
                            onChange={(e) => handleUpdateInstructor(inst.id, 'bio', e.target.value)}
                            rows={2} 
                            className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-300 resize-none font-light"
                          ></textarea>
                        </div>
                      </div>

                      <button onClick={() => handleDeleteInstructor(inst.id)} className="absolute top-3 right-3 text-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 6. COMPETITIONS SECTION */}
          {activeSection === 'competitions' && (
            <div className="space-y-6">
              <form onSubmit={handleSaveCompMeta} className="space-y-4 text-xs sm:text-sm">
                <span className="block text-amber-500 font-bold uppercase tracking-wider text-xs pb-2 border-b border-slate-900 mb-4">Competitions Configuration</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold uppercase text-[10px]">Section Eyebrow Label</label>
                    <input type="text" name="eyebrow" defaultValue={websiteData.competitions.eyebrow} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold uppercase text-[10px]">Section Title Headline</label>
                    <input type="text" name="title" defaultValue={websiteData.competitions.title} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200" required />
                  </div>
                </div>
                <button type="submit" className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-lg text-xs uppercase shadow transition-all cursor-pointer">
                  <Save className="h-4 w-4" /> Save Titles
                </button>
              </form>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="block text-slate-400 font-bold uppercase tracking-wider text-[10px]">Competition Videos ({websiteData.competitions.items.length})</span>
                  <button onClick={handleAddCompVideo} className="flex items-center gap-1 text-amber-500 hover:text-white text-[10px] font-bold uppercase tracking-wider">
                    <Plus className="h-3 w-3 stroke-[3]" /> Add Competition Video
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {websiteData.competitions.items.map((item, idx) => (
                    <div key={item.id} className="bg-slate-950 p-4 border border-slate-900 rounded-xl space-y-3 relative group">
                      <div className="flex items-center justify-between border-b border-slate-900 pb-2 text-[10px] text-slate-500 font-bold">
                        <span>VIDEO SLOT #{idx + 1}</span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="space-y-0.5">
                          <label className="text-slate-500 text-[9px] uppercase font-bold">Competition Title</label>
                          <input 
                            type="text" 
                            value={item.title} 
                            onChange={(e) => handleUpdateCompVideo(item.id, 'title', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 font-bold" 
                          />
                        </div>
                        <div className="space-y-0.5">
                          <label className="text-slate-500 text-[9px] uppercase font-bold">Video Path/Filename (or Upload File)</label>
                          <input 
                            type="text" 
                            value={item.video} 
                            onChange={(e) => handleUpdateCompVideo(item.id, 'video', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 font-mono mb-2" 
                          />
                          <MediaUploader 
                            allowedTypes="video"
                            label="Upload Video"
                            helperText="Recommended: under 5MB — max 15MB"
                            onUpload={(base64) => {
                              handleUpdateCompVideo(item.id, 'video', base64);
                              triggerSuccess(`Uploaded video for ${item.title || 'competition'}!`);
                            }}
                          />
                        </div>
                      </div>

                      <button onClick={() => handleDeleteCompVideo(item.id)} className="absolute top-4 right-4 text-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 7. TESTIMONIALS SECTION */}
          {activeSection === 'testimonials' && (
            <div className="space-y-6">
              <form onSubmit={handleSaveTestMeta} className="space-y-4 text-xs sm:text-sm">
                <span className="block text-amber-500 font-bold uppercase tracking-wider text-xs pb-2 border-b border-slate-900 mb-4">Video Reviews Section Headers</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold uppercase text-[10px]">Section Eyebrow</label>
                    <input type="text" name="eyebrow" defaultValue={websiteData.testimonials.eyebrow} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold uppercase text-[10px]">Section Title Headline</label>
                    <input type="text" name="title" defaultValue={websiteData.testimonials.title} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200" required />
                  </div>
                </div>
                <button type="submit" className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-lg text-xs uppercase shadow transition-all cursor-pointer">
                  <Save className="h-4 w-4" /> Save Titles
                </button>
              </form>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="block text-slate-400 font-bold uppercase tracking-wider text-[10px]">Student video reviews ({websiteData.testimonials.items.length})</span>
                  <button onClick={handleAddTestimonialVideo} className="flex items-center gap-1 text-amber-500 hover:text-white text-[10px] font-bold uppercase tracking-wider">
                    <Plus className="h-3 w-3 stroke-[3]" /> Add Student Video
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {websiteData.testimonials.items.map((test, idx) => (
                    <div key={test.id} className="bg-slate-950 p-4 border border-slate-900 rounded-xl space-y-3 relative group">
                      <div className="flex items-center justify-between border-b border-slate-900 pb-2 text-[10px] text-slate-500 font-bold">
                        <span>REVIEW SLOT #{idx + 1}</span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="space-y-0.5">
                          <label className="text-slate-500 text-[9px] uppercase font-bold">Alumnus Name</label>
                          <input 
                            type="text" 
                            value={test.name} 
                            onChange={(e) => handleUpdateTestimonialVideo(test.id, 'name', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 font-bold" 
                          />
                        </div>
                        <div className="space-y-0.5">
                          <label className="text-slate-500 text-[9px] uppercase font-bold">Role / Outcome Description</label>
                          <input 
                            type="text" 
                            value={test.role} 
                            onChange={(e) => handleUpdateTestimonialVideo(test.id, 'role', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-amber-500 font-semibold" 
                          />
                        </div>
                        <div className="space-y-0.5">
                          <label className="text-slate-500 text-[9px] uppercase font-bold">Video Path/Filename (or Upload File)</label>
                          <input 
                            type="text" 
                            value={test.video} 
                            onChange={(e) => handleUpdateTestimonialVideo(test.id, 'video', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-300 font-mono mb-2" 
                          />
                          <MediaUploader 
                            allowedTypes="video"
                            label="Upload Video"
                            helperText="Recommended: under 5MB — max 15MB"
                            onUpload={(base64) => {
                              handleUpdateTestimonialVideo(test.id, 'video', base64);
                              triggerSuccess(`Uploaded video review for ${test.name || 'student'}!`);
                            }}
                          />
                        </div>
                      </div>

                      <button onClick={() => handleDeleteTestimonialVideo(test.id)} className="absolute top-4 right-4 text-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 8. FAQS SECTION */}
          {activeSection === 'faqs' && (
            <div className="space-y-6">
              <form onSubmit={handleSaveFaqMeta} className="space-y-4 text-xs sm:text-sm">
                <span className="block text-amber-500 font-bold uppercase tracking-wider text-xs pb-2 border-b border-slate-900 mb-4">FAQ Section Configuration</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold uppercase text-[10px]">Section Eyebrow</label>
                    <input type="text" name="eyebrow" defaultValue={websiteData.faqs.eyebrow} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold uppercase text-[10px]">Section Title Headline</label>
                    <input type="text" name="title" defaultValue={websiteData.faqs.title} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200" required />
                  </div>
                </div>
                <button type="submit" className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-lg text-xs uppercase shadow transition-all cursor-pointer">
                  <Save className="h-4 w-4" /> Save Titles
                </button>
              </form>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="block text-slate-400 font-bold uppercase tracking-wider text-[10px]">Custom FAQ Items ({websiteData.faqs.items.length})</span>
                  <button onClick={handleAddFaq} className="flex items-center gap-1 text-amber-500 hover:text-white text-[10px] font-bold uppercase tracking-wider">
                    <Plus className="h-3 w-3 stroke-[3]" /> Add FAQ Item
                  </button>
                </div>

                <div className="space-y-3">
                  {websiteData.faqs.items.map((faq, idx) => (
                    <div key={faq.id} className="bg-slate-950 p-4 border border-slate-900 rounded-xl space-y-2 relative group">
                      <div className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">FAQ Accordion #{idx + 1}</div>
                      
                      <div className="space-y-2 text-xs">
                        <input 
                          type="text" 
                          value={faq.q} 
                          onChange={(e) => handleUpdateFaq(idx, 'q', e.target.value)}
                          placeholder="FAQ Question..." 
                          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 font-bold" 
                        />
                        <textarea 
                          value={faq.a} 
                          onChange={(e) => handleUpdateFaq(idx, 'a', e.target.value)}
                          placeholder="FAQ Answer explanation paragraph..." 
                          rows={2} 
                          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-400 leading-relaxed resize-none"
                        ></textarea>
                      </div>

                      <button onClick={() => handleDeleteFaq(faq.id)} className="absolute top-4 right-4 text-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 9. FOOTER SECTION */}
          {activeSection === 'footer' && (
            <form onSubmit={handleSaveFooter} className="space-y-4 text-xs sm:text-sm">
              <span className="block text-amber-500 font-bold uppercase tracking-wider text-xs pb-2 border-b border-slate-900 mb-4">Footer Contact Details</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Contact Phone Number</label>
                  <input type="text" name="phone" defaultValue={websiteData.footer.phone} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200" required />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Contact Email Address</label>
                  <input type="email" name="email" defaultValue={websiteData.footer.email} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200" required />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase text-[10px]">Physical Academy Address</label>
                <input type="text" name="address" defaultValue={websiteData.footer.address} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200" required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">WhatsApp Phone Link</label>
                  <input type="text" name="whatsapp" defaultValue={websiteData.footer.whatsapp} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200" required />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Facebook Link URL</label>
                  <input type="url" name="facebook" defaultValue={websiteData.footer.facebook} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200" required />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Instagram Link URL</label>
                  <input type="url" name="instagram" defaultValue={websiteData.footer.instagram} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200" required />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase text-[10px]">Google Maps Embed URL (iframe src only)</label>
                <textarea name="mapUrl" defaultValue={websiteData.footer.mapUrl} rows={2} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono text-xs resize-none" required></textarea>
              </div>

              <button type="submit" className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-lg text-xs uppercase shadow transition-all cursor-pointer">
                <Save className="h-4 w-4" /> Save Contact Settings
              </button>
            </form>
          )}

        </div>

      </div>

    </div>
  );
}
