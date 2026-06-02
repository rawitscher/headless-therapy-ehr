# Salesforce action button (write-back from the React UI)

The single most powerful "wow" moment after read-only data: a button in the custom React UI that **writes to Salesforce** and shows the result. It proves the headless app isn't a read-only veneer — it leverages real Salesforce automation through a UI the customer designed.

The canonical version is **"Create a Task on this record"** (e.g., a follow-up task on the Contact). It's universal, every vertical has follow-ups, and it lands in a standard SObject (`Task`) that needs no custom-field setup. Variations below.

> **Demo framing:** *"This button lives in our custom UI — but when I click it, it's creating a real Salesforce Task with all the automation, reporting, and assignment rules behind it. Custom front end, full Salesforce platform underneath."*

## Why GraphQL mutations (not Apex, not REST)

The UI Bundle template already ships Apollo Client wired to the Salesforce GraphQL API. As of API v66 (GA), the GraphQL UI API supports **create/update/delete mutations** for any UI-API-supported SObject — no Apex, no custom REST endpoint, no extra auth. `Task` is UI-API-supported, so this works out of the box once the running user has create access.

## Prerequisites

1. **Permission:** the deployed/running user needs **Create** on `Task` (and Edit on the parent object). Standard admin scratch-org users have this; if you built a restricted permset, add `Task` object Create + the `WhoId`/`Subject`/`Status` fields.
2. **Apollo is already configured** by the template — reuse the existing client, don't spin up a new one.
3. You need the **parent record's Salesforce Id** on hand. You already store this as `salesforceContactId` / `salesforceAccountId` / etc. in `demoData.ts` (see [demo-data-pattern.md](demo-data-pattern.md)).

## The mutation

```graphql
mutation CreateFollowUpTask($input: TaskCreateInput!) {
  uiapi {
    TaskCreate(input: $input) {
      Record {
        Id
        Subject { value }
        Status { value }
        ActivityDate { value }
      }
    }
  }
}
```

`input` shape passed from React:

```ts
{
  Task: {
    Subject: "Follow up — flagged from <App> UI",
    Status: "Not Started",
    Priority: "Normal",
    WhoId: salesforceContactId,        // links the Task to the Contact (Name relationship)
    // WhatId: salesforceAccountId,    // use WhatId instead for Account/Case/Opportunity/custom-object parents
    ActivityDate: new Date(Date.now() + 2 * 864e5).toISOString().slice(0, 10), // YYYY-MM-DD, +2 days
  }
}
```

Notes:
- **`WhoId`** links to a Contact/Lead (person). **`WhatId`** links to Account/Opportunity/Case/custom objects. Pick the one matching your hero record — only one is needed.
- **`ActivityDate` must be `YYYY-MM-DD`** (date only). The `.slice(0,10)` handles that.
- **No currency symbols / formatted numbers** in any field — raw values only (per Salesforce mutation guidelines).
- Don't request fields back on update/delete — only `create` allows returning `Record { ... }`.

## React component (drop-in)

Create `src/components/CreateTaskButton.tsx`:

```tsx
import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Button } from '@/components/ui/button';

const CREATE_TASK = gql`
  mutation CreateFollowUpTask($input: TaskCreateInput!) {
    uiapi {
      TaskCreate(input: $input) {
        Record {
          Id
          Subject { value }
          Status { value }
        }
      }
    }
  }
`;

type Props = {
  /** Salesforce Id of the parent record (Contact/Lead → WhoId, else WhatId). */
  recordId: string;
  /** Set true when the parent is an Account/Case/Opportunity/custom object. */
  useWhatId?: boolean;
  subject?: string;
  /** Salesforce instance URL, e.g. https://my-org.scratch.my.salesforce.com */
  instanceUrl: string;
};

export function CreateTaskButton({
  recordId,
  useWhatId = false,
  subject = 'Follow up — flagged from app',
  instanceUrl,
}: Props) {
  const [createTask, { loading }] = useMutation(CREATE_TASK);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setError(null);
    const activityDate = new Date(Date.now() + 2 * 864e5).toISOString().slice(0, 10);
    try {
      const { data } = await createTask({
        variables: {
          input: {
            Task: {
              Subject: subject,
              Status: 'Not Started',
              Priority: 'Normal',
              ActivityDate: activityDate,
              ...(useWhatId ? { WhatId: recordId } : { WhoId: recordId }),
            },
          },
        },
      });
      const id = data?.uiapi?.TaskCreate?.Record?.Id ?? null;
      setCreatedId(id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create task');
    }
  }

  if (createdId) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium text-green-700">✓ Task created in Salesforce</span>
        <a
          className="underline"
          href={`${instanceUrl}/lightning/r/Task/${createdId}/view`}
          target="_blank"
          rel="noreferrer"
        >
          Open it →
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <Button onClick={handleClick} disabled={loading}>
        {loading ? 'Creating…' : 'Create follow-up task'}
      </Button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
```

Usage on the hero detail page:

```tsx
<CreateTaskButton
  recordId={record.salesforceContactId}
  instanceUrl={import.meta.env.VITE_SF_INSTANCE_URL /* or your existing instance-url helper */}
/>
```

## The payoff: show the result in Salesforce

After clicking, the success state renders an **"Open it →"** link straight to the new Task in Lightning. During the demo:

