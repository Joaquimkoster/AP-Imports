// Valores decimais são convertidos em inteiros antes de qualquer operação.
// A média permanece como fração até o arredondamento do preço final.
export function decimalUnits(value, places) {
  const text = String(value);
  if (!/^\d+(\.\d+)?$/.test(text)) throw new Error(`Valor decimal inválido: ${text}`);
  const [whole, fraction = ""] = text.split(".");
  if (fraction.length > places) throw new Error(`Precisão excedida: ${text}`);
  return BigInt(whole + fraction.padEnd(places, "0"));
}

export function exchangeMean(closings) {
  if (!Array.isArray(closings) || closings.length === 0) throw new Error("Cotações ausentes");
  const dates = new Set();
  const sum = closings.reduce((total, quote) => {
    if (!quote.date || dates.has(quote.date)) throw new Error("Data ausente ou repetida");
    dates.add(quote.date);
    const rate = decimalUnits(quote.sellBRL, 4);
    if (rate <= 0n) throw new Error("Cotação deve ser positiva");
    return total + rate;
  }, 0n);
  return { numerator: sum, denominator: BigInt(closings.length) * 10000n };
}

export function priceFromUSD({ amount, currency }, closings) {
  if (currency !== "USD") throw new Error("O preço-base deve estar explicitamente em USD");
  const cents = decimalUnits(amount, 2);
  if (cents <= 0n) throw new Error("Preço-base deve ser positivo");
  const mean = exchangeMean(closings);
  const numerator = cents * mean.numerator * 120n;
  const denominator = mean.denominator * 100n;
  // ROUND_HALF_UP, em centavos. O acréscimo de 20% ocorre uma única vez.
  const finalCents = (2n * numerator + denominator) / (2n * denominator);
  if (finalCents > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error("Preço excede o limite de precisão");
  return Number(finalCents) / 100;
}
