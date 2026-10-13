import React from 'react';
import { TopSubTab } from '../types';

interface TopNavbarProps {
  currentBrand: string;
  onBrandChange: (brand: string) => void;
  activeSubTab: TopSubTab;
  onSubTabChange: (tab: TopSubTab) => void;
  activeTakedownsCount: number;
  onExportDossier: () => void;
  onNewScan: () => void;
  onOpenNotifications: () => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentBrand,
  onBrandChange,
  activeSubTab,
  onSubTabChange,
  activeTakedownsCount,
  onExportDossier,
  onNewScan,
  onOpenNotifications,
  searchInputRef,
}) => {
  return (
    <header className="sticky top-0 z-20 bg-[#f9f9f8] border-b border-[#e8e8e7] px-3 sm:px-5 lg:px-6 xl:px-8 h-14 lg:h-16 flex justify-between items-center select-none shadow-xs w-full max-w-full min-w-0">
      {/* Left: Brand Filter & Top Navigation Links */}
      <div className="flex items-center gap-2 sm:gap-4 lg:gap-5 min-w-0 shrink">
        <div className="flex items-center gap-1.5 bg-white border border-[#c2c7ca]/70 rounded-lg px-2.5 py-1.5 text-[#1a1c1c] focus-within:border-[#2b94d7] focus-within:ring-1 focus-within:ring-[#2b94d7]/20 transition-all shadow-xs min-w-0">
          <span className="material-symbols-outlined text-[#515f74] text-[17px] shrink-0">
            travel_explore
          </span>
          <input
            ref={searchInputRef}
            type="text"
            value={currentBrand}
            onChange={(e) => onBrandChange(e.target.value)}
            placeholder="Filter targets..."
            className="bg-transparent border-0 text-xs sm:text-sm font-['Inter'] focus:outline-none p-0 text-[#1a1c1c] w-28 sm:w-36 md:w-44 placeholder:text-[#72787a] min-w-0"
          />
          <kbd className="hidden sm:inline font-['JetBrains_Mono'] text-[9px] text-[#72787a] bg-[#f3f4f3] px-1 py-0.5 rounded border border-[#c2c7ca]/50 font-semibold shrink-0">
            ⌘K
          </kbd>
        </div>

        {/* Sub Navigation Links */}
        <nav className="hidden 2xl:flex items-center gap-4 font-['Inter'] shrink-0">
          <button
            onClick={() => onSubTabChange('Global Telemetry')}
            className={`pb-1 text-xs lg:text-sm font-semibold transition-colors cursor-pointer ${
              activeSubTab === 'Global Telemetry'
                ? 'text-[#001319] border-b-2 border-[#001319]'
                : 'text-[#515f74] hover:text-[#001319]'
            }`}
          >
            Global Telemetry
          </button>
          <button
            onClick={() => onSubTabChange('Active Takedowns')}
            className={`pb-1 text-xs lg:text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'Active Takedowns'
                ? 'text-[#001319] border-b-2 border-[#001319]'
                : 'text-[#515f74] hover:text-[#001319]'
            }`}
          >
            <span>Active Takedowns</span>
            <span className="px-1.5 py-0.2 bg-[#ffdad6] text-[#93000a] font-['JetBrains_Mono'] rounded text-[10px] font-bold">
              {activeTakedownsCount}
            </span>
          </button>
          <button
            onClick={() => onSubTabChange('Evidence Logs')}
            className={`pb-1 text-xs lg:text-sm font-semibold transition-colors cursor-pointer ${
              activeSubTab === 'Evidence Logs'
                ? 'text-[#001319] border-b-2 border-[#001319]'
                : 'text-[#515f74] hover:text-[#001319]'
            }`}
          >
            Evidence Logs
          </button>
        </nav>
      </div>

      {/* Center: Live Telemetry Feeds (Adapts from compact dots to full labels) */}
      <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 bg-white border border-[#c2c7ca]/50 rounded-full text-xs shadow-xs shrink-0">
        <div className="flex items-center gap-1 font-['JetBrains_Mono'] text-[10px] text-[#1a1c1c] px-1.5 py-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span className="font-semibold text-[#515f74]">IG:</span> Connected
        </div>
        <span className="text-[#c2c7ca]">|</span>
        <div className="flex items-center gap-1 font-['JetBrains_Mono'] text-[10px] text-[#1a1c1c] px-1.5 py-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span className="font-semibold text-[#515f74]">Play:</span> Connected
        </div>
        <span className="text-[#c2c7ca]">|</span>
        <div className="flex items-center gap-1 font-['JetBrains_Mono'] text-[10px] text-amber-800 bg-amber-50 rounded px-1.5 py-0.5 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          <span className="font-semibold">X:</span> Limited
        </div>
        <span className="text-[#c2c7ca] hidden 2xl:inline">|</span>
        <div
          className="hidden 2xl:flex items-center gap-1 font-['JetBrains_Mono'] text-[10px] text-[#72787a] px-1 py-0.5 cursor-help"
          title="Scheduled maintainer sync at 04:00 UTC"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#72787a]"></span>
          <span>App Store: Off</span>
        </div>
      </div>

      {/* Right: Actions & Officer Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Tool Icons */}
        <div className="flex items-center text-[#515f74]">
          <button
            onClick={() => onSubTabChange('Global Telemetry')}
            className="p-1.5 hover:bg-[#f3f4f3] rounded-lg transition-colors text-[#1a1c1c] cursor-pointer"
            title="Telemetry Hub"
          >
            <span className="material-symbols-outlined text-[18px]">hub</span>
          </button>
          <button
            onClick={onOpenNotifications}
            className="p-1.5 hover:bg-[#f3f4f3] rounded-lg transition-colors text-[#1a1c1c] relative cursor-pointer"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[18px]">notifications</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] absolute top-1.5 right-1.5 ring-2 ring-white"></span>
          </button>
          <button
            onClick={() => onSubTabChange('Global Telemetry')}
            className="p-1.5 hover:bg-[#f3f4f3] rounded-lg transition-colors text-[#1a1c1c] cursor-pointer"
            title="Enterprise Shield Health"
          >
            <span
              className="material-symbols-outlined text-[#2b94d7] text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              shield_with_heart
            </span>
          </button>
        </div>

        {/* Secondary Action: Export Dossier */}
        <button
          onClick={onExportDossier}
          className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-[#f3f4f3] border border-[#c2c7ca] rounded-lg text-[#001319] text-xs font-semibold font-['Inter'] transition-all shadow-xs cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[15px]">file_download</span>
          <span>Export Dossier</span>
        </button>

        {/* Primary Action: New Scan */}
        <button
          onClick={onNewScan}
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#0f2930] hover:bg-[#133942] text-white rounded-lg text-xs font-semibold font-['Manrope'] transition-all shadow-xs cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[15px] text-[#2b94d7]">
            radar
          </span>
          <span>New Scan</span>
        </button>

        {/* Profile Badge */}
        <div className="flex items-center pl-1 sm:pl-2 border-l border-[#c2c7ca]/60 shrink-0">
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
