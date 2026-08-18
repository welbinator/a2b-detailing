# A2B Detailing — staging site

Standalone landing page for **A 2 B Detailing** (Rock Island / Quad Cities).

## Live

- Cloudflare Worker: `https://a2b-detailing.james-welbes.workers.dev`
- Local: `~/projects/a2b-detailing`

## Verified sources

| Field | Value | Source |
|---|---|---|
| Name | A2B Detailing / A 2 B Detailing | Maps + a2bdetailing.com |
| Category | Car detailing service | Google Maps |
| Address | 4505 11th St, Rock Island, IL 61201 | a2bdetailing.com |
| Phone (site) | (563) 313-3019 | a2bdetailing.com |
| Phone (Maps) | (563) 230-4901 | Google Maps / CRM import |
| Email | cwa2b@yahoo.com | a2bdetailing.com |
| Facebook | facebook.com/A2BDetail | a2bdetailing.com |
| Since | 2018 | a2bdetailing.com about copy |
| Services | Full interior/exterior, ceramic coating, paint correction, wash & wax | a2bdetailing.com |
| Rating | 5.0 (1 review) | GMB import / Maps stars |
| Access | Wheelchair accessible parking lot | Maps About |
| Hours | Not published | Maps “Add hours” |

**Not invented:** menu prices, full weekly hours, staff bios, review quotes.

Note: business already has `https://a2bdetailing.com` — this workers.dev page is a **standalone pitch/staging landing**, not a CMS takeover.

## Deploy

```bash
cd ~/projects/a2b-detailing
npm install
npm run deploy
```

## Design brief (anti-sameness)

- Pearl paper + midnight hero + **violet/mint** accents (not gold/yellow/copper/teal/navy-gold)
- Fonts: Space Grotesk + Plus Jakarta Sans
- Structure: sticky light header, dark photo-scrim hero, A→B path card, scrolling service marquee, bento services, brand-art about, map panel block
