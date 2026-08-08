import React, { useState } from 'react';
import { AccountProfile } from '../types';
import { Sliders, ShieldCheck, Key, Save, CheckCircle2 } from 'lucide-react';

interface SettingsViewProps {
  profile: AccountProfile;
  onUpdateProfile: (newProfile: AccountProfile) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ profile, onUpdateProfile }) => {
  const [clientName, setClientName] = useState(profile.client_name);
  const [accountId, setAccountId] = useState(profile.account_id);
  const [budget, setBudget] = useState(profile.monthly_budget.toString());
  const [targetRoas, setTargetRoas] = useState(profile.target_roas.toString());
  const [targetCpa, setTargetCpa] = useState(profile.target_cpa.toString());
  const [maxDailyCap, setMaxDailyCap] = useState(profile.guardrails.max_daily_budget_change_pct.toString());
  const [requireHumanApproval, setRequireHumanApproval] = useState(profile.guardrails.require_human_approval);
  const [autoPauseFatigued, setAutoPauseFatigued] = useState(profile.guardrails.auto_pause_fatigued_creatives);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      client_name: clientName,
      account_id: accountId,
      monthly_budget: Number(budget) || profile.monthly_budget,
      target_roas: Number(targetRoas) || profile.target_roas,
      target_cpa: Number(targetCpa) || profile.target_cpa,
      guardrails: {
        max_daily_budget_change_pct: Number(maxDailyCap) || 20,
        require_human_approval: requireHumanApproval,
        auto_pause_fatigued_creatives: autoPauseFatigued,
      },
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <span>Account Profile, KPIs & Guardrails</span>
          </h2>
          <p className="text-xs text-slate-400">
            Configure client identity, performance target floors, safety ceilings, and AI generation parameters.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Details */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Client Identity</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Client Organization Name</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Account Master ID</label>
              <input
                type="text"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* KPI Targets */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Performance Targets</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Monthly Portfolio Spend ($ USD)</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Target ROAS Floor (e.g. 3.8)</label>
              <input
                type="number"
                step="0.1"
                value={targetRoas}
                onChange={(e) => setTargetRoas(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Target CPA Ceiling ($ USD)</label>
              <input
                type="number"
                value={targetCpa}
                onChange={(e) => setTargetCpa(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Safety Guardrails */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Safety Guardrails</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Max Daily Budget Change Cap (%)</label>
              <input
                type="number"
                value={maxDailyCap}
                onChange={(e) => setMaxDailyCap(e.target.value)}
                className="w-full max-w-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="requireHumanApproval"
                checked={requireHumanApproval}
                onChange={(e) => setRequireHumanApproval(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
              />
              <label htmlFor="requireHumanApproval" className="text-xs text-slate-200">
                Require operator human review before applying campaign mutation plans
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="autoPauseFatigued"
                checked={autoPauseFatigued}
                onChange={(e) => setAutoPauseFatigued(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
              />
              <label htmlFor="autoPauseFatigued" className="text-xs text-slate-200">
                Automatically draft pause recommendation when ad fatigue score exceeds 80
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          {saved && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Profile Updated Successfully
            </span>
          )}
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile & Guardrails</span>
          </button>
        </div>
      </form>
    </div>
  );
};