1. Click the button in the custom UI → *"Task created in Salesforce."*
2. Click **Open it →** → the real Task opens in Salesforce, linked to the Contact.
3. (Optional) Show the Contact's **Activity timeline** — the task is already there.

This is the line that lands: *"Custom UI, real Salesforce platform — the automation, reporting, and assignment all just work."*

## Make the automation story louder: a Flow that fires on the new Task ⭐

The button alone proves write-back. To prove **platform automation**, add a record-triggered Flow that fires *the instant* the React button creates the Task — so one click in the custom UI visibly cascades into Salesforce automation. This is the strongest version of the "custom UI, full platform underneath" moment.

> **Demo framing:** *"Watch — I click this one button in our custom app… and Salesforce automatically flags it as high priority. That logic doesn't live in the React app. It's platform automation — the same engine running for thousands of customers."*

### The Flow (record-triggered on Task create)

A **before-save record-triggered flow** on `Task`, "A record is created", that sets `Task.Priority = High` and appends a tag to `Subject` (e.g., `[Auto-triaged]`). Before-save is ideal here: it's synchronous, requires no DML, and the change is on the committed record immediately — so when the user clicks through right after pressing the button, the Priority is already High.

Entry condition: keep it tight so it only fires on the demo's buttons, not every Task. Filter on the `Subject` text the button writes (e.g., `Subject` contains `flagged from`), so unrelated Tasks don't trigger it.

Deploy it as metadata so it's reproducible:

```bash
sf project deploy start --source-dir force-app/main/default/flows/<FlowName>.flow-meta.xml -o <alias>
# Record-triggered flows deploy Active — verify in Setup → Flows
```

⚠️ Use the **`generating-flow`** skill to author the actual `.flow-meta.xml` — it owns the correct Flow XML shape (record-triggered before-save, entry conditions, assignment elements). Don't hand-write Flow XML.

### The demo beat (sequence it right after the button)

1. Click the action button → *"Task created in Salesforce."*
2. Click **Open it →** → the Task opens, already showing **Priority: High** and the `[Auto-triaged]` subject tag.
3. Land the line: *"One click in our UI, and the platform automation did the rest."*

### Gotchas (Flow-specific)

| Symptom | Cause | Fix |
|---|---|---|
| Flow didn't fire on the React-created Task | Entry condition too narrow, or flow inactive | Confirm the `Subject` filter matches what the button writes; verify the flow is **Active** in Setup → Flows |
| Flow fires on every Task in the org | No entry condition | Add a `Subject contains "<button text>"` entry condition |
| Priority/Subject change not visible on click-through | Used an after-save flow + the UI cached the old record | Use a **before-save** update so the stamp is on the committed record immediately |

### Static fallback (if live Flow is risky)

If the demo is high-stakes or time is short, **skip the live Flow** and instead screenshot Flow Builder showing the canvas (per Phase 7's default). The button still creates a real Task; you narrate *"and a Flow like this one auto-triages it"* over the screenshot. Lower wow, zero demo-day risk.

## Variations (pick what fits the vertical)

| Vertical | Action button | SObject / field write |
|---|---|---|
| Healthcare | "Schedule follow-up visit" | `Task` (WhoId = patient Contact) |
| FSI | "Flag for advisor review" | `Task` or update `Contact.Review_Status__c` |
| Public sector | "Open a case" | `Case` create (WhatId/ContactId = constituent) |
| Retail | "Create service request" | `Case` create |
| Field service | "Create work order" | `WorkOrder` create (if UI-API supported in the org) |
| Prof services | "Log client touchpoint" | `Task` create |

For a field **update** instead of a create (e.g., "Mark as reviewed"), swap to the `<Object>Update` mutation — it requires the `Id` and the field(s), and does NOT return `Record` in v59–65 (returns it in v66+):

```graphql
mutation MarkReviewed($id: ID!) {
  uiapi {
    ContactUpdate(input: { Id: $id, Contact: { Review_Status__c: "Reviewed" } }) {
      Record { Id Review_Status__c { value } }
    }
  }
}
```

## Gotchas

| Symptom | Cause | Fix |
|---|---|---|
| `Insufficient access rights on cross-reference id` | Running user lacks Create on `Task` or access to the parent | Grant `Task` Create in the demo permset; confirm parent record is visible to the user |
| `ValidationError` on `ActivityDate` | Sent an ISO timestamp instead of date | Use `YYYY-MM-DD` only (`.slice(0, 10)`) |
| `Cannot query field "TaskCreate" on type "UIAPIMutations"` | Org on API < v66 (mutations were beta), or codegen stale | Confirm org API v66+; re-run `npm run schema && npm run codegen` |
| Button works locally but not in deployed org | CORS / Trusted Sites | Same as queries — verify `cspTrustedSites` includes the org instance URL |
| Task created but not visible on Contact timeline | Used `WhatId` for a Contact instead of `WhoId` | Contacts/Leads use `WhoId`; everything else uses `WhatId` |

## Don'ts

- ❌ Don't build this with Apex or a custom REST endpoint — the GraphQL mutation is zero-backend and already wired.
- ❌ Don't write to a custom field that doesn't exist yet — deploy the field + permset first (Phase 5).
- ❌ Don't skip the success-state link to the Salesforce record — clicking through to the real Task is the entire point of the demo moment.
- ❌ Don't over-build — ONE action button on the hero record is plenty. More buttons dilute the moment and add demo-day risk.
