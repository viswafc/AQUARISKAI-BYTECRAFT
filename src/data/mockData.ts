import { Incident, SensorReading, TimelineEvent, DigitalTwinNode, HistoricalDataPoint, ZoneAnalytics, PlantId, PlantInfo, TelemetryPayload } from '../types';

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC-8921',
    timestamp: '2026-09-18 13:19:04 UTC',
    location: 'Line B, Segment S05 (High-Pressure Bottling)',
    zone: 'Zone 3 - Line B High-Pressure Bottling',
    segmentId: 'S05',
    status: 'Active',
    severity: 'Critical',
    volumeLostLiters: 4820,
    financialImpactInr: 41250,
    confidenceScore: 94.8,
    leakRateLph: 342.4,
    rootCause: 'Dynamic pressure hammer induced micro-fissure at flange weld joint S05-W12; acoustic resonance spike at 38.4 kHz.',
    automatedActions: [
      'Triggered automated flow restriction on Upstream Solenoid Valve V-104 (-35% aperture)',
      'Acoustic spectral signature verified against pipe fracture baseline ML model',
      'SMS & Pager alert sent to Shift Supervisor Raman K. & Maintenance Cell B',
      'SCADA setpoint for Booster Pump P-02 dialed down to prevent cavitation'
    ],
    acknowledged: false
  },
  {
    id: 'INC-8918',
    timestamp: '2026-09-17 08:42:15 UTC',
    location: 'Line A, Segment S02 (Pre-Treatment Manifold)',
    zone: 'Zone 2 - Line A Pre-Treatment',
    segmentId: 'S02',
    status: 'Resolved',
    severity: 'Warning',
    volumeLostLiters: 1640,
    financialImpactInr: 13940,
    confidenceScore: 91.2,
    leakRateLph: 185.0,
    rootCause: 'Elastomer gasket degradation due to caustic clean-in-place (CIP) cycle thermal stress.',
    automatedActions: [
      'Bypass line V-101B activated automatically in 8.2 seconds',
      'Work order WO-4491 auto-generated in SAP Plant Maintenance',
      'Gasket replaced during scheduled line pause at 10:15 UTC'
    ],
    acknowledged: true,
    acknowledgedBy: 'Eng. Vikram Sethi',
    acknowledgedAt: '2026-09-17 08:45:10 UTC'
  },
  {
    id: 'INC-8912',
    timestamp: '2026-09-15 22:11:00 UTC',
    location: 'Zone 4 Cooling Tower Return Loop (Segment S07)',
    zone: 'Zone 4 - Cooling Towers',
    segmentId: 'S07',
    status: 'Resolved',
    severity: 'Moderate',
    volumeLostLiters: 2950,
    financialImpactInr: 25075,
    confidenceScore: 88.5,
    leakRateLph: 140.0,
    rootCause: 'Corrosive scale buildup around galvanic coupling node C-07.',
    automatedActions: [
      'Auxiliary recirc pump engaged',
      'Chemical descaler inhibitor dosing valve opened',
      'Coupling clamp affixed by shift technician'
    ],
    acknowledged: true,
    acknowledgedBy: 'Supervisor Anita Deshmukh',
    acknowledgedAt: '2026-09-15 22:15:30 UTC'
  },
  {
    id: 'INC-8905',
    timestamp: '2026-09-13 16:30:20 UTC',
    location: 'Zone 1 Main Reservoir Influx Meter (Segment S01)',
    zone: 'Zone 1 - Main Tank Intake',
    segmentId: 'S01',
    status: 'Resolved',
    severity: 'Low',
    volumeLostLiters: 890,
    financialImpactInr: 7565,
    confidenceScore: 86.0,
    leakRateLph: 75.0,
    rootCause: 'Sealing ring displacement during quarterly intake pressure calibration test.',
    automatedActions: [
      'Intake pressure regulator locked to 2.8 Bar',
      'Manual seal reseating completed'
    ],
    acknowledged: true,
    acknowledgedBy: 'Chief Tech M. Pillai',
    acknowledgedAt: '2026-09-13 16:34:00 UTC'
  },
  {
    id: 'INC-8894',
    timestamp: '2026-09-10 03:15:40 UTC',
    location: 'Line B, Segment S04 (Booster Stage 1)',
    zone: 'Zone 3 - Line B High-Pressure Bottling',
    segmentId: 'S04',
    status: 'Resolved',
    severity: 'Critical',
    volumeLostLiters: 6400,
    financialImpactInr: 54400,
    confidenceScore: 96.1,
    leakRateLph: 410.0,
    rootCause: 'Defective check valve seat causing back-pressure oscillation and wall shear rupture.',
    automatedActions: [
      'Instant automated line cutoff via Valve V-103 within 4.1 seconds',
      'Emergency maintenance team mobilized',
      'Production rerouted to redundant line'
    ],
    acknowledged: true,
    acknowledgedBy: 'Plant Director S. Nambiar',
    acknowledgedAt: '2026-09-10 03:18:00 UTC'
  }
];

