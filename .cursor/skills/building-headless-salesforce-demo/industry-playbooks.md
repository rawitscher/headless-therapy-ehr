# Industry Playbooks

Vertical-specific recipes for the headless Salesforce demo pattern. Start here once you've identified the customer's industry in Phase 1.

Each playbook gives you:
- **Hero persona** (whose day the demo is built around)
- **Hero detail page** (the 360 view — name, tabs, key sections)
- **Supporting surfaces** (2–3 lighter pages)
- **Custom fields** (what to put on the primary SObject)
- **AI insight cards** (the 4-card 2×2 grid on the hero page)
- **Agentforce subagents** (3 task types for the chat copilot)
- **Automation win** (the Flow story to replace a "broken Zapier")
- **Consolidation narrative** (the "N tools → 1 platform" close)
- **Brand cues** (typography, color palette direction, tone)

If the customer's vertical isn't here, pick the closest one and adapt.

---

## Financial Services (Wealth / Retail Banking / Insurance)

**Inspiration:** nCino, Black Knight, Fiserv, Bloomberg Terminal, Mint, Robinhood.

### Hero persona
**Banker / Relationship Manager / Wealth Advisor** preparing for client meetings.

### Hero detail page — "Member 360" or "Client 360"
Primary entity: Account (household) or Contact (individual member).

Tabs:
- **Relationships** — household members, beneficiaries, related accounts
- **Holdings / Portfolio** — accounts, balances, recent transactions
- **Activity** — meetings, calls, emails, document signings
- **Insights** — the 2×2 AI card grid
- **Compliance** — KYC status, suitability docs, regulatory holds

### Supporting surfaces
- **Pipeline / Book of business** — list of clients sorted by AUM, risk, next review date
- **Client portal preview** — what the client sees in their app
- **Consolidation page**

### Custom fields (on Contact or Account)
- `Risk_Tolerance__c` (Picklist: Conservative/Moderate/Aggressive)
- `Assets_Under_Management__c` (Currency)
- `Net_Worth_Estimate__c` (Currency)
- `Last_Review_Date__c` (Date)
- `Next_Review_Due__c` (Date)
- `KYC_Status__c` (Picklist: Verified/Pending/Expired)
- `Life_Event_Flag__c` (Picklist: Marriage/Divorce/Inheritance/Retirement/None)
- `Primary_Advisor__c` (Text or User lookup)
- `Relationship_Tier__c` (Picklist: Platinum/Gold/Silver)

### AI insight cards
1. **AI-drafted meeting prep** — talking points for next client meeting, hover to preview
2. **Attrition risk** — client likely to leave (declined engagement + competitor mention in CRM notes)
3. **Cross-sell signal** — life event detected (kid in college, recent move) → product recommendation
4. **Compliance signal** — KYC expiring in 30 days OR portfolio drift outside risk band

### Agentforce subagents
- `client_prep` — Summarize a client's last 90 days of activity before a meeting
- `client_outreach` — Draft a warm, advisor-voice message (review reminder, market commentary)
- `book_review` — Identify top 3 clients at risk of attrition or due for review this week

### Automation win
Schedule-triggered Flow: every Monday morning, query clients with `Next_Review_Due__c` ≤ next 30 days, send the advisor a digest task list. Replaces "I keep a spreadsheet."

### Consolidation narrative
"5 tools → 1 platform": LOS (loan origination) + portfolio system + CRM + Outlook + Excel spreadsheets → Financial Services Cloud.

### Brand cues
- Palette: navy/forest green/burgundy as primary, off-white background, gold accent. Avoid blue-SaaS-startup vibes.
- Typography: serif for headings (Cardo, Lora, Source Serif) signals trust; sans for body (Inter, IBM Plex Sans).
- Tone: confident, precise, data-dense. No exclamation points.

---

## Retail (B2C / B2B Commerce / Store Operations)

**Inspiration:** Shopify, Toast, Lightspeed, ServiceNow Retail Operations.

### Hero persona
**Store Manager** or **Customer Service Lead** managing a location or a book of accounts.

### Hero detail page — "Customer 360" or "Account 360"
Primary entity: Contact (B2C) or Account (B2B).

Tabs:
- **Profile** — preferences, loyalty tier, lifetime value
- **Orders** — recent purchases, returns, exchanges
- **Service cases** — open + recent tickets
- **Insights** — the 2×2 AI card grid
- **Marketing** — segments, campaigns, last email opens

### Supporting surfaces
- **Store dashboard** (B2B) or **My day** (B2C agent view) — today's appointments, top tasks, AOV trend
- **Catalog browser** — quick lookup with availability
- **Consolidation page**

