import { defineLive } from "next-sanity";
import { client } from "./client";

// Verificar que las variables de entorno estén configuradas
const token = process.env.SANITY_API_READ_TOKEN;
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!token) {
  console.warn("SANITY_API_READ_TOKEN is not set. Live preview will not work.");
  // En lugar de lanzar error, usar una función alternativa
}

if (!projectId) {
  throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is not set");
}

if (!dataset) {
  throw new Error("NEXT_PUBLIC_SANITY_DATASET is not set");
}

// Solo configurar live si tenemos el token
export const { sanityFetch, SanityLive } = token
  ? defineLive({
      client,
      serverToken: token,
      browserToken: token,
    })
  : {
      // Fallback cuando no hay token
      sanityFetch: async ({
        query,
        params = {},
      }: {
        query: string;
        params?: any;
      }) => {
        const data = await client.fetch(query, params);
        return { data };
      },
      SanityLive: () => null,
    };
