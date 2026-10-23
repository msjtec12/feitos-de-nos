import Image from "next/image";
import { Heart, MapPin, CalendarDays } from "lucide-react";
import { PartnerContent, Product, THEMES } from "@/lib/partners/model";
export function Experience({
  content: c,
  product,
  urls = {},
  storeName,
  preview = false,
}: {
  content: PartnerContent;
  product: Product;
  urls?: Record<string, string>;
  storeName: string;
  preview?: boolean;
}) {
  const theme = THEMES[c.theme];
  const event = Date.parse(c.eventAt);
  return (
    <article
      className="partner-preview"
      style={{ background: theme.bg, color: theme.color }}
    >
      <Heart size={28} className="mx-auto mb-6" />
      <p className="text-xs tracking-[.18em] uppercase mb-6">
        {product === "gift"
          ? "Uma história feita de nós"
          : "Você faz parte desse momento"}
      </p>
      <h1>{c.title || "Sua história começa aqui"}</h1>
      {c.subtitle ? (
        <p className="mt-4 text-lg opacity-80">{c.subtitle}</p>
      ) : null}
      <div className="partner-media-grid my-8">
        {c.photoSlots.map((slot) =>
          urls[String(slot)] ? (
            <Image unoptimized width={1200} height={900}
              key={slot}
              src={urls[String(slot)]}
              alt={`Memória ${slot + 1}`}
              className="partner-photo"
            />
          ) : null,
        )}
      </div>
      <p className="text-base leading-8 max-w-xl mx-auto">
        {c.message ||
          "As palavras que você escolher aparecerão aqui, junto das suas memórias."}
      </p>
      {c.audio && urls.audio ? (
        <div className="mt-8">
          <p className="text-sm mb-3">Uma mensagem na minha voz</p>
          <audio
            controls
            preload="metadata"
            src={urls.audio}
            className="max-w-full mx-auto"
          >
            Seu navegador não suporta áudio.
          </audio>
        </div>
      ) : null}
      {product === "invitation" ? (
        <section className="mt-10 space-y-6">
          <div>
            <CalendarDays className="mx-auto mb-3" size={24} />
            <p className="text-lg font-semibold">
              {Number.isFinite(event)
                ? new Date(event).toLocaleString("pt-BR", {
                    dateStyle: "full",
                    timeStyle: "short",
                    timeZone: "America/Sao_Paulo",
                  })
                : "Data e horário do evento"}
            </p>
            <p className="text-xs mt-1">Horário de Brasília</p>
          </div>
          <div>
            <MapPin className="mx-auto mb-3" size={24} />
            <p className="font-semibold">{c.venue || "Local do encontro"}</p>
            <p className="text-sm mt-2">{c.address}</p>
          </div>
          <div className="partner-actions justify-center">
            {c.address ? (
              <a
                className="partner-btn secondary"
                href={
                  preview
                    ? undefined
                    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.address)}`
                }
                aria-disabled={preview}
                target="_blank"
                rel="noreferrer"
              >
                Como chegar
              </a>
            ) : null}
            {/^55\d{10,11}$/.test(c.rsvpPhone) ? (
              <a
                className="partner-btn"
                href={
                  preview
                    ? undefined
                    : `https://wa.me/${c.rsvpPhone}?text=${encodeURIComponent(`Olá! Quero confirmar minha presença em ${c.title}.`)}`
                }
                aria-disabled={preview}
                target="_blank"
                rel="noreferrer"
              >
                Confirmar pelo WhatsApp
              </a>
            ) : null}
          </div>
        </section>
      ) : null}
      {c.signature ? (
        <p className="font-serif text-2xl mt-10">{c.signature}</p>
      ) : null}
      <div className="mt-12 pt-6 border-t border-current/10 text-xs opacity-70">
        <p>Preparado com carinho · {storeName}</p>
        <p className="mt-2">Feito de Nós</p>
      </div>
    </article>
  );
}
