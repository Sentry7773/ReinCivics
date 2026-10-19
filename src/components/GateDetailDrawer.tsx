// src/components/GateDetailDrawer.tsx
import React from 'react';
import { Gate } from '../types';
import { X, CheckCircle2, ShieldCheck, Scale, Cpu, Calendar, Hash } from 'lucide-react';

interface GateDetailDrawerProps {
  gate: Gate | null;
  onClose: () => void;
  onEvaluate: (gateId: string) => void;
}

export const GateDetailDrawer: React.FC<GateDetailDrawerProps> = ({
  gate,
  onClose,
  onEvaluate,
}) => {
  if (!gate) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-xl bg-slate-900 border-l border-slate-800 h-full overflow-y-auto p-6 flex flex-col justify-between shadow-2xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <span>{gate.code}</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-400">{gate.category}</span>
                <span aria-hidden="true">·</span>
                <span className="text-cyan-400">ERLA {gate.erlaLevel}</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1.5">{gate.name}</h2>
              <div className="text-xs text-slate-400 mt-0.5">{gate.phaseName}</div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status and Evaluation Timestamp */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="font-medium text-slate-200">Evaluation: {gate.status}</span>
            </div>
            <div className="text-slate-400 font-mono text-[11px] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{gate.lastEvaluatedAt}</span>
            </div>
          </div>

          {/* Statutory Citation (Cite-or-Refuse rule) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Scale className="w-4 h-4 text-emerald-400" />
              <span>Statutory Citation (Cite-or-Refuse Grounding)</span>
            </div>
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 leading-relaxed">
              {gate.statutoryCitation}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-300">Functional Specification</div>
            <p className="text-xs text-slate-400 leading-relaxed">{gate.description}</p>
          </div>

          {/* Pass Criteria */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-300">Pass / Compliance Criteria</div>
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-300 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{gate.passCriteria}</span>
            </div>
          </div>

          {/* Cryptographic Evidence Hash */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Hash className="w-4 h-4 text-cyan-400" />
              <span>Tamper-Proof Audit Hash (SHA-256)</span>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[11px] font-mono text-cyan-300 break-all">
              {gate.evidenceHash}
            </div>
          </div>

          {/* Evaluator Subsystem */}
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-slate-500" />
            <span>Auditing Subsystem: <strong className="text-slate-200 font-normal">{gate.evaluator}</strong></span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-slate-800 flex items-center gap-3">
          <button
            onClick={() => onEvaluate(gate.id)}
            className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Execute Live Verification Test
          </button>
          <button
            onClick={onClose}
            className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
