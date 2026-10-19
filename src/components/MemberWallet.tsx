// src/components/MemberWallet.tsx
import React, { useState } from 'react';
import { useCivicTrust } from '../context/CivicTrustContext';
import { PriorityQueueClaim } from '../types';
import {
  Wallet,
  ShieldCheck,
  Send,
  Lock,
  HeartHandshake,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRightLeft,
  Sparkles,
  RefreshCw,
  Building2,
  Coins,
  Key,
  Users,
  Bell,
  Eye,
  Sliders,
  FileText,
  Plus,
  Scale,
  Shield,
  Smartphone,
  Globe,
} from 'lucide-react';

export const MemberWallet: React.FC = () => {
  const {
    citizenAccount,
    payMerchant,
    pledgeToVault,
    swapCredits,
    submitHardshipClaim,
  } = useCivicTrust();

  const [activeTab, setActiveTab] = useState<'wallet' | 'settings' | 'disputes'>('wallet');

  // Swap State
  const [swapDirection, setSwapDirection] = useState<'MUNI_TO_COMMONS' | 'COMMONS_TO_MUNI'>('MUNI_TO_COMMONS');
  const [swapAmount, setSwapAmount] = useState('50');
  const [swapResult, setSwapResult] = useState<{
    success: boolean;
    receivedAmount: number;
    bonusRate: number;
    txHash: string;
    message: string;
  } | null>(null);

  // Pay Merchant State
  const [merchantAmount, setMerchantAmount] = useState('');
  const [selectedMerchant, setSelectedMerchant] = useState('Somers Town Cooperative Bakery');
  const [paymentResult, setPaymentResult] = useState<{ success: boolean; message: string } | null>(null);

  // Vault Pledge State
  const [vaultAmount, setVaultAmount] = useState('');
  const [vaultPledgeResult, setVaultPledgeResult] = useState<string | null>(null);

  // Hardship Modal State
  const [showHardshipModal, setShowHardshipModal] = useState(false);
  const [hardshipCategory, setHardshipCategory] = useState<PriorityQueueClaim['category']>('FOOD_ESSENTIAL');
  const [hardshipAmount, setHardshipAmount] = useState('150');
  const [hardshipReason, setHardshipReason] = useState('');
  const [hardshipSubmitted, setHardshipSubmitted] = useState(false);

  // WebAuthn Passkeys State (Part 12)
  const [passkeys, setPasskeys] = useState<{ id: string; deviceType: string; createdAt: string; counter: number }[]>([
    { id: 'cred-01', deviceType: 'Apple TouchID / FaceID Secure Enclave', createdAt: '2026-09-12', counter: 142 },
    { id: 'cred-02', deviceType: 'YubiKey 5 NFC Hardware FIDO2', createdAt: '2026-10-01', counter: 48 },
  ]);
  const [passkeyNotice, setPasskeyNotice] = useState<string | null>(null);

  // Guardians State (Part 12)
  const [guardians, setGuardians] = useState<{ id: string; name: string; relation: string; status: 'ACTIVE' | 'PENDING' }[]>([
    { id: 'g-01', name: 'Tomas R. (Makers Guild)', relation: 'Community Mentor', status: 'ACTIVE' },
    { id: 'g-02', name: 'Priya M. (Care Collective)', relation: 'Neighbourhood Trustee', status: 'PENDING' },
  ]);
  const [newGuardianName, setNewGuardianName] = useState('');
  const [newGuardianRelation, setNewGuardianRelation] = useState('');
  const [showAddGuardianModal, setShowAddGuardianModal] = useState(false);

  // Notification Preferences State (Part 4 & 12)
  const [notificationPrefs, setNotificationPrefs] = useState({
    email_enabled: true,
    sms_enabled: true,
    push_enabled: false,
    in_app_enabled: true,
    digest_frequency: 'DAILY',
    language: 'en',
  });

  // Accessibility State (Part 12)
  const [accessibility, setAccessibility] = useState({
    largeText: false,
    highContrast: false,
    reduceMotion: false,
    simpleMode: false,
  });

  // Disputes State (Part 3 & 12)
  const [disputes, setDisputes] = useState<{
    id: string;
    caseReference: string;
    type: 'PAYMENT' | 'CREDIT_SCORE' | 'VALUATION' | 'MONITORING' | 'FAIRNESS';
    description: string;
    amountGBP?: number;
    status: 'OPEN' | 'UNDER_MEDIATION' | 'RESOLVED' | 'APPEALED' | 'CLOSED';
    openedAt: string;
    resolution?: string;
  }[]>([
    {
      id: 'disp-01',
      caseReference: 'DIS-20261014-998A',
      type: 'PAYMENT',
      description: 'Disputed £14.20 coffee supply charge; batch delivery delayed by 4 days due to logistics bottleneck.',
      amountGBP: 14.20,
      status: 'RESOLVED',
      openedAt: '2026-10-14',
      resolution: 'Mutual credit balance recredited in full under Social Value Mediation Protocol.',
    },
    {
      id: 'disp-02',
      caseReference: 'DIS-20261016-121B',
      type: 'VALUATION',
      description: 'Dispute haircut on 15 hours joinery pledge from 30% to 20% following master craft verification.',
      amountGBP: 60.00,
      status: 'UNDER_MEDIATION',
      openedAt: '2026-10-16',
    },
  ]);

  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [newDisputeType, setNewDisputeType] = useState<'PAYMENT' | 'CREDIT_SCORE' | 'VALUATION' | 'MONITORING' | 'FAIRNESS'>('PAYMENT');
  const [newDisputeAmount, setNewDisputeAmount] = useState('');
  const [newDisputeDesc, setNewDisputeDesc] = useState('');
  const [newDisputeRef, setNewDisputeRef] = useState('');

  const localMerchants = [
    'Somers Town Cooperative Bakery',
    'Camden Green Grocers Collective',
    'Regent Books & Stationery CIC',
    'Euston Community Bike Repair',
    'Chalk Farm Organic Apothecary',
  ];

  // Live swap simulation calculations
  const parsedSwapAmount = parseFloat(swapAmount) || 0;
  const isMuniToCommons = swapDirection === 'MUNI_TO_COMMONS';
  const greenBonusRate = isMuniToCommons ? 0.025 : 0.0; // 2.5% green municipal rebate
  const simulatedReceived = parsedSwapAmount * (1 + greenBonusRate);

  const handleExecuteSwap = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedSwapAmount <= 0) return;

    const fromType = isMuniToCommons ? 'MUNICIPAL' : 'COMMONS';
    const toType = isMuniToCommons ? 'COMMONS' : 'MUNICIPAL';

    const res = swapCredits(fromType, toType, parsedSwapAmount);
    setSwapResult(res);

    if (res.success) {
      setSwapAmount('');
    }
    setTimeout(() => setSwapResult(null), 6000);
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(merchantAmount);
    if (isNaN(amt) || amt <= 0) return;

    const res = payMerchant(amt, selectedMerchant);
    setPaymentResult(res);
    if (res.success) {
      setMerchantAmount('');
    }
    setTimeout(() => setPaymentResult(null), 5000);
  };

  const handlePledge = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(vaultAmount);
    if (isNaN(amt) || amt <= 0) return;

    pledgeToVault(amt);
    setVaultPledgeResult(`Pledged £${amt.toFixed(2)} to Community Solar Vault.`);
    setVaultAmount('');
    setTimeout(() => setVaultPledgeResult(null), 4000);
  };

  const handleHardshipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(hardshipAmount);
    if (isNaN(amt) || amt <= 0) return;

    submitHardshipClaim(hardshipCategory, amt, hardshipReason);
    setHardshipSubmitted(true);
    setTimeout(() => {
      setHardshipSubmitted(false);
      setShowHardshipModal(false);
      setHardshipReason('');
    }, 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Wallet className="w-5 h-5 text-emerald-400" />
            <span>Citizen Member Wallet & Municipal Swap</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Non-speculative community currency. 100% matched by segregated UK bank deposits with automatic velocity demurrage protection.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Member:</span>
          <span className="text-slate-400">{citizenAccount.memberNumber}</span>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-mono">
        <button
          onClick={() => setActiveTab('wallet')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'wallet'
              ? 'bg-emerald-600 text-white shadow-lg'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Wallet className="w-3.5 h-3.5" />
          <span>1. Wallet &amp; Municipal Swap</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'bg-emerald-600 text-white shadow-lg'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>2. Security &amp; WebAuthn Passkeys ({passkeys.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('disputes')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'disputes'
              ? 'bg-emerald-600 text-white shadow-lg'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>3. Member Disputes &amp; Dockets ({disputes.length})</span>
        </button>
      </div>

      {passkeyNotice && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{passkeyNotice}</span>
          </div>
          <button onClick={() => setPasskeyNotice(null)} className="underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* 1. WALLET VIEW */}
      {activeTab === 'wallet' && (
        <div className="space-y-8">
          {/* Account Balances Card (4 columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-1.5">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-emerald-400" />
            <span>Local Commons Balance</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            £{citizenAccount.commonsBalance.toFixed(2)}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>1:1 Fiduciary Escrow Backed</span>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-1.5">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Municipal Council Credit</span>
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-300 tabular-nums">
            £{citizenAccount.municipalCreditBalance.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400">
            Camden Council Civic Grant Line
          </div>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-1.5">
          <div className="text-xs text-slate-400">Demurrage Deflector</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            0.0% / mo
          </div>
          <div className="text-[11px] text-slate-300">
            Active: <strong>{citizenAccount.localPurchasesThisMonth}</strong> local purchases this month.
          </div>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-1.5">
          <div className="text-xs text-slate-400">Active Vault Pledge</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">
            £{citizenAccount.activeVaultPledgeGBP.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400">
            Camden Solar Clean Energy
          </div>
        </div>
      </div>

      {/* Secure 'Swap' Interface (Live Rate Simulation) */}
      <div className="border border-indigo-800/80 bg-slate-900/60 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
              <span>Secure Municipal & Local Commons Swap (Live Rate Simulation)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Instant, fee-free conversion between Municipal Council Credits and Local Commons with live green incentive simulation.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Base Parity:</span>
            <span className="text-emerald-400 font-bold">1.000 : 1.000 GBP</span>
          </div>
        </div>

        <form onSubmit={handleExecuteSwap} className="pt-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* From Box (5 cols) */}
            <div className="md:col-span-5 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">From Account</span>
                <span className="font-mono text-slate-400">
                  Avail:{' '}
                  <strong className="text-white">
                    £
                    {isMuniToCommons
                      ? citizenAccount.municipalCreditBalance.toFixed(2)
                      : citizenAccount.commonsBalance.toFixed(2)}
                  </strong>
                </span>
              </div>

              <div className="text-sm font-bold text-white">
                {isMuniToCommons ? 'Municipal Council Credits' : 'Local Commons Currency'}
              </div>

              <div className="pt-2">
                <input
                  type="number"
                  value={swapAmount}
                  onChange={(e) => setSwapAmount(e.target.value)}
                  placeholder="0.00"
                  min="1"
                  step="0.50"
                  max={
                    isMuniToCommons
                      ? citizenAccount.municipalCreditBalance
                      : citizenAccount.commonsBalance
                  }
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex gap-1.5 pt-1">
                {['25', '50', '100'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setSwapAmount(val)}
                    className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                  >
                    £{val}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setSwapAmount(
                      isMuniToCommons
                        ? citizenAccount.municipalCreditBalance.toString()
                        : citizenAccount.commonsBalance.toString()
                    )
                  }
                  className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 font-semibold"
                >
                  Max
                </button>
              </div>
            </div>

            {/* Swap direction toggle (2 cols) */}
            <div className="md:col-span-2 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  setSwapDirection((prev) =>
                    prev === 'MUNI_TO_COMMONS' ? 'COMMONS_TO_MUNI' : 'MUNI_TO_COMMONS'
                  );
                }}
                className="p-3 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-400 hover:text-white transition-all transform hover:rotate-180"
                title="Switch swap direction"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            {/* To Box (5 cols) */}
            <div className="md:col-span-5 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">To Account (Simulated)</span>
                {isMuniToCommons && (
                  <span className="font-mono text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>+2.5% Green Bonus</span>
                  </span>
                )}
              </div>

              <div className="text-sm font-bold text-white">
                {isMuniToCommons ? 'Local Commons Currency' : 'Municipal Council Credits'}
              </div>

              <div className="pt-2">
                <div className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-emerald-400 font-mono font-bold">
                  £{simulatedReceived.toFixed(2)}
                </div>
              </div>

              <div className="text-[11px] text-slate-500 font-mono pt-1">
                {isMuniToCommons
                  ? 'Includes £' + (parsedSwapAmount * 0.025).toFixed(2) + ' Council Green Rebate'
                  : '1:1 Direct Municipal Parity'}
              </div>
            </div>
          </div>

          {/* Simulation Rate Details Strip */}
          <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div>
              <span className="text-slate-500 block text-[10px]">Exchange Rate</span>
              <span className="text-slate-200 font-semibold">
                1 : {isMuniToCommons ? '1.025' : '1.000'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Processing Fee</span>
              <span className="text-emerald-400 font-semibold">£0.00 (Zero Fee)</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Slippage / Spread</span>
              <span className="text-slate-200 font-semibold">0.00% (Guaranteed)</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Settlement Time</span>
              <span className="text-cyan-400 font-semibold">Instant (In-Memory)</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={parsedSwapAmount <= 0}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
          >
            Execute Instant Secure Swap
          </button>

          {swapResult && (
            <div
              className={`p-3.5 rounded-lg border text-xs flex items-center justify-between ${
                swapResult.success
                  ? 'bg-emerald-950/70 border-emerald-800 text-emerald-300'
                  : 'bg-rose-950/70 border-rose-800 text-rose-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {swapResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{swapResult.message}</span>
              </div>
              {swapResult.txHash && (
                <span className="font-mono text-[10px] text-slate-400 hidden sm:block">
                  Tx: {swapResult.txHash.substring(0, 14)}...
                </span>
              )}
            </div>
          )}
        </form>
      </div>

      {/* Emergency Hardship Grant Trigger Banner */}
      <div className="p-5 rounded-xl border border-emerald-800/60 bg-emerald-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-emerald-400" />
            <span>Need Emergency Welfare or Hardship Relief?</span>
          </h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Zero-stigma, dignity-first assistance for emergency food, medicine, winter heating, or rent arrears funded by the Solidarity Fund.
          </p>
        </div>
        <button
          onClick={() => setShowHardshipModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold whitespace-nowrap transition-colors"
        >
          Request Hardship Grant
        </button>
      </div>

      {/* Two Action Columns: Pay Merchant vs Pledge to Vault */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pay Local Merchant Form */}
        <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6">
          <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <Send className="w-4 h-4 text-emerald-400" />
            <span>Pay Local High Street Merchant</span>
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Zero transaction fees for merchants and automatically extends your demurrage fee waiver.
          </p>

          <form onSubmit={handlePay} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Select Registered Business</label>
              <select
                value={selectedMerchant}
                onChange={(e) => setSelectedMerchant(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {localMerchants.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Amount (£ Local Credits)</label>
              <input
                type="number"
                value={merchantAmount}
                onChange={(e) => setMerchantAmount(e.target.value)}
                placeholder="e.g. 14.50"
                min="0.50"
                step="0.01"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors"
            >
              Transfer Credits Instantly
            </button>

            {paymentResult && (
              <div
                className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                  paymentResult.success
                    ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                    : 'bg-rose-950/60 border-rose-800 text-rose-300'
                }`}
              >
                {paymentResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{paymentResult.message}</span>
              </div>
            )}
          </form>
        </div>

        {/* Commitment Vault Pledge Form */}
        <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6">
          <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>Pledge to Community Commitment Vault</span>
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Lock credits to back physical community assets (clean energy, food co-ops) and earn local civic rewards.
          </p>

          <form onSubmit={handlePledge} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Commitment Vault Target</label>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="font-semibold text-slate-200">Camden Rooftop Community Solar Vault</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Asset-locked under BenCom Rule 29 · Guaranteed 1:1 redemption</div>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Pledge Amount (£)</label>
              <input
                type="number"
                value={vaultAmount}
                onChange={(e) => setVaultAmount(e.target.value)}
                placeholder="e.g. 50.00"
                min="5"
                step="5"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg transition-colors"
            >
              Underwrite Community Asset
            </button>

            {vaultPledgeResult && (
              <div className="p-3 bg-cyan-950/60 border border-cyan-800 rounded-lg text-cyan-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{vaultPledgeResult}</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )}

      {/* 2. SETTINGS VIEW (WebAuthn, Guardians, Preferences, Accessibility) */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Security & WebAuthn Passkeys */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Key className="w-4 h-4 text-emerald-400" />
                  <span>Hardware &amp; Biometric Passkeys (FIDO2 / WebAuthn)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Passwordless authentication backed by device secure enclaves. Phishing-resistant standard.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newCred = {
                    id: `cred-${Date.now()}`,
                    deviceType: 'Biometric Authenticator (FIDO2 Level 2)',
                    createdAt: new Date().toISOString().slice(0, 10),
                    counter: 1,
                  };
                  setPasskeys([...passkeys, newCred]);
                  setPasskeyNotice('Successfully registered new WebAuthn FIDO2 Biometric Passkey!');
                  setTimeout(() => setPasskeyNotice(null), 4000);
                }}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Register Passkey</span>
              </button>
            </div>

            <div className="space-y-2 pt-1">
              {passkeys.map((p) => (
                <div
                  key={p.id}
                  className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <strong className="text-white block font-sans">{p.deviceType}</strong>
                      <span className="text-slate-500 text-[10px]">Added on {p.createdAt} &middot; Counter: {p.counter}</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    VERIFIED
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Trusted Guardians (Social Recovery) */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>Trusted Community Guardians (Social Recovery)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Trusted community members who can verify your identity and assist account recovery if your hardware device is lost.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddGuardianModal(true)}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border border-slate-700"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Guardian</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {guardians.map((g) => (
                <div key={g.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <div>
                    <strong className="text-white font-sans block">{g.name}</strong>
                    <span className="text-slate-400 text-[11px]">{g.relation}</span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      g.status === 'ACTIVE'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {g.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Multilingual Notification Preferences */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                <span>Multilingual Notification Channels &amp; Preferences</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure communication channels for welfare dispatches, voucher expirations, and community votes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <span className="text-slate-400 block uppercase font-bold text-[10px]">Active Channels</span>
                {[
                  { key: 'email_enabled', label: 'Email Confirmations' },
                  { key: 'sms_enabled', label: 'SMS / Text Dispatches (GSM)' },
                  { key: 'push_enabled', label: 'Push Notifications (Web)' },
                  { key: 'in_app_enabled', label: 'In-App Alerts' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center justify-between cursor-pointer py-1 border-b border-slate-900 last:border-0">
                    <span className="text-slate-300">{label}</span>
                    <input
                      type="checkbox"
                      checked={(notificationPrefs as any)[key]}
                      onChange={(e) =>
                        setNotificationPrefs({ ...notificationPrefs, [key]: e.target.checked })
                      }
                      className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0 cursor-pointer"
                    />
                  </label>
                ))}
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <span className="text-slate-400 block uppercase font-bold text-[10px]">Preferred Language</span>
                <div>
                  <label className="text-slate-400 text-[11px] block mb-1">UI &amp; Notice Translation</label>
                  <select
                    value={notificationPrefs.language}
                    onChange={(e) => setNotificationPrefs({ ...notificationPrefs, language: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 text-xs font-mono"
                  >
                    <option value="en">English (UK)</option>
                    <option value="cy">Welsh / Cymraeg</option>
                    <option value="pl">Polish / Polski</option>
                    <option value="ur">Urdu / اردو</option>
                    <option value="bn">Bengali / বাংলা</option>
                    <option value="so">Somali / Soomaaliga</option>
                  </select>
                </div>

                <div className="pt-2 text-slate-400 text-[11px]">
                  <span>Digest Frequency: </span>
                  <strong className="text-emerald-400">{notificationPrefs.digest_frequency}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Universal Accessibility Controls */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-400" />
                <span>Universal Accessibility Controls (WCAG 2.1 AA)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Ensuring full cognitive, motor, and visual dignity for all community members.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
              {[
                { key: 'largeText', label: 'Large Text (125%)' },
                { key: 'highContrast', label: 'High Contrast Mode' },
                { key: 'reduceMotion', label: 'Reduced Motion' },
                { key: 'simpleMode', label: 'Simplified Plain View' },
              ].map(({ key, label }) => (
                <div key={key} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">{label}</span>
                  <input
                    type="checkbox"
                    checked={(accessibility as any)[key]}
                    onChange={(e) => setAccessibility({ ...accessibility, [key]: e.target.checked })}
                    className="rounded border-slate-700 bg-slate-900 text-purple-500 focus:ring-0 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. DISPUTES VIEW (Part 3 & 12) */}
      {activeTab === 'disputes' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-400" />
                <span>Member Disputes &amp; Evidence Dockets</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Civil Evidence Act 1995 formal arbitration dockets. 7-day appeal windows with cryptographically anchored evidence.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowDisputeModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>File New Formal Dispute</span>
            </button>
          </div>

          <div className="space-y-3">
            {disputes.map((d) => (
              <div
                key={d.id}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-emerald-400">{d.caseReference}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      d.status === 'RESOLVED'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : d.status === 'UNDER_MEDIATION'
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {d.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span>Type: <strong className="text-white">{d.type}</strong></span>
                  {d.amountGBP && (
                    <>
                      <span>&middot;</span>
                      <span>Amount: <strong className="text-emerald-400">£{d.amountGBP.toFixed(2)}</strong></span>
                    </>
                  )}
                  <span>&middot;</span>
                  <span>Opened: {d.openedAt}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{d.description}</p>

                {d.resolution && (
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs font-mono text-emerald-300 space-y-1">
                    <strong className="block text-[10px] text-slate-400 uppercase font-sans">Mediator Resolution Verdict</strong>
                    <span>{d.resolution}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Guardian Modal */}
      {showAddGuardianModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Add Trusted Community Guardian</h3>
              <button onClick={() => setShowAddGuardianModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                &times;
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newGuardianName) return;
                setGuardians([
                  ...guardians,
                  {
                    id: `g-${Date.now()}`,
                    name: newGuardianName,
                    relation: newGuardianRelation || 'Trusted Peer',
                    status: 'PENDING',
                  },
                ]);
                setNewGuardianName('');
                setNewGuardianRelation('');
                setShowAddGuardianModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="text-slate-400 block mb-1">Guardian Full Name / Member ID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David L. (Somers Town Housing Co-op)"
                  value={newGuardianName}
                  onChange={(e) => setNewGuardianName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2.5 font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Relationship</label>
                <input
                  type="text"
                  placeholder="e.g. Tenancy Representative / Neighbour"
                  value={newGuardianRelation}
                  onChange={(e) => setNewGuardianRelation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2.5 font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddGuardianModal(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg"
                >
                  Add Guardian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* File Dispute Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-400" />
                <span>File Formal Member Dispute Docket</span>
              </h3>
              <button onClick={() => setShowDisputeModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                &times;
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newDisputeDesc) return;
                const newCaseRef = `DIS-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(
                  1000 + Math.random() * 9000
                )}`;
                setDisputes([
                  {
                    id: `disp-${Date.now()}`,
                    caseReference: newCaseRef,
                    type: newDisputeType,
                    description: newDisputeDesc,
                    amountGBP: newDisputeAmount ? parseFloat(newDisputeAmount) : undefined,
                    status: 'OPEN',
                    openedAt: new Date().toISOString().slice(0, 10),
                  },
                  ...disputes,
                ]);
                setNewDisputeDesc('');
                setNewDisputeAmount('');
                setNewDisputeRef('');
                setShowDisputeModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="text-slate-400 block mb-1">Dispute Classification</label>
                <select
                  value={newDisputeType}
                  onChange={(e) => setNewDisputeType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2.5 font-mono"
                >
                  <option value="PAYMENT">Payment / Transaction Discrepancy</option>
                  <option value="CREDIT_SCORE">Community Credit Score Adjustment</option>
                  <option value="VALUATION">Voucher Haircut &amp; Valuation Formula</option>
                  <option value="MONITORING">Telemetry &amp; Verification Challenge</option>
                  <option value="FAIRNESS">Equal Protection / Fairness Breach</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Subject Reference (TX/Pledge)</label>
                  <input
                    type="text"
                    placeholder="e.g. TX-99214 or PLG-08"
                    value={newDisputeRef}
                    onChange={(e) => setNewDisputeRef(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2.5 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Disputed Amount (£)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 50.00"
                    value={newDisputeAmount}
                    onChange={(e) => setNewDisputeAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2.5 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Factual Description &amp; Evidence Basis</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail the timeline, transactions, and facts for the independent dispute panel..."
                  value={newDisputeDesc}
                  onChange={(e) => setNewDisputeDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2.5 font-mono leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDisputeModal(false)}
                  className="px-3.5 py-2 bg-slate-800 text-slate-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg cursor-pointer"
                >
                  File Dispute Docket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hardship Modal */}
      {showHardshipModal && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowHardshipModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-emerald-400" />
                <span>Confidential Emergency Hardship Claim</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Care Act 2014 statutory dignity guarantee. Verified automatically without credit score impairment.
              </p>
            </div>

            <form onSubmit={handleHardshipSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Assistance Category</label>
                <select
                  value={hardshipCategory}
                  onChange={(e) => setHardshipCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="FOOD_ESSENTIAL">Emergency Food & Nutrition</option>
                  <option value="EMERGENCY_UTILITY">Winter Heating & Utility Bills</option>
                  <option value="MEDICAL_PRESCRIPTION">Medical Prescriptions & Care Essentials</option>
                  <option value="HOUSING_ARREARS">Emergency Housing & Tenancy Shield</option>
                  <option value="GENERAL_HARDSHIP">General Urgent Hardship</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Requested Amount (£ GBP)</label>
                <input
                  type="number"
                  value={hardshipAmount}
                  onChange={(e) => setHardshipAmount(e.target.value)}
                  min="20"
                  max="500"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">Maximum immediate grant line: £500.00</span>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Brief Description (Optional)</label>
                <textarea
                  value={hardshipReason}
                  onChange={(e) => setHardshipReason(e.target.value)}
                  placeholder="e.g. Sudden boiler breakdown or medical prescription shortfall..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors"
              >
                Submit Claim to Priority Welfare Queue
              </button>

              {hardshipSubmitted && (
                <div className="p-3 bg-emerald-950 border border-emerald-800 rounded-lg text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Claim received! Equity score evaluated (0.984). Routing to instant disbursement.</span>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
