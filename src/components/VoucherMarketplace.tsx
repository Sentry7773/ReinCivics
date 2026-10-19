// src/components/VoucherMarketplace.tsx
import React, { useState } from 'react';
import { useCivicTrust } from '../context/CivicTrustContext';
import {
  Layers,
  ArrowRightLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Coins,
  Split,
  FileCheck2,
  Shield,
  Clock,
  TrendingUp,
  Tag,
  Leaf,
  Trees,
  Check,
  Filter,
} from 'lucide-react';

interface BundleComponent {
  name: string;
  sector: string;
  quantity: string;
  faceValueGBP: number;
}

interface ComposableBundle {
  id: string;
  bundleCode: string;
  name: string;
  description: string;
  category: 'ESSENTIALS' | 'ENERGY_CARE' | 'FOOD_SECURITY' | 'REPAIR_LABOUR';
  discountPct: number;
  totalFaceGBP: number;
  bundlePriceGBP: number;
  components: BundleComponent[];
  redemptionsLeft: number;
}

interface SwapOrder {
  id: string;
  orderCode: string;
  creatorName: string;
  side: 'GIVE' | 'WANT';
  offerDescription: string;
  wantDescription: string;
  impliedRatio: string;
  validUntil: string;
  status: 'OPEN' | 'MATCHED' | 'SETTLED';
}

interface SecondaryListing {
  id: string;
  listingCode: string;
  sellerName: string;
  assetClass: string;
  quantity: number;
  askPriceGBP: number;
  faceValueGBP: number;
  kycTierRequired: 'TIER_1_STANDARD' | 'TIER_2_ENHANCED';
}

const INITIAL_BUNDLES: ComposableBundle[] = [
  {
    id: 'bnd-01',
    bundleCode: 'BND-ESSENTIALS-01',
    name: 'Somers Town Weekly Family Sustenance Pack',
    description: 'Fresh organic pantry staples from Community Kitchen paired with 4 hours of eldercare respite & bike repair.',
    category: 'ESSENTIALS',
    discountPct: 0.12,
    totalFaceGBP: 120.0,
    bundlePriceGBP: 105.6,
    redemptionsLeft: 24,
    components: [
      { name: 'Organic Sourdough & Market Veg Basket', sector: 'FOOD', quantity: '12 kg', faceValueGBP: 45.0 },
      { name: 'Mutual Eldercare & Convalescence Hours', sector: 'CARE', quantity: '4 hours', faceValueGBP: 50.0 },
      { name: 'Bicycle Fleet Safety Tune-Up', sector: 'LABOUR', quantity: '1 tune-up', faceValueGBP: 25.0 },
    ],
  },
  {
    id: 'bnd-02',
    bundleCode: 'BND-ECO-MICROGRID-02',
    name: 'Clean Microgrid & Zero-Waste Retrofit Bundle',
    description: '100 kWh islanded community solar power allocation coupled with 5 kg compost and thermal draft-proofing.',
    category: 'ENERGY_CARE',
    discountPct: 0.15,
    totalFaceGBP: 180.0,
    bundlePriceGBP: 153.0,
    redemptionsLeft: 18,
    components: [
      { name: 'Community Solar Rooftop Microgrid Power', sector: 'ENERGY', quantity: '100 kWh', faceValueGBP: 85.0 },
      { name: 'Home Heat Retention & Draught Seal Kit', sector: 'HOUSING', quantity: '1 kit + install', faceValueGBP: 65.0 },
      { name: 'Urban Tree Nursery Soil Amendment Compost', sector: 'BIODIVERSITY', quantity: '30 kg', faceValueGBP: 30.0 },
    ],
  },
  {
    id: 'bnd-03',
    bundleCode: 'BND-YOUTH-SKILLS-03',
    name: 'Makerspace Fabrication & Apprentice Tooling Guild',
    description: '15 workshop access hours + circular wood repair materials + local organic catering lunch vouchers.',
    category: 'REPAIR_LABOUR',
    discountPct: 0.10,
    totalFaceGBP: 95.0,
    bundlePriceGBP: 85.5,
    redemptionsLeft: 30,
    components: [
      { name: 'CNC & Joinery Community Guild Workshop Time', sector: 'LABOUR', quantity: '15 hours', faceValueGBP: 60.0 },
      { name: 'Circular Reclaimed Timber Material Pack', sector: 'HOUSING', quantity: '1 bundle', faceValueGBP: 20.0 },
      { name: 'Community Kitchen Hot Lunch Vouchers', sector: 'FOOD', quantity: '3 meals', faceValueGBP: 15.0 },
    ],
  },
];

