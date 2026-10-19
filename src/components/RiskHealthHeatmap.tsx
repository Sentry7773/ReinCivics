// src/components/RiskHealthHeatmap.tsx
import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  ShieldAlert,
  Activity,
  Sparkles,
  TrendingUp,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Scale,
  Zap,
  Info,
} from 'lucide-react';

interface RiskMetric {
  id: string;
  name: string;
  category: string;
  score: number; // 0 - 100, where 0 is zero risk and 100 is critical
  status: 'OPTIMAL' | 'NOMINAL' | 'ELEVATED' | 'CRITICAL';
  targetThreshold: string;
  currentMetric: string;
  gateRef: string;
  statute: string;
  mitigation: string;
}

type SimulationScenario = 'STEADY_STATE' | 'MUNICIPAL_SURGE' | 'EVT_TAIL_STRESS' | 'RUN_DEFENSE';

export const RiskHealthHeatmap: React.FC = () => {
  const [scenario, setScenario] = useState<SimulationScenario>('STEADY_STATE');
  const [selectedMetric, setSelectedMetric] = useState<RiskMetric | null>(null);
  const [liveTick, setLiveTick] = useState(0);

  // Dynamic risk scores based on selected scenario
  const riskMetrics: RiskMetric[] = useMemo(() => {
    switch (scenario) {
      case 'MUNICIPAL_SURGE':
        return [
          {
            id: 'risk-1',
            name: 'Liquidity & Redemption Stress',
            category: 'Solvency',
            score: 28,
            status: 'NOMINAL',
            targetThreshold: '< 30.0',
            currentMetric: 'LCR 284%',
            gateRef: 'RP35.1',
            statute: 'Trustee Act 2000 s.1',
            mitigation: 'Automated 70/30 Living Treasury sweep rebalancing engaged.',
          },
          {
            id: 'risk-2',
            name: 'Tail Disparity & Ward Gini',
            category: 'Fairness',
            score: 18,
            status: 'OPTIMAL',
            targetThreshold: 'TER <= 1.00',
            currentMetric: 'TER 0.938',
            gateRef: 'F12.1',
            statute: 'Equality Act 2010 s.149',
            mitigation: 'Anti-discrimination fairness engine recalibrated ward quotas.',
          },
          {
            id: 'risk-3',
            name: 'Actuarial Model Drift',
            category: 'Algorithmic',
            score: 22,
            status: 'OPTIMAL',
            targetThreshold: 'PSI < 0.10',
            currentMetric: 'PSI 0.042',
            gateRef: 'J33.1',
            statute: 'PRA SS1/23 Model Risk',
            mitigation: 'SHAP explainability tree weights refreshed with zero bias drift.',
          },
          {
            id: 'risk-4',
            name: 'Demurrage & Inflation Divergence',
            category: 'Monetary',
            score: 34,
            status: 'NOMINAL',
            targetThreshold: '< 40.0',
            currentMetric: '0.00% Net Drag',
            gateRef: 'R15.1',
            statute: 'Local Government Finance Act 1988',
            mitigation: 'Demurrage deflector active across 94% of active retail commons.',
          },
          {
            id: 'risk-5',
            name: 'Free-Rider & Extraction Leakage',
            category: 'Behavioral',
            score: 26,
            status: 'OPTIMAL',
            targetThreshold: '< 35.0',
            currentMetric: '0.12% Leakage',
            gateRef: 'S16.1',
            statute: 'BenCom Mutual Rules Rule 18',
            mitigation: '3-tier withdrawal cooldown buffers prevent external arbitrage.',
          },
          {
            id: 'risk-6',
            name: 'Multi-Sig Quorum Latency',
            category: 'Governance',
            score: 20,
            status: 'OPTIMAL',
            targetThreshold: '< 120s',
            currentMetric: '14.2s Avg Sign',
            gateRef: 'RP35.2',
            statute: 'BenCom Constitution Art 14',
            mitigation: '4 of 5 institutional cryptographic keys online in hardware enclaves.',
          },
          {
            id: 'risk-7',
            name: 'Hardship Absorption Capacity',
            category: 'Welfare',
            score: 15,
            status: 'OPTIMAL',
            targetThreshold: '> 30 Days Buffer',
            currentMetric: '42 Days Buffer',
            gateRef: 'F14.1',
            statute: 'Care Act 2014 & Social Value Act 2012',
            mitigation: '£300,000 instant shock absorber pool fully prefunded.',
          },
          {
            id: 'risk-8',
            name: 'Barter VAT MTD Reconciliation',
            category: 'Tax & Regulatory',
            score: 12,
            status: 'OPTIMAL',
            targetThreshold: '100% Match',
            currentMetric: '99.98% Segregated',
            gateRef: 'R23.2',
            statute: 'HMRC Notice 700/8',
            mitigation: 'Real-time 20% VAT escrow automatically routed to municipal vault.',
          },
          {
            id: 'risk-9',
            name: 'Jetson Edge Node Offline Desync',
            category: 'Hardware',
            score: 19,
            status: 'OPTIMAL',
            targetThreshold: '0 Packet Drops',
            currentMetric: '0.02ms Latency',
            gateRef: 'S27.1',
            statute: 'Civil Contingencies Act 2004',
            mitigation: 'Camden Borough local mesh maintains offline fallback state.',
          },
          {
            id: 'risk-10',
            name: 'Systemic Run Vulnerability',
            category: 'Macro Fiduciary',
            score: 24,
            status: 'OPTIMAL',
            targetThreshold: '< 25.0',
            currentMetric: '0.001% Tail Risk',
            gateRef: 'RP35.5',
            statute: 'Financial Services and Markets Act 2000',
            mitigation: 'Tier 1 Auto-Throttle primed to absorb unexpected withdrawal surges.',
          },
        ];

      case 'EVT_TAIL_STRESS':
        return [
          {
            id: 'risk-1',
            name: 'Liquidity & Redemption Stress',
            category: 'Solvency',
            score: 62,
            status: 'ELEVATED',
            targetThreshold: '< 30.0',
            currentMetric: 'LCR 192%',
            gateRef: 'RP35.1',
            statute: 'Trustee Act 2000 s.1',
            mitigation: 'Circuit Breaker Tier 2 Multi-Sig batching queued to protect capital.',
          },
          {
            id: 'risk-2',
            name: 'Tail Disparity & Ward Gini',
            category: 'Fairness',
            score: 42,
            status: 'NOMINAL',
            targetThreshold: 'TER <= 1.00',
            currentMetric: 'TER 0.982',
            gateRef: 'F12.1',
            statute: 'Equality Act 2010 s.149',
            mitigation: 'Priority hardship quota injected into Euston & Somers Town wards.',
          },
          {
            id: 'risk-3',
            name: 'Actuarial Model Drift',
            category: 'Algorithmic',
            score: 48,
            status: 'NOMINAL',
            targetThreshold: 'PSI < 0.10',
            currentMetric: 'PSI 0.089',
            gateRef: 'J33.1',
            statute: 'PRA SS1/23 Model Risk',
            mitigation: 'GEV Fréchet tail distribution bounds active on risk estimator.',
          },
          {
            id: 'risk-4',
            name: 'Demurrage & Inflation Divergence',
            category: 'Monetary',
            score: 38,
            status: 'NOMINAL',
            targetThreshold: '< 40.0',
            currentMetric: '0.00% Drag',
            gateRef: 'R15.1',
            statute: 'Local Government Finance Act 1988',
            mitigation: 'Deflector shield holding under heightened transaction volume.',
          },
          {
            id: 'risk-5',
            name: 'Free-Rider & Extraction Leakage',
            category: 'Behavioral',
            score: 54,
            status: 'ELEVATED',
            targetThreshold: '< 35.0',
            currentMetric: '1.45% Leakage Attempt',
            gateRef: 'S16.1',
            statute: 'BenCom Mutual Rules Rule 18',
            mitigation: 'Automated 1.5% non-member exit penalty triggered by contract.',
          },
          {
            id: 'risk-6',
            name: 'Multi-Sig Quorum Latency',
            category: 'Governance',
            score: 35,
            status: 'NOMINAL',
            targetThreshold: '< 120s',
            currentMetric: '42.8s Avg Sign',
            gateRef: 'RP35.2',
            statute: 'BenCom Constitution Art 14',
            mitigation: 'Emergency paging dispatched to Lead Actuary and Council Delegate.',
          },
          {
            id: 'risk-7',
            name: 'Hardship Absorption Capacity',
            category: 'Welfare',
            score: 58,
            status: 'ELEVATED',
            targetThreshold: '> 30 Days Buffer',
            currentMetric: '24 Days Buffer',
            gateRef: 'F14.1',
            statute: 'Care Act 2014 & Social Value Act 2012',
            mitigation: '70% Deep Reserve yield redirected to Shock Absorber replenishment.',
          },
          {
            id: 'risk-8',
            name: 'Barter VAT MTD Reconciliation',
            category: 'Tax & Regulatory',
            score: 18,
            status: 'OPTIMAL',
            targetThreshold: '100% Match',
            currentMetric: '99.95% Segregated',
            gateRef: 'R23.2',
            statute: 'HMRC Notice 700/8',
            mitigation: 'HMRC API verified escrow balances with zero tax leakage.',
          },
          {
            id: 'risk-9',
            name: 'Jetson Edge Node Offline Desync',
            category: 'Hardware',
            score: 25,
            status: 'NOMINAL',
            targetThreshold: '0 Packet Drops',
            currentMetric: '0.14ms Latency',
            gateRef: 'S27.1',
            statute: 'Civil Contingencies Act 2004',
            mitigation: 'Local cryptographic flash memory buffers all transaction signatures.',
          },
          {
            id: 'risk-10',
            name: 'Systemic Run Vulnerability',
            category: 'Macro Fiduciary',
            score: 61,
            status: 'ELEVATED',
            targetThreshold: '< 25.0',
            currentMetric: '1.84% Tail Stress',
            gateRef: 'RP35.5',
            statute: 'Financial Services and Markets Act 2000',
            mitigation: 'Circuit Breaker Tier 2 primed: 50% non-essential redemptions paused.',
          },
        ];

      case 'RUN_DEFENSE':
        return [
          {
            id: 'risk-1',
            name: 'Liquidity & Redemption Stress',
            category: 'Solvency',
            score: 78,
            status: 'CRITICAL',
            targetThreshold: '< 30.0',
            currentMetric: 'LCR 142%',
            gateRef: 'RP35.1',
            statute: 'Trustee Act 2000 s.1',
            mitigation: 'Tier 3 Systemic Cooldown engaged; 100% retail commons circulation preserved.',
          },
          {
            id: 'risk-2',
            name: 'Tail Disparity & Ward Gini',
            category: 'Fairness',
            score: 52,
            status: 'ELEVATED',
            targetThreshold: 'TER <= 1.00',
            currentMetric: 'TER 0.995',
            gateRef: 'F12.1',
            statute: 'Equality Act 2010 s.149',
            mitigation: 'Priority hardship queue strictly allocates food & medical claims first.',
          },
          {
            id: 'risk-3',
            name: 'Actuarial Model Drift',
            category: 'Algorithmic',
            score: 65,
            status: 'ELEVATED',
            targetThreshold: 'PSI < 0.10',
            currentMetric: 'PSI 0.114',
            gateRef: 'J33.1',
            statute: 'PRA SS1/23 Model Risk',
            mitigation: 'Conservative fallback parameters locked; autonomous drift halted.',
          },
          {
            id: 'risk-4',
            name: 'Demurrage & Inflation Divergence',
            category: 'Monetary',
            score: 45,
            status: 'NOMINAL',
            targetThreshold: '< 40.0',
            currentMetric: '0.00% Drag',
            gateRef: 'R15.1',
            statute: 'Local Government Finance Act 1988',
            mitigation: 'Deflector shield continues protecting citizen essentials.',
          },
          {
            id: 'risk-5',
            name: 'Free-Rider & Extraction Leakage',
            category: 'Behavioral',
            score: 72,
            status: 'CRITICAL',
            targetThreshold: '< 35.0',
            currentMetric: '3.80% Run Attempt',
            gateRef: 'S16.1',
            statute: 'BenCom Mutual Rules Rule 18',
            mitigation: 'Redemption gating fully activated; external arbitrage completely locked.',
          },
          {
            id: 'risk-6',
            name: 'Multi-Sig Quorum Latency',
            category: 'Governance',
            score: 55,
            status: 'ELEVATED',
            targetThreshold: '< 120s',
            currentMetric: '68.4s Avg Sign',
            gateRef: 'RP35.2',
            statute: 'BenCom Constitution Art 14',
            mitigation: 'Quorum established (3/5 signatures collected for Safe Haven allocation).',
          },
          {
            id: 'risk-7',
            name: 'Hardship Absorption Capacity',
            category: 'Welfare',
            score: 68,
            status: 'ELEVATED',
            targetThreshold: '> 30 Days Buffer',
            currentMetric: '18 Days Buffer',
            gateRef: 'F14.1',
            statute: 'Care Act 2014 & Social Value Act 2012',
            mitigation: 'Council statutory backstop guarantee triggered under Care Act s.1.',
          },
          {
            id: 'risk-8',
            name: 'Barter VAT MTD Reconciliation',
            category: 'Tax & Regulatory',
            score: 22,
            status: 'OPTIMAL',
            targetThreshold: '100% Match',
            currentMetric: '99.90% Segregated',
            gateRef: 'R23.2',
            statute: 'HMRC Notice 700/8',
            mitigation: 'MTD cryptographic tokens reconciled with Bank of England clearing node.',
          },
          {
            id: 'risk-9',
            name: 'Jetson Edge Node Offline Desync',
            category: 'Hardware',
            score: 30,
            status: 'NOMINAL',
            targetThreshold: '0 Packet Drops',
            currentMetric: '0.45ms Latency',
            gateRef: 'S27.1',
            statute: 'Civil Contingencies Act 2004',
            mitigation: 'Edge nodes functioning autonomously in isolated mesh offline mode.',
          },
          {
            id: 'risk-10',
            name: 'Systemic Run Vulnerability',
            category: 'Macro Fiduciary',
            score: 82,
            status: 'CRITICAL',
            targetThreshold: '< 25.0',
            currentMetric: '4.62% Bank Run Pressure',
            gateRef: 'RP35.5',
            statute: 'Financial Services and Markets Act 2000',
            mitigation: 'Tier 3 Systemic Cooldown + Tier 4 Emergency Reserve Drawdown armed.',
          },
        ];

      case 'STEADY_STATE':
      default:
        return [
          {
            id: 'risk-1',
            name: 'Liquidity & Redemption Stress',
            category: 'Solvency',
            score: 14,
            status: 'OPTIMAL',
            targetThreshold: '< 30.0',
            currentMetric: 'LCR 340%',
            gateRef: 'RP35.1',
            statute: 'Trustee Act 2000 s.1',
            mitigation: '£3.8M instant and same-day segregated fiat reserves.',
          },
          {
            id: 'risk-2',
            name: 'Tail Disparity & Ward Gini',
            category: 'Fairness',
            score: 12,
            status: 'OPTIMAL',
            targetThreshold: 'TER <= 1.00',
            currentMetric: 'TER 0.942',
            gateRef: 'F12.1',
            statute: 'Equality Act 2010 s.149',
            mitigation: 'Strict parity enforcement across all 5 municipal wards.',
          },
          {
            id: 'risk-3',
            name: 'Actuarial Model Drift',
            category: 'Algorithmic',
            score: 15,
            status: 'OPTIMAL',
            targetThreshold: 'PSI < 0.10',
            currentMetric: 'PSI 0.028',
            gateRef: 'J33.1',
            statute: 'PRA SS1/23 Model Risk',
            mitigation: 'Weekly validation against baseline covariance matrices.',
          },
          {
            id: 'risk-4',
            name: 'Demurrage & Inflation Divergence',
            category: 'Monetary',
            score: 18,
            status: 'OPTIMAL',
            targetThreshold: '< 40.0',
            currentMetric: '0.00% Drag',
            gateRef: 'R15.1',
            statute: 'Local Government Finance Act 1988',
            mitigation: 'Demurrage deflector active; 4 local transactions per month threshold met.',
          },
          {
            id: 'risk-5',
            name: 'Free-Rider & Extraction Leakage',
            category: 'Behavioral',
            score: 16,
            status: 'OPTIMAL',
            targetThreshold: '< 35.0',
            currentMetric: '0.04% Leakage',
            gateRef: 'S16.1',
            statute: 'BenCom Mutual Rules Rule 18',
            mitigation: 'Haircuts on unverified asset vault pledges enforced.',
          },
          {
            id: 'risk-6',
            name: 'Multi-Sig Quorum Latency',
            category: 'Governance',
            score: 10,
            status: 'OPTIMAL',
            targetThreshold: '< 120s',
            currentMetric: '8.4s Avg Sign',
            gateRef: 'RP35.2',
            statute: 'BenCom Constitution Art 14',
            mitigation: 'Hardware security modules active across all 5 signers.',
          },
          {
            id: 'risk-7',
            name: 'Hardship Absorption Capacity',
            category: 'Welfare',
            score: 9,
            status: 'OPTIMAL',
            targetThreshold: '> 30 Days Buffer',
            currentMetric: '52 Days Buffer',
            gateRef: 'F14.1',
            statute: 'Care Act 2014 & Social Value Act 2012',
            mitigation: 'Solidarity fund + weekly 30% yield sweep maintains surplus.',
          },
          {
            id: 'risk-8',
            name: 'Barter VAT MTD Reconciliation',
            category: 'Tax & Regulatory',
            score: 8,
            status: 'OPTIMAL',
            targetThreshold: '100% Match',
            currentMetric: '100.0% Matched',
            gateRef: 'R23.2',
            statute: 'HMRC Notice 700/8',
            mitigation: 'Automated VAT split generated at POS for every barter settlement.',
          },
          {
            id: 'risk-9',
            name: 'Jetson Edge Node Offline Desync',
            category: 'Hardware',
            score: 11,
            status: 'OPTIMAL',
            targetThreshold: '0 Packet Drops',
            currentMetric: '0.01ms Latency',
            gateRef: 'S27.1',
            statute: 'Civil Contingencies Act 2004',
            mitigation: 'All Camden nodes online with 100% peer mesh health.',
          },
          {
            id: 'risk-10',
            name: 'Systemic Run Vulnerability',
            category: 'Macro Fiduciary',
            score: 14,
            status: 'OPTIMAL',
            targetThreshold: '< 25.0',
            currentMetric: '0.000% Run Risk',
            gateRef: 'RP35.5',
            statute: 'Financial Services and Markets Act 2000',
            mitigation: '100% segregated fiat backing ensures systemic immunity.',
          },
        ];
    }
  }, [scenario, liveTick]);

  // Rolling 24-Hour Timeline Data for Recharts AreaChart
  const timelineData = useMemo(() => {
    const hours = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', 'Live'];

    return hours.map((hour, idx) => {
      let solvency = 100.0;
      let ter = 0.942;
      let velocity = 1.74;
      let stressIndex = 14;

      if (scenario === 'MUNICIPAL_SURGE') {
        solvency = 100.0;
        ter = 0.938 + Math.sin(idx) * 0.004;
        velocity = 1.88 + idx * 0.02;
        stressIndex = 22 + idx * 1.2;
      } else if (scenario === 'EVT_TAIL_STRESS') {
        solvency = 100.0 - (idx > 4 ? (idx - 4) * 0.4 : 0);
        ter = 0.95 + idx * 0.005;
        velocity = 1.62 - idx * 0.03;
        stressIndex = 32 + idx * 3.5;
      } else if (scenario === 'RUN_DEFENSE') {
        solvency = 100.0 - (idx > 3 ? (idx - 3) * 0.9 : 0);
        ter = 0.96 + idx * 0.006;
        velocity = 1.45 - idx * 0.04;
        stressIndex = 48 + idx * 4.2;
      } else {
        ter = 0.942 + Math.sin(idx * 0.8) * 0.003;
        velocity = 1.74 + Math.cos(idx * 0.8) * 0.02;
        stressIndex = 14 + Math.sin(idx) * 1.5;
      }

      return {
        time: hour,
        solvencyRatio: Math.round(solvency * 10) / 10,
        tailEquityRatio: Math.round(ter * 1000) / 1000,
        velocityMultiplier: Math.round(velocity * 100) / 100,
        riskStressIndex: Math.round(stressIndex),
      };
    });
  }, [scenario, liveTick]);

  // Tranche Liquidity Distribution for BarChart
  const trancheData = useMemo(() => {
    return [
      { name: 'T0 Instant', balance: 1300, riskScore: 12 },
      { name: 'T1 MMF', balance: 1200, riskScore: 18 },
      { name: 'T-Bill 3M', balance: 800, riskScore: 22 },
      { name: 'T-Bill 6M', balance: 600, riskScore: 25 },
      { name: 'Gilts 1-3Y', balance: 600, riskScore: 28 },
      { name: 'Hardship Shock', balance: 500, riskScore: 15 },
    ];
  }, []);

  const getHeatmapColor = (score: number, status: string) => {
    if (status === 'CRITICAL' || score >= 70) {
      return 'bg-rose-950/80 border-rose-800 text-rose-300 hover:bg-rose-900/60';
    }
    if (status === 'ELEVATED' || score >= 40) {
      return 'bg-amber-950/70 border-amber-800 text-amber-300 hover:bg-amber-900/50';
    }
    if (score >= 25) {
      return 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300 hover:bg-emerald-900/40';
    }
    return 'bg-slate-900/80 border-slate-800 text-emerald-400 hover:bg-slate-800/80';
  };

  const getScorePillColor = (score: number) => {
    if (score >= 70) return 'text-rose-400 bg-rose-950/80 border-rose-700';
    if (score >= 40) return 'text-amber-400 bg-amber-950/80 border-amber-700';
    return 'text-emerald-400 bg-emerald-950/80 border-emerald-700';
  };

  const handleSimulateTick = () => {
    setLiveTick((prev) => prev + 1);
  };

  return (
    <div className="border border-slate-800 bg-slate-900/50 rounded-2xl p-6 space-y-6">
      {/* Heatmap Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">System Risk Heatmap &amp; Real-Time Economic Telemetry</h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              PRA SS1/23 Grounded
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time matrix of 10 systemic risk vectors and economic health indicators under continuous actuarial surveillance.
          </p>
        </div>

        {/* Interactive Scenario Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setScenario('STEADY_STATE')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                scenario === 'STEADY_STATE'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Steady State
            </button>
            <button
              onClick={() => setScenario('MUNICIPAL_SURGE')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                scenario === 'MUNICIPAL_SURGE'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Municipal Surge
            </button>
            <button
              onClick={() => setScenario('EVT_TAIL_STRESS')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                scenario === 'EVT_TAIL_STRESS'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              EVT Tail Stress
            </button>
            <button
              onClick={() => setScenario('RUN_DEFENSE')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                scenario === 'RUN_DEFENSE'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Run Defense (RP35)
            </button>
          </div>

          <button
            onClick={handleSimulateTick}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
            title="Recalculate Real-Time Vectors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Simulate Tick</span>
          </button>
        </div>
      </div>

      {/* Heatmap Grid (10 Risk Vectors) */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
          <span className="font-semibold text-slate-300">10-Vector Statutory Risk Matrix (Click Cell to Inspect)</span>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500/80 inline-block" />
              Optimal (&lt; 25)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-amber-500/80 inline-block" />
              Elevated (40-69)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-rose-500/80 inline-block" />
              Critical (&ge; 70)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {riskMetrics.map((metric) => (
            <div
              key={metric.id}
              onClick={() => setSelectedMetric(metric)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${getHeatmapColor(
                metric.score,
                metric.status
              )}`}
            >
              <div>
                <div className="flex items-start justify-between gap-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    {metric.category}
                  </span>
                  <span
                    className={`text-[11px] font-mono font-bold px-1.5 py-0.2 rounded border ${getScorePillColor(
                      metric.score
                    )}`}
                  >
                    {metric.score}
                  </span>
                </div>
                <h4 className="font-semibold text-xs text-white mt-1.5 line-clamp-2 leading-tight">
                  {metric.name}
                </h4>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-300">{metric.currentMetric}</span>
                <span className="text-slate-400 text-[10px]">{metric.gateRef}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recharts Data Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        {/* Chart 1: 24-Hour Rolling Multi-Metric Timeline (Recharts AreaChart) */}
        <div className="lg:col-span-7 p-4 rounded-xl border border-slate-800/80 bg-slate-950/60 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Rolling Health Timeline: Solvency, Parity (TER) &amp; Velocity</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Live trajectory under active scenario: <span className="text-emerald-300 font-mono">{scenario}</span>
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-500">24H Window</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="solvencyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="stressGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[0, 105]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.5rem',
                    fontSize: '11px',
                  }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <ReferenceLine y={95} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Floor 95%', fill: '#f59e0b', fontSize: 10 }} />
                <Area
                  type="monotone"
                  dataKey="solvencyRatio"
                  name="Solvency Ratio (%)"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#solvencyGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="riskStressIndex"
                  name="Stress Index (0-100)"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#stressGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Tranche Liquidity Depth & Risk Absorption (Recharts BarChart) */}
        <div className="lg:col-span-5 p-4 rounded-xl border border-slate-800/80 bg-slate-950/60 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-cyan-400" />
                <span>Tranche Liquidity Allocation (£k)</span>
              </h3>
              <p className="text-[11px] text-slate-400">Segregated asset tiers under A-IPS mandate</p>
            </div>
            <span className="text-[11px] font-mono text-emerald-400">£5.0M Governed</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trancheData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 9 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.5rem',
                    fontSize: '11px',
                  }}
                  itemStyle={{ color: '#f8fafc' }}
                  formatter={(val: any) => [`£${val}k`, 'Capital Governed']}
                />
                <Bar dataKey="balance" name="Capital (£k)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Selected Metric Deep Dive Drawer / Modal */}
      {selectedMetric && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl relative space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-slate-400 uppercase">{selectedMetric.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-400">Gate {selectedMetric.gateRef}</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">{selectedMetric.name}</h3>
              </div>
              <span
                className={`text-xs font-mono font-bold px-2 py-1 rounded border ${getScorePillColor(
                  selectedMetric.score
                )}`}
              >
                Risk: {selectedMetric.score}/100
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-800 font-mono text-[11px]">
                <div>
                  <div className="text-slate-500">Current Reading</div>
                  <div className="text-white font-bold mt-0.5">{selectedMetric.currentMetric}</div>
                </div>
                <div>
                  <div className="text-slate-500">Target Threshold</div>
                  <div className="text-emerald-400 font-bold mt-0.5">{selectedMetric.targetThreshold}</div>
                </div>
              </div>

              <div>
                <div className="text-slate-400 font-semibold mb-1">Statutory Authority &amp; Mandate</div>
                <div className="text-slate-300 font-mono text-[11px]">{selectedMetric.statute}</div>
              </div>

              <div>
                <div className="text-slate-400 font-semibold mb-1">Automated Fiduciary Safeguard</div>
                <p className="text-slate-300 leading-relaxed font-sans">{selectedMetric.mitigation}</p>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                onClick={() => setSelectedMetric(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
