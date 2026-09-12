"use client";

import { useMemo, useState } from "react";
import { EditProvider, useEdit } from "./EditCtx";
import { LocaleProvider } from "./LocaleCtx";
import { EText, EPlain, EImage, ItemControls, AddButton, rid, moveItem } from "./Editable";
import LangSwitch from "./LangSwitch";
import MobileNav from "./MobileNav";
import { loc, pick } from "@/lib/i18n";
import { useLocale } from "./LocaleCtx";
import type { Localized, SiteData } from "@/lib/types";

export default function Site({ data, canEdit }: { data: SiteData; canEdit: boolean }) {
  return (
    <LocaleProvider>
      <EditProvider initial={data} canEdit={canEdit}>
        <Page />
      </EditProvider>
    </LocaleProvider>
  );
}

function Page() {
  const { data, mut, editMode, canEdit } = useEdit();
  const { locale } = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);

  const sectionIdx = useMemo(
    () => ({
      "#about": data.about.idx,
      "#support": data.support.idx,
      "#sponsors": data.sponsors.idx,
      "#team": data.team.idx,
      "#work": data.work.idx,
      "#outreach": data.outreach.idx,
      "#contact": data.contact.idx,
    }),
    [data],
  );

  const b = data;
  const visibleSponsors = editMode ? b.sponsors.items : b.sponsors.items.filter((s) => s.logoUrl);
  const visibleFrames = editMode ? b.work.frames : b.work.frames.filter((f) => f.photoUrl);

  return (
    <>
      <header id="hdr">
        <div className="nav">
          <a href="#top" className="logo">
            {(editMode || b.brand.logoUrl) && (
              <span className="brand-img">
                <EImage
                  url={b.brand.logoUrl}
                  onChange={(url) => mut((d) => (d.brand.logoUrl = url))}
                  fallback={editMode ? <span className="add-logo">Add</span> : null}
                />
              </span>
            )}
            <EPlain value={b.brand.name} onChange={(v) => mut((d) => (d.brand.name = v))} />
          </a>
          <nav className="nav-mid" aria-label="Sections">
            {b.nav.links.map((l, i) => (
              <EText key={l.id} as="a" href={l.href} value={l.label} onChange={(v) => mut((d) => (d.nav.links[i].label = v))} />
            ))}
          </nav>
          <LangSwitch />
          <MobileNav
            links={b.nav.links}
            cta={b.nav.cta}
            sectionIdx={sectionIdx}
            open={menuOpen}
            onOpenChange={setMenuOpen}
            onCtaChange={(v) => mut((d) => (d.nav.cta = v))}
            onLinkChange={(i, v) => mut((d) => (d.nav.links[i].label = v))}
          />
          <a href="#support" className="nav-cta" style={{ fontSize: 14, color: "var(--link)", textDecoration: "underline", textUnderlineOffset: 3 }}>
            <EText value={b.nav.cta} onChange={(v) => mut((d) => (d.nav.cta = v))} />
          </a>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="wrap">
          <EText className="kicker" value={b.hero.eyebrow} onChange={(v) => mut((d) => (d.hero.eyebrow = v))} as="div" />
          <EPlain as="h1" value={b.hero.title} onChange={(v) => mut((d) => (d.hero.title = v))} />
          <EText as="p" className="body sub" value={b.hero.sub} onChange={(v) => mut((d) => (d.hero.sub = v))} />
          <div className="cta">
            <a href="#support">
              <EText value={b.hero.ctaPrimary} onChange={(v) => mut((d) => (d.hero.ctaPrimary = v))} />
            </a>
            <a href="#team">
              <EText value={b.hero.ctaSecondary} onChange={(v) => mut((d) => (d.hero.ctaSecondary = v))} />
            </a>
          </div>
          <SeasonNotes />
        </div>
      </section>

      <section className="sec" id="about">
        <div className="wrap">
          <SecHead idx={b.about.idx} label={b.about.label} onIdx={(v) => mut((d) => (d.about.idx = v))} onLabel={(v) => mut((d) => (d.about.label = v))} />
          <h2 className="t">
            <EText value={b.about.headingLead} onChange={(v) => mut((d) => (d.about.headingLead = v))} />{" "}
            <EText value={b.about.headingRest} onChange={(v) => mut((d) => (d.about.headingRest = v))} />
          </h2>
          <EText as="p" className="body" style={{ marginTop: 12, maxWidth: "40em" }} value={b.about.body} onChange={(v) => mut((d) => (d.about.body = v))} />
          <div className="stats">
            {b.about.stats.map((s, i) => (
              <div className="stat editable-item" key={s.id}>
                <ItemControls onDelete={() => mut((d) => d.about.stats.splice(i, 1))} />
                <EPlain as="span" className="n" value={s.n} onChange={(v) => mut((d) => (d.about.stats[i].n = v))} />
                <EText as="span" className="d" value={s.d} onChange={(v) => mut((d) => (d.about.stats[i].d = v))} />
              </div>
            ))}
          </div>
          <AddButton label="Add stat" onClick={() => mut((d) => d.about.stats.push({ id: rid(), n: "0", d: loc("New stat", "Yeni istatistik") }))} />
        </div>
      </section>

      <section className="sec" id="support">
        <div className="wrap">
          <SecHead idx={b.support.idx} label={b.support.label} onIdx={(v) => mut((d) => (d.support.idx = v))} onLabel={(v) => mut((d) => (d.support.label = v))} />
          <Heading pre={b.support.headingPre} ul={b.support.headingUnderline} onPre={(v) => mut((d) => (d.support.headingPre = v))} onUl={(v) => mut((d) => (d.support.headingUnderline = v))} />
          <EText as="p" className="body" style={{ maxWidth: "40em", marginTop: 12 }} value={b.support.body} onChange={(v) => mut((d) => (d.support.body = v))} />
          <div className="rows">
            {b.support.cells.map((c, i) => (
              <div className="row editable-item" key={c.id}>
                <ItemControls onUp={() => mut((d) => moveItem(d.support.cells, i, -1))} onDown={() => mut((d) => moveItem(d.support.cells, i, 1))} onDelete={() => mut((d) => d.support.cells.splice(i, 1))} />
                <EPlain as="div" className="k" value={c.key} onChange={(v) => mut((d) => (d.support.cells[i].key = v))} />
                <EText as="h3" value={c.title} onChange={(v) => mut((d) => (d.support.cells[i].title = v))} />
                <EText as="p" value={c.body} onChange={(v) => mut((d) => (d.support.cells[i].body = v))} />
              </div>
            ))}
          </div>
          <AddButton label="Add benefit" onClick={() => mut((d) => d.support.cells.push({ id: rid(), key: "E", title: loc("New benefit", "Yeni avantaj"), body: loc("Describe it.", "Açıklayın.") }))} />
          <p style={{ marginTop: 20 }}>
            <a href="#contact" style={{ color: "var(--link)", textDecoration: "underline", textUnderlineOffset: 3 }}>
              <EText value={b.support.cta} onChange={(v) => mut((d) => (d.support.cta = v))} />
            </a>
          </p>
        </div>
      </section>

      <section className="sec" id="sponsors">
        <div className="wrap">
          <SecHead idx={b.sponsors.idx} label={b.sponsors.label} onIdx={(v) => mut((d) => (d.sponsors.idx = v))} onLabel={(v) => mut((d) => (d.sponsors.label = v))} />
          <Heading pre={b.sponsors.headingPre} ul={b.sponsors.headingUnderline} onPre={(v) => mut((d) => (d.sponsors.headingPre = v))} onUl={(v) => mut((d) => (d.sponsors.headingUnderline = v))} />
          <EText as="p" className="body" style={{ maxWidth: "40em", marginTop: 12 }} value={b.sponsors.body} onChange={(v) => mut((d) => (d.sponsors.body = v))} />
          {visibleSponsors.length > 0 && (
            <div className="wall">
              {visibleSponsors.map((s) => {
                const i = b.sponsors.items.indexOf(s);
                return (
                  <div className="slot editable-item" key={s.id}>
                    <ItemControls onUp={() => mut((d) => moveItem(d.sponsors.items, i, -1))} onDown={() => mut((d) => moveItem(d.sponsors.items, i, 1))} onDelete={() => mut((d) => d.sponsors.items.splice(i, 1))} />
                    <EImage url={s.logoUrl} alt={s.name} onChange={(url) => mut((d) => (d.sponsors.items[i].logoUrl = url))} fallback={<EText value={s.name} onChange={(v) => mut((d) => (d.sponsors.items[i].name = v))} />} />
                  </div>
                );
              })}
            </div>
          )}
          <AddButton label="Add sponsor" onClick={() => mut((d) => d.sponsors.items.push({ id: rid(), name: loc("Sponsor", "Sponsor"), logoUrl: null }))} />
        </div>
      </section>

      <section className="sec" id="team">
        <div className="wrap">
          <SecHead idx={b.team.idx} label={b.team.label} onIdx={(v) => mut((d) => (d.team.idx = v))} onLabel={(v) => mut((d) => (d.team.label = v))} />
          <Heading pre={b.team.headingPre} ul={b.team.headingUnderline} onPre={(v) => mut((d) => (d.team.headingPre = v))} onUl={(v) => mut((d) => (d.team.headingUnderline = v))} />
          <div className="roster">
            {b.team.members.map((m, i) => (
              <div className="person editable-item" key={m.id}>
                <ItemControls onUp={() => mut((d) => moveItem(d.team.members, i, -1))} onDown={() => mut((d) => moveItem(d.team.members, i, 1))} onDelete={() => mut((d) => d.team.members.splice(i, 1))} />
                {(editMode || m.photoUrl) && (
                  <div className="person-photo">
                    <EImage
                      url={m.photoUrl}
                      alt={m.name}
                      onChange={(url) => mut((d) => (d.team.members[i].photoUrl = url))}
                      fallback={<span className="mono-av"><EPlain value={m.initials} onChange={(v) => mut((d) => (d.team.members[i].initials = v))} /></span>}
                    />
                  </div>
                )}
                <div>
                  <EText as="h3" value={m.name} onChange={(v) => mut((d) => (d.team.members[i].name = v))} />
                  <EText as="div" className="role" value={m.role} onChange={(v) => mut((d) => (d.team.members[i].role = v))} />
                  <EText as="p" value={m.body} onChange={(v) => mut((d) => (d.team.members[i].body = v))} />
                </div>
              </div>
            ))}
          </div>
          <AddButton label="Add team member" onClick={() => mut((d) => d.team.members.push({ id: rid(), initials: "", name: loc("New member", "Yeni üye"), role: loc("Role", "Rol"), body: loc("Short bio.", "Kısa biyografi."), photoUrl: null }))} />
        </div>
      </section>

      <section className="sec" id="work">
        <div className="wrap">
          <SecHead idx={b.work.idx} label={b.work.label} onIdx={(v) => mut((d) => (d.work.idx = v))} onLabel={(v) => mut((d) => (d.work.label = v))} />
          <Heading pre={b.work.headingPre} ul={b.work.headingUnderline} onPre={(v) => mut((d) => (d.work.headingPre = v))} onUl={(v) => mut((d) => (d.work.headingUnderline = v))} />
          {visibleFrames.length > 0 ? (
            <div className="frames">
              {visibleFrames.map((f) => {
                const i = b.work.frames.indexOf(f);
                return (
                  <div className="frame editable-item" key={f.id}>
                    <ItemControls onUp={() => mut((d) => moveItem(d.work.frames, i, -1))} onDown={() => mut((d) => moveItem(d.work.frames, i, 1))} onDelete={() => mut((d) => d.work.frames.splice(i, 1))} />
                    <EImage url={f.photoUrl} alt={f.caption} onChange={(url) => mut((d) => (d.work.frames[i].photoUrl = url))} />
                    <span className="cap">
                      <EText value={f.caption} onChange={(v) => mut((d) => (d.work.frames[i].caption = v))} />
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="body" style={{ marginTop: 12 }}>
              {locale === "tr"
                ? "Atölye fotoğrafları çekilmeye başlayınca burada olacak."
                : "Photos will go here once we start shooting the shop."}
            </p>
          )}
          <AddButton label="Add photo" onClick={() => mut((d) => d.work.frames.push({ id: rid(), caption: loc("New", "Yeni"), photoUrl: null, span: "" }))} />
        </div>
      </section>

      <section className="sec" id="outreach">
        <div className="wrap">
          <SecHead idx={b.outreach.idx} label={b.outreach.label} onIdx={(v) => mut((d) => (d.outreach.idx = v))} onLabel={(v) => mut((d) => (d.outreach.label = v))} />
          <Heading pre={b.outreach.headingPre} ul={b.outreach.headingUnderline} onPre={(v) => mut((d) => (d.outreach.headingPre = v))} onUl={(v) => mut((d) => (d.outreach.headingUnderline = v))} />
          <div className="olist">
            {b.outreach.rows.map((r, i) => (
              <div className="orow editable-item" key={r.id}>
                <ItemControls onUp={() => mut((d) => moveItem(d.outreach.rows, i, -1))} onDown={() => mut((d) => moveItem(d.outreach.rows, i, 1))} onDelete={() => mut((d) => d.outreach.rows.splice(i, 1))} />
                <EPlain as="div" className="oi" value={r.num} onChange={(v) => mut((d) => (d.outreach.rows[i].num = v))} />
                <EText as="h3" value={r.title} onChange={(v) => mut((d) => (d.outreach.rows[i].title = v))} />
                <EText as="p" value={r.body} onChange={(v) => mut((d) => (d.outreach.rows[i].body = v))} />
              </div>
            ))}
          </div>
          <AddButton label="Add outreach item" onClick={() => mut((d) => d.outreach.rows.push({ id: rid(), num: String(d.outreach.rows.length + 1).padStart(2, "0"), title: loc("New", "Yeni"), body: loc("Describe it.", "Açıklayın.") }))} />
        </div>
      </section>

      <section className="sec" id="contact">
        <div className="wrap">
          <SecHead idx={b.contact.idx} label={b.contact.label} onIdx={(v) => mut((d) => (d.contact.idx = v))} onLabel={(v) => mut((d) => (d.contact.label = v))} />
          <Heading pre={b.contact.headingPre} ul={b.contact.headingUnderline} onPre={(v) => mut((d) => (d.contact.headingPre = v))} onUl={(v) => mut((d) => (d.contact.headingUnderline = v))} />
          <a href={`mailto:${b.contact.email}`} className="big-mail">
            <EPlain value={b.contact.email} onChange={(v) => mut((d) => (d.contact.email = v))} />
          </a>
          <div className="clist">
            {b.contact.details.map((dl, i) => (
              <div className="cr editable-item" key={dl.id}>
                <ItemControls onDelete={() => mut((d) => d.contact.details.splice(i, 1))} />
                <EText value={dl.k} onChange={(v) => mut((d) => (d.contact.details[i].k = v))} />
                <EText className="v" value={dl.v} onChange={(v) => mut((d) => (d.contact.details[i].v = v))} />
              </div>
            ))}
            <AddButton label="Add detail" onClick={() => mut((d) => d.contact.details.push({ id: rid(), k: loc("Label", "Etiket"), v: loc("Value", "Değer") }))} />
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div className="foot">
            <div>
              <div className="logo">
                <EPlain value={b.brand.name} onChange={(v) => mut((d) => (d.brand.name = v))} />
              </div>
              <EText as="p" value={b.footer.blurb} onChange={(v) => mut((d) => (d.footer.blurb = v))} />
            </div>
            <nav className="foot-nav">
              {b.nav.links.map((l, i) => (
                <EText key={l.id} as="a" href={l.href} value={l.label} onChange={(v) => mut((d) => (d.nav.links[i].label = v))} />
              ))}
            </nav>
          </div>
          <div className="foot-bot">
            <span>© 2026 {b.brand.name}</span>
            <span>TED Antalya Koleji, Antalya</span>
          </div>
        </div>
      </footer>

      {canEdit && <EditBar />}
    </>
  );
}

function SecHead({ idx, label, onIdx, onLabel }: { idx: string; label: Localized; onIdx: (v: string) => void; onLabel: (v: Localized) => void }) {
  return (
    <div className="sec-kicker">
      <EPlain className="sec-idx" value={idx} onChange={onIdx} />
      <EText className="sec-label" value={label} onChange={onLabel} />
    </div>
  );
}

function Heading({ pre, ul, onPre, onUl }: { pre: Localized; ul: Localized; onPre: (v: Localized) => void; onUl: (v: Localized) => void }) {
  return (
    <h2 className="t">
      <EText value={pre} onChange={onPre} />{" "}
      <EText value={ul} onChange={onUl} />
    </h2>
  );
}

function SeasonNotes() {
  const { data, mut, editMode } = useEdit();
  const { locale } = useLocale();
  const items = data.marquee.items;
  if (editMode) {
    return (
      <div className="notes">
        {items.map((it, i) => (
          <span key={i} className="editable-item" style={{ position: "relative", marginRight: 12 }}>
            <ItemControls onDelete={() => mut((d) => d.marquee.items.splice(i, 1))} />
            <EText value={it} onChange={(v) => mut((d) => (d.marquee.items[i] = v))} />
          </span>
        ))}
        <AddButton label="Add note" onClick={() => mut((d) => d.marquee.items.push(loc("New", "Yeni")))} />
      </div>
    );
  }
  if (!items.length) return null;
  return <p className="notes">{items.map((it) => pick(it, locale)).join(" · ")}</p>;
}

function EditBar() {
  const { editMode, setEditMode, save, status } = useEdit();
  return (
    <div className="editbar">
      {!editMode ? (
        <button className="save" onClick={() => setEditMode(true)}>
          Edit page
        </button>
      ) : (
        <>
          <span className="status">{status === "saving" ? "Saving…" : status === "saved" ? "Saved" : status === "error" ? "Error" : "Editing"}</span>
          <button className="save" onClick={save} disabled={status === "saving"}>
            Save
          </button>
          <button className="ghost" onClick={() => setEditMode(false)}>
            Done
          </button>
        </>
      )}
    </div>
  );
}
