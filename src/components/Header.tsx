import { useState } from 'react';
import { ViewType } from '../types';
import { Bell, MessageCircle, PlusCircle, LogOut, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface HeaderProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  isLoggedIn: boolean;
  onProtectedAction: (view: ViewType) => void;
}

export function Header({ currentView, setView, isLoggedIn, onProtectedAction }: HeaderProps) {
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowMenu(false);
  };

  return (
    <header className="sticky top-0 z-50 flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto shadow-sm bg-surface dark:bg-on-background">
      <div className="flex items-center gap-8">
        <span 
          onClick={() => setView('explore')}
          className="font-display-lg text-[24px] md:text-[32px] font-bold text-primary dark:text-primary-fixed cursor-pointer"
        >
          MarketPlace
        </span>
        <nav className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => setView('explore')}
            className={`font-body-md transition-colors ${currentView === 'explore' ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}`}
          >
            Explorar
          </button>
          <button className="text-on-surface-variant hover:text-primary transition-colors font-body-md">
            Categorias
          </button>
          <button className="text-on-surface-variant hover:text-primary transition-colors font-body-md">
            Favoritos
          </button>
          <button 
            onClick={() => onProtectedAction('chat')}
            className={`font-body-md transition-colors ${currentView === 'chat' ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}`}
          >
            Mensagens
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {/* User is "Logged In" View state */}
        {isLoggedIn ? (
          <>
            <div className="hidden sm:flex items-center gap-2">
              <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all duration-200">
                <Bell size={24} strokeWidth={2} />
              </button>
              <button 
                onClick={() => onProtectedAction('chat')}
                className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all duration-200"
              >
                <MessageCircle size={24} strokeWidth={2} />
              </button>
            </div>

            {/* Dashboard Access via Avatar */}
            <div className="relative hidden sm:block">
              <div 
                onClick={() => setShowMenu(!showMenu)}
                className="w-10 h-10 rounded-full border-2 border-primary cursor-pointer hover:scale-105 transition-transform overflow-hidden bg-surface-container-high flex items-center justify-center text-primary"
              >
                <User size={20} />
              </div>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-outline-variant/30 py-1 z-50">
                  <button 
                    onClick={() => { onProtectedAction('dashboard'); setShowMenu(false); }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-surface-container-low"
                  >
                    Meu Painel
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut size={16} /> Sair
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <button 
            onClick={() => setView('login')}
            className="hidden sm:block text-on-surface-variant hover:text-primary transition-colors font-body-md mr-2 rounded-full px-4 py-2 hover:bg-surface-container-low"
          >
            Entrar
          </button>
        )}

        <button 
          onClick={() => onProtectedAction('create')}
          className={`${!isLoggedIn ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-md' : 'bg-secondary-container text-on-secondary-container'} font-label-md font-bold px-4 py-2 md:px-6 md:py-2.5 rounded-full hover:shadow-lg transition-all duration-200 active:scale-95 flex items-center gap-2`}
        >
          <span className="hidden md:inline">{!isLoggedIn ? 'Anunciar grátis' : 'Anunciar'}</span>
          <span className="md:hidden"><PlusCircle size={20} /></span>
        </button>
      </div>
    </header>
  );
}
