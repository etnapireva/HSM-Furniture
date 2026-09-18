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



