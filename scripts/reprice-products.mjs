import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { decimalUnits, exchangeMean, priceFromUSD } from "./pricing.mjs";

const root = new URL("../", import.meta.url);
const read = async path => JSON.parse(await readFile(new URL(path, root), "utf8"));
const report = await read("artifacts/precificacao-usd-2026-11-23.json");
const expansion = await read("artifacts/expansao-catalogo-2026-11-24.json");
const policy = await read("scripts/pricing-policy.json");
const products = await read("public/products.json");
assert.equal(expansion.exchangeRate.exactMean, report.exchangeRate.exactMean, "A expansão usa uma média cambial diferente das referências originais");
const referenceRows = [...report.products, ...expansion.products];
const allReferences = new Map(referenceRows.map(row => [row.id, row]));
assert.equal(allReferences.size, referenceRows.length, "IDs repetidos nos relatórios");
const excludedIds = new Set(policy.excludedProductIds ?? []);
assert.equal(excludedIds.size, (policy.excludedProductIds ?? []).length, "IDs repetidos nas exclusões");
for (const id of excludedIds) {
  assert(allReferences.has(id), `Exclusão sem referência histórica para ${id}`);
  assert(!products.some(product => product.id === id), `Produto retirado ainda está no catálogo: ${id}`);
}
const references = new Map(referenceRows.filter(row => !excludedIds.has(row.id)).map(row => [row.id, row]));
assert.equal(references.size, products.length, "Relatório não cobre todo o catálogo");
assert.equal(new Set(products.map(p => p.id)).size, products.length, "IDs repetidos no catálogo");
const mean = exchangeMean(report.exchangeRate.dailyClosings);
const meanBRL = Number(mean.numerator) / Number(mean.denominator);
for (const id of Object.keys(policy.fixedPrices)) {
  assert.equal(references.get(Number(id))?.status, "verified", `Preço fixo sem referência USD para ${id}`);
}

const recalculated = products.map(product => {
  const reference = references.get(product.id);
  assert(reference, `Sem referência para ${product.id}`);
  const result = { ...product };
  // Eliminar as bases BRL e o antigo reajuste adicional para impedir conversão dupla.
  for (const key of ["originalPrice", "exchangeAdjustmentPercent", "basePriceUSD", "exchangeRateBRL", "markupPercent", "priceSource", "pricingStatus", "pricingNote", "pricingUpdatedOn", "pricingMethod", "fixedPriceBRL", "fixedPriceReason"]) {
    delete result[key];
  }
  if (reference.catalogUpdates) Object.assign(result, reference.catalogUpdates);
  result.pricingUpdatedOn = policy.updatedOn;
  if (reference.status === "verified") {
    const base = { amount: reference.referenceUSD, currency: reference.referenceCurrency };
    // Conferir cada relatório com o acréscimo registrado antes de aplicar a política atual.
    assert.equal(priceFromUSD(base, report.exchangeRate.dailyClosings, reference.markupPercent), reference.finalBRL, `Relatório com preço incorreto para ${product.id}`);
    const fixedPrice = policy.fixedPrices[product.id];
    if (fixedPrice) {
      assert.equal(fixedPrice.name, result.name, `Preço fixo associado ao produto incorreto: ${product.id}`);
      const cents = decimalUnits(fixedPrice.amountBRL, 2);
      assert(cents > 0n && cents <= BigInt(Number.MAX_SAFE_INTEGER), `Preço fixo inválido para ${product.id}`);
      result.price = Number(cents) / 100;
    } else {
      result.price = priceFromUSD(base, report.exchangeRate.dailyClosings, policy.defaultMarkupPercent);
    }
    result.basePriceUSD = Number(reference.referenceUSD);
    result.exchangeRateBRL = meanBRL;
    if (!fixedPrice) result.markupPercent = policy.defaultMarkupPercent;
    result.pricingStatus = "verified";
    result.priceSource = {
      name: "Compras Paraguai",
      url: reference.source.url,
      checkedOn: reference.source.checkedOn,
      referenceCurrency: "USD",
      ...(reference.source.storeName ? { storeName: reference.source.storeName } : {}),
      ...(reference.components ? { componentUrls: reference.components.map(p => p.url) } : {}),
    };
    result.pricingMethod = fixedPrice ? "fixed" : "markup";
    if (fixedPrice) {
      result.fixedPriceBRL = result.price;
      result.fixedPriceReason = fixedPrice.reason;
    }
  } else {
    assert.equal(reference.status, "pending", "Situação desconhecida");
    assert.equal(reference.finalBRL, null, "Pendência com preço inventado");
    result.price = null;
    result.pricingStatus = "pending";
    result.pricingNote = "Preço e disponibilidade sob consulta.";
  }
  return result;
});

if (process.argv.includes("--write")) {
  await writeFile(new URL("public/products.json", root), JSON.stringify(recalculated, null, 2) + "\n");
  console.log(`Catálogo atualizado: ${recalculated.length} produtos. Referências USD preservadas; reaplicar não acumula acréscimos.`);
} else {
  assert.deepEqual(products, recalculated, "Catálogo diverge da precificação. Execute npm run prices:apply.");
  console.log(`${products.length} produtos conferidos: conversão única USD → BRL, acréscimo padrão de ${policy.defaultMarkupPercent}%, ${Object.keys(policy.fixedPrices).length} preços fixos e arredondamento final.`);
}
