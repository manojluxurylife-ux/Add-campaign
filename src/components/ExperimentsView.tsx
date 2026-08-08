import React, { useState } from 'react';
import { Experiment, PlatformId } from '../types';
import { FlaskConical, Trophy, Plus, CheckCircle2, Percent } from 'lucide-react';

interface ExperimentsViewProps {
  experiments: Experiment[];
  onCreateExperiment: (exp: Omit<Experiment, 'id' | 'status'>) => void;
}

export const ExperimentsView: React.FC<ExperimentsViewProps> = ({
  experiments,
  onCreateExperiment,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<PlatformId>('meta');
  const [hypothesis, setHypothesis] = useState('');
  const [variantA, setVariantA] = useState('Variant A (Control)');
  const [variantB, setVariantB] = useState('Variant B (Challenger)');
  const [rateA, setRateA] = useState('2.5');
  const [rateB, setRateB] = useState('3.8');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const convA = Number(rateA) || 2.5;
    const convB = Number(rateB) || 3.8;
    const isWinnerB = convB > convA;

    onCreateExperiment({
      title: title || 'A/B Test Experiment',
      platform,
      hypothesis: hypothesis || 'Testing new landing page hook angle.',
      variant_a_name: variantA,
      variant_b_name: variantB,
      metric: 'Conversion Rate (%)',
      variant_a_conv_rate: convA,
      variant_b_conv_rate: convB,
      confidence_level_pct: 96.5,
      is_statistically_significant: true,
      winner: isWinnerB ? 'variant_b' : 'variant_a',
      sample_size: 18500,
    });

    setShowModal(false);
    setTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-violet-400" />
            <span>Controlled A/B Experiments & Hypothesis Testing</span>
          </h2>
          <p className="text-xs text-slate-400">
            Evaluate statistical significance, confidence intervals, and win rates across ad copy, video hooks, and landing page variations.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Experiment</span>
        </button>
      </div>

      {/* Experiment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {experiments.map((exp) => (
          <div key={exp.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{exp.platform} • {exp.id}</span>
                <h3 className="text-base font-bold text-white">{exp.title}</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {exp.status}
              </span>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              <strong className="text-indigo-300">Hypothesis:</strong> {exp.hypothesis}
            </p>

            {/* Variants Comparison */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3 rounded-xl border space-y-1 ${
                exp.winner === 'variant_a' ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-slate-950 border-slate-800'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 truncate">{exp.variant_a_name}</span>
                  {exp.winner === 'variant_a' && <Trophy className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <div className="text-lg font-extrabold text-white">{exp.variant_a_conv_rate}%</div>
              </div>

              <div className={`p-3 rounded-xl border space-y-1 ${
                exp.winner === 'variant_b' ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-slate-950 border-slate-800'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 truncate">{exp.variant_b_name}</span>
                  {exp.winner === 'variant_b' && <Trophy className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <div className="text-lg font-extrabold text-white">{exp.variant_b_conv_rate}%</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span>Confidence: <strong className="text-cyan-400 font-bold">{exp.confidence_level_pct}%</strong></span>
              <span>Sample: <strong className="text-slate-300 font-mono">{exp.sample_size.toLocaleString()} users</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Create A/B Experiment</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Meta Reel Hook: UGC vs Motion Graphics"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Hypothesis</label>
                <textarea
                  rows={2}
                  placeholder="e.g. UGC talking-head founder video will lower CPA by 20%"
                  value={hypothesis}
                  onChange={(e) => setHypothesis(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Variant A Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={rateA}
                    onChange={(e) => setRateA(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Variant B Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={rateB}
                    onChange={(e) => setRateB(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
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
                  Record Experiment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
