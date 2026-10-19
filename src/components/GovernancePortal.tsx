// src/components/GovernancePortal.tsx
import React, { useState } from 'react';
import { useCivicTrust } from '../context/CivicTrustContext';
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Check,
  X,
  Vote,
  Sparkles,
  Sliders,
  Users,
  Shield,
  FileCheck2,
  Calendar,
} from 'lucide-react';

interface Proposal {
  id: string;
  code: string;
  title: string;
  description: string;
  status: 'ACTIVE' | 'QUEUED' | 'PASSED' | 'EXECUTED' | 'REJECTED';
  votesFor: number;
  votesAgainst: number;
  createdAt: string;
  executionTime?: string;
  reviews: {
    fairness: boolean;
    actuarial: boolean;
    ecological: boolean;
    legal: boolean;
  };
}

const INITIAL_PROPOSALS: Proposal[] = [
  {
    id: 'prop-01',
    code: 'VGP-2026-08',
    title: 'Recalibrate Annual Demurrage to 10.5% (Winter Stimulus)',
    description: 'Temporarily decrease annual demurrage from 12% to 10.5% during Q4 to accommodate energy bill winter prepayments.',
    status: 'ACTIVE',
    votesFor: 342.5,
    votesAgainst: 88.0,
    createdAt: '2026-10-12',
    reviews: {
      fairness: true,
      actuarial: true,
      ecological: true,
      legal: true,
    },
  },
  {
    id: 'prop-02',
    code: 'VGP-2026-09',
    title: 'Onboard Kilburn Cooperative Microgrid into Clean Energy Vault',
    description: 'Authorize £85,000 capacity limit for 120kW rooftop solar arrays on Kilburn High Road estate.',
    status: 'ACTIVE',
    votesFor: 512.0,
    votesAgainst: 14.5,
    createdAt: '2026-10-14',
    reviews: {
      fairness: true,
      actuarial: true,
      ecological: true,
      legal: true,
    },
  },
  {
    id: 'prop-03',
    code: 'VGP-2026-07',
    title: 'Allocate £25,000 CIL Levy to Regent’s Park SuDS Bioswales',
    description: 'Developer Section 106 ringfenced flood resilience funding for open drainage corridors.',
    status: 'QUEUED',
    votesFor: 680.0,
    votesAgainst: 32.0,
    createdAt: '2026-10-01',
    executionTime: '2026-10-22 14:00 UTC',
    reviews: {
      fairness: true,
      actuarial: true,
      ecological: true,
      legal: true,
    },
  },
  {
    id: 'prop-04',
    code: 'VGP-2026-06',
    title: 'Increase Exit Fee to 6.5% (Violates Hard Guardrail)',
    description: 'Proposal to penalize fiat redemptions above statutory 5% cap.',
    status: 'REJECTED',
    votesFor: 12.0,
    votesAgainst: 940.0,
    createdAt: '2026-09-24',
    reviews: {
      fairness: false,
      actuarial: false,
      ecological: true,
      legal: false,
    },
  },
];

