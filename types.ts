export type MessageSender = 'user' | 'ai';

export interface ChatMessage {
  id: string;
  text: string;
  sender: MessageSender;
  attachment?: {
    name: string;
    type: string; // MIME type
    dataUrl: string; // base64 data URL
  };
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
}
