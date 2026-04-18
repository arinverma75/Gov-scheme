import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Check, Calendar, ChevronRight } from 'lucide-react';
import { schemesAPI } from '../services/api';

export default function SchemeDetails() {
  const { id } = useParams();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    schemesAPI.getById(id).then(d => d.success && setScheme(d.scheme)).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20"><div className="spinner"></div></div>;
  if (!scheme) return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-20 px-4 text-center">
      <p className="text-[16px] mb-4" style={{ color: '#72787f' }}>Scheme not found</p>
      <Link to="/schemes" className="text-[13px] font-semibold flex items-center gap-1" style={{ color: '#003857' }}><ArrowLeft size={14} /> Back to schemes</Link>
    </div>
  );

  const e = scheme.eligibility;

  return (
    <div className="min-h-screen pt-[80px] pb-16 px-6" style={{ background: '#f8f9fb' }}>
      <div className="max-w-[960px] mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] mb-6" style={{ color: '#72787f' }}>
          <Link to="/" className="hover:underline">Home</Link><span>/</span>
          <Link to="/schemes" className="hover:underline">Schemes</Link><span>/</span>
          <span style={{ color: '#191c1e' }}>{scheme.name}</span>
        </div>

        {/* Header */}
        <div className="card bg-white mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="label-stamp">{scheme.category}</span>
            <span className="badge badge-active">Active</span>
          </div>
          <h1 className="text-[1.5rem] font-bold mb-1" style={{ fontFamily: 'Manrope', color: '#191c1e' }}>{scheme.name}</h1>
          {scheme.nameHindi && <p className="text-[14px] mb-2" style={{ color: '#a0a5ab' }}>{scheme.nameHindi}</p>}
          <p className="text-[13px] mb-5" style={{ color: '#72787f' }}>{scheme.ministry}</p>
          <div className="flex flex-wrap gap-3">
            <a href={scheme.officialLink} target="_blank" rel="noopener noreferrer" className="btn-primary text-[13px]">
              <ExternalLink size={14} /> Official Website
            </a>
            <Link to="/scanner" className="btn-outline text-[13px]">Scan Documents</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-5">
            <div className="card bg-white">
              <h2 className="text-[15px] font-bold mb-3" style={{ fontFamily: 'Manrope', color: '#191c1e' }}>About This Scheme</h2>
              <p className="text-[14px] leading-relaxed" style={{ color: '#41474e' }}>{scheme.description}</p>
              {scheme.descriptionHindi && <p className="text-[13px] leading-relaxed mt-3 italic" style={{ color: '#a0a5ab' }}>{scheme.descriptionHindi}</p>}
            </div>

            <div className="card" style={{ background: '#e8f5e9' }}>
              <h2 className="text-[15px] font-bold mb-2" style={{ fontFamily: 'Manrope', color: '#1a7a3a' }}>Benefits</h2>
              <p className="text-[14px] leading-relaxed" style={{ color: '#191c1e' }}>{scheme.benefits}</p>
            </div>

            <div className="card bg-white">
              <h2 className="text-[15px] font-bold mb-4" style={{ fontFamily: 'Manrope', color: '#191c1e' }}>How to Apply</h2>
              <div className="space-y-3">
                {scheme.applicationProcess.split('\n').map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold" style={{ background: '#f2f4f6', color: '#003857' }}>{i + 1}</div>
                    <p className="text-[13px] leading-relaxed" style={{ color: '#41474e' }}>{step.replace(/^\d+\.\s*/, '')}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card bg-white">
              <h2 className="text-[15px] font-bold mb-4" style={{ fontFamily: 'Manrope', color: '#191c1e' }}>Required Documents</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {scheme.requiredDocuments.map((doc, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-3 rounded-lg" style={{ background: '#f8f9fb' }}>
                    <Check size={14} style={{ color: '#1a7a3a' }} />
                    <span className="text-[13px]" style={{ color: '#41474e' }}>{doc}</span>
                  </div>
                ))}
              </div>
              <Link to="/scanner" className="inline-flex items-center gap-1 mt-4 text-[13px] font-semibold" style={{ color: '#003857' }}>
                Scan your documents <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="card bg-white">
              <h3 className="text-[14px] font-bold mb-4" style={{ fontFamily: 'Manrope', color: '#191c1e' }}>Eligibility Criteria</h3>
              <div className="space-y-3 text-[13px]">
                {[
                  ['Age', `${e.minAge} – ${e.maxAge} years`],
                  ['Max Income', `₹${(e.maxIncome / 100000).toFixed(1)}L/year`],
                  ['Gender', e.gender.join(', ')],
                  ['Category', e.caste.join(', ')],
                  ['States', e.states.join(', ')],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span style={{ color: '#72787f' }}>{k}</span>
                    <span className="text-right font-medium" style={{ color: '#191c1e' }}>{v}</span>
                  </div>
                ))}
                {e.isRural && <div className="flex justify-between"><span style={{ color: '#72787f' }}>Area</span><span className="font-medium" style={{ color: '#7c5800' }}>Rural Only</span></div>}
                {e.isBPL && <div className="flex justify-between"><span style={{ color: '#72787f' }}>BPL</span><span className="font-medium" style={{ color: '#7c5800' }}>Required</span></div>}
              </div>
              <Link to="/eligibility" className="btn-outline w-full text-[12px] mt-5 py-2">Check Your Eligibility</Link>
            </div>

            {scheme.deadline && (
              <div className="card" style={{ background: '#fff3e0' }}>
                <div className="flex items-center gap-2 text-[13px] font-semibold" style={{ color: '#7c5800' }}>
                  <Calendar size={14} />
                  Deadline: {new Date(scheme.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            )}

            <div className="card bg-white">
              <h3 className="label-stamp mb-3">Tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {scheme.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded text-[11px] font-medium" style={{ background: '#f2f4f6', color: '#72787f' }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
