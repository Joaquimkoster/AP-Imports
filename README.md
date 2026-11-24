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

- `public/products.json`: cadastro exibido no catálogo, com 242 produtos com preço e imagem. Produtos sem oferta/preço confirmado foram retirados.
- `public/images/`: logo, fotos da equipe e imagens dos produtos usados pelo site.
- `src/data/contact.js`: contatos da equipe e configuração do chatbot. Um número vazio mantém o chatbot como “Em breve”.
- `src/components/`: catálogo, busca, ordenação, detalhes dos produtos e atendimento.
- `scripts/pricing-policy.json`: política atual de venda, com acréscimo padrão de 30%, cinco preços fixos das imagens enviadas pelo usuário e os 59 IDs retirados do catálogo.
- `artifacts/precificacao-usd-2026-11-23.json`: referências em USD, cotações, pendências e histórico da revisão dos 247 produtos com acréscimo de 20% em 23/11. Os valores finais desse relatório são históricos; a política atual está em `scripts/pricing-policy.json`.
- `artifacts/expansao-catalogo-2026-11-24.json`: referências em USD, preços calculados, lojas, fotos e hashes dos 54 produtos adicionados em 24/11. Complementa as referências originais e participa de `prices:apply` e `prices:check`.
- `artifacts/expansao-{notebooks,moda,saude,casa}-2026-11-24.json`: pesquisas por categoria, com ofertas exatas e origem das imagens.
- `artifacts/notebooks-{trabalho,gamer,premium}-adicionais-2026-11-24.json`: pesquisa dos 20 notebooks adicionais, com preços em USD e disponibilidade conferidos na seção principal de cada oferta, configuração e fotos documentadas.
- `artifacts/produtos-retirados-2026-11-24.json`: os 59 produtos retirados, seus motivos e uma cópia de cada cadastro para manter o histórico.
- `artifacts/revisao-iphones-pendentes-2026-11-24.json`: conferência dos 11 iPhones que estavam sem preço, com fontes consultadas e a decisão de retirada.
- `artifacts/pendencias-catalogo-2026-11-24.csv` e `.pdf`: lista atualizada das 10 roupas sem tamanho definido; PDF em uma página. Nenhum produto ativo está sem preço ou imagem.
- `artifacts/precos-revisados-2026-11-23.csv`: planilha histórica versionada com os valores da revisão de 23/11 e motivos das pendências.
- `artifacts/iphones-precos.json` e `artifacts/smartphones-precos.json`: referências, fontes e cálculos dos preços pesquisados.
- `artifacts/iphones-expansao-2026-11-23.json`: cobertura dos modelos e capacidades desde o iPhone 12 e fotografia da expansão. Sua precificação foi substituída pelo relatório atual.
- `artifacts/reajuste-cambial-2026-11-23.json`: fotografia do cálculo anterior, marcada como substituída; não aplicar novamente.
- `artifacts/verificacao-catalogo.json`: histórico da conferência do catálogo.
- `artifacts/imagens-produtos.json`: fotografia da revisão de imagens dos primeiros 247 produtos. A origem das fotos dos novos produtos está no relatório de expansão de 24/11.

Em **24/11/2026**, o acréscimo padrão passou de **20% para 30% sobre a base convertida**, elevando os preços anteriores em aproximadamente **8,33%**, com arredondamento apenas no resultado final:

```text
preço em BRL = ROUND_HALF_UP(preço original em USD × média PTAX de venda × 1,30; 2 casas)
```

Dos **242 produtos com preço**, **237 seguem essa fórmula**. Os outros **cinco têm preço fixo**, conforme as referências enviadas pelo usuário: Azzaro Pour Homme 200 ml a **R$ 350,00**, Rabanne 1 Million tradicional a **R$ 440,00**, Celimax Retinal Shot a **R$ 240,00**, 36 Horas 20 mg com 20 comprimidos a **R$ 99,00** e iPhone 18 Pro Max 256 GB a **R$ 9.500,00**. Esses valores substituem a fórmula padrão para os respectivos produtos. O reajuste aumentou os 188 preços anteriores; a expansão subsequente preservou esses valores e adicionou outros 54. Os 59 cadastros pendentes foram retirados por solicitação do usuário e seus IDs constam em `excludedProductIds` para manter as referências históricas fora do catálogo ativo.

