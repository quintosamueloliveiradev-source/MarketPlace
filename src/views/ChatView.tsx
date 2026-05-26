import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ChatViewProps {
  preselectChat?: string | null;
  preselectAdId?: string | null;
}

export function ChatView({ preselectChat, preselectAdId }: ChatViewProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(preselectChat || null);
  const [newMessage, setNewMessage] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        setUserEmail(session.user.email);
        fetchMessages(session.user.email);
      } else {
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChat]);

  const fetchMessages = async (email: string) => {
    try {
      const res = await fetch(`/api/messages?user_email=${encodeURIComponent(email)}`);
      const data = await res.json();
      
      if (!data.error) {
        setMessages(data);
        
        // Group by user
        const grouped = data.reduce((acc: any, msg: any) => {
          const otherPerson = msg.sender_email === email ? msg.receiver_email : msg.sender_email;
          if (!acc[otherPerson]) {
            acc[otherPerson] = {
              otherPerson,
              ad_title: msg.ad_title || 'Anúncio',
              lastMessage: msg.content,
              timestamp: msg.created_at,
              ad_id: msg.ad_id
            };
          } else {
            if (new Date(msg.created_at) > new Date(acc[otherPerson].timestamp)) {
              acc[otherPerson].lastMessage = msg.content;
              acc[otherPerson].timestamp = msg.created_at;
            }
          }
          return acc;
        }, {});
        
        setConversations(Object.values(grouped).sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const currentChatMessages = messages.filter(m => 
    (m.sender_email === userEmail && m.receiver_email === activeChat) ||
    (m.receiver_email === userEmail && m.sender_email === activeChat)
  );

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || !userEmail) return;

    try {
      // Find the ad_id associated with this conversation, fallback to preselectAdId
      const activeConv = conversations.find(c => c.otherPerson === activeChat);
      const ad_id = activeConv?.ad_id || preselectAdId || null;

      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ad_id,
          sender_email: userEmail,
          receiver_email: activeChat,
          content: newMessage
        })
      });
      
      const sentMsg = await res.json();
      if (!sentMsg.error) {
        setMessages([...messages, { ...sentMsg, ad_title: activeConv?.ad_title || 'Anúncio' }]);
        setNewMessage('');
        
        // Update conversation summary
        const updatedConvs = [...conversations];
        const convIndex = updatedConvs.findIndex(c => c.otherPerson === activeChat);
        if (convIndex >= 0) {
          updatedConvs[convIndex].lastMessage = sentMsg.content;
          updatedConvs[convIndex].timestamp = sentMsg.created_at;
        } else {
          updatedConvs.push({
            otherPerson: activeChat,
            ad_title: 'Anúncio (Novo)',
            lastMessage: sentMsg.content,
            timestamp: sentMsg.created_at,
            ad_id: ad_id
          });
        }
        updatedConvs.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setConversations(updatedConvs);
      } else {
        console.error("Message send error:", sentMsg.error);
        alert("Erro ao enviar mensagem: " + sentMsg.error);
      }
    } catch (e) {
      console.error(e);
      alert("Erro de conexão ao enviar mensagem");
    }
  };

  if (!userEmail) {
    return (
      <div className="flex-grow flex w-full max-w-container-max mx-auto overflow-hidden bg-surface-container-lowest shadow-sm h-[calc(100vh-80px)] items-center justify-center text-center p-6 flex-col">
         <MessageCircle size={64} className="mx-auto mb-4 text-outline" />
         <h2 className="font-bold text-headline-sm mb-2 text-on-surface">Faça login</h2>
         <p className="text-body-lg text-on-surface-variant max-w-md">
           Você precisa fazer login para acessar suas mensagens.
         </p>
      </div>
    );
  }

  return (
    <div className="flex-grow flex w-full max-w-container-max mx-auto overflow-hidden bg-surface-container-lowest border-x border-b border-outline-variant/30 h-[calc(100vh-80px)] shadow-sm">
      {/* Sidebar - Conversations List */}
      <div className={`w-full md:w-[350px] lg:w-[400px] flex-shrink-0 border-r border-outline-variant/30 flex flex-col bg-surface-container-lowest ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 md:p-6 border-b border-outline-variant/30">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Mensagens</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto w-full">
          {loading ? (
            <div className="flex justify-center p-8"><span className="text-on-surface-variant text-label-md">Carregando...</span></div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center text-on-surface-variant">
              <MessageCircle size={48} className="mb-4 text-outline" />
              <p className="font-body-md">Nenhuma conversa ainda.</p>
            </div>
          ) : (
            <ul className="divide-y divide-outline-variant/20">
              {conversations.map((conv, idx) => (
                <li key={idx}>
                  <button 
                    className={`w-full text-left p-4 hover:bg-surface transition-colors flex gap-4 ${activeChat === conv.otherPerson ? 'bg-primary/5' : ''}`}
                    onClick={() => setActiveChat(conv.otherPerson)}
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-title-md flex-shrink-0">
                      {conv.otherPerson.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="font-bold text-title-sm text-on-surface truncate">{conv.otherPerson.split('@')[0]}</span>
                        <span className="text-label-sm text-on-surface-variant flex-shrink-0 ml-2">
                          {new Date(conv.timestamp).toLocaleDateString('pt-BR', {day:'2-digit', month:'2-digit'})}
                        </span>
                      </div>
                      <p className="text-label-sm font-label-sm text-primary truncate mb-0.5">{conv.ad_title}</p>
                      <p className="text-body-sm text-on-surface-variant truncate">{conv.lastMessage}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      {activeChat ? (
        <div className={`flex-1 flex flex-col bg-surface-container-lowest min-w-0 ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-outline-variant/30 flex items-center gap-4 bg-surface">
            <button className="md:hidden text-on-surface-variant hover:text-on-surface p-2" onClick={() => setActiveChat(null)}>
              <ArrowLeft size={24} />
            </button>
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-label-lg flex-shrink-0">
              {activeChat.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-title-sm text-on-surface truncate">{activeChat}</p>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4 bg-surface-container-lowest w-full">
            {currentChatMessages.map((msg, idx) => {
              const isMe = msg.sender_email === userEmail;
              return (
                <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-2 ${isMe ? 'bg-primary text-white rounded-br-sm' : 'bg-surface-container-high text-on-surface rounded-bl-sm'}`}>
                    <p className={`text-body-md ${isMe ? 'text-white' : 'text-on-surface'}`}>{msg.content}</p>
                    <span className={`text-[10px] block mt-1 text-right ${isMe ? 'text-primary-container/80' : 'text-on-surface-variant'}`}>
                      {new Date(msg.created_at).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-4 border-t border-outline-variant/30 bg-surface">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..." 
                className="flex-1 px-4 py-3 rounded-full border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
              />
              <button 
                type="submit" 
                disabled={!newMessage.trim()}
                className="w-12 h-12 flex items-center justify-center bg-primary text-white rounded-full hover:bg-primary-container hover:text-on-primary-container transition-colors disabled:opacity-50 flex-shrink-0"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-surface-container-lowest w-full">
          <MessageCircle size={64} className="text-outline mb-4 opacity-50" />
          <p className="text-on-surface-variant font-body-lg">Selecione uma conversa para começar</p>
        </div>
      )}
    </div>
  );
}
