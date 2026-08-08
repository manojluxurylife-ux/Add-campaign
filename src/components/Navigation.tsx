import React from 'react';
import {
  LayoutDashboard,
  Search,
  Compass,
  Sparkles,
  Zap,
  Activity,
  FlaskConical,
  FileText,
  Sliders,
  Rocket,
} from 'lucide-react';

export type TabType =
  | 'overview'
  | 'creation_posting'
  | 'audits'
  | 'planner'
  | 'creative'
  | 'mutations'
  | 'monitoring'
  | 'experiments'
  | 'reports'
  | 'settings';

interface NavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  pendingMutationsCount: number;
  monitoringAlertsCount: number;
}

interface NavItem {
  id: TabType;
  label: string;
  icon: any;
  badge?: string | number | null;
  badgeColor?: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  pendingMutationsCount,
  monitoringAlertsCount,
}) => {
  const tabs: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    {
      id: 'creation_posting',
      label: 'Add Creation and Posting',
      icon: Rocket,
      badge: 'AI Pilot',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    },
    { id: 'audits', label: 'Account Audits', icon: Search },
    { id: 'planner', label: 'Media Planner', icon: Compass },
    { id: 'creative', label: 'Creative Studio', icon: Sparkles },
    {
      id: 'mutations',
      label: 'Mutation Drafts',
      icon: Zap,
      badge: pendingMutationsCount > 0 ? pendingMutationsCount : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'monitoring',
      label: 'Performance & Pacing',
      icon: Activity,
      badge: monitoringAlertsCount > 0 ? monitoringAlertsCount : null,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    },
    { id: 'experiments', label: 'A/B Testing', icon: FlaskConical },
    { id: 'reports', label: 'Reports & Exports', icon: FileText },
    { id: 'settings', label: 'Setup & Guardrails', icon: Sliders },
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-800/80 px-4 lg:px-8 overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto flex items-center gap-1 min-w-max py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm shadow-indigo-950/50 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? 'text-indigo-400' : 'text-slate-400'
                }`}
              />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-bold border rounded-full ${tab.badgeColor}`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
