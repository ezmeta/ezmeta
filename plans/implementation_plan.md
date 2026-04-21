# EZ Meta Implementation Plan

## Project Setup

1. Initialize Next.js project with the following configuration:
   - TypeScript
   - ESLint
   - Tailwind CSS
   - /src directory
   - App Router
   - Default for other options

2. Install additional libraries:
   - lucide-react (for icons)
   - shadcn-ui (for UI components)
   - axios (for API requests)

## Project Structure

Following the structure outlined in the README.md:

```
EZ Meta/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── dashboard/
│   │   ├── content-generator/
│   │   └── meta-ads/
│   ├── components/
│   │   ├── ui/
│   │   └── shared/
│   ├── lib/
│   │   ├── supabase/
│   │   ├── openai/
│   │   └── meta/
│   └── styles/
├── public/
└── ARCHITECTURE.md
```

## Implementation Steps

### 1. Project Initialization

```bash
# Initialize Next.js project
npx create-next-app@latest . --typescript --eslint --tailwind --src-dir --app

# Install additional libraries
npm install lucide-react axios
npm install -D @types/node @types/react @types/react-dom

# Install shadcn-ui
npx shadcn-ui@latest init
```

### 2. Directory Structure Setup

Create the following directories:
- src/app/(auth)/login
- src/app/(auth)/signup
- src/app/dashboard
- src/app/content-generator
- src/app/meta-ads
- src/components/ui
- src/components/shared
- src/lib/supabase
- src/lib/openai
- src/lib/meta

### 3. API Integration Setup

#### Meta Graph API Integration

1. Create API client for Meta Graph API in src/lib/meta/client.ts
2. Implement authentication flow for Meta API
3. Create data fetching utilities for ad performance metrics

#### OpenRouter API Integration

1. Create API client for OpenRouter in src/lib/openai/client.ts
2. Implement prompt generation based on ad performance data
3. Create utilities for processing AI-generated content

### 4. UI Implementation

1. Implement authentication pages
2. Create dashboard layout and components
3. Build ad performance monitoring interface
4. Develop content generation interface

### 5. Testing and Validation

1. Test Meta Graph API integration
2. Test OpenRouter API integration
3. Validate data flow between components
4. Ensure responsive design works across devices

## Admin Dashboard Reference Roadmap (Saved)

This section is saved as next-phase reference for making product behavior configurable via admin without code edits.

### A. Configuration Strategy

1. Split admin into:
   - **Content CMS** (landing/pricing/FAQ/popup copy)
   - **System Ops** (integrations, limits, health status)
2. Keep public UI config in [`site_settings`](src/db/schema.sql:125).
3. Keep sensitive secrets in server environment (not public CMS).

### B. Suggested Settings Namespaces

- `landing.*` → hero/testimonials/CTA
- `pricing.*` → plans, labels, benefits, limits
- `limits.*` → credits, reset policy, user caps
- `integrations.*` → feature flags + operational metadata

### C. Admin Modules to Add

1. **Integration Health Center**
   - Meta API status
   - Telegram bot status
   - Stripe webhook status
   - Supabase read/write latency indicators

2. **Plan Governance Panel**
   - credits per plan
   - hard/soft stop rules
   - monthly reset controls

3. **Automation Controls**
   - Smart Pilot guardrails
   - Telegram schedule + severity routing
   - stop-loss defaults

4. **Config Audit & Rollback**
   - who changed what
   - timestamped revisions
   - one-click rollback

### D. Reliability Hardening (Netlify/Prod)

1. Increase production-friendly timeout in [`SUPABASE_QUERY_TIMEOUT_MS`](src/app/actions/admin-settings.ts:231).
2. Add admin-visible source/debug indicators:
   - live DB vs fallback
   - last successful sync timestamp
3. Ensure production migrations/seeds for [`faqs`](src/db/schema.sql:141) and [`site_settings`](src/db/schema.sql:125) are applied.

### E. Practical Build Order

1. Schema + settings contract freeze
2. Admin ops UI shell
3. Limits/credits enforcement
4. Integration health checks
5. Audit logging + rollback
