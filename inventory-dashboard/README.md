# Forma Inventory Studio

A minimalist inventory workspace with an editorial visual language, product management, stock filters, and activity history.

A multi-featured React SPA demonstrating modern component architecture, hooks mastery, and class component patterns.

## 🚀 Tech Stack
- **Vite** + **React 19** + **TailwindCSS v4**
- **LocalStorage** for persistence
- **React Context API** for theme management

## 📁 Project Structure
```
src/
  components/
    class/
      AuditLogger.jsx       ← Class component with lifecycle methods
    functional/
      ProductForm.jsx       ← Controlled form (useState, useEffect, useRef, useCallback)
      ProductList.jsx       ← Filtered grid (useMemo)
      ProductCard.jsx       ← Product card with stock badges
      CardWrapper.jsx       ← props.children container
  context/
    ThemeContext.jsx        ← Light/Dark mode context
  hooks/                   ← Reserved for custom hooks
  App.jsx                  ← Root component
```

## ▶️ Getting Started
```bash
npm install
npm run dev
```

## 🚀 Deploying to GitHub Pages

The GitHub Actions workflow at `../.github/workflows/deploy.yml` builds this app and deploys it to GitHub Pages whenever changes are pushed to `main`.

In the repository on GitHub, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**. The first deployment will then run automatically after the workflow is pushed, or can be started from the **Actions** tab with **Deploy to GitHub Pages → Run workflow**.

The site URL will be `https://Musamehar.github.io/inventory-dashboard/`.

---

## 📖 Task 6 — CSR vs SSR: Architectural Analysis

### How They Fundamentally Differ

**Client-Side Rendering (CSR)**, used in this Vite + React SPA, delivers a minimal HTML shell to the browser. The browser then downloads the JavaScript bundle, executes it, and React constructs the DOM entirely on the client. The server has no knowledge of the rendered output — it simply serves static files. The initial HTML arriving at the browser contains almost no visible content until JavaScript hydrates it.

**Server-Side Rendering (SSR)**, as implemented by frameworks like Next.js, executes React components on the server for each request (or at build time for Static Site Generation). The server sends fully-rendered HTML to the browser. JavaScript then "hydrates" the existing markup to attach event listeners, making it interactive. The key distinction is that the server participates actively in the rendering pipeline.

### Performance, SEO & Hosting Trade-offs

**Performance:** CSR suffers from a slower Time-to-Interactive (TTI) on initial load because the browser must download, parse, and execute the full JS bundle before anything is visible — resulting in a flash of empty content. SSR delivers content-rich HTML immediately, improving First Contentful Paint (FCP) and Largest Contentful Paint (LCP). However, for authenticated dashboards (like this inventory system), CSR's subsequent navigations are faster since no server round-trips are needed.

**SEO:** CSR is historically problematic for search engine crawlers because bots may not execute JavaScript, leaving them with blank pages. SSR delivers fully-rendered HTML, making all product data indexable. For a public-facing e-commerce storefront, SSR or SSG would be critical.

**Hosting:** CSR apps (like this one) can be hosted on any static CDN (Netlify, GitHub Pages, Vercel static) at near-zero cost, with no server compute needed. SSR requires a Node.js server or serverless functions, increasing infrastructure complexity and cost. For an internal inventory dashboard accessed by authenticated staff, CSR is optimal — removing SSR complexity without sacrificing any real SEO benefit.

**Conclusion:** For this inventory dashboard, CSR is the correct architectural choice. SSR would be more appropriate for the public product catalogue pages where SEO and initial load performance for unauthenticated users are critical.
