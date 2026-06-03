# Contact Lightning Record Page (FlexiPage) — Phase 5.5

When the AE clicks the Salesforce link in your React demo, the Contact record opens in Lightning. By default it looks like a standard Salesforce page, which slightly undercuts the "no Salesforce chrome" illusion. A custom record page that shows the demo's fields cleanly fixes this.

## ⚠️ Default approach: build it by hand in Lightning App Builder (do NOT deploy XML)

**Stress-test finding (mid-2026):** the metadata/XML approach to a custom FlexiPage is **API-version-fragile and frequently undeployable** in fresh scratch orgs. A real run burned ~8 failed deploy attempts (the biggest quota sink of the whole build) and never got it to deploy, because:

- Standard FlexiPage components (`flexipage:highlightsPanel`, `flexipage:recordDetailPanel2`/`recordDetailComponent2`, `relatedListContainer`, `runtime_sales_activities:activitiesComponent`) fail with **"We couldn't retrieve the design time component information for component …"** — i.e., the components don't resolve in the scratch org's API version. This was re-confirmed in a second run: *every* standard component failed design-time resolution even with structurally-valid XML.
- The XML structure is finicky: each `componentInstance` needs its **own** `<itemInstances>` wrapper (multiple under one block → "componentInstance is duplicated"), a `<template>` element is **required**, and the chosen template (`flexipage:recordHomeTemplateDesktop`) expects specific regions.

**So: don't ship/deploy the XML. Build the record page in the UI — it takes ~3 minutes and always works:**

1. In the scratch org: **Setup → Object Manager → Contact → Lightning Record Pages → New** (or edit the org default).
2. Pick a template (e.g., **Header and Right Sidebar**).
3. Drag on a **Record Detail** component (and optionally **Highlights Panel**, **Related Lists**, **Activities**).
4. Add **Field Section(s)** and drop in the vertical-specific custom fields you surfaced in React (see the table below).
5. **Save → Activation → set as Org Default (Desktop).**
6. Verify by opening a seeded Contact — confirm your custom fields show. If a field is missing, the running user lacks FLS → check the Phase 5 permission set.

This is the reliable path. Tell the user it's a quick manual step and walk them through it (it's a good "look, it's just Salesforce" beat anyway).

## Fields to surface per vertical

| Vertical | Fields to include |
|---|---|
| **Healthcare** | `Patient_Status__c`, `Risk_Level__c`, `Latest_PHQ9_Score__c`, `Next_Appointment__c`, `Primary_Diagnosis__c`, `Outstanding_Balance__c` |
| **FSI** | `Risk_Tolerance__c`, `Assets_Under_Management__c`, `Relationship_Tier__c`, `Next_Review_Due__c`, `KYC_Status__c`, `Life_Event_Flag__c` |
| **Retail** | `Loyalty_Tier__c`, `Lifetime_Value__c`, `Last_Purchase_Date__c`, `Net_Promoter_Score__c`, `Top_Category__c`, `Return_Rate__c` |
| **Public sector** | `Case_Type__c`, `Eligibility_Status__c`, `SLA_Due_Date__c`, `Risk_Flag__c`, `Documents_Outstanding__c`, `Last_Contact_Date__c` |
| **Field service** | (Use on Asset or Account instead — same idea, different SObject) |
| **Prof services** | (Use on Account — same idea) |

## Optional: structurally-verified minimal XML (only if you insist on metadata)

If you specifically need the page in source control and accept the risk, this is the **structurally-correct** minimal shape (verified to parse and pass structure validation — separate `<itemInstances>` per component, required `<template>`). **It still may fail in your org** if the standard components don't resolve their design-time info (see above) — if you get "design time component information" errors, abandon the XML and use the manual UI path.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<FlexiPage xmlns="http://soap.sforce.com/2006/04/metadata">
    <flexiPageRegions>
        <name>main</name>
        <type>Region</type>
        <itemInstances>
            <componentInstance>
                <componentName>flexipage:recordDetailComponent2</componentName>
                <identifier>recordDetailComponent</identifier>
            </componentInstance>
        </itemInstances>
    </flexiPageRegions>
    <masterLabel>&lt;Brand&gt; Contact Record Page</masterLabel>
    <sobjectType>Contact</sobjectType>
    <template>
        <name>flexipage:recordHomeTemplateDesktop</name>
    </template>
    <type>RecordPage</type>
</FlexiPage>
```

Deploy with `sf project deploy start --metadata FlexiPage:<Name> -o <alias>`, then **manually activate** (Setup → Object Manager → Contact → Lightning Record Pages → Activation → Org Default; activation isn't reliably deployable). Again: if it errors on component resolution, switch to the manual UI build — don't sink time into it.

## Why this matters in the demo

The AE/CEO clicks the Salesforce link badge in your React app to "prove it's real." With a clean record page active, what opens shows exactly the fields the React app surfaces — no random standard fields, no "Salesforce 1.0" vibe. Reinforces the "platform underneath" message. A hand-built page achieves this just as well as a deployed one — and actually works.
