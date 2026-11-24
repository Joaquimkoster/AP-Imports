import assert from "node:assert/strict";
import test from "node:test";
import { exchangeMean, priceFromUSD } from "./pricing.mjs";

const values = ["5.4935", "5.4778", "5.4621", "5.5013", "5.5146", "5.5840", "5.5606", "5.6143", "5.6518", "5.7324", "5.7851", "5.8102", "5.8889"];
const dates = [3, 4, 5, 6, 9, 10, 11, 12, 13, 16, 17, 18, 19];
const quotes = values.map((sellBRL, i) => ({ date: `2026-11-${String(dates[i]).padStart(2, "0")}`, sellBRL }));

test("reproduz os 20% do relatório histórico", () => {
  assert.equal(priceFromUSD({ amount: "210.00", currency: "USD" }, quotes, 20), 1416.56);
  assert.equal(priceFromUSD({ amount: "100.00", currency: "USD" }, quotes, 20), 674.55);
});

test("aplica os 30% atuais diretamente à base USD, sem acumular os 20% anteriores", () => {
  assert.equal(priceFromUSD({ amount: "210.00", currency: "USD" }, quotes, 30), 1534.61);
  assert.equal(priceFromUSD({ amount: "100.00", currency: "USD" }, quotes, 30), 730.77);
});

test("mantém a média exata e arredonda apenas o preço final", () => {
  assert.deepEqual(exchangeMean(quotes), { numerator: 730766n, denominator: 130000n });
  assert.equal(priceFromUSD({ amount: "100000.00", currency: "USD" }, quotes, 30), 730766);
});

test("meio centavo é arredondado para cima, sem erro de ponto flutuante", () => {
  assert.equal(priceFromUSD({ amount: "1.00", currency: "USD" }, [{ date: "2026-11-19", sellBRL: "1.05" }], 30), 1.37);
});

test("rejeita reais, euros, símbolos e preços sem moeda em vez de reconvertê-los", () => {
  for (const currency of ["BRL", "EUR", undefined]) {
    assert.throws(() => priceFromUSD({ amount: "210.00", currency }, quotes, 30), /explicitamente em USD/);
  }
  for (const amount of [null, "US$ 210", "1,20", "-1", "0", "NaN", "1.001"]) {
    assert.throws(() => priceFromUSD({ amount, currency: "USD" }, quotes, 30));
  }
});

test("exige acréscimo explícito e rejeita percentuais inválidos", () => {
  for (const markup of [undefined, null, -1, "30%", "0.001", "NaN"]) {
    assert.throws(() => priceFromUSD({ amount: "100.00", currency: "USD" }, quotes, markup));
  }
});

test("rejeita série vazia, taxas inválidas e dias duplicados", () => {
  assert.throws(() => exchangeMean([]));
  assert.throws(() => exchangeMean([{ date: "2026-11-19", sellBRL: "0" }]));
  assert.throws(() => exchangeMean([quotes[0], quotes[0]]));
});
