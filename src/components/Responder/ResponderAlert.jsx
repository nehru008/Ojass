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
