# Demo data pattern

How to structure `src/data/demoData.ts` so React records map cleanly to real Salesforce records.

## `demoData.ts` structure

```ts
// Single source of truth for the org's instance URL.
export const SALESFORCE_INSTANCE_URL = 'https://<my-domain>.my.salesforce.com';
export const CUSTOMER_ACCOUNT_ID = '001...';

export type Entity = {
  id: string;                          // React-only id
  name: string;
  // ... domain fields the UI reads ...
  status: string;
  riskLevel: 'Low' | 'Medium' | 'High';

  // The bridge to the real CRM record.
  salesforceContactId?: string;        // 18-char Contact ID
};

export const entities: Entity[] = [
  {
    id: 'sarah-mitchell',
    name: 'Sarah Mitchell',
    status: 'Active',
    riskLevel: 'Medium',
    salesforceContactId: '003Bi0000...',
  },
  // ...
];
```

## Display the CRM link

In your detail page header:

```tsx
import { Database, ExternalLink } from 'lucide-react';

{entity.salesforceContactId && (
  <a
    href={`${SALESFORCE_INSTANCE_URL}/lightning/r/Contact/${entity.salesforceContactId}/view`}
    target="_blank"
    rel="noreferrer"
    className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[var(--brand-primary)]"
  >
    <Database size={12} />
    <span className="font-mono">{entity.salesforceContactId.slice(0, 8)}…</span>
    <ExternalLink size={11} />
  </a>
)}
```

## Custom field metadata (one file per field)

`force-app/main/default/objects/Contact/fields/<FieldName>__c.field-meta.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName><FieldName>__c</fullName>
    <externalId>false</externalId>
    <label><Field Label></label>
    <required>false</required>
    <trackTrending>false</trackTrending>
    <type>Picklist</type>
    <valueSet>
        <restricted>true</restricted>
        <valueSetDefinition>
            <sorted>false</sorted>
            <value>
                <fullName>Active</fullName>
                <default>true</default>
                <label>Active</label>
            </value>
            <value>
                <fullName>Inactive</fullName>
                <default>false</default>
                <label>Inactive</label>
            </value>
        </valueSetDefinition>
    </valueSet>
</CustomField>
```

Repeat for each field. Common types you'll need: `Picklist`, `Text`, `Number`, `Currency`, `DateTime`, `Checkbox`.

## Permission set granting FLS

`force-app/main/default/permissionsets/<Brand>_Demo_Admin.permissionset-meta.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<PermissionSet xmlns="http://soap.sforce.com/2006/04/metadata">
    <label><Brand> Demo Admin</label>
    <fieldPermissions>
        <editable>true</editable>
        <field>Contact.<Field1>__c</field>
        <readable>true</readable>
    </fieldPermissions>
    <!-- repeat for each custom field -->
    <hasActivationRequired>false</hasActivationRequired>
</PermissionSet>
```

Deploy + assign:

```bash
sf project deploy start --source-dir force-app -o <alias>
sf org assign permset --name <Brand>_Demo_Admin -o <alias>
```

## Bulk-import the contacts

`data/contacts.json`:

```json
{
  "records": [
    {
      "attributes": { "type": "Account", "referenceId": "CustomerAccountRef" },
      "Name": "<Customer Company Name>"
    },
    {
      "attributes": { "type": "Contact", "referenceId": "SarahMitchellRef" },
      "FirstName": "Sarah",
      "LastName": "Mitchell",
      "AccountId": "@CustomerAccountRef",
      "Patient_Status__c": "Active",
      "Risk_Level__c": "Medium",
      "Latest_PHQ9_Score__c": 9
    }
  ]
}
```

Import:

```bash
sf data import tree --files data/contacts.json -o <alias>
```

After import, the CLI prints the new record IDs. Copy each Contact ID into the matching entity in `demoData.ts` as the `salesforceContactId` field.

## Verification

The "real CRM proof" only works when:

1. Custom fields exist on Contact in the org.
2. The deployed user has the permission set assigned.
3. The Contact IDs in `demoData.ts` match real records in the org.
4. Field values in `demoData.ts` match field values on the records (otherwise the demo audience will notice).

Click through every demo link before going live — broken Salesforce links destroy the "it's real" moment.
