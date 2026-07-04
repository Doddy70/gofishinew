/**
 * Generate URL-friendly slug from text
 * @param text - Input text (e.g., "KM Pesona Laut Ancol")
 * @returns URL-safe slug (e.g., "km-pesona-laut-ancol")
 */
export function generateSlug(text: string): string {
  if (!text) return "";

  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
    .substring(0, 100); // Limit length
}

/**
 * Generate unique slug by appending short ID suffix
 * @param text - Base text for slug
 * @param idSuffix - Short ID suffix (e.g., last 8 chars of CUID)
 * @returns Unique slug like "km-pesona-laut-ancol-cmr5o9al"
 */
export function generateUniqueSlug(text: string, idSuffix: string): string {
  const baseSlug = generateSlug(text);
  const shortSuffix = idSuffix.slice(-8);
  return `${baseSlug}-${shortSuffix}`;
}
