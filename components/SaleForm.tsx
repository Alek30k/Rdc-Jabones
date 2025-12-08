"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function SaleForm({ products, newSale, setNewSale, addSale }) {
  if (!newSale) {
    console.error("❌ ERROR: SaleForm recibió newSale = undefined");
    return null;
  }

  return (
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
          {/* PRODUCTO */}
          <div className="space-y-2">
            <Label>Producto</Label>
            <Select
              value={newSale.productId}
              onValueChange={(value) =>
                setNewSale({ ...newSale, productId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un producto" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id_new} value={product.id_new}>
                    {product.name} (${product.price_per_unit})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* CANTIDAD */}
          <div className="space-y-2">
            <Label>Cantidad</Label>
            <Input
              type="number"
              min="1"
              value={newSale.quantity}
              onChange={(e) =>
                setNewSale({ ...newSale, quantity: e.target.value })
              }
            />
          </div>

          {/* FECHA */}
          <div className="space-y-2">
            <Label>Fecha</Label>
            <Input
              type="date"
              value={newSale.date}
              onChange={(e) => setNewSale({ ...newSale, date: e.target.value })}
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
  );
}
