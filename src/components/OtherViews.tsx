import React, { useState, useRef, useEffect } from 'react';
import { ThreatItem, VerifiedAsset, TakedownNotice } from '../types';
import { BRAND_METADATA } from '../data/brandMetadata';
import { toAlphaNumeric } from '../lib/detectionEngine';
import {
  compareVisualProfiles,
  computeDHashFromCanvas,
  computeProfileFromImageFile,
  getStoredVisualReference,
  storeVisualReference,
  clearStoredVisualReference,
  VisualProfile,
} from '../lib/visualIdentity';

interface ViewProps {
  threats: ThreatItem[];
  verifiedAssets: VerifiedAsset[];
  takedowns: TakedownNotice[];
  brand: string;
  onInvestigate: (threat: ThreatItem) => void;
  onOpenTakedown: (threat?: ThreatItem) => void;
  onTriggerToast: (msg: string) => void;
  onExportDossier?: () => void;
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
          <h1 className="font-['Noto_Serif',serif] text-lg sm:text-xl lg:text-2xl font-bold text-[#1a1c1c] tracking-tight">
            Perimeter Security Overview for {brand}
          </h1>
          <p className="text-xs text-[#515f74] font-['Inter'] mt-0.5 leading-relaxed">
            Deterministic risk detection across social networks, mobile app stores, and domain registries with safe-harbor verified assets.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
          <button
            onClick={() => onTriggerToast('Running instant deterministic perimeter audit...')}
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
            {threats.filter((t) => t.riskCategory === 'Critical').length} Critical • {threats.filter((t) => t.riskCategory === 'High').length} High
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
        <h2 className="font-['Noto_Serif',serif] text-sm sm:text-base font-bold text-[#1a1c1c] mb-0.5">
          Recent High-Severity Detections
        </h2>
        <p className="text-xs text-[#515f74] font-['Inter'] mb-3">
          Automated triage queue ordered by deterministic risk score.
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
              {threats.slice(0, 5).map((t) => (
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

// 2. SOCIAL MONITORING VIEW (Phase 2 Goal 3: Useful Investigation Surface)
export const SocialMonitoringView: React.FC<ViewProps> = ({
  threats,
  brand,
  onInvestigate,
  onOpenTakedown,
  onTriggerToast,
}) => {
  const [platformFilter, setPlatformFilter] = useState<'All' | 'X' | 'Instagram' | 'Facebook' | 'Telegram'>('All');
  const [riskFilter, setRiskFilter] = useState<'All' | 'Critical' | 'High' | 'Medium' | 'Trusted'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'risk' | 'audience'>('risk');

  const socialThreats = threats.filter(
    (t) => t.platform === 'X' || t.platform === 'Facebook' || t.platform === 'Instagram' || t.platform === 'Telegram'
  );

  const filteredSocial = socialThreats.filter((t) => {
    if (platformFilter !== 'All' && t.platform !== platformFilter) return false;
    if (riskFilter !== 'All' && t.riskCategory !== riskFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = t.name.toLowerCase().includes(q);
      const matchHandle = t.handleOrPkg.toLowerCase().includes(q);
      const matchSummary = t.summary.toLowerCase().includes(q);
      if (!matchName && !matchHandle && !matchSummary) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'risk') return b.riskScore - a.riskScore;
    return 0;
  });

  const redirectLinksCount = socialThreats.filter((t) => t.details?.redirectTunnel).length;
  const clonedAvatarsCount = socialThreats.filter(
    (t) => (t.analysis?.visualSimilarity?.visualScore ?? 0) >= 75
  ).length;

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0">
      {/* Executive Header */}
      <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#2b94d7] font-semibold bg-[#cce5ff] px-2 py-0.5 rounded">
              SOCIAL RADAR • PHASE 2
            </span>
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#515f74]">
              Deterministic Handle & Visual Profiling
            </span>
          </div>
          <h1 className="font-['Noto_Serif',serif] text-lg sm:text-xl lg:text-2xl font-bold text-[#1a1c1c]">
            Social Media Impersonation Radar
          </h1>
          <p className="text-xs text-[#515f74] font-['Inter'] mt-0.5">
            Monitoring rogue profiles across X, Instagram, Facebook, and Telegram with explainable visual avatar matching.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
          <button
            onClick={() => onTriggerToast('Running deterministic social feed evaluation...')}
            className="px-3.5 py-2 bg-[#0f2930] hover:bg-[#133942] text-white rounded-lg text-xs font-['Manrope'] font-semibold cursor-pointer shadow-xs shrink-0 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[15px] text-[#2b94d7]">refresh</span>
            <span>Rescan Social Feeds</span>
          </button>
        </div>
      </div>

      {/* Real-time Telemetry Stats Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full min-w-0">
        <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-3.5 shadow-xs min-w-0">
          <span className="font-['JetBrains_Mono'] text-[10px] text-[#515f74] uppercase font-semibold block truncate">
            Monitored Handles
          </span>
          <div className="text-2xl font-bold font-['Manrope'] text-[#1a1c1c] mt-1 tabular-nums">
            {socialThreats.length}
          </div>
          <span className="text-[10px] text-[#515f74]">Across 4 platforms</span>
        </div>

        <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-3.5 shadow-xs min-w-0">
          <span className="font-['JetBrains_Mono'] text-[10px] text-[#515f74] uppercase font-semibold block truncate">
            Cloned Brand Logos
          </span>
          <div className="text-2xl font-bold font-['Manrope'] text-red-700 mt-1 tabular-nums">
            {clonedAvatarsCount}
          </div>
          <span className="text-[10px] text-red-600">≥75% pHash / palette match</span>
        </div>

        <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-3.5 shadow-xs min-w-0">
          <span className="font-['JetBrains_Mono'] text-[10px] text-[#515f74] uppercase font-semibold block truncate">
            Bio Redirect Tunnels
          </span>
          <div className="text-2xl font-bold font-['Manrope'] text-amber-700 mt-1 tabular-nums">
            {redirectLinksCount}
          </div>
          <span className="text-[10px] text-amber-700">Off-domain phishing lures</span>
        </div>

        <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-3.5 shadow-xs min-w-0">
          <span className="font-['JetBrains_Mono'] text-[10px] text-[#515f74] uppercase font-semibold block truncate">
            Official Anchors
          </span>
          <div className="text-2xl font-bold font-['Manrope'] text-emerald-700 mt-1 tabular-nums">
            {socialThreats.filter((t) => t.riskCategory === 'Trusted').length}
          </div>
          <span className="text-[10px] text-emerald-700">0 Risk Safe Harbor</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-[#515f74] font-['Manrope'] mr-1">Platform:</span>
          {(['All', 'X', 'Instagram', 'Facebook', 'Telegram'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPlatformFilter(p)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                platformFilter === p
                  ? 'bg-[#0f2930] text-white shadow-xs'
                  : 'bg-[#f3f4f3] text-[#515f74] hover:bg-[#e6e8e7]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search handle or bio..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#f9f9f8] border border-[#c2c7ca] rounded-lg text-xs font-['Inter'] focus:outline-none focus:border-[#0f2930]"
            />
            <span className="material-symbols-outlined text-[16px] text-[#72787a] absolute left-2.5 top-2">
              search
            </span>
          </div>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value as any)}
            className="px-2.5 py-1.5 bg-[#f9f9f8] border border-[#c2c7ca] rounded-lg text-xs font-['Inter'] font-semibold text-[#1a1c1c] cursor-pointer"
          >
            <option value="All">All Risk</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Trusted">Trusted</option>
          </select>
        </div>
      </div>

      {/* Social Investigation Cards Grid */}
      {filteredSocial.length === 0 ? (
        <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-8 text-center text-[#515f74]">
          <span className="material-symbols-outlined text-4xl text-[#72787a] mb-2">person_search</span>
          <p className="text-sm font-semibold">No social accounts match the selected criteria.</p>
          <button
            onClick={() => { setPlatformFilter('All'); setRiskFilter('All'); setSearchQuery(''); }}
            className="mt-3 px-3 py-1.5 bg-[#0f2930] text-white rounded-lg text-xs font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full min-w-0">
          {filteredSocial.map((t) => {
            const isOfficial = t.riskCategory === 'Trusted';
            const visualSim = t.analysis?.visualSimilarity;
            const hasClonedLogo = visualSim && visualSim.visualScore >= 75 && !isOfficial;

            return (
              <div
                key={t.id}
                className={`bg-white border rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between min-w-0 transition-all ${
                  isOfficial
                    ? 'border-emerald-300 bg-emerald-50/10'
                    : t.riskCategory === 'Critical'
                    ? 'border-red-300 hover:border-red-400'
                    : 'border-[#c2c7ca]/70'
                }`}
              >
                <div>
                  {/* Top Bar: Platform & Severity */}
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#eeeeed] text-[#515f74] font-['JetBrains_Mono'] text-[10px] font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">
                        {t.platform === 'X' ? 'tag' : t.platform === 'Instagram' ? 'photo_camera' : 'share'}
                      </span>
                      {t.platform}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {hasClonedLogo && (
                        <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-['JetBrains_Mono'] text-[10px] font-bold border border-red-200">
                          {visualSim.visualScore}% Logo Match
                        </span>
                      )}
                      <span
                        className={`font-['JetBrains_Mono'] text-xs font-bold px-2 py-0.5 rounded ${
                          isOfficial
                            ? 'text-emerald-800 bg-emerald-100'
                            : t.riskCategory === 'Critical'
                            ? 'text-red-700 bg-red-100'
                            : 'text-amber-800 bg-amber-100'
                        }`}
                      >
                        {isOfficial ? 'Trusted' : `Risk ${t.riskScore}/100`}
                      </span>
                    </div>
                  </div>

                  {/* Identity with Avatar */}
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-xs shrink-0 font-['Manrope']"
                      style={{ backgroundColor: t.avatarBg }}
                    >
                      {t.avatarText}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-['Noto_Serif',serif] font-bold text-sm text-[#1a1c1c] truncate">
                        {t.name}
                      </h3>
                      <p className={`font-['JetBrains_Mono'] text-xs font-semibold truncate ${isOfficial ? 'text-emerald-700' : 'text-red-700'}`}>
                        {t.handleOrPkg}
                      </p>
                      <span className="text-[11px] text-[#72787a] font-['Inter'] block mt-0.5">
                        {t.audience}
                      </span>
                    </div>
                  </div>

                  {/* Summary / Vector */}
                  <p className="text-xs text-[#515f74] font-['Inter'] leading-relaxed line-clamp-2 mb-3">
                    {t.summary}
                  </p>

                  {/* Bio Redirect Alert if Present */}
                  {t.details?.redirectTunnel && (
                    <div className="p-2 rounded bg-red-50 border border-red-200 text-[11px] font-['Inter'] mb-3">
                      <span className="font-semibold text-red-800 block">Observed Bio Redirect:</span>
                      <span className="font-['JetBrains_Mono'] text-red-700 truncate block mt-0.5">
                        {t.details.redirectTunnel}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-[#eeeeed] flex items-center justify-between gap-2">
                  <span className="font-['JetBrains_Mono'] text-[10px] text-[#72787a] truncate">
                    {t.dateDetected}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {!isOfficial && (
                      <button
                        onClick={() => onOpenTakedown(t)}
                        className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold cursor-pointer shadow-xs"
                      >
                        Takedown
                      </button>
                    )}
                    <button
                      onClick={() => onInvestigate(t)}
                      className="px-3 py-1 bg-[#0f2930] hover:bg-[#133942] text-white rounded text-xs font-semibold cursor-pointer shrink-0"
                    >
                      Inspect
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// 3. APP MONITORING VIEW (Phase 2 Goal 4 & 5: Challenge-Ready App Impersonation Surface)
export const AppMonitoringView: React.FC<ViewProps> = ({
  threats,
  brand,
  onInvestigate,
  onOpenTakedown,
  onTriggerToast,
}) => {
  const [storeFilter, setStoreFilter] = useState<'All' | 'Google Play' | 'App Store'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const cleanBrand = toAlphaNumeric(brand);
  const metadata = BRAND_METADATA[cleanBrand];
  const officialLogo = metadata?.officialLogo;

  const appThreats = threats.filter(
    (t) => t.platform === 'Google Play' || t.platform === 'App Store'
  );

  const filteredApps = appThreats.filter((t) => {
    if (storeFilter !== 'All' && t.platform !== storeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        t.handleOrPkg.toLowerCase().includes(q) ||
        (t.details?.publisher || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0">
      {/* Executive Header */}
      <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#2b94d7] font-semibold bg-[#cce5ff] px-2 py-0.5 rounded">
              APP STORE & APK CRAWLER • PHASE 2
            </span>
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#515f74]">
              Publisher & Package Validation
            </span>
          </div>
          <h1 className="font-['Noto_Serif',serif] text-lg sm:text-xl lg:text-2xl font-bold text-[#1a1c1c]">
            Rogue App & APK Store Crawler
          </h1>
          <p className="text-xs text-[#515f74] font-['Inter'] mt-0.5">
            Detecting fraudulent applications across Google Play Store, Apple App Store, and third-party mirrors.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
          <button
            onClick={() => onTriggerToast('Verified package certificates against Apple & Google Developer registries.')}
            className="px-3.5 py-2 bg-[#0f2930] hover:bg-[#133942] text-white rounded-lg text-xs font-['Manrope'] font-semibold cursor-pointer shadow-xs shrink-0 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[15px] text-[#2b94d7]">verified_user</span>
            <span>Verify Official Signatures</span>
          </button>
        </div>
      </div>

      {/* Official Registry Reference Anchor Banner */}
      <div className="bg-[#f0f7fa] border border-[#c2c7ca]/70 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-['Inter']">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#002E6E] text-white font-bold flex items-center justify-center shrink-0">
            {officialLogo?.shape === 'rounded' ? 'APP' : 'REF'}
          </div>
          <div>
            <span className="font-bold text-[#002841] block">
              Official Authorized Developer Baseline for {brand}:
            </span>
            <span className="text-[#515f74]">
              Publishers: <strong>{(metadata?.officialPublishers || ['Authorized Entity']).join(', ')}</strong> • Namespace: <strong>{(metadata?.officialPackages || []).join(' / ')}</strong>
            </span>
          </div>
        </div>
        <span className="px-2.5 py-1 bg-white border border-[#c2c7ca]/80 rounded font-['JetBrains_Mono'] text-[11px] text-emerald-800 font-bold shrink-0 self-start sm:self-auto">
          Canonical Verified Standard
        </span>
      </div>

      {/* Store Filter and Search Tabs */}
      <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-[#515f74] font-['Manrope'] mr-1">Store:</span>
          {(['All', 'Google Play', 'App Store'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStoreFilter(s)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                storeFilter === s
                  ? 'bg-[#0f2930] text-white shadow-xs'
                  : 'bg-[#f3f4f3] text-[#515f74] hover:bg-[#e6e8e7]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search package or publisher..."
            className="w-full pl-8 pr-3 py-1.5 bg-[#f9f9f8] border border-[#c2c7ca] rounded-lg text-xs font-['Inter'] focus:outline-none focus:border-[#0f2930]"
          />
          <span className="material-symbols-outlined text-[16px] text-[#72787a] absolute left-2.5 top-2">
            search
          </span>
        </div>
      </div>

      {/* Challenge-Ready App Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 w-full min-w-0">
        {filteredApps.map((t) => {
          const isOfficial = t.riskCategory === 'Trusted';
          const visualSim = t.analysis?.visualSimilarity;
          const publisher = t.details?.publisher || 'Unknown Developer';
          const isOfficialPub = (metadata?.officialPublishers || []).some((p) =>
            publisher.toLowerCase().includes(p.toLowerCase())
          );

          return (
            <div
              key={t.id}
              className={`bg-white border rounded-xl p-4 sm:p-5 shadow-xs space-y-4 min-w-0 ${
                isOfficial ? 'border-emerald-300 bg-emerald-50/15' : 'border-[#c2c7ca]/70'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded font-['JetBrains_Mono'] text-[10px] font-bold ${
                        isOfficial
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {t.platform} • {isOfficial ? 'AUTHENTIC SUITE' : 'ROGUE PACKAGE'}
                    </span>
                    {visualSim && visualSim.visualScore >= 75 && !isOfficial && (
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-['JetBrains_Mono'] text-[10px] font-bold">
                        {visualSim.visualScore}% Icon Resemblance
                      </span>
                    )}
                  </div>

                  <h3 className="font-['Noto_Serif',serif] text-base font-bold text-[#1a1c1c] truncate">
                    {t.name}
                  </h3>
                  <span className="font-['JetBrains_Mono'] text-xs text-[#515f74] block truncate mt-0.5">
                    {t.handleOrPkg}
                  </span>
                </div>

                <span
                  className={`font-['JetBrains_Mono'] text-sm font-bold shrink-0 px-2.5 py-1 rounded ${
                    isOfficial
                      ? 'text-emerald-800 bg-emerald-100'
                      : 'text-red-700 bg-red-100'
                  }`}
                >
                  {isOfficial ? 'Trusted' : `Risk ${t.riskScore}/100`}
                </span>
              </div>

              {/* Side-by-side Forensic Verification Specs */}
              <div className="p-3 bg-[#f9f9f8] rounded-xl border border-[#eeeeed] space-y-2 text-xs font-['Inter']">
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-[#515f74]">Publisher Identity:</span>
                  <span className={`font-semibold truncate max-w-[240px] ${isOfficialPub ? 'text-emerald-800' : 'text-red-700'}`}>
                    {publisher} {isOfficialPub ? '✓ (Official)' : '⚠ (Unauthorized)'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-0.5 border-t border-[#eeeeed]">
                  <span className="text-[#515f74]">Package Namespace:</span>
                  <span className={`font-['JetBrains_Mono'] text-[11px] truncate max-w-[240px] ${isOfficial ? 'text-emerald-800' : 'text-[#1a1c1c]'}`}>
                    {t.handleOrPkg}
                  </span>
                </div>

                {t.analysis?.descriptionSimilarity !== undefined && (
                  <div className="flex justify-between items-center py-0.5 border-t border-[#eeeeed]">
                    <span className="text-[#515f74]">Description Text Match:</span>
                    <span className="font-semibold text-[#1a1c1c]">
                      {t.analysis.descriptionSimilarity}% token overlap with official description
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center py-0.5 border-t border-[#eeeeed]">
                  <span className="text-[#515f74]">Observed User Reach:</span>
                  <span className="font-semibold text-[#1a1c1c]">{t.audience}</span>
                </div>
              </div>

              {/* Description & Threat Vector */}
              <p className="text-xs text-[#515f74] font-['Inter'] leading-relaxed line-clamp-2">
                <strong>Analysis:</strong> {t.summary}
              </p>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#eeeeed]">
                {!isOfficial && (
                  <button
                    onClick={() => onOpenTakedown(t)}
                    className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold font-['Manrope'] cursor-pointer shadow-xs"
                  >
                    Generate Store Takedown Notice
                  </button>
                )}
                <button
                  onClick={() => onInvestigate(t)}
                  className="px-3.5 py-1.5 bg-[#0f2930] hover:bg-[#133942] text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Forensic Deep Dive
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 4. DETECTION CENTER VIEW (With Relocated Compliance Logs & Issue Takedown Action)
export const DetectionCenterView: React.FC<ViewProps> = ({
  threats,
  onInvestigate,
  onOpenTakedown,
  onTriggerToast,
}) => {
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [activeTabMode, setActiveTabMode] = useState<'detections' | 'compliance'>('detections');

  const filtered = threats.filter(
    (t) => filterSeverity === 'All' || t.riskCategory === filterSeverity
  );

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0">
      <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#2b94d7] font-semibold bg-[#cce5ff] px-2 py-0.5 rounded">
              INCIDENT TRIAGE & REMEDIATION
            </span>
          </div>
          <h1 className="font-['Noto_Serif',serif] text-lg sm:text-xl lg:text-2xl font-bold text-[#1a1c1c]">
            Detection Center & Incident Queue
          </h1>
          <p className="text-xs text-[#515f74] font-['Inter'] mt-0.5">
            Complete triage workbench with deterministic risk classification, legal compliance logs, and takedown workflow.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 self-start md:self-auto flex-wrap">
          <button
            onClick={() => setActiveTabMode(activeTabMode === 'detections' ? 'compliance' : 'detections')}
            className={`px-3 py-1.5 border rounded-lg text-xs font-semibold font-['Manrope'] transition-colors cursor-pointer shrink-0 ${
              activeTabMode === 'compliance'
                ? 'bg-[#0f2930] text-white border-[#0f2930]'
                : 'border-[#c2c7ca] text-[#001319] hover:bg-[#f3f4f3]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px] mr-1 align-text-bottom">gavel</span>
            {activeTabMode === 'compliance' ? 'View Detection Queue' : 'Compliance Logs'}
          </button>
          <button
            onClick={() => onTriggerToast('Exported detection records to CSV.')}
            className="px-3 py-1.5 border border-[#c2c7ca] rounded-lg text-xs font-semibold font-['Manrope'] hover:bg-[#f3f4f3] cursor-pointer shrink-0"
          >
            Export CSV
          </button>
          <button
            onClick={() => onOpenTakedown()}
            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold font-['Manrope'] cursor-pointer shrink-0 flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">gavel</span>
            <span>Issue Takedown</span>
          </button>
        </div>
      </div>

      {activeTabMode === 'detections' ? (
        <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-6 shadow-xs w-full min-w-0">
          <div className="flex items-center justify-between mb-3.5 gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-[#f3f4f3] p-1 rounded-lg shrink-0">
              {['All', 'Critical', 'High', 'Medium', 'Trusted'].map((s) => (
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
            <span className="font-['JetBrains_Mono'] text-xs text-[#515f74]">
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
      ) : (
        /* Compliance Logs Sub-View */
        <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-6 shadow-xs w-full min-w-0 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#eeeeed]">
            <div>
              <h2 className="font-['Noto_Serif',serif] text-base font-bold text-[#1a1c1c]">
                Enforcement & Compliance Audit Logs
              </h2>
              <p className="text-xs text-[#515f74]">
                Legal notifications filed under statutory frameworks (15 U.S.C. § 1125, UDRP, DMCA).
              </p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-['JetBrains_Mono'] text-xs font-bold">
              AUDIT TRAIL SECURE
            </span>
          </div>

          <div className="space-y-3 font-['Inter'] text-xs">
            <div className="p-3 bg-[#f9f9f8] rounded-lg border border-[#eeeeed] flex justify-between items-start gap-4">
              <div>
                <span className="font-bold text-[#1a1c1c] block">UDRP Fast-Track Expedited Suspension Notice</span>
                <span className="text-[#515f74]">Dispatched to Namecheap Registrar Abuse Desk for domain paytm-support-desk.cc</span>
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#72787a] block mt-1">Hash: a49f82c...9e38d41 • 2026-10-12 22:10 UTC</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-['JetBrains_Mono'] text-[10px] font-bold shrink-0">NOTICE SENT</span>
            </div>

            <div className="p-3 bg-[#f9f9f8] rounded-lg border border-[#eeeeed] flex justify-between items-start gap-4">
              <div>
                <span className="font-bold text-[#1a1c1c] block">Play Protect Predatory APK Malicious Permission Revocation</span>
                <span className="text-[#515f74]">Submitted to Google LLC Legal for pkg: com.paytm.rewards.bonus (READ_SMS Abuse)</span>
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#72787a] block mt-1">Hash: 98bc431...82910cc • 2026-10-11 16:30 UTC</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-['JetBrains_Mono'] text-[10px] font-bold shrink-0">DELISTED</span>
            </div>

            <div className="p-3 bg-[#f9f9f8] rounded-lg border border-[#eeeeed] flex justify-between items-start gap-4">
              <div>
                <span className="font-bold text-[#1a1c1c] block">Apple App Store DMCA Trademark Infringement Filing</span>
                <span className="text-[#515f74]">Submitted to Apple Legal for spoofed TestFlight profile</span>
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#72787a] block mt-1">Hash: 7788990...112233 • 2026-10-10 19:00 UTC</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-['JetBrains_Mono'] text-[10px] font-bold shrink-0">DELISTED</span>
            </div>
          </div>
        </div>
      )}
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
          <h1 className="font-['Noto_Serif',serif] text-lg sm:text-xl lg:text-2xl font-bold text-[#1a1c1c]">
            Safe Harbor Verified Asset Registry
          </h1>
          <p className="text-xs text-[#515f74] font-['Inter'] mt-0.5">
            Legally designated authentic corporate properties excluded from lookalike risk scoring.
          </p>
        </div>
        <button
          onClick={() => onTriggerToast('Certificates verified across all endpoints.')}
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
              <h3 className="font-['Noto_Serif',serif] font-bold text-sm text-[#1a1c1c] truncate">{asset.name}</h3>
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

// 6. BRAND PROFILE VIEW (Phase 2 Goal 7 & 8: Official Logo Reference & Visual Identity Workflow)
export const BrandProfileView: React.FC<ViewProps> = ({ brand, threats, onTriggerToast }) => {
  const cleanBrand = toAlphaNumeric(brand);
  const metadata = BRAND_METADATA[cleanBrand];
  const demoOfficialLogo = metadata?.officialLogo;

  // Local uploaded official reference state persisted in localStorage
  const [uploadedReference, setUploadedReference] = useState<(VisualProfile & { source: 'uploaded'; label: string }) | null>(() => {
    return getStoredVisualReference(cleanBrand);
  });
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync uploaded reference if brand changes
  useEffect(() => {
    setUploadedReference(getStoredVisualReference(cleanBrand));
    setUploadError(null);
  }, [cleanBrand]);

  const activeOfficialLogo: VisualProfile | undefined = uploadedReference || demoOfficialLogo;

  // State for interactive logo matcher workbench
  const [testCandidateId, setTestCandidateId] = useState<string>('');
  const [customPrimaryColor, setCustomPrimaryColor] = useState<string>('#ba1a1a');
  const [customHash, setCustomHash] = useState<string>(activeOfficialLogo?.pHash || 'a8b2c4e0f1d3e5a7');

  const selectedCandidate = threats.find((t) => t.id === testCandidateId);
  const testProfile: VisualProfile = selectedCandidate?.visualProfile || {
    primaryColor: customPrimaryColor,
    secondaryColor: '#f59e0b',
    pHash: customHash,
    symbolDescription: selectedCandidate?.name || 'Custom Tested Vector Artwork',
  };

  const comparison = activeOfficialLogo ? compareVisualProfiles(testProfile, activeOfficialLogo) : null;

  // Handle local file upload (zero server upload)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    try {
      const profile = await computeProfileFromImageFile(file);
      storeVisualReference(cleanBrand, profile, file.name);
      setUploadedReference({
        ...profile,
        source: 'uploaded',
        label: file.name,
      });
      onTriggerToast(`Processed uploaded official reference for ${brand} locally (${profile.pHash.slice(0, 8)}...).`);
    } catch (err: any) {
      const msg = err?.message || 'Failed to process uploaded image.';
      setUploadError(msg);
      onTriggerToast(msg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleResetToDemo = () => {
    clearStoredVisualReference(cleanBrand);
    setUploadedReference(null);
    setUploadError(null);
    onTriggerToast(`Restored built-in demo baseline reference for ${brand}.`);
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0">
      {/* Header */}
      <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-6 shadow-xs min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-['JetBrains_Mono'] text-[10px] text-[#2b94d7] font-semibold bg-[#cce5ff] px-2 py-0.5 rounded">
            SOVEREIGN ASSET REGISTRY
          </span>
          <span className="font-['JetBrains_Mono'] text-[10px] text-[#515f74]">
            Trademark Verification & Visual Anchors
          </span>
        </div>
        <h1 className="font-['Noto_Serif',serif] text-lg sm:text-xl lg:text-2xl font-bold text-[#1a1c1c]">
          Brand Legal Profile & Visual Identity Anchor
        </h1>
        <p className="text-xs text-[#515f74] font-['Inter'] mt-0.5">
          Registered enterprise identity files, trademark metadata, and mathematical perceptual hash anchors for {brand}.
        </p>
      </div>

      {/* Relocated Organization Verification Card */}
      <div className="bg-[#002841] text-white border border-[#2b94d7]/30 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#2b94d7]/20 border border-[#2b94d7]/40 flex items-center justify-center font-['JetBrains_Mono'] font-bold text-sm text-[#cce5ff]">
              {brand.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="font-['Manrope'] text-base font-bold flex items-center gap-2">
                <span>{brand} Sovereign Corporate Perimeter</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <span className="font-['JetBrains_Mono'] text-xs text-[#779199]">
                Legal Entity DRP #{demoOfficialLogo?.trademarkNumber || 'TM-4892019'} • KYC Tier-3 Verified
              </span>
            </div>
          </div>
          <span className="font-['JetBrains_Mono'] text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-1 rounded">
            Tier-3 Verified
          </span>
        </div>

        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-xs font-['Inter'] text-[#779199]">
            <span>Perimeter Protection Benchmark</span>
            <span className="text-white font-semibold">Stage 4 of 4 Verified</span>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <div className="bg-[#2b94d7] h-full rounded-full transition-all duration-500" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>

      {/* SECTION: OFFICIAL VISUAL REFERENCE (Local Browser Pipeline) */}
      <div className="bg-white border border-[#c2c7ca]/70 rounded-xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#eeeeed]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded font-['JetBrains_Mono'] text-[10px] font-bold bg-[#cce5ff] text-[#002841]">
                OFFICIAL VISUAL REFERENCE
              </span>
              {uploadedReference ? (
                <span className="px-2 py-0.5 rounded font-['JetBrains_Mono'] text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-200">
                  Uploaded Official Reference
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded font-['JetBrains_Mono'] text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Local Prototype Reference
                </span>
              )}
            </div>
            <h2 className="font-['Noto_Serif',serif] text-base sm:text-lg font-bold text-[#1a1c1c]">
              Official Visual Identity Benchmark for {brand}
            </h2>
            <p className="text-xs text-[#515f74] font-['Inter'] mt-0.5">
              The canonical image and 64-bit dHash baseline against which all candidate icons and avatars are measured.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.webp,.svg,image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={handleFileUpload}
              className="hidden"
              id="upload-reference-logo-input"
            />
            <label
              htmlFor="upload-reference-logo-input"
              className="px-3.5 py-2 bg-[#0f2930] hover:bg-[#133942] text-white rounded-lg text-xs font-['Manrope'] font-semibold cursor-pointer shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-[#2b94d7]">upload_file</span>
              <span>{isUploading ? 'Computing dHash...' : 'Upload Reference Logo'}</span>
            </label>

            {uploadedReference && (
              <button
                onClick={handleResetToDemo}
                className="px-3 py-2 bg-[#f3f4f3] hover:bg-[#e6e8e7] text-[#515f74] hover:text-[#1a1c1c] rounded-lg text-xs font-['Manrope'] font-semibold cursor-pointer transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">restart_alt</span>
                <span>Reset to Demo Reference</span>
              </button>
            )}
          </div>
        </div>

        {uploadError && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">error</span>
            <span>{uploadError}</span>
          </div>
        )}

        {/* Visual Reference Spec Card */}
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 p-4 rounded-xl bg-[#f9f9f8] border border-[#eeeeed] items-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center p-2 shadow-xs border border-white/60 shrink-0 overflow-hidden"
               style={{ backgroundColor: activeOfficialLogo?.primaryColor || '#002E6E' }}>
            {uploadedReference?.svgIcon ? (
              <img src={uploadedReference.svgIcon} alt="Uploaded Reference" className="w-full h-full object-contain" />
            ) : demoOfficialLogo?.imageSrc ? (
              <img src={demoOfficialLogo.imageSrc} alt={demoOfficialLogo.name} className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full flex items-center justify-center" dangerouslySetInnerHTML={{ __html: demoOfficialLogo?.vectorSvg || '' }} />
            )}
          </div>

          <div className="space-y-1.5 min-w-0 font-['Inter'] text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-sm sm:text-base text-[#1a1c1c]">
                {uploadedReference ? uploadedReference.symbolDescription : demoOfficialLogo?.name}
              </h3>
              <span className="font-['JetBrains_Mono'] text-[11px] text-[#515f74]">
                {uploadedReference ? 'Source: Local Browser Upload' : `TM: ${demoOfficialLogo?.trademarkNumber}`}
              </span>
            </div>

            <p className="text-xs text-[#515f74]">
              {uploadedReference
                ? 'Processed strictly in-memory using HTML5 Canvas difference hashing. File never leaves your machine.'
                : demoOfficialLogo?.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="text-[#72787a]">Primary Color:</span>
                <span className="w-3 h-3 rounded-full border border-[#c2c7ca]" style={{ backgroundColor: activeOfficialLogo?.primaryColor }} />
                <span className="font-['JetBrains_Mono'] font-bold text-[#1a1c1c]">{activeOfficialLogo?.primaryColor}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#72787a]">64-bit dHash:</span>
                <span className="font-['JetBrains_Mono'] text-emerald-800 font-bold bg-white px-1.5 py-0.5 rounded border border-[#c2c7ca]/50">
                  {activeOfficialLogo?.pHash}
                </span>
              </div>
              <div className="text-[#72787a]">
                Accepted Formats: PNG, JPEG, WEBP, SVG (&le; 1 MB)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Official Brand Identity & Vector Reference (Goal 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 w-full min-w-0">
        {/* Card 1: Official Vector Logo Anchor */}
        <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-6 shadow-xs space-y-4 font-['Inter'] text-xs min-w-0">
          <div className="flex items-center justify-between">
            <h2 className="font-['Noto_Serif',serif] text-base font-bold text-[#1a1c1c] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#2b94d7] text-[18px]">verified</span>
              <span>Official Registered Logo Anchor</span>
            </h2>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-['JetBrains_Mono'] text-[10px] font-bold">
              PERCEPTUAL GOLD STANDARD
            </span>
          </div>

          <div className="p-4 bg-[#f9f9f8] rounded-xl border border-[#eeeeed] flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center p-2 shadow-xs shrink-0 overflow-hidden"
              style={{ backgroundColor: activeOfficialLogo?.primaryColor || '#002E6E' }}
            >
              {uploadedReference?.svgIcon ? (
                <img src={uploadedReference.svgIcon} alt="Uploaded Logo" className="w-full h-full object-contain" />
              ) : demoOfficialLogo?.imageSrc ? (
                <img src={demoOfficialLogo.imageSrc} alt={demoOfficialLogo.name} className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" dangerouslySetInnerHTML={{ __html: demoOfficialLogo?.vectorSvg || '' }} />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-[#1a1c1c] truncate">
                {uploadedReference ? uploadedReference.symbolDescription : demoOfficialLogo?.name}
              </h3>
              <span className="font-['JetBrains_Mono'] text-xs text-[#515f74] block mt-0.5 truncate">
                TM: {demoOfficialLogo?.trademarkNumber || 'TM-LOCAL-CUSTOM'}
              </span>
              <p className="text-[11px] text-[#72787a] mt-1 truncate">
                {uploadedReference ? 'Custom Local Browser Reference' : demoOfficialLogo?.description}
              </p>
            </div>
          </div>

          <div className="space-y-2 text-[#515f74]">
            <div className="flex justify-between py-1 border-b border-[#eeeeed]">
              <span>Primary Brand Color:</span>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded border border-[#c2c7ca]" style={{ backgroundColor: activeOfficialLogo?.primaryColor }} />
                <span className="font-['JetBrains_Mono'] font-bold text-[#1a1c1c]">{activeOfficialLogo?.primaryColor}</span>
              </div>
            </div>
            <div className="flex justify-between py-1 border-b border-[#eeeeed]">
              <span>Secondary Accent Color:</span>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded border border-[#c2c7ca]" style={{ backgroundColor: activeOfficialLogo?.secondaryColor }} />
                <span className="font-['JetBrains_Mono'] font-bold text-[#1a1c1c]">{activeOfficialLogo?.secondaryColor}</span>
              </div>
            </div>
            <div className="flex justify-between py-1 border-b border-[#eeeeed]">
              <span>64-bit Perceptual Hash (dHash):</span>
              <span className="font-['JetBrains_Mono'] text-emerald-800 font-bold">{activeOfficialLogo?.pHash}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Mathematical Metric:</span>
              <span className="text-[#1a1c1c] font-semibold">Hamming Distance (64 bits) + RGB Color Space</span>
            </div>
          </div>
        </div>

        {/* Card 2: Interactive Live Logo Matcher Workbench */}
        <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-6 shadow-xs space-y-4 font-['Inter'] text-xs min-w-0">
          <div className="flex items-center justify-between">
            <h2 className="font-['Noto_Serif',serif] text-base font-bold text-[#1a1c1c] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#2b94d7] text-[18px]">compare</span>
              <span>Live Visual Matcher Workbench</span>
            </h2>
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#515f74]">
              Deterministic pHash
            </span>
          </div>

          <p className="text-[#515f74] leading-relaxed">
            Test any monitored candidate or modify color profiles to compute deterministic structural similarity against the active official brand reference.
          </p>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-[#515f74] block mb-1">
                Select Candidate Entity to Inspect:
              </label>
              <select
                value={testCandidateId}
                onChange={(e) => setTestCandidateId(e.target.value)}
                className="w-full p-2 bg-[#f9f9f8] border border-[#c2c7ca] rounded-lg text-xs font-['Inter'] text-[#1a1c1c] cursor-pointer"
              >
                <option value="">-- Custom Profile (Manual Inputs) --</option>
                {threats.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.platform} - {t.riskCategory})
                  </option>
                ))}
              </select>
            </div>

            {/* Live Comparison Output Card */}
            {comparison && (
              <div className="p-3.5 rounded-xl border border-[#c2c7ca]/70 bg-gradient-to-r from-[#f9f9f8] to-[#eef6f9] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#002841] text-xs">Deterministic Comparison Score:</span>
                  <span
                    className={`font-['JetBrains_Mono'] font-bold text-sm px-2.5 py-0.5 rounded ${
                      comparison.visualScore >= 80
                        ? 'bg-red-100 text-red-800'
                        : comparison.visualScore >= 50
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {comparison.visualScore}% Visual Match
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-white rounded-lg border border-[#eeeeed]">
                    <span className="text-[#72787a] block">Structural pHash Match:</span>
                    <span className="font-bold text-[#1a1c1c] text-xs">{comparison.pHashScore}%</span>
                    <span className="text-[10px] text-[#515f74] block">Hamming Δ: {comparison.hammingDistance}/64 bits</span>
                  </div>

                  <div className="p-2 bg-white rounded-lg border border-[#eeeeed]">
                    <span className="text-[#72787a] block">Palette Color Match:</span>
                    <span className="font-bold text-[#1a1c1c] text-xs">{comparison.colorScore}%</span>
                    <span className="text-[10px] text-[#515f74] block">{comparison.dominantColorMatch ? 'Dominant match' : 'Palette shifted'}</span>
                  </div>
                </div>

                <p className="text-[11px] text-[#515f74] leading-relaxed pt-1">
                  <strong>Explanation:</strong> {comparison.explanation}
                </p>
              </div>
            )}

            <button
              onClick={() => onTriggerToast('Visual anchor benchmark recalculated against active reference.')}
              className="w-full py-2 bg-[#0f2930] hover:bg-[#133942] text-white rounded-lg text-xs font-semibold cursor-pointer font-['Manrope']"
            >
              Re-evaluate Visual Baseline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 7. SETTINGS VIEW (With Relocated System Health Diagnostics)
export const SettingsView: React.FC<ViewProps> = ({ onTriggerToast }) => {
  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0">
      <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-6 shadow-xs min-w-0">
        <h1 className="font-['Noto_Serif',serif] text-lg sm:text-xl lg:text-2xl font-bold text-[#1a1c1c]">
          Platform Settings & System Health Diagnostics
        </h1>
        <p className="text-xs text-[#515f74] font-['Inter'] mt-0.5">
          Configure automated takedown triggers, escalation webhooks, and inspect real-time system node health.
        </p>
      </div>

      {/* Relocated System Health Diagnostics Module */}
      <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-6 shadow-xs space-y-4 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#eeeeed]">
          <div>
            <h2 className="font-['Noto_Serif',serif] text-base font-bold text-[#1a1c1c] flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600">dns</span>
              <span>System Health & Node Status</span>
            </h2>
            <p className="text-xs text-[#515f74]">
              High-availability Sentinel nodes monitoring global registrar registries.
            </p>
          </div>
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-['JetBrains_Mono'] text-xs font-bold rounded flex items-center gap-1.5 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            ALL SYSTEMS OPERATIONAL
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-['Inter']">
          <div className="p-3 bg-[#f9f9f8] rounded-lg border border-[#eeeeed]">
            <span className="text-[#515f74] font-medium block">DNSSEC Resolution Cluster</span>
            <span className="font-bold text-[#1a1c1c] text-sm mt-0.5 block">100% Validated</span>
            <span className="text-emerald-700 font-['JetBrains_Mono'] text-[10px]">Latency: 18ms</span>
          </div>
          <div className="p-3 bg-[#f9f9f8] rounded-lg border border-[#eeeeed]">
            <span className="text-[#515f74] font-medium block">Certificate Transparency Monitors</span>
            <span className="font-bold text-[#1a1c1c] text-sm mt-0.5 block">Deterministic Queue</span>
            <span className="text-emerald-700 font-['JetBrains_Mono'] text-[10px]">Streams: 24 active</span>
          </div>
          <div className="p-3 bg-[#f9f9f8] rounded-lg border border-[#eeeeed]">
            <span className="text-[#515f74] font-medium block">Adversarial Prober Gateway</span>
            <span className="font-bold text-[#1a1c1c] text-sm mt-0.5 block">99.98% Uptime</span>
            <span className="text-emerald-700 font-['JetBrains_Mono'] text-[10px]">Global nodes: 18</span>
          </div>
        </div>
      </div>

      {/* Two-Column Responsive Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:grid-cols-2 gap-4 lg:gap-6 font-['Inter'] text-xs w-full min-w-0">
        {/* Card 1: Automated Enforcement Triggers */}
        <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-6 shadow-xs space-y-4 min-w-0">
          <h2 className="font-['Noto_Serif',serif] text-sm sm:text-base font-bold text-[#1a1c1c]">
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

        {/* Card 2: Prototype Registrars & Platforms */}
        <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-6 shadow-xs space-y-4 min-w-0">
          <h2 className="font-['Noto_Serif',serif] text-sm sm:text-base font-bold text-[#1a1c1c]">
            Prototype Registrars & Platforms
          </h2>
          <div className="space-y-2">
            <div className="p-2.5 sm:p-3 bg-[#f9f9f8] rounded-lg border border-[#eeeeed] flex justify-between items-center gap-2">
              <div className="min-w-0">
                <span className="font-semibold text-[#1a1c1c] block truncate">Cloudflare Abuse API</span>
                <span className="text-[11px] text-emerald-700">Prototype Dataset</span>
              </div>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#515f74] shrink-0">Demo</span>
            </div>

            <div className="p-2.5 sm:p-3 bg-[#f9f9f8] rounded-lg border border-[#eeeeed] flex justify-between items-center gap-2">
              <div className="min-w-0">
                <span className="font-semibold text-[#1a1c1c] block truncate">Google Play Trust Gateway</span>
                <span className="text-[11px] text-emerald-700">Prototype Dataset</span>
              </div>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#515f74] shrink-0">Prototype</span>
            </div>

            <div className="p-2.5 sm:p-3 bg-[#f9f9f8] rounded-lg border border-[#eeeeed] flex justify-between items-center gap-2">
              <div className="min-w-0">
                <span className="font-semibold text-[#1a1c1c] block truncate">Apple App Store Legal Desk</span>
                <span className="text-[11px] text-emerald-700">App Store Connect</span>
              </div>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#515f74] shrink-0">Demo Connector</span>
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

// 8. ACTIVE TAKEDOWNS VIEW (Top Nav Tab - With Issue Takedown Action)
export const ActiveTakedownsView: React.FC<ViewProps> = ({
  takedowns,
  onOpenTakedown,
  onTriggerToast,
}) => {
  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0">
      <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 min-w-0">
        <div className="min-w-0">
          <h1 className="font-['Noto_Serif',serif] text-lg sm:text-xl lg:text-2xl font-bold text-[#1a1c1c]">
            Active Legal Takedowns & Enforcement Notices
          </h1>
          <p className="text-xs text-[#515f74] font-['Inter'] mt-0.5">
            Formal cease-and-desist filings dispatched to registrars, cloud CDNs, social platforms, and app stores.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
          <button
            onClick={() => onOpenTakedown()}
            className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-['Manrope'] font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">gavel</span>
            <span>Issue Takedown</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-6 shadow-xs w-full min-w-0">
        <div className="overflow-x-auto custom-scrollbar w-full max-w-full">
          <table className="w-full text-left border-collapse font-['Inter'] text-xs min-w-[620px]">
            <thead>
              <tr className="border-b border-[#eeeeed] font-['JetBrains_Mono'] text-[#515f74] uppercase text-[10px]">
                <th className="py-2.5 px-3">Notice ID</th>
                <th className="py-2.5 px-3">Target Name</th>
                <th className="py-2.5 px-3">Identifier</th>
                <th className="py-2.5 px-3">Provider / Host</th>
                <th className="py-2.5 px-3">Legal Basis</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eeeeed]">
              {takedowns.map((td) => (
                <tr key={td.id} className="hover:bg-[#f9f9f8]">
                  <td className="py-2.5 px-3 font-['JetBrains_Mono'] text-[#515f74]">
                    #{td.id}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-[#1a1c1c] truncate max-w-[150px]">
                    {td.targetName}
                  </td>
                  <td className="py-2.5 px-3 font-['JetBrains_Mono'] text-red-700 truncate max-w-[150px]">
                    {td.targetIdentifier}
                  </td>
                  <td className="py-2.5 px-3 text-[#515f74] truncate max-w-[120px]">
                    {td.provider}
                  </td>
                  <td className="py-2.5 px-3 text-[#515f74] truncate max-w-[160px]">
                    {td.legalClaim}
                  </td>
                  <td className="py-2.5 px-3 text-right shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded font-['JetBrains_Mono'] text-[10px] font-bold ${
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

// 9. EVIDENCE LOGS VIEW (With Relocated Export Dossier CTA)
export const EvidenceLogsView: React.FC<ViewProps> = ({ threats, onExportDossier }) => {
  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0">
      <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 min-w-0">
        <div className="min-w-0">
          <h1 className="font-['Noto_Serif',serif] text-lg sm:text-xl lg:text-2xl font-bold text-[#1a1c1c]">
            Forensic Evidence Logs & SHA-256 Ledger
          </h1>
          <p className="text-xs text-[#515f74] font-['Inter'] mt-0.5">
            Immutable chain-of-custody recordings capturing web captures, network hops, and registrar transactions.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
          <button
            onClick={() => onExportDossier?.()}
            className="px-3.5 py-2 bg-[#0f2930] hover:bg-[#133942] text-white rounded-lg text-xs font-['Manrope'] font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Export Evidence Dossier</span>
          </button>
        </div>
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

// 10. GLOBAL TELEMETRY VIEW
export const GlobalTelemetryView: React.FC<ViewProps> = () => {
  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0">
      <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-6 shadow-xs min-w-0">
        <h1 className="font-['Noto_Serif',serif] text-lg sm:text-xl lg:text-2xl font-bold text-[#1a1c1c]">
          Global Crawl Telemetry & Endpoint Probes
        </h1>
        <p className="text-xs text-[#515f74] font-['Inter'] mt-0.5">
          Simulated source status from the controlled prototype dataset; no live API connections.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 font-['Inter'] text-xs w-full min-w-0">
        <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-5 shadow-xs space-y-1.5 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#1a1c1c] text-sm font-['Manrope']">Instagram Telemetry</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <p className="text-[#515f74]">Source: Prototype Dataset</p>
          <p className="text-[#515f74]">Deterministic profiling enabled</p>
          <div className="font-['JetBrains_Mono'] text-emerald-700 font-bold">Status: Simulated</div>
        </div>

        <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-5 shadow-xs space-y-1.5 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#1a1c1c] text-sm font-['Manrope']">Google Play & App Store Probes</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <p className="text-[#515f74]">Source: Prototype Dataset</p>
          <p className="text-[#515f74]">Package & publisher validation</p>
          <div className="font-['JetBrains_Mono'] text-emerald-700 font-bold">Status: Simulated</div>
        </div>

        <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-5 shadow-xs space-y-1.5 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#1a1c1c] text-sm font-['Manrope']">X Enterprise API</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <p className="text-[#515f74]">Source: Prototype Dataset</p>
          <p className="text-[#515f74]">Handle & typo-squatting detection</p>
          <div className="font-['JetBrains_Mono'] text-emerald-700 font-bold">Status: Simulated</div>
        </div>
      </div>
    </div>
  );
};
