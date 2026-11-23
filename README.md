# A&P Imports

Catálogo de produtos em React e Vite, com busca, filtros, paginação e atendimento pelo WhatsApp.

## Executar

Com uma versão do Node.js compatível com o Vite instalado:

```sh
npm ci
npm run dev
```

## Verificar e compilar

```sh
npm run lint
npm run test:pricing
npm run prices:check
npm run build
npm run preview
```

O build gera `dist/`. Essa pasta é recriada a partir do código e não deve ser editada manualmente. `node_modules/` contém as dependências instaladas; ambas as pastas são ignoradas pelo Git.

## Conteúdo

- `public/products.json`: cadastro exibido no catálogo. Preços ausentes permanecem como `null`.
- `public/images/`: logo, fotos da equipe e imagens dos produtos usados pelo site.
- `src/data/contact.js`: contatos da equipe e configuração do chatbot. Um número vazio mantém o chatbot como “Em breve”.
- `src/components/`: catálogo, busca, ordenação, detalhes dos produtos e atendimento.
- `artifacts/precificacao-usd-2026-11-23.json`: regra atual de preço, cotações oficiais, referências em USD, valores anteriores e pendências dos 247 produtos.
- `artifacts/precos-revisados-2026-11-23.csv`: planilha versionada com os valores anteriores, corrigidos e motivos das pendências.
- `artifacts/iphones-precos.json` e `artifacts/smartphones-precos.json`: referências, fontes e cálculos dos preços pesquisados.
- `artifacts/iphones-expansao-2026-11-23.json`: cobertura dos modelos e capacidades desde o iPhone 12 e fotografia da expansão. Sua precificação foi substituída pelo relatório atual.
- `artifacts/reajuste-cambial-2026-11-23.json`: fotografia do cálculo anterior, marcada como substituída; não aplicar novamente.
- `artifacts/verificacao-catalogo.json`: histórico da conferência do catálogo.
- `artifacts/imagens-produtos.json`: origem das fotos do Compras Paraguai, fabricantes e outras lojas, além dos produtos que ainda precisam de identificação ou imagem correspondente.

Em **23/11/2026**, os **247 produtos** foram revisados para usar exclusivamente:

```text
preço em BRL = ROUND_HALF_UP(preço original em USD × média PTAX de venda × 1,20; 2 casas)
```

A média é **R$ 5,621276923076923 por dólar**, calculada com os 13 fechamentos de **03 a 19/11/2026**, confirmados diretamente na [API oficial do Banco Central](https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados?formato=json&dataInicial=01/11/2026&dataFinal=19/11/2026). A fração exata `730766 / 130000` é preservada nos cálculos com inteiros, e o arredondamento comercial ocorre apenas no preço final. É uma média parcial de novembro, sem cotações intradiárias, mantida no mesmo intervalo da revisão anterior.

Há **188 preços confirmados em USD**. A referência do kit Kerasys é a soma documentada de um shampoo Volume de 600 mL e um tratamento Volume de 600 mL. Os outros **59 produtos ficam com `price: null` e sob consulta**, pois falta referência USD confiável ou identificação da apresentação correspondente. Isso inclui 30 registros que tinham preço sem essa comprovação; os valores anteriores permanecem no relatório. Uma fonte em reais, euros ou guaranis não é interpretada como USD.

O campo `basePriceUSD` registra a base original, `exchangeRateBRL` registra a média usada, `markupPercent: 20` identifica o acréscimo e `priceSource.referenceCurrency: "USD"` registra a moeda da referência. Os antigos `originalPrice` em BRL e `exchangeAdjustmentPercent` foram removidos. Não há acréscimo extra de 3,69%, reconversão de BRL nem inferência de USD a partir do preço anterior.

O catálogo continua com **98 combinações de modelo/capacidade em 30 modelos de iPhone**, desde a família 12, incluindo mini, Plus, Pro, Pro Max, SE de 3ª geração, 16e, 17e, Air e Duo. Condições comerciais estão indicadas quando identificadas; em quatro registros antes sem essa informação, Swap/Grade A+ foi explicitado a partir da oferta. Mínimos de outros aparelhos, volumes, refis, defeitos e bloqueios foram rejeitados. Fotos podem ilustrar capacidades diferentes do mesmo modelo, conforme o histórico de imagens. Contato com a equipe não garante estoque.

As referências são estáticas. Para reproduzir os preços usando somente as bases USD documentadas, execute `npm run prices:apply`; reaplicar não acumula margem ou câmbio. `npm run prices:check` confere todo o catálogo contra o relatório e `npm run test:pricing` verifica moeda, média, arredondamento e rejeição de entradas inválidas. Novas consultas exigem atualizar as referências e o relatório antes da aplicação.

PDFs, CSVs, capturas de tela e prompts temporários em `artifacts/` não fazem parte do site e são ignorados pelo Git, com exceção da planilha de preços revisados indicada acima. Arquivos colocados em `public/` são copiados para `dist/`, por isso essa pasta deve conter apenas os recursos usados pela aplicação.
