import { PartnerShell } from "@/components/partners/PartnerShell";
import { PartnerAccess } from "@/components/partners/PartnerAccess";
export default function Page({
  searchParams,
}: {
  searchParams: { cadastro?: string };
}) {
  return (
    <PartnerShell>
      <PartnerAccess signup={searchParams.cadastro === "1"} />
    </PartnerShell>
  );
}
