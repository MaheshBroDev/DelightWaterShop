# Delight Water Shop

Delight Water Shop e-commerce platform and water purification service management application.

## 🚀 Quick Links

- **[Deployment Guide](DEPLOYMENT.md)** - Complete instructions for building, containerizing, and deploying the application.
- **[Supabase Self-Hosted Stack](supabase/)** - Docker Compose setup for running self-hosted Supabase (PostgreSQL, Kong, Auth, PostgREST, Realtime, Storage, Studio).

## 🛠️ Quick Start

1. **Self-Host Supabase:**
   ```bash
   cd supabase
   cp .env.example .env
   # Update passwords and JWT keys in .env
   docker compose up -d
   ```

2. **Run Application with Docker Compose:**
   ```bash
   cp .env.example .env.production
   docker compose up --build -d
   ```
