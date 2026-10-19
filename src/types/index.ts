// src/types/index.ts

export type GateCategory =
  | 'RegScan'
  | 'JurisActuary'
  | 'Economic'
  | 'Fairness'
  | 'Emergency'
  | 'Governance'
  | 'Operational'
  | 'Security'
  | 'Legal'
  | 'CommunityCredit'
  | 'AIGovernance'
  | 'LivingTreasury'
  | 'RunProtection'
  | 'Solidarity'
  | 'ESG'
  | 'B2G';

export type GateStatus = 'PASSED' | 'PENDING' | 'ACTION_REQUIRED' | 'BLOCKED';

export type ERLALevel = 'L1' | 'L2' | 'L3' | 'L4' | 'L5';

export interface Gate {
  id: string;
  code: string;
  name: string;
  category: GateCategory;
  phaseNumber: number;
  phaseName: string;
  status: GateStatus;
  erlaLevel: ERLALevel;
  statutoryCitation: string;
  evidenceHash: string;
  description: string;
  passCriteria: string;
  lastEvaluatedAt: string;
  evaluator: string;
}

export interface PhaseDeliverable {
  id: string;
  phaseNumber: number;
  phaseCode: string;
  phaseTitle: string;
  name: string;
  documentRef: string;
  statutoryBasis: string;
  status: 'CERTIFIED' | 'ANCHORED' | 'DEPLOYED' | 'OPERATIONAL' | 'RECONCILED';
  hash: string;
  summary: string;
  gateCodes: string[];
}

export interface Phase {
  number: number;
  code: string;
  name: string;
  gateCount: number;
  gateCodes: string[];
  deliverable: PhaseDeliverable;
  description: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'SCHEDULED';
}

export interface ArchitecturalInvariant {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  enforcementMechanism: string;
  verified: boolean;
}

export interface ReserveTranche {
  type: 'RESERVE_INSTANT' | 'RESERVE_MMF' | 'RESERVE_TBILL_3M' | 'RESERVE_TBILL_6M' | 'RESERVE_GILTS' | 'HARDSHIP_INSTANT' | 'HARDSHIP_MMF';
  name: string;
  balanceGBP: number;
  targetPercent: number;
  yieldBps: number;
  liquidityTier: 'T0 (Instant)' | 'T1 (Same Day)' | 'T+2 (3 Months)' | 'T+2 (6 Months)' | 'T+2 (1-3 Years)';
}

export interface YieldSweep {
  date: string;
  totalYieldGBP: number;
  deepReserveShareGBP: number; // 70%
  shockAbsorberShareGBP: number; // 30%
  status: 'DISTRIBUTED' | 'PENDING';
}

export interface AIPSConstraint {
  id: string;
  name: string;
  description: string;
  threshold: string;
  currentValue: string;
  isCompliant: boolean;
}

export interface SHAPFeature {
  feature: string;
  weight: number; // -1 to 1
  impact: 'POSITIVE' | 'NEGATIVE';
  description: string;
}

export interface CircuitBreakerTier {
  tier: 1 | 2 | 3 | 4;
  name: string;
  triggerCondition: string;
  actionTaken: string;
  approvalRequired: string;
  active: boolean;
  lastTriggered?: string;
}

