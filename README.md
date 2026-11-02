# My Recovery Journey

Personal recovery website by Steven Gregory — story, practical tools, journal, articles, faith resources, and links to trusted support.

**Live site (after you enable GitHub Pages):**  
`https://YOUR_USERNAME.github.io/my-recovery-journey/`

---

## What’s included

- **Home** — clear entry point with story highlight and paths to tools/resources
- **My Story** — more specific personal narrative
- **Recovery Tools** (private, local-only storage)
  - Gratitude journal with save / export
  - Milestone day counter
  - Daily reflection
  - 5-4-3-2-1 grounding exercise
  - “Next right step” checklist (persists across reloads)
- **Journal** — recovery reflections
- **Articles** — practical encouragement
- **Resources** — AA, NA, SAMHSA, 988, Al-Anon
- **Faith** — Scripture and reflections, open to all beliefs
- Clear “Coming soon” labels for planned community features
- Mobile-friendly navigation and crisis access

All tool data stays in the visitor’s browser (localStorage). Nothing is sent to a server.

---

## How to publish on GitHub Pages

1. Create a **new** repository on GitHub (e.g. `my-recovery-journey`).
2. Upload all files from this folder (keep the folder structure: `css/`, `js/`, HTML files at the root).
3. In the repo: **Settings → Pages**.
4. Under “Source”, choose **Deploy from a branch**.
5. Select branch `main` (or `master`) and folder `/ (root)`.
6. Save. Your site will be available at:  
   `https://YOUR_USERNAME.github.io/my-recovery-journey/`

Or use Git locally:

```bash
git init
git add .
git commit -m "Initial improved My Recovery Journey site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/my-recovery-journey.git
git push -u origin main
```

Then enable Pages as above.

---

## Local preview

Open `index.html` in a browser, or run a simple local server:

```bash
# Python
python3 -m http.server 8080

# Node
npx serve .
```

Then visit `http://localhost:8080`.

---

## Customization notes

- Story content is in `my-journey.html` and the home page.
- Journal entries are in `journal.html`.
- Reflections list is in `js/main.js` (array near the bottom).
- Colors and layout are in `css/styles.css`.

---

© 2026 Steven Gregory · Not medical advice or emergency services.  
In crisis in the U.S.: call or text 988.
