import { groq } from "next-sanity";
import { sanityFetch } from "../lib/live";
import {
  BLOG_CATEGORIES,
  BRAND_QUERY,
  BRANDS_QUERY,
  DEAL_PRODUCTS,
  GET_ALL_BLOG,
  LATEST_BLOG_QUERY,
  MY_ORDERS_QUERY,
  OTHERS_BLOG_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  SINGLE_BLOG_QUERY,
} from "./query";
import { Product } from "@/sanity.types";

// ================== Categorías ==================
const getCategories = async (quantity?: number) => {
  try {
    const query = quantity
      ? `*[_type == 'category'] | order(name asc) [0...$quantity] {
          ...,
          "productCount": count(*[_type == "product" && references(^._id)])
        }`
      : `*[_type == 'category'] | order(name asc) {
          ...,
          "productCount": count(*[_type == "product" && references(^._id)])
        }`;

    const { data } = await sanityFetch({
      query,
      params: quantity ? { quantity } : {},
    });

    return data;
  } catch (error) {
    console.log("Error fetching categories", error);
    return [];
  }
};

export async function getCategoryBySlug(slug: string) {
  const query = `
    *[_type == "category" && slug.current == $slug][0] {
      _id,
      _createdAt,
      _updatedAt,
      title,
      slug,
      description,
      richDescription,
      "productCount": count(*[_type == "product" && references(^._id)])
    }
  `;

  try {
    const { data } = await sanityFetch({ query, params: { slug } });
    return data;
  } catch (error) {
    console.error("Error fetching category by slug:", error);
    return null;
  }
}

export async function getProductsByCategory(categorySlug: string) {
  const query = `
    *[_type == "product" && references(*[_type == "category" && slug.current == $categorySlug]._id)] | order(name asc) {
      _id,
      _createdAt,
      _updatedAt,
      name,
      slug,
      description,
      richDescription,
      price,
      discount,
      stock,
      variant,
      images,
      "categories": categories[]->title,
      "brand": brand->title
    }
  `;

  try {
    const { data } = await sanityFetch({ query, params: { categorySlug } });
    return data ?? [];
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
}

export async function getRelatedProducts(
  categoryIds: string[],
  currentProductSlug: string
): Promise<Product[]> {
  if (!categoryIds || categoryIds.length === 0) return [];

  const query = groq`*[_type == "product" && count(categories[]->_ref[@in $categoryIds]) > 0 && slug.current != $currentProductSlug][0...4]{
    _id,
    name,
    slug,
    price,
    discount,
    description,
    richDescription,
    images[]{
      asset->{
        url
      }
    },
    stock
  }`;

  try {
    const { data } = await sanityFetch({
      query,
      params: { categoryIds, currentProductSlug },
    });
    return data ?? [];
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

// ================== Brands ==================
const getAllBrands = async () => {
  try {
    const { data } = await sanityFetch({ query: BRANDS_QUERY });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching all brands:", error);
    return [];
  }
};

const getBrand = async (slug: string) => {
  try {
    const { data } = await sanityFetch({
      query: BRAND_QUERY,
      params: { slug },
    });
    return data ?? null;
  } catch (error) {
    console.error("Error fetching brand by slug:", error);
    return null;
  }
};

// ================== Blogs ==================
const getLatestBlogs = async () => {
  try {
    const { data } = await sanityFetch({ query: LATEST_BLOG_QUERY });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching latest Blogs:", error);
    return [];
  }
};

const getAllBlogs = async (quantity: number) => {
  try {
    const { data } = await sanityFetch({
      query: GET_ALL_BLOG,
      params: { quantity },
    });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching all blogs:", error);
    return [];
  }
};

const getSingleBlog = async (slug: string) => {
  try {
    const { data } = await sanityFetch({
      query: SINGLE_BLOG_QUERY,
      params: { slug },
    });
    return data ?? null;
  } catch (error) {
    console.log("Error fetching single blog:", error);
    return null;
  }
};

const getBlogCategories = async () => {
  try {
    const { data } = await sanityFetch({
      query: BLOG_CATEGORIES,
    });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching blog categories:", error);
    return [];
  }
};

const getOthersBlog = async (slug: string, quantity: number) => {
  try {
    const { data } = await sanityFetch({
      query: OTHERS_BLOG_QUERY,
      params: { slug, quantity },
    });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching other blogs:", error);
    return [];
  }
};

// ================== Products ==================
const getDealProducts = async () => {
  try {
    const { data } = await sanityFetch({ query: DEAL_PRODUCTS });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching deal Products:", error);
    return [];
  }
};

const getProductBySlug = async (slug: string) => {
  try {
    const { data } = await sanityFetch({
      query: PRODUCT_BY_SLUG_QUERY,
      params: { slug },
    });
    return data ?? null;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
};

// ================== Orders ==================
const getMyOrders = async (userId: string) => {
  if (!userId) return [];

  try {
    const { data } = await sanityFetch({
      query: MY_ORDERS_QUERY,
      params: { userId },
    });
    return data ?? [];
  } catch (error) {
    console.error("Error fetching my orders:", error);
    return [];
  }
};

export {
  getCategories,
  getAllBrands,
  getLatestBlogs,
  getDealProducts,
  getProductBySlug,
  getBrand,
  getMyOrders,
  getAllBlogs,
  getSingleBlog,
  getBlogCategories,
  getOthersBlog,
};
