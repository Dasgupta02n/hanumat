# Production hosting & CDN (P4)

## Current production topology

| Layer | Choice |
|-------|--------|
| App | Static export (`apps/web/out`) — SSG, no Node required |
| Edge / TLS | Hostinger VPS Caddy (or any static host + CDN) |
| Domain | `hanumat.life` → VPS `187.127.156.152` (when DNS set) |
| Media | Co-located under `/audio/**` and `/images/**` in static root |
| Offline | Service worker caches Chalisa pack client-side |

## CDN options (pick one when scaling)

1. **Hostinger VPS only** (current) — fine for Wave 0 traffic  
2. **Cloudflare proxy** in front of VPS — cache static assets, DDoS  
3. **R2/S3 + public bucket** for audio only — set `MEDIA_BASE_URL` later if split

## Cache headers (recommended on Caddy/nginx)

```
/_next/static/*  Cache-Control: public, max-age=31536000, immutable
/audio/*         Cache-Control: public, max-age=86400
/images/*        Cache-Control: public, max-age=604800
```

## Redeploy static site

```bash
pnpm --filter @hanumat/web build
# upload apps/web/out to host or refresh docker zip URL
```

## Health

- `GET /` → 200  
- `GET /audio/chalisa/hanuman_chalisa.m4a` → 200  
- `GET /sw.js` → 200  
