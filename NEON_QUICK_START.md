# Quick Neon Setup (5 minutes)

## 1️⃣ Create Neon Account & Database

```
https://console.neon.tech → Sign up → Create project
```

## 2️⃣ Copy Connection String

In Neon Console:
```
Connection string → Copy the "Connection string" (with password)
```

Example:
```
postgresql://neon_user:abcd1234@ep-cool-rain-123456.neon.tech/gloriya_hr?sslmode=require
```

## 3️⃣ Update Backend .env

**Option A: Using setup script (easiest)**
```bash
cd backend
bash setup-neon.sh
# Paste connection string when prompted
```

**Option B: Manual setup**
```bash
cd backend
cp .env.example .env
```

Edit `.env` and set:
```env
DATABASE_URL=postgresql://...your-connection-string...
```

## 4️⃣ Install & Run

```bash
npm install
npm run db:seed
npm run dev
```

## ✅ Verify

You should see:
```
✅ Database connected
✅ Tables created
🚀 Server running on http://localhost:5000
```

## 🎯 That's it!

Your backend is now connected to Neon PostgreSQL!

---

## Need Help?

- **Read full guide:** See `NEON_SETUP.md`
- **Neon Docs:** https://neon.tech/docs
- **Check logs:** `npm run dev` (verbose output)

## Switch Between Neon & Local

To use **local PostgreSQL** instead of Neon, edit `.env`:

```env
# Comment out this:
# DATABASE_URL=...

# Uncomment these:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gloriya_hr
DB_USER=postgres
DB_PASSWORD=postgres
```

Then create local database:
```bash
createdb gloriya_hr
npm run db:seed
```