### Custom fields
- `Loyalty_Tier__c` (Picklist: Bronze/Silver/Gold/Platinum)
- `Lifetime_Value__c` (Currency)
- `Last_Purchase_Date__c` (Date)
- `Preferred_Store__c` (Text or Account lookup)
- `Net_Promoter_Score__c` (Number)
- `Return_Rate__c` (Percent)
- `Marketing_Consent__c` (Checkbox)
- `Top_Category__c` (Picklist)

### AI insight cards
1. **AI-drafted follow-up email** — based on a recent return or service interaction
2. **Churn risk** — high-value customer with declining order frequency
3. **Upsell signal** — bought item X, model trained on similar customers buying Y next
4. **Inventory / fulfillment signal** — favorite item back in stock at their preferred store

### Agentforce subagents
- `customer_recap` — Summarize a customer's purchase and service history
- `personalized_outreach` — Draft a "we miss you" / new-product email in brand voice
- `daily_priorities` — Surface today's at-risk customers and high-value opportunities

### Automation win
Schedule-triggered Flow: detect customers with declining purchase cadence, auto-create a follow-up task for the assigned associate. Replaces "Mailchimp + Zapier + a spreadsheet."

### Consolidation narrative
"7 tools → 1 platform": POS + ecommerce + email marketing + loyalty system + helpdesk + reviews tool + spreadsheet → Commerce Cloud + Service Cloud + Marketing Cloud.

### Brand cues
- Palette: depends entirely on customer's brand — pull from their site. Often: black/white + a single accent.
- Typography: clean sans (Inter, Söhne, GT America). Maybe one display face for category headers.
- Tone: confident, on-brand, slightly playful. Use the customer's actual marketing copy verbs.

---

## Public Sector (State / Local / Federal Citizen Services)

**Inspiration:** Tyler Technologies, Granicus, Accela, ServiceNow Public Sector.

### Hero persona
**Caseworker** (DMV agent, social services worker, benefits eligibility specialist, permitting officer).

### Hero detail page — "Constituent 360" or "Case 360"
Primary entity: Contact (constituent) or Case (application/benefit/permit).

Tabs:
- **Profile** — demographics, household members, languages
- **Cases** — open + history with status timeline
- **Documents** — uploaded forms, verifications, ID copies
- **Insights** — the 2×2 AI card grid (compliance-aware!)
- **Audit log** — every interaction, for FOIA defensibility

### Supporting surfaces
- **My queue** — caseworker's open cases sorted by SLA urgency
- **Constituent portal preview** — what the citizen sees
- **Consolidation page**

### Custom fields (on Contact)
- `Case_Type__c` (Picklist: SNAP, Medicaid, Unemployment, DMV, Permit, etc.)
- `Eligibility_Status__c` (Picklist: Pending/Approved/Denied/Under Review)
- `SLA_Due_Date__c` (Date)
- `Preferred_Language__c` (Picklist)
- `Risk_Flag__c` (Picklist: None/Fraud Review/Vulnerable Adult/Active Investigation)
- `Last_Contact_Date__c` (Date)
- `Documents_Outstanding__c` (Number)
- `Household_Size__c` (Number)

### AI insight cards
1. **AI-drafted next-step letter** — pre-filled denial/approval/info-request letter in plain language
2. **SLA risk** — case approaching deadline
3. **Eligibility signal** — based on submitted data, recommended eligibility status with confidence + cited rules
4. **Vulnerability / safety signal** — patterns that suggest a vulnerable individual needing escalation

### Agentforce subagents
- `case_summary` — Concise factual summary of a case for caseworker prep
- `letter_drafting` — Draft constituent-facing letters in plain language + at correct reading level
- `caseload_triage` — Identify top 5 cases requiring action today (SLA, missing docs, escalations)

### Automation win
Schedule-triggered Flow: daily 8am sweep of cases with SLA < 48 hours, auto-create priority tasks and notify supervisor. Replaces "we check a spreadsheet every Monday."

### Consolidation narrative
"6 tools → 1 platform": legacy mainframe / county DB + DocuSign + Outlook + intake form portal + manual letter templates + Excel SLA tracker → Public Sector Solutions.

### Brand cues
- Palette: state seal colors (often deep blue/green/burgundy) with high-contrast neutrals. Plenty of whitespace.
- Typography: government-feeling but legible — Source Sans Pro, Lato, Noto Sans. Larger body sizes (16–17px) for accessibility.
- Tone: calm, factual, plain language. Avoid jargon. Reading-level matters (target grade 8 for citizen-facing).

⚠️ **Public sector demos are heavily scrutinized for accessibility (WCAG 2.1 AA), data privacy, and audit logging.** Mention these explicitly during the demo even if not fully implemented.

---

## Healthcare (Provider, Payer, Life Sciences)

