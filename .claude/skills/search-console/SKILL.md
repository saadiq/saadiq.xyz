---
name: search-console
description: Use when querying Google Search Console for saadiq.xyz — URL inspection, indexing status, search performance, or submitting sitemaps. Covers the gcloud application-default auth setup, the required scopes, and the quota-project header every API call needs.
---

# Google Search Console

GSC property: `sc-domain:saadiq.xyz` (domain-level, owned by `saadiq@gmail.com`).

**Auth setup**: Requires application-default credentials with webmasters scope:
```bash
gcloud auth application-default login --scopes=https://www.googleapis.com/auth/webmasters.readonly,https://www.googleapis.com/auth/cloud-platform
```
The `webmasters.readonly` scope covers all reads (URL inspection, performance, listing sitemaps). **Writes** — e.g. (re)submitting a sitemap via `PUT .../sitemaps/<url-encoded-url>` — return `403` under readonly; re-auth with the read-write scope `https://www.googleapis.com/auth/webmasters` (drop the `.readonly`) first.

**API calls** need a quota project header. Example — inspect a URL:
```bash
ACCESS_TOKEN=$(gcloud auth application-default print-access-token)
curl -s -X POST "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "x-goog-user-project: saadiq" \
  -H "Content-Type: application/json" \
  -d '{"inspectionUrl": "https://saadiq.xyz/", "siteUrl": "sc-domain:saadiq.xyz"}'
```

**List sites**: `GET https://searchconsole.googleapis.com/webmasters/v3/sites` (same auth headers)
