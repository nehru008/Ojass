

// ==========================================

// src/pages/ResponderView.jsx
import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/useUserStore';
import ResponderAlert from '../components/Responder/ResponderAlert';
import Navbar from '../components/shared/Navbar';

const MOCK_ALERTS = [
  { id: 'a1', type: 'Medical Emergency', distance: '0.3mi', time: '2m ago', urgent: true },
  { id: 'a2', type: 'Accident', distance: '0.7mi', time: '8m ago', urgent: false },
  { id: 'a3', type: 'Other', distance: '1.2mi', time: '15m ago', urgent: false },
];

const ResponderView = () => {
  const navigate = useNavigate();
  const { isResponder, respondingTo, stopResponding } = useUserStore();

  return (
    <div className="page-enter min-h-screen pb-24">
      <div className="glass sticky top-0 z-40 px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button className="w-8 h-8 rounded-lg glass flex items-center justify-center text-sm" onClick={() => navigate('/')}>←</button>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '2px' }}>RESPONDER VIEW</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4">
        {isResponder ? (
          // Active responding UI
          <div className="slide-up">
            <div className="glass rounded-2xl p-4 mb-4" style={{ borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.05)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="live-dot w-2 h-2 rounded-full bg-green-500" />
                <span className="font-bold text-green-400">RESPONDING</span>
              </div>
              <p className="text-sm text-gray-400 mb-3">Navigation active. Broadcaster location live.</p>
              <div className="flex gap-2">
                <button className="btn-green flex-1 py-2.5 text-sm rounded-xl" onClick={() => navigate('/map')}>🗺️ Open Navigation</button>
                <button className="btn-outline py-2.5 px-3 text-sm rounded-xl" onClick={() => navigate('/chat')}>💬 Chat</button>
              </div>
            </div>
            <div className="glass rounded-2xl p-4 mb-4">
              <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Broadcaster</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold">A</div>
                <div>
                  <p className="font-medium text-sm">Anonymous User</p>
                  <p className="text-xs text-green-400">📍 Live location sharing</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-lg font-bold text-red-400">0.3mi</p>
                  <p className="text-xs text-gray-500">distance</p>
                </div>
              </div>
            </div>
            <button className="btn-outline w-full py-3 text-sm rounded-2xl" onClick={() => stopResponding()}>
              ✖ Stop Responding
            </button>
          </div>
        ) : (
          // Alert list
          <>
            <div className="glass rounded-2xl p-4 mb-4 flex items-center gap-3">
              <span className="live-dot w-3 h-3 rounded-full bg-red-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Monitoring for nearby emergencies</p>
                <p className="text-xs text-gray-500">You'll be notified when someone needs help</p>
              </div>
            </div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-sm text-gray-300">Incoming Alerts</h2>
              <span className="text-xs text-gray-600 font-mono">Real-time</span>
            </div>
            {MOCK_ALERTS.map(alert => (
              <ResponderAlert key={alert.id} alert={alert} />
            ))}
          </>
        )}
      </div>
      <Navbar />
    </div>
  );
};

export default ResponderView;

