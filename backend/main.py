import asyncio
import json
import random
from datetime import datetime
from typing import List

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import engine, Base, get_db
from .models import SensorModel, IncidentModel

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AquaRisk AI Industrial Intelligence API",
    description="Backend microservice for Industrial Water Network monitoring, anomaly detection & SCADA telemetry",
    version="1.0.0"
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed initial database if empty
def seed_database():
    from .database import SessionLocal
    db = SessionLocal()
    try:
        if db.query(SensorModel).count() == 0:
            initial_sensors = [
                SensorModel(id="FIT-101", name="Main Intake Ultrasonic Flowmeter", type="flow", zone="Zone 1 - Main Tank Intake", segment_id="S01", value=482.4, unit="L/min", nominal_min=420.0, nominal_max=520.0, status="nominal"),
                SensorModel(id="PIT-101", name="Discharge Header Pressure Transmitter", type="pressure", zone="Zone 1 - Main Tank Intake", segment_id="S01", value=4.82, unit="Bar", nominal_min=4.2, nominal_max=5.4, status="nominal"),
                SensorModel(id="FIT-201", name="Line A Pre-Treatment Electromagnetic Flowmeter", type="flow", zone="Zone 2 - Line A Pre-Treatment", segment_id="S02", value=285.2, unit="L/min", nominal_min=250.0, nominal_max=320.0, status="nominal"),
                SensorModel(id="AET-305", name="Line B High-Frequency Acoustic Hydrophone", type="acoustic", zone="Zone 3 - Line B High-Pressure Bottling", segment_id="S05", value=58.4, unit="kHz", nominal_min=5.0, nominal_max=25.0, status="critical"),
                SensorModel(id="PIT-305", name="Segment S05 Piezoresistive Pressure Sensor", type="pressure", zone="Zone 3 - Line B High-Pressure Bottling", segment_id="S05", value=2.15, unit="Bar", nominal_min=3.8, nominal_max=4.6, status="critical"),
                SensorModel(id="FIT-306", name="Line B Mass Coriolis Flowmeter", type="flow", zone="Zone 3 - Line B High-Pressure Bottling", segment_id="S06", value=132.8, unit="L/min", nominal_min=180.0, nominal_max=220.0, status="warning"),
                SensorModel(id="VIB-101", name="Intake Booster Pump P-01 Tri-Axial Vibration", type="vibration", zone="Zone 1 - Main Tank Intake", segment_id="P01", value=1.85, unit="mm/s", nominal_min=0.5, nominal_max=3.2, status="nominal"),
                SensorModel(id="AET-401", name="Cooling Tower Return Acoustic Monitor", type="acoustic", zone="Zone 4 - Cooling Towers", segment_id="S07", value=14.2, unit="kHz", nominal_min=5.0, nominal_max=25.0, status="nominal")
            ]
            db.add_all(initial_sensors)

        if db.query(IncidentModel).count() == 0:
            initial_incident = IncidentModel(
                id="INC-2026-089",
                timestamp=datetime.utcnow(),
                location="Line B - High Pressure Bottling Loop (Segment S05)",
                zone="Zone 3 - Line B High-Pressure Bottling",
                segment_id="S05",
                status="Active",
                severity="Critical",
                volume_lost_liters=1420.0,
                financial_impact_inr=73840.0,
                confidence_score=94.8,
                leak_rate_lph=342.4,
                root_cause="Acoustic signature spikes at 58.4 kHz indicative of circumferential pipe wall rupture near flange FLG-305B.",
                automated_actions="Pneumatic valve V-103 throttled to 50% aperture; Alert dispatched to SCADA Station 01",
                acknowledged=False
            )
            db.add(initial_incident)
        db.commit()
    finally:
        db.close()

seed_database()

# In-memory connection manager for WebSockets
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception:
                pass

manager = ConnectionManager()

# REST Endpoints
@app.get("/api/system/status")
def get_system_status():
    return {
        "status": "online",
        "service": "AquaRisk AI Core Telemetry & Prediction Engine",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat(),
        "database": "sqlite_connected",
        "scada_connected": True,
        "active_models": [
            "Acoustic_SpecResNet_v2.4",
            "Hydrodynamic_PressureDecay_v3.1"
        ]
    }

@app.get("/api/sensors")
def get_sensors(db: Session = Depends(get_db)):
    sensors = db.query(SensorModel).all()
    return sensors

@app.get("/api/incidents")
def get_incidents(db: Session = Depends(get_db)):
    incidents = db.query(IncidentModel).all()
    return incidents

@app.post("/api/emergency/isolate")
def trigger_emergency_isolation(line: str = "Line B", db: Session = Depends(get_db)):
    # Update active incident status to Isolated
    incident = db.query(IncidentModel).filter(IncidentModel.id == "INC-2026-089").first()
    if incident:
        incident.status = "Isolated"
        db.commit()

    return {
        "success": True,
        "message": f"SCADA Isolation command dispatched to {line}. Solenoid V-104 tripped closed.",
        "timestamp": datetime.utcnow().isoformat()
    }

# Background streaming generator for WebSocket
@app.websocket("/ws/telemetry")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        accumulated_lost_liters = 1420.0
        while True:
            await asyncio.sleep(2.0)
            
            # Simulate real-time sensor fluctuation
            flow_s01 = round(482.4 + (random.random() - 0.5) * 4.0, 1)
            pressure_s01 = round(4.82 + (random.random() - 0.5) * 0.08, 2)
            acoustic_s05 = round(58.4 + (random.random() - 0.5) * 2.0, 1)
            pressure_s05 = round(2.15 + (random.random() - 0.5) * 0.06, 2)

            # Leak volume accumulation (approx 342 L/hr / 1800 cycles = ~0.19 L per 2 sec)
            accumulated_lost_liters += 0.19
            financial_cost = round(accumulated_lost_liters * 52.0, 0)

            telemetry_payload = {
                "timestamp": datetime.utcnow().isoformat(),
                "systemStatus": "CRITICAL_ALERT",
                "flowRateLpm": flow_s01,
                "pressureBar": pressure_s01,
                "waterLossLph": 342.4,
                "totalLostLiters": round(accumulated_lost_liters, 1),
                "financialBleedInr": financial_cost,
                "leakSensors": [
                    {"sensorId": "FIT-101", "value": flow_s01, "status": "nominal"},
                    {"sensorId": "PIT-101", "value": pressure_s01, "status": "nominal"},
                    {"sensorId": "AET-305", "value": acoustic_s05, "status": "critical"},
                    {"sensorId": "PIT-305", "value": pressure_s05, "status": "critical"}
                ],
                "activeIncidents": [
                    {
                        "id": "INC-2026-089",
                        "status": "Active",
                        "severity": "Critical",
                        "location": "Line B - High Pressure Bottling Loop (Segment S05)",
                        "volumeLostLiters": round(accumulated_lost_liters, 1),
                        "financialImpactInr": financial_cost,
                        "confidenceScore": 94.8
                    }
                ]
            }

            await websocket.send_text(json.dumps(telemetry_payload))
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)
