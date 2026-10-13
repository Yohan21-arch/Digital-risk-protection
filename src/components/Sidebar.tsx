import React from 'react';
import { NavTab } from '../types';

interface SidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenTakedown: () => void;
  threatCount: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  onOpenTakedown,
  threatCount,
  isCollapsed,
  onToggleCollapse,
}) => {
  const navItems: { label: NavTab; icon: string; count?: number }[] = [
    { label: 'Overview', icon: 'dashboard' },
    { label: 'Brand Search', icon: 'travel_explore' },
    { label: 'Social Monitoring', icon: 'share' },
    { label: 'App Monitoring', icon: 'apps' },
    { label: 'Detection Center', icon: 'radar', count: threatCount },
    { label: 'Verified Assets', icon: 'verified_user' },
    { label: 'Brand Profile', icon: 'corporate_fare' },
    { label: 'Settings', icon: 'settings' },
  ];

  return (
    <aside
      className={`h-screen flex flex-col fixed left-0 top-0 z-30 bg-[#0f2930] border-r border-[#72787a]/30 select-none transition-all duration-200 ${
        isCollapsed ? 'w-16' : 'w-56 lg:w-60 xl:w-64'
      }`}
    >
      <div className="h-full flex flex-col justify-between p-3 lg:p-4 overflow-y-auto custom-scrollbar">
        {/* Brand Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1 pt-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#cce7f0] shadow-inner shrink-0">
                <span
                  className="material-symbols-outlined text-[#cce7f0] text-xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  shield_with_heart
                </span>
              </div>
              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="font-['Manrope'] text-base lg:text-[18px] font-bold tracking-tight text-white truncate">
                    SentinelBrand
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[9px] lg:text-[10px] text-[#779199] tracking-wider uppercase truncate">
                    Executive Defense
                  </span>
                </div>
              )}
            </div>

            {/* Collapse toggle button */}
            <button
              onClick={onToggleCollapse}
              className="text-[#779199] hover:text-white p-1 rounded hover:bg-white/5 transition-colors cursor-pointer shrink-0"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isCollapsed ? 'menu_open' : 'menu'}
              </span>
            </button>
          </div>

          {/* Primary CTA: Issue Takedown */}
          <div>
            <button
              onClick={onOpenTakedown}
              className={`w-full flex items-center justify-center gap-2 py-2 px-2.5 bg-[#002841] hover:bg-[#001d31] text-white font-['Manrope'] text-xs lg:text-sm font-semibold rounded-lg border border-[#2b94d7]/40 transition-all duration-150 ease-in-out shadow-xs hover:border-[#2b94d7] cursor-pointer ${
                isCollapsed ? 'px-0' : ''
              }`}
              title="Issue Takedown"
            >
              <span className="material-symbols-outlined text-[#2b94d7] text-[18px] shrink-0">
                gavel
              </span>
              {!isCollapsed && <span className="truncate">Issue Takedown</span>}
            </button>
          </div>

          {/* 8 Navigation Tabs */}
          <nav className="flex flex-col gap-0.5 mt-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => onTabChange(item.label)}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs lg:text-sm transition-all text-left cursor-pointer min-w-0 ${
                    isActive
                      ? 'bg-white/10 text-[#cce7f0] font-semibold border-l-2 border-[#2b94d7]'
                      : 'text-[#779199] hover:text-white hover:bg-white/5 font-medium'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`}
                  title={item.label}
                >
                  <span
                    className={`material-symbols-outlined text-[19px] shrink-0 ${
                      isActive ? 'text-[#2b94d7]' : 'text-[#779199]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <>
                      <span className="font-['Inter'] flex-1 truncate">{item.label}</span>
                      {item.count !== undefined && (
                        <span className="px-1.5 py-0.2 rounded bg-red-950/70 border border-red-500/30 text-red-200 font-['JetBrains_Mono'] text-[10px] font-bold shrink-0">
                          {item.count}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer & Org Status Area */}
        <div className="flex flex-col gap-2 pt-2 border-t border-white/10 mt-auto">
          {!isCollapsed ? (
            <>
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => onTabChange('Settings')}
                  className="flex items-center gap-2 px-2 py-1 rounded text-[#779199] hover:text-white text-xs font-['Inter'] transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[16px] shrink-0">dns</span>
                  <span className="truncate">System Health</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-auto shrink-0" title="Operational"></span>
                </button>
                <button
                  onClick={() => onTabChange('Detection Center')}
                  className="flex items-center gap-2 px-2 py-1 rounded text-[#779199] hover:text-white text-xs font-['Inter'] transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[16px] shrink-0">gavel</span>
                  <span className="truncate">Compliance Logs</span>
                </button>
              </div>

              {/* Org KYC Status Card */}
              <div className="p-2.5 bg-[#002841]/80 rounded-xl border border-white/10">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-['Manrope'] text-xs font-semibold text-white flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                    Acme Corp
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[9px] text-[#cce5ff] font-semibold shrink-0">
                    85%
                  </span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#2b94d7] h-full rounded-full transition-all duration-500"
                    style={{ width: '85%' }}
                  ></div>
                </div>
                <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-white/10 text-[9px]">
                  <span className="font-['JetBrains_Mono'] text-[#779199] truncate">
                    Legal #4892
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[#d5e3fc] shrink-0">
                    KYC Tier-3
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 py-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" title="System Health: Operational"></span>
              <span className="font-['JetBrains_Mono'] text-[9px] text-[#779199]" title="KYC Tier-3">T3</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
