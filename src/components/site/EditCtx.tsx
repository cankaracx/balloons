"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import type { SiteData } from "@/lib/types";
import { saveSite } from "@/actions/site";

type Status = "idle" | "saving" | "saved" | "error";

type Ctx = {
  data: SiteData;
  editMode: boolean;
  canEdit: boolean;
  status: Status;
  setEditMode: (v: boolean) => void;
  mut: (fn: (draft: SiteData) => void) => void;
  save: () => void;
  upload: (file: File, cb: (url: string) => void) => void;
};

const EditContext = createContext<Ctx | null>(null);
export const useEdit = () => {
  const c = useContext(EditContext);
  if (!c) throw new Error("useEdit outside provider");
  return c;
};

export function EditProvider({
  initial,
  canEdit,
  children,
}: {
  initial: SiteData;
  canEdit: boolean;
  children: ReactNode;
}) {
  const [data, setData] = useState<SiteData>(initial);
  const [editMode, setEditMode] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const dirty = useRef(false);

  const mut = (fn: (d: SiteData) => void) => {
    dirty.current = true;
    setStatus("idle");
    setData((prev) => {
      const d = structuredClone(prev);
      fn(d);
      return d;
    });
  };

  const save = async () => {
    setStatus("saving");
    try {
      await saveSite(data);
      dirty.current = false;
      setStatus("saved");
      setTimeout(() => setStatus((s) => (s === "saved" ? "idle" : s)), 2000);
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  };

  const upload = async (file: File, cb: (url: string) => void) => {
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (json.ok) cb(json.url);
      else alert(json.error || "Upload failed");
    } catch {
      alert("Upload failed");
    }
  };

  return (
    <EditContext.Provider value={{ data, editMode, canEdit, status, setEditMode, mut, save, upload }}>
      <div className={editMode ? "edit" : undefined}>{children}</div>
    </EditContext.Provider>
  );
}
