// schemas/itemOrdered.ts
import { defineField, defineType } from "sanity";

export const itemOrdered = defineType({
  name: "itemOrdered", // Este 'name' debe coincidir con el '_type' que envías desde tu API Route
  title: "Ordered Item",
  type: "object", // Es un objeto dentro de un array, no un documento raíz
  fields: [
    defineField({
      name: "productRef",
      title: "Product Reference",
      type: "reference",
      to: [{ type: "product" }], // Asegúrate que 'product' sea el tipo de tu schema de productos
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "variant",
      title: "Variant",
      type: "string",
      // Puedes hacerlo opcional si no todos los productos tienen variantes
      // validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "quantity",
      title: "Quantity",
      type: "number",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "customization",
      title: "Customization",
      type: "object", // Define un objeto para agrupar los campos de personalización
      fields: [
        defineField({
          name: "soapType",
          title: "Tipo de Jabón",
          type: "string",
        }),
        defineField({
          name: "color",
          title: "Color",
          type: "string",
        }),
        defineField({
          name: "notes",
          title: "Notas de Personalización",
          type: "text", // Usamos 'text' para notas más largas
        }),
      ],
      // Puedes añadir un preview para el objeto de personalización si quieres
      // Por ejemplo, para que aparezca "Personalización: Jabón de Leche (Rojo)"

      preview: {
        select: {
          variant: "variant",
          soapType: "soapType",
          color: "color",
          notes: "notes",
        },
        prepare({ variant, soapType, color, notes }) {
          const subtitleParts = [];
          if (variant) subtitleParts.push(variant);
          if (soapType) subtitleParts.push(`Jabón: ${soapType}`);
          if (color) subtitleParts.push(`Color: ${color}`);
          if (notes) subtitleParts.push(`Notas: ${notes.substring(0, 30)}...`); // Muestra un extracto

          return {
            title: "Detalles de Personalización",
            subtitle: subtitleParts.join(" | "),
          };
        },
      },
    }),
  ],
  preview: {
    select: {
      name: "name",
      quantity: "quantity",
      price: "price",
      variant: "variant",
      soapType: "customization.soapType", // Seleccionar el tipo de jabón para el preview
      color: "customization.color", // Seleccionar el color para el preview
      notes: "customization.notes",
    },
    prepare({ name, quantity, price, variant, soapType, color, notes }) {
      const subtitleParts = [];
      if (variant) subtitleParts.push(variant);
      if (soapType) subtitleParts.push(`Jabón: ${soapType}`);
      if (color) subtitleParts.push(`Color: ${color}`);
      if (notes) subtitleParts.push(`Notas`); // Solo indicar que hay notas
      return {
        title: `${name} (${quantity})`,
        subtitle: `${subtitleParts.join(" | ")} - $${price}`,
      };
    },
  },
});
