-- ============================================================================
-- FEITO DE NÓS — SCRIPT DE CARGA INICIAL (SEED DATA - MATHEUS AKIRA)
-- ============================================================================

DO $$
DECLARE
    v_gift_id UUID;
BEGIN
    -- 1. INSERIR PRESENTE DO MATHEUS AKIRA
    INSERT INTO public.gifts (
        slug,
        recipient_name,
        recipient_subtitle,
        recipient_tagline,
        intro_quote,
        hero_image_url,
        hero_image_alt,
        primary_audio_url,
        primary_audio_title,
        primary_audio_recorded_by,
        primary_audio_duration_seconds,
        opening_headline,
        opening_description,
        opening_button_label,
        closing_headline,
        closing_message,
        closing_signature,
        is_active
    ) VALUES (
        'matheus-akira',
        'Matheus Akira',
        'Meu primeiro ano',
        '365 dias de amor',
        'Um ano inteiro de descobertas, sorrisos e momentos que transformaram nossa história.',
        '/demo/images/hero-matheus.jpg',
        'Foto principal de capa do primeiro ano do Matheus Akira',
        '/demo/audio/mensagem-pais.mp3',
        'Mensagem dos pais',
        'Papai e Mamãe',
        98,
        'Uma história foi feita para você.',
        'Ela reúne momentos, vozes e pessoas que fizeram parte do seu primeiro ano.',
        'Abrir meu presente',
        'Esta é apenas a primeira parte da sua história.',
        'Que você cresça cercado pelas vozes, lembranças e pessoas que fizeram do seu primeiro ano um tempo inesquecível.',
        'Com todo o nosso amor.',
        true
    )
    ON CONFLICT (slug) DO UPDATE SET
        recipient_name = EXCLUDED.recipient_name,
        updated_at = now()
    RETURNING id INTO v_gift_id;

    -- Limpar dados filhos caso já existam para recarga limpa
    DELETE FROM public.timeline_moments WHERE gift_id = v_gift_id;
    DELETE FROM public.contributor_messages WHERE gift_id = v_gift_id;
    DELETE FROM public.gallery_items WHERE gift_id = v_gift_id;

    -- 2. INSERIR OS 12 MESES DA LINHA DO TEMPO
    INSERT INTO public.timeline_moments (gift_id, month_number, title, subtitle, caption, image_url, image_alt, display_order)
    VALUES
        (v_gift_id, 1, '1º Mês', 'Mês 1', 'Nosso primeiro encontro.', '/demo/images/month-01.jpg', 'Primeiro mês do Matheus', 1),
        (v_gift_id, 2, '2º Mês', 'Mês 2', 'Os primeiros sorrisos.', '/demo/images/month-02.jpg', 'Segundo mês do Matheus', 2),
        (v_gift_id, 3, '3º Mês', 'Mês 3', 'Descobrindo o mundo.', '/demo/images/month-03.jpg', 'Terceiro mês do Matheus', 3),
        (v_gift_id, 4, '4º Mês', 'Mês 4', 'Cada dia uma novidade.', '/demo/images/month-04.jpg', 'Quarto mês do Matheus', 4),
        (v_gift_id, 5, '5º Mês', 'Mês 5', 'Um sorriso que ilumina tudo.', '/demo/images/month-05.jpg', 'Quinto mês do Matheus', 5),
        (v_gift_id, 6, '6º Mês', 'Mês 6', 'Metade de um ano de amor.', '/demo/images/month-06.jpg', 'Sexto mês do Matheus', 6),
        (v_gift_id, 7, '7º Mês', 'Mês 7', 'Novas descobertas.', '/demo/images/month-07.jpg', 'Sétimo mês do Matheus', 7),
        (v_gift_id, 8, '8º Mês', 'Mês 8', 'A casa ficou ainda mais alegre.', '/demo/images/month-08.jpg', 'Oitavo mês do Matheus', 8),
        (v_gift_id, 9, '9º Mês', 'Mês 9', 'Pequenos passos, grandes emoções.', '/demo/images/month-09.jpg', 'Nono mês do Matheus', 9),
        (v_gift_id, 10, '10º Mês', 'Mês 10', 'Uma personalidade cheia de carinho.', '/demo/images/month-10.jpg', 'Décimo mês do Matheus', 10),
        (v_gift_id, 11, '11º Mês', 'Mês 11', 'Preparando o primeiro aniversário.', '/demo/images/month-11.jpg', 'Décimo primeiro mês do Matheus', 11),
        (v_gift_id, 12, '12º Mês', 'Mês 12', 'Um ano da nossa melhor história.', '/demo/images/month-12.jpg', 'Décimo segundo mês do Matheus', 12);

    -- 3. INSERIR AS VOZES DE QUEM AMA (PAIS, AVÓS, PADRINHOS)
    INSERT INTO public.contributor_messages (gift_id, author_name, relation, avatar_url, written_message, audio_url, audio_title, audio_duration_seconds, display_order)
    VALUES
        (
            v_gift_id,
            'Papai e Mamãe',
            'Pais',
            '/demo/images/avatar-pais.jpg',
            'Filho, este primeiro ano foi a maior aventura e a mais doce bênção das nossas vidas. Ver você crescer dia a dia encheu nossa casa de riso e nosso coração de um amor que nunca imaginávamos existir. Esta história é para você sempre lembrar o quanto foi sonhado e amado.',
            '/demo/audio/mensagem-pais.mp3',
            'Mensagem dos pais',
            98,
            1
        ),
        (
            v_gift_id,
            'Vovô e Vovó',
            'Avós',
            '/demo/images/avatar-avos.jpg',
            'Nosso querido neto Matheus, cada abraço seu renova nossas forças. Seu olhar curioso e seu jeitinho carinhoso são os maiores presentes que a vida nos deu. Estaremos sempre aqui para segurar sua mão e torcer pelos seus sonhos.',
            '/demo/audio/mensagem-avos.mp3',
            'Mensagem dos avós',
            74,
            2
        ),
        (
            v_gift_id,
            'Dindo e Dinda',
            'Padrinhos',
            '/demo/images/avatar-padrinhos.jpg',
            'Afilhado amado, ser escolhido para caminhar ao seu lado é uma honra imensa. Prometemos estar por perto em todas as etapas, com conselhos, brincadeiras e muito carinho. Que seu caminho seja sempre iluminado.',
            '/demo/audio/mensagem-padrinhos.mp3',
            'Mensagem dos padrinhos',
            62,
            3
        );

    -- 4. INSERIR ITENS DA GALERIA DE MEMÓRIAS
    INSERT INTO public.gallery_items (gift_id, image_url, caption, alt_text, aspect_ratio, display_order)
    VALUES
        (v_gift_id, '/demo/images/gallery-01.jpg', 'Pequenos detalhes, infinito amor', 'Detalhe das mãozinhas', 'portrait', 1),
        (v_gift_id, '/demo/images/gallery-02.jpg', 'A hora do banho favorita', 'Momento do banho', 'square', 2),
        (v_gift_id, '/demo/images/gallery-03.jpg', 'O melhor lugar do mundo: o colo da mãe', 'Soneca no colo', 'landscape', 3),
        (v_gift_id, '/demo/images/gallery-04.jpg', 'Sentindo a grama e o sol da manhã', 'Passeio no parque', 'portrait', 4),
        (v_gift_id, '/demo/images/gallery-05.jpg', 'A risada que alegra a casa inteira', 'Gargalhada espontânea', 'square', 5),
        (v_gift_id, '/demo/images/gallery-06.jpg', 'Descobrindo novos sabores', 'Primeira frutinha', 'portrait', 6),
        (v_gift_id, '/demo/images/gallery-07.jpg', 'Gerações unidas pelo mesmo amor', 'Abraço com os avós', 'landscape', 7),
        (v_gift_id, '/demo/images/gallery-08.jpg', 'Construindo torres e derrubando com alegria', 'Brincando com blocos', 'square', 8),
        (v_gift_id, '/demo/images/gallery-09.jpg', 'Janelas abertas para novas descobertas', 'Olhando na janela', 'portrait', 9),
        (v_gift_id, '/demo/images/gallery-10.jpg', 'Momentos simples que valem uma vida', 'Brincando no tapete', 'landscape', 10),
        (v_gift_id, '/demo/images/gallery-11.jpg', 'Ganhando o mundo passo a passo', 'Primeiros passinhos', 'portrait', 11),
        (v_gift_id, '/demo/images/gallery-12.jpg', 'Um ano de vida, uma eternidade de amor', 'Ensaio de 1 ano', 'square', 12);
END $$;
