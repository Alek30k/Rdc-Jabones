-- Create function to update updated_at timestamp (if it doesn't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add user_id column to products table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE products ADD COLUMN user_id TEXT NOT NULL DEFAULT 'default_user';
    CREATE INDEX IF NOT EXISTS products_user_id_idx ON products(user_id);
  END IF;
END $$;

-- Add user_id column to expenses table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'expenses' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE expenses ADD COLUMN user_id TEXT NOT NULL DEFAULT 'default_user';
    CREATE INDEX IF NOT EXISTS expenses_user_id_idx ON expenses(user_id);
  END IF;
END $$;

-- Add user_id column to sales table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'sales' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE sales ADD COLUMN user_id TEXT NOT NULL DEFAULT 'default_user';
    CREATE INDEX IF NOT EXISTS sales_user_id_idx ON sales(user_id);
  END IF;
END $$;

-- Add user_id column to alerts table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'alerts' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE alerts ADD COLUMN user_id TEXT NOT NULL DEFAULT 'default_user';
    CREATE INDEX IF NOT EXISTS alerts_user_id_idx ON alerts(user_id);
  END IF;
END $$;

-- Create alert_thresholds table if it doesn't exist
CREATE TABLE IF NOT EXISTS alert_thresholds (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  low_profit_margin DECIMAL(5, 2) DEFAULT 20,
  high_expense_category DECIMAL(10, 2) DEFAULT 500,
  no_sales_days INTEGER DEFAULT 7,
  monthly_revenue_goal DECIMAL(10, 2) DEFAULT 1000,
  expense_limit_percentage DECIMAL(5, 2) DEFAULT 60,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Enable RLS on alert_thresholds if not already enabled
ALTER TABLE alert_thresholds ENABLE ROW LEVEL SECURITY;

-- Create policy for alert_thresholds
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'alert_thresholds' AND policyname = 'Allow all operations on alert_thresholds'
  ) THEN
    CREATE POLICY "Allow all operations on alert_thresholds" 
    ON alert_thresholds FOR ALL 
    USING (true) 
    WITH CHECK (true);
  END IF;
END $$;

-- Create trigger for alert_thresholds updated_at
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_alert_thresholds_updated_at'
  ) THEN
    CREATE TRIGGER update_alert_thresholds_updated_at 
    BEFORE UPDATE ON alert_thresholds
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
