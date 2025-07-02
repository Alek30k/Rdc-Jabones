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
    // Puedes añadir otros campos si es necesario, por ejemplo, una URL de imagen para el thumbnail
    // defineField({
    //   name: "image",
    //   title: "Image",
    //   type: "image",
    //   options: {
    //     hotspot: true, // Si quieres que la imagen sea editable con punto de interés
    //   },
    // }),
  ],
  preview: {
    select: {
      name: "name",
      quantity: "quantity",
      price: "price",
      variant: "variant",
    },
    prepare({ name, quantity, price, variant }) {
      return {
        title: `${name} (${quantity})`,
        subtitle: `${variant ? variant + " - " : ""}$${price}`,
      };
    },
  },
});
