# FinFlow – Personal Finance Management Dashboard

![FinFlow Banner](public/logo.svg)

> **FinFlow** is a modern, production-grade frontend financial management dashboard built with React 19, TypeScript, Redux Toolkit, Tailwind CSS, and Recharts. Engineered for high performance, financial calculation precision, and digital banking UX quality.
>
> *Designed as a portfolio project for the Revolut Software Engineer (Frontend) Internship 2027 application.*

---

## 🚀 Live Demo & Key Highlights

- **Live Sandbox**: Simulated digital banking environment with realistic INR transactions across popular services (Revolut India, Swiggy, Amazon, Zerodha, Blinkit, Cult.fit, Tata Power).
- **Financial Precision**: Internal monetary amounts stored in integer **paise** (`1 INR = 100 paise`) to prevent IEEE 754 floating-point inaccuracies.
- **Single Source of Truth**: All monthly totals, category expenditures, budget progress bars, and account balances are computed via memoized Redux Toolkit selectors from the ledger rather than hardcoded independently.
- **Interactive Multi-Account Transfers**: Atomic balance transfers between checking, savings, demat, and credit cards with automatic ledger entries.
- **Dynamic Timeframe Analytics**: Interactive 7-day, 30-day, 90-day, and 12-month analytics recalculating trend charts, category burn rates, and automated insights.
- **Enforced Budget Warnings**: Real-time progress bars with three-tier alerting (`On Track`, `Near Limit 80%+`, `Exceeded`).
- **Offline Persistence & Portability**: State synchronized with `localStorage`, with one-click full JSON backup export and sandbox reset.

---

## 🛠 Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Core Framework** | React 19 | Component-driven UI with modern hooks and concurrent rendering |
| **Language** | TypeScript (Strict) | End-to-end type safety, reusable domain models, zero `any` usage |
| **Bundler & Tooling** | Vite | Instant Hot Module Replacement (HMR) and optimized rollup production bundles |
| **Styling & Theme** | Tailwind CSS | Utility-first design system with light/dark theme support and responsive breakpoints |
| **State Architecture**| Redux Toolkit (RTK) | Centralized immutable ledger state, derived memoized selectors, persistence subscription |
| **Navigation** | React Router DOM v7 | Client-side routing with clean breadcrumbs and active state indicators |
| **Data Visualization**| Recharts | Responsive SVG charts (Cashflow Area, Category Donut, Grouped Bars) with custom tooltips |
| **Form Engineering** | React Hook Form + Zod | Schema-based validation for transactions, budgets, transfers, and user profiles |
| **Icons** | Lucide React | Crisp, accessible fintech iconography |
| **Automated Testing** | Vitest + React Testing Library | Unit tests for financial math, Redux reducers/selectors, Zod schemas, and UI components |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── store.ts               # Redux Toolkit store with localStorage persistence subscriber
│   ├── hooks.ts               # Typed useAppDispatch & useAppSelector hooks
│   └── seedData.ts            # 35+ realistic Indian transactions, accounts, and budgets
├── components/
│   ├── common/
│   │   ├── Badge.tsx          # StatusBadge, TypeBadge, CategoryBadge pills
│   │   ├── Button.tsx         # Primary, secondary, outline, danger, ghost variants
│   │   ├── Card.tsx           # Rounded container with dark mode styling and subcomponents
│   │   ├── Modal.tsx          # Accessible modal dialog with backdrop & escape listener
│   │   ├── StatCard.tsx       # KPI card with trend indicator and icon
│   │   └── EmptyState.tsx     # Clean empty-state illustration and action button
│   ├── layout/
│   │   ├── AppLayout.tsx      # Application layout shell with responsive drawer
│   │   ├── Sidebar.tsx        # Navigation sidebar with branding and mini net-worth card
│   │   ├── Header.tsx         # Page title, universal search (Cmd+K), quick add CTA, notifications
│   │   ├── MobileNav.tsx      # Mobile sliding drawer navigation
│   │   ├── SearchModal.tsx    # Universal keyboard-accessible transaction search modal
│   │   └── NotificationDropdown.tsx # Dropdown showing budget warnings & status updates
│   ├── dashboard/
│   │   ├── CashFlowChart.tsx  # 6-month income vs expenses area chart
│   │   ├── CategoryPieChart.tsx # Spending by category donut chart with center totals
│   │   ├── BudgetProgressWidget.tsx # Dashboard budget health overview
│   │   ├── RecentTransactions.tsx   # Top 5 ledger entries with quick navigation
│   │   └── QuickActions.tsx   # Fast CTAs (Add Transaction, Transfer, Budget, Export CSV)
│   ├── transactions/
│   │   ├── TransactionTable.tsx     # Paginated, sortable transaction table with row actions
│   │   ├── TransactionFilters.tsx   # Multi-filter controls (search, category, type, account, sort)
│   │   ├── TransactionModal.tsx     # Add/Edit transaction with React Hook Form + Zod validation
│   │   └── DeleteConfirmModal.tsx   # Confirmation dialog for safe transaction removal
│   ├── analytics/
│   │   ├── AnalyticsHeader.tsx      # Timeframe tabs (7D, 30D, 90D, 12M) & period metrics
│   │   ├── SpendingTrendChart.tsx   # Spending velocity curve over selected period
│   │   ├── IncomeExpenseBarChart.tsx# Comparative income vs expense grouped bar chart
│   │   └── FinancialInsights.tsx    # Data-driven financial intelligence & savings advice
│   ├── budgets/
│   │   ├── BudgetCard.tsx           # Category card with dynamic progress and status pills
│   │   ├── BudgetSummary.tsx        # Overall monthly budget utilization gauge
│   │   └── BudgetModal.tsx          # Create/Edit monthly category limit modal
│   └── accounts/
│       ├── AccountCard.tsx          # Account card with available balance & recent ledger history
│       └── TransferModal.tsx        # Simulated atomic transfer modal with ledger logging
├── features/
│   ├── transactions/transactionsSlice.ts # Ledger state, filters, and financial aggregators
│   ├── budgets/budgetsSlice.ts           # Category budgets with dynamic progress computation
│   ├── accounts/accountsSlice.ts         # Multi-account balances and transfer operations
│   └── preferences/preferencesSlice.ts   # Currency (INR, USD, EUR, GBP), theme, and profile
├── pages/
│   ├── Dashboard.tsx          # Holistic financial overview
│   ├── Transactions.tsx       # Complete ledger management
│   ├── Analytics.tsx          # Interactive timeframe spending analytics
│   ├── Budgets.tsx            # Monthly category budget enforcement
│   ├── Accounts.tsx           # Net worth and account management
│   └── Settings.tsx           # System preferences, theme toggle, and JSON backup
├── types/                     # Clean domain interfaces for transactions, budgets, accounts
├── utils/
│   ├── currency.ts            # Indian currency formatting, compact units (Lakhs/Crores), paise math
│   ├── date.ts                # ISO parsing, relative formatting ("Today", "Yesterday")
│   ├── export.ts              # CSV ledger export & JSON state backup generator
│   └── validation.ts          # Zod validation schemas
├── __tests__/                 # Vitest automated test suite (34 unit & integration tests)
├── App.tsx                    # Route definitions
├── main.tsx                   # App entrypoint with Redux Provider and BrowserRouter
└── index.css                  # Tailwind base directives and custom scrollbars
```

---

## 💻 Getting Started Locally

### Prerequisites

- **Node.js**: v18+ (tested on Node v24.20.0)
- **npm**: v9+ (tested on npm 11.19.0)

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/personal-finance-management-dashboard.git

# Navigate into project directory
cd personal-finance-management-dashboard

# Install dependencies
npm install
```

