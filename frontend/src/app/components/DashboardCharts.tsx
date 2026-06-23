"use client";

import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, Cell, PieChart, Pie } from "recharts";

interface ChartProps {
  data?: any[];
}

export default function DashboardCharts({ data = [] }: ChartProps) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  
  // 1. Modality Trends Dataset
  const trendData = months.map((m) => {
    const digitalVol = data.filter((r) => r && r.month === m && r.type === "digital").reduce((sum, r) => sum + (r.volume || 0), 0);
    const inPersonVol = data.filter((r) => r && r.month === m && r.type === "in-person").reduce((sum, r) => sum + (r.volume || 0), 0);
    
    // Calculate running monthly dynamic NPS scores
    const monthlyRecords = data.filter((r) => r && r.month === m);
    const monthlyNps = monthlyRecords.length > 0
      ? Math.round(monthlyRecords.reduce((sum, r) => sum + (r.nps || 0), 0) / monthlyRecords.length)
      : 0;

    return { name: m, Digital: digitalVol, "In-Person": inPersonVol, "NPS Trend": monthlyNps };
  });

  // 2. Specialty Bar Graph Dataset
  const specialtyMap: { [key: string]: number } = {};
  data.forEach((r) => {
    if (r && r.specialty) {
      specialtyMap[r.specialty] = (specialtyMap[r.specialty] || 0) + (r.volume || 0);
    }
  });
  const barData = Object.keys(specialtyMap).map((key) => ({
    name: key,
    Volume: specialtyMap[key],
  }));

  // 3. Modality Split Share (Donut Chart) Dataset
  const totalDigitalShare = data.filter((r) => r.type === "digital").reduce((sum, r) => sum + (r.volume || 0), 0);
  const totalInPersonShare = data.filter((r) => r.type === "in-person").reduce((sum, r) => sum + (r.volume || 0), 0);
  const donutData = [
    { name: "Digital", value: totalDigitalShare, color: "#10b981" },
    { name: "In-Person", value: totalInPersonShare, color: "#3b82f6" }
  ];

  const PREMIUM_COLORS = ["#10b981", "#3b82f6", "#6366f1", "#f59e0b", "#ec4899"];

  return (
    <div className="space-y-6">
      {/* Top Row: Main Timelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Consultation Trends Panel */}
        <div className="p-6 bg-slate-900/40 rounded-2xl border border-slate-800/80 shadow-xl backdrop-blur-md">
          <h3 className="text-xs font-bold mb-6 text-slate-400 uppercase tracking-widest">Consultation Modality Trends</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", color: "#fff" }} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Line type="monotone" dataKey="Digital" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="In-Person" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* NPS Progression Timeline Panel */}
        <div className="p-6 bg-slate-900/40 rounded-2xl border border-slate-800/80 shadow-xl backdrop-blur-md">
          <h3 className="text-xs font-bold mb-6 text-slate-400 uppercase tracking-widest">Platform Satisfaction Timeline (NPS)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", color: "#fff" }} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Line type="monotone" dataKey="NPS Trend" stroke="#6366f1" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row: Distributions & Split Allocations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {/* Specialty Bar Chart Core */}
        <div className="md:col-span-2 p-6 bg-slate-900/40 rounded-2xl border border-slate-800/80 shadow-xl backdrop-blur-md">
          <h3 className="text-xs font-bold mb-6 text-slate-400 uppercase tracking-widest">Volume Distribution by Specialty</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" interval={0} tick={{ fontSize: 10 }} angle={-15} textAnchor="end" />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", color: "#fff" }} />
                <Bar dataKey="Volume" radius={[6, 6, 0, 0]} maxBarSize={45}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PREMIUM_COLORS[index % PREMIUM_COLORS.length]} opacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Modality Donut Split Share */}
        <div className="p-6 bg-slate-900/40 rounded-2xl border border-slate-800/80 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Modality Market Allocation</h3>
          <div className="h-56 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center pointer-events-none">
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Total Pool</p>
              <p className="text-xl font-black text-white font-mono">
                {(totalDigitalShare + totalInPersonShare).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex justify-center gap-6 text-xs font-semibold pb-2">
            <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /><span className="text-slate-300">Digital</span></div>
            <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500" /><span className="text-slate-300">In-Person</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}