import os
import json
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="Digital Health Telemetry Core")

# Enable CORS integration hooks for our Next.js client
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crucial Fix: Tells Python to step out of 'backend' and find the 'data' folder at the root
DATA_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "consultations.json")

# Helper utility to read JSON records securely from root data folder
def load_json_records():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r") as file:
        try:
            return json.load(file)
        except json.JSONDecodeError:
            return []

# Helper utility to write JSON records securely to root data folder
def save_json_records(records):
    # Ensure the directory exists if missing
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    with open(DATA_FILE, "w") as file:
        json.dump(records, file, indent=2)

# Input validator model schema matching POC 2 requirements
class ConsultationInput(BaseModel):
    month: str
    region: str
    specialty: str
    volume: int
    type: str
    age_group: str
    gender: str
    nps: int

@app.get("/api/v1/consultations")
def get_consultations(region: Optional[str] = Query(None), type: Optional[str] = Query(None)):
    records = load_json_records()
    filtered_records = records
    
    # Process conditional filter parameters on the live JSON stream
    if region:
        filtered_records = [r for r in filtered_records if r["region"].lower() == region.lower()]
    if type:
        filtered_records = [r for r in filtered_records if r["type"].lower() == type.lower()]
        
    return {"records": filtered_records}

@app.post("/api/v1/consultations")
def create_consultation(payload: ConsultationInput):
    records = load_json_records()
    
    # Generate an incremental dynamic ID index marker
    new_id = max([r["id"] for r in records], default=0) + 1
    
    new_record = {
        "id": new_id,
        "month": payload.month,
        "region": payload.region,
        "specialty": payload.specialty,
        "volume": payload.volume,
        "type": payload.type,
        "age_group": payload.age_group,
        "gender": payload.gender,
        "nps": payload.nps
    }
    
    records.append(new_record)
    save_json_records(records) # Permanently saves entry to root data folder
    
    return {"status": "success", "record": new_record}