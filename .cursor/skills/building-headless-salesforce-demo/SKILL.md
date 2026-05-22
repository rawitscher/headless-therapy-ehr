---
name: building-headless-salesforce-demo
description: Build a custom-branded "headless" Salesforce demo for a specific customer using the React UI Bundle (Multi-Framework Beta), Agentforce, Flow, and real CRM data. Use when an SE or AE asks to build a customer-tailored demo where the customer doesn't want Salesforce UX, when the prompt mentions Headless360, TherapyNotes-style, ServiceNow-style, custom UI on Salesforce, React multi-framework, UI Bundle, or AgentforceConversationClient, or when the demo narrative is "you can have the UI you want without giving up the platform you need."
---

# Building a Headless Salesforce Customer Demo

This skill captures the end-to-end pattern for building a beautifully custom-branded React app on Salesforce, deployed via the UI Bundle Multi-Framework (Beta), with a working Agentforce copilot and live CRM data. Validated against a real customer demo (mid-2026, behavioral health vertical, 5-day build compressed to 4 hours).

## When to use this skill

Use when the request involves any of:
- A customer demo where the customer dislikes standard Salesforce UX
- "Headless360" / "Headless commerce" / custom-branded UI on Salesforce
- TherapyNotes, ServiceNow, Workday, Toast, or other vertical-SaaS look-and-feel
- The new React Multi-Framework Beta / UI Bundle / `AiAuthoringBundle` deployment
- An Agentforce copilot embedded in a non-LWC web surface
- A "5 tools → 1 platform" consolidation narrative

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

## The 7-phase build sequence

Follow this order. Skipping ahead causes rework.

### Phase 1: Scope with the AE (15 min)

Ask the AE these questions before writing code. Use the AskQuestion tool if available, otherwise ask conversationally:

- **Primary hero surface** — provider/agent/dispatcher/associate/etc.?
- **Agentforce role** — proactive insights only, chat only, or both?
- **Agent backing** — build a real agent, or stub the chat?
- **Data strategy** — mostly static, mix, or live GraphQL? (Mostly static is fine and saves hours.)
- **Flow demo** — live trigger, or screenshot of Flow Builder?
- **Deployment target** — fresh scratch org, customer SDO, existing dev org?
- **Demo tone** — "simple/clinical/human" vs "data-dense/power-user" vs "playful"

Write the answers down. Re-reference during build to avoid scope creep.

### Phase 2: Org prep (20 min, often longest blocker)

The UI Bundle Multi-Framework Beta requires **manual toggles in Setup** that cannot be enabled via `project-scratch-def.json`. This is the #1 source of mid-build pain.

Required toggles (have the user do these in Setup):

1. **Setup → Vibes Settings → React Development with Agentforce Vibes and Salesforce Multi-Framework (Beta)** → Enable
2. **Setup → Einstein Setup → Turn on Einstein** → Enable
3. **Setup → Agentforce → Turn on Agentforce** → Enable
4. **Setup → My Domain → Routing and Policies → Cookies → uncheck "Require first party use of Salesforce cookies"** ⚠️ critical for the chat widget to authenticate

For scratch orgs, include this in `config/project-scratch-def.json`:

```json
{
  "features": ["Einstein1AIPlatform"],
  "settings": {
    "einsteinGptPlatformSettings": { "enableEinsteinGptPlatform": true }
  }
}
```

⚠️ Do NOT try to add `DataCloud`, `CustomerDataPlatform`, `AgentforceVibeForMultiFramework`, or `Agentforce` as features — these names are wrong or unavailable on most Dev Hubs. Just use `Einstein1AIPlatform`.

### Phase 3: Scaffold the UI bundle (10 min)

```bash
sf project generate --name <customer>-demo --template empty
cd <customer>-demo
sf template generate ui-bundle --name <AppName>
cd force-app/main/default/uiBundles/<AppName>
npm install
npm run dev
```

The dev server runs at `http://localhost:5173`. Do all visual iteration here — it's 100× faster than redeploying to the org.

### Phase 4: Build the hero surfaces (1.5 hr — the bulk of the work)

Read `building-ui-bundle-frontend` for the project conventions (shadcn/ui, Tailwind, `appLayout.tsx`, `routes.tsx`).

Customer-demo specifics on top of that:

