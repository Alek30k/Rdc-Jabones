"use server";

import { testSanityPermissions } from "@/sanity/queries";

export async function testPermissionsAction() {
  try {
    const result = await testSanityPermissions();
    return result;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
