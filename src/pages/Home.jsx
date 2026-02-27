
// src/pages/Home.jsx
import { useNavigate } from 'react-router-dom';
import useSOSStore from '../store/useSOSStore';
import useMapStore from '../store/useMapStore';
import useUserStore from '../store/useUserStore';
import Navbar from '../components/shared/Navbar';

const Home = () => {
  const navigate = useNavigate();
  const { active, type, resolveSOS } = useSOSStore();
  const { userLocation, locationDetected } = useMapStore();
  const { name } = useUserStore();

  return (
    <div className="page-enter min-h-screen pb-24">
      {/* Header */}
      <div className="glass sticky top-0 z-40 px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div>
            <div className="flex items-center gap-1">
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '26px', letterSpacing: '2px', color: 'var(--red)' }}>NEAR</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '26px', letterSpacing: '2px' }}>HELP</span>
            </div>
            <p className="text-xs text-gray-500">Welcome, {name}</p>
          </div>
          <div className="flex items-center gap-2">
            {active && (
              <span className="flex items-center gap-1.5 text-xs font-mono text-red-400">
                <span className="live-dot w-2 h-2 rounded-full bg-red-500 inline-block" />LIVE
              </span>
            )}
            <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center font-bold cursor-pointer"
                 onClick={() => navigate('/profile')}>
              {name[0]}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-8">
        {/* Active SOS Banner */}
        {active && (
          <div className="mb-6 p-4 rounded-2xl border slide-up"
               style={{ background: 'rgba(255,45,32,0.08)', borderColor: 'rgba(255,45,32,0.4)' }}>
            <div className="flex items-center gap-3 mb-2">
              <span className="live-dot w-3 h-3 rounded-full bg-red-500 inline-block" />
              <span className="font-semibold text-red-400">SOS ACTIVE</span>
              <span className="ml-auto text-xs text-gray-500 font-mono">{type}</span>
            </div>
            <p className="text-sm text-gray-400 mb-3">Emergency broadcast is live. Nearby responders notified.</p>
            <div className="flex gap-2">
              <button className="btn-outline text-sm py-2 px-4 flex-1" onClick={() => navigate('/map')}>📍 View Map</button>
              <button className="btn-red text-sm py-2 px-4 flex-1" onClick={() => resolveSOS()}>✅ Mark Resolved</button>
            </div>
          </div>
        )}

        {/* SOS Button */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <p className="text-gray-400 text-sm">Tap to send emergency alert</p>
          <div className="relative flex items-center justify-center" style={{ width: '220px', height: '220px' }}>
            {[0,1,2].map(i => (
              <div key={i} className="ripple-ring absolute rounded-full border-2 border-red-500 opacity-40"
                   style={{ width: '150px', height: '150px', animationDelay: `${i*0.5}s` }} />
            ))}
            <button
              className="sos-btn relative z-10 w-36 h-36 rounded-full bg-red-600 text-white flex flex-col items-center justify-center gap-1"
              style={{ border: '4px solid rgba(255,255,255,0.3)' }}
              onClick={() => navigate('/sos')}
            >
              <span style={{ fontSize: '36px' }}>🆘</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '3px' }}>SOS</span>
            </button>
          </div>
          <p className="text-xs text-gray-600 text-center">
            📍 {locationDetected ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` : 'Detecting...'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { icon: '🗺️', label: 'Live Map', sub: 'View active alerts', path: '/map', color: '#3B82F6' },
            { icon: '🚑', label: 'Respond', sub: 'Help someone nearby', path: '/responder', color: '#10B981' },
            { icon: '💬', label: 'AI Guide', sub: 'Crisis assistance', path: '/ai', color: '#8B5CF6' },
            { icon: '👤', label: 'Profile', sub: 'Skills & settings', path: '/profile', color: '#F59E0B' },
          ].map(action => (
            <button key={action.path} className="glass glass-hover p-4 rounded-2xl text-left"
                    onClick={() => navigate(action.path)}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3"
                   style={{ background: action.color + '22' }}>
                {action.icon}
              </div>
              <p className="font-semibold text-sm">{action.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{action.sub}</p>
            </button>
          ))}
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Home;