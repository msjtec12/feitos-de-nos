import { PartnerShell } from "@/components/partners/PartnerShell";
export default function Page() {
  return (
    <PartnerShell>
      <p className="partner-kicker">Programa de parceiros</p>
      <h1 className="partner-title">Condições do piloto</h1>
      <div className="partner-fields mt-8 text-sm leading-7">
        <p>
          A loja vende e recebe do cliente pelo seu próprio atendimento. O Feito
          de Nós fornece a criação e a hospedagem do produto digital. O cadastro
          precisa ser aprovado antes de criar pedidos. Não há mensalidade neste
          piloto.
        </p>
        <p>
          <strong>Saldo e cobrança.</strong> A recarga é combinada com o
          atendimento e liberada pelo proprietário após confirmar o pagamento. O
          pedido reserva R$ 9,90 para homenagem ou R$ 29,90 para convite. A
          publicação consome essa reserva uma única vez. Rascunhos cancelados
          devolvem a disponibilidade do saldo. Pedidos publicados não têm
          cancelamento automático; solicitações de reembolso devem ser tratadas
          pelo atendimento. Preços futuros não alteram pedidos já criados.
        </p>
        <p>
          <strong>Conteúdo e duração.</strong> Homenagens incluem até 5 fotos e
          1 áudio, com até 3 MB por arquivo, e permanecem acessíveis por 12
          meses após publicar. Convites incluem 1 foto, data e endereço, mapa e
          confirmação por WhatsApp; ficam acessíveis até 30 dias após o evento.
          O serviço avisa a data de vencimento na entrega. Não inclui hospedagem
          permanente, lista de convidados ou confirmação interna de presença.
        </p>
        <p>
          <strong>Personalização.</strong> O cliente escolhe um modelo, preenche
          os campos e revisa antes de publicar. Correções dentro do prazo não
          têm nova cobrança. A data do evento fica fixa após a publicação.
          Guarde os arquivos originais: o produto não é um serviço de backup.
        </p>
        <p>
          <strong>Privacidade.</strong> Quem recebe o link público ou QR pode
          acessar o conteúdo. O link privado permite editar e publicar: envie
          apenas ao cliente responsável. A loja pode substituir esse link no
          painel. Publique somente conteúdo autorizado, inclusive imagens de
          outras pessoas e de crianças sob sua responsabilidade. Não inclua
          documentos, informações financeiras ou dados sensíveis.
        </p>
        <p>
          <strong>Atendimento.</strong> O primeiro contato do cliente é a loja
          identificada no pedido. A loja aciona o Feito de Nós para recargas,
          dúvidas e problemas. Alterações futuras das condições devem ser
          apresentadas antes de novas contratações.
        </p>
      </div>
    </PartnerShell>
  );
}
