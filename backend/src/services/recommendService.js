import { SchemeModel } from '../models/db.js';

// Weighted scoring for recommendation
const WEIGHT_MAP = {
  age: 15,
  income: 20,
  gender: 10,
  caste: 15,
  occupation: 15,
  education: 10,
  state: 10,
  rural: 5
};

function calculateMatchScore(scheme, profile) {
  let score = 0;
  let maxScore = 0;
  const e = scheme.eligibility;

  // Age match
  if (profile.age) {
    maxScore += WEIGHT_MAP.age;
    if (profile.age >= e.minAge && profile.age <= e.maxAge) {
      score += WEIGHT_MAP.age;
    }
  }

  // Income match
  if (profile.income !== undefined) {
    maxScore += WEIGHT_MAP.income;
    if (profile.income <= e.maxIncome) {
      // Closer to threshold = higher relevance
      const ratio = profile.income / e.maxIncome;
      score += WEIGHT_MAP.income * (ratio > 0.5 ? 1 : 0.8);
    }
  }

  // Gender match
  if (profile.gender) {
    maxScore += WEIGHT_MAP.gender;
    if (e.gender.includes(profile.gender) || e.gender.includes('Other')) {
      score += WEIGHT_MAP.gender;
    }
  }

  // Caste match
  if (profile.caste) {
    maxScore += WEIGHT_MAP.caste;
    if (e.caste.includes(profile.caste)) {
      score += WEIGHT_MAP.caste;
      // Extra points for targeted schemes
      if (e.caste.length <= 2) score += 5;
    }
  }

  // Occupation match
  if (profile.occupation) {
    maxScore += WEIGHT_MAP.occupation;
    if (e.occupation.includes('Any') || e.occupation.includes(profile.occupation)) {
      score += WEIGHT_MAP.occupation;
      if (!e.occupation.includes('Any')) score += 5; // Bonus for targeted
    }
  }

  // Education match
  if (profile.education) {
    maxScore += WEIGHT_MAP.education;
    if (e.education.includes('Any') || e.education.includes(profile.education)) {
      score += WEIGHT_MAP.education;
    }
  }

  // State match
  if (profile.state) {
    maxScore += WEIGHT_MAP.state;
    if (e.states.includes('All') || e.states.map(s => s.toLowerCase()).includes(profile.state.toLowerCase())) {
      score += WEIGHT_MAP.state;
      if (!e.states.includes('All')) score += 10; // Bonus for state-specific
    }
  }

  // Rural match
  maxScore += WEIGHT_MAP.rural;
  if (e.isRural && profile.isRural) {
    score += WEIGHT_MAP.rural + 5; // Bonus
  } else if (!e.isRural) {
    score += WEIGHT_MAP.rural;
  }

  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  return Math.min(percentage, 100);
}

function generateReasonText(scheme, profile) {
  const reasons = [];
  const e = scheme.eligibility;

  if (profile.occupation && (e.occupation.includes(profile.occupation) || e.occupation.includes('Any'))) {
    if (!e.occupation.includes('Any')) {
      reasons.push(`Specifically designed for ${profile.occupation}s`);
    }
  }

  if (profile.state && !e.states.includes('All') && e.states.map(s => s.toLowerCase()).includes(profile.state.toLowerCase())) {
    reasons.push(`Available in your state (${profile.state})`);
  }

  if (profile.caste && e.caste.length <= 2 && e.caste.includes(profile.caste)) {
    reasons.push(`Targeted for ${profile.caste} category`);
  }

  if (profile.gender === 'Female' && !e.gender.includes('Male')) {
    reasons.push('Exclusively for women beneficiaries');
  }

  if (e.isBPL && profile.isBPL) {
    reasons.push('Available for BPL families');
  }

  if (e.isRural && profile.isRural) {
    reasons.push('Designed for rural households');
  }

  if (profile.income && profile.income <= e.maxIncome) {
    reasons.push(`Your income qualifies (limit: ₹${(e.maxIncome / 100000).toFixed(1)}L)`);
  }

  if (reasons.length === 0) {
    reasons.push('Matches your overall profile');
  }

  return reasons;
}

export function getRecommendations(profile) {
  // Step 1: Get all eligible schemes
  const eligible = SchemeModel.findEligible(profile);

  // Step 2: Score and rank
  const scored = eligible.map(scheme => ({
    ...scheme,
    matchScore: calculateMatchScore(scheme, profile),
    matchReasons: generateReasonText(scheme, profile)
  }));

  // Step 3: Sort by score (descending)
  scored.sort((a, b) => b.matchScore - a.matchScore);

  return scored;
}

export function getQuickEligibility(profile) {
  const eligible = SchemeModel.findEligible(profile);
  return {
    totalEligible: eligible.length,
    categories: [...new Set(eligible.map(s => s.category))],
    topSchemes: eligible.slice(0, 5).map(s => ({
      id: s.id,
      name: s.name,
      category: s.category,
      benefits: s.benefits
    }))
  };
}
