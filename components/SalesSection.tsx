"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import ProductSaleCard from "./ProductSaleCard";
import SaleConfirmModal from "./SaleConfirmModal";
import SalesHistory from "./SalesHistory";
import { v4 as uuid } from "uuid";
import { Input } from "./ui/input";

export default function SalesSection() {
  const supabase = createClient();

  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [massSaleItems, setMassSaleItems] = useState([]);

  const [search, setSearch] = useState("");

  useEffect(() => {
    loadProducts();
    loadSales();
  }, []);

  const loadProducts = async () => {
    const { data } = await supabase.from("products").select("*");

    const formatted = data.map((p) => ({
      id: p.id_new,
      name: p.name,
      pricePerUnit: p.price_per_unit,
      stock: p.stock,
    }));

    setProducts(formatted);
  };

  const loadSales = async () => {
    const { data } = await supabase.from("sales").select("*");
    setSales(data || []);
  };

  // --------------------------------------------------
  // 🟩 Venta Individual (MEJORADA CON VALIDACIÓN)
  // --------------------------------------------------
  const handleConfirmSale = async (quantity, date) => {
    try {
      quantity = Number(quantity);

      // Validaciones fundamentales
      if (quantity <= 0) {
        toast.error("La cantidad debe ser mayor a 0");
        return;
      }

      if (quantity > selectedProduct.stock) {
        toast.error(
          `Stock insuficiente. Solo hay ${selectedProduct.stock} unidades disponibles.`
        );
        return;
      }

      const total = selectedProduct.pricePerUnit * quantity;

      // 🔥 Registrar venta
      const { error: saleError } = await supabase.from("sales").insert({
        id: uuid(),
        product_id: selectedProduct.id,
        quantity,
        date: date || new Date().toISOString().slice(0, 10),
        total_amount: total,
      });

      if (saleError) throw saleError;

      // 🔥 Actualizar stock
      const newStock = selectedProduct.stock - quantity;

      const { error: stockError } = await supabase
        .from("products")
        .update({ stock: newStock })
        .eq("id_new", selectedProduct.id);

      if (stockError) throw stockError;

      toast.success("Venta registrada y stock actualizado");

      setModalOpen(false);
      loadProducts();
      loadSales();
    } catch (error) {
      console.error("INSERT + STOCK ERROR:", error);
      toast.error("Error al registrar venta");
    }
  };

  // --------------------------------------------------
  // 🟥 Eliminar venta
  // --------------------------------------------------
  const handleDeleteSale = async (sale) => {
    try {
      await supabase.from("sales").delete().eq("id", sale.id);
      toast.success("Venta eliminada");
      loadSales();
    } catch {
      toast.error("Error al eliminar venta");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Vender Productos</h2>

      <Input
        placeholder="Buscar producto..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {/* TARJETAS DE PRODUCTOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {products
          .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
          .map((product) => (
            <ProductSaleCard
              key={product.id}
              product={product}
              onSell={() => {
                setSelectedProduct(product);
                setModalOpen(true);
              }}
            />
          ))}
      </div>

      {/* MODALES */}
      <SaleConfirmModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        product={selectedProduct}
        onConfirm={handleConfirmSale}
      />

      {/* HISTORIAL */}
      <SalesHistory
        sales={sales}
        products={products}
        deleteSale={handleDeleteSale}
      />
    </div>
  );
}
1;
