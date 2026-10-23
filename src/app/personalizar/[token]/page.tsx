import { PartnerShell } from "@/components/partners/PartnerShell";
import { CustomerEditor } from "@/components/partners/CustomerEditor";
export const metadata = {
  title: "Personalize seu pedido | Feito de Nós",
  robots: { index: false, follow: false },
  referrer: "no-referrer" as const,
};
export default function Page({ params }: { params: { token: string } }) {
  return (
    <PartnerShell>
      <CustomerEditor token={params.token} />
    </PartnerShell>
  );
}
