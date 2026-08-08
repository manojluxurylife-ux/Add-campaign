import React from 'react';
import { AccountProfile, AuditReport, PlatformId } from '../types';
import { PLATFORMS } from '../data/mockData';
import {
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  Layers,
  ArrowRight,
  Zap,
  Activity,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';

interface OverviewViewProps {
  profile: AccountProfile;
  auditReports: Record<string, AuditReport>;
  onSelectPlatformAudit: (platform: PlatformId) => void;
  onNavigateTab: (tab: any) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  profile,
  auditReports,
  onSelectPlatformAudit,
  onNavigateTab,
}) => {
  const activePlatforms = PLATFORMS.filter((p) => profile.platforms.includes(p.id));

  return (
    <div className="space-y-6">
      {/* Hero Operational Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 p-6 lg:p-8 shadow-xl">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Read-Only Safety System Active</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight font-display">
              Paid-Media Operations Hub
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Claude Ads coordinates evidence-backed audits, budget plans, creative briefs, pacing monitors, and safe mutation drafts across 12 advertising platforms.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('creation_posting')}
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-500 hover:from-indigo-500 hover:to-amber-400 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Add Creation & Posting</span>
            </button>
            <button
              onClick={() => onNavigateTab('audits')}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer"
            >
              <span>Run Account Audit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateTab('planner')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Build Media Plan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Operational Highlights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Platforms</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">{profile.platforms.length} / 12</div>
          <p className="text-xs text-slate-400">Google, Meta, LinkedIn, TikTok & YouTube connected</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Monthly Budget</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">${profile.monthly_budget.toLocaleString()}</div>
          <p className="text-xs text-slate-400">Target ROAS: <span className="text-emerald-400 font-semibold">{profile.target_roas}x</span> | CPA: <span className="text-cyan-400 font-semibold">${profile.target_cpa}</span></p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Mutations</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-300">2 Drafts</div>
          <p className="text-xs text-slate-400">Human approval required prior to live execution</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Privacy Class</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white capitalize">{profile.privacy_class}</div>
          <p className="text-xs text-slate-400">Raw credentials stored securely in server environment</p>
        </div>
      </div>

      {/* Platforms Grid */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Supported Advertising Platform Surfaces</h3>
            <p className="text-xs text-slate-400">Select any platform to inspect health scores, evidence coverage, and controls</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">12 First-Class Connectors</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PLATFORMS.map((platform) => {
            const report = auditReports[platform.id];
            const isConnected = profile.platforms.includes(platform.id);

            return (
              <div
                key={platform.id}
                onClick={() => onSelectPlatformAudit(platform.id)}
                className={`group relative rounded-xl p-4 border transition-all cursor-pointer ${
                  isConnected
                    ? 'bg-slate-900/90 border-slate-700/80 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-950/30'
                    : 'bg-slate-950/50 border-slate-800/50 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center text-white text-xs font-bold shadow-md`}>
                      {platform.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                        {platform.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 block truncate max-w-[150px]">
                        {platform.badge}
                      </span>
                    </div>
                  </div>

                  {isConnected ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Active Platform" />
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">Available</span>
                  )}
                </div>

                {report ? (
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Health Score</span>
                      <span className="font-bold text-emerald-400">{report.health_score} / 100</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 rounded-full"
                        style={{ width: `${report.health_score}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Coverage: {report.evidence_coverage}%</span>
                      <span>Findings: {report.findings.length}</span>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span>Audit Ready</span>
                    <span className="text-indigo-400 text-[11px] font-semibold group-hover:underline">Run Audit →</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
