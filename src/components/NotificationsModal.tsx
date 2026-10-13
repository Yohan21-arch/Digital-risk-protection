import React from 'react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slideUp">
      <div className="bg-[#0f2930] text-white px-5 py-3.5 rounded-xl border border-[#72787a]/40 shadow-2xl flex items-center gap-3">
        <span className="material-symbols-outlined text-[#2b94d7] text-[20px]">
          verified
        </span>
        <span className="text-xs font-['Inter'] font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-[#779199] hover:text-white cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>
    </div>
  );
};

interface NotificationsModalProps {
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ onClose }) => {
  const alerts = [
    {
      title: 'High-Velocity Phishing Campaign Alert',
      time: '12 minutes ago',
      desc: 'New domain paytm-support-desk.cc registered targeting UPI refund queries.',
      unread: true,
    },
    {
      title: 'Takedown Confirmation from X Corp.',
      time: '1 hour ago',
      desc: 'Account @paytm_fraud_desk suspended under Trademark Infringement policy.',
      unread: true,
    },
    {
      title: 'Google Play Clone Detected',
      time: '3 hours ago',
      desc: 'com.paytm.rewards.bonus uploaded with READ_SMS permissions.',
      unread: false,
    },
    {
      title: 'Safe Harbor SSL Renewal Completed',
      time: 'Yesterday',
      desc: 'Wildcard *.paytmbank.com certificate cryptographically signed by DigiCert.',
      unread: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#0f2930]/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#c2c7ca] w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-[#eeeeed] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#2b94d7]">notifications</span>
            <h3 className="font-['Manrope'] font-bold text-sm text-[#1a1c1c]">
              Security Operations Alerts
            </h3>
          </div>
          <button onClick={onClose} className="text-[#515f74] hover:text-[#1a1c1c] cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-4 space-y-3 font-['Inter'] text-xs max-h-96 overflow-y-auto custom-scrollbar">
          {alerts.map((a, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg border ${
                a.unread
                  ? 'bg-red-50/40 border-red-200'
                  : 'bg-[#f9f9f8] border-[#eeeeed]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#1a1c1c]">{a.title}</span>
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#72787a]">{a.time}</span>
              </div>
              <p className="text-[#515f74] mt-1">{a.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-[#eeeeed] bg-[#f9f9f8] text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0f2930] text-white rounded-lg text-xs font-['Manrope'] font-semibold cursor-pointer"
          >
            Mark All Read
          </button>
        </div>
      </div>
    </div>
  );
};
