# Neon PostgreSQL Setup Guide

## What is Neon?

Neon is a serverless PostgreSQL database platform. It's perfect for development and production use with:
- Free tier (up to 3 projects)
- Auto-scaling
- Branching capabilities
- Automatic backups
- No credit card required for free tier

## Step 1: Create Neon Account

1. Go to https://console.neon.tech
2. Sign up with GitHub or Email
3. Create a new project

## Step 2: Get Connection String

1. In Neon Console, select your project
2. Go to "Connection string" tab
3. Copy the connection string (should look like):
```
postgresql://user:password@ep-xyz.neon.tech/gloriya_hr?sslmode=require
```

## Step 3: Update Backend .env

Create `.env` file in backend directory:

```bash
cp .env.example .env
```

Update with your Neon connection string:

```env
PORT=5000
NODE_ENV=development

# Neon PostgreSQL Connection
DATABASE_URL=postgresql://user:password@ep-xyz.neon.tech/gloriya_hr?sslmode=require

JWT_SECRET=your_secret_key_here
JWT_EXPIRY=30m

FRONTEND_URL=http://localhost:5173
```

## Step 4: Install Dependencies & Seed

```bash
cd backend

# Install dependencies
npm install

# Seed database (creates tables and demo data)
npm run db:seed

# Start server
npm run dev
```

## Step 5: Verify Connection

You should see:
```
✅ Database connected: { now: '2026-01-10T...' }
📝 Creating tables...
✅ Tables created successfully
✅ Users seeded
✅ Employees seeded
🎉 Database seeding completed
🚀 Server running on http://localhost:5000
```

## Troubleshooting

### Connection Timeout
- Make sure SSL mode is enabled in connection string: `?sslmode=require`
- Neon requires SSL connections

### "Tables already exist" Error
- This is normal! Just means tables were already created
- Skip seeding if you want to keep existing data

### Can't find DATABASE_URL
- Make sure `.env` file is in backend root directory
- Restart the dev server after updating `.env`

## Local Development Alternative

If you want to use local PostgreSQL instead:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gloriya_hr
DB_USER=postgres
DB_PASSWORD=your_password
```

## Neon Dashboard Features

In Neon Console you can:
- 📊 View query logs
- 🔄 Branch databases for testing
- ⚙️ Manage roles and permissions
- 📈 Monitor resource usage
- 🔐 Manage backups

## Production Deployment

When deploying to production (e.g., Vercel, Heroku):

1. Set `DATABASE_URL` environment variable
2. Set `JWT_SECRET` to a strong value
3. Set `NODE_ENV=production`
4. Set `FRONTEND_URL` to your production domain

Example for Vercel:
```
DATABASE_URL=postgresql://...@neon.tech/...
JWT_SECRET=super_secret_key
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
```

## Free Tier Limits

- 3 projects
- 3 GB storage per project
- Shared compute
- Auto-pause (goes to sleep after 5 mins of inactivity)

Perfect for development! Upgrade as needed.

## Support

- Neon Docs: https://neon.tech/docs
- Community: https://neon.tech/community
