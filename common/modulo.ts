/**
 * Since JS's `%` operator is a *Remainder* operator, and not a *Modulo* operator,
 * need to manually implement it instead.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder
 */
export function modulo(numerator: number, denominator: number) {
  return ((numerator % denominator) + denominator) % denominator;
}
