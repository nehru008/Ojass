
// src/pages/AIAssistant.jsx
import { useNavigate } from 'react-router-dom';
import CrisisAssistant from '../components/AI/CrisisAssistant';
import Navbar from '../components/shared/Navbar';

const AIAssistant = () => {
  const navigate = useNavigate();
  return (
    <div className="page-enter min-h-screen pb-24">
      <div className="glass sticky top-0 z-40 px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button className="w-8 h-8 rounded-lg glass flex items-center justify-center text-sm" onClick={() => navigate('/')}>←</button>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '2px', color: '#8B5CF6' }}>AI ASSISTANT</h1>
        </div>
      </div>
      <div className="max-w-lg mx-auto px-4 pt-4">
        <CrisisAssistant />
      </div>
      <Navbar />
    </div>
  );
};

export default AIAssistant;
