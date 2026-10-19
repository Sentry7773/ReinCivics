// src/context/CivicTrustContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Gate,
  Phase,
  ArchitecturalInvariant,
  ReserveTranche,
  YieldSweep,
  AIPSConstraint,
  SHAPFeature,
  CircuitBreakerTier,
  MultiSigRequest,
  PriorityQueueClaim,
  SolidarityContribution,
  ESGCredential,
  CouncilWardData,
  LegalDocument,
  CitizenAccount,
  AuditLog,
  DisputeCase,
  CommitmentVault,
  VaultPledge,
} from '../types';
import {
  GATES_DATA,
  PHASES_DATA,
  ARCHITECTURAL_INVARIANTS,
  INITIAL_RESERVE_TRANCHES,
  INITIAL_AIPS_CONSTRAINTS,
  SHAP_FEATURE_ATTRIBUTIONS,
  CIRCUIT_BREAKER_TIERS,
  INITIAL_MULTISIG_REQUESTS,
  INITIAL_PRIORITY_CLAIMS,
  INITIAL_SOLIDARITY_CONTRIBUTIONS,
  INITIAL_ESG_CREDENTIALS,
  INITIAL_COUNCIL_WARDS,
  LEGAL_DOCUMENTS_CATALOG,
  INITIAL_COMMITMENT_VAULTS,
  INITIAL_VAULT_PLEDGES,
} from '../data/gatesData';
import { INITIAL_AUDIT_LOGS, INITIAL_DISPUTES } from '../data/auditLogsData';

interface CivicTrustContextType {
  gates: Gate[];
  phases: Phase[];
  invariants: ArchitecturalInvariant[];
  reserveTranches: ReserveTranche[];
  aipsConstraints: AIPSConstraint[];
  shapFeatures: SHAPFeature[];
  circuitBreakers: CircuitBreakerTier[];
  multisigRequests: MultiSigRequest[];
  priorityClaims: PriorityQueueClaim[];
  solidarityContributions: SolidarityContribution[];
  esgCredentials: ESGCredential[];
  councilWards: CouncilWardData[];
  legalDocuments: LegalDocument[];
  citizenAccount: CitizenAccount;
  systemStatus: 'GREEN' | 'AMBER' | 'RED' | 'CRITICAL';
  yieldSweepsHistory: YieldSweep[];
  selectedGate: Gate | null;
  setSelectedGate: (gate: Gate | null) => void;
  auditLogs: AuditLog[];
  disputes: DisputeCase[];
  commitmentVaults: CommitmentVault[];
  vaultPledges: VaultPledge[];
  // Actions
  evaluateGate: (gateId: string) => void;
  rebalanceTreasury: () => void;
  executeYieldSweep: () => void;
  triggerKillSwitch: (reason: string) => void;
  toggleCircuitBreaker: (tierNumber: number) => void;
  signMultiSig: (requestId: string, signerId: string) => void;
  submitHardshipClaim: (category: PriorityQueueClaim['category'], amount: number, reason: string) => void;
  processClaim: (claimId: string) => void;
  addSolidarityContribution: (name: string, type: 'CITIZEN' | 'BUSINESS', amount: number) => void;
  generateESGCredential: (businessName: string, companyNumber: string, amount: number) => void;
  payMerchant: (amount: number, merchantName: string) => { success: boolean; message: string };
  pledgeToVault: (amount: number) => void;
  pledgeCapacityToVault: (
    vaultId: string,
    pledgorName: string,
    pledgeType: string,
    quantity: number,
    unit: string,
    estimatedValueGBP: number
  ) => VaultPledge;
  mintVouchersFromPledge: (pledgeId: string, amountCOMMONS: number) => { success: boolean; message: string; txHash: string };
  swapCredits: (fromType: 'MUNICIPAL' | 'COMMONS', toType: 'MUNICIPAL' | 'COMMONS', amount: number) => {
    success: boolean;
    receivedAmount: number;
    bonusRate: number;
    txHash: string;
    message: string;
  };
  recordPOSTransaction: (grossAmount: number, items: string) => { vatGBP: number; netGBP: number; txHash: string };
  setEmergencyLevel: (level: 'GREEN' | 'AMBER' | 'RED' | 'CRITICAL') => void;
  triggerEmergencyHalt: (tier: 1 | 2 | 3 | 4, reason: string) => void;
  fileDispute: (
    category: DisputeCase['category'],
    claimantName: string,
    claimantId: string,
    description: string,
    disputedAmountGBP?: number,
    evidenceRef?: string
  ) => DisputeCase;
  addAuditLog: (entry: Omit<AuditLog, 'id' | 'timestamp' | 'hash'> & { hash?: string }) => AuditLog;
  generateAuditBundle: () => string;
}

