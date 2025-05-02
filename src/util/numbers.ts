import numbro from "numbro";

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