**Inspiration:** TherapyNotes, Epic, Cerner, Athena, Veeva.

This is the **CCG reference build** — see `ccg-demo/` in the repo for a working example.

### Hero persona
**Provider** (physician, therapist, nurse practitioner, care coordinator).

### Hero detail page — "Patient 360"
Primary entity: Contact (patient) — or Person Account if PA-enabled and the customer requests it.

Tabs:
- **Overview** — vitals, last visit, current medications, allergies, care team
- **Sessions / Visits** — visit history with notes
- **Insights** — the 2×2 AI card grid
- **Communications** — messages, portal activity
- **Billing** — outstanding balance, recent statements, insurance status

### Supporting surfaces
- **Provider home** — today's schedule + caseload alerts
- **Patient portal preview** — what the patient sees
- **Intake / new-referral preview** — coordinator's view
- **Consolidation page**

### Custom fields (on Contact)
- `Patient_Status__c` (Picklist: Active/Inactive/Discharged)
- `Primary_Diagnosis__c` (Text)
- `Risk_Level__c` (Picklist: Low/Medium/High)
- `Latest_<Assessment>_Score__c` (Number) — e.g., `Latest_PHQ9_Score__c`
- `Next_Appointment__c` (DateTime)
- `Last_Portal_Login__c` (DateTime)
- `Outstanding_Balance__c` (Currency)
- `Primary_Clinician__c` (Text or User lookup)
- `Payment_Type__c` (Picklist: Insurance/Cash/Sliding Scale)

### AI insight cards
1. **AI-drafted session note** — SOAP-formatted draft based on the visit, hover to preview, with Sign/Edit/Discard actions
2. **Churn / disengagement risk** — patient with declining engagement (missed sessions, fewer portal logins)
3. **Clinical signal** — worsening assessment score trend, medication adherence concern, escalation flag
4. **Engagement signal** — positive: patient hit milestone, completed homework, responded warmly to last message

### Agentforce subagents
- `patient_summary` — Recap a patient's recent clinical and engagement history
- `patient_outreach` — Draft a warm, clinician-voice message
- `caseload_risk` — Identify top 3 patients at risk of disengagement this week

### Automation win
Schedule-triggered Flow: every morning, query patients with appointments today, send providers a digest with patient names + last visit summary + any open clinical alerts. Replaces "broken Zapier + Mailchimp + reminders no one reads."

### Consolidation narrative
"5 tools → 1 platform": EHR (TherapyNotes/Epic) + CRM (TherapyFlow/HubSpot) + Zapier + Mailchimp + ad platform → Health Cloud + Marketing Cloud.

### Brand cues
- Palette: muted teal/sage/cream/soft blue. Avoid medical-red except for alerts. Soft, warm, calm.
- Typography: humanist sans (Inter, Source Sans, Open Sans). Slightly larger body sizes than typical SaaS.
- Tone: warm, clinical, human. Never marketing-y. Patient privacy phrases everywhere ("draft only," "review before sending").

---

## Manufacturing / Field Service (Industrial, Utilities, HVAC, Telecom)

**Inspiration:** ServiceMax, Salesforce Field Service, IFS, ServiceTitan.

### Hero persona
**Dispatcher** (back office) or **Field Technician** (mobile-first view).

### Hero detail page — "Asset 360" or "Work Order 360"
Primary entity: Asset (equipment), Account (customer site), or WorkOrder (active job).

Tabs:
- **Asset profile** — model, install date, warranty, service plan
- **Service history** — past work orders with technician + outcome
- **Open work** — scheduled visits, parts on order
- **Insights** — the 2×2 AI card grid
- **Documentation** — manuals, schematics, photos from last visits

### Supporting surfaces
- **Dispatch board** — map view + technician schedule (kanban OK if map is hard)
- **Mobile technician view** — today's jobs, sealed-quoting form, photo upload
- **Consolidation page**

### Custom fields (on Asset or Account)
- `Asset_Health_Score__c` (Number 0–100)
- `Last_Service_Date__c` (Date)
- `Next_Scheduled_Service__c` (Date)
- `Warranty_Status__c` (Picklist: Active/Expired/Extended)
- `Site_Criticality__c` (Picklist: Standard/Critical/Mission-Critical)
- `Technician_Last_Visit__c` (Text or User lookup)
- `Open_Issues_Count__c` (Number)
- `SLA_Tier__c` (Picklist: Gold/Silver/Bronze)

### AI insight cards
1. **AI-drafted work order summary** — pre-filled job notes based on asset history + customer complaint
2. **Predictive failure signal** — asset showing sensor / utilization patterns matching past failures
3. **Optimization signal** — technician route improvement, parts pre-stocking opportunity
4. **Customer relationship signal** — repeat issues at this site, escalation warning

