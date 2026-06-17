"use client";

import { LangProvider } from "./LangProvider";
import Nav from "./Nav";
import Hero from "./Hero";
import About from "./About";
import SponsorWall from "./SponsorWall";
import Team from "./Team";
import Gallery from "./Gallery";
import Outreach from "./Outreach";
import Partner from "./Partner";
import Contact from "./Contact";
import Footer from "./Footer";
import ScrollLine from "./ScrollLine";
import type { Locale, SiteData } from "@/lib/types";

export default function Site({ data, initialLang }: { data: SiteData; initialLang: Locale }) {
  const { content, members, sponsors, gallery } = data;

  return (
    <LangProvider initial={initialLang}>
      <Nav brand={content.brand} />
      <main className="relative">
        <ScrollLine />
        <Hero hero={content.hero} brand={content.brand} />
        <About about={content.about} />
        <SponsorWall sponsors={content.sponsors} list={sponsors} />
        <Team team={content.team} list={members} />
        <Gallery gallery={content.gallery} list={gallery} />
        <Outreach outreach={content.outreach} />
        <Partner sponsors={content.sponsors} />
        <Contact contact={content.contact} />
      </main>
      <Footer brand={content.brand} />
    </LangProvider>
  );
}
