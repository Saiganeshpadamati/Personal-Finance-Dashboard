import { Account, Budget, Transaction, UserPreferences } from '../types'

export const INITIAL_ACCOUNTS: Account[] = [
  {
    id: 'acc-1',
    name: 'HDFC Priority Salary Account',
    type: 'checking',
    institution: 'HDFC Bank',
    balanceInPaise: 24285000, // ₹2,42,850.00
    accountNumberMasked: '•••• 4821',
    currency: 'INR',
    status: 'active',
    color: '#0e8ce4', // finflow blue
  },
  {
    id: 'acc-2',
    name: 'ICICI Wealth Savings',
    type: 'savings',
    institution: 'ICICI Bank',
    balanceInPaise: 41500000, // ₹4,15,000.00
    accountNumberMasked: '•••• 9032',
    currency: 'INR',
    status: 'active',
    color: '#0284c7', // sky
  },
  {
    id: 'acc-3',
    name: 'Zerodha Demat Portfolio',
    type: 'investment',
    institution: 'Zerodha Broking Ltd',
    balanceInPaise: 87540000, // ₹8,75,400.00
    accountNumberMasked: '•••• 3144',
    currency: 'INR',
    status: 'active',
    color: '#10b981', // emerald
  },
  {
    id: 'acc-4',
    name: 'Axis Bank Neo Credit Card',
    type: 'credit',
    institution: 'Axis Bank',
    balanceInPaise: -1845000, // -₹18,450.00 (Outstanding)
    creditLimitInPaise: 25000000, // ₹2,50,000.00 limit
    accountNumberMasked: '•••• 7619',
    currency: 'INR',
    status: 'active',
    color: '#f43f5e', // rose
  },
]

export const INITIAL_BUDGETS: Budget[] = [
  {
    id: 'b-1',
    category: 'Food & Dining',
    limitInPaise: 2500000, // ₹25,000.00
    period: 'monthly',
    alertThresholdPercent: 80,
  },
  {
    id: 'b-2',
    category: 'Shopping',
    limitInPaise: 2000000, // ₹20,000.00
    period: 'monthly',
    alertThresholdPercent: 80,
  },
  {
    id: 'b-3',
    category: 'Transportation',
    limitInPaise: 1000000, // ₹10,000.00
    period: 'monthly',
    alertThresholdPercent: 80,
  },
  {
    id: 'b-4',
    category: 'Entertainment',
    limitInPaise: 800000, // ₹8,000.00
    period: 'monthly',
    alertThresholdPercent: 85,
  },
  {
    id: 'b-5',
    category: 'Utilities & Bills',
    limitInPaise: 1200000, // ₹12,000.00
    period: 'monthly',
    alertThresholdPercent: 90,
  },
  {
    id: 'b-6',
    category: 'Healthcare',
    limitInPaise: 1000000, // ₹10,000.00
    period: 'monthly',
    alertThresholdPercent: 80,
  },
  {
    id: 'b-7',
    category: 'Education',
    limitInPaise: 1500000, // ₹15,000.00
    period: 'monthly',
    alertThresholdPercent: 80,
  },
]

