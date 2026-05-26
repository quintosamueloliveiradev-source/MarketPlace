import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ExploreView } from './views/ExploreView';
import { ProductView } from './views/ProductView';
import { DashboardView } from './views/DashboardView';
import { ChatView } from './views/ChatView';
import { CreateAdView } from './views/CreateAdView';
import { LoginView } from './views/LoginView';
import { ViewType } from './types';
import { supabase } from './lib/supabase';

export default function App() {
  const [view, setView] = useState<ViewType>(() => {
    return (localStorage.getItem('currentView') as ViewType) || 'explore';
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [intendedView, setIntendedView] = useState<ViewType>('explore');
  const [editingAdId, setEditingAdId] = useState<string | null>(null);
  const [viewingAdId, setViewingAdId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('currentView', view);
  }, [view]);

  useEffect(() => {
    // Check active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      setIsInitializing(false);
      
      if (!session && view !== 'explore' && view !== 'product' && view !== 'login') {
        setView('explore');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
      if (event === 'SIGNED_OUT') {
        setView('explore');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleProtectedAction = (targetView: ViewType) => {
    if (!isLoggedIn) {
      setIntendedView(targetView);
      setView('login');
    } else {
      setView(targetView);
    }
  };

  const handleLoginSuccess = () => {
    setView(intendedView === 'login' ? 'explore' : intendedView);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface font-sans selection:bg-primary-fixed selection:text-on-primary-fixed">
      {view !== 'login' && <Header currentView={view} setView={setView} isLoggedIn={isLoggedIn} onProtectedAction={handleProtectedAction} />}
      
      <main className="flex-grow flex flex-col w-full">
        {view === 'explore' && <ExploreView setView={setView} onViewAd={(id) => { setViewingAdId(id); setView('product'); }} />}
        {view === 'product' && <ProductView setView={setView} adId={viewingAdId} />}
        {view === 'dashboard' && <DashboardView setView={setView} onEditAd={(id) => { setEditingAdId(id); setView('edit'); }} />}
        {view === 'chat' && <ChatView />}
        {view === 'create' && <CreateAdView setView={setView} onClearEdit={() => setEditingAdId(null)} />}
        {view === 'edit' && <CreateAdView setView={setView} editId={editingAdId!} onClearEdit={() => setEditingAdId(null)} />}
        {view === 'login' && <LoginView setView={setView} onLoginSuccess={handleLoginSuccess} />}
      </main>

      {/* Do not show the standard footer on the chat view or login view to maximize screen space */}
      {view !== 'chat' && view !== 'login' && <Footer />}
    </div>
  );
}

