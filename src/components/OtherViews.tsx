import React, { useState } from 'react';
import { ThreatItem, VerifiedAsset, TakedownNotice } from '../types';

interface ViewProps {
  threats: ThreatItem[];
  verifiedAssets: VerifiedAsset[];
  takedowns: TakedownNotice[];
  brand: string;
  onInvestigate: (threat: ThreatItem) => void;
  onOpenTakedown: (threat?: ThreatItem) => void;
  onTriggerToast: (msg: string) => void;
}

// 1. OVERVIEW DASHBOARD VIEW
export const OverviewView: React.FC<ViewProps> = ({
  threats,
  verifiedAssets,
  takedowns,
  brand,
  onInvestigate,
  onTriggerToast,
}) => {
  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0">
      {/* Executive Hero Banner */}
      <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span className="font-['JetBrains_Mono'] text-[10px] sm:text-xs font-semibold text-[#004b73] truncate">
              EXECUTIVE DEFENSE STATUS: DEFENSIVE STANCE ACTIVE
            </span>
          </div>
          <h1 className="font-['Manrope'] text-lg sm:text-xl lg:text-2xl font-bold text-[#1a1c1c] tracking-tight">
            Perimeter Security Overview for {brand}
          </h1>
          <p className="text-xs text-[#515f74] font-['Inter'] mt-0.5 leading-relaxed">
            Real-time cross-vector threat synthesis across domain registries, mobile app ecosystems, and social platforms.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
          <button
            onClick={() => onTriggerToast('Running instant synthetic threat audit...')}
            className="px-3 sm:px-4 py-2 bg-[#0f2930] hover:bg-[#133942] text-white rounded-lg text-xs font-['Manrope'] font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
          >
            <span className="material-symbols-outlined text-[15px] text-[#2b94d7]">refresh</span>
            <span>Sync Perimeter</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4 w-full min-w-0">
        <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 shadow-xs min-w-0">
          <span className="font-['JetBrains_Mono'] text-[10px] sm:text-[11px] text-[#515f74] uppercase font-semibold truncate block">
            Active Incidents
          </span>
          <div className="mt-1.5 text-2xl sm:text-3xl font-bold font-['Manrope'] text-[#1a1c1c] tabular-nums">
            {threats.length}
          </div>
          <div className="mt-1 text-[11px] text-red-600 font-['Inter'] truncate">
            4 Critical • 7 High
          </div>
        </div>

        <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 shadow-xs min-w-0">
          <span className="font-['JetBrains_Mono'] text-[10px] sm:text-[11px] text-[#515f74] uppercase font-semibold truncate block">
            Takedowns Sent
          </span>
          <div className="mt-1.5 text-2xl sm:text-3xl font-bold font-['Manrope'] text-[#1a1c1c] tabular-nums">
            {takedowns.length}
          </div>
          <div className="mt-1 text-[11px] text-emerald-700 font-['Inter'] truncate">
            2 Delisted (50%)
          </div>
        </div>

        <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 shadow-xs min-w-0">
          <span className="font-['JetBrains_Mono'] text-[10px] sm:text-[11px] text-[#515f74] uppercase font-semibold truncate block">
            Mean MTTR
          </span>
          <div className="mt-1.5 text-2xl sm:text-3xl font-bold font-['Manrope'] text-[#1a1c1c] tabular-nums">
            3.4h
          </div>
          <div className="mt-1 text-[11px] text-emerald-700 font-['Inter'] truncate">
            -42 min vs baseline
          </div>
        </div>

        <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 shadow-xs min-w-0">
          <span className="font-['JetBrains_Mono'] text-[10px] sm:text-[11px] text-[#515f74] uppercase font-semibold truncate block">
            Safe Anchors
          </span>
          <div className="mt-1.5 text-2xl sm:text-3xl font-bold font-['Manrope'] text-[#1a1c1c] tabular-nums">
            {verifiedAssets.length}
          </div>
          <div className="mt-1 text-[11px] text-emerald-700 font-['Inter'] truncate">
            100% Intact
          </div>
        </div>
      </div>

      {/* Threat Distribution Table */}
      <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-6 shadow-xs w-full min-w-0">
        <h2 className="font-['Manrope'] text-sm sm:text-base font-bold text-[#1a1c1c] mb-0.5">
          Recent High-Severity Detections
        </h2>
        <p className="text-xs text-[#515f74] font-['Inter'] mb-3">
          Automated triage queue ordered by neural risk score.
        </p>

        <div className="overflow-x-auto custom-scrollbar w-full max-w-full">
          <table className="w-full text-left border-collapse font-['Inter'] text-xs min-w-[560px]">
            <thead>
              <tr className="border-b border-[#eeeeed] font-['JetBrains_Mono'] text-[#515f74] uppercase text-[10px]">
                <th className="py-2 px-3">Target Name</th>
                <th className="py-2 px-3">Channel</th>
                <th className="py-2 px-3">Identifier</th>
                <th className="py-2 px-3">Severity</th>
                <th className="py-2 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eeeeed]">
              {threats.slice(0, 4).map((t) => (
                <tr key={t.id} className="hover:bg-[#f9f9f8]">
                  <td className="py-2.5 px-3 font-semibold text-[#1a1c1c] truncate max-w-[180px]">{t.name}</td>
                  <td className="py-2.5 px-3 text-[#515f74]">{t.platform}</td>
                  <td className="py-2.5 px-3 font-['JetBrains_Mono'] text-red-700 truncate max-w-[160px]">{t.handleOrPkg}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded font-['JetBrains_Mono'] text-[10px] font-bold bg-red-100 text-red-800">
                      {t.riskCategory} ({t.riskScore})
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right shrink-0">
                    <button
                      onClick={() => onInvestigate(t)}
                      className="px-2.5 py-1 bg-[#0f2930] hover:bg-[#133942] text-white rounded text-xs font-semibold cursor-pointer shrink-0"
                    >
                      Investigate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 2. SOCIAL MONITORING VIEW
export const SocialMonitoringView: React.FC<ViewProps> = ({
  threats,
  onInvestigate,
  onTriggerToast,
}) => {
  const socialThreats = threats.filter(
    (t) => t.platform === 'X' || t.platform === 'Facebook' || t.platform === 'Instagram'
  );

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0">
      <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 min-w-0">
        <div className="min-w-0">
          <h1 className="font-['Manrope'] text-lg sm:text-xl lg:text-2xl font-bold text-[#1a1c1c]">
            Social Media Impersonation Radar
          </h1>
          <p className="text-xs text-[#515f74] font-['Inter'] mt-0.5">
            Continuous scanning across X, Instagram, Facebook, and Telegram for rogue brand handles.
          </p>
        </div>
        <button
          onClick={() => onTriggerToast('Social API crawlers dispatched.')}
          className="px-3.5 py-2 bg-[#0f2930] text-white rounded-lg text-xs font-['Manrope'] font-semibold cursor-pointer shadow-xs shrink-0 self-start md:self-auto"
        >
          Rescan Feeds
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4 w-full min-w-0">
        {socialThreats.map((t) => (
          <div key={t.id} className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between min-w-0">
            <div className="min-w-0">
              <div className="flex items-center justify-between mb-2.5">
                <span className="px-2 py-0.5 rounded bg-[#eeeeed] text-[#515f74] font-['JetBrains_Mono'] text-[10px]">
                  {t.platform}
                </span>
                <span className="font-['JetBrains_Mono'] text-xs text-red-700 font-bold">
                  Risk {t.riskScore}/100
                </span>
              </div>
              <h3 className="font-['Manrope'] font-bold text-sm text-[#1a1c1c] truncate">{t.name}</h3>
              <p className="font-['JetBrains_Mono'] text-xs text-red-700 mt-0.5 truncate">{t.handleOrPkg}</p>
              <p className="text-xs text-[#515f74] mt-2 line-clamp-2 leading-relaxed">{t.summary}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#eeeeed] flex items-center justify-between">
              <span className="font-['JetBrains_Mono'] text-[11px] text-[#72787a] truncate">{t.audience}</span>
              <button
                onClick={() => onInvestigate(t)}
                className="px-3 py-1 bg-[#0f2930] hover:bg-[#133942] text-white rounded text-xs font-semibold cursor-pointer shrink-0"
              >
                Inspect
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 3. APP MONITORING VIEW
export const AppMonitoringView: React.FC<ViewProps> = ({
  threats,
  onInvestigate,
  onTriggerToast,
}) => {
  const appThreats = threats.filter(
    (t) => t.platform === 'Google Play' || t.platform === 'App Store'
  );

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0">
      <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 min-w-0">
        <div className="min-w-0">
          <h1 className="font-['Manrope'] text-lg sm:text-xl lg:text-2xl font-bold text-[#1a1c1c]">
            Rogue App & APK Store Crawler
          </h1>
          <p className="text-xs text-[#515f74] font-['Inter'] mt-0.5">
            Detecting malicious clones on Google Play Store, Apple App Store, and third-party mirrors.
          </p>
        </div>
        <button
          onClick={() => onTriggerToast('Mobile APK signatures verified against Play Protect.')}
          className="px-3.5 py-2 bg-[#0f2930] text-white rounded-lg text-xs font-['Manrope'] font-semibold cursor-pointer shadow-xs shrink-0 self-start md:self-auto"
        >
          Verify Signatures
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 w-full min-w-0">
        {appThreats.map((t) => (
          <div key={t.id} className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-5 shadow-xs space-y-3 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-['JetBrains_Mono'] text-[10px] font-bold">
                  {t.platform} • ROGUE PACKAGE
                </span>
                <h3 className="font-['Manrope'] text-sm sm:text-base font-bold text-[#1a1c1c] mt-1 truncate">{t.name}</h3>
                <span className="font-['JetBrains_Mono'] text-xs text-[#515f74] truncate block">{t.handleOrPkg}</span>
              </div>
              <span className="font-['JetBrains_Mono'] text-sm text-red-700 font-bold shrink-0">
                Risk {t.riskScore}/100
              </span>
            </div>

            <div className="p-3 bg-[#f3f4f3] rounded-lg text-xs space-y-1 font-['Inter']">
              <div className="text-[#515f74] truncate"><strong>Audience:</strong> {t.audience}</div>
              <div className="text-[#515f74] line-clamp-2"><strong>Vector:</strong> {t.summary}</div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#eeeeed]">
              <button
                onClick={() => onInvestigate(t)}
                className="px-3.5 py-1.5 bg-[#0f2930] hover:bg-[#133942] text-white rounded-lg text-xs font-semibold cursor-pointer shrink-0"
              >
                Deep Inspection & Takedown
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 4. DETECTION CENTER VIEW
export const DetectionCenterView: React.FC<ViewProps> = ({
  threats,
  onInvestigate,
  onOpenTakedown,
  onTriggerToast,
}) => {
  const [filterSeverity, setFilterSeverity] = useState('All');

  const filtered = threats.filter(
    (t) => filterSeverity === 'All' || t.riskCategory === filterSeverity
  );

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0">
      <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 min-w-0">
        <div className="min-w-0">
          <h1 className="font-['Manrope'] text-lg sm:text-xl lg:text-2xl font-bold text-[#1a1c1c]">
            Detection Center & Incident Queue
          </h1>
          <p className="text-xs text-[#515f74] font-['Inter'] mt-0.5">
            Complete triage workbench with automated neural classification and evidence chain-of-custody.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
          <button
            onClick={() => onTriggerToast('Exported detection records to CSV.')}
            className="px-3 py-1.5 border border-[#c2c7ca] rounded-lg text-xs font-semibold font-['Manrope'] hover:bg-[#f3f4f3] cursor-pointer shrink-0"
          >
            Export CSV
          </button>
          <button
            onClick={() => onOpenTakedown()}
            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold font-['Manrope'] cursor-pointer shrink-0"
          >
            Bulk Takedown
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-6 shadow-xs w-full min-w-0">
        <div className="flex items-center justify-between mb-3.5 gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-[#f3f4f3] p-1 rounded-lg shrink-0">
            {['All', 'Critical', 'High', 'Trusted'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterSeverity(s)}
                className={`px-2.5 sm:px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                  filterSeverity === s ? 'bg-white text-[#1a1c1c] shadow-xs' : 'text-[#515f74]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <span className="font-['JetBrains_Mono'] text-xs text-[#515f74] shrink-0">
            Showing {filtered.length} targets
          </span>
        </div>

        <div className="overflow-x-auto custom-scrollbar w-full max-w-full">
          <table className="w-full text-left border-collapse font-['Inter'] text-xs min-w-[620px]">
            <thead>
              <tr className="border-b border-[#eeeeed] font-['JetBrains_Mono'] text-[#515f74] uppercase text-[10px]">
                <th className="py-2.5 px-3">Case ID</th>
                <th className="py-2.5 px-3">Target Name</th>
                <th className="py-2.5 px-3">Platform</th>
                <th className="py-2.5 px-3">Identifier</th>
                <th className="py-2.5 px-3">Risk</th>
                <th className="py-2.5 px-3">Stamp</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eeeeed]">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-[#f9f9f8]">
                  <td className="py-2.5 px-3 font-['JetBrains_Mono'] text-[#515f74]">
                    #{t.id.slice(0, 8)}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-[#1a1c1c] truncate max-w-[160px]">{t.name}</td>
                  <td className="py-2.5 px-3 text-[#515f74]">{t.platform}</td>
                  <td className="py-2.5 px-3 font-['JetBrains_Mono'] text-red-700 truncate max-w-[140px]">{t.handleOrPkg}</td>
                  <td className="py-2.5 px-3 font-['JetBrains_Mono'] font-bold text-red-700">
                    {t.riskScore}/100
                  </td>
                  <td className="py-2.5 px-3 font-['JetBrains_Mono'] text-[11px] text-[#72787a] truncate max-w-[120px]">
                    {t.dateDetected}
                  </td>
                  <td className="py-2.5 px-3 text-right shrink-0">
                    <button
                      onClick={() => onInvestigate(t)}
                      className="px-2.5 py-1 bg-[#0f2930] hover:bg-[#133942] text-white rounded text-xs font-semibold cursor-pointer shrink-0"
                    >
                      Investigate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 5. VERIFIED ASSETS VIEW
export const VerifiedAssetsView: React.FC<ViewProps> = ({
  verifiedAssets,
  onTriggerToast,
}) => {
  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0">
      <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 min-w-0">
        <div className="min-w-0">
          <h1 className="font-['Manrope'] text-lg sm:text-xl lg:text-2xl font-bold text-[#1a1c1c]">
            Safe Harbor Verified Asset Registry
          </h1>
          <p className="text-xs text-[#515f74] font-['Inter'] mt-0.5">
            Legally designated authentic properties used for lookalike entropy benchmarks.
          </p>
        </div>
        <button
          onClick={() => onTriggerToast('Certificates verified across endpoints.')}
          className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-['Manrope'] font-semibold cursor-pointer shadow-xs shrink-0 self-start md:self-auto"
        >
          Verify Certs
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4 w-full min-w-0">
        {verifiedAssets.map((asset) => (
          <div key={asset.id} className="bg-white border border-emerald-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-2.5 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-['JetBrains_Mono'] text-[9px] sm:text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {asset.status}
              </span>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#72787a]">
                ID: {asset.id}
              </span>
            </div>

            <div className="min-w-0">
              <h3 className="font-['Manrope'] font-bold text-sm text-[#1a1c1c] truncate">{asset.name}</h3>
              <p className="font-['JetBrains_Mono'] text-xs text-emerald-700 mt-0.5 truncate">{asset.identifier}</p>
            </div>

            <div className="pt-2 border-t border-[#eeeeed] text-xs text-[#515f74] font-['Inter'] space-y-0.5">
              <div className="truncate">Type: {asset.type}</div>
              <div className="truncate">Entity: {asset.legalEntity}</div>
              <div className="text-[11px] text-[#72787a]">Registered: {asset.registeredDate}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 6. BRAND PROFILE VIEW
export const BrandProfileView: React.FC<ViewProps> = ({ onTriggerToast }) => {
  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0">
      <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-6 shadow-xs min-w-0">
        <h1 className="font-['Manrope'] text-lg sm:text-xl lg:text-2xl font-bold text-[#1a1c1c]">
          Brand Legal Profile & KYC Attestation
        </h1>
        <p className="text-xs text-[#515f74] font-['Inter'] mt-0.5">
          Cryptographic enterprise identity information filed for automated trademark enforcement.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 w-full min-w-0">
        <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-6 shadow-xs space-y-3 font-['Inter'] text-xs min-w-0">
          <h2 className="font-['Manrope'] text-sm sm:text-base font-bold text-[#1a1c1c]">
            Corporate Legal Entity
          </h2>
          <div className="space-y-2 text-[#515f74]">
            <div className="flex justify-between py-1 border-b border-[#eeeeed]">
              <span>Parent Entity:</span>
              <span className="font-semibold text-[#1a1c1c]">One97 Communications Ltd.</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#eeeeed]">
              <span>Jurisdiction:</span>
              <span className="font-semibold text-[#1a1c1c]">India / Global Operations</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#eeeeed]">
              <span>KYC Verification Tier:</span>
              <span className="font-semibold text-emerald-700">Tier-3 Sovereign Verified</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#eeeeed]">
              <span>Registered TM #:</span>
              <span className="font-semibold text-[#1a1c1c]">TM-IN-4892019 (Paytm)</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Primary Counsel:</span>
              <span className="font-semibold text-[#1a1c1c]">IP Enforcement Group</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-6 shadow-xs space-y-3 font-['Inter'] text-xs min-w-0">
          <h2 className="font-['Manrope'] text-sm sm:text-base font-bold text-[#1a1c1c]">
            Neural Brand Asset Embeddings
          </h2>
          <p className="text-[#515f74] leading-relaxed">
            Official logos registered for visual comparison against spoofed accounts.
          </p>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="border border-[#c2c7ca] rounded-lg p-2.5 text-center bg-[#f9f9f8]">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg mx-auto flex items-center justify-center text-white font-bold text-xs">
                PAYTM
              </div>
              <span className="text-[10px] text-[#515f74] mt-1.5 block truncate">Wordmark</span>
            </div>
            <div className="border border-[#c2c7ca] rounded-lg p-2.5 text-center bg-[#f9f9f8]">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#002E6E] rounded-lg mx-auto flex items-center justify-center text-white font-bold text-xs">
                Soundbox
              </div>
              <span className="text-[10px] text-[#515f74] mt-1.5 block truncate">Soundbox</span>
            </div>
            <div className="border border-[#c2c7ca] rounded-lg p-2.5 text-center bg-[#f9f9f8]">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-600 rounded-lg mx-auto flex items-center justify-center text-white font-bold text-xs">
                Bank
              </div>
              <span className="text-[10px] text-[#515f74] mt-1.5 block truncate">Bank</span>
            </div>
          </div>

          <button
            onClick={() => onTriggerToast('Vector embeddings re-indexed with latest filings.')}
            className="w-full py-2 bg-[#0f2930] hover:bg-[#133942] text-white rounded-lg text-xs font-semibold cursor-pointer font-['Manrope']"
          >
            Recompute Vectors
          </button>
        </div>
      </div>
    </div>
  );
};

// 7. SETTINGS VIEW - Responsive Grid conforming to Section 5 requirement
export const SettingsView: React.FC<ViewProps> = ({ onTriggerToast }) => {
  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0">
      <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-6 shadow-xs min-w-0">
        <h1 className="font-['Manrope'] text-lg sm:text-xl lg:text-2xl font-bold text-[#1a1c1c]">
          Platform Settings & Defense Thresholds
        </h1>
        <p className="text-xs text-[#515f74] font-['Inter'] mt-0.5">
          Configure automated takedown triggers, escalation webhooks, and registrar API connections.
        </p>
      </div>

      {/* Responsive Grid that handles side-by-side on desktop, naturally shrinking before stacking on smaller screens */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:grid-cols-2 gap-4 lg:gap-6 font-['Inter'] text-xs w-full min-w-0">
        {/* Card 1: Automated Enforcement Triggers */}
        <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-6 shadow-xs space-y-4 min-w-0">
          <h2 className="font-['Manrope'] text-sm sm:text-base font-bold text-[#1a1c1c]">
            Automated Enforcement Triggers
          </h2>
          <div className="space-y-2.5">
            <label className="flex items-center justify-between p-3 bg-[#f9f9f8] rounded-lg border border-[#eeeeed] gap-2.5 cursor-pointer">
              <div className="min-w-0 flex-1">
                <span className="font-semibold text-[#1a1c1c] block truncate">Auto-Dispatch Cease & Desist (Risk ≥ 90)</span>
                <span className="text-[11px] text-[#515f74] block truncate">Instantly notify registrar and cloud proxy</span>
              </div>
              <input type="checkbox" defaultChecked className="rounded border-[#c2c7ca] text-[#0f2930] shrink-0" />
            </label>

            <label className="flex items-center justify-between p-3 bg-[#f9f9f8] rounded-lg border border-[#eeeeed] gap-2.5 cursor-pointer">
              <div className="min-w-0 flex-1">
                <span className="font-semibold text-[#1a1c1c] block truncate">Zero-Hour IDN Homograph Probing</span>
                <span className="text-[11px] text-[#515f74] block truncate">Flag newly registered Punycode variants immediately</span>
              </div>
              <input type="checkbox" defaultChecked className="rounded border-[#c2c7ca] text-[#0f2930] shrink-0" />
            </label>

            <label className="flex items-center justify-between p-3 bg-[#f9f9f8] rounded-lg border border-[#eeeeed] gap-2.5 cursor-pointer">
              <div className="min-w-0 flex-1">
                <span className="font-semibold text-[#1a1c1c] block truncate">Slack & PagerDuty Alert Relays</span>
                <span className="text-[11px] text-[#515f74] block truncate">Direct incident alerts to security operations channel</span>
              </div>
              <input type="checkbox" defaultChecked className="rounded border-[#c2c7ca] text-[#0f2930] shrink-0" />
            </label>
          </div>
        </div>

        {/* Card 2: Connected Cloud Registrars & Platforms */}
        <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-6 shadow-xs space-y-4 min-w-0">
          <h2 className="font-['Manrope'] text-sm sm:text-base font-bold text-[#1a1c1c]">
            Connected Cloud Registrars & Platforms
          </h2>
          <div className="space-y-2">
            <div className="p-2.5 sm:p-3 bg-[#f9f9f8] rounded-lg border border-[#eeeeed] flex justify-between items-center gap-2">
              <div className="min-w-0">
                <span className="font-semibold text-[#1a1c1c] block truncate">Cloudflare Abuse API</span>
                <span className="text-[11px] text-emerald-700">Authenticated & Active</span>
              </div>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#515f74] shrink-0">OAuth 2.0</span>
            </div>

            <div className="p-2.5 sm:p-3 bg-[#f9f9f8] rounded-lg border border-[#eeeeed] flex justify-between items-center gap-2">
              <div className="min-w-0">
                <span className="font-semibold text-[#1a1c1c] block truncate">Google Play Trust Gateway</span>
                <span className="text-[11px] text-emerald-700">Service Account Linked</span>
              </div>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#515f74] shrink-0">Active</span>
            </div>

            <div className="p-2.5 sm:p-3 bg-[#f9f9f8] rounded-lg border border-[#eeeeed] flex justify-between items-center gap-2">
              <div className="min-w-0">
                <span className="font-semibold text-[#1a1c1c] block truncate">Meta IP Reporting Portal</span>
                <span className="text-[11px] text-emerald-700">Brand Rights v3</span>
              </div>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#515f74] shrink-0">Connected</span>
            </div>
          </div>

          <button
            onClick={() => onTriggerToast('Configuration preferences updated.')}
            className="w-full py-2 bg-[#0f2930] hover:bg-[#133942] text-white rounded-lg text-xs font-semibold cursor-pointer font-['Manrope']"
          >
            Save Security Settings
          </button>
        </div>
      </div>
    </div>
  );
};

// 8. ACTIVE TAKEDOWNS VIEW (Top Nav Tab)
export const ActiveTakedownsView: React.FC<ViewProps> = ({
  takedowns,
  onOpenTakedown,
}) => {
  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0">
      <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 min-w-0">
        <div className="min-w-0">
          <h1 className="font-['Manrope'] text-lg sm:text-xl lg:text-2xl font-bold text-[#1a1c1c]">
            Active Takedowns & Enforcement Operations
          </h1>
          <p className="text-xs text-[#515f74] font-['Inter'] mt-0.5">
            Tracking notices served under 15 U.S.C. § 1125(a) and UDRP fast-track dispute resolutions.
          </p>
        </div>
        <button
          onClick={() => onOpenTakedown()}
          className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-['Manrope'] font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0 self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-[16px]">gavel</span>
          <span>New Legal Notice</span>
        </button>
      </div>

      <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-6 shadow-xs w-full min-w-0">
        <div className="overflow-x-auto custom-scrollbar w-full max-w-full">
          <table className="w-full text-left border-collapse font-['Inter'] text-xs min-w-[620px]">
            <thead>
              <tr className="border-b border-[#eeeeed] font-['JetBrains_Mono'] text-[#515f74] uppercase text-[10px]">
                <th className="py-2 px-3">Notice ID</th>
                <th className="py-2 px-3">Target Entity</th>
                <th className="py-2 px-3">Recipient Abuse Desk</th>
                <th className="py-2 px-3">Legal Basis</th>
                <th className="py-2 px-3">Timestamp</th>
                <th className="py-2 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eeeeed]">
              {takedowns.map((td) => (
                <tr key={td.id} className="hover:bg-[#f9f9f8]">
                  <td className="py-2.5 px-3 font-['JetBrains_Mono'] font-bold text-[#002841]">{td.id}</td>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-[#1a1c1c] truncate max-w-[150px]">{td.targetName}</div>
                    <div className="font-['JetBrains_Mono'] text-[11px] text-red-700 truncate max-w-[140px]">{td.targetIdentifier}</div>
                  </td>
                  <td className="py-2.5 px-3 text-[#515f74] truncate max-w-[140px]">{td.provider}</td>
                  <td className="py-2.5 px-3 text-[#515f74] truncate max-w-[180px]">{td.legalClaim}</td>
                  <td className="py-2.5 px-3 font-['JetBrains_Mono'] text-[11px] text-[#72787a]">{td.issuedAt}</td>
                  <td className="py-2.5 px-3 text-right shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded font-['JetBrains_Mono'] font-bold text-[10px] ${
                        td.status === 'Delisted / Suspended'
                          ? 'bg-emerald-100 text-emerald-800'
                          : td.status === 'Notice Sent'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {td.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 9. EVIDENCE LOGS VIEW (Top Nav Tab)
export const EvidenceLogsView: React.FC<ViewProps> = ({ threats, onTriggerToast }) => {
  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0">
      <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 min-w-0">
        <div className="min-w-0">
          <h1 className="font-['Manrope'] text-lg sm:text-xl lg:text-2xl font-bold text-[#1a1c1c]">
            Forensic Evidence Logs & SHA-256 Ledger
          </h1>
          <p className="text-xs text-[#515f74] font-['Inter'] mt-0.5">
            Immutable chain-of-custody recordings capturing web captures, network hops, and registrar transactions.
          </p>
        </div>
        <button
          onClick={() => onTriggerToast('Exporting cryptographic chain archive...')}
          className="px-3.5 py-2 bg-[#0f2930] hover:bg-[#133942] text-white rounded-lg text-xs font-['Manrope'] font-semibold cursor-pointer shadow-xs shrink-0 self-start md:self-auto"
        >
          Download Signed Archive
        </button>
      </div>

      <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-6 shadow-xs space-y-3.5 w-full min-w-0">
        {threats.map((t, idx) => (
          <div key={t.id} className="p-3.5 sm:p-4 bg-[#f9f9f8] rounded-xl border border-[#eeeeed] space-y-1.5 font-['Inter'] text-xs min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="font-['Manrope'] font-bold text-sm text-[#1a1c1c] truncate">
                {idx + 1}. {t.name}
              </span>
              <span className="font-['JetBrains_Mono'] text-[10px] sm:text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                AUDIT SEALED: {t.dateDetected}
              </span>
            </div>
            <div className="font-['JetBrains_Mono'] text-[10px] sm:text-[11px] text-[#515f74] break-all">
              <span className="font-bold text-[#1a1c1c]">SHA-256 Proof:</span> {t.details.sha256Hash}
            </div>
            <div className="text-[#515f74] text-[11px] truncate">
              <strong>Attribution:</strong> IP: {t.details.ipAddress} • Registrar: {t.details.registrar} • MX: {t.details.mxRecords}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 10. GLOBAL TELEMETRY VIEW (Top Nav Tab)
export const GlobalTelemetryView: React.FC<ViewProps> = () => {
  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0">
      <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-6 shadow-xs min-w-0">
        <h1 className="font-['Manrope'] text-lg sm:text-xl lg:text-2xl font-bold text-[#1a1c1c]">
          Global Crawl Telemetry & Endpoint Probes
        </h1>
        <p className="text-xs text-[#515f74] font-['Inter'] mt-0.5">
          Synchronous probes scanning top-level domain registries, certificate transparency logs, and social APIs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 font-['Inter'] text-xs w-full min-w-0">
        <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-5 shadow-xs space-y-1.5 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#1a1c1c] text-sm font-['Manrope']">Instagram Telemetry</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <p className="text-[#515f74]">Graph API Rate-limit: 92% headroom</p>
          <p className="text-[#515f74]">Last probe: 42 seconds ago</p>
          <div className="font-['JetBrains_Mono'] text-emerald-700 font-bold">Latency: 140ms</div>
        </div>

        <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-5 shadow-xs space-y-1.5 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#1a1c1c] text-sm font-['Manrope']">Google Play Store Probe</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <p className="text-[#515f74]">Play Console Indexer: Normal</p>
          <p className="text-[#515f74]">Last probe: 2 minutes ago</p>
          <div className="font-['JetBrains_Mono'] text-emerald-700 font-bold">Latency: 180ms</div>
        </div>

        <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-5 shadow-xs space-y-1.5 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#1a1c1c] text-sm font-['Manrope']">X Enterprise API</span>
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          </div>
          <p className="text-[#515f74]">Rate-limit: Throttle active (45/100 requests)</p>
          <p className="text-[#515f74]">Fallback: Polling scraper engaged</p>
          <div className="font-['JetBrains_Mono'] text-amber-700 font-bold">Status: Limited</div>
        </div>
      </div>
    </div>
  );
};
