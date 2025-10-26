import React from 'react';
import { ChatMessage } from '../types';

// Generic file icon for PDFs and other non-image files
const FileIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
);

// A helper function to parse basic markdown-like bold syntax (**text**)
const renderFormattedText = (text: string) => {
  if (!text) return null;
  // Split text by the bold delimiter. The capturing group ensures delimiters are in the result array.
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, index) => {
    // Check if the part is a bolded segment
    if (part.startsWith('**') && part.endsWith('**')) {
      // Remove the asterisks and wrap in a <strong> tag
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    // Return the plain text part
    return part;
  });
};


interface MessageProps {
  message: ChatMessage;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  const messageContainerClasses = `flex items-start gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`;
  const messageBubbleClasses = `max-w-xs md:max-w-md lg:max-w-2xl p-4 rounded-2xl whitespace-pre-wrap ${
    isUser
      ? 'bg-blue-500 text-white rounded-br-none'
      : 'bg-slate-100 text-slate-800 border border-slate-200 rounded-bl-none'
  }`;

  const AttachmentDisplay: React.FC<{ attachment: NonNullable<ChatMessage['attachment']> }> = ({ attachment }) => {
    const bubbleBg = isUser ? 'bg-blue-500/50' : 'bg-gray-200';
    const textColor = isUser ? 'text-white' : 'text-slate-700';
    
    if (attachment.type.startsWith('image/')) {
      return (
        <div className="mb-2">
            <img src={attachment.dataUrl} alt={attachment.name} className="max-w-full h-auto rounded-lg border-2 border-white/20" />
        </div>
      );
    }

    if (attachment.type === 'application/pdf') {
        return (
            <div className={`mb-2 p-2 ${bubbleBg} rounded-lg flex items-center gap-2`}>
                <FileIcon className={`w-6 h-6 ${textColor} flex-shrink-0`} />
                <span className={`text-base ${textColor} truncate`}>{attachment.name}</span>
            </div>
        )
    }

    return null; // or a generic display for other file types
  };

  return (
    <div className={messageContainerClasses}>
      {!isUser && (
         <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSssxevw4Wp2v5H65K-2raSQwfTr12IN1B-Ew&s" alt="AI Avatar" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
      )}
      <div className={messageBubbleClasses}>
        {message.attachment && <AttachmentDisplay attachment={message.attachment} />}
        {message.text && <p className="text-base">{renderFormattedText(message.text)}</p>}
      </div>
    </div>
  );
};

export default Message;