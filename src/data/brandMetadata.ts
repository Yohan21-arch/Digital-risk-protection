import { VisualProfile } from '../lib/visualIdentity';

export interface BrandMetadataEntry {
  domains: string[];
  appDescription: string;
  officialPublishers: string[];
  officialPackages: string[];
  officialHandles: { platform: string; handle: string }[];
  officialLogo: VisualProfile & {
    name: string;
    trademarkNumber: string;
    vectorSvg: string;
    description: string;
    imageSrc?: string;
  };
}

// Reference metadata for deterministic prototype comparisons; no live verification.
export const BRAND_METADATA: Record<string, BrandMetadataEntry> = {
  paytm: {
    domains: ['paytm.com', 'paytmbank.com', 'insider.in'],
    appDescription: 'Paytm UPI payments money transfers mobile recharge bill payments wallet cashback rewards.',
    officialPublishers: ['One97 Communications Ltd.', 'Paytm Payments Bank', 'One97 Communications'],
    officialPackages: ['net.one97.paytm', 'com.paytm.business', 'net.one97.paytm.ios'],
    officialHandles: [
      { platform: 'X', handle: '@paytm' },
      { platform: 'Instagram', handle: '@paytm' },
      { platform: 'Facebook', handle: 'Paytm' },
    ],
    officialLogo: {
      name: 'Paytm Official Wordmark & Shield',
      trademarkNumber: 'IN-TM-2948110-PAYTM',
      primaryColor: '#002E6E',
      secondaryColor: '#00BAF2',
      pHash: 'a8b2c4e0f1d3e5a7',
      symbolDescription: 'Paytm Navy Blue & Cyan dual-tone block typography',
      shape: 'rounded',
      description: 'Registered sovereign payments trademark of One97 Communications Ltd.',
      imageSrc: '/demo-logos/paytm-official.svg',
      vectorSvg: `<svg viewBox="0 0 100 100" class="w-full h-full"><rect width="100" height="100" rx="20" fill="#002E6E"/><path d="M22 68V32h14c9 0 14 5 14 12s-5 12-14 12h-6v12H22zm8-18h6c4 0 6-2 6-6s-2-6-6-6h-6v12z" fill="#FFFFFF"/><path d="M52 46h10v22h8V46h10v-6H52v6z" fill="#00BAF2"/></svg>`,
    },
  },
  amazon: {
    domains: ['amazon.com', 'amazon.in', 'primevideo.com'],
    appDescription: 'Amazon shopping delivery products deals Prime video entertainment rewards.',
    officialPublishers: ['Amazon Mobile LLC', 'Amazon Technologies, Inc.', 'Amazon.com Services LLC'],
    officialPackages: ['com.amazon.mShop.android.shopping', 'com.amazon.kindle', 'com.amazon.mp3', 'com.amazon.amazonmobile.shopping'],
    officialHandles: [
      { platform: 'X', handle: '@amazon' },
      { platform: 'Instagram', handle: '@amazon' },
    ],
    officialLogo: {
      name: 'Amazon Smile Wordmark',
      trademarkNumber: 'US-TM-74582910-AMZN',
      primaryColor: '#ff9900',
      secondaryColor: '#146eb4',
      pHash: 'c3d4e5f6a1b2c3d4',
      symbolDescription: 'Amazon curved smile arrow connecting A to Z',
      shape: 'rounded',
      description: 'Authorized trademark of Amazon Technologies, Inc.',
      imageSrc: '/demo-logos/amazon-official.svg',
      vectorSvg: `<svg viewBox="0 0 100 100" class="w-full h-full"><rect width="100" height="100" rx="20" fill="#131921"/><path d="M25 62c15 10 35 10 50 0-3-2-8-4-8-4s6 1 11-1c-2 6-6 10-6 10-2-2-5-4-5-4-13 8-30 8-42-1z" fill="#FF9900"/><path d="M38 35h10v20H38zM52 30h10v25H52z" fill="#FFFFFF"/></svg>`,
    },
  },
  nike: {
    domains: ['nike.com'],
    appDescription: 'Nike shoes clothing sports football running training shopping.',
    officialPublishers: ['Nike, Inc.', 'Nike Inc.', 'NIKE Inc'],
    officialPackages: ['com.nike.omega', 'com.nike.plusgps', 'com.nike.snkrs'],
    officialHandles: [
      { platform: 'Instagram', handle: '@nike' },
      { platform: 'X', handle: '@nike' },
    ],
    officialLogo: {
      name: 'Nike Swoosh Trademark',
      trademarkNumber: 'US-TM-12849102-SWOOSH',
      primaryColor: '#111111',
      secondaryColor: '#f5f5f5',
      pHash: 'f0e1d2c3b4a59687',
      symbolDescription: 'Nike iconic dynamic checkmark swoosh',
      shape: 'rounded',
      description: 'Official registered trademark of Nike, Inc.',
      imageSrc: '/demo-logos/nike-official.svg',
      vectorSvg: `<svg viewBox="0 0 100 100" class="w-full h-full"><rect width="100" height="100" rx="20" fill="#111111"/><path d="M20 54c12 10 24 16 34 16 22 0 34-18 34-36 0-3-1-5-2-5-2 0-8 8-18 16-14 11-30 13-48 9z" fill="#FFFFFF"/></svg>`,
    },
  },
  phonepe: {
    domains: ['phonepe.com'],
    appDescription: 'PhonePe UPI payments money transfers mobile recharge bill payments.',
    officialPublishers: ['PhonePe Private Limited', 'PhonePe Pvt Ltd'],
    officialPackages: ['com.phonepe.app', 'com.phonepe.app.ios'],
    officialHandles: [
      { platform: 'X', handle: '@PhonePe' },
      { platform: 'Instagram', handle: '@phonepe' },
    ],
    officialLogo: {
      name: 'PhonePe Devanagari Pe Emblem',
      trademarkNumber: 'IN-TM-3819201-PHONEPE',
      primaryColor: '#5f259f',
      secondaryColor: '#6739b6',
      pHash: 'e4f5a6b7c8d9e0f1',
      symbolDescription: 'PhonePe purple rounded badge with stylized devanagari Pe glyph',
      shape: 'circle',
      description: 'Registered payments emblem of PhonePe Private Limited.',
      imageSrc: '/demo-logos/phonepe-official.svg',
      vectorSvg: `<svg viewBox="0 0 100 100" class="w-full h-full"><circle cx="50" cy="50" r="48" fill="#5F259F"/><rect x="26" y="24" width="48" height="8" rx="4" fill="#FFFFFF"/><path d="M38 32v34c0 6 5 10 12 10s12-4 12-10V32h-8v32c0 2-2 4-4 4s-4-2-4-4V32h-8z" fill="#FFFFFF"/><circle cx="50" cy="50" r="4" fill="#00D285"/></svg>`,
    },
  },
  microsoft: {
    domains: ['microsoft.com', 'office.com', 'live.com'],
    appDescription: 'Microsoft Office documents spreadsheets presentations productivity cloud collaboration.',
    officialPublishers: ['Microsoft Corporation', 'Microsoft Mobile'],
    officialPackages: ['com.microsoft.office.officehubrow', 'com.microsoft.teams', 'com.microsoft.office.outlook'],
    officialHandles: [
      { platform: 'X', handle: '@microsoft' },
      { platform: 'Instagram', handle: '@microsoft' },
    ],
    officialLogo: {
      name: 'Microsoft Four-Color Quadrant Tile',
      trademarkNumber: 'US-TM-9821034-MICROSOFT',
      primaryColor: '#0078D4',
      secondaryColor: '#F25022',
      pHash: 'd1c2b3a4f5e6d7c8',
      symbolDescription: 'Microsoft four-color red, green, blue, yellow square tiles',
      shape: 'rounded',
      description: 'Authorized corporate trademark of Microsoft Corporation.',
      imageSrc: '/demo-logos/microsoft-official.svg',
      vectorSvg: `<svg viewBox="0 0 100 100" class="w-full h-full"><rect width="100" height="100" rx="20" fill="#1F1F1F"/><rect x="24" y="24" width="22" height="22" fill="#F25022"/><rect x="54" y="24" width="22" height="22" fill="#7FBA00"/><rect x="24" y="54" width="22" height="22" fill="#00A4EF"/><rect x="54" y="54" width="22" height="22" fill="#FFB900"/></svg>`,
    },
  },
};
