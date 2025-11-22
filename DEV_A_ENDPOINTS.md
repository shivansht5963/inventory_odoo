# Dev A (Shivansh) - Work Definition

## Your Job: User Authentication & Shared Infrastructure

### 1. Implement 5 JWT Auth Endpoints
```
POST   /api/v1/auth/register/     → CustomUserSerializer + create user + hash password
POST   /api/v1/auth/login/        → Validate credentials + issue JWT access + refresh tokens
POST   /api/v1/auth/refresh/      → Validate refresh token + issue new access token
GET    /api/v1/users/me/          → Return authenticated user profile
PUT    /api/v1/users/me/          → Update authenticated user (name, email, etc)
```

### 2. Setup Shared Infrastructure
- **DRF Config:** `DEFAULT_AUTHENTICATION_CLASSES = JWTAuthentication`
- **JWT Config:** SimpleJWT (access=15min, refresh=7days, HS256)
- **CORS Setup:** Allow frontend origins (localhost:3000, 5173)
- **Installed Apps:** corsheaders, rest_framework, rest_framework_simplejwt, drf_spectacular
- **Permissions:** Default IsAuthenticated on all endpoints (except /auth/register, /auth/login)

### 3. OpenAPI Schema
- Setup drf_spectacular
- Expose `/api/schema/` endpoint for API documentation
- Generate Swagger UI `/api/docs/swagger/`

### 4. Write 2 Tests
- Test: User registration works → 201 response + user created
- Test: Login returns JWT tokens → access + refresh tokens valid

### 5. Documentation
- Create `.env.example` with JWT secrets + database config
- Create `README.md` with setup commands
- Document how to get JWT token (register → login → get access token)

---

**Tech Stack:** Django + DRF + SimpleJWT + CORS + drf_spectacular
**Models:** User (AbstractUser extended with UUID + role field)
**Deliverable:** Working auth system + other devs can call protected APIs with Bearer token
