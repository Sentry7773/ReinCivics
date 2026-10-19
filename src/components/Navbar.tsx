// src/components/Navbar.tsx
import React from 'react';
import { useCivicTrust } from '../context/CivicTrustContext';
import { Shield, AlertTriangle } from 'lucide-react';

export type NavTab =
  | 'overview'
  | 'workflow'
  | 'living-treasury'
  | 'run-protection'
  | 'solidarity'
  | 'council-portal'
  | 'wallet'
  | 'pos'
  | 'defense-pack';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab }) => {
  const { systemStatus, setEmergencyLevel } = useCivicTrust();

  const navLinks: { id: NavTab; label: string }[] = [
    { id: 'overview', label: 'Executive Summary' },
    { id: 'workflow', label: '146-Gate Workflow' },
    { id: 'living-treasury', label: 'Living Treasury AI' },
    { id: 'run-protection', label: 'Run Protection' },
    { id: 'solidarity', label: 'Solidarity & ESG' },
    { id: 'council-portal', label: 'Council B2G' },
    { id: 'wallet', label: 'Citizen Wallet' },
    { id: 'pos', label: 'Merchant POS' },
    { id: 'defense-pack', label: 'Legal & Defense' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('overview')}
            className="flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
              CivicTrust / EcoVelocity
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (concise, single-line text links) */}
        <nav className="hidden xl:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onSelectTab(link.id)}
                className={`whitespace-nowrap transition-colors py-1 ${
                  isActive
                    ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action Indicator */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Mobile & Tablet Dropdown for Tab Navigation */}
          <div className="xl:hidden">
            <select
              value={currentTab}
              onChange={(e) => onSelectTab(e.target.value as NavTab)}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {navLinks.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              if (systemStatus === 'GREEN') setEmergencyLevel('AMBER');
              else if (systemStatus === 'AMBER') setEmergencyLevel('RED');
              else if (systemStatus === 'RED') setEmergencyLevel('CRITICAL');
              else setEmergencyLevel('GREEN');
            }}
            title="Click to cycle simulated emergency state"
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium rounded-lg border transition-colors whitespace-nowrap ${
              systemStatus === 'GREEN'
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/50'
                : systemStatus === 'AMBER'
                ? 'bg-amber-950/40 text-amber-300 border-amber-800/60 hover:bg-amber-900/50'
                : 'bg-rose-950/40 text-rose-300 border-rose-800/60 hover:bg-rose-900/50'
            }`}
          >
            {systemStatus === 'GREEN' ? (
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>Status: {systemStatus}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
