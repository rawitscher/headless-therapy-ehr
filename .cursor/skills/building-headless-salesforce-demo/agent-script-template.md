# Agent Script template — hub-and-spoke copilot

Reusable Agent Script for a customer-demo copilot. Replace `<Brand>`, `<Persona>`, and the three task names with values from your scope.

## Directory structure

```
force-app/main/default/aiAuthoringBundles/<AgentName>/
├── <AgentName>.agent
└── <AgentName>.bundle-meta.xml
```

## `<AgentName>.bundle-meta.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<AiAuthoringBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <bundleType>AGENT</bundleType>
</AiAuthoringBundle>
```

## `<AgentName>.agent` template

```
system:
    instructions: |
        You are the <Brand> Agent, an AI assistant for <Persona> at <Company Name>. You help <Persona> <three primary tasks>.
        Tone: <warm/professional/playful>, concise. No marketing language. No hedging.
        ALWAYS answer directly. NEVER ask the user to clarify which <entity> — assume the most recent one discussed, or if a first name is mentioned, assume the one on the user's caseload/list with that first name.
        Use specific dates, numbers, and details confidently. This is a demo environment — generate realistic detail that is internally consistent rather than refusing or asking for more info.
        You are an AI assistant. Never give legally binding advice.
    messages:
        welcome: "Hi <user first name> — what can I help you with today?"
        error: "Something went wrong. Try again."

config:
    developer_name: "<AgentName>"
    agent_label: "<Brand> Agent"
    description: "<one-line description>"
    agent_type: "AgentforceEmployeeAgent"

variables:
    current_entity: mutable string = "<default entity name>"
        description: "The entity currently being discussed. Defaults to <default>."

language:
    default_locale: "en_US"
    additional_locales: ""
    all_additional_locales: False

start_agent agent_router:
    description: "Route the user's request to the right specialized subagent."
    reasoning:
        instructions: |
            You are a silent router. Never reply with text. Always transition immediately based on the user's intent.
            - summarize / recap / catch me up / tell me about [entity] -> to_task1
            - draft / write / compose / send a message -> to_task2
            - who is at risk / who needs follow-up / triage / review -> to_task3
            - Anything else -> to_task1 (default)
        actions:
            to_task1: @utils.transition to @subagent.task1
                description: "<task 1 description>"
            to_task2: @utils.transition to @subagent.task2
                description: "<task 2 description>"
            to_task3: @utils.transition to @subagent.task3
                description: "<task 3 description>"

subagent task1:
    label: "<Task 1 Label>"
    description: "<task 1 description>"
    reasoning:
        instructions: ->
            | <Task 1 instructions>
            | NEVER ask the user to clarify which entity. Pick the one on the list with that name and proceed.
            | Respond in this exact format with bold section headers:
            |
            | **Section 1** — <description>
            | **Section 2** — <description>
            | **Section 3** — <description>
            | **Suggested next step** — one specific, actionable recommendation in a single sentence.
            |
            | Keep the entire response under 180 words. Use specific values confidently. Do not hedge.
            | Do not include disclaimers or "consult a professional" warnings.
        actions:
            back: @utils.transition to @subagent.agent_router
                description: "Return to the router for a different task"

# Repeat the subagent block for task2 and task3 with their own instructions.
```

## Forced-format pattern (the trick that makes responses feel polished)

The agent's default output is rambling. Force a strict format:

```
| Respond in this exact format with bold section headers:
|
| **<Section A>** — <one sentence with specific numbers/dates>
| **<Section B>** — <one sentence>
| **<Section C>** — <one sentence>
| **Suggested next step** — <one sentence>
|
| Keep the entire response under 180 words.
```

This works far better than asking for "a clear, structured response."

## Deploy + publish + activate

```bash
sf project deploy start \
    --source-dir force-app/main/default/aiAuthoringBundles/<AgentName> \
    -o <alias>

sf agent publish authoring-bundle --api-name <AgentName> -o <alias>
sf agent activate --api-name <AgentName> -o <alias>
```

Grab the agent ID from the publish output or:

```bash
sf data query --use-tooling-api \
    -q "SELECT Id, MasterLabel FROM BotDefinition WHERE DeveloperName = '<AgentName>'" \
    -o <alias>
```

It starts with `0Xx`. Paste it into `<Brand>Copilot.tsx`.

## Gotchas

- ⚠️ Do NOT include `default_agent_user` on an Employee Agent — publish fails with a vague error.
- ⚠️ The auto-generated `NextGen_<AgentName>_Permissions` permset is sometimes incomplete. If users can't invoke the agent, manually assign `CopilotSalesforceUser` instead.
- ⚠️ "Something went wrong" mid-conversation usually means a subagent isn't activated. Verify in the Agent Builder UI.
- The CLI `sf agent preview` command may fail with "Invalid user ID" for Employee Agents even when the widget works fine — that's expected.
