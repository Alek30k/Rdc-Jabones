import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function SaleConfirmModal({
  open,
  onOpenChange,
  product,
  onConfirm,
}) {
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState("");

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setDate(new Date().toISOString().split("T")[0]);
    }
  }, [product]);

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar venta de {product.name}</DialogTitle>
        </DialogHeader>
        onConfirm
        <div className="space-y-4">
          <div>
            <label>Cantidad</label>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
          </div>

          <div>
            <label>Fecha</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <p className="font-semibold">
            Total: ${quantity * product.pricePerUnit}
          </p>

          <Button className="w-full" onClick={() => onConfirm(quantity, date)}>
            Confirmar Venta
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
