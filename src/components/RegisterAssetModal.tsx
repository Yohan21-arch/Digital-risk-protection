import React, { useState } from 'react';
import { VerifiedAsset } from '../types';

interface RegisterAssetModalProps {
  onClose: () => void;
  onRegister: (asset: Omit<VerifiedAsset, 'id'>) => void;
}

export const RegisterAssetModal: React.FC<RegisterAssetModalProps> = ({
  onClose,
  onRegister,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('Corporate Domain');
  const [identifier, setIdentifier] = useState('');
  const [legalEntity, setLegalEntity] = useState('One97 Communications Ltd');
  const [status, setStatus] = useState<'ANCHOR ACTIVE' | 'KEY SIGNED' | 'CERTIFIED'>('ANCHOR ACTIVE');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !identifier) return;
    onRegister({
      name,
      type,
      identifier,
      legalEntity,
      status,
      registeredDate: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0f2930]/50 backdrop-blur-xs flex items-center justify-center p-4 lg:p-8 animate-fadeIn">
      <div className="bg-white border border-[#c2c7ca] w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#eeeeed] bg-[#f9f9f8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
            </div>
            <div>
              <h2 className="font-['Manrope'] text-lg font-bold text-[#1a1c1c]">
                Register Official Asset
              </h2>
              <p className="font-['JetBrains_Mono'] text-xs text-[#515f74]">
                Declare Safe Harbor Token for Neural Comparison Models
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#515f74] hover:text-[#1a1c1c] rounded-lg transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 font-['Inter'] text-xs">
          <div>
            <label className="block text-[#515f74] font-medium mb-1 font-['Manrope']">
              Asset Name / Title
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Paytm Payments Bank Gateway"
              className="w-full px-3 py-2 border border-[#c2c7ca] rounded-lg text-[#1a1c1c] focus:border-[#2b94d7] focus:ring-1 focus:ring-[#2b94d7] focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#515f74] font-medium mb-1 font-['Manrope']">
                Asset Classification
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 border border-[#c2c7ca] rounded-lg text-[#1a1c1c] focus:border-[#2b94d7] focus:ring-1 focus:ring-[#2b94d7] focus:outline-none bg-white"
              >
                <option value="Corporate Domain">Corporate Domain</option>
                <option value="Banking Subdomain">Banking Subdomain</option>
                <option value="Mobile APK ID">Mobile APK ID</option>
                <option value="iOS App Store ID">iOS App Store ID</option>
                <option value="Social X Handle">Social X Handle</option>
                <option value="Instagram Handle">Instagram Handle</option>
                <option value="Facebook Page ID">Facebook Page ID</option>
              </select>
            </div>

            <div>
              <label className="block text-[#515f74] font-medium mb-1 font-['Manrope']">
                Verification State
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-[#c2c7ca] rounded-lg text-[#1a1c1c] focus:border-[#2b94d7] focus:ring-1 focus:ring-[#2b94d7] focus:outline-none bg-white"
              >
                <option value="ANCHOR ACTIVE">ANCHOR ACTIVE</option>
                <option value="KEY SIGNED">KEY SIGNED</option>
                <option value="CERTIFIED">CERTIFIED</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#515f74] font-medium mb-1 font-['Manrope']">
              Identifier (Domain / Package / Handle)
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. secure.paytmbank.com or net.one97.paytm"
              className="w-full px-3 py-2 border border-[#c2c7ca] rounded-lg text-[#1a1c1c] font-['JetBrains_Mono'] focus:border-[#2b94d7] focus:ring-1 focus:ring-[#2b94d7] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-[#515f74] font-medium mb-1 font-['Manrope']">
              Owning Legal Entity
            </label>
            <input
              type="text"
              value={legalEntity}
              onChange={(e) => setLegalEntity(e.target.value)}
              className="w-full px-3 py-2 border border-[#c2c7ca] rounded-lg text-[#1a1c1c] focus:border-[#2b94d7] focus:ring-1 focus:ring-[#2b94d7] focus:outline-none"
              required
            />
          </div>

          <div className="pt-4 border-t border-[#eeeeed] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#c2c7ca] rounded-lg text-[#515f74] hover:text-[#1a1c1c] font-['Manrope'] font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0f2930] hover:bg-[#133942] text-white rounded-lg font-['Manrope'] font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px] text-[#2b94d7]">
                add_task
              </span>
              <span>Register Token</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
