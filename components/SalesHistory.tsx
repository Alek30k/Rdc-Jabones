"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SalesHistory({ sales, products, deleteSale }) {
  return (
    <Card className="shadow-sm border rounded-xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Historial de Ventas
        </CardTitle>
      </CardHeader>

      <CardContent>
        {sales.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No hay ventas registradas
          </p>
        ) : (
          <div className="space-y-4">
            {[...sales].reverse().map((sale) => {
              const product = products.find((p) => p.id === sale.product_id);

              return (
                <div
                  key={sale.id}
                  className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* IZQUIERDA */}
                  <div className="space-y-1">
                    <p className="font-semibold text-lg">
                      {product?.name || "Producto eliminado"}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Badge variant="outline" className="text-xs">
                        {sale.quantity} unidades
                      </Badge>

                      {product ? (
                        <span>
                          × ${product.pricePerUnit?.toFixed(2) || "0.00"}
                        </span>
                      ) : (
                        <span>Precio no disponible</span>
                      )}
                    </div>

                    <p className="text-xs text-gray-500">
                      {new Date(sale.date).toLocaleDateString("es-AR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* DERECHA */}
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-green-600 font-bold text-lg">
                      ${Number(sale.total_amount).toFixed(2)}
                    </p>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-red-100 dark:hover:bg-red-900"
                      onClick={() => deleteSale(sale)}
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
