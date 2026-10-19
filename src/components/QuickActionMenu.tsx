// src/components/QuickActionMenu.tsx
import React, { useState } from 'react';
import { useCivicTrust } from '../context/CivicTrustContext';
import { DisputeCase } from '../types';
import {
  ShieldAlert,
  Gavel,
  AlertOctagon,
  X,
  CheckCircle2,
  Lock,
  ArrowRightLeft,
  FileText,
  AlertTriangle,
  Zap,
  ChevronUp,
} from 'lucide-react';

export const QuickActionMenu: React.FC = () => {
  const {
    systemStatus,
    triggerEmergencyHalt,
    fileDispute,
    citizenAccount,
    generateAuditBundle,
  } = useCivicTrust();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showHaltModal, setShowHaltModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [haltSuccess, setHaltSuccess] = useState<string | null>(null);
  const [disputeSuccess, setDisputeSuccess] = useState<DisputeCase | null>(null);

  // Emergency Halt Form State
  const [haltTier, setHaltTier] = useState<1 | 2 | 3 | 4>(2);
  const [haltReason, setHaltReason] = useState('Abnormal liquidity velocity detected on external gateway.');
  const [haltConfirmation, setHaltConfirmation] = useState('');

  // Dispute Filing Form State
  const [disputeCategory, setDisputeCategory] = useState<DisputeCase['category']>('BARTER_VAT_DISCREPANCY');
  const [claimantName, setClaimantName] = useState(citizenAccount.name);
  const [claimantId, setClaimantId] = useState(citizenAccount.memberNumber);
  const [disputedAmount, setDisputedAmount] = useState('25.00');
  const [disputeDescription, setDisputeDescription] = useState('Reconciliation difference between barter gross POS voucher and HMRC MTD VAT split.');
  const [evidenceRef, setEvidenceRef] = useState('TX-REF-9042');

  const handleExecuteHalt = (e: React.FormEvent) => {
    e.preventDefault();
    if (haltConfirmation !== 'HALT') return;

    triggerEmergencyHalt(haltTier, haltReason);
    setHaltSuccess(`Circuit Breaker Tier ${haltTier} engaged. Status updated.`);
    setHaltConfirmation('');
    setTimeout(() => {
      setHaltSuccess(null);
      setShowHaltModal(false);
      setMenuOpen(false);
    }, 3000);
  };

  const handleExecuteDispute = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(disputedAmount);

    const dispute = fileDispute(
      disputeCategory,
      claimantName,
      claimantId,
      disputeDescription,
      isNaN(amountNum) ? undefined : amountNum,
      evidenceRef
    );

    setDisputeSuccess(dispute);
    setTimeout(() => {
      setDisputeSuccess(null);
      setShowDisputeModal(false);
      setMenuOpen(false);
    }, 4000);
  };

  const handleQuickDownloadAudit = () => {
    const bundleJSON = generateAuditBundle();
    const blob = new Blob([bundleJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `civictrust-defense-dossier-${new Date().toISOString().substring(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setMenuOpen(false);
  };

  return (
    <>
      {/* Floating Action Menu Container */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {/* Speed Dial Menu Items */}
        {menuOpen && (
          <div className="flex flex-col items-end gap-2.5 animate-in fade-in slide-in-from-bottom-4 duration-200">
            {/* Quick Action: Emergency Halt */}
            <button
              onClick={() => {
                setShowHaltModal(true);
                setMenuOpen(false);
              }}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-rose-950/90 hover:bg-rose-900 border border-rose-700/80 text-rose-200 text-xs font-semibold shadow-xl backdrop-blur-md transition-all hover:scale-105"
            >
              <span>Emergency Circuit Halt</span>
              <div className="w-7 h-7 rounded-lg bg-rose-600 flex items-center justify-center text-white shrink-0">
                <AlertOctagon className="w-4 h-4" />
              </div>
            </button>

            {/* Quick Action: File Dispute */}
            <button
              onClick={() => {
                setShowDisputeModal(true);
                setMenuOpen(false);
              }}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-amber-950/90 hover:bg-amber-900 border border-amber-700/80 text-amber-200 text-xs font-semibold shadow-xl backdrop-blur-md transition-all hover:scale-105"
            >
              <span>File Statutory Dispute (Phase 32)</span>
              <div className="w-7 h-7 rounded-lg bg-amber-600 flex items-center justify-center text-white shrink-0">
                <Gavel className="w-4 h-4" />
              </div>
            </button>

            {/* Quick Action: Download Defense Bundle */}
            <button
              onClick={handleQuickDownloadAudit}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900/95 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold shadow-xl backdrop-blur-md transition-all hover:scale-105"
            >
              <span>Instant Defense Dossier</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0">
                <FileText className="w-4 h-4" />
              </div>
            </button>
          </div>
        )}

        {/* Main Floating Trigger Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl transition-all duration-300 border font-semibold text-xs backdrop-blur-md ${
            menuOpen
              ? 'bg-slate-800 text-white border-slate-600'
              : systemStatus === 'CRITICAL' || systemStatus === 'RED'
              ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-400 animate-pulse'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400'
          }`}
          aria-label="Toggle Quick Actions"
        >
          <div className="relative">
            <Zap className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-slate-950" />
          </div>
          <span>Quick Actions</span>
          <ChevronUp
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              menuOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {/* Emergency Halt Modal */}
      {showHaltModal && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-rose-800 rounded-2xl p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowHaltModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-rose-400">
                <AlertOctagon className="w-4 h-4" />
                <span>Statutory Circuit Breaker Protocol</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">Initiate Fiduciary Emergency Halt</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Enforces Run Protection Architecture (Phase 35) &amp; PRA SS1/23 circuit breaker protocols.
              </p>
            </div>

            {haltSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 space-y-2 font-mono">
                <div className="flex items-center gap-2 font-bold text-white text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Emergency Circuit Breaker Triggered</span>
                </div>
                <p>{haltSuccess}</p>
                <p className="text-slate-400 text-[11px]">
                  Logged to tamper-evident audit ledger with SHA-256 evidence digest.
                </p>
              </div>
            ) : (
              <form onSubmit={handleExecuteHalt} className="space-y-4 text-xs">
                {/* Circuit Tier Selector */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">
                    Select Circuit Breaker Tier
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { tier: 1, label: 'Tier 1: Auto Throttle', desc: '12h velocity buffer' },
                      { tier: 2, label: 'Tier 2: Batch Gating', desc: '50% redemption batching' },
                      { tier: 3, label: 'Tier 3: Systemic Cooldown', desc: 'Deep reserve freeze' },
                      { tier: 4, label: 'Tier 4: Total Lockdown', desc: 'Full emergency drawdown' },
                    ].map((item) => (
                      <button
                        key={item.tier}
                        type="button"
                        onClick={() => setHaltTier(item.tier as 1 | 2 | 3 | 4)}
                        className={`p-2.5 rounded-lg border text-left transition-colors ${
                          haltTier === item.tier
                            ? 'bg-rose-950/70 border-rose-600 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="font-semibold text-xs">{item.label}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Justification */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Statutory Rationale / Incident Justification
                  </label>
                  <textarea
                    value={haltReason}
                    onChange={(e) => setHaltReason(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:ring-1 focus:ring-rose-500"
                    required
                  />
                </div>

                {/* Invariant Safeguard Warning */}
                <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-900/60 text-[11px] text-rose-300 space-y-1 font-mono">
                  <div className="flex items-center gap-1.5 font-semibold text-rose-200">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Invariant I-04 Guarantee Active:</span>
                  </div>
                  <p className="text-slate-300">
                    Retail citizen commons transactions under £250 remain 100% operational regardless of halt tier.
                  </p>
                </div>

                {/* Confirmation input */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Type <span className="font-mono text-rose-400 font-bold">HALT</span> to confirm protocol execution
                  </label>
                  <input
                    type="text"
                    value={haltConfirmation}
                    onChange={(e) => setHaltConfirmation(e.target.value)}
                    placeholder="HALT"
                    className="w-full bg-slate-950 border border-slate-800 text-rose-300 font-mono font-bold rounded-lg px-3 py-2 focus:ring-1 focus:ring-rose-500"
                    required
                  />
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowHaltModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={haltConfirmation !== 'HALT'}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <AlertOctagon className="w-4 h-4" />
                    <span>Engage Circuit Breaker</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Dispute File Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-amber-700 rounded-2xl p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowDisputeModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                <Gavel className="w-4 h-4" />
                <span>Phase 32 / Gate L32.1 Statutory Arbitration</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">File Statutory Dispute Docket</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Formal arbitration submission governed by FCA Mutuals Handbook &amp; Civil Evidence Act 1995.
              </p>
            </div>

            {disputeSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 space-y-2.5 font-mono">
                <div className="flex items-center gap-2 font-bold text-white text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Docket Assigned: {disputeSuccess.docketNumber}</span>
                </div>
                <p>Status: {disputeSuccess.status} · Statutory Basis: {disputeSuccess.statutoryBasis}</p>
                <p className="text-slate-300 font-sans text-xs">
                  Your formal appeal has been entered into the BenCom Mutual Arbitration Tribunal. Evidence reference #{disputeSuccess.evidenceRef} has been sealed with an immutable SHA-256 hash.
                </p>
              </div>
            ) : (
              <form onSubmit={handleExecuteDispute} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Dispute Category</label>
                  <select
                    value={disputeCategory}
                    onChange={(e) => setDisputeCategory(e.target.value as DisputeCase['category'])}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="BARTER_VAT_DISCREPANCY">Barter VAT Split Discrepancy (HMRC 700/8)</option>
                    <option value="SWAP_RATE_EXECUTION">Municipal Credit Swap Execution Rate</option>
                    <option value="HARDSHIP_PRIORITY_DENIAL">Hardship Priority Queue Disallowance</option>
                    <option value="GOVERNANCE_BREACH">Multi-Sig / Governance Procedural Breach</option>
                    <option value="RESERVE_RUN_DEFENSE">Reserve Savings Withdrawal Denial</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Claimant Name</label>
                    <input
                      type="text"
                      value={claimantName}
                      onChange={(e) => setClaimantName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Member / ID Ref</label>
                    <input
                      type="text"
                      value={claimantId}
                      onChange={(e) => setClaimantId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-amber-500 font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Disputed Amount (£ GBP)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={disputedAmount}
                      onChange={(e) => setDisputedAmount(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-amber-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Evidence / Tx Hash</label>
                    <input
                      type="text"
                      value={evidenceRef}
                      onChange={(e) => setEvidenceRef(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-amber-500 font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Factual Grounds &amp; Appeal Details</label>
                  <textarea
                    value={disputeDescription}
                    onChange={(e) => setDisputeDescription(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:ring-1 focus:ring-amber-500"
                    required
                  />
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowDisputeModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <Gavel className="w-4 h-4" />
                    <span>File Arbitration Docket</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
