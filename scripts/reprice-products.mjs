import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { decimalUnits, exchangeMean, priceFromUSD } from "./pricing.mjs";

const root = new URL("../", import.meta.url);
const read = async path => JSON.parse(await readFile(new URL(path, root), "utf8"));
const report = await read("artifacts/catalogo-compras-paraguai-2026-11-24.json");
const policy = await read("scripts/pricing-policy.json");
const products = await read("public/products.json");
const references = report.products;
const pendingReferences = report.pendingProducts ?? [];
const excludedIds = new Set(report.excludedProducts.map(row => row.id));
assert.equal(new Set([...references, ...pendingReferences].map(row => row.id)).size, references.length + pendingReferences.length, "IDs repetidos nas referências");
assert.deepEqual(policy.excludedProductIds, [...excludedIds].sort((a, b) => a - b), "Política e relatório divergem nas exclusões");
assert.deepEqual(policy.pendingProductIds ?? [], pendingReferences.map(row => row.id).sort((a, b) => a - b), "Política e relatório divergem nas pendências");
assert.equal(report.markupPercent, policy.defaultMarkupPercent, "Acréscimo do relatório diverge da política");
const mean = exchangeMean(report.exchangeRate.dailyClosings);
const meanBRL = Number(mean.numerator) / Number(mean.denominator);

const recalculated = [];
for (const reference of references) {
  const { id, source, photo, catalogProduct } = reference;
  assert.equal(reference.status, "verified", `Referência não confirmada para ${id}`);
  assert(!excludedIds.has(id), `Produto excluído nas referências ativas: ${id}`);
  assert.equal(catalogProduct.id, id, `Cadastro associado ao ID incorreto: ${id}`);
  assert.equal(catalogProduct.name, reference.name, `Nome divergente para ${id}`);
  assert.equal(reference.referenceCurrency, "USD", `Moeda não confirmada para ${id}`);
  assert(decimalUnits(reference.referenceUSD, 2) > 0n, `Base USD inválida para ${id}`);
  assert.match(source.url, /^https:\/\/www\.comprasparaguai\.com\.br\/[^/?#]+__\d+\/$/, `Oferta individual inválida para ${id}`);
  assert.equal(source.declaredCurrency, "USD", `Moeda da oferta inválida para ${id}`);
  assert.equal(source.availabilityVerifiedInMainSection, true, `Oferta indisponível para ${id}`);
  assert.equal(decimalUnits(source.visiblePriceUSD, 2), decimalUnits(reference.referenceUSD, 2), `Preço principal divergente para ${id}`);
  assert.match(source.htmlSha256, /^[a-f0-9]{64}$/, `Evidência da consulta ausente para ${id}`);
  assert.equal(source.checkedOn, report.checkedOn, `Data da consulta divergente para ${id}`);
  assert(source.title && source.storeName, `Identificação da oferta ausente para ${id}`);
  assert.equal(catalogProduct.image, photo.image, `Foto divergente para ${id}`);
  assert.match(photo.imageUrl, /\/site\/media\/fotos\/(?:produtos|modelos)\//, `Foto sem origem de produto para ${id}`);
  assert.match(photo.image, /^\/images\/products\/[\w.-]+\.(?:webp|avif|jpg|jpeg|png)$/, `Caminho de imagem inválido para ${id}`);
  const imageBytes = await readFile(new URL(`public${photo.image}`, root));
  assert.equal(createHash("sha256").update(imageBytes).digest("hex"), photo.sha256, `Foto alterada ou incorreta para ${id}`);
  const price = priceFromUSD({ amount: reference.referenceUSD, currency: "USD" }, report.exchangeRate.dailyClosings, policy.defaultMarkupPercent);
  assert.equal(price, reference.finalBRL, `Preço calculado diverge do relatório para ${id}`);
  if (catalogProduct.category === "medicamentos") {
    assert(catalogProduct.presentation, `Apresentação incompleta para ${id}`);
  }
  recalculated.push({
    ...catalogProduct,
    price,
    pricingUpdatedOn: policy.updatedOn,
    basePriceUSD: Number(reference.referenceUSD),
    exchangeRateBRL: meanBRL,
    markupPercent: policy.defaultMarkupPercent,
    pricingStatus: "verified",
    priceSource: {
      name: "Compras Paraguai",
      url: source.url,
      checkedOn: source.checkedOn,
      referenceCurrency: "USD",
      storeName: source.storeName,
    },
    pricingMethod: "markup",
  });
}

for (const reference of pendingReferences) {
  const { id, catalogProduct, photo } = reference;
  assert.equal(reference.status, "pending", `Pendência com situação incorreta: ${id}`);
  assert.equal(reference.referenceUSD, null, `Pendência com base inventada: ${id}`);
  assert.equal(reference.finalBRL, null, `Pendência com preço inventado: ${id}`);
  assert.equal(catalogProduct.id, id, `Cadastro pendente associado ao ID incorreto: ${id}`);
  assert(!excludedIds.has(id), `Produto pendente também excluído: ${id}`);
  if (photo) {
    assert.equal(catalogProduct.image, photo.image, `Foto pendente divergente para ${id}`);
    assert.match(photo.image, /^\/images\/products\/[\w.-]+\.(?:webp|avif|jpg|jpeg|png)$/);
    const bytes = await readFile(new URL(`public${photo.image}`, root));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), photo.sha256, `Foto pendente incorreta para ${id}`);
  } else {
    assert.equal(catalogProduct.image, null, `Foto pendente sem origem para ${id}`);
  }
  recalculated.push({
    ...catalogProduct,
    available: false,
    price: null,
    pricingUpdatedOn: policy.updatedOn,
    pricingStatus: "pending",
    pricingNote: "Preço e disponibilidade sob consulta.",
  });
}
recalculated.sort((a, b) => a.id - b.id);

if (process.argv.includes("--write")) {
  await writeFile(new URL("public/products.json", root), JSON.stringify(recalculated, null, 2) + "\n");
  console.log(`Catálogo atualizado: ${references.length} ofertas com acréscimo de ${policy.defaultMarkupPercent}% e ${pendingReferences.length} produtos sob consulta.`);
} else {
  assert.deepEqual(products, recalculated, "Catálogo diverge das ofertas verificadas. Execute npm run prices:apply.");
  console.log(`${products.length} produtos conferidos: ${references.length} ofertas com foto e acréscimo de ${policy.defaultMarkupPercent}%; ${pendingReferences.length} produtos sob consulta, sem preço inventado.`);
}
