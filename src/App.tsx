import { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ExploreView } from './views/ExploreView';
import { ProductView } from './views/ProductView';
import { DashboardView } from './views/DashboardView';
import { ChatView } from './views/ChatView';
import { CreateAdView } from './views/CreateAdView';
import { ViewType } from './types';

export default function App() {
  const [view, setView] = useState<ViewType>('explore');

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface font-sans selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Header currentView={view} setView={setView} />
      
      <main className="flex-grow flex flex-col w-full">
        {view === 'explore' && <ExploreView setView={setView} />}
        {view === 'product' && <ProductView setView={setView} />}
        {view === 'dashboard' && <DashboardView setView={setView} />}
        {view === 'chat' && <ChatView />}
        {view === 'create' && <CreateAdView setView={setView} />}
      </main>

      {/* Do not show the standard footer on the chat view to maximize screen space */}
      {view !== 'chat' && <Footer />}
    </div>
  );
}
