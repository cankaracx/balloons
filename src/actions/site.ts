"use server";

import { revalidatePath } from "next/cache";
import { loadData, saveData } from "@/lib/store";
import { assertAdmin } from "@/lib/guard";
import type { Content, GalleryImage, Member, SiteData, Sponsor } from "@/lib/types";

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

async function commit(data: SiteData): Promise<SiteData> {
  await saveData(data);
  revalidatePath("/");
  return data;
}

// ── Content (all site copy + brand/logo) ──
export async function updateContent(content: Content): Promise<SiteData> {
  await assertAdmin();
  const data = await loadData();
  data.content = content;
  return commit(data);
}

// ── Generic reorder (move one item up/down within a sorted array) ──
function move<T extends { id: string; sort: number }>(items: T[], id: string, dir: "up" | "down"): T[] {
  const sorted = [...items].sort((a, b) => a.sort - b.sort);
  const i = sorted.findIndex((x) => x.id === id);
  if (i < 0) return items;
  const j = dir === "up" ? i - 1 : i + 1;
  if (j < 0 || j >= sorted.length) return items;
  [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
  return sorted.map((x, idx) => ({ ...x, sort: idx }));
}

// ── Members ──
export async function saveMember(member: Member): Promise<SiteData> {
  await assertAdmin();
  const data = await loadData();
  const existing = data.members.find((m) => m.id === member.id);
  if (existing) {
    data.members = data.members.map((m) => (m.id === member.id ? member : m));
  } else {
    member.id = newId();
    member.sort = data.members.length;
    data.members.push(member);
  }
  return commit(data);
}

export async function deleteMember(id: string): Promise<SiteData> {
  await assertAdmin();
  const data = await loadData();
  data.members = data.members.filter((m) => m.id !== id).map((m, i) => ({ ...m, sort: i }));
  return commit(data);
}

export async function moveMember(id: string, dir: "up" | "down"): Promise<SiteData> {
  await assertAdmin();
  const data = await loadData();
  data.members = move(data.members, id, dir);
  return commit(data);
}

// ── Sponsors ──
export async function saveSponsor(sponsor: Sponsor): Promise<SiteData> {
  await assertAdmin();
  const data = await loadData();
  const existing = data.sponsors.find((s) => s.id === sponsor.id);
  if (existing) {
    data.sponsors = data.sponsors.map((s) => (s.id === sponsor.id ? sponsor : s));
  } else {
    sponsor.id = newId();
    sponsor.sort = data.sponsors.length;
    data.sponsors.push(sponsor);
  }
  return commit(data);
}

export async function deleteSponsor(id: string): Promise<SiteData> {
  await assertAdmin();
  const data = await loadData();
  data.sponsors = data.sponsors.filter((s) => s.id !== id).map((s, i) => ({ ...s, sort: i }));
  return commit(data);
}

export async function moveSponsor(id: string, dir: "up" | "down"): Promise<SiteData> {
  await assertAdmin();
  const data = await loadData();
  data.sponsors = move(data.sponsors, id, dir);
  return commit(data);
}

// ── Gallery ──
export async function saveGalleryImage(img: GalleryImage): Promise<SiteData> {
  await assertAdmin();
  const data = await loadData();
  const existing = data.gallery.find((g) => g.id === img.id);
  if (existing) {
    data.gallery = data.gallery.map((g) => (g.id === img.id ? img : g));
  } else {
    img.id = newId();
    img.sort = data.gallery.length;
    data.gallery.push(img);
  }
  return commit(data);
}

export async function deleteGalleryImage(id: string): Promise<SiteData> {
  await assertAdmin();
  const data = await loadData();
  data.gallery = data.gallery.filter((g) => g.id !== id).map((g, i) => ({ ...g, sort: i }));
  return commit(data);
}

export async function moveGalleryImage(id: string, dir: "up" | "down"): Promise<SiteData> {
  await assertAdmin();
  const data = await loadData();
  data.gallery = move(data.gallery, id, dir);
  return commit(data);
}
