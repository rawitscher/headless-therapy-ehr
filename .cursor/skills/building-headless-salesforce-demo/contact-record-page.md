# Contact Lightning Record Page (FlexiPage)

When the AE clicks the Salesforce link in your React demo, the Contact record opens in Lightning. By default that record looks like a standard Salesforce page — which somewhat breaks the "no Salesforce chrome" illusion. A custom Lightning Record Page (FlexiPage) with the demo's custom fields organized into themed sections fixes this.

This file gives you a reusable FlexiPage template you can drop into any vertical build.

## Why Lightning Record Page (FlexiPage), not classic Page Layout

- **FlexiPages** are the modern record page format. Deployable, customizable with regions/tabs/components, and what real customers use today.
- **Classic Page Layouts** still exist but are field-level only and feel dated.
- The skill uses **FlexiPage**.

## When to deploy

After Phase 5 (CRM data seeded), before Phase 7 (close). The AE will click into the Salesforce Contact during the demo — make it look intentional.

## Step 1: Create the FlexiPage metadata

Path: `force-app/main/default/flexipages/<Brand>_Contact_Record_Page.flexipage-meta.xml`

Use this template, replacing `<Brand>` with the customer's brand name and the highlighted fields with the vertical-specific fields from [industry-playbooks.md](industry-playbooks.md):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<FlexiPage xmlns="http://soap.sforce.com/2006/04/metadata">
    <flexiPageRegions>
        <name>main</name>
        <type>Region</type>
        <itemInstances>
            <componentInstance>
                <componentInstanceProperties>
                    <name>collapsed</name>
                    <value>false</value>
                </componentInstanceProperties>
                <componentInstanceProperties>
                    <name>label</name>
                    <value>Highlights</value>
                </componentInstanceProperties>
                <componentName>flexipage:highlightsPanel</componentName>
                <identifier>highlightsPanel</identifier>
            </componentInstance>
            <componentInstance>
                <componentInstanceProperties>
                    <name>activeTabValue</name>
                    <value>tab-overview</value>
                </componentInstanceProperties>
                <componentName>flexipage:tabset</componentName>
                <flexiPageRegions>
                    <name>tab-overview</name>
                    <type>Region</type>
                    <itemInstances>
                        <componentInstance>
                            <componentInstanceProperties>
                                <name>columns</name>
                                <value>2</value>
                            </componentInstanceProperties>
                            <componentInstanceProperties>
                                <name>label</name>
                                <value>Profile</value>
                            </componentInstanceProperties>
                            <componentInstanceProperties>
                                <name>uiBehavior</name>
                                <value>edit</value>
                            </componentInstanceProperties>
                            <componentName>flexipage:recordFieldSection</componentName>
                            <fieldInstances>
                                <!-- Standard contact fields -->
                                <fieldItem>
                                    <fieldInstanceProperties>
                                        <name>uiBehavior</name>
                                        <value>edit</value>
                                    </fieldInstanceProperties>
                                    <fieldName>Name</fieldName>
                                </fieldItem>
                                <fieldItem>
                                    <fieldInstanceProperties>
                                        <name>uiBehavior</name>
                                        <value>edit</value>
                                    </fieldInstanceProperties>
                                    <fieldName>Email</fieldName>
                                </fieldItem>
                                <fieldItem>
                                    <fieldInstanceProperties>
                                        <name>uiBehavior</name>
                                        <value>edit</value>
                                    </fieldInstanceProperties>
                                    <fieldName>Phone</fieldName>
                                </fieldItem>
                                <fieldItem>
                                    <fieldInstanceProperties>
                                        <name>uiBehavior</name>
                                        <value>edit</value>
                                    </fieldInstanceProperties>
                                    <fieldName>AccountId</fieldName>
                                </fieldItem>
                            </fieldInstances>
                            <identifier>profileSection</identifier>
                        </componentInstance>
                        <componentInstance>
                            <componentInstanceProperties>
                                <name>columns</name>
                                <value>2</value>
                            </componentInstanceProperties>
                            <componentInstanceProperties>
                                <name>label</name>
                                <value>Demo Insights</value>
                            </componentInstanceProperties>
                            <componentName>flexipage:recordFieldSection</componentName>
                            <fieldInstances>
                                <!-- ⚠️ REPLACE these with your vertical's custom fields -->
                                <!-- Example for healthcare: -->
                                <fieldItem>
                                    <fieldInstanceProperties>
                                        <name>uiBehavior</name>
                                        <value>edit</value>
                                    </fieldInstanceProperties>
                                    <fieldName>Patient_Status__c</fieldName>
                                </fieldItem>
                                <fieldItem>
                                    <fieldInstanceProperties>
                                        <name>uiBehavior</name>
                                        <value>edit</value>
                                    </fieldInstanceProperties>
                                    <fieldName>Risk_Level__c</fieldName>
                                </fieldItem>
                                <fieldItem>
                                    <fieldInstanceProperties>
                                        <name>uiBehavior</name>
                                        <value>edit</value>
                                    </fieldInstanceProperties>
                                    <fieldName>Latest_PHQ9_Score__c</fieldName>
                                </fieldItem>
                                <fieldItem>
                                    <fieldInstanceProperties>
                                        <name>uiBehavior</name>
                                        <value>edit</value>
                                    </fieldInstanceProperties>
                                    <fieldName>Next_Appointment__c</fieldName>
                                </fieldItem>
                            </fieldInstances>
                            <identifier>demoInsightsSection</identifier>
                        </componentInstance>
                    </flexiPageRegions>
                    <flexiPageRegions>
                        <name>tab-activity</name>
                        <type>Region</type>
                        <itemInstances>
                            <componentInstance>
                                <componentName>runtime_sales_activities:activitiesComponent</componentName>
                                <identifier>activitiesComponent</identifier>
                            </componentInstance>
                        </flexiPageRegions>
                    </flexiPageRegions>
                    <flexiPageRegions>
                        <name>tab-related</name>
                        <type>Region</type>
                        <itemInstances>
                            <componentInstance>
                                <componentName>flexipage:relatedListContainer</componentName>
                                <identifier>relatedListContainer</identifier>
                            </componentInstance>
                        </flexiPageRegions>
                    </flexiPageRegions>
                    <identifier>contactTabset</identifier>
                    <itemInstances>
                        <componentInstance>
                            <componentInstanceProperties>
                                <name>tabLabel</name>
                                <value>Overview</value>
                            </componentInstanceProperties>
                            <componentInstanceProperties>
                                <name>tabValue</name>
                                <value>tab-overview</value>
                            </componentInstanceProperties>
                            <componentName>flexipage:tab</componentName>
                            <identifier>tabOverview</identifier>
                        </componentInstance>
                        <componentInstance>
                            <componentInstanceProperties>
                                <name>tabLabel</name>
                                <value>Activity</value>
                            </componentInstanceProperties>
                            <componentInstanceProperties>
                                <name>tabValue</name>
                                <value>tab-activity</value>
                            </componentInstanceProperties>
                            <componentName>flexipage:tab</componentName>
                            <identifier>tabActivity</identifier>
                        </componentInstance>
                        <componentInstance>
                            <componentInstanceProperties>
                                <name>tabLabel</name>
                                <value>Related</value>
                            </componentInstanceProperties>
                            <componentInstanceProperties>
                                <name>tabValue</name>
                                <value>tab-related</value>
                            </componentInstanceProperties>
                            <componentName>flexipage:tab</componentName>
                            <identifier>tabRelated</identifier>
                        </componentInstance>
                    </itemInstances>
                </flexiPageRegions>
            </componentInstance>
        </itemInstances>
    </flexiPageRegions>
    <masterLabel>&lt;Brand&gt; Contact Record Page</masterLabel>
    <sobjectType>Contact</sobjectType>
    <type>RecordPage</type>
