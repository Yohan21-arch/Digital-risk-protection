import {
  CandidateEntity,
  DetectionAnalysis,
  LookalikeSignal,
  ThreatItem,
  ThreatSignal,
  VerifiedAsset,
} from '../types';

/**
 * Common high-risk or suspicious modifiers used in brand spoofing
 */
export const SUSPICIOUS_MODIFIERS: string[] = [
  'official',
  'support',
  'help',
  'helpdesk',
  'customer care',
  'customer service',
  'verify',
  'verification',
  'kyc',
  'secure',
  'security',
  'cashback',
  'reward',
  'rewards',
  'bonus',
  'claim',
  'wallet',
  'service',
  'india',
  'account',
  'direct',
  'login',
  'portal',
  'fastloan',
  'desk',
];

/**
 * Common character lookalike pairs used in typo-squatting and impersonation
 */
const LOOKALIKE_MAP: Record<string, string> = {
  '0': 'o',
  '1': 'i',
  '|': 'l',
  '!': 'i',
  '@': 'a',
  $: 's',
  '3': 'e',
  '5': 's',
  '8': 'b',
};

/**
 * 1. STRING NORMALIZATION
 * Cleans string, lowercases, removes excessive punctuation, collapses spaces.
 */
export function normalizeIdentity(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^\w\s.-]/g, ' ')
    .replace(/[\s_-]+/g, ' ')
    .trim();
}

/**
 * Punctuation-free alphanumeric form for direct token and distance analysis
 */
