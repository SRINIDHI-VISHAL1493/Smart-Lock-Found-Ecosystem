// src/services/aiMatcher.js
// Modular AI Matching Engine with configurable weights
// Can be extended to use real ML providers (Google Vision, OpenAI, etc.)

// ─── Configurable Weights ──────────────────────────────────────
const MATCH_WEIGHTS = {
  imageSimilarity: 0.30,
  textSimilarity:  0.20,
  category:        0.10,
  brand:           0.10,
  color:           0.05,
  model:           0.05,
  location:        0.10,
  time:            0.10,
};

// ─── Text Similarity ──────────────────────────────────────────
function tokenize(text) {
  if (!text) return [];
  return text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2);
}

function cosineSimilarity(textA, textB) {
  const tokensA = tokenize(textA);
  const tokensB = tokenize(textB);
  if (!tokensA.length || !tokensB.length) return 0;

  const vocab = new Set([...tokensA, ...tokensB]);
  const vecA = {};
  const vecB = {};
  vocab.forEach(w => { vecA[w] = 0; vecB[w] = 0; });
  tokensA.forEach(w => vecA[w] = (vecA[w] || 0) + 1);
  tokensB.forEach(w => vecB[w] = (vecB[w] || 0) + 1);

  let dot = 0, magA = 0, magB = 0;
  vocab.forEach(w => {
    dot += vecA[w] * vecB[w];
    magA += vecA[w] ** 2;
    magB += vecB[w] ** 2;
  });
  if (!magA || !magB) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

// ─── Location Proximity ───────────────────────────────────────
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000; // meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function locationScore(locA, locB) {
  if (!locA?.lat || !locB?.lat) return 0.3; // Unknown = partial credit
  const dist = haversineDistance(locA.lat, locA.lng, locB.lat, locB.lng);
  if (dist <= 100) return 1.0;
  if (dist <= 500) return 0.8;
  if (dist <= 1000) return 0.6;
  if (dist <= 5000) return 0.4;
  if (dist <= 10000) return 0.2;
  return 0;
}

// ─── Time Scoring ─────────────────────────────────────────────
function timeScore(lostDate, foundDate) {
  if (!lostDate || !foundDate) return 0.5;
  const lost = new Date(lostDate).getTime();
  const found = new Date(foundDate).getTime();
  if (found < lost - 24 * 3600000) return 0; // Found before lost - impossible
  const diff = (found - lost) / (24 * 3600000); // days
  if (diff <= 1) return 1.0;
  if (diff <= 3) return 0.8;
  if (diff <= 7) return 0.6;
  if (diff <= 14) return 0.4;
  if (diff <= 30) return 0.2;
  return 0.1;
}

// ─── String Field Matching ────────────────────────────────────
function fieldMatch(a, b) {
  if (!a || !b) return 0;
  const normalize = s => s.toLowerCase().trim().replace(/\s+/g, ' ');
  const na = normalize(a);
  const nb = normalize(b);
  if (na === nb) return 1.0;
  if (na.includes(nb) || nb.includes(na)) return 0.7;
  // Check for partial overlap
  const wordsA = na.split(' ');
  const wordsB = nb.split(' ');
  const common = wordsA.filter(w => wordsB.includes(w));
  if (common.length > 0) return 0.4 * (common.length / Math.max(wordsA.length, wordsB.length));
  return 0;
}

// ─── Mock Image Similarity ────────────────────────────────────
// In production: replace with Google Vision API / image embedding comparison
function mockImageSimilarity(reportA, reportB) {
  // Use metadata as proxy: same category + brand + color = higher score
  let score = 0.1; // baseline
  if (reportA.category === reportB.category) score += 0.3;
  if (reportA.brand && reportB.brand && fieldMatch(reportA.brand, reportB.brand) > 0.5) score += 0.3;
  if (reportA.color && reportB.color && fieldMatch(reportA.color, reportB.color) > 0.5) score += 0.2;
  return Math.min(score, 1.0);
}

