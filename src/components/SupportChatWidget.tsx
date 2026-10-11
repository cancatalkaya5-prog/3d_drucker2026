import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Headphones,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Shield,
  RotateCcw,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const SupportChatWidget: React.FC = () => {
  const {
    isSupportChatOpen,
    setIsSupportChatOpen,
    chatSession,
    sendCustomerMessage,
    requestHumanAgent,
    resetChat,
  } = useShop();

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isSupportChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatSession.messages, isSupportChatOpen, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    const text = inputMessage.trim();
    setInputMessage('');
    setIsTyping(true);

    try {
      await sendCustomerMessage(text);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = async (text: string) => {
    setIsTyping(true);
    try {
      await sendCustomerMessage(text);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button in Bottom-Right */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsSupportChatOpen(!isSupportChatOpen)}
          className="relative flex items-center gap-2.5 px-4 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-full shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 group border border-stone-700"
          aria-label="Support & Live-Chat öffnen"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            {chatSession.waitingForHuman && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping" />
            )}
            {chatSession.isHumanConnected && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
            )}
          </div>
          <span className="text-xs font-semibold tracking-wide">
            {chatSession.isHumanConnected
              ? 'Live mit Mitarbeiter'
              : 'Support & AI-Chat'}
          </span>
        </button>
      </div>

      {/* Chat Window Popup */}
      {isSupportChatOpen && (
        <div className="fixed bottom-22 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[580px] h-[550px] bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-stone-800 flex items-center justify-center text-amber-400 border border-stone-700">
                {chatSession.isHumanConnected ? (
                  <Headphones className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Bot className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm text-stone-100 flex items-center gap-2">
                  <span>Kundenservice & Beratung</span>
                </h3>
                <div className="flex items-center gap-1.5 text-[11px]">
                  {chatSession.isHumanConnected ? (
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Mitarbeiter ist live verbunden
                    </span>
                  ) : chatSession.waitingForHuman ? (
                    <span className="text-amber-400 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      Mitarbeiter wird verbunden...
                    </span>
                  ) : (
                    <span className="text-stone-300 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      AI-Bot online · Mensch auf Abruf
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={resetChat}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors"
                title="Chat zurücksetzen"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsSupportChatOpen(false)}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors"
                aria-label="Chat schließen"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Info & Handoff Strip */}
          <div className="px-3.5 py-2 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-[11px] text-stone-600 gap-2">
            <span className="truncate">
              Rabattcode: <strong className="text-stone-900 font-mono">10pz</strong> (-10%)
            </span>

            {!chatSession.isHumanConnected && !chatSession.waitingForHuman && (
              <button
                onClick={requestHumanAgent}
                className="px-2.5 py-1 text-[10px] font-semibold text-stone-900 bg-stone-200 hover:bg-stone-300 rounded-md transition-colors whitespace-nowrap flex items-center gap-1"
              >
                <Headphones className="w-3 h-3 text-stone-700" />
                <span>Mit Mitarbeiter verbinden</span>
              </button>
            )}

            {chatSession.waitingForHuman && (
              <span className="text-[10px] text-amber-700 bg-amber-100 font-medium px-2 py-0.5 rounded">
                Wartet auf Mitarbeiter...
              </span>
            )}
          </div>

          {/* Message Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-stone-50/40 text-xs">
            {chatSession.messages.map((msg) => {
              const isCustomer = msg.sender === 'customer';
              const isStaff = msg.sender === 'human_staff';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}
                >
                  {/* Sender label */}
                  <span className="text-[10px] text-stone-400 mb-0.5 px-1 font-medium flex items-center gap-1">
                    {isCustomer && <span>Du</span>}
                    {isStaff && (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Shop-Mitarbeiter (Mensch)
                      </span>
                    )}
                    {msg.sender === 'bot' && <span>AI-Assistent</span>}
                  </span>

                  {/* Message bubble */}
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-sm ${
                      isCustomer
                        ? 'bg-stone-900 text-white rounded-br-none'
                        : isStaff
                        ? 'bg-emerald-50 text-stone-900 border-2 border-emerald-300 rounded-bl-none font-medium'
                        : 'bg-white text-stone-800 border border-stone-200 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-1 text-stone-400 text-xs pl-2">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[10px] ml-1">AI denkt nach...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips (when in bot mode) */}
          {!chatSession.isHumanConnected && !chatSession.waitingForHuman && (
            <div className="px-3 py-1.5 bg-white border-t border-stone-100 flex gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
              <button
                onClick={() => handleQuickQuestion('Wie funktioniert der Rabattcode 10pz?')}
                className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full whitespace-nowrap transition-colors"
              >
                Code 10pz?
              </button>
              <button
                onClick={() => handleQuickQuestion('Wie sind die Versandkosten?')}
                className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full whitespace-nowrap transition-colors"
              >
                Versandkosten?
              </button>
              <button
                onClick={() => handleQuickQuestion('Ich möchte bitte mit einem Mitarbeiter sprechen.')}
                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-full whitespace-nowrap transition-colors font-medium"
              >
                Mitarbeiter sprechen
              </button>
            </div>
          )}

          {/* Input Bar */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-stone-200 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                chatSession.isHumanConnected
                  ? 'Schreibe direkt mit dem Mitarbeiter...'
                  : chatSession.waitingForHuman
                  ? 'Nachricht an Mitarbeiter hinterlassen...'
                  : 'Frage stellen oder "Mitarbeiter" schreiben...'
              }
              className="flex-1 text-xs px-3 py-2 border border-stone-300 rounded-xl focus:ring-1 focus:ring-stone-900 outline-none bg-stone-50"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-30 text-white rounded-xl transition-all shadow-sm"
              aria-label="Nachricht senden"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
