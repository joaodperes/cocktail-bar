# 🍹 The Bar — Cocktail Request App

A small, static cocktail-request site with a password-protected backoffice and server-side availability storage (Netlify Functions).

Features
- Guest-facing gallery + per-cocktail request form
- Backoffice to mark which ingredients you have in stock
- Server-side persistence for availability via Netlify Functions and Netlify Blobs
- Multi-language support (EN / PT)

Quickstart

- Clone the repo and open the site locally:

  - Open `index.html` in your browser for a quick preview (static files only).

- For local development with Netlify Functions (recommended):

  ```bash
  npm install -g netlify-cli
  netlify dev
  ```

  `netlify dev` will run the functions locally and let the backoffice talk to them.

Project structure

```
cocktail-bar/
├── index.html          ← Guest-facing gallery page
├── cocktail.html       ← Cocktail detail + request form
├── backoffice.html     ← Password-protected ingredient manager (uses functions)
├── cocktails.json      ← Your cocktail data (edit this!)
├── css/style.css       ← Styles
├── js/                 ← App scripts (`i18n.js`, `utils.js`)
├── images/             ← Cocktail photos + favicon
├── build.js            ← Produces `dist/` and injects environment tokens
├── netlify/            ← Netlify Functions
│   └── functions/      ← `get-availability.js`, `set-availability.js`
└── netlify.toml        ← Netlify config
```

Cocktail data

Edit `cocktails.json` to manage cocktails. Each entry contains `id`, `name` (per-language), `image`, `glass`, `ice`, and `ingredients` (with `name` objects). See the existing file for examples.

Backoffice and availability (new)

Recent updates move availability storage from browser `localStorage` to a shared server-side store using Netlify Blobs and two Netlify Functions:

- `/.netlify/functions/get-availability` — GET current availability (returns `null` or an array of ingredient keys)
- `/.netlify/functions/set-availability` — POST to update availability (expects JSON array)

Authentication

The backoffice sends a SHA-256 hex hash of your password in the `x-password-hash` header when saving or verifying. The functions compare that header against the environment variable `BO_PASSWORD_HASH`.

Set `BO_PASSWORD_HASH` in Netlify (Site → Site settings → Build & deploy → Environment) to the SHA-256 hex digest of your chosen password.

Generate the hash locally with Node:

```bash
node -e "console.log(require('crypto').createHash('sha256').update('your-password').digest('hex'))"
```

Replace `your-password` with the password you want to use for the backoffice.

Notes:
- When deployed, availability is shared across devices (the backoffice saves to Netlify Blobs).
- When the functions are unreachable (e.g., running a plain `index.html` file without `netlify dev`), the backoffice treats availability as unset and shows all cocktails.

Build & deploy

The repo includes a simple `build.js` that copies files into `dist/` and injects environment tokens (for example `WEB3FORMS_KEY`).

Typical deploy flow to Netlify:

1. Create a Netlify site and connect your GitHub repo.
2. In Netlify Site settings → Environment, add:
   - `BO_PASSWORD_HASH` — the SHA-256 password hash (see above)
   - `WEB3FORMS_KEY` — optional, if you use a third-party form service
3. Deploy. Netlify will install dependencies (the functions use `@netlify/blobs`) and expose the functions at the configured paths.

If you prefer to pre-build locally, run:

```bash
node build.js
# then serve the `dist/` directory (or deploy `dist/` to Netlify)
```

Testing forms and local dev

- Netlify Forms works when the site is deployed to Netlify. For local testing, use `netlify dev`.
- To test the backoffice against the live functions from a local machine, ensure `BO_PASSWORD_HASH` in Netlify equals the hash produced locally from your password.

Security notes

- `BO_PASSWORD_HASH` is compared server-side — avoid shipping raw passwords in client files.
- The backoffice still keeps its unlocked session in `sessionStorage` when you enter the password; logging out clears it.
- The functions require Netlify environment variables and will return `401` if `x-password-hash` does not match.

Contributing

- Update `cocktails.json` and add images in `images/`.
- If adding features to functions, add any required packages to `package.json` so Netlify installs them.

Contact / License

This project is a small party tool—use and modify as you like. Open an issue or PR with improvements.
