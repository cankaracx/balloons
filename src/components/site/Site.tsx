"use client";

import { useEffect, useState } from "react";
import { EditProvider, useEdit } from "./EditCtx";
import { EText, EImage, ItemControls, AddButton, rid, moveItem } from "./Editable";
import Pufferfish from "./Pufferfish";
import type { SiteData } from "@/lib/types";

export default function Site({ data, canEdit }: { data: SiteData; canEdit: boolean }) {
  return (
    <EditProvider initial={data} canEdit={canEdit}>
      <Page />
    </EditProvider>
  );
}

function Page() {
  const { data, mut, editMode, canEdit } = useEdit();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // scroll-reveal + nav shadow
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll(".rv:not(.in), .uline:not(.in)").forEach((el) => io.observe(el));
    const hdr = document.getElementById("hdr");
    const onScroll = () => hdr?.classList.toggle("scr", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [data, editMode]);

  const b = data;
  const logo = (size: number) => (
    <EImage url={b.brand.logoUrl} onChange={(url) => mut((d) => (d.brand.logoUrl = url))} fallback={<Pufferfish />} />
  );

  return (
    <>
      {/* NAV */}
      <header id="hdr">
        <div className="nav">
          <a href="#top" className="logo" onClick={() => setMenuOpen(false)}>
            <span style={{ width: 30, height: 30, display: "inline-block" }}>{logo(30)}</span>
            <EText value={b.brand.name} onChange={(v) => mut((d) => (d.brand.name = v))} />
          </a>
          <nav className="nav-mid">
            {b.nav.links.map((l, i) => (
              <EText key={l.id} as="a" href={l.href} value={l.label} onChange={(v) => mut((d) => (d.nav.links[i].label = v))} />
            ))}
          </nav>
          <div className="nav-end">
            <a href="#support" className="btn fill nav-cta" style={{ padding: "9px 16px" }}>
              <EText value={b.nav.cta} onChange={(v) => mut((d) => (d.nav.cta = v))} />
            </a>
            <button
              type="button"
              className="nav-toggle"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
        <nav id="mobile-nav" className={`nav-drawer${menuOpen ? " open" : ""}`} hidden={!menuOpen}>
          {b.nav.links.map((l, i) => (
            <EText
              key={l.id}
              as="a"
              href={l.href}
              value={l.label}
              onChange={(v) => mut((d) => (d.nav.links[i].label = v))}
              onClick={() => setMenuOpen(false)}
            />
          ))}
          <a href="#support" className="btn fill" onClick={() => setMenuOpen(false)}>
            <EText value={b.nav.cta} onChange={(v) => mut((d) => (d.nav.cta = v))} />
          </a>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero" id="top">
        <div className="wrap">
          <div className="hero-grid">
            <div>
              <EText className="mono rv" style={{ color: "var(--accent)" }} value={b.hero.eyebrow} onChange={(v) => mut((d) => (d.hero.eyebrow = v))} as="div" />
              <EText as="h1" className="rv" style={{ transitionDelay: ".05s" }} value={b.hero.title} onChange={(v) => mut((d) => (d.hero.title = v))} />
              <EText as="p" className="body sub rv" style={{ transitionDelay: ".12s" }} value={b.hero.sub} onChange={(v) => mut((d) => (d.hero.sub = v))} />
              <div className="cta rv" style={{ transitionDelay: ".2s" }}>
                <a href="#support" className="btn fill"><EText value={b.hero.ctaPrimary} onChange={(v) => mut((d) => (d.hero.ctaPrimary = v))} /> <span className="ar">→</span></a>
                <a href="#team" className="btn"><EText value={b.hero.ctaSecondary} onChange={(v) => mut((d) => (d.hero.ctaSecondary = v))} /></a>
              </div>
            </div>
            <div className="fish-wrap rv" style={{ transitionDelay: ".14s" }}>
              <span className="fish">{logo(400)}</span>
            </div>
          </div>
        </div>
        <div className="scrollk"><span className="mono">Scroll</span><span className="ln" /></div>
      </section>

      {/* MARQUEE */}
      <Marquee />

      {/* ABOUT */}
      <section className="sec" id="about">
        <div className="wrap">
          <SecHead idx={b.about.idx} label={b.about.label} onIdx={(v) => mut((d) => (d.about.idx = v))} onLabel={(v) => mut((d) => (d.about.label = v))} />
          <hr className="rule rv" />
          <div className="about-grid" style={{ marginTop: 48 }}>
            <h2 className="t rv">
              <EText as="span" className="uline" value={b.about.headingLead} onChange={(v) => mut((d) => (d.about.headingLead = v))} />
              <EText value={b.about.headingRest} onChange={(v) => mut((d) => (d.about.headingRest = v))} />
            </h2>
            <EText as="p" className="body rv" style={{ transitionDelay: ".1s" }} value={b.about.body} onChange={(v) => mut((d) => (d.about.body = v))} />
          </div>
          <div className="stats">
            {b.about.stats.map((s, i) => (
              <div className="stat rv editable-item" key={s.id} style={{ transitionDelay: `${i * 0.08}s` }}>
                <ItemControls onDelete={() => mut((d) => d.about.stats.splice(i, 1))} />
                <EText as="div" className="n" value={s.n} onChange={(v) => mut((d) => (d.about.stats[i].n = v))} />
                <EText as="div" className="d" value={s.d} onChange={(v) => mut((d) => (d.about.stats[i].d = v))} />
              </div>
            ))}
          </div>
          <AddButton label="Add stat" onClick={() => mut((d) => d.about.stats.push({ id: rid(), n: "0", d: "New stat" }))} />
        </div>
      </section>

      {/* SUPPORT */}
      <section className="sec dark" id="support">
        <div className="wrap">
          <SecHead idx={b.support.idx} label={b.support.label} onIdx={(v) => mut((d) => (d.support.idx = v))} onLabel={(v) => mut((d) => (d.support.label = v))} />
          <hr className="rule rv" />
          <Heading pre={b.support.headingPre} ul={b.support.headingUnderline} onPre={(v) => mut((d) => (d.support.headingPre = v))} onUl={(v) => mut((d) => (d.support.headingUnderline = v))} max="18ch" />
          <EText as="p" className="body rv" style={{ transitionDelay: ".1s", maxWidth: "58ch", marginTop: 22 }} value={b.support.body} onChange={(v) => mut((d) => (d.support.body = v))} />
          <div className="ben">
            {b.support.cells.map((c, i) => (
              <div className="cell rv editable-item" key={c.id} style={{ transitionDelay: `${i * 0.08}s` }}>
                <ItemControls onUp={() => mut((d) => moveItem(d.support.cells, i, -1))} onDown={() => mut((d) => moveItem(d.support.cells, i, 1))} onDelete={() => mut((d) => d.support.cells.splice(i, 1))} />
                <EText as="div" className="k" value={c.key} onChange={(v) => mut((d) => (d.support.cells[i].key = v))} />
                <EText as="h3" value={c.title} onChange={(v) => mut((d) => (d.support.cells[i].title = v))} />
                <EText as="p" value={c.body} onChange={(v) => mut((d) => (d.support.cells[i].body = v))} />
              </div>
            ))}
          </div>
          <AddButton label="Add benefit" onClick={() => mut((d) => d.support.cells.push({ id: rid(), key: "E", title: "New benefit", body: "Describe it." }))} />
          <div className="rv" style={{ marginTop: 46 }}>
            <a href="#contact" className="btn fill"><EText value={b.support.cta} onChange={(v) => mut((d) => (d.support.cta = v))} /> <span className="ar">→</span></a>
          </div>
        </div>
      </section>

      {/* SPONSORS */}
      <section className="sec" id="sponsors">
        <div className="wrap">
          <SecHead idx={b.sponsors.idx} label={b.sponsors.label} onIdx={(v) => mut((d) => (d.sponsors.idx = v))} onLabel={(v) => mut((d) => (d.sponsors.label = v))} />
          <hr className="rule rv" />
          <Heading pre={b.sponsors.headingPre} ul={b.sponsors.headingUnderline} onPre={(v) => mut((d) => (d.sponsors.headingPre = v))} onUl={(v) => mut((d) => (d.sponsors.headingUnderline = v))} max="20ch" />
          <EText as="p" className="body rv" style={{ transitionDelay: ".1s", maxWidth: "56ch", marginTop: 22 }} value={b.sponsors.body} onChange={(v) => mut((d) => (d.sponsors.body = v))} />
          <div className="wall">
            {b.sponsors.items.map((s, i) => (
              <div className="slot rv editable-item" key={s.id} style={{ transitionDelay: `${i * 0.05}s` }}>
                <ItemControls onUp={() => mut((d) => moveItem(d.sponsors.items, i, -1))} onDown={() => mut((d) => moveItem(d.sponsors.items, i, 1))} onDelete={() => mut((d) => d.sponsors.items.splice(i, 1))} />
                <EImage url={s.logoUrl} alt={s.name} onChange={(url) => mut((d) => (d.sponsors.items[i].logoUrl = url))} fallback={<EText value={s.name} onChange={(v) => mut((d) => (d.sponsors.items[i].name = v))} />} />
              </div>
            ))}
          </div>
          <AddButton label="Add sponsor slot" onClick={() => mut((d) => d.sponsors.items.push({ id: rid(), name: "Your logo here", logoUrl: null }))} />
        </div>
      </section>

      {/* TEAM */}
      <section className="sec" id="team" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <SecHead idx={b.team.idx} label={b.team.label} onIdx={(v) => mut((d) => (d.team.idx = v))} onLabel={(v) => mut((d) => (d.team.label = v))} />
          <hr className="rule rv" />
          <Heading pre={b.team.headingPre} ul={b.team.headingUnderline} onPre={(v) => mut((d) => (d.team.headingPre = v))} onUl={(v) => mut((d) => (d.team.headingUnderline = v))} />
          <div className="roster">
            {b.team.members.map((m, i) => (
              <div className="person rv editable-item" key={m.id} style={{ transitionDelay: `${(i % 3) * 0.08}s` }}>
                <ItemControls onUp={() => mut((d) => moveItem(d.team.members, i, -1))} onDown={() => mut((d) => moveItem(d.team.members, i, 1))} onDelete={() => mut((d) => d.team.members.splice(i, 1))} />
                <span className="mono-av">
                  <EImage url={m.photoUrl} alt={m.name} onChange={(url) => mut((d) => (d.team.members[i].photoUrl = url))} fallback={<EText value={m.initials} onChange={(v) => mut((d) => (d.team.members[i].initials = v))} />} />
                </span>
                <EText as="h3" value={m.name} onChange={(v) => mut((d) => (d.team.members[i].name = v))} />
                <EText as="div" className="role" value={m.role} onChange={(v) => mut((d) => (d.team.members[i].role = v))} />
                <EText as="p" value={m.body} onChange={(v) => mut((d) => (d.team.members[i].body = v))} />
              </div>
            ))}
          </div>
          <AddButton label="Add team member" onClick={() => mut((d) => d.team.members.push({ id: rid(), initials: "+", name: "New member", role: "Role", body: "Short bio.", photoUrl: null }))} />
        </div>
      </section>

      {/* WORKSHOP */}
      <section className="sec dark" id="work">
        <div className="wrap">
          <SecHead idx={b.work.idx} label={b.work.label} onIdx={(v) => mut((d) => (d.work.idx = v))} onLabel={(v) => mut((d) => (d.work.label = v))} />
          <hr className="rule rv" />
          <Heading pre={b.work.headingPre} ul={b.work.headingUnderline} onPre={(v) => mut((d) => (d.work.headingPre = v))} onUl={(v) => mut((d) => (d.work.headingUnderline = v))} />
          <div className="frames">
            {b.work.frames.map((f, i) => (
              <div className={`frame rv editable-item ${f.span}`} key={f.id} style={{ transitionDelay: `${(i % 4) * 0.08}s` }}>
                <ItemControls onUp={() => mut((d) => moveItem(d.work.frames, i, -1))} onDown={() => mut((d) => moveItem(d.work.frames, i, 1))} onDelete={() => mut((d) => d.work.frames.splice(i, 1))} />
                <EImage url={f.photoUrl} alt={f.caption} onChange={(url) => mut((d) => (d.work.frames[i].photoUrl = url))} />
                <span className="cap"><EText value={f.caption} onChange={(v) => mut((d) => (d.work.frames[i].caption = v))} /></span>
              </div>
            ))}
          </div>
          <AddButton label="Add photo frame" onClick={() => mut((d) => d.work.frames.push({ id: rid(), caption: "New", photoUrl: null, span: "" }))} />
        </div>
      </section>

      {/* OUTREACH */}
      <section className="sec" id="outreach">
        <div className="wrap">
          <SecHead idx={b.outreach.idx} label={b.outreach.label} onIdx={(v) => mut((d) => (d.outreach.idx = v))} onLabel={(v) => mut((d) => (d.outreach.label = v))} />
          <hr className="rule rv" />
          <Heading pre={b.outreach.headingPre} ul={b.outreach.headingUnderline} onPre={(v) => mut((d) => (d.outreach.headingPre = v))} onUl={(v) => mut((d) => (d.outreach.headingUnderline = v))} max="20ch" />
          <div className="olist">
            {b.outreach.rows.map((r, i) => (
              <div className="orow rv editable-item" key={r.id} style={{ transitionDelay: `${i * 0.08}s` }}>
                <ItemControls onUp={() => mut((d) => moveItem(d.outreach.rows, i, -1))} onDown={() => mut((d) => moveItem(d.outreach.rows, i, 1))} onDelete={() => mut((d) => d.outreach.rows.splice(i, 1))} />
                <EText as="div" className="oi" value={r.num} onChange={(v) => mut((d) => (d.outreach.rows[i].num = v))} />
                <div>
                  <EText as="h3" value={r.title} onChange={(v) => mut((d) => (d.outreach.rows[i].title = v))} />
                  <EText as="p" value={r.body} onChange={(v) => mut((d) => (d.outreach.rows[i].body = v))} />
                </div>
              </div>
            ))}
          </div>
          <AddButton label="Add outreach item" onClick={() => mut((d) => d.outreach.rows.push({ id: rid(), num: "00" + (d.outreach.rows.length + 1), title: "New", body: "Describe it." }))} />
        </div>
      </section>

      {/* CONTACT */}
      <section className="sec dark" id="contact">
        <div className="wrap">
          <SecHead idx={b.contact.idx} label={b.contact.label} onIdx={(v) => mut((d) => (d.contact.idx = v))} onLabel={(v) => mut((d) => (d.contact.label = v))} />
          <hr className="rule rv" />
          <div className="contact-grid" style={{ marginTop: 48 }}>
            <div>
              <Heading pre={b.contact.headingPre} ul={b.contact.headingUnderline} onPre={(v) => mut((d) => (d.contact.headingPre = v))} onUl={(v) => mut((d) => (d.contact.headingUnderline = v))} />
              <a href={`mailto:${b.contact.email}`} className="big-mail rv" style={{ transitionDelay: ".1s" }}>
                <EText value={b.contact.email} onChange={(v) => mut((d) => (d.contact.email = v))} />
              </a>
            </div>
            <div className="clist rv" style={{ transitionDelay: ".16s" }}>
              {b.contact.details.map((dl, i) => (
                <div className="cr editable-item" key={dl.id}>
                  <ItemControls onDelete={() => mut((d) => d.contact.details.splice(i, 1))} />
                  <EText value={dl.k} onChange={(v) => mut((d) => (d.contact.details[i].k = v))} />
                  <EText className="v" value={dl.v} onChange={(v) => mut((d) => (d.contact.details[i].v = v))} />
                </div>
              ))}
              <AddButton label="Add detail" onClick={() => mut((d) => d.contact.details.push({ id: rid(), k: "Label", v: "Value" }))} />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="wrap">
          <div className="foot">
            <div>
              <div className="logo" style={{ color: "var(--bone)" }}>
                <span style={{ width: 28, height: 28, display: "inline-block" }}>{logo(28)}</span>
                <EText value={b.brand.name} onChange={(v) => mut((d) => (d.brand.name = v))} />
              </div>
              <EText as="p" value={b.footer.blurb} onChange={(v) => mut((d) => (d.footer.blurb = v))} />
            </div>
            <nav className="foot-nav">
              {b.nav.links.map((l, i) => (
                <EText key={l.id} as="a" href={l.href} value={l.label} onChange={(v) => mut((d) => (d.nav.links[i].label = v))} />
              ))}
            </nav>
          </div>
          <div className="foot-bot"><span>© 2026 {b.brand.name}</span><span>TED Antalya Koleji · Antalya</span></div>
        </div>
      </footer>

      {canEdit && <EditBar />}
    </>
  );
}

