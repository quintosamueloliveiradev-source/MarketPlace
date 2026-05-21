import { Search, MapPin, Clock, Heart, ArrowRight, Verified, Zap, HeadphonesIcon } from 'lucide-react';
import { ViewType } from '../types';
import { useState, useEffect } from 'react';

interface ExploreViewProps {
  setView: (view: ViewType) => void;
}

export function ExploreView({ setView }: ExploreViewProps) {
  const [ads, setAds] = useState<any[]>([]);
  const [loadingAds, setLoadingAds] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  const [selectedState, setSelectedState] = useState('BR');
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const states = ['BR', 'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RR', 'SC', 'SP', 'SE', 'TO'];

  useEffect(() => {
    fetch('/api/ads')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          console.warn("DB not connected, using fallback data");
          setDbError("Aviso de Preview: Banco de dados não configurado. Exibindo dados de exemplo.");
          setAds(listings); // use fallback
        } else {
          // If empty, we can still show fallback for UI demonstration
          if (Array.isArray(data) && data.length === 0) {
            setAds(listings);
          } else if (Array.isArray(data)) {
            setAds(data.map(d => ({
              id: d.id,
              title: d.title,
              price: d.price,
              location: d.location,
              time: 'Recentemente',
              image: (d.images && d.images[0]) || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
              liked: false
            })));
          }
        }
      })
      .catch((err) => {
        setDbError("Falha na conexão. Exibindo dados de exemplo.");
        setAds(listings);
      })
      .finally(() => setLoadingAds(false));
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero & Search Section */}
      <section className="relative bg-primary-container py-16 md:py-24 px-margin-mobile flex-shrink-0 z-30">
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-secondary-fixed rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-tertiary-fixed-dim rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-[800px] mx-auto text-center relative z-40 w-full">
          <h1 className="font-headline-lg text-[32px] md:text-display-lg text-white mb-8">
            O que você está procurando hoje?
          </h1>
          <div className="flex items-center w-full h-16 bg-white rounded-full shadow-2xl focus-within:ring-4 focus-within:ring-white/40 focus-within:outline-none relative z-50 transition-shadow">
            <div 
              className="flex items-center h-full pl-5 md:pl-6 pr-4 border-r border-outline-variant/30 cursor-pointer relative rounded-l-full transition-colors group outline-none"
              onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
            >
              <MapPin className="text-outline/70 w-5 h-5 mr-2 flex-shrink-0 group-hover:text-primary transition-colors" />
              <div className="font-medium text-gray-900 border-none outline-none focus:ring-0 cursor-pointer pr-4 md:pr-5 group-hover:text-primary transition-colors h-full flex items-center justify-center w-8 md:w-10 text-base md:text-lg select-none">
                {selectedState}
              </div>
              <div className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-gray-500 w-2.5 h-2.5 md:w-3 md:h-3 group-hover:text-primary transition-transform ${isStateDropdownOpen ? 'rotate-180' : ''}`}>
                  <path d="M1 1L5 5L9 1" />
                </svg>
              </div>

              {/* Invisible overlay to close dropdown on outside click */}
              {isStateDropdownOpen && (
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsStateDropdownOpen(false);
                  }} 
                />
              )}

              {/* Dropdown Menu - Forces downward direction and centers text */}
              {isStateDropdownOpen && (
                <div className="absolute top-[calc(100%+8px)] left-2 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-outline-variant/20 py-2 w-[88px] z-50 max-h-60 overflow-y-auto overflow-x-hidden">
                  {states.map(state => (
                    <div 
                      key={state}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedState(state);
                        setIsStateDropdownOpen(false);
                      }}
                      className={`py-2.5 hover:bg-primary/5 cursor-pointer text-base md:text-lg flex justify-center items-center transition-colors ${selectedState === state ? 'text-primary font-bold bg-primary/5' : 'text-gray-700 font-medium'}`}
                    >
                      {state}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex-1 h-full relative flex items-center">
              <Search className="absolute left-3 md:left-4 text-outline/70 w-5 h-5 pointer-events-none hidden sm:block" />
              <input 
                type="text" 
                className="w-full h-full pl-3 sm:pl-10 md:pl-11 pr-4 bg-transparent border-transparent focus:border-transparent focus:ring-transparent outline-none focus:outline-none shadow-none text-gray-900 text-base md:text-lg font-body-md" 
                placeholder="Buscar carros, imóveis e muito mais..." 
              />
            </div>
            <div className="pr-2 pl-1 bg-white rounded-r-full hidden md:block">
              <button className="h-12 px-6 md:px-8 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-colors">
                Buscar
              </button>
            </div>
            <div className="pr-1 pl-1 bg-white rounded-r-full md:hidden">
              <button className="h-10 w-10 flex items-center justify-center bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-colors">
                <Search size={18} />
              </button>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <span className="text-white/80 text-sm font-medium">Buscas populares:</span>
            <a href="#buscas" onClick={(e) => e.preventDefault()} className="text-white text-sm hover:underline">iPhone 15 Pro</a>
            <a href="#buscas" onClick={(e) => e.preventDefault()} className="text-white text-sm hover:underline">Honda Civic</a>
            <a href="#buscas" onClick={(e) => e.preventDefault()} className="text-white text-sm hover:underline">Apartamento Centro</a>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full flex-shrink-0">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-headline-md text-headline-md">Categorias em Destaque</h2>
          <a href="#categorias" onClick={(e) => e.preventDefault()} className="text-primary font-bold flex items-center gap-1 hover:underline">
            Ver todas <ArrowRight size={20} />
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-square bg-surface-container-low rounded-2xl flex flex-col items-center justify-center gap-4 transition-all duration-300 group-hover:bg-primary-fixed">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-primary group-hover:scale-110 transition-transform">
                  <cat.icon size={32} />
                </div>
                <span className="font-bold text-on-surface">{cat.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Items - Bento Grid Style */}
      <section className="py-12 bg-surface-container-lowest border-y border-outline-variant/30 flex-shrink-0 w-full">
        <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="text-secondary-container fill-current" />
            <h2 className="font-headline-md text-[24px]">Anúncios em Destaque</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            {/* Major Featured */}
            <div className="md:col-span-8 group relative overflow-hidden rounded-3xl bg-on-background h-[400px]">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEaoaQyQO75tEX7wEWVpmtCyZi1SCW5hiAsulwH9YBHI16XqWPVIS7qYzfe8bQnJtSRw8J7xsJv2YYMnMTwlvccoj3mt0dqZPfvdcGxL7eHibA-9mjh3uEdMxR_ps8H-eFX5KTvCxcUq93Seam-lLkxdlTKeJg6AxPy585uQJJSjEzk0SrCgL_7y6v_-E1DgL63hjwnk3_vuOk2KP6jgl1opQuH4-IuDoCQOuLn2cH313uX8kzQmpgcsbABaNksRX4MKRwN4CXSNg" 
                alt="Apartamento" 
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-6 left-6 z-10">
                <span className="bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">
                  Destacado
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <h3 className="text-white font-headline-lg text-[32px] mb-2">Cobertura Duplex no Itaim Bibi</h3>
                <div className="flex items-center justify-between">
                  <p className="text-white/90 text-xl font-bold">R$ 4.500.000</p>
                  <button className="bg-white text-on-background px-6 py-2 rounded-full font-bold hover:bg-primary hover:text-white transition-colors">
                    Ver Detalhes
                  </button>
                </div>
              </div>
            </div>

            {/* Secondary Featured */}
            <div className="md:col-span-4 flex flex-col gap-gutter">
              <div 
                onClick={() => setView('product')}
                className="flex-1 group relative overflow-hidden rounded-3xl bg-on-background min-h-[188px] cursor-pointer"
              >
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3YePeG9K8j-FgZcMtT2cmMyPABoU6gI2-hOF2yj4r0CSIalTBK2vsAg9hG1uoV-FJ8Ftl3hNk95iF6ZSLcLOktkTfmpNfPEyx5cTl4QJaHY7pJEZlUw2hCAgVzBxpeL89_9S0O9syPb6Wv-TiprehfuTZvUwIgRgCcI_avQDxCkWLGxVgztW-43BBN-IK7x01x2DsZfYhHAh5dmqovvBpNCvmfiQ5PMfeXDwkzY3ajH-RMajs0IyRnUSifUIhFH7qVdqDEN7EB-E" 
                  alt="Camera" 
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold uppercase">
                    Novo
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 z-10">
                  <h4 className="text-white font-bold text-title-lg">Câmera Pro Vision X-Pro</h4>
                  <p className="text-white/80 text-sm">Apenas R$ 12.500</p>
                </div>
              </div>
              <div className="flex-1 group relative overflow-hidden rounded-3xl bg-on-background min-h-[188px]">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzHE8VJwjKIDH5Hr9IHQwn7mAd_fpN0sUOeSbwjAtdCPvMtStIaVwY8zCKmnDJrZcZqocBh3SUjqLo8CLPCH0lmJR5Cd7WHP1RXwmsIAf05_ussTp6kdo0EDdKQXIpujqAsFX-GRETsuOf0aI7CwQd9Jr0G-Hz1_NS8tWWFc-xzowJNMlcBja3YRMu2Jd8c1Ddegrjj37EC4tvYcEDmFjKLwdwZWxrm7dWdF0tJmuTmQ9NFM5VSmeKltIjvWLJ9FWtO4rrKQQ9xwg" 
                  alt="Car" 
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold uppercase">
                    Oferta
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 z-10">
                  <h4 className="text-white font-bold">Seminovos Certificados</h4>
                  <p className="text-white/80 text-sm">Garantia estendida de 1 ano</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Listing Grid */}
      <section className="py-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full flex-grow">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h2 className="font-headline-md text-[24px]">Recentemente Adicionados</h2>
            <p className="text-on-surface-variant">Confira as últimas oportunidades publicadas hoje</p>
          </div>
          <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 hide-scrollbar w-full md:w-auto">
            <button className="bg-primary text-white px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap">Tudo</button>
            <button className="border border-outline-variant text-on-surface-variant px-5 py-2 rounded-full font-medium text-sm hover:border-primary hover:text-primary transition-colors whitespace-nowrap">Veículos</button>
            <button className="border border-outline-variant text-on-surface-variant px-5 py-2 rounded-full font-medium text-sm hover:border-primary hover:text-primary transition-colors whitespace-nowrap">Imóveis</button>
            <button className="border border-outline-variant text-on-surface-variant px-5 py-2 rounded-full font-medium text-sm hover:border-primary hover:text-primary transition-colors whitespace-nowrap">Eletrônicos</button>
          </div>
        </div>

        {dbError && (
          <div className="w-full mb-6 p-4 bg-error-container text-on-error-container rounded-lg font-medium text-sm">
            {dbError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter w-full">
          {loadingAds ? (
            <div className="col-span-full py-12 text-center text-on-surface-variant">Carregando anúncios...</div>
          ) : ads.map((item, i) => (
            <div 
              key={i} 
              className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden card-lift cursor-pointer group"
              onClick={() => setView('product')}
            >
              <div className="relative aspect-[4/3]">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                <button className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-on-surface-variant hover:text-error transition-colors">
                  <Heart size={20} fill={item.liked ? "currentColor" : "none"} className={item.liked ? "text-error" : ""} />
                </button>
              </div>
              <div className="p-5">
                <p className="text-primary font-bold text-xl mb-1">R$ {item.price}</p>
                <h3 className="font-bold text-on-surface line-clamp-1 mb-3 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center gap-4 text-xs text-on-surface-variant">
                  <span className="flex items-center gap-1"><MapPin size={14} /> {item.location}</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {item.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center w-full">
          <button className="px-10 py-4 border-2 border-primary text-primary font-bold rounded-full hover:bg-primary hover:text-white transition-all duration-300">
            Carregar mais ofertas
          </button>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-primary-container/5 py-20 w-full flex-shrink-0">
        <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm mb-6">
                <Verified size={32} />
              </div>
              <h3 className="font-bold text-xl mb-3">Segurança Total</h3>
              <p className="text-on-surface-variant">Vendedores verificados e sistema de proteção ao comprador.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm mb-6">
                <Zap size={32} />
              </div>
              <h3 className="font-bold text-xl mb-3">Venda Rápida</h3>
              <p className="text-on-surface-variant">Anuncie em segundos e alcance milhares de compradores.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm mb-6">
                <HeadphonesIcon size={32} />
              </div>
              <h3 className="font-bold text-xl mb-3">Suporte 24/7</h3>
              <p className="text-on-surface-variant">Nossa equipe de atendimento está pronta para ajudar.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Icons Placeholder for categories
const Car = ({size}: {size:number}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>;
const Home = ({size}: {size:number}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const Smartphone = ({size}: {size:number}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>;
const Armchair = ({size}: {size:number}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"/><path d="M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z"/><path d="M5 18v2"/><path d="M19 18v2"/></svg>;
const Shirt = ({size}: {size:number}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>;
const Trophy = ({size, className}: {size?:number, className?: string}) => <svg width={size||24} height={size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>;

const categories = [
  { name: 'Carros', icon: Car },
  { name: 'Imóveis', icon: Home },
  { name: 'Eletrônicos', icon: Smartphone },
  { name: 'Móveis', icon: Armchair },
  { name: 'Moda', icon: Shirt },
  { name: 'Esportes', icon: Trophy },
];

const listings = [
  {
    title: 'Smartwatch Series 9 - Novo Lacrado',
    price: '1.250',
    location: 'São Paulo, SP',
    time: '14:30',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtDoue5TaOWyGI-wghNtNPfSAUf8ZmaNZ8yZkKzyvgy4uxNUZiYEsyFnORJ4zE2a03jqtT5EdNvkXNh1LtB1aWcNCArv1ytobdp8-6UKIGO_JOqNPtsxtctYQ5UN_YOfS7dvoPAuorZRDjqPtzh32E5faPf43c9Evx9nAEaaYKunyvTLOoWoF_fdzQQTTqFxIF69YCfh-goLWTd_5JhOyqzm2OM34HomkpH_avRZ9UxY7DFqfa_4w6Pu5QCkSd7wLiHnAhGPbjOEE',
    liked: false
  },
  {
    title: 'Câmera Profissional Vision X-Pro',
    price: '12.500',
    location: 'Rio de Janeiro, RJ',
    time: '12:15',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3YePeG9K8j-FgZcMtT2cmMyPABoU6gI2-hOF2yj4r0CSIalTBK2vsAg9hG1uoV-FJ8Ftl3hNk95iF6ZSLcLOktkTfmpNfPEyx5cTl4QJaHY7pJEZlUw2hCAgVzBxpeL89_9S0O9syPb6Wv-TiprehfuTZvUwIgRgCcI_avQDxCkWLGxVgztW-43BBN-IK7x01x2DsZfYhHAh5dmqovvBpNCvmfiQ5PMfeXDwkzY3ajH-RMajs0IyRnUSifUIhFH7qVdqDEN7EB-E',
    liked: true
  },
  {
    title: 'Toyota Corolla 2.0 XEi 2021',
    price: '89.900',
    location: 'Curitiba, PR',
    time: 'Ontem',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsWE-qvH2uDdAVt2RJuTsHQiyy5BXRY6mPdnH_fSQOKbYRBk0esNzTWQrAFpVt29pOTN2UIlP5igV5zUcwvOHKjZFDXZIWw3up1w8n2_D-QgKp4sOGEm1hlfuwqL1-AXZARhXAVx6_uo8i8WclFJxKHgWX8WGTTaPbDSCAd77uugpzN-6eo9uhKJNc3mrKjusxJJWE_Nh38FWj1UN8RSxfvYONiFfn_Lur14W2eXMvWaoDVh4Ocu_ij8l4bjpScfMfGMdqYTy9qEI',
    liked: false
  },
  {
    title: 'MacBook Air M2 8GB 256GB SSD',
    price: '6.400',
    location: 'Belo Horizonte, MG',
    time: '09:45',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYYjO4pI335ib95tfmUMtaOc7egDLF4MfnMXiJ_aMVEMPThNChvRSIEl37DyevrVEQAFfLWP_fBtWCikRtz2y6l7Pa10F5Cnqvl5Whb2QVcnPRKoNHOoffalGGJqDFmGbncvIa3HRVfElX1W3J8nq4vEW6HYDV7TsPQ9uysg0zQ558w0aPCwEIC5KcNR44n84mixczwpzNMjYBmm1d92Z_pAxs6EuB8QexR-hxn4uHCoabzKrbWdkvoq5hOgxRaVyk5kqGRw3W2y0',
    liked: false
  },
  {
    title: 'Air Fryer Digital 4L - Pouco Uso',
    price: '450',
    location: 'Florianópolis, SC',
    time: '2 horas atrás',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWXzqgrAmA6YOkxRkZdejDUsnfwfYDBVxirVHZd5Gp0aXBbx9VkkzjsmMCZrQWrrIHIP8zaNby62oSVt4PbE9G6a3uMYFCJP0mAb_tdx4PcBALAfM9AbswjxzCBM7etdYjTFN8QqEE8RmkxLaS6ynXb7eSlBvYMBpVafBngWMRWrCsq-3Tg9X0xdXpyWoiVNu19KlCrwkzx-sm4K9qA-SfWuZV3l2-JXpUD7qxxuV5dZEAh_Pe3IJVXoNgC9fQcWkEGHDF6SkD_Bw',
    liked: false
  },
  {
    title: 'Violão Taylor GS Mini - Impecável',
    price: '1.800',
    location: 'Porto Alegre, RS',
    time: '45 min',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTC9e_bp2HWTDd9jUBDnd2gGEqVtX1Rjc708IMvHiqG-5897rhk2fpbvWCzpcsDZmnue-UM4ErEblLBJoVjrlpUjXqdOxHI4UUJ2nxvQWH9S9iXN9Faje6Cwrro7i4rezuey09n88GZwXvziPqBaLwNpfOptDUt8YJctjBL3Wq85mT7cI9VR4SeBIMSrxjWZs00PPkZVdFwBZAUBdbbo8RwNgI0IcO0b2DrWNbVtZvCG2e3njBR0I3eQBhqHF69RVArsc3ZQvwfl8',
    liked: true
  },
  {
    title: 'Sony WH-1000XM4 com NF e Garantia',
    price: '1.100',
    location: 'Salvador, BA',
    time: 'Agora',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxMxuVfHeSGVpPtDQWXUL6H53XjZPk0NQhQN-2ZA_Yrly6LPFC864gkuKa4CvEi9NQCWMh8ejB_fCL8tI3zuoUQZif_w9UkyJcuuWS1U4BJXuAgXhkb85Qtuvo3HXroceDBM427a1l77V8bm8k6O0teMDVDQbB3C0msT-4zJ992BSn39snxqhMkVhtHN0xezNv8OsGyWSWjcKn9Kc2RsZyeBUjgf0ZPA6shEFW2KGMToPXyILIkCtzbZcAsMcplCgY_a-9E70xzuw',
    liked: false
  },
  {
    title: 'Monitor Gamer 34" Curvo 144Hz',
    price: '2.450',
    location: 'Vitória, ES',
    time: '10 min',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAl1uqnwIgzOgqsPjXDD3aiaaMa6alJqO3n8O6bIjW2qnmZVg0ZtL7-_EvQGK2ppPQfNbtV0ok0NkZ6-UMbt8bo-YPRi6_NK1VXWU8S4CnjilKUpUlWNy0uEkZtDObi5GLmHlqTtrzEuIi14bHa0ztQu_z0A6xGsnJfKmZMROe9Ql6yU3xAy9WLqc54n7QYJGWCNwFgXaW48149CMaCP3L3sFRQwN36u-U6uKpTisjT704fFjAjl_KN9q3X0ij6VU5CQ6ZyeMvPfgI',
    liked: false
  }
];
