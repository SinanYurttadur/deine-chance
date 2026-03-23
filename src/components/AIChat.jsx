import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Send, Loader2, AlertCircle, Bot, User } from 'lucide-react';

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: 'Grüezi! Ich bin Alpi, dein persönlicher Auswanderer-Berater. Ich begleite dich Schritt für Schritt auf deinem Weg in die Schweiz – von der ersten Idee bis zum Ankommen. Stell mir jede Frage zu Jobsuche, Bewilligungen, Wohnung, Versicherungen, Steuern und mehr. Zusammen erstellen wir deinen individuellen Plan!',
};

const QUICK_QUESTIONS = [
  'Wo fange ich an?',
  'Was brauche ich für die B-Bewilligung?',
  'Wie finde ich eine Wohnung?',
  'Wie funktioniert die Krankenversicherung?',
  'Was bietet diese Plattform?',
];

const AIChat = () => {
  const { getAccessToken } = useAuth();
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const showChips = messages.length === 1; // only welcome message

  const sendMessage = async (directText) => {
    const text = (directText || input).trim();
    if (!text || isLoading) return;

    setError(null);
    if (!directText) setInput('');

    const userMessage = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    // Only send user/assistant messages (skip welcome)
    const apiMessages = updatedMessages
      .filter((_, i) => i > 0) // skip welcome
      .map(m => ({ role: m.role, content: m.content }));

    try {
      const token = getAccessToken();
      if (!token) {
        throw new Error('Nicht eingeloggt. Bitte lade die Seite neu.');
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ messages: apiMessages }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Fehler ${res.status}`);
      }

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Zeitüberschreitung – bitte versuche es erneut.');
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(null);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] sm:h-[500px] md:h-[600px] max-h-[600px] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50">
        <div className="w-9 h-9 bg-gradient-to-br from-swiss-red to-red-600 rounded-full flex items-center justify-center shadow-sm">
          <span className="text-base">🏔️</span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">Alpi – Dein Auswanderer-Berater</h3>
          <p className="text-xs text-green-600 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            Immer für dich da
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user'
                ? 'bg-swiss-red'
                : 'bg-gradient-to-br from-swiss-red to-red-600'
            }`}>
              {msg.role === 'user'
                ? <User className="w-3.5 h-3.5 text-white" />
                : <span className="text-xs">🏔️</span>
              }
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === 'user'
                ? 'bg-swiss-red text-white rounded-tr-sm'
                : 'bg-gray-100 text-gray-800 rounded-tl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {/* Quick-question chips */}
        {showChips && !isLoading && (
          <div className="flex flex-wrap gap-2 pt-2">
            {QUICK_QUESTIONS.map(q => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="px-3 py-1.5 text-sm bg-swiss-red/10 text-swiss-red rounded-full hover:bg-swiss-red hover:text-white transition-colors font-medium"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-swiss-red to-red-600 flex items-center justify-center flex-shrink-0">
              <span className="text-xs">🏔️</span>
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 px-4 py-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Frag Alpi etwas..."
            rows={1}
            className="flex-1 resize-none px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-swiss-red max-h-32"
            disabled={isLoading}
          />
          <button
            onClick={() => sendMessage(null)}
            disabled={!input.trim() || isLoading}
            className="bg-swiss-red hover:bg-swiss-red-dark disabled:bg-gray-300 text-white p-2.5 rounded-xl transition-colors flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          KI-generierte Antworten – keine Rechtsberatung
        </p>
      </div>
    </div>
  );
};

export default AIChat;
