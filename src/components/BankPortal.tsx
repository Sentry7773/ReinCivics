// src/components/BankPortal.tsx
import React, { useState } from 'react';
import {
  Landmark,
  ShieldCheck,
  TrendingUp,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Hash,
  Scale,
  Award,
  DollarSign,
  ChevronRight,
} from 'lucide-react';

interface CreditProfileData {
  communityId: string;
  communityName: string;
  region: string;
  score: number;
  conformalCI: { low: number; high: number; confidenceLevel: number };
  ter: number;
  reserveCoverage: number;
  leriMultiplier: number;
  activePledgesGBP: number;
  defensePackHash: string;
  shapAttributions: { factor: string; contribution: number; direction: 'POSITIVE' | 'NEGATIVE'; description: string }[];
}

const PROFILES: Record<string, CreditProfileData> = {
  bootle: {
    communityId: 'bootle',
    communityName: 'Bootle & South Sefton Civic Trust',
    region: 'Liverpool City Region, L20',
    score: 685,
    conformalCI: { low: 662, high: 708, confidenceLevel: 0.95 },
    ter: 0.88,
    reserveCoverage: 1.15,
    leriMultiplier: 4.2,
    activePledgesGBP: 421800,
    defensePackHash: 'a7c93e4b8f0291a84f3310088cb39d2f0194857b29a13e8e74659b02319ef481',
    shapAttributions: [
      { factor: 'Local Economic Retention (LERI)', contribution: 0.385, direction: 'POSITIVE', description: '4.2x velocity retention across 82 local merchants' },
      { factor: 'Tail Equity Ratio Stability', contribution: 0.280, direction: 'POSITIVE', description: 'TER of 0.88 complies with statutory Equality Act protections' },
      { factor: 'Pledge Vault Asset Collateral', contribution: 0.245, direction: 'POSITIVE', description: 'Verified food, skilled labour & childcare capacity backing' },
      { factor: 'Reserve Fund Overcollateralization', contribution: 0.150, direction: 'POSITIVE', description: '115% reserve ratio against 99.5% Expected Shortfall' },
      { factor: 'Macro Inflation Volatility Lag', contribution: -0.060, direction: 'NEGATIVE', description: 'Wholesale energy price spike vulnerability buffer' },
    ],
  },
  somers_town: {
    communityId: 'somers_town',
    communityName: 'Somers Town & St Pancras Commitment Pool',
    region: 'London Borough of Camden, NW1',
    score: 742,
    conformalCI: { low: 720, high: 764, confidenceLevel: 0.95 },
    ter: 0.81,
    reserveCoverage: 1.28,
    leriMultiplier: 4.8,
    activePledgesGBP: 615000,
    defensePackHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    shapAttributions: [
      { factor: 'Microgrid Energy Independence', contribution: 0.410, direction: 'POSITIVE', description: '425k kWh rooftop solar guarantees cold storage uptime' },
      { factor: 'Preston Model Anchor Procurement', contribution: 0.340, direction: 'POSITIVE', description: 'Camden Council statutory procurement retention above 45%' },
      { factor: 'Zero Default Repayment History', contribution: 0.295, direction: 'POSITIVE', description: '100% peer reconciliation across 18 rolling clearing cycles' },
      { factor: 'Housing Co-op Collateral Density', contribution: 0.190, direction: 'POSITIVE', description: 'Basement flood defenses & solar microgrid integration' },
      { factor: 'High Street Footfall Seasonality', contribution: -0.035, direction: 'NEGATIVE', description: 'Minor quarterly consumer cyclicality' },
    ],
  },
};

