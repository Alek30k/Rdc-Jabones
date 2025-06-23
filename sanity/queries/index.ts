import { client } from "../lib/client";
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

const getAllBrands = async () => {
  try {
    const { data } = await sanityFetch({ query: BRANDS_QUERY });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching all brands:", error);
    return [];
  }
};

const getLatestBlogs = async () => {
  try {
    const { data } = await sanityFetch({ query: LATEST_BLOG_QUERY });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching latest Blogs:", error);
    return [];
  }
};

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
    const product = await sanityFetch({
      query: PRODUCT_BY_SLUG_QUERY,
      params: {
        slug,
      },
    });
    return product?.data || null;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
};

const getBrand = async (slug: string) => {
  try {
    const product = await sanityFetch({
      query: BRAND_QUERY,
      params: {
        slug,
      },
    });
    return product?.data || null;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
};

const getMyOrders = async (userId: string) => {
  if (!userId) {
    return [];
  }

  try {
    const orders = await sanityFetch({
      query: MY_ORDERS_QUERY,
      params: { userId },
    });
    return orders?.data || [];
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
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
    console.log("Error fetching all brands:", error);
    return [];
  }
};

const getSingleBlog = async (slug: string) => {
  try {
    const { data } = await sanityFetch({
      query: SINGLE_BLOG_QUERY,
      params: { slug },
    });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching all brands:", error);
    return [];
  }
};

const getBlogCategories = async () => {
  try {
    const { data } = await sanityFetch({
      query: BLOG_CATEGORIES,
    });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching all brands:", error);
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
    console.log("Error fetching all brands:", error);
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
      "productCount": count(*[_type == "product" && references(^._id)])
    }
  `;

  try {
    const category = await client.fetch(query, { slug });
    return category;
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
    const products = await client.fetch(query, { categorySlug });
    return products || [];
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
}

/**
 * Create a new order in Sanity
 */
export async function createOrder(orderData: {
  orderNumber: string;
  clerkUserId: string;
  customerName: string;
  // customerEmail: string;
  items: Array<{
    product: any;
    quantity: number;
  }>;
  // address?: any | null;
  // needsDelivery: boolean;
  totals: {
    subtotal: number;
    discount: number;
    total: number;
  };
  status: string;
  paymentMethod: string;
}) {
  try {
    const order = {
      _type: "order",
      orderNumber: orderData.orderNumber,
      clerkUserId: orderData.clerkUserId,
      customerName: orderData.customerName,
      // email: orderData.customerEmail,
      currency: "ARS",
      amountDiscount: orderData.totals.discount,
      products: orderData.items.map((item) => ({
        _key: item.product._id,
        product: {
          _type: "reference",
          _ref: item.product._id,
        },
        quantity: item.quantity,
      })),
      totalPrice: orderData.totals.total,
      status: orderData.status,
      orderDate: new Date().toISOString(),
      // needsDelivery: orderData.needsDelivery,
      // deliveryMethod: orderData.needsDelivery ? "delivery" : "pickup",
      // ...(orderData.address &&
      //   orderData.needsDelivery && {
      //     shippingAddress: {
      //       _type: "shippingAddress",
      //       name: orderData.address.name,
      //       address: orderData.address.address,
      //       city: orderData.address.city,
      //       state: orderData.address.state,
      //       zip: orderData.address.zip,
      //     },
      //   }),
      paymentMethod: orderData.paymentMethod,
      paymentStatus: "pending",
    };

    const result = await client.create(order);
    return result;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const result = await client
      .patch(orderId)
      .set({ status, updatedAt: new Date().toISOString() })
      .commit();
    return result;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}

/**
 * Get order by order number
 */
export async function getOrderByNumber(orderNumber: string) {
  const query = `
    *[_type == "order" && orderNumber == $orderNumber][0] {
      _id,
      _createdAt,
      orderNumber,
      customerName,
      email,
      totalPrice,
      status,
      paymentStatus,
      orderDate,
      products[] {
        _key,
        quantity,
        product-> {
          _id,
          name,
          price,
          images,
          slug
        }
      },
      shippingAddress,
      paymentMethod
    }
  `;

  try {
    const order = await client.fetch(query, { orderNumber });
    return order;
  } catch (error) {
    console.error("Error fetching order by number:", error);
    return null;
  }
}

/**
 * Test function to verify permissions
 */
export async function testSanityPermissions() {
  try {
    // Intentar crear un documento de prueba
    const testDoc = {
      _type: "order",
      orderNumber: "TEST-" + Date.now(),
      clerkUserId: "test",
      customerName: "Test User",
      email: "test@example.com",
      currency: "ARS",
      amountDiscount: 0,
      products: [],
      totalPrice: 0,
      status: "pending",
      orderDate: new Date().toISOString(),
      needsDelivery: false,
      deliveryMethod: "pickup",
      paymentMethod: "bank_transfer",
      paymentStatus: "pending",
    };

    const result = await client.create(testDoc);

    // Eliminar el documento de prueba
    await client.delete(result._id);

    return { success: true, message: "Permisos verificados correctamente" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

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
