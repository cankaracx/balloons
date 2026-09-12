import "server-only";
import { promises as fs } from "fs";
import path from "path";
import seed from "../../content/seed.json";
import type { SiteData } from "./types";
import { getSupabase, SUPABASE_BUCKET } from "./supabase";
import { migrateSiteData, needsMigration } from "./i18n";

const SEED = seed as unknown as SiteData;

function normalizeData(raw: unknown): SiteData {
  const base = needsMigration(raw) ? migrateSiteData(raw, SEED) : (raw as SiteData);
  return structuredClone(base);
}

const DATA_DIR = path.join(process.cwd(), "content");
const DB_FILE = path.join(DATA_DIR, "db.json");
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

function usingSupabase() {
  return getSupabase() !== null;
}

export async function loadData(): Promise<SiteData> {
  try {
    const sb = getSupabase();
    if (sb) {
      const { data, error } = await sb.from("site").select("data").eq("id", 1).maybeSingle();
      if (error) throw error;
      if (!data) {
        // First run: seed the row.
        await sb.from("site").insert({ id: 1, data: SEED });
        return structuredClone(SEED);
      }
      return normalizeData(data.data);
    }

    // Local JSON mode
    try {
      const raw = await fs.readFile(DB_FILE, "utf8");
      return normalizeData(JSON.parse(raw));
    } catch {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(DB_FILE, JSON.stringify(SEED, null, 2), "utf8");
      return structuredClone(SEED);
    }
  } catch (err) {
    console.error("[store] loadData failed, serving seed defaults:", err);
    return structuredClone(SEED);
  }
}

export async function saveData(data: SiteData): Promise<void> {
  const sb = getSupabase();
  if (sb) {
    const { error } = await sb.from("site").upsert({ id: 1, data });
    if (error) throw new Error(error.message);
    return;
  }
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), "utf8");
}

export async function uploadImage(file: File): Promise<string> {
  const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const safeExt = ["png", "jpg", "jpeg", "webp", "gif", "svg"].includes(ext) ? ext : "png";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  const sb = getSupabase();
  if (sb) {
    const { error } = await sb.storage.from(SUPABASE_BUCKET).upload(filename, bytes, {
      contentType: file.type || `image/${safeExt}`,
      upsert: false,
    });
    if (error) throw new Error(error.message);
    const { data } = sb.storage.from(SUPABASE_BUCKET).getPublicUrl(filename);
    return data.publicUrl;
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, filename), bytes);
  return `/uploads/${filename}`;
}

export function isCloudConfigured() {
  return usingSupabase();
}
