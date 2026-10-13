export type PlatformType = 'All' | 'Instagram' | 'Facebook' | 'X' | 'Google Play' | 'App Store' | 'Telegram' | 'Web Domain';

export type RiskLevel = 'All' | 'Critical' | 'High' | 'Medium' | 'Low' | 'Trusted';

export interface ThreatSignal {
  label: string;
  icon: string;
  score: number;
  desc: string;
  type: 'critical' | 'high' | 'warning' | 'info' | 'safe';
}

export interface ThreatItem {
  id: string;
  name: string;
  handleOrPkg: string;
  platform: 'X' | 'Google Play' | 'Facebook' | 'Instagram' | 'App Store' | 'Telegram' | 'Web Domain';
  riskCategory: 'Critical' | 'High' | 'Medium' | 'Low' | 'Trusted';
  riskScore: number;
  avatarType: 'letter' | 'icon' | 'badge';
  avatarBg: string;
  avatarText: string;
  summary: string;
  audience: string;
  status: 'active' | 'dismissed' | 'takedown_issued' | 'marked_trusted';
  dateDetected: string;
  explainableSignals: ThreatSignal[];
  details: {
    publisher: string;
    redirectTunnel?: string;
    purpose: string;
    homographEntropy: string;
    sha256Hash: string;
    registrar: string;
    ipAddress: string;
    registeredDate: string;
    mxRecords: string;
    evProof?: string;
  };
}

export interface VerifiedAsset {
  id: string;
  name: string;
  type: string;
  identifier: string;
  legalEntity: string;
  status: 'ANCHOR ACTIVE' | 'KEY SIGNED' | 'CERTIFIED';
  registeredDate: string;
}

export interface HomographThreat {
  mutation: string;
  technique: string;
  punycode: string;
  levenshtein: number;
  ipResolution: string;
  status: 'CRITICAL' | 'MONITORING' | 'DEFENSIVE REGISTERED';
}

export interface TakedownNotice {
  id: string;
  targetName: string;
  targetIdentifier: string;
  entity: string;
  provider: string;
  legalClaim: string;
  issuedAt: string;
  status: 'Pending Review' | 'Notice Sent' | 'Delisted / Suspended' | 'Counter-Notice';
  trackingHash: string;
}

export type NavTab = 
  | 'Overview' 
  | 'Brand Search' 
  | 'Social Monitoring' 
  | 'App Monitoring' 
  | 'Detection Center' 
  | 'Verified Assets' 
  | 'Brand Profile' 
  | 'Settings';

export type TopSubTab = 'Global Telemetry' | 'Active Takedowns' | 'Evidence Logs';
