-- DECORWALL - Dados iniciais
-- Execute DEPOIS do schema.sql

insert into products (name, slug, image_url, display_order) values
  ('Foto Mural', 'foto-mural', 'https://fotomural.com.br/version-test/files/style_photo/f_auto,q_auto/1730923479546x841563553548984300/Captura%20de%20tela%202024-11-06%20141745.png', 1),
  ('Painel Fotografico', 'painel-fotografico', 'https://fotomural.com.br/version-test/files/style_photo/f_auto,q_auto/1729537032785x476673555682803700/WhatsApp%20Image%202024-10-21%20at%2015.25.04.jpeg', 2),
  ('Papel de Parede Personalizado', 'papel-de-parede-personalizado', 'https://fotomural.com.br/version-test/files/style_photo/f_auto,q_auto/1729537032785x476673555682803700/WhatsApp%20Image%202024-10-21%20at%2015.25.04.jpeg', 3),
  ('Ambientes', 'ambientes', 'https://fotomural.com.br/version-test/files/style_photo/f_auto,q_auto/1729537032785x476673555682803700/WhatsApp%20Image%202024-10-21%20at%2015.25.04.jpeg', 4)
on conflict (slug) do nothing;

insert into categories (name, slug, display_order) values
  ('Abstrato', 'abstrato', 1), ('Animais', 'animais', 2), ('Arco-iris', 'arco-iris', 3),
  ('Arvore e Cerejeira', 'arvore-e-cerejeira', 4), ('Astronauta e Espaco', 'astronauta-e-espaco', 5),
  ('Aviadores e Transportes', 'aviadores-e-transportes', 6), ('Bailarina', 'bailarina', 7),
  ('Baloes', 'baloes', 8), ('Boho', 'boho', 9), ('Bolinhas', 'bolinhas', 10),
  ('Borboletas', 'borboletas', 11), ('Carrinhos', 'carrinhos', 12), ('Ceu', 'ceu', 13),
  ('Chinosiere', 'chinosiere', 14), ('Circo', 'circo', 15), ('Cortina de Flores', 'cortina-de-flores', 16),
  ('Degrade', 'degrade', 17), ('Desenhos', 'desenhos', 18), ('Dinossauro', 'dinossauro', 19),
  ('Esportes', 'esportes', 20), ('Fazendinha', 'fazendinha', 21), ('Flamingo', 'flamingo', 22),
  ('Floral', 'floral', 23), ('Floral Aquarela', 'floral-aquarela', 24), ('Floresta', 'floresta', 25),
  ('Geometrico', 'geometrico', 26), ('Listras', 'listras', 27), ('Mapa Mundi', 'mapa-mundi', 28),
  ('Maritimo', 'maritimo', 29), ('Natureza', 'natureza', 30),
  ('Painel Fotografico', 'painel-fotografico-cat', 31), ('Safari', 'safari', 32),
  ('Tropical', 'tropical', 33), ('Xadrez', 'xadrez', 34)
on conflict (slug) do nothing;
