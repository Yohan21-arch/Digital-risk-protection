import { VisualProfile } from '../lib/visualIdentity';

export interface BrandMetadataEntry {
  category?: string;
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
    category: 'Payments / Fintech',
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
    category: 'E-Commerce',
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
    category: 'Sports / Lifestyle',
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
    category: 'Payments / Fintech',
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
    category: 'Technology',
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

  // 6. GOOGLE PAY (Payments / Fintech)
  googlepay: {
    category: 'Payments / Fintech',
    domains: ['pay.google.com', 'google.com'],
    appDescription: 'Google Pay UPI payments money transfers bills payments contactless tap rewards.',
    officialPublishers: ['Google LLC', 'Google Ireland Ltd.'],
    officialPackages: ['com.google.android.apps.nbu.paisa.user', 'com.google.android.apps.walletnfcrel'],
    officialHandles: [
      { platform: 'X', handle: '@GooglePay' },
      { platform: 'Instagram', handle: '@googlepay' },
    ],
    officialLogo: {
      name: 'Google Pay Official Wordmark',
      trademarkNumber: 'US-TM-918239-GPAY',
      primaryColor: '#4285F4',
      secondaryColor: '#34A853',
      pHash: '4285f40192a3b4c5',
      symbolDescription: 'Google Pay stylized four-color G and Pay typography',
      shape: 'rounded',
      description: 'Controlled official reference of Google LLC payments.',
      imageSrc: '/demo-logos/googlepay-official.svg',
      vectorSvg: `<svg viewBox="0 0 100 100" class="w-full h-full"><rect width="100" height="100" rx="20" fill="#FFFFFF"/><circle cx="50" cy="50" r="30" fill="#4285F4"/></svg>`,
    },
  },
  gpay: {
    category: 'Payments / Fintech',
    domains: ['pay.google.com', 'google.com'],
    appDescription: 'Google Pay UPI payments money transfers bills payments contactless tap rewards.',
    officialPublishers: ['Google LLC', 'Google Ireland Ltd.'],
    officialPackages: ['com.google.android.apps.nbu.paisa.user', 'com.google.android.apps.walletnfcrel'],
    officialHandles: [
      { platform: 'X', handle: '@GooglePay' },
      { platform: 'Instagram', handle: '@googlepay' },
    ],
    officialLogo: {
      name: 'Google Pay Official Wordmark',
      trademarkNumber: 'US-TM-918239-GPAY',
      primaryColor: '#4285F4',
      secondaryColor: '#34A853',
      pHash: '4285f40192a3b4c5',
      symbolDescription: 'Google Pay stylized four-color G and Pay typography',
      shape: 'rounded',
      description: 'Controlled official reference of Google LLC payments.',
      imageSrc: '/demo-logos/googlepay-official.svg',
      vectorSvg: `<svg viewBox="0 0 100 100" class="w-full h-full"><rect width="100" height="100" rx="20" fill="#FFFFFF"/><circle cx="50" cy="50" r="30" fill="#4285F4"/></svg>`,
    },
  },

  // 7. RAZORPAY (Payments / Fintech)
  razorpay: {
    category: 'Payments / Fintech',
    domains: ['razorpay.com'],
    appDescription: 'Razorpay payment gateway checkout banking payroll neobanking payments.',
    officialPublishers: ['Razorpay Software Private Limited', 'Razorpay'],
    officialPackages: ['com.razorpay.payments.app', 'com.razorpay.pos'],
    officialHandles: [
      { platform: 'X', handle: '@Razorpay' },
      { platform: 'Instagram', handle: '@razorpay' },
    ],
    officialLogo: {
      name: 'Razorpay Lightning Bolt Glyph',
      trademarkNumber: 'IN-TM-4019283-RAZOR',
      primaryColor: '#0C2340',
      secondaryColor: '#3395FF',
      pHash: '0c2340a1b2c3d4e5',
      symbolDescription: 'Razorpay angled electric blue lightning bolt badge',
      shape: 'rounded',
      description: 'Controlled official reference of Razorpay Software Pvt Ltd.',
      imageSrc: '/demo-logos/razorpay-official.svg',
      vectorSvg: `<svg viewBox="0 0 100 100" class="w-full h-full"><rect width="100" height="100" rx="20" fill="#0C2340"/><path d="M42 25 L65 25 L45 52 L60 52 L35 80 L44 58 L32 58 Z" fill="#3395FF"/></svg>`,
    },
  },

