"use client";

import { LangProvider } from "./LangProvider";
import Nav from "./Nav";
import Hero from "./Hero";
import About from "./About";
import Sponsors from "./Sponsors";
import Team from "./Team";
import Gallery from "./Gallery";
import Outreach from "./Outreach";
import Contact from "./Contact";
import Footer from "./Footer";
import type { Locale, SiteData } from "@/lib/types";

export default function Site({ data, initialLang }: { data: SiteData; initialLang: Locale }) {
  const { content, members, sponsors, gallery } = data;

  return (
    <LangProvider initial={initialLang}>
      <Nav brand={content.brand} />
      <main>
        <Hero hero={content.hero} brand={content.brand} />
        <About about={content.about} />
        <Sponsors sponsors={content.sponsors} list={sponsors} />
        <Team team={content.team} list={members} />
        <Gallery gallery={content.gallery} list={gallery} />
        <Outreach outreach={content.outreach} />
        <Contact contact={content.contact} />
      </main>
      <Footer brand={content.brand} />
    </LangProvider>
  );
}
