import type { APIRoute } from 'astro';
import { site } from '../lib/site';

/**
 * Blocked until the site goes live on the client's own domain.
 * Set PUBLIC_NOINDEX=false in the production environment to open it up.
 */
export const GET: APIRoute = () => {
  const body = site.noindex
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site.url).href}\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
