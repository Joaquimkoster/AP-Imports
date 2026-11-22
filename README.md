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
npm run build
npm run preview
```

O build gera `dist/`. Essa pasta é recriada a partir do código e não deve ser editada manualmente. `node_modules/` contém as dependências instaladas; ambas as pastas são ignoradas pelo Git.

## Conteúdo

- `public/products.json`: cadastro exibido no catálogo. Preços ausentes permanecem como `null`.
- `public/images/`: logo, fotos da equipe e imagens dos produtos usados pelo site.
- `src/data/contact.js`: contatos da equipe e configuração do chatbot. Um número vazio mantém o chatbot como “Em breve”.
- `src/components/`: catálogo, busca, ordenação, detalhes dos produtos e atendimento.
- `artifacts/iphones-precos.json` e `artifacts/smartphones-precos.json`: referências, fontes e cálculos dos preços pesquisados.
- `artifacts/verificacao-catalogo.json`: histórico da conferência do catálogo.
- `artifacts/imagens-produtos.json`: origem das fotos do Compras Paraguai, fabricantes e outras lojas, além dos produtos que ainda precisam de identificação ou imagem correspondente.

Nos aparelhos documentados nesses históricos, o preço final é o preço-base do Compras Paraguai multiplicado por **1,20**, arredondado para centavos. As referências têm data de consulta e não são atualizadas automaticamente. Os demais produtos mantêm seus próprios preços cadastrados.

PDFs, CSVs, capturas de tela e prompts temporários em `artifacts/` não fazem parte do site e são ignorados pelo Git. Arquivos colocados em `public/` são copiados para `dist/`, por isso essa pasta deve conter apenas os recursos usados pela aplicação.
