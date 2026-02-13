#!/bin/bash

echo "========================================"
echo "Smart Bookmark App - Setup Verification"
echo "========================================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "ERROR: .env.local file not found!"
    echo "Please create .env.local from .env.local.example"
    exit 1
fi

# Check environment variables
source .env.local

echo "Step 1: Checking environment variables..."
if [[ "$NEXT_PUBLIC_SUPABASE_URL" == *"your-project"* ]]; then
    echo "  [MISSING] NEXT_PUBLIC_SUPABASE_URL needs to be updated"
    ENV_OK=false
else
    echo "  [OK] NEXT_PUBLIC_SUPABASE_URL is set"
    ENV_OK=true
fi

if [[ "$NEXT_PUBLIC_SUPABASE_ANON_KEY" == *"your-anon-key"* ]]; then
    echo "  [MISSING] NEXT_PUBLIC_SUPABASE_ANON_KEY needs to be updated"
    ENV_OK=false
else
    echo "  [OK] NEXT_PUBLIC_SUPABASE_ANON_KEY is set"
fi

echo ""

# Check if node_modules exists
echo "Step 2: Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "  [OK] Dependencies installed"
else
    echo "  [MISSING] Run: npm install"
    exit 1
fi

echo ""

# Check if build works
echo "Step 3: Testing production build..."
if npm run build > /dev/null 2>&1; then
    echo "  [OK] Production build successful"
else
    echo "  [ERROR] Build failed. Run: npm run build"
    exit 1
fi

echo ""

# Summary
echo "========================================"
if [ "$ENV_OK" = true ]; then
    echo "Status: READY TO TEST"
    echo ""
    echo "To start testing:"
    echo "  1. Run: npm run dev"
    echo "  2. Open: http://localhost:3000"
    echo "  3. Click 'Get Started with Google'"
    echo "========================================"
else
    echo "Status: CONFIGURATION NEEDED"
    echo ""
    echo "Next steps:"
    echo "  1. Create Supabase project at https://supabase.com"
    echo "  2. Update .env.local with your credentials"
    echo "  3. Run this script again to verify"
    echo ""
    echo "See SUPABASE_SETUP.md for detailed instructions"
    echo "========================================"
fi
