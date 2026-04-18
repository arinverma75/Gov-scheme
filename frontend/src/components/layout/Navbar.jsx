import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Search, CheckSquare, FileText, BarChart3, Menu, X, Bell, ChevronDown } from 'lucide-react';

const navLinks = [
  { path: '/schemes', label: 'Explore Schemes', icon: Search },
  { path: '/eligibility', label: 'Check Eligibility', icon: CheckSquare },
  { path: '/scanner', label: 'Document Scanner', icon: FileText },
  { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm" style={{ borderBottom: '1px solid rgba(193, 199, 207, 0.3)' }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-between h-[64px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#1b4f72' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6"/>
              </svg>
            </div>
            <span className="font-semibold text-[15px]" style={{ fontFamily: 'Manrope, sans-serif', color: '#191c1e' }}>
              GovScheme
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="px-3.5 py-2 rounded-md text-[13px] font-medium transition-colors"
                  style={{
                    color: active ? '#003857' : '#41474e',
                    background: active ? '#f2f4f6' : 'transparent',
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Link to="/eligibility" className="hidden md:inline-flex btn-saffron text-[13px] py-2 px-5">
              Get Started
            </Link>
            <button className="relative p-2 rounded-md transition-colors hover:bg-surface-low" style={{ color: '#41474e' }}>
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: '#944a00' }}></span>
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-md"
              style={{ color: '#41474e' }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-white" style={{ borderTop: '1px solid rgba(193, 199, 207, 0.3)' }}>
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(link => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 rounded-lg text-[14px] font-medium"
                  style={{
                    color: active ? '#003857' : '#41474e',
                    background: active ? '#f2f4f6' : 'transparent',
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2">
              <Link to="/eligibility" onClick={() => setMobileOpen(false)} className="btn-saffron w-full text-[14px] py-2.5">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
