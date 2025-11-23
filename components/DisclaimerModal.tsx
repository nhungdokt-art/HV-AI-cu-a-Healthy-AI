import React, { useState, useEffect } from 'react';
import { AlertTriangle, Check } from 'lucide-react';

export const DisclaimerModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('hvai_disclaimer_accepted');
    if (!hasAccepted) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('hvai_disclaimer_accepted', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in-up">
        <div className="flex items-center gap-3 text-amber-600 mb-4">
          <AlertTriangle size={32} />
          <h2 className="text-xl font-bold text-slate-900">Lưu ý Quan trọng</h2>
        </div>
        
        <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
          <p>
            HV AI sử dụng trí tuệ nhân tạo để cung cấp thông tin về sức khỏe và lối sống. Tuy nhiên:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>HV AI không phải là bác sĩ.</strong></li>
            <li>Thông tin cung cấp chỉ mang tính chất tham khảo chung.</li>
            <li>Không sử dụng HV AI cho các trường hợp cấp cứu y tế.</li>
            <li>Luôn tham khảo ý kiến chuyên gia y tế cho các vấn đề sức khỏe cụ thể.</li>
          </ul>
        </div>

        <button
          onClick={handleAccept}
          className="mt-8 w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors duration-200 shadow-lg shadow-primary-500/20"
        >
          <Check size={20} />
          Tôi đã hiểu và Đồng ý
        </button>
      </div>
    </div>
  );
};
