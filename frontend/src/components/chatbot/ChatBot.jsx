import { useState, useRef } from 'react';
import { Send, Mic, MicOff, Volume2, X, Minus } from 'lucide-react';
import { chatAPI } from '../../services/api';

function renderMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/### (.*)/g, '<h3>$1</h3>')
    .replace(/## (.*)/g, '<h2>$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\((http[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/^- (.*)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    .replace(/\n{2,}/g, '<br/><br/>')
    .replace(/\n/g, '<br/>')
    .replace(/---/g, '<hr/>');
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Namaste! I\'m **SahayakAI**, your Government Scheme Assistant.\n\nHow can I help you today? You can ask me about any government scheme in **Hindi** or **English**.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEnd = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    setTimeout(() => messagesEnd.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setInput('');
    setLoading(true);
    scrollToBottom();
    try {
      const data = await chatAPI.sendMessage(msg, sessionId);
      setSessionId(data.sessionId);
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    } finally { setLoading(false); scrollToBottom(); }
  };

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Try Chrome.');
      return;
    }
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognitionRef.current = recognition;
    recognition.lang = 'hi-IN';
    recognition.interimResults = true;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join('');
      if (e.results[0].isFinal) sendMessage(t); else setInput(t);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  const speak = (text) => {
    if (isSpeaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); return; }
    const plain = text.replace(/[#*_\[\]()]/g, '').replace(/<[^>]+>/g, '');
    const u = new SpeechSynthesisUtterance(plain);
    u.lang = /[\u0900-\u097F]/.test(plain) ? 'hi-IN' : 'en-IN';
    u.rate = 0.9;
    u.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(u);
  };

  return (
    <>
      {/* Toggle Button */}
      {!isOpen && (
        <button onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-shadow hover:shadow-lg"
          style={{ background: '#003857', color: '#fff', boxShadow: '0 4px 16px rgba(0, 56, 87, 0.25)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)] h-[540px] max-h-[calc(100vh-4rem)] rounded-xl overflow-hidden flex flex-col bg-white"
          style={{ boxShadow: '0 16px 48px rgba(25, 28, 30, 0.12), 0 0 1px rgba(25, 28, 30, 0.2)' }}>
          {/* Header */}
          <div className="px-4 py-3 flex items-center justify-between" style={{ background: '#003857' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-[13px] font-semibold text-white" style={{ fontFamily: 'Manrope' }}>SahayakAI</h3>
                <p className="text-[11px] text-white/60">Government Scheme Assistant</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
              <Minus size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ background: '#f8f9fb' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[82%] rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                  msg.role === 'user'
                    ? 'rounded-br-md'
                    : 'rounded-bl-md'
                }`} style={{
                  background: msg.role === 'user' ? '#003857' : '#ffffff',
                  color: msg.role === 'user' ? '#ffffff' : '#191c1e',
                  ...(msg.role === 'assistant' ? { boxShadow: '0 1px 3px rgba(25,28,30,0.06)' } : {})
                }}>
                  <div className="md-content" dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
                  {msg.role === 'assistant' && (
                    <button onClick={() => speak(msg.content)}
                      className="mt-1.5 text-[11px] flex items-center gap-1 transition-colors"
                      style={{ color: '#72787f' }}>
                      <Volume2 size={11} /> {isSpeaking ? 'Stop' : 'Listen'}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-xl rounded-bl-md px-4 py-3 bg-white" style={{ boxShadow: '0 1px 3px rgba(25,28,30,0.06)' }}>
                  <div className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: '#72787f', animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: '#72787f', animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: '#72787f', animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEnd} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 bg-white" style={{ borderTop: '1px solid #edeef0' }}>
            <div className="flex items-center gap-2">
              <button onClick={toggleVoice}
                className="p-2 rounded-lg transition-colors"
                style={{ background: isListening ? '#ffdad6' : '#f2f4f6', color: isListening ? '#ba1a1a' : '#72787f' }}>
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
              <input type="text" value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder={isListening ? 'Listening...' : 'Type your question...'}
                className="flex-1 text-[13px] py-2 px-3 rounded-lg outline-none"
                style={{ background: '#f2f4f6', color: '#191c1e', border: 'none' }}
                disabled={loading} />
              <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
                className="p-2 rounded-lg transition-colors disabled:opacity-30"
                style={{ background: '#003857', color: '#fff' }}>
                <Send size={16} />
              </button>
            </div>
            <p className="text-[10px] mt-1.5 text-center" style={{ color: '#a0a5ab' }}>
              Voice: Hindi & English · Powered by AI
            </p>
          </div>
        </div>
      )}
    </>
  );
}