### Agentforce subagents
- `job_prep` — Brief a technician on what to expect at the next visit (asset, history, gotchas)
- `customer_update` — Draft a clear update message to the site contact (delays, completion, next steps)
- `daily_dispatch` — Identify schedule risks, suggest re-routes, flag asset issues needing escalation

### Automation win
Schedule-triggered Flow: every 6am, scan assets due for preventive maintenance in next 14 days, auto-create work orders + draft dispatcher's day. Replaces "spreadsheet + Outlook calendar + radio."

### Consolidation narrative
"6 tools → 1 platform": ERP for parts + dispatch system + technician app + customer email + Excel maintenance schedule + paper checklists → Field Service + Manufacturing Cloud.

### Brand cues
- Palette: high-contrast, industrial — safety orange/yellow accents on dark slate or navy. Mobile-friendly contrast ratios.
- Typography: condensed for dense lists (Inter, Roboto Condensed, Barlow). Larger touch targets for mobile.
- Tone: efficient, direct, operational. Time-stamped, action-oriented.

---

## Professional Services (Consulting, Legal, Agencies)

**Inspiration:** Clio, Mavenlink, ClickUp Consulting, Workday PSA.

### Hero persona
**Engagement Lead / Partner / Account Director** managing a portfolio of clients.

### Hero detail page — "Engagement 360" or "Client 360"
Primary entity: Account (client), Opportunity (engagement), or Project (custom).

Tabs:
- **Engagement profile** — scope, team, key dates, fee structure
- **Time & billing** — hours by team member, unbilled WIP, realization rate
- **Deliverables** — milestones, documents, status
- **Insights** — the 2×2 AI card grid
- **Communications** — meeting notes, decisions, action items

### Supporting surfaces
- **Pipeline view** — opportunities by stage with weighted forecast
- **Resourcing view** — team utilization heatmap
- **Consolidation page**

### Custom fields (on Account or Opportunity)
- `Engagement_Health__c` (Picklist: Green/Yellow/Red)
- `Realization_Rate__c` (Percent)
- `Hours_Budgeted__c` (Number)
- `Hours_Logged__c` (Number)
- `Key_Stakeholder__c` (Text or Contact lookup)
- `Last_Stakeholder_Touch__c` (Date)
- `Renewal_Date__c` (Date)
- `NPS_Score__c` (Number)

### AI insight cards
1. **AI-drafted status update** — weekly status email pre-filled with progress, risks, asks
2. **Scope-creep risk** — hours trending past budget, recent change requests detected
3. **Stakeholder engagement signal** — key contact gone quiet, meeting cadence dropping
4. **Renewal / expansion signal** — positive utilization + NPS + life events at the client (e.g., new VP)

### Agentforce subagents
- `engagement_brief` — Summarize where an engagement stands for a stakeholder check-in
- `client_email` — Draft a professional status update or check-in message
- `portfolio_review` — Identify top 3 engagements requiring attention (red status, scope risk, renewals)

### Automation win
Schedule-triggered Flow: every Friday afternoon, generate weekly status digests for every active engagement, route to engagement lead for review. Replaces "everyone updates a shared Google Doc."

### Consolidation narrative
"6 tools → 1 platform": CRM + time tracking (Harvest) + project tool (Asana) + billing system + Slack channels + Google Docs → Sales Cloud + PSA.

### Brand cues
- Palette: depends on firm — usually conservative (navy/charcoal/burgundy/forest) with one accent. Lots of whitespace.
- Typography: refined — serif possible (Tiempos, Söhne, GT Sectra) for senior-feeling brands; modern sans (Inter, Söhne) for younger firms.
- Tone: thoughtful, executive, slightly understated. Avoid "rockstar" / "growth-hack" energy.

---

## Generic / Unknown Vertical (fallback)

If the customer's industry doesn't fit cleanly above, default to:

- **Hero persona:** "Account Owner" or "Specialist"
- **Hero detail page:** "Customer 360" on Contact
- **Tabs:** Overview / Activity / Insights / Communications
- **Custom fields:** `Customer_Tier__c`, `Health_Score__c`, `Last_Touch__c`, `Next_Action_Date__c`, `Primary_Owner__c`
- **AI insight cards:** AI-drafted message / churn risk / opportunity signal / engagement signal
- **Subagents:** customer_recap / outreach_draft / book_review
- **Brand:** ask the AE what feeling they want — confidence (navy/serif), efficiency (slate/sans), warmth (sage/humanist sans), or boldness (bright accent on white)

Always ask the AE: *"What tool does the customer use today that they wish Salesforce looked like?"* Then reverse-engineer that tool's UX into your hero page.
