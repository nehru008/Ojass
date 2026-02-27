
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

