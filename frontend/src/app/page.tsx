"use client";

import React, { useState, useEffect } from "react";
import DashboardCharts from "./components/DashboardCharts";

interface TelemetryRecord {
  id: number;
  month: string;
  region: string;
  specialty: string;
  volume: number;
  type: string;
  age_group: string;
  gender: string;
  nps: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<TelemetryRecord[]>([]);
  const [regionFilter, setRegionFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchMetrics() {
    setLoading(true);
    try {
      let url = "http://127.0.0.1:8000/api/v1/consultations?";
      if (regionFilter) url += `region=${regionFilter}&`;
      if (typeFilter) url += `type=${typeFilter}`;

      const res = await fetch(url);
      const result = await res.json();
      setData(result.records || []);
    } catch (err) {
      console.error("Operational telemetry sync failed:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMetrics();
  }, [regionFilter, typeFilter]);

  const downloadCSV = () => {
    if (data.length === 0) return;
    const headers = ["ID,Month,Region,Specialty,Modality,AgeGroup,Gender,Volume,NPS\n"];
    const rows = data.map(r => `${r.id},${r.month},${r.region},${r.specialty},${r.type},${r.age_group},${r.gender},${r.volume},${r.nps}`).join("\n");
    const blob = new Blob([...headers, rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `telemetry_export_${regionFilter || 'global'}_${typeFilter || 'all'}.csv`);
    a.click();
  };

  const totalVolume = data.reduce((sum, item) => sum + (item.volume || 0), 0);
  const digitalVolume = data
    .filter((item) => item.type?.toLowerCase() === "digital")
    .reduce((sum, item) => sum + (item.volume || 0), 0);
  const digitalShare = totalVolume > 0 ? ((digitalVolume / totalVolume) * 100).toFixed(1) : "0.0";
  const avgNps = data.length > 0 
    ? Math.round(data.reduce((sum, item) => sum + (item.nps || 0), 0) / data.length) 
    : 0;

  return (
    <div className="flex bg-gradient-to-br from-slate-900 via-slate-950 to-zinc-950 min-h-screen text-slate-100 antialiased w-full">
      
      {/* ================= 1. MAIN INTERFACE AREA (LEFT SIDE NOW) ================= */}
      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-800/60">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
              Digital Health & Telemedicine Adoption Tracker
            </h1>
            <p className="text-slate-500 mt-1 text-sm">Real-time regional operational telemetry pipeline</p>
          </div>
          
          {/* Controls Dropdowns */}
          <div className="flex gap-3 mt-4 md:mt-0">
            <select 
              className="px-4 py-2 bg-slate-900/80 border border-slate-800 rounded-lg text-xs font-medium shadow-xl text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 backdrop-blur-sm cursor-pointer transition-all"
              value={regionFilter} 
              onChange={(e) => setRegionFilter(e.target.value)}
            >
              <option value="">Global Regions</option>
              <option value="Riyadh">Riyadh Hub</option>
              <option value="Jeddah">Jeddah Hub</option>
              <option value="Dammam">Dammam Hub</option>
            </select>

            <select 
              className="px-4 py-2 bg-slate-900/80 border border-slate-800 rounded-lg text-xs font-medium shadow-xl text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 backdrop-blur-sm cursor-pointer transition-all"
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">All Modalities</option>
              <option value="digital">Digital Track</option>
              <option value="in-person">In-Person Track</option>
            </select>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/80 shadow-2xl backdrop-blur-md hover:border-slate-700/60 transition-all duration-300 group">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Aggregated System Volume</p>
            <p className="text-4xl font-black text-white mt-3 tracking-tight font-mono">{loading ? "..." : totalVolume.toLocaleString()}</p>
          </div>
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/80 shadow-2xl backdrop-blur-md hover:border-slate-700/60 transition-all duration-300 group">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Digital Share Quotient</p>
            <p className="text-4xl font-black text-emerald-400 mt-3 tracking-tight font-mono">{loading ? "..." : `${digitalShare}%`}</p>
          </div>
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/80 shadow-2xl backdrop-blur-md hover:border-slate-700/60 transition-all duration-300 group">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Running Platform NPS</p>
            <p className="text-4xl font-black text-blue-400 mt-3 tracking-tight font-mono">{loading ? "..." : avgNps}</p>
          </div>
        </div>

        {/* Embedded Charts */}
        <DashboardCharts data={data} />

        {/* Granular Table Grid */}
        <div className="bg-slate-900/30 rounded-2xl border border-slate-800/80 shadow-2xl overflow-hidden backdrop-blur-md">
          <div className="p-6 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-wider text-slate-300 uppercase">Granular Telemetry Stream Logs</h2>
            <span className="text-xs px-2.5 py-1 bg-slate-800 border border-slate-700/60 rounded-md font-mono text-slate-400">Live API Feed</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900/60 text-slate-400 uppercase font-semibold tracking-wider border-b border-slate-800/60">
                  <th className="p-4">Timeline Index</th>
                  <th className="p-4">Operating Region</th>
                  <th className="p-4">Clinical Specialty</th>
                  <th className="p-4">Modality Matrix</th>
                  <th className="p-4">Target Demographics</th>
                  <th className="p-4 text-right">Volume Payload</th>
                  <th className="p-4 text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-slate-300">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-slate-500 font-medium animate-pulse tracking-wide">Synchronizing analytics matrix pipelines...</td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-slate-500 font-medium tracking-wide">No system logging payloads match active filter configurations.</td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors duration-150 group">
                      <td className="p-4 font-bold text-white tracking-wide group-hover:text-emerald-400 transition-colors">{item.month}</td>
                      <td className="p-4 text-slate-400">{item.region}</td>
                      <td className="p-4 font-medium">{item.specialty}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                          item.type === "digital" 
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                            : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="p-4 text-[11px] font-mono text-slate-500">{item.age_group} <span className="opacity-40">|</span> {item.gender}</td>
                      <td className="p-4 text-right font-mono font-bold text-slate-100">{item.volume.toLocaleString()}</td>
                      <td className="p-4 text-right font-mono font-black text-emerald-400">{item.nps}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ================= 2. PREMIUM SIDEBAR FRAME (RIGHT SIDE NOW) ================= */}
      <aside className="w-80 bg-slate-950/60 border-l border-slate-800/80 p-6 flex flex-col justify-between shrink-0 hidden lg:flex sticky top-0 h-screen overflow-y-auto">
        <div className="space-y-6">
          {/* Platform Identity */}
          <div className="border-b border-slate-800/60 pb-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase">System Rails Profile</p>
            </div>
            <h2 className="text-md font-black text-white tracking-wide mt-1">Platform Control Deck</h2>
          </div>

          {/* Strategic Context Sections */}
          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <h3 className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Who Controls This Rail</h3>
              <p className="text-slate-300 leading-relaxed bg-slate-900/40 border border-slate-800/40 p-3 rounded-lg">
                Governed globally under synchronized frameworks mapping directly to Saudi MOH digital compliance layers, UAE DOH telehealth structures, and WHO global tracker specifications.
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Why This Matters</h3>
              <p className="text-slate-300 leading-relaxed bg-slate-900/40 border border-slate-800/40 p-3 rounded-lg">
                Telemedicine is the fastest-growing rail in Gulf healthcare. This system directly enables decision-makers to track operational friction points, audit adoption metrics, and locate exactly where digital transformation is scaling or stalling.
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">System Insights Summary</h3>
              <div className="text-slate-300 bg-slate-900/40 border border-slate-800/40 p-3 rounded-lg space-y-2">
                <p>• <span className="text-emerald-400 font-medium">Digital Reach:</span> Currently tracking {digitalShare}% digital integration across core health nodes.</p>
                <p>• <span className="text-blue-400 font-medium">Sentiment Index:</span> Running satisfaction metrics hold clean margins at {avgNps} NPS baseline.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Widgets Trigger */}
        <div className="pt-4 border-t border-slate-800/60">
          <button 
            onClick={downloadCSV}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-[0.98] text-white font-bold text-xs rounded-lg shadow-lg shadow-emerald-950/20 transition-all group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Export Data (.CSV)
          </button>
        </div>
          </aside>

    </div>
  );
}