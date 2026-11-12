# Smart Restaurant – Restaurant Management & Online Ordering Platform

A complete, interactive frontend application: a customer-facing restaurant website with cart, checkout and WhatsApp ordering, plus a separate admin dashboard for managing products, orders, customers, analytics and settings. All data persists in the browser (LocalStorage) and ships with realistic demo data.

**Stack:** React 18 · Vite · Tailwind CSS · React Router · Recharts · Lucide React · LocalStorage

---

## Demo admin login

| Field    | Value                  |
| -------- | ---------------------- |
| URL      | `/admin/login`         |
| Email    | `admin@restaurant.com` |
| Password | `Admin123`             |

> **Demo authentication only.** Credentials are hard-coded and checked in the browser, and the session flag is kept in LocalStorage. This is **not production-grade security**. A real deployment needs a backend with hashed passwords, secure sessions/JWT and server-side authorization.

---

## Run locally

Requirements: **Node.js 18+** and npm.

```bash
npm install
npm run dev        # http://localhost:5173
```

Other commands:

```bash
npm run build      # production build into dist/
npm run preview    # serve the production build at http://localhost:4173
npm test           # run the integration test suite (Vitest + Testing Library)
```

The first time the app loads it seeds demo data into LocalStorage. To restore the original data at any time, go to **Admin → Settings → Reset demo data**.

---

## Implemented features

### Customer website
- **Home:** hero with CTAs, intro/benefits, popular categories (link into the filtered menu), featured dishes, testimonials, opening hours (from settings), contact info, WhatsApp call-to-action.
- **Menu:** category filter pills (synced with the URL), debounced search, product cards with image/illustration, description, price, add-to-cart, "Unavailable" state, empty state.
- **Cart:** add/remove items, increase/decrease quantity, subtotal, delivery fee, total, clear cart, persisted across reloads. Items deleted or marked unavailable by the admin disappear from the cart automatically.
- **Checkout:** name, phone, delivery address and notes with validation; order summary; **Confirm order**.
- **Order confirmation:** order number, status, items, totals, delivery details, notes, print button.
- **WhatsApp ordering:** "Order via WhatsApp" saves the order *and* opens `wa.me/<number>` with a formatted message (items, quantities, line prices, subtotal, delivery, total, customer name/phone/address, notes). The number is configurable in Settings. The confirmation page can re-send the message.

### Admin dashboard (sidebar layout, protected routes)
- **Overview:** total revenue, total orders, total products, total customers, average order value, 14-day revenue chart, 14-day orders chart, recent orders, best-selling products. Everything is computed from live data.
- **Products (full CRUD):** add, edit, delete (with confirmation), upload an image (auto-resized and compressed) or pick an emoji/colour illustration, price, category, description, available/unavailable toggle, "featured" flag, search, category filter, availability filter, form validation.
- **Orders:** search by order number / customer / phone, status tabs and filter, view full details, update status inline or in the detail dialog (Pending → Confirmed → Preparing → Out for Delivery → Completed, or Cancelled), message the customer on WhatsApp.
- **Customers:** name, phone, total orders, total spending, last order, search, order-history dialog. New checkouts create or update customers by phone number.
- **Analytics:** today / this week / this month / total sales; revenue trend with Daily / Weekly / Monthly views; order distribution by status; revenue by category; best-selling products chart. All charts are Recharts driven by real order data.
- **Settings:** restaurant name, logo upload, contact number, WhatsApp number, email, address, currency, delivery fee, opening hours per day (with closed days and time validation), reset demo data.

### Quality
- Fully responsive (mobile, tablet, desktop); no horizontal overflow; mobile menu and drawer sidebar.
- Every form validated with inline error messages; toasts for feedback; confirmation dialogs for destructive actions.
- No external images are needed: products without an uploaded photo get a generated illustration, so nothing is ever broken or missing.
- Revenue figures exclude cancelled orders.

### Demo data
24 products across 6 categories, 48 orders (including live Pending/Confirmed/Preparing/Out for Delivery orders), 10 customers, all with realistic names, descriptions and prices (currency: EGP).

---

## Project structure

```
src/
  assets/        Static assets (logo)
  components/    Reusable UI (Modal, ProductCard, StatCard, StatusBadge, ...)
  data/          Demo data and generators
  hooks/         useStore (state + LocalStorage), useAuth, useToast, useDebounce
  layouts/       CustomerLayout, AdminLayout
  pages/
    customer/    Home, Menu, Cart, Checkout, OrderConfirmation
    admin/       AdminLogin, Dashboard, Products, Orders, Customers, Analytics, Settings
  utils/         Formatting, analytics maths, WhatsApp builder, storage, image resize
tests/           Integration tests covering every page and flow
```

---

## Deploy online

The app is a static single-page app, so any static host works. Build output goes to `dist/`. Because it uses client-side routing, the host must rewrite all paths to `index.html` (configs for Netlify and Vercel are included).

**Vercel**
1. Push the project to GitHub.
2. In Vercel choose *Add New → Project*, import the repo. The framework is detected as Vite (build command `npm run build`, output `dist`).
3. Deploy. `vercel.json` already contains the SPA rewrite.

**Netlify**
1. Push to GitHub and choose *Add new site → Import an existing project*.
2. Build command `npm run build`, publish directory `dist`.
3. `public/_redirects` handles the SPA rewrite.
   (Or drag the `dist/` folder onto https://app.netlify.com/drop after running `npm run build`.)

**GitHub Pages / other static hosts**
Run `npm run build` and upload `dist/`. On hosts without rewrite rules, switch `BrowserRouter` to `HashRouter` in `src/App.jsx` so deep links work.

## Going to production

This is a front-end demo. To run a real restaurant on it you would add: a backend/API and database (orders, products, customers), real authentication, image storage (S3/Cloudinary), payment integration, and server-side order notifications. The state layer in `src/hooks/useStore.jsx` is the single place to swap LocalStorage for API calls.
