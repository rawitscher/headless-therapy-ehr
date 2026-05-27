---
name: building-headless-salesforce-demo
description: Build a custom-branded "headless" Salesforce demo for a specific customer using the React UI Bundle (Multi-Framework Beta), Agentforce, Flow, and real CRM data. Industry-agnostic — supports financial services, retail, public sector, healthcare, manufacturing/field service, professional services, and more. Use when an SE or AE asks to build a customer-tailored demo where the customer doesn't want Salesforce UX, when the prompt mentions Headless360, TherapyNotes-style, ServiceNow-style, banker/teller/dispatcher/agent/caseworker/associate UX, custom UI on Salesforce, React multi-framework, UI Bundle, or AgentforceConversationClient, or when the demo narrative is "you can have the UI you want without giving up the platform you need."
---

# Building a Headless Salesforce Customer Demo

This skill captures the end-to-end pattern for building a beautifully custom-branded React app on Salesforce, deployed via the UI Bundle Multi-Framework (Beta), with a working Agentforce copilot and live CRM data.

Works across industries — see [industry-playbooks.md](industry-playbooks.md) for vertical-specific scaffolding (personas, custom fields, AI insight cards, automation wins) for financial services, retail, public sector, healthcare, manufacturing/field service, and professional services.

Validated against a real customer demo (mid-2026, behavioral health vertical, 5-day build compressed to 4 hours).

## When to use this skill

Use when the request involves any of:
- A customer demo where the customer dislikes standard Salesforce UX
- "Headless360" / "Headless commerce" / custom-branded UI on Salesforce
- A vertical-SaaS look-and-feel: TherapyNotes, ServiceNow, Workday, Toast, nCino, Tyler, Epic, Salesforce Field Service, Bloomberg, etc.
- The new React Multi-Framework Beta / UI Bundle / `AiAuthoringBundle` deployment
- An Agentforce copilot embedded in a non-LWC web surface
- A "N tools → 1 platform" consolidation narrative

Do not use this skill for:
- Standard Lightning Experience app builds (use `generating-lightning-app`)
- Pure LWC component work
- Existing UI bundle edits (use `building-ui-bundle-frontend`)

## Demo architecture (the pattern)

Every headless customer demo built with this skill has these layers:

1. **Hero UI surface** — one beautiful React page that mirrors the customer's current tool. Usually one of: provider EHR, agent console, store associate POS, dispatcher dashboard.
2. **Supporting surfaces** — 2–3 lighter pages: a portal/customer view, an admin/intake view, the consolidation page.
3. **Patient/Customer 360** — the hero detail page. Real Salesforce Contact/Account underneath, surfaced as the customer would expect to see it.
4. **Proactive AI cards** — Agentforce-branded insight cards on the hero page. Static content is FINE.
5. **Agentforce chat widget** — `<AgentforceConversationClient>` in the corner, wired to a real published agent with 2–4 subagents.
6. **One automation win** — Flow Builder screenshot, optionally a working flow.
7. **Closing consolidation page** — "5 tools → 1 platform" visual.

## After Cursor restart (resume protocol)

If you (the agent) were just installed as a skill and the user has restarted Cursor, they need to **explicitly send a message to wake you up** — Cursor doesn't auto-resume mid-flow after a restart. When you first encounter a restarted session, post this to the user:

> Welcome back! I see you've restarted Cursor and the skill is now loaded. Reply with anything (e.g., "ready" or "continue") and I'll pick up right where we left off — starting with the Phase 1 scoping questions.

Once they reply, proceed normally. Do not assume any prior state — re-ask Phase 1 scoping questions cleanly.

## The 7-phase build sequence

Follow this order. Skipping ahead causes rework.

### Phase 1: Scope with the AE (15 min)

Ask the AE these questions before writing code. Use the AskQuestion tool if available, otherwise ask conversationally.

**Step 1A — Identify the vertical and starting playbook:**

