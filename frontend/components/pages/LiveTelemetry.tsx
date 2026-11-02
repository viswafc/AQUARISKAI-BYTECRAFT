import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Radio, 
  Gauge, 
  Waves, 
  Droplets, 
  Zap, 
  Thermometer, 
  Search, 
  ArrowRight, 
  Crosshair, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon,
  Sliders
} from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';
import { PageId, SensorReading } from '../../types';

interface LiveTelemetryProps {
  onNavigate: (page: PageId) => void;
  onSelectSensorOnMap?: (sensorId: string) => void;
}

export const LiveTelemetry: React.FC<LiveTelemetryProps> = ({ 
  onNavigate,
  onSelectSensorOnMap 
}) => {
  const { 
    sensors, 
    currentPlant, 
    leakSimulationMode, 
    setLeakSimulationMode, 
    resolveIncident, 
    isConnectedWs,
    activeTelemetry
  } = useTelemetry();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedSensor, setSelectedSensor] = useState<SensorReading>(sensors[0]);
  const [waveformTick, setWaveformTick] = useState<number>(0);

  // Advance waveform animation tick
  useEffect(() => {
    const interval = setInterval(() => {
      setWaveformTick(t => (t + 1) % 100);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updated = sensors.find(s => s.sensorId === selectedSensor?.sensorId);
    if (updated) {
      setSelectedSensor(updated);
    } else if (sensors.length > 0) {
      setSelectedSensor(sensors[0]);
    }
  }, [sensors, selectedSensor?.sensorId]);

  const filteredSensors = sensors.filter(s => {
    const matchesSearch = s.sensorId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.zone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || s.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Generate dynamic SVG waveform points for selected sensor
  const generateWaveformPath = () => {
    const points: string[] = [];
    const width = 760;
    const height = 160;
    const steps = 48;
    const isCritical = selectedSensor?.status === 'critical';
    const isWarning = selectedSensor?.status === 'warning';

    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * width;
      const phase = (i + waveformTick) * 0.45;
      const amplitude = isCritical ? 48 : isWarning ? 26 : 12;
      const highFreqJitter = isCritical ? Math.cos(phase * 3.7) * 18 : Math.cos(phase * 2.1) * 5;
      const y = height / 2 + Math.sin(phase) * amplitude + highFreqJitter;
      points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${Math.max(12, Math.min(height - 12, y)).toFixed(1)}`);
    }
    return points.join(' ');
  };

  const getTypeIcon = (type: SensorReading['type']) => {
    switch (type) {
      case 'flow': return Droplets;
      case 'pressure': return Gauge;
      case 'acoustic': return Waves;
      case 'vibration': return Zap;
      case 'temperature': return Thermometer;
      default: return Activity;
    }
  };

  // Map sensor ID to 3D visualizer pin ID
  const handleJumpTo3DPin = (sensorId: string) => {
    let pinId = 'PS-01';
    if (sensorId.includes('FL-01')) pinId = 'FS-01';
    else if (sensorId.includes('PR-01')) pinId = 'PS-01';
    else if (sensorId.includes('LVL-01')) pinId = 'TL-01';
    else if (sensorId.includes('FL-02')) pinId = 'FS-03';
    else if (sensorId.includes('AC-05') || sensorId.includes('PR-03') || sensorId.includes('FL-03')) pinId = 'LEAK-S05';
    else if (sensorId.includes('VB')) pinId = 'VB-01';

    if (onSelectSensorOnMap) {
      onSelectSensorOnMap(pinId);
    }
    onNavigate('overview');
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto animate-fade-in-up">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold font-['Outfit'] text-white">
                Live SCADA Waveform & Sensor Telemetry Stream
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] text-[10px] font-mono font-bold border border-[#10B981]/30">
                {isConnectedWs ? 'WS 500Hz LIVE' : 'SCADA POLLING'}
              </span>
            </div>
            <p className="text-xs font-mono text-gray-400 mt-0.5">
              {currentPlant.name} • Real-Time Acoustic, Pressure, Flow & Vibration Oscilloscope
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setLeakSimulationMode('warning_10')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
              leakSimulationMode === 'warning_10'
                ? 'bg-amber-500 text-black border-amber-400'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
            }`}
          >
            10% Seepage
          </button>
          <button
            onClick={() => setLeakSimulationMode('critical_blowout')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
              leakSimulationMode === 'critical_blowout'
                ? 'bg-[#FF4D6D] text-white border-[#FF4D6D]'
                : 'bg-[#FF4D6D]/10 text-[#FF4D6D] border-[#FF4D6D]/30 hover:bg-[#FF4D6D]/20'
            }`}
          >
            Critical Blowout
          </button>
          <button
            onClick={() => resolveIncident()}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
              leakSimulationMode === 'resolved'
                ? 'bg-[#10B981] text-black border-[#10B981]'
                : 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30 hover:bg-[#10B981]/20'
            }`}
          >
            Resolve & Flow
          </button>
          <button
            onClick={() => onNavigate('overview')}
            className="px-3.5 py-1.5 rounded-xl bg-[#00E5FF]/15 hover:bg-[#00E5FF]/25 border border-[#00E5FF]/40 text-[#00E5FF] text-xs font-mono font-bold flex items-center space-x-1.5 cursor-pointer"
          >
            <span>3D Plant View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Live Waveform Oscilloscope Card */}
      {selectedSensor && (
        <div className="glass-panel p-5 rounded-2xl border border-[#00E5FF]/30 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10 font-mono">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-[#00E5FF] font-bold uppercase">
                  CHANNEL OSCILLOSCOPE: {selectedSensor.sensorId}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  selectedSensor.status === 'critical' ? 'bg-[#FF4D6D]/20 text-[#FF4D6D] border border-[#FF4D6D]/40 animate-pulse' :
                  selectedSensor.status === 'warning' ? 'bg-amber-400/20 text-amber-400 border border-amber-400/40' :
                  'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40'
                }`}>
                  {selectedSensor.status}
                </span>
              </div>
              <h2 className="text-base font-bold text-white font-['Outfit'] mt-0.5">
                {selectedSensor.name} ({selectedSensor.zone})
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-[10px] text-gray-400">LIVE READING</div>
                <div className={`text-2xl font-black ${
                  selectedSensor.status === 'critical' ? 'text-[#FF4D6D]' :
                  selectedSensor.status === 'warning' ? 'text-amber-400' : 'text-[#00E5FF]'
                }`}>
                  {selectedSensor.value} <span className="text-xs text-gray-400">{selectedSensor.unit}</span>
                </div>
              </div>
              <button
                onClick={() => handleJumpTo3DPin(selectedSensor.sensorId)}
                className="px-3 py-2 rounded-xl bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-black font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-lg shadow-[#00E5FF]/20"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>Locate on 3D Plant</span>
              </button>
            </div>
          </div>

          {/* Oscilloscope SVG */}
          <div className="bg-[#050c14] rounded-xl p-4 border border-white/10 relative overflow-hidden">
            <svg viewBox="0 0 760 160" className="w-full h-40">
              {/* Grid lines */}
              {[0.2, 0.5, 0.8].map((r, idx) => (
                <line
                  key={idx}
                  x1="0"
                  y1={160 * r}
                  x2="760"
                  y2={160 * r}
                  stroke="rgba(255,255,255,0.07)"
                  strokeDasharray="4 4"
                />
              ))}
              <path
                d={generateWaveformPath()}
                fill="none"
                stroke={
                  selectedSensor.status === 'critical' ? '#FF4D6D' :
                  selectedSensor.status === 'warning' ? '#FFB703' : '#00E5FF'
                }
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 pt-2 border-t border-white/5">
              <span>Nominal Band: <strong className="text-white">{selectedSensor.nominalMin} – {selectedSensor.nominalMax} {selectedSensor.unit}</strong></span>
              <span>SNR: <strong className="text-[#00E5FF]">{selectedSensor.snrDb ?? 39.4} dB</strong></span>
              <span>Zero Drift: <strong className="text-[#10B981]">{selectedSensor.driftPercentage ?? 0.03}%</strong></span>
              <span>Health: <strong className="text-white">{selectedSensor.healthScore ?? 96}%</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by sensor tag, name, or zone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00E5FF]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(['all', 'flow', 'pressure', 'acoustic', 'vibration', 'temperature'] as const).map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 rounded-xl uppercase transition-all cursor-pointer ${
                typeFilter === type
                  ? 'bg-[#00E5FF] text-black font-bold'
                  : 'bg-black/40 text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSensors.map(sensor => {
          const Icon = getTypeIcon(sensor.type);
          const isSelected = selectedSensor?.sensorId === sensor.sensorId;
          return (
            <div
              key={sensor.sensorId}
              onClick={() => setSelectedSensor(sensor)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer font-mono space-y-3 ${
                isSelected
                  ? 'bg-[#00E5FF]/10 border-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.15)]'
                  : 'glass-panel border-white/10 hover:border-white/25'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2.5">
                  <div className={`p-2 rounded-xl ${
                    sensor.status === 'critical' ? 'bg-[#FF4D6D]/20 text-[#FF4D6D]' :
                    sensor.status === 'warning' ? 'bg-amber-400/20 text-amber-400' :
                    'bg-[#00E5FF]/15 text-[#00E5FF]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{sensor.sensorId}</div>
                    <div className="text-[10px] text-gray-400 truncate max-w-[180px]">{sensor.name}</div>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  sensor.status === 'critical' ? 'bg-[#FF4D6D]/20 text-[#FF4D6D] animate-pulse' :
                  sensor.status === 'warning' ? 'bg-amber-400/20 text-amber-400' :
                  'bg-[#10B981]/20 text-[#10B981]'
                }`}>
                  {sensor.status}
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-2 border-t border-white/10">
                <div>
                  <span className="text-[10px] text-gray-400 block">LIVE VALUE</span>
                  <span className="text-lg font-extrabold text-white">
                    {sensor.value} <span className="text-xs font-normal text-[#00E5FF]">{sensor.unit}</span>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block">OPERATING BAND</span>
                  <span className="text-xs text-gray-300">{sensor.nominalMin} – {sensor.nominalMax}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1">
                <span>{sensor.zone}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJumpTo3DPin(sensor.sensorId);
                  }}
                  className="text-[#00E5FF] hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <span>3D Pin</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
