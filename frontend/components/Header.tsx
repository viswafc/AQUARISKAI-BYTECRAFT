import React, { useState } from 'react';
import { 
  Droplets, 
  Activity, 
  Layers, 
  LineChart, 
  AlertOctagon, 
  FileText, 
  Sliders, 
  Cpu, 
  ShieldAlert, 
  CheckCircle2, 
  Wifi, 
  WifiOff, 
  FlaskConical, 
  Building2,
  ChevronDown,
  Bell,
  X
} from 'lucide-react';
import { PageId, PlantId } from '../types';
import { useTelemetry } from '../context/TelemetryContext';

interface HeaderProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const { 
    currentPlantId, 
    setCurrentPlantId, 
    plants, 
    currentPlant, 
    isConnectedWs, 
    leakSimulationMode, 
    setLeakSimulationMode, 
    isPipelineAutoStopped, 
    fleetHealthScore,
    notifications,
    dismissNotification
  } = useTelemetry();

  const [plantDropdownOpen, setPlantDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const navItems: { id: PageId; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: '3D Plant Visualizer', icon: Droplets },
    { id: 'live-data', label: 'Live Telemetry', icon: Activity },
    { id: 'digital-twin', label: 'Digital Twin Topology', icon: Layers },
    { id: 'analytics', label: 'Analytics & Consumption', icon: LineChart },
    { id: 'incidents', label: 'Incidents & AI Root Cause', icon: AlertOctagon },
    { id: 'what-if-lab', label: 'What-If Simulation Lab', icon: FlaskConical },
    { id: 'reports', label: 'Reports & Compliance', icon: FileText },
    { id: 'settings', label: 'Settings & Sensor Health', icon: Sliders },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#070e17]/90 backdrop-blur-xl border-b border-white/10 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3">
        
        {/* Brand & Plant Selector */}
        <div className="flex items-center justify-between w-full lg:w-auto gap-4">
          <div 
            onClick={() => onNavigate('overview')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#0077B6] flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-transform group-hover:scale-105">
              <Droplets className="w-6 h-6 text-black" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-['Outfit'] font-black text-lg tracking-tight text-white">
                  AQUA<span className="text-[#00E5FF]">RISK</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 font-mono font-bold">
                  AI CORE
                </span>
              </div>
              <p className="text-[11px] font-mono text-gray-400">
                SCADA Water Network Intelligence
              </p>
            </div>
          </div>

          {/* Plant Dropdown Picker */}
          <div className="relative">
            <button
              onClick={() => setPlantDropdownOpen(!plantDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#0d1b2a] border border-[#00E5FF]/30 hover:border-[#00E5FF] text-xs font-mono text-white transition-all shadow-sm"
            >
              <Building2 className="w-4 h-4 text-[#00E5FF]" />
              <div className="text-left">
                <div className="text-[10px] text-gray-400">Active Plant</div>
                <div className="font-bold text-[#00E5FF] truncate max-w-[140px] sm:max-w-[180px]">
                  {currentPlant.shortName}
                </div>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${plantDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {plantDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 rounded-xl bg-[#061421] border border-[#00E5FF]/40 shadow-2xl p-2 z-50 animate-fade-in-up">
                <div className="text-[10px] uppercase font-mono text-gray-400 px-2 py-1 border-b border-white/10 mb-1">
                  Select Monitored Facility
                </div>
                {plants.map((plant) => (
                  <button
                    key={plant.id}
                    onClick={() => {
                      setCurrentPlantId(plant.id as PlantId);
                      setPlantDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg text-xs font-mono transition-all flex items-start justify-between ${
                      currentPlantId === plant.id
                        ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="font-bold">{plant.shortName}</div>
                      <div className="text-[10px] text-gray-400">{plant.location}</div>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      plant.status === 'critical' ? 'bg-[#FF4D6D]/20 text-[#FF4D6D]' :
                      plant.status === 'warning' ? 'bg-[#FFB703]/20 text-[#FFB703]' :
                      'bg-[#10B981]/20 text-[#10B981]'
                    }`}>
                      {plant.status.toUpperCase()}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 overflow-x-auto w-full lg:w-auto py-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/40 shadow-[0_0_12px_rgba(0,229,255,0.15)] font-bold'
                    : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#00E5FF]' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Live Status & Quick Action Panel */}
        <div className="flex items-center space-x-3 w-full lg:w-auto justify-end">
          {/* WebSocket Status Indicator */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-[11px] font-mono">
            {isConnectedWs ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-gray-300">SCADA Stream</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-[#FFB703]" />
                <span className="text-gray-400">Telemetry Active</span>
              </>
            )}
          </div>

          {/* Fleet Health Badge */}
          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[11px] font-mono text-[#00E5FF]">
            <Cpu className="w-3.5 h-3.5" />
            <span className="font-bold">{fleetHealthScore}% Health</span>
          </div>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-xl bg-black/40 border border-white/10 text-gray-300 hover:text-white hover:border-[#00E5FF]/40 transition-all relative"
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF4D6D] text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
                  {notifications.length}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#061421] border border-[#00E5FF]/40 shadow-2xl p-3 z-50 animate-fade-in-up">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                  <span className="text-xs font-bold text-white font-mono">SCADA Incident Feed</span>
                  <span className="text-[10px] text-gray-400 font-mono">{notifications.length} Alerts</span>
                </div>
                {notifications.length === 0 ? (
                  <p className="text-xs text-gray-400 py-4 text-center">No active anomalies detected.</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className={`p-2.5 rounded-xl border text-xs font-mono relative ${
                          n.type === 'critical' ? 'bg-[#FF4D6D]/10 border-[#FF4D6D]/30 text-gray-200' :
                          'bg-[#FFB703]/10 border-[#FFB703]/30 text-gray-200'
                        }`}
                      >
                        <button
                          onClick={() => dismissNotification(n.id)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <div className="font-bold text-white pr-4">{n.title}</div>
                        <div className="text-[11px] text-gray-300 mt-1">{n.message}</div>
                        <div className="text-[10px] text-gray-400 mt-1.5 flex items-center justify-between">
                          <span>{n.time}</span>
                          {n.targetPage && (
                            <button
                              onClick={() => {
                                onNavigate(n.targetPage!);
                                setNotificationsOpen(false);
                              }}
                              className="text-[#00E5FF] underline hover:text-white"
                            >
                              Inspect →
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
