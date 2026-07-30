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
#
# Both "main" and "production" branches are supported (production mirrors main).
# ==============================================================================

set -e

REPO_URL="https://github.com/MaheshBroDev/DelightWaterShop.git"

# Normalize DEPLOY_BRANCH - default to main, handle empty or placeholder values
DEPLOY_BRANCH="${DEPLOY_BRANCH:-main}"
# Trim whitespace
DEPLOY_BRANCH="$(echo "$DEPLOY_BRANCH" | xargs)"
# If user copy-pasted the placeholder literal "<branch>" or empty, fallback to main
if [ -z "$DEPLOY_BRANCH" ] || [ "$DEPLOY_BRANCH" = "<branch>" ] || [ "$DEPLOY_BRANCH" = "&lt;branch&gt;" ]; then
    DEPLOY_BRANCH="main"
fi

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

if ! command -v git &> /dev/null; then
    echo "❌ Error: git is not installed. Please install git first." >&2
    exit 1
fi

# Helper: check if branch exists on remote
branch_exists_remote() {
    git ls-remote --exit-code --heads "$REPO_URL" "$1" > /dev/null 2>&1
}

# Verify the deployment branch exists on the remote before touching anything
echo "🔎 Verifying branch '$DEPLOY_BRANCH' exists on GitHub..."

if ! branch_exists_remote "$DEPLOY_BRANCH"; then
    # Auto-fallback logic: if production was requested but missing, use main
    if [ "$DEPLOY_BRANCH" = "production" ]; then
        echo "⚠️  Branch 'production' not found on remote."
        if branch_exists_remote "main"; then
            echo "⚠️  Falling back to 'main' branch (production mirrors main)."
            DEPLOY_BRANCH="main"
        else
            echo "❌ Error: Neither 'production' nor 'main' exist on github.com/MaheshBroDev/DelightWaterShop." >&2
            exit 1
        fi
    else
        # For any other missing branch, try to fallback to main with warning, or error
        echo "❌ Error: branch '$DEPLOY_BRANCH' does not exist on github.com/MaheshBroDev/DelightWaterShop." >&2
        if [ "$DEPLOY_BRANCH" != "main" ] && branch_exists_remote "main"; then
            echo "   Available fallback: 'main' exists. Retrying with 'main'..." >&2
            echo "   To fix: use DEPLOY_BRANCH=main or create the branch:" >&2
            echo "     git push origin main:$DEPLOY_BRANCH" >&2
            # Auto fallback to main if original branch missing but main exists
            echo "⚠️  Falling back to 'main' branch."
            DEPLOY_BRANCH="main"
        else
            echo "   Create it first, e.g.:  git push origin main:$DEPLOY_BRANCH" >&2
            echo "   Or deploy a different branch:" >&2
            echo "   curl -sSL https://raw.githubusercontent.com/MaheshBroDev/DelightWaterShop/main/deploy.sh | DEPLOY_BRANCH=<branch> bash" >&2
            exit 1
        fi
    fi
fi

echo "✅ Branch '$DEPLOY_BRANCH' verified (will deploy)."

# Clone or update repository
if [ ! -d "DelightWaterShop" ]; then
    echo "📥 Cloning Delight Water Shop repository (branch: $DEPLOY_BRANCH)..."
    git clone --branch "$DEPLOY_BRANCH" "$REPO_URL" DelightWaterShop
    cd DelightWaterShop
else
    cd DelightWaterShop
    echo "🔄 Switching existing clone to '$DEPLOY_BRANCH' and updating..."
    git fetch origin
    # Create local branch if missing, or checkout existing
    if git show-ref --verify --quiet "refs/heads/$DEPLOY_BRANCH"; then
        git checkout "$DEPLOY_BRANCH"
    else
        git checkout -B "$DEPLOY_BRANCH" "origin/$DEPLOY_BRANCH"
    fi
    git pull origin "$DEPLOY_BRANCH"
fi

# Setup Environment Files
echo "⚙️ Configuring environment variables..."
if [ ! -f "supabase/.env" ]; then
    if [ -f "supabase/.env.example" ]; then
        cp supabase/.env.example supabase/.env
        echo "⚠️ Generated supabase/.env from template - PLEASE EDIT SECRETS!"
    else
        echo "⚠️ supabase/.env.example not found, skipping."
    fi
fi

if [ ! -f ".env.production" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env.production
        echo "⚠️ Generated .env.production from template."
    else
        echo "⚠️ .env.example not found, creating empty .env.production."
        touch .env.production
    fi
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
echo "💡 Both 'main' and 'production' branches are supported."
echo "   To redeploy production explicitly: DEPLOY_BRANCH=production bash deploy.sh"
