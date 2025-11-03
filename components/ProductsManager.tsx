"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { Edit, Trash2, Plus } from "lucide-react";

interface Product {
  id: string;
  name: string;
  cost_per_unit: number;
  price_per_unit: number;
  units_sold: number;
  category: string;
  created_at: string;
}

export default function ProductsManager() {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<
    Omit<Product, "id" | "created_at">
  >({
    name: "",
    cost_per_unit: 0,
    price_per_unit: 0,
    units_sold: 0,
    category: "otros",
  });

  // 📦 Cargar productos
  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error("Error al cargar productos");
    else setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ➕ Agregar / Editar producto
  const handleSave = async () => {
    if (
      !newProduct.name ||
      newProduct.cost_per_unit <= 0 ||
      newProduct.price_per_unit <= 0
    ) {
      toast.error("Completa todos los campos correctamente");
      return;
    }

    const payload = { ...newProduct };

    if (editing) {
      const { error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", editing.id);
      if (error) toast.error("Error al actualizar producto");
      else toast.success("Producto actualizado");
    } else {
      const { error } = await supabase
        .from("products")
        .insert([{ ...payload, id: crypto.randomUUID() }]);
      if (error) toast.error("Error al agregar producto");
      else toast.success("Producto agregado");
    }

    setOpen(false);
    setEditing(null);
    setNewProduct({
      name: "",
      cost_per_unit: 0,
      price_per_unit: 0,
      units_sold: 0,
      category: "otros",
    });
    fetchProducts();
  };

  // 🗑️ Eliminar producto
  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este producto?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error("Error al eliminar producto");
    else {
      toast.success("Producto eliminado");
      fetchProducts();
    }
  };

  return (
    <Card className="bg-gradient-to-br from-rose-50 via-purple-100 to-purple-200 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 shadow-xl border-0">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-shop_dark_green dark:text-emerald-300">
          Gestión de Productos
        </CardTitle>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(null)}>
              <Plus className="w-4 h-4 mr-2" /> Agregar Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editing ? "Editar Producto" : "Nuevo Producto"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  placeholder="Nombre del producto"
                />
              </div>
              <div className="space-y-2">
                <Label>Costo por unidad</Label>
                <Input
                  type="number"
                  value={newProduct.cost_per_unit}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      cost_per_unit: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Precio por unidad</Label>
                <Input
                  type="number"
                  value={newProduct.price_per_unit}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      price_per_unit: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Unidades vendidas</Label>
                <Input
                  type="number"
                  value={newProduct.units_sold}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      units_sold: parseInt(e.target.value),
                    })
                  }
                />
              </div>

              {/* Categoría con Select */}
              <div className="space-y-2 ">
                <Label>Categoría</Label>
                <select
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                  className="w-full border rounded-md p-2 bg-white dark:bg-gray-900"
                >
                  <option value="jabon">Facial</option>
                  <option value="cosmetica">Corporal</option>
                  <option value="accesorios">Ambos (facial y corporal)</option>
                  <option value="promociones">Combos</option>
                  <option value="otros">Otros</option>
                </select>
              </div>

              <Button onClick={handleSave} className="w-full">
                {editing ? "Guardar Cambios" : "Agregar Producto"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        {loading ? (
          <p className="text-gray-500">Cargando...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-600 text-center py-6">
            No hay productos registrados.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <Card
                key={p.id}
                className="p-4 shadow-md hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{p.name}</h3>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditing(p);
                        setNewProduct({
                          name: p.name,
                          cost_per_unit: p.cost_per_unit,
                          price_per_unit: p.price_per_unit,
                          units_sold: p.units_sold,
                          category: p.category,
                        });
                        setOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(p.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Categoría: {p.category}
                </p>
                <p className="text-sm text-gray-600">
                  Costo: ${p.cost_per_unit}
                </p>
                <p className="text-sm text-gray-600">
                  Precio: ${p.price_per_unit}
                </p>
                <p className="text-sm text-gray-600">
                  Vendidos: {p.units_sold}
                </p>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
