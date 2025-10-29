-- Complete Database Setup Script for Soap Business Manager
-- Run this script in your Supabase SQL Editor to create all tables

-- ============================================
-- 1. CREATE PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  cost_per_unit NUMERIC(10, 2) NOT NULL,
  price_per_unit NUMERIC(10, 2) NOT NULL,
  units_sold INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on products"
  ON products
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- ============================================
-- 2. CREATE SALES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS sales (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  total_amount NUMERIC(10, 2) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on sales"
  ON sales
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_sales_product_id ON sales(product_id);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(date);

-- ============================================
-- 3. CREATE EXPENSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  description TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  category TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on expenses"
  ON expenses
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);

-- ============================================
-- 4. CREATE ALERTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS alerts (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('warning', 'error', 'success', 'info')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action TEXT,
  dismissed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on alerts"
  ON alerts
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_alerts_dismissed ON alerts(dismissed);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at DESC);

-- ============================================
-- 5. CREATE SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  low_profit_margin NUMERIC NOT NULL DEFAULT 20,
  high_expense_category NUMERIC NOT NULL DEFAULT 500,
  no_sales_days INTEGER NOT NULL DEFAULT 7,
  monthly_revenue_goal NUMERIC NOT NULL DEFAULT 1000,
  expense_limit_percentage NUMERIC NOT NULL DEFAULT 60,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON settings
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON settings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON settings
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON settings
  FOR DELETE USING (true);

-- Insert default settings
INSERT INTO settings (id, low_profit_margin, high_expense_category, no_sales_days, monthly_revenue_goal, expense_limit_percentage)
VALUES ('default', 20, 500, 7, 1000, 60)
ON CONFLICT (id) DO NOTHING;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();
