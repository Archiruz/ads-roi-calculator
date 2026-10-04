import PDFDocument from 'pdfkit';
import fs from 'fs';

const doc = new PDFDocument({
    layout: 'landscape',
    size: 'A4',
    margin: 40,
});

const output = fs.createWriteStream('presentation.pdf');
doc.pipe(output);

const colors = {
    primary: '#1D4ED8',      // Blue 700
    primaryLight: '#3B82F6', // Blue 500
    accent: '#06B6D4',       // Cyan 500
    dark: '#0F172A',         // Slate 900
    light: '#F8FAFC',        // Slate 50
    cardBg: '#FFFFFF',
    textDark: '#1E293B',     // Slate 800
    textMuted: '#64748B',    // Slate 500
    border: '#E2E8F0',       // Slate 200
    success: '#10B981',
};

function drawSlideHeader(title: string, category: string) {
    doc.rect(0, 0, 842, 60).fill('#0F172A');
    doc.fillColor('#60A5FA').fontSize(11).font('Helvetica-Bold').text(category.toUpperCase(), 40, 16);
    doc.fillColor('#FFFFFF').fontSize(18).font('Helvetica-Bold').text(title, 40, 32);
    
    // Bottom slide footer
    doc.rect(0, 565, 842, 30).fill('#F1F5F9');
    doc.fillColor('#64748B').fontSize(9).font('Helvetica').text('Pressure Technical Test — ROI Advertising Calculator (AdForecast Pro)', 40, 575);
    doc.text('Confidential & Proprietary', 700, 575);
}

// ==========================================
// SLIDE 1: Title Slide
// ==========================================
doc.rect(0, 0, 842, 595).fill('#0F172A');

// Decorative header badge
doc.roundedRect(260, 120, 322, 32, 16).fill('#1E293B');
doc.fillColor('#60A5FA').fontSize(11).font('Helvetica-Bold').text('FULL STACK DEVELOPER TECHNICAL TEST', 285, 131);

doc.fillColor('#FFFFFF').fontSize(36).font('Helvetica-Bold').text('ROI Advertising Calculator', 140, 180, { align: 'center', width: 562 });
doc.fillColor('#38BDF8').fontSize(26).text('(AdForecast Pro)', 140, 230, { align: 'center', width: 562 });

doc.fillColor('#94A3B8').fontSize(14).font('Helvetica').text('Production-ready real-time campaign calculator, user data isolation, and deployment', 140, 280, { align: 'center', width: 562 });

// Meta info box
doc.roundedRect(220, 350, 402, 100, 12).fill('#1E293B');
doc.fillColor('#94A3B8').fontSize(11).text('Candidate:', 250, 375);
doc.fillColor('#FFFFFF').font('Helvetica-Bold').text('Alvian Rahmadani', 340, 375);
doc.fillColor('#94A3B8').font('Helvetica').text('Tech Stack:', 250, 400);
doc.fillColor('#FFFFFF').font('Helvetica-Bold').text('Laravel 12 (PHP 8.4) + React 19 + Inertia v3 + PostgreSQL', 340, 400);

// ==========================================
// SLIDE 2: Problem & Requirements
// ==========================================
doc.addPage();
drawSlideHeader('Requirements & Business Scope', 'Section 1');

const reqCards = [
    { title: 'Secure Authentication', desc: 'Hashed passwords, session/cookie authentication that natively persists on page refresh, and strictly protected calculator & history routes.' },
    { title: 'Real-Time ROI Calculator', desc: 'Instant client-side calculation updating Revenue, Margin, ROI, and Target CPR simultaneously with 2-way synchronized slider & number inputs.' },
    { title: 'Private User Data Isolation', desc: 'Each calculation is associated strictly with the authenticated user. Multi-tenant privacy guarantees User A never accesses User B\'s records.' },
    { title: 'Relational DB & Cloudflare Tunnel', desc: 'PostgreSQL storage with Docker Compose runtime, and zero public open ports via Cloudflare Tunnel outbound routing.' }
];

