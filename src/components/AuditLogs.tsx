// src/components/AuditLogs.tsx
import React, { useState } from 'react';
import { useCivicTrust } from '../context/CivicTrustContext';
import { AuditLog, AuditEventType, AuditSeverity } from '../types';
import {
  FileText,
  Search,
  Filter,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Info,
  Clock,
  Hash,
  Copy,
  Check,
  PlusCircle,
  X,
  ExternalLink,
} from 'lucide-react';

export const AuditLogs: React.FC = () => {
  const { auditLogs, addAuditLog } = useCivicTrust();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<AuditEventType | 'ALL'>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<AuditSeverity | 'ALL'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showAttestModal, setShowAttestModal] = useState(false);

  // Manual attestation form state
  const [attestActor, setAttestActor] = useState('External FCA Mutuals Examiner #304');
  const [attestAction, setAttestAction] = useState('Periodic Statutory Integrity Review');
  const [attestDetails, setAttestDetails] = useState('Inspected BenCom asset backing, 146 Gate certificates, and PRA SS1/23 model invariants.');
  const [attestSeverity, setAttestSeverity] = useState<AuditSeverity>('INFO');
  const [attestStatutory, setAttestStatutory] = useState('Co-operative and Community Benefit Societies Act 2014 s.2');

  const handleCopyHash = (id: string, hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCreateAttestation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attestAction || !attestDetails) return;

    addAuditLog({
      eventType: 'SYSTEM_EVENT',
      severity: attestSeverity,
      actor: attestActor,
      action: attestAction,
      details: attestDetails,
      targetRef: `ATTEST-${Date.now().toString().slice(-6)}`,
      statutoryBasis: attestStatutory,
    });

    setShowAttestModal(false);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `civictrust_audit_logs_${new Date().toISOString().substring(0, 10)}.json`);
    dlAnchorElem.click();
  };

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Event Type', 'Severity', 'Actor', 'Action', 'Target Ref', 'Statutory Basis', 'SHA-256 Hash', 'Details'];
    const rows = auditLogs.map((log) => [
      `"${log.timestamp}"`,
      `"${log.eventType}"`,
      `"${log.severity}"`,
      `"${log.actor.replace(/"/g, '""')}"`,
      `"${log.action.replace(/"/g, '""')}"`,
      `"${log.targetRef}"`,
      `"${log.statutoryBasis || ''}"`,
      `"${log.hash}"`,
      `"${log.details.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `civictrust_audit_logs_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter logic
  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      searchTerm === '' ||
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.statutoryBasis && log.statutoryBasis.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedType === 'ALL' || log.eventType === selectedType;
    const matchesSeverity = selectedSeverity === 'ALL' || log.severity === selectedSeverity;

    return matchesSearch && matchesType && matchesSeverity;
  });

  const getSeverityBadge = (sev: AuditSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-rose-950/80 text-rose-300 border border-rose-800">
            <AlertOctagon className="w-3 h-3 text-rose-400" />
            CRITICAL
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-950/80 text-amber-300 border border-amber-800">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            WARNING
          </span>
        );
      case 'INFO':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800">
            <Info className="w-3 h-3 text-emerald-400" />
            INFO
          </span>
        );
    }
  };

  const getTypeBadge = (type: AuditEventType) => {
    const styles: Record<AuditEventType, string> = {
      GATE_APPROVAL: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60',
      SYSTEM_EVENT: 'text-cyan-400 bg-cyan-950/40 border-cyan-800/60',
      TRANSACTION: 'text-indigo-400 bg-indigo-950/40 border-indigo-800/60',
      CIRCUIT_BREAKER: 'text-amber-400 bg-amber-950/40 border-amber-800/60',
      DISPUTE: 'text-rose-400 bg-rose-950/40 border-rose-800/60',
      TREASURY_SWEEP: 'text-teal-400 bg-teal-950/40 border-teal-800/60',
      EMERGENCY_HALT: 'text-rose-400 bg-rose-950/40 border-rose-800/60',
      MULTI_SIG: 'text-purple-400 bg-purple-950/40 border-purple-800/60',
    };

    return (
      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${styles[type] || 'text-slate-300'}`}>
        {type.replace(/_/g, ' ')}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Action & Summary Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-xl border border-slate-800 bg-slate-900/50">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Immutable Fiduciary & Gate Audit Trail</h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              {auditLogs.length} Records Verified
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tamper-evident system log compliant with the Civil Evidence Act 1995 (computer-produced evidence) and PRA SS1/23.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowAttestModal(true)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Record Auditor Attestation</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export Full JSON Dossier</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 rounded-xl border border-slate-800/80 bg-slate-950/60 text-xs">
        {/* Search */}
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by actor, action, target ref, hash, statute..."
            className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Event Type Filter */}
        <div className="md:col-span-4 flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as AuditEventType | 'ALL')}
            className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="ALL">All Event Types ({auditLogs.length})</option>
            <option value="GATE_APPROVAL">Gate Approvals</option>
            <option value="SYSTEM_EVENT">System Events</option>
            <option value="TRANSACTION">Transactions & Barter</option>
            <option value="TREASURY_SWEEP">Treasury Sweeps</option>
            <option value="CIRCUIT_BREAKER">Circuit Breakers</option>
            <option value="DISPUTE">Dispute Filings</option>
            <option value="MULTI_SIG">Multi-Sig Actions</option>
            <option value="EMERGENCY_HALT">Emergency Halts</option>
          </select>
        </div>

        {/* Severity Filter */}
        <div className="md:col-span-3">
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value as AuditSeverity | 'ALL')}
            className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="ALL">All Severities</option>
            <option value="INFO">Info Only</option>
            <option value="WARNING">Warnings</option>
            <option value="CRITICAL">Critical Alerts</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/30">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-medium text-[11px]">
                <th className="py-3 px-3.5">Timestamp (UTC)</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Severity</th>
                <th className="py-3 px-3">Actor &amp; Ref</th>
                <th className="py-3 px-3.5">Action &amp; Details</th>
                <th className="py-3 px-3">Statutory Basis</th>
                <th className="py-3 px-3.5 text-right">Proof Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No audit records match the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-3.5 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{log.timestamp}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">{getTypeBadge(log.eventType)}</td>
                    <td className="py-3 px-3 whitespace-nowrap">{getSeverityBadge(log.severity)}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors whitespace-nowrap">
                        {log.actor}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        {log.targetRef}
                      </div>
                    </td>
                    <td className="py-3 px-3.5 max-w-sm">
                      <div className="font-medium text-slate-200">{log.action}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{log.details}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-[11px] max-w-xs truncate font-mono">
                      {log.statutoryBasis || '—'}
                    </td>
                    <td className="py-3 px-3.5 text-right whitespace-nowrap font-mono text-[11px]">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="text-slate-400 hover:text-emerald-300 transition-colors">
                          {log.hash.substring(0, 10)}...{log.hash.slice(-6)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyHash(log.id, log.hash);
                          }}
                          title="Copy Full SHA-256 Hash"
                          className="p-1 text-slate-500 hover:text-white rounded hover:bg-slate-800 transition-colors"
                        >
                          {copiedId === log.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Log Drawer / Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl relative space-y-5">
            <button
              onClick={() => setSelectedLog(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start justify-between pr-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {getTypeBadge(selectedLog.eventType)}
                  {getSeverityBadge(selectedLog.severity)}
                  <span className="text-xs font-mono text-slate-500">ID: {selectedLog.id}</span>
                </div>
                <h3 className="text-lg font-bold text-white">{selectedLog.action}</h3>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  Actor: <span className="text-slate-200">{selectedLog.actor}</span> · Target:{' '}
                  <span className="text-emerald-400">{selectedLog.targetRef}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <div>
                <div className="text-slate-400 font-semibold mb-1">Event Narrative & Operational Details</div>
                <p className="text-slate-200 leading-relaxed font-sans">{selectedLog.details}</p>
              </div>

              {selectedLog.statutoryBasis && (
                <div className="pt-2 border-t border-slate-800">
                  <div className="text-slate-400 font-semibold mb-1">Statutory Basis / Judicial Authority</div>
                  <div className="text-emerald-400 font-mono text-[11px]">{selectedLog.statutoryBasis}</div>
                </div>
              )}

              <div className="pt-2 border-t border-slate-800">
                <div className="text-slate-400 font-semibold mb-1 flex items-center justify-between">
                  <span>SHA-256 Cryptographic Proof Digest</span>
                  <button
                    onClick={() => handleCopyHash(selectedLog.id, selectedLog.hash)}
                    className="text-emerald-400 hover:underline flex items-center gap-1 font-mono text-[10px]"
                  >
                    {copiedId === selectedLog.id ? 'Copied!' : 'Copy Hash'}
                  </button>
                </div>
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded font-mono text-[11px] text-emerald-300 break-all select-all">
                  {selectedLog.hash}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800 text-slate-400 font-mono">
              <span>Timestamp: {selectedLog.timestamp}</span>
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors font-sans"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Attestation Modal */}
      {showAttestModal && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowAttestModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Statutory Auditor Attestation</span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">Record In-Session Inspection Stamp</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Appends an immutable entry to the cryptographic audit trail for external FCA / judicial review.
              </p>
            </div>

            <form onSubmit={handleCreateAttestation} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Auditor / Regulatory Actor</label>
                <input
                  type="text"
                  value={attestActor}
                  onChange={(e) => setAttestActor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Audit Action Title</label>
                <input
                  type="text"
                  value={attestAction}
                  onChange={(e) => setAttestAction(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Severity Classification</label>
                <select
                  value={attestSeverity}
                  onChange={(e) => setAttestSeverity(e.target.value as AuditSeverity)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="INFO">INFO - Conformance Confirmed</option>
                  <option value="WARNING">WARNING - Advisory Observation</option>
                  <option value="CRITICAL">CRITICAL - Statutory Non-Compliance Exception</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Statutory Basis</label>
                <input
                  type="text"
                  value={attestStatutory}
                  onChange={(e) => setAttestStatutory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Detailed Attestation Notes</label>
                <textarea
                  value={attestDetails}
                  onChange={(e) => setAttestDetails(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAttestModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Seal Attestation &amp; Sign</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
