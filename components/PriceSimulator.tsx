"use client";

import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { DollarSign, Calculator } from "lucide-react";

export default function PriceSimulator() {
  const [materialCost, setMaterialCost] = useState<number>(0);
  const [laborHours, setLaborHours] = useState<number>(0);
  const [hourlyRate, setHourlyRate] = useState<number>(2000);
  const [extraCosts, setExtraCosts] = useState<number>(0);
  const [margin, setMargin] = useState<number>(50);

  // cálculo base
  const totalCost = useMemo(() => {
    return materialCost + extraCosts + laborHours * hourlyRate;
  }, [materialCost, extraCosts, laborHours, hourlyRate]);

  const idealPrice = useMemo(() => {
    return totalCost * (1 + margin / 100);
  }, [totalCost, margin]);

  // generar datos para gráfico (margen vs. ganancia)
  const chartData = useMemo(() => {
    const steps = [10, 20, 30, 40, 50, 60, 80, 100];
    return steps.map((m) => ({
      margin: m,
      price: totalCost * (1 + m / 100),
      profit: totalCost * (m / 100),
    }));
  }, [totalCost]);

  const reset = () => {
    setMaterialCost(0);
    setLaborHours(0);
    setHourlyRate(2000);
    setExtraCosts(0);
    setMargin(50);
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-emerald-50 to-green-100 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-sm">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-shop_dark_green dark:text-green-300">
            <Calculator className="w-5 h-5" />
            Simulador de Precios
          </CardTitle>
          <Button variant="outline" size="sm" onClick={reset}>
            Reiniciar
          </Button>
        </CardHeader>

        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <Label htmlFor="material">Costo materia prima ($)</Label>
              <Input
                id="material"
                type="number"
                value={materialCost}
                onChange={(e) => setMaterialCost(Number(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="extras">Costos adicionales ($)</Label>
              <Input
                id="extras"
                type="number"
                value={extraCosts}
                onChange={(e) => setExtraCosts(Number(e.target.value))}
                placeholder="Envase, etiqueta, energía..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="laborHours">Horas de trabajo</Label>
                <Input
                  id="laborHours"
                  type="number"
                  value={laborHours}
                  onChange={(e) => setLaborHours(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="hourlyRate">Valor hora ($)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                />
              </div>
            </div>

            <div>
              <Label>Margen de ganancia (%)</Label>
              <Slider
                value={[margin]}
                min={10}
                max={150}
                step={5}
                onValueChange={(v) => setMargin(v[0])}
              />
              <div className="text-sm text-gray-500 mt-1">{margin}%</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-100">
                Resumen
              </h4>
              <div className="mt-3 space-y-1 text-sm">
                <p>
                  <strong>Costo total:</strong> ${totalCost.toLocaleString()}
                </p>
                <p>
                  <strong>Ganancia estimada:</strong> $
                  {(idealPrice - totalCost).toLocaleString()}
                </p>
                <p>
                  <strong>Precio ideal de venta:</strong>
                </p>
                <div className="text-3xl font-bold text-green-600 flex items-center gap-1">
                  <DollarSign className="w-5 h-5" />{" "}
                  {idealPrice.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Evolución de ganancia según margen</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="margin" unit="%" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#22c55e"
                name="Precio"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#f97316"
                name="Ganancia"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