export const INITIAL_SENSORS: SensorReading[] = [
  {
    sensorId: 'SEN-FL-01',
    name: 'Main Intake Flow Meter',
    type: 'flow',
    zone: 'Zone 1 - Main Tank Intake',
    segmentId: 'S01',
    value: 620.5,
    unit: 'L/min',
    nominalMin: 500,
    nominalMax: 700,
    status: 'nominal',
    lastUpdated: 'Just now',
    trend: 'stable'
  },
  {
    sensorId: 'SEN-PR-01',
    name: 'Reservoir Pressure Transducer',
    type: 'pressure',
    zone: 'Zone 1 - Main Tank Intake',
    segmentId: 'S01',
    value: 4.6,
    unit: 'Bar',
    nominalMin: 4.0,
    nominalMax: 5.2,
    status: 'nominal',
    lastUpdated: 'Just now',
    trend: 'stable'
  },
  {
    sensorId: 'SEN-FL-02',
    name: 'Line A Bottling Flow Sensor',
    type: 'flow',
    zone: 'Zone 2 - Line A Pre-Treatment',
    segmentId: 'S02',
    value: 285.2,
    unit: 'L/min',
    nominalMin: 250,
    nominalMax: 320,
    status: 'nominal',
    lastUpdated: 'Just now',
    trend: 'stable'
  },
  {
    sensorId: 'SEN-PR-02',
    name: 'Line A Line Pressure Monitor',
    type: 'pressure',
    zone: 'Zone 2 - Line A Pre-Treatment',
    segmentId: 'S03',
    value: 3.4,
    unit: 'Bar',
    nominalMin: 3.0,
    nominalMax: 4.0,
    status: 'nominal',
    lastUpdated: 'Just now',
    trend: 'stable'
  },
  {
    sensorId: 'SEN-FL-03',
    name: 'Line B High-Pressure Flow Meter',
    type: 'flow',
    zone: 'Zone 3 - Line B High-Pressure Bottling',
    segmentId: 'S05',
    value: 395.8,
    unit: 'L/min',
    nominalMin: 280,
    nominalMax: 350,
    status: 'critical',
    lastUpdated: 'Just now',
    trend: 'up'
  },
  {
    sensorId: 'SEN-PR-03',
    name: 'Line B Segment S05 Pressure Drop Sensor',
    type: 'pressure',
    zone: 'Zone 3 - Line B High-Pressure Bottling',
    segmentId: 'S05',
    value: 2.15,
    unit: 'Bar',
    nominalMin: 3.8,
    nominalMax: 4.8,
    status: 'critical',
    lastUpdated: 'Just now',
    trend: 'down'
  },
  {
    sensorId: 'SEN-AC-05',
    name: 'Segment S05 Acoustic Leak Hydrophone',
    type: 'acoustic',
    zone: 'Zone 3 - Line B High-Pressure Bottling',
    segmentId: 'S05',
    value: 58.4,
    unit: 'dB',
    nominalMin: 15,
    nominalMax: 30,
    status: 'critical',
    lastUpdated: 'Just now',
    trend: 'up'
  },
  {
    sensorId: 'SEN-VB-05',
    name: 'Line B Booster Vibration Sensor',
    type: 'vibration',
    zone: 'Zone 3 - Line B High-Pressure Bottling',
    segmentId: 'S04',
    value: 3.85,
    unit: 'mm/s',
    nominalMin: 0.5,
    nominalMax: 2.5,
    status: 'warning',
    lastUpdated: 'Just now',
    trend: 'up'
  },
  {
    sensorId: 'SEN-FL-04',
    name: 'Cooling Loop Return Flow Meter',
    type: 'flow',
    zone: 'Zone 4 - Cooling Towers',
    segmentId: 'S07',
    value: 145.0,
    unit: 'L/min',
    nominalMin: 120,
    nominalMax: 180,
    status: 'nominal',
    lastUpdated: 'Just now',
    trend: 'stable'
  },
  {
    sensorId: 'SEN-PR-04',
    name: 'Cooling Loop Return Pressure',
    type: 'pressure',
    zone: 'Zone 4 - Cooling Towers',
    segmentId: 'S08',
    value: 2.7,
    unit: 'Bar',
    nominalMin: 2.2,
    nominalMax: 3.2,
    status: 'nominal',
    lastUpdated: 'Just now',
    trend: 'stable'
  },
  {
    sensorId: 'SEN-TMP-01',
    name: 'Pre-Treatment Water Temperature',
    type: 'temperature',
    zone: 'Zone 2 - Line A Pre-Treatment',
    segmentId: 'S02',
    value: 21.4,
    unit: '°C',
    nominalMin: 18.0,
    nominalMax: 26.0,
    status: 'nominal',
    lastUpdated: 'Just now',
    trend: 'stable'
  }
];

export const INCIDENT_TIMELINE_STORY: TimelineEvent[] = [
  {
    timeAgo: '15 mins ago',
    timestamp: '13:04:12 UTC',
    title: 'Nominal Operating Baseline',
    description: 'Line B running steady at 310 L/min and 4.2 Bar pressure. Acoustic noise spectrum within quiet baseline band (21.4 dB).',
    stage: 'nominal',
    readings: 'Flow: 310 L/min | Pressure: 4.2 Bar | Acoustic: 21.4 dB'
  },
  {
    timeAgo: '11 mins ago',
    timestamp: '13:08:35 UTC',
    title: 'High-Frequency Acoustic Anomaly',
    description: 'Hydrophone SEN-AC-05 detected ultrasonic hiss peak at 38.4 kHz indicative of turbulent fluid escaping under 4.2 Bar head pressure.',
    stage: 'anomaly',
    readings: 'Flow: 318 L/min | Pressure: 4.1 Bar | Acoustic: 42.8 dB (Spike)'
  },
  {
    timeAgo: '7 mins ago',
    timestamp: '13:12:50 UTC',
    title: 'Flow Differential & Sudden Pressure Drop',
    description: 'Inflow at Manifold Junction J1 surged while downstream delivery pressure dropped sharply by 1.6 Bar, creating an unmetered volumetric sink of 340+ L/hr.',
    stage: 'drop',
    readings: 'Flow: 395 L/min | Pressure: 2.3 Bar (Drop) | Acoustic: 54.1 dB'
  },
  {
    timeAgo: '3 mins ago',
    timestamp: '13:16:15 UTC',
    title: 'AI Anomaly Classifier Confirmed Leak',
    description: 'Multi-sensor temporal fusion model confirmed structural breach at Segment S05 with 94.8% confidence score. Risk flagged as Critical.',
    stage: 'detected',
    readings: 'Loss Rate: 342.4 L/hr | Financial Bleed: ₹28,760/day | Confidence: 94.8%'
  },
  {
    timeAgo: 'Just now',
    timestamp: '13:19:04 UTC',
    title: 'Automated Isolation Advisory Broadcasted',
    description: 'SCADA advisory issued to throttle Valve V-104. Automated work order generated and sent to Duty Engineering team.',
    stage: 'action',
    readings: 'Valve V-104 Throttle Requested | Maintenance Dispatched | Awaiting Ack'
  }
];

