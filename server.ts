import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import {
  DEFAULT_PROFILE,
  INITIAL_AUDIT_REPORTS,
  MOCK_MEDIA_PLANS,
  MOCK_CREATIVE_BRIEFS,
  MOCK_MUTATIONS,
  MOCK_MONITORING,
  MOCK_EXPERIMENTS,
  PLATFORMS,
  MOCK_CONTROLS,
} from './src/data/mockData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory application state
  let profile = { ...DEFAULT_PROFILE };
  let auditReports = { ...INITIAL_AUDIT_REPORTS };
  let mediaPlans = [...MOCK_MEDIA_PLANS];
  let creativeBriefs = [...MOCK_CREATIVE_BRIEFS];
  let mutationPlans = [...MOCK_MUTATIONS];
  let monitoringMetrics = [...MOCK_MONITORING];
  let experiments = [...MOCK_EXPERIMENTS];

  // Lazy Gemini AI helper
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY environment variable is not configured');
      }
      aiClient = new GoogleGenAI({ apiKey });
    }
    return aiClient;
  }

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Claude Ads Server',
      version: '2.0.0',
      has_gemini_key: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // Account Profile
  app.get('/api/profile', (req, res) => {
    res.json(profile);
  });

  app.post('/api/profile', (req, res) => {
    profile = { ...profile, ...req.body };
    res.json({ success: true, profile });
  });

  // Platforms
  app.get('/api/platforms', (req, res) => {
    res.json(PLATFORMS);
  });

  // Audits
  app.get('/api/audits', (req, res) => {
    res.json(auditReports);
  });

  app.get('/api/audits/:platform', (req, res) => {
    const platform = req.params.platform;
    const report = auditReports[platform];
    if (!report) {
      return res.status(404).json({ error: `No audit report found for platform: ${platform}` });
    }
    res.json(report);
  });

  app.post('/api/audits/run', (req, res) => {
    const { platform } = req.body;
    const targetPlatform = platform || 'google';

    // Deterministic audit calculation demo
    const newReport = {
      run_id: `RUN-${targetPlatform.toUpperCase()}-${Date.now().toString().slice(-6)}`,
      started_at: new Date().toISOString(),
      account_id: `${targetPlatform.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      account_name: `${profile.client_name} - ${targetPlatform.toUpperCase()} Ads`,
      platform: targetPlatform,
      health_score: Number((75 + Math.random() * 20).toFixed(1)),
      evidence_coverage: Number((82 + Math.random() * 16).toFixed(1)),
      status: 'normal' as const,
      categories: [
        {
          category: 'Tracking & Attribution',
          category_weight: 30,
          health_score: Number((80 + Math.random() * 18).toFixed(1)),
          evidence_coverage: 95,
          applicable_controls: 4,
          known_controls: 4,
          passed_controls: 3,
          failed_controls: 1,
          unknown_controls: 0,
        },
        {
          category: 'Campaign Structure',
          category_weight: 25,
          health_score: Number((70 + Math.random() * 25).toFixed(1)),
          evidence_coverage: 90,
          applicable_controls: 5,
          known_controls: 4,
          passed_controls: 3,
          failed_controls: 1,
          unknown_controls: 1,
        },
        {
          category: 'Creative Quality',
          category_weight: 25,
          health_score: Number((65 + Math.random() * 25).toFixed(1)),
          evidence_coverage: 85,
          applicable_controls: 4,
          known_controls: 3,
          passed_controls: 2,
          failed_controls: 1,
          unknown_controls: 1,
        },
        {
          category: 'Bidding & Budgeting',
          category_weight: 20,
          health_score: Number((80 + Math.random() * 18).toFixed(1)),
          evidence_coverage: 92,
          applicable_controls: 4,
          known_controls: 4,
          passed_controls: 3,
          failed_controls: 1,
          unknown_controls: 0,
        },
      ],
      findings: [
        {
          control_id: `TRK-${targetPlatform.toUpperCase()}-01`,
          platform: targetPlatform,
          status: 'pass' as const,
          confidence: 'high' as const,
          observation: `Server-side conversion tracking verified active on ${targetPlatform}.`,
          diagnosis: 'Event payloads pass valid SHA256 hashed parameters and timestamps.',
          recommendation: 'Maintain conversion mapping and test edge parameters quarterly.',
          evidence: [
            { label: 'Event Quality Score', value: '9.2 / 10' },
            { label: 'Match Rate', value: '96.8%' },
          ],
          impact: 'Ensures optimal algorithmic bidding convergence.',
        },
        {
          control_id: `CRE-${targetPlatform.toUpperCase()}-02`,
          platform: targetPlatform,
          status: 'fail' as const,
          confidence: 'high' as const,
          observation: `Ad fatigue detected across 2 primary campaign ad sets on ${targetPlatform}.`,
          diagnosis: 'Creative frequency exceeded 3.8x with a 24% drop in CTR over the last 7 days.',
          recommendation: 'Deploy new hook video assets and UGC variations immediately.',
          evidence: [
            { label: '7-Day CTR Delta', value: '-24.2%' },
            { label: 'Frequency', value: '3.95x' },
          ],
          impact: 'Directly lowers CPA by 22-30% upon creative refresh.',
        },
      ],
    };

    auditReports[targetPlatform] = newReport;
    res.json(newReport);
  });

  // Media Plans
  app.get('/api/plans', (req, res) => {
    res.json(mediaPlans);
  });

  app.post('/api/plans', (req, res) => {
    const newPlan = {
      id: `PLAN-${Date.now().toString().slice(-4)}`,
      ...req.body,
    };
    mediaPlans.unshift(newPlan);
    res.json(newPlan);
  });

  // Creative Briefs
  app.get('/api/creatives', (req, res) => {
    res.json(creativeBriefs);
  });

  app.post('/api/creatives', (req, res) => {
    const newBrief = {
      id: `CRB-${Date.now().toString().slice(-4)}`,
      created_at: new Date().toISOString(),
      status: 'draft' as const,
      ...req.body,
    };
    creativeBriefs.unshift(newBrief);
    res.json(newBrief);
  });

  // Gemini AI Generation Route
  app.post('/api/gemini/generate', async (req, res) => {
    const { prompt, mode, platform, vertical } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
      const ai = getGeminiClient();
      const systemInstruction = `You are Claude Ads AI, an expert paid-media strategist and ad copywriter specializing in ${platform || 'Google, Meta, and LinkedIn'} advertising for ${vertical || 'general'} businesses.
Provide structured, highly compelling, conversion-focused paid media outputs.
Include punchy headlines, hooks, primary ad text, CTA suggestions, or strategic recommendations depending on mode: ${mode || 'creative'}.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({
        output: response.text,
        mode: mode || 'creative',
        model: 'gemini-3.6-flash',
      });
    } catch (err: any) {
      console.error('Gemini Generation Error:', err);
      // Fallback response if API key is not set or call fails
      const fallbackText = `[Claude Ads Strategic AI Recommendation]

🎯 Target Audience Angle:
High-intent decision makers seeking proven ROI and immediate setup.

⚡ Headlines (Max 30 chars):
1. Stop Wasting Ad Spend Today
2. Scale Paid Media 3.5x Faster
3. Proven Enterprise Ad Platform

📝 Primary Ad Text:
Transform raw ad performance into deterministic growth. Audit account health across 12 platforms with evidence-backed insights, automated fatigue detection, and risk-free draft mutations.

👉 CTAs:
- Claim Free Audit
- Start Free Trial
- Schedule Demo Strategy Call`;

      res.json({
        output: fallbackText,
        mode: mode || 'creative',
        model: 'fallback-demo',
        warning: err.message || 'Gemini API call failed, returned fallback suggestion.',
      });
    }
  });

  // Mutation Plans
  app.get('/api/mutations', (req, res) => {
    res.json(mutationPlans);
  });

  app.post('/api/mutations', (req, res) => {
    const newMutation = {
      id: `MUT-${Date.now().toString().slice(-4)}`,
      created_at: new Date().toISOString(),
      status: 'draft_pending_review' as const,
      idempotency_key: `IDEM-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      ...req.body,
    };
    mutationPlans.unshift(newMutation);
    res.json(newMutation);
  });

  app.post('/api/mutations/:id/approve', (req, res) => {
    const id = req.params.id;
    const plan = mutationPlans.find((m) => m.id === id);
    if (!plan) return res.status(404).json({ error: 'Mutation not found' });
    plan.status = 'approved';
    res.json({ success: true, plan });
  });

  // Monitoring
  app.get('/api/monitoring', (req, res) => {
    res.json(monitoringMetrics);
  });

  // Experiments
  app.get('/api/experiments', (req, res) => {
    res.json(experiments);
  });

  app.post('/api/experiments', (req, res) => {
    const newExp = {
      id: `EXP-${Date.now().toString().slice(-4)}`,
      status: 'active' as const,
      ...req.body,
    };
    experiments.unshift(newExp);
    res.json(newExp);
  });

  // Vite Middleware in Dev vs Static in Production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Claude Ads Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
