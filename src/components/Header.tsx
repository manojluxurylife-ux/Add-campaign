import React from 'react';
import { AccountProfile, PlatformId } from '../types';
import { PLATFORMS } from '../data/mockData';
import { ShieldCheck, Sparkles, AlertCircle, Cpu, Zap, Activity } from 'lucide-react';

interface HeaderProps {
  profile: AccountProfile;
  overallHealthScore: number;
  overallCoverage: number;
  onOpenAiGenerator: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  overallHealthScore,
  overallCoverage,
  onOpenAiGenerator,
}) => {
  return (
    <header className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-amber-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight font-display">
                Claude Ads
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full uppercase tracking-wider">
                v2.0 Operations
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Paid-Media Operations Across 12 Ad Platforms
            </p>
          </div>
        </div>

        {/* Stats & Account Status */}
        <div className="flex flex-wrap items-center gap-3 lg:gap-6">
          {/* Portfolio Health Score Badge */}
          <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-1.5">
            <div className="text-right">
              <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Portfolio Health
              </div>
              <div className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                <span>{overallHealthScore.toFixed(1)}</span>
                <span className="text-[10px] text-slate-500 font-normal">/ 100</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
          </div>

          {/* Evidence Coverage Badge */}
          <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-1.5">
            <div className="text-right">
              <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Evidence Coverage
              </div>
              <div className="text-sm font-bold text-cyan-400">
                {overallCoverage.toFixed(1)}%
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
          </div>

          {/* Client Profile */}
          <div className="hidden sm:flex flex-col text-right border-l border-slate-800 pl-4">
            <span className="text-xs font-semibold text-white truncate max-w-[140px]">
              {profile.client_name}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {profile.account_id}
            </span>
          </div>

          {/* AI Generator Quick Action */}
          <button
            onClick={onOpenAiGenerator}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>AI Copy & Strategy</span>
          </button>
        </div>
      </div>
    </header>
  );
};
