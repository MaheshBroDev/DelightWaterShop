#!/usr/bin/env bash
# ==============================================================================
# DELIGHT WATER SHOP - 1-LINE DEPLOYMENT SCRIPT
# ==============================================================================
# Usage:
#   curl -sSL https://raw.githubusercontent.com/MaheshBroDev/DelightWaterShop/main/deploy.sh | bash
#
# This script deploys the repository's default "main" branch. To deploy a
# different branch, set DEPLOY_BRANCH:
#
#   curl -sSL https://raw.githubusercontent.com/MaheshBroDev/DelightWaterShop/main/deploy.sh | DEPLOY_BRANCH=<branch> bash
#
# Host ports can be overridden the same way:
#   APP_PORT (default 3100), KONG_HTTP_PORT (default 8100), KONG_HTTPS_PORT (default 8543)
# ==============================================================================

set -e

REPO_URL="https://github.com/MaheshBroDev/DelightWaterShop.git"
DEPLOY_BRANCH="${DEPLOY_BRANCH:-main}"

# Host ports published by docker-compose (container-internal ports are unchanged)
export APP_PORT="${APP_PORT:-3100}"
export KONG_HTTP_PORT="${KONG_HTTP_PORT:-8100}"
export KONG_HTTPS_PORT="${KONG_HTTPS_PORT:-8543}"

echo "💧 ======================================================================"
echo "💧 Starting Delight Water Shop + Self-Hosted Supabase 1-Line Deployment..."
echo "💧 Deploying branch: $DEPLOY_BRANCH"
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

# Verify the deployment branch exists on the remote before touching anything
echo "🔎 Verifying branch '$DEPLOY_BRANCH' exists on GitHub..."
if ! git ls-remote --exit-code --heads "$REPO_URL" "$DEPLOY_BRANCH" > /dev/null 2>&1; then
    echo "❌ Error: branch '$DEPLOY_BRANCH' does not exist on github.com/MaheshBroDev/DelightWaterShop." >&2
    echo "   Create it first, e.g.:  git push origin main:$DEPLOY_BRANCH" >&2
    echo "   Or deploy a different branch:" >&2
    echo "   curl -sSL https://raw.githubusercontent.com/MaheshBroDev/DelightWaterShop/main/deploy.sh | DEPLOY_BRANCH=<branch> bash" >&2
    exit 1
fi

# Clone or update repository
if [ ! -d "DelightWaterShop" ]; then
    echo "📥 Cloning Delight Water Shop repository (branch: $DEPLOY_BRANCH)..."
    git clone --branch "$DEPLOY_BRANCH" "$REPO_URL" DelightWaterShop
    cd DelightWaterShop
else
    cd DelightWaterShop
    echo "🔄 Switching existing clone to '$DEPLOY_BRANCH' and updating..."
    git fetch origin
    git checkout "$DEPLOY_BRANCH"
    git pull origin "$DEPLOY_BRANCH"
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
echo "🎉 Delight Water Shop successfully deployed! (branch: $DEPLOY_BRANCH)"
echo "🎉 ======================================================================"
echo "🌐 Web Application:  http://localhost:${APP_PORT}"
echo "🔌 Kong API Gateway: http://localhost:${KONG_HTTP_PORT} (HTTPS: ${KONG_HTTPS_PORT})"
echo "🗄️ PostgreSQL:       internal only (container 'delight-watershop-db')"
echo "========================================================================"
