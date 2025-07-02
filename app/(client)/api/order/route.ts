// app/api/order/route.ts
import { NextResponse } from "next/server";
import { serverClient } from "@/sanity/lib/client";

export async function POST(req: Request) {
  try {
    const { orderData } = await req.json();

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
      items: orderData.items.map((item: any, index: number) => ({
        // <-- Añadimos 'index' aquí
        _key: `${item.product._id}-${index}`, // <-- ¡Añade esta línea para generar una key única!
        _type: "itemOrdered", // Si no tienes este schema en Sanity, puedes omitirlo o dejarlo como objeto
        productRef: {
          _ref: item.product._id,
          _type: "reference",
        },
        name: item.product.name,
        price: item.product.price,
        variant: item.product.variant,
        quantity: item.quantity || 1,
      })),
    };

    // Crear el documento en Sanity
    const createdOrder = await serverClient.create(doc);

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