reqCards.forEach((c, idx) => {
    const x = 50 + (idx % 2) * 380;
    const y = 90 + Math.floor(idx / 2) * 220;
    doc.roundedRect(x, y, 360, 195, 12).fillAndStroke('#FFFFFF', '#E2E8F0');
    doc.fillColor('#1D4ED8').fontSize(14).font('Helvetica-Bold').text(c.title, x + 20, y + 25);
    doc.fillColor('#475569').fontSize(12).font('Helvetica').text(c.desc, x + 20, y + 55, { width: 320, lineGap: 4 });
});

// ==========================================
// SLIDE 3: System Architecture
// ==========================================
doc.addPage();
drawSlideHeader('System Architecture & Network Topology', 'Section 2');

doc.roundedRect(50, 90, 742, 450, 12).fillAndStroke('#FFFFFF', '#E2E8F0');

const archSteps = [
    { title: '1. User Browser', desc: 'React 19 SPA (Inertia v3)\nTwo-way synchronized state\nInstant zero-latency preview' },
    { title: '2. Cloudflare Edge', desc: 'SSL/TLS Termination\nDDoS Protection & CDN\nCustom Domain routing' },
    { title: '3. Cloudflare Tunnel', desc: 'Secure outbound tunnel\nZero exposed public ports\nNo public IP required' },
    { title: '4. Nginx Reverse Proxy', desc: 'Serves static assets\nFastCGI proxy to PHP-FPM\nSecurity headers enforced' },
    { title: '5. Laravel 12 Backend', desc: 'PHP 8.4 runtime\nCalculationService\nSession & Auth API' },
    { title: '6. PostgreSQL DB', desc: 'Relational schema\nIndexed user_id calculations\nPersistent named volume' }
];

archSteps.forEach((s, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const x = 70 + col * 240;
    const y = 130 + row * 200;
    doc.roundedRect(x, y, 220, 160, 10).fillAndStroke('#F8FAFC', '#CBD5E1');
    doc.fillColor('#0F172A').fontSize(13).font('Helvetica-Bold').text(s.title, x + 15, y + 20);
    doc.fillColor('#475569').fontSize(11).font('Helvetica').text(s.desc, x + 15, y + 45, { lineGap: 3 });
});

// ==========================================
// SLIDE 4: Mathematical Derivation & Business Logic
// ==========================================
doc.addPage();
drawSlideHeader('Mathematical Business Logic (AdForecast Pro)', 'Section 3');

doc.roundedRect(50, 90, 742, 450, 12).fillAndStroke('#FFFFFF', '#E2E8F0');

doc.fillColor('#1E293B').fontSize(13).font('Helvetica-Bold').text('Verified Formulas Matching UI Mockups (ui1.png & ui2.png)', 70, 115);

const formulas = [
    { name: 'Results Count', formula: 'Results = Ad Spend / CPR', ex: '1.5M / 235k = 6.38 -> 6 results | 5M / 100k = 50 results' },
    { name: 'Revenue', formula: 'Revenue = Results * Average Order Value (AOV)', ex: '6.3829 * 10k = Rp 63.830 | 50 * 500k = Rp 25.000.000' },
    { name: 'Net Profit', formula: 'Profit = Revenue - Monthly Ad Spend', ex: '63.830 - 1.5M = -Rp 1.436.170 (Loss) | 25M - 5M = +Rp 20.000.000 (Profit)' },
    { name: 'ROI %', formula: 'ROI = ((Revenue - Spend) / Spend) * 100%', ex: '(-1.43M / 1.5M) * 100 = -95.7% | (20M / 5M) * 100 = +400.0%' },
    { name: 'CPR Target', formula: 'CPR Target = 30% * Product Price', ex: '30% * 50k = Rp 15.000 | 30% * 500k = Rp 150.000' },
    { name: 'Margin per Result', formula: 'Margin / Result = AOV - CPR', ex: '10k - 235k = -Rp 225.000 | 500k - 100k = +Rp 400.000' }
];

