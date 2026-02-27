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