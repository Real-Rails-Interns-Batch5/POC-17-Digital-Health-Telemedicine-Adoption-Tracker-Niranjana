# Digital Health & Telemedicine Adoption Tracker (POC 2)

An enterprise-grade operational tracking canvas built to visualize regional digital consultation metrics, service delivery streams, and patient satisfaction vectors across clinical hubs.

---

##  1. Project Overview
The **Digital Health & Telemedicine Adoption Tracker** is a state-driven, full-stack reporting interface designed to bridge the gap between raw health records and executive decisions. It provides hospital administrators and regional health departments with instantaneous, real-time metrics detailing service modality distributions, sentiment analytics, and systemic capacity tracking.

##  2. Problem Statement
Modern health ecosystems across the Gulf region generate massive pools of consultation telemetry. However, decision-makers often lack a unified framework to audit digital health scaling patterns. Without real-time visualization platforms, it is difficult to isolate where digital transformation pipelines are succeeding or where legacy in-person tracks are experiencing friction, slowing the optimization of resource allocation.

##  3. Architecture Summary
The application leverages a highly decoupled, modern tech stack designed for local file-system persistence and low-latency state updates:

* **Data Tier:** Local file persistence layer structured inside `data/consultations.json` at the project root folder.
* **Backend Tier (FastAPI + Python):** Provides typed CORS middleware routing pipelines served via Uvicorn. Interacts seamlessly with the root JSON database utilizing absolute file step bounds (`..`) to enable persistent reading and incremental `POST` row appends.
* **Frontend Tier (Next.js + TypeScript + Tailwind CSS):** A responsive full-screen web framework with a premium dark-slate workspace grid. Features a collapsible strategic sidebar pinned exclusively to the **Right Side** using a `flex-row-reverse` container configuration.
* **Visualization Engine (Recharts):** Renders highly responsive, color-mapped multi-series trend lines, market allocation donut splits, and optimized specialty bar charts with non-overlapping slanted category axis labels.

##  4. Setup Instructions

### Prerequisites
Ensure you have **Node.js (v18+)** and **Python (v3.10+)** installed locally.

#### Step A: Run the Backend Data Server
1. Navigate to the backend directory:
   ```bash
   cd backend
2.Activate your python virtual environment:
    .\venv\Scripts\activate
3.Boot the FastAPI engine:
    python -m uvicorn main:app --reload
    
​ Backend endpoint matrix live at: http://127.0.0.1:8000

​ Interactive API docs portal active at: http://127.0.0.1:8000/docs
    
#### Step B: Run the Next.js Web Frontend
1.Open a new terminal window at the project root folder and change into the frontend directory:
     cd frontend
2.Launch the local development pipeline:
     npm run dev

  ​Open your browser and interact with the platform dashboard at: http://localhost:3000
  
## 5. AI Usage Summary
​Artificial Intelligence was integrated as a collaborative peer to accelerate execution, layout alignment, and optimization during Phase 1:
​Visual Optimization: Assisted in drafting Recharts absolute categorical rendering properties (interval={0}, angle={-15}) to completely eliminate typography label overlapping bugs.
​Layout Engineering: Guided the responsive alignment properties to map the management sidebar directly to the right rail, maintaining view stability.
​Environment Resolution: Diagnosed shell path environment breaks (uvicorn not recognized) by introducing clean path scripts via local virtual environments.
​Data Portability: Collaborated on writing the native JavaScript blob compiler to generate filtered local CSV downloads instantly.

## 6. Future Enhancements
​Predictive Telemetry Forecasting: Integrating linear regression models to project next-quarter consultation demand bounds across specialties.
​Granular Patient Cohort Views: Deploying secondary data breakdown rings tracking age group metrics and gender cohorts as requested in advanced briefs.
​Role-Based Access Control (RBAC): Implementing secure OAuth2 authentication layers to separate standard viewing access from management entry forms.  
  
  
     
