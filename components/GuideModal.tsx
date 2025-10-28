import React from 'react';
import { XIcon, MessageIcon, PaperClipIcon, LightbulbIcon, ListBulletIcon } from './IconComponents';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Use a separate handler for the outer div to close, and stop propagation on the inner content
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderFormattedText = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm" 
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-slate-200 flex-shrink-0">
          <h2 className="text-xl font-bold text-slate-800">Giới thiệu & Hướng dẫn sử dụng</h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Đóng"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <h3 className="text-lg font-semibold text-blue-600 mb-2">Giới thiệu về Thầy/Cô Ngữ Văn AI</h3>
          <p className="mb-6 text-slate-700 leading-relaxed">
            Thầy/Cô Ngữ Văn AI là một trợ lý học tập thông minh, được thiết kế đặc biệt cho học sinh Việt Nam theo Chương trình Giáo dục phổ thông 2018.
            <br />
            Triết lý cốt lõi của Thầy/Cô là {renderFormattedText('**"Kiến tạo năng lực ngôn ngữ và tư duy phản biện"**')}. Thay vì cung cấp bài văn mẫu có sẵn, Thầy/Cô sẽ đồng hành cùng em qua những câu hỏi gợi mở, giúp em tự khám phá kiến thức, rèn luyện cách lập luận và tìm ra giọng văn của riêng mình.
          </p>
          
          <h3 className="text-lg font-semibold text-blue-600 mb-4">Hướng dẫn sử dụng</h3>
          <ul className="space-y-5">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white font-bold text-sm rounded-full flex items-center justify-center mr-4 mt-1">1</span>
              <div>
                <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-1">
                  <MessageIcon className="w-5 h-5 text-slate-500"/>
                  Bắt đầu cuộc trò chuyện
                </h4>
                <p className="text-slate-600">
                  Chỉ cần gõ câu hỏi hoặc yêu cầu của em vào khung chat. Em có thể hỏi về một tác phẩm, nhờ hướng dẫn lập dàn ý, kiểm tra ngữ pháp, hoặc bất cứ điều gì liên quan đến môn Ngữ Văn.
                </p>
              </div>
            </li>
             <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white font-bold text-sm rounded-full flex items-center justify-center mr-4 mt-1">2</span>
              <div>
                <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-1">
                  <PaperClipIcon className="w-5 h-5 text-slate-500"/>
                  Đính kèm tài liệu
                </h4>
                <p className="text-slate-600">
                  Sử dụng biểu tượng kẹp ghim để tải lên hình ảnh (bài tập, một trang sách...) hoặc tệp PDF. Thầy/Cô có thể đọc và hỗ trợ em dựa trên tài liệu đó.
                </p>
              </div>
            </li>
             <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white font-bold text-sm rounded-full flex items-center justify-center mr-4 mt-1">3</span>
              <div>
                <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-1">
                  <LightbulbIcon className="w-5 h-5 text-slate-500"/>
                  Tương tác hiệu quả
                </h4>
                <p className="text-slate-600">
                  Thầy/Cô sẽ liên tục đặt câu hỏi để dẫn dắt em. Hãy trả lời một cách chân thành và chi tiết nhất có thể, vì đây là cách tốt nhất để em học hỏi và ghi nhớ kiến thức.
                </p>
              </div>
            </li>
             <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white font-bold text-sm rounded-full flex items-center justify-center mr-4 mt-1">4</span>
              <div>
                <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-1">
                  <ListBulletIcon className="w-5 h-5 text-slate-500"/>
                  Quản lý lịch sử trò chuyện
                </h4>
                <p className="text-slate-600">
                   Các cuộc trò chuyện của em được lưu lại ở thanh bên trái. Em có thể bắt đầu một cuộc trò chuyện mới hoặc tiếp tục các cuộc trò chuyện cũ bất cứ lúc nào.
                </p>
              </div>
            </li>
          </ul>
        </div>
        <div className="p-4 border-t border-slate-200 text-xs text-center text-slate-500 bg-slate-50 rounded-b-lg flex-shrink-0">
          Phát triển bởi: GV Bùi Thị Thu Hằng và nhóm tin học trường THCS Vũ Hội xã Thư Vũ tỉnh Hưng Yên
        </div>
      </div>
    </div>
  );
};

export default GuideModal;
