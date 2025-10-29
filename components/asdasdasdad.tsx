"use client";

import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  productOperations,
  expenseOperations,
  saleOperations,
  alertOperations,
  thresholdOperations,
} from "@/lib/db-operations";

// Types
interface Product {
  id: string;
  name: string;
  cost_per_unit: number;
  price_per_unit: number;
  units_sold: number;
  category: string;
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
  product_id: string;
  quantity: number;
  total_amount: number;
  date: string;
}

interface BusinessAlert {
  id: string;
  type: "warning" | "error" | "success" | "info";
  title: string;
  message: string;
  action?: string;
  dismissed: boolean;
  created_at: string;
}

interface AlertThresholds {
  low_profit_margin: number;
  high_expense_category: number;
  no_sales_days: number;
  monthly_revenue_goal: number;
  expense_limit_percentage: number;
}

export default function SoapBusinessManager() {
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [alerts, setAlerts] = useState<BusinessAlert[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<
    "week" | "month" | "year"
  >("month");
  const [loading, setLoading] = useState(true);

  // Alert thresholds
  const [thresholds, setThresholds] = useState<AlertThresholds>({
    low_profit_margin: 20, // Less than 20% profit margin
    high_expense_category: 500, // More than $500 in a category
    no_sales_days: 7, // No sales in 7 days
    monthly_revenue_goal: 1000, // Monthly goal of $1000
    expense_limit_percentage: 60, // Expenses shouldn't exceed 60% of revenue
  });

  const [thresholdsLoaded, setThresholdsLoaded] = useState(false);

  // Form states
  const [newProduct, setNewProduct] = useState({
    name: "",
    cost_per_unit: "",
    price_per_unit: "",
    category: "facial",
  });

  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    category: "materias-primas",
    date: new Date().toISOString().split("T")[0],
  });

  const [newSale, setNewSale] = useState({
    product_id: "",
    quantity: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Load all data from database
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [
        productsData,
        expensesData,
        salesData,
        alertsData,
        thresholdsData,
      ] = await Promise.all([
        productOperations.getAll(),
        expenseOperations.getAll(),
        saleOperations.getAll(),
        alertOperations.getAll(),
        thresholdOperations.get(),
      ]);

      setProducts(
        productsData.map((p) => ({
          id: p.id,
          name: p.name,
          cost_per_unit: Number(p.cost_per_unit),
          price_per_unit: Number(p.price_per_unit),
          units_sold: p.units_sold,
          category: p.category,
        }))
      );

      setExpenses(
        expensesData.map((e) => ({
          id: e.id,
          description: e.description,
          amount: Number(e.amount),
          category: e.category,
          date: e.date,
        }))
      );

      setSales(
        salesData.map((s) => ({
          id: s.id,
          product_id: s.product_id,
          quantity: s.quantity,
          total_amount: Number(s.total_amount),
          date: s.date,
        }))
      );

      setAlerts(
        alertsData.map((a) => ({
          id: a.id,
          type: a.type,
          title: a.title,
          message: a.message,
          action: a.action || undefined,
          dismissed: a.dismissed,
          created_at: a.created_at,
        }))
      );

      if (thresholdsData) {
        setThresholds({
          low_profit_margin: Number(thresholdsData.low_profit_margin),
          high_expense_category: Number(thresholdsData.high_expense_category),
          no_sales_days: thresholdsData.no_sales_days,
          monthly_revenue_goal: Number(thresholdsData.monthly_revenue_goal),
          expense_limit_percentage: Number(
            thresholdsData.expense_limit_percentage
          ),
        });
        setThresholdsLoaded(true);
      } else {
        await thresholdOperations.createOrUpdate({
          low_profit_margin: 20,
          high_expense_category: 500,
          no_sales_days: 7,
          monthly_revenue_goal: 1000,
          expense_limit_percentage: 60,
        });
        setThresholdsLoaded(true);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Error al cargar los datos. Por favor, recarga la página.");
    } finally {
      setLoading(false);
    }
  };

  // Save thresholds to database
  const saveThresholds = async () => {
    try {
      await thresholdOperations.createOrUpdate({
        low_profit_margin: thresholds.low_profit_margin,
        high_expense_category: thresholds.high_expense_category,
        no_sales_days: thresholds.no_sales_days,
        monthly_revenue_goal: thresholds.monthly_revenue_goal,
        expense_limit_percentage: thresholds.expense_limit_percentage,
      });
      toast.success("⚙️ Configuración guardada correctamente");
      setThresholdsLoaded(true);
    } catch (error) {
      console.error("Error saving thresholds:", error);
      toast.error("Error al guardar la configuración");
    }
  };

  // Check for alerts
  const checkForAlerts = async () => {
    const newAlerts: Omit<BusinessAlert, "id" | "created_at">[] = [];

    // 1. Check for low profitability products
    products.forEach((product) => {
      if (product.units_sold > 0) {
        const margin =
          ((product.price_per_unit - product.cost_per_unit) /
            product.price_per_unit) *
          100;
        if (margin < thresholds.low_profit_margin) {
          const existingAlert = alerts.find(
            (a) =>
              a.title === `Baja rentabilidad: ${product.name}` && !a.dismissed
          );
          if (!existingAlert) {
            newAlerts.push({
              type: "warning",
              title: `Baja rentabilidad: ${product.name}`,
              message: `Este producto tiene un margen de ganancia de solo ${margin.toFixed(1)}%. Considera aumentar el precio o reducir costos.`,
              action: "Revisar precios",
              dismissed: false,
            });
          }
        }
      }
    });

    // 2. Check for high expenses in categories
    const expensesByCategory = expenses.reduce(
      (acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      },
      {} as Record<string, number>
    );

    Object.entries(expensesByCategory).forEach(([category, amount]) => {
      if (amount > thresholds.high_expense_category) {
        const existingAlert = alerts.find(
          (a) => a.title === `Gastos altos en ${category}` && !a.dismissed
        );
        if (!existingAlert) {
          newAlerts.push({
            type: "warning",
            title: `Gastos altos en ${category}`,
            message: `Has gastado $${amount.toFixed(2)} en ${category.replace("-", " ")}. Revisa si puedes optimizar estos gastos.`,
            action: "Ver gastos",
            dismissed: false,
          });
        }
      }
    });

    // 3. Check for products with no recent sales
    const today = new Date();
    products.forEach((product) => {
      const lastSale = sales
        .filter((s) => s.product_id === product.id)
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];

      if (lastSale) {
        const daysSinceLastSale = Math.floor(
          (today.getTime() - new Date(lastSale.date).getTime()) /
            (1000 * 60 * 60 * 24)
        );
        if (daysSinceLastSale > thresholds.no_sales_days) {
          const existingAlert = alerts.find(
            (a) => a.title === `Sin ventas: ${product.name}` && !a.dismissed
          );
          if (!existingAlert) {
            newAlerts.push({
              type: "info",
              title: `Sin ventas: ${product.name}`,
              message: `Este producto no ha tenido ventas en ${daysSinceLastSale} días. Considera una promoción o revisión.`,
              action: "Crear promoción",
              dismissed: false,
            });
          }
        }
      }
    });

    // 4. Check monthly revenue goal
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
      .reduce((sum, sale) => sum + sale.total_amount, 0);

    if (monthlyRevenue >= thresholds.monthly_revenue_goal) {
      const existingAlert = alerts.find(
        (a) => a.title === "¡Meta mensual alcanzada!" && !a.dismissed
      );
      if (!existingAlert) {
        newAlerts.push({
          type: "success",
          title: "¡Meta mensual alcanzada!",
          message: `¡Felicitaciones! Has alcanzado tu meta de ingresos de $${thresholds.monthly_revenue_goal.toFixed(2)} este mes.`,
          dismissed: false,
        });
      }
    }

    // 5. Check expense to revenue ratio
    const totalRevenue = sales.reduce(
      (sum, sale) => sum + sale.total_amount,
      0
    );
    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const totalProductCosts = sales.reduce((sum, sale) => {
      const product = products.find((p) => p.id === sale.product_id);
      return sum + (product ? product.cost_per_unit * sale.quantity : 0);
    }, 0);

    const totalCosts = totalExpenses + totalProductCosts;
    const expenseRatio =
      totalRevenue > 0 ? (totalCosts / totalRevenue) * 100 : 0;

    if (
      expenseRatio > thresholds.expense_limit_percentage &&
      totalRevenue > 0
    ) {
      const existingAlert = alerts.find(
        (a) => a.title === "Gastos muy altos" && !a.dismissed
      );
      if (!existingAlert) {
        newAlerts.push({
          type: "error",
          title: "Gastos muy altos",
          message: `Tus gastos representan ${expenseRatio.toFixed(1)}% de tus ingresos. Intenta reducirlos para mejorar la rentabilidad.`,
          action: "Analizar gastos",
          dismissed: false,
        });
      }
    }

    // 6. Check for products reaching break-even
    products.forEach((product) => {
      if (product.units_sold > 0) {
        const profitPerUnit = product.price_per_unit - product.cost_per_unit;
        const productShare = totalExpenses / products.length;
        const breakEvenUnits = Math.ceil(productShare / profitPerUnit);

        if (
          product.units_sold >= breakEvenUnits &&
          product.units_sold < breakEvenUnits + 5
        ) {
          const existingAlert = alerts.find(
            (a) =>
              a.title === `¡${product.name} alcanzó punto de equilibrio!` &&
              !a.dismissed
          );
          if (!existingAlert) {
            newAlerts.push({
              type: "success",
              title: `¡${product.name} alcanzó punto de equilibrio!`,
              message: `Este producto ya cubrió sus costos con ${product.units_sold} unidades vendidas. ¡Ahora es pura ganancia!`,
              dismissed: false,
            });
          }
        }
      }
    });

    // Save new alerts to database
    if (newAlerts.length > 0) {
      try {
        const createdAlerts = await Promise.all(
          newAlerts.map((alert) => alertOperations.create(alert))
        );

        setAlerts([
          ...alerts,
          ...createdAlerts.map((a) => ({
            id: a.id,
            type: a.type,
            title: a.title,
            message: a.message,
            action: a.action || undefined,
            dismissed: a.dismissed,
            created_at: a.created_at,
          })),
        ]);

        // Show toast for critical alerts
        createdAlerts.forEach((alert) => {
          if (alert.type === "error") {
            toast.error(`${alert.title}: ${alert.message}`, { duration: 5000 });
          } else if (alert.type === "success") {
            toast.success(`${alert.title}: ${alert.message}`, {
              duration: 5000,
            });
          }
        });
      } catch (error) {
        console.error("Error creating alerts:", error);
      }
    }
  };

  // Dismiss alert
  const dismissAlert = async (alertId: string) => {
    try {
      await alertOperations.dismiss(alertId);
      setAlerts(
        alerts.map((alert) =>
          alert.id === alertId ? { ...alert, dismissed: true } : alert
        )
      );
      toast.success("✓ Alerta descartada");
    } catch (error) {
      console.error("Error dismissing alert:", error);
      toast.error("Error al descartar la alerta");
    }
  };

  // Clear all dismissed alerts
  const clearDismissedAlerts = async () => {
    try {
      await alertOperations.deleteAllDismissed();
      setAlerts(alerts.filter((alert) => !alert.dismissed));
      toast.success("🧹 Alertas antiguas eliminadas");
    } catch (error) {
      console.error("Error clearing alerts:", error);
      toast.error("Error al limpiar alertas");
    }
  };

  // Add Product
  const addProduct = async () => {
    if (
      !newProduct.name ||
      !newProduct.cost_per_unit ||
      !newProduct.price_per_unit
    )
      return;

    try {
      const product = await productOperations.create({
        name: newProduct.name,
        cost_per_unit: Number.parseFloat(newProduct.cost_per_unit),
        price_per_unit: Number.parseFloat(newProduct.price_per_unit),
        category: newProduct.category,
      });

      setProducts([
        ...products,
        {
          id: product.id,
          name: product.name,
          cost_per_unit: Number(product.cost_per_unit),
          price_per_unit: Number(product.price_per_unit),
          units_sold: product.units_sold,
          category: product.category,
        },
      ]);

      setNewProduct({
        name: "",
        cost_per_unit: "",
        price_per_unit: "",
        category: "facial",
      });
      toast.success(`✅ Producto agregado: ${product.name}`);
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Error al agregar el producto");
    }
  };

  // Delete Product
  const deleteProduct = async (id: string) => {
    try {
      await productOperations.delete(id);
      setProducts(products.filter((p) => p.id !== id));
      toast.success("🗑️ Producto eliminado");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error al eliminar el producto");
    }
  };

  // Add Expense
  const addExpense = async () => {
    if (!newExpense.description || !newExpense.amount) return;

    try {
      const expense = await expenseOperations.create({
        description: newExpense.description,
        amount: Number.parseFloat(newExpense.amount),
        category: newExpense.category,
        date: newExpense.date,
      });

      setExpenses([
        ...expenses,
        {
          id: expense.id,
          description: expense.description,
          amount: Number(expense.amount),
          category: expense.category,
          date: expense.date,
        },
      ]);

      setNewExpense({
        description: "",
        amount: "",
        category: "materias-primas",
        date: new Date().toISOString().split("T")[0],
      });

      toast.success(
        `💸 Gasto registrado: $${expense.amount} en ${expense.category}`
      );
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Error al registrar el gasto");
    }
  };

  // Delete Expense
  const deleteExpense = async (id: string) => {
    try {
      await expenseOperations.delete(id);
      setExpenses(expenses.filter((e) => e.id !== id));
      toast.success("🗑️ Gasto eliminado");
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Error al eliminar el gasto");
    }
  };

  // Add Sale
  const addSale = async () => {
    if (!newSale.product_id || !newSale.quantity) return;

    const product = products.find((p) => p.id === newSale.product_id);
    if (!product) return;

    try {
      const quantity = Number.parseInt(newSale.quantity);
      const sale = await saleOperations.create({
        product_id: newSale.product_id,
        quantity: quantity,
        total_amount: product.price_per_unit * quantity,
        date: newSale.date,
      });

      setSales([
        ...sales,
        {
          id: sale.id,
          product_id: sale.product_id,
          quantity: sale.quantity,
          total_amount: Number(sale.total_amount),
          date: sale.date,
        },
      ]);

      // Update product units sold
      await productOperations.update(newSale.product_id, {
        units_sold: product.units_sold + quantity,
      });

      setProducts(
        products.map((p) =>
          p.id === newSale.product_id
            ? { ...p, units_sold: p.units_sold + quantity }
            : p
        )
      );

      setNewSale({
        product_id: "",
        quantity: "",
        date: new Date().toISOString().split("T")[0],
      });

      toast.success(
        `🎉 Venta registrada: ${quantity}x ${product.name} - $${sale.total_amount}`
      );
    } catch (error) {
      console.error("Error adding sale:", error);
      toast.error("Error al registrar la venta");
    }
  };

  // Delete Sale
  const deleteSale = async (id: string) => {
    const sale = sales.find((s) => s.id === id);
    if (!sale) return;

    try {
      await saleOperations.delete(id);
      setSales(sales.filter((s) => s.id !== id));

      // Update product units sold
      const product = products.find((p) => p.id === sale.product_id);
      if (product) {
        await productOperations.update(sale.product_id, {
          units_sold: Math.max(0, product.units_sold - sale.quantity),
        });

        setProducts(
          products.map((p) =>
            p.id === sale.product_id
              ? { ...p, units_sold: Math.max(0, p.units_sold - sale.quantity) }
              : p
          )
        );
      }

      toast.success("🗑️ Venta eliminada");
    } catch (error) {
      console.error("Error deleting sale:", error);
      toast.error("Error al eliminar la venta");
    }
  };

  // Calculations
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total_amount, 0);
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const totalProductCosts = sales.reduce((sum, sale) => {
    const product = products.find((p) => p.id === sale.product_id);
    return sum + (product ? product.cost_per_unit * sale.quantity : 0);
  }, 0);
  const netProfit = totalRevenue - totalExpenses - totalProductCosts;
  const profitMargin =
    totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(2) : "0";

  // Best selling products
  const bestSellers = [...products]
    .sort((a, b) => b.units_sold - a.units_sold)
    .slice(0, 5);

  // Get active alerts
  const activeAlerts = alerts.filter((alert) => !alert.dismissed);

  // Export data
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

    toast.success("📥 Datos exportados exitosamente");
  };

  // Get alert icon
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-purple-600" />
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Cargando datos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
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
          </div>
        </div>

        {/* Alert Banner - Show only critical alerts */}
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

        {/* Summary Cards */}
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
                {products.reduce((sum, p) => sum + p.units_sold, 0)} unidades
                vendidas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-7 gap-2">
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
            <TabsTrigger value="calculator" className="gap-2">
              <Calculator className="w-4 h-4" />
              Calculadora
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <LineChartIcon className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-4">
            {/* Alert Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configuración de Alertas
                </CardTitle>
                <CardDescription>
                  Ajusta los umbrales para recibir notificaciones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="low-profit">
                      Margen de ganancia mínimo (%)
                    </Label>
                    <Input
                      id="low-profit"
                      type="number"
                      value={thresholds.low_profit_margin}
                      onChange={(e) =>
                        setThresholds({
                          ...thresholds,
                          low_profit_margin: Number.parseFloat(e.target.value),
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
                      value={thresholds.high_expense_category}
                      onChange={(e) =>
                        setThresholds({
                          ...thresholds,
                          high_expense_category: Number.parseFloat(
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
                      value={thresholds.no_sales_days}
                      onChange={(e) =>
                        setThresholds({
                          ...thresholds,
                          no_sales_days: Number.parseInt(e.target.value),
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
                      value={thresholds.monthly_revenue_goal}
                      onChange={(e) =>
                        setThresholds({
                          ...thresholds,
                          monthly_revenue_goal: Number.parseFloat(
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
                      value={thresholds.expense_limit_percentage}
                      onChange={(e) =>
                        setThresholds({
                          ...thresholds,
                          expense_limit_percentage: Number.parseFloat(
                            e.target.value
                          ),
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button onClick={clearDismissedAlerts} variant="outline">
                    Limpiar alertas antiguas
                  </Button>
                  <Button onClick={saveThresholds}>
                    Guardar configuración
                  </Button>
                  <Button onClick={checkForAlerts}>
                    Revisar alertas ahora
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Active Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Alertas Activas ({activeAlerts.length})
                </CardTitle>
                <CardDescription>
                  Notificaciones importantes sobre tu negocio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeAlerts.length === 0 ? (
                    <div className="text-center py-12">
                      <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <p className="text-lg font-medium">
                        ¡Todo está en orden!
                      </p>
                      <p className="text-gray-500 text-sm mt-2">
                        No tienes alertas pendientes en este momento.
                      </p>
                    </div>
                  ) : (
                    [...activeAlerts]
                      .sort((a, b) => {
                        const priority = {
                          error: 0,
                          warning: 1,
                          info: 2,
                          success: 3,
                        };
                        return priority[a.type] - priority[b.type];
                      })
                      .map((alert) => (
                        <Alert
                          key={alert.id}
                          variant={
                            alert.type === "error" ? "destructive" : "default"
                          }
                          className={`
                          ${alert.type === "warning" ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10" : ""}
                          ${alert.type === "success" ? "border-green-500 bg-green-50 dark:bg-green-900/10" : ""}
                          ${alert.type === "info" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10" : ""}
                        `}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex gap-3 flex-1">
                              {getAlertIcon(alert.type)}
                              <div className="flex-1">
                                <AlertTitle>{alert.title}</AlertTitle>
                                <AlertDescription className="mt-2">
                                  {alert.message}
                                </AlertDescription>
                                {alert.action && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="mt-3 bg-transparent"
                                  >
                                    {alert.action}
                                  </Button>
                                )}
                                <p className="text-xs text-gray-500 mt-2">
                                  {new Date(alert.created_at).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="shrink-0"
                              onClick={() => dismissAlert(alert.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </Alert>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Alert Statistics */}
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

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Best Sellers */}
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
                                {product.units_sold} unidades
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary">
                            $
                            {(
                              product.price_per_unit * product.units_sold
                            ).toFixed(2)}
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Expense Breakdown */}
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

            {/* Profitability by Product */}
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
                      const profit =
                        product.price_per_unit - product.cost_per_unit;
                      const margin = (
                        (profit / product.price_per_unit) *
                        100
                      ).toFixed(1);
                      const totalProfit = profit * product.units_sold;

                      return (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Costo: ${product.cost_per_unit.toFixed(2)} |
                              Precio: ${product.price_per_unit.toFixed(2)}
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

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Agregar Producto
                </CardTitle>
                <CardDescription>
                  Registra un nuevo jabón artesanal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-name">Nombre del Producto</Label>
                    <Input
                      id="product-name"
                      placeholder="Ej: Jabón de Lavanda"
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-cost">Costo por Unidad</Label>
                    <Input
                      id="product-cost"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newProduct.cost_per_unit}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          cost_per_unit: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-price">Precio de Venta</Label>
                    <Input
                      id="product-price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newProduct.price_per_unit}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          price_per_unit: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-category">Categoría</Label>
                    <Select
                      value={newProduct.category}
                      onValueChange={(value) =>
                        setNewProduct({ ...newProduct, category: value })
                      }
                    >
                      <SelectTrigger id="product-category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="facial">Facial</SelectItem>
                        <SelectItem value="corporal">Corporal</SelectItem>
                        <SelectItem value="especial">Especial</SelectItem>
                        <SelectItem value="capilar">Capilar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={addProduct} className="mt-4 w-full md:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Producto
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lista de Productos</CardTitle>
                <CardDescription>
                  {products.length} productos registrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {products.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No hay productos registrados
                    </p>
                  ) : (
                    products.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{product.name}</p>
                            <Badge variant="outline">{product.category}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Costo: ${product.cost_per_unit.toFixed(2)} | Precio:
                            ${product.price_per_unit.toFixed(2)} | Vendidos:{" "}
                            {product.units_sold}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteProduct(product.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sales Tab */}
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
                      value={newSale.product_id}
                      onValueChange={(value) =>
                        setNewSale({ ...newSale, product_id: value })
                      }
                    >
                      <SelectTrigger id="sale-product">
                        <SelectValue placeholder="Selecciona un producto" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} (${product.price_per_unit.toFixed(2)}
                            )
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
                  disabled={!newSale.product_id || !newSale.quantity}
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
                        (p) => p.id === sale.product_id
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
                              {product?.price_per_unit.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">
                              ${sale.total_amount.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(sale.date).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-2"
                            onClick={() => deleteSale(sale.id)}
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

          {/* Expenses Tab */}
          <TabsContent value="expenses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Registrar Gasto
                </CardTitle>
                <CardDescription>
                  Anota un nuevo gasto del negocio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expense-description">Descripción</Label>
                    <Input
                      id="expense-description"
                      placeholder="Ej: Aceite de coco"
                      value={newExpense.description}
                      onChange={(e) =>
                        setNewExpense({
                          ...newExpense,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expense-amount">Monto</Label>
                    <Input
                      id="expense-amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newExpense.amount}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, amount: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expense-category">Categoría</Label>
                    <Select
                      value={newExpense.category}
                      onValueChange={(value) =>
                        setNewExpense({ ...newExpense, category: value })
                      }
                    >
                      <SelectTrigger id="expense-category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="materias-primas">
                          Materias Primas
                        </SelectItem>
                        <SelectItem value="embalaje">Embalaje</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="envio">Envío</SelectItem>
                        <SelectItem value="equipamiento">
                          Equipamiento
                        </SelectItem>
                        <SelectItem value="otros">Otros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expense-date">Fecha</Label>
                    <Input
                      id="expense-date"
                      type="date"
                      value={newExpense.date}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, date: e.target.value })
                      }
                    />
                  </div>
                </div>
                <Button onClick={addExpense} className="mt-4 w-full md:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Registrar Gasto
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Historial de Gastos</CardTitle>
                <CardDescription>
                  {expenses.length} gastos registrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {expenses.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No hay gastos registrados
                    </p>
                  ) : (
                    [...expenses].reverse().map((expense) => (
                      <div
                        key={expense.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{expense.description}</p>
                            <Badge variant="outline" className="capitalize">
                              {expense.category.replace("-", " ")}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(expense.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-red-600">
                            ${expense.amount.toFixed(2)}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteExpense(expense.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calculator Tab */}
          <TabsContent value="calculator" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-purple-600" />
                    Calculadora de Precio
                  </CardTitle>
                  <CardDescription>
                    Calcula el precio ideal para tu producto
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <h4 className="font-medium text-sm mb-3">Fórmula:</h4>
                      <div className="space-y-2 text-sm">
                        <p>
                          • <strong>Precio Mínimo</strong> = Costo × 2
                        </p>
                        <p>
                          • <strong>Precio Recomendado</strong> = Costo × 2.5
                        </p>
                        <p>
                          • <strong>Precio Premium</strong> = Costo × 3
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Usa estos multiplicadores como guía según tu mercado
                        objetivo y posicionamiento.
                      </p>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-xs text-blue-900 dark:text-blue-100">
                          💡 <strong>Tip:</strong> Considera gastos fijos
                          (envío, embalaje, comisiones) al establecer tu precio
                          final.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Análisis de Break-Even
                  </CardTitle>
                  <CardDescription>
                    ¿Cuántas unidades necesitas vender?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">
                        Agrega productos para ver el análisis
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {products.map((product) => {
                          const profitPerUnit =
                            product.price_per_unit - product.cost_per_unit;
                          const breakEvenUnits =
                            totalExpenses > 0
                              ? Math.ceil(totalExpenses / profitPerUnit)
                              : 0;
                          const currentProfit =
                            product.units_sold * profitPerUnit -
                            totalExpenses / products.length;

                          return (
                            <div
                              key={product.id}
                              className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                            >
                              <p className="font-medium text-sm mb-2">
                                {product.name}
                              </p>
                              <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                                <p>
                                  Ganancia por unidad:{" "}
                                  <span className="font-bold text-green-600">
                                    ${profitPerUnit.toFixed(2)}
                                  </span>
                                </p>
                                <p>
                                  Punto de equilibrio:{" "}
                                  <span className="font-bold">
                                    {breakEvenUnits} unidades
                                  </span>
                                </p>
                                <p>
                                  Vendidas:{" "}
                                  <span className="font-bold">
                                    {product.units_sold} unidades
                                  </span>
                                </p>
                                <p
                                  className={
                                    currentProfit >= 0
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }
                                >
                                  Estado:{" "}
                                  <span className="font-bold">
                                    {currentProfit >= 0
                                      ? "En ganancia"
                                      : "En pérdida"}{" "}
                                    (${currentProfit.toFixed(2)})
                                  </span>
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  Proyección de Ganancias
                </CardTitle>
                <CardDescription>Simula escenarios de ventas</CardDescription>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Agrega productos para ver proyecciones
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="p-3 text-left">Producto</th>
                          <th className="p-3 text-right">10 unidades</th>
                          <th className="p-3 text-right">50 unidades</th>
                          <th className="p-3 text-right">100 unidades</th>
                          <th className="p-3 text-right">200 unidades</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => {
                          const profitPerUnit =
                            product.price_per_unit - product.cost_per_unit;
                          return (
                            <tr
                              key={product.id}
                              className="border-t dark:border-gray-700"
                            >
                              <td className="p-3 font-medium">
                                {product.name}
                              </td>
                              <td className="p-3 text-right text-green-600">
                                ${(profitPerUnit * 10).toFixed(2)}
                              </td>
                              <td className="p-3 text-right text-green-600">
                                ${(profitPerUnit * 50).toFixed(2)}
                              </td>
                              <td className="p-3 text-right text-green-600">
                                ${(profitPerUnit * 100).toFixed(2)}
                              </td>
                              <td className="p-3 text-right text-green-600">
                                ${(profitPerUnit * 200).toFixed(2)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            {/* Sales Over Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Ventas en el Tiempo
                </CardTitle>
                <CardDescription>Evolución de tus ingresos</CardDescription>
              </CardHeader>
              <CardContent>
                {sales.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No hay datos suficientes para mostrar
                  </p>
                ) : (
                  <ChartContainer
                    config={{
                      revenue: {
                        label: "Ingresos",
                        color: "hsl(var(--chart-1))",
                      },
                      profit: {
                        label: "Ganancia",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={(() => {
                          const salesByDate = sales.reduce(
                            (acc, sale) => {
                              const date = new Date(
                                sale.date
                              ).toLocaleDateString();
                              const product = products.find(
                                (p) => p.id === sale.product_id
                              );
                              const cost = product
                                ? product.cost_per_unit * sale.quantity
                                : 0;

                              if (!acc[date]) {
                                acc[date] = {
                                  date,
                                  revenue: 0,
                                  profit: 0,
                                  cost: 0,
                                };
                              }
                              acc[date].revenue += sale.total_amount;
                              acc[date].cost += cost;
                              acc[date].profit += sale.total_amount - cost;
                              return acc;
                            },
                            {} as Record<
                              string,
                              {
                                date: string;
                                revenue: number;
                                profit: number;
                                cost: number;
                              }
                            >
                          );

                          return Object.values(salesByDate).sort(
                            (a, b) =>
                              new Date(a.date).getTime() -
                              new Date(b.date).getTime()
                          );
                        })()}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stackId="1"
                          stroke="var(--color-revenue)"
                          fill="var(--color-revenue)"
                          fillOpacity={0.6}
                          name="Ingresos"
                        />
                        <Area
                          type="monotone"
                          dataKey="profit"
                          stackId="2"
                          stroke="var(--color-profit)"
                          fill="var(--color-profit)"
                          fillOpacity={0.6}
                          name="Ganancia"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Expenses by Category Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-purple-600" />
                    Distribución de Gastos
                  </CardTitle>
                  <CardDescription>Por categoría</CardDescription>
                </CardHeader>
                <CardContent>
                  {expenses.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No hay gastos registrados
                    </p>
                  ) : (
                    <ChartContainer
                      config={{
                        materiasPrimas: {
                          label: "Materias Primas",
                          color: "hsl(var(--chart-1))",
                        },
                        embalaje: {
                          label: "Embalaje",
                          color: "hsl(var(--chart-2))",
                        },
                        marketing: {
                          label: "Marketing",
                          color: "hsl(var(--chart-3))",
                        },
                        envio: {
                          label: "Envío",
                          color: "hsl(var(--chart-4))",
                        },
                        equipamiento: {
                          label: "Equipamiento",
                          color: "hsl(var(--chart-5))",
                        },
                        otros: {
                          label: "Otros",
                          color: "hsl(220 70% 50%)",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={(() => {
                              const expensesByCategory = expenses.reduce(
                                (acc, expense) => {
                                  const key = expense.category.replace("-", "");
                                  acc[key] = (acc[key] || 0) + expense.amount;
                                  return acc;
                                },
                                {} as Record<string, number>
                              );

                              const colors = [
                                "hsl(var(--chart-1))",
                                "hsl(var(--chart-2))",
                                "hsl(var(--chart-3))",
                                "hsl(var(--chart-4))",
                                "hsl(var(--chart-5))",
                                "hsl(220 70% 50%)",
                              ];

                              return Object.entries(expensesByCategory).map(
                                ([name, value], index) => ({
                                  name:
                                    name.charAt(0).toUpperCase() +
                                    name.slice(1),
                                  value: Number(value.toFixed(2)),
                                  fill: colors[index % colors.length],
                                })
                              );
                            })()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) =>
                              `${name} ${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius={80}
                            dataKey="value"
                          >
                            {(() => {
                              const colors = [
                                "hsl(var(--chart-1))",
                                "hsl(var(--chart-2))",
                                "hsl(var(--chart-3))",
                                "hsl(var(--chart-4))",
                                "hsl(var(--chart-5))",
                                "hsl(220 70% 50%)",
                              ];
                              return colors.map((color, index) => (
                                <Cell key={`cell-${index}`} fill={color} />
                              ));
                            })()}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  )}
                </CardContent>
              </Card>

              {/* Products Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    Rendimiento por Producto
                  </CardTitle>
                  <CardDescription>Unidades vendidas</CardDescription>
                </CardHeader>
                <CardContent>
                  {products.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No hay productos registrados
                    </p>
                  ) : (
                    <ChartContainer
                      config={{
                        units: {
                          label: "Unidades",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={products.map((product) => ({
                            name:
                              product.name.length > 15
                                ? product.name.substring(0, 15) + "..."
                                : product.name,
                            units: product.units_sold,
                            revenue:
                              product.units_sold * product.price_per_unit,
                          }))}
                          margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            height={80}
                          />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Bar
                            dataKey="units"
                            fill="var(--color-units)"
                            name="Unidades"
                            radius={[8, 8, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Monthly Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChartIcon className="w-5 h-5 text-indigo-600" />
                  Resumen Mensual
                </CardTitle>
                <CardDescription>
                  Comparación de ingresos vs gastos
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sales.length === 0 && expenses.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No hay datos suficientes para mostrar
                  </p>
                ) : (
                  <ChartContainer
                    config={{
                      revenue: {
                        label: "Ingresos",
                        color: "hsl(var(--chart-1))",
                      },
                      expenses: {
                        label: "Gastos",
                        color: "hsl(var(--chart-2))",
                      },
                      profit: {
                        label: "Ganancia",
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={(() => {
                          const monthlyData: Record<
                            string,
                            {
                              month: string;
                              revenue: number;
                              expenses: number;
                              profit: number;
                            }
                          > = {};

                          // Process sales
                          sales.forEach((sale) => {
                            const date = new Date(sale.date);
                            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
                            const monthName = date.toLocaleDateString("es-ES", {
                              year: "numeric",
                              month: "short",
                            });

                            if (!monthlyData[monthKey]) {
                              monthlyData[monthKey] = {
                                month: monthName,
                                revenue: 0,
                                expenses: 0,
                                profit: 0,
                              };
                            }

                            const product = products.find(
                              (p) => p.id === sale.product_id
                            );
                            const cost = product
                              ? product.cost_per_unit * sale.quantity
                              : 0;

                            monthlyData[monthKey].revenue += sale.total_amount;
                            monthlyData[monthKey].expenses += cost;
                          });

                          // Process expenses
                          expenses.forEach((expense) => {
                            const date = new Date(expense.date);
                            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
                            const monthName = date.toLocaleDateString("es-ES", {
                              year: "numeric",
                              month: "short",
                            });

                            if (!monthlyData[monthKey]) {
                              monthlyData[monthKey] = {
                                month: monthName,
                                revenue: 0,
                                expenses: 0,
                                profit: 0,
                              };
                            }

                            monthlyData[monthKey].expenses += expense.amount;
                          });

                          // Calculate profit
                          Object.keys(monthlyData).forEach((key) => {
                            monthlyData[key].profit =
                              monthlyData[key].revenue -
                              monthlyData[key].expenses;
                          });

                          return Object.values(monthlyData).sort(
                            (a, b) =>
                              new Date(a.month).getTime() -
                                new Date(b.month).getTime() ||
                              a.month.localeCompare(b.month)
                          );
                        })()}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="var(--color-revenue)"
                          strokeWidth={2}
                          name="Ingresos"
                          dot={{ r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="expenses"
                          stroke="var(--color-expenses)"
                          strokeWidth={2}
                          name="Gastos"
                          dot={{ r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="profit"
                          stroke="var(--color-profit)"
                          strokeWidth={2}
                          name="Ganancia"
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            {/* Revenue by Product Category */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-orange-600" />
                  Ingresos por Categoría de Producto
                </CardTitle>
                <CardDescription>
                  Distribución de ventas por tipo de jabón
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sales.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No hay ventas registradas
                  </p>
                ) : (
                  <ChartContainer
                    config={{
                      revenue: {
                        label: "Ingresos",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={(() => {
                          const revenueByCategory = sales.reduce(
                            (acc, sale) => {
                              const product = products.find(
                                (p) => p.id === sale.product_id
                              );
                              if (product) {
                                acc[product.category] =
                                  (acc[product.category] || 0) +
                                  sale.total_amount;
                              }
                              return acc;
                            },
                            {} as Record<string, number>
                          );

                          return Object.entries(revenueByCategory).map(
                            ([category, revenue]) => ({
                              category:
                                category.charAt(0).toUpperCase() +
                                category.slice(1),
                              revenue: Number(revenue.toFixed(2)),
                            })
                          );
                        })()}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                          dataKey="revenue"
                          fill="var(--color-revenue)"
                          name="Ingresos"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
