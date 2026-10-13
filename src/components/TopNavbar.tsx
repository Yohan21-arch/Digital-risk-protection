import React, { useState, useRef, useEffect } from 'react';
import { TopSubTab } from '../types';

interface TopNavbarProps {
  currentBrand: string;
  onBrandChange: (brand: string) => void;
  activeSubTab: TopSubTab | null;
  onSubTabChange: (tab: TopSubTab) => void;
  activeTakedownsCount: number;
  onNewScan: () => void;
  onOpenNotifications: () => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  onNavigateSettings?: () => void;
  onOpenTakedown?: () => void;
  onExportDossier?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentBrand,
  onBrandChange,
  activeSubTab,
  onSubTabChange,
  activeTakedownsCount,
  onNewScan,
  onOpenNotifications,
  searchInputRef,
  onNavigateSettings,
  onOpenTakedown,
}) => {
  const [isOperationsOpen, setIsOperationsOpen] = useState(false);
  const [isSourcesOpen, setIsSourcesOpen] = useState(false);

  const operationsRef = useRef<HTMLDivElement>(null);
  const sourcesRef = useRef<HTMLDivElement>(null);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (operationsRef.current && !operationsRef.current.contains(e.target as Node)) {
        setIsOperationsOpen(false);
      }
      if (sourcesRef.current && !sourcesRef.current.contains(e.target as Node)) {
        setIsSourcesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const subTabs: { label: TopSubTab; badge?: number }[] = [
    { label: 'Global Telemetry' },
    { label: 'Active Takedowns', badge: activeTakedownsCount },
    { label: 'Evidence Logs' },
  ];

  return (
    <header className="sticky top-0 z-20 bg-[#f9f9f8] border-b border-[#e8e8e7] px-3 sm:px-5 lg:px-6 min-h-14 h-auto lg:h-15 py-2 lg:py-0 flex flex-wrap lg:flex-nowrap justify-between items-center select-none shadow-xs w-full max-w-full min-w-0 gap-2 sm:gap-3">
      {/* 1. LEFT: Product Wordmark (Relocated from Sidebar) + Divider + Brand Selector */}
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-3.5 min-w-0 shrink w-full lg:w-auto">
        {/* Product Icon + Wordmark */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 select-none">
          <div
            className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl bg-[#0f2930] border border-[#2b94d7]/40 flex items-center justify-center text-[#cce7f0] shadow-xs shrink-0"
            title="SentinalBrand Digital Risk Protection"
          >
            <span
              className="material-symbols-outlined text-[#2b94d7] text-xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              shield_with_heart
            </span>
          </div>

          {/* Typography: Slabo 13px (exact Google Font) */}
          <span
            className="hidden md:inline text-[#001319] leading-none whitespace-nowrap select-none"
            style={{
              fontFamily: "'Slabo 13px', serif",
              fontSize: '24px',
              fontWeight: 400,
              letterSpacing: '0.2px',
            }}
          >
            SentinalBrand
          </span>
          <span
            className="hidden sm:inline md:hidden text-[#001319] leading-none whitespace-nowrap select-none"
            style={{
              fontFamily: "'Slabo 13px', serif",
              fontSize: '20px',
              fontWeight: 400,
              letterSpacing: '0.2px',
            }}
          >
            SentinalBrand
          </span>
          <span
            className="sm:hidden text-[#001319] leading-none font-bold whitespace-nowrap select-none"
            style={{
              fontFamily: "'Slabo 13px', serif",
              fontSize: '18px',
              letterSpacing: '0.2px',
            }}
          >
            SB
          </span>
        </div>

        {/* Subtle Vertical Divider */}
        <div className="h-6 w-px bg-[#c2c7ca]/60 shrink-0"></div>

        {/* Brand Selector Input */}
        <div className="flex items-center gap-1.5 bg-white border border-[#c2c7ca]/70 rounded-lg px-2 sm:px-2.5 py-1.5 text-[#1a1c1c] focus-within:border-[#2b94d7] focus-within:ring-1 focus-within:ring-[#2b94d7]/20 transition-all shadow-xs min-w-0">
          <span className="material-symbols-outlined text-[#515f74] text-[16px] sm:text-[17px] shrink-0">
            travel_explore
          </span>
          <input
            ref={searchInputRef}
            type="text"
            value={currentBrand}
            onChange={(e) => onBrandChange(e.target.value)}
            placeholder="Filter brand..."
            className="bg-transparent border-0 text-xs sm:text-sm font-['Inter'] focus:outline-none p-0 text-[#1a1c1c] w-20 sm:w-28 md:w-36 lg:w-40 placeholder:text-[#72787a] min-w-0"
          />
          <kbd className="hidden sm:inline font-['JetBrains_Mono'] text-[9px] text-[#72787a] bg-[#f3f4f3] px-1 py-0.5 rounded border border-[#c2c7ca]/50 font-semibold shrink-0">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* 2. CENTER: Contextual Navigation (Inline on 2xl desktop, Operations ▾ on laptops) */}
      <div className="flex items-center min-w-0 shrink-0">
        {/* Desktop inline tabs (2xl and above) */}
        <nav className="hidden 2xl:flex items-center gap-4 lg:gap-6 font-['Inter'] shrink-0">
          {subTabs.map((tab) => {
            const isActive = activeSubTab === tab.label;
            return (
              <button
                key={tab.label}
                onClick={() => onSubTabChange(tab.label)}
                className={`py-1 text-xs lg:text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border-b-2 ${
                  isActive
                    ? 'text-[#001319] border-[#001319]'
                    : 'text-[#515f74] border-transparent hover:text-[#001319]'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className="px-1.5 py-0.2 bg-[#ffdad6] text-[#93000a] font-['JetBrains_Mono'] rounded text-[10px] font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Compact laptop / tablet dropdown (< 2xl) */}
        <div className="2xl:hidden relative" ref={operationsRef}>
          <button
            onClick={() => setIsOperationsOpen(!isOperationsOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#c2c7ca]/70 bg-white hover:bg-[#f3f4f3] text-xs font-semibold text-[#1a1c1c] transition-colors cursor-pointer shadow-xs"
          >
            <span className="truncate max-w-[120px] sm:max-w-none">
              {activeSubTab || 'Operations'}
            </span>
            <span className="material-symbols-outlined text-[16px] text-[#515f74]">
              {isOperationsOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
            </span>
          </button>

          {isOperationsOpen && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 w-52 bg-white border border-[#c2c7ca] rounded-xl shadow-xl py-1.5 z-40 text-xs font-['Inter'] animate-fadeIn">
              {subTabs.map((tab) => {
                const isActive = activeSubTab === tab.label;
                return (
                  <button
                    key={tab.label}
                    onClick={() => {
                      onSubTabChange(tab.label);
                      setIsOperationsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-left hover:bg-[#f3f4f3] transition-colors cursor-pointer ${
                      isActive ? 'font-bold text-[#002841] bg-[#f3f4f3]/60' : 'text-[#515f74]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.badge !== undefined ? (
                      <span className="px-1.5 py-0.2 bg-[#ffdad6] text-[#93000a] font-['JetBrains_Mono'] rounded text-[10px] font-bold">
                        {tab.badge}
                      </span>
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    )}
                  </button>
                );
              })}
              {onOpenTakedown && (
                <div className="pt-1 mt-1 border-t border-[#eeeeed]">
                  <button
                    onClick={() => {
                      setIsOperationsOpen(false);
                      onOpenTakedown();
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-left text-red-600 hover:bg-red-50 font-semibold cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">gavel</span>
                    <span>Issue Takedown</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. RIGHT: Essential Actions (Sources ▾, New Scan, Notifications, Profile) */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Compact Combined Source Status with System Health link */}
        <div className="relative" ref={sourcesRef}>
          <button
            onClick={() => setIsSourcesOpen(!isSourcesOpen)}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-full border border-[#c2c7ca]/70 bg-white hover:bg-[#f3f4f3] text-xs font-semibold text-[#1a1c1c] transition-colors cursor-pointer shadow-xs"
            title="Click to view Source Connection Telemetry and System Health"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span className="hidden sm:inline font-['JetBrains_Mono'] text-[11px] text-[#515f74]">Sources · Demo</span>
            <span className="sm:hidden font-['JetBrains_Mono'] text-[11px] text-[#515f74]">Demo</span>
            <span className="material-symbols-outlined text-[15px] text-[#515f74]">
              {isSourcesOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
            </span>
          </button>

          {isSourcesOpen && (
            <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-1.5 w-64 bg-white border border-[#c2c7ca] rounded-xl shadow-xl p-3 z-40 text-xs font-['Inter'] animate-fadeIn">
              <div className="font-['Manrope'] font-bold text-xs text-[#1a1c1c] pb-2 border-b border-[#eeeeed] flex items-center justify-between">
                <span>Network Sources</span>
                <span className="text-[10px] text-emerald-700 font-semibold font-['JetBrains_Mono']">Prototype</span>
              </div>

              <div className="divide-y divide-[#eeeeed] py-1 text-[11px]">
                <div className="flex items-center justify-between py-2">
                  <span className="text-[#515f74] font-medium">Instagram</span>
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold font-['JetBrains_Mono']">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Demo Connector
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-[#515f74] font-medium">Google Play</span>
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold font-['JetBrains_Mono']">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Prototype Dataset
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-[#515f74] font-medium">X</span>
                  <span className="flex items-center gap-1 text-amber-700 font-semibold font-['JetBrains_Mono']">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Simulated
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-[#515f74] font-medium">App Store</span>
                  <span className="flex items-center gap-1 text-[#72787a] font-['JetBrains_Mono']">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#72787a]"></span> Demo Connector
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#eeeeed] flex items-center justify-between text-[10px]">
                <span className="text-[#72787a]">System Health</span>
                <button
                  onClick={() => {
                    setIsSourcesOpen(false);
                    onNavigateSettings?.();
                  }}
                  className="text-[#2b94d7] hover:underline font-semibold cursor-pointer"
                >
                  View Health Diagnostics →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Primary Action: New Scan */}
        <button
          onClick={onNewScan}
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#0f2930] hover:bg-[#133942] text-white rounded-lg text-xs font-semibold font-['Manrope'] transition-all shadow-xs cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[15px] text-[#2b94d7]">
            radar
          </span>
          <span className="hidden sm:inline">New Scan</span>
          <span className="sm:hidden">Scan</span>
        </button>

        {/* Notifications Icon */}
        <button
          onClick={onOpenNotifications}
          className="p-1.5 hover:bg-[#f3f4f3] rounded-lg transition-colors text-[#1a1c1c] relative cursor-pointer shrink-0"
          title="Notifications"
          aria-label="Notifications"
        >
          <span className="material-symbols-outlined text-[19px]">notifications</span>
          <span className="w-2 h-2 rounded-full bg-[#ba1a1a] absolute top-1.5 right-1.5 ring-2 ring-white"></span>
        </button>

        {/* Profile Badge */}
        <div className="flex items-center pl-1 border-l border-[#c2c7ca]/60 shrink-0">
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#d5e3fc] border border-[#b9c7df] flex items-center justify-center font-['JetBrains_Mono'] text-xs font-bold text-[#57657a]"
            title="Security Operations Lead (S.O.)"
          >
            SO
          </div>
        </div>
      </div>
    </header>
  );
};
