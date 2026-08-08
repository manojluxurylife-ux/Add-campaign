import React, { useState } from 'react';
import {
  PlatformId,
  CampaignDraft,
  CoachFixItem,
  PublishLog,
  AccountProfile,
  RunningAd,
} from '../types';
import { PLATFORMS, MOCK_RUNNING_ADS } from '../data/mockData';
import { CampaignAnalyticsChart } from './CampaignAnalyticsChart';
import {
  Rocket,
  Sparkles,
  Bot,
  Send,
  CheckCircle2,
  AlertTriangle,
  Zap,
  TrendingUp,
  FileText,
  Video,
  Image,
  Copy,
  Plus,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  BookOpen,
  Calendar,
  Clock,
  Eye,
  X,
  Edit3,
  Trash2,
  DollarSign,
  Users,
  Target,
  Key,
  Layers,
  Layout,
  Globe,
  Loader2,
  Check,
  ChevronRight,
  ExternalLink,
  Award,
  BarChart3,
  Flame,
  MessageSquare,
  Share2,
  CornerDownRight,
  ThumbsUp,
  MessageCircle,
  PlaySquare,
  Radio,
  Search,
  Filter,
} from 'lucide-react';

interface CreationAndPostingViewProps {
  profile: AccountProfile;
}

export const CreationAndPostingView: React.FC<CreationAndPostingViewProps> = ({ profile }) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'builder' | 'content' | 'running_ads' | 'coach' | 'publish' | 'optimizer'
  >('builder');

  // --- LIVE RUNNING ADS & SOCIAL ENGAGEMENT STATE ---
  const [runningAds, setRunningAds] = useState<RunningAd[]>(MOCK_RUNNING_ADS);
  const [selectedAdForComments, setSelectedAdForComments] = useState<RunningAd | null>(null);
  const [runningAdsPlatformFilter, setRunningAdsPlatformFilter] = useState<string>('all');
  const [replyInputMap, setReplyInputMap] = useState<Record<string, string>>({});
  const [isGeneratingAiReply, setIsGeneratingAiReply] = useState<string | null>(null);
  const [collapsedAnalyticsMap, setCollapsedAnalyticsMap] = useState<Record<string, boolean>>({});

  const toggleAnalyticsChart = (adId: string) => {
    setCollapsedAnalyticsMap((prev) => ({ ...prev, [adId]: !prev[adId] }));
  };

  // Handle posting reply directly to comment on running ad
  const handlePostReply = (adId: string, commentId: string) => {
    const text = replyInputMap[commentId];
    if (!text || !text.trim()) return;

    const newReply = {
      id: `RPL-${Date.now().toString().slice(-4)}`,
      author: `${profile.client_name || 'Acme Cloud Ops'} (Campaign Manager)`,
      timestamp: 'Just now',
      text: text.trim(),
      is_official_reply: true,
    };

    setRunningAds((prev) =>
      prev.map((ad) => {
        if (ad.id === adId) {
          return {
            ...ad,
            comments_count: ad.comments_count + 1,
            comments: ad.comments.map((c) => {
              if (c.id === commentId) {
                return { ...c, replies: [...c.replies, newReply] };
              }
              return c;
            }),
          };
        }
        return ad;
      })
    );

    if (selectedAdForComments && selectedAdForComments.id === adId) {
      setSelectedAdForComments((prev) =>
        prev
          ? {
              ...prev,
              comments_count: prev.comments_count + 1,
              comments: prev.comments.map((c) =>
                c.id === commentId ? { ...c, replies: [...c.replies, newReply] } : c
              ),
            }
          : null
      );
    }

    setReplyInputMap((prev) => ({ ...prev, [commentId]: '' }));
  };

  // Handle AI Generating On-Brand Reply
  const handleGenerateAiReply = async (commentText: string, commentId: string) => {
    setIsGeneratingAiReply(commentId);
    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Generate a concise, friendly, and helpful response from the Campaign Manager to this ad comment: "${commentText}". Max 2 sentences.`,
          mode: 'copy',
          platform: 'meta',
        }),
      });
      const data = await res.json();
      if (data && data.output) {
        setReplyInputMap((prev) => ({ ...prev, [commentId]: data.output.trim() }));
      }
    } catch (err) {
      console.error(err);
      setReplyInputMap((prev) => ({
        ...prev,
        [commentId]: 'Thanks for reaching out! Our team is available 24/7 to answer your questions and assist with setup.',
      }));
    } finally {
      setIsGeneratingAiReply(null);
    }
  };

  // --- MODULE 1: INTERVIEW & CAMPAIGN BUILDER STATE ---
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const [businessName, setBusinessName] = useState(profile.client_name || 'Acme Cloud Ops');
  const [website, setWebsite] = useState('https://acmecloud.io');
  const [productDetails, setProductDetails] = useState(
    'Enterprise cloud cost optimization software saving 30% on AWS/GCP bills. Target audience: Head of DevOps, VP Infrastructure. Offer: Free 14-day trial & zero setup fee.'
  );
  const [targetCountry, setTargetCountry] = useState('United States & Canada');
  const [monthlyBudgetInput, setMonthlyBudgetInput] = useState('15000');
  const [campaignGoal, setCampaignGoal] = useState('Lead Generation / Free Trials');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<{
    niche: string;
    competitors: string[];
    sellingPoints: string[];
    painPoints: string[];
    buyerPersona: string;
  } | null>({
    niche: 'B2B Cloud Infrastructure & FinOps SaaS',
    competitors: ['CloudHealth by VMware', 'Anodot', 'Apptio', 'Vantage.sh'],
    sellingPoints: [
      '30% Guaranteed cloud bill reduction',
      'Automated AI server right-sizing without downtime',
      'Zero setup fee with 14-day risk-free trial',
    ],
    painPoints: [
      'Unused cloud resources causing monthly bill surprises',
      'DevOps teams lacking visibility into AWS/GCP cost spikes',
      'Manual cloud optimization taking away engineer focus',
    ],
    buyerPersona: 'Head of DevOps / VP Infrastructure / FinOps Manager (30-50yo, High Tech Tech hubs)',
  });

  const [generatedDrafts, setGeneratedDrafts] = useState<CampaignDraft[]>([
    {
      id: 'DRAFT-GOOG-101',
      business_name: 'Acme Cloud Ops',
      website: 'https://acmecloud.io',
      platform: 'google',
      campaign_name: 'GOOG_Search_B2B_CloudSavings_Intent_US',
      daily_budget: 150,
      target_audience: 'DevOps Leads, Cloud Architects (28-54, Tech hubs)',
      keywords: ['cloud cost optimization', 'reduce aws bill', 'gcp cost monitor', 'finops platform'],
      headlines: ['Save 30% On AWS & GCP Bills', 'Automated FinOps Infrastructure', 'Zero Setup Cost Cloud Audit'],
      primary_texts: [
        'Stop overpaying for idle cloud servers. Acme Cloud Ops automatically optimizes AWS/GCP instances in real-time.',
      ],
      call_to_action: 'Start Free 14-Day Trial',
      landing_page_headline: 'Cut AWS Cloud Spend By 30% in 15 Minutes',
      status: 'audited',
      audit_score: 100,
      audit_issues: [],
    },
    {
      id: 'DRAFT-META-102',
      business_name: 'Acme Cloud Ops',
      website: 'https://acmecloud.io',
      platform: 'meta',
      campaign_name: 'META_Reels_CloudSavings_FounderHook',
      daily_budget: 200,
      target_audience: 'Interest: DevOps, Kubernetes, Cloud Computing, AWS (Lookalike 1%)',
      keywords: ['#DevOps', '#AWS', '#FinOps'],
      headlines: ['Are You Overpaying AWS?', 'DevOps Teams Save 30% Today', 'Claim Free Cloud Audit'],
      primary_texts: [
        'DevOps leaders: How much cloud budget did your team waste last month? See how Acme Cloud Ops cuts infrastructure spend automatically.',
      ],
      call_to_action: 'Get Free Audit',
      landing_page_headline: 'Automated Cloud FinOps Engine for Scaleups',
      status: 'draft',
      audit_score: 82,
      audit_issues: [
        {
          reason: 'Primary copy lacks social proof metric & Meta Advantage+ placement asset sizing',
          guidance: 'Adding a quantifiable proof point (e.g., "$14k average monthly savings per team") and 9:16 vertical video assets boosts Meta Reels conversion rates by 28%.',
          fix_suggestion: 'Inject verified customer ROI metric ($14k/mo average savings) into primary text and enable 9:16 Advantage+ placement optimization.'
        }
      ],
    },
    {
      id: 'DRAFT-YT-104',
      business_name: 'Acme Cloud Ops',
      website: 'https://acmecloud.io',
      platform: 'youtube',
      campaign_name: 'YT_InStream_CloudSavings_TechLeaders',
      daily_budget: 220,
      target_audience: 'YouTube Tech Channels, Cloud Video Viewers (Ages 25-54)',
      keywords: ['#AWSCloud', '#DevOpsTutorial', '#FinOpsTool'],
      headlines: ['Stop Overpaying AWS In 2026', 'Automated Cloud Savings Engine'],
      primary_texts: [
        'Hook (0-5s): Is your monthly AWS bill giving your CFO heart palpitations? Watch how Acme Cloud Ops automatically trims idle cloud instances in 15 minutes.'
      ],
      call_to_action: 'Watch 2-Min Demo',
      landing_page_headline: 'YouTube Exclusive: Instant AWS & GCP Cost Analysis',
      status: 'audited',
      audit_score: 88,
      audit_issues: [
        {
          reason: 'Missing YouTube Sitelink Extensions & 300x60 Companion Banner',
          guidance: 'Adding 4 sitelink extensions and a 300x60 custom companion banner increases YouTube In-Stream CTR by up to 35%.',
          fix_suggestion: 'Attach Companion Banner & 4 High-Intent Sitelinks (Pricing, ROI Calculator, Case Studies, Free Audit).'
        }
      ],
    },
    {
      id: 'DRAFT-TT-103',
      business_name: 'Acme Cloud Ops',
      website: 'https://acmecloud.io',
      platform: 'tiktok',
      campaign_name: 'TT_Spark_DevOps_CostChallenge',
      daily_budget: 180,
      target_audience: 'Ages 21-45, Cloud Engineers, Tech Lead Interests',
      keywords: ['#DevOpsLife', '#CloudEngineering', '#FinOps'],
      headlines: ['How We Reduced AWS Spend by 35%'],
      primary_texts: [
        'Cloud bill spike again? Watch how automated server right-sizing saved $14,000 this month alone.'
      ],
      call_to_action: 'Watch Demo',
      landing_page_headline: 'TikTok Exclusive: Save 35% on Cloud Infrastructure',
      status: 'scheduled',
      scheduled_at: `${new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10)} 09:00 AM`,
      audit_score: 91,
      audit_issues: [
        {
          reason: 'Video hook text lacks 3-second visual text overlay callout',
          guidance: 'TikTok native videos with bright text overlay in the first 3 seconds achieve 45% higher watch completion.',
          fix_suggestion: 'Add yellow text overlay sticker: "POV: Your cloud bill drops 30% overnight".'
        }
      ],
    },
  ]);

  // --- SCHEDULER & CONTENT INSPECTOR STATE ---
  const [inspectDraftModal, setInspectDraftModal] = useState<CampaignDraft | null>(null);
  const [scheduleDraftModal, setScheduleDraftModal] = useState<CampaignDraft | null>(null);
  const [auditDraftModal, setAuditDraftModal] = useState<CampaignDraft | null>(null);
  const [scheduledDate, setScheduledDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().slice(0, 10)
  );
  const [scheduledTime, setScheduledTime] = useState<string>('09:00');
  const [inspectLogModal, setInspectLogModal] = useState<PublishLog | null>(null);

  // Auto-Fix Audit Score to 100/100
  const handleFixDraftScoreTo100 = (draftId: string) => {
    setGeneratedDrafts((prev) =>
      prev.map((d) => {
        if (d.id === draftId) {
          return {
            ...d,
            audit_score: 100,
            audit_issues: [],
            status: d.status === 'draft' ? ('audited' as const) : d.status,
          };
        }
        return d;
      })
    );
    if (auditDraftModal?.id === draftId) {
      setAuditDraftModal((prev) =>
        prev
          ? {
              ...prev,
              audit_score: 100,
              audit_issues: [],
              status: prev.status === 'draft' ? ('audited' as const) : prev.status,
            }
          : null
      );
    }
  };

  // --- MODULE 2: AI CONTENT STUDIO STATE ---
  const [contentPlatform, setContentPlatform] = useState<PlatformId>('meta');
  const [contentFormat, setContentFormat] = useState<
    'ad_copy' | 'reel_script' | 'youtube_script' | 'landing_page'
  >('ad_copy');
  const [contentPrompt, setContentPrompt] = useState(
    'Create high-converting ad headlines and primary text for a 20% discount offer on Enterprise FinOps cloud management.'
  );
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);

  // --- MODULE 3: CAMPAIGN COACH "PATH TO 100" STATE ---
  const [currentScore, setCurrentScore] = useState(68);
  const [coachFixes, setCoachFixes] = useState<CoachFixItem[]>([
    {
      id: 'FIX-01',
      title: 'Setup Meta Conversions API (CAPI) Server-Side Signal',
      control_id: 'TRK-META-CAPI',
      platform: 'meta',
      impact_points: 12,
      problem: 'Missing server-side event tracking causes 25% signal loss on iOS devices.',
      why_it_matters: 'Server-side CAPI reduces CPA by up to 22% by providing deterministic attribution.',
      guide_steps: [
        'Deploy server-side event proxy.',
        'Send SHA256 hashed email & phone parameters.',
        'Verify match rate >= 8.5/10 in Meta Events Manager.',
      ],
      status: 'pending',
    },
    {
      id: 'FIX-02',
      title: 'Add 15 Negative Keywords to Google Search Campaign',
      control_id: 'KW-GOOG-NEG',
      platform: 'google',
      impact_points: 8,
      problem: 'Budget bleeding on informational searches like "free aws tutorial" and "cloud jobs".',
      why_it_matters: 'Excluding non-converting search queries instantly increases CTR and conversion rate.',
      guide_steps: [
        'Review search query report for past 30 days.',
        'Add negative exact match terms: "jobs", "tutorial", "salary", "pdf".',
        'Set list as Shared Negative Keyword List.',
      ],
      status: 'pending',
    },
    {
      id: 'FIX-03',
      title: 'Refresh Fatigued Video Creative on TikTok & Reels',
      control_id: 'CRE-TT-FATIGUE',
      platform: 'tiktok',
      impact_points: 7,
      problem: 'Video ad frequency exceeded 4.2x with a 31% drop in CTR over 7 days.',
      why_it_matters: 'Fresh video hooks prevent audience fatigue and restore algorithmic CPM delivery.',
      guide_steps: [
        'Generate 3 new UGC video hooks with text overlays.',
        'Upload 9:16 vertical video assets.',
        'Set up automated fatigue pause rule.',
      ],
      status: 'pending',
    },
    {
      id: 'FIX-04',
      title: 'Optimize Landing Page Above-The-Fold Value Prop',
      control_id: 'LP-CRO-04',
      platform: 'google',
      impact_points: 5,
      problem: 'Landing page bounce rate is 64% on mobile traffic.',
      why_it_matters: 'Aligning headline directly with search query intent boosts Quality Score and conversion.',
      guide_steps: [
        'Update H1 headline to mirror top ad copy.',
        'Move primary CTA button above the fold on mobile.',
        'Add trust badges (AWS Partner, SOC2 Certified).',
      ],
      status: 'pending',
    },
  ]);
  const [activeGuideModal, setActiveGuideModal] = useState<CoachFixItem | null>(null);

  // --- MODULE 4: PUBLISH MANAGER STATE ---
  const [publishLogs, setPublishLogs] = useState<PublishLog[]>([
    {
      id: 'PUB-9901',
      campaign_id: 'DRAFT-GOOG-101',
      campaign_name: 'GOOG_Search_B2B_CloudSavings_Intent_US',
      platform: 'google',
      status: 'published',
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      published_by: 'Operator (human-approved)',
      api_response: '200 OK - Google Ads API mutate SUCCESS (Campaign ID: 98124912)',
      content_preview: 'Headline: Save 30% On AWS & GCP Bills\nPrimary Text: Stop overpaying for idle cloud servers. Acme Cloud Ops automatically optimizes AWS/GCP instances in real-time.',
    },
    {
      id: 'SCH-8802',
      campaign_id: 'DRAFT-TT-103',
      campaign_name: 'TT_Spark_DevOps_CostChallenge',
      platform: 'tiktok',
      status: 'scheduled',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      scheduled_at: `${new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10)} 09:00 AM`,
      published_by: 'Operator (Scheduled)',
      api_response: 'Queued for TikTok Marketing API auto-posting engine',
      content_preview: 'Headline: How We Reduced AWS Spend by 35%\nPrimary Text: Cloud bill spike again? Watch how automated server right-sizing saved $14,000 this month alone.',
    },
  ]);
  const [isPublishing, setIsPublishing] = useState<string | null>(null);

  // --- MODULE 5: AI OPTIMIZATION ENGINE STATE ---
  const [optimizations, setOptimizations] = useState([
    {
      id: 'OPT-101',
      platform: 'google' as PlatformId,
      campaign: 'GOOG_Search_B2B_CloudSavings_Intent_US',
      type: 'scale',
      title: 'Scale High-ROAS Search Campaign (+20% Daily Budget)',
      metric: 'ROAS 4.6x (Target 3.8x) | CPA $28.50',
      reasoning: 'Campaign performance exceeded target ROAS for 5 consecutive days with impression share loss due to budget limit.',
      applied: false,
    },
    {
      id: 'OPT-102',
      platform: 'meta' as PlatformId,
      campaign: 'META_Reels_CloudSavings_FounderHook',
      type: 'creative_refresh',
      title: 'Deploy UGC Video Variant B to Counter Ad Fatigue',
      metric: 'Frequency 3.9x | CTR dropped -22%',
      reasoning: 'Ad fatigue detected. Switching to new UGC founder interview angle.',
      applied: false,
    },
    {
      id: 'OPT-103',
      platform: 'tiktok' as PlatformId,
      campaign: 'TT_Spark_DevOps_Challenge',
      type: 'audience',
      title: 'Expand Lookalike Audience from 1% to 3%',
      metric: 'CPA $19.20 | Reach Saturation 84%',
      reasoning: 'Current 1% lookalike audience is saturated. Expanding targeting unlocks fresh inventory.',
      applied: false,
    },
  ]);

  // --- HANDLERS ---

  // Handle Business Interview AI Generation
  const handleRunBusinessAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const prompt = `Analyze this business and generate a complete multi-platform paid media strategy:
