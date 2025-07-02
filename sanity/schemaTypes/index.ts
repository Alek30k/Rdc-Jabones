import { type SchemaTypeDefinition } from "sanity";
import { categoryType } from "./categoryType";
import { blockContentType } from "./blockContentType";
import { productType } from "./productType";
import { authorType } from "./authorType";
import { addressType } from "./addressType";
import { order } from "./orderType";
import { itemOrdered } from "./itemOrdered";

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
