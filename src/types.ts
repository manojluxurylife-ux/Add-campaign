export type PlatformId =
  | 'google'
  | 'meta'
  | 'youtube'
  | 'linkedin'
  | 'tiktok'
  | 'microsoft'
  | 'reddit'
  | 'snapchat'
  | 'x'
  | 'apple'
  | 'amazon'
  | 'pinterest';

export interface PlatformInfo {
  id: PlatformId;
  name: string;
  category: 'search_video_social' | 'commerce_retail';
  iconName: string;
  color: string;
  badge: string;
}

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'informational';
export type FindingStatus = 'pass' | 'fail' | 'unknown' | 'not_applicable';
export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'none';

export interface ControlDefinition {
  control_id: string;
  platform: PlatformId;
  category: string;
  title: string;
  description: string;
  severity: SeverityLevel;
  scoring_behavior: 'health' | 'opportunity' | 'watchlist';
  stability: 'stable' | 'experimental';
}

export interface Finding {
  control_id: string;
  platform: PlatformId;
  status: FindingStatus;
  confidence: ConfidenceLevel;
  observation: string;
  diagnosis: string;
  recommendation: string;
  evidence: { label: string; value: string | number }[];
  impact: string;
}

export interface CategoryScore {
  category: string;
  category_weight: number;
  health_score: number | null;
  evidence_coverage: number;
  applicable_controls: number;
  known_controls: number;
  passed_controls: number;
  failed_controls: number;
  unknown_controls: number;
}

export interface AuditReport {
  run_id: string;
  started_at: string;
  account_id: string;
  account_name: string;
  platform: PlatformId;
  health_score: number;
  evidence_coverage: number;
  status: 'normal' | 'provisional' | 'insufficient_evidence';
  categories: CategoryScore[];
  findings: Finding[];
}

export type IndustryVertical =
  | 'saas'
  | 'ecommerce'
  | 'b2b_enterprise'
  | 'finance'
  | 'healthcare'
  | 'real_estate'
  | 'local_service'
  | 'mobile_app'
  | 'info_products'
  | 'agency';

export interface MediaPlan {
  id: string;
  title: string;
  vertical: IndustryVertical;
  monthly_budget: number;
  kpis: { metric: string; target: string }[];
  platform_allocations: { platform: PlatformId; percentage: number; budget: number; strategy: string }[];
  channel_tactics: { channel: string; target_audience: string; key_message: string; format: string }[];
  competitor_insights: string[];
}

export interface CreativeBrief {
  id: string;
  title: string;
  platform: PlatformId;
  format: 'copy' | 'image' | 'video' | 'product_photo';
  angles: string[];
  headlines: string[];
  primary_text: string[];
  cta_options: string[];
  visual_prompt?: string;
  video_script?: { scene: number; visual: string; audio: string }[];
  status: 'draft' | 'approved' | 'in_production';
  created_at: string;
}

export interface MutationPlan {
  id: string;
  title: string;
  platform: PlatformId;
  operation_type: 'budget_reallocation' | 'bid_strategy_change' | 'pause_underperforming' | 'scale_winner' | 'creative_refresh';
  before_state: Record<string, any>;
  after_state: Record<string, any>;
  blast_radius: 'low' | 'medium' | 'high';
  idempotency_key: string;
  estimated_impact: string;
  status: 'draft_pending_review' | 'approved' | 'applied' | 'rolled_back';
  created_at: string;
}

export interface MonitoringMetric {
  id: string;
  platform: PlatformId;
  campaign_name: string;
  budget_pacing_pct: number;
  fatigue_score: number; // 0 - 100
  tracking_health: 'healthy' | 'warning' | 'critical';
  policy_status: 'compliant' | 'review_needed' | 'flagged';
  roas: number;
  cpa: number;
  target_cpa: number;
  spend_today: number;
}

export interface Experiment {
  id: string;
  title: string;
  platform: PlatformId;
  hypothesis: string;
  variant_a_name: string;
  variant_b_name: string;
  metric: string;
  variant_a_conv_rate: number;
  variant_b_conv_rate: number;
  confidence_level_pct: number;
  is_statistically_significant: boolean;
  winner: 'variant_a' | 'variant_b' | 'inconclusive';
  sample_size: number;
  status: 'active' | 'completed' | 'draft';
}

export interface CampaignDraft {
  id: string;
  business_name: string;
  website: string;
  platform: PlatformId;
  campaign_name: string;
  daily_budget: number;
  target_audience: string;
  keywords: string[];
  headlines: string[];
  primary_texts: string[];
  call_to_action: string;
  landing_page_headline: string;
  status: 'draft' | 'audited' | 'approved' | 'published' | 'scheduled';
  scheduled_at?: string;
  audit_score?: number;
  audit_issues?: {
    reason: string;
    guidance: string;
    fix_suggestion: string;
  }[];
}

export interface CoachFixItem {
  id: string;
  title: string;
  control_id: string;
  platform: PlatformId;
  impact_points: number;
  problem: string;
  why_it_matters: string;
  guide_steps: string[];
  status: 'pending' | 'completed';
}

export interface PublishLog {
  id: string;
  campaign_id: string;
  campaign_name: string;
  platform: PlatformId;
  status: 'published' | 'scheduled' | 'rolled_back';
  timestamp: string;
  published_by: string;
  api_response: string;
  scheduled_at?: string;
  content_preview?: string;
}

export interface AccountProfile {
  client_name: string;
  account_id: string;
  platforms: PlatformId[];
  target_roas: number;
  target_cpa: number;
  monthly_budget: number;
  privacy_class: 'public' | 'internal' | 'confidential' | 'restricted';
  guardrails: {
    max_daily_budget_change_pct: number;
    require_human_approval: boolean;
    auto_pause_fatigued_creatives: boolean;
  };
}

export interface AdCommentReply {
  id: string;
  author: string;
  timestamp: string;
  text: string;
  is_official_reply?: boolean;
}

export interface AdComment {
  id: string;
  author: string;
  avatar_initials?: string;
  timestamp: string;
  text: string;
  sentiment: 'positive' | 'question' | 'objection' | 'neutral';
  likes_count: number;
  replies: AdCommentReply[];
}

export interface DailyAnalytics {
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  cpc: number;
  roas: number;
}

export interface RunningAd {
  id: string;
  campaign_id: string;
  campaign_name: string;
  ad_name: string;
  platform: PlatformId;
  status: 'active' | 'paused' | 'learning';
  daily_budget: number;
  spend_so_far: number;
  headline: string;
  primary_text: string;
  launch_date: string;
  views: number; // Impressions / Video Views
  clicks: number;
  shares: number;
  comments_count: number;
  comments: AdComment[];
  analytics_history?: DailyAnalytics[];
}
