import { BRAND_METADATA } from '../data/brandMetadata';
import { compareVisualProfiles, getStoredVisualReference } from './visualIdentity';
import {
  CandidateEntity,
  DetectionAnalysis,
  LookalikeSignal,
  RegistryMatchStatus,
  ThreatItem,
  ThreatSignal,
  VerifiedAsset,
} from '../types';

/** Jaccard overlap of normalized word sets. Empty text provides no evidence. */
export function textSimilarity(a: string, b: string): number {
  const tokens = (text: string) =>
    new Set(text.toLowerCase().normalize('NFKC').match(/[\p{L}\p{N}]+/gu) || []);
  const left = tokens(a);
  const right = tokens(b);
  if (!left.size || !right.size) return 0;
  const overlap = [...left].filter((token) => right.has(token)).length;
  return Math.round((100 * overlap) / new Set([...left, ...right]).size);
}

export function hasDomainMismatch(url: string | undefined, officialDomains: string[]): boolean {
  if (!url || !officialDomains.length) return false;
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) return false;
    const host = parsed.hostname.toLowerCase().replace(/\.$/, '');
    return !officialDomains.some((domain) => host === domain || host.endsWith(`.${domain}`));
  } catch {
    return false;
  }
}

export const SUSPICIOUS_MODIFIERS = [
  'official', 'support', 'help', 'helpdesk', 'customer care', 'customer service',
  'verify', 'verification', 'kyc', 'secure', 'security', 'cashback', 'reward',
  'rewards', 'bonus', 'claim', 'wallet', 'service', 'india', 'account', 'direct',
  'login', 'portal', 'fastloan', 'desk',
];

const LOOKALIKE_MAP: Record<string, string> = {
  '0': 'o', '1': 'i', '|': 'l', '!': 'i', '@': 'a', '$': 's', '3': 'e', '5': 's', '8': 'b',
};

export function normalizeIdentity(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^\w\s.-]/g, ' ')
    .replace(/[\s_-]+/g, ' ')
    .trim();
}

