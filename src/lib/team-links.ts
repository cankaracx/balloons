/** Public FRC team profile on The Blue Alliance (canonical for team numbers). */
export function teamBlueAllianceUrl(teamNumber: string | null | undefined): string | null {
  if (!teamNumber?.trim()) return null;
  const digits = teamNumber.replace(/\D/g, "");
  if (!digits) return null;
  return `https://www.thebluealliance.com/team/${digits}`;
}
