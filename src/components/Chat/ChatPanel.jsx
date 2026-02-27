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