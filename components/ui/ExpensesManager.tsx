"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { PlusCircle, Edit, Trash2 } from "lucide-react";

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export default function ExpensesManager() {
  const supabase = createClient();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "",
    date: "",
  });

  // 🧩 Cargar gastos desde Supabase
  const fetchExpenses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error(error);
      toast.error("Error al cargar los gastos");
    } else {
      setExpenses(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // 🧾 Guardar o actualizar gasto
  const handleSave = async () => {
    if (!form.description || !form.amount || !form.category || !form.date) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    const payload = {
      description: form.description,
      amount: Number(form.amount),
      category: form.category,
      date: form.date,
    };

    let response;
    if (editingExpense) {
      response = await supabase
        .from("expenses")
        .update(payload)
        .eq("id", editingExpense.id);
    } else {
      response = await supabase.from("expenses").insert([
        {
          id: crypto.randomUUID(),
          ...payload,
        },
      ]);
    }

    if (response.error) {
      console.error(response.error);
      toast.error("Error al guardar el gasto");
    } else {
      toast.success(
        editingExpense ? "Gasto actualizado correctamente" : "Gasto agregado"
      );
      setForm({ description: "", amount: "", category: "", date: "" });
      setEditingExpense(null);
      setOpen(false);
      fetchExpenses();
    }
  };

  // 🗑 Eliminar gasto
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (error) {
      console.error(error);
      toast.error("Error al eliminar gasto");
    } else {
      toast.success("Gasto eliminado");
      fetchExpenses();
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-900 shadow-md border border-gray-200 dark:border-gray-800">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Gestión de Gastos
        </CardTitle>
        <Button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Agregar Gasto
        </Button>
      </CardHeader>

      <CardContent>
        {loading ? (
          <p className="text-gray-500">Cargando...</p>
        ) : expenses.length === 0 ? (
          <p className="text-gray-500">No hay gastos registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-700">
                  <th className="p-2">Descripción</th>
                  <th className="p-2">Categoría</th>
                  <th className="p-2">Monto</th>
                  <th className="p-2">Fecha</th>
                  <th className="p-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr
                    key={exp.id}
                    className="border-b border-gray-200 dark:border-gray-800"
                  >
                    <td className="p-2">{exp.description}</td>
                    <td className="p-2 capitalize">
                      {exp.category.replace("-", " ")}
                    </td>
                    <td className="p-2">${exp.amount.toFixed(2)}</td>
                    <td className="p-2">
                      {new Date(exp.date).toLocaleDateString("es-AR")}
                    </td>
                    <td className="p-2 text-center flex justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingExpense(exp);
                          setForm({
                            description: exp.description,
                            amount: exp.amount.toString(),
                            category: exp.category,
                            date: exp.date,
                          });
                          setOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(exp.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>

      {/* Modal de edición/agregado */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle>
              {editingExpense ? "Editar Gasto" : "Agregar Nuevo Gasto"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div>
              <Label>Descripción</Label>
              <Input
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Ej: Compra de aceites esenciales"
              />
            </div>

            <div>
              <Label>Monto</Label>
              <Input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="Ej: 1500"
              />
            </div>

            {/* 🟣 Select de categoría */}
            <div className="space-y-2">
              <Label htmlFor="expense-category">Categoría</Label>
              <Select
                value={form.category}
                onValueChange={(value) => setForm({ ...form, category: value })}
              >
                <SelectTrigger id="expense-category">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="materias-primas">
                    Materias Primas
                  </SelectItem>
                  <SelectItem value="embalaje">Embalaje</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="envio">Envío</SelectItem>
                  <SelectItem value="equipamiento">Equipamiento</SelectItem>
                  <SelectItem value="otros">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Fecha</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingExpense ? "Actualizar" : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