- **Customer name + industry?** (e.g., "Regional Trust Bank, financial services")
- **Which tool's UX are they trying to keep?** (e.g., nCino, TherapyNotes, ServiceNow, Toast, Tyler, Workday)

→ Open [industry-playbooks.md](industry-playbooks.md) and find the matching vertical section. Use it as your starting scaffold (hero surface, personas, custom fields, AI insight cards, flow ideas, terminology). If the customer's vertical isn't listed, pick the closest one and adapt.

**Step 1B — Confirm scope:**

- **Primary hero surface** — which persona's day is the demo built around? (default to the playbook recommendation)
- **Agentforce role** — proactive insights only, chat only, or both?
- **Agent backing** — build a real agent, or stub the chat?
- **Data strategy** — mostly static, mix, or live GraphQL? (Mostly static is fine and saves hours. If GraphQL is requested, read [graphql-reference.md](graphql-reference.md) BEFORE writing any query — Salesforce's GraphQL shape is unusual.)
- **Flow demo** — live trigger, or screenshot of Flow Builder?
- **Deployment target** — fresh scratch org, customer SDO, existing dev org?
- **Demo tone** — pick one: "trustworthy/data-dense" (FSI, healthcare clinical) / "fast/efficient" (retail, field service) / "warm/human" (behavioral health, customer success) / "official/calm" (public sector)

Write the answers down. Re-reference during build to avoid scope creep.

### Phase 2: Org prep (20 min, often longest blocker)

The UI Bundle Multi-Framework Beta requires **manual toggles in Setup** that cannot be enabled via `project-scratch-def.json`. This is the #1 source of mid-build pain.

**Step 2A — Create the scratch org and open it:**

Use this `config/project-scratch-def.json`:

```json
{
  "features": ["Einstein1AIPlatform"],
  "settings": {
    "einsteinGptPlatformSettings": { "enableEinsteinGptPlatform": true }
  }
}
```

⚠️ Do NOT try to add `DataCloud`, `CustomerDataPlatform`, `AgentforceVibeForMultiFramework`, or `Agentforce` as features — these names are wrong or unavailable on most Dev Hubs. Just use `Einstein1AIPlatform`.

Then:

```bash
sf org create scratch -f config/project-scratch-def.json -a <alias> -d
sf org open -o <alias>
```

⚠️ **Always use `sf org open` to enter the scratch org — DO NOT direct the user to click a login link or paste credentials into a login screen.** Click-to-login often fails because scratch orgs default to passwordless auth. `sf org open` uses the CLI's stored token and opens the org with the user already signed in. If the user genuinely needs a password (rare — e.g., to log in from another browser), generate one with `sf org generate password -o <alias>` and copy it to their clipboard.

**Step 2B — Manual Setup toggles (in this exact order):**

Have the user do these in the freshly-opened scratch org. Use the quick search box for speed.

| # | Setup search | What to do | Why |
|---|---|---|---|
| 1 | `multi` | Toggle **"React Development with Agentforce Vibes and Salesforce Multi-Framework (Beta)"** → On | Without this, deploying the UI Bundle fails with *"UIBundle Metadata API is not enabled"* |
| 2 | `Einstein Setup` | Click **Turn on Einstein** | Required before Agentforce can be enabled |
| 3 | `Agentforce` | Click **Turn on Agentforce** | Required to create/publish the agent in Phase 6 |
| 4 | `Digital Experiences → Settings` | Check **Enable Digital Experiences** → Save (pick any domain suffix, e.g. `<alias>-demo`) | The UI Bundle hosts inside an Experience Site |
| 5 | `My Domain → Routing and Policies` | Under **Cookies**, UNCHECK *"Require first-party use of Salesforce cookies"* → Save | ⚠️ Critical — without this the Agentforce chat widget shows *"Authentication Error"* during the demo |

Pause after each toggle and ask the user to confirm "done" before moving to the next one — they're click-fatigue prone and Setup's UI is slow.

### Phase 3: Scaffold the UI bundle (10 min)

**Step 3A — Pick a clean project directory.** Don't dump in `~/`. Ask the user:

> Where should I create the project? I recommend `~/Documents/se-demos/` to keep things organized. Reply with that, your own path, or just "default" and I'll use `~/Documents/se-demos/`.

If the directory doesn't exist, create it (`mkdir -p ~/Documents/se-demos`), then `cd` into it before running `sf project generate`. Never assume the user is in the right directory — always confirm path with `pwd`.

**Step 3B — Scaffold:**

```bash
sf project generate --name <customer>-demo --template empty
cd <customer>-demo
sf template generate ui-bundle --name <AppName>
cd force-app/main/default/uiBundles/<AppName>
npm install
```

**Step 3C — Verify `ui-bundle.json` `outputDir`** ⚠️

After scaffolding, **open `ui-bundle.json` and confirm `"outputDir": "dist"`** (some scaffolds default to `"src"`, which causes the deployed bundle to render a blank page in the org). If it says anything other than `"dist"`, fix it before deploying:

```json
{
  "outputDir": "dist",
  "routing": {
    "trailingSlash": "never",
    "fallback": "index.html"
  }
}
```

This is a real bug that caused a confusing "blank app on deploy, but works locally" failure for one teammate. Always check.

⚠️ **Do NOT run `npm run dev` and do NOT use the local Vite dev server (`http://localhost:5173`) to test the Agentforce chat widget.** The widget requires a Lightning Out auth context that only exists when the bundle is hosted inside the Salesforce org. Trying to make it work locally requires Trusted URLs, CORS allowlists, and frontdoor URL hacks that are not worth the time.

**Always test by deploying to the org and clicking through there.** For pure visual iteration (layout, colors, copy — anything that doesn't involve the chat widget), `npm run dev` is fine, but plan to deploy+test in the org every 2–3 changes.

**Step 3D — Build + deploy:**

```bash
npm run build
sf project deploy start --source-dir force-app/main/default/uiBundles/<AppName> -o <alias>
```

A full UI bundle redeploy takes ~20–30 seconds. Budget this into the loop.

**Step 3E — Tell the user how to open the deployed app.**

⚠️ **Do NOT try to construct a direct URL to the deployed app and tell the user to click it — the URL pattern varies and your guess will be wrong.** Instead, after every successful deploy, tell the user:

> Open your scratch org → click the **App Launcher** (9-dot grid icon, top left) → search for **<AppName>** → click to launch.

If the app doesn't show up in App Launcher, the deploy probably failed silently — check `sf project deploy report` and the org's Setup → Deployment Status page.

### Phase 4: Build the hero surfaces (1.5 hr — the bulk of the work)

Read `building-ui-bundle-frontend` for the project conventions (shadcn/ui, Tailwind, `appLayout.tsx`, `routes.tsx`).

⚠️ **CRITICAL: vertical-correct naming.** The CCG reference build is healthcare, so terms like `Patient`, `patientId`, `clinicianName`, `Session`, `PHQ9_Score` are ALL OVER the reference code. **Do NOT carry those names into a non-healthcare build.** A teammate reported this exact bug: they built a "high-tech" customer demo and Cursor named React variables, types, and props with `patient` / `clinician` / `session` everywhere.

Before writing ANY component, types, or data file:
1. Re-read the customer's vertical in [industry-playbooks.md](industry-playbooks.md)
2. Pick the right entity name (Member / Client / Constituent / Customer / Asset / Account / etc.)
3. Use that name **everywhere** — TypeScript types, component props, file names, route paths, data field names, mock data variables
4. The ONLY healthcare-shaped thing should be the CCG reference repo itself. If you find yourself writing `patient` in a non-healthcare build, STOP and rename.

Sanity-check by grepping for `patient`, `clinician`, `session`, `PHQ`, `therapy` across the new project before deploying. Zero hits expected for non-healthcare verticals.

Customer-demo specifics on top of that:

- **Brand the global CSS** — define 4–6 brand color CSS variables in `src/styles/global.css` (`--<brand>-primary`, `--<brand>-bg`, etc.) and use them everywhere. Import the customer's actual font family from Google Fonts. Add a few subtle keyframe animations (`fadeUp`, `sparkleIn`, `pulse`) — they make the AI cards feel alive.
- **Custom favicon + title** — inline SVG favicon in `index.html` with the customer's monogram. Title = customer's tool name, never "Salesforce."
- **One hero detail page does 80% of the work** — see [industry-playbooks.md](industry-playbooks.md) for vertical-specific names: Patient 360 (healthcare), Member 360 (FSI), Constituent 360 (public sector), Order 360 (retail), Asset 360 (field service), Engagement 360 (prof services). Tabs are vertical-specific too — sessions/notes/billing for healthcare, accounts/transactions/risk for FSI, etc. Spend most of your time here.
- **AI Insights tab pattern** — 2×2 grid of cards. The four standard categories generalize across verticals: (1) AI-drafted artifact (note / email / summary / disclosure), (2) churn or attrition risk, (3) domain-specific signal (clinical / financial / behavioral / operational), (4) engagement signal. Each card has a small "Agentforce" pill + sparkle icon. Hover state expands inline (don't use floating popovers — they fight the animation transforms). See the playbook for vertical-specific card content.
- **Link to real CRM records** — every record in your static `demoData.ts` should have a `salesforceContactId` (or `salesforceAccountId`, `salesforceCaseId`) field. Display a clickable Salesforce ID badge in the header that links to `<INSTANCE_URL>/lightning/r/<SObject>/<id>/view`. This is the single highest-leverage trick — proves the demo is real.

### Phase 5: Seed CRM data (30 min)

The point: when the AE clicks the Salesforce link in the demo, a real record opens.

1. **Pick the right SObject** for the demo's primary entity:
   - Healthcare: Contact (patients)
   - FSI: Contact + Account (members, households)
   - Public sector: Contact + Case (constituents, cases)
   - Retail: Contact + Account (customers, B2B accounts)
   - Field service: Account + Asset + WorkOrder (sites, equipment, jobs)
   - Professional services: Contact + Opportunity (clients, engagements)

2. **Create custom fields** matching what's in your React UI. See [industry-playbooks.md](industry-playbooks.md) for vertical-specific field lists:
   ```
   force-app/main/default/objects/<SObject>/fields/
     <Field1>__c.field-meta.xml
     <Field2>__c.field-meta.xml
     ...
   ```

3. **Create a permission set** granting FLS to all custom fields. Without this, the deployed user can't see the fields even as admin.

4. **Create demo records via JSON tree import**:
   ```bash
   sf data import tree --files data/records.json --target-org <alias>
   ```

5. **Grab the record IDs** post-import and paste them into `src/data/demoData.ts` as `salesforceContactId` / `salesforceAccountId` / etc. on each record.

### Phase 5.5: Polish the Salesforce-side record page (15 min)

The AE will click the CRM link badge in your React app during the demo. If the Contact opens with a default Salesforce layout, that breaks the "no Salesforce chrome" narrative.

**Deploy a custom Lightning Record Page (FlexiPage)** that shows the same fields you surfaced in React, organized cleanly. See [contact-record-page.md](contact-record-page.md) for the full template + per-vertical field lists.

Short version:
1. Drop the template FlexiPage XML into `force-app/main/default/flexipages/`
2. Swap in your vertical's custom fields
3. Deploy
4. ⚠️ Tell the user to **manually activate** the page (Setup → Object Manager → Contact → Lightning Record Pages → Activation → Org Default). FlexiPage activation isn't reliably deployable via metadata.

### Phase 6: Build the Agentforce copilot (45 min)

Use Agent Script (`.agent` file) deployed via CLI, not the UI builder — it's faster, reproducible, and gives you version control. See [agent-script-template.md](agent-script-template.md) for the full template.

**The hub-and-spoke pattern works.** A root `agent_router` with `reasoning` that only transitions, plus 2–4 subagents (one per major task). Three is the sweet spot.

**Anti-patterns that broke the agent live during the real build:**
- `default_agent_user` on an Employee Agent → publish fails with vague error. Remove it.
- Asking "which patient do you mean?" → kills demo flow. Bake "default to <demo patient>" into the system prompt.
- Open-ended instructions → agent hedges with disclaimers. Force structured output with bold section headers and word limits.
- Subagents listed but not activated → router transitions fail with "Something went wrong." Verify each subagent is activated in the builder after publish.

Deploy + publish + activate:

```bash
sf project deploy start --source-dir force-app/main/default/aiAuthoringBundles/<AgentName> -o <alias>
sf agent publish authoring-bundle --api-name <AgentName> -o <alias>
sf agent activate --api-name <AgentName> -o <alias>
```

Grab the published agent ID (starts with `0Xx`) and paste into `src/components/<Brand>Copilot.tsx`:

```tsx
import { AgentforceConversationClient } from '@salesforce/ui-bundle-template-feature-react-agentforce-conversation-client';

export default function BrandCopilot() {
  return (
    <AgentforceConversationClient
      agentId="0Xx..."
      agentLabel="<Brand> Copilot"
      styleTokens={{
        fabBackground: '<brand-primary>',
        headerBlockBackground: '<brand-primary>',
        headerBlockTextColor: '#ffffff',
        messageBlockOutboundBackgroundColor: '<brand-primary>',
        messageBlockInboundBackgroundColor: '#f3f5f8',
      }}
    />
  );
}
```

Mount this once in `appLayout.tsx` so the widget floats over every page. Add `pb-24` to the `<main>` so the FAB doesn't cover content.

### Phase 7: Flow + MCP + close (30 min)

- **Flow:** Build a schedule-triggered flow that does something the customer's current "broken Zapier" does. Take a screenshot of Flow Builder. Live execution is optional and risky.
- **Consolidation page:** A `Consolidation.tsx` page with a before/after layout: 5 logos in chaos on the left, the customer's branded React app on the right, arrow between. Caption: "X tools → 1 platform."
- **MCP setup (optional, often flaky):** Configure a Salesforce Hosted MCP server + External Client App for `claude.ai`. See [mcp-claude-setup.md](mcp-claude-setup.md). **Recommendation:** show the Setup → MCP Servers page as a static slide rather than risk a live OAuth failure.

## The talk track template

End every build by writing a `DEMO_TALKTRACK.md` with this structure:

```markdown
1. React app — "Does this feel familiar?" (hero page → 360 → AI cards → chat)
2. Salesforce record — click the CRM link → "It's still Salesforce underneath"
3. Flow — "The automation win" (screenshot or live)
4. Agent Builder — "AI on your platform, not bolted on"
5. (Optional) Claude + MCP — "And it's open"
6. Consolidation page — "5 tools → 1 platform" close
```

## Critical gotchas (validated the hard way)

| Symptom | Cause | Fix |
|---|---|---|
| `npm: command not found` during Phase 3 scaffolding, or weird/empty output from `npm install` | Node installed without npm (Homebrew node-only, corepack-only, partial nvm), even on a "modern" version like v22.x | Reinstall Node via `nvm install --lts && nvm use --lts`; confirm BOTH `node --version` and `npm --version` print before retrying. See Phase 0. |
| "UIBundle Metadata API is not enabled" on deploy | React Multi-Framework Beta toggle off | Setup → search "multi" → enable React Multi-Framework (Beta) |
| Agent chat shows "Authentication Error" | Cookie restriction on | Setup → My Domain → uncheck first-party cookies |
| Agent chat: "Something went wrong" mid-conversation | Subagents not activated or instructions ask for clarification | Activate each subagent; bake defaults into system prompt |
| `sf agent preview` "Invalid user ID" but widget works | Expected for Employee Agent via CLI | Ignore — preview needs different auth context |
| Hover preview overlaps cards | `position:absolute` fighting CSS animation `transform` | Use inline expanding section instead of floating popover |
| Claude MCP "Couldn't reach the MCP server" | Wrong URL format for scratch org | Use `/sandbox/platform/sobject-reads` path for scratch/sandbox |
| Claude MCP `OAUTH_APPROVAL_ERROR_GENERIC` after consent | ECA missing `mcp_api` scope | Add `Access Salesforce hosted MCP servers (mcp_api)` to selected scopes |
| Scratch org features rejected | Wrong feature names | Only `Einstein1AIPlatform` is reliably available |
| Deployed UI Bundle renders a blank page in the org | `ui-bundle.json` has `"outputDir": "src"` instead of `"dist"` | Open `ui-bundle.json`, set `"outputDir": "dist"`, redeploy |
| Direct URL to deployed app 404s | URL pattern varies — guessing is unreliable | Tell user to open App Launcher → search by app name → click |
| React types/props using wrong vertical terminology (e.g., `patient` in an FSI build) | Cursor leaked names from CCG reference | Grep for `patient`/`clinician`/`session`; rename per the industry playbook |
| GraphQL query returns `null` or "Cannot query field" errors | Wrong query shape (forgot `uiapi.query` wrapper or `{ value }` on fields) | See [graphql-reference.md](graphql-reference.md) for the correct Salesforce GraphQL shape |

## Time budget (realistic)

For a 4-hour compressed build (one customer, one SE, working sandbox/scratch):

| Phase | Time |
|---|---|
| 1. Scope | 15 min |
| 2. Org prep | 20 min (often longer if toggles are missing) |
| 3. Scaffold | 10 min |
| 4. Hero surfaces | 1h 30 min |
| 5. CRM data | 30 min |
| 6. Agentforce | 45 min |
| 7. Flow + close | 30 min |
| Polish / fixes | 30 min buffer |

For a "real" build with proper review: multiply by 3.

## Supporting files

- [industry-playbooks.md](industry-playbooks.md) — Vertical-specific recipes (FSI, retail, public sector, healthcare, field service, prof services) — START HERE for any new build
- [agent-script-template.md](agent-script-template.md) — Full Agent Script template with hub-and-spoke pattern
- [contact-record-page.md](contact-record-page.md) — Reusable FlexiPage template for the Salesforce-side Contact record (Phase 5.5)
- [graphql-reference.md](graphql-reference.md) — Salesforce GraphQL API shapes, codegen flow, hybrid live/static pattern (read before writing ANY GraphQL query)
- [mcp-claude-setup.md](mcp-claude-setup.md) — Step-by-step Claude.ai ↔ Salesforce MCP setup
- [demo-data-pattern.md](demo-data-pattern.md) — `demoData.ts` structure + Contact field examples

## Model recommendation

- **First time running this skill:** use **Claude Sonnet or Opus** explicitly (not Auto mode). The skill is validated against Sonnet; smaller models occasionally skip steps or hallucinate Agent Script syntax. Cursor → model picker → pick Sonnet.
- **Subsequent runs by experienced teammates:** **Auto mode** is fine.
- **Quota awareness:** a full 4-hour build consumes meaningful usage — roughly 10–30% of a monthly Cursor Pro quota depending on debugging loops. Tell the user to check Settings → Plans before starting a build, especially if they're mid-month.

## Don'ts

- Don't try to wire up live GraphQL on day one — static data first, GraphQL only if there's time.
- Don't build more than one hero page beautifully. Other pages can be placeholders.
- Don't polish the chat widget styling past ~15 minutes — the ACC widget's CSS tokens are limited and the header/body width mismatch is a known platform quirk.
- Don't promise live Claude MCP if the demo is in <2 hours. The OAuth flow has known partner-side issues as of mid-2026.
- Don't add disclaimers, hedging, or "consult a clinician" language to the agent. The demo audience is not the end customer.
