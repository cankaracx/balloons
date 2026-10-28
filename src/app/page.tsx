import type { Metadata } from "next";
import { loadData } from "@/lib/store";
import { isAuthenticated } from "@/lib/guard";
import { pick } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/locale-server";
import Site from "@/components/site/Site";
import JsonLd from "@/components/site/JsonLd";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await loadData();
  const locale = getRequestLocale();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://balloons-zeta.vercel.app";
  const title =
    locale === "tr"
      ? `${data.brand.name} — Çaylak FRC Robotik Takımı · TED Antalya Koleji`
      : `${data.brand.name} — Rookie FRC Robotics Team · TED Antalya Koleji`;
  const description = pick(data.hero.sub, locale);
  const teamNo = data.brand.teamNumber?.trim();
  const descWithTeam = teamNo ? `${description} FRC Team ${teamNo}.` : description;

  return {
    title,
    description: descWithTeam,
    openGraph: {
      title:
        locale === "tr"
          ? `${data.brand.name} — Çaylak FRC Robotik Takımı`
          : `${data.brand.name} — Rookie FRC Robotics Team`,
      description: descWithTeam,
      type: "website",
      url: siteUrl,
      locale: locale === "tr" ? "tr_TR" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title:
        locale === "tr"
          ? `${data.brand.name} — Çaylak FRC Robotik Takımı`
          : `${data.brand.name} — Rookie FRC Robotics Team`,
      description: descWithTeam,
    },
    alternates: {
      canonical: siteUrl,
      languages: { en: siteUrl, tr: siteUrl },
    },
  };
}

export default async function HomePage() {
  const locale = getRequestLocale();
  const [data, canEdit] = await Promise.all([loadData(), isAuthenticated()]);
  return (
    <>
      <JsonLd data={data} />
      <Site data={data} canEdit={canEdit} initialLocale={locale} />
    </>
  );
}
