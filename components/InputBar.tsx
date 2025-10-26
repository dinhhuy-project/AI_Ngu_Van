import React, { useState, useRef } from 'react';
import { SendIcon, PaperClipIcon } from './IconComponents';

interface InputBarProps {
  onSendMessage: (message: string, file?: File) => void;
  isLoading: boolean;
}

const InputBar: React.FC<InputBarProps> = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Add file size validation if needed
      setSelectedFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((inputValue.trim() || selectedFile) && !isLoading) {
      onSendMessage(inputValue, selectedFile || undefined);
      setInputValue('');
      removeFile();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="bg-white p-4 border-t border-slate-200">
      <div className="max-w-4xl mx-auto">
        {selectedFile && (
          <div className="mb-2 p-2 bg-slate-100 border border-slate-300 rounded-lg flex items-center justify-between text-base">
            <span className="truncate text-slate-700">{selectedFile.name}</span>
            <button onClick={removeFile} className="text-slate-500 hover:text-slate-800 font-bold text-lg leading-none p-1">&times;</button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center">
           <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,.pdf"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            aria-label="Attach file"
            className="mr-2 p-2 text-slate-500 rounded-full disabled:text-slate-300 disabled:cursor-not-allowed hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <PaperClipIcon className="w-6 h-6" />
          </button>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Em có câu hỏi gì cho Thầy/Cô..."
            className="flex-1 p-3 bg-white text-base text-slate-800 placeholder:text-slate-500 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none disabled:bg-slate-100 disabled:cursor-not-allowed"
            rows={1}
            disabled={isLoading}
            style={{maxHeight: '150px'}}
          />
          <button
            type="submit"
            disabled={isLoading || (!inputValue.trim() && !selectedFile)}
            aria-label="Send message"
            className="ml-3 p-3 bg-blue-500 text-white rounded-full disabled:bg-blue-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <SendIcon className="w-6 h-6" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InputBar;