




// ==========================================

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


// ==========================================

// src/pages/ChatView.jsx
import { useNavigate } from 'react-router-dom';
import ChatPanel from '../components/Chat/ChatPanel';

const ChatView = () => {
  const navigate = useNavigate();
  return (
    <div className="page-enter" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="glass px-4 py-3 z-40">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button className="w-8 h-8 rounded-lg glass flex items-center justify-center text-sm" onClick={() => navigate('/responder')}>←</button>
          <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-sm">🚑</div>
          <div>
            <p className="font-semibold text-sm">Emergency Chat</p>
            <div className="flex items-center gap-1">
              <span className="live-dot w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-xs text-green-400">Responder connected</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden max-w-lg mx-auto w-full">
        <ChatPanel />
      </div>
    </div>
  );
};

export default ChatView;


// ==========================================

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


// ==========================================

// src/pages/Profile.jsx
import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/useUserStore';
import Navbar from '../components/shared/Navbar';

const ALL_SKILLS = ['CPR', 'Doctor', 'Nurse', 'Electrician', 'Mechanic', 'First Aid', 'Firefighter'];
const SKILL_ICONS = { 'CPR': '❤️', 'Doctor': '👨‍⚕️', 'Nurse': '👩‍⚕️', 'Electrician': '⚡', 'Mechanic': '🔧', 'First Aid': '🩹', 'Firefighter': '🔥' };

