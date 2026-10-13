import React from 'react';
import { ThreatItem } from '../types';

interface EvidenceDossierModalProps {
  threats: ThreatItem[];
  onClose: () => void;
  brand: string;
}

export const EvidenceDossierModal: React.FC<EvidenceDossierModalProps> = ({
  threats,
  onClose,
  brand,
}) => {
  const primaryThreat = threats[0];
  const generatedDate = new Date().toUTCString();

  return (
    <div className="fixed inset-0 z-50 bg-[#0f2930]/50 backdrop-blur-xs flex items-center justify-center p-4 lg:p-8 animate-fadeIn">
      <div className="bg-white border border-[#c2c7ca] w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#eeeeed] bg-[#f9f9f8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#002841] text-[#2b94d7] rounded-lg">
              <span className="material-symbols-outlined text-[20px]">verified</span>
            </div>
            <div>
              <h2 className="font-['Manrope'] text-lg font-bold text-[#1a1c1c]">
                Cryptographic Evidence Dossier
              </h2>
              <p className="font-['JetBrains_Mono'] text-xs text-[#515f74]">
                Legal Vault Sealed Audit Package • Case #EDP-2026-9041
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

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 custom-scrollbar font-['Inter'] text-xs">
          {/* Certificate Header Banner */}
          <div className="p-4 bg-[#f3f4f3] border border-[#c2c7ca]/70 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#515f74] uppercase tracking-wider block">
                Target Entity Under Examination
              </span>
              <span className="font-['Manrope'] text-base font-bold text-[#1a1c1c]">
                {brand} / One97 Communications Global DRP Perimeter
              </span>
            </div>
            <div className="sm:text-right font-['JetBrains_Mono'] text-[11px] text-[#515f74]">
              <div>Generated: {generatedDate}</div>
              <div className="text-emerald-700 font-semibold">Status: Cryptographically Certified</div>
            </div>
          </div>

          {/* SHA-256 Ledger Section */}
          <div className="border border-[#c2c7ca]/60 rounded-xl p-4 bg-white space-y-3">
            <h3 className="font-['Manrope'] text-sm font-bold text-[#1a1c1c]">
              Immutable Forensic Ledger Hashes
            </h3>
            <div className="space-y-2 font-['JetBrains_Mono'] text-[11px]">
              <div className="p-2.5 bg-[#f9f9f8] rounded border border-[#eeeeed]">
                <div className="text-[#515f74] text-[10px] uppercase">Primary Threat Actor Vector</div>
                <div className="text-red-700 font-semibold mt-0.5">{primaryThreat?.name} ({primaryThreat?.handleOrPkg})</div>
                <div className="text-[#72787a] text-[10px] mt-1 break-all">
                  SHA-256: {primaryThreat?.details.sha256Hash}
                </div>
              </div>

              <div className="p-2.5 bg-[#f9f9f8] rounded border border-[#eeeeed]">
                <div className="text-[#515f74] text-[10px] uppercase">Safe Harbor Anchor Reference</div>
                <div className="text-emerald-800 font-semibold mt-0.5">Paytm Official Corporate Primary (ASSET-ONE97-001)</div>
                <div className="text-[#72787a] text-[10px] mt-1 break-all">
                  SHA-256: 0000000000000000000000000000000000000000000000000000000000000000
                </div>
              </div>
            </div>
          </div>

          {/* Technical Findings Summary */}
          <div className="border border-[#c2c7ca]/60 rounded-xl p-4 bg-white space-y-3">
            <h3 className="font-['Manrope'] text-sm font-bold text-[#1a1c1c]">
              Technical Summary for Legal Filing
            </h3>
            <div className="text-[#515f74] leading-relaxed space-y-2 text-xs">
              <p>
                1. <strong>Unauthorized Brand Reproduction:</strong> Neural convolutional vector analysis calculated 91% logo similarity against registered trademark assets of One97 Communications Ltd.
              </p>
              <p>
                2. <strong>Adversarial Phishing Architecture:</strong> The inspected account routes consumers through proxy DNS hops into Telegram KYC phishing tunnels to solicit unauthorized financial credentials.
              </p>
              <p>
                3. <strong>DNS & Infrastructure Attribution:</strong> The host network resolves to Cloudflare Edge IP 104.21.64.120 registered through NameCheap privacy shields within the last 24 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#eeeeed] bg-[#f9f9f8] flex items-center justify-between">
          <span className="font-['JetBrains_Mono'] text-xs text-[#515f74]">
            Chain-of-Custody Verified • Compliant with Federal Rules of Evidence Rule 902(13)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                window.print();
              }}
              className="px-3.5 py-1.5 border border-[#c2c7ca] rounded-lg text-xs font-semibold text-[#001319] hover:bg-[#f3f4f3] flex items-center gap-1 cursor-pointer font-['Manrope']"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print Dossier</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#0f2930] hover:bg-[#133942] text-white rounded-lg text-xs font-semibold font-['Manrope'] cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
