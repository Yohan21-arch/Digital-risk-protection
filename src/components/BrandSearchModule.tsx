import React from 'react';
import { ThreatItem, VerifiedAsset, PlatformType, RiskLevel } from '../types';

interface BrandSearchModuleProps {
  currentBrand: string;
  onBrandChange: (brand: string) => void;
  threats: ThreatItem[];
  verifiedAssets: VerifiedAsset[];
  selectedPlatform: PlatformType;
  onSelectPlatform: (platform: PlatformType) => void;
  selectedRisk: RiskLevel;
  onSelectRisk: (risk: RiskLevel) => void;
  onInvestigate: (threat: ThreatItem) => void;
  onOpenCharacterMatrix: () => void;
  onOpenRegisterAsset: () => void;
  onTriggerScan: () => void;
  isScanning: boolean;
  scanStep: number;
}

export const BrandSearchModule: React.FC<BrandSearchModuleProps> = ({
  currentBrand,
  onBrandChange,
  threats,
  verifiedAssets,
  selectedPlatform,
  onSelectPlatform,
  selectedRisk,
  onSelectRisk,
  onInvestigate,
  onOpenCharacterMatrix,
  onOpenRegisterAsset,
  onTriggerScan,
  isScanning,
  scanStep,
}) => {
  // Platform counts
  const platformCounts: Record<string, number> = {
    All: threats.length,
    Instagram: threats.filter((t) => t.platform === 'Instagram').length || 8,
    Facebook: threats.filter((t) => t.platform === 'Facebook').length || 5,
    X: threats.filter((t) => t.platform === 'X').length || 9,
    'Google Play': threats.filter((t) => t.platform === 'Google Play').length || 4,
    'App Store': threats.filter((t) => t.platform === 'App Store').length || 2,
  };

  // Filtered threats
  const filteredThreats = threats.filter((item) => {
    const matchesPlatform =
      selectedPlatform === 'All' || item.platform === selectedPlatform;
    const matchesRisk =
      selectedRisk === 'All' || item.riskCategory === selectedRisk;
    return matchesPlatform && matchesRisk;
  });

  const steps = [
    { num: '01', title: 'Profile', desc: 'Preparing Brand' },
    { num: '02', title: 'Assets', desc: 'Checking Trusted' },
    { num: '03', title: 'Social', desc: 'Searching Social' },
    { num: '04', title: 'Stores', desc: 'Searching App Stores' },
    { num: '05', title: 'Names', desc: 'Analyzing Names' },
    { num: '06', title: 'Visual', desc: 'Comparing Identity' },
    { num: '07', title: 'Risk', desc: 'Calculating Risk' },
    { num: '08', title: 'Final', desc: 'Complete' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0">
      {/* 1. EXECUTIVE METRICS BENTO OVERVIEW */}
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 lg:gap-4 w-full min-w-0">
        {/* Threats Detected */}
        <div className="bg-white border border-[#c2c7ca]/50 rounded-xl p-3.5 sm:p-4 shadow-xs relative overflow-hidden flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-['JetBrains_Mono'] text-[10px] sm:text-[11px] text-[#515f74] tracking-wide uppercase font-semibold truncate">
              Threats Detected
            </span>
            <span className="material-symbols-outlined text-[#72787a] text-[18px] sm:text-[20px] shrink-0">
              crisis_alert
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
            <span className="font-['Manrope'] text-2xl sm:text-3xl font-bold text-[#1a1c1c] tabular-nums">
              28
            </span>
            <span className="font-['JetBrains_Mono'] text-[11px] sm:text-xs text-[#ba1a1a] font-medium">
              +4 today
            </span>
          </div>
          <div className="mt-2 w-full bg-[#eeeeed] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#ba1a1a] h-full rounded-full transition-all duration-500"
              style={{ width: '70%' }}
            ></div>
          </div>
        </div>

        {/* Critical Impersonation */}
        <div className="bg-gradient-to-br from-white to-red-50/30 border border-red-200 rounded-xl p-3.5 sm:p-4 shadow-xs flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-['JetBrains_Mono'] text-[10px] sm:text-[11px] text-red-800 tracking-wide uppercase font-semibold truncate">
              Critical Impersonation
            </span>
            <span
              className="material-symbols-outlined text-red-600 text-[18px] sm:text-[20px] shrink-0"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              report
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
            <span className="font-['Manrope'] text-2xl sm:text-3xl font-bold text-red-700 tabular-nums">
              4
            </span>
            <span className="font-['JetBrains_Mono'] text-[10px] sm:text-[11px] text-red-700 font-semibold bg-red-100/90 px-1.5 py-0.5 rounded">
              Urgent
            </span>
          </div>
          <span className="font-['Inter'] text-[10px] sm:text-[11px] text-[#515f74] mt-1 truncate">
            2 phishing, 2 app stores
          </span>
        </div>

        {/* High Risk */}
        <div className="bg-white border border-orange-200 rounded-xl p-3.5 sm:p-4 shadow-xs flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-['JetBrains_Mono'] text-[10px] sm:text-[11px] text-orange-800 tracking-wide uppercase font-semibold truncate">
              High Risk
            </span>
            <span className="material-symbols-outlined text-orange-600 text-[18px] sm:text-[20px] shrink-0">
              warning
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
            <span className="font-['Manrope'] text-2xl sm:text-3xl font-bold text-orange-700 tabular-nums">
              7
            </span>
            <span className="font-['JetBrains_Mono'] text-[10px] sm:text-[11px] text-orange-800 truncate">
              Support spoofing
            </span>
          </div>
          <span className="font-['Inter'] text-[10px] sm:text-[11px] text-[#515f74] mt-1 truncate">
            Pending legal review
          </span>
        </div>

        {/* Verified Assets */}
        <div className="bg-gradient-to-br from-white to-emerald-50/30 border border-emerald-200 rounded-xl p-3.5 sm:p-4 shadow-xs flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-['JetBrains_Mono'] text-[10px] sm:text-[11px] text-emerald-800 tracking-wide uppercase font-semibold truncate">
              Verified Assets
            </span>
            <span
              className="material-symbols-outlined text-emerald-600 text-[18px] sm:text-[20px] shrink-0"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified_user
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
            <span className="font-['Manrope'] text-2xl sm:text-3xl font-bold text-emerald-700 tabular-nums">
              12
            </span>
            <span className="font-['JetBrains_Mono'] text-[10px] sm:text-[11px] text-emerald-700 bg-emerald-100/90 px-1.5 py-0.5 rounded font-semibold">
              100% Intact
            </span>
          </div>
          <span className="font-['Inter'] text-[10px] sm:text-[11px] text-[#515f74] mt-1 truncate">
            Safe harbor synced
          </span>
        </div>

        {/* Sources Monitored */}
        <div className="bg-white border border-[#c2c7ca]/50 rounded-xl p-3.5 sm:p-4 shadow-xs flex flex-col justify-between min-w-0 col-span-2 md:col-span-1 xl:col-span-1">
          <div className="flex items-center justify-between">
            <span className="font-['JetBrains_Mono'] text-[10px] sm:text-[11px] text-[#515f74] tracking-wide uppercase font-semibold truncate">
              Sources Monitored
            </span>
            <span className="material-symbols-outlined text-[#515f74] text-[18px] sm:text-[20px] shrink-0">
              hub
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
            <span className="font-['Manrope'] text-2xl sm:text-3xl font-bold text-[#1a1c1c] tabular-nums">
              7
            </span>
            <span className="font-['JetBrains_Mono'] text-[10px] sm:text-[11px] text-[#515f74] truncate">
              Global networks
            </span>
          </div>
          <span className="font-['Inter'] text-[10px] sm:text-[11px] text-[#515f74] mt-1 truncate">
            Continuous zero-hour scans
          </span>
        </div>
      </section>

      {/* 2. INTERACTIVE BRAND SEARCH & HOMOGRAPH RADAR */}
      <section className="bg-white border border-[#c2c7ca]/60 rounded-xl shadow-xs overflow-hidden w-full min-w-0">
        {/* Search Banner & Form Header */}
        <div className="p-4 sm:p-6 border-b border-[#eeeeed] bg-gradient-to-r from-white via-white to-[#f3f4f3]/60">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6 min-w-0">
            <div className="max-w-2xl min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-[#cce5ff] text-[#001d31] font-['JetBrains_Mono'] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase shrink-0">
                  Active DRP Probe
                </span>
                <span className="font-['JetBrains_Mono'] text-[10px] sm:text-[11px] text-[#515f74] truncate">
                  Homograph & Typo-squatting Engine 4.2
                </span>
              </div>
              <h1 className="font-['Manrope'] text-xl sm:text-2xl lg:text-3xl font-bold text-[#1a1c1c] tracking-tight">
                Search your brand across the digital ecosystem
              </h1>
              <p className="text-[#515f74] text-xs sm:text-sm font-['Inter'] mt-1 leading-relaxed">
                Automated cross-platform deep inspection targeting rogue domain registrations,
                unauthorized app packages, and high-velocity social support spoofing.
              </p>
            </div>

            {/* Interactive Search Input Group */}
            <div className="w-full lg:w-96 flex flex-col gap-2 min-w-0 shrink-0">
              <div className="relative flex items-center min-w-0">
                <span className="material-symbols-outlined text-[#515f74] absolute left-3 text-[18px]">
                  travel_explore
                </span>
                <input
                  type="text"
                  value={currentBrand}
                  onChange={(e) => onBrandChange(e.target.value)}
                  placeholder="Enter brand name, entity or token..."
                  className="w-full pl-10 pr-20 py-2.5 sm:py-3 bg-[#f9f9f8] border border-[#c2c7ca] rounded-xl text-[#1a1c1c] text-xs sm:text-sm font-semibold focus:border-[#2b94d7] focus:ring-1 focus:ring-[#2b94d7]/20 transition-all shadow-inner font-['Inter'] min-w-0"
                />
                <button
                  onClick={onTriggerScan}
                  disabled={isScanning}
                  className="absolute right-1.5 px-2.5 sm:px-3 py-1.5 bg-[#0f2930] hover:bg-[#133942] disabled:opacity-70 text-white font-['Manrope'] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>{isScanning ? 'Scanning...' : 'Scan'}</span>
                  <span className="material-symbols-outlined text-[15px]">
                    arrow_forward
                  </span>
                </button>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 font-['JetBrains_Mono'] text-[10px] sm:text-[11px] text-[#515f74] flex-wrap">
                <span className="shrink-0">Quick switch:</span>
                <button
                  onClick={() => onBrandChange('Paytm')}
                  className="text-[#2b94d7] hover:underline font-semibold cursor-pointer"
                >
                  Paytm
                </button>
                <span>•</span>
                <button
                  onClick={() => onBrandChange('Acme Corp')}
                  className="text-[#2b94d7] hover:underline font-semibold cursor-pointer"
                >
                  Acme Corp
                </button>
                <span>•</span>
                <button
                  onClick={() => onBrandChange('One97')}
                  className="text-[#2b94d7] hover:underline font-semibold cursor-pointer"
                >
                  One97
                </button>
              </div>
            </div>
          </div>

          {/* Homograph Alert Indicator Banner */}
          <div className="mt-5 p-3.5 bg-amber-50/90 border border-amber-200 rounded-xl flex flex-wrap items-center justify-between gap-2.5 text-amber-950 min-w-0">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="p-1.5 bg-amber-100 rounded-lg text-amber-700 shrink-0">
                <span className="material-symbols-outlined text-[18px]">warning</span>
              </div>
              <div className="text-xs sm:text-sm font-['Inter'] min-w-0">
                <span className="font-semibold text-amber-900">
                  Active Homograph Threat Alert:
                </span>
                <span className="text-amber-900 ml-1">
                  Detected character-substitution variations:
                </span>
                <span className="font-['JetBrains_Mono'] font-bold bg-amber-100/90 px-1.5 py-0.5 rounded text-amber-800 ml-1 text-[11px]">
                  Paytmm
                </span>
                <span className="font-['JetBrains_Mono'] font-bold bg-amber-100/90 px-1.5 py-0.5 rounded text-amber-800 ml-1 text-[11px]">
                  Pay-tm-support
                </span>
                <span className="font-['JetBrains_Mono'] font-bold bg-amber-100/90 px-1.5 py-0.5 rounded text-amber-800 ml-1 text-[11px]">
                  Pàytm
                </span>
              </div>
            </div>
            <button
              onClick={onOpenCharacterMatrix}
              className="text-xs font-semibold text-amber-800 hover:text-amber-950 underline flex items-center gap-1 cursor-pointer font-['Manrope'] shrink-0"
            >
              <span>View Character Matrix</span>
              <span className="material-symbols-outlined text-[15px]">open_in_new</span>
            </button>
          </div>
        </div>

        {/* Multi-stage Scan Progress Stepper */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-[#f3f4f3]/40 border-b border-[#eeeeed] w-full min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  isScanning ? 'bg-[#2b94d7] animate-ping' : 'bg-emerald-500'
                }`}
              ></span>
              <span className="font-['JetBrains_Mono'] text-xs font-semibold text-[#1a1c1c] truncate">
                {isScanning
                  ? `DRP Scanning Pipeline: Analyzing Target "${currentBrand}"...`
                  : 'DRP Pipeline Active: Continuous Synchronous Sentinel'}
              </span>
            </div>
            <span className="font-['JetBrains_Mono'] text-[10px] sm:text-[11px] text-[#515f74] shrink-0">
              Latency: 280ms • 14,892 endpoints indexed
            </span>
          </div>

          {/* Stepper Track */}
          <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-2 min-w-0 w-full">
            {steps.map((step, idx) => {
              const isPassed = !isScanning || scanStep >= idx + 1;
              const isCurrent = isScanning && scanStep === idx + 1;
              return (
                <div
                  key={step.num}
                  className={`flex flex-col gap-1 border-t-2 pt-1.5 transition-all min-w-0 ${
                    isPassed
                      ? 'border-emerald-500 text-emerald-800'
                      : isCurrent
                      ? 'border-[#2b94d7] text-[#004b73] font-bold'
                      : 'border-[#c2c7ca] text-[#72787a]'
                  }`}
                >
                  <span className="font-['JetBrains_Mono'] text-[9px] sm:text-[10px] font-bold uppercase tracking-wider flex items-center justify-between">
                    <span className="truncate">
                      {step.num}. {step.title}
                    </span>
                    {isPassed ? (
                      <span
                        className="material-symbols-outlined text-[13px] text-emerald-600 shrink-0"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                    ) : isCurrent ? (
                      <span className="material-symbols-outlined text-[13px] text-[#2b94d7] animate-spin shrink-0">
                        progress_activity
                      </span>
                    ) : (
                      <span className="w-2 h-2 rounded-full border border-[#c2c7ca] shrink-0"></span>
                    )}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-medium truncate font-['Inter']">
                    {step.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter Bar: Multi-channel platform tabs & Risk tabs */}
        <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-b border-[#eeeeed] bg-[#f9f9f8] flex flex-wrap items-center justify-between gap-2.5 sm:gap-4 w-full min-w-0">
          {/* Platform Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1 sm:pb-0 max-w-full">
            {(['All', 'Instagram', 'Facebook', 'X', 'Google Play', 'App Store'] as PlatformType[]).map(
              (platform) => {
                const isActive = selectedPlatform === platform;
                const count = platformCounts[platform] || 0;
                const label =
                  platform === 'All'
                    ? 'All Sources'
                    : platform === 'X'
                    ? `X / Twitter (${count})`
                    : `${platform} (${count})`;
                return (
                  <button
                    key={platform}
                    onClick={() => onSelectPlatform(platform)}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-['Inter'] transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                      isActive
                        ? 'font-semibold bg-[#0f2930] text-white shadow-xs'
                        : 'font-medium text-[#515f74] hover:text-[#1a1c1c] hover:bg-[#f3f4f3]'
                    }`}
                  >
                    {label}
                  </button>
                );
              }
            )}
          </div>

          {/* Risk Severity Tabs */}
          <div className="flex items-center gap-1 bg-[#f3f4f3] p-1 rounded-lg border border-[#c2c7ca]/60 shrink-0 overflow-x-auto max-w-full">
            {(
              [
                { label: 'All (28)', val: 'All' },
                { label: 'Critical (4)', val: 'Critical', color: 'text-red-700' },
                { label: 'High (7)', val: 'High', color: 'text-orange-700' },
                { label: 'Medium (5)', val: 'Medium', color: 'text-amber-700' },
                { label: 'Trusted (12)', val: 'Trusted', color: 'text-emerald-700' },
              ] as { label: string; val: RiskLevel; color?: string }[]
            ).map((r) => {
              const isActive = selectedRisk === r.val;
              return (
                <button
                  key={r.val}
                  onClick={() => onSelectRisk(r.val)}
                  className={`px-2 sm:px-2.5 py-1 rounded text-[11px] sm:text-xs font-['Inter'] transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'font-semibold bg-white text-[#1a1c1c] shadow-xs'
                      : `font-medium ${r.color || 'text-[#515f74]'} hover:bg-white/60`
                  }`}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detection Results Queue */}
        <div className="divide-y divide-[#eeeeed] w-full min-w-0">
          {filteredThreats.length === 0 ? (
            <div className="p-10 text-center text-[#515f74]">
              <span className="material-symbols-outlined text-3xl text-[#72787a] mb-2">
                verified_user
              </span>
              <p className="font-['Manrope'] text-sm sm:text-base font-semibold text-[#1a1c1c]">
                No threats matched this filter
              </p>
              <p className="text-xs mt-1">
                Try switching platform sources or resetting severity filters.
              </p>
            </div>
          ) : (
            filteredThreats.map((item) => {
              const isTrusted = item.riskCategory === 'Trusted';
              const isCritical = item.riskCategory === 'Critical';
              const isHigh = item.riskCategory === 'High';

              return (
                <div
                  key={item.id}
                  onClick={() => onInvestigate(item)}
                  className={`p-4 sm:p-6 hover:bg-[#f3f4f3]/40 transition-all cursor-pointer group w-full min-w-0 ${
                    isTrusted ? 'bg-emerald-50/15' : ''
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 min-w-0">
                    {/* Left: Avatar & Details */}
                    <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
                      <div className="relative shrink-0">
                        {item.avatarType === 'letter' ? (
                          <div
                            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${item.avatarBg} border ${
                              isCritical ? 'border-red-300' : 'border-[#c2c7ca]'
                            } flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-xs`}
                          >
                            {item.avatarText}
                          </div>
                        ) : item.avatarType === 'icon' ? (
                          <div
                            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${item.avatarBg} border ${
                              isCritical ? 'border-red-300' : 'border-orange-300'
                            } flex items-center justify-center text-white shadow-xs`}
                          >
                            <span className="material-symbols-outlined text-xl sm:text-2xl">
                              {item.avatarText}
                            </span>
                          </div>
                        ) : (
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white border border-emerald-300 flex items-center justify-center p-2 shadow-xs">
                            <div className="w-full h-full bg-blue-600 rounded flex items-center justify-center text-white font-bold text-[10px] sm:text-xs tracking-tight">
                              {item.avatarText}
                            </div>
                          </div>
                        )}

                        {/* Status Icon Badge */}
                        {isTrusted ? (
                          <span className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-emerald-600 text-white flex items-center justify-center ring-2 ring-white">
                            <span
                              className="material-symbols-outlined text-[11px]"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              check
                            </span>
                          </span>
                        ) : (
                          <span className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-white">
                            !
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-['Manrope'] text-sm sm:text-base font-bold text-[#1a1c1c] group-hover:text-[#002841] transition-colors break-words">
                            {item.name}
                          </h3>

                          {/* Risk Chip */}
                          {isCritical && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-['JetBrains_Mono'] text-[9px] sm:text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 uppercase shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                              Critical Impersonation
                            </span>
                          )}
                          {isHigh && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-['JetBrains_Mono'] text-[9px] sm:text-[10px] font-semibold bg-orange-50 text-orange-700 border border-orange-200 uppercase shrink-0">
                              High Risk
                            </span>
                          )}
                          {isTrusted && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-['JetBrains_Mono'] text-[9px] sm:text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                              Verified Safe Harbor
                            </span>
                          )}

                          <span className="px-1.5 py-0.5 rounded bg-[#eeeeed] text-[#515f74] font-['JetBrains_Mono'] text-[9px] sm:text-[10px] shrink-0">
                            {item.platform === 'X'
                              ? 'X / Twitter'
                              : item.platform === 'Google Play'
                              ? 'Google Play APK'
                              : item.platform === 'Facebook'
                              ? 'Facebook Page'
                              : item.platform}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[#515f74] text-xs font-['Inter'] mt-1 flex-wrap">
                          <span
                            className={`font-['JetBrains_Mono'] font-semibold truncate ${
                              isCritical
                                ? 'text-red-700'
                                : isTrusted
                                ? 'text-emerald-800'
                                : 'text-[#515f74]'
                            }`}
                          >
                            {item.handleOrPkg}
                          </span>
                          <span>•</span>
                          <span className="truncate max-w-md">{item.summary}</span>
                          <span>•</span>
                          <span className="font-['JetBrains_Mono'] text-[11px] shrink-0">
                            {item.audience}
                          </span>
                        </div>

                        {/* Explainable Signals */}
                        <div className="flex items-center gap-1.5 sm:gap-2 mt-2.5 flex-wrap min-w-0">
                          {item.explainableSignals.map((sig, sIdx) => {
                            let badgeStyle =
                              'bg-[#eeeeed] text-[#515f74] border-transparent';
                            if (sig.type === 'critical') {
                              badgeStyle = 'bg-red-50 text-red-800 border-red-200';
                            } else if (sig.type === 'high') {
                              badgeStyle =
                                'bg-orange-50 text-orange-800 border-orange-200';
                            } else if (sig.type === 'warning') {
                              badgeStyle =
                                'bg-amber-50 text-amber-800 border-amber-200';
                            } else if (sig.type === 'safe') {
                              badgeStyle =
                                'bg-emerald-50 text-emerald-800 border-emerald-200';
                            }

                            return (
                              <span
                                key={sIdx}
                                className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-medium font-['JetBrains_Mono'] border flex items-center gap-1 ${badgeStyle} shrink-0`}
                              >
                                {sig.icon && (
                                  <span className="material-symbols-outlined text-[12px] sm:text-[13px]">
                                    {sig.icon}
                                  </span>
                                )}
                                <span className="truncate max-w-[200px]">{sig.label}</span>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Right: Score Gauge & Actions */}
                    <div className="flex lg:flex-col items-center lg:items-end justify-between gap-2.5 sm:gap-3 min-w-0 shrink-0 lg:w-40 pt-2 lg:pt-0 border-t lg:border-t-0">
                      <div className="text-right">
                        <div className="flex items-baseline gap-1 lg:justify-end">
                          <span
                            className={`font-['Manrope'] font-bold text-sm sm:text-base ${
                              isCritical
                                ? 'text-red-700'
                                : isHigh
                                ? 'text-orange-700'
                                : isTrusted
                                ? 'text-emerald-700'
                                : 'text-[#1a1c1c]'
                            }`}
                          >
                            Risk {item.riskScore}
                          </span>
                          <span className="font-['JetBrains_Mono'] text-[10px] sm:text-[11px] text-[#515f74]">
                            / 100
                          </span>
                        </div>
                        <div className="w-24 sm:w-28 bg-[#eeeeed] h-1.5 rounded-full overflow-hidden mt-1">
                          <div
                            className={`h-full rounded-full ${
                              isCritical
                                ? 'bg-red-600'
                                : isHigh
                                ? 'bg-orange-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{
                              width: `${Math.max(item.riskScore, 2)}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      {isTrusted ? (
                        <div className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-[11px] sm:text-xs font-semibold rounded border border-emerald-200 font-['Inter'] shrink-0">
                          Protected Safe
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onInvestigate(item);
                          }}
                          className="px-3 py-1.5 bg-[#0f2930] hover:bg-[#133942] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 shadow-xs cursor-pointer font-['Manrope'] shrink-0"
                        >
                          <span>{isCritical ? 'Investigate' : 'Review'}</span>
                          <span className="material-symbols-outlined text-[15px]">
                            arrow_forward
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* 3. VERIFIED ASSET REGISTRY & TAKEDOWN VELOCITY */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 w-full min-w-0">
        {/* Left 2 Cols: Verified Asset Safe Harbor Registry */}
        <div className="lg:col-span-2 bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-6 shadow-xs min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 min-w-0">
              <div className="min-w-0">
                <h2 className="font-['Manrope'] text-base sm:text-lg font-bold text-[#1a1c1c]">
                  Verified Asset Registry
                </h2>
                <p className="text-xs text-[#515f74] font-['Inter']">
                  Legally declared safe harbor tokens used by neural comparison models.
                </p>
              </div>
              <button
                onClick={onOpenRegisterAsset}
                className="px-3 py-1.5 bg-white hover:bg-[#f3f4f3] border border-[#c2c7ca] rounded-lg text-xs font-semibold text-[#001319] transition-all flex items-center gap-1.5 self-start cursor-pointer font-['Manrope'] shrink-0"
              >
                <span className="material-symbols-outlined text-[15px]">add</span>
                <span>Register Official Asset</span>
              </button>
            </div>

            <div className="overflow-x-auto custom-scrollbar w-full max-w-full">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-[#eeeeed] font-['JetBrains_Mono'] text-[#515f74] uppercase text-[10px]">
                    <th className="py-2.5 px-3">Asset Token / Entity</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Identifier</th>
                    <th className="py-2.5 px-3">Legal Entity</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eeeeed] font-['Inter'] text-xs">
                  {verifiedAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-[#f9f9f8]">
                      <td className="py-2.5 px-3 font-semibold text-[#1a1c1c] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                        <span className="truncate max-w-[160px]">{asset.name}</span>
                      </td>
                      <td className="py-2.5 px-3 text-[#515f74]">{asset.type}</td>
                      <td className="py-2.5 px-3 font-['JetBrains_Mono'] text-emerald-800 font-medium truncate max-w-[140px]">
                        {asset.identifier}
                      </td>
                      <td className="py-2.5 px-3 text-[#515f74] truncate max-w-[140px]">{asset.legalEntity}</td>
                      <td className="py-2.5 px-3 text-right shrink-0">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-['JetBrains_Mono'] font-bold text-[9px] sm:text-[10px]">
                          {asset.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Threat Remediation Pipeline Velocity */}
        <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-6 shadow-xs flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-['Manrope'] text-base sm:text-lg font-bold text-[#1a1c1c]">
                Takedown Velocity
              </h2>
              <span className="font-['JetBrains_Mono'] text-[11px] sm:text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                98.4% Success
              </span>
            </div>
            <p className="text-xs text-[#515f74] font-['Inter']">
              Mean Time to Remediation (MTTR) over the rolling 30-day window.
            </p>

            <div className="mt-5 space-y-3.5">
              <div>
                <div className="flex justify-between text-xs mb-1 font-['Inter']">
                  <span className="text-[#515f74] font-medium truncate">
                    Domain Registrar Suspension
                  </span>
                  <span className="font-['JetBrains_Mono'] font-bold text-[#1a1c1c] shrink-0">
                    3.8 hrs avg
                  </span>
                </div>
                <div className="w-full bg-[#eeeeed] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#0f2930] h-full rounded-full"
                    style={{ width: '82%' }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-['Inter']">
                  <span className="text-[#515f74] font-medium truncate">
                    Google Play Store De-listing
                  </span>
                  <span className="font-['JetBrains_Mono'] font-bold text-[#1a1c1c] shrink-0">
                    6.1 hrs avg
                  </span>
                </div>
                <div className="w-full bg-[#eeeeed] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#2b94d7] h-full rounded-full"
                    style={{ width: '74%' }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-['Inter']">
                  <span className="text-[#515f74] font-medium truncate">
                    Social Account Suspension
                  </span>
                  <span className="font-['JetBrains_Mono'] font-bold text-[#1a1c1c] shrink-0">
                    2.4 hrs avg
                  </span>
                </div>
                <div className="w-full bg-[#eeeeed] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: '93%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-[#eeeeed] flex items-center justify-between">
            <span className="text-xs text-[#515f74] font-['Inter'] truncate">
              Automated Cease & Desist API
            </span>
            <span className="font-['JetBrains_Mono'] text-[10px] sm:text-[11px] text-[#004b73] font-bold bg-[#d5e3fc] px-2 py-0.5 rounded shrink-0">
              ONLINE
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