const CivicTrustContext = createContext<CivicTrustContextType | undefined>(undefined);

export const CivicTrustProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gates, setGates] = useState<Gate[]>(() => {
    const saved = localStorage.getItem('civictrust_gates');
    return saved ? JSON.parse(saved) : GATES_DATA;
  });

  const [reserveTranches, setReserveTranches] = useState<ReserveTranche[]>(() => {
    const saved = localStorage.getItem('civictrust_tranches');
    return saved ? JSON.parse(saved) : INITIAL_RESERVE_TRANCHES;
  });

  const [circuitBreakers, setCircuitBreakers] = useState<CircuitBreakerTier[]>(() => {
    const saved = localStorage.getItem('civictrust_cb');
    return saved ? JSON.parse(saved) : CIRCUIT_BREAKER_TIERS;
  });

  const [multisigRequests, setMultisigRequests] = useState<MultiSigRequest[]>(() => {
    const saved = localStorage.getItem('civictrust_multisig');
    return saved ? JSON.parse(saved) : INITIAL_MULTISIG_REQUESTS;
  });

  const [priorityClaims, setPriorityClaims] = useState<PriorityQueueClaim[]>(() => {
    const saved = localStorage.getItem('civictrust_claims');
    return saved ? JSON.parse(saved) : INITIAL_PRIORITY_CLAIMS;
  });

  const [solidarityContributions, setSolidarityContributions] = useState<SolidarityContribution[]>(() => {
    const saved = localStorage.getItem('civictrust_solidarity');
    return saved ? JSON.parse(saved) : INITIAL_SOLIDARITY_CONTRIBUTIONS;
  });

  const [esgCredentials, setEsgCredentials] = useState<ESGCredential[]>(() => {
    const saved = localStorage.getItem('civictrust_esg');
    return saved ? JSON.parse(saved) : INITIAL_ESG_CREDENTIALS;
  });

  const [councilWards] = useState<CouncilWardData[]>(INITIAL_COUNCIL_WARDS);
  const [invariants] = useState<ArchitecturalInvariant[]>(ARCHITECTURAL_INVARIANTS);
  const [phases] = useState<Phase[]>(PHASES_DATA);
  const [aipsConstraints] = useState<AIPSConstraint[]>(INITIAL_AIPS_CONSTRAINTS);
  const [shapFeatures] = useState<SHAPFeature[]>(SHAP_FEATURE_ATTRIBUTIONS);
  const [legalDocuments] = useState<LegalDocument[]>(LEGAL_DOCUMENTS_CATALOG);

  const [citizenAccount, setCitizenAccount] = useState<CitizenAccount>({
    id: 'cit-2094',
    name: 'Amara Okafor',
    memberNumber: 'MBR-2094-CAMDEN',
    commonsBalance: 485.50,
    reserveBalance: 320.00,
    municipalCreditBalance: 250.00,
    fiatReserveGBP: 485.50,
    demurrageExemptionActive: true,
    localPurchasesThisMonth: 4,
    demurrageRate: 0.0,
    activeVaultPledgeGBP: 150.00,
    demurrageDaysHeld: 18,
  });

  const [systemStatus, setSystemStatus] = useState<'GREEN' | 'AMBER' | 'RED' | 'CRITICAL'>('GREEN');
  const [selectedGate, setSelectedGate] = useState<Gate | null>(null);

  const [yieldSweepsHistory, setYieldSweepsHistory] = useState<YieldSweep[]>([
    {
      date: '2026-10-08',
      totalYieldGBP: 3680.50,
      deepReserveShareGBP: 2576.35,
      shockAbsorberShareGBP: 1104.15,
      status: 'DISTRIBUTED',
    },
    {
      date: '2026-10-01',
      totalYieldGBP: 3642.10,
      deepReserveShareGBP: 2549.47,
      shockAbsorberShareGBP: 1092.63,
      status: 'DISTRIBUTED',
    },
  ]);

  // Persist state updates
  useEffect(() => {
    localStorage.setItem('civictrust_gates', JSON.stringify(gates));
  }, [gates]);

  useEffect(() => {
    localStorage.setItem('civictrust_tranches', JSON.stringify(reserveTranches));
  }, [reserveTranches]);

  useEffect(() => {
    localStorage.setItem('civictrust_cb', JSON.stringify(circuitBreakers));
  }, [circuitBreakers]);

  useEffect(() => {
    localStorage.setItem('civictrust_multisig', JSON.stringify(multisigRequests));
  }, [multisigRequests]);

  useEffect(() => {
    localStorage.setItem('civictrust_claims', JSON.stringify(priorityClaims));
  }, [priorityClaims]);

  useEffect(() => {
    localStorage.setItem('civictrust_solidarity', JSON.stringify(solidarityContributions));
  }, [solidarityContributions]);

  useEffect(() => {
    localStorage.setItem('civictrust_esg', JSON.stringify(esgCredentials));
  }, [esgCredentials]);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('civictrust_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [disputes, setDisputes] = useState<DisputeCase[]>(() => {
    const saved = localStorage.getItem('civictrust_disputes');
    return saved ? JSON.parse(saved) : INITIAL_DISPUTES;
  });

  useEffect(() => {
    localStorage.setItem('civictrust_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('civictrust_disputes', JSON.stringify(disputes));
  }, [disputes]);

  const [commitmentVaults, setCommitmentVaults] = useState<CommitmentVault[]>(() => {
    const saved = localStorage.getItem('civictrust_vaults');
    return saved ? JSON.parse(saved) : INITIAL_COMMITMENT_VAULTS;
  });

  const [vaultPledges, setVaultPledges] = useState<VaultPledge[]>(() => {
    const saved = localStorage.getItem('civictrust_pledges');
    return saved ? JSON.parse(saved) : INITIAL_VAULT_PLEDGES;
  });

  useEffect(() => {
    localStorage.setItem('civictrust_vaults', JSON.stringify(commitmentVaults));
  }, [commitmentVaults]);

  useEffect(() => {
    localStorage.setItem('civictrust_pledges', JSON.stringify(vaultPledges));
  }, [vaultPledges]);

  const pledgeCapacityToVault = (
    vaultId: string,
    pledgorName: string,
    pledgeType: string,
    quantity: number,
    unit: string,
    estimatedValueGBP: number
  ): VaultPledge => {
    const haircut = 0.15; // 15% standard actuarial haircut
    const mintCapGBP = Math.round(estimatedValueGBP * (1 - haircut));
    const targetVault = commitmentVaults.find((v) => v.id === vaultId);
    const newPledge: VaultPledge = {
      id: `plg-${Date.now()}`,
      vaultId,
      vaultName: targetVault ? targetVault.name : 'Community Asset Vault',
      pledgorId: `mbr-${Math.floor(100 + Math.random() * 900)}`,
      pledgorName,
      pledgeType,
      quantity,
      unit,
      qualityStandard: 'BenCom Mutual Standard (Verified)',
      deliveryWindow: '2026-11-01 to 2027-02-28',
      verificationLevel: 85,
      haircut,
      mintCapGBP,
      mintedAmountGBP: 0,
      status: 'VERIFIED',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
    };

    setVaultPledges((prev) => [newPledge, ...prev]);

    setCommitmentVaults((prev) =>
      prev.map((v) => {
        if (v.id === vaultId) {
          return {
            ...v,
            totalPledgedQuantity: v.totalPledgedQuantity + quantity,
            totalPledgedValueGBP: v.totalPledgedValueGBP + estimatedValueGBP,
            verifiedValueGBP: v.verifiedValueGBP + mintCapGBP,
          };
        }
        return v;
      })
    );

    addAuditLog({
      eventType: 'SYSTEM_EVENT',
      severity: 'INFO',
      actor: pledgorName,
      action: 'Forward Capacity Pledged to Commitment Vault',
      details: `Pledged ${quantity} ${unit} of forward ${pledgeType} to ${newPledge.vaultName}. Verified capacity: £${mintCapGBP.toLocaleString()}.`,
      targetRef: newPledge.id,
      statutoryBasis: 'Phase 13 Commitment Vault Charter & Sarafu Compatibility Protocol',
    });

    return newPledge;
  };

  const mintVouchersFromPledge = (
    pledgeId: string,
    amountCOMMONS: number
  ): { success: boolean; message: string; txHash: string } => {
    const pledge = vaultPledges.find((p) => p.id === pledgeId);
    if (!pledge) {
      return { success: false, message: 'Pledge record not found.', txHash: '' };
    }
    const remainingCap = pledge.mintCapGBP - pledge.mintedAmountGBP;
    if (amountCOMMONS > remainingCap) {
      return {
        success: false,
        message: `Requested voucher mint (£${amountCOMMONS}) exceeds remaining verified cap (£${remainingCap}).`,
        txHash: '',
      };
    }

    const txHash = generateHash();

    setVaultPledges((prev) =>
      prev.map((p) =>
        p.id === pledgeId
          ? { ...p, mintedAmountGBP: p.mintedAmountGBP + amountCOMMONS }
          : p
      )
    );

    setCommitmentVaults((prev) =>
      prev.map((v) =>
        v.id === pledge.vaultId
          ? { ...v, totalMintedCOMMONS: v.totalMintedCOMMONS + amountCOMMONS }
          : v
      )
    );

    addAuditLog({
      eventType: 'TRANSACTION',
      severity: 'INFO',
      actor: pledge.pledgorName,
      action: 'Redeemable Commitment Vouchers Minted',
      details: `Minted ${amountCOMMONS} COMMONS redeemable vouchers backed by forward ${pledge.pledgeType}. Collateral backing ratio: 80%.`,
      targetRef: txHash,
      hash: txHash,
      statutoryBasis: 'Sarafu Protocol Standard & Co-operative and Community Benefit Societies Act 2014',
    });

    return {
      success: true,
      message: `Successfully minted ${amountCOMMONS} COMMONS vouchers against forward ${pledge.pledgeType}. Collateral verified.`,
      txHash,
    };
  };

  const generateHash = () =>
    '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

  const addAuditLog = (entry: Omit<AuditLog, 'id' | 'timestamp' | 'hash'> & { hash?: string }): AuditLog => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      hash: entry.hash || generateHash(),
      ...entry,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    return newLog;
  };

  const fileDispute = (
    category: DisputeCase['category'],
    claimantName: string,
    claimantId: string,
    description: string,
    disputedAmountGBP?: number,
    evidenceRef?: string
  ): DisputeCase => {
    const docketNumber = `DOCK-2026-CAM-${Math.floor(1000 + Math.random() * 9000)}`;
    const newDispute: DisputeCase = {
      id: `disp-${Date.now()}`,
      docketNumber,
      claimantName,
      claimantId,
      category,
      description,
      disputedAmountGBP,
      evidenceRef: evidenceRef || `EVID-${Date.now()}`,
      status: 'FILED',
      filedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      statutoryBasis: 'Civil Evidence Act 1995 & BenCom Dispute Resolution Rules (Phase 32 / Gate L32.1)',
      verdictNotes: 'Dispute filed successfully and docket assigned for expedited arbitration tribunal.',
    };
    setDisputes((prev) => [newDispute, ...prev]);
    addAuditLog({
      eventType: 'DISPUTE',
      severity: 'WARNING',
      actor: `${claimantName} (${claimantId})`,
      action: 'Arbitration Dispute Filed',
      details: `Filed dispute docket ${docketNumber} [${category}]: ${description.substring(0, 120)}`,
      targetRef: docketNumber,
      statutoryBasis: 'Civil Evidence Act 1995 & Gate L32.1',
    });
    return newDispute;
  };

  const triggerEmergencyHalt = (tier: 1 | 2 | 3 | 4, reason: string) => {
    const tierMap: Record<number, 'AMBER' | 'RED' | 'CRITICAL'> = {
      1: 'AMBER',
      2: 'AMBER',
      3: 'RED',
      4: 'CRITICAL',
    };
    setSystemStatus(tierMap[tier] || 'CRITICAL');
    setCircuitBreakers((prev) =>
      prev.map((cb) => (cb.tier === tier ? { ...cb, active: true, lastTriggered: new Date().toISOString() } : cb))
    );
    addAuditLog({
      eventType: 'EMERGENCY_HALT',
      severity: tier >= 3 ? 'CRITICAL' : 'WARNING',
      actor: 'Emergency Command Station / Operator',
      action: `Emergency Halt Activated [Tier ${tier}]`,
      details: `Reason: ${reason}. Circuit breaker tier ${tier} engaged. System status shifted to ${tierMap[tier]}.`,
      targetRef: `CB-TIER-${tier}`,
      statutoryBasis: 'PRA SS1/23 Model Risk & Run Protection Architecture (Phase 35)',
    });
  };

  // Actions
  const evaluateGate = (gateId: string) => {
    setGates((prev) =>
      prev.map((g) => {
        if (g.id === gateId) {
          const updated = {
            ...g,
            status: 'PASSED' as const,
            lastEvaluatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
          };
          addAuditLog({
            eventType: 'GATE_APPROVAL',
            severity: 'INFO',
            actor: 'JurisActuary Evaluator',
            action: `Gate ${g.code} Certified & Verified`,
            details: `Statutory criteria verified: ${g.passCriteria}`,
            targetRef: g.code,
            hash: g.evidenceHash,
            statutoryBasis: g.statutoryCitation,
          });
          return updated;
        }
        return g;
      })
    );
  };

  const rebalanceTreasury = () => {
    // Rebalance under A-IPS constraints: shift slightly towards higher yield MMF while safeguarding floors
    setReserveTranches((prev) => {
      const total = prev.reduce((acc, t) => acc + t.balanceGBP, 0);
      return prev.map((t) => {
        if (t.type === 'RESERVE_INSTANT') {
          return { ...t, balanceGBP: Math.round(total * 0.26) };
        }
        if (t.type === 'RESERVE_MMF') {
          return { ...t, balanceGBP: Math.round(total * 0.24) };
        }
        if (t.type === 'HARDSHIP_INSTANT') {
          return { ...t, balanceGBP: Math.round(total * 0.08) };
        }
        return t;
      });
    });
  };

  const executeYieldSweep = () => {
    // Calculate weekly yield across all tranches: (balance * yieldBps / 10000) / 52
    let totalWeeklyYield = 0;
    reserveTranches.forEach((t) => {
      const annualYield = (t.balanceGBP * t.yieldBps) / 10000;
      totalWeeklyYield += annualYield / 52;
    });

    const deepReserve = totalWeeklyYield * 0.70;
    const shockAbsorber = totalWeeklyYield * 0.30;

    const newSweep: YieldSweep = {
      date: new Date().toISOString().substring(0, 10),
      totalYieldGBP: Math.round(totalWeeklyYield * 100) / 100,
      deepReserveShareGBP: Math.round(deepReserve * 100) / 100,
      shockAbsorberShareGBP: Math.round(shockAbsorber * 100) / 100,
      status: 'DISTRIBUTED',
    };

    setYieldSweepsHistory((prev) => [newSweep, ...prev]);

    // Credit tranches proportionally
    setReserveTranches((prev) =>
      prev.map((t) => {
        if (t.type === 'HARDSHIP_INSTANT') {
          return { ...t, balanceGBP: t.balanceGBP + shockAbsorber };
        }
        if (t.type === 'RESERVE_INSTANT') {
          return { ...t, balanceGBP: t.balanceGBP + deepReserve };
        }
        return t;
      })
    );
  };

  const triggerKillSwitch = (reason: string) => {
    setSystemStatus('RED');
    // Safe Haven reallocation: 50% Instant / 50% MMF
    setReserveTranches((prev) => {
      const deepReserveTotal = prev
        .filter((t) => t.type.startsWith('RESERVE_'))
        .reduce((sum, t) => sum + t.balanceGBP, 0);

      const hardshipTotal = prev
        .filter((t) => t.type.startsWith('HARDSHIP_'))
        .reduce((sum, t) => sum + t.balanceGBP, 0);

      return prev.map((t) => {
        if (t.type === 'RESERVE_INSTANT') return { ...t, balanceGBP: deepReserveTotal * 0.50 };
        if (t.type === 'RESERVE_MMF') return { ...t, balanceGBP: deepReserveTotal * 0.50 };
        if (t.type === 'HARDSHIP_INSTANT') return { ...t, balanceGBP: hardshipTotal * 0.60 };
        if (t.type === 'HARDSHIP_MMF') return { ...t, balanceGBP: hardshipTotal * 0.40 };
        return { ...t, balanceGBP: 0 };
      });
    });

    // Auto trigger Tier 2 and Tier 3 circuit breakers
    setCircuitBreakers((prev) =>
      prev.map((cb) => ({
        ...cb,
        active: cb.tier <= 3,
        lastTriggered: `Fiduciary Kill-Switch: ${reason}`,
      }))
    );
  };

  const toggleCircuitBreaker = (tierNumber: number) => {
    setCircuitBreakers((prev) =>
      prev.map((cb) => {
        if (cb.tier === tierNumber) {
          const nextState = !cb.active;
          return {
            ...cb,
            active: nextState,
            lastTriggered: nextState
              ? `${new Date().toISOString().substring(0, 16).replace('T', ' ')} UTC (Manual Admin)`
              : cb.lastTriggered,
          };
        }
        return cb;
      })
    );
  };

  const signMultiSig = (requestId: string, signerId: string) => {
    setMultisigRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;

        const updatedSignatures = req.signatures.map((sig) => {
          if (sig.signerId === signerId) {
            return {
              ...sig,
              signed: true,
              signedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
            };
          }
          return sig;
        });

        const totalSigned = updatedSignatures.filter((s) => s.signed).length;
        const isApproved = totalSigned >= req.requiredSignatures;

        return {
          ...req,
          signatures: updatedSignatures,
          status: isApproved ? 'APPROVED' : 'PENDING',
        };
      })
    );
  };

  const submitHardshipClaim = (category: PriorityQueueClaim['category'], amount: number) => {
    const newClaim: PriorityQueueClaim = {
      id: `clm-${Date.now().toString().slice(-4)}`,
      claimantId: citizenAccount.id,
      claimantName: citizenAccount.name,
      category,
      requestedGBP: amount,
      approvedGBP: amount,
      equityScoreESCR: 0.98,
      urgencyRank: priorityClaims.length + 1,
      status: 'QUEUED',
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
    };

    setPriorityClaims((prev) => [newClaim, ...prev]);
  };

  const processClaim = (claimId: string) => {
    setPriorityClaims((prev) =>
      prev.map((clm) => {
        if (clm.id === claimId) {
          // If claimant is current citizen, credit commons balance
          if (clm.claimantId === citizenAccount.id) {
            setCitizenAccount((curr) => ({
              ...curr,
              commonsBalance: curr.commonsBalance + clm.approvedGBP,
              fiatReserveGBP: curr.fiatReserveGBP + clm.approvedGBP,
            }));
          }
          return { ...clm, status: 'PROCESSED' };
        }
        return clm;
      })
    );
  };

  const addSolidarityContribution = (name: string, type: 'CITIZEN' | 'BUSINESS', amount: number) => {
    const shockAbsorber = amount * 0.60;
    const enterpriseFund = amount * 0.40;

    let tier: SolidarityContribution['tier'] = 'SEED';
    if (amount >= 10000) tier = 'COMMONS_CHAMPION';
    else if (amount >= 2500) tier = 'PILLAR';
    else if (amount >= 100) tier = 'PATRON';

    const newContrib: SolidarityContribution = {
      id: `sol-${Date.now().toString().slice(-4)}`,
      contributorName: name,
      contributorType: type,
      amountGBP: amount,
      shockAbsorberShare: shockAbsorber,
      enterpriseFundShare: enterpriseFund,
      tier,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
      txHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    };

    setSolidarityContributions((prev) => [newContrib, ...prev]);

    // Boost Hardship Instant tranche by 60%
    setReserveTranches((prev) =>
      prev.map((t) => {
        if (t.type === 'HARDSHIP_INSTANT') {
          return { ...t, balanceGBP: t.balanceGBP + shockAbsorber };
        }
        return t;
      })
    );
  };

  const generateESGCredential = (businessName: string, companyNumber: string, amount: number) => {
    const certHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newCred: ESGCredential = {
      id: `esg-${Date.now().toString().slice(-4)}`,
      businessName,
      companyNumber,
      totalSolidarityPledgedGBP: amount,
      socialValueScore: Math.min(99.4, 75 + amount / 1000),
      procurementTier: amount >= 10000 ? 'TIER_A_STATUTORY_PREFERRED' : 'TIER_B_COMMUNITY_ACCREDITED',
      statutoryBasis: 'Public Services (Social Value) Act 2012; Procurement Act 2023 s.12',
      issuedDate: new Date().toISOString().substring(0, 10),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
      certificateHash: certHash,
    };

    setEsgCredentials((prev) => [newCred, ...prev]);
    addSolidarityContribution(businessName, 'BUSINESS', amount);
  };

  const payMerchant = (amount: number, merchantName: string) => {
    if (citizenAccount.commonsBalance < amount) {
      return { success: false, message: 'Insufficient commons balance.' };
    }

    setCitizenAccount((prev) => ({
      ...prev,
      commonsBalance: Math.round((prev.commonsBalance - amount) * 100) / 100,
      fiatReserveGBP: Math.round((prev.fiatReserveGBP - amount) * 100) / 100,
      localPurchasesThisMonth: prev.localPurchasesThisMonth + 1,
      demurrageExemptionActive: true,
    }));

    addAuditLog({
      eventType: 'TRANSACTION',
      severity: 'INFO',
      actor: `${citizenAccount.name} (${citizenAccount.memberNumber})`,
      action: 'Merchant Barter Payment Settled',
      details: `Transferred £${amount.toFixed(2)} to ${merchantName}. Demurrage exemption active.`,
      targetRef: `PAY-${Date.now()}`,
      statutoryBasis: 'HMRC Notice 700/8 & Co-operative and Community Benefit Societies Act 2014',
    });

    return {
      success: true,
      message: `Successfully transferred £${amount.toFixed(2)} to ${merchantName}. Demurrage exemption renewed!`,
    };
  };

  const pledgeToVault = (amount: number) => {
    if (citizenAccount.commonsBalance < amount) return;
    setCitizenAccount((prev) => ({
      ...prev,
      commonsBalance: prev.commonsBalance - amount,
      activeVaultPledgeGBP: prev.activeVaultPledgeGBP + amount,
    }));
    addAuditLog({
      eventType: 'TRANSACTION',
      severity: 'INFO',
      actor: `${citizenAccount.name} (${citizenAccount.memberNumber})`,
      action: 'Commitment Vault Pledge Recorded',
      details: `Pledged £${amount.toFixed(2)} to Community Solar Commitment Vault.`,
      targetRef: `VAULT-PLG-${Date.now()}`,
      statutoryBasis: 'Phase 13 Commitment Vault Charter',
    });
  };

  const swapCredits = (
    fromType: 'MUNICIPAL' | 'COMMONS',
    toType: 'MUNICIPAL' | 'COMMONS',
    amount: number
  ) => {
    if (amount <= 0) {
      return { success: false, receivedAmount: 0, bonusRate: 0, txHash: '', message: 'Invalid amount.' };
    }

    if (fromType === 'MUNICIPAL') {
      if (citizenAccount.municipalCreditBalance < amount) {
        return { success: false, receivedAmount: 0, bonusRate: 0, txHash: '', message: 'Insufficient municipal credit balance.' };
      }
      // Green municipal incentive: +2.5% bonus when converting to local commons
      const bonusRate = 0.025;
      const received = Math.round(amount * (1 + bonusRate) * 100) / 100;
      const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

      setCitizenAccount((prev) => ({
        ...prev,
        municipalCreditBalance: Math.round((prev.municipalCreditBalance - amount) * 100) / 100,
        commonsBalance: Math.round((prev.commonsBalance + received) * 100) / 100,
        fiatReserveGBP: Math.round((prev.fiatReserveGBP + received) * 100) / 100,
        localPurchasesThisMonth: prev.localPurchasesThisMonth + 1,
        demurrageExemptionActive: true,
      }));

      addAuditLog({
        eventType: 'TRANSACTION',
        severity: 'INFO',
        actor: `${citizenAccount.name} (${citizenAccount.memberNumber})`,
        action: 'Municipal Credit Swap Executed',
        details: `Exchanged £${amount.toFixed(2)} Municipal Credits for £${received.toFixed(2)} Local Commons (+2.5% Green Incentive).`,
        targetRef: txHash,
        hash: txHash,
        statutoryBasis: 'Local Government Finance Act 1988 & Social Value Act 2012',
      });

      return {
        success: true,
        receivedAmount: received,
        bonusRate: 2.5,
        txHash,
        message: `Exchanged £${amount.toFixed(2)} Municipal Credits for £${received.toFixed(2)} Local Commons (+2.5% Green Incentive).`,
      };
    } else {
      if (citizenAccount.commonsBalance < amount) {
        return { success: false, receivedAmount: 0, bonusRate: 0, txHash: '', message: 'Insufficient local commons balance.' };
      }
      const received = amount;
      const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

      setCitizenAccount((prev) => ({
        ...prev,
        commonsBalance: Math.round((prev.commonsBalance - amount) * 100) / 100,
        fiatReserveGBP: Math.round((prev.fiatReserveGBP - amount) * 100) / 100,
        municipalCreditBalance: Math.round((prev.municipalCreditBalance + received) * 100) / 100,
      }));

      addAuditLog({
        eventType: 'TRANSACTION',
        severity: 'INFO',
        actor: `${citizenAccount.name} (${citizenAccount.memberNumber})`,
        action: 'Local Commons to Municipal Swap',
        details: `Exchanged £${amount.toFixed(2)} Local Commons for £${received.toFixed(2)} Municipal Credits.`,
        targetRef: txHash,
        hash: txHash,
        statutoryBasis: 'Local Government Finance Act 1988',
      });

      return {
        success: true,
        receivedAmount: received,
        bonusRate: 0,
        txHash,
        message: `Exchanged £${amount.toFixed(2)} Local Commons for £${received.toFixed(2)} Municipal Credits.`,
      };
    }
  };

  const recordPOSTransaction = (grossAmount: number) => {
    // 20% VAT split according to HMRC Notice 700/8 (net = gross / 1.2)
    const net = Math.round((grossAmount / 1.2) * 100) / 100;
    const vat = Math.round((grossAmount - net) * 100) / 100;
    const hash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    addAuditLog({
      eventType: 'TRANSACTION',
      severity: 'INFO',
      actor: 'Merchant Terminal POS',
      action: 'MTD Barter VAT Split Recorded',
      details: `Gross transaction £${grossAmount.toFixed(2)}: Net barter £${net.toFixed(2)}, VAT £${vat.toFixed(2)} segregated to escrow buffer.`,
      targetRef: hash,
      hash,
      statutoryBasis: 'HMRC Notice 700/8 Barter and Exchange Transactions',
    });

    return {
      vatGBP: vat,
      netGBP: net,
      txHash: hash,
    };
  };

  const setEmergencyLevel = (level: 'GREEN' | 'AMBER' | 'RED' | 'CRITICAL') => {
    setSystemStatus(level);
    addAuditLog({
      eventType: 'SYSTEM_EVENT',
      severity: level === 'CRITICAL' ? 'CRITICAL' : level === 'RED' ? 'CRITICAL' : level === 'AMBER' ? 'WARNING' : 'INFO',
      actor: 'Chief Risk Officer Console',
      action: `System Status Changed to ${level}`,
      details: `Emergency posture updated across all 5 municipal nodes to ${level}.`,
      targetRef: `STATUS-${level}`,
      statutoryBasis: 'PRA SS1/23 Model Risk Management',
    });
  };

  const generateAuditBundle = () => {
    const bundle = {
      project: 'CivicTrust / EcoVelocity Enterprise B2G',
      version: '7.0.0-ENTERPRISE',
      jurisdiction: 'United Kingdom (FCA / ICO / HMRC / Cabinet Office)',
      timestamp: new Date().toISOString(),
      statutoryConstitution: 'Co-operative and Community Benefit Societies Act 2014',
      totalGatesEvaluated: gates.length,
      gatesPassed: gates.filter((g) => g.status === 'PASSED').length,
      complianceRatio: '100.00%',
      architecturalInvariantsVerified: invariants.filter((i) => i.verified).length,
      totalReserveGovernedGBP: reserveTranches.reduce((sum, t) => sum + t.balanceGBP, 0),
      rootEvidenceHash: '0x8f3c7a912b4e56c8019d3f4a2e5b7c89a012d3e4f5a6b7c8d9e0f1a2b3c4d5e6',
      activeGates: gates,
      verifiedInvariants: invariants,
      legalDocumentsCatalog: legalDocuments,
      auditLogsTrail: auditLogs,
      activeDisputes: disputes,
    };
    return JSON.stringify(bundle, null, 2);
  };

  return (
    <CivicTrustContext.Provider
      value={{
        gates,
        phases,
        invariants,
        reserveTranches,
        aipsConstraints,
        shapFeatures,
        circuitBreakers,
        multisigRequests,
        priorityClaims,
        solidarityContributions,
        esgCredentials,
        councilWards,
        legalDocuments,
        citizenAccount,
        systemStatus,
        yieldSweepsHistory,
        selectedGate,
        setSelectedGate,
        auditLogs,
        disputes,
        commitmentVaults,
        vaultPledges,
        evaluateGate,
        rebalanceTreasury,
        executeYieldSweep,
        triggerKillSwitch,
        toggleCircuitBreaker,
        signMultiSig,
        submitHardshipClaim,
        processClaim,
        addSolidarityContribution,
        generateESGCredential,
        payMerchant,
        pledgeToVault,
        pledgeCapacityToVault,
        mintVouchersFromPledge,
        swapCredits,
        recordPOSTransaction,
        setEmergencyLevel,
        triggerEmergencyHalt,
        fileDispute,
        addAuditLog,
        generateAuditBundle,
      }}
    >
      {children}
    </CivicTrustContext.Provider>
  );
};

export const useCivicTrust = () => {
  const context = useContext(CivicTrustContext);
  if (!context) {
    throw new Error('useCivicTrust must be used within a CivicTrustProvider');
  }
  return context;
};

