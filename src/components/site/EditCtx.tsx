"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { SiteData } from "@/lib/types";
import { saveSite } from "@/actions/site";

type Status = "idle" | "saving" | "saved" | "error";

type Ctx = {
  data: SiteData;
  editMode: boolean;
  canEdit: boolean;
  dirty: boolean;
  status: Status;
  errorMessage: string | null;
  setEditMode: (v: boolean) => void;
  requestExit: () => void;
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!editMode || !dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [editMode, dirty]);

  const requestExit = useCallback(() => {
    if (dirty && !window.confirm("You have unsaved changes. Leave without saving?")) {
      return;
    }
    setEditMode(false);
  }, [dirty]);

  const mut = (fn: (d: SiteData) => void) => {
    setDirty(true);
    setStatus("idle");
    setErrorMessage(null);
    setData((prev) => {
      const d = structuredClone(prev);
      fn(d);
      return d;
    });
  };

  const save = async () => {
    setStatus("saving");
    setErrorMessage(null);
    try {
      await saveSite(data);
      setDirty(false);
      setStatus("saved");
      setTimeout(() => setStatus((s) => (s === "saved" ? "idle" : s)), 2000);
    } catch (e) {
      console.error(e);
      setStatus("error");
      setErrorMessage(e instanceof Error ? e.message : "Save failed");
    }
  };

  const upload = async (file: File, cb: (url: string) => void) => {
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (json.ok) {
        setErrorMessage(null);
        cb(json.url);
      } else {
        setErrorMessage(json.error || "Upload failed");
      }
    } catch {
      setErrorMessage("Upload failed");
    }
  };

  return (
    <EditContext.Provider
      value={{
        data,
        editMode,
        canEdit,
        dirty,
        status,
        errorMessage,
        setEditMode,
        requestExit,
        mut,
        save,
        upload,
      }}
    >
      <div className={editMode ? "edit" : undefined}>{children}</div>
    </EditContext.Provider>
  );
}
