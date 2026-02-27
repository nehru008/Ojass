// src/components/Map/LiveMap.jsx
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import useMapStore from '../../store/useMapStore';
import useSOSStore from '../../store/useSOSStore';

/**
 * LiveMap Component
 * Renders a Leaflet map with live SOS markers, responder markers, and user location.
 * Updates in real-time via Zustand subscriptions.
 */
const LiveMap = ({ onMarkerClick }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef({});

  const { userLocation, sosList, responders } = useMapStore();
  const { active, type } = useSOSStore();

  // Crisis type to emoji
  const CRISIS_ICONS = {
    'Medical Emergency': '🏥',
    'Fire': '🔥',
    'Gas Leak': '⚠️',
    'Accident': '🚗',
    'Other': '📢',
  };

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    mapInstance.current = L.map(mapRef.current, {
      center: [userLocation.lat, userLocation.lng],
      zoom: 14,
      zoomControl: false,
    });

    // Dark tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors, © CARTO',
      maxZoom: 19,
    }).addTo(mapInstance.current);

    // Zoom control top-right
    L.control.zoom({ position: 'topright' }).addTo(mapInstance.current);

    // User marker
    const userIcon = L.divIcon({
      html: `<div style="
        width:28px;height:28px;border-radius:50%;
        background:#3B82F6;border:3px solid white;
        display:flex;align-items:center;justify-content:center;
        font-size:12px;box-shadow:0 2px 10px rgba(59,130,246,0.5)
      ">👤</div>`,
      iconSize: [28, 28], iconAnchor: [14, 14], className: '',
    });

    markersRef.current['user'] = L.marker(
      [userLocation.lat, userLocation.lng],
      { icon: userIcon }
    ).addTo(mapInstance.current).bindPopup('<b>You</b><br/>Your current location');

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  // Update SOS markers
  useEffect(() => {
    if (!mapInstance.current) return;

    // Remove old SOS markers
    Object.keys(markersRef.current)
      .filter(k => k.startsWith('sos_'))
      .forEach(k => {
        markersRef.current[k]?.remove();
        delete markersRef.current[k];
      });

    // Add current SOS markers
    sosList.forEach(sos => {
      const icon = L.divIcon({
        html: `<div style="
          width:44px;height:44px;border-radius:50%;
          background:#FF2D20;border:3px solid white;
          display:flex;align-items:center;justify-content:center;
          font-size:20px;box-shadow:0 0 20px rgba(255,45,32,0.6);
          animation:sosPulse 2s infinite
        ">${CRISIS_ICONS[sos.type] || '🆘'}</div>`,
        iconSize: [44, 44], iconAnchor: [22, 22], className: '',
      });

      const marker = L.marker([sos.lat, sos.lng], { icon })
        .addTo(mapInstance.current)
        .bindPopup(`<b>${sos.type}</b><br/>🔴 Active Emergency`);

      if (onMarkerClick) {
        marker.on('click', () => onMarkerClick(sos));
      }

      markersRef.current['sos_' + sos.id] = marker;
    });
  }, [sosList]);

  // Update responder markers
  useEffect(() => {
    if (!mapInstance.current) return;

    responders.forEach(resp => {
      const key = 'resp_' + resp.id;
      const icon = L.divIcon({
        html: `<div style="
          width:34px;height:34px;border-radius:50%;
          background:${resp.skills?.includes('Doctor') || resp.skills?.includes('Nurse') ? '#8B5CF6' : '#10B981'};
          border:2px solid white;display:flex;align-items:center;
          justify-content:center;font-size:14px;
          box-shadow:0 2px 8px rgba(0,0,0,0.4)
        ">🚑</div>`,
        iconSize: [34, 34], iconAnchor: [17, 17], className: '',
      });

      if (markersRef.current[key]) {
        // Update existing
        markersRef.current[key].setLatLng([resp.lat, resp.lng]);
      } else {
        // Create new
        markersRef.current[key] = L.marker([resp.lat, resp.lng], { icon })
          .addTo(mapInstance.current)
          .bindPopup(`<b>${resp.name}</b><br/>Skills: ${resp.skills?.join(', ')}<br/>ETA: ${resp.eta}min`);
      }
    });
  }, [responders]);

  // Update user location
  useEffect(() => {
    if (!mapInstance.current || !markersRef.current['user']) return;
    markersRef.current['user'].setLatLng([userLocation.lat, userLocation.lng]);
  }, [userLocation]);

  return (
    <div
      ref={mapRef}
      id="leaflet-map"
      style={{ height: '100%', width: '100%', background: '#0D1117' }}
    />
  );
};

