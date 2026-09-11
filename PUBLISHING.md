# Publishing

## Current state, 2026-09-11

The MCP Registry listing is **one `npm publish` away**. Everything else is done and proven.

## What is already working

`.github/workflows/publish-mcp.yml` authenticates to the registry over **GitHub OIDC**, with no
browser and no device flow. That was the thing blocking this for three weeks: the documented path
is `mcp-publisher login github`, which needs a human at a browser. `login github-oidc` does not.

Two dispatched runs prove the auth path works end to end. Both reached the registry's own
validation and were rejected on content, never on identity:

| Run | Registry response | Fixed |
|---|---|---|
| 1 | `422 expected length <= 100` on `body.description` (ours was 202) | Yes, rewritten to 95 chars |
| 2 | `400 NPM package is missing required 'mcpName' field` | Field added, see below |

## The one remaining step, and it is a settings page not a credential

The registry reads `mcpName` from the **published npm tarball**, not from this repo. So `1.0.1`
has to reach npm before the registry will accept it. `1.0.0` is up there and does not carry the
field.

**Do this once, on npmjs.com. No token to create, paste, store or rotate.**

> @autorevai/mcp-server -> Settings -> Trusted Publisher -> GitHub Actions
> - Organization or user: `autorevai` (case-sensitive)
> - Repository: `autorev-mcp`
> - Workflow filename: `publish-mcp.yml` (must match exactly)
> - Allowed action must include `npm publish`

Then set the repo variable `NPM_TRUSTED_PUBLISHING=true`:

```bash
gh variable set NPM_TRUSTED_PUBLISHING --body true --repo autorevai/autorev-mcp
```

Then dispatch the workflow, or push a `v1.0.1` tag. It publishes to npm, publishes to the
registry, and confirms the listing is searchable.

npm mints an OIDC token per run from the same `id-token: write` permission the registry step
already uses. It is scoped to one run and expires in minutes. Classic npm tokens were invalidated
on 2025-12-09, so the alternative would be a granular token somebody has to store anyway.

`@autorevai/mcp-server@1.0.0` already being on npm satisfies npm's rule that a first version must
exist before a Trusted Publisher can be configured.

**If you would rather just do it by hand once:** `npm login && npm publish --access public` from
this directory, then dispatch the workflow. The npm step stays skipped and everything else runs.

Until `NPM_TRUSTED_PUBLISHING` is set, the npm step is **skipped rather than failed**, so the
registry publish still runs and still reports honestly.

## Why the credential question keeps coming up

No npm credential exists anywhere in the current toolchain. Checked 2026-09-11: `npm whoami`
returns `need auth`, and there is no `~/.npmrc`. `1.0.0` was published from somewhere else.

That same gap has now blocked two separate backlink plays: this listing, and the n8n community
node, which is the largest single row in the marketing repo's `backlink-master.csv` (one node
reportedly earned Dialzara ~800 backlinks, because n8n generates a page per node pairing).
Trusted publishing fixes it for this repo permanently.

## Why any of this matters

`claude.com/connectors/quo` is a DR 80 dofollow link that quo.com holds and we do not, and it
exists because quo is in Anthropic's connectors directory. The registry is the door to that
directory. AutoRev has 9 earned referring domains. Quo has 4,108.

## Version bumps

`version` must match in three places or the workflow fails the run deliberately:
`package.json`, `server.json` (top level), and `server.json` `packages[0].version`.