export const DIGITAL_TWIN_NODES: DigitalTwinNode[] = [
  {
    id: 'NODE-TANK-01',
    name: 'Primary Reservoir Tank (T-100)',
    type: 'tank',
    line: 'Main',
    status: 'nominal',
    flowLpm: 620.5,
    pressureBar: 4.6,
    acousticKhz: 12.0,
    vibrationMmS: 0.4,
    temperatureC: 21.2,
    healthIndex: 98
  },
  {
    id: 'NODE-PUMP-01',
    name: 'Main Intake Booster Pump (P-01)',
    type: 'pump',
    line: 'Main',
    status: 'nominal',
    flowLpm: 620.5,
    pressureBar: 4.8,
    acousticKhz: 18.5,
    vibrationMmS: 1.2,
    temperatureC: 38.5,
    healthIndex: 94
  },
  {
    id: 'NODE-J1',
    name: 'Primary Distribution Manifold (J-01)',
    type: 'junction',
    line: 'Main',
    status: 'nominal',
    flowLpm: 620.5,
    pressureBar: 4.5,
    acousticKhz: 19.2,
    vibrationMmS: 0.8,
    temperatureC: 21.5,
    healthIndex: 92
  },
  {
    id: 'NODE-V101',
    name: 'Line A Isolation Solenoid (V-101)',
    type: 'valve',
    line: 'Line A',
    status: 'nominal',
    flowLpm: 285.2,
    pressureBar: 3.4,
    acousticKhz: 14.2,
    vibrationMmS: 0.5,
    temperatureC: 21.4,
    healthIndex: 96,
    valveOpenPercent: 100
  },
  {
    id: 'NODE-SEG-S02',
    name: 'Line A Pasteurizer Feed (Segment S02)',
    type: 'segment',
    line: 'Line A',
    status: 'nominal',
    flowLpm: 285.0,
    pressureBar: 3.4,
    acousticKhz: 15.0,
    vibrationMmS: 0.6,
    temperatureC: 22.0,
    healthIndex: 91
  },
  {
    id: 'NODE-TERM-A',
    name: 'Line A Bottling Packaging Station',
    type: 'terminal',
    line: 'Line A',
    status: 'nominal',
    flowLpm: 284.8,
    pressureBar: 3.2,
    acousticKhz: 16.1,
    vibrationMmS: 0.7,
    temperatureC: 22.2,
    healthIndex: 95
  },
  {
    id: 'NODE-V103',
    name: 'Line B Master Supply Valve (V-103)',
    type: 'valve',
    line: 'Line B',
    status: 'warning',
    flowLpm: 395.8,
    pressureBar: 3.8,
    acousticKhz: 28.5,
    vibrationMmS: 2.4,
    temperatureC: 23.1,
    healthIndex: 82,
    valveOpenPercent: 100
  },
  {
    id: 'NODE-SEG-S05',
    name: 'High-Pressure Conveyance (Segment S05)',
    type: 'segment',
    line: 'Line B',
    status: 'critical',
    flowLpm: 395.8,
    pressureBar: 2.15,
    acousticKhz: 58.4,
    vibrationMmS: 4.1,
    temperatureC: 24.8,
    healthIndex: 42
  },
  {
    id: 'NODE-V104',
    name: 'Segment S05 Quick-Isolate Valve (V-104)',
    type: 'valve',
    line: 'Line B',
    status: 'critical',
    flowLpm: 395.0,
    pressureBar: 2.1,
    acousticKhz: 52.0,
    vibrationMmS: 3.8,
    temperatureC: 24.5,
    healthIndex: 78,
    valveOpenPercent: 75
  },
  {
    id: 'NODE-TERM-B',
    name: 'Line B High-Pressure CIP & Filling Terminal',
    type: 'terminal',
    line: 'Line B',
    status: 'warning',
    flowLpm: 215.0,
    pressureBar: 1.8,
    acousticKhz: 22.0,
    vibrationMmS: 1.5,
    temperatureC: 23.0,
    healthIndex: 88
  },
  {
    id: 'NODE-SEG-S07',
    name: 'Cooling Return Loop (Segment S07)',
    type: 'segment',
    line: 'Return',
    status: 'nominal',
    flowLpm: 145.0,
    pressureBar: 2.7,
    acousticKhz: 14.8,
    vibrationMmS: 0.9,
    temperatureC: 28.6,
    healthIndex: 89
  }
];

export const HISTORICAL_30_DAYS: HistoricalDataPoint[] = [
  { date: 'Aug 20', day: 1, expectedLiters: 85000, actualLiters: 85400, leakLiters: 400, financialImpactInr: 3400, hadIncident: false },
  { date: 'Aug 21', day: 2, expectedLiters: 86000, actualLiters: 86200, leakLiters: 200, financialImpactInr: 1700, hadIncident: false },
  { date: 'Aug 22', day: 3, expectedLiters: 84500, actualLiters: 84900, leakLiters: 400, financialImpactInr: 3400, hadIncident: false },
  { date: 'Aug 23', day: 4, expectedLiters: 87000, actualLiters: 92800, leakLiters: 5800, financialImpactInr: 49300, hadIncident: true },
  { date: 'Aug 24', day: 5, expectedLiters: 88000, actualLiters: 88500, leakLiters: 500, financialImpactInr: 4250, hadIncident: false },
  { date: 'Aug 25', day: 6, expectedLiters: 82000, actualLiters: 82300, leakLiters: 300, financialImpactInr: 2550, hadIncident: false },
  { date: 'Aug 26', day: 7, expectedLiters: 78000, actualLiters: 78200, leakLiters: 200, financialImpactInr: 1700, hadIncident: false },
  { date: 'Aug 27', day: 8, expectedLiters: 85000, actualLiters: 85600, leakLiters: 600, financialImpactInr: 5100, hadIncident: false },
  { date: 'Aug 28', day: 9, expectedLiters: 86500, actualLiters: 86900, leakLiters: 400, financialImpactInr: 3400, hadIncident: false },
  { date: 'Aug 29', day: 10, expectedLiters: 88000, actualLiters: 91400, leakLiters: 3400, financialImpactInr: 28900, hadIncident: true },
  { date: 'Aug 30', day: 11, expectedLiters: 87500, actualLiters: 87900, leakLiters: 400, financialImpactInr: 3400, hadIncident: false },
  { date: 'Aug 31', day: 12, expectedLiters: 86000, actualLiters: 86300, leakLiters: 300, financialImpactInr: 2550, hadIncident: false },
  { date: 'Sep 01', day: 13, expectedLiters: 84000, actualLiters: 84400, leakLiters: 400, financialImpactInr: 3400, hadIncident: false },
  { date: 'Sep 02', day: 14, expectedLiters: 89000, actualLiters: 89500, leakLiters: 500, financialImpactInr: 4250, hadIncident: false },
  { date: 'Sep 03', day: 15, expectedLiters: 90000, actualLiters: 90400, leakLiters: 400, financialImpactInr: 3400, hadIncident: false },
  { date: 'Sep 04', day: 16, expectedLiters: 88500, actualLiters: 89100, leakLiters: 600, financialImpactInr: 5100, hadIncident: false },
  { date: 'Sep 05', day: 17, expectedLiters: 87000, actualLiters: 87400, leakLiters: 400, financialImpactInr: 3400, hadIncident: false },
  { date: 'Sep 06', day: 18, expectedLiters: 81000, actualLiters: 81300, leakLiters: 300, financialImpactInr: 2550, hadIncident: false },
  { date: 'Sep 07', day: 19, expectedLiters: 79000, actualLiters: 79200, leakLiters: 200, financialImpactInr: 1700, hadIncident: false },
  { date: 'Sep 08', day: 20, expectedLiters: 86000, actualLiters: 86500, leakLiters: 500, financialImpactInr: 4250, hadIncident: false },
  { date: 'Sep 09', day: 21, expectedLiters: 88000, actualLiters: 94400, leakLiters: 6400, financialImpactInr: 54400, hadIncident: true },
  { date: 'Sep 10', day: 22, expectedLiters: 87000, actualLiters: 87500, leakLiters: 500, financialImpactInr: 4250, hadIncident: false },
  { date: 'Sep 11', day: 23, expectedLiters: 86500, actualLiters: 86800, leakLiters: 300, financialImpactInr: 2550, hadIncident: false },
  { date: 'Sep 12', day: 24, expectedLiters: 85000, actualLiters: 85400, leakLiters: 400, financialImpactInr: 3400, hadIncident: false },
  { date: 'Sep 13', day: 25, expectedLiters: 83000, actualLiters: 83890, leakLiters: 890, financialImpactInr: 7565, hadIncident: true },
  { date: 'Sep 14', day: 26, expectedLiters: 88000, actualLiters: 88500, leakLiters: 500, financialImpactInr: 4250, hadIncident: false },
  { date: 'Sep 15', day: 27, expectedLiters: 89000, actualLiters: 91950, leakLiters: 2950, financialImpactInr: 25075, hadIncident: true },
  { date: 'Sep 16', day: 28, expectedLiters: 87500, actualLiters: 87900, leakLiters: 400, financialImpactInr: 3400, hadIncident: false },
  { date: 'Sep 17', day: 29, expectedLiters: 88000, actualLiters: 89640, leakLiters: 1640, financialImpactInr: 13940, hadIncident: true },
  { date: 'Sep 18', day: 30, expectedLiters: 89500, actualLiters: 94320, leakLiters: 4820, financialImpactInr: 41250, hadIncident: true }
];

