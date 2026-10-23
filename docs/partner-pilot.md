# Operação do piloto de parceiros

## Começar a vender

1. Envie `/parceiros` para a loja. Ela cria uma conta, confirma o e-mail quando exigido pelo Supabase e conclui o cadastro.
2. Entre em `/admin/parceiros` com um administrador **owner** e aprove a loja.
3. Combine o pagamento da recarga fora do sistema. Depois de conferir o recebimento no banco, informe loja, valor e identificador único da transação. O sistema não processa Pix/cartões e não confirma pagamentos sozinho.
4. A loja entra em `/parceiros/painel`, cria um pedido e envia o link privado de preenchimento ao cliente. O valor fica reservado.
5. O cliente preenche, revisa e publica. O sistema consome a reserva uma vez e entrega um link público, QR em PNG e cartão para impressão.
6. A loja divulga seu catálogo `/loja/{slug}`. Os interessados pedem orçamento pelo WhatsApp da loja; valores ao consumidor são definidos pela loja.

### Produtos do piloto

| Produto | Custo para loja | Venda sugerida | Inclui | Acesso |
|---|---:|---:|---|---|
| Homenagem com QR | R$ 9,90 | R$ 29,90 | Texto, até 5 fotos e 1 áudio | 12 meses após publicar |
| Convite Essencial | R$ 29,90 | R$ 59,90 | Texto, 1 foto, data/local, mapa, WhatsApp | Evento + 30 dias |

Cada arquivo pode ter até 3 MB. Formatos: JPG, PNG, WebP; MP3, M4A, OGG, WAV. Três estilos estão disponíveis. A marca da loja aparece pelo nome; logotipo próprio, edição de preços públicos, checkout automático, RSVP interno e planos avançados ficam fora deste piloto. A diferença entre custo e venda sugerida não representa lucro líquido.

Rascunhos podem ser cancelados pela loja, liberando a reserva. Publicados não têm estorno automático. Correções não cobram novamente nem prorrogam o prazo. A data do convite fica fixa após publicar. Fotos e áudio novos são enviados para uma versão de prévia; salvar as alterações atualiza a seleção da mídia publicada. Cada posição usa duas versões de arquivo para limitar o armazenamento.

## Configuração

Reutiliza a implantação Next.js/Vercel e o Supabase do projeto. Não cria outra hospedagem.

- `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` (ou `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`).
- `SUPABASE_SERVICE_ROLE_KEY`: obrigatório e somente no servidor. O módulo parceiro falha de forma fechada se estiver ausente; não substitui pela chave pública.
- `PARTNER_LINK_SECRET`: opcional, segredo aleatório exclusivo para assinar links privados. Se ausente, usa a chave de serviço com contexto HMAC específico. Alterar o segredo revoga todos os links privados existentes; os públicos continuam iguais. Depois de alterar, a loja obtém novos links no painel.
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: número do atendimento, com país/DDD, sem pontuação. Na ausência, o painel orienta a usar o contato que ativou a parceria.
- Supabase Auth: autorize `https://SEU_DOMINIO/auth/partner-callback` e a variante `?recuperar=1` em Redirect URLs. Configure SMTP para volume real de cadastros. A confirmação de e-mail continua sujeita à configuração do projeto.

Aplique `supabase/migrations/20261023151016_partner_store_pilot.sql` antes da versão do aplicativo. Ela acrescenta três tabelas, três funções e um bucket privado; não modifica pedidos/convites antigos. Para reverter o aplicativo, volte ao commit anterior; deixe as tabelas novas preservadas se já houver operações reais.

## Controles implementados

- Autenticação de sessão verificada no servidor com `getUser`. Aprovação e crédito exigem `admin_profiles.active` e `role=owner`; metadados enviados pelo cliente não atribuem permissões.
- Tabelas e RPCs não acessíveis diretamente por `anon`/`authenticated`. RLS habilitada sem políticas de cliente, intencionalmente: o servidor verifica a identidade e a propriedade antes de usar `service_role`.
- Carteira bloqueada com `FOR UPDATE` antes de operações financeiras. Valores inteiros em centavos; saldo e reserva nunca negativos. Preço capturado na criação; débito somente na publicação.
- Chave idempotente na criação de pedidos, referência bancária única em recargas e operações publicar/cancelar idempotentes. Extrato conserva reserva, captura e liberação como eventos distintos.
- Links privados assinados HMAC-SHA256, revogáveis por pedido, separados do token público. Checagem de revisão evita sobrescrever outro preenchimento. Links públicos só leem pedidos publicados e dentro da validade.
- Armazenamento privado, links de mídia com validade de 15 minutos, nomes de objetos por pedido/slot, cotas fixas de slots e tamanho, verificação de assinatura do tipo de arquivo. Nenhum caminho de arquivo é aceito do cliente.
- Origem da solicitação verificada; páginas privadas sem indexação, sem referência externa e sem cache compartilhado. HTML do cliente não é interpretado.

O prazo bloqueia o acesso público e a edição. O piloto não agenda exclusão física automática de arquivos vencidos: planeje a limpeza pelo Storage após a retenção operacional acordada. Rascunhos abandonados continuam reservando saldo até cancelamento pela loja. Revise-os no atendimento periódico.

## Verificação

```sh
npm ci
npm run typecheck
npm run test:partners
NEXT_TELEMETRY_DISABLED=1 npm run build
```

Execute `tests/partners/wallet.sql` via cliente SQL em ambiente autorizado após a migração. As contas, lojas e movimentos de teste são revertidos na mesma transação. Valida idempotência, falta de saldo, propriedade, autorização de crédito, conflitos de revisão, revogação, cancelamento e retenção.

Antes de ampliar o piloto, valide uma venda assistida com uma loja aprovada: cadastro/confirmar e-mail → recarga conferida → pedido → mídia → revisão → publicação → QR → saldo final. Teste também a recuperação de senha e a entrega de e-mails no domínio de produção. Nenhum envio de convite por WhatsApp é automático.
