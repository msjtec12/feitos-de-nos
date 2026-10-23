import { PartnerShell } from "@/components/partners/PartnerShell";
import { PartnerDashboard } from "@/components/partners/PartnerDashboard";
export const dynamic = "force-dynamic";
export default function Page() {
  return (
    <PartnerShell wide>
      <PartnerDashboard />
    </PartnerShell>
  );
}