  // 8. HDFC BANK (Banking)
  hdfcbank: {
    category: 'Banking',
    domains: ['hdfcbank.com'],
    appDescription: 'HDFC Bank MobileBanking deposits credit cards loans fund transfers netbanking UPI.',
    officialPublishers: ['HDFC Bank Ltd.', 'HDFC Bank Limited'],
    officialPackages: ['com.snapwork.hdfc', 'com.hdfcbank.mobilebanking'],
    officialHandles: [
      { platform: 'X', handle: '@HDFC_Bank' },
      { platform: 'Instagram', handle: '@hdfcbank' },
    ],
    officialLogo: {
      name: 'HDFC Bank Geometric Cross Logo',
      trademarkNumber: 'IN-TM-1928374-HDFC',
      primaryColor: '#004C8F',
      secondaryColor: '#ED232A',
      pHash: '004c8fed232a0011',
      symbolDescription: 'HDFC Bank blue and red quadrant geometric lock symbol',
      shape: 'rounded',
      description: 'Controlled official reference of HDFC Bank Limited.',
      imageSrc: '/demo-logos/hdfcbank-official.svg',
      vectorSvg: `<svg viewBox="0 0 100 100" class="w-full h-full"><rect width="100" height="100" rx="20" fill="#004C8F"/><rect x="25" y="25" width="50" height="50" fill="#ED232A"/></svg>`,
    },
  },
  hdfc: {
    category: 'Banking',
    domains: ['hdfcbank.com'],
    appDescription: 'HDFC Bank MobileBanking deposits credit cards loans fund transfers netbanking UPI.',
    officialPublishers: ['HDFC Bank Ltd.', 'HDFC Bank Limited'],
    officialPackages: ['com.snapwork.hdfc', 'com.hdfcbank.mobilebanking'],
    officialHandles: [
      { platform: 'X', handle: '@HDFC_Bank' },
      { platform: 'Instagram', handle: '@hdfcbank' },
    ],
    officialLogo: {
      name: 'HDFC Bank Geometric Cross Logo',
      trademarkNumber: 'IN-TM-1928374-HDFC',
      primaryColor: '#004C8F',
      secondaryColor: '#ED232A',
      pHash: '004c8fed232a0011',
      symbolDescription: 'HDFC Bank blue and red quadrant geometric lock symbol',
      shape: 'rounded',
      description: 'Controlled official reference of HDFC Bank Limited.',
      imageSrc: '/demo-logos/hdfcbank-official.svg',
      vectorSvg: `<svg viewBox="0 0 100 100" class="w-full h-full"><rect width="100" height="100" rx="20" fill="#004C8F"/><rect x="25" y="25" width="50" height="50" fill="#ED232A"/></svg>`,
    },
  },

