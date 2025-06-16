import { client } from "./lib/client";
import { sanityFetch } from "./lib/live";
import { OTHERS_BLOG_QUERY } from "./queries/query";

export const getOthersBlog = async (slug: string, quantity: number) => {
  try {
    const { data } = await sanityFetch({
      query: OTHERS_BLOG_QUERY,
      params: { slug, quantity },
    });
    return data ?? [];
  } catch (error) {
    console.error("Error fetching other blogs:", error);
    return [];
  }
};

// Función para buscar productos
export const searchProductsExtended = async (query: string, limit = 50) => {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const searchQuery = `
    *[_type == "product" && (
      name match $searchTerm ||
      description match $searchTerm ||
      categories match $searchTerm
    )] | order(_score desc, name asc) [0...${limit}] {
      _id,
      name,
      slug,
      price,
      discount,
      stock,
      status,
      categories,
      images,
      description,
      _score
    }
  `;

  try {
    const results = await client.fetch(searchQuery, {
      searchTerm: `*${query.trim()}*`,
    });
    return results || [];
  } catch (error) {
    console.error("Error fetching extended search results:", error);
    return [];
  }
};

// Actualizar la función original para usar la extendida
export const searchProducts = async (query: string) => {
  return searchProductsExtended(query, 20);
};

// Versión alternativa si las categorías son referencias
export async function searchProductsWithCategories(query: string) {
  const searchQuery = `
    *[_type == "product" && (
      name match $searchTerm ||
      description match $searchTerm
    )] {
      _id,
      name,
      slug,
      price,
      discount,
      stock,
      status,
      "categories": categories[]->name,
      images,
      description
    } | order(_score desc, name asc) [0...20]
  `;

  try {
    const results = await client.fetch(searchQuery, {
      searchTerm: `*${query}*`,
    });
    return results;
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
}

// Función más simple para empezar
export async function searchProductsSimple(query: string) {
  const searchQuery = `
    *[_type == "product" && name match $searchTerm] {
      _id,
      name,
      slug,
      price,
      discount,
      stock,
      status,
      categories,
      images,
      description
    } [0...20]
  `;

  try {
    const results = await client.fetch(searchQuery, {
      searchTerm: `*${query}*`,
    });
    return results;
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
}

// Función para obtener productos por categoría
export async function getProductsByCategory(category: string) {
  if (!category) {
    return [];
  }

  const query = `
    *[_type == "product" && $category in categories] {
      _id,
      name,
      slug,
      price,
      discount,
      stock,
      status,
      categories,
      images,
      description
    }
  `;

  try {
    const results = await client.fetch(query, {
      category: category,
    });
    return results;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
}
