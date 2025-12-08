"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Plus, Minus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function ProductsManager() {
  const supabase = createClient();

  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    cost: "",
    stock: "",
    category: "",
  });

  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  const loadProducts = useCallback(async () => {
    const { data, error } = await supabase.from("products").select("*");

    if (error) {
      toast.error("Error cargando productos");
      return;
    }

    const formatted = data.map((p) => ({
      id: p.id_new, // 👈 AHORA id SIEMPRE ES id_new
      name: p.name,
      price: p.price_per_unit,
      cost: p.cost_per_unit,
      stock: p.stock ?? 0,
      category: p.category,
    }));

    setProducts(formatted);
  }, [supabase]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleCreate = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.cost) {
      toast.error("Completa todos los campos");
      return;
    }

    const { error } = await supabase.from("products").insert({
      name: newProduct.name,
      price_per_unit: parseFloat(newProduct.price),
      cost_per_unit: parseFloat(newProduct.cost),
      stock: parseInt(newProduct.stock || 0),
      category: newProduct.category,
    });

    if (error) {
      console.log("SUPABASE INSERT ERROR:", error);
      toast.error("Error al agregar producto");
      return;
    }

    toast.success("Producto agregado");
    setNewProduct({ name: "", price: "", cost: "", stock: "", category: "" });
    loadProducts();
  };

  const handleUpdate = async () => {
    if (!editingProduct) return;

    const { error } = await supabase
      .from("products")
      .update({
        name: editingProduct.name,
        price_per_unit: parseFloat(editingProduct.price),
        cost_per_unit: parseFloat(editingProduct.cost),
        stock: parseInt(editingProduct.stock),
        category: editingProduct.category,
      })
      .eq("id_new", editingProduct.id); // 👈 CORREGIDO

    if (error) {
      toast.error("Error al actualizar");
      return;
    }

    toast.success("Producto actualizado");
    setEditingProduct(null);
    loadProducts();
  };

  const deleteProduct = useCallback(
    async (id) => {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id_new", id); // 👈 CORREGIDO

      if (error) {
        toast.error("Error al eliminar");
        return;
      }

      toast.success("Producto eliminado");
      loadProducts();
    },
    [supabase, loadProducts]
  );

  const modifyStock = useCallback(
    async (productId, amount) => {
      const product = products.find((p) => p.id === productId); // 👈 CORREGIDO
      const newStock = Math.max(0, product.stock + amount);

      const { error } = await supabase
        .from("products")
        .update({ stock: newStock })
        .eq("id_new", productId); // 👈 CORREGIDO

      if (!error) {
        setProducts(
          products.map((p) =>
            p.id === productId ? { ...p, stock: newStock } : p
          )
        );
      }
    },
    [products, supabase]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Productos con Stock</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* FORMULARIO */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="flex flex-col gap-2">
            <Label>Nombre</Label>
            <Input
              value={editingProduct ? editingProduct.name : newProduct.name}
              onChange={(e) =>
                editingProduct
                  ? setEditingProduct({
                      ...editingProduct,
                      name: e.target.value,
                    })
                  : setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Precio</Label>
            <Input
              type="number"
              value={editingProduct ? editingProduct.price : newProduct.price}
              onChange={(e) =>
                editingProduct
                  ? setEditingProduct({
                      ...editingProduct,
                      price: e.target.value,
                    })
                  : setNewProduct({ ...newProduct, price: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Costo</Label>
            <Input
              type="number"
              value={editingProduct ? editingProduct.cost : newProduct.cost}
              onChange={(e) =>
                editingProduct
                  ? setEditingProduct({
                      ...editingProduct,
                      cost: e.target.value,
                    })
                  : setNewProduct({ ...newProduct, cost: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Stock</Label>
            <Input
              type="number"
              value={editingProduct ? editingProduct.stock : newProduct.stock}
              onChange={(e) =>
                editingProduct
                  ? setEditingProduct({
                      ...editingProduct,
                      stock: e.target.value,
                    })
                  : setNewProduct({ ...newProduct, stock: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Categoría</Label>
            <Input
              value={
                editingProduct ? editingProduct.category : newProduct.category
              }
              onChange={(e) =>
                editingProduct
                  ? setEditingProduct({
                      ...editingProduct,
                      category: e.target.value,
                    })
                  : setNewProduct({ ...newProduct, category: e.target.value })
              }
            />
          </div>
        </div>

        <Button
          onClick={editingProduct ? handleUpdate : handleCreate}
          className="w-full"
        >
          {editingProduct ? "Guardar Cambios" : "Agregar Producto"}
        </Button>

        <div className="mb-4">
          <input
            placeholder="Buscar jabón por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          />
        </div>
        {/* TABLA */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Costo</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products
              .filter((p) =>
                p.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>${p.price}</TableCell>
                  <TableCell>${p.cost}</TableCell>

                  <TableCell className="font-bold">
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => modifyStock(p.id, -1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>

                      {p.stock}

                      <Button size="icon" onClick={() => modifyStock(p.id, +1)}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>

                  <TableCell className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEditingProduct(p)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteProduct(p.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
