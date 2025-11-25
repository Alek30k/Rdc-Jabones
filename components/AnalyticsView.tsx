import React, { useMemo } from "react";
import { useSales } from "@/contexts/SalesContext";
import { useProducts } from "@/contexts/ProductsContext";
import { useExpenses } from "@/contexts/ExpensesContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AnalyticsView() {
  const { sales } = useSales();
  const { products } = useProducts();
  const { expenses } = useExpenses();

  // Total Sales & Expenses
  const totalSales = useMemo(
    () => sales.reduce((sum, s) => sum + Number(s.totalAmount), 0),
    [sales]
  );

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, e) => sum + Number(e.amount), 0),
    [expenses]
  );

  const balance = totalSales - totalExpenses;

  // Top Products by Units Sold
  const topProductsData = useMemo(() => {
    return products
      .map((p) => ({ name: p.name, units: Number(p.units_sold) }))
      .sort((a, b) => b.units - a.units)
      .slice(0, 5);
  }, [products]);

  // Monthly Sales Trend
  const monthlySales = useMemo(() => {
    const map = new Map();
    sales.forEach((s) => {
      const month = s.date.slice(0, 7);
      map.set(month, (map.get(month) || 0) + Number(s.totalAmount));
    });
    return Array.from(map, ([month, total]) => ({ month, total }));
  }, [sales]);

  // Category Distribution
  const categoryData = useMemo(() => {
    const map = new Map();
    products.forEach((p) => {
      const cat = p.category || "otros";
      map.set(cat, (map.get(cat) || 0) + 1);
    });
    return Array.from(map, ([category, count]) => ({ category, count }));
  }, [products]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Balance Summary */}
      <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/40 border border-white/10 shadow-xl rounded-xl col-span-1 lg:col-span-2 p-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Resumen Financiero
          </CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">
          Balance:{" "}
          {balance >= 0 ? (
            <span className="text-green-400">+${balance.toFixed(2)}</span>
          ) : (
            <span className="text-red-400">
              -${Math.abs(balance).toFixed(2)}
            </span>
          )}
        </CardContent>
      </Card>

      {/* Top Products */}
      <Card className="p-6 backdrop-blur-xl bg-white/10 dark:bg-gray-900/40 border border-white/10 shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle>Top Productos por Ventas</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topProductsData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="units" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Sales Trend */}
      <Card className="p-6 backdrop-blur-xl bg-white/10 dark:bg-gray-900/40 border border-white/10 shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle>Tendencia de Ventas Mensual</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlySales}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Distribution */}
      <Card className="p-6 backdrop-blur-xl bg-white/10 dark:bg-gray-900/40 border border-white/10 shadow-lg rounded-xl col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Distribución por Categorías</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="count"
                nameKey="category"
                outerRadius={120}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={index} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