Business Name: ${businessName}
Website: ${website}
Product Details: ${productDetails}
Target Country: ${targetCountry}
Monthly Budget: $${monthlyBudgetInput}
Primary Goal: ${campaignGoal}`;

      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          mode: 'business_analysis',
          platform: 'multi-platform',
        }),
      });
      const data = await res.json();

      setAiAnalysisResult({
        niche: 'B2B Cloud Infrastructure & FinOps SaaS',
        competitors: ['CloudHealth by VMware', 'Anodot', 'Apptio', 'Vantage.sh'],
        sellingPoints: [
          '30% Guaranteed cloud bill reduction',
          'Automated AI server right-sizing without downtime',
          'Zero setup fee with 14-day risk-free trial',
        ],
        painPoints: [
          'Unused cloud resources causing monthly bill surprises',
          'DevOps teams lacking visibility into AWS/GCP cost spikes',
          'Manual cloud optimization taking away engineer focus',
        ],
        buyerPersona: 'Head of DevOps / VP Infrastructure / FinOps Manager (30-50yo, High Tech Tech hubs)',
      });

      // Automatically generate a new multi-platform draft package including YouTube
      const newDraftGoogle: CampaignDraft = {
        id: `DRAFT-GOOG-${Date.now().toString().slice(-3)}`,
        business_name: businessName,
        website: website,
        platform: 'google',
        campaign_name: `GOOG_Search_${businessName.replace(/\s+/g, '')}_Intent`,
        daily_budget: Math.round(Number(monthlyBudgetInput) * 0.4 / 30) || 150,
        target_audience: `${targetCountry} - High Intent Searchers`,
        keywords: ['cloud cost software', 'reduce aws bill', 'finops platform', 'cloud optimization tool'],
        headlines: [
          `Save 30% On AWS - ${businessName}`,
          'Automated Cloud Cost Engine',
          'Free 14-Day Cloud Audit Trial',
        ],
        primary_texts: [
          `Cut AWS and GCP infrastructure bills by 30% automatically. Zero code setup with ${businessName}.`,
        ],
        call_to_action: 'Start Free Trial',
        landing_page_headline: `Cut Cloud Infrastructure Spend with ${businessName}`,
        status: 'draft',
        audit_score: 100,
        audit_issues: [],
      };

      const newDraftMeta: CampaignDraft = {
        id: `DRAFT-META-${Date.now().toString().slice(-3)}`,
        business_name: businessName,
        website: website,
        platform: 'meta',
        campaign_name: `META_Reels_${businessName.replace(/\s+/g, '')}_FounderHook`,
        daily_budget: Math.round(Number(monthlyBudgetInput) * 0.3 / 30) || 120,
        target_audience: 'DevOps, AWS, Cloud Computing, Kubernetes (Lookalike 1%)',
        keywords: ['#DevOps', '#CloudCosts', '#FinOps'],
        headlines: ['Stop Overpaying AWS', 'DevOps Teams Cut Bills 30%', 'Free Cloud Audit'],
        primary_texts: [
          `DevOps Leaders: How much cloud budget did your team waste last month? Try ${businessName} free for 14 days.`,
        ],
        call_to_action: 'Get Free Audit',
        landing_page_headline: 'Automated Cloud FinOps Engine for DevOps',
        status: 'draft',
        audit_score: 82,
        audit_issues: [
          {
            reason: 'Primary text lacks social proof ROI metric',
            guidance: 'Adding a quantifiable metric (e.g. "Save $14,000/month on AWS") increases conversion rate by 28%.',
            fix_suggestion: 'Inject verified customer ROI metric ($14k/mo average savings) into primary text.'
          }
        ],
      };

      const newDraftYouTube: CampaignDraft = {
        id: `DRAFT-YT-${Date.now().toString().slice(-3)}`,
        business_name: businessName,
        website: website,
        platform: 'youtube',
        campaign_name: `YT_InStream_${businessName.replace(/\s+/g, '')}_VideoDemo`,
        daily_budget: Math.round(Number(monthlyBudgetInput) * 0.3 / 30) || 120,
        target_audience: 'YouTube Tech Channels, Cloud Video Viewers (Ages 25-54)',
        keywords: ['#AWS', '#DevOps', '#FinOps'],
        headlines: [`Cut AWS Spend 30% with ${businessName}`, 'Automated Cloud Savings Engine'],
        primary_texts: [
          `Hook (0-5s): Is your monthly AWS bill giving your CFO heart palpitations? Watch how ${businessName} trims idle cloud instances in 15 minutes.`,
        ],
        call_to_action: 'Watch 2-Min Demo',
        landing_page_headline: `YouTube Special: Free AWS Audit with ${businessName}`,
        status: 'draft',
        audit_score: 88,
        audit_issues: [
          {
            reason: 'Missing YouTube Sitelink Extensions & 300x60 Companion Banner',
            guidance: 'Adding 4 sitelink extensions and a custom companion banner increases YouTube In-Stream CTR by up to 35%.',
            fix_suggestion: 'Attach Companion Banner & 4 High-Intent Sitelinks (Pricing, ROI Calculator, Case Studies, Free Audit).'
          }
        ],
      };

      setGeneratedDrafts((prev) => [newDraftGoogle, newDraftMeta, newDraftYouTube, ...prev]);
      setWizardStep(3);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate Ad Content in Studio
  const handleGenerateContent = async () => {
    if (!contentPrompt.trim()) return;
    setIsGeneratingContent(true);
    setGeneratedContent(null);

    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Platform: ${contentPlatform}. Format: ${contentFormat}. Detail: ${contentPrompt}`,
          mode: contentFormat,
          platform: contentPlatform,
        }),
      });
      const data = await res.json();
      setGeneratedContent(data.output);
    } catch (err) {
      console.error(err);
      setGeneratedContent('Failed to generate copy.');
    } finally {
      setIsGeneratingContent(false);
    }
  };

  // Handle Apply Fix in Campaign Coach
  const handleApplyFix = (fixId: string) => {
    setCoachFixes((prev) =>
      prev.map((f) => {
        if (f.id === fixId && f.status === 'pending') {
          setCurrentScore((s) => Math.min(100, s + f.impact_points));
          return { ...f, status: 'completed' as const };
        }
        return f;
      })
    );
  };

  // Handle One-Click Publish
  const handlePublishCampaign = (draft: CampaignDraft) => {
    setIsPublishing(draft.id);
    setTimeout(() => {
      setGeneratedDrafts((prev) =>
        prev.map((d) => (d.id === draft.id ? { ...d, status: 'published' as const } : d))
      );

      const newLog: PublishLog = {
        id: `PUB-${Date.now().toString().slice(-4)}`,
        campaign_id: draft.id,
        campaign_name: draft.campaign_name,
        platform: draft.platform,
        status: 'published',
        timestamp: new Date().toISOString(),
        published_by: 'Operator (human-approved)',
        api_response: `200 OK - Published to ${draft.platform.toUpperCase()} Marketing API`,
        content_preview: `Headline: ${draft.headlines[0] || 'N/A'}\nPrimary Text: ${draft.primary_texts[0] || 'N/A'}`,
      };

      setPublishLogs((prev) => [newLog, ...prev]);
      setIsPublishing(null);
    }, 1500);
  };

  // Handle Confirm Schedule
  const handleConfirmSchedule = (draft: CampaignDraft, dateStr: string, timeStr: string) => {
    const formattedDateTime = `${dateStr} ${timeStr}`;
    setGeneratedDrafts((prev) =>
      prev.map((d) =>
        d.id === draft.id ? { ...d, status: 'scheduled' as const, scheduled_at: formattedDateTime } : d
      )
    );

    const newLog: PublishLog = {
      id: `SCH-${Date.now().toString().slice(-4)}`,
      campaign_id: draft.id,
      campaign_name: draft.campaign_name,
      platform: draft.platform,
      status: 'scheduled',
      timestamp: new Date().toISOString(),
      scheduled_at: formattedDateTime,
      published_by: 'Operator (Scheduled)',
      api_response: `Queued for ${draft.platform.toUpperCase()} API auto-dispatch on ${formattedDateTime}`,
      content_preview: `Headlines: ${draft.headlines.join(' | ')}\nPrimary Text: ${draft.primary_texts.join(' ')}\nCTA: ${draft.call_to_action}`,
    };

    setPublishLogs((prev) => [newLog, ...prev]);
    setScheduleDraftModal(null);
    if (inspectDraftModal?.id === draft.id) {
      setInspectDraftModal({ ...draft, status: 'scheduled', scheduled_at: formattedDateTime });
    }
  };

  // Handle Cancel Schedule
  const handleCancelSchedule = (campaignId: string) => {
    setGeneratedDrafts((prev) =>
      prev.map((d) => (d.id === campaignId ? { ...d, status: 'draft' as const, scheduled_at: undefined } : d))
    );
    setPublishLogs((prev) =>
      prev.map((l) =>
        l.campaign_id === campaignId
          ? { ...l, status: 'rolled_back' as const, api_response: 'Schedule cancelled by operator' }
          : l
      )
    );
  };

  // Create draft from studio content and open schedule modal
  const handleSaveStudioContentAsDraftAndSchedule = () => {
    if (!generatedContent) return;
    const newDraft: CampaignDraft = {
      id: `DRAFT-${contentPlatform.toUpperCase()}-${Date.now().toString().slice(-3)}`,
      business_name: businessName,
      website: website,
      platform: contentPlatform,
      campaign_name: `${contentPlatform.toUpperCase()}_Studio_${contentFormat}_${Date.now().toString().slice(-4)}`,
      daily_budget: 150,
      target_audience: 'Targeted Campaign Audience',
      keywords: ['#GeneratedContent', '#GenAI'],
      headlines: [generatedContent.slice(0, 40).replace(/\n/g, ' ')],
      primary_texts: [generatedContent],
      call_to_action: 'Learn More',
      landing_page_headline: businessName,
      status: 'draft',
    };
    setGeneratedDrafts((prev) => [newDraft, ...prev]);
    setScheduleDraftModal(newDraft);
  };

  // Handle Apply Optimization
  const handleApplyOptimization = (id: string) => {
    setOptimizations((prev) =>
      prev.map((o) => (o.id === id ? { ...o, applied: true } : o))
    );
  };

  return (
    <div className="space-y-6">
      {/* Creation & Posting Master Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Rocket className="w-48 h-48 text-indigo-400" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-indigo-500 text-slate-950 shadow-sm">
                CampaignPilot AI
              </span>
              <span className="text-xs text-indigo-300 font-mono">v2.4 Full Automation Engine</span>
            </div>
            <h2 className="text-2xl font-black text-white font-display flex items-center gap-2">
              <Rocket className="w-6 h-6 text-indigo-400" />
              <span>Creation & Posting Suite</span>
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Create multi-platform ad campaigns, generate AI video scripts & landing pages, coach portfolio score to 100/100, and publish directly across 12 ad networks with human-in-the-loop safety.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-3 rounded-2xl border border-indigo-500/20 text-xs">
            <div className="text-right">
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Portfolio Score</span>
              <span className="text-lg font-black text-emerald-400">{currentScore} / 100</span>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="text-right">
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Active Drafts</span>
              <span className="text-lg font-black text-indigo-400">{generatedDrafts.length}</span>
            </div>
          </div>
        </div>

        {/* Sub-Tabs Selector */}
        <div className="flex flex-wrap items-center gap-2 pt-6 mt-6 border-t border-slate-800/80">
          {[
            { id: 'builder', label: '1. AI Campaign Builder', icon: Rocket, badge: 'Wizard' },
            { id: 'content', label: '2. AI Content Studio', icon: Sparkles, badge: 'GenAI' },
            { id: 'running_ads', label: '3. Live Running Ads & Comments', icon: Radio, badge: `${runningAds.length} live` },
            { id: 'coach', label: '4. Campaign Coach (Path to 100)', icon: Award, badge: `${100 - currentScore} pts gap` },
            { id: 'publish', label: '5. Publish Manager', icon: Send, badge: `${generatedDrafts.filter(d => d.status !== 'published').length} ready` },
            { id: 'optimizer', label: '6. AI Optimization Engine', icon: Zap, badge: `${optimizations.filter(o => !o.applied).length} alerts` },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-indigo-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isSelected ? 'bg-indigo-900/60 text-indigo-200' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODULE 1: AI CAMPAIGN BUILDER & BUSINESS INTERVIEW WIZARD                  */}
      {/* ========================================================================= */}
      {activeSubTab === 'builder' && (
        <div className="space-y-6">
          {/* Wizard Progress Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setWizardStep(1)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                wizardStep === 1
                  ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-md'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-1">
                <span>Step 1: Business Interview</span>
                <span className="text-indigo-400 font-mono">01/03</span>
              </div>
              <p className="text-xs font-medium text-slate-300">Enter organization details, products, target audience & goals.</p>
            </button>

            <button
              onClick={() => setWizardStep(2)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                wizardStep === 2
                  ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-md'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-1">
                <span>Step 2: AI Business Analysis</span>
                <span className="text-indigo-400 font-mono">02/03</span>
              </div>
              <p className="text-xs font-medium text-slate-300">Identify niche, competitors, selling points & buyer personas.</p>
            </button>

            <button
              onClick={() => setWizardStep(3)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                wizardStep === 3
                  ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-md'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-1">
                <span>Step 3: Multi-Platform Campaign Draft</span>
                <span className="text-indigo-400 font-mono">03/03</span>
              </div>
              <p className="text-xs font-medium text-slate-300">Review generated Google, Meta, TikTok & LinkedIn campaigns.</p>
            </button>
          </div>

          {/* Step 1 Form */}
          {wizardStep === 1 && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Bot className="w-5 h-5 text-indigo-400" />
                    <span>Business Interview Wizard</span>
                  </h3>
                  <p className="text-xs text-slate-400">Provide details so CampaignPilot AI can build targeted campaigns across search, video, and social channels.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Business / Brand Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Website URL</label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Geographic Regions</label>
                  <input
                    type="text"
                    value={targetCountry}
                    onChange={(e) => setTargetCountry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Monthly Paid Media Budget ($ USD)</label>
                  <input
                    type="number"
                    value={monthlyBudgetInput}
                    onChange={(e) => setMonthlyBudgetInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Campaign Goal</label>
                  <select
                    value={campaignGoal}
                    onChange={(e) => setCampaignGoal(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Lead Generation / Free Trials">Lead Generation / Free Trials</option>
                    <option value="E-commerce Direct Purchases">E-commerce Direct Purchases</option>
                    <option value="Brand Awareness & Video Views">Brand Awareness & Video Views</option>
                    <option value="Mobile App Installs">Mobile App Installs</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Products, Services, Selling Points & Offer Details</label>
                  <textarea
                    rows={4}
                    value={productDetails}
                    onChange={(e) => setProductDetails(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleRunBusinessAnalysis}
                  disabled={isAnalyzing}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-500 hover:from-indigo-500 hover:to-amber-400 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                      <span>Analyzing Business & Building Campaign Drafts...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Run AI Business Analyzer & Build Campaigns</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 2 AI Analysis View */}
          {wizardStep === 2 && aiAnalysisResult && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span>AI Business Intelligence Report</span>
                  </h3>
                  <p className="text-xs text-slate-400">Deep strategic profile generated for {businessName}</p>
                </div>
                <button
                  onClick={() => setWizardStep(3)}
                  className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <span>View Campaign Drafts</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">Market Niche & Category</span>
                  <p className="text-sm font-semibold text-white">{aiAnalysisResult.niche}</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Target Buyer Persona</span>
                  <p className="text-xs text-slate-200">{aiAnalysisResult.buyerPersona}</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Core Value Proposition / Selling Points</span>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    {aiAnalysisResult.sellingPoints.map((sp, idx) => (
                      <li key={idx}>{sp}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">Customer Pain Points to Target</span>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    {aiAnalysisResult.painPoints.map((pp, idx) => (
                      <li key={idx}>{pp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 Campaign Drafts View */}
          {wizardStep === 3 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>Generated Multi-Platform Campaign Drafts ({generatedDrafts.length})</span>
                </h3>
                <button
                  onClick={() => setWizardStep(1)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Rerun Wizard</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {generatedDrafts.map((draft) => (
                  <div key={draft.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{draft.platform}</span>
                          <span className="text-xs text-slate-500 font-mono">{draft.id}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase flex items-center gap-1 ${
                            draft.status === 'published'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : draft.status === 'scheduled'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-indigo-500/20 text-indigo-300'
                          }`}>
                            {draft.status === 'scheduled' && <Clock className="w-3 h-3" />}
                            {draft.status}
                          </span>
                          <button
                            onClick={() => setAuditDraftModal(draft)}
                            className={`text-[10px] px-2.5 py-0.5 rounded font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
                              (draft.audit_score || 100) === 100
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                            }`}
                            title="Click to view Audit score details & guide"
                          >
                            {(draft.audit_score || 100) === 100 ? (
                              <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <AlertTriangle className="w-3 h-3 text-amber-400" />
                            )}
                            <span>Score: {draft.audit_score || 100}/100</span>
                          </button>
                          {draft.scheduled_at && draft.status === 'scheduled' && (
                            <span className="text-[10px] text-amber-300 font-mono">
                              (At: {draft.scheduled_at})
                            </span>
                          )}
                        </div>
                        <h4 className="text-base font-bold text-white">{draft.campaign_name}</h4>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                          ${draft.daily_budget}/day
                        </span>

                        <button
                          onClick={() => setInspectDraftModal(draft)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Inspect Content</span>
                        </button>

                        <button
                          onClick={() => {
                            setScheduleDraftModal(draft);
                            if (draft.scheduled_at) {
                              const [d, t] = draft.scheduled_at.split(' ');
                              if (d) setScheduledDate(d);
                              if (t) setScheduledTime(t.slice(0, 5));
                            }
                          }}
                          className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
                        >
                          <Calendar className="w-3.5 h-3.5 text-amber-400" />
                          <span>{draft.status === 'scheduled' ? 'Reschedule' : 'Schedule'}</span>
                        </button>

                        {draft.status !== 'published' && (
                          <button
                            onClick={() => handlePublishCampaign(draft)}
                            disabled={isPublishing === draft.id}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            {isPublishing === draft.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Send className="w-3.5 h-3.5" />
                            )}
                            <span>{isPublishing === draft.id ? 'Publishing...' : 'One-Click Publish'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Audit Gap Reason & Fix Banner */}
                    {(draft.audit_score || 100) < 100 && draft.audit_issues && draft.audit_issues.length > 0 && (
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-amber-300">
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                            <span>Audit Finding ({draft.audit_score}/100): {draft.audit_issues[0].reason}</span>
                          </div>
                          <p className="text-[11px] text-slate-300 line-clamp-1">{draft.audit_issues[0].guidance}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setAuditDraftModal(draft)}
                            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Audit Guide</span>
                          </button>
                          <button
                            onClick={() => handleFixDraftScoreTo100(draft.id)}
                            className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black text-xs rounded-lg flex items-center gap-1 cursor-pointer shadow-md transition-all"
                          >
                            <Zap className="w-3.5 h-3.5 fill-slate-950" />
                            <span>Fix to 100/100</span>
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1">
                        <span className="text-slate-400 font-semibold block">Target Audience:</span>
                        <p className="text-slate-200">{draft.target_audience}</p>
                      </div>

                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1">
                        <span className="text-slate-400 font-semibold block">Headlines (A/B Test):</span>
                        <ul className="text-slate-200 list-disc list-inside space-y-0.5">
                          {draft.headlines.map((h, idx) => (
                            <li key={idx}>{h}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1">
                        <span className="text-slate-400 font-semibold block">Keywords / Angles:</span>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {draft.keywords.map((kw, idx) => (
                            <span key={idx} className="bg-slate-900 text-indigo-300 border border-slate-800 px-2 py-0.5 rounded text-[10px] font-mono">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 2: AI CONTENT STUDIO & POST GENERATOR                              */}
      {/* ========================================================================= */}
      {activeSubTab === 'content' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Multi-Format Asset Generator</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Platform</label>
              <select
                value={contentPlatform}
                onChange={(e) => setContentPlatform(e.target.value as PlatformId)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {PLATFORMS.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Asset Format</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'ad_copy', label: 'Ad Copy & Text', icon: Copy },
                  { id: 'reel_script', label: 'Reel / Shorts Script', icon: Video },
                  { id: 'youtube_script', label: 'YouTube VSL Script', icon: Video },
                  { id: 'landing_page', label: 'Landing Page Blueprint', icon: Layout },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSel = contentFormat === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setContentFormat(item.id as any)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        isSel
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
              <label className="block text-xs font-semibold text-slate-400 mb-1">Instructions & Specific Offer</label>
              <textarea
                rows={4}
                value={contentPrompt}
                onChange={(e) => setContentPrompt(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={handleGenerateContent}
              disabled={isGeneratingContent || !contentPrompt.trim()}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGeneratingContent ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Asset with Gemini AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Content</span>
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span>Generated Output Preview</span>
                </h3>
                {generatedContent && (
                  <button
                    onClick={handleSaveStudioContentAsDraftAndSchedule}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Save & Schedule as Post</span>
                  </button>
                )}
              </div>

              {generatedContent ? (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto">
                  {generatedContent}
                </div>
              ) : (
                <div className="h-64 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-center p-6 space-y-2">
                  <Sparkles className="w-8 h-8 text-indigo-400 opacity-60" />
                  <p className="text-xs text-slate-400 font-medium">
                    Select your platform and format on the left, then click "Generate Content" to create copy variations, reel scripts, or landing page blueprints.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE: LIVE RUNNING ADS & SOCIAL ENGAGEMENT HUB                          */}
      {/* ========================================================================= */}
      {activeSubTab === 'running_ads' && (
        <div className="space-y-6">
          {/* Header Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Running Ads</span>
              <div className="flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="text-xl font-black text-white">{runningAds.length} Live</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Views / Imps</span>
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-indigo-400" />
                <span className="text-xl font-black text-indigo-300">
                  {runningAds.reduce((acc, a) => acc + a.views, 0).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Ad Clicks</span>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-xl font-black text-emerald-300">
                  {runningAds.reduce((acc, a) => acc + a.clicks, 0).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Social Shares</span>
              <div className="flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-sky-400" />
                <span className="text-xl font-black text-sky-300">
                  {runningAds.reduce((acc, a) => acc + a.shares, 0).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1 col-span-2 md:col-span-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Comments & Inquiries</span>
              <div className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span className="text-xl font-black text-amber-300">
                  {runningAds.reduce((acc, a) => acc + a.comments_count, 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Platform Filter Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400" />
                <span>Live Ads Directory & Community Management</span>
              </h3>
              <p className="text-xs text-slate-400">
                Track live impressions, engagement metrics, and respond directly to customer comments across YouTube, Meta, TikTok, and Google.
              </p>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 md:pb-0">
              {['all', 'youtube', 'meta', 'google', 'tiktok'].map((plat) => (
                <button
                  key={plat}
                  onClick={() => setRunningAdsPlatformFilter(plat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer whitespace-nowrap ${
                    runningAdsPlatformFilter === plat
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {plat === 'all' ? 'All Networks' : plat}
                </button>
              ))}
            </div>
          </div>

          {/* Running Ads Grid */}
          <div className="grid grid-cols-1 gap-4">
            {runningAds
              .filter((ad) => runningAdsPlatformFilter === 'all' || ad.platform === runningAdsPlatformFilter)
              .map((ad) => (
                <div
                  key={ad.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg hover:border-slate-700 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase font-mono tracking-wide ${
                        ad.platform === 'youtube' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                        ad.platform === 'meta' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                        ad.platform === 'google' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                      }`}>
                        {ad.platform}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{ad.id}</span>
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Live & Delivering
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 font-mono">
                      Launched: <span className="text-slate-200">{ad.launch_date}</span> • Budget: <span className="text-emerald-400 font-bold">${ad.daily_budget}/day</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Left: Ad Creative Info */}
                    <div className="lg:col-span-2 space-y-2">
                      <h4 className="text-sm font-bold text-white">{ad.campaign_name}</h4>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1 text-xs">
                        <span className="text-indigo-300 font-bold block">{ad.headline}</span>
                        <p className="text-slate-300 line-clamp-2">{ad.primary_text}</p>
                      </div>
                    </div>

                    {/* Right: Engagement Stats Cards & GA Chart Toggle */}
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block tracking-wider">
                        Real-time Ad Engagement Metrics
                      </span>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-900 p-2 rounded-lg border border-slate-800/60">
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Eye className="w-3 h-3 text-indigo-400" /> Views / Imps
                          </span>
                          <span className="font-extrabold text-white text-sm block mt-0.5">
                            {ad.views.toLocaleString()}
                          </span>
                        </div>

                        <div className="bg-slate-900 p-2 rounded-lg border border-slate-800/60">
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-emerald-400" /> Clicks (CTR)
                          </span>
                          <span className="font-extrabold text-emerald-300 text-sm block mt-0.5">
                            {ad.clicks.toLocaleString()} <span className="text-[10px] text-slate-400">({((ad.clicks / ad.views) * 100).toFixed(1)}%)</span>
                          </span>
                        </div>

                        <div className="bg-slate-900 p-2 rounded-lg border border-slate-800/60">
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Share2 className="w-3 h-3 text-sky-400" /> Shares
                          </span>
                          <span className="font-extrabold text-sky-300 text-sm block mt-0.5">
                            {ad.shares.toLocaleString()}
                          </span>
                        </div>

                        <div className="bg-slate-900 p-2 rounded-lg border border-slate-800/60">
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <MessageSquare className="w-3 h-3 text-amber-400" /> Comments
                          </span>
                          <span className="font-extrabold text-amber-300 text-sm block mt-0.5">
                            {ad.comments_count}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => setSelectedAdForComments(ad)}
                          className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-indigo-200" />
                          <span>Comments ({ad.comments_count})</span>
                        </button>

                        <button
                          onClick={() => toggleAnalyticsChart(ad.id)}
                          className={`py-2 px-3 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer border transition-all ${
                            !collapsedAnalyticsMap[ad.id]
                              ? 'bg-slate-800 text-indigo-300 border-indigo-500/30'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                          }`}
                        >
                          <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{!collapsedAnalyticsMap[ad.id] ? 'Hide Chart' : 'GA Chart'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Google Analytics Style Campaign Chart Panel */}
                  {!collapsedAnalyticsMap[ad.id] && (
                    <div className="pt-2">
                      <CampaignAnalyticsChart ad={ad} />
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 3: CAMPAIGN COACH ("PATH TO 100")                                  */}
      {/* ========================================================================= */}
      {activeSubTab === 'coach' && (
        <div className="space-y-6">
          {/* Path to 100 Progress Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold text-white font-display">Path to 100 - Portfolio Excellence Coach</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Every failed audit control is converted into a point-ranked action item. Complete fixes to elevate portfolio health to 100/100.
                </p>
              </div>

              <div className="text-right bg-slate-950 px-5 py-3 rounded-2xl border border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase block">Target Health</span>
                <span className="text-2xl font-extrabold text-emerald-400">100 / 100</span>
              </div>
            </div>

            {/* Score Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Current Portfolio Health: {currentScore}/100</span>
                <span className="text-amber-400">Remaining Potential: +{100 - currentScore} pts</span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${currentScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Action Items List */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Ranked Fix Recommendations ({coachFixes.length})</h4>

            <div className="grid grid-cols-1 gap-4">
              {coachFixes.map((fix) => {
                const isDone = fix.status === 'completed';
                return (
                  <div
                    key={fix.id}
                    className={`bg-slate-900/90 border rounded-2xl p-6 space-y-3 transition-all ${
                      isDone ? 'border-emerald-500/30 bg-emerald-950/10 opacity-80' : 'border-slate-800'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-indigo-400 uppercase font-mono">{fix.control_id}</span>
                          <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                            +{fix.impact_points} Points
                          </span>
                        </div>
                        <h4 className={`text-base font-bold ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                          {fix.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveGuideModal(fix)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                          <span>How-To Guide</span>
                        </button>

                        {!isDone ? (
                          <button
                            onClick={() => handleApplyFix(fix.id)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-950/40"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Fix Automatically (+{fix.impact_points} pts)</span>
                          </button>
                        ) : (
                          <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-lg border border-emerald-500/30 flex items-center gap-1">
                            <Check className="w-4 h-4" /> Fixed & Verified
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <strong className="text-rose-400">Problem:</strong> {fix.problem}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 4: PUBLISH MANAGER & SCHEDULER QUEUE                              */}
      {/* ========================================================================= */}
      {activeSubTab === 'publish' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                <Send className="w-5 h-5 text-indigo-400" />
                <span>Publish Manager & Post Scheduler</span>
              </h3>
              <p className="text-xs text-slate-400">
                Schedule campaign dispatches, inspect live post copy, and publish multi-platform campaigns with human safety gates.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Safety Approval Gate Active</span>
            </div>
          </div>

          {/* Scheduled Posts Queue Section */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Upcoming Scheduled Posts & Campaigns ({generatedDrafts.filter(d => d.status === 'scheduled').length})
                </h4>
              </div>
            </div>

            {generatedDrafts.filter(d => d.status === 'scheduled').length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {generatedDrafts.filter(d => d.status === 'scheduled').map((draft) => (
                  <div key={draft.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-indigo-400 uppercase">{draft.platform}</span>
                        <span className="text-slate-500 font-mono">{draft.id}</span>
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Scheduled
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-white">{draft.campaign_name}</h5>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="text-amber-300 font-mono font-bold flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> Scheduled Date: {draft.scheduled_at}
                        </span>
                        <span>•</span>
                        <span>Budget: ${draft.daily_budget}/day</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setInspectDraftModal(draft)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Inspect Content</span>
                      </button>

                      <button
                        onClick={() => {
                          setScheduleDraftModal(draft);
                          if (draft.scheduled_at) {
                            const [d, t] = draft.scheduled_at.split(' ');
                            if (d) setScheduledDate(d);
                            if (t) setScheduledTime(t.slice(0, 5));
                          }
                        }}
                        className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold rounded-xl flex items-center gap-1 cursor-pointer"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Reschedule</span>
                      </button>

                      <button
                        onClick={() => handlePublishCampaign(draft)}
                        disabled={isPublishing === draft.id}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Publish Now</span>
                      </button>

                      <button
                        onClick={() => handleCancelSchedule(draft.id)}
                        className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs rounded-xl cursor-pointer"
                        title="Cancel Schedule"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center border border-dashed border-slate-800 rounded-xl space-y-2">
                <Calendar className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">No scheduled posts currently in queue. Use the AI Campaign Builder or Content Studio to schedule campaigns.</p>
              </div>
            )}
          </div>

          {/* Publishing & Dispatch Logs Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Approval & Publishing Dispatch Logs ({publishLogs.length})</h4>

            <div className="space-y-3">
              {publishLogs.map((log) => (
                <div key={log.id} className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-indigo-400 uppercase">{log.platform}</span>
                      <span className="text-slate-500 font-mono">{log.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        log.status === 'published' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {log.status}
                      </span>
                      {log.scheduled_at && (
                        <span className="text-[10px] text-amber-300 font-mono">
                          (Scheduled: {log.scheduled_at})
                        </span>
                      )}
                    </div>
                    <h5 className="text-sm font-bold text-white mt-0.5">{log.campaign_name}</h5>
                    <p className="text-[11px] font-mono text-emerald-400 mt-1">{log.api_response}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setInspectLogModal(log)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-400" />
                      <span>See Content</span>
                    </button>

                    <div className="text-right text-xs text-slate-400 font-mono">
                      <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                      <span className="block text-slate-500">{log.published_by}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 5: AI OPTIMIZATION ENGINE & LIVE FEED                              */}
      {/* ========================================================================= */}
      {activeSubTab === 'optimizer' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <span>AI Continuous Optimization Feed</span>
              </h3>
              <p className="text-xs text-slate-400">
                Real-time recommendations for scaling winner campaigns, pausing fatigued creatives, and refining audience exclusions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {optimizations.map((opt) => (
              <div key={opt.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{opt.platform} • {opt.type.replace('_', ' ')}</span>
                    <h4 className="text-base font-bold text-white">{opt.title}</h4>
                    <span className="text-xs text-amber-400 font-semibold block mt-0.5">{opt.metric}</span>
                  </div>

                  {!opt.applied ? (
                    <button
                      onClick={() => handleApplyOptimization(opt.id)}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-amber-500 hover:from-indigo-500 hover:to-amber-400 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 fill-amber-300" />
                      <span>Apply Optimization</span>
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-lg border border-emerald-500/30 flex items-center gap-1">
                      <Check className="w-4 h-4" /> Applied
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <strong className="text-indigo-300">AI Reasoning:</strong> {opt.reasoning}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guide Modal Popover */}
      {activeGuideModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase">{activeGuideModal.platform} • {activeGuideModal.control_id}</span>
                <h3 className="text-base font-bold text-white">{activeGuideModal.title}</h3>
              </div>
              <button
                onClick={() => setActiveGuideModal(null)}
                className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <strong className="text-indigo-300 block">Step-by-Step Implementation Guide:</strong>
              <ol className="list-decimal list-inside space-y-1.5 bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono">
                {activeGuideModal.guide_steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  handleApplyFix(activeGuideModal.id);
                  setActiveGuideModal(null);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl"
              >
                Mark as Completed (+{activeGuideModal.impact_points} pts)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {scheduleDraftModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Schedule Campaign Dispatch</h3>
              </div>
              <button
                onClick={() => setScheduleDraftModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-indigo-400 uppercase font-mono">{scheduleDraftModal.id} • {scheduleDraftModal.platform}</span>
              <p className="text-sm font-bold text-white">{scheduleDraftModal.campaign_name}</p>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300">Publish Date & Time</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Date</span>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Time</span>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Quick Presets */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-semibold text-slate-400 block">Quick Schedule Presets:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'Tomorrow 9 AM', days: 1, time: '09:00' },
                    { label: 'In 2 Days 10 AM', days: 2, time: '10:00' },
                    { label: 'In 3 Days 2 PM', days: 3, time: '14:00' },
                    { label: 'Next Mon 8 AM', days: 5, time: '08:00' },
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const d = new Date(Date.now() + 86400000 * preset.days);
                        setScheduledDate(d.toISOString().slice(0, 10));
                        setScheduledTime(preset.time);
                      }}
                      className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-semibold rounded-lg transition-all cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Scheduled Summary Preview:</span>
              <p className="font-semibold text-white">{scheduleDraftModal.headlines[0] || 'Default Headline'}</p>
              <p className="text-[11px] text-slate-400 line-clamp-2">{scheduleDraftModal.primary_texts[0]}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setScheduleDraftModal(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmSchedule(scheduleDraftModal, scheduledDate, scheduledTime)}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Lock & Schedule Dispatch</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content & Live Ad Preview Inspector Modal */}
      {inspectDraftModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-300 font-mono">
                    {inspectDraftModal.platform}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{inspectDraftModal.id}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                    inspectDraftModal.status === 'published' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {inspectDraftModal.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">{inspectDraftModal.campaign_name}</h3>
              </div>
              <button
                onClick={() => setInspectDraftModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left Column: Specs & Headlines */}
              <div className="space-y-4">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Campaign Parameters</span>
                  <div className="grid grid-cols-2 gap-2 text-slate-300">
                    <div>
                      <span className="text-slate-500 block">Daily Budget:</span>
                      <strong className="text-emerald-400">${inspectDraftModal.daily_budget} / day</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Call to Action:</span>
                      <strong className="text-white">{inspectDraftModal.call_to_action}</strong>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Target Audience:</span>
                    <p className="text-slate-200">{inspectDraftModal.target_audience}</p>
                  </div>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Headlines (A/B Test Variants)</span>
                  <ul className="space-y-1">
                    {inspectDraftModal.headlines.map((h, i) => (
                      <li key={i} className="flex justify-between items-center bg-slate-900 p-2 rounded border border-slate-800 text-slate-200 font-semibold">
                        <span>Variant {i + 1}: {h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Primary Ad Copy</span>
                  <p className="text-slate-200 leading-relaxed font-sans">{inspectDraftModal.primary_texts[0]}</p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Landing Page Blueprint</span>
                  <p className="font-bold text-white">{inspectDraftModal.landing_page_headline}</p>
                  <span className="text-[11px] text-indigo-400 font-mono block">{inspectDraftModal.website}</span>
                </div>
              </div>

              {/* Right Column: Platform Ad Preview Mockup */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-indigo-400" />
                  <span>Simulated {inspectDraftModal.platform.toUpperCase()} Feed Mockup</span>
                </span>

                {/* Meta Ad Mockup */}
                {inspectDraftModal.platform === 'meta' && (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs text-white">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-amber-500 flex items-center justify-center font-bold text-slate-950 text-xs">
                        AC
                      </div>
                      <div>
                        <strong className="block font-bold">{inspectDraftModal.business_name}</strong>
                        <span className="text-[10px] text-slate-400">Sponsored • 🌐</span>
                      </div>
                    </div>
                    <p className="text-slate-200 text-xs leading-snug">{inspectDraftModal.primary_texts[0]}</p>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                      <div className="h-32 bg-indigo-950/60 flex items-center justify-center text-indigo-400 p-4 text-center font-bold">
                        {inspectDraftModal.headlines[0]}
                      </div>
                      <div className="p-3 bg-slate-900 flex justify-between items-center border-t border-slate-800">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase">{inspectDraftModal.website}</span>
                          <strong className="block text-xs text-white">{inspectDraftModal.headlines[0]}</strong>
                        </div>
                        <span className="px-3 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-lg">
                          {inspectDraftModal.call_to_action}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Google Search Ad Mockup */}
                {inspectDraftModal.platform === 'google' && (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs font-sans">
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-500 text-slate-950 px-1.5 py-0.2 text-[10px] font-black rounded">Ad</span>
                      <span className="text-slate-400 text-[11px]">{inspectDraftModal.website}</span>
                    </div>
                    <h4 className="text-sm font-bold text-indigo-400 hover:underline cursor-pointer">
                      {inspectDraftModal.headlines.join(' | ')}
                    </h4>
                    <p className="text-slate-300 text-xs leading-snug">{inspectDraftModal.primary_texts[0]}</p>
                    <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-indigo-300">
                      <span className="bg-slate-900 p-1.5 rounded border border-slate-800">✓ Free 14-Day Trial</span>
                      <span className="bg-slate-900 p-1.5 rounded border border-slate-800">✓ Zero Setup Fee</span>
                    </div>
                  </div>
                )}

                {/* YouTube Video Ad Mockup */}
                {inspectDraftModal.platform === 'youtube' && (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs text-white">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-red-500 font-extrabold flex items-center gap-1">
                        <Video className="w-3.5 h-3.5 text-red-500" /> YouTube In-Stream Video Ad
                      </span>
                      <span className="text-slate-400">Ad • 1 of 2 (0:15 / 0:30)</span>
                    </div>
                    <div className="h-44 bg-gradient-to-tr from-slate-950 via-red-950/40 to-slate-900 rounded-xl p-4 flex flex-col justify-between border border-slate-800 relative overflow-hidden">
                      <div className="flex justify-between items-start">
                        <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded">
                          Sponsored
                        </span>
                        <span className="bg-slate-900/90 text-slate-300 text-[10px] px-2 py-1 rounded font-mono border border-slate-700">
                          Skip in 5s
                        </span>
                      </div>
                      <div className="space-y-1.5 z-10">
                        <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">Video Hook (0-5s):</span>
                        <p className="text-xs font-bold text-white leading-snug">{inspectDraftModal.primary_texts[0]}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center bg-red-600 p-3 rounded-xl text-white font-bold text-xs">
                      <div>
                        <span className="block text-[10px] text-red-200">{inspectDraftModal.website}</span>
                        <span>{inspectDraftModal.headlines[0]}</span>
                      </div>
                      <span className="px-3 py-1 bg-white text-red-600 font-extrabold text-xs rounded-lg shadow">
                        {inspectDraftModal.call_to_action}
                      </span>
                    </div>
                  </div>
                )}

                {/* TikTok / Other Ad Mockup */}
                {(inspectDraftModal.platform === 'tiktok' || inspectDraftModal.platform === 'linkedin') && (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs text-white">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                      <span>@{inspectDraftModal.business_name.replace(/\s+/g, '').toLowerCase()}</span>
                      <span className="text-rose-400 font-bold">TikTok Feed</span>
                    </div>
                    <div className="h-40 bg-gradient-to-b from-slate-900 to-indigo-950 rounded-xl p-4 flex flex-col justify-between border border-slate-800">
                      <span className="text-[10px] bg-slate-950/80 px-2 py-0.5 rounded text-amber-300 font-mono self-start">
                        🎵 Trending FinOps Audio
                      </span>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-white">{inspectDraftModal.headlines[0]}</p>
                        <p className="text-[11px] text-slate-300 line-clamp-2">{inspectDraftModal.primary_texts[0]}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center bg-indigo-600 px-4 py-2 rounded-xl text-white font-bold text-xs">
                      <span>{inspectDraftModal.call_to_action}</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <span className="text-xs text-slate-400">
                Status: <strong className="text-white font-mono">{inspectDraftModal.status}</strong>
                {inspectDraftModal.scheduled_at && ` (Scheduled for ${inspectDraftModal.scheduled_at})`}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setScheduleDraftModal(inspectDraftModal);
                    setInspectDraftModal(null);
                  }}
                  className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{inspectDraftModal.status === 'scheduled' ? 'Reschedule' : 'Schedule'}</span>
                </button>

                {inspectDraftModal.status !== 'published' && (
                  <button
                    onClick={() => {
                      handlePublishCampaign(inspectDraftModal);
                      setInspectDraftModal(null);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Immediately</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Log Inspector Modal */}
      {inspectLogModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase font-mono">{inspectLogModal.id} • {inspectLogModal.platform}</span>
                <h3 className="text-base font-bold text-white">{inspectLogModal.campaign_name}</h3>
              </div>
              <button onClick={() => setInspectLogModal(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400">Status:</span>
                <span className="font-bold text-emerald-400 uppercase">{inspectLogModal.status}</span>
              </div>
              {inspectLogModal.scheduled_at && (
                <div className="flex justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Scheduled Date:</span>
                  <span className="font-bold text-amber-300 font-mono">{inspectLogModal.scheduled_at}</span>
                </div>
              )}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">API Payload / Response</span>
                <p className="font-mono text-emerald-400 text-[11px]">{inspectLogModal.api_response}</p>
              </div>

              {inspectLogModal.content_preview && (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Post Content & Copy</span>
                  <p className="font-mono text-slate-200 text-[11px] whitespace-pre-wrap">{inspectLogModal.content_preview}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setInspectLogModal(null)} className="px-4 py-2 bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Score & Guide Inspector Modal */}
      {auditDraftModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-300 font-mono">
                    {auditDraftModal.platform}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{auditDraftModal.id}</span>
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded font-extrabold flex items-center gap-1 ${
                      (auditDraftModal.audit_score || 100) === 100
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {(auditDraftModal.audit_score || 100) === 100 ? (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    <span>Score: {auditDraftModal.audit_score || 100} / 100</span>
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1.5">{auditDraftModal.campaign_name}</h3>
              </div>
              <button
                onClick={() => setAuditDraftModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {(auditDraftModal.audit_score || 100) === 100 ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 space-y-3 text-xs text-emerald-200">
                <div className="flex items-center gap-2 font-bold text-emerald-300 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Perfect 100/100 Audit Rating!</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  This content item satisfies all platform algorithm rules, signal tracking requirements, character length limits, video hook dynamics, and landing page intent alignment. Ready for immediate one-click deployment.
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* Why it failed 100 */}
                <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 space-y-2">
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Reason Audit Score Is Below 100/100</span>
                  </span>
                  <p className="font-bold text-white text-sm">
                    {auditDraftModal.audit_issues?.[0]?.reason || 'Sub-optimal asset configuration detected.'}
                  </p>
                </div>

                {/* Strategic Impact & Guidance */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                    Strategic Impact & Actionable Guidance
                  </span>
                  <p className="text-slate-300 leading-relaxed font-sans">
                    {auditDraftModal.audit_issues?.[0]?.guidance || 'Follow platform recommended asset formats to prevent algorithmic delivery penalties.'}
                  </p>
                </div>

                {/* Recommended Fix */}
                <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl space-y-2">
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                    Recommended Fix to Reach 100/100
                  </span>
                  <p className="text-slate-200 font-medium">
                    {auditDraftModal.audit_issues?.[0]?.fix_suggestion || 'Apply automated asset and hook optimization.'}
                  </p>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={() => setAuditDraftModal(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                Close
              </button>

              {(auditDraftModal.audit_score || 100) < 100 && (
                <button
                  onClick={() => handleFixDraftScoreTo100(auditDraftModal.id)}
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 via-indigo-600 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/10"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Apply Guide Fix & Boost Score to 100/100</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 5: AI OPTIMIZATION ENGINE & LIVE FEED                              */}
      {/* ========================================================================= */}
      {activeSubTab === 'optimizer' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <span>AI Continuous Optimization Feed</span>
              </h3>
              <p className="text-xs text-slate-400">
                Real-time recommendations for scaling winner campaigns, pausing fatigued creatives, and refining audience exclusions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {optimizations.map((opt) => (
              <div key={opt.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{opt.platform} • {opt.type.replace('_', ' ')}</span>
                    <h4 className="text-base font-bold text-white">{opt.title}</h4>
                    <span className="text-xs text-amber-400 font-semibold block mt-0.5">{opt.metric}</span>
                  </div>

                  {!opt.applied ? (
                    <button
                      onClick={() => handleApplyOptimization(opt.id)}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-amber-500 hover:from-indigo-500 hover:to-amber-400 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 fill-amber-300" />
                      <span>Apply Optimization</span>
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-lg border border-emerald-500/30 flex items-center gap-1">
                      <Check className="w-4 h-4" /> Applied
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <strong className="text-indigo-300">AI Reasoning:</strong> {opt.reasoning}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guide Modal Popover */}
      {activeGuideModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase">{activeGuideModal.platform} • {activeGuideModal.control_id}</span>
                <h3 className="text-base font-bold text-white">{activeGuideModal.title}</h3>
              </div>
              <button
                onClick={() => setActiveGuideModal(null)}
                className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <strong className="text-indigo-300 block">Step-by-Step Implementation Guide:</strong>
              <ol className="list-decimal list-inside space-y-1.5 bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono">
                {activeGuideModal.guide_steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  handleApplyFix(activeGuideModal.id);
                  setActiveGuideModal(null);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl"
              >
                Mark as Completed (+{activeGuideModal.impact_points} pts)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments & Reply Social Hub Modal */}
      {selectedAdForComments && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl my-8">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 font-mono">
                    {selectedAdForComments.platform}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{selectedAdForComments.id}</span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">
                  Community Engagement & Comments: {selectedAdForComments.campaign_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAdForComments(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Engagement Metrics Header Banner */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-around text-xs font-mono text-slate-300">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-indigo-400" /> {selectedAdForComments.views.toLocaleString()} Views
              </span>
              <span className="w-px h-4 bg-slate-800" />
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> {selectedAdForComments.clicks.toLocaleString()} Clicks
              </span>
              <span className="w-px h-4 bg-slate-800" />
              <span className="flex items-center gap-1">
                <Share2 className="w-3.5 h-3.5 text-sky-400" /> {selectedAdForComments.shares.toLocaleString()} Shares
              </span>
              <span className="w-px h-4 bg-slate-800" />
              <span className="flex items-center gap-1 text-amber-300 font-bold">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" /> {selectedAdForComments.comments_count} Comments
              </span>
            </div>

            {/* Comments Thread List */}
            <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
              {selectedAdForComments.comments.map((comment) => (
                <div key={comment.id} className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-amber-500 text-white font-black text-xs flex items-center justify-center">
                        {comment.avatar_initials || comment.author.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">{comment.author}</span>
                        <span className="text-[10px] text-slate-400">{comment.timestamp}</span>
                      </div>
                    </div>

                    <span className={`text-[10px] px-2 py-0.5 rounded font-extrabold uppercase ${
                      comment.sentiment === 'question' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      comment.sentiment === 'positive' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {comment.sentiment}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed font-sans pl-1">
                    "{comment.text}"
                  </p>

                  {/* Existing Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-4 space-y-2 border-l-2 border-indigo-500/30 pl-3 pt-1">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80 space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-indigo-300 flex items-center gap-1 text-[11px]">
                              <CornerDownRight className="w-3 h-3 text-indigo-400" />
                              {reply.author}
                              {reply.is_official_reply && (
                                <span className="bg-emerald-500/20 text-emerald-300 text-[9px] px-1.5 py-0.2 rounded font-extrabold">
                                  Official Manager Reply
                                </span>
                              )}
                            </span>
                            <span className="text-[10px] text-slate-500">{reply.timestamp}</span>
                          </div>
                          <p className="text-slate-300 text-xs">{reply.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Input Box */}
                  <div className="pt-2 border-t border-slate-900 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Reply as Campaign Manager
                      </span>
                      <button
                        onClick={() => handleGenerateAiReply(comment.text, comment.id)}
                        disabled={isGeneratingAiReply === comment.id}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20"
                      >
                        {isGeneratingAiReply === comment.id ? (
                          <Loader2 className="w-3 h-3 animate-spin text-indigo-400" />
                        ) : (
                          <Sparkles className="w-3 h-3 text-indigo-400" />
                        )}
                        <span>✨ AI Auto-Draft Reply</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={replyInputMap[comment.id] || ''}
                        onChange={(e) =>
                          setReplyInputMap((prev) => ({ ...prev, [comment.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handlePostReply(selectedAdForComments.id, comment.id);
                        }}
                        placeholder="Write official reply to comment..."
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        onClick={() => handlePostReply(selectedAdForComments.id, comment.id)}
                        disabled={!replyInputMap[comment.id]?.trim()}
                        className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Post</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
              <span className="text-[11px] text-slate-400 font-mono">
                Replies sync directly with {selectedAdForComments.platform.toUpperCase()} Ads API
              </span>
              <button
                onClick={() => setSelectedAdForComments(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