</FlexiPage>
```

## Step 2: Replace the field list with your vertical

Replace the `<fieldInstances>` block under `demoInsightsSection` with the vertical-specific fields:

| Vertical | Fields to include |
|---|---|
| **Healthcare** | `Patient_Status__c`, `Risk_Level__c`, `Latest_PHQ9_Score__c`, `Next_Appointment__c`, `Primary_Diagnosis__c`, `Outstanding_Balance__c` |
| **FSI** | `Risk_Tolerance__c`, `Assets_Under_Management__c`, `Relationship_Tier__c`, `Next_Review_Due__c`, `KYC_Status__c`, `Life_Event_Flag__c` |
| **Retail** | `Loyalty_Tier__c`, `Lifetime_Value__c`, `Last_Purchase_Date__c`, `Net_Promoter_Score__c`, `Top_Category__c`, `Return_Rate__c` |
| **Public sector** | `Case_Type__c`, `Eligibility_Status__c`, `SLA_Due_Date__c`, `Risk_Flag__c`, `Documents_Outstanding__c`, `Last_Contact_Date__c` |
| **Field service** | (Use on Asset or Account instead — same pattern, different SObject) |
| **Prof services** | (Use on Account — same pattern) |

## Step 3: Deploy + assign

```bash
sf project deploy start --source-dir force-app/main/default/flexipages -o <alias>
```

Then **manually activate** the page (FlexiPage activation isn't reliably deployable via metadata):

1. Setup → Object Manager → Contact → Lightning Record Pages
2. Find `<Brand> Contact Record Page` → click it
3. Click **Activation** in the top right
4. Set as **Org Default** for Desktop (or assign to specific App/Profile if you want to scope it)
5. Save

⚠️ **The activation step is manual.** Don't try to script it via metadata — it's flaky. Tell the user to do it.

## Step 4: Verify

1. Open any seeded Contact in the org
2. Confirm:
   - Header (highlights panel) shows the right standard fields
   - "Demo Insights" section shows your custom fields
   - Tabs work
3. If a custom field doesn't show: check the user has FLS access via the permission set from Phase 5

## Why this matters in the demo

The AE/CEO will click the Salesforce link badge in your React app to "prove it's real." With this FlexiPage active, what opens is **a clean, organized record showing exactly the fields the React app surfaces** — no random standard fields, no "this looks like Salesforce 1.0" vibe. Reinforces the "platform underneath" message.