export const GovernancePortal: React.FC = () => {
  const [tab, setTab] = useState<'proposals' | 'guardrails' | 'committees'>('proposals');
  const [proposals, setProposals] = useState<Proposal[]>(INITIAL_PROPOSALS);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(INITIAL_PROPOSALS[0]);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'QUEUED' | 'PASSED' | 'EXECUTED' | 'REJECTED'>('ALL');

  // Quadratic Voice Credits
  const [voiceCredits, setVoiceCredits] = useState(100);
  const [spentCredits, setSpentCredits] = useState(16);
  const [creditsToSpend, setCreditsToSpend] = useState(9);
  const [voteFeedback, setVoteFeedback] = useState<string | null>(null);

  const availableCredits = voiceCredits - spentCredits;
  const quadraticWeight = Math.sqrt(creditsToSpend).toFixed(2);

  const handleCastVote = (voteFor: boolean) => {
    if (!selectedProposal || availableCredits < creditsToSpend) return;

    const weight = Math.sqrt(creditsToSpend);
    setProposals((prev) =>
      prev.map((p) =>
        p.id === selectedProposal.id
          ? {
              ...p,
              votesFor: voteFor ? p.votesFor + weight : p.votesFor,
              votesAgainst: !voteFor ? p.votesAgainst + weight : p.votesAgainst,
            }
          : p
      )
    );

    setSelectedProposal((prev) =>
      prev
        ? {
            ...prev,
            votesFor: voteFor ? prev.votesFor + weight : prev.votesFor,
            votesAgainst: !voteFor ? prev.votesAgainst + weight : prev.votesAgainst,
          }
        : null
    );

    setSpentCredits((prev) => prev + creditsToSpend);
    setVoteFeedback(
      `Cast vote with ${creditsToSpend} voice credits (quadratic weight: +${weight.toFixed(2)}) on ${selectedProposal.code}.`
    );
    setTimeout(() => setVoteFeedback(null), 5000);
  };

  const filteredProposals =
    filter === 'ALL' ? proposals : proposals.filter((p) => p.status === filter);

  const guardrails = [
    {
      name: 'Annual Demurrage (Velocity Surcharge)',
      current: '12.0%',
      min: '3.0%',
      max: '18.0%',
      status: 'SAFE',
      statutoryBasis: 'HMRC & Gesell Velocity Neutrality',
    },
    {
      name: 'Exit Fee (Commons to Reserve Conversion)',
      current: '1.5%',
      min: '0.0%',
      max: '5.0%',
      status: 'SAFE',
      statutoryBasis: 'FSMA 2000 Consumer Fairness',
    },
    {
      name: 'Systemic Velocity Floor',
      current: '12.3x / year',
      min: '2.0x',
      max: '25.0x',
      status: 'SAFE',
      statutoryBasis: 'Local Economic Multiplier Preservation',
    },
    {
      name: 'Tail Equity Ratio (TER) Vulnerable Threshold',
      current: '0.84',
      min: '0.00',
      max: '1.00',
      status: 'SAFE',
      statutoryBasis: 'Equality Act 2010 s.149 PSED',
    },
    {
      name: 'Adverse Impact Ratio (AIR)',
      current: '0.914',
      min: '0.80',
      max: '1.00',
      status: 'SAFE',
      statutoryBasis: 'Four-Fifths Rule Discrimination Guardrail',
    },
  ];

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="border border-purple-900/60 bg-gradient-to-r from-slate-950 via-purple-950/40 to-slate-900 rounded-2xl p-6 lg:p-7 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-purple-900/50">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
              <Scale className="w-4 h-4 text-purple-400" />
              <span>DAO Governance &middot; Quadratic Voting &middot; Statutory Guardrails</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>CivicTrust Participatory Governance &amp; Committee Review</span>
            </h1>
            <p className="text-xs text-slate-300 max-w-3xl mt-1 leading-relaxed">
              Democratized quadratic voting ensuring broad consensus over narrow plutocracy. Every proposal undergoes mandatory 4-way statutory review (Fairness, Actuarial, Ecological, Legal) before 14-day timelock execution.
            </p>
          </div>

          <div className="p-3 bg-slate-950/80 border border-purple-900 rounded-xl text-right font-mono">
            <span className="text-[10px] text-slate-400 block">Your Voice Credits</span>
            <span className="text-xl font-bold text-purple-400 tabular-nums">
              {availableCredits} <span className="text-xs text-slate-500 font-sans">credits</span>
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setTab('proposals')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
              tab === 'proposals'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            1. Active Proposals ({proposals.length})
          </button>
          <button
            onClick={() => setTab('guardrails')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
              tab === 'guardrails'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            2. System Guardrails &amp; Boundaries
          </button>
          <button
            onClick={() => setTab('committees')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
              tab === 'committees'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            3. 10 Statutory Governance Bodies
          </button>
        </div>
      </div>

      {voteFeedback && (
        <div className="p-4 rounded-xl bg-purple-950/70 border border-purple-700 text-purple-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
            <span>{voteFeedback}</span>
          </div>
          <button onClick={() => setVoteFeedback(null)} className="underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* PROPOSALS VIEW */}
      {tab === 'proposals' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* List (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {(['ALL', 'ACTIVE', 'QUEUED', 'PASSED', 'REJECTED'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-3 py-1 rounded-lg font-mono text-[11px] font-semibold transition-colors cursor-pointer ${
                    filter === s
                      ? 'bg-purple-950 text-purple-300 border border-purple-700'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredProposals.map((p) => {
                const isSelected = selectedProposal?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProposal(p)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                      isSelected
                        ? 'border-purple-600 bg-slate-900/90 shadow-xl ring-1 ring-purple-600'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                        {p.code}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          p.status === 'ACTIVE'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : p.status === 'QUEUED'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : p.status === 'PASSED'
                            ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white">{p.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{p.description}</p>

                    <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
                      <span>
                        For: <strong className="text-emerald-400">{p.votesFor.toFixed(1)}</strong> &middot; Against:{' '}
                        <strong className="text-rose-400">{p.votesAgainst.toFixed(1)}</strong>
                      </span>
                      <span>{p.createdAt}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details & Voting Box (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {selectedProposal ? (
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-5 shadow-2xl">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider">
                      Proposal Dossier
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                      {selectedProposal.code}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-white mt-1.5 leading-snug">
                    {selectedProposal.title}
                  </h2>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {selectedProposal.description}
                  </p>
                </div>

                {/* 4 Required Reviews */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                    Statutory Review Gates (Must All Pass)
                  </span>
                  <div className="space-y-1.5 text-xs">
                    {[
                      { key: 'fairness', label: '1. Fairness & Protected Groups Audit', passed: selectedProposal.reviews.fairness },
                      { key: 'actuarial', label: '2. Actuarial Solvency (EVT / ES99.5)', passed: selectedProposal.reviews.actuarial },
                      { key: 'ecological', label: '3. Ecological Additionality & BNG', passed: selectedProposal.reviews.ecological },
                      { key: 'legal', label: '4. Legal Recourse (Civil Evidence 1995)', passed: selectedProposal.reviews.legal },
                    ].map((r) => (
                      <div key={r.key} className="flex items-center justify-between py-1 border-b border-slate-800/60 last:border-0">
                        <span className="text-slate-300 text-[11px]">{r.label}</span>
                        {r.passed ? (
                          <span className="text-emerald-400 font-mono text-[10px] font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>APPROVED</span>
                          </span>
                        ) : (
                          <span className="text-rose-400 font-mono text-[10px] font-bold flex items-center gap-1">
                            <X className="w-3.5 h-3.5" />
                            <span>BLOCKED</span>
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Specific Action */}
                {selectedProposal.status === 'ACTIVE' && (
                  <div className="p-4 bg-purple-950/40 border border-purple-800/80 rounded-xl space-y-3">
                    <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                      <Vote className="w-4 h-4 text-purple-400" />
                      <span>Quadratic Voting Panel</span>
                    </span>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-400">Credits to Allocate:</span>
                        <span className="text-purple-300 font-bold">
                          {creditsToSpend} credits &rarr; +{quadraticWeight} weight
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max={Math.min(36, availableCredits)}
                        value={creditsToSpend}
                        onChange={(e) => setCreditsToSpend(Number(e.target.value))}
                        className="w-full accent-purple-500 cursor-pointer"
                      />
                      <div className="text-[10px] text-slate-400 font-mono flex justify-between">
                        <span>Cost: {creditsToSpend} Voice Credits</span>
                        <span>Available: {availableCredits}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleCastVote(true)}
                        className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        Vote In Favor
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCastVote(false)}
                        className="py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        Vote Against
                      </button>
                    </div>
                  </div>
                )}

                {selectedProposal.status === 'QUEUED' && (
                  <div className="p-4 bg-amber-950/40 border border-amber-800/80 rounded-xl space-y-2 text-xs">
                    <span className="text-xs font-bold text-amber-300 font-mono flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>14-Day Mandatory Timelock Active</span>
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      This proposal passed member voting. Under statutory governance rules, a 14-day timelock allows council and member review prior to automated execution at:
                    </p>
                    <div className="font-mono text-white text-xs font-bold bg-slate-950 p-2 rounded border border-slate-800">
                      {selectedProposal.executionTime}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 font-mono text-xs border border-slate-800 rounded-2xl">
                Select a proposal to view statutory reviews and cast votes.
              </div>
            )}
          </div>
        </div>
      )}

      {/* GUARDRAILS VIEW */}
      {tab === 'guardrails' && (
        <div className="space-y-5">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Immutable Systemic Guardrails (Invariants)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Hardcoded architectural boundaries that no DAO vote, administrator, or executive committee can violate. Any proposal breaching these bounds is rejected in firmware.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {guardrails.map((g, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white leading-snug">{g.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                    {g.status}
                  </span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Value:</span>
                    <span className="text-emerald-400 font-bold text-sm">{g.current}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Permitted Bounds:</span>
                    <span className="text-white">
                      {g.min} &mdash; {g.max}
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 font-mono">
                  Statutory Basis: <strong className="text-slate-300">{g.statutoryBasis}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COMMITTEES VIEW */}
      {tab === 'committees' && (
        <div className="space-y-5">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span>10 Statutory Governance Bodies</span>
            </h2>
            <p className="text-xs text-slate-400">
              Rotational committees of elected citizens, independent actuaries, and legal specialists ensuring democratic balance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Member Assembly', role: 'All active registered citizens & SMEs', term: 'Permanent', power: 'Supreme governance & constitutional changes' },
              { name: 'Board of Directors', role: '3–11 elected directors', term: '3 years', power: 'Strategic stewardship & fiduciary compliance' },
              { name: 'Risk Committee', role: '5 members with actuaries', term: '2 years', power: 'ES99.5 solvency & circuit breaker enforcement' },
              { name: 'Fairness Committee', role: '5 independent community members', term: '2 years', power: 'Cohort equity & adverse impact monitoring' },
              { name: 'Ethics Committee', role: '5 ethicists & faith/civic leaders', term: '2 years', power: 'Voucher moral bounds & inclusion review' },
              { name: 'Dispute Panel', role: '9 peer mediators', term: '2 years', power: 'Binding arbitration under Civil Evidence 1995' },
              { name: 'Data Steward', role: '3 certified DPOs', term: '2 years', power: 'GDPR / ICO data trust oversight' },
              { name: 'Technical Operations', role: '5 senior systems engineers', term: '2 years', power: 'Edge nodes, Docker/K8s deployment security' },
              { name: 'Treasury Committee', role: '5 chartered accountants', term: '2 years', power: 'A-IPS investment checks & bank reserves' },
              { name: 'Audit Function', role: '3 independent external auditors', term: '3 years', power: 'Continuous Merkle ledger & financial audit' },
            ].map((c, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white">{c.name}</h3>
                  <span className="text-[10px] font-mono text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                    {c.term}
                  </span>
                </div>
                <div className="text-slate-400 text-[11px]">{c.role}</div>
                <div className="text-[11px] text-slate-300 font-mono pt-1 border-t border-slate-800">
                  Authority: {c.power}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
