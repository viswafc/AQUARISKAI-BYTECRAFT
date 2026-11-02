import React, { useState } from 'react';
import { TelemetryProvider } from './context/TelemetryContext';
import { Header } from './components/Header';
import { PlantVisualizer } from './components/pages/PlantVisualizer';
import { LiveTelemetry } from './components/pages/LiveTelemetry';
import { DigitalTwin } from './components/pages/DigitalTwin';
import { AnalyticsTrends } from './components/pages/AnalyticsTrends';
import { IncidentsLog } from './components/pages/IncidentsLog';
import { WhatIfLab } from './components/pages/WhatIfLab';
import { ReportsCompliance } from './components/pages/ReportsCompliance';
import { SettingsConfig } from './components/pages/SettingsConfig';
import { PageId } from './types';
import { motion, AnimatePresence } from 'motion/react';

export const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageId>('overview');
  const [selectedSensorPin, setSelectedSensorPin] = useState<string | null>(null);

  const renderPage = () => {
    switch (currentPage) {
      case 'overview':
      case 'command-center':
        return (
          <PlantVisualizer
            onNavigate={setCurrentPage}
            selectedSensorIdFromSearch={selectedSensorPin}
          />
        );
      case 'live-data':
        return (
          <LiveTelemetry
            onNavigate={setCurrentPage}
            onSelectSensorOnMap={(pinId) => setSelectedSensorPin(pinId)}
          />
        );
      case 'digital-twin':
        return <DigitalTwin onNavigate={setCurrentPage} />;
      case 'analytics':
        return <AnalyticsTrends onNavigate={setCurrentPage} />;
      case 'incidents':
      case 'incident-center':
        return <IncidentsLog onNavigate={setCurrentPage} />;
      case 'what-if-lab':
        return <WhatIfLab onNavigate={setCurrentPage} />;
      case 'reports':
        return <ReportsCompliance onNavigate={setCurrentPage} />;
      case 'settings':
        return <SettingsConfig onNavigate={setCurrentPage} />;
      default:
        return (
          <PlantVisualizer
            onNavigate={setCurrentPage}
            selectedSensorIdFromSearch={selectedSensorPin}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#070e17] text-[#F0F6FC] flex flex-col font-sans selection:bg-[#00E5FF]/30 selection:text-[#00E5FF]">
      {/* Top SCADA Navigation Header */}
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />

      {/* Main View Area with Smooth Page Transition */}
      <main className="flex-1 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="w-full"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Industrial Footer Status Bar */}
      <footer className="w-full border-t border-white/10 bg-[#070e17]/95 py-2.5 px-4 text-xs font-mono text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span className="text-gray-400">AquaRisk Industrial SCADA Engine v2.4</span>
          </span>
          <span>•</span>
          <span>Acoustic Wavelet + Hydrodynamic Kalman Filter Active</span>
        </div>
        <div>
          <span>ISO 14001:2015 & CGWA Industrial Compliance Ready</span>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <TelemetryProvider>
      <AppContent />
    </TelemetryProvider>
  );
};

export default App;
