import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { exchangeMean, priceFromUSD } from "./pricing.mjs";

const root = new URL("../", import.meta.url);
const read = async path => JSON.parse(await readFile(new URL(path, root), "utf8"));
const report = await read("artifacts/precificacao-usd-2026-11-23.json");
const products = await read("public/products.json");
const references = new Map(report.products.map(row => [row.id, row]));
assert.equal(references.size, report.products.length, "IDs repetidos no relatório");
assert.equal(references.size, products.length, "Relatório não cobre todo o catálogo");
assert.equal(new Set(products.map(p => p.id)).size, products.length, "IDs repetidos no catálogo");
const mean = exchangeMean(report.exchangeRate.dailyClosings);
const meanBRL = Number(mean.numerator) / Number(mean.denominator);

const recalculated = products.map(product => {
  const reference = references.get(product.id);
  assert(reference, `Sem referência para ${product.id}`);
  const result = { ...product };
  // Eliminar as bases BRL e o antigo reajuste adicional para impedir conversão dupla.
  for (const key of ["originalPrice", "exchangeAdjustmentPercent", "basePriceUSD", "exchangeRateBRL", "markupPercent", "priceSource", "pricingStatus", "pricingNote", "pricingUpdatedOn"]) {
    delete result[key];
  }
  if (reference.catalogUpdates) Object.assign(result, reference.catalogUpdates);
  result.pricingUpdatedOn = report.checkedOn;
  if (reference.status === "verified") {
    const price = priceFromUSD({ amount: reference.referenceUSD, currency: reference.referenceCurrency }, report.exchangeRate.dailyClosings);
    assert.equal(price, reference.finalBRL, `Relatório com preço incorreto para ${product.id}`);
    result.price = price;
    result.basePriceUSD = Number(reference.referenceUSD);
    result.exchangeRateBRL = meanBRL;
    result.markupPercent = 20;
    result.pricingStatus = "verified";
    result.priceSource = {
      name: "Compras Paraguai",
      url: reference.source.url,
      checkedOn: reference.source.checkedOn,
      referenceCurrency: "USD",
      ...(reference.components ? { componentUrls: reference.components.map(p => p.url) } : {}),
    };
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
  console.log(`${products.length} produtos conferidos: conversão única USD → BRL, acréscimo de 20% e arredondamento final.`);
}