export interface MultiSigRequest {
  id: string;
  actionType: 'TIER2_BATCH_CONVERSION' | 'TIER3_SYSTEMIC_COOLDOWN' | 'EMERGENCY_RESERVE_DRAWDOWN' | 'AIPS_POLICY_MODIFICATION';
  amountGBP: number;
  reason: string;
  initiator: string;
  requiredSignatures: number;
  signatures: {
    signerId: string;
    signerName: string;
    role: string;
    signed: boolean;
    signedAt?: string;
  }[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface PriorityQueueClaim {
  id: string;
  claimantId: string;
  claimantName: string;
  category: 'MEDICAL_PRESCRIPTION' | 'FOOD_ESSENTIAL' | 'EMERGENCY_UTILITY' | 'HOUSING_ARREARS' | 'GENERAL_HARDSHIP';
  requestedGBP: number;
  approvedGBP: number;
  equityScoreESCR: number; // 0.0 - 1.0
  urgencyRank: number;
  status: 'QUEUED' | 'PROCESSED' | 'REVIEW';
  submittedAt: string;
}

export interface SolidarityContribution {
  id: string;
  contributorName: string;
  contributorType: 'CITIZEN' | 'BUSINESS';
  amountGBP: number;
  shockAbsorberShare: number; // 60%
  enterpriseFundShare: number; // 40%
  tier: 'SEED' | 'PATRON' | 'PILLAR' | 'COMMONS_CHAMPION';
  timestamp: string;
  txHash: string;
}

export interface ESGCredential {
  id: string;
  businessName: string;
  companyNumber: string;
  totalSolidarityPledgedGBP: number;
  socialValueScore: number;
  procurementTier: 'TIER_A_STATUTORY_PREFERRED' | 'TIER_B_COMMUNITY_ACCREDITED';
  statutoryBasis: string;
  issuedDate: string;
  expiryDate: string;
  certificateHash: string;
}

export interface CouncilWardData {
  wardName: string;
  population: number;
  terScore: number; // Tail Equity Ratio <= 1.0 nominal
  hardshipDisbursedGBP: number;
  localMultiplier: number; // e.g. 1.68x
  anchorSpendPercent: number;
  status: 'EXEMPLARY' | 'MONITORED' | 'NEEDS_INTERVENTION';
}

export interface LegalDocument {
  id: string;
  number: string;
  title: string;
  category: 'GOVERNANCE' | 'COMPLIANCE' | 'OPERATIONS' | 'FINANCIAL' | 'EMERGENCY';
  statutoryAct: string;
  fcaMutualsStatus: 'REGISTERED' | 'CONFIRMED' | 'SUBMITTED';
  summary: string;
  keyClauses: string[];
  lastAudited: string;
}

export interface CommitmentVault {
  id: string;
  name: string;
  vaultType: 'FOOD' | 'CARE' | 'LABOUR' | 'ENERGY' | 'HOUSING' | 'WATER' | 'BIODIVERSITY' | 'EMERGENCY';
  unit: string;
  totalPledgedQuantity: number;
  totalPledgedValueGBP: number;
  verifiedValueGBP: number;
  totalMintedCOMMONS: number;
  liquidityRatio: number; // default 0.80 (80%)
  reserveAmountGBP: number;
  active: boolean;
}

export interface VaultPledge {
  id: string;
  vaultId: string;
  vaultName: string;
  pledgorId: string;
  pledgorName: string;
  pledgeType: string;
  quantity: number;
  unit: string;
  qualityStandard: string;
  deliveryWindow: string;
  verificationLevel: number; // 0-100%
  haircut: number; // e.g. 0.60 down to 0.10
  mintCapGBP: number;
  mintedAmountGBP: number;
  status: 'PENDING' | 'VERIFIED' | 'FULFILLED' | 'DEFAULTED';
  createdAt: string;
}

export interface DemurrageRun {
  id: string;
  runDate: string;
  totalDecayedGBP: number;
  accountsAffected: number;
  annualRate: number; // e.g. 0.12
  dailyRate: number; // 0.12 / 365
  status: 'COMPLETED';
}

export interface DemurrageTransaction {
  id: string;
  date: string;
  type: 'OPENING' | 'DAILY_DEMURRAGE' | 'PAYMENT' | 'CONVERSION_IN' | 'CONVERSION_OUT';
  description: string;
  amountGBP: number;
  balanceAfterGBP: number;
}

export interface FiatSettlementQueueItem {
  id: string;
  merchantId: string;
  merchantName: string;
  amountGBP: number;
  sortCode: string;
  accountNumber: string;
  status: 'PENDING' | 'PROCESSED';
  scheduledFor: string;
  processedAt?: string;
  paymentReference?: string;
}

export interface ParameterGuardrail {
  parameterName: string;
  displayName: string;
  minValue: number;
  maxValue: number;
  currentValue: number;
  unit: string;
  description: string;
}

export interface CoopProposal {
  id: string;
  proposerName: string;
  title: string;
  description: string;
  proposalType: 'PARAMETER_CHANGE' | 'VAULT_CREATION' | 'POLICY_UPDATE' | 'EMERGENCY';
  parameters?: Record<string, number>;
  status: 'ACTIVE' | 'PASSED' | 'EXECUTED' | 'REJECTED';
  votesFor: number;
  votesAgainst: number;
  userVoted?: boolean;
  fairnessReviewed: boolean;
  actuarialReviewed: boolean;
  ecologicalReviewed: boolean;
  legalReviewed: boolean;
  timelockExpiry: string;
  createdAt: string;
}

export interface CitizenAccount {
  id: string;
  name: string;
  memberNumber: string;
  commonsBalance: number; // £ Local Credits (Current Account, 12%/yr decay)
  reserveBalance: number; // £ Reserve Savings Account (No decay, 1.5% exit fee)
  municipalCreditBalance: number; // £ Municipal Council Credits
  fiatReserveGBP: number; // Safeguarded Fiat
  demurrageExemptionActive: boolean;
  localPurchasesThisMonth: number;
  demurrageRate: number; // 0% if active, otherwise 0.5%/mo
  activeVaultPledgeGBP: number;
  demurrageDaysHeld: number; // Days held in COMMONS for 44-day breakeven
  balanceCommons?: number;
  balanceMunicipal?: number;
}

export type AuditEventType =
  | 'GATE_APPROVAL'
  | 'SYSTEM_EVENT'
  | 'TRANSACTION'
  | 'CIRCUIT_BREAKER'
  | 'DISPUTE'
  | 'TREASURY_SWEEP'
  | 'EMERGENCY_HALT'
  | 'MULTI_SIG';

export type AuditSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface AuditLog {
  id: string;
  timestamp: string;
  eventType: AuditEventType;
  severity: AuditSeverity;
  actor: string;
  action: string;
  details: string;
  targetRef: string;
  hash: string;
  statutoryBasis?: string;
}

export interface DisputeCase {
  id: string;
  docketNumber: string;
  claimantName: string;
  claimantId: string;
  category: 'BARTER_VAT_DISCREPANCY' | 'SWAP_RATE_EXECUTION' | 'HARDSHIP_PRIORITY_DENIAL' | 'GOVERNANCE_BREACH' | 'RESERVE_RUN_DEFENSE';
  disputedAmountGBP?: number;
  description: string;
  evidenceRef: string;
  status: 'FILED' | 'IN_ARBITRATION' | 'RESOLVED' | 'ESCALATED_FCA';
  filedAt: string;
  statutoryBasis: string;
  verdictNotes?: string;
}

export type AssetClusterSector =
  | 'FOOD'
  | 'ENERGY'
  | 'CARE'
  | 'LABOUR'
  | 'BIODIVERSITY'
  | 'HOUSING'
  | 'WATER'
  | 'CIVIC';

export type CriticalInfraType =
  | 'HEALTHCARE'
  | 'TRANSIT_LOGISTICS'
  | 'POWER_GRID'
  | 'WATER_FLOOD'
  | 'EMERGENCY_SERVICES'
  | 'COUNCIL_EOC';

export interface CommunityAssetCluster {
  id: string;
  name: string;
  sector: AssetClusterSector;
  wardName: string;
  lat: number;
  lng: number;
  capacityDescription: string;
  verifiedValueGBP: number;
  circulatingVouchers: number;
  resilienceRole: string;
  linkedVaultId: string;
  nearestInfraDistanceM: number;
  nearestInfraName: string;
  spatialResilienceScore: number;
  bufferCoverageM: number;
  utilizationRatePercent: number;
  weeklyVoucherVelocity: number;
  activeParticipants: number;
  dailyInteractions: number;
}

export interface CriticalInfrastructure {
  id: string;
  name: string;
  type: CriticalInfraType;
  wardName: string;
  lat: number;
  lng: number;
  capacityOrThroughput: string;
  servicePopulation: number;
  statutoryRole: string;
  redundancyTier: 'N+1_CRITICAL' | 'PRIMARY' | 'SECONDARY';
  emergencyPowerBackup: boolean;
}

export interface WardSpatialMetric {
  wardName: string;
  centroidLat: number;
  centroidLng: number;
  population: number;
  terScore: number;
  localMultiplier: number;
  hardshipDisbursedGBP: number;
  anchorSpendPercent: number;
  assetClusterCount: number;
  infraCount: number;
  resilienceScore: number;
  coverageStatus: 'OPTIMAL' | 'MODERATE' | 'UNDER_SERVED';
}

export type HeatmapMode =
  | 'ASSET_DENSITY'
  | 'UTILIZATION_INTENSITY'
  | 'WELFARE_DEMAND';

export interface MunicipalDistrictHeatData {
  districtId: string;
  districtName: string;
  boroughWard: string;
  assetDensityPerKm2: number;
  utilizationRatePercent: number;
  weeklyCirculationCOMMONS: number;
  activeParticipants: number;
  heatIndex: number; // 0 - 100
  heatLevel: 'CRITICAL_CONGESTION' | 'VIBRANT_HIGH' | 'STABLE_BALANCED' | 'EMERGING_LOW';
  primaryDominantSector: AssetClusterSector;
  centroidLat: number;
  centroidLng: number;
  boundaryPolygon: [number, number][];
  hotspotNames: string[];
  demurrageTurnoverDays: number;
}

export interface CivicInfrastructureProject {
  id: string;
  name: string;
  type: CriticalInfraType;
  targetWard: string;
  lat: number;
  lng: number;
  budgetGBP: number;
  completionYear: number;
  planningReference: string;
  description: string;
  historicalBenchmarkBasis: string;
  targetBenefitSectors: AssetClusterSector[];
  impactRadiusM: number;
  scoreBoostCoefficients: {
    directProximityBoost: number;
    sectorAlignmentBoost: number;
    systemicCapacityBoost: number;
  };
  projectedKeyBenefit: string;
  status: 'PLANNED' | 'APPROVED_FUNDED' | 'UNDER_CONSULTATION';
}

export interface SimulatedAssetImpact {
  assetId: string;
  baselineScore: number;
  simulatedScore: number;
  scoreDelta: number;
  contributingProjects: string[];
  historicalRationale: string;
}

export interface ResilienceTrajectoryPoint {
  year: string;
  yearOffset: number;
  statusQuo: number;
  projectedScore: number;
  targetBenchmark: number;
  statusQuoShock: number;
  projectedShock: number;
  energyScore: number;
  foodScore: number;
  careScore: number;
  housingScore: number;
  mobilityScore: number;
  ecologyScore: number;
  milestone?: string;
}

export interface PredictiveTrajectorySummary {
  baselineAvgScore: number;
  terminalProjectedScore: number;
  netLiftPoints: number;
  benchmarkAttainmentYear: string;
  totalCivicCapitalInvestedGBP: number;
  capitalEfficiencyGBPPerPoint: number;
  shockResilienceRetentionPct: number;
  daysToFullRecovery: number;
  daysToRecoveryStatusQuo: number;
}

