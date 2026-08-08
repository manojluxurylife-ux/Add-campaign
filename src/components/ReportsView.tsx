import React, { useState } from 'react';
import { AuditReport, AccountProfile } from '../types';
import { FileText, Download, Code, FileCode, Check, Copy } from 'lucide-react';

interface ReportsViewProps {
  auditReports: Record<string, AuditReport>;
  profile: AccountProfile;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ auditReports, profile }) => {
  const [viewFormat, setViewFormat] = useState<'html' | 'markdown' | 'json'>('markdown');
  const [copied, setCopied] = useState(false);

  // Generate Report Bundle Object
  const reportBundle = {
    schema_version: '1.0.0',
    run_manifest: {
      run_id: 'RUN-PORTFOLIO-2026-08',
      started_at: new Date().toISOString(),
      client_name: profile.client_name,
      privacy_class: profile.privacy_class,
      completeness: 'complete',
    },
    account_snapshot: {
      account_id: profile.account_id,
      monthly_budget: profile.monthly_budget,
      target_roas: profile.target_roas,
    },
    reports: auditReports,
  };

  const jsonString = JSON.stringify(reportBundle, null, 2);

  const markdownString = `# Paid-Media Audit Report: ${profile.client_name}

**Date:** ${new Date().toISOString().split('T')[0]}  
**Account ID:** ${profile.account_id}  
**Privacy Class:** ${profile.privacy_class}  

---

## Executive Summary

- **Monthly Budget:** $${profile.monthly_budget.toLocaleString()}
- **Target ROAS:** ${profile.target_roas}x | **Target CPA:** $${profile.target_cpa}
- **Audited Platforms:** ${Object.keys(auditReports).join(', ').toUpperCase()}

---

## Audited Platform Breakdown

${Object.entries(auditReports)
  .map(
    ([platform, rep]) => `### ${platform.toUpperCase()}
- **Health Score:** ${rep.health_score} / 100
- **Evidence Coverage:** ${rep.evidence_coverage}%
- **Findings Count:** ${rep.findings.length}

#### Findings:
${rep.findings
  .map(
    (f) => `- **[${f.status.toUpperCase()}] ${f.control_id}:** ${f.observation}  
  *Diagnosis:* ${f.diagnosis}  
  *Recommendation:* ${f.recommendation}`
  )
  .join('\n\n')}`
  )
  .join('\n\n---\n\n')}
`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCsv = () => {
    const csvRows = [
      ['Platform', 'Run ID', 'Health Score', 'Evidence Coverage', 'Status'],
      ...Object.entries(auditReports).map(([platform, rep]) => [
        platform,
        rep.run_id,
        rep.health_score,
        rep.evidence_coverage,
        rep.status,
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `claude_ads_report_${profile.account_id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Reports Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <span>Audit Report & Bundle Renderer</span>
          </h2>
          <p className="text-xs text-slate-400">
            Export deterministic JSON run bundles, formatted Markdown, HTML executive briefs, or native CSV tables.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadCsv}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => handleCopy(viewFormat === 'json' ? jsonString : markdownString)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Report'}</span>
          </button>
        </div>
      </div>

      {/* Format Selector Tabs */}
      <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800 w-fit">
        <button
          onClick={() => setViewFormat('markdown')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            viewFormat === 'markdown' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Markdown Summary
        </button>
        <button
          onClick={() => setViewFormat('json')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            viewFormat === 'json' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          JSON Run Bundle
        </button>
      </div>

      {/* Rendered Content Area */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        {viewFormat === 'json' ? (
          <pre className="text-xs font-mono text-emerald-300 bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto max-h-[500px]">
            {jsonString}
          </pre>
        ) : (
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
            {markdownString}
          </div>
        )}
      </div>
    </div>
  );
};
