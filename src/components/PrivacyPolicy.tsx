import React, { useEffect } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { Shield, Lock, Eye, Server, RefreshCw } from 'lucide-react';

export default function PrivacyPolicy() {
  const { websiteData } = useAcademy();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="bg-[#FBF9F1] min-h-screen text-[#13283F] font-sans pt-24 pb-20 selection:bg-[#AE8C45] selection:text-white">
      {/* Header section */}
      <div className="max-w-4xl mx-auto px-6 mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-8 w-8 text-[#AE8C45]" />
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#13283F]">Privacy Policy</h1>
        </div>
        <div className="w-20 h-1.5 bg-[#AE8C45] rounded-full mb-6"></div>
        <p className="text-[#5F6772] text-lg leading-relaxed">
          At The Chef's Academy, we respect your privacy and are committed to protecting your personal data. 
          This privacy policy will inform you as to how we look after your personal data when you visit our website 
          or enroll in our courses, and tell you about your privacy rights.
        </p>
        <p className="text-sm font-semibold text-[#8F7236] mt-4 uppercase tracking-wider">
          Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white border border-[#E7E1CF] rounded-2xl shadow-sm p-8 sm:p-10 space-y-12">
          
          {/* Section 1 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#F7F2DE] p-2.5 rounded-lg border border-[#E7E1CF]">
                <Eye className="h-5 w-5 text-[#8F7236]" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#13283F]">1. Information We Collect</h2>
            </div>
            <p className="text-[#5F6772] leading-relaxed text-sm sm:text-base">
              When you interact with our website, apply for courses, or communicate with our admissions department, we may collect various types of personal information, including but not limited to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#5F6772] text-sm sm:text-base">
              <li><strong className="text-[#13283F] font-semibold">Identity Data:</strong> First name, last name, date of birth, CNIC/B-Form number.</li>
              <li><strong className="text-[#13283F] font-semibold">Contact Data:</strong> Email address, physical address, and telephone numbers.</li>
              <li><strong className="text-[#13283F] font-semibold">Financial Data:</strong> Fee payment records, bank transfer references, and receipt details (we do not store raw credit card information).</li>
              <li><strong className="text-[#13283F] font-semibold">Academic Data:</strong> Previous qualifications, educational background, and course preferences.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#F7F2DE] p-2.5 rounded-lg border border-[#E7E1CF]">
                <Server className="h-5 w-5 text-[#8F7236]" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#13283F]">2. How We Use Your Data</h2>
            </div>
            <p className="text-[#5F6772] leading-relaxed text-sm sm:text-base">
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#5F6772] text-sm sm:text-base">
              <li>To process your admission applications and enroll you in requested courses.</li>
              <li>To manage our relationship with you, including notifying you about course schedules, policy changes, and fees.</li>
              <li>To administer and protect our business and website (including troubleshooting, data analysis, and system maintenance).</li>
              <li>To deliver relevant academy updates, newsletters, and promotional content if you have opted in.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#F7F2DE] p-2.5 rounded-lg border border-[#E7E1CF]">
                <Lock className="h-5 w-5 text-[#8F7236]" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#13283F]">3. Data Security & Protection</h2>
            </div>
            <p className="text-[#5F6772] leading-relaxed text-sm sm:text-base">
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. Access to your personal data is restricted to employees, contractors, and agents who have a business need to know. They will only process your personal data on our instructions and are subject to a duty of confidentiality.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#F7F2DE] p-2.5 rounded-lg border border-[#E7E1CF]">
                <RefreshCw className="h-5 w-5 text-[#8F7236]" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#13283F]">4. Data Retention</h2>
            </div>
            <p className="text-[#5F6772] leading-relaxed text-sm sm:text-base">
              We will only retain your personal data for as long as reasonably necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting, or reporting requirements. For enrolled students, data is retained indefinitely as part of our permanent academic records (transcripts, certifications).
            </p>
          </section>
          
          {/* Section 5 (Contact) */}
          <section className="pt-8 mt-8 border-t border-[#E7E1CF]">
            <h2 className="text-2xl font-serif font-bold text-[#13283F] mb-4">5. Contact Us</h2>
            <p className="text-[#5F6772] leading-relaxed text-sm sm:text-base mb-6">
              If you have any questions about this privacy policy or our privacy practices, please contact our admissions and administrative department.
            </p>
            
            <div className="bg-[#F7F2DE] p-6 rounded-xl border border-[#E7E1CF] inline-block">
              <h3 className="font-bold text-[#13283F] font-serif mb-3">The Chef's Academy</h3>
              <ul className="text-sm text-[#5F6772] space-y-2">
                <li><strong className="text-[#13283F]">Email:</strong> {websiteData?.footer?.email || "info@thechefsacademy.pk"}</li>
                <li><strong className="text-[#13283F]">Phone:</strong> {websiteData?.footer?.phone || "+92 328 8888907"}</li>
                <li><strong className="text-[#13283F]">Address:</strong> {websiteData?.footer?.address || "79-B3 Gulberg III, Lahore, Pakistan"}</li>
              </ul>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
