# Velvet Shelf — Starter Site

## What's in here
```
index.html        → Homepage
skincare.html      → Sun care & skincare niche page
makeup.html        → Makeup niche page
fashion.html        → Women's fashion niche page
laundry.html         → Home & laundry organization niche page
about.html          → About page
disclosure.html      → Affiliate disclosure (required)
css/style.css        → Shared stylesheet (design tokens + all components)
js/main.js            → Shared JS (nav toggle, FAQ accordion, click tracking, sticky CTA)
images/                → Empty — add your real photos here (see below)
```

## Before you go live — 3 things to do

1. **Add real images.** Every `<img src="/images/...">` path is a placeholder. Drop matching JPGs into `/images/` (compress them with TinyPNG first — page speed affects both Pinterest distribution and Google ranking).

2. **Replace affiliate links.** Every product's "Check Price" button currently points to `https://example.com/affiliate/...` — swap these for your real affiliate URLs.

3. **Add your Pinterest verification code.** Every page has:
   ```html
   <meta name="p:domain_verify" content="REPLACE_WITH_YOUR_PINTEREST_CODE">
   ```
   Replace with the real code once you start the "Claim Website" flow in Pinterest Business Settings — this is the HTML-tag verification method.

## How the design works
- One shared `style.css` and `main.js` power every page — edit once, updates everywhere.
- Each niche page has a `class="niche-skincare"` (or makeup/fashion/laundry) on `<body>` — this sets a CSS variable (`--accent`) that recolors buttons, tags, and CTAs per section, so each niche feels like its own "shelf section" while staying one brand.
- The `.shelf-line` divider and `.shelf-tag` labels are the recurring signature elements tying pages together.

## To deploy (free)
1. Push this folder to a GitHub repo.
2. Connect the repo to Netlify or Cloudflare Pages (both free, both auto-deploy on push).
3. Buy a cheap `.xyz`/`.online` domain and point its DNS to your host.
4. Claim the domain in Pinterest Business Settings.

## Adding the database later (optional)
`js/main.js` already has a commented-out Supabase `fetch` call inside the click-tracking function — when you're ready, create a free Supabase project, add a `clicks` table, and uncomment/fill in that block. No other code changes needed.
