/**
 * Normaliza el texto removiendo tildes y convirtiendo a minúsculas
 * para búsquedas más flexibles que encuentren productos con o sin tildes
 *
 * @example
 * normalizeText("Cúrcuma") // returns "curcuma"
 * normalizeText("Aloe Vera") // returns "aloe vera"
 * normalizeText("Carbón Activado") // returns "carbon activado"
 */
export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD") // Descompone caracteres con tildes (á -> a + ´)
    .replace(/[\u0300-\u036f]/g, "") // Remueve los diacríticos (tildes)
    .trim();
};

/**
 * Compara dos textos sin considerar tildes ni mayúsculas
 *
 * @example
 * compareNormalized("Cúrcuma", "curcuma") // returns true
 * compareNormalized("Aloe Vera", "aloe vera") // returns true
 */
export const compareNormalized = (text1: string, text2: string): boolean => {
  return normalizeText(text1) === normalizeText(text2);
};

/**
 * Verifica si un texto contiene otro texto (sin considerar tildes ni mayúsculas)
 *
 * @example
 * includesNormalized("Jabón de Cúrcuma", "curcuma") // returns true
 * includesNormalized("Aloe Vera Natural", "aloe") // returns true
 */
export const includesNormalized = (
  text: string,
  searchTerm: string
): boolean => {
  return normalizeText(text).includes(normalizeText(searchTerm));
};