const Profile = () => {
  const navigate = useNavigate();
  const { name, skills, toggleSkill, rating, totalResponses } = useUserStore();

  return (
    <div className="page-enter min-h-screen pb-24">
      <div className="glass sticky top-0 z-40 px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button className="w-8 h-8 rounded-lg glass flex items-center justify-center text-sm" onClick={() => navigate('/')}>←</button>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '2px' }}>MY PROFILE</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4">
        {/* Profile card */}
        <div className="glass rounded-2xl p-5 mb-4 text-center">
          <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-3xl font-bold mx-auto mb-3">{name[0]}</div>
          <h2 className="font-bold text-lg">{name}</h2>
          <p className="text-sm text-gray-500 mb-3">Community Responder</p>
          <div className="flex flex-wrap justify-center gap-2">
            {skills.map(skill => (
              <span key={skill} className="skill-badge">{skill}</span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[[totalResponses, 'Responses'], [8, 'Resolved'], [`${rating}⭐`, 'Rating']].map(([val, label]) => (
            <div key={label} className="stat-card text-center">
              <p className="text-2xl font-bold">{val}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Skill Registry */}
        <div className="glass rounded-2xl p-4 mb-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Skill Registry</p>
          <div className="grid grid-cols-2 gap-2">
            {ALL_SKILLS.map(skill => {
              const has = skills.includes(skill);
              return (
                <button key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium text-left transition-all border ${has ? 'text-red-300' : 'text-gray-400'}`}
                  style={{ borderColor: has ? 'rgba(255,45,32,0.4)' : 'var(--border)', background: has ? 'rgba(255,45,32,0.08)' : 'var(--surface-3)' }}>
                  <span>{SKILL_ICONS[skill]}</span>
                  {skill}
                  {has && <span className="ml-auto text-red-400">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Profile;


// ==========================================

// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../services/adminService';
import Navbar from '../components/shared/Navbar';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [sosList, setSosList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminService.getStats(), adminService.getAllSOS()]).then(([s, list]) => {
      setStats(s);
      setSosList(list);
      setLoading(false);
    });
  }, []);

  const STATUS_STYLES = {
    Active: { background: 'rgba(239,68,68,0.15)', color: '#EF4444' },
    Responding: { background: 'rgba(245,158,11,0.15)', color: '#F59E0B' },
    Unresponded: { background: 'rgba(239,68,68,0.25)', color: '#FF6B6B' },
  };

  return (
    <div className="page-enter min-h-screen pb-24">
      <div className="glass sticky top-0 z-40 px-4 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-lg glass flex items-center justify-center text-sm" onClick={() => navigate('/')}>←</button>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '2px', color: 'var(--amber)' }}>ADMIN</h1>
          </div>
          <span className="font-mono text-xs text-gray-500">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-4">
        {loading ? (
          <div className="flex justify-center py-20"><LoadingSpinner size={40} /></div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: 'Active SOS', value: stats.activeSOS, icon: '🔴', delta: '+2', color: 'var(--red)' },
                { label: 'Total Today', value: stats.totalToday, icon: '📊', delta: '+5', color: 'var(--amber)' },
                { label: 'Avg Response', value: stats.avgResponseTime, icon: '⚡', delta: '-18s', color: 'var(--green)' },
                { label: 'Resolved', value: stats.resolvedToday, icon: '✅', delta: '+3', color: 'var(--blue)' },
              ].map(stat => (
                <div key={stat.label} className="stat-card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">{stat.icon}</span>
                    <span className="text-xs font-mono" style={{ color: stat.color }}>{stat.delta}</span>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Crisis breakdown */}
            <div className="glass rounded-2xl p-4 mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">By Crisis Type</p>
              {[['Medical Emergency',10,'#EF4444'],['Accident',7,'#8B5CF6'],['Fire',4,'#F97316'],['Gas Leak',2,'#EAB308'],['Other',1,'#6B7280']].map(([type,count,color]) => (
                <div key={type} className="mb-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-300">{type}</span>
                    <span className="font-mono" style={{ color }}>{count} ({Math.round(count/24*100)}%)</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'var(--surface-4)' }}>
                    <div className="h-full rounded-full" style={{ width: `${count/24*100}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>

            {/* SOS Table */}
            <div className="glass rounded-2xl overflow-hidden mb-4">
              <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Active Incidents</p>
              </div>
              <div className="overflow-x-auto">
                <table className="admin-table">
                  <thead>
                    <tr>
                      {['ID','Type','Location','Time','Resp.','Status','Action'].map(col => (
                        <th key={col}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sosList.map(sos => (
                      <tr key={sos.id}>
                        <td className="font-mono text-xs text-gray-400">{sos.id}</td>
                        <td className="text-xs font-medium">{sos.type}</td>
                        <td className="font-mono text-xs text-gray-500">{sos.location}</td>
                        <td className="font-mono text-xs">{sos.time}</td>
                        <td className="text-green-400 font-medium">{sos.responders}</td>
                        <td>
                          <span className="text-xs px-2 py-0.5 rounded-full"
                                style={STATUS_STYLES[sos.status] || STATUS_STYLES.Active}>
                            {sos.status}
                          </span>
                        </td>
                        <td>
                          <div className="flex gap-1">
                            <button className="text-xs px-2 py-1 rounded-lg text-green-400"
                                    style={{ background: 'rgba(16,185,129,0.1)' }}
                                    onClick={() => adminService.resolveSOSAdmin(sos.id)}>
                              Resolve
                            </button>
                            <button className="text-xs px-2 py-1 rounded-lg text-red-400"
                                    style={{ background: 'rgba(239,68,68,0.1)' }}
                                    onClick={() => adminService.flagSOS(sos.id)}>
                              Flag
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Response time chart */}
            <div className="glass rounded-2xl p-4 mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Response Time - Last 7 Days (min)</p>
              <div className="flex items-end gap-2 h-24">
                {[4.2,3.8,5.1,3.2,2.9,4.5,3.7].map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-t-md"
                         style={{ height: `${(val/6)*100}%`, background: 'linear-gradient(to top, var(--red-dark), var(--red))', minHeight: '8px' }} />
                    <span className="text-xs text-gray-600">{'MTWTFSS'[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      <Navbar />
    </div>
  );
};

export default AdminDashboard;


// ==========================================

// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
