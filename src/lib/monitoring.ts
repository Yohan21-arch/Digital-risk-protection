import { MonitoringChannel, NavigationTarget, NavTab, PlatformType, RiskLevel, ThreatItem } from '../types';
export const SOCIAL_PLATFORMS = ['X', 'Instagram', 'Facebook', 'Telegram'] as const;
export const APP_PLATFORMS = ['Google Play', 'App Store'] as const;
export function isSocial(t: ThreatItem) { return SOCIAL_PLATFORMS.some(p => p === t.platform); }
export function isApp(t: ThreatItem) { return APP_PLATFORMS.some(p => p === t.platform); }
export function resolveNavigation(target: NavigationTarget): { tab: NavTab; channel?: MonitoringChannel } {
  if (target === 'Social Monitoring') return { tab: 'Monitoring', channel: 'Social Accounts' };
  if (target === 'App Monitoring') return { tab: 'Monitoring', channel: 'Mobile Apps' };
  return { tab: target };
}
export function monitoringResults(threats: ThreatItem[], channel: MonitoringChannel, platform: PlatformType = 'All', risk: RiskLevel = 'All', search = '') {
  const query = search.trim().toLowerCase();
  const severity = { Critical: 4, High: 3, Medium: 2, Low: 1, Trusted: 0 };
  return threats.filter(t => (channel === 'Social Accounts' ? isSocial(t) : channel === 'Mobile Apps' ? isApp(t) : isSocial(t) || isApp(t))
    && (platform === 'All' || t.platform === platform) && (risk === 'All' || t.riskCategory === risk)
    && [t.name, t.handleOrPkg, t.summary, t.details?.publisher || ''].some(text => text.toLowerCase().includes(query)))
    .sort((a, b) => severity[b.riskCategory] - severity[a.riskCategory] || b.riskScore - a.riskScore || a.id.localeCompare(b.id));
}
export function monitoringMetrics(results: ThreatItem[]) {
  return { 'Total Monitored': results.length, Critical: results.filter(t => t.riskCategory === 'Critical').length,
    High: results.filter(t => t.riskCategory === 'High').length, 'Social Accounts': results.filter(isSocial).length,
    'Mobile Apps': results.filter(isApp).length, Platforms: new Set(results.map(t => t.platform)).size };
}
