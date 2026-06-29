// import React, { useState, useEffect } from "react";
// import "./Dashboard_for_host.css";
// import { ALL_EVENTS, fillPct, convRate } from "./MyEvents";

// /* ─────────────────────────────────────────
//    HELPERS
// ───────────────────────────────────────── */
// function useCountUp(target, duration = 900) {
//   const [val, setVal] = useState(0);
//   useEffect(() => {
//     let start = 0;
//     const step = target / (duration / 16);
//     const t = setInterval(() => {
//       start += step;
//       if (start >= target) {
//         setVal(target);
//         clearInterval(t);
//       } else {
//         setVal(Math.floor(start));
//       }
//     }, 16);
//     return () => clearInterval(t);
//   }, [target]);
//   return val;
// }

// /* ─────────────────────────────────────────
//    METRIC CARD
// ───────────────────────────────────────── */
// const MetricCard = ({ label, value, change, positive, icon, color, small }) => (
//   <div
//     className={`hd-metric-card${small ? " hd-metric-card--sm" : ""}`}
//     style={{ "--card-accent": color }}
//   >
//     <div className="hd-metric-top">
//       <span className="hd-metric-label">{label}</span>
//       <span className="hd-metric-icon">{icon}</span>
//     </div>
//     <div className={`hd-metric-value${small ? " hd-metric-value--sm" : ""}`}>{value}</div>
//     {change && (
//       <span className={`hd-metric-change ${positive ? "hd-positive" : "hd-negative"}`}>
//         {change}
//       </span>
//     )}
//   </div>
// );

// /* ─────────────────────────────────────────
//    ANALYTICS PANEL
// ───────────────────────────────────────── */
// const AnalyticsPanel = ({ events, title, sub }) => {
//   const totalRevenue   = events.reduce((s, e) => s + e.revenue, 0);
//   const totalAttendees = events.reduce((s, e) => s + e.registered, 0);
//   const totalViews     = events.reduce((s, e) => s + e.detailViews, 0);
//   const totalVisits    = events.reduce((s, e) => s + e.siteVisits, 0);
//   const totalCapacity  = events.reduce((s, e) => s + e.capacity, 0);
//   const overallConv    = totalViews  ? ((totalAttendees / totalViews)  * 100).toFixed(1) : "0.0";
//   const overallEng     = totalVisits ? ((totalViews     / totalVisits) * 100).toFixed(1) : "0.0";
//   const avgTicket      = events.length
//     ? Math.round(events.reduce((s, e) => s + e.ticketPrice, 0) / events.length)
//     : 0;
//   const activeCount = events.filter((e) => e.status === "active").length;

//   // repeat attendees: names appearing in 2+ events
//   const nameCounts = {};
//   events.forEach((e) =>
//     e.attendees.forEach((a) => {
//       nameCounts[a.name] = (nameCounts[a.name] || 0) + 1;
//     })
//   );
//   const repeatCount = Object.values(nameCounts).filter((c) => c > 1).length;
//   const totalUnique = Object.keys(nameCounts).length;
//   const repeatPct   = totalUnique ? ((repeatCount / totalUnique) * 100).toFixed(1) : "0.0";

//   const barEvents = events.slice(-8);
//   const animRev   = useCountUp(totalRevenue);
//   const animAtt   = useCountUp(totalAttendees);

//   return (
//     <div className="hd-analytics-panel">
//       {title && (
//         <div className="hd-section-header">
//           <h2 className="hd-section-title">{title}</h2>
//           <p className="hd-section-sub">{sub}</p>
//         </div>
//       )}

//       {/* Primary KPIs */}
//       <div className="hd-metrics-grid">
//         <MetricCard label="Total Revenue"   value={`$${animRev.toLocaleString()}`} change="+14.2%" positive icon="💰" color="var(--accent)" />
//         <MetricCard label="Total Attendees" value={animAtt.toLocaleString()}        change="+8.7%"  positive icon="👥" color="#3b82f6" />
//         <MetricCard label="Conversion Rate" value={`${overallConv}%`}              change="-1.2%"  positive={false} icon="📈" color="#f97316" />
//         <MetricCard label="Avg. Engagement" value={`${overallEng}%`}               change="+2.4%"  positive icon="⚡" color="#a855f7" />
//       </div>

//       {/* Secondary KPIs */}
//       <div className="hd-metrics-grid hd-metrics-grid--4" style={{ marginTop: 14 }}>
//         <MetricCard label="Active Events"    value={String(activeCount)}           icon="🎯" color="#10b981" small />
//         <MetricCard label="Repeat Attendees" value={`${repeatPct}%`}              icon="🔁" color="#f59e0b" small />
//         <MetricCard label="Avg Ticket Price" value={`$${avgTicket}`}              icon="🎟️" color="#ec4899" small />
//         <MetricCard
//           label="Capacity Fill"
//           value={`${totalCapacity ? Math.round((totalAttendees / totalCapacity) * 100) : 0}%`}
//           icon="📊"
//           color="#6366f1"
//           small
//         />
//       </div>