  // 9. ICICI BANK (Banking)
  icicibank: {
    category: 'Banking',
    domains: ['icicibank.com'],
    appDescription: 'ICICI Bank iMobile Pay banking funds transfer credit card FD loans UPI.',
    officialPublishers: ['ICICI Bank Ltd.', 'ICICI Bank Limited'],
    officialPackages: ['com.csam.icici.bank.imobile', 'com.icicibank.imobile'],
    officialHandles: [
      { platform: 'X', handle: '@ICICIBank' },
      { platform: 'Instagram', handle: '@icicibank' },
    ],
    officialLogo: {
      name: 'ICICI Bank Flame Emblem',
      trademarkNumber: 'IN-TM-2837465-ICICI',
      primaryColor: '#B02A30',
      secondaryColor: '#F37021',
      pHash: 'b02a30f370212233',
      symbolDescription: 'ICICI Bank stylized orange and maroon banking emblem',
      shape: 'circle',
      description: 'Controlled official reference of ICICI Bank Limited.',
      imageSrc: '/demo-logos/icicibank-official.svg',
      vectorSvg: `<svg viewBox="0 0 100 100" class="w-full h-full"><circle cx="50" cy="50" r="48" fill="#B02A30"/><circle cx="50" cy="50" r="30" fill="#F37021"/></svg>`,
    },
  },
  icici: {
    category: 'Banking',
    domains: ['icicibank.com'],
    appDescription: 'ICICI Bank iMobile Pay banking funds transfer credit card FD loans UPI.',
    officialPublishers: ['ICICI Bank Ltd.', 'ICICI Bank Limited'],
    officialPackages: ['com.csam.icici.bank.imobile', 'com.icicibank.imobile'],
    officialHandles: [
      { platform: 'X', handle: '@ICICIBank' },
      { platform: 'Instagram', handle: '@icicibank' },
    ],
    officialLogo: {
      name: 'ICICI Bank Flame Emblem',
      trademarkNumber: 'IN-TM-2837465-ICICI',
      primaryColor: '#B02A30',
      secondaryColor: '#F37021',
      pHash: 'b02a30f370212233',
      symbolDescription: 'ICICI Bank stylized orange and maroon banking emblem',
      shape: 'circle',
      description: 'Controlled official reference of ICICI Bank Limited.',
      imageSrc: '/demo-logos/icicibank-official.svg',
      vectorSvg: `<svg viewBox="0 0 100 100" class="w-full h-full"><circle cx="50" cy="50" r="48" fill="#B02A30"/><circle cx="50" cy="50" r="30" fill="#F37021"/></svg>`,
    },
  },

  // 10. FLIPKART (E-Commerce)
  flipkart: {
    category: 'E-Commerce',
    domains: ['flipkart.com'],
    appDescription: 'Flipkart online shopping delivery electronics fashion grocery deals rewards.',
    officialPublishers: ['Flipkart', 'Flipkart Internet Private Limited'],
    officialPackages: ['com.flipkart.android', 'com.flipkart.seller'],
    officialHandles: [
      { platform: 'X', handle: '@Flipkart' },
      { platform: 'Instagram', handle: '@flipkart' },
    ],
    officialLogo: {
      name: 'Flipkart Bag & F Glyph',
      trademarkNumber: 'IN-TM-4920192-FLIP',
      primaryColor: '#2874F0',
      secondaryColor: '#FFE500',
      pHash: '2874f0ffe5003344',
      symbolDescription: 'Flipkart blue shopping bag with yellow handle and f symbol',
      shape: 'rounded',
      description: 'Controlled official reference of Flipkart Internet Pvt Ltd.',
      imageSrc: '/demo-logos/flipkart-official.svg',
      vectorSvg: `<svg viewBox="0 0 100 100" class="w-full h-full"><rect width="100" height="100" rx="20" fill="#2874F0"/><path d="M35 30 L65 30 L60 70 L40 70 Z" fill="#FFE500"/></svg>`,
    },
  },

  // 11. MEESHO (E-Commerce)
  meesho: {
    category: 'E-Commerce',
    domains: ['meesho.com'],
    appDescription: 'Meesho online shopping wholesale prices fashion clothing home kitchen.',
    officialPublishers: ['Meesho Inc', 'Fashnear Technologies Private Limited'],
    officialPackages: ['com.meesho.supply'],
    officialHandles: [
      { platform: 'X', handle: '@Meesho_Official' },
      { platform: 'Instagram', handle: '@meeshoapp' },
    ],
    officialLogo: {
      name: 'Meesho Magenta Badge',
      trademarkNumber: 'IN-TM-5019283-MEESHO',
      primaryColor: '#580638',
      secondaryColor: '#F43397',
      pHash: '580638f433974455',
      symbolDescription: 'Meesho deep magenta badge with rounded white m logo',
      shape: 'rounded',
      description: 'Controlled official reference of Fashnear Technologies.',
      imageSrc: '/demo-logos/meesho-official.svg',
      vectorSvg: `<svg viewBox="0 0 100 100" class="w-full h-full"><rect width="100" height="100" rx="20" fill="#580638"/><circle cx="50" cy="50" r="28" fill="#F43397"/></svg>`,
    },
  },

