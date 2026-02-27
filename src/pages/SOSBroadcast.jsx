


// ==========================================

// src/pages/SOSBroadcast.jsx
import { useNavigate } from 'react-router-dom';
import SOSForm from '../components/SOS/SOSForm';
import Navbar from '../components/shared/Navbar';

const SOSBroadcast = () => {
  const navigate = useNavigate();

  return (
    <div className="page-enter min-h-screen pb-24">
      <div className="glass sticky top-0 z-40 px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button className="w-8 h-8 rounded-lg glass flex items-center justify-center text-sm" onClick={() => navigate('/')}>←</button>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '2px' }}>SOS BROADCAST</h1>
        </div>
      </div>
      <div className="max-w-lg mx-auto px-4 pt-6">
        <SOSForm onSuccess={() => navigate('/map')} />
      </div>
      <Navbar />
    </div>
  );
};

export default SOSBroadcast;
