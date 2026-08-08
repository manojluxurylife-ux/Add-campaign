import React, { useState } from 'react';
import { AuditReport, PlatformId, SeverityLevel, FindingStatus } from '../types';
import { PLATFORMS } from '../data/mockData';
import {
  ShieldCheck,
  Search,
  RefreshCw,
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Filter,
  FileCheck2,
} from 'lucide-react';

interface AuditViewProps {
  selectedPlatform: PlatformId;
  setSelectedPlatform: (p: PlatformId) => void;
  auditReports: Record<string, AuditReport>;
  onRunAudit: (p: PlatformId) => void;
  isLoadingAudit: boolean;
}

export const AuditView: React.FC<AuditViewProps> = ({
  selectedPlatform,
  setSelectedPlatform,
  auditReports,
  onRunAudit,
  isLoadingAudit,
}) => {
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const currentReport = auditReports[selectedPlatform];
  const currentPlatformInfo = PLATFORMS.find((p) => p.id === selectedPlatform)!;

  const filteredFindings = currentReport?.findings.filter((f) => {
    if (statusFilter !== 'all' && f.status !== statusFilter) return false;
    return true;
  }) || [];

  return (
    <div className="space-y-6">
      {/* Platform Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {PLATFORMS.map((p) => {
          const isSelected = selectedPlatform === p.id;
          const report = auditReports[p.id];
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPlatform(p.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
              }`}
            >
              <span>{p.name}</span>
              {report && (
                <span className={`px-1.5 py-0.5 text-[10px] rounded font-mono ${
                  report.health_score >= 80 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {report.health_score}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Audit Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white font-display">
              {currentPlatformInfo.name} Evidence-Backed Audit
            </h2>
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
              {currentPlatformInfo.badge}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Run ID: <span className="font-mono text-slate-300">{currentReport?.run_id || 'Not Audited Yet'}</span> | Account: <span className="font-mono text-slate-300">{currentReport?.account_id || 'ACC-DEFAULT'}</span>
          </p>
        </div>

        <button
          onClick={() => onRunAudit(selectedPlatform)}
          disabled={isLoadingAudit}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isLoadingAudit ? 'animate-spin' : ''}`} />
          <span>{isLoadingAudit ? 'Running Worker Audit...' : 'Re-Run Platform Audit'}</span>
        </button>
      </div>

      {currentReport ? (
        <>
          {/* Health Score & Coverage Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Health Score</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-emerald-400">{currentReport.health_score}</span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
              <p className="text-xs text-slate-400">Determined by weighted category health controls</p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Evidence Coverage</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-cyan-400">{currentReport.evidence_coverage}%</span>
              </div>
              <p className="text-xs text-slate-400">Graded (&gt;80% Normal, 60-79% Provisional)</p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status & Completeness</span>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-base font-bold text-white capitalize">{currentReport.status}</span>
              </div>
              <p className="text-xs text-slate-400">Read-only account evidence grounded</p>
            </div>
          </div>

          {/* Category Health Breakdown */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Category Scoring Breakdown</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentReport.categories.map((cat, i) => (
                <div key={i} className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-slate-200">{cat.category}</span>
                    <span className="text-[10px] text-slate-400 font-mono">Weight {cat.category_weight}%</span>
                  </div>
                  <div className="text-xl font-bold text-emerald-400">{cat.health_score ?? 'N/A'}%</div>
                  <div className="text-[10px] text-slate-400 flex justify-between">
                    <span>Passed: {cat.passed_controls}</span>
                    <span className="text-rose-400">Failed: {cat.failed_controls}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Findings List & Filters */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-indigo-400" />
                <span>Audit Findings ({filteredFindings.length})</span>
              </h3>

              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="fail">Failed Only</option>
                  <option value="pass">Passed Only</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredFindings.map((finding, idx) => {
                const isFail = finding.status === 'fail';
                return (
                  <div
                    key={idx}
                    className={`rounded-xl border p-5 space-y-3 transition-all ${
                      isFail
                        ? 'bg-rose-950/10 border-rose-500/30'
                        : 'bg-emerald-950/10 border-emerald-500/30'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-400 font-bold">{finding.control_id}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            isFail
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {finding.status}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                          Confidence: {finding.confidence}
                        </span>
                      </div>

                      <div className="text-xs font-medium text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                        Impact: {finding.impact}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-white">{finding.observation}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed"><strong className="text-indigo-300">Diagnosis:</strong> {finding.diagnosis}</p>
                      <p className="text-xs text-slate-300 leading-relaxed"><strong className="text-emerald-300">Recommendation:</strong> {finding.recommendation}</p>
                    </div>

                    {/* Evidence metrics */}
                    <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-800/60">
                      {finding.evidence.map((ev, eIdx) => (
                        <div key={eIdx} className="bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
                          <span className="text-slate-400">{ev.label}: </span>
                          <span className="font-bold text-white">{ev.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <Search className="w-12 h-12 text-indigo-400 mx-auto opacity-80" />
          <h3 className="text-lg font-bold text-white">No Audit Executed for {currentPlatformInfo.name} Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Click the button below to initiate an automated evidence-backed audit worker across {currentPlatformInfo.name} controls.
          </p>
          <button
            onClick={() => onRunAudit(selectedPlatform)}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20 inline-flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Start {currentPlatformInfo.name} Audit</span>
          </button>
        </div>
      )}
    </div>
  );
};
