// src/components/SolidarityAndESG.tsx
import React, { useState } from 'react';
import { useCivicTrust } from '../context/CivicTrustContext';
import { ESGCredential } from '../types';
import {
  HeartHandshake,
  Award,
  CheckCircle2,
  FileCheck,
  Hash,
  Scale,
  X,
  ExternalLink,
} from 'lucide-react';

export const SolidarityAndESG: React.FC = () => {
  const {
    solidarityContributions,
    esgCredentials,
    addSolidarityContribution,
    generateESGCredential,
  } = useCivicTrust();

  // Citizen Contribution Form State
  const [citizenName, setCitizenName] = useState('');
  const [citizenAmount, setCitizenAmount] = useState('25');
  const [citizenSuccess, setCitizenSuccess] = useState(false);

  // Business Credential Form State
  const [bizName, setBizName] = useState('');
  const [bizNumber, setBizNumber] = useState('');
  const [bizAmount, setBizAmount] = useState('5000');
  const [bizSuccess, setBizSuccess] = useState(false);

  // Selected Certificate Modal State
  const [selectedCert, setSelectedCert] = useState<ESGCredential | null>(null);

  const handleCitizenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(citizenAmount);
    if (!citizenName.trim() || isNaN(amt) || amt <= 0) return;

    addSolidarityContribution(citizenName.trim(), 'CITIZEN', amt);
    setCitizenSuccess(true);
    setCitizenName('');
    setTimeout(() => setCitizenSuccess(false), 4000);
  };

  const handleBizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(bizAmount);
    if (!bizName.trim() || !bizNumber.trim() || isNaN(amt) || amt <= 0) return;

    generateESGCredential(bizName.trim(), bizNumber.trim(), amt);
    setBizSuccess(true);
    setBizName('');
    setBizNumber('');
    setTimeout(() => setBizSuccess(false), 4000);
  };

  const totalPledged = solidarityContributions.reduce((sum, c) => sum + c.amountGBP, 0);
  const totalHardshipAllocated = solidarityContributions.reduce((sum, c) => sum + c.shockAbsorberShare, 0);
  const totalEnterpriseAllocated = solidarityContributions.reduce((sum, c) => sum + c.enterpriseFundShare, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
            <HeartHandshake className="w-5 h-5 text-amber-400" />
            <span>Solidarity Fund & Business ESG "S" Credentialing</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Opt-in community contributions with immutable 60/40 structural allocation and verifiable Social Value Act 2012 credentials.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-slate-400">Total Solidarity Pledged:</span>
          <span className="text-emerald-400 font-bold tabular-nums">£{totalPledged.toLocaleString('en-GB')}</span>
        </div>
      </div>

      {/* 60/40 Structural Split Banner */}
      <div className="p-5 rounded-xl border border-amber-800/60 bg-amber-950/20 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div>
          <div className="text-amber-400 font-semibold flex items-center gap-1.5">
            <Scale className="w-4 h-4" />
            <span>Immutable 60/40 Split Rule</span>
          </div>
          <p className="text-slate-300 mt-1 leading-relaxed">
            Every pound donated is automatically partitioned: 60% directly shields vulnerable families via the Hardship Fund,
            and 40% finances zero-interest local enterprise loans.
          </p>
        </div>
        <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 flex flex-col justify-between">
          <span className="text-slate-400 font-mono">60% Hardship Shock Absorber</span>
          <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
            £{Math.round(totalHardshipAllocated).toLocaleString('en-GB')}
          </div>
          <span className="text-[11px] text-slate-500">Instant welfare grant liquidity</span>
        </div>
        <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 flex flex-col justify-between">
          <span className="text-slate-400 font-mono">40% Community Enterprise Fund</span>
          <div className="text-xl font-bold font-mono text-cyan-400 tabular-nums">
            £{Math.round(totalEnterpriseAllocated).toLocaleString('en-GB')}
          </div>
          <span className="text-[11px] text-slate-500">Catalytic micro-credit for co-ops</span>
        </div>
      </div>

      {/* Two Forms: Citizen Contribution vs Business ESG Credential */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Citizen Contribution Form */}
        <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6">
          <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-amber-400" />
            <span>Citizen / Member Micro-Contribution</span>
          </h2>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            Voluntary round-up or one-off pledge with 100% opt-in compliance (UK GDPR Art. 7).
          </p>

          <form onSubmit={handleCitizenSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Your Name or Pseudonym</label>
              <input
                type="text"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                placeholder="e.g. Maya Lin"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Contribution Amount (£ GBP)</label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {['10', '25', '50', '100'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setCitizenAmount(val)}
                    className={`py-1.5 font-mono rounded border transition-colors ${
                      citizenAmount === val
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    £{val}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={citizenAmount}
                onChange={(e) => setCitizenAmount(e.target.value)}
                min="1"
                step="1"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg transition-colors"
            >
              Confirm Voluntary Contribution
            </button>

            {citizenSuccess && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-lg text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Thank you! Your contribution has been partitioned 60/40.</span>
              </div>
            )}
          </form>
        </div>

        {/* Business ESG Credential Generator */}
        <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6">
          <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Issue Business ESG "S" Credential</span>
          </h2>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            Generates immutable SHA-256 certificate satisfying UK Public Services (Social Value) Act 2012 for council tenders.
          </p>

          <form onSubmit={handleBizSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Company Legal Name</label>
                <input
                  type="text"
                  value={bizName}
                  onChange={(e) => setBizName(e.target.value)}
                  placeholder="e.g. North London Solar Ltd"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Companies House Number</label>
                <input
                  type="text"
                  value={bizNumber}
                  onChange={(e) => setBizNumber(e.target.value)}
                  placeholder="e.g. 09841284"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Pledge Amount (£ GBP)</label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {['2500', '5000', '15000'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setBizAmount(val)}
                    className={`py-1.5 font-mono rounded border transition-colors ${
                      bizAmount === val
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    £{parseInt(val).toLocaleString()}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={bizAmount}
                onChange={(e) => setBizAmount(e.target.value)}
                min="500"
                step="100"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors"
            >
              Generate Cryptographic ESG Certificate
            </button>

            {bizSuccess && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-lg text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Certificate generated & anchored to immutable registry.</span>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Verified Business ESG Credentials Directory */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Verified ESG "S" Credentials Registry (Procurement Act 2023)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Accredited local businesses eligible for statutory 10-20% social value weighting in public council tenders.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400">immudb Anchored</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3 font-medium">Business Name & Co. No</th>
                <th className="py-2.5 px-3 font-medium font-mono text-right">Pledged (GBP)</th>
                <th className="py-2.5 px-3 font-medium font-mono text-right">Social Value Score</th>
                <th className="py-2.5 px-3 font-medium">Procurement Qualification</th>
                <th className="py-2.5 px-3 font-medium font-mono">Certificate Hash</th>
                <th className="py-2.5 px-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {esgCredentials.map((cred) => (
                <tr key={cred.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3 font-sans font-medium text-slate-200">
                    <div>{cred.businessName}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">#{cred.companyNumber}</div>
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-400 font-semibold tabular-nums">
                    £{cred.totalSolidarityPledgedGBP.toLocaleString('en-GB')}
                  </td>
                  <td className="py-3 px-3 text-right text-cyan-400 font-semibold tabular-nums">
                    {cred.socialValueScore.toFixed(1)} / 100
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-300">
                    <span className="text-[11px] text-slate-200 font-medium">
                      {cred.procurementTier.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[11px] text-slate-500">
                    {cred.certificateHash.substring(0, 12)}...
                  </td>
                  <td className="py-3 px-3 text-right font-sans">
                    <button
                      onClick={() => setSelectedCert(cred)}
                      className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors inline-flex items-center gap-1"
                    >
                      <FileCheck className="w-3 h-3 text-emerald-400" />
                      <span>View Proof</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Certificate Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl relative space-y-5">
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pb-4 border-b border-slate-800">
              <Award className="w-10 h-10 text-amber-400 mx-auto mb-2" />
              <h3 className="text-base font-bold text-white">Social Value Statutory Certificate</h3>
              <div className="text-xs text-slate-400 font-mono mt-1">
                Public Services (Social Value) Act 2012 Compliance Dossier
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Accredited Entity</span>
                <span className="font-semibold text-white">{selectedCert.businessName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60 font-mono">
                <span className="text-slate-400">Companies House No.</span>
                <span className="text-slate-200">{selectedCert.companyNumber}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60 font-mono">
                <span className="text-slate-400">Total Capital Dedicated</span>
                <span className="text-emerald-400 font-semibold tabular-nums">
                  £{selectedCert.totalSolidarityPledgedGBP.toLocaleString('en-GB')}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60 font-mono">
                <span className="text-slate-400">Social Value Score</span>
                <span className="text-cyan-400 font-semibold tabular-nums">{selectedCert.socialValueScore.toFixed(1)} / 100</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Statutory Basis</span>
                <span className="text-slate-300 text-right">{selectedCert.statutoryBasis}</span>
              </div>
              <div className="py-2">
                <span className="text-slate-400 block mb-1">Cryptographic Hash Root</span>
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-[11px] text-cyan-300 break-all">
                  {selectedCert.certificateHash}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono">Valid: {selectedCert.issuedDate} &rarr; {selectedCert.expiryDate}</span>
              <button
                onClick={() => setSelectedCert(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
