/**
 * Calculates the difference in minutes between two dates
 * @author jplacht
 *
 * @export
 * @param {(Date | undefined)} start Start Date
 * @param {Date | undefined } end End Date
 * @returns {number} Difference in minutes, 0 if one input is undefined
 */
export function getDifferenceMinutes(
	start: Date | undefined,
	end: Date | undefined
): number {
	if (!start || !end) {
		return 0;
	}

	return (start.getTime() - end.getTime()) / 1000 / 60;
}
