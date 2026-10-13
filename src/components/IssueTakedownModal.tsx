import React, { useState } from 'react';
import { ThreatItem } from '../types';

interface IssueTakedownModalProps {
  threat: ThreatItem | null;
  onClose: () => void;
  onSubmitTakedown: (notice: {
    targetName: string;
    targetIdentifier: string;
    provider: string;
    legalBasis: string;
    signature: string;
  }) => void;
}

export const IssueTakedownModal: React.FC<IssueTakedownModalProps> = ({
  threat,
  onClose,
  onSubmitTakedown,
}) => {
  const [targetName, setTargetName] = useState(
    threat?.name || 'Paytm Support India Official Helpline'
  );
  const [targetIdentifier, setTargetIdentifier] = useState(
    threat?.handleOrPkg || '@paytm_support247'
  );
  const [provider, setProvider] = useState(
    threat?.platform === 'Google Play'
      ? 'Google LLC Legal & Play Trust'
      : threat?.platform === 'X'
      ? 'X Corp. Trust & Safety Abuse Desk'
      : threat?.platform === 'Facebook' || threat?.platform === 'Instagram'
      ? 'Meta Platforms Intellectual Property Group'
      : 'Domain Registrar & Hosting Provider'
  );
  const [legalBasis, setLegalBasis] = useState(
    'Trademark Infringement (15 U.S.C. § 1125(a)) & Deceptive Phishing'
  );
  const [signature, setSignature] = useState('Sarah Jenkins, Lead IP Counsel');
  const [isPerjuryDeclared, setIsPerjuryDeclared] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPerjuryDeclared) return;
    onSubmitTakedown({
      targetName,
      targetIdentifier,
      provider,
      legalBasis,
      signature,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0f2930]/50 backdrop-blur-xs flex items-center justify-center p-4 lg:p-8 animate-fadeIn">
      <div className="bg-white border border-[#c2c7ca] w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#eeeeed] bg-[#f9f9f8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#002841] text-[#2b94d7] rounded-lg">
              <span className="material-symbols-outlined text-[20px]">gavel</span>
            </div>
            <div>
              <h2 className="font-heading-serif text-lg font-bold text-[#1a1c1c]">
                Issue Automated Legal Takedown
              </h2>
              <p className="font-['JetBrains_Mono'] text-xs text-[#515f74]">
                Expedited Digital Millennium Copyright & Trademark Cease-and-Desist
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 font-['Inter'] text-xs overflow-y-auto max-h-[75vh] custom-scrollbar">
          <div>
            <label className="block text-[#515f74] font-medium mb-1 font-['Manrope']">
              Target Entity Name
            </label>
            <input
              type="text"
              value={targetName}
              onChange={(e) => setTargetName(e.target.value)}
              className="w-full px-3 py-2 border border-[#c2c7ca] rounded-lg text-[#1a1c1c] font-medium focus:border-[#2b94d7] focus:ring-1 focus:ring-[#2b94d7] focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#515f74] font-medium mb-1 font-['Manrope']">
                Target Identifier (Handle / URL / Package ID)
              </label>
              <input
                type="text"
                value={targetIdentifier}
                onChange={(e) => setTargetIdentifier(e.target.value)}
                className="w-full px-3 py-2 border border-[#c2c7ca] rounded-lg text-[#1a1c1c] font-['JetBrains_Mono'] focus:border-[#2b94d7] focus:ring-1 focus:ring-[#2b94d7] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[#515f74] font-medium mb-1 font-['Manrope']">
                Recipient Abuse Desk
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full px-3 py-2 border border-[#c2c7ca] rounded-lg text-[#1a1c1c] focus:border-[#2b94d7] focus:ring-1 focus:ring-[#2b94d7] focus:outline-none bg-white"
              >
                <option value="X Corp. Trust & Safety Abuse Desk">X Corp. Trust & Safety</option>
                <option value="Google LLC Legal & Play Trust">Google LLC Legal & Play Trust</option>
                <option value="Meta Platforms Intellectual Property Group">Meta Platforms IP Desk</option>
                <option value="Cloudflare Trust & Safety Emergency Takedown">Cloudflare Abuse Desk</option>
                <option value="Namecheap Registrar Legal Compliance">Namecheap Abuse / Registrar</option>
                <option value="Apple Developer Relations App Store Review">Apple App Store Review</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#515f74] font-medium mb-1 font-['Manrope']">
              Legal Cause & Statutory Basis
            </label>
            <input
              type="text"
              value={legalBasis}
              onChange={(e) => setLegalBasis(e.target.value)}
              className="w-full px-3 py-2 border border-[#c2c7ca] rounded-lg text-[#1a1c1c] focus:border-[#2b94d7] focus:ring-1 focus:ring-[#2b94d7] focus:outline-none"
              required
            />
          </div>

          {/* Automated Legal Notice Preview */}
          <div className="bg-[#f3f4f3] border border-[#c2c7ca]/70 rounded-lg p-3.5 text-[#1a1c1c] font-['JetBrains_Mono'] text-[11px] leading-relaxed">
            <div className="font-bold text-[#002841] mb-1">
              AUTOMATED NOTICE OF INTELLECTUAL PROPERTY INFRINGEMENT & CEASE-AND-DESIST
            </div>
            <p className="text-[#515f74]">
              To Abuse Desk at {provider}:
              <br />
              Please be advised that the asset identified as <span className="text-red-700 font-semibold">{targetIdentifier}</span> is unauthorizedly utilizing the protected marks, likeness, and proprietary service assets of One97 Communications Ltd. (Paytm) to perpetrate deceptive consumer harm and credential harvesting. Demand is hereby made for immediate suspension and revocation pursuant to emergency fast-track procedures.
            </p>
          </div>

          <div>
            <label className="block text-[#515f74] font-medium mb-1 font-['Manrope']">
              Authorized Legal Signatory
            </label>
            <input
              type="text"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              className="w-full px-3 py-2 border border-[#c2c7ca] rounded-lg text-[#1a1c1c] font-medium focus:border-[#2b94d7] focus:ring-1 focus:ring-[#2b94d7] focus:outline-none"
              required
            />
          </div>

          <label className="flex items-start gap-2.5 pt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isPerjuryDeclared}
              onChange={(e) => setIsPerjuryDeclared(e.target.checked)}
              className="mt-0.5 rounded border-[#c2c7ca] text-[#0f2930] focus:ring-[#2b94d7]"
            />
            <span className="text-xs text-[#515f74]">
              I declare under penalty of perjury that I am authorized to act on behalf of the trademark holder and that the information in this notification is accurate.
            </span>
          </label>

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
              disabled={!isPerjuryDeclared}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg font-['Manrope'] font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">gavel</span>
              <span>Expedite & Send Takedown</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