//       {/* Charts Row */}
//       <div className="hd-charts-row" style={{ marginTop: 14 }}>
//         {/* Registration vs Capacity Bar Chart */}
//         <div className="hd-card hd-chart-card">
//           <div className="hd-chart-header">
//             <div>
//               <h3 className="hd-card-title">Registration vs Capacity</h3>
//               <p className="hd-card-sub">Registered out of total openings per event</p>
//             </div>
//             <span className="hd-badge">Per Event</span>
//           </div>
//           <div className="hd-bar-chart">
//             {barEvents.map((e, i) => (
//               <div className="hd-bar-wrap" key={i} title={e.name}>
//                 <div className="hd-bar hd-bar--bg" style={{ height: "100%" }} />
//                 <div
//                   className={`hd-bar hd-bar--fg ${fillPct(e) >= 90 ? "hd-bar--active" : ""}`}
//                   style={{ height: `${fillPct(e)}%` }}
//                 />
//               </div>
//             ))}
//           </div>
//           <div className="hd-chart-labels">
//             {barEvents.map((e, i) => (
//               <span key={i} className="hd-chart-label" title={e.name}>
//                 {e.name.split(" ")[0]}
//               </span>
//             ))}
//           </div>
//           <div className="hd-chart-legend">
//             <span className="hd-legend-dot hd-legend-dot--active" /> Registered
//             <span className="hd-legend-dot" style={{ marginLeft: 14 }} /> Capacity
//           </div>
//         </div>

//         {/* Recent Registrations */}
//         <div className="hd-card hd-registrations-card">
//           <h3 className="hd-card-title">Recent Registrations</h3>
//           <div className="hd-reg-list">
//             {events
//               .flatMap((e) => e.attendees.map((a) => ({ ...a, event: e.name })))
//               .slice(0, 5)
//               .map((r, i) => (
//                 <div className="hd-reg-item" key={i}>
//                   <div className="hd-reg-avatar">{r.avatar}</div>
//                   <div className="hd-reg-info">
//                     <span className="hd-reg-name">{r.name}</span>
//                     <span className="hd-reg-event">{r.event}</span>
//                   </div>
//                   <span className="hd-reg-time">{r.joined}</span>
//                 </div>
//               ))}
//           </div>
//           <button className="hd-link-btn">View all registrations →</button>
//         </div>
//       </div>

//       {/* Top Events Table */}
//       <div className="hd-card hd-table-card" style={{ marginTop: 14 }}>
//         <h3 className="hd-card-title">
//           Top Performing Events{" "}
//           <span className="hd-card-sub-inline">by conversion rate</span>
//         </h3>
//         <table className="hd-table">
//           <thead>
//             <tr>
//               <th>Event</th>
//               <th>Status</th>
//               <th>Fill Rate</th>
//               <th>Conv. Rate</th>
//               <th>Revenue</th>
//               <th>Attendees</th>
//             </tr>
//           </thead>
//           <tbody>
//             {[...events]
//               .sort((a, b) => convRate(b) - convRate(a))
//               .map((e, i) => (
//                 <tr key={i}>
//                   <td className="hd-td-name">{e.name}</td>
//                   <td>
//                     <span className={`hd-status-pill hd-status-pill--${e.status}`}>
//                       {e.status}
//                     </span>
//                   </td>
//                   <td>
//                     <div className="hd-progress-wrap">
//                       <div className="hd-progress-bar">
//                         <div
//                           className="hd-progress-fill"
//                           style={{ width: `${fillPct(e)}%` }}
//                         />
//                       </div>
//                       <span className="hd-progress-label">{fillPct(e)}%</span>
//                     </div>
//                   </td>
//                   <td className="hd-conv-cell">{convRate(e)}%</td>
//                   <td className="hd-revenue-cell">${e.revenue.toLocaleString()}</td>
//                   <td>{e.registered.toLocaleString()}</td>
//                 </tr>
//               ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// /* ─────────────────────────────────────────
//    ANALYTICS PAGE
// ───────────────────────────────────────── */
// const Analytics = () => {
//   const [analyticsEvent, setAnalyticsEvent] = useState(null);

//   return (
//     <div>
//       <div className="hd-section-header">
//         <h2 className="hd-section-title">Analytics</h2>
//         <p className="hd-section-sub">
//           Select an event for detailed breakdown, or view overall stats.
//         </p>
//       </div>

//       {/* Event Selector */}
//       <div className="hd-analytics-selector">
//         <button
//           className={`hd-anal-pill ${!analyticsEvent ? "hd-anal-pill--active" : ""}`}
//           onClick={() => setAnalyticsEvent(null)}
//         >
//           Overall
//         </button>
//         {ALL_EVENTS.map((e) => (
//           <button
//             key={e.id}
//             className={`hd-anal-pill ${analyticsEvent?.id === e.id ? "hd-anal-pill--active" : ""}`}
//             onClick={() => setAnalyticsEvent(e)}
//           >
//             {e.name.split(" ").slice(0, 2).join(" ")}
//           </button>
//         ))}
//       </div>

//       <AnalyticsPanel
//         key={analyticsEvent?.id ?? "all"}
//         events={analyticsEvent ? [analyticsEvent] : ALL_EVENTS}
//         title={analyticsEvent ? analyticsEvent.name : null}
//         sub={analyticsEvent ? `${analyticsEvent.date} · ${analyticsEvent.location}` : null}
//       />
//     </div>
//   );
// };

// export default Analytics;