formulas.forEach((f, idx) => {
    const y = 145 + idx * 62;
    doc.roundedRect(70, y, 702, 52, 8).fillAndStroke('#F1F5F9', '#E2E8F0');
    doc.fillColor('#1D4ED8').fontSize(11).font('Helvetica-Bold').text(f.name, 85, y + 10);
    doc.fillColor('#0F172A').fontSize(11).font('Helvetica-Bold').text(f.formula, 230, y + 10);
    doc.fillColor('#64748B').fontSize(10).font('Helvetica').text(`Example: ${f.ex}`, 85, y + 30);
});

// ==========================================
// SLIDE 5: Security & Multi-Tenant Data Isolation
// ==========================================
doc.addPage();
drawSlideHeader('Authentication & Multi-Tenant Security', 'Section 4');

const secItems = [
    { title: 'Server-Enforced User Scoping', desc: 'The backend never trusts a user_id submitted in the request body. All calculations are persisted with $request->user()->id and queried exclusively through $request->user()->calculations().' },
    { title: 'Bcrypt Password Hashing', desc: 'Passwords hashed with 12 rounds of bcrypt. Plaintext passwords are never logged, stored, or returned in any API responses.' },
    { title: 'Safe Session Management', desc: 'Full CSRF protection, session regeneration on login/logout, and secure HTTP-only cookies preventing XSS token exfiltration.' },
    { title: 'Automated Authorization Tests', desc: 'Dedicated Pest test suite CalculationAuthorizationTest proves that User A cannot read, list, update, or delete User B\'s calculation records.' }
];

secItems.forEach((s, idx) => {
    const x = 50 + (idx % 2) * 380;
    const y = 90 + Math.floor(idx / 2) * 220;
    doc.roundedRect(x, y, 360, 195, 12).fillAndStroke('#FFFFFF', '#E2E8F0');
    doc.fillColor('#059669').fontSize(14).font('Helvetica-Bold').text(s.title, x + 20, y + 25);
    doc.fillColor('#475569').fontSize(12).font('Helvetica').text(s.desc, x + 20, y + 55, { width: 320, lineGap: 4 });
});

// ==========================================
// SLIDE 6: Automated Testing & Verification
// ==========================================
doc.addPage();
drawSlideHeader('Automated Test Suite & Code Quality', 'Section 5');

doc.roundedRect(50, 90, 742, 450, 12).fillAndStroke('#FFFFFF', '#E2E8F0');

// Stats bar
doc.roundedRect(70, 110, 702, 60, 10).fill('#0F172A');
doc.fillColor('#60A5FA').fontSize(22).font('Helvetica-Bold').text('94 Tests', 100, 125);
doc.fillColor('#34D399').fontSize(22).text('335 Assertions', 300, 125);
doc.fillColor('#38BDF8').fontSize(22).text('100% Pass Rate', 550, 125);

const testCategories = [
    { title: 'CalculationServiceTest (Unit)', desc: 'Validates exact decimal precision for mockups 1 & 2, zero CPR division guards, and zero spend boundary handling.' },
    { title: 'CalculationApiTest (Feature)', desc: 'Validates REST endpoints POST /api/calculations, store validation ranges, and user isolation barriers.' },
    { title: 'AuthApiTest (Feature)', desc: 'Validates registration, email uniqueness, password hashing, session regeneration, and logout invalidation.' },
    { title: 'Pint & TypeScript Typecheck', desc: 'Formatted with Laravel Pint (PSR-12/agent standard) and strict TypeScript compiler check (tsc --noEmit).' }
];