export const ZONE_ANALYTICS: ZoneAnalytics[] = [
  {
    zoneId: 'Z3',
    name: 'Zone 3 - Line B High-Pressure Bottling',
    percentage: 48.4,
    volumeLostLiters: 40780,
    financialImpactInr: 346630,
    activeSensors: 4,
    status: 'critical'
  },
  {
    zoneId: 'Z2',
    name: 'Zone 2 - Line A Pre-Treatment & Rinse',
    percentage: 26.1,
    volumeLostLiters: 21990,
    financialImpactInr: 186915,
    activeSensors: 3,
    status: 'warning'
  },
  {
    zoneId: 'Z1',
    name: 'Zone 1 - Main Tank Intake & Filtration',
    percentage: 14.2,
    volumeLostLiters: 11960,
    financialImpactInr: 101660,
    activeSensors: 2,
    status: 'nominal'
  },
  {
    zoneId: 'Z4',
    name: 'Zone 4 - Cooling Towers & Recirculation',
    percentage: 11.3,
    volumeLostLiters: 9520,
    financialImpactInr: 80920,
    activeSensors: 2,
    status: 'nominal'
  }
];

export const PLANTS_CATALOG: PlantInfo[] = [
  {
    id: 'plant-01',
    code: 'MH-BOT-01',
    name: 'Maharashtra Bottling & Beverage Facility',
    shortName: 'Plant 01 (MH)',
    facilityType: 'Rotary Beverage Bottling & High-Pressure CIP',
    location: 'Thane MIDC Industrial Sector, Maharashtra',
    status: 'critical',
    statusLabel: 'CRISIS S05–S06',
    activeIssue: 'Dynamic pressure hammer induced micro-fissure at flange weld S05-W12; 38.4 kHz ultrasonic cavitation spike.',
    activeSegment: 'Line B, Segment S05 (High-Pressure Bottling)',
    capacityM3Day: 1850,
    flowRateNominalLpm: 620.5,
    pressureNominalBar: 4.6,
    activeSensors: 14,
    activeIncidentsCount: 1,
    description: 'High-throughput rotary bottling and thermal pasteurization facility with automated high-pressure clean-in-place (CIP) loops.',
    pipingHighlights: ['DN150 Stainless CIP Header', 'Rotary Filler Manifold J-01', 'Acoustic Hydrophone Array', 'Solenoid V-104 Quick-Isolate']
  },
  {
    id: 'plant-02',
    code: 'GJ-REF-02',
    name: 'Gujarat Petrochem Refine & Utility Complex',
    shortName: 'Plant 02 (GJ)',
    facilityType: 'Heavy Petrochem Refining & Multi-Bank Cooling',
    location: 'Dahej PCPIR Petrochemical Hub, Gujarat',
    status: 'warning',
    statusLabel: 'WARNING HX-202',
    activeIssue: 'Heat Exchanger HX-202 tube-sheet differential pressure cavitation; modulating bypass valve BV-202 stuck at 42% aperture.',
    activeSegment: 'Cooling Bank B, Exchanger HX-202 (Segment S204)',
    capacityM3Day: 4200,
    flowRateNominalLpm: 1450.0,
    pressureNominalBar: 6.8,
    activeSensors: 18,
    activeIncidentsCount: 1,
    description: 'River Narmada intake clarifier with heavy dual-stage booster skid (P-201A/B), multi-tube heat exchanger banks, and catalytic cracker cooling headers.',
    pipingHighlights: ['DN300 Heavy Schedule Carbon Steel', 'Dual-Stage Booster Pump Skid', 'Counter-Current Shell-and-Tube Bank', 'Dual-Chamber Cooling Tower Headers']
  },
  {
    id: 'plant-03',
    code: 'TN-FAB-03',
    name: 'Tamil Nadu Semiconductor Fab UPW Facility',
    shortName: 'Plant 03 (TN)',
    facilityType: '18.2 MΩ·cm Ultra-Pure Water (UPW) Generation',
    location: 'Sriperumbudur Hi-Tech Corridor, Tamil Nadu',
    status: 'critical',
    statusLabel: 'ALERT RO-RACK-02',
    activeIssue: 'Reverse Osmosis Rack-02 permeate coupling elastomer seal displacement; unmetered high-purity filtrate bleed at 9.5 Bar.',
    activeSegment: 'RO Membrane Rack 02 Permeate Header (Segment S305)',
    capacityM3Day: 980,
    flowRateNominalLpm: 480.0,
    pressureNominalBar: 9.5,
    activeSensors: 22,
    activeIncidentsCount: 1,
    description: 'Ultra-clean semiconductor water polishing loop with multi-media pre-treatment, 2-stage spiral-wound RO racks, vacuum membrane degasifier, and 185nm UV TOC oxidizers.',
    pipingHighlights: ['PVDF High-Purity Orbital Piping', 'Dual-Train Spiral RO Pressure Vessels', 'Vacuum Membrane Degasifier Column', 'UV 185nm TOC Photolysis Skid']
  },
  {
    id: 'plant-04',
    code: 'KA-PHA-04',
    name: 'Karnataka Bio-Pharma Sterile WFI Plant',
    shortName: 'Plant 04 (KA)',
    facilityType: 'Sterile Water-For-Injection (WFI) & Pure Steam',
    location: 'Peenya Industrial Estate, Bengaluru, Karnataka',
    status: 'nominal',
    statusLabel: 'NOMINAL 85°C WFI',
    activeIssue: 'All sanitary loops operating within pharmacopoeial specification; continuous 85°C thermal self-sanitizing circulation active.',
    activeSegment: 'Loop S401–S404 (Sanitary Distribution)',
    capacityM3Day: 450,
    flowRateNominalLpm: 210.0,
    pressureNominalBar: 3.2,
    activeSensors: 16,
    activeIncidentsCount: 0,
    description: 'Multi-Effect Distillation Stills (MEDS), clean steam generator, and continuous 85°C closed sanitary recirculating loop in orbital-welded 316L SS.',
    pipingHighlights: ['316L Electropolished Orbital Welded Piping', 'Multi-Effect Distillation Columns', 'Zero-Deadleg Diaphragm Control Valves', 'Double-Tube-Sheet Sanitary Subcoolers']
  }
];

