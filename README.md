# Grow Smart SA Website

The production marketing website for Grow Smart SA (Pty) Ltd. It is a static site: plain HTML, CSS and JavaScript, with no build step and no framework.

**Live status:** this repository is deployed via Vercel, connected to the `main` branch, and served at [growsmartsa.online](https://growsmartsa.online). Pushing to `main` triggers an automatic redeploy.

## What's in this folder

```
index.html          Home
training.html        Training programme
product.html          The AI assessment tool
pricing.html           Pricing
proof.html              Traction / track record
founder.html             Founder
contact.html              Contact
terms.html                 Terms & Support
privacy.html                Privacy Policy
robots.txt                    Search engine crawl rules
sitemap.xml                    Search engine sitemap
css/styles.css                  All styles (design system + layout)
js/main.js                       Navigation, animations, FAQ accordion, contact form
images/logo.png                   Grow Smart SA logo
images/favicon-*.png, favicon.ico    Browser tab icons, generated from the logo
```

Everything is self-contained. There are no external dependencies except Google Fonts, which are loaded from a CDN link in the page head.

## Contact form

The contact form works out of the box with no setup: when someone submits it, their email app opens with a pre-filled message addressed to `tahriq.smith@gmail.com`. This is reliable and needs nothing extra, but it does depend on the visitor having an email client configured on their device. If you'd rather have submissions land silently in your inbox or a dashboard without opening the visitor's email app, see "Upgrading the contact form" below.

The sections below (deploying to Netlify, connecting a GoDaddy domain) describe an alternative path and are kept for reference; they are not the current deployment, which is Vercel + GitHub as described above.

## Recommended: deploy with Netlify

Netlify is the easiest path for a static site like this one: free for a site at this scale, fast, automatic HTTPS, and it connects to a custom domain in a few clicks.

**Fastest option, no account setup for git:**

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag the entire `gsm_site` folder onto the page.
3. Netlify uploads it and gives you a live URL immediately (something like `random-name-123.netlify.app`).
4. To update the site later, make your edits locally and drag the folder in again.

**More durable option, connected to a git repository:**

1. Create a free GitHub account if you don't have one, and create a new repository (e.g. `grow-smart-sa-website`).
2. Upload the contents of this folder to that repository.
3. In Netlify, choose "Add new site" → "Import an existing project" → connect GitHub → select the repository.
4. Leave the build command empty and set the publish directory to the repository root (`.`). There is no build step.
5. Netlify deploys automatically every time you push a change to the repository, which makes future updates simple.

Other hosts that work equally well for this kind of static site, if you'd prefer: **Vercel**, **Cloudflare Pages**, and **GitHub Pages**. The deployment steps are very similar (connect a repository or drag-and-drop the folder); the DNS steps below are specific to Netlify but the same general pattern (an A record plus a CNAME, or full nameserver delegation) applies to any of them, with each provider publishing its own IP address or CNAME target.

## Connecting your GoDaddy domain

You mentioned your domain is registered with GoDaddy. You do not need to move the domain away from GoDaddy: you keep it registered there and just point it at your host. Once your site is live on Netlify (or another host), go to Netlify's site settings → "Domain management" → "Add a custom domain" and enter your domain. Netlify will then tell you which of the following two records to add. In GoDaddy, this is under **My Products → your domain → DNS → Manage DNS**.

**Option A: point your domain directly at Netlify (recommended, keeps GoDaddy as your registrar and DNS manager)**

Add these two records in GoDaddy's DNS management screen:

| Type | Name | Value |
|------|------|-------|
| A | @ | `75.2.60.5` |
| CNAME | www | `<your-site-name>.netlify.app` |

The `A` record points your bare domain (`growsmartsa.co.za`) at Netlify's load balancer. The `CNAME` record points the `www` version at your specific Netlify site. Netlify will show you the exact `.netlify.app` address to use for the CNAME once you've added the custom domain in its dashboard. GoDaddy's DNS editor does not support the more modern `ALIAS`/`ANAME` record type on its standard plans, which is why the apex `A` record is the reliable option here.

**Option B: let Netlify manage your DNS (simpler ongoing management, still no need to move your registration)**

Instead of individual records, you point GoDaddy's nameservers at Netlify, and then manage all DNS from the Netlify dashboard. Netlify will give you nameserver addresses (something like `dns1.p0X.nsone.net`) after you choose this option in "Domain management." In GoDaddy, under your domain's settings, change the nameservers to the ones Netlify provides.

Either way, DNS changes typically take anywhere from a few minutes to a few hours to take effect worldwide (occasionally up to 24-48 hours). Netlify automatically issues a free HTTPS certificate for your domain once it detects the DNS is pointing correctly, so your site will show a secure padlock without any extra steps.

## Upgrading the contact form (optional)

The contact form currently opens a pre-filled email as a reliable, zero-setup fallback. If you'd prefer submissions to be collected directly (for example, delivered to your inbox without the visitor needing an email client, or logged somewhere you can review them):

1. Sign up for a form backend service such as [Formspree](https://formspree.io) (free tier available) and create a form there; it will give you an endpoint URL.
2. Open `js/main.js` and find the line near the top of the "Contact form" section that reads:
   ```js
   var FORM_ENDPOINT = ""; // e.g. "https://formspree.io/f/xxxxxxx"
   ```
3. Paste your endpoint URL between the quotes and save. The form will now submit directly to that service; the mailto fallback still applies automatically if the request ever fails.

## Local preview before you deploy

If you want to preview the site on your own computer first, you don't need to install anything special. Open a terminal in this folder and run:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser. Press Ctrl+C in the terminal to stop the preview server when you're done. This step is optional; it's only for checking the site before you deploy it.

## Legal pages

`terms.html` and `privacy.html` contain Grow Smart SA's approved terms and privacy content (no unfilled placeholders remain). Both are marked `noindex` so search engines won't index them. They are still intended as a practical starting point rather than final legal advice; please have a South African legal professional review them, particularly the privacy policy given South Africa's Protection of Personal Information Act (POPIA) requirements. The Information Officer section of the privacy policy is intentionally left open until that appointment and registration are formally confirmed.
