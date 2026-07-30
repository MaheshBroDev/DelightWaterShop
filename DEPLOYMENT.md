# Delight Water Shop - Comprehensive Deployment Guide

Welcome to the official deployment and self-hosting guide for **Delight Water Shop**. This document covers complete instructions for setting up the application and running a **Self-Hosted Supabase** instance using Docker Compose and modern build tools.

---

## 🏗️ Architecture Overview

Delight Water Shop is a modern e-commerce web application backed by **Supabase** for authentication, database management (PostgreSQL), realtime subscriptions, and file storage.

```
                  ┌──────────────────────┐
                  │    Client Browser    │
                  └──────────┬───────────┘
                             │ HTTPS / HTTP
                             ▼
                  ┌──────────────────────┐
                  │  Nginx / Reverse Proxy│
                  └──────────┬───────────┘
            ┌────────────────┴────────────────┐
            ▼                                 ▼
   ┌─────────────────┐               ┌─────────────────┐
   │ Delight App     │               │  Supabase Kong  │
   │ (Next.js / Node)│               │   (API Gateway) │
   └─────────────────┘               └────────┬────────┘
                                              │
                      ┌───────────────────────┼───────────────────────┐
                      ▼                       ▼                       ▼
               ┌─────────────┐         ┌─────────────┐         ┌─────────────┐
               │ GoTrue Auth │         │  PostgREST  │         │ Storage API │
               └──────┬──────┘         └──────┬──────┘         └──────┬──────┘
                      │                       │                       │
                      └───────────────────────┼───────────────────────┘
                                              ▼
                                     ┌─────────────────┐
                                     │  PostgreSQL 15  │
                                     └─────────────────┘
```

---

## 📋 Prerequisites

Before you begin deployment, ensure your server or local machine has the following tools installed:
- **Docker** (v20.10+)
- **Docker Compose** (v2.0+)
- **Node.js** (v18+ LTS, optional for local builds)
- **Git**

---

## 🚀 Part 1: Self-Hosting Supabase with Docker Compose

Supabase provides the backend database, authentication, API, and storage services. All configuration files are located in the `supabase/` directory.

### 1. Configure Environment Variables
Navigate to the Supabase directory and copy the example environment file:

```bash
cd supabase
cp .env.example .env
```

Edit `.env` and fill in secure production secrets:
```env
POSTGRES_PASSWORD=your_secure_postgres_password_here
JWT_SECRET=your_super_secret_jwt_token_min_32_characters_long
ANON_KEY=your_generated_anon_jwt_token
SERVICE_ROLE_KEY=your_generated_service_role_jwt_token
DASHBOARD_PASSWORD=your_secure_dashboard_password
```

> **Tip for JWT Keys:** You can generate secure JWT tokens using [jwt.io](https://jwt.io/) or the Supabase CLI using your `JWT_SECRET`.

### 2. Start Supabase Services
From the `supabase/` directory, spin up the stack in detached mode:

```bash
docker compose up -d
```

Verify that all containers are healthy and running:
```bash
docker compose ps
```

### 3. Access Supabase Studio (Dashboard)
Open your browser and navigate to:
- **URL:** `http://localhost:3000` (or `http://your-server-ip:3000`)
- **Username:** `admin` (or configured `DASHBOARD_USERNAME`)
- **Password:** The `DASHBOARD_PASSWORD` set in your `.env` file.

From Supabase Studio, you can manage database tables, SQL queries, authentication policies (RLS), and storage buckets.

---

## 🛠️ Part 2: Building & Deploying Delight Water Shop App

### 1. Configure Application Environment
Create your production environment configuration for the web app:

```bash
# In project root
cp .env.example .env.production
```

Key environment variables required:
```env
NODE_ENV=production
PORT=3001
NEXT_PUBLIC_SUPABASE_URL=http://localhost:8100
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 2. Building with Docker
You can run the entire stack (Supabase + Delight Water Shop App) using the root `docker-compose.yml`:

```bash
# Build and start all services
docker compose up --build -d
```

This will:
1. Build the Delight Water Shop web application container using the multi-stage `Dockerfile`.
2. Start the PostgreSQL database and Kong API Gateway.
3. Expose the web application on host port `3100` and the Supabase API (Kong) on host port `8100` (container-internal ports remain `3001` and `8000`).

---

## ⚙️ Part 3: Other Build Tools & CI/CD Automation

### Local Development Build
To run the app locally without Docker for development:
```bash
npm install
npm run dev
```

### Production Build Verification
To test the production build locally:
```bash
npm run build
npm start
```

### GitHub Actions CI/CD Pipeline (Recommended)
Create `.github/workflows/deploy.yml` for automated building and deployment:

```yaml
name: Deploy Delight Water Shop

on:
  push:
    branches: [ main, arena/* ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
```

---

## 🔒 Part 4: Production Best Practices & Security

1. **Reverse Proxy (Nginx / Caddy / Traefik):**
   Place an Nginx or Caddy reverse proxy in front of Kong (`8100`) and the App (`3100`) to handle SSL/TLS certificates (Let's Encrypt) and HTTP/2.

2. **Database Backups:**
   Set up automated cron jobs to backup the PostgreSQL database:
   ```bash
   docker exec -t delight-supabase-db pg_dump -U postgres postgres > backup_$(date +%Y%m%d).sql
   ```

3. **Firewall Rules:**
   Ensure ports `5432` (Postgres) and internal container ports are blocked from external public access. Only expose ports `80`, `443` (via reverse proxy), `3000` (Studio, protected by auth), `8100` (Kong API), and `3100` (App).

---

## 📞 Support & Troubleshooting

- **Database Connection Issues:** Check container logs using `docker compose logs db`.
- **Kong Gateway Errors:** Verify `supabase/volumes/kong/kong.yml` route mappings.
- **Port Conflicts:** The app and gateway host ports can be changed without editing any files — set `APP_PORT`, `KONG_HTTP_PORT`, and `KONG_HTTPS_PORT` before running `docker compose` (defaults: `3100`, `8100`, `8543`). If the Supabase stack's own ports (`3000` Studio, `5432` Postgres) conflict, adjust `supabase/docker-compose.yml` / `supabase/.env`.
