import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ChatBot from './components/chatbot/ChatBot';
import Home from './pages/Home';
import SchemeExplorer from './pages/SchemeExplorer';
import SchemeDetails from './pages/SchemeDetails';
import EligibilityCheck from './pages/EligibilityCheck';
import ScannerPage from './pages/ScannerPage';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/schemes" element={<SchemeExplorer />} />
          <Route path="/schemes/:id" element={<SchemeDetails />} />
          <Route path="/eligibility" element={<EligibilityCheck />} />
          <Route path="/scanner" element={<ScannerPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <ChatBot />
      </div>
    </Router>
  );
}
