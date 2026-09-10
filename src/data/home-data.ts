import { OccasionOption, FormatOption, StyleOption } from '@/types/order';

export const OCCASIONS: OccasionOption[] = [
  {
    id: 'primeiro-ano',
    title: 'Meu Primeiro Ano',
    subtitle: 'Para bebês e famílias',
    description: 'Celebre cada mês, as primeiras descobertas, os sons e o amor dos primeiros 12 meses de vida.',
    badge: 'Emocionante',
    suggestedStyle: 'infantil-suave',
  },
  {
    id: 'nossa-historia',
    title: 'Nossa História',
    subtitle: 'Para casais e aniversários',
    description: 'Uma linha do tempo viva do amor, dos encontros, das viagens e dos momentos inesquecíveis.',
    badge: 'Romântico',
    suggestedStyle: 'afetuoso',
  },
  {
    id: 'vozes',
    title: 'Vozes para Você',
    subtitle: 'Mensagens e homenagens',
    description: 'Depoimentos em áudio e cartas de familiares e amigos reunidos em um presente inesquecível.',
    badge: 'Inesquecível',
    suggestedStyle: 'delicado',
  },
  {
    id: 'especial',
    title: 'Uma História Especial',
    subtitle: 'Para momentos únicos',
    description: 'Aniversários marcantes, formaturas, amizades de uma vida ou tributos cheios de carinho.',
    badge: 'Personalizado',
    suggestedStyle: 'elegante',
  },
];

export const GIFT_FORMATS: FormatOption[] = [
  {
    id: 'digital',
    title: 'História Digital',
    price: 59.90,
    description: 'Página personalizada, até 12 fotos, uma mensagem de voz, música, texto, link e QR Code.',
    features: [
      'Página web personalizada e exclusiva',
      'Até 12 fotos em alta definição com linha do tempo',
      '1 mensagem de voz com player interativo de ondas',
      'Música tema / trilha sonora',
      'Mensagens de texto e cartas dedicatórias',
      'Link exclusivo e QR Code digital em alta resolução',
      'Acesso vitalício e seguro',
    ],
    isPhysical: false,
  },
  {
    id: 'cartao',
    title: 'Cartão que Fala',
    price: 99.90,
    badge: 'Físico + Digital',
    description: 'Tudo da versão digital, cartão premium personalizado, envelope e QR Code impresso.',
    features: [
      'Tudo da História Digital',
      'Cartão premium personalizado em alta gramatura',
      'Envelope artesanal para presente',
      'QR Code impresso com arte personalizada',
      'Envio seguro para todo o Brasil',
    ],
    isPhysical: true,
  },
  {
    id: 'interativo',
    title: 'Presente Interativo',
    price: 199.90,
    popular: true,
    badge: 'Mais Escolhido',
    description: 'Página completa, até 20 fotos, três áudios, placa de acrílico 15×20 cm, base, QR Code, caixa e embalagem.',
    features: [
      'Página completa com até 20 fotos',
      'Até 3 mensagens de áudio gravadas',
      'Placa de acrílico 15×20 cm com base elegante',
      'QR Code gravado na placa de acrílico',
      'Caixa de presente artesanal e embalagem especial',
      'Curadoria e suporte dedicado prioritário no WhatsApp',
    ],
    isPhysical: true,
  },
];

