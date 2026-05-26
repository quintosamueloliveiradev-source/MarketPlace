import { useState, useEffect } from 'react';
import { ViewType } from '../types';
import { 
  ListOrdered, Mail, Heart, Settings, LogOut, 
  Eye, Users, Megaphone, Edit, Trash2, TrendingUp, Filter, Search as SearchIcon 
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DashboardViewProps {
  setView: (view: ViewType) => void;
  onEditAd?: (id: string) => void;
}

export function DashboardView({ setView, onEditAd }: DashboardViewProps) {
  const [myAds, setMyAds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndAds = async () => {
      let email = null;
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          email = session.user.email || null;
          setUserEmail(email);
        }
      } catch (e) {
        console.warn("Supabase auth not available", e);
      }
      
      const endpoint = email ? `/api/ads?user_email=${encodeURIComponent(email)}` : '/api/ads';
      fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        // Since we don't have user-specific ads yet, we'll just show the latest ads
        // and format them to match the Dashboard's expected structure
        const formattedAds = (Array.isArray(data) ? data : []).map((ad: any) => {
          let imgs = [];
          try {
            imgs = typeof ad.images === 'string' ? JSON.parse(ad.images) : ad.images;
            if (!Array.isArray(imgs)) imgs = [];
          } catch(e) {}
          return {
            title: ad.title,
            id: ad.id || Math.floor(Math.random() * 1000000).toString(),
            status: 'Ativo',
            views: Math.floor(Math.random() * 100) + 10,
            price: ad.price,
            img: imgs.length > 0 ? imgs[0] : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60"
          };
        });
        
        // Combine with mock ads if empty to keep it looking populated
        if (formattedAds.length > 0) {
          setMyAds(formattedAds);
        } else {
          setMyAds([]);
        }
      })
      .catch(err => {
        console.error("Error fetching ads:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
    };
    fetchUserAndAds();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/ads/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setMyAds(prev => prev.filter(ad => ad.id !== id));
      } else {
        try { 
          const errData = await response.json(); 
          console.error('Erro ao excluir anúncio: ' + (errData.error || response.statusText));
        } catch(e) {
          console.error('Erro ao excluir anúncio.');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 flex flex-col md:flex-row gap-gutter w-full">
      {/* Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 py-8 gap-2">
        <div className="px-4 mb-6">
          <h2 className="font-title-lg text-title-lg text-on-surface">Minha Conta</h2>
        </div>
        <nav className="flex flex-col gap-1">
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg bg-surface-container-low text-primary font-bold transition-all relative after:content-[''] after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:w-1 after:h-6 after:bg-primary after:rounded-r">
            <ListOrdered size={20} />
            <span className="font-label-md text-label-md">Meus Anúncios</span>
          </button>
          <button onClick={() => setView('chat')} className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-all">
            <Mail size={20} />
            <span className="font-label-md text-label-md">Mensagens</span>
            <span className="ml-auto bg-primary text-white text-[10px] px-2 py-0.5 rounded-full">3</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-all">
            <Heart size={20} fill="currentColor" />
            <span className="font-label-md text-label-md">Favoritos</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-all">
            <Settings size={20} />
            <span className="font-label-md text-label-md">Configurações</span>
          </button>
          <hr className="my-4 border-outline-variant"/>
          <button onClick={() => setView('explore')} className="flex items-center gap-3 px-4 py-3 rounded-lg text-error hover:bg-error-container/20 transition-all">
            <LogOut size={20} />
            <span className="font-label-md text-label-md">Sair</span>
          </button>
        </nav>
      </aside>

      {/* Content Canvas */}
      <section className="flex-1 py-4 md:py-8 w-full max-w-full overflow-hidden">
        {/* Profile Summary */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 w-full">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden shadow-lg border-2 border-white flex-shrink-0 bg-surface-variant flex items-center justify-center">
              <Users size={32} className="text-on-surface-variant" />
            </div>
            <div>
              <h1 className="font-headline-lg text-[24px] md:text-headline-lg text-on-surface truncate max-w-[200px] md:max-w-md" title={userEmail || 'Minha Conta'}>{userEmail ? `Olá, ${userEmail.split('@')[0]}` : 'Minha Conta'}</h1>
              <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1">
                {userEmail ? userEmail : 'Usuário logado'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-3 rounded-xl shadow-sm border border-outline-variant self-start md:self-auto">
            <div className="flex text-secondary-container">
               {/* Fixed stars for verified UI */}
               <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
               <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
               <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
               <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
               <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 opacity-50"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
            </div>
            <span className="font-label-md text-label-md font-bold text-on-surface">4.8 (124)</span>
          </div>
        </header>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-card-gap mb-10 w-full">
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant hover:shadow-md transition-all hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-on-surface-variant font-label-md text-label-md">Total de Visualizações</span>
              <Eye className="text-primary bg-primary-fixed p-2 rounded-lg box-content" size={20} />
            </div>
            <p className="text-[32px] font-bold text-on-surface">{myAds.reduce((acc, ad) => acc + (ad.views || 0), 0)}</p>
            <p className="text-tertiary font-label-sm text-label-sm flex items-center gap-1 mt-1">
              Visualizações totais
            </p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant hover:shadow-md transition-all hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-on-surface-variant font-label-md text-label-md">Contatos / Leads</span>
              <Users className="text-secondary bg-secondary-fixed p-2 rounded-lg box-content" size={20} />
            </div>
            <p className="text-[32px] font-bold text-on-surface">0</p>
            <p className="text-tertiary font-label-sm text-label-sm flex items-center gap-1 mt-1">
              Sem dados no momento
            </p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant hover:shadow-md transition-all hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-on-surface-variant font-label-md text-label-md">Anúncios Ativos</span>
              <Megaphone className="text-tertiary bg-tertiary-fixed p-2 rounded-lg box-content" size={20} />
            </div>
            <p className="text-[32px] font-bold text-on-surface">{myAds.length}</p>
            <p className="text-on-surface-variant font-label-sm text-label-sm mt-1">Capacidade de 20</p>
          </div>
        </div>

        {/* Ads List Table */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant overflow-hidden w-full">
          <div className="p-6 border-b border-outline-variant flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="font-headline-md text-headline-md text-on-surface">Gerenciar Anúncios</h3>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <input 
                  type="text" 
                  className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-body-md focus:ring-2 focus:ring-primary transition-shadow" 
                  placeholder="Buscar anúncio..." 
                />
                <SearchIcon size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              </div>
              <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-outline-variant font-label-md text-label-md hover:bg-surface-container-low transition-colors w-full sm:w-auto">
                <Filter size={18} /> Filtrar
              </button>
            </div>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                  <th className="px-4 py-4 min-w-[250px]">Produto</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Visualizações</th>
                  <th className="px-4 py-4">Preço</th>
                  <th className="px-4 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {myAds.map((ad, i) => (
                  <tr key={i} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-variant shrink-0 relative">
                          <img src={ad.img} alt={ad.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-on-surface font-body-md text-body-md truncate">{ad.title}</p>
                          <p className="text-on-surface-variant font-label-sm text-label-sm">ID: #{ad.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        ad.status === 'Ativo' ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' :
                        ad.status === 'Vendido' ? 'bg-secondary-fixed text-on-secondary-fixed-variant' :
                        'bg-error-container text-on-error-container'
                      }`}>
                        {ad.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-label-md text-label-md font-medium text-on-surface">{ad.views}</td>
                    <td className="px-4 py-4 font-bold text-on-surface">R$ {ad.price}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {ad.status === 'Ativo' && (
                          <button className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-label-md hover:bg-primary-container transition-all shadow-sm active:scale-95">
                            Impulsionar
                          </button>
                        )}
                        {ad.status === 'Expirado' && (
                          <button className="bg-surface-container text-primary border border-primary px-4 py-2 rounded-lg font-bold text-label-md hover:bg-primary-fixed transition-all active:scale-95">
                            Renovar
                          </button>
                        )}
                        {ad.status !== 'Vendido' && (
                          <button onClick={() => onEditAd?.(ad.id)} className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                            <Edit size={20} />
                          </button>
                        )}
                        {ad.status === 'Vendido' ? (
                           <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                              <Eye size={20} />
                            </button>
                        ) : (
                          <button onClick={() => handleDelete(ad.id)} className="p-2 text-on-surface-variant hover:text-error transition-colors">
                            <Trash2 size={20} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-surface-container-low flex justify-center">
            <button className="text-primary font-bold font-label-md text-label-md hover:underline">Ver todos os anúncios</button>
          </div>
        </div>
      </section>
    </div>
  );
}

