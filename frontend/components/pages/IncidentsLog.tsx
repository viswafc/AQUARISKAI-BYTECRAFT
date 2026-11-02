import React, { useState } from 'react';
import { 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Activity, 
  FileText, 
  Download, 
  ShieldAlert, 
  Check, 
  Search, 
  Filter, 
  Wrench, 
  ArrowRight,
  TrendingDown,
  Droplets,
  DollarSign
} from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';
import { PageId, Incident, IncidentStatus, IncidentSeverity } from '../../types';
import { INCIDENT_TIMELINE_STORY } from '../../data/mockData';

interface IncidentsLogProps {
  onNavigate: (page: PageId) => void;
}

export const IncidentsLog: React.FC<IncidentsLogProps> = ({ onNavigate }) => {
  const { incidents, resolveIncident, currentPlant } = useTelemetry();
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(incidents[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch = inc.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inc.rootCause.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inc.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSeverity = severityFilter === 'all' || inc.severity.toLowerCase() === severityFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-[#FF4D6D]/10 text-[#FF4D6D] border border-[#FF4D6D]/30">
              <AlertOctagon className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl font-bold font-['Outfit'] text-white">
                Incident Response & AI Root-Cause Diagnostic Center
              </h1>
              <p className="text-xs font-mono text-gray-400">
                Facility: {currentPlant.name} • Automated SCADA Anomaly & Fracture Analysis
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('overview')}
            className="px-4 py-2 rounded-xl bg-[#00E5FF]/15 hover:bg-[#00E5FF]/25 border border-[#00E5FF]/40 text-[#00E5FF] text-xs font-mono font-bold transition-all flex items-center space-x-2"
          >
            <span>Inspect on 3D Visualizer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, segment, root cause..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00E5FF]"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-gray-300 focus:outline-none focus:border-[#00E5FF]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-gray-300 focus:outline-none focus:border-[#00E5FF]"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="moderate">Moderate</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Incident List & Selected Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Incidents List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredIncidents.map((inc) => {
            const isSelected = selectedIncident?.id === inc.id;
            return (
              <div
                key={inc.id}
                onClick={() => setSelectedIncident(inc)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer font-mono ${
                  isSelected
                    ? 'bg-[#00E5FF]/10 border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.15)]'
                    : 'glass-panel border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-sm">{inc.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      inc.severity === 'Critical' ? 'bg-[#FF4D6D]/20 text-[#FF4D6D] border border-[#FF4D6D]/30' :
                      inc.severity === 'Warning' ? 'bg-[#FFB703]/20 text-[#FFB703] border border-[#FFB703]/30' :
                      'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
                    }`}>
                      {inc.severity}
                    </span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                    inc.status === 'Active' ? 'bg-[#FF4D6D] text-white animate-pulse' : 'bg-white/10 text-gray-400'
                  }`}>
                    {inc.status}
                  </span>
                </div>

                <div className="text-xs text-gray-300 font-semibold mb-2">
                  {inc.location}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-400 pt-2 border-t border-white/10">
                  <div>Loss: <strong className="text-white">+{inc.volumeLostLiters.toLocaleString()} L</strong></div>
                  <div>Cost: <strong className="text-[#FF4D6D]">₹{inc.financialImpactInr.toLocaleString()}</strong></div>
                  <div>Rate: <strong className="text-white">{inc.leakRateLph} L/h</strong></div>
                  <div>Confidence: <strong className="text-[#00E5FF]">{inc.confidenceScore}%</strong></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Deep Diagnostic Inspector */}
        <div className="lg:col-span-7">
          {selectedIncident ? (
            <div className="glass-panel p-6 rounded-2xl border border-white/15 space-y-6">
              
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10 font-mono">
                <div>
                  <div className="text-xs text-[#00E5FF] uppercase font-bold">Incident Deep Dossier</div>
                  <h2 className="text-lg font-bold text-white">{selectedIncident.id} • {selectedIncident.location}</h2>
                  <div className="text-xs text-gray-400 mt-1 flex items-center space-x-3">
                    <span className="flex items-center space-x-1"><Clock className="w-3.5 h-3.5" /> <span>{selectedIncident.timestamp}</span></span>
                    <span className="flex items-center space-x-1"><MapPin className="w-3.5 h-3.5" /> <span>{selectedIncident.zone}</span></span>
                  </div>
                </div>

                {selectedIncident.status === 'Active' && (
                  <button
                    onClick={() => resolveIncident()}
                    className="px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#10B981]/80 text-black font-bold text-xs flex items-center space-x-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  >
                    <Check className="w-4 h-4" />
                    <span>Execute Rapid Resolution</span>
                  </button>
                )}
              </div>

              {/* Loss Metrics Bento */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 font-mono">
                  <div className="text-[10px] text-gray-400 flex items-center space-x-1">
                    <Droplets className="w-3.5 h-3.5 text-[#00E5FF]" />
                    <span>Current Leak Rate</span>
                  </div>
                  <div className="text-lg font-bold text-white mt-1">{selectedIncident.leakRateLph} L/h</div>
                </div>
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 font-mono">
                  <div className="text-[10px] text-gray-400 flex items-center space-x-1">
                    <TrendingDown className="w-3.5 h-3.5 text-[#FF4D6D]" />
                    <span>Total Lost Water</span>
                  </div>
                  <div className="text-lg font-bold text-white mt-1">{selectedIncident.volumeLostLiters.toLocaleString()} L</div>
                </div>
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 font-mono">
                  <div className="text-[10px] text-gray-400 flex items-center space-x-1">
                    <DollarSign className="w-3.5 h-3.5 text-[#FFB703]" />
                    <span>Financial Bleed</span>
                  </div>
                  <div className="text-lg font-bold text-[#FF4D6D] mt-1">₹{selectedIncident.financialImpactInr.toLocaleString()}</div>
                </div>
              </div>

              {/* AI Diagnostic Root Cause */}
              <div className="p-4 rounded-xl bg-[#00E5FF]/5 border border-[#00E5FF]/30 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-mono text-[#00E5FF] font-bold">
                  <Activity className="w-4 h-4" />
                  <span>AI Multimodal Hydrodynamic Analysis</span>
                  <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-[#00E5FF]/20">
                    {selectedIncident.confidenceScore}% Confidence
                  </span>
                </div>
                <p className="text-xs text-gray-200 leading-relaxed font-sans">
                  {selectedIncident.rootCause}
                </p>
              </div>

              {/* Automated SCADA Containment Measures */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-gray-300 uppercase">
                  Automated SCADA Containment & Dispatch Actions
                </h4>
                <div className="space-y-1.5">
                  {selectedIncident.automatedActions.map((action, i) => (
                    <div key={i} className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-black/30 border border-white/5 text-xs text-gray-300 font-mono">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chronological Escalation Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-gray-300 uppercase">
                  Incident Escalation Sequence (SCADA Audit)
                </h4>
                <div className="space-y-2 border-l-2 border-[#00E5FF]/30 pl-4 ml-2">
                  {INCIDENT_TIMELINE_STORY.map((event, i) => (
                    <div key={i} className="relative space-y-1 text-xs font-mono">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#00E5FF]" />
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-bold">{event.title}</span>
                        <span className="text-[10px] text-gray-400">({event.timeAgo})</span>
                      </div>
                      <p className="text-[11px] text-gray-300 font-sans">{event.description}</p>
                      <div className="text-[10px] text-[#00E5FF] bg-black/40 p-1.5 rounded-lg inline-block">
                        {event.readings}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="glass-panel p-12 rounded-2xl border border-white/10 text-center text-gray-400 font-mono text-xs">
              Select an incident from the log to view detailed root cause analytics.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
