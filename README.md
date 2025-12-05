# Med Platform Backend

TypeScript/Express backend that powers the MedLink doctors & hospitals discovery frontend. It exposes REST APIs for authentication, providers, hospitals, jobs/careers, and the contact form, backed by PostgreSQL (Prisma) with Redis caching for heavy listing endpoints.

## Tech Stack

- Node.js 22+ with TypeScript
- Express 5, Helmet, CORS
- PostgreSQL + Prisma ORM
- Redis (ioredis) for caching doctor/hospital lists
- Zod validation + reusable middleware
- JWT auth with bcrypt password hashing
- Nodemailer email notifications
- Pino logging

## Project Structure

```
BE/
├── prisma/              # Prisma schema & migrations
├── src/
│   ├── auth/            # Auth controllers/services/routes/validators
│   ├── doctors/         # Doctors listing module + cache helpers
│   ├── hospitals/       # Hospital listing module + cache helpers
│   ├── jobs/            # Careers CRUD (admin-protected)
│   ├── contact/         # Contact form handler + email sending
│   ├── config/          # Env validation, Prisma, Redis clients
│   ├── middleware/      # Auth guard, validators, global error handlers
│   ├── redis/           # Redis helpers for cache get/set
│   ├── utils/           # Logger, JWT, pagination, password helpers
│   └── scripts/seed.ts  # Database seeding script
```

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Copy env template**
   ```bash
   cp .env.example .env
   ```
   Update database, Redis, JWT, and email credentials.
3. **Run Prisma migrations**
   ```bash
   npm run prisma:migrate -- --name init
   ```
4. **Seed sample data (optional)**
   ```bash
   npm run seed
   ```
5. **Start the API**
   ```bash
   npm run dev    # ts-node-dev with auto reload
   ```
   The server defaults to `http://localhost:4000`.

## NPM Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start dev server with ts-node-dev |
| `npm run build` | Type-check and emit JS into `dist/` |
| `npm run start` | Run compiled server (`dist/index.js`) |
| `npm run prisma:migrate` | Run Prisma migrations |
| `npm run prisma:generate` | Regenerate Prisma client |
| `npm run seed` | Seed demo data (users, hospitals, doctors, jobs) |
| `npm run lint` | ESLint over `src/` |

## API Overview

All routes are prefixed with `/api`.

- **Auth** (`/api/auth`) – register, login, refresh tokens (JWT, bcrypt hashing).
- **Doctors** (`/api/doctors`) – filter by specialization, city, sort & paginate. Cached in Redis.
- **Hospitals** (`/api/hospitals`) – filter by city/specialization, sort & paginate. Cached in Redis.
- **Jobs** (`/api/jobs`) – public listing + detail. Admin-protected create/update/delete (JWT + role guard).
- **Contact** (`/api/contact`) – validates message, stores in DB, sends email notification.

See the controller & validator files in each module for the accepted payloads and response DTOs.

## Development Notes

- Auth guard lives in `src/middleware/authGuard.ts`. Role-based guard (`requireRole`) is in `src/auth/auth.middleware.ts`.
- Validation is enforced via Zod schemas and the reusable `validateRequest` middleware.
- Doctors/hospitals services cache list responses with Redis for 60 seconds using normalized query keys.
- Logging is centralized through `src/utils/logger.ts` (Pino with pretty-print in development).

## Testing the APIs

```bash
# Doctors list with rating sort
curl "http://localhost:4000/api/doctors?specialization=Cardiology&city=San%20Francisco"

# Hospitals list
curl "http://localhost:4000/api/hospitals?city=Seattle"

# Jobs listing
curl "http://localhost:4000/api/jobs?department=Engineering"

# Contact form
curl -X POST http://localhost:4000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Abby","email":"abby@example.com","message":"Need help booking."}'
```

You're ready to integrate the MedLink frontend at `http://localhost:3000` with this backend service at `http://localhost:4000`.

