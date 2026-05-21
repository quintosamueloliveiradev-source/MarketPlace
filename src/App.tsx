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
  const [view, setView] = useState<ViewType>('explore');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [intendedView, setIntendedView] = useState<ViewType>('explore');

  useEffect(() => {
    // Check active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      if (!session) {
        setView((prevView) => {
          if (prevView !== 'explore' && prevView !== 'product' && prevView !== 'login') {
            return 'explore';
          }
          return prevView;
        });
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
        {view === 'explore' && <ExploreView setView={setView} />}
        {view === 'product' && <ProductView setView={setView} />}
        {view === 'dashboard' && <DashboardView setView={setView} />}
        {view === 'chat' && <ChatView />}
        {view === 'create' && <CreateAdView setView={setView} />}
        {view === 'login' && <LoginView setView={setView} onLoginSuccess={handleLoginSuccess} />}
      </main>

      {/* Do not show the standard footer on the chat view or login view to maximize screen space */}
      {view !== 'chat' && view !== 'login' && <Footer />}
    </div>
  );
}