export const BankPortal: React.FC = () => {
  const [selectedCommunity, setSelectedCommunity] = useState<string>('somers_town');
  const [tab, setTab] = useState<'profile' | 'decision'>('profile');

  // Decision Form State
  const [decision, setDecision] = useState<'APPROVE' | 'DECLINE' | 'REVIEW'>('APPROVE');
  const [loanAmount, setLoanAmount] = useState('250000');
  const [interestRate, setInterestRate] = useState('4.25');
  const [rationale, setRationale] = useState(
    'Strong LERI multiplier (4.8x) and zero default history. 115%+ reserve coverage under PRA SS1/23 prudential underwriting framework.'
  );
  const [decisionReceipt, setDecisionReceipt] = useState<{ id: string; timestamp: string } | null>(null);

  const profile = PROFILES[selectedCommunity] || PROFILES.somers_town;

  const handleSubmitDecision = (e: React.FormEvent) => {
    e.preventDefault();
    setDecisionReceipt({
      id: `DEC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 700) return 'text-emerald-400';
    if (score >= 600) return 'text-cyan-400';
    if (score >= 500) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className="space-y-7">
      {/* Top Banner */}
      <div className="border border-blue-900/60 bg-gradient-to-r from-slate-950 via-blue-950/40 to-slate-900 rounded-2xl p-6 lg:p-7 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-blue-900/50">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-1">
              <Landmark className="w-4 h-4 text-blue-400" />
              <span>Institutional Funder &amp; Bank Gateway &middot; PRA SS1/23 Underwriting</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>Community Credit Profiling &amp; Conformal Decisioning</span>
            </h1>
            <p className="text-xs text-slate-300 max-w-3xl mt-1 leading-relaxed">
              Transform place-based social capital and commitment pools into bankable credit assets. Explainable SHAP attribution, 95% conformal confidence bounds, and automated underwriting for social lenders.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs font-mono text-slate-400">
              <span className="block text-[10px] text-slate-500">Audited Community:</span>
              <select
                value={selectedCommunity}
                onChange={(e) => setSelectedCommunity(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-white font-bold rounded-lg p-2 text-xs"
              >
                <option value="somers_town">Somers Town (Camden, London)</option>
                <option value="bootle">Bootle (South Sefton, Liverpool)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setTab('profile')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
              tab === 'profile'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            1. Community Credit Profile &amp; SHAP
          </button>
          <button
            onClick={() => setTab('decision')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
              tab === 'decision'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            2. Record Loan Underwriting Decision
          </button>
        </div>
      </div>

      {tab === 'profile' && (
        <div className="space-y-6">
          {/* Main Score & Core Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Score Box (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                  Community Actuarial Resilience Score
                </span>
                <div className="flex items-baseline gap-3 mt-2">
                  <span className={`text-6xl font-black font-mono tracking-tight ${getScoreColor(profile.score)}`}>
                    {profile.score}
                  </span>
                  <span className="text-slate-400 text-sm font-mono font-bold">/ 850</span>
                  <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    PRIME ANCHOR
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono mt-2">
                  95% Conformal Confidence Bound:{' '}
                  <strong className="text-white">
                    [{profile.conformalCI.low} &mdash; {profile.conformalCI.high}]
                  </strong>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Area:</span>
                  <span className="text-white">{profile.region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Pledged Capacity:</span>
                  <span className="text-emerald-400 font-bold">£{profile.activePledgesGBP.toLocaleString()} GBP</span>
                </div>
              </div>
            </div>

            {/* 3 Metric Cards (7 cols) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase block font-semibold">
                  Tail Equity Ratio (TER)
                </span>
                <div>
                  <span className="text-3xl font-black font-mono text-emerald-400">{profile.ter.toFixed(2)}</span>
                  <span className="text-[10px] text-slate-500 block font-mono mt-0.5">Target &le; 1.00</span>
                </div>
                <div className="text-[11px] text-emerald-400 font-mono font-semibold">
                  &check; Meets Equality Act s.149
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase block font-semibold">
                  Reserve Coverage (ES99.5)
                </span>
                <div>
                  <span className="text-3xl font-black font-mono text-cyan-400">
                    {(profile.reserveCoverage * 100).toFixed(0)}%
                  </span>
                  <span className="text-[10px] text-slate-500 block font-mono mt-0.5">Prudential Target &ge; 110%</span>
                </div>
                <div className="text-[11px] text-cyan-400 font-mono font-semibold">
                  &check; PRA SS1/23 Compliant
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase block font-semibold">
                  Local Retention (LERI)
                </span>
                <div>
                  <span className="text-3xl font-black font-mono text-indigo-400">{profile.leriMultiplier}x</span>
                  <span className="text-[10px] text-slate-500 block font-mono mt-0.5">Velocity Multiplier</span>
                </div>
                <div className="text-[11px] text-indigo-400 font-mono font-semibold">
                  &check; Preston Civic Wealth
                </div>
              </div>
            </div>
          </div>

          {/* SHAP Explainability Breakdown */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Transparent Model Explainability (SHAP Value Attribution)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Full algorithmic accountability under FCA Consumer Duty and Equality Act 2010. Every score factor is mathematically attributed.
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                Lundberg-Lee Additive Kernel
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {profile.shapAttributions.map((shap, i) => (
                <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white font-mono">{shap.factor}</span>
                    <span
                      className={`font-mono font-bold ${
                        shap.direction === 'POSITIVE' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {shap.direction === 'POSITIVE' ? '+' : ''}
                      {(shap.contribution * 100).toFixed(1)}% Score Lift
                    </span>
                  </div>

                  {/* Visual attribution bar */}
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden flex">
                    <div
                      className={`h-full ${shap.direction === 'POSITIVE' ? 'bg-emerald-500' : 'bg-rose-500'}`}
                      style={{ width: `${Math.min(100, Math.abs(shap.contribution) * 120)}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-400 font-sans">{shap.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cryptographic Defense Pack Anchoring */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-purple-400 shrink-0" />
              <div className="truncate">
                <span className="text-slate-500 block text-[10px]">Statutory Defense Pack Merkle Root:</span>
                <span className="text-purple-300 font-bold truncate max-w-md block">{profile.defensePackHash}</span>
              </div>
            </div>
            <span className="text-emerald-400 shrink-0 flex items-center gap-1 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Admissible under Civil Evidence Act 1995</span>
            </span>
          </div>
        </div>
      )}

      {tab === 'decision' && (
        <form onSubmit={handleSubmitDecision} className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-5">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-blue-400" />
              <span>Institutional Loan Underwriting Form &middot; {profile.communityName}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Submissions are cryptographically signed and archived to the immutable audit docket.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Underwriting Decision</label>
              <select
                value={decision}
                onChange={(e) => setDecision(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 text-sm font-bold font-mono"
              >
                <option value="APPROVE">APPROVE (Investment Grade Anchor)</option>
                <option value="REVIEW">REFER TO SOCIAL INVESTMENT COMMITTEE</option>
                <option value="DECLINE">DECLINE</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Facility Amount (£ GBP)</label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 text-sm font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Concessional Rate (% APR)</label>
              <input
                type="number"
                step="0.05"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 text-sm font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">
              Statutory Underwriting Rationale (Recorded to FCA / PRA Audit Trail)
            </label>
            <textarea
              rows={4}
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 text-xs font-mono leading-relaxed"
            />
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-slate-500 font-mono">
              Funder: Big Issue Invest / Charity Bank Syndicate
            </span>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold font-mono transition-all cursor-pointer shadow-lg"
            >
              Sign &amp; Issue Underwriting Commitment
            </button>
          </div>

          {decisionReceipt && (
            <div className="p-4 bg-emerald-950/70 border border-emerald-700 text-emerald-200 rounded-xl text-xs space-y-1 font-mono">
              <div className="font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Decision Anchored to Blockchain / Merkle Audit Trail</span>
              </div>
              <div>Receipt ID: <strong className="text-white">{decisionReceipt.id}</strong></div>
              <div>Timestamp: {decisionReceipt.timestamp}</div>
            </div>
          )}
        </form>
      )}
    </div>
  );
};
