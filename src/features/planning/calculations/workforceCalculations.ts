/**
 * Calculates workforce satisfaction based on capacity and luxuries
 * following ingame logc
 * @author jplacht
 *
 * @export
 * @param {number} capacity Workforce available capacity
 * @param {number} required Required Workforce
 * @param {boolean} lux1 If Lux1 are provided
 * @param {boolean} lux2 If Lux2 are provided
 * @returns {number} Satisfaction
 */
export function calculateSatisfaction(
	capacity: number,
	required: number,
	lux1: boolean,
	lux2: boolean
): number {
	let satisfaction: number = 0;

	if (required > 0) {
		if (required < capacity) {
			satisfaction = 1;
		} else {
			satisfaction = capacity / required;
		}
	} else {
		satisfaction = 0;
	}

	let efficiency: number = 0;
	const baseEfficiency: number = 0.02 * (1 + 10 / 3) * (1 + 4) * (1 + 5 / 6);
	const lux1Efficiency: number = 1 + 1 / 11;
	const lux2Efficiency: number = 1 + 2 / 13;

	if (required > 0) {
		efficiency += baseEfficiency;
		if (lux1 == true && lux2 == true) {
			efficiency = efficiency * lux1Efficiency * lux2Efficiency;
		} else if (lux1 == true && lux2 == false) {
			efficiency = efficiency * lux1Efficiency;
		} else if (lux1 == false && lux2 == true) {
			efficiency = efficiency * lux2Efficiency;
		}
	}

	return satisfaction * efficiency;
}
