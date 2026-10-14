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
  isDirty: boolean;
  leavePrompt: boolean;
  setEditMode: (v: boolean) => void;
  requestLeaveEditMode: () => void;
  cancelLeavePrompt: () => void;
  discardChangesAndLeave: () => void;
  saveAndLeave: () => void;
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
  const [saved, setSaved] = useState<SiteData>(() => structuredClone(initial));
  const [data, setData] = useState<SiteData>(() => structuredClone(initial));
  const [editMode, setEditModeState] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [isDirty, setIsDirty] = useState(false);
  const [leavePrompt, setLeavePrompt] = useState(false);
  const dirty = useRef(false);

  useEffect(() => {
    if (editMode || dirty.current) return;
    setSaved(structuredClone(initial));
    setData(structuredClone(initial));
  }, [initial, editMode]);

  const mut = (fn: (d: SiteData) => void) => {
    dirty.current = true;
    setIsDirty(true);
    setStatus("idle");
    setData((prev) => {
      const d = structuredClone(prev);
      fn(d);
      return d;
    });
  };

  const discardChanges = () => {
    dirty.current = false;
    setIsDirty(false);
    setStatus("idle");
    setData(structuredClone(saved));
  };

  const save = async () => {
    setStatus("saving");
    try {
      const next = await saveSite(data);
      const snapshot = structuredClone(next);
      setSaved(snapshot);
      setData(snapshot);
      dirty.current = false;
      setIsDirty(false);
      setStatus("saved");
      setTimeout(() => setStatus((s) => (s === "saved" ? "idle" : s)), 2000);
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  };

  const setEditMode = (v: boolean) => {
    if (v) {
      setEditModeState(true);
      return;
    }
    if (!dirty.current) setEditModeState(false);
  };

  const requestLeaveEditMode = () => {
    if (!dirty.current) {
      setEditModeState(false);
      return;
    }
    setLeavePrompt(true);
  };

  const cancelLeavePrompt = () => setLeavePrompt(false);

  const discardChangesAndLeave = () => {
    discardChanges();
    setLeavePrompt(false);
    setEditModeState(false);
  };

  const saveAndLeave = async () => {
    setStatus("saving");
    try {
      const next = await saveSite(data);
      const snapshot = structuredClone(next);
      setSaved(snapshot);
      setData(snapshot);
      dirty.current = false;
      setIsDirty(false);
      setStatus("idle");
      setLeavePrompt(false);
      setEditModeState(false);
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  };

  useEffect(() => {
    if (!editMode || !isDirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!dirty.current) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [editMode, isDirty]);

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
    <EditContext.Provider
      value={{
        data,
        editMode,
        canEdit,
        status,
        isDirty,
        leavePrompt,
        setEditMode,
        requestLeaveEditMode,
        cancelLeavePrompt,
        discardChangesAndLeave,
        saveAndLeave,
        mut,
        save,
        upload,
      }}
    >
      <div className={editMode ? "edit" : undefined}>{children}</div>
    </EditContext.Provider>
  );
}
