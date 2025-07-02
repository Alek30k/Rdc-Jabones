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
  } catch (error: unknown) {
    // <-- ¡Cambiado de 'any' a 'unknown'!
    console.error("Error creating order in API route:", error);

    let errorMessage = "Internal server error during order creation.";
    let statusCode = 500;

    // Verificar si el error es una instancia de Error
    if (error instanceof Error) {
      errorMessage = error.message;
      // Podrías añadir lógica para errores específicos de Sanity aquí
      // Por ejemplo, si Sanity client lanza un error con una propiedad 'statusCode'
      // if ('statusCode' in error && typeof error.statusCode === 'number') {
      //     statusCode = error.statusCode;
      // }
    } else if (
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof (error as { message: unknown }).message === "string"
    ) {
      // Para errores devueltos como objetos con una propiedad 'message'
      errorMessage = (error as { message: string }).message;
      // Similar, si tuviera un statusCode en el objeto de error
      // if ('statusCode' in error && typeof (error as { statusCode: unknown }).statusCode === 'number') {
      //     statusCode = (error as { statusCode: number }).statusCode;
      // }
    }

    // Aquí manejamos errores específicos de Sanity si tienen un formato conocido
    // Por ejemplo, si el cliente de Sanity lanza errores con un statusCode
    // Nota: Esto depende de cómo el cliente de Sanity expone sus errores.
    // Podrías necesitar inspeccionar el 'error' en la consola para ver su estructura real.
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
      { message: `Error al crear el pedido: ${errorMessage}`, error: error }, // Puedes incluir el objeto 'error' completo para depuración, pero ten cuidado con datos sensibles
      { status: statusCode }
    );
  }
}
