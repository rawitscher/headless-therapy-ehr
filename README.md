# headless-therapy-ehr

A reference implementation + reusable Cursor skill for building **custom-branded, "headless" Salesforce demos** that mirror vertical-SaaS UX (think TherapyNotes / ServiceNow / Workday) on top of the platform.

Built as a 4-hour proof of concept for a behavioral-health customer (The Counseling Center Group). The same pattern works for any customer that says *"we like our current UI but we know we need a real platform underneath."*

## What's here

```
.cursor/skills/building-headless-salesforce-demo/    # Reusable Cursor skill — the playbook
ccg-demo/                                            # Reference build (CCG Clinical)
ccg-demo/SLACKBOT_REPLICATE_GUIDE.md                 # Slackbot skill — coaches teammates through prereqs
ccg-demo/CCG_AGENT_SETUP.md                          # Agentforce setup doc for the reference build
```

## What it demos

- **React UI Bundle (Multi-Framework Beta)** deployed as `AiAuthoringBundle` metadata
- **Provider EHR look-and-feel** — left nav, calendar, Patient 360, AI Insights tab
- **Live Agentforce copilot** embedded via `<AgentforceConversationClient>`, backed by a published Agent Script bundle with hub-and-spoke routing
- **Real CRM bridge** — every patient links to a real Salesforce Contact record via a clickable badge
- **Custom Contact fields** + permission set for FLS
- **Schedule-triggered Flow** for the "automation win" beat
- **Consolidation page** (5 tools → 1 platform) for the close

## Quickstart (for teammates replicating this)

1. **Install the Cursor skill:**

   ```bash
   mkdir -p ~/.cursor/skills
   cp -r .cursor/skills/building-headless-salesforce-demo ~/.cursor/skills/
   ```

2. **Restart Cursor** so it picks up the new skill.

3. **Open a fresh Cursor chat in a new workspace** and prompt:

   > Use the `building-headless-salesforce-demo` skill to help me build a customer demo for [CUSTOMER]. They want a [TOOL]-style [PERSONA] experience. Demo is in [TIMEFRAME]. My org alias is [ALIAS].

   Cursor will run you through scoping questions and then the 7-phase build.

4. **For SE teams using Slackbot:** load `ccg-demo/SLACKBOT_REPLICATE_GUIDE.md` as a Slackbot skill so teammates can DM Slackbot to get prepped before they hit Cursor.

## The 7-phase build sequence

Full details in [SKILL.md](.cursor/skills/building-headless-salesforce-demo/SKILL.md). Summary:

1. **Scope** (15 min) — Hero surface? AI role? Static or live data?
2. **Org prep** (20 min) — Manual toggles in Setup that scratch-def can't set
3. **Scaffold** (10 min) — `sf template generate ui-bundle`
4. **Hero surfaces** (90 min) — One beautiful page does 80% of the work
5. **CRM data** (30 min) — Custom fields + permset + tree import
6. **Agentforce** (45 min) — Agent Script with hub-and-spoke pattern
7. **Flow + close** (30 min) — Screenshot the Flow, build the consolidation page

## Key gotchas (the ones that cost me hours)

| Symptom | Fix |
|---|---|
| `UIBundle Metadata API is not enabled` | Setup → Vibes Settings → enable React Multi-Framework Beta |
| Chat widget shows "Authentication Error" | Setup → My Domain → uncheck "Require first party use of Salesforce cookies" |
| Agent: "Something went wrong" mid-conversation | Activate each subagent (root activation isn't enough) |
| Scratch org "Invalid Features" | Only `Einstein1AIPlatform` is reliably available — don't add `DataCloud`, `Agentforce`, etc. |
| Claude MCP `OAUTH_APPROVAL_ERROR_GENERIC` | ECA missing `mcp_api` scope |

Full table in [SKILL.md](.cursor/skills/building-headless-salesforce-demo/SKILL.md).

## Status

- ✅ React UI Bundle + Patient 360 + Insights — production-ready pattern
- ✅ Agentforce Employee Agent via Agent Script — deployable, works in widget
- ⚠️ Claude.ai ↔ Salesforce MCP — known partner-side OAuth issues (last verified broken May 2026)

## License

Internal use. Don't redistribute customer-identifiable detail.
