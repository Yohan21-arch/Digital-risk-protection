/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  ThreatItem,
  VerifiedAsset,
  TakedownNotice,
  NavTab,
  TopSubTab,
  PlatformType,
  RiskLevel,
} from './types';
import {
  INITIAL_THREATS,
  INITIAL_VERIFIED_ASSETS,
  INITIAL_TAKEDOWNS,
} from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { BrandSearchModule } from './components/BrandSearchModule';
import { DeepInvestigationModal } from './components/DeepInvestigationModal';
import { IssueTakedownModal } from './components/IssueTakedownModal';
import { RegisterAssetModal } from './components/RegisterAssetModal';
import { CharacterMatrixModal } from './components/CharacterMatrixModal';
import { EvidenceDossierModal } from './components/EvidenceDossierModal';
import { Toast, NotificationsModal } from './components/NotificationsModal';
import {
  OverviewView,
  SocialMonitoringView,
  AppMonitoringView,
  DetectionCenterView,
  VerifiedAssetsView,
  BrandProfileView,
  SettingsView,
  ActiveTakedownsView,
  EvidenceLogsView,
  GlobalTelemetryView,
} from './components/OtherViews';

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavTab>('Brand Search');
  const [activeSubTab, setActiveSubTab] = useState<TopSubTab | null>(null);

  // Sidebar responsive state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1180;
    }
    return false;
  });

  // Core Data State
  const [brandQuery, setBrandQuery] = useState('Paytm / One97');
  const [threats, setThreats] = useState<ThreatItem[]>(INITIAL_THREATS);
  const [verifiedAssets, setVerifiedAssets] = useState<VerifiedAsset[]>(INITIAL_VERIFIED_ASSETS);
  const [takedowns, setTakedowns] = useState<TakedownNotice[]>(INITIAL_TAKEDOWNS);

  // Filters State
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>('All');
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel>('All');

  // Scanner Simulation State
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(8);

  // Modals State
  const [investigatingThreat, setInvestigatingThreat] = useState<ThreatItem | null>(null);
  const [isTakedownModalOpen, setIsTakedownModalOpen] = useState(false);
  const [takedownTargetThreat, setTakedownTargetThreat] = useState<ThreatItem | null>(null);
  const [isRegisterAssetOpen, setIsRegisterAssetOpen] = useState(false);
  const [isCharacterMatrixOpen, setIsCharacterMatrixOpen] = useState(false);
  const [isEvidenceDossierOpen, setIsEvidenceDossierOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Auto-collapse sidebar on smaller laptop widths to prevent any overflow
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1100 && !isSidebarCollapsed) {
        setIsSidebarCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarCollapsed]);

  // Keyboard Shortcuts (⌘K / Ctrl+K and Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setInvestigatingThreat(null);
        setIsTakedownModalOpen(false);
        setIsRegisterAssetOpen(false);
        setIsCharacterMatrixOpen(false);
        setIsEvidenceDossierOpen(false);
        setIsNotificationsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scan Simulation Trigger
  const handleTriggerScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanStep(1);
    showToast(`Initiating comprehensive zero-day DRP scan for "${brandQuery}"...`);

    let current = 1;
    const interval = setInterval(() => {
      current++;
      setScanStep(current);
      if (current >= 8) {
        clearInterval(interval);
        setIsScanning(false);
        showToast(`Scan complete: Discovered 4 Critical and 7 High risk impersonators.`);
      }
    }, 350);
  };

  // Brand Query Switcher
  const handleBrandChange = (newBrand: string) => {
    setBrandQuery(newBrand);
  };

  // Dismiss Threat
  const handleDismissThreat = (threatId: string) => {
    setThreats((prev) => prev.filter((t) => t.id !== threatId));
    setInvestigatingThreat(null);
    showToast('Threat alert dismissed. Entity archived to Low Priority inspection queue.');
  };

  // Mark as Trusted
  const handleMarkTrusted = (threatId: string) => {
    const threat = threats.find((t) => t.id === threatId);
    if (threat) {
      setThreats((prev) =>
        prev.map((t) =>
          t.id === threatId
            ? { ...t, riskCategory: 'Trusted', riskScore: 0 }
            : t
        )
      );
      // Also add to verified assets
      setVerifiedAssets((prev) => [
        ...prev,
        {
          id: `ASSET-AUTH-${Date.now().toString().slice(-4)}`,
          name: threat.name,
          type: threat.platform === 'X' ? 'Social X Handle' : 'Verified Endpoint',
          identifier: threat.handleOrPkg,
          legalEntity: 'One97 Communications Verified Exception',
          status: 'ANCHOR ACTIVE',
          registeredDate: new Date().toISOString().split('T')[0],
        },
      ]);
    }
    setInvestigatingThreat(null);
    showToast('Asset marked as Verified. Added to Brand Safe Harbor exceptions list.');
  };

  // Save Dossier
  const handleSaveDossier = (threat: ThreatItem) => {
    showToast(`Evidence Dossier for ${threat.name} SHA-256 sealed and synchronized.`);
  };

  // Confirm Takedown from modal
  const handleConfirmTakedownFromInvestigation = (threat: ThreatItem) => {
    setInvestigatingThreat(null);
    setTakedownTargetThreat(threat);
    setIsTakedownModalOpen(true);
  };

  // Submit Takedown
  const handleSubmitTakedownNotice = (notice: {
    targetName: string;
    targetIdentifier: string;
    provider: string;
    legalBasis: string;
    signature: string;
  }) => {
    const newNotice: TakedownNotice = {
      id: `TKD-2026-${(takedowns.length + 812).toString()}`,
      targetName: notice.targetName,
      targetIdentifier: notice.targetIdentifier,
      entity: notice.provider,
      provider: notice.provider,
      legalClaim: notice.legalBasis,
      issuedAt: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
      status: 'Notice Sent',
      trackingHash: Math.random().toString(16).substring(2, 18),
    };
    setTakedowns((prev) => [newNotice, ...prev]);
    setIsTakedownModalOpen(false);
    showToast(
      `Cease & Desist [${newNotice.id}] issued. Case expedited to ${notice.provider}.`
    );
  };

  // Register Official Asset
  const handleRegisterAsset = (asset: Omit<VerifiedAsset, 'id'>) => {
    const newAsset: VerifiedAsset = {
      ...asset,
      id: `ASSET-USER-${(verifiedAssets.length + 1).toString().padStart(3, '0')}`,
    };
    setVerifiedAssets((prev) => [...prev, newAsset]);
    setIsRegisterAssetOpen(false);
    showToast(`Official asset "${newAsset.name}" successfully registered in safe harbor.`);
  };

  // Handle Tab Switch
  const handleTabChange = (tab: NavTab) => {
    setCurrentTab(tab);
    setActiveSubTab(null);
  };

  const handleSubTabChange = (subTab: TopSubTab) => {
    setActiveSubTab((prev) => (prev === subTab ? null : subTab));
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f9f9f8] text-[#1a1c1c] flex selection:bg-[#d5e3fc] selection:text-[#0d1c2e]">
      {/* 1. PERSISTENT DOCKED SIDE NAVIGATION */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={handleTabChange}
        threatCount={threats.length}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      {/* 2. MAIN VIEWPORT CONTAINER: Sidebar + Flexible Main Content = 100vw */}
      <div
        className={`flex-1 min-w-0 max-w-full min-h-screen flex flex-col bg-[#f9f9f8] transition-all duration-200 ${
          isSidebarCollapsed ? 'ml-16' : 'ml-60 xl:ml-64'
        }`}
      >
        {/* TOP NAVIGATION BAR */}
        <TopNavbar
          currentBrand={brandQuery}
          onBrandChange={handleBrandChange}
          activeSubTab={activeSubTab}
          onSubTabChange={handleSubTabChange}
          activeTakedownsCount={takedowns.length}
          onExportDossier={() => setIsEvidenceDossierOpen(true)}
          onNewScan={handleTriggerScan}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          searchInputRef={searchInputRef}
          onNavigateSettings={() => handleTabChange('Settings')}
          onOpenTakedown={() => {
            setTakedownTargetThreat(threats[0] || null);
            setIsTakedownModalOpen(true);
          }}
        />

        {/* MAIN SCROLLABLE CONTENT CANVAS */}
        <main className="flex-1 p-3.5 sm:p-5 lg:p-7 max-w-[1600px] w-full min-w-0 mx-auto">
          {/* SubTab Views (Top Bar Direct Overrides) */}
          {activeSubTab === 'Active Takedowns' ? (
            <ActiveTakedownsView
              threats={threats}
              verifiedAssets={verifiedAssets}
              takedowns={takedowns}
              brand={brandQuery}
              onInvestigate={(t) => setInvestigatingThreat(t)}
              onOpenTakedown={() => setIsTakedownModalOpen(true)}
              onTriggerToast={showToast}
            />
          ) : activeSubTab === 'Evidence Logs' ? (
            <EvidenceLogsView
              threats={threats}
              verifiedAssets={verifiedAssets}
              takedowns={takedowns}
              brand={brandQuery}
              onInvestigate={(t) => setInvestigatingThreat(t)}
              onOpenTakedown={() => setIsTakedownModalOpen(true)}
              onTriggerToast={showToast}
            />
          ) : activeSubTab === 'Global Telemetry' && currentTab !== 'Brand Search' ? (
            <GlobalTelemetryView
              threats={threats}
              verifiedAssets={verifiedAssets}
              takedowns={takedowns}
              brand={brandQuery}
              onInvestigate={(t) => setInvestigatingThreat(t)}
              onOpenTakedown={() => setIsTakedownModalOpen(true)}
              onTriggerToast={showToast}
            />
          ) : /* Primary Navigation Tab Views */
          currentTab === 'Brand Search' ? (
            <BrandSearchModule
              currentBrand={brandQuery}
              onBrandChange={handleBrandChange}
              threats={threats}
              verifiedAssets={verifiedAssets}
              selectedPlatform={selectedPlatform}
              onSelectPlatform={setSelectedPlatform}
              selectedRisk={selectedRisk}
              onSelectRisk={setSelectedRisk}
              onInvestigate={(item) => setInvestigatingThreat(item)}
              onOpenCharacterMatrix={() => setIsCharacterMatrixOpen(true)}
              onOpenRegisterAsset={() => setIsRegisterAssetOpen(true)}
              onTriggerScan={handleTriggerScan}
              isScanning={isScanning}
              scanStep={scanStep}
            />
          ) : currentTab === 'Overview' ? (
            <OverviewView
              threats={threats}
              verifiedAssets={verifiedAssets}
              takedowns={takedowns}
              brand={brandQuery}
              onInvestigate={(t) => setInvestigatingThreat(t)}
              onOpenTakedown={() => setIsTakedownModalOpen(true)}
              onTriggerToast={showToast}
            />
          ) : currentTab === 'Social Monitoring' ? (
            <SocialMonitoringView
              threats={threats}
              verifiedAssets={verifiedAssets}
              takedowns={takedowns}
              brand={brandQuery}
              onInvestigate={(t) => setInvestigatingThreat(t)}
              onOpenTakedown={() => setIsTakedownModalOpen(true)}
              onTriggerToast={showToast}
            />
          ) : currentTab === 'App Monitoring' ? (
            <AppMonitoringView
              threats={threats}
              verifiedAssets={verifiedAssets}
              takedowns={takedowns}
              brand={brandQuery}
              onInvestigate={(t) => setInvestigatingThreat(t)}
              onOpenTakedown={() => setIsTakedownModalOpen(true)}
              onTriggerToast={showToast}
            />
          ) : currentTab === 'Detection Center' ? (
            <DetectionCenterView
              threats={threats}
              verifiedAssets={verifiedAssets}
              takedowns={takedowns}
              brand={brandQuery}
              onInvestigate={(t) => setInvestigatingThreat(t)}
              onOpenTakedown={() => setIsTakedownModalOpen(true)}
              onTriggerToast={showToast}
            />
          ) : currentTab === 'Verified Assets' ? (
            <VerifiedAssetsView
              threats={threats}
              verifiedAssets={verifiedAssets}
              takedowns={takedowns}
              brand={brandQuery}
              onInvestigate={(t) => setInvestigatingThreat(t)}
              onOpenTakedown={() => setIsTakedownModalOpen(true)}
              onTriggerToast={showToast}
            />
          ) : currentTab === 'Brand Profile' ? (
            <BrandProfileView
              threats={threats}
              verifiedAssets={verifiedAssets}
              takedowns={takedowns}
              brand={brandQuery}
              onInvestigate={(t) => setInvestigatingThreat(t)}
              onOpenTakedown={() => setIsTakedownModalOpen(true)}
              onTriggerToast={showToast}
            />
          ) : currentTab === 'Settings' ? (
            <SettingsView
              threats={threats}
              verifiedAssets={verifiedAssets}
              takedowns={takedowns}
              brand={brandQuery}
              onInvestigate={(t) => setInvestigatingThreat(t)}
              onOpenTakedown={() => setIsTakedownModalOpen(true)}
              onTriggerToast={showToast}
            />
          ) : null}
        </main>
      </div>

      {/* 3. MODALS & INTERACTIVE DRAWERS */}
      {/* Forensic Threat Deep Investigation */}
      {investigatingThreat && (
        <DeepInvestigationModal
          threat={investigatingThreat}
          onClose={() => setInvestigatingThreat(null)}
          onDismiss={handleDismissThreat}
          onMarkTrusted={handleMarkTrusted}
          onSaveDossier={handleSaveDossier}
          onConfirmTakedown={handleConfirmTakedownFromInvestigation}
        />
      )}

      {/* Issue Takedown Modal */}
      {isTakedownModalOpen && (
        <IssueTakedownModal
          threat={takedownTargetThreat}
          onClose={() => setIsTakedownModalOpen(false)}
          onSubmitTakedown={handleSubmitTakedownNotice}
        />
      )}

      {/* Register Official Asset Modal */}
      {isRegisterAssetOpen && (
        <RegisterAssetModal
          onClose={() => setIsRegisterAssetOpen(false)}
          onRegister={handleRegisterAsset}
        />
      )}

      {/* Character Matrix Modal */}
      {isCharacterMatrixOpen && (
        <CharacterMatrixModal
          brand={brandQuery}
          onClose={() => setIsCharacterMatrixOpen(false)}
        />
      )}

      {/* Evidence Dossier Modal */}
      {isEvidenceDossierOpen && (
        <EvidenceDossierModal
          threats={threats}
          brand={brandQuery}
          onClose={() => setIsEvidenceDossierOpen(false)}
        />
      )}

      {/* Notifications Modal */}
      {isNotificationsOpen && (
        <NotificationsModal onClose={() => setIsNotificationsOpen(false)} />
      )}

      {/* Toast Notification Container */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
