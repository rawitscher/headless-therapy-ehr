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

## Resuming a partial build (verify, don't rebuild)

Demos are often run with overlap — a parallel/prior run of this same skill may have already built some phases against the same org while the user was flipping toggles, or the user is re-invoking you after a break. **Before building anything, check whether prior work exists, and if it's consistent, switch to "audit + finish the gaps" instead of rebuilding from scratch.** A stress-test run saved hours and a lot of quota this way.

How to detect and verify prior work:
1. **Files:** look for an existing project dir / UI bundle / committed components. Check file timestamps — work newer than your scaffold step signals a parallel run.
2. **Org:** query the org for what's already there — `sf data query` for the demo records (do the expected Contact/Account IDs exist?), check for the deployed UI bundle, and look for a published agent (Bot ID `0Xx...`).
3. **Cross-check consistency:** confirm the prebuilt artifacts agree with each other — e.g., the instance URL, the Salesforce record IDs in `demoData.ts`, and the `agentId` in the Copilot component all match what's actually in the org. If they're consistent, trust the prior work.
4. **Switch modes:** if consistent prior work is found, tell the user you detected it and are switching to **audit-and-finish** (verify each phase's output, fill only the gaps) rather than rebuilding. If it's inconsistent or you can't verify, say so and confirm with the user before overwriting anything.

Never blindly rebuild over a partially-complete org — at best it wastes quota, at worst it creates duplicate records/agents.

## How to communicate while running this skill (IMPORTANT)

The audience is busy, often non-technical SEs/AEs reading in a chat panel. Three rules for every message you send during the build:

1. **Put the user's action items LAST.** Anything the user must DO (Setup toggles, a confirmation, an answer, the restart) goes at the very bottom of your message, as the final thing they read — never buried above status text or explanation. A teammate had to scroll up to find the Setup toggles because they were above other agent output. The 🔔 **WAITING ON YOU** banner (below) should be the literal last block in the message.
2. **Be concise — don't write essays as you progress.** Lead with a one-line status of what you just did, then the ask. Skip play-by-play narration, long recaps, and re-explaining things you already explained. If you must include reference detail, keep it short or put it in a file, not the chat. Err on the side of brevity at every phase.
3. **Make the takeaway unmistakable at the end.** When you finish (Phase 8) or hand off a deliverable, state the deliverable plainly as the closing item (see Phase 8 for the demo flow / click-path handoff).

These apply throughout — not just at wait points.

## Nudge the user whenever you're blocked on them (IMPORTANT)

This skill is often run by busy sales leaders who walk away from their laptop mid-build. Several steps require the human to do something (flip a Setup toggle, restart Cursor, activate a page, answer a scoping question). If the agent silently waits, the build stalls for minutes or hours.

**Whenever you stop and wait for the user — a question, a confirmation, a manual Setup action, or a restart — fire a desktop notification + sound so they look back at Cursor.** Run this immediately before (or as part of) the message where you hand control back to the user:

```bash
osascript -e 'display notification "<short what-I-need>" with title "Headless Demo Build" subtitle "Cursor needs you" sound name "Glass"'
```

Replace `<short what-I-need>` with a specific ask, e.g. `"Flip the Agentforce toggle in Setup, then say done"` or `"Restart Cursor so the skill loads"`. Keep it under ~8 words.

Rules:
- Fire it **every time** you yield to the user for a manual action or a required answer — not for trivial FYIs.
- It's macOS-only (`osascript`). On Linux, use `notify-send "Cursor needs you" "<short what-I-need>"` and `printf '\a'` for a bell. On Windows, just print a loud banner (below). If the notification command errors, ignore it and continue — never block the build on a failed nudge.
- Always **also** print a visible banner in chat so the ask is obvious even if they missed the notification:

> 🔔 **WAITING ON YOU** — <one-line description of exactly what to do>. Reply here when done.

Do not over-nudge: one notification per distinct wait point.

## The 7-phase build sequence

Follow this order. Skipping ahead causes rework.

### Phase 1: Scope with the AE (15 min)

Ask the AE these questions before writing code. Use the AskQuestion tool if available, otherwise ask conversationally.

**Step 1A — Identify the customer (hard gate, ask FIRST):**

Before any other scoping, ask:

- **Customer name?** (e.g., "Regional Trust Bank")
- **Customer website URL?** (e.g., `https://www.regionaltrust.com`)

This is the single highest-information input — it determines brand colors, typography, product terminology, tone, and the entire visual feel of Phase 4. Don't move on without it.

**If the user provides a real customer + URL:**

1. **Auto-fetch the homepage — get the RAW HTML, not just rendered text.** ⚠️ A plain rendered-text fetch strips CSS, colors, and font declarations, which is exactly what you need for branding. Pull the raw markup (e.g., `curl -sL <url>`) and inspect it for:
   - Primary + secondary brand colors — grep for hex codes (`#[0-9a-fA-F]{3,6}`), CSS custom properties (`--*-color`), and theme/`<meta name="theme-color">` values
   - Font family — grep `font-family` declarations and Google Fonts `<link href="...fonts.googleapis.com...">` tags
   - Product/feature terminology (what do they call their core noun — "Members"? "Clients"? "Cases"? "Orders"?)
   - Tone (formal/clinical, warm/human, fast/efficient, etc.)
2. **Present a 4–6 line "brand summary"** back to the user and ask them to confirm/adjust before proceeding. Example: *"Got it — Regional Trust Bank. From their site: navy `#0B2545` primary, gold `#C8A951` accent, Inter font, they call account holders 'Members', tone is formal/trustworthy. Sound right?"*
3. Save these values — they feed directly into Phase 4 (brand CSS variables, font import, terminology).

**If the user says "I'll fill in later" / "use generic for now" / similar:**

Acknowledge, but **explicitly tell them you'll pause at Phase 4** rather than building hero surfaces blind:

> Got it — I'll proceed with a generic scaffold using neutral brand tokens and vertical-appropriate placeholder terminology. **I will pause at Phase 4 (hero surfaces) and re-ask for the customer name + URL before building any branded UI** — that's the work that gets thrown away if we guess wrong. Phases 2 (org prep), 3 (scaffold), and 5 (CRM data) are brand-independent, so we'll get good forward motion.

Enter **deferred-branding mode**:
- Use placeholder CSS tokens (`--brand-primary: #2563EB` neutral blue, `--brand-accent: #64748B` slate, system font stack)
- Use the vertical playbook's generic entity name (Member / Client / Customer / Constituent — NOT a customer-specific term)
- Name the project + UI bundle generically (e.g., `headless-demo`, `DemoApp`) so renaming later is cheap
- **At the start of Phase 4, STOP and re-ask Step 1A.** Do not begin building hero pages until the customer is named and the brand summary is confirmed.

**Step 1B — Identify the vertical and starting playbook:**

- **Industry?** (e.g., financial services, healthcare, public sector, retail, field service, professional services)
- **Which tool's UX are they trying to keep?** (e.g., nCino, TherapyNotes, ServiceNow, Toast, Tyler, Workday)

→ Open [industry-playbooks.md](industry-playbooks.md) and find the matching vertical section. Use it as your starting scaffold (hero surface, personas, custom fields, AI insight cards, flow ideas, terminology). If the customer's vertical isn't listed, pick the closest one and adapt.

**Step 1C — Confirm scope:**

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

> 💡 **If the user seems confused about "Dev Hub" vs "scratch org," explain it in one line before proceeding:** the **Dev Hub** is their permanent org that's allowed to *create* temporary orgs (they log into it once); the **scratch org** is the fresh, disposable org you actually build the demo in (created from the Dev Hub, auto-expires in ~30 days). Everything in this build deploys to the *scratch* org, not the Dev Hub.

**Step 2A — Create the scratch org and open it:**

⚠️ **Pre-flight: check the active scratch-org limit FIRST.** Dev Hubs cap active scratch orgs (commonly 3). If you're at the cap, creation fails with `LIMIT_EXCEEDED ... reached its active scratch org limit` after you've already started. Check before attempting:

```bash
sf org list limits -o <devhub> | grep -i scratch   # look at ActiveScratchOrgs remaining
```

If `ActiveScratchOrgs` remaining is 0, **ask the user which existing scratch org to delete** (`sf org list` to show them) — this is destructive, so never auto-delete. Then `sf org delete scratch -o <alias> -p` and proceed.

> 💡 **`sf` stdout pollution (applies to ALL `sf ... --json` calls):** the CLI sometimes prints an "update available" warning that corrupts `--json` output. Always parse defensively — append `2>/dev/null` and slice to the first `{`. A reliable Python pattern: `sf ... --json 2>/dev/null | python3 -c "import sys,json; s=sys.stdin.read(); print(json.loads(s[s.find('{'):]))"`. Or pre-strip with `sed -n '/^{/,$p'` before piping to a JSON parser.

Use this `config/project-scratch-def.json`:

```json
{
  "orgName": "<Customer> Headless Demo Org",
  "edition": "Developer",
  "features": ["Einstein1AIPlatform"],
  "settings": {
    "einsteinGptSettings": { "enableEinsteinGptPlatform": true }
  }
}
```

⚠️ **The settings key is `einsteinGptSettings`, NOT `einsteinGptPlatformSettings`.** A stress-test run used `einsteinGptPlatformSettings` and the org created but the settings deploy failed with *"The object 'EinsteinGptPlatform' of type Settings metadata does not exist"* — leaving a half-broken org. If you hit that error on ANY Dev Hub, **drop the entire `settings` block and go features-only** (`{ "orgName": "...", "edition": "Developer", "features": ["Einstein1AIPlatform"] }`) — the Phase 2B manual toggles enable Einstein + Agentforce anyway, so the settings block is a convenience, not a requirement.

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
| 3 | `Agentforce Agents` | Search **"Agentforce Agents"** (NOT just "Agentforce" — that lands on a different page and confuses users) and turn on the **Agentforce** toggle there. ⚠️ If the toggle doesn't appear right away, refresh the page — Setup sometimes caches the pre-Einstein state. | Required to create/publish the agent in Phase 6 |
| 4 | `Digital Experiences → Settings` | Check **Enable Digital Experiences** → Save. Then go to **Digital Experiences → All Sites**, click **New Site**, then immediately click **Back to Setup** (you don't need to actually create a site). This forces the org to provision the React-hosting prerequisites. | The UI Bundle hosts inside an Experience Site, and the "New Site" click is what triggers the underlying React infra setup |

Pause after each toggle and ask the user to confirm "done" before moving to the next one — they're click-fatigue prone and Setup's UI is slow. **Fire a desktop notification (see "Nudge the user" above) each time you hand a toggle back to them** — this is the longest manual-wait phase and the most common place a distracted user strands the build.

⚠️ **Present each toggle as the LAST thing in your message** (the exact search term + what to click, as the closing 🔔 WAITING ON YOU block). Don't put the toggle instruction above other text — a teammate had to scroll up to find it. One toggle per message, instruction last.

### Phase 3: Scaffold the UI bundle (10 min)

**Step 3A — Pick a clean project directory.** Don't dump in `~/`. Ask the user:

> Where should I create the project? I recommend `~/Documents/se-demos/` to keep things organized. Reply with that, your own path, or just "default" and I'll use `~/Documents/se-demos/`.

If the directory doesn't exist, create it (`mkdir -p ~/Documents/se-demos`), then `cd` into it before running `sf project generate`. Never assume the user is in the right directory — always confirm path with `pwd`.

**Step 3B — Scaffold:**

```bash
sf project generate --name <customer>-demo --template empty
cd <customer>-demo
sf template generate ui-bundle --name <AppName> --template reactbasic
cd force-app/main/default/uiBundles/<AppName>
npm install
```

⚠️ **The `--template reactbasic` flag is REQUIRED.** Without it, `sf template generate ui-bundle` defaults to `--template default`, which scaffolds a **static HTML "Base Web App"** (just `index.html` + meta, NO `package.json`, NO React) — and the next `npm install` fails with `ENOENT ... package.json`. The CLI options are `default | reactbasic`; you want `reactbasic`. If you somehow scaffolded the wrong one, delete the bundle folder and regenerate with the flag.

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

⚠️ **If you're in deferred-branding mode from Phase 1, STOP HERE.** Re-ask the user for the customer name + website URL now, auto-fetch the site, present the brand summary, and only proceed once they confirm. Hero surface work without a real customer is the single biggest source of rework — colors, fonts, terminology, and tone all flow from this answer. Do not build any branded component before this is locked in.

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
  - ⚠️ **Google Fonts are CSP-blocked by default in-org — register Trusted Sites or the brand font silently won't load** (the page degrades to a fallback font with no hard error; the demo just looks "off"). The moment you import any Google Font, add `CspTrustedSite` metadata for **both** hosts — `fonts.googleapis.com` (the stylesheet) and `fonts.gstatic.com` (the woff2 files) — each marked applicable to **style-src AND font-src**:

```xml
<!-- force-app/main/default/cspTrustedSites/GoogleFontsStylesheet.cspTrustedSite-meta.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<CspTrustedSite xmlns="http://soap.sforce.com/2006/04/metadata">
    <endpointUrl>https://fonts.googleapis.com</endpointUrl>
    <context>All</context>
    <isActive>true</isActive>
    <isApplicableToStyleSrc>true</isApplicableToStyleSrc>
    <isApplicableToFontSrc>true</isApplicableToFontSrc>
</CspTrustedSite>
```

  Repeat with a second file for `https://fonts.gstatic.com`. Deploy them with the rest of your metadata. **Alternative (more robust for high-stakes demos): self-host the fonts** — download the woff2 files into the bundle and `@font-face` them locally, which sidesteps CSP entirely. Either works; pick self-hosting if you can't afford a font that doesn't load on demo day.
- **Custom favicon + title** — inline SVG favicon in `index.html` with the customer's monogram. Title = customer's tool name, never "Salesforce."
- **One hero detail page does 80% of the work** — see [industry-playbooks.md](industry-playbooks.md) for vertical-specific names: Patient 360 (healthcare), Member 360 (FSI), Constituent 360 (public sector), Order 360 (retail), Asset 360 (field service), Engagement 360 (prof services). Tabs are vertical-specific too — sessions/notes/billing for healthcare, accounts/transactions/risk for FSI, etc. Spend most of your time here.
- **AI Insights tab pattern** — 2×2 grid of cards. The four standard categories generalize across verticals: (1) AI-drafted artifact (note / email / summary / disclosure), (2) churn or attrition risk, (3) domain-specific signal (clinical / financial / behavioral / operational), (4) engagement signal. Each card has a small "Agentforce" pill + sparkle icon. Hover state expands inline (don't use floating popovers — they fight the animation transforms). See the playbook for vertical-specific card content.
- **Link to real CRM records** — every record in your static `demoData.ts` should have a `salesforceContactId` (or `salesforceAccountId`, `salesforceCaseId`) field. Display a clickable Salesforce ID badge in the header that links to `<INSTANCE_URL>/lightning/r/<SObject>/<id>/view`. This is the single highest-leverage trick — proves the demo is real.
- **Add ONE write-back action button** ⭐ — a button on the hero record that *writes* to Salesforce (default: "Create follow-up task" → creates a real `Task` linked to the record), with a success state that links straight to the new record in Salesforce. This is the highest-impact moment after the CRM link: it proves the headless UI isn't read-only — it drives real Salesforce automation through a UI the customer designed. Uses a GraphQL mutation (Apollo is already wired, no Apex needed). **See [salesforce-action-button.md](salesforce-action-button.md) for the drop-in component, mutation, permissions, and per-vertical variations.** Build exactly one — more dilutes the moment and adds demo-day risk.

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

**Build a custom Lightning Record Page** that shows the same fields you surfaced in React, organized cleanly. See [contact-record-page.md](contact-record-page.md) for per-vertical field lists.

⚠️ **Build it BY HAND in Lightning App Builder — do NOT deploy FlexiPage XML.** Two stress-test runs confirmed the XML approach is API-version-fragile and frequently undeployable in fresh scratch orgs (standard components fail "design time component information" resolution; ~8 wasted deploy attempts in one run — the biggest quota sink of the whole build). The manual UI path takes ~3 minutes and always works:

1. Setup → Object Manager → Contact → Lightning Record Pages → **New** (or edit the org default)
2. Pick a template, drag on a **Record Detail** component, add a **Field Section** with your vertical's custom fields
3. **Save → Activation → Org Default (Desktop)** (activation isn't reliably deployable anyway)
4. Verify by opening a seeded Contact — if a field is missing, check the Phase 5 permission set's FLS

(If you absolutely must keep the page in source control, [contact-record-page.md](contact-record-page.md) has a structurally-verified minimal XML — but it may still fail on component resolution, in which case fall back to the manual build.)

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

Grab the published agent ID (starts with `0Xx`) and paste into `src/components/<Brand>Copilot.tsx`.

⚠️ **Pass `salesforceOrigin` explicitly — do NOT rely on auto-resolution.** The component is *supposed* to auto-resolve the org origin from `globalThis.SFDC_ENV.orgUrl` in production, but inside a deployed UI bundle that variable often only has `basePath` populated (not `orgUrl`), so the widget throws **`salesforceOrigin or frontdoorUrl is required`** and the chat silently fails to load during the demo. Resolve it yourself: the app runs on `*.lightning.force.com`, so `window.location.origin` is the correct value in-org.

```tsx
import { AgentforceConversationClient } from '@salesforce/ui-bundle-template-feature-react-agentforce-conversation-client';

// Resolve the Salesforce org origin for the ACC widget.
// The deployed bundle runs on <my-domain>.lightning.force.com; instanceUrl
// (my.salesforce.com) is NOT the right value here — use the page origin.
function resolveSalesforceOrigin(): string {
  const envOrigin = (globalThis as any).SFDC_ENV?.orgUrl as string | undefined;
  if (envOrigin) return envOrigin;
  if (typeof window !== 'undefined' &&
      window.location.hostname.endsWith('.lightning.force.com')) {
    return window.location.origin;
  }
  // Last resort only (e.g. unusual host): hardcode YOUR org's Lightning origin.
  // Leave this unreached in normal in-org runs.
  return window.location.origin;
}

export default function BrandCopilot() {
  return (
    <AgentforceConversationClient
      agentId="0Xx..."
      agentLabel="<Brand> Agent"
      salesforceOrigin={resolveSalesforceOrigin()}
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

⚠️ **The widget header label (`agentLabel`) should read "`<Company> Agent`", not "Copilot."** Customers want it branded as their agent (e.g., "BARK Air Agent"). Use "Agent" in the user-facing label.

> Note: the bundle hosts inside an Experience Site. If the widget loads but can't resolve assets/session, the ACC SDK also accepts a `sitePrefix` prop (the path segment after the host, e.g. `/demo`) — usually not needed, but reach for it if you see Lightning Out asset/routing errors.

### Phase 7: Flow + MCP + close (30 min)

- **Flow:** Two good options — (a) **best if you built the Phase 4 write-back action button:** a record-triggered flow that fires the instant the button creates the Task, so one click in the custom UI visibly cascades into platform automation (auto-flag the Task as high priority). See the "Make the automation story louder" section of [salesforce-action-button.md](salesforce-action-button.md). (b) Otherwise, a schedule-triggered flow that does something the customer's current "broken Zapier" does. Either way, a Flow Builder screenshot is the safe fallback; live execution is optional and riskier. Use the `generating-flow` skill to author the `.flow-meta.xml` — don't hand-write Flow XML.
  - ⚠️ **Pre-check Flow-MCP availability before committing to a live Flow.** The `generating-flow` skill depends on the `execute_metadata_action` tool via the `user-mcp-adaptor` MCP server, which is sometimes down. Check its status first (the MCP folder's `STATUS.md`, or just attempt a trivial call). **If it's unavailable, say so plainly and fall back to the screenshot-only Flow** — don't flail retrying. Document the intended flow in the talk track for the user to build later (e.g., record-triggered on `Task`, entry condition `Subject contains "<App> Console"`, before-save set `Priority = High`).
- **Consolidation page:** A `Consolidation.tsx` page with a before/after layout: 5 logos in chaos on the left, the customer's branded React app on the right, arrow between. Caption: "X tools → 1 platform."
- **MCP setup (optional, often flaky):** Configure a Salesforce Hosted MCP server + External Client App for `claude.ai`. See [mcp-claude-setup.md](mcp-claude-setup.md). **Recommendation:** show the Setup → MCP Servers page as a static slide rather than risk a live OAuth failure.

### Phase 8: Wrap-up — hand the user a clear demo flow (5 min, DO NOT SKIP)

The user just spent hours building and is often unsure how to actually *present* it. The **demo flow / click-path doc is the headline takeaway of the whole build** — make it impossible to miss. Close the loop:

1. **Write `DEMO_TALKTRACK.md`** to the project root (template below), filled in with the customer's real names, page routes, agent prompts, and Salesforce record links. The customer-specific version, not the generic template.
2. **Fire a desktop notification** ("Demo is ready — here's your click path").
3. **Make the final chat message short and end with the deliverable + the flow.** Lead with one line that names the file as the takeaway, then the numbered click path as the closing block. Don't bury it under a build recap. Use this format:

> ✅ **Demo's ready. Your click path is saved to `DEMO_TALKTRACK.md`** (project root) — open it for the full script, links, and fallbacks. Here's the path to run it live:
>
> 1. **Open the app** — App Launcher → `<AppName>` → `<hero route>`. *"Does this feel like your current tool?"*
> 2. **Walk the 360** — open `<demo record name>`, stop on the **AI Insights** tab. *"All Agentforce, all on-platform."*
> 3. **Trigger the action** — click **<action button label>** → open the created Task (point out the auto-stamped High priority). *"One click in our UI, the platform did the rest."*
> 4. **Click the CRM badge** — opens the real record: `<INSTANCE_URL>/lightning/r/<SObject>/<recordId>/view`. *"Still Salesforce — nothing's faked."*
> 5. **Use the copilot** — ask `"<suggested demo prompt>"`. *"AI on your platform, not bolted on."*
> 6. **Close on consolidation** — open the Consolidation page. *"<N> tools → 1 platform."*

Tailor the bracketed values to the actual build. Drop any step that doesn't exist (no action button, no live agent) rather than leaving a placeholder.

**Quick-open links in `DEMO_TALKTRACK.md`** — include direct links ONLY for targets with stable URL patterns, so a leader can pre-open tabs before the demo. Fill in the real `<INSTANCE_URL>` (from `sf org display`) and record IDs (from Phase 5):

| Target | Link to include | Reliable? |
|---|---|---|
| Salesforce Contact/Account record | `<INSTANCE_URL>/lightning/r/<SObject>/<recordId>/view` | ✅ Yes — use the real IDs from Phase 5 |
| The Flow (Setup) | `<INSTANCE_URL>/lightning/setup/Flows/home` | ✅ Yes |
| Agent Builder (Setup) | `<INSTANCE_URL>/lightning/setup/EinsteinCopilot/home` | ✅ Mostly |
| The React app pages (hero / 360 / consolidation) | ❌ **Do NOT hardcode a deep link** | ❌ No — the deployed app URL pattern varies per org and a dead link on demo day is the exact failure Phase 3E warns about |

For the React app pages, write **"App Launcher → `<AppName>` → navigate to `<route>`"** instead of a URL. Never guess the deployed app's direct URL — even in the talk track.

## The talk track template

Write `DEMO_TALKTRACK.md` (Phase 8) with this structure, filled in with the customer's real names/routes:

```markdown
1. React app — "Does this feel familiar?" (hero page → 360 → AI cards → chat)
2. Salesforce record — click the CRM link → "It's still Salesforce underneath"
3. Action button — click it in the React UI → show the Task/record created in Salesforce
4. Flow — "The automation win" (screenshot or live)
5. Agent Builder — "AI on your platform, not bolted on"
6. (Optional) Claude + MCP — "And it's open"
7. Consolidation page — "N tools → 1 platform" close
```

## Critical gotchas (validated the hard way)

| Symptom | Cause | Fix |
|---|---|---|
| `git: command not found`, or nvm/npm installs fail to compile on macOS | Xcode Command Line Tools missing | Run `xcode-select --install` (pops a GUI installer); wait for it to finish, then retry. Check with `xcode-select -p`. |
| `npm: command not found` during Phase 3 scaffolding, or weird/empty output from `npm install` | Node installed without npm (Homebrew node-only, corepack-only, partial nvm), even on a "modern" version like v22.x | Reinstall Node via `nvm install --lts && nvm use --lts && nvm alias default 'lts/*'`; confirm BOTH `node --version` and `npm --version` print before retrying. Do not work around with corepack/npx. |
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
| Agent chat: `salesforceOrigin or frontdoorUrl is required` (console); widget never loads | `SFDC_ENV.orgUrl` empty in the deployed bundle, so ACC auto-resolution fails | Pass `salesforceOrigin={resolveSalesforceOrigin()}` explicitly (Phase 6 snippet) — use `window.location.origin` since the app runs on `.lightning.force.com` |
| Brand font silently doesn't load (page uses a fallback font, no hard error) | Google Fonts CSP-blocked (`style-src`/`font-src` violation in console) | Deploy `CspTrustedSite` for `fonts.googleapis.com` + `fonts.gstatic.com` (style+font src), or self-host the fonts. See Phase 4 branding. |
| `npm install` fails `ENOENT package.json` right after scaffolding | `sf template generate ui-bundle` defaulted to `--template default` (static HTML, no React) | Regenerate with `--template reactbasic` (Phase 3B) |
| Scratch-org settings deploy fails: "object 'EinsteinGptPlatform' of type Settings does not exist" (org half-created) | Wrong scratch-def settings key (`einsteinGptPlatformSettings`) | Use `einsteinGptSettings`, or drop the `settings` block entirely and go features-only (Phase 2A) |
| `LIMIT_EXCEEDED ... active scratch org limit` on create | Dev Hub at its active scratch-org cap (commonly 3) | `sf org list limits`; ask user which org to delete; `sf org delete scratch -o <alias> -p`; recreate (Phase 2A) |
| FlexiPage deploy fails: "design time component information" / "componentInstance is duplicated" / "Template ... doesn't exist" | The Phase 5.5 record page is API-version-fragile; standard components often don't resolve in fresh scratch orgs | Build the record page **by hand in Lightning App Builder** instead of deploying XML. See [contact-record-page.md](contact-record-page.md). |

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
- [contact-record-page.md](contact-record-page.md) — Salesforce-side Contact record page (Phase 5.5) — build BY HAND in Lightning App Builder; XML is fragile (per-vertical field lists + optional minimal XML inside)
- [graphql-reference.md](graphql-reference.md) — Salesforce GraphQL API shapes, codegen flow, hybrid live/static pattern (read before writing ANY GraphQL query)
- [salesforce-action-button.md](salesforce-action-button.md) — Drop-in write-back action button (create a Task / Case / field update from the React UI via GraphQL mutation) — the highest-impact "real platform underneath" demo moment (Phase 4)
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
