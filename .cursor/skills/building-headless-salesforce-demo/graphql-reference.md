# GraphQL reference for UI Bundles

When the demo moves past static data and starts using live Salesforce data, the UI Bundle template uses the **Salesforce GraphQL API**. This guide covers the shapes, the codegen flow, and the most common mistakes.

Reference: [Salesforce GraphQL API docs](https://developer.salesforce.com/docs/platform/graphql/overview)

⚠️ **Default for demos:** stay on static data in `src/data/demoData.ts`. Only go GraphQL if the AE specifically wants to show live records refreshing during the demo, or the scope explicitly calls for it. GraphQL adds 1–2 hours of debugging that rarely improves the demo's wow factor.

## When to use static data vs GraphQL

| Use case | Recommendation |
|---|---|
| Demo only — one click-through, customer doesn't need to add/edit records during demo | **Static** (`demoData.ts`) |
| AE wants to edit a Salesforce record and have the React app reflect the change live | **GraphQL** for that one screen only |
| Customer asked to see a real query running | **GraphQL** for that one screen only |
| Anything else | **Static** |

## Schema fetch + codegen flow

Once the org is deployed with custom objects/fields, fetch the schema and generate TypeScript types:

```bash
cd force-app/main/default/uiBundles/<AppName>

# 1. Fetch the org's GraphQL schema
npm run schema -- --target-org <alias>

# 2. Generate typed React hooks for your .graphql files
npm run codegen
```

This produces typed query results in `src/api/generated/`. **Never write GraphQL responses as `any`** — always use the generated types.

## Salesforce GraphQL query shape (the part that trips everyone up)

Salesforce's GraphQL API does NOT look like a typical GraphQL API. It wraps everything in `uiapi` and uses a `Connection` → `edges` → `node` pattern.

### ❌ What it's NOT

```graphql
# This DOES NOT work
query Contacts {
  contacts {
    id
    firstName
    lastName
  }
}
```

### ✅ What it IS

```graphql
query Contacts {
  uiapi {
    query {
      Contact(first: 10, orderBy: { LastName: { order: ASC } }) {
        edges {
          node {
            Id
            FirstName { value }
            LastName { value }
            Email { value }
            Patient_Status__c { value }
          }
        }
      }
    }
  }
}
```

Notes:
- **Top-level `uiapi.query`** wrapper — always required
- **SObject name PascalCase** (`Contact`, not `contacts`)
- **Field names match Salesforce API names exactly** — `FirstName` not `firstName`, `Patient_Status__c` not `patientStatus`
- **Every field is wrapped in `{ value }`** — scalar values are objects with a `value` property (so the API can also return `displayValue`, `format`, etc.)
- **List queries return `Connection` → `edges[] → node`** — never a flat array
- **Filtering and ordering use camelCase arguments** (`orderBy`, `first`, `where`)

### Filtering

```graphql
query AtRiskMembers {
  uiapi {
    query {
      Contact(where: { Risk_Level__c: { eq: "High" } }, first: 5) {
        edges {
          node {
            Id
            Name { value }
            Risk_Level__c { value }
          }
        }
      }
    }
  }
}
```

Supported operators: `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `like`, `in`, `nin`, `and`, `or`.

### Mutations (create/update/delete — GA in API v66+)

GraphQL mutations are the recommended way to do write-back from the UI Bundle (no Apex needed). The most common demo use is a **write-back action button** — see [salesforce-action-button.md](salesforce-action-button.md) for the full drop-in pattern (create a Task, Case, or field update with a success link back into Salesforce). Quick shapes:

```graphql
# Create — note PascalCase `<Object>Create` and `Record { ... }` return
mutation CreateTask($input: TaskCreateInput!) {
  uiapi {
    TaskCreate(input: $input) {
      Record { Id Subject { value } }
    }
  }
}

# Update — requires Id; returns Record in v66+ (returned `success` boolean in v59–65)
mutation UpdateContact($id: ID!, $input: ContactUpdateInput!) {
  uiapi {
    ContactUpdate(input: { Id: $id, Contact: $input }) {
      Record { Id FirstName { value } }
    }
  }
}
```

Mutation guidelines: use constituent fields for compound data (`FirstName`/`LastName`, not `Name`), raw values for numbers/currency (no symbols), `YYYY-MM-DD` for dates, and only `create` can return `Record` fields in v59–65. Only UI-API-supported SObjects can be mutated.

## React/Apollo usage pattern

The UI Bundle template ships with Apollo Client preconfigured. Standard hook usage:

```tsx
import { gql, useQuery } from '@apollo/client';
import type { ContactsQuery } from '@/api/generated';

const CONTACTS_QUERY = gql`
  query Contacts {
    uiapi {
      query {
        Contact(first: 10) {
          edges {
            node {
              Id
              Name { value }
              Risk_Level__c { value }
            }
          }
        }
      }
    }
  }
`;

export function ContactList() {
  const { data, loading, error } = useQuery<ContactsQuery>(CONTACTS_QUERY);

  if (loading) return <div>Loading…</div>;
  if (error) return <div>Error: {error.message}</div>;

  const contacts = data?.uiapi.query.Contact?.edges ?? [];

  return (
    <ul>
      {contacts.map(({ node }) => (
        <li key={node.Id}>
          {node.Name?.value} — {node.Risk_Level__c?.value ?? '—'}
        </li>
      ))}
    </ul>
  );
}
```

## Common errors + fixes

| Error | Cause | Fix |
|---|---|---|
| `Cannot query field "contacts" on type "UiApi"` | Used lowercase / pluralized name | Use PascalCase SObject name: `Contact`, not `contacts` |
| `Cannot query field "value" on scalar` | Forgot the `{ value }` wrapper | Every field needs `{ value }` — `FirstName { value }` |
| Query returns `null` for `Connection` | Missing `first` / `last` arg | Salesforce requires pagination args on list queries: `Contact(first: 10)` |
| Type errors after schema change | Codegen out of date | Re-run `npm run schema` then `npm run codegen` |
| `Insufficient access rights on cross-reference id` | FLS / permset gap | Make sure the running user has the demo permset assigned with FLS to your custom fields |
| Query works in GraphiQL but not in the app | CORS / Trusted Sites | Verify the UI Bundle's `cspTrustedSites` includes your org's instance URL |
| Field returns `null` when you know data exists | FLS hidden | Same as above — check the permset |

## Hybrid pattern (recommended for demos that need *some* live data)

Keep static data for most of the app and add ONE live query on the hero detail page:

```tsx
// Hero detail page — fetch the real record from Salesforce when navigated to
// Fall back to static data if the query fails (demo safety)

const { data, loading } = useQuery(GET_CONTACT, {
  variables: { id: salesforceContactId },
  errorPolicy: 'all',
});

const liveContact = data?.uiapi.query.Contact?.edges[0]?.node;
const staticContact = patients.find(p => p.salesforceContactId === salesforceContactId);

const displayContact = liveContact ?? staticContact;
```

This way the demo shows live data when it works and gracefully falls back when something flakes. Recommended for any "show me the live record" moment.

## Don'ts

- ❌ Don't query without `first` / `last` — Salesforce will reject it.
- ❌ Don't expect lowercase fields or top-level entry points like `contacts {}`.
- ❌ Don't trust GraphQL Playground URLs from blog posts — Salesforce's schema is org-specific and changes with deploy.
- ❌ Don't write more than one or two live queries in a demo build. Each one is a debugging risk on demo day.
- ❌ Don't forget to re-run codegen after deploying new fields. Stale types == confusing errors.