// Nodes map for each plant
export const PLANT_NODES_MAP: Record<PlantId, DigitalTwinNode[]> = {
  'plant-01': DIGITAL_TWIN_NODES,
  'plant-02': [
    {
      id: 'NODE-P2-CLARIFIER',
      name: 'Primary River Clarifier (C-200)',
      type: 'tank',
      line: 'Main',
      status: 'nominal',
      flowLpm: 1450.0,
      pressureBar: 2.2,
      acousticKhz: 11.2,
      vibrationMmS: 0.3,
      temperatureC: 24.1,
      healthIndex: 96
    },
    {
      id: 'NODE-P2-PUMP-A',
      name: 'Duty Booster Pump (P-201A)',
      type: 'pump',
      line: 'Main',
      status: 'nominal',
      flowLpm: 880.0,
      pressureBar: 6.8,
      acousticKhz: 22.4,
      vibrationMmS: 1.8,
      temperatureC: 44.5,
      healthIndex: 92
    },
    {
      id: 'NODE-P2-PUMP-B',
      name: 'Standby Booster Pump (P-201B)',
      type: 'pump',
      line: 'Main',
      status: 'nominal',
      flowLpm: 570.0,
      pressureBar: 6.8,
      acousticKhz: 21.0,
      vibrationMmS: 1.5,
      temperatureC: 41.2,
      healthIndex: 95
    },
    {
      id: 'NODE-P2-MANIFOLD',
      name: 'High-Pressure Splitter Manifold (M-201)',
      type: 'junction',
      line: 'Main',
      status: 'nominal',
      flowLpm: 1450.0,
      pressureBar: 6.6,
      acousticKhz: 24.0,
      vibrationMmS: 1.1,
      temperatureC: 25.0,
      healthIndex: 94
    },
    {
      id: 'NODE-P2-HX201',
      name: 'Primary Exchanger Bank (HX-201)',
      type: 'segment',
      line: 'Line A',
      status: 'nominal',
      flowLpm: 720.0,
      pressureBar: 5.8,
      acousticKhz: 18.5,
      vibrationMmS: 0.9,
      temperatureC: 38.4,
      healthIndex: 94
    },
    {
      id: 'NODE-P2-HX202',
      name: 'Secondary Exchanger Bank (HX-202)',
      type: 'segment',
      line: 'Line B',
      status: 'warning',
      flowLpm: 510.0,
      pressureBar: 3.9,
      acousticKhz: 49.2,
      vibrationMmS: 3.6,
      temperatureC: 56.2,
      healthIndex: 61
    },
    {
      id: 'NODE-P2-BYPASS-VALVE',
      name: 'Modulating Bypass Valve (BV-202)',
      type: 'valve',
      line: 'Line B',
      status: 'warning',
      flowLpm: 220.0,
      pressureBar: 4.1,
      acousticKhz: 36.8,
      vibrationMmS: 2.7,
      temperatureC: 48.0,
      healthIndex: 68,
      valveOpenPercent: 42
    },
    {
      id: 'NODE-P2-COOLING-TOWER',
      name: 'Catalytic Cooling Tower Bank (CT-201/202)',
      type: 'terminal',
      line: 'Line A',
      status: 'nominal',
      flowLpm: 1210.0,
      pressureBar: 4.4,
      acousticKhz: 19.5,
      vibrationMmS: 1.2,
      temperatureC: 32.0,
      healthIndex: 91
    },
    {
      id: 'NODE-P2-CONDENSATE-RETURN',
      name: 'Hot Condensate Recirculation Loop (S-208)',
      type: 'terminal',
      line: 'Return',
      status: 'nominal',
      flowLpm: 240.0,
      pressureBar: 2.8,
      acousticKhz: 15.0,
      vibrationMmS: 0.8,
      temperatureC: 46.5,
      healthIndex: 93
    }
  ],
  'plant-03': [
    {
      id: 'NODE-P3-RAW-TANK',
      name: 'Pre-Treatment Raw Surge Tank (T-301)',
      type: 'tank',
      line: 'Main',
      status: 'nominal',
      flowLpm: 480.0,
      pressureBar: 2.4,
      acousticKhz: 9.8,
      vibrationMmS: 0.2,
      temperatureC: 22.0,
      healthIndex: 99
    },
    {
      id: 'NODE-P3-SAND-FILTER',
      name: 'Dual Multi-Media Sand Bed (MMF-301)',
      type: 'segment',
      line: 'Main',
      status: 'nominal',
      flowLpm: 480.0,
      pressureBar: 3.8,
      acousticKhz: 14.5,
      vibrationMmS: 0.6,
      temperatureC: 22.1,
      healthIndex: 97
    },
    {
      id: 'NODE-P3-HP-PUMP',
      name: 'High-Pressure RO Feed Pump (P-302)',
      type: 'pump',
      line: 'Main',
      status: 'nominal',
      flowLpm: 480.0,
      pressureBar: 9.5,
      acousticKhz: 26.5,
      vibrationMmS: 1.4,
      temperatureC: 32.4,
      healthIndex: 93
    },
    {
      id: 'NODE-P3-RO-RACK1',
      name: 'Primary RO Membrane Rack-01 (Permeate)',
      type: 'segment',
      line: 'Line A',
      status: 'nominal',
      flowLpm: 240.0,
      pressureBar: 8.4,
      acousticKhz: 16.2,
      vibrationMmS: 0.5,
      temperatureC: 23.0,
      healthIndex: 98
    },
    {
      id: 'NODE-P3-RO-RACK2',
      name: 'Secondary RO Membrane Rack-02 (Permeate Fissure)',
      type: 'segment',
      line: 'Line B',
      status: 'critical',
      flowLpm: 240.0,
      pressureBar: 6.2,
      acousticKhz: 62.8,
      vibrationMmS: 4.5,
      temperatureC: 26.8,
      healthIndex: 38
    },
    {
      id: 'NODE-P3-DEGASIFIER',
      name: 'Vacuum Membrane Degasifier (VMD-301)',
      type: 'segment',
      line: 'Line A',
      status: 'nominal',
      flowLpm: 238.0,
      pressureBar: 3.1,
      acousticKhz: 13.0,
      vibrationMmS: 0.4,
      temperatureC: 22.5,
      healthIndex: 96
    },
    {
      id: 'NODE-P3-UV-TOC',
      name: '185nm UV TOC Photolysis Chamber (UV-301)',
      type: 'segment',
      line: 'Line A',
      status: 'nominal',
      flowLpm: 235.0,
      pressureBar: 2.9,
      acousticKhz: 11.5,
      vibrationMmS: 0.3,
      temperatureC: 23.2,
      healthIndex: 97
    },
    {
      id: 'NODE-P3-EDI-POLISHER',
      name: 'Continuous Electro-Deionization (EDI-301)',
      type: 'valve',
      line: 'Line A',
      status: 'nominal',
      flowLpm: 230.0,
      pressureBar: 2.8,
      acousticKhz: 12.0,
      vibrationMmS: 0.4,
      temperatureC: 23.0,
      healthIndex: 99,
      valveOpenPercent: 100
    },
    {
      id: 'NODE-P3-WAFER-FAB',
      name: 'Cleanroom Fab Wafer Rinse Distribution Terminal',
      type: 'terminal',
      line: 'Line A',
      status: 'nominal',
      flowLpm: 225.0,
      pressureBar: 2.5,
      acousticKhz: 14.0,
      vibrationMmS: 0.4,
      temperatureC: 23.0,
      healthIndex: 98
    }
  ],
  'plant-04': [
    {
      id: 'NODE-P4-FEED-TANK',
      name: 'Pre-Treated Feed Tank (T-401)',
      type: 'tank',
      line: 'Main',
      status: 'nominal',
      flowLpm: 210.0,
      pressureBar: 2.8,
      acousticKhz: 10.5,
      vibrationMmS: 0.2,
      temperatureC: 22.0,
      healthIndex: 99
    },
    {
      id: 'NODE-P4-MEDS-STILL',
      name: 'Multi-Effect Distillation Column (MEDS-401)',
      type: 'segment',
      line: 'Main',
      status: 'nominal',
      flowLpm: 210.0,
      pressureBar: 4.2,
      acousticKhz: 16.0,
      vibrationMmS: 0.7,
      temperatureC: 98.5,
      healthIndex: 98
    },
    {
      id: 'NODE-P4-WFI-STORAGE',
      name: 'Sterile 85°C WFI Insulated Vessel (T-402)',
      type: 'tank',
      line: 'Main',
      status: 'nominal',
      flowLpm: 210.0,
      pressureBar: 3.5,
      acousticKhz: 11.0,
      vibrationMmS: 0.3,
      temperatureC: 85.2,
      healthIndex: 99
    },
    {
      id: 'NODE-P4-SANITARY-PUMP',
      name: 'Sanitary Mag-Drive Recirc Pump (P-401)',
      type: 'pump',
      line: 'Main',
      status: 'nominal',
      flowLpm: 210.0,
      pressureBar: 3.4,
      acousticKhz: 17.5,
      vibrationMmS: 0.8,
      temperatureC: 85.0,
      healthIndex: 97
    },
    {
      id: 'NODE-P4-DIAPHRAGM-VLV',
      name: 'Sanitary Zero-Deadleg Control Valve (DV-401)',
      type: 'valve',
      line: 'Line A',
      status: 'nominal',
      flowLpm: 208.0,
      pressureBar: 3.2,
      acousticKhz: 12.0,
      vibrationMmS: 0.4,
      temperatureC: 84.8,
      healthIndex: 99,
      valveOpenPercent: 100
    },
    {
      id: 'NODE-P4-SUBCOOLER',
      name: 'Double-Tube-Sheet Subcooler (HX-401)',
      type: 'segment',
      line: 'Line A',
      status: 'nominal',
      flowLpm: 120.0,
      pressureBar: 3.0,
      acousticKhz: 13.5,
      vibrationMmS: 0.5,
      temperatureC: 25.0,
      healthIndex: 98
    },
    {
      id: 'NODE-P4-STERILE-LOOP',
      name: '316L Orbital-Welded Return Loop (S-401)',
      type: 'segment',
      line: 'Return',
      status: 'nominal',
      flowLpm: 90.0,
      pressureBar: 2.8,
      acousticKhz: 12.5,
      vibrationMmS: 0.3,
      temperatureC: 84.2,
      healthIndex: 99
    },
    {
      id: 'NODE-P4-FILLING-SUITE',
      name: 'Aseptic Injectable Vial Filling Suite (Grade A)',
      type: 'terminal',
      line: 'Line A',
      status: 'nominal',
      flowLpm: 118.0,
      pressureBar: 2.9,
      acousticKhz: 14.0,
      vibrationMmS: 0.3,
      temperatureC: 24.5,
      healthIndex: 99
    }
  ]
};

