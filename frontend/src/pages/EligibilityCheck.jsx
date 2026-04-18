import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Loader, Check, X, Filter } from 'lucide-react';
import { recommendAPI, schemesAPI } from '../services/api';

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi'];

export default function EligibilityCheck() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [profile, setProfile] = useState({ age:'', income:'', gender:'', caste:'', occupation:'', education:'', state:'', isRural:false, isBPL:false });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');

  // Load categories for the filter chips
  useEffect(() => {
    schemesAPI.getCategories().then(data => {
      if (data.success) setCategories(data.categories);
    }).catch(() => {});
  }, []);

  // Sync category with URL params
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const update = (k,v) => setProfile(p => ({...p, [k]: v}));

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat) {
      setSearchParams({ category: cat });
    } else {
      setSearchParams({});
    }
    // Re-run eligibility if we already have results
    if (results) {
      runEligibility(cat);
    }
  };

  const runEligibility = async (categoryOverride) => {
    setLoading(true);
    try {
      const clean = { ...profile, age: profile.age ? parseInt(profile.age) : undefined, income: profile.income ? parseInt(profile.income) : undefined };
      Object.keys(clean).forEach(k => { if (clean[k] === '' || clean[k] === undefined) delete clean[k]; });
      
      // Add category filter if selected
      const category = categoryOverride !== undefined ? categoryOverride : selectedCategory;
      if (category) {
        clean.category = category;
      }
      
      const data = await recommendAPI.getRecommendations(clean);
      setResults(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await runEligibility();
  };

  return (
    <div className="min-h-screen pb-16 px-6" style={{ background: '#f8f9fb', paddingTop: '100px' }}>
      <div className="max-w-[1200px] mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] mb-6" style={{ color: '#72787f' }}>
          <Link to="/" className="hover:underline">Home</Link><span>/</span>
          {selectedCategory && (
            <>
              <Link to="/schemes" className="hover:underline">Schemes</Link><span>/</span>
              <Link to={`/schemes?category=${encodeURIComponent(selectedCategory)}`} className="hover:underline">{selectedCategory}</Link><span>/</span>
            </>
          )}
          <span style={{ color: '#191c1e' }}>Check Eligibility</span>
        </div>

        <div className="mb-6">
          <h1 className="text-[1.75rem] font-bold mb-1" style={{ fontFamily: 'Manrope', color: '#191c1e' }}>Check Your Eligibility</h1>
          <p className="text-[14px]" style={{ color: '#41474e' }}>
            {selectedCategory 
              ? `Checking eligibility for ${selectedCategory} schemes. Fill your details below.`
              : "Answer a few questions and we'll find the right government schemes for you."
            }
          </p>
        </div>

        {/* Category Filter Chips */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Filter size={14} style={{ color: '#72787f' }} />
            <span className="text-[12px] font-medium" style={{ color: '#72787f' }}>Filter by category:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange('')}
              className="px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors"
              style={{
                background: !selectedCategory ? '#003857' : '#f2f4f6',
                color: !selectedCategory ? '#fff' : '#41474e'
              }}
            >
              All Categories
            </button>
            {categories.map(cat => (
              <button
                key={cat.name}
                onClick={() => handleCategoryChange(cat.name)}
                className="px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors"
                style={{
                  background: selectedCategory === cat.name ? '#003857' : '#f2f4f6',
                  color: selectedCategory === cat.name ? '#fff' : '#41474e'
                }}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>
        </div>

        {/* Active category banner */}
        {selectedCategory && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-6" style={{ background: '#e6eef5', border: '1px solid #c1d8e8' }}>
            <div className="flex-1">
              <p className="text-[13px] font-semibold" style={{ color: '#003857' }}>
                Filtering: {selectedCategory}
              </p>
              <p className="text-[11px]" style={{ color: '#41474e' }}>
                Results will only show schemes from this category
              </p>
            </div>
            <button
              onClick={() => handleCategoryChange('')}
              className="p-1 rounded-md transition-colors hover:bg-white/50"
              style={{ color: '#003857' }}
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form — Left */}
          <form onSubmit={handleSubmit} className="lg:col-span-2">
            <div className="card bg-white space-y-5">
              <h2 className="text-[15px] font-bold" style={{ fontFamily: 'Manrope', color: '#191c1e' }}>Your Profile</h2>

              <div>
                <label className="form-label">Your Age</label>
                <input type="number" min="0" max="120" value={profile.age} onChange={e => update('age', e.target.value)} placeholder="e.g., 25" className="form-field" />
              </div>
              <div>
                <label className="form-label">Gender</label>
                <select value={profile.gender} onChange={e => update('gender', e.target.value)} className="form-select">
                  <option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="form-label">Annual Household Income (₹)</label>
                <input type="number" min="0" value={profile.income} onChange={e => update('income', e.target.value)} placeholder="e.g., 200000" className="form-field" />
              </div>
              <div>
                <label className="form-label">Social Category</label>
                <select value={profile.caste} onChange={e => update('caste', e.target.value)} className="form-select">
                  <option value="">Select</option><option value="General">General</option><option value="OBC">OBC</option><option value="SC">SC</option><option value="ST">ST</option>
                </select>
              </div>
              <div>
                <label className="form-label">Occupation</label>
                <select value={profile.occupation} onChange={e => update('occupation', e.target.value)} className="form-select">
                  <option value="">Select</option><option value="Farmer">Farmer</option><option value="Student">Student</option><option value="Self-employed">Self-employed</option><option value="Entrepreneur">Entrepreneur</option><option value="Unemployed">Unemployed</option><option value="Any">Other / Employed</option>
                </select>
              </div>
              <div>
                <label className="form-label">Education Level</label>
                <select value={profile.education} onChange={e => update('education', e.target.value)} className="form-select">
                  <option value="">Select</option><option value="Below 10th">Below 10th</option><option value="10th Pass">10th Pass</option><option value="12th Pass">12th Pass</option><option value="Diploma">Diploma / ITI</option><option value="Graduate">Graduate</option><option value="Post Graduate">Post Graduate</option>
                </select>
              </div>
              <div>
                <label className="form-label">State</label>
                <select value={profile.state} onChange={e => update('state', e.target.value)} className="form-select">
                  <option value="">Select</option>{STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-[13px]" style={{ color: '#41474e' }}>
                  <input type="checkbox" checked={profile.isRural} onChange={e => update('isRural', e.target.checked)} className="w-4 h-4 rounded accent-navy-600" />
                  Rural Area
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[13px]" style={{ color: '#41474e' }}>
                  <input type="checkbox" checked={profile.isBPL} onChange={e => update('isBPL', e.target.checked)} className="w-4 h-4 rounded accent-navy-600" />
                  BPL Card Holder
                </label>
              </div>
              <button type="submit" disabled={loading} className="btn-saffron w-full mt-2">
                {loading ? <><Loader size={16} className="animate-spin" /> Analyzing...</> : selectedCategory ? `Find ${selectedCategory} Schemes` : 'Find My Schemes'}
              </button>
            </div>
          </form>

          {/* Results — Right */}
          <div className="lg:col-span-3">
            {!results && !loading && (
              <div className="card bg-white flex flex-col items-center justify-center py-20 text-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c1c7cf" strokeWidth="1.5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                <h3 className="text-[15px] font-semibold mt-4 mb-1" style={{ color: '#41474e' }}>Fill in your details</h3>
                <p className="text-[13px]" style={{ color: '#72787f' }}>
                  {selectedCategory 
                    ? `Complete the form to check your eligibility for ${selectedCategory} schemes`
                    : 'Complete the form to see personalized scheme recommendations'
                  }
                </p>
              </div>
            )}

            {loading && (
              <div className="card bg-white flex flex-col items-center justify-center py-20">
                <div className="spinner mb-4"></div>
                <p className="text-[14px]" style={{ color: '#41474e' }}>
                  {selectedCategory 
                    ? `Checking eligibility for ${selectedCategory} schemes...`
                    : 'Analyzing your profile against 50+ schemes...'
                  }
                </p>
              </div>
            )}

            {results && !loading && (
              <div className="space-y-4">
                <div className="card bg-white flex items-center gap-4">
                  <div className="text-[2rem] font-bold" style={{ fontFamily: 'Manrope', color: results.total > 0 ? '#1a7a3a' : '#72787f' }}>{results.total}</div>
                  <div>
                    <p className="text-[14px] font-semibold" style={{ color: results.total > 0 ? '#1a7a3a' : '#72787f' }}>
                      {results.total > 0 ? 'Schemes Found' : 'No Schemes Found'}
                    </p>
                    <p className="text-[12px]" style={{ color: '#72787f' }}>
                      {selectedCategory 
                        ? `Eligible in ${selectedCategory} category`
                        : 'Based on your profile match'
                      }
                    </p>
                  </div>
                  {selectedCategory && results.total === 0 && (
                    <button
                      onClick={() => { handleCategoryChange(''); runEligibility(''); }}
                      className="ml-auto text-[12px] font-semibold px-3 py-1.5 rounded-md transition-colors"
                      style={{ background: '#f2f4f6', color: '#003857' }}
                    >
                      Search All Categories
                    </button>
                  )}
                </div>

                <div className="space-y-3 max-h-[65vh] overflow-y-auto">
                  {results.recommendations.map((scheme, i) => {
                    const scoreColor = scheme.matchScore >= 80 ? '#1a7a3a' : scheme.matchScore >= 50 ? '#7c5800' : '#72787f';
                    const barClass = scheme.matchScore >= 80 ? 'score-high' : scheme.matchScore >= 50 ? 'score-mid' : 'score-low';
                    return (
                      <Link key={scheme.id} to={`/schemes/${scheme.id}`} className="card bg-white block group" 
                        style={{ borderLeft: `3px solid ${scoreColor}` }}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="text-[14px] font-bold group-hover:text-navy-600 transition-colors" style={{ color: '#191c1e' }}>{scheme.name}</h3>
                            <span className="label-stamp">{scheme.category}</span>
                          </div>
                          <div className="text-right ml-3">
                            <div className="text-[18px] font-bold" style={{ fontFamily: 'Manrope', color: scoreColor }}>{scheme.matchScore}%</div>
                            <p className="text-[10px]" style={{ color: '#a0a5ab' }}>match</p>
                          </div>
                        </div>
                        <div className="score-bar mb-3"><div className={`score-bar-fill ${barClass}`} style={{ width: `${scheme.matchScore}%` }} /></div>
                        <p className="text-[12px] mb-2" style={{ color: '#1a7a3a' }}>{scheme.benefits}</p>
                        {scheme.matchReasons?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {scheme.matchReasons.map((r, j) => (
                              <span key={j} className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ background: '#e6eef5', color: '#003857' }}>{r}</span>
                            ))}
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
