import { TrolleyIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Products",
  type: "document",
  icon: TrolleyIcon,
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "images",
      title: "Product Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "discount",
      title: "Discount",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
    }),
    defineField({
      name: "stock",
      title: "Stock",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "status",
      title: "Product Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Hot", value: "hot" },
          { title: "Sale", value: "sale" },
        ],
      },
    }),
    defineField({
      name: "variant",
      title: "Product Type",
      type: "string",
      options: {
        list: [
          { title: "Jabones", value: "jabones" },
          { title: "Regalos", value: "regalos" },
          { title: "Corporal", value: "corporal" },
          { title: "Facial", value: "facial" },
          { title: "Combos", value: "combos" },
          { title: "Infantiles", value: "infantiles" },
        ],
      },
    }),
    defineField({
      name: "isFeatured",
      title: "Featured Product",
      type: "boolean",
      description: "Toggle to Featured on or off",
      initialValue: false,
    }),

    // Características específicas del jabón
    defineField({
      name: "weight",
      title: "Peso (gramos)",
      type: "number",
    }),
    defineField({
      name: "quantity",
      title: "Cantidad",
      type: "string",
    }),
    defineField({
      name: "fragrance",
      title: "Fragancia",
      type: "string",
    }),
    defineField({
      name: "skinType",
      title: "Tipo de Piel",
      type: "string",
    }),
    defineField({
      name: "origin",
      title: "Origen",
      type: "string",
    }),
    defineField({
      name: "ingredients",
      title: "Ingredientes",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "customization",
      title: "Personalización",
      type: "object",
      fields: [
        defineField({
          name: "soapType",
          title: "Tipo de Jabón",
          type: "string", // Sin validación .nullable() si no quieres null
        }),
        defineField({
          name: "color",
          title: "Color",
          type: "string", // Sin validación .nullable() si no quieres null
        }),
        defineField({
          name: "notes",
          title: "Notas",
          type: "text", // Sin validación .nullable() si no quieres null
        }),
      ],
      // ... cualquier preview para la personalización
    }),
  ],

  preview: {
    select: {
      title: "name",
      media: "images",
      subtitle: "price",
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      const image = media && media[0];
      return {
        title,
        subtitle: `$${subtitle}`,
        media: image,
      };
    },
  },
});
