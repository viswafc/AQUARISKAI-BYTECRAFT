import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  Building2, 
  Award, 
  Printer, 
  Share2, 
  ExternalLink,
  Droplets,
  TrendingDown,
  Clock
} from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';
import { PageId } from '../../types';

interface ReportsComplianceProps {
  onNavigate: (page: PageId) => void;
}

export const ReportsCompliance: React.FC<ReportsComplianceProps> = ({ onNavigate }) => {
  const { currentPlant } = useTelemetry();
  const [reportType, setReportType] = useState<'esg' | 'cgwa' | 'iso14001' | 'scada_audit'>('esg');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-mono">
      {/* Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#10B981] to-[#047857] text-white">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-['Outfit'] text-white">
              Regulatory Compliance & Water Audit Intelligence
            </h1>
            <p className="text-xs text-gray-400">
              CGWA • ISO 14001:2015 • BRSR ESG Water Stewardship Framework
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl bg-[#00E5FF] hover:bg-[#00E5FF]/80 text-black font-bold text-xs flex items-center space-x-2 transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)]"
          >
            <Download className="w-4 h-4" />
            <span>{downloadSuccess ? 'PDF Exported!' : 'Export Certified Audit (PDF)'}</span>
          </button>
        </div>
      </div>

      {/* Report Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        {[
          { id: 'esg', label: 'ESG / BRSR Disclosure', icon: Award },
          { id: 'cgwa', label: 'CGWA Ground Water NOC', icon: ShieldCheck },
          { id: 'iso14001', label: 'ISO 14001 Environmental', icon: CheckCircle2 },
          { id: 'scada_audit', label: 'Monthly SCADA Flow Audit', icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = reportType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id as any)}
              className={`p-3.5 rounded-xl border text-left flex items-center space-x-2.5 transition-all ${
                isSelected
                  ? 'bg-[#00E5FF]/15 border-[#00E5FF] text-[#00E5FF] font-bold shadow-sm'
                  : 'glass-panel border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Report Document Preview */}
      <div className="glass-panel p-8 rounded-2xl border border-white/15 space-y-6">
        
        {/* Document Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="text-[10px] text-[#00E5FF] font-bold uppercase tracking-wider">
              Official Environmental Audit & Telemetry Validation Record
            </div>
            <h2 className="text-xl font-bold font-['Outfit'] text-white mt-1">
              Water Consumption & Loss Prevention Dossier (Q3 2026)
            </h2>
            <div className="text-xs text-gray-400 mt-2 space-y-0.5 font-sans">
              <div><strong>Facility:</strong> {currentPlant.name}</div>
              <div><strong>Location:</strong> {currentPlant.location}</div>
              <div><strong>SCADA Authority ID:</strong> SCADA-AQUA-TAMILNADU-IND-482</div>
            </div>
          </div>

          <div className="text-right text-xs text-gray-400 space-y-1">
            <div className="inline-block px-3 py-1 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 font-bold">
              STATUS: AUDIT VERIFIED
            </div>
            <div>Generated: 2026-09-20 06:48 UTC</div>
            <div>Verification Hash: SHA256-8F92...B31D</div>
          </div>
        </div>

        {/* Executive Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-black/40 border border-white/10">
            <div className="text-gray-400">Total Metered Intake (Q3)</div>
            <div className="text-xl font-bold text-white mt-1">2,684,300 Liters</div>
            <div className="text-[10px] text-[#10B981] mt-1">Within licensed allocation of 3,200,000 L</div>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/10">
            <div className="text-gray-400">Non-Revenue Water (NRW) / Loss</div>
            <div className="text-xl font-bold text-[#FF4D6D] mt-1">3.4% (91,267 L)</div>
            <div className="text-[10px] text-[#00E5FF] mt-1">Industry benchmark: &lt; 8.0%</div>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/10">
            <div className="text-gray-400">AI Preventative Avoidance</div>
            <div className="text-xl font-bold text-[#10B981] mt-1">₹584,200 Saved</div>
            <div className="text-[10px] text-gray-400 mt-1">Via automated micro-fracture containment</div>
          </div>
        </div>

        {/* Compliance Checklist Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase text-gray-300">Regulatory Adherence Checklist</h3>
          <div className="divide-y divide-white/5 rounded-xl border border-white/10 overflow-hidden text-xs">
            <div className="p-3 bg-black/40 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span className="text-white">Central Ground Water Authority (CGWA) Digital Flow Telemetry</span>
              </div>
              <span className="text-[#10B981] font-bold">COMPLIANT (100% Uptime)</span>
            </div>

            <div className="p-3 bg-black/20 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span className="text-white">ISO 14001:2015 Clause 8.1 Operational Planning & Leak Cutoff</span>
              </div>
              <span className="text-[#10B981] font-bold">CERTIFIED</span>
            </div>

            <div className="p-3 bg-black/40 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span className="text-white">State Pollution Control Board (TNPCB) Zero Liquid Discharge Tracking</span>
              </div>
              <span className="text-[#10B981] font-bold">VERIFIED</span>
            </div>

            <div className="p-3 bg-black/20 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span className="text-white">BRSR Principle 6 (Environment & Water Intensity Ratio)</span>
              </div>
              <span className="text-[#00E5FF] font-bold">0.82 m³ / ton production</span>
            </div>
          </div>
        </div>

        {/* Auditor Sign-off */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-gray-400">
          <div>
            <div><strong>Lead Environmental Engineer:</strong> Dr. Arvind Swaminathan, Ph.D.</div>
            <div><strong>Certification Body:</strong> Bureau Veritas Industrial Water Systems</div>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center space-x-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Audit</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
