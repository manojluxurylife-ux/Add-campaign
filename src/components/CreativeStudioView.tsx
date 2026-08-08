import React, { useState } from 'react';
import { CreativeBrief, PlatformId } from '../types';
import { PLATFORMS } from '../data/mockData';
import { Sparkles, Video, Image, Copy, Camera, Send, Plus, Check, Loader2 } from 'lucide-react';

interface CreativeStudioViewProps {
  creativeBriefs: CreativeBrief[];
  onCreateBrief: (brief: Omit<CreativeBrief, 'id' | 'created_at'>) => void;
}

export const CreativeStudioView: React.FC<CreativeStudioViewProps> = ({
  creativeBriefs,
  onCreateBrief,
}) => {
  const [platform, setPlatform] = useState<PlatformId>('google');
  const [format, setFormat] = useState<'copy' | 'image' | 'video' | 'product_photo'>('copy');
  const [promptInput, setPromptInput] = useState('');
  const [aiOutput, setAiOutput] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateAi = async () => {
    if (!promptInput.trim()) return;
    setIsGenerating(true);
    setAiOutput(null);

    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Generate a high-converting ${format} ad creative package for ${platform} platform. Product / Offer details: ${promptInput}`,
          mode: format,
          platform,
        }),
      });
      const data = await res.json();
      setAiOutput(data.output);
    } catch (err) {
      console.error(err);
      setAiOutput('Failed to connect to AI copy generator service.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = () => {
    if (!aiOutput) return;
    navigator.clipboard.writeText(aiOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveBrief = () => {
    onCreateBrief({
      title: `${platform.toUpperCase()} ${format.toUpperCase()} Campaign Assets`,
      platform,
      format,
      angles: ['Direct ROI Offer', 'Pain Point Solver', 'Social Proof Case Study'],
      headlines: [
        'Stop Wasting Paid Media Budget',
        'Scale Ad Campaigns 3.5x Faster',
        'Guaranteed Conversion Lift',
      ],
      primary_text: [aiOutput || promptInput],
      cta_options: ['Start Free Trial', 'Get Free Audit', 'Claim Offer'],
      status: 'approved',
    });
    setAiOutput(null);
    setPromptInput('');
  };

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>AI Ad Copy & Creative Asset Studio</span>
          </h2>
          <p className="text-xs text-slate-400">
            Generate high-converting headlines, primary copy, UGC video scripts, and visual prompts tuned to platform specifications.
          </p>
        </div>
      </div>

      {/* Interactive AI Copy Generator Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Panel */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Asset Configuration</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Target Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as PlatformId)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {PLATFORMS.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.badge})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Creative Format</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'copy', label: 'Ad Copy & Text', icon: Copy },
                { id: 'video', label: 'Video Hook Script', icon: Video },
                { id: 'image', label: 'Visual Image Brief', icon: Image },
                { id: 'product_photo', label: 'Product Photo Brief', icon: Camera },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = format === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setFormat(item.id as any)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Product, Offer & Value Proposition</label>
            <textarea
              rows={4}
              placeholder="e.g. Enterprise B2B cloud cost management software saving 30% on AWS/GCP bills. Target audience: Head of DevOps. Offer: Free 14-day trial & zero setup fee."
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={handleGenerateAi}
            disabled={isGenerating || !promptInput.trim()}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-500 hover:from-indigo-500 hover:to-amber-400 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                <span>Generating AI Creative Asset...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate Ad Copy with Gemini AI</span>
              </>
            )}
          </button>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>AI Creative Studio Output</span>
              </h3>

              {aiOutput && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyText}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={handleSaveBrief}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Save to Briefs</span>
                  </button>
                </div>
              )}
            </div>

            {aiOutput ? (
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed max-h-[420px] overflow-y-auto">
                {aiOutput}
              </div>
            ) : (
              <div className="h-64 rounded-xl border border-dashed border-slate-800 flex flex-col items-center justify-center text-center p-6 space-y-2">
                <Sparkles className="w-8 h-8 text-indigo-400 opacity-60" />
                <p className="text-xs text-slate-400 font-medium">
                  Enter your offer details on the left and click "Generate Ad Copy" to produce copy variations, video scripts, or prompts.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Saved Briefs */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Active Creative Briefs ({creativeBriefs.length})</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {creativeBriefs.map((brief) => (
            <div key={brief.id} className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{brief.platform} • {brief.format}</span>
                  <h4 className="text-sm font-bold text-white">{brief.title}</h4>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                  {brief.status}
                </span>
              </div>

              {brief.headlines && brief.headlines.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">Headlines:</span>
                  <ul className="text-xs text-slate-200 list-disc list-inside space-y-0.5">
                    {brief.headlines.map((h, hIdx) => (
                      <li key={hIdx}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}

              {brief.primary_text && brief.primary_text.length > 0 && (
                <div className="space-y-1 text-xs text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800/80 line-clamp-3">
                  {brief.primary_text[0]}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
