#!/usr/bin/env bash
# ==============================================================================
# DELIGHT WATER SHOP - 1-LINE DEPLOYMENT SCRIPT
# ==============================================================================
# Usage:
#   curl -sSL https://raw.githubusercontent.com/MaheshBroDev/DelightWaterShop/arena/019fb47a-delightwatershop/deploy.sh | bash
# ==============================================================================

set -e

echo "💧 ======================================================================"
echo "💧 Starting Delight Water Shop + Self-Hosted Supabase 1-Line Deployment..."
echo "💧 ======================================================================"

# Check prerequisites
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed. Please install Docker first." >&2
    exit 1
fi

if ! docker compose version &> /dev/null; then
    echo "❌ Error: Docker Compose is not installed or out of date." >&2
    exit 1
fi

# Clone or verify repository
if [ ! -d "DelightWaterShop" ]; then
    echo "📥 Cloning Delight Water Shop repository..."
    git clone https://github.com/MaheshBroDev/DelightWaterShop.git DelightWaterShop
    cd DelightWaterShop
    git checkout arena/019fb47a-delightwatershop
else
    cd DelightWaterShop
    git pull origin arena/019fb47a-delightwatershop || true
fi

# Setup Environment Files
echo "⚙️ Configuring environment variables..."
if [ ! -f "supabase/.env" ]; then
    cp supabase/.env.example supabase/.env
    echo "⚠️ Generated supabase/.env from template."
fi

if [ ! -f ".env.production" ]; then
    cp .env.example .env.production 2>/dev/null || true
    echo "⚠️ Generated .env.production."
fi

# Build and Start Services
echo "🚀 Building and launching containers (App + Supabase Stack)..."
docker compose up --build -d

echo ""
echo "🎉 ======================================================================"
echo "🎉 Delight Water Shop successfully deployed!"
echo "🎉 ======================================================================"
echo "🌐 Web Application:         http://localhost:3001"
echo "🎛️ Supabase Studio (Admin): http://localhost:3000"
echo "🔌 Kong API Gateway:        http://localhost:8000"
echo "🗄️ PostgreSQL Database:     localhost:5432"
echo "========================================================================"
