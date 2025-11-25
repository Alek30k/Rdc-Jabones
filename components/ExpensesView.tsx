import React, { useState } from "react";
import { useExpenses } from "@/contexts/ExpensesContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, Plus } from "lucide-react";

export default function ExpensesView() {
  const { expenses, addExpense, deleteExpense } = useExpenses();
  const [open, setOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: 0,
    date: new Date().toISOString().split("T")[0],
  });

  const handleSave = async () => {
    if (!newExpense.description || !newExpense.amount) return;
    await addExpense({
      description: newExpense.description,
      amount: Number(newExpense.amount),
      date: newExpense.date,
    });
    setNewExpense({
      description: "",
      amount: 0,
      date: new Date().toISOString().split("T")[0],
    });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Add Expense Button */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Registrar Gasto
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo Gasto</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Descripción</Label>
              <Input
                value={newExpense.description}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, description: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <Label>Monto</Label>
              <Input
                type="number"
                min="0"
                value={newExpense.amount}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, amount: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <Label>Fecha</Label>
              <Input
                type="date"
                value={newExpense.date}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, date: e.target.value })
                }
              />
            </div>

            <Button className="w-full" onClick={handleSave}>
              Guardar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Expenses Table */}
      <Card className="p-4 backdrop-blur-xl bg-white/10 dark:bg-gray-900/40 border border-white/10 shadow-xl rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left opacity-80">
                <th className="py-2 px-2">Descripción</th>
                <th className="py-2 px-2">Fecha</th>
                <th className="py-2 px-2">Monto</th>
                <th className="py-2 px-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr
                  key={e.id}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="py-2 px-2">{e.description}</td>
                  <td className="py-2 px-2">{e.date}</td>
                  <td className="py-2 px-2">${Number(e.amount).toFixed(2)}</td>
                  <td className="py-2 px-2 text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteExpense(e.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
