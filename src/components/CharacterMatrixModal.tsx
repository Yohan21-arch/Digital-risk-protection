import React from 'react';
import { HOMOGRAPH_THREATS } from '../data/mockData';

interface CharacterMatrixModalProps {
  onClose: () => void;
  brand: string;
}

export const CharacterMatrixModal: React.FC<CharacterMatrixModalProps> = ({
  onClose,
  brand,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#0f2930]/50 backdrop-blur-xs flex items-center justify-center p-4 lg:p-8 animate-fadeIn">
      <div className="bg-white border border-[#c2c7ca] w-full max-w-4xl max-h-[88vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#eeeeed] bg-[#f9f9f8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-lg">
              <span className="material-symbols-outlined text-[20px]">warning</span>
            </div>
            <div>
              <h2 className="font-['Manrope'] text-lg font-bold text-[#1a1c1c]">
                Homograph & Typo-squatting Mutation Matrix
              </h2>
              <p className="font-['JetBrains_Mono'] text-xs text-[#515f74]">
                Target Brand: <span className="font-bold text-[#1a1c1c]">{brand}</span> • Levenshtein Distance ≤ 3
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

        {/* Matrix Table */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <div className="mb-4 p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-950 font-['Inter']">
            <strong>Neural Homograph Probing:</strong> Threat actors register visually identical Internationalized Domain Names (IDNs) using Cyrillic, Greek, and Latin accent glyphs, or double-letters to intercept user transactions.
          </div>

          <table className="w-full text-left border-collapse font-['Inter'] text-xs">
            <thead>
              <tr className="border-b border-[#eeeeed] font-['JetBrains_Mono'] text-[#515f74] uppercase text-[10px]">
                <th className="py-2.5 px-3">Mutation String</th>
                <th className="py-2.5 px-3">Adversarial Technique</th>
                <th className="py-2.5 px-3">Punycode / FQDN</th>
                <th className="py-2.5 px-3">Levenshtein</th>
                <th className="py-2.5 px-3">Live IP Resolution</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eeeeed]">
              {HOMOGRAPH_THREATS.map((h, i) => (
                <tr key={i} className="hover:bg-[#f9f9f8]">
                  <td className="py-3 px-3 font-['JetBrains_Mono'] font-bold text-red-700">
                    {h.mutation}
                  </td>
                  <td className="py-3 px-3 text-[#1a1c1c] font-medium">
                    {h.technique}
                  </td>
                  <td className="py-3 px-3 font-['JetBrains_Mono'] text-[#515f74]">
                    {h.punycode}
                  </td>
                  <td className="py-3 px-3 font-['JetBrains_Mono'] font-semibold text-center text-[#1a1c1c]">
                    {h.levenshtein}
                  </td>
                  <td className="py-3 px-3 font-['JetBrains_Mono'] text-[11px] text-[#515f74]">
                    {h.ipResolution}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`px-2 py-0.5 rounded font-['JetBrains_Mono'] font-bold text-[10px] ${
                        h.status === 'CRITICAL'
                          ? 'bg-red-100 text-red-800'
                          : h.status === 'MONITORING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {h.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#eeeeed] bg-[#f9f9f8] flex items-center justify-between">
          <span className="font-['JetBrains_Mono'] text-xs text-[#515f74]">
            Proactive defensive domain registration recommendations: 4 variants pending
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0f2930] hover:bg-[#133942] text-white rounded-lg text-xs font-semibold font-['Manrope'] cursor-pointer"
          >
            Close Matrix
          </button>
        </div>
      </div>
    </div>
  );
};
