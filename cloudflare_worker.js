/**
 * Westernacher AI Proxy — Cloudflare Worker
 *
 * SETUP (3 minutes):
 * 1. dash.cloudflare.com → Workers & Pages → Create Worker
 * 2. Paste this file → Deploy
 * 3. Settings → Variables and Secrets → Add secret:
 *      Name:  ANTHROPIC_API_KEY
 *      Value: sk-ant-api03-...
 * 4. Copy your Worker URL → add to GitHub repo secret as WORKER_URL
 *
 * The API key never appears in any file or repository.
 * After the demo: delete this Worker or revoke the key.
 */

export default {
  async fetch(request, env) {

    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== 'POST') {
      return new Response('POST only', { status: 405, headers: cors });
    }

    if (!env.ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'ANTHROPIC_API_KEY secret not set in Worker' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...cors } }
      );
    }

    try {
      const body = await request.text();

      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body,
      });

      const data = await resp.text();
      return new Response(data, {
        status: resp.status,
        headers: { 'Content-Type': 'application/json', ...cors },
      });

    } catch (err) {
      return new Response(
        JSON.stringify({ error: err.message }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...cors } }
      );
    }
  }
};
