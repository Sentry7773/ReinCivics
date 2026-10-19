// src/components/TopHeader.tsx
import React from 'react';
import { NavTab } from './Sidebar';
import { Menu, ShieldCheck, Scale, Cpu } from 'lucide-react';

interface TopHeaderProps {
  currentTab: NavTab;
  onOpenMobile: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ currentTab, onOpenMobile }) => {
  const tabTitles: Record<NavTab, { title: string; subtitle: string }> = {
    overview: {
      title: 'Executive Summary & Invariants',
      subtitle: 'REIN Dynamic Systems · v7.0 Enterprise Architecture',
    },
    'commitment-pools': {
      title: 'Community Credit & Commitment Pools (Sarafu-Compatible)',
      subtitle: 'From Underbanked to Understood · Institutional Bank & Funder Interface',
    },
    'phase-deliverables': {
      title: '40-Phase Deliverables & Artifacts',
      subtitle: 'Complete Phase 00 through Phase 39 Deliverable Pipeline',
    },
    workflow: {
      title: '146-Gate Master Workflow',
      subtitle: 'Grounded Statutory & Actuarial Audit Matrix',
    },
    'living-treasury': {
      title: 'Living Treasury AI & A-IPS Fiduciary Engine',
      subtitle: 'Autonomous Reserve Optimization & 70/30 Yield Sweeps',
    },
    'run-protection': {
      title: 'Run Protection Architecture',
      subtitle: 'Four-Tier Circuit Breakers & Multi-Sig Ceremony',
    },
    solidarity: {
      title: 'Solidarity Fund & ESG "S" Credentialing',
      subtitle: '60/40 Split Enforced & Procurement Act 2023 Proofs',
    },
    'council-portal': {
      title: 'Council B2G Portal & TER Planning',
      subtitle: 'Preston Model Civic Wealth & Statutory Social Value',
    },
    'spatial-resilience': {
      title: 'Spatial Resilience & Critical Infrastructure Map',
      subtitle: 'Leaflet GIS Proximity Analysis & Council Planning Intelligence',
    },
    wallet: {
      title: 'Citizen Member Wallet & Swap',
      subtitle: '1:1 Fiat Safeguarded Commons & Municipal Live Exchange',
    },
    pos: {
      title: 'Merchant POS & Tax Rails',
      subtitle: 'HMRC Notice 700/8 Barter VAT Automated Splitter',
    },
    'defense-pack': {
      title: 'Statutory Legal Corpus & Defense Packs',
      subtitle: '16 Constitutional Instruments & Court Defense Bundles',
    },
  };

  const current = tabTitles[currentTab] || { title: 'CivicTrust', subtitle: 'Platform Module' };

  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur border-b border-slate-800/80 px-6 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile trigger & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobile}
            className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Open sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span>CivicTrust B2G</span>
              <span aria-hidden="true">/</span>
              <span className="text-emerald-400 font-semibold">{current.title}</span>
            </div>
            <div className="text-xs text-slate-300 font-medium mt-0.5 hidden sm:block">
              {current.subtitle}
            </div>
          </div>
        </div>

        {/* Right: Real-time Institutional Indicators */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pool: £4.86M Fiat</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
            <Scale className="w-3.5 h-3.5 text-cyan-400" />
            <span>TER: 0.942 Parity</span>
          </div>

          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-teal-400" />
            <span>RegScan: 94.2%</span>
          </div>
        </div>
      </div>
    </header>
  );
};
