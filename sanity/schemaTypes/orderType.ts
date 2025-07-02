// schemas/order.ts
import { defineField, defineType } from "sanity";

export const order = defineType({
  name: "order",
  title: "Order",
  type: "document",
  fields: [
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "orderDate",
      title: "Order Date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Pending Confirmation", value: "pending_confirmation" },
          { title: "Processing", value: "processing" },
          { title: "Shipped", value: "shipped" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
        ],
        layout: "dropdown",
      },
      initialValue: "pending_confirmation",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "customer",
      title: "Customer",
      type: "object",
      fields: [
        defineField({ name: "name", title: "Name", type: "string" }),
        defineField({ name: "email", title: "Email", type: "string" }),
        defineField({ name: "id", title: "ID", type: "string" }), // Si manejas IDs de usuario
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [
        {
          type: "itemOrdered",
          // fields: [
          //   defineField({
          //     name: "productRef",
          //     title: "Product Reference",
          //     type: "reference",
          //     to: [{ type: "product" }], // Asegúrate que 'product' sea el tipo de tu schema de productos
          //   }),
          //   defineField({
          //     name: "name",
          //     title: "Product Name",
          //     type: "string",
          //   }),
          //   defineField({ name: "price", title: "Price", type: "number" }),
          //   defineField({ name: "variant", title: "Variant", type: "string" }), // Si tienes variantes
          //   defineField({
          //     name: "quantity",
          //     title: "Quantity",
          //     type: "number",
          //   }), // Cantidad del producto
          // ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "totals",
      title: "Totals",
      type: "object",
      fields: [
        defineField({ name: "subtotal", title: "Subtotal", type: "number" }),
        defineField({ name: "discount", title: "Discount", type: "number" }),
        defineField({ name: "total", title: "Total", type: "number" }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    // Puedes añadir más campos como dirección de envío, método de pago, etc.
  ],
  preview: {
    select: {
      orderNumber: "orderNumber",
      customerName: "customer.name",
      status: "status",
      total: "totals.total",
    },
    prepare({ orderNumber, customerName, status, total }) {
      return {
        title: `${orderNumber} - ${customerName}`,
        subtitle: `${status} - Total: $${total}`,
      };
    },
  },
});
