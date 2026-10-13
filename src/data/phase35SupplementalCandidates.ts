import { CandidateEntity } from '../types';
import { BRAND_METADATA } from './brandMetadata';
import { normalizeBrandCatalogKey } from './brandCatalog';

interface OfficialSocialConfig {
  id: string;
  brand: string;
  name: string;
  handle: string;
  publisher: string;
  audience: string;
}

interface FacebookConfig {
  id: string;
  brand: string;
  name: string;
  handle: string;
  publisher: string;
  audience: string;
  summary: string;
  purpose: string;
  redirectTunnel?: string;
  benign?: boolean;
}

function metadataFor(brand: string) {
  return BRAND_METADATA[normalizeBrandCatalogKey(brand)];
}

function officialSocial(config: OfficialSocialConfig): CandidateEntity {
  const metadata = metadataFor(config.brand);
  const logo = metadata?.officialLogo;
  return {
    id: config.id,
    targetBrand: config.brand,
    name: config.name,
    handleOrPkg: config.handle,
    platform: 'X',
    avatarType: 'badge',
    avatarBg: logo?.primaryColor || '#0f2930',
    avatarText: config.brand.slice(0, 2).toUpperCase(),
    audience: config.audience,
    dateDetected: '2026-10-01 00:00 UTC',
    publisher: config.publisher,
    isKnownOfficial: true,
    officialEntity: config.publisher,
    summary: `Controlled official social reference for ${config.brand}.`,
    visualProfile: logo
      ? {
          primaryColor: logo.primaryColor,
          secondaryColor: logo.secondaryColor,
          pHash: logo.pHash,
          symbolDescription: logo.symbolDescription,
          shape: logo.shape,
        }
      : undefined,
    visual: logo?.imageSrc
      ? {
          imageSrc: logo.imageSrc,
          source: 'demo',
          label: `${config.brand} Demo Official Social Reference`,
        }
      : undefined,
    details: {
      publisher: config.publisher,
      purpose: 'Controlled Official Social Reference',
      homographEntropy: '0.00 (Reference)',
      sha256Hash: '',
      registrar: 'Controlled Prototype Social Dataset',
      ipAddress: '',
      registeredDate: '2026-10-01',
      mxRecords: 'N/A',
    },
  };
}

function facebookScenario(config: FacebookConfig): CandidateEntity {
  const metadata = metadataFor(config.brand);
  const logo = metadata?.officialLogo;
  const benign = config.benign === true;
  return {
    id: config.id,
    targetBrand: config.brand,
    name: config.name,
    handleOrPkg: config.handle,
    platform: 'Facebook',
    avatarType: 'letter',
    avatarBg: benign ? '#515f74' : '#ba1a1a',
    avatarText: config.brand.slice(0, 2).toUpperCase(),
    audience: config.audience,
    dateDetected: benign ? '2026-10-05 12:00 UTC' : '2026-10-12 12:00 UTC',
    publisher: config.publisher,
    summary: config.summary,
    visualProfile: benign
      ? {
          primaryColor: '#515f74',
          secondaryColor: '#2b94d7',
          pHash: '1122334455667788',
          symbolDescription: 'Independent community graphic distinct from the protected brand reference',
          shape: 'circle',
        }
      : logo
      ? {
          primaryColor: logo.primaryColor,
          secondaryColor: logo.secondaryColor,
          pHash: logo.pHash,
          symbolDescription: `Synthetic ${config.brand} look-alike social avatar`,
          shape: 'circle',
        }
      : undefined,
    details: {
      publisher: config.publisher,
      redirectTunnel: config.redirectTunnel,
      purpose: config.purpose,
      homographEntropy: benign ? '0.00 (No manipulation)' : 'Brand modifier / support impersonation',
      sha256Hash: '',
      registrar: 'Controlled Prototype Social Dataset',
      ipAddress: '',
      registeredDate: benign ? '2026-09-01' : '2026-10-08',
      mxRecords: 'N/A',
    },
  };
}

