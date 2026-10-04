# AdForecast Pro — ROI Advertising Campaign Calculator

A production-minded, real-time web application to calculate and predict advertising campaign ROI, revenue, and profitability margins for digital and e-commerce products. Built for the **Pressure Full Stack Developer Technical Test**.

---

## 1. Overview & Key Capabilities

- **Secure Session-Based Authentication**: Hashed passwords (Bcrypt 12 rounds), protected routes, CSRF verification, and authentication state that persists seamlessly across browser reloads.
- **Two-Way Synchronized Real-Time Calculator**: Sliders and numerical inputs share a single source of truth; updates compute immediately on the client side with zero network latency.
- **Strict Multi-Tenant Data Isolation**: Calculations are associated with the authenticated user ID on the server. User A can never query, inspect, or delete User B's saved calculations.
- **Dynamic Strategic Insights ("Wawasan Utama")**: Instant recommendations comparing Cost per Results against the 30% target benchmark and evaluating profitability.
- **Calculation History & Detail Inspection**: View saved projections with pagination, load saved values back into the active calculator, and inspect complete input parameters.
- **Docker Compose & Cloudflare Tunnel Deployment**: Containerized runtime with PostgreSQL 16, PHP 8.4-FPM, Nginx, and public access via Cloudflare Tunnel without opening inbound ports.

---

## 2. Tech Stack

- **Backend**: Laravel 12 (PHP 8.4), Laravel Fortify, Eloquent ORM, Pest PHP testing framework.
- **Frontend**: React 19, Inertia.js v3, TypeScript, Tailwind CSS v4, Lucide Icons, Sonner toasts.
- **Database**: PostgreSQL 16 (production), SQLite (in-memory for automated tests).
- **Deployment**: Docker Compose, Nginx, PHP 8.4-FPM, Cloudflare Tunnel (`cloudflared`).

---

## 3. Architecture & Data Flow

```text
Browser Client (React 19 / Inertia v3)
       │ (1. HTTPS Traffic)
       ▼
Cloudflare Edge Network (SSL / CDN / DDoS Shield)
       │ (2. Outbound Encrypted Tunnel)
       ▼
cloudflared Container (No inbound host ports required)
       │ (3. Internal Bridge Network)
       ▼
Nginx Reverse Proxy (:80)
   ├── Serves pre-compiled Vite static assets (/public/build)
   └── FastCGI Pass (:9000)
         ▼
Laravel Application (PHP 8.4-FPM)
   ├── Fortify Session Authentication & CSRF
   ├── CalculationService (Business Logic)
   └── Eloquent ORM
         ▼
PostgreSQL Database Container (:5432, Isolated Internal Network)
```

---

## 4. Business Logic & Mathematical Formulas

The complete mathematical derivation, research benchmarks, and edge cases are documented in [**`BUSINESS_LOGIC.md`**](./BUSINESS_LOGIC.md).

### Summary of Core Formulas:
1. **Jumlah Results (Conversions)**:
   $$\text{results} = \frac{\text{monthly\_ad\_spend}}{\text{cpr}}$$
2. **Pendapatan (Revenue)**:
   $$\text{revenue} = \text{results} \times \text{average\_order\_value}$$
3. **Keuntungan (Net Profit)**:
   $$\text{profit} = \text{revenue} - \text{monthly\_ad\_spend}$$
4. **Laba atas Investasi (ROI %)**:
   $$\text{roi\_percentage} = \frac{\text{profit}}{\text{monthly\_ad\_spend}} \times 100\%$$
5. **CPR Target (Benchmark)**:
   $$\text{cpr\_target} = 30\% \times \text{product\_price}$$
6. **Margin per Result**:
   $$\text{margin} = \text{average\_order\_value} - \text{cpr}$$

---

## 5. Local Development Setup

### Prerequisites
- PHP 8.4+
- Composer 2+
- Node.js 20+ & npm

### Installation Steps

1. Clone the repository and copy the environment file:
   ```bash
   git clone <repo-url>
   cd ads-roi-calculator
   cp .env.example .env
   ```

2. Install PHP and Node dependencies:
   ```bash
   composer install
   npm install
   ```

3. Generate application key:
   ```bash
   php artisan key:generate
   ```

4. Run database migrations:
   ```bash
   php artisan migrate
   ```

5. Build frontend assets and start servers:
   ```bash
   # In terminal 1 (Laravel backend)
   php artisan serve

   # In terminal 2 (Vite dev server)
   npm run dev
   ```

---

## 6. Docker & Production Deployment

### Production Deployment via Docker Compose

1. Prepare your production `.env` with a secure `APP_KEY`, PostgreSQL credentials, and Cloudflare Tunnel token:
   ```env
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://roi.yourdomain.com
   APP_KEY=base64:...

   DB_CONNECTION=pgsql
   DB_HOST=db
   DB_PORT=5432
   DB_DATABASE=ads_roi
   DB_USERNAME=postgres
   DB_PASSWORD=your_secure_password

   SESSION_DRIVER=database
   SESSION_SECURE_COOKIE=true

   CLOUDFLARE_TUNNEL_TOKEN=ey...
   ```

2. Build and start containers:
   ```bash
   docker compose -f docker-compose.prod.yml up -d --build
   ```

3. Run migrations inside the container:
   ```bash
   docker compose -f docker-compose.prod.yml exec app php artisan migrate --force
   ```

4. Optimize caches:
   ```bash
   docker compose -f docker-compose.prod.yml exec app php artisan optimize
   ```

---

## 7. Testing & Quality Assurance

Run the comprehensive Pest automated test suite (includes authentication, calculation accuracy, and cross-user data isolation tests):

```bash
# Run all Pest tests
php artisan test --compact

# Run specific test suites
php artisan test tests/Unit/CalculationServiceTest.php
php artisan test tests/Feature/CalculationApiTest.php
php artisan test tests/Feature/AuthApiTest.php

# Code styling & type checks
vendor/bin/pint --format agent
npm run types:check
npm run check
```

---

## 8. Presentation Deck

An 8-slide presentation deck covering the problem scope, architecture, business formulas, data isolation, and deployment has been compiled to:
📄 [**`presentation.pdf`**](./presentation.pdf)

To regenerate the presentation at any time:
```bash
npx tsx generate-presentation.ts
```

---

## 9. AI Copilot Assistance Disclosure

In accordance with the test guidelines:
- **AI Tooling**: Antigravity AI agent assisted in reverse-engineering the UI reference mockups, structuring the architectural plan, drafting boilerplate controllers/tests, and formatting styling.
- **Human Verification**: All mathematical formulas were independently evaluated against digital marketing benchmarks, test edge cases (division by zero, negative spend), multi-tenant data boundaries, and database migrations were reviewed and verified with automated test suites.
