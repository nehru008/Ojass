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