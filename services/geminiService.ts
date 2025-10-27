import { GoogleGenAI, Part, Content } from "@google/genai";
import { SYSTEM_PROMPT, API_KEYS } from '../constants';
import { ChatMessage } from '../types';

// Track which API key we're currently using
let currentKeyIndex = 0;

// Helper to convert data URL to a Part object for the API
const fileToGenerativePart = (dataUrl: string, mimeType: string): Part => {
    return {
        inlineData: {
            data: dataUrl.split(',')[1],
            mimeType
        },
    };
};

// A robust helper to convert our app's message format to the API's Part[] format.
const messageToApiParts = (message: ChatMessage): Part[] => {
    const parts: Part[] = [];
    const textFragments: string[] = [];

    // Gather all text-based content
    if (message.text) {
        textFragments.push(message.text);
    }
    if (message.attachment && !message.attachment.type.startsWith('image/')) {
        textFragments.push(`\n\n[Tệp đính kèm: ${message.attachment.name}]`);
    }
    
    // Combine and add text part only if it's not empty after trimming
    const combinedText = textFragments.join('').trim();
    if (combinedText) {
        parts.push({ text: combinedText });
    }

    // Add image part if it exists
    if (message.attachment && message.attachment.type.startsWith('image/')) {
        parts.push(fileToGenerativePart(message.attachment.dataUrl, message.attachment.type));
    }
    
    return parts;
};

export const sendMessageToAI = async (messages: ChatMessage[]): Promise<string> => {
    let lastError: Error | null = null;

    // Try each API key until one works
    while (currentKeyIndex < API_KEYS.length) {
        try {
            if (messages.length === 0) {
                return "Thầy/Cô không nhận được nội dung nào. Em vui lòng nhập câu hỏi nhé.";
            }

            // The last message MUST be from the user for a valid conversation turn.
            if (messages[messages.length - 1].sender !== 'user') {
                console.error("Logic error: The last message to send must be from the user.");
                return "Lỗi hệ thống: Tin nhắn cuối cùng không hợp lệ.";
            }
            
            // Convert the entire message history to the API's format.
            // Filter out any messages that might be empty to prevent the API error.
            const apiContents: Content[] = messages
                .map(message => ({
                    role: message.sender === 'user' ? 'user' : 'model',
                    parts: messageToApiParts(message)
                }))
                .filter(contentItem => contentItem.parts.length > 0);

            // A final check to ensure we are sending something.
            if (apiContents.length === 0) {
                console.error("Attempted to send a message history with no valid content parts.", messages);
                return "Lỗi: Không thể gửi một tin nhắn trống.";
            }

            const currentApiKey = API_KEYS[currentKeyIndex];
            if (!currentApiKey) {
                console.error("No valid API key available at index:", currentKeyIndex);
                // Move to next key for future requests
                currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
                continue;
            }

            const ai = new GoogleGenAI({ apiKey: currentApiKey });

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: apiContents,
                config: {
                    systemInstruction: SYSTEM_PROMPT,
                }
            });

            const text = response.text;
            
            if (!text) {
                return "Thầy/Cô không có phản hồi cho câu này. Em hãy thử hỏi khác nhé.";
            }
            return text;

        } catch (error) {
            console.error(`Lỗi khi gọi Gemini API với key ${currentKeyIndex}:`, error);
            lastError = error instanceof Error ? error : new Error(String(error));
            
            // Move to the next API key
            currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;

            // If we've tried all keys, break the loop
            if (currentKeyIndex === 0) {
                break;
            }
            
            // Continue to try with next key
            continue;
        }
    }

    // If we get here, all API keys have failed
    console.error("Đã thử tất cả API keys nhưng không thành công", lastError);
    if (lastError?.message.includes('ContentUnion is required')) {
        return "Xin lỗi em, đã có lỗi xảy ra khi xử lý nội dung tin nhắn. Vui lòng thử lại sau.";
    }
    return "Xin lỗi em, đã có lỗi xảy ra. Vui lòng thử lại sau.";
};

// This function is no longer needed as we are not managing a stateful chat object.
export const resetChat = () => {
    // No-op
};