  // 12. GOOGLE (Technology)
  google: {
    category: 'Technology',
    domains: ['google.com', 'google.co.in'],
    appDescription: 'Google search news assistant chrome workspace drive maps cloud.',
    officialPublishers: ['Google LLC', 'Google Inc.'],
    officialPackages: ['com.google.android.googlequicksearchbox', 'com.android.chrome'],
    officialHandles: [
      { platform: 'X', handle: '@Google' },
      { platform: 'Instagram', handle: '@google' },
    ],
    officialLogo: {
      name: 'Google Four-Color G',
      trademarkNumber: 'US-TM-2882910-GOOG',
      primaryColor: '#4285F4',
      secondaryColor: '#EA4335',
      pHash: '4285f4ea43355566',
      symbolDescription: 'Google circular four-color geometric G logo',
      shape: 'rounded',
      description: 'Controlled official reference of Google LLC.',
      imageSrc: '/demo-logos/google-official.svg',
      vectorSvg: `<svg viewBox="0 0 100 100" class="w-full h-full"><rect width="100" height="100" rx="20" fill="#FFFFFF"/><circle cx="50" cy="50" r="30" fill="#4285F4"/></svg>`,
    },
  },

  // 13. APPLE (Technology)
  apple: {
    category: 'Technology',
    domains: ['apple.com', 'icloud.com'],
    appDescription: 'Apple iPhone iPad Mac iOS Apple Music TV iCloud App Store hardware services.',
    officialPublishers: ['Apple', 'Apple Inc.'],
    officialPackages: ['com.apple.movetoios', 'com.apple.android.music'],
    officialHandles: [
      { platform: 'X', handle: '@Apple' },
      { platform: 'Instagram', handle: '@apple' },
    ],
    officialLogo: {
      name: 'Apple Silhouette',
      trademarkNumber: 'US-TM-1074785-APPLE',
      primaryColor: '#000000',
      secondaryColor: '#FFFFFF',
      pHash: '000000ffffff6677',
      symbolDescription: 'Apple monochrome silhouette with leaf and side bite',
      shape: 'rounded',
      description: 'Controlled official reference of Apple Inc.',
      imageSrc: '/demo-logos/apple-official.svg',
      vectorSvg: `<svg viewBox="0 0 100 100" class="w-full h-full"><rect width="100" height="100" rx="20" fill="#000000"/><circle cx="50" cy="50" r="25" fill="#FFFFFF"/></svg>`,
    },
  },

  // 14. ADOBE (Technology)
  adobe: {
    category: 'Technology',
    domains: ['adobe.com'],
    appDescription: 'Adobe Creative Cloud Photoshop Acrobat Illustrator Premiere PDF design editor.',
    officialPublishers: ['Adobe', 'Adobe Inc.'],
    officialPackages: ['com.adobe.reader', 'com.adobe.creativecloud'],
    officialHandles: [
      { platform: 'X', handle: '@Adobe' },
      { platform: 'Instagram', handle: '@adobe' },
    ],
    officialLogo: {
      name: 'Adobe Red A Triangle',
      trademarkNumber: 'US-TM-1402918-ADOBE',
      primaryColor: '#EB1000',
      secondaryColor: '#FFFFFF',
      pHash: 'eb1000ffffff7788',
      symbolDescription: 'Adobe iconic red square with stylized white triangular A glyph',
      shape: 'rounded',
      description: 'Controlled official reference of Adobe Inc.',
      imageSrc: '/demo-logos/adobe-official.svg',
      vectorSvg: `<svg viewBox="0 0 100 100" class="w-full h-full"><rect width="100" height="100" rx="20" fill="#EB1000"/><polygon points="36,75 22,25 46,25" fill="#FFFFFF"/><polygon points="64,75 78,25 54,25" fill="#FFFFFF"/></svg>`,
    },
  },