export const STYLE_OPTIONS: StyleOption[] = [
  // --- CLÁSSICOS & ASSINATURA ---
  {
    id: 'afetuoso',
    name: 'Afetuoso (Assinatura)',
    category: 'classicos',
    description: 'Tons acolhedores de vinho nobre e terracota para celebrações íntimas e cheias de calor.',
    primaryColor: '#713C48',
    accentColor: '#C96E5A',
    backgroundColor: '#FFF8F0',
    textColor: '#302B2D',
    bgPreview: 'from-[#713C48]/15 via-[#FFF8F0] to-[#C96E5A]/15',
  },
  {
    id: 'elegante',
    name: 'Elegante & Champagne',
    category: 'classicos',
    description: 'Grafite atemporal e ouro champagne para homenagens solenes e grandes conquistas.',
    primaryColor: '#302B2D',
    accentColor: '#BFA15F',
    backgroundColor: '#FAF7F2',
    textColor: '#262224',
    bgPreview: 'from-[#302B2D]/15 via-[#FAF7F2] to-[#BFA15F]/20',
  },
  {
    id: 'terracota-boho',
    name: 'Terracota Raízes',
    category: 'classicos',
    description: 'Inspiração terrosa e artesanal para histórias de vida profundas e autênticas.',
    primaryColor: '#A04A35',
    accentColor: '#D4A373',
    backgroundColor: '#FDFBF7',
    textColor: '#332520',
    bgPreview: 'from-[#A04A35]/15 via-[#FDFBF7] to-[#D4A373]/20',
  },

  // --- BEBÊS & INFANTIL ---
  {
    id: 'infantil-suave',
    name: 'Infantil Doçura',
    category: 'infantil',
    description: 'Ternura e suavidade pensadas especialmente para bebês e infância.',
    primaryColor: '#C96E5A',
    accentColor: '#F4C2A5',
    backgroundColor: '#FFF9F5',
    textColor: '#3D2E2B',
    bgPreview: 'from-[#C96E5A]/15 via-[#FFF9F5] to-[#F4C2A5]/25',
  },
  {
    id: 'azul-sereno',
    name: 'Azul Sereno (Céu)',
    category: 'infantil',
    description: 'Calmaria e leveza do céu para meninos, batizados e descobertas do primeiro ano.',
    primaryColor: '#52799A',
    accentColor: '#D48270',
    backgroundColor: '#F3F7FA',
    textColor: '#243342',
    bgPreview: 'from-[#52799A]/15 via-[#F3F7FA] to-[#D48270]/20',
  },
  {
    id: 'lavanda-bebe',
    name: 'Algodão & Lavanda',
    category: 'infantil',
    description: 'Conforto e tranquilidade para o sono e os primeiros carinhos do recém-nascido.',
    primaryColor: '#8E7C9E',
    accentColor: '#E5B8C0',
    backgroundColor: '#FAF7FC',
    textColor: '#35293D',
    bgPreview: 'from-[#8E7C9E]/15 via-[#FAF7FC] to-[#E5B8C0]/20',
  },

  // --- AMOR & CASAMENTO ---
  {
    id: 'delicado',
    name: 'Delicado & Poético',
    category: 'romantico',
    description: 'Rosa antigo e creme suave com estética poética, doce e romântica.',
    primaryColor: '#D9A4A0',
    accentColor: '#713C48',
    backgroundColor: '#FFF5F5',
    textColor: '#302B2D',
    bgPreview: 'from-[#D9A4A0]/25 via-[#FFF5F5] to-[#713C48]/15',
  },
  {
    id: 'cerejeira-marsala',
    name: 'Cerejeira & Marsala',
    category: 'romantico',
    description: 'Paixão e sofisticação para bodas, aniversários de casamento e histórias a dois.',
    primaryColor: '#842D3C',
    accentColor: '#E8B4B8',
    backgroundColor: '#FFF6F7',
    textColor: '#2B171A',
    bgPreview: 'from-[#842D3C]/15 via-[#FFF6F7] to-[#E8B4B8]/25',
  },
  {
    id: 'noite-estrelada',
    name: 'Noite Estrelada',
    category: 'romantico',
    description: 'O brilho das estrelas e o aconchego da noite para declarações marcantes.',
    primaryColor: '#26394E',
    accentColor: '#D9A4A0',
    backgroundColor: '#F4F6F9',
    textColor: '#1A2533',
    bgPreview: 'from-[#26394E]/15 via-[#F4F6F9] to-[#D9A4A0]/20',
  },

  // --- NATUREZA & LUZ ---
  {
    id: 'verde-botanico',
    name: 'Verde Botânico (Vida)',
    category: 'natureza',
    description: 'Frescor orgânico da natureza para homenagens de família, mães e avós.',
    primaryColor: '#4D6D53',
    accentColor: '#C96E5A',
    backgroundColor: '#F5F7F3',
    textColor: '#233226',
    bgPreview: 'from-[#4D6D53]/15 via-[#F5F7F3] to-[#C96E5A]/15',
  },
  {
    id: 'eucalipto-alecrim',
    name: 'Eucalipto & Alecrim',
    category: 'natureza',
    description: 'Serenidade e elegância botânica com toques aromáticos e acolhedores.',
    primaryColor: '#596F62',
    accentColor: '#B8735C',
    backgroundColor: '#F6F8F5',
    textColor: '#2A352F',
    bgPreview: 'from-[#596F62]/15 via-[#F6F8F5] to-[#B8735C]/20',
  },
  {
    id: 'sol-girassol',
    name: 'Sol & Girassol (Luz)',
    category: 'natureza',
    description: 'Calor, vitalidade e alegria para pessoas radiantes que iluminam a todos.',
    primaryColor: '#C28B28',
    accentColor: '#713C48',
    backgroundColor: '#FFFDF5',
    textColor: '#3A2E1C',
    bgPreview: 'from-[#C28B28]/15 via-[#FFFDF5] to-[#713C48]/15',
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Escolha a ocasião e o formato',
    description: 'Selecione o tema da celebração e se prefere o formato 100% digital ou acompanhado de itens físicos.',
  },
  {
    step: '02',
    title: 'Envie memórias no WhatsApp',
    description: 'Após preparar seu pedido, você receberá orientações fáceis para nos enviar fotos, mensagens e áudios de voz.',
  },
  {
    step: '03',
    title: 'Criação e aprovação carinhosa',
    description: 'Nossa equipe monta a página interativa e você valida cada detalhe antes da entrega final.',
  },
  {
    step: '04',
    title: 'A emoção de presentear',
    description: 'Ao apontar a câmera do celular para o QR Code, quem você ama descobre um presente vivo e inesquecível.',
  },
];

