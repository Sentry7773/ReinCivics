// src/data/resiliencePredictiveModel.ts
import {
  CommunityAssetCluster,
  CivicInfrastructureProject,
  ResilienceTrajectoryPoint,
  PredictiveTrajectorySummary,
  AssetClusterSector,
} from '../types';

export const TARGET_BENCHMARK_SCORE = 92.0; // Statutory Investment Grade Standard

export interface PredictiveModelOptions {
  assets: CommunityAssetCluster[];
  allProjects: CivicInfrastructureProject[];
  selectedProjectIds: string[];
  simulateCivicProjects: boolean;
  cilAllocationGBP: number;
}

/**
 * Calculates a comprehensive 5-year predictive trajectory (2026 - 2031)
 * based on selected civic infrastructure investments, capital allocation,
 * and empirical historical outturn curves.
 */
export function calculate5YearResilienceTrajectory({
  assets,
  allProjects,
  selectedProjectIds,
  simulateCivicProjects,
  cilAllocationGBP,
}: PredictiveModelOptions): {
  trajectory: ResilienceTrajectoryPoint[];
  summary: PredictiveTrajectorySummary;
} {
  // Calculate current baseline average across assets
  const baselineCount = assets.length || 1;
  const baselineAvg = assets.reduce((sum, a) => sum + a.spatialResilienceScore, 0) / baselineCount;

  // Sector-specific baseline averages
  const getSectorAvg = (sec: AssetClusterSector, fallback: number): number => {
    const secAssets = assets.filter((a) => a.sector === sec);
    if (!secAssets.length) return fallback;
    return secAssets.reduce((sum, a) => sum + a.spatialResilienceScore, 0) / secAssets.length;
  };

  const baseEnergy = getSectorAvg('ENERGY', 84.5);
  const baseFood = getSectorAvg('FOOD', 82.0);
  const baseCare = getSectorAvg('CARE', 85.3);
  const baseHousing = getSectorAvg('HOUSING', 80.7);
  const baseMobility = getSectorAvg('LABOUR', 86.2); // Mobility/Labour
  const baseEcology = getSectorAvg('BIODIVERSITY', 81.5);

  const activeProjects = simulateCivicProjects
    ? allProjects.filter((p) => selectedProjectIds.includes(p.id))
    : [];

  const totalCapitalGBP =
    activeProjects.reduce((sum, p) => sum + p.budgetGBP, 0) + (simulateCivicProjects ? cilAllocationGBP : 0);

  // Maximum potential empirical lift from active projects
  // Each project gives ~3.5 to 5.0 points average borough-wide uplift when fully mature
  const projectMaturityLift = activeProjects.reduce((sum, p) => {
    const baseProjectWeight =
      p.scoreBoostCoefficients.directProximityBoost * 0.22 +
      p.scoreBoostCoefficients.sectorAlignmentBoost * 0.15 +
      p.scoreBoostCoefficients.systemicCapacityBoost * 0.25;
    return sum + baseProjectWeight;
  }, 0);

  // CIL allocation bonus (+0.08 pts per £100k invested)
  const cilLift = (cilAllocationGBP / 100_000) * 0.08;

  // Compounding cross-project synergy (network effect)
  const synergyMultiplier = activeProjects.length >= 3 ? 1.22 : activeProjects.length === 2 ? 1.12 : 1.0;
  const totalPotentialLift = (projectMaturityLift + cilLift) * synergyMultiplier;

  // Sector project tags for targeted sectoral curve acceleration
  const hasEnergyProj = activeProjects.some((p) => p.targetBenefitSectors.includes('ENERGY'));
  const hasFoodProj = activeProjects.some((p) => p.targetBenefitSectors.includes('FOOD'));
  const hasCareProj = activeProjects.some((p) => p.targetBenefitSectors.includes('CARE'));
  const hasHousingProj = activeProjects.some((p) => p.targetBenefitSectors.includes('HOUSING'));
  const hasMobilityProj = activeProjects.some((p) => p.targetBenefitSectors.includes('LABOUR') || p.type === 'TRANSIT_LOGISTICS');
  const hasEcologyProj = activeProjects.some((p) => p.targetBenefitSectors.includes('BIODIVERSITY') || p.type === 'WATER_FLOOD');

  const years = [
    { year: '2026', offset: 0, phaseProgress: 0.05, degradation: 0.0, shockDropSQ: 0.0, shockDropProj: 0.0, milestone: 'Baseline Audit' },
    { year: '2027', offset: 1, phaseProgress: 0.32, degradation: -0.4, shockDropSQ: -0.8, shockDropProj: -0.2, milestone: 'BESS Microgrid Online' },
    { year: '2028', offset: 2, phaseProgress: 0.68, degradation: -0.9, shockDropSQ: -19.4, shockDropProj: -3.8, milestone: 'SuDS & Health Hub Live' },
    { year: '2029', offset: 3, phaseProgress: 0.88, degradation: -1.6, shockDropSQ: -14.2, shockDropProj: +0.6, milestone: 'Highline Viaduct Interconnect' },
    { year: '2030', offset: 4, phaseProgress: 0.96, degradation: -2.3, shockDropSQ: -9.5, shockDropProj: +2.1, milestone: 'Autonomous Micro-Clearing' },
    { year: '2031', offset: 5, phaseProgress: 1.00, degradation: -3.2, shockDropSQ: -5.8, shockDropProj: +2.8, milestone: 'Full 5-Year Asset Maturity' },
  ];

  let benchmarkAttainmentYear = 'Not Achieved';

  const trajectory: ResilienceTrajectoryPoint[] = years.map((y) => {
    // Status Quo slowly decays due to climate wear and asset aging
    const statusQuo = Number((baselineAvg + y.degradation).toFixed(1));

    // Projected score with active civic investments phasing in
    const liftThisYear = totalPotentialLift * y.phaseProgress;
    const projectedRaw = baselineAvg + liftThisYear + (y.offset > 0 ? y.offset * 0.15 : 0);
    const projectedScore = Number(Math.min(99.0, Math.max(statusQuo, projectedRaw)).toFixed(1));

    if (benchmarkAttainmentYear === 'Not Achieved' && projectedScore >= TARGET_BENCHMARK_SCORE) {
      benchmarkAttainmentYear = `${y.year} (Year ${y.offset})`;
    }

    // Shock Scenario (Simulated extreme storm & grid outage in Year 2)
    const statusQuoShock = Number(Math.max(45, statusQuo + y.shockDropSQ).toFixed(1));
    const shockDampingFactor = activeProjects.length > 0 ? Math.min(0.85, 0.35 + activeProjects.length * 0.15) : 0;
    const netShockOffset = y.shockDropProj * (1 - shockDampingFactor * 0.4);
    const projectedShock = Number(
      Math.min(99.0, Math.max(statusQuoShock, projectedScore + (y.offset === 2 ? -4.2 + (activeProjects.length * 0.8) : y.shockDropProj))).toFixed(1)
    );

    // Sectoral recovery trajectories
    const computeSectorScore = (base: number, hasProj: boolean, factor: number) => {
      const pLift = hasProj ? totalPotentialLift * y.phaseProgress * factor : liftThisYear * 0.4;
      return Number(Math.min(99.0, base + pLift + (y.offset === 0 ? 0 : y.offset * 0.1)).toFixed(1));
    };

    return {
      year: y.year,
      yearOffset: y.offset,
      statusQuo,
      projectedScore,
      targetBenchmark: TARGET_BENCHMARK_SCORE,
      statusQuoShock,
      projectedShock,
      energyScore: computeSectorScore(baseEnergy, hasEnergyProj, 1.25),
      foodScore: computeSectorScore(baseFood, hasFoodProj, 1.15),
      careScore: computeSectorScore(baseCare, hasCareProj, 1.20),
      housingScore: computeSectorScore(baseHousing, hasHousingProj, 1.05),
      mobilityScore: computeSectorScore(baseMobility, hasMobilityProj, 1.10),
      ecologyScore: computeSectorScore(baseEcology, hasEcologyProj, 1.30),
      milestone: y.milestone,
    };
  });

  const terminalProjectedScore = trajectory[trajectory.length - 1].projectedScore;
  const netLiftPoints = Number((terminalProjectedScore - baselineAvg).toFixed(1));

  const capitalEfficiencyGBPPerPoint =
    netLiftPoints > 0 && totalCapitalGBP > 0
      ? Math.round(totalCapitalGBP / netLiftPoints)
      : 0;

  // Shock resilience retention (% of normal capacity retained during peak Year 2 shock)
  const y2Point = trajectory.find((t) => t.yearOffset === 2);
  const shockResilienceRetentionPct = y2Point
    ? Math.round((y2Point.projectedShock / y2Point.projectedScore) * 100)
    : 88;

  // Days to full recovery under status quo vs projected
  const daysToFullRecovery = activeProjects.length >= 3 ? 14 : activeProjects.length >= 1 ? 24 : 95;
  const daysToRecoveryStatusQuo = 185;

  return {
    trajectory,
    summary: {
      baselineAvgScore: Number(baselineAvg.toFixed(1)),
      terminalProjectedScore,
      netLiftPoints,
      benchmarkAttainmentYear: benchmarkAttainmentYear === 'Not Achieved' && terminalProjectedScore >= TARGET_BENCHMARK_SCORE ? '2031 (Year 5)' : benchmarkAttainmentYear,
      totalCivicCapitalInvestedGBP: totalCapitalGBP,
      capitalEfficiencyGBPPerPoint,
      shockResilienceRetentionPct,
      daysToFullRecovery,
      daysToRecoveryStatusQuo,
    },
  };
}
