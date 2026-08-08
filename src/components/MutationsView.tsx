import React from 'react';
import { MutationPlan } from '../types';
import { Zap, ShieldCheck, AlertTriangle, CheckCircle2, RefreshCw, ArrowRight } from 'lucide-react';

interface MutationsViewProps {
  mutationPlans: MutationPlan[];
  onApproveMutation: (id: string) => void;
}

export const MutationsView: React.FC<MutationsViewProps> = ({
  mutationPlans,
  onApproveMutation,
}) => {
  return (
    <div className="space-y-6">
      {/* Safety Header Banner */}
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-400">
            <Zap className="w-5 h-5 fill-amber-400" />
            <h2 className="text-xl font-bold font-display">
              Safe Account Mutation Drafts
            </h2>
          </div>
          <p className="text-xs text-slate-300">
            All campaign changes remain read-only by default. Live write mutations require explicit operator approval, idempotency verification, and rollback safety.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Idempotency Guard Active</span>
        </div>
      </div>

      {/* Drafts List */}
      <div className="space-y-4">
        {mutationPlans.map((plan) => {
          const isPending = plan.status === 'draft_pending_review';
          return (
            <div
              key={plan.id}
              className={`bg-slate-900/90 border rounded-2xl p-6 space-y-4 transition-all ${
                isPending ? 'border-amber-500/40 shadow-lg shadow-amber-950/10' : 'border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{plan.platform}</span>
                    <span className="text-xs text-slate-500 font-mono">{plan.id}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                        isPending
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {plan.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{plan.title}</h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-slate-400 block font-semibold">Blast Radius</span>
                    <span className={`text-xs font-bold ${
                      plan.blast_radius === 'high' ? 'text-rose-400' : 'text-amber-300'
                    }`}>
                      {plan.blast_radius.toUpperCase()}
                    </span>
                  </div>

                  {isPending && (
                    <button
                      onClick={() => onApproveMutation(plan.id)}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Verify</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Before vs After Diff View */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/90 border border-rose-500/20 rounded-xl p-4 space-y-2">
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">Before State (Current)</span>
                  <pre className="text-xs font-mono text-slate-300 bg-slate-900/60 p-3 rounded-lg overflow-x-auto">
                    {JSON.stringify(plan.before_state, null, 2)}
                  </pre>
                </div>

                <div className="bg-slate-950/90 border border-emerald-500/20 rounded-xl p-4 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">After State (Proposed Diff)</span>
                  <pre className="text-xs font-mono text-slate-300 bg-slate-900/60 p-3 rounded-lg overflow-x-auto">
                    {JSON.stringify(plan.after_state, null, 2)}
                  </pre>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <span>Idempotency Key: <strong className="font-mono text-slate-300">{plan.idempotency_key}</strong></span>
                <span className="text-emerald-300 font-semibold">Estimated Impact: {plan.estimated_impact}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
