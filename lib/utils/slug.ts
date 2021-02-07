import { nanoid } from "nanoid";
import slugify from "slugify";

export function generateSlug(size: number = 6): string {
  return nanoid(size);
}

export function formatSlug(slug?: string): string {
  if (!slug) return slug;

  return slugify(slug, {
    lower: true,
    replacement: "-",
  });
}
