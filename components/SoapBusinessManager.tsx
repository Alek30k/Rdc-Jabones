"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  ShoppingCart,
  Calculator,
  BarChart3,
  Download,
  PieChart,
  Plus,
  Trash2,
  LineChartIcon,
  Bell,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  Settings,
} from "lucide-react";
// Import chart components
import { Area, AreaChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { createClient } from "@/lib/supabase/client";
import FinancialDashboard from "./FinancialDashboard";
import ProductionCalendar from "./ProductionCalendar";
import PriceSimulator from "./PriceSimulator";
import DarkModeToggle from "./DarkModeToggle";
import ExpensesManager from "./ui/ExpensesManager";
import ProductsManager from "./ProductsManager";

// Types
interface Product {
  id: string;
  name: string;
  costPerUnit: number;
  pricePerUnit: number;
  unitsSold: number;
  category: string;
  stock: number;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface Sale {
  id: string;
  productId: string;
  quantity: number;
  totalAmount: number;
  date: string;
}

interface BusinessAlert {
  id: string;
  type: "warning" | "error" | "success" | "info";
  title: string;
  message: string;
  action?: string;
  dismissed: boolean;
  createdAt: string;
}

interface AlertThresholds {
  lowProfitMargin: number;
  highExpenseCategory: number;
  noSalesDays: number;
  monthlyRevenueGoal: number;
  expenseLimitPercentage: number;
  lowStockThreshold: number;
}

const defaultNewSale = {
  productId: "",
  quantity: "",
  date: new Date().toISOString().split("T")[0],
};
const defaultThresholds = {
  lowProfitMargin: 20,
  highExpenseCategory: 500,
  noSalesDays: 7,
  monthlyRevenueGoal: 50000,
  expenseLimitPercentage: 60,
  lowStockThreshold: 10,
};

export default function SoapBusinessManager() {
  const supabase = createClient();

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [alerts, setAlerts] = useState<BusinessAlert[]>([]);
  const [thresholds, setThresholds] =
    useState<AlertThresholds>(defaultThresholds);

  const [activeTab, setActiveTab] = useState("dashboard");

  const [newSale, setNewSale] = useState(defaultNewSale);

  const [mounted, setMounted] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "checking" | "connected" | "error"
  >("checking");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const testConnection = async () => {
      console.log("[v0] Testing Supabase connection...");
      try {
        const { error } = await supabase
          .from("products")
          .select("count", { count: "exact", head: true });

        if (error) {
          console.error("[v0] Connection test failed:", error);
          console.error("[v0] Error details:", {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
          });
          setConnectionStatus("error");
          toast.error(`Error de conexión: ${error.message}`);
        } else {
          console.log("[v0] Connection test successful!");
          setConnectionStatus("connected");
        }
      } catch (error) {
        console.error("[v0] Connection test exception:", error);
        setConnectionStatus("error");
        toast.error("Error al conectar con Supabase");
      }
    };

    testConnection();
  }, [mounted, supabase]);

  useEffect(() => {
    if (!mounted || connectionStatus !== "connected") return;

    console.log("[v0] Component mounted, loading data from Supabase...");

    const loadData = async () => {
      try {
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*");

        if (productsError) {
          console.error("[v0] Error loading products:", productsError);
          console.error("[v0] Error details:", {
            message: productsError.message,
            details: productsError.details,
            hint: productsError.hint,
            code: productsError.code,
          });
          toast.error("Error al cargar productos");
        } else if (productsData) {
          const formattedProducts = productsData.map((p) => ({
            id: p.id,
            name: p.name,
            costPerUnit: p.cost_per_unit,
            pricePerUnit: p.price_per_unit,
            unitsSold: p.units_sold,
            category: p.category,
            stock: p.stock ?? 0,
          }));
          console.log("[v0] Loaded products from Supabase:", formattedProducts);
          setProducts(formattedProducts);
        }

        const { data: expensesData, error: expensesError } = await supabase
          .from("expenses")
          .select("*");

        if (expensesError) {
          console.error("[v0] Error loading expenses:", expensesError);
          console.error("[v0] Error details:", {
            message: expensesError.message,
            details: expensesError.details,
            hint: expensesError.hint,
            code: expensesError.code,
          });
          toast.error("Error al cargar gastos");
        } else if (expensesData) {
          const formattedExpenses = expensesData.map((e) => ({
            id: e.id,
            description: e.description,
            amount: e.amount,
            category: e.category,
            date: e.date,
          }));
          console.log(
            "[v0] Loaded expenses from Supabase:",
            formattedExpenses.length
          );
          setExpenses(formattedExpenses);
        }

        const { data: salesData, error: salesError } = await supabase
          .from("sales")
          .select("*");

        if (salesError) {
          console.error("[v0] Error loading sales:", salesError);
          console.error("[v0] Error details:", {
            message: salesError.message,
            details: salesError.details,
            hint: salesError.hint,
            code: salesError.code,
          });
          toast.error("Error al cargar ventas");
        } else if (salesData) {
          const formattedSales = salesData.map((s) => ({
            id: s.id,
            productId: s.product_id,
            quantity: s.quantity,
            totalAmount: s.total_amount,
            date: s.date,
          }));
          console.log(
            "[v0] Loaded sales from Supabase:",
            formattedSales.length
          );
          setSales(formattedSales);
        }

        const { data: alertsData, error: alertsError } = await supabase
          .from("alerts")
          .select("*");

        if (alertsError) {
          console.error("[v0] Error loading alerts:", alertsError);
          console.error("[v0] Error details:", {
            message: alertsError.message,
            details: alertsError.details,
            hint: alertsError.hint,
            code: alertsError.code,
          });
          toast.error("Error al cargar alertas");
        } else if (alertsData) {
          const formattedAlerts = alertsData.map((a) => ({
            id: a.id,
            type: a.type as "warning" | "error" | "success" | "info",
            title: a.title,
            message: a.message,
            action: a.action,
            dismissed: a.dismissed,
            createdAt: a.created_at,
          }));
          console.log(
            "[v0] Loaded alerts from Supabase:",
            formattedAlerts.length
          );
          setAlerts(formattedAlerts);
        }

        const { data: settingsData, error: settingsError } = await supabase
          .from("settings")
          .select("*")
          .eq("id", "default")
          .single();

        if (settingsError) {
          if (settingsError.code === "PGRST116") {
            console.log("[v0] No settings found, creating default...");
            const defaultSettings = {
              id: "default",
              low_profit_margin: 20,
              high_expense_category: 500,
              no_sales_days: 7,
              monthly_revenue_goal: 1000,
              expense_limit_percentage: 60,
            };
            const { error: insertError } = await supabase
              .from("settings")
              .insert(defaultSettings);
            if (insertError) {
              console.error(
                "[v0] Error creating default settings:",
                insertError
              );
            } else {
              setThresholds({
                lowProfitMargin: defaultSettings.low_profit_margin,
                highExpenseCategory: defaultSettings.high_expense_category,
                noSalesDays: defaultSettings.no_sales_days,
                monthlyRevenueGoal: defaultSettings.monthly_revenue_goal,
                expenseLimitPercentage:
                  defaultSettings.expense_limit_percentage,
                lowStockThreshold: settingsData.low_stock_threshold,
              });
            }
          } else {
            console.error("[v0] Error loading settings:", settingsError);
            toast.error("Error al cargar configuración");
          }
        } else if (settingsData) {
          setThresholds({
            lowProfitMargin: settingsData.low_profit_margin,
            highExpenseCategory: settingsData.high_expense_category,
            noSalesDays: settingsData.no_sales_days,
            monthlyRevenueGoal: settingsData.monthly_revenue_goal,
            expenseLimitPercentage: settingsData.expense_limit_percentage,
            lowStockThreshold: settingsData.low_stock_threshold,
          });
          console.log("[v0] Loaded settings from Supabase");
        }

        console.log("[v0] Data loading complete!");
      } catch (error) {
        console.error("[v0] Error loading from Supabase:", error);
        toast.error("Error al cargar datos");
      }
    };

    loadData();
  }, [mounted, supabase, connectionStatus]);

  useEffect(() => {
    if (!mounted) return;

    const saveAlerts = async () => {
      const newAlerts = alerts.filter((alert) => {
        const createdTime = new Date(alert.createdAt).getTime();
        const now = Date.now();
        return now - createdTime < 2000;
      });

      if (newAlerts.length > 0) {
        console.log("[v0] Saving new alerts to Supabase:", newAlerts.length);
        const { error } = await supabase.from("alerts").insert(
          newAlerts.map((a) => ({
            id: a.id,
            type: a.type,
            title: a.title,
            message: a.message,
            action: a.action,
            dismissed: a.dismissed,
            created_at: a.createdAt,
          }))
        );

        if (error) {
          console.error("[v0] Error saving alerts:", error);
        }
      }

      const dismissedAlerts = alerts.filter((alert) => alert.dismissed);
      if (dismissedAlerts.length > 0) {
        for (const alert of dismissedAlerts) {
          const { error } = await supabase
            .from("alerts")
            .update({ dismissed: true })
            .eq("id", alert.id);

          if (error) {
            console.error("[v0] Error updating alert:", error);
          }
        }
      }
    };

    saveAlerts();
  }, [alerts, mounted, supabase]);

  useEffect(() => {
    if (!mounted) return;

    const saveSettings = async () => {
      console.log("[v0] Saving settings to Supabase");
      const { error } = await supabase
        .from("settings")
        .update({
          low_profit_margin: thresholds.lowProfitMargin,
          high_expense_category: thresholds.highExpenseCategory,
          no_sales_days: thresholds.noSalesDays,
          monthly_revenue_goal: thresholds.monthlyRevenueGoal,
          expense_limit_percentage: thresholds.expenseLimitPercentage,
          low_stock_threshold: thresholds.lowStockThreshold,
        })
        .eq("id", "default");

      if (error) {
        console.error("[v0] Error saving settings:", error);
      }
    };

    saveSettings();
  }, [thresholds, mounted, supabase]);

  useEffect(() => {
    if (!mounted) return;
    checkForAlerts();
  }, [mounted]);

  const checkForAlerts = useCallback(() => {
    const newAlerts: BusinessAlert[] = [];

    products.forEach((product) => {
      if (product.unitsSold > 0) {
        const margin =
          ((product.pricePerUnit - product.costPerUnit) /
            product.pricePerUnit) *
          100;
        if (margin < thresholds.lowProfitMargin) {
          const existingAlert = alerts.find(
            (a) =>
              a.title === `Baja rentabilidad: ${product.name}` && !a.dismissed
          );
          if (!existingAlert) {
            newAlerts.push({
              id: `low-profit-${product.id}-${Date.now()}`,
              type: "warning",
              title: `Baja rentabilidad: ${product.name}`,
              message: `Este producto tiene un margen de ganancia de solo ${margin.toFixed(1)}%. Considera aumentar el precio o reducir costos.`,
              action: "Revisar precios",
              dismissed: false,
              createdAt: new Date().toISOString(),
            });
          }
        }
      }
    });

    const expensesByCategory = expenses.reduce(
      (acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      },
      {} as Record<string, number>
    );

    Object.entries(expensesByCategory).forEach(([category, amount]) => {
      if (amount > thresholds.highExpenseCategory) {
        const existingAlert = alerts.find(
          (a) => a.title === `Gastos altos en ${category}` && !a.dismissed
        );
        if (!existingAlert) {
          newAlerts.push({
            id: `high-expense-${category}-${Date.now()}`,
            type: "warning",
            title: `Gastos altos en ${category}`,
            message: `Has gastado $${amount.toFixed(2)} en ${category.replace("-", " ")}. Revisa si puedes optimizar estos gastos.`,
            action: "Ver gastos",
            dismissed: false,
            createdAt: new Date().toISOString(),
          });
        }
      }
    });

    const today = new Date();
    products.forEach((product) => {
      const lastSale = sales
        .filter((s) => s.productId === product.id)
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];

      if (lastSale) {
        const daysSinceLastSale = Math.floor(
          (today.getTime() - new Date(lastSale.date).getTime()) /
            (1000 * 60 * 60 * 24)
        );
        if (daysSinceLastSale > thresholds.noSalesDays) {
          const existingAlert = alerts.find(
            (a) => a.title === `Sin ventas: ${product.name}` && !a.dismissed
          );
          if (!existingAlert) {
            newAlerts.push({
              id: `no-sales-${product.id}-${Date.now()}`,
              type: "info",
              title: `Sin ventas: ${product.name}`,
              message: `Este producto no ha tenido ventas en ${daysSinceLastSale} días. Considera una promoción o revisión.`,
              action: "Crear promoción",
              dismissed: false,
              createdAt: new Date().toISOString(),
            });
          }
        }
      }
    });

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = sales
      .filter((sale) => {
        const saleDate = new Date(sale.date);
        return (
          saleDate.getMonth() === currentMonth &&
          saleDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, sale) => sum + sale.totalAmount, 0);

    if (monthlyRevenue >= thresholds.monthlyRevenueGoal) {
      const existingAlert = alerts.find(
        (a) => a.title === "¡Meta mensual alcanzada!" && !a.dismissed
      );
      if (!existingAlert) {
        newAlerts.push({
          id: `goal-reached-${Date.now()}`,
          type: "success",
          title: "¡Meta mensual alcanzada!",
          message: `¡Felicitaciones! Has alcanzado tu meta de ingresos de $${thresholds.monthlyRevenueGoal.toFixed(2)} este mes.`,
          dismissed: false,
          createdAt: new Date().toISOString(),
        });

        if (newAlerts.find((a) => a.id === `goal-reached-${Date.now()}`)) {
          toast.success("¡Meta mensual alcanzada!", { duration: 5000 });
        }
      }
    }

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const totalProductCosts = sales.reduce((sum, sale) => {
      const product = products.find((p) => p.id === sale.productId);
      return sum + (product ? product.costPerUnit * sale.quantity : 0);
    }, 0);

    const totalCosts = totalExpenses + totalProductCosts;
    const expenseRatio =
      totalRevenue > 0 ? (totalCosts / totalRevenue) * 100 : 0;

    if (expenseRatio > thresholds.expenseLimitPercentage && totalRevenue > 0) {
      const existingAlert = alerts.find(
        (a) => a.title === "Gastos muy altos" && !a.dismissed
      );
      if (!existingAlert) {
        newAlerts.push({
          id: `high-expense-ratio-${Date.now()}`,
          type: "error",
          title: "Gastos muy altos",
          message: `Tus gastos representan ${expenseRatio.toFixed(1)}% de tus ingresos. Intenta reducirlos para mejorar la rentabilidad.`,
          action: "Analizar gastos",
          dismissed: false,
          createdAt: new Date().toISOString(),
        });
      }
    }

    products.forEach((product) => {
      if (product.unitsSold > 0) {
        const profitPerUnit = product.pricePerUnit - product.costPerUnit;
        if (profitPerUnit > 0) {
          const productShare =
            totalExpenses / (products.length > 0 ? products.length : 1);
          const breakEvenUnits = Math.ceil(productShare / profitPerUnit);

          if (
            product.unitsSold >= breakEvenUnits &&
            product.unitsSold < breakEvenUnits + 5
          ) {
            const existingAlert = alerts.find(
              (a) =>
                a.title === `¡${product.name} alcanzó punto de equilibrio!` &&
                !a.dismissed
            );
            if (!existingAlert) {
              newAlerts.push({
                id: `break-even-${product.id}-${Date.now()}`,
                type: "success",
                title: `¡${product.name} alcanzó punto de equilibrio!`,
                message: `Este producto ya cubrió sus costos con ${product.unitsSold} unidades vendidas. ¡Ahora es pura ganancia!`,
                dismissed: false,
                createdAt: new Date().toISOString(),
              });
            }
          }
        }
      }
    });

    if (newAlerts.length > 0) {
      setAlerts([...alerts, ...newAlerts]);
      newAlerts.forEach((alert) => {
        if (alert.type === "error") {
          toast.error(`${alert.title}: ${alert.message}`, { duration: 5000 });
        } else if (alert.type === "success") {
          toast.success(`${alert.title}: ${alert.message}`, { duration: 5000 });
        } else if (alert.type === "warning") {
          toast(`${"⚠️"} ${alert.title}: ${alert.message}`, { duration: 5000 });
        } else if (alert.type === "info") {
          toast(`${"ℹ️"} ${alert.title}: ${alert.message}`, { duration: 5000 });
        }
      });
    }
  }, [products, sales, expenses, thresholds, alerts]);

  const dismissAlert = (alertId: string) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === alertId ? { ...alert, dismissed: true } : alert
      )
    );
  };

  const clearDismissedAlerts = async () => {
    const dismissedCount = alerts.filter((a) => a.dismissed).length;
    const dismissedIds = alerts.filter((a) => a.dismissed).map((a) => a.id);

    if (dismissedIds.length > 0) {
      const { error } = await supabase
        .from("alerts")
        .delete()
        .in("id", dismissedIds);

      if (error) {
        console.error("[v0] Error deleting alerts:", error);
        toast.error("Error al eliminar alertas");
        return;
      }
    }

    setAlerts(alerts.filter((a) => !a.dismissed));
    toast.success(`${dismissedCount} alertas antiguas eliminadas`);
  };

  const manualCheckAlerts = () => {
    checkForAlerts();
    toast.info("🔍 Revisión de alertas completada");
  };

  const handleAlertAction = (action: string) => {
    if (action === "Analizar gastos" || action === "Ver gastos") {
      setActiveTab("expenses");
      toast.info("📊 Navegando a la sección de gastos");
    } else if (action === "Revisar precios") {
      setActiveTab("products");
      toast.info("💰 Navegando a la sección de productos");
    } else if (action === "Crear promoción") {
      setActiveTab("products");
      toast.info("🎁 Navegando a la sección de productos");
    }
  };

  const addSale = async () => {
    if (!newSale.productId || !newSale.quantity) {
      toast.error(
        "Por favor, selecciona un producto y una cantidad para la venta."
      );
      return;
    }

    const product = products.find((p) => p.id === newSale.productId);
    if (!product) {
      toast.error("Producto no encontrado.");
      return;
    }

    const quantity = Number.parseInt(newSale.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      toast.error("La cantidad debe ser un número entero positivo.");
      return;
    }

    const sale: Sale = {
      id: Date.now().toString(),
      productId: newSale.productId,
      quantity: quantity,
      totalAmount: product.pricePerUnit * quantity,
      date: newSale.date,
    };

    try {
      const { error: saleError } = await supabase.from("sales").insert({
        id: sale.id,
        product_id: sale.productId,
        quantity: sale.quantity,
        total_amount: sale.totalAmount,
        date: sale.date,
      });

      if (saleError) {
        console.error("[v0] Error inserting sale:", saleError);
        toast.error("Error al guardar la venta");
        return;
      }

      const newUnitsSold = product.unitsSold + quantity;
      const newStock = Math.max(0, (product.stock ?? 0) - quantity);

      const { error: productError } = await supabase
        .from("products")
        .update({
          units_sold: newUnitsSold,
          stock: newStock,
        })
        .eq("id", product.id);

      if (productError) {
        console.error("[v0] Error updating product:", productError);
        toast.error("Error al actualizar producto");
        return;
      }

      setProducts(
        products.map((p) =>
          p.id === product.id
            ? { ...p, unitsSold: newUnitsSold, stock: newStock }
            : p
        )
      );

      if (productError) {
        console.error("[v0] Error updating product units:", productError);
        toast.error("Error al actualizar unidades vendidas");
        return;
      }

      setSales([...sales, sale]);
      setProducts(
        products.map((p) =>
          p.id === newSale.productId ? { ...p, unitsSold: newUnitsSold } : p
        )
      );

      setNewSale(defaultNewSale);

      toast.success(
        `Venta registrada: ${quantity}x ${product.name} - $${sale.totalAmount.toFixed(2)}`
      );
    } catch (error) {
      console.error("[v0] Error adding sale:", error);
      toast.error("Error al agregar venta");
    }
  };

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const totalProductCosts = sales.reduce((sum, sale) => {
    const product = products.find((p) => p.id === sale.productId);
    return sum + (product ? product.costPerUnit * sale.quantity : 0);
  }, 0);
  const netProfit = totalRevenue - totalExpenses - totalProductCosts;
  const profitMargin =
    totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(2) : "0";

  const bestSellers = [...products]
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, 5);

  const activeAlerts = alerts.filter((alert) => !alert.dismissed);

  const exportData = () => {
    const data = {
      products,
      expenses,
      sales,
      alerts,
      thresholds,
      summary: {
        totalRevenue,
        totalExpenses,
        totalProductCosts,
        netProfit,
        profitMargin,
      },
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `soap-business-${new Date().toISOString().split("T")[0]}.json`;
    a.click();

    toast.success(
      "📥 Datos exportados: El archivo se ha descargado exitosamente"
    );
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "error":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Gestión Financiera
            </h1>

            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Control completo de tu emprendimiento de jabones artesanales
            </p>
          </div>
          <div className="flex gap-2">
            {activeAlerts.length > 0 && (
              <Badge variant="destructive" className="animate-pulse">
                {activeAlerts.length} alerta{activeAlerts.length > 1 ? "s" : ""}
              </Badge>
            )}
            <Button
              onClick={exportData}
              variant="outline"
              className="gap-2 bg-transparent"
            >
              <Download className="w-4 h-4" />
              Exportar Datos
            </Button>
            <DarkModeToggle />
          </div>
        </div>

        {activeAlerts.filter((a) => a.type === "error" || a.type === "warning")
          .length > 0 && (
          <Alert variant="destructive" className="border-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Atención requerida</AlertTitle>
            <AlertDescription>
              Tienes{" "}
              {
                activeAlerts.filter(
                  (a) => a.type === "error" || a.type === "warning"
                ).length
              }{" "}
              alertas que requieren tu atención. Revisa la pestaña de Alertas.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Ingresos Totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${totalRevenue.toFixed(2)}
              </div>
              <p className="text-xs text-green-100 mt-1">
                {sales.length} ventas registradas
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-pink-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                Gastos Totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${(totalExpenses + totalProductCosts).toFixed(2)}
              </div>
              <p className="text-xs text-red-100 mt-1">
                {expenses.length} gastos registrados
              </p>
            </CardContent>
          </Card>

          <Card
            className={`bg-gradient-to-br ${netProfit >= 0 ? "from-blue-500 to-cyan-600" : "from-orange-500 to-red-600"} text-white border-0`}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {netProfit >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                Ganancia Neta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${netProfit.toFixed(2)}</div>
              <p className="text-xs text-blue-100 mt-1">
                Margen: {profitMargin}%
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Package className="w-4 h-4" />
                Productos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{products.length}</div>
              <p className="text-xs text-purple-100 mt-1">
                {products.reduce((sum, p) => sum + p.unitsSold, 0)} unidades
                vendidas
              </p>
              <p className="text-xs text-purple-100">
                Stock total:{" "}
                {products.reduce((sum, p) => sum + (p.stock ?? 0), 0)}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-7 gap-2 mb-18 md:mb-0">
            <TabsTrigger value="dashboard" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="alerts" className="gap-2 relative">
              <Bell className="w-4 h-4" />
              Alertas
              {activeAlerts.length > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {activeAlerts.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2">
              <Package className="w-4 h-4" />
              Productos
            </TabsTrigger>
            <TabsTrigger value="sales" className="gap-2">
              <ShoppingCart className="w-4 h-4" />
              Ventas
            </TabsTrigger>
            <TabsTrigger value="expenses" className="gap-2">
              <DollarSign className="w-4 h-4" />
              Gastos
            </TabsTrigger>
            <TabsTrigger value="inventory" className="gap-2">
              <Package className="w-4 h-4" />
              Inventario
            </TabsTrigger>
            <TabsTrigger value="calculator" className="gap-2">
              <Calculator className="w-4 h-4" />
              Calculadora
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <LineChartIcon className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Configuración de Alertas
                  </CardTitle>
                  <CardDescription>
                    Personaliza los umbrales para recibir notificaciones
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="low-profit">
                        Margen de ganancia mínimo (%)
                      </Label>
                      <Input
                        id="low-profit"
                        type="number"
                        value={thresholds.lowProfitMargin}
                        onChange={(e) =>
                          setThresholds({
                            ...thresholds,
                            lowProfitMargin: Number.parseFloat(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="high-expense">
                        Límite de gasto por categoría ($)
                      </Label>
                      <Input
                        id="high-expense"
                        type="number"
                        value={thresholds.highExpenseCategory}
                        onChange={(e) =>
                          setThresholds({
                            ...thresholds,
                            highExpenseCategory: Number.parseFloat(
                              e.target.value
                            ),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="no-sales">Días sin ventas</Label>
                      <Input
                        id="no-sales"
                        type="number"
                        value={thresholds.noSalesDays}
                        onChange={(e) =>
                          setThresholds({
                            ...thresholds,
                            noSalesDays: Number.parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="revenue-goal">
                        Meta mensual de ingresos ($)
                      </Label>
                      <Input
                        id="revenue-goal"
                        type="number"
                        value={thresholds.monthlyRevenueGoal}
                        onChange={(e) =>
                          setThresholds({
                            ...thresholds,
                            monthlyRevenueGoal: Number.parseFloat(
                              e.target.value
                            ),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expense-limit">
                        Límite de gastos vs ingresos (%)
                      </Label>
                      <Input
                        id="expense-limit"
                        type="number"
                        value={thresholds.expenseLimitPercentage}
                        onChange={(e) =>
                          setThresholds({
                            ...thresholds,
                            expenseLimitPercentage: Number.parseFloat(
                              e.target.value
                            ),
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    <Button
                      onClick={clearDismissedAlerts}
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-transparent"
                    >
                      <Trash2 className="w-4 h-4" />
                      Limpiar alertas antiguas
                    </Button>
                    <Button
                      onClick={manualCheckAlerts}
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-transparent"
                    >
                      <Bell className="w-4 h-4" />
                      Revisar alertas ahora
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Alertas Activas ({activeAlerts.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activeAlerts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-500" />
                      <p>¡Todo en orden! No hay alertas activas.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activeAlerts.map((alert) => (
                        <Alert
                          key={alert.id}
                          variant={
                            alert.type === "error" ? "destructive" : "default"
                          }
                          className="relative"
                        >
                          <div className="flex items-start gap-3">
                            {getAlertIcon(alert.type)}
                            <div className="flex-1">
                              <AlertTitle>{alert.title}</AlertTitle>
                              <AlertDescription>
                                {alert.message}
                              </AlertDescription>
                              {alert.action && (
                                <Button
                                  onClick={() =>
                                    handleAlertAction(alert.action!)
                                  }
                                  variant="outline"
                                  size="sm"
                                  className="mt-2"
                                >
                                  {alert.action}
                                </Button>
                              )}
                            </div>
                            <Button
                              onClick={() => dismissAlert(alert.id)}
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </Alert>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    Críticas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {
                      alerts.filter((a) => a.type === "error" && !a.dismissed)
                        .length
                    }
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    Advertencias
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {
                      alerts.filter((a) => a.type === "warning" && !a.dismissed)
                        .length
                    }
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-600" />
                    Informativas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {
                      alerts.filter((a) => a.type === "info" && !a.dismissed)
                        .length
                    }
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Éxitos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {
                      alerts.filter((a) => a.type === "success" && !a.dismissed)
                        .length
                    }
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Productos Más Vendidos
                  </CardTitle>
                  <CardDescription>
                    Top 5 productos por unidades vendidas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {bestSellers.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        No hay ventas registradas aún
                      </p>
                    ) : (
                      bestSellers.map((product, index) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {product.unitsSold} unidades
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary">
                            $
                            {(product.pricePerUnit * product.unitsSold).toFixed(
                              2
                            )}
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-purple-600" />
                    Gastos por Categoría
                  </CardTitle>
                  <CardDescription>Distribución de tus gastos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {expenses.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        No hay gastos registrados aún
                      </p>
                    ) : (
                      (() => {
                        const expensesByCategory = expenses.reduce(
                          (acc, expense) => {
                            acc[expense.category] =
                              (acc[expense.category] || 0) + expense.amount;
                            return acc;
                          },
                          {} as Record<string, number>
                        );

                        return Object.entries(expensesByCategory).map(
                          ([category, amount]) => {
                            const percentage = (
                              (amount / totalExpenses) *
                              100
                            ).toFixed(1);
                            return (
                              <div key={category} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="font-medium capitalize">
                                    {category.replace("-", " ")}
                                  </span>
                                  <span className="text-gray-600 dark:text-gray-400">
                                    ${amount.toFixed(2)} ({percentage}%)
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            );
                          }
                        );
                      })()
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  Rentabilidad por Producto
                </CardTitle>
                <CardDescription>
                  Análisis de margen de ganancia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {products.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      Agrega productos para ver el análisis
                    </p>
                  ) : (
                    products.map((product) => {
                      const profit = product.pricePerUnit - product.costPerUnit;
                      const margin =
                        product.pricePerUnit > 0
                          ? ((profit / product.pricePerUnit) * 100).toFixed(1)
                          : "N/A";
                      const totalProfit = profit * product.unitsSold;

                      return (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 ">
                              Costo: ${product.costPerUnit.toFixed(2)} | Precio:
                              ${product.pricePerUnit.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">
                              ${profit.toFixed(2)}/unidad
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Margen: {margin}% | Total: $
                              {totalProfit.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <ProductsManager />
          </TabsContent>

          <TabsContent value="sales" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Registrar Venta
                </CardTitle>
                <CardDescription>Anota una nueva venta</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sale-product">Producto</Label>
                    <Select
                      value={newSale.productId}
                      onValueChange={(value) =>
                        setNewSale({ ...newSale, productId: value })
                      }
                    >
                      <SelectTrigger id="sale-product">
                        <SelectValue placeholder="Selecciona un producto" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} (${product.pricePerUnit.toFixed(2)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sale-quantity">Cantidad</Label>
                    <Input
                      id="sale-quantity"
                      type="number"
                      min="1"
                      placeholder="1"
                      value={newSale.quantity}
                      onChange={(e) =>
                        setNewSale({ ...newSale, quantity: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sale-date">Fecha</Label>
                    <Input
                      id="sale-date"
                      type="date"
                      value={newSale.date}
                      onChange={(e) =>
                        setNewSale({ ...newSale, date: e.target.value })
                      }
                    />
                  </div>
                </div>
                <Button
                  onClick={addSale}
                  className="mt-4 w-full md:w-auto"
                  disabled={!newSale.productId || !newSale.quantity}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Registrar Venta
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Historial de Ventas</CardTitle>
                <CardDescription>
                  {sales.length} ventas registradas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sales.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No hay ventas registradas
                    </p>
                  ) : (
                    [...sales].reverse().map((sale) => {
                      const product = products.find(
                        (p) => p.id === sale.productId
                      );
                      return (
                        <div
                          key={sale.id}
                          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium">
                              {product?.name || "Producto eliminado"}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {sale.quantity} unidades × $
                              {product?.pricePerUnit.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">
                              ${sale.totalAmount.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(sale.date).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-2"
                            onClick={async () => {
                              try {
                                const { error: saleError } = await supabase
                                  .from("sales")
                                  .delete()
                                  .eq("id", sale.id);

                                if (saleError) {
                                  console.error(
                                    "[v0] Error deleting sale:",
                                    saleError
                                  );
                                  toast.error("Error al eliminar la venta");
                                  return;
                                }

                                if (product) {
                                  const newUnitsSold = Math.max(
                                    0,
                                    product.unitsSold - sale.quantity
                                  );
                                  const { error: productError } = await supabase
                                    .from("products")
                                    .update({ units_sold: newUnitsSold })
                                    .eq("id", product.id);

                                  if (productError) {
                                    console.error(
                                      "[v0] Error updating product units:",
                                      productError
                                    );
                                    toast.error("Error al actualizar unidades");
                                    return;
                                  }

                                  setProducts(
                                    products.map((p) =>
                                      p.id === product.id
                                        ? { ...p, unitsSold: newUnitsSold }
                                        : p
                                    )
                                  );
                                }

                                setSales(sales.filter((s) => s.id !== sale.id));
                                toast.success("Venta eliminada");
                              } catch (error) {
                                console.error(
                                  "[v0] Error deleting sale:",
                                  error
                                );
                                toast.error("Error al eliminar venta");
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inventario Completo</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      className="flex justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-gray-500">
                          Categoría: {p.category}
                        </p>
                      </div>

                      <div className="font-bold">
                        Stock:{" "}
                        <span
                          className={
                            p.stock <= thresholds.lowStockThreshold
                              ? "text-red-500"
                              : "text-green-500"
                          }
                        >
                          {p.stock}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-4">
            <ExpensesManager />
          </TabsContent>

          <TabsContent value="calculator" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Calculadora de Rentabilidad</CardTitle>
                <CardDescription>
                  Calcula el margen de ganancia de un producto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="calc-cost">por Unidad</Label>
                    <Input id="calc-cost" type="number" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="calc-price">Precio de Venta</Label>
                    <Input id="calc-price" type="number" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="calc-quantity">Cantidad Vendida</Label>
                    <Input id="calc-quantity" type="number" placeholder="1" />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <Button
                    onClick={() => {
                      const costInput = document.getElementById(
                        "calc-cost"
                      ) as HTMLInputElement;
                      const priceInput = document.getElementById(
                        "calc-price"
                      ) as HTMLInputElement;
                      const quantityInput = document.getElementById(
                        "calc-quantity"
                      ) as HTMLInputElement;

                      const cost = Number.parseFloat(costInput.value);
                      const price = Number.parseFloat(priceInput.value);
                      const quantity = Number.parseInt(quantityInput.value);

                      if (
                        isNaN(cost) ||
                        cost < 0 ||
                        isNaN(price) ||
                        price <= 0 ||
                        isNaN(quantity) ||
                        quantity <= 0
                      ) {
                        toast.error("Por favor, ingresa valores válidos.");
                        return;
                      }

                      const profitPerUnit = price - cost;
                      const margin = ((profitPerUnit / price) * 100).toFixed(2);
                      const totalProfit = profitPerUnit * quantity;
                      const totalRevenue = price * quantity;

                      document.getElementById("calc-result-margin")!.innerText =
                        `${margin}%`;
                      document.getElementById("calc-result-profit")!.innerText =
                        `$${totalProfit.toFixed(2)}`;
                      document.getElementById(
                        "calc-result-revenue"
                      )!.innerText = `$${totalRevenue.toFixed(2)}`;
                    }}
                  >
                    Calcular
                  </Button>
                  <div className="grid grid-cols-2 gap-2 text-sm pt-4 border-t">
                    <p>Margen de Ganancia:</p>
                    <p
                      id="calc-result-margin"
                      className="font-bold text-green-600"
                    >
                      0.00%
                    </p>
                    <p>Ganancia Neta Total:</p>
                    <p
                      id="calc-result-profit"
                      className="font-bold text-green-600"
                    >
                      $0.00
                    </p>
                    <p>Ingresos Totales:</p>
                    <p id="calc-result-revenue" className="font-bold">
                      $0.00
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <PriceSimulator />
            <ProductionCalendar />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Análisis de Ventas y Gastos</CardTitle>
                <CardDescription>
                  Visualización de la tendencia financiera
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card className="border-0 bg-transparent shadow-none">
                    <CardHeader className="p-0 pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        Ingresos Mensuales
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ChartContainer
                        config={{
                          Ingresos: {
                            label: "Ingresos",
                            color: "hsl(var(--primary))",
                          },
                        }}
                        className="h-[200px] w-full"
                      >
                        <AreaChart
                          accessibilityLayer
                          data={[
                            { month: "Ene", Ingresos: 186 },
                            { month: "Feb", Ingresos: 200 },
                            { month: "Mar", Ingresos: 220 },
                            { month: "Abr", Ingresos: 190 },
                            { month: "May", Ingresos: 240 },
                            { month: "Jun", Ingresos: 260 },
                            { month: "Jul", Ingresos: 280 },
                            { month: "Ago", Ingresos: 300 },
                            { month: "Sep", Ingresos: 320 },
                            { month: "Oct", Ingresos: 340 },
                            { month: "Nov", Ingresos: 360 },
                            { month: "Dic", Ingresos: 400 },
                          ]}
                        >
                          <defs>
                            <linearGradient
                              id="fillDesktop"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="var(--color-Ingresos)"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="var(--color-Ingresos)"
                                stopOpacity={0.1}
                              />
                            </linearGradient>
                          </defs>
                          <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                          />
                          <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={4}
                          />
                          <ChartTooltip
                            cursor={false}
                            content={
                              <ChartTooltipContent
                                nameKey="Ingresos"
                                formatter={(value) => ` $ ${value}`}
                                indicator="dot"
                              />
                            }
                          />
                          <Area
                            dataKey="Ingresos"
                            type="monotone"
                            fill="url(#fillDesktop)"
                            stroke="var(--color-Ingresos)"
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card className="border-0 bg-transparent shadow-none">
                    <CardHeader className="p-0 pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-red-600" />
                        Gastos Mensuales
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ChartContainer
                        config={{
                          Gastos: {
                            label: "Gastos",
                            color: "hsl(var(--destructive))",
                          },
                        }}
                        className="h-[200px] w-full"
                      >
                        <AreaChart
                          accessibilityLayer
                          data={[
                            { month: "Ene", Gastos: 100 },
                            { month: "Feb", Gastos: 120 },
                            { month: "Mar", Gastos: 110 },
                            { month: "Abr", Gastos: 130 },
                            { month: "May", Gastos: 150 },
                            { month: "Jun", Gastos: 140 },
                            { month: "Jul", Gastos: 160 },
                            { month: "Ago", Gastos: 180 },
                            { month: "Sep", Gastos: 170 },
                            { month: "Oct", Gastos: 190 },
                            { month: "Nov", Gastos: 210 },
                            { month: "Dic", Gastos: 230 },
                          ]}
                        >
                          <defs>
                            <linearGradient
                              id="fillDesktopGastos"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="var(--color-Gastos)"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="var(--color-Gastos)"
                                stopOpacity={0.1}
                              />
                            </linearGradient>
                          </defs>
                          <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                          />
                          <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={4}
                          />
                          <ChartTooltip
                            cursor={false}
                            content={
                              <ChartTooltipContent
                                nameKey="Gastos"
                                formatter={(value) => ` $ ${value}`}
                                indicator="dot"
                              />
                            }
                          />
                          <Area
                            dataKey="Gastos"
                            type="monotone"
                            fill="url(#fillDesktopGastos)"
                            stroke="var(--color-Gastos)"
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
            <FinancialDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
