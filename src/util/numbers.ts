import numbro from "numbro";
import { number } from "zod";

/**
 * Formats Number as String of 0,0.00
 * @param {number} value numeric input
 * @returns {string} formatted number as string
 */
export function formatNumber(
	value: number,
	decimals: number = 2,
	optionalDecimals: boolean = false
): string {
	if (value == Infinity) {
		return "∞";
	}
	if (!optionalDecimals) {
		return numbro(value).format({
			thousandSeparated: true,
			mantissa: decimals,
		});
	} else {
		return numbro(value).format({
			thousandSeparated: true,
			optionalMantissa: true,
			mantissa: decimals,
		});
	}
}

/**
 * Formats a number representing an amount as String
 * with thousand separation.
 * @author jplacht
 *
 * @export
 * @param {number} value numeric input
 * @returns {string} formatted number as string
 */
export function formatAmount(value: number): string {
	if (value == Infinity) {
		return "∞";
	}
	return numbro(value).format({ thousandSeparated: true });
}

/**
 * Returns a number whose value is limited to given range
 * @author jplacht
 *
 * @export
 * @param {number} value Number
 * @param {number} min Min range limiter
 * @param {number} max Max range lmiter
 * @returns {number}
 */
export function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(value, max));
}
