import { Search, ChevronRight, PlusCircle, Image as ImageIcon, Smile, Send, CheckCheck } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function ChatView() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Olá! Vi seu anúncio do headphone. Ele ainda está disponível para venda?", time: "14:15", isMine: false },
    { id: 2, text: "Olá, Mariana! Sim, ainda está disponível. Ele está praticamente novo, usado apenas 2 vezes em estúdio.", time: "14:18", isMine: true },
    { id: 3, text: "Que ótimo! Você aceitaria fechar por R$ 1.100,00 para eu buscar hoje mesmo?", time: "14:20", isMine: false }
  ]);
  const [inputVal, setInputVal] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if(!inputVal.trim()) return;
    setMessages([...messages, { id: Date.now(), text: inputVal.trim(), time: "Agora", isMine: true }]);
    setInputVal('');
  };

  return (
    <div className="flex-grow flex w-full max-w-container-max mx-auto overflow-hidden bg-surface-container-lowest shadow-sm h-[calc(100vh-80px)]">
      {/* Sidebar: Conversations List */}
      <aside className="w-80 md:w-96 flex-shrink-0 border-r border-outline-variant flex flex-col bg-surface hidden md:flex">
        <div className="p-6 border-b border-outline-variant">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
            <input 
              type="text" 
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-label-md focus:ring-2 focus:ring-primary transition-all" 
              placeholder="Buscar conversas..." 
            />
          </div>
        </div>
        <div className="flex-grow overflow-y-auto chat-scroll">
          {/* Active Conv */}
          <div className="flex items-center gap-4 p-4 cursor-pointer bg-primary-fixed/30 border-l-4 border-primary">
            <div className="relative flex-shrink-0">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEfg5Bd5Yrw2BPVs57PnRzlLuFS4QADTaK2I3VTTc4MYm8bd5e2bO3ez-cGKiz1LwZI1y77OmowVdwcGLRd4JEF81CuGdbOmFzRdw_gd_qquPbv0zMG2K-rJg2TlKb35rKBkUObw_0rbmcKTnj2kB1GF1LRSLkpB87s8tmsqo2mUClLoDzJebfGfT_kGBzCyCIOAcUQZsd-iMrFNB4jwEK_eg2Qg0_k2XaT0wPRxslAk4BVsRwvDlxS9RlHhP_-3Z23rLBCQGZdvE" className="w-12 h-12 rounded-full object-cover" alt="User" />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-tertiary-fixed-dim border-2 border-surface rounded-full"></span>
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex justify-between items-center mb-1">
                <span className="font-title-lg text-title-lg text-on-surface truncate">Mariana Silva</span>
                <span className="text-label-sm text-on-surface-variant">14:20</span>
              </div>
              <p className="text-label-md text-primary font-semibold truncate">Você aceitaria fechar por R$ 1.100?</p>
            </div>
          </div>
          
          {/* Others */}
          <div className="flex items-center gap-4 p-4 cursor-pointer hover:bg-surface-container-low transition-colors border-b border-outline-variant/30">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCe9UNrSsuZMrKxx_3-Mh2nRGv_RL63ruqNcgQ7_cByZwGjw6sjbCV3kCElZhoO0WnxL5FLbCNFej1w0N6Xb-lzERRdsFOfmPAWWWgQ8IQHwsUoL6Et3-6xK5BGKcmgu9dGQ0ugmRO0aNyd9YfK6cztaHp7-NgCIpJCiTr8kksWdKII1qbAZRpjzC1MXP8H0dj0-0Nu1FQL8Y7Z5JnTKY0r8C_i13fdM2p0OD-DpNB0g65hzooFjvflj3q-8JS-ZURNVW1GRSEPg4c" className="w-12 h-12 rounded-full object-cover flex-shrink-0" alt="User" />
            <div className="flex-grow min-w-0">
              <div className="flex justify-between items-center mb-1">
                <span className="font-title-lg text-title-lg text-on-surface truncate">Ricardo Oliveira</span>
                <span className="text-label-sm text-on-surface-variant">Ontem</span>
              </div>
              <p className="text-label-md text-on-surface-variant truncate">Combinado, nos vemos na estação às 15h.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 cursor-pointer hover:bg-surface-container-low transition-colors border-b border-outline-variant/30">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgK3AM1el0FQCsrXXNvwsgLXHwh7_FyU-BD0_efjLPx9MsWSMJefFnOF5oG-3wn5vTaOKen7T4U3vW4xlUMJNMObzb7Ek3wZEnX_Y263ari_loD-5ZyP6BrzW3JMpnmGAvW5Ga3jZRTDjekNwTNt6qKacr_SXxdr1yabsWO8Qa5h-XMvStBjh74LELl8AcEZ6YRP37jV9sM2KE8AOLTPAKVyYnQK9RxF_eQGXSBLhRKmcI_k-8eIgAg-4z8M7bgXyjiyepp1g3mQM" className="w-12 h-12 rounded-full object-cover flex-shrink-0" alt="User" />
            <div className="flex-grow min-w-0">
              <div className="flex justify-between items-center mb-1">
                <span className="font-title-lg text-title-lg text-on-surface truncate">Carla Mendes</span>
                <span className="text-label-sm text-on-surface-variant">Segunda</span>
              </div>
              <p className="text-label-md text-on-surface-variant truncate">Você aceita oferta pelo console?</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat Window */}
      <section className="flex-grow flex flex-col bg-surface-container-lowest w-full">
        {/* Chat Header */}
        <header className="px-4 py-[18px] md:px-8 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-4">
            {/* Mobile back button */}
            <button className="md:hidden p-1 mr-[-8px]">
              <ChevronRight size={24} className="rotate-180 text-on-surface-variant" />
            </button>
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhEsEGUPoe4uYTlhs-i0pDi31lRXJGZTG03QdN8PSmaozDLqFatdrSI5-qNTE5jghntY140MGs_zHU9FDa6PoAZxiFxrqwzxM32uV9ecdzTdg4aFswS1TdWATdBuRg1OncJ1oy0hZ9ikwxKpFT-TcEfqGhNmH_b9zlXOwBzNJ7eBQ-8oF5uqTVsP1EQ-TY3Gt4nRGIFH2tLjLQtWd-xVvu9fnW5vkKn5QhRWVurmtLF3xh--11zzSsgr2CXcoplom2Aez08wIvKeM" className="w-10 h-10 rounded-full object-cover" alt="Avatar" />
            <div>
              <h2 className="font-title-lg text-title-lg text-on-surface">Mariana Silva</h2>
              <span className="text-label-sm text-tertiary flex items-center gap-1">
                <span className="w-2 h-2 bg-tertiary-fixed-dim rounded-full"></span> Online agora
              </span>
            </div>
          </div>
          
          {/* Item Preview */}
          <div className="hidden sm:flex items-center gap-3 bg-surface p-2 rounded-xl border border-outline-variant shadow-sm max-w-xs cursor-pointer hover:bg-surface-container-high transition-colors">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDf1VgnWcczTHjx4lR1BCNJOz3cxlJjAcotiKJvMUo1E4PkU5qF0y7cHXNkm42rqB1shWHjzLaJ36A7zcKjG2L9Ly4D7KV-4EA8jy1ePeTeh0FNf7iP1Nbo2apEwiXdX0xylv8WoUUFV3qBp5A0h5Wv-AJHvuOEGSq5njc1Z0zMYzkZjmFjXRaEJOf35kIgraEz8w1IG-Zo5Y3pUrwM84JM1csEfzguGwAn2BH0n0HLFSlUnQXw-4xUvzMGBucF-e_hWZs0LZ5Fe9c" className="w-12 h-12 rounded-lg object-cover" alt="Item" />
            <div className="min-w-0">
              <p className="text-label-md font-bold text-on-surface truncate">Headphone Premium X1</p>
              <p className="text-title-lg text-primary leading-tight">R$ 1.250,00</p>
            </div>
            <ChevronRight size={20} className="text-on-surface-variant flex-shrink-0" />
          </div>
        </header>

        {/* Messages */}
        <div className="flex-grow overflow-y-auto p-4 md:p-6 flex flex-col gap-4 chat-scroll bg-slate-50/50">
          <div className="self-center py-1.5 px-4 bg-surface-container-high rounded-full text-[11px] font-bold tracking-wider uppercase text-on-surface-variant/80 my-2">
            Hoje
          </div>
          
          {messages.map((m) => (
            <div key={m.id} className={`flex flex-col max-w-[85%] md:max-w-[70%] group ${m.isMine ? 'self-end items-end' : 'items-start'}`}>
              <div className={`p-4 rounded-2xl shadow-sm font-body-md text-base ${m.isMine ? 'bg-primary-container text-on-primary message-bubble-out' : 'bg-surface-container-high text-on-surface message-bubble-in'}`}>
                <p>{m.text}</p>
              </div>
              <span className={`text-[11px] font-medium text-on-surface-variant mt-1.5 flex items-center gap-1 ${m.isMine ? 'mr-1' : 'ml-1 opacity-0 group-hover:opacity-100 transition-opacity'}`}>
                {m.time} {m.isMine && <CheckCheck size={14} className="text-primary" />}
              </span>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <footer className="p-4 md:p-6 bg-surface border-t border-outline-variant">
          <div className="flex items-end gap-2 md:gap-4 max-w-4xl mx-auto">
            <div className="flex gap-1 md:gap-2 pb-1">
              <button className="text-primary p-2 hover:bg-surface-container-high rounded-full transition-colors flex-shrink-0">
                <PlusCircle size={24} />
              </button>
              <button className="hidden sm:block text-on-surface-variant p-2 hover:bg-surface-container-high rounded-full transition-colors flex-shrink-0">
                <ImageIcon size={24} />
              </button>
            </div>
            <div className="flex-grow relative">
              <textarea 
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={e => {
                  if(e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="w-full resize-none py-3 px-4 md:px-5 bg-surface-container-low border-none rounded-2xl text-body-md focus:ring-2 focus:ring-primary transition-all pr-12 max-h-32" 
                placeholder="Escreva sua mensagem..." 
                rows={1}
              />
              <button className="absolute right-3 bottom-3 text-on-surface-variant hover:text-primary">
                <Smile size={24} />
              </button>
            </div>
            <button 
              onClick={handleSend}
              className="bg-primary text-on-primary w-12 h-12 rounded-full flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all flex-shrink-0"
            >
              <Send size={20} className="ml-1" />
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}
