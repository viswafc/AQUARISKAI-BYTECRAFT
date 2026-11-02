import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  PlantId, 
  PlantInfo, 
  Incident, 
  SensorReading, 
  DigitalTwinNode, 
  LeakSimulationMode, 
  NotificationItem, 
  TelemetryPayload 
} from '../types';
import { 
  PLANTS_CATALOG, 
  PLANT_NODES_MAP, 
  PLANT_INCIDENTS_MAP, 
  PLANT_TELEMETRY_MAP, 
  INITIAL_SENSORS 
} from '../data/mockData';

interface TelemetryContextType {
  currentPlantId: PlantId;
  setCurrentPlantId: (id: PlantId) => void;
  currentPlant: PlantInfo;
  plants: PlantInfo[];
  sensors: SensorReading[];
  incidents: Incident[];
  digitalTwinNodes: DigitalTwinNode[];
  selectedTwinNodeId: string | null;
  setSelectedTwinNodeId: (id: string | null) => void;
  isV104Isolated: boolean;
  isolateLineB: (isolated?: boolean) => void;
  toggleValveState: (nodeId: string, aperture?: number) => void;
  emergencyTriggered: boolean;
  leakSimulationMode: LeakSimulationMode;
  setLeakSimulationMode: (mode: LeakSimulationMode) => void;
  resolveIncident: () => void;
  isPipelineAutoStopped: boolean;
  fleetHealthScore: number;
  systemHealth: {
    backend: 'online' | 'degraded' | 'offline';
    database: 'online' | 'degraded' | 'offline';
    mlEngine: 'online' | 'degraded' | 'offline';
    webSockets: 'online' | 'degraded' | 'offline';
    latencyMs: number;
    connectedClients: number;
    uptimeSeconds: number;
  };
  isConnectedWs: boolean;
  notifications: NotificationItem[];
  dismissNotification: (id: string) => void;
  activeIncident: Incident | null;
  activeTelemetry: TelemetryPayload;
  telemetry: TelemetryPayload;
  triggerEmergencyCutoff: () => void;
  resetSystem: () => void;
}

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

