import React from 'react';
import { MonitoringMetric } from '../types';
import { Activity, AlertTriangle, CheckCircle2, ShieldAlert, TrendingUp } from 'lucide-react';

interface MonitoringViewProps {
  metrics: MonitoringMetric[];
}

export const MonitoringView: React.FC<MonitoringViewProps> = ({ metrics }) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <span>Pacing, Ad Fatigue & Policy Monitor</span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time delivery oversight across budget pacing, creative frequency fatigue, pixel/CAPI tracking degradation, and policy compliance flags.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((m) => {
          const isFatigued = m.fatigue_score >= 70;
          const isPacingOver = m.budget_pacing_pct > 105;

          return (
            <div key={m.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{m.platform}</span>
                  <h3 className="text-sm font-bold text-white truncate max-w-[280px]">{m.campaign_name}</h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase text-slate-400 block font-semibold">Today Spend</span>
                  <span className="text-sm font-extrabold text-white">${m.spend_today.toFixed(2)}</span>
                </div>
              </div>

              {/* Pacing Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Budget Pacing Rate</span>
                  <span className={`font-bold ${isPacingOver ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {m.budget_pacing_pct}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isPacingOver ? 'bg-amber-400' : 'bg-emerald-400'}`}
                    style={{ width: `${Math.min(m.budget_pacing_pct, 100)}%` }}
                  />
                </div>
              </div>

              {/* Fatigue Score */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Creative Fatigue Score</span>
                  <span className={`font-bold ${isFatigued ? 'text-rose-400' : 'text-slate-300'}`}>
                    {m.fatigue_score} / 100 {isFatigued ? '(Fatigue Warning)' : ''}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isFatigued ? 'bg-rose-500' : 'bg-cyan-400'}`}
                    style={{ width: `${m.fatigue_score}%` }}
                  />
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Tracking:</span>
                  <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                    m.tracking_health === 'healthy' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {m.tracking_health}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Policy:</span>
                  <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                    m.policy_status === 'compliant' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {m.policy_status.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-slate-400">ROAS: </span>
                  <span className="font-extrabold text-emerald-400">{m.roas}x</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
