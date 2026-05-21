import { ViewType } from '../types';
import { Bell, MessageCircle, PlusCircle } from 'lucide-react';

interface HeaderProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
}

export function Header({ currentView, setView }: HeaderProps) {
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
            onClick={() => setView('chat')}
            className={`font-body-md transition-colors ${currentView === 'chat' ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}`}
          >
            Mensagens
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {/* User is "Logged In" View state */}
        <div className="hidden sm:flex items-center gap-2">
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all duration-200">
            <Bell size={24} strokeWidth={2} />
          </button>
          <button 
            onClick={() => setView('chat')}
            className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all duration-200"
          >
            <MessageCircle size={24} strokeWidth={2} />
          </button>
        </div>

        {/* Dashboard Access via Avatar */}
        <div 
          onClick={() => setView('dashboard')}
          className="w-10 h-10 rounded-full border-2 border-primary cursor-pointer hover:scale-105 transition-transform overflow-hidden hidden sm:block bg-surface-container-high"
        >
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDokbwjIGplTVdIwP8m8iIpBKkCod4vciw0X9P5bCwwLvWr7ClRWLwQl-OSHdMF5mgv_zQpGhY-PlWSSRj_a4QWbYkOdvzsCYPFVcVn7rCLUxnZ7mXUUjvGyxz6bd4UulxMfXfzUjNzOyp6YoUqwI0sH8TcSVoeKn7z31ea1KWCi1ewKgiApq--TIHclQV4f1gi_XXBFhEkEWSenL0jIFyq3IK8peX-Cq5U-nN4oeezZCWKwh_CCm6AYjBG86bXuQR2NcYSVAulNUM" 
            alt="User Avatar" 
            className="w-full h-full object-cover"
          />
        </div>

        <button 
          onClick={() => setView('create')}
          className="bg-secondary-container text-on-secondary-container font-label-md font-bold px-4 py-2 md:px-6 md:py-2.5 rounded-full hover:shadow-lg transition-all duration-200 active:scale-95 flex items-center gap-2"
        >
          <span className="hidden md:inline">Anunciar</span>
          <span className="md:hidden"><PlusCircle size={20} /></span>
        </button>
      </div>
    </header>
  );
}
