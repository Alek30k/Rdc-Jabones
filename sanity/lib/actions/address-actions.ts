"use server";

import { client } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";

export interface AddressFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
  notes?: string;
  isDefault: boolean;
  userId: string;
  userEmail: string;
  userName: string;
}

// Función para crear o verificar que el usuario existe en Sanity
async function ensureUserExists(
  userId: string,
  userEmail: string,
  userName: string
) {
  try {
    // Verificar si el usuario ya existe
    const existingUser = await client.fetch(
      `*[_type == "user" && _id == "${userId}"][0]`
    );

    if (existingUser) {
      return existingUser;
    }

    // Si no existe, crear el usuario
    const newUser = await client.create({
      _type: "user",
      _id: userId, // Usar el ID de Clerk como ID en Sanity
      email: userEmail,
      name: userName,
      createdAt: new Date().toISOString(),
    });

    return newUser;
  } catch (error) {
    console.error("Error ensuring user exists:", error);
    throw error;
  }
}

export async function createAddress(formData: AddressFormData) {
  try {
    // Primero, asegurar que el usuario existe en Sanity
    await ensureUserExists(
      formData.userId,
      formData.userEmail,
      formData.userName
    );

    // Si esta dirección será la predeterminada, primero actualizamos las otras
    if (formData.isDefault) {
      await client
        .patch({
          query: `*[_type=="address" && user._ref == "${formData.userId}"]`,
        })
        .set({ default: false })
        .commit();
    }

    // Crear la nueva dirección
    const newAddress = await client.create({
      _type: "address",
      name: formData.name,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      country: formData.country,
      phone: formData.phone || "",
      notes: formData.notes || "",
      default: formData.isDefault,
      user: {
        _type: "reference",
        _ref: formData.userId,
      },
      publishedAt: new Date().toISOString(),
    });

    // Revalidar la página para actualizar los datos
    revalidatePath("/cart");

    return {
      success: true,
      data: newAddress,
      message: "Dirección agregada exitosamente!",
    };
  } catch (error) {
    console.error("Error creating address:", error);
    return {
      success: false,
      error: "Error al agregar la dirección. Intenta nuevamente.",
    };
  }
}

export async function getAddresses(userId: string) {
  try {
    const query = `*[_type=="address" && user._ref == "${userId}"] | order(publishedAt desc)`;
    const addresses = await client.fetch(query);

    return {
      success: true,
      data: addresses,
    };
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return {
      success: false,
      error: "Error al cargar las direcciones",
      data: [],
    };
  }
}

// Función alternativa que no requiere referencias de usuario
export async function createAddressSimple(formData: AddressFormData) {
  try {
    // Si esta dirección será la predeterminada, primero actualizamos las otras
    if (formData.isDefault) {
      await client
        .patch({
          query: `*[_type=="address" && userId == "${formData.userId}"]`,
        })
        .set({ default: false })
        .commit();
    }

    // Crear la nueva dirección sin referencia, solo con el ID del usuario
    const newAddress = await client.create({
      _type: "address",
      name: formData.name,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      country: formData.country,
      phone: formData.phone || "",
      notes: formData.notes || "",
      default: formData.isDefault,
      userId: formData.userId, // Almacenar como string en lugar de referencia
      userEmail: formData.userEmail,
      userName: formData.userName,
      publishedAt: new Date().toISOString(),
    });

    // Revalidar la página para actualizar los datos
    revalidatePath("/cart");

    return {
      success: true,
      data: newAddress,
      message: "Dirección agregada exitosamente!",
    };
  } catch (error) {
    console.error("Error creating address:", error);
    return {
      success: false,
      error: "Error al agregar la dirección. Intenta nuevamente.",
    };
  }
}

export async function getAddressesSimple(userId: string) {
  try {
    const query = `*[_type=="address" && userId == "${userId}"] | order(publishedAt desc)`;
    const addresses = await client.fetch(query);

    return {
      success: true,
      data: addresses,
    };
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return {
      success: false,
      error: "Error al cargar las direcciones",
      data: [],
    };
  }
}
