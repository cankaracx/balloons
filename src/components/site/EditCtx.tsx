"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { SiteData } from "@/lib/types";
import { saveSite } from "@/actions/site";

type Status = "idle" | "saving" | "saved" | "error";

type Ctx = {
  data: SiteData;
  editMode: boolean;
  canEdit: boolean;
  status: Status;
  dirty: boolean;
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
  const [dirty, setDirty] = useState(false);
  const revision = useRef(0);

  useEffect(() => {
    if (!dirty) return;
    const warnAboutUnsavedChanges = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warnAboutUnsavedChanges);
    return () => window.removeEventListener("beforeunload", warnAboutUnsavedChanges);
  }, [dirty]);

  const mut = (fn: (d: SiteData) => void) => {
    revision.current += 1;
    setDirty(true);
    setStatus("idle");
    setData((prev) => {
      const d = structuredClone(prev);
      fn(d);
      return d;
    });
  };

  const save = async () => {
    if (!dirty) return;
    const savingRevision = revision.current;
    setStatus("saving");
    try {
      await saveSite(data);
      const hasNewerChanges = revision.current !== savingRevision;
      setDirty(hasNewerChanges);
      setStatus(hasNewerChanges ? "idle" : "saved");
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
    <EditContext.Provider value={{ data, editMode, canEdit, status, dirty, setEditMode, mut, save, upload }}>
      <div className={editMode ? "edit" : undefined}>{children}</div>
    </EditContext.Provider>
  );
}
