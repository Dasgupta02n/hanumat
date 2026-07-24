# Deploy Hanumat to Hostinger (hanumat.life)

## Live configuration (2026-07-22)

| Item | Value |
|------|--------|
| **Site** | **https://hanumat.life** |
| Domain | `hanumat.life` (active) |
| DNS A `@` + `www` | **187.127.156.152** (VPS) |
| VPS | id **1835400**, Ubuntu 24.04 + Docker, KVM 1 |
| Stack | Docker project **`nocodegit`** multi-site: Caddy TLS + `hanumat` nginx + existing `nocodegit` |
| Static assets | Built `apps/web/out` → zip served into nginx at deploy time |

## How it works

1. Static export: `pnpm build` → `apps/web/out/`
2. Zip with POSIX paths: `deploy/hanumat-site.zip`
3. Compose: `deploy/docker-compose.gateway.yml` (Caddy hosts `hanumat.life` + `nocodegit.tech`)
4. Hostinger Docker API replaces project `nocodegit` from compose URL

## Redeploy (after content change)

```bash
# 1) rebuild static site
pnpm build

# 2) zip out/ with forward slashes (see deploy scripts / Python zipfile)

# 3) host zip publicly (or private URL curl-able from VPS)

# 4) update ZIP URL inside deploy/docker-compose.gateway.yml hanumat command

# 5) POST compose to Hostinger Docker API for VM 1835400 project nocodegit
#    (keep environment vars for nocodegit secrets)
```

## Security notes

- Do **not** commit Hostinger API tokens or nocodegit secrets into git.
- If an API token was pasted in chat, **rotate it** in hPanel → API.
- Site zip on temporary file hosts expires; re-upload for future redeploys.
