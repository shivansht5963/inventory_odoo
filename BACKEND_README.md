# Backend Setup - StockMaster API

## Prerequisites
- Python 3.10+
- pip

## Installation & Setup

```bash
# 1. Clone & navigate
git clone <repo-url>
cd inventory_odoo

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate      # Windows PowerShell

# 3. Install dependencies
pip install -r requirements.txt

# 4. Setup .env (copy .env.example)
cp .env.example .env

# 5. Migrate database
python manage.py migrate

# 6. Create superuser
python manage.py createsuperuser

# 7. Run server
python manage.py runserver
```

## Get JWT Token

```bash
# Register (create user)
curl -X POST http://localhost:8000/api/v1/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "testpass123",
    "password2": "testpass123",
    "first_name": "Test",
    "last_name": "User",
    "role": "staff"
  }'

# Login (get tokens)
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'

# Response:
{
  "success": true,
  "data": {
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {...}
  }
}
```

## Use Token in API Calls

```bash
# Get profile
curl -X GET http://localhost:8000/api/v1/users/me/ \
  -H "Authorization: Bearer {access_token}"

# Update profile
curl -X PUT http://localhost:8000/api/v1/users/me/ \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "NewName",
    "email": "newemail@example.com"
  }'

# Refresh token
curl -X POST http://localhost:8000/api/v1/auth/refresh/ \
  -H "Content-Type: application/json" \
  -d '{
    "refresh": "{refresh_token}"
  }'
```

## Run Tests

```bash
python manage.py test accounts
```

## API Endpoints

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/v1/auth/register/` | POST | ❌ | Register user |
| `/api/v1/auth/login/` | POST | ❌ | Login & get JWT |
| `/api/v1/auth/refresh/` | POST | ❌ | Refresh token |
| `/api/v1/users/me/` | GET | ✅ | Get profile |
| `/api/v1/users/me/` | PUT | ✅ | Update profile |

## Admin Panel

```
http://localhost:8000/admin/
```

## Troubleshooting

**Port 8000 already in use:**
```bash
python manage.py runserver 8001
```

**Database errors:**
```bash
python manage.py migrate --run-syncdb
```

**Need fresh database:**
```bash
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```
