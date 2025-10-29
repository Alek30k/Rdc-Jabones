-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  cost_per_unit NUMERIC(10, 2) NOT NULL,
  price_per_unit NUMERIC(10, 2) NOT NULL,
  units_sold INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create permissive policies (no auth required for this personal app)
CREATE POLICY "Allow all operations on products"
  ON products
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
