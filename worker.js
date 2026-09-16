import { onRequestGet, onRequestPost } from './functions/api/visit.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Route /api/visit
    if (url.pathname === '/api/visit') {
      const context = { request, env, ctx };
      if (request.method === 'POST') {
        return onRequestPost(context);
      }
      return onRequestGet(context);
    }

    // Serve static assets from ./dist
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  }
};
