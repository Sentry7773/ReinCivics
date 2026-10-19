// src/components/MerchantPOS.tsx
import React, { useState } from 'react';
import { useCivicTrust } from '../context/CivicTrustContext';
import {
  Store,
  Receipt,
  CheckCircle2,
  FileSpreadsheet,
  QrCode,
  Plus,
  Trash2,
  Printer,
  ShieldCheck,
} from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export const MerchantPOS: React.FC = () => {
  const { recordPOSTransaction } = useCivicTrust();

  const [cart, setCart] = useState<CartItem[]>([
    { id: 'item-1', name: 'Sourdough Country Loaf', price: 4.80, qty: 1 },
    { id: 'item-3', name: 'Cinnamon Cardamom Bun', price: 3.50, qty: 2 },
  ]);

  const [customItemName, setCustomItemName] = useState('');
  const [customItemPrice, setCustomItemPrice] = useState('');
  const [lastReceipt, setLastReceipt] = useState<{
    items: CartItem[];
    grossGBP: number;
    netGBP: number;
    vatGBP: number;
    hash: string;
    timestamp: string;
  } | null>(null);

  const inventoryQuickAdd = [
    { name: 'Sourdough Country Loaf', price: 4.80 },
    { name: 'Organic Rye Boule', price: 5.20 },
    { name: 'Cinnamon Cardamom Bun', price: 3.50 },
    { name: 'Artisan Espresso / Flat White', price: 3.20 },
    { name: 'Heritage Grain Pastry Box', price: 12.00 },
    { name: 'Catering Sandwich Platter', price: 28.00 },
  ];

  const addItemToCart = (name: string, price: number) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.name === name);
      if (existing) {
        return prev.map((i) => (i.name === name ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { id: `cart-${Date.now()}-${Math.random()}`, name, price, qty: 1 }];
    });
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setCart([]);

  const grossTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCheckout = () => {
    if (cart.length === 0 || grossTotal <= 0) return;

    const itemSummary = cart.map((i) => `${i.qty}x ${i.name}`).join(', ');
    const taxData = recordPOSTransaction(grossTotal, itemSummary);

    setLastReceipt({
      items: [...cart],
      grossGBP: grossTotal,
      netGBP: taxData.netGBP,
      vatGBP: taxData.vatGBP,
      hash: taxData.txHash,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    });

    clearCart();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Store className="w-5 h-5 text-emerald-400" />
            <span>Merchant POS & HMRC MTD Tax Rails</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Point-of-Sale terminal with automated barter 20% VAT separation conforming strictly to HMRC Notice 700/8.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Terminal:</span>
          <span className="text-emerald-400 font-semibold">Somers Town Cooperative Bakery</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400">#POS-CAMDEN-0482</span>
        </div>
      </div>

      {/* POS Grid: Menu Items vs Cart & VAT Receipt */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Quick Add Menu (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-5">
            <h2 className="text-sm font-bold text-white mb-3">Quick Inventory Items</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {inventoryQuickAdd.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => addItemToCart(item.name, item.price)}
                  className="p-3 bg-slate-950 border border-slate-800 hover:border-emerald-500/60 rounded-xl text-left transition-colors group flex flex-col justify-between"
                >
                  <span className="text-xs font-medium text-slate-200 group-hover:text-emerald-300">
                    {item.name}
                  </span>
                  <div className="mt-2 flex items-center justify-between font-mono">
                    <span className="text-xs font-bold text-emerald-400 tabular-nums">
                      £{item.price.toFixed(2)}
                    </span>
                    <Plus className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Item Entry */}
          <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-5">
            <h3 className="text-xs font-bold text-white mb-2">Manual Custom Charge</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={customItemName}
                onChange={(e) => setCustomItemName(e.target.value)}
                placeholder="Item description"
                className="sm:col-span-2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  value={customItemPrice}
                  onChange={(e) => setCustomItemPrice(e.target.value)}
                  placeholder="£ Price"
                  min="0.10"
                  step="0.01"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  onClick={() => {
                    const p = parseFloat(customItemPrice);
                    if (customItemName.trim() && !isNaN(p) && p > 0) {
                      addItemToCart(customItemName.trim(), p);
                      setCustomItemName('');
                      setCustomItemPrice('');
                    }
                  }}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Cart, VAT Split & Checkout (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="font-bold text-white text-sm">Customer Order</span>
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-[11px] text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Items List */}
              <div className="divide-y divide-slate-800/60 my-3 max-h-56 overflow-y-auto pr-1 text-xs">
                {cart.length === 0 ? (
                  <div className="py-6 text-center text-slate-500">
                    No items in cart. Tap items on the left to add.
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-slate-200 font-medium">{item.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {item.qty} &times; £{item.price.toFixed(2)}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-semibold text-slate-100 tabular-nums">
                          £{(item.price * item.qty).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* HMRC VAT Split Breakdown */}
            <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400 font-mono">
                <span>Net Consideration (GBP):</span>
                <span className="tabular-nums">£{(grossTotal / 1.2).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400 font-mono">
                <span>Standard VAT (20% HMRC):</span>
                <span className="tabular-nums">£{(grossTotal - grossTotal / 1.2).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800/80 font-mono">
                <span>Gross Total (£ Local):</span>
                <span className="text-emerald-400 tabular-nums">£{grossTotal.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className={`w-full mt-3 py-3 rounded-lg text-xs font-bold transition-colors ${
                  cart.length > 0
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                Accept Local Commons Payment
              </button>

              <div className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1 mt-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Zero Interchange Fee · Saves merchant 2.5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generated HMRC MTD Receipt */}
      {lastReceipt && (
        <div className="border border-emerald-800/70 bg-emerald-950/20 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-800/50">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="font-bold text-white text-sm">Payment Confirmed & MTD Receipt Generated</h3>
                <div className="text-xs text-slate-400 font-mono">{lastReceipt.timestamp}</div>
              </div>
            </div>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3 bg-slate-950/80 rounded border border-slate-800">
              <span className="text-slate-500 block text-[11px]">Gross Consideration</span>
              <span className="text-lg font-bold text-emerald-400 tabular-nums">£{lastReceipt.grossGBP.toFixed(2)}</span>
              <span className="text-slate-400 block text-[10px] mt-0.5">Transferred in Local Credits</span>
            </div>
            <div className="p-3 bg-slate-950/80 rounded border border-slate-800">
              <span className="text-slate-500 block text-[11px]">HMRC VAT Recorded (20%)</span>
              <span className="text-lg font-bold text-cyan-400 tabular-nums">£{lastReceipt.vatGBP.toFixed(2)}</span>
              <span className="text-slate-400 block text-[10px] mt-0.5">Notice 700/8 Compliant</span>
            </div>
            <div className="p-3 bg-slate-950/80 rounded border border-slate-800">
              <span className="text-slate-500 block text-[11px]">Making Tax Digital Root</span>
              <span className="text-[11px] text-slate-300 break-all">{lastReceipt.hash.substring(0, 24)}...</span>
              <span className="text-slate-400 block text-[10px] mt-0.5">Anchored in immudb ledger</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