  // 15. JIO (Telecom)
  jio: {
    category: 'Telecom',
    domains: ['jio.com'],
    appDescription: 'MyJio mobile recharge 5G fiber entertainment UPI payments cinema games.',
    officialPublishers: ['Jio Platforms Limited', 'Reliance Retail Ltd'],
    officialPackages: ['com.jio.myjio', 'com.jio.media.jiobeats'],
    officialHandles: [
      { platform: 'X', handle: '@reliancejio' },
      { platform: 'Instagram', handle: '@reliancejio' },
    ],
    officialLogo: {
      name: 'Reliance Jio Blue & Red Badge',
      trademarkNumber: 'IN-TM-3102918-JIO',
      primaryColor: '#0A2885',
      secondaryColor: '#E11932',
      pHash: '0a2885e119328899',
      symbolDescription: 'Jio circular red badge with blue container and white typography',
      shape: 'rounded',
      description: 'Controlled official reference of Jio Platforms Limited.',
      imageSrc: '/demo-logos/jio-official.svg',
      vectorSvg: `<svg viewBox="0 0 100 100" class="w-full h-full"><rect width="100" height="100" rx="20" fill="#0A2885"/><circle cx="50" cy="50" r="32" fill="#E11932"/></svg>`,
    },
  },

  // 16. AIRTEL (Telecom)
  airtel: {
    category: 'Telecom',
    domains: ['airtel.in', 'airtel.com'],
    appDescription: 'Airtel Thanks mobile recharge 5G broadband payments bank DTH bills.',
    officialPublishers: ['Airtel', 'Bharti Airtel Ltd'],
    officialPackages: ['com.myairtelapp', 'com.airtel.thanks'],
    officialHandles: [
      { platform: 'X', handle: '@airtelindia' },
      { platform: 'Instagram', handle: '@airtelindia' },
    ],
    officialLogo: {
      name: 'Airtel Swirl Wordmark',
      trademarkNumber: 'IN-TM-2918273-AIRTEL',
      primaryColor: '#ED1C24',
      secondaryColor: '#FFFFFF',
      pHash: 'ed1c24ffffff99aa',
      symbolDescription: 'Airtel iconic red rounded swirl monogram',
      shape: 'rounded',
      description: 'Controlled official reference of Bharti Airtel Ltd.',
      imageSrc: '/demo-logos/airtel-official.svg',
      vectorSvg: `<svg viewBox="0 0 100 100" class="w-full h-full"><rect width="100" height="100" rx="20" fill="#ED1C24"/><circle cx="50" cy="50" r="28" fill="none" stroke="#FFFFFF" stroke-width="8"/></svg>`,
    },
  },

  // 17. ZOMATO (Food / Delivery)
  zomato: {
    category: 'Food / Delivery',
    domains: ['zomato.com'],
    appDescription: 'Zomato food delivery restaurant booking dining deals quick delivery orders.',
    officialPublishers: ['Zomato', 'Zomato Media Pvt. Ltd.'],
    officialPackages: ['com.application.zomato', 'com.zomato.ordering'],
    officialHandles: [
      { platform: 'X', handle: '@zomato' },
      { platform: 'Instagram', handle: '@zomato' },
    ],
    officialLogo: {
      name: 'Zomato Crimson Wordmark',
      trademarkNumber: 'IN-TM-2819201-ZOMATO',
      primaryColor: '#E23744',
      secondaryColor: '#FFFFFF',
      pHash: 'e23744ffffffaabb',
      symbolDescription: 'Zomato red rounded square with white italic brand wordmark',
      shape: 'rounded',
      description: 'Controlled official reference of Zomato Limited.',
      imageSrc: '/demo-logos/zomato-official.svg',
      vectorSvg: `<svg viewBox="0 0 100 100" class="w-full h-full"><rect width="100" height="100" rx="20" fill="#E23744"/><circle cx="50" cy="50" r="20" fill="#FFFFFF"/></svg>`,
    },
  },

  // 18. SWIGGY (Food / Delivery)
  swiggy: {
    category: 'Food / Delivery',
    domains: ['swiggy.com'],
    appDescription: 'Swiggy food delivery Instamart groceries dining quick commerce restaurant orders.',
    officialPublishers: ['Swiggy', 'Bundl Technologies Pvt. Ltd.'],
    officialPackages: ['in.swiggy.android', 'in.swiggy.delivery'],
    officialHandles: [
      { platform: 'X', handle: '@Swiggy' },
      { platform: 'Instagram', handle: '@swiggy_in' },
    ],
    officialLogo: {
      name: 'Swiggy Orange Pin Glyph',
      trademarkNumber: 'IN-TM-3819202-SWIGGY',
      primaryColor: '#FC8019',
      secondaryColor: '#FFFFFF',
      pHash: 'fc8019ffffffbbcc',
      symbolDescription: 'Swiggy signature vibrant orange location pin avatar',
      shape: 'rounded',
      description: 'Controlled official reference of Bundl Technologies.',
      imageSrc: '/demo-logos/swiggy-official.svg',
      vectorSvg: `<svg viewBox="0 0 100 100" class="w-full h-full"><rect width="100" height="100" rx="20" fill="#FC8019"/><circle cx="50" cy="40" r="16" fill="#FFFFFF"/></svg>`,
    },
  },

