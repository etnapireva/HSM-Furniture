# HSM Furniture

Full-stack furniture shop: React storefront, Express API, MongoDB products/users, optional MySQL orders.''

Live shop: https://hsm-furniture-epmo-r6ovzn3og-etnas-projects.vercel.app/
API: https://hsm-furniture.onrender.com
Demo login: demo@hsm.shop / Demo1234!

## Local setup

### 1. API

```bash
cd backend
cp .env.example .env
npm install
npm start
```

Required in `backend/.env`:

- `MONGO_URI`
- `JWT_SECRET`
- `CORS_ORIGIN` (comma-separated shop/admin URLs)

If `MYSQL_HOST` / `MYSQL_USER` / `MYSQL_DATABASE` are set, checkout writes to MySQL. If they are empty or MySQL is down, orders are saved in Mongo so the shop still works.

Health check: `GET http://localhost:4001/health`

### 2. Shop

```bash
cd frontend
cp .env.example .env
npm install
npm start
```

`REACT_APP_API_URL` must match the API (default `http://localhost:4001`). Restart the shop after changing it.

### Demo catalog

The API seeds 9 products and a demo user the first time the catalog is empty.

```bash
cd backend
npm run seed
```

Demo login: `demo@hsm.shop` / `Demo1234!`

## Deploy (portfolio demo)

1. **Rotate secrets first.** Atlas password and `JWT_SECRET` were previously in source. Change them in Atlas and put only the new values in host env vars. Never commit `.env`.
2. **API** on Render or Railway:
   - Root directory: `backend`
   - Start command: `npm start`
   - Env: `MONGO_URI`, `JWT_SECRET`, `CORS_ORIGIN=https://your-shop.vercel.app`
   - Leave MySQL empty unless you add a hosted MySQL instance
3. **Shop** on Vercel or Netlify:
   - Root directory: `frontend`
   - Env: `REACT_APP_API_URL=https://your-api.onrender.com`
4. Confirm `https://your-api.onrender.com/health` returns `"ok": true`, then open the shop: browse, log in with the demo account, add to cart, checkout.

`render.yaml` and `frontend/vercel.json` are ready. After the shop URL exists, set `CORS_ORIGIN` on the API to that URL.

Admin can stay local for the first live demo. Seeded products use hosted image URLs, so they survive a host restart.

## What this deploy prep changed

- One API process. Do not run `db.js` as a second server.
- Shop and admin read the API URL from env instead of `localhost`.
- Checkout no longer dies when local MySQL is missing.
