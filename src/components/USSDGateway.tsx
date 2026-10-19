// src/components/USSDGateway.tsx
import React, { useState } from 'react';
import { useCivicTrust } from '../context/CivicTrustContext';
import {
  Smartphone,
  PhoneCall,
  RotateCcw,
  ShieldCheck,
  Send,
  LifeBuoy,
  CheckCircle2,
  HelpCircle,
  Hash,
} from 'lucide-react';

export const USSDGateway: React.FC = () => {
  const { citizenAccount } = useCivicTrust();

  const [inputBuffer, setInputBuffer] = useState('*123#');
  const [screenText, setScreenText] = useState(
    'CivicTrust USSD Terminal Ready.\nDial *123# to initiate secure offline session.'
  );
  const [sessionActive, setSessionActive] = useState(false);
  const [stage, setStage] = useState<'IDLE' | 'MENU' | 'SEND_PHONE' | 'SEND_AMOUNT' | 'CONVERT_AMOUNT'>('IDLE');
  const [sendTargetPhone, setSendTargetPhone] = useState('');
  const [sessionLog, setSessionLog] = useState<string[]>([
    '[SYSTEM] USSD Telecom Gateway v2.4 initialized on port 7000.',
    '[TELECOM] Compatible with Twilio, Africa’s Talking, and UK GSM Aggregators.',
  ]);

  const addLog = (msg: string) => {
    setSessionLog((prev) => [
      `[${new Date().toISOString().slice(11, 19)}] ${msg}`,
      ...prev.slice(0, 8),
    ]);
  };

  const handleDial = () => {
    if (inputBuffer === '*123#') {
      setSessionActive(true);
      setStage('MENU');
      setScreenText(
        `CON Welcome ${citizenAccount.memberNumber}\n1. Balance Inquiry\n2. Send Commons\n3. Convert to RESERVE\n4. Recent Transactions\n5. Emergency Food/Care Help\n0. Exit`
      );
      addLog(`Session initiated: Dialed *123# for member ${citizenAccount.memberNumber}`);
    } else if (sessionActive) {
      handleMenuInput(inputBuffer);
    } else {
      setScreenText('END Invalid shortcode. Dial *123# to start.');
      addLog(`Rejected unknown shortcode: ${inputBuffer}`);
    }
    setInputBuffer('');
  };

  const handleMenuInput = (input: string) => {
    const trimmed = input.trim();

    if (stage === 'MENU') {
      if (trimmed === '1') {
        setScreenText(
          `END Balances for ${citizenAccount.memberNumber}:\nCOMMONS: £${citizenAccount.commonsBalance.toFixed(
            2
          )}\nRESERVE: £${citizenAccount.municipalCreditBalance.toFixed(
            2
          )}\n\nCommons decays 12%/year. Spend locally!`
        );
        setSessionActive(false);
        setStage('IDLE');
        addLog('Balance inquiry executed successfully.');
      } else if (trimmed === '2') {
        setStage('SEND_PHONE');
        setScreenText('CON Enter recipient phone number:\n(e.g., 07700900002)');
        addLog('Prompted for recipient phone.');
      } else if (trimmed === '3') {
        setStage('CONVERT_AMOUNT');
        setScreenText('CON Enter amount to convert to RESERVE (GBP):\n(1.5% exit fee applies)');
        addLog('Prompted for reserve conversion amount.');
      } else if (trimmed === '4') {
        setScreenText(
          `END Recent Transactions:\n1. 2026-10-16 PAYMENT £12.50\n2. 2026-10-15 VOUCHER_MINT £50.00\n3. 2026-10-14 SOLIDARITY £5.00\n\nAll transactions anchored.`
        );
        setSessionActive(false);
        setStage('IDLE');
        addLog('Recent transactions retrieved.');
      } else if (trimmed === '5') {
        setScreenText(
          'END Emergency Support:\nHelpline: 0800 098 7654\nSMS: HELP to 88200\nSomers Town Food Hub: 22 Phoenix Rd\nEssential services protected.'
        );
        setSessionActive(false);
        setStage('IDLE');
        addLog('Emergency hotline dispatched.');
      } else if (trimmed === '0') {
        setScreenText('END Thank you for using CivicTrust. Goodbye.');
        setSessionActive(false);
        setStage('IDLE');
        addLog('User terminated session.');
      } else {
        setScreenText('CON Invalid option.\n1. Balance\n2. Send Commons\n3. Convert\n4. Recent\n5. Emergency');
      }
    } else if (stage === 'SEND_PHONE') {
      setSendTargetPhone(trimmed);
      setStage('SEND_AMOUNT');
      setScreenText(`CON Send to: ${trimmed}\nEnter amount (GBP):`);
      addLog(`Recipient recorded: ${trimmed}`);
    } else if (stage === 'SEND_AMOUNT') {
      const amt = parseFloat(trimmed);
      if (isNaN(amt) || amt <= 0) {
        setScreenText('END Invalid amount. Session ended.');
        setSessionActive(false);
        setStage('IDLE');
      } else {
        setScreenText(
          `END Sent £${amt.toFixed(2)} COMMONS to ${sendTargetPhone}.\nNew balance: £${(
            citizenAccount.commonsBalance - amt
          ).toFixed(2)}\nRef: TX-${Date.now().toString(36).toUpperCase()}`
        );
        setSessionActive(false);
        setStage('IDLE');
        addLog(`Sent £${amt.toFixed(2)} COMMONS to ${sendTargetPhone}`);
      }
    } else if (stage === 'CONVERT_AMOUNT') {
      const amt = parseFloat(trimmed);
      if (isNaN(amt) || amt <= 0) {
        setScreenText('END Invalid amount. Session ended.');
        setSessionActive(false);
        setStage('IDLE');
      } else {
        const fee = amt * 0.015;
        const credited = amt - fee;
        setScreenText(
          `END Converted £${amt.toFixed(2)} to RESERVE.\nFee (1.5%): £${fee.toFixed(
            2
          )}\nCredited: £${credited.toFixed(2)}`
        );
        setSessionActive(false);
        setStage('IDLE');
        addLog(`Converted £${amt.toFixed(2)} to RESERVE. Fee: £${fee.toFixed(2)}`);
      }
    }
  };

  const handleKeypadPress = (val: string) => {
    setInputBuffer((prev) => prev + val);
  };

  const handleReset = () => {
    setInputBuffer('*123#');
    setScreenText('CivicTrust USSD Terminal Ready.\nDial *123# to initiate secure offline session.');
    setSessionActive(false);
    setStage('IDLE');
    addLog('Terminal reset to nominal.');
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-2xl p-6 lg:p-7 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Universal Digital Access &middot; GSM 2G / 3G / 4G Feature Phone Protocol</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>USSD Gateway (*123#) Offline Terminal</span>
            </h1>
            <p className="text-xs text-slate-300 max-w-3xl mt-1 leading-relaxed">
              Zero-data feature phone interface. Allows elderly citizens, refugees, and low-connectivity members to check balances, transfer COMMONS, convert to RESERVE, and request emergency hardship relief without smartphones or internet access.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-400">Gateway:</span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
              PORT 7000 ONLINE
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Standard Shortcode</span>
            <span className="text-emerald-400 font-bold text-base mt-0.5 block">*123#</span>
            <span className="text-[10px] text-slate-400">Zero data charge</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Latency SLA</span>
            <span className="text-cyan-400 font-bold text-base mt-0.5 block">&lt; 850ms</span>
            <span className="text-[10px] text-slate-400">Telecom aggregator link</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Security Architecture</span>
            <span className="text-white font-bold text-base mt-0.5 block">SIM-Binding</span>
            <span className="text-[10px] text-emerald-400">Encrypted HLR session</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Emergency Relief</span>
            <span className="text-amber-400 font-bold text-base mt-0.5 block">Priority 5</span>
            <span className="text-[10px] text-slate-400">Direct care triage</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Phone + Live Session Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Phone Chassis (5 cols) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-[320px] bg-slate-900 border-4 border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 ring-1 ring-slate-700">
            {/* Phone Speaker */}
            <div className="w-16 h-1.5 bg-slate-700 rounded-full mx-auto" />

            {/* Retro Backlit LCD Display */}
            <div className="bg-[#8fae85] border-2 border-[#6f8f65] rounded-xl p-3 min-h-[160px] text-[#0d2309] font-mono text-xs shadow-inner flex flex-col justify-between whitespace-pre-wrap select-none">
              <div>{screenText}</div>
              <div className="pt-2 border-t border-[#6f8f65]/40 flex justify-between text-[10px] font-bold">
                <span>{sessionActive ? 'SESSION: ACTIVE' : 'STANDBY'}</span>
                <span>{stage}</span>
              </div>
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700 rounded-xl p-2">
              <input
                type="text"
                value={inputBuffer}
                onChange={(e) => setInputBuffer(e.target.value)}
                placeholder="Type or click keypad..."
                className="bg-transparent text-emerald-400 font-mono text-xs w-full focus:outline-none px-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleDial();
                }}
              />
              <button
                type="button"
                onClick={handleDial}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold font-mono cursor-pointer"
              >
                Send
              </button>
            </div>

            {/* Keypad Grid (3x4) */}
            <div className="grid grid-cols-3 gap-2 text-white font-mono text-sm font-bold">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => handleKeypadPress(k)}
                  className="py-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-xl border border-slate-700 flex items-center justify-center transition-all cursor-pointer shadow"
                >
                  {k}
                </button>
              ))}
            </div>

            {/* Call Action & Reset */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleDial}
                className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-1.5 cursor-pointer shadow"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call / Send</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Technical Specs & Session Logs (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* USSD Telecom Protocol Spec */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>USSD Specification &amp; Emergency Architecture</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Unlike SMS, USSD establishes a session-oriented connection with the telecom carrier’s Home Location Register (HLR). Responses are rendered in real-time without storing sensitive financial balances on the device.
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-1">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">CON Header</span>
                <span className="text-white">Keeps GSM session open for subsequent numeric menu input.</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">END Header</span>
                <span className="text-white">Terminates session &amp; anchors ledger transition in PostgreSQL.</span>
              </div>
            </div>
          </div>

          {/* Live Session Telemetry Logs */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live USSD Gateway Telemetry</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">Redis Session Store</span>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1.5 max-h-56 overflow-y-auto">
              {sessionLog.map((log, idx) => (
                <div key={idx} className="leading-relaxed">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
