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

## The one remaining step

The registry reads `mcpName` from the **published npm tarball**, not from this repo. Adding it
here is necessary and not sufficient: the package on the registry has to carry it.

`@autorevai/mcp-server@1.0.0` on npm does not have the field. `1.0.1` in this repo does.

So somebody with npm credentials runs:

```bash
cd ~/code/autorev-mcp
npm login          # only if this machine has never published
npm publish --access public
```

Then trigger the workflow from the Actions tab, or push a `v1.0.1` tag. It will publish to the
registry and confirm the listing is searchable.

**No npm credential exists anywhere in the current toolchain.** Checked 2026-09-11: `npm whoami`
returns `need auth`, and there is no `~/.npmrc`. `1.0.0` was published from somewhere else.

## Worth doing once instead of every time

Add an `NPM_TOKEN` secret to this repo and uncomment the npm publish block in the workflow. Then a
tag does the whole thing: npm, then registry, then the confirmation check.

The same missing credential has now blocked two separate backlink plays, this one and the n8n
community node, which is the largest single row in the marketing repo's `backlink-master.csv`.

## Why any of this matters

`claude.com/connectors/quo` is a DR 80 dofollow link that quo.com holds and we do not, and it
exists because quo is in Anthropic's connectors directory. The registry is the door to that
directory. AutoRev has 9 earned referring domains. Quo has 4,108.

## Version bumps

`version` must match in three places or the workflow fails the run deliberately:
`package.json`, `server.json` (top level), and `server.json` `packages[0].version`.