// ─── Main Matching Function ───────────────────────────────────
function computeMatch(lostReport, foundReport) {
  const scores = {};
  const reasons = [];

  // Category
  const categoryS = lostReport.category === foundReport.category ? 1.0 : 0;
  scores.category = categoryS;
  if (categoryS > 0.5) {
    reasons.push({ factor: 'category', score: Math.round(categoryS * MATCH_WEIGHTS.category * 100), label: `Same category (${lostReport.category})` });
  }

  // Brand
  const brandS = fieldMatch(lostReport.brand, foundReport.brand);
  scores.brand = brandS;
  if (brandS > 0.5) {
    reasons.push({ factor: 'brand', score: Math.round(brandS * MATCH_WEIGHTS.brand * 100), label: `Same brand (${lostReport.brand})` });
  }

  // Color
  const colorS = fieldMatch(lostReport.color, foundReport.color);
  scores.color = colorS;
  if (colorS > 0.4) {
    reasons.push({ factor: 'color', score: Math.round(colorS * MATCH_WEIGHTS.color * 100), label: `Similar color (${lostReport.color} / ${foundReport.color})` });
  }

  // Model
  const modelS = fieldMatch(lostReport.model, foundReport.model);
  scores.model = modelS;
  if (modelS > 0.5) {
    reasons.push({ factor: 'model', score: Math.round(modelS * MATCH_WEIGHTS.model * 100), label: `Same model (${lostReport.model})` });
  }

  // Text similarity (description + characteristics)
  const textA = `${lostReport.description || ''} ${lostReport.identifyingCharacteristics || ''}`;
  const textB = `${foundReport.description || ''} ${foundReport.identifyingCharacteristics || ''}`;
  const textS = cosineSimilarity(textA, textB);
  scores.textSimilarity = textS;
  if (textS > 0.15) {
    reasons.push({ factor: 'textSimilarity', score: Math.round(textS * MATCH_WEIGHTS.textSimilarity * 100), label: 'Similar description and characteristics' });
  }

  // Location
  const locS = locationScore(lostReport.location, foundReport.location);
  scores.location = locS;
  if (locS > 0.3) {
    const dist = (lostReport.location?.lat && foundReport.location?.lat)
      ? `~${Math.round(haversineDistance(lostReport.location.lat, lostReport.location.lng, foundReport.location.lat, foundReport.location.lng))}m apart`
      : 'similar area';
    reasons.push({ factor: 'location', score: Math.round(locS * MATCH_WEIGHTS.location * 100), label: `Nearby location (${dist})` });
  }

  // Time
  const timeS = timeScore(lostReport.dateOccurred, foundReport.dateOccurred);
  scores.time = timeS;
  if (timeS > 0.3) {
    reasons.push({ factor: 'time', score: Math.round(timeS * MATCH_WEIGHTS.time * 100), label: `Found within reasonable time after reported lost` });
  }

  // Image similarity (mock)
  const imgS = mockImageSimilarity(lostReport, foundReport);
  scores.imageSimilarity = imgS;
  if (imgS > 0.3) {
    reasons.push({ factor: 'imageSimilarity', score: Math.round(imgS * MATCH_WEIGHTS.imageSimilarity * 100), label: 'Similar item appearance' });
  }

  // Weighted confidence
  const confidence = Math.round(
    scores.imageSimilarity * MATCH_WEIGHTS.imageSimilarity * 100 +
    scores.textSimilarity  * MATCH_WEIGHTS.textSimilarity  * 100 +
    scores.category        * MATCH_WEIGHTS.category        * 100 +
    scores.brand           * MATCH_WEIGHTS.brand           * 100 +
    scores.color           * MATCH_WEIGHTS.color           * 100 +
    scores.model           * MATCH_WEIGHTS.model           * 100 +
    scores.location        * MATCH_WEIGHTS.location        * 100 +
    scores.time            * MATCH_WEIGHTS.time            * 100
  );

  return {
    confidence: Math.min(confidence, 100),
    scores,
    reasons: reasons.sort((a, b) => b.score - a.score),
    isMatch: confidence >= 40, // Threshold for creating a match
  };
}

// ─── Find Matches for a Report ────────────────────────────────
function findMatches(newReport, existingReports) {
  const oppositeType = newReport.type === 'lost' ? 'found' : 'lost';
  const candidates = existingReports.filter(r =>
    r.id !== newReport.id &&
    r.type === oppositeType &&
    r.status === 'active'
  );

  const results = [];
  for (const candidate of candidates) {
    const lostReport = newReport.type === 'lost' ? newReport : candidate;
    const foundReport = newReport.type === 'found' ? newReport : candidate;
    const result = computeMatch(lostReport, foundReport);
    if (result.isMatch) {
      results.push({
        reportId: candidate.id,
        report: candidate,
        ...result,
      });
    }
  }

  return results.sort((a, b) => b.confidence - a.confidence);
}

module.exports = { computeMatch, findMatches, MATCH_WEIGHTS };