const INITIAL_SWAP_ORDERS: SwapOrder[] = [
  {
    id: 'swp-01',
    orderCode: 'SWP-8841-A',
    creatorName: 'Amara K. (Somers Town Garden)',
    side: 'GIVE',
    offerDescription: '50 kg Organic Root Crops & Fresh Squash',
    wantDescription: '8 Hours Electrical / Microgrid Wiring Assistance',
    impliedRatio: '6.25 kg / hour',
    validUntil: '2026-11-15',
    status: 'OPEN',
  },
  {
    id: 'swp-02',
    orderCode: 'SWP-3190-B',
    creatorName: 'Tomas R. (Makers Guild)',
    side: 'WANT',
    offerDescription: '12 Hours Carpentry & Window Frame Repair',
    wantDescription: '60 Litres Cold-Pressed Cooking Oil & Fresh Bread',
    impliedRatio: '1 hour / 5 Litres',
    validUntil: '2026-11-20',
    status: 'OPEN',
  },
  {
    id: 'swp-03',
    orderCode: 'SWP-7729-C',
    creatorName: 'Priya M. (Community Care Collective)',
    side: 'GIVE',
    offerDescription: '10 Hours Post-Discharge Convalescence Support',
    wantDescription: '120 kWh Clean Solar Heat Dispatch',
    impliedRatio: '1 hour / 12 kWh',
    validUntil: '2026-11-28',
    status: 'OPEN',
  },
];

const INITIAL_SECONDARY_LISTINGS: SecondaryListing[] = [
  {
    id: 'sec-01',
    listingCode: 'LST-ENERGY-902',
    sellerName: 'North London Solar Microgrid Co-op',
    assetClass: 'ENERGY (Solar kWh)',
    quantity: 500,
    askPriceGBP: 72.50,
    faceValueGBP: 85.00,
    kycTierRequired: 'TIER_1_STANDARD',
  },
  {
    id: 'sec-02',
    listingCode: 'LST-FOOD-411',
    sellerName: 'Somers Town Garden CIC',
    assetClass: 'FOOD (Seasonal Yield)',
    quantity: 120,
    askPriceGBP: 180.00,
    faceValueGBP: 210.00,
    kycTierRequired: 'TIER_1_STANDARD',
  },
  {
    id: 'sec-03',
    listingCode: 'LST-BNG-108',
    sellerName: 'Camley Street Habitat Trust',
    assetClass: 'BIODIVERSITY (UK BNG Units)',
    quantity: 2.5,
    askPriceGBP: 12500.00,
    faceValueGBP: 14000.00,
    kycTierRequired: 'TIER_2_ENHANCED',
  },
];