export function toAlphaNumeric(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

/**
 * 2. LEVENSHTEIN DISTANCE
 * Standard dynamic programming implementation.
 */
export function levenshteinDistance(a: string, b: string): number {
  const s1 = a || '';
  const s2 = b || '';
  const m = s1.length;
  const n = s2.length;

  if (m === 0) return n;
  if (n === 0) return m;

  // Use two rows for memory efficiency
  let prevRow = new Array(n + 1);
  let currRow = new Array(n + 1);

  for (let j = 0; j <= n; j++) {
    prevRow[j] = j;
  }

  for (let i = 1; i <= m; i++) {
    currRow[0] = i;
    const charA = s1.charCodeAt(i - 1);

    for (let j = 1; j <= n; j++) {
      const charB = s2.charCodeAt(j - 1);
      const cost = charA === charB ? 0 : 1;
      currRow[j] = Math.min(
        currRow[j - 1] + 1, // insertion
        prevRow[j] + 1, // deletion
        prevRow[j - 1] + cost // substitution
      );
    }

    // Swap rows
    const temp = prevRow;
    prevRow = currRow;
    currRow = temp;
  }

  return prevRow[n];
}

/**
 * Calculates similarity percentage between 0 and 100 based on Levenshtein distance
 */
export function similarityPercent(a: string, b: string): number {
  const normA = toAlphaNumeric(a);
  const normB = toAlphaNumeric(b);

  if (!normA && !normB) return 100;
  if (!normA || !normB) return 0;
  if (normA === normB) return 100;

  const maxLen = Math.max(normA.length, normB.length);
  if (maxLen === 0) return 100;

  const dist = levenshteinDistance(normA, normB);
  const score = Math.round((1 - dist / maxLen) * 100);
  return Math.max(0, Math.min(100, score));
}

/**
 * 3. TOKEN-BASED SIMILARITY
 * Checks if target brand token appears cleanly in the target text.
 */
export function checkTokenMatch(
  brandQuery: string,
  targetText: string
): {
  exactBrandToken: boolean;
  tokenSimilarity: number;
  matchedTokens: string[];
} {
  const normBrand = toAlphaNumeric(brandQuery);
  if (!normBrand) {
    return { exactBrandToken: false, tokenSimilarity: 0, matchedTokens: [] };
  }

  const rawNormalized = normalizeIdentity(targetText);
  const tokens = rawNormalized.split(/\s+/).filter(Boolean);
  const matchedTokens: string[] = [];

  let exactFound = false;
  let highestSimilarity = 0;

  for (const token of tokens) {
    const cleanTok = toAlphaNumeric(token);
    if (cleanTok === normBrand) {
      exactFound = true;
      matchedTokens.push(token);
      highestSimilarity = 100;
    } else {
      const sim = similarityPercent(normBrand, cleanTok);
      if (sim > highestSimilarity) {
        highestSimilarity = sim;
      }
      if (sim >= 80) {
        matchedTokens.push(token);
      }
    }
  }

  // Also check if raw string directly contains the continuous brand string
  const continuousTarget = toAlphaNumeric(targetText);
  if (continuousTarget.includes(normBrand)) {
    exactFound = true;
    highestSimilarity = 100;
  }

  return {
    exactBrandToken: exactFound,
    tokenSimilarity: highestSimilarity,
    matchedTokens,
  };
}

/**
 * 4. SUSPICIOUS MODIFIER DETECTION
 * Identifies contextual words such as 'support', 'verify', 'rewards', etc.
 */
export function findSuspiciousModifiers(text: string): string[] {
  const normalized = normalizeIdentity(text);
  const found: string[] = [];

  for (const mod of SUSPICIOUS_MODIFIERS) {
    // Check whole word boundary
    const regex = new RegExp(`\\b${mod}\\b`, 'i');
    if (regex.test(normalized)) {
      found.push(mod);
    }
  }

  return found;
}

/**
 * 5. CHARACTER SUBSTITUTION / LOOKALIKE DETECTION
 * Detects leetspeak substitutions (o -> 0, i -> 1), char duplication (paytmm),
 * missing chars, hyphens, and inserted spaces.
 */
export function detectLookalikeTechniques(
  brandQuery: string,
  candidateName: string,
  candidateHandle: string
): LookalikeSignal[] {
  const signals: LookalikeSignal[] = [];
  const targetBrandAlpha = toAlphaNumeric(brandQuery);
  const targetBrand = brandQuery.toLowerCase().trim();

  const combinedCandidate = `${candidateName} ${candidateHandle}`.toLowerCase();
  const candidateAlphaTokens = normalizeIdentity(`${candidateName} ${candidateHandle}`)
    .split(/\s+/)
    .map(toAlphaNumeric)
    .filter(Boolean);

  // Check character substitutions (e.g., o -> 0, i -> 1, s -> $)
  for (const token of candidateAlphaTokens) {
    // Attempt reverse translation from leetspeak to letters
    let translated = '';
    const replacementsFound: { original: string; replacement: string }[] = [];

    for (const char of token) {
      if (LOOKALIKE_MAP[char]) {
        replacementsFound.push({ original: LOOKALIKE_MAP[char], replacement: char });
        translated += LOOKALIKE_MAP[char];
      } else {
        translated += char;
      }
    }

    if (replacementsFound.length > 0 && translated.includes(targetBrandAlpha)) {
      for (const rep of replacementsFound) {
        signals.push({
          detected: true,
          technique: 'Character substitution (Leetspeak)',
          original: rep.original,
          replacement: rep.replacement,
          details: `Replaced letter "${rep.original}" with look-alike "${rep.replacement}" in "${token}"`,
        });
      }
    }

    // Check duplicated characters (e.g. paytmm, nikee, phonepp)
    if (token.length === targetBrandAlpha.length + 1 && token.startsWith(targetBrandAlpha)) {
      const extraChar = token[token.length - 1];
      signals.push({
        detected: true,
        technique: 'Repeated character duplication',
        original: targetBrandAlpha,
        replacement: token,
        details: `Appended duplicated character "${extraChar}" at the end of brand name`,
      });
    }

    // Check missing characters (e.g. instgram)
    if (
      targetBrandAlpha.length >= 5 &&
      token.length === targetBrandAlpha.length - 1 &&
      similarityPercent(targetBrandAlpha, token) >= 80
    ) {
      signals.push({
        detected: true,
        technique: 'Omission / Typo manipulation',
        original: targetBrandAlpha,
        replacement: token,
        details: `Omitted character to exploit user typing slips ("${token}" vs "${targetBrandAlpha}")`,
      });
    }
  }

  // Check inserted separators or spaces (e.g. "phone-pe" or "phone pe")
  if (targetBrandAlpha.length >= 6) {
    const half1 = targetBrandAlpha.slice(0, Math.floor(targetBrandAlpha.length / 2));
    const half2 = targetBrandAlpha.slice(Math.floor(targetBrandAlpha.length / 2));
    if (
      combinedCandidate.includes(`${half1} `) ||
      combinedCandidate.includes(`${half1}-`) ||
      combinedCandidate.includes(`${half1}_`)
    ) {
      signals.push({
        detected: true,
        technique: 'Delimiter insertion',
        original: targetBrandAlpha,
        replacement: `${half1}-${half2}`,
        details: `Inserted space or hyphen separator inside brand token`,
      });
    }
  }

  return signals;
}

/**
 * 6. UNICODE / HOMOGRAPH CHECK
 * Flags mixed scripts or non-ASCII lookalikes (e.g., Cyrillic 'а', Greek 'о').
 */
export function detectSuspiciousUnicode(text: string): {
  hasSuspiciousUnicode: boolean;
  suspiciousChars: string[];
} {
  const suspiciousChars: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    // Non-ASCII characters that mimic Latin letters (Cyrillic U+0400 to U+04FF, etc.)
    if (code >= 0x0400 && code <= 0x04ff) {
      suspiciousChars.push(text[i]);
    } else if (code >= 0x0370 && code <= 0x03ff) {
      suspiciousChars.push(text[i]);
    }
  }

  return {
    hasSuspiciousUnicode: suspiciousChars.length > 0,
    suspiciousChars,
  };
}