  // 19. MAKEMYTRIP (Travel / Hospitality)
  makemytrip: {
    category: 'Travel / Hospitality',
    domains: ['makemytrip.com'],
    appDescription: 'MakeMyTrip flight bookings hotels train tickets holiday packages bus travel.',
    officialPublishers: ['MakeMyTrip.com', 'MakeMyTrip India Pvt. Ltd.'],
    officialPackages: ['com.makemytrip', 'com.makemytrip.holiday'],
    officialHandles: [
      { platform: 'X', handle: '@makemytrip' },
      { platform: 'Instagram', handle: '@makemytrip' },
    ],
    officialLogo: {
      name: 'MakeMyTrip Red Circle MMT',
      trademarkNumber: 'IN-TM-1829103-MMT',
      primaryColor: '#E41E26',
      secondaryColor: '#000000',
      pHash: 'e41e26000000ccdd',
      symbolDescription: 'MakeMyTrip red and black circular travel emblem',
      shape: 'circle',
      description: 'Controlled official reference of MakeMyTrip India Pvt Ltd.',
      imageSrc: '/demo-logos/makemytrip-official.svg',
      vectorSvg: `<svg viewBox="0 0 100 100" class="w-full h-full"><rect width="100" height="100" rx="20" fill="#000000"/><circle cx="50" cy="50" r="32" fill="#E41E26"/></svg>`,
    },
  },
  mmt: {
    category: 'Travel / Hospitality',
    domains: ['makemytrip.com'],
    appDescription: 'MakeMyTrip flight bookings hotels train tickets holiday packages bus travel.',
    officialPublishers: ['MakeMyTrip.com', 'MakeMyTrip India Pvt. Ltd.'],
    officialPackages: ['com.makemytrip', 'com.makemytrip.holiday'],
    officialHandles: [
      { platform: 'X', handle: '@makemytrip' },
      { platform: 'Instagram', handle: '@makemytrip' },
    ],
    officialLogo: {
      name: 'MakeMyTrip Red Circle MMT',
      trademarkNumber: 'IN-TM-1829103-MMT',
      primaryColor: '#E41E26',
      secondaryColor: '#000000',
      pHash: 'e41e26000000ccdd',
      symbolDescription: 'MakeMyTrip red and black circular travel emblem',
      shape: 'circle',
      description: 'Controlled official reference of MakeMyTrip India Pvt Ltd.',
      imageSrc: '/demo-logos/makemytrip-official.svg',
      vectorSvg: `<svg viewBox="0 0 100 100" class="w-full h-full"><rect width="100" height="100" rx="20" fill="#000000"/><circle cx="50" cy="50" r="32" fill="#E41E26"/></svg>`,
    },
  },

  // 20. OYO (Travel / Hospitality)
  oyo: {
    category: 'Travel / Hospitality',
    domains: ['oyorooms.com'],
    appDescription: 'OYO hotel booking rooms stays vacation homes budget accommodation.',
    officialPublishers: ['OYO Rooms', 'Oravel Stays Private Limited'],
    officialPackages: ['com.oyo.consumer'],
    officialHandles: [
      { platform: 'X', handle: '@oyorooms' },
      { platform: 'Instagram', handle: '@oyo' },
    ],
    officialLogo: {
      name: 'OYO Red Letters Badge',
      trademarkNumber: 'IN-TM-3918274-OYO',
      primaryColor: '#EE2E24',
      secondaryColor: '#FFFFFF',
      pHash: 'ee2e24ffffffddee',
      symbolDescription: 'OYO bold red container with distinctive geometric lettering',
      shape: 'rounded',
      description: 'Controlled official reference of Oravel Stays Pvt Ltd.',
      imageSrc: '/demo-logos/oyo-official.svg',
      vectorSvg: `<svg viewBox="0 0 100 100" class="w-full h-full"><rect width="100" height="100" rx="20" fill="#EE2E24"/><circle cx="50" cy="50" r="22" fill="#FFFFFF"/></svg>`,
    },
  },

