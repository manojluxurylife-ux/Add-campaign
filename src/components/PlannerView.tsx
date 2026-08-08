import React, { useState } from 'react';
import { MediaPlan, IndustryVertical, PlatformId } from '../types';
import { PLATFORMS } from '../data/mockData';
import { Compass, Plus, DollarSign, Target, PieChart, Users, CheckCircle2 } from 'lucide-react';

interface PlannerViewProps {
  mediaPlans: MediaPlan[];
  onCreatePlan: (plan: Omit<MediaPlan, 'id'>) => void;
}

export const PlannerView: React.FC<PlannerViewProps> = ({ mediaPlans, onCreatePlan }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedVertical, setSelectedVertical] = useState<IndustryVertical>('saas');
  const [title, setTitle] = useState('');
  const [budget, setBudget] = useState('50000');
  const [targetKpi, setTargetKpi] = useState('CAC $180');

  const verticals: { id: IndustryVertical; label: string }[] = [
    { id: 'saas', label: 'B2B SaaS / Software' },
    { id: 'ecommerce', label: 'D2C & B2B E-Commerce' },
    { id: 'b2b_enterprise', label: 'Enterprise Tech' },
    { id: 'finance', label: 'FinTech & Finance' },
    { id: 'healthcare', label: 'Healthcare & Wellness' },
    { id: 'real_estate', label: 'Real Estate & Housing' },
    { id: 'local_service', label: 'Local Services' },
    { id: 'mobile_app', label: 'Mobile Apps & Games' },
    { id: 'info_products', label: 'Info Products & Courses' },
    { id: 'agency', label: 'Agency Client Operations' },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const monthlyBudget = Number(budget) || 50000;

    onCreatePlan({
      title: title || `${selectedVertical.toUpperCase()} Growth Strategy`,
      vertical: selectedVertical,
      monthly_budget: monthlyBudget,
      kpis: [{ metric: 'Target Goal', target: targetKpi }],
      platform_allocations: [
        { platform: 'google', percentage: 40, budget: monthlyBudget * 0.4, strategy: 'Search intent & High ROAS terms' },
        { platform: 'meta', percentage: 35, budget: monthlyBudget * 0.35, strategy: 'Advantage+ Prospecting & Retargeting' },
        { platform: 'linkedin', percentage: 25, budget: monthlyBudget * 0.25, strategy: 'Decision Maker Account Based Targeting' },
      ],
      channel_tactics: [
        {
          channel: 'Google Search & PMax',
          target_audience: 'In-market purchasers searching high intent keywords',
          key_message: 'Guaranteed 3x Growth with Automated Management',
          format: 'Responsive Search Ads + Dynamic Product Feeds',
        },
      ],
      competitor_insights: [
        'Competitors aggressively bidding on primary category keywords.',
        'Short-form UGC video video ads showing highest conversion velocity.',
      ],
    });

    setShowModal(false);
    setTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Planner Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-400" />
            <span>Paid-Media Strategy & Channel Planner</span>
          </h2>
          <p className="text-xs text-slate-400">
            Design channel allocations, KPI targets, budget distribution, and tactics across 10 industry verticals.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Media Plan</span>
        </button>
      </div>

      {/* Media Plans Cards */}
      <div className="space-y-6">
        {mediaPlans.map((plan) => (
          <div key={plan.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    {plan.vertical.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">{plan.id}</span>
                </div>
                <h3 className="text-lg font-bold text-white">{plan.title}</h3>
              </div>

              <div className="flex items-center gap-4 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Monthly Budget</span>
                  <span className="text-sm font-extrabold text-emerald-400">${plan.monthly_budget.toLocaleString()}</span>
                </div>
                <div className="border-l border-slate-800 pl-4">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Primary KPI</span>
                  <span className="text-sm font-bold text-cyan-400">{plan.kpis[0]?.metric}: {plan.kpis[0]?.target}</span>
                </div>
              </div>
            </div>

            {/* Channel Budget Allocations */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <PieChart className="w-4 h-4 text-indigo-400" />
                <span>Channel Allocations</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {plan.platform_allocations.map((alloc, idx) => {
                  const platInfo = PLATFORMS.find((p) => p.id === alloc.platform);
                  return (
                    <div key={idx} className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white">{platInfo?.name || alloc.platform}</span>
                        <span className="text-xs font-extrabold text-indigo-400">{alloc.percentage}%</span>
                      </div>
                      <div className="text-sm font-semibold text-emerald-400">${alloc.budget.toLocaleString()}</div>
                      <p className="text-[11px] text-slate-400 line-clamp-2">{alloc.strategy}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tactics & Competitors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4 space-y-2">
                <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Channel Tactics</span>
                </h5>
                {plan.channel_tactics.map((tactic, tIdx) => (
                  <div key={tIdx} className="text-xs space-y-1 pt-1">
                    <div className="font-semibold text-white">{tactic.channel}</div>
                    <div className="text-slate-400"><strong className="text-slate-300">Audience:</strong> {tactic.target_audience}</div>
                    <div className="text-slate-400"><strong className="text-slate-300">Offer:</strong> {tactic.key_message}</div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4 space-y-2">
                <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span>Competitor Insights</span>
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {plan.competitor_insights.map((insight, iIdx) => (
                    <li key={iIdx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Media Plan Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Create Strategic Media Plan</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Plan Title</label>
                <input
                  type="text"
                  placeholder="e.g. Q4 Global Scaling Campaign"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Industry Vertical Asset Template</label>
                <select
                  value={selectedVertical}
                  onChange={(e) => setSelectedVertical(e.target.value as IndustryVertical)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {verticals.map((v) => (
                    <option key={v.id} value={v.id}>{v.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Monthly Budget ($ USD)</label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Primary Goal / KPI Target</label>
                <input
                  type="text"
                  placeholder="e.g. CAC < $150 or ROAS > 4.0x"
                  value={targetKpi}
                  onChange={(e) => setTargetKpi(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl"
                >
                  Generate Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
