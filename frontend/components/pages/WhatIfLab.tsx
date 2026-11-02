import React, { useState, useMemo } from 'react';
import { 
  FlaskConical, 
  Sliders, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Droplets, 
  Zap, 
  Leaf, 
  AlertTriangle, 
  Sparkles, 
  RefreshCw, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';
import { PageId, SimulationParams, SimulationResult } from '../../types';

interface WhatIfLabProps {
  onNavigate: (page: PageId) => void;
}

export const WhatIfLab: React.FC<WhatIfLabProps> = ({ onNavigate }) => {
  const { currentPlant } = useTelemetry();

  const [params, setParams] = useState<SimulationParams>({
    leakRateLph: 350,
    responseDelayHours: 6,
    tariffInrPerM3: 85,
    productionState: 'Standard'
  });

  const result: SimulationResult = useMemo(() => {
    const totalWaterLossLiters = params.leakRateLph * params.responseDelayHours;
    const totalWaterLossM3 = totalWaterLossLiters / 1000;
    const directWaterCostInr = totalWaterLossM3 * params.tariffInrPerM3;
    const effluentPenaltyInr = directWaterCostInr * 0.45; // Effluent treatment surcharge
    const totalFinancialBleedInr = directWaterCostInr + effluentPenaltyInr;
    
    // Energy waste: ~0.45 kWh per m3 pumped & pressured
    const energyWastedKwh = totalWaterLossM3 * 0.45;
    // CO2 footprint: ~0.82 kg CO2 per kWh on Indian industrial grid
    const co2eKg = energyWastedKwh * 0.82;

    // AI automated intervention comparison (assume AI isolates in 0.1 hours / 6 mins)
    const aiMitigatedLossLiters = params.leakRateLph * 0.1;
    const aiMitigatedCostInr = (aiMitigatedLossLiters / 1000) * params.tariffInrPerM3 * 1.45;
    const baselineWaterLossLiters = totalWaterLossLiters;
    const baselineFinancialCostInr = totalFinancialBleedInr;

    let riskScore = Math.min(100, Math.round((totalWaterLossLiters / 5000) * 40 + (params.responseDelayHours / 12) * 60));
    let riskCategory: 'Low' | 'Moderate' | 'High' | 'Critical' = 'Low';
    if (riskScore > 75) riskCategory = 'Critical';
    else if (riskScore > 50) riskCategory = 'High';
    else if (riskScore > 25) riskCategory = 'Moderate';

    let aiInsight = '';
    if (params.responseDelayHours >= 8) {
      aiInsight = `🚨 Severe prolonged downtime detected. At ${params.responseDelayHours}h response time, loss exceeds ${(totalWaterLossM3).toFixed(1)} m³ causing secondary sub-surface soil saturation and pump cavitation risk.`;
    } else if (params.leakRateLph > 500) {
      aiInsight = `⚡ Catastrophic rupture scenario. Instant automated SCADA valve trip is mandatory to prevent factory ring main depressurization.`;
    } else {
      aiInsight = `💡 AquaRisk AI real-time acoustic edge detection reduces average isolation window from ${params.responseDelayHours}h to under 6 minutes, saving ₹${Math.round(baselineFinancialCostInr - aiMitigatedCostInr).toLocaleString()} per event.`;
    }

    return {
      projectedWaterLossLiters: totalWaterLossLiters,
      projectedWaterLossM3: totalWaterLossM3,
      directWaterCostInr,
      effluentPenaltyInr,
      totalFinancialBleedInr,
      energyWastedKwh,
      co2eKg,
      riskCategory,
      riskScore,
      aiInsight,
      baselineWaterLossLiters,
      baselineFinancialCostInr,
      aiMitigatedLossLiters,
      aiMitigatedCostInr
    };
  }, [params]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#0077B6] text-black">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-['Outfit'] text-white">
              What-If Water Network Simulator & Financial Bleed Lab
            </h1>
            <p className="text-xs font-mono text-gray-400">
              Interactive Hydrodynamic Parameter Modeling • {currentPlant.name}
            </p>
          </div>
        </div>

        <button
          onClick={() => setParams({ leakRateLph: 350, responseDelayHours: 6, tariffInrPerM3: 85, productionState: 'Standard' })}
          className="px-3.5 py-2 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-xs font-mono text-gray-300 flex items-center space-x-2 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#00E5FF]" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Simulator Inputs & Projections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form: Parameter Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-5 font-mono text-xs">
            <div className="flex items-center space-x-2 pb-3 border-b border-white/10">
              <Sliders className="w-4 h-4 text-[#00E5FF]" />
              <h2 className="font-bold text-white text-sm">Simulation Parameters</h2>
            </div>

            {/* Leak Flow Rate */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Simulated Leak Rate (L/hr)</span>
                <span className="font-bold text-[#FF4D6D]">{params.leakRateLph} L/h</span>
              </div>
              <input
                type="range"
                min="50"
                max="1200"
                step="25"
                value={params.leakRateLph}
                onChange={(e) => setParams({ ...params, leakRateLph: Number(e.target.value) })}
                className="w-full accent-[#00E5FF] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>Micro-Weep (50 L/h)</span>
                <span>Major Blowout (1,200 L/h)</span>
              </div>
            </div>

            {/* Response Delay */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Manual Detection Delay (Hours)</span>
                <span className="font-bold text-[#FFB703]">{params.responseDelayHours} Hours</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="48"
                step="0.5"
                value={params.responseDelayHours}
                onChange={(e) => setParams({ ...params, responseDelayHours: Number(e.target.value) })}
                className="w-full accent-[#FFB703] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>Fast Manual (30 min)</span>
                <span>Undetected (48 hrs)</span>
              </div>
            </div>

            {/* Water Tariff */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Industrial Water Tariff (₹ / m³)</span>
                <span className="font-bold text-[#00E5FF]">₹{params.tariffInrPerM3} / m³</span>
              </div>
              <input
                type="range"
                min="30"
                max="250"
                step="5"
                value={params.tariffInrPerM3}
                onChange={(e) => setParams({ ...params, tariffInrPerM3: Number(e.target.value) })}
                className="w-full accent-[#00E5FF] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>Borewell (₹30)</span>
                <span>Desal / Tanker (₹250)</span>
              </div>
            </div>

            {/* Factory State */}
            <div className="space-y-2">
              <span className="text-gray-300">Plant Operating Load</span>
              <div className="grid grid-cols-3 gap-2">
                {(['Reduced', 'Standard', 'Peak'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setParams({ ...params, productionState: mode })}
                    className={`py-2 rounded-xl border text-center transition-all ${
                      params.productionState === mode
                        ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF] font-bold'
                        : 'bg-black/30 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Area: Impact Projection & AI Comparison */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Main Risk & Financial Scorecard */}
          <div className="glass-panel p-6 rounded-2xl border border-white/15 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10 font-mono">
              <div>
                <div className="text-xs text-gray-400">Total Projected Financial Loss</div>
                <div className="text-3xl font-bold font-['Outfit'] text-[#FF4D6D] mt-1">
                  ₹{Math.round(result.totalFinancialBleedInr).toLocaleString()}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`text-xs px-3 py-1.5 rounded-full font-bold uppercase ${
                  result.riskCategory === 'Critical' ? 'bg-[#FF4D6D]/20 text-[#FF4D6D] border border-[#FF4D6D]/40 animate-pulse' :
                  result.riskCategory === 'High' ? 'bg-[#FFB703]/20 text-[#FFB703] border border-[#FFB703]/40' :
                  'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40'
                }`}>
                  {result.riskCategory} Risk Score: {result.riskScore}/100
                </span>
              </div>
            </div>

            {/* Breakdown Bento Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <div className="text-[10px] text-gray-400 flex items-center space-x-1">
                  <Droplets className="w-3.5 h-3.5 text-[#00E5FF]" />
                  <span>Unmetered Loss</span>
                </div>
                <div className="text-base font-bold text-white mt-1">
                  {result.projectedWaterLossLiters.toLocaleString()} L
                </div>
                <div className="text-[10px] text-gray-500">({result.projectedWaterLossM3.toFixed(2)} m³)</div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <div className="text-[10px] text-gray-400 flex items-center space-x-1">
                  <DollarSign className="w-3.5 h-3.5 text-[#FFB703]" />
                  <span>Direct Tariff</span>
                </div>
                <div className="text-base font-bold text-white mt-1">
                  ₹{Math.round(result.directWaterCostInr).toLocaleString()}
                </div>
                <div className="text-[10px] text-gray-500">Raw allocation</div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <div className="text-[10px] text-gray-400 flex items-center space-x-1">
                  <Zap className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Energy Loss</span>
                </div>
                <div className="text-base font-bold text-white mt-1">
                  {result.energyWastedKwh.toFixed(1)} kWh
                </div>
                <div className="text-[10px] text-gray-500">Pumping energy</div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <div className="text-[10px] text-gray-400 flex items-center space-x-1">
                  <Leaf className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Carbon Footprint</span>
                </div>
                <div className="text-base font-bold text-white mt-1">
                  {result.co2eKg.toFixed(1)} kg
                </div>
                <div className="text-[10px] text-gray-500">CO2e emissions</div>
              </div>
            </div>

            {/* AI Real-Time Mitigation Comparison Card */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#00E5FF]/10 to-transparent border border-[#00E5FF]/30 space-y-3 font-mono">
              <div className="flex items-center space-x-2 text-xs text-[#00E5FF] font-bold">
                <Sparkles className="w-4 h-4" />
                <span>AquaRisk AI vs Manual SCADA Comparison</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-black/40 border border-white/10">
                  <div className="text-[10px] text-gray-400">Manual Response ({params.responseDelayHours}h)</div>
                  <div className="text-sm font-bold text-[#FF4D6D] mt-1">
                    ₹{Math.round(result.baselineFinancialCostInr).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    {result.baselineWaterLossLiters.toLocaleString()} L lost
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#00E5FF]/15 border border-[#00E5FF]/40">
                  <div className="text-[10px] text-[#00E5FF] font-bold">With AquaRisk AI (6 min Auto-Trip)</div>
                  <div className="text-sm font-bold text-white mt-1">
                    ₹{Math.round(result.aiMitigatedCostInr).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-[#00E5FF] mt-0.5">
                    {result.aiMitigatedLossLiters.toLocaleString()} L lost (98% Saved)
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-300 font-sans leading-relaxed pt-1">
                {result.aiInsight}
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
