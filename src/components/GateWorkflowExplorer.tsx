// src/components/GateWorkflowExplorer.tsx
import React, { useState } from 'react';
import { useCivicTrust } from '../context/CivicTrustContext';
import { GateCategory, ERLALevel, Gate } from '../types';
import { GateDetailDrawer } from './GateDetailDrawer';
import { Search, CheckCircle2, ChevronRight, Filter } from 'lucide-react';

export const GateWorkflowExplorer: React.FC = () => {
  const { gates, phases, evaluateGate, selectedGate, setSelectedGate } = useCivicTrust();

  const [selectedPhase, setSelectedPhase] = useState<number | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<GateCategory | 'ALL'>('ALL');
  const [selectedERLA, setSelectedERLA] = useState<ERLALevel | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Available categories
  const categories: (GateCategory | 'ALL')[] = [
    'ALL',
    'RegScan',
    'JurisActuary',
    'Economic',
    'Fairness',
    'Emergency',
    'Governance',
    'LivingTreasury',
    'RunProtection',
    'Solidarity',
    'ESG',
    'B2G',
    'Security',
    'Legal',
    'Operational',
    'AIGovernance',
  ];

  const erlaLevels: (ERLALevel | 'ALL')[] = ['ALL', 'L1', 'L2', 'L3', 'L4', 'L5'];

  const filteredGates = gates.filter((gate) => {
    if (selectedPhase !== 'ALL' && gate.phaseNumber !== selectedPhase) return false;
    if (selectedCategory !== 'ALL' && gate.category !== selectedCategory) return false;
    if (selectedERLA !== 'ALL' && gate.erlaLevel !== selectedERLA) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        gate.code.toLowerCase().includes(q) ||
        gate.name.toLowerCase().includes(q) ||
        gate.statutoryCitation.toLowerCase().includes(q) ||
        gate.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header and Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Master 146-Gate Workflow & Audit Matrix</h1>
          <p className="text-xs text-slate-400 mt-1">
            29-Phase full-lifecycle statutory and actuarial verification pipeline. Enforces Cite-or-Refuse grounding on every rule.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Total Filtered:</span>
          <span className="text-emerald-400 font-bold tabular-nums">{filteredGates.length}</span>
          <span className="text-slate-500">/</span>
          <span className="text-slate-300 tabular-nums">{gates.length} Gates</span>
        </div>
      </div>

      {/* Phase Navigator (Horizontal Segmented Buttons) */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-4">
        <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
          <span>Filter by Master Phase</span>
          <button
            onClick={() => setSelectedPhase('ALL')}
            className={`text-xs ${selectedPhase === 'ALL' ? 'text-emerald-400 font-medium' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Show All Phases ({phases.length})
          </button>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1">
          <button
            onClick={() => setSelectedPhase('ALL')}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              selectedPhase === 'ALL'
                ? 'bg-emerald-600 text-white font-medium'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All Phases
          </button>
          {phases.map((p) => {
            const isSelected = selectedPhase === p.number;
            return (
              <button
                key={p.number}
                onClick={() => setSelectedPhase(p.number)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-emerald-600 text-white font-medium'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                P{p.number.toString().padStart(2, '0')}: {p.name.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search */}
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search code, statute, or keyword..."
            className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Category Select */}
        <div className="md:col-span-4">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'ALL' ? 'All Gate Categories' : c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ERLA Level Segmented Buttons */}
        <div className="md:col-span-3 flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg p-1">
          {erlaLevels.map((lvl) => {
            const isActive = selectedERLA === lvl;
            return (
              <button
                key={lvl}
                onClick={() => setSelectedERLA(lvl)}
                className={`flex-1 py-1.5 text-[11px] font-mono rounded transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-cyan-400 font-semibold shadow-xs'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {lvl}
              </button>
            );
          })}
        </div>
      </div>

      {/* High-Density Gates Table */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                <th className="py-3 px-3 font-medium">Gate Code</th>
                <th className="py-3 px-3 font-medium">Name & Phase</th>
                <th className="py-3 px-3 font-medium">Category</th>
                <th className="py-3 px-3 font-medium">ERLA Tier</th>
                <th className="py-3 px-3 font-medium">Statutory Basis (Citation)</th>
                <th className="py-3 px-3 font-medium font-mono">Proof Hash</th>
                <th className="py-3 px-3 font-medium text-right">Status</th>
                <th className="py-3 px-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredGates.map((gate) => (
                <tr
                  key={gate.id}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  onClick={() => setSelectedGate(gate)}
                >
                  <td className="py-3 px-3 font-mono font-semibold text-emerald-400">
                    {gate.code}
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-200">
                    <div>{gate.name}</div>
                    <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                      {gate.phaseName}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    <span>{gate.category}</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-cyan-300 text-[11px]">
                    {gate.erlaLevel}
                  </td>
                  <td className="py-3 px-3 text-slate-400 max-w-xs truncate" title={gate.statutoryCitation}>
                    {gate.statutoryCitation}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                    {gate.evidenceHash.substring(0, 10)}...
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="text-emerald-400 font-medium inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {gate.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedGate(gate);
                      }}
                      className="px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded transition-colors inline-flex items-center gap-1"
                    >
                      <span>Inspect</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Gate Drawer */}
      <GateDetailDrawer
        gate={selectedGate}
        onClose={() => setSelectedGate(null)}
        onEvaluate={(id) => evaluateGate(id)}
      />
    </div>
  );
};
