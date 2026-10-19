// src/components/CouncilB2GPortal.tsx
import React, { useState } from 'react';
import { useCivicTrust } from '../context/CivicTrustContext';
import { NavTab } from './Sidebar';
import {
  Building2,
  Scale,
  CheckCircle2,
  TrendingUp,
  MapPin,
  FileSpreadsheet,
  Download,
  Compass,
  ArrowRight,
} from 'lucide-react';

interface CouncilB2GPortalProps {
  onNavigate?: (tab: NavTab) => void;
}

export const CouncilB2GPortal: React.FC<CouncilB2GPortalProps> = ({ onNavigate }) => {
  const { councilWards } = useCivicTrust();

  const [anchorSpendTarget, setAnchorSpendTarget] = useState(45); // 45% default

  const totalPopulation = councilWards.reduce((sum, w) => sum + w.population, 0);
  const totalHardshipDisbursed = councilWards.reduce((sum, w) => sum + w.hardshipDisbursedGBP, 0);
  const avgTER = councilWards.reduce((sum, w) => sum + w.terScore, 0) / councilWards.length;
  const avgMultiplier = councilWards.reduce((sum, w) => sum + w.localMultiplier, 0) / councilWards.length;

  // Simulator: calculating local economic retention gain
  const councilProcurementBudgetGBP = 185_000_000; // £185M annual council procurement
  const localSpendRetainedGBP = (councilProcurementBudgetGBP * (anchorSpendTarget / 100));
  const economicOutputGeneratedGBP = localSpendRetainedGBP * avgMultiplier;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-indigo-400" />
            <span>Council B2G Portal & TER Planning Intelligence</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Preston Model civic wealth building, Tail Equity Ratio (TER) geospatial monitoring, and statutory Social Value reporting.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Anchor Partner:</span>
          <span className="text-indigo-300 font-semibold">London Borough of Camden</span>
        </div>
      </div>

      {/* Statutory Duty Compliance Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Social Value Act 2012</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-base font-bold text-white mt-1">TOMs Framework</div>
          <div className="text-[11px] text-emerald-400 mt-1">100% Audit Ready</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Equality Act 2010 (PSED)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-base font-bold text-white mt-1">Section 149 Parity</div>
          <div className="text-[11px] text-cyan-400 font-mono mt-1">AIR: 0.914 &ge; 0.80</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Care Act 2014</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-base font-bold text-white mt-1">Wellbeing Principle</div>
          <div className="text-[11px] text-emerald-400 mt-1">Immediate Grant Relief</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Environment Act 2021</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-base font-bold text-white mt-1">Local Multiplier</div>
          <div className="text-[11px] text-indigo-400 font-mono mt-1">{avgMultiplier.toFixed(2)}x Circulation</div>
        </div>
      </div>

      {/* Spatial Resilience Map Launcher Banner */}
      <div className="border border-indigo-700/80 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-950 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Interactive Leaflet GIS Layer Active</span>
          </div>
          <h3 className="font-bold text-white text-base">
            Spatial Resilience & Critical Infrastructure Geospatial Map
          </h3>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Visualize the spatial distribution of community commitment vaults, walking buffer zones (&le; 1km), and direct proximity to critical NHS hospitals, 132kV power substations, and Thames Water storm drainage.
          </p>
        </div>

        {onNavigate && (
          <button
            onClick={() => onNavigate('spatial-resilience')}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all hover:scale-105 cursor-pointer shadow-md"
          >
            <span>Launch Spatial Resilience Map</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Ward-Level Planning Intelligence & TER Matrix */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-400" />
              <span>Ward-Level Tail Equity Ratio (TER) & Wealth Retention</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              TER &le; 1.0 indicates vulnerable quintiles experience equal or superior risk protection compared to borough average.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-slate-400">Borough Average TER:</span>
            <span className="text-cyan-400 font-bold">{avgTER.toFixed(3)}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3 font-medium">Borough Ward</th>
                <th className="py-2.5 px-3 font-medium font-mono text-right">Population</th>
                <th className="py-2.5 px-3 font-medium font-mono text-right">Tail Equity Ratio</th>
                <th className="py-2.5 px-3 font-medium font-mono text-right">Hardship Disbursed</th>
                <th className="py-2.5 px-3 font-medium font-mono text-right">Local Multiplier</th>
                <th className="py-2.5 px-3 font-medium font-mono text-right">Anchor Spend %</th>
                <th className="py-2.5 px-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {councilWards.map((w, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3 font-sans font-medium text-slate-200">
                    {w.wardName}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300 tabular-nums">
                    {w.population.toLocaleString('en-GB')}
                  </td>
                  <td className="py-3 px-3 text-right tabular-nums">
                    <span
                      className={`font-semibold ${
                        w.terScore <= 1.0 ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {w.terScore.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-400 font-semibold tabular-nums">
                    £{w.hardshipDisbursedGBP.toLocaleString('en-GB')}
                  </td>
                  <td className="py-3 px-3 text-right text-cyan-300 font-semibold tabular-nums">
                    {w.localMultiplier.toFixed(2)}x
                  </td>
                  <td className="py-3 px-3 text-right text-slate-200 tabular-nums">
                    {w.anchorSpendPercent.toFixed(1)}%
                  </td>
                  <td className="py-3 px-3 text-right font-sans">
                    <span
                      className={`font-medium ${
                        w.status === 'EXEMPLARY'
                          ? 'text-emerald-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {w.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Anchor Tenant Procurement & Economic Multiplier Simulator */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6">
        <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>Community Wealth Multiplier Simulator (Preston Model)</span>
        </h2>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          Simulate how shifting anchor institution spend (Council, NHS Trusts, Universities) into local co-operatives multiplies circulating economic value.
        </p>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Anchor Local Procurement Target</span>
              <span className="font-mono text-emerald-400 font-bold text-sm tabular-nums">
                {anchorSpendTarget}% of Council Spend
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="75"
              step="5"
              value={anchorSpendTarget}
              onChange={(e) => setAnchorSpendTarget(parseInt(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>10% (Baseline)</span>
              <span>45% (Current Target)</span>
              <span>75% (Maximum Saturation)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400">Total Annual Council Budget</div>
              <div className="text-lg font-bold font-mono text-white mt-1 tabular-nums">
                £{(councilProcurementBudgetGBP / 1_000_000).toFixed(0)} Million
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Covered procurement spend</div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400">Locally Retained Spend</div>
              <div className="text-lg font-bold font-mono text-emerald-400 mt-1 tabular-nums">
                £{(localSpendRetainedGBP / 1_000_000).toFixed(1)} Million
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Kept within borough businesses</div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400">Total Economic Output Created</div>
              <div className="text-lg font-bold font-mono text-cyan-400 mt-1 tabular-nums">
                £{(economicOutputGeneratedGBP / 1_000_000).toFixed(1)} Million
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Using {avgMultiplier.toFixed(2)}x local velocity</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