export const PHASE35_SUPPLEMENTAL_CANDIDATES: CandidateEntity[] = [
  officialSocial({
    id: 'CAND-GPAY-SOCIAL-OFFICIAL',
    brand: 'Google Pay',
    name: 'Google Pay',
    handle: '@GooglePay',
    publisher: 'Google LLC',
    audience: 'Controlled reference',
  }),
  officialSocial({
    id: 'CAND-HDFC-SOCIAL-OFFICIAL',
    brand: 'HDFC Bank',
    name: 'HDFC Bank',
    handle: '@HDFC_Bank',
    publisher: 'HDFC Bank Limited',
    audience: 'Controlled reference',
  }),
  officialSocial({
    id: 'CAND-FLIP-SOCIAL-OFFICIAL',
    brand: 'Flipkart',
    name: 'Flipkart',
    handle: '@Flipkart',
    publisher: 'Flipkart Internet Private Limited',
    audience: 'Controlled reference',
  }),
  officialSocial({
    id: 'CAND-GOOG-SOCIAL-OFFICIAL',
    brand: 'Google',
    name: 'Google',
    handle: '@Google',
    publisher: 'Google LLC',
    audience: 'Controlled reference',
  }),
  officialSocial({
    id: 'CAND-JIO-SOCIAL-OFFICIAL',
    brand: 'Jio',
    name: 'Jio',
    handle: '@reliancejio',
    publisher: 'Reliance Jio Infocomm Limited',
    audience: 'Controlled reference',
  }),
  officialSocial({
    id: 'CAND-ZOMATO-SOCIAL-OFFICIAL',
    brand: 'Zomato',
    name: 'Zomato',
    handle: '@zomato',
    publisher: 'Zomato Limited',
    audience: 'Controlled reference',
  }),

  facebookScenario({
    id: 'CAND-GPAY-FB-008',
    brand: 'Google Pay',
    name: 'Google Pay Cashback Resolution Desk',
    handle: 'fb.me/gpay_cashback_resolution_demo',
    publisher: 'Reward Services Global',
    audience: '8.4K Followers',
    summary: 'Synthetic support identity offering guaranteed cashback after external account verification.',
    purpose: 'Controlled Prototype Support Impersonation',
    redirectTunnel: 'https://gpay-facebook-support.test/verify',
  }),
  facebookScenario({
    id: 'CAND-HDFC-FB-008',
    brand: 'HDFC Bank',
    name: 'HDFC Bank Loan Approval Helpdesk',
    handle: 'fb.me/hdfc_loan_helpdesk_demo',
    publisher: 'Customer Assist Network',
    audience: '6.1K Followers',
    summary: 'Synthetic banking support page requesting documents for an instant-loan approval workflow.',
    purpose: 'Controlled Prototype Banking Impersonation',
    redirectTunnel: 'https://hdfc-loan-help.test/apply',
  }),
  facebookScenario({
    id: 'CAND-FLIP-FB-008',
    brand: 'Flipkart',
    name: 'Flipkart SuperCoin Customer Support',
    handle: 'fb.me/flipkart_supercoin_support_demo',
    publisher: 'Digital Helpdesk Studio',
    audience: '12.6K Followers',
    summary: 'Synthetic support page advertising SuperCoin recovery and external account verification.',
    purpose: 'Controlled Prototype Rewards Impersonation',
    redirectTunnel: 'https://flipkart-supercoin-help.test/login',
  }),
  facebookScenario({
    id: 'CAND-JIO-FB-008',
    brand: 'Jio',
    name: 'Jio Free Recharge Customer Care',
    handle: 'fb.me/jio_free_recharge_help_demo',
    publisher: 'Secure Wallet Solutions',
    audience: '10.8K Followers',
    summary: 'Synthetic recharge-support page offering an unrealistic free-data and recharge claim.',
    purpose: 'Controlled Prototype Recharge Impersonation',
    redirectTunnel: 'https://jio-recharge-help.test/claim',
  }),
  facebookScenario({
    id: 'CAND-NETFLIX-FB-COMMUNITY',
    brand: 'Netflix',
    name: 'Streaming Night Community',
    handle: 'fb.me/streaming_night_watch_club',
    publisher: 'Independent Viewer Community',
    audience: '4.2K Members',
    summary: 'Independent community discussing films and series available across multiple streaming services, including Netflix.',
    purpose: 'Benign Viewer Discussion Community',
    benign: true,
  }),
  facebookScenario({
    id: 'CAND-SPOTIFY-FB-COMMUNITY',
    brand: 'Spotify',
    name: 'Playlist Discovery Community',
    handle: 'fb.me/playlist_discovery_club',
    publisher: 'Independent Music Community',
    audience: '5.7K Members',
    summary: 'Independent music discussion group sharing playlists across several streaming platforms, including Spotify.',
    purpose: 'Benign Music Discussion Community',
    benign: true,
  }),
];
