-- Create settings table for alert thresholds
CREATE TABLE IF NOT EXISTS public.settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  low_profit_margin NUMERIC NOT NULL DEFAULT 20,
  high_expense_category NUMERIC NOT NULL DEFAULT 500,
  no_sales_days INTEGER NOT NULL DEFAULT 7,
  monthly_revenue_goal NUMERIC NOT NULL DEFAULT 1000,
  expense_limit_percentage NUMERIC NOT NULL DEFAULT 60,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create policies for settings (permissive for single-user app)
CREATE POLICY "Enable read access for all users" ON public.settings
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.settings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.settings
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON public.settings
  FOR DELETE USING (true);

-- Insert default settings
INSERT INTO public.settings (id, low_profit_margin, high_expense_category, no_sales_days, monthly_revenue_goal, expense_limit_percentage)
VALUES ('default', 20, 500, 7, 1000, 60)
ON CONFLICT (id) DO NOTHING;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