  // 21. ADIDAS (Sports / Lifestyle)
  adidas: {
    category: 'Sports / Lifestyle',
    domains: ['adidas.com', 'adidas.co.in'],
    appDescription: 'adidas shoes sportswear running training sneakers football original fashion.',
    officialPublishers: ['adidas', 'adidas AG'],
    officialPackages: ['com.adidas.app', 'com.adidas.confirmed.app'],
    officialHandles: [
      { platform: 'X', handle: '@adidas' },
      { platform: 'Instagram', handle: '@adidas' },
    ],
    officialLogo: {
      name: 'Adidas Three Stripes Trefoil',
      trademarkNumber: 'DE-TM-8192837-ADI',
      primaryColor: '#000000',
      secondaryColor: '#FFFFFF',
      pHash: '000000ffffff1122',
      symbolDescription: 'Adidas iconic three diagonal parallel stripes',
      shape: 'rounded',
      description: 'Controlled official reference of adidas AG.',
      imageSrc: '/demo-logos/adidas-official.svg',
      vectorSvg: `<svg viewBox="0 0 100 100" class="w-full h-full"><rect width="100" height="100" rx="20" fill="#000000"/><rect x="25" y="55" width="10" height="20" fill="#FFFFFF"/></svg>`,
    },
  },

  // 22. NETFLIX (Entertainment)
  netflix: {
    category: 'Entertainment',
    domains: ['netflix.com'],
    appDescription: 'Netflix movies TV series streaming original entertainment watch online.',
    officialPublishers: ['Netflix, Inc.', 'Netflix Inc'],
    officialPackages: ['com.netflix.mediaclient', 'com.netflix.ninja'],
    officialHandles: [
      { platform: 'X', handle: '@netflix' },
      { platform: 'Instagram', handle: '@netflix' },
    ],
    officialLogo: {
      name: 'Netflix Red N Ribbon',
      trademarkNumber: 'US-TM-4819203-NETFLIX',
      primaryColor: '#141414',
      secondaryColor: '#E50914',
      pHash: '141414e509142233',
      symbolDescription: 'Netflix black background with deep red curved N ribbon',
      shape: 'rounded',
      description: 'Controlled official reference of Netflix, Inc.',
      imageSrc: '/demo-logos/netflix-official.svg',
      vectorSvg: `<svg viewBox="0 0 100 100" class="w-full h-full"><rect width="100" height="100" rx="20" fill="#141414"/><path d="M30 20 L44 20 L44 80 L30 80 Z" fill="#E50914"/></svg>`,
    },
  },

  // 23. SPOTIFY (Entertainment)
  spotify: {
    category: 'Entertainment',
    domains: ['spotify.com'],
    appDescription: 'Spotify music podcasts songs playlists albums streaming audio listen.',
    officialPublishers: ['Spotify AB', 'Spotify Ltd.'],
    officialPackages: ['com.spotify.music', 'com.spotify.tv.android'],
    officialHandles: [
      { platform: 'X', handle: '@Spotify' },
      { platform: 'Instagram', handle: '@spotify' },
    ],
    officialLogo: {
      name: 'Spotify Soundwaves Circle',
      trademarkNumber: 'SE-TM-3918274-SPOTIFY',
      primaryColor: '#121212',
      secondaryColor: '#1DB954',
      pHash: '1212121db9543344',
      symbolDescription: 'Spotify bright green circle with three radiating sound waves',
      shape: 'circle',
      description: 'Controlled official reference of Spotify AB.',
      imageSrc: '/demo-logos/spotify-official.svg',
      vectorSvg: `<svg viewBox="0 0 100 100" class="w-full h-full"><rect width="100" height="100" rx="20" fill="#121212"/><circle cx="50" cy="50" r="32" fill="#1DB954"/></svg>`,
    },
  },
};
