# Render Deployment Guide - Inventory Backend (SQLite)

## Overview
Deploy your Django backend on Render.com using SQLite database - Perfect for hackathon!

---

## Prerequisites
✅ GitHub account with your code pushed  
✅ Render.com free account  
✅ Code ready to deploy

---

## Step 1: Push Code to GitHub

```bash
# Navigate to your project
cd inventory_odoo

# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Render deployment"

# Push to GitHub (replace YOUR_USERNAME and repo name)
git remote add origin https://github.com/YOUR_USERNAME/inventory_odoo.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to Render

### 2.1 Create Web Service

1. Go to **[render.com](https://render.com)** → Sign In
2. Click **"New +"** → Select **"Web Service"**
3. Click **"Connect your own repository"** → Authorize GitHub
4. Select your `inventory_odoo` repository

### 2.2 Configure Service

Fill in these details:

```
Name: inventory-backend
Environment: Python 3
Region: Choose closest to you
Branch: main

Build Command:
pip install -r requirements.txt && python manage.py migrate --noinput && python manage.py collectstatic --noinput

Start Command:
gunicorn inventory_project.wsgi:application

Plan: Free
```

### 2.3 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these 3 variables:

```
DEBUG = True

SECRET_KEY = (Generate using: python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())")

ALLOWED_HOSTS = inventory-backend.onrender.com,localhost,127.0.0.1
```

Click **"Create Web Service"**

---

## Step 3: Monitor Deployment

1. Watch the **Logs** tab
2. Wait for: `"Your service is live"`
3. Note your URL: `https://inventory-backend.onrender.com`

---

## Step 4: Create Admin User

Once deployed:

1. Go to your Web Service dashboard
2. Click **"Shell"** tab
3. Run:
   ```bash
   python manage.py createsuperuser
   ```
4. Follow prompts to create admin account

---

## Step 5: Test Your API

```bash
# Test if API is running
curl https://inventory-backend.onrender.com/api/v1/auth/login/

# Should return 400 error (that's OK - means API is live!)
```

---

## Environment Variables Explained

| Variable | Value | Why |
|----------|-------|-----|
| `DEBUG` | `True` | For development/testing |
| `SECRET_KEY` | Random string | Keep Django secure |
| `ALLOWED_HOSTS` | Your domain + localhost | Allow access |

---

## How SQLite Works on Render

✅ **db.sqlite3** stays in your project  
✅ Database automatically created on first deploy  
✅ Data persists between deployments  
✅ Perfect for hackathon/testing

⚠️ **Note:** SQLite is single-user, good for dev. For production, upgrade to PostgreSQL.

---

## Connecting Your Frontend

Update your frontend API URL:

```javascript
// React or Next.js
const API_URL = 'https://inventory-backend.onrender.com';

// Use in API calls
fetch(`${API_URL}/api/v1/auth/login/`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(credentials)
})
```

---

## Troubleshooting

### Service Won't Start
- Check logs in Render dashboard
- Ensure `gunicorn` is in requirements.txt ✅
- Verify Build Command runs successfully

### Database Not Found
- Run migrations in Shell: `python manage.py migrate`
- Check db.sqlite3 exists in project root

### 502 Bad Gateway
- Check Logs tab for errors
- Restart service: Settings → Manual Restart

### API Returning 404
- Verify your API URLs in `urls.py`
- Check ALLOWED_HOSTS includes render domain

---

## Auto Deploy

✅ Every push to `main` branch auto-deploys to Render  
❌ To disable: Settings → Toggle "Auto-Deploy"

---

## Commands in Render Shell

```bash
# Check status
python manage.py shell

# Run migrations
python manage.py migrate

# Create admin
python manage.py createsuperuser

# View logs
tail -f events.log

# Check Python version
python --version
```

---

## Quick Reference

| Item | Value |
|------|-------|
| **Live URL** | https://inventory-backend.onrender.com |
| **Admin Panel** | https://inventory-backend.onrender.com/admin/ |
| **Login Endpoint** | https://inventory-backend.onrender.com/api/v1/auth/login/ |
| **Database** | db.sqlite3 (in project) |

---

## Next Steps Checklist

- [ ] Push code to GitHub
- [ ] Create Web Service on Render
- [ ] Add 3 environment variables
- [ ] Monitor deployment logs
- [ ] Create superuser via Shell
- [ ] Test API endpoints
- [ ] Connect frontend to API

---

**Good luck with your hackathon! 🚀**

Created: November 22, 2025  
Django: 5.0+  
Database: SQLite3
