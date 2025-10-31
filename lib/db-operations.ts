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

// Products operations
export const productOperations = {
  async getAll() {
    const supabase = createClient();
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
    const supabase = createClient();
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

  async update(id: string, updates: unknown) {
    const supabase = createClient();
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
    const supabase = createClient();
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
    const supabase = createClient();
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
    const supabase = createClient();
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
    const supabase = createClient();
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
    const supabase = createClient();
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
    const supabase = createClient();
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
    const supabase = createClient();
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
    const supabase = createClient();
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
    const supabase = createClient();
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
    const supabase = createClient();
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
    const supabase = createClient();
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
    const supabase = createClient();
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
    const supabase = createClient();
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

// Inventory operations
export const inventoryOperations = {
  async getAll() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("inventory")
      .select("*")
      .eq("user_id", getUserId())
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(item: {
    name: string;
    type: "raw-material" | "finished-product";
    quantity: number;
    unit: string;
    min_stock?: number;
    cost_per_unit?: number;
    supplier?: string;
    notes?: string;
  }) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("inventory")
      .insert({
        ...item,
        user_id: getUserId(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: unknown) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("inventory")
      .update(updates)
      .eq("id", id)
      .eq("user_id", getUserId())
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from("inventory")
      .delete()
      .eq("id", id)
      .eq("user_id", getUserId());

    if (error) throw error;
  },
};

// Customer operations
export const customerOperations = {
  async getAll() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("user_id", getUserId())
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(customer: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    notes?: string;
  }) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("customers")
      .insert({
        ...customer,
        user_id: getUserId(),
        total_purchases: 0,
        total_orders: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: unknown) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("customers")
      .update(updates)
      .eq("id", id)
      .eq("user_id", getUserId())
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from("customers")
      .delete()
      .eq("id", id)
      .eq("user_id", getUserId());

    if (error) throw error;
  },
};

// Order operations
export const orderOperations = {
  async getAll() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        customer:customers(name, email, phone),
        items:order_items(
          *,
          product:products(name, price_per_unit)
        )
      `
      )
      .eq("user_id", getUserId())
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(order: {
    customer_id?: string;
    status: string;
    total_amount: number;
    payment_status: string;
    delivery_date?: string;
    notes?: string;
    items: Array<{
      product_id: string;
      quantity: number;
      unit_price: number;
      subtotal: number;
    }>;
  }) {
    const supabase = createClient();

    // Create order
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: getUserId(),
        customer_id: order.customer_id,
        status: order.status,
        total_amount: order.total_amount,
        payment_status: order.payment_status,
        delivery_date: order.delivery_date,
        notes: order.notes,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const itemsWithOrderId = order.items.map((item) => ({
      ...item,
      order_id: orderData.id,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(itemsWithOrderId);

    if (itemsError) throw itemsError;

    // Update customer stats if customer exists
    if (order.customer_id) {
      const { data: customer } = await supabase
        .from("customers")
        .select("total_purchases, total_orders")
        .eq("id", order.customer_id)
        .single();

      if (customer) {
        await supabase
          .from("customers")
          .update({
            total_purchases:
              Number(customer.total_purchases) + order.total_amount,
            total_orders: customer.total_orders + 1,
            last_purchase_date: new Date().toISOString().split("T")[0],
          })
          .eq("id", order.customer_id);
      }
    }

    return orderData;
  },

  async update(id: string, updates: unknown) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", id)
      .eq("user_id", getUserId())
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", id)
      .eq("user_id", getUserId());

    if (error) throw error;
  },
};

// Cash flow operations
export const cashFlowOperations = {
  async getAll() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("cash_flow")
      .select("*")
      .eq("user_id", getUserId())
      .order("date", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(entry: {
    type: "income" | "expense";
    amount: number;
    category: string;
    description: string;
    date: string;
    is_recurring?: boolean;
    recurrence_period?: string;
  }) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("cash_flow")
      .insert({
        ...entry,
        user_id: getUserId(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: unknown) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("cash_flow")
      .update(updates)
      .eq("id", id)
      .eq("user_id", getUserId())
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from("cash_flow")
      .delete()
      .eq("id", id)
      .eq("user_id", getUserId());

    if (error) throw error;
  },

  async getByDateRange(startDate: string, endDate: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("cash_flow")
      .select("*")
      .eq("user_id", getUserId())
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: true });

    if (error) throw error;
    return data || [];
  },
};

// Goals operations
export const goalsOperations = {
  async getAll() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", getUserId())
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(goal: {
    title: string;
    description?: string;
    type: string;
    target_value: number;
    start_date: string;
    end_date: string;
  }) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("goals")
      .insert({
        ...goal,
        user_id: getUserId(),
        current_value: 0,
        status: "active",
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: unknown) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("goals")
      .update(updates)
      .eq("id", id)
      .eq("user_id", getUserId())
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from("goals")
      .delete()
      .eq("id", id)
      .eq("user_id", getUserId());

    if (error) throw error;
  },
};
