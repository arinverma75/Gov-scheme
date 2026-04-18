import { Link } from 'react-router-dom';
import DocumentScanner from '../components/ocr/DocumentScanner';
import { Shield, FileText } from 'lucide-react';

export default function ScannerPage() {
  return (
    <div className="min-h-screen pt-[80px] pb-16 px-6" style={{ background: '#f8f9fb' }}>
      <div className="max-w-[720px] mx-auto">
        <div className="flex items-center gap-2 text-[12px] mb-6" style={{ color: '#72787f' }}>
          <Link to="/" className="hover:underline">Home</Link><span>/</span><span style={{ color: '#191c1e' }}>Document Scanner</span>
        </div>

        <div className="mb-8">
          <h1 className="text-[1.75rem] font-bold mb-1" style={{ fontFamily: 'Manrope', color: '#191c1e' }}>Document Scanner</h1>
          <p className="text-[14px]" style={{ color: '#41474e' }}>Scan your documents using OCR and auto-fill application forms</p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {[
            { title: 'Private & Secure', desc: 'Processing happens in your browser' },
            { title: 'Instant Results', desc: 'Extract text in seconds' },
            { title: 'Auto-Fill Forms', desc: 'Populate applications automatically' },
          ].map((item, i) => (
            <div key={i} className="card bg-white text-center py-4">
              <h4 className="text-[13px] font-semibold mb-0.5" style={{ color: '#191c1e' }}>{item.title}</h4>
              <p className="text-[11px]" style={{ color: '#72787f' }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="card bg-white mb-6">
          <DocumentScanner />
        </div>

        <div className="card bg-white">
          <h3 className="label-stamp mb-3">SUPPORTED DOCUMENTS</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {['Aadhaar Card', 'PAN Card', 'Income Certificate', 'Caste Certificate', 'Voter ID', 'Driving License', 'Ration Card', 'Bank Passbook'].map(doc => (
              <div key={doc} className="py-2.5 px-3 rounded-lg text-center text-[12px] font-medium" style={{ background: '#f2f4f6', color: '#41474e' }}>{doc}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
