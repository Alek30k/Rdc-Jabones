import { type SchemaTypeDefinition } from "sanity";
import { categoryType } from "./categoryType";
import { blockContentType } from "./blockContentType";
import { productType } from "./productType";
import { orderType } from "./orderType";
import { authorType } from "./authorType";
import { addressType } from "./addressType";
import { applicationType } from "./applicationTypes";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    categoryType,
    blockContentType,
    productType,
    orderType,
    authorType,
    addressType,
    applicationType,
  ],
};