export const INITIAL_TRANSACTIONS: Transaction[] = [
  // --- November 2026 (Current Month) ---
  {
    id: 'tx-101',
    merchant: 'Revolut India Tech',
    description: 'Monthly Engineering Salary - Nov 2026',
    category: 'Salary',
    amountInPaise: 14500000, // ₹1,45,000.00
    type: 'income',
    date: '2026-11-01T09:30:00',
    paymentMethod: 'Net Banking',
    status: 'completed',
    accountId: 'acc-1',
  },
  {
    id: 'tx-102',
    merchant: 'Blinkit Instant Groceries',
    description: 'Weekly dairy, vegetables and pantry supplies',
    category: 'Food & Dining',
    amountInPaise: 245000, // ₹2,450.00
    type: 'expense',
    date: '2026-11-04T19:15:00',
    paymentMethod: 'UPI',
    status: 'completed',
    accountId: 'acc-1',
  },
  {
    id: 'tx-103',
    merchant: 'Swiggy Gourmet',
    description: 'Team dinner celebration at Olive Bistro',
    category: 'Food & Dining',
    amountInPaise: 382000, // ₹3,820.00
    type: 'expense',
    date: '2026-11-03T21:40:00',
    paymentMethod: 'Credit Card',
    status: 'completed',
    accountId: 'acc-4',
  },
  {
    id: 'tx-104',
    merchant: 'Fintech UI Design Consulting',
    description: 'Design system consulting milestone payment',
    category: 'Freelance',
    amountInPaise: 3500000, // ₹35,000.00
    type: 'income',
    date: '2026-11-03T14:00:00',
    paymentMethod: 'Net Banking',
    status: 'completed',
    accountId: 'acc-2',
  },
  {
    id: 'tx-105',
    merchant: 'Uber Premier',
    description: 'Airport transit ride',
    category: 'Transportation',
    amountInPaise: 125000, // ₹1,250.00
    type: 'expense',
    date: '2026-11-02T11:20:00',
    paymentMethod: 'UPI',
    status: 'completed',
    accountId: 'acc-1',
  },
  {
    id: 'tx-106',
    merchant: 'Tata Power Electricity',
    description: 'Residential monthly electricity invoice',
    category: 'Utilities & Bills',
    amountInPaise: 420000, // ₹4,200.00
    type: 'expense',
    date: '2026-11-02T16:45:00',
    paymentMethod: 'Net Banking',
    status: 'completed',
    accountId: 'acc-1',
  },
  {
    id: 'tx-107',
    merchant: 'Amazon India',
    description: 'Ergonomic mechanical keyboard & wrist rest',
    category: 'Shopping',
    amountInPaise: 849900, // ₹8,499.00
    type: 'expense',
    date: '2026-11-01T17:30:00',
    paymentMethod: 'Credit Card',
    status: 'completed',
    accountId: 'acc-4',
  },
  {
    id: 'tx-108',
    merchant: 'Blue Tokai Coffee Roasters',
    description: 'Cold brew and artisanal coffee beans batch',
    category: 'Food & Dining',
    amountInPaise: 95000, // ₹950.00
    type: 'expense',
    date: '2026-11-05T08:45:00',
    paymentMethod: 'UPI',
    status: 'completed',
    accountId: 'acc-1',
  },
  {
    id: 'tx-109',
    merchant: 'Cult.fit Pass',
    description: 'Monthly gym and boxing studio access',
    category: 'Healthcare',
    amountInPaise: 299900, // ₹2,999.00
    type: 'expense',
    date: '2026-11-04T07:15:00',
    paymentMethod: 'Debit Card',
    status: 'completed',
    accountId: 'acc-1',
  },

  // --- October 2026 ---
  {
    id: 'tx-201',
    merchant: 'Revolut India Tech',
    description: 'Monthly Engineering Salary - Oct 2026',
    category: 'Salary',
    amountInPaise: 14500000, // ₹1,45,000.00
    type: 'income',
    date: '2026-10-01T09:30:00',
    paymentMethod: 'Net Banking',
    status: 'completed',
    accountId: 'acc-1',
  },
  {
    id: 'tx-202',
    merchant: 'Zerodha Mutual Fund SIP',
    description: 'Nifty 50 Index Fund Systematic Investment',
    category: 'Investments',
    amountInPaise: 2500000, // ₹25,000.00
    type: 'expense',
    date: '2026-10-05T10:00:00',
    paymentMethod: 'Net Banking',
    status: 'completed',
    accountId: 'acc-1',
  },
  {
    id: 'tx-203',
    merchant: 'Zomato',
    description: 'Weekend sushi delivery order',
    category: 'Food & Dining',
    amountInPaise: 185000, // ₹1,850.00
    type: 'expense',
    date: '2026-10-28T20:10:00',
    paymentMethod: 'UPI',
    status: 'completed',
    accountId: 'acc-1',
  },
  {
    id: 'tx-204',
    merchant: 'Zara India',
    description: 'Autumn formal jacket and trousers',
    category: 'Shopping',
    amountInPaise: 1199000, // ₹11,990.00
    type: 'expense',
    date: '2026-10-25T16:20:00',
    paymentMethod: 'Credit Card',
    status: 'completed',
    accountId: 'acc-4',
  },
  {
    id: 'tx-205',
    merchant: 'Netflix India',
    description: 'Ultra 4K Family Subscription',
    category: 'Entertainment',
    amountInPaise: 64900, // ₹649.00
    type: 'expense',
    date: '2026-10-24T12:00:00',
    paymentMethod: 'Credit Card',
    status: 'completed',
    accountId: 'acc-4',
  },
  {
    id: 'tx-206',
    merchant: 'Spotify Premium',
    description: 'Monthly Family Music Plan',
    category: 'Entertainment',
    amountInPaise: 17900, // ₹179.00
    type: 'expense',
    date: '2026-10-22T08:00:00',
    paymentMethod: 'UPI',
    status: 'completed',
    accountId: 'acc-1',
  },
  {
    id: 'tx-207',
    merchant: 'Airtel Xstream Fiber',
    description: 'High-speed gigabit fiber internet bill',
    category: 'Utilities & Bills',
    amountInPaise: 149900, // ₹1,499.00
    type: 'expense',
    date: '2026-10-18T15:30:00',
    paymentMethod: 'UPI',
    status: 'completed',
    accountId: 'acc-1',
  },
  {
    id: 'tx-208',
    merchant: 'Frontend Masters',
    description: 'Advanced TypeScript & Performance course license',
    category: 'Education',
    amountInPaise: 320000, // ₹3,200.00
    type: 'expense',
    date: '2026-10-15T11:00:00',
    paymentMethod: 'Credit Card',
    status: 'completed',
    accountId: 'acc-4',
  },
  {
    id: 'tx-209',
    merchant: 'Apollo Pharmacy',
    description: 'Monthly wellness supplements and vitamins',
    category: 'Healthcare',
    amountInPaise: 175000, // ₹1,750.00
    type: 'expense',
    date: '2026-10-12T18:50:00',
    paymentMethod: 'UPI',
    status: 'completed',
    accountId: 'acc-1',
  },
  {
    id: 'tx-210',
    merchant: 'HPCL Fuel Station',
    description: 'Vehicle full-tank petrol fill',
    category: 'Transportation',
    amountInPaise: 450000, // ₹4,500.00
    type: 'expense',
    date: '2026-10-10T09:15:00',
    paymentMethod: 'Debit Card',
    status: 'completed',
    accountId: 'acc-1',
  },
  {
    id: 'tx-211',
    merchant: 'Zerodha Dividend Payout',
    description: 'Quarterly dividend from TCS & Infosys holdings',
    category: 'Investments',
    amountInPaise: 820000, // ₹8,200.00
    type: 'income',
    date: '2026-10-08T14:30:00',
    paymentMethod: 'Net Banking',
    status: 'completed',
    accountId: 'acc-3',
  },
  {
    id: 'tx-212',
    merchant: 'PVR INOX Cinemas',
    description: 'IMAX movie tickets and refreshments',
    category: 'Entertainment',
    amountInPaise: 145000, // ₹1,450.00
    type: 'expense',
    date: '2026-10-06T20:30:00',
    paymentMethod: 'UPI',
    status: 'completed',
    accountId: 'acc-1',
  },
  {
    id: 'tx-213',
    merchant: 'Nature Basket Organics',
    description: 'Organic groceries and imported goods',
    category: 'Food & Dining',
    amountInPaise: 460000, // ₹4,600.00
    type: 'expense',
    date: '2026-10-04T17:15:00',
    paymentMethod: 'Credit Card',
    status: 'completed',
    accountId: 'acc-4',
  },

  // --- September 2026 ---
  {
    id: 'tx-301',
    merchant: 'Revolut India Tech',
    description: 'Monthly Engineering Salary - Sep 2026',
    category: 'Salary',
    amountInPaise: 14500000, // ₹1,45,000.00
    type: 'income',
    date: '2026-09-01T09:30:00',
    paymentMethod: 'Net Banking',
    status: 'completed',
    accountId: 'acc-1',
  },
  {
    id: 'tx-302',
    merchant: 'Apple Store India (BKC)',
    description: 'AirPods Pro 2nd Gen with USB-C',
    category: 'Shopping',
    amountInPaise: 2490000, // ₹24,900.00
    type: 'expense',
    date: '2026-09-22T15:00:00',
    paymentMethod: 'Credit Card',
    status: 'completed',
    accountId: 'acc-4',
  },
  {
    id: 'tx-303',
    merchant: 'MakeMyTrip Flight Booking',
    description: 'Round-trip flight Mumbai to Bengaluru tech conference',
    category: 'Travel',
    amountInPaise: 890000, // ₹8,900.00
    type: 'expense',
    date: '2026-09-18T13:40:00',
    paymentMethod: 'Credit Card',
    status: 'completed',
    accountId: 'acc-4',
  },
  {
    id: 'tx-304',
    merchant: 'Tech Conference Honorarium',
    description: 'Guest speaker honorarium on React Architecture',
    category: 'Freelance',
    amountInPaise: 2000000, // ₹20,000.00
    type: 'income',
    date: '2026-09-20T17:00:00',
    paymentMethod: 'Net Banking',
    status: 'completed',
    accountId: 'acc-1',
  },
  {
    id: 'tx-305',
    merchant: 'Uniqlo India',
    description: 'Merino wool sweaters & essentials',
    category: 'Shopping',
    amountInPaise: 699000, // ₹6,990.00
    type: 'expense',
    date: '2026-09-14T19:20:00',
    paymentMethod: 'Credit Card',
    status: 'completed',
    accountId: 'acc-4',
  },
  {
    id: 'tx-306',
    merchant: 'Swiggy Instamart',
    description: 'Pantry restocking',
    category: 'Food & Dining',
    amountInPaise: 165000, // ₹1,650.00
    type: 'expense',
    date: '2026-09-11T11:15:00',
    paymentMethod: 'UPI',
    status: 'completed',
    accountId: 'acc-1',
  },
  {
    id: 'tx-307',
    merchant: 'Mahanagar Gas Ltd',
    description: 'Bimonthly piped natural gas bill',
    category: 'Utilities & Bills',
    amountInPaise: 115000, // ₹1,150.00
    type: 'expense',
    date: '2026-09-08T10:00:00',
    paymentMethod: 'Net Banking',
    status: 'completed',
    accountId: 'acc-1',
  },
  {
    id: 'tx-308',
    merchant: 'Cult.fit Pass',
    description: 'Monthly gym access pass',
    category: 'Healthcare',
    amountInPaise: 299900, // ₹2,999.00
    type: 'expense',
    date: '2026-09-04T07:15:00',
    paymentMethod: 'Debit Card',
    status: 'completed',
    accountId: 'acc-1',
  },

  // --- August 2026 ---
  {
    id: 'tx-401',
    merchant: 'Revolut India Tech',
    description: 'Monthly Engineering Salary - Aug 2026',
    category: 'Salary',
    amountInPaise: 14500000, // ₹1,45,000.00
    type: 'income',
    date: '2026-08-01T09:30:00',
    paymentMethod: 'Net Banking',
    status: 'completed',
    accountId: 'acc-1',
  },
  {
    id: 'tx-402',
    merchant: 'IKEA India',
    description: 'Standing desk and dual monitor arm setup',
    category: 'Shopping',
    amountInPaise: 1850000, // ₹18,500.00
    type: 'expense',
    date: '2026-08-16T15:30:00',
    paymentMethod: 'Credit Card',
    status: 'completed',
    accountId: 'acc-4',
  },
  {
    id: 'tx-403',
    merchant: 'Tata Power Electricity',
    description: 'Air conditioning monsoon usage electricity bill',
    category: 'Utilities & Bills',
    amountInPaise: 540000, // ₹5,400.00
    type: 'expense',
    date: '2026-08-05T14:10:00',
    paymentMethod: 'Net Banking',
    status: 'completed',
    accountId: 'acc-1',
  },
  {
    id: 'tx-404',
    merchant: 'Third Wave Coffee',
    description: 'Specialty coffee beans and morning breakfast',
    category: 'Food & Dining',
    amountInPaise: 82000, // ₹820.00
    type: 'expense',
    date: '2026-08-25T09:00:00',
    paymentMethod: 'UPI',
    status: 'completed',
    accountId: 'acc-1',
  },
  {
    id: 'tx-405',
    merchant: 'Freelance Web Design',
    description: 'Fintech dashboard wireframe milestone',
    category: 'Freelance',
    amountInPaise: 2500000, // ₹25,000.00
    type: 'income',
    date: '2026-08-20T16:00:00',
    paymentMethod: 'Net Banking',
    status: 'completed',
    accountId: 'acc-2',
  },
]

export const INITIAL_PREFERENCES: UserPreferences = {
  currency: 'INR',
  theme: 'light',
  dateFormat: 'DD/MM/YYYY',
  notifications: {
    budgetAlerts: true,
    weeklyDigest: true,
    largeTransactionAlerts: true,
    largeTransactionThresholdPaise: 1000000, // ₹10,000.00
  },
  profile: {
    name: 'Yamin S.',
    email: 'yamin@finflow.dev',
    role: 'Frontend Software Engineer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    joinedDate: 'Jan 2026',
  },
}
