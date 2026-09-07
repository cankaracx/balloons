import seed from "../../content/seed.json";
import type { SiteData } from "./types";

const MAX_DOCUMENT_BYTES = 750_000;
const MAX_STRING_LENGTH = 20_000;
const MAX_ARRAY_ITEMS = 250;
const MAX_DEPTH = 12;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function matchesShape(value: unknown, template: unknown, path: string, depth: number): void {
  if (depth > MAX_DEPTH) throw new Error("Site content is nested too deeply");

  if (template === null) {
    if (value !== null && typeof value !== "string") {
      throw new Error(`${path} must be a URL or empty`);
    }
    return;
  }

  if (typeof template === "string") {
    if (typeof value !== "string") throw new Error(`${path} must be text`);
    if (value.length > MAX_STRING_LENGTH) throw new Error(`${path} is too long`);
    return;
  }

  if (Array.isArray(template)) {
    if (!Array.isArray(value)) throw new Error(`${path} must be a list`);
    if (value.length > MAX_ARRAY_ITEMS) throw new Error(`${path} has too many items`);
    if (template.length > 0) {
      value.forEach((item, index) =>
        matchesShape(item, template[0], `${path}[${index}]`, depth + 1),
      );
    }
    return;
  }

  if (!isRecord(template) || !isRecord(value)) {
    throw new Error(`${path} has an invalid value`);
  }

  const allowedKeys = new Set(Object.keys(template));
  for (const key of Object.keys(value)) {
    if (!allowedKeys.has(key)) throw new Error(`${path}.${key} is not supported`);
  }
  for (const [key, childTemplate] of Object.entries(template)) {
    if (!(key in value)) throw new Error(`${path}.${key} is required`);
    matchesShape(value[key], childTemplate, `${path}.${key}`, depth + 1);
  }
}

export function assertValidSiteData(value: unknown): asserts value is SiteData {
  let serialized: string;
  try {
    serialized = JSON.stringify(value);
  } catch {
    throw new Error("Site content must be valid JSON");
  }

  if (new TextEncoder().encode(serialized).byteLength > MAX_DOCUMENT_BYTES) {
    throw new Error("Site content is too large");
  }

  matchesShape(value, seed, "site", 0);
}
