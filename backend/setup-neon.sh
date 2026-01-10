#!/bin/bash

echo "🚀 Gloriya HR Analytics - Neon Setup Script"
echo "==========================================="
echo ""
echo "This script will help you set up Neon PostgreSQL connection"
echo ""
echo "IMPORTANT:"
echo "1. Go to https://console.neon.tech"
echo "2. Create a new project"
echo "3. Copy your connection string"
echo ""
echo "It should look like:"
echo "postgresql://user:password@ep-xyz.neon.tech/gloriya_hr?sslmode=require"
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists"
    read -p "Do you want to overwrite it? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Skipping .env creation"
        exit 1
    fi
fi

# Get connection string from user
read -p "Paste your Neon connection string: " CONNECTION_STRING

# Create .env file
cat > .env << EOF
PORT=5000
NODE_ENV=development

# Neon PostgreSQL
DATABASE_URL=$CONNECTION_STRING

JWT_SECRET=gloriya_hr_secret_$(openssl rand -hex 16)
JWT_EXPIRY=30m

FRONTEND_URL=http://localhost:5173
EOF

echo ""
echo "✅ .env file created successfully!"
echo ""
echo "Next steps:"
echo "1. npm install"
echo "2. npm run db:seed"
echo "3. npm run dev"
echo ""
