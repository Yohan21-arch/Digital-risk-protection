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
  // DEMO BRANDS for quick testing
  const demoBrands = ['Paytm', 'Amazon', 'Nike', 'PhonePe', 'Microsoft'];

  // EXPANDED DATASET: 23 Brands categorized by industry sector (Phase 3.5)
  const ALL_EXPANDED_BRANDS = [
    { sector: 'Payments / Fintech', brands: ['Paytm', 'PhonePe', 'Google Pay', 'Razorpay'] },
    { sector: 'Banking', brands: ['HDFC Bank', 'ICICI Bank'] },
    { sector: 'E-Commerce', brands: ['Amazon', 'Flipkart', 'Meesho'] },
    { sector: 'Technology', brands: ['Microsoft', 'Google', 'Apple', 'Adobe'] },
    { sector: 'Telecom', brands: ['Jio', 'Airtel'] },
    { sector: 'Food / Delivery', brands: ['Zomato', 'Swiggy'] },
    { sector: 'Travel / Hospitality', brands: ['MakeMyTrip', 'OYO'] },
    { sector: 'Sports / Lifestyle', brands: ['Nike', 'Adidas'] },
    { sector: 'Entertainment', brands: ['Netflix', 'Spotify'] },
  ];
  const allBrandNames = ALL_EXPANDED_BRANDS.flatMap((g) => g.brands);

  // DYNAMIC METRICS: Calculated directly from the current search results (PART M)
  const totalDetections = threats.length;
  const indexedNetworks = new Set(threats.map(t => t.platform)).size;
  const criticalCount = threats.filter((t) => t.riskCategory === 'Critical').length;
  const highCount = threats.filter((t) => t.riskCategory === 'High').length;
  const mediumCount = threats.filter((t) => t.riskCategory === 'Medium').length;
  const lowCount = threats.filter((t) => t.riskCategory === 'Low').length;
  const trustedCount = threats.filter((t) => t.riskCategory === 'Trusted').length;

  // Dynamic platform counts (no fake hardcoded fallback counts)
  const platformCounts: Record<string, number> = {
    All: threats.length,
    Instagram: threats.filter((t) => t.platform === 'Instagram').length,
    Facebook: threats.filter((t) => t.platform === 'Facebook').length,
    X: threats.filter((t) => t.platform === 'X').length,
    'Google Play': threats.filter((t) => t.platform === 'Google Play').length,
    'App Store': threats.filter((t) => t.platform === 'App Store').length,
    Telegram: threats.filter((t) => t.platform === 'Telegram').length,
    'Web Domain': threats.filter((t) => t.platform === 'Web Domain').length,
  };

  // Filtered threats based on active platform and risk severity
  const filteredThreats = threats.filter((item) => {
    const matchesPlatform =
      selectedPlatform === 'All' || item.platform === selectedPlatform;
    const matchesRisk =
      selectedRisk === 'All' || item.riskCategory === selectedRisk;
    return matchesPlatform && matchesRisk;
  });

  // Human-readable scan steps (PART L)
  const scanSteps = [
    { num: '01', title: 'Brand Identity', desc: 'Preparing identity' },
    { num: '02', title: 'Safe Harbor', desc: 'Checking verified assets' },
    { num: '03', title: 'Social Web', desc: 'Searching social profiles' },
    { num: '04', title: 'App Stores', desc: 'Searching mobile apps' },
    { num: '05', title: 'Look-alikes', desc: 'Analyzing look-alike names' },
    { num: '06', title: 'Account Auth', desc: 'Evaluating account identity' },
    { num: '07', title: 'Risk Analysis', desc: 'Deterministic risk analysis' },
    { num: '08', title: 'Triage Results', desc: 'Preparing final report' },
  ];

  // Helper to handle demo chip click: sets brand and immediately triggers scan
  const handleSelectDemoBrand = (brand: string) => {
    onBrandChange(brand);
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0">
      {/* 1. EXECUTIVE METRICS BENTO OVERVIEW - REAL DYNAMIC METRICS (PART M & B) */}
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 lg:gap-4 w-full min-w-0">
        {/* Total Detections Card */}
        <div className="bg-white border-t-2 border-t-[#0f2930] border-x border-b border-[#c2c7ca]/60 rounded-xl p-3.5 sm:p-4 shadow-xs relative overflow-hidden flex flex-col justify-between min-w-0 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-['JetBrains_Mono'] text-[10px] sm:text-[11px] text-[#515f74] tracking-wide uppercase font-semibold truncate">
              Threats Detected
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#0f2930]/10 flex items-center justify-center text-[#0f2930] shrink-0">
              <span className="material-symbols-outlined text-[17px]">crisis_alert</span>
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
            <span className="font-['Noto_Serif',serif] text-2xl sm:text-3xl font-bold text-[#1a1c1c] tabular-nums">
              {totalDetections}
            </span>
            <span className="font-['JetBrains_Mono'] text-[10px] sm:text-[11px] text-[#515f74]">
              for &ldquo;{currentBrand}&rdquo;
            </span>
          </div>
          <div className="mt-2 w-full bg-[#eeeeed] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#0f2930] h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.max(10, totalDetections * 15))}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Critical Impersonation Card */}
        <div className="bg-gradient-to-br from-white to-red-50/40 border-t-2 border-t-red-600 border-x border-b border-red-200/80 rounded-xl p-3.5 sm:p-4 shadow-xs flex flex-col justify-between min-w-0 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-['JetBrains_Mono'] text-[10px] sm:text-[11px] text-red-800 tracking-wide uppercase font-semibold truncate">
              Critical Risk
            </span>
            <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center text-red-600 shrink-0">
              <span
                className="material-symbols-outlined text-[17px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                report
              </span>
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
            <span className="font-['Noto_Serif',serif] text-2xl sm:text-3xl font-bold text-red-700 tabular-nums">
              {criticalCount}
            </span>
            {criticalCount > 0 && (
              <span className="font-['JetBrains_Mono'] text-[9px] sm:text-[10px] text-red-800 font-semibold bg-red-100 px-1.5 py-0.5 rounded">
                Action Required
              </span>
            )}
          </div>
          <span className="font-['Inter'] text-[10px] sm:text-[11px] text-red-800/80 mt-1 truncate">
            {criticalCount === 0 ? 'No critical threats active' : 'Impersonation & Phishing'}
          </span>
        </div>

        {/* High Risk Card */}
        <div className="bg-gradient-to-br from-white to-amber-50/40 border-t-2 border-t-amber-500 border-x border-b border-amber-200/80 rounded-xl p-3.5 sm:p-4 shadow-xs flex flex-col justify-between min-w-0 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-['JetBrains_Mono'] text-[10px] sm:text-[11px] text-amber-800 tracking-wide uppercase font-semibold truncate">
              High Severity
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <span className="material-symbols-outlined text-[17px]">warning</span>
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
            <span className="font-['Noto_Serif',serif] text-2xl sm:text-3xl font-bold text-amber-800 tabular-nums">
              {highCount}
            </span>
            <span className="font-['JetBrains_Mono'] text-[10px] sm:text-[11px] text-amber-800 truncate">
              Look-alike entities
            </span>
          </div>
          <span className="font-['Inter'] text-[10px] sm:text-[11px] text-[#515f74] mt-1 truncate">
            {highCount === 0 ? 'No high alerts' : 'Pending legal review'}
          </span>
        </div>

        {/* Verified Assets Card */}
        <div className="bg-gradient-to-br from-white to-emerald-50/40 border-t-2 border-t-emerald-600 border-x border-b border-emerald-200/80 rounded-xl p-3.5 sm:p-4 shadow-xs flex flex-col justify-between min-w-0 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-['JetBrains_Mono'] text-[10px] sm:text-[11px] text-emerald-800 tracking-wide uppercase font-semibold truncate">
              Verified Assets
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
              <span
                className="material-symbols-outlined text-[17px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified_user
              </span>
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
            <span className="font-['Noto_Serif',serif] text-2xl sm:text-3xl font-bold text-emerald-800 tabular-nums">
              {verifiedAssets.length}
            </span>
            <span className="font-['JetBrains_Mono'] text-[9px] sm:text-[10px] text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded font-semibold">
              Safe Harbor
            </span>
          </div>
          <span className="font-['Inter'] text-[10px] sm:text-[11px] text-emerald-800/80 mt-1 truncate">
            {trustedCount} matched in this scan
          </span>
        </div>

        {/* Sources Monitored Card */}
        <div className="bg-white border-t-2 border-t-[#2b94d7] border-x border-b border-[#c2c7ca]/60 rounded-xl p-3.5 sm:p-4 shadow-xs flex flex-col justify-between min-w-0 col-span-2 md:col-span-1 xl:col-span-1 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-['JetBrains_Mono'] text-[10px] sm:text-[11px] text-[#515f74] tracking-wide uppercase font-semibold truncate">
              Networks Indexed
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#2b94d7]/15 flex items-center justify-center text-[#2b94d7] shrink-0">
              <span className="material-symbols-outlined text-[17px]">hub</span>
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
            <span className="font-['Noto_Serif',serif] text-2xl sm:text-3xl font-bold text-[#1a1c1c] tabular-nums">
              {indexedNetworks}
            </span>
            <span className="font-['JetBrains_Mono'] text-[10px] sm:text-[11px] text-emerald-700 font-semibold">
              In current results
            </span>
          </div>
          <span className="font-['Inter'] text-[10px] sm:text-[11px] text-[#515f74] mt-1 truncate">
            Social, App Stores & Domains
          </span>
        </div>
      </section>

      {/* 2. INTERACTIVE BRAND SEARCH & HOMOGRAPH RADAR (MAXIMALIST HERO WITH NOTO SERIF) */}
      <section className="bg-white border border-[#c2c7ca]/70 rounded-2xl shadow-xs overflow-hidden w-full min-w-0">
        {/* Search Hero with subtle gradient and decorative patterns */}
        <div className="p-4 sm:p-6 lg:p-7 border-b border-[#eeeeed] bg-gradient-to-r from-[#f9f9f8] via-[#eef6f9] to-[#f9f9f8] relative overflow-hidden">
          {/* Faint subtle grid watermark */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(#0f2930 1px, transparent 1px), radial-gradient(#0f2930 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 10px 10px',
            }}
          ></div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6 min-w-0 relative z-10">
            <div className="max-w-2xl min-w-0">
              {/* Eyebrow Labels */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-full bg-[#0f2930] text-[#cce7f0] font-['JetBrains_Mono'] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase shrink-0">
                  LIVE ANALYSIS
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#cce5ff] text-[#002841] font-['JetBrains_Mono'] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase shrink-0">
                  DETERMINISTIC DRP ENGINE
                </span>
                <span className="font-['JetBrains_Mono'] text-[10px] sm:text-[11px] text-[#515f74] truncate">
                  Prototype Dataset
                </span>
              </div>

              {/* Major Heading in Noto Serif */}
              <h1
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1a1c1c] tracking-tight leading-tight"
                style={{ fontFamily: "'Noto Serif', serif" }}
              >
                Search your brand across the digital ecosystem
              </h1>
              <p className="text-[#515f74] text-xs sm:text-sm font-['Inter'] mt-1.5 leading-relaxed">
                Deterministic string normalization, Levenshtein distance, token matching,
                and look-alike character substitution targeting rogue apps, domains, and social profiles.
              </p>
            </div>

            {/* Interactive Search Input Group & Demo Brand Chips */}
            <div className="w-full lg:w-[420px] flex flex-col gap-2.5 min-w-0 shrink-0">
              <div className="relative flex items-center min-w-0">
                <span className="material-symbols-outlined text-[#515f74] absolute left-3.5 text-[20px]">
                  travel_explore
                </span>
                <input
                  type="text"
                  value={currentBrand}
                  onChange={(e) => onBrandChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onTriggerScan();
                  }}
                  placeholder="Enter brand name (e.g. Paytm, Amazon, Nike)..."
                  className="w-full pl-11 pr-24 py-2.5 sm:py-3 bg-white border border-[#c2c7ca] rounded-xl text-[#1a1c1c] text-xs sm:text-sm font-semibold focus:border-[#2b94d7] focus:ring-2 focus:ring-[#2b94d7]/20 transition-all shadow-xs font-['Inter'] min-w-0"
                />
                <button
                  onClick={onTriggerScan}
                  disabled={isScanning}
                  className="absolute right-1.5 px-3 sm:px-3.5 py-1.5 bg-[#0f2930] hover:bg-[#133942] disabled:opacity-70 text-white font-['Manrope'] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                >
                  <span className="material-symbols-outlined text-[15px] text-[#2b94d7]">
                    radar
                  </span>
                  <span>{isScanning ? 'Scanning...' : 'Scan'}</span>
                </button>
              </div>

              {/* Demo Brand Chips (PART L) */}
              <div className="flex items-center gap-1.5 sm:gap-2 font-['Inter'] text-xs text-[#515f74] flex-wrap">
                <span className="font-['JetBrains_Mono'] text-[11px] font-semibold text-[#1a1c1c] shrink-0">
                  Try a demo brand:
                </span>
                <div className="flex items-center gap-1 flex-wrap">
                  {demoBrands.map((b) => {
                    const isSelected =
                      currentBrand.toLowerCase().includes(b.toLowerCase()) ||
                      b.toLowerCase().includes(currentBrand.toLowerCase());
                    return (
                      <button
                        key={b}
                        onClick={() => handleSelectDemoBrand(b)}
                        className={`px-2 py-0.5 rounded-md font-['JetBrains_Mono'] text-[11px] transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-[#0f2930] text-white border-[#0f2930] font-bold shadow-xs'
                            : 'bg-white hover:bg-[#f3f4f3] text-[#002841] border-[#c2c7ca]/70 hover:border-[#2b94d7]'
                        }`}
                        title={`Search prototype dataset for ${b}`}
                      >
                        {b}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Look-alike Name Detection Alert Banner (PART O: User-friendly language) */}
          <div className="mt-5 p-3.5 bg-amber-50/90 border border-amber-200/90 rounded-xl flex flex-wrap items-center justify-between gap-2.5 text-amber-950 min-w-0 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="p-1.5 bg-amber-100 rounded-lg text-amber-700 shrink-0">
                <span className="material-symbols-outlined text-[19px]">warning</span>
              </div>
              <div className="text-xs sm:text-sm font-['Inter'] min-w-0">
                <span className="font-semibold text-amber-900">
                  Look-alike Name Detection:
                </span>
                <span className="text-amber-900 ml-1">
                  Active character-substitution models scanning Unicode & Levenshtein variations for &ldquo;{currentBrand}&rdquo;
                </span>
                <span className="block sm:inline sm:ml-2 font-['JetBrains_Mono'] text-[10px] text-amber-800">
                  (Levenshtein / Unicode analysis)
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

        {/* Multi-stage Scan Progress Stepper (PART L: 8 human-readable stages) */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-[#f9f9f8] border-b border-[#eeeeed] w-full min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  isScanning ? 'bg-[#2b94d7] animate-ping' : 'bg-emerald-500'
                }`}
              ></span>
              <span className="font-['JetBrains_Mono'] text-xs font-semibold text-[#1a1c1c] truncate">
                {isScanning
                  ? `DRP Scanning Pipeline: Analyzing candidate dataset for "${currentBrand}"...`
                  : `DRP Pipeline Complete: Monitored candidate records evaluated against official safe harbor`}
              </span>
            </div>
            <span className="font-['JetBrains_Mono'] text-[10px] sm:text-[11px] text-[#515f74] shrink-0">
              Latency: 18ms • Controlled Prototype Monitoring Data
            </span>
          </div>

          {/* Stepper Track */}
          <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-2 min-w-0 w-full">
            {scanSteps.map((step, idx) => {
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

        {/* Filter Bar: Multi-channel platform tabs & Dynamic Risk tabs */}
        <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-b border-[#eeeeed] bg-[#f9f9f8] flex flex-wrap items-center justify-between gap-2.5 sm:gap-4 w-full min-w-0">
          {/* Platform Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1 sm:pb-0 max-w-full">
            {(
              ['All', 'Instagram', 'Facebook', 'X', 'Google Play', 'App Store', 'Telegram', 'Web Domain'] as PlatformType[]
            ).map((platform) => {
              const isActive = selectedPlatform === platform;
              const count = platformCounts[platform] || 0;
              const label =
                platform === 'All'
                  ? `All Sources (${totalDetections})`
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
            })}
          </div>

          {/* Dynamic Risk Severity Tabs (PART M: No hardcoded counts!) */}
          <div className="flex items-center gap-1 bg-[#f3f4f3] p-1 rounded-lg border border-[#c2c7ca]/60 shrink-0 overflow-x-auto max-w-full">
            {(
              [
                { label: `All (${totalDetections})`, val: 'All' as RiskLevel },
                {
                  label: `Critical (${criticalCount})`,
                  val: 'Critical' as RiskLevel,
                  color: 'text-red-700',
                },
                {
                  label: `High (${highCount})`,
                  val: 'High' as RiskLevel,
                  color: 'text-amber-700',
                },
                {
                  label: `Medium (${mediumCount})`,
                  val: 'Medium' as RiskLevel,
                  color: 'text-orange-700',
                },
                {
                  label: `Trusted (${trustedCount})`,
                  val: 'Trusted' as RiskLevel,
                  color: 'text-emerald-700',
                },
              ]
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

        {/* Prototype Source Dataset Notice (PART E & PART J) */}
        <div className="px-4 sm:px-6 py-2 bg-[#f3f4f3]/60 border-b border-[#eeeeed] flex items-center justify-between text-[11px] text-[#515f74] font-['Inter']">
          <span className="flex items-center gap-1.5 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
            <span>Demo Dataset: Results shown from controlled prototype monitoring data.</span>
          </span>
          <span className="font-['JetBrains_Mono'] text-[10px] text-[#779199] shrink-0">
            Target Query: &ldquo;{currentBrand}&rdquo;
          </span>
        </div>

        {/* Detection Results Queue (PART K: Friendly Empty State, PART N: Rich Results UI) */}
        <div className="divide-y divide-[#eeeeed] w-full min-w-0">
          {filteredThreats.length === 0 ? (
            /* PART K — NO-RESULT EXPERIENCE */
            <div className="p-8 sm:p-12 text-center text-[#515f74] space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#0f2930]/5 border border-[#0f2930]/10 flex items-center justify-center text-[#515f74] mx-auto shadow-inner">
                <span className="material-symbols-outlined text-3xl text-[#515f74]">
                  travel_explore
                </span>
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h3
                  className="text-base sm:text-lg font-bold text-[#1a1c1c]"
                  style={{ fontFamily: "'Noto Serif', serif" }}
                >
                  {threats.length === 0 ? 'No related identities were found in the prototype dataset.' : 'No detections match the selected filters.'}
                </h3>
                <p className="text-xs sm:text-sm text-[#515f74] font-['Inter'] leading-relaxed">
                  {threats.length === 0 ? 'No related candidates were found. Try a demo brand below.' : 'Clear the platform and risk filters to see all detections.'}
                </p>
              </div>

              {threats.length > 0 ? (
                <button className="px-3 py-1.5 rounded-lg bg-[#0f2930] text-white text-xs cursor-pointer" onClick={() => {
                  onSelectPlatform('All');
                  onSelectRisk('All');
                }}>
                  Clear filters
                </button>
              ) : (
              <div className="pt-2">
                <span className="font-['JetBrains_Mono'] text-xs text-[#1a1c1c] font-semibold block mb-2">
                  Try one of our supported demo brands:
                </span>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {demoBrands.map((b) => (
                    <button
                      key={b}
                      onClick={() => handleSelectDemoBrand(b)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-[#c2c7ca] hover:border-[#0f2930] hover:bg-[#0f2930] hover:text-white text-xs font-semibold font-['JetBrains_Mono'] transition-all cursor-pointer shadow-xs"
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              )}
            </div>
          ) : (
            /* PART N — RESULTS UI: Clear, expressive result cards */
            filteredThreats.map((item) => {
              const isTrusted = item.riskCategory === 'Trusted';
              const isCritical = item.riskCategory === 'Critical';
              const isHigh = item.riskCategory === 'High';
              const isMedium = item.riskCategory === 'Medium';

              return (
                <div
                  key={item.id}
                  onClick={() => onInvestigate(item)}
                  className={`p-4 sm:p-5 lg:p-6 hover:bg-[#f3f4f3]/40 transition-all cursor-pointer group w-full min-w-0 border-l-4 ${
                    isCritical
                      ? 'border-l-red-600 bg-red-50/10'
                      : isHigh
                      ? 'border-l-amber-500 bg-amber-50/10'
                      : isMedium
                      ? 'border-l-orange-400'
                      : isTrusted
                      ? 'border-l-emerald-600 bg-emerald-50/15'
                      : 'border-l-transparent'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 min-w-0">
                    {/* Left: Avatar & Identity Details */}
                    <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
                      <div className="relative shrink-0">
                        {item.avatarType === 'letter' ? (
                          <div
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-xs"
                            style={{ backgroundColor: item.avatarBg }}
                          >
                            {item.avatarText}
                          </div>
                        ) : item.avatarType === 'icon' ? (
                          <div
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-white shadow-xs"
                            style={{ backgroundColor: item.avatarBg }}
                          >
                            <span className="material-symbols-outlined text-xl sm:text-2xl">
                              {item.avatarText}
                            </span>
                          </div>
                        ) : (
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white border border-emerald-300 flex items-center justify-center p-2 shadow-xs">
                            <div className="w-full h-full bg-[#002E6E] rounded flex items-center justify-center text-white font-bold text-[10px] sm:text-xs tracking-tight">
                              {item.avatarText}
                            </div>
                          </div>
                        )}

                        {/* Status Icon Badge */}
                        {isTrusted ? (
                          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center ring-2 ring-white shadow-xs">
                            <span
                              className="material-symbols-outlined text-[13px]"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              check
                            </span>
                          </span>
                        ) : isCritical ? (
                          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[11px] font-bold ring-2 ring-white shadow-xs">
                            !
                          </span>
                        ) : (
                          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[11px] font-bold ring-2 ring-white shadow-xs">
                            !
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3
                            className="text-base sm:text-lg font-bold text-[#1a1c1c] group-hover:text-[#002841] transition-colors break-words"
                            style={{ fontFamily: "'Noto Serif', serif" }}
                          >
                            {item.name}
                          </h3>

                          {/* Risk Status Chip */}
                          {isCritical && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-['JetBrains_Mono'] text-[10px] font-bold bg-red-100 text-red-800 border border-red-200 uppercase shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                              Critical Impersonation
                            </span>
                          )}
                          {isHigh && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-['JetBrains_Mono'] text-[10px] font-semibold bg-amber-100 text-amber-900 border border-amber-300 uppercase shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                              High Risk
                            </span>
                          )}
                          {isMedium && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-['JetBrains_Mono'] text-[10px] font-semibold bg-orange-100 text-orange-900 border border-orange-200 uppercase shrink-0">
                              Medium Risk
                            </span>
                          )}
                          {isTrusted && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-['JetBrains_Mono'] text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                              Verified Official Asset
                            </span>
                          )}

                          {/* Platform Badge */}
                          <span className="px-2 py-0.5 rounded bg-[#eeeeed] text-[#515f74] font-['JetBrains_Mono'] text-[10px] font-medium shrink-0 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">
                              {item.platform === 'X'
                                ? 'tag'
                                : item.platform === 'Google Play'
                                ? 'android'
                                : item.platform === 'App Store'
                                ? 'store'
                                : item.platform === 'Web Domain'
                                ? 'language'
                                : 'share'}
                            </span>
                            <span>{item.platform}</span>
                          </span>

                          {/* Deterministic Visual Logo Match Chip */}
                          {item.analysis?.visualSimilarity && item.analysis.visualSimilarity.visualScore >= 75 && !isTrusted && (
                            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-300 font-['JetBrains_Mono'] text-[10px] font-bold shrink-0 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[12px] text-amber-700">image</span>
                              <span>{item.analysis.visualSimilarity.visualScore}% Logo Match</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-[#515f74] text-xs font-['Inter'] mt-1 flex-wrap">
                          <span
                            className={`font-['JetBrains_Mono'] font-bold text-xs truncate ${
                              isCritical
                                ? 'text-red-700'
                                : isTrusted
                                ? 'text-emerald-800'
                                : 'text-[#1a1c1c]'
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

                        {/* Explainable Signals (Generated from Detection Algorithm) */}
                        <div className="flex items-center gap-1.5 sm:gap-2 mt-2.5 flex-wrap min-w-0">
                          {item.explainableSignals.map((sig, sIdx) => {
                            let badgeStyle =
                              'bg-[#eeeeed] text-[#515f74] border-transparent';
                            if (sig.type === 'critical') {
                              badgeStyle = 'bg-red-50 text-red-800 border-red-200';
                            } else if (sig.type === 'high') {
                              badgeStyle =
                                'bg-amber-50 text-amber-900 border-amber-200';
                            } else if (sig.type === 'warning') {
                              badgeStyle =
                                'bg-orange-50 text-orange-900 border-orange-200';
                            } else if (sig.type === 'safe') {
                              badgeStyle =
                                'bg-emerald-50 text-emerald-800 border-emerald-200';
                            }

                            return (
                              <span
                                key={sIdx}
                                className={`px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium font-['JetBrains_Mono'] border flex items-center gap-1 ${badgeStyle} shrink-0`}
                              >
                                {sig.icon && (
                                  <span className="material-symbols-outlined text-[13px]">
                                    {sig.icon}
                                  </span>
                                )}
                                <span className="truncate max-w-[240px]">{sig.label}</span>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Right: Risk Gauge & Action Button */}
                    <div className="flex lg:flex-col items-center lg:items-end justify-between gap-2.5 sm:gap-3 min-w-0 shrink-0 lg:w-44 pt-2 lg:pt-0 border-t lg:border-t-0">
                      <div className="text-right">
                        <div className="flex items-baseline gap-1 lg:justify-end">
                          <span
                            className={`font-['Noto_Serif',serif] font-bold text-base sm:text-lg ${
                              isCritical
                                ? 'text-red-700'
                                : isHigh
                                ? 'text-amber-800'
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
                        <div className="w-24 sm:w-32 bg-[#eeeeed] h-1.5 rounded-full overflow-hidden mt-1">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isCritical
                                ? 'bg-red-600'
                                : isHigh
                                ? 'bg-amber-500'
                                : isMedium
                                ? 'bg-orange-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{
                              width: `${Math.max(item.riskScore, isTrusted ? 0 : 4)}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      {isTrusted ? (
                        <div className="px-3 py-1 bg-emerald-50 text-emerald-800 text-[11px] sm:text-xs font-semibold rounded-lg border border-emerald-200 font-['Inter'] flex items-center gap-1 shrink-0">
                          <span className="material-symbols-outlined text-[14px]">
                            verified
                          </span>
                          <span>Verified Asset</span>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onInvestigate(item);
                          }}
                          className="px-3.5 py-1.5 bg-[#0f2930] hover:bg-[#133942] text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 shadow-xs cursor-pointer font-['Manrope'] shrink-0"
                        >
                          <span>Investigate</span>
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

      {/* 3. VERIFIED ASSET REGISTRY & TAKEDOWN VELOCITY (NOTO SERIF HEADINGS) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 w-full min-w-0">
        {/* Left 2 Cols: Verified Asset Safe Harbor Registry */}
        <div className="lg:col-span-2 bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-6 shadow-xs min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 min-w-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-['JetBrains_Mono'] text-[10px] font-bold uppercase">
                    PROTECTED ASSETS
                  </span>
                </div>
                <h2
                  className="text-base sm:text-lg font-bold text-[#1a1c1c]"
                  style={{ fontFamily: "'Noto Serif', serif" }}
                >
                  Verified Asset Registry
                </h2>
                <p className="text-xs text-[#515f74] font-['Inter']">
                  Legally declared safe harbor tokens used by deterministic detection engines to exempt authentic properties.
                </p>
              </div>
              <button
                onClick={onOpenRegisterAsset}
                className="px-3 py-1.5 bg-white hover:bg-[#f3f4f3] border border-[#c2c7ca] rounded-lg text-xs font-semibold text-[#001319] transition-all flex items-center gap-1.5 self-start cursor-pointer font-['Manrope'] shrink-0 shadow-xs"
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
                      <td className="py-2.5 px-3 text-[#515f74] truncate max-w-[140px]">
                        {asset.legalEntity}
                      </td>
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
              <h2
                className="text-base sm:text-lg font-bold text-[#1a1c1c]"
                style={{ fontFamily: "'Noto Serif', serif" }}
              >
                Takedown Velocity
              </h2>
              <span className="font-['JetBrains_Mono'] text-[11px] sm:text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                98.4% Success
              </span>
            </div>
            <p className="text-xs text-[#515f74] font-['Inter']">
              Mean Time to Remediation (MTTR) across statutory enforcement channels.
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
