"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Package,
  Calendar,
  FileSpreadsheet,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { createClient } from "@/lib/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";

interface MonthlyData {
  month: string;
  income: number;
  cost: number;
  potential: number;
}

type DateRange = "3m" | "6m" | "year" | "all";

export default function FinancialDashboard() {
  const [data, setData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<DateRange>("all");
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const { data: products, error } = await supabase
          .from("products")
          .select(
            "price_per_unit, cost_per_unit, units_sold, stock, created_at"
          );

        if (error) throw error;

        // Calcular rango temporal
        const now = new Date();
        const dateLimit =
          range === "3m"
            ? new Date(now.setMonth(now.getMonth() - 3))
            : range === "6m"
              ? new Date(now.setMonth(now.getMonth() - 6))
              : range === "year"
                ? new Date(now.getFullYear(), 0, 1)
                : null;

        const filtered = dateLimit
          ? products.filter((p) => new Date(p.created_at) >= dateLimit)
          : products;

        // Agrupar por mes
        const monthMap: Record<
          string,
          { income: number; cost: number; potential: number }
        > = {};

        filtered.forEach((p) => {
          const date = new Date(p.created_at);
          const month = date.toLocaleString("es-AR", { month: "short" });
          const price = Number(p.price_per_unit) || 0;
          const costUnit = Number(p.cost_per_unit) || 0;
          const sold = Number(p.units_sold) || 0;
          const stock = Number(p.stock) || 0;

          const income = price * sold;
          const cost = costUnit * sold;
          const potential = price * (sold + stock);

          if (!monthMap[month])
            monthMap[month] = { income: 0, cost: 0, potential: 0 };
          monthMap[month].income += income;
          monthMap[month].cost += cost;
          monthMap[month].potential += potential;
        });

        const monthlyData = Object.entries(monthMap).map(([month, v]) => ({
          month,
          income: v.income,
          cost: v.cost,
          potential: v.potential,
        }));

        setData(monthlyData);
      } catch (err) {
        console.error("Error obteniendo datos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [range, supabase]);

  // 📊 Cálculos globales
  const totalIncome = useMemo(
    () => data.reduce((s, d) => s + d.income, 0),
    [data]
  );
  const totalCost = useMemo(() => data.reduce((s, d) => s + d.cost, 0), [data]);
  const totalPotential = useMemo(
    () => data.reduce((s, d) => s + d.potential, 0),
    [data]
  );
  const netProfit = totalIncome - totalCost;
  const growthPercent =
    data.length > 1
      ? ((data.at(-1)!.income - data.at(-2)!.income) /
          (data.at(-2)!.income || 1)) *
        100
      : 0;

  // 📤 Exportar a Excel
  const handleExport = () => {
    const exportData = data.map((d) => ({
      Mes: d.month,
      Ingresos: d.income,
      Costos: d.cost,
      "Ganancia Neta": d.income - d.cost,
      "Valor Inventario": d.potential,
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Finanzas");
    XLSX.writeFile(workbook, `Reporte_Financiero_${range}.xlsx`);
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 min-h-screen rounded-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-shop_dark_green dark:text-green-300">
          Panel Financiero
        </h2>

        {/* Controles */}
        <div className="flex flex-wrap gap-2 items-center">
          <Select value={range} onValueChange={(v: DateRange) => setRange(v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Rango de tiempo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">Últimos 3 meses</SelectItem>
              <SelectItem value="6m">Últimos 6 meses</SelectItem>
              <SelectItem value="year">Año actual</SelectItem>
              <SelectItem value="all">Todo el historial</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-green-600" />
            Exportar Excel
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Cargando datos...</p>
      ) : (
        <>
          {/* Tarjetas resumen */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
                <DollarSign className="w-5 h-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                  ${totalIncome.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Costos</CardTitle>
                <TrendingDown className="w-5 h-5 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-700 dark:text-red-400">
                  ${totalCost.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Ganancia Neta
                </CardTitle>
                <BarChart3 className="w-5 h-5 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                  ${netProfit.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Crecimiento
                </CardTitle>
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${
                    growthPercent >= 0
                      ? "text-blue-700 dark:text-blue-400"
                      : "text-red-700 dark:text-red-400"
                  }`}
                >
                  {growthPercent.toFixed(1)}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Valor Inventario
                </CardTitle>
                <Package className="w-5 h-5 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                  ${totalPotential.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Ingresos, Costos e Inventario</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#16a34a"
                    strokeWidth={2}
                    name="Ingresos"
                  />
                  <Line
                    type="monotone"
                    dataKey="cost"
                    stroke="#dc2626"
                    strokeWidth={2}
                    name="Costos"
                  />
                  <Line
                    type="monotone"
                    dataKey="potential"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    name="Inventario Potencial"
                    strokeDasharray="4 4"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