- **Brand the global CSS** — define 4–6 brand color CSS variables in `src/styles/global.css` (`--<brand>-primary`, `--<brand>-bg`, etc.) and use them everywhere. Import the customer's actual font family from Google Fonts. Add a few subtle keyframe animations (`fadeUp`, `sparkleIn`, `pulse`) — they make the AI cards feel alive.
- **Custom favicon + title** — inline SVG favicon in `index.html` with the customer's monogram. Title = customer's tool name, never "Salesforce."
- **One hero detail page does 80% of the work** — Patient 360 / Customer 360 / Order 360. Tabs for Sessions/Notes/Insights/Billing. Spend most of your time here.
- **AI Insights tab pattern** — 2×2 grid of cards with: AI-drafted note, churn risk, clinical/account signal, engagement signal. Each card has a small "Agentforce" pill + sparkle icon. Hover state expands inline (don't use floating popovers — they fight the animation transforms).
- **Link to real CRM records** — every patient/customer in your static `demoData.ts` should have a `salesforceContactId` field. Display a clickable Salesforce Contact ID badge in the header that links to `<INSTANCE_URL>/lightning/r/Contact/<id>/view`. This is the single highest-leverage trick — proves the demo is real.

### Phase 5: Seed CRM data (30 min)

The point: when the AE clicks the Salesforce link in the demo, a real record opens.

1. **Create custom fields on Contact** matching what's in your React UI:
   ```
   force-app/main/default/objects/Contact/fields/
     <Field1>__c.field-meta.xml
     <Field2>__c.field-meta.xml
     ...
   ```
   Typical fields: `Patient_Status__c`, `Risk_Level__c`, `Primary_Diagnosis__c`, `Outstanding_Balance__c`, `Next_Appointment__c`, `Latest_<Assessment>_Score__c`.

2. **Create a permission set** granting FLS to all custom fields. Without this, the deployed user can't see the fields even as admin.

3. **Create demo records via JSON tree import**:
   ```bash
   sf data import tree --files data/contacts.json --target-org <alias>
   ```

4. **Grab the Contact IDs** post-import and paste them into `src/data/demoData.ts` as `salesforceContactId` on each patient.

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
| "UIBundle Metadata API is not enabled" on deploy | React Multi-Framework Beta toggle off | Setup → Vibes Settings → enable |
| Agent chat shows "Authentication Error" | Cookie restriction on | Setup → My Domain → uncheck first-party cookies |
| Agent chat: "Something went wrong" mid-conversation | Subagents not activated or instructions ask for clarification | Activate each subagent; bake defaults into system prompt |
| `sf agent preview` "Invalid user ID" but widget works | Expected for Employee Agent via CLI | Ignore — preview needs different auth context |
| Hover preview overlaps cards | `position:absolute` fighting CSS animation `transform` | Use inline expanding section instead of floating popover |
| Claude MCP "Couldn't reach the MCP server" | Wrong URL format for scratch org | Use `/sandbox/platform/sobject-reads` path for scratch/sandbox |
| Claude MCP `OAUTH_APPROVAL_ERROR_GENERIC` after consent | ECA missing `mcp_api` scope | Add `Access Salesforce hosted MCP servers (mcp_api)` to selected scopes |
| Scratch org features rejected | Wrong feature names | Only `Einstein1AIPlatform` is reliably available |

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

- [agent-script-template.md](agent-script-template.md) — Full Agent Script template with hub-and-spoke pattern
- [mcp-claude-setup.md](mcp-claude-setup.md) — Step-by-step Claude.ai ↔ Salesforce MCP setup
- [demo-data-pattern.md](demo-data-pattern.md) — `demoData.ts` structure + Contact field examples

## Don'ts

- Don't try to wire up live GraphQL on day one — static data first, GraphQL only if there's time.
- Don't build more than one hero page beautifully. Other pages can be placeholders.
- Don't polish the chat widget styling past ~15 minutes — the ACC widget's CSS tokens are limited and the header/body width mismatch is a known platform quirk.
- Don't promise live Claude MCP if the demo is in <2 hours. The OAuth flow has known partner-side issues as of mid-2026.
- Don't add disclaimers, hedging, or "consult a clinician" language to the agent. The demo audience is not the end customer.
