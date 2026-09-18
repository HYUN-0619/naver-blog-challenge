import { onRequestGet as onVisitGet, onRequestPost as onVisitPost } from './functions/api/visit.js';
import { onRequestGet as onFeedbackGet, onRequestPost as onFeedbackPost } from './functions/api/feedback.js';
import { onRequestPost as onVotePost } from './functions/api/feedback/vote.js';
import { onRequestGet as onChallengeGet, onRequestPost as onChallengePost } from './functions/api/challenge.js';
import { onRequestGet as onNaverRssGet } from './functions/api/naver-rss.js';
import { 
  handleAdminAuth, 
  handleAdminStats, 
  handleAdminFeedbackUpdate, 
  handleAdminFeedbackDelete 
} from './functions/api/admin.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const context = { request, env, ctx };

    // Admin Routes
    if (url.pathname === '/api/admin/auth' && request.method === 'POST') {
      return handleAdminAuth(context);
    }
    if (url.pathname === '/api/admin/stats' && request.method === 'GET') {
      return handleAdminStats(context);
    }
    if (url.pathname === '/api/admin/feedback') {
      if (request.method === 'PATCH') {
        return handleAdminFeedbackUpdate(context);
      }
      if (request.method === 'DELETE') {
        return handleAdminFeedbackDelete(context);
      }
      return new Response('Method Not Allowed', { status: 405 });
    }

    // Route /api/naver-rss
    if (url.pathname === '/api/naver-rss') {
      if (request.method === 'GET') {
        return onNaverRssGet(context);
      }
      return new Response('Method Not Allowed', { status: 405 });
    }

    // Route /api/visit
    if (url.pathname === '/api/visit') {
      if (request.method === 'POST') {
        return onVisitPost(context);
      }
      return onVisitGet(context);
    }

    // Route /api/challenge
    if (url.pathname === '/api/challenge') {
      if (request.method === 'POST') {
        return onChallengePost(context);
      }
      return onChallengeGet(context);
    }

    // Route /api/feedback/vote
    if (url.pathname === '/api/feedback/vote') {
      if (request.method === 'POST') {
        return onVotePost(context);
      }
      return new Response('Method Not Allowed', { status: 405 });
    }

    // Route /api/feedback
    if (url.pathname === '/api/feedback') {
      if (request.method === 'POST') {
        return onFeedbackPost(context);
      }
      return onFeedbackGet(context);
    }

    // Serve static assets from ./dist
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  }
};
