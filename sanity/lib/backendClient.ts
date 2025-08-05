import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

console.log("🧪 SANITY_API_TOKEN:", process.env.SANITY_API_TOKEN);

export const backendClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
  //  revalidation
  token: process.env.SANITY_API_TOKEN,
});
