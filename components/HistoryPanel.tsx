import React from 'react';
import { Conversation } from '../types';
import { PlusIcon, MessageIcon, TrashIcon } from './IconComponents';

interface HistoryPanelProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
}) => {
  return (
    <div className="w-80 bg-white border-r border-slate-200 flex flex-col h-full flex-shrink-0">
      <div className="p-4 border-b border-slate-200">
        <button
          onClick={onNewConversation}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Cuộc trò chuyện mới</span>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="p-2">
          <ul>
            {conversations.map((convo) => (
              <li key={convo.id} className="mb-1 group">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectConversation(convo.id);
                  }}
                  className={`flex items-center gap-3 p-2 rounded-lg text-base text-slate-700 transition-colors w-full ${
                    activeConversationId === convo.id
                      ? 'bg-slate-100 font-semibold'
                      : 'hover:bg-slate-100'
                  }`}
                >
                  <MessageIcon className="w-5 h-5 flex-shrink-0 text-slate-500" />
                  <span className="truncate flex-1">{convo.title}</span>
                   <button
                    onClick={(e) => {
                      e.stopPropagation(); // Ngăn sự kiện click của thẻ <a>
                      e.preventDefault();
                      onDeleteConversation(convo.id);
                    }}
                    className={`ml-auto p-1 rounded-md text-slate-400 transition-opacity hover:bg-slate-300 hover:text-slate-700 ${
                      activeConversationId === convo.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                    aria-label={`Xóa cuộc trò chuyện ${convo.title}`}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="p-4 border-t border-slate-200 text-xs text-center text-slate-500">
        Phát triển bởi: GV Bùi Thị Thu Hằng và nhóm tin học trường THCS Vũ Hội xã Thư Vũ tỉnh Hưng Yên
      </div>
    </div>
  );
};

export default HistoryPanel;