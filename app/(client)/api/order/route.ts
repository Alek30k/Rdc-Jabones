// app/api/order/route.ts
import { NextResponse } from "next/server";
import { Product } from "@/sanity.types"; // Importa Product si lo necesitas para la tipificación
import { client } from "@/sanity/lib/client";

// Define la interfaz para cada item dentro del array de items del pedido
// Esta interfaz debe coincidir con cómo se envía el item desde el frontend
interface OrderItem {
  product: Product; // Asumiendo que Product viene de '@/sanity.types'
  quantity: number;
  // Añade aquí cualquier otra propiedad que cada item pueda tener
  variant?: string; // Por ejemplo, si variant es opcional
}

// Define la interfaz para el cuerpo completo de la solicitud que esperas recibir
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
    items: OrderItem[]; // Usa la interfaz OrderItem aquí
    totals: {
      subtotal: number;
      discount: number;
      total: number;
    };
    // Puedes añadir otros campos como shippingAddress si los manejas
  };
}

export async function POST(req: Request) {
  try {
    // Aquí tipamos explícitamente el cuerpo de la solicitud
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
      })),
    };

    // Crear el documento en Sanity
    const createdOrder = await client.create(doc);

    return NextResponse.json(
      { message: "Order created successfully", order: createdOrder },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating order:", error);

    if (error.statusCode === 401) {
      return NextResponse.json(
        {
          message: "Authentication error with Sanity API. Check your token.",
          error: error.message,
        },
        { status: 401 }
      );
    }
    if (error.statusCode === 400) {
      return NextResponse.json(
        {
          message:
            "Invalid data for Sanity document. Check schema and data structure.",
          error: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Internal server error during order creation.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
