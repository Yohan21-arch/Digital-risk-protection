import React from 'react';
import { NavTab } from '../types';

interface SidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  threatCount: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  threatCount,
  isCollapsed,
  onToggleCollapse,
}) => {
  const navItems: { label: NavTab; icon: string; count?: number }[] = [
    { label: 'Overview', icon: 'dashboard' },
    { label: 'Brand Search', icon: 'travel_explore' },
    { label: 'Monitoring', icon: 'monitoring' },
    { label: 'Detection Center', icon: 'radar', count: threatCount },
    { label: 'Verified Assets', icon: 'verified_user' },
    { label: 'Brand Profile', icon: 'corporate_fare' },
    { label: 'Settings', icon: 'settings' },
  ];

  return (
    <aside
      className={`h-screen flex flex-col fixed left-0 top-0 z-30 bg-[#0f2930] border-r border-[#72787a]/30 select-none transition-all duration-200 ${
        isCollapsed ? 'w-16' : 'w-60 xl:w-64'
      }`}
    >
      <div className="h-full flex flex-col justify-between p-3 lg:p-3.5 overflow-y-auto custom-scrollbar">
        {/* Simplified Header: Shield Icon and Menu Toggle */}
        <div className="flex flex-col gap-4">
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-2.5 pt-1">
              <div
                className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#cce7f0] shadow-inner shrink-0"
                title="SentinalBrand"
              >
                <span
                  className="material-symbols-outlined text-[#cce7f0] text-xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  shield_with_heart
                </span>
              </div>
              <button
                onClick={onToggleCollapse}
                className="text-[#779199] hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer shrink-0"
                title="Expand Sidebar"
                aria-label="Expand Sidebar"
              >
                <span className="material-symbols-outlined text-[18px]">
                  menu_open
                </span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between px-1 pt-1">
              <div
                className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#cce7f0] shadow-inner shrink-0"
                title="SentinalBrand"
              >
                <span
                  className="material-symbols-outlined text-[#cce7f0] text-xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  shield_with_heart
                </span>
              </div>
              <button
                onClick={onToggleCollapse}
                className="text-[#779199] hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer shrink-0"
                title="Collapse Sidebar"
                aria-label="Collapse Sidebar"
              >
                <span className="material-symbols-outlined text-[19px]">
                  menu
                </span>
              </button>
            </div>
          )}

          {/* 7 Primary Navigation Tabs */}
          <nav className="flex flex-col gap-1.5 mt-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => onTabChange(item.label)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left cursor-pointer min-w-0 ${
                    isActive
                      ? 'bg-white/10 text-[#cce7f0] font-semibold border-l-2 border-[#2b94d7]'
                      : 'text-[#779199] hover:text-white hover:bg-white/5 font-medium'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`}
                  title={item.label}
                >
                  <span
                    className={`material-symbols-outlined text-[20px] shrink-0 ${
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

        {/* Minimal Bottom Organization Indicator (Relocated KYC/Org link) */}
        <div className="pt-3 border-t border-white/10 mt-auto">
          <button
            onClick={() => onTabChange('Brand Profile')}
            className={`w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer min-w-0 ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title="Acme Corp • KYC Tier-3 Verified (Click to view Brand Profile)"
          >
            <div className="w-8 h-8 rounded-lg bg-[#002841] border border-white/20 flex items-center justify-center font-['JetBrains_Mono'] text-xs font-bold text-[#cce5ff] shrink-0">
              AC
            </div>
            {!isCollapsed && (
              <div className="flex flex-col text-left min-w-0 flex-1">
                <span className="font-['Manrope'] text-xs font-semibold text-white truncate flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                  Acme Corp
                </span>
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#779199] truncate">
                  Verified • Tier-3
                </span>
              </div>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};
