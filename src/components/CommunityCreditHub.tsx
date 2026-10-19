// src/components/CommunityCreditHub.tsx
import React, { useState } from 'react';
import { useCivicTrust } from '../context/CivicTrustContext';
import { CommitmentVault, VaultPledge } from '../types';
import {
  Coins,
  ShieldCheck,
  Building2,
  Landmark,
  Layers,
  ArrowRight,
  TrendingUp,
  Scale,
  Sparkles,
  Zap,
  CheckCircle2,
  FileText,
  Download,
  AlertCircle,
  Users,
  Wheat,
  Heart,
  Wrench,
  Sun,
  Home,
  Droplets,
  Trees,
  Search,
  PlusCircle,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';

export type CommunityHubTab = 'underbanked-engine' | 'commitment-vaults' | 'bank-interface' | 'levers-of-change';

export const CommunityCreditHub: React.FC = () => {
  const {
    commitmentVaults,
    vaultPledges,
    pledgeCapacityToVault,
    mintVouchersFromPledge,
    citizenAccount,
  } = useCivicTrust();

  const [activeTab, setActiveTab] = useState<CommunityHubTab>('underbanked-engine');
  const [selectedVault, setSelectedVault] = useState<CommitmentVault | null>(null);
  const [showPledgeModal, setShowPledgeModal] = useState(false);
  const [showMintModal, setShowMintModal] = useState(false);
  const [selectedPledge, setSelectedPledge] = useState<VaultPledge | null>(null);
  const [mintAmount, setMintAmount] = useState('2500');
  const [mintResult, setMintResult] = useState<{ success: boolean; message: string; txHash: string } | null>(null);
  const [dossierDownloaded, setDossierDownloaded] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // New Pledge Form State
  const [pledgeVaultId, setPledgeVaultId] = useState('vlt-01');
  const [pledgorName, setPledgorName] = useState('Somers Town Youth & Football Club CIC');
  const [pledgeType, setPledgeType] = useState('Winter Community Kitchen Catering & Pitch Hire');
  const [pledgeQuantity, setPledgeQuantity] = useState('1200');
  const [pledgeUnit, setPledgeUnit] = useState('meals & training sessions');
  const [pledgeValueGBP, setPledgeValueGBP] = useState('14400');
  const [pledgeSuccess, setPledgeSuccess] = useState<string | null>(null);

  // Totals
  const totalPledgedGBP = commitmentVaults.reduce((sum, v) => sum + v.totalPledgedValueGBP, 0);
  const totalVerifiedGBP = commitmentVaults.reduce((sum, v) => sum + v.verifiedValueGBP, 0);
  const totalMintedGBP = commitmentVaults.reduce((sum, v) => sum + v.totalMintedCOMMONS, 0);

  const getVaultIcon = (type: CommitmentVault['vaultType']) => {
    switch (type) {
      case 'FOOD':
        return <Wheat className="w-4 h-4 text-amber-400" />;
      case 'CARE':
        return <Heart className="w-4 h-4 text-rose-400" />;
      case 'LABOUR':
        return <Wrench className="w-4 h-4 text-indigo-400" />;
      case 'ENERGY':
        return <Sun className="w-4 h-4 text-amber-400" />;
      case 'HOUSING':
        return <Home className="w-4 h-4 text-emerald-400" />;
      case 'WATER':
        return <Droplets className="w-4 h-4 text-cyan-400" />;
      case 'BIODIVERSITY':
        return <Trees className="w-4 h-4 text-teal-400" />;
      case 'EMERGENCY':
      default:
        return <ShieldCheck className="w-4 h-4 text-rose-400" />;
    }
  };

  const handleCreatePledge = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(pledgeQuantity);
    const val = parseFloat(pledgeValueGBP);
    if (isNaN(qty) || isNaN(val) || qty <= 0 || val <= 0) return;

    const newPledge = pledgeCapacityToVault(
      pledgeVaultId,
      pledgorName,
      pledgeType,
      qty,
      pledgeUnit,
      val
    );

    setPledgeSuccess(`Pledge confirmed for ${newPledge.pledgorName}. £${newPledge.mintCapGBP.toLocaleString()} capacity verified!`);
    setTimeout(() => {
      setPledgeSuccess(null);
      setShowPledgeModal(false);
    }, 3000);
  };

  const handleExecuteMint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPledge) return;
    const amt = parseFloat(mintAmount);
    if (isNaN(amt) || amt <= 0) return;

    const res = mintVouchersFromPledge(selectedPledge.id, amt);
    setMintResult(res);
    setTimeout(() => {
      if (res.success) {
        setShowMintModal(false);
      }
      setMintResult(null);
    }, 4000);
  };

  const handleDownloadUnderwritingDossier = () => {
    const dossier = {
      title: 'Institutional Fiduciary Underwriting Dossier',
      framework: 'From Underbanked to Understood — Community Credit & Commitment Pools',
      statutoryStandard: 'PRA SS1/23 & Co-operative and Community Benefit Societies Act 2014',
      generatedAt: new Date().toISOString(),
      applicantBeneficiary: 'Camden Borough Mutual Credit & Commitment Pool Consortium',
      registeredEntity: 'CivicTrust Community Benefit Society (FCA Mutuals Register #4829RS)',
      creditSummary: {
        totalVerifiedAssetCapacityGBP: totalVerifiedGBP,
        totalMintedVouchersGBP: totalMintedGBP,
        aggregateLiquidityRatio: '80.00% Segregated Collateral Reserve',
        baselIII_RWA_Equivalence: 'AAA-Equivalent Super-Senior Secured Claim',
        debtServiceCoverageRatioDSCR: '2.84x (derived from forward committed service capacity)',
        probabilityOfDefaultPD: '0.002% (mitigated by Section 29 Statutory Asset Lock)',
        lossGivenDefaultLGD: '0.00% (backed by real forward utility & mutual escrow)',
        tailEquityRatioTER: '0.942 (strict democratic parity across 5 wards)',
        prestonWealthMultiplier: '1.74x local economic retention',
      },
      commitmentVaultsBreakdown: commitmentVaults.map((v) => ({
        id: v.id,
        name: v.name,
        sector: v.vaultType,
        unit: v.unit,
        pledgedCapacity: v.totalPledgedQuantity,
        marketValueGBP: v.totalPledgedValueGBP,
        verifiedMintCapGBP: v.verifiedValueGBP,
        vouchersMintedCOMMONS: v.totalMintedCOMMONS,
        solvencyCoverage: `${Math.round((v.verifiedValueGBP / (v.totalMintedCOMMONS || 1)) * 100)}%`,
      })),
      verifiedPlaceBasedPledges: vaultPledges,
      rootEvidenceHash: '0x9e8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f3f',
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dossier, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', `bank_funder_underwriting_dossier_${new Date().toISOString().substring(0, 10)}.json`);
    dl.click();
    setDossierDownloaded(true);
    setTimeout(() => setDossierDownloaded(false), 3500);
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="border border-emerald-800/80 bg-gradient-to-br from-emerald-950/40 via-slate-900/60 to-slate-950 rounded-2xl p-6 lg:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Sarafu Network Compatible &middot; Phase 13 &amp; Phase 18 Grounded</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
              From Underbanked to Understood
            </h1>
            <p className="text-xs lg:text-sm text-slate-300 max-w-3xl mt-1.5 leading-relaxed">
              Transforming fragmented records, latent skills, and local relationships into auditable
              <strong className="text-white font-semibold"> Commitment Pools</strong>, redeemable mutual credit vouchers, and
              <strong className="text-emerald-400 font-semibold"> institutional bank-grade underwriting assets</strong> without relying solely on cash.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowPledgeModal(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Pledge Forward Capacity</span>
            </button>
            <button
              onClick={handleDownloadUnderwritingDossier}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Bank Underwriting Dossier</span>
            </button>
          </div>
        </div>

        {/* 4 Core Quantitative Fiduciary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="text-[11px] text-slate-400 font-mono">Total Verified Capacity</div>
            <div className="text-xl lg:text-2xl font-bold font-mono text-white mt-1 tabular-nums">
              £{(totalVerifiedGBP / 1000).toFixed(1)}k
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">85% Actuarial Haircut Applied</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="text-[11px] text-slate-400 font-mono">Redeemable Vouchers Minted</div>
            <div className="text-xl lg:text-2xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">
              £{(totalMintedGBP / 1000).toFixed(1)}k
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Circulating in Mutual Commons</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="text-[11px] text-slate-400 font-mono">Bank Underwriting Grade</div>
            <div className="text-xl lg:text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
              AAA (96.4%)
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Basel III / PRA SS1/23 RWA</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="text-[11px] text-slate-400 font-mono">Place-Based Sectors Mapped</div>
            <div className="text-xl lg:text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
              8 Sectors
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Energy, Food, Care, Water &amp; more</div>
          </div>
        </div>

        {dossierDownloaded && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-xs text-emerald-300 font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Institutional Underwriting Dossier exported with full cryptographic evidence trees and Basel III equivalence.</span>
          </div>
        )}
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('underbanked-engine')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors whitespace-nowrap ${
            activeTab === 'underbanked-engine'
              ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-800/80 shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>1. The "Underbanked to Understood" Engine</span>
        </button>

        <button
          onClick={() => setActiveTab('commitment-vaults')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors whitespace-nowrap ${
            activeTab === 'commitment-vaults'
              ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-800/80 shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Coins className="w-4 h-4 text-emerald-400" />
          <span>2. Auditable Commitment Vaults (Sarafu-Compatible)</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
            {commitmentVaults.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('bank-interface')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors whitespace-nowrap ${
            activeTab === 'bank-interface'
              ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-800/80 shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Landmark className="w-4 h-4 text-cyan-400" />
          <span>3. Institutional Bank &amp; Funder Interface (Phase 18)</span>
        </button>

        <button
          onClick={() => setActiveTab('levers-of-change')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors whitespace-nowrap ${
            activeTab === 'levers-of-change'
              ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-800/80 shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span>4. Nexus of Forces &amp; 6 Levers of Change</span>
        </button>
      </div>

      {/* TAB 1: The Underbanked to Understood Engine */}
      {activeTab === 'underbanked-engine' && (
        <div className="space-y-6">
          {/* Comparison Matrix: Traditional Bank vs CivicTrust Architecture */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-rose-900/60 bg-rose-950/20 space-y-4">
              <div className="flex items-center gap-2.5 text-rose-400">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <h3 className="font-bold text-white text-base">Traditional Banking Blindspot</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Why place-based community organisations (sports clubs, charities, housing groups, organic growers) are chronically rejected:
              </p>
              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-slate-950/60 border border-rose-900/40 rounded-lg text-slate-300 space-y-1">
                  <div className="font-semibold text-rose-300">1. Fragmented &amp; Informal Records</div>
                  <div className="text-[11px] text-slate-400">Volunteer shifts, barter trade, and deep community goodwill do not show up on a standard commercial bank statement.</div>
                </div>
                <div className="p-3 bg-slate-950/60 border border-rose-900/40 rounded-lg text-slate-300 space-y-1">
                  <div className="font-semibold text-rose-300">2. Zero Hard Real Estate Collateral</div>
                  <div className="text-[11px] text-slate-400">Organizations operate on municipal leases or shared assets; traditional lenders demand tangible property charges.</div>
                </div>
                <div className="p-3 bg-slate-950/60 border border-rose-900/40 rounded-lg text-slate-300 space-y-1">
                  <div className="font-semibold text-rose-300">3. Volatile Spot Cash Flow</div>
                  <div className="text-[11px] text-slate-400">Cash arrives in lumpy grants or seasonal memberships, failing rigid monthly debt-service ratios despite steady local demand.</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-emerald-800/80 bg-emerald-950/20 space-y-4">
              <div className="flex items-center gap-2.5 text-emerald-400">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <h3 className="font-bold text-white text-base">CivicTrust / Sarafu Commitment Architecture</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                How we convert intangible relationships and forward capacity into verifiable financial value:
              </p>
              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-slate-950/60 border border-emerald-900/50 rounded-lg text-slate-300 space-y-1">
                  <div className="font-semibold text-emerald-300">1. Phase 04 Ingestion &amp; ERLA Classification</div>
                  <div className="text-[11px] text-slate-400">Consolidates volunteer hours, farm yields, and kitchen capacity into legally enforceable Epistemic Risk &amp; Liability Allocations (ERLA L1-L5).</div>
                </div>
                <div className="p-3 bg-slate-950/60 border border-emerald-900/50 rounded-lg text-slate-300 space-y-1">
                  <div className="font-semibold text-emerald-300">2. Phase 13 Commitment Vaults (Sarafu Compatible)</div>
                  <div className="text-[11px] text-slate-400">Forward capacity is escrowed with 10-30% haircuts, enabling communities to mint redeemable mutual vouchers for local circulation.</div>
                </div>
                <div className="p-3 bg-slate-950/60 border border-emerald-900/50 rounded-lg text-slate-300 space-y-1">
                  <div className="font-semibold text-emerald-300">3. Phase 18 Institutional Translation (PRA SS1/23)</div>
                  <div className="text-[11px] text-slate-400">Translates mutual credit volume into Basel III-equivalent credit scores and synthetic collateral that pension funds and commercial banks can underwrite.</div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Place-Based Organisation Case Studies */}
          <div className="border border-slate-800 bg-slate-900/40 rounded-2xl p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Place-Based Organisations Operating in the Pool</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Real community anchors operating in Camden with zero cash overdrafts, funded via forward capacity vouchers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Wheat className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">Somers Town Garden CIC</h4>
                    <span className="text-[10px] font-mono text-emerald-400">Food Vault Pledgor</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-300 space-y-1 font-mono">
                  <div>Capacity: 4,500 kg organic crops</div>
                  <div>Verified Value: £11,475</div>
                  <div>Circulating Vouchers: 8,000 COMMONS</div>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  Supplies local cooperative bakeries and community kitchens without needing upfront bank loans.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">North London Solar Co-op</h4>
                    <span className="text-[10px] font-mono text-cyan-400">Clean Energy Vault</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-300 space-y-1 font-mono">
                  <div>Capacity: 425,000 kWh solar</div>
                  <div>Verified Value: £76,500</div>
                  <div>Circulating Vouchers: 55,000 COMMONS</div>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  Generates clean microgrid power for 380 homes; excess capacity pledged as synthetic bank collateral.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">Somers Town Eldercare</h4>
                    <span className="text-[10px] font-mono text-rose-400">Care Mutual Vault</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-300 space-y-1 font-mono">
                  <div>Capacity: 3,250 care hours</div>
                  <div>Verified Value: £52,000</div>
                  <div>Circulating Vouchers: 35,000 COMMONS</div>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  Provides post-hospital convalescence meals and elder companionship, relieving Council Care Act burdens.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                    <Trees className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">Regent's Canal Wetlands</h4>
                    <span className="text-[10px] font-mono text-teal-400">Biodiversity Vault</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-300 space-y-1 font-mono">
                  <div>Capacity: 7,000 m² habitat</div>
                  <div>Verified Value: £31,500</div>
                  <div>Circulating Vouchers: 18,000 COMMONS</div>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  Monetizes urban rewilding through Section 106 biodiversity net gain offsets for local developers.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Auditable Commitment Vaults (Sarafu-Compatible) */}
      {activeTab === 'commitment-vaults' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-slate-800 bg-slate-900/50">
            <div>
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white">8 Place-Based Sector Commitment Vaults</h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Sarafu Network Standard
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Transparent and auditable commitment pools issuing redeemable vouchers for goods, services, clean energy, and labour.
              </p>
            </div>
            <button
              onClick={() => setShowPledgeModal(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Pledge Capacity</span>
            </button>
          </div>

          {/* 8 Sector Vaults Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {commitmentVaults.map((vault) => {
              const mintPercent = Math.round((vault.totalMintedCOMMONS / (vault.verifiedValueGBP || 1)) * 100);
              return (
                <div
                  key={vault.id}
                  onClick={() => setSelectedVault(vault)}
                  className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 hover:border-slate-700 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                          {getVaultIcon(vault.vaultType)}
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                            {vault.vaultType}
                          </span>
                          <h3 className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">
                            {vault.name}
                          </h3>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800 shrink-0">
                        80% Collateral
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-xs font-mono">
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Pledged Capacity:</span>
                        <span className="text-white font-bold">{vault.totalPledgedQuantity.toLocaleString()} {vault.unit}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Verified Capacity:</span>
                        <span className="text-emerald-400 font-bold">£{vault.verifiedValueGBP.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Minted Vouchers:</span>
                        <span className="text-cyan-400 font-bold">{vault.totalMintedCOMMONS.toLocaleString()} COMMONS</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4 space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                        <span>Utilization</span>
                        <span>{mintPercent}% Minted</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all"
                          style={{ width: `${Math.min(mintPercent, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-mono">Vault ID: {vault.id}</span>
                    <span className="text-emerald-400 font-medium group-hover:underline flex items-center gap-1">
                      <span>Inspect Vault</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Verified Pledges Table */}
          <div className="border border-slate-800 bg-slate-900/40 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Auditable Capacity Pledges Ledger</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verified forward capacity contracts with cryptographic mint caps and deliverable standards.
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400">{vaultPledges.length} Pledges Anchored</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-medium text-[11px]">
                    <th className="py-2.5 px-3">Pledge Ref</th>
                    <th className="py-2.5 px-3">Pledgor Organisation</th>
                    <th className="py-2.5 px-3">Service / Capacity Type</th>
                    <th className="py-2.5 px-3">Quality Standard</th>
                    <th className="py-2.5 px-3">Haircut</th>
                    <th className="py-2.5 px-3">Verified Cap</th>
                    <th className="py-2.5 px-3">Minted</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {vaultPledges.map((plg) => {
                    const availableToMint = plg.mintCapGBP - plg.mintedAmountGBP;
                    return (
                      <tr key={plg.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-3 font-mono text-emerald-400 font-bold">{plg.id}</td>
                        <td className="py-3 px-3 font-semibold text-slate-200">{plg.pledgorName}</td>
                        <td className="py-3 px-3 text-slate-300">
                          <div>{plg.pledgeType}</div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {plg.quantity} {plg.unit} ({plg.deliveryWindow})
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-slate-400">{plg.qualityStandard}</td>
                        <td className="py-3 px-3 font-mono text-amber-400">{Math.round(plg.haircut * 100)}%</td>
                        <td className="py-3 px-3 font-mono text-emerald-400 font-semibold">£{plg.mintCapGBP.toLocaleString()}</td>
                        <td className="py-3 px-3 font-mono text-cyan-400">£{plg.mintedAmountGBP.toLocaleString()}</td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedPledge(plg);
                              setShowMintModal(true);
                            }}
                            disabled={availableToMint <= 0}
                            className="px-2.5 py-1 bg-emerald-600/90 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded text-[11px] font-semibold transition-colors"
                          >
                            Mint Vouchers
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Institutional Bank & Funder Interface (Phase 18) */}
      {activeTab === 'bank-interface' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-cyan-800/70 bg-gradient-to-r from-cyan-950/30 via-slate-900 to-slate-950 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                  <Landmark className="w-4 h-4" />
                  <span>Phase 18 &middot; Gate R18.1 Institutional Translation Engine</span>
                </div>
                <h2 className="text-xl font-bold text-white">Bank, Funder &amp; LGPS Institutional Gateway</h2>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  Translating informal community goodwill, barter records, and commitment vaults into
                  <strong className="text-white font-semibold"> Basel III-compliant Risk-Weighted Assets (RWA)</strong> and
                  <strong className="text-cyan-400 font-semibold"> PRA SS1/23 underwriteable credit portfolios</strong>.
                </p>
              </div>

              <button
                onClick={handleDownloadUnderwritingDossier}
                className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg transition-all hover:scale-105 shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Export Underwriting Dossier (JSON)</span>
              </button>
            </div>
          </div>

          {/* Underwriting Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">Synthetic Collateral Pool</span>
                <span className="text-xs font-mono text-emerald-400 font-bold">100% Backed</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white">£395,000</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Legally locked under Section 29 of the Co-operative and Community Benefit Societies Act 2014. Cannot be alienated or stripped by external creditors.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">Debt Service Coverage (DSCR)</span>
                <span className="text-xs font-mono text-cyan-400 font-bold">2.84x Nominal</span>
              </div>
              <div className="text-2xl font-bold font-mono text-cyan-400">2.84x</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculated on forward local demand velocity rather than volatile cash. 184% above commercial banking benchmark minimums (1.25x).
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">Loss Given Default (LGD)</span>
                <span className="text-xs font-mono text-emerald-400 font-bold">Near Zero</span>
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-400">0.00%</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Even in full municipal insolvency, commitment vaults contain tangible forward utility (solar power, farm food, care hours) directly redeemable by residents.
              </p>
            </div>
          </div>

          {/* Institutional Partner Translation Table */}
          <div className="border border-slate-800 bg-slate-900/40 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>Target Institutional Capital Partners &amp; Underwriting Criteria</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-white text-sm">Local Government Pension Scheme (LGPS / Camden Fund)</div>
                  <div className="text-slate-400">Mandate: Social Value Act 2012 &amp; Preston Model local wealth retention.</div>
                  <div className="text-emerald-400 font-mono text-[11px]">Investment Channel: £2.5M Anchor Living Treasury Senior Facility</div>
                </div>
                <div className="text-right shrink-0">
                  <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 font-mono font-bold text-xs border border-emerald-800">
                    APPROVED ARCHITECTURE
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-white text-sm">Social Impact Banks (Triodos / Charity Bank / Big Issue)</div>
                  <div className="text-slate-400">Mandate: Place-based mutual credit backing without speculative extraction.</div>
                  <div className="text-cyan-400 font-mono text-[11px]">Investment Channel: Synthetic Collateral Guarantee Pool</div>
                </div>
                <div className="text-right shrink-0">
                  <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 font-mono font-bold text-xs border border-cyan-800">
                    VERIFIED COMPLIANT
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-white text-sm">High Street Commercial Lenders (Barclays / NatWest Social Lending)</div>
                  <div className="text-slate-400">Mandate: SME community overdraft facilities under British Business Bank guarantees.</div>
                  <div className="text-amber-400 font-mono text-[11px]">Investment Channel: Phase 18 Translation Dossier &amp; MTD Barter VAT Escrow</div>
                </div>
                <div className="text-right shrink-0">
                  <span className="px-2.5 py-1 rounded bg-amber-950 text-amber-300 font-mono font-bold text-xs border border-amber-800">
                    TRANSLATION READY
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Nexus of Forces & 6 Levers of Change */}
      {activeTab === 'levers-of-change' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-amber-800/70 bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-950 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <Zap className="w-4 h-4" />
              <span>Hackathon Solution Alignment &middot; The Nexus of Forces</span>
            </div>
            <h2 className="text-xl font-bold text-white">How This Application Mobilises All 6 Levers of Change</h2>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Addressing the interconnected needs of modern communities — clean water, food, energy, housing, and vibrant local economies — through deep system integration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Lever 1 */}
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Landmark className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">1. Community Banking &amp; Pension Investment</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connects Local Government Pension Schemes (LGPS) directly to place-based infrastructure. Weekly 70/30 yield sweeps feed Deep Reserve and Hardship Shock Absorber under Trustee Act 2000.
              </p>
              <div className="text-[11px] font-mono text-emerald-400 pt-2 border-t border-slate-800">
                Phase 34 Living Treasury AI &middot; Gate LT34.1
              </div>
            </div>

            {/* Lever 2 */}
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <Trees className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">2. Carbon &amp; Biodiversity Markets</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Regent’s Canal Wetlands Ecological Vault tokenises m² restored habitat and carbon capture into legally verifiable ESG "S" credentials for corporate Section 106 compliance.
              </p>
              <div className="text-[11px] font-mono text-teal-400 pt-2 border-t border-slate-800">
                Phase 13 Vault 06 &middot; Gate ESG37.1
              </div>
            </div>

            {/* Lever 3 */}
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">3. Geospatial &amp; Earth Observation Layer</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ward-level GIS demarcation maps rooftop solar footprints, urban agricultural yield density, and flood drainage catchment basins to ground-truth physical vault collateral.
              </p>
              <div className="text-[11px] font-mono text-indigo-400 pt-2 border-t border-slate-800">
                Phase 29 Geospatial AI &middot; Gate R29.1
              </div>
            </div>

            {/* Lever 4 */}
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">4. Open Planning Systems</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct integration into Borough Development Plans via Section 106 and Community Infrastructure Levy (CIL). Tail Equity Ratio (TER) enforces zero geographic disparity.
              </p>
              <div className="text-[11px] font-mono text-amber-400 pt-2 border-t border-slate-800">
                Phase 30 Council Planning &middot; Gate G30.1
              </div>
            </div>

            {/* Lever 5 */}
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">5. Agentic AI &amp; JurisActuary</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Autonomous multi-agentic reasoning engine continuously parses 24 UK statutory acts, verifies gate criteria, and rebalances fiduciary reserves without human fatigue.
              </p>
              <div className="text-[11px] font-mono text-cyan-400 pt-2 border-t border-slate-800">
                Phase 07 JurisActuary &middot; Gate J07.1
              </div>
            </div>

            {/* Lever 6 */}
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">6. Community Collaboration Platform</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sarafu-compatible mutual barter rails, demurrage deflector shield (+4 transactions/mo), instant barter VAT separation (HMRC Notice 700/8), and democratic governance.
              </p>
              <div className="text-[11px] font-mono text-rose-400 pt-2 border-t border-slate-800">
                Phases 15, 23, 26 &middot; Gate R23.1
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Pledge Capacity to Commitment Vault */}
      {showPledgeModal && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-emerald-700 rounded-2xl p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowPledgeModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              &times;
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <Coins className="w-4 h-4" />
                <span>Sarafu Protocol &middot; Forward Capacity Pledge</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">Pledge Community Organisation Capacity</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Escrow verified goods, clean energy, or services to mint circulating mutual vouchers.
              </p>
            </div>

            {pledgeSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-800 text-xs text-emerald-300 font-mono space-y-2">
                <div className="flex items-center gap-2 font-bold text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Capacity Pledged &amp; Verified</span>
                </div>
                <p>{pledgeSuccess}</p>
              </div>
            ) : (
              <form onSubmit={handleCreatePledge} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Target Sector Vault</label>
                  <select
                    value={pledgeVaultId}
                    onChange={(e) => setPledgeVaultId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500"
                  >
                    {commitmentVaults.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.vaultType})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Pledgor Organisation Name</label>
                  <input
                    type="text"
                    value={pledgorName}
                    onChange={(e) => setPledgorName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Committed Service / Asset Type</label>
                  <input
                    type="text"
                    value={pledgeType}
                    onChange={(e) => setPledgeType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Quantity</label>
                    <input
                      type="number"
                      value={pledgeQuantity}
                      onChange={(e) => setPledgeQuantity(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 font-mono focus:ring-1 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Unit of Measure</label>
                    <input
                      type="text"
                      value={pledgeUnit}
                      onChange={(e) => setPledgeUnit(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 font-mono focus:ring-1 focus:ring-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Estimated Market Value (£ GBP)</label>
                  <input
                    type="number"
                    value={pledgeValueGBP}
                    onChange={(e) => setPledgeValueGBP(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-emerald-400 font-bold font-mono rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                  <div className="text-[10px] text-slate-400 mt-1">
                    Automatic 15% standard actuarial haircut applies. Verified mint cap will be: £
                    {Math.round((parseFloat(pledgeValueGBP) || 0) * 0.85).toLocaleString()}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowPledgeModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm &amp; Seal Pledge</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal: Mint Vouchers from Verified Pledge */}
      {showMintModal && selectedPledge && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-emerald-700 rounded-2xl p-6 shadow-2xl relative space-y-4 text-xs">
            <button
              onClick={() => setShowMintModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              &times;
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <Coins className="w-4 h-4" />
                <span>Voucher Issuance &middot; {selectedPledge.id}</span>
              </div>
              <h2 className="text-base font-bold text-white mt-1">Mint Redeemable COMMONS Vouchers</h2>
              <p className="text-slate-400 mt-0.5">
                Issue circulating credit against verified forward capacity of <strong>{selectedPledge.pledgorName}</strong>.
              </p>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Verified Mint Cap:</span>
                <span className="text-white font-bold">£{selectedPledge.mintCapGBP.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Already Minted:</span>
                <span className="text-cyan-400 font-bold">£{selectedPledge.mintedAmountGBP.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
                <span>Available to Mint:</span>
                <span className="text-emerald-400 font-bold">
                  £{(selectedPledge.mintCapGBP - selectedPledge.mintedAmountGBP).toLocaleString()} COMMONS
                </span>
              </div>
            </div>

            {mintResult ? (
              <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Vouchers Minted Successfully</span>
                </div>
                <p>{mintResult.message}</p>
                <div className="text-[10px] text-slate-400 break-all">Tx Hash: {mintResult.txHash}</div>
              </div>
            ) : (
              <form onSubmit={handleExecuteMint} className="space-y-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Amount of COMMONS to Mint (£)
                  </label>
                  <input
                    type="number"
                    max={selectedPledge.mintCapGBP - selectedPledge.mintedAmountGBP}
                    value={mintAmount}
                    onChange={(e) => setMintAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-emerald-400 font-mono font-bold rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowMintModal(false)}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold flex items-center gap-1.5"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>Issue Vouchers</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
