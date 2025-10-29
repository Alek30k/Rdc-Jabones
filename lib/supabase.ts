import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types matching our database schema
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          cost_per_unit: number;
          price_per_unit: number;
          units_sold: number;
          category: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["products"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };
      expenses: {
        Row: {
          id: string;
          user_id: string;
          description: string;
          amount: number;
          category: string;
          date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["expenses"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["expenses"]["Insert"]>;
      };
      sales: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          quantity: number;
          total_amount: number;
          date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["sales"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["sales"]["Insert"]>;
      };
      alerts: {
        Row: {
          id: string;
          user_id: string;
          type: "warning" | "error" | "success" | "info";
          title: string;
          message: string;
          action: string | null;
          dismissed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["alerts"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["alerts"]["Insert"]>;
      };
      alert_thresholds: {
        Row: {
          id: string;
          user_id: string;
          low_profit_margin: number;
          high_expense_category: number;
          no_sales_days: number;
          monthly_revenue_goal: number;
          expense_limit_percentage: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["alert_thresholds"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["alert_thresholds"]["Insert"]
        >;
      };
    };
  };
}
