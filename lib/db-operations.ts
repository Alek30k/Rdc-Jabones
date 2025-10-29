import { createClient } from "./supabase/client";

// Generate a unique user ID (in production, use actual authentication)
const getUserId = () => {
  let userId = localStorage.getItem("soap_user_id");
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("soap_user_id", userId);
  }
  return userId;
};

const supabase = createClient();

// Products operations
export const productOperations = {
  async getAll() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("user_id", getUserId())
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(product: {
    name: string;
    cost_per_unit: number;
    price_per_unit: number;
    category: string;
  }) {
    const { data, error } = await supabase
      .from("products")
      .insert({
        ...product,
        user_id: getUserId(),
        units_sold: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .eq("user_id", getUserId())
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)
      .eq("user_id", getUserId());

    if (error) throw error;
  },
};

// Expenses operations
export const expenseOperations = {
  async getAll() {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", getUserId())
      .order("date", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(expense: {
    description: string;
    amount: number;
    category: string;
    date: string;
  }) {
    const { data, error } = await supabase
      .from("expenses")
      .insert({
        ...expense,
        user_id: getUserId(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", id)
      .eq("user_id", getUserId());

    if (error) throw error;
  },
};

// Sales operations
export const saleOperations = {
  async getAll() {
    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .eq("user_id", getUserId())
      .order("date", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(sale: {
    product_id: string;
    quantity: number;
    total_amount: number;
    date: string;
  }) {
    const { data, error } = await supabase
      .from("sales")
      .insert({
        ...sale,
        user_id: getUserId(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from("sales")
      .delete()
      .eq("id", id)
      .eq("user_id", getUserId());

    if (error) throw error;
  },
};

// Alerts operations
export const alertOperations = {
  async getAll() {
    const { data, error } = await supabase
      .from("alerts")
      .select("*")
      .eq("user_id", getUserId())
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(alert: {
    type: "warning" | "error" | "success" | "info";
    title: string;
    message: string;
    action?: string;
  }) {
    const { data, error } = await supabase
      .from("alerts")
      .insert({
        ...alert,
        user_id: getUserId(),
        dismissed: false,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async dismiss(id: string) {
    const { data, error } = await supabase
      .from("alerts")
      .update({ dismissed: true })
      .eq("id", id)
      .eq("user_id", getUserId())
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteAllDismissed() {
    const { error } = await supabase
      .from("alerts")
      .delete()
      .eq("user_id", getUserId())
      .eq("dismissed", true);

    if (error) throw error;
  },
};

// Alert thresholds operations
export const thresholdOperations = {
  async get() {
    const { data, error } = await supabase
      .from("alert_thresholds")
      .select("*")
      .eq("user_id", getUserId())
      .single();

    if (error && error.code !== "PGRST116") throw error; // Ignore "not found" error
    return data;
  },

  async createOrUpdate(thresholds: {
    low_profit_margin: number;
    high_expense_category: number;
    no_sales_days: number;
    monthly_revenue_goal: number;
    expense_limit_percentage: number;
  }) {
    const existing = await this.get();

    if (existing) {
      const { data, error } = await supabase
        .from("alert_thresholds")
        .update(thresholds)
        .eq("user_id", getUserId())
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from("alert_thresholds")
        .insert({
          ...thresholds,
          user_id: getUserId(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },
};
