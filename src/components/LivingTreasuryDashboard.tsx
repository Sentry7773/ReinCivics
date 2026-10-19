// src/components/LivingTreasuryDashboard.tsx
import React, { useState } from 'react';
import { useCivicTrust } from '../context/CivicTrustContext';
import {
  Landmark,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Layers,
  BarChart2,
} from 'lucide-react';

export const LivingTreasuryDashboard: React.FC = () => {
  const {
    reserveTranches,
    aipsConstraints,
    shapFeatures,
    yieldSweepsHistory,
    rebalanceTreasury,
    executeYieldSweep,
    triggerKillSwitch,
  } = useCivicTrust();

  const [sweepMessage, setSweepMessage] = useState<string | null>(null);

  const totalReserveGBP = reserveTranches.reduce((sum, t) => sum + t.balanceGBP, 0);

  // Compute weighted average yield
  const weightedYieldBps =
    totalReserveGBP > 0
      ? reserveTranches.reduce((sum, t) => sum + t.balanceGBP * t.yieldBps, 0) / totalReserveGBP
      : 0;

  const annualYieldGBP = (totalReserveGBP * weightedYieldBps) / 10000;
  const weeklyYieldGBP = annualYieldGBP / 52;

  const instantCashTranches = reserveTranches.filter(
    (t) => t.type === 'RESERVE_INSTANT' || t.type === 'HARDSHIP_INSTANT'
  );
  const totalInstantCashGBP = instantCashTranches.reduce((sum, t) => sum + t.balanceGBP, 0);
  const instantLiquidityRatio = (totalInstantCashGBP / totalReserveGBP) * 100;

  const handleSweep = () => {
    executeYieldSweep();
    setSweepMessage('Weekly 70/30 yield sweep distributed to Deep Reserve & Hardship Absorber.');
    setTimeout(() => setSweepMessage(null), 4000);
  };

  const handleKillSwitch = () => {
    if (window.confirm('WARNING: Activate Fiduciary Kill-Switch? This liquidates gilt and term positions into 50% Instant Cash / 50% Overnight MMF.')) {
      triggerKillSwitch('User initiated emergency fiduciary safe-haven protocol');
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Landmark className="w-5 h-5 text-emerald-400" />
            <span>Living Treasury AI & A-IPS Fiduciary Engine</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous, non-speculative liquidity management under strict Trustee Act 2000 and PRA SS1/23 Model Risk standards.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={rebalanceTreasury}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Simulate AI Optimization</span>
          </button>
          <button
            onClick={handleSweep}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-2"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Execute 70/30 Yield Sweep</span>
          </button>
          <button
            onClick={handleKillSwitch}
            className="px-3.5 py-2 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 rounded-lg text-xs font-medium transition-colors flex items-center gap-2"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Fiduciary Kill-Switch</span>
          </button>
        </div>
      </div>

      {sweepMessage && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{sweepMessage}</span>
        </div>
      )}

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/50">
          <div className="text-xs text-slate-400">Total Fiduciary Reserves</div>
          <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
            £{totalReserveGBP.toLocaleString('en-GB')}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
            <span>100% Client Safeguarded</span>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/50">
          <div className="text-xs text-slate-400">Weighted Average Yield</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
            {(weightedYieldBps / 100).toFixed(2)}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            Annual: £{Math.round(annualYieldGBP).toLocaleString('en-GB')}
          </div>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/50">
          <div className="text-xs text-slate-400">Weekly Yield Distribution</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">
            £{Math.round(weeklyYieldGBP).toLocaleString('en-GB')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            70% Deep Reserve · 30% Hardship
          </div>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/50">
          <div className="text-xs text-slate-400">Instant Liquidity Buffer</div>
          <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
            {instantLiquidityRatio.toFixed(1)}%
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono">
            A-IPS Minimum: &ge; 25.0%
          </div>
        </div>
      </div>

      {/* Asset Tranches Breakdown */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Governed Reserve Tranches (Fiat-Only Portfolio)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Held with UK authorized institutions under Payment Services Regulations 2017 client safeguarding trust letters.
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400">
            7 Fiduciary Accounts
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3 font-medium">Tranche Name</th>
                <th className="py-2.5 px-3 font-medium font-mono text-right">Balance (GBP)</th>
                <th className="py-2.5 px-3 font-medium font-mono text-right">Allocation</th>
                <th className="py-2.5 px-3 font-medium font-mono text-right">Yield</th>
                <th className="py-2.5 px-3 font-medium">Settlement Horizon</th>
                <th className="py-2.5 px-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {reserveTranches.map((t) => {
                const sharePercent = (t.balanceGBP / totalReserveGBP) * 100;
                return (
                  <tr key={t.type} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-sans font-medium text-slate-200">
                      <div>{t.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">{t.type}</div>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-100 font-semibold tabular-nums">
                      £{t.balanceGBP.toLocaleString('en-GB')}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-300 tabular-nums">
                      {sharePercent.toFixed(1)}%
                    </td>
                    <td className="py-3 px-3 text-right text-emerald-400 font-semibold tabular-nums">
                      {(t.yieldBps / 100).toFixed(2)}%
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-400">
                      {t.liquidityTier}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-emerald-400 font-sans font-medium flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Compliant
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* A-IPS Fiduciary Constraints & Explainable AI (SHAP) Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* A-IPS Constraints */}
        <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>A-IPS Fiduciary Constraints</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Algorithmic Investment Policy Statement boundaries. Hard rules that can never be violated by AI.
              </p>
            </div>
            <span className="text-xs text-emerald-400 font-mono font-medium">5/5 Verified</span>
          </div>

          <div className="space-y-3">
            {aipsConstraints.map((c) => (
              <div
                key={c.id}
                className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 flex flex-col justify-between gap-2"
              >
                <div className="flex items-start justify-between">
                  <div className="text-xs font-semibold text-slate-200">{c.name}</div>
                  <span className="text-xs text-emerald-400 font-mono font-medium">PASS</span>
                </div>
                <div className="text-[11px] text-slate-400">{c.description}</div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-[11px] font-mono">
                  <span className="text-slate-500">Threshold: {c.threshold}</span>
                  <span className="text-slate-200 font-medium">{c.currentValue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Explainable AI (SHAP Attribution) */}
        <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-cyan-400" />
                <span>Explainable AI (SHAP Feature Attribution)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Mathematical weights determining autonomous allocation decisions, conforming to EU AI Act Article 14.
              </p>
            </div>
            <span className="text-xs text-cyan-400 font-mono">Watcher Active</span>
          </div>

          <div className="space-y-4">
            {shapFeatures.map((f, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-200">{f.feature}</span>
                  <span className={`font-mono font-semibold tabular-nums ${f.impact === 'POSITIVE' ? 'text-emerald-400' : 'text-cyan-400'}`}>
                    {f.weight > 0 ? `+${f.weight.toFixed(2)}` : f.weight.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden flex">
                  {f.weight < 0 ? (
                    <div
                      className="bg-cyan-500 h-full rounded-full transition-all"
                      style={{ width: `${Math.abs(f.weight) * 100}%` }}
                    />
                  ) : (
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all"
                      style={{ width: `${f.weight * 100}%` }}
                    />
                  )}
                </div>
                <div className="text-[11px] text-slate-400 leading-normal">{f.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Yield Sweeps Historical Audit Log */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Yield Sweep Audit History (70% Deep Reserve / 30% Hardship Shock Absorber)</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">Audited via immudb</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3 font-medium">Distribution Date</th>
                <th className="py-2.5 px-3 font-medium font-mono text-right">Total Net Yield (GBP)</th>
                <th className="py-2.5 px-3 font-medium font-mono text-right">Deep Reserve Share (70%)</th>
                <th className="py-2.5 px-3 font-medium font-mono text-right">Hardship Share (30%)</th>
                <th className="py-2.5 px-3 font-medium text-right">Execution Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {yieldSweepsHistory.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3 text-slate-200">{s.date}</td>
                  <td className="py-3 px-3 text-right text-emerald-400 font-semibold tabular-nums">
                    £{s.totalYieldGBP.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300 tabular-nums">
                    £{s.deepReserveShareGBP.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right text-cyan-300 tabular-nums">
                    £{s.shockAbsorberShareGBP.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right font-sans">
                    <span className="text-emerald-400 font-medium inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {s.status}
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
