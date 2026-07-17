import React from 'react';
import { ChefHat, GraduationCap, Trophy, Globe, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function About() {
  const stats = [
    { value: '1200+', label: 'Successful Graduates' },
    { value: '100%', label: 'Practical Hands-on' },
    { value: '10+', label: 'Industry Expert Chefs' },
    { value: '5+', label: 'Recognized Programs' }
  ];

  return (
    <section id="about" className="py-24 bg-slate-950 text-white relative overflow-hidden">
      {/* Decorative background vectors */}
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Images Grid Column (Modern Bento Style representation) */}
          <div className="relative order-2 lg:order-1">
            <div className="grid grid-cols-12 gap-4">
              
              {/* Main big image */}
              <div className="col-span-8 overflow-hidden rounded-2xl border border-slate-800 shadow-2xl relative group">
                <img
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=600"
                  alt="Our Chefs"
                  className="w-full h-80 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
              </div>

              {/* Smaller secondary image */}
              <div className="col-span-4 overflow-hidden rounded-2xl border border-slate-800 shadow-2xl self-end relative group">
                <img
                  src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=400"
                  alt="Wok Cooking"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
              </div>

              {/* Third image bottom left */}
              <div className="col-span-5 overflow-hidden rounded-2xl border border-slate-800 shadow-2xl relative group">
                <img
                  src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=400"
                  alt="Bakery Preparation"
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
              </div>

              {/* Fourth image bottom right */}
              <div className="col-span-7 overflow-hidden rounded-2xl border border-slate-800 shadow-2xl relative group">
                <img
                  src="https://images.unsplash.com/photo-1535141192574-5d4897c13636?auto=format&fit=crop&q=80&w=500"
                  alt="Cake Decoration"
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
              </div>

            </div>

            {/* Experience Card Overlaid */}
            <div className="absolute -bottom-6 -right-6 md:right-12 bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 p-6 rounded-2xl shadow-xl border border-amber-400/20 max-w-xs">
              <div className="flex items-center space-x-3">
                <Trophy className="h-8 w-8 stroke-[2]" />
                <div>
                  <span className="block font-sans font-bold text-2xl">KPK’s #1</span>
                  <span className="block font-sans text-xs font-semibold uppercase tracking-wider">Culinary Institute</span>
                </div>
              </div>
            </div>
          </div>

          {/* Text Story Column */}
          <div className="space-y-8 order-1 lg:order-2">
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-amber-500">
                <Sparkles className="h-5 w-5" />
                <span className="text-xs font-sans font-bold uppercase tracking-[0.2em]">Our Story</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                Where Culinary Passion <br />
                <span className="text-amber-400">Meets Professional Craft</span>
              </h2>
            </div>

            <div className="space-y-4 font-sans text-slate-300 leading-relaxed text-sm sm:text-base">
              <p>
                Established in Peshawar, <strong className="text-amber-400">The Chef's Academy</strong> was founded with a singular, high-impact vision: to bridge the gap between passion and professional success in the culinary and baking industry of Pakistan.
              </p>
              <p>
                We do not believe in theoretical handouts or textbook lectures. Our core training methodology is <strong className="text-white">100% Practical and Hands-On</strong>. Every student is allocated their own dedicated workstation in our state-of-the-art commercial-grade kitchen lab, working directly with premium ingredients, tools, and industrial machinery.
              </p>
              <p>
                Our curriculum aligns with national and international occupational standards. Under the personal, step-by-step guidance of our accomplished Executive Chefs, our students master the technical foundation, speed, discipline, and creative plating required to shine globally.
              </p>
            </div>

            {/* Value Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex space-x-3 items-start">
                <div className="p-1 rounded-md bg-amber-500/10 text-amber-400 mt-1">
                  <ChefHat className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-sans font-semibold text-white block text-sm sm:text-base">Expert Mentors</span>
                  <span className="font-sans text-xs text-slate-400 block leading-normal">Learn from industry leading hotel & pastry chefs.</span>
                </div>
              </div>

              <div className="flex space-x-3 items-start">
                <div className="p-1 rounded-md bg-amber-500/10 text-amber-400 mt-1">
                  <Globe className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-sans font-semibold text-white block text-sm sm:text-base">Global Standards</span>
                  <span className="font-sans text-xs text-slate-400 block leading-normal">Modern cooking techniques based on international hospitality standards.</span>
                </div>
              </div>
            </div>

            {/* Stats Counter */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-slate-900">
              {stats.map((stat, i) => (
                <div key={i} className="text-center sm:text-left">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-amber-400 block">
                    {stat.value}
                  </span>
                  <span className="font-sans text-xs text-slate-400 block mt-1 leading-normal">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
