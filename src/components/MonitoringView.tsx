import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { MonitoringChannel, PlatformType, RiskLevel, ThreatItem } from '../types';
import { APP_PLATFORMS, SOCIAL_PLATFORMS, isApp, monitoringMetrics, monitoringResults } from '../lib/monitoring';
import { AnimatedNumber, MotionResult } from './MotionUI';
import { AppMonitoringCard, SocialMonitoringCard } from './MonitoringCards';
import { BRAND_METADATA } from '../data/brandMetadata';
import { toAlphaNumeric } from '../lib/detectionEngine';

interface Props {
  threats: ThreatItem[];
  brand: string;
  channel?: MonitoringChannel;
  initialChannel?: MonitoringChannel;
  onChannelChange?: (channel: MonitoringChannel) => void;
  onInvestigate: (threat: ThreatItem) => void;
  onOpenTakedown: (threat?: ThreatItem) => void;
}
const channels: MonitoringChannel[] = ['All', 'Social Accounts', 'Mobile Apps'];
export function MonitoringView({ threats, brand, channel: controlledChannel, initialChannel = 'All', onChannelChange, onInvestigate, onOpenTakedown }: Props) {
  const [localChannel, setLocalChannel] = useState<MonitoringChannel>(initialChannel);
  const channel = controlledChannel ?? localChannel;
  const [platform, setPlatform] = useState<PlatformType>('All');
  const [risk, setRisk] = useState<RiskLevel>('All');
  const [search, setSearch] = useState('');
  const platforms = channel === 'Social Accounts' ? SOCIAL_PLATFORMS : channel === 'Mobile Apps' ? APP_PLATFORMS : [...SOCIAL_PLATFORMS, ...APP_PLATFORMS];
  const effectivePlatform = platform === 'All' || platforms.some(p => p === platform) ? platform : 'All';
  const results = monitoringResults(threats, channel, effectivePlatform, risk, search);
  const metadata = BRAND_METADATA[toAlphaNumeric(brand)];
  const selectChannel = (next: MonitoringChannel) => { setPlatform('All'); setLocalChannel(next); onChannelChange?.(next); };
  const reset = () => { setPlatform('All'); setRisk('All'); setSearch(''); };
  return <div className="space-y-4 sm:space-y-6 min-w-0">
    <header className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 sm:p-6 shadow-xs">
      <h1 className="font-['Noto_Serif',serif] text-xl sm:text-2xl font-bold">Monitoring</h1>
      <p className="text-xs text-[#515f74] mt-1">Social accounts and mobile apps for {brand}, ordered by severity and deterministic risk score.</p>
      <div role="tablist" aria-label="Monitoring channels" className="mt-4 inline-flex max-w-full flex-wrap gap-1 rounded-lg bg-[#eeeeed] p-1">
        {channels.map((item, index) => <button key={item} id={`monitoring-tab-${index}`} role="tab" aria-selected={channel === item}
          aria-controls="monitoring-panel" tabIndex={channel === item ? 0 : -1}
          onClick={() => selectChannel(item)} onKeyDown={event => {
            let next = index;
            if (event.key === 'ArrowRight') next = (index + 1) % channels.length;
            else if (event.key === 'ArrowLeft') next = (index + channels.length - 1) % channels.length;
            else if (event.key === 'Home') next = 0;
            else if (event.key === 'End') next = channels.length - 1;
            else return;
            event.preventDefault(); selectChannel(channels[next]);
            document.getElementById(`monitoring-tab-${next}`)?.focus();
          }} className={`rounded-md px-3 sm:px-4 py-2 text-xs font-semibold ${channel === item ? 'bg-[#0f2930] text-white shadow-xs' : 'text-[#515f74] hover:bg-white'}`}>{item}</button>)}
      </div>
    </header>
    <section id="monitoring-panel" role="tabpanel" aria-labelledby={`monitoring-tab-${channels.indexOf(channel)}`} className="space-y-4 min-w-0">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {Object.entries(monitoringMetrics(results)).map(([label, value]) => <div key={label} className="bg-white border border-[#c2c7ca]/60 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] text-[#515f74] font-semibold">{label}</span>
          <div className="text-2xl font-bold mt-1"><AnimatedNumber value={value} /></div>
        </div>)}
      </div>
      {channel === 'Social Accounts' && <p className="text-xs text-[#515f74]">Cloned Brand Logos: {results.filter(t => (t.analysis?.visualSimilarity?.visualScore ?? 0) >= 75).length} · Bio Redirect Tunnels: {results.filter(t => t.details?.redirectTunnel).length}</p>}
      {channel === 'Mobile Apps' && <div className="bg-[#f0f7fa] border border-[#c2c7ca]/70 rounded-xl p-4 text-xs text-[#515f74] break-words">
        <strong>Official Authorized Developer Baseline for {brand}:</strong> Publishers: {(metadata?.officialPublishers || []).join(', ') || 'Not available'} · Namespace: {(metadata?.officialPackages || []).join(' / ') || 'Not available'}
      </div>}
      <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-4 flex flex-wrap gap-3">
        <label className="text-xs text-[#515f74] flex-1 min-w-0">Search
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Name, handle, package, publisher or bio" className="block w-full min-w-0 mt-1 rounded-lg border border-[#c2c7ca] p-2 bg-[#f9f9f8]" />
        </label>
        <label className="text-xs text-[#515f74]">Platform
          <select value={effectivePlatform} onChange={e => setPlatform(e.target.value as PlatformType)} className="block mt-1 rounded-lg border border-[#c2c7ca] p-2 bg-[#f9f9f8]">
            {['All', ...platforms].map(p => <option key={p}>{p}</option>)}
          </select>
        </label>
        <label className="text-xs text-[#515f74]">Risk
          <select value={risk} onChange={e => setRisk(e.target.value as RiskLevel)} className="block mt-1 rounded-lg border border-[#c2c7ca] p-2 bg-[#f9f9f8]">
            {['All', 'Critical', 'High', 'Medium', 'Low', 'Trusted'].map(r => <option key={r}>{r}</option>)}
          </select>
        </label>
      </div>
      <p role="status" className="text-xs text-[#515f74]">{results.length} matching candidates · Counts reflect this channel and active filters.</p>
      {!results.length && <div className="bg-white border border-[#c2c7ca]/60 rounded-xl p-8 text-center text-[#515f74]">
        <p>No monitoring candidates match the selected criteria.</p>
        <button onClick={reset} className="mt-3 px-3 py-2 bg-[#0f2930] text-white rounded-lg text-xs">Reset Filters</button>
      </div>}
      <div className="relative grid grid-cols-1 xl:grid-cols-2 gap-4 min-w-0">
        <AnimatePresence initial={false} mode="popLayout">
          {results.map((t, index) => <MotionResult key={t.id} index={index}>
            {isApp(t) ? <AppMonitoringCard t={t} brand={brand} onInvestigate={onInvestigate} onOpenTakedown={onOpenTakedown} />
              : <SocialMonitoringCard t={t} brand={brand} onInvestigate={onInvestigate} onOpenTakedown={onOpenTakedown} />}
          </MotionResult>)}
        </AnimatePresence>
      </div>
    </section>
  </div>;
}
export const SocialMonitoringView = (props: Props) => <MonitoringView {...props} initialChannel="Social Accounts" />;
export const AppMonitoringView = (props: Props) => <MonitoringView {...props} initialChannel="Mobile Apps" />;
