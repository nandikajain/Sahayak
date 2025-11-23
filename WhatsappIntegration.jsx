import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Phone, Trash2, Clock, Smartphone, User, X, Plus, ChevronRight, Settings } from 'lucide-react';

const App = () => {
  // State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [view, setView] = useState('compose'); // 'compose', 'history', 'settings'
  const [showTemplates, setShowTemplates] = useState(false);

  // Load history from local storage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('zapConnectHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save history to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('zapConnectHistory', JSON.stringify(history));
  }, [history]);

  // Clean phone number (remove non-digits)
  const cleanNumber = (num) => {
    return num.replace(/\D/g, '');
  };

  // Handle WhatsApp Redirection
  const handleSendToWhatsApp = () => {
    if (!phoneNumber) return;

    const cleanedParams = cleanNumber(phoneNumber);
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${cleanedParams}?text=${encodedMessage}`;

    // Add to history
    const newEntry = {
      id: Date.now(),
      phone: phoneNumber,
      message: message || '(No text)',
      timestamp: new Date().toLocaleString()
    };
    
    // update history, keeping only last 10
    const newHistory = [newEntry, ...history].slice(0, 10);
    setHistory(newHistory);

    // Open WhatsApp
    window.open(url, '_blank');
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('zapConnectHistory');
  };

  const templates = [
    "Hi, I'm interested in your product.",
    "Can you share your location?",
    "I'll call you back later.",
    "Is this item still available?",
    "Hello! Just checking in."
  ];

  const insertTemplate = (text) => {
    setMessage(prev => prev + (prev ? " " : "") + text);
    setShowTemplates(false);
  };

  return (
    <div className="min-h-screen bg-[#e5ddd5] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Pattern Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{
             backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png')", // Using a generic placeholder for the "doodle" feel
             backgroundSize: "400px",
             backgroundRepeat: "space"
           }}>
      </div>
      
      {/* Main App Container */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden z-10 flex flex-col h-[85vh]">
        
        {/* Header */}
        <div className="bg-[#075e54] p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <MessageCircle className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">ZapConnect</h1>
              <p className="text-green-100 text-xs">Direct WhatsApp Sender</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setView('history')}
              className={`p-2 rounded-full transition ${view === 'history' ? 'bg-white/20 text-white' : 'text-green-100 hover:bg-white/10'}`}
              title="History"
            >
              <Clock size={20} />
            </button>
            <button 
              onClick={() => setView('compose')}
              className={`p-2 rounded-full transition ${view === 'compose' ? 'bg-white/20 text-white' : 'text-green-100 hover:bg-white/10'}`}
              title="Compose"
            >
              <Smartphone size={20} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto relative bg-[#efeae2]">
          
          {view === 'compose' && (
            <div className="p-4 space-y-6">
              
              {/* Phone Input Card */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <label className="block text-sm font-medium text-[#075e54] mb-2 flex items-center gap-2">
                  <Phone size={16} />
                  Recipient Number
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">+</span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="CountryCode + Number (e.g., 15550199)"
                    className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#25d366] focus:border-transparent outline-none transition"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Enter full number with country code. No spaces or dashes needed.
                </p>
              </div>

              {/* Message Input Area */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-[#075e54] flex items-center gap-2">
                    <MessageCircle size={16} />
                    Message
                  </label>
                  <button 
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="text-xs text-[#128c7e] font-semibold hover:underline flex items-center gap-1"
                  >
                    {showTemplates ? <X size={12}/> : <Plus size={12}/>} 
                    Quick Templates
                  </button>
                </div>

                {/* Templates Dropdown */}
                {showTemplates && (
                  <div className="mb-3 grid grid-cols-1 gap-2 animate-in fade-in slide-in-from-top-2">
                    {templates.map((t, i) => (
                      <button 
                        key={i}
                        onClick={() => insertTemplate(t)}
                        className="text-left text-xs bg-green-50 text-green-800 p-2 rounded hover:bg-green-100 transition truncate"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full h-32 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#25d366] focus:border-transparent outline-none resize-none transition"
                />
              </div>

              {/* Action Button */}
              <button
                onClick={handleSendToWhatsApp}
                disabled={!phoneNumber}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-lg
                  ${phoneNumber 
                    ? 'bg-[#25d366] hover:bg-[#128c7e] text-white shadow-green-200' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              >
                <Send size={24} />
                Open WhatsApp
              </button>
              
              <div className="text-center text-xs text-gray-400">
                This will redirect you to the WhatsApp application securely.
              </div>
            </div>
          )}

          {view === 'history' && (
            <div className="p-4">
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-[#075e54] font-bold text-xl">Recent Chats</h2>
                {history.length > 0 && (
                  <button 
                    onClick={clearHistory}
                    className="text-red-500 text-xs flex items-center gap-1 hover:text-red-700"
                  >
                    <Trash2 size={12} /> Clear All
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <Clock size={48} className="mb-2 opacity-50" />
                  <p>No recent history</p>
                  <button onClick={() => setView('compose')} className="mt-4 text-[#128c7e] font-semibold">Start a chat</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 group hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                           <div className="bg-green-100 p-1.5 rounded-full">
                             <User size={14} className="text-green-700" />
                           </div>
                           <span className="font-bold text-gray-800">+{item.phone}</span>
                        </div>
                        <span className="text-[10px] text-gray-400">{item.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 pl-8 border-l-2 border-gray-100 my-2">
                        {item.message}
                      </p>
                      <div className="flex justify-end mt-2">
                        <button 
                          onClick={() => {
                            setPhoneNumber(item.phone);
                            setMessage(item.message);
                            setView('compose');
                          }}
                          className="text-xs bg-[#25d366] text-white px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-[#128c7e] transition"
                        >
                          Send Again <ChevronRight size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-3 text-center border-t border-gray-200">
          <p className="text-[10px] text-gray-400">
            ZapConnect is a utility tool and is not affiliated with WhatsApp Inc.
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