function SecHead({ idx, label, onIdx, onLabel }: { idx: string; label: string; onIdx: (v: string) => void; onLabel: (v: string) => void }) {
  return (
    <div className="sec-head rv">
      <EText className="idx" value={idx} onChange={onIdx} />
      <EText className="lbl" value={label} onChange={onLabel} />
    </div>
  );
}

function Heading({ pre, ul, onPre, onUl, max }: { pre: string; ul: string; onPre: (v: string) => void; onUl: (v: string) => void; max?: string }) {
  return (
    <h2 className="t rv" style={{ marginTop: 48, maxWidth: max }}>
      <EText value={pre} onChange={onPre} />
      <EText as="span" className="uline" value={ul} onChange={onUl} />
    </h2>
  );
}

function Marquee() {
  const { data, mut, editMode } = useEdit();
  const items = data.marquee.items;
  if (editMode) {
    return (
      <div className="marq" style={{ display: "block", whiteSpace: "normal" }}>
        <div className="wrap" style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
          {items.map((it, i) => (
            <span key={i} className="editable-item" style={{ position: "relative", fontFamily: "var(--mono)", fontSize: 13, letterSpacing: ".12em", textTransform: "uppercase" }}>
              <ItemControls onDelete={() => mut((d) => d.marquee.items.splice(i, 1))} />
              <EText value={it} onChange={(v) => mut((d) => (d.marquee.items[i] = v))} />
            </span>
          ))}
          <AddButton label="Add ticker word" onClick={() => mut((d) => d.marquee.items.push("New"))} />
        </div>
      </div>
    );
  }
  const strip = (
    <div className="marq-in">
      {items.map((it, i) => (
        <span key={i}>{it}<b style={{ marginLeft: 22 }}>·</b></span>
      ))}
    </div>
  );
  return (
    <div className="marq" aria-hidden="true">
      {strip}
      {strip}
    </div>
  );
}

function EditBar() {
  const { editMode, setEditMode, requestExit, save, status, dirty, errorMessage } = useEdit();

  async function signOut() {
    if (dirty && !window.confirm("You have unsaved changes. Sign out anyway?")) return;
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.reload();
  }

  const statusLabel =
    errorMessage
      ? errorMessage
      : status === "saving"
        ? "Saving…"
        : status === "saved"
          ? "Saved ✓"
          : status === "error"
            ? "Save failed"
            : dirty
              ? "Unsaved changes"
              : "Editing";

  return (
    <div className="editbar">
      {!editMode ? (
        <>
          <button className="save" onClick={() => setEditMode(true)}>Edit page</button>
          <button className="ghost" onClick={signOut}>Sign out</button>
        </>
      ) : (
        <>
          <span className={`status${errorMessage || status === "error" ? " err" : ""}`}>{statusLabel}</span>
          <button className="save" onClick={save} disabled={status === "saving" || !dirty}>Save</button>
          <button className="ghost" onClick={requestExit}>Done</button>
          <button className="ghost" onClick={signOut}>Sign out</button>
        </>
      )}
    </div>
  );
}