export default LiveMap;


// ==========================================

// src/components/SOS/SOSForm.jsx
import { useState } from 'react';
import useSOS from '../../hooks/useSOS';
import useGeolocation from '../../hooks/useGeolocation';
import LoadingSpinner from '../shared/LoadingSpinner';

const CRISIS_TYPES = [
  { value: 'Medical Emergency', label: '🏥 Medical Emergency' },
  { value: 'Fire', label: '🔥 Fire' },
  { value: 'Gas Leak', label: '⚠️ Gas Leak' },
  { value: 'Accident', label: '🚗 Accident' },
  { value: 'Other', label: '📢 Other' },
];

/**
 * SOSForm Component
 * Handles SOS type selection, anonymous toggle, notes input, and submission
 */
const SOSForm = ({ onSuccess }) => {
  const [type, setType] = useState('Medical Emergency');
  const [anonymous, setAnonymous] = useState(false);
  const [notes, setNotes] = useState('');

  const { sendSOS, loading, error } = useSOS();
  const { userLocation, locationDetected, loading: locLoading } = useGeolocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!locationDetected) return;
    try {
      await sendSOS({ type, anonymous, notes });
      onSuccess?.();
    } catch {}
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      {/* Location status */}
      <div className={`glass rounded-2xl p-4 flex items-center gap-3 ${locationDetected ? '' : 'animate-pulse'}`}
           style={{ borderColor: locationDetected ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)' }}>
        <div className="text-2xl">{locationDetected ? '📍' : '🔍'}</div>
        <div>
          <p className="text-sm font-medium">{locationDetected ? 'Location Detected' : 'Detecting...'}</p>
          <p className="text-xs text-gray-500">
            {locationDetected
              ? `${userLocation.lat.toFixed(5)}, ${userLocation.lng.toFixed(5)}`
              : 'Please allow location access'}
          </p>
        </div>
        {locLoading ? <LoadingSpinner size={20} className="ml-auto" /> : <span className="ml-auto text-green-400">✓</span>}
      </div>

      {/* Crisis type */}
      <div className="glass rounded-2xl p-4">
        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-2">
          Crisis Type
        </label>
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="inp"
        >
          {CRISIS_TYPES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* Anonymous toggle */}
      <div className="glass rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="font-medium text-sm">🕵️ Anonymous Mode</p>
          <p className="text-xs text-gray-500 mt-0.5">Hide your identity from responders</p>
        </div>
        <button
          type="button"
          onClick={() => setAnonymous(!anonymous)}
          className={`w-12 h-6 rounded-full relative transition-all ${anonymous ? 'bg-red-600' : 'bg-gray-700'}`}
        >
          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${anonymous ? 'translate-x-6' : 'translate-x-0.5'}`} />
        </button>
      </div>

      {/* Notes */}
      <div className="glass rounded-2xl p-4">
        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-2">
          Notes (Optional)
        </label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          className="inp resize-none text-sm"
          placeholder="Describe the situation..."
          rows={3}
        />
      </div>

      {error && (
        <div className="text-red-400 text-sm text-center p-3 glass rounded-xl">
          ❌ {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !locationDetected}
        className="btn-red py-4 rounded-2xl w-full flex items-center justify-center gap-2"
        style={{ fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '2px', opacity: (!locationDetected || loading) ? 0.6 : 1 }}
      >
        {loading ? (
          <><LoadingSpinner size={22} /> Sending...</>
        ) : '🆘 SEND SOS'}
      </button>
    </form>
  );
};

export default SOSForm;


// ==========================================

// src/components/Chat/ChatPanel.jsx
import { useState, useRef, useEffect } from 'react';
import useChatStore from '../../store/useChatStore';
import useSocket from '../../hooks/useSocket';

/**
 * ChatPanel Component
 * Real-time Socket-based chat between SOS broadcaster and responder
 */
const ChatPanel = ({ compact = false }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  const { messages, addMessage } = useChatStore();
  const { emit } = useSocket();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    const text = inputText.trim();
    if (!text) return;

    const msg = {
      id: Date.now(),
      from: 'You',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      own: true,
    };

    addMessage(msg);
    emit('chat:message', msg);
    setInputText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const SYSTEM_MESSAGES = [
    { id: 'sys1', system: true, text: 'Emergency channel open. Responder is on the way.' },
    { id: 'm1', from: 'You', text: "I need help! I think my friend is having a heart attack.", own: true, time: '14:32' },
    { id: 'm2', from: 'Responder', text: "I'm Dr. Chen, I'm 3 minutes away. Is the person conscious?", own: false, time: '14:33' },
  ];

  const allMessages = [...SYSTEM_MESSAGES, ...messages];

  return (
    <div className={`flex flex-col ${compact ? 'h-64' : 'h-full'}`}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {allMessages.map(msg => (
          msg.system ? (
            <div key={msg.id} className="flex justify-center">
              <span className="text-xs text-gray-600 glass px-3 py-1 rounded-full">{msg.text}</span>
            </div>
          ) : msg.own ? (
            <div key={msg.id} className="flex justify-end">
              <div className="max-w-xs">
                <div className="chat-bubble-out px-4 py-2.5 text-sm">{msg.text}</div>
                <p className="text-xs text-gray-600 text-right mt-1">{msg.time}</p>
              </div>
            </div>
          ) : (
            <div key={msg.id} className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-green-700 flex items-center justify-center text-xs flex-shrink-0 mt-1">🚑</div>
              <div className="max-w-xs">
                <p className="text-xs text-gray-500 mb-1">{msg.from}</p>
                <div className="chat-bubble-in px-4 py-2.5 text-sm">{msg.text}</div>
                <p className="text-xs text-gray-600 mt-1">{msg.time}</p>
              </div>
            </div>
          )
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 p-3 glass" style={{ borderTop: '1px solid var(--border)' }}>
        <textarea
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="inp flex-1 resize-none text-sm"
          placeholder="Type a message..."
          rows={1}
          style={{ maxHeight: '80px' }}
        />
        <button
          onClick={sendMessage}
          className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center flex-shrink-0"
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;


// ==========================================

// src/components/AI/CrisisAssistant.jsx
import { useState, useEffect } from 'react';
import aiService from '../../services/aiService';
import LoadingSpinner from '../shared/LoadingSpinner';
import useSOSStore from '../../store/useSOSStore';

/**
 * CrisisAssistant Component
 * AI-powered first response guidance panel
 */
const CrisisAssistant = ({ initialType }) => {
  const { type: sosType } = useSOSStore();
  const [selectedType, setSelectedType] = useState(initialType || sosType || 'Medical Emergency');
  const [guidance, setGuidance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const TYPES = ['Medical Emergency', 'Fire', 'Gas Leak', 'Accident', 'Other'];
  const TYPE_ICONS = { 'Medical Emergency': '🏥', 'Fire': '🔥', 'Gas Leak': '⚠️', 'Accident': '🚗', 'Other': '📢' };
  const SEVERITY_COLORS = { HIGH: '#EF4444', CRITICAL: '#FF2D20', MEDIUM: '#F59E0B', LOW: '#10B981' };

  const loadGuidance = async (type) => {
    setLoading(true);
    setGuidance(null);
    try {
      const data = await aiService.getGuidance(type);
      setGuidance(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGuidance(selectedType);
  }, [selectedType]);

  const handleFeedback = async () => {
    await aiService.submitFeedback('current', feedback);
    setFeedbackSent(true);
  };

  const severityColor = SEVERITY_COLORS[guidance?.severity] || '#6B7280';

  return (
    <div className="flex flex-col gap-4">
      {/* Type Selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TYPES.map(t => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
              t === selectedType ? 'bg-red-600 text-white' : 'glass text-gray-400'
            }`}
          >
            {TYPE_ICONS[t]} {t}
          </button>
        ))}
      </div>

      {loading && (
        <div className="glass rounded-2xl p-8 flex flex-col items-center gap-3">
          <LoadingSpinner size={32} />
          <p className="text-sm text-gray-500">AI analyzing situation...</p>
        </div>
      )}

      {guidance && !loading && (
        <>
          {/* AI Summary */}
          <div className="glass rounded-2xl p-4 slide-up" style={{ borderLeft: `3px solid ${severityColor}` }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🤖</span>
              <span className="font-semibold text-sm">AI Crisis Summary</span>
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-mono font-bold"
                    style={{ background: severityColor + '22', color: severityColor }}>
                {guidance.severity}
              </span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{guidance.summary}</p>
          </div>

          {/* Steps */}
          <div className="glass rounded-2xl p-4 slide-up">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">First Response Steps</p>
            <div className="flex flex-col gap-2">
              {guidance.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                       style={{ background: severityColor + '22', color: severityColor }}>
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-300">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div className="glass rounded-2xl p-4 slide-up">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Post-Resolution Feedback</p>
            {feedbackSent ? (
              <p className="text-sm text-green-400 text-center py-2">✅ Feedback submitted! Thank you.</p>
            ) : (
              <>
                <textarea
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  className="inp resize-none text-sm mb-3"
                  placeholder="How was the response? Share feedback..."
                  rows={3}
                />
                <button onClick={handleFeedback} className="btn-outline w-full py-2.5 text-sm rounded-xl">
                  📤 Submit Feedback
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CrisisAssistant;


// ==========================================

// src/components/shared/LoadingSpinner.jsx
/**
 * LoadingSpinner Component
 */
const LoadingSpinner = ({ size = 24, className = '' }) => (
  <div
    className={`inline-block rounded-full ${className}`}
    style={{
      width: size,
      height: size,
      border: '2px solid rgba(255,255,255,0.15)',
      borderTopColor: 'var(--red)',
      animation: 'spin 1s linear infinite',
    }}
  />
);

export default LoadingSpinner;


// ==========================================

// src/components/shared/Navbar.jsx
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/', icon: '🏠', label: 'Home' },
  { path: '/map', icon: '🗺️', label: 'Map' },
  { path: '/responder', icon: '🚑', label: 'Respond' },
  { path: '/profile', icon: '👤', label: 'Profile' },
  { path: '/admin', icon: '⚙️', label: 'Admin' },
];

/**
 * Navbar Component - Bottom navigation bar
 */
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass z-50"
         style={{ borderTop: '1px solid var(--border)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex justify-around items-center py-2 px-4 max-w-lg mx-auto">
        {NAV_ITEMS.map(item => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${active ? 'text-red-400' : 'text-gray-500'}`}
            >
              <span className={`text-xl w-10 h-10 flex items-center justify-center rounded-xl transition-all ${active ? 'bg-red-500 bg-opacity-15' : ''}`}>
                {item.icon}
              </span>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;


// ==========================================

// src/components/Responder/ResponderAlert.jsx
import useUserStore from '../../store/useUserStore';
import useSocket from '../../hooks/useSocket';

/**
 * ResponderAlert Component
 * Popup displayed when a nearby SOS is detected
 */
const ResponderAlert = ({ alert, onDismiss }) => {
  const { startResponding } = useUserStore();
  const { emit } = useSocket();

  const TYPE_ICONS = { 'Medical Emergency': '🏥', 'Fire': '🔥', 'Gas Leak': '⚠️', 'Accident': '🚗', 'Other': '📢' };
  const TYPE_COLORS = { 'Medical Emergency': '#EF4444', 'Fire': '#F97316', 'Gas Leak': '#EAB308', 'Accident': '#8B5CF6', 'Other': '#6B7280' };

  const color = TYPE_COLORS[alert.type] || '#6B7280';

  const handleRespond = () => {
    startResponding(alert.id);
    emit('responder:join', { sosId: alert.id });
    onDismiss?.();
  };

  return (
    <div className="incoming-alert glass rounded-2xl p-4 mb-3" style={{ borderLeft: `3px solid ${color}` }}>
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
             style={{ background: color + '22' }}>
          {TYPE_ICONS[alert.type] || '🆘'}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-sm" style={{ color }}>{alert.type}</span>
            {alert.urgent && (
              <span className="text-xs bg-red-500 bg-opacity-20 text-red-400 px-2 py-0.5 rounded-full">URGENT</span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>📍 {alert.distance}</span>
            <span>⏰ {alert.time}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={handleRespond} className="btn-red flex-1 py-2.5 text-sm font-semibold rounded-xl">
          🚑 I'm Responding
        </button>
        <button onClick={onDismiss} className="btn-outline py-2.5 px-3 text-sm rounded-xl">✕</button>
      </div>
    </div>
  );
};

export default ResponderAlert;
