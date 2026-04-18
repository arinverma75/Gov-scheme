import { useState, useRef, useCallback } from 'react';
import { Upload, Loader, Check, X } from 'lucide-react';

export default function DocumentScanner({ onExtracted }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFile = useCallback((f) => {
    if (!f) return;
    setFile(f); setResult(null); setError(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(f);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith('image/')) handleFile(f);
  }, [handleFile]);

  const scanDocument = async () => {
    if (!file) return;
    setScanning(true); setProgress(0); setError(null);
    try {
      setProgress(10);
      const Tesseract = await import('tesseract.js');
      setProgress(20);
      const worker = await Tesseract.createWorker('eng+hin', 1, {
        logger: (m) => { if (m.status === 'recognizing text') setProgress(20 + Math.round(m.progress * 70)); }
      });
      const { data } = await worker.recognize(file);
      setProgress(95);
      const extracted = extractFields(data.text);
      setResult({ text: data.text, confidence: data.confidence, extracted, words: data.words?.length || 0 });
      setProgress(100);
      if (onExtracted) onExtracted(extracted);
      await worker.terminate();
    } catch { setError('OCR processing failed. Please try a clearer image.'); }
    finally { setScanning(false); }
  };

  const extractFields = (text) => {
    const fields = {};
    const aadhaar = text.match(/\b(\d{4}\s?\d{4}\s?\d{4})\b/);
    if (aadhaar) fields.aadhaarNumber = aadhaar[1].replace(/\s/g, '');
    const name = text.match(/(?:Name|नाम)\s*[:\s]\s*([A-Za-z\s]{3,40})/i);
    if (name) fields.name = name[1].trim();
    const dob = text.match(/(?:DOB|Date of Birth|जन्म|Birth)\s*[:\s]\s*(\d{2}[\/\-]\d{2}[\/\-]\d{4})/i);
    if (dob) fields.dateOfBirth = dob[1];
    const gender = text.match(/(?:Gender|लिंग|Sex)\s*[:\s]\s*(Male|Female|पुरुष|महिला|MALE|FEMALE)/i);
    if (gender) fields.gender = gender[1].charAt(0).toUpperCase() + gender[1].slice(1).toLowerCase();
    const pan = text.match(/\b([A-Z]{5}\d{4}[A-Z])\b/);
    if (pan) fields.panNumber = pan[1];
    const pin = text.match(/\b(\d{6})\b/);
    if (pin) fields.pincode = pin[1];
    return fields;
  };

  const reset = () => { setFile(null); setPreview(null); setResult(null); setError(null); setProgress(0); };

  return (
    <div className="space-y-5">
      {/* Upload Area */}
      {!file && (
        <div onDrop={handleDrop} onDragOver={e => e.preventDefault()} onClick={() => fileInputRef.current?.click()}
          className="rounded-xl p-10 text-center cursor-pointer transition-colors group"
          style={{ border: '2px dashed rgba(193, 199, 207, 0.5)', background: '#f8f9fb' }}>
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ background: '#e6eef5' }}>
            <Upload size={24} style={{ color: '#1b4f72' }} />
          </div>
          <h3 className="text-[15px] font-semibold mb-1" style={{ fontFamily: 'Manrope', color: '#191c1e' }}>Upload Document</h3>
          <p className="text-[13px] mb-3" style={{ color: '#72787f' }}>
            Drag & drop or click to upload your Aadhaar, PAN, or any ID document
          </p>
          <div className="flex gap-2 justify-center">
            {['JPEG', 'PNG', 'WebP'].map(fmt => (
              <span key={fmt} className="px-2.5 py-1 rounded text-[10px] font-medium" style={{ background: '#edeef0', color: '#72787f' }}>{fmt}</span>
            ))}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={e => handleFile(e.target.files[0])} className="hidden" />
        </div>
      )}

      {/* Preview & Scan */}
      {file && !result && (
        <div className="space-y-4">
          <div className="relative rounded-xl overflow-hidden" style={{ background: '#f2f4f6' }}>
            <img src={preview} alt="Document preview" className="w-full max-h-72 object-contain p-4" />
            <button onClick={reset} className="absolute top-3 right-3 w-7 h-7 rounded-md flex items-center justify-center bg-white" style={{ color: '#72787f', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <X size={14} />
            </button>
          </div>
          {scanning ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[13px]">
                <span className="flex items-center gap-2" style={{ color: '#003857' }}><Loader size={14} className="animate-spin" /> Scanning document...</span>
                <span style={{ color: '#72787f' }}>{progress}%</span>
              </div>
              <div className="score-bar h-2"><div className="score-bar-fill h-2" style={{ width: `${progress}%`, background: '#1b4f72' }} /></div>
              <p className="text-[11px] text-center" style={{ color: '#a0a5ab' }}>OCR runs locally in your browser — your data stays private</p>
            </div>
          ) : (
            <button onClick={scanDocument} className="btn-primary w-full">Scan & Extract Text</button>
          )}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-bold flex items-center gap-2" style={{ fontFamily: 'Manrope', color: '#1a7a3a' }}>
              <Check size={18} /> Scan Complete
            </h3>
            <button onClick={reset} className="text-[12px] font-semibold" style={{ color: '#003857' }}>Scan Another</button>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: '#f2f4f6' }}>
            <div className="text-[1.5rem] font-bold" style={{ fontFamily: 'Manrope', color: '#003857' }}>{Math.round(result.confidence)}%</div>
            <div>
              <p className="text-[13px] font-medium" style={{ color: '#191c1e' }}>Recognition Confidence</p>
              <p className="text-[11px]" style={{ color: '#72787f' }}>{result.words} words detected</p>
            </div>
          </div>

          {Object.keys(result.extracted).length > 0 && (
            <div className="p-4 rounded-xl" style={{ background: '#e8f5e9' }}>
              <h4 className="label-stamp mb-3" style={{ color: '#1a7a3a' }}>EXTRACTED FIELDS</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.entries(result.extracted).map(([key, value]) => (
                  <div key={key} className="p-2.5 rounded-lg bg-white">
                    <p className="text-[10px] uppercase font-medium mb-0.5" style={{ color: '#72787f', letterSpacing: '0.05em' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    <p className="text-[13px] font-semibold" style={{ color: '#191c1e' }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <details className="rounded-xl overflow-hidden bg-white" style={{ border: '1px solid #edeef0' }}>
            <summary className="px-4 py-2.5 text-[12px] cursor-pointer" style={{ color: '#72787f' }}>View Raw OCR Text</summary>
            <pre className="px-4 pb-3 text-[11px] whitespace-pre-wrap max-h-40 overflow-y-auto" style={{ color: '#41474e', borderTop: '1px solid #f2f4f6' }}>{result.text}</pre>
          </details>

          {error && <p className="text-[12px] p-3 rounded-lg" style={{ background: '#ffdad6', color: '#ba1a1a' }}>{error}</p>}
        </div>
      )}
    </div>
  );
}
