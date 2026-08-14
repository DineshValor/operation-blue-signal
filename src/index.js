/*
 * Operation Blue Signal — secure verification Worker
 *
 * Secrets required in Cloudflare:
 *   OBS_Q1           -> Q1 expected answer
 *   OBS_Q2           -> Q2 expected answer
 *   OBS_Q3           -> Q3 expected answer
 *   OBS_PASSCODE     -> final passcode
 *   OBS_SESSION_KEY  -> long random signing key
 *
 * Optional Worker variables (not secrets):
 *   OBS_AGENT_ALIAS  -> display alias
 *   OBS_REAL_NAME    -> display real name
 */

const jsonHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  "Pragma": "no-cache",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: jsonHeaders,
  });
}

function base64urlEncode(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64urlDecode(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function hmac(secret, value) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );

  return new Uint8Array(
    await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value))
  );
}

async function issueToken(secret, stage, ttlSeconds = 15 * 60) {
  const payload = base64urlEncode(
    new TextEncoder().encode(
      JSON.stringify({ stage, exp: Math.floor(Date.now() / 1000) + ttlSeconds })
    )
  );
  const signature = base64urlEncode(await hmac(secret, payload));
  return `${payload}.${signature}`;
}

async function verifyToken(secret, token, requiredStage) {
  if (!token || typeof token !== "string") return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payload, signature] = parts;
  const expected = await hmac(secret, payload);

  let received;
  try {
    received = base64urlDecode(signature);
  } catch {
    return false;
  }

  if (!timingSafeEqual(expected, received)) return false;

  let data;
  try {
    data = JSON.parse(new TextDecoder().decode(base64urlDecode(payload)));
  } catch {
    return false;
  }

  return data.stage === requiredStage &&
    Number.isFinite(data.exp) &&
    data.exp > Math.floor(Date.now() / 1000);
}

function isExpired(env) {
  const expiry = new Date(env.OBS_EXPIRY || "2026-08-30T23:59:59+05:30");
  return Number.isNaN(expiry.getTime()) || Date.now() > expiry.getTime();
}

function originAllowed(request) {
  const origin = request.headers.get("Origin");
  if (!origin) return true;

  try {
    return origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/verify") {
      if (request.method !== "POST") {
        return json({ success: false }, 405);
      }

      if (!originAllowed(request)) {
        return json({ success: false }, 403);
      }

      if (isExpired(env)) {
        return json({
          success: false,
          expired: true,
        }, 410);
      }

      let body;
      try {
        body = await request.json();
      } catch {
        return json({ success: false }, 400);
      }

      const stage = Number(body?.stage);
      const answer = typeof body?.answer === "string" ? body.answer.trim() : "";
      const token = typeof body?.token === "string" ? body.token : "";

      if (![1, 2, 3, 4].includes(stage)) {
        return json({ success: false }, 400);
      }

      if (!env.OBS_SESSION_KEY || !env.OBS_Q1 || !env.OBS_Q2 || !env.OBS_Q3 || !env.OBS_PASSCODE) {
        return json({ success: false }, 500);
      }

      if (stage === 1) {
        if (answer.toLowerCase() !== String(env.OBS_Q1).trim().toLowerCase()) {
          return json({ success: false });
        }

        return json({
          success: true,
          token: await issueToken(env.OBS_SESSION_KEY, 1),
          agentAlias: env.OBS_AGENT_ALIAS || "AGENT",
          realName: env.OBS_REAL_NAME || "",
        });
      }

      if (stage === 2) {
        if (!(await verifyToken(env.OBS_SESSION_KEY, token, 1))) {
          return json({ success: false });
        }

        if (answer !== String(env.OBS_Q2).trim()) {
          return json({ success: false });
        }

        return json({
          success: true,
          token: await issueToken(env.OBS_SESSION_KEY, 2),
          agentAlias: env.OBS_AGENT_ALIAS || "AGENT",
          realName: env.OBS_REAL_NAME || "",
        });
      }

      if (stage === 3) {
        if (!(await verifyToken(env.OBS_SESSION_KEY, token, 2))) {
          return json({ success: false });
        }

        if (answer.toLowerCase() !== String(env.OBS_Q3).trim().toLowerCase()) {
          return json({ success: false });
        }

        return json({
          success: true,
          token: await issueToken(env.OBS_SESSION_KEY, 3),
          agentAlias: env.OBS_AGENT_ALIAS || "AGENT",
          realName: env.OBS_REAL_NAME || "",
        });
      }

      if (!(await verifyToken(env.OBS_SESSION_KEY, token, 3))) {
        return json({ success: false });
      }

      // The passcode is intentionally returned only after the authenticated
      // browser requests the final reveal. A browser that displays/copies a
      // secret can always inspect that secret at runtime; what we prevent is
      // static-source leakage and unauthorized server-side verification.
      return json({
        success: true,
        passcode: String(env.OBS_PASSCODE),
      });
    }

    if (url.pathname === "/api/health") {
      return json({ status: "online" });
    }

    return env.ASSETS.fetch(request);
  },
};