export const TelemetryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPlantId, setCurrentPlantId] = useState<PlantId>('plant-01');
  const [leakSimulationMode, setLeakSimulationModeState] = useState<LeakSimulationMode>('critical_blowout');
  const [isV104Isolated, setIsV104Isolated] = useState<boolean>(false);
  const [emergencyTriggered, setEmergencyTriggered] = useState<boolean>(false);
  const [isPipelineAutoStopped, setIsPipelineAutoStopped] = useState<boolean>(false);
  const [selectedTwinNodeId, setSelectedTwinNodeId] = useState<string | null>('NODE-SEG-S05');
  const [isConnectedWs, setIsConnectedWs] = useState<boolean>(false);

  // Per-plant state management
  const [nodesMap, setNodesMap] = useState<Record<PlantId, DigitalTwinNode[]>>({
    'plant-01': JSON.parse(JSON.stringify(PLANT_NODES_MAP['plant-01'])),
    'plant-02': JSON.parse(JSON.stringify(PLANT_NODES_MAP['plant-02'])),
  });

  const [incidentsMap, setIncidentsMap] = useState<Record<PlantId, Incident[]>>({
    'plant-01': JSON.parse(JSON.stringify(PLANT_INCIDENTS_MAP['plant-01'])),
    'plant-02': JSON.parse(JSON.stringify(PLANT_INCIDENTS_MAP['plant-02'])),
  });

  const [sensorsMap, setSensorsMap] = useState<Record<PlantId, SensorReading[]>>({
    'plant-01': JSON.parse(JSON.stringify(INITIAL_SENSORS)),
    'plant-02': JSON.parse(JSON.stringify(PLANT_TELEMETRY_MAP['plant-02'].sensors)),
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Structural Rupture S05 Alert',
      message: 'Acoustic spike 58.4 kHz on Line B Flange S05-W12. Loss rate 342.4 L/hr.',
      type: 'critical',
      time: '2m ago',
      targetPage: 'overview',
      targetNodeId: 'NODE-SEG-S05'
    },
    {
      id: 'notif-2',
      title: 'Automated Isolation Advisory',
      message: 'SCADA isolation logic suggests tripping Valve V-104.',
      type: 'warning',
      time: '4m ago',
      targetPage: 'digital-twin',
      targetNodeId: 'NODE-V104'
    }
  ]);

  const plants = useMemo(() => {
    return PLANTS_CATALOG.map(plant => {
      const activeIncs = (incidentsMap[plant.id] || []).filter(i => i.status === 'Active');
      let status: 'critical' | 'warning' | 'nominal' = 'nominal';
      if (leakSimulationMode === 'critical_blowout' && plant.id === 'plant-01') {
        status = 'critical';
      } else if (activeIncs.some(i => i.severity === 'Critical')) {
        status = 'critical';
      } else if (activeIncs.some(i => i.severity === 'Warning')) {
        status = 'warning';
      }
      return {
        ...plant,
        status,
        activeIncidentsCount: activeIncs.length
      };
    });
  }, [incidentsMap, leakSimulationMode]);

  const currentPlant = useMemo(() => {
    return plants.find(p => p.id === currentPlantId) || plants[0];
  }, [plants, currentPlantId]);

  const digitalTwinNodes = useMemo(() => {
    return nodesMap[currentPlantId] || [];
  }, [nodesMap, currentPlantId]);

  const sensors = useMemo(() => {
    return sensorsMap[currentPlantId] || [];
  }, [sensorsMap, currentPlantId]);

  const incidents = useMemo(() => {
    return incidentsMap[currentPlantId] || [];
  }, [incidentsMap, currentPlantId]);

  const activeIncident = useMemo(() => {
    return incidents.find(i => i.status === 'Active') || null;
  }, [incidents]);

  const fleetHealthScore = useMemo(() => {
    if (sensors.length === 0) return 92;
    const total = sensors.reduce((acc, s) => acc + (s.healthScore || 90), 0);
    return Math.round(total / sensors.length);
  }, [sensors]);

  const systemHealth = useMemo(() => ({
    backend: 'online' as const,
    database: 'online' as const,
    mlEngine: 'online' as const,
    webSockets: isConnectedWs ? ('online' as const) : ('degraded' as const),
    latencyMs: 14,
    connectedClients: 6,
    uptimeSeconds: 432800
  }), [isConnectedWs]);

  const activeTelemetry: TelemetryPayload = useMemo(() => {
    const isLeakActive = leakSimulationMode !== 'resolved' && leakSimulationMode !== 'none' && !isPipelineAutoStopped && !isV104Isolated;
    return {
      timestamp: new Date().toISOString(),
      activeLeak: {
        incidentId: activeIncident?.id || 'INC-8921',
        location: activeIncident?.location || 'Line B, Segment S05 (High-Pressure Bottling)',
        segmentId: activeIncident?.segmentId || 'S05',
        severity: isLeakActive ? (leakSimulationMode === 'warning_10' ? 'Warning' : 'Critical') : 'Low',
        confidenceScore: isLeakActive ? 94.8 : 0,
        currentLossRateLph: isLeakActive ? (leakSimulationMode === 'warning_10' ? 120.0 : 342.4) : 0,
        projected24hLossLiters: isLeakActive ? (leakSimulationMode === 'warning_10' ? 2880 : 8217) : 0,
        financialBleedInrPerDay: isLeakActive ? (leakSimulationMode === 'warning_10' ? 10080 : 28760) : 0,
        detectedAt: activeIncident?.timestamp || '13:16:15 UTC',
        isIsolated: isV104Isolated || isPipelineAutoStopped
      },
      sensors,
      systemStatus: systemHealth
    };
  }, [activeIncident, leakSimulationMode, isPipelineAutoStopped, isV104Isolated, sensors, systemHealth]);

  // WebSocket / API connection logic
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;

    const connectWebSocket = () => {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws/telemetry`;
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          setIsConnectedWs(true);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'TELEMETRY_STREAM' && data.payload?.sensors) {
              setSensorsMap(prev => ({
                ...prev,
                'plant-01': data.payload.sensors
              }));
            }
          } catch (e) {
            // Ignore parse errors
          }
        };

        ws.onclose = () => {
          setIsConnectedWs(false);
          reconnectTimeout = setTimeout(connectWebSocket, 4000);
        };

        ws.onerror = () => {
          setIsConnectedWs(false);
        };
      } catch (err) {
        setIsConnectedWs(false);
      }
    };

    connectWebSocket();

    return () => {
      if (ws) ws.close();
      clearTimeout(reconnectTimeout);
    };
  }, []);

  const setLeakSimulationMode = useCallback(async (mode: LeakSimulationMode) => {
    setLeakSimulationModeState(mode);
    setIsV104Isolated(false);
    setIsPipelineAutoStopped(false);
    setEmergencyTriggered(false);

    setNodesMap(prev => ({
      ...prev,
      'plant-01': prev['plant-01'].map(node => {
        if (node.id === 'NODE-SEG-S05') {
          if (mode === 'resolved' || mode === 'none') {
            return { ...node, status: 'nominal', acousticKhz: 14.2, pressureBar: 4.4, flowLpm: 380.0, healthIndex: 96 };
          }
          if (mode === 'warning_10') {
            return { ...node, status: 'warning', acousticKhz: 32.8, pressureBar: 3.8, flowLpm: 175.0, healthIndex: 74 };
          }
          return { ...node, status: 'critical', acousticKhz: 58.4, pressureBar: 2.15, flowLpm: 395.8, healthIndex: 42 };
        }
        if (node.id === 'NODE-V104') {
          return {
            ...node,
            status: mode === 'critical_blowout' ? 'critical' : mode === 'warning_10' ? 'warning' : 'nominal',
            valveOpenPercent: mode === 'critical_blowout' ? 75 : 100
          };
        }
        return node;
      })
    }));

    setIncidentsMap(prev => ({
      ...prev,
      'plant-01': prev['plant-01'].map((inc, idx) => {
        if (idx === 0) {
          if (mode === 'resolved' || mode === 'none') {
            return { ...inc, status: 'Resolved', severity: 'Low', leakRateLph: 0 };
          }
          if (mode === 'warning_10') {
            return { ...inc, status: 'Active', severity: 'Warning', leakRateLph: 48.2 };
          }
          return { ...inc, status: 'Active', severity: 'Critical', leakRateLph: 342.4 };
        }
        return inc;
      })
    }));

    try {
      await fetch('/api/leak/mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode })
      });
    } catch (e) {
      // Offline fallback
    }
  }, []);

  const isolateLineB = useCallback(async (isolated: boolean = true) => {
    setIsV104Isolated(isolated);
    setEmergencyTriggered(isolated);

    setNodesMap(prev => ({
      ...prev,
      [currentPlantId]: prev[currentPlantId].map(node => {
        if (node.id === 'NODE-V104' || node.id === 'NODE-P2-BYPASS-VALVE') {
          return { ...node, status: isolated ? 'closed' : 'nominal', valveOpenPercent: isolated ? 0 : 100, flowLpm: isolated ? 0 : 350 };
        }
        if (node.id === 'NODE-SEG-S05') {
          return { ...node, status: 'nominal', acousticKhz: isolated ? 14.5 : 58.4, pressureBar: isolated ? 0.2 : 4.2 };
        }
        return node;
      })
    }));

    try {
      await fetch(isolated ? '/api/emergency/isolate' : '/api/emergency/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ line: 'Line B' })
      });
    } catch (e) {
      // Local fallback
    }
  }, [currentPlantId]);

  const toggleValveState = useCallback((nodeId: string, aperture?: number) => {
    setNodesMap(prev => ({
      ...prev,
      [currentPlantId]: prev[currentPlantId].map(node => {
        if (node.id === nodeId) {
          if (aperture !== undefined) {
            const isClosed = aperture === 0;
            return {
              ...node,
              status: isClosed ? 'closed' : 'nominal',
              valveOpenPercent: aperture,
              flowLpm: (node.flowLpm || 300) * (aperture / 100)
            };
          }
          const isClosed = node.status === 'closed' || node.valveOpenPercent === 0;
          return {
            ...node,
            status: isClosed ? 'nominal' : 'closed',
            valveOpenPercent: isClosed ? 100 : 0,
            flowLpm: isClosed ? 350 : 0
          };
        }
        return node;
      })
    }));
  }, [currentPlantId]);

  const resolveIncident = useCallback(async () => {
    setLeakSimulationModeState('resolved');
    setIsV104Isolated(false);
    setEmergencyTriggered(false);
    setIsPipelineAutoStopped(false);

    setIncidentsMap(prev => ({
      ...prev,
      [currentPlantId]: prev[currentPlantId].map(inc => {
        if (inc.status === 'Active') {
          return {
            ...inc,
            status: 'Resolved',
            acknowledged: true,
            acknowledgedBy: 'Shift Supervisor (SCADA Auto)',
            acknowledgedAt: new Date().toISOString()
          };
        }
        return inc;
      })
    }));

    setNodesMap(prev => ({
      ...prev,
      [currentPlantId]: prev[currentPlantId].map(node => {
        if (node.id === 'NODE-SEG-S05' || node.id === 'NODE-P2-HX202') {
          return { ...node, status: 'nominal', acousticKhz: 16.0, pressureBar: 4.2 };
        }
        if (node.id === 'NODE-V104' || node.id === 'NODE-P2-BYPASS-VALVE') {
          return { ...node, status: 'nominal', valveOpenPercent: 100 };
        }
        return node;
      })
    }));

    try {
      await fetch('/api/leak/resolve', { method: 'POST' });
    } catch (e) {
      // Local fallback
    }
  }, [currentPlantId]);

  const triggerEmergencyCutoff = useCallback(() => {
    setIsPipelineAutoStopped(true);
    setEmergencyTriggered(true);
    setIsV104Isolated(true);
  }, []);

  const resetSystem = useCallback(() => {
    resolveIncident();
  }, [resolveIncident]);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <TelemetryContext.Provider
      value={{
        currentPlantId,
        setCurrentPlantId,
        currentPlant,
        plants,
        sensors,
        incidents,
        digitalTwinNodes,
        selectedTwinNodeId,
        setSelectedTwinNodeId,
        isV104Isolated,
        isolateLineB,
        toggleValveState,
        emergencyTriggered,
        leakSimulationMode,
        setLeakSimulationMode,
        resolveIncident,
        isPipelineAutoStopped,
        fleetHealthScore,
        systemHealth,
        isConnectedWs,
        notifications,
        dismissNotification,
        activeIncident,
        activeTelemetry,
        telemetry: activeTelemetry,
        triggerEmergencyCutoff,
        resetSystem,
      }}
    >
      {children}
    </TelemetryContext.Provider>
  );
};

export const useTelemetry = (): TelemetryContextType => {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error('useTelemetry must be used within a TelemetryProvider');
  }
  return context;
};
