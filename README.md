# 🍹 The Bar — Cocktail Request App

A slick, bilingual (EN-GB / PT-PT) cocktail request webapp for house parties.
Guests browse your menu, pick a cocktail, and submit their name — you get an email notification.
You manage ingredient availability from a password-protected backoffice.

---

## Project Structure

```
cocktail-bar/
├── index.html          ← Guest-facing gallery page
├── cocktail.html       ← Cocktail detail + request form
├── backoffice.html     ← Password-protected ingredient manager
├── cocktails.json      ← Your cocktail data (edit this!)
├── css/style.css       ← All styles
├── js/
│   ├── i18n.js         ← Translations (EN + PT)
│   └── utils.js        ← Shared helpers
├── images/             ← Place your cocktail photos here
└── netlify.toml        ← Hosting & redirect config
```

---

## 1 — Customise your cocktails

Edit `cocktails.json`. Each cocktail follows this schema:

```json
{
  "id": "unique-slug",              // used in the URL
  "name": {
    "en": "Cocktail Name",
    "pt": "Nome do Cocktail"
  },
  "image": "images/my-photo.jpg",  // relative path from repo root
  "glass": "martini",              // see glass types below
  "ice": true,                     // true / false
  "ingredients": [
    {
      "name": { "en": "Gin", "pt": "Gin" },
      "quantity": "50ml"
    }
  ]
}
```

**Supported glass types:** `rocks`, `martini`, `flute`, `highball`, `coupe`, `wine`, `hurricane`, `collins`

Add your cocktail images to the `images/` folder. The app falls back to an emoji if the image is missing.

---

## 2 — Change the backoffice password

In `backoffice.html`, find this line near the top of the `<script>` tag and change it:

```javascript
const BACKOFFICE_PASSWORD = "letmein";
```

> ⚠️ This is a client-side password — it stops casual visitors but is not cryptographically secure. For a home party app this is fine. Don't use a password you use elsewhere.

---

## 3 — Deploy to Netlify (free)

Netlify is the recommended host. It's free, fast (global CDN), and handles form submissions with email notifications out of the box.

### 3a — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
gh repo create cocktail-bar --public --push
# (or use the GitHub website to create the repo and push manually)
```

### 3b — Connect to Netlify

1. Go to [netlify.com](https://netlify.com) and sign up / log in (free)
2. Click **"Add new site" → "Import an existing project"**
3. Choose **GitHub**, authorise, and select your repo
4. Build settings — leave everything blank (it's a static site, no build command needed)
   - Publish directory: `.` (or leave empty)
5. Click **Deploy site**

Your site will be live at `https://your-site-name.netlify.app` within ~30 seconds.

### 3c — Enable email notifications for drink requests

1. In the Netlify dashboard, go to **Site configuration → Forms**
2. You should see a form called **`drink-request`** listed automatically
3. Go to **Forms → Form notifications**
4. Click **"Add notification" → "Email notification"**
5. Enter your email address and save

From now on, every time a guest submits a drink request you'll get an email with the cocktail name and their name.

> Netlify Forms free tier: **100 submissions/month** — plenty for a house party.

---

## 4 — Using the Backoffice

Visit `https://your-site.netlify.app/backoffice` and log in with your password.

- **Tick** the ingredients you currently have in stock
- Click **Save Changes**
- The gallery will now only show cocktails where every ingredient is available

The availability data is stored in your browser's `localStorage` — so you need to manage it from the same device/browser each time. If you want to manage it from a different device, just open the backoffice there and re-save.

---

## 5 — Adding more languages

In `js/i18n.js`, add a new language block alongside `en` and `pt`:

```javascript
const TRANSLATIONS = {
  en: { ... },
  pt: { ... },
  es: {              // ← add Spanish
    nav_home: "El Bar",
    gallery_title: "Menú de Esta Noche",
    // ... etc
  }
};
```

Then update the `lang_toggle` flow in `js/utils.js` to cycle through more than two languages.

---

## Local development

Just open `index.html` in a browser. No build step required.

> Note: The request form uses Netlify Forms and will return a network error when tested locally — this is expected. It will work correctly once deployed.

For local form testing, you can temporarily change the fetch URL or use Netlify Dev:

```bash
npm install -g netlify-cli
netlify dev
```

---

## Alternatives to Netlify Forms

If you'd rather not use Netlify, or need more than 100 submissions/month:

| Service | Free tier | Notes |
|---------|-----------|-------|
| [Formspree](https://formspree.io) | 50/month | Replace fetch URL with your Formspree endpoint |
| [Web3Forms](https://web3forms.com) | 250/month | Very easy setup |
| [EmailJS](https://emailjs.com) | 200/month | Client-side, no server needed |

For Formspree, just replace the fetch call in `cocktail.html`:
```javascript
const res = await fetch("https://formspree.io/f/YOUR_ID", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ cocktail: name, requester: requester })
});
```
