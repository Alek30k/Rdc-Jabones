import { type SchemaTypeDefinition } from "sanity";
import { categoryType } from "./categoryType";
import { blockContentType } from "./blockContentType";
import { productType } from "./productType";
import { authorType } from "./authorType";
import { order } from "./orderType";
import { itemOrdered } from "./itemOrdered";
import addressType from "./addressType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    categoryType,
    blockContentType,
    productType,
    order,
    itemOrdered,
    authorType,
    addressType,
  ],
};
