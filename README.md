# A&P Imports

Catálogo em React e Vite, com busca, filtros, paginação, detalhes dos produtos e atendimento pelo WhatsApp.

## Executar

Com uma versão do Node.js compatível com o Vite instalado:

```sh
npm ci
npm run dev
```

## Conferir e compilar

```sh
npm run lint
npm run test:pricing
npm run prices:check
npm run build
npm run preview
```

O build recria `dist/`; essa pasta e `node_modules/` são ignoradas pelo Git.

## Produtos e preços

O catálogo usa exclusivamente ofertas do **Compras Paraguai** com preço em USD visível na seção principal, apresentação identificada e fotografia correspondente. A consulta de **24/11/2026** está documentada em `artifacts/catalogo-compras-paraguai-2026-11-24.json`. São **268 produtos ativos**, incluindo **30 notebooks** e **22 produtos recuperados** da retirada anterior. Todos têm preço calculado e imagem; permanecem sem definição na fonte os tamanhos de 10 roupas e a concentração de um produto. Esse é o registro atual de produtos, lojas, URLs individuais, valores em dólar, origem das fotos, hashes e exclusões. As pesquisas por categoria estão em `artifacts/reconciliacao-{medicamentos,perfumes,saude}-compras-paraguai-2026-11-24.json`.

Todos os produtos ativos seguem a mesma fórmula, inclusive os cinco itens que anteriormente tinham preços fixos:

```text
preço em BRL = ROUND_HALF_UP(preço em USD × média do dólar × 1,30; 2 casas)
```

A média preservada da revisão anterior é **R$ 5,621276923076923 por dólar**, usando os 13 fechamentos de 03 a 19/11/2026 documentados na [série oficial do Banco Central](https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados?formato=json&dataInicial=01/11/2026&dataFinal=19/11/2026). A fração exata `730766 / 130000` e os cálculos com inteiros evitam arredondamentos intermediários. Trata-se da média parcial já adotada; não é uma cotação em tempo real.

`scripts/pricing-policy.json` define o acréscimo de 30% e os IDs excluídos. `npm run prices:apply` gera `public/products.json` a partir do registro atual: reaplicar não acumula acréscimos e não recupera cadastros excluídos. `npm run prices:check` confere todo o catálogo, a moeda e o preço principal das ofertas, a fórmula, a integridade das imagens locais e a ausência de itens excluídos.

Não se usa preço antigo de uma página indisponível, valor de produto relacionado ou mínimo de outra capacidade. Nomes genéricos e atribuições incorretas de marca foram substituídos pela identificação da oferta confirmada. Nos medicamentos, concentração e apresentação descrevem o produto anunciado, sem inferir esquema de uso. Um antigo kit Kerasys montado a partir de dois anúncios foi substituído por shampoo e tratamento individuais. Condições de iPhones como Swap, CPO e Grade A são preservadas conforme cada anúncio; mudanças de oferta e condição estão registradas nas notas.

As referências são estáticas: oferta no comparador não comprova estoque próprio. Novas consultas exigem atualizar o registro antes de reaplicar os preços. Para mudar o acréscimo, atualize a política e os valores calculados do relatório de forma consistente antes da aplicação.

## Arquivos

- `public/products.json`: cadastro exibido no site, com base USD, câmbio, acréscimo, loja e URL de origem.
- `public/images/products/`: fotografias locais; sua origem e hash estão no registro atual.
- `src/components/`: catálogo, filtros, detalhes e atendimento.
- `src/data/contact.js`: contatos e configuração do chatbot.
- `artifacts/catalogo-compras-paraguai-2026-11-24.json`: registro atual e decisões de inclusão/exclusão.
- `artifacts/pendencias-catalogo-2026-11-24.csv` e `.pdf`: informações ainda não definidas nas ofertas, como tamanhos de roupas. Produtos ativos têm preço e imagem.

Os relatórios `precificacao-usd-2026-11-23.json`, `expansao-catalogo-2026-11-24.json`, `produtos-retirados-2026-11-24.json`, `imagens-produtos.json` e os demais relatórios anteriores são históricos. Seus totais, preços, critérios e decisões anteriores não substituem o registro atual. Produtos retirados anteriormente puderam retornar após confirmação de uma oferta correspondente.

PDFs, CSVs e capturas temporárias em `artifacts/` são ignorados pelo Git, exceto os relatórios de preços e pendências explicitamente versionados. Apenas recursos utilizados pelo site devem ficar em `public/`, pois essa pasta é copiada para o build.