O catálogo ativo tem **242 produtos**, após a expansão com 54 itens e a retirada dos 59 sem oferta/preço confirmado. A expansão inclui **30 notebooks**, **10 peças de roupa**, **6 itens de saúde** e **8 utilidades para casa** novos. Os notebooks têm categoria e filtro próprios; roupas entram em Moda, suplementos e dispositivos em Saúde e utilidades em Casa. Todos os novos produtos têm foto local, referência de custo em USD, loja e data de consulta. Configurações, tensões, capacidades, sabores e apresentações são explicitados quando confirmados; tamanhos de roupas não informados na oferta ficam para confirmação com a equipe. A disponibilidade indicada pelo fornecedor não comprova estoque próprio.

A média é **R$ 5,621276923076923 por dólar**, calculada com os 13 fechamentos de **03 a 19/11/2026**, confirmados diretamente na [API oficial do Banco Central](https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados?formato=json&dataInicial=01/11/2026&dataFinal=19/11/2026). A fração exata `730766 / 130000` é preservada nos cálculos com inteiros, e o arredondamento comercial ocorre apenas no preço final. É uma média parcial de novembro, sem cotações intradiárias, mantida no mesmo intervalo da revisão anterior.

Há **242 referências de custo confirmadas em USD**: 188 da revisão original e 54 da expansão. A referência do kit Kerasys é a soma documentada de um shampoo Volume de 600 mL e um tratamento Volume de 600 mL. Os **59 produtos sem referência USD confiável ou apresentação correspondente foram retirados**; os cadastros e os motivos permanecem no relatório de retiradas. Isso inclui 30 registros que tinham preço sem essa comprovação. Uma fonte em reais, euros ou guaranis não é interpretada como USD.

O campo `basePriceUSD` registra a base original, `exchangeRateBRL` registra a média usada e `priceSource.referenceCurrency: "USD"` registra a moeda da referência de custo. `pricingMethod: "markup"` com `markupPercent: 30` identifica a fórmula padrão; `pricingMethod: "fixed"`, `fixedPriceBRL` e `fixedPriceReason` identificam os preços de venda fixados pelas imagens, sem atribuir a eles o acréscimo padrão. `pricingUpdatedOn` registra a data do reajuste, preservando a data original da fonte USD em `priceSource.checkedOn`. Não há reconversão de BRL nem inferência de USD a partir do preço anterior.

O catálogo tem **87 combinações de modelo/capacidade em 29 modelos de iPhone**, desde a família 12, incluindo mini, Plus, Pro, Pro Max, SE de 3ª geração, 16e, 17e, Air e Duo. As 11 combinações sem preço foram retiradas. Condições comerciais estão indicadas quando identificadas; em quatro registros antes sem essa informação, Swap/Grade A+ foi explicitado a partir da oferta. Mínimos de outros aparelhos, volumes, refis, defeitos e bloqueios foram rejeitados. Fotos podem ilustrar capacidades diferentes do mesmo modelo, conforme o histórico de imagens. Contato com a equipe não garante estoque.

As referências são estáticas. Para reproduzir os preços usando as bases USD documentadas e a política de venda atual, execute `npm run prices:apply`; reaplicar não acumula acréscimos ou câmbio e não restaura produtos retirados. `npm run prices:check` confere todo o catálogo contra as referências e a política atual, incluindo as exclusões; `npm run test:pricing` verifica moeda, média, acréscimos explícitos, arredondamento e rejeição de entradas inválidas. Novas consultas exigem atualizar as referências e o relatório antes da aplicação. Para alterar o acréscimo ou os preços fixos, edite `scripts/pricing-policy.json` e reaplique a precificação.

PDFs, CSVs, capturas de tela e prompts temporários em `artifacts/` não fazem parte do site e são ignorados pelo Git, com exceção da planilha de preços revisados e dos relatórios CSV/PDF de pendências indicados acima. Arquivos colocados em `public/` são copiados para `dist/`, por isso essa pasta deve conter apenas os recursos usados pela aplicação.
