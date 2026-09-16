import type { AuthorialThemeDefinition } from '@/data/invitation-themes';

export interface InvitationThemeCopy {
  countdown: string;
  date: string;
  location: string;
  map: string;
  galleryKicker: string;
  galleryTitle: string;
  giftKicker: string;
  giftTitle: string;
  rsvpKicker: string;
  rsvpTitle: string;
  guestbookKicker: string;
  guestbookTitle: string;
  closing: string;
}

const COPY: Record<string, InvitationThemeCopy> = {
  elemental: {
    countdown: 'A energia da celebração se aproxima', date: 'Dia da jornada', location: 'Portal do encontro', map: 'Seguir o mapa dos elementos',
    galleryKicker: 'Memórias elementais', galleryTitle: 'Crônicas da nossa jornada', giftKicker: 'Tesouro especial', giftTitle: 'Sugestões de presente',
    rsvpKicker: 'Junte-se à aventura', rsvpTitle: 'Qual elemento contará com você?', guestbookKicker: 'Livro dos elementos', guestbookTitle: 'Mensagens que dão força', closing: 'Quatro elementos, uma lembrança inesquecível.',
  },
  heroes: {
    countdown: 'Contagem para a grande missão', date: 'Dia da missão', location: 'Base da celebração', map: 'Traçar rota para a base',
    galleryKicker: 'Arquivo confidencial', galleryTitle: 'Momentos heroicos', giftKicker: 'Equipamento da missão', giftTitle: 'Presentes do herói',
    rsvpKicker: 'Convocação oficial', rsvpTitle: 'Podemos contar com seu superpoder?', guestbookKicker: 'Central dos aliados', guestbookTitle: 'Recados da nossa equipe', closing: 'Todo herói precisa dos melhores aliados.',
  },
  enchanted: {
    countdown: 'O grande baile se aproxima', date: 'Data real', location: 'Destino do reino', map: 'Abrir o mapa encantado',
    galleryKicker: 'Álbum real', galleryTitle: 'Memórias do nosso conto', giftKicker: 'Tesouro do reino', giftTitle: 'Presentes encantados',
    rsvpKicker: 'Chamado do reino', rsvpTitle: 'Sua presença encantará este dia?', guestbookKicker: 'Livro real', guestbookTitle: 'Desejos para este conto', closing: 'E viveremos este capítulo felizes e juntos.',
  },
  pop: {
    countdown: 'Contagem para o show', date: 'Data da apresentação', location: 'Palco principal', map: 'Abrir rota para o show',
    galleryKicker: 'Backstage', galleryTitle: 'Momentos de estrela', giftKicker: 'Lista VIP', giftTitle: 'Presentes da estrela',
    rsvpKicker: 'Acesso VIP', rsvpTitle: 'Você vem curtir esse show?', guestbookKicker: 'Mural dos fãs', guestbookTitle: 'Mensagens que são sucesso', closing: 'Sua presença vai fazer esse momento brilhar.',
  },
  blocks: {
    countdown: 'A missão começa em', date: 'Data desbloqueada', location: 'Ponto de encontro', map: 'Carregar mapa da fase',
    galleryKicker: 'Inventário de memórias', galleryTitle: 'Fases inesquecíveis', giftKicker: 'Baú de itens', giftTitle: 'Sugestões de presente',
    rsvpKicker: 'Entrar na partida', rsvpTitle: 'Jogamos esta fase com você?', guestbookKicker: 'Chat da equipe', guestbookTitle: 'Mensagens dos jogadores', closing: 'A melhor fase é aquela que vivemos juntos.',
  },
  dinosaurs: {
    countdown: 'Contagem regressiva para a aventura', date: 'Data da expedição', location: 'Local da aventura', map: 'Ver localização no mapa',
    galleryKicker: 'Registros da expedição', galleryTitle: 'Pequenas pegadas, grandes memórias', giftKicker: 'Baú do explorador', giftTitle: 'Presentes para a aventura',
    rsvpKicker: 'Equipe de exploradores', rsvpTitle: 'Você fará parte desta aventura?', guestbookKicker: 'Diário dos exploradores', guestbookTitle: 'Recados para guardar', closing: 'Vamos viver juntos essa grande aventura!',
  },
  baby: {
    countdown: 'Falta pouco para este sonho', date: 'Nosso dia especial', location: 'Onde vamos celebrar', map: 'Ver caminho até a celebração',
    galleryKicker: 'Álbum de ternura', galleryTitle: 'Memórias de um sonho', giftKicker: 'Carinho em forma de presente', giftTitle: 'Sugestões para o bebê',
    rsvpKicker: 'Esperamos você', rsvpTitle: 'Você vem sonhar conosco?', guestbookKicker: 'Céu de mensagens', guestbookTitle: 'Recadinhos cheios de amor', closing: 'Um pequeno sonho, cercado por um amor imenso.',
  },
  romantic: {
    countdown: 'Nosso momento se aproxima', date: 'A nossa data', location: 'Onde celebraremos', map: 'Ver caminho para o nosso encontro',
    galleryKicker: 'Nossa história', galleryTitle: 'Capítulos de amor', giftKicker: 'Com carinho', giftTitle: 'Lista de presentes',
    rsvpKicker: 'Celebre conosco', rsvpTitle: 'Teremos a alegria da sua presença?', guestbookKicker: 'Cartas de carinho', guestbookTitle: 'Palavras para nossa história', closing: 'O amor é ainda mais bonito quando compartilhado.',
  },
  elegant: {
    countdown: 'A celebração se aproxima', date: 'Data da celebração', location: 'Local da recepção', map: 'Consultar localização',
    galleryKicker: 'Memórias selecionadas', galleryTitle: 'Nossa celebração', giftKicker: 'Lista especial', giftTitle: 'Sugestões de presentes',
    rsvpKicker: 'Confirmação', rsvpTitle: 'Contamos com a sua presença?', guestbookKicker: 'Livro de honra', guestbookTitle: 'Mensagens dos convidados', closing: 'Será uma honra celebrar este momento ao seu lado.',
  },
  sacred: {
    countdown: 'Preparando o coração para este dia', date: 'Data da celebração', location: 'Local da cerimônia', map: 'Ver caminho para a cerimônia',
    galleryKicker: 'Memórias abençoadas', galleryTitle: 'Um caminho de fé e amor', giftKicker: 'Gesto de carinho', giftTitle: 'Sugestões de presente',
    rsvpKicker: 'Celebre conosco', rsvpTitle: 'Podemos contar com sua presença?', guestbookKicker: 'Livro de bênçãos', guestbookTitle: 'Mensagens de fé e carinho', closing: 'Que este momento permaneça para sempre em nossos corações.',
  },
  botanical: {
    countdown: 'A primavera deste encontro se aproxima', date: 'Dia da celebração', location: 'Nosso jardim', map: 'Encontrar o caminho entre as flores',
    galleryKicker: 'Jardim de memórias', galleryTitle: 'Momentos que floresceram', giftKicker: 'Sementes de carinho', giftTitle: 'Sugestões de presente',
    rsvpKicker: 'Floresça conosco', rsvpTitle: 'Sua presença fará parte deste jardim?', guestbookKicker: 'Herbário de afetos', guestbookTitle: 'Palavras que florescem', closing: 'As melhores lembranças florescem quando estamos juntos.',
  },
  minimal: {
    countdown: 'Tempo restante', date: 'Data', location: 'Local', map: 'Abrir localização',
    galleryKicker: 'Arquivo', galleryTitle: 'Memórias', giftKicker: 'Presentes', giftTitle: 'Informações',
    rsvpKicker: 'RSVP', rsvpTitle: 'Confirme sua presença', guestbookKicker: 'Notas', guestbookTitle: 'Mensagens', closing: 'Esperamos você.',
  },
  celebration: {
    countdown: 'A festa começa em', date: 'Dia da festa', location: 'Onde tudo acontece', map: 'Partiu festa: abrir rota',
    galleryKicker: 'Só momentos incríveis', galleryTitle: 'Galeria da celebração', giftKicker: 'Mimos e surpresas', giftTitle: 'Lista de presentes',
    rsvpKicker: 'Você é nosso convidado', rsvpTitle: 'Vai comemorar com a gente?', guestbookKicker: 'Mural da festa', guestbookTitle: 'Recados para celebrar', closing: 'Prepare o sorriso: essa festa será inesquecível!',
  },
};

export function getInvitationThemeCopy(theme: AuthorialThemeDefinition): InvitationThemeCopy {
  return COPY[theme.assetFolder] || COPY.minimal;
}
