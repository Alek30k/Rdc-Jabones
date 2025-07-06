// app/api/order/route.ts
import { NextResponse } from "next/server";
import { Product } from "@/sanity.types";
import { client } from "@/sanity/lib/client";

interface OrderItem {
  product: Product;
  quantity: number;
  variant?: string;
}

interface RequestBody {
  orderData: {
    orderNumber: string;
    orderDate: string; // ISO string
    status: string;
    customer: {
      name: string;
      email: string;
      id: string;
    };
    items: OrderItem[];
    totals: {
      subtotal: number;
      discount: number;
      total: number;
    };
  };
}

export async function POST(req: Request) {
  try {
    const { orderData }: RequestBody = await req.json();

    if (!orderData) {
      return NextResponse.json(
        { message: "Order data is required" },
        { status: 400 }
      );
    }

    // Preparar los datos para Sanity
    const doc = {
      _type: "order",
      orderNumber: orderData.orderNumber,
      orderDate: orderData.orderDate,
      status: orderData.status,
      customer: orderData.customer,
      totals: orderData.totals,
      // Ahora 'item' está correctamente tipado como OrderItem
      items: orderData.items.map((item, index: number) => ({
        _key: `${item.product._id}-${index}`,
        _type: "itemOrdered", // Si no tienes este schema en Sanity, puedes omitirlo o dejarlo como objeto
        productRef: {
          _ref: item.product._id,
          _type: "reference",
        },
        name: item.product.name,
        price: item.product.price, // TypeScript ya no debería quejarse si Product tiene price
        variant: item.product.variant,
        quantity: item.quantity, // quantity ya está tipado y debería existir
        customization: item.product.customization // <-- ESTA LÍNEA ES CLAVE
          ? {
              // Si customization existe en el producto, copiamos sus propiedades
              soapType: item.product.customization.soapType ?? null, // Usamos ?? null para que Sanity reciba null si es undefined
              color: item.product.customization.color ?? null,
              notes: item.product.customization.notes ?? null,
            }
          : undefined,
      })),
    };

    // Crear el documento en Sanity
    const createdOrder = await client.create(doc);

    return NextResponse.json(
      { message: "Order created successfully", order: createdOrder },
      { status: 201 }
    );
  } catch (error: unknown) {
    // <-- ¡Cambiado de 'any' a 'unknown'!
    console.error("Error creating order in API route:", error);

    let errorMessage = "Internal server error during order creation.";
    let statusCode = 500;

    // Verificar si el error es una instancia de Error
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof (error as { message: unknown }).message === "string"
    ) {
      errorMessage = (error as { message: string }).message;
    }
    if (
      errorMessage.includes("Authentication error") ||
      errorMessage.includes("token")
    ) {
      statusCode = 401;
    } else if (
      errorMessage.includes("Missing required field") ||
      errorMessage.includes("Invalid value")
    ) {
      statusCode = 400; // Posiblemente un error de validación de schema
    }

    return NextResponse.json(
      { message: `Error al crear el pedido: ${errorMessage}`, error: error },
      { status: statusCode }
    );
  }
}
