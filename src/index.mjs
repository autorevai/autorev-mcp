#!/usr/bin/env node
/**
 * AutoRev MCP stdio bridge.
 *
 * Claude web and Claude Desktop can talk to the hosted AutoRev MCP server directly as a
 * custom connector, so they do not need this. Clients that only speak stdio (Cursor,
 * Windsurf, and others) do, and this bridges them.
 *
 * It delegates to `mcp-remote`, the community bridge that handles the OAuth 2.1
 * authorization-code flow, opens the browser on first run, and caches the token locally
 * under ~/.mcp-auth. This package holds no credentials of its own and never sees your
 * password. It only pins the AutoRev endpoint so the command is a one-liner.
 *
 * Usage:
 *   npx @autorevai/mcp-server
 *   npx @autorevai/mcp-server --url https://app.autorev.ai/api/mcp   (override)
 */
import { spawn } from 'node:child_process'

const DEFAULT_URL = 'https://app.autorev.ai/api/mcp'

function parseArgs(argv) {
  const args = argv.slice(2)
  const passthrough = []
  let url = process.env.AUTOREV_MCP_URL || DEFAULT_URL

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--url' && args[i + 1]) {
      url = args[++i]
    } else if (args[i] === '--help' || args[i] === '-h') {
      return { help: true }
    } else {
      passthrough.push(args[i])
    }
  }
  return { url, passthrough }
}

const HELP = `
AutoRev MCP server (stdio bridge)

  npx @autorevai/mcp-server [--url <endpoint>] [mcp-remote flags...]

Connects an MCP client to AutoRev at ${DEFAULT_URL}.
A browser window opens on first run so you can sign in to your AutoRev account.

Claude web and Claude Desktop do not need this bridge. Add the endpoint above as a
custom connector instead.

Docs: https://github.com/autorevai/autorev-mcp
`

const { help, url, passthrough } = parseArgs(process.argv)

if (help) {
  process.stdout.write(HELP)
  process.exit(0)
}

// stdio is the MCP transport here, so anything we print to stdout would corrupt the
// JSON-RPC stream. Diagnostics go to stderr only.
process.stderr.write(`[autorev-mcp] connecting to ${url}\n`)

// mcp-remote is pinned to an exact version, not floated to latest. This bridge
// runs on the user's machine, so an unpinned dependency would pull whatever
// mcp-remote is newest at run time. Pinning means a future compromised release
// cannot reach our users until we review it and bump this line deliberately.
const MCP_REMOTE_VERSION = '0.1.38'
const bridge = spawn('npx', ['-y', `mcp-remote@${MCP_REMOTE_VERSION}`, url, ...passthrough], {
  stdio: 'inherit',
  env: process.env,
})

bridge.on('error', (err) => {
  process.stderr.write(
    `[autorev-mcp] failed to start the bridge: ${err.message}\n` +
      `[autorev-mcp] npx and Node 18+ are required.\n`
  )
  process.exit(1)
})

bridge.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal)
  else process.exit(code ?? 0)
})

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => bridge.kill(sig))
}
