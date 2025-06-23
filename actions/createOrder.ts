"use server";

import { createOrder } from "@/sanity/queries";
import { auth } from "@clerk/nextjs/server";

export interface OrderItem {
  product: any;
  quantity: number;
}

export interface CreateOrderData {
  orderNumber: string;
  customerName: string;
  // customerEmail: string;
  items: OrderItem[];
  // address?: {
  //   name: string;
  //   address: string;
  //   city: string;
  //   state: string;
  //   zip: string;
  // } | null;
  // needsDelivery: boolean;
  totals: {
    subtotal: number;
    discount: number;
    total: number;
  };
}

export async function createOrderAction(orderData: CreateOrderData) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Usuario no autenticado");
    }

    // Calculate quantities from grouped items
    const itemsWithQuantity = orderData.items.map((item) => ({
      product: item.product,
      quantity: item.quantity || 1,
    }));

    const order = await createOrder({
      orderNumber: orderData.orderNumber,
      clerkUserId: userId,
      customerName: orderData.customerName,
      // customerEmail: orderData.customerEmail,
      items: itemsWithQuantity,
      // address: orderData.address,
      // needsDelivery: orderData.needsDelivery,
      totals: orderData.totals,
      status: "pending",
      paymentMethod: "bank_transfer",
    });

    return {
      success: true,
      orderId: order._id,
      orderNumber: orderData.orderNumber,
    };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
