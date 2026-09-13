import { GiftExperience } from "@/types/gift";

/**
 * Fallback visual da demonstração "Meu Primeiro Ano — Matheus Akira".
 * Este objeto NÃO contém fotos pessoais reais. Ele só é usado quando não existe
 * uma página publicada no Supabase para o slug solicitado.
 */
export const matheusAkiraGiftData: GiftExperience = {
  slug: "matheus-akira",
  openingText: {
    headline: "Uma história foi feita para você.",
    description: "Ela reúne momentos, vozes e pessoas que fizeram parte do seu primeiro ano.",
    buttonLabel: "Abrir meu presente",
  },
  recipient: {
    name: "Matheus Akira",
    subtitle: "Meu primeiro ano",
    tagline: "365 dias de amor",
    featuredImage: {
      id: "hero-photo",
      url: "",
      altText: "Foto principal ainda não disponível",
      caption: "Foto principal de capa do primeiro ano",
      aspectRatio: "portrait",
      isAvailable: false,
    },
    introQuote: "Um ano inteiro de descobertas, sorrisos e momentos que transformaram nossa história.",
  },
  primaryAudio: undefined,
  timelineMoments: Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const titles = [
      "Nosso primeiro encontro.",
      "Os primeiros sorrisos.",
      "Descobrindo o mundo.",
      "Cada dia uma novidade.",
      "Um sorriso que ilumina tudo.",
      "Metade de um ano de amor.",
      "Novas descobertas.",
      "A casa ficou ainda mais alegre.",
      "Pequenos passos, grandes emoções.",
      "Uma personalidade cheia de carinho.",
      "Preparando o primeiro aniversário.",
      "Um ano da nossa melhor história.",
    ];

    return {
      monthNumber: month,
      title: `${month}º Mês`,
      subtitle: `Mês ${month}`,
      caption: titles[index],
      image: {
        id: `month-${month}`,
        url: "",
        altText: `Foto do ${month}º mês ainda não disponível`,
        caption: titles[index],
        aspectRatio: "square" as const,
        isAvailable: false,
      },
    };
  }),
  contributorMessages: [
    {
      id: "msg-pais",
      authorName: "Papai e Mamãe",
      relation: "Pais",
      writtenMessage: "Filho, este primeiro ano foi a maior aventura e a mais doce bênção das nossas vidas. Ver você crescer dia a dia encheu nossa casa de riso e nosso coração de um amor que nunca imaginávamos existir. Esta história é para você sempre lembrar o quanto foi sonhado e amado.",
    },
    {
      id: "msg-avos",
      authorName: "Vovô e Vovó",
      relation: "Avós",
      writtenMessage: "Nosso querido neto Matheus, cada abraço seu renova nossas forças. Seu olhar curioso e seu jeitinho carinhoso são os maiores presentes que a vida nos deu. Estaremos sempre aqui para segurar sua mão e torcer pelos seus sonhos.",
    },
    {
      id: "msg-padrinhos",
      authorName: "Dindo e Dinda",
      relation: "Padrinhos",
      writtenMessage: "Afilhado amado, ser escolhido para caminhar ao seu lado é uma honra imensa. Prometemos estar por perto em todas as etapas, com conselhos, brincadeiras e muito carinho. Que seu caminho seja sempre iluminado.",
    },
  ],
  galleryItems: [],
  closing: {
    headline: "Esta é apenas a primeira parte da sua história.",
    message: "Que você cresça cercado pelas vozes, lembranças e pessoas que fizeram do seu primeiro ano um tempo inesquecível.",
    signature: "Com todo o nosso amor.",
  },
  brand: {
    brandName: "Feito de Nós",
    slogan: "Histórias que viram presente.",
    logoUrl: "/brand/logo-feito-de-nos.png",
    symbolUrl: "/brand/simbolo-feito-de-nos.png",
  },
};
