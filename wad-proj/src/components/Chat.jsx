import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Chat({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Local Chat Message Simulation
    const newMsg = {
      id: Date.now(),
      text: input,
      sender: 'You', 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setInput('');
    
    // Simulate opponent's reply
    setTimeout(() => {
       const reply = {
         id: Date.now() + 1,
         text: "Nice move!",
         sender: 'Opponent', 
         timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
       };
       setMessages(prev => [...prev, reply]);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-dark-space/50 rounded-2xl border border-white/10 overflow-hidden shadow-glass relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-neon-pink/10 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-sm relative z-10">
        <h3 className="font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Match Comms</h3>
        <p className="text-xs text-neon-blue tracking-widest uppercase mt-1">Room: {roomId.slice(0,8)}...</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10 custom-scrollbar">
        {messages.length === 0 ? (
          <p className="text-center text-xs text-gray-500 uppercase tracking-widest mt-10">Comm channel open</p>
        ) : (
          messages.map((msg) => (
            <motion.div 
              initial={{ opacity: 0, x: msg.sender==='You' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              key={msg.id} 
              className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}
            >
              <span className="text-[10px] text-gray-500 mb-1 ml-1">{msg.sender} • {msg.timestamp}</span>
              <div className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm ${
                msg.sender === 'You' 
                  ? 'bg-gradient-to-r from-neon-purple to-neon-blue text-white shadow-glow-blue' 
                  : 'bg-white/10 text-gray-200 border border-white/5'
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-white/5 relative z-10">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Transmit message..."
            className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-purple transition-colors"
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            className="bg-neon-purple/20 text-neon-purple p-2 rounded-xl border border-neon-purple/50 hover:bg-neon-purple/40 hover:shadow-glow-purple disabled:opacity-50 disabled:hover:shadow-none transition-all flex items-center justify-center w-10 h-10"
          >
            ➤
          </button>
        </div>
      </form>
    </div>
  );
}
