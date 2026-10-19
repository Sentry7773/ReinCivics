// src/components/DefensePackHub.tsx
import React, { useState } from 'react';
import { useCivicTrust } from '../context/CivicTrustContext';
import { LegalDocument } from '../types';
import { AuditLogs } from './AuditLogs';
import {
  FileText,
  Download,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Scale,
  Hash,
  Eye,
  X,
  History,
  Gavel,
  AlertTriangle,
} from 'lucide-react';

export type DefenseHubTab = 'charters' | 'audit-logs' | 'disputes';

export const DefensePackHub: React.FC = () => {
  const { legalDocuments, generateAuditBundle, auditLogs, disputes } = useCivicTrust();

  const [activeTab, setActiveTab] = useState<DefenseHubTab>('charters');
  const [selectedDoc, setSelectedDoc] = useState<LegalDocument | null>(null);
  const [generatedJSON, setGeneratedJSON] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleCompile = () => {
    const bundleJSON = generateAuditBundle();
    setGeneratedJSON(bundleJSON);
  };

  const handleDownloadFile = () => {
    if (!generatedJSON) return;
    const blob = new Blob([generatedJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `civictrust-defense-pack-audit-${new Date().toISOString().substring(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-emerald-400" />
            <span>Statutory Legal Corpus & Defense Packaging</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete institutional archive of 16 legal instruments governing the BenCom, with live cryptographic audit logs and dispute dockets.
          </p>
        </div>
        <button
          onClick={handleCompile}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shrink-0"
        >
          <FileText className="w-4 h-4" />
          <span>Compile Comprehensive Defense Pack</span>
        </button>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('charters')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === 'charters'
              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Scale className="w-3.5 h-3.5 text-emerald-400" />
          <span>16 Legal Charters &amp; Policies</span>
          <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
            {legalDocuments.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('audit-logs')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === 'audit-logs'
              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <History className="w-3.5 h-3.5 text-emerald-400" />
          <span>Immutable Audit Logs</span>
          <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
            {auditLogs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('disputes')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === 'disputes'
              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Gavel className="w-3.5 h-3.5 text-amber-400" />
          <span>Dispute Dockets (Phase 32)</span>
          <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
            {disputes.length}
          </span>
        </button>
      </div>

      {/* Generated Defense Pack Modal / Preview */}
      {generatedJSON && (
        <div className="border border-emerald-800 bg-emerald-950/20 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-800/60">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Defense Pack Ready for Judicial / Regulatory Audit</span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Contains verified proof trees for all 146 Gates, 35 Invariants, 16 Constitutional Charters, and live Audit Trail.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadFile}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download JSON Dossier</span>
              </button>
              <button
                onClick={() => setGeneratedJSON(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-[11px] font-mono text-emerald-300 max-h-72 overflow-y-auto leading-relaxed">
            {generatedJSON}
          </pre>

          {downloadSuccess && (
            <div className="text-xs text-emerald-400 font-medium">
              Audit dossier downloaded successfully.
            </div>
          )}
        </div>
      )}

      {/* Tab 1: 16 Legal Documents Catalog */}
      {activeTab === 'charters' && (
        <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-400" />
                <span>16 Institutional Charters & Statutory Policies</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Drafted under English Law conforming to FCA Mutual Societies Handbook, PRA SS1/23, and UK GDPR.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400">16/16 Active</span>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {legalDocuments.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-950 transition-colors cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-emerald-400 font-bold text-xs">{doc.number}</span>
                    <h3 className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">
                      {doc.title}
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60 shrink-0">
                    {doc.fcaMutualsStatus}
                  </span>
                </div>

                <div className="text-xs text-slate-400 font-mono mt-2">
                  Basis: {doc.statutoryAct}
                </div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed line-clamp-2">
                  {doc.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
                <span>Audited: {doc.lastAudited}</span>
                <span className="text-slate-400 group-hover:text-white flex items-center gap-1 font-sans">
                  <span>View Details</span>
                  <Eye className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Tab 2: Audit Logs View */}
      {activeTab === 'audit-logs' && (
        <AuditLogs />
      )}

      {/* Tab 3: Dispute Cases & Arbitration Dockets (Phase 32) */}
      {activeTab === 'disputes' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-slate-800 bg-slate-900/50">
            <div>
              <div className="flex items-center gap-2">
                <Gavel className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold text-white">Statutory Dispute Resolution Dockets</h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                  {disputes.length} Dockets Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                FCA Mutuals Rule 42 & Civil Evidence Act 1995 arbitration repository for barter VAT, municipal swap rate, and priority queue appeals.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {disputes.map((d) => (
              <div
                key={d.id}
                className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-amber-400 font-bold text-xs">{d.docketNumber}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-xs font-mono text-slate-300">{d.category.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      d.status === 'RESOLVED'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border-amber-800'
                    }`}>
                      {d.status}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">{d.filedAt}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed">
                  <div className="font-medium text-white mb-0.5">Claimant: {d.claimantName} ({d.claimantId})</div>
                  <p className="text-slate-400">{d.description}</p>
                </div>

                {d.disputedAmountGBP !== undefined && (
                  <div className="text-xs font-mono text-slate-300">
                    Disputed Amount: <span className="text-emerald-400 font-bold">£{d.disputedAmountGBP.toFixed(2)}</span>
                  </div>
                )}

                {d.verdictNotes && (
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-mono flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-200">Tribunal Findings: </span>
                      {d.verdictNotes}
                    </div>
                  </div>
                )}

                <div className="pt-2 text-[11px] font-mono text-slate-500 flex items-center justify-between">
                  <span>Basis: {d.statutoryBasis}</span>
                  <span>Ref: {d.evidenceRef}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Document Detail Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setSelectedDoc(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <span>Document #{selectedDoc.number}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedDoc.category}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedDoc.fcaMutualsStatus}</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1.5">{selectedDoc.title}</h2>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                Statute: {selectedDoc.statutoryAct}
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <h4 className="font-semibold text-slate-300 mb-1">Executive Summary</h4>
                <p className="text-slate-400 leading-relaxed">{selectedDoc.summary}</p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-300 mb-2">Key Enforceable Clauses</h4>
                <div className="space-y-1.5">
                  {selectedDoc.keyClauses.map((clause, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-[11px] text-slate-300 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{clause}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono">Last Independent Audit: {selectedDoc.lastAudited}</span>
              <button
                onClick={() => setSelectedDoc(null)}
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
