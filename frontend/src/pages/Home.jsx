import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Mic, FileText, MapPin, BarChart3, Shield, ChevronRight } from 'lucide-react';
import { schemesAPI } from '../services/api';

const features = [
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
    title: 'AI-Powered Recommendations',
    desc: 'Answer a few questions about yourself and our matching engine will score you against 50+ government schemes, ranking the most relevant ones first.',
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>,
    title: 'Voice Assistant in Hindi',
    desc: 'Speak your questions in Hindi or English. Our voice assistant uses browser-native speech recognition — no data leaves your device.',
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/></svg>,
    title: 'Document Scanner with OCR',
    desc: 'Upload your Aadhaar, PAN card, or income certificate. Our OCR extracts text and auto-fills application forms — all processed locally in your browser.',
  },
];

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    schemesAPI.getCategories().then(data => {
      if (data.success) setCategories(data.categories);
    }).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/schemes?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#f8f9fb' }}>
      {/* Hero Section */}
      <section className="pb-20 px-6" style={{ paddingTop: '140px' }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left — Content */}
            <div>
              <p className="label-stamp mb-4" style={{ color: '#944a00' }}>
                GOVERNMENT SCHEME AWARENESS PLATFORM
              </p>
              <h1 className="text-[2.75rem] lg:text-[3.5rem] leading-[1.08] font-extrabold mb-6" style={{ fontFamily: 'Manrope, sans-serif', color: '#191c1e' }}>
                Every Indian Deserves to Know Their Government Benefits
              </h1>
              <p className="text-[1.0625rem] leading-relaxed mb-8 max-w-[540px]" style={{ color: '#41474e' }}>
                Discover, understand, and apply for 50+ government schemes with AI-powered recommendations and voice assistance in Hindi &amp; English.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <Link to="/eligibility" className="btn-saffron">
                  Check Your Eligibility
                  <ArrowRight size={16} />
                </Link>
                <Link to="/schemes" className="btn-outline">
                  Explore All Schemes
                </Link>
              </div>

              {/* Search */}
              <form onSubmit={handleSearch} className="max-w-[480px]">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white" style={{ border: '1.5px solid rgba(193, 199, 207, 0.4)' }}>
                  <Search size={16} style={{ color: '#72787f' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search schemes (e.g., PM Kisan, scholarship)"
                    className="flex-1 bg-transparent text-[14px] outline-none"
                    style={{ color: '#191c1e' }}
                  />
                </div>
              </form>
            </div>

            {/* Right — Illustration area */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="w-full max-w-[480px] aspect-square rounded-2xl flex items-center justify-center" style={{ background: '#f2f4f6' }}>
                <div className="text-center px-8">
                  <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#1b4f72" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-6 opacity-40">
                    <path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6"/>
                    <path d="M9 10h1"/><path d="M14 10h1"/>
                  </svg>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 rounded-xl bg-white">
                      <p className="text-2xl font-bold" style={{ fontFamily: 'Manrope', color: '#003857' }}>50+</p>
                      <p className="text-xs mt-1" style={{ color: '#72787f' }}>Schemes</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white">
                      <p className="text-2xl font-bold" style={{ fontFamily: 'Manrope', color: '#003857' }}>28</p>
                      <p className="text-xs mt-1" style={{ color: '#72787f' }}>States</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white">
                      <p className="text-2xl font-bold" style={{ fontFamily: 'Manrope', color: '#003857' }}>18</p>
                      <p className="text-xs mt-1" style={{ color: '#72787f' }}>Categories</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white">
                      <p className="text-2xl font-bold" style={{ fontFamily: 'Manrope', color: '#944a00' }}>Free</p>
                      <p className="text-xs mt-1" style={{ color: '#72787f' }}>Always</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-4 px-6" style={{ background: '#f2f4f6' }}>
        <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-center gap-6 md:gap-12">
          {['50+ Government Schemes', '28 States Covered', '18 Categories', 'Hindi & English', '100% Free'].map((item, i) => (
            <span key={i} className="text-[13px] font-medium" style={{ color: '#72787f' }}>{item}</span>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6" style={{ background: '#ffffff' }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-14">
            <p className="label-stamp mb-2" style={{ color: '#944a00' }}>HOW IT WORKS</p>
            <h2 className="text-[2rem] font-bold" style={{ fontFamily: 'Manrope', color: '#191c1e' }}>
              How GovScheme Helps You
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="card group cursor-default" style={{ background: '#f8f9fb' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: '#e6eef5', color: '#1b4f72' }}>
                  {feature.icon}
                </div>
                <h3 className="text-[1.0625rem] font-bold mb-2" style={{ fontFamily: 'Manrope', color: '#191c1e' }}>
                  {feature.title}
                </h3>
                <p className="text-[0.875rem] leading-relaxed" style={{ color: '#41474e' }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-6" style={{ background: '#f8f9fb' }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="label-stamp mb-2" style={{ color: '#72787f' }}>BROWSE BY CATEGORY</p>
              <h2 className="text-[1.75rem] font-bold" style={{ fontFamily: 'Manrope', color: '#191c1e' }}>
                {categories.length} Categories of Schemes
              </h2>
            </div>
            <Link to="/schemes" className="hidden md:flex items-center gap-1 text-[13px] font-semibold" style={{ color: '#003857' }}>
              View All <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {categories.map((cat, i) => (
              <Link
                key={i}
                to={`/schemes?category=${encodeURIComponent(cat.name)}`}
                className="card text-center group py-5 px-3"
              >
                <p className="text-[14px] font-semibold mb-1 group-hover:text-navy-600 transition-colors" style={{ color: '#191c1e' }}>
                  {cat.name}
                </p>
                <p className="text-[12px]" style={{ color: '#72787f' }}>
                  {cat.count} {cat.count === 1 ? 'scheme' : 'schemes'}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-6" style={{ background: '#ffffff' }}>
        <div className="max-w-[800px] mx-auto">
          <div className="text-center mb-14">
            <p className="label-stamp mb-2" style={{ color: '#944a00' }}>SIMPLE PROCESS</p>
            <h2 className="text-[1.75rem] font-bold" style={{ fontFamily: 'Manrope', color: '#191c1e' }}>
              Three Steps to Your Benefits
            </h2>
          </div>

          <div className="space-y-8">
            {[
              { num: '01', title: 'Share Your Details', desc: 'Enter basic information — age, income, state, occupation. We never store your data without consent.' },
              { num: '02', title: 'Get Matched Instantly', desc: 'Our AI engine scores your profile against 50+ schemes and shows the strongest matches with explanations.' },
              { num: '03', title: 'Apply with Guidance', desc: 'View step-by-step instructions, required documents, and use our scanner to auto-fill application forms.' },
            ].map((step, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-[15px] font-bold" style={{ background: '#f2f4f6', color: '#003857', fontFamily: 'Manrope' }}>
                  {step.num}
                </div>
                <div>
                  <h3 className="text-[1rem] font-bold mb-1" style={{ fontFamily: 'Manrope', color: '#191c1e' }}>
                    {step.title}
                  </h3>
                  <p className="text-[0.875rem]" style={{ color: '#41474e' }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6" style={{ background: '#f2f4f6' }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: '#1b4f72' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6"/>
                </svg>
              </div>
              <span className="text-[14px] font-semibold" style={{ fontFamily: 'Manrope', color: '#191c1e' }}>GovScheme</span>
            </div>
            <p className="text-[13px]" style={{ color: '#72787f' }}>
              Built for Digital India — Empowering citizens with knowledge of their rights and benefits.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
