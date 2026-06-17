# Claude.ai ↔ Salesforce Hosted MCP setup

End-to-end steps for connecting `claude.ai` web to a Salesforce Hosted MCP server. Validated mid-2026 against a scratch org.

⚠️ **Demo recommendation:** as of mid-2026 this flow has known partner-side OAuth issues. For a high-stakes live demo, show the **Setup → MCP Servers** page as a static slide and use the talk track in [SKILL.md](SKILL.md) instead of attempting live connection. Set this up post-demo if it's worth showing.

## Step 1: Activate the MCP server in the org

1. Setup → Quick Find: **MCP Servers**
2. Find `platform.sobject-reads` (or your chosen server) → click in → **Activate**

## Step 2: Create an External Client App

1. Setup → Quick Find: **External Client App Manager** → **New External Client App**
2. Fill in:
   - **External Client App Name:** `Claude MCP Connector`
   - **API Name:** `Claude_MCP_Connector`
   - **Contact Email:** your email
   - **Distribution State:** `Local`
3. In **API (Enable OAuth Settings)**:
   - ✅ Enable OAuth
   - **Callback URL:** `https://claude.ai/api/mcp/auth_callback`
   - **Selected OAuth Scopes** (move from left to right):
     - `Access Salesforce hosted MCP servers (mcp_api)` — **required**
     - `Manage user data via APIs (api)`
     - `Perform requests on your behalf at any time (refresh_token, offline_access)`
4. In **Security (Flow Enablement)**:
   - ✅ Enable Authorization Code and Credentials Flow
   - ❌ uncheck "Require Secret for Web Server Flow"
   - ❌ uncheck "Require Secret for Refresh Token Flow"
   - ✅ check "Require Proof Key for Code Exchange (PKCE)"
5. Create.

## Step 3: Configure Policies

On the new ECA → **Policies** tab → **Edit**:

- **Permitted Users:** `All users may self-authorize`
- **IP Relaxation:** `Relax IP restrictions`
- Save.

Verify the **Settings** tab shows the app as **Enabled** (not "Not Enabled"). Click Enable if needed.

## Step 4: Grab the Consumer Key

Settings tab → OAuth Settings → **Consumer Key and Secret** → enter the verification code emailed to you → copy the Consumer Key (long string starting with `3MVG9...`).

## Step 5: Configure the connector in Claude

1. claude.ai → profile menu → Settings → **Connectors** → **Add custom connector**
2. Fill in:
   - **Name:** `<Customer> Salesforce`
   - **Remote MCP server URL** (pick the right one for your org type):
     - Scratch / Sandbox: `https://api.salesforce.com/platform/mcp/v1/sandbox/platform/sobject-reads`
     - Dev / Enterprise / non-sandbox: `https://api.salesforce.com/platform/mcp/v1/platform/sobject-reads`
3. **Advanced settings** → **OAuth Client ID** → paste the Consumer Key.
4. Leave OAuth Client Secret blank.
5. Save → **Connect**.

## Step 6: Authenticate

On the Salesforce login screen:

- If you see "Use Custom Domain" link, click it and enter your org's My Domain prefix (e.g., `<your-org>-dev-ed.scratch`).
- ⚠️ **Use a private/incognito window** if your browser is already signed into a different Salesforce org. Mixed cookies cause `invalid_client_id`.
- Username: scratch org username (`test-xxx@example.com`)
- Password: generate via `sf org generate password --target-org <alias>` if no password is set.
- Approve the consent screen.

## Common errors

| Error | Cause | Fix |
|---|---|---|
| "Couldn't reach the MCP server" before login | Wrong URL format for the org type | Use the sandbox path for scratch orgs |
| `OAUTH_APPROVAL_ERROR_GENERIC` after consent | ECA missing `mcp_api` scope | Add `Access Salesforce hosted MCP servers (mcp_api)` to Selected Scopes |
| `invalid_client_id` on Salesforce login page | Browser signed into a different org | Open in incognito window |
| "Authorization with the MCP server failed" after consent succeeds | Token exchange failed — usually wrong URL path | Switch sandbox ↔ non-sandbox path |
| Login screen shows wrong org | Logged into `login.salesforce.com` instead of My Domain | Click "Use Custom Domain" link |

## Verify it works

After successful connection, in claude.ai start a new chat:

> Using the <Customer> Salesforce connector, find the Contact named Sarah Mitchell and tell me her Risk Level, Latest PHQ-9 Score, and Next Appointment.

If Claude returns the field values, you're good.
