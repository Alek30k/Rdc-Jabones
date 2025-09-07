import { defineField, defineType } from "sanity";
import { Home, MapPin } from "lucide-react";

export default defineType({
  name: "address",
  title: "Address",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Address Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "address",
      title: "Full Address",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "state",
      title: "State/Department",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "zip",
      title: "ZIP/Postal Code",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "country",
      title: "Country",
      type: "string",
      initialValue: "Argentina",
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
    }),
    defineField({
      name: "notes",
      title: "Delivery Notes",
      type: "text",
    }),
    defineField({
      name: "default",
      title: "Default Address",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "userId",
      title: "User ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "userEmail",
      title: "User Email",
      type: "string",
    }),
    defineField({
      name: "userName",
      title: "User Name",
      type: "string",
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "address",
      isDefault: "default",
    },
    prepare(selection) {
      const { title, subtitle, isDefault } = selection;
      return {
        title,
        subtitle,
        media: isDefault ? Home : MapPin,
      };
    },
  },
});
