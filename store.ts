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
          // Generar una clave única para el ítem del carrito, incluyendo la personalización
          const getCustomizationKey = (
            custom: ProductCustomization | undefined
          ) => {
            if (!custom) return "";
            return `${custom.soapType || ""}-${custom.color || ""}-${custom.notes || ""}`;
          };

          const newItemCustomizationKey = getCustomizationKey(
            product.customization
          );

          const existingItemIndex = state.items.findIndex((item) => {
            // Compara el ID del producto
            if (item.product._id !== product._id) return false;

            // Compara las personalizaciones usando la clave generada
            const existingItemCustomizationKey = getCustomizationKey(
              item.product.customization
            );
            return existingItemCustomizationKey === newItemCustomizationKey;
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
        const getCustomizationKey = (
          custom: ProductCustomization | undefined
        ) => {
          if (!custom) return "";
          return `${custom.soapType || ""}-${custom.color || ""}-${custom.notes || ""}`;
        };

        const targetCustomizationKey = getCustomizationKey(customization);

        const item = get().items.find(
          (item) =>
            item.product._id === productId &&
            getCustomizationKey(item.product.customization) ===
              targetCustomizationKey
        );
        return item ? item.quantity : 0;
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