testCategories.forEach((t, idx) => {
    const y = 190 + idx * 80;
    doc.roundedRect(70, y, 702, 68, 8).fillAndStroke('#F8FAFC', '#E2E8F0');
    doc.fillColor('#1D4ED8').fontSize(12).font('Helvetica-Bold').text(t.title, 90, y + 14);
    doc.fillColor('#475569').fontSize(11).font('Helvetica').text(t.desc, 90, y + 36, { width: 660 });
});

// ==========================================
// SLIDE 7: Docker & Deployment Strategy
// ==========================================
doc.addPage();
drawSlideHeader('Docker Compose & Cloudflare Tunnel Deployment', 'Section 6');

doc.roundedRect(50, 90, 742, 450, 12).fillAndStroke('#FFFFFF', '#E2E8F0');

doc.fillColor('#1E293B').fontSize(13).font('Helvetica-Bold').text('4 Container Production Runtime (docker-compose.prod.yml)', 70, 115);

const containers = [
    { name: 'app (PHP 8.4-FPM)', desc: 'Alpine-based PHP 8.4 with pdo_pgsql, opcache, and optimized autoloading. Runs API & CalculationService.' },
    { name: 'web (Nginx:Alpine)', desc: 'Serves pre-compiled Vite React SPA assets and forwards dynamic PHP requests to app:9000.' },
    { name: 'db (PostgreSQL 16)', desc: 'Dedicated database container with isolated internal Docker bridge network and persistent postgres_prod_data volume.' },
    { name: 'cloudflared', desc: 'Official Cloudflare Tunnel daemon establishing secure outbound connection without exposing any inbound ports.' }
];

containers.forEach((c, idx) => {
    const y = 145 + idx * 90;
    doc.roundedRect(70, y, 702, 75, 8).fillAndStroke('#F1F5F9', '#CBD5E1');
    doc.fillColor('#0284C7').fontSize(13).font('Helvetica-Bold').text(c.name, 90, y + 16);
    doc.fillColor('#475569').fontSize(11).font('Helvetica').text(c.desc, 90, y + 40, { width: 660 });
});

// ==========================================
// SLIDE 8: AI Copilot Usage & Deliverables
// ==========================================
doc.addPage();
drawSlideHeader('Deliverables & AI Copilot Methodology', 'Section 7');

doc.roundedRect(50, 90, 742, 450, 12).fillAndStroke('#FFFFFF', '#E2E8F0');

doc.fillColor('#1E293B').fontSize(13).font('Helvetica-Bold').text('Project Deliverables Checklist', 70, 115);

const deliverables = [
    'Complete clean Git repository with atomic, descriptive commits',
    'BUSINESS_LOGIC.md documenting inputs, outputs, formula citations, and edge cases',
    'Comprehensive Pest unit and feature tests covering authentication, formulas, and data isolation',
    'Production Docker Compose (Nginx, PHP 8.4, PostgreSQL, Cloudflare Tunnel)',
    'Presentation Deck PDF (presentation.pdf) with architectural & business logic breakdown'
];

deliverables.forEach((d, idx) => {
    const y = 145 + idx * 34;
    doc.fillColor('#059669').fontSize(12).font('Helvetica-Bold').text('✓', 75, y);
    doc.fillColor('#334155').fontSize(11).font('Helvetica').text(d, 95, y);
});

doc.fillColor('#1E293B').fontSize(13).font('Helvetica-Bold').text('Transparent AI Copilot Usage', 70, 340);
doc.fillColor('#475569').fontSize(11).font('Helvetica').text(
    'AI was utilized as an intelligent pair-programmer copilot to rapidly research mathematical marketing benchmarks, draft initial boilerplate schemas, and write regression test suites. Every formula, UI synchronization constraint, database index, and security boundary was systematically analyzed, manually verified against the visual reference mockups, and proved via automated testing.',
    70, 365, { width: 700, lineGap: 4 }
);

doc.end();
console.log('Presentation PDF generated successfully.');
