import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { Course } from '../types';
import { BookOpen, Clock, Users, ArrowRight, X, BadgePercent, CheckCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CourseCatalog() {
  const { courses, setSection, addAdmission, coursePlans } = useAcademy();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const categories = ['All', 'Diploma', 'Baking', 'Fast Food', 'Short Course'];

  const filteredCourses = selectedCategory === 'All'
    ? courses
    : courses.filter(c => c.category.toLowerCase() === selectedCategory.toLowerCase() || (selectedCategory === 'Short Course' && c.category === 'Short Course'));

  const handleApplyClick = (courseId: string) => {
    setSelectedCourse(null);
    setSection('admission');
    // Pre-select course in the form (form will listen to this event or we can handle it globally/locally)
    const selectElem = document.getElementById('selectedCourseId') as HTMLSelectElement;
    if (selectElem) {
      selectElem.value = courseId;
      // trigger change event manually so state updates
      const event = new Event('change', { bubbles: true });
      selectElem.dispatchEvent(event);
    }
  };

  return (
    <section id="courses" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="flex items-center justify-center space-x-2 text-amber-500">
            <BookOpen className="h-5 w-5" />
            <span className="text-xs font-sans font-bold uppercase tracking-[0.2em]">Our Programs</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Professional Culinary Certifications <br />
            <span className="text-amber-400">& Short Courses</span>
          </h2>
          <p className="font-sans text-slate-400 text-sm sm:text-base leading-relaxed">
            All programs are strictly structured to focus on extensive, real-world practical preparation. Pick the culinary path that fits your future ambitions.
          </p>
        </div>

        {/* Filter Categories Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 border-b border-slate-800 pb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full font-sans text-xs sm:text-sm font-semibold tracking-wide uppercase transition-all duration-300 border ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-lg shadow-amber-500/10 scale-105'
                  : 'bg-slate-950 text-slate-400 border-slate-800/80 hover:border-amber-500/30 hover:text-amber-400'
              }`}
            >
              {cat === 'All' ? 'All Classes' : cat}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16 bg-slate-950/40 rounded-2xl border border-slate-800">
            <p className="text-slate-500 font-sans">No courses found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <motion.div
                key={course.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800/80 hover:border-amber-500/30 group shadow-lg flex flex-col h-full"
              >
                
                {/* Course Image Wrapper */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                  
                  {/* Category Tag */}
                  <span className="absolute top-4 left-4 bg-slate-950/90 text-amber-400 text-[10px] font-sans font-bold uppercase tracking-wider px-3 py-1.5 rounded-md border border-amber-500/20">
                    {course.category}
                  </span>

                  {/* Seat Availability Warning badge */}
                  {course.seatsAvailable <= 10 && course.seatsAvailable > 0 && (
                    <span className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-sans font-bold uppercase tracking-wider px-3 py-1.5 rounded-md animate-pulse">
                      Only {course.seatsAvailable} Seats Left
                    </span>
                  )}
                  {course.seatsAvailable === 0 && (
                    <span className="absolute top-4 right-4 bg-slate-800 text-slate-400 text-[10px] font-sans font-bold uppercase tracking-wider px-3 py-1.5 rounded-md">
                      Batch Full
                    </span>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-amber-500 font-medium">
                      <div className="flex items-center space-x-1">
                        <Users className="h-3.5 w-3.5" />
                        <span>Seats: {course.totalSeats}</span>
                      </div>
                    </div>

                    </div>

                    {/* Determine the fee from global coursePlans if available, else fallback to course.fees */}
                    {(() => {
                      const plan = (coursePlans && coursePlans[course.title] && coursePlans[course.title][0]) || null;
                      const displayFee = plan ? plan.fee : course.fees;
                      const displayRegFee = plan ? plan.regFee : course.registrationFee;
                      
                      return (
                        <>
                          <h3 className="font-serif text-xl font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors duration-200">
                            {course.title}
                          </h3>

                          <p className="font-sans text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-3">
                            {course.description}
                          </p>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-900">
                          {/* Price Tag */}
                          <div className="flex items-baseline justify-between">
                            <span className="text-slate-500 text-xs font-sans uppercase tracking-wider">Course Fees</span>
                            <div className="text-right">
                              <span className="text-2xl font-serif font-bold text-white">PKR {displayFee.toLocaleString()}</span>
                              <span className="block text-[10px] text-slate-400 mt-0.5">+{displayRegFee.toLocaleString()} Reg. Fee</span>
                            </div>
                          </div>
                        </>
                      );
                    })()}

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setSelectedCourse(course)}
                        className="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-3 rounded-xl font-sans text-xs font-semibold uppercase tracking-wider border border-slate-800 hover:border-slate-700 transition-all duration-200"
                      >
                        Syllabus
                      </button>
                      <button
                        onClick={() => handleApplyClick(course.id)}
                        disabled={course.seatsAvailable === 0}
                        className={`px-3 py-3 rounded-xl font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all duration-200 ${
                          course.seatsAvailable === 0
                            ? 'bg-slate-800 text-slate-500 border border-slate-800 cursor-not-allowed'
                            : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/10 hover:brightness-110'
                        }`}
                      >
                        <span>Apply</span>
                        <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                      </button>
                    </div>

                  </div>

                </div>

              </motion.div>
            ))}
          </div>
        )}

      </div>

      {/* Course Detailed Syllabus Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
            {/* Modal Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCourse(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            ></motion.div>

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl"
            >
              
              {/* Image banner */}
              <div className="relative h-48 sm:h-56 flex-shrink-0">
                <img
                  src={selectedCourse.image}
                  alt={selectedCourse.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="absolute top-4 right-4 bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white p-2 rounded-full border border-slate-800 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="absolute bottom-4 left-6">
                  <span className="bg-amber-500 text-slate-950 text-[10px] font-sans font-bold uppercase tracking-wider px-3 py-1 rounded-md">
                    {selectedCourse.category}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white mt-2">
                    {selectedCourse.title}
                  </h3>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-slate-900">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-sans text-slate-500 tracking-wider">Instructor</span>
                    <span className="block text-slate-200 text-sm font-semibold">{selectedCourse.instructor}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-sans text-slate-500 tracking-wider">Class Timings</span>
                    <div className="space-y-0.5">
                      {selectedCourse.shifts.map((s, idx) => (
                        <span key={idx} className="block text-amber-400 text-xs">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-serif text-base font-bold text-amber-400">Course Overview</h4>
                  <p className="font-sans text-slate-300 text-sm leading-relaxed">
                    {selectedCourse.description}
                  </p>
                </div>

                {/* Practical Syllabus Steps */}
                <div className="space-y-3">
                  <h4 className="font-serif text-base font-bold text-amber-400">Curriculum & Syllabus (100% Practical Modules)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedCourse.syllabus.map((item, index) => (
                      <div key={index} className="flex items-start space-x-2 bg-slate-900/50 p-3 rounded-lg border border-slate-900">
                        <CheckCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span className="font-sans text-slate-300 text-xs sm:text-sm leading-normal">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fees and Registration Breakdown */}
                <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-4">
                  <div className="flex items-center space-x-2 text-amber-500">
                    <BadgePercent className="h-5 w-5" />
                    <span className="text-xs font-sans font-bold uppercase tracking-wider">Fees & Cost Structure</span>
                  </div>
                  
                  {(() => {
                    const selectedPlan = (coursePlans && coursePlans[selectedCourse.title] && coursePlans[selectedCourse.title][0]) || null;
                    const selDisplayFee = selectedPlan ? selectedPlan.fee : selectedCourse.fees;
                    const selDisplayRegFee = selectedPlan ? selectedPlan.regFee : selectedCourse.registrationFee;
                    
                    return (
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                        <div>
                          <span className="text-slate-500 text-[10px] font-sans uppercase tracking-wider block">Registration Fee</span>
                          <span className="text-white block font-semibold mt-0.5">PKR {selDisplayRegFee.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] font-sans uppercase tracking-wider block">Tuition Fee</span>
                          <span className="text-white block font-semibold mt-0.5">PKR {selDisplayFee.toLocaleString()}</span>
                        </div>
                        <div className="col-span-2 pt-2 border-t border-slate-800">
                          <span className="text-slate-400 text-[10px] font-sans uppercase tracking-wider block">Total Required Enrollment Fee</span>
                          <span className="text-amber-400 block font-bold text-base mt-0.5">PKR {(selDisplayFee + selDisplayRegFee).toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })()}
                  
                  <div className="text-[11px] text-slate-400 italic">
                    * The registration fee is paid at the time of admission form submission to secure the seat. The tuition fee is paid in full or monthly installments.
                  </div>
                </div>

              </div>

              {/* Sticky Footer */}
              <div className="p-4 bg-slate-900/60 border-t border-slate-800/80 flex items-center justify-between flex-shrink-0">
                <span className="text-xs text-slate-400 font-sans">
                  Available Seats: <strong className="text-white">{selectedCourse.seatsAvailable}</strong> / {selectedCourse.totalSeats}
                </span>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="px-4 py-2.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 text-xs font-semibold uppercase tracking-wider font-sans transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleApplyClick(selectedCourse.id)}
                    disabled={selectedCourse.seatsAvailable === 0}
                    className={`px-5 py-2.5 rounded-lg font-sans text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                      selectedCourse.seatsAvailable === 0
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/10'
                    }`}
                  >
                    Apply & Secure Seat
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
