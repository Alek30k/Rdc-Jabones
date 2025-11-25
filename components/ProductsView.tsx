import React, { useState } from "react";
// import { useProducts } from "@/contexts/ProductsContext";
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
import { Edit, Trash2, Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import { useProducts } from "@/contexts/ProductsContext";

export default function ProductsView() {
  const {
    products,
    refreshProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    cost_per_unit: 0,
    price_per_unit: 0,
    category: "otros",
  });

  const handleSave = async () => {
    if (!form.name || form.cost_per_unit <= 0 || form.price_per_unit <= 0) {
      toast.error("Completa todos los campos correctamente");
      return;
    }

    if (editing) {
      await updateProduct(editing.id, form);
      toast.success("Producto actualizado");
    } else {
      await addProduct(form);
      toast.success("Producto agregado");
    }

    setForm({
      name: "",
      cost_per_unit: 0,
      price_per_unit: 0,
      category: "otros",
    });
    setEditing(null);
    setOpen(false);
    refreshProducts();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Productos</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 text-white"
              onClick={() => setEditing(null)}
            >
              <Plus className="w-4 h-4 mr-2" /> Agregar Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editing ? "Editar Producto" : "Nuevo Producto"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3 text-white">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input
                  className="bg-white/10 border-white/20 text-white"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Costo por unidad</Label>
                <Input
                  type="number"
                  className="bg-white/10 border-white/20 text-white"
                  value={form.cost_per_unit}
                  onChange={(e) =>
                    setForm({ ...form, cost_per_unit: Number(e.target.value) })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Precio por unidad</Label>
                <Input
                  type="number"
                  className="bg-white/10 border-white/20 text-white"
                  value={form.price_per_unit}
                  onChange={(e) =>
                    setForm({ ...form, price_per_unit: Number(e.target.value) })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Categoría</Label>
                <select
                  className="bg-white/10 border border-white/20 p-2 rounded-md text-white"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  <option value="jabon">Facial</option>
                  <option value="cosmetica">Corporal</option>
                  <option value="accesorios">Ambos</option>
                  <option value="promociones">Combos</option>
                  <option value="otros">Otros</option>
                </select>
              </div>

              <Button
                className="w-full backdrop-blur-md bg-white/20 hover:bg-white/30 text-white"
                onClick={handleSave}
              >
                {editing ? "Guardar Cambios" : "Agregar Producto"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* GRID DE PRODUCTOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => {
          const cost = Number(p.cost_per_unit);
          const price = Number(p.price_per_unit);
          const units = Number(p.units_sold);
          const profit = price - cost;
          const totalProfit = profit * units;

          return (
            <Card
              key={p.id}
              className="backdrop-blur-xl bg-white/10 border border-white/10 shadow-xl hover:bg-white/20 transition"
            >
              <CardHeader className="flex justify-between items-center text-white">
                <CardTitle>{p.name}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/40 text-white hover:bg-white/20"
                    onClick={() => {
                      setEditing(p);
                      setForm({
                        name: p.name,
                        cost_per_unit: cost,
                        price_per_unit: price,
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
                    className="bg-red-500/60 hover:bg-red-500 text-white"
                    onClick={() => deleteProduct(p.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="text-white space-y-1">
                <p>Costo: ${cost.toFixed(2)}</p>
                <p>Precio: ${price.toFixed(2)}</p>
                <p>Vendidos: {units}</p>
                <p className="text-green-300 font-bold">
                  Ganancia total: ${totalProfit.toFixed(2)}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
