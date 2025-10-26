import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage, Conversation } from '../types';
import { sendMessageToAI, resetChat } from '../services/geminiService';
import Message from './Message';
import InputBar from './InputBar';
import HistoryPanel from './HistoryPanel';
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from './IconComponents';

interface ChatInterfaceProps {
  isHistoryPanelOpen: boolean;
  setIsHistoryPanelOpen: (isOpen: boolean) => void;
}

const initialMessage: ChatMessage = {
  id: 'initial',
  text: `Chào em! Thầy/Cô là **Thầy/Cô Ngữ Văn AI**.

Thầy/Cô ở đây để giúp em học Văn theo một cách đặc biệt: **không đưa bài mẫu**, mà sẽ đặt câu hỏi gợi mở để em tự mình phân tích, khám phá và tiến bộ.

Em cần Thầy/Cô hỗ trợ gì cho buổi học hôm nay? Hãy bắt đầu nhé! 📚`,
  sender: 'ai',
};

const createNewConversation = (): Conversation => ({
  id: crypto.randomUUID(),
  title: 'Cuộc trò chuyện mới',
  messages: [initialMessage],
});

const ChatInterface: React.FC<ChatInterfaceProps> = ({ isHistoryPanelOpen, setIsHistoryPanelOpen }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load from localStorage on initial render
  useEffect(() => {
    try {
      const storedConversations = localStorage.getItem('chatConversations');
      const storedActiveId = localStorage.getItem('activeConversationId');
      if (storedConversations) {
        const parsedConversations: Conversation[] = JSON.parse(storedConversations);
        if(parsedConversations.length > 0){
          setConversations(parsedConversations);
          if (storedActiveId && parsedConversations.some(c => c.id === storedActiveId)) {
            setActiveConversationId(storedActiveId);
          } else {
            setActiveConversationId(parsedConversations[0].id);
          }
        } else {
          const newConvo = createNewConversation();
          setConversations([newConvo]);
          setActiveConversationId(newConvo.id);
        }
      } else {
        const newConvo = createNewConversation();
        setConversations([newConvo]);
        setActiveConversationId(newConvo.id);
      }
    } catch (error) {
      console.error("Failed to load from localStorage", error);
      const newConvo = createNewConversation();
      setConversations([newConvo]);
      setActiveConversationId(newConvo.id);
    }
    resetChat();
  }, []);

  // Save to localStorage whenever conversations or activeId change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('chatConversations', JSON.stringify(conversations));
    }
    if (activeConversationId) {
      localStorage.setItem('activeConversationId', activeConversationId);
    }
  }, [conversations, activeConversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  const handleSendMessage = useCallback(async (text: string, file?: File) => {
    if (!activeConversation) return;

    const processAndSendMessage = async (attachment?: ChatMessage['attachment']) => {
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        text,
        sender: 'user',
        ...(attachment && { attachment }),
      };
  
      const isNewConversation = activeConversation.messages.length === 1;
      const newTitle = (text || file?.name || "Cuộc trò chuyện mới").substring(0,50);

      const updatedConversations = conversations.map(convo => {
        if (convo.id === activeConversationId) {
          return {
            ...convo,
            title: isNewConversation ? newTitle + (newTitle.length === 50 ? '...' : '') : convo.title,
            messages: [...convo.messages, userMessage],
          };
        }
        return convo;
      });
      setConversations(updatedConversations);
      setIsLoading(true);

      try {
        const currentMessages = updatedConversations.find(c => c.id === activeConversationId)?.messages || [];
        
        const aiResponseText = await sendMessageToAI(currentMessages);
        const aiMessage: ChatMessage = {
          id: crypto.randomUUID(),
          text: aiResponseText,
          sender: 'ai',
        };
        
        setConversations(prevConvos => 
          prevConvos.map(convo => {
            if (convo.id === activeConversationId) {
              return { ...convo, messages: [...convo.messages, aiMessage] };
            }
            return convo;
          })
        );
  
      } catch (error) {
        console.error(error);
        const errorMessage: ChatMessage = {
          id: crypto.randomUUID(),
          text: 'Rất xin lỗi, đã có lỗi xảy ra. Em vui lòng thử lại sau nhé.',
          sender: 'ai',
        };
         setConversations(prevConvos => 
          prevConvos.map(convo => {
            if (convo.id === activeConversationId) {
              return { ...convo, messages: [...convo.messages, errorMessage] };
            }
            return convo;
          })
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
          processAndSendMessage({ name: file.name, type: file.type, dataUrl });
        }
      };
      reader.onerror = (error) => {
        console.error("File reading error:", error);
      };
      reader.readAsDataURL(file);
    } else {
      processAndSendMessage();
    }
  }, [activeConversation, conversations, activeConversationId]);

  const closePanelOnMobile = () => {
    if (window.innerWidth < 768) {
      setIsHistoryPanelOpen(false);
    }
  }

  const handleSelectConversation = (id: string) => {
    if (id !== activeConversationId) {
        setActiveConversationId(id);
        resetChat();
    }
    closePanelOnMobile();
  };

  const handleNewConversation = () => {
    const newConvo = createNewConversation();
    setConversations(prev => [newConvo, ...prev]);
    setActiveConversationId(newConvo.id);
    resetChat();
    closePanelOnMobile();
  };

  const handleDeleteConversation = (idToDelete: string) => {
    const remainingConversations = conversations.filter(c => c.id !== idToDelete);

    if (activeConversationId === idToDelete) {
      if (remainingConversations.length > 0) {
        setActiveConversationId(remainingConversations[0].id);
        resetChat();
      } else {
        const newConvo = createNewConversation();
        setConversations([newConvo]);
        setActiveConversationId(newConvo.id);
        resetChat();
        return; 
      }
    }
    setConversations(remainingConversations);
  };
  
  const LoadingIndicator: React.FC = () => (
    <div className="flex items-start gap-3 my-4 justify-start">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSssxevw4Wp2v5H65K-2raSQwfTr12IN1B-Ew&s" alt="AI Avatar" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
        <div className="max-w-xs md:max-w-md lg:max-w-2xl p-4 rounded-2xl bg-slate-100 text-slate-800 border border-slate-200 rounded-bl-none">
            <div className="flex items-center justify-center space-x-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="flex h-full">
      {/* Mobile Overlay Backdrop */}
      {isHistoryPanelOpen && (
        <div
          onClick={() => setIsHistoryPanelOpen(false)}
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          aria-hidden="true"
        />
      )}
      
      {/* History Panel Container (handles mobile overlay and desktop static) */}
      <div className={`
        transition-transform duration-300 ease-in-out
        fixed inset-y-0 left-0 z-30
        ${isHistoryPanelOpen ? 'translate-x-0' : '-translate-x-full'}
        md:static md:translate-x-0
        ${isHistoryPanelOpen ? 'md:block' : 'md:hidden'}
      `}>
         <HistoryPanel
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          onDeleteConversation={handleDeleteConversation}
        />
      </div>

      <div className="flex flex-col flex-1 h-full bg-transparent relative">
        <button
          onClick={() => setIsHistoryPanelOpen(!isHistoryPanelOpen)}
          className="absolute top-1/2 -translate-y-1/2 left-0 bg-white hover:bg-slate-200 text-slate-700 rounded-r-full w-8 h-16 items-center justify-center shadow-lg border-y border-r border-slate-200 z-10 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hidden md:flex"
          aria-label={isHistoryPanelOpen ? "Ẩn lịch sử" : "Hiện lịch sử"}
        >
          {isHistoryPanelOpen ? <ChevronDoubleLeftIcon className="w-5 h-5" /> : <ChevronDoubleRightIcon className="w-5 h-5" />}
        </button>
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6">
            {activeConversation?.messages.map((msg) => (
              <Message key={msg.id} message={msg} />
            ))}
            {isLoading && <LoadingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="sticky bottom-0">
          <InputBar onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
