

// ==========================================

// src/pages/LiveMapView.jsx
import { useNavigate } from 'react-router-dom';
import LiveMap from '../components/Map/LiveMap';
import useSOSStore from '../store/useSOSStore';
import useMapStore from '../store/useMapStore';
import Navbar from '../components/shared/Navbar';

const LiveMapView = () => {
  const navigate = useNavigate();
  const { active, type } = useSOSStore();
  const { sosList, responders } = useMapStore();

  return (
    <div className="page-enter" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div className="glass px-4 py-3 z-40">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-lg glass flex items-center justify-center text-sm mr-1" onClick={() => navigate('/')}>←</button>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '2px', color: 'var(--red)' }}>LIVE MAP</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            {active && <span className="flex items-center gap-1"><span className="live-dot w-1.5 h-1.5 rounded-full bg-red-500" />LIVE</span>}
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />{sosList.length} SOS</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />{responders.length} Resp.</span>
          </div>
        </div>
      </div>

      {/* Map */}
      <div style={{ flex: 1, position: 'relative' }}>
        <LiveMap />
        {/* Legend */}
        <div className="absolute bottom-20 left-4 glass rounded-2xl p-3 z-50">
          {[['🔴', 'Active SOS'], ['🟢', 'Responder'], ['🔵', 'You']].map(([dot, label]) => (
            <div key={label} className="flex items-center gap-2 text-xs mb-1 last:mb-0">
              <span>{dot}</span>{label}
            </div>
          ))}
        </div>
        {/* Chat FAB */}
        {active && (
          <button onClick={() => navigate('/chat')}
                  className="absolute bottom-20 right-4 w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-2xl shadow-lg z-50">
            💬
          </button>
        )}
      </div>

      <Navbar />
    </div>
  );
};

export default LiveMapView;
