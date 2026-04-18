import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, X, ChevronLeft, ChevronRight, ExternalLink, Check } from 'lucide-react';
import { schemesAPI } from '../services/api';

export default function SchemeExplorer() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [schemes, setSchemes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');

  useEffect(() => { loadSchemes(); }, [page, selectedCategory]);

  useEffect(() => {
    const q = searchParams.get('search');
    if (q) { setSearch(q); loadSchemes(q); } else { loadSchemes(); }
  }, []);

  const loadSchemes = async (q) => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (q || search) params.search = q || search;
      if (selectedCategory) params.category = selectedCategory;
      const data = await schemesAPI.getAll(params);
      setSchemes(data.schemes); setTotal(data.total); setTotalPages(data.totalPages);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    schemesAPI.getCategories().then(d => d.success && setCategories(d.categories)).catch(() => {});
  }, []);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); loadSchemes(); };

  const clearFilters = () => {
    setSearch(''); setSelectedCategory(''); setPage(1); setSearchParams({});
    loadSchemes('');
  };

  return (
    <div className="min-h-screen pt-[80px] pb-16 px-6" style={{ background: '#f8f9fb' }}>
      <div className="max-w-[1200px] mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] mb-6" style={{ color: '#72787f' }}>
          <Link to="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span style={{ color: '#191c1e' }}>Explore Schemes</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-[1.75rem] font-bold mb-1" style={{ fontFamily: 'Manrope', color: '#191c1e' }}>
              {selectedCategory ? `${selectedCategory} Schemes` : 'Explore Government Schemes'}
            </h1>
            <p className="text-[14px]" style={{ color: '#72787f' }}>
              Showing {total} schemes{selectedCategory ? ` in ${selectedCategory}` : ` across ${categories.length} categories`}
            </p>
          </div>
          {selectedCategory && (
            <Link
              to={`/eligibility?category=${encodeURIComponent(selectedCategory)}`}
              className="btn-saffron text-[13px] py-2 px-4 shrink-0"
            >
              Check Eligibility →
            </Link>
          )}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-5">
          <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white" style={{ border: '1.5px solid rgba(193,199,207,0.4)' }}>
            <Search size={16} style={{ color: '#72787f' }} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, category, or keyword..."
              className="flex-1 bg-transparent text-[14px] outline-none" style={{ color: '#191c1e' }} />
            {search && <button type="button" onClick={() => { setSearch(''); loadSchemes(''); }}><X size={14} style={{ color: '#72787f' }} /></button>}
          </div>
          <button type="submit" className="btn-primary text-[13px] py-2.5 px-5">Search</button>
        </form>

        {/* Category Chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => { setSelectedCategory(''); setPage(1); }}
            className="px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors"
            style={{ background: !selectedCategory ? '#003857' : '#f2f4f6', color: !selectedCategory ? '#fff' : '#41474e' }}>
            All
          </button>
          {categories.map(cat => (
            <button key={cat.name} onClick={() => { setSelectedCategory(cat.name); setPage(1); }}
              className="px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors"
              style={{ background: selectedCategory === cat.name ? '#003857' : '#f2f4f6', color: selectedCategory === cat.name ? '#fff' : '#41474e' }}>
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="spinner"></div></div>
        ) : schemes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[16px] mb-3" style={{ color: '#72787f' }}>No schemes found</p>
            <button onClick={clearFilters} className="text-[13px] font-semibold" style={{ color: '#003857' }}>Clear filters</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {schemes.map((scheme) => (
                <Link key={scheme.id} to={`/schemes/${scheme.id}`}
                  className="card group bg-white flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <span className="label-stamp">{scheme.category}</span>
                    <span className="badge badge-active">Active</span>
                  </div>
                  <h3 className="text-[15px] font-bold mb-0.5 group-hover:text-navy-600 transition-colors" style={{ fontFamily: 'Manrope', color: '#191c1e' }}>
                    {scheme.name}
                  </h3>
                  {scheme.nameHindi && <p className="text-[12px] mb-3" style={{ color: '#a0a5ab' }}>{scheme.nameHindi}</p>}
                  <p className="text-[13px] leading-relaxed mb-4 flex-1 line-clamp-2" style={{ color: '#41474e' }}>{scheme.description}</p>
                  <div className="flex items-start gap-2 mb-3">
                    <Check size={14} className="shrink-0 mt-0.5" style={{ color: '#1a7a3a' }} />
                    <p className="text-[12px] line-clamp-1" style={{ color: '#1a7a3a' }}>{scheme.benefits}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-3" style={{ borderTop: '1px solid #f2f4f6' }}>
                    {scheme.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ background: '#f2f4f6', color: '#72787f' }}>{tag}</span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="p-2 rounded-md disabled:opacity-30 transition-colors" style={{ color: '#41474e', background: '#f2f4f6' }}>
                  <ChevronLeft size={16} />
                </button>
                <span className="text-[13px] font-medium" style={{ color: '#72787f' }}>Page {page} of {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="p-2 rounded-md disabled:opacity-30 transition-colors" style={{ color: '#41474e', background: '#f2f4f6' }}>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
