import React, { useState, useEffect } from 'react';
import {
  AccountProfile,
  AuditReport,
  MediaPlan,
  CreativeBrief,
  MutationPlan,
  MonitoringMetric,
  Experiment,
  PlatformId,
} from './types';
import {
  DEFAULT_PROFILE,
  INITIAL_AUDIT_REPORTS,
  MOCK_MEDIA_PLANS,
  MOCK_CREATIVE_BRIEFS,
  MOCK_MUTATIONS,
  MOCK_MONITORING,
  MOCK_EXPERIMENTS,
} from './data/mockData';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { OverviewView } from './components/OverviewView';
import { AuditView } from './components/AuditView';
import { PlannerView } from './components/PlannerView';
import { CreativeStudioView } from './components/CreativeStudioView';
import { MutationsView } from './components/MutationsView';
import { MonitoringView } from './components/MonitoringView';
import { ExperimentsView } from './components/ExperimentsView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { CreationAndPostingView } from './components/CreationAndPostingView';
import { AiGeneratorModal } from './components/AiGeneratorModal';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId>('google');

  // Application State
  const [profile, setProfile] = useState<AccountProfile>(DEFAULT_PROFILE);
  const [auditReports, setAuditReports] = useState<Record<string, AuditReport>>(INITIAL_AUDIT_REPORTS);
  const [mediaPlans, setMediaPlans] = useState<MediaPlan[]>(MOCK_MEDIA_PLANS);
  const [creativeBriefs, setCreativeBriefs] = useState<CreativeBrief[]>(MOCK_CREATIVE_BRIEFS);
  const [mutationPlans, setMutationPlans] = useState<MutationPlan[]>(MOCK_MUTATIONS);
  const [monitoringMetrics, setMonitoringMetrics] = useState<MonitoringMetric[]>(MOCK_MONITORING);
  const [experiments, setExperiments] = useState<Experiment[]>(MOCK_EXPERIMENTS);

  const [isLoadingAudit, setIsLoadingAudit] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Fetch initial backend state if available
  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.client_name) setProfile(data);
      })
      .catch(() => {});

    fetch('/api/audits')
      .then((res) => res.json())
      .then((data) => {
        if (data && Object.keys(data).length > 0) setAuditReports(data);
      })
      .catch(() => {});
  }, []);

  // Compute Overall Portfolio Health & Coverage
  const reportsList = Object.values(auditReports);
  const overallHealthScore =
    reportsList.length > 0
      ? reportsList.reduce((acc, r) => acc + r.health_score, 0) / reportsList.length
      : 82.5;

  const overallCoverage =
    reportsList.length > 0
      ? reportsList.reduce((acc, r) => acc + r.evidence_coverage, 0) / reportsList.length
      : 90.0;

  // Run Platform Audit Handler
  const handleRunAudit = async (plat: PlatformId) => {
    setIsLoadingAudit(true);
    try {
      const res = await fetch('/api/audits/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: plat }),
      });
      const data = await res.json();
      setAuditReports((prev) => ({ ...prev, [plat]: data }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingAudit(false);
    }
  };

  // Add Handlers
  const handleCreatePlan = (newPlan: Omit<MediaPlan, 'id'>) => {
    const created: MediaPlan = {
      id: `PLAN-${Date.now().toString().slice(-4)}`,
      ...newPlan,
    };
    setMediaPlans((prev) => [created, ...prev]);
  };

  const handleCreateBrief = (newBrief: Omit<CreativeBrief, 'id' | 'created_at'>) => {
    const created: CreativeBrief = {
      id: `CRB-${Date.now().toString().slice(-4)}`,
      created_at: new Date().toISOString(),
      ...newBrief,
    };
    setCreativeBriefs((prev) => [created, ...prev]);
  };

  const handleApproveMutation = (id: string) => {
    setMutationPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'approved' as const } : p))
    );
  };

  const handleCreateExperiment = (exp: Omit<Experiment, 'id' | 'status'>) => {
    const created: Experiment = {
      id: `EXP-${Date.now().toString().slice(-4)}`,
      status: 'active' as const,
      ...exp,
    };
    setExperiments((prev) => [created, ...prev]);
  };

  const pendingMutationsCount = mutationPlans.filter(
    (m) => m.status === 'draft_pending_review'
  ).length;

  const monitoringAlertsCount = monitoringMetrics.filter(
    (m) => m.fatigue_score >= 70 || m.tracking_health !== 'healthy'
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
      {/* Header */}
      <Header
        profile={profile}
        overallHealthScore={overallHealthScore}
        overallCoverage={overallCoverage}
        onOpenAiGenerator={() => setIsAiModalOpen(true)}
      />

      {/* Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingMutationsCount={pendingMutationsCount}
        monitoringAlertsCount={monitoringAlertsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8">
        {activeTab === 'overview' && (
          <OverviewView
            profile={profile}
            auditReports={auditReports}
            onSelectPlatformAudit={(plat) => {
              setSelectedPlatform(plat);
              setActiveTab('audits');
            }}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'creation_posting' && (
          <CreationAndPostingView profile={profile} />
        )}

        {activeTab === 'audits' && (
          <AuditView
            selectedPlatform={selectedPlatform}
            setSelectedPlatform={setSelectedPlatform}
            auditReports={auditReports}
            onRunAudit={handleRunAudit}
            isLoadingAudit={isLoadingAudit}
          />
        )}

        {activeTab === 'planner' && (
          <PlannerView
            mediaPlans={mediaPlans}
            onCreatePlan={handleCreatePlan}
          />
        )}

        {activeTab === 'creative' && (
          <CreativeStudioView
            creativeBriefs={creativeBriefs}
            onCreateBrief={handleCreateBrief}
          />
        )}

        {activeTab === 'mutations' && (
          <MutationsView
            mutationPlans={mutationPlans}
            onApproveMutation={handleApproveMutation}
          />
        )}

        {activeTab === 'monitoring' && (
          <MonitoringView metrics={monitoringMetrics} />
        )}

        {activeTab === 'experiments' && (
          <ExperimentsView
            experiments={experiments}
            onCreateExperiment={handleCreateExperiment}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView
            auditReports={auditReports}
            profile={profile}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            profile={profile}
            onUpdateProfile={(newProf) => setProfile(newProf)}
          />
        )}
      </main>

      {/* Quick AI Copy Generator Modal */}
      <AiGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 px-4 text-center text-xs text-slate-400">
        <p>
          Claude Ads v2.0 Operations • Evidence-Backed Paid-Media Hub across 12 Advertising Platforms • Read-Only Safety Protocol Active
        </p>
      </footer>
    </div>
  );
}

export default App;
