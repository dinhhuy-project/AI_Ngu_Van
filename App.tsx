import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import { MenuIcon } from './components/IconComponents';

const App: React.FC = () => {
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false);

  // Automatically open the history panel on larger screens on initial load
  useEffect(() => {
    if (window.innerWidth >= 768) { // Tailwind's 'md' breakpoint
      setIsHistoryPanelOpen(true);
    }
  }, []);


  return (
    <div className="flex flex-col h-screen bg-transparent text-slate-900">
      <header className="bg-[url('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1973&auto=format&fit=crop')] bg-cover bg-center border-b border-slate-200 px-4 sm:px-6 py-3 sticky top-0 z-20 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold text-white [text-shadow:0px_2px_4px_rgba(0,0,0,0.6)]">
            Thầy/Cô Ngữ Văn AI 📚
          </h1>
          <button
            onClick={() => setIsHistoryPanelOpen(true)}
            className="p-2 text-white md:hidden"
            aria-label="Mở lịch sử trò chuyện"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <ChatInterface 
          isHistoryPanelOpen={isHistoryPanelOpen}
          setIsHistoryPanelOpen={setIsHistoryPanelOpen}
        />
      </main>
    </div>
  );
};

export default App;
