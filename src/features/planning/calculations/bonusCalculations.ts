/**
 * Static, ingame expert bonus values
 * @author jplacht
 *
 * @type {Record<number, number>}
 */
const expertBonus: Record<number, number> = {
	0: 0,
	1: 0.0306,
	2: 0.0696,
	3: 0.1248,
	4: 0.1974,
	5: 0.284,
};

/**
 * Returns the expert bonus value on given expert amount.
 * Will return 0 if an out-of-range expert amount (0-5) passed.
 * @author jplacht
 *
 * @export
 * @param {number} amount Expert Amount
 * @returns {number} Expert Bonus
 */
export function calculateExpertBonus(amount: number): number {
	if (Object.keys(expertBonus).includes(amount.toString())) {
		return expertBonus[amount];
	}

	return 0;
}
