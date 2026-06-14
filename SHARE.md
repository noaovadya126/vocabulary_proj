# VocabQuest — Share & Install Guide

## Quick share (recommended)

1. Open **[vercel.com/new](https://vercel.com/new)** and sign in with GitHub.
2. Import repository: **`noaovadya126/vocabulary_proj`**
3. Click **Deploy** (default settings are fine).
4. After ~2 minutes you get a public URL, for example:
   - `https://vocabulary-proj.vercel.app`
5. Share that link with friends — it works on phone and desktop.

Every push to `main` will auto-update the live site.

---

## Install as an app (PWA)

Friends can add VocabQuest to their home screen like a native app:

### Android (Chrome)
1. Open the shared link in Chrome.
2. Tap the menu (⋮) → **Install app** or **Add to Home screen**.
3. Or use the **Install app** button inside the app (language / map screen).

### iPhone (Safari)
1. Open the link in **Safari** (not Chrome).
2. Tap **Share** (□↑).
3. Tap **Add to Home Screen**.
4. Confirm — the app icon appears on the home screen.

### Desktop (Chrome / Edge)
1. Open the site.
2. Click the install icon in the address bar (⊕ or computer icon).
3. Or use **Install app** in the in-app banner.

---

## Local preview (your computer)

```bash
npm install
npm run build
npm start
```

Open `http://localhost:3000`

---

## Environment variable (optional)

After deploy, in Vercel → Project → Settings → Environment Variables:

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_APP_URL` | Your Vercel URL (e.g. `https://vocabulary-proj.vercel.app`) |

This improves link previews when sharing on WhatsApp / social media.

---

## Share message (copy & paste)

> Learn Korean, Japanese & French with VocabQuest 🌸  
> [YOUR-VERCEL-URL]  
> On iPhone: Safari → Share → Add to Home Screen  
> On Android: Chrome → Install app
