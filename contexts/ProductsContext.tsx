"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "react-hot-toast";

export interface Product {
  id: string;
  name: string;
  cost_per_unit: number;
  price_per_unit: number;
  units_sold: number;
  category: string;
  created_at: string;
}

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  refreshProducts: () => Promise<void>;
  saveProduct: (
    product: Omit<Product, "id" | "created_at">,
    editingId?: string | null
  ) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | null>(null);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const refreshProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) toast.error("Error al cargar productos");
    else
      setProducts(
        data.map((p) => ({
          ...p,
          cost_per_unit: Number(p.cost_per_unit),
          price_per_unit: Number(p.price_per_unit),
          units_sold: Number(p.units_sold),
        }))
      );

    setLoading(false);
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  const saveProduct = async (
    productData: Omit<Product, "id" | "created_at">,
    editingId?: string | null
  ) => {
    if (editingId) {
      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", editingId);
      if (error) return toast.error("Error al actualizar producto");
      toast.success("Producto actualizado");
    } else {
      const { error } = await supabase
        .from("products")
        .insert([{ ...productData, id: crypto.randomUUID() }]);
      if (error) return toast.error("Error al agregar producto");
      toast.success("Producto agregado");
    }

    refreshProducts();
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error("Error al eliminar producto");

    toast.success("Producto eliminado");
    refreshProducts();
  };

  return (
    <ProductsContext.Provider
      value={{ products, loading, refreshProducts, saveProduct, deleteProduct }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx)
    throw new Error("useProducts must be used inside <ProductsProvider>");
  return ctx;
}
