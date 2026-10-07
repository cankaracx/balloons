import type { SiteData } from "@/lib/types";
import { teamBlueAllianceUrl } from "@/lib/team-links";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://balloons-zeta.vercel.app";

export default function JsonLd({ data }: { data: SiteData }) {
  const teamNo = data.brand.teamNumber?.trim();
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    name: data.brand.name,
    sport: "FIRST Robotics Competition",
    url: SITE_URL,
    email: data.contact.email,
    memberOf: {
      "@type": "EducationalOrganization",
      name: "TED Antalya Koleji",
    },
    location: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Antalya",
        addressCountry: "TR",
      },
    },
  };

  if (teamNo) {
    schema.alternateName = `FRC Team ${teamNo}`;
    schema.identifier = teamNo;
    const tba = teamBlueAllianceUrl(teamNo);
    if (tba) schema.sameAs = [tba];
  }

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}