// Telemetry overview per plant
export const PLANT_TELEMETRY_MAP: Record<PlantId, TelemetryPayload> = {
  'plant-01': {
    timestamp: new Date().toISOString(),
    activeLeak: {
      incidentId: 'INC-8921',
      location: 'Line B, Segment S05 (High-Pressure Bottling)',
      segmentId: 'S05',
      severity: 'Critical',
      confidenceScore: 94.8,
      currentLossRateLph: 342.4,
      projected24hLossLiters: 8217,
      financialBleedInrPerDay: 28760,
      detectedAt: '13:16:15 UTC'
    },
    sensors: INITIAL_SENSORS,
    systemStatus: {
      backend: 'online',
      database: 'online',
      mlEngine: 'online',
      webSockets: 'online',
      latencyMs: 14,
      connectedClients: 8,
      uptimeSeconds: 432900
    }
  },
  'plant-02': {
    timestamp: new Date().toISOString(),
    activeLeak: {
      incidentId: 'INC-9042',
      location: 'Cooling Bank B, Exchanger HX-202 (Segment S204)',
      segmentId: 'S204',
      severity: 'Warning',
      confidenceScore: 89.2,
      currentLossRateLph: 512.0,
      projected24hLossLiters: 12288,
      financialBleedInrPerDay: 36864,
      detectedAt: '09:44:20 UTC'
    },
    sensors: [
      {
        sensorId: 'SEN-P2-FL01',
        name: 'River Intake Main Magmeter',
        type: 'flow',
        zone: 'Zone 1 - Intake Clarifier',
        segmentId: 'S201',
        value: 1450.0,
        unit: 'L/min',
        nominalMin: 1200,
        nominalMax: 1600,
        status: 'nominal',
        lastUpdated: 'Just now',
        trend: 'stable'
      },
      {
        sensorId: 'SEN-P2-PR01',
        name: 'Booster Pump Discharge Pressure',
        type: 'pressure',
        zone: 'Zone 2 - Booster Skid',
        segmentId: 'S202',
        value: 6.8,
        unit: 'Bar',
        nominalMin: 6.0,
        nominalMax: 7.5,
        status: 'nominal',
        lastUpdated: 'Just now',
        trend: 'stable'
      },
      {
        sensorId: 'SEN-P2-DP02',
        name: 'HX-202 Tube-Sheet Differential Pressure',
        type: 'pressure',
        zone: 'Zone 3 - Cooling Bank B',
        segmentId: 'S204',
        value: 2.9,
        unit: 'Bar',
        nominalMin: 0.8,
        nominalMax: 1.8,
        status: 'critical',
        lastUpdated: 'Just now',
        trend: 'up'
      },
      {
        sensorId: 'SEN-P2-AC04',
        name: 'HX-202 Ultrasonic Cavitation Hydrophone',
        type: 'acoustic',
        zone: 'Zone 3 - Cooling Bank B',
        segmentId: 'S204',
        value: 49.2,
        unit: 'dB',
        nominalMin: 15,
        nominalMax: 28,
        status: 'warning',
        lastUpdated: 'Just now',
        trend: 'up'
      }
    ],
    systemStatus: {
      backend: 'online',
      database: 'online',
      mlEngine: 'online',
      webSockets: 'online',
      latencyMs: 16,
      connectedClients: 12,
      uptimeSeconds: 842000
    }
  },
  'plant-03': {
    timestamp: new Date().toISOString(),
    activeLeak: {
      incidentId: 'INC-9118',
      location: 'RO Membrane Rack 02 Permeate Header (Segment S305)',
      segmentId: 'S305',
      severity: 'Critical',
      confidenceScore: 96.4,
      currentLossRateLph: 198.5,
      projected24hLossLiters: 4764,
      financialBleedInrPerDay: 57168, // UPW is expensive (Rs 120/m3)
      detectedAt: '11:02:48 UTC'
    },
    sensors: [
      {
        sensorId: 'SEN-P3-FL01',
        name: 'Raw Water Feed Magmeter',
        type: 'flow',
        zone: 'Zone 1 - Pre-Treatment',
        segmentId: 'S301',
        value: 480.0,
        unit: 'L/min',
        nominalMin: 400,
        nominalMax: 550,
        status: 'nominal',
        lastUpdated: 'Just now',
        trend: 'stable'
      },
      {
        sensorId: 'SEN-P3-PR02',
        name: 'RO Skid Feed High-Pressure Sensor',
        type: 'pressure',
        zone: 'Zone 2 - RO High-Pressure',
        segmentId: 'S303',
        value: 9.5,
        unit: 'Bar',
        nominalMin: 8.5,
        nominalMax: 10.5,
        status: 'nominal',
        lastUpdated: 'Just now',
        trend: 'stable'
      },
      {
        sensorId: 'SEN-P3-AC02',
        name: 'RO Rack-02 Acoustic Permeate Sensor',
        type: 'acoustic',
        zone: 'Zone 2 - RO High-Pressure',
        segmentId: 'S305',
        value: 62.8,
        unit: 'dB',
        nominalMin: 12,
        nominalMax: 22,
        status: 'critical',
        lastUpdated: 'Just now',
        trend: 'up'
      },
      {
        sensorId: 'SEN-P3-TOC01',
        name: 'Fab Delivery TOC & Resistivity Analyzer',
        type: 'temperature',
        zone: 'Zone 4 - Wafer Fab',
        segmentId: 'S308',
        value: 18.2,
        unit: 'MΩ·cm',
        nominalMin: 18.0,
        nominalMax: 18.3,
        status: 'nominal',
        lastUpdated: 'Just now',
        trend: 'stable'
      }
    ],
    systemStatus: {
      backend: 'online',
      database: 'online',
      mlEngine: 'online',
      webSockets: 'online',
      latencyMs: 12,
      connectedClients: 6,
      uptimeSeconds: 1204000
    }
  },
  'plant-04': {
    timestamp: new Date().toISOString(),
    activeLeak: {
      incidentId: 'INC-NOMINAL',
      location: 'No active breaches detected across 316L sanitary distribution loop',
      segmentId: 'S401',
      severity: 'Low',
      confidenceScore: 99.1,
      currentLossRateLph: 0.0,
      projected24hLossLiters: 0,
      financialBleedInrPerDay: 0,
      detectedAt: '12:00:00 UTC',
      isIsolated: true
    },
    sensors: [
      {
        sensorId: 'SEN-P4-TMP01',
        name: 'WFI Loop Main Return Temperature',
        type: 'temperature',
        zone: 'Zone 2 - Sterile WFI Loop',
        segmentId: 'S402',
        value: 85.2,
        unit: '°C',
        nominalMin: 80.0,
        nominalMax: 90.0,
        status: 'nominal',
        lastUpdated: 'Just now',
        trend: 'stable'
      },
      {
        sensorId: 'SEN-P4-PR01',
        name: 'Sanitary Mag-Drive Discharge Pressure',
        type: 'pressure',
        zone: 'Zone 2 - Sterile WFI Loop',
        segmentId: 'S402',
        value: 3.4,
        unit: 'Bar',
        nominalMin: 3.0,
        nominalMax: 3.8,
        status: 'nominal',
        lastUpdated: 'Just now',
        trend: 'stable'
      },
      {
        sensorId: 'SEN-P4-FL01',
        name: 'Aseptic Filling Feed Flow Rate',
        type: 'flow',
        zone: 'Zone 3 - Aseptic Filling Suite',
        segmentId: 'S404',
        value: 118.0,
        unit: 'L/min',
        nominalMin: 100,
        nominalMax: 130,
        status: 'nominal',
        lastUpdated: 'Just now',
        trend: 'stable'
      }
    ],
    systemStatus: {
      backend: 'online',
      database: 'online',
      mlEngine: 'online',
      webSockets: 'online',
      latencyMs: 15,
      connectedClients: 5,
      uptimeSeconds: 612000
    }
  }
};