/**
 * 7. OFFICIAL-ASSET EXCLUSION
 * Checks whether candidate matches an existing authentic safe harbor asset.
 */
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

    return (
      (assetId && (assetId === candidateHandle || candidateHandle.includes(assetId))) ||
      (assetName && assetName === candidateName)
    );
  });
}

/**
 * RELEVANCE CHECK (PART J)
 * Filters out candidates that are completely unrelated to the searched brand.
 * e.g., Searching "Nike" will never return "Amazon Rewards" or "Paytm".
 */
export function isCandidateRelevant(
  brandQuery: string,
  candidate: CandidateEntity
): boolean {
  if (!brandQuery || !candidate) return false;

  const cleanBrand = toAlphaNumeric(brandQuery);
  if (!cleanBrand || cleanBrand.length < 2) return false;

  // Direct targetBrand match (if tagged in prototype dataset)
  if (candidate.targetBrand && toAlphaNumeric(candidate.targetBrand) === cleanBrand) {
    return true;
  }

  // Token match
  const tokenMatchName = checkTokenMatch(brandQuery, candidate.name);
  const tokenMatchHandle = checkTokenMatch(brandQuery, candidate.handleOrPkg);
  if (tokenMatchName.exactBrandToken || tokenMatchHandle.exactBrandToken) {
    return true;
  }

  // Levenshtein similarity on tokens
  const nameSim = similarityPercent(cleanBrand, toAlphaNumeric(candidate.name));
  const handleSim = similarityPercent(cleanBrand, toAlphaNumeric(candidate.handleOrPkg));
  if (nameSim >= 65 || handleSim >= 65) {
    return true;
  }

  // Lookalike signal test
  const lookalike = detectLookalikeTechniques(brandQuery, candidate.name, candidate.handleOrPkg);
  if (lookalike.length > 0) {
    return true;
  }

  return false;
}

/**
 * 8. REAL DETERMINISTIC RISK CALCULATION & EXPLAINABLE SIGNALS (PART H & I)
 */