export const DIFFERENTIATORS = [
  {
    title: 'Não é apenas para olhar',
    description: 'É para ouvir a voz de quem ama, ler palavras sinceras e revisitar momentos que aquecem a alma.',
  },
  {
    title: 'A voz de pessoas queridas',
    description: 'Integramos gravações reais de áudio com player interativo, mantendo eternos os risos e conselhos.',
  },
  {
    title: 'Design autoral e acolhedor',
    description: 'Tipografia nobre, paleta afetuosa e atenção aos detalhes para que cada presente seja uma obra de arte.',
  },
  {
    title: 'Fácil para todas as idades',
    description: 'Sem necessidade de baixar aplicativos ou criar contas. Um simples toque na câmera abre tudo.',
  },
  {
    title: 'Segurança e durabilidade',
    description: 'Seu presente fica hospedado de forma permanente e segura, pronto para ser acessado por toda a vida.',
  },
];

export const FAQ_ITEMS = [
  {
    question: 'Como envio as fotos e áudios?',
    answer: 'Após configurar seu pedido no site, você será direcionado para o nosso WhatsApp oficial. Nossa equipe enviará um roteiro prático e acolhedor para que você envie fotos, textos e grave áudios com total tranquilidade.',
  },
  {
    question: 'Quem não tem facilidade com celular consegue abrir?',
    answer: 'Com certeza! Projetamos a experiência para ser extremamente simples e acessível. Basta apontar a câmera do celular para o QR Code e o presente abre direto no navegador, sem cadastro e sem complicação.',
  },
  {
    question: 'Quanto tempo leva para ficar pronto?',
    answer: 'Para a História Digital, entregamos a prévia em até 48 horas após o recebimento de todos os materiais. Para o Cartão que Fala e o Presente Interativo, a produção e postagem ocorrem em 2 a 4 dias úteis + prazo dos Correios para o seu CEP.',
  },
  {
    question: 'Posso aprovar antes de presentear a pessoa?',
    answer: 'Sim, sempre! Você recebe uma prévia privada completa para navegar, ouvir os áudios e solicitar ajustes antes do envio final ou da impressão dos materiais físicos.',
  },
  {
    question: 'Por quanto tempo o presente continuará disponível?',
    answer: 'O presente digital possui acesso vitalício e permanente em nossos servidores seguros. Você pode revisitar as memórias sempre que bater a saudade, em qualquer dispositivo.',
  },
  {
    question: 'Posso convidar outras pessoas para enviar áudios e mensagens?',
    answer: 'Sim! Você pode reunir áudios e recados de avós, tios, padrinhos e amigos no WhatsApp e nos encaminhar. Nós organizamos tudo com nome e foto de cada colaborador com muito carinho.',
  },
];
