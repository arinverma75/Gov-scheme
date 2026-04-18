import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsAPI } from '../services/api';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsAPI.getDashboard().then(r => r.success && setData(r.dashboard)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20"><div className="spinner"></div></div>;
  if (!data) return null;

  const { summary, byCategory, byState, byStatus, awarenessGap } = data;

  return (
    <div className="min-h-screen pt-[80px] pb-16 px-6" style={{ background: '#f8f9fb' }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center gap-2 text-[12px] mb-6" style={{ color: '#72787f' }}>
          <Link to="/" className="hover:underline">Home</Link><span>/</span><span style={{ color: '#191c1e' }}>Dashboard</span>
        </div>

        <div className="mb-8">
          <h1 className="text-[1.75rem] font-bold mb-1" style={{ fontFamily: 'Manrope', color: '#191c1e' }}>Awareness Dashboard</h1>
          <p className="text-[14px]" style={{ color: '#41474e' }}>Understanding the gap between scheme availability and citizen awareness</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Schemes', value: summary.totalSchemes, icon: '📋' },
            { label: 'Active Schemes', value: summary.activeSchemes, icon: '✓' },
            { label: 'Categories', value: summary.categories, icon: '▤' },
            { label: 'States Covered', value: summary.states, icon: '◉' },
          ].map((item, i) => (
            <div key={i} className="card bg-white">
              <p className="text-[12px] font-medium mb-2" style={{ color: '#72787f' }}>{item.label}</p>
              <p className="text-[2rem] font-bold" style={{ fontFamily: 'Manrope', color: '#003857' }}>{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Category Bars */}
          <div className="card bg-white">
            <h3 className="text-[15px] font-bold mb-5" style={{ fontFamily: 'Manrope', color: '#191c1e' }}>Schemes by Category</h3>
            <div className="space-y-3">
              {byCategory.sort((a,b) => b.count - a.count).map((cat, i) => {
                const max = Math.max(...byCategory.map(c => c.count));
                return (
                  <div key={i}>
                    <div className="flex justify-between text-[12px] mb-1">
                      <span style={{ color: '#41474e' }}>{cat.name}</span>
                      <span className="font-medium" style={{ color: '#191c1e' }}>{cat.count}</span>
                    </div>
                    <div className="score-bar"><div className="score-bar-fill" style={{ width: `${(cat.count / max) * 100}%`, background: '#1b4f72' }} /></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* State Bars */}
          <div className="card bg-white">
            <h3 className="text-[15px] font-bold mb-5" style={{ fontFamily: 'Manrope', color: '#191c1e' }}>Top States by Scheme Count</h3>
            <div className="space-y-3">
              {byState.slice(0, 10).map((item, i) => {
                const max = Math.max(...byState.map(c => c.count));
                return (
                  <div key={i}>
                    <div className="flex justify-between text-[12px] mb-1">
                      <span style={{ color: '#41474e' }}>{item.state}</span>
                      <span className="font-medium" style={{ color: '#191c1e' }}>{item.count}</span>
                    </div>
                    <div className="score-bar"><div className="score-bar-fill" style={{ width: `${(item.count / max) * 100}%`, background: '#326286' }} /></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Awareness Gap Table */}
        <div className="card bg-white mb-6">
          <h3 className="text-[15px] font-bold mb-1" style={{ fontFamily: 'Manrope', color: '#191c1e' }}>Awareness Gap Analysis</h3>
          <p className="text-[12px] mb-5" style={{ color: '#72787f' }}>Estimated awareness levels and gap indicators across categories</p>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr style={{ background: '#003857', color: '#fff' }}>
                  <th className="text-left py-2.5 px-4 rounded-l-md font-semibold">Category</th>
                  <th className="text-center py-2.5 px-4 font-semibold">Schemes</th>
                  <th className="text-center py-2.5 px-4 font-semibold">Est. Awareness</th>
                  <th className="text-center py-2.5 px-4 font-semibold">Gap</th>
                  <th className="text-left py-2.5 px-4 rounded-r-md font-semibold">Gap Indicator</th>
                </tr>
              </thead>
              <tbody>
                {awarenessGap.map((item, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f8f9fb' }}>
                    <td className="py-2.5 px-4 font-medium" style={{ color: '#191c1e' }}>{item.category}</td>
                    <td className="py-2.5 px-4 text-center" style={{ color: '#41474e' }}>{item.totalSchemes}</td>
                    <td className="py-2.5 px-4 text-center">
                      <span className="font-semibold" style={{ color: item.estimatedAwareness > 50 ? '#1a7a3a' : item.estimatedAwareness > 30 ? '#7c5800' : '#ba1a1a' }}>
                        {item.estimatedAwareness}%
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-center font-semibold" style={{ color: '#ba1a1a' }}>{item.gap}%</td>
                    <td className="py-2.5 px-4">
                      <div className="score-bar w-28">
                        <div className="score-bar-fill" style={{ width: `${item.gap}%`, background: item.gap > 60 ? '#ba1a1a' : item.gap > 40 ? '#7c5800' : '#1a7a3a' }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Status */}
        <div className="card bg-white">
          <h3 className="text-[15px] font-bold mb-4" style={{ fontFamily: 'Manrope', color: '#191c1e' }}>Scheme Status</h3>
          <div className="flex gap-4 flex-wrap">
            {Object.entries(byStatus).map(([status, count], i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ background: '#f2f4f6' }}>
                <div className="w-3 h-3 rounded-full" style={{ background: status === 'Active' ? '#1a7a3a' : status === 'Closed' ? '#ba1a1a' : '#7c5800' }} />
                <div>
                  <p className="text-[13px] font-semibold" style={{ color: '#191c1e' }}>{status}</p>
                  <p className="text-[11px]" style={{ color: '#72787f' }}>{count} schemes</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