export function calculateRisk(
  brandQuery: string,
  candidate: CandidateEntity,
  verifiedAssets: VerifiedAsset[]
): DetectionAnalysis {
  // Check official asset match first
  const isOfficialMatch = checkOfficialAssetMatch(candidate, verifiedAssets);

  if (isOfficialMatch) {
    return {
      candidateId: candidate.id,
      nameSimilarity: 100,
      handleSimilarity: 100,
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
      },
      explanationPoints: [
        'Verified Official Safe Harbor Anchor registered in brand defense registry',
        'Cryptographically matched corporate identity',
      ],
      whyThisMatters:
        'This identity matches an authentic, legally authorized corporate asset. It is exempt from automated enforcement.',
    };
  }

  // Run feature extractors
  const cleanBrand = brandQuery.trim();
  const nameSimilarity = similarityPercent(cleanBrand, candidate.name);
  const handleSimilarity = similarityPercent(cleanBrand, candidate.handleOrPkg);

  const tokenAnalysisName = checkTokenMatch(cleanBrand, candidate.name);
  const tokenAnalysisHandle = checkTokenMatch(cleanBrand, candidate.handleOrPkg);
  const exactBrandTokenFound =
    tokenAnalysisName.exactBrandToken || tokenAnalysisHandle.exactBrandToken;

  const matchedTokens = Array.from(
    new Set([...tokenAnalysisName.matchedTokens, ...tokenAnalysisHandle.matchedTokens])
  );

  const suspiciousModifiersFound = findSuspiciousModifiers(
    `${candidate.name} ${candidate.handleOrPkg} ${candidate.summary}`
  );

  const lookalikeSignals = detectLookalikeTechniques(
    cleanBrand,
    candidate.name,
    candidate.handleOrPkg
  );

  const unicodeCheck = detectSuspiciousUnicode(`${candidate.name} ${candidate.handleOrPkg}`);

  const isSocial =
    candidate.platform === 'Instagram' ||
    candidate.platform === 'X' ||
    candidate.platform === 'Facebook' ||
    candidate.platform === 'Telegram';

  const isMobileApp =
    candidate.platform === 'Google Play' || candidate.platform === 'App Store';

  // Scoring weights per category
  let nameScore = 0;
  let handleScore = 0;
  let lookalikeScore = 0;
  let wordingScore = 0;
  let platformOrPublisherScore = 0;
  let unofficialIdentityScore = 0;

  const explanationPoints: string[] = [];

  if (isSocial) {
    // 1. Brand / Name similarity (max 25)
    if (exactBrandTokenFound) {
      nameScore = 25;
      explanationPoints.push(`+25 Brand name closely resembles official protected identity`);
    } else if (nameSimilarity >= 80) {
      nameScore = Math.round((nameSimilarity / 100) * 24);
      explanationPoints.push(`+${nameScore} High name similarity (${nameSimilarity}%)`);
    } else if (nameSimilarity >= 60) {
      nameScore = Math.round((nameSimilarity / 100) * 18);
      explanationPoints.push(`+${nameScore} Moderate name similarity (${nameSimilarity}%)`);
    }

    // 2. Username / Handle similarity (max 20)
    if (tokenAnalysisHandle.exactBrandToken) {
      handleScore = 20;
      explanationPoints.push(`+20 Username handle directly embeds protected brand token`);
    } else if (handleSimilarity >= 75) {
      handleScore = Math.round((handleSimilarity / 100) * 18);
      explanationPoints.push(`+${handleScore} Username resembles official account`);
    }

    // 3. Lookalike manipulation (max 15)
    if (lookalikeSignals.length > 0) {
      lookalikeScore = Math.min(15, lookalikeSignals.length * 8 + 7);
      const rep = lookalikeSignals[0];
      explanationPoints.push(
        `+${lookalikeScore} ${rep.technique}: "${rep.original}" → "${rep.replacement}"`
      );
    } else if (unicodeCheck.hasSuspiciousUnicode) {
      lookalikeScore = 12;
      explanationPoints.push(`+12 Non-standard cross-script Unicode characters detected`);
    }

    // 4. Suspicious wording / modifiers (max 10)
    if (suspiciousModifiersFound.length > 0) {
      wordingScore = Math.min(10, suspiciousModifiersFound.length * 5);
      explanationPoints.push(
        `+${wordingScore} High-risk modifier terminology (${suspiciousModifiersFound.slice(0, 3).join(', ')})`
      );
    }

    // 5. Platform / domain mismatch (max 15)
    if (candidate.details?.redirectTunnel || candidate.details?.registrar) {
      platformOrPublisherScore = 12;
      explanationPoints.push(`+12 Discrepant network infrastructure attribution`);
    } else {
      platformOrPublisherScore = 10;
      explanationPoints.push(`+10 Unaffiliated account host`);
    }

    // 6. Unofficial identity (max 15)
    unofficialIdentityScore = 15;
    explanationPoints.push(`+15 Entity is absent from brand's verified asset registry`);
  } else if (isMobileApp) {
    // MOBILE APP ENGINE
    // 1. App-name similarity (max 30)
    if (exactBrandTokenFound) {
      nameScore = 30;
      explanationPoints.push(`+30 App title embeds protected trademark identifier`);
    } else if (nameSimilarity >= 70) {
      nameScore = Math.round((nameSimilarity / 100) * 28);
      explanationPoints.push(`+${nameScore} App name high resemblance (${nameSimilarity}%)`);
    }

    // 2. Publisher mismatch (max 25)
    const publisher = candidate.details?.publisher || candidate.publisher || '';
    if (publisher && !publisher.toLowerCase().includes(cleanBrand.toLowerCase())) {
      platformOrPublisherScore = 25;
      explanationPoints.push(`+25 Third-party unauthorized publisher ("${publisher}")`);
    } else {
      platformOrPublisherScore = 15;
      explanationPoints.push(`+15 Unverified developer identity`);
    }

    // 3. Description / vector similarity (max 15)
    handleScore = 12;
    explanationPoints.push(`+12 Look-alike app description and deceptive keywords`);

    // 4. Package / bundle similarity (max 10)
    if (tokenAnalysisHandle.exactBrandToken || candidate.handleOrPkg.includes(toAlphaNumeric(cleanBrand))) {
      lookalikeScore = 10;
      explanationPoints.push(`+10 Package bundle claims official brand namespace`);
    }

    // 5. Suspicious modifiers (max 10)
    if (suspiciousModifiersFound.length > 0) {
      wordingScore = Math.min(10, suspiciousModifiersFound.length * 5);
      explanationPoints.push(
        `+${wordingScore} Predatory terminology in listing (${suspiciousModifiersFound.slice(0, 2).join(', ')})`
      );
    }

    // 6. Unofficial identity (max 10)
    unofficialIdentityScore = 10;
    explanationPoints.push(`+10 Application missing official cryptographic signature`);
  } else {
    // WEB DOMAIN & OTHER
    if (exactBrandTokenFound) {
      nameScore = 30;
      explanationPoints.push(`+30 Domain name contains full brand wordmark`);
    } else {
      nameScore = Math.round((nameSimilarity / 100) * 25);
      explanationPoints.push(`+${nameScore} Domain name similarity (${nameSimilarity}%)`);
    }

    if (lookalikeSignals.length > 0) {
      lookalikeScore = 20;
      explanationPoints.push(`+20 Typosquatting / Look-alike character manipulation`);
    }

    if (suspiciousModifiersFound.length > 0) {
      wordingScore = 15;
      explanationPoints.push(`+15 Phishing lure keyword in URL path`);
    }

    platformOrPublisherScore = 15;
    explanationPoints.push(`+15 Bulletproof or privacy-shielded registrar`);

    unofficialIdentityScore = 15;
    explanationPoints.push(`+15 Unverified DNS endpoint without brand DKIM/SPF`);
  }

  // Sum total score, capped at 100
  const rawScore =
    nameScore +
    handleScore +
    lookalikeScore +
    wordingScore +
    platformOrPublisherScore +
    unofficialIdentityScore;

  const calculatedScore = Math.min(100, Math.max(0, rawScore));

  // Determine category
  let category: 'Critical' | 'High' | 'Medium' | 'Low' | 'Trusted' = 'Low';
  if (calculatedScore >= 80) {
    category = 'Critical';
  } else if (calculatedScore >= 60) {
    category = 'High';
  } else if (calculatedScore >= 30) {
    category = 'Medium';
  } else {
    category = 'Low';
  }

  const whyThisMatters =
    calculatedScore >= 80
      ? 'The detected entity closely mimics the protected organization’s public identity while lacking official ownership verification, presenting high risk of customer deceit or credential theft.'
      : calculatedScore >= 60
      ? 'Significant trademark and semantic similarity detected without authorized corporate credentials. Recommended for expedited investigation.'
      : 'Moderate brand correlation detected; entity may be an informal fan community or unauthorized reseller.';

  return {
    candidateId: candidate.id,
    nameSimilarity,
    handleSimilarity,
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
    },
    explanationPoints,
    whyThisMatters,
  };
}

