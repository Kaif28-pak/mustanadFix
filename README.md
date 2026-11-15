# 🛠️ MustanadFix (مستند فکس)

> **Verified On-Demand Home Appliance & AC Repair Marketplace**  
> Tailored specifically for the urban challenges of Karachi, Pakistan.

MustanadFix is a trusted, full-stack on-demand home maintenance platform connecting household customers with verified, background-checked technicians for AC service, refrigerator maintenance, washing machines, and electrical appliances.

---

## 🌟 Key Features

### 🛡️ Uncompromised Trust & Safety
* **NADRA CNIC & Police Clearance Verification:** Technicians undergo strict ID verification and physical background checks before activation.
* **Digital Technician ID Badges:** Customers receive technician photos, CNIC verification badges, rating history, and experience details before arrival.
* **7-Day Workmanship Warranty:** All completed jobs are backed by a satisfaction guarantee.
* **In-App SOS Emergency Button:** Instant safety contact access during active home visits.

### 💰 Transparent & Dynamic Pricing
* **No Hidden Fees:** Upfront price estimates before confirming bookings.
* **Karachi High-Rise Floor Surcharge Calculator:** Automatic, transparent extra labor calculation for upper floors without elevators.
* **Standardized Rate Card:** Fixed inspection rates, gas refill charges (R410A / R32), PCB repairs, and compressor servicing.

### 🔄 Multi-Role Workflows & Portals
* **Customer Booking & Tracking (`/book`, `/dashboard`):** 
  * Multi-step booking flow with date, time-slot, and address selection.
  * Live status tracker with interactive visual timeline (`Pending` ➔ `Assigned` ➔ `On The Way` ➔ `In Progress` ➔ `Completed`).
* **Technician Portal (`/tech-dashboard`):**
  * Instant job alerts with accept / decline actions.
  * Real-time status update toggle button (En Route, Started, Job Done).
  * Digital bill generation and cash collection confirmations.
* **Admin Control Center (`/admin`):**
  * Real-time live booking stream and dispute handling.
  * Technician verification desk (approve/reject CNIC and Police clearance documents).
  * Revenue analytics, commission splits, and platform metrics.

### 🌐 Bilingual & Accessibility First
* **Urdu & English Localization:** Instant toggle between English and Urdu (اردو) across all screens and user messages.
* **Theme Switching:** Dark mode and Light mode support with automatic persistence.
* **Mobile Responsive:** Optimized for both mobile smartphones and desktop screens.

---

## 🏗️ Tech Stack

* **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
* **Frontend:** [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
* **Styling & UI:** [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/)
* **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security & Realtime)
* **State Management & Fetching:** TanStack Query & React Context / Custom Reactive Stores
* **Validation:** [Zod](https://zod.dev/)

---

## 📁 Project Structure

```text
mustanadfix/
├── public/                 # Static assets and icons
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── admin/          # Admin operations & verification dashboard
│   │   ├── book/           # Multi-step booking experience
│   │   ├── dashboard/      # Customer live booking tracking
│   │   ├── tech-dashboard/ # Technician job dispatch and management
│   │   ├── layout.tsx      # Root layout with providers
│   │   ├── page.tsx        # Landing page with pricing & trust widgets
│   │   └── globals.css     # Global styles & Tailwind theme definitions
│   ├── components/         # Reusable UI components
│   │   ├── pricing/        # Dynamic Price Calculator & rate widgets
│   │   ├── shared/         # Header, Footer, LanguageToggle, ThemeToggle
│   │   └── trust/          # Trust badges, Technician cards, Safety cards
│   └── lib/                # Utilities and core business logic
│       ├── i18n/           # English / Urdu dictionaries and context
│       ├── pricing/        # Dynamic surcharge and pricing algorithms
│       ├── store/          # Reactive state store (demo & live persistence)
│       ├── supabase/       # Supabase client and TypeScript database types
│       └── validations/    # Zod schemas for booking and customer input
└── supabase/
    └── migrations/         # PostgreSQL schema (Tables, RLS policies, Enums)
```

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have the following installed on your machine:
* **Node.js** (v18.18 or later / v20+ recommended)
* **npm**, **yarn**, or **pnpm**
* **Git**

### 2. Clone the Repository
```bash
git clone https://github.com/Kaif28-pak/mustanadFix.git
cd mustanadFix
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env.local` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Note:** The app includes a built-in interactive demo mode and local store, so you can explore the entire UI and workflows even before connecting Supabase!

### 5. Setup the Database (Supabase)
To enable real database persistence:
1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Copy the contents of [`supabase/migrations/20261114000000_initial_schema.sql`](supabase/migrations/20261114000000_initial_schema.sql) and click **Run**.
4. All database tables, enums, triggers, and Row Level Security (RLS) policies will be generated.

### 6. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🧪 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Next.js development server with Turbopack. |
| `npm run build` | Compiles and builds optimized production bundles. |
| `npm run start` | Starts the production server after building. |
| `npm run lint` | Runs ESLint checks across the codebase. |

---

## 🇵🇰 Tailored for the Local Ecosystem
* **Karachi Specific Service Coverage:** Clifton, DHA, Gulshan-e-Iqbal, Johar, North Nazimabad, PECHS, and surrounding areas.
* **Local Payment Channels:** Cash on Delivery (COD) by default, structured for easy integration with JazzCash, Easypaisa, and Raast.
* **Bilingual Support:** Full native Urdu translations designed for local Pakistani households and technician accessibility.

---

## 📄 License
This project is private and proprietary. All rights reserved.
