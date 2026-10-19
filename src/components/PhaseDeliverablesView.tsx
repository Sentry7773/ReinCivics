// src/components/PhaseDeliverablesView.tsx
import React, { useState } from 'react';
import { useCivicTrust } from '../context/CivicTrustContext';
import { Phase, PhaseDeliverable } from '../types';
import {
  CheckCircle2,
  FileCheck,
  Scale,
  Hash,
  Search,
  Filter,
  Eye,
  X,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const PhaseDeliverablesView: React.FC = () => {
  const { phases } = useCivicTrust();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | PhaseDeliverable['status']>('ALL');
  const [selectedDeliverable, setSelectedDeliverable] = useState<PhaseDeliverable | null>(null);

  const statuses: ('ALL' | PhaseDeliverable['status'])[] = [
    'ALL',
    'CERTIFIED',
    'ANCHORED',
    'DEPLOYED',
    'OPERATIONAL',
    'RECONCILED',
  ];

  const filteredPhases = phases.filter((phase) => {
    const d = phase.deliverable;
    if (statusFilter !== 'ALL' && d.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        phase.name.toLowerCase().includes(q) ||
        phase.code.toLowerCase().includes(q) ||
        d.name.toLowerCase().includes(q) ||
        d.documentRef.toLowerCase().includes(q) ||
        d.statutoryBasis.toLowerCase().includes(q) ||
        d.gateCodes.some((code) => code.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-emerald-400" />
            <span>40-Phase Deliverables & Statutory Artifacts</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete institutional audit visibility across all phases from Phase 00 (Regulatory Boundary) to Phase 39 (Solvent Resolution & Scale).
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Total Phases:</span>
          <span className="text-emerald-400 font-bold tabular-nums">{phases.length}</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">Filtered:</span>
          <span className="text-cyan-400 font-bold tabular-nums">{filteredPhases.length}</span>
        </div>
      </div>

      {/* Search and Status Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        <div className="md:col-span-7 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search phase name, gate code (e.g. R00.1, RP35.1), or statute..."
            className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="md:col-span-5 flex items-center gap-1.5 overflow-x-auto pb-1">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1.5 text-[11px] font-mono rounded-lg transition-colors whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-slate-800 text-emerald-300 font-semibold border border-emerald-800/80'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Master 40-Phase Deliverables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPhases.map((phase) => {
          const d = phase.deliverable;
          return (
            <div
              key={phase.code}
              onClick={() => setSelectedDeliverable(d)}
              className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 hover:border-slate-700 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Phase header & gates */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] font-mono">
                      <span className="font-bold text-emerald-400">{phase.code}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-cyan-400">
                        {d.gateCodes.length === 1
                          ? `[Gate ${d.gateCodes[0]}]`
                          : `[Gates ${d.gateCodes[0]}-${d.gateCodes[d.gateCodes.length - 1]}]`}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {phase.name}
                    </h3>
                  </div>

                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded border shrink-0 ${
                      d.status === 'CERTIFIED'
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                        : d.status === 'OPERATIONAL'
                        ? 'bg-cyan-950/60 text-cyan-300 border-cyan-800/60'
                        : 'bg-indigo-950/60 text-indigo-300 border-indigo-800/60'
                    }`}
                  >
                    {d.status}
                  </span>
                </div>

                {/* Deliverable title and ref */}
                <div className="mt-3 p-3 bg-slate-950/80 rounded-lg border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-200">{d.name}</span>
                    <span className="font-mono text-slate-400">#{d.documentRef}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{d.statutoryBasis}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed line-clamp-2">
                  {d.summary}
                </p>
              </div>

              {/* Footer proof & action */}
              <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1 font-mono text-slate-500">
                  <Hash className="w-3 h-3 text-cyan-400" />
                  <span>{d.hash.substring(0, 12)}...</span>
                </div>
                <span className="text-slate-400 group-hover:text-emerald-300 flex items-center gap-1 font-sans font-medium transition-colors">
                  <span>Inspect Artifact</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deliverable Inspection Modal */}
      {selectedDeliverable && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl relative space-y-5">
            <button
              onClick={() => setSelectedDeliverable(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <span>{selectedDeliverable.phaseCode}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedDeliverable.documentRef}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedDeliverable.status}</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1.5">
                {selectedDeliverable.name}
              </h2>
              <div className="text-xs text-slate-400 mt-0.5">
                Phase: {selectedDeliverable.phaseTitle}
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-slate-400 block text-[11px] mb-1 font-medium">Statutory Basis (Cite-or-Refuse Grounding)</span>
                <span className="font-mono text-slate-200">{selectedDeliverable.statutoryBasis}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] mb-1 font-medium">Deliverable Executive Summary</span>
                <p className="text-slate-300 leading-relaxed">{selectedDeliverable.summary}</p>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] mb-1.5 font-medium">Associated Governance Gates</span>
                <div className="flex flex-wrap gap-1.5 font-mono">
                  {selectedDeliverable.gateCodes.map((code) => (
                    <span
                      key={code}
                      className="px-2 py-1 bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 rounded text-xs"
                    >
                      {code} · Passed
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] mb-1 font-medium">Cryptographic Audit Hash (SHA-256)</span>
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-[11px] text-cyan-300 break-all">
                  {selectedDeliverable.hash}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono">Status: Verified & Anchored</span>
              <button
                onClick={() => setSelectedDeliverable(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
