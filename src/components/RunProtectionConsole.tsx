// src/components/RunProtectionConsole.tsx
import React, { useState } from 'react';
import { useCivicTrust } from '../context/CivicTrustContext';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  Users,
  AlertTriangle,
  PlayCircle,
  FileCheck,
} from 'lucide-react';

export const RunProtectionConsole: React.FC = () => {
  const {
    circuitBreakers,
    toggleCircuitBreaker,
    multisigRequests,
    signMultiSig,
    priorityClaims,
    processClaim,
  } = useCivicTrust();

  const [activeSignerId, setActiveSignerId] = useState<string>('sgn-02'); // Default to Chief Actuary

  const signers = [
    { id: 'sgn-01', name: 'Eleanor Vance', role: 'Treasury Trustee' },
    { id: 'sgn-02', name: 'Dr. Tariq Al-Mansoor', role: 'Chief Actuary' },
    { id: 'sgn-03', name: 'Helena Ward QC', role: 'Legal Counsel' },
    { id: 'sgn-04', name: 'Marcus Thorne', role: 'Community Steward' },
    { id: 'sgn-05', name: 'Cllr. Sarah Jenkins', role: 'Council Observer' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span>Run Protection Architecture & Circuit Breakers</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Structural immunity to bank runs through tiered circuit breakers, institutional multi-sig quorums, and dignity-first priority queues.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-slate-400">Equity Score ESCR:</span>
          <span className="text-emerald-400 font-bold">0.984</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">Target: &ge; 0.950</span>
        </div>
      </div>

      {/* Core Principle Notice */}
      <div className="p-4 rounded-xl border border-cyan-800/60 bg-cyan-950/20 text-xs text-cyan-200 leading-relaxed flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-white">The Invariant of Closed-Loop Commons Resilience: </span>
          Even if extreme macroeconomic contagion or external banking panics trigger a temporary freeze on fiat outward redemptions,
          internal community commerce, local merchant purchases, and essential hardship relief remain 100% operational.
          The system protects retail citizens by design and prevents predatory wholesale capital flight.
        </div>
      </div>

      {/* 4-Tier Circuit Breakers */}
      <div>
        <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Four-Tier Circuit Breaker Architecture</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {circuitBreakers.map((cb) => (
            <div
              key={cb.tier}
              className={`p-5 rounded-xl border transition-colors ${
                cb.active
                  ? 'border-amber-500/80 bg-amber-950/30'
                  : 'border-slate-800 bg-slate-900/40'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-mono text-cyan-400">Tier {cb.tier}</div>
                  <h3 className="font-bold text-white text-sm mt-0.5">{cb.name}</h3>
                </div>
                <button
                  onClick={() => toggleCircuitBreaker(cb.tier)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                    cb.active
                      ? 'bg-amber-500 text-slate-950 font-semibold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {cb.active ? 'ACTIVE (ENGAGED)' : 'NOMINAL (STANDBY)'}
                </button>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Trigger: </span>
                  <span className="text-slate-300">{cb.triggerCondition}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Action: </span>
                  <span className="text-slate-300">{cb.actionTaken}</span>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Authorization: {cb.approvalRequired}</span>
                  {cb.lastTriggered && (
                    <span className="text-amber-400 font-mono">{cb.lastTriggered}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Institutional Multi-Sig Governance Console */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-400" />
              <span>Institutional Multi-Sig Key Ceremony</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Dual-control and quorum authorization for high-value liquidations, emergency overrides, and A-IPS policy shifts.
            </p>
          </div>

          {/* Active Signer Selector (Simulator) */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Act as Signer:</span>
            <select
              value={activeSignerId}
              onChange={(e) => setActiveSignerId(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {signers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {multisigRequests.map((req) => {
            const signedCount = req.signatures.filter((s) => s.signed).length;
            const hasActiveSigned = req.signatures.find((s) => s.signerId === activeSignerId)?.signed;

            return (
              <div
                key={req.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-cyan-400">{req.id}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="font-semibold text-white">{req.actionType}</span>
                    {req.amountGBP > 0 && (
                      <span className="font-mono text-emerald-400 font-semibold tabular-nums">
                        (£{req.amountGBP.toLocaleString('en-GB')})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-400">
                      Quorum: <strong className="text-white">{signedCount}</strong> / {req.requiredSignatures} Required
                    </span>
                    <span
                      className={`font-semibold ${
                        req.status === 'APPROVED' ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                </div>

                <p className="text-slate-300 leading-relaxed">{req.reason}</p>
                <div className="text-[11px] text-slate-500">Initiator: {req.initiator}</div>

                {/* Signer Avatars / Status Strip */}
                <div className="pt-3 border-t border-slate-900 grid grid-cols-1 sm:grid-cols-5 gap-2">
                  {req.signatures.map((sig) => (
                    <div
                      key={sig.signerId}
                      className={`p-2 rounded-lg border text-left ${
                        sig.signed
                          ? 'border-emerald-800/80 bg-emerald-950/20'
                          : 'border-slate-800 bg-slate-900/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-200 truncate">{sig.signerName}</span>
                        {sig.signed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <span className="text-[10px] text-slate-500 font-mono">Pending</span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 truncate">{sig.role}</div>
                      {sig.signedAt && (
                        <div className="text-[9px] text-emerald-400 font-mono mt-1">
                          {sig.signedAt.substring(11, 16)} UTC
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Action button */}
                {req.status === 'PENDING' && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => signMultiSig(req.id, activeSignerId)}
                      disabled={hasActiveSigned}
                      className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                        hasActiveSigned
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>{hasActiveSigned ? 'Signature Recorded' : 'Sign Request as Active Official'}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Priority Welfare Queue (Hardship Triage with ESCR >= 0.95) */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Priority Hardship Queue & Dynamic Sizing (ESCR &ge; 0.95)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              During high demand, medical, food, and essential heating claims take strict precedence over speculative outflows.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400">Dignity-First Triage</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3 font-medium">Rank</th>
                <th className="py-2.5 px-3 font-medium">Claimant</th>
                <th className="py-2.5 px-3 font-medium">Category</th>
                <th className="py-2.5 px-3 font-medium font-mono text-right">Requested</th>
                <th className="py-2.5 px-3 font-medium font-mono text-right">Approved</th>
                <th className="py-2.5 px-3 font-medium font-mono text-right">Equity ESCR</th>
                <th className="py-2.5 px-3 font-medium text-right">Status</th>
                <th className="py-2.5 px-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {priorityClaims.map((claim) => (
                <tr key={claim.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3 text-cyan-400 font-bold">#{claim.urgencyRank}</td>
                  <td className="py-3 px-3 font-sans font-medium text-slate-200">
                    <div>{claim.claimantName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{claim.claimantId}</div>
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-300">
                    {claim.category.replace('_', ' ')}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300 tabular-nums">
                    £{claim.requestedGBP.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-400 font-semibold tabular-nums">
                    £{claim.approvedGBP.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right text-cyan-300 font-semibold tabular-nums">
                    {claim.equityScoreESCR.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right font-sans">
                    <span
                      className={`font-medium ${
                        claim.status === 'PROCESSED'
                          ? 'text-emerald-400'
                          : claim.status === 'QUEUED'
                          ? 'text-cyan-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {claim.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-sans">
                    {claim.status !== 'PROCESSED' ? (
                      <button
                        onClick={() => processClaim(claim.id)}
                        className="px-2.5 py-1 text-[11px] bg-emerald-600 hover:bg-emerald-500 text-white rounded transition-colors inline-flex items-center gap-1"
                      >
                        <PlayCircle className="w-3 h-3" />
                        <span>Disburse</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-mono">Disbursed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