export function toAlphaNumeric(text: string): string {
  if (!text) return '';
  return text.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function normalizePublisherName(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFKC')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/\bprivate\s+limited\b/g, 'pvt ltd')
    .replace(/\blimited\b/g, 'ltd')
    .replace(/\bincorporated\b/g, 'inc')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isOfficialPublisher(
  publisher: string | undefined,
  officialPublishers: string[]
): boolean {
  const observed = normalizePublisherName(publisher || '');
  if (!observed) return false;
  return officialPublishers.some((item) => normalizePublisherName(item) === observed);
}

export function normalizePackageIdentifier(text: string): string {
  return (text || '')
    .trim()
    .toLowerCase()
    .replace(/^bundle:\s*/i, '')
    .replace(/\s+/g, '');
}

export function isOfficialPackage(
  identifier: string | undefined,
  officialPackages: string[]
): boolean {
  const observed = normalizePackageIdentifier(identifier || '');
  if (!observed) return false;
  return officialPackages.some((item) => normalizePackageIdentifier(item) === observed);
}

export function levenshteinDistance(a: string, b: string): number {
  const s1 = a || '';
  const s2 = b || '';
  if (!s1.length) return s2.length;
  if (!s2.length) return s1.length;

  let prev = Array.from({ length: s2.length + 1 }, (_, i) => i);
  let curr = new Array(s2.length + 1).fill(0);

  for (let i = 1; i <= s1.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= s2.length; j++) {
      const cost = s1.charCodeAt(i - 1) === s2.charCodeAt(j - 1) ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[s2.length];
}

export function similarityPercent(a: string, b: string): number {
  const left = toAlphaNumeric(a);
  const right = toAlphaNumeric(b);
  if (!left && !right) return 100;
  if (!left || !right) return 0;
  if (left === right) return 100;
  const distance = levenshteinDistance(left, right);
  return Math.max(0, Math.min(100, Math.round((1 - distance / Math.max(left.length, right.length)) * 100)));
}

export function checkTokenMatch(brandQuery: string, targetText: string) {
  const brand = toAlphaNumeric(brandQuery);
  if (!brand) return { exactBrandToken: false, tokenSimilarity: 0, matchedTokens: [] as string[] };

  const tokens = normalizeIdentity(targetText).split(/\s+/).filter(Boolean);
  const matchedTokens: string[] = [];
  let exactBrandToken = false;
  let tokenSimilarity = 0;

  for (const token of tokens) {
    const cleaned = toAlphaNumeric(token);
    const similarity = similarityPercent(brand, cleaned);
    tokenSimilarity = Math.max(tokenSimilarity, similarity);
    if (cleaned === brand) {
      exactBrandToken = true;
      matchedTokens.push(token);
    } else if (similarity >= 80) {
      matchedTokens.push(token);
    }
  }

  if (toAlphaNumeric(targetText).includes(brand)) {
    exactBrandToken = true;
    tokenSimilarity = 100;
  }

  return { exactBrandToken, tokenSimilarity, matchedTokens };
}

export function findSuspiciousModifiers(text: string): string[] {
  const normalized = normalizeIdentity(text);
  return SUSPICIOUS_MODIFIERS.filter((modifier) =>
    new RegExp(`\\b${modifier.replace(/\s+/g, '\\s+')}\\b`, 'i').test(normalized)
  );
}

export function detectLookalikeTechniques(
  brandQuery: string,
  candidateName: string,
  candidateHandle: string
): LookalikeSignal[] {
  const signals: LookalikeSignal[] = [];
  const brand = toAlphaNumeric(brandQuery);
  const combined = `${candidateName} ${candidateHandle}`.toLowerCase();
  const tokens = normalizeIdentity(combined).split(/\s+/).map(toAlphaNumeric).filter(Boolean);

  for (const token of tokens) {
    let translated = '';
    const replacements: { original: string; replacement: string }[] = [];
    for (const char of token) {
      if (LOOKALIKE_MAP[char]) {
        replacements.push({ original: LOOKALIKE_MAP[char], replacement: char });
        translated += LOOKALIKE_MAP[char];
      } else {
        translated += char;
      }
    }

    if (replacements.length && translated.includes(brand)) {
      for (const replacement of replacements) {
        signals.push({
          detected: true,
          technique: 'Character substitution (Leetspeak)',
          original: replacement.original,
          replacement: replacement.replacement,
          details: `Look-alike character used in ${token}`,
        });
      }
    }

    if (token.length === brand.length + 1 && token.startsWith(brand)) {
      signals.push({
        detected: true,
        technique: 'Repeated character duplication',
        original: brand,
        replacement: token,
      });
    }

    if (brand.length >= 5 && token.length === brand.length - 1 && similarityPercent(brand, token) >= 80) {
      signals.push({
        detected: true,
        technique: 'Omission / Typo manipulation',
        original: brand,
        replacement: token,
      });
    }
  }

  if (brand.length >= 6) {
    const split = Math.floor(brand.length / 2);
    const left = brand.slice(0, split);
    if (combined.includes(`${left} `) || combined.includes(`${left}-`) || combined.includes(`${left}_`)) {
      signals.push({
        detected: true,
        technique: 'Delimiter insertion',
        original: brand,
        replacement: `${brand.slice(0, split)}-${brand.slice(split)}`,
      });
    }
  }

  return signals;
}

export function detectSuspiciousUnicode(text: string) {
  const suspiciousChars: string[] = [];
  for (const char of text) {
    const code = char.charCodeAt(0);
    if ((code >= 0x0400 && code <= 0x04ff) || (code >= 0x0370 && code <= 0x03ff)) {
      suspiciousChars.push(char);
    }
  }
  return { hasSuspiciousUnicode: suspiciousChars.length > 0, suspiciousChars };
}

export function checkOfficialAssetMatch(
  candidate: CandidateEntity,
  verifiedAssets: VerifiedAsset[]
): boolean {
  if (candidate.isKnownOfficial) return true;
  const candidateHandle = normalizeIdentity(candidate.handleOrPkg);
  const candidateName = normalizeIdentity(candidate.name);
  return verifiedAssets.some((asset) => {
    const assetId = normalizeIdentity(asset.identifier);
    const assetName = normalizeIdentity(asset.name);
    return Boolean(
      (assetId && assetId === candidateHandle) ||
      (assetName && assetName === candidateName)
    );
  });
}

export function isCandidateRelevant(brandQuery: string, candidate: CandidateEntity): boolean {
  const brand = toAlphaNumeric(brandQuery);
  if (!brand || brand.length < 2) return false;
  if (candidate.targetBrand && toAlphaNumeric(candidate.targetBrand) === brand) return true;
  if (checkTokenMatch(brandQuery, candidate.name).exactBrandToken) return true;
  if (checkTokenMatch(brandQuery, candidate.handleOrPkg).exactBrandToken) return true;
  if (similarityPercent(brand, candidate.name) >= 65 || similarityPercent(brand, candidate.handleOrPkg) >= 65) return true;
  return detectLookalikeTechniques(brandQuery, candidate.name, candidate.handleOrPkg).length > 0;
}

function matchStatus(value: string | undefined, officialValues: string[], matcher: (v: string | undefined, o: string[]) => boolean): RegistryMatchStatus {
  if (!value) return 'UNKNOWN';
  return matcher(value, officialValues) ? 'MATCHED' : 'MISMATCH';
}

export function calculateRisk(
  brandQuery: string,
  candidate: CandidateEntity,
  verifiedAssets: VerifiedAsset[]
): DetectionAnalysis {
  const isOfficialMatch = checkOfficialAssetMatch(candidate, verifiedAssets);
  const metadata = BRAND_METADATA[toAlphaNumeric(brandQuery)];
  const isMobileApp = candidate.platform === 'Google Play' || candidate.platform === 'App Store';

  const publisher = candidate.details?.publisher || candidate.publisher || '';
  const publisherMatch = isMobileApp
    ? matchStatus(publisher, metadata?.officialPublishers || [], isOfficialPublisher)
    : undefined;
  const packageMatch = isMobileApp
    ? matchStatus(candidate.handleOrPkg, metadata?.officialPackages || [], isOfficialPackage)
    : undefined;

  if (isOfficialMatch) {
    return {
      candidateId: candidate.id,
      nameSimilarity: 100,
      handleSimilarity: 100,
      descriptionSimilarity: isMobileApp ? textSimilarity(candidate.summary, metadata?.appDescription || '') : undefined,
      visualSimilarity: compareVisualProfiles(candidate.visualProfile, getStoredVisualReference(toAlphaNumeric(brandQuery)) || metadata?.officialLogo),
      publisherMatch,
      packageMatch,
      exactBrandTokenFound: true,
      matchedTokens: [brandQuery],
      suspiciousModifiersFound: [],
      lookalikeSignals: [],
      hasSuspiciousUnicode: false,
      isOfficialAssetMatch: true,
      calculatedScore: 0,
      category: 'Trusted',
      breakdown: {
        nameScore: 0,
        handleScore: 0,
        lookalikeScore: 0,
        wordingScore: 0,
        platformOrPublisherScore: 0,
        unofficialIdentityScore: 0,
        visualScore: 0,
      },
      explanationPoints: ['Verified Official Asset', 'Matched against Trusted Asset Registry'],
      whyThisMatters: 'This identity matches the trusted prototype registry and is excluded from risk scoring.',
    };
  }

  const cleanBrand = brandQuery.trim();
  const nameSimilarity = similarityPercent(cleanBrand, candidate.name);
  const handleSimilarity = similarityPercent(cleanBrand, candidate.handleOrPkg);
  const tokenName = checkTokenMatch(cleanBrand, candidate.name);
  const tokenHandle = checkTokenMatch(cleanBrand, candidate.handleOrPkg);
  const exactBrandTokenFound = tokenName.exactBrandToken || tokenHandle.exactBrandToken;
  const matchedTokens = Array.from(new Set([...tokenName.matchedTokens, ...tokenHandle.matchedTokens]));
  const suspiciousModifiersFound = findSuspiciousModifiers(`${candidate.name} ${candidate.handleOrPkg} ${candidate.summary}`);
  const lookalikeSignals = detectLookalikeTechniques(cleanBrand, candidate.name, candidate.handleOrPkg);
  const unicodeCheck = detectSuspiciousUnicode(`${candidate.name} ${candidate.handleOrPkg}`);
  const isSocial = ['Instagram', 'X', 'Facebook', 'Telegram'].includes(candidate.platform);
  const descriptionSimilarity = isMobileApp ? textSimilarity(candidate.summary, metadata?.appDescription || '') : undefined;

  const officialVisual = getStoredVisualReference(toAlphaNumeric(cleanBrand)) || metadata?.officialLogo;
  const visualComparison = compareVisualProfiles(candidate.visualProfile, officialVisual);

  let nameScore = 0;
  let handleScore = 0;
  let lookalikeScore = 0;
  let wordingScore = 0;
  let platformOrPublisherScore = 0;
  let unofficialIdentityScore = 0;
  let visualScore = 0;
  const explanationPoints: string[] = [];

  if (isSocial) {
    if (exactBrandTokenFound) {
      nameScore = 25;
      explanationPoints.push('+25 Brand name closely resembles official protected identity');
    } else if (nameSimilarity >= 80) {
      nameScore = Math.round((nameSimilarity / 100) * 24);
      explanationPoints.push(`+${nameScore} High name similarity (${nameSimilarity}%)`);
    } else if (nameSimilarity >= 60) {
      nameScore = Math.round((nameSimilarity / 100) * 18);
      explanationPoints.push(`+${nameScore} Moderate name similarity (${nameSimilarity}%)`);
    }

    if (tokenHandle.exactBrandToken) {
      handleScore = 20;
      explanationPoints.push('+20 Username handle directly embeds protected brand token');
    } else if (handleSimilarity >= 75) {
      handleScore = Math.round((handleSimilarity / 100) * 18);
      explanationPoints.push(`+${handleScore} Username resembles official account`);
    }

    if (lookalikeSignals.length) {
      lookalikeScore = Math.min(15, lookalikeSignals.length * 8 + 7);
      explanationPoints.push(`+${lookalikeScore} ${lookalikeSignals[0].technique}`);
    } else if (unicodeCheck.hasSuspiciousUnicode) {
      lookalikeScore = 12;
      explanationPoints.push('+12 Cross-script Unicode look-alike characters detected');
    }

    if (suspiciousModifiersFound.length) {
      wordingScore = Math.min(10, suspiciousModifiersFound.length * 5);
      explanationPoints.push(`+${wordingScore} High-risk modifier terminology (${suspiciousModifiersFound.slice(0, 3).join(', ')})`);
    }

    if (hasDomainMismatch(candidate.details?.redirectTunnel, metadata?.domains || [])) {
      platformOrPublisherScore = 15;
      explanationPoints.push('+15 Redirect domain differs from known official brand domains');
    }

    unofficialIdentityScore = 5;
    explanationPoints.push('+5 Entity is absent from the trusted asset registry');
  } else if (isMobileApp) {
    if (exactBrandTokenFound) {
      nameScore = 25;
      explanationPoints.push('+25 App title embeds protected brand identifier');
    } else if (nameSimilarity >= 70) {
      nameScore = Math.round((nameSimilarity / 100) * 23);
      explanationPoints.push(`+${nameScore} App-name resemblance (${nameSimilarity}%)`);
    }

    if (publisherMatch === 'MISMATCH') {
      platformOrPublisherScore = 20;
      explanationPoints.push(`+20 Publisher mismatch ("${publisher || 'Unknown'}")`);
    } else if (publisherMatch === 'UNKNOWN') {
      platformOrPublisherScore = 8;
      explanationPoints.push('+8 Publisher identity unavailable');
    }

    handleScore = (descriptionSimilarity ?? 0) >= 20
      ? Math.round(((descriptionSimilarity ?? 0) * 15) / 100)
      : 0;
    if (handleScore) explanationPoints.push(`+${handleScore} App description similarity (${descriptionSimilarity}%)`);

    if (packageMatch === 'MISMATCH' && (tokenHandle.exactBrandToken || toAlphaNumeric(candidate.handleOrPkg).includes(toAlphaNumeric(cleanBrand)))) {
      lookalikeScore = 10;
      explanationPoints.push('+10 Package identifier resembles the brand but is not in the trusted package registry');
    }

    if (suspiciousModifiersFound.length) {
      wordingScore = Math.min(10, suspiciousModifiersFound.length * 5);
      explanationPoints.push(`+${wordingScore} Suspicious listing terminology (${suspiciousModifiersFound.slice(0, 2).join(', ')})`);
    }

    unofficialIdentityScore = 5;
    explanationPoints.push('+5 Application is absent from the trusted asset registry');
  } else {
    if (exactBrandTokenFound) {
      nameScore = 30;
      explanationPoints.push('+30 Domain name contains full brand wordmark');
    } else {
      nameScore = Math.round((nameSimilarity / 100) * 25);
      if (nameScore) explanationPoints.push(`+${nameScore} Domain-name similarity (${nameSimilarity}%)`);
    }
    if (lookalikeSignals.length) {
      lookalikeScore = 20;
      explanationPoints.push('+20 Typosquatting / look-alike manipulation');
    }
    if (suspiciousModifiersFound.length) {
      wordingScore = 15;
      explanationPoints.push('+15 Phishing-lure keyword detected');
    }
    unofficialIdentityScore = 10;
    explanationPoints.push('+10 Domain is absent from the trusted registry');
  }

  if (visualComparison.status === 'available' && visualComparison.visualScore >= 75) {
    visualScore = Math.min(15, Math.round((visualComparison.visualScore / 100) * 15));
    explanationPoints.push(`+${visualScore} Visual logo resemblance (${visualComparison.visualScore}% deterministic match)`);
  }

  const rawScore = nameScore + handleScore + lookalikeScore + wordingScore + platformOrPublisherScore + unofficialIdentityScore + visualScore;
  const independentSignals = [lookalikeScore, wordingScore, platformOrPublisherScore, visualScore].filter((score) => score > 0).length;
  const calculatedScore = Math.min(isSocial && independentSignals < 2 ? 59 : 100, Math.max(0, rawScore));
  if (calculatedScore < rawScore) {
    explanationPoints.push('Social risk capped at 59: fewer than two independent suspicious signal families');
  }

  const category: DetectionAnalysis['category'] =
    calculatedScore >= 80 ? 'Critical' :
    calculatedScore >= 60 ? 'High' :
    calculatedScore >= 30 ? 'Medium' : 'Low';

  return {
    candidateId: candidate.id,
    nameSimilarity,
    handleSimilarity,
    descriptionSimilarity,
    visualSimilarity: visualComparison,
    publisherMatch,
    packageMatch,
    exactBrandTokenFound,
    matchedTokens,
    suspiciousModifiersFound,
    lookalikeSignals,
    hasSuspiciousUnicode: unicodeCheck.hasSuspiciousUnicode,
    isOfficialAssetMatch: false,
    calculatedScore,
    category,
    breakdown: {
      nameScore,
      handleScore,
      lookalikeScore,
      wordingScore,
      platformOrPublisherScore,
      unofficialIdentityScore,
      visualScore,
    },
    explanationPoints,
    whyThisMatters:
      calculatedScore >= 80
        ? 'Multiple independent signals indicate strong brand impersonation risk in this controlled prototype analysis.'
        : calculatedScore >= 60
        ? 'Several independent identity signals warrant expedited review.'
        : 'The candidate has some brand correlation but requires human review before escalation.',
  };
}

export function evaluateCandidate(
  brandQuery: string,
  candidate: CandidateEntity,
  verifiedAssets: VerifiedAsset[]
): ThreatItem {
  const analysis = calculateRisk(brandQuery, candidate, verifiedAssets);
  const explainableSignals: ThreatSignal[] = analysis.explanationPoints.map((point, index) => {
    let type: ThreatSignal['type'] = 'info';
    if (analysis.category === 'Trusted') type = 'safe';
    else if (index === 0) type = analysis.calculatedScore >= 80 ? 'critical' : 'high';
    else if (/look-alike|unicode|typo/i.test(point)) type = 'critical';
    else if (/terminology|publisher|redirect/i.test(point)) type = 'warning';

    return {
      label: point.replace(/^\+\d+\s*/, ''),
      icon: analysis.category === 'Trusted' ? 'verified' : /visual/i.test(point) ? 'image' : /package|publisher/i.test(point) ? 'apps' : 'analytics',
      score: parseInt(point.match(/^\+(\d+)/)?.[1] || '0', 10),
      desc: point,
      type,
    };
  });

  return {
    id: candidate.id,
    name: candidate.name,
    handleOrPkg: candidate.handleOrPkg,
    platform: candidate.platform,
    riskCategory: analysis.category,
    riskScore: analysis.calculatedScore,
    avatarType: candidate.avatarType,
    avatarBg: candidate.avatarBg,
    avatarText: candidate.avatarText,
    summary: candidate.summary,
    audience: candidate.audience,
    status: analysis.category === 'Trusted' ? 'marked_trusted' : 'active',
    dateDetected: candidate.dateDetected,
    explainableSignals,
    analysis,
    visualProfile: candidate.visualProfile,
    visual: candidate.visual,
    details: {
      ...candidate.details,
      homographEntropy: analysis.lookalikeSignals.length
        ? `${analysis.lookalikeSignals[0].technique} [Similarity ${analysis.nameSimilarity}%]`
        : candidate.details.homographEntropy,
    },
  };
}

export function runBrandDetection(
  brandQuery: string,
  allCandidates: CandidateEntity[],
  verifiedAssets: VerifiedAsset[]
): ThreatItem[] {
  if (!brandQuery.trim()) return [];
  return allCandidates
    .filter((candidate) => isCandidateRelevant(brandQuery, candidate))
    .map((candidate) => evaluateCandidate(brandQuery, candidate, verifiedAssets))
    .sort((a, b) => b.riskScore - a.riskScore);
}
