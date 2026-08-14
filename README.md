# Operation Blue Signal

Secure Cloudflare Worker build for the Operation Blue Signal webpage.

## Security

The following values are intentionally **not stored in this Git repository**:

- Q1 expected answer (`OBS_Q1`)
- Q2 expected answer (`OBS_Q2`)
- Q3 expected answer (`OBS_Q3`)
- Final passcode (`OBS_PASSCODE`)
- Session-signing key (`OBS_SESSION_KEY`)

Create them as **Cloudflare Worker Secrets** in the Cloudflare Dashboard.

Optional display configuration can be added as ordinary Cloudflare Worker variables:

- `OBS_AGENT_ALIAS`
- `OBS_REAL_NAME`

Do not commit secret values, `.dev.vars`, `.env`, or credential files.

The Worker validates Q1, Q2, and Q3 server-side and uses short-lived signed session tokens between every security layer before allowing the final passcode request.

## Structure

- `public/` — webpage, styles, audio, and assets
- `src/index.js` — Cloudflare Worker API and static-asset routing
- `wrangler.jsonc` — Worker configuration
- `package.json` — Workers Builds / Wrangler deployment metadata
