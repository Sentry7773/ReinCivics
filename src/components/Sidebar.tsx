// src/components/Sidebar.tsx
import React from 'react';
import { useCivicTrust } from '../context/CivicTrustContext';
import {
  Shield,
  Layers,
  Cpu,
  Landmark,
  ShieldCheck,
  HeartHandshake,
  Building2,
  Wallet,
  Store,
  Lock,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Coins,
  Compass,
} from 'lucide-react';

export type NavTab =
  | 'overview'
  | 'commitment-pools'
  | 'spatial-resilience'
  | 'phase-deliverables'
  | 'workflow'
  | 'living-treasury'
  | 'run-protection'
  | 'solidarity'
  | 'council-portal'
  | 'wallet'
  | 'pos'
  | 'defense-pack';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  mobileOpen,
  onCloseMobile,
}) => {
  const { systemStatus, setEmergencyLevel, generateAuditBundle, phases, gates } = useCivicTrust();

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'overview',
      label: 'Executive Summary',
      icon: <Layers className="w-4 h-4" />,
    },
    {
      id: 'commitment-pools',
      label: 'Community Credit & Pools',
      icon: <Coins className="w-4 h-4 text-emerald-400" />,
      badge: 'Sarafu / R18.1',
    },
    {
      id: 'phase-deliverables',
      label: '40-Phase Deliverables',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      badge: `${phases.length} Phases`,
    },
    {
      id: 'workflow',
      label: '146-Gate Workflow',
      icon: <Cpu className="w-4 h-4 text-teal-400" />,
      badge: `${gates.length}`,
    },
    {
      id: 'living-treasury',
      label: 'Living Treasury AI',
      icon: <Landmark className="w-4 h-4 text-emerald-400" />,
      badge: 'A-IPS',
    },
    {
      id: 'run-protection',
      label: 'Run Protection',
      icon: <ShieldCheck className="w-4 h-4 text-cyan-400" />,
      badge: 'Multi-Sig',
    },
    {
      id: 'solidarity',
      label: 'Solidarity & ESG',
      icon: <HeartHandshake className="w-4 h-4 text-amber-400" />,
      badge: '60/40',
    },
    {
      id: 'council-portal',
      label: 'Council B2G Portal',
      icon: <Building2 className="w-4 h-4 text-indigo-400" />,
      badge: 'TER',
    },
    {
      id: 'spatial-resilience',
      label: 'Spatial Resilience Map',
      icon: <Compass className="w-4 h-4 text-cyan-400" />,
      badge: 'GIS / Leaflet',
    },
    {
      id: 'wallet',
      label: 'Citizen Wallet & Swap',
      icon: <Wallet className="w-4 h-4 text-emerald-400" />,
      badge: 'Live Swap',
    },
    {
      id: 'pos',
      label: 'Merchant POS & MTD',
      icon: <Store className="w-4 h-4 text-slate-300" />,
      badge: 'HMRC 700/8',
    },
    {
      id: 'defense-pack',
      label: 'Legal Corpus & Defense',
      icon: <Lock className="w-4 h-4 text-emerald-400" />,
      badge: '16 Docs',
    },
  ];

  const handleDownloadQuickAudit = () => {
    const json = generateAuditBundle();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `civictrust-audit-bundle-${new Date().toISOString().substring(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-950 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top brand header */}
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-tight leading-tight">
                CivicTrust / EcoVelocity
              </div>
              <div className="text-[11px] font-mono text-emerald-400 mt-0.5">
                v7.0 Enterprise B2G Edition
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>OFFICIAL-SENSITIVE</span>
            <span>Francis Banda · REIN</span>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Platform Modules
          </div>

          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold border border-slate-800'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={
                      isActive
                        ? 'text-emerald-400'
                        : 'text-slate-500 group-hover:text-slate-300'
                    }
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                        : 'bg-slate-900 text-slate-500 border border-slate-800/60'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/80 space-y-3 bg-slate-950/90">
          {/* Emergency state cycler */}
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 flex items-center justify-between">
              <span>Sentinel Health</span>
              <span className="font-mono text-slate-400">AWS London</span>
            </div>
            <button
              onClick={() => {
                if (systemStatus === 'GREEN') setEmergencyLevel('AMBER');
                else if (systemStatus === 'AMBER') setEmergencyLevel('RED');
                else if (systemStatus === 'RED') setEmergencyLevel('CRITICAL');
                else setEmergencyLevel('GREEN');
              }}
              title="Click to cycle simulated emergency state"
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-mono font-medium transition-colors ${
                systemStatus === 'GREEN'
                  ? 'bg-emerald-950/30 text-emerald-300 border-emerald-800/50 hover:bg-emerald-900/40'
                  : systemStatus === 'AMBER'
                  ? 'bg-amber-950/30 text-amber-300 border-amber-800/50 hover:bg-amber-900/40'
                  : 'bg-rose-950/30 text-rose-300 border-rose-800/50 hover:bg-rose-900/40'
              }`}
            >
              <div className="flex items-center gap-2">
                {systemStatus === 'GREEN' ? (
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>Status: {systemStatus}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-sans">Cycle</span>
            </button>
          </div>

          {/* Quick download audit bundle */}
          <button
            onClick={handleDownloadQuickAudit}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Audit Dossier</span>
          </button>
        </div>
      </aside>
    </>
  );
};