export const VoucherMarketplace: React.FC = () => {
  const { citizenAccount } = useCivicTrust();

  const [activeSubTab, setActiveSubTab] = useState<'bundles' | 'swaps' | 'secondary' | 'fractional' | 'insurance' | 'attribution'>('bundles');
  const [bundles, setBundles] = useState<ComposableBundle[]>(INITIAL_BUNDLES);
  const [swaps, setSwaps] = useState<SwapOrder[]>(INITIAL_SWAP_ORDERS);
  const [listings, setListings] = useState<SecondaryListing[]>(INITIAL_SECONDARY_LISTINGS);
  const [feedbackMsg, setFeedbackMsg] = useState<{ title: string; desc: string; type: 'success' | 'info' } | null>(null);

  // New Swap Modal
  const [showNewSwapModal, setShowNewSwapModal] = useState(false);
  const [newSwapSide, setNewSwapSide] = useState<'GIVE' | 'WANT'>('GIVE');
  const [newSwapOffer, setNewSwapOffer] = useState('');
  const [newSwapWant, setNewSwapWant] = useState('');

  // Fractionalize demo state
  const [fractionPledgeAmount, setFractionPledgeAmount] = useState(500);
  const [fractionSlices, setFractionSlices] = useState(50);

  // Insurance demo state
  const [insuredPledgeType, setInsuredPledgeType] = useState('FOOD_HARVEST');
  const [insuranceCoverGBP, setInsuranceCoverGBP] = useState(1500);
  const [policyType, setPolicyType] = useState<'PARAMETRIC' | 'INDEMNITY'>('PARAMETRIC');

  const handleBuyBundle = (bundle: ComposableBundle) => {
    if (citizenAccount.commonsBalance < bundle.bundlePriceGBP) {
      setFeedbackMsg({
        title: 'Insufficient COMMONS Balance',
        desc: `You need £${bundle.bundlePriceGBP.toFixed(2)} COMMONS. Available: £${citizenAccount.commonsBalance.toFixed(2)} COMMONS.`,
        type: 'info',
      });
      return;
    }

    setBundles((prev) =>
      prev.map((b) => (b.id === bundle.id ? { ...b, redemptionsLeft: Math.max(0, b.redemptionsLeft - 1) } : b))
    );

    setFeedbackMsg({
      title: 'Bundle Purchased Successfully',
      desc: `Acquired "${bundle.name}" for £${bundle.bundlePriceGBP.toFixed(2)} COMMONS (Saved £${(bundle.totalFaceGBP - bundle.bundlePriceGBP).toFixed(2)}).`,
      type: 'success',
    });
    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  const handleCreateSwap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSwapOffer || !newSwapWant) return;

    const newOrder: SwapOrder = {
      id: `swp-${Date.now()}`,
      orderCode: `SWP-${Math.floor(1000 + Math.random() * 9000)}-D`,
      creatorName: 'Amara K. (You)',
      side: newSwapSide,
      offerDescription: newSwapOffer,
      wantDescription: newSwapWant,
      impliedRatio: 'Negotiated Parity',
      validUntil: '2026-12-01',
      status: 'OPEN',
    };

    setSwaps([newOrder, ...swaps]);
    setNewSwapOffer('');
    setNewSwapWant('');
    setShowNewSwapModal(false);
    setFeedbackMsg({
      title: 'Swap Order Broadcasted',
      desc: `Order ${newOrder.orderCode} posted to the community peer orderbook. Matching engine active.`,
      type: 'success',
    });
    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  const handleBuyListing = (listing: SecondaryListing) => {
    setListings((prev) => prev.filter((l) => l.id !== listing.id));
    setFeedbackMsg({
      title: 'Secondary Trade Executed',
      desc: `Bought ${listing.quantity} units of ${listing.assetClass} from ${listing.sellerName} for £${listing.askPriceGBP.toLocaleString()} COMMONS. Compliance check passed.`,
      type: 'success',
    });
    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  return (
    <div className="space-y-7">
      {/* Hero Header */}
      <div className="border border-emerald-800/80 bg-gradient-to-r from-slate-950 via-emerald-950/40 to-slate-900 rounded-2xl p-6 lg:p-7 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-emerald-900/50">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <Coins className="w-4 h-4 text-emerald-400" />
              <span>Phases 4–5 &middot; Tier 3 Advanced Voucher Capabilities (18–27)</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>Voucher Composability, Swap &amp; Secondary Marketplace</span>
            </h1>
            <p className="text-xs text-slate-300 max-w-3xl mt-1 leading-relaxed">
              Decentralized voucher composability bundles, peer-to-peer barter swap orderbook, micro-fractionalization, parametric insurance underwriting, and BNG/carbon retirement rails.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="p-3 bg-slate-950/90 border border-emerald-800/80 rounded-xl text-right font-mono">
              <span className="text-[10px] text-slate-400 block">Your COMMONS Balance</span>
              <span className="text-xl font-bold text-emerald-400 tabular-nums">
                £{citizenAccount.commonsBalance.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'bundles', label: '18. Composable Bundles', count: bundles.length },
            { id: 'swaps', label: '20. Barter Swap Market', count: swaps.length },
            { id: 'secondary', label: '26. Secondary Market', count: listings.length },
            { id: 'fractional', label: '19. Fractionalization', count: 'Active' },
            { id: 'insurance', label: '21. Voucher Insurance', count: 'FCA Reg' },
            { id: 'attribution', label: '22–23. Carbon & BNG', count: 'Verified' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl font-mono text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span className="px-1.5 py-0.2 rounded bg-black/40 text-[10px] text-emerald-300">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Feedback banner */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-700 text-emerald-200'
              : 'bg-amber-950/80 border-amber-700 text-amber-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <div>
              <strong className="block font-semibold">{feedbackMsg.title}</strong>
              <span>{feedbackMsg.desc}</span>
            </div>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* 1. COMPOSABLE BUNDLES (Capability 18) */}
      {activeSubTab === 'bundles' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Curated Multi-Sector Commitment Bundles</span>
              </h2>
              <p className="text-xs text-slate-400">
                Bundles assemble complementary vouchers across food, energy, care, and skills with built-in discount pricing.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-800">
              Capability 18 &middot; 100% Deployed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {bundles.map((bundle) => (
              <div
                key={bundle.id}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 hover:border-emerald-700/60 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                      {bundle.bundleCode}
                    </span>
                    <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      Save {(bundle.discountPct * 100).toFixed(0)}%
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">{bundle.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{bundle.description}</p>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block font-semibold">
                      Included Components ({bundle.components.length})
                    </span>
                    <div className="space-y-1.5">
                      {bundle.components.map((comp, i) => (
                        <div key={i} className="flex justify-between items-center text-xs">
                          <span className="text-slate-300 truncate max-w-[180px]">
                            &bull; {comp.name}
                          </span>
                          <span className="text-slate-400 font-mono text-[11px] shrink-0">
                            £{comp.faceValueGBP.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 line-through block font-mono">
                        Face: £{bundle.totalFaceGBP.toFixed(2)}
                      </span>
                      <span className="text-lg font-bold text-white font-mono">
                        £{bundle.bundlePriceGBP.toFixed(2)}{' '}
                        <span className="text-xs text-emerald-400 font-sans">COMMONS</span>
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {bundle.redemptionsLeft} packs left
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleBuyBundle(bundle)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>Purchase Composed Bundle</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. SWAP MARKETPLACE (Capability 20) */}
      {activeSubTab === 'swaps' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-cyan-400" />
                <span>Peer-to-Peer Voucher Barter &amp; Swap Orderbook</span>
              </h2>
              <p className="text-xs text-slate-400">
                Direct barter swap order matching with two-party confirmation and automated COMMONS clearing.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowNewSwapModal(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Post New Swap Order</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/70 shadow-xl">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Order Code</th>
                  <th className="py-3 px-4">Side</th>
                  <th className="py-3 px-4">Offering</th>
                  <th className="py-3 px-4">Requesting</th>
                  <th className="py-3 px-4 text-right">Implied Ratio</th>
                  <th className="py-3 px-4 text-right">Expires</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {swaps.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{order.orderCode}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          order.side === 'GIVE'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                        }`}
                      >
                        {order.side}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-200">{order.offerDescription}</td>
                    <td className="py-3 px-4 text-cyan-300">{order.wantDescription}</td>
                    <td className="py-3 px-4 text-right text-slate-300">{order.impliedRatio}</td>
                    <td className="py-3 px-4 text-right text-slate-400">{order.validUntil}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setFeedbackMsg({
                            title: 'Swap Matched & Proffered',
                            desc: `Matched against ${order.orderCode}. Confirmation sent to both parties for two-party cryptographic sign-off.`,
                            type: 'success',
                          });
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] cursor-pointer"
                      >
                        Accept Match
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. SECONDARY MARKET (Capability 26) */}
      {activeSubTab === 'secondary' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-400" />
                <span>Compliance-Gated Secondary Voucher Trading</span>
              </h2>
              <p className="text-xs text-slate-400">
                Trade verified vouchers with built-in daily KYC limit checks, PEP/sanctions screening, and automated tax reporting.
              </p>
            </div>
            <span className="text-xs font-mono text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-800">
              Capability 26 &middot; FCA Compliance Gated
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {listings.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 hover:border-teal-700/60 transition-all space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                    {item.listingCode}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                    {item.kycTierRequired}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">{item.assetClass}</h3>
                  <div className="text-xs text-slate-400 mt-0.5">Seller: {item.sellerName}</div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Quantity Offered:</span>
                    <span className="text-white font-bold">{item.quantity} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Face Value:</span>
                    <span className="text-slate-400 line-through">£{item.faceValueGBP.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ask Price:</span>
                    <span className="text-emerald-400 font-bold">£{item.askPriceGBP.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleBuyListing(item)}
                  className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Purchase from Secondary Market
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. FRACTIONALIZATION (Capability 19) */}
      {activeSubTab === 'fractional' && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Split className="w-4 h-4 text-cyan-400" />
                <span>Voucher Fractionalization Studio</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Subdivide high-value commitments into up to 10,000 liquid, transferrable micro-fractions.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-800">
              Capability 19 &middot; 100% Deployed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  Commitment Voucher Principal (£)
                </label>
                <input
                  type="number"
                  value={fractionPledgeAmount}
                  onChange={(e) => setFractionPledgeAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 text-sm font-mono"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">Number of Slices:</span>
                  <span className="text-cyan-400 font-bold">{fractionSlices} Micro-Fractions</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="500"
                  value={fractionSlices}
                  onChange={(e) => setFractionSlices(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Per-Fraction Face Value:</span>
                  <span className="text-emerald-400 font-bold">
                    £{(fractionPledgeAmount / fractionSlices).toFixed(2)} COMMONS
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Granularity:</span>
                  <span className="text-white font-bold">{(100 / fractionSlices).toFixed(2)}% of pledge</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setFeedbackMsg({
                    title: 'Fractional Tokens Minted',
                    desc: `Pledge split into ${fractionSlices} fractions at £${(fractionPledgeAmount / fractionSlices).toFixed(2)} each. Ready for peer distribution.`,
                    type: 'success',
                  });
                }}
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold font-mono cursor-pointer"
              >
                Execute Fractionalization
              </button>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
              <span className="text-xs font-bold text-white font-mono uppercase block">
                Statutory Protections for Fractionalization
              </span>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Under PRA SS1/23 and FSMA s.22, fractionalized vouchers retain 100% legal recourse to the underlying pledge vault. Holders can recombine fractions or redeem directly against merchant goods.
              </p>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>No synthetic dilution &middot; 1:1 backed by verified capacity</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Row-level locking during redemption transactions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. VOUCHER INSURANCE (Capability 21) */}
      {activeSubTab === 'insurance' && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Parametric &amp; Indemnity Voucher Insurance</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Protect mutual pledge pools against crop failure, extreme weather, and operational defaults via licensed underwriters.
              </p>
            </div>
            <span className="text-xs font-mono text-indigo-400 font-bold bg-indigo-950 px-2.5 py-1 rounded-lg border border-indigo-800">
              Capability 21 &middot; Parametric Rails
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-3">
              <span className="text-xs font-bold text-white font-mono block">1. Select Policy</span>
              <div className="space-y-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPolicyType('PARAMETRIC')}
                  className={`w-full p-2.5 rounded-lg text-left font-mono transition-colors ${
                    policyType === 'PARAMETRIC'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  <strong className="block">Parametric Weather Trigger</strong>
                  <span className="text-[10px]">Auto-pays if rainfall &lt; 20mm in 21 days</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPolicyType('INDEMNITY')}
                  className={`w-full p-2.5 rounded-lg text-left font-mono transition-colors ${
                    policyType === 'INDEMNITY'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  <strong className="block">Fulfilment Indemnity</strong>
                  <span className="text-[10px]">Covers supplier insolvency / default</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-3">
              <span className="text-xs font-bold text-white font-mono block">2. Coverage &amp; Premium</span>
              <div className="space-y-2 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">Coverage Limit:</span>
                  <input
                    type="number"
                    value={insuranceCoverGBP}
                    onChange={(e) => setInsuranceCoverGBP(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded p-2 text-xs mt-1"
                  />
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-slate-400">Rate (bps):</span>
                  <span className="text-white font-bold">150 bps (1.5%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Annual Premium:</span>
                  <span className="text-emerald-400 font-bold">£{(insuranceCoverGBP * 0.015).toFixed(2)} COMMONS</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 flex flex-col justify-between space-y-3">
              <div className="space-y-2 text-xs">
                <span className="text-xs font-bold text-white font-mono block">3. Underwriter Backing</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Policies underwritten by Lloyd's Syndicate partners and anchored to Met Office satellite telemetry.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFeedbackMsg({
                    title: 'Insurance Policy Bound',
                    desc: `Policy POL-${Date.now().toString(36).toUpperCase()} active for £${insuranceCoverGBP.toLocaleString()} coverage. Premium deducted.`,
                    type: 'success',
                  });
                }}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold font-mono cursor-pointer"
              >
                Bind Policy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. CARBON & BIODIVERSITY ATTRIBUTION (Capabilities 22 & 23) */}
      {activeSubTab === 'attribution' && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-400" />
                <span>Ecological Attribution &amp; Statutory BNG Units</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Every green pledge tracks carbon avoidance and Biodiversity Net Gain (BNG) Metric 4.0 units for council planning and ESG reporting.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-800">
              Capabilities 22–23 &middot; Verified
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                  <Trees className="w-4 h-4 text-emerald-400" />
                  <span>Biodiversity Net Gain (BNG) Units</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  METRIC 4.0
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 bg-slate-900 rounded-lg">
                  <span className="text-slate-400 text-[10px] block">Baseline Units</span>
                  <span className="text-base font-bold text-white">4.20 Units</span>
                </div>
                <div className="p-2 bg-slate-900 rounded-lg">
                  <span className="text-slate-400 text-[10px] block">Post-Restoration</span>
                  <span className="text-base font-bold text-emerald-400">7.65 Units</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-300 font-mono">
                Net Uplift: <strong className="text-emerald-400">+3.45 BNG Units (+82%)</strong> across 2.4 ha Camden bioswales.
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-cyan-400" />
                  <span>Carbon Avoidance &amp; Sequestration</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  IPCC 2006 TIER 2
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 bg-slate-900 rounded-lg">
                  <span className="text-slate-400 text-[10px] block">Verified CO2e</span>
                  <span className="text-base font-bold text-cyan-400">42.8 tCO2e</span>
                </div>
                <div className="p-2 bg-slate-900 rounded-lg">
                  <span className="text-slate-400 text-[10px] block">Registry Status</span>
                  <span className="text-base font-bold text-white">RETIRED (Community)</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-300 font-mono">
                Permanently retired for local social value; non-tradable to prevent greenwashing.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Swap Order Modal */}
      {showNewSwapModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Post Peer Swap Order</h3>
              <button onClick={() => setShowNewSwapModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateSwap} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Order Side</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewSwapSide('GIVE')}
                    className={`p-2 rounded-lg font-mono font-bold cursor-pointer ${
                      newSwapSide === 'GIVE' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    GIVE (I have capacity)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewSwapSide('WANT')}
                    className={`p-2 rounded-lg font-mono font-bold cursor-pointer ${
                      newSwapSide === 'WANT' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    WANT (I need services)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Offer Description &amp; Quantity</label>
                <input
                  type="text"
                  placeholder="e.g., 20 kg Organic Honey / 5 Hours Electrical"
                  value={newSwapOffer}
                  onChange={(e) => setNewSwapOffer(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2.5 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Desired Return &amp; Quantity</label>
                <input
                  type="text"
                  placeholder="e.g., 10 Hours Carpentry / 40 Litres Oil"
                  value={newSwapWant}
                  onChange={(e) => setNewSwapWant(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2.5 font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewSwapModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold cursor-pointer"
                >
                  Post Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
