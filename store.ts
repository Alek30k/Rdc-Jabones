import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/sanity.types"; // Tu tipo base de Sanity
import type { ProductCustomization } from "@/components/AddToCartButton"; // Importa la interfaz de personalización

// Extiende el tipo Product para incluir la personalización
export interface ProductWithCustomization extends Product {
  customization?: ProductCustomization;
}

// Actualiza la interfaz CartItem para incluir la personalización
export interface CartItem {
  product: ProductWithCustomization; // El producto en el carrito ahora puede tener personalización
  quantity: number;
}

interface StoreState {
  items: CartItem[];
  addItem: (product: ProductWithCustomization) => void;
  removeItem: (productId: string) => void;
  deleteCartProduct: (productId: string) => void;
  resetCart: () => void;
  getTotalPrice: () => number;
  getSubTotalPrice: () => number;
  getItemCount: (
    productId: string,
    customization?: ProductCustomization
  ) => number;
  getGroupedItems: () => CartItem[];

  // favorite
  favoriteProduct: Product[];
  addToFavorite: (product: Product) => Promise<void>;
  removeFromFavorite: (productId: string) => void;
  resetFavorite: () => void;
}

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      items: [],
      favoriteProduct: [],

      addItem: (product) =>
        set((state) => {
          const existingItemIndex = state.items.findIndex((item) => {
            if (item.product._id !== product._id) return false;

            if (item.product.customization && product.customization) {
              return (
                JSON.stringify(item.product.customization) ===
                JSON.stringify(product.customization)
              );
            }

            if (item.product.customization || product.customization)
              return false;

            return true;
          });

          if (existingItemIndex > -1) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += 1;
            return { items: newItems };
          } else {
            return { items: [...state.items, { product, quantity: 1 }] };
          }
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.reduce((acc, item) => {
            if (item.product._id === productId) {
              if (item.quantity > 1) {
                acc.push({ ...item, quantity: item.quantity - 1 });
              }
            } else {
              acc.push(item);
            }
            return acc;
          }, [] as CartItem[]),
        })),

      deleteCartProduct: (productId) =>
        set((state) => ({
          items: state.items.filter(
            ({ product }) => product?._id !== productId
          ),
        })),

      resetCart: () => set({ items: [] }),

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + (item.product.price ?? 0) * item.quantity,
          0
        );
      },

      getSubTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = item.product.price ?? 0;
          const discount = ((item.product.discount ?? 0) * price) / 100;
          const discountedPrice = price + discount;
          return total + discountedPrice * item.quantity;
        }, 0);
      },

      getItemCount: (productId, customization) => {
        if (customization) {
          const item = get().items.find(
            (item) =>
              item.product._id === productId &&
              JSON.stringify(item.product.customization) ===
                JSON.stringify(customization)
          );
          return item ? item.quantity : 0;
        } else {
          return get()
            .items.filter((item) => item.product._id === productId)
            .reduce((count, item) => count + item.quantity, 0);
        }
      },

      getGroupedItems: () => get().items,

      addToFavorite: (product: Product) => {
        return new Promise<void>((resolve) => {
          set((state: StoreState) => {
            const isFavorite = state.favoriteProduct.some(
              (item) => item._id === product._id
            );

            return {
              favoriteProduct: isFavorite
                ? state.favoriteProduct.filter(
                    (item) => item._id !== product._id
                  )
                : [...state.favoriteProduct, { ...product }],
            };
          });
          resolve();
        });
      },

      removeFromFavorite: (productId: string) => {
        set((state: StoreState) => ({
          favoriteProduct: state.favoriteProduct.filter(
            (item) => item?._id !== productId
          ),
        }));
      },

      resetFavorite: () => {
        set({ favoriteProduct: [] });
      },
    }),
    {
      name: "cart-store",
    }
  )
);

export default useStore;