// Incidents per plant
export const PLANT_INCIDENTS_MAP: Record<PlantId, Incident[]> = {
  'plant-01': INITIAL_INCIDENTS,
  'plant-02': [
    {
      id: 'INC-9042',
      timestamp: '2026-09-18 09:44:20 UTC',
      location: 'Cooling Bank B, Exchanger HX-202 (Segment S204)',
      zone: 'Zone 3 - Cooling Bank B',
      segmentId: 'S204',
      status: 'Active',
      severity: 'Warning',
      volumeLostLiters: 3840,
      financialImpactInr: 27600,
      confidenceScore: 89.2,
      leakRateLph: 512.0,
      rootCause: 'Shell-and-tube heat exchanger HX-202 differential pressure surge; modulating bypass valve BV-202 actuator stuck at 42%.',
      automatedActions: [
        'Automated bypass throttling command sent to SCADA PLC-04',
        'Auxiliary cooling pump P-201B engaged to maintain 6.8 Bar header pressure',
        'Technician alert dispatched to Dahej Utilities Cell'
      ],
      acknowledged: false
    },
    {
      id: 'INC-9014',
      timestamp: '2026-09-14 11:20:00 UTC',
      location: 'Intake Clarifier C-200 Sludge Blowdown (Segment S201)',
      zone: 'Zone 1 - Intake Clarifier',
      segmentId: 'S201',
      status: 'Resolved',
      severity: 'Moderate',
      volumeLostLiters: 5200,
      financialImpactInr: 15600,
      confidenceScore: 92.0,
      leakRateLph: 260.0,
      rootCause: 'Sludge rake arm hydraulic seal wept during river monsoon silt surge.',
      automatedActions: [
        'Backwash cycle frequency increased by 20%',
        'Polymer dosing adjusted by SCADA loop',
        'Hydraulic seal gland re-torqued'
      ],
      acknowledged: true,
      acknowledgedBy: 'Chief Eng. Harish Patel',
      acknowledgedAt: '2026-09-14 11:32:00 UTC'
    }
  ],
  'plant-03': [
    {
      id: 'INC-9118',
      timestamp: '2026-09-18 11:02:48 UTC',
      location: 'RO Membrane Rack 02 Permeate Header (Segment S305)',
      zone: 'Zone 2 - RO High-Pressure',
      segmentId: 'S305',
      status: 'Active',
      severity: 'Critical',
      volumeLostLiters: 2180,
      financialImpactInr: 52320,
      confidenceScore: 96.4,
      leakRateLph: 198.5,
      rootCause: 'Elastomer coupling gasket dislocation on high-pressure permeate interconnect (9.5 Bar). Hydrophone detected 62.8 dB acoustic vibration.',
      automatedActions: [
        'Diverted 50% flow to parallel RO Rack-01',
        'Vacuum degasifier downstream vacuum boost engaged',
        'Cleanroom Fab engineering alert triggered'
      ],
      acknowledged: false
    },
    {
      id: 'INC-9092',
      timestamp: '2026-09-12 18:15:30 UTC',
      location: 'Pre-Treatment Multi-Media Filter (MMF-301)',
      zone: 'Zone 1 - Pre-Treatment',
      segmentId: 'S301',
      status: 'Resolved',
      severity: 'Low',
      volumeLostLiters: 920,
      financialImpactInr: 11040,
      confidenceScore: 94.0,
      leakRateLph: 85.0,
      rootCause: 'Differential pressure transmitter DP-301 zero-point drift.',
      automatedActions: [
        'Auto-calibrated DP sensor with secondary reference transmitter',
        'Filter backwash executed successfully'
      ],
      acknowledged: true,
      acknowledgedBy: 'Lead Tech S. Sundaram',
      acknowledgedAt: '2026-09-12 18:22:15 UTC'
    }
  ],
  'plant-04': [
    {
      id: 'INC-8820',
      timestamp: '2026-09-08 14:05:00 UTC',
      location: 'Subcooler HX-401 Chilled Water Interface (Segment S403)',
      zone: 'Zone 2 - Sterile WFI Loop',
      segmentId: 'S403',
      status: 'Resolved',
      severity: 'Warning',
      volumeLostLiters: 420,
      financialImpactInr: 12600,
      confidenceScore: 91.5,
      leakRateLph: 60.0,
      rootCause: 'Double tube-sheet weep hole detected minor glycol trace from secondary cooling circuit.',
      automatedActions: [
        'Subcooler automatically isolated via pneumatic diaphragm valves',
        'Full CIP/SIP thermal sanitization cycle executed at 121°C',
        'Tube sheet re-expanded and validated by QA'
      ],
      acknowledged: true,
      acknowledgedBy: 'QA Manager Dr. Pradeep Rao',
      acknowledgedAt: '2026-09-08 14:15:00 UTC'
    }
  ]
};

export const PLANT_SENSORS_MAP: Record<PlantId, SensorReading[]> = {
  'plant-01': INITIAL_SENSORS,
  'plant-02': PLANT_TELEMETRY_MAP['plant-02'].sensors,
  'plant-03': PLANT_TELEMETRY_MAP['plant-03'].sensors,
  'plant-04': PLANT_TELEMETRY_MAP['plant-04'].sensors,
};

