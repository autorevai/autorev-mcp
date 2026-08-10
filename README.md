# AutoRev MCP Server

Connect Claude, Cursor, or any MCP client to [AutoRev AI](https://autorev.ai) and run
your field service business in plain language.

AutoRev is the AI operating system for the trades. This Model Context Protocol server
exposes the AutoRev platform to AI clients: answer and review calls, book and dispatch
jobs, build and send estimates, chase invoices, manage the pricebook, and pull daily
numbers, all through natural language.

Built for HVAC, plumbing, electrical, roofing, pest control, landscaping, garage door,
locksmith and cleaning businesses.

```
Endpoint   https://app.autorev.ai/api/mcp
Transport  Streamable HTTP (MCP 2025-03-26)
Auth       OAuth 2.1
Account    https://autorev.ai
```

## Quick start

### Claude (web and desktop)

1. Open Settings, then Connectors, then Add custom connector.
2. Paste `https://app.autorev.ai/api/mcp`.
3. Sign in with your AutoRev account when the OAuth prompt appears.

Claude discovers the tool list automatically, filtered to whatever your account has
enabled.

### Cursor, Windsurf, and other stdio-only clients

```bash
npx @autorev/mcp-server
```

Or add it to your client config:

```json
{
  "mcpServers": {
    "autorev": {
      "command": "npx",
      "args": ["-y", "@autorev/mcp-server"]
    }
  }
}
```

The package is a thin stdio bridge to the hosted server. It holds no credentials of its
own and opens the same OAuth flow in your browser on first run.

## What you can do

Ask in plain language. A few real examples:

- "What came in overnight and what still needs a callback?"
- "Book the Maple Street water heater job for Thursday morning with whoever is closest."
- "Send Dana the estimate for the condenser replacement and text her the payment link."
- "Which estimates over $2,000 have gone quiet for more than a week?"
- "How did we do yesterday compared to the same day last month?"

## Tool surface

Roughly 130 tools. The exact list your client sees is filtered by your plan and by which
integrations you have connected, so tenants without ServiceTitan never see ServiceTitan
tools.

| Area | What it covers |
|---|---|
| Calls and voice | List and inspect calls, transcripts, place outbound calls, create and tune AI receptionists |
| Messaging | Send SMS, read and reply to conversations, unified inbox, opt-outs |
| Jobs and dispatch | Create, schedule, reschedule and complete jobs, assign technicians, dispatch board, route optimization |
| Estimates and invoicing | Build estimates from templates or the pricebook, send them, invoice, record payments, send payment links |
| Pricebook | Search, match, create, update and bulk import pricebook items, live material pricing |
| Customers and leads | Add and bulk import contacts, search leads, follow-up queues |
| Recurring service | Create, pause, resume and cancel recurring plans and memberships |
| Reviews | Request reviews, track status, run follow-ups, route negative feedback |
| Campaigns and workflows | Build and publish workflows, run campaigns, enroll customers in drips |
| Reporting | Daily briefing, revenue, unified KPIs, technician performance, coaching scorecards |
| Field service integrations | ServiceTitan, Housecall Pro, Jobber, FieldEdge, Service Fusion, GoHighLevel |
| Pest control | Chemical application logging and history |

Full catalog: [docs/tools.md](docs/tools.md).

## Security

- Every tool call requires a valid OAuth 2.1 bearer token. There is no anonymous access
  and no read-only public mode.
- Tokens are scoped to a single tenant. Tenant membership is re-checked on every call,
  so revoking a user's access takes effect immediately.
- Write operations that move money or contact customers require explicit confirmation
  before they execute.
- This repository contains documentation and a client bridge. It does not contain the
  server implementation.

Report a security issue to security@autorev.ai.

## Integrations

AutoRev connects to ServiceTitan, Housecall Pro, Jobber, FieldEdge, Service Fusion,
GoHighLevel, Google Calendar and Outlook. Connected integrations expand the tool surface
automatically.

## Links

- Product: https://autorev.ai
- Developer docs: https://docs.autorev.ai
- AI agents overview: https://docs.autorev.ai/ai-agents/overview
- MCP server reference: https://docs.autorev.ai/ai-agents/mcp-server
- Tool manifest: https://docs.autorev.ai/ai-agents/tool-manifest
- Agent recipes: https://docs.autorev.ai/ai-agents/agent-recipes
- Pricing: https://autorev.ai/pricing
- Start free: https://app.autorev.ai/signup

## License

MIT. See [LICENSE](LICENSE).
