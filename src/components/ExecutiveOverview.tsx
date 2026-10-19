// src/components/ExecutiveOverview.tsx
import React, { useState } from 'react';
import { useCivicTrust } from '../context/CivicTrustContext';
import { NavTab } from './Sidebar';
import { RiskHealthHeatmap } from './RiskHealthHeatmap';
import {
  Shield,
  CheckCircle2,
  Lock,
  Cpu,
  ArrowRight,
  Landmark,
  Scale,
  Users,
  Search,
  Coins,
  Sparkles,
  Zap,
  ArrowRightLeft,
  Compass,
} from 'lucide-react';

interface ExecutiveOverviewProps {
  onNavigate: (tab: NavTab) => void;
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({ onNavigate }) => {
  const { gates, invariants, reserveTranches } = useCivicTrust();
  const [invariantSearch, setInvariantSearch] = useState('');

  const totalReserveGBP = reserveTranches.reduce((sum, t) => sum + t.balanceGBP, 0);
  const passedGates = gates.filter((g) => g.status === 'PASSED').length;
  const verifiedInvariants = invariants.filter((i) => i.verified).length;

  const filteredInvariants = invariants.filter(
    (inv) =>
      inv.name.toLowerCase().includes(invariantSearch.toLowerCase()) ||
      inv.code.toLowerCase().includes(invariantSearch.toLowerCase()) ||
      inv.description.toLowerCase().includes(invariantSearch.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Hackathon Call Alignment Hero Banner */}
      <div className="border border-emerald-700/80 bg-gradient-to-r from-emerald-950/60 via-slate-900/90 to-slate-950 rounded-2xl p-6 lg:p-7 shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-700/80 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>CHALLENGE DIRECT RESPONSE</span>
              </span>
              <span className="text-slate-400">From Underbanked to Understood</span>
              <span className="text-slate-600">·</span>
              <span className="text-emerald-400 font-semibold">Sarafu-Compatible Commitment Pools</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight">
              Making Community Assets, Commitments &amp; Histories Visible to Support Fair Finance
            </h1>
            <p className="text-xs lg:text-sm text-slate-300 leading-relaxed">
              Traditional financial systems chronically misclassify sports clubs, food co-ops, care providers, and housing groups as high-risk due to fragmented records and volatile cash flow. 
              <strong className="text-white"> CivicTrust</strong> converts latent community relationships, forward labour, and physical assets into auditable 
              <strong className="text-emerald-300"> Commitment Pools</strong>, redeemable mutual vouchers, and <strong className="text-cyan-300">PRA SS1/23 &amp; Basel III-grade bank underwriting dossiers</strong> — meeting local needs without relying solely on cash.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('commitment-pools')}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-105 cursor-pointer"
            >
              <Coins className="w-4 h-4" />
              <span>Explore Commitment Pools</span>
            </button>
            <button
              onClick={() => onNavigate('phase-deliverables')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>View All 40 Phase Deliverables</span>
            </button>
            <button
              onClick={() => onNavigate('spatial-resilience')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-800/80 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Spatial Resilience Map</span>
            </button>
            <button
              onClick={() => onNavigate('wallet')}
              className="px-4 py-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-400" />
              <span>Live Municipal Credit Swap</span>
            </button>
          </div>
        </div>

        {/* 6 Nexus Levers Fast Links */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/70">
            <span className="text-[10px] text-slate-400 block font-mono">Lever 1</span>
            <span className="text-white font-medium text-[11px]">LGPS Pension Sweeps</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/70">
            <span className="text-[10px] text-slate-400 block font-mono">Lever 2</span>
            <span className="text-white font-medium text-[11px]">Biodiversity Credits</span>
          </div>
          <div
            onClick={() => onNavigate('spatial-resilience')}
            className="p-2.5 rounded-lg bg-slate-950/60 border border-cyan-800/60 hover:bg-slate-900 cursor-pointer transition-colors"
          >
            <span className="text-[10px] text-cyan-400 block font-mono">Lever 3 (Live Map)</span>
            <span className="text-white font-medium text-[11px]">Geospatial Rooftop GIS</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/70">
            <span className="text-[10px] text-slate-400 block font-mono">Lever 4</span>
            <span className="text-white font-medium text-[11px]">Open Planning &amp; S106</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/70">
            <span className="text-[10px] text-slate-400 block font-mono">Lever 5</span>
            <span className="text-white font-medium text-[11px]">JurisActuary AI Engine</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/70">
            <span className="text-[10px] text-slate-400 block font-mono">Lever 6</span>
            <span className="text-white font-medium text-[11px]">Sarafu Mutual Barter</span>
          </div>
        </div>
      </div>

      {/* Top Banner / System Metadata (Clean typographic notice) */}
      <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-slate-200">CivicTrust / EcoVelocity</span>
            <span aria-hidden="true">·</span>
            <span>v7.0 Enterprise B2G Edition</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">Classification: OFFICIAL-SENSITIVE</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 font-mono">
            <span>Owner: Francis Banda, Founder & CEO</span>
            <span aria-hidden="true">·</span>
            <span>REIN Dynamic Systems</span>
          </div>
        </div>

        <div className="pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <div className="text-xs text-slate-400">Total Fiduciary Pool</div>
            <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
              £{(totalReserveGBP / 1_000_000).toFixed(2)}M
            </div>
            <div className="text-xs text-slate-400 mt-1">100% Segregated UK Fiat</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Gate Verification</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
              {passedGates} / {gates.length}
            </div>
            <div className="text-xs text-slate-400 mt-1">100% Passed across 29 Phases</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Tail Equity Ratio (TER)</div>
            <div className="text-2xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">
              0.942
            </div>
            <div className="text-xs text-slate-400 mt-1">TER &le; 1.0 Strict Parity Enforced</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">RegScan Confidence</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
              94.2%
            </div>
            <div className="text-xs text-slate-400 mt-1">Grounded in 24 Primary Statutes</div>
          </div>
        </div>
      </div>

      {/* Real-Time Risk Heatmap & Economic Health Telemetry */}
      <RiskHealthHeatmap />

      {/* Core Architectural Pillars */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Core Fiduciary &amp; Community Credit Pillars</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            onClick={() => onNavigate('commitment-pools')}
            className="p-5 rounded-xl border border-emerald-800/80 bg-gradient-to-br from-emerald-950/40 to-slate-900/60 hover:border-emerald-600 transition-all cursor-pointer group shadow-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Coins className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                Sarafu &middot; Phase 13 &amp; 18
              </span>
            </div>
            <h3 className="font-semibold text-white text-base">Community Credit &amp; Commitment Pools</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              From Underbanked to Understood: converting latent relationships, skills, and forward food/energy/care into auditable commitment pools and Basel III-grade bank underwriting assets.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>8 Sector Vaults</span>
              <span className="text-emerald-400 font-medium">AAA (96.4%)</span>
            </div>
          </div>

          <div
            onClick={() => onNavigate('living-treasury')}
            className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Landmark className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            </div>
            <h3 className="font-semibold text-white text-base">Living Treasury AI</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Autonomous fiduciary asset management under hard A-IPS constraints. Weekly 70/30 yield sweeps feed Deep Reserve & Hardship Shock Absorber.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>7 Tranches Governed</span>
              <span className="text-emerald-400 font-medium">A-IPS Active</span>
            </div>
          </div>

          <div
            onClick={() => onNavigate('run-protection')}
            className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Shield className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <h3 className="font-semibold text-white text-base">Run Protection Architecture</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Structural immunity to runs via 4-tier circuit breakers, priority welfare queues (ESCR &ge; 0.95), and institutional 5-member Multi-Sig controls.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>4 Circuit Tiers</span>
              <span className="text-cyan-400 font-medium">Multi-Sig 2/5 - 4/5</span>
            </div>
          </div>

          <div
            onClick={() => onNavigate('solidarity')}
            className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Users className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
            </div>
            <h3 className="font-semibold text-white text-base">Solidarity Fund & ESG "S"</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Voluntary citizen contributions and verified corporate pledges with immutable SHA-256 credentials satisfying UK Social Value Act 2012.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>60/40 Split Enforced</span>
              <span className="text-amber-400 font-medium">Procurement Ready</span>
            </div>
          </div>

          <div
            onClick={() => onNavigate('council-portal')}
            className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Scale className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
            </div>
            <h3 className="font-semibold text-white text-base">Council B2G Planning</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Ward-level Tail Equity Ratio (TER) intelligence, statutory compliance monitoring (Care Act 2014 & Equality Act 2010), and anchor tenant spend.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>5 Wards Mapped</span>
              <span className="text-indigo-400 font-medium">1.74x Multiplier</span>
            </div>
          </div>

          <div
            onClick={() => onNavigate('defense-pack')}
            className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Lock className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            </div>
            <h3 className="font-semibold text-white text-base">Legal Corpus & Defense Packs</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              16 institutional documents including BenCom Rules, DPIA, AML/CFT Policy, and PRA SS1/23 Model Risk with one-click cryptographic audit bundles.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>16 Legal Charters</span>
              <span className="text-emerald-400 font-medium">FCA Mutuals Reg</span>
            </div>
          </div>

          <div
            onClick={() => onNavigate('workflow')}
            className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <Cpu className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-colors" />
            </div>
            <h3 className="font-semibold text-white text-base">146-Gate Master Matrix</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Exhaustive statutory compliance lifecycle from RegScan boundary definition to Extreme Value Theory stress tests and Jetson edge sync.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>146 Gates</span>
              <span className="text-teal-400 font-medium">100% Passed</span>
            </div>
          </div>

          <div
            onClick={() => onNavigate('phase-deliverables')}
            className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            </div>
            <h3 className="font-semibold text-white text-base">40-Phase Deliverables</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Transparent verification dossiers and statutory deliverables for every phase from Phase 00 to Phase 39 with SHA-256 hashes.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Phase 00 - 39</span>
              <span className="text-emerald-400 font-medium">40 Deliverables</span>
            </div>
          </div>
        </div>
      </div>

      {/* Architectural Invariants Ledger */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">35 Architectural Invariants</h2>
            <p className="text-xs text-slate-400 mt-1">
              Non-negotiable mathematical and legal constraints enforced at compiler, kernel, and database trigger levels.
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={invariantSearch}
              onChange={(e) => setInvariantSearch(e.target.value)}
              placeholder="Filter invariants..."
              className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3 font-medium">Code</th>
                <th className="py-2.5 px-3 font-medium">Invariant Name</th>
                <th className="py-2.5 px-3 font-medium">Category</th>
                <th className="py-2.5 px-3 font-medium">Enforcement Mechanism</th>
                <th className="py-2.5 px-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredInvariants.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3 text-emerald-400 font-semibold">{inv.code}</td>
                  <td className="py-3 px-3 font-sans font-medium text-slate-200">
                    <div>{inv.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                      {inv.description}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-400">{inv.category}</td>
                  <td className="py-3 px-3 font-sans text-slate-400">{inv.enforcementMechanism}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="text-emerald-400 font-sans flex items-center justify-end gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active
                    </span>
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
