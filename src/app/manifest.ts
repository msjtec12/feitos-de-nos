import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Feito de Nós — Histórias que viram presente",
    short_name: "Feito de Nós",
    description: "Presentes afetivos interativos que transformam memórias e vozes em histórias inesquecíveis.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF8F0",
    theme_color: "#713C48",
    icons: [
      {
        src: "/brand/logo-feito-de-nos.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
