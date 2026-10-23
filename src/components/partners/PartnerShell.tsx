import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import "./partners.css";
export function PartnerShell({
  children,
  wide = false,
}: {
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="partner-app min-h-screen">
      <header className="partner-header">
        <Link href="/parceiros" aria-label="Feito de Nós para lojas">
          <BrandLogo size="md" />
        </Link>
        <nav aria-label="Parceiros">
          <Link href="/parceiros">Como funciona</Link>
          <Link href="/parceiros/painel" className="partner-link">
            Minha loja ↗
          </Link>
        </nav>
      </header>
      <main className={wide ? "partner-main partner-wide" : "partner-main"}>
        {children}
      </main>
      <footer className="partner-footer">
        Feito de Nós · Histórias que viram presente{" "}
        <span>
          <Link href="/privacidade">Privacidade</Link> ·{" "}
          <Link href="/termos">Termos</Link> ·{" "}
          <Link href="/parceiros/condicoes">Condições do piloto</Link>
        </span>
      </footer>
    </div>
  );
}