### Running Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🧪 Automated Testing

FinFlow features a comprehensive Vitest automated test suite covering financial calculations, Redux reducers and selectors, Zod schema validation, and React components.

```bash
# Execute test suite once
npm test

# Run tests in interactive watch mode
npm run test:watch
```

### Test Coverage Highlights:
- **Financial Math (`currency.test.ts`)**: Exact integer paise conversion, floating-point error avoidance, Indian numbering notation (`₹1,25,000.00`), and compact Lakhs/Crores abbreviations.
- **Ledger Logic (`transactionsSlice.test.ts`)**: Adding, editing, deleting transactions, multi-condition filtering, MoM growth calculations, and category aggregations.
- **Budget Intelligence (`budgetsSlice.test.ts`)**: Dynamic progress calculations from actual transactions, alert threshold triggers (`<80%` normal, `80%-99%` warning, `≥100%` exceeded).
- **Simulated Accounts (`accountsSlice.test.ts`)**: Balance adjustments, atomic transfer debits/credits, and net worth calculations.
- **Form Schemas (`validation.test.ts`)**: Zod constraint tests rejecting negative amounts, short merchant names, and duplicate transfer accounts.
- **UI Components (`StatCard.test.tsx`, `Badge.test.tsx`)**: Rendering metric cards, trend arrows, and badge variants.

---

## 🏗 Production Build & Verification

```bash
# Type check and build optimized bundle
npm run build

# Preview production build locally
npm run preview
```

Production build generates minified, tree-shaken static assets in the `dist/` directory ready for deployment on Vercel, Netlify, or GitHub Pages.

---

## 💡 Revolut Internship Interview Discussion Points

If discussing this project during technical interviews:

1. **Why store currency in integer paise instead of floating-point numbers?**
   - JavaScript numbers use IEEE 754 double-precision binary floating-point representation (`0.1 + 0.2 === 0.30000000000000004`). In fintech software, roundoff discrepancies compound across transactions and cause balance drift. FinFlow stores amounts internally as integer paise (`amountInPaise: number`) and converts to decimal currency solely at the presentation layer using `Intl.NumberFormat('en-IN')`.
2. **Why derive budget spent totals in selectors instead of storing them on budget models?**
   - Storing a separate `spent` field inside each budget object creates duplicate state that requires manual synchronization whenever a transaction is added, edited, or deleted. By deriving budget progress via `createSelector` combining `state.budgets.items` and `state.transactions.items`, the system guarantees a single source of truth without risk of state inconsistency.
3. **How does state persistence work without an external database?**
   - A store subscriber monitors Redux state changes and saves updated slices to `localStorage`. On application boot, initial states rehydrate from `localStorage`, falling back to the rich seed dataset when empty. A dedicated "Reset Sandbox" button in Settings allows instant restoration of clean demo data.

---

## 🛡 Disclaimer

FinFlow is a portfolio project designed for software engineering demonstrations. All financial institutions, account balances, transaction records, and masked account identifiers are simulated fictional data stored locally in your browser. No real banking APIs, authentication systems, or payment rails are integrated.

---

## 📄 License

MIT License. Created by Yamin S. for the Revolut Software Engineer (Frontend) Internship 2027 application.