/**
 * Transforms a raw CandidateEntity into a full ThreatItem using deterministic detection
 */
export function evaluateCandidate(
  brandQuery: string,
  candidate: CandidateEntity,
  verifiedAssets: VerifiedAsset[]
): ThreatItem {
  const analysis = calculateRisk(brandQuery, candidate, verifiedAssets);

  // Map explainable signals
  const explainableSignals: ThreatSignal[] = analysis.explanationPoints.map(
    (point, idx) => {
      let type: 'critical' | 'high' | 'warning' | 'info' | 'safe' = 'warning';
      if (analysis.category === 'Trusted') {
        type = 'safe';
      } else if (idx === 0) {
        type = analysis.calculatedScore >= 80 ? 'critical' : 'high';
      } else if (point.includes('Lookalike') || point.includes('substitution')) {
        type = 'critical';
      } else if (point.includes('modifier') || point.includes('Terminology')) {
        type = 'warning';
      } else {
        type = 'info';
      }

      return {
        label: point.replace(/^\+\d+\s*/, ''),
        icon:
          analysis.category === 'Trusted'
            ? 'verified'
            : point.includes('resembles') || point.includes('trademark')
            ? 'badge'
            : point.includes('substitution') || point.includes('manipulation')
            ? 'pattern'
            : point.includes('modifier') || point.includes('Terminology')
            ? 'warning'
            : 'gavel',
        score: parseInt(point.match(/^\+(\d+)/)?.[1] || '10', 10),
        desc: point,
        type,
      };
    }
  );

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
    details: {
      ...candidate.details,
      homographEntropy:
        analysis.lookalikeSignals.length > 0
          ? `${analysis.lookalikeSignals[0].technique} [Entropy ${analysis.nameSimilarity}%]`
          : candidate.details.homographEntropy,
    },
  };
}

/**
 * Searches and evaluates candidate entities for the requested brand query
 */
export function runBrandDetection(
  brandQuery: string,
  allCandidates: CandidateEntity[],
  verifiedAssets: VerifiedAsset[]
): ThreatItem[] {
  if (!brandQuery || !brandQuery.trim()) {
    return [];
  }

  // 1. Filter candidates relevant to the searched brand
  const relevantCandidates = allCandidates.filter((candidate) =>
    isCandidateRelevant(brandQuery, candidate)
  );

  // 2. Deterministically evaluate each relevant candidate
  const results = relevantCandidates.map((c) =>
    evaluateCandidate(brandQuery, c, verifiedAssets)
  );

  // 3. Sort by risk score descending (Critical & High first, Trusted at the bottom or top depending on view)
  return results.sort((a, b) => b.riskScore - a.riskScore);
}
