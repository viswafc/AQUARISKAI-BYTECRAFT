from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from datetime import datetime
from .database import Base

class SensorModel(Base):
    __tablename__ = "sensors"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False) # flow, pressure, acoustic, vibration, temperature
    zone = Column(String, nullable=False)
    segment_id = Column(String, nullable=False)
    value = Column(Float, default=0.0)
    unit = Column(String, nullable=False)
    nominal_min = Column(Float, nullable=False)
    nominal_max = Column(Float, nullable=False)
    status = Column(String, default="nominal") # nominal, warning, critical
    last_updated = Column(DateTime, default=datetime.utcnow)

class IncidentModel(Base):
    __tablename__ = "incidents"

    id = Column(String, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    location = Column(String, nullable=False)
    zone = Column(String, nullable=False)
    segment_id = Column(String, nullable=False)
    status = Column(String, default="Active") # Active, Investigating, Isolated, Resolved
    severity = Column(String, default="Critical")
    volume_lost_liters = Column(Float, default=0.0)
    financial_impact_inr = Column(Float, default=0.0)
    confidence_score = Column(Float, default=90.0)
    leak_rate_lph = Column(Float, default=0.0)
    root_cause = Column(String, nullable=True)
    automated_actions = Column(String, nullable=True) # JSON or comma-separated
    acknowledged = Column(Boolean, default=False)
    acknowledged_by = Column(String, nullable=True)
    acknowledged_at = Column(DateTime, nullable=True)
