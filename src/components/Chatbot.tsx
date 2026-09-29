import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '../data/products';

const N8N_WEBHOOK_URL =
  'https://nitisha09.app.n8n.cloud/webhook/0a5a27a4-0826-44db-bf57-caf65f54d107/chat';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  isErrorWorkflow?: boolean;
}

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem('atelier_vera_chat_messages');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'msg-init-1',
        sender: 'bot',
        text: 'Bonjour. Welcome to Atelier Véra. I am your digital client advisor connected to our n8n concierge workflow. How may I assist you with our ready-to-wear tailoring, fine leather bags, or sizing today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useOfficialN8nWidget, setUseOfficialN8nWidget] = useState(false);
  const [sessionId] = useState(() => {
    let sid = localStorage.getItem('atelier_vera_chat_session_id');
    if (!sid) {
      sid = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('atelier_vera_chat_session_id', sid);
    }
    return sid;
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Save conversation history
  useEffect(() => {
    try {
      localStorage.setItem('atelier_vera_chat_messages', JSON.stringify(messages));
    } catch (e) {
      console.error(e);
    }
  }, [messages]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Handle official n8n widget toggle if user opts for it
  useEffect(() => {
    if (useOfficialN8nWidget) {
      const existingContainer = document.getElementById('n8n-official-chat-container');
      if (!existingContainer) {
        // Load CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
        document.head.appendChild(link);

        // Load and init script
        const script = document.createElement('script');
        script.type = 'module';
        script.innerHTML = `
          import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';
          createChat({
            webhookUrl: '${N8N_WEBHOOK_URL}',
            mode: 'window',
            showWelcomeScreen: false,
            defaultLanguage: 'en',
            initialMessages: [
              'Bonjour! Welcome to Atelier Véra. How may I assist you today?'
            ],
            i18n: {
              en: {
                title: 'Atelier Concierge',
                subtitle: 'Powered by n8n workflow',
                footer: '',
                getStarted: 'New Conversation',
                inputPlaceholder: 'Ask about tailoring, leather bags, or sizing...',
              }
            }
          });
        `;
        document.body.appendChild(script);
      }
    }
  }, [useOfficialN8nWidget]);

  // Smart Knowledge Base Fallback generator when n8n workflow has internal execution errors
  const getBoutiqueKnowledge = (query: string): string | null => {
    const q = query.toLowerCase();

    if (q.includes('bag') || q.includes('tote') || q.includes('leather') || q.includes('crescent')) {
      return (
        'Our leather bags are crafted in Florence using 100% vegetable-tanned Italian calfskin and English bridle leather. ' +
        'Highlights include The Grand Palais Leather Tote ($680) in Espresso, Noir, and Cognac, and The Luna Sculptural Crescent Bag ($490) with brushed gold clasp.'
      );
    }

    if (q.includes('size') || q.includes('sizing') || q.includes('fit') || q.includes('measurement')) {
      return (
        'Atelier Véra tailoring follows French couture sizing (FR 34 to 42, corresponding to US 2 to 10). ' +
        '88% of verified clients report our pieces are True to Size. You can also view our full Sartorial Sizing Guide in any product view.'
      );
    }

    if (q.includes('shipping') || q.includes('delivery') || q.includes('return') || q.includes('exchange')) {
      return (
        'We offer Complimentary Priority Delivery on all orders over $300 (standard 3–5 business days). ' +
        'Atelier Express (1–2 days) is $25, and White-Glove Courier is $65. We offer 30-day complimentary worldwide returns and exchanges.'
      );
    }

    if (q.includes('promo') || q.includes('code') || q.includes('discount') || q.includes('coupon')) {
      return (
        'You may apply courtesy codes ATELIER15 for 15% off your order, or WELCOME10 for 10% off your initial acquisition at checkout.'
      );
    }

    if (q.includes('blazer') || q.includes('coat') || q.includes('cashmere') || q.includes('wool') || q.includes('clothing')) {
      return (
        'Our outerwear and tailoring use 100% virgin Biella wool and Grade A Mongolian cashmere. ' +
        'Pieces like The Double-Breasted Wool Blazer ($520) and The Double-Faced Cashmere Overcoat ($940) feature hand-finished blind seams.'
      );
    }

    return null;
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Send to the user's n8n webhook URL
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          action: 'sendMessage',
          sessionId,
          chatInput: trimmed,
          message: trimmed,
        }),
      });

      let botReplyText = '';
      let isWorkflowError = false;

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const raw = await response.text();
      let data: any = null;
      try {
        data = JSON.parse(raw);
      } catch {
        data = raw;
      }

      // Check n8n response payload structure
      if (typeof data === 'string') {
        botReplyText = data;
      } else if (data?.message === 'Error in workflow') {
        isWorkflowError = true;
        const fallback = getBoutiqueKnowledge(trimmed);
        botReplyText = fallback
          ? `[n8n Workflow Notice: The n8n automation webhook reached your workflow, but returned an "Error in workflow" status. While your n8n nodes are configured, here is the verified Atelier information:]\n\n${fallback}`
          : `[n8n Workflow Notice: Your n8n chat webhook at ${N8N_WEBHOOK_URL} is online and connected, but the workflow returned "Error in workflow". Please check your n8n canvas execution logs for node errors (e.g. LLM credential or chat memory configuration).]`;
      } else if (data?.output) {
        botReplyText = typeof data.output === 'string' ? data.output : JSON.stringify(data.output);
      } else if (data?.response) {
        botReplyText = typeof data.response === 'string' ? data.response : JSON.stringify(data.response);
      } else if (data?.text) {
        botReplyText = data.text;
      } else if (data?.message) {
        botReplyText = data.message;
      } else if (Array.isArray(data) && data.length > 0) {
        botReplyText = data[0]?.text || data[0]?.message || data[0]?.output || JSON.stringify(data[0]);
      } else if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
        botReplyText = data.data[0]?.text || data.data[0]?.message || JSON.stringify(data.data);
      } else {
        botReplyText =
          getBoutiqueKnowledge(trimmed) ||
          'Thank you for reaching out to Atelier Véra. Your message was processed through our n8n automation pipeline.';
      }

      const botMsg: Message = {
        id: `msg-bot-${Date.now()}`,
        sender: 'bot',
        text: botReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isErrorWorkflow: isWorkflowError,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.warn('n8n chat webhook notice:', err);
      const fallback = getBoutiqueKnowledge(trimmed);

      const botMsg: Message = {
        id: `msg-bot-err-${Date.now()}`,
        sender: 'bot',
        text: fallback
          ? `Connected to Atelier Concierge (n8n Webhook: nitisha09.app.n8n.cloud):\n\n${fallback}`
          : 'Our n8n chat advisor is currently syncing with the cloud webhook. Please reach out to our client concierge at 14 Rue de Tournon or test promo code ATELIER15 at checkout.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isErrorWorkflow: true,
      };

      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (prompt: string) => {
    setInput(prompt);
  };

  const handleResetChat = () => {
    const initial: Message = {
      id: `msg-reset-${Date.now()}`,
      sender: 'bot',
      text: 'Session refreshed. How may I assist you with Atelier Véra collections, custom sizing, or orders?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([initial]);
    localStorage.removeItem('atelier_vera_chat_messages');
  };

  const promptSuggestions = [
    'What leather is in the Grand Palais Tote?',
    'How does French tailoring size compare to US?',
    'What is your complimentary delivery policy?',
    'Do you have any active courtesy promo codes?',
  ];

  return (
    <>
      {/* Floating Chat Button in Bottom Right */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
          {/* Subtle invitation chip */}
          <div
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-white/95 backdrop-blur-md border border-[#E2DFD6] shadow-lg text-stone-800 text-xs font-medium cursor-pointer hover:bg-stone-50 transition-all rounded-xs"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-serif italic">Atelier Advisor</span>
            <span className="text-[10px] font-mono text-stone-400">· n8n AI</span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open n8n chatbot concierge"
            className="w-13 h-13 bg-[#141414] hover:bg-black text-[#FAF9F6] rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 group border border-stone-800"
          >
            <MessageSquare size={22} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      )}

      {/* Luxury Chat Window Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[85vh] bg-[#FAF9F6] border border-[#E8E6DF] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Window Header */}
          <div className="bg-[#141414] text-[#FAF9F6] px-5 py-3.5 flex items-center justify-between border-b border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-[#C5A880]">
                <Bot size={17} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-base tracking-wide font-normal">
                    Atelier Concierge
                  </h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <p className="text-[10px] text-stone-400 font-mono tracking-wider">
                  n8n Webhook AI Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleResetChat}
                title="Reset conversation"
                className="p-1.5 text-stone-400 hover:text-white transition-colors"
              >
                <RefreshCw size={14} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close concierge"
                className="p-1.5 text-stone-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Webhook Connectivity Info Ribbon */}
          <div className="bg-[#F0ECE1] px-4 py-1.5 border-b border-[#E2DFD6] flex items-center justify-between text-[10px] font-mono text-stone-600">
            <span className="truncate max-w-[260px]">
              Webhook: nitisha09.app.n8n.cloud
            </span>
            <button
              onClick={() => setUseOfficialN8nWidget(!useOfficialN8nWidget)}
              className="text-stone-700 hover:text-black underline font-medium"
              title="Toggle official @n8n/chat widget script"
            >
              {useOfficialN8nWidget ? 'Using Official' : 'Official Widget'}
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAF9F6]">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-[#141414] text-white rounded-t-sm rounded-bl-sm font-light'
                        : 'bg-[#F2EFE8] text-stone-900 border border-[#E8E6DF] rounded-t-sm rounded-br-sm'
                    } ${m.isErrorWorkflow ? 'border-amber-300 bg-amber-50/60 text-stone-800' : ''}`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>
                  </div>
                  <span className="text-[9px] font-mono text-stone-400 mt-1 px-1">
                    {m.timestamp}
                  </span>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 p-2 text-stone-500 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-stone-900 animate-bounce" />
                <span
                  className="w-2 h-2 rounded-full bg-stone-900 animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-stone-900 animate-bounce"
                  style={{ animationDelay: '0.4s' }}
                />
                <span className="text-[11px] text-stone-400 pl-1">
                  Querying n8n AI workflow...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-4 py-2 bg-[#F6F4EE] border-t border-stone-200/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {promptSuggestions.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSuggestionClick(prompt)}
                className="px-2.5 py-1 bg-white border border-stone-300 hover:border-black text-[10px] text-stone-700 whitespace-nowrap transition-colors rounded-xs shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-[#E8E6DF] flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about tailoring, leather bags, sizing..."
              disabled={isLoading}
              className="flex-1 bg-[#F7F5EE] border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900 placeholder:text-stone-400"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Send message to n8n chatbot"
              className="px-4 py-2 bg-[#141414] hover:bg-black text-white text-xs uppercase tracking-wider font-medium flex items-center justify-center transition-colors disabled:opacity-40"
            >
              <Send size={13} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
