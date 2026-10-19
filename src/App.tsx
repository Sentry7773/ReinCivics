/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CivicTrustProvider } from './context/CivicTrustContext';
import { Sidebar, NavTab } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { ExecutiveOverview } from './components/ExecutiveOverview';
import { PhaseDeliverablesView } from './components/PhaseDeliverablesView';
import { GateWorkflowExplorer } from './components/GateWorkflowExplorer';
import { LivingTreasuryDashboard } from './components/LivingTreasuryDashboard';
import { RunProtectionConsole } from './components/RunProtectionConsole';
import { SolidarityAndESG } from './components/SolidarityAndESG';
import { CouncilB2GPortal } from './components/CouncilB2GPortal';
import { MemberWallet } from './components/MemberWallet';
import { MerchantPOS } from './components/MerchantPOS';
import { DefensePackHub } from './components/DefensePackHub';
import { CommunityCreditHub } from './components/CommunityCreditHub';
import { SpatialResilienceView } from './components/SpatialResilienceView';
import { QuickActionMenu } from './components/QuickActionMenu';

function MainApp() {
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Left-hand Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Workspace Area on the Right */}
      <div className="flex-1 lg:ml-72 min-h-screen flex flex-col justify-between overflow-x-hidden">
        <div>
          {/* Contextual Top Header */}
          <TopHeader
            currentTab={currentTab}
            onOpenMobile={() => setMobileOpen(true)}
          />

          {/* Module Content Viewport */}
          <main className="max-w-7xl mx-auto px-6 py-8">
            {currentTab === 'overview' && <ExecutiveOverview onNavigate={setCurrentTab} />}
            {currentTab === 'commitment-pools' && <CommunityCreditHub />}
            {currentTab === 'phase-deliverables' && <PhaseDeliverablesView />}
            {currentTab === 'workflow' && <GateWorkflowExplorer />}
            {currentTab === 'living-treasury' && <LivingTreasuryDashboard />}
            {currentTab === 'run-protection' && <RunProtectionConsole />}
            {currentTab === 'solidarity' && <SolidarityAndESG />}
            {currentTab === 'council-portal' && <CouncilB2GPortal onNavigate={setCurrentTab} />}
            {currentTab === 'spatial-resilience' && <SpatialResilienceView />}
            {currentTab === 'wallet' && <MemberWallet />}
            {currentTab === 'pos' && <MerchantPOS />}
            {currentTab === 'defense-pack' && <DefensePackHub />}
          </main>
        </div>

        {/* Quiet, institutional footer */}
        <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span>&copy; 2026 REIN Dynamic Systems</span>
              <span aria-hidden="true">&middot;</span>
              <span>Francis Banda, Founder &amp; CEO</span>
              <span aria-hidden="true">&middot;</span>
              <span className="text-slate-400">Classification: OFFICIAL-SENSITIVE</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span>FCA Mutuals Register #4829RS</span>
              <span aria-hidden="true">&middot;</span>
              <span>HMRC Notice 700/8 MTD</span>
              <span aria-hidden="true">&middot;</span>
              <span>PRA SS1/23 Model Risk</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Global Quick Action Floating Speed-Dial */}
      <QuickActionMenu />
    </div>
  );
}

export default function App() {
  return (
    <CivicTrustProvider>
      <MainApp />
    </CivicTrustProvider>
  );
}
